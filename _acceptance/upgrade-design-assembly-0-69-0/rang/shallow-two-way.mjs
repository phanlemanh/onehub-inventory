// The shallow measure (shallow-alone.mjs) seen red, with its pinned messages, on the two breaks of
// its clone: origin without main, and origin's main older than where the branch left it.
// Each case runs with its own temporary folder (TMPDIR), so a measure running beside it never shows
// up here, and checks the case left no clone behind there.
import { readdirSync, rmSync } from "node:fs";
import path from "node:path";

import { HERE, ROOT, run, scratch } from "./lib.mjs";
import { NO_MAIN, OLDER_MAIN, ROWS } from "./matrix.mjs";

let failed = 0;

function red(label, wants, args, also = () => []) {
  const own = scratch("case");
  const r = run("node", [path.join(HERE, "shallow-alone.mjs"), ...args], ROOT, { TMPDIR: own });
  const missing = [...wants.filter((want) => !r.out.includes(want)), ...also(r.out)];
  const made = readdirSync(own).filter((name) => name.startsWith("upgrade-0-69-0-shallow-"));
  rmSync(own, { recursive: true, force: true });
  // The clone was made in this case's folder (positive), and removed from it (none left).
  if (!r.out.includes(`alone: clone made in ${own}`)) missing.push(`the clone made in this case's folder ${own}`);
  if (made.length) missing.push(`no clone left behind (left: ${made.join(", ")})`);
  const ok = r.status === 1 && missing.length === 0;
  if (!ok) failed += 1;
  process.stdout.write(`${ok ? "held" : "FAILED"}: ${label} (red)\n`);
  if (!ok) process.stdout.write(`  wanted exit 1 and ${JSON.stringify(missing)}; got exit ${r.status}:\n${r.out}\n`);
}

red(
  "shallow-alone: red when origin has no main",
  ["alone: make design-assembly exit 2", "alone: decision-sheet did not say main was fetched from origin", "alone: choose-first read no base on the clone"],
  ["--no-main"],
  // Each row on its own line says it has no main to compare with: the row and the reason together.
  (out) =>
    ROWS.filter((row) => !out.split("\n").some((line) => line.includes(`${row}: what this branch`) && line.includes(NO_MAIN))).map(
      (row) => `${row}: what this branch … ${NO_MAIN}`,
    ),
);
red("shallow-alone: red when origin main is older", [`alone: the clone left main at ${OLDER_MAIN.slice(0, 8)}`], ["--main-at", OLDER_MAIN]);
process.exitCode = failed ? 1 : 0;
