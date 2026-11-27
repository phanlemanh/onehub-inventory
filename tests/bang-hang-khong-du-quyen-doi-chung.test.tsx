// @vitest-environment jsdom
// Row 3g (sua-thong-tin-can), eval E8, AC-8 — debt (d) of row 10: positive controls for the two side checks of
// tests/bang-hang-khong-du-quyen.test.tsx («vẫn có vùng hàng», «lộ mã căn»). Same harness and the same three checks, in a
// file of its own so row 10's signed test stays as it was signed; this file shows each side check turns red on a page
// that does draw the grid and its units. Keep the three checks here word for word with that file.
import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { FRAME_COPY } from "../src/components/templates/frame-copy";
import { sampleInventoryData } from "../src/app/(app)/inventory-sample-data";
import { tallGridViewport } from "./virtual-viewport";

let answer: "forbidden" | "unreadable" | "ready" = "forbidden";

vi.mock("server-only", () => ({}));
vi.mock("next/headers", () => ({ cookies: async () => ({ get: () => undefined }) }));
vi.mock("next/navigation", () => ({
  redirect: () => {
    throw new Error("redirect");
  },
  useRouter: () => ({ refresh: () => {} }),
  usePathname: () => "/inventory",
  useSearchParams: () => new URLSearchParams(),
}));
vi.mock("../src/modules/identity/server", () => ({
  currentSession: async () => ({
    userId: "u",
    name: "[Tên]",
    email: "dau-chu@example.test",
    company: { id: "c", name: "[MAU]" },
    companies: [{ id: "c", name: "[MAU]" }],
    roles: ["ListAgent"],
  }),
  databaseConfigured: () => true,
}));
vi.mock("../src/modules/listings/server", () => ({
  myInventory: async () =>
    answer === "ready" ? { kind: "ready", data: sampleInventoryData() } : { kind: answer },
  mySavedViews: async () => null,
  mySavedView: async () => null,
}));
vi.mock("../src/modules/company-config/server", () => ({
  myCompanyLayer: async () => null,
  myFeeSchedule: async () => null,
}));

beforeAll(() => {
  // The grid draws its rows only in a box with a height; jsdom has none (the reason the side check alone could not fail).
  tallGridViewport();
  // The break case draws the grid, which measures itself and asks for the screen width.
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
  Element.prototype.getAnimations ??= () => [];
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
afterEach(cleanup);

/** What is wrong with the screen the page draws, as pinned lines; none when it is the «not allowed» block alone. */
async function screenFaults(): Promise<string[]> {
  vi.resetModules();
  const { default: Page } = await import("../src/app/(app)/inventory/page");
  const { container } = render(await Page({ searchParams: Promise.resolve({}) }));
  const out: string[] = [];
  const heading = container.querySelector("h1")?.textContent ?? "";
  if (heading !== FRAME_COPY.forbidden.title)
    out.push(`khong-du-quyen-tren-man: tiêu đề «${heading}»`);
  if (container.querySelector('[data-slot="data-region"]'))
    out.push("khong-du-quyen-tren-man: vẫn có vùng hàng");
  const text = container.textContent ?? "";
  const units = sampleInventoryData().units.map((u) => u.unitNumber);
  if (units.some((u) => text.includes(u))) out.push("khong-du-quyen-tren-man: lộ mã căn");
  return out;
}

describe("doi-chung (E8, AC-8)", () => {
  it("doi-chung-co-vung-hang · doi-chung-co-ma-can: a page that draws the grid trips both side checks", async () => {
    answer = "ready";
    const faults = await screenFaults();
    answer = "forbidden";
    expect(faults, "doi-chung-co-vung-hang").toContain("khong-du-quyen-tren-man: vẫn có vùng hàng");
    expect(faults, "doi-chung-co-ma-can").toContain("khong-du-quyen-tren-man: lộ mã căn");
  });

  it("the forbidden page itself still passes the three checks", async () => {
    answer = "forbidden";
    expect(await screenFaults()).toEqual([]);
  });
});
