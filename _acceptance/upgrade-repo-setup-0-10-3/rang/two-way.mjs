// AC-10: each measure is green on the tree as it is, and red with its own message on a copy broken in
// exactly one of the ways it watches for. Copies are detached worktrees of HEAD (a break the measure
// reads from HEAD of the copy is committed there), or a policy file handed over with --file.
// real-run reads the real repository on GitHub and has no broken copy.
// Usage: node --test two-way.mjs

import assert from "node:assert/strict";
import { appendFileSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, test } from "node:test";

import { HERE, git, root, run, worktree } from "./lib.mjs";

const dir = root([]);
const POLICY = "governance/autonomy.yaml";
const copies = [];
const scratch = mkdtempSync(join(tmpdir(), "rs0103-2w-"));
after(() => {
  copies.forEach((c) => c.remove());
  rmSync(scratch, { recursive: true, force: true });
});

function measure(name, ...extra) {
  const r = run("node", [join(HERE, `${name}.mjs`), ...extra], { cwd: dir });
  return { code: r.code, out: (r.out + r.err).trim() };
}

function copy() {
  const c = worktree(dir, "HEAD");
  copies.push(c);
  return c.dir;
}

/** `text` with `from` replaced by `to`; `from` must be there exactly once. */
function replaceOnce(text, from, to) {
  assert.equal(text.split(from).length, 2, `"${from}" is not once in the file`);
  return text.replace(from, to);
}

/** A copy of HEAD where `file` is edited and the edit committed. */
function committedCopy(file, edit) {
  const at = copy();
  const p = join(at, file);
  writeFileSync(p, edit(readFileSync(p, "utf8")));
  git(at, "add", "--", file);
  git(at, "-c", "user.name=measure", "-c", "user.email=measure@example.invalid", "commit", "-q", "-m", "test: one break");
  return at;
}

/** HEAD's policy with one edit, written to a file handed over with --file. */
function brokenPolicy(from, to) {
  const f = join(scratch, `policy-${Math.random().toString(16).slice(2)}.yaml`);
  writeFileSync(f, replaceOnce(readFileSync(join(dir, POLICY), "utf8"), from, to));
  return f;
}

for (const name of ["template-same", "resolution", "policy-same", "merge-method", "flow", "change-set"]) {
  test(`${name} is green on the tree`, () => {
    const r = measure(name);
    assert.equal(r.code, 0, r.out);
  });
}

test("template-same is red when a new tool is not the template", () => {
  const at = copy();
  appendFileSync(join(at, "tools/sdlc_limits.py"), "# changed\n");
  const r = measure("template-same", "--root", at);
  assert.equal(r.code, 1);
  assert.match(r.out, /tools\/sdlc_limits\.py is not the template of the tag byte for byte/);
});

test("apply-again is red when a tool is not what the tag writes", () => {
  const at = copy();
  appendFileSync(join(at, "tools/sdlc_report.py"), "# changed\n");
  const r = measure("apply-again", "--root", at);
  assert.equal(r.code, 1);
  assert.match(r.out, /writes a tools\/sdlc_report\.py that is not HEAD's/);
});

test("resolution is red on the template's squash, and when the proof block is dropped", () => {
  const squash = measure("resolution", "--file", brokenPolicy("merge_method: merge", "merge_method: squash"));
  assert.match(squash.out, /is not the 0\.10\.3 side of the marked block with merge_method: merge/);
  const dropped = measure("resolution", "--file", brokenPolicy('proof:\n  check: ""\n', ""));
  assert.equal(dropped.code, 1);
  assert.match(dropped.out, /proof is undefined, not \{"check":""\}/);
});

test("policy-same is red when the policy moves a path to low", () => {
  const r = measure("policy-same", "--file", brokenPolicy('low:\n  - "wiki/**"\n', 'low:\n  - "wiki/**"\n  - "src/**"\n'));
  assert.equal(r.code, 1);
  assert.match(r.out, /HEAD: the tier changes for \d+ files, first src\//);
});

test("merge-method is red when an option that differs is not refused", () => {
  const at = committedCopy("tools/github_setup.py", (t) => replaceOnce(t, '            file=sys.stderr,\n        )\n        return 2\n', '            file=sys.stderr,\n        )\n'));
  const r = measure("merge-method", "--root", at);
  assert.equal(r.code, 1);
  assert.match(r.out, /--merge-method squash against merge_method: merge exits null, not 2/);
});

test("merge-method is red when a bad value no longer stops github_setup.py", () => {
  const at = committedCopy("tools/github_setup.py", (t) => replaceOnce(t, '        print(f"governance/autonomy.yaml: {bad[0]}. Nothing was changed.", file=sys.stderr)\n        return 1\n', "        pass\n"));
  const r = measure("merge-method", "--root", at);
  assert.equal(r.code, 1);
  assert.match(r.out, /with merge_method: rebase github_setup\.py exits/);
});

test("merge-method is red when a policy without the key sets squash", () => {
  const at = committedCopy("tools/github_setup.py", (t) => replaceOnce(t, "        stored or args.merge_method or \"\",\n", "        stored or args.merge_method or \"squash\",\n"));
  const r = measure("merge-method", "--root", at);
  assert.equal(r.code, 1);
  assert.match(r.out, /without the key github_setup\.py sets "squash-only merges/);
});

test("merge-method is red when the codeowners check no longer reads merge_method", () => {
  const at = committedCopy("tools/autonomy.py", (t) => replaceOnce(t, " + merge_method_problems(policy)\n", "\n"));
  const r = measure("merge-method", "--root", at);
  assert.equal(r.code, 1);
  assert.match(r.out, /with merge_method: rebase the codeowners check exits 0 without naming it/);
});

test("policy-same is red when the committed CODEOWNERS is not what the policy renders", () => {
  const at = committedCopy(".github/CODEOWNERS", (t) => `${t}/src/ @someone\n`);
  const r = measure("policy-same", "--root", at);
  assert.equal(r.code, 1);
  assert.match(r.out, /the CODEOWNERS block is not the committed \.github\/CODEOWNERS|differs from the base/);
});

test("flow is red when a split report over its threshold changes the exit code", () => {
  const at = committedCopy("tools/sdlc_metrics.py", (t) =>
    replaceOnce(t, "        page = render_split(before, after, at.isoformat(), week)\n", '        page = render_split(before, after, at.isoformat(), week)\n        if any(t.get("verdict") == "over" for t in after.get("thresholds", [])):\n            return 1\n'),
  );
  const r = measure("flow", "--root", at);
  assert.equal(r.code, 1);
  assert.match(r.out, /with a number over its threshold, the --split 2026-11-18 exits 1/);
});

test("flow is red when a number over its threshold changes the exit code", () => {
  const at = committedCopy("tools/sdlc_metrics.py", (t) =>
    replaceOnce(t, "    if args.json:\n", '    if any(t.get("verdict") == "over" for t in out.get("thresholds", [])):\n        return 1\n    if args.json:\n'),
  );
  const r = measure("flow", "--root", at);
  assert.equal(r.code, 1);
  assert.match(r.out, /with a number over its threshold, the page exits 1/);
});

test("flow is red when a tool names the dossiers", () => {
  const at = copy();
  appendFileSync(join(at, "tools/sdlc_gh.py"), '# reads _acceptance/x\n');
  const r = measure("flow", "--root", at);
  assert.equal(r.code, 1);
  assert.match(r.out, /tools\/sdlc_gh\.py names _acceptance/);
});

test("change-set is red on another governance file, a commit off the rule, and a config line", () => {
  const files = "tools/autonomy.py,governance/autonomy.yaml";
  assert.match(measure("change-set", "--files", `${files},governance/other.yaml`).out, /changes governance\/other\.yaml, which it must not touch/);
  const list = join(scratch, "messages.json");
  writeFileSync(list, JSON.stringify(["chore: a\n", "update stuff\n"]));
  assert.match(measure("change-set", "--messages", list).out, /"update stuff" does not pass the base's rule/);
  const at = committedCopy("_acceptance/config.yaml", (t) => replaceOnce(t, "\nsignoff:", "\n# changed\nsignoff:"));
  assert.match(measure("change-set", "--root", at).out, /adds a line to _acceptance\/config\.yaml that is not a command rs0103_\*: "# changed"/);
});
