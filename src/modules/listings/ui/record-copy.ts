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
  /** «Các lần chào của căn · 3». */
  listingsOfUnit: (listings: string, unit: string, n: number) =>
    `${listings} của ${unit.toLocaleLowerCase("vi")} · ${n}`,
} as const;

/** The sentence at the head of the record: how long ago the listing was confirmed with the owner. */
export function confirmationSentence(days: number | null): string {
  if (days === null) return RECORD_COPY.neverConfirmed;
  return days === 0 ? RECORD_COPY.confirmedToday : RECORD_COPY.confirmedDaysAgo(days);
}
