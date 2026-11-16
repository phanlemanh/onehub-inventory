// Row 10 (bang-hang-du-lieu-that), evals E2b, E3b, E8 (red side) and E9 at unit level: the one source of the inventory,
// the stand-in role only on the sample company, one read per render, and a read that fails becomes «unreadable» rather
// than a thrown page. Each check returns its failures as pinned lines, so a broken copy names what broke.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("next/headers", () => ({ cookies: async () => ({ get: () => undefined }) }));

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const APP = join(ROOT, "src/app");

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return files(path);
    return /\.(ts|tsx)$/.test(name) && !/\.test\./.test(name) ? [path] : [];
  });
}

/** Source files of src/app by path from the repository root, with their text. */
function appSources(): Map<string, string> {
  return new Map(files(APP).map((p) => [relative(ROOT, p), readFileSync(p, "utf8")]));
}

const SAMPLE_CALLS =
  /\b(sampleInventoryData|sampleInventoryRows|sampleInventoryListings|sampleRecords|sampleSearchRows|sampleBuildingPlaces)\(/;
const SAMPLE_FILE = "src/app/(app)/inventory-sample-rows.ts";
const SOURCE_FILE = "src/app/(app)/inventory-source.ts";

/** Files of src/app other than the sample file and the source that call a sample builder. */
function sampleReaders(sources: Map<string, string>): string[] {
  return [...sources]
    .filter(
      ([path, text]) => path !== SAMPLE_FILE && path !== SOURCE_FILE && SAMPLE_CALLS.test(text),
    )
    .map(([path]) => `khong-con-mau-trong-trang: ${path.split("/").pop()}`);
}

describe("khong-con-mau-trong-trang (E2b)", () => {
  it("only the source function calls the sample, and it gives the sample in exactly one of four cases", async () => {
    const sources = appSources();
    expect(sampleReaders(sources)).toEqual([]);
    expect(sources.get(SOURCE_FILE)).toMatch(/sampleInventoryData\(\)/);
    const { sourceKind } = await import("../src/app/(app)/inventory-source");
    const cases = [
      [true, true],
      [true, false],
      [false, true],
      [false, false],
    ] as const;
    const kinds = cases.map(([database, production]) => sourceKind({ database, production }));
    expect(kinds).toEqual(["database", "database", "none", "sample"]);
    expect(kinds.filter((k) => k === "sample")).toHaveLength(1);
  });

  it("pha-thu-doc-mau: a page that reads the sample by itself is named", () => {
    const sources = appSources();
    const page = "src/app/(app)/inventory/page.tsx";
    sources.set(page, `${sources.get(page)}\nconst x = sampleInventoryRows();\n`);
    expect(sampleReaders(sources)).toEqual(["khong-con-mau-trong-trang: page.tsx"]);
  });
});

/** Reads of the ?vai= parameter in src/app outside the stand-in rule (the prototype page of row 9e has its own). */
function standInLeaks(sources: Map<string, string>): string[] {
  const out: string[] = [];
  for (const [path, text] of sources) {
    if (path.includes("/proto/")) continue;
    for (const line of text.split("\n"))
      if (/\bquery\.vai\b|query\["vai"\]/.test(line) && !/standInRole\(/.test(line))
        out.push(`khong-con-vai-thay-phien: ${path.split("/").pop()}`);
  }
  return out;
}

describe("khong-con-vai-thay-phien (E9)", () => {
  it("?vai= is read only through standInRole, which gives a role only on the sample company outside production", async () => {
    expect(standInLeaks(appSources())).toEqual([]);
    const { standInRole } = await import("../src/app/(app)/inventory-source");
    const data = { current: [], earlier: [], listingUnits: [], units: [], keepers: {} };
    const got = [
      standInRole({ kind: "ready", data, live: true }, "TeamLead", "production"),
      standInRole({ kind: "ready", data, live: true }, "TeamLead", "development"),
      standInRole({ kind: "ready", data, live: false }, "TeamLead", "production"),
      standInRole({ kind: "ready", data, live: false }, "TeamLead", "development"),
      standInRole({ kind: "signed-out" }, "TeamLead", "development"),
      standInRole({ kind: "ready", data, live: false }, "Boss", "development"),
    ];
    expect(got).toEqual([null, null, null, "TeamLead", null, null]);
  });

  it("pha-thu-vai-thay-phien: a page that reads ?vai= by itself is named", () => {
    const sources = appSources();
    const page = "src/app/(app)/inventory/page.tsx";
    sources.set(page, `${sources.get(page)}\nconst role = first(query.vai);\n`);
    expect(standInLeaks(sources)).toEqual(["khong-con-vai-thay-phien: page.tsx"]);
  });
});

/** How many reads of the listings one render of the App Shell and the inventory page makes, counted from the code. */
function readsPerRender(sources: Map<string, string>): string[] {
  const layout = sources.get("src/app/(app)/layout.tsx") ?? "";
  const page = sources.get("src/app/(app)/inventory/page.tsx") ?? "";
  const source = sources.get(SOURCE_FILE) ?? "";
  const failures: string[] = [];
  // The read door is called only inside the cached source; every other caller goes through the source.
  const direct = [layout, page].filter((t) => /\bmyInventory\(/.test(t)).length;
  const cached = /export const inventorySource = cache\(/.test(source) ? 1 : 2;
  const reads = direct + (/\binventorySource\(/.test(layout + page) ? cached : 0);
  if (reads !== 1) failures.push(`mot-lan-doc-moi-luot: ${reads} lần`);
  return failures;
}

describe("mot-lan-doc-moi-luot (E3b)", () => {
  it("the App Shell and the inventory page share one read per render", () => {
    expect(readsPerRender(appSources())).toEqual([]);
  });

  it("pha-thu-doc-hai-lan: a layout that calls the read door itself makes two", () => {
    const sources = appSources();
    const layout = "src/app/(app)/layout.tsx";
    sources.set(layout, `${sources.get(layout)}\nawait myInventory();\n`);
    expect(readsPerRender(sources)).toEqual(["mot-lan-doc-moi-luot: 2 lần"]);
  });

  it("pha-thu-khong-gop: a source without React's cache reads once for the shell and once for the page", () => {
    const sources = appSources();
    sources.set(
      SOURCE_FILE,
      (sources.get(SOURCE_FILE) ?? "").replace(
        "export const inventorySource = cache(",
        "export const inventorySource = (",
      ),
    );
    expect(readsPerRender(sources)).toEqual(["mot-lan-doc-moi-luot: 2 lần"]);
  });
});

describe("loi-doc-that (E8, red side)", () => {
  it("a database that fails while reading gives «unreadable», never a thrown page", async () => {
    vi.resetModules();
    vi.doMock("@/modules/identity/server", () => ({
      actionDoor: async () => "server-error",
      sessionDoor: async () => ({
        pool: {
          connect: async () => {
            throw new Error("kết nối hỏng");
          },
        },
        ctx: { userId: "u", companyId: "c" },
        scope: "company",
      }),
      withCompany: async (pool: { connect(): Promise<unknown> }) => {
        await pool.connect();
      },
    }));
    const { myInventory } = await import("@/modules/listings/server");
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    await expect(myInventory()).resolves.toEqual({ kind: "unreadable" });
    error.mockRestore();
    vi.doUnmock("@/modules/identity/server");
  });

  it("no session, a role without viewListings and a server fault each give their own kind", async () => {
    for (const [door, kind] of [
      ["unauthenticated", "signed-out"],
      ["forbidden", "forbidden"],
      ["server-error", "unreadable"],
    ] as const) {
      vi.resetModules();
      vi.doMock("@/modules/identity/server", () => ({
        actionDoor: async () => door,
        sessionDoor: async () => door,
        withCompany: async () => undefined,
      }));
      const { myInventory } = await import("@/modules/listings/server");
      await expect(myInventory()).resolves.toEqual({ kind });
      vi.doUnmock("@/modules/identity/server");
    }
  });
});
