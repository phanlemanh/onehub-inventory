// Every sentence of the shared grid and its region states, in one file for the reviewer (design/language.md).
// Region and column names are not here: screens pass them in through label().
import type { DataGridI18nOverrides } from "@/components/reui/data-grid/data-grid-i18n";

export const GRID_COPY = {
  rowCount: (total: number) => `${total} dòng`,
  filteredCount: (shown: number, total: number) => `${shown} / ${total} dòng`,
  searchLabel: "Tìm trong vùng",
  searchPlaceholder: "Gõ để tìm",
  yes: "Có",
  no: "Không",
  retry: "Thử lại",
  clearFilter: "Xoá lọc",
  lockedPrefix: "Ô đang khoá",
  empty: {
    title: "Chưa có dữ liệu ở đây",
  },
  noMatch: {
    title: "Không có dòng nào khớp",
    why: "Chữ bạn gõ không có trong dòng nào của vùng này.",
  },
  error: {
    title: "Vùng này chưa tải được",
    why: "Đã có lỗi khi lấy dữ liệu, phần còn lại của màn vẫn dùng được.",
    next: "Bạn bấm «Thử lại»; nếu vẫn lỗi, tải lại trang sau ít phút.",
  },
  partial: {
    title: "Một số dòng chưa tải được",
    detail: "Các dòng đang hiện vẫn đúng và dùng được; bạn bấm «Thử lại» để tải phần còn thiếu.",
  },
  forbidden: {
    title: "Bạn chưa có quyền xem vùng này",
    why: "Vai của bạn ở sàn chưa được mở vùng dữ liệu này.",
    next: "Bạn hỏi quản trị sàn nếu cần xem.",
  },
} as const;

/** The grid's own labels (ReUI defaults to English). */
export const GRID_I18N: DataGridI18nOverrides = {
  labels: {
    sortAscending: "Tăng dần",
    sortDescending: "Giảm dần",
    loading: "Đang tải",
    empty: GRID_COPY.empty.title,
    allRowsLoaded: "Đã tải đủ dòng",
    rowsPerPage: "Số dòng mỗi trang",
    paginationInfo: ({ from, to, count }) => `${from}–${to} / ${count}`,
    previousPage: "Trang trước",
    nextPage: "Trang sau",
    goToPage: (page) => `Tới trang ${page}`,
    filterNoResults: GRID_COPY.noMatch.title,
    filterClear: GRID_COPY.clearFilter,
  },
};
