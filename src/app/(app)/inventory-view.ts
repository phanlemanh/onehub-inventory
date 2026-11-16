// What the screens build from one company's inventory (row 10): the grid rows, the records, the top-bar search
// suggestions and the places of the geography tree. Pure, and the same for the database read and the sample company,
// so the search, the tree and the record only ever show what the grid shows.
import { formatDate } from "@/lib/format";
import { confirmationAge, listingsOfUnit, type InventoryData } from "@/modules/listings";
import { inventoryRows, type BuildingPlace, type ListingRecordData } from "@/modules/listings/ui";

/** One grid row per current listing. */
export function rowsOf(data: InventoryData) {
  return inventoryRows({
    listings: data.current,
    listingUnits: data.listingUnits,
    units: data.units,
  });
}

/** Only what the top-bar search suggests from (row 3f): the code, the building and the subdivision of each row. */
export function searchRowsOf(rows: ReturnType<typeof rowsOf>) {
  return rows.map((r) => ({
    id: r.id,
    "Listing.unitNumber": r["Listing.unitNumber"],
    "Listing.buildingName": r["Listing.buildingName"],
    "Listing.subdivisionName": r["Listing.subdivisionName"],
  }));
}

/** Where each building of these listings stands: its project and its complex (row 2d's tree). */
export function placesOf(data: InventoryData): BuildingPlace[] {
  const seen = new Map<string, BuildingPlace>();
  for (const u of data.units) {
    if (!u.subdivisionName || seen.has(`${u.subdivisionName}|${u.buildingName}`)) continue;
    seen.set(`${u.subdivisionName}|${u.buildingName}`, {
      project: u.subdivisionName,
      ...(u.complexName ? { complex: u.complexName } : {}),
      building: u.buildingName,
    });
  }
  return [...seen.values()];
}

/**
 * The full record of every current listing (row 3b): its unit from the shared catalog and every listing of the company
 * on it, newest first, with the confirmation age counted for `now` on the Vietnam calendar.
 */
export function recordsOf(data: InventoryData, now: Date): Record<string, ListingRecordData> {
  const all = [...data.current, ...data.earlier];
  const unitByUpi = new Map(data.units.map((u) => [u.upi, u]));
  const upiOf = new Map(data.listingUnits.map((x) => [x.listingId, x.upi]));
  const records: Record<string, ListingRecordData> = {};
  for (const l of data.current) {
    const upi = upiOf.get(l.id);
    const unit = upi === undefined ? undefined : unitByUpi.get(upi);
    if (!unit || upi === undefined) continue;
    records[l.id] = {
      unit: {
        unitNumber: unit.unitNumber,
        bedroomsTotal: unit.bedroomsTotal ?? null,
        livingArea: unit.livingArea ?? null,
        floor: unit.floor ?? null,
        directionFaces: unit.directionFaces ?? null,
        buildingName: unit.buildingName,
        subdivisionName: unit.subdivisionName ?? null,
        propertySubType: (unit.propertySubType ??
          null) as ListingRecordData["unit"]["propertySubType"],
      },
      listings: listingsOfUnit(upi, all, data.listingUnits).map(({ listing: x, number }) => ({
        id: x.id,
        number,
        standardStatus: x.standardStatus,
        listPrice: x.listPrice,
        createdOn: formatDate(x.originalEntryTimestamp),
        confirmedDays: confirmationAge(x.lastConfirmedAt, now),
        furnished: x.furnished,
        occupantType: x.occupantType,
        legalStatus: x.legalStatus,
        financing: x.financing,
      })),
    };
  }
  return records;
}
