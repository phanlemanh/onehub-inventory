// AC-6: the checkout of conventional-commits keeps no token, and nothing of the job needs one.
//   - The job's checkout (actions/checkout) has `persist-credentials: false`; at the base it had no
//     `with` (the action's default keeps the token in .git/config).
//   - The script of the judging step writes no `git` command that would need the stored token: the
//     commits and the merge settings come from `gh` with GH_TOKEN of the step's env. pre-commit runs
//     git only locally, and fetches the hook repositories from public URLs into its own cache.
//   - Known limit, unchanged by the upgrade: GH_TOKEN is in the env of the whole step, so pre-commit
//     and every hook inherit it (contents: read; the hooks come from the base branch).
//   - No other job of pr-title.yml checks out the repository.
// Usage: node credentials.mjs [--root <dir>]

import { readFileSync } from "node:fs";
import { join } from "node:path";

import { WORKFLOW, prBase, root, show, verdict, yaml } from "./lib.mjs";

const NAME = "credentials";
const dir = root();
const problems = [];

try {
  const wf = yaml(readFileSync(join(dir, WORKFLOW), "utf8"));
  const base = yaml(show(dir, prBase(dir), WORKFLOW) ?? "{}");
  const steps = wf.jobs["conventional-commits"].steps;
  const checkout = steps.filter((s) => String(s.uses ?? "").startsWith("actions/checkout@"));
  if (checkout.length !== 1) problems.push(`conventional-commits checks out ${checkout.length} times, not once`);
  if (checkout[0]?.with?.["persist-credentials"] !== false) problems.push("the checkout of conventional-commits keeps the token");
  const before = base.jobs?.["conventional-commits"]?.steps?.find((s) => String(s.uses ?? "").startsWith("actions/checkout@"));
  if (!before || before.with !== undefined) problems.push("at the base the checkout of conventional-commits was not the action's default");

  const judging = steps.filter((s) => typeof s.run === "string");
  for (const s of judging) {
    const lines = s.run.split("\n").filter((l) => !/^\s*#/.test(l));
    const gitLines = lines.filter((l) => /(^|[\s;|&(`$])git\s/.test(l));
    if (gitLines.length > 0) problems.push(`the step "${s.name}" runs git: ${JSON.stringify(gitLines.map((l) => l.trim()))}`);
    if (s.env?.GH_TOKEN !== "${{ github.token }}") problems.push(`the step "${s.name}" does not get the token from its env`);
  }
  for (const [name, job] of Object.entries(wf.jobs)) {
    if (name === "conventional-commits") continue;
    if ((job.steps ?? []).some((s) => String(s.uses ?? "").startsWith("actions/checkout@"))) problems.push(`the job ${name} checks out the repository`);
  }

} catch (err) {
  problems.push(err.message);
}

verdict(
  NAME,
  problems,
  "the checkout of conventional-commits keeps no token in .git/config (persist-credentials: false, the action's default at the base); the script of the judging step writes no git command and gets the token for gh from its env; no other job of pr-title.yml checks out",
);
