// AC-2: on a depth-1 clone of HEAD, made the way the CI checkout and db/scripts/ci-thu.sh make one,
// with an origin whose main is where the branch left main, `make check` is green, the gate holds the
// two new rows, and the test count is the one pinned. Nothing is installed: node_modules is an APFS
// clone of the repository's own. Whatever the outcome, it prints the gate line and the manifest line
// make check printed, so a red run shows what the gate said and not only what it did not say.
// Usage: node shallow-check.mjs [--root <repository>] [--rev <commit>] [--main-at <commit>]
//   [--components <count>] [--tests <passed>]   (breaks: the manifest line and test count it must find)
import { spawnSync } from "node:child_process";
import path from "node:path";

import { leftMain, option, ROOT, shallowClone } from "./lib.mjs";
import { BASE, COMPONENTS, GATE, gateLine, manifestLine, TESTS } from "./matrix.mjs";

const GATE_SAID = /design-assembly: \d+ decisions held by \d+ checks[^\n]*/;
const MANIFEST_SAID = /component manifest: design\/component-registry\.json is up to date \(\d+ components\)/;

const root = path.resolve(option("--root", ROOT));
const rev = option("--rev", "HEAD");
const mainAt = option("--main-at", BASE);
const wantTests = { passed: Number(option("--tests", TESTS.passed)), skipped: TESTS.skipped };
const mustSay = [gateLine(GATE), manifestLine(Number(option("--components", COMPONENTS)))];
const found = [];
const said = [];
let clone;
try {
  clone = shallowClone(root, rev, { mainAt });
  const run = spawnSync("make", ["check"], { cwd: clone.kho, encoding: "utf8", maxBuffer: 1 << 28 });
  const out = `${run.stdout}${run.stderr}`;
  const sha = spawnSync("git", ["-C", clone.kho, "rev-parse", "HEAD"], { encoding: "utf8" }).stdout.trim();
  said.push(`the gate said: ${out.match(GATE_SAID)?.[0] ?? "nothing"}`);
  said.push(`the manifest said: ${out.match(MANIFEST_SAID)?.[0] ?? "nothing"}`);
  if (run.status !== 0) {
    const tail = out.trim().split("\n").slice(-6).join(" | ");
    found.push(`make check exit ${run.status} on the shallow clone of ${sha.slice(0, 8)}: ${tail}`);
  }
  for (const line of mustSay) if (!out.includes(line)) found.push(`make check did not say: ${line}`);
  const tests = out.match(/Tests\s+(\d+) passed(?: \| (\d+) skipped)?/);
  if (!tests) found.push("make check printed no test count");
  else {
    const got = { passed: Number(tests[1]), skipped: Number(tests[2] ?? 0) };
    if (got.passed !== wantTests.passed || got.skipped !== wantTests.skipped) {
      found.push(
        `make check passed ${got.passed} tests and skipped ${got.skipped}, not ${wantTests.passed} and ${wantTests.skipped}`,
      );
    }
  }
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
for (const line of said) process.stdout.write(`shallow, ${line}\n`);
process.exitCode = found.length ? 1 : 0;
