// Row 7e (lop-rieng-cua-san): the pure rules of the company layer — folding, field drafts, value sets of the standard
// fields, column kinds and template signatures. Matrices are written before the code; each rule has a break case.
import { describe, expect, it } from "vitest";

import {
  FIELD_LIMIT,
  OPTION_LIMIT,
  checkFieldDraft,
  columnKindOf,
  fold,
  templateSignature,
  valueSetOf,
} from "./rules";

describe("folding (Review Focus 2)", () => {
  const PAIRS: [string, string][] = [
    ["ĐN", "dn"],
    ["  Đn ", "dn"],
    ["CÒN", "con"],
    ["con", "con"],
    ["BIỂN", "bien"],
    ["Nội   khu", "noi khu"],
  ];
  it("folds the six spellings written before the code", () => {
    expect(PAIRS).toHaveLength(6);
    expect(PAIRS.map(([a]) => fold(a))).toEqual(PAIRS.map(([, b]) => b));
  });
  it("break: NFD alone leaves «đ»", () => {
    const nfdOnly = (s: string) => s.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
    expect(nfdOnly("ĐN"), "đ survives NFD").toBe("đn");
    expect(fold("ĐN")).toBe("dn");
  });
});

describe("a field draft (E2, AC-11)", () => {
  const existing = {
    liveFields: [{ name: "Ghi chú", code: "ghi_chu" }],
    labels: ["Block"],
    standardHeaders: [
      "Căn",
      "Toà",
      "Dự án",
      "Trạng thái",
      "Giá chào",
      "Diện tích",
      "Phòng ngủ",
      "Xác nhận lúc",
    ],
  };
  const ok = { name: "Hướng view", kind: "single_select" as const, options: ["Biển", "Hồ"] };

  it("takes a good draft and both option bounds", () => {
    expect(checkFieldDraft(ok, existing)).toEqual([]);
    expect(checkFieldDraft({ ...ok, options: ["Biển"] }, existing)).toEqual([]);
    const thirty = Array.from({ length: OPTION_LIMIT }, (_, i) => `Lựa chọn ${i + 1}`);
    expect(checkFieldDraft({ ...ok, options: thirty }, existing)).toEqual([]);
  });

  it("names the problem of each bad draft", () => {
    const thirtyOne = Array.from({ length: OPTION_LIMIT + 1 }, (_, i) => `L${i}`);
    expect(checkFieldDraft({ ...ok, kind: "formula" as never }, existing)).toContain(
      "kind-unknown",
    );
    expect(checkFieldDraft({ ...ok, name: "   " }, existing)).toContain("name-empty");
    expect(checkFieldDraft({ ...ok, name: "a".repeat(41) }, existing)).toContain("name-too-long");
    expect(checkFieldDraft({ ...ok, options: [] }, existing)).toContain("options-count");
    expect(checkFieldDraft({ ...ok, options: thirtyOne }, existing)).toContain("options-count");
    expect(checkFieldDraft({ ...ok, options: ["Biển", "bien"] }, existing)).toContain(
      "options-duplicate",
    );
    expect(
      checkFieldDraft({ name: "Ghi chú 2", kind: "text", options: ["x"] }, existing),
    ).toContain("options-not-allowed");
  });

  it("refuses the four taken names written before the code", () => {
    const TAKEN = ["ghi chu", "Block", "Giá chào", "TOÀ"];
    expect(TAKEN).toHaveLength(4);
    for (const name of TAKEN)
      expect(checkFieldDraft({ ...ok, name }, existing), name).toContain("name-taken");
  });

  it("refuses the 21st field in use and lets a field be renamed onto itself", () => {
    const twenty = {
      ...existing,
      liveFields: Array.from({ length: FIELD_LIMIT }, (_, i) => ({
        name: `Trường ${i}`,
        code: `t${i}`,
      })),
    };
    expect(checkFieldDraft(ok, twenty)).toContain("field-limit");
    expect(checkFieldDraft({ ...ok, name: "Ghi chú" }, existing, "ghi_chu")).toEqual([]);
  });
});

describe("value sets of the fields a dictionary may pair (E4)", () => {
  it("knows the closed sets of the standard fields and of a live single choice field", () => {
    expect(valueSetOf("Listing.standardStatus", [])).toContain("Active");
    expect(valueSetOf("Unit.directionFaces", [])).toEqual([
      "Bắc",
      "Nam",
      "Đông",
      "Tây",
      "Đông Bắc",
      "Đông Nam",
      "Tây Bắc",
      "Tây Nam",
    ]);
    const live = [{ code: "huong_view", kind: "single_select" as const, options: ["Biển", "Hồ"] }];
    expect(valueSetOf("huong_view", live)).toEqual(["Biển", "Hồ"]);
  });
  it("has no set for a free field, a text custom field or a field that does not exist", () => {
    expect(valueSetOf("Listing.listPrice", [])).toBeNull();
    expect(valueSetOf("ghi_chu", [{ code: "ghi_chu", kind: "text", options: [] }])).toBeNull();
    expect(valueSetOf("khong_co", [])).toBeNull();
  });
});

describe("column kind of a custom field (E10)", () => {
  it("maps the five kinds written before the code", () => {
    const MAP = {
      text: "text",
      number: "count",
      date: "date",
      single_select: "select",
      boolean: "boolean",
    } as const;
    expect(Object.keys(MAP)).toHaveLength(5);
    for (const [kind, display] of Object.entries(MAP))
      expect(columnKindOf(kind as keyof typeof MAP)).toBe(display);
  });
});

describe("template signature (E6)", () => {
  const SHEET = ["Mã căn", "Block", "Giá KBP", "View", "Ghi chú"];
  it("folds names and keeps their order", () => {
    expect(templateSignature(SHEET)).toEqual(["ma can", "block", "gia kbp", "view", "ghi chu"]);
    expect(templateSignature(["  MÃ CĂN", "block", "giá kbp ", "VIEW", "ghi  chu"])).toEqual(
      templateSignature(SHEET),
    );
  });
  it("break: a sorted signature matches reordered headers", () => {
    const sorted = (h: string[]) => templateSignature(h).toSorted();
    const reordered = [SHEET[1]!, SHEET[0]!, ...SHEET.slice(2)];
    expect(sorted(reordered), "template matched reordered headers").toEqual(sorted(SHEET));
    expect(templateSignature(reordered)).not.toEqual(templateSignature(SHEET));
  });
});
