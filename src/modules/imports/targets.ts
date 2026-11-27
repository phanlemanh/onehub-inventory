// Where a column of an imported file can go (row 11, nhap-excel): the standard fields an import writes, the words a
// header is matched against, and the closed sets of values with the concept that names each value. Words come from
// ontology/labels.yaml through label(); the header dictionary holds the short spellings sheets use, folded.
import { fold, type FieldKind } from "@/modules/company-config";
import type { ConceptCode } from "@/generated/labels";
import type { UnitAttributeField } from "@/modules/listings";

export const STANDARD_TARGETS = [
  "unitCode",
  "Unit.buildingName",
  "Unit.livingArea",
  "Unit.bedroomsTotal",
  "Unit.directionFaces",
  "Unit.floor",
  "Unit.propertySubType",
  "Listing.listPrice",
  "Listing.feeInclusion",
  "Listing.standardStatus",
  "Listing.withdrawnReason",
  "Listing.closePrice",
  "Listing.closeDate",
  "Listing.furnished",
  "Listing.occupantType",
  "Listing.legalStatus",
  "Listing.financing",
  "Listing.lastConfirmedAt",
] as const;
export type StandardTarget = (typeof STANDARD_TARGETS)[number];

export type Target =
  | { standard: StandardTarget }
  | { custom: string }
  | { newField: { name: string; kind: FieldKind; options: string[] } }
  | { skip: true };

/** Row 3h: the import's unit attribute targets and the listing's own value each one fills (source «File»). */
export const FILE_VALUE_OF: Partial<Record<StandardTarget, UnitAttributeField>> = {
  "Unit.livingArea": "livingArea",
  "Unit.floor": "floor",
  "Unit.bedroomsTotal": "bedroomsTotal",
  "Unit.directionFaces": "directionFaces",
  "Unit.propertySubType": "propertySubType",
};

/** The concept whose label names each standard target (its column header on the inventory or the record). */
export const TARGET_CONCEPT: Record<StandardTarget, ConceptCode> = {
  unitCode: "Unit",
  "Unit.buildingName": "Building",
  "Unit.livingArea": "LivingArea",
  "Unit.bedroomsTotal": "BedroomsTotal",
  "Unit.directionFaces": "DirectionFaces",
  "Unit.floor": "UnitFloorLocation",
  "Unit.propertySubType": "PropertySubType",
  "Listing.listPrice": "ListPrice",
  "Listing.feeInclusion": "FeeInclusion",
  "Listing.standardStatus": "StandardStatus",
  "Listing.withdrawnReason": "WithdrawnReason",
  "Listing.closePrice": "ClosePrice",
  "Listing.closeDate": "CloseDate",
  "Listing.furnished": "Furnished",
  "Listing.occupantType": "OccupantType",
  "Listing.legalStatus": "LegalStatus",
  "Listing.financing": "Financing",
  "Listing.lastConfirmedAt": "LastConfirmedAt",
};

/** The 7e template target of a standard target (an import template stores field names of the display register). */
export const TEMPLATE_FIELD: Record<StandardTarget, string> = {
  unitCode: "Unit.unitNumber",
  "Unit.buildingName": "Unit.buildingName",
  "Unit.livingArea": "Unit.livingArea",
  "Unit.bedroomsTotal": "Unit.bedroomsTotal",
  "Unit.directionFaces": "Unit.directionFaces",
  "Unit.floor": "Unit.floor",
  "Unit.propertySubType": "Unit.propertySubType",
  "Listing.listPrice": "Listing.listPrice",
  "Listing.feeInclusion": "Listing.feeInclusion",
  "Listing.standardStatus": "Listing.standardStatus",
  "Listing.withdrawnReason": "Listing.withdrawnReason",
  "Listing.closePrice": "Listing.closePrice",
  "Listing.closeDate": "Listing.closeDate",
  "Listing.furnished": "Listing.furnished",
  "Listing.occupantType": "Listing.occupantType",
  "Listing.legalStatus": "Listing.legalStatus",
  "Listing.financing": "Listing.financing",
  "Listing.lastConfirmedAt": "Listing.lastConfirmedAt",
};

/**
 * Spellings sheets use for a header, folded (see fold), and the standard target with what the header says beyond it:
 * «Giá KBP» is the asking price with fees excluded. Matched only after the template and the labels.
 */
export const HEADER_DICTIONARY: Record<
  string,
  { target: StandardTarget; implies?: { feeInclusion: "Excluded" | "Included" } }
> = {
  "ma can": { target: "unitCode" },
  ma: { target: "unitCode" },
  "can so": { target: "unitCode" },
  "ma can ho": { target: "unitCode" },
  block: { target: "Unit.buildingName" },
  toa: { target: "Unit.buildingName" },
  "toa nha": { target: "Unit.buildingName" },
  dt: { target: "Unit.livingArea" },
  "dien tich": { target: "Unit.livingArea" },
  "dt (m2)": { target: "Unit.livingArea" },
  pn: { target: "Unit.bedroomsTotal" },
  "phong ngu": { target: "Unit.bedroomsTotal" },
  "so pn": { target: "Unit.bedroomsTotal" },
  huong: { target: "Unit.directionFaces" },
  tang: { target: "Unit.floor" },
  "loai can": { target: "Unit.propertySubType" },
  "loai hinh": { target: "Unit.propertySubType" },
  gia: { target: "Listing.listPrice" },
  "gia ban": { target: "Listing.listPrice" },
  "gia kbp": { target: "Listing.listPrice", implies: { feeInclusion: "Excluded" } },
  "gia bp": { target: "Listing.listPrice", implies: { feeInclusion: "Included" } },
  phi: { target: "Listing.feeInclusion" },
  tt: { target: "Listing.standardStatus" },
  "tinh trang": { target: "Listing.standardStatus" },
  "noi that": { target: "Listing.furnished" },
  "phap ly": { target: "Listing.legalStatus" },
  "ngay check": { target: "Listing.lastConfirmedAt" },
  "cap nhat": { target: "Listing.lastConfirmedAt" },
  "ngay cap nhat": { target: "Listing.lastConfirmedAt" },
  "ngay xac nhan": { target: "Listing.lastConfirmedAt" },
};

/**
 * Headers of the owner's name or a phone: those go on the unit's record (row 11b), never into this import (Hỏi-12). A
 * header is read by its folded words: any phrase below as whole words anywhere in it, so «SĐT chủ nhà», «Tên chủ nhà»,
 * «Số ĐT», «Phone» are caught while «DT» (living area) and «Ghi chú» are not.
 */
export const OWNER_PHRASES = [
  // phones and other ways to reach a person
  "sdt",
  "so dt",
  "dt chu",
  "dt cn",
  "dien thoai",
  "phone",
  "tel",
  "mobile",
  "zalo",
  "lien he",
  "lien lac",
  // the owner by name
  "chu nha",
  "ten chu",
  "so chu",
  "chu can",
  "chu so huu",
].map(fold);

/** Whether a folded header names the owner or a phone (see OWNER_PHRASES). */
export function isOwnerFolded(folded: string): boolean {
  const padded = ` ${folded.replace(/[^a-z0-9]+/g, " ").trim()} `;
  return OWNER_PHRASES.some((p) => padded.includes(` ${p} `));
}

/** Closed sets of standard values: the stored value and the concept whose label is its word. */
export const VALUE_CONCEPTS: Partial<Record<StandardTarget, Record<string, ConceptCode>>> = {
  "Unit.propertySubType": {
    Condominium: "SubTypeCondominium",
    Townhouse: "SubTypeTownhouse",
    "Single Family Residence": "SubTypeSingleFamily",
    "Unimproved Land": "SubTypeLand",
  },
  "Listing.standardStatus": {
    Incomplete: "StatusIncomplete",
    Active: "StatusActive",
    Pending: "StatusPending",
    Closed: "StatusClosed",
    Hold: "StatusHold",
    Withdrawn: "StatusWithdrawn",
  },
  "Listing.feeInclusion": { Included: "FeeIncluded", Excluded: "FeeExcluded" },
  "Listing.furnished": {
    Furnished: "FurnishedFull",
    Partially: "FurnishedPartial",
    Unfurnished: "FurnishedNone",
  },
  "Listing.occupantType": {
    Owner: "OccupantOwner",
    Tenant: "OccupantTenant",
    Vacant: "OccupantVacant",
  },
  "Listing.withdrawnReason": {
    sold_elsewhere: "WithdrawnSoldElsewhere",
    owner_changed_mind: "WithdrawnOwnerChangedMind",
    unreachable: "WithdrawnUnreachable",
  },
};

/** Short spellings of standard values sheets use, folded; the company's own spellings come from its dictionary. */
export const VALUE_DICTIONARY: Partial<Record<StandardTarget, Record<string, string>>> = {
  "Unit.propertySubType": {
    "chung cu": "Condominium",
    "can ho chung cu": "Condominium",
    shophouse: "Townhouse",
    "lien ke": "Townhouse",
  },
  "Listing.feeInclusion": {
    kbp: "Excluded",
    bp: "Included",
    "khong bao phi": "Excluded",
    "bao phi": "Included",
  },
};

/** The concepts whose standard words a new custom field may not take as its name (the company layer's rule). */
export const STANDARD_HEADER_CONCEPTS = [
  "Unit",
  "Building",
  "Subdivision",
  "StandardStatus",
  "ListPrice",
  "LivingArea",
  "BedroomsTotal",
  "LastConfirmedAt",
] as const;
