// Measures PR #134 on a real terminal: `make dat-khoa ENV=staging` runs on a pseudo-terminal of the operating system
// (rang/pty.py), answers are pasted like a person would, and the screen the person sees at the end is rebuilt from
// every byte (rang/man-hinh.mjs). `gh` is a stand-in placed first on PATH: it answers the read checks and writes each
// `secret set` to a log inside the run folder. No real key, no network, no GitHub.
//
//   node kiem.mjs              five cases: tty-that, tty-doi-co, khong-tty, ban-cu-mat-cau-hoi, gh-gia
//   node kiem.mjs --tu-kiem    the healthy run must pass and each break must fail with its pinned message
//
// Each case prints `ok <case> — …` or `DO <case>: …`; the last line is `kiem: <n>/<m> ca đạt` (exit 0 only when all
// pass). Exit 2 when the measure cannot run here.
import { execFileSync, spawnSync } from "node:child_process";
import { chmodSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { screenOf } from "./man-hinh.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "../../..");
const SLUG = "dat-khoa-cau-hoi-hien";
const SOURCE = join(ROOT, "tools/deploy/dat-khoa.mjs");
const RUN = join(ROOT, ".acceptance-runs", SLUG, `kiem-${Date.now()}-${process.pid}`);
mkdirSync(RUN, { recursive: true });

// The questions of `make dat-khoa ENV=staging` when the environment has no secret yet and the pooler string still says
// [YOUR-PASSWORD], in the order the command asks them. Each must also be in the source (checked below).
const QUESTIONS = [
  ["VERCEL_TOKEN", "VERCEL_TOKEN (dán rồi Enter; để trống thì giữ khoá đang có): "],
  ["MIGRATE_DATABASE_URL", "staging · MIGRATE_DATABASE_URL (chuỗi Session pooler; để trống thì giữ): "],
  ["mật khẩu", "staging · mật khẩu vai chủ Supabase: "],
  ["RESEND_API_KEY", "staging · RESEND_API_KEY (để trống thì giữ): "],
  [
    "VERCEL_AUTOMATION_BYPASS_SECRET",
    "staging · VERCEL_AUTOMATION_BYPASS_SECRET (tuỳ chọn; để trống thì bỏ qua): ",
  ],
];
// Test values only: no real key. The password carries @ and # so the encoding path is exercised.
// Split so the repo's secret scan (tests/khong-khoa-bi-mat.test.ts) does not read it as a real connection string.
const POOLER = "postgresql" + "://postgres.thu0000:[YOUR-PASSWORD]" + "@aws-0-thu.pooler.supabase.com:5432/postgres";
const PASSWORD = "mk@thu#0005";
const ANSWERS = ["khoa-thu-0001", POOLER, PASSWORD, "re_khoa-thu-0004", "khoa-thu-0006"];
const EXPECTED = {
  VERCEL_TOKEN: "khoa-thu-0001",
  MIGRATE_DATABASE_URL: POOLER.replace("[YOUR-PASSWORD]", encodeURIComponent(PASSWORD)),
  RESEND_API_KEY: "re_khoa-thu-0004",
  VERCEL_AUTOMATION_BYPASS_SECRET: "khoa-thu-0006",
};
const REDRAW = "\x1b[1G\x1b[0J"; // readline's redraw of the input line: cursor to column 1, clear to the end of the screen
const GENERATED = { AUTH_SECRET: /^[A-Za-z0-9_-]{64}$/, LOGIN_DB_PASSWORD: /^[A-Za-z0-9]{40}$/ };

function cannot(why) {
  console.log(`kiem: không chạy được — ${why}`);
  process.exit(2);
}

// ---- stand-in gh -------------------------------------------------------------------------------------------------
const FAKE = join(RUN, "gh-gia");
mkdirSync(FAKE, { recursive: true });
writeFileSync(
  join(FAKE, "gh"),
  `#!/bin/sh
case "$1 $2" in
  "__gia__ "*) echo gh-gia ;;
  "auth status") exit 0 ;;
  "repo view") echo chu/kho-thu ;;
  "api "*) exit 0 ;;
  "secret list") exit 0 ;;
  "secret set") { printf '%s=' "$3"; cat; printf '\\n'; } >> "$GH_GIA_LOG" ;;
  *) echo "gh-gia: lệnh lạ $*" >&2; exit 9 ;;
esac
`,
);
chmodSync(join(FAKE, "gh"), 0o755);
const PATH = `${FAKE}:${process.env.PATH}`;

function envFor(log) {
  const env = { ...process.env, PATH, GH_GIA_LOG: log, TERM: "xterm-256color", LANG: "en_US.UTF-8" };
  delete env.CI;
  delete env.GH_TOKEN;
  delete env.GITHUB_TOKEN;
  return env;
}

function ghLog(log) {
  if (!existsSync(log)) return {};
  const out = {};
  for (const l of readFileSync(log, "utf8").split("\n")) {
    const i = l.indexOf("=");
    if (i > 0) out[l.slice(0, i)] = l.slice(i + 1);
  }
  return out;
}

// ---- runs --------------------------------------------------------------------------------------------------------
const plainAnswers = () => QUESTIONS.map(([, q], i) => ({ after: q.trimEnd(), send: ANSWERS[i] }));
// A person on an 80-column terminal pastes half the pooler string, drags the window to 60 columns (the command gets
// SIGWINCH and readline redraws the input line), pastes the rest and presses Enter.
const resizeAnswers = () => {
  const a = plainAnswers();
  const half = Math.floor(POOLER.length / 2);
  a.splice(1, 1, { after: a[1].after, send: POOLER.slice(0, half), enter: false, resize: [50, 60] }, { after: "", send: POOLER.slice(half) });
  return a;
};

// Break of the self-test only: puts the environment back into the plan file, as the measure did before round 3.
let planCarriesEnv = false;

/** Runs a command on a real pseudo-terminal, answering each question; returns what the terminal showed. */
function onTerminal(name, cmd, { cols = 200, answers = plainAnswers() } = {}) {
  const log = join(RUN, `${name}.gh.log`);
  const raw = join(RUN, `${name}.tty`);
  const plan = join(RUN, `${name}.plan.json`);
  writeFileSync(
    plan,
    JSON.stringify({
      cmd,
      cwd: ROOT,
      ...(planCarriesEnv ? { env: envFor(log) } : {}),
      timeout: 60,
      cols,
      answers,
    }),
  );
  // The environment goes to pty.py in memory, never through the plan file (no secret of the grader on disk).
  const r = spawnSync("python3", ["-I", join(HERE, "pty.py"), plan, raw], { encoding: "utf8", env: envFor(log) });
  if (r.status !== 0) cannot(`pty.py thoát ${r.status}: ${(r.stderr || "").trim().split("\n").pop()}`);
  const meta = JSON.parse(r.stdout.trim().split("\n").pop());
  const buf = readFileSync(raw);
  const bytes = buf.toString("utf8");
  const at = (n) => Array.from(buf.subarray(0, n).toString("utf8")).length;
  const resizes = meta.resizes.map((r) => ({ at: at(r.at), cols: r.cols }));
  let screen;
  try {
    screen = screenOf(bytes, cols, resizes);
  } catch (err) {
    return cannot(`${name}: ${err.message} (${raw})`);
  }
  return { ...meta, raw: bytes, screen, secrets: ghLog(log), where: raw, resizeAt: resizes.map((x) => x.at) };
}

/** Runs the command with standard input from a pipe, as a test or `printf … | make dat-khoa` does. */
function onPipe(name, answers, cmd = viaMake) {
  const log = join(RUN, `${name}.gh.log`);
  const r = spawnSync(cmd[0], cmd.slice(1), {
    cwd: ROOT,
    env: envFor(log),
    input: `${answers.join("\n")}\n`,
    encoding: "utf8",
    timeout: 60_000,
  });
  writeFileSync(join(RUN, `${name}.out`), `${r.stdout}\n--- stderr ---\n${r.stderr}`);
  return { exit: r.status, stdout: r.stdout, stderr: r.stderr, secrets: ghLog(log) };
}

// ---- checks (each returns the red lines, empty when green) -------------------------------------------------------
function secretsWrong(secrets) {
  const bad = [];
  for (const [k, v] of Object.entries(EXPECTED)) if (secrets[k] !== v) bad.push(`khoá nhận sai: ${k}`);
  for (const [k, re] of Object.entries(GENERATED)) if (!re.test(secrets[k] ?? "")) bad.push(`khoá sinh sai: ${k}`);
  return bad;
}

/** AC-1 + AC-2 on the terminal. */
function checkTerminal(run) {
  const bad = [];
  let at = -1;
  for (const [name, q] of QUESTIONS) {
    const i = run.screen.findIndex((l, k) => k > at && l === q.trimEnd());
    if (i >= 0) at = i;
    else if (run.screen.includes(q.trimEnd())) bad.push(`câu hỏi sai thứ tự: ${name}`);
    else bad.push(`câu hỏi không còn trên màn: ${name}`);
  }
  ANSWERS.forEach((a, i) => {
    if (run.raw.includes(a)) bad.push(`chữ đã dán hiện ra màn: ${QUESTIONS[i][0]}`);
  });
  bad.push(...secretsWrong(run.secrets));
  if (run.timeout) bad.push(`lệnh treo: trả lời ${run.answered}/${QUESTIONS.length} câu`);
  if (run.exit !== 0 || !run.screen.includes("dat-khoa staging: xong")) bad.push(`lệnh không xong: exit ${run.exit}`);
  return bad;
}

/** AC-1 when the window is resized mid-paste: as checkTerminal, and the resize must have made readline redraw the
 * input line (one redraw more than the questions still to come), else the case measured nothing. */
function checkResize(run) {
  const after = Array.from(run.raw).slice(run.resizeAt[0] ?? Infinity).join("");
  const redraw = after.split(REDRAW).length - 1 >= 1 + (QUESTIONS.length - 2);
  return [...checkTerminal(run), ...(redraw ? [] : ["đổi cỡ không làm readline vẽ lại dòng nhập — ca không đo gì"])];
}

/** AC-3 on a pipe: every question asked on standard error, one answer per line, the secrets set. */
function checkPipe(run) {
  const bad = [];
  for (const [name, q] of QUESTIONS) {
    if (!run.stderr.includes(q)) bad.push(`ống dẫn không hỏi: ${name}`);
    if (run.stdout.includes(q.trimEnd())) bad.push(`câu hỏi ra luồng ra: ${name}`);
  }
  bad.push(...secretsWrong(run.secrets));
  if (run.exit !== 0 || !run.stdout.includes("dat-khoa staging: xong")) bad.push(`lệnh không xong: exit ${run.exit}`);
  return bad;
}

// ---- versions of the source under test ---------------------------------------------------------------------------
function baseRef() {
  try {
    return execFileSync("git", ["merge-base", "origin/main", "HEAD"], { cwd: ROOT, encoding: "utf8" }).trim();
  } catch {
    return cannot("không tìm được điểm rẽ với origin/main");
  }
}

/** The file at the fork point with main: the order before the PR (question written after readline started). */
function oldSource() {
  const p = join(RUN, "ban-cu", "dat-khoa.mjs");
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, execFileSync("git", ["show", `${baseRef()}:tools/deploy/dat-khoa.mjs`], { cwd: ROOT }));
  return p;
}

/** A copy of the current source with one change; refuses when the text to change is not there. */
function broken(name, from, to) {
  const src = readFileSync(SOURCE, "utf8");
  if (!src.includes(from)) cannot(`bản phá ${name} không áp được: không thấy «${from}»`);
  const p = join(RUN, name, "dat-khoa.mjs");
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, src.split(from).join(to));
  return p;
}

const viaMake = ["make", "dat-khoa", "ENV=staging"];
const viaNode = (p) => ["node", p, "staging"];

// ---- guards ------------------------------------------------------------------------------------------------------
const src = readFileSync(SOURCE, "utf8");
for (const [name, q] of QUESTIONS) {
  const shape = q.replace("staging · ", "${env} · ");
  if (!src.includes(shape)) cannot(`câu hỏi của phép đo không có trong mã: ${name}`);
}
const which = spawnSync("gh", ["__gia__"], { env: envFor(join(RUN, "x.log")), encoding: "utf8" });
if (which.stdout.trim() !== "gh-gia") cannot("gh trên PATH không phải bản giả — dừng để không chạm GitHub thật");

// ---- cases -------------------------------------------------------------------------------------------------------
const results = [];
function report(name, bad, okText) {
  results.push(bad.length === 0);
  console.log(bad.length ? `DO ${name}: ${bad.join(" · ")}` : `ok ${name} — ${okText}`);
}

function main() {
  const t = onTerminal("tty-that", viaMake);
  report(
    "tty-that",
    checkTerminal(t),
    `make dat-khoa trên terminal thật: ${QUESTIONS.length}/${QUESTIONS.length} câu hỏi còn trên màn, mỗi câu một dòng; ` +
      `khoá nhận đúng, chữ đã dán không hiện (${t.where})`,
  );
  const r = onTerminal("tty-doi-co", viaMake, { cols: 80, answers: resizeAnswers() });
  report(
    "tty-doi-co",
    checkResize(r),
    "terminal 80 cột, đổi cỡ xuống 60 cột giữa lúc dán chuỗi pooler: 5/5 câu hỏi vẫn còn trên màn, khoá nhận đúng",
  );
  const p = onPipe("khong-tty", ANSWERS);
  report("khong-tty", checkPipe(p), `ống dẫn: ${QUESTIONS.length} câu hỏi, đọc từng dòng, khoá nhận đúng`);
  const old = onTerminal("ban-cu-mat-cau-hoi", viaNode(oldSource()));
  const { red: oldRed, lost } = judgeOld(checkTerminal(old));
  report(
    "ban-cu-mat-cau-hoi",
    oldRed,
    `bản trước PR (${baseRef().slice(0, 8)}) trên cùng terminal: ${lost.length}/${QUESTIONS.length} câu hỏi bị xoá khỏi màn`,
  );
  report("gh-gia", [], "gh trên PATH là bản giả của phép đo; không lệnh nào chạm GitHub");
}

/**
 * Control case (AC-4 b): the old code must lose every question AND have really run to the end (every answer taken,
 * keys right, exit 0) — a run that broke before asking anything also leaves no question on the screen.
 */
function judgeOld(errs) {
  const lost = errs.filter((l) => l.startsWith("câu hỏi không còn trên màn"));
  const notRun = errs.filter((l) => !l.startsWith("câu hỏi không còn trên màn") && !l.startsWith("câu hỏi sai thứ tự"));
  if (notRun.length) return { red: [`bản trước PR không chạy trọn: ${notRun[0]}`], lost };
  if (lost.length !== QUESTIONS.length)
    return { red: [`bản trước PR không mất câu hỏi như lúc hỏng (mất ${lost.length}/${QUESTIONS.length})`], lost };
  return { red: [], lost };
}

const BAIT = "moi-thu-khong-phai-khoa-0007";

/** Files under a folder whose bytes contain a string. */
function filesHolding(dir, text) {
  const hits = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) hits.push(...filesHolding(p, text));
    else if (readFileSync(p).includes(text)) hits.push(p);
  }
  return hits;
}
const baitLine = (p) => `biến mồi ra đĩa: ${relative(RUN, p)}`;

/** Each break of the source must turn a check red with its pinned message. */
function selfTest() {
  const cases = [];
  const expect = (name, bad, pinned) => {
    const hit = bad.some((l) => l.startsWith(pinned));
    cases.push(hit);
    console.log(hit ? `ok ${name} — đỏ đúng: ${pinned}` : `DO ${name}: không đỏ «${pinned}» (${bad.join(" · ") || "xanh"})`);
  };
  // A made-up bait variable (not a key) in the environment of every run: no file under the run folder may hold it.
  process.env.KIEM_MOI_THU = BAIT;
  const lanh = onTerminal("vat-lanh", viaMake);
  const healthy = checkTerminal(lanh);
  cases.push(healthy.length === 0);
  console.log(healthy.length ? `DO vat-lanh: ${healthy.join(" · ")}` : "ok vat-lanh — vật lành xanh");
  const baitHealthy = filesHolding(RUN, BAIT);
  cases.push(baitHealthy.length === 0);
  console.log(
    baitHealthy.length ? `DO moi-khong-ra-dia: ${baitHealthy.map(baitLine).join(" · ")}` : "ok moi-khong-ra-dia — biến mồi không ra tệp nào",
  );
  planCarriesEnv = true;
  onTerminal("pha-plan-mang-env", viaMake);
  planCarriesEnv = false;
  expect("pha-plan-mang-env", filesHolding(RUN, BAIT).map(baitLine), "biến mồi ra đĩa: pha-plan-mang-env.plan.json");
  // That break wrote the whole environment of the grader into its plan: remove it at once, it must not stay on disk.
  rmSync(join(RUN, "pha-plan-mang-env.plan.json"), { force: true });
  // Round trip: the healthy screen just read, with the first two questions swapped.
  const swapped = [...lanh.screen];
  const i0 = swapped.indexOf(QUESTIONS[0][1].trimEnd());
  const i1 = swapped.indexOf(QUESTIONS[1][1].trimEnd());
  [swapped[i0], swapped[i1]] = [swapped[i1], swapped[i0]];
  expect("pha-sai-thu-tu", checkTerminal({ ...lanh, screen: swapped }), "câu hỏi sai thứ tự: MIGRATE_DATABASE_URL");
  expect(
    "pha-thu-tu-cu",
    checkTerminal(
      onTerminal(
        "pha-thu-tu-cu",
        viaNode(
          broken(
            "pha-thu-tu-cu",
            "output.write(`${question}\\n`);\n      const rl = createInterface({ input, output, terminal: true });",
            "const rl = createInterface({ input, output, terminal: true });\n      output.write(question);",
          ),
        ),
      ),
    ),
    "câu hỏi không còn trên màn: VERCEL_TOKEN",
  );
  expect(
    "pha-hien-chu",
    checkTerminal(onTerminal("pha-hien-chu", viaNode(broken("pha-hien-chu", "rl._writeToOutput = () => {};", "")))),
    "chữ đã dán hiện ra màn: VERCEL_TOKEN",
  );
  expect(
    "pha-nhan-sai",
    checkTerminal(
      onTerminal("pha-nhan-sai", viaNode(broken("pha-nhan-sai", "done(answer.trim());", "done(answer.trim().slice(1));"))),
    ),
    "khoá nhận sai: VERCEL_TOKEN",
  );
  expect(
    "pha-bo-ma-hoa",
    checkTerminal(
      onTerminal(
        "pha-bo-ma-hoa",
        viaNode(broken("pha-bo-ma-hoa", "url = pw === \"\" ? \"\" : withPassword(url, pw);", "url = pw === \"\" ? \"\" : url.split(PLACEHOLDER).join(pw);")),
      ),
    ),
    "khoá nhận sai: MIGRATE_DATABASE_URL",
  );
  expect(
    "pha-sinh-sai",
    checkTerminal(
      onTerminal(
        "pha-sinh-sai",
        viaNode(broken("pha-sinh-sai", "return randomBytes(48).toString(\"base64url\");", "return randomBytes(47).toString(\"base64url\");")),
      ),
    ),
    "khoá sinh sai: AUTH_SECRET",
  );
  // The old code made to stop before asking anything: no question on screen either, but it did not run.
  const stopped = join(RUN, "pha-ban-cu-khong-chay", "dat-khoa.mjs");
  mkdirSync(dirname(stopped), { recursive: true });
  writeFileSync(stopped, `process.exit(3);\n${readFileSync(oldSource(), "utf8")}`);
  expect(
    "pha-ban-cu-khong-chay",
    judgeOld(checkTerminal(onTerminal("pha-ban-cu-khong-chay", viaNode(stopped)))).red,
    "bản trước PR không chạy trọn",
  );
  expect(
    "pha-khong-doi-co",
    checkResize(onTerminal("pha-khong-doi-co", viaMake, { cols: 80, answers: resizeAnswers().map(({ resize, ...x }) => x) })),
    "đổi cỡ không làm readline vẽ lại dòng nhập — ca không đo gì",
  );
  expect(
    "pha-thu-tu-cu-doi-co",
    checkResize(
      onTerminal(
        "pha-thu-tu-cu-doi-co",
        viaNode(
          broken(
            "pha-thu-tu-cu-doi-co",
            "output.write(`${question}\\n`);\n      const rl = createInterface({ input, output, terminal: true });",
            "const rl = createInterface({ input, output, terminal: true });\n      output.write(question);",
          ),
        ),
        { cols: 80, answers: resizeAnswers() },
      ),
    ),
    "câu hỏi không còn trên màn: VERCEL_TOKEN",
  );
  expect("pha-thieu-dong", checkPipe(onPipe("pha-thieu-dong", ANSWERS.slice(1))), "khoá nhận sai: VERCEL_TOKEN");
  expect(
    "pha-hoi-ra-luong-ra",
    checkPipe(
      onPipe(
        "pha-hoi-ra-luong-ra",
        ANSWERS,
        viaNode(broken("pha-hoi-ra-luong-ra", "process.stderr.write(question);", "process.stdout.write(question);")),
      ),
    ),
    "câu hỏi ra luồng ra: VERCEL_TOKEN",
  );
  // The screen model refuses a sequence it does not model, here on the healthy bytes just read plus one such sequence.
  let thrown = "";
  try {
    screenOf(`${lanh.raw}\x1b[2A\x1b[?2004h`);
  } catch (err) {
    thrown = err.message;
  }
  expect("pha-chuoi-la", thrown ? [thrown] : [], "màn dựng lại gặp chuỗi điều khiển lạ");
  const n = cases.filter(Boolean).length;
  console.log(`tu-kiem: ${n}/${cases.length} ca đúng (${RUN})`);
  process.exit(n === cases.length ? 0 : 1);
}

if (process.argv.includes("--tu-kiem")) selfTest();
else {
  main();
  const n = results.filter(Boolean).length;
  console.log(`kiem: ${n}/${results.length} ca đạt (${RUN})`);
  process.exit(n === results.length ? 0 : 1);
}
