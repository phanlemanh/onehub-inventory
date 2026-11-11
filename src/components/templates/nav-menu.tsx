"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export interface NavItem {
  href: string;
  title: string;
  /** Roles that see this entry; absent means every role. */
  roles?: readonly string[];
}

/** The entries a role sees, in the declared order. Without a role only unrestricted entries show. */
export function visibleNav(items: readonly NavItem[], role?: string): NavItem[] {
  return items.filter((item) => !item.roles || (role !== undefined && item.roles.includes(role)));
}

function isCurrent(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

/** The navigation of the frame: marks the current screen and closes the phone sheet after a choice. */
export function NavMenu({ items, role }: { items: readonly NavItem[]; role?: string }) {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();
  return (
    <SidebarMenu>
      {visibleNav(items, role).map((item) => {
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
