import "server-only";

// Server API of the catalog module (row 7d): statements that load a catalog into the shared catalog tables, run by
// the table owner — the API role only reads the shared catalog.
export { catalogLoadStatements, type Statement } from "./load-sql";
// Row 10: the units a company's listings offer, read on the caller's client inside its withCompany.
export {
  readCatalogUnits,
  readCatalogUnitsByKey,
  type CatalogUnitRead,
  type QueryClient,
} from "./read-units";
// Row 11 (nhap-excel): a company code learned while importing a file, and its undo.
export { addCompanyUnitCode, retireCompanyUnitCode } from "./company-alias";
