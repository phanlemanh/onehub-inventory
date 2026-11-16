// Every sentence of the fee part (row 19, thue-phi), in one file for the reviewer (design/language.md). Concept
// names — the part, the three items, the add, rename, remove and reset buttons, the company — come from label().
import type { FeeProblemCode } from "../fee-schedule";
import { label } from "../index";

export const FEE_COPY = {
  why: "Các khoản trừ khỏi giá chào của hàng bao phí để ra số chủ nhận về.",
  count: (items: number, included: number) =>
    `${items} khoản · ${included} đang tính vào giá bao phí`,
  byLaw: "theo luật",
  includeSwitch: (name: string) => `Tính ${name} vào giá bao phí`,
  includeShort: "Tính vào giá bao phí",
  rateField: (name: string) => `Tỉ lệ ${name} (%)`,
  nameField: "Tên khoản",
  newName: "Khoản mới",
  more: (name: string) => `Việc khác với ${name}`,
  sourceDefault: "Mặc định",
  sourceChanged: (by: string, at: string) => `Đã đổi · ${by} · ${at}`,
  sourceAdded: (by: string, at: string) => `${label("Company")} thêm · ${by} · ${at}`,
  sourceDraft: "Chưa lưu",
  example: (net: string) =>
    `${label("ListPrice")} 3 tỷ ${label("FeeIncluded").toLocaleLowerCase("vi")} → ${label("NetToSeller").toLocaleLowerCase("vi")} ${net}`,
  readOnly: `Chỉ ${label("CompanyAdmin")} đổi được thuế phí`,
  save: "Lưu",
  saving: "Đang lưu…",
  saved: "Đã lưu thuế phí",
  failed: "Chưa lưu được thuế phí. Thử lại sau ít phút.",
  limitReached: "Đã đủ 5 khoản riêng. Bỏ bớt một khoản rồi thêm.",
} as const;

/** Why one item, or the whole schedule, cannot be saved — said at the row or under the list. */
export const FEE_PROBLEM_COPY: Record<FeeProblemCode, string> = {
  "rate-below-zero": "Tỉ lệ không âm.",
  "rate-above-max": "Tỉ lệ tối đa 5%.",
  "rate-step": "Tỉ lệ theo bước 0,1%, ví dụ 1,5.",
  "name-empty": "Đặt tên cho khoản.",
  "name-too-long": "Tên tối đa 40 ký tự.",
  "name-duplicate": "Đã có khoản cùng tên.",
  "law-item-fixed": "Khoản theo luật chỉ bật hay tắt.",
  "law-item-missing": "Thiếu khoản theo luật.",
  "unknown-item": "Khoản này không còn. Tải lại trang.",
  "too-many-items": "Tối đa 5 khoản riêng.",
  "total-above-max": "Tổng các khoản đang tính tối đa 10%.",
  "nothing-included": "Bật ít nhất một khoản.",
};
