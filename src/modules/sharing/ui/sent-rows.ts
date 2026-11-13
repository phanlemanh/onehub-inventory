// Pure parts of the Sent grid (roadmap row 6, _acceptance/da-gui-tren-luoi): rows, columns and the state a URL asks
// for. Safe on the server. The screen declares columns by field; the shared grid decides how each kind looks.
import { typedColumn, type TypedColumn } from "@/components/candidate/column-kind";
import type { GridRow, RegionStatus } from "@/components/candidate/data-region";
import type { ShareLink } from "@/generated/ontology";

/** Region states a development build may open with `?state=`; anything else is the loaded grid. */
const STATE_PARAMS = ["loading", "empty", "error", "partial", "forbidden"] as const;
export type SentState = RegionStatus | "empty";

/**
 * The region state asked for by `?state=`, honoured only outside production so users never see a fake state. Same
 * contract as the Inventory page (row 2), so the register-driven suite opens every grid screen the same way.
 */
export function sentStateFrom(param: string | undefined, env: string | undefined): SentState {
  if (env === "production") return "ready";
  return (STATE_PARAMS as readonly string[]).includes(param ?? "") ? (param as SentState) : "ready";
}

/**
 * Fields of the six Sent columns, in order: who got the link, then how the customer reacted (Sent answers «how are my
 * customers reacting?»), then when it went out and how big it is. On a phone the first columns are the ones in view.
 */
export const SENT_FIELDS = [
  "ShareLink.recipientName",
  "ShareLink.openCount",
  "ShareLink.interestCount",
  "ShareLink.lastOpenedAt",
  "ShareLink.sentAt",
  "ShareLink.listingCount",
] as const;
export type SentField = (typeof SENT_FIELDS)[number];

/** The six columns of the Sent grid, in order, with the headers the page gives from the label table. */
export function sentColumns(headers: Readonly<Record<SentField, string>>): TypedColumn[] {
  return SENT_FIELDS.map((field) => typedColumn({ field, header: headers[field] }));
}

/** One grid row per link, newest sent first; a link never opened shows an empty «last opened» cell. */
export function sentRows(links: readonly ShareLink[]): GridRow[] {
  return [...links]
    .sort((a, b) => Date.parse(b.sentAt) - Date.parse(a.sentAt))
    .map((link) => ({
      id: link.id,
      "ShareLink.recipientName": link.recipientName ?? null,
      "ShareLink.listingCount": link.listingCount,
      "ShareLink.sentAt": link.sentAt,
      "ShareLink.openCount": link.openCount,
      "ShareLink.interestCount": link.interestCount,
      "ShareLink.lastOpenedAt": link.lastOpenedAt ?? null,
    }));
}
