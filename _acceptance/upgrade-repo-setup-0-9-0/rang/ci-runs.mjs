// AC-5: CI of PR 88 on CI_COMMIT (the decided ci.yml) ran quick, e2e and check green, and e2e-db
// reported a result (printed; it does not hold check); and on the newest run of a later commit that
// differs from CI_COMMIT only in files the heavy tier does not read, e2e ended green without running again.
// Usage: node ci-runs.mjs [--root <dir>]

import { git, gh, isHeavyInput, root, verdict } from "./lib.mjs";
import { RUN_COMMIT as UPGRADE, HEAVY_NOT_INPUTS, REPO, REUSED } from "./matrix.mjs";

const NAME = "ci-runs";
const dir = root();
const problems = [];
let measured = "";
let reused = "";
let e2eDb = "";

const runs = () =>
  JSON.parse(gh(["run", "list", "-R", REPO, "--workflow", "CI", "--branch", "chore/upgrade-repo-setup-0.9.0", "--limit", "50", "--json", "databaseId,headSha,status,conclusion,createdAt"]));
const jobs = (id) => JSON.parse(gh(["run", "view", String(id), "-R", REPO, "--json", "jobs"])).jobs;

try {
  const all = runs().filter((r) => r.status === "completed");
  const first = all.find((r) => r.headSha === UPGRADE);
  if (!first) problems.push(`no completed CI run on ${UPGRADE.slice(0, 8)}`);
  else {
    const js = jobs(first.databaseId);
    for (const name of ["quick", "e2e", "check"]) {
      const j = js.find((x) => x.name === name);
      if (!j || j.conclusion !== "success") problems.push(`on ${UPGRADE.slice(0, 8)} ${name} is ${j ? j.conclusion : "missing"}, not success`);
    }
    const db = js.find((x) => x.name === "e2e-db");
    if (!db || !db.conclusion) problems.push(`on ${UPGRADE.slice(0, 8)} e2e-db reported no result`);
    else e2eDb = db.conclusion;
  }

  const later = all
    .filter((r) => r.headSha !== UPGRADE && run0(r.headSha))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .find((r) => git(dir, "diff", "--name-only", UPGRADE, r.headSha).split("\n").filter(Boolean).every((f) => !isHeavyInput(dir, f, HEAVY_NOT_INPUTS)));
  if (!later) problems.push(`no run of PR 88 after ${UPGRADE.slice(0, 8)} changes only HEAVY_NOT_INPUTS`);
  else {
    measured = later.headSha;
    const js = jobs(later.databaseId);
    for (const name of REUSED) {
      const j = js.find((x) => x.name === name);
      const step = j?.steps?.find((s) => s.name === "Same inputs as a green run");
      if (!j || j.conclusion !== "success") problems.push(`on ${measured.slice(0, 8)} ${name} is ${j ? j.conclusion : "missing"}, not success`);
      else if (!step || step.conclusion !== "success") problems.push(`on ${measured.slice(0, 8)} ${name} ran again instead of reusing (not run again: same inputs as run …)`);
      else reused = later.databaseId;
    }
  }
} catch (err) {
  problems.push(err.message);
}

/** Whether the commit descends from UPGRADE (a run of an older push is not "after"). */
function run0(sha) {
  try {
    git(dir, "merge-base", "--is-ancestor", UPGRADE, sha);
    return true;
  } catch {
    return false;
  }
}

verdict(
  NAME,
  problems,
  `on ${UPGRADE.slice(0, 8)} quick, e2e and check succeeded (e2e-db: ${e2eDb}); on ${measured.slice(0, 8)}, the newest run whose commit differs from ${UPGRADE.slice(0, 8)} only in HEAVY_NOT_INPUTS, e2e succeeded without running again (same inputs as run ${reused})`,
);
