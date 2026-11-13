import Image from "next/image";
import type { ReactNode } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import type { Role } from "@/generated/ontology";

import { SecondColumn, SecondColumnNav } from "./app-shell/second-column";
import { FRAME_COPY } from "./frame-copy";
import { NavMenu, type NavItem } from "./nav-menu";
import { ConnectionWatcher, ScreenBanner } from "./screen-banner";
import { HiddenInFocus, ShellContent, ShellFocusProvider } from "./shell-focus";
import { ThemeSwitch } from "./theme";

export type { NavItem, NavLink, NavSection } from "./nav-menu";

/** The id of the main region; the skip link jumps here. */
export const MAIN_ID = "main-content";

/**
 * The App Shell (row 1o), arranged from ReUI app-shell-8 (decision 0023): an icon rail with one entry per screen
 * the person's roles open, a second column with the places inside the open screen (foldable, remembered), and a top
 * bar with the company, the search box (row 3f), the theme switch and the account menu. On the phone the rail and the second column ride in
 * one sheet opened from the top bar. The skip link, the screen banner and the full-page states are the repo's own.
 */
export function AppShell({
  nav,
  roles,
  company,
  account,
  search,
  columnOpen,
  children,
}: {
  nav: readonly NavItem[];
  /** Every role the signed-in person holds; the rail shows the entries of all of them. */
  roles?: readonly Role[];
  /** The company being worked in, at the start of the top bar (row 1o, question 4). */
  company?: ReactNode;
  /** The account corner of the top bar: sign-in link or account menu (row 8). */
  account?: ReactNode;
  /** The product's one search box, in the top bar (row 3f); absent when the person's roles open no screen to search. */
  search?: ReactNode;
  /** Whether the person left the second column open, read from its cookie on the server; absent means open. */
  columnOpen?: boolean;
  children?: ReactNode;
}) {
  return (
    <ShellFocusProvider>
      <SidebarProvider defaultOpen={false}>
        <a
          href={`#${MAIN_ID}`}
          className="sr-only z-50 rounded-md bg-background px-4 py-2 text-sm font-medium focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:ring-2 focus:ring-ring"
        >
          {FRAME_COPY.skipToContent}
        </a>
        <HiddenInFocus>
          <Sidebar collapsible="icon" variant="inset">
            <div className="flex h-full">
              <div className="flex h-full flex-col">
                <SidebarHeader>
                  <div className="flex justify-center py-1">
                    <Image
                      src="/brand/logo-mark.svg"
                      alt={FRAME_COPY.brand}
                      width={28}
                      height={28}
                      priority
                    />
                  </div>
                </SidebarHeader>
                <SidebarContent>
                  <SidebarGroup>
                    <NavMenu items={nav} roles={roles} />
                  </SidebarGroup>
                </SidebarContent>
              </div>
              {/* Phone sheet only: the second column beside the rail, as app-shell-8 does. */}
              <div className="flex min-w-0 flex-1 flex-col overflow-y-auto border-l md:hidden">
                <SecondColumnNav items={nav} roles={roles} />
              </div>
            </div>
          </Sidebar>
        </HiddenInFocus>
        <SidebarInset id={MAIN_ID} tabIndex={-1}>
          <HiddenInFocus>
            <header
              data-slot="app-shell-top-bar"
              className="sticky top-0 z-20 flex h-12 shrink-0 items-center gap-2 border-b bg-background px-2"
            >
              <div className="flex min-w-0 flex-1 items-center gap-1">
                <SidebarTrigger aria-label={FRAME_COPY.openSidebar} />
                {company}
              </div>
              <div className="ml-auto flex shrink-0 items-center gap-2">
                {search}
                <ThemeSwitch />
                {account}
              </div>
            </header>
          </HiddenInFocus>
          <div className="flex flex-1 flex-col md:flex-row">
            <HiddenInFocus>
              <SecondColumn items={nav} roles={roles} initialOpen={columnOpen ?? true} />
            </HiddenInFocus>
            <div className="flex min-w-0 flex-1 flex-col">
              <ConnectionWatcher />
              <ScreenBanner />
              <ShellContent>{children}</ShellContent>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ShellFocusProvider>
  );
}
