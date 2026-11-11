import { LockIcon } from "lucide-react";

import { Badge } from "@/components/reui/badge";
import type { DisplayKind } from "@/generated/display";
import type { ListingStandardStatus } from "@/generated/ontology";
import { EMPTY, STATUS_TONE, formatByKind, statusLabel, statusTone } from "@/lib/format";

import { alignFor } from "./column-kind";
import { GRID_COPY } from "./grid-copy";

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
  if (TEXT_KINDS.includes(kind)) {
    const text = String(value);
    return (
      <span className="block truncate" title={text}>
        {text}
      </span>
    );
  }
  return <>{formatByKind(kind, value)}</>;
}

/**
 * One cell, shown by its display kind. A cell the viewer may not edit looks like plain text; a cell that is
 * locked for now shows a lock and says why (design/behaviors.md, read-only cell).
 */
export function TypedCell({
  kind,
  value,
  transaction,
  lockedReason,
}: {
  kind: DisplayKind;
  value: unknown;
  transaction?: "sale" | "lease";
  lockedReason?: string;
}) {
  const align = alignFor(kind);
  return (
    <span
      data-slot="typed-cell"
      data-kind={kind}
      data-align={align}
      className={
        align === "right"
          ? "flex min-w-0 items-center justify-end gap-1 text-right tabular-nums"
          : "flex min-w-0 items-center justify-start gap-1 text-left"
      }
      title={lockedReason ? `${GRID_COPY.lockedPrefix}: ${lockedReason}` : undefined}
      aria-description={lockedReason ? `${GRID_COPY.lockedPrefix}: ${lockedReason}` : undefined}
    >
      {lockedReason ? (
        <LockIcon
          data-slot="cell-lock"
          aria-hidden="true"
          className="size-3 shrink-0 text-muted-foreground"
        />
      ) : null}
      <CellValue kind={kind} value={value} transaction={transaction} />
    </span>
  );
}
