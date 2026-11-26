// AC-6: each measure is green on the tree as it is, and red with its pinned message on a copy where exactly one
// thing is broken. A measure that has never been red proves nothing. The broken copies are built in memory or in the
// system temp folder; no file of the repository changes.
// Usage: node --test two-way.mjs

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, realpathSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

import { HERE, REPO } from "./lib.mjs";

// The tree under grading, found without lib.mjs: the git work tree of the folder this test runs from (the grader runs
// it from the repository root). A measure that measured another tree prints another root and fails here.
const TREE = realpathSync(
  spawnSync("git", ["rev-parse", "--show-toplevel"], { cwd: process.cwd(), encoding: "utf8" }).stdout.trim(),
);

export function assertRoot(script, out, tree = TREE) {
  const printed = /: root (.+)\n/.exec(out)?.[1];
  assert.ok(printed, `${script} printed no root line: ${out}`);
  assert.equal(realpathSync(printed), tree, `${script} measured ${printed}, not the tree under grading ${tree}`);
}

function run(script, ...args) {
  const r = spawnSync(process.execPath, [join(HERE, script), ...args], { cwd: REPO, encoding: "utf8" });
  const out = `${r.stdout}${r.stderr}`;
  assertRoot(script, out);
  return { code: r.status, out };
}

test("root check red: a measure that prints another root is caught", () => {
  assert.throws(() => assertRoot("x.mjs", `x: root ${tmpdir()}\n`), /measured .*, not the tree under grading/);
  assert.throws(() => assertRoot("x.mjs", "no root here\n"), /printed no root line/);
});

// The planted folders of THIS run are gone. Only the run's own tag is checked: in a grading round other measures plant
// their own folders at the same time.
const noPlanted = (out) => {
  const tag = /: plants (lnt-[0-9]+-[0-9]+)/.exec(out)?.[1];
  assert.ok(tag, `no plants line in: ${out}`);
  for (const d of [".acceptance-runs", ".claude/worktrees"]) {
    assert.equal(existsSync(join(REPO, d, tag)), false, `${d}/${tag} was not removed`);
  }
};

test("E1 green: ESLint ignores the three out-of-git paths", () => {
  const r = run("bo-qua.mjs", "--eslint");
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /eslint: 3 of 3 out-of-git paths ignored/);
});

test("E1 red: without the two new patterns ESLint still lints all three", () => {
  const r = run("bo-qua.mjs", "--eslint", "--pha");
  assert.equal(r.code, 1, r.out);
  assert.match(r.out, /eslint: still linted: /);
  for (const p of [".acceptance-runs/x/a.mjs", ".claude/worktrees/w/src/app/page.tsx", ".claude/worktrees/w/.next/chunk.js"]) {
    assert.ok(r.out.includes(p), `missing ${p} in: ${r.out}`);
  }
});

test("E2 green: Prettier ignores the three out-of-git paths", () => {
  const r = run("bo-qua.mjs", "--prettier");
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /prettier: 3 of 3 out-of-git paths ignored/);
});

test("E2 red: without the two new lines Prettier checks the worktree source file", () => {
  const r = run("bo-qua.mjs", "--prettier", "--pha");
  assert.equal(r.code, 1, r.out);
  assert.match(r.out, /prettier: still checked: \.claude\/worktrees\/w\/src\/app\/page\.tsx/);
  assert.match(r.out, /prettier: \.prettierignore alone does not ignore: \.acceptance-runs\/x\/a\.mjs, \.claude\/worktrees\/w\/src\/app\/page\.tsx/);
});

test("E3 green: the 18 in-tree paths keep the state measured at 799ae9dc", () => {
  const r = run("bo-qua.mjs", "--doi-chung");
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /doi-chung: 18 of 18 in-tree paths keep their state \(eslint 14 linted, 4 ignored; prettier 12 checked, 6 ignored\)/);
});

test("E3 red (a): an ESLint pattern that ignores too much changes an in-tree path", () => {
  const r = run("bo-qua.mjs", "--doi-chung", "--them", ".claude/");
  assert.equal(r.code, 1, r.out);
  assert.match(r.out, /doi-chung: eslint state changed: .*\.claude\/hooks\/x\.mjs/);
});

test("E3 red (b): a .prettierignore line that ignores too much changes an in-tree path", () => {
  const r = run("bo-qua.mjs", "--doi-chung", "--them-pr", "tools/");
  assert.equal(r.code, 1, r.out);
  assert.match(r.out, /doi-chung: prettier state changed: tools\/x\.mjs/);
});

test("the in-memory copies with nothing removed agree with the real lookup", () => {
  for (const mode of ["--eslint", "--prettier", "--doi-chung"]) {
    const r = run("bo-qua.mjs", mode, "--pha-rong");
    assert.equal(r.code, 0, `${mode}: ${r.out}`);
  }
});

test("E4 green: npm run lint stays green with broken files planted, and the plants are removed", { timeout: 600_000 }, () => {
  const r = run("chay-that.mjs");
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /chay-that: npm run lint exit 0 with a broken \.mjs planted in 3 out-of-git places; none named in the output; planted folders removed/);
  noPlanted(r.out);
});

test("E4 red (b): Prettier without the .prettierignore lines names the planted worktree file, and the plants are removed", () => {
  const r = run("chay-that.mjs", "--pha-pr");
  assert.equal(r.code, 1, r.out);
  assert.match(r.out, /chay-that: prettier named a planted file: \.claude\/worktrees\/lnt-[0-9-]+\/x\.mjs/);
  assert.match(r.out, /planted folders removed/);
  noPlanted(r.out);
});

test("E7 green: the test runner collects no test file from either out-of-git folder", { timeout: 300_000 }, () => {
  const r = run("kiem-tron.mjs", "--liet-ke");
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /kiem-tron: test runner collects no planted file; planted folders removed/);
  noPlanted(r.out);
});

test("E7 red (a): without the two new excludes the test runner collects the planted tests of both folders", { timeout: 300_000 }, () => {
  const r = run("kiem-tron.mjs", "--liet-ke", "--pha");
  assert.equal(r.code, 1, r.out);
  assert.match(r.out, /kiem-tron: test runner collects a planted file: .*\.acceptance-runs\/lnt-[0-9-]+\/tests\/planted\.test\.ts/);
  assert.match(r.out, /\.claude\/worktrees\/lnt-[0-9-]+\/tests\/planted\.test\.ts/);
  assert.match(r.out, /planted folders removed/);
  noPlanted(r.out);
});

test("E4 red (a): without the two new patterns lint names a planted file, and the plants are still removed", { timeout: 600_000 }, () => {
  const r = run("chay-that.mjs", "--pha");
  assert.equal(r.code, 1, r.out);
  assert.match(r.out, /chay-that: lint named a planted file: /);
  assert.match(r.out, /planted folders removed/);
  noPlanted(r.out);
});

test("E7 green: the type checker reads no planted file", { timeout: 300_000 }, () => {
  const r = run("kiem-tron.mjs", "--tsc");
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /kiem-tron: type checker reads no planted file; planted folders removed/);
  noPlanted(r.out);
});

test("E7 red (b): a type checker config that names the folders lists the planted files", { timeout: 300_000 }, () => {
  const r = run("kiem-tron.mjs", "--tsc", "--pha");
  assert.equal(r.code, 1, r.out);
  assert.match(r.out, /kiem-tron: type checker reads a planted file: .*\.claude\/worktrees\/lnt-[0-9-]+\/src\/planted\.ts/);
  assert.match(r.out, /planted folders removed/);
  noPlanted(r.out);
});

test("E7 red (c): plants that break nothing stop the measure before it runs", { timeout: 300_000 }, () => {
  const r = run("kiem-tron.mjs", "--cay-lanh", "--tsc");
  assert.equal(r.code, 2, r.out);
  assert.match(
    r.out,
    /kiem-tron: a planted file breaks nothing: src\/planted\.ts is not a type error; tests\/planted\.test\.ts does not fail; tools\/planted\.mjs is not an ESLint error; tools\/planted\.mjs is formatted for Prettier/,
  );
  noPlanted(r.out);
});
