// Row 4 (sua-tren-o) eval E7, door layer: the save door's four outcomes on the sample listings, the failure shapes of
// the real write path, and undo as a save like any other. Case names are the pinned messages.
import { describe, expect, it } from "vitest";

import type { Listing } from "../../generated/ontology";
import { applyChange, failureOutcome, sampleSaveDoor } from "./index";

const AT = "2026-11-13T09:00:00.000Z";

const listing = (over: Partial<Listing> = {}): Listing => ({
  id: "4d415500-0001-4000-8000-000000000002",
  companyId: "4d415500-0000-4000-8000-000000000001",
  buildingName: "S1.01",
  unitNumber: "1101",
  standardStatus: "Active",
  listPrice: 2_710_000_000,
  version: 1,
  ...over,
});

describe("cong-luu", () => {
  it("cong-luu: saved — the price changes, the version moves on and the edit counts as confirmed", async () => {
    const door = sampleSaveDoor([listing()]);
    const out = await door.save({
      id: listing().id,
      version: 1,
      change: { field: "listPrice", listPrice: 2_800_000_000 },
      at: AT,
    });
    expect(out).toMatchObject({
      kind: "saved",
      listing: { listPrice: 2_800_000_000, version: 2, lastConfirmedAt: AT },
    });
    expect(door.current(listing().id)?.listPrice).toBe(2_800_000_000);
  });

  it("cong-luu: offline — nothing is written while the device has no network", async () => {
    const door = sampleSaveDoor([listing()], { online: () => false });
    const out = await door.save({
      id: listing().id,
      version: 1,
      change: { field: "listPrice", listPrice: 2_800_000_000 },
      at: AT,
    });
    expect(out).toEqual({ kind: "offline" });
    expect(door.current(listing().id)?.listPrice).toBe(2_710_000_000);
  });

  it("cong-luu: conflict — a save on an old version names the current listing and writes nothing", async () => {
    const door = sampleSaveDoor([listing({ version: 3, listPrice: 3_000_000_000 })]);
    const out = await door.save({
      id: listing().id,
      version: 1,
      change: { field: "listPrice", listPrice: 2_800_000_000 },
      at: AT,
    });
    expect(out).toMatchObject({
      kind: "conflict",
      current: { version: 3, listPrice: 3_000_000_000 },
    });
    expect(door.current(listing().id)?.listPrice).toBe(3_000_000_000);
  });

  it("cong-luu: conflict — a removed listing has no current", async () => {
    const door = sampleSaveDoor([]);
    const out = await door.save({
      id: listing().id,
      version: 1,
      change: { field: "listPrice", listPrice: 2_800_000_000 },
      at: AT,
    });
    expect(out).toEqual({ kind: "conflict" });
  });

  it("cong-luu: undo is a save back to the old value, on the new version", async () => {
    const door = sampleSaveDoor([listing()]);
    await door.save({
      id: listing().id,
      version: 1,
      change: { field: "listPrice", listPrice: 2_800_000_000 },
      at: AT,
    });
    const undo = await door.save({
      id: listing().id,
      version: 2,
      change: { field: "listPrice", listPrice: 2_710_000_000 },
      at: AT,
    });
    expect(undo).toMatchObject({
      kind: "saved",
      listing: { listPrice: 2_710_000_000, version: 3 },
    });
  });

  it("cong-luu: an undo after the device went offline is refused as offline, the new value stays", async () => {
    let online = true;
    const door = sampleSaveDoor([listing()], { online: () => online });
    await door.save({
      id: listing().id,
      version: 1,
      change: { field: "listPrice", listPrice: 2_800_000_000 },
      at: AT,
    });
    online = false;
    const undo = await door.save({
      id: listing().id,
      version: 2,
      change: { field: "listPrice", listPrice: 2_710_000_000 },
      at: AT,
    });
    expect(undo).toEqual({ kind: "offline" });
    expect(door.current(listing().id)?.listPrice).toBe(2_800_000_000);
  });
});

describe("cong-luu-luat", () => {
  it("cong-luu-luat: Closed needs the close price and date", () => {
    const out = applyChange(listing(), { field: "standardStatus", standardStatus: "Closed" }, AT);
    expect(out).toEqual({ ok: false, why: { rule: "needs", needs: ["closePrice", "closeDate"] } });
    const done = applyChange(
      listing(),
      {
        field: "standardStatus",
        standardStatus: "Closed",
        closePrice: 2_700_000_000,
        closeDate: "2026-11-13",
      },
      AT,
    );
    expect(done).toMatchObject({
      ok: true,
      listing: { standardStatus: "Closed", closePrice: 2_700_000_000, closeDate: "2026-11-13" },
    });
  });

  it("cong-luu-luat: a move outside the 12 is refused", () => {
    expect(
      applyChange(
        listing({ standardStatus: "Hold" }),
        { field: "standardStatus", standardStatus: "Pending" },
        AT,
      ),
    ).toEqual({ ok: false, why: { rule: "move", from: "Hold", to: "Pending" } });
  });

  it("cong-luu-luat: a Closed listing keeps its price and status", () => {
    const closed = listing({ standardStatus: "Closed" });
    expect(applyChange(closed, { field: "listPrice", listPrice: 3_000_000_000 }, AT)).toEqual({
      ok: false,
      why: { rule: "locked" },
    });
    expect(applyChange(closed, { field: "standardStatus", standardStatus: "Active" }, AT)).toEqual({
      ok: false,
      why: { rule: "locked" },
    });
  });

  it("cong-luu-luat: a Withdrawn listing keeps its status, its price may change", () => {
    const withdrawn = listing({ standardStatus: "Withdrawn", withdrawnReason: "unreachable" });
    expect(
      applyChange(withdrawn, { field: "listPrice", listPrice: 2_500_000_000 }, AT),
    ).toMatchObject({
      ok: true,
    });
    expect(
      applyChange(withdrawn, { field: "standardStatus", standardStatus: "Active" }, AT),
    ).toEqual({ ok: false, why: { rule: "locked" } });
  });

  it("cong-luu-luat: a price outside the readable range is refused", () => {
    expect(applyChange(listing(), { field: "listPrice", listPrice: 0 }, AT)).toEqual({
      ok: false,
      why: { rule: "price" },
    });
    expect(applyChange(listing(), { field: "listPrice", listPrice: 4.5 }, AT)).toEqual({
      ok: false,
      why: { rule: "price" },
    });
  });
});

describe("khuon-loi-that", () => {
  it("khuon-loi-that: fetch's TypeError is offline", () => {
    expect(failureOutcome(new TypeError("Failed to fetch"))).toBe("offline");
  });
  it("khuon-loi-that: a 403 response is refused, a 409 response is conflict", () => {
    expect(failureOutcome(new Response(null, { status: 403 }))).toBe("refused");
    expect(failureOutcome(new Response(null, { status: 409 }))).toBe("conflict");
  });
  it("khuon-loi-that: anything else is not one of the door's outcomes", () => {
    expect(failureOutcome(new Response(null, { status: 500 }))).toBeNull();
    expect(failureOutcome(new Error("boom"))).toBeNull();
    expect(failureOutcome(undefined)).toBeNull();
  });
});
