// AC-3, at the source: the plugin's own release ledger, at the commit of its main the upgrade ran
// from, names for version 0.7.0 the tree pinned here, and its templates there have that tree and
// the gate step's bytes.
// Usage: node release-ledger.mjs [--plugin-repo <the design-assembly repository>] [--ledger <file>]
//   (--ledger stands in for the ledger git shows at the pinned commit, for the break copies)
import { readFileSync } from "node:fs";
import path from "node:path";

import { git, option, PLUGIN_REPO } from "./lib.mjs";
import { GATE_STEP, PLUGIN_SOURCE, RELEASE } from "./matrix.mjs";

const repo = path.resolve(option("--plugin-repo", PLUGIN_REPO));
const at = PLUGIN_SOURCE.commit.slice(0, 7);
const found = [];
let ledger;
try {
  const text = option("--ledger")
    ? readFileSync(option("--ledger"), "utf8")
    : git(repo, "show", `${PLUGIN_SOURCE.commit}:${PLUGIN_SOURCE.ledger}`);
  ledger = JSON.parse(text);
} catch (error) {
  process.stdout.write(`release ledger: cannot read ${PLUGIN_SOURCE.ledger} at ${at} in ${repo} (${error.message.split("\n")[0]})\n`);
  process.exit(1);
}
const entry = (ledger.releases ?? []).find((release) => release.version === RELEASE.version);
if (!entry) found.push(`no version ${RELEASE.version} at ${at}`);
else if (entry.tool !== RELEASE.tool) {
  found.push(`version ${RELEASE.version} names tool tree ${String(entry.tool).slice(0, 12)}, not ${RELEASE.tool.slice(0, 12)}`);
}
const rev = (spec) => {
  try {
    return git(repo, "rev-parse", spec).trim();
  } catch {
    return "missing";
  }
};
const template = rev(`${PLUGIN_SOURCE.commit}:${PLUGIN_SOURCE.toolTemplate}`);
if (template !== RELEASE.tool) found.push(`the tool template at ${at} has tree ${template.slice(0, 12)}, not ${RELEASE.tool.slice(0, 12)}`);
const step = rev(`${PLUGIN_SOURCE.commit}:${PLUGIN_SOURCE.gateStep}`);
if (step !== GATE_STEP.blob) found.push(`the gate step template at ${at} is blob ${step.slice(0, 12)}, not ${GATE_STEP.blob.slice(0, 12)}`);
for (const line of found) process.stdout.write(`release ledger: ${line}\n`);
if (found.length === 0) {
  process.stdout.write(
    `release ledger: version ${RELEASE.version} at ${at} names tool tree ${RELEASE.tool.slice(0, 12)}, the one pinned here; its templates have that tree and the gate step\n`,
  );
}
process.exitCode = found.length ? 1 : 0;
