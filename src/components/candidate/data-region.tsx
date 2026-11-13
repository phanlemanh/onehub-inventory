"use client";

import {
  createColumnHelper,
  useTable,
  type ColumnFiltersState,
  type ColumnPinningState,
  type ExpandedState,
  type SortingState,
  type ColumnVisibilityState,
} from "@tanstack/react-table";
import { Columns3Icon, FilterIcon, ListTreeIcon, Maximize2Icon, Minimize2Icon } from "lucide-react";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react";

import { Badge } from "@/components/reui/badge";
import {
  DataGrid,
  DataGridContainer,
  dataGridFeatures,
  type DataGridCellSelectionSnapshot,
} from "@/components/reui/data-grid/data-grid";
import {
  DataGridCellSelection,
  type DataGridCellSelectionApi,
} from "@/components/reui/data-grid/data-grid-cell-selection";
import { DataGridColumnHeader } from "@/components/reui/data-grid/data-grid-column-header";
import { DataGridColumnVisibility } from "@/components/reui/data-grid/data-grid-column-visibility";
import { DataGridScrollArea } from "@/components/reui/data-grid/data-grid-scroll-area";
import { DataGridTableRowExpand } from "@/components/reui/data-grid/data-grid-table";
import { DataGridTableVirtual } from "@/components/reui/data-grid/data-grid-table-virtual";
import { Frame, FrameHeader, FramePanel } from "@/components/reui/frame";
import { useShellFocus } from "@/components/templates/shell-focus";
import { Button } from "@/components/ui/button";

import {
  DENSITY_ROW_CLASS,
  densityFor,
  editModeFor,
  fittedWidthCh,
  fullWidthCh,
  spreadSpareCh,
  type FieldKey,
  type TypedColumn,
} from "./column-kind";
import { ColumnFilterCell, type FilterOption } from "./column-filter-cell";
import { GRID_COPY, GRID_I18N } from "./grid-copy";
import {
  GROUP_ID_PREFIX,
  STATUS_ORDER,
  cellText,
  filterIsEmpty,
  filterModeFor,
  filterRows,
  groupRows,
  rowNumbers,
  sortRows,
  viewWithin,
  type ColumnFilter,
  type ColumnFilters,
  type GridView,
  type SortBy,
} from "./grid-view";
import { RecordPanel, useRecordAddress, type RecordView } from "./record-panel";
import { RegionTitle, RegionToolbar } from "./region-header";
import { RowActions, type RecordAction } from "./row-actions";
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
import { useChange } from "./use-change";

/** One row: its id, its values by field, and the cells locked for now with the reason. */
export type GridRow = {
  id: string;
  transaction?: "sale" | "lease";
  locked?: Partial<Record<FieldKey, string>>;
} & Partial<Record<FieldKey, unknown>>;

export type RegionStatus = "ready" | "loading" | "error" | "partial" | "forbidden";

/** Row heights of the two densities (h-8, h-12, plus the 1px row border), for the virtual body to place rows before measuring them. */
const ROW_HEIGHT_PX = { dense: 33, normal: 49 } as const;

/**
 * Viewport height of the grid: rows scroll inside it in one run, like a sheet; the page itself does not scroll. From
 * 1024 the grid takes the screen less the App Shell's top bar, the page header, the toolbar and the footer, so the
 * footer (row count, selection hint) stays on screen; a height the region sets once as a custom property.
 */
const VIEWPORT_HEIGHT_CLASS = "h-96 lg:h-(--region-height)";

/**
 * In full screen the grid ends at the screen's bottom edge: the screen less the name strip, toolbar and footer, a
 * height the region sets once as a custom property.
 */
// Repeated under lg: so it beats the lg: height of the normal page, which would otherwise win from 1024 (AC-11).
const FULL_SCREEN_HEIGHT_CLASS =
  "group-data-full-screen/region:h-(--region-full-height) lg:group-data-full-screen/region:h-(--region-full-height)";
const REGION_HEIGHTS = {
  "--region-height": "calc(100dvh - 23rem)",
  "--region-full-height": "calc(100dvh - 10rem)",
} as CSSProperties;

const noSubscribe = () => () => undefined;

/** Narrowest a column gets while the filter row is open, in ch: room for a rule like «<=5» or «toa e». */
const FILTER_MIN_CH = 11;

/** Room the group's open-close button takes in front of a group label, in ch. */
const GROUP_TOGGLE_CH = 4;

/** Id of the row-number column, the first frozen column. */
export const ROW_NUMBER_ID = "row-number";

/** Id of the row-actions column, pinned last: one «…» per row (row 9e). */
export const ROW_ACTIONS_ID = "row-actions";

/** Width of the row-actions column, in ch: the «…» button and its padding. */
const ROW_ACTIONS_CH = 6;

/** The most of the region's width the pinned columns may take before the second frozen column lets go. */
const PINNED_SHARE = 0.7;

/** What one row offers in its «…»: the actions by permission-table name, whether the row is the viewer's own. */
export interface RegionRowActions {
  actions: readonly RecordAction[];
  mine: boolean;
}

/** How many leading data columns stay put while the grid scrolls sideways, after the row numbers. */
export const FROZEN_COLUMNS = 2;

/** The keys the sheet grid moves by: pressed on a row's unit code, they go to the grid (ruling D-1211-19). */
const GRID_KEYS = new Set([
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "Home",
  "End",
  "PageUp",
  "PageDown",
]);

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
  returnFocus,
}: {
  rows: readonly GridRow[];
  ids: readonly string[];
  record: RegionRecord;
  onReady: (navigate: (id: string | null) => void) => void;
  returnFocus?: (id: string) => boolean;
}) {
  const { openId, navigate } = useRecordAddress();
  useEffect(() => onReady(navigate), [onReady, navigate]);
  return (
    <PanelFor
      rows={rows}
      ids={ids}
      record={record}
      openId={openId}
      navigate={navigate}
      returnFocus={returnFocus}
    />
  );
}

function PanelFor({
  rows,
  ids,
  record,
  openId,
  navigate,
  returnFocus,
}: {
  rows: readonly GridRow[];
  ids: readonly string[];
  record: RegionRecord;
  openId: string | null;
  navigate: (id: string | null) => void;
  returnFocus?: (id: string) => boolean;
}) {
  const byId = useMemo(() => new Map(rows.map((row) => [row.id, row])), [rows]);
  const known = openId !== null && byId.has(openId) ? openId : null;
  return (
    <RecordPanel
      ids={ids}
      openId={known}
      onNavigate={navigate}
      render={(id) => record.render(byId.get(id) as GridRow)}
      returnFocus={returnFocus}
    />
  );
}

/** A row of the table: a data row, or a group row holding the data rows under one value. */
type TableRow = GridRow & {
  /** Where the row stands in reading order, on through the groups; group rows have none. */
  rowNumber?: number;
  group?: { label: string; count: number; field: FieldKey };
  subRows?: TableRow[];
};

const helper = createColumnHelper<typeof dataGridFeatures, TableRow>();

const isGroup = (row: TableRow) => row.group !== undefined;

/** Width of the content area in ch, measured on the element itself so the density follows the real layout. */
function useWidthInCh() {
  const boxRef = useRef<HTMLDivElement>(null);
  const chRef = useRef<HTMLSpanElement>(null);
  const denseChRef = useRef<HTMLSpanElement>(null);
  const [widthCh, setWidthCh] = useState<number | null>(null);
  const [chPx, setChPx] = useState(8);
  const [denseChPx, setDenseChPx] = useState(7);
  useEffect(() => {
    const box = boxRef.current;
    const ch = chRef.current;
    if (!box || !ch) return;
    const measure = () => {
      const one = ch.getBoundingClientRect().width || 8;
      setChPx(one);
      setDenseChPx(denseChRef.current?.getBoundingClientRect().width || one);
      setWidthCh(box.getBoundingClientRect().width / one);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(box);
    return () => observer.disconnect();
  }, []);
  return { boxRef, chRef, denseChRef, widthCh, chPx, denseChPx };
}

/** The values a value column holds, in the order a reader expects: statuses in STATUS_ORDER, others as they come. */
function filterOptions(column: TypedColumn, rows: readonly GridRow[]): FilterOption[] {
  if (filterModeFor(column.kind) !== "values") return [];
  const seen = new Map<string, string>();
  for (const row of rows) {
    const value = row[column.field];
    if (value === null || value === undefined || value === "") continue;
    const key = String(value);
    if (!seen.has(key)) seen.set(key, cellText(column.kind, value));
  }
  const options = [...seen.entries()].map(([value, label]) => ({ value, label }));
  if (column.kind === "status") {
    const at = (value: string) => {
      const index = (STATUS_ORDER as readonly string[]).indexOf(value);
      return index === -1 ? STATUS_ORDER.length : index;
    };
    return options.sort((a, b) => at(a.value) - at(b.value));
  }
  return options;
}

function filtersFrom(state: ColumnFiltersState): ColumnFilters {
  const filters: ColumnFilters = {};
  for (const entry of state) filters[entry.id as FieldKey] = entry.value as ColumnFilter;
  return filters;
}

/**
 * The shared grid of every data region: header, typed columns, search, one continuous run of rows, the region states
 * (design/states.md), and the sheet habits of row 2a — a selected cell moved by the keyboard, a range copied as
 * tab-separated text, sort by a header, one filter per column, rows grouped under one field, columns shown or hidden.
 * Screens give columns by field and rows; alignment, width, format, density and these habits follow the kind.
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
  headAction,
  rowActions,
  record,
  editable = false,
  initialFilters,
  groupBy,
  initialView,
  onViewChange,
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
  /**
   * The page head's main button (the add button of the screen), already gated by PermittedAction. Full screen hides the page head,
   * so the region shows the same button in its toolbar there — one button, two places by mode (ruling V-1211-6).
   */
  headAction?: ReactNode;
  /** Each row's actions, shown as one «…» in a column pinned last; a row with nothing permitted shows none. */
  rowActions?: (row: GridRow) => RegionRowActions;
  /** Rows open in the record panel. */
  record?: RegionRecord;
  /** Cells say where they are edited: in the cell or in the record panel, by kind. */
  editable?: boolean;
  /** Column filters the region opens with, e.g. a status shortcut of the App Shell. */
  initialFilters?: ColumnFilters;
  /** The field rows may be grouped under; the toolbar offers «Nhóm theo …» only when the screen names one. */
  groupBy?: FieldKey;
  /**
   * The arrangement the region opens with (row 2c, a saved view): search text, filters, sort, grouping, hidden columns.
   * Parts naming a column the region does not have are dropped. Wins over `initialFilters`. Give the region a new
   * `key` to open another one.
   */
  initialView?: GridView;
  /** Hears the arrangement after each change the person makes (and once on opening). */
  onViewChange?: (view: GridView) => void;
}) {
  const searchId = useId();
  // One confirmation for every row's removing action: a row scrolled out of the virtual body keeps it open.
  const removing = useChange();
  const [opening] = useState(() => (initialView ? viewWithin(initialView, columns) : undefined));
  const [query, setQuery] = useState(opening?.query ?? "");
  const [sorting, setSorting] = useState<SortingState>(() =>
    (opening?.sort ?? []).map((s) => ({ id: s.field, desc: s.direction === "desc" })),
  );
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(() =>
    Object.entries(opening?.filters ?? initialFilters ?? {})
      .filter(([, value]) => !filterIsEmpty(value))
      .map(([id, value]) => ({ id, value })),
  );
  const [filterRowOpen, setFilterRowOpen] = useState(() => columnFilters.length > 0);
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibilityState>(() =>
    Object.fromEntries((opening?.hidden ?? []).map((field) => [field, false])),
  );
  const [grouped, setGrouped] = useState(opening?.grouped ?? false);
  const [expanded, setExpanded] = useState<ExpandedState>(true);
  const [selectedCells, setSelectedCells] = useState(0);
  // Full screen, like a sheet's: the whole page goes full screen (browser bars hidden, menus still open on top) and the
  // App Shell steps aside, so the region alone fills the screen. Esc, handled by the browser, leaves it.
  const shell = useShellFocus();
  const [fullScreen, setFullScreen] = useState(false);
  const canFullScreen = useSyncExternalStore(
    noSubscribe,
    () => document.fullscreenEnabled === true,
    () => false,
  );
  const setShellFocused = shell.setFocused;
  const fullScreenButtonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const onChange = () => {
      if (document.fullscreenElement) return;
      setFullScreen(false);
      setShellFocused(false);
      // Back where the keyboard was: the button that entered full screen.
      requestAnimationFrame(() => fullScreenButtonRef.current?.focus());
    };
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, [setShellFocused]);
  // Leaving the screen in full screen (Back, a gesture, a link — row 2c, Ngoài-5 of 2a): the region goes, so it gives
  // the screen back to the App Shell and to the browser's own bars.
  useEffect(
    () => () => {
      setShellFocused(false);
      if (document.fullscreenElement) void document.exitFullscreen().catch(() => undefined);
    },
    [setShellFocused],
  );
  const toggleFullScreen = () => {
    if (fullScreen) {
      if (document.fullscreenElement) void document.exitFullscreen();
      setFullScreen(false);
      setShellFocused(false);
      return;
    }
    void document.documentElement.requestFullscreen().then(
      () => {
        setFullScreen(true);
        setShellFocused(true);
      },
      () => undefined,
    );
  };
  const { boxRef, chRef, denseChRef, widthCh, chPx: baseChPx, denseChPx } = useWidthInCh();

  const filters = useMemo(() => filtersFrom(columnFilters), [columnFilters]);
  const activeFilterCount = columns.filter((c) => !filterIsEmpty(filters[c.field])).length;
  const sortBy: SortBy | null = sorting[0]
    ? { field: sorting[0].id as FieldKey, direction: sorting[0].desc ? "desc" : "asc" }
    : null;
  const groupColumn = groupBy ? columns.find((c) => c.field === groupBy) : undefined;
  const isGrouped = grouped && groupColumn !== undefined;
  const hiddenKey = columns
    .filter((c) => columnVisibility[c.field] === false)
    .map((c) => c.field)
    .join("|");
  const view = useMemo(
    (): GridView => ({
      query,
      filters,
      sort: sortBy ? [sortBy] : [],
      grouped: isGrouped,
      hidden: hiddenKey === "" ? [] : (hiddenKey.split("|") as FieldKey[]),
    }),
    [query, filters, sortBy?.field, sortBy?.direction, isGrouped, hiddenKey], // eslint-disable-line react-hooks/exhaustive-deps
  );
  const viewListener = useRef(onViewChange);
  useEffect(() => {
    viewListener.current = onViewChange;
  });
  useEffect(() => {
    viewListener.current?.(view);
  }, [view]);

  // Filter, then sort, then group: a sort orders rows inside each group, numbers run on through the groups.
  const shown = useMemo(
    () => sortRows(filterRows(rows, columns, filters, query), columns, sortBy),
    [rows, columns, filters, query, sortBy?.field, sortBy?.direction], // eslint-disable-line react-hooks/exhaustive-deps
  );
  const data = useMemo((): TableRow[] => {
    if (!isGrouped || !groupColumn) {
      const numbers = rowNumbers(shown);
      return shown.map((row) => ({ ...row, rowNumber: numbers.get(row.id) }));
    }
    const groups = groupRows(shown, groupColumn);
    const numbers = rowNumbers(groups);
    return groups.map((g): TableRow => ({
      id: g.id,
      group: { label: g.label, count: g.rows.length, field: groupColumn.field },
      subRows: g.rows.map((row) => ({ ...row, rowNumber: numbers.get(row.id) })),
    }));
  }, [shown, isGrouped, groupColumn]);
  // Ids of the data rows in the order they are read (through the groups): the record panel steps through them.
  const readingIds = useMemo(
    () => data.flatMap((row) => (row.subRows ? row.subRows.map((sub) => sub.id) : [row.id])),
    [data],
  );

  // Widths follow the rows the region holds, not the rows a filter leaves, so columns do not jump while typing.
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
  const options = useMemo(
    () => new Map(columns.map((column) => [column.field, filterOptions(column, rows)])),
    [columns, rows],
  );
  // The row-number column counts too: digits of the last row number plus padding.
  const rowNumberCh = String(rows.length).length + 3;
  const totalMinCh = rowNumberCh + fitted.reduce((sum, w) => sum + w, 0);
  // Full screen is for seeing the most rows, as on a sheet: rows stay dense there whatever the width.
  const density = fullScreen
    ? "dense"
    : widthCh === null
      ? "normal"
      : densityFor(totalMinCh, widthCh);
  // Dense rows use the smaller text, so their columns are sized in the smaller text's ch: a grid that overflows in
  // normal text shrinks with its text instead of keeping normal-text widths. Density itself is decided in normal ch.
  const chPx = density === "dense" ? denseChPx : baseChPx;
  // Spare room on a wide screen goes to columns that cut their text (a long project name), never below the fit.
  // With the filter row open every column is at least wide enough to type a short rule in its box.
  const widths = useMemo(() => {
    const spread = spreadSpareCh(
      fitted,
      full,
      widthCh === null ? null : (widthCh * baseChPx) / chPx - rowNumberCh - 1,
    );
    // While grouped, the grouping column also holds the group's open-close button in front of its label.
    return spread.map((w, i) => {
      const grown = isGrouped && columns[i]?.field === groupColumn?.field ? w + GROUP_TOGGLE_CH : w;
      return filterRowOpen ? Math.max(grown, FILTER_MIN_CH) : grown;
    });
  }, [
    fitted,
    full,
    widthCh,
    baseChPx,
    chPx,
    rowNumberCh,
    filterRowOpen,
    isGrouped,
    columns,
    groupColumn,
  ]);

  // Header cells, kept apart from the widths: a header renderer is a component to the table, so a new one each time the
  // widths move (a scroll bar coming or going as rows filter out) would draw the filter boxes again and drop the focus
  // of the box being typed in (row 2c, Ngoài-4 of 2a).
  const headers = useMemo(
    () =>
      columns.map(
        (column) =>
          helper.accessor((row: TableRow) => row[column.field], {
            id: column.field,
            header: ({ column: tableColumn }) => (
              <div data-slot="sheet-header" className="flex w-full min-w-0 flex-col py-1">
                <DataGridColumnHeader
                  column={tableColumn}
                  title={column.header}
                  className={column.align === "right" ? "ms-auto" : undefined}
                />
                {filterRowOpen ? (
                  <ColumnFilterCell
                    spec={column}
                    column={tableColumn}
                    options={options.get(column.field) ?? []}
                  />
                ) : null}
              </div>
            ),
          }).header,
      ),
    [columns, filterRowOpen, options],
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
  // Closing the record gives focus back to the row's unit code and makes its cell the grid's selected cell, so the
  // sheet keys run on from there at once (ruling D-1211-19). The code button hands any navigation key to the grid.
  const selectionApi = useRef<DataGridCellSelectionApi | null>(null);
  const selectCellRef = useRef<((id: string) => void) | null>(null);
  const firstField = columns[0]?.field;
  const returnFocusToCell = useCallback((id: string) => {
    selectCellRef.current?.(id);
    return false;
  }, []);
  const handOverKey = useCallback(
    (id: string, event: KeyboardEvent<HTMLButtonElement>) => {
      const api = selectionApi.current;
      if (!api || !firstField) return;
      // Copy: focus moves to the grid before the browser fires its copy, so the grid copies its selected cells.
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "c") {
        api.focusCell(id, firstField);
        return;
      }
      if (!GRID_KEYS.has(event.key)) return;
      event.preventDefault();
      api.focusCell(id, firstField);
      document.activeElement?.dispatchEvent(
        new globalThis.KeyboardEvent("keydown", {
          key: event.key,
          code: event.code,
          shiftKey: event.shiftKey,
          ctrlKey: event.ctrlKey,
          metaKey: event.metaKey,
          altKey: event.altKey,
          bubbles: true,
          cancelable: true,
        }),
      );
    },
    [firstField],
  );
  const openRef = useRef(openRecord);
  const handOverKeyRef = useRef(handOverKey);
  useEffect(() => {
    openRef.current = openRecord;
    handOverKeyRef.current = handOverKey;
  });

  // The group label sits in the grouping column, or in the first data column shown when that one is hidden.
  const visibleFields = columns
    .map((column) => column.field)
    .filter((field) => columnVisibility[field] !== false);
  const groupLabelField =
    groupColumn && visibleFields.includes(groupColumn.field) ? groupColumn.field : visibleFields[0];
  // The group's row count sits in the next column shown, so the label keeps its column's whole width.
  const groupCountField =
    visibleFields[visibleFields.indexOf(groupLabelField as FieldKey) + 1] ?? groupLabelField;

  const columnDefs = useMemo(
    () => [
      helper.display({
        id: ROW_NUMBER_ID,
        header: GRID_COPY.rowNumberHeader,
        size: Math.floor(rowNumberCh * chPx),
        enableHiding: false,
        enableSorting: false,
        enableCellSelection: false,
        cell: (info) => {
          if (isGroup(info.row.original)) return null;
          const n = info.row.original.rowNumber;
          return (
            <span
              data-slot="row-number"
              data-row-number={n}
              className="text-muted-foreground tabular-nums"
            >
              {n}
            </span>
          );
        },
        meta: {
          headerTitle: GRID_COPY.rowNumberLabel,
          headerClassName: "text-right",
          cellClassName: "text-right",
        },
      }),
      ...columns.map((column, index) =>
        helper.accessor((row: TableRow) => row[column.field], {
          id: column.field,
          header: headers[index],
          size: Math.floor((widths[index] ?? column.widthCh) * chPx),
          // The first column names the row (the unit code) and always stays; any other may be hidden.
          enableHiding: index !== 0,
          // Filters are the region's own rules (grid-view.ts); the table runs none of its own.
          filterFn: () => true,
          cell: (info) => {
            const row = info.row.original;
            if (row.group) {
              const count = (
                <Badge variant="secondary" size="sm" data-slot="group-count">
                  {GRID_COPY.sheet.groupCount(row.group.count)}
                </Badge>
              );
              if (column.field === groupLabelField) {
                return (
                  <span data-slot="group-label" className="flex min-w-0 items-center gap-1">
                    <DataGridTableRowExpand row={info.row} indent={0} />
                    <span className="truncate font-medium">
                      {row.group.label || GRID_COPY.sheet.groupEmpty}
                    </span>
                    {groupCountField === groupLabelField ? count : null}
                  </span>
                );
              }
              return column.field === groupCountField ? count : null;
            }
            const cell = (
              <TypedCell
                kind={column.kind}
                value={info.getValue()}
                transaction={row.transaction}
                lockedReason={row.locked?.[column.field]}
                editMode={editable ? editModeFor(column.kind) : undefined}
              />
            );
            if (index !== 0 || !opensRecord) return cell;
            const id = row.id;
            return (
              // The negative margin keeps the row at the grid's density height: the button is taller than the text.
              // It may not grow past its cell: a long value is cut like every other text cell (row 6, sent).
              <span className="-my-1 inline-flex max-w-full min-w-0">
                <Button
                  variant="link"
                  size="sm"
                  className="w-full"
                  data-record-open={id}
                  // The unit code is the row's open door: one click opens it (the grid's two-step press for controls
                  // in a cell does not apply); the rest of the cell selects like a sheet. Keys belong to the grid.
                  data-cell-interactive=""
                  tabIndex={-1}
                  onClick={() => openRef.current?.(id)}
                  onKeyDown={(event) => handOverKeyRef.current(id, event)}
                >
                  {cell}
                </Button>
              </span>
            );
          },
          meta: {
            headerTitle: column.header,
            headerClassName: column.align === "right" ? "text-right" : "text-left",
            cellClassName: column.align === "right" ? "text-right" : "text-left",
            // A copy carries the words the cell shows; nothing in the grid is written from here (rows 4, 5 edit).
            cellEdit: {
              editable: false,
              format: (value: unknown, row: TableRow) =>
                row.group
                  ? column.field === groupLabelField
                    ? row.group.label
                    : ""
                  : cellText(column.kind, value, row.transaction),
            },
          },
        }),
      ),
      ...(rowActions
        ? [
            helper.display({
              id: ROW_ACTIONS_ID,
              header: () => <span className="sr-only">{GRID_COPY.rowActions.column}</span>,
              size: Math.floor(ROW_ACTIONS_CH * chPx),
              enableHiding: false,
              enableSorting: false,
              cell: (info) => {
                const row = info.row.original;
                if (isGroup(row)) return null;
                const offer = rowActions(row as GridRow);
                const title = String(
                  cellText(
                    columns[0]?.kind ?? "text",
                    row[firstField as FieldKey],
                    row.transaction,
                  ),
                );
                return (
                  <span data-row-actions-for={row.id} className="-my-1 flex justify-end">
                    <RowActions
                      actions={offer.actions}
                      mine={offer.mine}
                      title={title}
                      run={removing.run}
                      inGrid
                    />
                  </span>
                );
              },
              meta: {
                headerTitle: GRID_COPY.rowActions.column,
                headerClassName: "text-right",
                cellClassName: "text-right",
                cellEdit: { editable: false, format: () => "" },
              },
            }),
          ]
        : []),
    ],
    [
      rowActions,
      removing.run,
      firstField,
      columns,
      chPx,
      editable,
      opensRecord,
      widths,
      rowNumberCh,
      headers,
      groupLabelField,
      groupCountField,
    ],
  );

  // Frozen columns: the row numbers and the first columns at the start, the row actions at the end. Pinning is the
  // person's to change (the header menu); the row actions always stay last. On a narrow region with row actions the
  // two pinned sides would cover each other (a phone), so only the row numbers and the first column stay frozen there.
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>(() => ({
    start: [ROW_NUMBER_ID, ...columns.slice(0, FROZEN_COLUMNS).map((column) => column.field)],
    end: [],
  }));
  const pinnedCh =
    rowNumberCh + widths.slice(0, FROZEN_COLUMNS).reduce((sum, w) => sum + w, 0) + ROW_ACTIONS_CH;
  const pinnedTooWide =
    rowActions !== undefined && widthCh !== null && pinnedCh > widthCh * PINNED_SHARE;
  const shownPinning: ColumnPinningState = {
    start: pinnedTooWide
      ? (columnPinning.start ?? []).filter((id) => id === ROW_NUMBER_ID || id === firstField)
      : (columnPinning.start ?? []),
    end: rowActions
      ? [...(columnPinning.end ?? []).filter((id) => id !== ROW_ACTIONS_ID), ROW_ACTIONS_ID]
      : (columnPinning.end ?? []),
  };

  const table = useTable({
    features: dataGridFeatures,
    data,
    columns: columnDefs,
    getRowId: (row: TableRow) => row.id,
    getSubRows: (row: TableRow) => row.subRows,
    // Filters, sort and groups are the region's own pure rules (grid-view.ts); the table only shows their result.
    manualSorting: true,
    manualFiltering: true,
    autoResetExpanded: false,
    state: { sorting, columnFilters, columnVisibility, expanded, columnPinning: shownPinning },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnPinningChange: setColumnPinning,
    onExpandedChange: setExpanded,
    // One continuous run: every row is on the single page, the virtual body mounts only the rows in view.
    initialState: {
      pagination: { pageIndex: 0, pageSize: Number.MAX_SAFE_INTEGER },
    },
  });
  useEffect(() => {
    selectCellRef.current = (id) => {
      if (firstField && table.setFocusedCell) table.setFocusedCell(id, firstField);
    };
  });

  // The grid scrolls inside its own viewport; keyboard users must be able to reach and scroll it (WCAG 2.1.1). With cell
  // selection the grid table itself is the one keyboard stop, from the server HTML on (ReUI renders it focusable): focus
  // on the table is what moves the selected cell. ReUI's scroll area takes no props for its viewport, so the region
  // names the viewport and the table once the page runs.
  useEffect(() => {
    const viewport = boxRef.current?.querySelector<HTMLElement>(
      '[data-slot="scroll-area-viewport"]',
    );
    if (!viewport) return;
    viewport.setAttribute("role", "region");
    viewport.setAttribute("aria-label", title);
    viewport.querySelector('table[data-slot="data-grid-table"]')?.setAttribute("aria-label", title);
    // Frozen columns and the sticky header never cover the selected cell (design/behaviors.md, focus): the browser
    // scrolls a cell into view past them, as far as the frozen columns are wide and the header is tall.
    const scrollingBox =
      viewport.querySelector<HTMLElement>('[data-slot="data-grid-table-viewport"]') ?? viewport;
    const frozen = [...viewport.querySelectorAll<HTMLElement>("thead th[data-pinned]")];
    const frozenWidth = frozen.reduce((sum, th) => sum + th.getBoundingClientRect().width, 0);
    const headHeight = viewport.querySelector("thead")?.getBoundingClientRect().height ?? 0;
    for (const box of new Set([scrollingBox, viewport])) {
      box.style.scrollPaddingLeft = `${Math.round(frozenWidth)}px`;
      box.style.scrollPaddingTop = `${Math.round(headHeight)}px`;
    }
  });

  // Enter on a selected cell opens its row, the region's one «open row» door (the record panel of row 3); on a row's
  // «…» cell it opens that row's menu instead (row 9e).
  const onGridKeyDownCapture = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Enter" || event.shiftKey || event.altKey || event.metaKey || event.ctrlKey)
      return;
    const focused = table.getFocusedCell?.();
    const id = focused?.row.id;
    if (!id || id.startsWith(GROUP_ID_PREFIX)) return;
    if (focused?.column.id === ROW_ACTIONS_ID) {
      const trigger = document.querySelector<HTMLElement>(
        `[data-row-actions-for="${CSS.escape(id)}"] [data-slot="row-actions"]`,
      );
      if (!trigger) return;
      event.preventDefault();
      event.stopPropagation();
      trigger.click();
      return;
    }
    if (!opensRecord) return;
    event.preventDefault();
    event.stopPropagation();
    openRef.current?.(id);
  };

  const onSelection = useCallback((snapshot: DataGridCellSelectionSnapshot) => {
    setSelectedCells(snapshot.visibleCellCount);
  }, []);

  const clearFilters = () => {
    setQuery("");
    setColumnFilters([]);
  };
  const narrowed = query.trim() !== "" || activeFilterCount > 0;

  const showsRows = headerShowsRows(status);
  const gridShown =
    status !== "forbidden" && status !== "loading" && status !== "error" && rows.length > 0;
  // The region's own button, and in full screen the page head's main button too (the page head is hidden there).
  const shownHeadAction = fullScreen ? headAction : undefined;
  const shownAction = action?.allowed ? action.node : undefined;
  const toolbarAction =
    status === "forbidden" || (!shownHeadAction && !shownAction) ? undefined : (
      <>
        {shownHeadAction}
        {shownAction}
      </>
    );
  // The toolbar sits inside the grid when the grid shows, so its sheet tools reach the grid's table.
  const toolbar = (tools: ReactNode) => (
    <RegionToolbar
      total={showsRows ? rows.length : undefined}
      shown={showsRows && narrowed ? shown.length : undefined}
      query={query}
      onQuery={setQuery}
      tools={tools}
      action={toolbarAction}
      searchId={searchId}
    />
  );
  const sheetTools =
    showsRows && rows.length > 0 ? (
      <div data-slot="sheet-tools" className="flex flex-wrap items-center gap-2">
        <Button
          variant={filterRowOpen ? "secondary" : "outline"}
          size="sm"
          aria-pressed={filterRowOpen}
          data-slot="filter-toggle"
          onClick={() => setFilterRowOpen((open) => !open)}
        >
          <FilterIcon aria-hidden="true" />
          {activeFilterCount > 0
            ? GRID_COPY.sheet.filterOn(activeFilterCount)
            : GRID_COPY.sheet.filter}
        </Button>
        {/* With no row left the body offers «Xoá lọc» itself; one button, not two. */}
        {narrowed && shown.length > 0 ? (
          <Button variant="ghost" size="sm" data-slot="clear-filters" onClick={clearFilters}>
            {GRID_COPY.sheet.clearFilters}
          </Button>
        ) : null}
        {groupColumn ? (
          <Button
            variant={isGrouped ? "secondary" : "outline"}
            size="sm"
            aria-pressed={isGrouped}
            data-slot="group-toggle"
            onClick={() => {
              setGrouped((on) => !on);
              setExpanded(true);
            }}
          >
            <ListTreeIcon aria-hidden="true" />
            {GRID_COPY.sheet.groupBy(groupColumn.header)}
          </Button>
        ) : null}
        <DataGridColumnVisibility
          table={table}
          trigger={
            <Button variant="outline" size="sm" data-slot="columns-toggle">
              <Columns3Icon aria-hidden="true" />
              {GRID_COPY.sheet.columns}
            </Button>
          }
        />
        {/* From 768px only: on a phone the toolbar wraps and the phone has no full screen of its own (row 2b). */}
        {canFullScreen ? (
          <span className="hidden md:contents">
            <Button
              variant={fullScreen ? "secondary" : "outline"}
              size="sm"
              aria-pressed={fullScreen}
              ref={fullScreenButtonRef}
              data-slot="full-screen-toggle"
              onClick={toggleFullScreen}
            >
              {fullScreen ? (
                <Minimize2Icon aria-hidden="true" />
              ) : (
                <Maximize2Icon aria-hidden="true" />
              )}
              {fullScreen ? GRID_COPY.sheet.leaveFullScreen : GRID_COPY.sheet.fullScreen}
            </Button>
          </span>
        ) : null}
      </div>
    ) : null;
  let body: ReactNode;
  if (status === "forbidden") body = <RegionForbidden />;
  else if (status === "loading")
    body = <RegionLoading columns={columns.length} onCancel={onCancel} />;
  else if (status === "error") body = <RegionError onRetry={onRetry} />;
  else if (status === "partial" && rows.length === 0)
    body = <RegionPartialEmpty onRetry={onRetry} />;
  else if (rows.length === 0) body = <RegionEmpty why={emptyWhy} action={emptyAction} />;
  else
    body = (
      <DataGrid
        table={table}
        recordCount={shown.length}
        i18n={GRID_I18N}
        // A filter that leaves no row keeps the toolbar, the search box and the filter row where they are (row 2c,
        // Ngoài-4 of 2a): only the table's body says so, and each rule can still be mended on its own.
        emptyMessage={<RegionNoMatch onClear={clearFilters} />}
        onCellSelectionChange={onSelection}
        tableLayout={{
          headerSticky: true,
          headerBackground: true,
          cellBorder: true,
          columnsPinnable: true,
          width: "fixed",
          dense: density === "dense",
          cellSelection: true,
        }}
        tableClassNames={{ bodyRow: DENSITY_ROW_CLASS[density] }}
      >
        {/* Keyed with the virtual body below: the selection binds its keys to the body's viewport once, so a body
            started again (a density switch) must bind them again. */}
        <DataGridCellSelection key={density} apiRef={selectionApi} />
        <div className="p-3 empty:hidden">{toolbar(sheetTools)}</div>
        <DataGridContainer>
          <DataGridScrollArea className={`${VIEWPORT_HEIGHT_CLASS} ${FULL_SCREEN_HEIGHT_CLASS}`}>
            {/* Keyed by density: the virtual body keeps the estimate it started with for rows it has not measured, so a
                switch from normal to dense rows must start it again or the run's height (and its last rows) go wrong. */}
            <div data-slot="data-region-scroll-content" onKeyDownCapture={onGridKeyDownCapture}>
              <DataGridTableVirtual key={density} estimateSize={ROW_HEIGHT_PX[density]} />
            </div>
          </DataGridScrollArea>
        </DataGridContainer>
        <div
          data-slot="region-footer"
          className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-t px-3 py-2"
        >
          <span data-slot="region-footer-count" className="text-sm text-muted-foreground">
            {narrowed
              ? GRID_COPY.filteredCount(shown.length, rows.length)
              : GRID_COPY.rowCount(rows.length)}
          </span>
          {selectedCells > 0 ? (
            <span data-slot="region-selection" className="text-sm text-muted-foreground">
              {GRID_COPY.sheet.selected(selectedCells)} · {GRID_COPY.sheet.copyHint}
            </span>
          ) : null}
        </div>
      </DataGrid>
    );

  return (
    <>
      {/* The record panel floats over the right of the work area, from just under the App Shell's top bar to the
          bottom of the screen (decision 0024, «Trừ thanh trên»); the rows on its left stay usable. It sits outside the
          region's frame, whose panel clips its overflow (an accessibility scan would read the panel's top as cut off),
          and right before the region in page order, so Tab from the record goes into the region (AC-6 of row 3). Full
          screen covers the whole page, so the panel stays in view there too. */}
      {removing.dialog}
      {record && showsRows ? (
        record.address ? (
          <PanelFor
            rows={rows}
            ids={readingIds}
            record={record}
            openId={record.address.openId}
            navigate={record.address.navigate}
            returnFocus={returnFocusToCell}
          />
        ) : (
          <AddressedPanel
            rows={rows}
            ids={readingIds}
            record={record}
            onReady={onAddressReady}
            returnFocus={returnFocusToCell}
          />
        )
      ) : null}
      <section
        data-slot="data-region"
        data-full-screen={fullScreen || undefined}
        style={REGION_HEIGHTS}
        className="group/region flex min-w-0 flex-col bg-background"
      >
        <span ref={chRef} aria-hidden="true" className="invisible absolute text-base">
          0
        </span>
        <span ref={denseChRef} aria-hidden="true" className="invisible absolute text-sm">
          0
        </span>
        {/* Arrangement after data-grid-editing-6: name on the frame's header strip; toolbar, table and pages in one panel. */}
        <Frame className="min-w-0">
          <FrameHeader>
            <RegionTitle title={title} />
          </FrameHeader>
          <FramePanel className="flex min-w-0 flex-col gap-3 p-0">
            {gridShown ? null : <div className="px-3 pt-3 empty:hidden">{toolbar(null)}</div>}
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
      </section>
    </>
  );
}

export { GRID_COPY };
