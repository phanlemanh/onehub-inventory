import type { Metadata } from "next";

import { PageHeader } from "@/components/templates/page-header";
import { sampleUnits, subdivisionNameOf } from "@/modules/catalog";
import { label } from "@/modules/company-config";
import { SAMPLE_COMPANY, buildSampleListings } from "@/modules/listings";
import {
  SentGrid,
  buildSampleShareLinks,
  sentRows,
  sentStateFrom,
  type SentField,
} from "@/modules/sharing/ui";

export const metadata: Metadata = { title: label("Sent") };

/** Headers of the six Sent columns, from the label table. */
const HEADERS: Record<SentField, string> = {
  "ShareLink.recipientName": label("RecipientName"),
  "ShareLink.listingCount": label("ListingCount"),
  "ShareLink.sentAt": label("SentAt"),
  "ShareLink.openCount": label("OpenCount"),
  "ShareLink.interestCount": label("InterestCount"),
  "ShareLink.lastOpenedAt": label("LastOpenedAt"),
};

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

/**
 * Sent, read-only: the sample company's sent links (made up — sending is roadmap row 16, real opens row 18) on the
 * same shared grid as Inventory. Modules meet here by ids: listings give the listing ids, sharing builds the links.
 */
export default async function Page({ searchParams }: Props) {
  const { state } = await searchParams;
  const units = sampleUnits().map((u) => ({ ...u, subdivisionName: subdivisionNameOf(u) }));
  const { listings } = buildSampleListings({ companyId: SAMPLE_COMPANY.id, units });
  const { links, includes } = buildSampleShareLinks({
    companyId: SAMPLE_COMPANY.id,
    listingIds: listings.map((l) => l.id),
  });
  const listingById = new Map(listings.map((l) => [l.id, l]));
  const unitsByLink = Object.fromEntries(
    [...includes].map(([linkId, ids]) => [
      linkId,
      ids.map((id) => {
        const l = listingById.get(id);
        return [l?.unitNumber, l?.buildingName].filter(Boolean).join(" · ");
      }),
    ]),
  );
  return (
    <>
      <PageHeader title={label("Sent")} />
      <SentGrid
        title={label("ShareLink")}
        headers={HEADERS}
        rows={sentRows(links)}
        state={sentStateFrom(typeof state === "string" ? state : undefined, process.env.NODE_ENV)}
        emptyWhy={`Bạn chưa gửi link nào cho khách. Chọn ${label("Unit").toLocaleLowerCase("vi")} để gửi ở ${label("Inventory")}.`}
        emptyActionLabel={`Mở ${label("Inventory")}`}
        emptyActionHref="/inventory"
        unitsByLink={unitsByLink}
        unitsHeading={`${label("Unit")} trong link`}
      />
    </>
  );
}
