// AC-8: the upgrade commit changes exactly its files (the tool files, the stamp, the book's words and
// the wiki log line), and the branch, from where it leaves origin/main to HEAD, changes nothing beyond
// them, this record's own files, and the two pages the gate commands draw again (each exactly what the
// records at HEAD draw, see DRAWN_PAGES).
// Usage: node change-list.mjs [--root <repository>] [--upgrade <rev>]
//   (--upgrade stands in for the pinned commit, for the break copies)
import path from "node:path";

import { branchBase, git, head, lines, option, ROOT, run } from "./lib.mjs";
import {
  BRANCH_MAY_CHANGE,
  DATA_BLOCK,
  DRAWER,
  DRAWN_PAGES,
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

const may = (file) => BRANCH_MAY_CHANGE.some((p) => (p.endsWith("/") ? file.startsWith(p) : file === p));
// The kit's drawer, found as the repository's own product_map executor finds it.
function drawer() {
  const kit = process.env.CLAUDE_PLUGIN_ROOT || run("node", ["tools/kit-root.mjs"], root).out.trim();
  return kit ? path.join(kit, DRAWER) : null;
}
// What the drawer's check says of each page: true when the page is the drawing of the records.
function redrawn() {
  const script = drawer();
  if (!script) return null;
  const out = run("node", [script, "--root", root, "--check"], root).out;
  return Object.fromEntries(DRAWN_PAGES.map((page) => [page, out.includes(`${page} khớp`)]));
}
// Each plan row's summary in the roadmap page's data block, by row code.
function summaries(html) {
  const block = html.match(DATA_BLOCK);
  if (!block) return {};
  const data = JSON.parse(block[1]);
  const rows = (data.lo_trinh ?? []).flatMap((plan) => plan.hang ?? []);
  return Object.fromEntries(rows.map((row) => [row.ma, JSON.stringify(row.tom_tat ?? null)]));
}
function drawnPageProblems(base, file, checked) {
  if (!checked) return [`cannot find the kit's drawer (${DRAWER}): set CLAUDE_PLUGIN_ROOT or install acceptance-gate`];
  const problems = checked[file] ? [] : [`${file} is not what the records at HEAD draw`];
  if (file === "LO-TRINH.html") {
    const before = summaries(git(root, "show", `${base}:${file}`));
    const after = summaries(git(root, "show", `HEAD:${file}`));
    for (const ma of new Set([...Object.keys(before), ...Object.keys(after)])) {
      if (before[ma] !== after[ma]) problems.push(`${file} changed the summary of row ${ma}, the one part the redraw does not compare`);
    }
  }
  return problems;
}
const base = branchBase(root);
const merged = base === head(root) || run("git", ["merge-base", "--is-ancestor", "HEAD", "origin/main"], root).status === 0;
if (!merged) {
  const files = changed(base, "HEAD");
  const checked = files.some((file) => DRAWN_PAGES.includes(file)) ? redrawn() : {};
  for (const file of files) {
    if (DRAWN_PAGES.includes(file)) {
      found.push(...drawnPageProblems(base, file, checked));
    } else if (!may(file)) {
      found.push(`branch changed beyond the upgrade and this record: ${file}`);
    }
  }
}
for (const line of found) process.stdout.write(`changes: ${line}\n`);
if (found.length === 0) {
  process.stdout.write(
    merged
      ? `changes: the upgrade commit changes its ${upgradeCount} files; the branch is in origin/main already, so only the commit was compared\n`
      : `changes: the upgrade commit changes its ${upgradeCount} files; the branch changes nothing beyond the upgrade and this record (at ${head(root).slice(0, 12)})\n`,
  );
}
process.exitCode = found.length ? 1 : 0;
