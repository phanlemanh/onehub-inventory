// Words of the listing's own unit attributes (row 3h), from the label table: one set for every page that shows the
// attributes or their mark — the inventory and its unit record, and the import's preview.
import { label } from "@/modules/company-config";
import type { UnitAttributeWords } from "@/modules/listings/ui";

export const ATTRIBUTE_WORDS: UnitAttributeWords = {
  names: {
    livingArea: label("LivingArea"),
    floor: label("UnitFloorLocation"),
    bedroomsTotal: label("BedroomsTotal"),
    directionFaces: label("DirectionFaces"),
    propertySubType: label("PropertySubType"),
  },
  subTypes: {
    Condominium: label("SubTypeCondominium"),
    Townhouse: label("SubTypeTownhouse"),
    "Single Family Residence": label("SubTypeSingleFamily"),
    "Unimproved Land": label("SubTypeLand"),
  },
  sources: {
    Typed: label("SourceTyped"),
    File: label("SourceFile"),
    Catalog: label("SourceCatalog"),
  },
  catalog: label("Catalog"),
  differs: label("DiffersFromCatalog"),
  revert: label("RevertToCatalog"),
  edit: label("Edit"),
  unit: label("Unit"),
};
