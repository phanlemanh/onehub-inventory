// Frame words of the full unit record (roadmap row 3b, _acceptance/ho-so-du-thong-tin). Concept names come from the
// label table through the page (label()); only the sentences around them live here.

export const RECORD_COPY = {
  /** A part of the listing that has no value yet. */
  missing: "Chưa có",
  lacking: (parts: readonly string[]) => `Còn thiếu: ${parts.join(", ")}`,
  complete: "Đủ thông tin",
  confirmedToday: "Xác nhận hôm nay",
  confirmedDaysAgo: (days: number) => `Xác nhận ${days} ngày trước`,
  neverConfirmed: "Chưa xác nhận với chủ nhà",
  /** One line of the listings of a unit: «Lần 2». */
  listingNumber: (n: number) => `Lần ${n}`,
  viewingEarlier: (n: number) => `Đang xem lần chào cũ · Lần ${n}`,
  backToNewest: "Về lần mới nhất",
  /** «Mã căn»: the code of the unit, from the unit's label. */
  unitCode: (unit: string) => `Mã ${unit.toLocaleLowerCase("vi")}`,
  /** The heading of the unit's listings with their count, after the label passed in. */
  listingsOfUnit: (listings: string, unit: string, n: number) =>
    `${listings} của ${unit.toLocaleLowerCase("vi")} · ${n}`,
  /** Row 3g: editing the four details of the open listing. «căn 1101». */
  detailsWhat: (unit: string, unitNumber: string) =>
    `${unit.toLocaleLowerCase("vi")} ${unitNumber}`,
  detailsTitle: (edit: string, what: string) => `${edit} thông tin ${what}`,
  /** The four parts by the company's own words (label table), lower case inside the sentence. */
  detailsDescription: (parts: readonly string[]) =>
    `Đổi ${parts.map((p) => p.toLocaleLowerCase("vi")).join(", ")}. Xoá chữ trong ô là chưa có. Tính là vừa xác nhận với chủ nhà.`,
  detailsSubmit: "Lưu",
  detailsBusy: "Đang lưu",
  detailsNone: "Chưa có",
  detailsTooLong: (limit: number) => `Dài quá ${limit} ký tự.`,
  detailsDone: (what: string) => `Đã đổi thông tin ${what}.`,
  detailsUndone: (what: string) => `Đã hoàn tác: thông tin ${what}.`,
  /** Why a save of the details did not go through; the dialog keeps what was typed. */
  detailsFailed: (why: "offline" | "conflict" | "expired" | "fault" | "refused") =>
    why === "offline"
      ? "Chưa lưu được — mất kết nối mạng. Có mạng lại thì bấm «Thử lại»."
      : why === "conflict"
        ? "Chưa lưu: bản này vừa đổi từ chỗ khác. Đóng hộp để thấy bản mới, rồi sửa lại."
        : why === "expired"
          ? "Chưa lưu được — phiên đăng nhập đã hết; bạn đăng nhập lại rồi bấm «Thử lại»."
          : why === "refused"
            ? "Không đủ quyền làm việc này."
            : "Chưa lưu được — máy chủ báo lỗi. Thử lại sau ít phút.",
  detailsUndoFailed: (
    what: string,
    why: "offline" | "conflict" | "expired" | "fault" | "refused",
  ) =>
    why === "offline"
      ? `Chưa hoàn tác được thông tin ${what} vì mất kết nối mạng; có mạng lại thì bấm «Thử lại».`
      : why === "conflict"
        ? `Chưa hoàn tác được: ${what} vừa đổi từ chỗ khác.`
        : why === "expired"
          ? `Chưa hoàn tác được vì phiên đăng nhập đã hết; đăng nhập lại rồi bấm «Thử lại».`
          : `Chưa hoàn tác được thông tin ${what}.`,
} as const;

/** The sentence at the head of the record: how long ago the listing was confirmed with the owner. */
export function confirmationSentence(days: number | null): string {
  if (days === null) return RECORD_COPY.neverConfirmed;
  return days === 0 ? RECORD_COPY.confirmedToday : RECORD_COPY.confirmedDaysAgo(days);
}
