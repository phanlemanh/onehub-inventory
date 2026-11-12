// Row 7d E5: prefixed keys, minted once from a clock and randomness, never from content.
import { describe, expect, it } from "vitest";

import { isKey, KEY_PATTERN, mintKey } from "./keys";

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
