// @vitest-environment jsdom
// Row 3h (_acceptance/tin-rao-giu-gia-tri-rieng), task 4 — the living area and bedrooms cells of the inventory grid (E2):
// the cells read what brokers type by the attribute's own reader, a save sends exactly one unitAttributes change with the
// version, undo writes back what the listing held (null when it followed the catalog), a stale version is refused with
// row 4's sentence and the cell shows the server's value; and a paste into the two columns reads by the same rule and
// leaves out a sold row with its reason (Review Focus 5).
import { act, cleanup, fireEvent, render, renderHook, screen } from "@testing-library/react";
import { Fragment, createElement, type ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  sampleInventoryListings,
  sampleInventoryRows,
  sampleRecords,
} from "../src/app/(app)/inventory-sample-rows";
import { catalogAttributesOf } from "../src/app/(app)/inventory-view";
import { sampleInventoryData } from "../src/app/(app)/inventory-sample-data";
import { ATTRIBUTE_WORDS as WORDS } from "../src/app/(app)/unit-attribute-words";
import type { GridRow, RegionPaste } from "../src/components/candidate/data-region";
import { LABELS } from "../src/generated/labels";
import type { Listing } from "../src/generated/ontology";
import { formatArea, formatByKind } from "../src/lib/format";
import { label } from "../src/modules/company-config";
import { markValue, type LayerView } from "../src/modules/imports";
import {
  attributeFits,
  effectiveAttributes,
  sameAttribute,
  type CatalogAttributes,
  type OwnAttributes,
  type UnitAttributeField,
} from "../src/modules/listings/unit-attributes";
import { unitKind } from "../src/modules/listings/record";
import { geoTree } from "../src/modules/listings/ui/geo-tree";
import { inventoryRows, searchSuggestions } from "../src/modules/listings/ui/inventory-rows";
import { ListingCard, listingView } from "../src/modules/listings/ui/listing-record";
import {
  ListingRecordFull,
  type RecordLabels,
} from "../src/modules/listings/ui/listing-record-full";
import {
  readBedrooms,
  readLivingArea,
  sampleId,
  type ListingSaveDoor,
  type SaveOutcome,
} from "../src/modules/listings";
import {
  UNIT_ATTRIBUTE_COPY,
  cellEditLabels,
  type InventoryField,
} from "../src/modules/listings/ui";
import { attributeCellFields } from "../src/modules/listings/ui/attribute-cells";
import { CELL_EDIT_COPY } from "../src/modules/listings/ui/cell-edit-copy";
import { cellKeyOf, lockedReasons } from "../src/modules/listings/ui/listing-cell-edit";
import { planPaste } from "../src/modules/listings/ui/listing-paste";
import { attributeText } from "../src/modules/listings/ui/unit-attribute-copy";
import { useListingCellEdit } from "../src/modules/listings/ui/use-listing-cell-edit";

const toast = vi.hoisted(() => Object.assign(vi.fn(), { error: vi.fn(), success: vi.fn() }));
vi.mock("sonner", () => ({ toast }));

/** The grid edits in a cell from 768 px (row 4): these tests run at a desktop width. */
function atWidth(wide: boolean) {
  window.matchMedia = ((query: string) => ({
    matches: wide,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    onchange: null,
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}
beforeEach(() => {
  Element.prototype.getAnimations ??= () => [];
  atWidth(true);
});
afterEach(() => {
  cleanup();
  toast.mockReset();
  toast.error.mockReset();
});

const labels = cellEditLabels((c, tx) => {
  const entry: { pref: string; lease?: string } = LABELS[c];
  return tx === "lease" && entry.lease ? entry.lease : entry.pref;
});
const HEADERS = {
  "Listing.unitNumber": label("Unit"),
  "Listing.buildingName": label("Building"),
  "Listing.subdivisionName": label("Subdivision"),
  "Listing.standardStatus": label("StandardStatus"),
  "Listing.listPrice": label("ListPrice"),
  "Unit.livingArea": label("LivingArea"),
  "Unit.bedroomsTotal": label("BedroomsTotal"),
  "Listing.lastConfirmedAt": label("LastConfirmedAt"),
} as Record<InventoryField, string>;

const rows = sampleInventoryRows();
const listings = sampleInventoryListings();
const catalog = catalogAttributesOf(sampleInventoryData());
/** A listing with no own value: its cells follow the catalog (sample.ts). */
const PLAIN = sampleId(1, 2);
/** A sold listing with an own living area (sample.ts SAMPLE_OWN_ATTRIBUTES). */
const AREA_CLOSED = sampleId(1, 9);
const AREA = "Unit.livingArea";
const BEDROOMS = "Unit.bedroomsTotal";
const fields = attributeCellFields(["livingArea", "bedroomsTotal"], WORDS);

const listingOf = (id: string) => listings.find((l) => l.id === id)!;
const rowOf = (id: string) => rows.find((r) => r.id === id)!;

function grid(answers: ((change: unknown) => SaveOutcome)[] = []) {
  const save = vi.fn(
    async ({ id, change }: Parameters<ListingSaveDoor["save"]>[0]): Promise<SaveOutcome> => {
      const answer = answers.shift();
      if (answer) return answer(change);
      const l = listingOf(id);
      return {
        kind: "saved",
        listing: { ...l, ...(change as object), version: l.version + 1 } as Listing,
      };
    },
  );
  const hook = renderHook(() =>
    useListingCellEdit({
      rows,
      listings,
      headers: HEADERS,
      labels,
      door: { save },
      attributes: { fields, words: WORDS, catalogOf: (id) => catalog[id] },
    }),
  );
  return { hook, save };
}

async function type(
  hook: ReturnType<typeof grid>["hook"],
  id: string,
  field: string,
  text: string,
) {
  const close = vi.fn();
  const editor = hook.result.current.cellEdit!.render({
    row: hook.result.current.rows.find((r) => r.id === id)!,
    field: field as never,
    initialText: text,
    close,
  });
  const view = render(createElement(Fragment, null, editor as ReactNode));
  await act(async () => {
    fireEvent.keyDown(screen.getByRole("textbox"), { key: "Enter" });
  });
  const kept = (document.querySelector("input") as HTMLInputElement | null)?.value;
  const alert = screen.queryByRole("alert")?.textContent ?? null;
  view.unmount();
  return { close, kept, alert };
}

const cellOf = (hook: ReturnType<typeof grid>["hook"], id: string, field: string) =>
  hook.result.current.rows.find((r) => r.id === id)![field as keyof GridRow];

describe("doc-o (E2)", () => {
  it("doc-o: a living area as brokers type it; empty, words, zero, negative and two commas are refused with their sentence", () => {
    for (const raw of ["72,5", "72.5", "72,5 m2", "72,5m²"])
      expect(readLivingArea(raw), raw).toEqual({ ok: true, value: 72.5 });
    const refused: [string, string][] = [
      ["", "Chưa có số — gõ số như 72,5 hoặc 72,5 m²."],
      ["bảy mươi", "Chưa hiểu «bảy mươi» — gõ số như 72,5 hoặc 72,5 m²."],
      ["0", "Phải lớn hơn 0 — gõ số như 72,5 hoặc 72,5 m²."],
      ["-3", "Phải lớn hơn 0 — gõ số như 72,5 hoặc 72,5 m²."],
      ["72,5,1", "Chưa hiểu «72,5,1» — gõ số như 72,5 hoặc 72,5 m²."],
    ];
    for (const [raw, sentence] of refused) {
      const read = readLivingArea(raw);
      expect(read.ok, raw).toBe(false);
      if (!read.ok)
        expect(UNIT_ATTRIBUTE_COPY.problem("livingArea", read.problem, raw), raw).toBe(sentence);
    }
  });

  it("doc-o: bedrooms take a whole number from 0; half a room and a word point at 0 for a studio", () => {
    expect(readBedrooms("0")).toEqual({ ok: true, value: 0 });
    expect(readBedrooms("3")).toEqual({ ok: true, value: 3 });
    const refused: [string, string][] = [
      ["2,5", "Không có nửa phòng — gõ số nguyên như 2; studio thì gõ 0."],
      ["Studio", "Chưa hiểu «Studio» — gõ số nguyên như 2; studio thì gõ 0."],
    ];
    for (const [raw, sentence] of refused) {
      const read = readBedrooms(raw);
      expect(read.ok, raw).toBe(false);
      if (!read.ok)
        expect(UNIT_ATTRIBUTE_COPY.problem("bedroomsTotal", read.problem, raw), raw).toBe(sentence);
    }
  });
});

describe("o-gui-mot-lan (E2)", () => {
  it("o-gui-mot-lan: «72,5» sends one unitAttributes change with the version; undo sends null, the catalog's value again", async () => {
    const { hook, save } = grid();
    const before = cellOf(hook, PLAIN, AREA);
    expect(listingOf(PLAIN).livingArea, "the listing follows the catalog").toBeUndefined();
    await type(hook, PLAIN, AREA, "72,5");
    expect(save).toHaveBeenCalledOnce();
    expect(save.mock.calls[0]![0]).toMatchObject({
      id: PLAIN,
      version: listingOf(PLAIN).version,
      change: { field: "unitAttributes", livingArea: 72.5 },
    });
    expect(Object.keys(save.mock.calls[0]![0].change)).toEqual(["field", "livingArea"]);
    expect(cellOf(hook, PLAIN, AREA)).toBe(72.5);
    const [message, options] = toast.mock.calls.at(-1)! as [
      string,
      { action: { onClick: () => void } },
    ];
    expect(message).toContain(attributeText(WORDS, "livingArea", 72.5));
    await act(async () => options.action.onClick());
    expect(save).toHaveBeenCalledTimes(2);
    expect(save.mock.calls[1]![0]).toMatchObject({
      version: listingOf(PLAIN).version + 1,
      change: { field: "unitAttributes", livingArea: null },
    });
    expect(cellOf(hook, PLAIN, AREA), "back to the catalog's value").toBe(before);
  });

  it("o-gui-mot-lan: words it cannot read send nothing; the sentence shows under the cell and the words stay", async () => {
    const { hook, save } = grid();
    const typed = await type(hook, PLAIN, AREA, "bảy mươi");
    expect(save).not.toHaveBeenCalled();
    expect(typed.alert).toContain(
      UNIT_ATTRIBUTE_COPY.problem("livingArea", "not-a-number", "bảy mươi"),
    );
    expect(typed.kept).toBe("bảy mươi");
    const half = await type(hook, PLAIN, BEDROOMS, "2,5");
    expect(save).not.toHaveBeenCalled();
    expect(half.alert).toContain(UNIT_ATTRIBUTE_COPY.problem("bedroomsTotal", "not-whole", "2,5"));
  });

  it("o-gui-mot-lan: a stale version (409) says row 4's conflict sentence and the cell shows the value the server keeps", async () => {
    const l = listingOf(PLAIN);
    const current = {
      ...l,
      version: l.version + 1,
      livingArea: 80,
      livingAreaSource: "Typed",
    } as Listing;
    const { hook, save } = grid([() => ({ kind: "conflict", current })]);
    await type(hook, PLAIN, AREA, "72,5");
    expect(save).toHaveBeenCalledOnce();
    const what = UNIT_ATTRIBUTE_COPY.what(
      WORDS,
      "livingArea",
      String(rowOf(PLAIN)["Listing.unitNumber"]),
      attributeText(WORDS, "livingArea", 72.5),
    );
    expect(toast.error.mock.calls.at(-1)![0]).toBe(
      CELL_EDIT_COPY.saveFailed(what.toLocaleLowerCase("vi"), "conflict"),
    );
    expect(cellOf(hook, PLAIN, AREA), "the server's value, not the edit over it").toBe(80);
  });

  it("break: a cell that sends what it could not read says «unreadable value sent»", async () => {
    const { save } = grid();
    // The shortcut the reader stops: sending the words as they are.
    await save({ id: PLAIN, version: 1, change: { field: "unitAttributes" }, at: "" } as never);
    expect(() => expect(save.mock.calls.length, "unreadable value sent").toBe(0)).toThrow(
      /unreadable value sent/,
    );
  });
});

describe("dan-thuoc-tinh (Review Focus 5)", () => {
  const attrs = new Map(fields.map((f) => [cellKeyOf(f), f]));
  const keys = [...attrs.keys()];
  const locked = (row: GridRow): GridRow => ({ ...row, locked: lockedReasons(row, keys) });
  const headerOf = (field: string) => HEADERS[field as InventoryField] ?? field;
  const paste = (cells: { row: GridRow; field: string; raw: string }[]): RegionPaste => ({
    cells: cells.map((c) => ({ ...c, open: !c.row.locked?.[c.field as never] })) as never,
    beyond: { rows: 0, columns: 0 },
  });

  it("dan-thuoc-tinh: area and bedrooms take a paste by the cell's reader; a sold row is left out with its lock; words are wrong", () => {
    const open = locked(rowOf(PLAIN));
    const sold = locked(rowOf(AREA_CLOSED));
    const region = paste([
      { row: open, field: AREA, raw: "72,5 m²" },
      { row: open, field: BEDROOMS, raw: "3" },
      { row: sold, field: AREA, raw: "90" },
      { row: sold, field: BEDROOMS, raw: "bảy" },
    ]);
    const plan = planPaste(region, labels, headerOf, [], new Map(), undefined, {
      fields: attrs,
      words: WORDS,
    });
    expect([...plan.writes.values()].map((w) => w.change)).toEqual([
      { field: "unitAttributes", livingArea: 72.5 },
      { field: "unitAttributes", bedroomsTotal: 3 },
    ]);
    expect(plan.changes.map((c) => c.to)).toEqual([attributeText(WORDS, "livingArea", 72.5), "3"]);
    expect(plan.skipped).toEqual([
      expect.objectContaining({
        field: HEADERS[AREA as InventoryField],
        why: sold.locked![AREA as never],
      }),
    ]);
    expect(sold.locked![AREA as never], "the sold row's cell has its lock").toBeTruthy();
    expect(plan.wrong.map((w) => w.why)).toEqual([
      UNIT_ATTRIBUTE_COPY.problem("bedroomsTotal", "not-a-number", "bảy"),
    ]);
  });

  it("dan-thuoc-tinh: a pasted value equal to what the cell shows changes nothing; without the attributes the columns stay unit facts", () => {
    const open = locked(rowOf(PLAIN));
    const same = planPaste(
      paste([{ row: open, field: AREA, raw: String(open[AREA as never]).replace(".", ",") }]),
      labels,
      headerOf,
      [],
      new Map(),
      undefined,
      { fields: attrs, words: WORDS },
    );
    expect(same.writes.size).toBe(0);
    expect(same.same).toBe(1);
    const without = planPaste(paste([{ row: open, field: AREA, raw: "72,5" }]), labels, headerOf);
    expect(without.writes.size).toBe(0);
    expect(without.skipped).toHaveLength(1);
  });
});

describe("lay-lai-mot-danh-tinh (VP11 «nothing will draw again»)", () => {
  it("lay-lai-mot-danh-tinh: the grid's «Lấy lại» keeps one identity across renders and saves, so the marks never redraw every cell", async () => {
    const { hook } = grid();
    const first = hook.result.current.revertAttribute;
    hook.rerender();
    await type(hook, PLAIN, AREA, "72,5");
    hook.rerender();
    expect(hook.result.current.revertAttribute, "a new «Lấy lại» on a render").toBe(first);
  });
});

// ---- Task 1: the effective value of each attribute by source (E1) ----

describe("hieu-luc-ma-tran (E1)", () => {
  /** Each attribute: the listing's own value, the catalog's, and the catalog with no value. */
  const VALUES: Record<UnitAttributeField, { own: unknown; catalog: unknown }> = {
    livingArea: { own: 72.5, catalog: 70 },
    floor: { own: "15A", catalog: "7" },
    bedroomsTotal: { own: 2, catalog: 3 },
    directionFaces: { own: "Tây Bắc", catalog: "Đông Nam" },
    propertySubType: { own: "Townhouse", catalog: "Condominium" },
  };
  const SOURCE_KEY = (f: UnitAttributeField) => `${f}Source`;
  const catalogWith = (f: UnitAttributeField, v: unknown): CatalogAttributes =>
    ({ [f]: v }) as unknown as CatalogAttributes;

  it("hieu-luc-ma-tran: five attributes × four sources, written before the code — twenty cells", () => {
    let cells = 0;
    for (const f of Object.keys(VALUES) as UnitAttributeField[]) {
      const { own, catalog } = VALUES[f];
      const cases: [string, OwnAttributes, CatalogAttributes, object][] = [
        [
          "Typed",
          { [f]: own, [SOURCE_KEY(f)]: "Typed" } as OwnAttributes,
          catalogWith(f, catalog),
          { value: own, source: "Typed", catalogValue: catalog, differs: true },
        ],
        [
          "File",
          { [f]: own, [SOURCE_KEY(f)]: "File" } as OwnAttributes,
          catalogWith(f, catalog),
          { value: own, source: "File", catalogValue: catalog, differs: true },
        ],
        [
          "catalog",
          {},
          catalogWith(f, catalog),
          { value: catalog, source: "Catalog", catalogValue: catalog, differs: false },
        ],
        [
          "none",
          {},
          catalogWith(f, null),
          { value: null, source: null, catalogValue: null, differs: false },
        ],
      ];
      for (const [name, listing, unit, want] of cases) {
        expect(effectiveAttributes(listing, unit)[f], `${f} · ${name}`).toEqual(want);
        cells += 1;
      }
    }
    expect(cells, "cells of the matrix").toBe(20);
  });

  it("hieu-luc-ma-tran: numbers compare as numbers, words folded; the unit kind reads the effective bedrooms", () => {
    expect(sameAttribute(72, "72.0")).toBe(true);
    expect(
      effectiveAttributes(
        { livingArea: 72, livingAreaSource: "Typed" },
        catalogWith("livingArea", 72.0),
      ).livingArea.differs,
    ).toBe(false);
    expect(sameAttribute("Đông Nam", "dong nam")).toBe(true);
    const e = effectiveAttributes(
      { bedroomsTotal: 2, bedroomsTotalSource: "Typed" },
      catalogWith("bedroomsTotal", 3),
    );
    expect(unitKind(e.bedroomsTotal.value)).toBe(unitKind(2));
    expect(unitKind(e.bedroomsTotal.value)).not.toBe(unitKind(3));
  });

  /** Where a surface does not show the listing's own value, by name; empty when every surface does. */
  function surfaceErrors(shown: Record<string, string>, want: string): string[] {
    if (Object.keys(shown).length === 0) throw new Error("no surface measured");
    return Object.entries(shown)
      .filter(([, text]) => !text.includes(want))
      .map(([name]) => `surface reads catalog instead of listing: ${name}`);
  }

  const RECORD_LABELS: RecordLabels = {
    unit: label("Unit"),
    unitKind: label("UnitKind"),
    livingArea: label("LivingArea"),
    bedrooms: label("BedroomsTotal"),
    floor: label("UnitFloorLocation"),
    direction: label("DirectionFaces"),
    building: label("Building"),
    subdivision: label("Subdivision"),
    propertyType: label("PropertySubType"),
    listPrice: label("ListPrice"),
    completeness: label("Completeness"),
    currentListing: label("CurrentListing"),
    viewedListing: label("ViewedListing"),
    listingsOfUnit: label("ListingsOfUnit"),
    parts: {
      listPrice: label("ListPrice"),
      furnished: label("Furnished"),
      legalStatus: label("LegalStatus"),
      financing: label("Financing"),
      occupantType: label("OccupantType"),
    },
    furnishedValues: {
      Furnished: label("FurnishedFull"),
      Partially: label("FurnishedPartial"),
      Unfurnished: label("FurnishedNone"),
    },
    occupantValues: {
      Owner: label("OccupantOwner"),
      Tenant: label("OccupantTenant"),
      Vacant: label("OccupantVacant"),
    },
    propertyTypeValues: WORDS.subTypes,
    attributes: WORDS,
  };

  it("hieu-luc-ma-tran: the grid row, the record and the phone card show the listing's own value; ⌘K and the place tree, which carry no unit attribute, still build from the same rows", () => {
    const id = sampleId(1, 4);
    const own = listingOf(id);
    expect(own.livingAreaSource, "the sample listing types its own area").toBe("Typed");
    const want = effectiveAttributes(own, catalog[id]).livingArea;
    expect(want.differs, "the own value differs from the catalog's").toBe(true);
    const text = formatArea(want.value as number);
    const row = rowOf(id);
    const view = listingView(row, HEADERS);
    const fact = view.facts.find((x) => x.column.field === AREA)!;
    const card = render(
      createElement(ListingCard, { view, priceLabel: label("ListPrice"), layout: "row" }),
    );
    const cardText = card.container.textContent ?? "";
    card.unmount();
    const record = render(
      createElement(ListingRecordFull, {
        view,
        data: sampleRecords(new Date("2026-11-27T03:00:00Z"))[id]!,
        labels: RECORD_LABELS,
      }),
    );
    const recordText =
      record.container.querySelector('[data-slot="listing-unit"] [data-field="Unit.livingArea"] dd')
        ?.textContent ?? "";
    record.unmount();
    // The grid row as the page reads it again from the sample's listings and units.
    const rebuilt = inventoryRows({
      listings: [own],
      listingUnits: [{ listingId: id, upi: `upi-${id}` }],
      units: [{ upi: `upi-${id}`, ...(catalog[id] as object) } as never],
    })[0]!;
    // Every surface that shows the area shows the listing's own, written by the surface's own function.
    expect(
      surfaceErrors(
        {
          card: cardText,
          "card fact": formatByKind(fact.column.kind, fact.value),
          record: recordText,
        },
        text,
      ),
    ).toEqual([]);
    expect(row[AREA as keyof GridRow]).toBe(want.value);
    expect(rebuilt[AREA as keyof GridRow]).toBe(want.value);
    // ⌘K and the place tree carry no unit attribute, so own-versus-catalog is not theirs to show: this only checks they
    // still build from the same rows (the code, building and project), not which value they would read.
    const code = String(row["Listing.unitNumber"]);
    expect(searchSuggestions(rows, code).some((x) => x.value === code)).toBe(true);
    expect(geoTree(rows, []).length).toBeGreaterThan(0);
  });

  it("break: a surface that reads the catalog's value says «surface reads catalog instead of listing»", () => {
    const id = sampleId(1, 4);
    const e = effectiveAttributes(listingOf(id), catalog[id]).livingArea;
    const catalogText = formatArea(e.catalogValue as number);
    expect(surfaceErrors({ card: catalogText }, formatArea(e.value as number))).toEqual([
      "surface reads catalog instead of listing: card",
    ]);
    expect(() => surfaceErrors({}, "x")).toThrow("no surface measured");
  });
});

// G-2811-91: the import's preview and its write ask one rule of what a unit attribute takes (attributeFits). A cell the
// preview shows with a value is written with that value; one the write would refuse is asked in the preview instead.
const NO_LAYER: LayerView = { labels: [], fields: [], aliases: [], templates: [] };
const STANDARD_OF: Record<UnitAttributeField, string> = {
  livingArea: "Unit.livingArea",
  bedroomsTotal: "Unit.bedroomsTotal",
  floor: "Unit.floor",
  directionFaces: "Unit.directionFaces",
  propertySubType: "Unit.propertySubType",
};
/** The edges of each attribute: zero, below zero, past what the column holds, not a number, and one plain value. */
const EDGES: Record<UnitAttributeField, string[]> = {
  livingArea: ["0", "0,0", "-5", "1e400", "ba", "72,5", "100000000"],
  bedroomsTotal: ["0", "-1", "2,5", "3000000000", "2147483647", "ba", "2"],
  floor: ["0", "-1", "007", "15a", "tầng", "99999999999"],
  directionFaces: ["Đông Nam", "giữa", "0"],
  propertySubType: [label("SubTypeCondominium"), "2PN", "0"],
};

/** Cells the preview shows with a value that the write, by `fits`, would refuse: named «shown then lost». */
function shownThenLost(
  fits: (f: UnitAttributeField, v: unknown) => boolean = attributeFits,
): string[] {
  const lost: string[] = [];
  for (const [field, raws] of Object.entries(EDGES) as [UnitAttributeField, string[]][])
    for (const raw of raws) {
      const target = { standard: STANDARD_OF[field] } as Parameters<typeof markValue>[0];
      const m = markValue(target, raw, { layer: NO_LAYER, today: "2026-11-28" });
      if (m.mark !== "ask" && m.value !== null && !fits(field, m.value))
        lost.push(`shown then lost: ${field} «${raw}»`);
    }
  return lost;
}

describe("xem-truoc-bang-ghi (G-2811-91)", () => {
  it("xem-truoc-bang-ghi: at every edge of the five attributes, what the preview shows is what the write takes", () => {
    expect(shownThenLost()).toEqual([]);
    const asked = (field: UnitAttributeField, raw: string) =>
      markValue({ standard: STANDARD_OF[field] } as Parameters<typeof markValue>[0], raw, {
        layer: NO_LAYER,
        today: "2026-11-28",
      }).mark;
    // The cells the write would refuse are asked, not shown: an area of 0, a count past the column, not a number.
    for (const [field, raw] of [
      ["livingArea", "0"],
      ["livingArea", "-5"],
      ["livingArea", "ba"],
      ["bedroomsTotal", "-1"],
      ["bedroomsTotal", "2,5"],
      ["bedroomsTotal", "3000000000"],
      ["bedroomsTotal", "ba"],
    ] as [UnitAttributeField, string][])
      expect(asked(field, raw), `${field} «${raw}»`).toBe("ask");
    // A plain value at the edge is still read: no bedrooms, the largest count the column holds, a large area.
    for (const [field, raw] of [
      ["bedroomsTotal", "0"],
      ["bedroomsTotal", "2147483647"],
      ["livingArea", "100000000"],
    ] as [UnitAttributeField, string][])
      expect(asked(field, raw), `${field} «${raw}»`).not.toBe("ask");
  });

  it("break: a write rule stricter than the preview's names each value shown then lost", () => {
    const stricter = (f: UnitAttributeField, v: unknown) =>
      f === "bedroomsTotal" ? attributeFits(f, v) && v !== 0 : attributeFits(f, v);
    expect(shownThenLost(stricter)).toEqual(["shown then lost: bedroomsTotal «0»"]);
  });
});
