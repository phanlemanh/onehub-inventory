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
