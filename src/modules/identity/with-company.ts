// The single door to company tables (product invariant 1, SP-1). Every call is one transaction that runs as
// quy_hang_app — a role that does not own the tables — with the user and company set for that transaction only,
// so Postgres row level security always applies. The company may be empty: listing a person's companies happens
// before one is chosen.
//
// Copied from packages/api/src/db.ts of onehub-quy-hang (commit 1729b11f); only the types changed. The repo has no
// Postgres driver yet, so the door is typed against the smallest shape of a pool; pg.Pool fits it as is.

/** The API role. It owns no table, is not a superuser and cannot bypass row level security. */
export const APP_ROLE = "quy_hang_app";

/** Switches the transaction to the API role. The isolation suite (db/tests/cach-ly.sql) runs this exact text. */
export const SET_ROLE_SQL = "set local role quy_hang_app";

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
