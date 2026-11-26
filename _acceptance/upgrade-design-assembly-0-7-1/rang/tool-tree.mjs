// AC-5, in the repository: the tool folder is the tree plugin version 0.7.1 hands a repository, the
// stamp says so, and the gate step is the plugin's template byte for byte.
// Usage: node tool-tree.mjs [--root <repository>]
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import { blobId, option, ROOT, treeId } from "./lib.mjs";
import { GATE_STEP, RELEASE, STAMP, TOOL_FOLDER } from "./matrix.mjs";

const root = path.resolve(option("--root", ROOT));
const found = [];
const tree = treeId(path.join(root, TOOL_FOLDER));
if (tree.id !== RELEASE.tool) {
  found.push(
    `${TOOL_FOLDER} differs from the plugin's version ${RELEASE.version}: ${tree.files} files, tree ${tree.id.slice(0, 12)}; the version's tree is ${RELEASE.tool.slice(0, 12)}`,
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
for (const line of found) process.stdout.write(`tool: ${line}\n`);
if (found.length === 0) {
  process.stdout.write(
    `tool: ${TOOL_FOLDER} is the plugin's version ${RELEASE.version}, ${tree.files} files, tree ${tree.id.slice(0, 12)}; the stamp says the same; ${GATE_STEP.file} is the template's\n`,
  );
}
process.exitCode = found.length ? 1 : 0;
