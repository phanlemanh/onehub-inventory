// The one save door of a listing edit (roadmap row 4, _acceptance/sua-tren-o). Its outcomes are the four the real
// write path (/api/v1, row 10) will return — saved, refused (403), offline, conflict (the listing changed elsewhere) —
// so row 10 plugs its door in without changing the cell. Today the door writes to the sample listings held in memory:
// nothing goes to the browser's lasting storage, and a reload is back to the sample (supervisor note G-1311-17).
import type {
  Listing,
  ListingStandardStatus,
  ListingWithdrawnReason,
} from "../../generated/ontology";

import {
  canMove,
  priceLocked,
  readPrice,
  statusLocked,
  statusNeeds,
  type StatusNeed,
} from "./edit-rules";

/** One edit from a cell: a new price, or a status move with what it needs. */
export type ListingChange =
  | { field: "listPrice"; listPrice: number }
  | {
      field: "standardStatus";
      standardStatus: ListingStandardStatus;
      closePrice?: number;
      closeDate?: string;
      withdrawnReason?: ListingWithdrawnReason;
    };

/** Why a change breaks a rule; the cell never sends one, so this answer means a cell let it through. */
export type Invalid =
  | { rule: "locked" }
  | { rule: "move"; from: ListingStandardStatus; to: ListingStandardStatus }
  | { rule: "price" }
  | { rule: "needs"; needs: StatusNeed[] };

export type SaveOutcome =
  | { kind: "saved"; listing: Listing }
  | { kind: "refused" }
  | { kind: "offline" }
  /** The listing changed (or was removed: no `current`) since the person read it. */
  | { kind: "conflict"; current?: Listing }
  | { kind: "invalid"; why: Invalid };

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
): { ok: true; listing: Listing } | { ok: false; why: Invalid } {
  const confirmed = { ...listing, version: listing.version + 1, lastConfirmedAt: at };
  if (change.field === "listPrice") {
    if (priceLocked(listing.standardStatus)) return { ok: false, why: { rule: "locked" } };
    if (!Number.isInteger(change.listPrice) || !readPrice(String(change.listPrice)).ok)
      return { ok: false, why: { rule: "price" } };
    return { ok: true, listing: { ...confirmed, listPrice: change.listPrice } };
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
  env: { online: () => boolean } = { online: () => true },
): ListingSaveDoor & { current(id: string): Listing | undefined } {
  const store = new Map(listings.map((l) => [l.id, l]));
  return {
    current: (id) => store.get(id),
    async save({ id, version, change, at }) {
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
