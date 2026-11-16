// Row 5: which pasted cells had no word in Excel, over the column arrangements the person can make on the grid. The
// cells are built with the grid's own fill (tileDataGridClipboardBlock), the function the grid's paste calls.
import { describe, expect, it } from "vitest";

import { tileDataGridClipboardBlock } from "@/components/reui/data-grid/data-grid-cell-selection";

import { emptyMissingCells, type PastedPlace } from "./paste-block";

/** The axes the person can change on the grid, each written before the cases: every case names the ones it uses. */
const AXES = ["dong-ngan", "ghim-trai", "ghim-phai", "an-cot", "doi-thu-tu", "lap-khoi"] as const;
type Axis = (typeof AXES)[number];

interface Case {
  name: string;
  axes: readonly Axis[];
  /** The grid's columns in the order it shows them. */
  shown: string[];
  /** The columns the paste covered, in that order. */
  covered: string[];
  /** The block as read from the clipboard. */
  lines: string[][];
  /** How many rows the region covers (more than the block's when it repeats). */
  rows?: number;
  empties: string[];
}

const CASES: readonly Case[] = [
  {
    name: "dong-ngan-cuoi",
    axes: ["dong-ngan"],
    shown: ["A", "B", "C"],
    covered: ["A", "B"],
    lines: [["1", "2"], ["3"]],
    empties: ["r2|B"],
  },
  {
    name: "dong-ngan-dau",
    axes: ["dong-ngan"],
    shown: ["A", "B", "C"],
    covered: ["A", "B"],
    lines: [["1"], ["2", "3"]],
    empties: ["r1|B"],
  },
  {
    name: "dong-ngan-giua",
    axes: ["dong-ngan"],
    shown: ["A", "B", "C"],
    covered: ["A", "B", "C"],
    lines: [["1", "2", "3"], ["4"], ["5", "6", "7"]],
    empties: ["r2|B", "r2|C"],
  },
  {
    name: "ghim-trai",
    axes: ["dong-ngan", "ghim-trai"],
    shown: ["C", "A", "B"],
    covered: ["C", "A"],
    lines: [["1", "2"], ["3"]],
    empties: ["r2|A"],
  },
  {
    name: "ghim-phai",
    axes: ["dong-ngan", "ghim-phai"],
    shown: ["B", "C", "A"],
    covered: ["C", "A"],
    lines: [["1", "2"], ["3"]],
    empties: ["r2|A"],
  },
  {
    name: "ghim-hai-ben",
    axes: ["dong-ngan", "ghim-trai", "ghim-phai"],
    shown: ["C", "B", "A"],
    covered: ["C", "B", "A"],
    lines: [["1", "2", "3"], ["4"]],
    empties: ["r2|B", "r2|A"],
  },
  {
    name: "an-cot",
    axes: ["dong-ngan", "an-cot"],
    shown: ["A", "C"],
    covered: ["A", "C"],
    lines: [["1", "2"], ["3"]],
    empties: ["r2|C"],
  },
  {
    name: "an-cot-kem-ghim",
    axes: ["dong-ngan", "an-cot", "ghim-trai"],
    shown: ["D", "A", "C"],
    covered: ["D", "A", "C"],
    lines: [
      ["1", "2", "3"],
      ["4", "5"],
    ],
    empties: ["r2|C"],
  },
  {
    name: "doi-thu-tu",
    axes: ["dong-ngan", "doi-thu-tu"],
    shown: ["A", "C", "B"],
    covered: ["C", "B"],
    lines: [["1", "2"], ["3"]],
    empties: ["r2|B"],
  },
  {
    name: "doi-thu-tu-kem-an",
    axes: ["dong-ngan", "doi-thu-tu", "an-cot"],
    shown: ["C", "A"],
    covered: ["C", "A"],
    lines: [["1", "2"], ["3"]],
    empties: ["r2|A"],
  },
  {
    name: "lap-khoi",
    axes: ["dong-ngan", "lap-khoi"],
    shown: ["A", "B"],
    covered: ["A", "B"],
    lines: [["1", "2"], ["3"]],
    rows: 4,
    empties: ["r2|B", "r4|B"],
  },
  {
    name: "khong-dong-ngan",
    axes: ["lap-khoi"],
    shown: ["A", "B"],
    covered: ["A", "B"],
    lines: [
      ["1", "2"],
      ["3", "4"],
    ],
    rows: 4,
    empties: [],
  },
];

describe("o-thieu-theo-thu-tu-cot", () => {
  it("every axis is used, alone or together with another", () => {
    for (const axis of AXES)
      expect(
        CASES.some((c) => c.axes.includes(axis)),
        axis,
      ).toBe(true);
    expect(CASES.filter((c) => c.axes.length > 2).length, "combined cases").toBeGreaterThanOrEqual(
      3,
    );
  });
  for (const c of CASES) {
    it(`o-thieu-theo-thu-tu-cot: ${c.name}`, () => {
      const rowIds = Array.from({ length: c.rows ?? c.lines.length }, (_, i) => `r${i + 1}`);
      // The grid's own fill of the region, then its cells in the table's configured order (alphabetical here),
      // which differs from the shown order: the helper must find the shown order itself.
      const filled = tileDataGridClipboardBlock(c.lines, rowIds.length, c.covered.length);
      const handed: PastedPlace[] = rowIds
        .flatMap((rowId, r) => c.covered.map((field, k) => ({ rowId, field, raw: filled[r]![k]! })))
        .sort((a, b) => a.field.localeCompare(b.field));
      const out = emptyMissingCells(handed, c.lines, c.shown);
      const emptied = out.filter((x) => x.raw === "").map((x) => `${x.rowId}|${x.field}`);
      expect(emptied.sort(), `o-thieu-theo-thu-tu-cot: ${c.name}`).toEqual([...c.empties].sort());
      for (const x of out.filter((y) => y.raw !== "")) {
        const before = handed.find((y) => y.rowId === x.rowId && y.field === x.field)!;
        expect(x.raw, "a cell with a word keeps it").toBe(before.raw);
      }
    });
  }
});
