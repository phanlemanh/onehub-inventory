"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { DataRegion, type GridRow, type RegionStatus } from "@/components/candidate/data-region";
import { Button } from "@/components/ui/button";

import { sentRecord } from "./sent-record";
import { sentColumns, type SentField, type SentState } from "./sent-rows";

/** Rows kept when part of the load fails: about half, so the partial state still shows rows and says what is missing. */
const PARTIAL_ROWS = 7;

/**
 * The Sent grid: the same shared grid as Inventory, with this screen's columns, rows, empty reason and record. It adds
 * no styling prop of its own — the point of roadmap row 6.
 */
export function SentGrid({
  title,
  headers,
  rows,
  state,
  emptyWhy,
  emptyActionLabel,
  emptyActionHref,
  unitsByLink,
  unitsHeading,
}: {
  title: string;
  headers: Readonly<Record<SentField, string>>;
  rows: readonly GridRow[];
  state: SentState;
  emptyWhy: string;
  /** The empty state's next step: open the screen where units are picked (sending itself is roadmap row 16). */
  emptyActionLabel: string;
  emptyActionHref: string;
  /** The units each link carries, as text, by link id: what the record panel lists. */
  unitsByLink: Readonly<Record<string, readonly string[]>>;
  unitsHeading: string;
}) {
  const [current, setCurrent] = useState<SentState>(state);
  const record = useMemo(
    () => sentRecord(headers, (id) => unitsByLink[id] ?? [], unitsHeading),
    [headers, unitsByLink, unitsHeading],
  );
  const status: RegionStatus = current === "empty" ? "ready" : current;
  const shown =
    current === "empty" ? [] : current === "partial" ? rows.slice(0, PARTIAL_ROWS) : rows;
  return (
    <DataRegion
      title={title}
      columns={sentColumns(headers)}
      rows={shown}
      status={status}
      onRetry={() => setCurrent("ready")}
      record={record}
      emptyWhy={emptyWhy}
      emptyAction={
        // A button that goes to Inventory: the empty state's next step is a button on every grid (design/states.md).
        <Button variant="outline" nativeButton={false} render={<Link href={emptyActionHref} />}>
          {emptyActionLabel}
        </Button>
      }
    />
  );
}
