// Guard against temporary folders that outlive the test run. On 2026-11-14 the tests' own leftovers in the system's
// temporary folder (about 77 000 folders, 200 GB) filled the disk. A test makes its temporary folder through
// `tempDir()` in tests/support/temp-dir.ts, which removes it when the test file ends; Python uses
// `TemporaryDirectory`, and a shell script that runs `mktemp -d` removes the folder in a `trap`.
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { tempDir } from "./support/temp-dir";
import { ROOT_PREFIX, staleRoots } from "./support/temp-root";

const HELPER = "tests/support/temp-dir.ts";
const RUN_ROOT = "tests/support/temp-root.ts"; // makes the run's own root, removed at teardown
const GUARD = "tests/temp-dir-guard.test.ts"; // its breaking cases are text, not calls

/** Files that make a temporary folder on their own on purpose, and why that folder does not stay behind. */
const ALLOWED: Record<string, string> = {
  // A plain node script, not a vitest file: the folder is a git worktree, removed with `git worktree remove` in its
  // own `finally` and when building it fails.
  "tests/e2e-db/pha-thu-vai-man.mjs": "git worktree removed in finally",
  // The report folder is the script's output, kept on purpose and printed; the tests pass CI_DB_OUT inside their own
  // temporary folder.
  "db/scripts/ci-db.sh": "report folder is the output",
};

/**
 * T3 paths of _acceptance/config.yaml: a change there needs a signed acceptance record, and
 * tools/proof_gate/proof-gate.test.ts is also hash-pinned. Their tests are not moved to the helper here; the folders
 * they make live under the run's own temporary root (tests/support/temp-root.ts), removed when the run ends.
 */
const SIGNED_PATHS = ["tools/", "src/modules/identity/", "db/"];

const SCRIPT = /\.(ts|tsx|mts|js|mjs|cjs)$/;
const IN_SCOPE = /(^|\/)(tests|tools|db)\/|\.test\.(ts|tsx|mjs|js)$/;

/** Why `text` (the content of `path`) breaks the rule, or null when it keeps it. */
function violation(path: string, text: string): string | null {
  if ([HELPER, RUN_ROOT, GUARD].includes(path) || path in ALLOWED) return null;
  if (SIGNED_PATHS.some((p) => path.startsWith(p)) && !path.endsWith(".sh")) return null;
  if (SCRIPT.test(path)) {
    if (/\bmkdtemp(Sync)?\s*\(/.test(text)) return "mkdtemp outside tempDir()";
    if (/mkdirSync\(\s*join\(\s*tmpdir\(\)/.test(text))
      return "folder in tmpdir() outside tempDir()";
    return null;
  }
  if (path.endsWith(".py")) {
    if (/\b(tempfile\.)?mkdtemp\s*\(/.test(text))
      return "tempfile.mkdtemp instead of TemporaryDirectory";
    return null;
  }
  if (path.endsWith(".sh")) {
    if (/\bmktemp\s+(-\w*d|--directory)/.test(text) && !/^\s*trap\s/m.test(text))
      return "mktemp -d without a trap that removes it";
    return null;
  }
  return null;
}

function trackedFiles(): string[] {
  return execFileSync("git", ["ls-files", "-z"], { encoding: "utf8" })
    .split("\0")
    .filter(
      (p) =>
        p && IN_SCOPE.test(p) && !p.startsWith("node_modules/") && !p.startsWith("_acceptance/"),
    )
    .filter((p) => SCRIPT.test(p) || p.endsWith(".py") || p.endsWith(".sh"));
}

describe("temporary folders are removed after the test run", () => {
  it("no test, tool or db script makes a temporary folder outside the shared helper", () => {
    const found = trackedFiles()
      .map((p) => {
        let text: string;
        try {
          text = readFileSync(p, "utf8");
        } catch {
          return null; // deleted in the working tree
        }
        const why = violation(p, text);
        return why ? `${p}: ${why}` : null;
      })
      .filter(Boolean);
    expect(found).toEqual([]);
  });

  it("the scan reaches tests in src/, tests/, tools/ and db/", () => {
    const files = trackedFiles();
    expect(files).toContain("tests/coverage-matrix.test.ts");
    expect(files).toContain("tools/proof_gate/proof-gate.test.ts");
    expect(files).toContain("src/modules/identity/one-door.test.ts");
    expect(files).toContain("db/scripts/ci-thu.sh");
  });

  it("goes red on a test that makes its own folder (breaking case)", () => {
    const breaks: [string, string][] = [
      ["tests/x.test.ts", 'const d = mkdtempSync(join(tmpdir(), "x-"));'],
      ["src/modules/a/b.test.ts", 'const d = await mkdtemp(join(tmpdir(), "x-"));'],
      ["tests/a.test.mjs", 'mkdirSync(join(tmpdir(), "fixed-name"));'],
      ["tests/a/check.py", 'root = tempfile.mkdtemp(prefix="x-")'],
      ["db/scripts/x.sh", 'tmp=$(mktemp -d "${TMPDIR:-/tmp}/x.XXXXXX")\necho "$tmp"\n'],
    ];
    for (const [path, text] of breaks) expect(violation(path, text), path).not.toBeNull();
  });

  it("stays green on the helper, TemporaryDirectory and a shell trap", () => {
    const clean: [string, string][] = [
      ["tests/x.test.ts", 'const d = tempDir("x-");'],
      [HELPER, "const dir = mkdtempSync(join(tmpdir(), prefix));"],
      // A signed path: left to the run's temporary root, see SIGNED_PATHS.
      ["tools/a/a.test.ts", 'const d = mkdtempSync(join(tmpdir(), "x-"));'],
      ["tools/a/check.py", "with tempfile.TemporaryDirectory() as d:\n    pass\n"],
      ["db/scripts/x.sh", "tmp=$(mktemp -d)\ntrap 'rm -rf \"$tmp\"' EXIT\n"],
    ];
    for (const [path, text] of clean) expect(violation(path, text), path).toBeNull();
  });

  it("the paths left to the run's root are exactly signed paths of the acceptance config", () => {
    const config = readFileSync("_acceptance/config.yaml", "utf8");
    for (const p of SIGNED_PATHS) expect(config, p).toContain(`- "${p}**"`);
  });

  it("every vitest config gives the run its own temporary root", () => {
    for (const config of ["vitest.config.ts", "vitest.db.config.ts"])
      expect(readFileSync(config, "utf8"), config).toContain(
        'globalSetup: ["tests/support/temp-root.ts"]',
      );
  });

  it("a later run removes only roots of runs that are gone", () => {
    const base = tempDir("temp-root-");
    const gone = `${ROOT_PREFIX}999999999-abc`; // no such process
    const live = `${ROOT_PREFIX}${process.ppid}-abc`;
    for (const name of [gone, live, "proof-gate-abc", `${ROOT_PREFIX}x`])
      mkdirSync(join(base, name));
    expect(staleRoots(base)).toEqual([join(base, gone)]);
  });

  it("the helper removes its folders when the file ends", () => {
    const helper = readFileSync(HELPER, "utf8");
    expect(helper).toMatch(/afterAll\(removeAll\)/);
    expect(helper).toMatch(/process\.once\("exit", removeAll\)/);
  });
});
