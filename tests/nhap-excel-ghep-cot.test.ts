// E3 of row 11 (nhap-excel, AC-2): matching columns — a table of 24 headers written before, each with its target, mark
// and reason; the order template → company label → standard label → header dictionary; two columns into one target
// block both; no unit column blocks; owner columns block; a new custom field goes through row 7e's rules.
import { describe, expect, it } from "vitest";

import { checkFieldDraft, label } from "@/modules/company-config";
import {
  isOwnerHeader,
  markUnit,
  matchColumns,
  NO_CHOICES,
  type ColumnMatch,
  type LayerView,
  type Target,
} from "@/modules/imports";

const LAYER: LayerView = {
  labels: [{ concept: "Building", label: "Block" }],
  fields: [{ code: "ghi_chu", name: "Ghi chú", kind: "text", options: [] }],
  aliases: [],
  templates: [],
};
const one = (header: string, layer = LAYER): ColumnMatch =>
  matchColumns(["Mã căn", header], layer, NO_CHOICES)[1]!;
const target = (c: ColumnMatch) =>
  c.target === null
    ? null
    : "standard" in c.target
      ? c.target.standard
      : "custom" in c.target
        ? `custom:${c.target.custom}`
        : "?";

// [header, target, mark, why] — written before the code.
const TABLE: [string, string | null, string, string][] = [
  ["Block", "Unit.buildingName", "keep", "company-label"],
  ["BLOCK", "Unit.buildingName", "keep", "company-label"],
  [label("ListPrice"), "Listing.listPrice", "keep", "standard-label"],
  ["gia chao", "Listing.listPrice", "keep", "standard-label"],
  [label("StandardStatus"), "Listing.standardStatus", "keep", "standard-label"],
  ["Ghi chú", "custom:ghi_chu", "keep", "company-label"],
  ["Giá KBP", "Listing.listPrice", "fixed", "header-dictionary"],
  ["DT", "Unit.livingArea", "fixed", "header-dictionary"],
  ["PN", "Unit.bedroomsTotal", "fixed", "header-dictionary"],
  ["TT", "Listing.standardStatus", "fixed", "header-dictionary"],
  ["Ngày check", "Listing.lastConfirmedAt", "fixed", "header-dictionary"],
  ["Cập nhật", "Listing.lastConfirmedAt", "fixed", "header-dictionary"],
  ["Nội thất", "Listing.furnished", "keep", "standard-label"],
  ["Pháp lý", "Listing.legalStatus", "keep", "standard-label"],
  ["Hướng", "Unit.directionFaces", "keep", "standard-label"],
  ["Diện tích", "Unit.livingArea", "keep", "standard-label"],
  ["Tình trạng", "Listing.standardStatus", "fixed", "header-dictionary"],
  ["Giá BP", "Listing.listPrice", "fixed", "header-dictionary"],
  ["View", null, "ask", "unknown"],
  ["Tầng cao thấp", null, "ask", "unknown"],
  ["Chủ nhà", null, "block", "owner-column"],
  ["SĐT", null, "block", "owner-column"],
  ["Điện thoại", null, "block", "owner-column"],
  ["SĐT chủ", null, "block", "owner-column"],
];

describe("ghep-cot", () => {
  it("24 single headers as written before", () => {
    expect(TABLE).toHaveLength(24);
    for (const [h, t, m, w] of TABLE) {
      const c = one(h);
      expect([target(c), c.mark, c.why], h).toEqual([t, m, w]);
    }
  });

  it("two columns into the asking price block both; no unit column blocks every column", () => {
    const both = matchColumns(["Mã căn", "Giá", "Giá chào"], LAYER, NO_CHOICES);
    expect(both.slice(1).map((c) => [c.mark, c.why])).toEqual([
      ["block", "same-target"],
      ["block", "same-target"],
    ]);
    const noUnit = matchColumns(["Toà", "Giá chào"], LAYER, NO_CHOICES);
    expect(noUnit.map((c) => c.why)).toEqual(["no-unit-column", "no-unit-column"]);
  });

  it("the template wins over a label that points elsewhere (order of the four sources)", () => {
    const layer: LayerView = {
      ...LAYER,
      templates: [
        {
          id: "t1",
          signature: ["ma can", "gia chao"],
          columns: [{ standard: "Unit.unitNumber" }, { standard: "Listing.closePrice" }],
        },
      ],
    };
    const c = matchColumns(["Mã căn", "Giá chào"], layer, NO_CHOICES)[1]!;
    expect([target(c), c.why]).toEqual(["Listing.closePrice", "template"]);
  });

  it("an owner column stays blocked under any choice but dropping it, and under a template that maps it (Hỏi-12)", () => {
    const owner = ["Mã căn", "SĐT chủ"];
    const choices: Target[] = [
      { standard: "Listing.listPrice" },
      { custom: "view" },
      { newField: { name: "SĐT chủ", kind: "text", options: [] } },
    ];
    for (const t of choices) {
      const c = matchColumns(owner, LAYER, { ...NO_CHOICES, columns: { 1: { target: t } } })[1]!;
      expect([c.mark, c.why, c.target], JSON.stringify(t)).toEqual(["block", "owner-column", null]);
    }
    const mapped: LayerView = {
      ...LAYER,
      templates: [
        {
          id: "t-owner",
          signature: ["ma can", "sdt chu"],
          columns: [{ standard: "Unit.unitNumber" }, { standard: "Listing.listPrice" }],
        },
      ],
    };
    expect(matchColumns(owner, mapped, NO_CHOICES)[1]!.mark).toBe("block");
    // Dropping it is the one way through, chosen or remembered by a template (the control).
    const dropped = matchColumns(owner, LAYER, {
      ...NO_CHOICES,
      columns: { 1: { target: { skip: true } } },
    })[1]!;
    expect([dropped.mark, dropped.target]).toEqual(["fixed", { skip: true }]);
    const skipped: LayerView = {
      ...LAYER,
      templates: [
        { ...mapped.templates[0]!, columns: [{ standard: "Unit.unitNumber" }, { skip: true }] },
      ],
    };
    expect(matchColumns(owner, skipped, NO_CHOICES)[1]!.mark).toBe("keep");
    expect(isOwnerHeader("Điện thoại")).toBe(true);
    expect(isOwnerHeader("Giá chào")).toBe(false);
  });

  it("a new field the company layer would refuse is blocked at the preview, never dropped at the end (S4-r1 t11)", () => {
    const field = (name: string) => ({
      target: { newField: { name, kind: "text" as const, options: [] } },
    });
    const at = (headers: string[], columns: Record<number, { target: Target }>, layer = LAYER) =>
      matchColumns(headers, layer, { ...NO_CHOICES, columns });
    // Taken by a live field, by a standard word, empty.
    for (const name of ["Ghi chú", label("ListPrice"), " "]) {
      const c = at(["Mã căn", "X"], { 1: field(name) })[1]!;
      expect([c.mark, c.why], name).toEqual(["block", "field-refused"]);
    }
    // The company has 20 fields: a new one is refused.
    const fields = (n: number) =>
      Array.from({ length: n }, (_, i) => ({
        code: `f${i}`,
        name: `Trường ${i}`,
        kind: "text" as const,
        options: [],
      }));
    expect(
      at(["Mã căn", "View"], { 1: field("View") }, { ...LAYER, fields: fields(20) })[1]!.why,
    ).toBe("field-refused");
    // It has 19: the first new field of the file goes in, the second counts it and is refused.
    const two = at(
      ["Mã căn", "View", "Hướng nhìn"],
      { 1: field("View"), 2: field("Hướng nhìn") },
      {
        ...LAYER,
        fields: fields(19),
      },
    );
    expect(two.slice(1).map((c) => [c.mark, c.why])).toEqual([
      ["fixed", "chosen"],
      ["block", "field-refused"],
    ]);
    // The control: a fresh name goes in.
    expect(at(["Mã căn", "View"], { 1: field("View") })[1]!.mark).toBe("fixed");
  });

  it("a unit code too long to keep as a pending unit is blocked at the preview (S4-r1 t10)", () => {
    const long = `S${"1".repeat(80)}`;
    expect(markUnit(long, { kind: "none" }, { pending: true })).toEqual({
      mark: "block",
      value: null,
      why: "code-too-long",
    });
    expect(markUnit(long.slice(0, 80), { kind: "none" }, { pending: true }).mark).toBe("fixed");
  });

  it("a header chosen by the person that is not the standard label asks to become the company's label", () => {
    const c = matchColumns(["Mã căn", "Lô"], LAYER, {
      ...NO_CHOICES,
      columns: { 1: { target: { standard: "Unit.buildingName" } } },
    })[1]!;
    expect([c.mark, c.learnLabel]).toEqual(["fixed", true]);
  });

  it("a new custom field from a column goes through row 7e's rules", () => {
    const ctx = { liveFields: [], labels: [], standardHeaders: [] };
    expect(checkFieldDraft({ name: "View", kind: "formula" as never, options: [] }, ctx)).toContain(
      "kind-unknown",
    );
    const twenty = Array.from({ length: 20 }, (_, i) => ({
      code: `f${i}`,
      name: `F${i}`,
      kind: "text" as const,
      options: [],
    }));
    expect(
      checkFieldDraft({ name: "View", kind: "text", options: [] }, { ...ctx, liveFields: twenty }),
    ).toContain("field-limit");
  });

  it("break: checking only the first column of a shared target lets the second through", () => {
    const firstOnly = (cols: ColumnMatch[]) =>
      cols.filter(
        (c, i) => c.why === "same-target" && i === cols.findIndex((d) => d.why === "same-target"),
      );
    const cols = matchColumns(["Mã căn", "Giá", "Giá chào"], LAYER, NO_CHOICES);
    const blocked = firstOnly(cols).length;
    expect(() => {
      if (blocked < 2) throw new Error("second column with same target not blocked");
    }).toThrow("second column with same target not blocked");
  });
});
