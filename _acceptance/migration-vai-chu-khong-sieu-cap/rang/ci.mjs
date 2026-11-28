#!/usr/bin/env node
// CI thật của PR #135 (hồ sơ migration-vai-chu-khong-sieu-cap, AC-7), đọc qua gh, chỉ đọc.
//   Lượt CI mới nhất trên đầu nhánh (HEAD) đã xong, và các việc quick, check, e2e, e2e-db xanh. Việc e2e-db phải có
//   một lượt CHẠY THẬT của chính mã này: hoặc nó chạy thật ở đầu nhánh, hoặc nó dùng lại kết quả của lượt cùng đầu vào
//   («not run again: same inputs as run <id> at commit <sha>») — khi ấy lượt được dùng lại phải xanh, chạy thật, ở một
//   commit chứa commit mã của PR và có cùng mã với đầu nhánh (ngoài hồ sơ _acceptance/ và hai trang máy vẽ). Lượt chạy
//   thật phải có «ci-db: 6/6 bước đạt», nhắc tệp chu-khong-sieu-cap.db.test.ts, và dịch vụ Postgres là postgres:16.
//
//   Vòng 1 đo trên lượt của đúng commit mã; lượt ấy bị CI huỷ khi nhánh được đẩy tiếp (concurrency), nên phép đo đỏ
//   oan. Từ vòng 2 phép đo theo lượt chạy thật mà đầu nhánh dựa vào.
//
//   node _acceptance/migration-vai-chu-khong-sieu-cap/rang/ci.mjs [--cho <phút>]
//   node _acceptance/migration-vai-chu-khong-sieu-cap/rang/ci.mjs --tu-kiem [--cho <phút>]  # dữ liệu thật xanh, bốn bản phá đỏ
//   --cho: chờ tối đa bấy nhiêu phút cho lượt trên đầu nhánh xong (lượt chấm bắt đầu ngay sau khi đẩy).
import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const sh = (cmd, args) => execFileSync(cmd, args, { cwd: ROOT, encoding: "utf8", maxBuffer: 256 * 1024 * 1024 });
const gh = (...a) => sh("gh", a);
const i = process.argv.indexOf("--cho");
const waitMin = i > 0 ? Number(process.argv[i + 1]) : 0;
const tuKiem = process.argv.includes("--tu-kiem");
const EXCL = [":(exclude)_acceptance", ":(exclude)PRODUCT-MAP.md", ":(exclude)LO-TRINH.html"];
const REUSE = /not run again: same inputs as run (\d+) at commit ([0-9a-f]{7,40})/;
const JOBS = ["quick", "check", "e2e", "e2e-db"];

const head = sh("git", ["rev-parse", "HEAD"]).trim();
const base = sh("git", ["merge-base", "origin/main", "HEAD"]).trim();
const code = sh("git", ["log", "--format=%H", `${base}..HEAD`, "--", ".", ...EXCL]).split("\n").filter(Boolean)[0];

function latestRun(sha, wait) {
  const deadline = Date.now() + wait * 60_000;
  for (;;) {
    const runs = JSON.parse(gh("run", "list", "--workflow", "ci.yml", "--commit", sha, "--limit", "5", "--json", "databaseId,status,conclusion,createdAt"));
    const r = runs.sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
    if (r && r.status === "completed") return r;
    if (Date.now() > deadline) return { missing: r ? `chưa xong (${r.status})` : "chưa có" };
    execFileSync("sleep", ["20"]);
  }
}
const jobsOf = (id) => JSON.parse(gh("run", "view", String(id), "--json", "jobs,headSha")).jobs;
const logOf = (runId, jobId) => gh("run", "view", String(runId), "--log", "--job", String(jobId));
const sameCode = (a, b) => {
  try {
    execFileSync("git", ["diff", "--quiet", a, b, "--", ".", ...EXCL], { cwd: ROOT });
    return true;
  } catch {
    return false;
  }
};
const contains = (anc, desc) => {
  try {
    execFileSync("git", ["merge-base", "--is-ancestor", anc, desc], { cwd: ROOT });
    return true;
  } catch {
    return false;
  }
};

/** Everything the verdict needs, read from GitHub and git once. */
function gather() {
  const d = { head, code, run: latestRun(head, waitMin) };
  if (d.run.missing) return d;
  d.jobs = jobsOf(d.run.databaseId).map((j) => ({ name: j.name, conclusion: j.conclusion, id: j.databaseId }));
  const db = d.jobs.find((j) => j.name === "e2e-db");
  d.headLog = db ? logOf(d.run.databaseId, db.id) : "";
  const m = REUSE.exec(d.headLog);
  if (m) {
    d.reuse = { run: m[1], commit: m[2] };
    const fullSha = sh("git", ["rev-parse", m[2]]).trim();
    d.reuse.fullSha = fullSha;
    const sj = jobsOf(m[1]).find((j) => j.name === "e2e-db");
    d.reuse.conclusion = sj?.conclusion ?? null;
    d.reuse.log = sj ? logOf(m[1], sj.databaseId) : "";
    d.reuse.containsCode = contains(code, fullSha);
    d.reuse.sameCode = sameCode(fullSha, head);
  }
  return d;
}

/** Pure verdict over gathered data → { errs, line }. */
export function verdict(d) {
  const errs = [];
  if (!d.code) return { errs: ["nhánh không có commit mã nào sau điểm rẽ"] };
  if (d.run.missing) return { errs: [`lượt CI trên đầu nhánh ${d.head.slice(0, 8)} ${d.run.missing}`] };
  for (const n of JOBS) {
    const j = d.jobs.find((x) => x.name === n);
    if (!j || j.conclusion !== "success") errs.push(`${n} trên đầu nhánh ${d.head.slice(0, 8)} không xanh (${j?.conclusion ?? "không có"})`);
  }
  let realLog = d.headLog;
  let where = `chạy thật ở đầu nhánh, run ${d.run.databaseId}`;
  if (d.reuse) {
    where = `dùng lại run ${d.reuse.run} ở ${d.reuse.commit.slice(0, 8)}`;
    if (d.reuse.conclusion !== "success") errs.push(`lượt e2e-db được dùng lại (run ${d.reuse.run}) không xanh (${d.reuse.conclusion})`);
    if (!d.reuse.containsCode) errs.push(`lượt e2e-db được dùng lại ở ${d.reuse.commit.slice(0, 8)} không chứa commit mã ${d.code.slice(0, 8)}`);
    if (!d.reuse.sameCode) errs.push(`lượt e2e-db được dùng lại ở ${d.reuse.commit.slice(0, 8)} có mã khác đầu nhánh`);
    if (REUSE.test(d.reuse.log)) errs.push(`lượt e2e-db được dùng lại (run ${d.reuse.run}) cũng không chạy thật`);
    realLog = d.reuse.log;
  }
  if (!realLog.includes("ci-db: 6/6 bước đạt")) errs.push("nhật ký e2e-db chạy thật thiếu «ci-db: 6/6 bước đạt»");
  if (!realLog.includes("chu-khong-sieu-cap.db.test.ts")) errs.push("nhật ký e2e-db chạy thật không nhắc tệp chu-khong-sieu-cap.db.test.ts");
  if (!/postgres:16/.test(realLog)) errs.push("nhật ký e2e-db chạy thật không cho thấy dịch vụ postgres:16");
  return {
    errs,
    line: `ci ok: đầu nhánh ${d.head.slice(0, 8)} run ${d.run.databaseId} quick, check, e2e, e2e-db xanh · e2e-db ${where} trên postgres:16, 6/6 bước, có bài chu-khong-sieu-cap`,
  };
}

const d = gather();
if (tuKiem) {
  // Fixtures are the real data just read, each broken in one place.
  const clone = () => JSON.parse(JSON.stringify(d));
  const cases = [["vat-lanh", clone(), null]];
  let c = clone();
  c.jobs = c.jobs.map((j) => (j.name === "e2e-db" ? { ...j, conclusion: "cancelled" } : j));
  cases.push(["pha-e2e-db-bi-huy", c, `e2e-db trên đầu nhánh ${head.slice(0, 8)} không xanh (cancelled)`]);
  c = clone();
  if (c.reuse) c.reuse.sameCode = false;
  else c.reuse = { run: "1", commit: "deadbeef", fullSha: "deadbeef", conclusion: "success", log: c.headLog, containsCode: true, sameCode: false };
  cases.push(["pha-dung-lai-ma-khac", c, `lượt e2e-db được dùng lại ở ${c.reuse.commit.slice(0, 8)} có mã khác đầu nhánh`]);
  c = clone();
  if (c.reuse) c.reuse.log = c.reuse.log.replaceAll("ci-db: 6/6 bước đạt", "ci-db: 5/6 bước đạt");
  else c.headLog = c.headLog.replaceAll("ci-db: 6/6 bước đạt", "ci-db: 5/6 bước đạt");
  cases.push(["pha-thieu-6-6", c, "nhật ký e2e-db chạy thật thiếu «ci-db: 6/6 bước đạt»"]);
  c = clone();
  c.run = { missing: "chưa xong (in_progress)" };
  cases.push(["pha-chua-xong", c, `lượt CI trên đầu nhánh ${head.slice(0, 8)} chưa xong (in_progress)`]);
  let good = 0;
  for (const [name, data, pinned] of cases) {
    const { errs } = verdict(data);
    const ok = pinned === null ? errs.length === 0 : errs.includes(pinned);
    console.log(`${ok ? "ok" : "DO"} ${name} — ${errs[0] ?? "xanh"}`);
    if (ok) good++;
  }
  console.log(`tu-kiem: ${good}/${cases.length} ca đúng`);
  process.exit(good === cases.length ? 0 : 1);
}
const { errs, line } = verdict(d);
if (errs.length) {
  for (const e of errs) console.log(`ci: ${e}`);
  process.exit(1);
}
console.log(line);
