// Fees and taxes on the server (row 19, thue-phi): read a company's fee schedule and save it in one go. Every statement
// runs through the identity module's door, withCompany, under the API role: migration 012's row rules keep each company
// to its own rows and the permission table to readFeeSchedule and setFeeSchedule. The table keeps only what a company
// changed or added; nothing is deleted — resetting an item or removing one records who and when.
import type { DbClient } from "@/modules/identity/server";

import { label } from "./index";
import {
  DEFAULT_OWN_ITEM,
  LAW_FEE_ITEMS,
  checkFeeDraft,
  defaultFeeSchedule,
  type FeeItemDraft,
  type FeeItemKind,
  type FeeProblem,
} from "./fee-schedule";
import type { RunAs } from "./store";

/** Where an item's current value comes from, for the source line of each row. */
export type FeeItemSource =
  | { kind: "default" }
  | { kind: "changed"; by: string; at: string }
  | { kind: "added"; by: string; at: string };

export interface FeeItemView {
  code: string;
  kind: FeeItemKind;
  /** The display name: a law item's and the untouched default's come from ontology/labels.yaml. */
  name: string;
  rateBasisPoints: number;
  included: boolean;
  /** The default rate and inclusion, so the screen can offer the reset. Null for an added item. */
  defaults: { rateBasisPoints: number; included: boolean; name: string } | null;
  source: FeeItemSource;
}

export interface FeeScheduleView {
  items: FeeItemView[];
}

interface Row {
  id: string;
  code: string;
  kind: FeeItemKind;
  name: string | null;
  rate_bp: number;
  included: boolean;
  removed: boolean;
  position: number;
  changed_by_name: string;
  changed_at: Date;
}

/** The rows of one statement, typed as the statement selects them. */
async function rowsOf<T>(
  client: DbClient,
  text: string,
  params?: unknown[],
): Promise<{ rows: T[] }> {
  const r = await client.query(text, params);
  return { rows: r.rows as T[] };
}

const DEFAULT_CODES = [...LAW_FEE_ITEMS.map((l) => l.code), DEFAULT_OWN_ITEM.code] as string[];

function defaultName(code: string): string {
  const law = LAW_FEE_ITEMS.find((l) => l.code === code);
  if (law) return label(law.concept);
  if (code === DEFAULT_OWN_ITEM.code) return label(DEFAULT_OWN_ITEM.concept);
  return "";
}

async function liveRows(client: DbClient): Promise<Row[]> {
  const r = await rowsOf<Row>(
    client,
    `select id::text, code, kind, name, rate_bp, included, removed, position, changed_by_name, changed_at
       from company_fee_items where retired_at is null order by position, id`,
  );
  return r.rows;
}

/** The schedule from the live rows: law items first, then own items in their order; removed items are left out. */
function viewOf(rows: readonly Row[]): FeeItemView[] {
  const byCode = new Map(rows.map((r) => [r.code, r]));
  const defaults = new Map(defaultFeeSchedule().map((d) => [d.code, d]));
  const toView = (code: string, r: Row | undefined): FeeItemView => {
    const d = defaults.get(code);
    const dflt = d
      ? { rateBasisPoints: d.rateBasisPoints, included: d.included, name: defaultName(code) }
      : null;
    if (!r) {
      return {
        code,
        kind: d!.kind,
        name: dflt!.name,
        rateBasisPoints: dflt!.rateBasisPoints,
        included: dflt!.included,
        defaults: dflt,
        source: { kind: "default" },
      };
    }
    const at = r.changed_at.toISOString();
    return {
      code,
      kind: r.kind,
      name: r.name ?? defaultName(code),
      rateBasisPoints: r.rate_bp,
      included: r.included,
      defaults: dflt,
      source: dflt
        ? { kind: "changed", by: r.changed_by_name, at }
        : { kind: "added", by: r.changed_by_name, at },
    };
  };
  const law = LAW_FEE_ITEMS.map((l) => toView(l.code, byCode.get(l.code)));
  const own: { pos: number; id: number; view: FeeItemView }[] = [];
  const brokerage = byCode.get(DEFAULT_OWN_ITEM.code);
  if (!brokerage) own.push({ pos: 0, id: 0, view: toView(DEFAULT_OWN_ITEM.code, undefined) });
  for (const r of rows) {
    if (r.kind !== "Own" || r.removed) continue;
    own.push({ pos: r.position, id: Number(r.id), view: toView(r.code, r) });
  }
  own.sort((a, b) => a.pos - b.pos || a.id - b.id);
  return [...law, ...own.map((o) => o.view)];
}

/** The fee schedule of the company of the session: defaults for every item it has not changed. */
export async function readFeeSchedule(run: RunAs): Promise<FeeScheduleView> {
  return run(async (client) => ({ items: viewOf(await liveRows(client)) }));
}

export type FeeSaveResult =
  { ok: true; schedule: FeeScheduleView } | { ok: false; problems: FeeProblem[] };

interface Desired {
  code: string;
  kind: FeeItemKind;
  name: string | null;
  rateBasisPoints: number;
  included: boolean;
  removed: boolean;
  position: number;
}

/**
 * Saves a whole schedule in one transaction as `userId`: only items whose value differs from what is in use get a new
 * row (with who and when); an item back at its default retires its row; an own item left out of the draft is removed.
 * The draft is checked with the same rules as the screen; nothing is written when one item is wrong.
 */
export async function saveFeeSchedule(
  run: RunAs,
  userId: string,
  draft: readonly FeeItemDraft[],
): Promise<FeeSaveResult> {
  return run(async (client) => {
    await client.query(
      `select pg_advisory_xact_lock(hashtextextended('company_fee_items:' || current_setting('app.company_id', true), 0))`,
    );
    const rows = await liveRows(client);
    const current = viewOf(rows);
    const known = new Set(current.filter((i) => i.kind === "Own").map((i) => i.code));
    const names = new Map(current.map((i) => [i.code, i.name]));
    const problems = checkFeeDraft(draft, known, (code) => names.get(code) ?? defaultName(code));
    if (problems.length > 0) return { ok: false, problems };

    const me = await rowsOf<{ name: string }>(
      client,
      `select name from company_members where user_id::text = current_setting('app.user_id', true)`,
    );
    const myName = me.rows[0]?.name ?? "—";

    // What every code should be after the save.
    const desired = new Map<string, Desired>();
    const allRows = await rowsOf<{ position: number }>(
      client,
      `select position from company_fee_items`,
    );
    let lastPosition = allRows.rows.reduce((m, r) => Math.max(m, r.position), 0);
    const positionOf = new Map(rows.map((r) => [r.code, r.position]));
    let next = 1;
    const taken = await rowsOf<{ code: string }>(client, `select code from company_fee_items`);
    const usedCodes = new Set(taken.rows.map((t) => t.code));
    for (const d of draft) {
      const law = LAW_FEE_ITEMS.find((l) => l.code === d.code);
      if (law) {
        desired.set(law.code, {
          code: law.code,
          kind: "Law",
          name: null,
          rateBasisPoints: law.rateBasisPoints,
          included: d.included,
          removed: false,
          position: 0,
        });
        continue;
      }
      let code = d.code;
      if (code === undefined) {
        while (usedCodes.has("k" + next)) next += 1;
        code = "k" + next;
        usedCodes.add(code);
      }
      const trimmed = d.name?.trim();
      const name = trimmed && trimmed !== defaultName(code) ? trimmed : null;
      desired.set(code, {
        code,
        kind: "Own",
        name: code === DEFAULT_OWN_ITEM.code ? name : (trimmed ?? names.get(code) ?? null),
        rateBasisPoints: d.rateBasisPoints,
        included: d.included,
        removed: false,
        // Order is the order of adding: an item keeps its place, a new one goes last.
        position: d.code === undefined ? ++lastPosition : (positionOf.get(code) ?? 0),
      });
    }
    for (const item of current) {
      if (item.kind === "Own" && !desired.has(item.code)) {
        desired.set(item.code, {
          ...toDesired(item),
          removed: true,
          position: positionOf.get(item.code) ?? 0,
        });
      }
    }

    const live = new Map(rows.map((r) => [r.code, r]));
    const dflt = new Map(defaultFeeSchedule().map((d) => [d.code, d]));
    for (const want of desired.values()) {
      const row = live.get(want.code);
      const d = dflt.get(want.code);
      const atDefault =
        d !== undefined &&
        !want.removed &&
        want.name === null &&
        want.rateBasisPoints === d.rateBasisPoints &&
        want.included === d.included;
      const same =
        row !== undefined &&
        row.name === want.name &&
        row.rate_bp === want.rateBasisPoints &&
        row.included === want.included &&
        row.removed === want.removed;
      if (same) continue;
      const added = !DEFAULT_CODES.includes(want.code);
      if (row && (atDefault || (want.removed && added))) {
        // Back to its default, or an added item taken out: the row stops being used, with who and when. An added
        // item's code is never used again.
        await client.query(
          `update company_fee_items set retired_at = now(), retired_by = current_setting('app.user_id', true)::uuid
            where id = $1`,
          [row.id],
        );
      } else if (row) {
        await client.query(
          `update company_fee_items
              set name = $2, rate_bp = $3, included = $4, removed = $5, changed_at = now(),
                  changed_by = current_setting('app.user_id', true)::uuid, changed_by_name = $6
            where id = $1`,
          [row.id, want.name, want.rateBasisPoints, want.included, want.removed, myName],
        );
      } else if (!atDefault && !(want.removed && added)) {
        await client.query(
          `insert into company_fee_items
             (company_id, code, kind, name, rate_bp, included, removed, position, changed_by, changed_by_name)
           values (current_setting('app.company_id', true)::uuid, $1, $2, $3, $4, $5, $6, $7,
                   current_setting('app.user_id', true)::uuid, $8)`,
          [
            want.code,
            want.kind,
            want.name,
            want.rateBasisPoints,
            want.included,
            want.removed,
            want.position,
            myName,
          ],
        );
      }
    }
    return { ok: true, schedule: { items: viewOf(await liveRows(client)) } };
  });
}

function toDesired(item: FeeItemView): Desired {
  return {
    code: item.code,
    kind: item.kind,
    name: item.source.kind === "default" ? null : item.name,
    rateBasisPoints: item.rateBasisPoints,
    included: item.included,
    removed: false,
    position: 0,
  };
}
