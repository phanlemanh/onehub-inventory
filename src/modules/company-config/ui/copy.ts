// Every sentence of the screen the company layer screen (row 7e), in one file for the reviewer (design/language.md).
// Concept names — the screen, the five parts, the add, rename, match and retire buttons — come from label().
import type { ConceptCode } from "@/generated/labels";

import type { FieldKind } from "../rules";
import type { LayerProblem } from "../store";

export const LAYER_PARTS_SHOWN = ["nhan", "truong", "tu-dien", "can-cho", "mau"] as const;
export type ShownPart = (typeof LAYER_PARTS_SHOWN)[number];

/** The concept each part is named by in the label table. */
export const PART_TITLE: Record<ShownPart, ConceptCode> = {
  nhan: "CompanyLabel",
  truong: "CustomField",
  "tu-dien": "ValueDictionary",
  "can-cho": "PendingUnit",
  mau: "ImportTemplate",
};

export const LAYER_COPY = {
  screenWhy: "Những gì sàn đã gọi riêng, thêm riêng và nhớ riêng so với chuẩn chung.",
  partWhy: {
    nhan: "Chữ sàn dùng thay tên cột chuẩn.",
    truong: "Cột sàn có mà chuẩn chung không có, hiện sau các cột chuẩn.",
    "tu-dien": "Chữ sàn quen viết ứng với giá trị chuẩn nào.",
    "can-cho": "Những căn sàn có mà danh mục chung chưa có.",
    mau: "Dạng tệp Sheet đã nhập và cột nào đi vào đâu.",
  } satisfies Record<ShownPart, string>,
  empty: {
    nhan: "Chưa đặt chữ riêng nào. Chữ riêng cũng sinh ra khi nhập bảng hàng.",
    truong: "Chưa có cột riêng nào. Cột riêng cũng sinh ra khi nhập bảng hàng.",
    "tu-dien": "Chưa có cặp chữ nào. Các cặp chữ cũng sinh ra khi nhập bảng hàng.",
    "can-cho": "Không có căn nào chờ khớp với danh mục.",
    mau: "Chưa có mẫu nào. Mẫu sinh ra sau lần nhập bảng hàng đầu tiên.",
  } satisfies Record<ShownPart, string>,
  col: {
    concept: "Khái niệm chuẩn",
    own: "Chữ của sàn",
    name: "Tên trường",
    kind: "Kiểu",
    options: "Lựa chọn",
    field: "Trường",
    raw: "Chữ sàn viết",
    value: "Giá trị chuẩn",
    code: "Mã sàn gõ",
    state: "Tình trạng",
    template: "Tên mẫu",
    columns: "Số cột",
  },
  kinds: {
    text: "Chữ",
    number: "Số",
    date: "Ngày",
    single_select: "Chọn một",
    boolean: "Có/không",
  } satisfies Record<FieldKind, string>,
  waiting: "Chờ khớp",
  matchedState: "Đã khớp",
  save: "Lưu",
  add: "Thêm",
  saving: "Đang lưu",
  adding: "Đang thêm",
  labelWhy: (inventory: string) =>
    `Chữ này thay tên chuẩn trên ${inventory} của sàn. Trang gửi khách vẫn dùng tên chuẩn.`,
  fieldWhy: (inventory: string) =>
    `Cột mới hiện trên ${inventory} sau các cột chuẩn. Kiểu không đổi được sau khi tạo.`,
  fieldEditWhy: "Đặt lại tên hay lựa chọn của cột. Kiểu giữ nguyên để giá trị cũ không sai.",
  aliasWhy: "Lần nhập sau, chữ này được đọc thành giá trị chuẩn đã chọn.",
  renameWhy: "Tên giúp nhận ra mẫu khi nhập lần sau.",
  wordsLabel: "Chữ của sàn",
  nameLabel: "Tên trường",
  kindLabel: "Kiểu",
  kindLocked: "Kiểu không đổi được sau khi tạo.",
  optionsLabel: "Lựa chọn, mỗi dòng một lựa chọn",
  conceptLabel: "Khái niệm chuẩn",
  fieldLabel: "Trường",
  rawLabel: "Chữ sàn viết",
  valueLabel: "Giá trị chuẩn",
  templateNameLabel: "Tên mẫu",
  pick: "Chọn",
  retireWhat: "Mục này thôi dùng từ nay. Giá trị đã có trên căn vẫn giữ và vẫn xem lại được.",
  retired: (name: string) => `Đã ngừng dùng ${name}`,
  added: (name: string) => `Đã thêm ${name}`,
  saved: (name: string) => `Đã lưu ${name}`,
  matched: (matched: number, waiting: number) => `Đã khớp ${matched} căn, còn ${waiting} căn chờ`,
  failed:
    "Chưa lưu được. Máy chủ đang gặp lỗi, phần bạn đã gõ vẫn còn. Bạn bấm «Thử lại» sau ít phút.",
} as const;

/** Where a refusal of the store shows in a form, and what it says: under its own field, or under the form. */
export const PROBLEM_COPY: Partial<Record<LayerProblem, { at: string; text: string }>> = {
  "name-empty": { at: "name", text: "Gõ tên cột như sàn vẫn gọi." },
  "name-too-long": { at: "name", text: "Tên dài quá 40 ký tự. Bạn rút gọn lại." },
  "name-taken": {
    at: "name",
    text: "Tên này trùng một cột đang có hay một nhãn của sàn (không kể dấu và chữ hoa). Bạn chọn tên khác.",
  },
  "options-count": { at: "options", text: "Cột chọn một cần từ 1 đến 30 lựa chọn." },
  "options-duplicate": { at: "options", text: "Có hai lựa chọn giống nhau. Bạn bỏ bớt một." },
  "options-not-allowed": { at: "options", text: "Chỉ cột chọn một mới có lựa chọn." },
  "field-limit": {
    at: "form",
    text: "Đã có 20 cột riêng đang dùng. Thôi dùng một cột trước khi thêm cột mới.",
  },
  "kind-unknown": { at: "kind", text: "Chọn một kiểu trong danh sách." },
  "kind-fixed": { at: "kind", text: "Kiểu không đổi được sau khi tạo." },
  "concept-unknown": { at: "concept", text: "Chọn một khái niệm trong danh sách." },
  "label-empty": { at: "words", text: "Gõ chữ sàn muốn dùng." },
  "label-too-long": { at: "words", text: "Chữ dài quá. Bạn rút gọn lại." },
  "raw-empty": { at: "raw", text: "Gõ chữ sàn quen viết." },
  "raw-too-long": { at: "raw", text: "Chữ dài quá 40 ký tự. Bạn rút gọn lại." },
  "value-not-in-set": { at: "value", text: "Giá trị này không có trong trường đã chọn." },
  "field-no-set": { at: "field", text: "Trường này không có tập giá trị để ghép." },
  taken: { at: "form", text: "Mục này đã có. Bạn sửa mục đang có thay vì thêm mới." },
  "not-found": { at: "form", text: "Mục này không còn. Tải lại trang để thấy bản mới nhất." },
};
