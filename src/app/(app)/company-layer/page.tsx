import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { loginHref, PageState } from "@/components/templates/page-state";
import { label } from "@/modules/company-config";
import { LABELABLE_CONCEPTS } from "@/modules/company-config/server";
import {
  CompanyLayerScreen,
  FeePart,
  forcedStateFrom,
  LAYER_ROUTE,
  layerPartFrom,
} from "@/modules/company-config/ui";
import { allowedScope } from "@/modules/identity";
import { currentSession } from "@/modules/identity/server";

export const metadata: Metadata = { title: label("CompanyLayer") };

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

/**
 * the company layer screen (row 7e): whoever the permission table gives readCompanyLayer sees the company's own layer, one
 * part at a time as the second column of the App Shell chooses it (`?part=`); anyone else sees «not allowed».
 */
export default async function Page({ searchParams }: Props) {
  const session = await currentSession();
  if (!session?.company) redirect(loginHref(LAYER_ROUTE));
  if (allowedScope(session.roles, "readCompanyLayer") === null) {
    return <PageState kind="forbidden" homeHref="/" />;
  }
  const query = await searchParams;
  const part = layerPartFrom(query);
  // The fee part (row 19) is a framed list, not a grid; its API answers by readFeeSchedule, which every role that
  // opens this screen holds.
  if (part === "fee-schedule") return <FeePart screenTitle={label("CompanyLayer")} />;
  return (
    <CompanyLayerScreen
      key={part}
      part={part}
      concepts={LABELABLE_CONCEPTS}
      forced={forcedStateFrom(query.state, process.env.NODE_ENV)}
    />
  );
}
