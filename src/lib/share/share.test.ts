// Row 3e, E3: every device × outcome cell of openShare, one assertion each (matrix written before the code), and a
// break of the copy path that must turn red.
import { describe, expect, it } from "vitest";

import { openShare, sharedText, type ShareDevice, type ShareOutcome } from ".";

const MESSAGE = { text: "Hỏi về căn 1101 · S1.01", url: "https://x.test/inventory?ho-so=a" };
const abort = () => Object.assign(new Error("cancelled"), { name: "AbortError" });

type Cell = {
  name: string;
  device: () => { device: ShareDevice; copied: string[] };
  outcome: ShareOutcome;
  copies: boolean;
};

function device(share: "none" | "ok" | "abort" | "refuse", clipboard: "none" | "ok" | "throws") {
  const copied: string[] = [];
  const d: ShareDevice = {};
  if (share === "ok") d.share = async () => {};
  if (share === "abort") d.share = async () => Promise.reject(abort());
  if (share === "refuse") d.share = async () => Promise.reject(new Error("NotAllowedError"));
  if (clipboard === "ok") d.clipboard = { writeText: async (t) => void copied.push(t) };
  if (clipboard === "throws")
    d.clipboard = { writeText: async () => Promise.reject(new Error("denied")) };
  return { device: d, copied };
}

const MATRIX: Cell[] = [
  {
    name: "share sheet opens",
    device: () => device("ok", "ok"),
    outcome: "chia-se",
    copies: false,
  },
  {
    name: "person cancels the share sheet",
    device: () => device("abort", "ok"),
    outcome: "huy",
    copies: false,
  },
  {
    name: "device refuses, clipboard works",
    device: () => device("refuse", "ok"),
    outcome: "da-chep",
    copies: true,
  },
  {
    name: "no share sheet, clipboard works",
    device: () => device("none", "ok"),
    outcome: "da-chep",
    copies: true,
  },
  {
    name: "no share sheet, clipboard throws",
    device: () => device("none", "throws"),
    outcome: "loi",
    copies: false,
  },
  {
    name: "neither share sheet nor clipboard",
    device: () => device("none", "none"),
    outcome: "loi",
    copies: false,
  },
];

describe("openShare (row 3e)", () => {
  it("covers six cells", () => expect(MATRIX).toHaveLength(6));

  for (const cell of MATRIX) {
    it(cell.name, async () => {
      const { device: d, copied } = cell.device();
      expect(await openShare(MESSAGE, d)).toBe(cell.outcome);
      expect(copied).toEqual(cell.copies ? [sharedText(MESSAGE)] : []);
    });
  }

  it("copies the link on its own line under the text", () => {
    expect(sharedText(MESSAGE)).toBe(`${MESSAGE.text}\n${MESSAGE.url}`);
    expect(sharedText({ text: "a" })).toBe("a");
  });

  it("calls share before any await, inside the click", async () => {
    const order: string[] = [];
    const d: ShareDevice = { share: async () => void order.push("share") };
    const pending = openShare(MESSAGE, d);
    order.push("after-call");
    await pending;
    expect(order).toEqual(["share", "after-call"]);
  });

  it("break: a copy failure reported as copied turns red", async () => {
    const broken = async (m: typeof MESSAGE, d: ShareDevice): Promise<ShareOutcome> => {
      try {
        await d.clipboard?.writeText(sharedText(m));
      } catch {
        /* swallowed */
      }
      return "da-chep";
    };
    const { device: d } = device("none", "throws");
    const outcome = await broken(MESSAGE, d);
    expect(() => expect(outcome, "copy failure reported as copied").toBe("loi")).toThrow(
      /copy failure reported as copied/,
    );
  });
});
