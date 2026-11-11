// The four roles a company admin can give, in the order of ontology/roles.yaml (row 1d). Browser-safe: the members
// screen draws one checkbox per role from this list. The database constraint of migration 003 lists the same four;
// tests/db/moi-nguoi.db.test.ts keeps the three in step.
import type { Role } from "../../generated/ontology";

export const ROLES = [
  "ListAgent",
  "BuyerAgent",
  "TeamLead",
  "CompanyAdmin",
] as const satisfies readonly Role[];

/** Fails to compile when ontology/roles.yaml gains a role this list does not have. */
type MissingRole = Exclude<Role, (typeof ROLES)[number]>;
export const ROLES_COMPLETE: [MissingRole] extends [never] ? true : never = true;

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && (ROLES as readonly string[]).includes(value);
}

/** Roles in register order, without repeats. */
export function canonicalRoles(roles: readonly Role[]): Role[] {
  return ROLES.filter((r) => roles.includes(r));
}

/** Where every members write goes. */
export const MEMBERS_BASE_PATH = "/api/v1/members";
/** The longest name a company may give a member (migration 003). */
export const MEMBER_NAME_MAX = 120;
