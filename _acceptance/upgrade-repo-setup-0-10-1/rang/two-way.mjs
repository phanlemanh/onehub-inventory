// AC-8: each measure of AC-3 to AC-7 is green on the tree as it is, and red with its own message on a
// copy broken the way it watches for; commits-judged also on a copy whose job script is broken (judge
// accepting everything, a probe that no longer stops). The copies are detached worktrees of HEAD.
// Usage: node --test two-way.mjs

import assert from "node:assert/strict";
import { appendFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { after, test } from "node:test";

import { HERE, git, prBase, root, run, show, worktree } from "./lib.mjs";

const dir = root([]);
const copies = [];
after(() => copies.forEach((c) => c.remove()));

function measure(name, at) {
  const args = [join(HERE, `${name}.mjs`)];
  if (at) args.push("--root", at);
  return run("node", args, { cwd: at ?? dir });
}

function copy() {
  const c = worktree(dir, "HEAD");
  copies.push(c);
  return c.dir;
}

for (const name of ["template-same", "commits-judged", "agents-tail", "manifest", "change-set"]) {
  test(`${name} is green on the tree`, () => {
    const r = measure(name);
    assert.equal(r.code, 0, r.out + r.err);
  });
}

test("template-same is red when pr-title.yml is not the template", () => {
  const at = copy();
  appendFileSync(join(at, ".github/workflows/pr-title.yml"), "# changed\n");
  const r = measure("template-same", at);
  assert.equal(r.code, 1);
  assert.match(r.out, /is not the template .* of the tag byte for byte/);
});

test("commits-judged is red on the workflow of the base", () => {
  const at = copy();
  writeFileSync(join(at, ".github/workflows/pr-title.yml"), show(dir, prBase(dir), ".github/workflows/pr-title.yml"));
  const r = measure("commits-judged", at);
  assert.equal(r.code, 1);
  assert.match(r.out, /step 2 of conventional-commits has no probe and judge part/);
});

/** A copy of HEAD whose pr-title.yml has `from` replaced by `to` (exactly once). */
function workflowCopy(from, to) {
  const at = copy();
  const p = join(at, ".github/workflows/pr-title.yml");
  const text = readFileSync(p, "utf8");
  assert.equal(text.split(from).length, 2, `"${from}" is not once in pr-title.yml`);
  writeFileSync(p, text.replace(from, to));
  return at;
}

test("commits-judged is red when judge accepts every message", () => {
  const at = workflowCopy('return "$code"', "return 0");
  const r = measure("commits-judged", at);
  assert.equal(r.code, 1);
  // The probe is the first to see it: no message is ever refused, so it says nothing judges.
  assert.match(r.out, /the probe did not find a hook that refuses/);
  assert.match(r.out, /the hooks answered \[\], not \[0,0,1,1,1,1\]/);
});

test("commits-judged is red when the probe no longer stops on a repository that judges nothing", () => {
  const at = workflowCopy('echo "::error::No hook of this repository refuses', 'echo "::notice::No check of this repository refuses');
  const r = measure("commits-judged", at);
  assert.equal(r.code, 1);
  assert.match(r.out, /with no commit-msg hook the probe exited/);
});

test("agents-tail is red when a line follows the closing section", () => {
  const at = copy();
  appendFileSync(join(at, "AGENTS.md"), "\n- one more rule\n");
  const r = measure("agents-tail", at);
  assert.equal(r.code, 1);
  assert.match(r.out, /is not the end of AGENTS\.md/);
});

test("manifest is red on another version", () => {
  const at = copy();
  const p = join(at, ".repo-setup.json");
  writeFileSync(p, readFileSync(p, "utf8").replace('"version": "0.10.1"', '"version": "0.10.0"'));
  const r = measure("manifest", at);
  assert.equal(r.code, 1);
  assert.match(r.out, /records version 0\.10\.0, not 0\.10\.1/);
});

test("change-set is red on a file outside the upgrade, and on a T3 path", () => {
  const at = copy();
  mkdirSync(join(at, "src/modules/identity"), { recursive: true });
  writeFileSync(join(at, "src/modules/identity/extra.ts"), "export const extra = 1;\n");
  git(at, "add", "src/modules/identity/extra.ts");
  git(at, "-c", "user.name=measure", "-c", "user.email=measure@example.invalid", "commit", "-q", "-m", "test: a file outside the upgrade");
  const r = measure("change-set", at);
  assert.equal(r.code, 1);
  assert.match(r.out, /changes src\/modules\/identity\/extra\.ts, outside the upgrade and its round/);
  assert.match(r.out, /src\/modules\/identity\/extra\.ts is a T3 path/);
});
