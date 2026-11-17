// Every sentence of the paste preview (row 5), in one file for the reviewer (design/language.md). Concept words (the
// unit, the columns) come from the screen through label(); this file holds only the grid's own words about cells.

export const PASTE_COPY = {
  /** The line under the title: what the paste does, cell by cell. */
  count: (counts: { change: number; skip: number; wrong: number; same: number }) =>
    [
      `${counts.change} ô sẽ đổi`,
      counts.skip > 0 ? `${counts.skip} ô bị bỏ` : null,
      counts.wrong > 0 ? `${counts.wrong} ô sai kiểu` : null,
      counts.same > 0 ? `${counts.same} ô giữ nguyên` : null,
    ]
      .filter(Boolean)
      .join(" · "),
  nothing: "Không ô nào đổi được",
  changes: "Sẽ đổi",
  skipped: "Bị bỏ",
  wrong: "Sai kiểu",
  apply: (count: number) => `Áp ${count} ô`,
  busy: "Đang áp…",
  /** What a screen reader hears for a line's check box. */
  pick: (line: string) => `Áp ô ${line}`,
  noUndo: "Không hoàn tác được",
  /** Read between the old and the new value by a screen reader (the arrow is hidden from it). */
  becomes: "thành",
  /** The part of a pasted region that fell outside the grid. */
  beyondRows: (count: number) => `${count} dòng thừa dưới đáy bảng — dán không thêm dòng`,
  beyondColumns: (count: number) => `${count} cột thừa bên phải bảng`,
  /** A pasted cell on a group's header row. */
  groupRow: (label: string) => `Dòng nhóm «${label}»`,
  /** After the apply, and after its undo. */
  done: (cells: number, records: string) => `Đã đổi ${cells} ô của ${records}.`,
  partly: (saved: number, failed: number, why: string) =>
    `Đã đổi ${saved} ô; ${failed} ô chưa ghi được — ${why}.`,
  noneSaved: (why: string) => `Chưa ô nào được ghi — ${why}.`,
  undone: (cells: number) => `Đã hoàn tác ${cells} ô.`,
  undoneExcept: (cells: number, kept: number) =>
    `Đã hoàn tác ${cells} ô; ${kept} ô không hoàn tác được.`,
  /** Why a write failed, in the words of row 4. */
  why: {
    offline: "mất kết nối mạng",
    conflict: "dòng vừa đổi từ chỗ khác, tải lại trang để thấy bản mới",
    refused: "không đủ quyền",
    fault: "máy chủ báo lỗi",
    expired: "phiên đăng nhập đã hết, đăng nhập lại",
  },
  undoFailed: (still: string, why: string) =>
    `Chưa hoàn tác được — ${why}. Vẫn mang giá trị mới: ${still}.`,
} as const;
