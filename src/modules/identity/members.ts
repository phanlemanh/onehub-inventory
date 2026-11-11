// Members of a company and their roles (row 9, decision 0022). Every call goes through the one door, withCompany, with
// the person and company of the session, and reaches company_members only through the four narrow functions of
// migration 003: they check that the caller is a company admin and touch the session's company only.
import type { Role } from "../../generated/ontology";

import type { InviteSender } from "./invite-mail";
import { canonicalRoles, isRole } from "./roles";
import { withCompany, type CompanyContext, type DbPool } from "./with-company";

export interface MembersDeps {
  pool: DbPool;
  invite: InviteSender;
}

export interface MemberRow {
  userId: string;
  name: string;
  email: string;
  roles: Role[];
  invitedByName: string | null;
  invitedAt: string | null;
}

export interface InviteInput {
  email: string;
  name: string;
  roles: readonly Role[];
}

export type InviteResult =
  { status: "ok"; userId: string } | { status: "already-member" | "forbidden" };
export type SetRolesResult = "ok" | "not-member" | "last-admin" | "forbidden";

/** Postgres «insufficient_privilege», raised by app.member_list() for a caller who is not a company admin. */
const FORBIDDEN_SQLSTATE = "42501";

function roles(value: unknown): Role[] {
  return Array.isArray(value) ? canonicalRoles(value.filter(isRole)) : [];
}

/** The roles the session's person holds in the session's company; none outside it. */
export async function memberRoles(
  deps: Pick<MembersDeps, "pool">,
  ctx: CompanyContext,
): Promise<Role[]> {
  if (!ctx.companyId) return [];
  return withCompany(deps.pool, ctx, async (client) => {
    const { rows } = await client.query("select app.member_roles() as roles");
    return roles((rows[0] as { roles: unknown }).roles);
  });
}

export async function listMembers(
  deps: Pick<MembersDeps, "pool">,
  ctx: CompanyContext,
): Promise<MemberRow[] | "forbidden"> {
  try {
    return await withCompany(deps.pool, ctx, async (client) => {
      const { rows } = await client.query(
        "select user_id, name, email, roles, invited_by_name, invited_at from app.member_list()",
      );
      return (rows as Record<string, unknown>[]).map((r) => ({
        userId: String(r["user_id"]),
        name: String(r["name"]),
        email: String(r["email"]),
        roles: roles(r["roles"]),
        invitedByName: (r["invited_by_name"] as string | null) ?? null,
        invitedAt: r["invited_at"] ? new Date(r["invited_at"] as string).toISOString() : null,
      }));
    });
  } catch (err) {
    if ((err as { code?: string }).code === FORBIDDEN_SQLSTATE) return "forbidden";
    throw err;
  }
}

/**
 * Adds a person to the session's company and sends one invitation mail, in one transaction: a mail that fails rolls
 * the person back. An email that already has an account elsewhere answers exactly like a new one.
 */
export async function inviteMember(
  deps: MembersDeps,
  ctx: CompanyContext,
  input: InviteInput,
  origin: string,
): Promise<InviteResult> {
  return withCompany(deps.pool, ctx, async (client) => {
    const { rows } = await client.query(
      "select status, user_id from app.member_invite($1, $2, $3)",
      [input.email, input.name, canonicalRoles(input.roles)],
    );
    const row = rows[0] as { status: string; user_id: string | null };
    if (row.status === "already-member" || row.status === "forbidden")
      return { status: row.status };
    const names = await client.query(
      "select c.name as company, m.name as inviter from companies c join company_members m on m.company_id = c.id where m.user_id = $1",
      [ctx.userId],
    );
    const who = names.rows[0] as { company: string; inviter: string };
    await deps.invite({
      email: input.email.trim().toLowerCase(),
      companyName: who.company,
      inviterName: who.inviter,
      roles: input.roles,
      origin,
    });
    return { status: "ok", userId: String(row.user_id) };
  });
}

export async function setMemberRoles(
  deps: Pick<MembersDeps, "pool">,
  ctx: CompanyContext,
  userId: string,
  newRoles: readonly Role[],
): Promise<SetRolesResult> {
  return withCompany(deps.pool, ctx, async (client) => {
    const { rows } = await client.query("select app.member_set_roles($1, $2) as status", [
      userId,
      canonicalRoles(newRoles),
    ]);
    return (rows[0] as { status: SetRolesResult }).status;
  });
}
