// Roadmap row 3f (_acceptance/loi-vao-ho-so): finding a unit by its code and how the inventory opens for it (E6).
import { describe, expect, it } from "vitest";

import type { GridRow } from "@/components/candidate/data-region";
import type { NavItem } from "@/components/templates/app-shell";
import type { Role } from "@/generated/ontology";
import {
  findByCode,
  inventoryOpeningFor,
  searchHref,
  searchSuggestions,
} from "@/modules/listings/ui";

import { NAV, searchShownFor } from "../src/app/(app)/nav";

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

describe("searchSuggestions", () => {
  it("one suggestion per code, with every building it is in", () => {
    const list = searchSuggestions(MATRIX, "a");
    const units = list.filter((s) => s.kind === "unit");
    expect(units.map((s) => s.value)).toEqual(["A", "A-10"]);
    expect(units[0]!.buildings, "building missing from choice").toEqual(["T1", "T2", "T3"]);
  });

  it("a code typed whole comes before the codes it starts", () => {
    const list = searchSuggestions([row("x", "A-10", "T1"), row("y", "a", "T2")], " A ");
    expect(list[0]).toMatchObject({ kind: "unit", value: "a" });
  });

  it("codes match from their start; buildings and subdivisions anywhere", () => {
    expect(searchSuggestions(MATRIX, "-1").filter((s) => s.kind === "unit")).toEqual([]);
    const places = searchSuggestions(MATRIX, "khu");
    expect(places).toEqual([{ kind: "subdivision", value: "Khu 1", buildings: [] }]);
    const buildings = searchSuggestions(MATRIX, "t");
    expect(buildings.map((s) => `${s.kind}:${s.value}`)).toEqual([
      "building:T1",
      "building:T2",
      "building:T3",
    ]);
  });

  it("nothing typed suggests nothing, and never more than eight", () => {
    expect(searchSuggestions(MATRIX, "  ")).toEqual([]);
    const many = Array.from({ length: 20 }, (_, i) => row(`r${i}`, `9${i}`, "T9"));
    expect(searchSuggestions(many, "9")).toHaveLength(8);
  });
});

describe("searchHref", () => {
  it("puts the text in the parameter of its kind, trimmed", () => {
    expect(searchHref("unit", " 0601 ")).toBe("/inventory?ma=0601");
    expect(searchHref("building", "S1.02")).toBe("/inventory?toa=S1.02");
    expect(searchHref("subdivision", "Khu 1")).toBe("/inventory?du-an=Khu+1");
  });
});

describe("the top-bar search slot follows the inventory entry (E5)", () => {
  type Rule = (nav: readonly NavItem[], roles: readonly Role[]) => boolean;
  const NAV_WITH_ROLES: NavItem[] = [
    { href: "/", title: "Hôm nay" },
    { href: "/inventory", title: "Bảng hàng", roles: ["ListAgent", "BuyerAgent", "TeamLead"] },
  ];
  /** The measure: no inventory entry, no search; an inventory entry, a search. */
  function checkGate(rule: Rule): void {
    expect(rule(NAV_WITH_ROLES, ["CompanyAdmin"]), "jump shown without inventory").toBe(false);
    expect(rule(NAV_WITH_ROLES, []), "jump shown without inventory").toBe(false);
    expect(rule(NAV_WITH_ROLES, ["CompanyAdmin", "ListAgent"])).toBe(true);
    expect(rule(NAV, ["BuyerAgent"])).toBe(true);
  }

  it("shows the search exactly when the person's roles open the inventory", () => {
    checkGate(searchShownFor);
  });

  it("the check fails when the search always shows", () => {
    expect(() => checkGate(() => true)).toThrow("jump shown without inventory");
  });
});
