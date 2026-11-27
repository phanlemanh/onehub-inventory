// A listing's own values of five unit attributes (roadmap row 3h, _acceptance/tin-rao-giu-gia-tri-rieng): living area,
// floor, bedrooms, direction and property sub type. Each own value remembers its source (Typed, File); without one the
// listing follows the shared catalog. Typed beats File beats the catalog, and the catalog never overwrites an own value
// (ontology rule own-value-beats-catalog). Every screen that shows the five reads them through `effectiveAttributes`, and
// every editor reads a typed value through the readers below: one rule, one place. Pure and browser-safe.
import type { Listing, ListingPropertySubType } from "../../generated/ontology";
import { DIRECTION_VALUES, isFloor, type DirectionValue } from "../catalog";

import { foldWords } from "./edit-rules";

/** The five attributes, in the order the record shows them. */
export const UNIT_ATTRIBUTE_FIELDS = [
  "livingArea",
  "floor",
  "bedroomsTotal",
  "directionFaces",
  "propertySubType",
] as const;
export type UnitAttributeField = (typeof UNIT_ATTRIBUTE_FIELDS)[number];

/** Who wrote an own value (AttributeSource): the company typed it, or an imported file brought it. */
export type AttributeSource = "Typed" | "File";
/** Where a shown value comes from: an own value's source, the catalog, or nowhere (no value at all). */
export type EffectiveSource = AttributeSource | "Catalog";

/** The four property sub types (RESO PropertySubType), the same values as the catalog unit's. */
export const PROPERTY_SUB_TYPES: readonly ListingPropertySubType[] = [
  "Condominium",
  "Townhouse",
  "Single Family Residence",
  "Unimproved Land",
];

/** The value type of each attribute. */
export interface UnitAttributeValues {
  livingArea: number;
  floor: string;
  bedroomsTotal: number;
  directionFaces: string;
  propertySubType: ListingPropertySubType;
}

/** The source property of each attribute on the listing: set and cleared with its value. */
export const SOURCE_OF = {
  livingArea: "livingAreaSource",
  floor: "floorSource",
  bedroomsTotal: "bedroomsTotalSource",
  directionFaces: "directionFacesSource",
  propertySubType: "propertySubTypeSource",
} as const satisfies Record<UnitAttributeField, keyof Listing>;

/** What a listing holds of the five: its own values and their sources. */
export type OwnAttributes = Partial<
  Pick<Listing, UnitAttributeField | (typeof SOURCE_OF)[UnitAttributeField]>
>;

/** A listing's own attribute values and their sources, nothing else of it. */
export function ownAttributesOf(l: OwnAttributes): OwnAttributes {
  const own: Record<string, unknown> = {};
  for (const f of UNIT_ATTRIBUTE_FIELDS) {
    if (l[f] !== undefined) own[f] = l[f];
    if (l[SOURCE_OF[f]] !== undefined) own[SOURCE_OF[f]] = l[SOURCE_OF[f]];
  }
  return own as OwnAttributes;
}

/** What the catalog unit says of the five; a pending unit (row 11, 12) has no catalog unit. */
export type CatalogAttributes = Partial<{
  [K in UnitAttributeField]: K extends "propertySubType"
    ? string | null
    : UnitAttributeValues[K] | null;
}>;

/** One attribute as a screen shows it. */
export interface EffectiveAttribute<V> {
  /** The value that wins: the own value, else the catalog's; null when neither has one. */
  value: V | null;
  source: EffectiveSource | null;
  /** The catalog's value, whether it wins or not. */
  catalogValue: V | null;
  /** An own value and a catalog value are both there and are not the same. */
  differs: boolean;
}
export type EffectiveAttributes = {
  [K in UnitAttributeField]: EffectiveAttribute<UnitAttributeValues[K]>;
};

const present = (v: unknown): boolean =>
  v !== null && v !== undefined && !(typeof v === "string" && v.trim() === "");

/** Whether two values of an attribute are the same: numbers as numbers, words folded (no marks, no case). */
export function sameAttribute(a: unknown, b: unknown): boolean {
  if (!present(a) || !present(b)) return !present(a) && !present(b);
  if (typeof a === "number" || typeof b === "number") return Number(a) === Number(b);
  return foldWords(String(a)) === foldWords(String(b));
}

/** The catalog's value of one attribute, typed: a sub type outside the four counts as none. */
function catalogValueOf<K extends UnitAttributeField>(
  field: K,
  unit: CatalogAttributes | null | undefined,
): UnitAttributeValues[K] | null {
  const v = unit?.[field];
  if (!present(v)) return null;
  if (field === "propertySubType")
    return (PROPERTY_SUB_TYPES as readonly unknown[]).includes(v)
      ? (v as UnitAttributeValues[K])
      : null;
  return v as UnitAttributeValues[K];
}

/** The five attributes of a listing on its catalog unit (none for a pending unit): which value wins, and whether it differs. */
export function effectiveAttributes(
  listing: OwnAttributes,
  catalogUnit: CatalogAttributes | null | undefined,
): EffectiveAttributes {
  const one = <K extends UnitAttributeField>(
    field: K,
  ): EffectiveAttribute<UnitAttributeValues[K]> => {
    const own = listing[field] as UnitAttributeValues[K] | undefined;
    const catalogValue = catalogValueOf(field, catalogUnit);
    if (present(own))
      return {
        value: own as UnitAttributeValues[K],
        source: (listing[SOURCE_OF[field]] as AttributeSource | undefined) ?? "Typed",
        catalogValue,
        differs: catalogValue !== null && !sameAttribute(own, catalogValue),
      };
    return {
      value: catalogValue,
      source: catalogValue === null ? null : "Catalog",
      catalogValue,
      differs: false,
    };
  };
  return {
    livingArea: one("livingArea"),
    floor: one("floor"),
    bedroomsTotal: one("bedroomsTotal"),
    directionFaces: one("directionFaces"),
    propertySubType: one("propertySubType"),
  };
}

const RANK: Readonly<Record<AttributeSource, number>> = { File: 1, Typed: 2 };

/**
 * Whether a value from `incoming` may replace the own value written by `current` (none: always): typed beats a file,
 * so a file read again (row 11b) never overwrites what the company typed.
 */
export const sourceWins = (
  current: AttributeSource | null | undefined,
  incoming: AttributeSource,
): boolean => !current || RANK[incoming] >= RANK[current];

/** Why a typed attribute was not taken; the screens say it in words (ui/unit-attribute-copy.ts). */
export type AttributeProblem =
  "empty" | "not-a-number" | "not-positive" | "not-whole" | "not-a-floor" | "not-an-option";

export type AttributeRead<V> = { ok: true; value: V } | { ok: false; problem: AttributeProblem };

/**
 * A living area as brokers type it: «72,5», «72.5», «72,5 m2», «72,5m²», «72 m». Empty, words, zero or a negative
 * number is refused, never guessed.
 */
export function readLivingArea(raw: string): AttributeRead<number> {
  const text = raw
    .trim()
    .toLowerCase()
    .replace(/\s*(m2|m²|m)$/, "");
  if (text === "") return { ok: false, problem: "empty" };
  if (/^-\s*\d/.test(text)) return { ok: false, problem: "not-positive" };
  if (!/^\d+([.,]\d+)?$/.test(text)) return { ok: false, problem: "not-a-number" };
  const value = Number(text.replace(",", "."));
  return value > 0 ? { ok: true, value } : { ok: false, problem: "not-positive" };
}

/** Bedrooms: a whole number from 0 (a studio is 0). «2,5» and «Studio» are refused. */
export function readBedrooms(raw: string): AttributeRead<number> {
  const text = raw.trim();
  if (text === "") return { ok: false, problem: "empty" };
  if (/^\d+$/.test(text)) return { ok: true, value: Number(text) };
  if (/^-?\d+([.,]\d+)?$/.test(text))
    return { ok: false, problem: text.startsWith("-") ? "not-positive" : "not-whole" };
  return { ok: false, problem: "not-a-number" };
}

/** A floor by the catalog's own rule (floor-text): 7, 15A; «07» is refused, not corrected. */
export function readFloor(raw: string): AttributeRead<string> {
  const text = raw.trim().toUpperCase();
  if (text === "") return { ok: false, problem: "empty" };
  return isFloor(text) ? { ok: true, value: text } : { ok: false, problem: "not-a-floor" };
}

/** One of the catalog's eight directions, as the catalog writes it; «dong nam» reads as «Đông Nam». */
export function readDirection(raw: string): AttributeRead<DirectionValue> {
  const text = foldWords(raw);
  if (text === "") return { ok: false, problem: "empty" };
  const found = DIRECTION_VALUES.find((d) => foldWords(d) === text);
  return found ? { ok: true, value: found } : { ok: false, problem: "not-an-option" };
}

export const isPropertySubType = (v: unknown): v is ListingPropertySubType =>
  (PROPERTY_SUB_TYPES as readonly unknown[]).includes(v);

/** Whether a stored value is one the save door takes for that attribute (the server checks with the same readers). */
export function attributeFits(field: UnitAttributeField, value: unknown): boolean {
  switch (field) {
    case "livingArea":
      return typeof value === "number" && Number.isFinite(value) && value > 0;
    case "bedroomsTotal":
      return typeof value === "number" && Number.isInteger(value) && value >= 0;
    case "floor":
      return typeof value === "string" && isFloor(value);
    case "directionFaces":
      return typeof value === "string" && (DIRECTION_VALUES as readonly string[]).includes(value);
    case "propertySubType":
      return isPropertySubType(value);
  }
}
