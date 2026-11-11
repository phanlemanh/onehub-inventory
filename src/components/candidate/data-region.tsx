"use client";

import { createColumnHelper, useTable } from "@tanstack/react-table";
import { useCallback, useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";

import {
  DataGrid,
  DataGridContainer,
  dataGridFeatures,
} from "@/components/reui/data-grid/data-grid";
import { DataGridPagination } from "@/components/reui/data-grid/data-grid-pagination";
import { DataGridScrollArea } from "@/components/reui/data-grid/data-grid-scroll-area";
import { DataGridTable } from "@/components/reui/data-grid/data-grid-table";
import { Button } from "@/components/ui/button";

import {
  DENSITY_ROW_CLASS,
  SEARCHABLE_KINDS,
  densityFor,
  editModeFor,
  type FieldKey,
  type TypedColumn,
} from "./column-kind";
import { GRID_COPY, GRID_I18N } from "./grid-copy";
import { RecordPanel, useRecordAddress, type RecordView } from "./record-panel";
import { RegionHeader } from "./region-header";
import {
  RegionEmpty,
  RegionError,
  RegionForbidden,
  RegionLoading,
  RegionNoMatch,
  RegionPartial,
  RegionPartialEmpty,
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

/** The region's working button and whether the viewer may use it; a button without permission never shows. */
export interface RegionAction {
  node: ReactNode;
  allowed: boolean;
}

/** How the region opens a row in the record panel: the screen says what one record shows, nothing else. */
export interface RegionRecord {
  render: (row: GridRow) => RecordView;
  /** Controlled address, for tests and for screens that keep it elsewhere; the page address otherwise. */
  address?: { openId: string | null; navigate: (id: string | null) => void };
}

/** The header shows the count and the search box only when the rows it would count are on screen. */
export function headerShowsRows(status: RegionStatus): boolean {
  return status === "ready" || status === "partial";
}

/** The panel when the page address holds the open record; it hands its `navigate` to the grid's open buttons. */
function AddressedPanel({
  rows,
  ids,
  record,
  onReady,
}: {
  rows: readonly GridRow[];
  ids: readonly string[];
  record: RegionRecord;
  onReady: (navigate: (id: string | null) => void) => void;
}) {
  const { openId, navigate } = useRecordAddress();
  useEffect(() => onReady(navigate), [onReady, navigate]);
  return <PanelFor rows={rows} ids={ids} record={record} openId={openId} navigate={navigate} />;
}

function PanelFor({
  rows,
  ids,
  record,
  openId,
  navigate,
}: {
  rows: readonly GridRow[];
  ids: readonly string[];
  record: RegionRecord;
  openId: string | null;
  navigate: (id: string | null) => void;
}) {
  const byId = useMemo(() => new Map(rows.map((row) => [row.id, row])), [rows]);
  const known = openId !== null && byId.has(openId) ? openId : null;
  return (
    <RecordPanel
      ids={ids}
      openId={known}
      onNavigate={navigate}
      render={(id) => record.render(byId.get(id) as GridRow)}
    />
  );
}

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
  onCancel,
  emptyWhy,
  emptyAction,
  action,
  record,
  editable = false,
  pageSize = DEFAULT_PAGE_SIZE,
}: {
  title: string;
  columns: readonly TypedColumn[];
  rows: readonly GridRow[];
  status?: RegionStatus;
  /** Loads the region again; without it there is no «Thử lại» button. */
  onRetry?: () => void;
  /** Stops a long load; offered after ten seconds of loading. */
  onCancel?: () => void;
  /** Why this region is empty, in the screen's words; the general reason when absent. */
  emptyWhy?: string;
  emptyAction?: ReactNode;
  action?: RegionAction;
  /** Rows open in the record panel. */
  record?: RegionRecord;
  /** Cells say where they are edited: in the cell or in the record panel, by kind. */
  editable?: boolean;
  pageSize?: number;
}) {
  const searchId = useId();
  const [query, setQuery] = useState("");
  const { boxRef, chRef, widthCh, chPx } = useWidthInCh();

  const shown = useMemo(
    () => rows.filter((row) => matches(row, columns, query)),
    [rows, columns, query],
  );
  const totalMinCh = columns.reduce((sum, column) => sum + column.widthCh, 0);
  const density = widthCh === null ? "normal" : densityFor(totalMinCh, widthCh);

  const recordAddress = record?.address;
  const addressNavigate = useRef<((id: string | null) => void) | null>(null);
  const onAddressReady = useCallback((navigate: (id: string | null) => void) => {
    addressNavigate.current = navigate;
  }, []);
  const openRecord = record
    ? (id: string) => {
        if (recordAddress) recordAddress.navigate(id);
        else addressNavigate.current?.(id);
      }
    : undefined;
  const opensRecord = record !== undefined;
  const openRef = useRef(openRecord);
  useEffect(() => {
    openRef.current = openRecord;
  });

  const columnDefs = useMemo(
    () =>
      columns.map((column, index) =>
        helper.accessor((row: GridRow) => row[column.field], {
          id: column.field,
          header: column.header,
          size: Math.round(column.widthCh * chPx),
          cell: (info) => {
            const cell = (
              <TypedCell
                kind={column.kind}
                value={info.getValue()}
                transaction={info.row.original.transaction}
                lockedReason={info.row.original.locked?.[column.field]}
                editMode={editable ? editModeFor(column.kind) : undefined}
              />
            );
            if (index !== 0 || !opensRecord) return cell;
            const id = info.row.original.id;
            return (
              <Button
                variant="link"
                size="sm"
                data-record-open={id}
                onClick={() => openRef.current?.(id)}
              >
                {cell}
              </Button>
            );
          },
          meta: {
            headerTitle: column.header,
            headerClassName: column.align === "right" ? "text-right" : "text-left",
            cellClassName: column.align === "right" ? "text-right" : "text-left",
          },
        }),
      ),
    [columns, chPx, editable, opensRecord],
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

  const showsRows = headerShowsRows(status);
  let body: ReactNode;
  if (status === "forbidden") body = <RegionForbidden />;
  else if (status === "loading")
    body = <RegionLoading columns={columns.length} onCancel={onCancel} />;
  else if (status === "error") body = <RegionError onRetry={onRetry} />;
  else if (status === "partial" && rows.length === 0)
    body = <RegionPartialEmpty onRetry={onRetry} />;
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
        total={showsRows ? rows.length : undefined}
        shown={showsRows && query ? shown.length : undefined}
        query={query}
        onQuery={setQuery}
        action={action?.allowed && status !== "forbidden" ? action.node : undefined}
        searchId={searchId}
      />
      {status === "partial" && rows.length > 0 ? <RegionPartial onRetry={onRetry} /> : null}
      {/* Zero width, at least full width: the grid never widens the page; it scrolls sideways inside the region. */}
      <div
        ref={boxRef}
        data-slot="data-region-body"
        data-density={density}
        className="w-0 min-w-full"
      >
        {body}
      </div>
      {record && showsRows ? (
        record.address ? (
          <PanelFor
            rows={rows}
            ids={shown.map((row) => row.id)}
            record={record}
            openId={record.address.openId}
            navigate={record.address.navigate}
          />
        ) : (
          <AddressedPanel
            rows={rows}
            ids={shown.map((row) => row.id)}
            record={record}
            onReady={onAddressReady}
          />
        )
      ) : null}
    </section>
  );
}

export { GRID_COPY };
