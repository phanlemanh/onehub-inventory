// Every sentence of the in-cell edit of the inventory grid (row 4), in one file for the reviewer (design/language.md).
// Concept words come from label() (labels.yaml); prices from formatMoney.
import type { ListingStandardStatus, ListingWithdrawnReason } from "@/generated/ontology";
import { formatMoney, statusLabel } from "@/lib/format";
import { label, type TransactionKind } from "@/modules/company-config";

const exact = new Intl.NumberFormat("vi-VN");

/** A price written to the last đồng, so opening a price and pressing Enter never changes it. */
export const exactNumber = (value: number) => exact.format(value);

const REASON_LABEL = {
  sold_elsewhere: "WithdrawnSoldElsewhere",
  owner_changed_mind: "WithdrawnOwnerChangedMind",
  unreachable: "WithdrawnUnreachable",
} as const satisfies Record<ListingWithdrawnReason, string>;

export const WITHDRAWN_REASON_ORDER = Object.keys(REASON_LABEL) as ListingWithdrawnReason[];

const CONFIRMS = "Tính là vừa xác nhận với chủ nhà.";
const HOW = "gõ như 4,65 tỷ hoặc 950 triệu";

export const CELL_EDIT_COPY = {
  confirms: CONFIRMS,
  keys: `Enter ghi · Esc huỷ · ${CONFIRMS}`,
  hint: `Gõ như 4,65 tỷ hoặc 950 triệu`,
  readAs: (value: number) => `Hiểu là: ${exactNumber(value)} ₫ (${formatMoney(value)})`,
  notUnderstood: (text: string) => `Chưa hiểu «${text.trim()}» — ${HOW}`,
  ask: (swingPercent: number) =>
    `Giá đổi ${swingPercent > 0 ? "+" : ""}${swingPercent}% — đổi chứ?`,
  askFromTo: (from: number, to: number) => `${formatMoney(from)} → ${formatMoney(to)}`,
  cancel: "Thôi",
  changePrice: "Đổi giá",
  changeStatus: "Đổi trạng thái",
  busy: "Đang đổi",
  moveTitle: (to: ListingStandardStatus, tx?: TransactionKind) => `Đổi sang ${statusLabel(to, tx)}`,
  final: (to: ListingStandardStatus, tx?: TransactionKind) =>
    `${statusLabel(to, tx)} là nấc cuối: không hoàn tác được.`,
  missing: (names: readonly string[]) => `Còn thiếu ${names.join(", ")}.`,
  reason: (reason: ListingWithdrawnReason, tx?: TransactionKind) =>
    label(REASON_LABEL[reason], tx ? { transaction: tx } : {}),
  editLabel: (field: string, unit: string) =>
    `${label("Edit")} ${field} ${label("Unit").toLocaleLowerCase("vi")} ${unit}`,
  done: (what: string, undoable: boolean) =>
    undoable ? `Đã đổi ${what}.` : `Đã đổi ${what}. Không hoàn tác được.`,
  undone: (what: string) => `Đã hoàn tác: ${what}.`,
  saveFailed: (what: string, why: "offline" | "conflict" | "refused") =>
    why === "conflict"
      ? `Chưa lưu ${what}: căn vừa đổi từ chỗ khác. Ô đã về giá trị cũ; tải lại trang để thấy bản mới.`
      : `Chưa lưu được ${what} — mất kết nối mạng. Ô đã về giá trị cũ; có mạng lại thì sửa lại.`,
  undoFailed: (unit: string, now: string, why: "offline" | "conflict" | "refused") =>
    why === "offline"
      ? `Chưa hoàn tác được vì mất kết nối mạng. ${label("Unit")} ${unit} vẫn là ${now}; có mạng lại thì bấm «Thử lại».`
      : why === "conflict"
        ? `Chưa hoàn tác được: căn vừa đổi từ chỗ khác. ${label("Unit")} ${unit} vẫn là ${now}.`
        : `Chưa hoàn tác được. ${label("Unit")} ${unit} vẫn là ${now}.`,
  lockedClosed: (status: string) => `${status} — giữ nguyên như lúc bán`,
  lockedFinal: (status: string) => `${status} là nấc cuối`,
} as const;
