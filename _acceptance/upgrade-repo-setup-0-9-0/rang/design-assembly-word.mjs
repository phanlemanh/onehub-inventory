// AC-7: `check` names design-assembly for the 0.7.1 tool, the tool holds 19 decisions by 27 checks,
// and without the word on the check line the tool's gate check goes red with its own message.
// Usage: node design-assembly-word.mjs [--root <dir>]

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { root, run, verdict, worktree } from "./lib.mjs";
import { DA_LINE } from "./matrix.mjs";

const NAME = "design-assembly-word";
const dir = root();
const problems = [];
const GATE_RED = "checks-in-gate: the Makefile's check target no longer runs CHECK_TARGETS";

function prerequisites(at) {
  const db = run("make", ["-pn", "check"], { cwd: at }).out;
  const line = db.split("\n").find((l) => l.startsWith("check:"));
  return line ? line.slice("check:".length).split("#")[0].trim().split(/\s+/) : [];
}

try {
  const pre = prerequisites(dir);
  if (JSON.stringify(pre) !== JSON.stringify(["check-quick", "check-heavy", "design-assembly"])) {
    problems.push(`check depends on [${pre.join(", ")}], not [check-quick, check-heavy, design-assembly]`);
  }
  const tool = run("node", ["tools/design-assembly/check.mjs"], { cwd: dir });
  if (tool.code !== 0 || !(tool.out + tool.err).includes(DA_LINE)) {
    problems.push(`tools/design-assembly/check.mjs exited ${tool.code} without "${DA_LINE}"`);
  }

  const wt = worktree(dir, "HEAD");
  try {
    const mk = join(wt.dir, "Makefile");
    writeFileSync(mk, readFileSync(join(dir, "Makefile"), "utf8").replace(/^(check: check-quick check-heavy) design-assembly/m, "$1"));
    run("ln", ["-s", join(dir, "node_modules"), join(wt.dir, "node_modules")]);
    const red = run("node", ["tools/design-assembly/check.mjs"], { cwd: wt.dir });
    if (red.code === 0) problems.push("without the word the tool's gate check stays green");
    else if (!(red.out + red.err).includes(GATE_RED)) problems.push(`without the word the tool does not say "${GATE_RED}"`);
  } finally {
    wt.remove();
  }
} catch (err) {
  problems.push(err.message);
}

verdict(
  NAME,
  problems,
  `check depends on check-quick, check-heavy, design-assembly; the tool holds 19 decisions by 27 checks; without the word on the check line it says ${GATE_RED}`,
);
