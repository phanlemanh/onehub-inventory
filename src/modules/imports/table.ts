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
import type { Target } from "./targets";

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
  keptCount: number;
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
  const keptCount = cells.reduce(
    (n, r, i) =>
      n +
      r.filter((c, j) => c.mark === "ask" && !(j === unitAt && rows[i]!.fate === "create")).length,
    0,
  );
  return {
    columns,
    cells,
    rows,
    counts,
    createCount: rows.filter((r) => r.fate === "create").length,
    keptCount,
    canApply: counts.block === 0 && rows.some((r) => r.fate === "create"),
    questions: questionsOf(table, columns, cells, unitAt, ctx),
  };
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
