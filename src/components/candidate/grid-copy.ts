// Every sentence of the shared grid and its region states, in one file for the reviewer (design/language.md).
// Region and column names are not here: screens pass them in through label().
import type { DataGridI18nOverrides } from "@/components/reui/data-grid/data-grid-i18n";

export const GRID_COPY = {
  rowCount: (total: number) => `${total} dòng`,
  /** Header of the row-number column, and what a screen reader hears for it. */
  rowNumberHeader: "#",
  rowNumberLabel: "Số thứ tự dòng",
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
    why: "Vùng này chưa có dòng nào vì chưa ai thêm hay nhập dữ liệu vào.",
  },
  noMatch: {
    title: "Không có dòng nào khớp",
    why: "Chữ bạn gõ không có trong dòng nào của vùng này.",
    whyFiltered: "Không dòng nào của vùng này khớp cùng lúc ô tìm và các ô lọc đang bật.",
  },
  /** The «…» of a row or a record (row 9e): its button's name, and the header of the grid's last column. */
  rowActions: {
    more: (title: string) => `Việc khác — ${title}`,
    column: "Việc",
  },
  /** Using the grid by hand like a sheet (row 2a): filter row, columns, grouping, selection. */
  sheet: {
    filter: "Lọc",
    filterOn: (count: number) => `Lọc (${count})`,
    columns: "Cột",
    fullScreen: "Toàn màn hình",
    leaveFullScreen: "Thoát toàn màn hình",
    columnsMenu: "Hiện cột",
    groupBy: (header: string) => `Nhóm theo ${header}`,
    clearFilters: "Xoá lọc",
    filterLabel: (header: string) => `Lọc cột ${header}`,
    textPlaceholder: "Chứa…",
    numberPlaceholder: "<=5, 2-5",
    moneyPlaceholder: "Tỷ <=5",
    datePlaceholder: "Ngày >14",
    valuesPlaceholder: "Chọn",
    invalidRule: "Chưa đọc được luật lọc: gõ như <=5, >2 hay 2-5",
    groupCount: (count: number) => `${count} dòng`,
    groupEmpty: "Chưa ghi",
    selected: (count: number) => `${count} ô đã chọn`,
    copyHint: "Ctrl+C để chép",
    copied: (count: number) => `Đã chép ${count} ô`,
  },
  error: {
    title: "Vùng này chưa tải được",
    why: "Đã có lỗi khi lấy dữ liệu, phần còn lại của màn vẫn dùng được.",
    next: "Bạn bấm «Thử lại»; nếu vẫn lỗi, tải lại trang sau ít phút.",
    /** When the screen has not wired a reload, there is no button to press. */
    nextNoRetry: "Bạn tải lại trang; nếu vẫn lỗi, mở lại màn này sau ít phút.",
  },
  partialEmpty: {
    title: "Dữ liệu của vùng chưa tải được",
    why: "Vùng này có dữ liệu nhưng lần tải vừa rồi hỏng trước khi lấy được dòng nào.",
    next: "Bạn bấm «Thử lại»; nếu vẫn lỗi, tải lại trang sau ít phút.",
    nextNoRetry: "Bạn tải lại trang; nếu vẫn lỗi, mở lại màn này sau ít phút.",
  },
  slow: {
    withCancel: "Vẫn đang tải, lâu hơn thường lệ. Bạn chờ thêm hoặc bấm «Huỷ» để dừng.",
    withoutCancel: "Vẫn đang tải, lâu hơn thường lệ. Bạn chờ thêm ít giây.",
  },
  cancel: "Huỷ",
  record: {
    previous: "Trước",
    next: "Sau",
    close: "Đóng",
    pin: "Ghim thành cột",
    unpin: "Bỏ ghim",
    resize: "Đổi rộng hồ sơ",
  },
  partial: {
    title: "Một số dòng chưa tải được",
    detail: "Các dòng đang hiện vẫn đúng và dùng được; bạn bấm «Thử lại» để tải phần còn thiếu.",
    detailNoRetry:
      "Các dòng đang hiện vẫn đúng và dùng được; bạn tải lại trang để lấy phần còn thiếu.",
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
    toggleColumns: GRID_COPY.sheet.columnsMenu,
    pinColumnStart: "Ghim bên trái",
    pinColumnEnd: "Ghim bên phải",
    unpinColumn: (title) => `Bỏ ghim ${title}`,
    columnsMenu: "Cột",
    moveColumnStart: "Dời sang trái",
    moveColumnEnd: "Dời sang phải",
    expandRow: "Mở nhóm",
    collapseRow: "Gập nhóm",
    filterSelectedCount: (count) => `${count} đã chọn`,
  },
};
