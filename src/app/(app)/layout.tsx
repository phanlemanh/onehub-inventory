import { cookies } from "next/headers";

import { AppShell } from "@/components/templates/app-shell";
import {
  COLUMN_COOKIE,
  columnOpenFromCookie,
} from "@/components/templates/app-shell/column-cookie";
import { label } from "@/modules/company-config";
import { currentSession } from "@/modules/identity/server";
import { SessionRoles } from "@/modules/identity/ui";

import { AccountMenu } from "./account-menu";
import { CompanySwitch } from "./company-switch";
import { NAV } from "./nav";

/** Every internal screen stands in the frame; its error, loading and not-found states too. */
export default async function FrameLayout({ children }: { children: React.ReactNode }) {
  const session = await currentSession();
  const columnOpen = columnOpenFromCookie((await cookies()).get(COLUMN_COOKIE)?.value);
  const account = session
    ? {
        name: session.name,
        email: session.email,
        company: session.company,
        companies: session.companies,
      }
    : null;
  // Every action button and the App Shell's entries read the session's roles from here (PermittedAction, row 9e).
  return (
    <SessionRoles roles={session?.roles ?? []}>
      <AppShell
        nav={NAV}
        roles={session?.roles ?? []}
        columnOpen={columnOpen}
        company={
          account ? <CompanySwitch company={account.company} companies={account.companies} /> : null
        }
        account={
          <AccountMenu
            account={account}
            labels={{ signIn: label("SignIn"), signOut: label("SignOut") }}
          />
        }
      >
        {children}
      </AppShell>
    </SessionRoles>
  );
}
