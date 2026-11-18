// AC-10: the 46 files of BASE..UPGRADE fall each in exactly one group, read from the apply.py
// report on BASE and the hand-edit list (never from the diff), with the counts of the matrix; the
// files of the report that did not change are exactly the kept ones; after UPGRADE only the
// dossier and the T1 files change.
// Usage: node change-set.mjs [--root <dir>] [--report <apply.py json on BASE>] [--upgrade <rev>]

import { readFileSync } from "node:fs";

import { applyPy, git, root, run, verdict, worktree } from "./lib.mjs";
import { AFTER_ALLOWED, BASE, GROUP_COUNTS, HAND, KEPT, TOTAL, UPGRADE } from "./matrix.mjs";

const NAME = "change-set";
const argv = process.argv.slice(2);
const opt = (k) => (argv.includes(k) ? argv[argv.indexOf(k) + 1] : null);
const dir = root();
const upgrade = opt("--upgrade") ?? UPGRADE;
const problems = [];
let note = "";

function baseReport() {
  if (opt("--report")) return JSON.parse(readFileSync(opt("--report"), "utf8"));
  const wt = worktree(dir, BASE);
  try {
    return JSON.parse(run("python3", [applyPy(), "--dry-run", "--json"], { cwd: wt.dir }).out);
  } finally {
    wt.remove();
  }
}

try {
  const report = baseReport();
  const groupsOf = (f) => {
    const g = [];
    if (f === ".repo-setup.json") g.push("manifest");
    for (const k of ["created", "updated", "merged", "marked", "conflict"]) if ((report[k] ?? []).includes(f)) g.push(k);
    if (HAND.includes(f)) g.push("hand");
    return g;
  };
  const files = git(dir, "diff", "--name-only", BASE, upgrade).split("\n").filter(Boolean);
  const counts = {};
  for (const f of files) {
    const g = groupsOf(f);
    if (g.length !== 1) problems.push(`${f} is in ${g.length === 0 ? "no group" : `${g.length} groups (${g.join(", ")})`}`);
    else counts[g[0]] = (counts[g[0]] ?? 0) + 1;
  }
  for (const [g, n] of Object.entries(GROUP_COUNTS)) {
    if ((counts[g] ?? 0) !== n) problems.push(`group ${g} has ${counts[g] ?? 0} files, not ${n}`);
  }
  if (files.length !== TOTAL) problems.push(`${BASE.slice(0, 8)}..${upgrade.slice(0, 8)} changes ${files.length} files, not ${TOTAL}`);
  const reported = ["created", "updated", "merged", "marked", "conflict"].flatMap((k) => report[k] ?? []);
  const unchanged = reported.filter((f) => !files.includes(f)).sort();
  if (JSON.stringify(unchanged) !== JSON.stringify([...KEPT].sort())) {
    problems.push(`files of the report left unchanged are [${unchanged.join(", ")}], not the kept ones [${KEPT.join(", ")}]`);
  }

  const merged = run("git", ["-C", dir, "merge-base", "--is-ancestor", "HEAD", "origin/main"]).code === 0;
  if (merged) {
    note = "; the branch is in origin/main, so only the commits were compared";
  } else {
    const after = git(dir, "diff", "--name-only", upgrade, "HEAD").split("\n").filter(Boolean);
    for (const f of after) if (!AFTER_ALLOWED.some((re) => re.test(f))) problems.push(`${f} changed after ${upgrade.slice(0, 8)}`);
  }
} catch (err) {
  problems.push(err.message);
}

const groups = Object.entries(GROUP_COUNTS).map(([g, n]) => `${g === "conflict" ? "conflict then created" : g} ${n}`).join(", ");
verdict(
  NAME,
  problems,
  `the ${TOTAL} files of ${BASE.slice(0, 8)}..${upgrade.slice(0, 8)} fall each in one group read from the apply.py report and the hand-edit list: ${groups}; four files of the report unchanged; ${upgrade.slice(0, 8)}..HEAD changes only this dossier, _acceptance/config.yaml, PRODUCT-MAP.md and LO-TRINH.html${note}`,
);
