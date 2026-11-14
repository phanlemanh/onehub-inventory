// @vitest-environment jsdom
// Inventory grid (roadmap row 2, _acceptance/bang-hang-ban-doc): rows from the sample data, the grid it shows and the
// region state a URL may ask for. E1, E2, E6 of the contract.
import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import type { GridRow } from "../src/components/candidate/data-region";
import { LABELS } from "../src/generated/labels";
import type { ListingUnit } from "../src/generated/ontology";
import { sampleUnits, subdivisionNameOf } from "../src/modules/catalog";
import { label } from "../src/modules/company-config";
import { SAMPLE_COMPANY, buildSampleListings } from "../src/modules/listings";
import {
  INVENTORY_FIELDS,
  InventoryGrid,
  inventoryRows,
  inventoryStateFrom,
  type InventoryField,
  type InventoryUnit,
} from "../src/modules/listings/ui";
import { tallGridViewport } from "./virtual-viewport";

vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: () => {} }) }));

beforeAll(() => {
  tallGridViewport();
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
  Element.prototype.getAnimations ??= () => [];
  // The grid opens a listing's record (row 3), and the record asks for the screen width through matchMedia.
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
});
afterEach(cleanup);

const units = sampleUnits().map((u) => ({ ...u, subdivisionName: subdivisionNameOf(u) }));
const sample = buildSampleListings({ companyId: SAMPLE_COMPANY.id, units });

type BuildRows = typeof inventoryRows;

/** Every row checked against the source records, through the listing's unit link. */
function checkRows(build: BuildRows): void {
  const rows = build({ listings: sample.listings, listingUnits: sample.listingUnits, units });
  if (rows.length !== 60) throw new Error(`row count: ${rows.length}`);
  const unitByUpi = new Map(units.map((u) => [u.upi, u]));
  const upiByListing = new Map(sample.listingUnits.map((x) => [x.listingId, x.upi]));
  sample.listings.forEach((l, i) => {
    const row = rows[i] as GridRow;
    const unit = unitByUpi.get(upiByListing.get(l.id) ?? "");
    const own: [string, unknown][] = [
      ["Listing.unitNumber", l.unitNumber],
      ["Listing.buildingName", l.buildingName],
      ["Listing.subdivisionName", l.subdivisionName],
      ["Listing.standardStatus", l.standardStatus],
      ["Listing.listPrice", l.listPrice],
      ["Listing.lastConfirmedAt", l.lastConfirmedAt],
    ];
    if (row.id !== l.id) throw new Error(`row id: ${l.id}`);
    for (const [field, value] of own)
      if (row[field as InventoryField] !== value)
        throw new Error(`listing field ${field}: ${l.id}`);
    if (
      row["Unit.livingArea"] !== unit?.livingArea ||
      row["Unit.bedroomsTotal"] !== unit?.bedroomsTotal
    )
      throw new Error(`row unit mismatch: ${l.id}`);
  });
  // A link to a unit the catalog does not have leaves area and bedrooms empty.
  const lost: ListingUnit[] = sample.listingUnits.map((x, i) =>
    i === 0 ? { ...x, upi: "urn:onehub:upi:mau:khong-co" } : x,
  );
  const first = build({ listings: sample.listings, listingUnits: lost, units })[0] as GridRow;
  if (first["Unit.livingArea"] !== null || first["Unit.bedroomsTotal"] !== null)
    throw new Error(`missing unit filled: ${sample.listings[0]?.id}`);
}

describe("inventory rows (E1)", () => {
  it("builds one row per listing with the area and bedrooms of the unit its link points at", () => {
    expect(() => checkRows(inventoryRows)).not.toThrow();
  });

  it("fails when units are joined by array position instead of the unit link", () => {
    const byIndex: BuildRows = (input) =>
      inventoryRows(input).map((row, i) => {
        const unit = input.units[i] as InventoryUnit;
        return {
          ...row,
          "Unit.livingArea": unit.livingArea,
          "Unit.bedroomsTotal": unit.bedroomsTotal,
        };
      });
    expect(() => checkRows(byIndex)).toThrow(/row unit mismatch: /);
  });

  it("fails when a missing unit borrows the first unit's numbers", () => {
    const borrow: BuildRows = (input) =>
      inventoryRows(input).map((row) =>
        row["Unit.livingArea"] === null
          ? {
              ...row,
              "Unit.livingArea": input.units[0]?.livingArea,
              "Unit.bedroomsTotal": input.units[0]?.bedroomsTotal,
            }
          : row,
      );
    expect(() => checkRows(borrow)).toThrow(/missing unit filled: /);
  });
});

// Written ahead: the approved header words (scope gate, Hỏi-2 and Hỏi-3), in column order.
const APPROVED_HEADERS = [
  "Căn",
  "Toà",
  "Dự án",
  "Trạng thái",
  "Giá chào",
  "Diện tích",
  "Phòng ngủ",
  "Xác nhận lúc",
];
const HEADER_LABELS: Record<InventoryField, string> = {
  "Listing.unitNumber": label("Unit"),
  "Listing.buildingName": label("Building"),
  "Listing.subdivisionName": label("Subdivision"),
  "Listing.standardStatus": label("StandardStatus"),
  "Listing.listPrice": label("ListPrice"),
  "Unit.livingArea": label("LivingArea"),
  "Unit.bedroomsTotal": label("BedroomsTotal"),
  "Listing.lastConfirmedAt": label("LastConfirmedAt"),
};

function renderGrid(rows: GridRow[]) {
  return render(
    <InventoryGrid
      title={label("Listing")}
      headers={HEADER_LABELS}
      rows={rows}
      state="ready"
      emptyWhy="x"
      reloadLabel="Tải lại"
    />,
  );
}

/** What the inventory grid shows: headers, the one continuous run, the footer count, typed cells. */
function checkGrid(container: HTMLElement, n: number): void {
  // Row 2e: the filter row sits in the header cells at all times; a header's name is the cell without its filter box.
  const headers = [...container.querySelectorAll("thead th")].map((th) => {
    const copy = th.cloneNode(true) as HTMLElement;
    copy.querySelectorAll('[data-slot="column-filter"]').forEach((el) => el.remove());
    return copy.textContent?.trim();
  });
  if (headers[0] !== "#") throw new Error("row-number column missing");
  const data = headers.slice(1);
  if (data.join("|") !== APPROVED_HEADERS.join("|")) throw new Error(`headers: ${data.join("|")}`);
  if (/Số dòng mỗi trang/.test(container.textContent ?? "")) throw new Error("pager present");
  const numbers = [...container.querySelectorAll('tbody [data-slot="row-number"]')].map((el) =>
    Number(el.textContent),
  );
  numbers.forEach((num, i) => {
    if (num !== i + 1) throw new Error(`run broken at row ${i + 1}`);
  });
  if (numbers.length !== n) throw new Error(`run broken at row ${numbers.length + 1}`);
  if (container.querySelector('[data-slot="region-footer-count"]')?.textContent !== `${n} dòng`)
    throw new Error("footer count missing");
  const cells = (kind: string) =>
    [...container.querySelectorAll(`[data-slot="typed-cell"][data-kind="${kind}"]`)].map(
      (el) => el.textContent ?? "",
    );
  if (!cells("money").some((t) => /^\d+(,\d+)? tỷ$/.test(t))) throw new Error("money cell");
  if (!cells("area").some((t) => t.endsWith("m²"))) throw new Error("area cell");
  if (!container.querySelector("[data-status]")) throw new Error("status badge");
  // Row numbers, unit and building stay put when the grid scrolls sideways: they are the pinned cells.
  const firstRow = [
    ...(container.querySelector("tbody tr:has([data-slot='row-number'])")?.children ?? []),
  ];
  const pinned = firstRow.map((td) => td.hasAttribute("data-pinned"));
  if (pinned.slice(0, 3).some((p) => !p) || pinned.slice(3).some(Boolean))
    throw new Error("frozen columns: row number, unit, building");
}

describe("inventory grid (E2)", () => {
  const rows = inventoryRows({
    listings: sample.listings,
    listingUnits: sample.listingUnits,
    units,
  });

  it("shows the row numbers and the eight approved columns, all 60 rows in one run, counted in the footer", () => {
    expect(INVENTORY_FIELDS.map((f) => HEADER_LABELS[f])).toEqual(APPROVED_HEADERS);
    expect(LABELS.ListPrice.pref).toBe("Giá chào");
    const { container } = renderGrid(rows);
    expect(() => checkGrid(container, 60)).not.toThrow();
  });

  it("fails when a row drops out of the run", () => {
    const { container } = renderGrid(rows);
    container.querySelectorAll("tbody tr")[30]?.remove();
    expect(() => checkGrid(container, 60)).toThrow(/run broken at row /);
  });

  it("fails when the first columns are no longer frozen", () => {
    const { container } = renderGrid(rows);
    container
      .querySelectorAll("tbody td[data-pinned]")
      .forEach((td) => td.removeAttribute("data-pinned"));
    expect(() => checkGrid(container, 60)).toThrow("frozen columns: row number, unit, building");
  });

  it("fails when a pager comes back", () => {
    const { container } = renderGrid(rows);
    const pager = document.createElement("div");
    pager.textContent = "Số dòng mỗi trang";
    container.append(pager);
    expect(() => checkGrid(container, 60)).toThrow("pager present");
  });
});

type StateFrom = typeof inventoryStateFrom;
// Written ahead: 6 parameters × 2 environments = 12 cells.
const STATE_MATRIX: [string | undefined, string, string][] = [
  ["loading", "production", "ready"],
  ["empty", "production", "ready"],
  ["error", "production", "ready"],
  ["partial", "production", "ready"],
  ["forbidden", "production", "ready"],
  ["la", "production", "ready"],
  ["loading", "development", "loading"],
  ["empty", "development", "empty"],
  ["error", "development", "error"],
  ["partial", "development", "partial"],
  ["forbidden", "development", "forbidden"],
  ["la", "development", "ready"],
];

function checkStates(from: StateFrom): void {
  for (const [param, env, want] of STATE_MATRIX) {
    const got = from(param, env);
    if (got !== want) {
      throw new Error(
        env === "production" ? `production honours state: ${param}` : `state ${param}: ${got}`,
      );
    }
  }
}

describe("region state from the URL (E6)", () => {
  it("honours ?state= only outside production", () => {
    expect(STATE_MATRIX.length).toBe(12);
    expect(() => checkStates(inventoryStateFrom)).not.toThrow();
  });

  it("fails when the reader ignores the environment", () => {
    const blind: StateFrom = (param) => inventoryStateFrom(param, "development");
    expect(() => checkStates(blind)).toThrow("production honours state: loading");
  });
});
