// AC-4: the commit check of conventional-commits on the tree, as it will run once the change is on main. The probe
// and judge part of step 2 of the job in .github/workflows/pr-title.yml (between `own_error=` and the GitHub calls,
// taken from the file, never retyped; its sha256 printed) runs in a clean checkout of HEAD (a fresh worktree) with
// pre-commit from `uvx` in place of `pipx run`.
//   - At commit-msg pre-commit runs HOOKS_AT_COMMIT_MSG, and on a message of one dot only `commit-message` fails.
//   - The probe still finds a hook that refuses (exit 0 of the probe part).
//   - Every kit sample of KIT_SUBJECTS is answered 0; "update stuff" and "wip(dan-tu-excel): …" are answered 1.
// Usage: node commits-judged.mjs [--root <dir>] [--in-place]   (--in-place: <dir> is already a clean checkout, for
// two-way.mjs, whose broken copy is a fresh worktree with an uncommitted change)

import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { root, run, verdict, worktree, yaml } from "./lib.mjs";
import { HOOKS_AT_COMMIT_MSG, KIT_SUBJECTS } from "./matrix.mjs";

const NAME = "commits-judged";
const FILE = ".github/workflows/pr-title.yml";
const REFUSED = ["update stuff", "wip(dan-tu-excel): paste path from the clickable preview"];
const dir = root();
const problems = [];
const tmp = mkdtempSync(join(tmpdir(), "cmks-cc-"));
let blockHash = "";
let preCommit = "";

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

const clean = process.argv.includes("--in-place") ? { dir, remove() {} } : worktree(dir, "HEAD");
try {
  const script = harness(readFileSync(join(dir, FILE), "utf8"));
  preCommit = run("uvx", ["pre-commit", "--version"]).out.trim();

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

  const cases = [...KIT_SUBJECTS.map((s) => `${s.sample}\n`), ...REFUSED.map((m) => `${m}\n`)];
  const want = [...KIT_SUBJECTS.map(() => 0), ...REFUSED.map(() => 1)];
  const files = cases.map((m, i) => write(`message-${i}`, m));
  const r = run("bash", [script, ...files], { cwd: clean.dir, env: { ...process.env, RUNNER_TEMP: tmp } });
  const answers = [...r.out.matchAll(/^answer (\d+)$/gm)].map((m) => Number(m[1]));
  if (r.code !== 0) problems.push(`the probe found no hook that refuses (exit ${r.code}): ${(r.out + r.err).trim().split("\n").pop()}`);
  if (JSON.stringify(answers) !== JSON.stringify(want)) {
    problems.push(`the hooks answered ${JSON.stringify(answers)}, not ${JSON.stringify(want)} (the ${KIT_SUBJECTS.length} kit samples, then ${REFUSED.join(", ")})`);
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
  `block ${blockHash} of pr-title.yml, with ${preCommit || "pre-commit"} from uvx in a clean checkout of HEAD: ${HOOKS_AT_COMMIT_MSG.length} hooks run at commit-msg and only commit-message refuses the probe; the ${KIT_SUBJECTS.length} kit subjects pass, ${REFUSED.map((m) => `"${m.split(":")[0]}"`).join(" and ")} are refused`,
);
