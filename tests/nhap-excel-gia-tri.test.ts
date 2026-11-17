// E5 of row 11 (nhap-excel, AC-4): the value of every cell — 47 cases written before, each (target, written text) →
// (mark, value, reason); every closed set and every «missing» rule of AC-4; questions grouped by folded spelling.
import { describe, expect, it } from "vitest";

import { label } from "@/modules/company-config";
import {
  markTable,
  markValue,
  NO_CHOICES,
  type LayerView,
  type Target,
  type ValueChoice,
} from "@/modules/imports";

const BASE: LayerView = {
  labels: [],
  fields: [
    { code: "view", name: "View", kind: "single_select", options: ["Biển", "Hồ"] },
    { code: "tang", name: "Tầng", kind: "number", options: [] },
    { code: "ban_giao", name: "Bàn giao", kind: "date", options: [] },
    { code: "goc", name: "Căn góc", kind: "boolean", options: [] },
  ],
  aliases: [],
  templates: [],
};
const ALIASES: LayerView = {
  ...BASE,
  aliases: [
    { field: "Listing.standardStatus", raw: "còn", value: "Active" },
    { field: "Unit.directionFaces", raw: "ĐN", value: "Đông Nam" },
  ],
};
const S = (standard: string) => ({ standard }) as Target;
const C = (custom: string) => ({ custom }) as Target;
const TODAY = "2026-11-17";

type Case = [string, Target, string, string, unknown, string, LayerView?, ValueChoice?];
const CASES: Case[] = [
  ["status pref", S("Listing.standardStatus"), label("StatusActive"), "keep", "Active", "standard"],
  ["status folded", S("Listing.standardStatus"), "dang ban", "fixed", "Active", "standard-folded"],
  ["status upper", S("Listing.standardStatus"), "ĐANG BÁN", "fixed", "Active", "standard-folded"],
  ["status hold", S("Listing.standardStatus"), label("StatusHold"), "keep", "Hold", "standard"],
  [
    "status withdrawn",
    S("Listing.standardStatus"),
    label("StatusWithdrawn"),
    "keep",
    "Withdrawn",
    "standard",
  ],
  [
    "status incomplete",
    S("Listing.standardStatus"),
    label("StatusIncomplete"),
    "keep",
    "Incomplete",
    "standard",
  ],
  [
    "status closed not reachable",
    S("Listing.standardStatus"),
    label("StatusClosed"),
    "ask",
    null,
    "status-not-reachable",
  ],
  [
    "status pending not reachable",
    S("Listing.standardStatus"),
    label("StatusPending"),
    "ask",
    null,
    "status-not-reachable",
  ],
  [
    "company spelling",
    S("Listing.standardStatus"),
    "còn",
    "fixed",
    "Active",
    "company-alias",
    ALIASES,
  ],
  ["unknown spelling", S("Listing.standardStatus"), "còn", "ask", null, "unknown-value"],
  [
    "reason pref",
    S("Listing.withdrawnReason"),
    label("WithdrawnUnreachable"),
    "keep",
    "unreachable",
    "standard",
  ],
  [
    "reason folded",
    S("Listing.withdrawnReason"),
    label("WithdrawnUnreachable").toUpperCase(),
    "fixed",
    "unreachable",
    "standard-folded",
  ],
  ["direction", S("Unit.directionFaces"), "Đông Nam", "keep", "Đông Nam", "standard"],
  [
    "direction folded",
    S("Unit.directionFaces"),
    "dong nam",
    "fixed",
    "Đông Nam",
    "standard-folded",
  ],
  ["direction short unknown", S("Unit.directionFaces"), "ĐN", "ask", null, "unknown-value"],
  [
    "direction company spelling",
    S("Unit.directionFaces"),
    "đn",
    "fixed",
    "Đông Nam",
    "company-alias",
    ALIASES,
  ],
  ["fee KBP", S("Listing.feeInclusion"), "KBP", "fixed", "Excluded", "short-spelling"],
  ["fee pref", S("Listing.feeInclusion"), label("FeeIncluded"), "keep", "Included", "standard"],
  [
    "furnished pref",
    S("Listing.furnished"),
    label("FurnishedFull"),
    "keep",
    "Furnished",
    "standard",
  ],
  [
    "furnished folded",
    S("Listing.furnished"),
    label("FurnishedNone").toLowerCase(),
    "fixed",
    "Unfurnished",
    "standard-folded",
  ],
  [
    "occupant pref",
    S("Listing.occupantType"),
    label("OccupantVacant"),
    "keep",
    "Vacant",
    "standard",
  ],
  [
    "occupant upper",
    S("Listing.occupantType"),
    label("OccupantTenant").toUpperCase(),
    "fixed",
    "Tenant",
    "standard-folded",
  ],
  ["own choice", C("view"), "Biển", "keep", "Biển", "standard"],
  ["own choice unknown", C("view"), "Núi", "ask", null, "unknown-value"],
  ["price billions", S("Listing.listPrice"), "4,65 tỷ", "fixed", 4650000000, "price-read"],
  ["price millions", S("Listing.listPrice"), "950tr", "fixed", 950000000, "price-read"],
  ["price compact", S("Listing.listPrice"), "4ty65", "fixed", 4650000000, "price-read"],
  ["price as Excel number", S("Listing.listPrice"), "4650000000", "keep", 4650000000, "price-read"],
  ["price words", S("Listing.listPrice"), "thoả thuận", "ask", null, "price-unread"],
  ["own number", C("tang"), "12,5", "fixed", 12.5, "custom"],
  ["own number wrong", C("tang"), "abc", "ask", null, "wrong-kind"],
  ["area", S("Unit.livingArea"), "75,2 m²", "fixed", 75.2, "number-read"],
  ["bedrooms", S("Unit.bedroomsTotal"), "2", "keep", 2, "number-read"],
  ["own date", C("ban_giao"), "2026-02-28", "keep", "2026-02-28", "custom"],
  ["own date not real", C("ban_giao"), "2026-02-30", "ask", null, "wrong-kind"],
  [
    "confirmed day-month-year",
    S("Listing.lastConfirmedAt"),
    "15/11/2026",
    "fixed",
    "2026-11-15",
    "date-read",
  ],
  [
    "confirmed after today",
    S("Listing.lastConfirmedAt"),
    "2026-11-20",
    "ask",
    null,
    "date-after-today",
  ],
  ["confirmed not a day", S("Listing.lastConfirmedAt"), "32/11/2026", "ask", null, "date-unread"],
  ["yes", C("goc"), "có", "fixed", true, "custom"],
  ["no", C("goc"), "không", "fixed", false, "custom"],
  ["empty", S("Listing.listPrice"), "", "keep", null, "empty"],
  ["legal text", S("Listing.legalStatus"), "Sổ hồng", "keep", "Sổ hồng", "text"],
  [
    "chosen value",
    S("Listing.standardStatus"),
    "giữ chỗ",
    "fixed",
    "Hold",
    "chosen",
    BASE,
    { value: "Hold", remember: true },
  ],
  [
    "kept as written",
    S("Listing.standardStatus"),
    "giữ chỗ",
    "ask",
    null,
    "kept-as-written",
    BASE,
    { value: null, remember: false },
  ],
];

describe("gia-tri", () => {
  it("44 single values as written before", () => {
    expect(CASES).toHaveLength(44);
    for (const [name, target, raw, mark, value, why, layer, choice] of CASES) {
      const got = markValue(target, raw, {
        layer: layer ?? BASE,
        today: TODAY,
        ...(choice ? { choice } : {}),
      });
      expect([got.mark, got.value, got.why], name).toEqual([mark, value, why]);
    }
  });

  const ctx = (rows: string[][]) => ({
    layer: BASE,
    today: TODAY,
    units: new Map(
      rows.map((r) => [
        r[0]!.toLowerCase(),
        { kind: "catalog" as const, via: "catalog" as const, unitKeys: [`k-${r[0]}`] },
      ]),
    ),
    listed: new Set<string>(),
  });

  it("Ngừng hẳn without a reason asks on the status cell", () => {
    const rows = [["A-1", label("StatusWithdrawn")]];
    const t = markTable({ headers: ["Mã căn", "Trạng thái"], rows }, ctx(rows), NO_CHOICES);
    expect([t.cells[0]![1]!.mark, t.cells[0]![1]!.why]).toEqual(["ask", "status-needs"]);
  });

  it("37 cells «ĐN» and «đn» in one column make exactly one question", () => {
    const rows = Array.from({ length: 37 }, (_, i) => [`A-${i}`, i % 2 ? "ĐN" : "đn"]);
    const t = markTable({ headers: ["Mã căn", "Hướng"], rows }, ctx(rows), NO_CHOICES);
    expect(t.questions.filter((q) => q.kind === "value")).toHaveLength(1);
    expect(t.questions.find((q) => q.kind === "value")).toMatchObject({ cells: 37 });
  });

  it("break: grouping by the written text, not folded, asks twice", () => {
    const rows = [
      ["A-1", "ĐN"],
      ["A-2", "đn"],
      ["A-3", "Đn"],
    ];
    const t = markTable({ headers: ["Mã căn", "Hướng"], rows }, ctx(rows), NO_CHOICES);
    const unfolded = new Set(rows.map((r) => r[1])).size;
    const grouped = t.questions.filter((q) => q.kind === "value").length;
    expect(() => {
      if (unfolded !== grouped)
        throw new Error(`questions not grouped by folded text: ${unfolded} != ${grouped}`);
    }).toThrow("questions not grouped by folded text: 3 != 1");
  });
});
