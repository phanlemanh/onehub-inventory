// Code lookup against the database (row 7e, rule code-lookup-order of row 7d): a typed code resolves by the
// company's own codes, then the catalog's original codes (of any project), then the shared reader's tower, floor and
// stack. Runs inside the caller's company transaction (the identity module's withCompany), so the company's own codes
// are only that company's. Reads only; the shared catalog never changes here.
import { readUnitCode } from "./unit-code";

/** What this module needs of a database connection: the query method of node-postgres. */
export interface Queryable {
  query(text: string, values?: unknown[]): Promise<{ rows: unknown[] }>;
}

export type UnitResolution =
  { source: "company" | "catalog" | "reader"; unitKeys: string[] } | { source: null; unitKeys: [] };

const fold = (s: string) => s.trim().toUpperCase();

/** The catalog units a typed code points to, by the first of the three sources that knows it. */
export async function resolveUnitCode(c: Queryable, code: string): Promise<UnitResolution> {
  const want = fold(code);
  if (want) {
    const own = await c.query(
      `select distinct unit_key from company_catalog_aliases
        where kind = 'ma' and retired_at is null and unit_key is not null and upper(btrim(value)) = $1
        order by unit_key`,
      [want],
    );
    if (own.rows.length) return { source: "company", unitKeys: keys(own.rows) };
    const original = await c.query(
      `select distinct object_key as unit_key from catalog_aliases
        where kind = 'ma_goc' and retired_at is null and object_key like 'unt\\_%'
          and (upper(value) = $1 or upper(split_part(value, '/', 2)) = $1)
        order by 1`,
      [want],
    );
    if (original.rows.length) return { source: "catalog", unitKeys: keys(original.rows) };
  }
  const reading = readUnitCode(code);
  if ("building" in reading) {
    const read = await c.query(
      `select unit_key from catalog_units
        where upper(building_name) = upper($1) and floor = $2 and upper(coalesce(stack, '')) = upper($3)
        order by unit_key`,
      [reading.building, reading.floor, reading.stack],
    );
    if (read.rows.length) return { source: "reader", unitKeys: keys(read.rows) };
  }
  return { source: null, unitKeys: [] };
}

const keys = (rows: unknown[]) => (rows as { unit_key: string }[]).map((r) => r.unit_key);
