import "server-only";

// Row 3h (tin-rao-giu-gia-tri-rieng, AC-7): imports written before the row kept the unit attributes of the file only as
// written (`import_runs.kept`, reason «unit-attribute»). This reads them once more, with the same readers the import
// uses today, and gives each listing of such an import the file's values as own values from a file — only where the
// listing has no own value yet, never over a value the company typed (setFileValues of the listings module). Run once
// after the release by `make tin-rao-doc-lai`; a second run changes nothing.
//
// Every read and write of an import runs through the one door, withCompany, as the person who imported, with that
// import's company: the row rules keep one company's imports, listings and spellings away from another's (SP-1). The
// database owner only lists which imports are not read yet (id, company, importer); it writes nothing. An import its
// importer can no longer see — no longer a member, or a role without the right — stays unread and is counted.
import { fold } from "@/modules/company-config";
import { readLayer } from "@/modules/company-config/server";
import { withCompany, type DbClient, type DbPool } from "@/modules/identity/server";
import { attributeFits, type UnitAttributeValues } from "@/modules/listings";
import { setFileValues, type Queryable } from "@/modules/listings/server";

import { markValue, matchColumns, NO_CHOICES, valueKey, type LayerView } from "./mark";
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
  /** Imports left unread because their importer can no longer see them through the door. */
  refused: number;
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

/** Runs `fn` in one transaction through the door, as `userId` in `companyId`. */
export type RunAsImporter = <T>(
  companyId: string,
  userId: string,
  fn: (c: DbClient) => Promise<T>,
) => Promise<T>;

/** withCompany on the app's pool (the login role), as the person who imported. */
export const asImporter =
  (pool: DbPool): RunAsImporter =>
  (companyId, userId, fn) =>
    withCompany(pool, { companyId, userId }, fn);

const today = () => new Date(Date.now() + 7 * 3600 * 1000).toISOString().slice(0, 10);

/**
 * Reads the kept unit attributes of every import not read yet and fills the listings that have no own value yet. `list`
 * (the database owner) only names the imports to read; each import is read, filled and marked read (021) in one
 * transaction through the door, as its importer. An import made since row 3h is marked when it is made.
 */
export async function rereadImportValues(
  list: Queryable,
  runAs: RunAsImporter,
): Promise<RereadSummary> {
  const { rows } = await list.query(
    `select id::text, company_id::text, imported_by::text from import_runs
      where status <> 'undone' and kept @> '[{"why":"unit-attribute"}]'::jsonb
        and file_values_read_at is null
      order by created_at, id`,
  );
  const runs = rows as { id: string; company_id: string; imported_by: string }[];
  const out: RereadSummary = {
    imports: runs.length,
    listingsSet: 0,
    typedKept: 0,
    lockedKept: 0,
    cellsRead: 0,
    cellsUnread: 0,
    refused: 0,
  };
  for (const run of runs) {
    const done = await runAs(run.company_id, run.imported_by, async (c) => {
      // Locked for this transaction; a row the importer may not see is not read, and stays unread.
      const seen = await c.query(
        `select signature, kept from import_runs
          where id = $1 and file_values_read_at is null for update`,
        [run.id],
      );
      const found = seen.rows[0] as { signature: string[]; kept: unknown } | undefined;
      if (!found) return "refused" as const;
      if (!Array.isArray(found.kept) || !found.kept.every(isKept))
        throw new KeptShapeUnread(run.id);
      // The company's own labels, spellings and templates, for this company only.
      const layer: LayerView = await readLayer((fn) => fn(c));
      const columns = matchColumns(found.signature, layer, NO_CHOICES);
      const byRow = new Map<number, Partial<UnitAttributeValues>>();
      for (const k of found.kept as Kept[]) {
        if (k.why !== "unit-attribute") continue;
        const col = found.signature.indexOf(fold(k.header));
        const target = columns[col]?.target;
        const field = target && "standard" in target ? FILE_VALUE_OF[target.standard] : undefined;
        // Since row 11 an import keeps the value its preview showed for the cell (kept[].value), read by the machine or
        // typed by the person: that value is the one written. A value that does not fit the attribute is not taken.
        if (field && k.value !== undefined) {
          if (!attributeFits(field, k.value)) {
            out.cellsUnread += 1;
            continue;
          }
          out.cellsRead += 1;
          byRow.set(k.row, { ...byRow.get(k.row), [field]: k.value });
          continue;
        }
        // An older import kept only the words and no value choice of the person (d-…-30), so the choice is the empty
        // one: a cell that asked then stays unread now, never guessed.
        const cell =
          target && field
            ? markValue(target, k.raw, {
                layer,
                today: today(),
                choice: NO_CHOICES.values[valueKey(col, k.raw)],
              })
            : null;
        if (!field || !cell || cell.mark === "ask" || cell.value === null) {
          out.cellsUnread += 1;
          continue;
        }
        out.cellsRead += 1;
        byRow.set(k.row, { ...byRow.get(k.row), [field]: cell.value });
      }
      for (const [row, values] of byRow) {
        const set = await setFileValues(c, listingIdOf(run.id, row), values);
        if (set === "set") out.listingsSet += 1;
        else if (set === "typed-kept") out.typedKept += 1;
        else if (set === "locked") out.lockedKept += 1;
      }
      // Read once (021): a second run skips this import, so a value the person took back is never filled again.
      await c.query("update import_runs set file_values_read_at = now() where id = $1", [run.id]);
      return "read" as const;
    });
    if (done === "refused") out.refused += 1;
  }
  return out;
}
