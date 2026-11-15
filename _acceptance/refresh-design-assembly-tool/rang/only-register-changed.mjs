// AC-4: of the design ledgers, this branch changes the component register and nothing else, and the
// check data declares none of the tool's new screen check, so the new reader stays unused here.
// Usage: node only-register-changed.mjs --root <repository> [--changed F] [--theme F]
//   --changed: a file with one changed path per line, instead of asking git
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { stdout } from "node:process";

import { option } from "./linked-copy.mjs";
import { MAY_CHANGE } from "./matrix.mjs";

const root = path.resolve(option("--root", "."));
const git = (...args) => execFileSync("git", ["-C", root, ...args], { encoding: "utf8" }).trim();

// What the branch itself changed: from where it left main to its head.
const changedFile = option("--changed");
const changed = (
  changedFile
    ? readFileSync(changedFile, "utf8")
    : git("diff", "--name-only", `${git("merge-base", "HEAD", "origin/main")}..HEAD`, "--", "design")
)
  .split("\n")
  .filter((line) => line.startsWith("design/"));
const other = changed.filter((file) => !MAY_CHANGE.includes(file));

const theme = JSON.parse(readFileSync(option("--theme", path.join(root, "design/theme.json")), "utf8"));
const screenChecks = Object.entries(theme.checks ?? {})
  .filter(([, checks]) => checks.some((check) => check.kind === "screen-actions"))
  .map(([id]) => id);

const found = [];
if (other.length) found.push(`changed by this branch: ${other.join(" ")}`);
if (screenChecks.length) found.push(`the check data declares screen-actions for ${screenChecks.join(" ")}`);
for (const line of found) stdout.write(`design ledgers: ${line}\n`);
if (found.length === 0) {
  stdout.write(
    `design ledgers: this branch changed ${changed.length ? changed.join(" ") : "none"}; no screen-actions check declared\n`,
  );
}
process.exitCode = found.length ? 1 : 0;
