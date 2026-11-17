// E3 of row 11 (nhap-excel, AC-2): matching columns — a table of 24 headers written before, each with its target, mark
// and reason; the order template → company label → standard label → header dictionary; two columns into one target
// block both; no unit column blocks; owner columns block; a new custom field goes through row 7e's rules.
import { describe, expect, it } from "vitest";

import { checkFieldDraft, label } from "@/modules/company-config";
import { matchColumns, NO_CHOICES, type ColumnMatch, type LayerView } from "@/modules/imports";

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
