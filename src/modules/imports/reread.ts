import "server-only";

// Row 3h (tin-rao-giu-gia-tri-rieng, AC-7): imports written before the row kept the unit attributes of the file only as
// written (`import_runs.kept`, reason «unit-attribute»). This reads them once more, with the same readers the import
// uses today, and gives each listing of such an import the file's values as own values from a file — only where the
// listing has no own value yet, never over a value the company typed (setFileValues of the listings module). Run once
// after the release by `make tin-rao-doc-lai`; a second run changes nothing.
//
// It runs on a connection of the database owner, one import at a time in its own transaction; the listings it fills are
// only the listings of that import. The company layer is read through the one door, withCompany, as the person who
// imported, with that import's company: the row rules keep one company's spellings away from another's.
import { fold } from "@/modules/company-config";
import { readLayer } from "@/modules/company-config/server";
import { withCompany, type DbPool } from "@/modules/identity/server";
import type { UnitAttributeValues } from "@/modules/listings";
import { setFileValues, type Queryable } from "@/modules/listings/server";

import { markValue, matchColumns, NO_CHOICES, type LayerView } from "./mark";
import { listingIdOf, type Kept } from "./store";
import { FILE_VALUE_OF } from "./targets";

export interface RereadSummary {
  /** Imports that kept at least one unit attribute. */
  imports: number;
  /** Listings that took at least one value from their file. */
  listingsSet: number;
  /** Listings left as they are because the company typed a value on them. */
  typedKept: number;
  /** Listings left as they are because their details are locked (sold or withdrawn). */
  lockedKept: number;
  /** Kept cells read to a value, and kept cells that stay as written (an unread «2PN», a column no reader knows). */
  cellsRead: number;
  cellsUnread: number;
}

/** A kept list that is not the shape the import writes: the run stops and names the import, never reads it as empty. */
export class KeptShapeUnread extends Error {
  constructor(importId: string) {
    super(`kept shape unread: import ${importId}`);
  }
}

function isKept(k: unknown): k is Kept {
  if (typeof k !== "object" || k === null) return false;
  const r = k as Record<string, unknown>;
  return (
    Number.isInteger(r["row"]) &&
    (r["row"] as number) >= 0 &&
    typeof r["header"] === "string" &&
    typeof r["raw"] === "string" &&
    typeof r["why"] === "string"
  );
}

/** The company layer of one import's company, as its importer sees it. */
export type LayerOf = (companyId: string, userId: string) => Promise<LayerView>;

/** Reads the layer through withCompany on the app's pool (the login role). */
export const layerThroughDoor =
  (pool: DbPool): LayerOf =>
  (companyId, userId) =>
    withCompany(pool, { companyId, userId }, (c) => readLayer((fn) => fn(c)));

const today = () => new Date(Date.now() + 7 * 3600 * 1000).toISOString().slice(0, 10);

/** Reads every import's kept unit attributes again and fills the listings that have no own value yet. */
export async function rereadImportValues(c: Queryable, layerOf: LayerOf): Promise<RereadSummary> {
  const { rows } = await c.query(
    `select id::text, company_id::text, imported_by::text, signature, kept from import_runs
      where status <> 'undone' and kept @> '[{"why":"unit-attribute"}]'::jsonb
      order by created_at, id`,
  );
  const runs = rows as {
    id: string;
    company_id: string;
    imported_by: string;
    signature: string[];
    kept: unknown;
  }[];
  const out: RereadSummary = {
    imports: runs.length,
    listingsSet: 0,
    typedKept: 0,
    lockedKept: 0,
    cellsRead: 0,
    cellsUnread: 0,
  };
  for (const run of runs) {
    if (!Array.isArray(run.kept) || !run.kept.every(isKept)) throw new KeptShapeUnread(run.id);
    // The company's own labels, spellings and templates, for this company only.
    const layer = await layerOf(run.company_id, run.imported_by);
    await c.query("begin");
    try {
      const columns = matchColumns(run.signature, layer, NO_CHOICES);
      const byRow = new Map<number, Partial<UnitAttributeValues>>();
      for (const k of run.kept as Kept[]) {
        if (k.why !== "unit-attribute") continue;
        const target = columns[run.signature.indexOf(fold(k.header))]?.target;
        const field = target && "standard" in target ? FILE_VALUE_OF[target.standard] : undefined;
        const cell = target && field ? markValue(target, k.raw, { layer, today: today() }) : null;
        if (!field || !cell || cell.mark === "ask" || cell.value === null) {
          out.cellsUnread += 1;
          continue;
        }
        out.cellsRead += 1;
        byRow.set(k.row, { ...byRow.get(k.row), [field]: cell.value });
      }
      for (const [row, values] of byRow) {
        const done = await setFileValues(c, listingIdOf(run.id, row), values);
        if (done === "set") out.listingsSet += 1;
        else if (done === "typed-kept") out.typedKept += 1;
        else if (done === "locked") out.lockedKept += 1;
      }
      await c.query("commit");
    } catch (err) {
      await c.query("rollback");
      throw err;
    }
  }
  return out;
}
