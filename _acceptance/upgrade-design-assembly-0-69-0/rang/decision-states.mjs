// AC-4: the tool at HEAD on HEAD's ledger, and the 0.36.1 tool on the ledger where the branch left
// main (its tool folder and its design/theme.json: the upgrade adds three checks the old tool cannot
// read), give each decision the same state.
// Usage: node decision-states.mjs [--root <repository>] [--old-theme <file>]
//   (--old-theme hands the 0.36.1 side another design/theme.json, for the break copy)
import { copyFileSync, rmSync } from "node:fs";
import path from "node:path";

import { git, head, option, ROOT, run, workClone } from "./lib.mjs";
import { OLD_TOOL_AT, OLD_VERSION, RATE, THEME, TOOL_FOLDER } from "./matrix.mjs";

const root = path.resolve(option("--root", ROOT));
const oldTheme = option("--old-theme");

// The state of each decision, as the rate lists it: "  <state> <kind> <id>  (by)".
function states(out) {
  const map = new Map();
  for (const line of out.split("\n")) {
    if (!line.startsWith("  ") || line.includes("note:") || /held and re-run here/.test(line)) continue;
    const state = line.slice(2, 10).trim();
    const [, id] = line.slice(11).trim().split(/\s+/);
    if (state && id) map.set(id, state);
  }
  return map;
}

const clone = workClone(root);
const found = [];
let now;
let then;
try {
  const a = run("node", [`${TOOL_FOLDER}/check.mjs`, "--rate"], clone.dir);
  if (a.status !== 0) found.push(`the tool at HEAD exit ${a.status}`);
  now = states(a.out);
  rmSync(path.join(clone.dir, TOOL_FOLDER), { recursive: true, force: true });
  git(clone.dir, "checkout", "-q", OLD_TOOL_AT, "--", TOOL_FOLDER, THEME);
  if (oldTheme) copyFileSync(path.resolve(oldTheme), path.join(clone.dir, THEME));
  const b = run("node", [`${TOOL_FOLDER}/check.mjs`, "--rate"], clone.dir);
  if (b.status !== 0 && !oldTheme) found.push(`the ${OLD_VERSION} tool exit ${b.status}`);
  then = states(b.out);
} finally {
  clone.remove();
}
if (now.size !== RATE.all) found.push(`the tool at HEAD listed ${now.size} decisions, not ${RATE.all}`);
for (const [id, state] of now) {
  const old = then.get(id);
  if (old !== state) found.push(`${id} is ${state} with the tool at HEAD, not with the ${OLD_VERSION} tool (${old ?? "absent"})`);
}
for (const id of then.keys()) if (!now.has(id)) found.push(`${id} is listed by the ${OLD_VERSION} tool only`);
const automatic = [...now.values()].filter((s) => s === "held" || s === "claimed").length;
for (const line of found) process.stdout.write(`states: ${line}\n`);
if (found.length === 0) {
  process.stdout.write(
    `states: the tool at HEAD and the ${OLD_VERSION} tool, each on its own ledger, give each of the ${now.size} decisions the same state; both say ${automatic}/${now.size} (at ${head(root).slice(0, 12)})\n`,
  );
}
process.exitCode = found.length ? 1 : 0;
