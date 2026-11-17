"use client";

import { ArrowLeftRightIcon, LogInIcon, LogOutIcon, PaletteIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useSyncExternalStore } from "react";

import { FRAME_COPY } from "@/components/templates/frame-copy";
import { loginHref } from "@/components/templates/page-state";
import { ThemeMenuChoice } from "@/components/templates/theme";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AUTH_BASE_PATH } from "@/modules/identity";

import { LOGIN_COPY as COPY } from "../login/copy";
import { signOut } from "../login/sign-out";

import { useSwitchCompany } from "./company-switch";

/** Nothing to subscribe to: the value only differs between the server render and the browser. */
const noSubscribe = () => () => {};

interface CompanyRef {
  id: string;
  name: string;
}

export interface AccountView {
  name: string;
  email: string;
  company: CompanyRef | null;
  companies: CompanyRef[];
}

/** One letter for the account button: the first letter of the name, else of the email. */
function initial(account: AccountView): string {
  const letter = (account.name.match(/\p{L}/u) ?? account.email.match(/\p{L}/u))?.[0];
  return (letter ?? "?").toUpperCase();
}

/**
 * The account menu at the foot of the App Shell's rail (row 8, N6), arranged as the ReUI Verve template: the look
 * (light, dark, following the device) and «sign in» when nobody is signed in; otherwise who you are, the company you
 * work in, switching company when you belong to several, the look, and signing out.
 */
export function AccountMenu({
  account,
  labels,
}: {
  account: AccountView | null;
  labels: { signIn: string; signOut: string };
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);
  const { switching, switchTo: switchCompany } = useSwitchCompany(account?.company?.id);
  // Set once the menu runs in the browser: before that, a click on the button opens nothing.
  const ready = useSyncExternalStore(
    noSubscribe,
    () => true,
    () => false,
  );

  // The three looks, for the signed-in and the signed-out alike: each look is a menu item of its own, so the arrow keys
  // reach it.
  const theme = (
    <div
      data-slot="account-theme"
      className="flex items-center gap-1.5 px-1.5 py-1 text-sm [&>svg]:size-4 [&>svg]:shrink-0"
    >
      <PaletteIcon aria-hidden />
      <span>{FRAME_COPY.theme.row}</span>
      <span className="ml-auto">
        <ThemeMenuChoice />
      </span>
    </div>
  );

  if (!account) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={COPY.account}
              data-slot="account-sign-in"
              data-ready={ready || undefined}
            />
          }
        >
          <UserIcon aria-hidden />
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="end" className="w-80">
          {theme}
          <DropdownMenuSeparator />
          <DropdownMenuItem render={<Link href={loginHref(pathname || "/")} />}>
            <LogInIcon />
            {labels.signIn}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  async function switchTo(companyId: string) {
    setOpen(false);
    await switchCompany(companyId);
  }

  async function signOutHere() {
    setBusy(true);
    const done = await signOut(labels.signOut);
    if (!done) {
      setBusy(false);
      return;
    }
    router.replace("/login");
    router.refresh();
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={COPY.account}
            data-slot="account-menu"
            data-ready={ready || undefined}
          />
        }
      >
        <Avatar size="sm">
          <AvatarFallback>{initial(account)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="end" className="w-80">
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <span className="flex items-center gap-2.5">
              <Avatar size="sm">
                <AvatarFallback>{initial(account)}</AvatarFallback>
              </Avatar>
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="truncate text-sm font-semibold text-foreground">
                  {account.name}
                </span>
                <span className="truncate" title={account.email}>
                  {account.email}
                </span>
              </span>
            </span>
          </DropdownMenuLabel>
          <DropdownMenuLabel>
            {account.company
              ? `${COPY.currentCompany} ${account.company.name}`
              : COPY.noCurrentCompany}
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        {account.companies.length > 1 ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger disabled={busy || switching}>
                <ArrowLeftRightIcon />
                {COPY.switchCompany}
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup
                  value={account.company?.id ?? ""}
                  onValueChange={(value) => void switchTo(String(value))}
                >
                  {account.companies.map((c) => (
                    <DropdownMenuRadioItem key={c.id} value={c.id}>
                      {c.name}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </>
        ) : null}
        <DropdownMenuSeparator />
        {theme}
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled={busy} onClick={() => void signOutHere()}>
          <LogOutIcon />
          {labels.signOut}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
