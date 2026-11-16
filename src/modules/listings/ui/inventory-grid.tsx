"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { FieldKey } from "@/components/candidate/column-kind";
import { DataRegion, type GridRow, type RegionStatus } from "@/components/candidate/data-region";
import type { RegionPhoneList } from "@/components/candidate/phone-list";
import type { ColumnFilters, GridView } from "@/components/candidate/grid-view";
import { usePlaceChange } from "@/components/templates/app-shell/place-change";
import { notifyResult } from "@/components/templates/notify";
import { Button } from "@/components/ui/button";
import type { Listing } from "@/generated/ontology";

import type { ListingSaveDoor } from "../save-door";
import { httpSaveDoor } from "./http-save-door";
import type { SavedView } from "../saved-view";

import {
  FEE_INCLUSION_FIELD,
  INVENTORY_GROUP_BY,
  cardNetOf,
  inventoryColumns,
  type InventoryCustomColumn,
  type InventoryFeeHeaders,
  type InventoryField,
  type InventoryState,
} from "./inventory-rows";
import type { AskWords } from "./ask-copy";
import { ListingCard, listingRecord, listingView, type FullRecordInput } from "./listing-record";
import { SaveViewButtons } from "./save-view-buttons";
import { gridView, sameAsStored, savedViewHref } from "./saved-view-api";
import { savedViewCopy, type SavedViewLabels } from "./saved-view-copy";
import type { CellEditLabels } from "./cell-edit-copy";
import { useListingCellEdit } from "./use-listing-cell-edit";
import type { GeoNode } from "./geo-tree";
import { useGeoPlace } from "./use-geo-place";

/** Rows kept when part of the load fails: the first page and a half, so the partial state still spans two pages. */
const PARTIAL_ROWS = 40;
/** The fee inclusion column is in the Cột menu, off until the person turns it on (row 19, Hỏi-3). */
const HIDDEN_AT_FIRST = [FEE_INCLUSION_FIELD] as const;

/** The inventory grid: the screen declares columns, rows, its empty reason and what one listing's record shows. */
export function InventoryGrid({
  title,
  headers,
  customColumns,
  feeHeaders,
  rows,
  state,
  emptyWhy,
  reloadLabel,
  filters,
  staleLinkNote,
  savedViews,
  openView,
  viewLabels,
  askWords,
  fullRecord,
  listings,
  editLabels,
  door,
  live = false,
  noActivate,
  geoTree,
}: {
  title: string;
  headers: Readonly<Record<InventoryField, string>>;
  /** The company's own columns (row 7e), after the eight standard ones. */
  customColumns?: readonly InventoryCustomColumn[];
  /** Headers of the fee columns (row 19); without them the grid has no net-to-seller or fee inclusion column. */
  feeHeaders?: InventoryFeeHeaders;
  rows: readonly GridRow[];
  state: InventoryState;
  emptyWhy: string;
  /** The empty state's next step: load the list again (someone may have added units meanwhile). */
  reloadLabel: string;
  /** Column filters the grid opens with (a status shortcut, or the top-bar search of row 3f). */
  filters?: ColumnFilters;
  /** Said once when the page opens: the address named a listing that is not among the rows (a stale link, row 3f). */
  staleLinkNote?: string;
  /** The person's saved views (row 2c); null when their roles cannot save one. */
  savedViews?: readonly SavedView[] | null;
  /** The saved view the address opens; the grid opens with its arrangement. */
  openView?: SavedView | null;
  /** Words of the saved views, from the label table (needed with `savedViews`). */
  viewLabels?: SavedViewLabels;
  /** Words of the AskListAgent and ReportUnitError buttons in the record (row 3e), from the label table. */
  askWords?: AskWords;
  /** Each row's unit and listings with the record's labels (row 3b); without it the record shows the eight fields. */
  fullRecord?: FullRecordInput;
  /** The listings the rows show: with them, price and status are edited in the cell under the permission table (row 4). */
  listings?: readonly Listing[];
  /** Words of the cell editors from the label table (needed with `listings`). */
  editLabels?: CellEditLabels;
  /** The save door of those edits (tests); otherwise the real /api/v1 door when `live`, the sample door when not. */
  door?: ListingSaveDoor;
  /** The rows are the company's real listings (row 10): edits go to /api/v1 and «Tải lại» reads them again. */
  live?: boolean;
  /** Rows whose status cell does not offer Active to this person (row 10, AC-5). */
  noActivate?: readonly string[];
  /** 2d: the places of the grid's rows; the second column's place entries then filter the grid in place. */
  geoTree?: readonly GeoNode[];
}) {
  const router = useRouter();
  const [current, setCurrent] = useState<InventoryState>(state);
  // A new read of the page (Tải lại, or after a change the server works out) brings its own state.
  const [givenState, setGivenState] = useState(state);
  if (givenState !== state) {
    setGivenState(state);
    setCurrent(state);
  }
  const [realDoor] = useState(() => (live && !door ? httpSaveDoor() : undefined));
  const place = usePlaceChange();
  const [view, setView] = useState<GridView | null>(null);
  const saved = useMemo(() => (openView ? gridView(openView.view) : undefined), [openView]);
  const copy = useMemo(() => (viewLabels ? savedViewCopy(viewLabels) : null), [viewLabels]);
  const changed =
    openView != null && saved !== undefined && view !== null && !sameAsStored(view, saved);
  // The second column marks the open view «đã đổi» while the grid differs from what was saved (Hỏi-5: never saved by itself).
  const { setChanged } = place;
  const openHref = openView ? savedViewHref(openView.id) : null;
  useEffect(() => {
    setChanged(changed && openHref ? { href: openHref, mark: copy?.changed ?? "" } : null);
  }, [changed, openHref, setChanged, copy]);
  useEffect(() => () => setChanged(null), [setChanged]);
  const record = useMemo(
    () => listingRecord(headers, fullRecord, askWords),
    [headers, fullRecord, askWords],
  );
  // A shared link to a listing that left the inventory opens the grid as usual, and says why no record opened.
  const staleSaid = useRef(false);
  useEffect(() => {
    if (!staleLinkNote || staleSaid.current) return;
    staleSaid.current = true;
    notifyResult({ message: staleLinkNote });
  }, [staleLinkNote]);
  // The same columns on every render: this grid renders again on each change of arrangement (the «changed» mark), and
  // new columns would draw the header cells, with the filter box being typed in, again.
  const columns = useMemo(
    () => inventoryColumns(headers, customColumns, feeHeaders),
    [headers, customColumns, feeHeaders],
  );
  const headerOf = useCallback(
    (field: FieldKey) => columns.find((c) => c.field === field)?.header ?? field,
    [columns],
  );
  // 2d: a place picked in the second column changes the project and building filters only; the address follows.
  const geo = useGeoPlace({ tree: geoTree, rows, columns, view, active: !openView });
  // Below 768 px the region shows each row as the listing card's row layout (row 2b): the record head's own card.
  // With the fee columns (row 19) a card whose price includes the fees also shows what the seller nets; a card without
  // fees included, without a price or without a fee condition stays as row 2b drew it.
  const inclusionOf = useMemo(
    () => new Map((listings ?? []).map((l) => [l.id, l.feeInclusion])),
    [listings],
  );
  const phoneList = useMemo(
    (): RegionPhoneList<GridRow> => ({
      label: (row) => `${headers["Listing.unitNumber"]} ${String(row["Listing.unitNumber"] ?? "")}`,
      card: (row) => {
        const net = feeHeaders
          ? cardNetOf(row, inclusionOf.get(row.id), feeHeaders.netToSeller)
          : null;
        return (
          <ListingCard
            layout="row"
            view={listingView(row, headers)}
            priceLabel={headers["Listing.listPrice"]}
            building={String(row["Listing.buildingName"] ?? "")}
            net={net}
          />
        );
      },
    }),
    [headers, feeHeaders, inclusionOf],
  );
  const edit = useListingCellEdit({
    rows,
    listings,
    headers,
    labels: editLabels,
    door: door ?? realDoor,
    headerOf,
    noActivate,
    feeEditable: feeHeaders !== undefined && live,
    onServerWork: live ? () => router.refresh() : undefined,
  });
  const status: RegionStatus = current === "empty" ? "ready" : current;
  const shown =
    current === "empty" ? [] : current === "partial" ? edit.rows.slice(0, PARTIAL_ROWS) : edit.rows;
  return (
    <>
      {edit.dialogs}
      <DataRegion
        // Pressing the open entry of the second column again opens it afresh, its unsaved changes dropped.
        key={`${openView?.id ?? ""}:${place.reopened}:${geo.picked}`}
        title={title}
        columns={columns}
        rows={shown}
        status={status}
        onRetry={() => (live ? router.refresh() : setCurrent("ready"))}
        record={record}
        emptyWhy={emptyWhy}
        initialFilters={filters}
        initialView={geo.view ?? saved}
        hiddenAtFirst={feeHeaders ? HIDDEN_AT_FIRST : undefined}
        onViewChange={setView}
        action={
          savedViews && copy
            ? {
                allowed: true,
                node: (
                  <SaveViewButtons
                    current={view}
                    open={openView ?? null}
                    changed={changed}
                    taken={savedViews.map((v) => v.name)}
                    copy={copy}
                  />
                ),
              }
            : undefined
        }
        groupBy={INVENTORY_GROUP_BY}
        emptyAction={
          <Button variant="outline" onClick={() => router.refresh()}>
            {reloadLabel}
          </Button>
        }
        cellEdit={edit.cellEdit}
        phoneList={phoneList}
      />
    </>
  );
}
