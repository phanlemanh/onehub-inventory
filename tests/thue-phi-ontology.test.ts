// Row 19 (thue-phi), E5 written before the code: the fee inclusion of a listing in the model, the fee concepts in the
// label table, and the sample rows the inventory's fee cases need.
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { sampleInventoryListings } from "@/app/(app)/inventory-sample-rows";
import { LABELS } from "@/generated/labels";

const ROOT = join(__dirname, "..");
const read = (p: string) => readFileSync(join(ROOT, p), "utf8");

describe("listing-co-dieu-kien-phi", () => {
  it("Listing.feeInclusion has two values, is our own, and is in the glossary and the label table", () => {
    const listing = read("ontology/entities/Listing.yaml");
    expect(listing).toMatch(/feeInclusion: \{ type: enum, values: \[Included, Excluded\]/);
    expect(listing).not.toMatch(/feeInclusion:.*reso:/);
    const glossary = read("ontology/glossary.md");
    for (const term of ["FeeInclusion", "FeeSchedule", "FeeItem", "NetToSeller"]) {
      expect(glossary, term).toContain("`" + term + "`");
    }
    expect(glossary).toMatch(/`FeeInclusion`.*RESO 2\.1 không có/);
  });
});

describe("nhan-tu-bang-nhan", () => {
  it("every fee concept has a label of its own, none borrowing a RESO name", () => {
    const yaml = read("ontology/labels.yaml");
    const CONCEPTS = [
      "FeeSchedule",
      "PersonalIncomeTax",
      "RegistrationFee",
      "BrokerageFee",
      "NetToSeller",
      "FeeInclusion",
      "FeeIncluded",
      "FeeExcluded",
    ] as const;
    for (const c of CONCEPTS) {
      expect(c in LABELS, `nhan-tu-bang-nhan: ${c}`).toBe(true);
      const block = yaml.split(`\n  ${c}:\n`)[1]?.split(/\n {2}[A-Z]/)[0] ?? "";
      expect(block, `nhan-tu-bang-nhan: ${c}`).toContain("own: true");
      expect(block, `nhan-tu-bang-nhan: ${c}`).not.toContain("reso:");
    }
  });
});

describe("mau-du-ba-loai", () => {
  const listings = sampleInventoryListings();
  it("Included", () =>
    expect(
      listings.some((l) => l.feeInclusion === "Included"),
      "Included",
    ).toBe(true));
  it("Excluded", () =>
    expect(
      listings.some((l) => l.feeInclusion === "Excluded"),
      "Excluded",
    ).toBe(true));
  it("thiếu điều kiện", () =>
    expect(
      listings.some((l) => l.feeInclusion === undefined),
      "thiếu điều kiện",
    ).toBe(true));
  it("Included 3.000.000.000", () =>
    expect(
      listings.some((l) => l.feeInclusion === "Included" && l.listPrice === 3_000_000_000),
      "mau-du-ba-loai: 3.000.000.000",
    ).toBe(true));
  it("thiếu Giá chào", () =>
    expect(
      listings.some((l) => l.listPrice === undefined),
      "thiếu Giá chào",
    ).toBe(true));
});
