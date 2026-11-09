import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export interface NavItem {
  href: string;
  title: string;
}

/** The application frame: one navigation, one main region, one page heading. */
export function AppShell({
  nav,
  title,
  children,
}: {
  nav: NavItem[];
  title: string;
  children?: ReactNode;
}) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Image src="/brand/logo-horizontal.svg" alt="OneHub" width={120} height={32} priority />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              {nav.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton render={<Link href={item.href} />}>
                    {item.title}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <h1 className="text-lg font-semibold">{title}</h1>
        </header>
        <div className="p-4 lg:p-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
