// The unit attributes as cells of the inventory grid (row 3h): living area and bedrooms on every grid, and with
// `?columns=five` (variant B, for comparison only) floor, direction and property sub type right after the bedrooms. A cell
// holds what the grid shows — the effective value, a sub type by its word — and a write sends one `unitAttributes`
// change; an empty cell sends null, which takes the catalog's value again.
import type { FieldKey } from "@/components/candidate/column-kind";
import type { GridRow } from "@/components/candidate/data-region";
import type { ListingPropertySubType } from "@/generated/ontology";

import { DIRECTION_VALUES } from "../../catalog";
import type { UnitAttributesChange } from "../save-door";
import {
  PROPERTY_SUB_TYPES,
  SOURCE_OF,
  effectiveAttributes,
  type CatalogAttributes,
  type OwnAttributes,
  type UnitAttributeField,
} from "../unit-attributes";

import type { CustomCellField } from "./listing-cell-edit";
import type { UnitAttributeWords } from "./unit-attribute-copy";

/** The grid column of each attribute: the keys the grid has always used for the unit's facts. */
export const ATTRIBUTE_COLUMN: Readonly<Record<UnitAttributeField, FieldKey>> = {
  livingArea: "Unit.livingArea",
  floor: "Unit.floor",
  bedroomsTotal: "Unit.bedroomsTotal",
  directionFaces: "Unit.directionFaces",
  propertySubType: "Unit.propertySubType",
};

/** The two attributes the grid shows today (row 2's eight columns). */
export const GRID_ATTRIBUTES: readonly UnitAttributeField[] = ["livingArea", "bedroomsTotal"];
/** Variant B (`?columns=five`): the three more, right after the bedrooms. */
export const MORE_ATTRIBUTES: readonly UnitAttributeField[] = [
  "floor",
  "directionFaces",
  "propertySubType",
];

/** The attribute a grid column shows, if it shows one. */
export function attributeOfColumn(key: string): UnitAttributeField | undefined {
  return (Object.keys(ATTRIBUTE_COLUMN) as UnitAttributeField[]).find(
    (f) => ATTRIBUTE_COLUMN[f] === key,
  );
}

/** The cells of the given attributes as typed cells: numbers, a floor, and two single choices. */
export function attributeCellFields(
  fields: readonly UnitAttributeField[],
  words: UnitAttributeWords,
): CustomCellField[] {
  return fields.map((attribute) => {
    const base = {
      code: attribute,
      key: ATTRIBUTE_COLUMN[attribute],
      header: words.names[attribute],
      attribute,
    };
    if (attribute === "directionFaces")
      return { ...base, kind: "single_select", options: DIRECTION_VALUES };
    if (attribute === "propertySubType")
      return {
        ...base,
        kind: "single_select",
        options: PROPERTY_SUB_TYPES.map((v) => words.subTypes[v]),
      };
    return {
      ...base,
      kind: attribute === "floor" ? "text" : "number",
      options: [],
    };
  });
}

/** What the five cells of a listing show: its effective values, a sub type by its word. */
export function attributeCells(
  own: OwnAttributes,
  catalog: CatalogAttributes | null | undefined,
  words: UnitAttributeWords,
): Partial<GridRow> {
  const e = effectiveAttributes(own, catalog);
  const subType = e.propertySubType.value;
  return {
    "Unit.livingArea": e.livingArea.value,
    "Unit.floor": e.floor.value,
    "Unit.bedroomsTotal": e.bedroomsTotal.value,
    "Unit.directionFaces": e.directionFaces.value,
    "Unit.propertySubType": subType === null ? null : words.subTypes[subType],
  } as Partial<GridRow>;
}

/** The change one cell sends: the shown value read back to the stored one; null takes the catalog's value again. */
export function attributeChange(
  attribute: UnitAttributeField,
  shown: string | number | boolean | null,
  words: UnitAttributeWords,
): UnitAttributesChange {
  if (shown === null) return { field: "unitAttributes", [attribute]: null };
  if (attribute === "propertySubType") {
    const code = PROPERTY_SUB_TYPES.find((v) => words.subTypes[v] === shown);
    return { field: "unitAttributes", propertySubType: code ?? null };
  }
  return { field: "unitAttributes", [attribute]: shown } as UnitAttributesChange;
}

/** The change that puts back what a listing held of `attributes` before an edit: its own values and their sources. */
export function attributeUndo(
  before: OwnAttributes,
  attributes: readonly UnitAttributeField[],
): UnitAttributesChange {
  const back: UnitAttributesChange = { field: "unitAttributes" };
  const sources: NonNullable<UnitAttributesChange["sources"]> = {};
  for (const f of attributes) {
    const value = before[f];
    (back as Record<string, unknown>)[f] = value ?? null;
    if (value !== undefined && before[SOURCE_OF[f]] === "File") sources[f] = "File";
  }
  return Object.keys(sources).length > 0 ? { ...back, sources } : back;
}

/** The sub type word a cell shows, read back to its value. */
export const subTypeOf = (
  shown: unknown,
  words: UnitAttributeWords,
): ListingPropertySubType | undefined =>
  PROPERTY_SUB_TYPES.find((v) => words.subTypes[v] === shown);
