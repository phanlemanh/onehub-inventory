"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { DataRegion, type GridRow, type RegionStatus } from "@/components/candidate/data-region";
import { Button } from "@/components/ui/button";

import type { ColumnFilters } from "@/components/candidate/grid-view";

import {
  INVENTORY_GROUP_BY,
  inventoryColumns,
  type InventoryField,
  type InventoryState,
} from "./inventory-rows";
import { listingRecord } from "./listing-record";

/** Rows kept when part of the load fails: the first page and a half, so the partial state still spans two pages. */
const PARTIAL_ROWS = 40;

/** The inventory grid: the screen declares columns, rows, its empty reason and what one listing's record shows. */
export function InventoryGrid({
  title,
  headers,
  rows,
  state,
  emptyWhy,
  reloadLabel,
  filters,
}: {
  title: string;
  headers: Readonly<Record<InventoryField, string>>;
  rows: readonly GridRow[];
  state: InventoryState;
  emptyWhy: string;
  /** The empty state's next step: load the list again (someone may have added units meanwhile). */
  reloadLabel: string;
  /** Column filters the grid opens with (a status shortcut). */
  filters?: ColumnFilters;
}) {
  const router = useRouter();
  const [current, setCurrent] = useState<InventoryState>(state);
  const record = useMemo(() => listingRecord(headers), [headers]);
  const status: RegionStatus = current === "empty" ? "ready" : current;
  const shown =
    current === "empty" ? [] : current === "partial" ? rows.slice(0, PARTIAL_ROWS) : rows;
  return (
    <DataRegion
      title={title}
      columns={inventoryColumns(headers)}
      rows={shown}
      status={status}
      onRetry={() => setCurrent("ready")}
      record={record}
      emptyWhy={emptyWhy}
      initialFilters={filters}
      groupBy={INVENTORY_GROUP_BY}
      emptyAction={
        <Button variant="outline" onClick={() => router.refresh()}>
          {reloadLabel}
        </Button>
      }
    />
  );
}
