// The keys of a selected grid cell (VP11 chuan-hoa-he-design, owner 2026-11-28, Hỏi-1 — changes the signed rules of
// rows 2a and 4 and ruling D-1211-19), as one pure rule the region follows and the tests read.

/** What a key on a selected cell does: the grid edits, the region opens the row or its «…» menu, or the grid goes on. */
export type GridKeyAction = "edit" | "record" | "menu" | "grid";

export type GridKeyCell = {
  /** The session may edit this cell in place now (permission, row not locked, a field the screen edits in place). */
  editable: boolean;
  /** The cell is the row's «…» cell (row 9e). */
  rowActions: boolean;
  /** The screen has a record for its rows (the record panel of row 3). */
  opensRecord: boolean;
};

/**
 * Enter edits a cell that edits in place, opens the «…» menu on that cell, opens the row's record on any other cell, and
 * moves down (the grid's own Enter) where the screen has no record. Space opens the record from every cell; with no
 * record it is the grid's. Other keys stay the grid's.
 */
export function gridKeyAction(key: string, cell: GridKeyCell): GridKeyAction {
  if (key === " ") return cell.opensRecord ? "record" : "grid";
  if (key !== "Enter") return "grid";
  if (cell.rowActions) return "menu";
  if (cell.editable) return "edit";
  return cell.opensRecord ? "record" : "grid";
}
