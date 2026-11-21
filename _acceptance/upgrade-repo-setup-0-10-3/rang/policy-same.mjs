// AC-5: nothing the policy decides changes, except the merge method github_setup.py would set.
// Read through each tree's own tools (lib.policyView) in three trees: the base, HEAD, and a copy of
// HEAD whose policy is the minimal resolution (the base's side of the marked block plus the
// merge_method block only).
//   - The tier of every tracked file of HEAD and of all of them together, the tier of a deleted test
//     file and of a bot's dependency update, the proof, the policy's problems (none), the CODEOWNERS
//     block (and it is the committed .github/CODEOWNERS), and every step github_setup.py would take
//     besides the merge step (environments, ruleset with its required checks) are the same in the
//     three.
//   - The merge step, run with no option: the base sets squash-only merges (the hazard 0.10.3
//     removes); HEAD and the minimal copy set merge commits only.
// --file <path> stands in for HEAD's policy file (two-way.mjs).
// Usage: node policy-same.mjs [--root <dir>] [--file <path>]

import { readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

import { applyTag, git, markedPolicy, policyView, prBase, root, verdict, worktree } from "./lib.mjs";
import { MERGE_TITLE, POLICY, RESOLVED_MERGE_LINE, SQUASH_TITLE, TEMPLATE_MERGE_LINE } from "./matrix.mjs";

const NAME = "policy-same";
const dir = root();
const fi = process.argv.indexOf("--file");
const problems = [];
const copies = [];
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

function copy(ref) {
  const c = worktree(dir, ref);
  copies.push(c);
  return c.dir;
}

try {
  const base = prBase(dir);
  const files = git(dir, "ls-files").split("\n").filter(Boolean);
  const head = copy("HEAD");
  if (fi >= 0) writeFileSync(join(head, POLICY), readFileSync(resolve(process.argv[fi + 1])));

  const m = markedPolicy(dir, base, (at) => applyTag(at));
  const block = m.theirs.split("\n");
  const start = block.findIndex((l) => l.startsWith("# How pull requests merge"));
  const end = block.indexOf(TEMPLATE_MERGE_LINE);
  if (start < 0 || end < start) throw new Error("the 0.10.3 side has no merge_method block");
  const mergeBlock = [...block.slice(start, end), RESOLVED_MERGE_LINE, ""].join("\n");
  const minimal = copy("HEAD");
  writeFileSync(join(minimal, POLICY), m.before + mergeBlock + m.ours + m.after);

  const views = { base: policyView(copy(base), files), HEAD: policyView(head, files), minimal: policyView(minimal, files) };
  const codeowners = readFileSync(join(dir, ".github/CODEOWNERS"), "utf8");
  for (const [where, v] of Object.entries(views)) {
    if (v.problems.length > 0) problems.push(`${where}: the policy has problems: ${v.problems.join("; ")}`);
    if (!codeowners.includes(v.codeowners)) problems.push(`${where}: the CODEOWNERS block is not the committed .github/CODEOWNERS`);
  }
  for (const where of ["HEAD", "minimal"]) {
    const v = views[where];
    const changedTiers = files.filter((f) => v.tiers[f] !== views.base.tiers[f]);
    if (changedTiers.length > 0) problems.push(`${where}: the tier changes for ${changedTiers.length} files, first ${changedTiers[0]}: ${views.base.tiers[changedTiers[0]]} to ${v.tiers[changedTiers[0]]}`);
    for (const key of ["tier", "proof", "codeowners", "checks", "special", "other_steps"]) {
      if (!same(v[key], views.base[key])) problems.push(`${where}: ${key} differs from the base`);
    }
    if (!v.merge_what.startsWith(MERGE_TITLE)) problems.push(`${where}: with no option github_setup.py would set "${v.merge_what}", not ${MERGE_TITLE}`);
  }
  if (!views.base.merge_what.startsWith(SQUASH_TITLE)) problems.push(`the base would set "${views.base.merge_what}" with no option, not ${SQUASH_TITLE}`);
} catch (err) {
  problems.push(err.message);
} finally {
  copies.forEach((c) => c.remove());
}

verdict(
  NAME,
  problems,
  `in the base, HEAD and the minimal resolution the tier of every tracked file, of a deleted test and of a bot update, the proof (none), the CODEOWNERS block (the committed one) and every step but the merge step (environments, ruleset, required checks) are the same and the policy has no problem; with no option the base would set ${SQUASH_TITLE}, HEAD and the minimal resolution ${MERGE_TITLE}`,
);
