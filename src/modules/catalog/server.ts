import "server-only";

// Server API of the catalog module (row 7d): statements that load a catalog into the shared catalog tables, run by
// the table owner — the API role only reads the shared catalog.
export { catalogLoadStatements, type Statement } from "./load-sql";
