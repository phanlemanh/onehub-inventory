"use client";

// The in-cell editors of the inventory grid (row 4), shaped after the ReUI block data-grid-editing-2 that the owner
// chose (Hỏi-4): the input sits in the cell, and one line right under the cell reads the price back, says what was
// not understood, or asks again on a big change. A move to Closed or Withdrawn asks what it needs in a dialog.
// Every rule is called from ../edit-rules; nothing here compares numbers or lists moves by itself.
import { useState, type KeyboardEvent } from "react";

import type { CellEditSession, GridRow } from "@/components/candidate/data-region";
import { FormDialog } from "@/components/candidate/form-dialog";
import { Badge } from "@/components/reui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ListingStandardStatus, ListingWithdrawnReason } from "@/generated/ontology";
import { statusLabel, statusTone } from "@/lib/format";

import {
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

/** The writes an editor asks for; the grid applies them through the save door and offers «Hoàn tác». */
export type ListingEdit =
  | { field: "Listing.listPrice"; value: number }
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
}: {
  session: CellEditSession;
  labels: CellEditLabels;
  onSave: (edit: ListingEdit) => void;
  onAsk: (ask: StatusAsk) => void;
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
      {nextStatuses(from).map((status, index) => (
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

/** The editor of one inventory cell: price or status. */
export function ListingCellEdit({
  session,
  labels,
  onSave,
  onAsk,
}: {
  session: CellEditSession;
  labels: CellEditLabels;
  onSave: (edit: ListingEdit) => void;
  onAsk: (ask: StatusAsk) => void;
}) {
  return session.field === "Listing.listPrice" ? (
    <PriceEditor session={session} labels={labels} onSave={onSave} />
  ) : (
    <StatusEditor session={session} labels={labels} onSave={onSave} onAsk={onAsk} />
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
export function lockedReasons(row: GridRow): GridRow["locked"] {
  const status = row["Listing.standardStatus"] as ListingStandardStatus;
  const name = statusLabel(status, row.transaction);
  const locked: NonNullable<GridRow["locked"]> = {};
  if (priceLocked(status)) locked["Listing.listPrice"] = COPY.lockedClosed(name);
  if (statusLocked(status)) locked["Listing.standardStatus"] = COPY.lockedFinal(name);
  return Object.keys(locked).length > 0 ? locked : undefined;
}
