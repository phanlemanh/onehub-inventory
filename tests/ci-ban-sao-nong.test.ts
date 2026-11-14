// Row 1s (_acceptance/ci-co-postgres, AC-7, E7): CI checks out shallow, so no test it runs may read an old commit from
// git history. Two parts:
//   1. the copies of the isolation runner at d85d815 and 83d1764 (tests/fixtures) are byte-exact: their git blob id,
//      computed here without git, equals the blob id recorded when they were copied;
//   2. no test or tool CI runs reads git history (show, log, cat-file, rev-list, blame, rev-parse <commit>), except the
//      callers listed with their fall-back — with a matrix of call forms and a red case in a copy.
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
  "tools/round_metrics/round_metrics.py":
    "kiem_moc: commit khong co ma kho la kho nong thi ghi 'kho nong: bo qua kiem lich su git' va dung",
};

/**
 * A call that reads git history, as a class: a line that invokes git — the word as a string (`"git"`), a call
 * (`git(`, any arguments before the verb), or a shell command (`git -C dir …`) — and names a history verb anywhere on it:
 * `show`, `log`, `cat-file`, `rev-list`, `blame`, or `rev-parse` with an argument that is not a flag and not HEAD.
 */
const GIT = /["'`]git["'`]|\bgit\s*\(|(^|[\s;|&$(])git\s+[-a-z]/;
const VERB = /(^|[\s"'`,([])(show|log|cat-file|rev-list|blame)(?=[\s"'`,)\]]|$)/;
const REV_PARSE = /rev-parse["'`]?\s*,?\s*(?!["'`]?(-|HEAD\b))["'`$]?[\w${]/;

export function readsHistory(line: string): boolean {
  const code = line.trim();
  if (code.startsWith("//") || code.startsWith("*") || code.startsWith("#")) return false;
  return GIT.test(line) && (VERB.test(line) || REV_PARSE.test(line));
}

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
        if (readsHistory(line)) out.push(`goi lich su git: ${rel}:${i + 1}`);
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

  it("moi tep trong danh sach du phong that su doc lich su (danh sach khong cu)", () => {
    for (const file of Object.keys(FALLS_BACK)) {
      const lines = readFileSync(join(ROOT, file), "utf8").split("\n");
      expect(lines.some(readsHistory), file).toBe(true);
    }
  });

  // The matrix of call forms, written before the scan: every form that reads history is caught, every control is not.
  // Built from pieces so this file does not hold the patterns it scans for.
  const g = ["g", "it"].join("");
  const sha = ["83d", "1764"].join("");
  const READS: [string, string][] = [
    [
      "execFileSync, argument list",
      `execFileSync("${g}", ["show", "${sha}:db/scripts/cach-ly.sh"]);`,
    ],
    ["shell command", `base=$(${g} show d85d815:db/scripts/cach-ly.sh)`],
    ["shell command with -C", `${g} -C "$dir" log --oneline -1 ${sha}`],
    ["argument list with -C", `spawnSync("${g}", ["-C", dir, "show", ref]);`],
    ["helper, verb first", `${g}("show", \`\${commit}:a.sh\`)`],
    ["helper, root first", `${g}(root, "show", f"{commit}:{KHUNG}")`],
    ["cat-file", `${g}(root, "cat-file", "-e", f"{commit}^{{commit}}")`],
    ["rev-list", `subprocess.run(["${g}", "rev-list", "--count", base])`],
    ["blame", `${g} blame -L 1,2 a.ts`],
    ["rev-parse of a literal commit", `${g}("rev-parse", "${sha}")`],
    ["rev-parse of a variable", `${g}("rev-parse", \`\${BIEN}^{commit}\`)`],
    ["python list, rev-parse", `subprocess.run(["${g}", "rev-parse", commit])`],
  ];
  const CONTROLS: [string, string][] = [
    ["comment", `// ${g} show abc1234:a.sh in a comment is fine`],
    ["rev-parse --show-toplevel", `const top = ${g}("rev-parse", "--show-toplevel");`],
    ["rev-parse HEAD", `${g} rev-parse HEAD`],
    ["github, not git", `const url = "https://github.com/a/b/show";`],
    ["a .git folder", `const d = join(root, ".${g}", "log");`],
    ["status", `${g}("status", "--porcelain")`],
  ];

  it("ma tran dang goi: moi dang doc lich su bi bat, moi doi chung khong", () => {
    expect(READS.filter(([, line]) => !readsHistory(line)).map(([name]) => name)).toEqual([]);
    expect(CONTROLS.filter(([, line]) => readsHistory(line)).map(([name]) => name)).toEqual([]);
  });

  it("pha: mot tep tests/*.test.ts doc lich su toi commit cu thi bai neu dung tep va dong", () => {
    const dir = mkdtempSync(join(tmpdir(), "ban-sao-nong-"));
    try {
      mkdirSync(join(dir, "tests"), { recursive: true });
      mkdirSync(join(dir, "tools/m"), { recursive: true });
      writeFileSync(
        join(dir, "tests/x.test.ts"),
        [CONTROLS[0]![1], READS[0]![1], "const b = 1;"].join("\n"),
      );
      writeFileSync(join(dir, "tests/y.sh"), `${READS[1]![1]}\n`);
      writeFileSync(join(dir, "tests/z.test.ts"), `${READS[9]![1]}\n`);
      writeFileSync(join(dir, "tests/ok.test.ts"), `${CONTROLS[1]![1]}\n`);
      writeFileSync(join(dir, "tools/m/m.py"), `x = 1\n${READS[5]![1]}\n`);
      expect(historyCalls(dir, ["tests", "tools"], {})).toEqual([
        "goi lich su git: tests/x.test.ts:2",
        "goi lich su git: tests/y.sh:1",
        "goi lich su git: tests/z.test.ts:1",
        "goi lich su git: tools/m/m.py:2",
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
