// Column rules of the shared grid, by display kind (design/behaviors.md: column align, column width, table density).
// A screen declares a column by field name; the kind comes from the generated ontology table, never from the screen.
import { FIELD_DISPLAY, RIGHT_ALIGNED_KINDS, type DisplayKind } from "@/generated/display";

/** A field of the business model, whose kind comes from the generated ontology table. */
export type StandardFieldKey = keyof typeof FIELD_DISPLAY;
/** A company's own field (row 7e): its value sits under `custom.<code>` and its kind comes from the field itself. */
export type CustomFieldKey = `custom.${string}`;
export type FieldKey = StandardFieldKey | CustomFieldKey;
export type Align = "left" | "right";
export type Density = "dense" | "normal";

/**
 * Length in characters of the longest value a kind typically shows, from the 1a formatters: «999,99 tỷ»,
 * «9.999,99 m²», «99.999», «05/11/2026», «14:30 05/11/2026», «0900 000 001», the longest status label, «Không».
 * Text kinds have a reading length instead of a format.
 */
export const KIND_SAMPLE_LENGTH: Readonly<Record<DisplayKind, number>> = {
  money: 9,
  area: 11,
  count: 6,
  date: 10,
  datetime: 16,
  phone: 12,
  status: 14,
  boolean: 5,
  text: 16,
  person: 20,
  select: 14,
};

/** One character of padding on each side of the cell. */
export const CELL_PADDING_CH = 2;

export function kindOf(field: StandardFieldKey): DisplayKind {
  return FIELD_DISPLAY[field];
}

export function alignFor(kind: DisplayKind): Align {
  return RIGHT_ALIGNED_KINDS.includes(kind) ? "right" : "left";
}

/** `max(label length, sample length of the kind) × 1ch + padding on both sides`, in ch. */
export function columnWidthCh(header: string, kind: DisplayKind): number {
  return Math.max(header.length, KIND_SAMPLE_LENGTH[kind]) + CELL_PADDING_CH;
}

/** Kinds whose width follows the longest text the region really holds, up to the kind's reading length. */
export const CONTENT_WIDTH_KINDS: readonly DisplayKind[] = ["text", "person"];

/**
 * One more character on a fitted column: the cell's real padding (12px a side at normal density) is wider than the
 * 1ch a side the rule counts, and digits and letters are not all one `ch` wide, so an exact fit would cut the value.
 */
export const FIT_SLACK_CH = 1;

/**
 * Width of a column on the rows a region really holds: text kinds take `max(label length, min(reading length,
 * longest value)) + padding + one character of slack`, so a 4-character unit code does not take the room of a project name; other kinds keep
 * the kind's sample length (columnWidthCh). A text column with no value at all keeps the reading length.
 */
export function fittedWidthCh(column: TypedColumn, values: readonly unknown[]): number {
  if (!CONTENT_WIDTH_KINDS.includes(column.kind)) return column.widthCh;
  const lengths = values
    .filter((v) => v !== null && v !== undefined && v !== "")
    .map((v) => String(v).length);
  if (lengths.length === 0) return column.widthCh;
  const longest = Math.min(KIND_SAMPLE_LENGTH[column.kind], Math.max(...lengths));
  return Math.max(column.header.length, longest) + CELL_PADDING_CH + FIT_SLACK_CH;
}

/** What a text column would take to show its longest value whole: label or longest value, padding, slack. */
export function fullWidthCh(column: TypedColumn, values: readonly unknown[]): number {
  const fitted = fittedWidthCh(column, values);
  if (!CONTENT_WIDTH_KINDS.includes(column.kind)) return fitted;
  const lengths = values
    .filter((v) => v !== null && v !== undefined && v !== "")
    .map((v) => String(v).length);
  if (lengths.length === 0) return fitted;
  return Math.max(fitted, Math.max(...lengths) + CELL_PADDING_CH + FIT_SLACK_CH);
}

/**
 * Hands the room a grid has to spare to the columns that cut their text, in order, each up to what shows its longest
 * value whole. A grid with no room to spare keeps the fitted widths, so nothing is cut that was not cut before.
 */
export function spreadSpareCh(
  fitted: readonly number[],
  full: readonly number[],
  containerCh: number | null,
): number[] {
  const widths = [...fitted];
  if (containerCh === null) return widths;
  let spare = Math.floor(containerCh - widths.reduce((sum, w) => sum + w, 0));
  for (let i = 0; i < widths.length && spare > 0; i += 1) {
    const grow = Math.min(spare, Math.max(0, (full[i] ?? 0) - (widths[i] ?? 0)));
    widths[i] = (widths[i] ?? 0) + grow;
    spare -= grow;
  }
  return widths;
}

/** Dense only when the columns' minimum width is wider than the content area. */
export function densityFor(totalMinCh: number, containerCh: number): Density {
  return totalMinCh > containerCh ? "dense" : "normal";
}

export const DENSITY_ROW_CLASS: Readonly<Record<Density, string>> = {
  dense: "h-8 text-sm",
  normal: "h-12 text-base",
};

/** What a screen may say about a column: the field and its header text. Nothing about kind, align or width. */
export interface TypedColumnSpec {
  field: StandardFieldKey;
  header: string;
}

export interface TypedColumn {
  field: FieldKey;
  header: string;
  kind: DisplayKind;
  align: Align;
  widthCh: number;
}

export function typedColumn(spec: TypedColumnSpec): TypedColumn {
  const kind = kindOf(spec.field);
  return {
    field: spec.field,
    header: spec.header,
    kind,
    align: alignFor(kind),
    widthCh: columnWidthCh(spec.header, kind),
  };
}

/**
 * A column the generated ontology table does not have (row 7e): a company's own field, or a value a screen works out
 * from a record. The field key is `custom.<code>` and the screen names the kind (for a company's field,
 * company-config's columnKindOf). Align and width follow the same rules as any column.
 */
export function customColumn(spec: {
  code: string;
  header: string;
  kind: DisplayKind;
}): TypedColumn {
  return {
    field: `custom.${spec.code}`,
    header: spec.header,
    kind: spec.kind,
    align: alignFor(spec.kind),
    widthCh: columnWidthCh(spec.header, spec.kind),
  };
}

/** Where a value of each kind is edited (design/behaviors.md, edit data): in the cell, or in the record panel. */
export type EditMode = "cell" | "panel";

export const IN_CELL_KINDS: readonly DisplayKind[] = [
  "money",
  "count",
  "text",
  "select",
  "boolean",
  "date",
];

export function editModeFor(kind: DisplayKind): EditMode {
  return IN_CELL_KINDS.includes(kind) ? "cell" : "panel";
}

/** Kinds the search box reads: words, not numbers or dates. */
export const SEARCHABLE_KINDS: readonly DisplayKind[] = ["text", "person", "select"];
