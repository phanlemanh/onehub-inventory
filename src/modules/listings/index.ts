// Public, browser-safe API of the listings module. Server code goes in ./server.ts.
// Sample data (roadmap row 1): compose catalog → listings → contacts by passing ids, see _acceptance/du-lieu-mau/design.md.
export * from "./sample";
// Saved views (row 2c): what a view holds and the one name rule, shared by the naming dialog and the API.
export {
  checkViewName,
  normalizeViewName,
  SAVED_VIEW_NAME_MAX,
  SAVED_VIEW_SCREENS,
  SavedViewState,
  type SavedView,
  type SavedViewNameError,
  type SavedViewScreen,
} from "./saved-view";
