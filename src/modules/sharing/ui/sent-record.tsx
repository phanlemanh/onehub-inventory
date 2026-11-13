// One sent link in the record panel beside the Sent grid (decision 0024: the floating panel is how every row opens).
import type { GridRow, RegionRecord } from "@/components/candidate/data-region";
import { EMPTY, formatByKind } from "@/lib/format";

import { sentColumns, type SentField } from "./sent-rows";

const text = (value: unknown): string =>
  value === null || value === undefined ? "" : String(value);

/** The record body: every column as label and value, then the units the link carries, one per line. */
export function SentRecordBody({
  row,
  headers,
  units,
  unitsHeading,
}: {
  row: GridRow;
  headers: Readonly<Record<SentField, string>>;
  units: readonly string[];
  unitsHeading: string;
}) {
  return (
    <div data-slot="sent-record" data-link-id={row.id} className="flex flex-col gap-4">
      <dl data-slot="sent-record-fields" className="grid grid-cols-5 gap-x-4 gap-y-2">
        {sentColumns(headers).map((column) => {
          const value = row[column.field];
          return (
            <div key={column.field} data-field={column.field} className="contents">
              <dt className="col-span-2 text-muted-foreground">{column.header}</dt>
              <dd className="col-span-3 min-w-0 break-words tabular-nums">
                {value === null || value === undefined || value === ""
                  ? EMPTY
                  : formatByKind(column.kind, value)}
              </dd>
            </div>
          );
        })}
      </dl>
      <section data-slot="sent-record-units" className="flex flex-col gap-2 border-t pt-4">
        <h3 className="text-sm font-medium">{unitsHeading}</h3>
        <ul className="flex flex-col gap-1 text-sm">
          {units.map((unit, i) => (
            <li key={`${unit}-${i}`} className="break-words">
              {unit}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

/**
 * How the Sent grid opens a row: the recipient names the record; the body shows the link's fields and its units.
 * `unitsOf` gives the units a link carries as text, built by the page from the listings module.
 */
export function sentRecord(
  headers: Readonly<Record<SentField, string>>,
  unitsOf: (linkId: string) => readonly string[],
  unitsHeading: string,
): RegionRecord {
  return {
    render: (row) => ({
      title: text(row["ShareLink.recipientName"]),
      body: (
        <SentRecordBody
          row={row}
          headers={headers}
          units={unitsOf(row.id)}
          unitsHeading={unitsHeading}
        />
      ),
    }),
  };
}
