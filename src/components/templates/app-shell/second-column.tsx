"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useSyncExternalStore } from "react";

import { useActionPermission } from "@/components/candidate/action-permission";
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

import { FRAME_COPY } from "../frame-copy";
import { COLUMN_COOKIE, COLUMN_COOKIE_MAX_AGE, columnOpenFromCookie } from "./column-cookie";
import { currentEntry, isCurrent, type NavItem, type NavLink } from "../nav-menu";
import { usePlaceChange } from "./place-change";

const COPY = FRAME_COPY.secondColumn;

const listeners = new Set<() => void>();

function readOpen(): boolean {
  const pair = document.cookie.split("; ").find((c) => c.startsWith(`${COLUMN_COOKIE}=`));
  return columnOpenFromCookie(pair?.slice(COLUMN_COOKIE.length + 1));
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Open unless the person folded it; the choice survives a reload. */
export function useColumnOpen(initial = true): [boolean, (open: boolean) => void] {
  const open = useSyncExternalStore(subscribe, readOpen, () => initial);
  const setOpen = useCallback((next: boolean) => {
    document.cookie = `${COLUMN_COOKIE}=${next ? 1 : 0}; path=/; max-age=${COLUMN_COOKIE_MAX_AGE}; samesite=lax`;
    for (const listener of listeners) listener();
  }, []);
  return [open, setOpen];
}

/**
 * The entry of the open place: among the links of the screen's path whose every query parameter the address carries,
 * the one carrying the most (a status shortcut or a saved view over «Tất cả», whatever else the address holds, such as
 * an open record); the first link of the screen when none fits. One entry, never two.
 */
export function openLinkIndex(links: readonly NavLink[], pathname: string, search: string): number {
  const here = new URLSearchParams(search);
  let best = -1;
  let bestCount = -1;
  links.forEach((link, i) => {
    const url = new URL(link.href, "http://x");
    if (url.pathname !== pathname) return;
    const wanted = [...url.searchParams.entries()];
    if (!wanted.every(([k, v]) => here.getAll(k).includes(v))) return;
    if (wanted.length > bestCount) {
      best = i;
      bestCount = wanted.length;
    }
  });
  return best >= 0 ? best : links.findIndex((l) => isCurrent(pathname, l.href));
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
  const search = useSearchParams().toString();
  const { isMobile, setOpenMobile } = useSidebar();
  const permitted = useActionPermission();
  const place = usePlaceChange();
  const entry = currentEntry(items, roles, pathname, permitted);
  if (!entry) return null;
  const sections = entry.sections ?? [];
  if (sections.length === 0) {
    return (
      <nav aria-label={entry.title} className="flex flex-col gap-2 p-2">
        <SidebarGroup>
          <SidebarGroupLabel>{entry.title}</SidebarGroupLabel>
          <p className="px-2 text-xs text-muted-foreground">{COPY.noSubItems}</p>
        </SidebarGroup>
      </nav>
    );
  }
  const links = sections.flatMap((s) => s.items);
  const openIndex = openLinkIndex(links, pathname, search);
  const offsets = sections.map((_, i) =>
    sections.slice(0, i).reduce((sum, s) => sum + s.items.length, 0),
  );
  return (
    <nav aria-label={entry.title} className="flex flex-col">
      {sections.map((section, i) => (
        <SidebarGroup key={section.title ?? i}>
          <SidebarGroupLabel>{section.title ?? entry.title}</SidebarGroupLabel>
          <SidebarGroupContent>
            {section.items.length === 0 && section.empty ? (
              <p data-slot="second-column-empty" className="px-2 text-xs text-muted-foreground">
                {section.empty}
              </p>
            ) : null}
            <SidebarMenuSub>
              {section.items.map((link, j) => {
                const active = offsets[i]! + j === openIndex;
                const changed = place.changed?.href === link.href ? place.changed.mark : null;
                const button = (
                  <SidebarMenuSubButton
                    isActive={active}
                    render={
                      <Link
                        href={link.href}
                        aria-current={active ? "true" : undefined}
                        title={link.trailing ? link.title : undefined}
                        onClick={() => {
                          // Pressing the open entry again opens its place afresh, unsaved changes dropped (row 2c).
                          if (active) place.reopen();
                          if (isMobile) setOpenMobile(false);
                        }}
                      />
                    }
                  >
                    <span className="truncate">{link.title}</span>
                    {changed ? (
                      <span
                        data-slot="place-changed"
                        className="ml-auto flex shrink-0 items-center"
                      >
                        <span aria-hidden className="size-1.5 rounded-full bg-primary" />
                        <span className="sr-only">{changed}</span>
                      </span>
                    ) : null}
                  </SidebarMenuSubButton>
                );
                return (
                  <SidebarMenuSubItem key={`${link.href}-${link.title}`}>
                    {link.trailing ? (
                      // The «…» stands beside the entry, shown on hover, keyboard focus, touch and the open entry.
                      <div className="group/place flex min-w-0 items-center gap-0.5">
                        <div className="min-w-0 flex-1">{button}</div>
                        <div
                          data-slot="second-column-trailing"
                          className={cn(
                            "shrink-0 opacity-0 group-focus-within/place:opacity-100 group-hover/place:opacity-100 pointer-coarse:opacity-100 has-[[aria-expanded=true]]:opacity-100",
                            active && "opacity-100",
                          )}
                        >
                          {link.trailing}
                        </div>
                      </div>
                    ) : (
                      button
                    )}
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
  initialOpen = true,
}: {
  items: readonly NavItem[];
  roles?: readonly Role[];
  /** The remembered choice read on the server, so the first paint already matches it. */
  initialOpen?: boolean;
}) {
  const [open, setOpen] = useColumnOpen(initialOpen);
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
          aria-label={open ? COPY.collapse : COPY.expand}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span aria-hidden className="h-6 w-1 rounded-full bg-border" />
        </Button>
      </div>
    </div>
  );
}
