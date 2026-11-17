// The four details of a listing as columns of the inventory grid (row 3g, Hỏi-3 «lối C», owner 2026-11-17): Nội thất,
// Pháp lý, Tài chính, Tình trạng sử dụng, shown from the start like Quỹ hàng shows them, hidden with «Cột», and edited on
// their cell one part at a time — the record's «Sửa» edits several at once. A cell holds the word the grid shows; a write
// sends the part's stored value through the one change of the record (`details`).
import type { GridRow } from "@/components/candidate/data-region";
import type { Listing, ListingFurnished, ListingOccupantType } from "@/generated/ontology";

import {
  DETAILS_TEXT_LIMIT,
  FURNISHED_VALUES,
  OCCUPANT_VALUES,
  type DetailField,
} from "../edit-rules";
import type { ListingChange } from "../save-door";

import type { CustomCellField } from "./listing-cell-edit";

/** The words of the four columns, from the label table through the page. */
export interface DetailColumnWords {
  furnished: string;
  legalStatus: string;
  financing: string;
  occupantType: string;
  furnishedValues: Readonly<Record<ListingFurnished, string>>;
  occupantValues: Readonly<Record<ListingOccupantType, string>>;
}

/** The columns, in the order Quỹ hàng shows them. */
export const DETAIL_COLUMN_FIELDS = [
  "Listing.furnished",
  "Listing.legalStatus",
  "Listing.financing",
  "Listing.occupantType",
] as const;
export type DetailColumnField = (typeof DETAIL_COLUMN_FIELDS)[number];

const PART: Readonly<Record<DetailColumnField, DetailField>> = {
  "Listing.furnished": "furnished",
  "Listing.legalStatus": "legalStatus",
  "Listing.financing": "financing",
  "Listing.occupantType": "occupantType",
};

/** The four columns as typed cells: two choices of fixed values, two words of at most 200 characters. */
export function detailCellFields(words: DetailColumnWords): CustomCellField[] {
  return DETAIL_COLUMN_FIELDS.map((key) => {
    const part = PART[key];
    if (part === "furnished")
      return {
        code: part,
        key,
        header: words.furnished,
        kind: "single_select",
        options: FURNISHED_VALUES.map((v) => words.furnishedValues[v]),
      };
    if (part === "occupantType")
      return {
        code: part,
        key,
        header: words.occupantType,
        kind: "single_select",
        options: OCCUPANT_VALUES.map((v) => words.occupantValues[v]),
      };
    return {
      code: part,
      key,
      header: words[part],
      kind: "text",
      options: [],
      limit: DETAILS_TEXT_LIMIT,
    };
  });
}

/** What the four cells of a listing show. */
export function detailCells(
  l: Pick<Listing, DetailField>,
  words: DetailColumnWords,
): Partial<GridRow> {
  return {
    "Listing.furnished": l.furnished ? words.furnishedValues[l.furnished] : null,
    "Listing.legalStatus": l.legalStatus ?? null,
    "Listing.financing": l.financing ?? null,
    "Listing.occupantType": l.occupantType ? words.occupantValues[l.occupantType] : null,
  } as Partial<GridRow>;
}

/** The change one detail cell sends: the shown word read back to the stored value. */
export function detailChange(
  key: DetailColumnField,
  shown: string | null,
  words: DetailColumnWords,
): ListingChange {
  const part = PART[key];
  if (part === "furnished")
    return {
      field: "details",
      furnished:
        shown === null
          ? null
          : (FURNISHED_VALUES.find((v) => words.furnishedValues[v] === shown) ?? null),
    };
  if (part === "occupantType")
    return {
      field: "details",
      occupantType:
        shown === null
          ? null
          : (OCCUPANT_VALUES.find((v) => words.occupantValues[v] === shown) ?? null),
    };
  return { field: "details", [part]: shown };
}

export const isDetailColumn = (field: string): field is DetailColumnField =>
  (DETAIL_COLUMN_FIELDS as readonly string[]).includes(field);
