"use client";
// The full unit record (roadmap row 3b, _acceptance/ho-so-du-thong-tin): the listing's status and price on top, then how
// long ago the listing was confirmed, how complete it is, the unit, the listing, and every listing of the unit. Blocks
// follow solution-crm-4 (Hỏi-4 at the scope gate), assembled from what the repo has. Touching an earlier listing turns
// the whole record to it, the address stays (Hỏi-3). Row 3h's four groups A–D (owner «Duyệt cả bốn nhóm», 27/11): each
// thing said once (the unit code in the record's head only, the unit attributes in the unit section only), a complete
// listing on one line and a missing part that opens its section's edit dialog, a stale confirmation in the warning colour,
// a fixed label column and the unit's listings as links.
import { CheckIcon, ChevronRightIcon, LockIcon } from "lucide-react";
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

import {
  ListingDetailsEdit,
  useListingDetails,
  type DetailKey,
  type DetailsEditHandle,
} from "./listing-details-edit";
import type { ListingView } from "./listing-record";
import { RECORD_COPY, STALE_CONFIRMATION_DAYS, confirmationSentence } from "./record-copy";
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

/**
 * Label and value rows, the label in a fixed column (row 3h, D: the owner's «about 104 px» on a phone and «about 120 px»
 * from 768 px, on the default spacing steps: 96 px and 112 px). A missing
 * value reads «Chưa có» in a quieter colour (`data-empty`), with the warning's dot before its label (B).
 */
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
    <dl className="flex flex-col gap-2 text-sm">
      {rows.map((row) => (
        <div key={row.key} data-field={row.key} className="flex gap-4">
          <dt
            data-slot="record-row-label"
            tabIndex={-1}
            className="flex w-24 shrink-0 items-baseline gap-1.5 text-muted-foreground outline-none md:w-28"
          >
            {row.value === null ? (
              <span
                data-slot="missing-dot"
                aria-hidden="true"
                className="size-1.5 shrink-0 -translate-y-0.5 self-center rounded-full bg-warning"
              />
            ) : null}
            {row.label}
          </dt>
          {row.value === null ? (
            <dd data-empty="" className="min-w-0 flex-1 text-muted-foreground">
              {RECORD_COPY.missing}
            </dd>
          ) : row.after ? (
            <dd className="flex min-w-0 flex-1 flex-wrap items-center gap-x-1.5 break-words">
              <span>{row.value}</span>
              {row.after}
            </dd>
          ) : (
            <dd className="min-w-0 flex-1 break-words">{row.value}</dd>
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
  const price = useRef<HTMLSpanElement>(null);
  const offer = useRef<DetailsEditHandle>(null);
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
  // (A) Under the status and the price: the project and the kind of property; the record's head names unit and building.
  const place = [
    unit.subdivisionName,
    unit.propertySubType && labels.propertyTypeValues[unit.propertySubType],
  ]
    .filter((part): part is string => Boolean(part))
    .join(" · ");
  // (B) A missing part pressed in «Còn thiếu»: its line comes into view and takes the focus, and the listing section's
  // edit dialog opens on that field when the person may edit it. The price has no section: it is edited on the grid.
  const jump = (part: CompletenessPart) => {
    if (part === "listPrice") {
      price.current?.scrollIntoView({ block: "nearest" });
      price.current?.focus();
      return;
    }
    const line = top.current?.querySelector<HTMLElement>(
      `[data-slot="listing-offer"] [data-field="Listing.${part}"] dt`,
    );
    line?.scrollIntoView({ block: "nearest" });
    line?.focus();
    offer.current?.openOn(part as DetailKey);
  };
  const days = picked.confirmedDays;
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
      <div data-slot="record-summary" className="flex flex-col gap-1">
        <div className="flex items-center justify-between gap-3">
          <span data-slot="record-status">
            <TypedCell
              kind="status"
              value={picked.standardStatus}
              transaction={picked.transaction}
            />
          </span>
          <span
            ref={price}
            tabIndex={-1}
            data-slot="record-price"
            aria-label={labels.listPrice}
            className="shrink-0 text-lg font-semibold tabular-nums outline-none"
          >
            <TypedCell
              kind="money"
              value={picked.listPrice ?? null}
              transaction={picked.transaction}
            />
          </span>
        </div>
        {place ? (
          <p data-slot="record-place" className="text-sm text-muted-foreground">
            {place}
          </p>
        ) : null}
      </div>
      <div className="flex flex-col gap-0.5">
        <p data-slot="listing-confirmation" className="text-xs text-muted-foreground">
          {confirmationSentence(days)}
        </p>
        {days !== null && days > STALE_CONFIRMATION_DAYS ? (
          <p data-slot="confirmation-stale" className="text-xs text-warning-foreground">
            {RECORD_COPY.staleConfirmation(STALE_CONFIRMATION_DAYS)}
          </p>
        ) : null}
      </div>
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
      {done.missing.length === 0 ? (
        <p
          data-slot="listing-completeness"
          data-complete=""
          className="flex items-center gap-1.5 text-sm text-muted-foreground"
        >
          <CheckIcon aria-hidden="true" className="size-4" />
          <span data-slot="listing-completeness-count" className="tabular-nums">
            {RECORD_COPY.completeLine(done.have, done.need)}
          </span>
        </p>
      ) : (
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
          <p
            data-slot="listing-completeness-missing"
            className="flex flex-wrap items-center gap-x-1 text-xs text-muted-foreground"
          >
            {/* Read as one sentence («Còn thiếu: …, …»), each part its own button. */}
            <span>{`${RECORD_COPY.lackingLead} `}</span>
            {done.missing.map((part, i) => (
              <span key={part} className="inline-flex items-center">
                <Button
                  variant="link"
                  size="xs"
                  data-slot="missing-part"
                  data-part={part}
                  onClick={() => jump(part)}
                >
                  {labels.parts[part]}
                </Button>
                {i < done.missing.length - 1 ? ", " : null}
              </span>
            ))}
          </p>
        </div>
      )}
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
              ref={offer}
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
            // (D) The listing in view says so, with no ground; the others read as links. Under 360 px each listing takes
            // two even lines: its number and status, then its price and day.
            <li
              key={l.id}
              data-listing-id={l.id}
              className="flex flex-wrap items-center gap-x-3 gap-y-0.5"
            >
              <span className="flex items-center gap-3 max-[360px]:w-full max-[360px]:justify-between">
                {l.id === picked.id ? (
                  <span
                    aria-current="true"
                    data-slot="listing-in-view"
                    className="inline-flex h-7 items-center px-2.5 text-sm font-medium"
                  >
                    {RECORD_COPY.listingInView(l.number)}
                  </span>
                ) : (
                  <Button
                    variant="link"
                    size="sm"
                    data-slot="listing-other"
                    onClick={() => pick(l.id)}
                  >
                    {RECORD_COPY.listingNumber(l.number)}
                    <ChevronRightIcon aria-hidden="true" data-icon="inline-end" />
                  </Button>
                )}
                <TypedCell kind="status" value={l.standardStatus} transaction={l.transaction} />
              </span>
              <span className="ml-auto text-sm whitespace-nowrap text-muted-foreground tabular-nums max-[360px]:ml-0 max-[360px]:px-2.5">
                {formatMoney(l.listPrice)} · {l.createdOn}
              </span>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}
