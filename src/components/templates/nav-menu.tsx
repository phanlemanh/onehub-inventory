"use client";

import { CircleDotIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useActionPermission } from "@/components/candidate/action-permission";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import type { Role } from "@/generated/ontology";

import { isCurrent, visibleNav, type NavItem } from "./nav-items";

export {
  currentEntry,
  flattenLinks,
  isCurrent,
  visibleNav,
  type NavItem,
  type NavLink,
  type NavSection,
} from "./nav-items";

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
