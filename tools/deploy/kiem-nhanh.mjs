// Quick read-only check of a running deploy (row moi-truong-thu-va-ban-that, AC-1..AC-4), and the helpers that
// len-ban.mjs and lui-ban.mjs share. The check reads GET /api/v1/health — exactly the four keys ok, commit, env, vai;
// ok true, the expected commit, the expected environment, vai "dat" — and asks for /proto/x, which must be 404 (the dev
// switch is off). Nothing is written, no value of a variable is ever printed.
//
//   node tools/deploy/kiem-nhanh.mjs <staging|production>      (make smoke ENV=…)
//   APP_URL — the public address of ENV; production falls back to https://inventory.onehub.center.
//   VERCEL_AUTOMATION_BYPASS_SECRET — optional, sent as x-vercel-protection-bypass when the deploy is protected.
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

export const ENVS = ["staging", "production"];
export const PRODUCTION_URL = "https://inventory.onehub.center";
export const HEALTH_KEYS = ["ok", "commit", "env", "vai"];

/** Names whose values must never reach a printed line; child output is scrubbed of them too. */
export const SECRET_NAMES = [
  "VERCEL_TOKEN",
  "VERCEL_ORG_ID",
  "VERCEL_PROJECT_ID",
  "MIGRATE_DATABASE_URL",
  "LOGIN_DATABASE_URL",
  "VERCEL_AUTOMATION_BYPASS_SECRET",
];

/** Replaces every secret value found in `text` with ***. */
export function redact(text, env = process.env) {
  let out = String(text ?? "");
  for (const name of SECRET_NAMES) {
    const value = env[name];
    if (value && value.length >= 4) out = out.split(value).join("***");
  }
  return out;
}

export function git(args, cwd) {
  const r = spawnSync("git", args, { cwd, encoding: "utf8" });
  if (r.status !== 0) throw new Error(`git ${args[0]} lỗi`);
  return r.stdout.trim();
}

function joinUrl(base, path) {
  return `${String(base).replace(/\/+$/, "")}${path}`;
}

function headers(env) {
  const bypass = env["VERCEL_AUTOMATION_BYPASS_SECRET"];
  return bypass ? { "x-vercel-protection-bypass": bypass } : {};
}

/** The health body of `base`, or { error } when it does not answer or is not JSON. */
export async function readHealth(base, env = process.env) {
  try {
    const res = await fetch(joinUrl(base, "/api/v1/health"), {
      headers: headers(env),
      redirect: "manual",
      signal: AbortSignal.timeout(15_000),
    });
    try {
      return { body: await res.json(), status: res.status };
    } catch {
      return { error: `sức khoẻ trả ${res.status}, không phải JSON` };
    }
  } catch {
    return { error: "sức khoẻ không trả lời" };
  }
}

/**
 * Checks the deploy at `base`. `commit` is the expected full commit (omit to accept any). Returns { ok, reason, commit }.
 */
export async function kiemNhanh(base, { env: appEnv, commit }, env = process.env) {
  const health = await readHealth(base, env);
  if (health.error) return { ok: false, reason: health.error };
  const body = health.body;
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { ok: false, reason: "sức khoẻ không phải một đối tượng" };
  }
  const keys = Object.keys(body).sort();
  const extra = keys.filter((k) => !HEALTH_KEYS.includes(k));
  if (extra.length) return { ok: false, reason: `sức khoẻ có khoá lạ: ${extra.join(", ")}` };
  const missing = HEALTH_KEYS.filter((k) => !keys.includes(k));
  if (missing.length) return { ok: false, reason: `sức khoẻ thiếu khoá: ${missing.join(", ")}` };
  if (body.ok !== true) return { ok: false, reason: `sức khoẻ ok khác true (vai: ${body.vai})` };
  if (commit && body.commit !== commit) {
    return {
      ok: false,
      reason: `chạy commit ${short(body.commit)}, cần ${short(commit)}`,
    };
  }
  if (body.env !== appEnv) return { ok: false, reason: `env là ${body.env}, cần ${appEnv}` };
  if (body.vai !== "dat") return { ok: false, reason: `vai nối chưa đạt: ${body.vai}` };
  try {
    const res = await fetch(joinUrl(base, "/proto/x"), {
      headers: headers(env),
      redirect: "manual",
      signal: AbortSignal.timeout(15_000),
    });
    if (res.status !== 404) return { ok: false, reason: `/proto/x trả ${res.status}, cần 404` };
  } catch {
    return { ok: false, reason: "/proto/x không trả lời" };
  }
  return { ok: true, commit: body.commit };
}

export function short(commit) {
  return String(commit ?? "").slice(0, 7);
}

/** The confirmation an operator adds to deploy or roll back production with the CLI's own session. */
export const XAC_NHAN = "XAC_NHAN_BAN_THAT";

/**
 * How len-ban.mjs and lui-ban.mjs reach Vercel: "khoa" when VERCEL_TOKEN is set (CI, unchanged), "phien" otherwise —
 * the vercel CLI's signed-in session on the operator's machine (`vercel login`).
 */
export function vercelMode(env = process.env) {
  return env["VERCEL_TOKEN"]?.trim() ? "khoa" : "phien";
}

/** The one line that says which way the run reaches Vercel; never the token. */
export function modeText(mode) {
  return mode === "khoa" ? "dùng khoá VERCEL_TOKEN" : "dùng phiên Vercel CLI đã đăng nhập";
}

/** `env` for the children of a run: in session mode a blank VERCEL_TOKEN is dropped, so the CLI uses its session. */
export function envFor(mode, env) {
  if (mode === "khoa") return env;
  const out = { ...env };
  delete out["VERCEL_TOKEN"];
  return out;
}

/**
 * Session mode only, before anything is touched. Returns the reason or null.
 *   - production needs XAC_NHAN_BAN_THAT=co: a signed-in session reaches every project of the account, a token only
 *     its team;
 *   - `vercel whoami` must succeed (the session is signed in);
 *   - the right project: `cwd` must be linked (`.vercel/project.json`, written by `vercel link`) to VERCEL_PROJECT_ID
 *     in VERCEL_ORG_ID. Checked here, before `vercel pull`: with both ids in the environment the CLI deploys to them and
 *     pull rewrites project.json from them, so after pull the comparison would always hold. Before pull it compares two
 *     sources the operator chose separately — the project picked by name in `vercel link` and the env file — and a
 *     wrong env file stops the run before the migration. Ids are never printed.
 * `retry` is the command line that adds the confirmation.
 */
export function sessionProblem(appEnv, { cwd, env, retry }) {
  if (appEnv === "production" && env[XAC_NHAN]?.trim() !== "co") {
    return `bản thật bằng phiên Vercel CLI cần xác nhận ${XAC_NHAN}=co — gõ lại: ${retry}`;
  }
  if (vercel(["whoami"], { cwd, env }).status !== 0) {
    return "chưa đăng nhập Vercel CLI và không có VERCEL_TOKEN — gõ vercel login, hay nạp VERCEL_TOKEN";
  }
  const file = join(cwd, ".vercel", "project.json");
  const relink = `gõ vercel link, chọn dự án của ${appEnv}`;
  if (!existsSync(file)) return `thư mục chưa nối dự án Vercel (.vercel/project.json) — ${relink}`;
  let link;
  try {
    link = JSON.parse(readFileSync(file, "utf8"));
  } catch {
    return `.vercel/project.json không đọc được — ${relink}`;
  }
  const differs = [
    ["projectId", "VERCEL_PROJECT_ID"],
    ["orgId", "VERCEL_ORG_ID"],
  ].filter(([key, name]) => link?.[key] !== env[name]?.trim());
  if (differs.length) {
    const keys = differs.map(([key]) => key).join(" và ");
    const names = differs.map(([, name]) => name).join(", ");
    return `${keys} ở .vercel/project.json khác ${names} — sai dự án; ${relink}, hay nạp đúng tệp biến`;
  }
  return null;
}

/** Runs the vercel CLI. The token travels in the environment (VERCEL_TOKEN), never on the command line. */
export function vercel(args, { cwd, env = process.env } = {}) {
  const r = spawnSync("vercel", args, { cwd, env, encoding: "utf8" });
  const output = redact(`${r.stdout ?? ""}${r.stderr ?? ""}`, env).trim();
  if (output) process.stderr.write(`${output}\n`);
  return { status: r.status ?? 1, stdout: r.stdout ?? "", error: r.error };
}

function commitOf(d) {
  return d?.meta?.onehub_commit ?? d?.meta?.githubCommitSha ?? undefined;
}

/**
 * READY production deployments from `vercel list --json` (vercel@65.9.0 prints `{ contextName, deployments: [{ id, url,
 * state, target, createdAt, meta, … }], pagination }`), newest first for display only; null when the list cannot be
 * read. Nothing here chooses a deployment: the list is shown to the operator, or searched by an exact id.
 */
export function productionDeployments({ cwd, env = process.env } = {}) {
  const r = spawnSync(
    "vercel",
    ["list", "--environment", "production", "--status", "READY", "--json", "--yes"],
    { cwd, env, encoding: "utf8" },
  );
  if (r.status !== 0) {
    const output = redact(r.stderr ?? "", env).trim();
    if (output) process.stderr.write(`${output}\n`);
    return null;
  }
  let parsed;
  try {
    parsed = JSON.parse(r.stdout);
  } catch {
    return null;
  }
  const list = Array.isArray(parsed) ? parsed : (parsed?.deployments ?? []);
  return list
    .filter((d) => d && (d.id ?? d.uid) && (d.state ?? d.readyState ?? "READY") === "READY")
    .sort((a, b) => (b.createdAt ?? b.created ?? 0) - (a.createdAt ?? a.created ?? 0))
    .map((d) => ({
      id: d.id ?? d.uid,
      url: d.url,
      commit: commitOf(d),
      createdAt: d.createdAt ?? d.created,
    }));
}

/** A deployment url without scheme or trailing slash: `vercel deploy` prints `https://host`, the CLI reads hosts. */
export function bare(url) {
  return String(url ?? "")
    .replace(/^https?:\/\//, "")
    .replace(/\/+$/, "");
}

/**
 * The deployment a domain (alias) or deployment url points to, read by `vercel inspect <host> --json`, or null when it
 * cannot be read (the domain was never attached, the token is wrong, the CLI is missing). vercel@65.9.0 resolves the
 * host with GET /v13/deployments/<host> — its help: «Get information about the deployment an alias points to» — and
 * prints `{ id, name, url, target, readyState, createdAt, … }` on stdout.
 */
export function deploymentAt(url, { cwd, env = process.env } = {}) {
  const r = spawnSync("vercel", ["inspect", bare(url), "--json"], { cwd, env, encoding: "utf8" });
  if (r.status !== 0) {
    const output = redact(r.stderr ?? "", env).trim();
    if (output) process.stderr.write(`${output}\n`);
    return null;
  }
  let d;
  try {
    d = JSON.parse(r.stdout);
  } catch {
    return null;
  }
  return typeof d?.id === "string" && d.id ? { id: d.id, url: d.url } : null;
}

/** One printed line per deployment of `list`, marking the one `holderId` (the domain) points to. */
export function deploymentLines(list, holderId) {
  return list.map((d) => {
    const created = d.createdAt ? new Date(d.createdAt).toISOString() : "?";
    const mark = holderId && d.id === holderId ? " · tên miền đang ở đây" : "";
    return `bản ${d.id} · ${d.url ?? "?"} · commit ${short(d.commit) || "?"} · tạo ${created}${mark}`;
  });
}

/** The line that asks the operator to name the deployment to go back to. */
export function nameTheTarget(appEnv) {
  return `chọn bản chạy tốt gần nhất trong danh sách, rồi gõ: make rollback ENV=${appEnv} BAN=<id>`;
}

async function main() {
  const appEnv = process.argv[2];
  if (!ENVS.includes(appEnv)) {
    console.log(`smoke: ENV phải là staging hay production`);
    process.exit(2);
  }
  const base = process.env["APP_URL"] || (appEnv === "production" ? PRODUCTION_URL : "");
  if (!base) {
    console.log(`smoke ${appEnv}: ĐỎ — thiếu biến APP_URL`);
    process.exit(1);
  }
  let head;
  try {
    head = git(["rev-parse", "HEAD"]);
  } catch {
    head = undefined;
  }
  const r = await kiemNhanh(base, { env: appEnv, commit: head });
  if (!r.ok) {
    console.log(`smoke ${appEnv}: ĐỎ — ${r.reason}`);
    process.exit(1);
  }
  console.log(`smoke ${appEnv}: đạt ${short(r.commit)}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();
