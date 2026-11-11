"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import type { Role } from "@/generated/ontology";

export interface NavItem {
  href: string;
  title: string;
  /** Roles that see this entry (declared in ontology/roles.yaml); absent means every role. */
  roles?: readonly Role[];
}

/**
 * The entries a person sees, in the declared order: unrestricted entries and every entry open to at least one of
 * the roles they hold (decision 0016: a person holding several roles gets the sum). Without roles, or with none,
 * only unrestricted entries show.
 */
export function visibleNav(items: readonly NavItem[], roles: readonly Role[] = []): NavItem[] {
  return items.filter((item) => !item.roles || item.roles.some((r) => roles.includes(r)));
}

function isCurrent(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

/** The navigation of the frame: marks the current screen and closes the phone sheet after a choice. */
export function NavMenu({ items, roles }: { items: readonly NavItem[]; roles?: readonly Role[] }) {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();
  return (
    <SidebarMenu>
      {visibleNav(items, roles).map((item) => {
        const current = isCurrent(pathname, item.href);
        return (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              isActive={current}
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
              {item.title}
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
