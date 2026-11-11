// Column rules of the shared grid, by display kind (design/behaviors.md: column align, column width, table density).
// A screen declares a column by field name; the kind comes from the generated ontology table, never from the screen.
import { FIELD_DISPLAY, RIGHT_ALIGNED_KINDS, type DisplayKind } from "@/generated/display";

export type FieldKey = keyof typeof FIELD_DISPLAY;
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

export function kindOf(field: FieldKey): DisplayKind {
  return FIELD_DISPLAY[field];
}

export function alignFor(kind: DisplayKind): Align {
  return RIGHT_ALIGNED_KINDS.includes(kind) ? "right" : "left";
}

/** `max(label length, sample length of the kind) × 1ch + padding on both sides`, in ch. */
export function columnWidthCh(header: string, kind: DisplayKind): number {
  return Math.max(header.length, KIND_SAMPLE_LENGTH[kind]) + CELL_PADDING_CH;
}

/** Dense only when the columns' minimum width is wider than the content area. */
export function densityFor(totalMinCh: number, containerCh: number): Density {
  return totalMinCh > containerCh ? "dense" : "normal";
}

export const DENSITY_ROW_CLASS: Readonly<Record<Density, string>> = {
  dense: "h-10 text-sm",
  normal: "h-12 text-base",
};

/** What a screen may say about a column: the field and its header text. Nothing about kind, align or width. */
export interface TypedColumnSpec {
  field: FieldKey;
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
