// The one place that turns numbers, dates and phone numbers into text, by display kind (design/behaviors.md).
// Intl with vi-VN (design/language.md). Status colours come from Quỹ hàng, apps/web/src/lib/mau-trang-thai.ts at e89c6ab8.
import type { DisplayKind } from "@/generated/display";
import type { ConceptCode } from "@/generated/labels";
import type { ListingStandardStatus } from "@/generated/ontology";
import { label, type TransactionKind } from "@/modules/company-config";

/** What an empty or unreadable value shows. */
export const EMPTY = "—";

const LOCALE = "vi-VN";
const TIME_ZONE = "Asia/Ho_Chi_Minh";
const BILLION = 1_000_000_000;
const MILLION = 1_000_000;

const twoDigits = new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 2 });
const oneDigit = new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 1 });
// Billions keep the millions (row 19: a net-to-seller of 2,895 tỷ must not read 2,89 tỷ); round prices show as before.
const threeDigits = new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 3 });
const whole = new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 0 });
const currency = new Intl.NumberFormat(LOCALE, { style: "currency", currency: "VND" });
const dateFormat = new Intl.DateTimeFormat(LOCALE, {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: TIME_ZONE,
});
const dateTimeFormat = new Intl.DateTimeFormat(LOCALE, {
  hour: "2-digit",
  minute: "2-digit",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour12: false,
  timeZone: TIME_ZONE,
});

/** Intl puts non-breaking spaces between number and unit; the product uses plain spaces. */
const plain = (text: string): string => text.replace(/[\u00a0\u202f]/g, " ");

const isNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

/** Price in đồng: «4,85 tỷ», «320 triệu», «999.999 ₫». The unit is chosen after rounding. */
export function formatMoney(value: number | null | undefined): string {
  if (!isNumber(value) || value < 0) return EMPTY;
  if (value >= MILLION) {
    const millions = Math.round((value / MILLION) * 10) / 10;
    if (millions < 1000) return `${oneDigit.format(millions)} triệu`;
    return `${threeDigits.format(value / BILLION)} tỷ`;
  }
  return plain(currency.format(value));
}

/** Living area in square metres: «75,5 m²». */
export function formatArea(value: number | null | undefined): string {
  return isNumber(value) && value >= 0 ? `${twoDigits.format(value)} m²` : EMPTY;
}

/** A whole count: «2.418». */
export function formatCount(value: number | null | undefined): string {
  return isNumber(value) ? whole.format(value) : EMPTY;
}

function toDate(value: string | Date | null | undefined): Date | null {
  if (value === null || value === undefined) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** A day in Vietnam time: «05/11/2026». */
export function formatDate(value: string | Date | null | undefined): string {
  const date = toDate(value);
  return date ? plain(dateFormat.format(date)) : EMPTY;
}

/** A moment in Vietnam time: «14:30 05/11/2026». */
export function formatDateTime(value: string | Date | null | undefined): string {
  const date = toDate(value);
  return date ? plain(dateTimeFormat.format(date)) : EMPTY;
}

/** A ten-digit mobile number in groups of four, three and three; anything else is shown as given. */
export function formatPhone(value: string | null | undefined): string {
  if (value === null || value === undefined || value.trim() === "") return EMPTY;
  const digits = value.replace(/[\s.-]/g, "").replace(/^\+84/, "0");
  if (!/^0\d{9}$/.test(digits)) return value;
  return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
}

/** Formats a field value by the display kind declared in the ontology. */
export function formatByKind(kind: DisplayKind, value: unknown): string {
  switch (kind) {
    case "money":
      return formatMoney(value as number | null);
    case "area":
      return formatArea(value as number | null);
    case "count":
      return formatCount(value as number | null);
    case "date":
      return formatDate(value as string | Date | null);
    case "datetime":
      return formatDateTime(value as string | Date | null);
    case "phone":
      return formatPhone(value as string | null);
    default:
      return value === null || value === undefined || value === "" ? EMPTY : String(value);
  }
}

/** The ReUI badge variant of each standard status. */
export type StatusTone =
  "success-light" | "info-light" | "primary-light" | "warning-light" | "destructive-light";

export const STATUS_TONE: Readonly<Record<ListingStandardStatus, StatusTone>> = {
  Incomplete: "warning-light",
  Active: "success-light",
  Pending: "info-light",
  Closed: "primary-light",
  Hold: "warning-light",
  Withdrawn: "destructive-light",
};

export function statusTone(status: ListingStandardStatus): StatusTone {
  return STATUS_TONE[status];
}

/** The words of a status, from the label dictionary; a lease uses its lease wording. */
export function statusLabel(status: ListingStandardStatus, transaction?: TransactionKind): string {
  return label(`Status${status}` as ConceptCode, transaction ? { transaction } : {});
}
