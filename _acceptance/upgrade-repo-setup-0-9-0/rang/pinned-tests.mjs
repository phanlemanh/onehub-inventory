// AC-8: the three tests that pinned the old CI pass on HEAD and go red on four broken copies.
// Usage: node pinned-tests.mjs [--root <dir>]

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { root, run, verdict, worktree } from "./lib.mjs";

const NAME = "pinned-tests";
const dir = root();
const problems = [];
const TESTS = ["tests/ci-yml-patch.test.ts", "tests/ci-ban-sao-nong.test.ts", "tests/coverage-matrix.test.ts"];

function vitest(at, files) {
  return run("npx", ["vitest", "run", ...files, "--coverage.enabled=false"], { cwd: at });
}

// Each case: what it breaks, the test that must go red, and (optionally) a word the red output names.
const CASES = [
  {
    what: "postgres:15 in e2e-db",
    test: "tests/ci-yml-patch.test.ts",
    edit: (at) => swap(at, ".github/workflows/ci.yml", "image: postgres:16", "image: postgres:15"),
  },
  {
    what: "e2e-db out of check",
    test: "tests/ci-yml-patch.test.ts",
    edit: (at) => swap(at, ".github/workflows/ci.yml", "needs: [quick, e2e, e2e-db]", "needs: [quick, e2e]"),
  },
  {
    what: "coverage-matrix out of CHECK_TARGETS",
    test: "tests/coverage-matrix.test.ts",
    edit: (at) => swap(at, "mk/coverage.mk", "CHECK_TARGETS += coverage-matrix", "OTHER_TARGETS += coverage-matrix"),
  },
  {
    what: "a new git log under tools/",
    test: "tests/ci-ban-sao-nong.test.ts",
    names: "tools/rs090-new.py",
    edit: (at) => writeFileSync(join(at, "tools/rs090-new.py"), 'import subprocess\nsubprocess.run(["git", "log", "-1"])\n'),
  },
];

function swap(at, path, from, to) {
  const p = join(at, path);
  const text = readFileSync(p, "utf8");
  if (!text.includes(from)) throw new Error(`${path} has no "${from}" to break`);
  writeFileSync(p, text.replace(from, to));
}

try {
  const head = vitest(dir, TESTS);
  if (head.code !== 0) problems.push(`on HEAD the three tests are red: ${head.out.split("\n").filter((l) => /FAIL|Tests /.test(l)).join(" | ")}`);
  for (const c of CASES) {
    const wt = worktree(dir, "HEAD");
    try {
      run("ln", ["-s", join(dir, "node_modules"), join(wt.dir, "node_modules")]);
      c.edit(wt.dir);
      const r = vitest(wt.dir, [c.test]);
      if (r.code === 0) problems.push(`${c.what}: ${c.test} stays green`);
      else if (c.names && !(r.out + r.err).includes(c.names)) problems.push(`${c.what}: ${c.test} is red without naming ${c.names}`);
    } finally {
      wt.remove();
    }
  }
} catch (err) {
  problems.push(err.message);
}

verdict(
  NAME,
  problems,
  "the three tests pass on HEAD; postgres:15, e2e-db out of check, coverage-matrix out of CHECK_TARGETS and a new git log under tools/ each turn one of them red",
);
