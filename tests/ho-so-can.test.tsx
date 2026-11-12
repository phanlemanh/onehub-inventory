// @vitest-environment jsdom
// One listing seen two ways (roadmap row 3, _acceptance/ho-so-can): the card and the record read one view (E1), the
// record walks the rows the grid shows and opens only where rows are shown (E5), and focus moves the way a keyboard
// user expects on a wide screen (E6). Every check has a break case on the same fixture with a pinned message.
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useState } from "react";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

import { typedColumn } from "../src/components/candidate/column-kind";
import {
  DataRegion,
  type GridRow,
  type RegionRecord,
  type RegionStatus,
} from "../src/components/candidate/data-region";
import { recordOpenSelector } from "../src/components/candidate/record-panel";
import { EMPTY, formatArea, formatMoney } from "../src/lib/format";
import { sampleUnits, subdivisionNameOf } from "../src/modules/catalog";
import { SAMPLE_COMPANY, buildSampleListings } from "../src/modules/listings";
import {
  INVENTORY_FIELDS,
  ListingCard,
  ListingRecordBody,
  inventoryRows,
  listingView,
  type InventoryField,
  type ListingView,
} from "../src/modules/listings/ui";
import { tallGridViewport } from "./virtual-viewport";

beforeAll(() => {
  tallGridViewport();
  Element.prototype.getAnimations ??= () => [];
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
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
  // A wide screen: the record floats beside the grid (the phone layout is measured in the browser suite).
  Object.defineProperty(window, "innerWidth", { configurable: true, value: 1440 });
});

afterEach(() => {
  cleanup();
  window.history.replaceState(null, "", "/");
});

// ---- fixtures -----------------------------------------------------------------------------------------------------

/** Column headers by field; the test does not need the label table, only distinct names. */
const HEADERS = Object.fromEntries(
  INVENTORY_FIELDS.map((field) => [field, `H ${field}`]),
) as Record<InventoryField, string>;

/** The inventory rows the page builds from the sample data (roadmap row 1). */
function sampleRows(): GridRow[] {
  const units = sampleUnits().map((u) => ({ ...u, subdivisionName: subdivisionNameOf(u) }));
  const { listings, listingUnits } = buildSampleListings({ companyId: SAMPLE_COMPANY.id, units });
  return inventoryRows({ listings, listingUnits, units });
}

/** A known row, and the same row with no price and no area. */
const KNOWN: GridRow = {
  id: "known",
  "Listing.unitNumber": "S1.01-0201",
  "Listing.buildingName": "S1.01",
  "Listing.subdivisionName": "Sapphire",
  "Listing.standardStatus": "Active",
  "Listing.listPrice": 4_850_000_000,
  "Unit.livingArea": 75.5,
  "Unit.bedroomsTotal": 2,
  "Listing.lastConfirmedAt": "2026-11-05T07:30:00Z",
};
const BARE: GridRow = { ...KNOWN, id: "bare", "Listing.listPrice": null, "Unit.livingArea": null };

const text = (value: unknown): string =>
  value === null || value === undefined ? "" : String(value);

// ---- checks shared by a case and its break ---------------------------------------------------------------------

/** The view says exactly what the row says, field by field, re-read from the row (no copied numbers). */
function assertViewOfRow(view: ListingView, row: GridRow): void {
  if (view.id !== row.id) throw new Error(`view of ${row.id}: id`);
  if (view.unitNumber !== text(row["Listing.unitNumber"]))
    throw new Error(`view of ${row.id}: unit`);
  const place = [row["Listing.buildingName"], row["Listing.subdivisionName"]]
    .map(text)
    .filter((part) => part !== "")
    .join(" · ");
  if (view.place !== place) throw new Error(`view of ${row.id}: place`);
  if (view.status !== row["Listing.standardStatus"]) throw new Error(`view of ${row.id}: status`);
  if (view.price !== row["Listing.listPrice"]) throw new Error(`view of ${row.id}: price`);
  const fields = view.fields.map(({ column }) => column.field);
  if (fields.join() !== INVENTORY_FIELDS.join()) throw new Error(`view of ${row.id}: field order`);
  for (const { column, value } of view.fields) {
    if (value !== row[column.field]) throw new Error(`view of ${row.id}: ${column.field}`);
  }
}

const slotText = (root: ParentNode, slot: string): string =>
  root.querySelector(`[data-slot="${slot}"]`)?.textContent?.trim() ?? "";

const fieldText = (root: ParentNode, field: string): string =>
  root
    .querySelector(`[data-slot="listing-record-fields"] [data-field="${field}"] dd`)
    ?.textContent?.trim() ?? "";

/** The card at the head of the record and the record's own fields show the same price, unit and status. */
function assertCardAndRecordAgree(root: ParentNode): void {
  const card = root.querySelector('[data-slot="listing-card"]');
  if (!card) throw new Error("record has no card");
  if (slotText(card, "listing-card-price") !== fieldText(root, "Listing.listPrice")) {
    throw new Error("card and record disagree: price");
  }
  if (slotText(card, "listing-card-unit") !== fieldText(root, "Listing.unitNumber")) {
    throw new Error("card and record disagree: unit");
  }
  const cardStatus = card.querySelector("[data-status]")?.getAttribute("data-status") ?? null;
  const recordStatus =
    root
      .querySelector('[data-field="Listing.standardStatus"] dd [data-status]')
      ?.getAttribute("data-status") ?? null;
  if (cardStatus !== recordStatus) throw new Error("card and record disagree: status");
}

const CARD_FACT_ORDER = ["Unit.livingArea", "Unit.bedroomsTotal", "Listing.lastConfirmedAt"];

/** The card's facts row: exactly area, bedrooms, confirmed at — in that order. */
function assertCardFacts(root: ParentNode): void {
  const facts = [...root.querySelectorAll('[data-slot="listing-card-facts"] > [data-field]')].map(
    (el) => el.getAttribute("data-field"),
  );
  if (facts.length !== 3) throw new Error(`card facts: expected 3, got ${facts.length}`);
  if (facts.join() !== CARD_FACT_ORDER.join()) throw new Error(`card facts order: ${facts.join()}`);
}

function renderRecord(view: ListingView) {
  return render(<ListingRecordBody view={view} priceLabel={HEADERS["Listing.listPrice"]} />);
}

// ---- E1 · AC-1: one view, two shapes --------------------------------------------------------------------------------

describe("E1 · the card and the record read one view of the row", () => {
  it("builds the view of every sample row from the row itself", () => {
    const rows = sampleRows();
    expect(rows.length).toBe(60);
    for (const row of rows) assertViewOfRow(listingView(row, HEADERS), row);
  });

  it("shows price, area, status and the three facts the way a grid cell does", () => {
    const { container } = renderRecord(listingView(KNOWN, HEADERS));
    const card = container.querySelector('[data-slot="listing-card"]')!;
    expect(slotText(card, "listing-card-price")).toBe(formatMoney(4_850_000_000));
    expect(slotText(card, "listing-card-unit")).toBe("S1.01-0201");
    expect(slotText(card, "listing-card-place")).toBe("S1.01 · Sapphire");
    expect(card.querySelector("[data-status]")?.getAttribute("data-status")).toBe("Active");
    expect(card.querySelector('[data-field="Unit.livingArea"] dd')?.textContent).toBe(
      formatArea(75.5),
    );
    expect(formatArea(75.5)).toContain("m²");
    assertCardFacts(container);
    assertCardAndRecordAgree(container);
    expect(
      container.querySelectorAll('[data-slot="listing-record-fields"] > [data-field]'),
    ).toHaveLength(8);
  });

  it("shows «—» for a missing price and area, on the card and in the record", () => {
    const { container } = renderRecord(listingView(BARE, HEADERS));
    const card = container.querySelector('[data-slot="listing-card"]')!;
    expect(slotText(card, "listing-card-price")).toBe(EMPTY);
    expect(card.querySelector('[data-field="Unit.livingArea"] dd')?.textContent).toBe(EMPTY);
    expect(fieldText(container, "Listing.listPrice")).toBe(EMPTY);
    expect(fieldText(container, "Unit.livingArea")).toBe(EMPTY);
    assertCardAndRecordAgree(container);
  });

  it("break: a view that takes its price from another row splits the card from the record", () => {
    const other = { ...KNOWN, id: "other", "Listing.listPrice": 3_100_000_000 };
    const broken: ListingView = {
      ...listingView(KNOWN, HEADERS),
      price: other["Listing.listPrice"],
    };
    const { container } = renderRecord(broken);
    expect(() => assertCardAndRecordAgree(container)).toThrow("card and record disagree: price");
  });

  it("break: a card that drops its third fact fails the facts check", () => {
    const view = listingView(KNOWN, HEADERS);
    const { container } = render(
      <ListingCard view={{ ...view, facts: view.facts.slice(0, 2) }} priceLabel="Giá" />,
    );
    expect(() => assertCardFacts(container)).toThrow("card facts: expected 3");
  });

  it("break: a view that drops a field fails the row check", () => {
    const row = sampleRows()[0]!;
    const view = listingView(row, HEADERS);
    expect(() => assertViewOfRow({ ...view, fields: view.fields.slice(1) }, row)).toThrow(
      `view of ${row.id}: field order`,
    );
  });
});

// ---- E5 · AC-5: walk the rows shown, open only where rows are shown ------------------------------------------------

const COLUMNS = [
  typedColumn({ field: "Listing.unitNumber", header: "Căn" }),
  typedColumn({ field: "Listing.buildingName", header: "Toà" }),
];
const ROWS: GridRow[] = (
  [
    ["a", "S1.01-0201", "S1.01"],
    ["b", "S2.01-0202", "S2.01"],
    ["c", "S1.02-0203", "S1.02"],
    ["d", "S3.01-0204", "S3.01"],
    ["e", "S1.03-0205", "S1.03"],
  ] as const
).map(([id, unit, building]) => ({
  id,
  "Listing.unitNumber": unit,
  "Listing.buildingName": building,
}));

/** A screen holding the record address, so the test opens a record as an address would. */
function Region({
  initial = null,
  status = "ready",
  rows = ROWS,
}: {
  initial?: string | null;
  status?: RegionStatus;
  rows?: GridRow[];
}) {
  const [openId, setOpenId] = useState<string | null>(initial);
  const record: RegionRecord = {
    render: (row) => ({ title: String(row["Listing.unitNumber"]), body: <p>{row.id}</p> }),
    address: { openId, navigate: setOpenId },
  };
  return <DataRegion title="Vùng" columns={COLUMNS} rows={rows} status={status} record={record} />;
}

const panel = () => document.querySelector<HTMLElement>('[data-slot="record-panel"]');
const button = (name: string) => screen.getByRole("button", { name }) as HTMLButtonElement;
const shownIds = () =>
  [...document.querySelectorAll("[data-record-open]")].map((el) =>
    el.getAttribute("data-record-open"),
  ) as string[];

/** «Sau» from `from` lands on the row shown right after it, never on a row the search hid. */
function assertWalk(shown: readonly string[], from: string, landed: string | null): void {
  const expected = shown[shown.indexOf(from) + 1] ?? null;
  if (landed !== expected)
    throw new Error(`walk ignores search: landed ${landed}, expected ${expected}`);
}

/** No record shows while the region shows no rows, whatever the address says. */
function assertNoRecordWithoutRows(status: RegionStatus): void {
  if (panel() !== null) throw new Error(`record opened in a region without rows: ${status}`);
}

describe("E5 · «Trước» and «Sau» walk the rows the grid shows", () => {
  it("disables «Trước» on the first row and «Sau» on the last", async () => {
    render(<Region initial="a" />);
    await waitFor(() => expect(panel()?.getAttribute("data-record-id")).toBe("a"));
    expect(button("Trước").disabled).toBe(true);
    fireEvent.click(button("Sau"));
    await waitFor(() => expect(panel()?.getAttribute("data-record-id")).toBe("b"));
    cleanup();
    render(<Region initial="e" />);
    await waitFor(() => expect(panel()?.getAttribute("data-record-id")).toBe("e"));
    expect(button("Sau").disabled).toBe(true);
    expect(button("Trước").disabled).toBe(false);
  });

  it("follows the search and skips the rows it hides", async () => {
    render(<Region initial="a" />);
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "S1." } });
    const shown = shownIds();
    expect(shown).toEqual(["a", "c", "e"]);
    fireEvent.click(button("Sau"));
    await waitFor(() => expect(panel()?.getAttribute("data-record-id")).toBe("c"));
    assertWalk(shown, "a", panel()!.getAttribute("data-record-id"));
  });

  it("keeps the open row when the search hides it, with both steps off", async () => {
    render(<Region initial="b" />);
    await waitFor(() => expect(panel()?.getAttribute("data-record-id")).toBe("b"));
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "S1." } });
    expect(shownIds()).not.toContain("b");
    expect(panel()?.getAttribute("data-record-id")).toBe("b");
    expect(button("Trước").disabled).toBe(true);
    expect(button("Sau").disabled).toBe(true);
  });

  it("opens nothing from a real id while the region is loading, failed, empty or forbidden", () => {
    const cases: [RegionStatus, GridRow[]][] = [
      ["loading", ROWS],
      ["error", ROWS],
      ["partial", []],
      ["forbidden", ROWS],
    ];
    for (const [status, rows] of cases) {
      render(<Region initial="c" status={status} rows={rows} />);
      assertNoRecordWithoutRows(status);
      cleanup();
    }
    // The same address in a region with rows opens the record (positive control).
    render(<Region initial="c" />);
    expect(panel()?.getAttribute("data-record-id")).toBe("c");
  });

  it("break: walking every row instead of the shown ones fails the walk check", () => {
    expect(() => assertWalk(["a", "c", "e"], "a", "b")).toThrow("walk ignores search");
  });

  it("break: a record shown in a region without rows fails the state check", () => {
    render(<Region initial="c" />);
    expect(() => assertNoRecordWithoutRows("loading")).toThrow(
      "record opened in a region without rows: loading",
    );
  });
});

// ---- E6 · AC-6: focus on a wide screen ----------------------------------------------------------------------------

/** Focus is on the opener of the row last shown. */
function assertFocusOn(id: string): void {
  const opener = document.querySelector(recordOpenSelector(id));
  if (!opener || document.activeElement !== opener) throw new Error("focus went to the wrong row");
}

describe("E6 · focus enters the record and goes back to its row", () => {
  it("lands on the title, stays on «Sau», and returns to the row on Escape", async () => {
    render(<Region />);
    const opener = document.querySelector<HTMLElement>(recordOpenSelector("b"))!;
    opener.focus();
    fireEvent.click(opener);
    await waitFor(() => expect(panel()).not.toBeNull());
    const dialog = screen.getByRole("dialog");
    expect(dialog.getAttribute("aria-modal")).toBe("false");
    await waitFor(() => expect(document.activeElement?.tagName).toBe("H2"));
    expect(document.activeElement?.id).toBe(dialog.getAttribute("aria-labelledby"));
    button("Sau").focus();
    fireEvent.click(button("Sau"));
    await waitFor(() => expect(panel()?.getAttribute("data-record-id")).toBe("c"));
    expect(document.activeElement).toBe(button("Sau"));
    // Another row's opener still works while the record is open (the record is not modal).
    fireEvent.click(document.querySelector<HTMLElement>(recordOpenSelector("d"))!);
    await waitFor(() => expect(panel()?.getAttribute("data-record-id")).toBe("d"));
    fireEvent.keyDown(document.activeElement!, { key: "Escape" });
    await waitFor(() => expect(panel()).toBeNull());
    await waitFor(() => assertFocusOn("d"));
  });

  it("returns focus to the row on «Đóng» too", async () => {
    render(<Region />);
    fireEvent.click(document.querySelector<HTMLElement>(recordOpenSelector("e"))!);
    await waitFor(() => expect(panel()).not.toBeNull());
    fireEvent.click(button("Đóng"));
    await waitFor(() => expect(panel()).toBeNull());
    await waitFor(() => assertFocusOn("e"));
  });

  it("break: focus left on the first row fails the focus check", async () => {
    render(<Region />);
    document.querySelector<HTMLElement>(recordOpenSelector("a"))!.focus();
    expect(() => assertFocusOn("e")).toThrow("focus went to the wrong row");
  });
});
