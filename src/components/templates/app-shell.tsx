import Image from "next/image";
import type { ReactNode } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import type { Role } from "@/generated/ontology";

import { ShellNavProvider } from "./app-shell/place-crumb";
import { RailProvider } from "./app-shell/rail-provider";
import { SecondColumn, SecondColumnNav } from "./app-shell/second-column";
import { FRAME_COPY } from "./frame-copy";
import { NavMenu, type NavItem } from "./nav-menu";
import { ConnectionWatcher, ScreenBanner } from "./screen-banner";
import { HiddenInFocus, ShellContent, ShellFocusProvider } from "./shell-focus";

export type { NavItem, NavLink, NavSection } from "./nav-menu";

/** The id of the main region; the skip link jumps here. */
export const MAIN_ID = "main-content";

/**
 * The App Shell (row 1o), arranged from ReUI app-shell-8 (decision 0023) and laid out as the ReUI Verve template: an
 * icon rail with one entry per screen the person's roles open and the account menu at its foot, a second column with
 * the places inside the open screen (foldable, remembered), and a top bar with the company and, in its middle, the
 * search box (row 3f). On the desktop the rail always stays icons; on the phone the rail and the second column ride in
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
  /** The foot of the rail: sign-in link or account menu (row 8), which also holds the theme choice. */
  account?: ReactNode;
  /** The product's one search box, in the top bar (row 3f); absent when the person's roles open no screen to search. */
  search?: ReactNode;
  /** Whether the person left the second column open, read from its cookie on the server; absent means open. */
  columnOpen?: boolean;
  children?: ReactNode;
}) {
  return (
    <ShellFocusProvider>
      <RailProvider>
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
                {account ? (
                  <SidebarFooter data-slot="app-shell-account">
                    <div className="flex justify-center">{account}</div>
                  </SidebarFooter>
                ) : null}
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
                {/* Phone only: the sheet. On the desktop the rail stays icons and the second column has its own fold. */}
                <div className="md:hidden">
                  <SidebarTrigger aria-label={FRAME_COPY.openSidebar} />
                </div>
                {company}
              </div>
              {search ? (
                <div
                  data-slot="app-shell-search"
                  className="flex shrink-0 items-center md:absolute md:left-1/2 md:-translate-x-1/2"
                >
                  {search}
                </div>
              ) : null}
            </header>
          </HiddenInFocus>
          <div className="flex flex-1 flex-col md:flex-row">
            <HiddenInFocus>
              <SecondColumn items={nav} roles={roles} initialOpen={columnOpen ?? true} />
            </HiddenInFocus>
            <div className="flex min-w-0 flex-1 flex-col">
              <ConnectionWatcher />
              <ScreenBanner />
              <ShellNavProvider items={nav} roles={roles}>
                <ShellContent>{children}</ShellContent>
              </ShellNavProvider>
            </div>
          </div>
        </SidebarInset>
      </RailProvider>
    </ShellFocusProvider>
  );
}
