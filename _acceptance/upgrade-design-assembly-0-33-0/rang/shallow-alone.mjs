// AC-5: on a fresh depth-1 clone of HEAD whose origin has main where HEAD leaves origin/main,
// `make design-assembly` alone is green, both rows that compare with main say they fetched it, and
// the clone leaves main where HEAD does.
// Usage: node shallow-alone.mjs [--root <repository>] [--main-at <rev>] [--no-main]
//   (--main-at and --no-main set the middle repository's main, for the break copies)
import path from "node:path";

import { branchBase, git, head, leftMain, option, ROOT, run, shallowClone } from "./lib.mjs";
import { FETCHED, GATE, gateLine, ROWS } from "./matrix.mjs";

const root = path.resolve(option("--root", ROOT));
const sha = head(root);
const base = branchBase(root);
const mainAt = option("--main-at", base);
const clone = shallowClone(root, sha, { mainAt });
const found = [];
let make;
let left;
try {
  if (process.argv.includes("--no-main")) git(path.join(clone.dir, "mid"), "update-ref", "-d", "refs/heads/main");
  make = run("make", ["design-assembly"], clone.kho);
  left = leftMain(clone.kho);
} finally {
  clone.remove();
}
if (make.status !== 0) found.push(`make design-assembly exit ${make.status}`);
if (!make.out.includes(gateLine(GATE))) found.push(`make design-assembly did not say: ${gateLine(GATE)}`);
for (const row of ROWS) if (!make.out.includes(FETCHED(row))) found.push(`${row} did not say main was fetched from origin`);
if (left !== base) found.push(`the clone left main at ${left ? left.slice(0, 8) : "nowhere"}, not ${base.slice(0, 8)}`);
for (const line of found) process.stdout.write(`alone: ${line}\n`);
if (found.length > 0) process.stdout.write(`--- make design-assembly said:\n${make.out}\n`);
if (found.length === 0) {
  process.stdout.write(
    `alone: make design-assembly green on a fresh depth-1 clone of ${sha.slice(0, 12)} with origin main at ${base.slice(0, 8)}; ${ROWS.join(" and ")} each said main was fetched from origin; the clone left main at ${base.slice(0, 8)}\n`,
  );
}
process.exitCode = found.length ? 1 : 0;
