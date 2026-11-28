// @vitest-environment jsdom
// VP11 chuan-hoa-he-design, AC-4 and AC-5 (E5): the keys of a selected cell. The rule is written out before the code as
// a matrix; the same check is run on the region's rule (green) and on two broken rules (red, pinned messages). Then the
// region itself: Enter edits an editable cell, Space opens the record from every cell and never edits.
import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { Input } from "@/components/ui/input";

import { tallGridViewport } from "../../../tests/virtual-viewport";

import { ActionPermissionProvider } from "./action-permission";
import { typedColumn } from "./column-kind";
import { DataRegion, type GridRow, type RegionCellEdit } from "./data-region";
import { gridKeyAction, type GridKeyAction, type GridKeyCell } from "./grid-keys";

type Rule = (key: string, cell: GridKeyCell) => GridKeyAction;

/** Key × cell, written before the code: 2 keys × 8 cells = 16 rows. */
const MATRIX: readonly [string, GridKeyCell, GridKeyAction][] = [
  ["Enter", { editable: true, rowActions: false, opensRecord: true }, "edit"],
  ["Enter", { editable: false, rowActions: false, opensRecord: true }, "record"],
  ["Enter", { editable: true, rowActions: false, opensRecord: false }, "edit"],
  ["Enter", { editable: false, rowActions: false, opensRecord: false }, "grid"],
  ["Enter", { editable: false, rowActions: true, opensRecord: true }, "menu"],
  ["Enter", { editable: false, rowActions: true, opensRecord: false }, "menu"],
  ["Enter", { editable: true, rowActions: true, opensRecord: true }, "menu"],
  ["Enter", { editable: true, rowActions: true, opensRecord: false }, "menu"],
  [" ", { editable: true, rowActions: false, opensRecord: true }, "record"],
  [" ", { editable: false, rowActions: false, opensRecord: true }, "record"],
  [" ", { editable: true, rowActions: false, opensRecord: false }, "grid"],
  [" ", { editable: false, rowActions: false, opensRecord: false }, "grid"],
  [" ", { editable: false, rowActions: true, opensRecord: true }, "record"],
  [" ", { editable: false, rowActions: true, opensRecord: false }, "grid"],
  [" ", { editable: true, rowActions: true, opensRecord: true }, "record"],
  [" ", { editable: true, rowActions: true, opensRecord: false }, "grid"],
];
const ROWS_EXPECTED = 16;

/** Runs the matrix on a rule; throws a pinned message on the first wrong answer. */
function checkKeyRule(rule: Rule): number {
  let checked = 0;
  for (const [key, cell, want] of MATRIX) {
    const got = rule(key, cell);
    checked += 1;
    if (got === want) continue;
    if (key === "Enter" && cell.editable && !cell.rowActions && got === "record")
      throw new Error("Enter opened the record on an editable cell");
    if (key === "Enter" && !cell.editable && got === "edit")
      throw new Error("Enter opened an editor on a locked cell");
    if (key === " " && got !== "record") throw new Error("Space did not open the record");
    throw new Error(`${JSON.stringify(key)} on ${JSON.stringify(cell)}: ${got}, not ${want}`);
  }
  return checked;
}

/** The signed rule of rows 2a and 4 before VP11: Enter opens the record wherever there is one. */
const oldRule: Rule = (key, cell) =>
  key === "Enter" ? (cell.rowActions ? "menu" : cell.opensRecord ? "record" : "grid") : "grid";
/** A rule that edits every cell, locked or not. */
const editsLocked: Rule = (key, cell) =>
  key === "Enter" && !cell.rowActions ? "edit" : gridKeyAction(key, cell);

describe("AC-4 · AC-5 · the key rule", () => {
  it("answers every row of the matrix", () => {
    expect(MATRIX).toHaveLength(ROWS_EXPECTED);
    expect(checkKeyRule(gridKeyAction)).toBe(ROWS_EXPECTED);
  });

  it("fails on the old rule and on a rule that edits locked cells", () => {
    expect(() => checkKeyRule(oldRule)).toThrow("Enter opened the record on an editable cell");
    expect(() => checkKeyRule(editsLocked)).toThrow("Enter opened an editor on a locked cell");
    expect(() =>
      checkKeyRule((key, cell) => (key === " " ? "grid" : gridKeyAction(key, cell))),
    ).toThrow("Space did not open the record");
  });
});

beforeAll(() => {
  tallGridViewport();
  Element.prototype.getAnimations ??= () => [];
  Element.prototype.scrollIntoView ??= () => {};
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
afterEach(() => cleanup());

const PRICE = "Listing.listPrice";
const rows: GridRow[] = [
  { id: "a", "Listing.unitNumber": "1101", [PRICE]: 2_710_000_000 },
  { id: "b", "Listing.unitNumber": "0606", [PRICE]: 6_730_000_000, locked: { [PRICE]: "khoá" } },
];
const columns = [
  typedColumn({ field: "Listing.unitNumber", header: "Mã" }),
  typedColumn({ field: PRICE, header: "Giá" }),
];
const cellEdit: RegionCellEdit = {
  action: "updateListing",
  fields: [PRICE],
  label: (row) => `sửa ${String(row["Listing.unitNumber"])}`,
  render: (session) => <Input aria-label="trình sửa" defaultValue={session.initialText ?? ""} />,
};

function show(withRecord: boolean) {
  const navigate = vi.fn();
  render(
    <ActionPermissionProvider permitted={() => true}>
      <DataRegion
        title="Vùng"
        columns={columns}
        rows={rows}
        cellEdit={cellEdit}
        record={
          withRecord
            ? {
                render: (row) => ({ title: String(row["Listing.unitNumber"]), body: null }),
                address: { openId: null, navigate },
              }
            : undefined
        }
      />
    </ActionPermissionProvider>,
  );
  return navigate;
}

const cellOf = (rowId: string, field: string) =>
  document.querySelector<HTMLElement>(`tr[data-row-id="${rowId}"] td[data-col-id="${field}"]`)!;

async function press(cell: HTMLElement, key: string) {
  await act(async () => {
    fireEvent.mouseDown(cell);
    fireEvent.mouseUp(cell);
    fireEvent.click(cell);
  });
  await act(async () => {
    fireEvent.keyDown(cell, { key });
  });
}

const editorOpen = () => document.querySelector('[data-slot="cell-editor"]') !== null;

describe("AC-4 · AC-5 · the region follows the rule", () => {
  it("Enter edits an editable cell and opens the record from a locked one", async () => {
    const navigate = show(true);
    await press(cellOf("a", PRICE), "Enter");
    expect(editorOpen(), "Enter opened the record on an editable cell").toBe(true);
    expect(navigate).not.toHaveBeenCalled();
    cleanup();
    const again = show(true);
    await press(cellOf("b", PRICE), "Enter");
    expect(editorOpen(), "Enter opened an editor on a locked cell").toBe(false);
    expect(again).toHaveBeenCalledWith("b");
  });

  it("Space opens the record from an editable cell and never edits it", async () => {
    const navigate = show(true);
    await press(cellOf("a", PRICE), " ");
    expect(navigate, "Space did not open the record").toHaveBeenCalledWith("a");
    expect(editorOpen()).toBe(false);
  });

  it("Enter on the unit code opens the record", async () => {
    const navigate = show(true);
    await press(cellOf("a", "Listing.unitNumber"), "Enter");
    expect(navigate).toHaveBeenCalledWith("a");
    expect(editorOpen()).toBe(false);
  });

  // A screen with no record (the company layer): Enter on a cell that does not edit leaves it to the grid, which selects
  // the cell below. Red when the region keeps Enter for itself on such a screen (nothing moves) or opens an editor.
  it("on a screen without a record Enter on a cell that does not edit selects the cell below", async () => {
    show(false);
    await press(cellOf("a", "Listing.unitNumber"), "Enter");
    expect(editorOpen(), "Enter opened an editor on a cell that does not edit").toBe(false);
    expect(focusedRow(), "Enter did not move to the cell below").toBe("b");
  });
});

/** The row of the selected cell, as the grid marks it. */
const focusedRow = () =>
  document.querySelector("[data-cell-focused]")?.closest("tr")?.getAttribute("data-row-id") ?? null;
