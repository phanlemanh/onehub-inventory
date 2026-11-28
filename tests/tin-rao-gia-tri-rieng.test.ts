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
} from "../src/app/(app)/inventory-sample-rows";
import { catalogAttributesOf } from "../src/app/(app)/inventory-view";
import { sampleInventoryData } from "../src/app/(app)/inventory-sample-data";
import { ATTRIBUTE_WORDS as WORDS } from "../src/app/(app)/unit-attribute-words";
import type { GridRow, RegionPaste } from "../src/components/candidate/data-region";
import { LABELS } from "../src/generated/labels";
import type { Listing } from "../src/generated/ontology";
import { label } from "../src/modules/company-config";
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
