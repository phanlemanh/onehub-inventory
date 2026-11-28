"use client";

// The in-cell editors of the inventory grid (row 4), shaped after the ReUI block data-grid-editing-2 that the owner
// chose (Hỏi-4): the input sits in the cell, and one line right under the cell reads the price back, says what was
// not understood, or asks again on a big change. A move to Closed or Withdrawn asks what it needs in a dialog.
// Every rule is called from ../edit-rules; nothing here compares numbers or lists moves by itself.
import { useState, type KeyboardEvent } from "react";

import { useSaveOnAway } from "@/components/candidate/cell-editor";
import type { CellEditSession, GridRow } from "@/components/candidate/data-region";
import { GRID_COPY } from "@/components/candidate/grid-copy";
import { FormDialog } from "@/components/candidate/form-dialog";
import { Badge } from "@/components/reui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type {
  ListingFeeInclusion,
  ListingStandardStatus,
  ListingWithdrawnReason,
} from "@/generated/ontology";
import { statusLabel, statusTone } from "@/lib/format";

import {
  readCustomValue,
  sameCustomValue,
  type CustomKind,
  type CustomRead,
} from "../custom-rules";
import {
  readBedrooms,
  readFloor,
  readLivingArea,
  type AttributeProblem,
  type UnitAttributeField,
} from "../unit-attributes";
import {
  detailsLocked,
  nextStatuses,
  priceAsksAgain,
  priceLocked,
  priceSwing,
  priceUnchanged,
  readPrice,
  statusLocked,
  statusNeeds,
  statusUndoable,
  type StatusNeed,
} from "../edit-rules";

import {
  CELL_EDIT_COPY as COPY,
  WITHDRAWN_REASON_ORDER,
  exactNumber,
  word,
  type CellEditLabels,
} from "./cell-edit-copy";
import { UNIT_ATTRIBUTE_COPY, attributeInput } from "./unit-attribute-copy";

/** The writes an editor asks for; the grid applies them through the save door and offers «Hoàn tác». */
export type ListingEdit =
  | { field: "Listing.listPrice"; value: number }
  | { field: "Listing.feeInclusion"; value: ListingFeeInclusion }
  | {
      field: "Listing.standardStatus";
      value: ListingStandardStatus;
      closePrice?: number;
      closeDate?: string;
      withdrawnReason?: ListingWithdrawnReason;
      undoable: boolean;
    };

/** The companies' time zone: every company today works in Vietnam (a per-company zone is company-config's later). */
const COMPANY_ZONE = "Asia/Ho_Chi_Minh";
const dayIn = new Intl.DateTimeFormat("en-CA", { timeZone: COMPANY_ZONE });

/** Today in Vietnam (yyyy-mm-dd), not in UTC: from 00:00 to 06:59 there UTC is still yesterday. */
export function companyToday(now: Date = new Date()): string {
  return dayIn.format(now);
}

/** A status move that needs more than the move itself (Closed, Withdrawn): the grid opens `StatusNeedsDialog`. */
export type StatusAsk = { row: GridRow; to: ListingStandardStatus };

/** The line under the cell: the read-back, what was not understood, or the question on a big change. */
function UnderCell({ children, alert }: { children: React.ReactNode; alert?: boolean }) {
  return (
    <div
      data-slot="cell-edit-line"
      role={alert ? "alert" : undefined}
      className="absolute top-full flex w-max max-w-80 min-w-(--anchor-width) flex-col gap-1.5 rounded-b-md border bg-popover px-2 py-1.5 text-xs text-popover-foreground shadow-md group-data-[edge=end]/cell-editor:right-0 group-data-[edge=start]/cell-editor:left-0"
    >
      {children}
    </div>
  );
}

function PriceEditor({
  session,
  labels,
  onSave,
}: {
  session: CellEditSession;
  labels: CellEditLabels;
  onSave: (edit: ListingEdit) => void;
}) {
  const previous = (session.row["Listing.listPrice"] as number | null) ?? null;
  const [text, setText] = useState(session.initialText ?? (previous ? exactNumber(previous) : ""));
  const [asking, setAsking] = useState<number | null>(null);
  const [tried, setTried] = useState(false);
  const read = readPrice(text);
  const save = (value: number, move?: "next") => {
    onSave({ field: "Listing.listPrice", value });
    session.close(move);
  };
  const submit = (move?: "next") => {
    setTried(true);
    if (!read.ok) return;
    if (priceUnchanged(previous, read.value)) return session.close(move);
    if (priceAsksAgain(previous, read.value)) return setAsking(read.value);
    save(read.value, move);
  };
  // Clicking away saves like Enter (VP11): a value not understood keeps the editor open and says so.
  useSaveOnAway(() => submit());
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      submit();
    } else if (event.key === "Tab" && !event.shiftKey) {
      event.preventDefault();
      submit("next");
    }
  };
  const error = (tried || text.trim() !== "") && !read.ok && text.trim() !== "";
  const emptyTried = tried && text.trim() === "";
  return (
    <>
      <div className="w-(--anchor-width) rounded-md bg-background ring-2 ring-primary">
        <Input
          autoFocus={asking === null}
          readOnly={asking !== null}
          value={text}
          aria-label={COPY.editLabel(
            labels,
            word(labels, "ListPrice"),
            String(session.row["Listing.unitNumber"] ?? ""),
          )}
          aria-invalid={error || emptyTried || undefined}
          aria-describedby="cell-edit-line"
          onChange={(event) => {
            setText(event.target.value);
            setTried(false);
          }}
          onKeyDown={onKeyDown}
        />
      </div>
      {asking !== null && previous ? (
        <UnderCell>
          <span data-slot="price-ask" className="flex flex-col gap-1">
            <span className="font-medium">
              {COPY.ask(Math.round(priceSwing(previous, asking) * 100))}
            </span>
            <span className="text-muted-foreground">{COPY.askFromTo(previous, asking)}</span>
          </span>
          <span className="flex justify-end gap-2">
            <Button variant="outline" size="sm" autoFocus onClick={() => setAsking(null)}>
              {COPY.cancel}
            </Button>
            <Button size="sm" onClick={() => save(asking)}>
              {COPY.changePrice}
            </Button>
          </span>
        </UnderCell>
      ) : (
        <UnderCell alert={tried && !read.ok}>
          <span
            id="cell-edit-line"
            data-slot="price-read"
            className={error || emptyTried ? "text-destructive" : "text-muted-foreground"}
          >
            {read.ok
              ? COPY.readAs(read.value)
              : text.trim() === ""
                ? COPY.hint
                : COPY.notUnderstood(text)}
          </span>
          <span className="text-muted-foreground">{COPY.keys}</span>
        </UnderCell>
      )}
    </>
  );
}

function StatusEditor({
  session,
  labels,
  onSave,
  onAsk,
  canActivate,
}: {
  session: CellEditSession;
  labels: CellEditLabels;
  onSave: (edit: ListingEdit) => void;
  onAsk: (ask: StatusAsk) => void;
  canActivate: boolean;
}) {
  const from = session.row["Listing.standardStatus"] as ListingStandardStatus;
  const tx = session.row.transaction;
  const pick = (to: ListingStandardStatus) => {
    session.close();
    if (statusNeeds(to, {}).length > 0) onAsk({ row: session.row, to });
    else onSave({ field: "Listing.standardStatus", value: to, undoable: statusUndoable(from, to) });
  };
  return (
    <div
      role="listbox"
      aria-label={COPY.editLabel(
        labels,
        word(labels, "StandardStatus"),
        String(session.row["Listing.unitNumber"] ?? ""),
      )}
      className="absolute top-0 flex w-max min-w-(--anchor-width) flex-col items-start gap-0.5 rounded-md border bg-popover p-1 shadow-md ring-2 ring-primary group-data-[edge=end]/cell-editor:right-0 group-data-[edge=start]/cell-editor:left-0"
    >
      {nextStatuses(from)
        // Active needs activateListing: one's own unit or one nobody keeps, or the team lead (row 10, AC-5).
        .filter((status) => canActivate || status !== "Active")
        .map((status, index) => (
          <Button
            key={status}
            type="button"
            variant="ghost"
            size="sm"
            role="option"
            aria-selected={false}
            autoFocus={index === 0}
            data-status-option={status}
            onClick={() => pick(status)}
          >
            <Badge variant={statusTone(status)}>{statusLabel(status, tx)}</Badge>
          </Button>
        ))}
    </div>
  );
}

/** The two fee inclusions (row 10, AC-7), as a list in the cell like the status. */
function FeeEditor({
  session,
  labels,
  onSave,
}: {
  session: CellEditSession;
  labels: CellEditLabels;
  onSave: (edit: ListingEdit) => void;
}) {
  const tx = session.row.transaction;
  const shown = session.row["Listing.feeInclusion"];
  const options: { value: ListingFeeInclusion; text: string }[] = [
    { value: "Included", text: word(labels, "FeeIncluded", tx) },
    { value: "Excluded", text: word(labels, "FeeExcluded", tx) },
  ];
  const pick = (value: ListingFeeInclusion, text: string) => {
    session.close();
    if (text !== shown) onSave({ field: "Listing.feeInclusion", value });
  };
  return (
    <div
      role="listbox"
      aria-label={COPY.editLabel(
        labels,
        word(labels, "FeeInclusion", tx),
        String(session.row["Listing.unitNumber"] ?? ""),
      )}
      className="absolute top-0 flex w-max min-w-(--anchor-width) flex-col items-start gap-0.5 rounded-md border bg-popover p-1 shadow-md ring-2 ring-primary group-data-[edge=end]/cell-editor:right-0 group-data-[edge=start]/cell-editor:left-0"
    >
      {options.map((o, index) => (
        <Button
          key={o.value}
          type="button"
          variant="ghost"
          size="sm"
          role="option"
          aria-selected={o.text === shown}
          autoFocus={index === 0}
          data-fee-option={o.value}
          onClick={() => pick(o.value, o.text)}
        >
          {o.text}
        </Button>
      ))}
    </div>
  );
}

/** One value set on a typed cell (row 3g): a company's own field, or one detail of the listing; `null` clears it. */
export type CustomEdit = {
  field: string;
  custom: string;
  value: string | number | boolean | null;
};

/**
 * A cell edited by its kind (row 3g): a company's own field (`custom.<code>`), or one of the four details of the
 * listing (`key` names its column; the record's dialog edits the same parts). `limit` is the longest text it takes.
 */
export interface CustomCellField {
  code: string;
  header: string;
  kind: CustomKind;
  options: readonly string[];
  key?: string;
  limit?: number;
  /** Row 3h: the cell is one of the listing's unit attributes, read by its own reader; empty takes the catalog again. */
  attribute?: UnitAttributeField;
}

/** What an attribute cell's editor knows of its row (row 3h): whether the listing holds an own value, and the catalog's. */
export interface AttributeCellNote {
  hasOwn: boolean;
  /** The catalog's value and how to take it again, while the catalog has a value; null otherwise. */
  note: string | null;
  /** The way-back command's word, offered while the own value differs from the catalog's. */
  revert?: string | undefined;
  /** The choice that takes the catalog's value again in a choice cell, by the catalog source's word. */
  noneText: string;
}

/** A typed attribute (row 3h) by its reader: empty is null (the catalog's value again), else the value or why not. */
function readAttribute(
  attribute: UnitAttributeField,
  raw: string,
): { ok: true; value: string | number | null } | { ok: false; problem: AttributeProblem } {
  if (raw.trim() === "") return { ok: true, value: null };
  if (attribute === "livingArea") return readLivingArea(raw);
  if (attribute === "bedroomsTotal") return readBedrooms(raw);
  return readFloor(raw);
}

/** The grid column of a typed cell. */
export const cellKeyOf = (field: CustomCellField): string => field.key ?? `custom.${field.code}`;

/** A typed value of a text, number or date field: an input in the cell and the line under it on a value that does not fit. */
function CustomTextEditor({
  session,
  field,
  labels,
  onSave,
  attribute,
}: {
  session: CellEditSession;
  field: CustomCellField;
  labels: CellEditLabels;
  onSave: (edit: CustomEdit) => void;
  attribute?: AttributeCellNote | undefined;
}) {
  const stored = session.row[session.field];
  const own = field.attribute;
  const [text, setText] = useState(
    session.initialText ??
      (own
        ? attributeInput(stored)
        : stored === null || stored === undefined
          ? ""
          : COPY.customShown(field.kind, stored)),
  );
  const [tried, setTried] = useState(false);
  const read: CustomRead | { ok: false; problem: AttributeProblem } = own
    ? readAttribute(own, text)
    : readCustomValue(field.kind, text, field.options, field.limit);
  const save = (value: string | number | boolean | null) =>
    onSave({ field: cellKeyOf(field), custom: field.code, value });
  const submit = (move?: "next") => {
    setTried(true);
    if (!read.ok) return;
    session.close(move);
    // An empty attribute cell takes the catalog's value again; with no own value there is nothing to take back.
    if (own && read.value === null && !attribute?.hasOwn) return;
    if (!sameCustomValue(read.value, stored)) save(read.value);
  };
  // Clicking away saves like Enter (VP11): a value not understood keeps the editor open and says so.
  useSaveOnAway(() => submit());
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      submit();
    } else if (event.key === "Tab" && !event.shiftKey) {
      event.preventDefault();
      submit("next");
    }
  };
  const problem = tried && !read.ok ? read.problem : null;
  return (
    <>
      <div className="w-(--anchor-width) rounded-md bg-background ring-2 ring-primary">
        <Input
          autoFocus
          value={text}
          inputMode={field.kind === "number" ? "decimal" : undefined}
          placeholder={field.kind === "date" ? COPY.customDatePlaceholder : undefined}
          data-custom-kind={field.kind}
          aria-label={COPY.editLabel(
            labels,
            field.header,
            String(session.row["Listing.unitNumber"] ?? ""),
          )}
          aria-invalid={problem ? true : undefined}
          aria-describedby="cell-edit-line"
          onChange={(event) => {
            setText(event.target.value);
            setTried(false);
          }}
          onKeyDown={onKeyDown}
        />
      </div>
      {problem ? (
        <UnderCell alert>
          <span id="cell-edit-line">
            {own
              ? UNIT_ATTRIBUTE_COPY.problem(own, problem as AttributeProblem, text)
              : COPY.customProblem(
                  problem as Parameters<typeof COPY.customProblem>[0],
                  field.limit,
                )}
          </span>
        </UnderCell>
      ) : attribute?.note ? (
        <UnderCell>
          <span
            id="cell-edit-line"
            data-slot="attribute-cell-note"
            className="text-muted-foreground"
          >
            {attribute.note}
          </span>
          {attribute.revert ? (
            <span className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                size="xs"
                data-slot="attribute-revert"
                onClick={() => {
                  session.close();
                  save(null);
                }}
              >
                {attribute.revert}
              </Button>
            </span>
          ) : null}
        </UnderCell>
      ) : null}
    </>
  );
}

/** A choice of a single choice or yes/no field: the list of values, then «Chưa có» to clear it (row 3g). */
function CustomChoiceEditor({
  session,
  field,
  labels,
  onSave,
  attribute,
}: {
  session: CellEditSession;
  field: CustomCellField;
  labels: CellEditLabels;
  onSave: (edit: CustomEdit) => void;
  attribute?: AttributeCellNote | undefined;
}) {
  const stored = session.row[session.field] ?? null;
  const values: { value: string | boolean | null; text: string }[] = [
    ...(field.kind === "boolean"
      ? [
          { value: true, text: GRID_COPY.yes },
          { value: false, text: GRID_COPY.no },
        ]
      : field.options.map((o) => ({ value: o, text: o }))),
    { value: null, text: attribute ? attribute.noneText : COPY.customNone },
  ];
  const pick = (value: string | boolean | null) => {
    session.close();
    // The catalog's choice on a cell that already follows the catalog changes nothing (row 3h).
    if (field.attribute && value === null && !attribute?.hasOwn) return;
    if (!sameCustomValue(value, stored))
      onSave({ field: cellKeyOf(field), custom: field.code, value });
  };
  return (
    <div
      role="listbox"
      data-custom-kind={field.kind}
      aria-label={COPY.editLabel(
        labels,
        field.header,
        String(session.row["Listing.unitNumber"] ?? ""),
      )}
      className="absolute top-0 flex max-h-72 w-max min-w-(--anchor-width) flex-col items-start gap-0.5 overflow-y-auto rounded-md border bg-popover p-1 shadow-md ring-2 ring-primary group-data-[edge=end]/cell-editor:right-0 group-data-[edge=start]/cell-editor:left-0"
    >
      {values.map((o, index) => (
        <Button
          key={String(o.value)}
          type="button"
          variant="ghost"
          size="sm"
          role="option"
          aria-selected={
            field.attribute && o.value === null
              ? !attribute?.hasOwn
              : sameCustomValue(o.value, stored)
          }
          autoFocus={index === 0}
          onClick={() => pick(o.value)}
        >
          {o.text}
        </Button>
      ))}
    </div>
  );
}

/** The editor of one inventory cell: price, status, fee inclusion, or a company's own field (row 3g). */
export function ListingCellEdit({
  session,
  labels,
  onSave,
  onAsk,
  canActivate = true,
  custom,
}: {
  session: CellEditSession;
  labels: CellEditLabels;
  onSave: (edit: ListingEdit) => void;
  onAsk: (ask: StatusAsk) => void;
  /** Whether Active is offered for this row (row 10, AC-5); the server checks it again. */
  canActivate?: boolean;
  /** The company's own field of this cell, when it is one, and where its value goes (row 3g). */
  custom?:
    | {
        field: CustomCellField;
        onSave: (edit: CustomEdit) => void;
        /** Row 3h: what an attribute cell's editor says of the catalog. */
        attribute?: AttributeCellNote | undefined;
      }
    | undefined;
}) {
  if (custom)
    return custom.field.kind === "single_select" || custom.field.kind === "boolean" ? (
      <CustomChoiceEditor
        session={session}
        field={custom.field}
        labels={labels}
        onSave={custom.onSave}
        attribute={custom.attribute}
      />
    ) : (
      <CustomTextEditor
        session={session}
        field={custom.field}
        labels={labels}
        onSave={custom.onSave}
        attribute={custom.attribute}
      />
    );
  if (session.field === "Listing.listPrice")
    return <PriceEditor session={session} labels={labels} onSave={onSave} />;
  if (session.field === "Listing.feeInclusion")
    return <FeeEditor session={session} labels={labels} onSave={onSave} />;
  return (
    <StatusEditor
      session={session}
      labels={labels}
      onSave={onSave}
      onAsk={onAsk}
      canActivate={canActivate}
    />
  );
}

const NEED_LABEL: Readonly<Record<StatusNeed, "ClosePrice" | "CloseDate" | "WithdrawnReason">> = {
  closePrice: "ClosePrice",
  closeDate: "CloseDate",
  withdrawnReason: "WithdrawnReason",
};

/** Closed asks the close price (prefilled with the list price) and date (today); Withdrawn asks a reason. */
export function StatusNeedsDialog({
  ask,
  labels,
  onClose,
  onSave,
}: {
  ask: StatusAsk | null;
  labels: CellEditLabels;
  onClose: () => void;
  onSave: (row: GridRow, edit: ListingEdit) => void;
}) {
  // Keyed, so every ask starts from the prefilled values.
  return ask ? (
    <NeedsDialog
      key={`${ask.row.id}:${ask.to}`}
      ask={ask}
      labels={labels}
      onClose={onClose}
      onSave={onSave}
    />
  ) : null;
}

function NeedsDialog({
  ask,
  labels,
  onClose,
  onSave,
}: {
  ask: StatusAsk;
  labels: CellEditLabels;
  onClose: () => void;
  onSave: (row: GridRow, edit: ListingEdit) => void;
}) {
  const { row, to } = ask;
  const tx = row.transaction;
  const from = row["Listing.standardStatus"] as ListingStandardStatus;
  const [closePriceText, setClosePriceText] = useState(() => {
    const p = row["Listing.listPrice"] as number | null;
    return p ? exactNumber(p) : "";
  });
  const [closeDate, setCloseDate] = useState(() => companyToday());
  const [reason, setReason] = useState<ListingWithdrawnReason | null>(null);
  const [tried, setTried] = useState(false);
  const closePrice = readPrice(closePriceText);
  const needs = statusNeeds(to, {
    closePrice: closePrice.ok ? closePrice.value : undefined,
    closeDate: closeDate || undefined,
    withdrawnReason: reason ?? undefined,
  });
  // What the move asks for comes from the rules: the fields of `statusNeeds` with nothing given yet.
  const asks = new Set(statusNeeds(to, {}));
  const submit = () => {
    setTried(true);
    if (needs.length > 0) return;
    onSave(row, {
      field: "Listing.standardStatus",
      value: to,
      closePrice: asks.has("closePrice") && closePrice.ok ? closePrice.value : undefined,
      closeDate: asks.has("closeDate") ? closeDate : undefined,
      withdrawnReason: asks.has("withdrawnReason") ? (reason ?? undefined) : undefined,
      undoable: statusUndoable(from, to),
    });
    onClose();
  };
  return (
    <FormDialog
      title={COPY.moveTitle(to, tx)}
      description={
        statusUndoable(from, to) ? COPY.confirms : `${COPY.final(to, tx)} ${COPY.confirms}`
      }
      submitLabel={COPY.changeStatus}
      busyLabel={COPY.busy}
      busy={false}
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      onSubmit={submit}
      formError={
        tried && needs.length > 0
          ? COPY.missing(needs.map((n) => word(labels, NEED_LABEL[n], tx).toLocaleLowerCase("vi")))
          : undefined
      }
      slot="status-dialog"
    >
      {asks.has("closePrice") ? (
        <div className="grid grid-cols-2 gap-3 text-sm">
          <label className="flex flex-col gap-1">
            {word(labels, "ClosePrice", tx)}
            <Input
              value={closePriceText}
              aria-invalid={(tried && !closePrice.ok) || undefined}
              onChange={(e) => setClosePriceText(e.target.value)}
            />
            <span className="text-xs text-muted-foreground">
              {closePrice.ok
                ? COPY.readAs(closePrice.value)
                : closePriceText.trim() === ""
                  ? COPY.hint
                  : COPY.notUnderstood(closePriceText)}
            </span>
          </label>
          <label className="flex flex-col gap-1">
            {word(labels, "CloseDate", tx)}
            <Input type="date" value={closeDate} onChange={(e) => setCloseDate(e.target.value)} />
          </label>
        </div>
      ) : (
        <div
          role="radiogroup"
          aria-label={word(labels, "WithdrawnReason")}
          className="flex flex-col gap-1.5 text-sm"
        >
          <span>{word(labels, "WithdrawnReason")}</span>
          <div className="flex flex-wrap gap-2">
            {WITHDRAWN_REASON_ORDER.map((r) => (
              <Button
                key={r}
                type="button"
                size="sm"
                variant={reason === r ? "default" : "outline"}
                role="radio"
                aria-checked={reason === r}
                onClick={() => setReason(r)}
              >
                {COPY.reason(labels, r, tx)}
              </Button>
            ))}
          </div>
        </div>
      )}
    </FormDialog>
  );
}

/** Why a row's price and status are locked, shown on the cell; undefined when the row is open to edits. */
export function lockedReasons(
  row: GridRow,
  /** The company's own columns of the grid (row 3g): a closed or withdrawn listing keeps their values too. */
  customFields: readonly string[] = [],
): GridRow["locked"] {
  const status = row["Listing.standardStatus"] as ListingStandardStatus;
  const name = statusLabel(status, row.transaction);
  const locked: NonNullable<GridRow["locked"]> = {};
  if (detailsLocked(status))
    for (const field of customFields)
      locked[field as `custom.${string}`] =
        status === "Closed" ? COPY.lockedClosed(name) : COPY.lockedFinal(name);
  if (priceLocked(status)) {
    locked["Listing.listPrice"] = COPY.lockedClosed(name);
    locked["Listing.feeInclusion"] = COPY.lockedClosed(name);
  }
  if (statusLocked(status)) locked["Listing.standardStatus"] = COPY.lockedFinal(name);
  return Object.keys(locked).length > 0 ? locked : undefined;
}
