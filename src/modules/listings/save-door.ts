// The one save door of a listing edit (roadmap row 4, _acceptance/sua-tren-o). Its outcomes are the four the real
// write path (/api/v1, row 10) will return — saved, refused (403), offline, conflict (the listing changed elsewhere) —
// so row 10 plugs its door in without changing the cell. Today the door writes to the sample listings held in memory:
// nothing goes to the browser's lasting storage, and a reload is back to the sample (supervisor note G-1311-17).
import type {
  Listing,
  ListingFeeInclusion,
  ListingFurnished,
  ListingOccupantType,
  ListingStandardStatus,
  ListingWithdrawnReason,
} from "../../generated/ontology";

import {
  DETAILS_TEXT_LIMIT,
  FURNISHED_VALUES,
  OCCUPANT_VALUES,
  canMove,
  detailsLocked,
  priceLocked,
  readPrice,
  statusLocked,
  statusNeeds,
  type StatusNeed,
} from "./edit-rules";
import {
  SOURCE_OF,
  UNIT_ATTRIBUTE_FIELDS,
  attributeFits,
  type AttributeSource,
  type UnitAttributeField,
  type UnitAttributeValues,
} from "./unit-attributes";

/** A new price, or a status move with what it needs: what a cell or a pasted region changes (rows 4, 5). */
export type PriceOrStatusChange =
  | { field: "listPrice"; listPrice: number }
  | {
      field: "standardStatus";
      standardStatus: ListingStandardStatus;
      closePrice?: number;
      closeDate?: string;
      withdrawnReason?: ListingWithdrawnReason;
    };

/**
 * The four details edited together in the record (row 3g): only the parts named change; `null` clears a part. Legal
 * status and financing are free words (Hỏi-1 of row 3b), already trimmed; furnished and occupant type are fixed values.
 */
export type DetailsChange = {
  field: "details";
  legalStatus?: string | null;
  furnished?: ListingFurnished | null;
  financing?: string | null;
  occupantType?: ListingOccupantType | null;
};

/** One value of one of the company's own fields (row 7e), set on its cell (row 3g); `null` clears it. */
export type CustomFieldChange = {
  field: "customField";
  code: string;
  value: string | number | boolean | null;
};

/**
 * The company's own values of the unit attributes (row 3h): only the attributes named change. A value is written as
 * typed by the company (source Typed); `null` clears the own value and its source, so the listing follows the catalog
 * again («Lấy lại» on the screen).
 */
export type UnitAttributesChange = {
  field: "unitAttributes";
  /**
   * Only «Hoàn tác» names a source: it writes back a value an imported file brought with the source it had. Any other
   * write is the company typing, so its source is Typed.
   */
  sources?: Partial<Record<UnitAttributeField, AttributeSource>>;
} & {
  [K in keyof UnitAttributeValues]?: UnitAttributeValues[K] | null;
};

/** One edit of a listing: a price or status change, the fee inclusion (row 10), its details or a custom value (3g). */
export type ListingChange =
  | PriceOrStatusChange
  | { field: "feeInclusion"; feeInclusion: ListingFeeInclusion }
  | DetailsChange
  | CustomFieldChange
  | UnitAttributesChange
  | UnitMoveChange;

/**
 * «Gắn sang căn khác» (row 3h, AC-10): the listing points at another unit of the shared catalog. Its own values stay; the
 * catalog's values follow the new unit. The server moves the unit link; one open listing per unit stays the database's.
 */
export type UnitMoveChange = { field: "unit"; upi: string };

/** Why a change breaks a rule; the editors never send one, so this answer means an editor let it through. */
export type Invalid =
  | { rule: "locked" }
  | { rule: "move"; from: ListingStandardStatus; to: ListingStandardStatus }
  | { rule: "price" }
  | { rule: "needs"; needs: StatusNeed[] }
  /** A detail outside its fixed values, or words longer than DETAILS_TEXT_LIMIT. */
  | { rule: "details" }
  /** A custom value the company's field does not take (the reason of checkCustomValue, row 7e). */
  | { rule: "custom"; reason: string }
  /** A unit attribute the readers of unit-attributes.ts do not take (row 3h). */
  | { rule: "attributes" }
  /** The unit to move to already has an open listing of the company, named by its unit number (row 3h). */
  | { rule: "unit-open"; unitNumber: string }
  /** The unit to move to is not in the shared catalog, or is the unit the listing already points at (row 3h). */
  | { rule: "unit" };

export type SaveOutcome =
  | { kind: "saved"; listing: Listing }
  | { kind: "refused" }
  | { kind: "offline" }
  /** The listing changed (or was removed: no `current`) since the person read it. */
  | { kind: "conflict"; current?: Listing }
  | { kind: "invalid"; why: Invalid }
  /** The session ended (401): the person signs in again (row 3g, debt of row 10). */
  | { kind: "expired" }
  /** The server failed or its answer could not be read (row 3g, debt of row 10). */
  | { kind: "fault" };

/** Whether one of the company's fields takes a value: checkCustomValue of the company layer, handed in by the caller. */
export type CustomCheck = (
  code: string,
  value: string | number | boolean,
) => { ok: true } | { ok: false; reason: string };

const isText = (v: unknown): v is string | null | undefined =>
  v === undefined ||
  v === null ||
  (typeof v === "string" && v.trim() === v && v !== "" && v.length <= DETAILS_TEXT_LIMIT);
const isOneOf = <T>(set: readonly T[], v: unknown): boolean =>
  v === undefined || v === null || set.includes(v as T);

/** A listing with one part set, or taken off when the value is null. */
function withPart<K extends keyof Listing>(
  listing: Listing,
  key: K,
  value: Listing[K] | null | undefined,
): Listing {
  if (value === undefined) return listing;
  const next = { ...listing };
  if (value === null) delete next[key];
  else next[key] = value;
  return next;
}

export interface SaveRequest {
  id: string;
  /** The version the person edited; another save in between makes this one a conflict. */
  version: number;
  change: ListingChange;
  /** When the edit happened: an edit of price or status counts as confirmed with the owner now. */
  at: string;
}

export interface ListingSaveDoor {
  save(request: SaveRequest): Promise<SaveOutcome>;
}

/** The listing after a change, or the rule it breaks. Pure: the sample door and row 10's server share it. */
export function applyChange(
  listing: Listing,
  change: ListingChange,
  at: string,
  custom?: CustomCheck,
): { ok: true; listing: Listing } | { ok: false; why: Invalid } {
  const confirmed = { ...listing, version: listing.version + 1, lastConfirmedAt: at };
  if (change.field === "details") {
    if (detailsLocked(listing.standardStatus)) return { ok: false, why: { rule: "locked" } };
    const fine =
      isText(change.legalStatus) &&
      isText(change.financing) &&
      isOneOf(FURNISHED_VALUES, change.furnished) &&
      isOneOf(OCCUPANT_VALUES, change.occupantType);
    if (!fine) return { ok: false, why: { rule: "details" } };
    let next: Listing = confirmed;
    next = withPart(next, "legalStatus", change.legalStatus);
    next = withPart(next, "furnished", change.furnished);
    next = withPart(next, "financing", change.financing);
    next = withPart(next, "occupantType", change.occupantType);
    return { ok: true, listing: next };
  }
  if (change.field === "unit") {
    // The link moves with the listing's details: a sold or withdrawn listing stays on the unit it was sold on.
    if (detailsLocked(listing.standardStatus)) return { ok: false, why: { rule: "locked" } };
    return { ok: true, listing: confirmed };
  }
  if (change.field === "unitAttributes") {
    if (detailsLocked(listing.standardStatus)) return { ok: false, why: { rule: "locked" } };
    const named = UNIT_ATTRIBUTE_FIELDS.filter((f) => change[f] !== undefined);
    if (named.length === 0 || named.some((f) => change[f] !== null && !attributeFits(f, change[f])))
      return { ok: false, why: { rule: "attributes" } };
    const next: Listing = { ...confirmed };
    for (const f of named) {
      const value = change[f];
      if (value === null) {
        delete next[f];
        delete next[SOURCE_OF[f]];
      } else {
        (next as unknown as Record<string, unknown>)[f] = value;
        next[SOURCE_OF[f]] = change.sources?.[f] === "File" ? "File" : "Typed";
      }
    }
    return { ok: true, listing: next };
  }
  if (change.field === "customField") {
    if (detailsLocked(listing.standardStatus)) return { ok: false, why: { rule: "locked" } };
    const values = { ...((listing.customFields as Record<string, unknown> | undefined) ?? {}) };
    if (change.value === null) delete values[change.code];
    else {
      const check = custom?.(change.code, change.value) ?? { ok: true };
      if (!check.ok) return { ok: false, why: { rule: "custom", reason: check.reason } };
      values[change.code] = change.value;
    }
    return { ok: true, listing: { ...confirmed, customFields: values } };
  }
  if (change.field === "listPrice") {
    if (priceLocked(listing.standardStatus)) return { ok: false, why: { rule: "locked" } };
    if (!Number.isInteger(change.listPrice) || !readPrice(String(change.listPrice)).ok)
      return { ok: false, why: { rule: "price" } };
    return { ok: true, listing: { ...confirmed, listPrice: change.listPrice } };
  }
  if (change.field === "feeInclusion") {
    // The fee inclusion goes with the price: a sold listing keeps both as they were.
    if (priceLocked(listing.standardStatus)) return { ok: false, why: { rule: "locked" } };
    return { ok: true, listing: { ...confirmed, feeInclusion: change.feeInclusion } };
  }
  const from = listing.standardStatus;
  const to = change.standardStatus;
  if (statusLocked(from)) return { ok: false, why: { rule: "locked" } };
  if (!canMove(from, to)) return { ok: false, why: { rule: "move", from, to } };
  const needs = statusNeeds(to, change);
  if (needs.length > 0) return { ok: false, why: { rule: "needs", needs } };
  return {
    ok: true,
    listing: {
      ...confirmed,
      standardStatus: to,
      ...(to === "Closed" ? { closePrice: change.closePrice, closeDate: change.closeDate } : {}),
      ...(to === "Withdrawn" ? { withdrawnReason: change.withdrawnReason } : {}),
    },
  };
}

/** The outcome a failed call to the real write path means; one rule, shared with the screens' write door. */
export { writeFailure as failureOutcome } from "../../lib/write-failure";

/**
 * The save door on the sample listings, in memory. `online` says whether the device has a network: no writes while
 * offline (AGENTS.md), so an offline save or undo is refused with «offline», like the real door.
 */
export function sampleSaveDoor(
  listings: readonly Listing[],
  env: {
    online: () => boolean;
    /** Told of every request that reaches the door (the browser tests count writes through it). */
    seen?: (request: SaveRequest) => void;
  } = { online: () => true },
): ListingSaveDoor & { current(id: string): Listing | undefined } {
  const store = new Map(listings.map((l) => [l.id, l]));
  return {
    current: (id) => store.get(id),
    async save(request) {
      env.seen?.(request);
      const { id, version, change, at } = request;
      if (!env.online()) return { kind: "offline" };
      const listing = store.get(id);
      if (!listing) return { kind: "conflict" };
      if (listing.version !== version) return { kind: "conflict", current: listing };
      const next = applyChange(listing, change, at);
      if (!next.ok) return { kind: "invalid", why: next.why };
      store.set(id, next.listing);
      return { kind: "saved", listing: next.listing };
    },
  };
}
