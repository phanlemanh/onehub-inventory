// Code lookup order without a database (row 7e, rule code-lookup-order of row 7d): a fake connection answers each
// of the three queries, so these cases pin the order and the stop at the first source that knows the code. The
// database case with real rows is in tests/db/lop-rieng.db.test.ts.
import { describe, expect, it } from "vitest";

import { resolveUnitCode, type Queryable } from "./resolve";

/** A connection whose answer depends on which table the query reads. */
function fake(answers: { own?: string[]; original?: string[]; reader?: string[] }) {
  const asked: string[] = [];
  const c: Queryable = {
    async query(text) {
      const table = text.includes("company_catalog_aliases")
        ? "own"
        : text.includes("catalog_aliases")
          ? "original"
          : "reader";
      asked.push(table);
      return { rows: (answers[table] ?? []).map((unit_key) => ({ unit_key })) };
    },
  };
  return { c, asked };
}

describe("thu-tu-tra-ma", () => {
  it("the company's own code wins and nothing else is asked", async () => {
    const { c, asked } = fake({ own: ["unt_1"], original: ["unt_2"], reader: ["unt_3"] });
    expect(await resolveUnitCode(c, " q12a-17-05a ")).toEqual({
      source: "company",
      unitKeys: ["unt_1"],
    });
    expect(asked).toEqual(["own"]);
  });

  it("then the catalog's original codes, then the shared reader", async () => {
    const second = fake({ original: ["unt_2", "unt_4"], reader: ["unt_3"] });
    expect(await resolveUnitCode(second.c, "Q12A-17-05A")).toEqual({
      source: "catalog",
      unitKeys: ["unt_2", "unt_4"],
    });
    expect(second.asked).toEqual(["own", "original"]);
    const third = fake({ reader: ["unt_3"] });
    expect(await resolveUnitCode(third.c, "Q12A-17-05A")).toEqual({
      source: "reader",
      unitKeys: ["unt_3"],
    });
    expect(third.asked).toEqual(["own", "original", "reader"]);
  });

  it("a code no source knows, or one the reader cannot read, finds nothing", async () => {
    const none = fake({});
    expect(await resolveUnitCode(none.c, "Q12A-17-05A")).toEqual({ source: null, unitKeys: [] });
    const unreadable = fake({});
    expect(await resolveUnitCode(unreadable.c, "khong-phai-ma")).toEqual({
      source: null,
      unitKeys: [],
    });
    expect(unreadable.asked).toEqual(["own", "original"]);
    const empty = fake({ own: ["unt_1"] });
    expect(await resolveUnitCode(empty.c, "   ")).toEqual({ source: null, unitKeys: [] });
    expect(empty.asked).toEqual([]);
  });
});
