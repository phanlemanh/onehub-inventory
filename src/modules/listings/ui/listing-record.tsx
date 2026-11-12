// One listing seen two ways (roadmap row 3, _acceptance/ho-so-can): the listing card, and the record that opens beside
// the inventory grid. Both read the same view, built from the grid row, so the card and the record never disagree.
import type { GridRow, RegionRecord } from "@/components/candidate/data-region";
import { TypedCell } from "@/components/candidate/typed-cell";
import { EMPTY, formatByKind } from "@/lib/format";
import type { TypedColumn } from "@/components/candidate/column-kind";

import { inventoryColumns, type InventoryField } from "./inventory-rows";

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
export function ListingCard({ view, priceLabel }: { view: ListingView; priceLabel: string }) {
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
      <dl data-slot="listing-card-facts" className="grid grid-cols-3 gap-3 border-t pt-3">
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

/** The record of one listing: the card on top, then every inventory field as label and value. */
export function ListingRecordBody({ view, priceLabel }: { view: ListingView; priceLabel: string }) {
  return (
    <div data-slot="listing-record" data-listing-id={view.id} className="flex flex-col gap-4">
      <ListingCard view={view} priceLabel={priceLabel} />
      <dl
        data-slot="listing-record-fields"
        className="grid grid-cols-5 gap-x-4 gap-y-2 border-t pt-4"
      >
        {view.fields.map(({ column, value }) => (
          <div key={column.field} data-field={column.field} className="contents">
            <dt className="col-span-2 text-muted-foreground">{column.header}</dt>
            <dd className="col-span-3 min-w-0">
              <Value column={column} value={value} transaction={view.transaction} />
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/** How the inventory grid opens a row: the record names the unit and shows the listing's record body. */
export function listingRecord(headers: Readonly<Record<InventoryField, string>>): RegionRecord {
  return {
    render: (row) => {
      const view = listingView(row, headers);
      return {
        title: [view.unitNumber, text(row["Listing.buildingName"])]
          .filter((part) => part !== "")
          .join(" · "),
        body: <ListingRecordBody view={view} priceLabel={headers["Listing.listPrice"]} />,
      };
    },
  };
}
