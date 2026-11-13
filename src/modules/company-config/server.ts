import "server-only";

import { actionDoor, withCompany } from "@/modules/identity/server";

import { createCompanyLayerHandlers, type CompanyLayerHandlers } from "./company-layer-http";

// Server API of the company-config module (row 7e, decision 0029): the company layer's store. Every function takes the
// caller's RunAs — a transaction opened through the identity module's door, withCompany — so nothing here reads a
// session or a table by itself.
export {
  LABELABLE_CONCEPTS,
  LAYER_PARTS,
  addAlias,
  addField,
  addLabel,
  addPendingUnit,
  editAlias,
  editField,
  editLabel,
  findTemplate,
  lookupInCompany,
  matchPendingUnits,
  readLayer,
  renameTemplate,
  resolveSpelling,
  retireItem,
  saveTemplate,
  type CodeLookupResult,
  type CompanyLayer,
  type LabelableConcept,
  type LayerAlias,
  type LayerField,
  type LayerLabel,
  type LayerPart,
  type LayerPendingUnit,
  type LayerProblem,
  type LayerTemplate,
  type RunAs,
  type TemplateTarget,
  type Write,
} from "./store";

export {
  createCompanyLayerHandlers,
  type CompanyLayerDeps,
  type CompanyLayerHandlers,
} from "./company-layer-http";

let handlers: CompanyLayerHandlers | undefined;

/** The handlers behind /api/v1/company-layer. */
export function companyLayerHandlers(): CompanyLayerHandlers {
  handlers ??= createCompanyLayerHandlers({ door: actionDoor, withCompany });
  return handlers;
}
