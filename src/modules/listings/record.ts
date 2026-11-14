// Pure rules of the full unit record (roadmap row 3b, _acceptance/ho-so-du-thong-tin): how complete a listing is, how
// long ago it was confirmed with the owner, the listings of one unit newest first, and the unit kind. Safe in the browser.
import type { Listing, ListingUnit } from "../../generated/ontology";

/** The five parts a listing should have, in the order the record names what is missing (after onehub-quy-hang). */
export const COMPLETENESS_PARTS = [
  "listPrice",
  "furnished",
  "legalStatus",
  "financing",
  "occupantType",
] as const;
export type CompletenessPart = (typeof COMPLETENESS_PARTS)[number];

export interface Completeness {
  have: number;
  need: number;
  missing: CompletenessPart[];
}

const present = (value: unknown): boolean =>
  value !== null && value !== undefined && !(typeof value === "string" && value.trim() === "");

/** How complete one listing is: parts present out of five, and the missing parts in order. An empty text is missing. */
export function completeness(listing: Pick<Listing, CompletenessPart>): Completeness {
  const missing = COMPLETENESS_PARTS.filter((part) => !present(listing[part]));
  return {
    have: COMPLETENESS_PARTS.length - missing.length,
    need: COMPLETENESS_PARTS.length,
    missing,
  };
}

/** Vietnam has no daylight saving time: its calendar day is the UTC instant shifted by seven hours. */
const VIETNAM_OFFSET_MS = 7 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;
const vietnamDay = (ms: number): number => Math.floor((ms + VIETNAM_OFFSET_MS) / DAY_MS);

/**
 * Whole calendar days, on the Vietnam calendar, from the last confirmation with the owner to `now`; null when the
 * listing was never confirmed. A confirmation at 06:00 this morning in Vietnam is today, not yesterday (as UTC would
 * count it); a date in the future counts as today.
 */
export function confirmationAge(
  lastConfirmedAt: string | null | undefined,
  now: Date,
): number | null {
  if (!lastConfirmedAt) return null;
  const then = Date.parse(lastConfirmedAt);
  if (Number.isNaN(then)) return null;
  return Math.max(0, vietnamDay(now.getTime()) - vietnamDay(then));
}

/** One listing of a unit with its number: the oldest is 1. */
export interface NumberedListing<L> {
  listing: L;
  number: number;
}

/**
 * Every listing of the company on one unit, newest first by the time it was created; numbered so the oldest is «Lần 1».
 * A listing without a creation time sorts as the oldest.
 */
export function listingsOfUnit<L extends Pick<Listing, "id" | "originalEntryTimestamp">>(
  upi: string,
  listings: readonly L[],
  links: readonly Pick<ListingUnit, "listingId" | "upi">[],
): NumberedListing<L>[] {
  const onUnit = new Set(links.filter((x) => x.upi === upi).map((x) => x.listingId));
  const time = (l: L) =>
    l.originalEntryTimestamp ? Date.parse(l.originalEntryTimestamp) : -Infinity;
  const sorted = listings.filter((l) => onUnit.has(l.id)).sort((a, b) => time(b) - time(a));
  return sorted.map((listing, i) => ({ listing, number: sorted.length - i }));
}

/** The unit kind read from its bedrooms, as onehub-quy-hang shows it: «Studio», «2PN»; null when bedrooms are unknown. */
export function unitKind(bedroomsTotal: number | null | undefined): string | null {
  if (bedroomsTotal === null || bedroomsTotal === undefined) return null;
  return bedroomsTotal === 0 ? "Studio" : `${bedroomsTotal}PN`;
}
