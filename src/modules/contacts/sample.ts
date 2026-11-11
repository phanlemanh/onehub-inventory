// Sample contacts of the MAU sample company (roadmap row 1, decision 0020): owners and buyers linked to listings.
// A phone number lives only on the contact, so changing it once changes it for every listing of that person.
// The real-data scan is taken from onehub-quy-hang commit 1f8a6edd (quetChuoi in packages/db/seed/du-lieu-mau.mjs).
import { LABELS } from "../../generated/labels";
import type { Contact } from "../../generated/ontology";

/** Ids of sample records start with "MAU" written in hex — the same prefix the listings module uses. */
export const SAMPLE_ID_PREFIX = "4d415500-";

/** Kind digits in the second group of a sample id; 0–2 belong to the listings module. */
export const CONTACT_ID_KIND = { contact: 3, owner: 4 } as const;

const sampleId = (kind: number, n: number) =>
  `${SAMPLE_ID_PREFIX}${kind.toString(16).padStart(4, "0")}-4000-8000-${n.toString(16).padStart(12, "0")}`;

/** Several numbers of one contact share the single `phones` string, joined by this separator. */
export const PHONE_SEPARATOR = ", ";
export const CONTACT_TYPE_SEPARATOR = ", ";
export const SAMPLE_NAME_PREFIX = "[Tên]";
export const SAMPLE_NAME_SUFFIX = " · MAU";
const SAMPLE_PHONE = /^0900 000 0\d\d$/;

export const SAMPLE_OWNER_COUNT = 40;
export const SAMPLE_BUYER_COUNT = 10;
/** Listings at the end of the list that get no owner. */
export const SAMPLE_UNOWNED_COUNT = 4;

/** The link between an owner and a listing (relation `Contact owns Listing`). */
export interface OwnerLink {
  id: string;
  companyId: string;
  contactId: string;
  listingId: string;
  contactType: "Seller";
}

export interface SampleContacts {
  contacts: Contact[];
  owners: OwnerLink[];
}

const two = (n: number) => String(n).padStart(2, "0");
const samplePhone = (n: number) => `0900 000 0${two(n)}`;

export const phoneList = (c: Pick<Contact, "phones">): string[] =>
  c.phones ? c.phones.split(PHONE_SEPARATOR).filter(Boolean) : [];

export const contactTypesOf = (c: Pick<Contact, "contactTypes">): string[] =>
  c.contactTypes.split(CONTACT_TYPE_SEPARATOR).filter(Boolean);

/**
 * 40 owners and 10 buyers linked to the given listings. Owners 1–16 own two listings each, four listings have a second
 * owner, owners 5 and 6 are also buyers, the last four listings have no owner.
 */
export function buildSampleContacts(input: {
  companyId: string;
  listingIds: readonly string[];
}): SampleContacts {
  const ids = input.listingIds;
  if (ids.length < 24 + SAMPLE_UNOWNED_COUNT)
    throw new Error(`need at least 28 listings, got ${ids.length}`);
  const contacts: Contact[] = [];
  for (let i = 0; i < SAMPLE_OWNER_COUNT; i++) {
    const phones = [samplePhone(i + 1), ...(i < 3 ? [samplePhone(51 + i)] : [])];
    contacts.push({
      id: sampleId(CONTACT_ID_KIND.contact, i + 1),
      companyId: input.companyId,
      fullName: `${SAMPLE_NAME_PREFIX} ${LABELS.Seller.pref} ${two(i + 1)}${SAMPLE_NAME_SUFFIX}`,
      contactTypes:
        i === 4 || i === 5 ? ["Seller", "Buyer"].join(CONTACT_TYPE_SEPARATOR) : "Seller",
      phones: phones.join(PHONE_SEPARATOR),
    });
  }
  for (let i = 0; i < SAMPLE_BUYER_COUNT; i++)
    contacts.push({
      id: sampleId(CONTACT_ID_KIND.contact, SAMPLE_OWNER_COUNT + i + 1),
      companyId: input.companyId,
      fullName: `${SAMPLE_NAME_PREFIX} ${LABELS.Buyer.pref} ${two(i + 1)}${SAMPLE_NAME_SUFFIX}`,
      contactTypes: "Buyer",
      phones: samplePhone(SAMPLE_OWNER_COUNT + i + 1),
    });

  const owners: OwnerLink[] = [];
  const link = (owner: number, listingIndex: number) =>
    owners.push({
      id: sampleId(CONTACT_ID_KIND.owner, owners.length + 1),
      companyId: input.companyId,
      contactId: contacts[owner]!.id,
      listingId: ids[listingIndex]!,
      contactType: "Seller",
    });
  const owned = ids.length - SAMPLE_UNOWNED_COUNT;
  for (let i = 0; i < owned; i++) {
    link(i < 16 ? Math.floor(i / 2) : 8 + ((i - 16) % (SAMPLE_OWNER_COUNT - 8)), i);
    if (i >= 20 && i < 24) link(SAMPLE_OWNER_COUNT - 1 - (i - 20), i);
  }
  return { contacts, owners };
}

/** Contacts kept normalized: a listing reads its owners' numbers from the contacts themselves. */
export interface ContactStore {
  contacts(): readonly Contact[];
  owners(): readonly OwnerLink[];
  ownersOf(listingId: string): Contact[];
  listingsOf(contactId: string): string[];
  updatePhones(contactId: string, phones: readonly string[]): void;
}

export function createContactStore(data: SampleContacts): ContactStore {
  const byId = new Map(data.contacts.map((c) => [c.id, { ...c }]));
  const owners = data.owners.map((o) => ({ ...o }));
  return {
    contacts: () => [...byId.values()],
    owners: () => owners,
    ownersOf: (listingId) =>
      owners
        .filter((o) => o.listingId === listingId)
        .map((o) => byId.get(o.contactId))
        .filter((c): c is Contact => c !== undefined),
    listingsOf: (contactId) =>
      owners.filter((o) => o.contactId === contactId).map((o) => o.listingId),
    updatePhones(contactId, phones) {
      const c = byId.get(contactId);
      if (!c) throw new Error(`no contact ${contactId}`);
      byId.set(contactId, { ...c, phones: phones.join(PHONE_SEPARATOR) });
    },
  };
}

/** The four linking cases decision 0020 asks for. */
export function checkLinkCases(data: SampleContacts, listingIds: readonly string[]): string[] {
  const errors: string[] = [];
  const perContact = new Map<string, number>();
  const perListing = new Map<string, number>();
  for (const o of data.owners) {
    perContact.set(o.contactId, (perContact.get(o.contactId) ?? 0) + 1);
    perListing.set(o.listingId, (perListing.get(o.listingId) ?? 0) + 1);
  }
  if (![...perContact.values()].some((n) => n >= 2)) errors.push("thiếu ca: một chủ nhiều căn");
  if (![...perListing.values()].some((n) => n >= 2)) errors.push("thiếu ca: một căn nhiều chủ");
  const ownerAndBuyer = data.contacts.some((c) => {
    const types = contactTypesOf(c);
    return types.includes("Seller") && types.includes("Buyer") && perContact.has(c.id);
  });
  if (!ownerAndBuyer) errors.push("thiếu ca: vừa chủ vừa khách");
  if (!listingIds.some((id) => !perListing.has(id))) errors.push("thiếu ca: căn chưa có chủ");
  return errors;
}

/** Owner links point at contacts and listings that exist; every contact and link belongs to the given company. */
export function checkOwnerLinks(
  data: SampleContacts,
  listingIds: ReadonlySet<string>,
  companyId: string,
): string[] {
  const errors: string[] = [];
  const contactIds = new Set(data.contacts.map((c) => c.id));
  for (const o of data.owners) {
    if (!listingIds.has(o.listingId))
      errors.push(`liên kết chủ trỏ lần chào không có: ${o.listingId}`);
    if (!contactIds.has(o.contactId))
      errors.push(`liên kết chủ trỏ liên hệ không có: ${o.contactId}`);
    if (o.companyId !== companyId) errors.push(`bản ghi khác sàn: liên kết chủ ${o.id}`);
  }
  for (const c of data.contacts)
    if (c.companyId !== companyId) errors.push(`bản ghi khác sàn: liên hệ ${c.id}`);
  return errors;
}

/** The MAU label on every contact (id prefix and name suffix) and every owner link. */
export function checkContactLabels(data: SampleContacts): string[] {
  const errors: string[] = [];
  for (const c of data.contacts)
    if (!c.id.startsWith(SAMPLE_ID_PREFIX) || !(c.fullName ?? "").endsWith(SAMPLE_NAME_SUFFIX))
      errors.push(`thiếu nhãn MAU: liên hệ ${c.id}`);
  for (const o of data.owners)
    if (!o.id.startsWith(SAMPLE_ID_PREFIX)) errors.push(`thiếu nhãn MAU: liên kết chủ ${o.id}`);
  return errors;
}

// ——— No real data ————————————————————————————————————————————————————————————————————————————

// After NFKC (full-width digits become plain digits), drop the places digits are allowed — sample numbers, uuids,
// sample UPIs, ISO dates and timestamps, tower and unit codes — then count every digit left. Nine or more is red:
// any phone number has at least nine digits however it is written, so the scan does not guess separators.
const SAMPLE_PHONE_ANYWHERE = /(?<!\p{Nd})0900 000 0\d\d(?!\p{Nd})/gu;
const ALLOWED = [
  /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, // uuid
  /urn:onehub:upi:mau:\S+/g, // sample UPI
  /\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2}))?/g, // ISO date or timestamp
  /(?<![\p{L}\p{Nd}])[A-Z]\d?(?:\.\d{2})?-\d{4}(?!\p{Nd})/gu, // unit code S1.05-1208, E1-0903
  /(?<![\p{L}\p{Nd}])S\d\.\d{2}(?!\p{Nd})/gu, // tower code S1.05
];
const DIGIT_LIMIT = 9;

function* strings(value: unknown): Generator<string> {
  if (typeof value === "string") yield value;
  else if (Array.isArray(value)) for (const x of value) yield* strings(x);
  else if (value && typeof value === "object")
    for (const x of Object.values(value)) yield* strings(x);
}

/** Digits left in a string once the allowed places are removed. */
export function strayDigits(text: string): number {
  let rest = text.normalize("NFKC").replace(SAMPLE_PHONE_ANYWHERE, " ");
  for (const re of ALLOWED) rest = rest.replace(re, " ");
  return rest.match(/\p{Nd}/gu)?.length ?? 0;
}

export interface ScanGroup {
  /** Record kind as people say it: căn, lần chào, liên kết căn, liên hệ, liên kết chủ. */
  kind: string;
  records: readonly { key: string; record: unknown }[];
}

/**
 * No real data in the whole sample: every string of every record is scanned, every contact number has the sample
 * shape, every contact name starts with [Tên]. Returns the errors and how many contact numbers were read.
 */
export function checkNoRealData(groups: readonly ScanGroup[], contacts: readonly Contact[]) {
  const errors: string[] = [];
  for (const g of groups)
    for (const { key, record } of g.records)
      if ([...strings(record)].some((s) => strayDigits(s) >= DIGIT_LIMIT))
        errors.push(`số không đúng dạng mẫu: ${g.kind} ${key}`);
  let phones = 0;
  for (const c of contacts) {
    for (const p of phoneList(c)) {
      phones++;
      if (!SAMPLE_PHONE.test(p)) errors.push(`số không đúng dạng mẫu: liên hệ ${c.id}`);
    }
    if (!(c.fullName ?? "").startsWith(SAMPLE_NAME_PREFIX))
      errors.push(`tên không mang nhãn mẫu: liên hệ ${c.id}`);
  }
  return { errors: [...new Set(errors)], phones };
}
