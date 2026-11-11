// The running server's sign-in: one pool per process, configuration read from the environment on first use.
import { cookies } from "next/headers";

import { readAuthConfig } from "./config";
import { SESSION_COOKIE } from "./constants";
import { createAuthHandlers, type AuthHandlers } from "./http";
import {
  readSession,
  sessionCompanies,
  type CompanyRef,
  type LoginDeps,
  type Session,
} from "./login";
import { createPool } from "./with-company";

let deps: LoginDeps | null | undefined;

function liveDeps(): LoginDeps | null {
  if (deps !== undefined) return deps;
  const config = readAuthConfig(process.env);
  deps = config.databaseUrl
    ? { pool: createPool(config.databaseUrl), secret: config.secret, sender: config.sender }
    : null;
  return deps;
}

let handlers: AuthHandlers | undefined;

/** The handlers behind /api/v1/auth. */
export function authHandlers(): AuthHandlers {
  handlers ??= createAuthHandlers(liveDeps, { production: process.env.NODE_ENV === "production" });
  return handlers;
}

export interface CurrentSession extends Session {
  companies: CompanyRef[];
}

/**
 * The signed-in person of this request, or null — also null when sign-in is not configured on a development machine
 * (no DATABASE_URL), so screens on sample data still render.
 */
export async function currentSession(): Promise<CurrentSession | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  let d: LoginDeps | null;
  try {
    d = liveDeps();
  } catch {
    return null;
  }
  if (!d) return null;
  try {
    const session = await readSession(d, token);
    if (!session) return null;
    return { ...session, companies: await sessionCompanies(d, token) };
  } catch (err) {
    console.error(
      "[dang-nhap] không đọc được phiên:",
      err instanceof Error ? err.message : "không rõ",
    );
    return null;
  }
}
