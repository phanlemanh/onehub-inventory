"use client";

import type { ReactNode } from "react";

import { SidebarProvider } from "@/components/ui/sidebar";

/** The desktop rail's open state is fixed; a toggle request (the ⌘B shortcut) changes nothing. */
function keepRail() {}

/**
 * The sidebar state of the App Shell: on the desktop the rail always stays icons, its one fold being the second
 * column's; the phone sheet keeps its own open state.
 */
export function RailProvider({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider open={false} onOpenChange={keepRail}>
      {children}
    </SidebarProvider>
  );
}
