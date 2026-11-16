// @vitest-environment jsdom
// Row 10 (bang-hang-du-lieu-that), eval E2b, AC-8: the «not allowed» state of the inventory, measured by machine.
// Since Hỏi-1 A every role of a company may view listings, so no real role meets this state on the screen; the owner
// chose on 2026-11-16 to measure it by this test only. It renders the inventory page as the server does, with the
// read door answering «forbidden», and reads what the screen shows: the shared «not allowed» block, no grid, no unit.
// The break case gives the page a failed read instead and shows the check names what broke.
import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { FRAME_COPY } from "../src/components/templates/frame-copy";
import { sampleInventoryData } from "../src/app/(app)/inventory-sample-data";

let answer: "forbidden" | "unreadable" = "forbidden";

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
  myInventory: async () => ({ kind: answer }),
  mySavedViews: async () => null,
  mySavedView: async () => null,
}));
vi.mock("../src/modules/company-config/server", () => ({
  myCompanyLayer: async () => null,
  myFeeSchedule: async () => null,
}));

beforeAll(() => {
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

describe("khong-du-quyen-tren-man (E2b, AC-8)", () => {
  it("khong-du-quyen-tren-man: a read refused for the role draws the «not allowed» block and nothing of the grid", async () => {
    answer = "forbidden";
    expect(await screenFaults()).toEqual([]);
  });

  it("pha-thu-khong-du-quyen: a page that draws the grid's error state instead is named", async () => {
    answer = "unreadable";
    const faults = await screenFaults();
    answer = "forbidden";
    expect(faults[0]).toMatch(/^khong-du-quyen-tren-man: tiêu đề/);
  });
});
