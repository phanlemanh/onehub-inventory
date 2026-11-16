import { cookies } from "next/headers";

import { AppShell } from "@/components/templates/app-shell";
import { PlaceChangeProvider } from "@/components/templates/app-shell/place-change";
import {
  COLUMN_COOKIE,
  columnOpenFromCookie,
} from "@/components/templates/app-shell/column-cookie";
import { FRAME_COPY } from "@/components/templates/frame-copy";
import { label } from "@/modules/company-config";
import { currentSession } from "@/modules/identity/server";
import { SessionRoles } from "@/modules/identity/ui";
import { mySavedViews } from "@/modules/listings/server";
import { UnitJump, geoSections, geoTree, savedViewsSection } from "@/modules/listings/ui";

import { AccountMenu } from "./account-menu";
import { CompanySwitch } from "./company-switch";
import { inventorySource } from "./inventory-source";
import { placesOf, rowsOf, searchRowsOf } from "./inventory-view";
import { navFor, searchShownFor } from "./nav";
import { savedViewLabels } from "./saved-view-labels";

/** Every internal screen stands in the frame; its error, loading and not-found states too. */
export default async function FrameLayout({ children }: { children: React.ReactNode }) {
  const session = await currentSession();
  const columnOpen = columnOpenFromCookie((await cookies()).get(COLUMN_COOKIE)?.value);
  // The same read as the inventory page in this render (React cache): the search and the tree show only its rows.
  const source = await inventorySource();
  const data = source.kind === "ready" ? source.data : null;
  const rows = data ? rowsOf(data) : [];
  // Read on the server so the second column, on the desktop and in the phone sheet, has them on the first paint; a
  // save, rename or removal refreshes the page (row 2c).
  const nav = navFor({
    savedViews: session
      ? savedViewsSection(await mySavedViews("inventory"), savedViewLabels())
      : null,
    // The inventory by place (row 2d): one group per project, its complexes and buildings, read from the grid's rows.
    geography: session
      ? geoSections(geoTree(rows, data ? placesOf(data) : []), {
          all: FRAME_COPY.secondColumn.all,
          emptyTitle: label("Subdivision"),
          empty: `Chưa có ${label("Unit").toLocaleLowerCase("vi")} nào trên ${label("Inventory")}.`,
        })
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
  const roles = session?.roles ?? [];
  const canSearch = searchShownFor(nav, roles);
  // Every action button and the App Shell's entries read the session's roles from here (PermittedAction, row 9e).
  return (
    <SessionRoles roles={roles}>
      <PlaceChangeProvider>
        <AppShell
          nav={nav}
          roles={roles}
          columnOpen={columnOpen}
          search={
            canSearch ? (
              <UnitJump
                rows={searchRowsOf(rows)}
                words={{
                  unit: label("Unit"),
                  building: label("Building"),
                  subdivision: label("Subdivision"),
                  inventory: label("Inventory"),
                }}
              />
            ) : null
          }
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
