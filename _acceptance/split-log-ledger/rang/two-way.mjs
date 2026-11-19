// E7: each measure of split-log-ledger is green on a sound copy and red, with its pinned message, on a broken
// one. Copies are detached worktrees in a temp dir (of HEAD, or of SPLIT_FROM where the old object itself is the
// broken copy); nothing here writes to this tree.
// Usage: node --test two-way.mjs

import assert from "node:assert/strict";
import { appendFileSync, copyFileSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, test } from "node:test";

import { judge } from "./ci-pr.mjs";
import { HERE, git, root, run, worktree } from "./lib.mjs";
import { SPLIT_FROM } from "./matrix.mjs";

const ROOT = root([]);
const tmp = mkdtempSync(join(tmpdir(), "sll-two-way-"));
// Two real runs of ci.yml, read once: main after PR #90 (all green) and an older pull request run where check failed.
const RUN_GREEN = "44446674342";
const RUN_RED = "44306178853";
const jobsOf = (id) => join(tmp, `${id}.json`);

before(() => {
  for (const id of [RUN_GREEN, RUN_RED]) {
    const r = run("gh", ["run", "view", id, "--json", "jobs"]);
    assert.equal(r.code, 0, `cannot read run ${id}: ${r.err}`);
    writeFileSync(jobsOf(id), r.out);
  }
});
after(() => rmSync(tmp, { recursive: true, force: true }));

let copyEnv = process.env;

function measure(script, at, args = []) {
  return run("node", [join(HERE, script), "--root", at, ...args], { env: copyEnv });
}

function withCopy(ref, edit, fn) {
  const wt = worktree(ROOT, ref);
  try {
    copyEnv = wt.env;
    if (edit) edit(wt.dir);
    fn(wt.dir);
  } finally {
    copyEnv = process.env;
    wt.remove();
  }
}

function green(r, name) {
  assert.equal(r.code, 0, r.out + r.err);
  assert.match(r.out, new RegExp(`^${name}: `));
}

function red(r, pinned) {
  assert.equal(r.code, 1, r.out + r.err);
  assert.ok(r.out.includes(pinned), `wanted "${pinned}" in:\n${r.out}`);
}

function swap(at, path, from, to) {
  const p = join(at, path);
  const text = readFileSync(p, "utf8");
  assert.ok(text.includes(from), `${path} has no "${from}" to break`);
  writeFileSync(p, text.replace(from, to));
}

const logEntries = (at) => readdirSync(join(at, "wiki/log")).filter((f) => /^\d{4}-\d{2}-\d{2}-\d{2}-.+\.md$/.test(f)).sort();

test("so-log: green on a sound copy; red when an entry is gone, when one is there twice, when wiki/log.md is in git", () => {
  withCopy("HEAD", null, (at) => green(measure("so-log.mjs", at), "so-log"));
  withCopy("HEAD", (at) => git(at, "rm", "-q", `wiki/log/${logEntries(at)[0]}`), (at) => red(measure("so-log.mjs", at), "so-log: entry missing: - 2026-11-09 — "));
  withCopy(
    "HEAD",
    (at) => {
      const first = logEntries(at)[0];
      copyFileSync(join(at, "wiki/log", first), join(at, "wiki/log", first.replace(/^(\d{4}-\d{2}-\d{2})-\d{2}-/, "$1-99-")));
    },
    (at) => red(measure("so-log.mjs", at), "so-log: entry 2 times: - 2026-11-09 — "),
  );
  withCopy(
    "HEAD",
    (at) => {
      assert.equal(run("make", ["-s", "wiki-derived"], { cwd: at }).code, 0);
      git(at, "add", "-f", "wiki/log.md");
    },
    (at) => red(measure("so-log.mjs", at), "so-log: wiki/log.md is in git"),
  );
  withCopy(
    "HEAD",
    (at) => writeFileSync(join(at, "wiki/log/2026-11-10-99-chen-ngay-cu.md"), "Một mục mới mang ngày trước khi tách.\n"),
    (at) => red(measure("so-log.mjs", at), "so-log: entry dated before the split that c79189dd did not have: - 2026-11-10 — Một mục mới"),
  );
  withCopy(
    "HEAD",
    (at) => swap(at, "tools/ledgers.py", "for p in reversed(log_entries(root))", "for p in log_entries(root)"),
    (at) => red(measure("so-log.mjs", at), "so-log: not newest first at entry 2"),
  );
  withCopy(
    "HEAD",
    (at) => swap(at, "wiki/log.head.md", "title: Change log of the wiki and notable code changes", "title: Change log of the wiki and notable code change"),
    (at) => red(measure("so-log.mjs", at), "so-log: the head of the drawn log differs from c79189dd"),
  );
  withCopy(
    "HEAD",
    (at) => swap(at, ".repo-setup.json", '"wiki/index.head.md": "0.9.0",', '"wiki/index.head.md": "0.9.0",\n    "wiki/log.head.md": "0.9.0",'),
    (at) => red(measure("so-log.mjs", at), "so-log: .repo-setup.json still keeps wiki/log.head.md"),
  );
});

test("ve-truoc-test: green on a fresh copy; red when the steps no longer wait for derived", () => {
  withCopy("HEAD", null, (at) => green(measure("ve-truoc-test.mjs", at), "ve-truoc-test"));
  withCopy(
    "HEAD",
    (at) => swap(at, "Makefile", "$(HEAVY_TARGETS) build dev: | derived", "$(HEAVY_TARGETS) build dev:"),
    (at) => red(measure("ve-truoc-test.mjs", at), "ve-truoc-test: make check-quick does not draw the wiki log"),
  );
});

test("ke-thua-e10: green on a sound copy; red on the renamed file changed, and before the split", () => {
  withCopy("HEAD", null, (at) => green(measure("ke-thua-e10.mjs", at), "ke-thua-e10"));
  withCopy("HEAD", (at) => appendFileSync(join(at, "mk/design-role-table.mk"), "\n"), (at) => red(measure("ke-thua-e10.mjs", at), "ke-thua-e10: mk/design-role-table.mk is not mk/derived.mk of bd32d73e"));
  withCopy(SPLIT_FROM, null, (at) => red(measure("ke-thua-e10.mjs", at), "ke-thua-e10: ledger log is one-file, not fragments"));
  withCopy(
    "HEAD",
    (at) => swap(at, "mk/derived.mk", "$(if $(DRY),--dry-run)", "$(if $(DRY),--dry-run) && printf x >> wiki/log.md"),
    (at) => red(measure("ke-thua-e10.mjs", at), "ke-thua-e10: make split L=log DRY=1 wrote to the tree"),
  );
});

test("docs-log: green on a sound copy; red before the split, and on a new hand-written instruction", () => {
  withCopy("HEAD", null, (at) => green(measure("docs-log.mjs", at), "docs-log"));
  withCopy(SPLIT_FROM, null, (at) => red(measure("docs-log.mjs", at), "docs-log: docs/van-hanh/xoay-khoa.md still has its old instruction"));
  withCopy(
    "HEAD",
    (at) => appendFileSync(join(at, "docs/van-hanh/khoi-phuc.md"), "\nSau đó thêm một dòng vào `wiki/log.md`.\n"),
    (at) => red(measure("docs-log.mjs", at), "writes wiki/log.md by hand"),
  );
  withCopy(
    "HEAD",
    (at) => appendFileSync(join(at, ".claude/skills/wiki-query/SKILL.md"), "\nAppend a line to `wiki/log.md` after each answer.\n"),
    (at) => red(measure("docs-log.mjs", at), "docs-log: .claude/skills/wiki-query/SKILL.md:"),
  );
});

test("ben-doc: green on a sound copy; red on a new tracked reader of wiki/log.md", () => {
  withCopy("HEAD", null, (at) => green(measure("ben-doc.mjs", at), "ben-doc"));
  withCopy(
    "HEAD",
    (at) => {
      writeFileSync(join(at, "tools/doc-log.mjs"), 'import { readFileSync } from "node:fs";\nconsole.log(readFileSync("wiki/log.md", "utf8").length);\n');
      git(at, "add", "tools/doc-log.mjs");
    },
    (at) => red(measure("ben-doc.mjs", at), "ben-doc: reader not weighed: tools/doc-log.mjs"),
  );
});

test("do-cu: green on a sound copy; red with so-quyet-dinh aimed at wiki/log.md again, and without E10's declaration", () => {
  withCopy("HEAD", null, (at) => green(measure("do-cu.mjs", at), "do-cu"));
  withCopy(
    "HEAD",
    (at) => swap(at, "_acceptance/don-no-bo-kiem/rang/so-quyet-dinh.mjs", '.sort().pop() ?? "wiki/log.md";', '.sort().pop() && "wiki/log.md";'),
    (at) => red(measure("do-cu.mjs", at), "do-cu: so-quyet-dinh exited 1: so-quyet-dinh: ban sao con lien ket cu ma khong do"),
  );
  withCopy(
    "HEAD",
    (at) => swap(at, "_acceptance/upgrade-repo-setup-0-9-0/evals.yaml", "    status: not-run\n    superseded_by: split-log-ledger#AC-3\n", ""),
    (at) => red(measure("do-cu.mjs", at), "do-cu: E10 status is absent, not not-run"),
  );
});

test("ci-pr: green on the jobs of a green run; red on a run where check failed", () => {
  green(measure("ci-pr.mjs", ROOT, ["--jobs", jobsOf(RUN_GREEN)]), "ci-pr");
  red(measure("ci-pr.mjs", ROOT, ["--jobs", jobsOf(RUN_RED)]), "ci-pr: job check ended failure");
  const jobs = JSON.parse(readFileSync(jobsOf(RUN_GREEN), "utf8")).jobs.filter((j) => j.name !== "e2e");
  assert.deepEqual(judge(jobs).problems, ["job e2e is not in the run"]);
});
