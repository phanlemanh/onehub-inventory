// AC-5: the installed plugin's audit still says 40 of 40 core decisions are answered, 14 held, 19
// claimed and 7 recorded, on a clone of the tree as it is.
// Usage: node audit.mjs [--root <repository>] [--ledger <file>]
//   (--ledger hands the clone another design/decisions.yaml, for the break copy)
import { copyFileSync } from "node:fs";
import path from "node:path";

import { head, option, ROOT, run, workClone } from "./lib.mjs";
import { CORE, coreLine, LEDGER, PLUGIN_DIR, PLUGIN_FILES, TOOL_FOLDER } from "./matrix.mjs";

const root = path.resolve(option("--root", ROOT));
const ledger = option("--ledger");
const clone = workClone(root);
const found = [];
try {
  if (ledger) copyFileSync(path.resolve(ledger), path.join(clone.dir, LEDGER));
  run("node", [`${TOOL_FOLDER}/components.mjs`, "--write"], clone.dir);
  // The audit ends with 1 when something waits or is open; its lines are still the answer.
  const audit = run("node", [path.join(PLUGIN_DIR(), PLUGIN_FILES.audit), "--target", clone.dir], clone.dir);
  if (audit.status !== 0 && audit.status !== 1) found.push(`the audit exit ${audit.status}`);
  const said = audit.out.split("\n").find((line) => line.startsWith("coverage: ")) ?? "no coverage line";
  if (said !== coreLine(CORE)) found.push(`the audit said «${said}», not «${coreLine(CORE)}»`);
} finally {
  clone.remove();
}
for (const line of found) process.stdout.write(`audit: ${line}\n`);
if (found.length === 0) {
  process.stdout.write(`audit: ${coreLine(CORE)} (at ${head(root).slice(0, 12)})\n`);
}
process.exitCode = found.length ? 1 : 0;
