// The create door of listings on a fake client (rows 11, 3h): a file's unit values go in with the listing, each with
// the source «File», only when they fit; reading an older import again fills only what has no own value, and leaves a
// typed or locked listing as it is.
import { describe, expect, it } from "vitest";

import { createListings, removeImportListings, setFileValues, type NewListing } from "./create";

function fake(answer: (text: string, params: unknown[]) => unknown[] = () => []) {
  const asked: { text: string; params: unknown[] }[] = [];
  return {
    asked,
    c: {
      query: async (text: string, params: unknown[] = []) => {
        asked.push({ text, params });
        const rows = answer(text, params);
        return { rows, rowCount: rows.length };
      },
    },
  };
}

const LISTING: NewListing = {
  id: "00000000-0000-4000-8000-000000000001",
  unit: { upi: "upi-1" },
  listAgentUserId: "00000000-0000-4000-8000-0000000000a1",
  listAgentFullName: "[Tên]",
  standardStatus: "Incomplete",
  listPrice: null,
  feeInclusion: null,
  furnished: null,
  occupantType: null,
  withdrawnReason: null,
  legalStatus: null,
  financing: null,
  customFields: {},
  lastConfirmedAt: null,
};

describe("createListings", () => {
  it("puts the file's fitting values in the insert, in the column order, and leaves the others empty", async () => {
    const f = fake();
    await createListings(f.c, "co", "run", [
      {
        ...LISTING,
        fileValues: { livingArea: 72.5, floor: "07", bedroomsTotal: 2, directionFaces: "Đông Nam" },
      },
      { ...LISTING, id: "00000000-0000-4000-8000-000000000002", unit: { pendingUnitId: "p-1" } },
    ]);
    const inserts = f.asked.filter((q) => q.text.includes("insert into listings"));
    // livingArea, floor («07» breaks the floor rule), bedroomsTotal, directionFaces, propertySubType
    expect(inserts[0]!.params.slice(15)).toEqual([72.5, null, 2, "Đông Nam", null]);
    expect(inserts[1]!.params.slice(15)).toEqual([null, null, null, null, null]);
    expect(f.asked.some((q) => q.text.includes("insert into listing_pending_units"))).toBe(true);
  });
});

describe("setFileValues (row 3h)", () => {
  const sources = (over: Record<string, unknown> = {}) => [
    {
      standard_status: "Incomplete",
      living_area_source: null,
      floor_source: null,
      bedrooms_total_source: null,
      direction_faces_source: null,
      property_sub_type_source: null,
      ...over,
    },
  ];
  const run = async (row: unknown[], values = { livingArea: 70, bedroomsTotal: 2 }) => {
    const f = fake((text) => (text.includes("for update") ? row : []));
    const out = await setFileValues(f.c, "id-1", values);
    return { out, updates: f.asked.filter((q) => q.text.includes("update listings")) };
  };

  it("fills a listing with no own value, the file's values in the column order", async () => {
    const { out, updates } = await run(sources());
    expect(out).toBe("set");
    expect(updates[0]!.params).toEqual(["id-1", 70, null, 2, null, null]);
  });
  it("leaves a listing the company typed on, one locked by its status, and one missing", async () => {
    expect(await run(sources({ floor_source: "Typed" }))).toEqual({
      out: "typed-kept",
      updates: [],
    });
    expect(await run(sources({ standard_status: "Closed" }))).toEqual({
      out: "locked",
      updates: [],
    });
    expect(await run(sources({ standard_status: "Withdrawn" }))).toEqual({
      out: "locked",
      updates: [],
    });
    expect(await run([])).toEqual({ out: "not-found", updates: [] });
  });
  it("has nothing new when every value the file gives already has an own value, or none fits", async () => {
    expect(
      await run(sources({ living_area_source: "File", bedrooms_total_source: "File" })),
    ).toEqual({ out: "nothing-new", updates: [] });
    expect(await run(sources(), { livingArea: 0, bedroomsTotal: 2.5 })).toEqual({
      out: "nothing-new",
      updates: [],
    });
  });
});

describe("removeImportListings", () => {
  it("removes the untouched listings and names the changed ones by their code", async () => {
    const f = fake((text) =>
      text.startsWith("select id, version")
        ? [
            { id: "a", version: 1 },
            { id: "b", version: 2 },
          ]
        : text.startsWith("delete")
          ? [{ id: "a" }]
          : [{ code: "[MAU] B1 A-02" }],
    );
    expect(await removeImportListings(f.c, "run")).toEqual({
      removed: ["a"],
      kept: ["b"],
      keptCodes: ["[MAU] B1 A-02"],
    });
  });
});
