// What the inventory reads for one company (row 10): its listings, the unit links, the catalog units they offer and who
// keeps each one. The database read (inventory-read.ts) and the sample company (src/app) give this same shape, so the
// grid, the record, the top-bar search and the geography tree are built from it by one set of rules. Pure.
import type { Listing } from "../../generated/ontology";

import { OPEN_STATUSES, type SampleKeeper } from "./sample";

/** Who keeps a listing, as the person viewing sees it: someone else by name, the viewer, or nobody yet. */
export type Keeper = SampleKeeper;

/** A catalog unit as a listing of it shows it. */
export interface InventoryUnitRead {
  upi: string;
  unitNumber: string;
  buildingName: string;
  subdivisionName?: string;
  complexName?: string;
  floor?: string;
  livingArea?: number;
  bedroomsTotal?: number;
  directionFaces?: string;
  propertySubType?: string;
}

export interface InventoryData {
  /** One listing per unit: its open listing, or its newest one. */
  current: Listing[];
  /** Every other listing of those units, for the record's earlier listings (row 3b). */
  earlier: Listing[];
  /** The unit link of every listing above. */
  listingUnits: { listingId: string; upi: string }[];
  units: InventoryUnitRead[];
  /** Who keeps each current listing. */
  keepers: Record<string, Keeper>;
}

/** Who keeps `listing`, seen by `viewerId`. */
export function keeperOf(
  listing: Pick<Listing, "listAgentKey" | "listAgentFullName">,
  viewerId: string,
): Keeper {
  if (!listing.listAgentKey) return null;
  if (listing.listAgentKey === viewerId) return { kind: "viewer" };
  return { kind: "other", name: listing.listAgentFullName ?? "" };
}

const isOpen = (l: Listing) => OPEN_STATUSES.includes(l.standardStatus);
const entered = (l: Listing) => l.originalEntryTimestamp ?? "";

/**
 * Splits every listing of a company into the current listing of each unit and the earlier ones: a unit's open listing
 * is its current one (one at most per company, the database holds it); without one, its newest listing.
 */
export function splitCurrent(
  listings: readonly Listing[],
  links: readonly { listingId: string; upi: string }[],
): { current: Listing[]; earlier: Listing[] } {
  const upiOf = new Map(links.map((x) => [x.listingId, x.upi]));
  const byUnit = new Map<string, Listing[]>();
  for (const l of listings) {
    const upi = upiOf.get(l.id);
    if (upi === undefined) continue;
    byUnit.set(upi, [...(byUnit.get(upi) ?? []), l]);
  }
  const currentIds = new Set<string>();
  for (const all of byUnit.values()) {
    const pick =
      all.find(isOpen) ?? [...all].sort((a, b) => entered(b).localeCompare(entered(a)))[0]!;
    currentIds.add(pick.id);
  }
  return {
    current: listings.filter((l) => currentIds.has(l.id)),
    earlier: listings.filter((l) => upiOf.has(l.id) && !currentIds.has(l.id)),
  };
}
