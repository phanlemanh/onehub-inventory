import { SAMPLE_SUBDIVISIONS } from "@/modules/catalog";
import { inventoryRows, type BuildingPlace, type ListingRecordData } from "@/modules/listings/ui";

import {
  SAMPLE_CUSTOM_OPTIONS,
  SAMPLE_FEE_CASES,
  sampleInventory,
  sampleInventoryData,
} from "./inventory-sample-data";
import { recordsOf, searchRowsOf } from "./inventory-view";

export { SAMPLE_CUSTOM_OPTIONS, SAMPLE_FEE_CASES, sampleInventoryData };

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

/** Only what the top-bar search suggests from (row 3f): the code, the building and the subdivision of each row. */
export function sampleSearchRows() {
  return searchRowsOf(sampleInventoryRows());
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
