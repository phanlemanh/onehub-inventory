// @vitest-environment jsdom
// Row 2b (_acceptance/bang-hang-the-dien-thoai): below 768 px the grid region shows its rows as the listing card's row
// layout, from the same table state as the grid. E1, E4, E5, E6, E7, E13, E14 of the contract. Every measure has a
// break pair: the same fixture, broken, must fail with the pinned message.
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import { ActionPermissionProvider } from "../src/components/candidate/action-permission";
import { typedColumn } from "../src/components/candidate/column-kind";
import {
  DataRegion,
  type GridRow,
  type RegionStatus,
} from "../src/components/candidate/data-region";
import type { RegionPhoneList } from "../src/components/candidate/phone-list";
import { sampleUnits, subdivisionNameOf } from "../src/modules/catalog";
import { SAMPLE_COMPANY, buildSampleListings } from "../src/modules/listings";
import {
  INVENTORY_FIELDS,
  ListingCard,
  inventoryEdgeRowsFrom,
  inventoryFiltersFrom,
  inventoryRows,
  listingView,
} from "../src/modules/listings/ui";
import { formatByKind } from "../src/lib/format";
import { tallGridViewport } from "./virtual-viewport";

vi.setConfig({ testTimeout: 20_000 });

let width = 360;
function setWidth(w: number) {
  width = w;
  Object.defineProperty(window, "innerWidth", { configurable: true, value: w });
}

beforeAll(() => {
  tallGridViewport();
  window.matchMedia = ((query: string) => {
    const max = /max-width:\s*(\d+)px/.exec(query);
    return {
      matches: max ? width <= Number(max[1]) : false,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      onchange: null,
      dispatchEvent: () => false,
    };
  }) as unknown as typeof window.matchMedia;
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
  Element.prototype.getAnimations ??= () => [];
  Element.prototype.scrollIntoView ??= () => {};
});
beforeEach(() => setWidth(360));
afterEach(cleanup);

const units = sampleUnits().map((u) => ({ ...u, subdivisionName: subdivisionNameOf(u) }));
const sample = buildSampleListings({ companyId: SAMPLE_COMPANY.id, units });
const rows = inventoryRows({
  listings: sample.listings,
  listingUnits: sample.listingUnits,
  units,
}) as GridRow[];
const HEADERS = {
  "Listing.unitNumber": "Căn",
  "Listing.buildingName": "Toà",
  "Listing.subdivisionName": "Dự án",
  "Listing.standardStatus": "Trạng thái",
  "Listing.listPrice": "Giá chào",
  "Unit.livingArea": "Diện tích",
  "Unit.bedroomsTotal": "Phòng ngủ",
  "Listing.lastConfirmedAt": "Xác nhận lúc",
} as const;
const columns = INVENTORY_FIELDS.map((field) => typedColumn({ field, header: HEADERS[field] }));

const phoneList: RegionPhoneList<GridRow> = {
  label: (row) => `Căn ${String(row["Listing.unitNumber"])}`,
  card: (row) => (
    <ListingCard
      layout="row"
      view={listingView(row, HEADERS)}
      priceLabel="Giá chào"
      building={String(row["Listing.buildingName"] ?? "")}
    />
  ),
};

type Props = Partial<Parameters<typeof DataRegion>[0]>;
const region = (props: Props = {}) =>
  render(
    <DataRegion
      title="Hàng"
      columns={columns}
      rows={rows}
      emptyWhy="x"
      groupBy="Listing.buildingName"
      phoneList={phoneList}
      record={{ render: (row) => ({ title: String(row["Listing.unitNumber"]), body: null }) }}
      {...props}
    />,
  );

const cards = () => [...document.querySelectorAll<HTMLElement>("[data-slot=phone-card]")];
const cardIds = () => cards().map((c) => c.getAttribute("data-row-id"));
const tableIds = () =>
  [...document.querySelectorAll("tbody tr[data-row-id]")]
    .map((tr) => tr.getAttribute("data-row-id"))
    .filter((id) => !id?.startsWith("nhom:"));
const footer = () => document.querySelector("[data-slot=region-footer-count]")?.textContent;

/** The ids the region shows at 1440 for the same props: the grid's own order, read from the table. */
function gridOrder(props: Props = {}) {
  setWidth(1440);
  const view = region(props);
  const ids = tableIds();
  view.unmount();
  setWidth(360);
  return ids;
}

describe("danh-sach (E1)", () => {
  it("shows every row as a row-layout listing card, in grid order, with no table and no frame", () => {
    const expected = gridOrder();
    region();
    expect(document.querySelector("table")).toBeNull();
    expect(cards()).toHaveLength(60);
    if (JSON.stringify(cardIds()) !== JSON.stringify(expected))
      throw new Error("phone cards out of grid order");
    expect(footer()).toBe("60 dòng");
    const list = document.querySelector("[data-slot=phone-list]")!;
    expect(list.closest("[data-slot^=frame]")).toBeNull();
    for (const card of cards()) {
      const row = rows.find((r) => r.id === card.getAttribute("data-row-id"))!;
      const text = card.textContent ?? "";
      const unit = String(row["Listing.unitNumber"]);
      if (!text.includes(unit)) throw new Error(`phone card missing unit: ${unit}`);
      if (!text.includes(formatByKind("money", row["Listing.listPrice"])))
        throw new Error(`phone card missing price: ${unit}`);
      if (!text.includes(formatByKind("area", row["Unit.livingArea"])))
        throw new Error(`phone card missing fact: ${unit} Diện tích`);
      expect(card.querySelector("[data-slot=listing-card][data-layout=row]")).not.toBeNull();
      expect(card.querySelector("[data-slot=listing-card-status]")?.textContent).not.toBe("");
    }
  });

  it("break: a card without its price fails with the pinned message", () => {
    const broken: RegionPhoneList<GridRow> = {
      ...phoneList,
      card: (row) => <span>{String(row["Listing.unitNumber"])}</span>,
    };
    region({ phoneList: broken });
    const card = cards()[0]!;
    const row = rows.find((r) => r.id === card.getAttribute("data-row-id"))!;
    const check = () => {
      if (!(card.textContent ?? "").includes(formatByKind("money", row["Listing.listPrice"])))
        throw new Error(`phone card missing price: ${String(row["Listing.unitNumber"])}`);
    };
    expect(check).toThrow(/^phone card missing price: /);
  });

  it("from 768 the region is the table, with no card", () => {
    setWidth(768);
    region();
    expect(document.querySelector("table")).not.toBeNull();
    expect(cards()).toHaveLength(0);
  });

  it("the record head keeps the stacked card", () => {
    render(<ListingCard view={listingView(rows[0]!, HEADERS)} priceLabel="Giá chào" />);
    expect(
      document.querySelector("[data-slot=listing-card]")?.getAttribute("data-layout"),
    ).toBeNull();
    expect(document.querySelector("[data-slot=listing-card-facts]")?.tagName).toBe("DL");
  });
});

/** Opens the filter sheet. */
function openSheet() {
  fireEvent.click(document.querySelector("[data-slot=phone-filter-button]")!);
}

describe("loc (E4)", () => {
  it("filters through the sheet with the grid's filters; chips, count and clear", async () => {
    region({ initialFilters: inventoryFiltersFrom("Active") });
    const active = rows.filter((r) => r["Listing.standardStatus"] === "Active").map((r) => r.id);
    if (JSON.stringify([...cardIds()].sort()) !== JSON.stringify([...active].sort()))
      throw new Error("phone list ignored filter: status Active");
    expect(footer()).toBe(`${active.length} / 60 dòng`);
    expect(screen.getByRole("button", { name: "Lọc (1)" })).toBeTruthy();
    const chips = document.querySelector("[data-slot=phone-filter-chips]")!;
    expect(
      within(chips as HTMLElement).getByRole("button", { name: "Bỏ lọc Trạng thái" }),
    ).toBeTruthy();
    fireEvent.click(within(chips as HTMLElement).getByRole("button", { name: "Xoá lọc" }));
    expect(cards()).toHaveLength(60);
    expect(screen.getByRole("button", { name: "Lọc" })).toBeTruthy();
  });

  it("a filter typed in the sheet matches the grid's set; no match shows the region's sentence", async () => {
    region();
    openSheet();
    const box = await screen.findByRole("textbox", { name: "Lọc cột Căn" });
    act(() => {
      fireEvent.change(box, { target: { value: "zzz-khong-co" } });
    });
    if (cards().length !== 0) throw new Error("phone list ignored filter: Căn zzz-khong-co");
    expect(document.body.textContent).toContain("Không có dòng nào khớp");
  });
});

describe("sap-theo (E4)", () => {
  it("sorting from the sheet is the grid's sort", async () => {
    const onViewChange = vi.fn();
    region({ onViewChange });
    openSheet();
    const sort = await screen.findByText("Sắp theo");
    const block = sort.closest("[data-slot=phone-sort]") as HTMLElement;
    fireEvent.click(within(block).getByRole("button", { name: "Giá chào" }));
    fireEvent.click(within(block).getByRole("button", { name: "Giảm dần" }));
    const prices = cardIds().map(
      (id) => rows.find((r) => r.id === id)!["Listing.listPrice"] as number,
    );
    const sorted = [...prices].sort((a, b) => b - a);
    if (JSON.stringify(prices) !== JSON.stringify(sorted))
      throw new Error("phone sort not the grid sort");
    const last = onViewChange.mock.calls.at(-1)?.[0];
    expect(last.sort).toEqual([{ field: "Listing.listPrice", direction: "desc" }]);
  });
});

describe("nhom (E6)", () => {
  it("group rows on cards equal the grid's group rows", () => {
    setWidth(1440);
    const desk = region({ initialView: { filters: {}, sort: [], grouped: true, hidden: [] } });
    const deskGroups = [...document.querySelectorAll("tbody tr[data-row-id^='nhom:']")].map((tr) =>
      tr.textContent?.replace(/\s+/g, " ").trim(),
    );
    desk.unmount();
    setWidth(360);
    region({ initialView: { filters: {}, sort: [], grouped: true, hidden: [] } });
    const phoneGroups = [...document.querySelectorAll("[data-slot=phone-group] h3")].map(
      (h) => h.textContent,
    );
    if (phoneGroups.length !== deskGroups.length)
      throw new Error(
        `phone list lost group: ${deskGroups.length - phoneGroups.length} of ${deskGroups.length}`,
      );
    for (const [i, g] of phoneGroups.entries()) {
      const [label] = (g ?? "").split(/(\d+)$/);
      if (!deskGroups[i]?.includes(label!.trim()))
        throw new Error(`phone list lost group: ${label}`);
    }
  });
});

describe("trang-thai (E7)", () => {
  const STATES: RegionStatus[] = ["loading", "error", "forbidden", "partial"];
  it.each(STATES)("%s shows the region's words and cards only when partial", (status) => {
    region({ status, rows: status === "partial" ? rows.slice(0, 40) : rows });
    const n = cards().length;
    if (status !== "partial" && n > 0) throw new Error(`phone cards shown in state ${status}`);
    if (status === "partial") expect(n).toBe(40);
  });
  it("empty shows the empty sentence, no card", () => {
    region({ rows: [], emptyWhy: "Sàn chưa có căn nào." });
    expect(cards()).toHaveLength(0);
    expect(document.body.textContent).toContain("Sàn chưa có căn nào.");
  });
});

describe("cua-phat-trien (E13)", () => {
  it.each([
    ["bien", "production", 0],
    ["bien", "development", 9],
    [undefined, "development", 0],
    ["khac", "development", 0],
  ] as const)("?mau=%s in %s gives %i edge rows", (param, env, n) => {
    const got = inventoryEdgeRowsFrom(param, env).length;
    if (env === "production" && got > 0) throw new Error("dev seam active in production: mau");
    expect(got).toBe(n);
  });
});

describe("bo-nut (E14)", () => {
  // The 9e template on the region: a unit's own actions by the permission table, the same set on the card (360) and on
  // the grid row (1440). An action without permission is absent, never shown disabled.
  const cases = [
    ["ListAgent", true, ["Sửa", "Xoá căn"]],
    ["ListAgent", false, ["Sửa"]],
    ["BuyerAgent", true, ["Sửa"]],
    ["TeamLead", false, ["Sửa", "Xoá căn"]],
  ] as const;
  const menuOf = async (role: string, mine: boolean) => {
    const permitted = (action: string, own: boolean) =>
      action === "updateListing" ||
      (action === "removeListing" && (role === "TeamLead" || (role === "ListAgent" && own)));
    const view = render(
      <ActionPermissionProvider permitted={permitted}>
        <DataRegion
          title="Hàng"
          columns={columns}
          rows={rows.slice(0, 3)}
          emptyWhy="x"
          phoneList={phoneList}
          rowActions={() => ({
            mine,
            actions: [
              { action: "updateListing", label: "Sửa", onSelect: () => {} },
              {
                action: "removeListing",
                label: "Xoá căn",
                remove: { verb: "Xoá căn", what: "x", done: "x", apply: async () => {} },
              },
            ],
          })}
        />
      </ActionPermissionProvider>,
    );
    const trigger = screen.getAllByRole("button", { name: /Việc khác/ })[0]!;
    // On a phone the row's «…» sits in a 44 × 44 touch target (G-1411-130); the table keeps its own cell.
    if (width < 768 && !trigger.closest("[data-slot=touch-target]"))
      throw new Error("row «…» outside a touch target on a phone");
    await act(async () => {
      fireEvent.click(trigger);
    });
    const items = await screen.findAllByRole("menuitem");
    for (const item of items)
      if (item.getAttribute("aria-disabled") === "true" || item.hasAttribute("data-disabled"))
        throw new Error(`row action shown disabled: ${role} ${item.textContent}`);
    const names = items.map((i) => i.textContent?.trim());
    view.unmount();
    return names;
  };
  it.each(cases)(
    "%s (mine %s) sees %j on the card and on the grid row",
    async (role, mine, expected) => {
      expect(await menuOf(role, mine)).toEqual(expected);
      expect(document.querySelector("[data-slot=phone-card]")).toBeNull();
      setWidth(1440);
      expect(await menuOf(role, mine)).toEqual(expected);
    },
  );
});
