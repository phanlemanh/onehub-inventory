// @vitest-environment jsdom
// Row 2c (luu-goc-nhin-cot-hai), E3: the shared grid opens with a given arrangement and reports each change of it.
//   opens-with — five arrangements written ahead (filters only, sort only, groups only, hidden columns only, all four):
//     rows in order, groups and shown headers equal what filterRows, sortRows and groupRows give on the source rows,
//     worked out here apart from the grid.
//   reports — each of the four things a person changes is heard with the new arrangement (4 cells).
//   sameView — ten pairs written ahead.
//   Row 2e (bo-o-tim-cua-vung), E9: a view holds exactly four things, never a search text; old data with one is dropped.
//   Breaks: a grid that ignores the hidden columns it was given → «initial view ignored: hidden columns»; a sameView blind
//   to a column filter's text → «sameView blind to filter text»; a view that carries a search text again → «view carries
//   search text».
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { typedColumn, type FieldKey } from "../src/components/candidate/column-kind";
import { DataRegion, type GridRow } from "../src/components/candidate/data-region";
import {
  EMPTY_VIEW,
  filterRows,
  groupRows,
  sameView,
  sortRows,
  type GridView,
} from "../src/components/candidate/grid-view";
import { sampleUnits, subdivisionNameOf } from "../src/modules/catalog";
import { SAMPLE_COMPANY, buildSampleListings } from "../src/modules/listings";
import { INVENTORY_FIELDS, gridView, inventoryRows, storedView } from "../src/modules/listings/ui";
import { tallGridViewport } from "./virtual-viewport";

// The 60-row grid renders slowly when the machine is loaded (grid-sheet hit 5.3 s on the 5 s default in rows 2c and 7c): a
// ceiling for this file only; no assertion changes.
vi.setConfig({ testTimeout: 20_000 });

beforeAll(() => {
  // jsdom's rects lack toJSON, which the tall-viewport helper spreads; menus measure the viewport through it.
  const base = Element.prototype.getBoundingClientRect;
  Element.prototype.getBoundingClientRect = function (this: Element) {
    const r = base.call(this);
    const plain = {
      x: r.x,
      y: r.y,
      width: r.width,
      height: r.height,
      top: r.top,
      right: r.right,
      bottom: r.bottom,
      left: r.left,
    };
    return { ...plain, toJSON: () => plain } as DOMRect;
  };
  tallGridViewport();
  // Enter opens a listing's record (row 3), and the record asks for the screen width through matchMedia.
  window.matchMedia ??= ((query: string) => ({
    matches: false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    onchange: null,
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
  Element.prototype.getAnimations ??= () => [];
  Element.prototype.scrollIntoView ??= () => {};
});
afterEach(cleanup);

const units = sampleUnits().map((u) => ({ ...u, subdivisionName: subdivisionNameOf(u) }));
const sample = buildSampleListings({ companyId: SAMPLE_COMPANY.id, units });
const rows = inventoryRows({
  listings: sample.listings,
  listingUnits: sample.listingUnits,
  units,
}) as GridRow[];
const HEADERS: Record<string, string> = {
  "Listing.unitNumber": "Căn",
  "Listing.buildingName": "Toà",
  "Listing.subdivisionName": "Dự án",
  "Listing.standardStatus": "Trạng thái",
  "Listing.listPrice": "Giá chào",
  "Unit.livingArea": "Diện tích",
  "Unit.bedroomsTotal": "Phòng ngủ",
  "Listing.lastConfirmedAt": "Xác nhận lúc",
};
const columns = INVENTORY_FIELDS.map((field) =>
  typedColumn({ field, header: HEADERS[field] as string }),
);
const GROUP_BY: FieldKey = "Listing.buildingName";

function openMenu(trigger: Element) {
  act(() => {
    fireEvent.pointerDown(trigger, { button: 0, pointerType: "mouse" });
    fireEvent.mouseDown(trigger, { button: 0 });
    fireEvent.click(trigger);
  });
}
const headerButton = (name: string) =>
  screen.getAllByRole("button").find((b) => b.textContent?.trim() === name) as HTMLElement;

/** What the grid shows: data rows in reading order, group names, shown headers. */
interface Shown {
  ids: string[];
  groups: string[];
  headers: string[];
}

function shown(): Shown {
  const trs = [...document.querySelectorAll<HTMLElement>("tbody tr[data-row-id]")];
  return {
    ids: trs.map((tr) => tr.dataset["rowId"]!).filter((id) => !id.startsWith("nhom:")),
    groups: trs
      .map((tr) => tr.dataset["rowId"]!)
      .filter((id) => id.startsWith("nhom:"))
      .map((id) => id.slice("nhom:".length)),
    headers: [...document.querySelectorAll<HTMLElement>("thead tr:first-child th[data-col-id]")]
      .map((th) => th.dataset["colId"]!)
      .filter((id) => id.includes(".")),
  };
}

/** The same, worked out from the source rows with the pure rules, not through the grid. */
function expected(view: GridView): Shown {
  const kept = sortRows(filterRows(rows, columns, view.filters), columns, view.sort[0] ?? null);
  const group = columns.find((c) => c.field === GROUP_BY)!;
  const groups = view.grouped ? groupRows(kept, group) : null;
  return {
    ids: groups ? groups.flatMap((g) => g.rows.map((r) => r.id)) : kept.map((r) => r.id),
    groups: groups ? groups.map((g) => g.label) : [],
    headers: columns.map((c) => c.field).filter((f) => !view.hidden.includes(f)),
  };
}

function checkOpened(got: Shown, want: Shown): void {
  if (JSON.stringify(got.headers) !== JSON.stringify(want.headers))
    throw new Error("initial view ignored: hidden columns");
  if (JSON.stringify(got.groups) !== JSON.stringify(want.groups))
    throw new Error("initial view ignored: groups");
  if (JSON.stringify(got.ids) !== JSON.stringify(want.ids))
    throw new Error("initial view ignored: rows");
}

// The start of a unit code that an Active row of building S1.0x has, so the four filters of «all four» keep rows.
const CODE_START = String(
  rows.find(
    (r) =>
      r["Listing.standardStatus"] === "Active" &&
      String(r["Listing.buildingName"]).startsWith("S1.0"),
  )?.["Listing.unitNumber"],
).slice(0, 2);

const VIEWS: Record<string, GridView> = {
  "filters only": {
    ...EMPTY_VIEW,
    filters: { "Listing.standardStatus": ["Active", "Hold"], "Listing.listPrice": "<=5" },
  },
  "sort only": { ...EMPTY_VIEW, sort: [{ field: "Listing.listPrice", direction: "desc" }] },
  "groups only": { ...EMPTY_VIEW, grouped: true },
  "hidden columns only": {
    ...EMPTY_VIEW,
    hidden: ["Listing.subdivisionName", "Listing.lastConfirmedAt"],
  },
  "all four": {
    filters: {
      "Listing.unitNumber": CODE_START,
      "Listing.standardStatus": ["Active"],
      "Listing.buildingName": "S1.0",
    },
    sort: [{ field: "Listing.listPrice", direction: "desc" }],
    grouped: true,
    hidden: ["Listing.subdivisionName", "Listing.lastConfirmedAt"],
  },
};

const open = (view: GridView, onViewChange?: (v: GridView) => void) =>
  render(
    <DataRegion
      title="Hàng"
      columns={columns}
      rows={rows}
      emptyWhy="x"
      groupBy={GROUP_BY}
      initialView={view}
      onViewChange={onViewChange}
    />,
  );

describe("opens with a given arrangement", () => {
  it.each(Object.entries(VIEWS))("%s", (_, view) => {
    open(view);
    const want = expected(view);
    expect(want.ids.length).toBeGreaterThan(0);
    checkOpened(shown(), want);
    expect(screen.queryAllByRole("searchbox")).toHaveLength(0);
    const code = view.filters["Listing.unitNumber"];
    expect((screen.getByLabelText("Lọc cột Căn") as HTMLInputElement).value).toBe(
      typeof code === "string" ? code : "",
    );
  });

  it("5 arrangements written ahead", () => {
    expect(Object.keys(VIEWS)).toHaveLength(5);
  });

  it("drops a search text that old data still carries", () => {
    const spy = vi.fn();
    open({ ...EMPTY_VIEW, query: "S1.02" } as GridView, spy);
    expect(shown().ids).toHaveLength(60);
    expect(Object.keys(spy.mock.calls.at(-1)?.[0] as GridView).sort()).toEqual(VIEW_KEYS);
  });

  it("the check fails on a grid that ignores the hidden columns it was given", () => {
    const view = VIEWS["hidden columns only"]!;
    open({ ...view, hidden: [] });
    expect(() => checkOpened(shown(), expected(view))).toThrow(
      "initial view ignored: hidden columns",
    );
  });

  it("drops the parts naming a column the grid no longer has", () => {
    open({
      ...EMPTY_VIEW,
      filters: { "Listing.closePrice": "<=5" },
      hidden: ["Listing.closePrice", "Listing.unitNumber"],
    } as GridView);
    expect(shown().ids).toHaveLength(60);
    expect(shown().headers).toHaveLength(8);
  });
});

describe("reports each change", () => {
  const last = (spy: ReturnType<typeof vi.fn>) => spy.mock.calls.at(-1)?.[0] as GridView;

  it("filters, sort, groups and hidden columns: 4 cells, each view with exactly four keys", async () => {
    const spy = vi.fn();
    open(EMPTY_VIEW, spy);
    expect(sameView(last(spy), EMPTY_VIEW)).toBe(true);
    let cells = 0;

    fireEvent.change(screen.getByLabelText("Lọc cột Căn"), { target: { value: "S1.03" } });
    expect(last(spy).filters).toEqual({ "Listing.unitNumber": "S1.03" });
    fireEvent.change(screen.getByLabelText("Lọc cột Phòng ngủ"), { target: { value: "2" } });
    expect(last(spy).filters).toEqual({ "Listing.unitNumber": "S1.03", "Unit.bedroomsTotal": "2" });
    cells += 1;

    openMenu(headerButton("Giá chào"));
    fireEvent.click(
      await screen
        .findByRole("menuitemradio", { name: /Giảm dần/ })
        .catch(() => screen.findByRole("menuitem", { name: /Giảm dần/ })),
    );
    expect(last(spy).sort).toEqual([{ field: "Listing.listPrice", direction: "desc" }]);
    cells += 1;

    fireEvent.click(screen.getByRole("button", { name: "Nhóm theo Toà" }));
    expect(last(spy).grouped).toBe(true);
    cells += 1;

    openMenu(screen.getByRole("button", { name: "Cột" }));
    fireEvent.click(await screen.findByRole("menuitemcheckbox", { name: "Dự án" }));
    expect(last(spy).hidden).toEqual(["Listing.subdivisionName"]);
    cells += 1;

    expect(cells).toBe(4);
    for (const [view] of spy.mock.calls)
      expect(() => checkFourKeys(view as GridView)).not.toThrow();
    expect(
      sameView(last(spy), {
        filters: { "Listing.unitNumber": "S1.03", "Unit.bedroomsTotal": "2" },
        sort: [{ field: "Listing.listPrice", direction: "desc" }],
        grouped: true,
        hidden: ["Listing.subdivisionName"],
      }),
    ).toBe(true);
  });
});

describe("sameView", () => {
  const base: GridView = VIEWS["all four"]!;
  const PAIRS: [string, GridView, GridView, boolean][] = [
    ["itself", base, base, true],
    [
      "filters in another key order",
      base,
      {
        ...base,
        filters: {
          "Listing.buildingName": "S1.0",
          "Listing.standardStatus": ["Active"],
          "Listing.unitNumber": CODE_START,
        },
      },
      true,
    ],
    [
      "values of a filter in another order",
      { ...base, filters: { "Listing.standardStatus": ["Active", "Hold"] } },
      { ...base, filters: { "Listing.standardStatus": ["Hold", "Active"] } },
      true,
    ],
    [
      "an empty filter counts as none",
      base,
      { ...base, filters: { ...base.filters, "Unit.bedroomsTotal": "  " } },
      true,
    ],
    [
      "hidden columns in another order",
      base,
      { ...base, hidden: [...base.hidden].reverse() },
      true,
    ],
    [
      "another text in a column filter",
      base,
      { ...base, filters: { ...base.filters, "Listing.unitNumber": "S2" } },
      false,
    ],
    ["another filter", base, { ...base, filters: { "Listing.standardStatus": ["Active"] } }, false],
    [
      "another sort direction",
      base,
      { ...base, sort: [{ field: "Listing.listPrice", direction: "asc" }] },
      false,
    ],
    ["groups off", base, { ...base, grouped: false }, false],
    [
      "one more hidden column",
      base,
      { ...base, hidden: [...base.hidden, "Unit.livingArea"] },
      false,
    ],
  ];

  it.each(PAIRS)("%s", (_, a, b, same) => {
    expect(sameView(a, b)).toBe(same);
    expect(sameView(b, a)).toBe(same);
  });

  it("10 pairs written ahead", () => {
    expect(PAIRS).toHaveLength(10);
  });

  it("the check fails on a sameView blind to a column filter's text", () => {
    const blind = (a: GridView, b: GridView) =>
      sameView({ ...a, filters: {} }, { ...b, filters: {} });
    const other = { ...base, filters: { ...base.filters, "Listing.unitNumber": "S2" } };
    const check = (eq: (a: GridView, b: GridView) => boolean) => {
      if (eq(base, other)) throw new Error("sameView blind to filter text");
    };
    expect(() => check(sameView)).not.toThrow();
    expect(() => check(blind)).toThrow("sameView blind to filter text");
  });
});

/** The four things of a view (row 2c), sorted: a search text is not one of them (row 2e). */
const VIEW_KEYS = ["filters", "grouped", "hidden", "sort"];

function checkFourKeys(view: object): void {
  const keys = Object.keys(view).sort();
  if (keys.includes("query")) throw new Error("view carries search text");
  if (JSON.stringify(keys) !== JSON.stringify(VIEW_KEYS))
    throw new Error(`view keys: ${keys.join()}`);
}

describe("a view holds four things, never a search text (row 2e)", () => {
  it("the empty view has exactly the four keys", () => {
    expect(Object.keys(EMPTY_VIEW).sort()).toEqual(VIEW_KEYS);
    expect(VIEW_KEYS).toHaveLength(4);
  });

  it("the inventory's save body and opened view carry no search text, even from old data", () => {
    const old = { ...VIEWS["all four"]!, query: "0905" } as GridView;
    const body = JSON.parse(JSON.stringify({ view: storedView(old) })) as { view: object };
    expect(() => checkFourKeys(body.view)).not.toThrow();
    const opened = gridView({ ...storedView(VIEWS["all four"]!), query: "0905" } as never);
    expect(() => checkFourKeys(opened)).not.toThrow();
    expect(sameView(opened, VIEWS["all four"]!)).toBe(true);
  });

  it("the check fails on a view that carries a search text again", () => {
    expect(() => checkFourKeys({ ...EMPTY_VIEW, query: "S1" })).toThrow("view carries search text");
  });
});
