// Row 3b (_acceptance/ho-so-du-thong-tin): the model, the sample data and the pure rules of the full unit record.
// Each check is a function so its break case runs the same function on a broken copy and pins the message.
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";

import { describe, expect, it } from "vitest";

import { LABELS } from "../src/generated/labels";
import { sampleUnits, subdivisionNameOf } from "../src/modules/catalog";
import {
  COMPLETENESS_PARTS,
  OPEN_STATUSES,
  SAMPLE_COMPANY,
  SAMPLE_ID_PREFIX,
  STANDARD_STATUSES,
  buildSampleListings,
  checkListingLabels,
  checkListingLinks,
  checkOneOpenListingPerUnit,
  checkSampleListings,
  completeness,
  confirmationAge,
  listingsOfUnit,
  sampleEarlierListings,
  unitKind,
  type SampleListings,
} from "../src/modules/listings";
import { inventoryRows } from "../src/modules/listings/ui";

const load = (file: string) =>
  JSON.parse(
    execFileSync(
      "python3",
      [
        "-c",
        [
          "import json, sys",
          "sys.path.insert(0, 'tools')",
          "from pathlib import Path",
          "from repo_ontology import load_yaml_file",
          `print(json.dumps(load_yaml_file(Path('${file}'))))`,
        ].join("\n"),
      ],
      { encoding: "utf8" },
    ),
  );

// ---- AC-1: the model --------------------------------------------------------------------------------------------

/** The five new listing fields and their agreed types (Hỏi-1, Hỏi-6 at the scope gate), written before the code. */
const NEW_FIELDS: Record<string, { type: string; values?: string[] }> = {
  furnished: { type: "enum", values: ["Furnished", "Partially", "Unfurnished"] },
  occupantType: { type: "enum", values: ["Owner", "Tenant", "Vacant"] },
  legalStatus: { type: "string" },
  financing: { type: "string" },
  originalEntryTimestamp: { type: "datetime" },
};

type Entity = {
  properties: Record<string, { type: string; values?: string[] }>;
  rules?: { id: string }[];
};

function listingFieldErrors(entity: Entity): string[] {
  const errors: string[] = [];
  for (const [key, want] of Object.entries(NEW_FIELDS)) {
    const got = entity.properties[key];
    if (!got) {
      errors.push(`listing field missing: ${key}`);
      continue;
    }
    if (got.type !== want.type || JSON.stringify(got.values) !== JSON.stringify(want.values))
      errors.push(`listing field type: ${key}`);
  }
  if (!entity.rules?.some((r) => r.id === "one-open-listing-per-unit"))
    errors.push("rule missing: one-open-listing-per-unit");
  return errors;
}

/** Every new label of row 3b, written before the code. */
const NEW_LABELS = [
  "Furnished",
  "OccupantType",
  "LegalStatus",
  "Financing",
  "OriginalEntryTimestamp",
  "DirectionFaces",
  "PropertySubType",
  "SubTypeCondominium",
  "SubTypeTownhouse",
  "SubTypeSingleFamily",
  "SubTypeLand",
  "FurnishedFull",
  "FurnishedPartial",
  "FurnishedNone",
  "OccupantOwner",
  "OccupantTenant",
  "OccupantVacant",
  "UnitKind",
  "Completeness",
  "CurrentListing",
  "ViewedListing",
  "ListingsOfUnit",
] as const;

function labelErrors(labels: Record<string, { pref: string } | undefined>): string[] {
  const errors: string[] = [];
  for (const key of NEW_LABELS) {
    const pref = labels[key]?.pref ?? "";
    if (pref === "") errors.push(`label missing: ${key}`);
    else if (pref.length > 17) errors.push(`label too long: ${key}`);
  }
  return errors;
}

describe("AC-1 · the listing model of row 3b", () => {
  const listing = load("ontology/entities/Listing.yaml") as Entity;

  it("has the five new fields with the agreed types and the one-open-listing rule", () => {
    expect(Object.keys(NEW_FIELDS).filter((k) => listing.properties[k]).length).toBe(5);
    expect(listingFieldErrors(listing)).toEqual([]);
  });

  it("break: a missing field and a furnished field turned into free text are named", () => {
    const broken = structuredClone(listing);
    delete broken.properties.financing;
    broken.properties.furnished = { type: "string" };
    expect(listingFieldErrors(broken)).toEqual([
      "listing field type: furnished",
      "listing field missing: financing",
    ]);
  });

  it("labels every new concept and value in at most 17 characters", () => {
    expect(labelErrors(LABELS as Record<string, { pref: string }>)).toEqual([]);
  });

  it("break: a label of 18 characters is named", () => {
    const broken = { ...LABELS, Completeness: { pref: "Mức đủ của thông tin" } };
    expect(labelErrors(broken as Record<string, { pref: string }>)).toEqual([
      "label too long: Completeness",
    ]);
  });
});

// ---- AC-2: the sample data ---------------------------------------------------------------------------------------

const units = sampleUnits().map((u) => ({ ...u, subdivisionName: subdivisionNameOf(u) }));
const current = buildSampleListings({ companyId: SAMPLE_COMPANY.id, units });
const earlier = sampleEarlierListings(current);
const all: SampleListings = {
  listings: [...current.listings, ...earlier.listings],
  listingUnits: [...current.listingUnits, ...earlier.listingUnits],
};

/** id·status·price of the 60 current listings as main had them before row 3b (computed on origin/main dcf39ff). */
const CURRENT_PIN = "c6b76b11da4fb71be13147e11e8461b608d1212ba01128604b29aa90e75bf121";
const pinOf = (data: SampleListings) =>
  createHash("sha256")
    .update(data.listings.map((l) => `${l.id}·${l.standardStatus}·${l.listPrice}`).join("\n"))
    .digest("hex");
const currentSampleErrors = (data: SampleListings) =>
  data.listings.length === 60 && pinOf(data) === CURRENT_PIN ? [] : ["current sample changed"];

describe("AC-2 · sample listings with earlier listings", () => {
  it("keeps the 60 current listings and the 60 grid rows", () => {
    expect(currentSampleErrors(current)).toEqual([]);
    expect(inventoryRows({ ...current, units }).length).toBe(60);
  });

  it("break: changing one current price is named", () => {
    const broken = structuredClone(current);
    broken.listings[4]!.listPrice = (broken.listings[4]!.listPrice ?? 0) + 10_000_000;
    expect(currentSampleErrors(broken)).toEqual(["current sample changed"]);
  });

  it("adds earlier closed or withdrawn listings, labelled MAU, on units that have a current listing", () => {
    expect(earlier.listings.length).toBeGreaterThanOrEqual(10);
    const currentUpis = new Set(current.listingUnits.map((x) => x.upi));
    const createdOf = new Map(
      all.listings.map((l) => [l.id, Date.parse(l.originalEntryTimestamp ?? "")]),
    );
    for (const l of earlier.listings) {
      expect(["Closed", "Withdrawn"]).toContain(l.standardStatus);
      expect(l.id.startsWith(SAMPLE_ID_PREFIX)).toBe(true);
    }
    for (const x of earlier.listingUnits) {
      expect(currentUpis.has(x.upi)).toBe(true);
      const now = current.listingUnits.find((c) => c.upi === x.upi)!;
      expect(createdOf.get(x.listingId)!).toBeLessThan(createdOf.get(now.listingId)!);
    }
    expect(checkListingLinks(earlier, new Set(units.map((u) => u.upi)), SAMPLE_COMPANY.id)).toEqual(
      [],
    );
    expect(checkListingLabels(earlier, SAMPLE_COMPANY)).toEqual([]);
    expect(checkSampleListings(current, units)).toEqual([]);
  });

  it("gives every listing a creation time and each offer detail both filled and empty somewhere", () => {
    for (const l of all.listings) expect(l.originalEntryTimestamp, l.id).toBeTruthy();
    for (const part of ["furnished", "legalStatus", "financing", "occupantType"] as const) {
      expect(
        all.listings.some((l) => l[part]),
        part,
      ).toBe(true);
      expect(
        all.listings.some((l) => !l[part]),
        part,
      ).toBe(true);
    }
  });

  it("has a unit with three listings whose first differs from the newest in price, completeness and confirmation", () => {
    const now = new Date("2026-11-13T03:00:00Z");
    const threes = units.filter(
      (u) => listingsOfUnit(u.upi, all.listings, all.listingUnits).length === 3,
    );
    expect(threes.length).toBeGreaterThan(0);
    const listed = listingsOfUnit(threes[0]!.upi, all.listings, all.listingUnits);
    const newest = listed[0]!.listing;
    const first = listed[2]!.listing;
    expect(first.listPrice).not.toBe(newest.listPrice);
    expect(completeness(first).have).not.toBe(completeness(newest).have);
    expect(confirmationAge(first.lastConfirmedAt, now)).not.toBe(
      confirmationAge(newest.lastConfirmedAt, now),
    );
    expect(listed.some(({ listing }) => completeness(listing).missing.length > 0)).toBe(true);
  });

  it("keeps one open listing per unit across current and earlier listings", () => {
    expect(checkOneOpenListingPerUnit(all)).toEqual([]);
  });

  // The six statuses of an earlier listing while the newest is Active, written before the code (Hỏi-5): 6/6 cases.
  const MATRIX: Record<(typeof STANDARD_STATUSES)[number], boolean> = {
    Incomplete: true,
    Active: true,
    Pending: true,
    Hold: true,
    Closed: false,
    Withdrawn: false,
  };
  let cases = 0;
  for (const status of STANDARD_STATUSES) {
    it(`an earlier listing that is ${status} beside an Active one ${MATRIX[status] ? "breaks" : "keeps"} the rule`, () => {
      const unitWithEarlier = earlier.listingUnits[0]!;
      const newest = current.listingUnits.find((x) => x.upi === unitWithEarlier.upi)!;
      const broken = structuredClone(all);
      for (const l of broken.listings) {
        if (l.id === newest.listingId) l.standardStatus = "Active";
        if (l.id === unitWithEarlier.listingId) l.standardStatus = status;
      }
      const errors = checkOneOpenListingPerUnit(broken);
      expect(errors).toEqual(
        MATRIX[status] ? [`two open listings on one unit: ${unitWithEarlier.upi}`] : [],
      );
      cases += 1;
    });
  }
  it("ran all six status cases", () => {
    expect(cases).toBe(6);
    expect(OPEN_STATUSES).toEqual(["Incomplete", "Active", "Pending", "Hold"]);
  });
});

// ---- AC-4: confirmation age on the Vietnam calendar --------------------------------------------------------------

/** UTC calendar days, the way onehub-quy-hang counts: the break case of the Vietnam count. */
const utcAge = (at: string, now: Date) =>
  Math.max(0, Math.floor(now.getTime() / 86_400_000) - Math.floor(Date.parse(at) / 86_400_000));

describe("AC-4 · confirmation age", () => {
  const now = new Date("2026-11-13T03:00:00Z"); // 10:00 in Vietnam
  const MATRIX: [string, string | null, number | null][] = [
    ["same day in Vietnam", "2026-11-13T08:00:00+07:00", 0],
    ["23:30 yesterday in Vietnam", "2026-11-12T23:30:00+07:00", 1],
    ["06:00 this morning in Vietnam (23:00Z yesterday)", "2026-11-13T06:00:00+07:00", 0],
    ["nine days ago", "2026-11-04T09:00:00+07:00", 9],
    ["never confirmed", null, null],
    ["a date in the future", "2026-11-20T09:00:00+07:00", 0],
  ];
  let cases = 0;
  for (const [name, at, want] of MATRIX)
    it(name, () => {
      expect(confirmationAge(at, now)).toBe(want);
      cases += 1;
    });
  it("ran all six cases", () => expect(cases).toBe(6));

  it("break: counting on UTC calls 06:00 local yesterday", () => {
    const at = "2026-11-13T06:00:00+07:00";
    const message =
      utcAge(at, now) !== confirmationAge(at, now)
        ? "confirmation age: 06:00 local counted as yesterday"
        : "";
    expect(message).toBe("confirmation age: 06:00 local counted as yesterday");
  });
});

// ---- AC-6: completeness, all 32 combinations ---------------------------------------------------------------------

const PRESENT_VALUE: Record<(typeof COMPLETENESS_PARTS)[number], unknown> = {
  listPrice: 4_500_000_000,
  furnished: "Furnished",
  legalStatus: "Sổ hồng",
  financing: "Không vay",
  occupantType: "Vacant",
};

function completenessErrors(rule: typeof completeness): string[] {
  const errors: string[] = [];
  for (let mask = 0; mask < 32; mask++) {
    const listing: Record<string, unknown> = {};
    const want: string[] = [];
    COMPLETENESS_PARTS.forEach((part, i) => {
      if (mask & (1 << i)) listing[part] = PRESENT_VALUE[part];
      else {
        // Alternate the way a part is missing: absent, or an empty text.
        if (part === "legalStatus" || part === "financing") listing[part] = i % 2 ? "" : "  ";
        want.push(part);
      }
    });
    const got = rule(listing as never);
    if (got.need !== 5 || got.have !== 5 - want.length) errors.push(`completeness count: ${mask}`);
    else if (got.missing.join() !== want.join()) {
      const sameSet = [...got.missing].sort().join() === [...want].sort().join();
      errors.push(sameSet ? "completeness order" : "empty string counted as present");
    }
  }
  return errors;
}

describe("AC-6 · completeness", () => {
  it("is right in all 32 combinations of present and missing parts", () => {
    expect(completenessErrors(completeness)).toEqual([]);
  });

  it("break: missing parts in reverse order are named", () => {
    const reversed: typeof completeness = (l) => {
      const c = completeness(l);
      return { ...c, missing: [...c.missing].reverse() };
    };
    expect(completenessErrors(reversed)).toContain("completeness order");
  });

  it("break: an empty text counted as present is named", () => {
    const loose: typeof completeness = (l) => {
      const missing = COMPLETENESS_PARTS.filter((p) => l[p] === undefined || l[p] === null);
      return { have: 5 - missing.length, need: 5, missing };
    };
    expect(completenessErrors(loose).some((e) => e.startsWith("completeness count"))).toBe(true);
  });
});

describe("AC-3 · unit kind", () => {
  it("reads the bedrooms the way the record shows them", () => {
    expect(unitKind(0)).toBe("Studio");
    expect(unitKind(2)).toBe("2PN");
    expect(unitKind(null)).toBeNull();
    expect(unitKind(undefined)).toBeNull();
  });
});
