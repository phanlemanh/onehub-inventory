// Public, browser-safe API of the listings module. Server code goes in ./server.ts.
// Sample data (roadmap row 1): compose catalog → listings → contacts by passing ids, see _acceptance/du-lieu-mau/design.md.
export * from "./sample";
// Edit rules (roadmap row 4, _acceptance/sua-tren-o): reading a typed price, asking again, status moves and needs.
export * from "./edit-rules";
// The save door of an edit (row 4): the four outcomes of the real write path, on the sample listings until row 10.
export * from "./save-door";
