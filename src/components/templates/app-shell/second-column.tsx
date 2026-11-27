"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useSyncExternalStore } from "react";

import { useActionPermission } from "@/components/candidate/action-permission";
import { Badge } from "@/components/reui/badge";
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
import {
  currentEntry,
  flattenLinks,
  isCurrent,
  linkHref,
  type NavItem,
  type NavLink,
} from "../nav-menu";
import { usePlaceChange } from "./place-change";

/**
 * The column's longest run: the screen less the top bar (3rem) and the inset's 8 px margin above and below, so the
 * column never makes the page taller than the screen (owner, BH session 2026-11-27: Bảng hàng at the right height).
 */
const COLUMN_HEIGHT = { "--second-column-height": "calc(100svh - 4rem)" } as CSSProperties;

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
 * an open record), the later one among equals (a place of row 2d over the status the grid also filters by); the first
 * link of the screen when none fits. One entry, never two. Nested entries count in reading order.
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
    if (wanted.length > bestCount || (wanted.length > 0 && wanted.length === bestCount)) {
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
  const links = sections.flatMap((s) => flattenLinks(s.items));
  const openIndex = openLinkIndex(links, pathname, search);
  const activeLink = links[openIndex];
  const entryOf = (link: NavLink) => {
    const active = link === activeLink;
    const changed = place.changed?.href === link.href ? place.changed.mark : null;
    const button = (
      <SidebarMenuSubButton
        isActive={active}
        render={
          <Link
            // With the open address's other parameters where the entry keeps them (VP5): a press before the page
            // comes alive opens the same place as one after it.
            href={linkHref(link, pathname, search)}
            aria-current={active ? "true" : undefined}
            title={link.trailing ? link.title : undefined}
            onClick={(event) => {
              // A modified or non-primary click opens the entry elsewhere (new tab, window): this screen stays as it is.
              if (
                event.metaKey ||
                event.ctrlKey ||
                event.shiftKey ||
                event.altKey ||
                event.button !== 0
              )
                return;
              // Pressing the open entry again opens its place afresh, unsaved changes dropped (row 2c).
              if (active) place.reopen();
              // The open screen may take the entry in place (row 2d), keeping what else it shows.
              else if (place.pick(link.href)) event.preventDefault();
              if (isMobile) setOpenMobile(false);
            }}
          />
        }
      >
        <span className="truncate">{link.title}</span>
        {changed ? (
          <Badge data-slot="place-changed" variant="warning-light" className="ml-auto shrink-0">
            {changed}
          </Badge>
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
        {link.children?.length ? (
          // The places inside this one (row 2d): one nested list of the same entries.
          <SidebarMenuSub>{link.children.map(entryOf)}</SidebarMenuSub>
        ) : null}
      </SidebarMenuSubItem>
    );
  };
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
            <SidebarMenuSub>{section.items.map(entryOf)}</SidebarMenuSub>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </nav>
  );
}

/**
 * Desktop second column beside the screen. Its edge runs the whole height of the screen, and its fold handle is a rail
 * on that edge, in the middle of the window, that takes no room of its own: two strokes that bend into an arrow
 * pointing the way the column will go when hovered or focused (the arrangement of the ReUI Verve template). Hidden on
 * the phone (the column rides in the sheet).
 */
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
    <div
      data-slot="app-shell-second-column-edge"
      className={cn(
        "hidden shrink-0 self-stretch transition-colors md:flex",
        open && "border-r has-[[data-slot=second-column-rail]:hover]:border-ring/50",
      )}
    >
      <aside
        data-slot="app-shell-second-column"
        style={COLUMN_HEIGHT}
        data-state={open ? "open" : "closed"}
        className={cn(
          // Ends at the work area's bottom (screen less the top bar and the inset's two 8 px margins), so the column never makes
          // the page taller than the screen (owner, BH session 2026-11-27: Bảng hàng at the right height).
          "sticky top-12 max-h-(--second-column-height) self-start overflow-x-hidden overflow-y-auto pb-4",
          open ? "w-56" : "w-0",
        )}
      >
        <div className="w-56">
          <SecondColumnNav items={items} roles={roles} />
        </div>
      </aside>
      {/* Fixed with no horizontal offset inside a zero-width block after the column: it stays on the column's edge, at
          the middle of the window (a fixed child of the flex row itself would sit at the row's start). */}
      <div className="w-0">
        <div className="fixed top-1/2 z-30 -translate-y-1/2">
          <Button
            variant="ghost"
            size="icon-sm"
            data-slot="second-column-rail"
            aria-label={open ? COPY.collapse : COPY.expand}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <span aria-hidden className="flex flex-col items-center">
              <span
                className={cn(
                  "block h-2 w-0.5 origin-bottom rounded-t-full bg-foreground/40 transition-transform duration-100 ease-linear group-hover/button:bg-foreground/60 group-focus-visible/button:bg-foreground/60",
                  open
                    ? "group-hover/button:rotate-40 group-focus-visible/button:rotate-40"
                    : "group-hover/button:-rotate-40 group-focus-visible/button:-rotate-40",
                )}
              />
              <span
                className={cn(
                  "block h-2 w-0.5 origin-top rounded-b-full bg-foreground/40 transition-transform duration-100 ease-linear group-hover/button:bg-foreground/60 group-focus-visible/button:bg-foreground/60",
                  open
                    ? "group-hover/button:-rotate-40 group-focus-visible/button:-rotate-40"
                    : "group-hover/button:rotate-40 group-focus-visible/button:rotate-40",
                )}
              />
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
