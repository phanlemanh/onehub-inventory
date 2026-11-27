// The catalog's unit readers (rows 10, 3h) on a fake client: what they ask and how a row becomes a unit.
import { describe, expect, it } from "vitest";

import { readCatalogUnits, readCatalogUnitsByKey } from "./read-units";

const ROW = {
  upi: "upi-1",
  unit_number: "A-01",
  building_name: "[MAU] B1",
  floor: "7",
  living_area: "68.5",
  bedrooms_total: 2,
  direction_faces: "Đông Nam",
  property_sub_type: "Condominium",
  subdivision_name: "[MAU] P1",
  complex_name: null,
};

function fake(rows: unknown[]) {
  const asked: { text: string; values: unknown[] | undefined }[] = [];
  return {
    asked,
    client: {
      query: async (text: string, values?: unknown[]) => {
        asked.push({ text, values });
        return { rows };
      },
    },
  };
}

describe("readCatalogUnits", () => {
  it("asks nothing for no UPI, and reads a row as a unit: numbers as numbers, empty values left out", async () => {
    const none = fake([]);
    expect(await readCatalogUnits(none.client, [])).toEqual([]);
    expect(none.asked).toEqual([]);
    const f = fake([
      ROW,
      { ...ROW, upi: "upi-2", floor: null, living_area: null, complex_name: "[MAU] C1" },
    ]);
    const units = await readCatalogUnits(f.client, ["upi-1", "upi-2", "upi-1"]);
    expect(f.asked[0]!.values).toEqual([["upi-1", "upi-2"]]);
    expect(units[0]).toEqual({
      upi: "upi-1",
      unitNumber: "A-01",
      buildingName: "[MAU] B1",
      subdivisionName: "[MAU] P1",
      floor: "7",
      livingArea: 68.5,
      bedroomsTotal: 2,
      directionFaces: "Đông Nam",
      propertySubType: "Condominium",
    });
    expect(units[1]).not.toHaveProperty("floor");
    expect(units[1]).not.toHaveProperty("livingArea");
    expect(units[1]).toMatchObject({ complexName: "[MAU] C1" });
  });
});

describe("readCatalogUnitsByKey (row 3h)", () => {
  it("reads by unit key and gives each unit its key; no key asks nothing", async () => {
    const none = fake([]);
    expect(await readCatalogUnitsByKey(none.client, [])).toEqual([]);
    expect(none.asked).toEqual([]);
    const f = fake([{ ...ROW, unit_key: "unt_1" }]);
    const [u] = await readCatalogUnitsByKey(f.client, ["unt_1", "unt_1"]);
    expect(f.asked[0]!.text).toContain("where u.unit_key = any($1::text[])");
    expect(f.asked[0]!.text).toContain("select u.unit_key, u.upi,");
    expect(f.asked[0]!.values).toEqual([["unt_1"]]);
    expect(u).toMatchObject({ unitKey: "unt_1", upi: "upi-1", livingArea: 68.5 });
  });
});
