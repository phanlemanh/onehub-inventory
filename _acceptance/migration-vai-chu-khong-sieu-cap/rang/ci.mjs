#!/usr/bin/env node
// CI thật của PR #135 (hồ sơ migration-vai-chu-khong-sieu-cap, AC-7), đọc qua gh, chỉ đọc.
//   1. Commit mã: commit gần nhất của nhánh có đổi tệp ngoài _acceptance/ và hai trang máy vẽ. Lượt CI mới nhất trên nó
//      có việc e2e-db xanh và chạy thật (không dùng lại kết quả cũ): nhật ký có «ci-db: 6/6 bước đạt», có tên tệp
//      chu-khong-sieu-cap.db.test.ts, và dịch vụ Postgres là postgres:16.
//   2. Đầu nhánh (HEAD): lượt CI mới nhất trên nó có quick, e2e và e2e-db xanh (e2e-db được phép dùng lại kết quả
//      của lượt cùng đầu vào).
//
//   node _acceptance/migration-vai-chu-khong-sieu-cap/rang/ci.mjs [--cho <phút>]
//   --cho: chờ tối đa bấy nhiêu phút cho các lượt ấy xong (lượt chấm bắt đầu ngay sau khi đẩy).
import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const sh = (cmd, args) => execFileSync(cmd, args, { cwd: ROOT, encoding: "utf8", maxBuffer: 256 * 1024 * 1024 });
const gh = (...a) => sh("gh", a);
const fail = (m) => {
  console.log(`ci: ${m}`);
  process.exit(1);
};
const i = process.argv.indexOf("--cho");
const waitMin = i > 0 ? Number(process.argv[i + 1]) : 0;

const head = sh("git", ["rev-parse", "HEAD"]).trim();
const base = sh("git", ["merge-base", "origin/main", "HEAD"]).trim();
const code = sh("git", ["log", "--format=%H", `${base}..HEAD`, "--", ".", ":(exclude)_acceptance", ":(exclude)PRODUCT-MAP.md", ":(exclude)LO-TRINH.html"])
  .split("\n")
  .filter(Boolean)[0];
if (!code) fail("nhánh không có commit mã nào sau điểm rẽ");

function latestRun(sha) {
  const deadline = Date.now() + waitMin * 60_000;
  for (;;) {
    const runs = JSON.parse(gh("run", "list", "--workflow", "ci.yml", "--commit", sha, "--limit", "5", "--json", "databaseId,status,conclusion,createdAt"));
    const r = runs.sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
    if (r && r.status === "completed") return r;
    if (Date.now() > deadline) fail(`lượt CI trên ${sha.slice(0, 8)} ${r ? `chưa xong (${r.status})` : "chưa có"}`);
    execFileSync("sleep", ["20"]);
  }
}
function jobs(run) {
  return JSON.parse(gh("run", "view", String(run.databaseId), "--json", "jobs")).jobs;
}
const job = (js, name) => js.find((j) => j.name === name);

// 1. the code commit
const r1 = latestRun(code);
const j1 = jobs(r1);
const db1 = job(j1, "e2e-db");
if (!db1 || db1.conclusion !== "success") fail(`e2e-db trên commit mã ${code.slice(0, 8)} không xanh (${db1?.conclusion ?? "không có"})`);
const log = gh("run", "view", String(r1.databaseId), "--log", "--job", String(db1.databaseId));
if (/not run again: same inputs/.test(log)) fail(`e2e-db trên commit mã ${code.slice(0, 8)} dùng lại kết quả cũ, không chạy thật`);
if (!log.includes("ci-db: 6/6 bước đạt")) fail("nhật ký e2e-db thiếu «ci-db: 6/6 bước đạt»");
if (!log.includes("chu-khong-sieu-cap.db.test.ts")) fail("nhật ký e2e-db không nhắc tệp chu-khong-sieu-cap.db.test.ts");
if (!/postgres:16/.test(log)) fail("nhật ký e2e-db không cho thấy dịch vụ postgres:16");

// 2. the branch head
const r2 = head === code ? r1 : latestRun(head);
const j2 = head === code ? j1 : jobs(r2);
for (const n of ["quick", "e2e", "e2e-db"]) {
  const j = job(j2, n);
  if (!j || j.conclusion !== "success") fail(`${n} trên đầu nhánh ${head.slice(0, 8)} không xanh (${j?.conclusion ?? "không có"})`);
}
console.log(
  `ci ok: commit mã ${code.slice(0, 8)} run ${r1.databaseId} e2e-db chạy thật trên postgres:16, 6/6 bước · đầu nhánh ${head.slice(0, 8)} run ${r2.databaseId} quick, e2e, e2e-db xanh`,
);
