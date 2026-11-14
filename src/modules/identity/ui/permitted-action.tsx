"use client";

import { createContext, useCallback, useContext, useEffect, type ReactNode } from "react";

import { ActionPermissionProvider } from "@/components/candidate/action-permission";

import type { Role } from "../../../generated/ontology";
import { actionVisibility, allowedScope, type ActionName } from "../permissions";

/** The roles of the session in its company, set once by the internal frame's layout. */
const SessionRolesContext = createContext<readonly Role[]>([]);

/** Sets the session's roles for PermittedAction, and the same rule for the shared «…» menus of the grid and record. */
export function SessionRoles({ roles, children }: { roles: readonly Role[]; children: ReactNode }) {
  const permitted = useCallback(
    (action: ActionName, mine: boolean) => actionVisibility(roles, action, mine) === "show",
    [roles],
  );
  return (
    <SessionRolesContext.Provider value={roles}>
      <ActionPermissionProvider permitted={permitted}>{children}</ActionPermissionProvider>
    </SessionRolesContext.Provider>
  );
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
  const roles = useSessionRoles();
  const shown = permitted(action, mine);
  useEffect(() => {
    // Inlined at build time: a build without the browser suite's flag has `"undefined" === "1"` here, so the record
    // below is dead code there and never runs (row 9b, AC-11).
    if (process.env.NEXT_PUBLIC_E2E_BUTTON_RECORD === "1") recordButton(action, mine, shown, roles);
  }, [action, mine, shown, roles]);
  return shown ? <>{children}</> : null;
}

/** One decision of PermittedAction, as the role × screen browser suite reads it (row 9b). */
export interface ButtonDecision {
  action: ActionName;
  mine: boolean;
  shown: boolean;
  /** The widest scope the session's roles give for the action, or null when none does. */
  scope: "company" | "own" | null;
}

/**
 * Keeps each decision on the page, both ways — shown and not shown — so the browser suite can compare a role's
 * buttons with the generated role × screen × button table without anything added to the page itself: no element, no
 * attribute, so no change to how a button looks. Only builds made with NEXT_PUBLIC_E2E_BUTTON_RECORD=1 call this (the
 * signed-in browser suite's dev server, playwright.db.config.ts).
 */
function recordButton(
  action: ActionName,
  mine: boolean,
  shown: boolean,
  roles: readonly Role[],
): void {
  const w = window as unknown as { __onehubButtons?: ButtonDecision[] };
  (w.__onehubButtons ??= []).push({ action, mine, shown, scope: allowedScope(roles, action) });
}
