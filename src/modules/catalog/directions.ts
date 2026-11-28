// The eight directions a unit faces, as the shared catalog writes them (row 7d sample): the closed set a company's
// spelling maps to (row 7e) and a listing's own direction is chosen from (row 3h). One list, owned by the catalog.

export const DIRECTION_VALUES = [
  "Bắc",
  "Nam",
  "Đông",
  "Tây",
  "Đông Bắc",
  "Đông Nam",
  "Tây Bắc",
  "Tây Nam",
] as const;
export type DirectionValue = (typeof DIRECTION_VALUES)[number];
