// Public, browser-safe API of the catalog module. Server code goes in ./server.ts.
// Sample data (roadmap row 1): compose catalog → listings → contacts by passing ids, see _acceptance/du-lieu-mau/design.md.
// Row 7d: the shared catalog stored like onehub-invest — keys, the unit-code reader, the code lookup.
export * from "./keys";
export * from "./lookup";
export * from "./sample";
export * from "./unit-code";
