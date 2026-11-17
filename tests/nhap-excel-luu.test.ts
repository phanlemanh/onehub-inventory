// Row 11 (nhap-excel): the store's undo, recent imports and listing ids on a recording client (no database). The full
// path on a real Postgres is tests/db/nhap-excel.db.test.ts.
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { listingIdOf, recentImports, undoImport } from "@/modules/imports/store";

const recorder = (rows: unknown[][]) => {
  const texts: string[] = [];
  let i = 0;
  return {
    texts,
    query: async (text: string) => {
      if (/^(savepoint|release savepoint|rollback to savepoint)/.test(text))
        return { rows: [], rowCount: 0 };
      texts.push(text.replace(/\s+/g, " ").trim().slice(0, 40));
      const r = rows[i++] ?? [];
      return { rows: r, rowCount: r.length };
    },
  };
};
const LEARNED = {
  templateId: "t1",
  labelIds: [],
  fieldCodes: [],
  aliasIds: ["a1"],
  pendingUnits: [{ rawCode: "X", id: "p1" }],
  unitCodeIds: ["7"],
};

describe("luu-lan-nhap", () => {
  it("a listing id is fixed by the import and the row, and shaped as a uuid", () => {
    expect(listingIdOf("run-1", 3)).toBe(listingIdOf("run-1", 3));
    expect(listingIdOf("run-1", 3)).not.toBe(listingIdOf("run-1", 4));
    expect(listingIdOf("run-1", 0)).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-8[0-9a-f]{3}-[0-9a-f]{12}$/,
    );
  });

  it("undo: listings, learned items, the company code, the pending unit, then the run marked undone", async () => {
    const c = recorder([
      [
        {
          id: "run-1",
          status: "done",
          learned: LEARNED,
          batches_done: [0],
          kept: [],
          created_count: 2,
          list_agent_user_id: "u1",
          file_name: "a",
        },
      ],
      [
        { id: "l1", version: 1 },
        { id: "l2", version: 2 },
      ],
      [{ id: "l1" }],
      [],
      [],
      [],
      [{ id: "p1" }],
      [],
    ]);
    const r = await undoImport(c, "run-1", "me");
    expect(r).toEqual({ ok: true, removed: ["l1"], kept: ["l2"], retired: 4 });
    expect(c.texts.at(-1)).toContain("update import_runs set status = 'undone'");
  });

  it("undo twice is refused; an unknown import is not found", async () => {
    expect(
      await undoImport(recorder([[{ status: "undone", learned: LEARNED }]]), "run-1", "me"),
    ).toEqual({ ok: false, problem: "already-undone" });
    expect(await undoImport(recorder([[]]), "nope", "me")).toEqual({
      ok: false,
      problem: "not-found",
    });
  });

  it("recent imports are read back with their counts", async () => {
    const c = recorder([
      [
        {
          id: "r1",
          file_name: "a.xlsx",
          status: "done",
          created_count: 3,
          kept_count: 1,
          created_at: "2026-11-17",
        },
      ],
    ]);
    expect(await recentImports(c)).toEqual([
      {
        id: "r1",
        fileName: "a.xlsx",
        status: "done",
        createdCount: 3,
        keptCount: 1,
        createdAt: "2026-11-17",
      },
    ]);
  });
});
