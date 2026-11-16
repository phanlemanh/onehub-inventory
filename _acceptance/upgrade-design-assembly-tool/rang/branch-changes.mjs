// AC-6: the branch as a whole, from where it left main to its head, changes the eight files of the
// upgrade and the files of this record, and nothing else: not the stylesheet, the tokens ledger, the
// check data or the gate step. Once the branch has merged there is nothing left between the two, and
// the measure says so instead of calling it green on something it compared.
// Usage: node branch-changes.mjs --root <repository> [--changed F]
//   --changed: a file with one changed path per line, instead of asking git
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { stdout } from "node:process";

import { option } from "./linked-copy.mjs";
import { BRANCH_MAY_CHANGE } from "./matrix.mjs";

const root = path.resolve(option("--root", "."));
const git = (...args) => execFileSync("git", ["-C", root, ...args], { encoding: "utf8" }).trim();
const changedFile = option("--changed");
const changed = (
  changedFile
    ? readFileSync(changedFile, "utf8")
    : git("diff", "--name-only", `${git("merge-base", "HEAD", "origin/main")}..HEAD`)
)
  .split("\n")
  .map((line) => line.trim())
  .filter(Boolean);

const allowed = (file) =>
  BRANCH_MAY_CHANGE.some((entry) => (entry.endsWith("/") ? file.startsWith(entry) : file === entry));
const outside = changed.filter((file) => !allowed(file));
if (outside.length) {
  stdout.write(`branch: changed outside the upgrade and this record: ${outside.join(" ")}\n`);
  process.exitCode = 1;
} else if (changed.length === 0) {
  stdout.write("branch: nothing between main and HEAD to compare (merged already)\n");
} else {
  stdout.write(`branch: ${changed.length} files changed, all of them the upgrade's or this record's\n`);
}
