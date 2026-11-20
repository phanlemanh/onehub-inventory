// AC-9: what GitHub does with the two jobs of pr-title.yml in this repository. The active ruleset of
// main requires exactly REQUIRED_CHECKS (neither conventional-title nor conventional-commits), main
// has no classic branch protection that could add one, and the merge settings allow merge commits
// or rebase, so conventional-commits takes the path that judges the commits.
// Usage: node ruleset.mjs

import { run, verdict } from "./lib.mjs";
import { REPO, REQUIRED_CHECKS } from "./matrix.mjs";

const NAME = "ruleset";
const problems = [];

function api(path) {
  const r = run("gh", ["api", path]);
  return { code: r.code, body: r.code === 0 ? JSON.parse(r.out) : null, err: (r.err || r.out).trim() };
}

try {
  const list = api(`repos/${REPO}/rulesets`);
  if (list.code !== 0) throw new Error(`cannot read the rulesets: ${list.err.split("\n")[0]}`);
  const required = [];
  for (const rs of list.body.filter((r) => r.target === "branch" && r.enforcement === "active")) {
    const full = api(`repos/${REPO}/rulesets/${rs.id}`);
    if (full.code !== 0) throw new Error(`cannot read ruleset ${rs.id}`);
    for (const rule of full.body.rules ?? []) {
      if (rule.type !== "required_status_checks") continue;
      for (const c of rule.parameters.required_status_checks) required.push(c.context);
    }
  }
  if (JSON.stringify(required.sort()) !== JSON.stringify([...REQUIRED_CHECKS].sort())) {
    problems.push(`the active rulesets require ${JSON.stringify(required)}, not ${JSON.stringify(REQUIRED_CHECKS)}`);
  }
  for (const job of ["conventional-title", "conventional-commits"]) {
    if (required.includes(job)) problems.push(`${job} is a required check`);
  }
  const prot = api(`repos/${REPO}/branches/main/protection`);
  if (prot.code === 0) {
    const ctx = prot.body.required_status_checks?.contexts ?? [];
    if (ctx.length > 0) problems.push(`the branch protection of main requires ${JSON.stringify(ctx)}`);
  } else if (!/Branch not protected|404/.test(prot.err)) {
    problems.push(`cannot read the branch protection of main: ${prot.err.split("\n")[0]}`);
  }
  const repo = api(`repos/${REPO}`);
  if (repo.code !== 0) throw new Error("cannot read the merge settings");
  if (!(repo.body.allow_merge_commit || repo.body.allow_rebase_merge)) {
    problems.push("merge commits and rebase are both off: conventional-commits would judge nothing");
  }
} catch (err) {
  problems.push(err.message);
}

verdict(
  NAME,
  problems,
  `main requires ${REQUIRED_CHECKS.join(", ")} only, no classic protection adds a check, and merge commits or rebase are allowed, so conventional-commits judges the commits without blocking a merge`,
);
