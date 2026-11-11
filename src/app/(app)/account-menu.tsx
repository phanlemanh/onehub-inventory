"use client";

import { LogInIcon, LogOutIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useSyncExternalStore } from "react";

import { loginHref } from "@/components/templates/page-state";
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
 * The account corner of the frame (row 8, N6): «sign in» when nobody is signed in; otherwise who you are, the
 * company you work in, switching company when you belong to several, and signing out.
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
  // Set once the menu runs in the browser: before that, a click on the button opens nothing.
  const ready = useSyncExternalStore(
    noSubscribe,
    () => true,
    () => false,
  );

  if (!account) {
    return (
      <Link
        href={loginHref(pathname || "/")}
        className="text-sm font-medium"
        data-slot="account-sign-in"
      >
        <span className="inline-flex items-center gap-1">
          <LogInIcon className="size-4" aria-hidden />
          {labels.signIn}
        </span>
      </Link>
    );
  }

  async function switchTo(companyId: string) {
    setOpen(false);
    if (companyId === account?.company?.id) return;
    setBusy(true);
    const res = await fetch(`${AUTH_BASE_PATH}/session/company`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ companyId }),
    });
    setBusy(false);
    if (res.ok) router.refresh();
  }

  async function signOut() {
    setBusy(true);
    await fetch(`${AUTH_BASE_PATH}/session`, { method: "DELETE" }).catch(() => null);
    router.replace("/login");
    router.refresh();
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            size="icon-sm"
            aria-label={COPY.account}
            data-slot="account-menu"
            data-ready={ready || undefined}
          />
        }
      >
        {initial(account)}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <span className="flex flex-col gap-0.5">
              <span className="text-sm font-medium text-foreground">{account.name}</span>
              <span className="break-all">{account.email}</span>
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
              <DropdownMenuSubTrigger disabled={busy}>{COPY.switchCompany}</DropdownMenuSubTrigger>
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
        <DropdownMenuItem disabled={busy} onClick={() => void signOut()}>
          <LogOutIcon />
          {labels.signOut}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
