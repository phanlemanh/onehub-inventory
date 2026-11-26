// AC-10: each measure is green on the tree as it is, and red with its own message on a copy broken in
// exactly one of the ways it watches for. The copies are detached worktrees of HEAD, or a broken
// pr-title.yml handed over with --workflow, or stand-in lists for change-set.
// Usage: node --test two-way.mjs

import assert from "node:assert/strict";
import { appendFileSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, test } from "node:test";

import { HERE, WORKFLOW, git, prBase, root, run, show, worktree } from "./lib.mjs";

const dir = root([]);
const copies = [];
const scratch = mkdtempSync(join(tmpdir(), "rs0102-2w-"));
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

/** pr-title.yml of HEAD with one edit, written to a file handed over with --workflow. */
function brokenWorkflow(from, to) {
  const f = join(scratch, `pr-title-${copies.length}-${Math.random().toString(16).slice(2)}.yml`);
  writeFileSync(f, replaceOnce(readFileSync(join(dir, WORKFLOW), "utf8"), from, to));
  return f;
}

/** A copy of HEAD where `file` is edited and the edit committed (measures that read HEAD of a copy). */
function committedCopy(file, edit) {
  const at = copy();
  const p = join(at, file);
  writeFileSync(p, edit(readFileSync(p, "utf8")));
  git(at, "add", "--", file);
  git(at, "-c", "user.name=measure", "-c", "user.email=measure@example.invalid", "commit", "-q", "-m", "test: one break");
  return at;
}

for (const name of ["template-same", "fence", "judged", "credentials", "runner", "policy", "change-set"]) {
  test(`${name} is green on the tree`, () => {
    const r = measure(name);
    assert.equal(r.code, 0, r.out);
  });
}

test("template-same is red when tools/autonomy.py is not the template", () => {
  const at = copy();
  appendFileSync(join(at, "tools/autonomy.py"), "# changed\n");
  const r = measure("template-same", "--root", at);
  assert.equal(r.code, 1);
  assert.match(r.out, /tools\/autonomy\.py is not the template .* of the tag byte for byte/);
});

test("apply-again is red when the manifest still says 0.10.1", () => {
  const at = copy();
  const p = join(at, ".repo-setup.json");
  writeFileSync(p, replaceOnce(readFileSync(p, "utf8"), '"version": "0.10.2"', '"version": "0.10.1"'));
  const r = measure("apply-again", "--root", at);
  assert.equal(r.code, 1);
  // apply.py has no action to take for a stale version alone; the copy of the base it writes tells.
  assert.match(r.out, /writes a \.repo-setup\.json that is not HEAD's/);
});

test("fence is red on the workflow of the base", () => {
  const f = join(scratch, "pr-title-base.yml");
  writeFileSync(f, show(dir, prBase(dir), WORKFLOW));
  const r = measure("fence", "--workflow", f);
  assert.equal(r.code, 1);
  assert.match(r.out, /"::warning::planted-body" reaches the runner as a workflow command/);
});

test("fence is red when the fence is not opened", () => {
  const r = measure("fence", "--workflow", brokenWorkflow('echo "::stop-commands::$fence"', 'echo "fence $fence"'));
  assert.equal(r.code, 1);
  assert.match(r.out, /reaches the runner as a workflow command/);
});

test("fence is red when the subject is quoted raw", () => {
  const r = measure("fence", "--workflow", brokenWorkflow('$(head -1 "$RUNNER_TEMP/message" | quoted)', '$(head -1 "$RUNNER_TEMP/message")'));
  assert.equal(r.code, 1);
  assert.match(r.out, /quotes the subject with a control character/);
});

test("fence is red when it shows the output without a token", () => {
  const r = measure("fence", "--workflow", brokenWorkflow('if [ "${#fence}" -ne 32 ]; then', "if false; then"));
  assert.equal(r.code, 1);
  assert.match(r.out, /with no random token the step/);
});

test("fence is red when the token is the same on every call", () => {
  const r = measure("fence", "--workflow", brokenWorkflow("fence=$(head -c 16 /dev/urandom | od -An -tx1 | tr -d ' \\n') || fence=", "fence=0123456789abcdef0123456789abcdef"));
  assert.equal(r.code, 1);
  assert.match(r.out, /two fences share a token/);
});

test("fence is red when the closing line does not carry the token", () => {
  const r = measure("fence", "--workflow", brokenWorkflow("printf '\\n::%s::\\n' \"$fence\"", "printf '\\n::x%s::\\n' \"$fence\""));
  assert.equal(r.code, 1);
  assert.match(r.out, /a fence is left open/);
});

test("fence is red when the could-not-run line quotes the author's text raw", () => {
  const r = measure("fence", "--workflow", brokenWorkflow("| tr '\\n' ' ' | quoted)\"", "| tr '\\n' ' ')\""));
  assert.equal(r.code, 1);
  assert.match(r.out, /could-not-run path "::add-mask::planted-cr" reaches the runner|could-not-run line quotes the author's text with a control character/);
});

test("judged is red when the step passes refused commits", () => {
  const r = measure("judged", "--workflow", brokenWorkflow('exit "$failed"', "exit 0"));
  assert.equal(r.code, 1);
  assert.match(r.out, /the step of HEAD answers 0 on update stuff, not 1/);
});

test("judged is red when the step of HEAD accepts every message", () => {
  const r = measure("judged", "--workflow", brokenWorkflow('return "$code"', "return 0"));
  assert.equal(r.code, 1);
  assert.match(r.out, /the step of HEAD answers 1 on the upgrade commit, not 0/);
});

test("credentials is red when the checkout keeps the token, and when the step runs git", () => {
  const keep = copy();
  const p = join(keep, WORKFLOW);
  writeFileSync(p, replaceOnce(readFileSync(p, "utf8"), "persist-credentials: false", "persist-credentials: true"));
  assert.match(measure("credentials", "--root", keep).out, /the checkout of conventional-commits keeps the token/);
  const fetch = copy();
  const q = join(fetch, WORKFLOW);
  writeFileSync(q, replaceOnce(readFileSync(q, "utf8"), "          failed=0\n", "          git fetch origin\n          failed=0\n"));
  assert.match(measure("credentials", "--root", fetch).out, /runs git: \["git fetch origin"\]/);
});

test("runner is red on a run that is not the pull_request_target job", () => {
  const r = measure("runner", "--run", "44709236416", "--job", "136196390860");
  assert.equal(r.code, 1);
  assert.match(r.out, /came from pull_request, not pull_request_target/);
});

test("policy is red when gate stays one of the setup's checks without the agent pipeline", () => {
  const at = committedCopy("tools/autonomy.py", (t) => replaceOnce(t, "    if (root / AGENT_WORKFLOW).exists():\n", "    if True:\n"));
  const r = measure("policy", "--root", at);
  assert.equal(r.code, 1);
  assert.match(r.out, /required_checks: \[gate\] is refused/);
});

test("policy is red when github_setup.py main reads the checks without the repository's own list", () => {
  const at = committedCopy("tools/github_setup.py", (t) => replaceOnce(t, "        proof_check(policy, own),\n        required_checks(policy, own),\n", "        proof_check(policy),\n        required_checks(policy),\n"));
  const r = measure("policy", "--root", at);
  assert.equal(r.code, 1);
  assert.match(r.out, /the ruleset would require gate 0 times/);
});

test("change-set is red when the config changes more than the round's commands", () => {
  const at = committedCopy("_acceptance/config.yaml", (t) => replaceOnce(t, "\nsignoff:", "\n# changed\nsignoff:"));
  const r = measure("change-set", "--root", at);
  assert.equal(r.code, 1);
  assert.match(r.out, /adds a line to _acceptance\/config\.yaml that is not a command rs0102_\*: "# changed"/);
});

test("change-set is red on the policy, and on a commit only a looser rule accepts", () => {
  const files = ".github/workflows/pr-title.yml,tools/autonomy.py,tools/github_setup.py,.repo-setup.json";
  assert.match(measure("change-set", "--files", `${files},governance/autonomy.yaml`).out, /changes governance\/autonomy\.yaml, outside the upgrade/);
  const list = join(scratch, "messages.json");
  writeFileSync(list, JSON.stringify(["chore: a\n", "update stuff\n"]));
  assert.match(measure("change-set", "--messages", list).out, /"update stuff" does not pass the base's rule/);
});
