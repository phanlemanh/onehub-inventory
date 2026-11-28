// A company's own code for a catalog unit, written when a person picks the unit an import's code meant (row 11,
// nhap-excel; table of row 7d, migration 007). Runs on the caller's client inside its withCompany; the database lets
// the write through only when manageCompanyCodes allows it.
import type { QueryClient } from "./read-units";

/** Remember `code` as the company's code of `unitKey`; null when the company already uses that code. */
export async function addCompanyUnitCode(
  c: QueryClient,
  code: string,
  unitKey: string,
): Promise<string | null> {
  const r = await c.query(
    `insert into company_catalog_aliases (company_id, unit_key, kind, value)
     select app.current_company_id(), $2, 'ma', $1
     where not exists (select from company_catalog_aliases
                        where kind = 'ma' and value = $1 and retired_at is null)
     returning id::text`,
    [code.trim(), unitKey],
  );
  return (r.rows[0] as { id: string } | undefined)?.id ?? null;
}

/** Stop using a company code an import wrote (undo of that import). */
export async function retireCompanyUnitCode(c: QueryClient, id: string): Promise<void> {
  await c.query(
    `update company_catalog_aliases set retired_at = now() where id::text = $1 and retired_at is null`,
    [id],
  );
}
