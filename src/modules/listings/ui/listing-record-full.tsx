"use client";
// The full unit record (roadmap row 3b, _acceptance/ho-so-du-thong-tin): the card of row 3 on top, then how long ago the
// listing was confirmed, how complete it is, the unit, the listing, and every listing of the unit. Read-only. Blocks
// follow solution-crm-4 (Hỏi-4 at the scope gate), assembled from what the repo has. Touching an earlier listing turns
// the whole record to it, the address stays (Hỏi-3).
import { useRef, useState, type ReactNode } from "react";

import { TypedCell } from "@/components/candidate/typed-cell";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { EMPTY, formatArea, formatMoney } from "@/lib/format";
import type {
  ListingFurnished,
  ListingOccupantType,
  ListingStandardStatus,
} from "@/generated/ontology";

import { completeness, unitKind, type CompletenessPart } from "../record";
import { OPEN_STATUSES } from "../sample";

import { ListingCard, type ListingView } from "./listing-record";
import { RECORD_COPY, confirmationSentence } from "./record-copy";

/** One listing of the unit as the record reads it; `confirmedDays` is counted on the server for the request. */
export interface RecordListing {
  id: string;
  number: number;
  standardStatus: ListingStandardStatus;
  listPrice?: number | undefined;
  transaction?: "sale" | "lease" | undefined;
  /** Day of creation, already written as the record shows dates (dd/mm/yyyy). */
  createdOn: string;
  confirmedDays: number | null;
  furnished?: ListingFurnished | undefined;
  occupantType?: ListingOccupantType | undefined;
  legalStatus?: string | undefined;
  financing?: string | undefined;
}

/** What the record reads of one grid row: the unit from the shared catalog and its listings, newest first. */
export interface ListingRecordData {
  unit: {
    unitNumber: string;
    bedroomsTotal: number | null;
    livingArea: number | null;
    floor: string | null;
    directionFaces: string | null;
    buildingName: string;
    subdivisionName: string | null;
    propertySubType: string | null;
  };
  listings: readonly RecordListing[];
}

/** Every label the record shows, from the label table (the page passes them; this module never hard-codes one). */
export interface RecordLabels {
  unit: string;
  unitKind: string;
  livingArea: string;
  bedrooms: string;
  floor: string;
  direction: string;
  building: string;
  subdivision: string;
  propertyType: string;
  listPrice: string;
  completeness: string;
  currentListing: string;
  viewedListing: string;
  listingsOfUnit: string;
  parts: Readonly<Record<CompletenessPart, string>>;
  furnishedValues: Readonly<Record<ListingFurnished, string>>;
  occupantValues: Readonly<Record<ListingOccupantType, string>>;
  propertyTypeValues: Readonly<Record<string, string>>;
}

const shown = (value: string | number | null | undefined): string =>
  value === null || value === undefined || value === "" ? EMPTY : String(value);

function Section({ slot, title, children }: { slot: string; title: string; children: ReactNode }) {
  return (
    <section data-slot={slot} aria-label={title} className="flex flex-col gap-2 border-t pt-4">
      <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{title}</h3>
      {children}
    </section>
  );
}

/** Label and value rows; a row whose value is missing says so in a quieter colour (`data-empty`). */
function Rows({ rows }: { rows: readonly { key: string; label: string; value: string | null }[] }) {
  return (
    <dl className="grid grid-cols-5 gap-x-4 gap-y-2 text-sm">
      {rows.map((row) => (
        <div key={row.key} data-field={row.key} className="contents">
          <dt className="col-span-2 text-muted-foreground">{row.label}</dt>
          {row.value === null ? (
            <dd data-empty="" className="col-span-3 min-w-0 text-muted-foreground italic">
              {RECORD_COPY.missing}
            </dd>
          ) : (
            <dd className="col-span-3 min-w-0 break-words">{row.value}</dd>
          )}
        </div>
      ))}
    </dl>
  );
}

/** The record body of one listing with its unit and all the unit's listings. */
export function ListingRecordFull({
  view,
  data,
  labels,
}: {
  view: ListingView;
  data: ListingRecordData;
  labels: RecordLabels;
}) {
  const newestId = data.listings[0]?.id ?? view.id;
  const [pickedId, setPickedId] = useState(newestId);
  const top = useRef<HTMLDivElement>(null);
  // Turning to another listing changes the card at the head: bring the head back into view so it reads top down.
  const pick = (id: string) => {
    setPickedId(id);
    const body = top.current?.closest<HTMLElement>('[data-slot="record-panel-body"]');
    if (body) body.scrollTop = 0;
  };
  const picked = data.listings.find((l) => l.id === pickedId) ?? data.listings[0];
  if (!picked) return null;
  const isNewest = picked.id === newestId;
  const unit = data.unit;
  const done = completeness(picked);
  const open = OPEN_STATUSES.includes(picked.standardStatus);
  // The card shows the listing in view: its price and status; place and the three facts come from the unit.
  const cardView: ListingView = {
    ...view,
    price: picked.listPrice ?? null,
    status: picked.standardStatus,
    transaction: picked.transaction,
    place: [
      unit.subdivisionName,
      unit.buildingName,
      unit.propertySubType && labels.propertyTypeValues[unit.propertySubType],
    ]
      .filter((part): part is string => Boolean(part))
      .join(" · "),
    facts: [
      view.facts[0]!,
      view.facts[1]!,
      {
        column: {
          ...view.facts[0]!.column,
          field: "Unit.directionFaces" as never,
          header: labels.direction,
          kind: "text",
        },
        value: unit.directionFaces,
      },
    ],
  };
  return (
    <div
      ref={top}
      data-slot="listing-record"
      data-listing-id={view.id}
      data-listing-in-view={picked.id}
      className="flex flex-col gap-4"
    >
      <ListingCard view={cardView} priceLabel={labels.listPrice} />
      <p data-slot="listing-confirmation" className="text-xs text-muted-foreground">
        {confirmationSentence(picked.confirmedDays)}
      </p>
      {isNewest ? null : (
        <div
          data-slot="listing-earlier-note"
          role="status"
          className="flex flex-wrap items-center justify-between gap-2 rounded-md bg-muted px-3 py-2 text-sm"
        >
          <span>{RECORD_COPY.viewingEarlier(picked.number)}</span>
          <Button variant="link" size="sm" onClick={() => pick(newestId)}>
            {RECORD_COPY.backToNewest}
          </Button>
        </div>
      )}
      {/* Row 15 places its ready-to-list button on this line, beside the count (LUAT, «Bộ nút của hồ sơ căn»). */}
      <div data-slot="listing-completeness" className="flex flex-col gap-1.5">
        <Progress value={done.have} max={done.need} aria-label={labels.completeness}>
          <div className="flex w-full items-center justify-between gap-2 text-sm">
            <span className="font-medium">{labels.completeness}</span>
            <span
              data-slot="listing-completeness-count"
              className="text-muted-foreground tabular-nums"
            >
              {done.have}/{done.need}
            </span>
          </div>
        </Progress>
        <p data-slot="listing-completeness-missing" className="text-xs text-muted-foreground">
          {done.missing.length === 0
            ? RECORD_COPY.complete
            : RECORD_COPY.lacking(done.missing.map((part) => labels.parts[part]))}
        </p>
      </div>
      <Section slot="listing-unit" title={labels.unit}>
        <Rows
          rows={[
            {
              key: "Listing.unitNumber",
              label: RECORD_COPY.unitCode(labels.unit),
              value: shown(unit.unitNumber),
            },
            {
              key: "Unit.unitKind",
              label: labels.unitKind,
              value: shown(unitKind(unit.bedroomsTotal)),
            },
            {
              key: "Unit.livingArea",
              label: labels.livingArea,
              value: unit.livingArea === null ? EMPTY : formatArea(unit.livingArea),
            },
            { key: "Unit.floor", label: labels.floor, value: shown(unit.floor) },
            {
              key: "Unit.directionFaces",
              label: labels.direction,
              value: shown(unit.directionFaces),
            },
            {
              key: "Listing.buildingName",
              label: labels.building,
              value: shown(unit.buildingName),
            },
            {
              key: "Listing.subdivisionName",
              label: labels.subdivision,
              value: shown(unit.subdivisionName),
            },
            {
              key: "Unit.propertySubType",
              label: labels.propertyType,
              value: shown(unit.propertySubType && labels.propertyTypeValues[unit.propertySubType]),
            },
          ]}
        />
      </Section>
      <Section slot="listing-offer" title={open ? labels.currentListing : labels.viewedListing}>
        <Rows
          rows={[
            {
              key: "Listing.legalStatus",
              label: labels.parts.legalStatus,
              value: picked.legalStatus?.trim() || null,
            },
            {
              key: "Listing.furnished",
              label: labels.parts.furnished,
              value: picked.furnished ? labels.furnishedValues[picked.furnished] : null,
            },
            {
              key: "Listing.financing",
              label: labels.parts.financing,
              value: picked.financing?.trim() || null,
            },
            {
              key: "Listing.occupantType",
              label: labels.parts.occupantType,
              value: picked.occupantType ? labels.occupantValues[picked.occupantType] : null,
            },
          ]}
        />
      </Section>
      <Section
        slot="listings-of-unit"
        title={RECORD_COPY.listingsOfUnit(labels.listingsOfUnit, labels.unit, data.listings.length)}
      >
        <ul className="flex flex-col gap-1">
          {data.listings.map((l) => (
            <li
              key={l.id}
              data-listing-id={l.id}
              className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1"
            >
              <Button
                variant={l.id === picked.id ? "secondary" : "ghost"}
                size="sm"
                aria-current={l.id === picked.id ? "true" : undefined}
                onClick={() => pick(l.id)}
              >
                {RECORD_COPY.listingNumber(l.number)}
              </Button>
              <TypedCell kind="status" value={l.standardStatus} transaction={l.transaction} />
              <span className="ml-auto text-sm whitespace-nowrap text-muted-foreground tabular-nums">
                {formatMoney(l.listPrice)} · {l.createdOn}
              </span>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}
