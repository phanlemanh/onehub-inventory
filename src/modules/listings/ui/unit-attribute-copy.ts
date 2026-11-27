// Every sentence of the listing's own unit attributes (row 3h), in one file for the reviewer (design/language.md).
// Concept words — the five names, the sources, the catalog, the mark, the way back — come from the label table through
// the page (UnitAttributeWords); only the sentences around them live here.
import type { ListingPropertySubType } from "@/generated/ontology";
import { EMPTY, formatArea } from "@/lib/format";

import type {
  AttributeProblem,
  EffectiveSource,
  UnitAttributeField,
  UnitAttributeValues,
} from "../unit-attributes";

/** The words of the five attributes and around them, from the label table. */
export interface UnitAttributeWords {
  names: Readonly<Record<UnitAttributeField, string>>;
  subTypes: Readonly<Record<ListingPropertySubType, string>>;
  sources: Readonly<Record<EffectiveSource, string>>;
  /** The shared catalog's word. */
  catalog: string;
  /** The mark's name. */
  differs: string;
  /** The command that clears the own value. */
  revert: string;
  edit: string;
  unit: string;
}

/** One attribute's value as the screens write it: «72,5 m²», «2», a sub type by its word, or the empty dash. */
export function attributeText(
  words: UnitAttributeWords,
  field: UnitAttributeField,
  value: UnitAttributeValues[UnitAttributeField] | null | undefined,
): string {
  if (value === null || value === undefined || value === "") return EMPTY;
  if (field === "livingArea") return formatArea(value as number);
  if (field === "propertySubType")
    return words.subTypes[value as ListingPropertySubType] ?? String(value);
  return String(value);
}

const exact = new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 2 });

/** A stored value as its editor starts from it: «72,5», «2», «15A». */
export const attributeInput = (value: unknown): string =>
  value === null || value === undefined
    ? ""
    : typeof value === "number"
      ? exact.format(value)
      : String(value);

const AREA_HOW = "gõ số như 72,5 hoặc 72,5 m²";
const BEDROOMS_HOW = "gõ số nguyên như 2; studio thì gõ 0";
const FLOOR_HOW = "gõ tầng như 7 hoặc 15A, không có số 0 đứng đầu";

export const UNIT_ATTRIBUTE_COPY = {
  /** Why a typed value was not taken; the editor keeps the words typed. */
  problem: (field: UnitAttributeField, problem: AttributeProblem, typed: string): string => {
    const text = typed.trim();
    if (field === "livingArea")
      return problem === "not-positive"
        ? `Phải lớn hơn 0 — ${AREA_HOW}.`
        : problem === "empty"
          ? `Chưa có số — ${AREA_HOW}.`
          : `Chưa hiểu «${text}» — ${AREA_HOW}.`;
    if (field === "bedroomsTotal")
      return problem === "not-whole"
        ? `Không có nửa phòng — ${BEDROOMS_HOW}.`
        : problem === "not-positive"
          ? `Không nhỏ hơn 0 — ${BEDROOMS_HOW}.`
          : problem === "empty"
            ? `Chưa có số — ${BEDROOMS_HOW}.`
            : `Chưa hiểu «${text}» — ${BEDROOMS_HOW}.`;
    if (field === "floor")
      return problem === "empty"
        ? `Chưa có — ${FLOOR_HOW}.`
        : `Chưa hiểu «${text}» — ${FLOOR_HOW}.`;
    return "Chọn một giá trị trong danh sách.";
  },
  /** The mark's accessible name: the mark's word, then the catalog's value («…: 68,5 m²»). */
  markName: (words: UnitAttributeWords, catalogShown: string) =>
    `${words.differs}: ${catalogShown}`,
  /** The catalog's value beside an own one, after the catalog's word. */
  catalogLine: (words: UnitAttributeWords, catalogShown: string) =>
    `${words.catalog}: ${catalogShown}`,
  /** The line under an attribute cell's editor while the catalog has a value. */
  cellNote: (words: UnitAttributeWords, catalogShown: string) =>
    `${words.catalog}: ${catalogShown} · Xoá chữ rồi Enter là ${words.revert.toLocaleLowerCase("vi")}.`,
  /** What a toast names: the attribute, the unit and the value («…: 72,5 m²»). */
  what: (words: UnitAttributeWords, field: UnitAttributeField, unitNumber: string, shown: string) =>
    `${words.names[field]} ${words.unit.toLocaleLowerCase("vi")} ${unitNumber}: ${shown}`,
  /** A value written back to the catalog's: «68,5 m² (…)» with the catalog source's word. */
  backToCatalog: (words: UnitAttributeWords, catalogShown: string) =>
    `${catalogShown} (${words.sources.Catalog})`,
  /** The record's dialog. */
  dialogDescription: (words: UnitAttributeWords) =>
    `Giá trị của sàn, danh mục chung không đổi. Xoá chữ trong ô là ${words.sources.Catalog.toLocaleLowerCase("vi")}.`,
  /** The choice that clears an own direction or sub type in the record's dialog. */
  followCatalog: (words: UnitAttributeWords) => words.sources.Catalog,
} as const;

/** The three looks of the mark (Hỏi-6), by the word of `?mark=`. */
export const MARK_LOOKS = ["dot", "badge", "icon"] as const;
export type MarkLook = (typeof MARK_LOOKS)[number];

/** The look a `?mark=` word asks for, honoured outside production only; anything else is the dot. */
export const markLookFrom = (param: string | undefined, env: string | undefined): MarkLook =>
  env !== "production" && (MARK_LOOKS as readonly string[]).includes(param ?? "")
    ? (param as MarkLook)
    : "dot";
