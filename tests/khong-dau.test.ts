// Row 2e (bo-o-tim-cua-vung), E19 — AC-11: the column filters of the shared grid and the top bar's ⌘K box compare text
// without Vietnamese marks («đ» read as «d») through ONE folding function kept in one place, which both call.
//   fold — five pairs written ahead.
//   column filter — «dong» in the Toà filter keeps exactly the rows of building «Đông».
//   ⌘K — «dong» suggests «Đông», and the address it opens does not land on an empty grid.
//   Structure — the ⌘K code imports the grid's folding function and keeps no copy of its own.
//   Break: a literal compare in place of the folding function → «accents not folded».
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { typedColumn } from "../src/components/candidate/column-kind";
import type { GridRow } from "../src/components/candidate/data-region";
import { filterRows, foldText } from "../src/components/candidate/grid-view";
import {
  SEARCH_PARAM,
  inventoryOpeningFor,
  searchHref,
  searchSuggestions,
} from "../src/modules/listings/ui";

const columns = [
  typedColumn({ field: "Listing.unitNumber", header: "Căn" }),
  typedColumn({ field: "Listing.buildingName", header: "Toà" }),
  typedColumn({ field: "Listing.subdivisionName", header: "Dự án" }),
];
const rows: GridRow[] = [
  ["a", "0201", "Đông", "Sapphire"],
  ["b", "0202", "Tây", "Sapphire"],
  ["c", "0203", "Đông", "Ruby"],
  ["d", "0204", "Động", "Ruby"],
  ["e", "0205", "Nam", "Ruby"],
].map(([id, code, building, subdivision]) => ({
  id: id as string,
  "Listing.unitNumber": code,
  "Listing.buildingName": building,
  "Listing.subdivisionName": subdivision,
}));

/** Five pairs written ahead: what is typed, the text it is compared with, whether it must match. */
const FOLD_PAIRS: [string, string, boolean][] = [
  ["dong", "Đông", true],
  ["Đông", "Đông", true],
  ["Động", "Động", true],
  ["đ", "d", true],
  ["DONG", "đông", true],
];

type Match = (typed: string, text: string) => boolean;
const folded: Match = (typed, text) => foldText(text).includes(foldText(typed));
const literal: Match = (typed, text) => text.includes(typed);

function checkFold(match: Match): void {
  for (const [typed, text, want] of FOLD_PAIRS)
    if (match(typed, text) !== want) throw new Error(`accents not folded: «${typed}» / «${text}»`);
}

describe("one folding function (AC-11)", () => {
  it("has five pairs written ahead", () => {
    expect(FOLD_PAIRS).toHaveLength(5);
  });

  it("matches every pair", () => {
    expect(() => checkFold(folded)).not.toThrow();
    expect(foldText("Toà Đông")).toBe("toa dong");
  });

  it("the check fails on a literal compare", () => {
    expect(() => checkFold(literal)).toThrow("accents not folded: «dong» / «Đông»");
  });

  it("the column filter keeps the rows of «Đông» when «dong» is typed", () => {
    const kept = filterRows(rows, columns, { "Listing.buildingName": "dong" }).map((r) => r.id);
    expect(kept).toEqual(["a", "c", "d"]);
    const typedRight = filterRows(rows, columns, { "Listing.buildingName": "Đông" }).map(
      (r) => r.id,
    );
    expect(typedRight).toEqual(["a", "c", "d"]);
    const otherWord = filterRows(rows, columns, { "Listing.buildingName": "Động" }).map(
      (r) => r.id,
    );
    expect(otherWord).toEqual(["a", "c", "d"]);
  });

  it("⌘K suggests «Đông» for «dong», and its address opens rows", () => {
    const suggestions = searchSuggestions(rows, "dong");
    expect(suggestions.map((s) => `${s.kind}:${s.value}`)).toContain("building:Đông");
    const href = searchHref("building", "dong");
    const asked = new URLSearchParams(href.split("?")[1]).get(SEARCH_PARAM.building) ?? "";
    const opening = inventoryOpeningFor(rows, { building: asked });
    const kept = filterRows(rows, columns, opening.filters).map((r) => r.id);
    expect(kept.length).toBeGreaterThan(0);
    expect(kept).toEqual(["a", "c", "d"]);
  });

  it("⌘K and the column filter call the grid's one function; no second copy", () => {
    const read = (path: string) => readFileSync(resolve(__dirname, "..", path), "utf8");
    const grid = read("src/components/candidate/grid-view.ts");
    const ask = read("src/modules/listings/ui/inventory-rows.ts");
    const box = read("src/modules/listings/ui/unit-jump.tsx");
    expect(grid.match(/\.normalize\("NFD"\)/g)).toHaveLength(1);
    expect(grid).toMatch(/export function foldText\(/);
    expect(ask).toMatch(
      /import \{[^}]*\bfoldText\b[^}]*\} from "@\/components\/candidate\/grid-view"/,
    );
    for (const [name, source] of [
      ["inventory-rows.ts", ask],
      ["unit-jump.tsx", box],
    ] as const) {
      expect(source, name).not.toMatch(/normalize\(/);
      // A lower-casing of typed or shown text would be a second compare; the shortcut key («k») is not one.
      expect(source.replace(/e\.key\.toLowerCase\(\)/g, ""), name).not.toMatch(
        /toLocaleLowerCase|toLowerCase/,
      );
    }
  });
});
