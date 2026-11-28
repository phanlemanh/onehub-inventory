// @vitest-environment jsdom
// VP11 chuan-hoa-he-design, AC-7 (E8): clicking away from a cell's editor saves like Enter. The check runs on the real
// editor with an editor content that hands its Enter over (green) and on one that does not (red, pinned message).
import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { Input } from "@/components/ui/input";

import { CellEditor, useSaveOnAway } from "./cell-editor";

beforeAll(() => {
  Element.prototype.getAnimations ??= () => [];
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
});
afterEach(() => cleanup());

function Hands({ save }: { save: () => void }) {
  useSaveOnAway(save);
  return <Input aria-label="giá" autoFocus />;
}

/** Clicks outside the editor; returns what the editor did: saved, or closed without a write. */
async function clickAway(content: (save: () => void) => React.ReactNode) {
  const save = vi.fn();
  const close = vi.fn();
  const anchor = document.createElement("td");
  document.body.append(anchor);
  render(
    <CellEditor anchor={anchor} label="sửa" onClose={close}>
      {content(save)}
    </CellEditor>,
  );
  await act(async () => {
    fireEvent.pointerDown(document.body);
    fireEvent.mouseDown(document.body);
    fireEvent.pointerUp(document.body);
    fireEvent.mouseUp(document.body);
    fireEvent.click(document.body);
    await new Promise((r) => setTimeout(r, 20));
  });
  return { saved: save.mock.calls.length, closed: close.mock.calls.length };
}

function checkAway(did: { saved: number; closed: number }): void {
  if (did.saved === 0) throw new Error("clicking away dropped the typed value");
  if (did.saved > 1) throw new Error("two writes for one edit");
  if (did.closed > 0) throw new Error("clicking away closed the editor without its save");
}

describe("AC-7 · clicking away saves", () => {
  it("runs the editor's save once, and does not close it without the save", async () => {
    const did = await clickAway((save) => <Hands save={save} />);
    expect(() => checkAway(did)).not.toThrow();
  });

  it("the check fails on an editor that drops the value when clicked away", async () => {
    const did = await clickAway(() => <Input aria-label="giá" autoFocus />);
    expect(did.closed, "the editor closed").toBe(1);
    expect(() => checkAway(did)).toThrow("clicking away dropped the typed value");
  });
});
