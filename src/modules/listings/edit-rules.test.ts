// Row 4 (sua-tren-o) evals E1, E4, E5: the edit rules against matrices written before the code. Each case name is the
// pinned message a break pair turns red with (see _acceptance/sua-tren-o/evals.yaml).
import { describe, expect, it } from "vitest";

import type { ListingStandardStatus } from "../../generated/ontology";
import {
  STATUS_NEXT,
  canMove,
  priceAsksAgain,
  priceLocked,
  readPrice,
  statusLocked,
  statusNeeds,
  statusUndoable,
} from "./index";

/** Written first: 16 prices brokers type, 8 strings that must stay «not understood». */
const PRICES: readonly (readonly [string, number | null])[] = [
  ["4,65 tỷ", 4_650_000_000],
  ["4.65 tỷ", 4_650_000_000],
  ["4,65t", 4_650_000_000],
  ["4 tỷ 650", 4_650_000_000],
  ["4ty65", 4_650_000_000],
  ["4,655 tỷ", 4_655_000_000],
  ["950 triệu", 950_000_000],
  ["950tr", 950_000_000],
  ["950 tr", 950_000_000],
  ["4650000000", 4_650_000_000],
  ["4.650.000.000", 4_650_000_000],
  ["1,2 tỷ", 1_200_000_000],
  ["12 tỷ", 12_000_000_000],
  ["2,8 TỶ", 2_800_000_000],
  ["  3 tỷ  ", 3_000_000_000],
  ["1.500 triệu", 1_500_000_000],
  ["", null],
  ["abc", null],
  ["12", null],
  ["4,65", null],
  ["-4 tỷ", null],
  ["1001 tỷ", null],
  ["4,65 tỷ 3 triệu 2", null],
  ["tỷ", null],
];

describe("doc-gia-bang-viet-truoc", () => {
  it("the written-first table has 24 rows", () => {
    expect(PRICES.length).toBe(24);
  });
  it.each(PRICES)("doc-gia-bang-viet-truoc: %s", (raw, expected) => {
    const read = readPrice(raw);
    expect(read).toEqual(expected === null ? { ok: false } : { ok: true, value: expected });
  });
});

/** Written first: the threshold's edges, both ways, and the two cases that never ask. */
const SWINGS: readonly (readonly [string, number | null, number, boolean])[] = [
  ["+20%", 1_000_000_000, 1_200_000_000, false],
  ["+20,01%", 1_000_000_000, 1_200_100_000, true],
  ["-20%", 1_000_000_000, 800_000_000, false],
  ["-20,01%", 1_000_000_000, 799_900_000, true],
  ["chua-co-gia", null, 5_000_000_000, false],
  ["cung-gia", 2_710_000_000, 2_710_000_000, false],
];

describe("nguong-hoi-lai", () => {
  it.each(SWINGS)("nguong-hoi-lai: %s", (_name, previous, next, asks) => {
    expect(priceAsksAgain(previous, next)).toBe(asks);
  });
});

const STATUSES: readonly ListingStandardStatus[] = [
  "Incomplete",
  "Active",
  "Pending",
  "Closed",
  "Hold",
  "Withdrawn",
];

/** Written first: the 12 allowed moves of Quỹ hàng ADR-0008, as «from→to». */
const ALLOWED = new Set([
  "Incomplete→Active",
  "Incomplete→Hold",
  "Incomplete→Withdrawn",
  "Active→Pending",
  "Active→Closed",
  "Active→Hold",
  "Active→Withdrawn",
  "Pending→Active",
  "Pending→Closed",
  "Pending→Withdrawn",
  "Hold→Active",
  "Hold→Withdrawn",
]);

const CELLS = STATUSES.flatMap((from) => STATUSES.map((to) => `${from}→${to}`));

describe("bang-chuyen-36-o", () => {
  it("walks 36 cells, 12 of them allowed", () => {
    expect(CELLS.length).toBe(36);
    expect(ALLOWED.size).toBe(12);
    expect(Object.values(STATUS_NEXT).flat().length).toBe(12);
  });
  it.each(CELLS)("bang-chuyen-36-o: %s", (cell) => {
    const [from, to] = cell.split("→") as [ListingStandardStatus, ListingStandardStatus];
    expect(canMove(from, to)).toBe(ALLOWED.has(cell));
  });
});

describe("dieu-kien-nac", () => {
  it("dieu-kien-nac: Closed needs the close price and date", () => {
    expect(statusNeeds("Closed", {})).toEqual(["closePrice", "closeDate"]);
    expect(statusNeeds("Closed", { closePrice: 2_800_000_000 })).toEqual(["closeDate"]);
    expect(statusNeeds("Closed", { closePrice: 2_800_000_000, closeDate: "2026-11-13" })).toEqual(
      [],
    );
  });
  it("dieu-kien-nac: Withdrawn needs a reason", () => {
    expect(statusNeeds("Withdrawn", {})).toEqual(["withdrawnReason"]);
    expect(statusNeeds("Withdrawn", { withdrawnReason: "unreachable" })).toEqual([]);
  });
  it("dieu-kien-nac: other moves need nothing", () => {
    for (const to of ["Active", "Pending", "Hold", "Incomplete"] as const)
      expect(statusNeeds(to, {})).toEqual([]);
  });
});

describe("hoan-tac-duoc", () => {
  it("hoan-tac-duoc: a move into a final status cannot be undone", () => {
    expect(statusUndoable("Active", "Closed")).toBe(false);
    expect(statusUndoable("Pending", "Withdrawn")).toBe(false);
  });
  it("hoan-tac-duoc: a move whose way back is allowed can be undone", () => {
    expect(statusUndoable("Active", "Pending")).toBe(true);
    expect(statusUndoable("Active", "Hold")).toBe(true);
    // Incomplete → Active cannot go back: no move returns to Incomplete.
    expect(statusUndoable("Incomplete", "Active")).toBe(false);
  });
  it("hoan-tac-duoc: Closed locks price and status, Withdrawn locks status only", () => {
    expect(priceLocked("Closed")).toBe(true);
    expect(statusLocked("Closed")).toBe(true);
    expect(priceLocked("Withdrawn")).toBe(false);
    expect(statusLocked("Withdrawn")).toBe(true);
    expect(statusLocked("Active")).toBe(false);
  });
});
