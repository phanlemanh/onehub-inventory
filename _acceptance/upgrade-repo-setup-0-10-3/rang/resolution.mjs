// AC-4: the hand resolution of governance/autonomy.yaml.
//   - apply.py of the tag, applied to a copy of the base, marks one block of the policy file.
//   - HEAD's file is that marked file with the block replaced by its repo-setup 0.10.3 side, and in
//     that side exactly one line changed: `merge_method: squash` became `merge_method: merge`.
//   - Read as YAML, HEAD's policy is the base's plus exactly the keys of ADDED_KEYS: `proof` with
//     an empty check, an empty `required_checks` and `merge_method: merge`. Nothing else differs.
//   - The two comment lines over `owners` that the block replaced are the template's, word for word.
// --file <path> stands in for HEAD's policy file (two-way.mjs).
// Usage: node resolution.mjs [--root <dir>] [--file <path>]

import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";

import { applyTag, markedPolicy, prBase, root, show, verdict, yaml } from "./lib.mjs";
import { ADDED_KEYS, POLICY, RESOLVED_MERGE_LINE, TEMPLATE_MERGE_LINE } from "./matrix.mjs";

const NAME = "resolution";
const dir = root();
const fi = process.argv.indexOf("--file");
const file = fi >= 0 ? resolve(process.argv[fi + 1]) : join(dir, POLICY);
const problems = [];
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

try {
  const base = prBase(dir);
  const m = markedPolicy(dir, base, (at) => applyTag(at));
  const theirs = m.theirs.split("\n");
  if (theirs.filter((l) => l === TEMPLATE_MERGE_LINE).length !== 1) throw new Error(`the 0.10.3 side does not hold "${TEMPLATE_MERGE_LINE}" once`);
  const resolved = m.before + theirs.map((l) => (l === TEMPLATE_MERGE_LINE ? RESOLVED_MERGE_LINE : l)).join("\n") + m.after;
  const head = readFileSync(file, "utf8");
  if (head !== resolved) {
    const a = resolved.split("\n");
    const b = head.split("\n");
    const at = a.findIndex((l, i) => l !== b[i]);
    problems.push(`${POLICY} is not the 0.10.3 side of the marked block with merge_method: merge (first difference at line ${at + 1}: ${JSON.stringify(b[at])})`);
  }

  const before = yaml(show(dir, base, POLICY) ?? "");
  const after = yaml(head);
  for (const k of new Set([...Object.keys(before), ...Object.keys(after), ...Object.keys(ADDED_KEYS)])) {
    if (k in ADDED_KEYS) {
      if (k in before) problems.push(`the base already had the key ${k}`);
      if (!same(after[k], ADDED_KEYS[k])) problems.push(`${k} is ${JSON.stringify(after[k])}, not ${JSON.stringify(ADDED_KEYS[k])}`);
    } else if (!same(before[k], after[k])) {
      problems.push(`the key ${k} of the policy changed`);
    }
  }
  const owners = m.theirs.split("\n").filter((l) => l.startsWith("# Deciders") || l.startsWith("# A path with no owner"));
  if (owners.length !== 2 || !owners.every((l) => head.includes(`${l}\n`))) problems.push("the comment over owners is not the template's two lines");
} catch (err) {
  problems.push(err.message);
}

verdict(
  NAME,
  problems,
  "governance/autonomy.yaml is the marked file of apply.py with the block on the side of repo-setup 0.10.3 and one line changed, merge_method: squash to merge; as YAML it is the base's policy plus proof with an empty check, an empty required_checks and merge_method: merge, nothing else",
);
