// One query door, source layer (AC-8, E8). Two rules, both checked on whole files (not line by line, so a call
// that Prettier breaks over several lines is still seen):
//   1. No file outside the door loads a Postgres driver. Without a driver there is no pool, whatever a variable is
//      called or however a call is written — this is the rule that closes the class.
//   2. No file outside the door opens a connection or runs a statement straight on a pool, or builds a new Pool or
//      Client. Statements run on the client that withCompany hands over (already switched to quy_hang_app) go
//      through the door and are not counted.
// Idea copied from packages/api/src/one-door.test.ts of onehub-quy-hang (commit 1729b11f).
import {
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import { format } from "prettier";
import { describe, expect, it } from "vitest";

/** Postgres drivers and pools. `pg-format` and other helpers that cannot connect are not listed. */
const DRIVER_IMPORT =
  /(?:\bfrom\s*|\bimport\s*\(?\s*|\brequire\s*\(\s*)["'](?:pg|pg-pool|pg-promise|postgres|@neondatabase\/serverless|@vercel\/postgres)(?:\/[^"']*)?["']/g;

/** A call on a pool. Spaces and line breaks around `.`, `?.` and type arguments (also nested) do not hide it. */
const POOL_CALL =
  /\b\w*[Pp]ool\s*\??\.\s*(?:query|connect)\s*(?:<[^()]*>)?\s*\(|\bnew\s+(?:pg\s*\.\s*)?(?:Pool|Client)\s*(?:<[^()]*>)?\s*\(/g;

const SOURCE_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".mts", ".cts"]);

/** The only files allowed to load a driver or touch a pool: the door, and this test (it writes those strings into
 *  fixtures). */
const EXEMPT: ReadonlySet<string> = new Set([
  "modules/identity/with-company.ts",
  "modules/identity/one-door.test.ts",
]);

type Violation = { file: string; line: number };

function scanText(file: string, text: string): Violation[] {
  // Line comments are blanked, not removed, so line numbers stay true.
  const code = text
    .split("\n")
    .map((line) => (line.trim().startsWith("//") ? "" : line))
    .join("\n");
  const lines = new Set<number>();
  for (const pattern of [DRIVER_IMPORT, POOL_CALL]) {
    for (const match of code.matchAll(pattern)) {
      lines.add(code.slice(0, match.index).split("\n").length);
    }
  }
  return [...lines].sort((a, b) => a - b).map((line) => ({ file, line }));
}

function scanQueries(dir: string, exempt: ReadonlySet<string>): Violation[] {
  const out: Violation[] = [];
  const walk = (d: string) => {
    for (const name of readdirSync(d).sort()) {
      const p = join(d, name);
      if (statSync(p).isDirectory()) walk(p);
      else if (SOURCE_EXTENSIONS.has(extname(p))) {
        const rel = relative(dir, p).split("\\").join("/");
        if (!exempt.has(rel)) out.push(...scanText(rel, readFileSync(p, "utf8")));
      }
    }
  };
  walk(dir);
  return out;
}

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = join(HERE, "..", "..");

describe("one query door", () => {
  it("src has no query outside the door", () => {
    expect(scanQueries(SRC, EXEMPT), "có truy vấn ngoài cửa withCompany").toEqual([]);
  });

  it("control: clean file passes, broken files are named", () => {
    const dir = mkdtempSync(join(tmpdir(), "mot-cua-"));
    mkdirSync(join(dir, "routes"));
    writeFileSync(
      join(dir, "routes/lanh.ts"),
      [
        'import { withCompany } from "@/modules/identity/server";',
        'import format from "pg-format";',
        "await withCompany(pool, ctx, (tx) => tx.query('select 1'));",
        "// pool.query('a comment does not count');",
      ].join("\n") + "\n",
    );
    expect(scanQueries(dir, EXEMPT), "a file going through the door is not counted").toEqual([]);

    writeFileSync(join(dir, "routes/hong.ts"), "const r = await appPool.query('select 1');\n");
    writeFileSync(join(dir, "routes/moi.ts"), "const cfg = {};\nconst p = new Pool(cfg);\n");
    expect(scanQueries(dir, EXEMPT), "each broken file is named with its line").toEqual([
      { file: "routes/hong.ts", line: 1 },
      { file: "routes/moi.ts", line: 2 },
    ]);
  });

  it("control: loading a Postgres driver outside the door is named, in every source file type", () => {
    const dir = mkdtempSync(join(tmpdir(), "mot-cua-"));
    writeFileSync(join(dir, "a.ts"), 'import pg from "pg";\n');
    writeFileSync(join(dir, "b.mjs"), 'const x = 1;\nconst { Pool } = await import("postgres");\n');
    writeFileSync(join(dir, "c.cjs"), 'const Pool = require("pg-pool");\n');
    writeFileSync(join(dir, "d.ts"), 'export * from "@neondatabase/serverless";\n');
    writeFileSync(join(dir, "e.mts"), 'import type { QueryResult } from "pg";\n');
    writeFileSync(join(dir, "f.tsx"), 'import "pg/lib/native";\n');
    expect(scanQueries(dir, EXEMPT), "every driver import is named with its line").toEqual([
      { file: "a.ts", line: 1 },
      { file: "b.mjs", line: 2 },
      { file: "c.cjs", line: 1 },
      { file: "d.ts", line: 1 },
      { file: "e.mts", line: 1 },
      { file: "f.tsx", line: 1 },
    ]);
  });

  it("control: typed, nested, optional and spaced calls are named too", () => {
    const dir = mkdtempSync(join(tmpdir(), "mot-cua-"));
    writeFileSync(
      join(dir, "typed.ts"),
      [
        "const a = await pool.query<Row>('select 1');",
        "const b = await pool?.query('select 1');",
        "const c = await appPool.connect ();",
        "const d = new pg.Pool<Cfg>({});",
        "const e = new Client ({});",
        "const f = await pool.query<Array<Record<string, Row>>>('select 1');",
        "const g = new Pool<Foo<Bar>>({});",
      ].join("\n") + "\n",
    );
    expect(
      scanQueries(dir, EXEMPT).map((v) => v.line),
      "type arguments, optional chaining and spaces do not hide a pool call",
    ).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it("control: a call that the repo's Prettier breaks over several lines is named", async () => {
    const dir = mkdtempSync(join(tmpdir(), "mot-cua-"));
    const formatted = await format(
      'const r = await appPool.query("select id, company_id, kind, direction from agreements where status = $1", ["active"]).then((x) => x.rows).catch(() => []);\n',
      { parser: "typescript" },
    );
    expect(formatted, "control: Prettier did break the call").toMatch(/appPool\s*\n\s*\.query/);
    writeFileSync(join(dir, "broken.ts"), formatted);
    expect(scanQueries(dir, EXEMPT), "the call is named at the line of the pool").toEqual([
      { file: "broken.ts", line: 1 },
    ]);
  });

  it("control: a copy of this test outside the exemption is reported", () => {
    const dir = mkdtempSync(join(tmpdir(), "mot-cua-"));
    mkdirSync(join(dir, "x"));
    writeFileSync(
      join(dir, "x/copy.test.ts"),
      readFileSync(fileURLToPath(import.meta.url), "utf8"),
    );
    expect(
      scanQueries(dir, EXEMPT).length,
      "the exemption covers exact paths, not file contents",
    ).toBeGreaterThan(0);
  });
});
