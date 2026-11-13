// Row 7c (_acceptance/ung-dung-noi-bang-vai-khong-chu/evals.yaml E8c, E9), no database needed.
//   1. Every database test and the browser tests with a database give the product the app's login role: no pool the
//      product uses (createPool, a raw pg.Pool) and no DATABASE_URL of a dev server gets the owner's connection string
//      (`<db>.url`, `DB_URL`). Fixtures still use the owner, through other names.
//   2. .env.example only gains lines: every line it had on the main branch when the row opened is still there, and it
//      has the login-role connection string and PSQL_LOGIN for the CI row (1s).
import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const ENV_BASE = "83d1764";

/** The owner's connection string, as the tests name it. */
const OWNER = String.raw`(?:[\w.]*\.url|DB_URL)\b`;
/** Written before the code: the four ways a product connection could be handed the owner. */
export const OWNER_PATTERNS: [name: string, re: RegExp][] = [
  ["createPool(<…>.url)", new RegExp(String.raw`createPool\(\s*[\w.]*\.url\s*\)`)],
  ["createPool(DB_URL)", new RegExp(String.raw`createPool\(\s*DB_URL\s*\)`)],
  ["DATABASE_URL: <owner>", new RegExp(String.raw`DATABASE_URL\s*:\s*${OWNER}`)],
  [
    "new pg.Pool({ connectionString: <owner>",
    new RegExp(String.raw`new\s+pg\.Pool\(\{\s*connectionString:\s*${OWNER}`),
  ],
];

export interface Hit {
  file: string;
  line: number;
  pattern: string;
}

export function scanOwnerConnections(files: { file: string; text: string }[]): Hit[] {
  const hits: Hit[] = [];
  for (const { file, text } of files)
    text.split("\n").forEach((line, i) => {
      for (const [pattern, re] of OWNER_PATTERNS)
        if (re.test(line)) hits.push({ file, line: i + 1, pattern });
    });
  return hits;
}

function filesUnder(dir: string): string[] {
  return readdirSync(join(ROOT, dir), { recursive: true, withFileTypes: true })
    .filter((d) => d.isFile() && d.name.endsWith(".ts"))
    .map((d) => relative(ROOT, join(d.parentPath, d.name)));
}

function scanned(): { file: string; text: string }[] {
  return [...filesUnder("tests/db"), ...filesUnder("tests/e2e-db"), "playwright.db.config.ts"].map(
    (file) => ({ file, text: readFileSync(join(ROOT, file), "utf8") }),
  );
}

describe("product connections in tests use the login role (E8c)", () => {
  it("the real tree hands the owner to no product pool and no DATABASE_URL", () => {
    const files = scanned();
    expect(files.length).toBeGreaterThan(10);
    expect(scanOwnerConnections(files)).toEqual([]);
  });

  const breaks: [string, string][] = [
    ["createPool(<…>.url)", "  const pool = createPool(db.url);"],
    ["createPool(DB_URL)", "const p = createPool(DB_URL);"],
    ["DATABASE_URL: <owner>", "      DATABASE_URL: DB_URL,"],
    [
      "new pg.Pool({ connectionString: <owner>",
      "  const raw = new pg.Pool({ connectionString: v.db.url, max: 2 });",
    ],
  ];
  for (const [pattern, line] of breaks)
    it(`break: a copy with «${line.trim()}» is named by file and line`, () => {
      const file = "tests/db/ban-sao.db.test.ts";
      const text = `// a copy\nimport pg from "pg";\n${line}\n`;
      expect(scanOwnerConnections([{ file, text }])).toEqual([{ file, line: 3, pattern }]);
    });

  it("control: the login-role names are not hits", () => {
    const text = [
      "createPool(db.appUrl);",
      "DATABASE_URL: APP_DB_URL,",
      "DATABASE_URL: w.db.appUrl,",
      "new pg.Pool({ connectionString: v.db.appUrl, max: 2 });",
      "const owner = new pg.Client({ connectionString: DB_URL });",
    ].join("\n");
    expect(scanOwnerConnections([{ file: "x.ts", text }])).toEqual([]);
  });
});

/** Lines of `base` missing from `now`, each with its line number in `base`. Blank lines do not count. */
export function droppedLines(base: string, now: string): string[] {
  const have = new Set(now.split("\n"));
  return base
    .split("\n")
    .map((l, i) => [l, i + 1] as const)
    .filter(([l]) => l.trim() !== "" && !have.has(l))
    .map(([l, n]) => `${n}: ${l}`);
}

describe(".env.example only gains lines (E9)", () => {
  const base = execFileSync("git", ["show", `${ENV_BASE}:.env.example`], {
    cwd: ROOT,
    encoding: "utf8",
  });
  const now = readFileSync(join(ROOT, ".env.example"), "utf8");

  it(`every line of .env.example at ${ENV_BASE} is still there`, () => {
    expect(droppedLines(base, now)).toEqual([]);
  });

  it("it names the login role and PSQL_LOGIN", () => {
    expect(now.split("\n").some((l) => l.includes("quy_hang_login"))).toBe(true);
    expect(now.split("\n").some((l) => l.includes("PSQL_LOGIN"))).toBe(true);
  });

  it("break: a copy with one old line removed names that line", () => {
    const victim = "APP_ENV=development";
    expect(base).toContain(victim);
    const n = base.split("\n").indexOf(victim) + 1;
    expect(droppedLines(base, now.replace(`${victim}\n`, ""))).toEqual([`${n}: ${victim}`]);
  });
});
