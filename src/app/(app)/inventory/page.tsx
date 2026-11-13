import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { PageHeader } from "@/components/templates/page-header";
import { sampleUnits, subdivisionNameOf } from "@/modules/catalog";
import { label } from "@/modules/company-config";
import { SAMPLE_COMPANY, buildSampleListings } from "@/modules/listings";
import {
  ENTRY_COPY,
  InventoryGrid,
  inventoryFiltersFrom,
  inventoryOpeningFor,
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

/** A query parameter's first value; a repeated parameter keeps its first value. */
const first = (value: string | string[] | undefined): string | undefined =>
  Array.isArray(value) ? value[0] : value;

/** Inventory, read-only: the sample company's listings (roadmap row 1) on the shared grid. */
export default async function Page({ searchParams }: Props) {
  const query = await searchParams;
  const state = first(query.state);
  // A status shortcut opens the grid filtered (row 2a).
  const status = first(query.status);
  const units = sampleUnits().map((u) => ({ ...u, subdivisionName: subdivisionNameOf(u) }));
  const { listings, listingUnits } = buildSampleListings({ companyId: SAMPLE_COMPANY.id, units });
  const rows = inventoryRows({ listings, listingUnits, units });
  // The top-bar search (row 3f) opens the grid with its text in a column filter; one unit found opens its record
  // through the record's own address (row 3), so the back button and «Chép đường dẫn» work as usual.
  const opening = inventoryOpeningFor(rows, {
    code: first(query.ma),
    building: first(query.toa),
    subdivision: first(query["du-an"]),
  });
  if (opening.recordId !== null && first(query["ho-so"]) === undefined) {
    const next = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      const v = first(value);
      if (v !== undefined) next.set(key, v);
    }
    next.set("ho-so", opening.recordId);
    redirect(`/inventory?${next}`);
  }
  const filters = { ...inventoryFiltersFrom(status), ...opening.filters };
  // A shared link (row 3f) to a listing no longer on the inventory: the grid opens as usual and says why.
  const asked = first(query["ho-so"]);
  const stale = asked !== undefined && !rows.some((row) => row.id === asked);
  return (
    <>
      <PageHeader title={label("Inventory")} />
      <InventoryGrid
        key={JSON.stringify(filters)}
        title={label("Listing")}
        headers={HEADERS}
        rows={rows}
        state={inventoryStateFrom(state, process.env.NODE_ENV)}
        emptyWhy={`${label("Company")} chưa có ${label("Unit").toLocaleLowerCase("vi")} nào đang chào trên ${label("Inventory")}.`}
        reloadLabel="Tải lại"
        filters={filters}
        staleLinkNote={stale ? ENTRY_COPY.staleLink(label("Unit"), label("Inventory")) : undefined}
      />
    </>
  );
}
