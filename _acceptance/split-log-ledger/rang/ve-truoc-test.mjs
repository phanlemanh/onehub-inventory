// AC-2: a fresh checkout has no wiki/log.md; the light tier CI runs (`make check-quick`) draws it before the
// first test, and tests/khong-o-tim.test.ts, which reads it, passes once it is drawn.
// Usage: node ve-truoc-test.mjs [--root <fresh copy>]   (no --root: a fresh worktree of HEAD)

import { existsSync } from "node:fs";
import { join } from "node:path";

import { arg, root, run, verdict, worktree } from "./lib.mjs";

const NAME = "ve-truoc-test";
const given = arg("--root");
const wt = given ? null : worktree(root([]), "HEAD");
const dir = given ? root() : wt.dir;
const problems = [];

try {
  if (existsSync(join(dir, "wiki/log.md"))) problems.push("a fresh checkout already has wiki/log.md");
  const plan = run("make", ["-n", "check-quick"], { cwd: dir }).out.split("\n");
  const draw = plan.findIndex((l) => l.includes("tools/ledgers.py draw") && !l.includes("draw-gen"));
  const test = plan.findIndex((l) => /\bvitest\b|npm run --silent test\b/.test(l));
  if (draw < 0) problems.push("make check-quick does not draw the wiki log");
  if (test < 0) problems.push("make check-quick runs no test");
  if (draw >= 0 && test >= 0 && draw > test) problems.push("make check-quick runs the tests before it draws the wiki log");
  const drew = run("make", ["-s", "derived"], { cwd: dir });
  if (drew.code !== 0) problems.push(`make derived exited ${drew.code}: ${(drew.out + drew.err).trim().split("\n").pop()}`);
  const t = run("npx", ["vitest", "run", "tests/khong-o-tim.test.ts", "--coverage.enabled=false"], { cwd: dir });
  if (t.code !== 0) problems.push(`tests/khong-o-tim.test.ts exited ${t.code}: ${(t.out + t.err).trim().split("\n").filter(Boolean).slice(-3).join(" | ")}`);
} catch (err) {
  problems.push(err.message);
} finally {
  wt?.remove();
}

verdict(NAME, problems, "a fresh checkout has no wiki/log.md; make check-quick draws it before it runs the tests; tests/khong-o-tim.test.ts passes once it is drawn");
