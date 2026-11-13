import { cookies } from "next/headers";

import { AppShell } from "@/components/templates/app-shell";
import { PlaceChangeProvider } from "@/components/templates/app-shell/place-change";
import {
  COLUMN_COOKIE,
  columnOpenFromCookie,
} from "@/components/templates/app-shell/column-cookie";
import { label } from "@/modules/company-config";
import { currentSession } from "@/modules/identity/server";
import { SessionRoles } from "@/modules/identity/ui";
import { mySavedViews } from "@/modules/listings/server";
import { savedViewsSection } from "@/modules/listings/ui";

import { AccountMenu } from "./account-menu";
import { CompanySwitch } from "./company-switch";
import { navFor } from "./nav";
import { savedViewLabels } from "./saved-view-labels";

/** Every internal screen stands in the frame; its error, loading and not-found states too. */
export default async function FrameLayout({ children }: { children: React.ReactNode }) {
  const session = await currentSession();
  const columnOpen = columnOpenFromCookie((await cookies()).get(COLUMN_COOKIE)?.value);
  // Read on the server so the second column, on the desktop and in the phone sheet, has them on the first paint; a
  // save, rename or removal refreshes the page (row 2c).
  const nav = navFor({
    savedViews: session
      ? savedViewsSection(await mySavedViews("inventory"), savedViewLabels())
      : null,
  });
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
      <PlaceChangeProvider>
        <AppShell
          nav={nav}
          roles={session?.roles ?? []}
          columnOpen={columnOpen}
          company={
            account ? (
              <CompanySwitch company={account.company} companies={account.companies} />
            ) : null
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
      </PlaceChangeProvider>
    </SessionRoles>
  );
}
