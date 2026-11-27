"use client";

import { ChevronRightIcon } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { createContext, useContext, type ReactNode } from "react";

import { useActionPermission } from "@/components/candidate/action-permission";
import type { Role } from "@/generated/ontology";

import { currentEntry, flattenLinks, type NavItem } from "../nav-menu";
import { openLinkIndex } from "./second-column";

interface ShellNav {
  items: readonly NavItem[];
  roles?: readonly Role[];
}

const ShellNavContext = createContext<ShellNav | null>(null);

/** The App Shell's entries, for the head of a screen to name the place open in the second column. */
export function ShellNavProvider({ items, roles, children }: ShellNav & { children: ReactNode }) {
  return <ShellNavContext.Provider value={{ items, roles }}>{children}</ShellNavContext.Provider>;
}

/** The name of the place open in the second column, or null when the screen has none. */
function useOpenPlace(nav: ShellNav): string | null {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const permitted = useActionPermission();
  const entry = currentEntry(nav.items, nav.roles, pathname, permitted);
  const links = (entry?.sections ?? []).flatMap((s) => flattenLinks(s.items));
  const link = links[openLinkIndex(links, pathname, search)];
  return link?.title ?? null;
}

/**
 * After the screen's name in its head: «›» and the place open in the second column (row 2c, 2d, 7e), unless it says
 * the same as the screen's name. Not a link: the second column is where one moves between places. Outside the App
 * Shell (a screen rendered alone) there is no second column and it shows nothing.
 */
export function PlaceCrumb({ title }: { title: string }) {
  const nav = useContext(ShellNavContext);
  return nav ? <OpenPlace nav={nav} title={title} /> : null;
}

function OpenPlace({ nav, title }: { nav: ShellNav; title: string }) {
  const place = useOpenPlace(nav);
  if (!place || place === title) return null;
  return (
    <>
      <ChevronRightIcon aria-hidden className="size-3.5 shrink-0 text-muted-foreground" />
      <span data-slot="page-header-place" className="truncate text-sm font-medium text-foreground">
        {place}
      </span>
    </>
  );
}
