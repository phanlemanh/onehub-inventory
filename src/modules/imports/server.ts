import "server-only";

// Server API of the imports module (row 11, nhap-excel): the handlers behind /api/v1/imports, through the identity
// module's shared action door and its query door, withCompany.
import { actionDoor, withCompany } from "@/modules/identity/server";

import { createImportsHandlers, type ImportsHandlers } from "./imports-http";

export { createImportsHandlers, type ImportsDeps, type ImportsHandlers } from "./imports-http";
export { listingIdOf, BATCH_ROWS } from "./store";

let handlers: ImportsHandlers | undefined;

/** The handlers behind /api/v1/imports. */
export function importsHandlers(): ImportsHandlers {
  handlers ??= createImportsHandlers({ door: actionDoor, withCompany });
  return handlers;
}
