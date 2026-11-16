// The fee schedule over HTTP without a database (row 19): the store is replaced, so these cases pin what the
// handlers own — the action each opens, the body shape, the 400 that names the items, and the error codes. The same
// doors with real rows and real permissions: tests/db/thue-phi.db.test.ts and tests/db/bang-quyen-api.db.test.ts.
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { ActionName } from "@/modules/identity";
import type { DoorError, OpenedDoor } from "@/modules/identity/server";

const store = vi.hoisted(() => ({ readFeeSchedule: vi.fn(), saveFeeSchedule: vi.fn() }));
vi.mock("./fee-store", () => store);

import { createFeeScheduleHandlers } from "./fee-schedule-http";

const OPEN: OpenedDoor = {
  pool: {} as OpenedDoor["pool"],
  ctx: { userId: "u1", companyId: "c1" },
  scope: "company",
};

function make(door: OpenedDoor | DoorError = OPEN) {
  const opened: ActionName[] = [];
  const h = createFeeScheduleHandlers({
    door: async (_req, action) => {
      opened.push(action);
      return door;
    },
    withCompany: async (_pool, _ctx, fn) => fn({} as never),
  });
  return { h, opened };
}
const req = (method: string, body?: unknown) =>
  new Request("http://x/api/v1/company/fee-schedule", {
    method,
    ...(body === undefined ? {} : { body: typeof body === "string" ? body : JSON.stringify(body) }),
  });
const ITEMS = [{ code: "pit", rateBasisPoints: 200, included: true }];

beforeEach(() => {
  store.readFeeSchedule.mockReset();
  store.saveFeeSchedule.mockReset();
});

describe("fee schedule handlers", () => {
  it("GET opens readFeeSchedule and answers the schedule", async () => {
    store.readFeeSchedule.mockResolvedValue({ items: [] });
    const { h, opened } = make();
    const res = await h.read(req("GET"));
    expect(opened).toEqual(["readFeeSchedule"]);
    expect(await res.json()).toEqual({ items: [] });
  });

  it("PUT opens setFeeSchedule, passes the person and the items, answers the saved schedule", async () => {
    store.saveFeeSchedule.mockResolvedValue({ ok: true, schedule: { items: [] } });
    const { h, opened } = make();
    const res = await h.save(req("PUT", { items: ITEMS }));
    expect(opened).toEqual(["setFeeSchedule"]);
    expect(res.status).toBe(200);
    expect(store.saveFeeSchedule.mock.calls[0]!.slice(1)).toEqual(["u1", ITEMS]);
  });

  it("a wrong schedule answers 400 naming each item by its code", async () => {
    store.saveFeeSchedule.mockResolvedValue({
      ok: false,
      problems: [{ problem: "law-item-fixed", index: 0 }, { problem: "nothing-included" }],
    });
    const res = await make().h.save(req("PUT", { items: ITEMS }));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({
      error: "invalid-schedule",
      problems: [
        { problem: "law-item-fixed", index: 0, code: "pit" },
        { problem: "nothing-included" },
      ],
    });
  });

  it("a body of the wrong shape is 400 before the store is asked", async () => {
    const { h } = make();
    for (const body of [
      "{",
      { items: "x" },
      { items: [{ rateBasisPoints: 1.5, included: true }] },
      { items: [], extra: 1 },
    ]) {
      expect((await h.save(req("PUT", body))).status).toBe(400);
    }
    expect(store.saveFeeSchedule).not.toHaveBeenCalled();
  });

  it("a door that does not open answers its code; a failing store answers 500", async () => {
    expect((await make("forbidden").h.save(req("PUT", { items: ITEMS }))).status).toBe(403);
    expect((await make("unauthenticated").h.read(req("GET"))).status).toBe(401);
    store.readFeeSchedule.mockRejectedValue(new Error("hỏng"));
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect((await make().h.read(req("GET"))).status).toBe(500);
  });
});
