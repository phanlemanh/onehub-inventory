// @vitest-environment jsdom
// Row 4 (sua-tren-o), AC-7: an in-place edit writes through one door; its undo is a write like any other and never
// fails silently. The failures below have the shapes of the real write path: fetch throws TypeError «Failed to
// fetch» when the network is down, the device reports navigator.onLine false, the server answers 403.
import { afterEach, describe, expect, it, vi } from "vitest";

import { FRAME_COPY } from "@/components/templates/frame-copy";
import { runDoorChange, type DoorChange, type WriteOutcome } from "./use-change";

const toast = vi.hoisted(() => Object.assign(vi.fn(), { error: vi.fn() }));
vi.mock("sonner", () => ({ toast }));

/** A door that keeps one price, as the save door does: each write sets it and answers saved. */
function priceDoor(start: number) {
  let price = start;
  const save = vi.fn(async (next: number): Promise<WriteOutcome> => {
    price = next;
    return "saved";
  });
  return { save, price: () => price };
}

afterEach(() => {
  toast.mockReset();
  toast.error.mockReset();
});

/** A write that fails the way the real write path does: it throws. */
const throws = (failure: unknown) => async (): Promise<WriteOutcome> => {
  throw failure;
};

function change(over: Partial<DoorChange>): DoorChange {
  return {
    done: "Đã đổi giá căn 1101: 2,8 tỷ.",
    undone: "Đã hoàn tác: giá căn 1101: 2,71 tỷ.",
    write: async () => "saved",
    undo: async () => "saved",
    failed: () => "Chưa lưu được giá căn 1101 — mất kết nối mạng.",
    undoFailed: () => "Chưa hoàn tác được vì mất kết nối mạng. căn 1101 vẫn là 2,8 tỷ.",
    ...over,
  };
}

/** Presses «Hoàn tác» on the toast that followed the save. */
async function pressUndo(): Promise<void> {
  const options = toast.mock.calls.at(-1)?.[1] as { action?: { onClick: () => void } } | undefined;
  expect(options?.action, "the toast after the save offers «Hoàn tác»").toBeDefined();
  options!.action!.onClick();
  await vi.waitFor(() =>
    expect(toast.mock.calls.length + toast.error.mock.calls.length).toBeGreaterThan(1),
  );
}

describe("hoan-tac-qua-cong-luu", () => {
  it("hoan-tac-qua-cong-luu: undo writes the previous value through the door once", async () => {
    const door = priceDoor(2_710_000_000);
    const write = () => door.save(2_800_000_000);
    const undo = () => door.save(2_710_000_000);
    expect(await runDoorChange(change({ write, undo }))).toBe("saved");
    await pressUndo();
    expect(door.save, "hoan-tac-qua-cong-luu: one save, one undo").toHaveBeenCalledTimes(2);
    expect(door.save).toHaveBeenLastCalledWith(2_710_000_000);
    expect(door.price()).toBe(2_710_000_000);
    expect(
      toast.error,
      "hoan-tac-qua-cong-luu: a good undo says nothing wrong",
    ).not.toHaveBeenCalled();
    expect(toast).toHaveBeenLastCalledWith("Đã hoàn tác: giá căn 1101: 2,71 tỷ.");
  });
});

describe("hoan-tac-hong-bao-ro", () => {
  const shapes: [string, () => Promise<WriteOutcome>][] = [
    ["TypeError Failed to fetch", throws(new TypeError("Failed to fetch"))],
    ["navigator.onLine false", throws(new Error("network down"))],
    ["status 403", throws({ status: 403 })],
  ];
  for (const [shape, undo] of shapes) {
    it(`hoan-tac-hong-bao-ro: ${shape}`, async () => {
      const device =
        shape === "navigator.onLine false"
          ? vi.spyOn(navigator, "onLine", "get").mockReturnValue(false)
          : null;
      await runDoorChange(change({ undo }));
      await pressUndo();
      device?.mockRestore();
      expect(toast.error, `hoan-tac-hong-bao-ro: ${shape}`).toHaveBeenCalledTimes(1);
      const [message, options] = toast.error.mock.calls[0] as [
        string,
        { duration: number; action: { label: string; onClick: () => void } },
      ];
      expect(message, `hoan-tac-hong-bao-ro: ${shape}`).toContain("căn 1101 vẫn là 2,8 tỷ");
      if (shape === "status 403") expect(message).toContain(FRAME_COPY.refusedAction);
      expect(options.action.label, `hoan-tac-hong-bao-ro: ${shape}`).toBe(FRAME_COPY.retry);
      expect(options.duration, `hoan-tac-hong-bao-ro: ${shape} stays`).toBe(
        Number.POSITIVE_INFINITY,
      );
      // «Thử lại» tries the undo again; this time it goes through.
      toast.error.mockReset();
      const again = vi.fn(async (): Promise<WriteOutcome> => "saved");
      await runDoorChange(change({ undo: again }));
      await pressUndo();
      expect(again).toHaveBeenCalledTimes(1);
      expect(toast.error).not.toHaveBeenCalled();
    });
  }

  it("hoan-tac-hong-bao-ro: Thử lại runs the same undo again", async () => {
    let outcome: WriteOutcome = "offline";
    const undo = vi.fn(async () => outcome);
    await runDoorChange(change({ undo }));
    await pressUndo();
    const [, options] = toast.error.mock.calls[0] as [string, { action: { onClick: () => void } }];
    outcome = "saved";
    options.action.onClick();
    await vi.waitFor(() => expect(undo).toHaveBeenCalledTimes(2));
    await vi.waitFor(() =>
      expect(toast).toHaveBeenLastCalledWith("Đã hoàn tác: giá căn 1101: 2,71 tỷ."),
    );
  });
});

describe("luu-hong-ve-cu", () => {
  it("luu-hong-ve-cu: a failed save answers its outcome, says why and offers no undo", async () => {
    const outcome = await runDoorChange(
      change({ write: throws(new TypeError("Failed to fetch")) }),
    );
    expect(outcome, "luu-hong-ve-cu: the screen puts the old value back on this").toBe("offline");
    expect(toast.error).toHaveBeenCalledWith("Chưa lưu được giá căn 1101 — mất kết nối mạng.");
    expect(toast, "luu-hong-ve-cu: no «Đã đổi» after a failed save").not.toHaveBeenCalled();
  });
});

describe("tu-choi-403-cau-rieng", () => {
  it("tu-choi-403-cau-rieng: a refused save gets the refusal sentence", async () => {
    const outcome = await runDoorChange(change({ write: throws({ status: 403 }) }));
    expect(outcome).toBe("refused");
    expect(toast.error, "tu-choi-403-cau-rieng").toHaveBeenCalledWith(
      "Không đủ quyền làm việc này. Tải lại trang để thấy đúng các nút.",
    );
  });

  it("a change that cannot be undone says so and offers no undo", async () => {
    await runDoorChange(
      change({
        undo: undefined,
        done: "Đã đổi trạng thái căn 1101: nấc cuối. Không hoàn tác được.",
      }),
    );
    expect(toast).toHaveBeenCalledWith(
      "Đã đổi trạng thái căn 1101: nấc cuối. Không hoàn tác được.",
    );
    expect(toast.mock.calls[0]).toHaveLength(1);
  });
});
