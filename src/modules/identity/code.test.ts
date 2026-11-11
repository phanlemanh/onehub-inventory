import { describe, expect, it } from "vitest";

import {
  generateCode,
  hashCode,
  hashToken,
  isCodeShape,
  newSessionToken,
  normalizeCode,
  normalizeEmail,
  safeNext,
} from "./code";

describe("codes and tokens", () => {
  it("generates six digits, keeping leading zeros", () => {
    const codes = Array.from({ length: 2000 }, generateCode);
    expect(codes.every((c) => /^\d{6}$/.test(c))).toBe(true);
    expect(new Set(codes).size).toBeGreaterThan(1900);
    expect(codes.some((c) => c.startsWith("0"))).toBe(true);
  });

  it("reduces a pasted code to its digits", () => {
    expect(normalizeCode("123 456")).toBe("123456");
    expect(normalizeCode(" 123-456\n")).toBe("123456");
    expect(isCodeShape(normalizeCode("123-456"))).toBe(true);
    expect(isCodeShape("12345")).toBe(false);
    expect(isCodeShape("1234567")).toBe(false);
  });

  it("hashes a code per email and per secret, never returning the code", () => {
    const h = hashCode("s1", "A@Example.test ", "123456");
    expect(h).toBe(hashCode("s1", "a@example.test", "123456"));
    expect(h).not.toBe(hashCode("s2", "a@example.test", "123456"));
    expect(h).not.toBe(hashCode("s1", "b@example.test", "123456"));
    expect(h).not.toContain("123456");
    expect(normalizeEmail("  X@Y.TEST ")).toBe("x@y.test");
  });

  it("makes long random session tokens and hashes them", () => {
    const a = newSessionToken();
    expect(a.length).toBeGreaterThanOrEqual(43);
    expect(a).not.toBe(newSessionToken());
    expect(hashToken(a)).toMatch(/^[0-9a-f]{64}$/);
    expect(hashToken(a)).not.toContain(a);
  });

  it("only returns to a path of this site", () => {
    expect(safeNext("/inventory")).toBe("/inventory");
    expect(safeNext("https://example.com")).toBe("/");
    expect(safeNext("//example.com")).toBe("/");
    expect(safeNext("/\\example.com")).toBe("/");
    expect(safeNext(undefined)).toBe("/");
  });
});
