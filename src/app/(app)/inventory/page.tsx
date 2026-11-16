import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { PageHeader } from "@/components/templates/page-header";
import { PageState, loginHref } from "@/components/templates/page-state";
import { customColumnsOf, label, labelOverrides } from "@/modules/company-config";
import { myCompanyLayer, myFeeSchedule } from "@/modules/company-config/server";
import { allowedScope } from "@/modules/identity";
import { currentSession } from "@/modules/identity/server";
import { SessionRoles } from "@/modules/identity/ui";
import { mySavedView, mySavedViews } from "@/modules/listings/server";

import { feeHeaders, withFees } from "../inventory-fees";
import { inventorySource, standInRole } from "../inventory-source";
import { placesOf, recordsOf, rowsOf } from "../inventory-view";
import { entryAction, entryRefused, NAV } from "../nav";
import { savedViewLabels } from "../saved-view-labels";
import {
  ENTRY_COPY,
  InventoryGrid,
  cellEditLabels,
  SAVED_VIEW_PARAM,
  savedViewCopy,
  GEO_PARAM,
  geoFiltersFor,
  geoTree,
  inventoryFiltersFrom,
  inventoryOpeningFor,
  inventoryStateFrom,
  inventoryEdgeRowsFrom,
  type InventoryField,
  type RecordLabels,
} from "@/modules/listings/ui";

export const metadata: Metadata = { title: label("Inventory") };

/** Words of the record's AskListAgent and ReportUnitError buttons (row 3e), from the label table. */
const ASK_WORDS = {
  ask: label("AskListAgent"),
  report: label("ReportUnitError"),
  unit: label("Unit"),
  listAgent: label("ListAgent"),
};

/**
 * Headers of the eight inventory columns, from the label table (approved at the scope gate, Hỏi-2), with the
 * company's own words where it chose some (row 7e).
 */
function headersFor(overrides: Parameters<typeof label>[1]): Record<InventoryField, string> {
  return {
    "Listing.unitNumber": label("Unit", overrides),
    "Listing.buildingName": label("Building", overrides),
    "Listing.subdivisionName": label("Subdivision", overrides),
    "Listing.standardStatus": label("StandardStatus", overrides),
    "Listing.listPrice": label("ListPrice", overrides),
    "Unit.livingArea": label("LivingArea", overrides),
    "Unit.bedroomsTotal": label("BedroomsTotal", overrides),
    "Listing.lastConfirmedAt": label("LastConfirmedAt", overrides),
  };
}

/** Labels of the full unit record (row 3b), from the label table. */
const RECORD_LABELS: RecordLabels = {
  unit: label("Unit"),
  unitKind: label("UnitKind"),
  livingArea: label("LivingArea"),
  bedrooms: label("BedroomsTotal"),
  floor: label("UnitFloorLocation"),
  direction: label("DirectionFaces"),
  building: label("Building"),
  subdivision: label("Subdivision"),
  propertyType: label("PropertySubType"),
  listPrice: label("ListPrice"),
  completeness: label("Completeness"),
  currentListing: label("CurrentListing"),
  viewedListing: label("ViewedListing"),
  listingsOfUnit: label("ListingsOfUnit"),
  parts: {
    listPrice: label("ListPrice"),
    furnished: label("Furnished"),
    legalStatus: label("LegalStatus"),
    financing: label("Financing"),
    occupantType: label("OccupantType"),
  },
  furnishedValues: {
    Furnished: label("FurnishedFull"),
    Partially: label("FurnishedPartial"),
    Unfurnished: label("FurnishedNone"),
  },
  occupantValues: {
    Owner: label("OccupantOwner"),
    Tenant: label("OccupantTenant"),
    Vacant: label("OccupantVacant"),
  },
  propertyTypeValues: {
    Condominium: label("SubTypeCondominium"),
    Townhouse: label("SubTypeTownhouse"),
    "Single Family Residence": label("SubTypeSingleFamily"),
    "Unimproved Land": label("SubTypeLand"),
  },
};

const FEE_HEADERS = feeHeaders();

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

/** A query parameter's first value; a repeated parameter keeps its first value. */
const first = (value: string | string[] | undefined): string | undefined =>
  Array.isArray(value) ? value[0] : value;

/** Where this request came from, so the sign-in page brings the person back to it. */
function hereOf(query: Record<string, string | string[] | undefined>): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    const v = first(value);
    if (v !== undefined) params.set(key, v);
  }
  const q = params.toString();
  return q ? `/inventory?${q}` : "/inventory";
}

/** Inventory: the signed-in company's listings (row 10), or the sample company where no database is configured. */
export default async function Page({ searchParams }: Props) {
  const query = await searchParams;
  const state = first(query.state);
  const source = await inventorySource();
  // With a database there is no stand-in: no session goes to sign-in, whatever ?vai= says (row 10, AC-9).
  if (source.kind === "signed-out") redirect(loginHref(hereOf(query)));
  const live = source.kind !== "ready" || source.live;
  const vai = standInRole(source, first(query.vai), process.env.NODE_ENV);
  // The screen's entry rule, before any listing is shown (row 2b, AC-9): a role the register keeps out sees «not
  // allowed» at every width, the same block as the members page (row 9b); so does a role without viewListings.
  if (source.kind === "forbidden") return <PageState kind="forbidden" homeHref="/" />;
  if (entryAction(NAV, "/inventory") !== undefined) {
    const session = await currentSession();
    const roles = session ? session.roles : vai ? [vai] : [];
    if (entryRefused(NAV, "/inventory", roles)) return <PageState kind="forbidden" homeHref="/" />;
  }
  const data = source.kind === "ready" ? source.data : null;
  // A status shortcut opens the grid filtered (row 2a).
  const status = first(query.status);
  // A saved view opens by its own address (row 2c): gone, or someone else's, opens every unit with a sentence.
  const viewId = first(query[SAVED_VIEW_PARAM]);
  const [listed, openView, layer, fees] = await Promise.all([
    mySavedViews("inventory"),
    viewId ? mySavedView(viewId) : Promise.resolve(null),
    myCompanyLayer(),
    myFeeSchedule(),
  ]);
  // The company's own words and columns (row 7e); without a readable layer, the standard ones.
  const headers = headersFor({ overrides: labelOverrides(layer?.labels ?? []) });
  const customColumns = customColumnsOf(layer?.fields ?? []);
  const missing = viewId !== undefined && openView === null;
  // Views that could not be read still leave saving open; the server checks names again.
  const savedViews = listed === "unreadable" ? [] : listed;
  const viewLabels = savedViewLabels();
  const viewCopy = savedViewCopy(viewLabels);
  const listings = data?.current ?? [];
  // Development only, on the sample company: `?mau=bien` adds edge rows (row 2b) so the phone cards can be measured with
  // long codes and prices. Net to seller under the company's fee schedule (row 19); no readable schedule leaves it empty.
  const rows = withFees(
    [
      ...(data ? rowsOf(data) : []),
      ...(live ? [] : inventoryEdgeRowsFrom(first(query.mau), process.env.NODE_ENV)),
    ],
    listings,
    fees?.items ?? null,
  );
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
  // A place of the geography tree (row 2d) fills the project and building filters with whole names.
  const places = ([] as string[]).concat(query[GEO_PARAM] ?? []);
  const tree = geoTree(rows, data ? placesOf(data) : []);
  const geo = geoFiltersFor(tree, places);
  const filters =
    openView || missing
      ? undefined
      : { ...inventoryFiltersFrom(status), ...opening.filters, ...geo };
  // A shared link (row 3f) to a listing no longer on the inventory: the grid opens as usual and says why.
  const asked = first(query["ho-so"]);
  const stale = asked !== undefined && !rows.some((row) => row.id === asked);
  // On the sample company only (no database, outside production), ?vai=<role> stands in for the session's role, so the
  // browser tests and the screenshots of row 4 can open the cells the permission table gives that role.
  const standIn = vai ? [vai] : null;
  // Moving a status cell to Active needs activateListing: own scope offers it on one's own unit or one nobody keeps.
  const activate = live
    ? allowedScope((await currentSession())?.roles ?? [], "activateListing")
    : "company";
  const noActivate =
    activate === "company"
      ? []
      : listings
          .filter((l) => activate === null || data?.keepers[l.id]?.kind === "other")
          .map((l) => l.id);
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
        key={JSON.stringify(filters ?? null)}
        savedViews={savedViews}
        openView={openView}
        viewLabels={viewLabels}
        askWords={ASK_WORDS}
        title={label("Listing")}
        headers={headers}
        customColumns={customColumns}
        feeHeaders={FEE_HEADERS}
        rows={rows}
        listings={listings}
        editLabels={cellEditLabels((concept, transaction) => label(concept, { transaction }))}
        state={
          source.kind === "unreadable" ? "error" : inventoryStateFrom(state, process.env.NODE_ENV)
        }
        live={live}
        readFailed={source.kind === "unreadable"}
        noActivate={noActivate}
        emptyWhy={`${label("Company")} chưa có ${label("Unit").toLocaleLowerCase("vi")} nào đang chào trên ${label("Inventory")}.`}
        reloadLabel="Tải lại"
        filters={filters}
        geoTree={tree}
        staleLinkNote={stale ? ENTRY_COPY.staleLink(label("Unit"), label("Inventory")) : undefined}
        fullRecord={{
          records: data ? recordsOf(data, new Date()) : {},
          labels: RECORD_LABELS,
          keepers: data?.keepers,
        }}
      />
    </>
  );
  return standIn ? <SessionRoles roles={standIn}>{page}</SessionRoles> : page;
}
