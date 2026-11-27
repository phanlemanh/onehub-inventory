// Words of the import screen (row 11, nhap-excel) that are not concepts of ontology/labels.yaml; concept words come from
// label(). Plain Vietnamese, each at most one sentence.
import type { ReadProblem } from "../read-file";
import { label } from "@/modules/company-config";

import type { LearnedItem } from "../learned";
import type { Mark } from "../mark";

export const STEP_WORDS = ["Chọn tệp", "Ghép cột", "Giá trị và mã", "Xem trước", "Xong"] as const;

export const IMPORT_COPY = {
  drop: "Kéo tệp vào đây hoặc bấm để chọn",
  limits: ".xlsx hoặc .csv, tối đa 10 MB và 5.000 dòng. Google Sheet: Tệp → Tải xuống.",
  otherSheets: "Không đọc các trang tính khác:",
  reading: "Đang đọc tệp…",
  chooseAgain: "Chọn tệp khác",
  next: "Tiếp",
  back: "Quay lại",
  apply: (n: number, kept: number) =>
    kept > 0 ? `Áp ${n} dòng · ${kept} ô giữ chữ gốc` : `Áp ${n} dòng`,
  blocked: (n: number) => `Còn ${n} chỗ chặn`,
  rows: (n: number) => `${n} dòng`,
  cells: (n: number) => `${n} ô`,
  learnLabel: (h: string) => `Gọi cột này là «${h}» trên bảng`,
  remember: "Nhớ cho lần sau",
  keepAsWritten: "Giữ chữ gốc",
  skipColumn: "Bỏ cột",
  /** A team lead imports for one list agent of the company (Hỏi-7). */
  pickAgent: `Nhập cho ${label("ListAgent")} nào?`,
  skipRow: "Bỏ dòng",
  keepRow: "Lấy lại dòng",
  pendingDefault: "Giữ nguyên mã, chờ khớp danh mục",
  columnHead: "Cột của tệp",
  targetHead: "Đi vào",
  markHead: "Dấu",
  whyHead: "Vì sao",
  inColumn: (raw: string, col: string, n: number) => `«${raw}» ở cột ${col} · ${n} ô`,
  noQuestion: "Không còn câu nào phải trả lời.",
  done: (n: number) => `Đã thêm ${n} dòng`,
  learned: "Vừa học cho lần sau",
  /** One item learned: the word of its concept (label()), a colon, then the name the person gave it. */
  learnedItem: (item: LearnedItem) => `${label(item.concept)}: ${item.name}`,
  undo: "Hoàn tác lần nhập",
  undone: "Đã hoàn tác lần nhập.",
  undoneShort: "đã hoàn tác",
  undoneKept: (codes: string[]) =>
    `Đã hoàn tác lần nhập. Còn ${codes.length} căn chưa gỡ vì đã có người sửa sau lần nhập: ${codes.join(", ")}.`,
  undoFailed: "Chưa gỡ căn nào — máy chủ chưa hoàn tác được. Lần nhập vẫn còn nguyên.",
  undoOffline: "Chưa gỡ căn nào — mất kết nối mạng. Lần nhập vẫn còn nguyên.",
  keptCells: (n: number) => `${n} ô giữ chữ gốc của tệp`,
  recent: "Lần nhập gần đây",
  recentFailed: "Chưa đọc được lần nhập gần đây — vẫn nạp tệp được.",
  offline: "Chưa ghi gì — mất kết nối mạng.",
  retry: "Thử lại",
  changed: "Dữ liệu của sàn vừa đổi — xem lại trước khi áp.",
  failed: "Chưa ghi được — lỗi máy chủ.",
  phone: "Màn này dùng trên máy tính.",
};

export const MARK_WORDS: Record<Mark, string> = {
  keep: "Giữ nguyên",
  fixed: "Máy sửa",
  ask: "Cần người",
  block: "Chặn",
};

export const PROBLEM_WORDS: Record<ReadProblem, string> = {
  "wrong-type": "Tệp không phải .xlsx hay .csv. Lưu lại dưới dạng .xlsx rồi chọn lại.",
  "too-big": "Tệp lớn hơn 10 MB. Tách tệp rồi nạp từng phần.",
  "too-many-rows": "Tệp có hơn 5.000 dòng. Tách tệp rồi nạp từng phần.",
  empty: "Tệp không có dữ liệu.",
  "header-only": "Tệp không có dòng nào dưới dòng tiêu đề.",
  broken: "Không đọc được tệp này. Mở bằng Excel, lưu lại rồi chọn lại.",
  locked: "Tệp đang khoá bằng mật khẩu. Bỏ khoá rồi chọn lại.",
};

export const WHY_WORDS: Record<string, string> = {
  template: "Theo mẫu nhập của sàn",
  "company-label": "Trùng tên sàn đặt",
  "standard-label": "Trùng tên chuẩn",
  "header-dictionary": "Cách viết hay gặp",
  unknown: "Tên cột lạ — chọn nơi đi vào",
  "same-target": "Hai cột cùng đi vào một chỗ",
  "no-unit-column": "Tệp chưa có cột mã",
  "owner-column": "Số và tên chủ nhà chưa nhập ở đây — bỏ cột",
  "field-refused":
    "Không thêm được trường này: tên trống, trùng tên hay đã đủ 20 trường — chọn chỗ khác hoặc bỏ cột",
  "code-too-long": "Mã dài quá 80 ký tự — sửa trong tệp rồi nạp lại",
  "target-retired": "Trường đã ngừng — chọn lại",
  chosen: "Người chọn",
};
