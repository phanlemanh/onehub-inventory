// Row 1s (_acceptance/ci-co-postgres, AC-7, E7): CI checks out shallow, so no test it runs may read an old commit from
// git history. Two parts:
//   1. the copies of the isolation runner at d85d815 and 83d1764 (tests/fixtures) are byte-exact: their git blob id,
//      computed here without git, equals the blob id recorded when they were copied;
//   2. no test or tool CI runs calls `git show`, `git log` or `git rev-parse <commit>` — with a red case in a copy.
import { createHash } from "node:crypto";
import {
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

/** Recorded when the copies were made: `git rev-parse <commit>:db/scripts/cach-ly.sh`. */
const BLOBS: Record<string, string> = {
  "tests/fixtures/cach-ly-d85d815.sh": "9838bcec9edc334d14fde3f00e11e5d6a17cdfe9",
  "tests/fixtures/cach-ly-83d1764.sh": "10817856c9a165790b17fd59d473c9316fba4e92",
};

/** The git blob id of a file's bytes, the way `git hash-object` computes it. */
export function blobId(bytes: Buffer): string {
  return createHash("sha1")
    .update(Buffer.concat([Buffer.from(`blob ${bytes.length}\0`), bytes]))
    .digest("hex");
}

/** Copies whose bytes no longer match the recorded blob id. */
export function changedCopies(root: string, blobs: Record<string, string> = BLOBS): string[] {
  return Object.entries(blobs)
    .filter(([file, id]) => blobId(readFileSync(join(root, file))) !== id)
    .map(([file]) => `ban chep lech ma blob: ${file}`);
}

/** What CI runs: every test and tool folder, the database scripts, both Playwright configurations. */
const SCAN = ["tests", "tools", "db/scripts", "playwright.config.ts", "playwright.db.config.ts"];
const EXT = /\.(ts|tsx|mjs|cjs|js|sh|py)$/;
const SKIP_DIR = new Set(["node_modules", "fixtures", "__pycache__", ".pytest_cache"]);

/**
 * Callers that read an old commit but fall back when the history is missing, each with its reason. A caller here must
 * still pass in the shallow clone of `db/scripts/ci-thu.sh`, which runs `make check` there.
 */
const FALLS_BACK: Record<string, string> = {
  "tests/danh-muc-chuyen-mau.test.ts":
    "snapshotFromGit tra null khi ban sao khong co lich su; bai doc anh chup cua cung commit",
};

/** A call that reads git history: `git show` / `git log` as a command or an argument list, `rev-parse <hex>`. */
const HISTORY = [
  /["'`]git["'`]\s*,\s*\[\s*["'`](show|log)["'`]/,
  /\bgit\(\s*["'`](show|log)["'`]/,
  /\bgit\s+(show|log)\s/,
  /rev-parse["'`]?\s*,?\s*["'`]?[0-9a-f]{7,40}\b/,
];

function files(root: string, entry: string): string[] {
  const path = join(root, entry);
  let st;
  try {
    st = statSync(path);
  } catch {
    return [];
  }
  if (st.isFile()) return EXT.test(path) ? [entry] : [];
  return readdirSync(path)
    .filter((name) => !SKIP_DIR.has(name))
    .flatMap((name) => files(root, join(entry, name)));
}

/** Every `<file>:<line>` under `scan` that reads git history, outside comments and the fall-back list. */
export function historyCalls(
  root: string,
  scan: string[] = SCAN,
  fallsBack: Record<string, string> = FALLS_BACK,
): string[] {
  const out: string[] = [];
  for (const file of scan.flatMap((e) => files(root, e))) {
    const rel = relative(root, join(root, file));
    if (fallsBack[rel]) continue;
    readFileSync(join(root, file), "utf8")
      .split("\n")
      .forEach((line, i) => {
        const code = line.trim();
        if (code.startsWith("//") || code.startsWith("*") || code.startsWith("#")) return;
        if (HISTORY.some((re) => re.test(line))) out.push(`goi lich su git: ${rel}:${i + 1}`);
      });
  }
  return out;
}

describe("ban sao nong: ban chep bo chay cach ly dung tung byte (AC-7)", () => {
  it("hai ban chep co ma blob bang ma ghi luc chep", () => {
    expect(changedCopies(ROOT)).toEqual([]);
  });

  it("pha: doi mot byte cua ban chep thi bai neu ten tep", () => {
    const dir = mkdtempSync(join(tmpdir(), "ban-sao-nong-"));
    try {
      mkdirSync(join(dir, "tests/fixtures"), { recursive: true });
      for (const file of Object.keys(BLOBS)) {
        writeFileSync(join(dir, file), readFileSync(join(ROOT, file)));
      }
      const file = "tests/fixtures/cach-ly-83d1764.sh";
      const bytes = readFileSync(join(dir, file));
      bytes[0] = bytes[0] === 0x23 ? 0x20 : 0x23;
      writeFileSync(join(dir, file), bytes);
      expect(changedCopies(dir)).toEqual([`ban chep lech ma blob: ${file}`]);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});

describe("ban sao nong: khong bai nao CI chay doc lich su git (AC-7)", () => {
  it("quet tests, tools, db/scripts va hai cau hinh Playwright: khong loi goi nao", () => {
    expect(historyCalls(ROOT)).toEqual([]);
  });

  it("moi tep trong danh sach du phong con ton tai", () => {
    for (const file of Object.keys(FALLS_BACK))
      expect(statSync(join(ROOT, file)).isFile()).toBe(true);
  });

  it("pha: mot tep tests/*.test.ts doc lich su toi commit cu thi bai neu dung tep va dong", () => {
    const dir = mkdtempSync(join(tmpdir(), "ban-sao-nong-"));
    try {
      mkdirSync(join(dir, "tests"), { recursive: true });
      // Built from pieces so this file does not hold the patterns it scans for.
      const g = ["g", "it"].join("");
      writeFileSync(
        join(dir, "tests/x.test.ts"),
        [
          `// ${g} show abc1234:a.sh in a comment is fine`,
          `const a = execFileSync("${g}", ["show", "abc1234:db/scripts/cach-ly.sh"]);`,
          "const b = 1;",
        ].join("\n"),
      );
      writeFileSync(join(dir, "tests/y.sh"), `base=$(${g} show d85d815:db/scripts/cach-ly.sh)\n`);
      writeFileSync(
        join(dir, "tests/z.test.ts"),
        `${g}("rev-parse", "${["83d", "1764"].join("")}")\n`,
      );
      writeFileSync(
        join(dir, "tests/ok.test.ts"),
        `const top = ${g}("rev-parse", "--show-toplevel");\n`,
      );
      expect(historyCalls(dir, ["tests"], {})).toEqual([
        "goi lich su git: tests/x.test.ts:2",
        "goi lich su git: tests/y.sh:1",
        "goi lich su git: tests/z.test.ts:1",
      ]);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("doi chung: cach-ly.db.test.ts hom nay doc ban chep, khong doc lich su", () => {
    const text = readFileSync(join(ROOT, "tests/db/cach-ly.db.test.ts"), "utf8");
    expect(text).toContain("runnerCopy(RUNNER_BASE)");
    expect(text).toContain("runnerCopy(RUNNER_BASE_7C)");
  });
});
