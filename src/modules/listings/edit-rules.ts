// Edit rules of a listing (roadmap row 4, in-cell edit): reading a typed price, when a price change asks again, which
// status may follow which, and what a status needs. Pure and browser-safe: the grid cell (row 4) and the quick phone
// edit (row 3d) both call these, so each rule lives in exactly one place. The transitions follow Quỹ hàng ADR-0008
// (onehub-quy-hang commit 1729b11f, packages/core/src/listing/status.ts), approved at row 4's scope gate (Hỏi-3).
import type {
  Listing,
  ListingFurnished,
  ListingOccupantType,
  ListingStandardStatus,
  ListingWithdrawnReason,
} from "../../generated/ontology";

const MILLION = 1_000_000;
const BILLION = 1_000_000_000;

/** No listing is priced above this; a bigger number is a typing slip, not a price. */
export const PRICE_CEILING = 1_000 * BILLION;

/**
 * A price change bigger than this share of the old price asks again with old → new. Quỹ hàng's default; a company
 * setting later reads this constant.
 */
export const PRICE_SWING_ASK = 0.2;

export type PriceRead = { ok: true; value: number } | { ok: false };

/**
 * A number as typed. «4,65» and «4.65» are the same decimal. With `thousands`, «4.650.000.000» or «1.500» groups
 * thousands (full đồng, or millions); a count of billions never does, so «4,655 tỷ» stays 4,655 billion.
 */
function readNumber(text: string, thousands: boolean): number | null {
  if (thousands && /^\d{1,3}([.,]\d{3})+$/.test(text)) return Number(text.replace(/[.,]/g, ""));
  if (!/^\d+([.,]\d+)?$/.test(text)) return null;
  return Number(text.replace(",", "."));
}

/**
 * One way to read a typed or pasted word: no Vietnamese marks, «đ» as «d», no case, outer spaces cut and inner spaces
 * single. A whole cell is read with it (a price, a status), so it trims and collapses spaces; the grid's filter
 * (`foldText`) finds words inside longer text and keeps spaces as typed.
 */
export function foldWords(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/\s+/g, " ");
}

/**
 * A price as brokers type it: «4,65 tỷ», «4.65 tỷ», «4,65t», «4 tỷ 650», «4ty65», «950 triệu», «950tr»,
 * «4650000000», «4.650.000.000». Anything else — empty, words, a bare small number, negative, above the ceiling,
 * two units — is not understood, never guessed.
 */
export function readPrice(raw: string): PriceRead {
  const text = foldWords(raw);
  if (text === "") return { ok: false };
  let value: number | null = null;
  // «4 ty 650», «4ty65»: whole billions, then the digits after the decimal point.
  const split = /^(\d+) ?(?:ty|t) ?(\d{1,3})$/.exec(text);
  const billions = /^(\d+(?:[.,]\d+)?) ?(?:ty|t)$/.exec(text);
  const millions = /^(\d+(?:[.,]\d+)*) ?(?:trieu|tr)$/.exec(text);
  if (split) value = Number(split[1]) * BILLION + Number(`0.${split[2]}`) * BILLION;
  else if (billions) value = (readNumber(billions[1]!, false) ?? NaN) * BILLION;
  else if (millions) value = (readNumber(millions[1]!, true) ?? NaN) * MILLION;
  else {
    const plain = readNumber(text.replace(/ ?(?:d|vnd)$/, ""), true);
    // A bare number is a price only when written in full đồng: «12» or «4,65» alone is ambiguous.
    if (plain !== null && plain >= MILLION) value = plain;
  }
  if (value === null || !Number.isFinite(value)) return { ok: false };
  value = Math.round(value);
  if (value < 1 || value > PRICE_CEILING) return { ok: false };
  return { ok: true, value };
}

/** Whether a new price differs from the old one by more than the asking threshold (exactly 20 % does not ask). */
/** Whether a read price leaves the price as it was: the cell then just closes, nothing is written. */
export function priceUnchanged(previous: number | null | undefined, next: number): boolean {
  return previous === next;
}

export function priceAsksAgain(previous: number | null | undefined, next: number): boolean {
  if (previous === null || previous === undefined || previous <= 0) return false;
  return Math.abs(next - previous) / previous > PRICE_SWING_ASK;
}

/** The share a price moved, signed: 0.25 is up a quarter. */
export const priceSwing = (previous: number, next: number): number => (next - previous) / previous;

/** Statuses a listing may move to from each status (12 moves). Closed and Withdrawn are final: reopening is a new listing. */
export const STATUS_NEXT: Readonly<
  Record<ListingStandardStatus, readonly ListingStandardStatus[]>
> = {
  Incomplete: ["Active", "Hold", "Withdrawn"],
  Active: ["Pending", "Closed", "Hold", "Withdrawn"],
  Pending: ["Active", "Closed", "Withdrawn"],
  Closed: [],
  Hold: ["Active", "Withdrawn"],
  Withdrawn: [],
};

export const nextStatuses = (from: ListingStandardStatus): readonly ListingStandardStatus[] =>
  STATUS_NEXT[from];

export const canMove = (from: ListingStandardStatus, to: ListingStandardStatus): boolean =>
  STATUS_NEXT[from].includes(to);

/** A Closed listing is locked: its price and status stay as sold (Hỏi-3). */
export const priceLocked = (status: ListingStandardStatus): boolean => status === "Closed";

/** A final status has no move left, so its status cell is locked. */
export const statusLocked = (status: ListingStandardStatus): boolean =>
  STATUS_NEXT[status].length === 0;

export type StatusNeed = "closePrice" | "closeDate" | "withdrawnReason";

/** What is still missing before a listing may move to `to` (ontology rules closed-needs-price-and-date and withdrawn-needs-reason). */
export function statusNeeds(
  to: ListingStandardStatus,
  given: Partial<Pick<Listing, "closePrice" | "closeDate" | "withdrawnReason">>,
): StatusNeed[] {
  if (to === "Closed") {
    const needs: StatusNeed[] = [];
    if (!given.closePrice || given.closePrice < 1) needs.push("closePrice");
    if (!given.closeDate) needs.push("closeDate");
    return needs;
  }
  if (to === "Withdrawn") return given.withdrawnReason ? [] : ["withdrawnReason"];
  return [];
}

/**
 * Whether a price change can be undone: the way back is the old price, so there must be one. The save door takes no
 * «no price» change, so a price set on a listing that had none stays.
 */
export const priceUndoable = (previous: number | null | undefined): previous is number =>
  typeof previous === "number" && previous > 0;

/** Whether a status change can be undone: the way back must itself be an allowed move. */
export const statusUndoable = (from: ListingStandardStatus, to: ListingStandardStatus): boolean =>
  canMove(to, from);

/** The reasons a listing is withdrawn (Hỏi-2: Quỹ hàng's three, no «other»). */
export const WITHDRAWN_REASONS: readonly ListingWithdrawnReason[] = [
  "sold_elsewhere",
  "owner_changed_mind",
  "unreachable",
];

/** Longest legal status or financing a listing takes (row 3g): one line of words. */
export const DETAILS_TEXT_LIMIT = 200;

/** The four parts of a listing edited together in its record (row 3g), the order the record shows them. */
export const DETAIL_FIELDS = ["legalStatus", "furnished", "financing", "occupantType"] as const;
export type DetailField = (typeof DETAIL_FIELDS)[number];

/** The fixed values of furnished and occupant type (RESO 2.1; Hỏi-1 of row 3b). */
export const FURNISHED_VALUES: readonly ListingFurnished[] = [
  "Furnished",
  "Partially",
  "Unfurnished",
];
export const OCCUPANT_VALUES: readonly ListingOccupantType[] = ["Owner", "Tenant", "Vacant"];

/** Only an open listing has its details edited (row 3g): a closed or withdrawn one keeps them as they were. */
export const detailsLocked = (status: ListingStandardStatus): boolean =>
  status === "Closed" || status === "Withdrawn";

/** A typed legal status or financing as it is kept: ends trimmed, empty is none. */
export function detailText(raw: string): { ok: true; value: string | null } | { ok: false } {
  const value = raw.trim();
  if (value.length > DETAILS_TEXT_LIMIT) return { ok: false };
  return { ok: true, value: value === "" ? null : value };
}

/**
 * Whether a detail's value from before an edit can be written back by «Hoàn tác» (row 3g): a choice or none always;
 * words only as the save door takes them, so words longer than DETAILS_TEXT_LIMIT, kept from an imported sheet, cannot.
 */
export const detailUndoable = (previous: unknown): boolean =>
  typeof previous !== "string" ||
  (detailText(previous).ok && previous.trim() === previous && previous !== "");
