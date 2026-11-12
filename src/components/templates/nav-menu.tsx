"use client";

import { CircleDotIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import {
  useActionPermission,
  type ActionPermission,
} from "@/components/candidate/action-permission";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import type { Role } from "@/generated/ontology";

/** One entry of the second column of the App Shell (row 1o): a place inside the screen of its rail entry. */
export interface NavLink {
  href: string;
  title: string;
}

/** A titled group of the second column; without a title it sits under the screen name. */
export interface NavSection {
  title?: string;
  items: readonly NavLink[];
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
  action?: string;
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

/**
 * The rail of the App Shell: one icon per screen, its name as tooltip and accessible name, the open screen marked;
 * in the phone sheet the name shows beside the icon and a choice closes the sheet.
 */
export function NavMenu({ items, roles }: { items: readonly NavItem[]; roles?: readonly Role[] }) {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();
  const permitted = useActionPermission();
  return (
    <SidebarMenu>
      {visibleNav(items, roles, permitted).map((item) => {
        const current = isCurrent(pathname, item.href);
        return (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              isActive={current}
              tooltip={item.title}
              render={
                <Link
                  href={item.href}
                  aria-current={current ? "page" : undefined}
                  onClick={() => {
                    if (isMobile) setOpenMobile(false);
                  }}
                />
              }
            >
              {item.icon ?? <CircleDotIcon aria-hidden />}
              {/* In the phone sheet the rail stays icon-only (as app-shell-8 does) so the second column keeps its width. */}
              <span className={isMobile ? "sr-only" : undefined}>{item.title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
