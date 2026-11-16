// The sample company's data (rows 1, 7e, 19 and 10), with no screen code: the inventory page reads it where no database
// is configured (inventory-source.ts), and the database and browser tests load it into a test company
// (tests/db/can-mau.ts). Test data only: «[MAU]», «[Tên]».
import { SAMPLE_SUBDIVISIONS, sampleUnits, subdivisionNameOf } from "@/modules/catalog";
import type { Listing } from "@/generated/ontology";
import {
  SAMPLE_COMPANY,
  buildSampleListings,
  sampleEarlierListings,
  sampleKeeperOf,
  type InventoryData,
} from "@/modules/listings";

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

export function sampleInventory() {
  const units = sampleUnits().map((u) => ({ ...u, subdivisionName: subdivisionNameOf(u) }));
  const built = buildSampleListings({ companyId: SAMPLE_COMPANY.id, units });
  const listings = withSampleFees(built.listings).map((l, i) => ({
    ...l,
    customFields: sampleCustomFields(i),
  }));
  return { units, listingUnits: built.listingUnits, listings };
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
