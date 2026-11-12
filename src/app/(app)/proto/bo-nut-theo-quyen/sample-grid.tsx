"use client";

import { createColumnHelper, useTable } from "@tanstack/react-table";
import { useMemo, type ReactNode } from "react";

import { GRID_I18N } from "@/components/candidate/grid-copy";
import {
  DataGrid,
  DataGridContainer,
  dataGridFeatures,
} from "@/components/reui/data-grid/data-grid";
import { DataGridTable } from "@/components/reui/data-grid/data-grid-table";
import { Button } from "@/components/ui/button";

/** One row of the prototype grid: a code that opens the record, two plain values, and the row's buttons. */
export type SampleGridRow = { id: string; title: string; detail: string; extra: string };

const helper = createColumnHelper<typeof dataGridFeatures, SampleGridRow>();

export function SampleGrid({
  rows,
  headers,
  onOpen,
  buttons,
  buttonsLabel,
}: {
  rows: readonly SampleGridRow[];
  headers: [string, string, string];
  onOpen: (id: string) => void;
  buttons: (row: SampleGridRow, index: number) => ReactNode;
  buttonsLabel: string;
}) {
  const columns = useMemo(
    () => [
      helper.accessor((row: SampleGridRow): unknown => row.title, {
        id: "title",
        header: headers[0],
        size: 180,
        cell: (info) => (
          <Button variant="link" size="sm" onClick={() => onOpen(info.row.original.id)}>
            {String(info.getValue())}
          </Button>
        ),
        meta: { headerTitle: headers[0] },
      }),
      helper.accessor((row: SampleGridRow): unknown => row.detail, {
        id: "detail",
        header: headers[1],
        size: 160,
        cell: (info) => <span className="tabular-nums">{String(info.getValue())}</span>,
        meta: { headerTitle: headers[1] },
      }),
      helper.accessor((row: SampleGridRow): unknown => row.extra, {
        id: "extra",
        header: headers[2],
        size: 160,
        cell: (info) => <span className="text-muted-foreground">{String(info.getValue())}</span>,
        meta: { headerTitle: headers[2] },
      }),
      helper.display({
        id: "buttons",
        header: "",
        size: 96,
        cell: (info) => buttons(info.row.original, info.row.index),
        meta: { headerTitle: buttonsLabel, cellClassName: "text-right" },
      }),
    ],
    [headers, onOpen, buttons, buttonsLabel],
  );
  const table = useTable({
    features: dataGridFeatures,
    data: rows as SampleGridRow[],
    columns,
    getRowId: (row: SampleGridRow) => row.id,
    initialState: { pagination: { pageIndex: 0, pageSize: Number.MAX_SAFE_INTEGER } },
  });
  return (
    <DataGrid
      table={table}
      recordCount={rows.length}
      i18n={GRID_I18N}
      tableLayout={{ headerBackground: true, cellBorder: true, width: "auto" }}
    >
      <DataGridContainer>
        <DataGridTable />
      </DataGridContainer>
    </DataGrid>
  );
}
