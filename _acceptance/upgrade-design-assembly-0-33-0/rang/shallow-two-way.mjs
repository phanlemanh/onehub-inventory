// The shallow measure (shallow-alone.mjs) seen red, with its pinned messages, on the two breaks of
// its clone: origin without main, and origin's main older than where the branch left it.
// Each case makes its own fresh clone in its own temporary folder, and checks none is left behind.
import { readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import { HERE, ROOT, run } from "./lib.mjs";
import { BASE, NO_MAIN, ROWS } from "./matrix.mjs";

let failed = 0;
const leftovers = () => readdirSync(tmpdir()).filter((name) => name.startsWith("upgrade-0-36-1-shallow-"));
const before = new Set(leftovers());

function red(label, wants, args) {
  const r = run("node", [path.join(HERE, "shallow-alone.mjs"), ...args], ROOT);
  const missing = wants.filter((want) => !r.out.includes(want));
  const ok = r.status === 1 && missing.length === 0;
  if (!ok) failed += 1;
  process.stdout.write(`${ok ? "held" : "FAILED"}: ${label} (red)\n`);
  if (!ok) process.stdout.write(`  wanted exit 1 and ${JSON.stringify(missing)}; got exit ${r.status}:\n${r.out}\n`);
}

red(
  "shallow-alone: red when origin has no main",
  [
    "alone: make design-assembly exit 2",
    "alone: decision-sheet did not say main was fetched from origin",
    ...ROWS.map((row) => `${row}: what this branch`),
    NO_MAIN,
  ],
  ["--no-main"],
);
red("shallow-alone: red when origin main is older", [`alone: the clone left main at ${BASE.slice(0, 8)}`], ["--main-at", BASE]);
const left = leftovers().filter((name) => !before.has(name));
if (left.length) {
  failed += 1;
  process.stdout.write(`FAILED: clones left behind: ${left.join(", ")}\n`);
}
process.exitCode = failed ? 1 : 0;
