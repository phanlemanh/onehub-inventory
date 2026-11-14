// @vitest-environment jsdom
// The shared grid used by hand like a sheet (roadmap row 2a, _acceptance/bang-hang-dung-tay-nhu-sheet): header menu
// sort, filter row, grouping, columns, and the region's one «open row» door. E4, E6, E7, E8, E12 of the contract.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { typedColumn, type FieldKey } from "../src/components/candidate/column-kind";
import { DataRegion, type GridRow } from "../src/components/candidate/data-region";
import { MONEY_FILTER_UNIT } from "../src/components/candidate/grid-view";
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

  it("shows one box per column, filters by the rule, marks a bad rule, clears back to all rows", () => {
    region();
    expect(screen.queryByRole("button", { name: /^Lọc/ })).toBeNull();
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
    expect(document.querySelectorAll("[data-slot=column-filter]")).toHaveLength(3);
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

// Row 2c (luu-goc-nhin-cot-hai), E12 — Ngoài-4 of 2a: a filter that leaves no row keeps the toolbar and the filter row
// where they are; the body says so and each rule can be mended on its own. Row 2e: the box typed in is the Căn filter.
describe("no match keeps the toolbar", () => {
  const codeBox = () => screen.getByLabelText("Lọc cột Căn") as HTMLInputElement;
  const TOOLS = ["sheet-tools", "group-toggle", "columns-toggle"];

  /** The toolbar and the filter boxes are still there, and the Căn filter box is the same element as before. */
  function checkKept(before: HTMLInputElement): void {
    if (codeBox() !== before) throw new Error("filter box remounted on no match");
    for (const slot of TOOLS)
      if (!document.querySelector(`[data-slot=${slot}]`)) throw new Error(`toolbar lost ${slot}`);
    if (document.querySelectorAll("[data-slot=column-filter]").length !== 8)
      throw new Error("filters gone on no match");
  }

  const WAYS: [string, () => void, () => void, () => number][] = [
    [
      "Căn «zzz»",
      () => {
        act(() => codeBox().focus());
        fireEvent.change(codeBox(), { target: { value: "zzz" } });
      },
      () => fireEvent.change(codeBox(), { target: { value: "" } }),
      () => 60,
    ],
    [
      "Toà «khong-co»",
      () =>
        fireEvent.change(screen.getByLabelText("Lọc cột Toà"), { target: { value: "khong-co" } }),
      () => fireEvent.change(screen.getByLabelText("Lọc cột Toà"), { target: { value: "" } }),
      () => 60,
    ],
    [
      "Giá chào «<0» beside Phòng ngủ «2»",
      () => {
        fireEvent.change(screen.getByLabelText("Lọc cột Phòng ngủ"), { target: { value: "2" } });
        fireEvent.change(screen.getByLabelText("Lọc cột Giá chào"), { target: { value: "<0" } });
      },
      () => fireEvent.change(screen.getByLabelText("Lọc cột Giá chào"), { target: { value: "" } }),
      () => rows.filter((r) => r["Unit.bedroomsTotal"] === 2).length,
    ],
  ];

  it.each(WAYS)("%s", (name, empty, mend, left) => {
    region();
    const before = codeBox();
    empty();
    expect(bodyRows()).toHaveLength(0);
    checkKept(before);
    if (name.startsWith("Căn")) {
      expect(document.activeElement).toBe(before);
      expect(before.value).toBe("zzz");
    }
    expect(screen.getByText("Không có dòng nào khớp")).toBeTruthy();
    expect(screen.getAllByRole("button", { name: "Xoá lọc" })).toHaveLength(1);
    mend();
    expect(bodyRows()).toHaveLength(left());
  });

  it("3 ways written ahead", () => {
    expect(WAYS).toHaveLength(3);
  });

  it("the check fails when the toolbar is drawn again outside the grid", () => {
    region();
    const before = codeBox();
    fireEvent.change(before, { target: { value: "zzz" } });
    const copy = before.cloneNode() as HTMLInputElement;
    before.replaceWith(copy);
    expect(() => checkKept(before)).toThrow("filter box remounted on no match");
  });
});

// Row 2e (bo-o-tim-cua-vung): the region has no search box; a person filters by the boxes under the column headers.
describe("column filters instead of a search box (row 2e)", () => {
  const box = (header: string) => screen.getByLabelText(`Lọc cột ${header}`) as HTMLInputElement;
  const shownIds = () => bodyRows().map((tr) => tr.getAttribute("data-row-id") as string);
  const idsOf = (keep: (r: GridRow) => boolean) => rows.filter(keep).map((r) => r.id);
  const fold = (t: unknown) =>
    String(t ?? "")
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .toLowerCase();
  const DAY = 86_400_000;
  const VN = 7 * 3_600_000;
  const days = (r: GridRow) =>
    Math.floor((Date.now() + VN) / DAY) -
    Math.floor((new Date(r["Listing.lastConfirmedAt"] as string).getTime() + VN) / DAY);
  const price = (r: GridRow) => (r["Listing.listPrice"] as number) / MONEY_FILTER_UNIT;
  const firstCode = String(rows[0]?.["Listing.unitNumber"]).slice(0, 4);
  const firstTower = String(rows[0]?.["Listing.buildingName"]);
  // The sample confirms rows on nine days; the date rule keeps the days strictly inside that span, whatever today is.
  const confirmedDays = rows.map(days);
  const dayRule = `${Math.min(...confirmedDays) + 1}-${Math.max(...confirmedDays) - 1}`;
  const [dayLow, dayHigh] = dayRule.split("-").map(Number) as [number, number];

  /** Every row the filter keeps is drawn, not only the rows of the first window, and no other row is. */
  function checkAllMatches(shown: readonly string[], expected: readonly string[]): void {
    const missed = expected.filter((id) => !shown.includes(id));
    if (missed.length > 0)
      throw new Error(`column filter missed rows outside the window: ${missed.length}`);
    const extra = shown.filter((id) => !expected.includes(id));
    if (extra.length > 0)
      throw new Error(`column filter shows rows that do not match: ${extra[0]}`);
  }

  // Six ways to filter, written down before the check: what is typed (or opened with) and the rows it must keep.
  const CASES: [string, () => void, (r: GridRow) => boolean][] = [
    [
      "chữ ở Căn",
      () => fireEvent.change(box("Căn"), { target: { value: firstCode } }),
      (r) => fold(r["Listing.unitNumber"]).includes(fold(firstCode)),
    ],
    [
      "chữ ở Toà",
      () => fireEvent.change(box("Toà"), { target: { value: firstTower } }),
      (r) => fold(r["Listing.buildingName"]).includes(fold(firstTower)),
    ],
    [
      "số khoảng ở Giá chào",
      () => fireEvent.change(box("Giá chào"), { target: { value: "3-6" } }),
      (r) => price(r) >= 3 && price(r) <= 6,
    ],
    [
      "ngày khoảng",
      () => fireEvent.change(box("Xác nhận lúc"), { target: { value: dayRule } }),
      (r) => days(r) >= dayLow && days(r) <= dayHigh,
    ],
    [
      "trạng thái chọn nhiều",
      () => {},
      (r) => ["Active", "Pending"].includes(r["Listing.standardStatus"] as string),
    ],
    [
      "hai ô chồng",
      () => {
        fireEvent.change(box("Toà"), { target: { value: firstTower } });
        fireEvent.change(box("Giá chào"), { target: { value: "<=6" } });
      },
      (r) => fold(r["Listing.buildingName"]).includes(fold(firstTower)) && price(r) <= 6,
    ],
  ];

  it("has the six cases written down", () => {
    expect(CASES).toHaveLength(6);
  });

  it.each(CASES)("%s keeps exactly the matching rows and counts them", (name, type, keep) => {
    region(
      name === "trạng thái chọn nhiều"
        ? { initialFilters: { "Listing.standardStatus": ["Active", "Pending"] } }
        : {},
    );
    type();
    const expected = idsOf(keep);
    expect(expected.length, name).toBeGreaterThan(0);
    expect(expected.length, name).toBeLessThan(60);
    expect(() => checkAllMatches(shownIds(), expected)).not.toThrow();
    expect(footer()).toBe(`${expected.length} / 60 dòng`);
  });

  it("the check fails on a filter that only filters the rows drawn in the first window", () => {
    region();
    const expected = idsOf((r) => price(r) <= 6);
    fireEvent.change(box("Giá chào"), { target: { value: "<=6" } });
    const windowOnly = shownIds().filter((id) => rows.findIndex((r) => r.id === id) < 20);
    expect(() => checkAllMatches(windowOnly, expected)).toThrow(
      "column filter missed rows outside the window",
    );
  });

  /** After «Xoá lọc» no filter box holds a rule. */
  function checkCleared(): void {
    for (const input of document.querySelectorAll<HTMLInputElement>(
      "[data-slot=column-filter] input",
    ))
      if (input.value !== "")
        throw new Error(`clear left a filter on: ${input.getAttribute("aria-label")}`);
  }

  it("no match: says so in the words of the design, keeps the box typed in, mends and clears", () => {
    const design = readFileSync(
      resolve(__dirname, "../_acceptance/bo-o-tim-cua-vung/design.md"),
      "utf8",
    );
    const why = /\| ST-inventory-khong-khop \|[^|]*\| «[^»]+» · «([^»]+)» · «Xoá lọc» \|/.exec(
      design,
    )?.[1];
    expect(why).toBeTruthy();
    region();
    act(() => box("Căn").focus());
    fireEvent.change(box("Căn"), { target: { value: "zzz-khong-co" } });
    expect(bodyRows()).toHaveLength(0);
    expect(screen.getByText("Không có dòng nào khớp")).toBeTruthy();
    const state = document.querySelector('[data-slot="region-state"][data-kind="no-match"]');
    expect(state?.textContent).toContain(why as string);
    expect(state?.textContent?.toLocaleLowerCase("vi")).not.toContain("tìm");
    expect(screen.getAllByRole("button", { name: "Xoá lọc" })).toHaveLength(1);
    expect(document.querySelector("[data-slot=region-toolbar]")).not.toBeNull();
    expect(document.querySelectorAll("[data-slot=column-filter]")).toHaveLength(8);
    expect(document.activeElement).toBe(box("Căn"));
    expect(box("Căn").value).toBe("zzz-khong-co");
    fireEvent.change(box("Căn"), { target: { value: "" } });
    expect(bodyRows()).toHaveLength(60);
    fireEvent.change(box("Căn"), { target: { value: "zzz" } });
    fireEvent.change(box("Toà"), { target: { value: firstTower } });
    fireEvent.click(screen.getByRole("button", { name: "Xoá lọc" }));
    expect(() => checkCleared()).not.toThrow();
    expect(box("Căn").value).toBe("");
    expect(box("Toà").value).toBe("");
    expect(footer()).toBe("60 dòng");
  });

  it("the check fails when «Xoá lọc» clears only one box", () => {
    region();
    fireEvent.change(box("Căn"), { target: { value: "zzz" } });
    fireEvent.change(box("Toà"), { target: { value: firstTower } });
    fireEvent.change(box("Căn"), { target: { value: "" } });
    expect(() => checkCleared()).toThrow("clear left a filter on: Lọc cột Toà");
  });

  /** The filter row is under the headers on the first draw, and there is no «Lọc» switch to hide it. */
  function checkFilterRowOpen(): void {
    if (document.querySelectorAll("[data-slot=column-filter]").length !== 8)
      throw new Error("filter row hidden on open");
    if (screen.queryByRole("button", { name: /^Lọc/ })) throw new Error("filter switch is back");
  }

  // Three ways to open the region, written down before the check.
  const OPENINGS: [string, Partial<Parameters<typeof DataRegion>[0]>][] = [
    ["không lọc sẵn", {}],
    ["lọc sẵn bằng initialFilters", { initialFilters: { "Listing.buildingName": firstTower } }],
    [
      "góc nhìn có lọc",
      {
        initialView: {
          filters: { "Listing.listPrice": "<=6" },
          sort: [],
          grouped: false,
          hidden: [],
        },
      },
    ],
  ];

  it("has the three openings written down", () => {
    expect(OPENINGS).toHaveLength(3);
  });

  it.each(OPENINGS)("%s: the filter row shows at once", (_name, props) => {
    region(props);
    expect(() => checkFilterRowOpen()).not.toThrow();
  });

  it("the check fails when the filter row is hidden on open", () => {
    region();
    for (const cell of document.querySelectorAll("[data-slot=column-filter]")) cell.remove();
    expect(() => checkFilterRowOpen()).toThrow("filter row hidden on open");
  });
});
