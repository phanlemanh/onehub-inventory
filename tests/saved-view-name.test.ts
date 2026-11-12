// The one name rule of saved views (row 2c, _acceptance/luu-goc-nhin-cot-hai/evals.yaml E10): the naming dialog and the
// API call the same function. Seven cases written before the code; the database keeps the same limits (migration 009).
import { describe, expect, it } from "vitest";

import {
  checkViewName,
  normalizeViewName,
  SavedViewState,
  type SavedViewNameError,
} from "@/modules/listings";

const MINE = ["Toà S1", "Hai PN"];
const OTHERS = ["Căn rẻ"]; // another person's view: never passed as taken

// Written before the code: name → the error it gives against the person's own names, or null.
const CASES: [string, string, SavedViewNameError | null][] = [
  ["trống", "", "name-empty"],
  ["chỉ dấu cách", "   ", "name-empty"],
  ["41 ký tự", "a".repeat(41), "name-too-long"],
  ["trùng không phân biệt hoa thường", "toà s1", "name-taken"],
  ["trùng tên của người khác", OTHERS[0]!, null],
  ["40 ký tự", "b".repeat(40), null],
  ["có dấu tiếng Việt", "Đầu chủ — Phố Huế ưu tiên", null],
];

describe("saved view name", () => {
  it("answers the seven written cases", () => {
    const got = CASES.map(([what, name]) => [what, checkViewName(name, MINE)]);
    expect(got).toEqual(CASES.map(([what, , want]) => [what, want]));
    expect(got).toHaveLength(7);
  });

  it("counts letters, not bytes or code units, and compares the stored form", () => {
    expect(checkViewName("Đ".repeat(40), [])).toBeNull();
    // The same name typed decomposed (NFD) is the same name.
    expect(checkViewName("Toa\u0300 S1", MINE)).toBe("name-taken");
    expect(normalizeViewName("  Hai PN  ")).toBe("Hai PN");
  });
});

describe("saved view shape", () => {
  const view = {
    query: "S1",
    filters: { "Listing.buildingName": ["S1.01"], "Listing.standardStatus": ["Active"] },
    sort: [{ field: "Listing.listPrice", direction: "desc" }],
    grouped: true,
    hidden: ["Listing.subdivisionName", "Listing.lastConfirmedAt"],
  };

  it("holds the five things and nothing else", () => {
    expect(SavedViewState.parse(view)).toEqual(view);
    expect(Object.keys(SavedViewState.shape).sort()).toEqual([
      "filters",
      "grouped",
      "hidden",
      "query",
      "sort",
    ]);
  });

  it("refuses a view that lost a part or carries one more", () => {
    const noSort = Object.fromEntries(Object.entries(view).filter(([k]) => k !== "sort"));
    expect(SavedViewState.safeParse(noSort).success).toBe(false);
    expect(SavedViewState.safeParse({ ...view, fullScreen: true }).success).toBe(false);
  });
});
