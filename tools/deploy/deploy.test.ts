// make deploy / make rollback with a fake `vercel` and a fake `psql` first on PATH, a stub isolation command and a fake
// health server (row moi-truong-thu-va-ban-that, E1–E4). The matrix of red steps is the header of
// _acceptance/moi-truong-thu-va-ban-that/evals.yaml: each ENV × each red step on its own.
import { spawn, spawnSync } from "node:child_process";
import { chmodSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";
import { join, resolve } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { tempDir } from "../../tests/support/temp-dir";

const HERE = resolve(__dirname);
const LEN_BAN = join(HERE, "len-ban.mjs");
const LUI_BAN = join(HERE, "lui-ban.mjs");
const KIEM_NHANH = join(HERE, "kiem-nhanh.mjs");
const DEPLOY_MK = resolve(HERE, "../../mk/deploy.mk");

type Env = "staging" | "production";
const STEPS: Record<Env, string[]> = {
  staging: [
    "cau-hinh",
    "migration",
    "cach-ly",
    "dung",
    "kiem-nhanh",
    "gan-ten-mien",
    "kiem-nhanh-ten-mien",
  ],
  production: [
    "cau-hinh",
    "ban-thu-truoc",
    "migration",
    "dung",
    "kiem-nhanh",
    "gan-ten-mien",
    "kiem-nhanh-ten-mien",
  ],
};
const REQUIRED: Record<Env, string[]> = {
  staging: [
    "VERCEL_TOKEN",
    "VERCEL_ORG_ID",
    "VERCEL_PROJECT_ID",
    "MIGRATE_DATABASE_URL",
    "LOGIN_DATABASE_URL",
    "APP_URL",
  ],
  production: [
    "VERCEL_TOKEN",
    "VERCEL_ORG_ID",
    "VERCEL_PROJECT_ID",
    "MIGRATE_DATABASE_URL",
    "APP_URL",
    "STAGING_APP_URL",
  ],
};
const SECRETS = [
  "VERCEL_TOKEN",
  "VERCEL_ORG_ID",
  "VERCEL_PROJECT_ID",
  "MIGRATE_DATABASE_URL",
  "LOGIN_DATABASE_URL",
];
const OLD = "0123456789abcdef0123456789abcdef01234567";

const FAKE_VERCEL = `#!/usr/bin/env node
const fs = require("fs"), path = require("path");
const dir = process.env.FAKE_DIR, a = process.argv.slice(2), cmd = a[0];
fs.appendFileSync(path.join(dir, "calls.log"), Date.now() + " vercel " + a.join(" ") + "\\n");
if (fs.existsSync(path.join(dir, "fail-" + cmd))) { console.error("fake vercel " + cmd + " failed"); process.exit(1); }
if (cmd === "deploy") { console.error("Inspect: https://vercel.example.test/x"); console.log(fs.readFileSync(path.join(dir, "deploy-url"), "utf8").trim()); }
if (cmd === "promote" || cmd === "rollback") fs.writeFileSync(path.join(dir, "ten-mien"), a[1]);
if (cmd === "list") process.stdout.write(fs.existsSync(path.join(dir, "list.json")) ? fs.readFileSync(path.join(dir, "list.json"), "utf8") : '{"deployments":[]}');
`;

// Answers the statements of db/scripts/migrate.sh and of len-ban.mjs; the ledger is the file schema_migrations.
const FAKE_PSQL = `#!/usr/bin/env node
const fs = require("fs"), path = require("path");
const dir = process.env.FAKE_DIR, a = process.argv.slice(2), st = path.join(dir, "schema_migrations");
if (fs.existsSync(path.join(dir, "psql-down"))) { console.error("psql: error: connection refused"); process.exit(2); }
const c = a.indexOf("-c");
if (c >= 0) {
  const sql = a[c + 1];
  if (/to_regclass/.test(sql)) console.log(fs.existsSync(st) ? "t" : "f");
  else if (/create table if not exists public.schema_migrations/.test(sql)) { if (!fs.existsSync(st)) fs.writeFileSync(st, ""); }
  else if (/select name from public.schema_migrations/.test(sql)) process.stdout.write(fs.existsSync(st) ? fs.readFileSync(st, "utf8") : "");
  process.exit(0);
}
const sql = fs.readFileSync(0, "utf8");
if (/fake-loi/.test(sql)) { console.error('ERROR:  syntax error at or near "fake-loi"'); process.exit(3); }
const m = sql.match(/insert into public.schema_migrations \\(name\\) values \\('([^']+)'\\)/);
fs.appendFileSync(st, m[1] + "\\n");
fs.appendFileSync(path.join(dir, "calls.log"), Date.now() + " psql ap " + m[1] + "\\n");
`;

const FAKE_CACH_LY = `#!/usr/bin/env node
const fs = require("fs"), path = require("path");
const dir = process.env.FAKE_DIR;
const vars = ["MIGRATE_DATABASE_URL", "LOGIN_DATABASE_URL"].filter((n) => process.env[n]).length;
fs.appendFileSync(path.join(dir, "calls.log"), Date.now() + " cach-ly " + vars + " bien\\n");
console.log("ok bang-cong-ty-ep-luat-dong");
if (fs.existsSync(path.join(dir, "cach-ly-do"))) { console.log("bang khong ep luat dong: listing"); process.exit(1); }
console.log("ok vai-supabase-khong-quyen\\nok vai-dang-nhap-khong-chu\\nok phien-dang-nhap-khong-thay-dong\\ncach-ly-dich: 4 ca đạt");
`;

interface Health {
  [key: string]: unknown;
}

interface Ctx {
  root: string;
  repo: string;
  fake: string;
  bin: string;
  base: string;
  head: string;
  env: Record<string, string>;
  /** Health per path prefix; the domain (/ten-mien) serves whichever deployment the fake vercel pointed it at. */
  health: Record<string, Health | "drop">;
  proto: Record<string, number>;
  domainOverride?: Health;
  /** Answers for the domain's next health reads, one each, before the usual ones: "drop" closes, "text" is not JSON. */
  domainSeq?: (Health | "drop" | "text")[];
  requests: { t: number; path: string }[];
}

const servers: Server[] = [];
afterEach(async () => {
  await Promise.all(servers.splice(0).map((s) => new Promise((r) => s.close(() => r(null)))));
});

function git(cwd: string, ...args: string[]): string {
  const r = spawnSync("git", args, { cwd, encoding: "utf8" });
  if (r.status !== 0) throw new Error(r.stderr);
  return r.stdout.trim();
}

function exe(path: string, text: string): void {
  writeFileSync(path, text);
  chmodSync(path, 0o755);
}

interface Setup {
  vercelJson?: unknown;
  migrations?: Record<string, string>;
}

async function fresh(appEnv: Env, setup: Setup = {}): Promise<Ctx> {
  const root = tempDir("deploy-");
  const repo = join(root, "repo");
  const fake = join(root, "fake");
  const bin = join(root, "bin");
  for (const d of [repo, fake, bin, join(repo, "db", "migrations")])
    mkdirSync(d, { recursive: true });
  exe(join(bin, "vercel"), FAKE_VERCEL);
  exe(join(bin, "psql"), FAKE_PSQL);
  exe(join(bin, "cach-ly"), FAKE_CACH_LY);

  writeFileSync(
    join(repo, "vercel.json"),
    JSON.stringify(setup.vercelJson ?? { regions: ["sin1"], git: { deploymentEnabled: false } }),
  );
  const migrations = setup.migrations ?? {
    "001_a.sql": "create table a (id int);\n",
    "002_b.sql": "alter table a add column b int;\n",
  };
  for (const [name, text] of Object.entries(migrations)) {
    writeFileSync(join(repo, "db", "migrations", name), text);
  }
  git(repo, "init", "-q", "-b", "main");
  git(repo, "-c", "user.email=t@example.test", "-c", "user.name=t", "add", ".");
  git(
    repo,
    "-c",
    "user.email=t@example.test",
    "-c",
    "user.name=t",
    "-c",
    "core.hooksPath=/dev/null",
    "commit",
    "-q",
    "-m",
    "x",
  );
  const head = git(repo, "rev-parse", "HEAD");
  // 001 already ran on the target.
  writeFileSync(join(fake, "schema_migrations"), "001_a.sql\n");

  const ctx: Ctx = {
    root,
    repo,
    fake,
    bin,
    base: "",
    head,
    env: {},
    health: {},
    proto: {},
    requests: [],
  };
  const server = createServer((req, res) => {
    const path = req.url ?? "/";
    ctx.requests.push({ t: Date.now(), path });
    let prefix = "/" + (path.split("/")[1] ?? "");
    const rest = path.slice(prefix.length);
    if (prefix === "/ten-mien") {
      const next = rest === "/api/v1/health" ? ctx.domainSeq?.shift() : undefined;
      if (next === "drop") {
        req.socket.destroy();
        return;
      }
      if (next === "text") {
        res.statusCode = 502;
        res.end("Bad gateway");
        return;
      }
      if (next) {
        res.setHeader("content-type", "application/json");
        res.end(JSON.stringify(next));
        return;
      }
      if (rest === "/api/v1/health" && ctx.domainOverride) {
        res.setHeader("content-type", "application/json");
        res.end(JSON.stringify(ctx.domainOverride));
        return;
      }
      const target = existsSync(join(fake, "ten-mien"))
        ? readFileSync(join(fake, "ten-mien"), "utf8").trim()
        : "";
      prefix = "/" + (target.replace(/^https?:\/\/[^/]+/, "").split("/")[1] ?? "");
    }
    const h = ctx.health[prefix];
    if (h === "drop") {
      req.socket.destroy();
      return;
    }
    if (rest === "/api/v1/health" && h) {
      res.setHeader("content-type", "application/json");
      res.statusCode = h["ok"] === true ? 200 : 503;
      res.end(JSON.stringify(h));
      return;
    }
    res.statusCode = rest.startsWith("/proto/") ? (ctx.proto[prefix] ?? 404) : 404;
    res.end("not found");
  });
  servers.push(server);
  await new Promise((r) => server.listen(0, "127.0.0.1", () => r(null)));
  ctx.base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;

  ctx.health["/ban-moi"] = { ok: true, commit: head, env: appEnv, vai: "dat" };
  ctx.health["/ban-cu"] = { ok: true, commit: OLD, env: appEnv, vai: "dat" };
  ctx.health["/ban-thu"] = { ok: true, commit: head, env: "staging", vai: "dat" };
  writeFileSync(join(fake, "deploy-url"), `${ctx.base}/ban-moi\n`);
  writeFileSync(join(fake, "ten-mien"), `${ctx.base}/ban-cu`);
  writeFileSync(
    join(fake, "list.json"),
    JSON.stringify({
      deployments: [
        { url: `${ctx.base}/ban-cu`, createdAt: 1, state: "READY", meta: { onehub_commit: OLD } },
        {
          url: `${ctx.base}/ban-moi`,
          createdAt: 2,
          state: "READY",
          meta: { onehub_commit: head },
        },
      ],
    }),
  );

  ctx.env = {
    PATH: `${bin}:${process.env["PATH"]}`,
    HOME: process.env["HOME"] ?? root,
    TMPDIR: process.env["TMPDIR"] ?? root,
    FAKE_DIR: fake,
    CACH_LY_CMD: join(bin, "cach-ly"),
    VERCEL_TOKEN: "moc-bi-mat-VERCEL_TOKEN",
    VERCEL_ORG_ID: "moc-bi-mat-VERCEL_ORG_ID",
    VERCEL_PROJECT_ID: "moc-bi-mat-VERCEL_PROJECT_ID",
    MIGRATE_DATABASE_URL: "moc-bi-mat-MIGRATE_DATABASE_URL",
    APP_URL: `${ctx.base}/ten-mien`,
  };
  if (appEnv === "staging") ctx.env["LOGIN_DATABASE_URL"] = "moc-bi-mat-LOGIN_DATABASE_URL";
  else ctx.env["STAGING_APP_URL"] = `${ctx.base}/ban-thu`;
  return ctx;
}

interface Run {
  code: number;
  stdout: string;
  stderr: string;
  lines: string[];
  calls: string[];
  vercel: string[];
}

function run(ctx: Ctx, cmd: string, args: string[]): Promise<Run> {
  return new Promise((done) => {
    const child = spawn(cmd, args, { cwd: ctx.repo, env: ctx.env });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (b) => (stdout += b));
    child.stderr.on("data", (b) => (stderr += b));
    child.on("close", (code) => {
      const log = join(ctx.fake, "calls.log");
      const calls = existsSync(log)
        ? readFileSync(log, "utf8")
            .split("\n")
            .filter(Boolean)
            .map((l) => l.replace(/^\d+ /, ""))
        : [];
      done({
        code: code ?? 1,
        stdout,
        stderr,
        lines: stdout.split("\n").filter(Boolean),
        calls,
        vercel: calls.filter((c) => c.startsWith("vercel ")),
      });
    });
  });
}

const deploy = (ctx: Ctx, appEnv: Env) => run(ctx, "node", [LEN_BAN, appEnv]);
const rollback = (ctx: Ctx, appEnv: Env) => run(ctx, "node", [LUI_BAN, appEnv]);

function applied(ctx: Ctx): string[] {
  return readFileSync(join(ctx.fake, "schema_migrations"), "utf8").split("\n").filter(Boolean);
}

function expectNoMarker(ctx: Ctx, r: Run): void {
  const text = `${r.stdout}\n${r.stderr}\n${r.calls.join("\n")}`;
  for (const name of SECRETS) {
    expect(text.includes(`moc-bi-mat-${name}`), `giá trị của ${name} lộ ra`).toBe(false);
  }
  expect(text).not.toContain("moc-bi-mat-");
}

function expectGreen(ctx: Ctx, appEnv: Env, r: Run): void {
  expect(r.code, r.stdout + r.stderr).toBe(0);
  expect(r.lines).toEqual([
    ...STEPS[appEnv].map((s) => `deploy ${appEnv}: ${s} đạt`),
    `deploy ${appEnv}: xong ${ctx.head.slice(0, 7)}`,
  ]);
  const url = `${ctx.base}/ban-moi`;
  expect(r.vercel).toEqual([
    "vercel pull --yes --environment=production",
    "vercel build --prod",
    `vercel deploy --prebuilt --prod --skip-domain --meta onehub_commit=${ctx.head} --env COMMIT_SHA=${ctx.head}`,
    `vercel promote ${url} --yes`,
  ]);
  // The pending migration ran before the first vercel call.
  const firstVercel = r.calls.findIndex((c) => c.startsWith("vercel "));
  const apply = r.calls.indexOf("psql ap 002_b.sql");
  expect(apply).toBeGreaterThanOrEqual(0);
  expect(apply).toBeLessThan(firstVercel);
  expect(applied(ctx)).toEqual(["001_a.sql", "002_b.sql"]);
  expectNoMarker(ctx, r);
}

describe("make deploy — green", () => {
  for (const appEnv of ["staging", "production"] as const) {
    it(`${appEnv} xanh qua make: bảy bước đạt, vercel đúng thứ tự, migration trước vercel`, async () => {
      const ctx = await fresh(appEnv);
      const r = await run(ctx, "make", ["-s", "-f", DEPLOY_MK, "deploy", `ENV=${appEnv}`]);
      expectGreen(ctx, appEnv, r);
      if (appEnv === "staging") expect(r.calls).toContain("cach-ly 2 bien");
      else expect(r.calls.some((c) => c.startsWith("cach-ly"))).toBe(false);
    });

    it(`${appEnv}: promote chỉ sau kiem-nhanh đạt trên địa chỉ bản mới`, async () => {
      const ctx = await fresh(appEnv);
      const r = await deploy(ctx, appEnv);
      expect(r.code).toBe(0);
      const log = readFileSync(join(ctx.fake, "calls.log"), "utf8").split("\n");
      const promoteAt = Number(log.find((l) => / vercel promote /.test(l))?.split(" ")[0]);
      const checks = ctx.requests.filter((q) => q.path === "/ban-moi/api/v1/health");
      expect(checks.length).toBeGreaterThan(0);
      expect(checks[0]!.t).toBeLessThanOrEqual(promoteAt);
      const proto = ctx.requests.filter((q) => q.path === "/ban-moi/proto/x");
      expect(proto.length).toBeGreaterThan(0);
      expect(proto[0]!.t).toBeLessThanOrEqual(promoteAt);
      expect(r.lines.indexOf(`deploy ${appEnv}: kiem-nhanh đạt`)).toBeLessThan(
        r.lines.indexOf(`deploy ${appEnv}: gan-ten-mien đạt`),
      );
    });

    it(`${appEnv}: migration xoá cột có dòng «-- bo-sau:» thì đi tiếp (Hỏi-4)`, async () => {
      const ctx = await fresh(appEnv, {
        migrations: {
          "001_a.sql": "create table a (id int, b int);\n",
          "002_b.sql":
            "-- bo-sau: 001 thêm cột thay, bản cũ không đọc b nữa\nalter table a drop column b;\n",
        },
      });
      const r = await deploy(ctx, appEnv);
      expect(r.code, r.stdout).toBe(0);
      expect(applied(ctx)).toEqual(["001_a.sql", "002_b.sql"]);
    });
  }
});

interface RedCase {
  name: string;
  step: string;
  envs?: Env[];
  setup?: Setup;
  arrange?: (ctx: Ctx, appEnv: Env) => void;
  reason?: (ctx: Ctx) => RegExp | string;
}

const healthCase = (name: string, patch: (h: Health) => Health, reason: string): RedCase => ({
  name,
  step: "kiem-nhanh",
  arrange: (ctx) => {
    ctx.health["/ban-moi"] = patch({ ...(ctx.health["/ban-moi"] as Health) });
  },
  reason: () => reason,
});

const RED: RedCase[] = [
  ...[...new Set([...REQUIRED.staging, ...REQUIRED.production])].map((name): RedCase => ({
    name: `thiếu ${name}`,
    step: "cau-hinh",
    envs: (["staging", "production"] as const).filter((e) => REQUIRED[e].includes(name)),
    arrange: (ctx) => {
      delete ctx.env[name];
    },
    reason: () => `thiếu biến ${name}`,
  })),
  {
    name: "vercel.json thiếu sin1",
    step: "cau-hinh",
    setup: { vercelJson: { regions: ["iad1"], git: { deploymentEnabled: false } } },
    reason: () => "khoá regions",
  },
  {
    name: "vercel.json bật tự triển khai",
    step: "cau-hinh",
    setup: { vercelJson: { regions: ["sin1"] } },
    reason: () => "khoá git.deploymentEnabled",
  },
  {
    name: "cây chưa sạch",
    step: "cau-hinh",
    arrange: (ctx) => writeFileSync(join(ctx.repo, "lac.txt"), "x"),
    reason: () => "cây chưa sạch",
  },
  {
    name: "bản thử chạy commit khác",
    step: "ban-thu-truoc",
    envs: ["production"],
    arrange: (ctx) => {
      ctx.health["/ban-thu"] = { ok: true, commit: OLD, env: "staging", vai: "dat" };
    },
    reason: (ctx) => `bản thử chưa chạy ${ctx.head.slice(0, 7)}`,
  },
  {
    name: "bản thử không trả lời",
    step: "ban-thu-truoc",
    envs: ["production"],
    arrange: (ctx) => {
      ctx.health["/ban-thu"] = "drop";
    },
    reason: (ctx) => `bản thử chưa chạy ${ctx.head.slice(0, 7)}`,
  },
  {
    name: "một tệp migration lỗi",
    step: "migration",
    setup: {
      migrations: { "001_a.sql": "create table a (id int);\n", "002_b.sql": "fake-loi;\n" },
    },
    reason: () => "migrate.sh lỗi",
  },
  {
    name: "không nối được cơ sở dữ liệu đích",
    step: "migration",
    arrange: (ctx) => writeFileSync(join(ctx.fake, "psql-down"), ""),
    reason: () => "không đọc được sổ migration",
  },
  {
    name: "migration xoá cột thiếu «-- bo-sau:» (Hỏi-4)",
    step: "migration",
    setup: {
      migrations: {
        "001_a.sql": "create table a (id int, b int);\n",
        "002_b.sql": "alter table a drop column b;\n",
        "003_c.sql": "create table c (id int);\n",
      },
    },
    reason: () => "002_b.sql xoá hay đổi tên",
  },
  {
    name: "migration đổi tên bảng thiếu «-- bo-sau:» (Hỏi-4)",
    step: "migration",
    setup: {
      migrations: {
        "001_a.sql": "create table a (id int);\n",
        "002_b.sql": "alter table a rename to a2;\n",
      },
    },
    reason: () => "002_b.sql",
  },
  {
    name: "bộ kiểm cách ly đỏ",
    step: "cach-ly",
    envs: ["staging"],
    arrange: (ctx) => writeFileSync(join(ctx.fake, "cach-ly-do"), ""),
    reason: () => "bang khong ep luat dong: listing",
  },
  {
    name: "vercel pull lỗi",
    step: "dung",
    arrange: (ctx) => writeFileSync(join(ctx.fake, "fail-pull"), ""),
    reason: () => "vercel pull lỗi",
  },
  {
    name: "vercel build lỗi",
    step: "dung",
    arrange: (ctx) => writeFileSync(join(ctx.fake, "fail-build"), ""),
    reason: () => "vercel build lỗi",
  },
  {
    name: "vercel deploy lỗi",
    step: "dung",
    arrange: (ctx) => writeFileSync(join(ctx.fake, "fail-deploy"), ""),
    reason: () => "vercel deploy lỗi",
  },
  healthCase("sức khoẻ ok false", (h) => ({ ...h, ok: false }), "ok khác true"),
  healthCase("sức khoẻ commit khác", (h) => ({ ...h, commit: OLD }), "chạy commit 0123456"),
  healthCase("sức khoẻ env khác", (h) => ({ ...h, env: "development" }), "env là development"),
  healthCase("sức khoẻ vai chưa đạt", (h) => ({ ...h, vai: "vai chủ bảng" }), "vai nối chưa đạt"),
  healthCase("sức khoẻ có khoá lạ", (h) => ({ ...h, db: "x" }), "khoá lạ: db"),
  healthCase(
    "sức khoẻ thiếu khoá",
    (h) => {
      const rest = { ...h };
      delete rest["vai"];
      return rest;
    },
    "thiếu khoá: vai",
  ),
  {
    name: "/proto/x mở (công tắc máy dev chưa tắt)",
    step: "kiem-nhanh",
    arrange: (ctx) => {
      ctx.proto["/ban-moi"] = 200;
    },
    reason: () => "/proto/x trả 200",
  },
  {
    name: "bản mới không trả lời",
    step: "kiem-nhanh",
    arrange: (ctx) => {
      ctx.health["/ban-moi"] = "drop";
    },
    reason: () => "không trả lời",
  },
  {
    name: "vercel promote lỗi",
    step: "gan-ten-mien",
    arrange: (ctx) => writeFileSync(join(ctx.fake, "fail-promote"), ""),
    reason: () => "vercel promote lỗi",
  },
];

describe("make deploy — ma trận bước đỏ", () => {
  for (const appEnv of ["staging", "production"] as const) {
    for (const c of RED.filter((x) => !x.envs || x.envs.includes(appEnv))) {
      it(`${appEnv} · ${c.step} · ${c.name}`, async () => {
        const ctx = await fresh(appEnv, c.setup);
        c.arrange?.(ctx, appEnv);
        const before = applied(ctx);
        const r = await deploy(ctx, appEnv);
        const steps = STEPS[appEnv];
        const at = steps.indexOf(c.step);
        expect(r.code).not.toBe(0);
        expect(r.lines.slice(0, at)).toEqual(
          steps.slice(0, at).map((s) => `deploy ${appEnv}: ${s} đạt`),
        );
        const red = r.lines.filter((l) => l.includes(" ĐỎ — "));
        expect(red).toHaveLength(1);
        expect(red[0]!.startsWith(`deploy ${appEnv}: ${c.step} ĐỎ — `)).toBe(true);
        if (c.reason) expect(red[0]).toContain(c.reason(ctx));
        expect(r.lines.slice(at)).toEqual([
          red[0],
          `deploy ${appEnv}: DỪNG ở ${c.step} — tên miền không đổi`,
        ]);
        for (const later of steps.slice(at + 1)) {
          expect(r.lines.some((l) => l.startsWith(`deploy ${appEnv}: ${later} `))).toBe(false);
        }
        expect(r.vercel.some((v) => v.startsWith("vercel promote"))).toBe(
          c.step === "gan-ten-mien",
        );
        expect(r.vercel.some((v) => v.startsWith("vercel rollback"))).toBe(false);
        // Steps before the migration touch nothing; a red migration applies nothing.
        if (steps.indexOf("migration") >= at) expect(applied(ctx)).toEqual(before);
        if (c.step === "ban-thu-truoc" || c.step === "cau-hinh") {
          expect(r.vercel).toEqual([]);
          expect(r.calls.some((x) => x.startsWith("psql"))).toBe(false);
        }
        expectNoMarker(ctx, r);
      });
    }

    it(`${appEnv} · kiem-nhanh-ten-mien đỏ sau gắn tên miền → lùi đúng một lần`, async () => {
      const ctx = await fresh(appEnv);
      ctx.domainOverride = { ok: true, commit: ctx.head, env: appEnv, vai: "không nối được" };
      const r = await deploy(ctx, appEnv);
      expect(r.code).not.toBe(0);
      const steps = STEPS[appEnv];
      expect(r.lines.slice(0, 6)).toEqual(
        steps.slice(0, 6).map((s) => `deploy ${appEnv}: ${s} đạt`),
      );
      expect(r.lines.slice(6)).toEqual([
        `deploy ${appEnv}: kiem-nhanh-ten-mien ĐỎ — vai nối chưa đạt: không nối được`,
        `deploy ${appEnv}: đã lùi về bản trước`,
      ]);
      expect(r.vercel.filter((v) => v.startsWith("vercel promote"))).toHaveLength(1);
      expect(r.vercel.filter((v) => v.startsWith("vercel rollback"))).toEqual([
        `vercel rollback ${ctx.base}/ban-cu --yes`,
      ]);
      expectNoMarker(ctx, r);
    });
  }
});

describe("make deploy — lùi sau gắn tên miền không đoán", () => {
  for (const appEnv of ["staging", "production"] as const) {
    const redAfter = (ctx: Ctx): Health => ({
      ok: true,
      commit: ctx.head,
      env: appEnv,
      vai: "không nối được",
    });

    it(`${appEnv}: không đọc được tên miền trước khi gắn → không tự lùi, nêu đích danh`, async () => {
      const ctx = await fresh(appEnv);
      ctx.domainSeq = ["drop", redAfter(ctx)];
      const r = await deploy(ctx, appEnv);
      expect(r.code).not.toBe(0);
      expect(r.lines.slice(6)).toEqual([
        `deploy ${appEnv}: kiem-nhanh-ten-mien ĐỎ — vai nối chưa đạt: không nối được`,
        `deploy ${appEnv}: lùi bản DỪNG — không đọc được bản tên miền chạy trước khi gắn, không đoán; tên miền vẫn ở bản mới — nêu đích danh bản cần lùi về: make rollback ENV=${appEnv} BAN=<url hoặc id>`,
      ]);
      expect(r.vercel.filter((v) => v.startsWith("vercel promote"))).toHaveLength(1);
      expect(r.vercel.some((v) => v.startsWith("vercel rollback"))).toBe(false);
      expectNoMarker(ctx, r);
    });

    it(`${appEnv}: không đọc được danh sách bản sau gắn → dòng riêng, không phải «không có bản trước»`, async () => {
      const ctx = await fresh(appEnv);
      ctx.domainSeq = [{ ok: true, commit: OLD, env: appEnv, vai: "dat" }, redAfter(ctx)];
      writeFileSync(join(ctx.fake, "fail-list"), "");
      const r = await deploy(ctx, appEnv);
      expect(r.code).not.toBe(0);
      expect(r.lines.slice(6)).toEqual([
        `deploy ${appEnv}: kiem-nhanh-ten-mien ĐỎ — vai nối chưa đạt: không nối được`,
        `deploy ${appEnv}: lùi bản ĐỎ — không đọc được danh sách bản của Vercel; tên miền vẫn ở bản mới`,
      ]);
      expect(r.vercel.some((v) => v.startsWith("vercel rollback"))).toBe(false);
      expectNoMarker(ctx, r);
    });
  }
});

describe("make rollback", () => {
  for (const appEnv of ["staging", "production"] as const) {
    it(`${appEnv}: lùi một lần về bản trước rồi kiểm tên miền`, async () => {
      const ctx = await fresh(appEnv);
      writeFileSync(join(ctx.fake, "ten-mien"), `${ctx.base}/ban-moi`);
      const r = await run(ctx, "make", ["-s", "-f", DEPLOY_MK, "rollback", `ENV=${appEnv}`]);
      expect(r.code, r.stdout + r.stderr).toBe(0);
      expect(r.vercel.filter((v) => v.startsWith("vercel rollback"))).toEqual([
        `vercel rollback ${ctx.base}/ban-cu --yes`,
      ]);
      expect(ctx.requests.filter((q) => q.path === "/ten-mien/api/v1/health").length).toBe(2);
      expect(r.lines).toEqual([`rollback ${appEnv}: tên miền chạy ${OLD.slice(0, 7)}`]);
      expectNoMarker(ctx, r);
    });

    it(`${appEnv}: không có bản trước thì từ chối, không gọi rollback`, async () => {
      const ctx = await fresh(appEnv);
      writeFileSync(join(ctx.fake, "ten-mien"), `${ctx.base}/ban-moi`);
      writeFileSync(
        join(ctx.fake, "list.json"),
        JSON.stringify({
          deployments: [
            {
              url: `${ctx.base}/ban-moi`,
              createdAt: 2,
              state: "READY",
              meta: { onehub_commit: ctx.head },
            },
          ],
        }),
      );
      const r = await rollback(ctx, appEnv);
      expect(r.code).not.toBe(0);
      expect(r.lines).toEqual([`rollback ${appEnv}: không có bản trước để lùi`]);
      expect(r.vercel.some((v) => v.startsWith("vercel rollback"))).toBe(false);
    });
  }

  for (const appEnv of ["staging", "production"] as const) {
    for (const [how, answer, reason] of [
      ["máy chủ không trả lời", "drop", "sức khoẻ không trả lời"],
      ["không phải JSON", "text", "sức khoẻ trả 502, không phải JSON"],
    ] as const) {
      it(`${appEnv}: không đọc được tên miền (${how}) thì dừng, không đoán, không gọi rollback`, async () => {
        const ctx = await fresh(appEnv);
        writeFileSync(join(ctx.fake, "ten-mien"), `${ctx.base}/ban-moi`);
        ctx.domainSeq = [answer];
        const r = await run(ctx, "make", ["-s", "-f", DEPLOY_MK, "rollback", `ENV=${appEnv}`]);
        expect(r.code).not.toBe(0);
        expect(r.lines).toEqual([
          `rollback ${appEnv}: DỪNG — không đọc được bản tên miền đang chạy (${reason}), không đoán — nêu đích danh bản cần lùi về: make rollback ENV=${appEnv} BAN=<url hoặc id>`,
        ]);
        expect(r.vercel.some((v) => v.startsWith("vercel rollback"))).toBe(false);
        expectNoMarker(ctx, r);
      });
    }

    it(`${appEnv}: BAN nêu đích danh thì lùi đúng một lần về bản ấy dù tên miền không đọc được`, async () => {
      const ctx = await fresh(appEnv);
      // The domain serves ban-moi, which does not answer; with BAN the domain is read once, after the rollback.
      writeFileSync(join(ctx.fake, "ten-mien"), `${ctx.base}/ban-moi`);
      ctx.health["/ban-moi"] = "drop";
      const ban = `${ctx.base}/ban-cu`;
      const r = await run(ctx, "make", [
        "-s",
        "-f",
        DEPLOY_MK,
        "rollback",
        `ENV=${appEnv}`,
        `BAN=${ban}`,
      ]);
      expect(r.code, r.stdout + r.stderr).toBe(0);
      expect(r.vercel.filter((v) => v.startsWith("vercel rollback"))).toEqual([
        `vercel rollback ${ban} --yes`,
      ]);
      expect(ctx.requests.filter((q) => q.path === "/ten-mien/api/v1/health").length).toBe(1);
      expect(r.lines).toEqual([`rollback ${appEnv}: tên miền chạy ${OLD.slice(0, 7)}`]);
      expectNoMarker(ctx, r);
    });

    it(`${appEnv}: không đọc được danh sách bản thì báo dòng riêng`, async () => {
      const ctx = await fresh(appEnv);
      writeFileSync(join(ctx.fake, "ten-mien"), `${ctx.base}/ban-moi`);
      writeFileSync(join(ctx.fake, "fail-list"), "");
      const r = await rollback(ctx, appEnv);
      expect(r.code).not.toBe(0);
      expect(r.lines).toEqual([`rollback ${appEnv}: ĐỎ — không đọc được danh sách bản của Vercel`]);
      expect(r.vercel.some((v) => v.startsWith("vercel rollback"))).toBe(false);
    });
  }

  it("tên miền sau khi lùi đỏ thì báo đỏ", async () => {
    const ctx = await fresh("staging");
    writeFileSync(join(ctx.fake, "ten-mien"), `${ctx.base}/ban-moi`);
    ctx.health["/ban-cu"] = { ok: true, commit: OLD, env: "staging", vai: "dat" };
    ctx.proto["/ban-cu"] = 200;
    const r = await rollback(ctx, "staging");
    expect(r.code).not.toBe(0);
    expect(r.lines).toEqual([
      "rollback staging: kiem-nhanh-ten-mien ĐỎ — /proto/x trả 200, cần 404",
    ]);
  });

  it("thiếu biến thì đỏ gọi tên biến, không gọi vercel", async () => {
    const ctx = await fresh("production");
    delete ctx.env["VERCEL_TOKEN"];
    const r = await rollback(ctx, "production");
    expect(r.code).not.toBe(0);
    expect(r.lines).toEqual(["rollback production: ĐỎ — thiếu biến VERCEL_TOKEN"]);
    expect(r.vercel).toEqual([]);
  });
});

describe("make smoke", () => {
  it("đạt trên tên miền đang chạy HEAD, đỏ khi commit khác", async () => {
    const ctx = await fresh("staging");
    writeFileSync(join(ctx.fake, "ten-mien"), `${ctx.base}/ban-moi`);
    const ok = await run(ctx, "make", ["-s", "-f", DEPLOY_MK, "smoke", "ENV=staging"]);
    expect(ok.code, ok.stdout + ok.stderr).toBe(0);
    expect(ok.lines).toEqual([`smoke staging: đạt ${ctx.head.slice(0, 7)}`]);
    writeFileSync(join(ctx.fake, "ten-mien"), `${ctx.base}/ban-cu`);
    const red = await run(ctx, "node", [KIEM_NHANH, "staging"]);
    expect(red.code).not.toBe(0);
    expect(red.lines).toEqual([
      `smoke staging: ĐỎ — chạy commit ${OLD.slice(0, 7)}, cần ${ctx.head.slice(0, 7)}`,
    ]);
  });
});

// The real db/scripts/migrate.sh against a real Postgres: set DEPLOY_KIEM_PG_CONTAINER to a lane's container
// (make db-up DB_LANE=k DB_PORT=5564 → onehub-inventory-db-k). Skipped otherwise; the fake psql above covers CI.
const PG = process.env["DEPLOY_KIEM_PG_CONTAINER"];
describe.runIf(PG)("make deploy — migration trên Postgres thật", () => {
  const sql = (db: string, statement: string): string => {
    const r = spawnSync(
      "docker",
      [
        "exec",
        "-i",
        PG!,
        "psql",
        "-U",
        "postgres",
        "-d",
        db,
        "-X",
        "-q",
        "-A",
        "-t",
        "-c",
        statement,
      ],
      { encoding: "utf8" },
    );
    if (r.status !== 0) throw new Error(r.stderr);
    return r.stdout.trim();
  };

  async function onRealDb(migrations: Record<string, string>) {
    const db = `deploy_kiem_${process.pid}_${Math.floor(Math.random() * 1e6)}`;
    sql("postgres", `create database ${db}`);
    const ctx = await fresh("staging", { migrations });
    ctx.env["PSQL_DICH"] = `docker exec -i ${PG} psql -U postgres`;
    ctx.env["MIGRATE_DATABASE_URL"] = `postgresql:///${db}`;
    try {
      const r = await deploy(ctx, "staging");
      const hasLedger =
        sql(db, "select to_regclass('public.schema_migrations') is not null") === "t";
      const ledger = !hasLedger
        ? ""
        : sql(
            db,
            "select coalesce(string_agg(name || ' ' || (extract(epoch from applied_at) * 1000)::bigint, ',' order by name), '') from public.schema_migrations",
          );
      const tableA = sql(db, "select to_regclass('public.a') is not null") === "t";
      return { ctx, r, ledger, tableA };
    } finally {
      sql("postgres", `drop database ${db}`);
    }
  }

  it("migration chưa chạy được áp trước lần gọi vercel đầu (đọc schema_migrations)", async () => {
    const { ctx, r, ledger } = await onRealDb({
      "001_a.sql": "create table a (id int);\n",
      "002_b.sql": "alter table a add column b int;\n",
    });
    expect(r.code, r.stdout + r.stderr).toBe(0);
    const rows = ledger.split(",").map((x) => x.split(" "));
    expect(rows.map((x) => x[0])).toEqual(["001_a.sql", "002_b.sql"]);
    const log = readFileSync(join(ctx.fake, "calls.log"), "utf8").split("\n");
    const pullAt = Number(log.find((l) => / vercel pull /.test(l))?.split(" ")[0]);
    for (const [, at] of rows) expect(Number(at)).toBeLessThanOrEqual(pullAt);
  });

  it("xoá cột thiếu «-- bo-sau:» thì đỏ và sổ không đổi", async () => {
    const { r, ledger, tableA } = await onRealDb({
      "001_a.sql": "create table a (id int);\n",
      "002_b.sql": "alter table a drop column id;\n",
    });
    expect(r.code).not.toBe(0);
    expect(r.lines).toContain(
      "deploy staging: migration ĐỎ — 002_b.sql xoá hay đổi tên bảng hoặc cột mà thiếu dòng «-- bo-sau:» — chưa áp gì",
    );
    expect(ledger).toBe("");
    expect(tableA).toBe(false);
  });
});
