// The inventory of the signed-in company from the database (row 10): every listing and unit link the company holds,
// then the catalog units they offer, in one transaction through the identity module's door (withCompany). Row level
// security of migration 013 keeps it to the company's rows and to roles that may view listings; the statements add no
// company filter of their own, so nothing here can widen what the database allows.
import type { Listing } from "../../generated/ontology";
import { SOURCE_OF, UNIT_ATTRIBUTE_FIELDS, type AttributeSource } from "./unit-attributes";
import { readCatalogUnits } from "../catalog/server";
import type { DbClient } from "../identity/server";

import {
  keeperOf,
  splitCurrent,
  type InventoryData,
  type InventoryUnitRead,
} from "./inventory-data";

interface Row {
  id: string;
  company_id: string;
  standard_status: Listing["standardStatus"];
  list_price: string | null;
  close_price: string | null;
  close_date: string | null;
  withdrawn_reason: Listing["withdrawnReason"] | null;
  fee_inclusion: Listing["feeInclusion"] | null;
  furnished: Listing["furnished"] | null;
  occupant_type: Listing["occupantType"] | null;
  legal_status: string | null;
  financing: string | null;
  custom_fields: Record<string, unknown>;
  list_agent_user_id: string | null;
  list_agent_full_name: string | null;
  original_entry_timestamp: Date;
  last_confirmed_at: Date | null;
  version: number;
  // Row 3h: the listing's own unit values and their sources (migration 019); null = the catalog's value shows.
  living_area: string | null;
  living_area_source: AttributeSource | null;
  floor: string | null;
  floor_source: AttributeSource | null;
  bedrooms_total: number | null;
  bedrooms_total_source: AttributeSource | null;
  direction_faces: string | null;
  direction_faces_source: AttributeSource | null;
  property_sub_type: Listing["propertySubType"] | null;
  property_sub_type_source: AttributeSource | null;
  /** The catalog unit's UPI, or `pending:<id>` for a listing on a pending unit (row 11). */
  upi: string;
  pending_code: string | null;
  pending_building: string | null;
}

/** Prefix of the unit key of a listing on a pending unit (row 11): it has no UPI until the catalog matches it. */
export const PENDING_UNIT = "pending:";

/** The columns of a listing, with its unit link; also what the write path returns. */
export const LISTING_COLUMNS = `
  l.id, l.company_id, l.standard_status, l.list_price, l.close_price, to_char(l.close_date, 'YYYY-MM-DD') as close_date,
  l.withdrawn_reason, l.fee_inclusion, l.furnished, l.occupant_type, l.legal_status, l.financing, l.custom_fields,
  l.list_agent_user_id, l.list_agent_full_name, l.original_entry_timestamp, l.last_confirmed_at, l.version,
  l.living_area, l.living_area_source, l.floor, l.floor_source, l.bedrooms_total, l.bedrooms_total_source,
  l.direction_faces, l.direction_faces_source, l.property_sub_type, l.property_sub_type_source,
  coalesce(u.upi, '${PENDING_UNIT}' || lp.pending_unit_id) as upi, cpu.raw_code as pending_code,
  cpu.building_text as pending_building`;

/** A listing with its unit link: a catalog unit, or a pending unit of the company (row 11), never neither. */
export const LISTING_FROM = `
  listings l
  left join listing_units u on u.listing_id = l.id
  left join listing_pending_units lp on lp.listing_id = l.id
  left join company_pending_units cpu on cpu.id = lp.pending_unit_id`;

const READ_LISTINGS = `
  select ${LISTING_COLUMNS}
    from ${LISTING_FROM}
   where u.listing_id is not null or lp.listing_id is not null
   order by l.original_entry_timestamp desc, l.id`;

/** A database row as a Listing of the generated model; names of the unit come from the catalog unit. */
export function toListing(
  r: Row,
  unit: { unitNumber?: string; buildingName?: string; subdivisionName?: string } | undefined,
): Listing {
  const out: Listing = {
    id: r.id,
    companyId: r.company_id,
    buildingName: unit?.buildingName ?? "",
    standardStatus: r.standard_status,
    version: r.version,
    customFields: r.custom_fields ?? {},
    originalEntryTimestamp: r.original_entry_timestamp.toISOString(),
  };
  if (unit?.unitNumber) out.unitNumber = unit.unitNumber;
  if (unit?.subdivisionName) out.subdivisionName = unit.subdivisionName;
  if (r.list_price !== null) out.listPrice = Number(r.list_price);
  if (r.close_price !== null) out.closePrice = Number(r.close_price);
  if (r.close_date !== null) out.closeDate = r.close_date;
  if (r.withdrawn_reason) out.withdrawnReason = r.withdrawn_reason;
  if (r.fee_inclusion) out.feeInclusion = r.fee_inclusion;
  if (r.furnished) out.furnished = r.furnished;
  if (r.occupant_type) out.occupantType = r.occupant_type;
  if (r.legal_status !== null) out.legalStatus = r.legal_status;
  if (r.financing !== null) out.financing = r.financing;
  if (r.list_agent_user_id) out.listAgentKey = r.list_agent_user_id;
  if (r.list_agent_full_name) out.listAgentFullName = r.list_agent_full_name;
  if (r.last_confirmed_at) out.lastConfirmedAt = r.last_confirmed_at.toISOString();
  const own = ownColumnsOf(r);
  for (const f of UNIT_ATTRIBUTE_FIELDS) {
    const value = own[f];
    const source = own[SOURCE_OF[f]];
    if (value !== null && source !== null)
      Object.assign(out, { [f]: value, [SOURCE_OF[f]]: source });
  }
  return out;
}

/** The five own values of a row by their model names (numeric arrives as text and is read as a number). */
function ownColumnsOf(r: Row): Record<string, unknown> {
  return {
    livingArea: r.living_area === null ? null : Number(r.living_area),
    livingAreaSource: r.living_area_source,
    floor: r.floor,
    floorSource: r.floor_source,
    bedroomsTotal: r.bedrooms_total,
    bedroomsTotalSource: r.bedrooms_total_source,
    directionFaces: r.direction_faces,
    directionFacesSource: r.direction_faces_source,
    propertySubType: r.property_sub_type,
    propertySubTypeSource: r.property_sub_type_source,
  };
}

export type ListingRow = Row;

/** The company's inventory, read on a client already inside withCompany for `viewerId`. */
export async function readInventory(client: DbClient, viewerId: string): Promise<InventoryData> {
  const { rows } = await client.query(READ_LISTINGS);
  const listingRows = rows as Row[];
  const units: InventoryUnitRead[] = await readCatalogUnits(
    client,
    listingRows.map((r) => r.upi).filter((upi) => !upi.startsWith(PENDING_UNIT)),
  );
  // A pending unit is shown by the company's own code and the tower text of its file; its attributes stay empty.
  for (const r of listingRows)
    if (
      r.upi.startsWith(PENDING_UNIT) &&
      r.pending_code !== null &&
      !units.some((u) => u.upi === r.upi)
    )
      units.push({
        upi: r.upi,
        unitNumber: r.pending_code,
        buildingName: r.pending_building ?? "",
      });
  const unitByUpi = new Map(units.map((u) => [u.upi, u]));
  // The grid's first order: by project, then by unit (as the sample company is ordered).
  listingRows.sort(
    (a, b) =>
      (unitByUpi.get(a.upi)?.subdivisionName ?? "").localeCompare(
        unitByUpi.get(b.upi)?.subdivisionName ?? "",
      ) || a.upi.localeCompare(b.upi),
  );
  const listings = listingRows.map((r) => toListing(r, unitByUpi.get(r.upi)));
  const listingUnits = listingRows.map((r) => ({ listingId: r.id, upi: r.upi }));
  const { current, earlier } = splitCurrent(listings, listingUnits);
  const keepers = Object.fromEntries(current.map((l) => [l.id, keeperOf(l, viewerId)]));
  return { current, earlier, listingUnits, units, keepers };
}
