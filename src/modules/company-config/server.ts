import "server-only";

import { actionDoor, sessionDoor, withCompany } from "@/modules/identity/server";

import { createCompanyLayerHandlers, type CompanyLayerHandlers } from "./company-layer-http";
import { createFeeScheduleHandlers, type FeeScheduleHandlers } from "./fee-schedule-http";
import { readFeeSchedule, type FeeScheduleView } from "./fee-store";
import { readLayer, type CompanyLayer, type RunAs } from "./store";

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
  readFeeSchedule,
  saveFeeSchedule,
  type FeeItemSource,
  type FeeItemView,
  type FeeSaveResult,
  type FeeScheduleView,
} from "./fee-store";

export { createFeeScheduleHandlers, type FeeScheduleHandlers } from "./fee-schedule-http";

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

/**
 * The signed-in person's company layer, for screens that read the company's words (the inventory, row 7e); null when
 * there is no session, the person's roles cannot read it, or the database could not be read — the screen then shows
 * the standard words, never another company's.
 */
export async function myCompanyLayer(): Promise<CompanyLayer | null> {
  try {
    const door = await sessionDoor("readCompanyLayer");
    if (typeof door === "string") return null;
    const run: RunAs = (fn) => withCompany(door.pool, door.ctx, fn);
    return await readLayer(run);
  } catch (err) {
    console.error("[lop-rieng] không đọc được:", err instanceof Error ? err.message : "không rõ");
    return null;
  }
}

let feeHandlers: FeeScheduleHandlers | undefined;

/** The handlers behind /api/v1/company/fee-schedule (row 19). */
export function feeScheduleHandlers(): FeeScheduleHandlers {
  feeHandlers ??= createFeeScheduleHandlers({ door: actionDoor, withCompany });
  return feeHandlers;
}

/**
 * The fee schedule of the signed-in person's company, for the inventory's net-to-seller column (row 19); null when there is
 * no session, the person's roles cannot read it, or the database could not be read — the column then stays empty,
 * never another company's numbers.
 */
export async function myFeeSchedule(): Promise<FeeScheduleView | null> {
  try {
    const door = await sessionDoor("readFeeSchedule");
    if (typeof door === "string") return null;
    const run: RunAs = (fn) => withCompany(door.pool, door.ctx, fn);
    return await readFeeSchedule(run);
  } catch (err) {
    console.error("[thue-phi] không đọc được:", err instanceof Error ? err.message : "không rõ");
    return null;
  }
}
