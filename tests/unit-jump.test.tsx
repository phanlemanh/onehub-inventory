// @vitest-environment jsdom
// Row 3f (_acceptance/loi-vao-ho-so, E5): the top-bar ⌘K box — how it opens, what it suggests, where it goes.
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import type { GridRow } from "@/components/candidate/data-region";
import { UnitJump } from "@/modules/listings/ui";

const push = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));

beforeAll(() => {
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
  Element.prototype.scrollIntoView ??= () => {};
});
beforeEach(() => push.mockReset());
afterEach(cleanup);

const row = (id: string, code: string, building: string): GridRow => ({
  id,
  "Listing.unitNumber": code,
  "Listing.buildingName": building,
  "Listing.subdivisionName": "Khu 1",
});
const ROWS = [row("a1", "0601", "T1"), row("a2", "0601", "T2"), row("b1", "0905", "T1")];
const WORDS = { unit: "Căn", building: "Toà", subdivision: "Dự án", inventory: "Bảng hàng" };

const input = () => screen.getByRole("combobox");

function setup() {
  render(<UnitJump rows={ROWS} words={WORDS} />);
  return screen.getByRole("button", { name: "Gõ mã căn" });
}

describe("UnitJump", () => {
  it("opens from its button and suggests a code with every building it is in", () => {
    fireEvent.click(setup());
    fireEvent.change(input(), { target: { value: "06" } });
    expect(screen.getByRole("option", { name: /0601 · T1, T2/ })).toBeTruthy();
  });

  it("choosing a suggestion opens the inventory with that code", () => {
    fireEvent.click(setup());
    fireEvent.change(input(), { target: { value: "0905" } });
    fireEvent.click(screen.getByRole("option", { name: /0905/ }));
    expect(push, "jump did not navigate").toHaveBeenCalledWith("/inventory?ma=0905");
  });

  it("Enter with no suggestion searches the typed text; Enter on an empty box goes nowhere", () => {
    fireEvent.click(setup());
    fireEvent.keyDown(input(), { key: "Enter" });
    expect(push).not.toHaveBeenCalled();
    fireEvent.change(input(), { target: { value: " Z-99 " } });
    expect(screen.getByText(/Không có căn nào khớp/)).toBeTruthy();
    fireEvent.keyDown(input(), { key: "Enter" });
    expect(push).toHaveBeenCalledWith("/inventory?ma=Z-99");
  });

  it("⌘K, Ctrl+K and / open it; / typed in a field does not", () => {
    setup();
    act(() => {
      fireEvent.keyDown(document.body, { key: "k", metaKey: true });
    });
    expect(screen.queryByRole("combobox")).toBeTruthy();
    act(() => {
      fireEvent.keyDown(document.body, { key: "k", ctrlKey: true });
    });
    expect(screen.queryByRole("combobox")).toBeNull();
    const field = document.createElement("input");
    document.body.append(field);
    act(() => {
      fireEvent.keyDown(field, { key: "/" });
    });
    expect(screen.queryByRole("combobox"), "slash stolen from a text field").toBeNull();
    act(() => {
      fireEvent.keyDown(document.body, { key: "/" });
    });
    expect(screen.queryByRole("combobox")).toBeTruthy();
    field.remove();
  });
});
