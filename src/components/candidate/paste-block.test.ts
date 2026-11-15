// Row 5: which pasted cells had no word in Excel, over every arrangement of the grid's columns the person can make.
import { describe, expect, it } from "vitest";

import { emptyMissingCells, type PastedPlace } from "./paste-block";

/** The cells the grid hands over for `rows` × `fields` (fields in the order the grid laid the block), with words. */
const grid = (
  rows: string[],
  fields: string[],
  words: (r: number, c: number) => string,
): PastedPlace[] =>
  rows.flatMap((rowId, r) => fields.map((field, c) => ({ rowId, field, raw: words(r, c) })));

/** The grid's own fill of a short row: it repeats the row's cells (tileDataGridClipboardBlock). */
const tiled = (lines: string[][]) => (r: number, c: number) => {
  const line = lines[r % lines.length]!;
  return line[c % line.length]!;
};

const emptied = (cells: PastedPlace[]) =>
  cells.filter((c) => c.raw === "").map((c) => `${c.rowId}|${c.field}`);

/** Name, the order the grid shows its columns, the columns the paste covered in that order, the block, the empties. */
const CASES: readonly (readonly [string, string[], string[], string[][], string[]])[] = [
  ["mac-dinh, dong-ngan-cuoi", ["A", "B", "C"], ["A", "B"], [["1", "2"], ["3"]], ["r2|B"]],
  ["dong-ngan-dau", ["A", "B", "C"], ["A", "B"], [["1"], ["2", "3"]], ["r1|B"]],
  [
    "dong-ngan-giua",
    ["A", "B", "C"],
    ["A", "B", "C"],
    [["1", "2", "3"], ["4"], ["5", "6", "7"]],
    ["r2|B", "r2|C"],
  ],
  ["ghim-trai: C shown first", ["C", "A", "B"], ["C", "A"], [["1", "2"], ["3"]], ["r2|A"]],
  ["ghim-phai: A shown last", ["B", "C", "A"], ["C", "A"], [["1", "2"], ["3"]], ["r2|A"]],
  ["an-cot: B hidden between", ["A", "C"], ["A", "C"], [["1", "2"], ["3"]], ["r2|C"]],
  ["doi-thu-tu: C moved before B", ["A", "C", "B"], ["C", "B"], [["1", "2"], ["3"]], ["r2|B"]],
  [
    "lap-khoi: 2 x 2 block over 4 rows",
    ["A", "B"],
    ["A", "B"],
    [["1", "2"], ["3"]],
    ["r2|B", "r4|B"],
  ],
  [
    "khong-dong-ngan",
    ["A", "B"],
    ["A", "B"],
    [
      ["1", "2"],
      ["3", "4"],
    ],
    [],
  ],
];

describe("o-thieu-theo-thu-tu-cot", () => {
  it("covers nine arrangements", () => expect(CASES).toHaveLength(9));
  for (const [name, shown, covered, lines, empties] of CASES) {
    it(`o-thieu-theo-thu-tu-cot: ${name}`, () => {
      const rowCount = name.startsWith("lap-khoi") ? 4 : lines.length;
      const rows = Array.from({ length: rowCount }, (_, i) => `r${i + 1}`);
      // The grid hands cells over in the table's own column order, not the shown one: the helper must not rely on it.
      const handed = grid(rows, covered, tiled(lines)).sort((a, b) =>
        a.field.localeCompare(b.field),
      );
      const out = emptyMissingCells(handed, lines, shown);
      expect(emptied(out).sort(), `o-thieu-theo-thu-tu-cot: ${name}`).toEqual([...empties].sort());
      // Every other cell keeps the word Excel put there.
      for (const c of out.filter((x) => x.raw !== "")) {
        const original = handed.find((x) => x.rowId === c.rowId && x.field === c.field)!;
        expect(c.raw).toBe(original.raw);
      }
    });
  }
});
