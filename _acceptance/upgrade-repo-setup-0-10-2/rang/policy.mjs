// AC-8: on a copy of HEAD (a temp worktree; the real governance/autonomy.yaml is never changed), the
// policy may name `gate`, the kit's job, now that this repository has no agent pipeline.
//   - `required_checks: [gate]`: `tools/autonomy.py --check-codeowners` exits 0, required_checks is
//     ["gate"], and the ruleset github_setup.py would write requires `gate` once.
//   - `proof: {check: gate}`: --check-codeowners exits 0, `--files` reports proof "gate", and the
//     ruleset requires `gate` once; named in both places, still once.
//   The ruleset is read through github_setup.main as it is (stand-ins for gh), so its wiring counts.
//   - Should not pass: the same copy with .github/workflows/pr-pipeline.yml refuses both, naming
//     gate; `check` and `secret-scan` stay refused; the tools of the base refuse `gate`.
//   - The real policy names no `gate`, and the repository has no pr-pipeline.yml.
// Usage: node policy.mjs [--root <dir>]

import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { prBase, root, run, show, verdict, worktree, yaml } from "./lib.mjs";
import { AGENT_CHECK, AGENT_WORKFLOW, OWN_EVERYWHERE } from "./matrix.mjs";

const NAME = "policy";
const POLICY = "governance/autonomy.yaml";
const dir = root();
const problems = [];

// The checks the ruleset would require, through github_setup.main as it is (offline): `gh` and the
// two readers of GitHub are stand-ins, and plan() is caught with the arguments main gives it.
const PLAN = `
import json, sys
sys.path.insert(0, "tools")
import github_setup as g
g.gh = lambda args, *a, **k: (True, json.dumps({"nameWithOwner": "o/r", "defaultBranchRef": {"name": "main"}}))
g.commit_format_checks = lambda root, repo, branch: (["conventional-title", "conventional-commits"], [], [])
g.kept_checks = lambda repo, unread: []
real = g.plan
class Caught(Exception):
    pass
def caught(*args, **kwargs):
    raise Caught(real(*args, **kwargs))
g.plan = caught
try:
    g.main([])
    sys.exit("github_setup.main did not call plan")
except Caught as c:
    steps = c.args[0]
rules = [r for s in steps if "ruleset" in s for r in s["ruleset"]["rules"] if r["type"] == "required_status_checks"]
print(json.dumps([c["context"] for r in rules for c in r["parameters"]["required_status_checks"]]))
`;

function check(at) {
  const r = run("python3", ["-I", "tools/autonomy.py", "--check-codeowners", "--root", at], { cwd: at });
  return { code: r.code, out: (r.out + r.err).trim() };
}

function planned(at) {
  const r = run("python3", ["-I", "-c", PLAN], { cwd: at });
  if (r.code !== 0) throw new Error(`github_setup.plan failed: ${r.err.trim().split("\n").pop()}`);
  return JSON.parse(r.out);
}

try {
  const real = yaml(readFileSync(join(dir, POLICY), "utf8"));
  if (JSON.stringify(real).includes(`"${AGENT_CHECK}"`)) problems.push(`the real ${POLICY} names ${AGENT_CHECK}`);
  if (existsSync(join(dir, AGENT_WORKFLOW))) problems.push(`the repository has ${AGENT_WORKFLOW}`);

  const c = worktree(dir, "HEAD");
  try {
    const original = readFileSync(join(c.dir, POLICY), "utf8");
    const withPolicy = (extra) => writeFileSync(join(c.dir, POLICY), `${original}\n${extra}\n`);
    const once = (where) => {
      const checks = planned(c.dir);
      const n = checks.filter((x) => x === AGENT_CHECK).length;
      if (n !== 1) problems.push(`${where}: the ruleset would require ${AGENT_CHECK} ${n} times (${JSON.stringify(checks)})`);
    };

    withPolicy(`required_checks: [${AGENT_CHECK}]`);
    let r = check(c.dir);
    if (r.code !== 0) problems.push(`required_checks: [${AGENT_CHECK}] is refused: ${r.out}`);
    once(`required_checks: [${AGENT_CHECK}]`);

    withPolicy(`proof:\n  check: ${AGENT_CHECK}`);
    r = check(c.dir);
    if (r.code !== 0) problems.push(`proof.check: ${AGENT_CHECK} is refused: ${r.out}`);
    const cls = run("python3", ["-I", "tools/autonomy.py", "--root", c.dir, "--files", "tools/autonomy.py"], { cwd: c.dir });
    const proof = cls.code === 0 ? JSON.parse(cls.out).proof : `exit ${cls.code}`;
    if (proof !== AGENT_CHECK) problems.push(`with proof.check: ${AGENT_CHECK} the classification reports proof ${JSON.stringify(proof)}`);
    once(`proof.check: ${AGENT_CHECK}`);

    withPolicy(`required_checks: [${AGENT_CHECK}]\nproof:\n  check: ${AGENT_CHECK}`);
    r = check(c.dir);
    if (r.code !== 0) problems.push(`${AGENT_CHECK} named in both places is refused: ${r.out}`);
    once(`${AGENT_CHECK} in both required_checks and proof.check`);

    for (const name of OWN_EVERYWHERE) {
      withPolicy(`required_checks: [${name}]`);
      r = check(c.dir);
      if (r.code === 0 || !r.out.includes(`required_checks: ${name}`)) problems.push(`required_checks: [${name}] is not refused`);
    }

    mkdirSync(join(c.dir, ".github/workflows"), { recursive: true });
    writeFileSync(join(c.dir, AGENT_WORKFLOW), "name: agent pipeline\n");
    for (const [extra, says] of [
      [`required_checks: [${AGENT_CHECK}]`, `required_checks: ${AGENT_CHECK}`],
      [`proof:\n  check: ${AGENT_CHECK}`, `proof.check: ${AGENT_CHECK}`],
    ]) {
      withPolicy(extra);
      r = check(c.dir);
      if (r.code === 0 || !r.out.includes(says)) problems.push(`with ${AGENT_WORKFLOW}, "${extra.replaceAll("\n", " ")}" is not refused`);
    }
    rmSync(join(c.dir, AGENT_WORKFLOW));

    const base = prBase(dir);
    for (const f of ["tools/autonomy.py", "tools/github_setup.py"]) writeFileSync(join(c.dir, f), show(dir, base, f) ?? "");
    withPolicy(`required_checks: [${AGENT_CHECK}]`);
    r = check(c.dir);
    if (r.code === 0 || !r.out.includes(`required_checks: ${AGENT_CHECK}`)) problems.push(`the tools of the base accept required_checks: [${AGENT_CHECK}]`);
  } finally {
    c.remove();
  }
} catch (err) {
  problems.push(err.message);
}

verdict(
  NAME,
  problems,
  `on a copy, the policy may name ${AGENT_CHECK} under required_checks or as proof.check: the codeowners check passes, the classification reports the proof, and the ruleset github_setup.py main would write requires ${AGENT_CHECK} once, also when named in both places; with ${AGENT_WORKFLOW} both are refused again, check and secret-scan stay refused, and the tools of the base refuse ${AGENT_CHECK}; the real policy is unchanged`,
);
