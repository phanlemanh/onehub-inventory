// Row 11 (nhap-excel), ruling G-2811-65 after two findings of VP11's S4-r1: nothing the preview reads may be lost on
// write. Two sweeps of the whole set, each with a pinned break:
//   1. every standard target of targets.ts has exactly one place (a listing column, kept as written with a reason, or
//      the unit itself), and the set is not empty;
//   2. every call of markValue in the imports module passes the person's choice, as the preview does.
// What was written is compared with what the preview promised, cell kind by cell kind, in
// tests/db/nhap-excel.db.test.ts («gia tri khong mat (VP11 r1)»).
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { STANDARD_TARGETS } from "@/modules/imports";
import { DESTINATION, type Destination } from "@/modules/imports/store";

/** The standard targets with no place to go, in the order of targets.ts. */
function homeless(
  targets: readonly string[],
  places: Record<string, Destination | undefined>,
): string[] {
  return targets.filter((t) => {
    const p = places[t];
    return !p || !("listing" in p || "kept" in p || "unit" in p);
  });
}

/** Calls of markValue (not its definition) whose arguments do not pass the person's choice. */
function callsWithoutChoice(files: Record<string, string>): string[] {
  const out: string[] = [];
  for (const [name, text] of Object.entries(files)) {
    for (const m of text.matchAll(/(?<!function )markValue\(/g)) {
      let depth = 0;
      let end = m.index! + "markValue".length;
      for (; end < text.length; end += 1) {
        if (text[end] === "(") depth += 1;
        else if (text[end] === ")" && --depth === 0) break;
      }
      const args = text.slice(m.index!, end + 1);
      if (!/\bchoice:/.test(args))
        out.push(`${name}:${text.slice(0, m.index!).split("\n").length}`);
    }
  }
  return out;
}

const DIR = join(import.meta.dirname, "..", "src", "modules", "imports");
const SOURCES = Object.fromEntries(
  readdirSync(DIR)
    .filter((f) => f.endsWith(".ts") && !f.endsWith(".test.ts"))
    .map((f) => [f, readFileSync(join(DIR, f), "utf8")]),
);

describe("noi ghi (G-2811-65)", () => {
  it("every standard target has one place to go; the set is the 18 targets of targets.ts", () => {
    expect(STANDARD_TARGETS).toHaveLength(18);
    expect(Object.keys(DESTINATION).sort()).toEqual([...STANDARD_TARGETS].sort());
    expect(homeless(STANDARD_TARGETS, DESTINATION)).toEqual([]);
    // Each kind of place is used: none of the three is an empty promise.
    const kinds = Object.values(DESTINATION).map((p) => Object.keys(p)[0]);
    expect([...new Set(kinds)].sort()).toEqual(["kept", "listing", "unit"]);
  });

  it("break: a target added without a place is named", () => {
    const rest: Record<string, Destination | undefined> = { ...DESTINATION };
    delete rest["Listing.closePrice"];
    expect(homeless([...STANDARD_TARGETS, "Listing.newThing"], rest)).toEqual([
      "Listing.closePrice",
      "Listing.newThing",
    ]);
  });

  it("every markValue call in the imports module passes the person's choice", () => {
    const calls = Object.values(SOURCES).flatMap((t) => [
      ...t.matchAll(/(?<!function )markValue\(/g),
    ]);
    expect(calls.length).toBe(2);
    expect(callsWithoutChoice(SOURCES)).toEqual([]);
  });

  it("break: the write of new field values without the choice is named", () => {
    const broken = SOURCES["store.ts"]!.replace(
      /\n\s*choice: input\.choices\.values\[[^\]]+\],/,
      "",
    );
    expect(broken).not.toBe(SOURCES["store.ts"]);
    expect(callsWithoutChoice({ "store.ts": broken })).toHaveLength(1);
    expect(callsWithoutChoice({ "store.ts": broken })[0]).toMatch(/^store\.ts:\d+$/);
  });
});
