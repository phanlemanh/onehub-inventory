// What one import taught the company (row 11, AC-8): each item by the concept of the company layer it went into and
// the name the person knows it by (the file, the column header, the spelling, the code). The Xong screen says it in the
// words of ontology/labels.yaml; the server never sends a machine word for the person to read.

/** The concepts of the company layer an import can add to. */
export type LearnedConcept =
  | "ImportTemplate"
  | "CompanyLabel"
  | "CustomField"
  | "CompanyValueAlias"
  | "CompanyCatalogAlias"
  | "PendingUnit";

export interface LearnedItem {
  concept: LearnedConcept;
  name: string;
}
