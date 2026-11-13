// Every sentence of the in-cell edit of the inventory grid (row 4), in one file for the reviewer (design/language.md).
// Concept words come from the page through CellEditLabels (labels.yaml); prices from formatMoney.
import type { ListingStandardStatus, ListingWithdrawnReason } from "@/generated/ontology";
import { formatMoney, statusLabel } from "@/lib/format";
import { WITHDRAWN_REASONS } from "../edit-rules";
import type { GridRow } from "@/components/candidate/data-region";

type TransactionKind = NonNullable<GridRow["transaction"]>;

/** The concepts whose words the in-cell edit shows; the page reads them from the label table. */
export const CELL_EDIT_CONCEPTS = [
  "Edit",
  "Unit",
  "ListPrice",
  "StandardStatus",
  "ClosePrice",
  "CloseDate",
  "WithdrawnReason",
  "WithdrawnSoldElsewhere",
  "WithdrawnOwnerChangedMind",
  "WithdrawnUnreachable",
] as const;
export type CellEditConcept = (typeof CELL_EDIT_CONCEPTS)[number];
/** Each concept's word for a sale and for a lease. */
export type CellEditLabels = Readonly<Record<CellEditConcept, { sale: string; lease: string }>>;

/** Builds the words from a label reader (the page passes the label table's reader). */
export function cellEditLabels(
  read: (concept: CellEditConcept, transaction: TransactionKind) => string,
): CellEditLabels {
  return Object.fromEntries(
    CELL_EDIT_CONCEPTS.map((c) => [c, { sale: read(c, "sale"), lease: read(c, "lease") }]),
  ) as unknown as CellEditLabels;
}

/** The word of a concept for the row's transaction. */
export function word(
  labels: CellEditLabels,
  concept: CellEditConcept,
  tx?: TransactionKind,
): string {
  return labels[concept][tx === "lease" ? "lease" : "sale"];
}

/** Why a write did not go through (the write door's outcomes other than saved). */
type Failure = "offline" | "conflict" | "refused" | "fault";

const exact = new Intl.NumberFormat("vi-VN");

/** A price written to the last đồng, so opening a price and pressing Enter never changes it. */
export const exactNumber = (value: number) => exact.format(value);

const REASON_LABEL = {
  sold_elsewhere: "WithdrawnSoldElsewhere",
  owner_changed_mind: "WithdrawnOwnerChangedMind",
  unreachable: "WithdrawnUnreachable",
} as const satisfies Record<ListingWithdrawnReason, string>;

/** The reasons in the order of the rules (edit-rules.ts). */
export const WITHDRAWN_REASON_ORDER = WITHDRAWN_REASONS;

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
  reason: (labels: CellEditLabels, reason: ListingWithdrawnReason, tx?: TransactionKind) =>
    word(labels, REASON_LABEL[reason], tx),
  editLabel: (labels: CellEditLabels, field: string, unit: string) =>
    `${word(labels, "Edit")} ${field} ${word(labels, "Unit").toLocaleLowerCase("vi")} ${unit}`,
  done: (what: string, undoable: boolean) =>
    undoable ? `Đã đổi ${what}.` : `Đã đổi ${what}. Không hoàn tác được.`,
  undone: (what: string) => `Đã hoàn tác: ${what}.`,
  saveFailed: (what: string, why: Failure) =>
    why === "fault"
      ? `Chưa lưu được ${what} — máy chủ báo lỗi. Ô đã về giá trị cũ; thử lại sau ít phút.`
      : why === "conflict"
        ? `Chưa lưu ${what}: căn vừa đổi từ chỗ khác. Ô đã về giá trị cũ; tải lại trang để thấy bản mới.`
        : `Chưa lưu được ${what} — mất kết nối mạng. Ô đã về giá trị cũ; có mạng lại thì sửa lại.`,
  undoFailed: (labels: CellEditLabels, unit: string, now: string, why: Failure) =>
    why === "offline"
      ? `Chưa hoàn tác được vì mất kết nối mạng. ${word(labels, "Unit")} ${unit} vẫn là ${now}; có mạng lại thì bấm «Thử lại».`
      : why === "conflict"
        ? `Chưa hoàn tác được: căn vừa đổi từ chỗ khác. ${word(labels, "Unit")} ${unit} vẫn là ${now}.`
        : `Chưa hoàn tác được. ${word(labels, "Unit")} ${unit} vẫn là ${now}.`,
  lockedClosed: (status: string) => `${status} — giữ nguyên như lúc bán`,
  lockedFinal: (status: string) => `${status} là nấc cuối`,
} as const;
