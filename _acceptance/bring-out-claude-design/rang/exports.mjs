// AC-2: the five exports are what the design ledgers write at HEAD — writing them again in a clone
// changes no byte — each names the same ledger state, design/theme.json holds all five under the
// design-exports decision, and the gate, run on the clone, holds them with its pinned count.
// Usage: node exports.mjs [--root <repository or a clone with a committed change>]
import { readFileSync } from "node:fs";
import path from "node:path";

import { derive, git, head, lines, option, report, ROOT, run, workClone } from "./lib.mjs";
import { EXPORT_DECISION, EXPORTS, GATE, gateLine, STAMP, STAMP_LINE, THEME } from "./matrix.mjs";

const root = path.resolve(option("--root", ROOT));
const found = [];
const clone = workClone(root);
try {
  const derived = derive(clone.dir);
  if (derived.status !== 0) found.push(`the derived files were not written (exit ${derived.status}): ${derived.out.trim()}`);
  const read = (rel) => readFileSync(path.join(clone.dir, rel), "utf8");

  // Which ledger state each export names, as committed.
  for (const file of EXPORTS) {
    const at = read(file).match(STAMP_LINE)?.[1];
    if (at !== STAMP) found.push(`${file} names the ledgers at ${at ?? "no state"}, not ${STAMP}`);
  }

  // design/theme.json lists the five, in order, under the decision.
  const listed = (JSON.parse(read(THEME)).checks?.[EXPORT_DECISION] ?? []).filter((c) => c.kind === "export").map((c) => c.file);
  if (JSON.stringify(listed) !== JSON.stringify(EXPORTS)) {
    found.push(`${EXPORT_DECISION} in ${THEME} lists ${JSON.stringify(listed)}, not ${JSON.stringify(EXPORTS)}`);
  }

  // The gate on the committed clone: green, and the exports are not stale.
  const gate = run("node", ["tools/design-assembly/check.mjs"], clone.dir);
  if (gate.status !== 0) {
    const own = lines(gate.out).find((line) => line.trim().startsWith(`${EXPORT_DECISION}:`));
    found.push(own ? `the gate did not hold the exports: ${own.trim()}` : `the gate exit ${gate.status}`);
  } else if (!gate.out.includes(gateLine(GATE))) {
    found.push(`the gate did not say: ${gateLine(GATE)}`);
  }

  // Writing again changes nothing.
  const wrote = run("node", ["tools/design-assembly/exports.mjs", "--write"], clone.dir);
  if (wrote.status !== 0) found.push(`make design-exports exit ${wrote.status}: ${wrote.out.trim()}`);
  for (const file of lines(git(clone.dir, "status", "--porcelain", "--", ...EXPORTS)).map((l) => l.slice(3))) {
    found.push(`${file} is not what the ledgers write at HEAD: write it again with make design-exports`);
  }
} finally {
  clone.remove();
}
report(
  "exports",
  found,
  `the five exports are what the ledgers write at ${STAMP}; the gate holds them (${gateLine(GATE)}) (at ${head(root).slice(0, 12)})`,
);
