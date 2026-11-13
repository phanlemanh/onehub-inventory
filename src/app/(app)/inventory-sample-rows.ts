import { sampleUnits, subdivisionNameOf } from "@/modules/catalog";
import { SAMPLE_COMPANY, buildSampleListings } from "@/modules/listings";
import { inventoryRows } from "@/modules/listings/ui";

/**
 * The inventory rows of the sample company: the grid (row 1) and the top-bar search (row 3f) read the same rows, so
 * the search suggests only what the grid shows.
 */
export function sampleInventoryRows() {
  const units = sampleUnits().map((u) => ({ ...u, subdivisionName: subdivisionNameOf(u) }));
  const { listings, listingUnits } = buildSampleListings({ companyId: SAMPLE_COMPANY.id, units });
  return inventoryRows({ listings, listingUnits, units });
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
