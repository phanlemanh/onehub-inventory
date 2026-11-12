// @vitest-environment jsdom
// The shared grid used by hand like a sheet (roadmap row 2a, _acceptance/bang-hang-dung-tay-nhu-sheet): header menu
// sort, filter row, grouping, columns, and the region's one «open row» door. E4, E6, E7, E8, E12 of the contract.
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { typedColumn, type FieldKey } from "../src/components/candidate/column-kind";
import { DataRegion, type GridRow } from "../src/components/candidate/data-region";
import { MONEY_FILTER_UNIT } from "../src/components/candidate/grid-view";
import { sampleUnits, subdivisionNameOf } from "../src/modules/catalog";
import { SAMPLE_COMPANY, buildSampleListings } from "../src/modules/listings";
import { INVENTORY_FIELDS, inventoryRows } from "../src/modules/listings/ui";
import { tallGridViewport } from "./virtual-viewport";

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

const region = (props: Partial<Parameters<typeof DataRegion>[0]> = {}) =>
  render(
    <DataRegion
      title="Hàng"
      columns={columns}
      rows={rows}
      emptyWhy="x"
      groupBy="Listing.buildingName"
      {...props}
    />,
  );

const bodyRows = (root: ParentNode = document) =>
  [...root.querySelectorAll<HTMLTableRowElement>("tbody tr[data-row-id]")].filter(
    (tr) => !tr.getAttribute("data-row-id")?.startsWith("nhom:"),
  );
const cellOf = (tr: Element, field: FieldKey) => tr.querySelector(`td[data-col-id="${field}"]`);
const numbers = () =>
  [...document.querySelectorAll("[data-slot=row-number]")].map((el) =>
    Number(el.getAttribute("data-row-number")),
  );
const footer = () => document.querySelector("[data-slot=region-footer-count]")?.textContent;
const headerNames = () =>
  [...document.querySelectorAll("thead th")].map((th) => th.textContent?.trim()).filter(Boolean);

function openMenu(trigger: Element) {
  act(() => {
    fireEvent.pointerDown(trigger, { button: 0, pointerType: "mouse" });
    fireEvent.mouseDown(trigger, { button: 0 });
    fireEvent.click(trigger);
  });
}
const headerButton = (name: string) =>
  screen.getAllByRole("button").find((b) => b.textContent?.trim() === name) as HTMLElement;

describe("sort by the header menu", () => {
  it("orders the price column up and keeps row numbers 1..60", async () => {
    region();
    openMenu(headerButton("Giá chào"));
    fireEvent.click(
      await screen
        .findByRole("menuitemradio", { name: /Tăng dần/ })
        .catch(() => screen.findByRole("menuitem", { name: /Tăng dần/ })),
    );
    const prices = bodyRows().map((tr) => {
      const id = tr.getAttribute("data-row-id");
      return rows.find((r) => r.id === id)?.["Listing.listPrice"] as number;
    });
    expect(prices).toHaveLength(60);
    for (let i = 1; i < prices.length; i += 1)
      expect(prices[i - 1] as number).toBeLessThanOrEqual(prices[i] as number);
    expect(numbers()).toEqual(Array.from({ length: 60 }, (_, i) => i + 1));
  });
});

describe("filter row", () => {
  const priceBox = () => screen.getByLabelText("Lọc cột Giá chào") as HTMLInputElement;

  /** A rule that cannot be read must be marked on its box and filter nothing. */
  function checkInvalid(box: HTMLInputElement): void {
    if (box.getAttribute("aria-invalid") !== "true") throw new Error("invalid rule not marked");
  }

  it("opens one box per column, filters by the rule, marks a bad rule, clears back to all rows", () => {
    region();
    fireEvent.click(screen.getByRole("button", { name: /^Lọc/ }));
    expect(document.querySelectorAll("[data-slot=column-filter]")).toHaveLength(8);
    expect(
      document.querySelectorAll('[data-slot=column-filter][data-filter-mode="values"]'),
    ).toHaveLength(1);
    fireEvent.change(priceBox(), { target: { value: "<=5" } });
    const cheap = rows.filter((r) => (r["Listing.listPrice"] as number) <= 5 * MONEY_FILTER_UNIT);
    expect(bodyRows()).toHaveLength(cheap.length);
    expect(footer()).toBe(`${cheap.length} / 60 dòng`);
    fireEvent.change(priceBox(), { target: { value: "5 tỷ" } });
    expect(() => checkInvalid(priceBox())).not.toThrow();
    expect(bodyRows()).toHaveLength(60);
    fireEvent.change(priceBox(), { target: { value: "<0" } });
    expect(screen.getByText("Không có dòng nào khớp")).toBeTruthy();
    fireEvent.click(screen.getAllByRole("button", { name: "Xoá lọc" })[0] as HTMLElement);
    expect(footer()).toBe("60 dòng");
  });

  it("the check fails when a bad rule is not marked", () => {
    region();
    fireEvent.click(screen.getByRole("button", { name: /^Lọc/ }));
    fireEvent.change(priceBox(), { target: { value: "5 tỷ" } });
    priceBox().removeAttribute("aria-invalid");
    expect(() => checkInvalid(priceBox())).toThrow("invalid rule not marked");
  });
});

describe("group by tower", () => {
  const towers = [...new Set(rows.map((r) => String(r["Listing.buildingName"])))];
  const groupRowsShown = () => [...document.querySelectorAll('tbody tr[data-row-id^="nhom:"]')];

  /** Numbers run 1..n in reading order through the groups; a group row has none. */
  function checkNumbers(): void {
    const shown = numbers();
    shown.forEach((n, i) => {
      if (n !== i + 1) throw new Error("row numbers restart in group");
    });
    for (const tr of groupRowsShown())
      if (tr.querySelector("[data-slot=row-number]")) throw new Error("group row numbered");
  }

  it("shows one group row per tower with its count, numbers on through the groups, folds a group", () => {
    region();
    fireEvent.click(screen.getByRole("button", { name: "Nhóm theo Toà" }));
    const groups = groupRowsShown();
    expect(groups).toHaveLength(towers.length);
    for (const g of groups) {
      const name = g.querySelector("[data-slot=group-label]")?.textContent ?? "";
      const tower = towers.find((t) => name.startsWith(t)) as string;
      const count = rows.filter((r) => r["Listing.buildingName"] === tower).length;
      expect(g.querySelector("[data-slot=group-count]")?.textContent).toBe(`${count} dòng`);
    }
    expect(numbers()).toHaveLength(60);
    checkNumbers();
    const secondFirst = groups[1]?.nextElementSibling?.querySelector("[data-slot=row-number]");
    const before = secondFirst?.getAttribute("data-row-number");
    fireEvent.click(within(groups[0] as HTMLElement).getByRole("button", { name: "Gập nhóm" }));
    const firstCount = Number(
      groups[0]?.querySelector("[data-slot=group-count]")?.textContent?.split(" ")[0],
    );
    expect(bodyRows()).toHaveLength(60 - firstCount);
    const second = groupRowsShown()[1];
    expect(
      second?.nextElementSibling
        ?.querySelector("[data-slot=row-number]")
        ?.getAttribute("data-row-number"),
    ).toBe(before);
  });

  it("filter, group and sort together keep numbers 1..n", () => {
    region({ initialFilters: { "Listing.standardStatus": ["Active"] } });
    fireEvent.click(screen.getByRole("button", { name: "Nhóm theo Toà" }));
    const active = rows.filter((r) => r["Listing.standardStatus"] === "Active").length;
    expect(numbers()).toHaveLength(active);
    checkNumbers();
  });

  it("the number check fails when numbering restarts in a group", () => {
    region();
    fireEvent.click(screen.getByRole("button", { name: "Nhóm theo Toà" }));
    const second = groupRowsShown()[1]?.nextElementSibling?.querySelector("[data-slot=row-number]");
    second?.setAttribute("data-row-number", "1");
    expect(() => checkNumbers()).toThrow("row numbers restart in group");
  });
});

describe("columns menu", () => {
  const menuItems = () =>
    screen.getAllByRole("menuitemcheckbox").map((el) => el.textContent?.trim());

  /** The first column names the row and must never be hidden. */
  function checkFirstKept(items: readonly (string | undefined)[]): void {
    if (items.includes("Căn")) throw new Error("first column can be hidden");
  }

  it("lists seven columns without Căn, hides and shows one in place, moves the group label", async () => {
    region();
    openMenu(screen.getByRole("button", { name: "Cột" }));
    await screen.findAllByRole("menuitemcheckbox");
    expect(menuItems()).toEqual([
      "Toà",
      "Dự án",
      "Trạng thái",
      "Giá chào",
      "Diện tích",
      "Phòng ngủ",
      "Xác nhận lúc",
    ]);
    checkFirstKept(menuItems());
    fireEvent.click(screen.getByRole("menuitemcheckbox", { name: "Dự án" }));
    expect(headerNames().join("|")).not.toContain("Dự án");
    expect(document.querySelector('td[data-col-id="Listing.subdivisionName"]')).toBeNull();
    fireEvent.click(screen.getByRole("menuitemcheckbox", { name: "Dự án" }));
    const names = headerNames();
    expect(names.indexOf("Dự án")).toBe(names.indexOf("Toà") + 1);
    fireEvent.click(screen.getByRole("menuitemcheckbox", { name: "Toà" }));
    fireEvent.keyDown(document.activeElement ?? document.body, { key: "Escape" });
    fireEvent.click(screen.getByRole("button", { name: "Nhóm theo Toà" }));
    const firstGroup = document.querySelector('tbody tr[data-row-id^="nhom:"]') as Element;
    expect(
      cellOf(firstGroup, "Listing.unitNumber")?.querySelector("[data-slot=group-label]"),
    ).not.toBeNull();
  });

  it("the check fails when the first column is offered", () => {
    expect(() => checkFirstKept(["Căn", "Toà"])).toThrow("first column can be hidden");
  });
});

describe("one template, one «open row» door", () => {
  it("another grid screen gets the sheet tools without asking for them", () => {
    render(<DataRegion title="Mẫu" columns={columns.slice(0, 3)} rows={rows} />);
    expect(screen.getByRole("button", { name: /^Lọc/ })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Cột" })).toBeTruthy();
    expect(document.querySelector('table[data-slot="data-grid-table"]')?.getAttribute("role")).toBe(
      "grid",
    );
    expect(screen.queryByRole("button", { name: /Nhóm theo/ })).toBeNull();
  });

  /** Enter on a cell of row k opens row k, through the region's record address. */
  function checkEnter(openedId: string | null, expectedId: string): void {
    if (openedId !== expectedId) throw new Error("enter opened another row");
  }

  it("Enter on a selected cell opens that row when the screen has records, and moves down otherwise", () => {
    const navigate = vi.fn();
    region({
      record: {
        render: (row) => ({ title: String(row["Listing.unitNumber"]), body: null }) as never,
        address: { openId: null, navigate },
      },
    });
    const third = bodyRows()[2] as HTMLTableRowElement;
    fireEvent.mouseDown(cellOf(third, "Listing.subdivisionName") as Element, { button: 0 });
    fireEvent.mouseUp(cellOf(third, "Listing.subdivisionName") as Element, { button: 0 });
    fireEvent.keyDown(document.querySelector('table[data-slot="data-grid-table"]') as Element, {
      key: "Enter",
    });
    const opened = (navigate.mock.calls.at(-1)?.[0] as string | undefined) ?? null;
    expect(() => checkEnter(opened, third.getAttribute("data-row-id") as string)).not.toThrow();
    expect(() =>
      checkEnter(rows[0]?.id ?? null, third.getAttribute("data-row-id") as string),
    ).toThrow("enter opened another row");
  });
});
