// Row 7d E5: prefixed keys, minted once from a clock and randomness, never from content.
import { describe, expect, it } from "vitest";

import { isKey, KEY_PATTERN, mintKey } from "./keys";
import { checkCatalogHierarchy, sampleCatalog } from "./sample";

const R1 = Array.from({ length: 16 }, (_, i) => i * 7);
const R2 = Array.from({ length: 16 }, (_, i) => i * 7 + 1);
const NOW = Date.UTC(2026, 10, 12);

describe("khoá danh mục có tiền tố", () => {
  it.each(["bld", "stk", "unt"] as const)("tiền tố %s + 26 ký tự Crockford", (p) => {
    const k = mintKey(p, NOW, R1);
    expect(k).toMatch(KEY_PATTERN);
    expect(k.startsWith(`${p}_`)).toBe(true);
    expect(k).toHaveLength(4 + 26);
  });

  it("cùng nội dung, khác số ngẫu nhiên → hai khoá khác nhau", () => {
    expect(mintKey("unt", NOW, R1)).not.toBe(mintKey("unt", NOW, R2));
  });

  it("từ chối tiền tố lạ và khoá sai dạng", () => {
    expect(() => mintKey("blk" as "bld", NOW, R1)).toThrow("tiền tố khoá lạ: blk");
    expect(isKey("bld_" + "0".repeat(25))).toBe(false);
    expect(isKey("unt_" + "I".repeat(26))).toBe(false);
    expect(isKey("blk_" + "0".repeat(26))).toBe(false);
    expect(isKey(mintKey("stk", NOW, R1), "stk")).toBe(true);
    expect(isKey(mintKey("stk", NOW, R1), "unt")).toBe(false);
  });
});

describe("khoá và cấp của danh mục mẫu", () => {
  it("mọi khoá mẫu đúng dạng, không trùng, dựng hai lần ra cùng khoá", () => {
    const a = sampleCatalog();
    const keys = [
      ...a.buildings.map((b) => b.buildingKey),
      ...a.stacks.map((s) => s.stackKey),
      ...a.units.map((u) => u.unitKey),
    ];
    expect(keys.every((k) => KEY_PATTERN.test(k))).toBe(true);
    expect(new Set(keys).size).toBe(keys.length);
    expect(sampleCatalog().units.map((u) => u.unitKey)).toEqual(a.units.map((u) => u.unitKey));
  });

  it("một phân khu The Sapphire 1 dưới Ocean Park 1; toà E1, C1 thẳng dưới dự án; cấp hợp lệ", () => {
    const c = sampleCatalog();
    expect(c.complexes).toEqual([
      { slug: "op1-the-sapphire-1", name: "The Sapphire 1", subdivisionSlug: "op1" },
    ]);
    expect(
      c.buildings.filter((b) => b.complexKey === "op1-the-sapphire-1").map((b) => b.buildingName),
    ).toEqual(["S1.01", "S1.02", "S1.03", "S1.05"]);
    expect(c.buildings.filter((b) => !b.complexKey).map((b) => b.subdivisionKey)).toEqual([
      "op2",
      "op3",
    ]);
    expect(checkCatalogHierarchy(c)).toEqual([]);
  });

  it("đỏ: phân khu đặt cha là phân khu khác bị gọi tên", () => {
    const c = sampleCatalog();
    c.complexes.push({ slug: "pk-con", name: "PK con", subdivisionSlug: "op1-the-sapphire-1" });
    expect(checkCatalogHierarchy(c)).toEqual(["phân khu không thuộc dự án: pk-con"]);
  });
});
