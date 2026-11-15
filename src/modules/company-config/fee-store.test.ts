// The fee schedule's store without a database (row 19): a small in-memory company_fee_items answers the store's own
// statements, so these cases pin what the store decides — which item gets a row, which row is retired, the codes it
// hands out, and the schedule it reads back. The same store on a real database: tests/db/thue-phi.db.test.ts.
import { describe, expect, it } from "vitest";

import type { DbClient } from "@/modules/identity/server";

import { readFeeSchedule, saveFeeSchedule } from "./fee-store";
import { label } from "./index";
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

// The name of an item through one save (ruling G N-1511-2): start (default name · own name · an added item) ×
// what the save does → the name after the save and after a reload. Two senders: the screen, which sends the name of
// every own item, and an API caller that sends a name only when it renames or resets. Every cell must hold.
describe("ten-qua-mot-lan-luu", () => {
  const DEFAULT = label("BrokerageFee");
  type Start = "ten-mac-dinh" | "ten-tu-dat" | "khoan-them";
  type Op =
    | "bat-tat"
    | "doi-muc"
    | "tra-ve-mac-dinh"
    | "them-khoan-khac"
    | "bo-khoan-khac"
    | "doi-ten-lan-nua"
    | "khong-doi-gi";
  type Sender = "man" | "api";
  interface D {
    code?: string;
    name?: string;
    rateBasisPoints: number;
    included: boolean;
  }

  /** The schedule before the save: brokerage (default or renamed), an extra item to take out, maybe an added item. */
  async function begin(start: Start) {
    const t = table();
    const r = await saveFeeSchedule(t.run, "u1", [
      ...LAW(),
      { ...brokerage(100), ...(start === "ten-tu-dat" ? { name: "Hoa hồng" } : {}) },
      { name: "Phí phụ", rateBasisPoints: 10, included: true },
      ...(start === "khoan-them"
        ? [{ name: "Phí hồ sơ", rateBasisPoints: 30, included: true }]
        : []),
    ]);
    if (!r.ok) throw new Error(`không dựng được ${start}`);
    const subject = start === "khoan-them" ? r.schedule.items.at(-1)!.code : "brokerage";
    const extra = r.schedule.items.find((i) => i.name === "Phí phụ")!.code;
    return { t, items: r.schedule.items, subject, extra };
  }

  const EXPECT: Record<Start, Record<Op, string | null>> = {
    "ten-mac-dinh": {
      "bat-tat": DEFAULT,
      "doi-muc": DEFAULT,
      "tra-ve-mac-dinh": DEFAULT,
      "them-khoan-khac": DEFAULT,
      "bo-khoan-khac": DEFAULT,
      "doi-ten-lan-nua": "Tên mới",
      "khong-doi-gi": DEFAULT,
    },
    "ten-tu-dat": {
      "bat-tat": "Hoa hồng",
      "doi-muc": "Hoa hồng",
      "tra-ve-mac-dinh": DEFAULT,
      "them-khoan-khac": "Hoa hồng",
      "bo-khoan-khac": "Hoa hồng",
      "doi-ten-lan-nua": "Tên mới",
      "khong-doi-gi": "Hoa hồng",
    },
    // An added item has no default to go back to: the reset is not offered for it.
    "khoan-them": {
      "bat-tat": "Phí hồ sơ",
      "doi-muc": "Phí hồ sơ",
      "tra-ve-mac-dinh": null,
      "them-khoan-khac": "Phí hồ sơ",
      "bo-khoan-khac": "Phí hồ sơ",
      "doi-ten-lan-nua": "Tên mới",
      "khong-doi-gi": "Phí hồ sơ",
    },
  };

  for (const sender of ["man", "api"] as const satisfies readonly Sender[]) {
    for (const start of Object.keys(EXPECT) as Start[]) {
      for (const op of Object.keys(EXPECT[start]) as Op[]) {
        const want = EXPECT[start][op];
        if (want === null) continue;
        it(`${sender} · ${start} · ${op} → «${want}»`, async () => {
          const { t, items, subject, extra } = await begin(start);
          let draft: D[] = items.map((i) => {
            const d: D = { code: i.code, rateBasisPoints: i.rateBasisPoints, included: i.included };
            if (i.kind === "Own" && sender === "man") d.name = i.name;
            return d;
          });
          const at = (code: string) => draft.findIndex((d) => d.code === code);
          const s = at(subject);
          if (op === "bat-tat") draft[s] = { ...draft[s]!, included: !draft[s]!.included };
          if (op === "doi-muc") draft[s] = { ...draft[s]!, rateBasisPoints: 150 };
          if (op === "tra-ve-mac-dinh")
            draft[s] = { ...draft[s]!, name: DEFAULT, rateBasisPoints: 100, included: true };
          if (op === "them-khoan-khac")
            draft.push({ name: "Phí khác", rateBasisPoints: 10, included: true });
          if (op === "bo-khoan-khac") draft = draft.filter((d) => d.code !== extra);
          if (op === "doi-ten-lan-nua") draft[s] = { ...draft[s]!, name: "Tên mới" };
          const saved = await saveFeeSchedule(t.run, "u1", draft);
          if (!saved.ok) throw new Error(`${start} · ${op}: ${JSON.stringify(saved.problems)}`);
          expect(saved.schedule.items.find((i) => i.code === subject)?.name, "sau Lưu").toBe(want);
          const reloaded = (await readFeeSchedule(t.run)).items.find((i) => i.code === subject);
          expect(reloaded?.name, "sau tải lại").toBe(want);
          if (op === "tra-ve-mac-dinh")
            expect(reloaded?.source.kind, "về mặc định").toBe("default");
        });
      }
    }
  }
});
