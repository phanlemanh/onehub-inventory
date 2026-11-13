// Frame words of roadmap row 3f (_acceptance/loi-vao-ho-so): copying a record's link and the top-bar search.
// Concept names are passed in from the label table (label()); only the frame words around them live here.

const lower = (noun: string) => noun.toLocaleLowerCase("vi");

export const ENTRY_COPY = {
  copyLink: "Chép đường dẫn",
  copied: "Đã chép đường dẫn",
  copyFailed: "Chưa chép được. Bạn chép đường dẫn trong ô địa chỉ của trình duyệt.",
  /** The link named a listing that is no longer on the inventory. */
  staleLink: (unit: string, inventory: string) =>
    `${unit} trong đường dẫn không còn trong ${inventory}.`,
  search: (unit: string) => `Gõ mã ${lower(unit)}`,
  searchHint: (unit: string) => `Gõ mã ${lower(unit)}…`,
  searchWhy: (unit: string, inventory: string) =>
    `Gõ mã ${lower(unit)}, tên toà hay dự án rồi Enter để lọc ${inventory}.`,
  /** One suggestion of a code in several buildings: «0601 · T1, T2, T3». */
  inBuildings: (code: string, buildings: readonly string[]) =>
    buildings.length ? `${code} · ${buildings.join(", ")}` : code,
  searchEmpty: (unit: string, inventory: string) =>
    `Không có ${lower(unit)} nào khớp — Enter để lọc ${inventory} theo chữ này.`,
} as const;
