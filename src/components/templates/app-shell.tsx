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

import { FRAME_COPY } from "./frame-copy";
import { NavMenu, type NavItem } from "./nav-menu";
import { ConnectionWatcher, ScreenBanner } from "./screen-banner";
import { ThemeSwitch } from "./theme";

export type { NavItem } from "./nav-menu";

/** The id of the main region; the skip link jumps here. */
export const MAIN_ID = "main-content";

/**
 * The application frame: a skip link, one navigation that marks the current screen, a top bar with the sidebar
 * button and the theme switch, the screen banner, and one main region. Screens put their `PageHeader` inside.
 */
export function AppShell({
  nav,
  role,
  children,
}: {
  nav: readonly NavItem[];
  role?: string;
  children?: ReactNode;
}) {
  return (
    <SidebarProvider>
      <a
        href={`#${MAIN_ID}`}
        className="sr-only z-50 rounded-md bg-background px-4 py-2 text-sm font-medium focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:ring-2 focus:ring-ring"
      >
        {FRAME_COPY.skipToContent}
      </a>
      <Sidebar>
        <SidebarHeader>
          <Image
            src="/brand/logo-horizontal.svg"
            alt={FRAME_COPY.brand}
            width={120}
            height={32}
            priority
          />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <NavMenu items={nav} role={role} />
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset id={MAIN_ID} tabIndex={-1}>
        <div className="flex h-14 items-center justify-between gap-2 border-b px-4">
          <SidebarTrigger aria-label={FRAME_COPY.openSidebar} />
          <ThemeSwitch />
        </div>
        <ConnectionWatcher />
        <ScreenBanner />
        <div className="flex flex-col gap-6 p-4 lg:p-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
