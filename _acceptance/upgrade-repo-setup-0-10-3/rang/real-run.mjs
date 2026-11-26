// AC-7: the first run of merge_method on a real repository, as a dry run (it reads GitHub and changes
// nothing): `python3 tools/github_setup.py` in this tree, with the real gh.
//   - It exits 0 and says "Dry run"; its merge step is merge commits only; the ruleset it would set
//     requires PLANNED_CHECKS.
//   - `--merge-method squash` exits 2 and changes nothing.
//   - The ruleset GitHub has today requires RULESET_CHECKS: the mismatch is the owner's to settle,
//     and this pull request does not change it. The only ruleset is named "main", not the name
//     github_setup.py looks for, so --apply would add a second ruleset rather than update or stop;
//     and main's pull request rule does not require a code owner's review. Both are recorded, not
//     changed.
// --apply is never run here.
// Usage: node real-run.mjs [--root <dir>]

import { root, run, verdict } from "./lib.mjs";
import { CODE_OWNER_REVIEW, MERGE_TITLE, PLANNED_CHECKS, REFUSED_EXIT, REPO, RULESET_CHECKS, RULESET_NAMES, SETUP_RULESET } from "./matrix.mjs";

const NAME = "real-run";
const dir = root();
const problems = [];

try {
  const dry = run("python3", ["tools/github_setup.py"], { cwd: dir });
  const out = dry.out + dry.err;
  if (dry.code !== 0) problems.push(`the dry run exits ${dry.code}: ${out.trim().split("\n").pop()}`);
  if (!/^Dry run for /m.test(out)) problems.push("the run does not say it is a dry run");
  if (/^Applying /m.test(out)) problems.push("the run applied changes");
  if (!new RegExp(`^  - ${MERGE_TITLE}, delete merged branches$`, "m").test(out)) problems.push(`the dry run does not set ${MERGE_TITLE}`);
  const rs = /^ {2}- ruleset on main: .* checks (.*)$/m.exec(out);
  const planned = rs ? rs[1].split(", ") : [];
  if (JSON.stringify(planned) !== JSON.stringify(PLANNED_CHECKS)) problems.push(`the dry run would require ${JSON.stringify(planned)}, not ${JSON.stringify(PLANNED_CHECKS)}`);

  const squash = run("python3", ["tools/github_setup.py", "--merge-method", "squash"], { cwd: dir });
  if (squash.code !== REFUSED_EXIT) problems.push(`--merge-method squash exits ${squash.code}, not ${REFUSED_EXIT}`);
  if (!/says merge_method: merge, and --merge-method asks for squash/.test(squash.err)) problems.push("--merge-method squash is not refused for the stored merge_method");

  // The ruleset github_setup.py would update is the one with its own name; main has another.
  const sets = run("gh", ["api", `repos/${REPO}/rulesets`, "--jq", ".[] | .name"]);
  if (sets.code !== 0) throw new Error("cannot read the rulesets");
  const names = sets.out.split("\n").filter(Boolean);
  if (JSON.stringify(names) !== JSON.stringify(RULESET_NAMES)) problems.push(`the rulesets are ${JSON.stringify(names)}, not ${JSON.stringify(RULESET_NAMES)}`);
  if (names.includes(SETUP_RULESET)) problems.push(`a ruleset named "${SETUP_RULESET}" exists: --apply would update it`);
  const owner = run("gh", ["api", `repos/${REPO}/rules/branches/main`, "--jq", '.[] | select(.type=="pull_request") | .parameters.require_code_owner_review']);
  if (owner.out.trim() !== String(CODE_OWNER_REVIEW)) problems.push(`main's pull request rule has require_code_owner_review ${owner.out.trim()}, not ${CODE_OWNER_REVIEW}`);

  const rules = run("gh", ["api", `repos/${REPO}/rules/branches/main`, "--jq", '.[] | select(.type=="required_status_checks") | .parameters.required_status_checks[].context']);
  if (rules.code !== 0) throw new Error("cannot read the rules of main");
  const required = rules.out.split("\n").filter(Boolean).sort();
  if (JSON.stringify(required) !== JSON.stringify([...RULESET_CHECKS].sort())) problems.push(`main requires ${JSON.stringify(required)} today, not ${JSON.stringify(RULESET_CHECKS)}`);
} catch (err) {
  problems.push(err.message);
}

verdict(
  NAME,
  problems,
  `the dry run of github_setup.py on ${REPO} exits 0 and would set ${MERGE_TITLE} and require ${PLANNED_CHECKS.join(", ")}; --merge-method squash exits ${REFUSED_EXIT}; main requires ${RULESET_CHECKS.join(", ")} today from its one ruleset "${RULESET_NAMES[0]}" (not "${SETUP_RULESET}", so --apply would add a second ruleset) with no code owner review required: left to the owner`,
);
