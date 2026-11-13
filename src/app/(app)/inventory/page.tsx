import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { PageHeader } from "@/components/templates/page-header";
import { label } from "@/modules/company-config";
import { mySavedView, mySavedViews } from "@/modules/listings/server";

import { sampleInventoryRows } from "../inventory-sample-rows";
import { savedViewLabels } from "../saved-view-labels";
import {
  ENTRY_COPY,
  InventoryGrid,
  SAVED_VIEW_PARAM,
  savedViewCopy,
  inventoryFiltersFrom,
  inventoryOpeningFor,
  inventoryStateFrom,
  type InventoryField,
} from "@/modules/listings/ui";

export const metadata: Metadata = { title: label("Inventory") };

/** Words of the record's AskListAgent and ReportUnitError buttons (row 3e), from the label table. */
const ASK_WORDS = {
  ask: label("AskListAgent"),
  report: label("ReportUnitError"),
  unit: label("Unit"),
  listAgent: label("ListAgent"),
};

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
  // A saved view opens by its own address (row 2c): gone, or someone else's, opens every unit with a sentence.
  const viewId = first(query[SAVED_VIEW_PARAM]);
  const [listed, openView] = await Promise.all([
    mySavedViews("inventory"),
    viewId ? mySavedView(viewId) : Promise.resolve(null),
  ]);
  const missing = viewId !== undefined && openView === null;
  // Views that could not be read still leave saving open; the server checks names again.
  const savedViews = listed === "unreadable" ? [] : listed;
  const viewLabels = savedViewLabels();
  const viewCopy = savedViewCopy(viewLabels);
  const rows = sampleInventoryRows();
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
  // One way to open the grid arranged (row 2c's initial view): a saved view's own arrangement wins; otherwise the
  // status shortcut and the search's column filter fill the column filters the grid opens with.
  const filters =
    openView || missing ? undefined : { ...inventoryFiltersFrom(status), ...opening.filters };
  // A shared link (row 3f) to a listing no longer on the inventory: the grid opens as usual and says why.
  const asked = first(query["ho-so"]);
  const stale = asked !== undefined && !rows.some((row) => row.id === asked);
  return (
    <>
      <PageHeader title={openView ? openView.name : label("Inventory")} />
      {/* Always present, so the sentence about a view that is gone is read out when it appears. */}
      <p
        role="status"
        data-slot="saved-view-missing"
        className="rounded-md border px-3 py-2 text-sm empty:hidden"
      >
        {missing ? (
          <>
            <span className="font-medium">{viewCopy.missing}.</span>{" "}
            <span className="text-muted-foreground">{viewCopy.missingWhy}</span>
          </>
        ) : null}
      </p>
      <InventoryGrid
        key={JSON.stringify(filters ?? null)}
        savedViews={savedViews}
        openView={openView}
        viewLabels={viewLabels}
        askWords={ASK_WORDS}
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
