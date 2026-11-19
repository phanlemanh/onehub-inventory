// E12: each measure is green on a sound copy of HEAD and red, with its pinned message, on a
// broken one. Copies are detached worktrees in a temp dir; nothing here writes to this tree.
// Usage: node --test two-way.mjs

import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, test } from "node:test";

import { HERE, applyPy, git, root, run, worktree } from "./lib.mjs";
import { BASE, RENAME } from "./matrix.mjs";

const ROOT = root([]);
const tmp = mkdtempSync(join(tmpdir(), "rs090-two-way-"));
const REPORT = join(tmp, "base-report.json");

before(() => {
  const wt = worktree(ROOT, BASE);
  try {
    writeFileSync(REPORT, run("python3", [applyPy(), "--dry-run", "--json"], { cwd: wt.dir }).out);
  } finally {
    wt.remove();
  }
});
after(() => rmSync(tmp, { recursive: true, force: true }));

function measure(script, at, args = []) {
  return run("node", [join(HERE, script), "--root", at, ...args]);
}

/** A fresh copy of HEAD with node_modules linked, broken by `edit` (or left sound). */
function withCopy(edit, fn) {
  const wt = worktree(ROOT, "HEAD");
  try {
    run("ln", ["-s", join(ROOT, "node_modules"), join(wt.dir, "node_modules")]);
    if (edit) edit(wt.dir);
    fn(wt.dir);
  } finally {
    wt.remove();
  }
}

function swap(at, path, from, to) {
  const p = join(at, path);
  const text = readFileSync(p, "utf8");
  assert.ok(text.includes(from), `${path} has no "${from}" to break`);
  writeFileSync(p, text.replace(from, to));
}

function green(r, name) {
  assert.equal(r.code, 0, r.out + r.err);
  assert.match(r.out, new RegExp(`^${name}: `));
}

function red(r, pinned) {
  assert.equal(r.code, 1, r.out + r.err);
  assert.ok(r.out.includes(pinned), `wanted "${pinned}" in:\n${r.out}`);
}

test("apply-again: green on a sound copy, red on a file still marked", () => {
  withCopy(null, (at) => green(measure("apply-again.mjs", at, ["--skip-base"]), "apply-again"));
  withCopy(
    (at) => writeFileSync(join(at, ".prettierignore"), readFileSync(join(at, ".prettierignore"), "utf8") + "<<<<<<< this repository\nx\n=======\ny\n>>>>>>> repo-setup 0.9.0\n"),
    (at) => red(measure("apply-again.mjs", at, ["--skip-base"]), "apply-again: a file is still marked"),
  );
});

test("rules-kept: green on a sound copy, red when autonomy.yaml changes one line", () => {
  withCopy(null, (at) => green(measure("rules-kept.mjs", at, ["--no-github"]), "rules-kept"));
  withCopy(
    (at) => writeFileSync(join(at, "governance/autonomy.yaml"), readFileSync(join(at, "governance/autonomy.yaml"), "utf8") + "# one more line\n"),
    (at) => red(measure("rules-kept.mjs", at, ["--no-github"]), "rules-kept: governance/autonomy.yaml differs from "),
  );
});

test("ci-shape: green on a sound copy; red without needs: quick, with a gate byte changed, with a verdict that ignores e2e, and when check waits for e2e-db again", () => {
  withCopy(null, (at) => green(measure("ci-shape.mjs", at), "ci-shape"));
  withCopy(
    (at) => {
      const p = join(at, ".github/workflows/ci.yml");
      const lines = readFileSync(p, "utf8").split("\n");
      const start = lines.indexOf("  e2e-db:");
      const i = lines.indexOf("    needs: quick", start);
      assert.ok(i > start);
      lines.splice(i, 1);
      writeFileSync(p, lines.join("\n"));
    },
    (at) => red(measure("ci-shape.mjs", at), 'ci-shape: e2e-db needs undefined, not quick'),
  );
  withCopy(
    (at) => swap(at, ".github/workflows/ci.yml", "KIT_TAG: v3.0.0", "KIT_TAG: v3.0.1"),
    (at) => red(measure("ci-shape.mjs", at), "ci-shape: the gate job differs from "),
  );
  withCopy(
    (at) => swap(at, "tools/ci_verdict.py", 'if result != "success":', 'if result != "success" and name != "e2e":'),
    (at) => red(measure("ci-shape.mjs", at), "ci-shape: ci_verdict success/failure: exit 0"),
  );
  withCopy(
    (at) => swap(at, ".github/workflows/ci.yml", "needs: [quick, e2e]", "needs: [quick, e2e, e2e-db]"),
    (at) => red(measure("ci-shape.mjs", at), 'ci-shape: check needs ["quick","e2e","e2e-db"], not ["quick","e2e"]'),
  );
});

test("secret-scan: green on a sound copy, red without the new allowlist", () => {
  withCopy(null, (at) => green(measure("secret-scan.mjs", at, ["--no-github"]), "secret-scan"));
  withCopy(
    (at) => {
      const p = join(at, ".gitleaks.toml");
      const text = readFileSync(p, "utf8");
      const cut = text.indexOf("# The acceptance kit records");
      assert.ok(cut > 0);
      writeFileSync(p, text.slice(0, cut));
    },
    (at) => red(measure("secret-scan.mjs", at, ["--no-github"]), " leaks with the allowlist of HEAD"),
  );
});

test("design-assembly-word: green on a sound copy, red when the check line loses the word", () => {
  withCopy(null, (at) => green(measure("design-assembly-word.mjs", at), "design-assembly-word"));
  withCopy(
    (at) => swap(at, "Makefile", "check: check-quick check-heavy design-assembly", "check: check-quick check-heavy"),
    (at) => red(measure("design-assembly-word.mjs", at), "design-assembly-word: check depends on [check-quick, check-heavy], not"),
  );
});

test("ledgers: green on a sound copy, red when wiki/log.md carries the drawn stamp", () => {
  withCopy(null, (at) => green(measure("ledgers.mjs", at), "ledgers"));
  withCopy(
    (at) => {
      // The stamp comes from the real writer, tools/ledgers.py stamp(), not from a hand-made line.
      const py = "import sys; sys.path.insert(0, 'tools'); import ledgers; p = 'wiki/log.md'; t = open(p).read(); open(p, 'w').write(ledgers.stamp(t, 'wiki/log/'))";
      const r = run("python3", ["-c", py], { cwd: at });
      assert.equal(r.code, 0, r.err);
      git(at, "add", "wiki/log.md");
    },
    (at) => red(measure("ledgers.mjs", at), "ledgers: ledger log is fragments, not one-file"),
  );
});

test("change-set: green on a sound copy; red when a file outside the list changes, and when a group's count is off", () => {
  withCopy(null, (at) => green(measure("change-set.mjs", at, ["--report", REPORT]), "change-set"));
  withCopy(
    (at) => {
      writeFileSync(join(at, "README.md"), readFileSync(join(at, "README.md"), "utf8") + "\nOne more line.\n");
      // A commit in the throwaway copy, made with plumbing (write-tree, commit-tree), which runs no hook.
      git(at, "add", "README.md");
      const tree = git(at, "write-tree").trim();
      const id = "GIT_AUTHOR_NAME=two-way GIT_AUTHOR_EMAIL=two-way@example.invalid GIT_COMMITTER_NAME=two-way GIT_COMMITTER_EMAIL=two-way@example.invalid";
      const env = Object.fromEntries(id.split(" ").map((kv) => kv.split("=")));
      const commit = run("git", ["-C", at, "commit-tree", tree, "-p", "HEAD", "-m", "two-way: a file outside the list"], { env: { ...process.env, ...env } });
      assert.equal(commit.code, 0, commit.err);
      git(at, "checkout", "-q", "--detach", commit.out.trim());
    },
    (at) => red(measure("change-set.mjs", at, ["--report", REPORT]), "change-set: README.md changed after fd53ac96"),
  );
  withCopy(null, (at) => red(measure("change-set.mjs", at, ["--report", REPORT, "--upgrade", RENAME]), "change-set: group created has 0 files, not 14"));
});

test("ci-runs: green on the decided run, red on the run of fd53ac96 where check failed", () => {
  // ci-runs reads GitHub, so a broken copy of the tree cannot break it: the red case reads a real
  // older run of PR 88 instead, the one whose e2e-db reached its ceiling and whose check failed.
  green(run("node", [join(HERE, "ci-runs.mjs")]), "ci-runs");
  red(run("node", [join(HERE, "ci-runs.mjs"), "--run-commit", "fd53ac960bf6bc0247caa0f4b015b52541c00f36"]), "ci-runs: on fd53ac96 check is failure, not success");
});
