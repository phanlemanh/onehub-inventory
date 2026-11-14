// The fee schedule's store without a database (row 19): a small in-memory company_fee_items answers the store's own
// statements, so these cases pin what the store decides — which item gets a row, which row is retired, the codes it
// hands out, and the schedule it reads back. The same store on a real database: tests/db/thue-phi.db.test.ts.
import { describe, expect, it } from "vitest";

import type { DbClient } from "@/modules/identity/server";

import { readFeeSchedule, saveFeeSchedule } from "./fee-store";
import type { RunAs } from "./store";

interface Row {
  id: number;
  code: string;
  kind: "Law" | "Own";
  name: string | null;
  rate_bp: number;
  included: boolean;
  removed: boolean;
  position: number;
  changed_by_name: string;
  changed_at: Date;
  retired_at: Date | null;
}

/** An in-memory table that answers exactly the statements of fee-store.ts. */
function table() {
  const rows: Row[] = [];
  let next = 1;
  const client: DbClient = {
    release() {},
    async query(text: string, params: unknown[] = []) {
      const p = params as never[];
      if (text.includes("pg_advisory_xact_lock")) return { rows: [], rowCount: 0 };
      if (text.includes("from company_members")) return { rows: [{ name: "[Tên]" }], rowCount: 1 };
      if (text.startsWith("select id::text")) {
        const live = rows
          .filter((r) => r.retired_at === null)
          .sort((a, b) => a.position - b.position || a.id - b.id)
          .map((r) => ({ ...r, id: String(r.id) }));
        return { rows: live, rowCount: live.length };
      }
      if (text.includes("select code from"))
        return { rows: rows.map((r) => ({ code: r.code })), rowCount: rows.length };
      if (text.includes("select position from"))
        return { rows: rows.map((r) => ({ position: r.position })), rowCount: rows.length };
      if (text.includes("set retired_at")) {
        const r = rows.find((x) => String(x.id) === String(p[0]))!;
        r.retired_at = new Date();
        return { rows: [], rowCount: 1 };
      }
      if (text.trimStart().startsWith("update")) {
        const r = rows.find((x) => String(x.id) === String(p[0]))!;
        Object.assign(r, {
          name: p[1],
          rate_bp: p[2],
          included: p[3],
          removed: p[4],
          changed_by_name: p[5],
        });
        return { rows: [], rowCount: 1 };
      }
      if (text.trimStart().startsWith("insert")) {
        const [code, kind, name, rate_bp, included, removed, position, by] = params as [
          string,
          Row["kind"],
          string | null,
          number,
          boolean,
          boolean,
          number,
          string,
        ];
        rows.push({
          id: next++,
          code,
          kind,
          name,
          rate_bp,
          included,
          removed,
          position,
          changed_by_name: by,
          changed_at: new Date("2026-11-14T03:00:00Z"),
          retired_at: null,
        });
        return { rows: [], rowCount: 1 };
      }
      throw new Error(`câu lạ: ${text}`);
    },
  };
  const run: RunAs = (fn) => fn(client);
  return { rows, run };
}

const LAW = (registration = true) => [
  { code: "pit", rateBasisPoints: 200, included: true },
  { code: "registration", rateBasisPoints: 50, included: registration },
];
const brokerage = (rate: number) => ({ code: "brokerage", rateBasisPoints: rate, included: true });

describe("fee store", () => {
  it("reads the defaults when nothing is stored", async () => {
    const t = table();
    const { items } = await readFeeSchedule(t.run);
    expect(
      items.map((i) => [i.code, i.kind, i.rateBasisPoints, i.included, i.source.kind]),
    ).toEqual([
      ["pit", "Law", 200, true, "default"],
      ["registration", "Law", 50, true, "default"],
      ["brokerage", "Own", 100, true, "default"],
    ]);
  });

  it("writes rows only for changed items, then updates in place and retires on reset", async () => {
    const t = table();
    const r1 = await saveFeeSchedule(t.run, "u1", [...LAW(false), brokerage(200)]);
    expect(r1.ok).toBe(true);
    expect(t.rows.map((r) => [r.code, r.rate_bp, r.included])).toEqual([
      ["registration", 50, false],
      ["brokerage", 200, true],
    ]);
    await saveFeeSchedule(t.run, "u1", [...LAW(false), brokerage(250)]);
    expect(t.rows).toHaveLength(2);
    expect(t.rows[1]!.rate_bp).toBe(250);
    await saveFeeSchedule(t.run, "u1", [...LAW(true), brokerage(100)]);
    expect(t.rows.every((r) => r.retired_at !== null)).toBe(true);
    const { items } = await readFeeSchedule(t.run);
    expect(items.map((i) => i.source.kind)).toEqual(["default", "default", "default"]);
  });

  it("adds, renames and removes an own item; a removed code is not handed out again", async () => {
    const t = table();
    const r = await saveFeeSchedule(t.run, "u1", [
      ...LAW(),
      brokerage(100),
      { name: "Phí hồ sơ", rateBasisPoints: 30, included: true },
    ]);
    if (!r.ok) throw new Error("không lưu được");
    const added = r.schedule.items.at(-1)!;
    expect(added).toMatchObject({
      kind: "Own",
      name: "Phí hồ sơ",
      source: { kind: "added", by: "[Tên]" },
    });
    const renamed = await saveFeeSchedule(t.run, "u1", [
      ...LAW(),
      brokerage(100),
      { code: added.code, name: "Phí giấy tờ", rateBasisPoints: 30, included: true },
    ]);
    expect(renamed.ok && renamed.schedule.items.at(-1)?.name).toBe("Phí giấy tờ");
    await saveFeeSchedule(t.run, "u1", [...LAW(), brokerage(100)]);
    expect((await readFeeSchedule(t.run)).items).toHaveLength(3);
    const again = await saveFeeSchedule(t.run, "u1", [
      ...LAW(),
      brokerage(100),
      { name: "Phí khác", rateBasisPoints: 10, included: true },
    ]);
    expect(again.ok && again.schedule.items.at(-1)?.code).not.toBe(added.code);
  });

  it("removes the default brokerage item with a row of its own, and keeps it out of the schedule", async () => {
    const t = table();
    await saveFeeSchedule(t.run, "u1", LAW());
    expect(t.rows.map((r) => [r.code, r.removed])).toEqual([["brokerage", true]]);
    expect((await readFeeSchedule(t.run)).items.map((i) => i.code)).toEqual([
      "pit",
      "registration",
    ]);
  });

  it("refuses a wrong schedule and writes nothing", async () => {
    const t = table();
    const r = await saveFeeSchedule(t.run, "u1", [...LAW(), brokerage(600)]);
    expect(r).toEqual({ ok: false, problems: [{ problem: "rate-above-max", index: 2 }] });
    expect(t.rows).toHaveLength(0);
  });
});
