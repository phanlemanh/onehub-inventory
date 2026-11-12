"use client";

import { createContext, useContext, type ReactNode } from "react";

/** Whether the session may run an action, on its own record (`mine`) or on someone else's. */
export type ActionPermission = (action: string, mine: boolean) => boolean;

/** Nothing is permitted until the identity module says so: a menu outside the frame shows no action. */
const DENY_ALL: ActionPermission = () => false;

const ActionPermissionContext = createContext<ActionPermission>(DENY_ALL);

/**
 * Where shared components learn the permission rule (row 9e). Shared components know no module, so the identity
 * module's `SessionRoles` provides the permission table's rule here, once, for the internal frame.
 */
export function ActionPermissionProvider({
  permitted,
  children,
}: {
  permitted: ActionPermission;
  children: ReactNode;
}) {
  return (
    <ActionPermissionContext.Provider value={permitted}>
      {children}
    </ActionPermissionContext.Provider>
  );
}

export function useActionPermission(): ActionPermission {
  return useContext(ActionPermissionContext);
}
