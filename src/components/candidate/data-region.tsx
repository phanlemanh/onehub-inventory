"use client";

import { createColumnHelper, useTable } from "@tanstack/react-table";
import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";

import {
  DataGrid,
  DataGridContainer,
  dataGridFeatures,
} from "@/components/reui/data-grid/data-grid";
import { DataGridPagination } from "@/components/reui/data-grid/data-grid-pagination";
import { DataGridScrollArea } from "@/components/reui/data-grid/data-grid-scroll-area";
import { DataGridTable } from "@/components/reui/data-grid/data-grid-table";

import {
  DENSITY_ROW_CLASS,
  SEARCHABLE_KINDS,
  densityFor,
  type FieldKey,
  type TypedColumn,
} from "./column-kind";
import { GRID_COPY, GRID_I18N } from "./grid-copy";
import { RegionHeader } from "./region-header";
import {
  RegionEmpty,
  RegionError,
  RegionForbidden,
  RegionNoMatch,
  RegionPartial,
  RegionSkeleton,
} from "./region-state";
import { TypedCell } from "./typed-cell";

/** One row: its id, its values by field, and the cells locked for now with the reason. */
export type GridRow = {
  id: string;
  transaction?: "sale" | "lease";
  locked?: Partial<Record<FieldKey, string>>;
} & Partial<Record<FieldKey, unknown>>;

export type RegionStatus = "ready" | "loading" | "error" | "partial" | "forbidden";

export const DEFAULT_PAGE_SIZE = 50;

const helper = createColumnHelper<typeof dataGridFeatures, GridRow>();

function matches(row: GridRow, columns: readonly TypedColumn[], query: string): boolean {
  const needle = query.trim().toLocaleLowerCase("vi");
  if (needle === "") return true;
  return columns.some(
    (column) =>
      SEARCHABLE_KINDS.includes(column.kind) &&
      String(row[column.field] ?? "")
        .toLocaleLowerCase("vi")
        .includes(needle),
  );
}

/** Width of the content area in ch, measured on the element itself so the density follows the real layout. */
function useWidthInCh() {
  const boxRef = useRef<HTMLDivElement>(null);
  const chRef = useRef<HTMLSpanElement>(null);
  const [widthCh, setWidthCh] = useState<number | null>(null);
  const [chPx, setChPx] = useState(8);
  useEffect(() => {
    const box = boxRef.current;
    const ch = chRef.current;
    if (!box || !ch) return;
    const measure = () => {
      const one = ch.getBoundingClientRect().width || 8;
      setChPx(one);
      setWidthCh(box.getBoundingClientRect().width / one);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(box);
    return () => observer.disconnect();
  }, []);
  return { boxRef, chRef, widthCh, chPx };
}

/**
 * The shared grid of every data region: header, typed columns, search, pagination and the region states
 * (design/states.md). Screens give columns by field and rows; alignment, width, format and density follow the kind.
 */
export function DataRegion({
  title,
  columns,
  rows,
  status = "ready",
  onRetry,
  emptyWhy,
  emptyAction,
  action,
  pageSize = DEFAULT_PAGE_SIZE,
}: {
  title: string;
  columns: readonly TypedColumn[];
  rows: readonly GridRow[];
  status?: RegionStatus;
  onRetry?: () => void;
  /** Why this region is empty, in the screen's words; the general reason when absent. */
  emptyWhy?: string;
  emptyAction?: ReactNode;
  action?: ReactNode;
  pageSize?: number;
}) {
  const searchId = useId();
  const [query, setQuery] = useState("");
  const { boxRef, chRef, widthCh, chPx } = useWidthInCh();
  const retry = onRetry ?? (() => undefined);

  const shown = useMemo(
    () => rows.filter((row) => matches(row, columns, query)),
    [rows, columns, query],
  );
  const totalMinCh = columns.reduce((sum, column) => sum + column.widthCh, 0);
  const density = widthCh === null ? "normal" : densityFor(totalMinCh, widthCh);

  const columnDefs = useMemo(
    () =>
      columns.map((column) =>
        helper.accessor((row: GridRow) => row[column.field], {
          id: column.field,
          header: column.header,
          size: Math.round(column.widthCh * chPx),
          cell: (info) => (
            <TypedCell
              kind={column.kind}
              value={info.getValue()}
              transaction={info.row.original.transaction}
              lockedReason={info.row.original.locked?.[column.field]}
            />
          ),
          meta: {
            headerTitle: column.header,
            headerClassName: column.align === "right" ? "text-right" : "text-left",
            cellClassName: column.align === "right" ? "text-right" : "text-left",
          },
        }),
      ),
    [columns, chPx],
  );

  const table = useTable({
    features: dataGridFeatures,
    data: shown as GridRow[],
    columns: columnDefs,
    getRowId: (row: GridRow) => row.id,
    initialState: { pagination: { pageIndex: 0, pageSize } },
  });

  // The grid scrolls sideways inside its own viewport; keyboard users must be able to reach and scroll it
  // (WCAG 2.1.1). ReUI's scroll area takes no props for its viewport, so the region labels it after render.
  useEffect(() => {
    const viewport = boxRef.current?.querySelector<HTMLElement>(
      '[data-slot="scroll-area-viewport"]',
    );
    if (!viewport) return;
    viewport.tabIndex = 0;
    viewport.setAttribute("role", "region");
    viewport.setAttribute("aria-label", title);
  });

  const visible = status !== "forbidden";
  let body: ReactNode;
  if (status === "forbidden") body = <RegionForbidden />;
  else if (status === "loading") body = <RegionSkeleton columns={columns.length} />;
  else if (status === "error") body = <RegionError onRetry={retry} />;
  else if (rows.length === 0) body = <RegionEmpty why={emptyWhy} action={emptyAction} />;
  else if (shown.length === 0) body = <RegionNoMatch onClear={() => setQuery("")} />;
  else
    body = (
      <DataGrid
        table={table}
        recordCount={shown.length}
        i18n={GRID_I18N}
        tableLayout={{ headerSticky: true, width: "fixed", dense: density === "dense" }}
        tableClassNames={{ bodyRow: DENSITY_ROW_CLASS[density] }}
      >
        <DataGridContainer>
          <DataGridScrollArea>
            <DataGridTable />
          </DataGridScrollArea>
        </DataGridContainer>
        {shown.length > pageSize ? (
          <DataGridPagination
            sizes={[pageSize]}
            rowsPerPageLabel={GRID_I18N.labels?.rowsPerPage}
            previousPageLabel={GRID_I18N.labels?.previousPage}
            nextPageLabel={GRID_I18N.labels?.nextPage}
          />
        ) : null}
      </DataGrid>
    );

  return (
    <section data-slot="data-region" className="flex min-w-0 flex-col gap-4">
      <span ref={chRef} aria-hidden="true" className="invisible absolute">
        0
      </span>
      <RegionHeader
        title={title}
        total={visible && status !== "loading" ? rows.length : undefined}
        shown={query ? shown.length : undefined}
        query={query}
        onQuery={setQuery}
        action={action}
        searchId={searchId}
      />
      {status === "partial" ? <RegionPartial onRetry={retry} /> : null}
      {/* Zero width, at least full width: the grid never widens the page; it scrolls sideways inside the region. */}
      <div
        ref={boxRef}
        data-slot="data-region-body"
        data-density={density}
        className="w-0 min-w-full"
      >
        {body}
      </div>
    </section>
  );
}

export { GRID_COPY };
