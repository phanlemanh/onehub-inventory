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
}) {
  const seen: string[] = [];
  const queries: string[] = [];
  const client: DbClient = {
    query: async (text) => {
      queries.push(text);
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
  return { patch, seen, queries };
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
