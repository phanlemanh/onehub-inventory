import type { Metadata } from "next";

import { PageHeader } from "@/components/templates/page-header";
import { sampleUnits, subdivisionNameOf } from "@/modules/catalog";
import { label } from "@/modules/company-config";
import { SAMPLE_COMPANY, buildSampleListings } from "@/modules/listings";
import {
  InventoryGrid,
  inventoryFiltersFrom,
  inventoryRows,
  inventoryStateFrom,
  type InventoryField,
} from "@/modules/listings/ui";

export const metadata: Metadata = { title: label("Inventory") };

/** Headers of the eight inventory columns, from the label table (approved at the scope gate, Hỏi-2). */
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

/** Inventory, read-only: the sample company's listings (roadmap row 1) on the shared grid. */
export default async function Page({ searchParams }: Props) {
  const { state, status: statusParam } = await searchParams;
  // A status shortcut opens the grid filtered (row 2a); a repeated parameter keeps its first value.
  const status = Array.isArray(statusParam) ? statusParam[0] : statusParam;
  const units = sampleUnits().map((u) => ({ ...u, subdivisionName: subdivisionNameOf(u) }));
  const { listings, listingUnits } = buildSampleListings({ companyId: SAMPLE_COMPANY.id, units });
  return (
    <>
      <PageHeader title={label("Inventory")} />
      <InventoryGrid
        key={typeof status === "string" ? status : ""}
        title={label("Listing")}
        headers={HEADERS}
        rows={inventoryRows({ listings, listingUnits, units })}
        state={inventoryStateFrom(
          typeof state === "string" ? state : undefined,
          process.env.NODE_ENV,
        )}
        emptyWhy={`${label("Company")} chưa có ${label("Unit").toLocaleLowerCase("vi")} nào đang chào trên ${label("Inventory")}.`}
        reloadLabel="Tải lại"
        filters={inventoryFiltersFrom(typeof status === "string" ? status : undefined)}
      />
    </>
  );
}
