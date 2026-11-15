// @vitest-environment jsdom
// Row 19 (thue-phi) × AC-6, Ngoài-20 of round 6: the fee inclusion column measured on the drawn grid, not in the source.
// It is not drawn at first, it is in the Cột menu unticked, and ticking it draws its header. The break renders the same
// columns without the hidden-at-first list, as a grid that forgot it would.
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { feeHeaders } from "@/app/(app)/inventory-fees";
import { DataRegion, type GridRow } from "@/components/candidate/data-region";
import { label } from "@/modules/company-config";
import {
  FEE_INCLUSION_FIELD,
  INVENTORY_FIELDS,
  InventoryGrid,
  inventoryColumns,
} from "@/modules/listings/ui";

import { tallGridViewport } from "./virtual-viewport";

vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: () => {} }) }));
vi.setConfig({ testTimeout: 20_000 });

beforeAll(() => {
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

const HEADERS = Object.fromEntries(INVENTORY_FIELDS.map((f) => [f, f])) as Record<
  (typeof INVENTORY_FIELDS)[number],
  string
>;
const ROWS: GridRow[] = [
  {
    id: "l-1",
    "Listing.unitNumber": "0602",
    "Listing.standardStatus": "Active",
    "Listing.listPrice": 3_000_000_000,
    [FEE_INCLUSION_FIELD]: label("FeeIncluded"),
  },
];

const head = (c: HTMLElement) => c.querySelector(`th[data-col-id="${FEE_INCLUSION_FIELD}"]`);

/** What a person sees of the fee inclusion column, before and after ticking it in the Cột menu; empty when right. */
async function feeColumnProblems(c: HTMLElement): Promise<string[]> {
  if (head(c)) return ["fee inclusion shown at first"];
  const trigger = screen.getByRole("button", { name: "Cột" });
  act(() => {
    fireEvent.pointerDown(trigger, { button: 0, pointerType: "mouse" });
    fireEvent.mouseDown(trigger, { button: 0 });
    fireEvent.click(trigger);
  });
  const item = (await screen.findAllByRole("menuitemcheckbox")).find(
    (el) => el.textContent?.trim() === label("FeeInclusion"),
  );
  if (!item) return ["fee inclusion not in the Cột menu"];
  if (item.getAttribute("aria-checked") === "true") return ["fee inclusion ticked at first"];
  fireEvent.click(item);
  const th = head(c);
  if (!th) return ["fee inclusion not drawn after ticking it"];
  if (!th.textContent?.includes(label("FeeInclusion"))) return [`header reads «${th.textContent}»`];
  return [];
}

describe("dieu-kien-phi-an-roi-bat (AC-6)", () => {
  it("the inventory grid with fees: hidden at first, ticked on from the Cột menu", async () => {
    const { container } = render(
      <InventoryGrid
        title="Bảng hàng"
        headers={HEADERS}
        feeHeaders={feeHeaders()}
        rows={ROWS}
        state="ready"
        emptyWhy="x"
        reloadLabel="Tải lại"
      />,
    );
    expect(await feeColumnProblems(container)).toEqual([]);
  });

  it("break: the same columns without the hidden-at-first list show the column at once", async () => {
    const { container } = render(
      <DataRegion
        title="Bảng hàng"
        columns={inventoryColumns(HEADERS, [], feeHeaders())}
        rows={ROWS}
        status="ready"
        emptyWhy="x"
      />,
    );
    expect(await feeColumnProblems(container)).toEqual(["fee inclusion shown at first"]);
  });
});
