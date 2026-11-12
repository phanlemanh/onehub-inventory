// The one API door to the permission table (row 9a): before a handler touches data it asks whether the session's
// person, with the roles they hold in the session's company, may run the action. The database checks again on its
// own (app.allowed, migration 006), so this is the first of two locks, not the only one.
import { memberRoles, type MembersDeps } from "./members";
import { allowedScope, type ActionName, type Scope } from "./permissions";
import type { CompanyContext } from "./with-company";

/** The scope the caller has for the action, or null when they may not run it. */
export async function requireAction(
  deps: Pick<MembersDeps, "pool">,
  ctx: CompanyContext,
  action: ActionName,
): Promise<Scope | null> {
  return allowedScope(await memberRoles(deps, ctx), action);
}
