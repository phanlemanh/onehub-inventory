// Reading one pasted cell of a listing (roadmap row 5, _acceptance/dan-tu-excel): what a pasted word means for the
// price or the status of one listing, by the edit rules of row 4 and nothing else. Pure and browser-safe: the inventory
// grid's paste preview calls it for every cell of a pasted region, and the rules it calls live in ./edit-rules.
import type { ListingStandardStatus } from "../../generated/ontology";
import { statusLabel } from "../../lib/format";

import {
  STATUS_NEXT,
  canMove,
  foldWords,
  priceAsksAgain,
  priceLocked,
  priceSwing,
  priceUnchanged,
  priceUndoable,
  readPrice,
  statusLocked,
  statusNeeds,
  statusUndoable,
} from "./edit-rules";
import type { PriceOrStatusChange } from "./save-door";

/** The listing a cell belongs to, as the grid row holds it. */
export interface PasteTarget {
  standardStatus: ListingStandardStatus;
  listPrice?: number | null;
  transaction?: "sale" | "lease";
}

/** Why a cell that could be edited is left out of a paste. */
export type PasteSkip =
  /** Closed: price and status stay as sold (row 4, Hỏi-3). */
  | "locked"
  /** The status cannot move there from where it is. */
  | "move"
  /** Closed asks for a close price and date: the cell's own editor asks for them. */
  | "closed-needs"
  /** Withdrawn asks for a reason: the cell's own editor asks for it. */
  | "withdrawn-needs";

export type PasteCell =
  /** The cell will change; `swing` is set when a price moves by more than the asking threshold. */
  | { kind: "change"; change: PriceOrStatusChange; swing?: number; undoable: boolean }
  /** The pasted word leaves the cell as it is (same value, or an empty cell). */
  | { kind: "same" }
  /** The pasted word is not a price, or not a status of this listing's dictionary. */
  | { kind: "wrong"; field: "listPrice" | "standardStatus" }
  | { kind: "skip"; why: PasteSkip };

/** Every status of the listing, in the order of row 4's moves table: the one list of statuses. */
const STATUSES = Object.keys(STATUS_NEXT) as ListingStandardStatus[];

/** The status a pasted word names in the listing's dictionary (sale or lease wording), or null. */
export function readStatusText(
  raw: string,
  transaction?: "sale" | "lease",
): ListingStandardStatus | null {
  const word = foldWords(raw);
  if (word === "") return null;
  return STATUSES.find((s) => foldWords(statusLabel(s, transaction)) === word) ?? null;
}

/** The status words a listing's dictionary has, in the order of the rules, for the «gõ một trong» hint. */
export const statusWords = (transaction?: "sale" | "lease"): string[] =>
  STATUSES.map((s) => statusLabel(s, transaction));

/** One pasted word on the price of a listing. */
export function readPastePrice(target: PasteTarget, raw: string): PasteCell {
  if (raw.trim() === "") return { kind: "same" };
  const read = readPrice(raw);
  if (!read.ok) return { kind: "wrong", field: "listPrice" };
  if (priceUnchanged(target.listPrice, read.value)) return { kind: "same" };
  if (priceLocked(target.standardStatus)) return { kind: "skip", why: "locked" };
  const previous = target.listPrice;
  return {
    kind: "change",
    change: { field: "listPrice", listPrice: read.value },
    undoable: priceUndoable(previous),
    ...(priceAsksAgain(previous, read.value) && previous
      ? { swing: priceSwing(previous, read.value) }
      : {}),
  };
}

/** One pasted word on the status of a listing. */
export function readPasteStatus(target: PasteTarget, raw: string): PasteCell {
  if (raw.trim() === "") return { kind: "same" };
  const to = readStatusText(raw, target.transaction);
  if (to === null) return { kind: "wrong", field: "standardStatus" };
  const from = target.standardStatus;
  if (to === from) return { kind: "same" };
  if (statusLocked(from)) return { kind: "skip", why: "locked" };
  if (!canMove(from, to)) return { kind: "skip", why: "move" };
  // A move that needs more than a word (close price and date, a reason) is the cell editor's to ask (Hỏi-2).
  const needs = statusNeeds(to, {});
  if (needs.length > 0)
    return {
      kind: "skip",
      why: needs.includes("withdrawnReason") ? "withdrawn-needs" : "closed-needs",
    };
  return {
    kind: "change",
    change: { field: "standardStatus", standardStatus: to },
    undoable: statusUndoable(from, to),
  };
}
