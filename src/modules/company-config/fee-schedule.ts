// Fees and taxes of a company (row 19, thue-phi): the one place for the fee items' defaults, the limits a schedule must
// keep, and NetToSeller. Pure and browser-safe: the screen checks a draft with the same function the API uses.
// Rates are whole basis points (1% = 100), money whole đồng. Rules: ontology/entities/FeeItem.yaml.
import { fold } from "./rules";

export type FeeItemKind = "Law" | "Own";
export type FeeInclusion = "Included" | "Excluded";

/** The two items set by law: only switched on or off. Their names come from ontology/labels.yaml by code. */
export const LAW_FEE_ITEMS = [
  { code: "pit", concept: "PersonalIncomeTax", rateBasisPoints: 200 },
  { code: "registration", concept: "RegistrationFee", rateBasisPoints: 50 },
] as const;
export type LawFeeCode = (typeof LAW_FEE_ITEMS)[number]["code"];

/** The own item every company starts with. */
export const DEFAULT_OWN_ITEM = {
  code: "brokerage",
  concept: "BrokerageFee",
  rateBasisPoints: 100,
} as const;

export const OWN_RATE_MAX = 500;
export const OWN_RATE_STEP = 10;
export const OWN_ITEM_LIMIT = 5;
export const INCLUDED_TOTAL_MAX = 1000;
export const FEE_NAME_LIMIT = 40;

/** One item as a schedule holds it. `name` is set for own items only; a law item's and the default's come from labels. */
export interface FeeItemValue {
  code: string;
  kind: FeeItemKind;
  name?: string;
  rateBasisPoints: number;
  included: boolean;
}

/** One item of a draft sent to save: an item without a code is a new own item. */
export interface FeeItemDraft {
  code?: string;
  name?: string;
  rateBasisPoints: number;
  included: boolean;
}

export type FeeProblemCode =
  | "rate-below-zero"
  | "rate-above-max"
  | "rate-step"
  | "name-empty"
  | "name-too-long"
  | "name-duplicate"
  | "law-item-fixed"
  | "law-item-missing"
  | "unknown-item"
  | "too-many-items"
  | "total-above-max"
  | "nothing-included";

/** What is wrong and on which item: `index` is the item's place in the draft; schedule-wide problems have none. */
export interface FeeProblem {
  problem: FeeProblemCode;
  index?: number;
}

/** The schedule of a company that has changed nothing. */
export function defaultFeeSchedule(): FeeItemValue[] {
  return [
    ...LAW_FEE_ITEMS.map((l) => ({
      code: l.code,
      kind: "Law" as const,
      rateBasisPoints: l.rateBasisPoints,
      included: true,
    })),
    {
      code: DEFAULT_OWN_ITEM.code,
      kind: "Own" as const,
      rateBasisPoints: DEFAULT_OWN_ITEM.rateBasisPoints,
      included: true,
    },
  ];
}

const isLaw = (code: string | undefined): boolean => LAW_FEE_ITEMS.some((l) => l.code === code);

/** Sum of the rates that come off an Included listing. */
export function includedTotal(
  items: readonly Pick<FeeItemValue, "rateBasisPoints" | "included">[],
): number {
  return items.reduce((sum, i) => (i.included ? sum + i.rateBasisPoints : sum), 0);
}

/**
 * Every problem of a draft, each naming its item. `known` is the set of own item codes the company has in use (a draft
 * may keep, rename or drop them, never invent one); `nameOf` gives the display name of an item that carries none.
 */
export function checkFeeDraft(
  draft: readonly FeeItemDraft[],
  known: ReadonlySet<string>,
  nameOf: (code: string) => string,
): FeeProblem[] {
  const problems: FeeProblem[] = [];
  const names = new Map<string, number>();
  let own = 0;
  draft.forEach((item, index) => {
    if (isLaw(item.code)) {
      const law = LAW_FEE_ITEMS.find((l) => l.code === item.code)!;
      if (item.name !== undefined || item.rateBasisPoints !== law.rateBasisPoints) {
        problems.push({ problem: "law-item-fixed", index });
      }
      names.set(fold(nameOf(law.code)), index);
      return;
    }
    own += 1;
    if (item.code !== undefined && !known.has(item.code)) {
      problems.push({ problem: "unknown-item", index });
      return;
    }
    const r = item.rateBasisPoints;
    if (!Number.isInteger(r)) problems.push({ problem: "rate-step", index });
    else if (r < 0) problems.push({ problem: "rate-below-zero", index });
    else if (r > OWN_RATE_MAX) problems.push({ problem: "rate-above-max", index });
    else if (r % OWN_RATE_STEP !== 0) problems.push({ problem: "rate-step", index });
    const name = item.name !== undefined ? item.name.trim() : item.code ? nameOf(item.code) : "";
    if (name.length === 0) problems.push({ problem: "name-empty", index });
    else if (name.length > FEE_NAME_LIMIT) problems.push({ problem: "name-too-long", index });
    else if (names.has(fold(name))) problems.push({ problem: "name-duplicate", index });
    else names.set(fold(name), index);
  });
  for (const law of LAW_FEE_ITEMS) {
    if (!draft.some((d) => d.code === law.code)) problems.push({ problem: "law-item-missing" });
  }
  // A law item appears once; a second copy is not a law item the company may keep.
  const seen = new Set<string>();
  draft.forEach((d, index) => {
    if (d.code === undefined) return;
    if (seen.has(d.code)) problems.push({ problem: "unknown-item", index });
    seen.add(d.code);
  });
  if (own > OWN_ITEM_LIMIT) problems.push({ problem: "too-many-items" });
  const total = includedTotal(draft);
  if (total > INCLUDED_TOTAL_MAX) problems.push({ problem: "total-above-max" });
  if (!draft.some((d) => d.included)) problems.push({ problem: "nothing-included" });
  return problems;
}

/**
 * NetToSeller of one listing: list price × (1 − switched-on rates), rounded down to the đồng, when the price includes the
 * fees; the list price when it does not; null without a price, without a fee inclusion, or for a lease.
 */
export function netToSeller(
  listPrice: number | null | undefined,
  inclusion: FeeInclusion | null | undefined,
  items: readonly Pick<FeeItemValue, "rateBasisPoints" | "included">[],
  transaction: "sale" | "lease" = "sale",
): number | null {
  if (transaction === "lease") return null;
  if (
    listPrice === null ||
    listPrice === undefined ||
    !Number.isSafeInteger(listPrice) ||
    listPrice < 1
  )
    return null;
  if (inclusion === "Excluded") return listPrice;
  if (inclusion !== "Included") return null;
  const keep = 10_000 - includedTotal(items);
  return Number((BigInt(listPrice) * BigInt(keep)) / 10_000n);
}

/**
 * Reads a rate typed the Vietnamese way («1,5», «1.5», «2») into basis points; null when it is not a number. More than
 * two decimals stays unread rather than being rounded into a different rate.
 */
export function parseRatePercent(text: string): number | null {
  const t = text.trim().replace(",", ".");
  if (!/^-?\d+(\.\d{1,2})?$/.test(t)) return null;
  const [whole, frac = ""] = t.replace("-", "").split(".");
  const bp = Number(whole) * 100 + Number((frac + "00").slice(0, 2));
  return t.startsWith("-") ? -bp : bp;
}

/** A rate in basis points the Vietnamese way: 150 → «1,5». */
export function formatRatePercent(basisPoints: number): string {
  const s = (basisPoints / 100).toFixed(2).replace(/\.?0+$/, "");
  return s.replace(".", ",");
}
