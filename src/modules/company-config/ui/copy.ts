// Every sentence of the screen the company layer screen (row 7e), in one file for the reviewer (design/language.md).
// Concept names — the screen, the five parts, the add, rename, match and retire buttons — come from label().
import type { ConceptCode } from "@/generated/labels";

import type { FieldKind } from "../rules";
import type { LayerPart, LayerProblem } from "../store";

/** The five parts shown as a grid (row 7e), named as the API names them (`/api/v1/company-layer/<part>`). */
export const GRID_PARTS = [
  "labels",
  "fields",
  "aliases",
  "pending-units",
  "templates",
] as const satisfies readonly LayerPart[];
export type GridPart = (typeof GRID_PARTS)[number];
/** Every part of the screen, in the order of the second column: the grid parts, then the fee part (row 19), named as
 * its API is (`/api/v1/company/fee-schedule`). */
export const LAYER_PARTS_SHOWN = [...GRID_PARTS, "fee-schedule"] as const;
export type ShownPart = (typeof LAYER_PARTS_SHOWN)[number];

/** The company layer screen's address. */
export const LAYER_ROUTE = "/company-layer";

/** The part a request opens: `?part=` when it names a part, else the first one. A repeated `?part=` keeps its first
 * value. */
export function layerPartFrom(query: Record<string, string | string[] | undefined>): ShownPart {
  const raw = query["part"];
  const asked = Array.isArray(raw) ? raw[0] : raw;
  return (LAYER_PARTS_SHOWN as readonly unknown[]).includes(asked)
    ? (asked as ShownPart)
    : "labels";
}

/** The address of one part: the first part at the screen's own address, every other with `?part=`. */
export function layerPartHref(part: ShownPart): string {
  return part === "labels" ? LAYER_ROUTE : `${LAYER_ROUTE}?part=${part}`;
}

/** Region states a development build may open with `?state=`, like the inventory's. */
export const FORCED_STATES = ["loading", "empty", "error", "partial", "forbidden"] as const;
export type ForcedState = (typeof FORCED_STATES)[number];

/** The forced state asked for by `?state=`, honoured only outside production so users never see a fake state. */
export function forcedStateFrom(param: unknown, env: string | undefined): ForcedState | undefined {
  if (env === "production") return undefined;
  return (FORCED_STATES as readonly unknown[]).includes(param) ? (param as ForcedState) : undefined;
}

/** The concept each part is named by in the label table. */
export const PART_TITLE: Record<ShownPart, ConceptCode> = {
  labels: "CompanyLabel",
  fields: "CustomField",
  aliases: "ValueDictionary",
  "pending-units": "PendingUnit",
  templates: "ImportTemplate",
  "fee-schedule": "FeeSchedule",
};

export const LAYER_COPY = {
  screenWhy: "Những gì sàn đã gọi riêng, thêm riêng và nhớ riêng so với chuẩn chung.",
  partWhy: {
    labels: "Chữ sàn dùng thay tên cột chuẩn.",
    fields: "Cột sàn có mà chuẩn chung không có, hiện sau các cột chuẩn.",
    aliases: "Chữ sàn quen viết ứng với giá trị chuẩn nào.",
    "pending-units": "Những căn sàn có mà danh mục chung chưa có.",
    templates: "Dạng tệp Sheet đã nhập và cột nào đi vào đâu.",
  } satisfies Record<GridPart, string>,
  empty: {
    labels: "Chưa đặt chữ riêng nào. Chữ riêng cũng sinh ra khi nhập bảng hàng.",
    fields: "Chưa có cột riêng nào. Cột riêng cũng sinh ra khi nhập bảng hàng.",
    aliases: "Chưa có cặp chữ nào. Các cặp chữ cũng sinh ra khi nhập bảng hàng.",
    "pending-units": "Không có căn nào chờ khớp với danh mục.",
    templates: "Chưa có mẫu nào. Mẫu sinh ra sau lần nhập bảng hàng đầu tiên.",
  } satisfies Record<GridPart, string>,
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
  reload: "Tải lại",
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
