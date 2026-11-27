// Public, browser-safe API of the listings module. Server code goes in ./server.ts.
// Sample data (roadmap row 1): compose catalog → listings → contacts by passing ids, see _acceptance/du-lieu-mau/design.md.
export * from "./sample";
// Row 10: what the inventory reads for one company, from the database or the sample company.
export * from "./inventory-data";
// Full unit record (row 3b): completeness, confirmation age, listings of a unit, unit kind.
export * from "./record";
// Edit rules (roadmap row 4, _acceptance/sua-tren-o): reading a typed price, asking again, status moves and needs.
export * from "./edit-rules";
// The save door of an edit (row 4): the four outcomes of the real write path, on the sample listings until row 10.
export * from "./save-door";
// Reading one pasted cell (row 5, _acceptance/dan-tu-excel): a pasted word on a price or a status, by the row 4 rules.
export * from "./paste-rules";
// Saved views (row 2c): what a view holds and the one name rule, shared by the naming dialog and the API.
export {
  checkViewName,
  normalizeViewName,
  SAVED_VIEW_NAME_MAX,
  SAVED_VIEW_SCREENS,
  SAVED_VIEWS_BASE_PATH,
  SavedViewState,
  type SavedView,
  type SavedViewNameError,
  type SavedViewScreen,
} from "./saved-view";
// Asking the listing agent and reporting wrong unit details (row 3e): the two internal messages, pure.
export {
  askListAgentMessage,
  recordLink,
  REPORT_BASIS_MAX,
  REPORT_RIGHT_MAX,
  reportReady,
  reportTitle,
  unitErrorReport,
  type UnitErrorReport,
} from "./messages";
export * from "./custom-rules";
// A listing's own values of five unit attributes (row 3h): which value wins over the catalog, and the readers.
export * from "./unit-attributes";
