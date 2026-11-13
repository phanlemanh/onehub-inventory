// Roadmap row 3f (_acceptance/loi-vao-ho-so): finding a unit by its code and how the inventory opens for it (E6).
import { describe, expect, it } from "vitest";

import type { GridRow } from "@/components/candidate/data-region";
import { findByCode, inventoryOpeningFor } from "@/modules/listings/ui";

/** The matrix, written before the code: code A in three buildings, B in one, C in two with different letter case. */
const row = (id: string, code: string, building: string, subdivision = "Khu 1"): GridRow => ({
  id,
  "Listing.unitNumber": code,
  "Listing.buildingName": building,
  "Listing.subdivisionName": subdivision,
  "Listing.standardStatus": "Active",
  "Listing.listPrice": null,
  "Unit.livingArea": null,
  "Unit.bedroomsTotal": null,
  "Listing.lastConfirmedAt": null,
});
const MATRIX: GridRow[] = [
  row("a1", "A", "T1"),
  row("b1", "B", "T1"),
  row("a2", "A", "T2"),
  row("c1", "c-1", "T1"),
  row("a3", "A", "T3"),
  row("c2", "C-1", "T2"),
  row("a10", "A-10", "T1"),
];

describe("findByCode", () => {
  it("finds a code in several buildings, in the order the rows come", () => {
    const r = findByCode(MATRIX, "A");
    expect(r.kind, "building missing from choice").toBe("nhieu");
    expect(r.rows.map((x) => x.id)).toEqual(["a1", "a2", "a3"]);
    // The matrix holds A in three buildings: the choice has one row per building.
    expect(new Set(r.rows.map((x) => x["Listing.buildingName"])).size).toBe(3);
  });

  it("finds a code in one building", () => {
    const r = findByCode(MATRIX, "B");
    expect(r.kind).toBe("mot");
    expect(r.rows.map((x) => x.id)).toEqual(["b1"]);
  });

  it("ignores spaces at both ends and letter case", () => {
    const r = findByCode(MATRIX, " c-1 ");
    expect(r.kind).toBe("nhieu");
    expect(r.rows.map((x) => x.id)).toEqual(["c1", "c2"]);
  });

  it("matches the whole code, never a prefix", () => {
    expect(findByCode(MATRIX, "A-").kind, "partial code matched a unit").toBe("khong");
    expect(findByCode(MATRIX, "A-1").kind, "partial code matched a unit").toBe("khong");
    expect(findByCode(MATRIX, "A-10").kind).toBe("mot");
  });

  it("finds nothing for an unknown or empty code", () => {
    expect(findByCode(MATRIX, "Z").kind).toBe("khong");
    expect(findByCode(MATRIX, "   ").kind).toBe("khong");
  });
});

describe("inventoryOpeningFor", () => {
  it("one unit: the unit column is filtered and its record opens", () => {
    expect(inventoryOpeningFor(MATRIX, { code: "b" })).toEqual({
      filters: { "Listing.unitNumber": "b" },
      recordId: "b1",
    });
  });

  it("several buildings: the unit column is filtered and no record opens", () => {
    const o = inventoryOpeningFor(MATRIX, { code: "A" });
    expect(o.filters).toEqual({ "Listing.unitNumber": "A" });
    expect(o.recordId, "many buildings opened the first").toBeNull();
  });

  it("an unknown code still fills the unit column, so the grid says nothing matches", () => {
    expect(inventoryOpeningFor(MATRIX, { code: " Z-99.99 " })).toEqual({
      filters: { "Listing.unitNumber": "Z-99.99" },
      recordId: null,
    });
  });

  it("a building or a subdivision filters its own column and opens no record", () => {
    expect(inventoryOpeningFor(MATRIX, { building: "T2" })).toEqual({
      filters: { "Listing.buildingName": "T2" },
      recordId: null,
    });
    expect(inventoryOpeningFor(MATRIX, { subdivision: "Khu 1" })).toEqual({
      filters: { "Listing.subdivisionName": "Khu 1" },
      recordId: null,
    });
  });

  it("nothing asked: no filter, no record", () => {
    expect(inventoryOpeningFor(MATRIX, {})).toEqual({ filters: {}, recordId: null });
  });
});
