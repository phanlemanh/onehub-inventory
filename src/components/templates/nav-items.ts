// The entries of the App Shell and which of them a person sees: plain data and pure rules, safe anywhere (the browser
// tests read them without React). The rail and second column draw them (nav-menu.tsx, app-shell/second-column.tsx).
import type { ReactNode } from "react";

import type { ActionPermission, PermissionAction } from "@/components/candidate/action-permission";
import type { Role } from "@/generated/ontology";

/** One entry of the second column of the App Shell (row 1o): a place inside the screen of its rail entry. */
export interface NavLink {
  href: string;
  title: string;
  /**
   * What sits at the end of the entry (row 2c): the «…» of a saved view, already gated by the permission table. It shows
   * on hover, on keyboard focus and on the open entry. Absent, the entry is drawn as before.
   */
  trailing?: ReactNode;
  /**
   * The places inside this one (row 2d: a complex's buildings), drawn as one nested list of the same entries. Absent,
   * the entry is drawn as before.
   */
  children?: readonly NavLink[];
}

/** Every entry of a list, the nested ones right after their parent, in reading order. */
export function flattenLinks(links: readonly NavLink[]): NavLink[] {
  return links.flatMap((l) => [l, ...flattenLinks(l.children ?? [])]);
}

/** A titled group of the second column; without a title it sits under the screen name. */
export interface NavSection {
  title?: string;
  items: readonly NavLink[];
  /** The sentence the group shows while it holds no entry (row 2c); absent, the group shows its title alone as before. */
  empty?: string;
}

export interface NavItem {
  href: string;
  title: string;
  /** Roles that see this entry (declared in ontology/roles.yaml); absent means every role. */
  roles?: readonly Role[];
  /**
   * The permission-table action that opens this screen (row 9e): the entry shows only when the session may run it, so
   * a changed cell of ontology/actions.yaml moves the entry without code. Prefer it over `roles`.
   */
  action?: PermissionAction;
  /** The rail icon (lucide); absent shows a neutral dot until the entry declares one. */
  icon?: ReactNode;
  /** What the second column holds while this screen is open; absent means the screen has no sub-places. */
  sections?: readonly NavSection[];
}

/** Without the identity module's rule nothing behind an action is permitted. */
const DENY_ALL: ActionPermission = () => false;

/**
 * The entries a person sees, in the declared order: unrestricted entries and every entry open to at least one of
 * the roles they hold (decision 0016: a person holding several roles gets the sum). An entry naming an action shows
 * only when `permitted` gives it — the permission table's rule, provided by the identity module. Without roles, or
 * with none, only unrestricted entries show.
 */
export function visibleNav(
  items: readonly NavItem[],
  roles: readonly Role[] = [],
  permitted: ActionPermission = DENY_ALL,
): NavItem[] {
  return items.filter(
    (item) =>
      (!item.roles || item.roles.some((r) => roles.includes(r))) &&
      (item.action === undefined || permitted(item.action, true)),
  );
}

export function isCurrent(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

/** The visible entry whose screen is open, if any. */
export function currentEntry(
  items: readonly NavItem[],
  roles: readonly Role[] | undefined,
  pathname: string,
  permitted: ActionPermission = DENY_ALL,
): NavItem | undefined {
  return visibleNav(items, roles, permitted).find((item) => isCurrent(pathname, item.href));
}
