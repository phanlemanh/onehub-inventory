import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { sampleUnits, subdivisionNameOf } from "@/modules/catalog";
import { label } from "@/modules/company-config";
import { SAMPLE_COMPANY, buildSampleListings } from "@/modules/listings";
import { inventoryRows, type InventoryField } from "@/modules/listings/ui";
import { STATUS_ORDER } from "@/components/candidate/grid-view";

import { SavedViewsProto, type ProtoVariant } from "./saved-views-proto";

export const metadata: Metadata = { title: "luu-goc-nhin" };

const HEADERS: Record<InventoryField, string> = {
  "Listing.unitNumber": label("Unit"),
  "Listing.buildingName": label("Building"),
  "Listing.subdivisionName": label("Subdivision"),
  "Listing.standardStatus": label("StandardStatus"),
  "Listing.listPrice": label("ListPrice"),
  "Unit.livingArea": label("LivingArea"),
  "Unit.bedroomsTotal": label("BedroomsTotal"),
  "Listing.lastConfirmedAt": label("LastConfirmedAt"),
};

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

/**
 * Development-only clickable prototype of row 2c (saved views in the App Shell's second column), for the scope gate.
 * `?ds=l1|l2` picks the list candidate, `?luu=s1|s2|s3` the way to save, `?chung=rieng|ca-san` whose views are listed.
 */
export default async function Page({ searchParams }: Props) {
  if (process.env.NODE_ENV === "production") notFound();
  const sp = await searchParams;
  const variant: ProtoVariant = {
    list: one(sp.ds) === "l2" ? "l2" : "l1",
    save: one(sp.luu) === "s2" ? "s2" : one(sp.luu) === "s3" ? "s3" : "s1",
    shared: one(sp.chung) === "ca-san",
    open: one(sp.mo) ?? null,
    status: one(sp.st) ?? null,
    dialog: one(sp.hop) ?? null,
    base: new URLSearchParams(
      Object.entries({ ds: one(sp.ds), luu: one(sp.luu), chung: one(sp.chung) }).filter(
        (e): e is [string, string] => typeof e[1] === "string",
      ),
    ).toString(),
  };
  const units = sampleUnits().map((u) => ({ ...u, subdivisionName: subdivisionNameOf(u) }));
  const { listings, listingUnits } = buildSampleListings({ companyId: SAMPLE_COMPANY.id, units });
  return (
    <SavedViewsProto
      variant={variant}
      title={label("Inventory")}
      regionTitle={label("Listing")}
      headers={HEADERS}
      rows={inventoryRows({ listings, listingUnits, units })}
      statusLabels={Object.fromEntries(STATUS_ORDER.map((s) => [s, label(`Status${s}`)]))}
      allLabel={`Tất cả ${label("Listing").toLocaleLowerCase("vi")}`}
    />
  );
}
