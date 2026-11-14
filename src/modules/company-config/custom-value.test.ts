// Row 7e (lop-rieng-cua-san), eval E3: a value written into a custom field fits the field's kind. The matrix is
// written before the code — five kinds × two good values and three bad ones — and a retired field takes nothing.
import { describe, expect, it } from "vitest";

import { checkCustomValue, type CustomFieldShape } from "./rules";

const field = (kind: CustomFieldShape["kind"], options: string[] = []): CustomFieldShape => ({
  kind,
  options,
  retiredAt: undefined,
});

const LONG_OK = "a".repeat(500);
const LONG_BAD = "a".repeat(501);
const VIEWS = ["Biển", "Hồ", "Phố", "Nội khu"];

type Case = [CustomFieldShape, unknown, boolean, string];
const MATRIX: Case[] = [
  [field("text"), "Biển", true, "text short"],
  [field("text"), LONG_OK, true, "text 500"],
  [field("text"), LONG_BAD, false, "text 501"],
  [field("text"), 5, false, "text number"],
  [field("text"), null, false, "text null"],
  [field("number"), 0, true, "number zero"],
  [field("number"), -2.5, true, "number negative"],
  [field("number"), Number.NaN, false, "number NaN"],
  [field("number"), Number.POSITIVE_INFINITY, false, "number Infinity"],
  [field("number"), "5", false, "number as text"],
  [field("date"), "2026-02-28", true, "date plain"],
  [field("date"), "2024-02-29", true, "date leap day"],
  [field("date"), "2026-02-30", false, "date not real"],
  [field("date"), "28/02/2026", false, "date other shape"],
  [field("date"), "", false, "date empty"],
  [field("single_select", VIEWS), "Biển", true, "select first"],
  [field("single_select", VIEWS), "Nội khu", true, "select last"],
  [field("single_select", VIEWS), "Núi", false, "select gone option"],
  [field("single_select", VIEWS), "bien", false, "select unfolded spelling"],
  [field("single_select", VIEWS), 1, false, "select number"],
  [field("boolean"), true, true, "boolean true"],
  [field("boolean"), false, true, "boolean false"],
  [field("boolean"), "có", false, "boolean word"],
  [field("boolean"), 1, false, "boolean one"],
  [field("boolean"), null, false, "boolean null"],
];

describe("a custom value fits its field (E3)", () => {
  it("holds on the matrix written before the code: 5 kinds × 5 values", () => {
    expect(MATRIX).toHaveLength(25);
    const wrong = MATRIX.filter(([f, v, ok]) => checkCustomValue(f, v).ok !== ok).map(
      ([, , , name]) => name,
    );
    expect(wrong).toEqual([]);
  });

  it("a retired field takes no value, not even a good one", () => {
    const retired = { ...field("text"), retiredAt: "2026-11-13T00:00:00Z" };
    expect(checkCustomValue(retired, "Biển")).toEqual({ ok: false, reason: "field-retired" });
  });

  it("break: a date check that trusts Date.parse lets 2026-02-30 through", () => {
    const loose = (v: unknown) => typeof v === "string" && !Number.isNaN(Date.parse(v));
    expect(loose("2026-02-30"), "invalid date accepted: 2026-02-30").toBe(true);
    expect(checkCustomValue(field("date"), "2026-02-30")).toEqual({
      ok: false,
      reason: "bad-date",
    });
  });
});
