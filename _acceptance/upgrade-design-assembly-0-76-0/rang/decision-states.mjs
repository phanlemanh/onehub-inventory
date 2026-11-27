// AC-4: on the ledger at HEAD, the 0.76.0 tool at HEAD and the 0.69.0 tool where the branch left
// main give each decision the same state. The upgrade changes no ledger file, so both read the same
// ledger. Each tool writes its own component manifest first, as make check does (the manifest is
// kept out of git, so a fresh clone has none).
// Usage: node decision-states.mjs [--root <repository>] [--old-theme <file>]
//   (--old-theme hands the 0.69.0 side another design/theme.json, for the break copy)
import { copyFileSync, rmSync } from "node:fs";
import path from "node:path";

import { git, head, option, ROOT, run, workClone } from "./lib.mjs";
import { BASE, OLD_VERSION, RATE, RELEASE, THEME, TOOL_FOLDER } from "./matrix.mjs";

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
const rate = (label) => {
  const manifest = run("node", [`${TOOL_FOLDER}/components.mjs`, "--write"], clone.dir);
  if (manifest.status !== 0) found.push(`the ${label} tool could not write the component manifest (exit ${manifest.status})`);
  return run("node", [`${TOOL_FOLDER}/check.mjs`, "--rate"], clone.dir);
};
try {
  const a = rate(RELEASE.version);
  if (a.status !== 0) found.push(`the ${RELEASE.version} tool exit ${a.status}`);
  now = states(a.out);
  rmSync(path.join(clone.dir, TOOL_FOLDER), { recursive: true, force: true });
  git(clone.dir, "checkout", "-q", BASE, "--", TOOL_FOLDER);
  if (oldTheme) copyFileSync(path.resolve(oldTheme), path.join(clone.dir, THEME));
  const b = rate(OLD_VERSION);
  if (b.status !== 0 && !oldTheme) found.push(`the ${OLD_VERSION} tool exit ${b.status}`);
  then = states(b.out);
} finally {
  clone.remove();
}
if (now.size !== RATE.all) found.push(`the ${RELEASE.version} tool listed ${now.size} decisions, not ${RATE.all}`);
for (const [id, state] of now) {
  const old = then.get(id);
  if (old !== state) found.push(`${id} is ${state} with the ${RELEASE.version} tool, not with the ${OLD_VERSION} tool (${old ?? "absent"})`);
}
for (const id of then.keys()) if (!now.has(id)) found.push(`${id} is listed by the ${OLD_VERSION} tool only`);
const automatic = [...now.values()].filter((s) => s === "held" || s === "claimed").length;
for (const line of found) process.stdout.write(`states: ${line}\n`);
if (found.length === 0) {
  process.stdout.write(
    `states: the ${RELEASE.version} tool and the ${OLD_VERSION} tool, on the ledger at HEAD, give each of the ${now.size} decisions the same state; both say ${automatic}/${now.size} (at ${head(root).slice(0, 12)})\n`,
  );
}
process.exitCode = found.length ? 1 : 0;
