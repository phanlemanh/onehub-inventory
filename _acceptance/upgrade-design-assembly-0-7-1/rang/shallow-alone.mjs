// AC-3: on a fresh depth-1 clone of HEAD, the gate run alone (`make design-assembly`, never make
// check: inside make check the proof gate fetches the whole history first) is green, and both new
// rows say they fetched main from origin themselves; the clone then leaves main where the branch did.
// Usage: node shallow-alone.mjs [--root <repository>] [--rev <commit>] [--main-at <commit>]
//   [--owner-calls-from <commit>]   (a break: tools/design-assembly/owner-calls.mjs as it was there)
import { spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import path from "node:path";

import { git, leftMain, option, ROOT, shallowClone } from "./lib.mjs";
import { BASE, FETCHED, NO_MAIN, ROWS, TOOL_FOLDER } from "./matrix.mjs";

const root = path.resolve(option("--root", ROOT));
const rev = option("--rev", "HEAD");
const mainAt = option("--main-at", BASE);
const toolFrom = option("--owner-calls-from");
const found = [];
const said = [];
let clone;
try {
  clone = shallowClone(root, rev, { mainAt });
  if (toolFrom) {
    const file = `${TOOL_FOLDER}/owner-calls.mjs`;
    writeFileSync(path.join(clone.kho, file), git(root, "show", `${toolFrom}:${file}`));
  }
  const run = spawnSync("make", ["design-assembly"], { cwd: clone.kho, encoding: "utf8", maxBuffer: 1 << 28 });
  const out = `${run.stdout}${run.stderr}`;
  const sha = git(clone.kho, "rev-parse", "HEAD").trim();
  if (run.status !== 0) found.push(`make design-assembly exit ${run.status}`);
  for (const row of ROWS) if (!out.includes(FETCHED(row))) found.push(`${row} did not say main was fetched from origin`);
  said.push(...out.split("\n").filter((line) => line.includes(NO_MAIN)).map((line) => line.trim()));
  const left = leftMain(clone.kho);
  if (left !== BASE) found.push(`the clone left main at ${left ? left.slice(0, 8) : "nowhere"}, not ${BASE.slice(0, 8)}`);
  if (!found.length) {
    process.stdout.write(
      `alone: make design-assembly green on a fresh depth-1 clone of ${sha.slice(0, 8)} with origin main at ${mainAt.slice(0, 8)}; decision-sheet and owner-calls each said main was fetched from origin; the clone left main at ${BASE.slice(0, 8)}\n`,
    );
  }
} catch (error) {
  found.push(error.message.split("\n")[0]);
} finally {
  clone?.remove();
}
for (const line of found) process.stdout.write(`alone: ${line}\n`);
for (const line of said) process.stdout.write(`alone, the gate said: ${line}\n`);
process.exitCode = found.length ? 1 : 0;
