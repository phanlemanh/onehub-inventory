// The create door of listings (row 11, nhap-excel; owner's answer to Hỏi-1: row 11 owns creating listings on the
// server, row 12 adds the hand-made screen on top). Runs inside the caller's transaction opened through withCompany;
// the database's rules decide who may add (createListing) and who may remove (undoImport, only listings of an import
// nobody changed since). Nothing here reads a session.
import type { ListingStandardStatus } from "../../generated/ontology";

import { detailsLocked } from "./edit-rules";
import { attributeFits, UNIT_ATTRIBUTE_FIELDS, type UnitAttributeValues } from "./unit-attributes";

/** A query client of the caller's transaction (the identity module's DbClient). */
export interface Queryable {
  query(text: string, params?: unknown[]): Promise<{ rows: unknown[]; rowCount: number | null }>;
}

export interface NewListing {
  id: string;
  /** A catalog unit (upi) or a pending unit of the company. */
  unit: { upi: string } | { pendingUnitId: string };
  listAgentUserId: string;
  listAgentFullName: string;
  standardStatus: ListingStandardStatus;
  listPrice: number | null;
  feeInclusion: "Included" | "Excluded" | null;
  furnished: "Furnished" | "Partially" | "Unfurnished" | null;
  occupantType: "Owner" | "Tenant" | "Vacant" | null;
  withdrawnReason: "sold_elsewhere" | "owner_changed_mind" | "unreachable" | null;
  legalStatus: string | null;
  financing: string | null;
  customFields: Record<string, unknown>;
  /** The owner confirmation date the file gave (YYYY-MM-DD), else null: an import is not a fresh confirmation. */
  lastConfirmedAt: string | null;
  /**
   * Row 3h: what the file said of the unit's five attributes, read; each becomes an own value from a file (source
   * «File»). A value outside the attribute's rule is left out, never written: the import keeps its cell as written.
   */
  fileValues?: Partial<UnitAttributeValues>;
}

const OPEN = ["Incomplete", "Active", "Pending", "Hold"];

/** The five values of a file in the column order of the statements below; null where the file gave none that fits. */
function fileParams(values: Partial<UnitAttributeValues> | undefined): unknown[] {
  return UNIT_ATTRIBUTE_FIELDS.map((f) =>
    values?.[f] !== undefined && attributeFits(f, values[f]) ? values[f] : null,
  );
}

// Reading an older import again: an attribute that has no own value takes the file's; one that has keeps its own.
const FILL_FILE_VALUES = `
  update listings
     set living_area = coalesce(living_area, $2),
         living_area_source = case when living_area is null and $2::numeric is not null then 'File'
                                   else living_area_source end,
         floor = coalesce(floor, $3),
         floor_source = case when floor is null and $3::text is not null then 'File' else floor_source end,
         bedrooms_total = coalesce(bedrooms_total, $4),
         bedrooms_total_source = case when bedrooms_total is null and $4::integer is not null then 'File'
                                      else bedrooms_total_source end,
         direction_faces = coalesce(direction_faces, $5),
         direction_faces_source = case when direction_faces is null and $5::text is not null then 'File'
                                       else direction_faces_source end,
         property_sub_type = coalesce(property_sub_type, $6),
         property_sub_type_source = case when property_sub_type is null and $6::text is not null then 'File'
                                         else property_sub_type_source end
   where id = $1`;

/** Add listings of one import, each with its one unit link, in the caller's transaction. */
export async function createListings(
  c: Queryable,
  companyId: string,
  importRunId: string,
  items: readonly NewListing[],
): Promise<{ created: string[] }> {
  const created: string[] = [];
  for (const l of items) {
    await c.query(
      `insert into listings (id, company_id, standard_status, list_price, fee_inclusion, furnished, occupant_type,
         legal_status, financing, custom_fields, list_agent_user_id, list_agent_full_name, last_confirmed_at,
         import_run_id, withdrawn_reason, living_area, living_area_source, floor, floor_source, bedrooms_total,
         bedrooms_total_source, direction_faces, direction_faces_source, property_sub_type, property_sub_type_source)
       values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10::jsonb, $11, $12, $13::date, $14, $15,
         $16, case when $16::numeric is null then null else 'File' end,
         $17, case when $17::text is null then null else 'File' end,
         $18, case when $18::integer is null then null else 'File' end,
         $19, case when $19::text is null then null else 'File' end,
         $20, case when $20::text is null then null else 'File' end)`,
      [
        l.id,
        companyId,
        l.standardStatus,
        l.listPrice,
        l.feeInclusion,
        l.furnished,
        l.occupantType,
        l.legalStatus,
        l.financing,
        JSON.stringify(l.customFields),
        l.listAgentUserId,
        l.listAgentFullName,
        l.lastConfirmedAt,
        importRunId,
        l.withdrawnReason,
        // Row 3h: each own value from the file with its source «File»; none, no source (migration 020).
        ...fileParams(l.fileValues),
      ],
    );
    const open = OPEN.includes(l.standardStatus);
    if ("upi" in l.unit)
      await c.query(
        `insert into listing_units (listing_id, company_id, upi, open) values ($1, $2, $3, $4)`,
        [l.id, companyId, l.unit.upi, open],
      );
    else
      await c.query(
        `insert into listing_pending_units (listing_id, company_id, pending_unit_id, open) values ($1, $2, $3, $4)`,
        [l.id, companyId, l.unit.pendingUnitId, open],
      );
    created.push(l.id);
  }
  return { created };
}

/** What setFileValues did to one listing. */
export type FileValuesOutcome = "set" | "typed-kept" | "locked" | "nothing-new" | "not-found";

/**
 * Row 3h, reading an import made before the row again (AC-7): the file's values become own values from a file where
 * the listing has no own value yet. A listing the company typed a value on is not touched at all, nor one whose
 * details are locked (sold or withdrawn), and an attribute that already has an own value keeps it. Not a person's
 * change: the version stays, so undoing the import still treats the listing as untouched. Run twice, the second run
 * sets nothing.
 */
export async function setFileValues(
  c: Queryable,
  listingId: string,
  values: Partial<UnitAttributeValues>,
): Promise<FileValuesOutcome> {
  const { rows } = await c.query(
    `select standard_status, living_area_source, floor_source, bedrooms_total_source, direction_faces_source,
            property_sub_type_source
       from listings where id = $1 for update`,
    [listingId],
  );
  const row = rows[0] as
    ({ standard_status: ListingStandardStatus } & Record<string, string | null>) | undefined;
  if (!row) return "not-found";
  const { standard_status: status, ...rest } = row;
  const sources = Object.values(rest);
  if (sources.includes("Typed")) return "typed-kept";
  if (detailsLocked(status)) return "locked";
  const file = fileParams(values);
  if (!file.some((v, i) => v !== null && sources[i] === null)) return "nothing-new";
  await c.query(FILL_FILE_VALUES, [listingId, ...file]);
  return "set";
}

/**
 * Remove the listings of one import that nobody changed since (version 1); the ones changed stay and are named. The
 * database lets the delete through only for an import not undone and only when undoImport allows it.
 */
export async function removeImportListings(
  c: Queryable,
  importRunId: string,
): Promise<{ removed: string[]; kept: string[]; keptCodes: string[] }> {
  const { rows } = await c.query(
    `select id, version from listings where import_run_id = $1 order by original_entry_timestamp, id`,
    [importRunId],
  );
  const all = rows as { id: string; version: number }[];
  const del = await c.query(
    `delete from listings where import_run_id = $1 and version = 1 returning id`,
    [importRunId],
  );
  const removed = (del.rows as { id: string }[]).map((r) => r.id);
  const kept = all.filter((r) => !removed.includes(r.id)).map((r) => r.id);
  // The code a person knows each kept listing by: the catalog unit's building and number, or the pending unit's code
  // as the file wrote it.
  const codes = await c.query(
    `select coalesce(cu.building_name || ' ' || cu.unit_number, cpu.raw_code, '') as code
       from listings l
       left join listing_units lu on lu.listing_id = l.id
       left join catalog_units cu on cu.upi = lu.upi
       left join listing_pending_units lp on lp.listing_id = l.id
       left join company_pending_units cpu on cpu.id = lp.pending_unit_id
      where l.id = any($1::uuid[])
      order by l.original_entry_timestamp, l.id`,
    [kept],
  );
  const keptCodes = (codes.rows as { code: string }[]).map((r) => r.code);
  return { removed, kept, keptCodes };
}
