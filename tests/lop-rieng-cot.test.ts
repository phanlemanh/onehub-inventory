// Row 7e E10, written before the code: a company's own fields become columns of the shared grid after the standard
// ones, each with the display kind of its field; and the company's own words never reach the customer page.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import {
  columnKindOf,
  customColumnsOf,
  labelOverrides,
  type FieldKind,
} from "@/modules/company-config";
import { INVENTORY_FIELDS, inventoryColumns, inventoryRows } from "@/modules/listings/ui";
import { label } from "@/modules/company-config";

import { alignFor, customColumn } from "@/components/candidate/column-kind";

const ROOT = join(__dirname, "..");

describe("kieu-cot-rieng", () => {
  it("the five kinds of a custom field map to five display kinds, aligned by the shared rule", () => {
    const matrix: [FieldKind, string, "left" | "right"][] = [
      ["text", "text", "left"],
      ["number", "count", "right"],
      ["date", "date", "left"],
      ["single_select", "select", "left"],
      ["boolean", "boolean", "left"],
    ];
    expect(matrix).toHaveLength(5);
    for (const [kind, display, align] of matrix) {
      const col = customColumn({ code: "x", header: "Cột", kind: columnKindOf(kind) });
      expect(col.kind, kind).toBe(display);
      expect(col.align, kind).toBe(align);
      expect(col.align, kind).toBe(alignFor(col.kind));
      expect(col.field).toBe("custom.x");
    }
  });
});

const HEADERS = Object.fromEntries(INVENTORY_FIELDS.map((f) => [f, f])) as Record<
  (typeof INVENTORY_FIELDS)[number],
  string
>;

/** Throws when any custom column stands before a standard one: the break case names the rule. */
function assertCustomAfterStandard(fields: readonly string[]) {
  const firstCustom = fields.findIndex((f) => f.startsWith("custom."));
  if (firstCustom === -1) return;
  const lastStandard = fields.map((f) => !f.startsWith("custom.")).lastIndexOf(true);
  if (lastStandard > firstCustom) throw new Error("custom column before standard columns");
}

describe("cot-rieng-sau-cot-chuan", () => {
  const fields = [
    { code: "ghi_chu", name: "Ghi chú", kind: "text" as const, position: 2 },
    { code: "huong_view", name: "Hướng view", kind: "single_select" as const, position: 1 },
  ];

  it("custom columns follow the eight standard ones, by position", () => {
    const cols = inventoryColumns(HEADERS, customColumnsOf(fields));
    expect(cols.map((c) => c.field)).toEqual([
      ...INVENTORY_FIELDS,
      "custom.huong_view",
      "custom.ghi_chu",
    ]);
    expect(cols.slice(-2).map((c) => c.header)).toEqual(["Hướng view", "Ghi chú"]);
    expect(() => assertCustomAfterStandard(cols.map((c) => c.field))).not.toThrow();
  });

  it("pha: a custom column put before a standard one is caught", () => {
    const cols = inventoryColumns(HEADERS, customColumnsOf(fields)).map((c) => c.field);
    const broken = [cols.at(-1)!, ...cols.slice(0, -1)];
    expect(() => assertCustomAfterStandard(broken)).toThrow(
      "custom column before standard columns",
    );
  });

  it("rows carry a listing's own values under custom.<code>, and nothing for a list of values", () => {
    const rows = inventoryRows({
      listings: [
        {
          id: "l1",
          companyId: "c",
          buildingName: "A",
          standardStatus: "Active",
          version: 1,
          customFields: { huong_view: "Hồ" },
        },
        {
          id: "l2",
          companyId: "c",
          buildingName: "A",
          standardStatus: "Active",
          version: 1,
          customFields: [],
        },
      ],
      listingUnits: [],
      units: [],
    });
    expect(rows[0]!["custom.huong_view"]).toBe("Hồ");
    expect(Object.keys(rows[1]!).some((k) => k.startsWith("custom."))).toBe(false);
  });

  it("a company label replaces the header of its concept and leaves the others", () => {
    const overrides = labelOverrides([
      { concept: "Building", label: "Block" },
      { concept: "NotAConcept", label: "X" },
    ]);
    expect(label("Building", { overrides })).toBe("Block");
    expect(label("Unit", { overrides })).toBe(label("Unit"));
    expect(Object.keys(overrides)).toEqual(["Building"]);
  });
});

/** Every .ts and .tsx file under a folder, or none when the folder does not exist yet. */
function sources(dir: string): string[] {
  let names: string[];
  try {
    names = readdirSync(dir);
  } catch {
    return [];
  }
  return names.flatMap((n) => {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) return sources(p);
    return /\.tsx?$/.test(n) && !/\.test\.tsx?$/.test(n) ? [p] : [];
  });
}

describe("trang-khach-giu-nhan-chuan", () => {
  // Review Focus 5 (SP-3): the customer page is built from the standard words; the company layer never reaches it.
  const CUSTOMER = ["src/modules/sharing", "src/app/s", "src/app/(public)"];
  const FORBIDDEN = /labelOverrides|myCompanyLayer|overrides\s*:|customColumnsOf/;

  it("no customer page source reads the company's words or columns", () => {
    const files = CUSTOMER.flatMap((d) => sources(join(ROOT, d)));
    expect(files.length).toBeGreaterThan(0);
    const leaks = files.filter((f) => FORBIDDEN.test(readFileSync(f, "utf8")));
    expect(leaks.map((f) => f.slice(ROOT.length + 1))).toEqual([]);
  });

  it("pha: a customer page that passes overrides is caught", () => {
    expect(FORBIDDEN.test('label("Building", { overrides: labelOverrides(l) })')).toBe(true);
    expect(FORBIDDEN.test('label("Building")')).toBe(false);
  });
});
