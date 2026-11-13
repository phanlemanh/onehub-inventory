import type { Metadata } from "next";

import { PageHeader } from "@/components/templates/page-header";
import { sampleUnits, subdivisionNameOf } from "@/modules/catalog";
import { label } from "@/modules/company-config";
import { SAMPLE_COMPANY, buildSampleListings } from "@/modules/listings";
import { isRole } from "@/modules/identity";
import { currentSession } from "@/modules/identity/server";
import { SessionRoles } from "@/modules/identity/ui";
import { mySavedView, mySavedViews } from "@/modules/listings/server";

import { savedViewLabels } from "../saved-view-labels";
import {
  InventoryGrid,
  SAVED_VIEW_PARAM,
  savedViewCopy,
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
  const params = await searchParams;
  const { state, status: statusParam, vai } = params;
  // A status shortcut opens the grid filtered (row 2a); a repeated parameter keeps its first value.
  const status = Array.isArray(statusParam) ? statusParam[0] : statusParam;
  // A saved view opens by its own address (row 2c): gone, or someone else's, opens every unit with a sentence.
  const viewParam = params[SAVED_VIEW_PARAM];
  const viewId = Array.isArray(viewParam) ? viewParam[0] : viewParam;
  const [listed, openView] = await Promise.all([
    mySavedViews("inventory"),
    viewId ? mySavedView(viewId) : Promise.resolve(null),
  ]);
  const missing = viewId !== undefined && openView === null;
  // Views that could not be read still leave saving open; the server checks names again.
  const savedViews = listed === "unreadable" ? [] : listed;
  const viewLabels = savedViewLabels();
  const viewCopy = savedViewCopy(viewLabels);
  const units = sampleUnits().map((u) => ({ ...u, subdivisionName: subdivisionNameOf(u) }));
  const { listings, listingUnits } = buildSampleListings({ companyId: SAMPLE_COMPANY.id, units });
  // Without a signed-in session, outside production, ?vai=<role> stands in for the session's role, so the browser
  // tests and the screenshots of row 4 can open the cells the permission table gives that role. A real session wins.
  const standIn =
    process.env.NODE_ENV !== "production" &&
    typeof vai === "string" &&
    isRole(vai) &&
    (await currentSession()) === null
      ? [vai]
      : null;
  const page = (
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
        key={typeof status === "string" ? status : ""}
        savedViews={savedViews}
        openView={openView}
        viewLabels={viewLabels}
        title={label("Listing")}
        headers={HEADERS}
        rows={inventoryRows({ listings, listingUnits, units })}
        listings={listings}
        state={inventoryStateFrom(
          typeof state === "string" ? state : undefined,
          process.env.NODE_ENV,
        )}
        emptyWhy={`${label("Company")} chưa có ${label("Unit").toLocaleLowerCase("vi")} nào đang chào trên ${label("Inventory")}.`}
        reloadLabel="Tải lại"
        filters={
          openView || missing
            ? undefined
            : inventoryFiltersFrom(typeof status === "string" ? status : undefined)
        }
      />
    </>
  );
  return standIn ? <SessionRoles roles={standIn}>{page}</SessionRoles> : page;
}
