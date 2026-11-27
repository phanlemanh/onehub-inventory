// The inventory read on a fake client (rows 10, 11, 3h): a listing on a catalog unit shows that unit; one on a pending
// unit shows the company's code with no catalog values while it waits, and, once the catalog matched it, the matched
// unit's five attributes beside its own values — so only then can an own value differ from the catalog's.
import { describe, expect, it, vi } from "vitest";

import type { DbClient } from "@/modules/identity/server";

import { PENDING_UNIT, readInventory } from "./inventory-read";
import { effectiveAttributes } from "./unit-attributes";

vi.mock("server-only", () => ({}));

const listingRow = (over: Record<string, unknown>) => ({
  company_id: "c",
  standard_status: "Incomplete",
  list_price: null,
  close_price: null,
  close_date: null,
  withdrawn_reason: null,
  fee_inclusion: null,
  furnished: null,
  occupant_type: null,
  legal_status: null,
  financing: null,
  custom_fields: {},
  list_agent_user_id: "me",
  list_agent_full_name: "[Tên]",
  original_entry_timestamp: new Date("2026-11-01T00:00:00.000Z"),
  last_confirmed_at: null,
  version: 1,
  living_area: null,
  living_area_source: null,
  floor: null,
  floor_source: null,
  bedrooms_total: null,
  bedrooms_total_source: null,
  direction_faces: null,
  direction_faces_source: null,
  property_sub_type: null,
  property_sub_type_source: null,
  pending_code: null,
  pending_building: null,
  pending_unit_key: null,
  ...over,
});

const unitRow = (upi: string, unitKey: string, livingArea: string) => ({
  upi,
  unit_key: unitKey,
  unit_number: "A-01",
  building_name: "[MAU] B1",
  floor: "7",
  living_area: livingArea,
  bedrooms_total: 2,
  direction_faces: null,
  property_sub_type: "Condominium",
  subdivision_name: "[MAU] P1",
  complex_name: null,
});

function client(): DbClient {
  return {
    query: async (text: string, values?: unknown[]) => {
      if (text.includes("listings l\n"))
        return {
          rows: [
            listingRow({ id: "on-catalog", upi: "upi-1" }),
            listingRow({
              id: "waiting",
              upi: `${PENDING_UNIT}p-1`,
              pending_code: "SA5-01.01",
              living_area: "75",
              living_area_source: "Typed",
            }),
            listingRow({
              id: "matched",
              upi: `${PENDING_UNIT}p-2`,
              pending_code: "SA5-02.02",
              pending_building: "Sapphire 5",
              pending_unit_key: "unt_9",
              living_area: "75",
              living_area_source: "Typed",
              bedrooms_total: 2,
              bedrooms_total_source: "Typed",
            }),
          ],
          rowCount: 3,
        };
      const keys = (values?.[0] as string[] | undefined) ?? [];
      if (text.includes("u.unit_key = any"))
        return {
          rows: keys.includes("unt_9") ? [unitRow("upi-9", "unt_9", "70")] : [],
          rowCount: 1,
        };
      return { rows: [unitRow("upi-1", "unt_1", "68")], rowCount: 1 };
    },
    release: () => {},
  } as unknown as DbClient;
}

describe("readInventory", () => {
  it("a pending unit shows the company's code; matched, it lends the catalog unit's attributes, never its name", async () => {
    const data = await readInventory(client(), "me");
    const unitOf = (id: string) => {
      const upi = data.listingUnits.find((x) => x.listingId === id)!.upi;
      return data.units.find((u) => u.upi === upi)!;
    };
    const listing = (id: string) => data.current.find((l) => l.id === id)!;
    expect(unitOf("on-catalog")).toMatchObject({ unitNumber: "A-01", livingArea: 68 });
    expect(unitOf("waiting")).toEqual({
      upi: `${PENDING_UNIT}p-1`,
      unitNumber: "SA5-01.01",
      buildingName: "",
    });
    expect(unitOf("matched")).toMatchObject({
      unitNumber: "SA5-02.02",
      buildingName: "Sapphire 5",
      livingArea: 70,
      floor: "7",
      bedroomsTotal: 2,
      propertySubType: "Condominium",
    });
    expect(unitOf("matched")).not.toHaveProperty("directionFaces");
    // Waiting: nothing to differ from. Matched: the area differs, the bedroom count is the catalog's own.
    expect(effectiveAttributes(listing("waiting"), unitOf("waiting")).livingArea.differs).toBe(
      false,
    );
    const matched = effectiveAttributes(listing("matched"), unitOf("matched"));
    expect(matched.livingArea).toMatchObject({ value: 75, catalogValue: 70, differs: true });
    expect(matched.bedroomsTotal.differs).toBe(false);
    expect(matched.floor).toMatchObject({ value: "7", source: "Catalog" });
  });
});
