"use client";

import { createContext, useCallback, useContext, type ReactNode } from "react";

import type { Role } from "../../../generated/ontology";
import { actionVisibility, type ActionName } from "../permissions";

/** The roles of the session in its company, set once by the internal frame's layout. */
const SessionRolesContext = createContext<readonly Role[]>([]);

export function SessionRoles({ roles, children }: { roles: readonly Role[]; children: ReactNode }) {
  return <SessionRolesContext.Provider value={roles}>{children}</SessionRolesContext.Provider>;
}

/** The roles of the session; empty outside the frame, so nothing is permitted there. */
export function useSessionRoles(): readonly Role[] {
  return useContext(SessionRolesContext);
}

/** Asks the permission table, for the roles of the session, whether an action's button shows. */
export function usePermitted(): (action: ActionName, mine?: boolean) => boolean {
  const roles = useSessionRoles();
  return useCallback(
    (action: ActionName, mine = true) => actionVisibility(roles, action, mine) === "show",
    [roles],
  );
}

/**
 * The one door every action button goes through (row 9e): renders its children only when the permission table gives
 * the session's roles the action — on the viewer's own record (`mine`) for own scope. A button that writes stands
 * inside one of these; `tests/bo-nut-kiem.test.ts` turns red otherwise.
 */
export function PermittedAction({
  action,
  mine = true,
  children,
}: {
  action: ActionName;
  mine?: boolean;
  children: ReactNode;
}) {
  const permitted = usePermitted();
  return permitted(action, mine) ? <>{children}</> : null;
}
