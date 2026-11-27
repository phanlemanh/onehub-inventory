// make dat-khoa ENV=staging|production|all (row dat-khoa-mot-lenh, AC-1..AC-3). The owner pastes each key a service
// issued, once; the command generates the two keys that can be generated, and sets every one as a secret of the
// GitHub environment. Values go to `gh secret set` through its standard input only — never on a command line — and
// no value is ever printed, also when something fails.
//
//   pasted, asked once for all targets:  VERCEL_TOKEN
//   pasted, per environment:             MIGRATE_DATABASE_URL (Supabase › Connect › Session pooler; when the string
//                                        still says [YOUR-PASSWORD] the command asks the password and puts it in),
//                                        RESEND_API_KEY, VERCEL_AUTOMATION_BYPASS_SECRET (optional)
//   generated when absent, or with --xoay: AUTH_SECRET (48 random bytes, base64url), LOGIN_DB_PASSWORD (40 letters
//                                        and digits)
//
// An empty answer keeps the secret the environment already has; for a secret it does not have yet, it is red. Every
// answer is checked before anything is set: one wrong answer, nothing set. Prints `dat-khoa <env>: đặt|giữ|sinh <name>`
// per secret and `dat-khoa <env>: xong`. Exit 0 done, 1 red, 2 usage.
import { spawnSync } from "node:child_process";
import { randomBytes, randomInt } from "node:crypto";
import { readFileSync } from "node:fs";
import { createInterface } from "node:readline";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const ENVS = ["staging", "production"];
export const SHARED = ["VERCEL_TOKEN"];
export const PER_ENV = ["MIGRATE_DATABASE_URL", "RESEND_API_KEY"];
export const OPTIONAL = ["VERCEL_AUTOMATION_BYPASS_SECRET"];
export const GENERATED = ["AUTH_SECRET", "LOGIN_DB_PASSWORD"];
const PLACEHOLDER = "[YOUR-PASSWORD]";
const ALNUM = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

class Red extends Error {}

export const FORMAT = {
  AUTH_SECRET: /^[A-Za-z0-9_-]{64}$/,
  LOGIN_DB_PASSWORD: /^[A-Za-z0-9]{40}$/,
};

/** A fresh value of a generated secret. */
export function generate(name) {
  if (name === "AUTH_SECRET") return randomBytes(48).toString("base64url");
  let out = "";
  for (let i = 0; i < 40; i++) out += ALNUM[randomInt(ALNUM.length)];
  return out;
}

/** The reason a pasted value is wrong, or null. The reason never quotes the value. */
export function problem(name, value) {
  if (name === "VERCEL_TOKEN") return /\s/.test(value) ? "VERCEL_TOKEN: có khoảng trắng" : null;
  if (name === "RESEND_API_KEY")
    return value.startsWith("re_") ? null : "RESEND_API_KEY: không bắt đầu bằng re_";
  if (name === "MIGRATE_DATABASE_URL") {
    let u;
    try {
      u = new URL(value);
    } catch {
      // A password with @ : / # pasted as is breaks the string; the placeholder route encodes it.
      return /^postgres(ql)?:\/\//.test(value)
        ? "MIGRATE_DATABASE_URL: không đọc được — dán chuỗi còn chữ [YOUR-PASSWORD] để lệnh tự điền mật khẩu"
        : "MIGRATE_DATABASE_URL: không phải chuỗi postgresql://";
    }
    if (!/^postgres(ql)?:$/.test(u.protocol) || !u.hostname) {
      return "MIGRATE_DATABASE_URL: không phải chuỗi postgresql://";
    }
    if (u.port === "6543") {
      return "MIGRATE_DATABASE_URL: cổng 6543 là Transaction pooler, cần Session pooler cổng 5432";
    }
    if (!/^postgres(\.[a-z0-9]+)?$/.test(decodeURIComponent(u.username))) {
      return "MIGRATE_DATABASE_URL: người dùng phải là postgres của dự án";
    }
    if (!u.password) return "MIGRATE_DATABASE_URL: thiếu mật khẩu";
  }
  return null;
}

/** Puts a password into a pooler string that still says [YOUR-PASSWORD], encoded for a URL. */
export function withPassword(url, password) {
  return url.split(PLACEHOLDER).join(encodeURIComponent(password));
}

function realGh(args, input) {
  const r = spawnSync("gh", args, { input: input ?? "", encoding: "utf8" });
  return { status: r.status ?? 1, stdout: r.stdout ?? "", stderr: r.stderr ?? "" };
}

/**
 * Asks on the terminal without echo. When standard input is not a terminal (a pipe, a test), answers are read from it
 * one line each, in the order the questions come.
 */
export function terminalAsk({ input = process.stdin, output = process.stderr } = {}) {
  if (!input.isTTY) {
    const lines = readFileSync(0, "utf8").split("\n");
    return async (question) => {
      process.stderr.write(question);
      process.stderr.write("\n");
      return (lines.shift() ?? "").replace(/\r$/, "");
    };
  }
  return (question) =>
    new Promise((done) => {
      const rl = createInterface({ input, output, terminal: true });
      rl._writeToOutput = () => {};
      rl.question("", (answer) => {
        rl.close();
        output.write("\n");
        done(answer.trim());
      });
      // After rl.question: readline clears the current line when it starts a question, so a question written before
      // it was erased and the person saw an empty line.
      output.write(question);
    });
}

export async function datKhoa(
  target,
  { rotate = false, ask = terminalAsk(), gh = realGh, out = console.log } = {},
) {
  const say = (text) => out(`dat-khoa: ${text}`);
  const envs = target === "all" ? ENVS : ENVS.includes(target) ? [target] : null;
  if (!envs) {
    say("ENV phải là staging, production hay all");
    return 2;
  }
  try {
    // 1. Check before asking anything.
    if (gh(["auth", "status"]).status !== 0) throw new Red("gh chưa đăng nhập");
    const view = gh(["repo", "view", "--json", "nameWithOwner", "-q", ".nameWithOwner"]);
    const repo = view.stdout.trim();
    if (view.status !== 0 || !repo) throw new Red("không đọc được kho GitHub của thư mục này");
    const existing = {};
    for (const env of envs) {
      if (gh(["api", `repos/${repo}/environments/${env}`]).status !== 0) {
        throw new Red(`môi trường ${env} chưa có trên GitHub`);
      }
      if (gh(["api", `repos/${repo}/environments/${env}/secrets/public-key`]).status !== 0) {
        throw new Red(
          `không đọc được khoá công khai của môi trường ${env} — cần quyền quản trị kho`,
        );
      }
      const list = gh([
        "secret",
        "list",
        "--env",
        env,
        "--repo",
        repo,
        "--json",
        "name",
        "-q",
        ".[].name",
      ]);
      if (list.status !== 0) throw new Red(`không đọc được danh sách khoá của môi trường ${env}`);
      existing[env] = new Set(
        list.stdout
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
      );
    }

    // 2. Ask, once each; then check every answer before setting anything.
    const errors = [];
    const answers = Object.fromEntries(envs.map((env) => [env, {}]));
    const hasAll = (name) => envs.every((env) => existing[env].has(name));
    const take = (env, name, value, required) => {
      if (value === "") {
        if (required && !existing[env].has(name))
          errors.push(`${name}: chưa có trên GitHub, không được bỏ trống`);
        return;
      }
      const why = problem(name, value);
      if (why) errors.push(why);
      else answers[env][name] = value;
    };
    const token = await ask("VERCEL_TOKEN (dán rồi Enter; để trống thì giữ khoá đang có): ");
    if (token === "" && !hasAll("VERCEL_TOKEN")) {
      errors.push("VERCEL_TOKEN: chưa có trên GitHub, không được bỏ trống");
    }
    for (const env of envs) take(env, "VERCEL_TOKEN", token, false);
    for (const env of envs) {
      let url = await ask(
        `${env} · MIGRATE_DATABASE_URL (chuỗi Session pooler; để trống thì giữ): `,
      );
      if (url.includes(PLACEHOLDER)) {
        const pw = await ask(`${env} · mật khẩu vai chủ Supabase: `);
        url = pw === "" ? "" : withPassword(url, pw);
        if (pw === "") errors.push("MIGRATE_DATABASE_URL: thiếu mật khẩu");
      }
      take(env, "MIGRATE_DATABASE_URL", url, true);
      take(env, "RESEND_API_KEY", await ask(`${env} · RESEND_API_KEY (để trống thì giữ): `), true);
      take(
        env,
        "VERCEL_AUTOMATION_BYPASS_SECRET",
        await ask(`${env} · VERCEL_AUTOMATION_BYPASS_SECRET (tuỳ chọn; để trống thì bỏ qua): `),
        false,
      );
    }
    if (errors.length) {
      for (const e of [...new Set(errors)]) say(e);
      throw new Red("chưa đặt khoá nào");
    }

    // 3. Set: pasted, then generated. Values only on standard input.
    for (const env of envs) {
      const done = [];
      const set = (name, value, verb) => {
        const r = gh(["secret", "set", name, "--env", env, "--repo", repo], value);
        if (r.status !== 0) {
          say(
            `${env}: lỗi khi đặt ${name}; đã đặt: ${done.length ? done.join(", ") : "chưa khoá nào"}`,
          );
          throw new Red(`dừng ở ${name} — chạy lại, để trống các khoá đã đặt`);
        }
        done.push(name);
        out(`dat-khoa ${env}: ${verb} ${name}`);
      };
      for (const name of [...SHARED, ...PER_ENV, ...OPTIONAL]) {
        if (name in answers[env]) set(name, answers[env][name], "đặt");
        else if (existing[env].has(name)) out(`dat-khoa ${env}: giữ ${name}`);
      }
      for (const name of GENERATED) {
        if (rotate || !existing[env].has(name)) set(name, generate(name), "sinh");
        else out(`dat-khoa ${env}: giữ ${name}`);
      }
      out(`dat-khoa ${env}: xong`);
    }
    return 0;
  } catch (err) {
    say(err instanceof Red ? err.message : "lỗi không lường");
    return 1;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const target = args.find((a) => !a.startsWith("--")) ?? "all";
  process.exit(await datKhoa(target, { rotate: args.includes("--xoay") }));
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
