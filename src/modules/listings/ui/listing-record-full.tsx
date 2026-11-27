"use client";
// The full unit record (roadmap row 3b, _acceptance/ho-so-du-thong-tin): the card of row 3 on top, then how long ago the
// listing was confirmed, how complete it is, the unit, the listing, and every listing of the unit. Read-only. Blocks
// follow solution-crm-4 (Hỏi-4 at the scope gate), assembled from what the repo has. Touching an earlier listing turns
// the whole record to it, the address stays (Hỏi-3).
import { LockIcon } from "lucide-react";
import { useRef, useState, type ReactNode } from "react";

import { RECORD_SECTION_HEADER } from "@/components/candidate/record-section";
import { TypedCell } from "@/components/candidate/typed-cell";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { EMPTY, formatArea, formatMoney, statusLabel } from "@/lib/format";
import type {
  ListingFurnished,
  ListingOccupantType,
  ListingStandardStatus,
} from "@/generated/ontology";

import { detailsLocked } from "../edit-rules";
import { completeness, unitKind, type CompletenessPart } from "../record";
import { OPEN_STATUSES } from "../sample";
import {
  effectiveAttributes,
  type EffectiveAttribute,
  type OwnAttributes,
  type UnitAttributeField,
  type UnitAttributeValues,
} from "../unit-attributes";

import { ListingDetailsEdit, useListingDetails } from "./listing-details-edit";
import { ListingCard, type ListingView } from "./listing-record";
import { RECORD_COPY, confirmationSentence } from "./record-copy";
import { AttributeDiffersMark } from "./attribute-differs-mark";
import { attributeText, type UnitAttributeWords } from "./unit-attribute-copy";
import {
  RecordEditOne,
  UnitAttributesEdit,
  useAttributeRevert,
  useEditOne,
  useOwnAttributes,
} from "./unit-attributes-edit";

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
  /** The listing's own values of the unit attributes and their sources (row 3h); absent when it follows the catalog. */
  own?: OwnAttributes | undefined;
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
  /** The edit button's word (row 3g): with it, the open listing's details are edited in the record by roles that may. */
  edit?: string;
  furnishedValues: Readonly<Record<ListingFurnished, string>>;
  occupantValues: Readonly<Record<ListingOccupantType, string>>;
  propertyTypeValues: Readonly<Record<string, string>>;
  /** Row 3h: the words of the own unit attributes; with them the unit section edits them and marks a difference. */
  attributes?: UnitAttributeWords;
}

const shown = (value: string | number | null | undefined): string =>
  value === null || value === undefined || value === "" ? EMPTY : String(value);

function Section({
  slot,
  title,
  action,
  locked,
  children,
}: {
  slot: string;
  title: string;
  /** A control on the section's head row, after the title (row 3e: ReportUnitError on the unit section). */
  action?: ReactNode;
  /**
   * Why the section cannot be edited now (row 3h: a sold or withdrawn listing), in row 3g's words: in the edit button's
   * place on the head row, the grid's lock and one quiet line.
   */
  locked?: string | undefined;
  children: ReactNode;
}) {
  return (
    <section data-slot={slot} aria-label={title} className="flex flex-col gap-2 border-t pt-4">
      {/* The section's head: the record frame gives its buttons the phone's 44 px hit area. */}
      <div data-slot={RECORD_SECTION_HEADER} className="flex items-center justify-between gap-2">
        <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {title}
        </h3>
        <div className="flex items-center gap-3">
          {/* A blocked edit keeps its place: a quiet line with the lock and the reason, never a dimmed button. */}
          {locked ? (
            <p
              data-slot="section-locked-reason"
              className="flex items-center gap-1 text-xs text-muted-foreground"
            >
              <LockIcon aria-hidden="true" className="size-3" />
              {locked}
            </p>
          ) : null}
          {action}
        </div>
      </div>
      {children}
    </section>
  );
}

/** Label and value rows; a row whose value is missing says so in a quieter colour (`data-empty`). */
function Rows({
  rows,
}: {
  rows: readonly {
    key: string;
    label: string;
    value: string | null;
    /** Row 3h: where an own value came from and its mark, after the value. */
    after?: ReactNode;
  }[];
}) {
  return (
    <dl className="grid grid-cols-5 gap-x-4 gap-y-2 text-sm">
      {rows.map((row) => (
        <div key={row.key} data-field={row.key} className="contents">
          <dt className="col-span-2 text-muted-foreground">{row.label}</dt>
          {row.value === null ? (
            <dd data-empty="" className="col-span-3 min-w-0 text-muted-foreground italic">
              {RECORD_COPY.missing}
            </dd>
          ) : row.after ? (
            <dd className="col-span-3 flex min-w-0 flex-wrap items-center gap-x-1.5 break-words">
              <span>{row.value}</span>
              {row.after}
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
  report,
}: {
  view: ListingView;
  data: ListingRecordData;
  labels: RecordLabels;
  /** ReportUnitError on the unit's properties (row 3e); absent without the button words. */
  report?: ReactNode;
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
  const read = data.listings.find((l) => l.id === pickedId) ?? data.listings[0];
  // The details as the grid last saved them (row 3g), else as the page read them.
  const details = useListingDetails(read?.id ?? "", {
    legalStatus: read?.legalStatus,
    furnished: read?.furnished,
    financing: read?.financing,
    occupantType: read?.occupantType,
  });
  // The unit attributes as the grid last saved them (row 3h), over the catalog's.
  const own = useOwnAttributes(read?.id ?? "", read?.own);
  const words = labels.attributes;
  const revert = useAttributeRevert(read?.id ?? "", data.unit.unitNumber, own, words!);
  const editOne = useEditOne();
  if (!read) return null;
  const { confirmedDays, ...parts } = details;
  const picked: RecordListing = {
    ...read,
    ...parts,
    ...(confirmedDays === undefined ? {} : { confirmedDays }),
  };
  const isNewest = picked.id === newestId;
  const catalogUnit = data.unit;
  const attrs = effectiveAttributes(own, catalogUnit);
  // What the record shows of the unit: its effective attributes (row 3h), the rest from the catalog.
  const unit = {
    ...catalogUnit,
    livingArea: attrs.livingArea.value,
    floor: attrs.floor.value,
    bedroomsTotal: attrs.bedroomsTotal.value,
    directionFaces: attrs.directionFaces.value,
    propertySubType: attrs.propertySubType.value,
  };
  // Only the open, newest listing has its attributes edited, like its details (row 3g's lock).
  const editable = isNewest && !detailsLocked(picked.standardStatus);
  // A sold or withdrawn listing keeps its attributes, said in row 3g's words to a person who may edit (row 3h).
  const statusName = statusLabel(picked.standardStatus, picked.transaction);
  const lockedWhy =
    words && revert && detailsLocked(picked.standardStatus)
      ? RECORD_COPY.blocked(labels.unit, statusName, words.edit)
      : undefined;
  // Variant (b) of the scope gate (`?edit=one`): one edit button on top for both sections, none on the sections.
  const oneEdit = editOne && Boolean(words) && Boolean(labels.edit) && editable;
  /** The source and the mark after an attribute's value. */
  const after = <K extends UnitAttributeField>(
    field: K,
    e: EffectiveAttribute<UnitAttributeValues[K]>,
  ): ReactNode => {
    if (!words || (e.source !== "Typed" && e.source !== "File")) return undefined;
    const catalogShown = attributeText(words, field, e.catalogValue);
    // The mark sits right after the value, as on the grid; the source word follows it.
    return (
      <>
        {e.differs ? (
          <AttributeDiffersMark
            words={words}
            catalogShown={catalogShown}
            sourceWord={words.sources[e.source]}
            onRevert={editable && revert ? () => revert(field, catalogShown) : undefined}
            lockedReason={lockedWhy}
          />
        ) : null}
        <span data-slot="attribute-source" className="text-xs text-muted-foreground">
          {words.sources[e.source]}
        </span>
      </>
    );
  };
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
      {oneEdit && words && labels.edit ? (
        <div data-slot="record-edit-one" className="flex justify-end">
          <RecordEditOne
            key={`one:${picked.id}`}
            id={picked.id}
            unitNumber={unit.unitNumber}
            own={own}
            catalog={catalogUnit}
            attributeWords={words}
            details={details}
            detailsWords={{
              edit: labels.edit,
              unit: labels.unit,
              legalStatus: labels.parts.legalStatus,
              furnished: labels.parts.furnished,
              financing: labels.parts.financing,
              occupantType: labels.parts.occupantType,
              furnishedValues: labels.furnishedValues,
              occupantValues: labels.occupantValues,
            }}
            titles={{ unit: labels.unit, offer: labels.currentListing }}
          />
        </div>
      ) : null}
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
      <Section
        slot="listing-unit"
        title={labels.unit}
        locked={lockedWhy}
        action={
          words && editable && !oneEdit ? (
            <span className="flex items-center gap-1">
              <UnitAttributesEdit
                key={`attributes:${picked.id}`}
                id={picked.id}
                unitNumber={unit.unitNumber}
                own={own}
                catalog={catalogUnit}
                words={words}
              />
              {report}
            </span>
          ) : (
            report
          )
        }
      >
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
            ...(words
              ? [
                  {
                    key: "Unit.bedroomsTotal",
                    label: labels.bedrooms,
                    value: shown(unit.bedroomsTotal),
                    after: after("bedroomsTotal", attrs.bedroomsTotal),
                  },
                ]
              : []),
            {
              key: "Unit.livingArea",
              label: labels.livingArea,
              value: unit.livingArea === null ? EMPTY : formatArea(unit.livingArea),
              after: after("livingArea", attrs.livingArea),
            },
            {
              key: "Unit.floor",
              label: labels.floor,
              value: shown(unit.floor),
              after: after("floor", attrs.floor),
            },
            {
              key: "Unit.directionFaces",
              label: labels.direction,
              value: shown(unit.directionFaces),
              after: after("directionFaces", attrs.directionFaces),
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
              after: after("propertySubType", attrs.propertySubType),
            },
          ]}
        />
      </Section>
      <Section
        slot="listing-offer"
        title={open ? labels.currentListing : labels.viewedListing}
        action={
          open && isNewest && labels.edit && !oneEdit ? (
            <ListingDetailsEdit
              key={picked.id}
              id={picked.id}
              unitNumber={unit.unitNumber}
              details={details}
              words={{
                edit: labels.edit,
                unit: labels.unit,
                legalStatus: labels.parts.legalStatus,
                furnished: labels.parts.furnished,
                financing: labels.parts.financing,
                occupantType: labels.parts.occupantType,
                furnishedValues: labels.furnishedValues,
                occupantValues: labels.occupantValues,
              }}
            />
          ) : undefined
        }
      >
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
