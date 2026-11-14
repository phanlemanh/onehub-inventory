// Sample listings of the MAU sample company (roadmap row 1, decision 0020). Pure and deterministic: a seeded generator,
// fixed timestamps, no clock. The pseudo-random generator is mulberry32, taken from onehub-quy-hang commit 1f8a6edd
// (packages/db/seed/du-lieu-mau.mjs).
import { LABELS } from "../../generated/labels";
import type {
  Company,
  Listing,
  ListingFurnished,
  ListingOccupantType,
  ListingStandardStatus,
  ListingUnit,
  ListingWithdrawnReason,
  Unit,
} from "../../generated/ontology";

/** Ids of sample records start with "MAU" written in hex. */
export const SAMPLE_ID_PREFIX = "4d415500-";

/** Kind digits in the second group of a sample id. */
export const SAMPLE_ID_KIND = {
  company: 0,
  listing: 1,
  listingUnit: 2,
  earlierListing: 3,
  earlierListingUnit: 4,
} as const;

/** A sample uuid: `4d415500-<kind>-4000-8000-<n>`. */
export const sampleId = (kind: number, n: number) =>
  `${SAMPLE_ID_PREFIX}${kind.toString(16).padStart(4, "0")}-4000-8000-${n.toString(16).padStart(12, "0")}`;

export const SAMPLE_COMPANY: Company = {
  id: sampleId(SAMPLE_ID_KIND.company, 1),
  name: `[MAU] ${LABELS.Company.pref} mẫu Ocean Park`,
};

export const SAMPLE_SEED = 20261111;

export const STANDARD_STATUSES: readonly ListingStandardStatus[] = [
  "Incomplete",
  "Active",
  "Pending",
  "Hold",
  "Closed",
  "Withdrawn",
];

/** How many sample listings each status gets: 60 in all. */
export const SAMPLE_STATUS_COUNTS: Readonly<Record<ListingStandardStatus, number>> = {
  Active: 24,
  Incomplete: 8,
  Pending: 7,
  Hold: 7,
  Closed: 7,
  Withdrawn: 7,
};

/** Listings per project: 60 in all. */
export const SAMPLE_LISTINGS_PER_SUBDIVISION: Readonly<Record<string, number>> = {
  op1: 36,
  op2: 12,
  op3: 12,
};

const WITHDRAWN_REASONS: readonly ListingWithdrawnReason[] = [
  "sold_elsewhere",
  "owner_changed_mind",
  "unreachable",
];

// Offer details of the sample listings (row 3b), by position: each detail is present on some listings and missing on others.
const FURNISHED_BY_POSITION: readonly (ListingFurnished | undefined)[] = [
  "Furnished",
  "Partially",
  "Unfurnished",
  undefined,
];
const LEGAL_BY_POSITION: readonly (string | undefined)[] = [
  "Sổ hồng",
  "Hợp đồng mua bán",
  undefined,
  "Sổ hồng",
];
const FINANCING_BY_POSITION: readonly (string | undefined)[] = [
  "Không vay",
  undefined,
  "Đang vay ngân hàng",
  undefined,
];
const OCCUPANT_BY_POSITION: readonly (ListingOccupantType | undefined)[] = [
  "Vacant",
  "Owner",
  undefined,
  "Tenant",
];

/** The link between a listing and the catalog unit it offers: the generated ontology concept `ListingUnit`. */
export type { ListingUnit };

/** What a listing copies from its unit. The caller passes catalog units and their project name. */
export type ListingUnitSource = Pick<
  Unit,
  "upi" | "subdivisionKey" | "buildingName" | "unitNumber" | "livingArea"
> & {
  subdivisionName?: string | undefined;
};

export interface SampleListings {
  listings: Listing[];
  listingUnits: ListingUnit[];
}

/** mulberry32: a 32-bit pseudo-random generator, enough for sample data. */
export function seededRandom(seed: number) {
  let a = seed >>> 0;
  const next = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const int = (n: number) => Math.floor(next() * n);
  const shuffle = <T>(items: readonly T[]): T[] => {
    const out = [...items];
    for (let i = out.length - 1; i > 0; i--) {
      const j = int(i + 1);
      [out[i], out[j]] = [out[j] as T, out[i] as T];
    }
    return out;
  };
  return { int, shuffle };
}

const two = (n: number) => String(n).padStart(2, "0");
const byText = (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0);

/** 60 sample listings on 60 different units, covering the six standard statuses. */
export function buildSampleListings(input: {
  companyId: string;
  units: readonly ListingUnitSource[];
  seed?: number;
}): SampleListings {
  const r = seededRandom(input.seed ?? SAMPLE_SEED);
  const chosen = Object.entries(SAMPLE_LISTINGS_PER_SUBDIVISION).flatMap(([key, n]) => {
    const pool = input.units.filter((u) => u.subdivisionKey === key);
    if (pool.length < n)
      throw new Error(`not enough sample units in ${key}: ${pool.length} < ${n}`);
    return r.shuffle(pool).slice(0, n);
  });
  chosen.sort((a, b) => byText(a.subdivisionKey, b.subdivisionKey) || byText(a.upi, b.upi));
  const statuses = r.shuffle(
    STANDARD_STATUSES.flatMap((s) => Array.from({ length: SAMPLE_STATUS_COUNTS[s] }, () => s)),
  );

  const listings: Listing[] = [];
  const listingUnits: ListingUnit[] = [];
  chosen.forEach((unit, i) => {
    const id = sampleId(SAMPLE_ID_KIND.listing, i + 1);
    const status = statuses[i] ?? "Active";
    const pricePerM2 = 45 + r.int(31); // million VND per m²
    const listPrice = Math.round(((unit.livingArea ?? 70) * pricePerM2) / 10) * 10 * 1_000_000;
    const listing: Listing = {
      id,
      companyId: input.companyId,
      buildingName: unit.buildingName,
      unitNumber: unit.unitNumber,
      standardStatus: status,
      listPrice,
      lastConfirmedAt: `2026-11-${two(1 + (i % 9))}T09:00:00+07:00`,
      originalEntryTimestamp: `2026-10-${two(1 + (i % 20))}T09:00:00+07:00`,
      version: 1,
    };
    // Row 3b: the four offer details by position, with deliberate gaps (no random draw, so prices stay as they were).
    const furnished = FURNISHED_BY_POSITION[i % 4];
    const legal = LEGAL_BY_POSITION[i % 4];
    const financing = FINANCING_BY_POSITION[i % 4];
    const occupant = OCCUPANT_BY_POSITION[i % 4];
    if (furnished) listing.furnished = furnished;
    if (legal) listing.legalStatus = legal;
    if (financing) listing.financing = financing;
    if (occupant) listing.occupantType = occupant;
    if (unit.subdivisionName) listing.subdivisionName = unit.subdivisionName;
    if (status === "Closed") {
      listing.closePrice = listPrice - r.int(6) * 10_000_000;
      listing.closeDate = `2026-10-${two(10 + (i % 18))}`;
    }
    if (status === "Withdrawn")
      listing.withdrawnReason = WITHDRAWN_REASONS[i % WITHDRAWN_REASONS.length] ?? "unreachable";
    listings.push(listing);
    listingUnits.push({
      id: sampleId(SAMPLE_ID_KIND.listingUnit, i + 1),
      companyId: input.companyId,
      listingId: id,
      upi: unit.upi,
    });
  });
  return { listings, listingUnits };
}

/** Listing rules: all six statuses, Closed and Withdrawn complete, one unit per listing, names copied from the unit. */
export function checkSampleListings(
  data: SampleListings,
  units: readonly Pick<Unit, "upi" | "buildingName" | "unitNumber">[],
): string[] {
  const errors: string[] = [];
  const present = new Set(data.listings.map((l) => l.standardStatus));
  for (const s of STANDARD_STATUSES) if (!present.has(s)) errors.push(`thiếu trạng thái: ${s}`);
  for (const l of data.listings) {
    if (l.standardStatus === "Closed" && (!l.closePrice || !l.closeDate))
      errors.push(`Closed thiếu giá hoặc ngày chốt: ${l.id}`);
    if (l.standardStatus === "Withdrawn" && !l.withdrawnReason)
      errors.push(`Withdrawn thiếu lý do: ${l.id}`);
  }
  const unitByUpi = new Map(units.map((u) => [u.upi, u]));
  const linkByListing = new Map(data.listingUnits.map((x) => [x.listingId, x]));
  const listingsByUpi = new Map<string, number>();
  for (const x of data.listingUnits) listingsByUpi.set(x.upi, (listingsByUpi.get(x.upi) ?? 0) + 1);
  for (const [upi, n] of listingsByUpi) if (n > 1) errors.push(`hai lần chào chung căn: ${upi}`);
  for (const l of data.listings) {
    const link = linkByListing.get(l.id);
    if (!link) {
      errors.push(`lần chào không có căn: ${l.id}`);
      continue;
    }
    const unit = unitByUpi.get(link.upi);
    if (unit && (unit.buildingName !== l.buildingName || unit.unitNumber !== l.unitNumber))
      errors.push(`lần chào lệch căn: ${l.id}`);
  }
  return errors;
}

/** Links point at units that exist, and every listing and link belongs to the given company. */
export function checkListingLinks(
  data: SampleListings,
  upis: ReadonlySet<string>,
  companyId: string,
): string[] {
  const errors: string[] = [];
  for (const x of data.listingUnits) {
    if (!upis.has(x.upi)) errors.push(`liên kết căn trỏ căn không có: ${x.upi}`);
    if (x.companyId !== companyId) errors.push(`bản ghi khác sàn: liên kết căn ${x.id}`);
  }
  const perListing = new Map<string, number>();
  for (const x of data.listingUnits)
    perListing.set(x.listingId, (perListing.get(x.listingId) ?? 0) + 1);
  for (const [listingId, n] of perListing)
    if (n > 1) errors.push(`lần chào có ${n} căn: ${listingId}`);
  for (const l of data.listings)
    if (l.companyId !== companyId) errors.push(`bản ghi khác sàn: lần chào ${l.id}`);
  return errors;
}

/** The MAU label on the company, every listing and every listing-unit link. */
export function checkListingLabels(data: SampleListings, company: Company): string[] {
  const errors: string[] = [];
  if (!company.id.startsWith(SAMPLE_ID_PREFIX) || !company.name.startsWith("[MAU]"))
    errors.push(`thiếu nhãn MAU: sàn ${company.id}`);
  for (const l of data.listings)
    if (!l.id.startsWith(SAMPLE_ID_PREFIX)) errors.push(`thiếu nhãn MAU: lần chào ${l.id}`);
  for (const x of data.listingUnits)
    if (!x.id.startsWith(SAMPLE_ID_PREFIX)) errors.push(`thiếu nhãn MAU: liên kết căn ${x.id}`);
  return errors;
}

/** Statuses of an open listing: a unit has at most one of these per company (rule one-open-listing-per-unit, row 3b). */
export const OPEN_STATUSES: readonly ListingStandardStatus[] = [
  "Incomplete",
  "Active",
  "Pending",
  "Hold",
];

/**
 * Earlier listings of the sample units (row 3b): every third current listing has one earlier Withdrawn listing on the
 * same unit, every sixth also an earliest Closed one, so ten units have three listings. They are a set of their own:
 * buildSampleListings and the inventory grid keep exactly the 60 current listings (Hỏi-7 at the scope gate).
 */
export function sampleEarlierListings(current: SampleListings): SampleListings {
  const upiOf = new Map(current.listingUnits.map((x) => [x.listingId, x]));
  const listings: Listing[] = [];
  const listingUnits: ListingUnit[] = [];
  let n = 0;
  const add = (
    from: Listing,
    listing: Omit<Listing, "id" | "companyId" | "buildingName" | "version">,
  ) => {
    const link = upiOf.get(from.id);
    if (!link) return;
    n += 1;
    const id = sampleId(SAMPLE_ID_KIND.earlierListing, n);
    const earlier: Listing = {
      ...listing,
      id,
      companyId: from.companyId,
      buildingName: from.buildingName,
      version: 1,
    };
    if (from.unitNumber) earlier.unitNumber = from.unitNumber;
    if (from.subdivisionName) earlier.subdivisionName = from.subdivisionName;
    listings.push(earlier);
    listingUnits.push({
      id: sampleId(SAMPLE_ID_KIND.earlierListingUnit, n),
      companyId: link.companyId,
      listingId: id,
      upi: link.upi,
    });
  };
  current.listings.forEach((l, i) => {
    if (i % 3 !== 0) return;
    const price = l.listPrice ?? 4_000_000_000;
    // Withdrawn earlier, never confirmed with the owner: «Chưa xác nhận» on the record.
    add(l, {
      standardStatus: "Withdrawn",
      withdrawnReason: "owner_changed_mind",
      listPrice: price - 200_000_000,
      originalEntryTimestamp: "2026-06-14T09:00:00+07:00",
      furnished: "Partially",
      legalStatus: "Sổ hồng",
      occupantType: "Owner",
    });
    if (i % 6 !== 0) return;
    // Closed earliest: four of five parts (no financing), confirmed long ago.
    add(l, {
      standardStatus: "Closed",
      listPrice: price - 600_000_000,
      closePrice: price - 650_000_000,
      closeDate: "2025-05-20",
      originalEntryTimestamp: "2025-03-02T09:00:00+07:00",
      lastConfirmedAt: "2025-05-10T09:00:00+07:00",
      furnished: "Unfurnished",
      legalStatus: "Hợp đồng mua bán",
      occupantType: "Vacant",
    });
  });
  return { listings, listingUnits };
}

/** Rule one-open-listing-per-unit over current and earlier listings together: one message per unit that breaks it. */
export function checkOneOpenListingPerUnit(data: SampleListings): string[] {
  const statusOf = new Map(data.listings.map((l) => [l.id, l.standardStatus]));
  const open = new Map<string, number>();
  for (const x of data.listingUnits) {
    const status = statusOf.get(x.listingId);
    if (status && OPEN_STATUSES.includes(status)) open.set(x.upi, (open.get(x.upi) ?? 0) + 1);
  }
  return [...open].filter(([, n]) => n > 1).map(([upi]) => `two open listings on one unit: ${upi}`);
}
