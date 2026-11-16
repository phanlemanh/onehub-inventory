// AC-4: the commit that ran the plugin's upgrade changes the six tool files, the component register
// and the stamp, and no other file: not the stylesheet, not design/theme.json, not design/tokens.json,
// not a ledger row a person wrote. The commits are named in the matrix, so the measure reads the same
// once the branch has merged.
// Usage: node upgrade-changes.mjs --root <repository> [--changed F]
//   --changed: a file with one changed path per line, instead of asking git
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { stdout } from "node:process";

import { option } from "./linked-copy.mjs";
import { BASE, UPGRADE, UPGRADE_CHANGES } from "./matrix.mjs";

const root = path.resolve(option("--root", "."));
const changedFile = option("--changed");
const changed = (
  changedFile
    ? readFileSync(changedFile, "utf8")
    : execFileSync("git", ["-C", root, "diff", "--name-only", BASE, UPGRADE], { encoding: "utf8" })
)
  .split("\n")
  .map((line) => line.trim())
  .filter(Boolean);

const found = [];
const outside = changed.filter((file) => !UPGRADE_CHANGES.includes(file));
const untouched = UPGRADE_CHANGES.filter((file) => !changed.includes(file));
if (outside.length) found.push(`changed outside the upgrade: ${outside.join(" ")}`);
if (untouched.length) found.push(`not changed by the upgrade: ${untouched.join(" ")}`);
for (const line of found) stdout.write(`upgrade commit: ${line}\n`);
if (found.length === 0) {
  stdout.write(
    `upgrade commit: changed exactly ${changed.length} files, the six tool files, the register and the stamp\n`,
  );
}
process.exitCode = found.length ? 1 : 0;
