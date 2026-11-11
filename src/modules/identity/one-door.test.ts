// One query door, source layer (AC-8, E8). "A query" here means opening a connection or running a statement
// straight on a pool, or building a new Pool or Client. Statements run on the client that withCompany hands over
// (already switched to quy_hang_app) go through the door and are not counted.
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
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

// Type arguments (`query<Row>(`), optional chaining (`pool?.query(`) and spaces before `(` count too.
const POOL_CALL =
  /\b\w*[Pp]ool\??\.(?:query|connect)\s*(?:<[^>]*>)?\s*\(|new\s+(?:pg\.)?(?:Pool|Client)\s*(?:<[^>]*>)?\s*\(/;

/** The only files allowed to touch a pool: the door itself, and this test (it writes those strings into fixtures). */
const EXEMPT: ReadonlySet<string> = new Set([
  "modules/identity/with-company.ts",
  "modules/identity/one-door.test.ts",
]);

function scanQueries(dir: string, exempt: ReadonlySet<string>): { file: string; line: number }[] {
  const out: { file: string; line: number }[] = [];
  const walk = (d: string) => {
    for (const name of readdirSync(d).sort()) {
      const p = join(d, name);
      if (statSync(p).isDirectory()) walk(p);
      else if (p.endsWith(".ts") || p.endsWith(".tsx")) {
        const rel = relative(dir, p).split("\\").join("/");
        if (exempt.has(rel)) continue;
        readFileSync(p, "utf8")
          .split("\n")
          .forEach((text, i) => {
            if (!text.trim().startsWith("//") && POOL_CALL.test(text)) {
              out.push({ file: rel, line: i + 1 });
            }
          });
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
      "await withCompany(pool, ctx, (tx) => tx.query('select 1'));\n// pool.query('a comment does not count');\n",
    );
    expect(scanQueries(dir, EXEMPT), "a file going through the door is not counted").toEqual([]);

    writeFileSync(join(dir, "routes/hong.ts"), "const r = await appPool.query('select 1');\n");
    writeFileSync(join(dir, "routes/moi.ts"), "import pg from 'pg';\nconst p = new Pool({});\n");
    expect(scanQueries(dir, EXEMPT), "each broken file is named with its line").toEqual([
      { file: "routes/hong.ts", line: 1 },
      { file: "routes/moi.ts", line: 2 },
    ]);
  });

  it("control: typed and optional calls are named too", () => {
    const dir = mkdtempSync(join(tmpdir(), "mot-cua-"));
    writeFileSync(
      join(dir, "typed.ts"),
      [
        "const a = await pool.query<Row>('select 1');",
        "const b = await pool?.query('select 1');",
        "const c = await appPool.connect ();",
        "const d = new pg.Pool<Cfg>({});",
        "const e = new Client ({});",
      ].join("\n") + "\n",
    );
    expect(
      scanQueries(dir, EXEMPT).map((v) => v.line),
      "type arguments, optional chaining and spaces do not hide a pool call",
    ).toEqual([1, 2, 3, 4, 5]);
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
