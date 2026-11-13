// Public, browser-safe API of the company-config module. Server code goes in ./server.ts.
import { LABELS, type ConceptCode } from "../../generated/labels";

export type TransactionKind = "sale" | "lease";

export interface LabelOptions {
  /** Labels this company has chosen instead of the preferred ones. */
  overrides?: Partial<Record<ConceptCode, string>>;
  transaction?: TransactionKind;
}

/** The display label of a concept: the company's own label, otherwise the preferred one. */
export function label(concept: ConceptCode, options: LabelOptions = {}): string {
  const override = options.overrides?.[concept];
  if (override) return override;
  const entry: { pref: string; lease?: string } = LABELS[concept];
  return options.transaction === "lease" && entry.lease ? entry.lease : entry.pref;
}

export {
  FIELD_KINDS,
  FIELD_LIMIT,
  NAME_LIMIT,
  OPTION_LIMIT,
  STANDARD_VALUE_SETS,
  TEXT_VALUE_LIMIT,
  checkCustomValue,
  checkFieldDraft,
  columnKindOf,
  fold,
  templateSignature,
  valueSetOf,
  type CustomFieldShape,
  type FieldContext,
  type FieldDraft,
  type FieldKind,
  type FieldProblem,
  type ValueProblem,
} from "./rules";
