// Sample sent links of the MAU sample company (roadmap row 6, _acceptance/da-gui-tren-luoi). Nothing is sent: links,
// opens and interest are made up so the Sent screen has rows before sending (row 16) and real opens (row 18) exist.
// The module depends on no other module: the page passes the company id and the listing ids, never listing records.
import type { ShareLink } from "@/generated/ontology";

/** Ids of sample records start with "MAU" written in hex (the convention of the listings sample, decision 0020). */
export const SAMPLE_SHARE_ID_PREFIX = "4d415500-0010-";

/** A sample share link uuid: `4d415500-0010-4000-8000-<n>`. */
export const sampleShareLinkId = (n: number) =>
  `${SAMPLE_SHARE_ID_PREFIX}4000-8000-${n.toString(16).padStart(12, "0")}`;

/** Recipient names are placeholders only (no real personal data in the repo). */
export const SAMPLE_RECIPIENT_PREFIX = "[Tên]";

/** One sample link before its listings are picked: who gets it, when, how many listings, how it was received. */
interface LinkPlan {
  recipient: string;
  sentAt: string;
  listings: number;
  opens: readonly string[];
  interest: number;
}

const at = (day: number, hour: number, minute = 0) =>
  `2026-11-${String(day).padStart(2, "0")}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00+07:00`;

/**
 * Fourteen links, newest first: links never opened, opened once and opened many times, a link with one listing and
 * one with thirty (the most one send carries in Quỹ hàng), and one recipient name long enough to be cut in its cell.
 */
const PLANS: readonly LinkPlan[] = [
  { recipient: "Khách 01", sentAt: at(12, 21, 40), listings: 3, opens: [], interest: 0 },
  {
    recipient: "Khách 02",
    sentAt: at(12, 16, 5),
    listings: 5,
    opens: [at(12, 16, 30), at(12, 20, 12)],
    interest: 2,
  },
  {
    recipient: "Khách 03 — anh chị cần căn hai phòng ngủ gần trường quốc tế, xem cuối tuần",
    sentAt: at(12, 10, 15),
    listings: 8,
    opens: [at(12, 11, 2)],
    interest: 1,
  },
  {
    recipient: "Khách 04",
    sentAt: at(11, 19, 0),
    listings: 1,
    opens: [at(11, 19, 4), at(11, 22, 30), at(12, 7, 45)],
    interest: 1,
  },
  {
    recipient: "Khách 05",
    sentAt: at(11, 14, 20),
    listings: 30,
    opens: [at(11, 15, 0), at(11, 15, 9), at(12, 9, 10), at(12, 18, 0)],
    interest: 6,
  },
  { recipient: "Khách 06", sentAt: at(11, 9, 0), listings: 4, opens: [], interest: 0 },
  {
    recipient: "Khách 07",
    sentAt: at(10, 20, 10),
    listings: 6,
    opens: [at(10, 20, 40)],
    interest: 0,
  },
  {
    recipient: "Khách 08",
    sentAt: at(10, 11, 30),
    listings: 2,
    opens: [at(10, 12, 0), at(11, 8, 0)],
    interest: 2,
  },
  {
    recipient: "Khách 09",
    sentAt: at(9, 17, 45),
    listings: 12,
    opens: [at(9, 18, 30), at(10, 9, 0), at(10, 21, 0)],
    interest: 3,
  },
  { recipient: "Khách 10", sentAt: at(9, 8, 15), listings: 3, opens: [at(9, 8, 50)], interest: 0 },
  { recipient: "Khách 11", sentAt: at(8, 15, 0), listings: 7, opens: [], interest: 0 },
  {
    recipient: "Khách 12",
    sentAt: at(7, 10, 0),
    listings: 4,
    opens: [at(7, 10, 30), at(7, 11, 0), at(8, 9, 0), at(9, 20, 0), at(11, 21, 0)],
    interest: 4,
  },
  { recipient: "Khách 13", sentAt: at(6, 19, 30), listings: 9, opens: [at(6, 20, 0)], interest: 1 },
  {
    recipient: "Khách 14",
    sentAt: at(5, 9, 0),
    listings: 2,
    opens: [at(5, 9, 30), at(5, 13, 0)],
    interest: 0,
  },
];

/** The sample links and which listings each carries (relation ShareLink includes Listing). */
export interface SampleShareLinks {
  links: ShareLink[];
  includes: ReadonlyMap<string, readonly string[]>;
}

/**
 * Builds the sample links from the company's listing ids, taken in order and wrapping around, so every link carries
 * real listings of the same company. listingCount is derived from the listings the link includes; lastOpenedAt is the
 * latest open, and absent when the link was never opened.
 */
export function buildSampleShareLinks(input: {
  companyId: string;
  listingIds: readonly string[];
}): SampleShareLinks {
  if (input.listingIds.length === 0) return { links: [], includes: new Map() };
  const includes = new Map<string, readonly string[]>();
  let next = 0;
  const links = PLANS.map((plan, i): ShareLink => {
    const id = sampleShareLinkId(i + 1);
    const picked = Array.from(
      { length: Math.min(plan.listings, input.listingIds.length) },
      () => input.listingIds[next++ % input.listingIds.length] as string,
    );
    includes.set(id, picked);
    const lastOpenedAt = plan.opens.length > 0 ? plan.opens[plan.opens.length - 1] : undefined;
    return {
      id,
      companyId: input.companyId,
      recipientName: `${SAMPLE_RECIPIENT_PREFIX} ${plan.recipient}`,
      listingCount: picked.length,
      sentAt: plan.sentAt,
      openCount: plan.opens.length,
      interestCount: Math.min(plan.interest, picked.length),
      ...(lastOpenedAt === undefined ? {} : { lastOpenedAt }),
    };
  });
  return { links, includes };
}

/**
 * The rules of ontology/entities/ShareLink.yaml checked on a set of links; one message per broken rule and link, in
 * Vietnamese, so a test can pin the message.
 */
export function checkShareLinks(data: SampleShareLinks, companyId: string): string[] {
  const errors: string[] = [];
  for (const link of data.links) {
    const carried = data.includes.get(link.id) ?? [];
    if (link.companyId !== companyId) errors.push(`link khác sàn: ${link.id}`);
    if (!link.id.startsWith(SAMPLE_SHARE_ID_PREFIX)) errors.push(`thiếu nhãn MAU: link ${link.id}`);
    if (!(link.recipientName ?? "").startsWith(SAMPLE_RECIPIENT_PREFIX))
      errors.push(`tên người nhận không phải tên giả: ${link.id}`);
    if (link.listingCount !== carried.length)
      errors.push(`số căn lệch số lần chào trong link: ${link.id}`);
    if (link.listingCount < 1) errors.push(`link không mang căn nào: ${link.id}`);
    if (link.interestCount > link.listingCount)
      errors.push(`quan tâm nhiều hơn số căn: ${link.id}`);
    if (link.openCount === 0 && link.lastOpenedAt !== undefined)
      errors.push(`chưa mở mà có lúc mở: ${link.id}`);
    if (link.openCount > 0 && link.lastOpenedAt === undefined)
      errors.push(`đã mở mà thiếu lúc mở: ${link.id}`);
    if (link.lastOpenedAt !== undefined && Date.parse(link.lastOpenedAt) < Date.parse(link.sentAt))
      errors.push(`mở trước khi gửi: ${link.id}`);
  }
  return errors;
}
