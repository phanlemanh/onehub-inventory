"use client";

import {
  BellIcon,
  CalendarCheckIcon,
  ChevronsUpDownIcon,
  LayoutGridIcon,
  SearchIcon,
  SendIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { type CSSProperties, type ReactNode, useEffect, useState } from "react";

import { FRAME_COPY } from "../frame-copy";
import { visibleNav } from "../nav-menu";
import { ConnectionWatcher, ScreenBanner } from "../screen-banner";
import { ThemeSwitch } from "../theme";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import type { Role } from "@/generated/ontology";
import { cn } from "@/lib/utils";

import { RAIL_COPY as COPY } from "./rail-copy";

/** The id of the main region of the rail shell; its skip link jumps here. */
export const RAIL_MAIN_ID = "main-content-rail";

/** The options the owner chooses between on the prototype; the first value of each is the machine's advice. */
export interface ShellOptions {
  /** Screen shown in the shell. */
  man: "today" | "inventory" | "sent" | "members";
  /** What the second column holds while the MVP has no saved views. */
  cot2: "trang-thai" | "cho";
  /** Unit-code box in the top bar. */
  tim: "chua" | "co";
  /** Notification bell. */
  chuong: "chua" | "co";
  /** Where the company name sits. */
  ten: "tren" | "menu";
  /** Phone layout. */
  dt: "thanh-ben" | "tab";
  /** Roles of the sample person. */
  vai: "du" | "dau-chu";
  /** Hide the option panel (screenshots). */
  gon: boolean;
}

export interface ShellLabels {
  today: string;
  inventory: string;
  sent: string;
  company: string;
  otherCompany: string;
  companies: string;
  statuses: { key: string; label: string; count: number }[];
}

type Home = ShellOptions["man"];

interface HomeEntry {
  id: Home;
  title: string;
  icon: ReactNode;
  roles?: readonly Role[];
}

const PROTO_PATH = "/proto/app-shell";

const ALL_ROLES: readonly Role[] = ["ListAgent", "BuyerAgent", "TeamLead", "CompanyAdmin"];

function href(options: ShellOptions, patch: Partial<ShellOptions>): string {
  const next = { ...options, ...patch };
  const params = new URLSearchParams({
    man: next.man,
    cot2: next.cot2,
    tim: next.tim,
    chuong: next.chuong,
    ten: next.ten,
    dt: next.dt,
    vai: next.vai,
  });
  if (next.gon) params.set("gon", "1");
  return `${PROTO_PATH}?${params.toString()}`;
}

/** Second column: the entries of the open home, or nothing when the home has none. */
function SecondColumn({
  options,
  labels,
  home,
}: {
  options: ShellOptions;
  labels: ShellLabels;
  home: HomeEntry;
}) {
  const total = labels.statuses.reduce((sum, s) => sum + s.count, 0);
  if (home.id === "today") {
    return <p className="px-3 py-2 text-xs text-muted-foreground">{COPY.noSubItems}</p>;
  }
  const first =
    home.id === "inventory"
      ? COPY.allListings
      : home.id === "sent"
        ? COPY.allSent
        : COPY.allMembers;
  return (
    <nav aria-label={home.title} className="flex flex-col">
      <SidebarGroup>
        <SidebarGroupLabel>{home.title}</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton isActive aria-current="page">
                <span>{first}</span>
              </SidebarMenuButton>
              {home.id === "inventory" ? <SidebarMenuBadge>{total}</SidebarMenuBadge> : null}
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      {home.id === "inventory" && options.cot2 === "trang-thai" ? (
        <SidebarGroup>
          <SidebarGroupLabel>{COPY.byStatus}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {labels.statuses.map((s) => (
                <SidebarMenuItem key={s.key}>
                  <SidebarMenuButton>
                    <span>{s.label}</span>
                  </SidebarMenuButton>
                  <SidebarMenuBadge>{s.count}</SidebarMenuBadge>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ) : null}
      {options.cot2 === "cho" ? (
        <p className="px-4 py-2 text-xs text-muted-foreground">{COPY.savedViewsSoon}</p>
      ) : null}
    </nav>
  );
}

/** The icon rail: one entry per home the person's roles open (decision 0016: roles add up). */
function Rail({
  options,
  homes,
  current,
}: {
  options: ShellOptions;
  homes: HomeEntry[];
  current: Home;
}) {
  const { isMobile, setOpenMobile } = useSidebar();
  return (
    <SidebarMenu>
      {homes.map((home) => {
        const active = home.id === current;
        return (
          <SidebarMenuItem key={home.id}>
            <SidebarMenuButton
              isActive={active}
              tooltip={home.title}
              render={
                <Link
                  href={href(options, { man: home.id })}
                  aria-label={home.title}
                  aria-current={active ? "page" : undefined}
                  onClick={() => {
                    if (isMobile) setOpenMobile(false);
                  }}
                />
              }
            >
              {home.icon}
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}

function CompanySwitch({ compact, labels }: { compact?: boolean; labels: ShellLabels }) {
  const [company, setCompany] = useState<string>(labels.company);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="sm" />}>
        <span className={cn("truncate", compact && "max-w-32")}>{company}</span>
        <ChevronsUpDownIcon aria-hidden className="opacity-60" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" sideOffset={8}>
        <DropdownMenuGroup>
          <DropdownMenuLabel>{labels.companies}</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={company} onValueChange={(v) => setCompany(String(v))}>
            <DropdownMenuRadioItem value={labels.company}>{labels.company}</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value={labels.otherCompany}>
              {labels.otherCompany}
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function UnitCodeSearch() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return (
    <>
      <div className="sm:w-56">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setOpen(true)}
          aria-label={COPY.unitCode}
        >
          <SearchIcon aria-hidden />
          <span className="hidden flex-1 text-left sm:inline">{COPY.unitCode}</span>
          <span className="hidden text-xs sm:inline">⌘K</span>
        </Button>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{COPY.unitCode}</DialogTitle>
            <DialogDescription>{COPY.unitCodeHint}</DialogDescription>
          </DialogHeader>
          <Input autoFocus placeholder={COPY.unitCodePlaceholder} aria-label={COPY.unitCode} />
        </DialogContent>
      </Dialog>
    </>
  );
}

function Bell() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={COPY.notifications}
        onClick={() => setOpen(true)}
      >
        <BellIcon />
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>{COPY.notifications}</SheetTitle>
            <SheetDescription>{COPY.noNotificationsDetail}</SheetDescription>
          </SheetHeader>
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <BellIcon />
              </EmptyMedia>
              <EmptyTitle>{COPY.noNotifications}</EmptyTitle>
              <EmptyDescription>{COPY.noNotificationsDetail}</EmptyDescription>
            </EmptyHeader>
          </Empty>
        </SheetContent>
      </Sheet>
    </>
  );
}

/** Phone bottom tabs (option B of question 5): the Quỹ hàng layout, composed by hand. */
function BottomTabs({
  options,
  homes,
  current,
}: {
  options: ShellOptions;
  homes: HomeEntry[];
  current: Home;
}) {
  const tabs = [
    ...homes.filter((h) => h.id !== "members"),
    { id: "members" as Home, title: COPY.me, icon: <UserIcon /> },
  ].slice(0, 4);
  return (
    <nav
      aria-label={COPY.sections}
      className="grid shrink-0 grid-cols-4 border-t bg-background md:hidden"
    >
      {tabs.map((tab) => {
        const active = tab.id === current;
        return (
          <Link
            key={tab.id}
            href={href(options, { man: tab.id })}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex flex-col items-center gap-1 py-2 text-xs text-muted-foreground transition-colors [&_svg]:size-5",
              active && "font-semibold text-foreground",
            )}
          >
            {tab.icon}
            <span>{tab.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function OptionPanel({ options }: { options: ShellOptions }) {
  const P = COPY.panel;
  const rows: {
    title: string;
    choices: { label: string; patch: Partial<ShellOptions>; on: boolean }[];
  }[] = [
    {
      title: `1 · ${P.secondColumn}`,
      choices: [
        {
          label: P.secondColumnA,
          patch: { cot2: "trang-thai" },
          on: options.cot2 === "trang-thai",
        },
        { label: P.secondColumnB, patch: { cot2: "cho" }, on: options.cot2 === "cho" },
      ],
    },
    {
      title: `2 · ${P.search}`,
      choices: [
        { label: P.no, patch: { tim: "chua" }, on: options.tim === "chua" },
        { label: P.yes, patch: { tim: "co" }, on: options.tim === "co" },
      ],
    },
    {
      title: `3 · ${P.bell}`,
      choices: [
        { label: P.no, patch: { chuong: "chua" }, on: options.chuong === "chua" },
        { label: P.yes, patch: { chuong: "co" }, on: options.chuong === "co" },
      ],
    },
    {
      title: `4 · ${P.company}`,
      choices: [
        { label: P.companyTop, patch: { ten: "tren" }, on: options.ten === "tren" },
        { label: P.companyMenu, patch: { ten: "menu" }, on: options.ten === "menu" },
      ],
    },
    {
      title: `5 · ${P.phone}`,
      choices: [
        { label: P.phoneSidebar, patch: { dt: "thanh-ben" }, on: options.dt === "thanh-ben" },
        { label: P.phoneTabs, patch: { dt: "tab" }, on: options.dt === "tab" },
      ],
    },
    {
      title: P.role,
      choices: [
        { label: P.roleAll, patch: { vai: "du" }, on: options.vai === "du" },
        { label: P.roleAgent, patch: { vai: "dau-chu" }, on: options.vai === "dau-chu" },
      ],
    },
  ];
  return (
    <Popover>
      <PopoverTrigger render={<Button size="sm" variant="secondary" />}>{P.button}</PopoverTrigger>
      <PopoverContent align="end">
        <p className="text-sm font-medium">{P.title}</p>
        <div className="flex flex-col gap-3">
          {rows.map((row) => (
            <div key={row.title} className="flex flex-col gap-1">
              <p className="text-xs text-muted-foreground">{row.title}</p>
              <div className="flex flex-wrap gap-1">
                {row.choices.map((c) => (
                  <Button
                    key={c.label}
                    size="xs"
                    variant={c.on ? "default" : "outline"}
                    aria-pressed={c.on}
                    render={<Link href={href(options, c.patch)} />}
                  >
                    {c.label}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function ShellBody({
  options,
  labels,
  account,
  children,
}: {
  options: ShellOptions;
  labels: ShellLabels;
  account: ReactNode;
  children: ReactNode;
}) {
  const { isMobile } = useSidebar();
  const [columnOpen, setColumnOpen] = useState(true);
  const homes: HomeEntry[] = [
    { id: "today", title: labels.today, icon: <CalendarCheckIcon /> },
    { id: "inventory", title: labels.inventory, icon: <LayoutGridIcon /> },
    { id: "sent", title: labels.sent, icon: <SendIcon /> },
    { id: "members", title: COPY.members, icon: <UsersIcon />, roles: ["CompanyAdmin"] },
  ];
  const roles: readonly Role[] = options.vai === "du" ? ALL_ROLES : ["ListAgent"];
  const visible = homes.filter(
    (h) => visibleNav([{ href: h.id, title: h.title, roles: h.roles }], roles).length > 0,
  );
  const current = visible.find((h) => h.id === options.man) ?? visible[0]!;
  const tabs = options.dt === "tab";
  const second = <SecondColumn options={options} labels={labels} home={current} />;

  return (
    <>
      <a
        href={`#${RAIL_MAIN_ID}`}
        className="sr-only z-50 rounded-md bg-background px-4 py-2 text-sm font-medium focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:ring-2 focus:ring-ring"
      >
        {FRAME_COPY.skipToContent}
      </a>
      {tabs && isMobile ? null : (
        <Sidebar collapsible="icon" variant="inset">
          <div className="flex h-full grow">
            <div className="flex h-full flex-col">
              <SidebarHeader>
                <div className="flex justify-center py-1">
                  <Image src="/brand/logo-mark.svg" alt={FRAME_COPY.brand} width={28} height={28} />
                </div>
              </SidebarHeader>
              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupContent>
                    <Rail options={options} homes={visible} current={current.id} />
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
            </div>
            {/* On the phone the second column rides in the same sheet as the rail, as the block does. */}
            <div className="flex flex-1 flex-col overflow-hidden border-l md:hidden">{second}</div>
          </div>
        </Sidebar>
      )}
      <SidebarInset id={RAIL_MAIN_ID} tabIndex={-1}>
        <header className="sticky top-0 z-20 flex h-12 w-full shrink-0 items-center gap-2 border-b bg-background px-2">
          <div className="flex min-w-0 flex-1 items-center gap-1">
            {tabs ? null : (
              <div className="md:hidden">
                <SidebarTrigger aria-label={FRAME_COPY.openSidebar} />
              </div>
            )}
            {options.ten === "tren" ? <CompanySwitch compact={isMobile} labels={labels} /> : null}
          </div>
          {options.tim === "co" ? (
            <div className="flex items-center lg:absolute lg:left-1/2 lg:-translate-x-1/2">
              <UnitCodeSearch />
            </div>
          ) : null}
          <div className="ml-auto flex shrink-0 items-center gap-1">
            {options.chuong === "co" ? <Bell /> : null}
            <ThemeSwitch />
            {account}
          </div>
        </header>
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden md:flex-row">
          <aside
            aria-label={current.title}
            className={cn(
              "hidden shrink-0 overflow-hidden border-r md:flex",
              columnOpen ? "w-56" : "w-0 border-r-0",
            )}
          >
            <div className="w-56 shrink-0">
              <ScrollArea>{second}</ScrollArea>
            </div>
          </aside>
          <div className="hidden items-center md:flex">
            <Button
              variant="ghost"
              size="icon-xs"
              aria-label={columnOpen ? COPY.collapseColumn : COPY.expandColumn}
              aria-expanded={columnOpen}
              onClick={() => setColumnOpen((o) => !o)}
            >
              <span aria-hidden className="h-6 w-1 rounded-full bg-border" />
            </Button>
          </div>
          <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
            <ConnectionWatcher />
            <ScreenBanner />
            <div className="flex flex-col gap-6 p-4 lg:p-8">{children}</div>
          </div>
        </div>
        {tabs ? <BottomTabs options={options} homes={visible} current={current.id} /> : null}
      </SidebarInset>
      {options.gon ? null : (
        <div className="fixed right-4 bottom-20 z-30 md:bottom-4">
          <OptionPanel options={options} />
        </div>
      )}
    </>
  );
}

/**
 * Clickable App Shell prototype (row 1o): ReUI app-shell-8 arranged for OneHub — icon rail plus a second column,
 * top bar with the company, the account menu and the theme switch of the repo. It covers the current frame while the
 * owner compares; it never ships.
 */
export function RailShell({
  options,
  labels,
  account,
  children,
}: {
  options: ShellOptions;
  labels: ShellLabels;
  /** The account corner: the repo's account menu (row 8). */
  account: ReactNode;
  /** The open screen. */
  children: ReactNode;
}) {
  return (
    // eslint-disable-next-line onehub-ui/no-native-dialogs -- prototype only: covers the old frame of the (app) layout so the owner sees one App Shell
    <div className="fixed inset-0 z-40 overflow-hidden bg-sidebar *:data-[slot=sidebar-wrapper]:h-svh">
      <SidebarProvider
        defaultOpen={false}
        style={{ "--sidebar-width-mobile": "18rem" } as CSSProperties}
      >
        <ShellBody options={options} labels={labels} account={account}>
          {children}
        </ShellBody>
      </SidebarProvider>
    </div>
  );
}
