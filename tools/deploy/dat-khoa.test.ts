// make dat-khoa (row dat-khoa-mot-lenh, E1–E3) with a fake `gh` first on PATH. The fake records every call — its
// command line and, for `secret set`, its standard input — in gh.jsonl, and keeps the secrets of each environment in
// store-<env>.json so a second run sees what the first one set. Answers go in on standard input, one line each, in the
// order the command asks. The matrix of wrong inputs (E3) is the header of _acceptance/dat-khoa-mot-lenh/evals.yaml.
import { spawn } from "node:child_process";
import { chmodSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { tempDir } from "../../tests/support/temp-dir";
import { FORMAT, generate } from "./dat-khoa.mjs";

const DAT_KHOA = join(resolve(__dirname), "dat-khoa.mjs");
const DEPLOY_MK = resolve(__dirname, "../../mk/deploy.mk");

const FAKE_GH = `#!/usr/bin/env node
const fs = require("fs"), path = require("path");
const dir = process.env.FAKE_DIR, a = process.argv.slice(2);
const has = (n) => fs.existsSync(path.join(dir, n));
const setting = a[0] === "secret" && a[1] === "set";
const input = setting ? fs.readFileSync(0, "utf8") : "";
fs.appendFileSync(path.join(dir, "gh.jsonl"), JSON.stringify({ argv: a, stdin: input }) + "\\n");
const envOf = () => a[a.indexOf("--env") + 1];
const storeFile = (env) => path.join(dir, "store-" + env + ".json");
const store = (env) => (fs.existsSync(storeFile(env)) ? JSON.parse(fs.readFileSync(storeFile(env), "utf8")) : {});
if (a[0] === "auth") process.exit(has("auth-fail") ? 1 : 0);
if (a[0] === "repo") { console.log("chu-kho/kho"); process.exit(0); }
if (a[0] === "api") {
  const m = a[1].match(/environments\\/([^/]+)(\\/secrets\\/public-key)?$/);
  if (m && (has("env-missing-" + m[1]) || (m[2] && has("pubkey-fail-" + m[1])))) { console.error("HTTP 404: Not Found"); process.exit(1); }
  console.log("{}"); process.exit(0);
}
if (a[0] === "secret" && a[1] === "list") { console.log(Object.keys(store(envOf())).join("\\n")); process.exit(0); }
if (setting) {
  const countFile = path.join(dir, "set-count");
  const n = Number(fs.existsSync(countFile) ? fs.readFileSync(countFile, "utf8") : 0) + 1;
  fs.writeFileSync(countFile, String(n));
  if (has("fail-set-" + n)) { console.error("HTTP 500: Internal Server Error"); process.exit(1); }
  const s = store(envOf()); s[a[2]] = input; fs.writeFileSync(storeFile(envOf()), JSON.stringify(s));
  process.exit(0);
}
process.exit(0);
`;

// Pasted values carry markers, so a leak is easy to find; the password has the characters a URL must encode.
const TOKEN = "vcpMocToken0123456789";
const RESEND = "re_MocResend0123456789";
const PW = "Moc@Pass:w/rd#9";
const POOLER = (pw: string) =>
  `postgresql://postgres.abcdefghijklmnopqrst:${pw}@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres`;
const GOOD = [TOKEN, POOLER("[YOUR-PASSWORD]"), PW, RESEND, ""];

interface Call {
  argv: string[];
  stdin: string;
}

interface Run {
  code: number;
  stdout: string;
  stderr: string;
  lines: string[];
  calls: Call[];
  sets: Call[];
}

function fresh(): { fake: string; env: Record<string, string> } {
  const root = tempDir("dat-khoa-");
  const fake = join(root, "fake");
  const bin = join(root, "bin");
  mkdirSync(fake, { recursive: true });
  mkdirSync(bin, { recursive: true });
  writeFileSync(join(bin, "gh"), FAKE_GH);
  chmodSync(join(bin, "gh"), 0o755);
  return {
    fake,
    env: {
      PATH: `${bin}:${process.env["PATH"]}`,
      HOME: process.env["HOME"] ?? root,
      FAKE_DIR: fake,
    },
  };
}

function store(fake: string, env: string): Record<string, string> {
  const f = join(fake, `store-${env}.json`);
  return existsSync(f) ? (JSON.parse(readFileSync(f, "utf8")) as Record<string, string>) : {};
}

function run(
  ctx: { fake: string; env: Record<string, string> },
  args: string[],
  answers: string[],
  cmd = "node",
  cmdArgs = [DAT_KHOA],
): Promise<Run> {
  const log = join(ctx.fake, "gh.jsonl");
  const before = existsSync(log) ? readFileSync(log, "utf8").split("\n").filter(Boolean).length : 0;
  return new Promise((done) => {
    const child = spawn(cmd, [...cmdArgs, ...args], { env: ctx.env });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (b) => (stdout += b));
    child.stderr.on("data", (b) => (stderr += b));
    child.stdin.end(answers.join("\n") + "\n");
    child.on("close", (code) => {
      const calls = (existsSync(log) ? readFileSync(log, "utf8").split("\n").filter(Boolean) : [])
        .slice(before)
        .map((l) => JSON.parse(l) as Call);
      done({
        code: code ?? 1,
        stdout,
        stderr,
        lines: stdout.split("\n").filter(Boolean),
        calls,
        sets: calls.filter((c) => c.argv[0] === "secret" && c.argv[1] === "set"),
      });
    });
  });
}

/** Findings when a secret value sits on a command line. */
function argvLeaks(calls: Call[], values: Record<string, string>): string[] {
  const out: string[] = [];
  for (const [name, value] of Object.entries(values)) {
    if (calls.some((c) => c.argv.some((x) => x.includes(value))))
      out.push(`giá trị nằm trên dòng lệnh: ${name}`);
  }
  return out;
}

/** Findings when a secret value appears in what the command printed. */
function outputLeaks(text: string, values: Record<string, string>): string[] {
  return Object.entries(values)
    .filter(([, value]) => text.includes(value))
    .map(([name]) => `giá trị có trong đầu ra: ${name}`);
}

/** A finding when a generated value does not have its shape. */
function formatFinding(name: keyof typeof FORMAT, value: string): string | null {
  return FORMAT[name].test(value) ? null : `${name} sai khuôn`;
}

const NAMES = [
  "VERCEL_TOKEN",
  "MIGRATE_DATABASE_URL",
  "RESEND_API_KEY",
  "AUTH_SECRET",
  "LOGIN_DB_PASSWORD",
];

describe("E1 · đặt đúng năm khoá, giá trị chỉ qua đầu vào chuẩn", () => {
  it("E1 · staging lần đầu: năm lần secret set, không tên nào khác, không giá trị nào lộ", async () => {
    const ctx = fresh();
    const r = await run(ctx, ["staging"], GOOD);
    expect(r.code, r.stdout + r.stderr).toBe(0);
    expect(r.sets.map((c) => c.argv[2])).toEqual(NAMES);
    for (const c of r.sets)
      expect(c.argv).toEqual([
        "secret",
        "set",
        c.argv[2],
        "--env",
        "staging",
        "--repo",
        "chu-kho/kho",
      ]);
    const s = store(ctx.fake, "staging");
    const values = { ...s, PW };
    expect(argvLeaks(r.calls, values)).toEqual([]);
    expect(outputLeaks(r.stdout + r.stderr, values)).toEqual([]);
    expect(s["VERCEL_TOKEN"]).toBe(TOKEN);
    expect(s["RESEND_API_KEY"]).toBe(RESEND);
    expect(s["MIGRATE_DATABASE_URL"]).not.toContain("[YOUR-PASSWORD]");
    expect(decodeURIComponent(new URL(s["MIGRATE_DATABASE_URL"]!).password)).toBe(PW);
    expect(r.lines).toEqual([
      "dat-khoa staging: đặt VERCEL_TOKEN",
      "dat-khoa staging: đặt MIGRATE_DATABASE_URL",
      "dat-khoa staging: đặt RESEND_API_KEY",
      "dat-khoa staging: sinh AUTH_SECRET",
      "dat-khoa staging: sinh LOGIN_DB_PASSWORD",
      "dat-khoa staging: xong",
    ]);
  });

  it("E1 · all qua make: VERCEL_TOKEN hỏi đúng một lần, cùng giá trị ở hai môi trường", async () => {
    const ctx = fresh();
    const answers = [
      TOKEN,
      POOLER(encodeURIComponent(PW)),
      RESEND,
      "",
      POOLER("[YOUR-PASSWORD]"),
      PW,
      "re_MocResendProd012345",
      "",
    ];
    const r = await run(ctx, [], answers, "make", ["-s", "-f", DEPLOY_MK, "dat-khoa"]);
    expect(r.code, r.stdout + r.stderr).toBe(0);
    expect(r.stderr.split("VERCEL_TOKEN (").length - 1).toBe(1);
    expect(store(ctx.fake, "staging")["VERCEL_TOKEN"]).toBe(TOKEN);
    expect(store(ctx.fake, "production")["VERCEL_TOKEN"]).toBe(TOKEN);
    expect(r.sets).toHaveLength(10);
    expect(r.lines.filter((l) => l.endsWith(": xong"))).toEqual([
      "dat-khoa staging: xong",
      "dat-khoa production: xong",
    ]);
  });

  it("E1 · chiều đỏ: giá trị chép lên dòng lệnh hay vào đầu ra thì hàm đo bắt", async () => {
    const ctx = fresh();
    const r = await run(ctx, ["staging"], GOOD);
    const values = store(ctx.fake, "staging");
    expect(argvLeaks(r.calls, values)).toEqual([]);
    const leaky = r.calls.map((c, i) =>
      i === r.calls.length - 1 ? { ...c, argv: [...c.argv, values["AUTH_SECRET"]!] } : c,
    );
    expect(argvLeaks(leaky, values)).toEqual(["giá trị nằm trên dòng lệnh: AUTH_SECRET"]);
    expect(outputLeaks(`${r.stdout}${TOKEN}`, values)).toEqual([
      "giá trị có trong đầu ra: VERCEL_TOKEN",
    ]);
  });
});

describe("E2 · chạy lại giữ khoá, --xoay chỉ sinh lại hai khoá tự sinh", () => {
  it("E2 · chạy lại bỏ trống mọi câu: không đặt lại khoá nào, mỗi khoá một dòng giữ", async () => {
    const ctx = fresh();
    await run(ctx, ["staging"], GOOD);
    const before = store(ctx.fake, "staging");
    const r = await run(ctx, ["staging"], ["", "", "", ""]);
    expect(r.code, r.stdout + r.stderr).toBe(0);
    expect(r.sets).toHaveLength(0);
    expect(r.lines).toEqual([
      ...NAMES.map((n) => `dat-khoa staging: giữ ${n}`),
      "dat-khoa staging: xong",
    ]);
    expect(store(ctx.fake, "staging")).toEqual(before);
  });

  it("E2 · --xoay: đúng hai lần đặt, AUTH_SECRET và LOGIN_DB_PASSWORD, giá trị mới khác cũ", async () => {
    const ctx = fresh();
    await run(ctx, ["staging"], GOOD);
    const before = store(ctx.fake, "staging");
    const r = await run(ctx, ["staging", "--xoay"], ["", "", "", ""]);
    expect(r.code, r.stdout + r.stderr).toBe(0);
    expect(r.sets.map((c) => c.argv[2])).toEqual(["AUTH_SECRET", "LOGIN_DB_PASSWORD"]);
    const after = store(ctx.fake, "staging");
    expect(after["AUTH_SECRET"]).not.toBe(before["AUTH_SECRET"]);
    expect(after["LOGIN_DB_PASSWORD"]).not.toBe(before["LOGIN_DB_PASSWORD"]);
    expect(after["VERCEL_TOKEN"]).toBe(before["VERCEL_TOKEN"]);
  });

  it("E2 · khoá tự sinh đúng khuôn qua 50 lần sinh", () => {
    for (let i = 0; i < 50; i++) {
      expect(formatFinding("AUTH_SECRET", generate("AUTH_SECRET"))).toBeNull();
      expect(formatFinding("LOGIN_DB_PASSWORD", generate("LOGIN_DB_PASSWORD"))).toBeNull();
    }
  });

  it("E2 · chiều đỏ: giá trị sai khuôn thì hàm kiểm khuôn bắt", () => {
    expect(formatFinding("AUTH_SECRET", generate("AUTH_SECRET").slice(1))).toBe(
      "AUTH_SECRET sai khuôn",
    );
    expect(formatFinding("LOGIN_DB_PASSWORD", `${generate("LOGIN_DB_PASSWORD").slice(1)}@`)).toBe(
      "LOGIN_DB_PASSWORD sai khuôn",
    );
  });
});

interface Cell {
  name: string;
  answers?: string[];
  arrange?: (fake: string) => void;
  line: string;
}

const CELLS: Cell[] = [
  {
    name: "cổng 6543",
    answers: [TOKEN, POOLER(encodeURIComponent(PW)).replace(":5432/", ":6543/"), RESEND, ""],
    line: "MIGRATE_DATABASE_URL: cổng 6543 là Transaction pooler, cần Session pooler cổng 5432",
  },
  {
    name: "không phải postgresql://",
    answers: [TOKEN, "mysql://root:x@h:3306/db", RESEND, ""],
    line: "MIGRATE_DATABASE_URL: không phải chuỗi postgresql://",
  },
  {
    name: "không mật khẩu",
    answers: [
      TOKEN,
      "postgresql://postgres.abcdefghijklmnopqrst@h.example.test:5432/postgres",
      RESEND,
      "",
    ],
    line: "MIGRATE_DATABASE_URL: thiếu mật khẩu",
  },
  {
    name: "người dùng khác postgres",
    answers: [
      TOKEN,
      POOLER(encodeURIComponent(PW)).replace("postgres.abcd", "quy_hang_login.abcd"),
      RESEND,
      "",
    ],
    line: "MIGRATE_DATABASE_URL: người dùng phải là postgres của dự án",
  },
  {
    name: "Resend không bắt đầu re_",
    answers: [TOKEN, POOLER(encodeURIComponent(PW)), "sk_MocResend0123", ""],
    line: "RESEND_API_KEY: không bắt đầu bằng re_",
  },
  {
    name: "khoá Vercel có khoảng trắng",
    answers: ["vcp Moc Token", POOLER(encodeURIComponent(PW)), RESEND, ""],
    line: "VERCEL_TOKEN: có khoảng trắng",
  },
  {
    name: "khoá chưa có mà bỏ trống",
    answers: [TOKEN, POOLER(encodeURIComponent(PW)), "", ""],
    line: "RESEND_API_KEY: chưa có trên GitHub, không được bỏ trống",
  },
  {
    name: "môi trường chưa có",
    arrange: (fake) => writeFileSync(join(fake, "env-missing-staging"), ""),
    line: "môi trường staging chưa có trên GitHub",
  },
  {
    name: "gh chưa đăng nhập",
    arrange: (fake) => writeFileSync(join(fake, "auth-fail"), ""),
    line: "gh chưa đăng nhập",
  },
  {
    name: "gh không đọc được khoá công khai",
    arrange: (fake) => writeFileSync(join(fake, "pubkey-fail-staging"), ""),
    line: "không đọc được khoá công khai của môi trường staging — cần quyền quản trị kho",
  },
];

describe("E3 · đầu vào sai thì không đặt khoá nào", () => {
  for (const c of CELLS) {
    it(`E3 · ${c.name}`, async () => {
      const ctx = fresh();
      c.arrange?.(ctx.fake);
      const r = await run(ctx, ["staging"], c.answers ?? GOOD);
      expect(r.code).not.toBe(0);
      expect(r.lines).toContain(`dat-khoa: ${c.line}`);
      expect(r.sets).toHaveLength(0);
      expect(outputLeaks(r.stdout + r.stderr, { TOKEN, RESEND, PW })).toEqual([]);
    });
  }

  it("E3 · đứt ở lần đặt thứ ba: dừng, nêu tên đã đặt và khoá lỗi; chạy lại chỉ đặt phần còn lại", async () => {
    const ctx = fresh();
    writeFileSync(join(ctx.fake, "fail-set-3"), "");
    const r = await run(ctx, ["staging"], GOOD);
    expect(r.code).not.toBe(0);
    expect(r.sets.map((c) => c.argv[2])).toEqual([
      "VERCEL_TOKEN",
      "MIGRATE_DATABASE_URL",
      "RESEND_API_KEY",
    ]);
    expect(r.lines).toContain(
      "dat-khoa: staging: lỗi khi đặt RESEND_API_KEY; đã đặt: VERCEL_TOKEN, MIGRATE_DATABASE_URL",
    );
    expect(outputLeaks(r.stdout + r.stderr, { TOKEN, RESEND, PW })).toEqual([]);
    const again = await run(ctx, ["staging"], ["", "", RESEND, ""]);
    expect(again.code, again.stdout + again.stderr).toBe(0);
    expect(again.sets.map((c) => c.argv[2])).toEqual([
      "RESEND_API_KEY",
      "AUTH_SECRET",
      "LOGIN_DB_PASSWORD",
    ]);
  });

  it("E3 · đối chứng dương: cùng máy giả, đầu vào đúng thì thoát 0", async () => {
    const ctx = fresh();
    const r = await run(ctx, ["staging"], GOOD);
    expect(r.code).toBe(0);
  });
});
