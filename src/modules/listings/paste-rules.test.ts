// Row 5 (dan-tu-excel) evals E2, E4: one pasted cell read by the row 4 rules, against tables written before the code.
// Each case name is the pinned message a break pair turns red with (see _acceptance/dan-tu-excel/evals.yaml).
import { describe, expect, it } from "vitest";

import { readPastePrice, readPasteStatus, readStatusText, type PasteCell } from "./index";
import type { ListingStandardStatus } from "@/generated/ontology";
import { statusLabel } from "@/lib/format";
/** A status as the label table words it (labels are never written by hand in src, tests/language.test.ts). */
const S = (status: ListingStandardStatus, tx?: "sale" | "lease") => statusLabel(status, tx);

type Case = readonly [
  name: string,
  field: "price" | "status",
  target: {
    standardStatus: "Active" | "Pending" | "Hold" | "Incomplete";
    listPrice?: number | null;
    transaction?: "sale" | "lease";
  },
  raw: string,
  expected: PasteCell["kind"],
  value?: number | string,
];

const ACTIVE = { standardStatus: "Active", listPrice: 4_650_000_000 } as const;
const ACTIVE_LEASE = {
  standardStatus: "Active",
  listPrice: 25_000_000,
  transaction: "lease",
} as const;

/** Written first: 24 pasted words — 8 prices read, 4 not, 6 status words, 3 strange words, 2 empty cells, 1 same value. */
const CASES: readonly Case[] = [
  ["gia 4,8 tỷ", "price", ACTIVE, "4,8 tỷ", "change", 4_800_000_000],
  ["gia 4.8 tỷ", "price", ACTIVE, "4.8 tỷ", "change", 4_800_000_000],
  ["gia 4ty7", "price", ACTIVE, "4ty7", "change", 4_700_000_000],
  ["gia 4 tỷ 655", "price", ACTIVE, "4 tỷ 655", "change", 4_655_000_000],
  ["gia 4,655 tỷ", "price", ACTIVE, "4,655 tỷ", "change", 4_655_000_000],
  ["gia 4.700.000.000", "price", ACTIVE, "4.700.000.000", "change", 4_700_000_000],
  ["gia 4700000000", "price", ACTIVE, "4700000000", "change", 4_700_000_000],
  ["gia 30 triệu cho thue", "price", ACTIVE_LEASE, "30 triệu", "change", 30_000_000],
  ["gia hai ty", "price", ACTIVE, "hai tỷ", "wrong"],
  ["gia 4,65", "price", ACTIVE, "4,65", "wrong"],
  ["gia -5 tỷ", "price", ACTIVE, "-5 tỷ", "wrong"],
  ["gia 1001 tỷ", "price", ACTIVE, "1001 tỷ", "wrong"],
  ["trang thai giao dich", "status", ACTIVE, S("Pending"), "change", "Pending"],
  ["trang thai khong dau", "status", ACTIVE, "dang giao dich", "change", "Pending"],
  ["trang thai chu hoa", "status", ACTIVE, "TẠM NGỪNG", "change", "Hold"],
  [
    "trang thai cach thua",
    "status",
    { standardStatus: "Hold" },
    "  Đang   bán ",
    "change",
    "Active",
  ],
  [
    "trang thai cho thue",
    "status",
    { standardStatus: "Hold", transaction: "lease" },
    S("Active", "lease"),
    "change",
    "Active",
  ],
  ["trang thai giu cho", "status", { standardStatus: "Pending" }, S("Active"), "change", "Active"],
  ["trang thai la", "status", ACTIVE, "Còn hàng", "wrong"],
  ["trang thai so", "status", ACTIVE, "1", "wrong"],
  [
    "trang thai ban o can thue",
    "status",
    { standardStatus: "Hold", transaction: "lease" },
    S("Active"),
    "wrong",
  ],
  ["o trong gia", "price", ACTIVE, "", "same"],
  ["o trong trang thai", "status", ACTIVE, "   ", "same"],
  ["gia giong het", "price", ACTIVE, "4,65 tỷ", "same"],
];

describe("doc-o-dan-viet-truoc", () => {
  it("the written-first table has 24 cases", () => {
    expect(CASES.length).toBe(24);
  });
  for (const [name, field, target, raw, kind, value] of CASES)
    it(`doc-o-dan-viet-truoc: ${name}`, () => {
      const read = field === "price" ? readPastePrice(target, raw) : readPasteStatus(target, raw);
      expect(read.kind).toBe(kind);
      if (read.kind === "change") {
        const got =
          read.change.field === "listPrice" ? read.change.listPrice : read.change.standardStatus;
        expect(got).toBe(value);
      }
    });
});

/** Written first: the skip reasons the rules give a pasted word (the column reasons are the grid's, listing-paste). */
const SKIPS: readonly (readonly [
  string,
  "price" | "status",
  { standardStatus: string; listPrice?: number },
  string,
  string,
])[] = [
  [
    "khoa-da-ban-gia",
    "price",
    { standardStatus: "Closed", listPrice: 4_000_000_000 },
    "4,2 tỷ",
    "locked",
  ],
  ["khoa-da-ban-trang-thai", "status", { standardStatus: "Closed" }, S("Active"), "locked"],
  ["nac-khong-di-duoc", "status", { standardStatus: "Pending" }, S("Hold"), "move"],
  ["nac-da-ban", "status", { standardStatus: "Active" }, S("Closed"), "closed-needs"],
  ["nac-ngung-han", "status", { standardStatus: "Hold" }, S("Withdrawn"), "withdrawn-needs"],
];

describe("ly-do-bo-tu-luat", () => {
  it.each(SKIPS)("ly-do-bo-tu-luat: %s", (_name, field, target, raw, why) => {
    const t = target as Parameters<typeof readPastePrice>[0];
    const read = field === "price" ? readPastePrice(t, raw) : readPasteStatus(t, raw);
    expect(read).toEqual({ kind: "skip", why });
  });
});

/** Written first: the asking threshold of row 4, read by the paste preview — the edges both ways, and no price yet. */
const SWINGS: readonly (readonly [string, number | null, string, boolean])[] = [
  ["+20%", 1_000_000_000, "1,2 tỷ", false],
  ["+20,01%", 1_000_000_000, "1.200.100.000", true],
  ["-20%", 1_000_000_000, "800 triệu", false],
  ["-20,01%", 1_000_000_000, "799.900.000", true],
  ["chua co gia", null, "1 tỷ", false],
];

describe("nguong-dan-dau-phan-tram", () => {
  it.each(SWINGS)("nguong-dan-dau-phan-tram: %s", (_name, before, raw, marked) => {
    const read = readPastePrice({ standardStatus: "Active", listPrice: before }, raw);
    expect(read.kind).toBe("change");
    expect(read.kind === "change" && read.swing !== undefined).toBe(marked);
  });
});

describe("hoan-tac-duoc-khi-dan", () => {
  it("a move whose way back is not allowed is pasted as not undoable", () => {
    const read = readPasteStatus({ standardStatus: "Incomplete" }, S("Active"));
    expect(read).toMatchObject({ kind: "change", undoable: false });
  });
  it("a move whose way back is allowed is undoable", () => {
    expect(readPasteStatus({ standardStatus: "Active" }, S("Hold"))).toMatchObject({
      undoable: true,
    });
  });
  it("the dictionary reads each status word back to its status", () => {
    expect(readStatusText(S("Incomplete"))).toBe("Incomplete");
    expect(readStatusText(S("Closed", "lease"), "lease")).toBe("Closed");
  });
});
