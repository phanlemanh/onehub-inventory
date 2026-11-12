// Pure rules of the shared grid used by hand like a sheet (roadmap row 2a, _acceptance/bang-hang-dung-tay-nhu-sheet):
// copied text, sort, per-column filters, groups and row numbers on the 60 sample rows. E3, E4, E5, E7 of the contract.
import { describe, expect, it } from "vitest";

import {
  typedColumn,
  type FieldKey,
  type TypedColumn,
} from "../src/components/candidate/column-kind";
import {
  MONEY_FILTER_UNIT,
  STATUS_ORDER,
  cellText,
  daysSince,
  filterIsInvalid,
  filterRows,
  foldText,
  groupRows,
  rowNumbers,
  sortRows,
  type ColumnFilters,
  type SortBy,
  type ViewRow,
} from "../src/components/candidate/grid-view";
import { label } from "../src/modules/company-config";
import { sampleUnits, subdivisionNameOf } from "../src/modules/catalog";
import { SAMPLE_COMPANY, buildSampleListings } from "../src/modules/listings";
import { INVENTORY_FIELDS, inventoryRows } from "../src/modules/listings/ui";
import { formatMoney } from "../src/lib/format";

const units = sampleUnits().map((u) => ({ ...u, subdivisionName: subdivisionNameOf(u) }));
const sample = buildSampleListings({ companyId: SAMPLE_COMPANY.id, units });
const rows = inventoryRows({
  listings: sample.listings,
  listingUnits: sample.listingUnits,
  units,
}) as ViewRow[];
const columns: TypedColumn[] = INVENTORY_FIELDS.map((field) =>
  typedColumn({ field, header: field }),
);
const col = (field: FieldKey) => columns.find((c) => c.field === field) as TypedColumn;
const raw = (row: ViewRow, field: FieldKey) => row[field];
const ids = (list: readonly ViewRow[]) => list.map((r) => r.id).sort();

describe("cellText", () => {
  const MATRIX: [string, () => void][] = [
    ["money", () => expect(cellText("money", 4_650_000_000)).toBe(formatMoney(4_650_000_000))],
    ["area", () => expect(cellText("area", 68.5)).toContain("m²")],
    ["count", () => expect(cellText("count", 3)).toBe("3")],
    ["status", () => expect(cellText("status", "Active")).toBe(label("StatusActive"))],
    [
      "status lease",
      () =>
        expect(cellText("status", "Active", "lease")).toBe(
          label("StatusActive", { transaction: "lease" }),
        ),
    ],
    ["text", () => expect(cellText("text", "S1.01")).toBe("S1.01")],
    ["empty", () => expect(cellText("datetime", null)).toBe("")],
  ];
  it("shows each kind as the cell does (7 cases written in advance)", () => {
    expect(MATRIX).toHaveLength(7);
    for (const [, check] of MATRIX) check();
    expect(formatMoney(4_650_000_000)).toMatch(/tỷ/);
  });

  function checkMoney(text: (v: number) => string): void {
    if (text(4_650_000_000) !== formatMoney(4_650_000_000))
      throw new Error("cellText money: raw number");
  }
  it("the money check fails on the raw number", () => {
    expect(() => checkMoney((v) => cellText("money", v))).not.toThrow();
    expect(() => checkMoney((v) => String(v))).toThrow("cellText money: raw number");
  });
});

/** Compares two cell values the way the rule promises, written here independently of sortRows. */
function compareExpected(field: FieldKey, a: unknown, b: unknown): number {
  const kind = col(field).kind;
  if (kind === "status") return STATUS_ORDER.indexOf(a as never) - STATUS_ORDER.indexOf(b as never);
  if (kind === "datetime") return new Date(a as string).getTime() - new Date(b as string).getTime();
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a).localeCompare(String(b), "vi", { numeric: true, sensitivity: "base" });
}

/** Every pair of neighbours is in order, empty cells last both ways. */
function checkSorted(sorted: readonly ViewRow[], sort: SortBy): void {
  const empty = (v: unknown) => v === null || v === undefined || v === "";
  for (let i = 1; i < sorted.length; i += 1) {
    const a = raw(sorted[i - 1] as ViewRow, sort.field);
    const b = raw(sorted[i] as ViewRow, sort.field);
    if (empty(a) && !empty(b)) throw new Error(`empty cell not last: ${sort.direction}`);
    if (empty(a) || empty(b)) continue;
    const order = compareExpected(sort.field, a, b) * (sort.direction === "asc" ? 1 : -1);
    if (order > 0) {
      if (col(sort.field).kind === "status") throw new Error("status sorted by label");
      throw new Error(`out of order: ${sort.field} ${sort.direction} at ${i}`);
    }
  }
}

describe("sortRows", () => {
  const FIELDS: FieldKey[] = [
    "Listing.buildingName",
    "Listing.listPrice",
    "Unit.livingArea",
    "Unit.bedroomsTotal",
    "Listing.standardStatus",
    "Listing.lastConfirmedAt",
  ];
  const CELLS: SortBy[] = FIELDS.flatMap((field) =>
    (["asc", "desc"] as const).map((direction) => ({ field, direction })),
  );
  // One row without a price, so the empty-last rule is measured on the real rows.
  const withEmpty = rows.map((r, i) => (i === 7 ? { ...r, "Listing.listPrice": null } : r));

  it("orders the 60 sample rows for each kind both ways (12 cells written in advance)", () => {
    expect(CELLS).toHaveLength(12);
    for (const sort of CELLS) {
      const sorted = sortRows(withEmpty, columns, sort);
      expect(sorted).toHaveLength(60);
      checkSorted(sorted, sort);
    }
    const priceDesc = sortRows(withEmpty, columns, {
      field: "Listing.listPrice",
      direction: "desc",
    });
    expect(priceDesc.at(-1)?.["Listing.listPrice"]).toBeNull();
  });

  it("reads numbers in text as numbers and keeps the first order when unsorted", () => {
    const towers = ["Toà 10", "Toà 2"].map((name, i) => ({
      id: `t${i}`,
      "Listing.buildingName": name,
    }));
    expect(
      sortRows(towers, columns, { field: "Listing.buildingName", direction: "asc" }).map(
        (r) => r["Listing.buildingName"],
      ),
    ).toEqual(["Toà 2", "Toà 10"]);
    expect(ids(sortRows(rows, columns, null))).toEqual(ids(rows));
    expect(sortRows(rows, columns, null).map((r) => r.id)).toEqual(rows.map((r) => r.id));
  });

  it("the sort check fails on statuses by label and on empty cells first", () => {
    const byLabel = [...rows].sort((a, b) =>
      cellText("status", a["Listing.standardStatus"]).localeCompare(
        cellText("status", b["Listing.standardStatus"]),
        "vi",
      ),
    );
    expect(() =>
      checkSorted(byLabel, { field: "Listing.standardStatus", direction: "asc" }),
    ).toThrow("status sorted by label");
    const emptyFirst = [
      withEmpty[7] as ViewRow,
      ...sortRows(
        withEmpty.filter((_, i) => i !== 7),
        columns,
        { field: "Listing.listPrice", direction: "desc" },
      ),
    ];
    expect(() =>
      checkSorted(emptyFirst, { field: "Listing.listPrice", direction: "desc" }),
    ).toThrow("empty cell not last: desc");
  });
});

describe("filterRows on the 60 sample rows", () => {
  const NOW = Date.UTC(2026, 10, 12, 3);
  const days = (r: ViewRow) => daysSince(r["Listing.lastConfirmedAt"], NOW) as number;
  const num = (r: ViewRow, f: FieldKey) => r[f] as number;
  type Cell = [string, ColumnFilters, (r: ViewRow) => boolean];
  const CELLS: Cell[] = [
    [
      "Toà toa e",
      { "Listing.buildingName": "toa e" },
      (r) => String(r["Listing.buildingName"]).includes("Toà E"),
    ],
    [
      "Trạng thái Active, Pending",
      { "Listing.standardStatus": ["Active", "Pending"] },
      (r) => ["Active", "Pending"].includes(String(r["Listing.standardStatus"])),
    ],
    [
      "Giá <=5",
      { "Listing.listPrice": "<=5" },
      (r) => num(r, "Listing.listPrice") <= 5_000_000_000,
    ],
    [
      "Diện tích 60-80",
      { "Unit.livingArea": "60-80" },
      (r) => num(r, "Unit.livingArea") >= 60 && num(r, "Unit.livingArea") <= 80,
    ],
    ["Phòng ngủ >=3", { "Unit.bedroomsTotal": ">=3" }, (r) => num(r, "Unit.bedroomsTotal") >= 3],
    ["Xác nhận >5 ngày", { "Listing.lastConfirmedAt": ">5" }, (r) => days(r) > 5],
    [
      "Phòng ngủ 1 hoặc 3",
      { "Unit.bedroomsTotal": "1 hoặc 3" },
      (r) => [1, 3].includes(num(r, "Unit.bedroomsTotal")),
    ],
    [
      "Diện tích >60 và <90",
      { "Unit.livingArea": ">60 và <90" },
      (r) => num(r, "Unit.livingArea") > 60 && num(r, "Unit.livingArea") < 90,
    ],
    ["Giá 5 tỷ (luật sai)", { "Listing.listPrice": "5 tỷ" }, () => true],
  ];

  it("keeps exactly the rows each filter asks for (9 cells written in advance)", () => {
    expect(CELLS).toHaveLength(9);
    CELLS.forEach(([name, filters, keep], index) => {
      const expected = ids(rows.filter(keep));
      if (index < 8) {
        expect(expected.length, name).toBeGreaterThan(0);
        expect(expected.length, name).toBeLessThan(60);
      } else expect(expected.length, name).toBe(60);
      expect(ids(filterRows(rows, columns, filters, "", NOW)), name).toEqual(expected);
    });
    expect(filterIsInvalid(col("Listing.listPrice"), "5 tỷ")).toBe(true);
    expect(filterIsInvalid(col("Listing.listPrice"), "<=5")).toBe(false);
  });

  it("stacks filters and ignores a rule still being typed", () => {
    const both = filterRows(
      rows,
      columns,
      { "Listing.standardStatus": ["Active"], "Listing.listPrice": "<=5" },
      "",
      NOW,
    );
    expect(ids(both)).toEqual(
      ids(
        rows.filter(
          (r) =>
            r["Listing.standardStatus"] === "Active" &&
            num(r, "Listing.listPrice") <= 5 * MONEY_FILTER_UNIT,
        ),
      ),
    );
    for (const partial of [">", "2-", "<="])
      expect(filterRows(rows, columns, { "Unit.livingArea": partial }, "", NOW)).toHaveLength(60);
  });

  /** The three promises a broken filter would break, each measured on the real rows. */
  function checkFilter(run: (filters: ColumnFilters) => readonly ViewRow[]): void {
    if (run({ "Listing.buildingName": "toa e" }).length === 0)
      throw new Error("text filter not accent-folded");
    const cheap = ids(rows.filter((r) => num(r, "Listing.listPrice") <= 5 * MONEY_FILTER_UNIT));
    if (JSON.stringify(ids(run({ "Listing.listPrice": "<=5" }))) !== JSON.stringify(cheap))
      throw new Error("money rule not in billions");
    const stacked = run({ "Listing.standardStatus": ["Active"], "Unit.bedroomsTotal": ">=3" });
    if (
      stacked.some(
        (r) => r["Listing.standardStatus"] !== "Active" || num(r, "Unit.bedroomsTotal") < 3,
      )
    )
      throw new Error("filters do not stack");
  }
  it("the filter check fails on marks kept, money in dong and filters joined by or", () => {
    expect(() => checkFilter((f) => filterRows(rows, columns, f, "", NOW))).not.toThrow();
    const noFold = (f: ColumnFilters) =>
      rows.filter((r) =>
        String(r["Listing.buildingName"])
          .toLowerCase()
          .includes(String(f["Listing.buildingName"] ?? "")),
      );
    expect(() =>
      checkFilter((f) =>
        "Listing.buildingName" in f ? noFold(f) : filterRows(rows, columns, f, "", NOW),
      ),
    ).toThrow("text filter not accent-folded");
    const inDong = (f: ColumnFilters) =>
      "Listing.listPrice" in f
        ? rows.filter((r) => num(r, "Listing.listPrice") <= 5)
        : filterRows(rows, columns, f, "", NOW);
    expect(() => checkFilter(inDong)).toThrow("money rule not in billions");
    const orJoined = (f: ColumnFilters) =>
      Object.keys(f).length > 1
        ? [
            ...new Set(
              Object.entries(f).flatMap(([k, v]) =>
                filterRows(rows, columns, { [k]: v } as ColumnFilters, "", NOW),
              ),
            ),
          ]
        : filterRows(rows, columns, f, "", NOW);
    expect(() => checkFilter(orJoined)).toThrow("filters do not stack");
    expect(foldText("Toà Đông")).toBe("toa dong");
  });
});

describe("groupRows + rowNumbers", () => {
  const tower = col("Listing.buildingName");
  type Ordered = readonly { rows: readonly ViewRow[] }[];

  /** Groups in reading order, every row under its own tower, numbers 1..n on through the groups. */
  function checkGroups(source: readonly ViewRow[], groups: Ordered, numbers: Map<string, number>) {
    const names = [...new Set(source.map((r) => String(r["Listing.buildingName"])))].sort((a, b) =>
      a.localeCompare(b, "vi", { numeric: true, sensitivity: "base" }),
    );
    expect(groups.map((g) => String(g.rows[0]?.["Listing.buildingName"]))).toEqual(names);
    expect(groups.reduce((n, g) => n + g.rows.length, 0)).toBe(source.length);
    let expected = 1;
    for (const g of groups)
      for (const r of g.rows) {
        if (numbers.get(r.id) !== expected) throw new Error("row numbers restart in group");
        expected += 1;
      }
    for (const g of groups) {
      const name = g.rows[0]?.["Listing.buildingName"];
      expect(g.rows.every((r) => r["Listing.buildingName"] === name)).toBe(true);
    }
  }

  it("groups the sample rows by tower, with and without a status filter", () => {
    for (const source of [
      rows,
      filterRows(rows, columns, { "Listing.standardStatus": ["Active"] }),
    ]) {
      const groups = groupRows(source, tower);
      checkGroups(source, groups, rowNumbers(groups));
    }
  });

  it("sorts inside each tower and keeps the towers' order (2 cells)", () => {
    const CELLS: SortBy[] = [
      { field: "Listing.listPrice", direction: "asc" },
      { field: "Listing.listPrice", direction: "desc" },
    ];
    expect(CELLS).toHaveLength(2);
    const plain = groupRows(rows, tower).map((g) => g.label);
    for (const sort of CELLS) {
      const groups = groupRows(sortRows(rows, columns, sort), tower);
      expect(groups.map((g) => g.label)).toEqual(plain);
      for (const g of groups) checkSorted(g.rows, sort);
    }
  });

  it("the group checks fail on numbers restarting and on a sort lost inside a group", () => {
    const groups = groupRows(rows, tower);
    const restart = new Map<string, number>();
    for (const g of groups) g.rows.forEach((r, i) => restart.set(r.id, i + 1));
    expect(() => checkGroups(rows, groups, restart)).toThrow("row numbers restart in group");
    const sort: SortBy = { field: "Listing.listPrice", direction: "asc" };
    const lost = groupRows(rows, tower);
    const checkInside = (gs: Ordered) => {
      for (const g of gs)
        try {
          checkSorted(g.rows, sort);
        } catch {
          throw new Error("sort lost inside group");
        }
    };
    expect(() => checkInside(groupRows(sortRows(rows, columns, sort), tower))).not.toThrow();
    expect(() => checkInside(lost)).toThrow("sort lost inside group");
  });
});
