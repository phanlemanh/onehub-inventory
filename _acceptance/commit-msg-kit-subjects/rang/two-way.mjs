// AC-8: each measure is green on the tree and red on a copy where exactly one thing it watches is broken.
// Usage: node --test two-way.mjs

import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { after, test } from "node:test";
import assert from "node:assert/strict";

import { HERE, kitInstall, root, run, show, prBase, worktree } from "./lib.mjs";
import { KIT_COMMITTING_SCRIPTS, KIT_SUBJECTS } from "./matrix.mjs";

const dir = root([]);
/** Every character a regular expression treats as special, the backslash among them, escaped. */
const escapeRegExp = (s) => s.replace(/[\\^$.*+?()[\]{}|]/g, "\\$&");
const RULE = "tools/commit_msg.py";
const scratch = mkdtempSync(join(tmpdir(), "cmks-2w-"));
const trees = [];
after(() => {
  for (const t of trees) t.remove();
  rmSync(scratch, { recursive: true, force: true });
});

function measure(name, at = dir, env = {}, extra = []) {
  const r = run("node", [join(HERE, `${name}.mjs`), "--root", at, ...extra], { env: { ...process.env, ...env } });
  return { code: r.code, out: (r.out + r.err).trim() };
}

/** A worktree of HEAD whose `file` is `edit(text)`; the edit must change the file. */
function broken(file, edit) {
  const t = worktree(dir, "HEAD");
  trees.push(t);
  const before = readFileSync(join(dir, file), "utf8");
  const text = edit(before);
  assert.notEqual(text, before, `the break did not apply to ${file}`);
  writeFileSync(join(t.dir, file), text);
  // Staged, not committed: pre-commit sets unstaged changes aside before it runs a hook, so an unstaged break would
  // never reach the hook of commits-judged.
  const add = run("git", ["-C", t.dir, "add", "--", file]);
  assert.equal(add.code, 0, add.err);
  return t.dir;
}
const brokenRule = (edit) => broken(RULE, edit);

/** A kit install holding only the files the matrix names, with `edit(path, text)` applied. */
function fakeKit(edit = (_p, t) => t, add = {}) {
  const real = kitInstall(dir);
  const at = mkdtempSync(join(scratch, "kit-"));
  for (const f of new Set([...KIT_SUBJECTS.map((s) => s.file), ...KIT_COMMITTING_SCRIPTS])) {
    mkdirSync(dirname(join(at, f)), { recursive: true });
    writeFileSync(join(at, f), edit(f, readFileSync(join(real, f), "utf8")));
  }
  for (const [f, text] of Object.entries(add)) {
    mkdirSync(dirname(join(at, f)), { recursive: true });
    writeFileSync(join(at, f), text);
  }
  return at;
}

for (const name of ["kit-subjects", "near-miss", "history", "change-set", "test-cases"]) {
  test(`${name} is green on the tree`, () => {
    const r = measure(name);
    assert.equal(r.code, 0, r.out);
  });
}

test("kit-subjects is red when tools/commit_msg.py is the base's", () => {
  const at = brokenRule(() => show(dir, prBase(dir), RULE));
  assert.equal(measure("kit-subjects", at).code, 1);
});

test("kit-subjects is red when the kit no longer writes a template of the matrix", () => {
  const kit = fakeKit((f, t) => (f.endsWith("signoff.md") ? t.replaceAll("Veto: <slug> — <tên>", "Veto <slug>") : t));
  assert.match(measure("kit-subjects", dir, { KIT_INSTALL: kit }).out, /does not write "Veto: <slug> — <tên>"/);
});

test("kit-subjects is red when another script of the kit commits, in a form other than -m", () => {
  const kit = fakeKit(undefined, { "feature-loop/3.0.0/scripts/new.mjs": "g('commit', '-qm', 'seal: x');\n" });
  assert.match(measure("kit-subjects", dir, { KIT_INSTALL: kit }).out, /scripts that commit are/);
});

test("kit-subjects is red when a command of the kit tells to commit another subject", () => {
  const kit = fakeKit(undefined, { "acceptance-gate/3.0.0/commands/approve.md": 'git commit -m "Gate 1: <slug> — <name>"\n' });
  assert.match(measure("kit-subjects", dir, { KIT_INSTALL: kit }).out, /markdown tells to commit/);
});

test("near-miss is red when a prefix takes an empty text", () => {
  const at = brokenRule((t) => t.replace("Gate 2 signoff: [a-z0-9-]+ — \\S", "Gate 2 signoff:"));
  assert.match(measure("near-miss", at).out, /on "Gate 2 signoff:"/);
});

test("near-miss is red when any line of the message may carry the subject", () => {
  const at = brokenRule((t) => t.replace("ALLOWED.match(lines[0])", "next((m for m in map(ALLOWED.match, lines) if m), None)"));
  assert.match(measure("near-miss", at).out, /on "update stuff/);
});

test("near-miss is red when repin takes any scope", () => {
  const at = brokenRule((t) => t.replace("repin\\([a-z0-9-]+\\)", "repin\\([^)]+\\)"));
  assert.match(measure("near-miss", at).out, /repin\(Vi-Du\)/);
});

test("near-miss and history are red when wip takes any scope", () => {
  const at = brokenRule((t) => t.replace("wip\\(ban-giao\\)", "wip\\([^)]+\\)"));
  assert.match(measure("near-miss", at).out, /wip\(dan-tu-excel\)/);
  assert.equal(measure("history", at).code, 1);
});

test("history is red when an old prefix is dropped", () => {
  const at = brokenRule((t) => t.replace("design-floor S3: |", ""));
  assert.match(measure("history", at).out, /refuses \d+ commits the base accepts|accepts .* more/);
});

test("commits-judged is red when tools/commit_msg.py accepts every message", () => {
  const at = brokenRule((t) => t.replace("def main() -> int:\n", "def main() -> int:\n    return 0\n"));
  assert.equal(measure("commits-judged", at, {}, ["--in-place"]).code, 1);
});

test("change-set is red on a file outside the change, and on the hook's wiring", () => {
  for (const f of ["src/app/page.tsx", ".pre-commit-config.yaml"]) {
    const r = measure("change-set", dir, {}, ["--files", `tools/commit_msg.py,tests/commit-msg.test.ts,${f}`]);
    assert.match(r.out, new RegExp(`${escapeRegExp(f)} changes`));
  }
});

test("change-set is red on a commit of the pull request that only the new rule accepts", () => {
  const list = join(scratch, "messages.json");
  writeFileSync(list, JSON.stringify(["fix: a\n", "Gate 2 signoff: commit-msg-kit-subjects — [Tên]\n"]));
  assert.match(measure("change-set", dir, {}, ["--messages", list]).out, /does not pass the base's rule/);
});

test("test-cases is red when an old case of the test file is dropped", () => {
  const at = broken("tests/commit-msg.test.ts", (t) => t.replace('    "design-floor: x",\n', ""));
  assert.match(measure("test-cases", at).out, /not all kept/);
});
