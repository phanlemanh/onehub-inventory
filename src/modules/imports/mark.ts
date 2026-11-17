// The marks of an import (row 11, nhap-excel; rule no-cell-lost of ImportRun): every cell gets exactly one of four
// marks — keep · fixed (with a reason) · ask · block — and one target. Pure and safe in the browser: the screen and the
// server call the same functions, so the numbers on the screen are the numbers the server writes. Unit codes are looked
// up on the server (lookupInCompany) and passed in as `units`.
import { canMove, readPrice } from "@/modules/listings";
import {
  checkCustomValue,
  fold,
  label,
  templateSignature,
  valueSetOf,
  type FieldKind,
} from "@/modules/company-config";
import type { ListingStandardStatus } from "@/generated/ontology";

import {
  HEADER_DICTIONARY,
  OWNER_HEADERS,
  STANDARD_TARGETS,
  TARGET_CONCEPT,
  TEMPLATE_FIELD,
  VALUE_CONCEPTS,
  VALUE_DICTIONARY,
  type StandardTarget,
  type Target,
} from "./targets";

export type Mark = "keep" | "fixed" | "ask" | "block";

/** What the marks need of the company layer (row 7e): labels, live custom fields, spellings, templates. */
export interface LayerView {
  labels: readonly { concept: string; label: string }[];
  fields: readonly { code: string; name: string; kind: FieldKind; options: readonly string[] }[];
  aliases: readonly { field: string; raw: string; value: string }[];
  templates: readonly {
    id: string;
    signature: readonly string[];
    columns: readonly ({ standard: string } | { custom: string } | { skip: true })[];
  }[];
}

export type ColumnWhy =
  | "template"
  | "company-label"
  | "standard-label"
  | "header-dictionary"
  | "unknown"
  | "same-target"
  | "no-unit-column"
  | "owner-column"
  | "target-retired"
  | "chosen";

export interface ColumnMatch {
  index: number;
  header: string;
  target: Target | null;
  mark: Mark;
  why: ColumnWhy;
  /** The header becomes the company's label of a labelable concept on success: null when nothing to ask. */
  learnLabel: boolean | null;
  implies?: { feeInclusion: "Excluded" | "Included" };
}

export interface ColumnChoice {
  target: Target;
  learnLabel?: boolean;
}

export type UnitFound =
  | { kind: "catalog"; via: "company" | "catalog" | "reader"; unitKeys: string[] }
  | { kind: "pending"; pendingUnitId: string }
  | { kind: "none" };

export type UnitChoice =
  { unitKey: string; remember: boolean } | { pending: true } | { skipRow: true };
export interface ValueChoice {
  /** The standard value or option the person chose; null keeps the cell as written in this import. */
  value: string | null;
  remember: boolean;
}

export interface Choices {
  columns: Record<number, ColumnChoice>;
  /** Keyed by valueKey(columnIndex, raw). */
  values: Record<string, ValueChoice>;
  /** Keyed by fold(raw code). */
  units: Record<string, UnitChoice>;
  /** Rows (0-based, data rows) the person leaves out on purpose — a repeated unit, a line that is not a unit. */
  skipRows?: readonly number[];
}

export const NO_CHOICES: Choices = { columns: {}, values: {}, units: {} };

export const valueKey = (column: number, raw: string) => `${column}|${fold(raw)}`;

const LABELABLE = new Set([
  "Unit",
  "Building",
  "Subdivision",
  "StandardStatus",
  "ListPrice",
  "LivingArea",
  "BedroomsTotal",
  "LastConfirmedAt",
]);

const sameTarget = (a: Target | null, b: Target | null): boolean => {
  if (!a || !b) return false;
  if ("standard" in a && "standard" in b) return a.standard === b.standard;
  if ("custom" in a && "custom" in b) return a.custom === b.custom;
  if ("newField" in a && "newField" in b) return fold(a.newField.name) === fold(b.newField.name);
  return false;
};

function fromTemplate(
  t: { standard: string } | { custom: string } | { skip: true },
  layer: LayerView,
): Target | null {
  if ("skip" in t) return { skip: true };
  if ("custom" in t)
    return layer.fields.some((f) => f.code === t.custom) ? { custom: t.custom } : null;
  const standard = STANDARD_TARGETS.find((s) => TEMPLATE_FIELD[s] === t.standard);
  return standard ? { standard } : null;
}

/** The label a header would need to be read as a standard target: the company's own one, else the preferred one. */
function labelFor(target: StandardTarget, layer: LayerView): string {
  const concept = TARGET_CONCEPT[target];
  return layer.labels.find((l) => l.concept === concept)?.label ?? label(concept);
}

/** Each column's target and mark, in the order template → company label → standard label → header dictionary. */
export function matchColumns(
  headers: readonly string[],
  layer: LayerView,
  choices: Choices,
): ColumnMatch[] {
  const signature = templateSignature([...headers]);
  const template = layer.templates.find(
    (t) =>
      t.signature.length === signature.length && t.signature.every((s, i) => s === signature[i]),
  );
  const out: ColumnMatch[] = headers.map((header, index) => {
    const f = fold(header);
    const chosen = choices.columns[index];
    const learnable = (target: Target) =>
      "standard" in target &&
      LABELABLE.has(TARGET_CONCEPT[target.standard]) &&
      fold(label(TARGET_CONCEPT[target.standard])) !== f &&
      fold(labelFor(target.standard, layer)) !== f
        ? (chosen?.learnLabel ?? true)
        : null;
    if (template) {
      const t = fromTemplate(template.columns[index]!, layer);
      if (t) return { index, header, target: t, mark: "keep", why: "template", learnLabel: null };
      if (!chosen)
        return {
          index,
          header,
          target: null,
          mark: "ask",
          why: "target-retired",
          learnLabel: null,
        };
    }
    if (chosen)
      return {
        index,
        header,
        target: chosen.target,
        mark: "fixed",
        why: "chosen",
        learnLabel: learnable(chosen.target),
      };
    if (OWNER_HEADERS.has(f))
      return { index, header, target: null, mark: "block", why: "owner-column", learnLabel: null };
    for (const s of STANDARD_TARGETS) {
      const own = layer.labels.find((l) => l.concept === TARGET_CONCEPT[s]);
      if (own && fold(own.label) === f)
        return {
          index,
          header,
          target: { standard: s },
          mark: "keep",
          why: "company-label",
          learnLabel: null,
        };
    }
    for (const s of STANDARD_TARGETS)
      if (fold(label(TARGET_CONCEPT[s])) === f)
        return {
          index,
          header,
          target: { standard: s },
          mark: "keep",
          why: "standard-label",
          learnLabel: null,
        };
    const own = layer.fields.find((x) => fold(x.name) === f);
    if (own)
      return {
        index,
        header,
        target: { custom: own.code },
        mark: "keep",
        why: "company-label",
        learnLabel: null,
      };
    const dict = HEADER_DICTIONARY[f];
    if (dict) {
      const target: Target = { standard: dict.target };
      return {
        index,
        header,
        target,
        mark: "fixed",
        why: "header-dictionary",
        learnLabel: learnable(target),
        ...(dict.implies ? { implies: dict.implies } : {}),
      };
    }
    return { index, header, target: null, mark: "ask", why: "unknown", learnLabel: null };
  });
  // Two columns into one target: both blocked until the person changes one (Quỹ hàng let the second slip by).
  for (const a of out)
    if (
      a.target &&
      !("skip" in a.target) &&
      out.some((b) => b !== a && sameTarget(a.target, b.target))
    )
      Object.assign(a, { mark: "block", why: "same-target" as const });
  if (!out.some((c) => c.target && "standard" in c.target && c.target.standard === "unitCode"))
    for (const c of out)
      if (c.mark !== "block" && c.why !== "owner-column")
        Object.assign(c, { mark: "block", why: "no-unit-column" as const });
  return out;
}

export interface CellMark {
  mark: Mark;
  value: string | number | boolean | null;
  why: string;
}

export interface ValueContext {
  layer: LayerView;
  /** Today on the Vietnam calendar, YYYY-MM-DD. */
  today: string;
  choice?: ValueChoice;
}

const DATE = /^(\d{4})-(\d{2})-(\d{2})$/;
const DMY = /^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/;
const pad = (n: number) => String(n).padStart(2, "0");

/** A day written YYYY-MM-DD or DD/MM/YYYY that really exists, as YYYY-MM-DD; null otherwise. */
export function readDate(raw: string): string | null {
  const t = raw.trim();
  let y: number, m: number, d: number;
  const iso = DATE.exec(t);
  const dmy = DMY.exec(t);
  if (iso) [y, m, d] = [Number(iso[1]), Number(iso[2]), Number(iso[3])];
  else if (dmy) [y, m, d] = [Number(dmy[3]), Number(dmy[2]), Number(dmy[1])];
  else return null;
  const at = new Date(Date.UTC(y, m - 1, d));
  if (at.getUTCFullYear() !== y || at.getUTCMonth() !== m - 1 || at.getUTCDate() !== d) return null;
  return `${y}-${pad(m)}-${pad(d)}`;
}

/** A plain decimal as sheets write it: «75,2», «75.2», «75,2 m²»; null otherwise. */
export function readNumber(raw: string): number | null {
  const t = fold(raw).replace(/\s*(m2|m²)$/u, "");
  if (!/^-?\d+([.,]\d+)?$/.test(t)) return null;
  return Number(t.replace(",", "."));
}

const ask = (why: string): CellMark => ({ mark: "ask", value: null, why });

/** One value of a closed set: standard word, short spelling, the company's spelling, or the person's choice. */
function closedValue(
  field: string,
  set: Record<string, string>,
  dictionary: Record<string, string> | undefined,
  raw: string,
  ctx: ValueContext,
): CellMark {
  const f = fold(raw);
  for (const [value, word] of Object.entries(set)) {
    if (raw.trim() === word) return { mark: "keep", value, why: "standard" };
    if (fold(word) === f) return { mark: "fixed", value, why: "standard-folded" };
  }
  const short = dictionary?.[f];
  if (short) return { mark: "fixed", value: short, why: "short-spelling" };
  const own = ctx.layer.aliases.find((a) => a.field === field && fold(a.raw) === f);
  if (own) return { mark: "fixed", value: own.value, why: "company-alias" };
  if (ctx.choice)
    return ctx.choice.value === null
      ? ask("kept-as-written")
      : { mark: "fixed", value: ctx.choice.value, why: "chosen" };
  return ask("unknown-value");
}

/** The mark and value of one cell of a column with a target (unit codes excepted: see markUnit). */
export function markValue(target: Target, raw: string, ctx: ValueContext): CellMark {
  if (raw.trim() === "") return { mark: "keep", value: null, why: "empty" };
  if ("skip" in target) return { mark: "keep", value: null, why: "column-skipped" };
  if ("standard" in target) {
    const s = target.standard;
    const concepts = VALUE_CONCEPTS[s];
    if (concepts) {
      const words: Record<string, string> = {};
      for (const [v, c] of Object.entries(concepts)) words[v] = label(c);
      const found = closedValue(s, words, VALUE_DICTIONARY[s], raw, ctx);
      if (s === "Listing.standardStatus" && typeof found.value === "string") {
        const to = found.value as ListingStandardStatus;
        if (to !== "Incomplete" && !canMove("Incomplete", to)) return ask("status-not-reachable");
      }
      return found;
    }
    if (s === "Unit.directionFaces") {
      const set = valueSetOf(s, []) ?? [];
      const words: Record<string, string> = {};
      for (const v of set) words[v] = v;
      return closedValue(s, words, undefined, raw, ctx);
    }
    if (s === "Listing.listPrice" || s === "Listing.closePrice") {
      const p = readPrice(raw);
      if (!p.ok)
        return ctx.choice?.value
          ? { mark: "fixed", value: Number(ctx.choice.value), why: "chosen" }
          : ask("price-unread");
      return {
        mark: String(p.value) === raw.trim() ? "keep" : "fixed",
        value: p.value,
        why: "price-read",
      };
    }
    if (s === "Unit.livingArea" || s === "Unit.bedroomsTotal") {
      const n = readNumber(raw);
      if (n === null || n < 0 || (s === "Unit.bedroomsTotal" && !Number.isInteger(n)))
        return ask("number-unread");
      return { mark: String(n) === raw.trim() ? "keep" : "fixed", value: n, why: "number-read" };
    }
    if (s === "Listing.closeDate" || s === "Listing.lastConfirmedAt") {
      const d = readDate(raw);
      if (!d) return ask("date-unread");
      if (s === "Listing.lastConfirmedAt" && d > ctx.today) return ask("date-after-today");
      return { mark: d === raw.trim() ? "keep" : "fixed", value: d, why: "date-read" };
    }
    return { mark: "keep", value: raw.trim(), why: "text" };
  }
  const field =
    "custom" in target
      ? ctx.layer.fields.find((f) => f.code === target.custom)
      : {
          code: "",
          name: target.newField.name,
          kind: target.newField.kind,
          options: target.newField.options,
        };
  if (!field) return ask("field-retired");
  let value: string | number | boolean | null = raw.trim();
  if (field.kind === "number") value = readNumber(raw);
  else if (field.kind === "date") value = readDate(raw);
  else if (field.kind === "boolean") {
    const f = fold(raw);
    value = ["co", "x", "yes", "true", "1"].includes(f)
      ? true
      : ["khong", "no", "false", "0"].includes(f)
        ? false
        : null;
  } else if (field.kind === "single_select") {
    const words: Record<string, string> = {};
    for (const o of field.options) words[o] = o;
    return closedValue(field.code, words, undefined, raw, ctx);
  }
  if (value === null) return ask("wrong-kind");
  const checked = checkCustomValue({ kind: field.kind, options: [...field.options] }, value);
  if (!checked.ok) return ask(checked.reason);
  return { mark: String(value) === raw.trim() ? "keep" : "fixed", value, why: "custom" };
}

/** The mark of one unit code, from what the server found for it and the person's choice. */
export function markUnit(
  raw: string,
  found: UnitFound | undefined,
  choice: UnitChoice | undefined,
): CellMark {
  if (raw.trim() === "") return { mark: "block", value: null, why: "no-unit-code" };
  if (choice && "skipRow" in choice) return { mark: "keep", value: null, why: "row-skipped" };
  if (!found || found.kind === "none") {
    if (choice && "pending" in choice)
      return { mark: "fixed", value: raw.trim(), why: "pending-new" };
    return { mark: "ask", value: null, why: "not-in-catalog" };
  }
  if (found.kind === "pending") return { mark: "keep", value: found.pendingUnitId, why: "pending" };
  if (found.unitKeys.length > 1) {
    if (choice && "unitKey" in choice && found.unitKeys.includes(choice.unitKey))
      return { mark: "fixed", value: choice.unitKey, why: "chosen" };
    return { mark: "ask", value: null, why: "many-units" };
  }
  return {
    mark: found.via === "catalog" ? "keep" : "fixed",
    value: found.unitKeys[0]!,
    why: found.via,
  };
}
