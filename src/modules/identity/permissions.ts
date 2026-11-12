// The permission table (decision 0016, row 9a), read from the generated ontology. Browser-safe: the API decides with
// it today, the screens of row 19a will read the same function. A person with several roles gets the widest scope of
// their roles; a role without a cell may not run the action.
import { ACTIONS, PERMISSION_EXEMPT, type ActionSpec, type Role } from "../../generated/ontology";

export type Scope = "company" | "own";
export type ActionName = ActionSpec["name"];

const RANK: Record<Scope, number> = { own: 1, company: 2 };

/** Rows of the table that have doors in the code. */
export const LIVE_ACTIONS: readonly ActionSpec[] = ACTIONS.filter((a) => a.status === "live");

/** Doors no role decides, each with its reason. */
export const EXEMPT_DOORS = PERMISSION_EXEMPT;

export function actionSpec(action: ActionName): ActionSpec | undefined {
  return ACTIONS.find((a) => a.name === action);
}

/** The widest scope the roles give for the action, or null when none of them may run it. */
export function allowedScope(
  roles: readonly Role[],
  action: ActionName,
  table: readonly ActionSpec[] = ACTIONS,
): Scope | null {
  const spec = table.find((a) => a.name === action);
  if (!spec) return null;
  let best: Scope | null = null;
  for (const role of roles) {
    const cell = spec.scope[role];
    if (cell && (best === null || RANK[cell] > RANK[best])) best = cell;
  }
  return best;
}
