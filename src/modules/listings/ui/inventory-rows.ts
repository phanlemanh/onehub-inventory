// Pure parts of the inventory grid (roadmap row 2): rows, columns and the state a URL asks for. Safe on the server.
import { typedColumn, type TypedColumn } from "@/components/candidate/column-kind";
import { STATUS_ORDER, type ColumnFilters } from "@/components/candidate/grid-view";
import type { GridRow, RegionStatus } from "@/components/candidate/data-region";
import type { Listing, ListingUnit, Unit } from "@/generated/ontology";

/** Region states a development build may open with `?state=`; anything else is the loaded grid. */
const STATE_PARAMS = ["loading", "empty", "error", "partial", "forbidden"] as const;
export type InventoryState = RegionStatus | "empty";

/** The region state asked for by `?state=`, honoured only outside production so users never see a fake state. */
export function inventoryStateFrom(
  param: string | undefined,
  env: string | undefined,
): InventoryState {
  if (env === "production") return "ready";
  return (STATE_PARAMS as readonly string[]).includes(param ?? "")
    ? (param as InventoryState)
    : "ready";
}

/** What the inventory grid reads of a unit. */
export type InventoryUnit = Pick<Unit, "upi" | "livingArea" | "bedroomsTotal">;

/**
 * One grid row per listing. Area and bedrooms come from the unit the listing's unit link points at, found by UPI;
 * a link to a unit the catalog does not have leaves both empty rather than borrowing another unit's numbers.
 */
export function inventoryRows(input: {
  listings: readonly Listing[];
  listingUnits: readonly Pick<ListingUnit, "listingId" | "upi">[];
  units: readonly InventoryUnit[];
}): GridRow[] {
  const unitByUpi = new Map(input.units.map((u) => [u.upi, u]));
  const upiByListing = new Map(input.listingUnits.map((x) => [x.listingId, x.upi]));
  return input.listings.map((l) => {
    const upi = upiByListing.get(l.id);
    const unit = upi === undefined ? undefined : unitByUpi.get(upi);
    return {
      id: l.id,
      "Listing.unitNumber": l.unitNumber ?? null,
      "Listing.buildingName": l.buildingName ?? null,
      "Listing.subdivisionName": l.subdivisionName ?? null,
      "Listing.standardStatus": l.standardStatus,
      "Listing.listPrice": l.listPrice ?? null,
      "Unit.livingArea": unit?.livingArea ?? null,
      "Unit.bedroomsTotal": unit?.bedroomsTotal ?? null,
      "Listing.lastConfirmedAt": l.lastConfirmedAt ?? null,
    };
  });
}

/** Fields of the eight inventory columns, in order; the page gives each its header from the label table. */
export const INVENTORY_FIELDS = [
  "Listing.unitNumber",
  "Listing.buildingName",
  "Listing.subdivisionName",
  "Listing.standardStatus",
  "Listing.listPrice",
  "Unit.livingArea",
  "Unit.bedroomsTotal",
  "Listing.lastConfirmedAt",
] as const;
export type InventoryField = (typeof INVENTORY_FIELDS)[number];

/** The eight columns of the inventory grid, in order, with the headers the page gives. */
export function inventoryColumns(headers: Readonly<Record<InventoryField, string>>): TypedColumn[] {
  return INVENTORY_FIELDS.map((field) => typedColumn({ field, header: headers[field] }));
}

/** The field the inventory grid groups rows under: the building, as the owner's sheet does. */
export const INVENTORY_GROUP_BY = "Listing.buildingName" as const;

/**
 * The status filter a status shortcut asks for with `?status=<StandardStatus>` (several joined by commas); an unknown
 * status is dropped, and no known status leaves the grid unfiltered.
 */
export function inventoryFiltersFrom(param: string | undefined): ColumnFilters {
  const wanted = (param ?? "")
    .split(",")
    .map((part) => part.trim())
    .filter((part) => (STATUS_ORDER as readonly string[]).includes(part));
  return wanted.length > 0 ? { "Listing.standardStatus": wanted } : {};
}

/** Address of the inventory grid filtered to one status: what each status shortcut of the App Shell opens. */
export function inventoryStatusHref(status: string): string {
  return `/inventory?status=${encodeURIComponent(status)}`;
}

/** A code compared the way a person types it: no spaces at the ends, letter case ignored. */
const codeKey = (text: string): string => text.trim().toLocaleLowerCase("vi");

/** What a typed unit code finds among the inventory rows (row 3f): one unit, a code in several buildings, or nothing. */
export type CodeMatch =
  | { kind: "mot"; rows: GridRow[] }
  | { kind: "nhieu"; rows: GridRow[] }
  | { kind: "khong"; rows: [] };

/** The rows whose unit code is the typed code, whole — never a prefix — in the order the rows come. */
export function findByCode(rows: readonly GridRow[], typed: string): CodeMatch {
  const key = codeKey(typed);
  if (key === "") return { kind: "khong", rows: [] };
  const found = rows.filter((r) => codeKey(String(r["Listing.unitNumber"] ?? "")) === key);
  if (found.length === 0) return { kind: "khong", rows: [] };
  return found.length === 1 ? { kind: "mot", rows: found } : { kind: "nhieu", rows: found };
}

/** What the top-bar search asks the inventory for: a unit code, a building or a subdivision. */
export interface InventoryAsk {
  code?: string;
  building?: string;
  subdivision?: string;
}

/**
 * How the inventory opens for a search (row 3f): the text goes into its column's filter, so the filter row shows what
 * was typed; a code that finds exactly one unit opens that unit's record too. Several buildings or nothing found
 * open no record — the person picks a row, or sees that nothing matches.
 */
export function inventoryOpeningFor(
  rows: readonly GridRow[],
  ask: InventoryAsk,
): { filters: ColumnFilters; recordId: string | null } {
  const code = ask.code?.trim();
  if (code) {
    const match = findByCode(rows, code);
    return {
      filters: { "Listing.unitNumber": code },
      recordId: match.kind === "mot" ? match.rows[0]!.id : null,
    };
  }
  const building = ask.building?.trim();
  if (building) return { filters: { "Listing.buildingName": building }, recordId: null };
  const subdivision = ask.subdivision?.trim();
  if (subdivision) return { filters: { "Listing.subdivisionName": subdivision }, recordId: null };
  return { filters: {}, recordId: null };
}
