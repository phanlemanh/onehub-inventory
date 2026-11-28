// Reading older imports again (row 3h, AC-7) on a fake owner client and a fake layer: which kept cells become own values
// from a file, which stay as written, how the run counts, and that a kept list of another shape stops the run by name.
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
const door = vi.hoisted(() => ({ calls: [] as { companyId: string; userId: string }[] }));
vi.mock("@/modules/identity/server", async (original) => ({
  ...(await original<object>()),
  withCompany: async (
    _pool: unknown,
    ctx: { companyId: string; userId: string },
    fn: (c: unknown) => Promise<unknown>,
  ) => {
    door.calls.push(ctx);
    return fn({ query: async () => ({ rows: [], rowCount: 0 }) });
  },
}));

import { fold, label } from "@/modules/company-config";

import { KeptShapeUnread, layerThroughDoor, rereadImportValues, type LayerOf } from "./reread";
import { listingIdOf } from "./store";

const LAYER = { labels: [], fields: [], aliases: [], templates: [] };
const layerOf: LayerOf = async () => LAYER;

const RUN = {
  id: "00000000-0000-4000-8000-0000000c0001",
  company_id: "00000000-0000-4000-8000-00000000000a",
  imported_by: "00000000-0000-4000-8000-0000000000a2",
  signature: ["ma can", "dt", "pn", "note"].concat(
    [label("UnitFloorLocation"), label("DirectionFaces"), label("PropertySubType")].map(fold),
  ),
};

function owner(kept: unknown, sources: Record<string, Record<string, unknown>> = {}) {
  const asked: { text: string; params: unknown[] }[] = [];
  const c = {
    query: async (text: string, params: unknown[] = []) => {
      asked.push({ text, params });
      if (text.includes("from import_runs")) return { rows: [{ ...RUN, kept }], rowCount: 1 };
      if (text.includes("for update")) {
        const row = {
          standard_status: "Incomplete",
          living_area_source: null,
          floor_source: null,
          bedrooms_total_source: null,
          direction_faces_source: null,
          property_sub_type_source: null,
          ...sources[params[0] as string],
        };
        return { rows: [row], rowCount: 1 };
      }
      return { rows: [], rowCount: 0 };
    },
  };
  return { c, asked };
}

const cell = (row: number, header: string, raw: string, why = "unit-attribute") => ({
  row,
  header,
  raw,
  why,
});

describe("rereadImportValues", () => {
  it("takes the value the preview kept (row 11's kept[].value) over the words, and refuses one that does not fit", async () => {
    const { c, asked } = owner([
      // The person answered «2PN» with Townhouse in the preview: the words alone would ask, the kept value is written.
      { ...cell(0, label("PropertySubType"), "2PN"), value: "Townhouse" },
      // The machine read «72,5 m2» as 72.5 then: kept as such.
      { ...cell(0, "DT", "72,5 m2"), value: 72.5 },
      // A kept value of the wrong kind is not taken, even if the words could be read.
      { ...cell(1, "PN", "3"), value: "ba" },
    ]);
    const out = await rereadImportValues(c, layerOf);
    expect(out).toMatchObject({ imports: 1, listingsSet: 1, cellsRead: 2, cellsUnread: 1 });
    const fills = asked.filter((q) => q.text.includes("update listings"));
    expect(fills.map((q) => q.params)).toEqual([
      [listingIdOf(RUN.id, 0), 72.5, null, null, null, "Townhouse"],
    ]);
  });

  it("reads each kept unit attribute with today's readers and fills each row's listing; unread cells stay as written", async () => {
    const { c, asked } = owner([
      cell(0, "DT", "72.5"),
      cell(0, label("UnitFloorLocation"), "15a"),
      cell(0, "PN", "2"),
      cell(0, label("DirectionFaces"), "Đông Nam"),
      cell(0, label("PropertySubType"), label("SubTypeCondominium")),
      cell(1, label("PropertySubType"), "2PN"),
      cell(1, "Note", "corner"),
      cell(1, "PN", "3"),
      cell(2, "ma can", "SA5", "unit-missing"),
    ]);
    const out = await rereadImportValues(c, layerOf);
    expect(out).toEqual({
      imports: 1,
      listingsSet: 2,
      typedKept: 0,
      lockedKept: 0,
      cellsRead: 6,
      cellsUnread: 2,
    });
    const fills = asked.filter((q) => q.text.includes("update listings"));
    expect(fills.map((q) => q.params)).toEqual([
      [listingIdOf(RUN.id, 0), 72.5, "15A", 2, "Đông Nam", "Condominium"],
      [listingIdOf(RUN.id, 1), null, null, 3, null, null],
    ]);
    expect(asked.filter((q) => q.text === "commit")).toHaveLength(1);
    // Read once (021): the import is marked read inside its own transaction, before the commit.
    const texts = asked.map((q) => q.text);
    const mark = texts.findIndex((t) => t.includes("set file_values_read_at"));
    expect(mark, "the import is marked read").toBeGreaterThan(-1);
    expect(asked[mark]!.params).toEqual([RUN.id]);
    expect(mark).toBeLessThan(texts.indexOf("commit"));
    expect(texts[0], "only imports not read yet are asked for").toContain(
      "file_values_read_at is null",
    );
  });

  it("counts a typed and a locked listing apart and changes neither", async () => {
    const { c, asked } = owner([cell(0, "DT", "70"), cell(1, "DT", "71")], {
      [listingIdOf(RUN.id, 0)]: { floor_source: "Typed" },
      [listingIdOf(RUN.id, 1)]: { standard_status: "Closed" },
    });
    expect(await rereadImportValues(c, layerOf)).toMatchObject({
      listingsSet: 0,
      typedKept: 1,
      lockedKept: 1,
    });
    expect(asked.some((q) => q.text.includes("update listings"))).toBe(false);
  });

  it("stops on a kept list of another shape, naming the import, before it writes anything", async () => {
    const { c, asked } = owner([{ rij: 0, header: "DT", raw: "70", why: "unit-attribute" }]);
    await expect(rereadImportValues(c, layerOf)).rejects.toThrow(KeptShapeUnread);
    await expect(rereadImportValues(owner("not a list").c, layerOf)).rejects.toThrow(
      `kept shape unread: import ${RUN.id}`,
    );
    expect(asked.some((q) => q.text === "begin")).toBe(false);
  });

  it("rolls the import back and passes the error on when a write fails", async () => {
    const { c, asked } = owner([cell(0, "DT", "70")]);
    const failing = {
      query: async (text: string, params?: unknown[]) => {
        if (text.includes("update listings")) throw new Error("ghi hỏng");
        return c.query(text, params);
      },
    };
    await expect(rereadImportValues(failing, layerOf)).rejects.toThrow("ghi hỏng");
    expect(asked.map((q) => q.text).filter((t) => t === "rollback" || t === "commit")).toEqual([
      "rollback",
    ]);
  });
});

describe("layerThroughDoor", () => {
  it("reads the layer through withCompany, as the importer of the import's company", async () => {
    const layer = await layerThroughDoor({ connect: async () => ({}) as never })(
      RUN.company_id,
      RUN.imported_by,
    );
    expect(door.calls).toEqual([{ companyId: RUN.company_id, userId: RUN.imported_by }]);
    expect(layer).toMatchObject({ labels: [], fields: [], aliases: [], templates: [] });
  });
});
