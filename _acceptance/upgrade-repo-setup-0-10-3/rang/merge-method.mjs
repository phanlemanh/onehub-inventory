// AC-6: merge_method is what github_setup.py reads, and it is the only way to choose.
// On copies of HEAD (the real policy is never changed), through lib.policyView:
//   - as it is (merge_method: merge): no option sets merge commits only (allow_merge_commit true,
//     the other two false); `--merge-method merge` does the same; `--merge-method squash` is refused
//     with exit code 2 and a line that says where the choice is made.
//   - Should not pass: `merge_method: rebase` makes `autonomy.py --check-codeowners` exit 1 naming
//     merge_method, and github_setup.py stop with exit 1 before any change; the tiers stay.
//   - A policy without the key (as before 0.10.3): no option leaves the merge settings as they are,
//     and `--merge-method squash` sets squash for that run.
// Usage: node merge-method.mjs [--root <dir>]

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { git, policyView, root, run, verdict, worktree } from "./lib.mjs";
import { KEEP_TITLE, MERGE_TITLE, POLICY, REFUSED_EXIT, RESOLVED_MERGE_LINE, SQUASH_TITLE } from "./matrix.mjs";

const NAME = "merge-method";
const dir = root();
const problems = [];
const copies = [];
const FILES = ["tools/autonomy.py", "governance/autonomy.yaml", "src/app/page.tsx", "wiki/index.md"];
const MERGE_FIELDS = ["allow_squash_merge=false", "allow_merge_commit=true", "allow_rebase_merge=false"];
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

function copy(edit) {
  const c = worktree(dir, "HEAD");
  copies.push(c);
  const p = join(c.dir, POLICY);
  if (edit) writeFileSync(p, edit(readFileSync(p, "utf8")));
  return c.dir;
}

try {
  const head = copy();
  const plain = policyView(head, FILES);
  if (!plain.merge_what.startsWith(MERGE_TITLE) || !same(plain.merge_fields, MERGE_FIELDS)) {
    problems.push(`with no option github_setup.py sets "${plain.merge_what}" ${JSON.stringify(plain.merge_fields)}`);
  }
  const asked = policyView(head, FILES, ["--merge-method", "merge"]);
  if (asked.exit !== null || !asked.merge_what.startsWith(MERGE_TITLE)) problems.push("--merge-method merge is not taken as the stored choice");
  const other = policyView(head, FILES, ["--merge-method", "squash"]);
  if (other.exit !== REFUSED_EXIT) problems.push(`--merge-method squash against merge_method: merge exits ${other.exit}, not ${REFUSED_EXIT}`);
  if (!/says merge_method: merge, and --merge-method asks for squash/.test(other.stderr)) problems.push("the refusal does not say where the choice is made");

  const bad = copy((t) => t.replace(RESOLVED_MERGE_LINE, "merge_method: rebase"));
  const cc = run("python3", ["-I", "tools/autonomy.py", "--check-codeowners", "--root", bad], { cwd: bad });
  if (cc.code !== 1 || !/merge_method: rebase is not one of squash, merge/.test(cc.err)) problems.push(`with merge_method: rebase the codeowners check exits ${cc.code} without naming it`);
  const all = git(dir, "ls-files").split("\n").filter(Boolean);
  const badView = policyView(bad, all);
  if (badView.exit !== 1 || !/Nothing was changed/.test(badView.stderr)) problems.push(`with merge_method: rebase github_setup.py exits ${badView.exit} without stopping`);
  if (!same(badView.gh_calls, ["repo view"])) problems.push(`with merge_method: rebase github_setup.py asks gh ${JSON.stringify(badView.gh_calls)} before it stops`);
  const allPlain = policyView(head, all);
  if (!same(badView.tiers, allPlain.tiers)) problems.push("merge_method: rebase changes a tier");

  const none = copy((t) => t.replace(`${RESOLVED_MERGE_LINE}\n`, ""));
  const keep = policyView(none, FILES);
  if (!keep.merge_what.startsWith(KEEP_TITLE) || keep.merge_fields.length !== 0) problems.push(`without the key github_setup.py sets "${keep.merge_what}" ${JSON.stringify(keep.merge_fields)}`);
  const once = policyView(none, FILES, ["--merge-method", "squash"]);
  if (!once.merge_what.startsWith(SQUASH_TITLE)) problems.push(`without the key --merge-method squash sets "${once.merge_what}"`);
} catch (err) {
  problems.push(err.message);
} finally {
  copies.forEach((c) => c.remove());
}

verdict(
  NAME,
  problems,
  `github_setup.py reads merge_method: merge (no option or --merge-method merge: ${MERGE_TITLE}); --merge-method squash is refused with exit ${REFUSED_EXIT}, saying where the choice is made; merge_method: rebase turns the codeowners check red and stops github_setup.py, no tier changes; without the key the merge settings are left as they are, and the option sets them for one run`,
);
