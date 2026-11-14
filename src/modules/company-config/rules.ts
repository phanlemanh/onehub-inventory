// Pure rules of the company layer (row 7e, lop-rieng-cua-san; decision 0029). Safe in the browser: no database, no
// session. The database keeps what it can (shapes, lengths, the cap, uniqueness, migration 010); the rules that need
// the business model — folding, value sets, name clashes, value kinds — live here, in exactly one place.
import type { DisplayKind } from "@/generated/display";
import type {
  CustomField,
  ListingStandardStatus,
  ListingWithdrawnReason,
} from "@/generated/ontology";

/** At most this many custom fields in use per company (the database holds it too). */
export const FIELD_LIMIT = 20;
/** A single choice field has 1 to this many options. */
export const OPTION_LIMIT = 30;
/** Longest text value a text custom field takes. */
export const TEXT_VALUE_LIMIT = 500;
/** Longest name of a field and longest words of a label. */
export const NAME_LIMIT = 40;

export type FieldKind = CustomField["kind"];
export const FIELD_KINDS: readonly FieldKind[] = [
  "text",
  "number",
  "date",
  "single_select",
  "boolean",
];

/**
 * The key two spellings share when a person means the same thing: accents and «đ» dropped, lower case, inner spaces
 * collapsed, ends trimmed. «ĐN», « Đn » and «dn» fold to «dn».
 */
export function fold(text: string): string {
  return text
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[đĐ]/g, "d")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

/** What a value check needs to know of a field. */
export interface CustomFieldShape {
  kind: FieldKind;
  options: readonly string[];
  retiredAt?: string | undefined;
}

export type ValueProblem =
  "wrong-kind" | "too-long" | "not-an-option" | "bad-date" | "field-retired";

const DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

/** A calendar day written YYYY-MM-DD that really exists (2026-02-30 does not). */
function isRealDate(text: string): boolean {
  const m = DATE.exec(text);
  if (!m) return false;
  const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
  return d.toISOString().slice(0, 10) === text;
}

/** Whether a value fits its custom field; rows 10 and 11 call this before writing a value on a listing. */
export function checkCustomValue(
  field: CustomFieldShape,
  value: unknown,
): { ok: true } | { ok: false; reason: ValueProblem } {
  const no = (reason: ValueProblem) => ({ ok: false as const, reason });
  if (field.retiredAt) return no("field-retired");
  switch (field.kind) {
    case "text":
      if (typeof value !== "string") return no("wrong-kind");
      return value.length > TEXT_VALUE_LIMIT ? no("too-long") : { ok: true };
    case "number":
      return typeof value === "number" && Number.isFinite(value) ? { ok: true } : no("wrong-kind");
    case "date":
      if (typeof value !== "string") return no("wrong-kind");
      return isRealDate(value) ? { ok: true } : no("bad-date");
    case "single_select":
      if (typeof value !== "string") return no("wrong-kind");
      return field.options.includes(value) ? { ok: true } : no("not-an-option");
    case "boolean":
      return typeof value === "boolean" ? { ok: true } : no("wrong-kind");
  }
}

export type FieldProblem =
  | "kind-unknown"
  | "name-empty"
  | "name-too-long"
  | "name-taken"
  | "options-count"
  | "options-duplicate"
  | "options-not-allowed"
  | "field-limit";

export interface FieldDraft {
  name: string;
  kind: FieldKind;
  options: readonly string[];
}

/** The names a new or renamed field must not take, and the fields already in use. */
export interface FieldContext {
  liveFields: readonly { name: string; code: string }[];
  labels: readonly string[];
  standardHeaders: readonly string[];
}

/**
 * Every problem of a field draft. `editing` is the code of the field being edited: its own name is not a clash and it
 * does not count against the limit. The kind of an edited field never changes; the store refuses that separately.
 */
export function checkFieldDraft(
  draft: FieldDraft,
  ctx: FieldContext,
  editing?: string,
): FieldProblem[] {
  const out: FieldProblem[] = [];
  if (!(FIELD_KINDS as readonly string[]).includes(draft.kind)) out.push("kind-unknown");
  const name = draft.name.trim();
  if (name.length === 0) out.push("name-empty");
  if (name.length > NAME_LIMIT) out.push("name-too-long");
  const others = ctx.liveFields.filter((f) => f.code !== editing);
  const taken = new Set(
    [...others.map((f) => f.name), ...ctx.labels, ...ctx.standardHeaders].map(fold),
  );
  if (name.length > 0 && taken.has(fold(name))) out.push("name-taken");
  if (draft.kind === "single_select") {
    if (draft.options.length < 1 || draft.options.length > OPTION_LIMIT) out.push("options-count");
    const folded = draft.options.map((o) => fold(o));
    if (new Set(folded).size !== folded.length) out.push("options-duplicate");
  } else if (draft.options.length > 0) out.push("options-not-allowed");
  if (editing === undefined && others.length >= FIELD_LIMIT) out.push("field-limit");
  return out;
}

const LISTING_STATUSES = [
  "Incomplete",
  "Active",
  "Pending",
  "Closed",
  "Hold",
  "Withdrawn",
] as const satisfies readonly ListingStandardStatus[];
const WITHDRAWN_REASONS = [
  "sold_elsewhere",
  "owner_changed_mind",
  "unreachable",
] as const satisfies readonly ListingWithdrawnReason[];
// The catalog writes directions as Vietnamese words (row 7d sample); these eight are the closed set a spelling maps to.
const DIRECTIONS = [
  "Bắc",
  "Nam",
  "Đông",
  "Tây",
  "Đông Bắc",
  "Đông Nam",
  "Tây Bắc",
  "Tây Nam",
] as const;

/** Standard fields whose values form a closed set, so a company spelling can stand for one of them. */
export const STANDARD_VALUE_SETS: Readonly<Record<string, readonly string[]>> = {
  "Listing.standardStatus": LISTING_STATUSES,
  "Listing.withdrawnReason": WITHDRAWN_REASONS,
  "Unit.directionFaces": DIRECTIONS,
};

/**
 * The closed set of values a field takes — a standard field above, or a single choice custom field in use — or null
 * when the field takes free values or does not exist, so no spelling can be paired with it.
 */
export function valueSetOf(
  field: string,
  liveFields: readonly { code: string; kind: FieldKind; options: readonly string[] }[],
): readonly string[] | null {
  const standard = STANDARD_VALUE_SETS[field];
  if (standard) return standard;
  const own = liveFields.find((f) => f.code === field);
  return own && own.kind === "single_select" ? own.options : null;
}

/** How a custom field's column displays on the grid, by its kind. */
export function columnKindOf(kind: FieldKind): DisplayKind {
  switch (kind) {
    case "text":
      return "text";
    case "number":
      return "count";
    case "date":
      return "date";
    case "single_select":
      return "select";
    case "boolean":
      return "boolean";
  }
}

/** The shape of a sheet: its column names folded, in order. Same shape, same template; another order is another. */
export function templateSignature(headers: readonly string[]): string[] {
  return headers.map((h) => fold(h));
}

/** A custom field in use as the inventory shows it: its code, the company's name for it, its kind and its place. */
export interface LiveFieldShape {
  code: string;
  name: string;
  kind: FieldKind;
  position: number;
}

/** The company's own columns, by position, each with the display kind of its field (row 7e, AC-8). */
export function customColumnsOf(
  fields: readonly LiveFieldShape[],
): { code: string; header: string; kind: DisplayKind }[] {
  return [...fields]
    .sort((a, b) => a.position - b.position || a.code.localeCompare(b.code))
    .map((f) => ({ code: f.code, header: f.name, kind: columnKindOf(f.kind) }));
}
