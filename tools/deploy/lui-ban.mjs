// make rollback ENV=staging|production BAN=<id> (row moi-truong-thu-va-ban-that, AC-4): point the domain at the
// deployment the operator names, once, confirm the domain points there, then check it.
//
// There is no recorded "before" for a manual rollback, so nothing is guessed: without BAN the run prints the READY
// production deployments (id, url, commit, created, and which one the domain points to now, read from the domain with
// `vercel inspect`) and stops. BAN must be the exact id of one of them and must not be the one the domain points to.
//
//   VERCEL_ORG_ID, VERCEL_PROJECT_ID, APP_URL — checked for presence only, never printed.
//   VERCEL_TOKEN — CI. Without it the vercel CLI's signed-in session is used, after the checks of len-ban.mjs's
//   cau-hinh (signed in, the right project linked, XAC_NHAN_BAN_THAT=co for production). The first line says which.
//   BAN — the id of the deployment to go back to (make rollback ENV=… BAN=dpl_…).
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  deploymentAt,
  deploymentLines,
  envFor,
  ENVS,
  kiemNhanh,
  nameTheTarget,
  productionDeployments,
  sessionProblem,
  short,
  vercel,
  vercelMode,
  modeText,
} from "./kiem-nhanh.mjs";

export const REQUIRED = ["VERCEL_TOKEN", "VERCEL_ORG_ID", "VERCEL_PROJECT_ID", "APP_URL"];

export async function luiBan(
  appEnv,
  { cwd = process.cwd(), env: given = process.env, out = console.log } = {},
) {
  const say = (text) => out(`rollback ${appEnv}: ${text}`);
  const mode = vercelMode(given);
  const env = envFor(mode, given);
  say(modeText(mode));
  const missing = REQUIRED.filter((n) => mode === "khoa" || n !== "VERCEL_TOKEN").filter(
    (n) => !env[n]?.trim(),
  );
  if (missing.length) {
    say(`ĐỎ — thiếu biến ${missing.join(", ")}`);
    return 1;
  }
  if (mode === "phien") {
    const retry = `make rollback ENV=${appEnv} BAN=${env["BAN"]?.trim() || "<id>"} XAC_NHAN_BAN_THAT=co`;
    const session = sessionProblem(appEnv, { cwd, env, retry });
    if (session) {
      say(`ĐỎ — ${session}`);
      return 1;
    }
  }
  const list = productionDeployments({ cwd, env });
  if (!list) {
    say("ĐỎ — không đọc được danh sách bản của Vercel");
    return 1;
  }
  const holder = deploymentAt(env["APP_URL"], { cwd, env });
  const stop = (line) => {
    say(line);
    for (const l of deploymentLines(list, holder?.id)) say(l);
    say(nameTheTarget(appEnv));
    return 1;
  };
  const ban = env["BAN"]?.trim();
  if (!ban) return stop("DỪNG — chưa nêu bản cần lùi về, không đoán");
  const target = list.find((d) => d.id === ban);
  if (!target) return stop(`DỪNG — không thấy bản ${ban} trong danh sách bản production READY`);
  if (!holder) {
    say(`DỪNG — không đọc được bản tên miền đang trỏ tới, không lùi`);
    return 1;
  }
  if (holder.id === target.id) return stop(`DỪNG — tên miền đã ở bản ${ban}, không lùi`);
  const rb = vercel(["rollback", target.id, "--yes"], { cwd, env });
  if (rb.status !== 0) {
    say(`ĐỎ — vercel rollback lỗi (mã ${rb.status})`);
    return 1;
  }
  const now = deploymentAt(env["APP_URL"], { cwd, env });
  if (now?.id !== target.id) {
    say(`ĐỎ — tên miền chưa về bản ${target.id} (đang ở ${now?.id ?? "không đọc được"})`);
    return 1;
  }
  const check = await kiemNhanh(env["APP_URL"], { env: appEnv, commit: target.commit }, env);
  if (!check.ok) {
    say(`kiem-nhanh-ten-mien ĐỎ — ${check.reason}`);
    return 1;
  }
  say(`tên miền ở bản ${target.id}, chạy ${short(check.commit)}`);
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
