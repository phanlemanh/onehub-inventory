// Statements that load a company's listings into the tables of migration 013 (row 10): the sample company for a
// development machine and for the browser and database tests. Run by the table owner, never by the API role — the API
// role adds no listing (createListing is row 12). The catalog the listings point at is loaded first
// (catalogLoadStatements). Test data only: names are «[Tên] 0x».
import type { Listing } from "../../generated/ontology";

import type { InventoryData } from "./inventory-data";

export interface Statement {
  text: string;
  values: unknown[];
}

const INSERT_LISTING = `
  insert into listings (id, company_id, standard_status, list_price, close_price, close_date, withdrawn_reason,
                        fee_inclusion, furnished, occupant_type, legal_status, financing, custom_fields,
                        list_agent_user_id, list_agent_full_name, original_entry_timestamp, last_confirmed_at, version,
                        living_area, living_area_source, floor, floor_source, bedrooms_total, bedrooms_total_source,
                        direction_faces, direction_faces_source, property_sub_type, property_sub_type_source)
  values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, coalesce($16::timestamptz, now()), $17, $18,
          $19, $20, $21, $22, $23, $24, $25, $26, $27, $28)`;

const INSERT_LINK = `
  insert into listing_units (listing_id, company_id, upi, open) values ($1, $2, $3, $4)`;

const OPEN: readonly Listing["standardStatus"][] = ["Incomplete", "Active", "Pending", "Hold"];

/**
 * The statements for every listing of `data` in `companyId`. `idOf` gives each listing its id in this company (two
 * companies never share an id); `keeperOf` the member who keeps a current listing, or null for «nobody yet». Earlier
 * listings first, so a unit's open listing is always the last one written for it.
 */
export function listingLoadStatements(
  data: Pick<InventoryData, "current" | "earlier" | "listingUnits">,
  companyId: string,
  idOf: (sampleId: string) => string,
  keeperOf: (listing: Listing) => { userId: string; name: string } | null,
): Statement[] {
  const upiOf = new Map(data.listingUnits.map((x) => [x.listingId, x.upi]));
  const out: Statement[] = [];
  for (const l of [...data.earlier, ...data.current]) {
    const upi = upiOf.get(l.id);
    if (upi === undefined) continue;
    const keeper = data.current.includes(l) ? keeperOf(l) : null;
    const custom = l.customFields && !Array.isArray(l.customFields) ? l.customFields : {};
    out.push({
      text: INSERT_LISTING,
      values: [
        idOf(l.id),
        companyId,
        l.standardStatus,
        l.listPrice ?? null,
        l.closePrice ?? null,
        l.closeDate ?? null,
        l.withdrawnReason ?? null,
        l.feeInclusion ?? null,
        l.furnished ?? null,
        l.occupantType ?? null,
        l.legalStatus ?? null,
        l.financing ?? null,
        JSON.stringify(custom),
        keeper?.userId ?? null,
        keeper?.name ?? null,
        l.originalEntryTimestamp ?? null,
        l.lastConfirmedAt ?? null,
        l.version,
        // Row 3h: the listing's own unit values and their sources (migration 020), as the sample holds them.
        l.livingArea ?? null,
        l.livingAreaSource ?? null,
        l.floor ?? null,
        l.floorSource ?? null,
        l.bedroomsTotal ?? null,
        l.bedroomsTotalSource ?? null,
        l.directionFaces ?? null,
        l.directionFacesSource ?? null,
        l.propertySubType ?? null,
        l.propertySubTypeSource ?? null,
      ],
    });
    out.push({
      text: INSERT_LINK,
      values: [idOf(l.id), companyId, upi, OPEN.includes(l.standardStatus)],
    });
  }
  return out;
}
