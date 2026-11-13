#!/usr/bin/env node
// The real CI run of row 1s (_acceptance/ci-co-postgres AC-10, E10): the latest run of the CI workflow on this
// branch's head commit, read through gh. Green only when the job e2e-db succeeded, its log has
// `bo qua can dang nhap: 0` and `ci-db: 6/6 bước đạt`, and it took no longer than the job's timeout-minutes. Prints
//   run <id> · e2e-db <m> phut · tong CI <m> (main <m>)
//
//   node db/scripts/ci-that.mjs [--cho <phút>]
//   --cho  wait up to this many minutes for the run on HEAD to appear and finish (a grading round starts right after
//          the push); default 0, read once.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const sh = (cmd, args) =>
  execFileSync(cmd, args, { cwd: ROOT, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
const gh = (...args) => sh("gh", args);
const minutes = (from, to) => (new Date(to).getTime() - new Date(from).getTime()) / 60000;
const fmt = (m) => m.toFixed(1);

function fail(msg) {
  console.log(`ci-that: ${msg}`);
  process.exit(1);
}

const workflow = readFileSync(join(ROOT, ".github/workflows/ci.yml"), "utf8");
const block = workflow.split(/\n(?= {2}[a-z0-9-]+:\n)/).find((b) => b.startsWith("  e2e-db:"));
if (!block) fail("tep CI chua co job e2e-db");
const timeout = Number(block.match(/^ {4}timeout-minutes: (\d+)$/m)?.[1]);
if (!timeout) fail("job e2e-db khong khai timeout-minutes");

const sha = sh("git", ["rev-parse", "HEAD"]).trim();
const branch = sh("git", ["rev-parse", "--abbrev-ref", "HEAD"]).trim();
const fields = "databaseId,headSha,status,conclusion,startedAt,updatedAt,event";
const choIdx = process.argv.indexOf("--cho");
const choMin = choIdx > 0 ? Number(process.argv[choIdx + 1]) : 0;
const deadline = Date.now() + choMin * 60000;
let runs;
let run;
for (;;) {
  runs = JSON.parse(
    gh("run", "list", "--workflow", "ci.yml", "--branch", branch, "-L", "30", "--json", fields),
  );
  run =
    runs.find((r) => r.headSha === sha && r.event === "pull_request") ??
    runs.find((r) => r.headSha === sha);
  if ((run && run.status === "completed") || Date.now() >= deadline) break;
  execFileSync("sleep", ["60"]);
}
if (!run) fail(`chua co luot CI tren dau nhanh ${sha.slice(0, 7)}`);
if (run.status !== "completed") fail(`luot ${run.databaseId} chua xong (${run.status})`);

const jobs = JSON.parse(gh("run", "view", String(run.databaseId), "--json", "jobs")).jobs;
const job = jobs.find((j) => j.name === "e2e-db");
if (!job) fail(`luot ${run.databaseId} khong co job e2e-db`);
const jobMin = minutes(job.startedAt, job.completedAt);
const log = gh("run", "view", "--job", String(job.databaseId), "--log");

const problems = [];
if (job.conclusion !== "success") problems.push(`job e2e-db ${job.conclusion}`);
for (const line of ["bo qua can dang nhap: 0", "ci-db: 6/6 bước đạt"])
  if (!log.includes(line)) problems.push(`nhat ky thieu '${line}'`);
if (jobMin > timeout) problems.push(`job e2e-db ${fmt(jobMin)} phut > tran ${timeout}`);

const mains = JSON.parse(
  gh("run", "list", "--workflow", "ci.yml", "--branch", "main", "-L", "10", "--json", fields),
);
const main = mains.find((r) => r.status === "completed" && r.conclusion === "success");
const total = minutes(run.startedAt, run.updatedAt);
const mainTotal = main ? fmt(minutes(main.startedAt, main.updatedAt)) : "?";
console.log(
  `run ${run.databaseId} · e2e-db ${fmt(jobMin)} phut · tong CI ${fmt(total)} (main ${mainTotal})`,
);
for (const p of problems) console.log(`ci-that: ${p}`);
process.exit(problems.length > 0 ? 1 : 0);
