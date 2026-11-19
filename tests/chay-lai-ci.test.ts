// The database browser runs retry once on CI only (owner, 2026-11-19, _acceptance/ci-co-postgres decisions.jsonl),
// until the two flaky tests are fixed. Lanes never retry, and the main configuration never retries anywhere.
import { readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it, vi } from "vitest";

const ROOT = join(import.meta.dirname, "..");

interface Retries {
  dbOnCi: number;
  dbOnLane: number;
  mainOnCi: number;
}

/** The retries a configuration file gives under an environment; a missing key is 0, as Playwright reads it. */
async function retriesOf(file: string, ci: string | undefined): Promise<number> {
  const saved = { ...process.env };
  const cwd = process.cwd();
  try {
    if (ci === undefined) delete process.env["CI"];
    else process.env["CI"] = ci;
    process.chdir(ROOT);
    vi.resetModules();
    const mod = (await import(file)) as { default: { retries?: number } };
    return mod.default.retries ?? 0;
  } finally {
    process.chdir(cwd);
    process.env = saved;
  }
}

/** One line per broken promise: `chay-lai: <where> <what>`. */
export function retryProblems(r: Retries): string[] {
  const out: string[] = [];
  if (r.dbOnCi !== 1) out.push(`chay-lai: cau hinh db tren CI chay lai ${r.dbOnCi} lan, can 1`);
  if (r.dbOnLane !== 0) out.push(`chay-lai: cau hinh db tren may chay lai ${r.dbOnLane} lan, can 0`);
  if (r.mainOnCi !== 0) out.push(`chay-lai: cau hinh chinh tren CI chay lai ${r.mainOnCi} lan, can 0`);
  return out;
}

async function measure(dbFile: string): Promise<Retries> {
  return {
    dbOnCi: await retriesOf(dbFile, "true"),
    dbOnLane: await retriesOf(dbFile, undefined),
    mainOnCi: await retriesOf(join(ROOT, "playwright.config.ts"), "true"),
  };
}

describe("chay lai mot lan chi tren CI, chi cau hinh db", () => {
  it("cau hinh that: db 1 lan tren CI, 0 o may; cau hinh chinh 0", async () => {
    expect(await measure(join(ROOT, "playwright.db.config.ts"))).toEqual({
      dbOnCi: 1,
      dbOnLane: 0,
      mainOnCi: 0,
    });
    expect(retryProblems(await measure(join(ROOT, "playwright.db.config.ts")))).toEqual([]);
  });

  it("pha: ban sao cau hinh db chay lai ca o may thi bi bat", async () => {
    const real = readFileSync(join(ROOT, "playwright.db.config.ts"), "utf8");
    const broken = real.replace('retries: process.env["CI"] ? 1 : 0,', "retries: 1,");
    expect(broken).not.toBe(real);
    // Next to the original, so its relative imports resolve the same way.
    const copy = join(ROOT, `.chay-lai-pha-${process.pid}.db.config.ts`);
    writeFileSync(copy, broken);
    try {
      expect(retryProblems(await measure(copy))).toEqual([
        "chay-lai: cau hinh db tren may chay lai 1 lan, can 0",
      ]);
    } finally {
      rmSync(copy, { force: true });
    }
  });
});
