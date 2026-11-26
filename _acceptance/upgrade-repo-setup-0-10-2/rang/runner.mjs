// AC-7: on GitHub, the conventional-commits job of PR 95 ran the workflow of the base branch, not the
// one of the pull request (pull_request_target). Read from the pinned run PR_RUN, the first of the
// upgrade commit (the earliest PR title run of it, first attempt): event pull_request_target, head the upgrade commit; its log checks out main with
// `persist-credentials: true` and its script has no `show_hook_output`. So the fenced job of 0.10.2
// has not run on a runner, and runs first on an event of a pull request after the merge.
// --run <id> --job <id> stand in for PR_RUN (two-way.mjs).
// Usage: node runner.mjs [--run <id> --job <id>]

import { run, verdict } from "./lib.mjs";
import { PR_RUN, REPO } from "./matrix.mjs";

const NAME = "runner";
const problems = [];
const argv = process.argv.slice(2);
const opt = (n, d) => (argv.includes(n) ? Number(argv[argv.indexOf(n) + 1]) : d);
const RUN = { ...PR_RUN, run: opt("--run", PR_RUN.run), job: opt("--job", PR_RUN.job) };

try {
  const meta = run("gh", ["api", `repos/${REPO}/actions/runs/${RUN.run}`, "--jq", "[.event, .head_sha, .path] | @tsv"]);
  if (meta.code !== 0) throw new Error(`cannot read run ${RUN.run}: ${meta.err.trim()}`);
  const [event, head, path] = meta.out.trim().split("\t");
  if (event !== "pull_request_target") problems.push(`run ${RUN.run} came from ${event}, not pull_request_target`);
  if (head !== RUN.head) problems.push(`run ${RUN.run} is for ${head}, not the upgrade commit`);
  if (path !== ".github/workflows/pr-title.yml") problems.push(`run ${RUN.run} is of ${path}`);
  const all = run("gh", ["api", `repos/${REPO}/actions/workflows/pr-title.yml/runs?head_sha=${RUN.head}&per_page=100`, "--jq", "[.workflow_runs[] | {id, run_attempt}]"]);
  if (all.code !== 0) throw new Error(`cannot list the runs of ${RUN.head}`);
  const runs = JSON.parse(all.out);
  const first = runs.reduce((m, x) => (m === null || x.id < m.id ? x : m), null);
  if (!first || first.id !== RUN.run || first.run_attempt !== 1) problems.push(`run ${RUN.run} is not the first attempt of the first PR title run of ${RUN.head.slice(0, 8)}`);

  const log = run("gh", ["api", `repos/${REPO}/actions/jobs/${RUN.job}/logs`]);
  if (log.code !== 0) throw new Error(`cannot read the log of job ${RUN.job}: ${log.err.trim()}`);
  const text = log.out;
  if (!/persist-credentials: true/.test(text)) problems.push("the log does not show the checkout keeping the token");
  if (!/git checkout --progress --force -B main refs\/remotes\/origin\/main/.test(text)) problems.push("the log does not show the checkout of main");
  if (/show_hook_output|stop-commands/.test(text)) problems.push("the log shows the fenced script of 0.10.2");
  if (!/own_error=/.test(text)) problems.push("the log does not show the judging script at all");
} catch (err) {
  problems.push(err.message);
}

verdict(
  NAME,
  problems,
  `run ${RUN.run} of PR 95 (pull_request_target, the upgrade commit) checked out main with the token kept and ran the base's unfenced script: the job of 0.10.2 has not run on a runner yet, and runs first on a pull request event after the merge`,
);
