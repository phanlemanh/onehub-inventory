"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useSyncExternalStore } from "react";

import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import type { Role } from "@/generated/ontology";
import { cn } from "@/lib/utils";

import { currentEntry, isCurrent, type NavItem } from "../nav-menu";
import { RAIL_COPY } from "./rail-copy";

/** Cookie that remembers whether the person folded the second column (UI preference, no company data). */
export const COLUMN_COOKIE = "app_shell_cot2";
const COLUMN_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

const listeners = new Set<() => void>();

function readOpen(): boolean {
  return !document.cookie.split("; ").includes(`${COLUMN_COOKIE}=0`);
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Open unless the person folded it; the choice survives a reload. */
export function useColumnOpen(): [boolean, (open: boolean) => void] {
  const open = useSyncExternalStore(subscribe, readOpen, () => true);
  const setOpen = useCallback((next: boolean) => {
    document.cookie = `${COLUMN_COOKIE}=${next ? 1 : 0}; path=/; max-age=${COLUMN_COOKIE_MAX_AGE}; samesite=lax`;
    for (const listener of listeners) listener();
  }, []);
  return [open, setOpen];
}

/** The places inside the open screen, or a sentence when it has none. */
export function SecondColumnNav({
  items,
  roles,
}: {
  items: readonly NavItem[];
  roles?: readonly Role[];
}) {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();
  const entry = currentEntry(items, roles, pathname);
  if (!entry) return null;
  const sections = entry.sections ?? [];
  if (sections.length === 0) {
    return (
      <nav aria-label={entry.title} className="flex flex-col gap-2 p-2">
        <SidebarGroup>
          <SidebarGroupLabel>{entry.title}</SidebarGroupLabel>
          <p className="px-2 text-xs text-muted-foreground">{RAIL_COPY.noSubItems}</p>
        </SidebarGroup>
      </nav>
    );
  }
  // The first link that matches the address exactly is the open place; otherwise the first link of the screen.
  const links = sections.flatMap((s) => s.items);
  const exact = links.findIndex((l) => l.href === pathname);
  const openIndex = exact >= 0 ? exact : links.findIndex((l) => isCurrent(pathname, l.href));
  const offsets = sections.map((_, i) =>
    sections.slice(0, i).reduce((sum, s) => sum + s.items.length, 0),
  );
  return (
    <nav aria-label={entry.title} className="flex flex-col">
      {sections.map((section, i) => (
        <SidebarGroup key={section.title ?? i}>
          <SidebarGroupLabel>{section.title ?? entry.title}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenuSub>
              {section.items.map((link, j) => {
                const active = offsets[i]! + j === openIndex;
                return (
                  <SidebarMenuSubItem key={`${link.href}-${link.title}`}>
                    <SidebarMenuSubButton
                      isActive={active}
                      render={
                        <Link
                          href={link.href}
                          aria-current={active ? "page" : undefined}
                          onClick={() => {
                            if (isMobile) setOpenMobile(false);
                          }}
                        />
                      }
                    >
                      <span>{link.title}</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                );
              })}
            </SidebarMenuSub>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </nav>
  );
}

/** Desktop second column beside the screen, with its fold handle. Hidden on the phone (it rides in the sheet). */
export function SecondColumn({
  items,
  roles,
}: {
  items: readonly NavItem[];
  roles?: readonly Role[];
}) {
  const [open, setOpen] = useColumnOpen();
  return (
    <div className="sticky top-12 hidden max-h-svh shrink-0 self-start md:flex">
      <aside
        data-slot="app-shell-second-column"
        data-state={open ? "open" : "closed"}
        className={cn("overflow-hidden border-r", open ? "w-56" : "w-0 border-r-0")}
      >
        <div className="w-56">
          <SecondColumnNav items={items} roles={roles} />
        </div>
      </aside>
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon-xs"
          aria-label={open ? RAIL_COPY.collapseColumn : RAIL_COPY.expandColumn}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span aria-hidden className="h-6 w-1 rounded-full bg-border" />
        </Button>
      </div>
    </div>
  );
}
