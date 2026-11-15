// @vitest-environment jsdom
// Row 5 (dan-tu-excel), region layer: a paste on the shared grid writes nothing by itself — it hands the screen every
// pasted cell, says which ones the grid would not open, and only when the permission table gives the session the edit
// action. Cut and Delete write nothing.
import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { Input } from "@/components/ui/input";
import { ACTIONS, ROLE_INHERITS, type Role } from "@/generated/ontology";

import { tallGridViewport } from "../../../tests/virtual-viewport";

import { ActionPermissionProvider, type ActionPermission } from "./action-permission";
import { typedColumn } from "./column-kind";
import { DataRegion, type GridRow, type RegionCellEdit, type RegionPaste } from "./data-region";

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
const STATUS = "Listing.standardStatus";
const UNIT = "Listing.unitNumber";
const fresh = (): GridRow[] => [
  { id: "a", [UNIT]: "1101", [PRICE]: 2_710_000_000, [STATUS]: "Active" },
  {
    id: "b",
    [UNIT]: "0606",
    [PRICE]: 6_730_000_000,
    [STATUS]: "Closed",
    locked: { [PRICE]: "khoá" },
  },
  { id: "c", [UNIT]: "0909", [PRICE]: 4_280_000_000, [STATUS]: "Active" },
];
let ROWS: GridRow[] = fresh();
const columns = [
  typedColumn({ field: UNIT, header: "Mã" }),
  typedColumn({ field: PRICE, header: "Giá" }),
  typedColumn({ field: STATUS, header: "Tình trạng" }),
];

const asRole =
  (role: Role): ActionPermission =>
  (action) =>
    Boolean(ACTIONS.find((a) => a.name === action)?.scope[role]);

function show(permitted: ActionPermission) {
  ROWS = fresh();
  const paste = vi.fn<(p: RegionPaste) => void>();
  const pasteRefused = vi.fn();
  const editorOpened = vi.fn();
  const cellEdit: RegionCellEdit = {
    action: "updateListing",
    fields: [PRICE, STATUS],
    label: (row) => `sửa ${String(row[UNIT])}`,
    render: (session) => {
      editorOpened(session.field);
      return <Input aria-label="trình sửa" defaultValue={session.initialText ?? ""} />;
    },
    paste,
    pasteRefused,
  };
  render(
    <ActionPermissionProvider permitted={permitted}>
      <DataRegion
        title="Vùng"
        columns={columns}
        rows={ROWS}
        cellEdit={cellEdit}
        record={{
          render: (row) => ({ title: String(row[UNIT]), body: null }),
          address: { openId: null, navigate: vi.fn() },
        }}
      />
    </ActionPermissionProvider>,
  );
  return { paste, pasteRefused, editorOpened };
}

const cellOf = (rowIndex: number, field: string) =>
  [...document.querySelectorAll<HTMLElement>(`td[data-col-id="${field}"]`)][rowIndex]!;

async function select(cell: HTMLElement) {
  await act(async () => {
    fireEvent.mouseDown(cell);
    fireEvent.mouseUp(cell);
    fireEvent.click(cell);
  });
}

/** A paste from Excel: tab between cells, newline between rows, as the clipboard carries it. */
async function pasteText(cell: HTMLElement, text: string) {
  const event = new Event("paste", { bubbles: true, cancelable: true });
  Object.defineProperty(event, "clipboardData", {
    value: { getData: (type: string) => (type === "text/plain" ? text : "") },
  });
  await act(async () => {
    cell.dispatchEvent(event);
  });
}

describe("chua-ghi-truoc-khi-ap", () => {
  it("chua-ghi-truoc-khi-ap: a paste hands every cell to the screen and changes no row", async () => {
    const { paste, editorOpened } = show(asRole("ListAgent"));
    await select(cellOf(0, PRICE));
    await pasteText(cellOf(0, PRICE), "2,8 tỷ\tchữ a\n7 tỷ\tchữ b\n4,3 tỷ\tchữ c\n");
    // One hand-over for the whole region: the screen opens the preview once and writes only on «Áp».
    const calls = paste.mock.calls.length;
    expect(calls, `chua-ghi-truoc-khi-ap: ${calls} lần ghi`).toBe(1);
    const handed = paste.mock.calls[0]![0];
    expect(handed.cells.map((c) => `${c.row.id}|${c.field}|${c.raw}`)).toEqual([
      "a|Listing.listPrice|2,8 tỷ",
      "a|Listing.standardStatus|chữ a",
      "b|Listing.listPrice|7 tỷ",
      "b|Listing.standardStatus|chữ b",
      "c|Listing.listPrice|4,3 tỷ",
      "c|Listing.standardStatus|chữ c",
    ]);
    expect(handed.beyond).toEqual({ rows: 0, columns: 0 });
    expect(editorOpened, "chua-ghi-truoc-khi-ap: no editor opens").not.toHaveBeenCalled();
    expect(document.querySelector(`td[data-col-id="${PRICE}"]`)?.textContent).not.toContain("2,8");
  });

  it("a region larger than the grid says how much fell outside", async () => {
    const { paste } = show(asRole("ListAgent"));
    await select(cellOf(2, PRICE));
    await pasteText(cellOf(2, PRICE), "1 tỷ\tchữ b\tx\n2 tỷ\tchữ b\tx\n");
    expect(paste.mock.calls[0]![0].beyond).toEqual({ rows: 1, columns: 1 });
  });
});

describe("khoi-o-nhieu-dong", () => {
  it("khoi-o-nhieu-dong: a quoted Excel cell with a line break is one cell, nothing falls outside", async () => {
    const { paste } = show(asRole("ListAgent"));
    await select(cellOf(1, PRICE));
    await pasteText(cellOf(1, PRICE), '"dòng 1\ndòng 2"\tchữ a\n7 tỷ\tchữ b\n');
    const handed = paste.mock.calls[0]![0];
    expect(handed.cells.map((c) => `${c.row.id}|${c.raw}`)).toEqual([
      "b|dòng 1\ndòng 2",
      "b|chữ a",
      "c|7 tỷ",
      "c|chữ b",
    ]);
    expect(handed.beyond, "khoi-o-nhieu-dong: phần thừa").toEqual({ rows: 0, columns: 0 });
  });
});

describe("bo-theo-cot-va-khoa", () => {
  it("bo-theo-cot-va-khoa: a column the screen did not open and a locked cell come marked not open", async () => {
    const { paste } = show(asRole("ListAgent"));
    await select(cellOf(0, UNIT));
    await pasteText(cellOf(0, UNIT), "9999\t5 tỷ\n8888\t7 tỷ\n");
    const open = Object.fromEntries(
      paste.mock.calls[0]![0].cells.map((c) => [`${c.row.id}|${c.field}`, c.open]),
    );
    expect(open, "bo-theo-cot-va-khoa").toEqual({
      "a|Listing.unitNumber": false,
      "a|Listing.listPrice": true,
      "b|Listing.unitNumber": false,
      "b|Listing.listPrice": false,
    });
  });
});

/** Every role of the model and whether the permission table opens editing a listing to it today (row 9a). */
const ROLES: readonly [Role, boolean][] = [
  ["ListAgent", true],
  ["BuyerAgent", true],
  ["TeamLead", true],
  ["CompanyAdmin", false],
];

describe("khong-quyen-khong-mo", () => {
  it("covers every role of the model", () =>
    expect(ROLES.map(([r]) => r).sort()).toEqual(Object.keys(ROLE_INHERITS).sort()));
  for (const [role, opens] of ROLES) {
    it(`khong-quyen-khong-mo: ${role}`, async () => {
      const { paste, pasteRefused } = show(asRole(role));
      await select(cellOf(0, PRICE));
      await pasteText(cellOf(0, PRICE), "2,8 tỷ");
      expect(paste.mock.calls.length > 0, `khong-quyen-khong-mo: ${role}`).toBe(opens);
      expect(pasteRefused.mock.calls.length > 0).toBe(!opens);
    });
  }
});

describe("cat-xoa-khong-ghi", () => {
  it("cat-xoa-khong-ghi: cut and Delete hand nothing to the screen", async () => {
    const { paste, editorOpened } = show(asRole("ListAgent"));
    const cell = cellOf(0, PRICE);
    await select(cell);
    const cut = new Event("cut", { bubbles: true, cancelable: true });
    let copied = "";
    Object.defineProperty(cut, "clipboardData", {
      value: {
        setData: (type: string, text: string) => {
          if (type === "text/plain") copied = text;
        },
        getData: () => "",
      },
    });
    await act(async () => {
      cell.dispatchEvent(cut);
    });
    await act(async () => {
      fireEvent.keyDown(cell, { key: "Delete" });
      fireEvent.keyDown(cell, { key: "Backspace" });
    });
    expect(paste, "cat-xoa-khong-ghi").not.toHaveBeenCalled();
    expect(editorOpened).not.toHaveBeenCalled();
    // Positive control: the cut reached the grid (it put the cell on the clipboard), and a paste on the same cell
    // right after is handed over — the events land where the paste path listens.
    expect(copied, "cat-xoa-khong-ghi: lần cắt không tới lưới").not.toBe("");
    await pasteText(cell, "2,8 tỷ");
    expect(paste).toHaveBeenCalledOnce();
  });
});
