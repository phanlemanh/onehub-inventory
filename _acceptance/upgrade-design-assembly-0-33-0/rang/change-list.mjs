// AC-6: each upgrade commit changes exactly its files, and the branch, from where it leaves
// origin/main to HEAD, changes nothing beyond them, this record's own files, and the two pages the
// gate commands draw again (there only words that name this record, or counts).
// Usage: node change-list.mjs [--root <repository>] [--upgrade <rev>] [--rerun <rev>]
//   (--upgrade and --rerun stand in for the pinned commits, for the break copies)
import path from "node:path";

import { branchBase, git, head, lines, option, ROOT, run } from "./lib.mjs";
import {
  BRANCH_MAY_CHANGE,
  DRAWN_COUNTS,
  DRAWN_HEADINGS,
  DRAWN_PAGES,
  RERUN,
  RERUN_CHANGES,
  SLUG,
  UPGRADE,
  UPGRADE_CHANGES,
} from "./matrix.mjs";

const root = path.resolve(option("--root", ROOT));
const found = [];
const changed = (from, to) => lines(git(root, "diff", "--name-only", "--no-renames", from, to)).sort();

function commitList(label, rev, expected) {
  const got = changed(`${rev}~1`, rev);
  for (const file of got) if (!expected.includes(file)) found.push(`${label} commit changed outside the list: ${file}`);
  for (const file of expected) if (!got.includes(file)) found.push(`${label} commit did not change: ${file}`);
  return got.length;
}
const upgradeCount = commitList("upgrade", option("--upgrade", UPGRADE), UPGRADE_CHANGES);
const rerunCount = commitList("rerun", option("--rerun", RERUN), RERUN_CHANGES);

const may = (file) => BRANCH_MAY_CHANGE.some((p) => (p.endsWith("/") ? file.startsWith(p) : file === p));
// A drawn page may change only by segments that name this record (with the heading of its section),
// or by a count.
function drawnPageProblems(base, file) {
  const diff = git(root, "diff", "--word-diff=porcelain", "--word-diff-regex=[^<>,{}]+", base, "HEAD", "--", file);
  const isCount = (s) => DRAWN_COUNTS.some((re) => re.test(s));
  const norm = (s) => (isCount(s) ? s.replace(/chưa có/g, "0 việc").replace(/\d+/g, "#") : s);
  const removed = [];
  const added = [];
  for (const line of diff.split("\n")) {
    if (line.startsWith("---") || line.startsWith("+++")) continue;
    if (line.startsWith("-")) removed.push(line.slice(1));
    else if (line.startsWith("+")) added.push(line.slice(1));
  }
  // A section heading the page opens for this record's stage goes with the record's own line.
  const ours = added.some((s) => s.includes(SLUG));
  const rest = added.filter((s) => !s.includes(SLUG) && !(ours && DRAWN_HEADINGS.test(s))).map(norm);
  const gone = removed.map(norm);
  const left = [...rest];
  const stray = [];
  for (const s of gone) {
    const at = left.indexOf(s);
    if (at === -1) stray.push(s);
    else left.splice(at, 1);
  }
  return [...stray, ...left];
}
const base = branchBase(root);
const merged = base === head(root) || run("git", ["merge-base", "--is-ancestor", "HEAD", "origin/main"], root).status === 0;
if (!merged) {
  for (const file of changed(base, "HEAD")) {
    if (DRAWN_PAGES.includes(file)) {
      if (drawnPageProblems(base, file).length) found.push(`${file} changed a line that is not this record's`);
    } else if (!may(file)) {
      found.push(`branch changed beyond the upgrade and this record: ${file}`);
    }
  }
}
for (const line of found) process.stdout.write(`changes: ${line}\n`);
if (found.length === 0) {
  process.stdout.write(
    merged
      ? `changes: the upgrade commit changes its ${upgradeCount} files; the 0.36.1 rerun changes its ${rerunCount} files; the branch is in origin/main already, so only the commits were compared\n`
      : `changes: the upgrade commit changes its ${upgradeCount} files; the 0.36.1 rerun changes its ${rerunCount} files; the branch changes nothing beyond the upgrades and this record (at ${head(root).slice(0, 12)})\n`,
  );
}
process.exitCode = found.length ? 1 : 0;
