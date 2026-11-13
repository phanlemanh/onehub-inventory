// @vitest-environment jsdom
// Row 4 (sua-tren-o): the in-cell editors and the cell edit of the inventory grid, without a browser. The browser
// suite (tests/e2e/sua-tren-o.spec.ts) checks the same flows on the real grid at four sizes.
import { act, cleanup, fireEvent, render, renderHook, screen } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import type { CellEditSession, GridRow } from "@/components/candidate/data-region";
import { LABELS } from "@/generated/labels";
import type { Listing } from "@/generated/ontology";
import { statusLabel } from "@/lib/format";

import type { ListingSaveDoor, SaveOutcome } from "../save-door";

import { CELL_EDIT_COPY, cellEditLabels } from "./cell-edit-copy";
import type { InventoryField } from "./inventory-rows";
import { ListingCellEdit, StatusNeedsDialog, lockedReasons } from "./listing-cell-edit";
import { useListingCellEdit } from "./use-listing-cell-edit";

/** The words from the label table, as the page passes them. */
const labels = cellEditLabels((c, tx) => {
  const entry: { pref: string; lease?: string } = LABELS[c];
  return tx === "lease" && entry.lease ? entry.lease : entry.pref;
});

const toast = vi.hoisted(() => Object.assign(vi.fn(), { error: vi.fn() }));
vi.mock("sonner", () => ({ toast }));

beforeAll(() => {
  Element.prototype.getAnimations ??= () => [];
  window.matchMedia ??= ((query: string) => ({
    matches: true,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  })) as unknown as typeof window.matchMedia;
});
afterEach(() => {
  cleanup();
  toast.mockReset();
  toast.error.mockReset();
});

const row = (over: Partial<GridRow> = {}): GridRow => ({
  id: "4d415500-0001-4000-8000-000000000002",
  "Listing.unitNumber": "1101",
  "Listing.listPrice": 2_710_000_000,
  "Listing.standardStatus": "Active",
  ...over,
});

function session(field: "Listing.listPrice" | "Listing.standardStatus", initialText?: string) {
  const close = vi.fn();
  const s: CellEditSession = { row: row(), field, initialText, close };
  return { s, close };
}

describe("price editor", () => {
  it("reads the price back and Enter saves it once", () => {
    const { s, close } = session("Listing.listPrice", "2,8 tỷ");
    const onSave = vi.fn();
    render(<ListingCellEdit labels={labels} session={s} onSave={onSave} onAsk={vi.fn()} />);
    expect(screen.getByText(CELL_EDIT_COPY.readAs(2_800_000_000))).toBeTruthy();
    fireEvent.keyDown(screen.getByRole("textbox"), { key: "Enter" });
    expect(onSave).toHaveBeenCalledWith({ field: "Listing.listPrice", value: 2_800_000_000 });
    expect(close).toHaveBeenCalledOnce();
  });

  it("does not save text it cannot read, and says so", () => {
    const { s } = session("Listing.listPrice", "abc");
    const onSave = vi.fn();
    render(<ListingCellEdit labels={labels} session={s} onSave={onSave} onAsk={vi.fn()} />);
    fireEvent.keyDown(screen.getByRole("textbox"), { key: "Enter" });
    expect(onSave).not.toHaveBeenCalled();
    expect(screen.getByRole("alert").textContent).toContain(CELL_EDIT_COPY.notUnderstood("abc"));
  });

  it("asks again past 20%: Thôi keeps the price, Đổi giá saves", () => {
    const { s } = session("Listing.listPrice", "4ty65");
    const onSave = vi.fn();
    render(<ListingCellEdit labels={labels} session={s} onSave={onSave} onAsk={vi.fn()} />);
    fireEvent.keyDown(screen.getByRole("textbox"), { key: "Enter" });
    expect(screen.getByText(CELL_EDIT_COPY.ask(72))).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: CELL_EDIT_COPY.cancel }));
    expect(onSave).not.toHaveBeenCalled();
    fireEvent.keyDown(screen.getByRole("textbox"), { key: "Enter" });
    fireEvent.click(screen.getByRole("button", { name: CELL_EDIT_COPY.changePrice }));
    expect(onSave).toHaveBeenCalledWith({ field: "Listing.listPrice", value: 4_650_000_000 });
  });

  it("Tab saves and moves on; the same price just closes", () => {
    const tab = session("Listing.listPrice", "2,72 tỷ");
    const onSave = vi.fn();
    render(<ListingCellEdit labels={labels} session={tab.s} onSave={onSave} onAsk={vi.fn()} />);
    fireEvent.keyDown(screen.getByRole("textbox"), { key: "Tab" });
    expect(tab.close).toHaveBeenCalledWith("next");
    cleanup();
    const same = session("Listing.listPrice");
    render(<ListingCellEdit labels={labels} session={same.s} onSave={onSave} onAsk={vi.fn()} />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "2,71 tỷ" } });
    fireEvent.keyDown(screen.getByRole("textbox"), { key: "Enter" });
    expect(onSave).toHaveBeenCalledOnce();
    expect(same.close).toHaveBeenCalledOnce();
  });
});

describe("status editor", () => {
  it("offers only the allowed moves; a plain move saves, a move that needs more asks", () => {
    const { s } = session("Listing.standardStatus");
    const onSave = vi.fn();
    const onAsk = vi.fn();
    render(<ListingCellEdit labels={labels} session={s} onSave={onSave} onAsk={onAsk} />);
    expect(screen.getAllByRole("option").map((o) => o.getAttribute("data-status-option"))).toEqual([
      "Pending",
      "Closed",
      "Hold",
      "Withdrawn",
    ]);
    fireEvent.click(screen.getByRole("option", { name: statusLabel("Hold") }));
    expect(onSave).toHaveBeenCalledWith({
      field: "Listing.standardStatus",
      value: "Hold",
      undoable: true,
    });
    cleanup();
    const again = session("Listing.standardStatus");
    render(<ListingCellEdit labels={labels} session={again.s} onSave={onSave} onAsk={onAsk} />);
    fireEvent.click(screen.getAllByRole("option")[1]!);
    expect(onAsk).toHaveBeenCalledWith({ row: again.s.row, to: "Closed" });
  });
});

describe("status needs dialog", () => {
  it("Closed asks a close price and date, says it is final, and saves when complete", () => {
    const onSave = vi.fn();
    const onClose = vi.fn();
    render(
      <StatusNeedsDialog
        labels={labels}
        ask={{ row: row(), to: "Closed" }}
        onClose={onClose}
        onSave={onSave}
      />,
    );
    expect(document.body.textContent).toContain(CELL_EDIT_COPY.final("Closed"));
    const price = screen.getByDisplayValue("2.710.000.000");
    fireEvent.change(price, { target: { value: "" } });
    fireEvent.click(screen.getByRole("button", { name: CELL_EDIT_COPY.changeStatus }));
    expect(screen.getByRole("alert").textContent).toMatch(/^Còn thiếu /);
    expect(onSave).not.toHaveBeenCalled();
    fireEvent.change(price, { target: { value: "2,7 tỷ" } });
    fireEvent.click(screen.getByRole("button", { name: CELL_EDIT_COPY.changeStatus }));
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ id: row().id }),
      expect.objectContaining({ value: "Closed", closePrice: 2_700_000_000, undoable: false }),
    );
    expect(onClose).toHaveBeenCalled();
  });

  it("Withdrawn asks a reason", () => {
    const onSave = vi.fn();
    render(
      <StatusNeedsDialog
        labels={labels}
        ask={{ row: row(), to: "Withdrawn" }}
        onClose={vi.fn()}
        onSave={onSave}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: CELL_EDIT_COPY.changeStatus }));
    expect(onSave).not.toHaveBeenCalled();
    fireEvent.click(
      screen.getByRole("radio", { name: CELL_EDIT_COPY.reason(labels, "unreachable") }),
    );
    fireEvent.click(screen.getByRole("button", { name: CELL_EDIT_COPY.changeStatus }));
    expect(onSave).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ value: "Withdrawn", withdrawnReason: "unreachable" }),
    );
  });

  it("renders nothing without an ask", () => {
    render(<StatusNeedsDialog labels={labels} ask={null} onClose={vi.fn()} onSave={vi.fn()} />);
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});

describe("locked reasons", () => {
  it("Closed locks price and status, Withdrawn only status, Active nothing", () => {
    expect(Object.keys(lockedReasons(row({ "Listing.standardStatus": "Closed" })) ?? {})).toEqual([
      "Listing.listPrice",
      "Listing.standardStatus",
    ]);
    expect(
      Object.keys(lockedReasons(row({ "Listing.standardStatus": "Withdrawn" })) ?? {}),
    ).toEqual(["Listing.standardStatus"]);
    expect(lockedReasons(row())).toBeUndefined();
  });
});

const HEADERS = {
  "Listing.unitNumber": "Mã",
  "Listing.listPrice": "Giá",
  "Listing.standardStatus": "Tình trạng",
} as unknown as Readonly<Record<InventoryField, string>>;
const LISTING: Listing = {
  id: row().id,
  companyId: "4d415500-0000-4000-8000-000000000001",
  buildingName: "S1.01",
  unitNumber: "1101",
  standardStatus: "Active",
  listPrice: 2_710_000_000,
  version: 1,
};

function hookWith(answers: SaveOutcome["kind"][]) {
  const save = vi.fn(async (): Promise<SaveOutcome> => {
    const kind = answers.shift() ?? "saved";
    return kind === "saved"
      ? { kind, listing: { ...LISTING, version: 2 } }
      : kind === "invalid"
        ? { kind, why: { rule: "locked" } }
        : ({ kind } as SaveOutcome);
  });
  const door: ListingSaveDoor = { save };
  const hook = renderHook(() =>
    useListingCellEdit({ rows: [row()], listings: [LISTING], headers: HEADERS, labels, door }),
  );
  return { hook, save };
}

async function editPrice(hook: ReturnType<typeof hookWith>["hook"], text: string) {
  const close = vi.fn();
  const editor = hook.result.current.cellEdit!.render({
    row: hook.result.current.rows[0]!,
    field: "Listing.listPrice",
    initialText: text,
    close,
  });
  const view = render(<>{editor}</>);
  await act(async () => {
    fireEvent.keyDown(screen.getByRole("textbox"), { key: "Enter" });
  });
  view.unmount();
}

describe("cell edit of the grid", () => {
  it("shows the new price at once, saves through the door, and undo puts it back", async () => {
    const { hook, save } = hookWith(["saved", "saved"]);
    expect(hook.result.current.cellEdit?.fields).toEqual([
      "Listing.listPrice",
      "Listing.standardStatus",
    ]);
    expect(hook.result.current.cellEdit?.label(row(), "Listing.listPrice")).toContain("1101");
    await editPrice(hook, "2,8 tỷ");
    expect(hook.result.current.rows[0]!["Listing.listPrice"]).toBe(2_800_000_000);
    expect(save).toHaveBeenCalledOnce();
    const undo = (toast.mock.calls[0]![1] as { action: { onClick: () => void } }).action;
    await act(async () => undo.onClick());
    expect(save).toHaveBeenCalledTimes(2);
    expect(hook.result.current.rows[0]!["Listing.listPrice"]).toBe(2_710_000_000);
  });

  it("a save the door does not take puts the old price back and says why", async () => {
    const { hook } = hookWith(["offline"]);
    await editPrice(hook, "2,8 tỷ");
    expect(hook.result.current.rows[0]!["Listing.listPrice"]).toBe(2_710_000_000);
    expect(toast.error).toHaveBeenCalledOnce();
  });

  it("a change the door finds invalid counts as refused", async () => {
    const { hook } = hookWith(["invalid"]);
    await editPrice(hook, "2,8 tỷ");
    expect(toast.error).toHaveBeenCalledWith(
      "Không đủ quyền làm việc này. Tải lại trang để thấy đúng các nút.",
    );
  });

  it("a status move through the dialog saves without undo", async () => {
    const { hook, save } = hookWith(["saved"]);
    const dialogs = render(<>{hook.result.current.dialogs}</>);
    dialogs.unmount();
    const close = vi.fn();
    render(
      <>
        {hook.result.current.cellEdit!.render({
          row: hook.result.current.rows[0]!,
          field: "Listing.standardStatus",
          close,
        })}
      </>,
    );
    await act(async () => {
      fireEvent.click(screen.getByRole("option", { name: statusLabel("Hold") }));
    });
    expect(save).toHaveBeenCalledOnce();
    expect(hook.result.current.rows[0]!["Listing.standardStatus"]).toBe("Hold");
  });

  it("without listings the grid stays read-only", () => {
    const hook = renderHook(() =>
      useListingCellEdit({ rows: [row()], listings: undefined, headers: HEADERS, labels }),
    );
    expect(hook.result.current.cellEdit).toBeUndefined();
  });
});
