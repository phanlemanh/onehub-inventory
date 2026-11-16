// Row 10 (bang-hang-du-lieu-that), eval E3b: one render of the App Shell and the inventory page reads the listings once.
// Both are rendered as the server renders them — the layout function, then the page function — and the read door is
// counted. React's cache memoises only inside a server request, which a unit test has none of; it is stood in for by a
// memo that lives for one «request» of this test, and the break case turns the memo off to show the count can go red.
import { describe, expect, it, vi } from "vitest";

import { sampleInventoryData } from "../src/app/(app)/inventory-sample-data";

let reads = 0;
let memo = true;
let request = new Map<unknown, unknown>();

vi.mock("server-only", () => ({}));
vi.mock("react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react")>();
  return {
    ...actual,
    cache:
      <A extends unknown[], R>(fn: (...args: A) => R) =>
      (...args: A): R => {
        if (!memo) return fn(...args);
        if (!request.has(fn)) request.set(fn, fn(...args));
        return request.get(fn) as R;
      },
  };
});
vi.mock("next/headers", () => ({ cookies: async () => ({ get: () => undefined }) }));
vi.mock("next/navigation", () => ({
  redirect: () => {
    throw new Error("redirect");
  },
  useRouter: () => ({ refresh: () => {} }),
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
  myInventory: async () => {
    reads += 1;
    return { kind: "ready", data: sampleInventoryData() };
  },
  mySavedViews: async () => null,
  mySavedView: async () => null,
}));
vi.mock("../src/modules/company-config/server", () => ({
  myCompanyLayer: async () => null,
  myFeeSchedule: async () => null,
}));

/** Renders the layout, then the inventory page, as one request; returns how many times the listings were read. */
async function oneRender(): Promise<number> {
  reads = 0;
  request = new Map();
  const { default: Layout } = await import("../src/app/(app)/layout");
  const { default: Page } = await import("../src/app/(app)/inventory/page");
  await Layout({ children: null });
  await Page({ searchParams: Promise.resolve({}) });
  return reads;
}

describe("mot-lan-doc-moi-luot (E3b)", () => {
  it("mot-lan-doc-moi-luot: the App Shell and the inventory page read the listings once per render", async () => {
    memo = true;
    const n = await oneRender();
    if (n !== 1) throw new Error(`mot-lan-doc-moi-luot: ${n} lần`);
    expect(n).toBe(1);
  });

  it("pha-thu-doc-hai-lan: without the per-request cache the same render reads twice", async () => {
    memo = false;
    const n = await oneRender();
    memo = true;
    expect(`mot-lan-doc-moi-luot: ${n} lần`).toBe("mot-lan-doc-moi-luot: 2 lần");
  });
});
