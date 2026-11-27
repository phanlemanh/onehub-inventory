// Row 3g, server side (_acceptance/sua-thong-tin-can): PATCH /api/v1/listings/[id] takes the four details and one custom
// value, checks them with the one rule of each (applyChange, and the company layer's checkCustomValue handed in like the
// route does), writes what changed, and answers every failure with its code. The case names are the record's pinned
// messages (evals.yaml).
import { describe, expect, it, vi } from "vitest";

import { checkCustomValue } from "../src/modules/company-config";
import type { DbClient } from "../src/modules/identity/server";

import { createListingsHandlers } from "../src/modules/listings/server";
import { applyChange, type CustomCheck } from "../src/modules/listings";
import { httpSaveDoor } from "../src/modules/listings/ui/http-save-door";

vi.mock("server-only", () => ({}));

const ID = "22222222-2222-4222-8222-222222222222";
const NOW = new Date("2026-11-17T03:00:00.000Z");

function row(over: Record<string, unknown> = {}) {
  return {
    id: ID,
    company_id: "c",
    standard_status: "Active",
    list_price: "3000000000",
    close_price: null,
    close_date: null,
    withdrawn_reason: null,
    fee_inclusion: "Included",
    furnished: null,
    occupant_type: null,
    legal_status: null,
    financing: null,
    custom_fields: { huong_view: "Hồ" },
    list_agent_user_id: "keeper",
    list_agent_full_name: "[Tên] 01",
    original_entry_timestamp: new Date("2026-11-01T00:00:00.000Z"),
    last_confirmed_at: null,
    version: 1,
    upi: "u",
    ...over,
  };
}

/** The company's fields, one of each kind, as the company layer keeps them (row 7e). */
const FIELDS = {
  ghi_chu: { kind: "text" as const, options: [] },
  so_cho_xe: { kind: "number" as const, options: [] },
  ngay_ban_giao: { kind: "date" as const, options: [] },
  huong_view: { kind: "single_select" as const, options: ["Hồ", "Phố"] },
  co_ban_cong: { kind: "boolean" as const, options: [] },
  da_ngung: { kind: "text" as const, options: [], retiredAt: "2026-11-01T00:00:00Z" },
};
const CHECK: CustomCheck = (code, value) => {
  const f = FIELDS[code as keyof typeof FIELDS];
  return f ? checkCustomValue(f, value) : { ok: false, reason: "field-retired" };
};

function handlers(opts: { door?: string; found?: ReturnType<typeof row> | null } = {}) {
  const writes: unknown[][] = [];
  const client: DbClient = {
    query: async (text, params) => {
      if (/^\s*select/.test(text))
        return { rows: opts.found === null ? [] : [opts.found ?? row()], rowCount: 1 };
      writes.push(params ?? []);
      return { rows: [], rowCount: 1 };
    },
    release: () => {},
  };
  const h = createListingsHandlers({
    door: async () =>
      opts.door
        ? (opts.door as "forbidden")
        : {
            pool: { connect: async () => client },
            ctx: { userId: "me", companyId: "c" },
            scope: "company",
          },
    withCompany: async (_pool, _ctx, fn) => fn(client),
    now: () => NOW,
  });
  const patch = (change: unknown, version = 1) =>
    h.change(
      new Request(`http://x/api/v1/listings/${ID}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ version, change }),
      }),
      ID,
      { customCheck: async () => CHECK },
    );
  return { patch, writes };
}

/** The written row's columns, by the order of the update in listings-http.ts. */
const written = (params: unknown[]) => ({
  legalStatus: params[9],
  furnished: params[10],
  financing: params[11],
  occupantType: params[12],
  customFields: JSON.parse(String(params[13])) as Record<string, unknown>,
});

describe("sua-thong-tin-can · server", () => {
  it("details-bon-truong: the four details are written, the others kept", async () => {
    const t = handlers({ found: row({ financing: "Vay 70%" }) });
    const res = await t.patch({
      field: "details",
      legalStatus: "Sổ hồng",
      furnished: "Furnished",
      occupantType: "Vacant",
    });
    expect(res.status, "details-bon-truong").toBe(200);
    expect(written(t.writes[0]!)).toMatchObject({
      legalStatus: "Sổ hồng",
      furnished: "Furnished",
      financing: "Vay 70%",
      occupantType: "Vacant",
    });
  });

  it("details-ngoai-tap-400 · details-qua-dai-400: a value outside the set or words too long are refused, nothing written", async () => {
    const t = handlers();
    expect(
      (await t.patch({ field: "details", furnished: "Luxury" })).status,
      "details-ngoai-tap-400",
    ).toBe(400);
    expect(
      (await t.patch({ field: "details", legalStatus: "x".repeat(201) })).status,
      "details-qua-dai-400",
    ).toBe(400);
    expect(t.writes).toEqual([]);
    // Positive control: 200 characters go in.
    expect((await t.patch({ field: "details", legalStatus: "x".repeat(200) })).status).toBe(200);
  });

  it("hop-de-trong-la-xoa: null clears a part", async () => {
    const t = handlers({ found: row({ financing: "Vay 70%" }) });
    expect((await t.patch({ field: "details", financing: null })).status).toBe(200);
    expect(written(t.writes[0]!).financing, "hop-de-trong-la-xoa").toBeNull();
  });

  it("custom-nam-kieu: 5 kinds × (a fitting value is saved, a wrong kind is refused) = 10 cells", async () => {
    const cells: [string, unknown, unknown][] = [
      ["ghi_chu", "Góc", 12],
      ["so_cho_xe", 2, "hai"],
      ["ngay_ban_giao", "2026-12-25", "2026-02-30"],
      ["huong_view", "Phố", "Biển"],
      ["co_ban_cong", true, "có"],
    ];
    let seen = 0;
    for (const [code, good, bad] of cells) {
      const ok = handlers();
      expect(
        (await ok.patch({ field: "customField", code, value: good })).status,
        `custom-nam-kieu: ${code} lưu`,
      ).toBe(200);
      expect(written(ok.writes[0]!).customFields[code], `custom-nam-kieu: ${code} giá trị`).toEqual(
        good,
      );
      seen += 1;
      const no = handlers();
      expect(
        (await no.patch({ field: "customField", code, value: bad })).status,
        `custom-sai-kieu-400: ${code}`,
      ).toBe(400);
      expect(no.writes, `custom-sai-kieu-400: ${code} không ghi`).toEqual([]);
      seen += 1;
    }
    expect(seen).toBe(10);
  });

  it("custom-ngung-400 · custom-khong-lua-chon-400: a retired field or an unknown one takes nothing", async () => {
    expect(
      (await handlers().patch({ field: "customField", code: "da_ngung", value: "x" })).status,
      "custom-ngung-400",
    ).toBe(400);
    expect(
      (await handlers().patch({ field: "customField", code: "khong_co", value: "x" })).status,
      "custom-ngung-400: mã lạ",
    ).toBe(400);
    expect(
      (await handlers().patch({ field: "customField", code: "huong_view", value: "Núi" })).status,
      "custom-khong-lua-chon-400",
    ).toBe(400);
  });

  it("custom-xoa-khi-trong: null takes the value off, other values stay", async () => {
    const t = handlers({ found: row({ custom_fields: { huong_view: "Hồ", ghi_chu: "Góc" } }) });
    expect((await t.patch({ field: "customField", code: "huong_view", value: null })).status).toBe(
      200,
    );
    expect(written(t.writes[0]!).customFields, "custom-xoa-khi-trong").toEqual({ ghi_chu: "Góc" });
  });

  it("quan-tri-403 · custom-quan-tri-403: a role without updateListing is refused at the door, nothing touched", async () => {
    const a = handlers({ door: "forbidden" });
    expect(
      (await a.patch({ field: "details", legalStatus: "Sổ hồng" })).status,
      "quan-tri-403",
    ).toBe(403);
    const b = handlers({ door: "forbidden" });
    expect(
      (await b.patch({ field: "customField", code: "ghi_chu", value: "x" })).status,
      "custom-quan-tri-403",
    ).toBe(403);
    expect([...a.writes, ...b.writes]).toEqual([]);
  });

  it("hop-409-ban-hien-tai: an older version is a conflict carrying the listing as it is now", async () => {
    const t = handlers({ found: row({ version: 3, legal_status: "Sổ hồng" }) });
    const res = await t.patch({ field: "details", furnished: "Partially" }, 1);
    expect(res.status, "hop-409-ban-hien-tai").toBe(409);
    expect(((await res.json()) as { current: { legalStatus: string } }).current.legalStatus).toBe(
      "Sổ hồng",
    );
    expect(t.writes).toEqual([]);
  });

  it("a closed listing keeps its details and custom values", async () => {
    const t = handlers({
      found: row({ standard_status: "Closed", close_price: "1", close_date: "2026-11-01" }),
    });
    expect((await t.patch({ field: "details", legalStatus: "Sổ hồng" })).status).toBe(400);
    expect((await t.patch({ field: "customField", code: "ghi_chu", value: "x" })).status).toBe(400);
    expect(t.writes).toEqual([]);
  });

  it("details-mot-luat-xac-nhan: a details edit and a custom edit both set the confirmed time (Hỏi-1), by applyChange", () => {
    const base = {
      id: ID,
      companyId: "c",
      buildingName: "S1.01",
      standardStatus: "Active" as const,
      version: 1,
    };
    const at = NOW.toISOString();
    const details = applyChange(base, { field: "details", legalStatus: "Sổ hồng" }, at);
    const custom = applyChange(
      base,
      { field: "customField", code: "ghi_chu", value: "Góc" },
      at,
      CHECK,
    );
    const confirmed = [details, custom].map((r) => (r.ok ? r.listing.lastConfirmedAt : null));
    expect(confirmed[0], "details-mot-luat-xac-nhan: bốn trường").toBe(at);
    expect(confirmed[1], "details-mot-luat-xac-nhan: trường riêng").toBe(at);
    expect(confirmed.length).toBe(2);
  });

  it("hop-409-tai-ban-moi: the real handler's 409 reaches the save door as a conflict with the current listing", async () => {
    const t = handlers({ found: row({ version: 3, legal_status: "Sổ hồng" }) });
    const door = httpSaveDoor({
      online: () => true,
      fetch: async (_url, init) =>
        t.patch(JSON.parse(String(init?.body)).change, JSON.parse(String(init?.body)).version),
    });
    const outcome = await door.save({
      id: ID,
      version: 1,
      change: { field: "details", furnished: "Partially" },
      at: "",
    });
    expect(outcome.kind, "hop-409-tai-ban-moi").toBe("conflict");
    expect(outcome.kind === "conflict" ? outcome.current?.legalStatus : null).toBe("Sổ hồng");
  });
});

describe("sua-thong-tin-can · bốn vai", () => {
  it("vai-4-o: four roles × PATCH details, the door answering by the permission table (3 × 200, CompanyAdmin 403)", async () => {
    const { allowedScope } = await import("../src/modules/identity");
    const want: Record<string, number> = {
      ListAgent: 200,
      BuyerAgent: 200,
      TeamLead: 200,
      CompanyAdmin: 403,
    };
    let cells = 0;
    for (const [role, status] of Object.entries(want)) {
      const scope = allowedScope([role as "ListAgent"], "updateListing");
      const t = handlers(scope ? {} : { door: "forbidden" });
      const res = await t.patch({ field: "details", legalStatus: "Sổ hồng" });
      expect(res.status, `vai-4-o: ${role}`).toBe(status);
      expect(t.writes.length, `vai-4-o: ${role} ghi`).toBe(status === 200 ? 1 : 0);
      cells += 1;
    }
    expect(cells).toBe(4);
  });
});
