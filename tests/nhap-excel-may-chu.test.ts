// Row 11 (nhap-excel): the server pieces that need no database — the HTTP doors with the store replaced, the create
// door of listings, what one import teaches and the company code it writes, each on a recording client. The same
// behaviour on a real Postgres is tests/db/nhap-excel.db.test.ts.
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/modules/imports/store", () => ({
  BATCH_ROWS: 200,
  previewImport: vi.fn(async () => ({ counts: { keep: 1, fixed: 0, ask: 0, block: 0 } })),
  openImport: vi.fn(async (_c: unknown, _i: unknown, p: { listAgentUserId: string }) =>
    p.listAgentUserId === "bad" ? { ok: false, problem: "bad-agent" } : { ok: true, id: "run-1" },
  ),
  writeBatch: vi.fn(async (_c: unknown, id: string) =>
    id === "closed" ? { ok: false, problem: "closed" } : { ok: true, created: 2, done: false },
  ),
  undoImport: vi.fn(async (_c: unknown, id: string) =>
    id === "twice"
      ? { ok: false, problem: "already-undone" }
      : { ok: true, removed: ["a"], kept: [], retired: 1 },
  ),
  recentImports: vi.fn(async () => []),
}));

import { createImportsHandlers } from "@/modules/imports/imports-http";
import { createListings, removeImportListings } from "@/modules/listings/create";
import { addCompanyUnitCode, retireCompanyUnitCode } from "@/modules/catalog/company-alias";

type Scope = "own" | "company";
const door = (scope: Scope | "forbidden" | "unauthenticated") => async () =>
  typeof scope === "string" && (scope === "forbidden" || scope === "unauthenticated")
    ? scope
    : { pool: {} as never, ctx: { userId: "me", companyId: "A" }, scope };
const handlers = (scope: Scope | "forbidden" | "unauthenticated" = "own") =>
  createImportsHandlers({
    door: door(scope) as never,
    withCompany: async (_p, _c, fn) => fn({} as never),
  });
const post = (b: unknown) =>
  new Request("http://x/api/v1/imports", { method: "POST", body: JSON.stringify(b) });
const TABLE = { headers: ["Mã căn"], rows: [["A-1"]], choices: {} };
const OPEN = {
  ...TABLE,
  fileName: "a.xlsx",
  sheetName: null,
  expected: { keep: 1, fixed: 0, ask: 0, block: 0, createCount: 1 },
};

describe("cua-http", () => {
  it("preview answers the marks; a body that is not the shape is 400; a closed door answers its own code", async () => {
    expect((await handlers().preview(post(TABLE))).status).toBe(200);
    expect((await handlers().preview(post({ headers: [] }))).status).toBe(400);
    expect((await handlers("forbidden").preview(post(TABLE))).status).toBe(403);
    expect((await handlers("unauthenticated").preview(post(TABLE))).status).toBe(401);
  });
  it("open: 201 for oneself; a list agent's own scope cannot name someone else (403); an unknown agent is 400", async () => {
    expect((await handlers().open(post(OPEN))).status).toBe(201);
    expect(
      (
        await handlers("own").open(
          post({ ...OPEN, listAgentUserId: "00000000-0000-4000-8000-000000000001" }),
        )
      ).status,
    ).toBe(403);
    expect(
      (
        await handlers("company").open(
          post({ ...OPEN, listAgentUserId: "00000000-0000-4000-8000-000000000001" }),
        )
      ).status,
    ).toBe(201);
    expect((await handlers().open(post({ ...OPEN, fileName: "" }))).status).toBe(400);
  });
  it("batch, undo and recent answer the store's outcome with fixed codes", async () => {
    const b = {
      headers: ["Mã căn"],
      rows: [["A-1"]],
      choices: {},
      batchNo: 0,
      rowOffset: 0,
      last: true,
    };
    expect((await handlers().batch(post(b), "run-1")).status).toBe(200);
    expect((await handlers().batch(post(b), "closed")).status).toBe(409);
    expect(
      (await handlers().batch(post({ ...b, rows: Array(201).fill(["x"]) }), "run-1")).status,
    ).toBe(400);
    expect((await handlers().undo(post({}), "run-1")).status).toBe(200);
    expect((await handlers().undo(post({}), "twice")).status).toBe(409);
    expect((await handlers().recent(new Request("http://x"))).status).toBe(200);
  });
  it("an error inside answers 500 without the error's text", async () => {
    const h = createImportsHandlers({
      door: door("own") as never,
      withCompany: async () => {
        throw new Error("[Tên] 0900 000 001");
      },
    });
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const r = await h.preview(post(TABLE));
    expect(r.status).toBe(500);
    expect(JSON.stringify(spy.mock.calls)).not.toContain("0900");
    spy.mockRestore();
  });
});

const recorder = (rows: unknown[][] = []) => {
  const calls: { text: string; params?: unknown[] }[] = [];
  let i = 0;
  return {
    calls,
    query: async (text: string, params?: unknown[]) => {
      calls.push({ text, ...(params ? { params } : {}) });
      return { rows: rows[i++] ?? [], rowCount: (rows[i - 1] ?? []).length };
    },
  };
};

describe("cua-tao-can", () => {
  const base = {
    listAgentUserId: "u1",
    listAgentFullName: "[Tên]",
    standardStatus: "Incomplete" as const,
    listPrice: null,
    feeInclusion: null,
    furnished: null,
    occupantType: null,
    withdrawnReason: null,
    legalStatus: null,
    financing: null,
    customFields: {},
    lastConfirmedAt: null,
  };
  it("a catalog unit goes to listing_units, a pending unit to listing_pending_units, each with the import's id", async () => {
    const c = recorder();
    const r = await createListings(c, "A", "run-1", [
      { ...base, id: "l1", unit: { upi: "upi-1" } },
      {
        ...base,
        id: "l2",
        unit: { pendingUnitId: "p1" },
        standardStatus: "Withdrawn",
        withdrawnReason: "unreachable",
      },
    ]);
    expect(r.created).toEqual(["l1", "l2"]);
    expect(c.calls.map((x) => x.text.split("(")[0]!.trim())).toEqual([
      "insert into listings",
      "insert into listing_units",
      "insert into listings",
      "insert into listing_pending_units",
    ]);
    expect(c.calls[0]!.params![13]).toBe("run-1");
    expect(c.calls[3]!.params![3]).toBe(false);
  });
  it("undo removes version-1 listings and names the ones kept", async () => {
    const c = recorder([
      [
        { id: "l1", version: 1 },
        { id: "l2", version: 2 },
      ],
      [{ id: "l1" }],
      [{ code: "S1 01-0905" }],
    ]);
    expect(await removeImportListings(c, "run-1")).toEqual({
      removed: ["l1"],
      kept: ["l2"],
      keptCodes: ["S1 01-0905"],
    });
    // The codes are read for the kept listings only.
    expect(c.calls[2]!.params![0]).toEqual(["l2"]);
  });
});

describe("ma-rieng-cua-can", () => {
  it("a new code returns its id, a code in use returns null; retiring sends the id", async () => {
    expect(await addCompanyUnitCode(recorder([[{ id: "7" }]]), " S1.05-1208 ", "unt_1")).toBe("7");
    expect(await addCompanyUnitCode(recorder([[]]), "S1.05-1208", "unt_1")).toBeNull();
    const c = recorder();
    await retireCompanyUnitCode(c, "7");
    expect(c.calls[0]!.params).toEqual(["7"]);
  });
});
