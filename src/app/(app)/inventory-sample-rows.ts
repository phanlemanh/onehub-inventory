import { sampleUnits, subdivisionNameOf } from "@/modules/catalog";
import { SAMPLE_COMPANY, buildSampleListings } from "@/modules/listings";
import { inventoryRows } from "@/modules/listings/ui";

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

function sampleInventory() {
  const units = sampleUnits().map((u) => ({ ...u, subdivisionName: subdivisionNameOf(u) }));
  const built = buildSampleListings({ companyId: SAMPLE_COMPANY.id, units });
  const listings = built.listings.map((l, i) => ({ ...l, customFields: sampleCustomFields(i) }));
  return { units, listingUnits: built.listingUnits, listings };
}

/** Only what the top-bar search suggests from (row 3f): the code, the building and the subdivision of each row. */
export function sampleSearchRows() {
  return sampleInventoryRows().map((r) => ({
    id: r.id,
    "Listing.unitNumber": r["Listing.unitNumber"],
    "Listing.buildingName": r["Listing.buildingName"],
    "Listing.subdivisionName": r["Listing.subdivisionName"],
  }));
}
