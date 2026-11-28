import "server-only";

// The import on the server (row 11, nhap-excel): preview, open, write a batch, undo, recent imports. Every function runs
// inside one withCompany transaction of the caller; the marks are the same pure functions the screen uses, computed
// again here so the numbers written are the numbers shown. A batch carries 200 rows at most and is written once.
import { createHash } from "node:crypto";

import {
  addCompanyUnitCode,
  readCatalogUnitsByKey,
  retireCompanyUnitCode,
} from "@/modules/catalog/server";
import { fold, label, templateSignature, type FieldDraft } from "@/modules/company-config";
import {
  learnFromImport,
  lookupInCompany,
  readLayer,
  retireLearned,
  type LearnedIds,
  type RunAs,
  type TemplateTarget,
} from "@/modules/company-config/server";
import {
  createListings,
  removeImportListings,
  type NewListing,
  type Queryable,
} from "@/modules/listings/server";

import { markCatalogDiffers } from "./catalog-differs";
import type { LearnedConcept, LearnedItem } from "./learned";
import { markValue, valueKey, type CellMark, type Choices, type UnitFound } from "./mark";
import { markTable, type MarkedTable } from "./table";
import {
  FILE_VALUE_OF,
  STANDARD_HEADER_CONCEPTS,
  TEMPLATE_FIELD,
  type StandardTarget,
  type Target,
} from "./targets";

export const BATCH_ROWS = 200;

export interface ImportTable {
  headers: string[];
  rows: string[][];
}

/**
 * A cell kept as written on the import: its place in the file, its text as written and why it was kept. `value` is
 * what the preview showed for it when it showed one (read by the machine, or the person's answer), so nothing the
 * preview promised is lost even where the cell has no place on the listing (ruling G-2811-78, after VP11 S4-r8 t7).
 * An asked cell has none. Added beside `raw`, never instead of it.
 */
export interface Kept {
  row: number;
  header: string;
  raw: string;
  why: string;
  value?: string | number | boolean;
}

/** A kept cell, with the preview's value when the cell has one. */
function keptCell(row: number, header: string, raw: string, why: string, cell: CellMark): Kept {
  return cell.value === null
    ? { row, header, raw, why }
    : { row, header, raw, why, value: cell.value };
}

export interface StoredLearned extends LearnedIds {
  unitCodeIds: string[];
  /** What the last batch said was learned, kept so a retry of that batch answers the same (S4-r3 t8). */
  items?: LearnedItem[];
}

/**
 * A RunAs on the caller's transaction where every store call sits in its own savepoint: the company-layer store turns a
 * refused write (an item the company already has) into a result instead of an error, which would otherwise leave the
 * whole import's transaction aborted.
 */
export function savepointRun(c: Queryable): RunAs {
  let n = 0;
  return async (fn) => {
    const name = `nhap_${(n += 1)}`;
    await c.query(`savepoint ${name}`);
    const result = await fn(c as never);
    try {
      await c.query(`release savepoint ${name}`);
    } catch {
      await c.query(`rollback to savepoint ${name}`);
    }
    return result;
  };
}

const today = () => new Date(Date.now() + 7 * 3600 * 1000).toISOString().slice(0, 10);

/** The listing id of one row of one import: the same row sent again gets the same id, so a resend never doubles it. */
export function listingIdOf(runId: string, row: number): string {
  const h = createHash("sha256").update(`${runId}:${row}`).digest("hex");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-4${h.slice(13, 16)}-8${h.slice(17, 20)}-${h.slice(20, 32)}`;
}

const unitAt = (t: MarkedTable) =>
  t.columns.find((c) => c.target && "standard" in c.target && c.target.standard === "unitCode")
    ?.index ?? -1;

/** What the server knows for the marks: the layer, every unit code looked up, the units already listed. */
async function context(c: Queryable, table: ImportTable, choices: Choices) {
  const run: RunAs = (fn) => fn(c as never);
  const layer = await readLayer(run);
  const probe = markTable(
    table,
    { layer, today: today(), units: new Map(), listed: new Set() },
    choices,
  );
  const at = unitAt(probe);
  const units = new Map<string, UnitFound>();
  if (at >= 0)
    for (const raw of new Set(table.rows.map((r) => (r[at] ?? "").trim()).filter(Boolean))) {
      const f = fold(raw);
      if (units.has(f)) continue;
      const found = await lookupInCompany(run, raw);
      units.set(
        f,
        !found
          ? { kind: "none" }
          : found.source === "pending"
            ? found.unitKey
              ? { kind: "catalog", via: "company", unitKeys: [found.unitKey] }
              : { kind: "pending", pendingUnitId: found.pendingId }
            : found.unitKeys.length === 0
              ? { kind: "none" }
              : { kind: "catalog", via: found.source, unitKeys: found.unitKeys },
      );
    }
  const listed = new Set<string>();
  const { rows } = await c.query(
    // A pending unit matched to the catalog since keeps its open listings on the pending link: they count for its
    // catalog unit too, so the unit never gets a second open listing (Listing rule one-open-listing; S4-r2 t4).
    `select u.unit_key as id from listing_units l join catalog_units u on u.upi = l.upi where l.open
     union all select p.pending_unit_id::text from listing_pending_units p where p.open
     union all select cpu.unit_key from listing_pending_units p
       join company_pending_units cpu on cpu.id = p.pending_unit_id
      where p.open and cpu.unit_key is not null`,
  );
  for (const r of rows as { id: string }[]) listed.add(r.id);
  return { layer, units, listed };
}

/**
 * The name of the list agent who keeps the imported units: a list agent of the company through
 * app.import_list_agents() — the owner's choice of 2026-11-17 for team leads (migration 016): names only, list agents
 * only, the current company only — or one's own name (one's own member row is readable). Null otherwise.
 */
export async function agentName(
  c: Queryable,
  self: string | null,
  agent: string,
): Promise<string | null> {
  const listed = (
    await c.query(`select name from app.import_list_agents() where user_id = $1`, [agent])
  ).rows[0] as { name: string } | undefined;
  if (listed) return listed.name;
  const own = (
    await c.query(
      `select name from company_members where user_id = $1 and 'ListAgent' = any (roles)
         and ($2::uuid is null or user_id = $2::uuid)`,
      [agent, self],
    )
  ).rows[0] as { name: string } | undefined;
  return own?.name ?? null;
}

export async function previewImport(
  c: Queryable,
  table: ImportTable,
  choices: Choices,
): Promise<MarkedTable> {
  const ctx = await context(c, table, choices);
  const marked = markTable(table, { ...ctx, today: today() }, choices);
  return withCatalogDiffers(c, marked);
}

/** Row 3h (AC-8): the catalog units the preview's rows matched, read once, then the pure marking of table.ts. */
async function withCatalogDiffers(c: Queryable, marked: MarkedTable): Promise<MarkedTable> {
  const keys = marked.rows.flatMap((r) => (r.unit && "unitKey" in r.unit ? [r.unit.unitKey] : []));
  const units = await readCatalogUnitsByKey(c, keys);
  return markCatalogDiffers(marked, new Map(units.map((u) => [u.unitKey, u])));
}

/** Fingerprints that tie every batch to the table opened (migration 017): headers and choices, and each 200-row slice. */
export function tableHash(headers: readonly string[], choices: Choices): string {
  return createHash("sha256")
    .update(JSON.stringify([headers, choices]))
    .digest("hex");
}
export function batchHash(rows: readonly (readonly string[])[]): string {
  return createHash("sha256").update(JSON.stringify(rows)).digest("hex");
}
const slices = <T>(rows: readonly T[]) =>
  Array.from({ length: Math.ceil(rows.length / BATCH_ROWS) }, (_, b) =>
    rows.slice(b * BATCH_ROWS, (b + 1) * BATCH_ROWS),
  );

export type Counts = Record<"keep" | "fixed" | "ask" | "block" | "createCount", number>;

export type OpenResult =
  | { ok: true; id: string }
  | { ok: false; problem: "blocked-cells" | "counts-changed" | "bad-agent" };

/** Open an import after checking the whole file once more: no blocked cell, the counts the person saw. */
export async function openImport(
  c: Queryable,
  input: ImportTable & {
    fileName: string;
    sheetName: string | null;
    choices: Choices;
    expected: Counts;
  },
  people: { importedBy: string; listAgentUserId: string },
): Promise<OpenResult> {
  const marked = await previewImport(c, input, input.choices);
  if (!marked.canApply) return { ok: false, problem: "blocked-cells" };
  const got: Counts = { ...marked.counts, createCount: marked.createCount };
  if ((Object.keys(got) as (keyof Counts)[]).some((k) => got[k] !== input.expected[k]))
    return { ok: false, problem: "counts-changed" };
  if (!(await agentName(c, people.importedBy, people.listAgentUserId)))
    return { ok: false, problem: "bad-agent" };
  const id = createHash("sha256").update(`${Date.now()}:${Math.random()}`).digest("hex");
  const runId = `${id.slice(0, 8)}-${id.slice(8, 12)}-4${id.slice(13, 16)}-8${id.slice(17, 20)}-${id.slice(20, 32)}`;
  await c.query(
    `insert into import_runs (id, company_id, imported_by, list_agent_user_id, file_name, sheet_name, signature,
       row_count, learned, table_hash, batch_hashes)
     values ($1, app.current_company_id(), $2, $3, $4, $5, $6, $7, $8::jsonb, $9, $10)`,
    [
      runId,
      people.importedBy,
      people.listAgentUserId,
      input.fileName.slice(0, 200),
      input.sheetName,
      templateSignature(input.headers),
      input.rows.length,
      JSON.stringify({
        templateId: null,
        labelIds: [],
        fieldCodes: [],
        aliasIds: [],
        pendingUnits: [],
        unitCodeIds: [],
      }),
      tableHash(input.headers, input.choices),
      slices(input.rows).map(batchHash),
    ],
  );
  return { ok: true, id: runId };
}

interface RunRow {
  id: string;
  table_hash: string | null;
  batch_hashes: string[] | null;
  status: string;
  list_agent_user_id: string;
  file_name: string;
  batches_done: number[];
  learned: StoredLearned;
  kept: Kept[];
  created_count: number;
}

async function lockRun(c: Queryable, id: string): Promise<RunRow | null> {
  const { rows } = await c.query(
    `select id, status, list_agent_user_id, file_name, batches_done, learned, kept, created_count, table_hash,
            batch_hashes
       from import_runs where id::text = $1 for update`,
    [id],
  );
  return (rows[0] as RunRow | undefined) ?? null;
}

/** Where the value of a standard target goes when an import writes (ruling G-2811-65, after VP11's S4-r1). */
export type Destination =
  | { listing: keyof NewListing }
  | { kept: "unit-attribute" | "close-field" }
  | { unit: "code" | "building" };

/**
 * Every standard target has exactly one place: a column of the listing, kept as written on the import with its reason,
 * or the unit itself (its code, and the tower text of a new pending unit). A target with no place would be read on the
 * preview and lost on write; the Record makes the type check fail first, tests/nhap-excel-noi-ghi.test.ts second.
 * A listing an import makes is never Closed (row 4: Incomplete does not move to Closed), so close price and close date
 * have no place on it, and unit attributes never change the unit or the catalog (G-2711-4).
 */
export const DESTINATION: Record<StandardTarget, Destination> = {
  unitCode: { unit: "code" },
  "Unit.buildingName": { unit: "building" }, // on a pending unit the row creates; otherwise kept as unit-attribute
  "Unit.livingArea": { kept: "unit-attribute" },
  "Unit.bedroomsTotal": { kept: "unit-attribute" },
  "Unit.directionFaces": { kept: "unit-attribute" },
  "Unit.floor": { kept: "unit-attribute" },
  "Unit.propertySubType": { kept: "unit-attribute" },
  "Listing.listPrice": { listing: "listPrice" },
  "Listing.feeInclusion": { listing: "feeInclusion" },
  "Listing.standardStatus": { listing: "standardStatus" },
  "Listing.withdrawnReason": { listing: "withdrawnReason" },
  "Listing.closePrice": { kept: "close-field" },
  "Listing.closeDate": { kept: "close-field" },
  "Listing.furnished": { listing: "furnished" },
  "Listing.occupantType": { listing: "occupantType" },
  "Listing.legalStatus": { listing: "legalStatus" },
  "Listing.financing": { listing: "financing" },
  "Listing.lastConfirmedAt": { listing: "lastConfirmedAt" },
};

export type BatchResult =
  | { ok: true; created: number; done: boolean; learned?: LearnedItem[] }
  | { ok: false; problem: "not-found" | "closed" | "blocked-cells" | "table-changed" };

/**
 * Write one batch of an open import: the rows that become listings (new pending units first), the cells kept as
 * written. The last batch also writes what the import teaches and the values of the custom fields it created.
 */
export async function writeBatch(
  c: Queryable,
  runId: string,
  input: ImportTable & {
    batchNo: number;
    rowOffset: number;
    choices: Choices;
    last: boolean;
    allNewFieldCells?: Record<string, string>;
  },
): Promise<BatchResult> {
  const run = await lockRun(c, runId);
  if (!run) return { ok: false, problem: "not-found" };
  if (run.status === "undone") return { ok: false, problem: "closed" };
  // The batch is the slice of the table the person opened, at its own place, with the same headers and choices.
  const hashes = run.batch_hashes ?? [];
  if (
    run.table_hash !== tableHash(input.headers, input.choices) ||
    input.batchNo >= hashes.length ||
    input.rowOffset !== input.batchNo * BATCH_ROWS ||
    hashes[input.batchNo] !== batchHash(input.rows) ||
    input.last !== (input.batchNo === hashes.length - 1)
  )
    return { ok: false, problem: "table-changed" };
  // A batch already written (its answer lost on the way back) answers again what it wrote, never writes twice: the
  // screen's «Thử lại» then reaches Xong with the right count, even on the last batch (AC-7; S4-r3 t8).
  if (run.batches_done.includes(input.batchNo)) {
    const ids = input.rows.map((_, r) => listingIdOf(runId, input.rowOffset + r));
    const { rows } = await c.query(
      `select count(*)::int as n from listings where import_run_id::text = $1 and id::text = any($2)`,
      [runId, ids],
    );
    const created = (rows[0] as { n: number }).n;
    return {
      ok: true,
      created,
      done: input.last,
      ...(input.last ? { learned: run.learned.items ?? [] } : {}),
    };
  }
  if (run.status !== "open") return { ok: false, problem: "closed" };
  const runAs = savepointRun(c);
  // Rows the person left out are counted in the whole file; this batch reads them at its own place (S4-r1 t8).
  const skipRows = (input.choices.skipRows ?? [])
    .filter((r) => r >= input.rowOffset && r < input.rowOffset + input.rows.length)
    .map((r) => r - input.rowOffset);
  const marked = await previewImport(c, input, { ...input.choices, skipRows });
  if (marked.counts.block > 0) return { ok: false, problem: "blocked-cells" };
  const agentFullName = await agentName(c, null, run.list_agent_user_id);
  if (!agentFullName) return { ok: false, problem: "not-found" };
  const learned = run.learned;
  const kept: Kept[] = [];
  const items: NewListing[] = [];
  const buildingAt = marked.columns.find(
    (x) => x.target && "standard" in x.target && x.target.standard === "Unit.buildingName",
  )?.index;
  for (let r = 0; r < marked.rows.length; r += 1) {
    const outcome = marked.rows[r]!;
    const cells = marked.cells[r]!;
    marked.columns.forEach((col, j) => {
      const cell = cells[j]!;
      const raw = input.rows[r]![j] ?? "";
      const place =
        col.target && "standard" in col.target ? DESTINATION[col.target.standard] : null;
      const keptAs = place && "kept" in place ? place.kept : null;
      if (
        (cell.mark === "ask" && !(place && "unit" in place && place.unit === "code")) ||
        (keptAs && raw.trim() !== "")
      )
        kept.push(keptCell(input.rowOffset + r, col.header, raw, keptAs ?? cell.why, cell));
    });
    // The tower text has a place only on a pending unit this row creates; any other row keeps it as written, like the
    // unit attributes (VP11 S4-r7 t4: a unit that already exists took nothing of it, and the cell was lost).
    const buildingRaw = buildingAt === undefined ? "" : (input.rows[r]![buildingAt] ?? "");
    const keepBuilding = () => {
      if (
        buildingAt !== undefined &&
        buildingRaw.trim() !== "" &&
        cells[buildingAt]!.mark !== "ask"
      )
        kept.push(
          keptCell(
            input.rowOffset + r,
            marked.columns[buildingAt]!.header,
            buildingRaw,
            "unit-attribute",
            cells[buildingAt]!,
          ),
        );
    };
    if (outcome.fate !== "create" || !outcome.unit) {
      keepBuilding();
      continue;
    }
    let unit: NewListing["unit"];
    if ("unitKey" in outcome.unit) {
      keepBuilding();
      const u = (
        await c.query(`select upi from catalog_units where unit_key = $1`, [outcome.unit.unitKey])
      ).rows[0] as { upi: string };
      unit = { upi: u.upi };
    } else if ("pendingUnitId" in outcome.unit) {
      keepBuilding();
      unit = { pendingUnitId: outcome.unit.pendingUnitId };
    } else {
      const code = outcome.unit.newPending;
      const known = learned.pendingUnits.find((p) => fold(p.rawCode) === fold(code));
      if (known) {
        keepBuilding();
        unit = { pendingUnitId: known.id };
      } else {
        const building = buildingRaw.trim().slice(0, 80);
        // A tower text longer than the pending unit holds is also kept whole, as written.
        if (building !== buildingRaw.trim()) keepBuilding();
        const w = await learnFromImport(
          runAs,
          {
            template: null,
            labels: [],
            fields: [],
            aliases: [],
            pendingUnits: [{ rawCode: code, ...(building ? { buildingText: building } : {}) }],
          },
          [],
        );
        const made = w.pendingUnits[0];
        // The preview promised this listing: a pending unit the company layer refuses fails the batch, never drops the
        // row in silence (S4-r1 t10); the batch writes nothing and the screen offers to send it again.
        if (!made) throw new Error("import: pending unit refused");
        learned.pendingUnits.push(made);
        unit = { pendingUnitId: made.id };
      }
    }
    const l: NewListing = {
      id: listingIdOf(runId, input.rowOffset + r),
      unit,
      listAgentUserId: run.list_agent_user_id,
      listAgentFullName: agentFullName,
      standardStatus: "Incomplete",
      listPrice: null,
      feeInclusion: null,
      furnished: null,
      occupantType: null,
      withdrawnReason: null,
      legalStatus: null,
      financing: null,
      customFields: {},
      lastConfirmedAt: null,
    };
    marked.columns.forEach((col, j) => {
      const cell = cells[j]!;
      if (!col.target || cell.value === null || cell.mark === "ask") return;
      if ("custom" in col.target) l.customFields[col.target.custom] = cell.value;
      else if ("standard" in col.target) {
        // Row 3h (AC-7): a unit attribute read from the file is the listing's own value from a file; the cell is also
        // kept as written above, as before. A cell that asked (an unread «2PN») is not a value.
        const own = FILE_VALUE_OF[col.target.standard];
        if (own) l.fileValues = { ...l.fileValues, [own]: cell.value };
        const place = DESTINATION[col.target.standard];
        if ("listing" in place)
          (l as unknown as Record<string, unknown>)[place.listing] = cell.value;
        if (col.implies && l.feeInclusion === null) l.feeInclusion = col.implies.feeInclusion;
      }
    });
    items.push(l);
  }
  const company = (
    (await c.query(`select app.current_company_id()::text as id`)).rows[0] as { id: string }
  ).id;
  const done = await createListings(c, company, runId, items);
  let learnedWords: LearnedItem[] | undefined;
  if (input.last) {
    learnedWords = await learnAtEnd(c, runAs, runId, input, marked, learned);
    learned.items = learnedWords;
  }
  await c.query(
    `update import_runs set batches_done = array_append(batches_done, $2), created_count = created_count + $3,
       kept = kept || $4::jsonb, learned = $5::jsonb, status = case when $6 then 'done' else status end
     where id::text = $1`,
    [
      runId,
      input.batchNo,
      done.created.length,
      JSON.stringify(kept),
      JSON.stringify(learned),
      input.last,
    ],
  );
  return {
    ok: true,
    created: done.created.length,
    done: input.last,
    ...(learnedWords ? { learned: learnedWords } : {}),
  };
}

/** The last batch: custom fields, labels, spellings, unit codes and the template the person chose to keep. */
async function learnAtEnd(
  c: Queryable,
  run: RunAs,
  runId: string,
  input: ImportTable & { choices: Choices; allNewFieldCells?: Record<string, string> },
  marked: MarkedTable,
  learned: StoredLearned,
): Promise<LearnedItem[]> {
  const items: Record<LearnedConcept, string[]> = {
    ImportTemplate: [],
    CompanyLabel: [],
    CustomField: [],
    CompanyValueAlias: [],
    CompanyCatalogAlias: [],
    PendingUnit: [],
  };
  const fields: FieldDraft[] = [];
  for (const col of marked.columns)
    if (col.target && "newField" in col.target) fields.push({ ...col.target.newField });
  const newCodes = new Map<string, string>();
  const standardHeaders = STANDARD_HEADER_CONCEPTS.map((x) => label(x));
  const labels = marked.columns
    .filter((col) => col.learnLabel && col.target && "standard" in col.target)
    .map((col) => ({
      concept: conceptOf((col.target as { standard: StandardTarget }).standard),
      label: col.header.trim().slice(0, 40),
    }));
  const aliases: { field: string; raw: string; value: string }[] = [];
  for (const [key, v] of Object.entries(input.choices.values)) {
    if (!v.remember || v.value === null) continue;
    const [col, ...rest] = key.split("|");
    const t = marked.columns[Number(col)]?.target;
    if (!t) continue;
    const field = "standard" in t ? t.standard : "custom" in t ? t.custom : null;
    const raw =
      input.rows.flatMap((r) => [r[Number(col)] ?? ""]).find((x) => fold(x) === rest.join("|")) ??
      rest.join("|");
    if (field) aliases.push({ field, raw: raw.trim().slice(0, 40), value: v.value });
  }
  // One item a call, in the order fields, labels, spellings: an item the company already has is not learned, and the
  // name of each one learned is the one the person gave it.
  const none = { template: null, labels: [], fields: [], aliases: [], pendingUnits: [] };
  const fieldOf = (draft: FieldDraft, code: string) => newCodes.set(fold(draft.name), code);
  for (const f of fields) {
    const ids = await learnFromImport(run, { ...none, fields: [f] }, standardHeaders, fieldOf);
    learned.fieldCodes.push(...ids.fieldCodes);
    if (ids.fieldCodes.length) items.CustomField.push(f.name);
  }
  for (const l of labels) {
    const ids = await learnFromImport(run, { ...none, labels: [l] }, standardHeaders);
    learned.labelIds.push(...ids.labelIds);
    if (ids.labelIds.length) items.CompanyLabel.push(`«${l.label}»`);
  }
  for (const a of aliases.filter(
    (a) => !a.field.startsWith("Unit.") || a.field === "Unit.directionFaces",
  )) {
    const ids = await learnFromImport(run, { ...none, aliases: [a] }, standardHeaders);
    learned.aliasIds.push(...ids.aliasIds);
    if (ids.aliasIds.length) items.CompanyValueAlias.push(`«${a.raw}»`);
  }
  // Aliases of single choice fields this import created, now that their codes exist.
  for (const [key, v] of Object.entries(input.choices.values)) {
    const t = marked.columns[Number(key.split("|")[0])]?.target;
    if (!v.remember || v.value === null || !t || !("newField" in t)) continue;
    const code = newCodes.get(fold(t.newField.name));
    if (!code) continue;
    const raw = key.split("|").slice(1).join("|");
    const more = await learnFromImport(
      run,
      { ...none, aliases: [{ field: code, raw, value: v.value }] },
      [],
    );
    learned.aliasIds.push(...more.aliasIds);
    if (more.aliasIds.length) items.CompanyValueAlias.push(`«${raw}»`);
  }
  // Values of the custom fields created here, written onto this import's listings without a new version.
  for (const [cellKey, raw] of Object.entries(input.allNewFieldCells ?? {})) {
    const [row, col] = cellKey.split(":").map(Number);
    const t = marked.columns[col!]?.target;
    if (!t || !("newField" in t)) continue;
    const code = newCodes.get(fold(t.newField.name));
    // The preview checked the field with the company layer's rule; a refusal here fails the batch, never drops the
    // column's values in silence (S4-r1 t11).
    if (!code) throw new Error("import: custom field refused");
    // The person's choice for this spelling counts as it did in the preview, remembered or not (VP11 S4-r1).
    const m: CellMark = markValue(t as Target, raw, {
      layer: await readLayer(run),
      today: today(),
      choice: input.choices.values[valueKey(col!, raw)],
    });
    if (m.value === null) continue;
    await c.query(
      `update listings set custom_fields = custom_fields || jsonb_build_object($2::text, $3::jsonb)
        where id = $1 and import_run_id::text = $4`,
      [listingIdOf(runId, row!), code, JSON.stringify(m.value), runId],
    );
  }
  for (const [code, choice] of Object.entries(input.choices.units))
    if ("unitKey" in choice && choice.remember) {
      const raw =
        input.rows.map((r) => r[unitAt(marked)] ?? "").find((x) => fold(x) === code) ?? code;
      const id = await addCompanyUnitCode(c, raw, choice.unitKey);
      if (id) {
        learned.unitCodeIds.push(id);
        items.CompanyCatalogAlias.push(raw);
      }
    }
  if (marked.columns.every((col) => col.target)) {
    const columns: TemplateTarget[] = marked.columns.map((col) => {
      const t = col.target!;
      if ("skip" in t) return { skip: true };
      if ("custom" in t) return { custom: t.custom };
      if ("newField" in t) return { custom: newCodes.get(fold(t.newField.name)) ?? "" };
      return { standard: TEMPLATE_FIELD[t.standard] };
    });
    if (columns.every((x) => !("custom" in x) || x.custom !== "")) {
      const run0 = (await c.query(`select file_name from import_runs where id::text = $1`, [runId]))
        .rows[0] as { file_name: string };
      const t = await learnFromImport(
        run,
        {
          template: { name: run0.file_name.slice(0, 60), headers: input.headers, columns },
          labels: [],
          fields: [],
          aliases: [],
          pendingUnits: [],
        },
        [],
      );
      if (t.templateId) {
        learned.templateId = t.templateId;
        items.ImportTemplate.push(run0.file_name);
      }
    }
  }
  items.PendingUnit.push(...learned.pendingUnits.map((p) => p.rawCode));
  return (Object.keys(items) as LearnedConcept[]).flatMap((concept) =>
    items[concept].map((name) => ({ concept, name })),
  );
}

function conceptOf(target: StandardTarget): string {
  const map: Partial<Record<StandardTarget, string>> = {
    unitCode: "Unit",
    "Unit.buildingName": "Building",
    "Listing.standardStatus": "StandardStatus",
    "Listing.listPrice": "ListPrice",
    "Unit.livingArea": "LivingArea",
    "Unit.bedroomsTotal": "BedroomsTotal",
    "Listing.lastConfirmedAt": "LastConfirmedAt",
  };
  return map[target] ?? "";
}

export type UndoResult =
  | { ok: true; removed: string[]; kept: string[]; keptCodes: string[]; retired: number }
  | { ok: false; problem: "not-found" | "already-undone" };

/**
 * The company's list agents a team lead may import for (Hỏi-7; owner's choice of 2026-11-17, migration 016): ids and
 * names only, through app.import_list_agents(), which answers nothing to a role without company-wide importListings.
 */
export async function listAgents(c: Queryable): Promise<{ userId: string; name: string }[]> {
  const { rows } = await c.query(
    `select user_id::text as "userId", name from app.import_list_agents() order by name, user_id`,
  );
  return rows as { userId: string; name: string }[];
}

/** Undo a whole import: its untouched listings, what it taught, the pending units no listing sits on any more. */
export async function undoImport(c: Queryable, runId: string, by: string): Promise<UndoResult> {
  const run = await lockRun(c, runId);
  if (!run) return { ok: false, problem: "not-found" };
  if (run.status === "undone") return { ok: false, problem: "already-undone" };
  const runAs = savepointRun(c);
  const { removed, kept, keptCodes } = await removeImportListings(c, runId);
  const l = run.learned;
  await retireLearned(runAs, l);
  for (const id of l.unitCodeIds ?? []) await retireCompanyUnitCode(c, id);
  let retired =
    l.labelIds.length +
    l.fieldCodes.length +
    l.aliasIds.length +
    (l.templateId ? 1 : 0) +
    (l.unitCodeIds?.length ?? 0);
  for (const p of l.pendingUnits) {
    const r = await c.query(
      `update company_pending_units set retired_at = now()
        where id::text = $1 and retired_at is null and unit_key is null
          and not exists (select from listing_pending_units x where x.pending_unit_id::text = $1)`,
      [p.id],
    );
    retired += r.rowCount ?? 0;
  }
  await c.query(
    `update import_runs set status = 'undone', undone_at = now(), undone_by = $2 where id::text = $1`,
    [runId, by],
  );
  return { ok: true, removed, kept, keptCodes, retired };
}

export interface RecentImport {
  id: string;
  fileName: string;
  status: string;
  createdCount: number;
  keptCount: number;
  createdAt: string;
}

export async function recentImports(c: Queryable): Promise<RecentImport[]> {
  const { rows } = await c.query(
    `select id::text, file_name, status, created_count, jsonb_array_length(kept) as kept_count, created_at::text
       from import_runs order by created_at desc limit 10`,
  );
  return (
    rows as {
      id: string;
      file_name: string;
      status: string;
      created_count: number;
      kept_count: number;
      created_at: string;
    }[]
  ).map((r) => ({
    id: r.id,
    fileName: r.file_name,
    status: r.status,
    createdCount: r.created_count,
    keptCount: r.kept_count,
    createdAt: r.created_at,
  }));
}
