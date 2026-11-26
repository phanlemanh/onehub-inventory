// AC-6: CodeQL ignores the measures of the acceptance records, exactly them, and nothing in the
// repository runs a measure outside a grading round.
// Usage: node codeql.mjs [--root <dir>]
//   The workflow is read under --root. The list of tracked files always comes from the repository;
//   a caller file is read under --root when it exists there, else from the repository.

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { ALERT_FILES, BEN_GOI, MEASURE_PATH, PATCH_ANCHOR, PATCH_LINES, PATTERN, WORKFLOW } from "./matrix.mjs";
import { atBase, done, lines, matches, read, refuse, REPO, rootOf, tracked } from "./lib.mjs";

const NAME = "codeql";
const root = rootOf();
const tree = lines(read(root, WORKFLOW));
const baseText = atBase(WORKFLOW);
if (baseText === null) refuse(NAME, `the base has no ${WORKFLOW}`);
const base = lines(baseText);
const problems = [];

// The patterns of paths-ignore in the init step.
const anchor = tree.indexOf(PATCH_ANCHOR);
if (anchor < 0) refuse(NAME, "the workflow has no CodeQL init step for javascript-typescript");
const stepEnd = tree.findIndex((l, i) => i > anchor && /^ {6}- /.test(l));
const step = tree.slice(anchor, stepEnd < 0 ? tree.length : stepEnd);
const ignoreAt = step.findIndex((l) => l.trim() === "paths-ignore:");
const patterns = [];
if (ignoreAt < 0) {
  problems.push("the init step has no paths-ignore");
} else {
  for (const l of step.slice(ignoreAt + 1)) {
    const m = l.match(/^\s+- "(.*)"$/);
    if (m === null) break;
    patterns.push(m[1]);
  }
  if (patterns.length !== 1 || patterns[0] !== PATTERN) problems.push(`the pattern is not exactly ${PATTERN}`);
}

// Against the base: every line kept, in order, and exactly the four lines of the patch added.
let seen = 0;
for (const line of base) {
  const found = tree.indexOf(line, seen);
  if (found < 0) {
    problems.push(`the workflow lost a line of the base: ${JSON.stringify(line)}`);
    break;
  }
  seen = found + 1;
}
const at = base.indexOf(PATCH_ANCHOR);
const patched = [...base.slice(0, at + 1), ...PATCH_LINES, ...base.slice(at + 1)];
if (problems.length === 0 && (tree.length !== patched.length || tree.some((l, i) => l !== patched[i]))) {
  problems.push(`the workflow is not the base plus the ${PATCH_LINES.length} lines of the patch`);
}

// What the pattern covers, over every tracked file.
const files = tracked();
const measures = files.filter((f) => /^_acceptance\/[^/]+\/rang\//.test(f));
if (measures.length === 0) refuse(NAME, "no tracked file under _acceptance/<record>/rang/");
const covered = new Set(files.filter((f) => patterns.some((p) => matches(p, f))));
const missed = measures.filter((f) => !covered.has(f));
const outside = [...covered].filter((f) => !measures.includes(f));
if (patterns.length > 0 && missed.length > 0) problems.push(`the pattern misses ${missed.length} measure files, the first: ${missed[0]}`);
if (outside.length > 0) problems.push(`the pattern covers ${outside.length} files outside rang/, the first: ${outside[0]}`);
for (const f of ALERT_FILES) {
  if (!files.includes(f)) refuse(NAME, `the alert file ${f} is not tracked`);
  if (patterns.length > 0 && !covered.has(f)) problems.push(`the alert file ${f} is still scanned`);
}

// The premise of the exclusion: measures run only when a round is graded.
let callers = 0;
for (const { glob, optional } of BEN_GOI) {
  const group = files.filter((f) => matches(glob, f));
  if (group.length === 0 && !optional) refuse(NAME, `no tracked file matches the caller entry ${glob}`);
  for (const f of group) {
    // The ignore pattern itself is a path of measures, not a call: it is taken out before the search.
    const text = readFileSync(existsSync(join(root, f)) ? join(root, f) : join(REPO, f), "utf8").replaceAll(PATTERN, "");
    callers += 1;
    if (MEASURE_PATH.test(text)) problems.push(`a caller names a measure of a record: ${f}`);
  }
}

done(
  NAME,
  problems,
  `the init step ignores exactly ${PATTERN}; against the base the workflow adds the ${PATCH_LINES.length} lines of the patch and removes none; the pattern covers ${measures.length} tracked files under _acceptance/<record>/rang/, the ${ALERT_FILES.length} alert files among them, and 0 of the ${files.length - measures.length} other tracked files; none of the ${callers} caller files (workflows, Makefile, mk, package.json, pre-commit, src, tests, tools, db) names a path under _acceptance/<record>/rang/`,
);
