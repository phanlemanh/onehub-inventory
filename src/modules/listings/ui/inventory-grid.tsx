"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { DataRegion, type GridRow, type RegionStatus } from "@/components/candidate/data-region";
import { Button } from "@/components/ui/button";

import { inventoryColumns, type InventoryField, type InventoryState } from "./inventory-rows";

/** Rows kept when part of the load fails: the first page and a half, so the partial state still spans two pages. */
const PARTIAL_ROWS = 40;

/** The inventory grid: the screen only declares columns, rows and its empty reason; the region owns behaviour. */
export function InventoryGrid({
  title,
  headers,
  rows,
  state,
  emptyWhy,
  reloadLabel,
}: {
  title: string;
  headers: Readonly<Record<InventoryField, string>>;
  rows: readonly GridRow[];
  state: InventoryState;
  emptyWhy: string;
  /** The empty state's next step: load the list again (someone may have added units meanwhile). */
  reloadLabel: string;
}) {
  const router = useRouter();
  const [current, setCurrent] = useState<InventoryState>(state);
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
      emptyWhy={emptyWhy}
      emptyAction={
        <Button variant="outline" onClick={() => router.refresh()}>
          {reloadLabel}
        </Button>
      }
    />
  );
}
