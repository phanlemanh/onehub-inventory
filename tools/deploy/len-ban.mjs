// make deploy ENV=staging|production (row moi-truong-thu-va-ban-that, AC-1..AC-3). Fixed steps, each printing exactly one
// line `deploy <ENV>: <step> đạt` or `deploy <ENV>: <step> ĐỎ — <reason>`; a red step before the domain moves ends with
// `deploy <ENV>: DỪNG ở <step> — tên miền không đổi`. A red check after it rolls the domain back once, to the deployment
// the domain pointed to just before the promote (read from the domain with `vercel inspect`); when that is not certain
// it stops, prints the READY production deployments and asks the operator for `make rollback ENV=<ENV> BAN=<id>`.
//
//   staging:    cau-hinh, migration, cach-ly, dung, kiem-nhanh, gan-ten-mien, kiem-nhanh-ten-mien
//   production: cau-hinh, ban-thu-truoc, migration, dung, kiem-nhanh, gan-ten-mien, kiem-nhanh-ten-mien
//
// Runs in the repository root (cwd). Variables are only checked for presence, never printed:
//   VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID — read by the vercel CLI from the environment
//   MIGRATE_DATABASE_URL — owner connection, migrations (and the isolation suite's catalog reads) only
//   LOGIN_DATABASE_URL   — staging: the app's login role, for the isolation suite
//   APP_URL              — the public address of ENV (the domain)
//   STAGING_APP_URL      — production: the staging address, whose health must already run this commit
// Optional: PSQL_DICH (psql command line, default `psql`), CACH_LY_CMD (isolation command, default
// `bash db/scripts/cach-ly-dich.sh`), VERCEL_AUTOMATION_BYPASS_SECRET (protected deployment urls).
import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  deploymentAt,
  deploymentLines,
  ENVS,
  git,
  kiemNhanh,
  nameTheTarget,
  productionDeployments,
  readHealth,
  redact,
  short,
  vercel,
} from "./kiem-nhanh.mjs";

const SCRIPTS = resolve(dirname(fileURLToPath(import.meta.url)), "../../db/scripts");

export const STEPS = {
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

export const REQUIRED = {
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

class Red extends Error {}

/** Checks vercel.json: region sin1 only, git auto-deploy off. Returns the reason or null. */
export function vercelJsonProblem(root) {
  const path = join(root, "vercel.json");
  if (!existsSync(path)) return "thiếu vercel.json";
  let cfg;
  try {
    cfg = JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return "vercel.json không đọc được";
  }
  const regions = cfg.regions;
  if (!Array.isArray(regions) || regions.length !== 1 || regions[0] !== "sin1") {
    return 'vercel.json: khoá regions phải là ["sin1"]';
  }
  if (cfg.git?.deploymentEnabled !== false) {
    return "vercel.json: khoá git.deploymentEnabled phải là false (tắt tự triển khai theo nhánh)";
  }
  return null;
}

/** Strips `--` line comments and block comments, so a comment never counts as a statement. */
function sqlOnly(text) {
  return text.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/--[^\n]*/g, " ");
}

/**
 * Hỏi-4: a migration that drops or renames a table or column must say how the running (old) code survives it, with a
 * line `-- bo-sau: …`. Returns true when the file needs that line and lacks it.
 */
export function needsBoSau(text) {
  if (/^\s*--\s*bo-sau:/im.test(text)) return false;
  const sql = sqlOnly(text).toLowerCase();
  if (/\bdrop\s+table\b/.test(sql)) return true;
  if (/\bdrop\s+column\b/.test(sql)) return true;
  if (/\brename\s+(column\s+)?[\w"]+\s+to\b/.test(sql)) return true;
  if (/\balter\s+table\b[^;]*\brename\s+to\b/.test(sql)) return true;
  // `alter table t drop x` — COLUMN is optional in Postgres; constraints, defaults and the like are not columns.
  const bare =
    /\balter\s+table\b[^;]*?\bdrop\s+(?!column\b|constraint\b|default\b|not\b|identity\b|expression\b)([\w"]+)/g;
  return bare.test(sql);
}

function psqlCmd(env) {
  const parts = (env["PSQL_DICH"] || "psql").trim().split(/\s+/);
  return { cmd: parts[0], args: parts.slice(1) };
}

/** Names already in public.schema_migrations of the target. */
function appliedMigrations(env) {
  const { cmd, args } = psqlCmd(env);
  const url = env["MIGRATE_DATABASE_URL"];
  const run = (sql) => {
    const r = spawnSync(
      cmd,
      [...args, "-d", url, "-v", "ON_ERROR_STOP=1", "-X", "-q", "-A", "-t", "-c", sql],
      {
        env,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
      },
    );
    if (r.status !== 0) {
      const output = redact(r.stderr ?? "", env).trim();
      if (output) process.stderr.write(`${output}\n`);
      throw new Red("không đọc được sổ migration của cơ sở dữ liệu đích");
    }
    return r.stdout.trim();
  };
  if (run("select to_regclass('public.schema_migrations') is not null") !== "t") return [];
  return run("select name from public.schema_migrations")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function stepMigration(root, env) {
  const dir = join(root, "db", "migrations");
  const files = existsSync(dir)
    ? readdirSync(dir)
        .filter((f) => /^\d{3}_.*\.sql$/.test(f))
        .sort()
    : [];
  const applied = new Set(appliedMigrations(env));
  const pending = files.filter((f) => !applied.has(f));
  for (const f of pending) {
    if (needsBoSau(readFileSync(join(dir, f), "utf8"))) {
      throw new Red(`${f} xoá hay đổi tên bảng hoặc cột mà thiếu dòng «-- bo-sau:» — chưa áp gì`);
    }
  }
  const r = spawnSync("bash", [join(SCRIPTS, "migrate.sh"), env["MIGRATE_DATABASE_URL"]], {
    cwd: root,
    env: { ...env, PSQL: env["PSQL_DICH"] || "psql", MIGRATIONS_DIR: dir },
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  const output = redact(`${r.stdout ?? ""}${r.stderr ?? ""}`, env).trim();
  if (output) process.stderr.write(`${output}\n`);
  if (r.status !== 0) {
    const last =
      redact(r.stderr ?? "", env)
        .trim()
        .split("\n")
        .pop() || `mã ${r.status}`;
    throw new Red(`migrate.sh lỗi: ${last}`);
  }
}

function stepCachLy(root, env) {
  const line = env["CACH_LY_CMD"] || `bash ${join(SCRIPTS, "cach-ly-dich.sh")}`;
  const parts = line.trim().split(/\s+/);
  const r = spawnSync(parts[0], parts.slice(1), {
    cwd: root,
    env,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  const out = redact(`${r.stdout ?? ""}${r.stderr ?? ""}`, env).trim();
  if (out) process.stderr.write(`${out}\n`);
  if (r.status !== 0) {
    const finding = out
      .split("\n")
      .find((l) => l.trim() && !/^ok\s/.test(l) && !/^cach-ly-dich: \d+ ca đạt/.test(l));
    throw new Red(`bộ kiểm cách ly đỏ: ${finding?.trim() || `mã ${r.status ?? "?"}`}`);
  }
}

/**
 * After a red check on the domain: point it back at the deployment that held it before the promote — the id read from
 * the domain itself, never one chosen from the list — then confirm the domain points there and check it. Without a
 * certain id nothing is rolled back: the list is printed and the operator names the target. Always returns 1.
 */
async function rollBack(appEnv, { root, env, say, before, newId }) {
  const stop = (line) => {
    say(line);
    const list = productionDeployments({ cwd: root, env });
    if (!list) {
      say("lùi bản ĐỎ — không đọc được danh sách bản của Vercel");
    } else {
      for (const l of deploymentLines(list, deploymentAt(env["APP_URL"], { cwd: root, env })?.id))
        say(l);
    }
    say(nameTheTarget(appEnv));
    return 1;
  };
  const stays = "không tự lùi; tên miền vẫn ở bản mới";
  if (!before) {
    return stop(
      `lùi bản DỪNG — không đọc được bản tên miền trỏ tới trước khi gắn (lần gắn đầu, hay Vercel không trả lời), ${stays}`,
    );
  }
  if (!newId) return stop(`lùi bản DỪNG — không đọc được mã bản mới, ${stays}`);
  if (before.id === newId) {
    return stop(
      `lùi bản DỪNG — trước khi gắn, tên miền đã trỏ vào chính bản mới ${newId}, ${stays}`,
    );
  }
  const rb = vercel(["rollback", before.id, "--yes"], { cwd: root, env });
  if (rb.status !== 0) return stop(`lùi bản ĐỎ — vercel rollback lỗi (mã ${rb.status})`);
  const now = deploymentAt(env["APP_URL"], { cwd: root, env });
  if (now?.id !== before.id) {
    return stop(
      `lùi bản ĐỎ — tên miền chưa về bản ${before.id} (đang ở ${now?.id ?? "không đọc được"})`,
    );
  }
  // The commit the recorded deployment carries, looked up by its exact id, to check the domain against.
  const commit = productionDeployments({ cwd: root, env })?.find((d) => d.id === before.id)?.commit;
  const check = await kiemNhanh(env["APP_URL"], { env: appEnv, commit }, env);
  if (!check.ok) {
    return stop(
      `lùi bản ĐỎ — tên miền đã về bản ${before.id} nhưng kiểm nhanh đỏ: ${check.reason}`,
    );
  }
  say("đã lùi về bản trước");
  return 1;
}

export async function lenBan(
  appEnv,
  { cwd = process.cwd(), env = process.env, out = console.log } = {},
) {
  const say = (text) => out(`deploy ${appEnv}: ${text}`);
  let root;
  let head;
  let newUrl;
  let promoted = false;
  // Read before the promote, from the domain itself: the deployment that held it, and the new deployment's id.
  let before;
  let newId;

  const steps = {
    "cau-hinh": async () => {
      const missing = REQUIRED[appEnv].filter((n) => !env[n]?.trim());
      if (missing.length) throw new Red(`thiếu biến ${missing.join(", ")}`);
      try {
        root = git(["rev-parse", "--show-toplevel"], cwd);
        head = git(["rev-parse", "HEAD"], root);
      } catch {
        throw new Red("không phải một kho git");
      }
      if (git(["status", "--porcelain"], root))
        throw new Red("cây chưa sạch — commit hay bỏ thay đổi trước");
      const problem = vercelJsonProblem(root);
      if (problem) throw new Red(problem);
    },
    "ban-thu-truoc": async () => {
      const h = await readHealth(env["STAGING_APP_URL"], env);
      if (h.error || h.body?.commit !== head) throw new Red(`bản thử chưa chạy ${short(head)}`);
    },
    migration: async () => stepMigration(root, env),
    "cach-ly": async () => stepCachLy(root, env),
    dung: async () => {
      const venv = { ...env, COMMIT_SHA: head };
      const pull = vercel(["pull", "--yes", "--environment=production"], { cwd: root, env: venv });
      if (pull.status !== 0) throw new Red(`vercel pull lỗi (mã ${pull.status})`);
      const build = vercel(["build", "--prod"], { cwd: root, env: venv });
      if (build.status !== 0) throw new Red(`vercel build lỗi (mã ${build.status})`);
      const dep = vercel(
        [
          "deploy",
          "--prebuilt",
          "--prod",
          "--skip-domain",
          "--meta",
          `onehub_commit=${head}`,
          "--env",
          `COMMIT_SHA=${head}`,
        ],
        { cwd: root, env: venv },
      );
      if (dep.status !== 0) throw new Red(`vercel deploy lỗi (mã ${dep.status})`);
      newUrl = dep.stdout
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => /^https?:\/\/\S+$/.test(l))
        .pop();
      if (!newUrl) throw new Red("vercel deploy không trả địa chỉ bản mới");
    },
    "kiem-nhanh": async () => {
      const r = await kiemNhanh(newUrl, { env: appEnv, commit: head }, env);
      if (!r.ok) throw new Red(r.reason);
    },
    "gan-ten-mien": async () => {
      newId = deploymentAt(newUrl, { cwd: root, env })?.id;
      before = deploymentAt(env["APP_URL"], { cwd: root, env });
      const r = vercel(["promote", newUrl, "--yes"], { cwd: root, env });
      if (r.status !== 0) throw new Red(`vercel promote lỗi (mã ${r.status})`);
      promoted = true;
    },
    "kiem-nhanh-ten-mien": async () => {
      const r = await kiemNhanh(env["APP_URL"], { env: appEnv, commit: head }, env);
      if (!r.ok) throw new Red(r.reason);
    },
  };

  for (const step of STEPS[appEnv]) {
    try {
      await steps[step]();
      say(`${step} đạt`);
    } catch (err) {
      const reason =
        err instanceof Red ? err.message : `lỗi không lường: ${redact(err?.message, env)}`;
      say(`${step} ĐỎ — ${reason}`);
      if (!promoted) {
        say(`DỪNG ở ${step} — tên miền không đổi`);
        return 1;
      }
      return await rollBack(appEnv, { root, env, say, before, newId });
    }
  }
  say(`xong ${short(head)}`);
  return 0;
}

async function main() {
  const appEnv = process.argv[2];
  if (!ENVS.includes(appEnv)) {
    console.log("deploy: ENV phải là staging hay production");
    process.exit(2);
  }
  process.exit(await lenBan(appEnv));
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
