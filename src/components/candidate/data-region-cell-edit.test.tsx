// @vitest-environment jsdom
// Row 4 (sua-tren-o), AC-8 and AC-9, region layer: a cell opens its editor only when the permission table gives the
// session the edit action and the row does not lock it; Enter edits such a cell and opens the record elsewhere (VP11).
import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { Input } from "@/components/ui/input";
import { ACTIONS, type Role } from "@/generated/ontology";

import { tallGridViewport } from "../../../tests/virtual-viewport";

import { ActionPermissionProvider, type ActionPermission } from "./action-permission";
import { typedColumn } from "./column-kind";
import { DataRegion, type GridRow, type RegionCellEdit } from "./data-region";

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
    matches: true,
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

let navigate = vi.fn();

function show(permitted: ActionPermission) {
  navigate = vi.fn();
  return render(
    <ActionPermissionProvider permitted={permitted}>
      <DataRegion
        title="Vùng"
        columns={columns}
        rows={rows}
        cellEdit={cellEdit}
        record={{
          render: (row) => ({ title: String(row["Listing.unitNumber"]), body: null }),
          address: { openId: null, navigate },
        }}
      />
    </ActionPermissionProvider>,
  );
}

const cellOf = (rowId: string, field: string) =>
  document.querySelector<HTMLElement>(`tr[data-row-id="${rowId}"] td[data-col-id="${field}"]`) ??
  [...document.querySelectorAll<HTMLElement>(`td[data-col-id="${field}"]`)][rowId === "a" ? 0 : 1]!;

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

/** The permission table of row 9a for one role: the edit action is open when the role has a scope for it. */
const asRole =
  (role: Role): ActionPermission =>
  (action) =>
    Boolean(ACTIONS.find((a) => a.name === action)?.scope[role]);

const ROLES: readonly [Role, boolean][] = [
  ["ListAgent", true],
  ["BuyerAgent", true],
  ["TeamLead", true],
  ["CompanyAdmin", false],
];

describe("mo-theo-quyen", () => {
  for (const [role, opens] of ROLES) {
    it(`mo-theo-quyen: ${role}`, async () => {
      show(asRole(role));
      await press(cellOf("a", PRICE), "F2");
      expect(editorOpen(), `mo-theo-quyen: ${role}`).toBe(opens);
    });
  }

  it("mo-theo-quyen: a column the screen did not open stays plain", async () => {
    show(asRole("ListAgent"));
    await press(cellOf("a", "Listing.unitNumber"), "F2");
    expect(editorOpen()).toBe(false);
  });
});

describe("khoa-theo-dong", () => {
  it("khoa-theo-dong: a locked cell does not open, the next row's does", async () => {
    show(asRole("ListAgent"));
    await press(cellOf("b", PRICE), "F2");
    expect(editorOpen(), "khoa-theo-dong: locked row opened").toBe(false);
    await press(cellOf("a", PRICE), "F2");
    expect(editorOpen()).toBe(true);
  });
});

// VP11 (owner 2026-11-28, Hỏi-1) changed this signed rule: Enter now edits a cell the session may edit, and opens the
// record from any other cell. Was «enter-van-mo-ho-so» (sửa sau ký, _acceptance/sua-tren-o/decisions.jsonl).
describe("enter-sua-o-sua-duoc", () => {
  it("enter-sua-o-sua-duoc: Enter on an editable cell opens the editor, not the record", async () => {
    show(asRole("ListAgent"));
    await press(cellOf("a", PRICE), "Enter");
    expect(editorOpen(), "enter-sua-o-sua-duoc").toBe(true);
    expect(navigate, "enter-sua-o-sua-duoc").not.toHaveBeenCalled();
  });

  it("enter-sua-o-sua-duoc: Enter on a locked cell opens the record, not the editor", async () => {
    show(asRole("ListAgent"));
    await press(cellOf("b", PRICE), "Enter");
    expect(editorOpen(), "enter-sua-o-sua-duoc: locked").toBe(false);
    expect(navigate).toHaveBeenCalledWith("b");
  });
});
