// The single door to company tables (product invariant 1, SP-1). Every call is one transaction that runs as
// quy_hang_app — a role that does not own the tables — with the user and company set for that transaction only,
// so Postgres row level security always applies. The company may be empty: listing a person's companies happens
// before one is chosen.
//
// Row 7c: the app connects as quy_hang_login, which owns nothing and is a member of quy_hang_app without inheriting it,
// so code inside the door that resets or switches role cannot get back to the table owner. Before its first
// transaction on a pool the door checks the connection's role and refuses to run on one that can reach a table owner
// or bypass row level security. No parameter turns the check off.
//
// Copied from packages/api/src/db.ts of onehub-quy-hang (commit 1729b11f); only the types changed. The door is typed
// against the smallest shape of a pool, so tests can pass a fake one; pg.Pool fits it as is. This file is the only
// one that loads the Postgres driver (one-door.test.ts).
import pg from "pg";

/** The API role. It owns no table, is not a superuser and cannot bypass row level security. */
export const APP_ROLE = "quy_hang_app";

/** Switches the transaction to the API role. The isolation suite (db/tests/cach-ly.sql) runs this exact text. */
export const SET_ROLE_SQL = "set local role quy_hang_app";

/** The role the app logs in as (migration 008). */
export const LOGIN_ROLE = "quy_hang_login";

/**
 * Always exactly one row: the session's role and why the door refuses it, or null. Order: a table owner it can reach
 * (itself included), superuser, bypassing row security (itself or a role it can reach), a function owner it can reach,
 * not able to switch to the API role.
 */
export const CHECK_LOGIN_ROLE_SQL = `select session_user::text as vai, coalesce(
  (select 'về được vai chủ ' || o.rolname from pg_class c
     join pg_namespace n on n.oid = c.relnamespace join pg_roles o on o.oid = c.relowner
   where n.nspname not in ('pg_catalog', 'information_schema') and n.nspname not like 'pg\\_%'
     and pg_has_role(session_user, c.relowner, 'MEMBER')
   order by o.rolname limit 1),
  (select 'là siêu người dùng' from pg_roles where rolname = session_user and rolsuper),
  (select 'vượt được luật theo dòng' from pg_roles where rolname = session_user and rolbypassrls),
  (select 'vượt được luật theo dòng qua ' || x.rolname from pg_roles x
   where (x.rolbypassrls or x.rolsuper) and pg_has_role(session_user, x.oid, 'MEMBER')
   order by x.rolname limit 1),
  (select 'về được vai chủ ' || o.rolname from pg_proc p
     join pg_namespace n on n.oid = p.pronamespace join pg_roles o on o.oid = p.proowner
   where n.nspname not in ('pg_catalog', 'information_schema')
     and pg_has_role(session_user, p.proowner, 'MEMBER')
   order by o.rolname limit 1),
  (select 'không đổi được sang quy_hang_app' where not pg_has_role(session_user, 'quy_hang_app', 'MEMBER'))
) as loi`;

/** Thrown when the connection's role could get back to a table owner; names the role and the reason, never the URL. */
export class LoginRoleError extends Error {
  constructor(
    readonly role: string,
    readonly reason: string,
  ) {
    super(`cửa từ chối vai nối ${role}: ${reason} — nối bằng ${LOGIN_ROLE}`);
    this.name = "LoginRoleError";
  }
}

/** Pools whose role passed the check. A refusal is not remembered: a fixed configuration is seen on the next call. */
const checked = new WeakSet<DbPool>();

async function checkLoginRole(pool: DbPool, client: DbClient): Promise<void> {
  if (checked.has(pool)) return;
  const { rows } = await client.query(CHECK_LOGIN_ROLE_SQL);
  const row = rows[0] as { vai?: string; loi?: string | null } | undefined;
  if (rows.length !== 1 || !row) throw new LoginRoleError("?", "không đọc được vai của kết nối");
  if (row.loi !== null) throw new LoginRoleError(row.vai ?? "?", row.loi ?? "không đọc được lý do");
  checked.add(pool);
}

/** Sets user ($1) and company ($2) for the transaction only. The isolation suite prepares this exact text. */
export const SET_CONTEXT_SQL =
  "select set_config('app.user_id', $1, true), set_config('app.company_id', $2, true)";

export interface DbClient {
  query(text: string, params?: unknown[]): Promise<{ rows: unknown[]; rowCount: number | null }>;
  release(): void;
}

export interface DbPool {
  connect(): Promise<DbClient>;
}

/** A pool of connections to `url`. Every statement on it still goes through `withCompany`. */
export function createPool(url: string): DbPool {
  const pool = new pg.Pool({ connectionString: url, max: 10 });
  // An idle connection the server closes (restart, failover) must not take the process down; the next query
  // opens a new one.
  pool.on("error", (err) => console.error("[co-so-du-lieu] kết nối rảnh bị đóng:", err.message));
  return pool;
}

export interface CompanyContext {
  userId: string;
  companyId: string | null;
}

export async function withCompany<T>(
  pool: DbPool,
  ctx: CompanyContext,
  fn: (client: DbClient) => Promise<T>,
): Promise<T> {
  const client = await pool.connect();
  try {
    await checkLoginRole(pool, client);
  } catch (err) {
    client.release();
    throw err;
  }
  try {
    await client.query("begin");
    await client.query(SET_ROLE_SQL);
    await client.query(SET_CONTEXT_SQL, [ctx.userId, ctx.companyId ?? ""]);
    const result = await fn(client);
    await client.query("commit");
    return result;
  } catch (err) {
    // A failed rollback must not hide the error that caused it.
    await client.query("rollback").catch(() => {});
    throw err;
  } finally {
    client.release();
  }
}
