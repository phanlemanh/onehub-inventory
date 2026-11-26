// AC-5: against the base of the pull request, AGENTS.md loses exactly the three lines of two rules and
// gains exactly the lines of the matrix: the same two rules split in four lines, and the section
// "What holds these rules" at the end of the file. Every other line is as it was. Each check the new
// section names exists in the tree: the job secret-scan, the jobs conventional-title and
// conventional-commits, and the wiki lint and the module boundaries in `make check`.
// Usage: node agents-tail.mjs [--root <dir>]

import { readFileSync } from "node:fs";
import { join } from "node:path";

import { prBase, root, run, show, verdict, yaml } from "./lib.mjs";
import { AGENTS_ADDED, AGENTS_REMOVED } from "./matrix.mjs";

const NAME = "agents-tail";
const dir = root();
const problems = [];

/** Lines removed and added, from `git diff --no-index` of the two texts (no context lines). */
function lineDiff(before, after) {
  const r = run("bash", ["-c", 'diff -U0 <(printf "%s" "$1") <(printf "%s" "$2")', "_", before, after]);
  const removed = [];
  const added = [];
  for (const line of r.out.split("\n")) {
    if (line.startsWith("---") || line.startsWith("+++")) continue;
    if (line.startsWith("-")) removed.push(line.slice(1));
    else if (line.startsWith("+")) added.push(line.slice(1));
  }
  return { removed, added };
}

try {
  const after = readFileSync(join(dir, "AGENTS.md"), "utf8");
  const before = show(dir, prBase(dir), "AGENTS.md");
  if (before === null) throw new Error("the base of the pull request has no AGENTS.md");
  const { removed, added } = lineDiff(before, after);
  if (JSON.stringify(removed) !== JSON.stringify(AGENTS_REMOVED)) {
    problems.push(`AGENTS.md removes ${JSON.stringify(removed)}, not the three lines of the matrix`);
  }
  if (JSON.stringify(added) !== JSON.stringify(AGENTS_ADDED)) {
    problems.push(`AGENTS.md adds ${added.length} lines that are not the ${AGENTS_ADDED.length} lines of the matrix`);
  }
  const tail = AGENTS_ADDED.slice(4).join("\n") + "\n";
  if (!after.endsWith(tail)) problems.push('the section "What holds these rules" is not the end of AGENTS.md');

  const security = yaml(readFileSync(join(dir, ".github/workflows/security.yml"), "utf8"));
  if (!security.jobs?.["secret-scan"]) problems.push("security.yml has no job secret-scan");
  const title = yaml(readFileSync(join(dir, ".github/workflows/pr-title.yml"), "utf8"));
  for (const job of ["conventional-title", "conventional-commits"]) {
    if (!title.jobs?.[job]) problems.push(`pr-title.yml has no job ${job}`);
  }
  const plan = run("make", ["-n", "check"], { cwd: dir });
  for (const tool of ["tools/wiki_lint.py", "tools/boundaries.py"]) {
    if (!plan.out.includes(tool)) problems.push(`make check does not run ${tool}`);
  }
} catch (err) {
  problems.push(err.message);
}

verdict(
  NAME,
  problems,
  'AGENTS.md changes only the two split rules and the closing section "What holds these rules"; secret-scan, conventional-title, conventional-commits, the wiki lint and the module boundaries all exist',
);
