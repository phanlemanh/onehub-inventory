// What sign-in needs from the environment. Production never falls back to the development sender or secret: a
// missing variable stops the server at start (src/instrumentation.ts) and, if it slips through, fails the request.
import { devInviteSender, resendInviteSender, type InviteSender } from "./invite-mail";
import { devSender, resendSender, type CodeSender } from "./sender";

export type Env = Readonly<Record<string, string | undefined>>;

/** Variables production must have. */
export const PRODUCTION_VARS = [
  "DATABASE_URL",
  "AUTH_SECRET",
  "RESEND_API_KEY",
  "MAIL_FROM",
  "APP_URL",
] as const;

/** Only for a development machine; production refuses to run without its own secret. */
const DEV_SECRET = "dev-only-secret-not-for-production";

export class AuthConfigError extends Error {
  constructor(
    readonly missing: readonly string[],
    message = `thiếu biến môi trường cho đăng nhập: ${missing.join(", ")}`,
  ) {
    super(message);
    this.name = "AuthConfigError";
  }
}

/**
 * APP_URL — the product's own address, the base of the sign-in link in every invitation (row 9d). Absolute, no user
 * or password, no `?` or `#`; production takes https only. Returns it without a trailing slash, or null when it is
 * malformed. The value itself never goes into an error: it may carry a password.
 */
export function parseAppUrl(raw: string, production: boolean): string | null {
  const value = raw.trim();
  if (value.includes("?") || value.includes("#")) return null;
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }
  const schemes = production ? ["https:"] : ["https:", "http:"];
  if (!schemes.includes(url.protocol) || url.username !== "" || url.password !== "") return null;
  return `${url.origin}${url.pathname}`.replace(/\/+$/, "");
}

function badAppUrl(production: boolean): AuthConfigError {
  const scheme = production ? "https" : "http hoặc https";
  return new AuthConfigError(
    ["APP_URL"],
    `APP_URL không đúng khuôn: cần địa chỉ ${scheme} tuyệt đối, không tên hay mật khẩu, không ? hay #`,
  );
}

export interface AuthConfig {
  databaseUrl: string | null;
  secret: string;
  sender: CodeSender;
  /** Sends the invitation mail of row 9, with the same Resend key and sender address; links to APP_URL (row 9d). */
  inviteSender: InviteSender;
  production: boolean;
}

function present(env: Env, name: string): boolean {
  return (env[name] ?? "").trim() !== "";
}

/** Throws when production lacks any of PRODUCTION_VARS, naming each one. */
export function assertProductionConfig(env: Env): void {
  if (env["NODE_ENV"] !== "production") return;
  const missing = PRODUCTION_VARS.filter((name) => !present(env, name));
  if (missing.length > 0) throw new AuthConfigError(missing);
  if (parseAppUrl(env["APP_URL"] as string, true) === null) throw badAppUrl(true);
}

/** What the start of a production server needs on top of sign-in: which environment it is (row 22). */
export const STARTUP_VARS = [...PRODUCTION_VARS, "APP_ENV"] as const;

/** The environments a production build runs as: the trial copy and the real one. */
export const APP_ENVS = ["staging", "production"] as const;

/** Variables of a development or test machine only; a production server with any of them does not start. */
export const FORBIDDEN_IN_PRODUCTION = [
  "LOGIN_CODE_OUTBOX",
  "NEXT_PUBLIC_E2E_BUTTON_RECORD",
  "MIGRATE_DATABASE_URL",
] as const;

/** The database role the server signs in as; it owns no table and switches to the query role (SP-1). */
export const LOGIN_ROLE = "quy_hang_login";

/** The real product's own address (decision 0041). */
export const PRODUCTION_APP_URL = "https://inventory.onehub.center";

/** Mail leaves from this domain or one of its subdomains, the ones Resend can verify (Hỏi-7). */
export const MAIL_DOMAIN = "onehub.center";

/**
 * The database role in an address, or null when the address cannot be read. Supabase's shared pooler names the user
 * `<role>.<project ref>` (a ref is 20 lower-case letters); the role is the part before it.
 */
function databaseUser(raw: string): string | null {
  try {
    const user = decodeURIComponent(new URL(raw.trim()).username).replace(/\.[a-z]{20}$/, "");
    return user === "" ? null : user;
  } catch {
    return null;
  }
}

/** The domain of a sender address, `Name <a@b>` or `a@b`, lower case; null when there is none. */
function mailDomain(raw: string): string | null {
  const value = raw.trim();
  const address = (/<([^<>]*)>\s*$/.exec(value)?.[1] ?? value).trim();
  const at = address.lastIndexOf("@");
  if (at <= 0 || at === address.length - 1 || /\s/.test(address)) return null;
  return address.slice(at + 1).toLowerCase();
}

/**
 * The start-up check of a production build, staging or production (AC-5 of row 22): sign-in configuration, which
 * environment it is, no variable of a development machine, the login role, the real address and the mail domain.
 * Every problem names its variable and why; no value of any variable goes into the error. Outside NODE_ENV=production
 * nothing is checked: development machines and tests run as before.
 */
export function assertStartupConfig(env: Env): void {
  if (env["NODE_ENV"] !== "production") return;
  const missing = STARTUP_VARS.filter((name) => !present(env, name));
  if (missing.length > 0) throw new AuthConfigError(missing);
  assertProductionConfig(env);
  const problems: { name: string; why: string }[] = [];
  const appEnv = (env["APP_ENV"] as string).trim();
  if (!(APP_ENVS as readonly string[]).includes(appEnv))
    problems.push({ name: "APP_ENV", why: `phải là ${APP_ENVS.join(" hoặc ")}` });
  for (const name of FORBIDDEN_IN_PRODUCTION)
    if (present(env, name))
      problems.push({
        name,
        why: "chỉ dùng cho máy dev hay máy kiểm, bản dựng thật không được có",
      });
  if (databaseUser(env["DATABASE_URL"] as string) !== LOGIN_ROLE)
    problems.push({ name: "DATABASE_URL", why: `phải nối bằng vai ${LOGIN_ROLE}` });
  if (appEnv === "production" && parseAppUrl(env["APP_URL"] as string, true) !== PRODUCTION_APP_URL)
    problems.push({ name: "APP_URL", why: `bản thật phải là ${PRODUCTION_APP_URL}` });
  const domain = mailDomain(env["MAIL_FROM"] as string);
  if (domain === null || (domain !== MAIL_DOMAIN && !domain.endsWith(`.${MAIL_DOMAIN}`)))
    problems.push({
      name: "MAIL_FROM",
      why: `địa chỉ gửi phải thuộc tên miền ${MAIL_DOMAIN} hay một tên miền con của nó`,
    });
  if (problems.length > 0)
    throw new AuthConfigError(
      problems.map((p) => p.name),
      `cấu hình bản dựng thật sai: ${problems.map((p) => `${p.name} ${p.why}`).join("; ")}`,
    );
}

export function readAuthConfig(env: Env, fetchImpl?: typeof fetch): AuthConfig {
  const production = env["NODE_ENV"] === "production";
  assertProductionConfig(env);
  if (production) {
    const appUrl = parseAppUrl(env["APP_URL"] as string, true) as string;
    return {
      production,
      databaseUrl: env["DATABASE_URL"] as string,
      secret: env["AUTH_SECRET"] as string,
      sender: resendSender({
        apiKey: env["RESEND_API_KEY"] as string,
        from: env["MAIL_FROM"] as string,
        ...(fetchImpl ? { fetch: fetchImpl } : {}),
      }),
      inviteSender: resendInviteSender({
        apiKey: env["RESEND_API_KEY"] as string,
        from: env["MAIL_FROM"] as string,
        appUrl,
        ...(fetchImpl ? { fetch: fetchImpl } : {}),
      }),
    };
  }
  // A development machine without APP_URL links to the request's origin: each lane runs on its own port.
  let devAppUrl: string | undefined;
  if (present(env, "APP_URL")) {
    devAppUrl = parseAppUrl(env["APP_URL"] as string, false) ?? undefined;
    if (devAppUrl === undefined) throw badAppUrl(false);
  }
  return {
    production,
    databaseUrl: present(env, "DATABASE_URL") ? (env["DATABASE_URL"] as string) : null,
    secret: present(env, "AUTH_SECRET") ? (env["AUTH_SECRET"] as string) : DEV_SECRET,
    sender: devSender(present(env, "LOGIN_CODE_OUTBOX") ? env["LOGIN_CODE_OUTBOX"] : undefined),
    inviteSender: devInviteSender(
      present(env, "LOGIN_CODE_OUTBOX") ? env["LOGIN_CODE_OUTBOX"] : undefined,
      devAppUrl,
    ),
  };
}
