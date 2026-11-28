// The import preview's catalog mark (row 3h, AC-8), pure: only a read cell of a unit attribute on a row matched to a
// catalog unit, whose value is not the catalog's, carries the catalog's value.
import { describe, expect, it } from "vitest";

import { markCatalogDiffers } from "./catalog-differs";
import type { MarkedTable } from "./table";

const col = (index: number, standard: string | null) => ({
  index,
  header: `h${index}`,
  target: standard ? ({ standard } as never) : null,
  mark: "keep" as const,
  why: "header-dictionary" as const,
  learnLabel: null,
});
const read = (value: string | number | null, mark: "keep" | "fixed" | "ask" = "keep") => ({
  mark,
  value,
  why: "number-read",
});

const TABLE: MarkedTable = {
  columns: [
    col(0, "unitCode"),
    col(1, "Unit.livingArea"),
    col(2, "Unit.directionFaces"),
    col(3, "Listing.listPrice"),
  ],
  cells: [
    [read("A-01"), read(72.5), read("dong nam", "fixed"), read(3e9)],
    [read("A-02"), read(68), read(null), read(3e9)],
    [read("SA5"), read(80), read("Nam"), read(1e9)],
    [read("A-03"), read(70, "ask"), read("Tây"), read(1e9)],
  ],
  rows: [
    { fate: "create", unit: { unitKey: "unt_1" } },
    { fate: "create", unit: { unitKey: "unt_2" } },
    { fate: "create", unit: { pendingUnitId: "p-1" } },
    { fate: "create", unit: { unitKey: "unt_3" } },
  ],
  counts: { keep: 0, fixed: 0, ask: 0, block: 0 },
  createCount: 4,
  keptCount: 0,
  notCreatedCount: 0,
  canApply: true,
  questions: [],
};

describe("markCatalogDiffers", () => {
  it("marks only the read attribute cell that differs from its row's catalog unit", () => {
    const units = new Map([
      ["unt_1", { livingArea: 70, directionFaces: "Đông Nam" }],
      ["unt_2", { livingArea: 68, directionFaces: "Bắc" }],
      ["unt_3", { livingArea: 75, directionFaces: null }],
    ]);
    const out = markCatalogDiffers(TABLE, units);
    const marked = out.cells.flatMap((row, r) =>
      row.flatMap((c, j) => ("catalog" in c ? [[r, j, (c as { catalog: unknown }).catalog]] : [])),
    );
    // Row 0: area 72,5 vs 70 (marked); «dong nam» folds to the catalog's «Đông Nam» (same). Row 1: same area, an empty
    // direction. Row 2: a pending unit. Row 3: the area asks, the catalog has no direction. Prices are not attributes.
    expect(marked).toEqual([[0, 1, 70]]);
    expect(out.cells[0]![1]).toMatchObject({ value: 72.5 });
  });
  it("gives the table back as it is when no row matched a catalog unit", () => {
    expect(markCatalogDiffers(TABLE, new Map())).toBe(TABLE);
  });
});
