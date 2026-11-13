import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { loginHref, PageState } from "@/components/templates/page-state";
import { label } from "@/modules/company-config";
import { allowedScope, ROLES } from "@/modules/identity";
import { currentSession } from "@/modules/identity/server";

import { MembersScreen } from "./members-screen";

export const metadata: Metadata = { title: label("Member") };

/** Whoever the permission table gives listMembers sees the people of the company; anyone else sees «not allowed». */
export default async function Page() {
  const session = await currentSession();
  if (!session?.company) redirect(loginHref("/members"));
  const admin = label("CompanyAdmin");
  if (allowedScope(session.roles, "listMembers") === null) {
    return <PageState kind="forbidden" homeHref="/" />;
  }
  return (
    <MembersScreen
      labels={{
        title: label("Member"),
        invite: label("Invite"),
        changeRoles: label("ChangeRoles"),
        companyAdmin: admin,
        roles: Object.fromEntries(ROLES.map((r) => [r, label(r)])) as Record<
          (typeof ROLES)[number],
          string
        >,
      }}
    />
  );
}
