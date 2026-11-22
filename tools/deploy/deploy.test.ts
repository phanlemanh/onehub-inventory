// make deploy / make rollback with a fake `vercel` and a fake `psql` first on PATH, a stub isolation command and a fake
// health server (row moi-truong-thu-va-ban-that, E1–E4). The matrix of red steps is the header of
// _acceptance/moi-truong-thu-va-ban-that/evals.yaml: each ENV × each red step on its own.
// Row dat-khoa-mot-lenh (E4–E7) added two steps — vai-dang-nhap and bien — a fake Vercel API on the same server, and
// the cells of the header of _acceptance/dat-khoa-mot-lenh/evals.yaml.
import { spawn, spawnSync } from "node:child_process";
import {
  appendFileSync,
  chmodSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";
import { join, resolve } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { tempDir } from "../../tests/support/temp-dir";
import { confirmedKeys, refusedItems, STEPS as STEPS_CODE } from "./len-ban.mjs";
import { parseVerifier, scramKeys, scramVerifier, serverCheck } from "./scram.mjs";

const HERE = resolve(__dirname);
const LEN_BAN = join(HERE, "len-ban.mjs");
const LUI_BAN = join(HERE, "lui-ban.mjs");
const KIEM_NHANH = join(HERE, "kiem-nhanh.mjs");
const DEPLOY_MK = resolve(HERE, "../../mk/deploy.mk");

type Env = "staging" | "production";
/** The step order of make deploy, read from the code itself (row bien-do-sau-xoay-mat-khau): no copy to drift. */
const STEPS = STEPS_CODE as Record<Env, string[]>;
const COMMON = [
  "VERCEL_TOKEN",
  "VERCEL_ORG_ID",
  "VERCEL_PROJECT_ID",
  "MIGRATE_DATABASE_URL",
  "LOGIN_DB_PASSWORD",
  "AUTH_SECRET",
  "RESEND_API_KEY",
  "MAIL_FROM",
  "APP_URL",
];
const REQUIRED: Record<Env, string[]> = {
  staging: COMMON,
  production: [...COMMON, "STAGING_APP_URL"],
};
const SECRETS = [
  "VERCEL_TOKEN",
  "VERCEL_ORG_ID",
  "VERCEL_PROJECT_ID",
  "MIGRATE_DATABASE_URL",
  "AUTH_SECRET",
  "RESEND_API_KEY",
];
/** The owner's Session pooler string of the fake target; its password is a marker. */
const MIGRATE_URL =
  "postgresql://postgres.abcdefghijklmnopqrst:moc-bi-mat-MIGRATE_DATABASE_URL@pooler.example.test:5432/postgres";
/** The login role's password: letters and digits, so it cannot carry the moc-bi-mat- marker; checked on its own. */
const LOGIN_PW = "MocBiMatLoginPassword0123456789";
const FORBIDDEN = ["MIGRATE_DATABASE_URL", "LOGIN_CODE_OUTBOX", "NEXT_PUBLIC_E2E_BUTTON_RECORD"];
const OLD = "0123456789abcdef0123456789abcdef01234567";

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
if (has("fail-" + cmd)) { console.error("fake vercel " + cmd + " failed"); process.exit(1); }
const bare = (u) => String(u).replace(/^https?:\\/\\//, "").replace(/\\/+$/, "");
const all = () => (has("list.json") ? JSON.parse(read("list.json")).deployments : []);
const find = (x) => {
  if (/\\/ten-mien$/.test(bare(x))) return has("ten-mien") ? all().find((d) => d.id === read("ten-mien").trim()) : undefined;
  return all().find((d) => d.id === x || bare(d.url) === bare(x));
};
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
if (/^alter role quy_hang_login password /.test(sql)) {
  fs.writeFileSync(path.join(dir, "vai.sql"), sql);
  fs.writeFileSync(path.join(dir, "vai.argv"), a.join(" "));
  fs.appendFileSync(path.join(dir, "calls.log"), Date.now() + " psql vai\\n");
  if (fs.existsSync(path.join(dir, "vai-chua-co"))) { console.error('psql:<stdin>:1: ERROR:  role "quy_hang_login" does not exist'); process.exit(3); }
  if (fs.existsSync(path.join(dir, "vai-in-gia-tri"))) {
    console.error("psql: error: connection to " + a[a.indexOf("-d") + 1] + " failed for password " + (process.env.LOGIN_DB_PASSWORD || ""));
    process.exit(2);
  }
  process.exit(0);
}
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
  /** Calls to the fake Vercel API, in order, with the parsed body of each write. */
  api: { t: number; method: string; path: string; auth: string; body: unknown }[];
  /** Variable names the fake Vercel project already holds, and the status its API answers with. */
  vercelEnvs: string[];
  apiStatus: number;
  /**
   * Row bien-vercel-tu-choi: the reply to one call, when a case sets it — a string body is sent raw (not JSON). Unset,
   * the fake answers in the documented shape: GET 200 `{ envs }`, POST 201 `{ created: <the six posted>, failed: [] }`.
   */
  vercelReply: { get?: Reply; post?: Reply };
  /** Every body the fake Vercel API sent, in order. */
  served: { method: string; text: string }[];
}

interface Reply {
  status: number;
  body: unknown;
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
    api: [],
    vercelEnvs: [],
    apiStatus: 200,
    vercelReply: {},
    served: [],
  };
  const server = createServer((req, res) => {
    const path = req.url ?? "/";
    ctx.requests.push({ t: Date.now(), path });
    if (path.startsWith("/vercel-api/")) {
      let text = "";
      req.on("data", (b) => (text += b));
      req.on("end", () => {
        const t = Date.now();
        const method = req.method ?? "GET";
        const bare = path.slice("/vercel-api".length);
        ctx.api.push({
          t,
          method,
          path: bare,
          auth: String(req.headers["authorization"] ?? ""),
          body: text ? JSON.parse(text) : undefined,
        });
        // The log names no id: ids are redacted like secrets, and calls.log is checked for markers.
        appendFileSync(
          join(fake, "calls.log"),
          `${t} api ${method} ${bare.split("?")[0].replace(/projects\/[^/]+/, "projects/<id>")}\n`,
        );
        res.setHeader("content-type", "application/json");
        const send = (status: number, payload: unknown) => {
          const out = typeof payload === "string" ? payload : JSON.stringify(payload);
          ctx.served.push({ method, text: out });
          res.statusCode = status;
          res.end(out);
        };
        if (ctx.apiStatus !== 200) return send(ctx.apiStatus, { error: { code: "forbidden" } });
        const set = method === "GET" ? ctx.vercelReply.get : ctx.vercelReply.post;
        if (set) return send(set.status, set.body);
        if (method === "GET") return send(200, { envs: ctx.vercelEnvs.map((key) => ({ key })) });
        const posted = (text ? JSON.parse(text) : []) as VercelVar[];
        send(201, {
          created: posted.map(({ key, type, value, target }) => ({ key, type, value, target })),
          failed: [],
        });
      });
      return;
    }
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
    VERCEL_API_URL: `${ctx.base}/vercel-api`,
    MIGRATE_DATABASE_URL: MIGRATE_URL,
    LOGIN_DB_PASSWORD: LOGIN_PW,
    AUTH_SECRET: "moc-bi-mat-AUTH_SECRET",
    RESEND_API_KEY: "moc-bi-mat-RESEND_API_KEY",
    MAIL_FROM: "OneHub Inventory <no-reply@onehub.center>",
    APP_URL: `${ctx.base}/ten-mien`,
  };
  if (appEnv === "production") ctx.env["STAGING_APP_URL"] = `${ctx.base}/ban-thu`;
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

/** The first secret value found in `text`, named; null when none. Every secret of the fixture is `moc-bi-mat-<NAME>`. */
function markerLeak(text: string): string | null {
  for (const name of SECRETS)
    if (text.includes(`moc-bi-mat-${name}`)) return `giá trị của ${name} lộ ra`;
  if (text.includes("moc-bi-mat-")) return "giá trị bí mật lộ ra";
  if (text.includes(LOGIN_PW)) return "giá trị của LOGIN_DB_PASSWORD lộ ra";
  return null;
}

function runText(r: Run): string {
  return `${r.stdout}\n${r.stderr}\n${r.calls.join("\n")}`;
}

function expectNoMarker(_ctx: Ctx, r: Run): void {
  expect(markerLeak(runText(r))).toBeNull();
}

/** How many times the fake psql received the statement that sets the login role's password. */
function vaiCalls(r: Run): number {
  return r.calls.filter((c) => c === "psql vai").length;
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
    // Before the promote: the new deployment's id, then the deployment the domain points to, read from the domain.
    `vercel inspect ${ctx.host}/ban-moi --json`,
    `vercel inspect ${ctx.host}/ten-mien --json`,
    `vercel promote ${url} --yes`,
  ]);
  expect(domainId(ctx)).toBe("dpl_moi");
  // The pending migration ran before the first vercel call.
  const firstVercel = r.calls.findIndex((c) => c.startsWith("vercel "));
  const apply = r.calls.indexOf("psql ap 002_b.sql");
  expect(apply).toBeGreaterThanOrEqual(0);
  expect(apply).toBeLessThan(firstVercel);
  expect(applied(ctx)).toEqual(["001_a.sql", "002_b.sql"]);
  // Row bien-do-sau-xoay-mat-khau: migrations, then the variables to Vercel, then the login role's password (exactly
  // once), then the first vercel call — so a Vercel failure never changes the password.
  const post = r.calls.indexOf("api POST /v10/projects/<id>/env");
  const vai = r.calls.indexOf("psql vai");
  expect(post).toBeGreaterThan(apply);
  expect(vai).toBeGreaterThan(post);
  expect(vai).toBeLessThan(firstVercel);
  expect(vaiCalls(r)).toBe(1);
  expect(ctx.api.map((c) => `${c.method} ${c.path}`)).toEqual([
    `GET /v9/projects/moc-bi-mat-VERCEL_PROJECT_ID/env?teamId=moc-bi-mat-VERCEL_ORG_ID`,
    `POST /v10/projects/moc-bi-mat-VERCEL_PROJECT_ID/env?upsert=true&teamId=moc-bi-mat-VERCEL_ORG_ID`,
  ]);
  expectNoMarker(ctx, r);
}

describe("make deploy — green", () => {
  for (const appEnv of ["staging", "production"] as const) {
    it(`${appEnv} xanh qua make: chín bước đạt, vercel đúng thứ tự, migration trước vercel`, async () => {
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
  // Row dat-khoa-mot-lenh: the cells of the header of _acceptance/dat-khoa-mot-lenh/evals.yaml.
  {
    name: "LOGIN_DB_PASSWORD ngắn",
    step: "cau-hinh",
    arrange: (ctx) => {
      ctx.env["LOGIN_DB_PASSWORD"] = "abc";
    },
    reason: () => "LOGIN_DB_PASSWORD phải là chữ và số, từ 24 ký tự",
  },
  {
    name: "LOGIN_DB_PASSWORD có ký tự đặc biệt",
    step: "cau-hinh",
    arrange: (ctx) => {
      ctx.env["LOGIN_DB_PASSWORD"] = "MocBiMatLoginPassword01234@";
    },
    reason: () => "LOGIN_DB_PASSWORD phải là chữ và số, từ 24 ký tự",
  },
  {
    name: "MIGRATE_DATABASE_URL không đọc được",
    step: "cau-hinh",
    arrange: (ctx) => {
      ctx.env["MIGRATE_DATABASE_URL"] = "moc-bi-mat-MIGRATE_DATABASE_URL";
    },
    reason: () => "MIGRATE_DATABASE_URL không đọc được",
  },
  {
    name: "vai đăng nhập chưa có",
    step: "vai-dang-nhap",
    arrange: (ctx) => writeFileSync(join(ctx.fake, "vai-chua-co"), ""),
    reason: () => 'không đặt được mật khẩu vai đăng nhập: role "quy_hang_login" does not exist',
  },
  {
    name: "psql in chuỗi nối và mật khẩu ra rồi lỗi",
    step: "vai-dang-nhap",
    arrange: (ctx) => writeFileSync(join(ctx.fake, "vai-in-gia-tri"), ""),
    reason: () =>
      "không đặt được mật khẩu vai đăng nhập: psql: error: connection to *** failed for password ***",
  },
  ...FORBIDDEN.map((name): RedCase => ({
    name: `dự án Vercel có biến cấm ${name}`,
    step: "bien",
    arrange: (ctx) => {
      ctx.vercelEnvs = ["APP_URL", name];
    },
    reason: () => `dự án Vercel đang có biến cấm ${name}`,
  })),
  {
    name: "Vercel trả 403",
    step: "bien",
    arrange: (ctx) => {
      ctx.apiStatus = 403;
    },
    reason: () => "Vercel trả 403",
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
        // Rows dat-khoa-mot-lenh and bien-do-sau-xoay-mat-khau, by position in the order: a step red before bien
        // writes nothing to the Vercel project; before the build, no vercel command at all; before vai-dang-nhap, no
        // password is set.
        if (at < steps.indexOf("bien"))
          expect(ctx.api.some((c) => c.method === "POST")).toBe(false);
        if (at < steps.indexOf("dung")) expect(r.vercel).toEqual([]);
        if (at < steps.indexOf("vai-dang-nhap")) expect(vaiCalls(r)).toBe(0);
        expectNoMarker(ctx, r);
      });
    }
  }
});

// Lines before the domain check: every step but the last, the same count in both environments.
const AT_DOMAIN_CHECK = STEPS.staging.indexOf("kiem-nhanh-ten-mien");

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
      expect(r.lines.slice(0, AT_DOMAIN_CHECK)).toEqual(
        STEPS[appEnv].slice(0, AT_DOMAIN_CHECK).map((s) => `${P}: ${s} đạt`),
      );
      expect(r.vercel.filter((v) => v.startsWith("vercel promote"))).toHaveLength(1);
    }

    it(`${appEnv}: kiem-nhanh-ten-mien đỏ → lùi đúng một lần về bản tên miền trỏ tới trước khi gắn, đọc lại tên miền`, async () => {
      const ctx = await fresh(appEnv);
      ctx.domainSeq = [redAfter(ctx)];
      const r = await deploy(ctx, appEnv);
      expectFirstSixGreen(r);
      expect(r.lines.slice(AT_DOMAIN_CHECK)).toEqual([redLine, `${P}: đã lùi về bản trước`]);
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
      expect(r.lines.slice(AT_DOMAIN_CHECK)).toEqual([redLine, `${P}: đã lùi về bản trước`]);
    });

    it(`${appEnv}: lần gắn đầu (tên miền chưa trỏ bản nào) → DỪNG, in danh sách, hỏi BAN`, async () => {
      const ctx = await fresh(appEnv);
      pointDomain(ctx, null);
      ctx.domainSeq = [redAfter(ctx)];
      const r = await deploy(ctx, appEnv);
      expectFirstSixGreen(r);
      expect(r.lines.slice(AT_DOMAIN_CHECK)).toEqual([
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
      expect(r.lines.slice(AT_DOMAIN_CHECK)).toEqual([
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
      expect(r.lines.slice(AT_DOMAIN_CHECK)).toEqual([
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
      expect(r.lines.slice(AT_DOMAIN_CHECK)).toEqual([
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
    expect(r.lines.slice(AT_DOMAIN_CHECK)).toEqual([
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
    expect(r.lines.slice(AT_DOMAIN_CHECK)).toEqual([
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
    expect(r.lines.slice(AT_DOMAIN_CHECK)).toEqual([
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
    expect(r.lines.slice(AT_DOMAIN_CHECK)).toEqual([
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
      expect(r.lines).toEqual([
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
      expect(r.lines).toEqual([`${P}: tên miền ở bản dpl_cu, chạy ${OLD.slice(0, 7)}`]);
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

// ── Row dat-khoa-mot-lenh: E4 (the login role's password), E5 (the variables pushed to Vercel), E6 (bien red) ──────

/** A finding when the statement sent to Postgres holds the password itself; null when it does not. */
function sqlLeak(sql: string, password: string): string | null {
  return sql.includes(password) ? "câu SQL chứa mật khẩu trần" : null;
}

/** The six variables the bien step must write, with their Vercel type. */
const VERCEL_EXPECTED: Record<string, string> = {
  DATABASE_URL: "encrypted",
  AUTH_SECRET: "encrypted",
  RESEND_API_KEY: "encrypted",
  MAIL_FROM: "plain",
  APP_URL: "plain",
  APP_ENV: "plain",
};

interface VercelVar {
  key: string;
  value: string;
  type: string;
  target: string[];
}

/** Findings of a POST body against the six variables: missing, extra, wrong type or target. */
function vercelBodyFindings(body: VercelVar[]): string[] {
  const out: string[] = [];
  const keys = body.map((v) => v.key);
  for (const k of Object.keys(VERCEL_EXPECTED))
    if (!keys.includes(k)) out.push(`thiếu biến Vercel: ${k}`);
  for (const v of body) {
    if (!(v.key in VERCEL_EXPECTED)) out.push(`thừa biến Vercel: ${v.key}`);
    else if (v.type !== VERCEL_EXPECTED[v.key]) out.push(`sai kiểu ${v.key}: ${v.type}`);
    if (JSON.stringify(v.target) !== '["production"]') out.push(`sai môi trường ${v.key}`);
  }
  return out;
}

const RFC7677 = {
  salt: "W22ZaJ0SNY7soEsUEjb6gQ==",
  authMessage:
    "n=user,r=rOprNGfwEbeRWgbNEkqO," +
    "r=rOprNGfwEbeRWgbNEkqO%hvYDpWUa2RaTCAfuxFIlj)hNlF$k0,s=W22ZaJ0SNY7soEsUEjb6gQ==,i=4096," +
    "c=biws,r=rOprNGfwEbeRWgbNEkqO%hvYDpWUa2RaTCAfuxFIlj)hNlF$k0",
  clientProof: "dHzbZapWIk4jUhN+Ute9ytag9zjfMHgsqmmiz7AndVQ=",
  serverSignature: "6rriTRBi23WpRR/wtup+mMhUZUn/dB5nLTJRsjl95G4=",
};

describe("E4 · mật khẩu vai đăng nhập đặt bằng dạng băm SCRAM", () => {
  it("E4 · dạng băm chấm như máy chủ Postgres trên vector thử RFC 7677", () => {
    const v = scramVerifier("pencil", { salt: Buffer.from(RFC7677.salt, "base64") });
    const r = serverCheck(v, RFC7677.authMessage, RFC7677.clientProof);
    expect(r.ok).toBe(true);
    expect(r.serverSignature).toBe(RFC7677.serverSignature);
    // Control: the same proof against another password's verifier is refused.
    const other = scramVerifier("pencil2", { salt: Buffer.from(RFC7677.salt, "base64") });
    expect(serverCheck(other, RFC7677.authMessage, RFC7677.clientProof).ok).toBe(false);
  });

  for (const appEnv of ["staging", "production"] as const) {
    it(`E4 · ${appEnv}: câu gửi psql là dạng băm của LOGIN_DB_PASSWORD, không có mật khẩu trần`, async () => {
      const ctx = await fresh(appEnv);
      const r = await deploy(ctx, appEnv);
      expect(r.code, r.stdout + r.stderr).toBe(0);
      const sql = readFileSync(join(ctx.fake, "vai.sql"), "utf8");
      expect(sql).toMatch(/^alter role quy_hang_login password 'SCRAM-SHA-256\$4096:[^']+';\n$/);
      expect(sqlLeak(sql, LOGIN_PW)).toBeNull();
      expect(readFileSync(join(ctx.fake, "vai.argv"), "utf8")).not.toContain(LOGIN_PW);
      // The verifier is the one of LOGIN_DB_PASSWORD: recomputed from its own salt, both keys match.
      const v = parseVerifier(sql.match(/'([^']+)'/)![1]!)!;
      const keys = scramKeys(LOGIN_PW, v.salt, v.iterations);
      expect(keys.storedKey.equals(v.storedKey)).toBe(true);
      expect(keys.serverKey.equals(v.serverKey)).toBe(true);
    });
  }

  it("E4 · chiều đỏ: câu SQL có mật khẩu trần thì hàm đo bắt", () => {
    const sound = `alter role quy_hang_login password '${scramVerifier(LOGIN_PW)}';\n`;
    expect(sqlLeak(sound, LOGIN_PW)).toBeNull();
    expect(sqlLeak(`${sound}-- ${LOGIN_PW}\n`, LOGIN_PW)).toBe("câu SQL chứa mật khẩu trần");
  });
});

describe("E5 · sáu biến đẩy sang dự án Vercel trước khi dựng", () => {
  for (const appEnv of ["staging", "production"] as const) {
    it(`E5 · ${appEnv}: một lần đọc, một lần ghi đè, đúng sáu biến, chuỗi nối của vai đăng nhập`, async () => {
      const ctx = await fresh(appEnv);
      const r = await deploy(ctx, appEnv);
      expect(r.code, r.stdout + r.stderr).toBe(0);
      expect(ctx.api.map((c) => c.method)).toEqual(["GET", "POST"]);
      expect(ctx.api.every((c) => c.auth === "Bearer moc-bi-mat-VERCEL_TOKEN")).toBe(true);
      const body = ctx.api[1]!.body as VercelVar[];
      expect(body).toHaveLength(6);
      expect(vercelBodyFindings(body)).toEqual([]);
      const value = Object.fromEntries(body.map((v) => [v.key, v.value]));
      const db = new URL(value["DATABASE_URL"]!);
      const owner = new URL(MIGRATE_URL);
      expect(decodeURIComponent(db.username)).toBe("quy_hang_login.abcdefghijklmnopqrst");
      expect(decodeURIComponent(db.password)).toBe(LOGIN_PW);
      expect([db.protocol, db.hostname, db.port, db.pathname]).toEqual([
        owner.protocol,
        owner.hostname,
        owner.port,
        owner.pathname,
      ]);
      expect(value).toMatchObject({
        AUTH_SECRET: "moc-bi-mat-AUTH_SECRET",
        RESEND_API_KEY: "moc-bi-mat-RESEND_API_KEY",
        MAIL_FROM: "OneHub Inventory <no-reply@onehub.center>",
        APP_URL: `${ctx.base}/ten-mien`,
        APP_ENV: appEnv,
      });
      // Written before the first vercel call (the build pulls them).
      const firstVercel = r.calls.findIndex((c) => c.startsWith("vercel "));
      expect(r.calls.indexOf("api POST /v10/projects/<id>/env")).toBeLessThan(firstVercel);
      expectNoMarker(ctx, r);
    });
  }

  it("E5 · chiều đỏ: thân ghi đè thiếu một biến thì hàm so bắt", async () => {
    const ctx = await fresh("staging");
    await deploy(ctx, "staging");
    const body = ctx.api[1]!.body as VercelVar[];
    expect(vercelBodyFindings(body)).toEqual([]);
    expect(vercelBodyFindings(body.filter((v) => v.key !== "AUTH_SECRET"))).toEqual([
      "thiếu biến Vercel: AUTH_SECRET",
    ]);
  });
});

describe("E6 · bước bien đỏ thì không ghi gì và không dựng", () => {
  const cases: { name: string; arrange: (ctx: Ctx) => void; line: string; get: number }[] = [
    ...FORBIDDEN.map((name) => ({
      name: `biến cấm ${name}`,
      arrange: (ctx: Ctx) => {
        ctx.vercelEnvs = [name];
      },
      line: `bien ĐỎ — dự án Vercel đang có biến cấm ${name}`,
      get: 1,
    })),
    {
      name: "Vercel trả 403",
      arrange: (ctx: Ctx) => {
        ctx.apiStatus = 403;
      },
      line: "bien ĐỎ — Vercel trả 403",
      get: 1,
    },
  ];
  for (const c of cases) {
    it(`E6 · ${c.name}: dòng đỏ ghim, 0 lần ghi, 0 lần gọi vercel, tên miền không đổi`, async () => {
      const ctx = await fresh("staging");
      c.arrange(ctx);
      const r = await deploy(ctx, "staging");
      expect(r.code).not.toBe(0);
      expect(r.lines).toContain(`deploy staging: ${c.line}`);
      expect(r.lines.at(-1)).toBe("deploy staging: DỪNG ở bien — tên miền không đổi");
      expect(ctx.api.filter((x) => x.method === "GET")).toHaveLength(c.get);
      expect(ctx.api.filter((x) => x.method === "POST")).toHaveLength(0);
      expect(r.vercel).toEqual([]);
      expect(domainId(ctx)).toBe("dpl_cu");
    });
  }

  it("E6 · đối chứng dương: cùng máy giả, không biến cấm, lần ghi trả 201 đủ sáu → bien đạt", async () => {
    const ctx = await fresh("staging");
    ctx.vercelEnvs = ["APP_URL", "DATABASE_URL"];
    const r = await deploy(ctx, "staging");
    expect(r.lines).toContain("deploy staging: bien đạt");
    expect(r.code).toBe(0);
  });
});

describe("make cach-ly-dich dựng chuỗi vai đăng nhập như lệnh đưa bản lên", () => {
  it("--login-url in chuỗi vai đăng nhập; thiếu mật khẩu thì thoát 1 và không in gì ra đầu ra chuẩn", async () => {
    const ctx = await fresh("staging");
    const ok = await run(ctx, "node", [LEN_BAN, "--login-url"]);
    expect(ok.code).toBe(0);
    const u = new URL(ok.stdout);
    expect(decodeURIComponent(u.username)).toBe("quy_hang_login.abcdefghijklmnopqrst");
    expect(decodeURIComponent(u.password)).toBe(LOGIN_PW);
    ctx.env["LOGIN_DB_PASSWORD"] = "";
    const red = await run(ctx, "node", [LEN_BAN, "--login-url"]);
    expect(red.code).toBe(1);
    expect(red.stdout).toBe("");
  });
});

// ── Row bien-vercel-tu-choi: the bien step reads Vercel's replies (E1–E6 of _acceptance/bien-vercel-tu-choi) ─────────

/** The six variable names in the order the bien step writes them. */
const SIX = Object.keys(VERCEL_EXPECTED);

/** The body the fake Vercel API last sent for `method`, parsed; undefined when it sent none. */
function lastServed(ctx: Ctx, method: string): unknown {
  const s = ctx.served.filter((x) => x.method === method).at(-1);
  return s ? JSON.parse(s.text) : undefined;
}

describe("E5 · Vercel trả đúng khuôn tài liệu thì bước bien đạt", () => {
  for (const appEnv of ["staging", "production"] as const) {
    it(`E5 · ${appEnv}: lần ghi trả 201, created đủ sáu, failed rỗng → bien đạt, chín bước xanh`, async () => {
      const ctx = await fresh(appEnv);
      const r = await deploy(ctx, appEnv);
      expectGreen(ctx, appEnv, r);
      const reply = lastServed(ctx, "POST") as { created: VercelVar[]; failed: unknown[] };
      expect(reply.failed).toEqual([]);
      expect(reply.created.map((v) => v.key)).toEqual(SIX);
      expectNoMarker(ctx, r);
    });
  }
});

/** The six variables as the fake confirms them, keyed like the POST body. */
function createdSix(keys: string[] = SIX): { key: string; type: string; target: string[] }[] {
  return keys.map((key) => ({ key, type: VERCEL_EXPECTED[key]!, target: ["production"] }));
}

/** A red bien case: the line, the stop, no build, the domain unchanged, no value printed. */
async function expectBienRed(
  appEnv: Env,
  arrange: (ctx: Ctx) => void,
  reason: string,
  methods: string[],
) {
  const ctx = await fresh(appEnv);
  arrange(ctx);
  const r = await deploy(ctx, appEnv);
  expect(r.code).not.toBe(0);
  expect(r.lines).toContain(`deploy ${appEnv}: bien ĐỎ — ${reason}`);
  expect(r.lines.at(-1)).toBe(`deploy ${appEnv}: DỪNG ở bien — tên miền không đổi`);
  expect(ctx.api.map((c) => c.method)).toEqual(methods);
  expect(r.vercel).toEqual([]);
  expect(domainId(ctx)).toBe("dpl_cu");
  expectNoMarker(ctx, r);
  return { ctx, r };
}

const refusal = (failed: unknown[]) => (ctx: Ctx) => {
  ctx.vercelReply.post = { status: 201, body: { created: createdSix(), failed } };
};

describe("E1 · Vercel trả 201 mà từ chối ghi biến thì bước bien đỏ", () => {
  const cells: { name: string; failed: unknown[]; reason: string }[] = [
    {
      name: "E1-a hai biến, một có mã lỗi",
      failed: [
        { error: { code: "ENV_CONFLICT", message: "conflict", key: "AUTH_SECRET" } },
        { error: { message: "refused", key: "RESEND_API_KEY" } },
      ],
      reason: "Vercel từ chối ghi biến AUTH_SECRET (ENV_CONFLICT), RESEND_API_KEY",
    },
    {
      name: "E1-b tên chỉ ở envVarKey",
      failed: [{ error: { code: "bad_value", message: "x", envVarKey: "RESEND_API_KEY" } }],
      reason: "Vercel từ chối ghi biến RESEND_API_KEY (bad_value)",
    },
    {
      name: "E1-c không rõ tên đứng giữa",
      failed: [
        { error: { message: "a", key: "AUTH_SECRET" } },
        { error: { code: "x", message: "b", key: "not a name" } },
        { error: { message: "c", key: "RESEND_API_KEY" } },
      ],
      reason: "Vercel từ chối ghi biến AUTH_SECRET, không rõ tên (x), RESEND_API_KEY",
    },
    {
      name: "E1-d tên lặp",
      failed: [
        { error: { message: "a", key: "AUTH_SECRET" } },
        { error: { message: "b", key: "AUTH_SECRET" } },
      ],
      reason: "Vercel từ chối ghi biến AUTH_SECRET",
    },
    {
      name: "E1-e mã lạ khuôn không in",
      failed: [{ error: { code: "bad code; x", message: "a", key: "AUTH_SECRET" } }],
      reason: "Vercel từ chối ghi biến AUTH_SECRET",
    },
  ];
  for (const appEnv of ["staging", "production"] as const) {
    for (const c of cells) {
      it(`E1 · ${appEnv} · ${c.name}: dòng đỏ ghim, không dựng, tên miền không đổi`, async () => {
        await expectBienRed(appEnv, refusal(c.failed), c.reason, ["GET", "POST"]);
      });
    }
  }
});

describe("E2 · lời báo lỗi của Vercel chép giá trị thì dòng in vẫn không có giá trị", () => {
  for (const appEnv of ["staging", "production"] as const) {
    it(`E2 · ${appEnv}: failed mang error.value và error.message có giá trị → dòng chỉ có tên`, async () => {
      const ctx = await fresh(appEnv);
      const values: Record<string, string> = {
        AUTH_SECRET: ctx.env["AUTH_SECRET"]!,
        RESEND_API_KEY: ctx.env["RESEND_API_KEY"]!,
      };
      const failed = ["AUTH_SECRET", "RESEND_API_KEY", "DATABASE_URL"].map((key) => ({
        error: {
          key,
          value: values[key] ?? `postgresql://quy_hang_login:${LOGIN_PW}@db.example/postgres`,
          message: `value ${values[key] ?? LOGIN_PW} is invalid`,
        },
      }));
      ctx.vercelReply.post = { status: 201, body: { created: createdSix(), failed } };
      const r = await deploy(ctx, appEnv);
      // Source control: the fake did send the values back, in both fields.
      const served = ctx.served
        .filter((s) => s.method === "POST")
        .map((s) => s.text)
        .join("\n");
      expect(served.split("moc-bi-mat-AUTH_SECRET")).toHaveLength(3);
      expect(served).toContain(LOGIN_PW);
      expect(r.lines).toContain(
        `deploy ${appEnv}: bien ĐỎ — Vercel từ chối ghi biến AUTH_SECRET, RESEND_API_KEY, DATABASE_URL`,
      );
      expect(r.vercel).toEqual([]);
      expect(markerLeak(runText(r))).toBeNull();
    });
  }
  it("E2 · chiều đỏ: cùng đầu ra, nối một giá trị → hàm đo gọi tên biến lộ", async () => {
    const ctx = await fresh("staging");
    ctx.vercelReply.post = {
      status: 201,
      body: { created: createdSix(), failed: [{ error: { key: "AUTH_SECRET", message: "x" } }] },
    };
    const r = await deploy(ctx, "staging");
    expect(markerLeak(runText(r))).toBeNull();
    expect(markerLeak(`${runText(r)}\nmoc-bi-mat-AUTH_SECRET`)).toBe(
      "giá trị của AUTH_SECRET lộ ra",
    );
    expect(markerLeak(`${runText(r)}\n${LOGIN_PW}`)).toBe("giá trị của LOGIN_DB_PASSWORD lộ ra");
  });
});

describe("E3 · Vercel trả 201 mà không xác nhận đủ sáu biến thì bước bien đỏ", () => {
  const all = `Vercel không xác nhận đã ghi biến ${SIX.join(", ")}`;
  const cells: { name: string; body: unknown; reason: string }[] = [
    {
      name: "thiếu DATABASE_URL và APP_ENV",
      body: {
        created: createdSix(SIX.filter((k) => k !== "DATABASE_URL" && k !== "APP_ENV")),
        failed: [],
      },
      reason: "Vercel không xác nhận đã ghi biến DATABASE_URL, APP_ENV",
    },
    { name: "created rỗng", body: { created: [], failed: [] }, reason: all },
    { name: "không có created", body: { failed: [] }, reason: all },
    { name: "created là đối tượng không key", body: { created: {}, failed: [] }, reason: all },
    { name: "thân không phải JSON", body: "not json", reason: all },
  ];
  for (const appEnv of ["staging", "production"] as const) {
    for (const c of cells) {
      it(`E3 · ${appEnv} · ${c.name}: dòng đỏ gọi tên biến thiếu, không dựng`, async () => {
        await expectBienRed(
          appEnv,
          (ctx) => {
            ctx.vercelReply.post = { status: 201, body: c.body };
          },
          c.reason,
          ["GET", "POST"],
        );
      });
    }
  }

  it("E3 · khuôn câu trả lời ghi: đối tượng đơn, failed lạ, mục failed không phải đối tượng", () => {
    expect([...confirmedKeys({ created: { key: "APP_URL" } })]).toEqual(["APP_URL"]);
    expect([...confirmedKeys({ created: [{ key: "A_B" }, null, "x", { key: 3 }] })]).toEqual([
      "A_B",
    ]);
    expect([...confirmedKeys(null)]).toEqual([]);
    expect(refusedItems({ failed: {} })).toEqual([]);
    expect(refusedItems(null)).toEqual([]);
    expect(refusedItems({ failed: ["x", null, { error: {} }] })).toEqual(["không rõ tên"]);
  });
});

describe("E4 · lần đọc biến trả thành công mà không có danh sách thì bước bien đỏ, chưa ghi gì", () => {
  const cells: { name: string; body: unknown }[] = [
    { name: "đối tượng biến đơn", body: { key: "APP_URL", type: "plain", value: "x" } },
    { name: "envs không phải mảng", body: { envs: {} } },
    { name: "thân không phải JSON", body: "not json" },
  ];
  for (const appEnv of ["staging", "production"] as const) {
    for (const c of cells) {
      it(`E4 · ${appEnv} · ${c.name}: dòng đỏ ghim, 0 lần ghi, không dựng`, async () => {
        await expectBienRed(
          appEnv,
          (ctx) => {
            ctx.vercelReply.get = { status: 200, body: c.body };
          },
          "Vercel trả danh sách biến không đúng khuôn",
          ["GET"],
        );
      });
    }
  }

  it("E4 · đối chứng dương: danh sách rỗng đúng khuôn → bien đạt", async () => {
    const ctx = await fresh("staging");
    ctx.vercelReply.get = { status: 200, body: { envs: [] } };
    const r = await deploy(ctx, "staging");
    expect(r.lines).toContain("deploy staging: bien đạt");
    expect(r.code).toBe(0);
  });
});

const BIEN_REASONS = [
  "Vercel từ chối ghi biến <tên>",
  "Vercel không xác nhận đã ghi biến <tên>",
  "Vercel trả danh sách biến không đúng khuôn",
];

/** One finding per red reason of the bien step that no `bien` row of the runbook's table carries. */
function soTayFindings(md: string): string[] {
  const rows = md.split("\n").filter((l) => l.startsWith("| `bien`"));
  return BIEN_REASONS.filter((reason) => !rows.some((row) => row.includes(reason))).map(
    (reason) => `sổ tay thiếu hàng bien: ${reason}`,
  );
}

describe("E6 · sổ tay có hàng cho mỗi lý do đỏ mới của bien", () => {
  const md = readFileSync(resolve(HERE, "../../docs/van-hanh/dua-ban-len.md"), "utf8");

  it("E6 · mục «Đỏ thì làm gì» có hàng bien cho từng lý do", () => {
    expect(soTayFindings(md)).toEqual([]);
  });

  it("E6 · chiều đỏ: bỏ hàng «Vercel từ chối ghi biến» → hàm so gọi tên hàng thiếu", () => {
    const broken = md
      .split("\n")
      .filter((l) => !(l.startsWith("| `bien`") && l.includes("Vercel từ chối ghi biến")))
      .join("\n");
    expect(soTayFindings(broken)).toEqual([
      "sổ tay thiếu hàng bien: Vercel từ chối ghi biến <tên>",
    ]);
  });
});

// ── Row bien-do-sau-xoay-mat-khau: bien before vai-dang-nhap (E1–E4 of _acceptance/bien-do-sau-xoay-mat-khau) ──────

describe("E1 · thứ tự bước khai trong mã", () => {
  it("E1 · thứ tự khai: bien trước vai-dang-nhap ở cả hai môi trường", () => {
    expect(STEPS.staging).toEqual([
      "cau-hinh",
      "migration",
      "bien",
      "vai-dang-nhap",
      "cach-ly",
      "dung",
      "kiem-nhanh",
      "gan-ten-mien",
      "kiem-nhanh-ten-mien",
    ]);
    expect(STEPS.production).toEqual([
      "cau-hinh",
      "ban-thu-truoc",
      "migration",
      "bien",
      "vai-dang-nhap",
      "dung",
      "kiem-nhanh",
      "gan-ten-mien",
      "kiem-nhanh-ten-mien",
    ]);
  });
});

describe("E3 · vai-dang-nhap đỏ sau khi đã ghi biến", () => {
  for (const appEnv of ["staging", "production"] as const) {
    it(`E3 · ${appEnv} · vai-dang-nhap đỏ sau khi ghi biến: một lần ghi, một lần gửi câu đặt mật khẩu, không dựng`, async () => {
      const ctx = await fresh(appEnv);
      writeFileSync(join(ctx.fake, "vai-chua-co"), "");
      const r = await deploy(ctx, appEnv);
      expect(r.code).not.toBe(0);
      expect(r.lines).toContain(
        `deploy ${appEnv}: vai-dang-nhap ĐỎ — không đặt được mật khẩu vai đăng nhập: role "quy_hang_login" does not exist`,
      );
      expect(r.lines.at(-1)).toBe(`deploy ${appEnv}: DỪNG ở vai-dang-nhap — tên miền không đổi`);
      expect(ctx.api.filter((c) => c.method === "POST")).toHaveLength(1);
      expect(vaiCalls(r)).toBe(1);
      expect(r.calls.indexOf("api POST /v10/projects/<id>/env")).toBeLessThan(
        r.calls.indexOf("psql vai"),
      );
      expect(r.vercel).toEqual([]);
      expect(domainId(ctx)).toBe("dpl_cu");
      expectNoMarker(ctx, r);
    });
  }
});

describe("E2 · bước bien đỏ thì không đặt mật khẩu vai đăng nhập", () => {
  const cells: { name: string; arrange: (ctx: Ctx) => void; reason: string }[] = [
    {
      name: "biến cấm MIGRATE_DATABASE_URL",
      arrange: (ctx) => {
        ctx.vercelEnvs = ["MIGRATE_DATABASE_URL"];
      },
      reason: "dự án Vercel đang có biến cấm MIGRATE_DATABASE_URL",
    },
    {
      name: "Vercel trả 403",
      arrange: (ctx) => {
        ctx.apiStatus = 403;
      },
      reason: "Vercel trả 403",
    },
    {
      name: "từ chối AUTH_SECRET",
      arrange: refusal([{ error: { key: "AUTH_SECRET", message: "x" } }]),
      reason: "Vercel từ chối ghi biến AUTH_SECRET",
    },
    {
      name: "created rỗng",
      arrange: (ctx) => {
        ctx.vercelReply.post = { status: 201, body: { created: [], failed: [] } };
      },
      reason: `Vercel không xác nhận đã ghi biến ${SIX.join(", ")}`,
    },
    {
      name: "danh sách không có envs",
      arrange: (ctx) => {
        ctx.vercelReply.get = { status: 200, body: { key: "APP_URL", type: "plain", value: "x" } };
      },
      reason: "Vercel trả danh sách biến không đúng khuôn",
    },
  ];
  for (const appEnv of ["staging", "production"] as const) {
    for (const c of cells) {
      it(`E2 · ${appEnv} · ${c.name}: dừng ở bien, mật khẩu không đặt`, async () => {
        const ctx = await fresh(appEnv);
        c.arrange(ctx);
        const r = await deploy(ctx, appEnv);
        expect(r.code).not.toBe(0);
        expect(r.lines).toContain(`deploy ${appEnv}: bien ĐỎ — ${c.reason}`);
        expect(r.lines.at(-1)).toBe(`deploy ${appEnv}: DỪNG ở bien — tên miền không đổi`);
        expect(vaiCalls(r)).toBe(0);
        expect(existsSync(join(ctx.fake, "vai.sql"))).toBe(false);
        expect(r.vercel).toEqual([]);
        expect(domainId(ctx)).toBe("dpl_cu");
        expectNoMarker(ctx, r);
      });
    }
  }
});

/** The «Đạt khi» bullet of a numbered step section of the deploy runbook, up to the next bullet. */
function datKhi(md: string, buoc: number): string {
  const start = md.search(new RegExp(`^### ${buoc}\\. `, "m"));
  if (start < 0) return "";
  const section = md.slice(start).split(/\n### /)[0]!;
  const m = /- \*\*Đạt khi:\*\*([\s\S]*?)(?=\n- \*\*|$)/.exec(section);
  return m ? m[1]! : "";
}

/** Findings when the runbook's «Đạt khi» lines of bước 2 (staging) and bước 5 (production) list the steps out of order. */
function thuTuSoTay(md: string): string[] {
  const out: string[] = [];
  for (const [buoc, appEnv] of [
    [2, "staging"],
    [5, "production"],
  ] as const) {
    const text = datKhi(md, buoc);
    const found = STEPS[appEnv]
      .map((s) => ({ s, at: text.search(new RegExp(`(?<![\\w-])${s} đạt`)) }))
      .filter((x) => x.at >= 0)
      .sort((a, b) => a.at - b.at)
      .map((x) => x.s);
    if (JSON.stringify(found) !== JSON.stringify(STEPS[appEnv])) {
      out.push(`sổ tay bước ${buoc}: thứ tự lệch STEPS.${appEnv}`);
    }
  }
  return out;
}

describe("E4 · sổ tay kể đúng thứ tự bước của lệnh", () => {
  const md = readFileSync(resolve(HERE, "../../docs/van-hanh/dua-ban-len.md"), "utf8");

  it("E4 · sổ tay kể đúng thứ tự bước", () => {
    expect(thuTuSoTay(md)).toEqual([]);
  });

  it("E4 · chiều đỏ: hoán vai-dang-nhap với bien ở bước 2 → hàm so gọi tên bước 2", () => {
    const start = md.search(/^### 2\. /m);
    const end = md.search(/^### 3\. /m);
    const swapped = md
      .slice(start, end)
      .replace("`vai-dang-nhap đạt`", "@@")
      .replace("`bien đạt`", "`vai-dang-nhap đạt`")
      .replace("@@", "`bien đạt`");
    const broken = md.slice(0, start) + swapped + md.slice(end);
    expect(broken).not.toBe(md);
    expect(thuTuSoTay(broken)).toEqual(["sổ tay bước 2: thứ tự lệch STEPS.staging"]);
  });
});
