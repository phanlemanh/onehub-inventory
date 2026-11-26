// AC-4: the four derived files are out of git and ignored, the two old names are gone, the fragment
// folders are tracked with one file per entry, and no reader of the repository's own names an old path.
// Usage: node out-of-git.mjs [--root <repository>] [--tracked <file of paths>] [--ignored <file of paths>]
//   [--old-names <file of "path:line" hits>]   (the three overrides stand in for git, for the break copies)
import { readFileSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

import { git, lines, option, ROOT } from "./lib.mjs";
import { DERIVED, FRAGMENTS, OLD_NAME_ALLOWED, OLD_NAMES, READER_SEARCH } from "./matrix.mjs";

const root = path.resolve(option("--root", ROOT));
const fromFile = (name) => (option(name) ? lines(readFileSync(option(name), "utf8")) : null);

const tracked = new Set(fromFile("--tracked") ?? lines(git(root, "ls-files")));
const ignored = new Set(
  fromFile("--ignored") ??
    DERIVED.filter((file) => spawnSync("git", ["-C", root, "check-ignore", "-q", "--no-index", file]).status === 0),
);
let hits = fromFile("--old-names");
if (!hits) {
  const run = spawnSync("git", ["-C", root, "grep", "-l", ...OLD_NAMES.flatMap((n) => ["-e", n]), "--", ...READER_SEARCH], {
    encoding: "utf8",
  });
  if (run.status > 1) throw new Error(`git grep: ${run.stderr}`);
  hits = lines(run.stdout);
}

const found = [];
const inGit = DERIVED.filter((file) => tracked.has(file));
if (inGit.length) found.push(`derived files tracked by git: ${inGit.join(" ")}`);
const notIgnored = DERIVED.filter((file) => !ignored.has(file));
if (notIgnored.length) found.push(`derived files not ignored: ${notIgnored.join(" ")}`);
const old = OLD_NAMES.filter((file) => tracked.has(file));
if (old.length) found.push(`old names still in git: ${old.join(" ")}`);
for (const [ledger, { folder, entries }] of Object.entries(FRAGMENTS)) {
  const files = [...tracked].filter((file) => file.startsWith(`${folder}/`));
  const shared = files.includes(`${folder}/_shared.yaml`);
  const count = files.filter((file) => file.endsWith(".yaml") && !file.endsWith("/_shared.yaml")).length;
  if (!shared || count !== entries) {
    found.push(`${ledger}: ${folder} has ${count} entry files${shared ? "" : " and no _shared.yaml"}, not ${entries}`);
  }
}
const readers = hits.map((hit) => hit.split(":")[0]).filter((file) => !OLD_NAME_ALLOWED.includes(file));
if (readers.length) found.push(`readers still naming an old path: ${[...new Set(readers)].join(" ")}`);

for (const line of found) process.stdout.write(`out of git: ${line}\n`);
if (found.length === 0) {
  process.stdout.write(
    `out of git: ${DERIVED.length} derived files untracked and ignored, old names gone, ${FRAGMENTS.screens.entries} screen and ${FRAGMENTS.intake.entries} block files tracked, no reader names an old path\n`,
  );
}
process.exitCode = found.length ? 1 : 0;
