// AC-10: the upgrade commit changes exactly the files the matrix lists, and the branch from where it
// leaves origin/main to HEAD changes nothing beyond them and this record's own files. Once the branch is in
// main there is nothing between main and HEAD; the commit is still compared, and the line says so.
// Usage: node change-list.mjs [--root <repository>] [--commit-changes <file>] [--branch-changes <file>]
//   [--groups <JSON file>] [--merged]   (the overrides stand in for git diff, the matrix's groups and
//   the merged state, for the break copies)
import { readFileSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

import { git, lines, option, ROOT } from "./lib.mjs";
import { BASE, BRANCH_MAY_CHANGE, FILE_GROUPS, UPGRADE, UPGRADE_CHANGES } from "./matrix.mjs";

const root = path.resolve(option("--root", ROOT));
const fromFile = (name) => (option(name) ? lines(readFileSync(option(name), "utf8")) : null);
const commit = fromFile("--commit-changes") ?? lines(git(root, "diff", "--name-only", "--no-renames", BASE, UPGRADE));
const groups = option("--groups") ? JSON.parse(readFileSync(option("--groups"), "utf8")) : FILE_GROUPS;
const merged = process.argv.includes("--merged") || spawnSync("git", ["-C", root, "merge-base", "--is-ancestor", UPGRADE, "origin/main"]).status === 0;
// The branch's own changes: from where it now leaves origin/main (moves when main is merged into the
// branch), or from BASE when there is no origin/main to read.
const leaves = spawnSync("git", ["-C", root, "merge-base", "HEAD", "origin/main"], { encoding: "utf8" });
const from = leaves.status === 0 ? leaves.stdout.trim() : BASE;
const branch = fromFile("--branch-changes") ?? (merged ? [] : lines(git(root, "diff", "--name-only", "--no-renames", from, "HEAD")));

const found = [];
const outside = commit.filter((file) => !UPGRADE_CHANGES.includes(file));
const untouched = UPGRADE_CHANGES.filter((file) => !commit.includes(file));
if (outside.length) found.push(`upgrade commit changed outside the list: ${outside.join(" ")}`);
if (untouched.length) found.push(`upgrade commit did not change: ${untouched.join(" ")}`);
const under = (file, entry) => (entry.endsWith("/") ? file.startsWith(entry) : file === entry);
const homeless = [];
const counts = {};
for (const file of commit) {
  const homes = Object.entries(groups).filter(([, group]) => group.paths.some((entry) => under(file, entry)));
  if (homes.length !== 1) homeless.push(`${file} (${homes.length} groups)`);
  else counts[homes[0][0]] = (counts[homes[0][0]] ?? 0) + 1;
}
if (homeless.length) found.push(`upgrade commit files not in exactly one group: ${homeless.join(" ")}`);
const off = Object.entries(groups).filter(([name, group]) => (counts[name] ?? 0) !== group.count);
if (off.length) found.push(`groups off their count: ${off.map(([name, group]) => `${name} ${counts[name] ?? 0}/${group.count}`).join("; ")}`);
const allowed = (file) => BRANCH_MAY_CHANGE.some((entry) => (entry.endsWith("/") ? file.startsWith(entry) : file === entry));
const beyond = branch.filter((file) => !allowed(file));
if (beyond.length) found.push(`branch changed beyond the upgrade and this record: ${beyond.join(" ")}`);
if (!merged && !fromFile("--branch-changes") && branch.length < commit.length) {
  found.push(`branch changes ${branch.length} files, fewer than the upgrade commit's ${commit.length}`);
}
for (const line of found) process.stdout.write(`changes: ${line}\n`);
if (!found.length) {
  const tail = merged
    ? "the branch is in origin/main already, so only the commit was compared"
    : `the branch changes ${branch.length} files, all of them the upgrade's or this record's`;
  process.stdout.write(`changes: the upgrade commit changes exactly its ${UPGRADE_CHANGES.length} files, each in one of ${Object.keys(groups).length} groups; ${tail}\n`);
}
process.exitCode = found.length ? 1 : 0;
