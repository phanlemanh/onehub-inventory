// @vitest-environment jsdom
// Row 2c (luu-goc-nhin-cot-hai), E3: the shared grid opens with a given arrangement and reports each change of it.
//   opens-with — six arrangements written ahead (search only, filters only, sort only, groups only, hidden columns only,
//     all five): rows in order, groups and shown headers equal what filterRows, sortRows and groupRows give on the
//     source rows, worked out here apart from the grid.
//   reports — each of the five things a person changes is heard once with the new arrangement (5 cells).
//   sameView — ten pairs written ahead.
//   Breaks: a grid that ignores the hidden columns it was given → «initial view ignored: hidden columns»; a sameView blind
//   to the search text → «sameView blind to query».
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
import { INVENTORY_FIELDS, inventoryRows } from "../src/modules/listings/ui";
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
  const kept = sortRows(
    filterRows(rows, columns, view.filters, view.query),
    columns,
    view.sort[0] ?? null,
  );
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

const VIEWS: Record<string, GridView> = {
  "search only": { ...EMPTY_VIEW, query: "S1.02" },
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
  "all five": {
    query: "S1",
    filters: { "Listing.standardStatus": ["Active"], "Listing.buildingName": "S1.0" },
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
    expect((screen.getByRole("searchbox") as HTMLInputElement).value).toBe(view.query);
  });

  it("6 arrangements written ahead", () => {
    expect(Object.keys(VIEWS)).toHaveLength(6);
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

  it("search, filter, sort, groups and hidden columns: 5 cells", async () => {
    const spy = vi.fn();
    open(EMPTY_VIEW, spy);
    expect(sameView(last(spy), EMPTY_VIEW)).toBe(true);
    let cells = 0;

    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "S1.03" } });
    expect(last(spy).query).toBe("S1.03");
    cells += 1;

    fireEvent.click(screen.getByRole("button", { name: /^Lọc/ }));
    fireEvent.change(screen.getByLabelText("Lọc cột Phòng ngủ"), { target: { value: "2" } });
    expect(last(spy).filters).toEqual({ "Unit.bedroomsTotal": "2" });
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

    expect(cells).toBe(5);
    expect(
      sameView(last(spy), {
        query: "S1.03",
        filters: { "Unit.bedroomsTotal": "2" },
        sort: [{ field: "Listing.listPrice", direction: "desc" }],
        grouped: true,
        hidden: ["Listing.subdivisionName"],
      }),
    ).toBe(true);
  });
});

describe("sameView", () => {
  const base: GridView = VIEWS["all five"]!;
  const PAIRS: [string, GridView, GridView, boolean][] = [
    ["itself", base, base, true],
    [
      "filters in another key order",
      base,
      {
        ...base,
        filters: { "Listing.buildingName": "S1.0", "Listing.standardStatus": ["Active"] },
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
    ["another search text", base, { ...base, query: "S2" }, false],
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

  it("the check fails on a sameView blind to the search text", () => {
    const blind = (a: GridView, b: GridView) => sameView({ ...a, query: "" }, { ...b, query: "" });
    const check = (eq: (a: GridView, b: GridView) => boolean) => {
      if (eq(base, { ...base, query: "S2" })) throw new Error("sameView blind to query");
    };
    expect(() => check(sameView)).not.toThrow();
    expect(() => check(blind)).toThrow("sameView blind to query");
  });
});
