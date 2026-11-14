// Pure view rules of the shared grid, used by hand like a sheet (roadmap row 2a, _acceptance/bang-hang-dung-tay-nhu-sheet):
// one filter per column by its display kind, sort by one column, group rows under one field, number rows on through
// the groups, and the text a copied cell carries. No React, no network: the region runs them on the rows it holds.
import type { DisplayKind } from "@/generated/display";
import type { ListingStandardStatus } from "@/generated/ontology";
import { LABELS } from "@/generated/labels";
import { EMPTY, STATUS_TONE, formatByKind, statusLabel } from "@/lib/format";

import type { FieldKey, TypedColumn } from "./column-kind";
import { GRID_COPY } from "./grid-copy";

/** One grid row as the view rules read it: its id, an optional transaction, and values by field. */
export type ViewRow = {
  id: string;
  transaction?: "sale" | "lease";
} & Partial<Record<FieldKey, unknown>>;

/**
 * Listing statuses in the one order every screen shows them: the order of their labels in ontology/labels.yaml
 * (Quỹ hàng keeps the same order in its core). The App Shell's status shortcuts and the grid's status filter read it.
 */
export const STATUS_ORDER: readonly ListingStandardStatus[] = Object.keys(LABELS)
  .filter((code) => code.startsWith("Status"))
  .map((code) => code.slice("Status".length) as ListingStandardStatus)
  .filter((status) => status in STATUS_TONE);

/** How a column of each kind is filtered: words contain, one of the values, or a number rule. */
export type FilterMode = "text" | "values" | "number";

export function filterModeFor(kind: DisplayKind): FilterMode {
  if (kind === "status" || kind === "select" || kind === "boolean") return "values";
  if (kind === "money" || kind === "area" || kind === "count") return "number";
  if (kind === "date" || kind === "datetime") return "number";
  return "text";
}

/** A date is filtered by the whole days gone since it («>14» means more than two weeks ago), in Vietnam time. */
export function daysSince(value: unknown, now: number): number | null {
  if (value === null || value === undefined || value === "") return null;
  const time = new Date(value as string).getTime();
  if (Number.isNaN(time)) return null;
  const DAY = 86_400_000;
  const VN = 7 * 3_600_000;
  return Math.floor((now + VN) / DAY) - Math.floor((time + VN) / DAY);
}

/** Prices are typed in billions («<=5» means at most 5 tỷ), as on the owner's sheet. */
export const MONEY_FILTER_UNIT = 1_000_000_000;

/** A column's filter: words for text columns, chosen values for value columns, a rule for number columns. */
export type ColumnFilter = string | readonly string[];
export type ColumnFilters = Partial<Record<FieldKey, ColumnFilter>>;

/**
 * Lower case without Vietnamese marks, «đ» read as «d», so «dong» finds «Đông» (row 2e, AC-11). The one way text is
 * compared when a person types to find rows: the column filters here and the top bar's ⌘K box both call it.
 */
export function foldText(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLocaleLowerCase("vi");
}

/** The words a cell shows (and a copy carries): formatted by kind, a status by its label, empty as nothing. */
export function cellText(
  kind: DisplayKind,
  value: unknown,
  transaction?: "sale" | "lease",
): string {
  if (value === null || value === undefined || value === "") return "";
  if (kind === "status") {
    return typeof value === "string" && value in STATUS_TONE
      ? statusLabel(value as ListingStandardStatus, transaction)
      : String(value);
  }
  if (kind === "boolean") return value ? GRID_COPY.yes : GRID_COPY.no;
  if (kind === "text" || kind === "person" || kind === "select") return String(value);
  const shown = formatByKind(kind, value);
  return shown === EMPTY ? "" : shown;
}

type NumberTest = (n: number) => boolean;

function parseNumber(text: string): number | null {
  const cleaned = text.trim().replace(/\s/g, "").replace(",", ".");
  if (!/^-?\d+(\.\d+)?$/.test(cleaned)) return null;
  return Number(cleaned);
}

/**
 * A number rule as a test, or null when the rule is not one: «5» (equal), «>5», «>=5», «<5», «<=5», «!=5», «2-5»
 * or «2..5» (both ends included), several rules joined by «và» (all) or «hoặc» (any). A decimal comma is read as a point.
 */
export function parseNumberRule(rule: string): NumberTest | null {
  const text = rule.trim();
  if (text === "") return null;
  const any = text.split(/\s+hoặc\s+|\s*\|\s*/i);
  if (any.length > 1) {
    const tests = any.map(parseNumberRule);
    return tests.every((t): t is NumberTest => t !== null) ? (n) => tests.some((t) => t(n)) : null;
  }
  const all = text.split(/\s+và\s+|\s*&\s*/i);
  if (all.length > 1) {
    const tests = all.map(parseNumberRule);
    return tests.every((t): t is NumberTest => t !== null) ? (n) => tests.every((t) => t(n)) : null;
  }
  const range = /^(-?\d+(?:[.,]\d+)?)\s*(?:-|\.\.|đến)\s*(-?\d+(?:[.,]\d+)?)$/i.exec(text);
  if (range) {
    const low = parseNumber(range[1] ?? "");
    const high = parseNumber(range[2] ?? "");
    if (low === null || high === null) return null;
    const [a, b] = low <= high ? [low, high] : [high, low];
    return (n) => n >= a && n <= b;
  }
  const compare = /^(>=|<=|!=|<>|>|<|=)?\s*(-?\d+(?:[.,]\d+)?)$/.exec(text);
  if (!compare) return null;
  const value = parseNumber(compare[2] ?? "");
  if (value === null) return null;
  switch (compare[1]) {
    case ">":
      return (n) => n > value;
    case ">=":
      return (n) => n >= value;
    case "<":
      return (n) => n < value;
    case "<=":
      return (n) => n <= value;
    case "!=":
    case "<>":
      return (n) => n !== value;
    default:
      return (n) => n === value;
  }
}

/** True when a filter holds nothing to filter by. */
export function filterIsEmpty(filter: ColumnFilter | undefined): boolean {
  if (filter === undefined) return true;
  return typeof filter === "string" ? filter.trim() === "" : filter.length === 0;
}

/** A number column's rule that cannot be read: the box says so and filters nothing. */
export function filterIsInvalid(column: TypedColumn, filter: ColumnFilter | undefined): boolean {
  if (filterModeFor(column.kind) !== "number" || typeof filter !== "string") return false;
  return filter.trim() !== "" && parseNumberRule(filter) === null;
}

function columnMatches(
  row: ViewRow,
  column: TypedColumn,
  filter: ColumnFilter,
  now: number,
): boolean {
  const value = row[column.field];
  const mode = filterModeFor(column.kind);
  if (mode === "values") {
    const chosen = typeof filter === "string" ? [filter] : filter;
    return chosen.includes(String(value ?? ""));
  }
  if (typeof filter !== "string") return true;
  if (mode === "number") {
    const test = parseNumberRule(filter);
    if (test === null) return true;
    if (column.kind === "date" || column.kind === "datetime") {
      const days = daysSince(value, now);
      return days !== null && test(days);
    }
    if (typeof value !== "number" || Number.isNaN(value)) return false;
    return test(column.kind === "money" ? value / MONEY_FILTER_UNIT : value);
  }
  return foldText(cellText(column.kind, value, row.transaction)).includes(foldText(filter.trim()));
}

/** Rows that pass every column filter, all at once (a sheet's filters stack). */
export function filterRows<R extends ViewRow>(
  rows: readonly R[],
  columns: readonly TypedColumn[],
  filters: ColumnFilters,
  now: number = Date.now(),
): R[] {
  const active = columns.filter((column) => !filterIsEmpty(filters[column.field]));
  return rows.filter((row) =>
    active.every((column) =>
      columnMatches(row, column, filters[column.field] as ColumnFilter, now),
    ),
  );
}

export type SortDirection = "asc" | "desc";
export interface SortBy {
  field: FieldKey;
  direction: SortDirection;
}

const collator = new Intl.Collator("vi", { numeric: true, sensitivity: "base" });

function sortKey(kind: DisplayKind, value: unknown): number | string | null {
  if (value === null || value === undefined || value === "") return null;
  if (kind === "status" && typeof value === "string") {
    const at = STATUS_ORDER.indexOf(value as ListingStandardStatus);
    return at === -1 ? STATUS_ORDER.length : at;
  }
  if (kind === "date" || kind === "datetime") {
    const time = new Date(value as string).getTime();
    return Number.isNaN(time) ? null : time;
  }
  if (typeof value === "number") return value;
  if (typeof value === "boolean") return value ? 1 : 0;
  return String(value);
}

/**
 * Rows sorted by one column; empty cells stay last both ways, statuses follow STATUS_ORDER, text compares like a
 * Vietnamese reader with numbers as numbers («S2» before «S10»). Equal rows keep their order.
 */
export function sortRows<R extends ViewRow>(
  rows: readonly R[],
  columns: readonly TypedColumn[],
  sort: SortBy | null,
): R[] {
  if (sort === null) return [...rows];
  const column = columns.find((c) => c.field === sort.field);
  if (!column) return [...rows];
  const sign = sort.direction === "asc" ? 1 : -1;
  return rows
    .map((row, index) => ({ row, index, key: sortKey(column.kind, row[column.field]) }))
    .sort((a, b) => {
      if (a.key === null || b.key === null) {
        if (a.key === b.key) return a.index - b.index;
        return a.key === null ? 1 : -1;
      }
      const order =
        typeof a.key === "number" && typeof b.key === "number"
          ? a.key - b.key
          : collator.compare(String(a.key), String(b.key));
      return order === 0 ? a.index - b.index : order * sign;
    })
    .map((entry) => entry.row);
}

/** A group of rows under one value of the grouping field, and the rows it holds. */
export interface RowGroup<R> {
  /** Stable id of the group row, distinct from every data row id. */
  id: string;
  /** The value the rows share, as shown («» when the cell is empty). */
  label: string;
  rows: R[];
}

/** Prefix of a group row's id; data row ids never start with it. */
export const GROUP_ID_PREFIX = "nhom:";

/**
 * Rows grouped under one field, groups in reading order (numbers as numbers, the empty group last), rows inside a
 * group in the order given, so a sort applies within each group.
 */
export function groupRows<R extends ViewRow>(
  rows: readonly R[],
  column: TypedColumn,
): RowGroup<R>[] {
  const groups = new Map<string, R[]>();
  for (const row of rows) {
    const label = cellText(column.kind, row[column.field], row.transaction);
    const list = groups.get(label);
    if (list) list.push(row);
    else groups.set(label, [row]);
  }
  return [...groups.entries()]
    .sort(([a], [b]) => {
      if (a === "" || b === "") return a === b ? 0 : a === "" ? 1 : -1;
      return collator.compare(a, b);
    })
    .map(([label, list]) => ({ id: `${GROUP_ID_PREFIX}${label}`, label, rows: list }));
}

/** Row numbers in the order rows are read: one on from the other through every group, group rows have none. */
export function rowNumbers<R extends ViewRow>(
  ordered: readonly R[] | readonly RowGroup<R>[],
): Map<string, number> {
  const numbers = new Map<string, number>();
  let next = 1;
  for (const item of ordered) {
    const list = "rows" in item && "label" in item ? (item as RowGroup<R>).rows : [item as R];
    for (const row of list) numbers.set(row.id, next++);
  }
  return numbers;
}

/**
 * How a person has arranged the grid (row 2c, a saved view): each column's filter, the sort, grouping
 * on or off and the hidden columns. Full screen, the selected cell, open groups and the scroll position are not part of
 * it. A screen may give one to the region to open with and hear each change of it.
 */
export interface GridView {
  filters: ColumnFilters;
  sort: readonly SortBy[];
  grouped: boolean;
  hidden: readonly FieldKey[];
}

export const EMPTY_VIEW: GridView = {
  filters: {},
  sort: [],
  grouped: false,
  hidden: [],
};

/** The filters that filter something, values in a set sorted, so two views that filter alike compare equal. */
function liveFilters(filters: ColumnFilters): [string, string | string[]][] {
  return Object.entries(filters)
    .filter(([, value]) => !filterIsEmpty(value))
    .map(([field, value]): [string, string | string[]] => [
      field,
      typeof value === "string" ? value.trim() : [...(value as readonly string[])].sort(),
    ])
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
}

/**
 * True when two views show the same grid: the same live filters whatever their
 * order, the same sort, grouping and hidden columns (in any order).
 */
export function sameView(a: GridView, b: GridView): boolean {
  if (a.grouped !== b.grouped) return false;
  if (JSON.stringify(liveFilters(a.filters)) !== JSON.stringify(liveFilters(b.filters)))
    return false;
  if (
    a.sort.length !== b.sort.length ||
    a.sort.some((s, i) => s.field !== b.sort[i]?.field || s.direction !== b.sort[i]?.direction)
  )
    return false;
  const hiddenA = [...a.hidden].sort();
  const hiddenB = [...b.hidden].sort();
  return hiddenA.length === hiddenB.length && hiddenA.every((f, i) => f === hiddenB[i]);
}

/**
 * A view kept to the columns the grid has now: a filter, sort or hidden column of a field the grid no longer shows is
 * dropped and the rest opens (design.md, «Hành vi»). The first column names the row and never hides.
 */
export function viewWithin(view: GridView, columns: readonly TypedColumn[]): GridView {
  const fields = new Set<string>(columns.map((c) => c.field));
  const first = columns[0]?.field;
  return {
    filters: Object.fromEntries(
      Object.entries(view.filters).filter(([field]) => fields.has(field)),
    ) as ColumnFilters,
    sort: view.sort.filter((s) => fields.has(s.field)).slice(0, 1),
    grouped: view.grouped,
    hidden: view.hidden.filter((f) => fields.has(f) && f !== first),
  };
}
