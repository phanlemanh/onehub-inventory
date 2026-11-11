import { AppShell } from "@/components/templates/app-shell";
import { label } from "@/modules/company-config";
import { currentSession } from "@/modules/identity/server";

import { AccountMenu } from "./account-menu";
import { NAV } from "./nav";

/** Every internal screen stands in the frame; its error, loading and not-found states too. */
export default async function FrameLayout({ children }: { children: React.ReactNode }) {
  const session = await currentSession();
  const account = session
    ? {
        name: session.name,
        email: session.email,
        company: session.company,
        companies: session.companies,
      }
    : null;
  return (
    <AppShell
      nav={NAV}
      roles={session?.roles ?? []}
      account={
        <AccountMenu
          account={account}
          labels={{ signIn: label("SignIn"), signOut: label("SignOut") }}
        />
      }
    >
      {children}
    </AppShell>
  );
}
