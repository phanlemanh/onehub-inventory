// AC-3: the tool folder is the tree plugin version 0.36.1 hands a repository, the stamp says so, the
// gate step is the template's byte for byte, and the installed plugin's own folder for that version
// records that tree and holds it.
// Usage: node tool-tree.mjs [--root <repository>] (PLUGIN_CACHE in the environment stands in for the
// plugin cache in the break copies)
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import { blobId, head, option, ROOT, treeId } from "./lib.mjs";
import { GATE_STEP, PLUGIN_DIR, PLUGIN_FILES, RELEASE, STAMP, TOOL_FOLDER } from "./matrix.mjs";

const root = path.resolve(option("--root", ROOT));
const found = [];
const tree = treeId(path.join(root, TOOL_FOLDER));
if (tree.id !== RELEASE.tool || tree.files !== RELEASE.files) {
  found.push(
    `${TOOL_FOLDER} differs from the plugin's version ${RELEASE.version}: ${tree.files} files, tree ${tree.id.slice(0, 12)}; the version's tree is ${RELEASE.tool.slice(0, 12)}, ${RELEASE.files} files`,
  );
}
const stampFile = path.join(root, STAMP);
if (!existsSync(stampFile)) {
  found.push(`no stamp at ${STAMP}`);
} else {
  const stamp = JSON.parse(readFileSync(stampFile, "utf8"));
  if (stamp.version !== RELEASE.version) found.push(`the stamp says version ${stamp.version}, not ${RELEASE.version}`);
  if (stamp.tree !== RELEASE.tool) {
    found.push(`the stamp's tree ${String(stamp.tree).slice(0, 12)} is not the tree of version ${RELEASE.version}`);
  }
}
const step = path.join(root, GATE_STEP.file);
const stepId = existsSync(step) ? blobId(step) : "missing";
if (stepId !== GATE_STEP.blob) {
  found.push(`${GATE_STEP.file} is not the plugin's gate step: blob ${stepId.slice(0, 12)}, the template's is ${GATE_STEP.blob.slice(0, 12)}`);
}
const plugin = PLUGIN_DIR();
let ledger;
try {
  ledger = JSON.parse(readFileSync(path.join(plugin, PLUGIN_FILES.ledger), "utf8"));
} catch (error) {
  found.push(`cannot read the installed plugin's release ledger in ${plugin} (${error.message.split("\n")[0]})`);
}
if (ledger) {
  const releases = Array.isArray(ledger) ? ledger : (ledger.releases ?? []);
  const entry = releases.find((release) => release.version === RELEASE.version);
  if (!entry) found.push(`the installed plugin's release ledger has no version ${RELEASE.version}`);
  else if (entry.tool !== RELEASE.tool) {
    found.push(`the installed plugin's release ledger names tool tree ${String(entry.tool).slice(0, 12)} for ${RELEASE.version}, not ${RELEASE.tool.slice(0, 12)}`);
  }
  const template = path.join(plugin, PLUGIN_FILES.toolTemplate);
  const templateTree = existsSync(template) ? treeId(template).id : "missing";
  if (templateTree !== RELEASE.tool) found.push(`the installed plugin's tool template has tree ${templateTree.slice(0, 12)}, not ${RELEASE.tool.slice(0, 12)}`);
  const stepTemplate = path.join(plugin, PLUGIN_FILES.gateStep);
  const stepTemplateId = existsSync(stepTemplate) ? blobId(stepTemplate) : "missing";
  if (stepTemplateId !== GATE_STEP.blob) found.push(`the installed plugin's gate step template is blob ${stepTemplateId.slice(0, 12)}, not ${GATE_STEP.blob.slice(0, 12)}`);
}
for (const line of found) process.stdout.write(`tool: ${line}\n`);
if (found.length === 0) {
  process.stdout.write(
    `tool: ${TOOL_FOLDER} is the plugin's version ${RELEASE.version}, ${tree.files} files, tree ${tree.id.slice(0, 12)}; the stamp says the same; ${GATE_STEP.file} is the template's; the installed plugin ${RELEASE.version} names that tree in its release ledger and its templates hold it (at ${head(root).slice(0, 12)})\n`,
  );
}
process.exitCode = found.length ? 1 : 0;
