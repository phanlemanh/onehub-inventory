// AC-6: on the newest CI run of the pull request's head commit, quick, e2e and check end in success; e2e-db is
// read and printed (it does not block a merge, Hỏi-1 of upgrade-repo-setup-0-9-0), and so is gate, which waits for
// the owner's signature of this record.
// Usage: node ci-pr.mjs [--sha <commit>] [--jobs <file of `gh run view --json jobs` output>]

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { arg, git, root, run, verdict } from "./lib.mjs";
import { CI_REPORTED, CI_REQUIRED } from "./matrix.mjs";

const NAME = "ci-pr";

/** Problems and printed facts for the jobs of one run, as `gh run view --json jobs` gives them. */
export function judge(jobs) {
  const problems = [];
  const by = new Map(jobs.map((j) => [j.name, j]));
  for (const name of CI_REQUIRED) {
    const j = by.get(name);
    if (!j) problems.push(`job ${name} is not in the run`);
    else if (j.status !== "completed") problems.push(`job ${name} is ${j.status}`);
    else if (j.conclusion !== "success") problems.push(`job ${name} ended ${j.conclusion}`);
  }
  const reported = CI_REPORTED.map((name) => `${name} ${by.get(name)?.conclusion || by.get(name)?.status || "absent"}`);
  return { problems, reported };
}

function gh(args) {
  const r = run("gh", args);
  if (r.code !== 0) throw new Error(`cannot read GitHub (gh ${args.slice(0, 2).join(" ")}): ${(r.err || r.out).trim().split("\n")[0]}`);
  return r.out;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const problems = [];
  let line = "";
  try {
    const file = arg("--jobs");
    let jobs;
    let at = "fixture";
    if (file) jobs = JSON.parse(readFileSync(file, "utf8")).jobs;
    else {
      const sha = arg("--sha") ?? git(root([]), "rev-parse", "HEAD").trim();
      const runs = JSON.parse(gh(["run", "list", "--workflow", "ci.yml", "--commit", sha, "--limit", "1", "--json", "databaseId"]));
      if (runs.length === 0) throw new Error(`no CI run on ${sha.slice(0, 8)}`);
      jobs = JSON.parse(gh(["run", "view", String(runs[0].databaseId), "--json", "jobs"])).jobs;
      at = `run ${runs[0].databaseId} on ${sha.slice(0, 8)}`;
    }
    const j = judge(jobs);
    problems.push(...j.problems);
    line = `${at}: ${CI_REQUIRED.join(", ")} success; ${j.reported.join(", ")}`;
  } catch (err) {
    problems.push(err.message);
  }
  verdict(NAME, problems, line);
}
