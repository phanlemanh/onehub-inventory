// AC-9: the plugin's audit (inventory.mjs of design-assembly 0.7.0) of the repository where the branch
// left main and of the repository at HEAD differ in exactly one line: the ledger files of one shape
// go from 7 of 7 to 8 of 8. The base is checked out in a clone that shares the repository's objects,
// with the repository's node_modules linked in. The audit runs from the plugin as it is at the pinned
// commit of its repository, taken out with git archive, whatever that checkout has checked out.
// Usage: node audit-diff.mjs [--root <repository>] [--plugin-repo <design-assembly checkout>]
//   [--before <file>] [--after <file>]   (the two overrides stand in for the audits, for the breaks)
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, rmSync, symlinkSync } from "node:fs";
import path from "node:path";

import { git, option, PLUGIN_REPO, ROOT, scratch, sharedClone } from "./lib.mjs";
import { AUDIT_DIFF, BASE, DERIVED, PLUGIN_SOURCE } from "./matrix.mjs";

const root = path.resolve(option("--root", ROOT));
const repo = path.resolve(option("--plugin-repo", PLUGIN_REPO));
let pluginDir = null;
const audit = (target) => {
  const script = path.join(pluginDir, "plugins/design-assembly/scripts/inventory.mjs");
  const run = spawnSync(process.execPath, [script, "--target", target], { encoding: "utf8", maxBuffer: 1 << 26 });
  return `${run.stdout}${run.stderr}`;
};
const found = [];
let before = option("--before") ? readFileSync(option("--before"), "utf8") : null;
let after = option("--after") ? readFileSync(option("--after"), "utf8") : null;
if (!before || !after) {
  pluginDir = scratch("plugin");
  const tar = spawnSync("bash", ["-o", "pipefail", "-c", `git -C "$1" archive "$2" plugins/design-assembly | tar -x -C "$3"`, "bash", repo, PLUGIN_SOURCE.commit, pluginDir]);
  if (tar.status !== 0) found.push(`cannot take the plugin out of ${repo} at ${PLUGIN_SOURCE.commit.slice(0, 7)}`);
  const undrawn = DERIVED.filter((file) => !existsSync(path.join(root, file)));
  if (undrawn.length) found.push(`derived files not drawn yet (make design-derived): ${undrawn.join(" ")}`);
}
if (!found.length && (!before || !after)) {
  const clone = sharedClone(root);
  try {
    git(clone.dir, "checkout", "-q", BASE);
    symlinkSync(path.join(root, "node_modules"), path.join(clone.dir, "node_modules"));
    before ??= audit(clone.dir);
  } finally {
    clone.remove();
  }
  after ??= audit(root);
}
if (pluginDir) rmSync(pluginDir, { recursive: true, force: true });
if (!found.length) {
  const a = before.split("\n");
  const b = after.split("\n");
  const gone = a.filter((line) => !b.includes(line));
  const come = b.filter((line) => !a.includes(line));
  const want = JSON.stringify([[AUDIT_DIFF.before], [AUDIT_DIFF.after]]);
  if (JSON.stringify([gone, come]) !== want) {
    found.push(`the audits differ beyond the ledger files line: gone ${JSON.stringify(gone)}, new ${JSON.stringify(come)}`);
  }
}
for (const line of found) process.stdout.write(`audit: ${line}\n`);
if (!found.length) {
  process.stdout.write(`audit: at ${BASE.slice(0, 8)} and at HEAD the plugin's audit differs in one line: «${AUDIT_DIFF.before}» → «${AUDIT_DIFF.after}»\n`);
}
process.exitCode = found.length ? 1 : 0;
