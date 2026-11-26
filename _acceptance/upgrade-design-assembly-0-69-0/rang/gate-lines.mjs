// AC-2: the gate alone says 22 decisions held by 33 checks, and its rate says 57/69, 22 held and
// 35 claimed. Usage: node gate-lines.mjs [--root <repository or a copy of it>]
import path from "node:path";

import { head, option, ROOT, run } from "./lib.mjs";
import { GATE, gateLine, heldLine, RATE, rateLine } from "./matrix.mjs";

const root = path.resolve(option("--root", ROOT));
const found = [];
const gate = run("node", ["tools/design-assembly/check.mjs"], root);
if (gate.status !== 0) found.push(`the gate exit ${gate.status}`);
if (!gate.out.includes(gateLine(GATE))) found.push(`the gate did not say: ${gateLine(GATE)}`);
const rate = run("node", ["tools/design-assembly/check.mjs", "--rate"], root);
if (rate.status !== 0) found.push(`the rate exit ${rate.status}`);
for (const line of [rateLine(RATE), heldLine(RATE)]) {
  if (!rate.out.includes(line)) found.push(`the rate did not say: ${line}`);
}
for (const line of found) process.stdout.write(`gate: ${line}\n`);
if (found.length === 0) {
  process.stdout.write(
    `gate: the gate holds ${GATE.decisions} decisions by ${GATE.checks} checks; determinism rate ${RATE.automatic}/${RATE.all}, ${RATE.held} held and ${RATE.claimed} claimed (at ${head(root).slice(0, 12)})\n`,
  );
}
process.exitCode = found.length ? 1 : 0;
