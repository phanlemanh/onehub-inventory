// AC-2: on a depth-1 clone of HEAD, made the way the CI checkout and db/scripts/ci-thu.sh make one,
// with an origin whose main is where the branch left main, `make check` is green and the gate holds
// the two new rows. Nothing is installed: node_modules is an APFS clone of the repository's own.
// Usage: node shallow-check.mjs [--root <repository>] [--rev <commit>] [--main-at <commit>]
//   [--components <count>]   (--components is a break: the manifest line it must find)
import { spawnSync } from "node:child_process";
import path from "node:path";

import { leftMain, option, ROOT, shallowClone } from "./lib.mjs";
import { BASE, COMPONENTS, GATE, gateLine, manifestLine } from "./matrix.mjs";

const root = path.resolve(option("--root", ROOT));
const rev = option("--rev", "HEAD");
const mainAt = option("--main-at", BASE);
const mustSay = [gateLine(GATE), manifestLine(Number(option("--components", COMPONENTS)))];
const found = [];
let clone;
try {
  clone = shallowClone(root, rev, { mainAt });
  const run = spawnSync("make", ["check"], { cwd: clone.kho, encoding: "utf8", maxBuffer: 1 << 28 });
  const out = `${run.stdout}${run.stderr}`;
  const sha = spawnSync("git", ["-C", clone.kho, "rev-parse", "HEAD"], { encoding: "utf8" }).stdout.trim();
  if (run.status !== 0) {
    const tail = out.trim().split("\n").slice(-6).join(" | ");
    found.push(`make check exit ${run.status} on the shallow clone of ${sha.slice(0, 8)}: ${tail}`);
  }
  for (const line of mustSay) if (!out.includes(line)) found.push(`make check did not say: ${line}`);
  const tests = out.match(/Tests\s+(\d+) passed/);
  if (!tests) found.push("make check printed no test count");
  const left = leftMain(clone.kho);
  if (left !== BASE) found.push(`the clone left main at ${left ? left.slice(0, 8) : "nowhere"}, not ${BASE.slice(0, 8)}`);
  if (!found.length) {
    process.stdout.write(
      `shallow: make check green on a depth-1 clone of ${sha.slice(0, 8)} with origin main at ${mainAt.slice(0, 8)}; ${tests[1]} tests passed; the gate held ${GATE.decisions} decisions by ${GATE.checks} checks; the component manifest is up to date (${COMPONENTS} components); the clone left main at ${BASE.slice(0, 8)}\n`,
    );
  }
} catch (error) {
  found.push(error.message.split("\n")[0]);
} finally {
  clone?.remove();
}
for (const line of found) process.stdout.write(`shallow: ${line}\n`);
process.exitCode = found.length ? 1 : 0;
