// @vitest-environment jsdom
// Row 5 (dan-tu-excel), AC-5 and AC-6: a pasted region is applied once — N writes through the one save door, ONE notice
// with ONE «Hoàn tác» — and undone once, in reverse; a write or an undo that fails is said, never swallowed.
import { cleanup } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { FRAME_COPY } from "@/components/templates/frame-copy";

import { PASTE_COPY } from "./paste-copy";
import { runDoorBatch, type DoorBatch, type DoorBatchWrite, type WriteOutcome } from "./use-change";

const toast = vi.hoisted(() => Object.assign(vi.fn(), { error: vi.fn() }));
vi.mock("sonner", () => ({ toast }));

beforeAll(() => {
  Element.prototype.getAnimations ??= () => [];
  Element.prototype.scrollIntoView ??= () => {};
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

/** A door that keeps one value per cell and logs every write, as the sample door does for the browser tests. */
function cellDoor(answers: Partial<Record<string, WriteOutcome>> = {}) {
  const value = new Map<string, number>();
  const log: string[] = [];
  const save = (cell: string, next: number, answer?: WriteOutcome) =>
    vi.fn(async (): Promise<WriteOutcome> => {
      log.push(`${cell}=${next}`);
      const outcome = answer ?? "saved";
      if (outcome === "saved") value.set(cell, next);
      return outcome;
    });
  const writes = (cells: readonly string[]): DoorBatchWrite[] =>
    cells.map((cell) => ({
      what: `Dòng ${cell} · Cột 1`,
      write: save(cell, 2, answers[cell]),
      undo: save(cell, 1, answers[`undo:${cell}`]),
    }));
  return { value, log, writes };
}

const batch = (writes: DoorBatchWrite[]): DoorBatch => ({
  writes,
  done: (saved) => PASTE_COPY.done(saved, `${saved} dòng`),
  partly: (saved, failed, why) => PASTE_COPY.partly(saved, failed, PASTE_COPY.why[why]),
  noneSaved: (why) => PASTE_COPY.noneSaved(PASTE_COPY.why[why]),
  undone: (count, kept) =>
    kept > 0 ? PASTE_COPY.undoneExcept(count, kept) : PASTE_COPY.undone(count),
  undoFailed: (still, why) => PASTE_COPY.undoFailed(still.join(", "), PASTE_COPY.why[why]),
});

/** Presses the action of the last notice («Hoàn tác» or «Thử lại»). */
async function pressAction(on: typeof toast | typeof toast.error = toast): Promise<void> {
  const options = on.mock.calls.at(-1)?.[1] as { action?: { onClick: () => void } } | undefined;
  expect(options?.action, "the notice offers an action").toBeDefined();
  const before = toast.mock.calls.length + toast.error.mock.calls.length;
  options!.action!.onClick();
  await vi.waitFor(() =>
    expect(toast.mock.calls.length + toast.error.mock.calls.length).toBeGreaterThan(before),
  );
}

describe("ap-mot-lan-n-lan-ghi", () => {
  it("ap-mot-lan-n-lan-ghi: N writes, one notice with one «Hoàn tác»", async () => {
    const door = cellDoor();
    const writes = door.writes(["1101", "1102", "1103"]);
    expect(await runDoorBatch(batch(writes))).toEqual(["saved", "saved", "saved"]);
    expect(door.log, "ap-mot-lan-n-lan-ghi: one write per cell, in order").toEqual([
      "1101=2",
      "1102=2",
      "1103=2",
    ]);
    const notices = toast.mock.calls.length + toast.error.mock.calls.length;
    expect(notices, `ap-mot-lan-n-lan-ghi: ${notices} thông báo`).toBe(1);
    expect(toast.mock.calls[0]![0]).toBe("Đã đổi 3 ô của 3 dòng.");
  });
});

describe("hoan-tac-mot-lan", () => {
  it("hoan-tac-mot-lan: one undo writes every cell back, in reverse order", async () => {
    const door = cellDoor();
    await runDoorBatch(batch(door.writes(["1101", "1102", "1103"])));
    await pressAction();
    expect(door.log.slice(3), "hoan-tac-mot-lan: reverse order").toEqual([
      "1103=1",
      "1102=1",
      "1101=1",
    ]);
    expect([...door.value.values()]).toEqual([1, 1, 1]);
    expect(toast.mock.calls.at(-1)![0]).toBe("Đã hoàn tác 3 ô.");
    expect(toast.error).not.toHaveBeenCalled();
  });

  it("a cell that cannot be undone is kept and named in the count", async () => {
    const door = cellDoor();
    const writes = door.writes(["1101", "1102"]);
    const final = { ...writes[1]!, undo: undefined };
    await runDoorBatch(batch([writes[0]!, final]));
    await pressAction();
    expect(door.log.slice(2)).toEqual(["1101=1"]);
    expect(toast.mock.calls.at(-1)![0]).toBe("Đã hoàn tác 1 ô; 1 ô không hoàn tác được.");
  });
});

/** The three causes of a failed write, written before the build: the cause and the sentence the notice gives. */
const CAUSES: readonly (readonly [WriteOutcome, string])[] = [
  ["offline", "mất kết nối mạng"],
  ["conflict", "dòng vừa đổi từ chỗ khác"],
  ["refused", "không đủ quyền"],
];

describe("ap-hong-mot-phan", () => {
  it("covers three causes", () => expect(CAUSES).toHaveLength(3));
  for (const [cause, words] of CAUSES) {
    it(`ap-hong-mot-phan: ${cause}`, async () => {
      const door = cellDoor({ "1102": cause });
      const outcomes = await runDoorBatch(batch(door.writes(["1101", "1102", "1103"])));
      expect(outcomes, `ap-hong-mot-phan: ${cause}`).toEqual(["saved", cause, "saved"]);
      const said = String(toast.mock.calls.at(-1)?.[0]);
      expect(said, `ap-hong-mot-phan: ${cause} — số ô`).toContain("Đã đổi 2 ô; 1 ô chưa ghi được");
      expect(said, `ap-hong-mot-phan: ${cause} — lý do`).toContain(words);
      // The undo offered covers only the cells that were saved.
      await pressAction();
      expect(door.log.slice(3)).toEqual(["1103=1", "1101=1"]);
    });
  }

  it("nothing saved: one error notice with the reason, no «Hoàn tác»", async () => {
    const door = cellDoor({ "1101": "offline", "1102": "offline" });
    await runDoorBatch(batch(door.writes(["1101", "1102"])));
    expect(toast).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledOnce();
    expect(toast.error.mock.calls[0]![0]).toBe("Chưa ô nào được ghi — mất kết nối mạng.");
  });
});

describe("hoan-tac-hong-bao-ro", () => {
  it("hoan-tac-hong-bao-ro: a failed undo stays, names what still holds the new value, and «Thử lại» finishes", async () => {
    const door = cellDoor({ "undo:1102": "offline" });
    await runDoorBatch(batch(door.writes(["1101", "1102"])));
    await pressAction();
    expect(toast.error, "hoan-tac-hong-bao-ro").toHaveBeenCalledOnce();
    const [message, options] = toast.error.mock.calls[0]! as [
      string,
      { duration: number; action: { label: string } },
    ];
    expect(message, "hoan-tac-hong-bao-ro").toBe(
      "Chưa hoàn tác được — mất kết nối mạng. Vẫn mang giá trị mới: Dòng 1102 · Cột 1.",
    );
    expect(options.duration).toBe(Number.POSITIVE_INFINITY);
    expect(options.action.label).toBe(FRAME_COPY.retry);
    expect(door.value.get("1101")).toBe(1);
    expect(door.value.get("1102")).toBe(2);
  });
});
