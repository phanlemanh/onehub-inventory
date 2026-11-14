// Row 19 (thue-phi), E6 written before the code: the inventory's Về tay column right after the list price, the fee
// inclusion column hidden at first, and Về tay worked out under each company's schedule.
import { describe, expect, it } from "vitest";

import { feeHeaders, withFees } from "@/app/(app)/inventory-fees";
import { alignFor } from "@/components/candidate/column-kind";
import { sortRows } from "@/components/candidate/grid-view";
import { formatMoney } from "@/lib/format";
import { defaultFeeSchedule, label, type FeeItemValue } from "@/modules/company-config";
import {
  FEE_INCLUSION_FIELD,
  INVENTORY_FIELDS,
  NET_TO_SELLER_FIELD,
  inventoryColumns,
} from "@/modules/listings/ui";

const HEADERS = Object.fromEntries(INVENTORY_FIELDS.map((f) => [f, f])) as Record<
  (typeof INVENTORY_FIELDS)[number],
  string
>;

describe("cot-ve-tay-sau-gia-chao", () => {
  it("Về tay stands right after Giá chào, as money", () => {
    const cols = inventoryColumns(HEADERS, [], feeHeaders());
    const at = cols.findIndex((c) => c.field === "Listing.listPrice");
    expect(cols[at + 1]?.field).toBe(NET_TO_SELLER_FIELD);
    expect(cols[at + 1]?.header).toBe(label("NetToSeller"));
    expect(cols[at + 1]?.kind).toBe("money");
    expect(cols[at + 1]?.align).toBe(alignFor("money"));
  });
  it("without fee headers the grid keeps its eight columns", () => {
    expect(inventoryColumns(HEADERS).map((c) => c.field)).toEqual([...INVENTORY_FIELDS]);
  });
});

describe("dieu-kien-phi-an-san", () => {
  it("the fee inclusion column is in the grid, after the standard ones, and starts hidden", async () => {
    const cols = inventoryColumns(
      HEADERS,
      [{ code: "ghi_chu", header: "Ghi chú", kind: "text" }],
      feeHeaders(),
    );
    const fields = cols.map((c) => c.field);
    expect(fields.indexOf(FEE_INCLUSION_FIELD)).toBe(fields.indexOf("Listing.lastConfirmedAt") + 1);
    expect(fields.at(-1)).toBe("custom.ghi_chu");
    const grid = await import("@/modules/listings/ui/inventory-grid");
    expect(String(grid.InventoryGrid)).toContain("hiddenAtFirst");
  });
});

// Four rows × two schedules, written by hand: firm A (brokerage 2%, registration fee off) before and after brokerage
// goes back to 1%.
const ROWS = [
  { id: "bao-phi", listPrice: 3_000_000_000, feeInclusion: "Included" as const },
  { id: "khong-bao-phi", listPrice: 3_000_000_000, feeInclusion: "Excluded" as const },
  { id: "thieu-gia", feeInclusion: "Included" as const },
  { id: "thieu-dieu-kien", listPrice: 3_000_000_000 },
];
const firmA = (brokerage: number): FeeItemValue[] => [
  { code: "pit", kind: "Law", rateBasisPoints: 200, included: true },
  { code: "registration", kind: "Law", rateBasisPoints: 50, included: false },
  { code: "brokerage", kind: "Own", rateBasisPoints: brokerage, included: true },
];
const shown = (items: FeeItemValue[] | null) =>
  withFees(
    ROWS.map((r) => ({ id: r.id })),
    ROWS,
    items,
  ).map((r) => formatMoney(r[NET_TO_SELLER_FIELD] as number | null));

describe("ve-tay-theo-muc", () => {
  it("firm A at 2% then 1%, and firm B on the defaults", () => {
    expect(shown(firmA(200)), "ve-tay-theo-muc: 2,88 tỷ").toEqual([
      "2,88 tỷ",
      "3 tỷ",
      formatMoney(null),
      formatMoney(null),
    ]);
    expect(shown(firmA(100)), "ve-tay-theo-muc: 2,91 tỷ").toEqual([
      "2,91 tỷ",
      "3 tỷ",
      formatMoney(null),
      formatMoney(null),
    ]);
    // Firm B on the defaults: the exact amount; the grid cell rounds it like every money cell.
    const b = withFees([{ id: "bao-phi" }], ROWS, defaultFeeSchedule());
    expect(b[0]![NET_TO_SELLER_FIELD]).toBe(2_895_000_000);
  });
  it("without a readable schedule Về tay stays empty, and the fee inclusion shows by its label", () => {
    expect(shown(null)).toEqual(ROWS.map(() => formatMoney(null)));
    const rows = withFees(
      ROWS.map((r) => ({ id: r.id })),
      ROWS,
      null,
    );
    expect(rows.map((r) => r[FEE_INCLUSION_FIELD])).toEqual([
      label("FeeIncluded"),
      label("FeeExcluded"),
      label("FeeIncluded"),
      null,
    ]);
  });
});

describe("sap-nhu-tien", () => {
  it("Về tay sorts as money, empty last", () => {
    const rows = withFees(
      ROWS.map((r) => ({ id: r.id })),
      ROWS,
      firmA(200),
    );
    const cols = inventoryColumns(HEADERS, [], feeHeaders());
    const sorted = sortRows(rows, cols, { field: NET_TO_SELLER_FIELD, direction: "asc" }).map(
      (r) => r[NET_TO_SELLER_FIELD],
    );
    expect(sorted.slice(0, 2)).toEqual([2_880_000_000, 3_000_000_000]);
    expect(sorted.slice(2)).toEqual([null, null]);
  });
});
