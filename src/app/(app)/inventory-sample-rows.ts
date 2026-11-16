import { SAMPLE_SUBDIVISIONS, sampleUnits, subdivisionNameOf } from "@/modules/catalog";
import {
  SAMPLE_COMPANY,
  buildSampleListings,
  sampleEarlierListings,
  sampleKeeperOf,
  type InventoryData,
} from "@/modules/listings";
import type { Listing } from "@/generated/ontology";
import { inventoryRows, type BuildingPlace, type ListingRecordData } from "@/modules/listings/ui";

import { recordsOf, searchRowsOf } from "./inventory-view";

/**
 * The inventory rows of the sample company: the grid (row 1) and the top-bar search (row 3f) read the same rows, so
 * the search suggests only what the grid shows.
 */
export function sampleInventoryRows() {
  const { listings, listingUnits, units } = sampleInventory();
  return inventoryRows({ listings, listingUnits, units });
}

/** The listings behind those rows: the in-cell edit's sample save door holds them (row 4). */
export function sampleInventoryListings() {
  return sampleInventory().listings;
}

/**
 * Values of the sample company's own fields (row 7e), by field code: a single choice field (view) on every listing and a
 * text field (note) on every fourth. They show only for a company that has these fields in use. Kept apart from the
 * pinned sample of row 1, so its digest does not move.
 */
export const SAMPLE_CUSTOM_OPTIONS = { huong_view: ["Hồ", "Phố", "Công viên"] } as const;

function sampleCustomFields(i: number): Record<string, unknown> {
  const views = SAMPLE_CUSTOM_OPTIONS.huong_view;
  const out: Record<string, unknown> = { huong_view: views[i % views.length] };
  if (i % 4 === 0) out.ghi_chu = "Chủ cần bán nhanh";
  return out;
}

/**
 * The fee inclusion of each sample listing (row 19), kept apart from the pinned sample of row 1 like the own fields:
 * most listings include the fees, every third does not, every fifth has none yet. Two listings are set for the
 * contract's cases: the eighth asks 3 tỷ with the fees included, the eleventh has no price yet.
 */
export const SAMPLE_FEE_CASES = { threeBillion: 7, noPrice: 10 } as const;

function withSampleFees<L extends Listing>(listings: readonly L[]): L[] {
  return listings.map((l, i) => {
    const feeInclusion: Listing["feeInclusion"] =
      i % 5 === 4 ? undefined : i % 3 === 2 ? "Excluded" : "Included";
    const out: L = { ...l };
    if (feeInclusion) out.feeInclusion = feeInclusion;
    else delete out.feeInclusion;
    if (i === SAMPLE_FEE_CASES.threeBillion) {
      out.listPrice = 3_000_000_000;
      out.feeInclusion = "Included";
    }
    if (i === SAMPLE_FEE_CASES.noPrice) delete out.listPrice;
    return out;
  });
}

function sampleInventory() {
  const units = sampleUnits().map((u) => ({ ...u, subdivisionName: subdivisionNameOf(u) }));
  const built = buildSampleListings({ companyId: SAMPLE_COMPANY.id, units });
  const listings = withSampleFees(built.listings).map((l, i) => ({
    ...l,
    customFields: sampleCustomFields(i),
  }));
  return { units, listingUnits: built.listingUnits, listings };
}

/** Only what the top-bar search suggests from (row 3f): the code, the building and the subdivision of each row. */
export function sampleSearchRows() {
  return searchRowsOf(sampleInventoryRows());
}

/**
 * The sample company's inventory in the shape the database read gives (row 10): its 60 current listings, the earlier
 * listings of their units, the catalog units and the sample keepers. Read only where no database is configured.
 */
export function sampleInventoryData(): InventoryData {
  const { units, listingUnits, listings } = sampleInventory();
  const earlier = sampleEarlierListings({ listings, listingUnits });
  const complexOf = new Map(
    SAMPLE_SUBDIVISIONS.flatMap((s) => (s.complex ? [[s.key, s.complex.name] as const] : [])),
  );
  return {
    current: listings,
    earlier: earlier.listings,
    listingUnits: [...listingUnits, ...earlier.listingUnits],
    units: units.map((u) => ({
      upi: u.upi,
      unitNumber: u.unitNumber,
      buildingName: u.buildingName,
      ...(u.subdivisionName ? { subdivisionName: u.subdivisionName } : {}),
      ...(complexOf.get(u.subdivisionKey) ? { complexName: complexOf.get(u.subdivisionKey) } : {}),
      ...(u.floor !== undefined ? { floor: u.floor } : {}),
      ...(u.livingArea !== undefined ? { livingArea: u.livingArea } : {}),
      ...(u.bedroomsTotal !== undefined ? { bedroomsTotal: u.bedroomsTotal } : {}),
      ...(u.directionFaces !== undefined ? { directionFaces: u.directionFaces } : {}),
      propertySubType: u.propertySubType,
    })),
    keepers: Object.fromEntries(listings.map((l) => [l.id, sampleKeeperOf(l.id)])),
  };
}

/**
 * The full record of every sample row (row 3b): the unit from the shared catalog and every listing of the company on
 * it, newest first, with the confirmation age counted for `now` on the Vietnam calendar.
 */
export function sampleRecords(now: Date): Record<string, ListingRecordData> {
  return recordsOf(sampleInventoryData(), now);
}

/** Where each sample building stands (row 7d): its project and, when public, its complex — for the geography tree (row 2d). */
export function sampleBuildingPlaces(): BuildingPlace[] {
  return SAMPLE_SUBDIVISIONS.flatMap((s) =>
    s.buildings.map((b) => ({ project: s.name, complex: s.complex?.name, building: b.name })),
  );
}
