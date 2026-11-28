#!/usr/bin/env node
// CI thật của PR #135 (hồ sơ migration-vai-chu-khong-sieu-cap, AC-7), đọc qua gh, chỉ đọc.
//   Lượt CI mới nhất trên đầu nhánh (HEAD) đã xong, và các việc quick, check, e2e, e2e-db xanh. Việc e2e-db phải có
//   một lượt CHẠY THẬT của chính mã này: hoặc nó chạy thật ở đầu nhánh, hoặc nó dùng lại kết quả của lượt cùng đầu vào
//   («not run again: same inputs as run <id> at commit <sha>») — khi ấy lượt được dùng lại phải xanh, chạy thật, ở một
//   commit chứa commit mã của PR và có cùng mã với đầu nhánh (ngoài hồ sơ _acceptance/ và hai trang máy vẽ). Lượt chạy
//   thật phải có «ci-db: 6/6 bước đạt», nhắc tệp chu-khong-sieu-cap.db.test.ts, và dịch vụ Postgres là postgres:16.
//
//   Vòng 1 đo trên lượt của đúng commit mã; lượt ấy bị CI huỷ khi nhánh được đẩy tiếp (concurrency), nên phép đo đỏ
//   oan. Từ vòng 2 phép đo theo lượt chạy thật mà đầu nhánh dựa vào; vòng 3 đọc đúng dạng đường dẫn CI in ra.
//
//   node _acceptance/migration-vai-chu-khong-sieu-cap/rang/ci.mjs [--cho <phút>]
//   node _acceptance/migration-vai-chu-khong-sieu-cap/rang/ci.mjs --tu-kiem [--cho <phút>]  # dữ liệu thật xanh, mỗi dòng đỏ một bản phá
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
// CI prints the reused run as a URL (ci.yml: RUN_URL in .heavy-ok), e.g. «… same inputs as run
// https://github.com/<repo>/actions/runs/46094416213 at commit 04e322d7….» — round 2 waited for a bare number.
// A bare run number («… as run 46094416213 at commit …») is read too, should ci.yml ever print the id alone.
export const REUSE = /not run again: same inputs as run (?:https?:\/\/\S*\/actions\/runs\/)?(\d+) at commit ([0-9a-f]{7,40})/;
export const parseReuse = (log) => {
  const m = REUSE.exec(log);
  return m ? { run: m[1], commit: m[2] } : null;
};
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
  const m = parseReuse(d.headLog);
  if (m) {
    d.reuse = { run: m.run, commit: m.commit };
    const fullSha = sh("git", ["rev-parse", m.commit]).trim();
    d.reuse.fullSha = fullSha;
    const view = JSON.parse(gh("run", "view", m.run, "--json", "jobs,headSha"));
    d.reuse.runSha = view.headSha;
    const sj = view.jobs.find((j) => j.name === "e2e-db");
    d.reuse.conclusion = sj?.conclusion ?? null;
    d.reuse.log = sj ? logOf(m.run, sj.databaseId) : "";
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
    if (d.reuse.runSha !== d.reuse.fullSha) errs.push(`lượt e2e-db được dùng lại (run ${d.reuse.run}) không chạy ở commit ${d.reuse.commit.slice(0, 8)}`);
    if (d.reuse.conclusion !== "success") errs.push(`lượt e2e-db được dùng lại (run ${d.reuse.run}) không xanh (${d.reuse.conclusion})`);
    if (!d.reuse.containsCode) errs.push(`lượt e2e-db được dùng lại ở ${d.reuse.commit.slice(0, 8)} không chứa commit mã ${d.code.slice(0, 8)}`);
    if (!d.reuse.sameCode) errs.push(`lượt e2e-db được dùng lại ở ${d.reuse.commit.slice(0, 8)} có mã khác đầu nhánh`);
    if (parseReuse(d.reuse.log)) errs.push(`lượt e2e-db được dùng lại (run ${d.reuse.run}) cũng không chạy thật`);
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
  if (d.run.missing) {
    // Nothing to break when the head run is not there: say so with the same pinned line as the normal path.
    for (const e of verdict(d).errs) console.log(`ci: ${e}`);
    console.log("tu-kiem: không chạy được — lượt CI trên đầu nhánh chưa có để làm dữ liệu");
    process.exit(1);
  }
  // Fixtures are the real data just read (round trip), each broken in one place. One break per red line of verdict().
  const clone = () => JSON.parse(JSON.stringify(d));
  const real = (c) => (c.reuse ? c.reuse : c);
  const logKey = (c) => (c.reuse ? "log" : "headLog");
  const cases = [["vat-lanh", clone(), null]];
  const add = (name, edit, pinned) => {
    const c = clone();
    edit(c);
    cases.push([name, c, typeof pinned === "function" ? pinned(c) : pinned]);
  };
  const h = head.slice(0, 8);
  add("pha-e2e-db-bi-huy", (c) => (c.jobs = c.jobs.map((j) => (j.name === "e2e-db" ? { ...j, conclusion: "cancelled" } : j))), `e2e-db trên đầu nhánh ${h} không xanh (cancelled)`);
  add("pha-thieu-viec-check", (c) => (c.jobs = c.jobs.filter((j) => j.name !== "check")), `check trên đầu nhánh ${h} không xanh (không có)`);
  add("pha-chua-xong", (c) => (c.run = { missing: "chưa xong (in_progress)" }), `lượt CI trên đầu nhánh ${h} chưa xong (in_progress)`);
  add("pha-thieu-6-6", (c) => (real(c)[logKey(c)] = real(c)[logKey(c)].replaceAll("ci-db: 6/6 bước đạt", "ci-db: 5/6 bước đạt")), "nhật ký e2e-db chạy thật thiếu «ci-db: 6/6 bước đạt»");
  add("pha-thieu-bai-moi", (c) => (real(c)[logKey(c)] = real(c)[logKey(c)].replaceAll("chu-khong-sieu-cap.db.test.ts", "x.db.test.ts")), "nhật ký e2e-db chạy thật không nhắc tệp chu-khong-sieu-cap.db.test.ts");
  add("pha-khong-phai-pg16", (c) => (real(c)[logKey(c)] = real(c)[logKey(c)].replaceAll("postgres:16", "postgres:15")), "nhật ký e2e-db chạy thật không cho thấy dịch vụ postgres:16");
  if (d.reuse) {
    // The reuse line itself, parsed from the head's real log: the parser must find the run and commit CI printed.
    const line = d.headLog.split("\n").find((l) => / not run again: same inputs as run https?:/.test(l)) ?? "";
    const p = parseReuse(line);
    cases.push(["doc-dong-dung-lai-that", { parsed: p }, null]);
    // The same real line with the URL cut to the bare number, and the command line CI echoes before it (which names
    // no run): the first must parse to the same run, the second must not parse.
    const bare = line.replace(/https?:\/\/\S*\/actions\/runs\//, "");
    cases.push(["doc-dong-dung-lai-so-tran", { parsed: parseReuse(bare) }, null]);
    const echoLine = d.headLog.split("\n").find((l) => l.includes("same inputs as run $(sed")) ?? "same inputs as run $(sed -n 1p .heavy-ok) at commit $(sed -n 2p .heavy-ok)";
    cases.push(["khong-doc-dong-lenh-echo", { parsed: parseReuse(echoLine), wantNull: true }, null]);
    add("pha-dung-lai-ma-khac", (c) => (c.reuse.sameCode = false), (c) => `lượt e2e-db được dùng lại ở ${c.reuse.commit.slice(0, 8)} có mã khác đầu nhánh`);
    add("pha-dung-lai-khong-chua-ma", (c) => (c.reuse.containsCode = false), (c) => `lượt e2e-db được dùng lại ở ${c.reuse.commit.slice(0, 8)} không chứa commit mã ${code.slice(0, 8)}`);
    add("pha-dung-lai-do", (c) => (c.reuse.conclusion = "failure"), (c) => `lượt e2e-db được dùng lại (run ${c.reuse.run}) không xanh (failure)`);
    add("pha-dung-lai-sai-commit", (c) => (c.reuse.runSha = "0".repeat(40)), (c) => `lượt e2e-db được dùng lại (run ${c.reuse.run}) không chạy ở commit ${c.reuse.commit.slice(0, 8)}`);
    add("pha-dung-lai-cung-dung-lai", (c) => (c.reuse.log += `\n${line}`), (c) => `lượt e2e-db được dùng lại (run ${c.reuse.run}) cũng không chạy thật`);
  } else console.log("tu-kiem: đầu nhánh chạy e2e-db thật — bỏ năm ca của nhánh dùng lại");
  let good = 0;
  for (const [name, data, pinned] of cases) {
    if (name === "khong-doc-dong-lenh-echo") {
      const ok = data.parsed === null;
      console.log(`${ok ? "ok" : "DO"} ${name} — ${ok ? "dòng lệnh echo không bị đọc thành lượt dùng lại" : "đọc nhầm dòng lệnh echo thành lượt dùng lại"}`);
      if (ok) good++;
      continue;
    }
    if (name === "doc-dong-dung-lai-that" || name === "doc-dong-dung-lai-so-tran") {
      const ok = !!data.parsed && data.parsed.run === d.reuse.run && /^[0-9a-f]{7,40}$/.test(data.parsed.commit);
      console.log(`${ok ? "ok" : "DO"} ${name} — ${ok ? `run ${data.parsed.run} ở ${data.parsed.commit.slice(0, 8)}` : "không tách được dòng dùng lại thật của CI"}`);
      if (ok) good++;
      continue;
    }
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
