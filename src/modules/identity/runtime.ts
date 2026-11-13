// The running server's sign-in: one pool per process, configuration read from the environment on first use.
import { cookies } from "next/headers";

import { openDoor, type DoorError, type OpenedDoor } from "./action-door";
import { readAuthConfig } from "./config";
import { SESSION_COOKIE } from "./constants";
import { createAuthHandlers, tokenFrom, type AuthHandlers } from "./http";
import {
  readSession,
  sessionCompanies,
  type CompanyRef,
  type LoginDeps,
  type Session,
} from "./login";
import { memberRoles, type MembersDeps } from "./members";
import { createMembersHandlers, type MembersHandlers } from "./members-http";
import type { ActionName } from "./permissions";
import { createPool, type DbPool } from "./with-company";
import type { Role } from "../../generated/ontology";

let deps: (LoginDeps & MembersDeps) | null | undefined;

function liveDeps(): (LoginDeps & MembersDeps) | null {
  if (deps !== undefined) return deps;
  const config = readAuthConfig(process.env);
  deps = config.databaseUrl
    ? {
        pool: createPool(config.databaseUrl),
        secret: config.secret,
        sender: config.sender,
        invite: config.inviteSender,
      }
    : null;
  return deps;
}

let handlers: AuthHandlers | undefined;

/** The handlers behind /api/v1/auth. */
export function authHandlers(): AuthHandlers {
  handlers ??= createAuthHandlers(liveDeps, { production: process.env.NODE_ENV === "production" });
  return handlers;
}

let membersHandlersCache: MembersHandlers | undefined;

/** The handlers behind /api/v1/members (row 9). */
export function membersHandlers(): MembersHandlers {
  membersHandlersCache ??= createMembersHandlers(liveDeps);
  return membersHandlersCache;
}

export interface CurrentSession extends Session {
  companies: CompanyRef[];
  /** Roles held in the session's company (row 9); none before a company is chosen. */
  roles: Role[];
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
    const companies = await sessionCompanies(d, token);
    const roles = session.company
      ? await memberRoles(d, { userId: session.userId, companyId: session.company.id })
      : [];
    return { ...session, companies, roles };
  } catch (err) {
    console.error(
      "[dang-nhap] không đọc được phiên:",
      err instanceof Error ? err.message : "không rõ",
    );
    return null;
  }
}

/** The pool of the running server, or null when the database is not configured here; a bad configuration throws. */
function livePool(): DbPool | null {
  return liveDeps()?.pool ?? null;
}

/** The shared action door (row 2c) for an API request of another module: who calls, and may they run `action`. */
export function actionDoor(req: Request, action: ActionName): Promise<OpenedDoor | DoorError> {
  return openDoor(livePool, tokenFrom(req), action);
}

/** The same door for a server component of this request, through the session cookie. */
export async function sessionDoor(action: ActionName): Promise<OpenedDoor | DoorError> {
  return openDoor(livePool, (await cookies()).get(SESSION_COOKIE)?.value, action);
}
