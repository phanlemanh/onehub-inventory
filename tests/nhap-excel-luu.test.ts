// Row 11 (nhap-excel): the store's undo, recent imports and listing ids on a recording client (no database). The full
// path on a real Postgres is tests/db/nhap-excel.db.test.ts.
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import {
  BATCH_ROWS,
  batchHash,
  listAgents,
  listingIdOf,
  recentImports,
  tableHash,
  undoImport,
  writeBatch,
} from "@/modules/imports/store";

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

describe("gan-goi-voi-lan-mo (S4-r1 t2)", () => {
  const CH = { columns: {}, values: {}, units: {} };
  const rows = [["A-1"], ["A-2"]];
  const run = (over: Record<string, unknown> = {}) => ({
    id: "run-1",
    status: "open",
    list_agent_user_id: "me",
    file_name: "a.xlsx",
    batches_done: [],
    learned: {},
    kept: [],
    created_count: 0,
    table_hash: tableHash(["Mã căn"], CH),
    batch_hashes: [batchHash(rows)],
    ...over,
  });
  const batch = { headers: ["Mã căn"], rows, choices: CH, batchNo: 0, rowOffset: 0, last: true };
  it("the fingerprints change with the headers, the choices and the rows", () => {
    expect(tableHash(["Mã căn"], CH)).toMatch(/^[0-9a-f]{64}$/);
    expect(tableHash(["Mã"], CH)).not.toBe(tableHash(["Mã căn"], CH));
    expect(tableHash(["Mã căn"], { ...CH, skipRows: [0] })).not.toBe(tableHash(["Mã căn"], CH));
    expect(batchHash([["A-1"]])).not.toBe(batchHash(rows));
    expect(BATCH_ROWS).toBe(200);
  });
  it("a batch off the opened table is refused before anything is read or written", async () => {
    for (const over of [
      { headers: ["Mã"] },
      { rows: [["A-1"]] },
      { choices: { ...CH, skipRows: [1] } },
      { batchNo: 1, rowOffset: 200 },
      { rowOffset: 1 },
      { last: false },
    ]) {
      const c = recorder([[run()]]);
      expect(
        await writeBatch(c as never, "run-1", { ...batch, ...over } as never),
        JSON.stringify(over),
      ).toEqual({
        ok: false,
        problem: "table-changed",
      });
      expect(c.texts).toHaveLength(1);
    }
    // An import opened before the fingerprints existed is refused the same way.
    const old = recorder([[run({ table_hash: null, batch_hashes: null })]]);
    expect((await writeBatch(old as never, "run-1", batch as never)).ok).toBe(false);
  });
  it("list agents are read through the privileged function, ids and names only", async () => {
    const sent: string[] = [];
    const c = {
      query: async (text: string) => (
        sent.push(text),
        { rows: [{ userId: "u1", name: "[Tên]" }], rowCount: 1 }
      ),
    };
    expect(await listAgents(c as never)).toEqual([{ userId: "u1", name: "[Tên]" }]);
    expect(sent[0]).toContain("from app.import_list_agents()");
  });
});

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
      [{ code: "S1 01-0905" }],
      [],
      [],
      [],
      [{ id: "p1" }],
      [],
    ]);
    const r = await undoImport(c, "run-1", "me");
    expect(r).toEqual({
      ok: true,
      removed: ["l1"],
      kept: ["l2"],
      keptCodes: ["S1 01-0905"],
      retired: 4,
    });
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
