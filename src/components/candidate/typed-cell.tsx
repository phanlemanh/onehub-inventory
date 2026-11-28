import { PencilIcon } from "lucide-react";

import { Badge } from "@/components/reui/badge";
import type { DisplayKind } from "@/generated/display";
import type { ListingStandardStatus } from "@/generated/ontology";
import { cn } from "@/lib/utils";
import { EMPTY, STATUS_TONE, formatByKind, statusLabel, statusTone } from "@/lib/format";

import { alignFor, type EditMode } from "./column-kind";
import { GRID_COPY } from "./grid-copy";
import { TruncatedText } from "./truncated-text";

const TEXT_KINDS: readonly DisplayKind[] = ["text", "person", "select"];

const isEmpty = (value: unknown): boolean => value === null || value === undefined || value === "";

const isStatus = (value: unknown): value is ListingStandardStatus =>
  typeof value === "string" && value in STATUS_TONE;

function CellValue({
  kind,
  value,
  transaction,
}: {
  kind: DisplayKind;
  value: unknown;
  transaction?: "sale" | "lease";
}) {
  if (isEmpty(value)) return <>{EMPTY}</>;
  if (kind === "status") {
    if (!isStatus(value)) return <>{String(value)}</>;
    return (
      <Badge variant={statusTone(value)} data-status={value}>
        {statusLabel(value, transaction)}
      </Badge>
    );
  }
  if (kind === "boolean") return <>{value ? GRID_COPY.yes : GRID_COPY.no}</>;
  if (TEXT_KINDS.includes(kind)) return <TruncatedText text={String(value)} />;
  return <>{formatByKind(kind, value)}</>;
}

/**
 * One cell, shown by its display kind. A cell the viewer may not edit looks like plain text; a cell that is locked for
 * now draws no padlock — every lock on the grid comes from the row's status, which the row already shows (VP11, owner
 * 2026-11-27) — and says why on hover and to screen readers (design/behaviors.md, read-only cell).
 */
export function TypedCell({
  kind,
  value,
  transaction,
  lockedReason,
  editMode,
  pencil,
}: {
  kind: DisplayKind;
  value: unknown;
  transaction?: "sale" | "lease";
  lockedReason?: string;
  /** Where this cell is edited, when the region is editable (design/behaviors.md, edit data). */
  editMode?: EditMode;
  /**
   * The pencil of in-place editing (VP11): `room` keeps its place in a column that edits in place, so every row of the
   * column lines up; `shown` also draws it, on a cell this session may edit now. It shows while the cell is hovered,
   * and on the selected cell where the device cannot hover (a tablet).
   */
  pencil?: "room" | "shown";
}) {
  const align = alignFor(kind);
  return (
    <span
      data-slot="typed-cell"
      data-kind={kind}
      data-align={align}
      data-edit={editMode}
      data-pencil={pencil}
      className={cn(
        align === "right"
          ? "flex min-w-0 items-center justify-end gap-1 text-right tabular-nums"
          : "flex min-w-0 items-center justify-start gap-1 text-left",
        pencil && "relative pe-5",
      )}
      title={lockedReason ? `${GRID_COPY.lockedPrefix}: ${lockedReason}` : undefined}
      aria-description={lockedReason ? `${GRID_COPY.lockedPrefix}: ${lockedReason}` : undefined}
    >
      {lockedReason ? (
        <span data-slot="cell-lock-reason" className="sr-only">
          {`${GRID_COPY.lockedPrefix}: ${lockedReason}`}
        </span>
      ) : null}
      <CellValue kind={kind} value={value} transaction={transaction} />
      {pencil === "shown" ? (
        <span
          data-slot="cell-pencil"
          title={GRID_COPY.editHint}
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 end-0 flex items-center text-muted-foreground opacity-0 transition-opacity in-[td:hover]:opacity-100 pointer-coarse:in-data-cell-focused:opacity-100"
        >
          <PencilIcon className="size-3.5" />
        </span>
      ) : null}
    </span>
  );
}
