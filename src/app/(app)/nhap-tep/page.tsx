import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { PageHeader } from "@/components/templates/page-header";
import { loginHref, PageState } from "@/components/templates/page-state";
import { label } from "@/modules/company-config";
import { allowedScope } from "@/modules/identity";
import { currentSession } from "@/modules/identity/server";
import { PermittedAction } from "@/modules/identity/ui";
import { ImportWizard } from "@/modules/imports/ui";

export const metadata: Metadata = { title: label("ImportScreen") };

/** The import screen (row 11): whoever the permission table gives importListings imports a file; anyone else sees «not allowed». */
export default async function Page() {
  const session = await currentSession();
  if (!session?.company) redirect(loginHref("/nhap-tep"));
  if (allowedScope(session.roles, "importListings") === null)
    return <PageState kind="forbidden" homeHref="/" />;
  return (
    <>
      <PageHeader title={label("ImportScreen")} />
      <PermittedAction action="importListings">
        <ImportWizard />
      </PermittedAction>
    </>
  );
}
