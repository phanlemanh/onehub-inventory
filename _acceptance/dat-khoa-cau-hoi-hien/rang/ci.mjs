#!/usr/bin/env node
// CI of PR #134 on the branch head (record dat-khoa-cau-hoi-hien, AC-7). Read-only through gh: the check runs of the
// head commit; quick, e2e and e2e-db must be completed and successful. The gate job is reported, not required: it
// turns green only once this record is signed.
//
//   node ci.mjs            prints `ci ok: …` or the red lines; exit 0 green, 1 red or not finished
//   node ci.mjs --tu-kiem  the real data just read must be green, and four breaks of it red with their pinned message
// The GitHub head must be the commit being graded (git rev-parse HEAD), so CI is never read for another commit.
import { execFileSync } from "node:child_process";

const PR = "134";
const REQUIRED = ["quick", "e2e", "e2e-db"];
const gh = (...a) => execFileSync("gh", a, { encoding: "utf8" });

/** check runs → pinned red lines (empty = green). */
export function check(sha, runs) {
  const errs = [];
  for (const name of REQUIRED) {
    const all = runs.filter((r) => r.name === name);
    if (all.length === 0) {
      errs.push(`ci: thiếu việc ${name} trên đầu nhánh ${sha.slice(0, 8)}`);
      continue;
    }
    const last = all.sort((a, b) => String(b.started_at).localeCompare(String(a.started_at)))[0];
    if (last.status !== "completed") errs.push(`ci: ${name} trên đầu nhánh ${sha.slice(0, 8)} chưa xong (${last.status})`);
    else if (last.conclusion !== "success")
      errs.push(`ci: ${name} trên đầu nhánh ${sha.slice(0, 8)} không xanh (${last.conclusion})`);
  }
  return errs;
}

const repo = gh("repo", "view", "--json", "nameWithOwner", "-q", ".nameWithOwner").trim();
const sha = gh("pr", "view", PR, "--json", "headRefOid", "-q", ".headRefOid").trim();
// CI must be read for the very commit being graded, not for whatever the branch on GitHub points at.
const local = execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();
/** Pinned red line when the GitHub head is not the commit being graded (empty = same commit). */
export function sameHead(remote, here) {
  return remote === here ? [] : [`ci: đầu nhánh trên GitHub ${remote.slice(0, 8)} không phải bản đang chấm ${here.slice(0, 8)}`];
}
const runs = JSON.parse(gh("api", `repos/${repo}/commits/${sha}/check-runs?per_page=100`)).check_runs.map((r) => ({
  name: r.name,
  status: r.status,
  conclusion: r.conclusion,
  started_at: r.started_at,
}));
const gate = runs.find((r) => r.name === "gate");
const gateText = gate ? `${gate.status}${gate.conclusion ? `/${gate.conclusion}` : ""}` : "không có";

if (process.argv.includes("--tu-kiem")) {
  const real = [...sameHead(sha, local), ...check(sha, runs)];
  if (real.length) {
    console.log(`tu-kiem: không chạy được — dữ liệu CI thật chưa xanh: ${real.join(" · ")}`);
    process.exit(1);
  }
  const edit = (name, change) => runs.map((r) => (r.name === name ? { ...r, ...change } : r));
  const s = sha.slice(0, 8);
  const cases = [
    ["vat-lanh", runs, null],
    ["pha-e2e-db-do", edit("e2e-db", { conclusion: "failure" }), `ci: e2e-db trên đầu nhánh ${s} không xanh (failure)`],
    ["pha-e2e-chua-xong", edit("e2e", { status: "in_progress", conclusion: null }), `ci: e2e trên đầu nhánh ${s} chưa xong (in_progress)`],
    ["pha-thieu-quick", runs.filter((r) => r.name !== "quick"), `ci: thiếu việc quick trên đầu nhánh ${s}`],
  ];
  let good = 0;
  for (const [name, data, pinned] of cases) {
    const errs = check(sha, data);
    const ok = pinned === null ? errs.length === 0 : errs.includes(pinned);
    console.log(`${ok ? "ok" : "DO"} ${name} — ${errs[0] ?? "xanh"}`);
    if (ok) good++;
  }
  // The same real data read for another commit than the one being graded.
  const other = "0".repeat(40);
  const headErrs = sameHead(sha, other);
  const headPinned = `ci: đầu nhánh trên GitHub ${sha.slice(0, 8)} không phải bản đang chấm ${other.slice(0, 8)}`;
  const headOk = headErrs.includes(headPinned);
  console.log(`${headOk ? "ok" : "DO"} pha-dau-khac — ${headErrs[0] ?? "xanh"}`);
  if (headOk) good++;
  const total = cases.length + 1;
  console.log(`tu-kiem: ${good}/${total} ca đúng`);
  process.exit(good === total ? 0 : 1);
}

const errs = [...sameHead(sha, local), ...check(sha, runs)];
if (errs.length) {
  for (const e of errs) console.log(e);
  console.log(`(gate: ${gateText})`);
  process.exit(1);
}
console.log(`ci ok: đầu nhánh ${sha} quick, e2e, e2e-db xanh (gate: ${gateText})`);
