// A whole file marked (row 11, nhap-excel): the column matches, a mark for every cell, the rows that become listings,
// the cells kept as written, the counts, and the questions grouped by spelling — one question for every cell of one
// column written the same way, one for each code that names several units, one for the codes the catalog lacks.
import { fold } from "@/modules/company-config";

import {
  markUnit,
  markValue,
  matchColumns,
  valueKey,
  type CellMark,
  type Choices,
  type ColumnMatch,
  type LayerView,
  type Mark,
  type UnitFound,
} from "./mark";
import { DESTINATION, type Target } from "./targets";

export type Question =
  | { kind: "column"; column: number; header: string; why: string }
  | { kind: "value"; key: string; column: number; raw: string; cells: number; why: string }
  | { kind: "unit-many"; code: string; unitKeys: string[]; cells: number }
  | { kind: "unit-missing"; codes: string[]; cells: number };

export interface RowOutcome {
  /** create: becomes a listing · listed: the unit already has an open listing (Hỏi-6) · skipped · blocked */
  fate: "create" | "listed" | "skipped" | "blocked";
  unit: { unitKey: string } | { pendingUnitId: string } | { newPending: string } | null;
}

export interface MarkedTable {
  columns: ColumnMatch[];
  cells: CellMark[][];
  rows: RowOutcome[];
  counts: Record<Mark, number>;
  createCount: number;
  /** Cells kept as written on the import's record: exactly keptCellsOf, the rule the write stores. */
  keptCount: number;
  /** Rows that make no listing because their unit code names several units and nobody chose one. */
  notCreatedCount: number;
  canApply: boolean;
  questions: Question[];
}

export interface TableInput {
  headers: readonly string[];
  rows: readonly (readonly string[])[];
}

export interface TableContext {
  layer: LayerView;
  today: string;
  /** What the server found for each unit code, keyed by fold(code). */
  units: ReadonlyMap<string, UnitFound>;
  /** Units (catalog unit keys or pending unit ids) that already have an open listing in the company. */
  listed: ReadonlySet<string>;
}

const unitColumn = (columns: readonly ColumnMatch[]) =>
  columns.find((c) => c.target && "standard" in c.target && c.target.standard === "unitCode")
    ?.index ?? -1;

/** Mark a whole table. Same input, same output, on the screen and on the server. */
export function markTable(table: TableInput, ctx: TableContext, choices: Choices): MarkedTable {
  const columns = matchColumns(table.headers, ctx.layer, choices);
  const unitAt = unitColumn(columns);
  const seen = new Set<string>();
  const cells: CellMark[][] = [];
  const rows: RowOutcome[] = [];
  table.rows.forEach((raw, r) => {
    if (choices.skipRows?.includes(r)) {
      cells.push(columns.map(() => ({ mark: "keep", value: null, why: "row-skipped" })));
      rows.push({ fate: "skipped", unit: null });
      return;
    }
    const row: CellMark[] = columns.map((c) => {
      const text = raw[c.index] ?? "";
      if (c.mark === "block") return { mark: "block", value: null, why: c.why };
      if (!c.target)
        return text.trim() === ""
          ? { mark: "keep", value: null, why: "empty" }
          : { mark: "ask", value: null, why: c.why };
      if (c.index === unitAt)
        return markUnit(text, ctx.units.get(fold(text)), choices.units[fold(text)]);
      return markValue(c.target as Target, text, {
        layer: ctx.layer,
        today: ctx.today,
        choice: choices.values[valueKey(c.index, text)],
      });
    });
    // Withdrawn needs a reason (row 4 statusNeeds): without a reason cell the status cell asks.
    const at = (t: string) =>
      columns.findIndex((c) => c.target && "standard" in c.target && c.target.standard === t);
    const statusAt = at("Listing.standardStatus");
    const reasonAt = at("Listing.withdrawnReason");
    const status = statusAt >= 0 ? row[statusAt] : undefined;
    if (status && status.value === "Withdrawn" && (reasonAt < 0 || row[reasonAt]!.value === null))
      row[statusAt] = { mark: "ask", value: null, why: "status-needs" };
    let fate: RowOutcome["fate"] = "create";
    let unit: RowOutcome["unit"] = null;
    if (unitAt >= 0) {
      const code = raw[unitAt] ?? "";
      const u = row[unitAt]!;
      const found = ctx.units.get(fold(code));
      if (u.why === "row-skipped") fate = "skipped";
      else if (u.why === "not-in-catalog" || u.why === "pending-new")
        unit = { newPending: code.trim() };
      else if (u.why === "pending" && typeof u.value === "string")
        unit = { pendingUnitId: u.value };
      else if (typeof u.value === "string" && found?.kind === "catalog")
        unit = { unitKey: u.value };
      const id =
        unit &&
        ("unitKey" in unit
          ? unit.unitKey
          : "pendingUnitId" in unit
            ? unit.pendingUnitId
            : `new:${fold(unit.newPending)}`);
      if (fate === "create" && id) {
        if (seen.has(id)) row[unitAt] = { mark: "block", value: null, why: "duplicate-unit" };
        else if (ctx.listed.has(id)) {
          fate = "listed";
          for (let i = 0; i < row.length; i += 1)
            if (i !== unitAt && (raw[i] ?? "").trim() !== "")
              row[i] = { mark: "ask", value: null, why: "already-listed" };
          row[unitAt] = { mark: "ask", value: u.value, why: "already-listed" };
        }
        seen.add(id);
      }
    }
    if (row.some((c) => c.mark === "block")) fate = fate === "skipped" ? "skipped" : "blocked";
    if (fate === "create" && !unit) fate = "blocked";
    cells.push(row);
    rows.push({ fate, unit });
  });
  const counts: Record<Mark, number> = { keep: 0, fixed: 0, ask: 0, block: 0 };
  for (const r of cells) for (const c of r) counts[c.mark] += 1;
  const keptCount = keptCellsOf({ columns, cells, rows }, table.rows).length;
  return {
    columns,
    cells,
    rows,
    counts,
    createCount: rows.filter((r) => r.fate === "create").length,
    keptCount,
    notCreatedCount: rows.filter((r, i) => notCreated(r, cells[i]!)).length,
    canApply: counts.block === 0 && rows.some((r) => r.fate === "create"),
    questions: questionsOf(table, columns, cells, unitAt, ctx),
  };
}

/** A row the write leaves out because its unit is unresolved (a code naming several units, unanswered). */
const notCreated = (row: RowOutcome, cells: readonly CellMark[]) =>
  row.fate === "blocked" && !cells.some((c) => c.mark === "block");

/** The tower text a pending unit holds; a longer one is also kept whole as written. */
const PENDING_BUILDING_LIMIT = 80;

/**
 * Every cell an import keeps as written on its record, by row and column, with its reason: the one rule the preview
 * counts («N ô giữ chữ gốc») and the write stores (store.ts writeBatch), so the two cannot drift (VP11 S4-r2 item 9,
 * ruling G-2811-84). A dropped column is never kept. A row left out because its unit is unresolved keeps every other cell
 * with text, its unit code too. Any
 * other row keeps the cells that ask a person (its unit code aside: that is the row's unit), every cell whose target has
 * no place on the listing (DESTINATION «kept»), and its tower text unless that goes onto the new pending unit it makes.
 */
export function keptCellsOf(
  table: Pick<MarkedTable, "columns" | "cells" | "rows">,
  raw: readonly (readonly string[])[],
): { row: number; col: number; why: string }[] {
  const unitAt = unitColumn(table.columns);
  const out: { row: number; col: number; why: string }[] = [];
  table.rows.forEach((row, r) => {
    const cells = table.cells[r]!;
    const left = notCreated(row, cells);
    table.columns.forEach((col, j) => {
      const text = raw[r]?.[j] ?? "";
      if (text.trim() === "") return;
      // A column the person dropped is never kept, on any row: the owner's name and phone can only be dropped
      // (Hỏi-12), and the personal-data rule keeps them off the record (S4-r10 t5).
      if (col.target && "skip" in col.target) return;
      const cell = cells[j]!;
      const why = (w: string) => out.push({ row: r, col: j, why: w });
      if (left) return why(cell.mark === "ask" ? cell.why : "row-not-created");
      if (j === unitAt) return;
      const t = col.target;
      const place = t && "standard" in t ? DESTINATION[t.standard] : null;
      if (place && "kept" in place) return why(place.kept);
      if (place && "unit" in place && place.unit === "building") {
        if (cell.mark === "ask") return why(cell.why);
        const onPending =
          row.fate === "create" &&
          row.unit !== null &&
          "newPending" in row.unit &&
          text.trim().length <= PENDING_BUILDING_LIMIT;
        return onPending ? undefined : why("unit-attribute");
      }
      if (cell.mark === "ask") why(cell.why);
    });
  });
  return out;
}

/** Questions grouped: per column, per (column, folded spelling), per code naming several units, one for missing codes. */
export function questionsOf(
  table: TableInput,
  columns: readonly ColumnMatch[],
  cells: readonly (readonly CellMark[])[],
  unitAt: number,
  ctx: TableContext,
): Question[] {
  const out: Question[] = [];
  for (const c of columns)
    if (c.mark === "ask" || c.mark === "block")
      out.push({ kind: "column", column: c.index, header: c.header, why: c.why });
  const values = new Map<string, Extract<Question, { kind: "value" }>>();
  const many = new Map<string, Extract<Question, { kind: "unit-many" }>>();
  const missing = { codes: [] as string[], cells: 0 };
  cells.forEach((row, r) =>
    row.forEach((cell, j) => {
      if (cell.mark !== "ask" || (columns[j]!.mark !== "keep" && columns[j]!.mark !== "fixed"))
        return;
      const raw = table.rows[r]![j] ?? "";
      if (j === unitAt) {
        const found = ctx.units.get(fold(raw));
        if (cell.why === "many-units" && found?.kind === "catalog") {
          const q = many.get(fold(raw)) ?? {
            kind: "unit-many",
            code: raw.trim(),
            unitKeys: found.unitKeys,
            cells: 0,
          };
          q.cells += 1;
          many.set(fold(raw), q);
        } else if (cell.why === "not-in-catalog") {
          if (!missing.codes.includes(raw.trim())) missing.codes.push(raw.trim());
          missing.cells += 1;
        }
        return;
      }
      if (cell.why === "already-listed") return;
      const key = `${j}|${fold(raw)}`;
      const q = values.get(key) ?? {
        kind: "value",
        key,
        column: j,
        raw: raw.trim(),
        cells: 0,
        why: cell.why,
      };
      q.cells += 1;
      values.set(key, q);
    }),
  );
  out.push(...values.values(), ...many.values());
  if (missing.codes.length > 0) out.push({ kind: "unit-missing", ...missing });
  return out;
}
