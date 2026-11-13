// @vitest-environment jsdom
// The full unit record of row 3b (_acceptance/ho-so-du-thong-tin), rendered: the unit block (E3), the head of the record
// (E4), the listing block (E5), the completeness bar (E6) and turning to an earlier listing (E7, unit level). Each check
// is a function run on the real record; its break case runs the same function on a broken record and pins the message.
import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

import { sampleInventoryRows, sampleRecords } from "../src/app/(app)/inventory-sample-rows";
import { EMPTY, formatArea, formatMoney } from "../src/lib/format";
import { label } from "../src/modules/company-config";
import { sampleUnits, subdivisionNameOf } from "../src/modules/catalog";
import { completeness, unitKind } from "../src/modules/listings";
import {
  ListingRecordFull,
  RECORD_COPY,
  confirmationSentence,
  listingView,
  type InventoryField,
  type ListingRecordData,
  type RecordLabels,
} from "../src/modules/listings/ui";

beforeAll(() => {
  Element.prototype.getAnimations ??= () => [];
});
afterEach(cleanup);

const HEADERS: Record<InventoryField, string> = {
  "Listing.unitNumber": label("Unit"),
  "Listing.buildingName": label("Building"),
  "Listing.subdivisionName": label("Subdivision"),
  "Listing.standardStatus": label("StandardStatus"),
  "Listing.listPrice": label("ListPrice"),
  "Unit.livingArea": label("LivingArea"),
  "Unit.bedroomsTotal": label("BedroomsTotal"),
  "Listing.lastConfirmedAt": label("LastConfirmedAt"),
};

const LABELS: RecordLabels = {
  unit: label("Unit"),
  unitKind: label("UnitKind"),
  livingArea: label("LivingArea"),
  bedrooms: label("BedroomsTotal"),
  floor: label("UnitFloorLocation"),
  direction: label("DirectionFaces"),
  building: label("Building"),
  subdivision: label("Subdivision"),
  propertyType: label("PropertySubType"),
  listPrice: label("ListPrice"),
  completeness: label("Completeness"),
  currentListing: label("CurrentListing"),
  viewedListing: label("ViewedListing"),
  listingsOfUnit: label("ListingsOfUnit"),
  parts: {
    listPrice: label("ListPrice"),
    furnished: label("Furnished"),
    legalStatus: label("LegalStatus"),
    financing: label("Financing"),
    occupantType: label("OccupantType"),
  },
  furnishedValues: {
    Furnished: label("FurnishedFull"),
    Partially: label("FurnishedPartial"),
    Unfurnished: label("FurnishedNone"),
  },
  occupantValues: {
    Owner: label("OccupantOwner"),
    Tenant: label("OccupantTenant"),
    Vacant: label("OccupantVacant"),
  },
  propertyTypeValues: {
    Condominium: label("SubTypeCondominium"),
    Townhouse: label("SubTypeTownhouse"),
    "Single Family Residence": label("SubTypeSingleFamily"),
    "Unimproved Land": label("SubTypeLand"),
  },
};

const NOW = new Date("2026-11-13T03:00:00Z");
const rows = sampleInventoryRows();
const records = sampleRecords(NOW);
const units = sampleUnits().map((u) => ({ ...u, subdivisionName: subdivisionNameOf(u) }));

function renderRecord(rowId: string, data: ListingRecordData = records[rowId]!) {
  const row = rows.find((r) => r.id === rowId)!;
  return render(<ListingRecordFull view={listingView(row, HEADERS)} data={data} labels={LABELS} />);
}

const blockRows = (root: ParentNode, slot: string) =>
  [...root.querySelectorAll(`[data-slot="${slot}"] [data-field]`)].map((el) => ({
    label: el.querySelector("dt")?.textContent ?? "",
    value: el.querySelector("dd")?.textContent ?? "",
    empty: el.querySelector("dd")?.hasAttribute("data-empty") ?? false,
  }));
const slotText = (root: ParentNode, slot: string) =>
  root.querySelector(`[data-slot="${slot}"]`)?.textContent?.trim() ?? "";

// ---- E3 · the unit block -----------------------------------------------------------------------------------------

const UNIT_LABELS = [
  "Mã căn",
  LABELS.unitKind,
  LABELS.livingArea,
  LABELS.floor,
  LABELS.direction,
  LABELS.building,
  LABELS.subdivision,
  LABELS.propertyType,
];

/** The unit block against the unit in the catalog (read again here, not copied from the record). */
function unitBlockErrors(root: ParentNode, upi: string): string[] {
  const unit = units.find((u) => u.upi === upi)!;
  const got = blockRows(root, "listing-unit");
  const want = [
    unit.unitNumber,
    unitKind(unit.bedroomsTotal) ?? EMPTY,
    unit.livingArea === undefined ? EMPTY : formatArea(unit.livingArea),
    unit.floor ?? EMPTY,
    unit.directionFaces ?? EMPTY,
    unit.buildingName,
    unit.subdivisionName ?? EMPTY,
    LABELS.propertyTypeValues[unit.propertySubType] ?? EMPTY,
  ];
  if (got.map((r) => r.label).join("|") !== UNIT_LABELS.join("|")) return ["unit block labels"];
  return got.flatMap((r, i) => (r.value === want[i] ? [] : [`unit block disagrees: ${r.label}`]));
}

const upiOfRow = (rowId: string) => {
  const row = rows.find((r) => r.id === rowId)!;
  return units.find(
    (u) =>
      u.buildingName === row["Listing.buildingName"] && u.unitNumber === row["Listing.unitNumber"],
  )!.upi;
};

describe("E3 · the unit block", () => {
  it("shows the eight unit facts of every sample row from the catalog", () => {
    for (const row of rows) {
      const { container } = renderRecord(row.id);
      expect(unitBlockErrors(container, upiOfRow(row.id)), row.id).toEqual([]);
      cleanup();
    }
  });

  it("shows «—» for a unit with no floor and no direction", () => {
    const id = rows[0]!.id;
    const bare = structuredClone(records[id]!);
    bare.unit.floor = null;
    bare.unit.directionFaces = null;
    const { container } = renderRecord(id, bare);
    const got = blockRows(container, "listing-unit");
    expect(got.find((r) => r.label === LABELS.floor)?.value).toBe(EMPTY);
    expect(got.find((r) => r.label === LABELS.direction)?.value).toBe(EMPTY);
  });

  it("break: a record that takes another unit's direction is named", () => {
    const id = rows[0]!.id;
    const other = structuredClone(records[id]!);
    other.unit.directionFaces = other.unit.directionFaces === "Nam" ? "Bắc" : "Nam";
    const { container } = renderRecord(id, other);
    expect(unitBlockErrors(container, upiOfRow(id))).toEqual([
      `unit block disagrees: ${LABELS.direction}`,
    ]);
  });
});

// ---- E4 · the head of the record ---------------------------------------------------------------------------------

function headErrors(root: ParentNode, data: ListingRecordData): string[] {
  const errors: string[] = [];
  const u = data.unit;
  const place = [
    u.subdivisionName,
    u.buildingName,
    u.propertySubType && LABELS.propertyTypeValues[u.propertySubType],
  ]
    .filter(Boolean)
    .join(" · ");
  if (slotText(root, "listing-card-place") !== place)
    errors.push(
      slotText(root, "listing-card-place").includes(
        LABELS.propertyTypeValues[u.propertySubType ?? ""] ?? "\u0000",
      )
        ? "place line order"
        : "place line missing property type",
    );
  const facts = [...root.querySelectorAll('[data-slot="listing-card-facts"] dt')].map(
    (el) => el.textContent,
  );
  if (facts.join("|") !== [LABELS.livingArea, LABELS.bedrooms, LABELS.direction].join("|"))
    errors.push(`card facts: ${facts.join(", ")}`);
  if (
    slotText(root, "listing-confirmation") !== confirmationSentence(data.listings[0]!.confirmedDays)
  )
    errors.push("confirmation sentence");
  return errors;
}

describe("E4 · the head of the record", () => {
  it("says the place with the property type, the three facts with the direction, and the confirmation", () => {
    for (const row of rows.slice(0, 12)) {
      const { container } = renderRecord(row.id);
      expect(headErrors(container, records[row.id]!), row.id).toEqual([]);
      cleanup();
    }
  });

  it("writes the three confirmation sentences", () => {
    expect(confirmationSentence(0)).toBe("Xác nhận hôm nay");
    expect(confirmationSentence(9)).toBe("Xác nhận 9 ngày trước");
    expect(confirmationSentence(null)).toBe("Chưa xác nhận với chủ nhà");
  });

  it("break: a place line without the property type is named", () => {
    const id = rows[0]!.id;
    const bare = structuredClone(records[id]!);
    bare.unit.propertySubType = null;
    const { container } = renderRecord(id, bare);
    expect(headErrors(container, records[id]!)).toContain("place line missing property type");
  });
});

// ---- E5 · the listing block --------------------------------------------------------------------------------------

const OFFER_LABELS = [
  LABELS.parts.legalStatus,
  LABELS.parts.furnished,
  LABELS.parts.financing,
  LABELS.parts.occupantType,
];

function offerErrors(root: ParentNode, data: ListingRecordData, at = 0): string[] {
  const l = data.listings[at]!;
  const got = blockRows(root, "listing-offer");
  if (got.map((r) => r.label).join("|") !== OFFER_LABELS.join("|")) return ["offer block labels"];
  const want = [
    l.legalStatus?.trim() || null,
    l.furnished ? LABELS.furnishedValues[l.furnished] : null,
    l.financing?.trim() || null,
    l.occupantType ? LABELS.occupantValues[l.occupantType] : null,
  ];
  return got.flatMap((r, i) => {
    if (want[i] === null)
      return r.empty && r.value === RECORD_COPY.missing ? [] : ["missing offer field not marked"];
    return r.value === want[i] ? [] : [`offer block disagrees: ${r.label}`];
  });
}

describe("E5 · the listing block", () => {
  it("shows the four details of every listing, «Chưa có» where one is missing", () => {
    for (const row of rows) {
      const { container } = renderRecord(row.id);
      expect(offerErrors(container, records[row.id]!), row.id).toEqual([]);
      cleanup();
    }
  });

  it("marks all four as «Chưa có» on a listing that has none, and names the block by the listing's status", () => {
    const id = rows.find((r) => r["Listing.standardStatus"] === "Active")!.id;
    const bare = structuredClone(records[id]!);
    const l = bare.listings[0]!;
    delete l.furnished;
    delete l.occupantType;
    l.legalStatus = "  ";
    delete l.financing;
    const { container } = renderRecord(id, bare);
    expect(
      blockRows(container, "listing-offer").every((r) => r.empty && r.value === "Chưa có"),
    ).toBe(true);
    expect(container.querySelector('[data-slot="listing-offer"] h3')?.textContent).toBe(
      LABELS.currentListing,
    );
    cleanup();
    const closedId = rows.find((r) => r["Listing.standardStatus"] === "Closed")!.id;
    const { container: closed } = renderRecord(closedId);
    expect(closed.querySelector('[data-slot="listing-offer"] h3')?.textContent).toBe(
      LABELS.viewedListing,
    );
  });

  it("break: «—» in place of «Chưa có» is named", () => {
    const id = rows.find((r) => records[r.id]!.listings[0]!.furnished === undefined)!.id;
    const { container } = renderRecord(id);
    const cell = container.querySelector(
      '[data-slot="listing-offer"] [data-field="Listing.furnished"] dd',
    )!;
    cell.textContent = EMPTY;
    expect(offerErrors(container, records[id]!)).toEqual(["missing offer field not marked"]);
  });
});

// ---- E6 · the completeness bar -----------------------------------------------------------------------------------

function completenessBarErrors(root: ParentNode, data: ListingRecordData, at = 0): string[] {
  const c = completeness(data.listings[at]!);
  const errors: string[] = [];
  if (slotText(root, "listing-completeness-count") !== `${c.have}/5`)
    errors.push("completeness count");
  const bar = root.querySelector('[data-slot="listing-completeness"] [role="progressbar"]');
  if (
    !bar ||
    bar.getAttribute("aria-valuenow") !== String(c.have) ||
    bar.getAttribute("aria-valuemax") !== "5"
  )
    errors.push("completeness bar value");
  if (!bar?.getAttribute("aria-label") && !bar?.getAttribute("aria-labelledby"))
    errors.push("completeness bar name");
  const want =
    c.missing.length === 0
      ? RECORD_COPY.complete
      : RECORD_COPY.lacking(c.missing.map((p) => LABELS.parts[p]));
  if (slotText(root, "listing-completeness-missing") !== want)
    errors.push("completeness missing line");
  return errors;
}

describe("E6 · the completeness bar", () => {
  it("shows the count, the bar and what is missing for every sample listing", () => {
    const seen = new Set<number>();
    for (const row of rows) {
      const { container } = renderRecord(row.id);
      expect(completenessBarErrors(container, records[row.id]!), row.id).toEqual([]);
      seen.add(completeness(records[row.id]!.listings[0]!).have);
      cleanup();
    }
    expect(seen.size).toBeGreaterThan(1);
  });

  it("break: a bar that shows the wrong count is named", () => {
    const id = rows[0]!.id;
    const { container } = renderRecord(id);
    container.querySelector('[data-slot="listing-completeness-count"]')!.textContent = "0/5";
    expect(completenessBarErrors(container, records[id]!)).toContain("completeness count");
  });
});

// ---- E7 (unit level) · turning to an earlier listing ---------------------------------------------------------------

describe("E7 · listings of the unit, unit level", () => {
  const id = Object.keys(records).find((k) => records[k]!.listings.length === 3)!;

  it("lists three listings newest first and turns the whole record to Lần 1, then back", () => {
    const data = records[id]!;
    const { container, getByRole } = renderRecord(id);
    const lines = [...container.querySelectorAll('[data-slot="listings-of-unit"] li')];
    expect(lines.map((li) => li.querySelector("button")?.textContent)).toEqual([
      "Lần 3",
      "Lần 2",
      "Lần 1",
    ]);
    expect(container.querySelector('[data-slot="listings-of-unit"] h3')?.textContent).toBe(
      "Các lần chào của căn · 3",
    );
    expect(lines[0]!.querySelector("button")?.getAttribute("aria-current")).toBe("true");

    fireEvent.click(getByRole("button", { name: "Lần 1" }));
    const first = data.listings[2]!;
    expect(slotText(container, "listing-card-price")).toBe(formatMoney(first.listPrice!));
    expect(
      container
        .querySelector('[data-slot="listing-card-status"] [data-status]')
        ?.getAttribute("data-status"),
    ).toBe(first.standardStatus);
    expect(offerErrors(container, data, 2)).toEqual([]);
    expect(completenessBarErrors(container, data, 2)).toEqual([]);
    expect(slotText(container, "listing-confirmation")).toBe(
      confirmationSentence(first.confirmedDays),
    );
    expect(slotText(container, "listing-earlier-note")).toContain("Đang xem lần chào cũ · Lần 1");

    fireEvent.click(getByRole("button", { name: "Về lần mới nhất" }));
    expect(slotText(container, "listing-card-price")).toBe(
      formatMoney(data.listings[0]!.listPrice!),
    );
    expect(container.querySelector('[data-slot="listing-earlier-note"]')).toBeNull();
  });
});
