// Where each pasted cell came from in the block Excel put on the clipboard (row 5, _acceptance/dan-tu-excel). The grid
// lays the block over the rows and columns it shows, in the order it shows them (pinned start, middle, pinned end;
// hidden rows and columns skipped), and repeats a short block row's own cells to fill it out. A cell that falls past
// the end of its short row had no word in Excel: it is empty, never the repeated word.

/** One cell the grid handed over: its row, its column, and the word the grid put in it. */
export interface PastedPlace {
  rowId: string;
  field: string;
  raw: string;
}

/**
 * Empties the cells that fall past the end of a short block row. `cells` are the cells the grid handed over, `lines`
 * the block as read from the clipboard, `shown` the ids of the grid's columns in the order it shows them. Rows count
 * in the order the cells come (the grid's display order); a block smaller than the region repeats.
 */
export function emptyMissingCells<T extends PastedPlace>(
  cells: readonly T[],
  lines: readonly (readonly string[])[],
  shown: readonly string[],
): T[] {
  const rows = Math.max(1, lines.length);
  const columns = Math.max(1, ...lines.map((line) => line.length));
  const rowsInOrder = [...new Set(cells.map((c) => c.rowId))];
  const fieldsInOrder = [...new Set(cells.map((c) => c.field))].sort(
    (a, b) => shown.indexOf(a) - shown.indexOf(b),
  );
  return cells.map((c) => {
    const line = lines[rowsInOrder.indexOf(c.rowId) % rows] ?? [];
    return fieldsInOrder.indexOf(c.field) % columns >= line.length ? { ...c, raw: "" } : c;
  });
}
