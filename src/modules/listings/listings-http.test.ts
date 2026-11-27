// PATCH /api/v1/listings/[id] without a database (row 10): what reaches the door, which action each change opens it with,
// and every answer the handler gives. The database cases are in tests/db/bang-hang-that.db.test.ts.
import { describe, expect, it, vi } from "vitest";

import type { DbClient } from "@/modules/identity/server";

import { actionOf, createListingsHandlers } from "./listings-http";
import { httpSaveDoor } from "./ui/http-save-door";

// The read imports the catalog's server door; outside Next.js its "server-only" guard has nothing to guard.
vi.mock("server-only", () => ({}));

const ID = "11111111-1111-4111-8111-111111111111";
const NOW = new Date("2026-11-16T03:00:00.000Z");

function row(over: Record<string, unknown> = {}) {
  return {
    id: ID,
    company_id: "c",
    standard_status: "Incomplete",
    list_price: "3000000000",
    close_price: null,
    close_date: null,
    withdrawn_reason: null,
    fee_inclusion: "Included",
    furnished: null,
    occupant_type: null,
    legal_status: null,
    financing: null,
    custom_fields: {},
    list_agent_user_id: "keeper",
    list_agent_full_name: "[Tên] 01",
    original_entry_timestamp: new Date("2026-11-01T00:00:00.000Z"),
    last_confirmed_at: null,
    version: 1,
    upi: "u",
    ...over,
  };
}

function handlers(opts: {
  door?: string | { scope: "company" | "own"; userId?: string };
  found?: ReturnType<typeof row> | null;
  updated?: number;
  /** Row 3h: an answer of its own for a statement (the catalog unit, an open listing on it); else the cases below. */
  answer?: (text: string) => { rows: unknown[]; rowCount: number } | undefined;
}) {
  const seen: string[] = [];
  const queries: string[] = [];
  const params: unknown[][] = [];
  const client: DbClient = {
    query: async (text, values) => {
      queries.push(text);
      params.push((values as unknown[] | undefined) ?? []);
      const own = opts.answer?.(text);
      if (own) return own;
      if (/^\s*select/.test(text))
        return { rows: opts.found === null ? [] : [opts.found ?? row()], rowCount: 1 };
      return { rows: [], rowCount: opts.updated ?? 1 };
    },
    release: () => {},
  };
  const h = createListingsHandlers({
    door: async (_req, action) => {
      seen.push(action);
      const d = opts.door ?? { scope: "company" };
      if (typeof d === "string") return d as "forbidden";
      return {
        pool: { connect: async () => client },
        ctx: { userId: d.userId ?? "me", companyId: "c" },
        scope: d.scope,
      };
    },
    withCompany: async (_pool, _ctx, fn) => fn(client),
    now: () => NOW,
  });
  const patch = (body: unknown, id = ID) =>
    h.change(
      new Request(`http://x/api/v1/listings/${id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: typeof body === "string" ? body : JSON.stringify(body),
      }),
      id,
    );
  return { patch, seen, queries, params };
}

describe("listings-http", () => {
  it("opens the door with activateListing for a move to Active, updateListing otherwise", () => {
    expect(actionOf({ field: "standardStatus", standardStatus: "Active" })).toBe("activateListing");
    expect(actionOf({ field: "standardStatus", standardStatus: "Hold" })).toBe("updateListing");
    expect(actionOf({ field: "listPrice", listPrice: 1 })).toBe("updateListing");
    expect(actionOf({ field: "feeInclusion", feeInclusion: "Excluded" })).toBe("updateListing");
  });

  it("answers before the door: a bad id is 404, a body it cannot read is 400", async () => {
    const t = handlers({});
    expect(
      (await t.patch({ version: 1, change: { field: "listPrice", listPrice: 1 } }, "x")).status,
    ).toBe(404);
    expect((await t.patch("{")).status).toBe(400);
    expect((await t.patch({ version: 1, change: { field: "name", name: "x" } })).status).toBe(400);
    expect(
      (await t.patch({ version: 0, change: { field: "listPrice", listPrice: 1 } })).status,
    ).toBe(400);
    expect(t.seen).toEqual([]);
  });

  // Row 3h (E2, E11): the listing's own unit values, written as typed by the company; null takes the catalog's again.
  const OWN_COLUMNS = {
    living_area: null,
    living_area_source: null,
    floor: null,
    floor_source: null,
    bedrooms_total: null,
    bedrooms_total_source: null,
    direction_faces: null,
    direction_faces_source: null,
    property_sub_type: null,
    property_sub_type_source: null,
  };
  const written = (t: { params: unknown[][]; queries: string[] }) =>
    t.params[t.queries.findIndex((q) => /^\s*update listings/.test(q))]!.slice(14);

  // Row 3h (E10): «Gắn sang căn khác» moves the unit link to a catalog unit, never onto one with an open listing, and
  // never from a pending unit, which has no catalog link to move.
  const UNIT = {
    upi: "u2",
    unit_number: "B-02",
    building_name: "[MAU] B1",
    floor: null,
    living_area: null,
    bedrooms_total: null,
    direction_faces: null,
    property_sub_type: null,
    subdivision_name: "[MAU] P1",
    complex_name: null,
  };
  const moving = (opts: { taken?: boolean; known?: boolean; from?: string } = {}) =>
    handlers({
      found: row({ ...OWN_COLUMNS, upi: opts.from ?? "u" }),
      answer: (text) =>
        text.includes("from catalog_units")
          ? { rows: opts.known === false ? [] : [UNIT], rowCount: opts.known === false ? 0 : 1 }
          : text.includes("from listing_units where upi")
            ? { rows: opts.taken ? [{}] : [], rowCount: opts.taken ? 1 : 0 }
            : undefined,
    });
  const move = { version: 1, change: { field: "unit", upi: "u2" } };
  const moved = (t: { queries: string[]; params: unknown[][] }) =>
    t.params[t.queries.findIndex((q) => q.startsWith("update listing_units"))];

  it("moves the unit link to a catalog unit with no open listing", async () => {
    const t = moving();
    expect((await t.patch(move)).status).toBe(200);
    expect(moved(t)).toEqual([ID, "u2"]);
  });

  it("refuses a unit with an open listing (named), an unknown unit, the same unit and a pending unit", async () => {
    const taken = moving({ taken: true });
    const res = await taken.patch(move);
    expect(res.status).toBe(400);
    expect(JSON.stringify(await res.json())).toContain("B-02");
    expect(moved(taken)).toBeUndefined();
    for (const t of [
      moving({ known: false }),
      moving({ from: "u2" }),
      moving({ from: "pending:p-1" }),
    ]) {
      expect((await t.patch(move)).status).toBe(400);
      expect(moved(t)).toBeUndefined();
    }
  });

  it("writes the own unit values with the source Typed and keeps the others as they were", async () => {
    const t = handlers({
      found: row({ ...OWN_COLUMNS, bedrooms_total: 2, bedrooms_total_source: "File" }),
    });
    const res = await t.patch({
      version: 1,
      change: { field: "unitAttributes", livingArea: 72.5, floor: "15A" },
    });
    expect(res.status).toBe(200);
    expect(t.seen).toEqual(["updateListing"]);
    const body = (await res.json()) as { listing: Record<string, unknown> };
    expect(body.listing).toMatchObject({
      livingArea: 72.5,
      livingAreaSource: "Typed",
      floor: "15A",
      floorSource: "Typed",
      bedroomsTotal: 2,
      bedroomsTotalSource: "File",
    });
    expect(written(t)).toEqual([72.5, "Typed", "15A", "Typed", 2, "File", null, null, null, null]);
  });

  it("null takes the catalog's value again: the own value and its source are both cleared", async () => {
    const t = handlers({
      found: row({ ...OWN_COLUMNS, living_area: "78.5", living_area_source: "Typed" }),
    });
    const res = await t.patch({
      version: 1,
      change: { field: "unitAttributes", livingArea: null },
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as { listing: Record<string, unknown> };
    expect(body.listing).not.toHaveProperty("livingArea");
    expect(body.listing).not.toHaveProperty("livingAreaSource");
    expect(written(t).slice(0, 2)).toEqual([null, null]);
  });

  it("only «Hoàn tác» names a source, and only File; any other source is no request at all", async () => {
    const t = handlers({ found: row(OWN_COLUMNS) });
    const undo = await t.patch({
      version: 1,
      change: { field: "unitAttributes", bedroomsTotal: 2, sources: { bedroomsTotal: "File" } },
    });
    expect(undo.status).toBe(200);
    expect(written(t).slice(4, 6)).toEqual([2, "File"]);
    for (const sources of [
      { bedroomsTotal: "Typed" },
      { bedroomsTotal: "Catalog" },
      { unitKind: "File" },
    ]) {
      const u = handlers({ found: row(OWN_COLUMNS) });
      const res = await u.patch({
        version: 1,
        change: { field: "unitAttributes", bedroomsTotal: 2, sources },
      });
      expect(res.status).toBe(400);
      expect(u.seen).toEqual([]);
    }
  });

  it("a value out of the rule, or a sold or withdrawn listing, is refused and nothing is written", async () => {
    for (const change of [
      { livingArea: 0 },
      { bedroomsTotal: 2.5 },
      { floor: "07" },
      { directionFaces: "Đông-Nam" },
      { propertySubType: "Studio" },
      {},
    ]) {
      const t = handlers({ found: row(OWN_COLUMNS) });
      const res = await t.patch({ version: 1, change: { field: "unitAttributes", ...change } });
      expect(res.status, JSON.stringify(change)).toBe(400);
      expect(t.queries.some((q) => /^\s*update/.test(q))).toBe(false);
    }
    for (const status of [
      { standard_status: "Closed", close_price: "3000000000", close_date: "2026-11-01" },
      { standard_status: "Withdrawn", withdrawn_reason: "unreachable" },
    ]) {
      const t = handlers({ found: row({ ...OWN_COLUMNS, ...status }) });
      const res = await t.patch({
        version: 1,
        change: { field: "unitAttributes", livingArea: 70 },
      });
      expect(res.status).toBe(400);
      expect(((await res.json()) as { why: unknown }).why).toEqual({ rule: "locked" });
    }
  });

  it("a door that does not open answers with its code and touches nothing", async () => {
    for (const [door, status] of [
      ["unauthenticated", 401],
      ["forbidden", 403],
      ["server-error", 500],
    ] as const) {
      const t = handlers({ door });
      const res = await t.patch({
        version: 1,
        change: { field: "listPrice", listPrice: 2_800_000_000 },
      });
      expect(res.status).toBe(status);
      expect(t.queries).toEqual([]);
    }
  });

  it("saves with the version it was given, the server's time, and the listing as it is now", async () => {
    const t = handlers({});
    const res = await t.patch({
      version: 1,
      change: { field: "listPrice", listPrice: 2_800_000_000 },
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      listing: { version: number; listPrice: number; lastConfirmedAt: string };
    };
    expect(body.listing).toMatchObject({
      version: 2,
      listPrice: 2_800_000_000,
      lastConfirmedAt: NOW.toISOString(),
    });
    expect(t.queries.some((q) => /where id = \$1 and version = \$2/.test(q))).toBe(true);
  });

  it("an older version is a conflict with the current listing; a gone one is 404; a rule broken is 400", async () => {
    const stale = await handlers({ found: row({ version: 3 }) }).patch({
      version: 1,
      change: { field: "listPrice", listPrice: 2_800_000_000 },
    });
    expect(stale.status).toBe(409);
    expect(((await stale.json()) as { current: { version: number } }).current.version).toBe(3);
    const gone = await handlers({ found: null }).patch({
      version: 1,
      change: { field: "listPrice", listPrice: 2 },
    });
    expect(gone.status).toBe(404);
    const rule = await handlers({}).patch({
      version: 1,
      change: { field: "standardStatus", standardStatus: "Closed" },
    });
    expect(rule.status).toBe(400);
  });

  it("own scope moves to Active only the unit one keeps or one nobody keeps", async () => {
    const active = { version: 1, change: { field: "standardStatus", standardStatus: "Active" } };
    expect((await handlers({ door: { scope: "own" } }).patch(active)).status).toBe(403);
    expect(
      (await handlers({ door: { scope: "own", userId: "keeper" } }).patch(active)).status,
    ).toBe(200);
    expect(
      (
        await handlers({
          door: { scope: "own" },
          found: row({ list_agent_user_id: null, list_agent_full_name: null }),
        }).patch(active)
      ).status,
    ).toBe(200);
    expect((await handlers({ door: { scope: "company" } }).patch(active)).status).toBe(200);
  });

  it("a row the database does not let this role change is refused", async () => {
    const res = await handlers({ updated: 0 }).patch({
      version: 1,
      change: { field: "feeInclusion", feeInclusion: "Excluded" },
    });
    expect(res.status).toBe(403);
  });
});

describe("httpSaveDoor", () => {
  const request = {
    id: ID,
    version: 1,
    change: { field: "listPrice", listPrice: 2 } as const,
    at: "",
  };
  const door = (status: number, body: unknown, online = true) =>
    httpSaveDoor({
      online: () => online,
      fetch: vi.fn(
        async () => new Response(JSON.stringify(body), { status }),
      ) as unknown as typeof fetch,
    });

  it("reads each answer as one outcome of the save door", async () => {
    expect((await door(200, { listing: { id: ID, version: 2 } }).save(request)).kind).toBe("saved");
    expect(
      await door(409, { error: "conflict", current: { id: ID, version: 3 } }).save(request),
    ).toEqual({
      kind: "conflict",
      current: { id: ID, version: 3 },
    });
    expect(await door(404, { error: "not-found" }).save(request)).toEqual({ kind: "conflict" });
    expect((await door(403, { error: "forbidden" }).save(request)).kind).toBe("refused");
    expect((await door(400, { error: "invalid" }).save(request)).kind).toBe("invalid");
    expect((await door(200, {}, false).save(request)).kind).toBe("offline");
  });

  it("a network that fails is offline, and nothing is sent while offline", async () => {
    const fetch = vi.fn(async () => {
      throw new TypeError("network");
    });
    const d = httpSaveDoor({
      online: () => true,
      fetch: fetch as unknown as typeof globalThis.fetch,
    });
    expect((await d.save(request)).kind).toBe("offline");
    const off = vi.fn();
    await httpSaveDoor({
      online: () => false,
      fetch: off as unknown as typeof globalThis.fetch,
    }).save(request);
    expect(off).not.toHaveBeenCalled();
  });
});
