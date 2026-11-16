// Read-only health of a running server (row moi-truong-thu-va-ban-that, AC-6): which commit runs, in which environment,
// and whether the connection role passes the query door's own check (SP-1). The role is judged by `withCompany` itself —
// an empty transaction through the door, no statement of ours — so there is one rule, not two. No company table is
// read, and the body never carries an address, a key or a driver message.
import { LoginRoleError, withCompany, type DbPool } from "./with-company";

/** Exactly these four keys, nothing else (AC-6). */
export interface Health {
  ok: boolean;
  commit: string;
  env: string;
  /** "dat" when the door accepts the connection role, otherwise a short reason that holds no secret. */
  vai: string;
}

export interface HealthDeps {
  env: Record<string, string | undefined>;
  /** The pool of this server; null when no database is configured, throws when the configuration cannot be read. */
  pool: () => DbPool | null;
}

/** Vercel sets VERCEL_GIT_COMMIT_SHA on every build; COMMIT_SHA covers a build made elsewhere. */
export function commitOf(env: Record<string, string | undefined>): string {
  return env["VERCEL_GIT_COMMIT_SHA"]?.trim() || env["COMMIT_SHA"]?.trim() || "unknown";
}

/** The environment name the deploy set (development, staging, production). */
export function envOf(env: Record<string, string | undefined>): string {
  return env["APP_ENV"]?.trim() || "development";
}

async function vaiOf(getPool: () => DbPool | null): Promise<string> {
  let pool: DbPool | null;
  try {
    pool = getPool();
  } catch {
    return "không đọc được cấu hình";
  }
  if (!pool) return "chưa cấu hình cơ sở dữ liệu";
  try {
    await withCompany(pool, { userId: "", companyId: null }, async () => undefined);
    return "dat";
  } catch (err) {
    // The door's own reason names the role and why; it never holds the address.
    if (err instanceof LoginRoleError) return err.message;
    return "không nối được cơ sở dữ liệu";
  }
}

/** The health of this server. `ok` is true only when the door accepts the connection role. */
export async function healthOf(deps: HealthDeps): Promise<Health> {
  const vai = await vaiOf(deps.pool);
  return { ok: vai === "dat", commit: commitOf(deps.env), env: envOf(deps.env), vai };
}
