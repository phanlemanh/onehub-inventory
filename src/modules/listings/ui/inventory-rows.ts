// Pure parts of the inventory grid (roadmap row 2): rows, columns and the state a URL asks for. Safe on the server.
import { customColumn, typedColumn, type TypedColumn } from "@/components/candidate/column-kind";
import { STATUS_ORDER, foldText, type ColumnFilters } from "@/components/candidate/grid-view";
import type { GridRow, RegionStatus } from "@/components/candidate/data-region";
import type { DisplayKind } from "@/generated/display";
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
      ...customValues(l),
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

/** A listing's own-field values under `custom.<code>` (row 7e); a value list or nothing gives no key. */
function customValues(l: Listing): Record<`custom.${string}`, unknown> {
  const own = l.customFields;
  if (!own || Array.isArray(own)) return {};
  return Object.fromEntries(Object.entries(own).map(([code, value]) => [`custom.${code}`, value]));
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

/** A company's own column as the inventory receives it: code, the company's name for it, and its display kind. */
export interface InventoryCustomColumn {
  code: string;
  header: string;
  kind: DisplayKind;
}

/**
 * The eight columns of the inventory grid, in order, with the headers the page gives, then the company's own columns
 * in the order given (row 7e: never before a standard column).
 */
export function inventoryColumns(
  headers: Readonly<Record<InventoryField, string>>,
  custom: readonly InventoryCustomColumn[] = [],
): TypedColumn[] {
  return [
    ...INVENTORY_FIELDS.map((field) => typedColumn({ field, header: headers[field] })),
    ...custom.map((c) => customColumn(c)),
  ];
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

/**
 * Text compared the way a person types it: no spaces at the ends, letter case and Vietnamese marks ignored, through the
 * grid's one folding rule (row 2e, AC-11), so «dong» finds «Đông» here as in the column filter.
 */
const codeKey = (text: string): string => foldText(text.trim());

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

/** What the top-bar search can be asked for (row 3f): a unit code, a building or a subdivision. */
export type SearchKind = "unit" | "building" | "subdivision";

/** One suggestion of the top-bar search: what it is, the text that finds it, and where it sends the grid. */
export interface SearchSuggestion {
  kind: SearchKind;
  /** The text put in the column filter. */
  value: string;
  /** For a unit code: the buildings it is in, in the order the rows come. */
  buildings: string[];
}

/** The search parameter of the inventory address for each kind (read by `inventoryOpeningFor` through the page). */
export const SEARCH_PARAM: Readonly<Record<SearchKind, string>> = {
  unit: "ma",
  building: "toa",
  subdivision: "du-an",
};

/** At most this many suggestions show under the box. */
export const SEARCH_LIMIT = 8;

/**
 * The suggestions for what was typed, from the inventory rows already read (SP-1: no new way of reading data).
 * Unit codes come first and match from their start, one suggestion per code with its buildings; then buildings and
 * subdivisions that contain the text. A code typed whole comes before the codes it starts.
 */
export function searchSuggestions(rows: readonly GridRow[], typed: string): SearchSuggestion[] {
  const key = codeKey(typed);
  if (key === "") return [];
  const units = new Map<string, SearchSuggestion>();
  const places: SearchSuggestion[] = [];
  const seen = new Set<string>();
  for (const r of rows) {
    const code = String(r["Listing.unitNumber"] ?? "").trim();
    if (code && codeKey(code).startsWith(key)) {
      const found = units.get(codeKey(code));
      const building = String(r["Listing.buildingName"] ?? "");
      if (found) {
        if (!found.buildings.includes(building)) found.buildings.push(building);
      } else units.set(codeKey(code), { kind: "unit", value: code, buildings: [building] });
    }
  }
  for (const [kind, field] of [
    ["building", "Listing.buildingName"],
    ["subdivision", "Listing.subdivisionName"],
  ] as const) {
    for (const r of rows) {
      const text = String(r[field] ?? "").trim();
      if (text && codeKey(text).includes(key) && !seen.has(`${kind}|${text}`)) {
        seen.add(`${kind}|${text}`);
        places.push({ kind, value: text, buildings: [] });
      }
    }
  }
  const unitList = [...units.values()].sort(
    (a, b) => Number(codeKey(b.value) === key) - Number(codeKey(a.value) === key),
  );
  return [...unitList, ...places].slice(0, SEARCH_LIMIT);
}

/** The inventory address a search opens: the typed or chosen text in the column of its kind. */
export function searchHref(kind: SearchKind, value: string): string {
  return `/inventory?${new URLSearchParams({ [SEARCH_PARAM[kind]]: value.trim() })}`;
}
