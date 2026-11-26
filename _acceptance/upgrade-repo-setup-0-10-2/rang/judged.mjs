// AC-5: the fence changes how the judging step prints, not what it decides. The step of HEAD and the
// step of the base (each taken from its pr-title.yml) run in the same clean checkout of HEAD, with
// the repository's own hooks and pre-commit from uvx, one commit per run.
//   - Each message of ANSWERS gets the answer the matrix names, from both steps.
//   - Merge settings that squash: the step passes and judges nothing (exit 0), on both.
//   - Should not pass: a copy with no commit-msg hook stops on the probe with NO_HOOK_ERROR; a copy
//     whose config cannot be read stops with CANNOT_RUN_ERROR, not with a blame, and on HEAD what
//     pre-commit printed is inside a fence.
// --workflow <file> stands in for the pr-title.yml of HEAD (two-way.mjs).
// Usage: node judged.mjs [--root <dir>] [--workflow <file>]

import { readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

import { WORKFLOW, fences, git, judgeStep, messageOf, prBase, root, run, runStep, show, verdict, worktree } from "./lib.mjs";
import { ANSWERS, CANNOT_RUN_ERROR, NO_HOOK_ERROR } from "./matrix.mjs";

const NAME = "judged";
const dir = root();
const wi = process.argv.indexOf("--workflow");
const workflowFile = wi >= 0 ? resolve(process.argv[wi + 1]) : join(dir, WORKFLOW);
const problems = [];
const copies = [];
let version = "";

function copy() {
  const c = worktree(dir, "HEAD");
  copies.push(c);
  return c.dir;
}

try {
  version = run("uvx", ["pre-commit", "--version"]).out.trim();
  const steps = {
    HEAD: judgeStep(readFileSync(workflowFile, "utf8")),
    base: judgeStep(show(dir, prBase(dir), WORKFLOW) ?? ""),
  };
  const clean = copy();
  const commit = (m) => [{ sha: "a".repeat(40), message: m }];
  for (const a of ANSWERS) {
    const message = a.from ? messageOf(dir, a.from) : a.message;
    for (const [where, body] of Object.entries(steps)) {
      const r = runStep(clean, body, { commits: commit(message) });
      if (r.code !== a.want) problems.push(`the step of ${where} answers ${r.code} on ${a.name}, not ${a.want}: ${(r.out + r.err).trim().split("\n").pop()}`);
    }
  }
  for (const [where, body] of Object.entries(steps)) {
    const r = runStep(clean, body, { commits: commit("update stuff\n"), keeps: "false" });
    if (r.code !== 0) problems.push(`the step of ${where} exited ${r.code} where the repository squashes, not 0`);
  }

  const none = copy();
  writeFileSync(join(none, ".pre-commit-config.yaml"), "repos: []\n");
  git(none, "add", ".pre-commit-config.yaml");
  const broken = copy();
  writeFileSync(join(broken, ".pre-commit-config.yaml"), "repos: [\n");
  git(broken, "add", ".pre-commit-config.yaml");
  for (const [where, body] of Object.entries(steps)) {
    const n = runStep(none, body, { commits: commit("fix: a\n") });
    if (n.code !== 1 || !(n.out + n.err).includes(NO_HOOK_ERROR)) {
      problems.push(`with no commit-msg hook the step of ${where} exited ${n.code} without "${NO_HOOK_ERROR}"`);
    }
    const b = runStep(broken, body, { commits: commit("fix: a\n") });
    const out = b.out + b.err;
    if (b.code !== 1 || !out.includes(CANNOT_RUN_ERROR)) problems.push(`with a config it cannot read the step of ${where} exited ${b.code} without "${CANNOT_RUN_ERROR}"`);
    if (/does not pass this repository's commit-msg hooks/.test(out)) problems.push(`with a config it cannot read the step of ${where} blames a commit`);
    if (where === "HEAD") {
      const f = fences(out);
      if (f.fences.length !== 1 || !f.fences[0].lines.some((l) => /An (unexpected )?error has occurred/.test(l))) {
        problems.push("on HEAD what pre-commit printed when it could not run is not inside one fence");
      }
    }
  }
} catch (err) {
  problems.push(err.message);
} finally {
  copies.forEach((c) => c.remove());
}

verdict(
  NAME,
  problems,
  `with ${version} the step of HEAD and the step of the base give the same answer on each of the ${ANSWERS.length} messages (the upgrade commit and a Gate 2 signoff pass; "update stuff", wip(dan-tu-excel) and a refusal that looks like an error of pre-commit are refused); both pass where the repository squashes, and both stop with their own message on no commit-msg hook and on a config they cannot read, HEAD's output fenced`,
);
