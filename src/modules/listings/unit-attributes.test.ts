// Row 3h (tin-rao-giu-gia-tri-rieng): which value of the five unit attributes wins, the readers of a typed value, and
// the unitAttributes change of the save door. Each measure has a case that holds and a case it must refuse.
import { describe, expect, it } from "vitest";

import type { Listing } from "../../generated/ontology";
import {
  applyChange,
  effectiveAttributes,
  readBedrooms,
  readDirection,
  readFloor,
  readLivingArea,
  sameAttribute,
  sourceWins,
  unitKind,
} from "./index";
import { UNIT_ATTRIBUTE_COPY } from "./ui/unit-attribute-copy";

const CATALOG = {
  livingArea: 68.5,
  floor: "11",
  bedroomsTotal: 2,
  directionFaces: "Đông Bắc",
  propertySubType: "Condominium",
};

const listing = (over: Partial<Listing> = {}): Listing => ({
  id: "4d415500-0001-4000-8000-000000000002",
  companyId: "4d415500-0000-4000-8000-000000000001",
  buildingName: "S1.01",
  unitNumber: "1102",
  standardStatus: "Active",
  version: 1,
  ...over,
});

describe("hieu-luc", () => {
  it("no own value follows the catalog, with no mark", () => {
    const e = effectiveAttributes(listing(), CATALOG);
    expect(e.livingArea).toEqual({
      value: 68.5,
      source: "Catalog",
      catalogValue: 68.5,
      differs: false,
    });
    expect(e.propertySubType.value).toBe("Condominium");
  });

  it("an own value wins over the catalog and is marked when it differs", () => {
    const e = effectiveAttributes(
      listing({ livingArea: 72.5, livingAreaSource: "Typed" }),
      CATALOG,
    );
    expect(e.livingArea).toEqual({
      value: 72.5,
      source: "Typed",
      catalogValue: 68.5,
      differs: true,
    });
  });

  it("an own value equal to the catalog's (numbers as numbers, words folded) is not marked", () => {
    const e = effectiveAttributes(
      listing({
        bedroomsTotal: 2,
        bedroomsTotalSource: "Typed",
        directionFaces: "dong bac",
        directionFacesSource: "File",
      }),
      CATALOG,
    );
    expect(e.bedroomsTotal.differs).toBe(false);
    expect(e.directionFaces).toMatchObject({ source: "File", differs: false });
    expect(sameAttribute(68.5, "68.5")).toBe(true);
    expect(sameAttribute("Đông Bắc", "Tây Bắc")).toBe(false);
  });

  it("an empty catalog value and a pending unit (no catalog unit) never mark an own value", () => {
    const own = listing({ directionFaces: "Nam", directionFacesSource: "Typed" });
    expect(effectiveAttributes(own, { ...CATALOG, directionFaces: null }).directionFaces).toEqual({
      value: "Nam",
      source: "Typed",
      catalogValue: null,
      differs: false,
    });
    expect(effectiveAttributes(own, undefined).directionFaces.differs).toBe(false);
    expect(effectiveAttributes(listing(), undefined).livingArea).toEqual({
      value: null,
      source: null,
      catalogValue: null,
      differs: false,
    });
  });

  it("the unit kind is read from the effective bedrooms of the listing", () => {
    const e = effectiveAttributes(
      listing({ bedroomsTotal: 0, bedroomsTotalSource: "Typed" }),
      CATALOG,
    );
    expect(unitKind(e.bedroomsTotal.value)).toBe("Studio");
    expect(unitKind(effectiveAttributes(listing(), CATALOG).bedroomsTotal.value)).toBe("2PN");
  });

  it("typed beats a file, a file never replaces what was typed", () => {
    expect(sourceWins(undefined, "File")).toBe(true);
    expect(sourceWins("File", "Typed")).toBe(true);
    expect(sourceWins("Typed", "File")).toBe(false);
  });
});

describe("doc-gia-tri", () => {
  it("reads a living area as brokers type it", () => {
    for (const typed of ["72,5", "72.5", "72,5 m2", "72,5m²", " 72,5 M2 "])
      expect(readLivingArea(typed), typed).toEqual({ ok: true, value: 72.5 });
  });

  it("refuses an area that is empty, words, zero or negative, with its sentence", () => {
    expect(readLivingArea("")).toEqual({ ok: false, problem: "empty" });
    expect(readLivingArea("bảy mươi")).toEqual({ ok: false, problem: "not-a-number" });
    expect(readLivingArea("0")).toEqual({ ok: false, problem: "not-positive" });
    expect(readLivingArea("-5")).toEqual({ ok: false, problem: "not-positive" });
    expect(UNIT_ATTRIBUTE_COPY.problem("livingArea", "not-a-number", "bảy mươi")).toBe(
      "Chưa hiểu «bảy mươi» — gõ số như 72,5 hoặc 72,5 m².",
    );
    expect(UNIT_ATTRIBUTE_COPY.problem("livingArea", "not-positive", "0")).toBe(
      "Phải lớn hơn 0 — gõ số như 72,5 hoặc 72,5 m².",
    );
  });

  it("reads bedrooms as a whole number from 0", () => {
    expect(readBedrooms("2")).toEqual({ ok: true, value: 2 });
    expect(readBedrooms("0")).toEqual({ ok: true, value: 0 });
  });

  it("refuses half a bedroom and a word, pointing at 0 for a studio", () => {
    expect(readBedrooms("2,5")).toEqual({ ok: false, problem: "not-whole" });
    expect(readBedrooms("Studio")).toEqual({ ok: false, problem: "not-a-number" });
    expect(UNIT_ATTRIBUTE_COPY.problem("bedroomsTotal", "not-whole", "2,5")).toBe(
      "Không có nửa phòng — gõ số nguyên như 2; studio thì gõ 0.",
    );
    expect(UNIT_ATTRIBUTE_COPY.problem("bedroomsTotal", "not-a-number", "Studio")).toBe(
      "Chưa hiểu «Studio» — gõ số nguyên như 2; studio thì gõ 0.",
    );
  });

  it("reads a floor by the catalog's floor rule and refuses a leading zero", () => {
    expect(readFloor("7")).toEqual({ ok: true, value: "7" });
    expect(readFloor("15a")).toEqual({ ok: true, value: "15A" });
    expect(readFloor("07")).toEqual({ ok: false, problem: "not-a-floor" });
    expect(UNIT_ATTRIBUTE_COPY.problem("floor", "not-a-floor", "07")).toBe(
      "Chưa hiểu «07» — gõ tầng như 7 hoặc 15A, không có số 0 đứng đầu.",
    );
  });

  it("reads a direction as one of the catalog's eight, and refuses any other", () => {
    expect(readDirection("dong nam")).toEqual({ ok: true, value: "Đông Nam" });
    expect(readDirection("Hồ")).toEqual({ ok: false, problem: "not-an-option" });
  });
});

describe("cong-luu-thuoc-tinh", () => {
  const AT = "2026-11-27T09:00:00.000Z";

  it("writes the named values as typed, moves the version and counts as confirmed", () => {
    const out = applyChange(
      listing(),
      { field: "unitAttributes", livingArea: 72.5, floor: "15A" },
      AT,
    );
    expect(out).toMatchObject({
      ok: true,
      listing: {
        livingArea: 72.5,
        livingAreaSource: "Typed",
        floor: "15A",
        floorSource: "Typed",
        version: 2,
        lastConfirmedAt: AT,
      },
    });
    if (out.ok) expect(out.listing.bedroomsTotal).toBeUndefined();
  });

  it("null clears the own value and its source; undo can write a file's value back with its source", () => {
    const own = listing({ livingArea: 72.5, livingAreaSource: "File" });
    const cleared = applyChange(own, { field: "unitAttributes", livingArea: null }, AT);
    expect(cleared.ok && "livingArea" in cleared.listing).toBe(false);
    expect(cleared.ok && "livingAreaSource" in cleared.listing).toBe(false);
    const back = applyChange(
      listing(),
      { field: "unitAttributes", livingArea: 72.5, sources: { livingArea: "File" } },
      AT,
    );
    expect(back).toMatchObject({ ok: true, listing: { livingAreaSource: "File" } });
  });

  it("refuses a value the readers would not take, an empty change, and a closed or withdrawn listing", () => {
    expect(applyChange(listing(), { field: "unitAttributes", floor: "07" }, AT)).toEqual({
      ok: false,
      why: { rule: "attributes" },
    });
    expect(applyChange(listing(), { field: "unitAttributes", bedroomsTotal: 2.5 }, AT)).toEqual({
      ok: false,
      why: { rule: "attributes" },
    });
    expect(applyChange(listing(), { field: "unitAttributes" }, AT)).toEqual({
      ok: false,
      why: { rule: "attributes" },
    });
    for (const standardStatus of ["Closed", "Withdrawn"] as const)
      expect(
        applyChange(listing({ standardStatus }), { field: "unitAttributes", livingArea: 70 }, AT),
      ).toEqual({ ok: false, why: { rule: "locked" } });
  });
});
