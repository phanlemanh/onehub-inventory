// Reading the chosen file in the browser (row 11, nhap-excel; ADR-0011 of Quỹ hàng: the file never reaches the server).
// Out comes a table of strings — header row and data rows — that the preview sends as JSON. Excel numbers come out as
// plain digits (4650000000, 75.2), Excel dates as YYYY-MM-DD, so the value rules read one shape whatever wrote the file.
import readXlsxFile, { InvalidInputError } from "read-excel-file/universal";

import { readCsv } from "./csv";

export const FILE_LIMIT_BYTES = 10 * 1024 * 1024;
export const ROW_LIMIT = 5000;

export type ReadProblem =
  "wrong-type" | "too-big" | "too-many-rows" | "empty" | "header-only" | "broken" | "locked";

export type ReadTable =
  | { ok: true; sheet: string | null; otherSheets: string[]; headers: string[]; rows: string[][] }
  | { ok: false; problem: ReadProblem };

/** An Excel file saved with a password, and the old .xls, are compound files, not zip: they start with these bytes. */
const COMPOUND_FILE = [0xd0, 0xcf, 0x11, 0xe0];

const pad = (n: number) => String(n).padStart(2, "0");

/** One cell as the value rules read it. */
export function cellText(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (value instanceof Date)
    return `${value.getUTCFullYear()}-${pad(value.getUTCMonth() + 1)}-${pad(value.getUTCDate())}`;
  if (typeof value === "number") return Number.isFinite(value) ? String(value) : "";
  if (typeof value === "boolean") return value ? "true" : "false";
  return String(value);
}

const blank = (row: readonly string[]) => row.every((c) => c.trim() === "");

/**
 * Header and rows from raw rows: the header is the first non-empty row; empty rows are left out; a column with no header
 * and no value anywhere is dropped; two columns with the same header stay two columns.
 */
export function tableOf(raw: readonly (readonly string[])[]): {
  headers: string[];
  rows: string[][];
} {
  const rows = raw.map((r) => r.map((c) => c ?? "")).filter((r) => !blank(r));
  const header = rows.shift() ?? [];
  const width = Math.max(header.length, ...rows.map((r) => r.length));
  const keep: number[] = [];
  for (let i = 0; i < width; i += 1) {
    const named = (header[i] ?? "").trim() !== "";
    if (named || rows.some((r) => (r[i] ?? "").trim() !== "")) keep.push(i);
  }
  return {
    headers: keep.map((i) => (header[i] ?? "").trim()),
    rows: rows.map((r) => keep.map((i) => r[i] ?? "")),
  };
}

function finish(
  table: { headers: string[]; rows: string[][] },
  sheet: string | null,
  otherSheets: string[],
): ReadTable {
  if (table.headers.length === 0) return { ok: false, problem: "empty" };
  if (table.rows.length === 0) return { ok: false, problem: "header-only" };
  if (table.rows.length > ROW_LIMIT) return { ok: false, problem: "too-many-rows" };
  return { ok: true, sheet, otherSheets, ...table };
}

/** Read a chosen file into a table of strings, or say why it cannot be read. */
export async function readTable(file: Blob, name: string): Promise<ReadTable> {
  const lower = name.toLowerCase();
  const kind = lower.endsWith(".xlsx") ? "xlsx" : lower.endsWith(".csv") ? "csv" : null;
  if (!kind) return { ok: false, problem: "wrong-type" };
  if (file.size > FILE_LIMIT_BYTES) return { ok: false, problem: "too-big" };
  if (file.size === 0) return { ok: false, problem: "empty" };
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (kind === "csv") {
    const text = new TextDecoder("utf-8").decode(bytes);
    return finish(tableOf(readCsv(text)), null, []);
  }
  if (COMPOUND_FILE.every((b, i) => bytes[i] === b)) return { ok: false, problem: "locked" };
  let sheets: { sheet: string; data: unknown[][] }[];
  try {
    sheets = (await readXlsxFile(bytes.buffer)) as { sheet: string; data: unknown[][] }[];
  } catch (e) {
    if (e instanceof InvalidInputError || e instanceof Error)
      return { ok: false, problem: "broken" };
    throw e;
  }
  const tables = sheets.map((s) => ({
    name: s.sheet,
    table: tableOf(s.data.map((r) => r.map(cellText))),
  }));
  const first = tables.find((t) => t.table.headers.length > 0);
  if (!first) return { ok: false, problem: "empty" };
  return finish(
    first.table,
    first.name,
    tables.filter((t) => t !== first).map((t) => t.name),
  );
}
