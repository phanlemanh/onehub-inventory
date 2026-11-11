"use client";

import { createColumnHelper, useTable } from "@tanstack/react-table";
import { useCallback, useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";

import {
  DataGrid,
  DataGridContainer,
  dataGridFeatures,
} from "@/components/reui/data-grid/data-grid";
import { DataGridScrollArea } from "@/components/reui/data-grid/data-grid-scroll-area";
import { DataGridTableVirtual } from "@/components/reui/data-grid/data-grid-table-virtual";
import { Frame, FrameHeader, FramePanel } from "@/components/reui/frame";
import { Button } from "@/components/ui/button";

import {
  DENSITY_ROW_CLASS,
  SEARCHABLE_KINDS,
  densityFor,
  editModeFor,
  fittedWidthCh,
  fullWidthCh,
  spreadSpareCh,
  type FieldKey,
  type TypedColumn,
} from "./column-kind";
import { GRID_COPY, GRID_I18N } from "./grid-copy";
import { RecordPanel, useRecordAddress, type RecordView } from "./record-panel";
import { RegionTitle, RegionToolbar } from "./region-header";
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

/** Row heights of the two densities (h-10, h-12), for the virtual body to place rows before measuring them. */
const ROW_HEIGHT_PX = { dense: 40, normal: 48 } as const;

/** Viewport height of the grid: rows scroll inside it in one run, like a sheet; the page itself does not scroll. */
const VIEWPORT_HEIGHT_CLASS = "h-96 lg:h-screen";

/** Id of the row-number column, the first frozen column. */
export const ROW_NUMBER_ID = "row-number";

/** How many leading data columns stay put while the grid scrolls sideways, after the row numbers. */
export const FROZEN_COLUMNS = 2;

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
 * The shared grid of every data region: header, typed columns, search, one continuous run of rows and the region states
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
}) {
  const searchId = useId();
  const [query, setQuery] = useState("");
  const { boxRef, chRef, widthCh, chPx } = useWidthInCh();

  const shown = useMemo(
    () => rows.filter((row) => matches(row, columns, query)),
    [rows, columns, query],
  );
  // Widths follow the rows the region holds, not the rows a search leaves, so columns do not jump while typing.
  const fitted = useMemo(
    () =>
      columns.map((column) =>
        fittedWidthCh(
          column,
          rows.map((row) => row[column.field]),
        ),
      ),
    [columns, rows],
  );
  const full = useMemo(
    () =>
      columns.map((column) =>
        fullWidthCh(
          column,
          rows.map((row) => row[column.field]),
        ),
      ),
    [columns, rows],
  );
  const totalMinCh = fitted.reduce((sum, w) => sum + w, 0);
  const density = widthCh === null ? "normal" : densityFor(totalMinCh, widthCh);
  // Spare room on a wide screen goes to columns that cut their text (a long project name), never below the fit.
  const widths = useMemo(
    () => spreadSpareCh(fitted, full, widthCh === null ? null : widthCh - 1),
    [fitted, full, widthCh],
  );

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
    () => [
      helper.display({
        id: ROW_NUMBER_ID,
        header: GRID_COPY.rowNumberHeader,
        size: Math.floor((String(rows.length).length + 3) * chPx),
        cell: (info) => (
          <span
            data-slot="row-number"
            data-row-number={info.row.index + 1}
            className="text-muted-foreground tabular-nums"
          >
            {info.row.index + 1}
          </span>
        ),
        meta: {
          headerTitle: GRID_COPY.rowNumberLabel,
          headerClassName: "text-right",
          cellClassName: "text-right",
        },
      }),
      ...columns.map((column, index) =>
        helper.accessor((row: GridRow) => row[column.field], {
          id: column.field,
          header: column.header,
          size: Math.floor((widths[index] ?? column.widthCh) * chPx),
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
    ],
    [columns, chPx, editable, opensRecord, widths, rows.length],
  );

  const table = useTable({
    features: dataGridFeatures,
    data: shown as GridRow[],
    columns: columnDefs,
    getRowId: (row: GridRow) => row.id,
    // One continuous run: every row is on the single page, the virtual body mounts only the rows in view.
    initialState: {
      pagination: { pageIndex: 0, pageSize: Number.MAX_SAFE_INTEGER },
      columnPinning: {
        start: [ROW_NUMBER_ID, ...columns.slice(0, FROZEN_COLUMNS).map((column) => column.field)],
        end: [],
      },
    },
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
        tableLayout={{
          headerSticky: true,
          columnsPinnable: true,
          width: "fixed",
          dense: density === "dense",
        }}
        tableClassNames={{ bodyRow: DENSITY_ROW_CLASS[density] }}
      >
        <DataGridContainer>
          <DataGridScrollArea className={VIEWPORT_HEIGHT_CLASS}>
            <DataGridTableVirtual estimateSize={ROW_HEIGHT_PX[density]} />
          </DataGridScrollArea>
        </DataGridContainer>
        <div data-slot="region-footer" className="border-t px-3 py-2">
          <span data-slot="region-count" className="text-sm text-muted-foreground">
            {query
              ? GRID_COPY.filteredCount(shown.length, rows.length)
              : GRID_COPY.rowCount(rows.length)}
          </span>
        </div>
      </DataGrid>
    );

  return (
    <section data-slot="data-region" className="flex min-w-0 flex-col">
      <span ref={chRef} aria-hidden="true" className="invisible absolute">
        0
      </span>
      {/* Arrangement after data-grid-editing-6: name on the frame's header strip; toolbar, table and pages in one panel. */}
      <Frame className="min-w-0">
        <FrameHeader>
          <RegionTitle title={title} />
        </FrameHeader>
        <FramePanel className="flex min-w-0 flex-col gap-3 p-0">
          <div className="px-3 pt-3 empty:hidden">
            <RegionToolbar
              total={showsRows ? rows.length : undefined}
              shown={showsRows && query ? shown.length : undefined}
              query={query}
              onQuery={setQuery}
              action={action?.allowed && status !== "forbidden" ? action.node : undefined}
              searchId={searchId}
              showCount={false}
            />
          </div>
          {status === "partial" && rows.length > 0 ? (
            <div className="px-3">
              <RegionPartial onRetry={onRetry} />
            </div>
          ) : null}
          {/* Zero width, at least full width: the grid never widens the page; it scrolls sideways inside the region. */}
          <div
            ref={boxRef}
            data-slot="data-region-body"
            data-density={density}
            className="w-0 min-w-full"
          >
            {body}
          </div>
        </FramePanel>
      </Frame>
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
