// Row 1u, AC-1 and AC-2: a browser run never picks a port Chrome refuses, and E2E_PORT / E2E_DB_PORT still win.
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { afterAll, describe, expect, it, vi } from "vitest";

import { CHROME_BLOCKED_PORTS, chonCong, KHOANG_E2E, KHOANG_E2E_DB } from "./e2e/cong-chay";

const ROOT = join(__dirname, "..");
const RUN = `vitest-cong-chay-${process.pid}`;

/** A digest whose first two bytes, read big-endian, are `n`. */
function digestOf(n: number): Buffer {
  const b = Buffer.alloc(20);
  b.writeUInt16BE(n, 0);
  return b;
}

/** Every port a picker gives over every hash value that lands in a range of `size`; the problems found. */
function sweep(pick: (d: Buffer) => number, first: number, size: number): string[] {
  const problems: string[] = [];
  for (let n = 0; n < size; n += 1) {
    const port = pick(digestOf(n));
    if (CHROME_BLOCKED_PORTS.has(port)) problems.push(`cong-chay: ${port} la cong Chrome tu choi`);
    if (port < first || port > first + size - 1)
      problems.push(`cong-chay: ${port} ngoai khoang ${first}-${first + size - 1}`);
  }
  return problems;
}

describe("cong-chay · the shared port picker", () => {
  it("lists the three refused ports inside the two ranges", () => {
    for (const port of [3659, 4045, 4190]) expect(CHROME_BLOCKED_PORTS.has(port)).toBe(true);
  });

  for (const [name, k] of [
    ["e2e 3500-3899", KHOANG_E2E],
    ["e2e-db 4000-4899", KHOANG_E2E_DB],
  ] as const) {
    it(`gives an accepted port inside ${name} for every hash value`, () => {
      expect(sweep((d) => chonCong(d, k.first, k.size), k.first, k.size)).toEqual([]);
    });
  }

  it("break: the old formula without the filter picks the refused ports", () => {
    const old = (first: number, size: number) => (d: Buffer) => first + (d.readUInt16BE(0) % size);
    expect(
      sweep(old(KHOANG_E2E.first, KHOANG_E2E.size), KHOANG_E2E.first, KHOANG_E2E.size),
    ).toEqual(["cong-chay: 3659 la cong Chrome tu choi"]);
    expect(
      sweep(old(KHOANG_E2E_DB.first, KHOANG_E2E_DB.size), KHOANG_E2E_DB.first, KHOANG_E2E_DB.size),
    ).toEqual(["cong-chay: 4045 la cong Chrome tu choi", "cong-chay: 4190 la cong Chrome tu choi"]);
  });

  it("break: a picker that leaves the range is caught", () => {
    expect(sweep(() => 3900, 3500, 400)[0]).toBe("cong-chay: 3900 ngoai khoang 3500-3899");
  });
});

// ── AC-2: the configurations, loaded for real ───────────────────────────────────────────────────────────────────

type Loaded = { webServer: { command: string }; use: { baseURL: string } };

const CONFIGS = [
  { file: "playwright.config.ts", env: "E2E_PORT", runEnv: "E2E_RUN", salt: "", k: KHOANG_E2E },
  {
    file: "playwright.db.config.ts",
    env: "E2E_DB_PORT",
    runEnv: "E2E_DB_RUN",
    salt: ":db",
    k: KHOANG_E2E_DB,
  },
] as const;

const copies: string[] = [];
afterAll(() => {
  for (const f of copies) rmSync(f, { force: true });
  rmSync(join(ROOT, "node_modules", ".cache", "onehub-e2e", RUN), { recursive: true, force: true });
  rmSync(join(ROOT, "node_modules", ".cache", "onehub-e2e-db", RUN), {
    recursive: true,
    force: true,
  });
});

/** Load a configuration file with the given environment; the port its dev server and its pages use. */
async function load(
  file: string,
  env: Record<string, string | undefined>,
): Promise<{ server: number; base: number }> {
  const saved = { ...process.env };
  const cwd = process.cwd();
  try {
    for (const [k, v] of Object.entries(env)) {
      if (v === undefined) delete process.env[k];
      else process.env[k] = v;
    }
    process.chdir(ROOT);
    vi.resetModules();
    const mod = (await import(join(ROOT, file))) as { default: Loaded };
    const server = Number(/-p (\d+)/.exec(mod.default.webServer.command)?.[1]);
    const base = Number(new URL(mod.default.use.baseURL).port);
    return { server, base };
  } finally {
    process.chdir(cwd);
    process.env = saved;
  }
}

/** The port the shared picker gives the configuration for this run. */
function expected(c: (typeof CONFIGS)[number]): number {
  const digest = createHash("sha1")
    .update(`${ROOT}:${c.salt ? "db:" : ""}${RUN}`)
    .digest();
  return chonCong(digest, c.k.first, c.k.size);
}

/** The problems of one configuration file: the override must win, and without it the shared picker decides. */
async function checkConfig(c: (typeof CONFIGS)[number], file: string = c.file): Promise<string[]> {
  const problems: string[] = [];
  const over = await load(file, { [c.env]: "4999", [c.runEnv]: RUN });
  if (over.server !== 4999 || over.base !== 4999) problems.push(`cong-chay: ${c.env} khong thang`);
  const plain = await load(file, { [c.env]: undefined, [c.runEnv]: RUN });
  const want = expected(c);
  if (plain.server !== want || plain.base !== want)
    problems.push(`cong-chay: ${c.file} khong dung chonCong`);
  return problems;
}

describe("cong-chay · both configurations", () => {
  for (const c of CONFIGS) {
    it(`${c.file}: ${c.env} wins, and without it the port is the shared picker's`, async () => {
      expect(await checkConfig(c)).toEqual([]);
    }, 30_000);
  }

  it("break: a copy where the picker wins over the override is caught", async () => {
    const c = CONFIGS[0];
    const copy = join(ROOT, `.cong-chay-pha-${process.pid}.config.ts`);
    copies.push(copy);
    const src = readFileSync(join(ROOT, c.file), "utf8").replace(
      'Number(process.env["E2E_PORT"] ?? chonCong(digest, KHOANG_E2E.first, KHOANG_E2E.size))',
      'Number(chonCong(digest, KHOANG_E2E.first, KHOANG_E2E.size) ?? process.env["E2E_PORT"])',
    );
    expect(src).toContain("?? process.env");
    writeFileSync(copy, src);
    expect(await checkConfig(c, copy.slice(ROOT.length + 1))).toContain(
      "cong-chay: E2E_PORT khong thang",
    );
  }, 30_000);
});

// ── AC-2: no other place works a port out of a hash ─────────────────────────────────────────────────────────────

const PORT_ARITHMETIC = /readUInt16BE\(0\)\s*%/;

/** Tracked source files, other than the picker itself, that compute a port from a hash. */
function portArithmetic(files: string[], read: (f: string) => string): string[] {
  return files
    .filter((f) => f !== "tests/e2e/cong-chay.ts" && f !== "tests/cong-chay.test.ts")
    .filter((f) => PORT_ARITHMETIC.test(read(f)))
    .map((f) => `cong-chay: ${f} tinh cong ngoai ham chung`);
}

describe("cong-chay · one place computes the port", () => {
  const files = execFileSync(
    "git",
    ["ls-files", "*.ts", "*.mjs", "*.cjs", "*.js", "*.sh", "*.py"],
    {
      cwd: ROOT,
      encoding: "utf8",
    },
  )
    .split("\n")
    .filter((f) => f && !f.startsWith("_acceptance/"));

  it("only the shared picker reads a port out of a hash", () => {
    expect(portArithmetic(files, (f) => readFileSync(join(ROOT, f), "utf8"))).toEqual([]);
  });

  it("break: a configuration back on the old formula is caught", () => {
    const old = readFileSync(join(ROOT, "playwright.config.ts"), "utf8").replace(
      "chonCong(digest, KHOANG_E2E.first, KHOANG_E2E.size)",
      "3500 + (digest.readUInt16BE(0) % 400)",
    );
    expect(portArithmetic(["playwright.config.ts"], () => old)).toEqual([
      "cong-chay: playwright.config.ts tinh cong ngoai ham chung",
    ]);
  });
});

// ── AC-5: both configurations mount the hydration guard ─────────────────────────────────────────────────────────

/** The problems of a loaded configuration: its reporters must include the hydration guard. */
function guardProblems(file: string, reporter: unknown): string[] {
  const list = Array.isArray(reporter) ? reporter : [[reporter]];
  const names = list.map((r) => (Array.isArray(r) ? String(r[0]) : String(r)));
  return names.some((n) => n.endsWith("tests/e2e/gac-hydration.ts"))
    ? []
    : [`gac-hydration: ${file} thieu bo bao cao`];
}

describe("gac-hydration · both configurations mount the guard", () => {
  for (const c of CONFIGS) {
    it(`gac-hydration: ${c.file} lists the guard among its reporters`, async () => {
      process.env[c.runEnv] = RUN;
      vi.resetModules();
      const cwd = process.cwd();
      process.chdir(ROOT);
      try {
        const mod = (await import(join(ROOT, c.file))) as { default: { reporter: unknown } };
        expect(guardProblems(c.file, mod.default.reporter)).toEqual([]);
      } finally {
        process.chdir(cwd);
      }
    }, 30_000);
  }

  it("gac-hydration: break — a configuration without the guard is caught", () => {
    expect(guardProblems("playwright.db.config.ts", "list")).toEqual([
      "gac-hydration: playwright.db.config.ts thieu bo bao cao",
    ]);
  });
});
