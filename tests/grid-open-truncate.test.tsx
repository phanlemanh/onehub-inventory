// @vitest-environment jsdom
// The shared grid's open cell is cut like every other text cell (roadmap row 6, _acceptance/da-gui-tren-luoi, AC-9,
// E12): the wrapper may not grow past its cell and the open button fills it, the text sits in the cut element whose title is
// the full value, and the row-3 rule of the open door stays (data-record-open, tabIndex -1). jsdom has no layout, so
// the width limits are read from the classes; the browser measures the real cut in open-cell-truncate.spec.ts.
import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

import { typedColumn } from "../src/components/candidate/column-kind";
import {
  DataRegion,
  type GridRow,
  type RegionRecord,
} from "../src/components/candidate/data-region";
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
});
afterEach(cleanup);

const LONG = `[Tên] ${"Khách có tên rất dài ".repeat(6)}`.slice(0, 120);
const ROWS: GridRow[] = [
  { id: "long", "Contact.fullName": LONG, "Contact.phones": "0900000001" },
  { id: "short", "Contact.fullName": "[Tên] 02", "Contact.phones": "0900000002" },
];
const COLUMNS = [
  typedColumn({ field: "Contact.fullName", header: "Họ tên" }),
  typedColumn({ field: "Contact.phones", header: "Số điện thoại" }),
];
const RECORD: RegionRecord = {
  render: (row) => ({ title: String(row["Contact.fullName"]), body: <p>{row.id}</p> }),
  address: { openId: null, navigate: () => {} },
};

/** Every open cell may shrink to its cell and carries its text in the cut element. */
function checkOpenCells(root: ParentNode): void {
  const openers = [...root.querySelectorAll<HTMLElement>("[data-record-open]")];
  if (openers.length === 0) throw new Error("no open cell");
  for (const opener of openers) {
    const id = opener.getAttribute("data-record-open");
    // The wrapper keeps to the cell; the button fills the wrapper (its contract allows only w-full).
    const wrap = opener.parentElement!.classList;
    if (
      !wrap.contains("max-w-full") ||
      !wrap.contains("min-w-0") ||
      !opener.classList.contains("w-full")
    )
      throw new Error(`open cell not truncated: ${id}`);
    const text = opener.querySelector('[data-slot="truncated-text"]');
    if (!text || text.getAttribute("title") !== text.textContent)
      throw new Error(`open cell not truncated: ${id}`);
    if (opener.tabIndex !== -1) throw new Error(`open cell takes a tab stop: ${id}`);
  }
}

describe("the open cell is cut like the other text cells (E12)", () => {
  it("wraps the open button so it fits its cell, with the full value as the title", () => {
    const { container } = render(
      <DataRegion title="Vùng" columns={COLUMNS} rows={ROWS} record={RECORD} />,
    );
    expect(() => checkOpenCells(container)).not.toThrow();
    const long = container.querySelector('[data-record-open="long"] [data-slot="truncated-text"]');
    expect(long?.getAttribute("title")).toBe(LONG);
  });

  it("break: the old wrapper (inline-flex, no width limit) is caught", () => {
    const { container } = render(
      <DataRegion title="Vùng" columns={COLUMNS} rows={ROWS} record={RECORD} />,
    );
    const opener = container.querySelector<HTMLElement>('[data-record-open="long"]')!;
    opener.parentElement!.className = "-my-1 inline-flex";
    expect(() => checkOpenCells(container)).toThrow("open cell not truncated: long");
  });
});
