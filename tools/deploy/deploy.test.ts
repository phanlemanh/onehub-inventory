// make deploy / make rollback with a fake `vercel` and a fake `psql` first on PATH, a stub isolation command and a fake
// health server (row moi-truong-thu-va-ban-that, E1–E4). The matrix of red steps is the header of
// _acceptance/moi-truong-thu-va-ban-that/evals.yaml: each ENV × each red step on its own.
import { spawn, spawnSync } from "node:child_process";
import { chmodSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
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

// How a run reaches Vercel: the token (CI), or the operator's signed-in CLI session. Each run prints exactly one line.
type Mode = "khoa" | "phien";
const MODE_TEXT: Record<Mode, string> = {
  khoa: "dùng khoá VERCEL_TOKEN",
  phien: "dùng phiên Vercel CLI đã đăng nhập",
};
const MODE_LINE =
  /^(deploy|rollback) (staging|production): (cau-hinh — )?dùng (khoá VERCEL_TOKEN|phiên Vercel CLI đã đăng nhập)$/;
const deployMode = (appEnv: Env, mode: Mode) => `deploy ${appEnv}: cau-hinh — ${MODE_TEXT[mode]}`;
const rollbackMode = (appEnv: Env, mode: Mode) => `rollback ${appEnv}: ${MODE_TEXT[mode]}`;

// The domain (APP_URL, path /ten-mien) is an alias: the file ten-mien holds the id of the deployment it points to, or is
// absent when it was never attached. `inspect <id or host> --json` answers like vercel@65.9.0 — GET
// /v13/deployments/<id or host>, an alias resolving to the deployment it points to — with `{ id, name, url, target,
// readyState, createdAt }` on stdout, and exits 1 with an error on stderr when there is none. `promote` and
// `rollback` take an id or url and move the alias; `rollback-khong-doi` makes rollback exit 0 without moving it.
const FAKE_VERCEL = `#!/usr/bin/env node
const fs = require("fs"), path = require("path");
const dir = process.env.FAKE_DIR, a = process.argv.slice(2), cmd = a[0];
const has = (n) => fs.existsSync(path.join(dir, n));
const read = (n) => fs.readFileSync(path.join(dir, n), "utf8");
fs.appendFileSync(path.join(dir, "calls.log"), Date.now() + " vercel " + a.join(" ") + "\\n");
// Like the real CLI: a token in the environment, or the session of an earlier vercel login (the file phien-dang-nhap).
if (!process.env.VERCEL_TOKEN && !has("phien-dang-nhap")) { console.error("Error: No existing credentials found. Please run vercel login."); process.exit(1); }
if (has("fail-" + cmd)) { console.error("fake vercel " + cmd + " failed"); process.exit(1); }
const bare = (u) => String(u).replace(/^https?:\\/\\//, "").replace(/\\/+$/, "");
const all = () => (has("list.json") ? JSON.parse(read("list.json")).deployments : []);
const find = (x) => {
  if (/\\/ten-mien$/.test(bare(x))) return has("ten-mien") ? all().find((d) => d.id === read("ten-mien").trim()) : undefined;
  return all().find((d) => d.id === x || bare(d.url) === bare(x));
};
if (cmd === "whoami") console.log("nguoi-thu");
if (cmd === "deploy") { console.error("Inspect: https://vercel.example.test/x"); console.log(read("deploy-url").trim()); }
if (cmd === "promote" || cmd === "rollback") {
  const d = find(a[1]);
  if (!d) { console.error("Error: Can't find the deployment " + a[1]); process.exit(1); }
  if (!(cmd === "rollback" && has("rollback-khong-doi"))) fs.writeFileSync(path.join(dir, "ten-mien"), d.id);
}
if (cmd === "inspect") {
  const d = has("fail-inspect-" + bare(a[1]).split("/").pop()) ? undefined : find(a[1]);
  if (!d) { console.error('Error: Can\\'t find the deployment "' + a[1] + '" under the context'); process.exit(1); }
  console.log(JSON.stringify({ id: d.id, name: "onehub-inventory", url: d.url, target: "production", readyState: d.state, createdAt: d.createdAt }, null, 2));
}
if (cmd === "list") process.stdout.write(has("list.json") ? read("list.json") : '{"deployments":[]}');
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
  host: string;
  /** Answers for the domain's next health reads, one each, before the usual ones: "drop" closes, "text" is not JSON. */
  domainSeq?: (Health | "drop" | "text")[];
  requests: { t: number; path: string }[];
}

interface Listed {
  id: string;
  url: string;
  createdAt: number;
  state: string;
  meta: { onehub_commit: string };
}

const T0 = Date.UTC(2026, 10, 1, 8, 0, 0);
const HOUR = 3_600_000;

/** The READY production deployments `vercel list --json` returns; `path` is the fake server's prefix of each. */
function setList(
  ctx: Ctx,
  ds: { id: string; path: string; createdAt: number; commit: string }[],
): void {
  const deployments: Listed[] = ds.map((d) => ({
    id: d.id,
    // `vercel list --json` gives bare hosts, `vercel deploy` prints `https://host`.
    url: `${ctx.host}/${d.path}`,
    createdAt: d.createdAt,
    state: "READY",
    meta: { onehub_commit: d.commit },
  }));
  writeFileSync(join(ctx.fake, "list.json"), JSON.stringify({ deployments }));
}

function listed(ctx: Ctx): Listed[] {
  const file = join(ctx.fake, "list.json");
  return existsSync(file)
    ? (JSON.parse(readFileSync(file, "utf8")) as { deployments: Listed[] }).deployments
    : [];
}

/** Points the domain alias at a deployment id, or detaches it (never attached). */
function pointDomain(ctx: Ctx, id: string | null): void {
  const file = join(ctx.fake, "ten-mien");
  if (id) writeFileSync(file, id);
  else rmSync(file, { force: true });
}

function domainId(ctx: Ctx): string | null {
  const file = join(ctx.fake, "ten-mien");
  return existsSync(file) ? readFileSync(file, "utf8").trim() : null;
}

/** The printed list, newest first, as the operator sees it; `holder` is the id the domain points to. */
function listLines(prefix: string, ctx: Ctx, holder: string | null): string[] {
  return [...listed(ctx)]
    .sort((a, b) => b.createdAt - a.createdAt)
    .map(
      (d) =>
        `${prefix}: bản ${d.id} · ${d.url} · commit ${d.meta.onehub_commit.slice(0, 7)} · tạo ${new Date(d.createdAt).toISOString()}${d.id === holder ? " · tên miền đang ở đây" : ""}`,
    );
}

const ask = (prefix: string, appEnv: Env) =>
  `${prefix}: chọn bản chạy tốt gần nhất trong danh sách, rồi gõ: make rollback ENV=${appEnv} BAN=<id>`;

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

  // As in the repository: the link `vercel link` writes is never committed.
  writeFileSync(join(repo, ".gitignore"), ".vercel/\n");
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
      const id = existsSync(join(fake, "ten-mien"))
        ? readFileSync(join(fake, "ten-mien"), "utf8").trim()
        : "";
      const target = listed(ctx).find((d) => d.id === id)?.url ?? "";
      prefix = "/" + (target.replace(/^(?:https?:\/\/)?[^/]+/, "").split("/")[1] ?? "");
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
  // `vercel list --json` gives bare hosts, `vercel deploy` prints `https://host`: the fake list uses bare hosts.
  ctx.host = ctx.base.replace(/^https?:\/\//, "");

  ctx.health["/ban-moi"] = { ok: true, commit: head, env: appEnv, vai: "dat" };
  ctx.health["/ban-cu"] = { ok: true, commit: OLD, env: appEnv, vai: "dat" };
  ctx.health["/ban-thu"] = { ok: true, commit: head, env: "staging", vai: "dat" };
  writeFileSync(join(fake, "deploy-url"), `${ctx.base}/ban-moi\n`);
  setList(ctx, [
    { id: "dpl_cu", path: "ban-cu", createdAt: T0, commit: OLD },
    { id: "dpl_moi", path: "ban-moi", createdAt: T0 + 2 * HOUR, commit: head },
  ]);
  pointDomain(ctx, "dpl_cu");

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

/**
 * The operator's machine: no VERCEL_TOKEN, a signed-in CLI session, and the repository linked by `vercel link` to the
 * project of the env file (`.vercel/project.json`; `link` overrides it, null leaves the directory unlinked).
 */
function onOperatorMachine(
  ctx: Ctx,
  link: Record<string, unknown> | null = {
    projectId: ctx.env["VERCEL_PROJECT_ID"],
    orgId: ctx.env["VERCEL_ORG_ID"],
    settings: {},
  },
): void {
  delete ctx.env["VERCEL_TOKEN"];
  writeFileSync(join(ctx.fake, "phien-dang-nhap"), "");
  if (link) {
    mkdirSync(join(ctx.repo, ".vercel"), { recursive: true });
    writeFileSync(join(ctx.repo, ".vercel", "project.json"), JSON.stringify(link));
  }
}

interface Run {
  code: number;
  stdout: string;
  stderr: string;
  /** Every printed line. */
  all: string[];
  /** The lines that say how the run reaches Vercel. */
  modes: string[];
  /** Every printed line but those. */
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
      const all = stdout.split("\n").filter(Boolean);
      done({
        code: code ?? 1,
        stdout,
        stderr,
        all,
        modes: all.filter((l) => MODE_LINE.test(l)),
        lines: all.filter((l) => !MODE_LINE.test(l)),
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

function expectGreen(ctx: Ctx, appEnv: Env, r: Run, mode: Mode = "khoa"): void {
  expect(r.code, r.stdout + r.stderr).toBe(0);
  expect(r.all).toEqual([
    deployMode(appEnv, mode),
    ...STEPS[appEnv].map((s) => `deploy ${appEnv}: ${s} đạt`),
    `deploy ${appEnv}: xong ${ctx.head.slice(0, 7)}`,
  ]);
  const url = `${ctx.base}/ban-moi`;
  expect(r.vercel).toEqual([
    // Session mode: cau-hinh asks the CLI whether it is signed in, before the migration.
    ...(mode === "phien" ? ["vercel whoami"] : []),
    "vercel pull --yes --environment=production",
    "vercel build --prod",
    `vercel deploy --prebuilt --prod --skip-domain --meta onehub_commit=${ctx.head} --env COMMIT_SHA=${ctx.head}`,
    // Before the promote: the new deployment's id, then the deployment the domain points to, read from the domain.
    `vercel inspect ${ctx.host}/ban-moi --json`,
    `vercel inspect ${ctx.host}/ten-mien --json`,
    `vercel promote ${url} --yes`,
  ]);
  expect(domainId(ctx)).toBe("dpl_moi");
  // The pending migration ran before the first vercel call that builds or deploys.
  const firstVercel = r.calls.findIndex((c) => c.startsWith("vercel ") && c !== "vercel whoami");
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

describe("make deploy — phiên Vercel CLI đã đăng nhập, không VERCEL_TOKEN", () => {
  it("staging xanh qua make: dòng phiên, whoami trước migration, bảy bước đạt", async () => {
    const ctx = await fresh("staging");
    onOperatorMachine(ctx);
    const r = await run(ctx, "make", ["-s", "-f", DEPLOY_MK, "deploy", "ENV=staging"]);
    expectGreen(ctx, "staging", r, "phien");
    expect(r.calls.indexOf("vercel whoami")).toBeLessThan(r.calls.indexOf("psql ap 002_b.sql"));
  });

  it("production thiếu XAC_NHAN_BAN_THAT → đỏ ở cau-hinh, gọi tên cờ, không chạm gì", async () => {
    const ctx = await fresh("production");
    onOperatorMachine(ctx);
    const r = await run(ctx, "make", ["-s", "-f", DEPLOY_MK, "deploy", "ENV=production"]);
    expect(r.code).not.toBe(0);
    expect(r.all).toEqual([
      deployMode("production", "phien"),
      "deploy production: cau-hinh ĐỎ — bản thật bằng phiên Vercel CLI cần xác nhận XAC_NHAN_BAN_THAT=co — gõ lại: make deploy ENV=production XAC_NHAN_BAN_THAT=co",
      "deploy production: DỪNG ở cau-hinh — tên miền không đổi",
    ]);
    expect(r.calls).toEqual([]);
    expect(domainId(ctx)).toBe("dpl_cu");
  });

  it("production có XAC_NHAN_BAN_THAT=co qua make → xanh", async () => {
    const ctx = await fresh("production");
    onOperatorMachine(ctx);
    const r = await run(ctx, "make", [
      "-s",
      "-f",
      DEPLOY_MK,
      "deploy",
      "ENV=production",
      "XAC_NHAN_BAN_THAT=co",
    ]);
    expectGreen(ctx, "production", r, "phien");
  });

  it("có VERCEL_TOKEN thì dùng khoá như CI: không hỏi phiên, không đọc .vercel/project.json, không cần cờ", async () => {
    const ctx = await fresh("production");
    mkdirSync(join(ctx.repo, ".vercel"), { recursive: true });
    writeFileSync(
      join(ctx.repo, ".vercel", "project.json"),
      JSON.stringify({ projectId: "prj_khac", orgId: "team_khac" }),
    );
    const r = await deploy(ctx, "production");
    expectGreen(ctx, "production", r, "khoa");
  });
});

interface RedCase {
  name: string;
  step: string;
  envs?: Env[];
  /** Runs on the operator's machine (onOperatorMachine before arrange); production gets XAC_NHAN_BAN_THAT=co. */
  session?: boolean;
  /** Session mode: cau-hinh reached `vercel whoami` before going red. */
  whoami?: boolean;
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
  // Without VERCEL_TOKEN the run uses the CLI's session: the session cases below cover it.
  ...[...new Set([...REQUIRED.staging, ...REQUIRED.production])]
    .filter((name) => name !== "VERCEL_TOKEN")
    .map((name): RedCase => ({
      name: `thiếu ${name}`,
      step: "cau-hinh",
      envs: (["staging", "production"] as const).filter((e) => REQUIRED[e].includes(name)),
      arrange: (ctx) => {
        delete ctx.env[name];
      },
      reason: () => `thiếu biến ${name}`,
    })),
  {
    name: "phiên: thiếu VERCEL_PROJECT_ID",
    step: "cau-hinh",
    session: true,
    arrange: (ctx) => {
      delete ctx.env["VERCEL_PROJECT_ID"];
    },
    reason: () => "thiếu biến VERCEL_PROJECT_ID",
  },
  {
    name: "phiên: bản thật thiếu XAC_NHAN_BAN_THAT",
    step: "cau-hinh",
    envs: ["production"],
    session: true,
    arrange: (ctx) => {
      delete ctx.env["XAC_NHAN_BAN_THAT"];
    },
    reason: () =>
      "bản thật bằng phiên Vercel CLI cần xác nhận XAC_NHAN_BAN_THAT=co — gõ lại: make deploy ENV=production XAC_NHAN_BAN_THAT=co",
  },
  {
    name: "phiên: bản thật XAC_NHAN_BAN_THAT khác co",
    step: "cau-hinh",
    envs: ["production"],
    session: true,
    arrange: (ctx) => {
      ctx.env["XAC_NHAN_BAN_THAT"] = "yes";
    },
    reason: () => "cần xác nhận XAC_NHAN_BAN_THAT=co",
  },
  {
    name: "phiên: chưa đăng nhập Vercel CLI",
    step: "cau-hinh",
    session: true,
    whoami: true,
    arrange: (ctx) => rmSync(join(ctx.fake, "phien-dang-nhap")),
    reason: () => "chưa đăng nhập Vercel CLI và không có VERCEL_TOKEN",
  },
  {
    name: "phiên: VERCEL_TOKEN rỗng mà chưa đăng nhập",
    step: "cau-hinh",
    session: true,
    whoami: true,
    arrange: (ctx) => {
      ctx.env["VERCEL_TOKEN"] = " ";
      rmSync(join(ctx.fake, "phien-dang-nhap"));
    },
    reason: () => "chưa đăng nhập Vercel CLI và không có VERCEL_TOKEN",
  },
  {
    name: "phiên: thư mục chưa nối dự án Vercel",
    step: "cau-hinh",
    session: true,
    whoami: true,
    arrange: (ctx) => rmSync(join(ctx.repo, ".vercel"), { recursive: true }),
    reason: () => "thư mục chưa nối dự án Vercel (.vercel/project.json) — gõ vercel link",
  },
  {
    name: "phiên: .vercel/project.json không đọc được",
    step: "cau-hinh",
    session: true,
    whoami: true,
    arrange: (ctx) => writeFileSync(join(ctx.repo, ".vercel", "project.json"), "{"),
    reason: () => ".vercel/project.json không đọc được",
  },
  {
    name: "phiên: projectId nối khác VERCEL_PROJECT_ID",
    step: "cau-hinh",
    session: true,
    whoami: true,
    arrange: (ctx) =>
      onOperatorMachine(ctx, { projectId: "prj_khac", orgId: ctx.env["VERCEL_ORG_ID"] }),
    reason: () => "projectId ở .vercel/project.json khác VERCEL_PROJECT_ID — sai dự án",
  },
  {
    name: "phiên: orgId nối khác VERCEL_ORG_ID",
    step: "cau-hinh",
    session: true,
    whoami: true,
    arrange: (ctx) =>
      onOperatorMachine(ctx, { projectId: ctx.env["VERCEL_PROJECT_ID"], orgId: "team_khac" }),
    reason: () => "orgId ở .vercel/project.json khác VERCEL_ORG_ID — sai dự án",
  },
  {
    name: "phiên: cả hai mã nối khác",
    step: "cau-hinh",
    session: true,
    whoami: true,
    arrange: (ctx) => onOperatorMachine(ctx, { projectId: "prj_khac", orgId: "team_khac" }),
    reason: () =>
      "projectId và orgId ở .vercel/project.json khác VERCEL_PROJECT_ID, VERCEL_ORG_ID — sai dự án",
  },
  {
    name: "phiên: vercel pull lỗi",
    step: "dung",
    session: true,
    arrange: (ctx) => writeFileSync(join(ctx.fake, "fail-pull"), ""),
    reason: () => "vercel pull lỗi",
  },
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
        if (c.session) {
          onOperatorMachine(ctx);
          if (appEnv === "production") ctx.env["XAC_NHAN_BAN_THAT"] = "co";
        }
        c.arrange?.(ctx, appEnv);
        const before = applied(ctx);
        const r = await deploy(ctx, appEnv);
        const steps = STEPS[appEnv];
        const at = steps.indexOf(c.step);
        expect(r.code).not.toBe(0);
        // Exactly one line says how the run reaches Vercel, and it comes first.
        expect(r.modes).toEqual([deployMode(appEnv, c.session ? "phien" : "khoa")]);
        expect(r.all[0]).toBe(r.modes[0]);
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
          // Session mode asks the CLI whether it is signed in; nothing else reaches Vercel.
          expect(r.vercel).toEqual(c.session && c.whoami ? ["vercel whoami"] : []);
          expect(r.calls.some((x) => x.startsWith("psql"))).toBe(false);
        }
        expectNoMarker(ctx, r);
      });
    }
  }
});

describe("make deploy — lùi sau gắn tên miền về đúng bản tên miền trỏ tới trước khi gắn", () => {
  for (const appEnv of ["staging", "production"] as const) {
    const P = `deploy ${appEnv}`;
    const redLine = `${P}: kiem-nhanh-ten-mien ĐỎ — vai nối chưa đạt: không nối được`;
    const redAfter = (ctx: Ctx): Health => ({
      ok: true,
      commit: ctx.head,
      env: appEnv,
      vai: "không nối được",
    });
    const stays = "không tự lùi; tên miền vẫn ở bản mới";
    const rollbacks = (r: Run) => r.vercel.filter((v) => v.startsWith("vercel rollback"));

    function expectFirstSixGreen(r: Run): void {
      expect(r.code).not.toBe(0);
      expect(r.all[0]).toBe(deployMode(appEnv, "khoa"));
      expect(r.modes).toHaveLength(1);
      expect(r.lines.slice(0, 6)).toEqual(STEPS[appEnv].slice(0, 6).map((s) => `${P}: ${s} đạt`));
      expect(r.vercel.filter((v) => v.startsWith("vercel promote"))).toHaveLength(1);
    }

    it(`${appEnv}: kiem-nhanh-ten-mien đỏ → lùi đúng một lần về bản tên miền trỏ tới trước khi gắn, đọc lại tên miền`, async () => {
      const ctx = await fresh(appEnv);
      ctx.domainSeq = [redAfter(ctx)];
      const r = await deploy(ctx, appEnv);
      expectFirstSixGreen(r);
      expect(r.lines.slice(6)).toEqual([redLine, `${P}: đã lùi về bản trước`]);
      expect(rollbacks(r)).toEqual(["vercel rollback dpl_cu --yes"]);
      // The alias was read again after the rollback, and points at the recorded id.
      const at = r.vercel.indexOf("vercel rollback dpl_cu --yes");
      expect(r.vercel.slice(at + 1)).toContain(`vercel inspect ${ctx.host}/ten-mien --json`);
      expect(domainId(ctx)).toBe("dpl_cu");
      expectNoMarker(ctx, r);
    });

    it(`${appEnv}: hai bản READY cùng commit (xoay khoá) → về bản đang phục vụ, không về bản hỏng chưa từng gắn`, async () => {
      // Same-commit redeploy (key rotation): ban-truoc serves the domain; ban-hong, newer and with the same commit, is a
      // READY build that failed its check and was never promoted; ban-moi is this deploy.
      const ctx = await fresh(appEnv);
      ctx.health["/ban-truoc"] = { ok: true, commit: ctx.head, env: appEnv, vai: "dat" };
      ctx.health["/ban-hong"] = { ok: true, commit: ctx.head, env: appEnv, vai: "khoá sai" };
      setList(ctx, [
        { id: "dpl_truoc", path: "ban-truoc", createdAt: T0, commit: ctx.head },
        { id: "dpl_hong", path: "ban-hong", createdAt: T0 + HOUR, commit: ctx.head },
        { id: "dpl_moi", path: "ban-moi", createdAt: T0 + 2 * HOUR, commit: ctx.head },
      ]);
      pointDomain(ctx, "dpl_truoc");
      ctx.domainSeq = [redAfter(ctx)];
      const r = await deploy(ctx, appEnv);
      expectFirstSixGreen(r);
      expect(rollbacks(r), "về bản tên miền trỏ tới trước khi gắn, không về bản hỏng").toEqual([
        "vercel rollback dpl_truoc --yes",
      ]);
      expect(domainId(ctx)).toBe("dpl_truoc");
      expect(r.lines.slice(6)).toEqual([redLine, `${P}: đã lùi về bản trước`]);
    });

    it(`${appEnv}: lần gắn đầu (tên miền chưa trỏ bản nào) → DỪNG, in danh sách, hỏi BAN`, async () => {
      const ctx = await fresh(appEnv);
      pointDomain(ctx, null);
      ctx.domainSeq = [redAfter(ctx)];
      const r = await deploy(ctx, appEnv);
      expectFirstSixGreen(r);
      expect(r.lines.slice(6)).toEqual([
        redLine,
        `${P}: lùi bản DỪNG — không đọc được bản tên miền trỏ tới trước khi gắn (lần gắn đầu, hay Vercel không trả lời), ${stays}`,
        ...listLines(P, ctx, "dpl_moi"),
        ask(P, appEnv),
      ]);
      expect(rollbacks(r)).toEqual([]);
      expectNoMarker(ctx, r);
    });

    it(`${appEnv}: không đọc được tên miền → DỪNG, in danh sách, hỏi BAN`, async () => {
      const ctx = await fresh(appEnv);
      writeFileSync(join(ctx.fake, "fail-inspect-ten-mien"), "");
      ctx.domainSeq = [redAfter(ctx)];
      const r = await deploy(ctx, appEnv);
      expectFirstSixGreen(r);
      expect(r.lines.slice(6)).toEqual([
        redLine,
        `${P}: lùi bản DỪNG — không đọc được bản tên miền trỏ tới trước khi gắn (lần gắn đầu, hay Vercel không trả lời), ${stays}`,
        ...listLines(P, ctx, null),
        ask(P, appEnv),
      ]);
      expect(rollbacks(r)).toEqual([]);
    });

    it(`${appEnv}: không đọc được mã bản mới → DỪNG, in danh sách, hỏi BAN`, async () => {
      const ctx = await fresh(appEnv);
      writeFileSync(join(ctx.fake, "fail-inspect-ban-moi"), "");
      ctx.domainSeq = [redAfter(ctx)];
      const r = await deploy(ctx, appEnv);
      expectFirstSixGreen(r);
      expect(r.lines.slice(6)).toEqual([
        redLine,
        `${P}: lùi bản DỪNG — không đọc được mã bản mới, ${stays}`,
        ...listLines(P, ctx, "dpl_moi"),
        ask(P, appEnv),
      ]);
      expect(rollbacks(r)).toEqual([]);
    });

    it(`${appEnv}: bản ghi lại trùng bản mới → DỪNG, không lùi về chính bản hỏng`, async () => {
      const ctx = await fresh(appEnv);
      pointDomain(ctx, "dpl_moi");
      ctx.domainSeq = [redAfter(ctx)];
      const r = await deploy(ctx, appEnv);
      expectFirstSixGreen(r);
      expect(r.lines.slice(6)).toEqual([
        redLine,
        `${P}: lùi bản DỪNG — trước khi gắn, tên miền đã trỏ vào chính bản mới dpl_moi, ${stays}`,
        ...listLines(P, ctx, "dpl_moi"),
        ask(P, appEnv),
      ]);
      expect(rollbacks(r)).toEqual([]);
    });
  }

  const P = "deploy staging";
  const redAfter = (ctx: Ctx): Health => ({
    ok: true,
    commit: ctx.head,
    env: "staging",
    vai: "không nối được",
  });
  const redLine = `${P}: kiem-nhanh-ten-mien ĐỎ — vai nối chưa đạt: không nối được`;

  it("DỪNG mà không đọc được danh sách bản → dòng riêng, vẫn hỏi BAN", async () => {
    const ctx = await fresh("staging");
    pointDomain(ctx, null);
    writeFileSync(join(ctx.fake, "fail-list"), "");
    ctx.domainSeq = [redAfter(ctx)];
    const r = await deploy(ctx, "staging");
    expect(r.code).not.toBe(0);
    expect(r.lines.slice(6)).toEqual([
      redLine,
      `${P}: lùi bản DỪNG — không đọc được bản tên miền trỏ tới trước khi gắn (lần gắn đầu, hay Vercel không trả lời), không tự lùi; tên miền vẫn ở bản mới`,
      `${P}: lùi bản ĐỎ — không đọc được danh sách bản của Vercel`,
      ask(P, "staging"),
    ]);
    expect(r.vercel.some((v) => v.startsWith("vercel rollback"))).toBe(false);
  });

  it("vercel rollback lỗi → ĐỎ, in danh sách, hỏi BAN; không báo đã lùi", async () => {
    const ctx = await fresh("staging");
    writeFileSync(join(ctx.fake, "fail-rollback"), "");
    ctx.domainSeq = [redAfter(ctx)];
    const r = await deploy(ctx, "staging");
    expect(r.code).not.toBe(0);
    expect(r.lines.slice(6)).toEqual([
      redLine,
      `${P}: lùi bản ĐỎ — vercel rollback lỗi (mã 1)`,
      ...listLines(P, ctx, "dpl_moi"),
      ask(P, "staging"),
    ]);
  });

  it("rollback trả 0 mà tên miền không về bản ghi lại → ĐỎ, không báo đã lùi", async () => {
    const ctx = await fresh("staging");
    writeFileSync(join(ctx.fake, "rollback-khong-doi"), "");
    ctx.domainSeq = [redAfter(ctx)];
    const r = await deploy(ctx, "staging");
    expect(r.code).not.toBe(0);
    expect(r.lines.slice(6)).toEqual([
      redLine,
      `${P}: lùi bản ĐỎ — tên miền chưa về bản dpl_cu (đang ở dpl_moi)`,
      ...listLines(P, ctx, "dpl_moi"),
      ask(P, "staging"),
    ]);
    expect(r.lines.some((l) => l.includes("đã lùi"))).toBe(false);
  });

  it("tên miền về bản ghi lại nhưng kiểm nhanh đỏ → ĐỎ, không báo đã lùi", async () => {
    const ctx = await fresh("staging");
    ctx.proto["/ban-cu"] = 200;
    ctx.domainSeq = [redAfter(ctx)];
    const r = await deploy(ctx, "staging");
    expect(r.code).not.toBe(0);
    expect(domainId(ctx)).toBe("dpl_cu");
    expect(r.lines.slice(6)).toEqual([
      redLine,
      `${P}: lùi bản ĐỎ — tên miền đã về bản dpl_cu nhưng kiểm nhanh đỏ: /proto/x trả 200, cần 404`,
      ...listLines(P, ctx, "dpl_cu"),
      ask(P, "staging"),
    ]);
  });
});

describe("make rollback — không BAN thì không đoán", () => {
  const viaMake = (ctx: Ctx, appEnv: Env, ...extra: string[]) =>
    run(ctx, "make", ["-s", "-f", DEPLOY_MK, "rollback", `ENV=${appEnv}`, ...extra]);
  const rollbacks = (r: Run) => r.vercel.filter((v) => v.startsWith("vercel rollback"));

  for (const appEnv of ["staging", "production"] as const) {
    const P = `rollback ${appEnv}`;

    it(`${appEnv}: không BAN → DỪNG, in danh sách và bản tên miền đang ở, hỏi BAN`, async () => {
      const ctx = await fresh(appEnv);
      pointDomain(ctx, "dpl_moi");
      const r = await viaMake(ctx, appEnv);
      expect(r.code).not.toBe(0);
      expect(r.all).toEqual([
        rollbackMode(appEnv, "khoa"),
        `${P}: DỪNG — chưa nêu bản cần lùi về, không đoán`,
        ...listLines(P, ctx, "dpl_moi"),
        ask(P, appEnv),
      ]);
      expect(rollbacks(r)).toEqual([]);
      expect(domainId(ctx)).toBe("dpl_moi");
      expectNoMarker(ctx, r);
    });

    it(`${appEnv}: BAN hợp lệ → lùi đúng một lần, tên miền đọc lại trỏ về BAN, kiểm commit của BAN`, async () => {
      const ctx = await fresh(appEnv);
      pointDomain(ctx, "dpl_moi");
      const r = await viaMake(ctx, appEnv, "BAN=dpl_cu");
      expect(r.code, r.stdout + r.stderr).toBe(0);
      expect(rollbacks(r)).toEqual(["vercel rollback dpl_cu --yes"]);
      const at = r.vercel.indexOf("vercel rollback dpl_cu --yes");
      expect(r.vercel.slice(at + 1)).toEqual([`vercel inspect ${ctx.host}/ten-mien --json`]);
      expect(domainId(ctx)).toBe("dpl_cu");
      expect(ctx.requests.filter((q) => q.path === "/ten-mien/api/v1/health").length).toBe(1);
      expect(r.all).toEqual([
        rollbackMode(appEnv, "khoa"),
        `${P}: tên miền ở bản dpl_cu, chạy ${OLD.slice(0, 7)}`,
      ]);
      expectNoMarker(ctx, r);
    });
  }

  const P = "rollback staging";

  for (const [how, ban] of [
    ["mã không có", "dpl_khong_co"],
    ["url thay cho mã", "URL"],
  ] as const) {
    it(`BAN không có trong danh sách bản production READY (${how}) → DỪNG, không gọi rollback`, async () => {
      const ctx = await fresh("staging");
      pointDomain(ctx, "dpl_moi");
      const name = ban === "URL" ? `${ctx.host}/ban-cu` : ban;
      const r = await viaMake(ctx, "staging", `BAN=${name}`);
      expect(r.code).not.toBe(0);
      expect(r.lines).toEqual([
        `${P}: DỪNG — không thấy bản ${name} trong danh sách bản production READY`,
        ...listLines(P, ctx, "dpl_moi"),
        ask(P, "staging"),
      ]);
      expect(rollbacks(r)).toEqual([]);
    });
  }

  it("BAN là bản tên miền đang trỏ tới → DỪNG, không gọi rollback", async () => {
    const ctx = await fresh("staging");
    pointDomain(ctx, "dpl_moi");
    const r = await viaMake(ctx, "staging", "BAN=dpl_moi");
    expect(r.code).not.toBe(0);
    expect(r.lines).toEqual([
      `${P}: DỪNG — tên miền đã ở bản dpl_moi, không lùi`,
      ...listLines(P, ctx, "dpl_moi"),
      ask(P, "staging"),
    ]);
    expect(rollbacks(r)).toEqual([]);
  });

  it("không đọc được bản tên miền đang trỏ tới → DỪNG, không gọi rollback", async () => {
    const ctx = await fresh("staging");
    pointDomain(ctx, "dpl_moi");
    writeFileSync(join(ctx.fake, "fail-inspect-ten-mien"), "");
    const r = await viaMake(ctx, "staging", "BAN=dpl_cu");
    expect(r.code).not.toBe(0);
    expect(r.lines).toEqual([`${P}: DỪNG — không đọc được bản tên miền đang trỏ tới, không lùi`]);
    expect(rollbacks(r)).toEqual([]);
  });

  it("không đọc được danh sách bản → ĐỎ, không gọi rollback", async () => {
    const ctx = await fresh("staging");
    writeFileSync(join(ctx.fake, "fail-list"), "");
    const r = await viaMake(ctx, "staging", "BAN=dpl_cu");
    expect(r.code).not.toBe(0);
    expect(r.lines).toEqual([`${P}: ĐỎ — không đọc được danh sách bản của Vercel`]);
    expect(rollbacks(r)).toEqual([]);
  });

  it("vercel rollback lỗi → ĐỎ", async () => {
    const ctx = await fresh("staging");
    pointDomain(ctx, "dpl_moi");
    writeFileSync(join(ctx.fake, "fail-rollback"), "");
    const r = await viaMake(ctx, "staging", "BAN=dpl_cu");
    expect(r.code).not.toBe(0);
    expect(r.lines).toEqual([`${P}: ĐỎ — vercel rollback lỗi (mã 1)`]);
  });

  it("rollback trả 0 mà tên miền không về BAN → ĐỎ", async () => {
    const ctx = await fresh("staging");
    pointDomain(ctx, "dpl_moi");
    writeFileSync(join(ctx.fake, "rollback-khong-doi"), "");
    const r = await viaMake(ctx, "staging", "BAN=dpl_cu");
    expect(r.code).not.toBe(0);
    expect(r.lines).toEqual([`${P}: ĐỎ — tên miền chưa về bản dpl_cu (đang ở dpl_moi)`]);
  });

  it("tên miền sau khi lùi đỏ thì báo đỏ", async () => {
    const ctx = await fresh("staging");
    pointDomain(ctx, "dpl_moi");
    ctx.proto["/ban-cu"] = 200;
    const r = await viaMake(ctx, "staging", "BAN=dpl_cu");
    expect(r.code).not.toBe(0);
    expect(r.lines).toEqual([`${P}: kiem-nhanh-ten-mien ĐỎ — /proto/x trả 200, cần 404`]);
  });

  it("thiếu biến thì đỏ gọi tên biến, không gọi vercel", async () => {
    const ctx = await fresh("production");
    delete ctx.env["VERCEL_PROJECT_ID"];
    const r = await rollback(ctx, "production");
    expect(r.code).not.toBe(0);
    expect(r.all).toEqual([
      rollbackMode("production", "khoa"),
      "rollback production: ĐỎ — thiếu biến VERCEL_PROJECT_ID",
    ]);
    expect(r.vercel).toEqual([]);
  });
});

describe("make rollback — phiên Vercel CLI đã đăng nhập, không VERCEL_TOKEN", () => {
  const viaMake = (ctx: Ctx, appEnv: Env, ...extra: string[]) =>
    run(ctx, "make", ["-s", "-f", DEPLOY_MK, "rollback", `ENV=${appEnv}`, ...extra]);
  const flagLine =
    "rollback production: ĐỎ — bản thật bằng phiên Vercel CLI cần xác nhận XAC_NHAN_BAN_THAT=co — gõ lại: make rollback ENV=production BAN=dpl_cu XAC_NHAN_BAN_THAT=co";

  it("staging: BAN hợp lệ → whoami rồi lùi đúng một lần như dùng khoá", async () => {
    const ctx = await fresh("staging");
    onOperatorMachine(ctx);
    pointDomain(ctx, "dpl_moi");
    const r = await viaMake(ctx, "staging", "BAN=dpl_cu");
    expect(r.code, r.stdout + r.stderr).toBe(0);
    expect(r.all).toEqual([
      rollbackMode("staging", "phien"),
      `rollback staging: tên miền ở bản dpl_cu, chạy ${OLD.slice(0, 7)}`,
    ]);
    expect(r.vercel[0]).toBe("vercel whoami");
    expect(r.vercel.filter((v) => v.startsWith("vercel rollback"))).toEqual([
      "vercel rollback dpl_cu --yes",
    ]);
    expect(domainId(ctx)).toBe("dpl_cu");
    expectNoMarker(ctx, r);
  });

  it("production thiếu XAC_NHAN_BAN_THAT → ĐỎ gọi tên cờ, không gọi vercel", async () => {
    const ctx = await fresh("production");
    onOperatorMachine(ctx);
    pointDomain(ctx, "dpl_moi");
    const r = await viaMake(ctx, "production", "BAN=dpl_cu");
    expect(r.code).not.toBe(0);
    expect(r.all).toEqual([rollbackMode("production", "phien"), flagLine]);
    expect(r.vercel).toEqual([]);
    expect(domainId(ctx)).toBe("dpl_moi");
  });

  it("production có XAC_NHAN_BAN_THAT=co qua make → lùi", async () => {
    const ctx = await fresh("production");
    onOperatorMachine(ctx);
    pointDomain(ctx, "dpl_moi");
    const r = await viaMake(ctx, "production", "BAN=dpl_cu", "XAC_NHAN_BAN_THAT=co");
    expect(r.code, r.stdout + r.stderr).toBe(0);
    expect(r.all).toEqual([
      rollbackMode("production", "phien"),
      `rollback production: tên miền ở bản dpl_cu, chạy ${OLD.slice(0, 7)}`,
    ]);
    expect(domainId(ctx)).toBe("dpl_cu");
  });

  it("chưa đăng nhập → ĐỎ, không đọc danh sách, không lùi", async () => {
    const ctx = await fresh("staging");
    onOperatorMachine(ctx);
    rmSync(join(ctx.fake, "phien-dang-nhap"));
    pointDomain(ctx, "dpl_moi");
    const r = await viaMake(ctx, "staging", "BAN=dpl_cu");
    expect(r.code).not.toBe(0);
    expect(r.all).toEqual([
      rollbackMode("staging", "phien"),
      "rollback staging: ĐỎ — chưa đăng nhập Vercel CLI và không có VERCEL_TOKEN — gõ vercel login, hay nạp VERCEL_TOKEN",
    ]);
    expect(r.vercel).toEqual(["vercel whoami"]);
    expect(domainId(ctx)).toBe("dpl_moi");
  });

  it("thư mục nối dự án khác VERCEL_PROJECT_ID → ĐỎ, không lùi", async () => {
    const ctx = await fresh("staging");
    onOperatorMachine(ctx, { projectId: "prj_khac", orgId: ctx.env["VERCEL_ORG_ID"] });
    pointDomain(ctx, "dpl_moi");
    const r = await viaMake(ctx, "staging", "BAN=dpl_cu");
    expect(r.code).not.toBe(0);
    expect(r.all).toEqual([
      rollbackMode("staging", "phien"),
      "rollback staging: ĐỎ — projectId ở .vercel/project.json khác VERCEL_PROJECT_ID — sai dự án; gõ vercel link, chọn dự án của staging, hay nạp đúng tệp biến",
    ]);
    expect(r.vercel).toEqual(["vercel whoami"]);
    expect(domainId(ctx)).toBe("dpl_moi");
    expectNoMarker(ctx, r);
  });
});

describe("make smoke", () => {
  it("đạt trên tên miền đang chạy HEAD, đỏ khi commit khác", async () => {
    const ctx = await fresh("staging");
    pointDomain(ctx, "dpl_moi");
    const ok = await run(ctx, "make", ["-s", "-f", DEPLOY_MK, "smoke", "ENV=staging"]);
    expect(ok.code, ok.stdout + ok.stderr).toBe(0);
    expect(ok.lines).toEqual([`smoke staging: đạt ${ctx.head.slice(0, 7)}`]);
    pointDomain(ctx, "dpl_cu");
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
