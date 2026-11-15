// One listing seen two ways (roadmap row 3, _acceptance/ho-so-can): the listing card, and the record that opens beside
// the inventory grid. Both read the same view, built from the grid row, so the card and the record never disagree.
import type { GridRow, RegionRecord } from "@/components/candidate/data-region";
import { TypedCell } from "@/components/candidate/typed-cell";
import { EMPTY, formatByKind } from "@/lib/format";
import type { TypedColumn } from "@/components/candidate/column-kind";

import Image from "next/image";
import type { ReactNode } from "react";

import { sampleKeeperOf } from "../sample";
import { AskListAgent } from "./ask-list-agent";
import type { AskWords } from "./ask-copy";
import { CopyLink } from "./copy-link";
import { inventoryColumns, type InventoryField } from "./inventory-rows";
import { ReportUnitError } from "./report-unit-error";

/** The catalog properties a person may report wrong (row 3e): the shared unit catalog's, not the company's own. */
const CATALOG_FIELDS: readonly InventoryField[] = [
  "Listing.unitNumber",
  "Listing.buildingName",
  "Listing.subdivisionName",
  "Unit.livingArea",
  "Unit.bedroomsTotal",
];
import {
  ListingRecordFull,
  type ListingRecordData,
  type RecordLabels,
} from "./listing-record-full";

/** The facts the card shows in its three-up row, in order (after product-grid-4's specs row). */
const CARD_FACTS: readonly InventoryField[] = [
  "Unit.livingArea",
  "Unit.bedroomsTotal",
  "Listing.lastConfirmedAt",
];

/** What both views of one listing read: its name, where it sits, and every inventory field by column. */
export interface ListingView {
  id: string;
  unitNumber: string;
  place: string;
  status: unknown;
  price: unknown;
  transaction?: "sale" | "lease";
  fields: readonly { column: TypedColumn; value: unknown }[];
  facts: readonly { column: TypedColumn; value: unknown }[];
}

/**
 * One value, shown the way a grid cell shows it (money «x,xx tỷ», m², a status badge), but laid out as text in a
 * line: the card and the record read left to right, they are not columns.
 */
function Value({
  column,
  value,
  transaction,
}: {
  column: TypedColumn;
  value: unknown;
  transaction?: "sale" | "lease";
}) {
  if (column.kind === "status")
    return <TypedCell kind="status" value={value} transaction={transaction} />;
  if (value === null || value === undefined || value === "") return <>{EMPTY}</>;
  return <span className="tabular-nums">{formatByKind(column.kind, value)}</span>;
}

const text = (value: unknown): string =>
  value === null || value === undefined ? "" : String(value);

/** The view of one row: the unit number names it; building and subdivision say where it is. */
export function listingView(
  row: GridRow,
  headers: Readonly<Record<InventoryField, string>>,
): ListingView {
  const columns = inventoryColumns(headers);
  const byField = new Map(columns.map((column) => [column.field, column]));
  const pick = (field: InventoryField) => ({
    column: byField.get(field) as TypedColumn,
    value: row[field],
  });
  return {
    id: row.id,
    unitNumber: text(row["Listing.unitNumber"]),
    place: [row["Listing.buildingName"], row["Listing.subdivisionName"]]
      .map(text)
      .filter((part) => part !== "")
      .join(" · "),
    status: row["Listing.standardStatus"],
    price: row["Listing.listPrice"],
    transaction: row.transaction,
    fields: columns.map((column) => ({ column, value: row[column.field] })),
    facts: CARD_FACTS.map(pick),
  };
}

/**
 * The listing card, arranged after product-grid-4's tile: unit number and price on one line, where it is and its
 * status under them, then three facts side by side. It carries no frame of its own; the caller places it (the head of
 * the record here, the card list on the phone in row 2b).
 */
export function ListingCard({
  view,
  priceLabel,
  layout = "stacked",
  photo,
  noPhoto = "tile",
  building,
}: {
  view: ListingView;
  priceLabel: string;
  /**
   * «stacked»: the head of the record (row 3). «row»: product-grid-4's horizontal tile for a list on a phone (row 2b) —
   * a square image on the left, unit code and price on one line, place and status under them, area and bedrooms last.
   */
  layout?: "stacked" | "row";
  /** The unit's photo (row 15); a unit without one shows its building on a muted tile, or no tile («none»). */
  photo?: string;
  noPhoto?: "tile" | "none";
  /** The building code the muted tile shows. */
  building?: string;
}) {
  if (layout === "row") {
    const facts = view.facts
      .filter(({ column }) => column.field !== "Listing.lastConfirmedAt")
      .filter(({ value }) => value !== null && value !== undefined && value !== "")
      .map(({ column, value }) =>
        column.kind === "count"
          ? `${formatByKind(column.kind, value)} ${column.header.toLocaleLowerCase("vi")}`
          : formatByKind(column.kind, value),
      );
    const tile = photo ? (
      <Image
        src={photo}
        alt=""
        width={64}
        height={64}
        unoptimized
        className="size-16 shrink-0 rounded-md object-cover"
      />
    ) : noPhoto === "tile" ? (
      <span
        aria-hidden="true"
        className="flex size-16 shrink-0 items-center justify-center rounded-md bg-muted p-1 text-center text-xs font-medium text-muted-foreground"
      >
        {building}
      </span>
    ) : null;
    return (
      <div
        data-slot="listing-card"
        data-layout="row"
        data-listing-id={view.id}
        className="flex w-full items-center gap-3"
      >
        {tile}
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <div className="flex items-baseline justify-between gap-2">
            <span data-slot="listing-card-unit" className="font-semibold break-all">
              {view.unitNumber}
            </span>
            {/* No label over the value: inside the phone list's link it would replace the price in the card's name. */}
            <span data-slot="listing-card-price" className="shrink-0 font-semibold tabular-nums">
              <TypedCell kind="money" value={view.price} transaction={view.transaction} />
            </span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span data-slot="listing-card-place" className="truncate text-sm text-muted-foreground">
              {view.place}
            </span>
            <span data-slot="listing-card-status" className="shrink-0">
              <TypedCell kind="status" value={view.status} transaction={view.transaction} />
            </span>
          </div>
          {facts.length > 0 ? (
            <span
              data-slot="listing-card-facts"
              className="text-xs text-muted-foreground tabular-nums"
            >
              {facts.join(" · ")}
            </span>
          ) : null}
        </div>
      </div>
    );
  }
  return (
    <div data-slot="listing-card" data-listing-id={view.id} className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <span data-slot="listing-card-unit" className="min-w-0 text-lg font-semibold break-all">
          {view.unitNumber}
        </span>
        <span
          data-slot="listing-card-price"
          aria-label={priceLabel}
          className="shrink-0 text-lg font-semibold tabular-nums"
        >
          <TypedCell kind="money" value={view.price} transaction={view.transaction} />
        </span>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span data-slot="listing-card-place" className="min-w-0 text-sm text-muted-foreground">
          {view.place}
        </span>
        <span data-slot="listing-card-status">
          <TypedCell kind="status" value={view.status} transaction={view.transaction} />
        </span>
      </div>
      <dl data-slot="listing-card-facts" className="flex flex-wrap gap-x-6 gap-y-2 border-t pt-3">
        {view.facts.map(({ column, value }) => (
          <div
            key={column.field}
            data-field={column.field}
            className="flex min-w-0 flex-col gap-0.5"
          >
            <dt className="text-xs text-muted-foreground">{column.header}</dt>
            <dd className="text-sm font-medium">
              <Value column={column} value={value} transaction={view.transaction} />
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/**
 * The record of one listing: the card on top, then every inventory field as label and value. `report` is the
 * properties' own action (row 3e, ReportUnitError), at the right above the fields.
 */
export function ListingRecordBody({
  view,
  priceLabel,
  report,
}: {
  view: ListingView;
  priceLabel: string;
  report?: ReactNode;
}) {
  return (
    <div data-slot="listing-record" data-listing-id={view.id} className="flex flex-col gap-4">
      <ListingCard view={view} priceLabel={priceLabel} />
      {report ? (
        <div
          data-slot="listing-record-fields-head"
          className="-mb-2 flex justify-end border-t pt-2"
        >
          {report}
        </div>
      ) : null}
      <dl
        data-slot="listing-record-fields"
        className={`grid grid-cols-5 gap-x-4 gap-y-2 ${report ? "" : "border-t pt-4"}`}
      >
        {view.fields.map(({ column, value }) => (
          <div key={column.field} data-field={column.field} className="contents">
            <dt className="col-span-2 text-muted-foreground">{column.header}</dt>
            <dd className="col-span-3 min-w-0 break-words">
              <Value column={column} value={value} transaction={view.transaction} />
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/** What the record shows for a catalog property, as the record shows it (money, m², «—»). */
const shownText = (column: TypedColumn, value: unknown): string =>
  value === null || value === undefined || value === "" ? EMPTY : formatByKind(column.kind, value);

/** The catalog properties of one listing a person may report wrong, in order, with what the record shows. */
export function reportFieldsOf(view: ListingView): { name: string; shown: string }[] {
  return view.fields
    .filter(({ column }) => CATALOG_FIELDS.includes(column.field as InventoryField))
    .map(({ column, value }) => ({ name: column.header, shown: shownText(column, value) }));
}

/** What the full record of row 3b reads: each row's unit and listings, and the labels the record shows. */
export interface FullRecordInput {
  records: Readonly<Record<string, ListingRecordData>>;
  labels: RecordLabels;
}

/**
 * How the inventory grid opens a row: the record names the unit and shows the listing's record body — the full record
 * of row 3b when the page passes the row's unit and listings, otherwise the eight inventory fields of row 3. With
 * `words` (row 3e) the record also carries ReportUnitError on its unit properties and AskListAgent at its foot.
 */
export function listingRecord(
  headers: Readonly<Record<InventoryField, string>>,
  full?: FullRecordInput,
  words?: AskWords,
): RegionRecord {
  return {
    render: (row) => {
      const view = listingView(row, headers);
      const building = text(row["Listing.buildingName"]);
      const report = words ? (
        <ReportUnitError
          key={view.id}
          unit={{
            unitNumber: view.unitNumber,
            building,
            subdivision: text(row["Listing.subdivisionName"]),
            buildingLabel: headers["Listing.buildingName"],
            subdivisionLabel: headers["Listing.subdivisionName"],
          }}
          fields={reportFieldsOf(view)}
          words={words}
        />
      ) : undefined;
      const data = full?.records[row.id];
      return {
        title: [view.unitNumber, building].filter((part) => part !== "").join(" · "),
        body:
          data && full ? (
            <ListingRecordFull
              key={view.id}
              view={view}
              data={data}
              labels={full.labels}
              report={report}
            />
          ) : (
            <ListingRecordBody
              view={view}
              priceLabel={headers["Listing.listPrice"]}
              report={report}
            />
          ),
        footer: words ? (
          <AskListAgent
            key={view.id}
            listing={{ id: view.id, unitNumber: view.unitNumber, buildingName: building }}
            keeper={sampleKeeperOf(view.id)}
            words={words}
          />
        ) : undefined,
        // Row 3f: the record's link, so a colleague opens the same listing on the inventory.
        actions: <CopyLink id={view.id} />,
      };
    },
  };
}
