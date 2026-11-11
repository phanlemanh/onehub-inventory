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
] as const;

/** Only for a development machine; production refuses to run without its own secret. */
const DEV_SECRET = "dev-only-secret-not-for-production";

export class AuthConfigError extends Error {
  constructor(readonly missing: readonly string[]) {
    super(`thiếu biến môi trường cho đăng nhập: ${missing.join(", ")}`);
    this.name = "AuthConfigError";
  }
}

export interface AuthConfig {
  databaseUrl: string | null;
  secret: string;
  sender: CodeSender;
  /** Sends the invitation mail of row 9, with the same Resend key and sender address. */
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
}

export function readAuthConfig(env: Env, fetchImpl?: typeof fetch): AuthConfig {
  const production = env["NODE_ENV"] === "production";
  assertProductionConfig(env);
  if (production) {
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
        ...(fetchImpl ? { fetch: fetchImpl } : {}),
      }),
    };
  }
  return {
    production,
    databaseUrl: present(env, "DATABASE_URL") ? (env["DATABASE_URL"] as string) : null,
    secret: present(env, "AUTH_SECRET") ? (env["AUTH_SECRET"] as string) : DEV_SECRET,
    sender: devSender(present(env, "LOGIN_CODE_OUTBOX") ? env["LOGIN_CODE_OUTBOX"] : undefined),
    inviteSender: devInviteSender(
      present(env, "LOGIN_CODE_OUTBOX") ? env["LOGIN_CODE_OUTBOX"] : undefined,
    ),
  };
}
