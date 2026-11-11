// Sign-in with an emailed code (row 8). Every database call goes through the one door, withCompany, with no company
// set, and reaches the identity schema only through the six narrow functions of migration 002.
import {
  CODE_MAX_ATTEMPTS,
  CODE_REQUEST_LIMIT,
  CODE_REQUEST_WINDOW_SEC,
  CODE_TTL_SEC,
  SESSION_REFRESH_AFTER_SEC,
  SESSION_TTL_SEC,
} from "./constants";
import {
  generateCode,
  hashCode,
  hashToken,
  isCodeShape,
  newSessionToken,
  normalizeCode,
  normalizeEmail,
} from "./code";
import type { CodeSender } from "./sender";
import { withCompany, type CompanyContext, type DbClient, type DbPool } from "./with-company";

export interface LoginDeps {
  pool: DbPool;
  secret: string;
  sender: CodeSender;
}

export interface CompanyRef {
  id: string;
  name: string;
}

export interface Session {
  userId: string;
  email: string;
  name: string;
  company: CompanyRef | null;
  companyCount: number;
  expiresAt: Date;
}

export type RequestCodeResult = "sent" | "limited";
export type VerifyCodeResult =
  | { status: "ok"; token: string; companyCount: number }
  | { status: "invalid" }
  | { status: "no-company" };

/** No person and no company yet: the functions decide on the token or email they are given. */
const NOBODY: CompanyContext = { userId: "", companyId: null };

function run<T>(deps: LoginDeps, fn: (client: DbClient) => Promise<T>): Promise<T> {
  return withCompany(deps.pool, NOBODY, fn);
}

/** Records the request and, only for an email with an account in at least one company, sends a new code. */
export async function requestCode(deps: LoginDeps, rawEmail: string): Promise<RequestCodeResult> {
  const email = normalizeEmail(rawEmail);
  const code = generateCode();
  const outcome = await run(deps, async (client) => {
    const { rows } = await client.query(
      "select app.login_request_code($1, $2, $3, $4, $5) as outcome",
      [
        email,
        hashCode(deps.secret, email, code),
        CODE_TTL_SEC,
        CODE_REQUEST_LIMIT,
        CODE_REQUEST_WINDOW_SEC,
      ],
    );
    return (rows[0] as { outcome: string }).outcome;
  });
  if (outcome === "limited") return "limited";
  if (outcome === "send") await deps.sender({ email, code });
  return "sent";
}

/** Trades a code for a session. Any failure — wrong, expired, used, replaced, unknown email — is one result. */
export async function verifyCode(
  deps: LoginDeps,
  rawEmail: string,
  rawCode: string,
): Promise<VerifyCodeResult> {
  const email = normalizeEmail(rawEmail);
  const code = normalizeCode(rawCode);
  if (!isCodeShape(code)) return { status: "invalid" };
  const token = newSessionToken();
  const row = await run(deps, async (client) => {
    const { rows } = await client.query(
      "select status, company_count from app.login_verify_code($1, $2, $3, $4, $5)",
      [
        email,
        hashCode(deps.secret, email, code),
        hashToken(token),
        SESSION_TTL_SEC,
        CODE_MAX_ATTEMPTS,
      ],
    );
    return rows[0] as { status: string; company_count: number };
  });
  if (row.status === "ok") return { status: "ok", token, companyCount: row.company_count };
  if (row.status === "no-company") return { status: "no-company" };
  return { status: "invalid" };
}

interface SessionRow {
  user_id: string;
  email: string;
  name: string;
  company_id: string | null;
  company_name: string | null;
  company_count: number;
  expires_at: Date;
}

/** The person behind a token, or null. Slides the expiry and drops a company the person no longer belongs to. */
export async function readSession(
  deps: Pick<LoginDeps, "pool">,
  token: string | undefined,
): Promise<Session | null> {
  if (!token) return null;
  const row = await withCompany(deps.pool, NOBODY, async (client) => {
    const { rows } = await client.query("select * from app.session_read($1, $2, $3)", [
      hashToken(token),
      SESSION_TTL_SEC,
      SESSION_REFRESH_AFTER_SEC,
    ]);
    return rows[0] as SessionRow | undefined;
  });
  if (!row) return null;
  return {
    userId: row.user_id,
    email: row.email,
    name: row.name,
    company: row.company_id ? { id: row.company_id, name: row.company_name ?? "" } : null,
    companyCount: row.company_count,
    expiresAt: new Date(row.expires_at),
  };
}

/** What the door needs for every company query of this session. */
export function sessionContext(session: Session): CompanyContext {
  return { userId: session.userId, companyId: session.company?.id ?? null };
}

export async function sessionCompanies(
  deps: Pick<LoginDeps, "pool">,
  token: string,
): Promise<CompanyRef[]> {
  return withCompany(deps.pool, NOBODY, async (client) => {
    const { rows } = await client.query("select id, name from app.session_companies($1)", [
      hashToken(token),
    ]);
    return rows as CompanyRef[];
  });
}

export async function chooseCompany(
  deps: Pick<LoginDeps, "pool">,
  token: string,
  companyId: string,
): Promise<boolean> {
  return withCompany(deps.pool, NOBODY, async (client) => {
    const { rows } = await client.query("select app.session_set_company($1, $2) as ok", [
      hashToken(token),
      companyId,
    ]);
    return (rows[0] as { ok: boolean }).ok;
  });
}

export async function endSession(deps: Pick<LoginDeps, "pool">, token: string): Promise<void> {
  await withCompany(deps.pool, NOBODY, async (client) => {
    await client.query("select app.session_end($1)", [hashToken(token)]);
  });
}
