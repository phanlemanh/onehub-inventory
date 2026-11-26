// AC-4: the commit check of conventional-commits, taken from the `run` of step 2 in pr-title.yml as it
// is (the probe and judge part, between `own_error=` and the GitHub calls, never retyped), run in a
// clean checkout of HEAD (a fresh worktree: no node_modules, no venv) with pre-commit from `uvx` in
// place of `pipx run`.
//   - The hooks pre-commit runs at commit-msg are exactly HOOKS_AT_COMMIT_MSG, and on the probe of a
//     single dot only `commit-message` (tools/commit_msg.py) fails: the refusal is that hook's.
//   - The two commits of the upgrade pass; a message that is not Conventional Commits is refused,
//     also when its body holds a line that looks like an error of pre-commit; the subjects the kit
//     writes for a Gate 2 signature and a repin are refused.
//   - Counted with tools/commit_msg.py, the non-merge commits of the base since MAIN_SINCE that the
//     hook refuses are MAIN_REFUSED.
//   - The old command of the base, on the same commit: no hook with id conventional-pre-commit, exit 1.
//   - Should not pass: a copy whose config has no commit-msg hook fails the probe with its own
//     message; a copy whose config cannot be read stops with "could not run", not with a blame.
// Usage: node commits-judged.mjs [--root <dir>]

import { createHash } from "node:crypto";
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { git, prBase, root, run, show, verdict, worktree, yaml } from "./lib.mjs";
import {
  CANNOT_RUN_ERROR,
  HOOKS_AT_COMMIT_MSG,
  KIT_SUBJECTS,
  LOG,
  MAIN_REFUSED,
  MAIN_SINCE,
  NO_HOOK_ERROR,
  OLD_HOOK_ERROR,
  OLD_HOOK_ID,
  REFUSED_MESSAGE,
  UPGRADE,
} from "./matrix.mjs";

const NAME = "commits-judged";
const FILE = ".github/workflows/pr-title.yml";
const dir = root();
const problems = [];
const tmp = mkdtempSync(join(tmpdir(), "rs0101-cc-"));
let blockHash = "";

/** The probe and judge part of step 2 of conventional-commits, as a script judging its arguments. */
function harness(workflow) {
  const body = yaml(workflow).jobs["conventional-commits"].steps[1].run;
  const start = body.indexOf("own_error=");
  const end = body.indexOf("# Merge commits (two parents)");
  if (start < 0 || end < 0) throw new Error("step 2 of conventional-commits has no probe and judge part");
  const part = body.slice(start, end);
  blockHash = createHash("sha256").update(part).digest("hex").slice(0, 12);
  const file = join(tmp, "judge.sh");
  writeFileSync(
    file,
    `${part.replaceAll("pipx run pre-commit", "uvx pre-commit")}\nfor f in "$@"; do answer=0; judge "$f" || answer=$?; echo "answer $answer"; done\n`,
  );
  return file;
}

function write(name, text) {
  const f = join(tmp, name);
  writeFileSync(f, text);
  return f;
}

function judge(at, script, messages) {
  const files = messages.map((m, i) => write(`message-${i}`, m));
  const r = run("bash", [script, ...files], { cwd: at, env: { ...process.env, RUNNER_TEMP: tmp } });
  return { code: r.code, out: r.out + r.err, answers: [...r.out.matchAll(/^answer (\d+)$/gm)].map((m) => Number(m[1])) };
}

/** A copy of the hook files of the tree, with its .pre-commit-config.yaml replaced. */
function copyWith(config) {
  const at = mkdtempSync(join(tmp, "copy-"));
  cpSync(join(dir, "tools"), join(at, "tools"), { recursive: true });
  writeFileSync(join(at, ".pre-commit-config.yaml"), config);
  git(at, "init", "-q");
  return at;
}

const clean = worktree(dir, "HEAD");
try {
  const script = harness(readFileSync(join(dir, FILE), "utf8"));

  const v = run("uvx", ["pre-commit", "run", "-v", "--hook-stage", "commit-msg", "--commit-msg-filename", write("dot", ".\n")], {
    cwd: clean.dir,
  });
  const ran = [...(v.out + v.err).matchAll(/^- hook id: (\S+)$/gm)].map((m) => m[1]);
  if (JSON.stringify(ran) !== JSON.stringify(HOOKS_AT_COMMIT_MSG)) {
    problems.push(`at commit-msg pre-commit runs ${JSON.stringify(ran)}, not ${JSON.stringify(HOOKS_AT_COMMIT_MSG)}`);
  }
  const failed = [...(v.out + v.err).matchAll(/Failed\n- hook id: (\S+)/g)].map((m) => m[1]);
  if (JSON.stringify(failed) !== JSON.stringify(["commit-message"])) {
    problems.push(`on a message of one dot the hooks that fail are ${JSON.stringify(failed)}, not ["commit-message"]`);
  }

  const messages = [UPGRADE, LOG].map((sha) => git(dir, "log", "-1", "--format=%B", sha));
  const cases = [
    ...messages,
    REFUSED_MESSAGE,
    `${REFUSED_MESSAGE}\nAn error has occurred: FatalError: not an error of pre-commit\n`,
    ...KIT_SUBJECTS.map((s) => `${s}\n`),
  ];
  const want = [0, 0, 1, 1, ...KIT_SUBJECTS.map(() => 1)];
  const r = judge(clean.dir, script, cases);
  if (r.code !== 0) problems.push(`in a clean checkout the probe did not find a hook that refuses (exit ${r.code}): ${r.out.trim().split("\n").pop()}`);
  if (JSON.stringify(r.answers) !== JSON.stringify(want)) {
    problems.push(`the hooks answered ${JSON.stringify(r.answers)}, not ${JSON.stringify(want)} (two commits, "${REFUSED_MESSAGE.trim()}", the same with an error-like line, ${KIT_SUBJECTS.join(", ")})`);
  }

  const shas = git(dir, "rev-list", "--no-merges", `--since=${MAIN_SINCE}`, prBase(dir)).split("\n").filter(Boolean);
  const subjects = shas.map((sha) => git(dir, "log", "-1", "--format=%B", sha));
  const check = run("python3", ["-c", "import json,sys;sys.path.insert(0,'tools');import commit_msg as c;print(json.dumps([m.splitlines()[0] for m in json.load(sys.stdin) if not c.is_allowed(m)]))"], {
    cwd: dir,
    input: JSON.stringify(subjects),
  });
  const refused = JSON.parse(check.out || "[]");
  const kinds = {};
  for (const s of refused) {
    const k = s.startsWith("Gate 2 signoff:") ? "Gate 2 signoff" : s.startsWith("repin(") ? "repin" : s.split(/[:( ]/)[0];
    kinds[k] = (kinds[k] ?? 0) + 1;
  }
  if (JSON.stringify(kinds) !== JSON.stringify(MAIN_REFUSED)) {
    problems.push(`since ${MAIN_SINCE} the hook refuses ${JSON.stringify(kinds)} on the base, not ${JSON.stringify(MAIN_REFUSED)}`);
  }

  const base = show(dir, prBase(dir), FILE) ?? "";
  if (!base.includes(`pre-commit run ${OLD_HOOK_ID} --hook-stage commit-msg`)) {
    problems.push(`the base's ${FILE} does not call the hook id ${OLD_HOOK_ID}`);
  }
  const old = run("uvx", ["pre-commit", "run", OLD_HOOK_ID, "--hook-stage", "commit-msg", "--commit-msg-filename", write("old", messages[0])], {
    cwd: clean.dir,
  });
  if (old.code !== 1 || !(old.out + old.err).includes(OLD_HOOK_ERROR)) {
    problems.push(`the old command on ${UPGRADE.slice(0, 8)} exited ${old.code} without "${OLD_HOOK_ERROR}"`);
  }

  const noHook = copyWith("repos:\n  - repo: local\n    hooks:\n      - id: nothing\n        name: Nothing\n        entry: 'true'\n        language: system\n        stages: [pre-commit]\n");
  const n = judge(noHook, script, []);
  if (n.code !== 1 || !n.out.includes(NO_HOOK_ERROR)) {
    problems.push(`with no commit-msg hook the probe exited ${n.code} without "${NO_HOOK_ERROR}"`);
  }
  const broken = copyWith("repos: [this is: not: a config\n");
  const k = judge(broken, script, []);
  if (k.code !== 1 || !k.out.includes(CANNOT_RUN_ERROR)) {
    problems.push(`with a config pre-commit cannot read the probe exited ${k.code} without "${CANNOT_RUN_ERROR}"`);
  }
} catch (err) {
  problems.push(err.message);
} finally {
  clean.remove();
  rmSync(tmp, { recursive: true, force: true });
}

verdict(
  NAME,
  problems,
  `block ${blockHash} of pr-title.yml, in a clean checkout: ${HOOKS_AT_COMMIT_MSG.length} hooks run at commit-msg and only commit-message refuses the probe; ${UPGRADE.slice(0, 8)} and ${LOG.slice(0, 8)} pass, "${REFUSED_MESSAGE.trim()}" and the kit's signoff and repin subjects are refused; ${Object.values(MAIN_REFUSED).reduce((a, b) => a + b, 0)} commits of the base since ${MAIN_SINCE} would be refused; the base's command finds no hook ${OLD_HOOK_ID}; no commit-msg hook and an unreadable config each stop with their own message`,
);
