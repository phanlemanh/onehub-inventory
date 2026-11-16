// make rollback ENV=staging|production (row moi-truong-thu-va-ban-that, AC-4): point the domain back at the deployment
// before the one it serves now, once, then check the domain. No previous deployment → refuse without calling rollback.
//
// The current deployment is the newest READY production deployment whose commit (deploy metadata onehub_commit, set by
// len-ban.mjs) is the commit the domain's health reports; the previous one is the next older with another commit.
// Without metadata the newest READY production deployment counts as current.
//
//   VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID, APP_URL — checked for presence only, never printed.
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  ENVS,
  kiemNhanh,
  previousOf,
  productionDeployments,
  readHealth,
  short,
  vercel,
} from "./kiem-nhanh.mjs";

export const REQUIRED = ["VERCEL_TOKEN", "VERCEL_ORG_ID", "VERCEL_PROJECT_ID", "APP_URL"];

export async function luiBan(
  appEnv,
  { cwd = process.cwd(), env = process.env, out = console.log } = {},
) {
  const say = (text) => out(`rollback ${appEnv}: ${text}`);
  const missing = REQUIRED.filter((n) => !env[n]?.trim());
  if (missing.length) {
    say(`ĐỎ — thiếu biến ${missing.join(", ")}`);
    return 1;
  }
  const now = await readHealth(env["APP_URL"], env);
  const list = productionDeployments({ cwd, env });
  if (!list) {
    say("ĐỎ — không đọc được danh sách bản của Vercel");
    return 1;
  }
  const target = previousOf(list, { current: now.body?.commit });
  if (!target) {
    say("không có bản trước để lùi");
    return 1;
  }
  const rb = vercel(["rollback", target.url, "--yes"], { cwd, env });
  if (rb.status !== 0) {
    say(`ĐỎ — vercel rollback lỗi (mã ${rb.status})`);
    return 1;
  }
  const check = await kiemNhanh(env["APP_URL"], { env: appEnv, commit: target.commit }, env);
  if (!check.ok) {
    say(`kiem-nhanh-ten-mien ĐỎ — ${check.reason}`);
    return 1;
  }
  say(`tên miền chạy ${short(check.commit)}`);
  return 0;
}

async function main() {
  const appEnv = process.argv[2];
  if (!ENVS.includes(appEnv)) {
    console.log("rollback: ENV phải là staging hay production");
    process.exit(2);
  }
  process.exit(await luiBan(appEnv));
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
