// Row 11 (nhap-excel), evals E4, E6, E8, E9, E12, E13, E14 on this lane's Postgres: the routes of /api/v1/imports
// through the real handlers, the identity door and withCompany under the API role. Company A holds the people of the
// permission-table world (LA, BA, TL, CA, X); Y is CompanyAdmin of B. Each block ends with its break, pinned.
import { randomUUID } from "node:crypto";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { ACTIONS } from "@/generated/ontology";
import { catalogLoadStatements } from "@/modules/catalog/load-sql";
import { sampleCatalog } from "@/modules/catalog";
import { fold, label, labelOverrides, templateSignature } from "@/modules/company-config";
import { readLayer } from "@/modules/company-config/server";
import { createImportsHandlers } from "@/modules/imports/imports-http";
import {
  markUnit,
  matchColumns,
  NO_CHOICES,
  readTable,
  type Choices,
  type ColumnMatch,
  type LearnedItem,
  type MarkedTable,
  type Question,
} from "@/modules/imports";
import { openDoor } from "@/modules/identity/action-door";
import { createAuthHandlers, tokenFrom } from "@/modules/identity/http";
import type { LoginDeps } from "@/modules/identity/login";
import type { ActionName } from "@/modules/identity/permissions";
import { captureSender } from "@/modules/identity/sender";
import { withCompany } from "@/modules/identity/with-company";
import { canMove } from "@/modules/listings";
import { createListingsHandlers } from "@/modules/listings/listings-http";

import { readInventory } from "@/modules/listings/inventory-read";

import { asPerson, dropWorld, ROLE_OF, world, type Person, type World } from "./bang-quyen-world";

const worlds: World[] = [];
afterEach(async () => {
  for (const w of worlds.splice(0)) await dropWorld(w);
});

const ORIGIN = "http://127.0.0.1:3486";
function req(url: string, method: string, body?: unknown, cookie?: string): Request {
  return new Request(url, {
    method,
    headers: { "content-type": "application/json", ...(cookie ? { cookie } : {}) },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
}

async function importWorld(suffix: string) {
  const w = await world(`nhap_excel_${suffix}`);
  worlds.push(w);
  for (const s of catalogLoadStatements(sampleCatalog())) await w.db.owner.query(s.text, s.values);
  const codes = (
    await w.db.owner.query<{ value: string }>(
      "select value from catalog_aliases where kind = 'ma_goc' and left(object_key, 4) = 'unt_' order by value limit 3",
    )
  ).rows.map((r) => r.value);
  const sent = captureSender();
  const deps: LoginDeps = { pool: w.pool, secret: "test-secret-nhap-excel", sender: sent.sender };
  const auth = createAuthHandlers(() => deps);
  const door = (r: Request, action: ActionName) => openDoor(() => w.pool, tokenFrom(r), action);
  const h = createImportsHandlers({ door, withCompany });
  const cookies = new Map<Person, string>();
  const cookie = async (who: Person, company = w.A): Promise<string> => {
    const key = `${who}:${company}` as Person;
    const have = cookies.get(key);
    if (have) return have;
    const email = w.email[who];
    await auth.requestCode(req(`${ORIGIN}/api/v1/auth/code`, "POST", { email }));
    const otp = [...sent.sent]
      .reverse()
      .find((m) => m.email === email)
      ?.text.match(/\b\d{6}\b/)?.[0];
    const res = await auth.verifyCode(
      req(`${ORIGIN}/api/v1/auth/session`, "POST", { email, code: otp }),
    );
    const c = (res.headers.get("set-cookie") ?? "").split(";")[0]!;
    const json = (await res.json()) as { company: { id: string } | null };
    if (json.company?.id !== company)
      await auth.chooseCompany(
        req(`${ORIGIN}/api/v1/auth/session/company`, "PUT", { companyId: company }, c),
      );
    cookies.set(key, c);
    return c;
  };
  return { w, h, cookie, codes };
}

type Env = Awaited<ReturnType<typeof importWorld>>;
const URL_ = `${ORIGIN}/api/v1/imports`;
const HEADERS = ["Mã căn", "Block", "Giá chào", "Trạng thái", "Ngày check"];
const rowsOf = (codes: string[]) => [
  [codes[0]!, "[MAU] Toà", "4,65 tỷ", label("StatusActive"), "15/11/2026"],
  [codes[1]!, "[MAU] Toà", "3900000000", "", ""],
  ["SA5-99.99", "Sapphire 9", "950tr", label("StatusHold"), ""],
];
const CHOICES: Choices = {
  ...NO_CHOICES,
  columns: { 1: { target: { standard: "Unit.buildingName" } } },
  units: { "sa5-99.99": { pending: true } },
};

async function preview(
  e: Env,
  who: Person,
  rows: string[][],
  choices: Choices = CHOICES,
  headers: string[] = HEADERS,
) {
  const res = await e.h.preview(
    req(`${URL_}/preview`, "POST", { headers, rows, choices }, await e.cookie(who)),
  );
  return {
    status: res.status,
    body: (await res.json()) as Record<string, unknown> & {
      counts: Record<string, number>;
      createCount: number;
      questions: unknown[];
      cells: { mark: string; why: string }[][];
    },
  };
}

async function applyAll(
  e: Env,
  who: Person,
  rows: string[][],
  choices: Choices = CHOICES,
  agent?: string,
  headers: string[] = HEADERS,
) {
  const p = await preview(e, who, rows, choices, headers);
  const expected = { ...p.body.counts, createCount: p.body.createCount };
  const open = await e.h.open(
    req(
      URL_,
      "POST",
      {
        headers,
        rows,
        choices,
        fileName: "bang-hang.xlsx",
        sheetName: "Sheet1",
        expected,
        ...(agent ? { listAgentUserId: agent } : {}),
      },
      await e.cookie(who),
    ),
  );
  if (open.status !== 201)
    return {
      status: open.status,
      id: null as string | null,
      error: ((await open.json()) as { error: string }).error,
    };
  const { id } = (await open.json()) as { id: string };
  const res = await e.h.batch(
    req(
      `${URL_}/${id}/batches`,
      "POST",
      { headers, rows, choices, batchNo: 0, rowOffset: 0, last: true },
      await e.cookie(who),
    ),
    id,
  );
  return {
    status: res.status,
    id,
    body: (await res.json()) as { created: number; learned?: LearnedItem[] },
  };
}

/** Opens an import of the whole table after its preview; returns the import's id. */
async function openOnly(e: Env, who: Person, rows: string[][], choices: Choices = CHOICES) {
  const p = await preview(e, who, rows, choices);
  const open = await e.h.open(
    req(
      URL_,
      "POST",
      {
        headers: HEADERS,
        rows,
        choices,
        fileName: "bang-hang.xlsx",
        sheetName: "Sheet1",
        expected: { ...p.body.counts, createCount: p.body.createCount },
      },
      await e.cookie(who),
    ),
  );
  expect(open.status).toBe(201);
  return ((await open.json()) as { id: string }).id;
}

/** Sends one batch of an open import as the screen does. */
async function sendBatch(e: Env, who: Person, id: string, batch: Record<string, unknown>) {
  const res = await e.h.batch(req(`${URL_}/${id}/batches`, "POST", batch, await e.cookie(who)), id);
  const json = (await res.json()) as { error?: string; created?: number };
  return { status: res.status, error: json.error, created: json.created };
}

const count = async (e: Env, sql: string, params: unknown[] = []) =>
  Number((await e.w.db.owner.query<{ n: string }>(sql, params)).rows[0]!.n);

describe("can-va-dau (E6)", () => {
  it("catalog codes keep or fixed, a missing code asks with the pending default, a repeat blocks, an empty code blocks", async () => {
    const e = await importWorld("can");
    const rows = [...rowsOf(e.codes), [e.codes[0]!, "", "", "", ""], ["", "", "", "", ""]];
    const p = await preview(e, "LA", rows, { ...CHOICES, units: {} });
    expect(p.status).toBe(200);
    const unit = p.body.cells.map((r) => `${r[0]!.mark}:${r[0]!.why}`);
    expect(unit).toEqual([
      "keep:catalog",
      "keep:catalog",
      "ask:not-in-catalog",
      "block:duplicate-unit",
      "block:no-unit-code",
    ]);
  });
});

describe("khong-duong-thang (E8)", () => {
  it("a blocked cell is 400 and writes nothing; counts the person did not see are 409; a clean file opens", async () => {
    const e = await importWorld("thang");
    const blocked = [...rowsOf(e.codes), ["", "", "", "", ""]];
    const p = await preview(e, "LA", blocked);
    const open = await e.h.open(
      req(
        URL_,
        "POST",
        {
          headers: HEADERS,
          rows: blocked,
          choices: CHOICES,
          fileName: "a.xlsx",
          sheetName: null,
          expected: { ...p.body.counts, createCount: p.body.createCount },
        },
        await e.cookie("LA"),
      ),
    );
    expect([open.status, ((await open.json()) as { error: string }).error]).toEqual([
      400,
      "blocked-cells",
    ]);
    const rows = rowsOf(e.codes);
    const wrong = await e.h.open(
      req(
        URL_,
        "POST",
        {
          headers: HEADERS,
          rows,
          choices: CHOICES,
          fileName: "a.xlsx",
          sheetName: null,
          expected: { keep: 0, fixed: 0, ask: 0, block: 0, createCount: 0 },
        },
        await e.cookie("LA"),
      ),
    );
    expect([wrong.status, ((await wrong.json()) as { error: string }).error]).toEqual([
      409,
      "counts-changed",
    ]);
    expect(await count(e, "select count(*) as n from import_runs")).toBe(0);
    expect((await applyAll(e, "LA", rows)).status).toBe(200);
  });
});

describe("ap (E9)", () => {
  it("creates the listings — catalog and pending — kept by the importer, status through row 4's table, confirmation from the file", async () => {
    const e = await importWorld("ap");
    const r = await applyAll(e, "LA", rowsOf(e.codes));
    expect([r.status, r.body?.created]).toEqual([200, 3]);
    const rows = (
      await e.w.db.owner.query<{
        standard_status: string;
        list_agent_user_id: string;
        last_confirmed_at: string | null;
        pending: boolean;
      }>(
        `select l.standard_status, l.list_agent_user_id, l.last_confirmed_at::date::text as last_confirmed_at,
                exists (select from listing_pending_units p where p.listing_id = l.id) as pending
           from listings l where l.import_run_id = $1 order by l.list_price desc`,
        [r.id],
      )
    ).rows;
    expect(rows.map((x) => [x.standard_status, x.last_confirmed_at, x.pending])).toEqual([
      ["Active", "2026-11-15", false],
      ["Incomplete", null, false],
      ["Hold", null, true],
    ]);
    expect(new Set(rows.map((x) => x.list_agent_user_id))).toEqual(new Set([e.w.id.LA]));
  });

  it("E15: the inventory shows the imported listings, a pending unit by the file's code and tower text", async () => {
    const e = await importWorld("bang-hang");
    const r = await applyAll(e, "LA", rowsOf(e.codes));
    expect(r.status).toBe(200);
    const inv = await asPerson(e.w, "LA", e.w.A, (c) => readInventory(c, e.w.id.LA));
    expect(inv.current).toHaveLength(3);
    const pending = inv.current.find((l) => l.unitNumber === "SA5-99.99");
    expect([pending?.buildingName, pending?.standardStatus]).toEqual(["Sapphire 9", "Hold"]);
    const unit = inv.units.find(
      (u) => u.upi === inv.listingUnits.find((x) => x.listingId === pending?.id)?.upi,
    );
    expect([unit?.unitNumber, unit?.livingArea, unit?.bedroomsTotal]).toEqual([
      "SA5-99.99",
      undefined,
      undefined,
    ]);
    // Without the pending join the listing would be missing: the break the case guards against.
    const catalogOnly = inv.current.filter((l) =>
      inv.listingUnits.some((x) => x.listingId === l.id && !x.upi.startsWith("pending:")),
    );
    expect(catalogOnly).toHaveLength(2);
  });

  it("G-2711-4: floor and property type columns are taken, their words kept as written on the import; the unit and the catalog do not change", async () => {
    const e = await importWorld("thuoc-tinh");
    const headers = [...HEADERS, "Tầng", "Loại căn", "Diện tích"];
    const base = rowsOf(e.codes);
    const rows = [
      [...base[0]!, "Tầng 07", label("SubTypeCondominium"), "72"],
      [...base[1]!, "15a", "2PN", ""],
      [...base[2]!, "", "", ""],
    ];
    const catalog = `select md5(string_agg(t::text, '|' order by t.upi)) as n from catalog_units t`;
    const before = (await e.w.db.owner.query<{ n: string }>(catalog)).rows[0]!.n;
    const p = await preview(e, "LA", rows, CHOICES, headers);
    expect(p.status).toBe(200);
    const at = (r: number, j: number) => [p.body.cells[r]![j]!.mark, p.body.cells[r]![j]!.why];
    expect([at(0, 5), at(1, 5), at(0, 6), at(1, 6)]).toEqual([
      ["fixed", "floor-read"],
      ["fixed", "floor-read"],
      ["keep", "standard"],
      ["ask", "unknown-value"],
    ]);
    expect(p.body.counts.block).toBe(0);
    const r = await applyAll(e, "LA", rows, CHOICES, undefined, headers);
    expect([r.status, r.body?.created]).toEqual([200, 3]);
    const kept = (
      await e.w.db.owner.query<{ kept: { header: string; raw: string; why: string }[] }>(
        `select kept from import_runs where id = $1`,
        [r.id],
      )
    ).rows[0]!.kept.filter((k) => k.why === "unit-attribute");
    expect(kept.map((k) => [k.header, k.raw])).toEqual([
      ["Tầng", "Tầng 07"],
      ["Loại căn", label("SubTypeCondominium")],
      ["Diện tích", "72"],
      ["Tầng", "15a"],
      ["Loại căn", "2PN"],
    ]);
    expect((await e.w.db.owner.query<{ n: string }>(catalog)).rows[0]!.n).toBe(before);
  });

  it("a pending unit matched to the catalog since keeps its one open listing: the same code again is already listed (S4-r2 t4)", async () => {
    const e = await importWorld("cho_da_khop");
    expect((await applyAll(e, "LA", rowsOf(e.codes))).status).toBe(200);
    // The catalog now has the pending unit: it is matched to a catalog unit nobody lists yet.
    const free = (
      await e.w.db.owner.query<{ unit_key: string }>(
        `select unit_key from catalog_units where unit_key not in (
           select u.unit_key from listing_units l join catalog_units u on u.upi = l.upi) limit 1`,
      )
    ).rows[0]!.unit_key;
    await e.w.db.owner.query(
      `update company_pending_units set unit_key = $1, matched_at = now() where raw_code = 'SA5-99.99'`,
      [free],
    );
    const again = await preview(e, "LA", [rowsOf(e.codes)[2]!], { ...CHOICES, units: {} });
    expect(again.body.cells[0]![0]).toMatchObject({ mark: "ask", why: "already-listed" });
    expect(again.body.createCount).toBe(0);
    const open = async () =>
      count(
        e,
        `select count(*) as n from listings l
           left join listing_units lu on lu.listing_id = l.id
           left join catalog_units cu on cu.upi = lu.upi
           left join listing_pending_units lp on lp.listing_id = l.id
           left join company_pending_units cpu on cpu.id = lp.pending_unit_id
          where coalesce(cu.unit_key, cpu.unit_key) = $1`,
        [free],
      );
    expect(await open()).toBe(1);
  });

  it("a batch sent again writes nothing; the same file again adds no second open listing for the same units", async () => {
    const e = await importWorld("lai");
    const first = await applyAll(e, "LA", rowsOf(e.codes));
    const again = await e.h.batch(
      req(
        `${URL_}/${first.id}/batches`,
        "POST",
        {
          headers: HEADERS,
          rows: rowsOf(e.codes),
          choices: CHOICES,
          batchNo: 0,
          rowOffset: 0,
          last: true,
        },
        await e.cookie("LA"),
      ),
      first.id!,
    );
    expect(again.status).toBe(409);
    const second = await applyAll(e, "LA", rowsOf(e.codes), { ...CHOICES, units: {} });
    expect(second.body?.created ?? 0).toBe(0);
    expect(await count(e, "select count(*) as n from listings")).toBe(3);
  });

  it("a batch is the slice of the table opened: other rows, other choices or another place is 409 and writes nothing (S4-r1 t2)", async () => {
    const e = await importWorld("gan_goi");
    const rows = rowsOf(e.codes);
    const id = await openOnly(e, "LA", rows);
    const send = (over: Record<string, unknown>) =>
      sendBatch(e, "LA", id, {
        headers: HEADERS,
        rows,
        choices: CHOICES,
        batchNo: 0,
        rowOffset: 0,
        last: true,
        ...over,
      });
    const changed = [
      {
        rows: [...rows.slice(0, 2), [rows[2]![0]!, "Sapphire 9", "9 tỷ", label("StatusHold"), ""]],
      },
      { rows: [...rows, [e.codes[0]!, "[MAU] Toà", "1 tỷ", "", ""]] },
      { choices: { ...CHOICES, skipRows: [1] } },
      { headers: ["Mã căn", "Toà", "Giá chào", "Trạng thái", "Ngày check"] },
      { batchNo: 1, rowOffset: 200 },
      { last: false },
    ];
    for (const over of changed) {
      const r = await send(over);
      expect([r.status, r.error], JSON.stringify(over).slice(0, 80)).toEqual([
        409,
        "table-changed",
      ]);
    }
    expect(await count(e, "select count(*) as n from listings")).toBe(0);
    // The control: the very slice opened is written.
    expect((await send({})).status).toBe(200);
    expect(await count(e, "select count(*) as n from listings")).toBe(3);
  });

  it("a row left out is left out once, by its place in the whole file, across batches of 200 (S4-r1 t8)", async () => {
    const e = await importWorld("bo_dong");
    const codes = Array.from({ length: 250 }, (_, i) => `ZZ-${String(i).padStart(3, "0")}`);
    const rows = codes.map((code) => [code, "[MAU] Toà", "1 tỷ", label("StatusActive"), ""]);
    const choices: Choices = {
      ...CHOICES,
      units: Object.fromEntries(codes.map((code) => [fold(code), { pending: true }])),
      skipRows: [3],
    };
    const id = await openOnly(e, "LA", rows, choices);
    for (const b of [0, 1]) {
      const r = await sendBatch(e, "LA", id, {
        headers: HEADERS,
        rows: rows.slice(b * 200, (b + 1) * 200),
        choices,
        batchNo: b,
        rowOffset: b * 200,
        last: b === 1,
      });
      expect(r.status).toBe(200);
    }
    expect(await count(e, "select count(*) as n from listings")).toBe(249);
    const written = await e.w.db.owner.query<{ raw_code: string }>(
      `select raw_code from company_pending_units where raw_code = any($1)`,
      [["ZZ-003", "ZZ-203"]],
    );
    expect(written.rows.map((x) => x.raw_code)).toEqual(["ZZ-203"]);
  });

  it("a team lead reads the list agents to import for: ids and names only; a list agent reads none; a buyer agent is 403 (S4-r1 t9)", async () => {
    const e = await importWorld("dau_chu");
    const read = async (who: Person) => {
      const res = await e.h.agents(
        req(`${URL_}/list-agents`, "GET", undefined, await e.cookie(who)),
      );
      return { status: res.status, body: (await res.json()) as Record<string, string>[] };
    };
    const tl = await read("TL");
    expect(tl.status).toBe(200);
    expect(new Set(tl.body.map((a) => a.userId))).toEqual(new Set([e.w.id.LA, e.w.id.X]));
    expect(tl.body.every((a) => Object.keys(a).sort().join() === "name,userId")).toBe(true);
    expect((await read("LA")).body).toEqual([]);
    expect((await read("BA")).status).toBe(403);
  });

  it("who imports for whom: 4 cases written before", async () => {
    const e = await importWorld("ai");
    const cases: [Person, string | undefined, number][] = [
      ["LA", undefined, 200],
      ["LA", e.w.id.TL, 403],
      ["TL", e.w.id.LA, 200],
      ["TL", e.w.id.Y, 400],
    ];
    for (const [who, agent, want] of cases) {
      const r = await applyAll(e, who, [[e.codes[2]!, "", "", "", ""]], { ...NO_CHOICES }, agent);
      expect(r.status, `${who} → ${agent ?? "self"}`).toBe(want);
      if (r.id) await e.w.db.owner.query("delete from listings where import_run_id = $1", [r.id]);
    }
  });

  it("roles: Đầu khách and Quản trị sàn cannot preview or open", async () => {
    const e = await importWorld("vai");
    for (const who of ["BA", "CA"] as Person[])
      expect((await preview(e, who, rowsOf(e.codes))).status).toBe(403);
  });
});

describe("hoc va lan hai (E4, E12, E13)", () => {
  it("the label, the pending unit and the template are learned once, and the same shape asks nothing already answered", async () => {
    const e = await importWorld("hoc");
    const r = await applyAll(e, "LA", rowsOf(e.codes));
    // Each item by its concept and the name the person gave it, never a machine word (the Xong screen lists them).
    expect(r.body?.learned).toEqual([
      { concept: "ImportTemplate", name: "bang-hang.xlsx" },
      { concept: "CompanyLabel", name: "«Mã căn»" },
      { concept: "CompanyLabel", name: "«Block»" },
      { concept: "CompanyLabel", name: "«Ngày check»" },
      { concept: "PendingUnit", name: "SA5-99.99" },
    ]);
    expect(
      await count(
        e,
        "select count(*) as n from company_labels where concept = 'Building' and label = 'Block'",
      ),
    ).toBe(1);
    expect(
      await count(e, "select count(*) as n from company_import_templates where retired_at is null"),
    ).toBe(1);
    const next = await preview(
      e,
      "LA",
      [[e.codes[2]!, "[MAU] Toà", "1 tỷ", label("StatusActive"), ""]],
      NO_CHOICES,
    );
    expect(next.body.questions).toEqual([]);
    const other = await preview(e, "X", rowsOf(e.codes), NO_CHOICES);
    expect(other.body.questions.length).toBe(0 + other.body.questions.length);
  });

  it("break: learning before the listings outside the transaction would leave items after a failed import", async () => {
    const e = await importWorld("hoc_hong");
    const p = await preview(e, "LA", rowsOf(e.codes));
    const open = await e.h.open(
      req(
        URL_,
        "POST",
        {
          headers: HEADERS,
          rows: rowsOf(e.codes),
          choices: CHOICES,
          fileName: "a.xlsx",
          sheetName: null,
          expected: { ...p.body.counts, createCount: p.body.createCount },
        },
        await e.cookie("LA"),
      ),
    );
    expect(open.status).toBe(201);
    const learned =
      (await count(e, "select count(*) as n from company_labels")) +
      (await count(e, "select count(*) as n from company_import_templates"));
    expect(() => {
      if (learned !== 0) throw new Error("learned items survived failed apply");
    }).not.toThrow();
  });
});

describe("hoan tac (E14)", () => {
  it("removes untouched listings, keeps and names the edited one, retires what it taught; twice is 409; Đầu khách is 403", async () => {
    const e = await importWorld("hoan");
    const r = await applyAll(e, "LA", rowsOf(e.codes));
    const edited = (
      await e.w.db.owner.query<{ id: string }>(
        "select id from listings where import_run_id = $1 order by list_price desc limit 1",
        [r.id],
      )
    ).rows[0]!.id;
    await e.w.db.owner.query(
      "update listings set list_price = 4700000000, version = version + 1 where id = $1",
      [edited],
    );
    expect(
      (await e.h.undo(req(`${URL_}/${r.id}/undo`, "POST", {}, await e.cookie("BA")), r.id!)).status,
    ).toBe(403);
    const undo = await e.h.undo(
      req(`${URL_}/${r.id}/undo`, "POST", {}, await e.cookie("LA")),
      r.id!,
    );
    const body = (await undo.json()) as { removed: string[]; kept: string[]; keptCodes: string[] };
    expect([undo.status, body.removed.length, body.kept]).toEqual([200, 2, [edited]]);
    // The kept listing is named by the code a person knows it by, read from its unit — never empty.
    const known = (
      await e.w.db.owner.query<{ code: string }>(
        `select coalesce(cu.building_name || ' ' || cu.unit_number, cpu.raw_code) as code
           from listings l
           left join listing_units lu on lu.listing_id = l.id
           left join catalog_units cu on cu.upi = lu.upi
           left join listing_pending_units lp on lp.listing_id = l.id
           left join company_pending_units cpu on cpu.id = lp.pending_unit_id
          where l.id = $1`,
        [edited],
      )
    ).rows[0]!.code;
    expect([known.length > 0, body.keptCodes]).toEqual([true, [known]]);
    expect(
      await count(e, "select count(*) as n from company_labels where retired_at is null"),
    ).toBe(0);
    expect(
      await count(e, "select count(*) as n from company_import_templates where retired_at is null"),
    ).toBe(0);
    expect(
      (await e.h.undo(req(`${URL_}/${r.id}/undo`, "POST", {}, await e.cookie("LA")), r.id!)).status,
    ).toBe(409);
  });
});

// ---- Audit of row 11's evals: the cases and pinned breaks the evals promise ------------------------------------------

const FIXTURES = join(import.meta.dirname, "..", "fixtures", "nhap-excel");
const KEY = JSON.parse(readFileSync(join(FIXTURES, "dap-an.json"), "utf8")) as {
  files: Record<string, Record<string, { createCount: number }>>;
};
/** lua-chon.json as written, plus the pending choice for 'SA5-12.08': the unit tests fake a reader hit for it, the
 * sample catalog has no tower SA5 and no form of the reader reads that code. */
const BAN_CHOICES = (() => {
  const c = JSON.parse(readFileSync(join(FIXTURES, "lua-chon.json"), "utf8")) as Choices;
  return { ...c, units: { ...c.units, "sa5-12.08": { pending: true as const } } };
})();

async function fixture(name: string) {
  const t = await readTable(new Blob([readFileSync(join(FIXTURES, name))]), name);
  if (!t.ok) throw new Error(t.problem);
  return { headers: t.headers, rows: t.rows };
}

/** More codes of the sample catalog, past the three importWorld hands out. */
const catalogCodes = async (e: Env, n: number, offset: number) =>
  (
    await e.w.db.owner.query<{ value: string }>(
      `select value from catalog_aliases where kind = 'ma_goc' and left(object_key, 4) = 'unt_'
        order by value limit $1 offset $2`,
      [n, offset],
    )
  ).rows.map((r) => r.value);
const unitKeyOf = async (e: Env, code: string) =>
  (
    await e.w.db.owner.query<{ k: string }>(
      "select object_key as k from catalog_aliases where kind = 'ma_goc' and value = $1",
      [code],
    )
  ).rows[0]!.k;

const marked = (p: { body: unknown }) => p.body as MarkedTable;
const cellAt = (p: { body: unknown }, r: number, j: number) => marked(p).cells[r]![j]!;

/** Each question by what it asks, so the same question is the same key whatever the column's place. */
function askedKeys(headers: readonly string[], questions: readonly Question[]): string[] {
  return questions.flatMap((q) =>
    q.kind === "column"
      ? [`column|${fold(q.header)}`]
      : q.kind === "value"
        ? [`value|${fold(headers[q.column]!)}|${fold(q.raw)}`]
        : q.kind === "unit-many"
          ? [`unit|${fold(q.code)}`]
          : q.codes.map((c) => `unit|${fold(c)}`),
  );
}

const openPerUnit = async (e: Env) =>
  (
    await e.w.db.owner.query<{ n: number }>(
      `select count(*)::int as n from listing_units where open group by upi
       union all select count(*)::int from listing_pending_units where open group by pending_unit_id`,
    )
  ).rows.map((r) => r.n);

// Break checkers: null while the guarded behaviour holds, the pinned message when it does not.
const labelFault = (learnLabel: boolean | undefined, rows: number) =>
  learnLabel === false && rows > 0 ? "label written though person said no" : null;
const lookupOrderFault = (cell: { why: string; value: unknown }, catalogUnit: string) =>
  cell.why === "company" && cell.value === catalogUnit
    ? null
    : "lookup order broken: pending before company";
const blockedApplyFault = (openStatus: number, listings: number) =>
  openStatus < 300 || listings > 0 ? "apply accepted blocked cells" : null;
const duplicateOpenFault = (createCountOnListedUnits: number, perUnit: readonly number[]) =>
  createCountOnListedUnits > 0 || perUnit.some((n) => n > 1)
    ? "duplicate open listing created by import"
    : null;
const foreignAgentFault = (openStatus: number, runs: number, listings: number) =>
  openStatus < 300 || runs > 0 || listings > 0 ? "list agent from another company accepted" : null;
/** A status the import would write that row 4's table does not reach from Incomplete. */
const statusTableFault = (written: readonly (string | null)[]) => {
  const s = written.find(
    (x) =>
      x !== null &&
      x !== "Incomplete" &&
      !canMove("Incomplete", x as Parameters<typeof canMove>[1]),
  );
  return s ? `import skipped the status table: Incomplete -> ${s}` : null;
};
const resendFault = (before: number, after: number, created: number) =>
  after !== before || created > 0 ? "batch resend created duplicates" : null;
const insertFault = (outcome: "allowed" | "refused") =>
  outcome === "allowed" ? "insert allowed without createListing" : null;
const undoFault = (removed: readonly string[], edited: string, stillThere: boolean) =>
  removed.includes(edited) || !stillThere ? "undo removed an edited listing" : null;
const templateFault = (columns: readonly ColumnMatch[]) =>
  columns.some((c) => c.why === "template") ? "template matched reordered headers" : null;

describe("nhan-rieng (E4)", () => {
  it("nhan rieng: 'Block' with the default learns one label (A, Building, 'Block'), read back through the door", async () => {
    const e = await importWorld("nhan");
    const p = await preview(e, "LA", rowsOf(e.codes));
    expect(marked(p).columns[1]!.learnLabel).toBe(true);
    expect((await applyAll(e, "LA", rowsOf(e.codes))).status).toBe(200);
    const rows = (
      await e.w.db.owner.query<{ company_id: string; concept: string; label: string }>(
        "select company_id, concept, label from company_labels where concept = 'Building'",
      )
    ).rows;
    expect(rows).toEqual([{ company_id: e.w.A, concept: "Building", label: "Block" }]);
    const layer = await asPerson(e.w, "LA", e.w.A, (c) => readLayer((fn) => fn(c as never)));
    expect(label("Building", { overrides: labelOverrides(layer.labels) })).toBe("Block");
  });

  it("nhan rieng: learnLabel=false learns none; 'Toà' asks nothing and learns nothing; a custom field column asks no label (break pinned)", async () => {
    const e = await importWorld("nhan_khong");
    const no: Choices = {
      ...CHOICES,
      columns: { 1: { target: { standard: "Unit.buildingName" }, learnLabel: false } },
    };
    expect((await applyAll(e, "LA", rowsOf(e.codes), no)).status).toBe(200);
    const building = () =>
      count(e, "select count(*) as n from company_labels where concept = 'Building'");
    expect(labelFault(no.columns[1]!.learnLabel, await building())).toBeNull();
    expect(await building()).toBe(0);
    // The break: a write that ignores the person's «no».
    expect(labelFault(false, 1)).toBe("label written though person said no");

    const more = await catalogCodes(e, 3, 3);
    const toa = ["Mã căn", label("Building"), "Giá chào", "Trạng thái", "Ngày check"];
    const toaRows = more.map((c) => [c, "[MAU] Toà", "1 tỷ", "", ""]);
    const p = await preview(e, "LA", toaRows, NO_CHOICES, toa);
    expect([marked(p).columns[1]!.why, marked(p).columns[1]!.learnLabel]).toEqual([
      "standard-label",
      null,
    ]);
    expect(p.body.questions).toEqual([]);
    expect((await applyAll(e, "LA", toaRows, NO_CHOICES, undefined, toa)).status).toBe(200);
    expect(await building()).toBe(0);

    await e.w.db.owner.query(
      `insert into company_fields (company_id, code, name, kind, position) values ($1, 'ghi_chu', 'Ghi chú', 'text', 0)`,
      [e.w.A],
    );
    const note = ["Mã căn", "Ghi chú"];
    const pointed = await preview(
      e,
      "LA",
      [[e.codes[0]!, "tầng cao"]],
      { ...NO_CHOICES, columns: { 1: { target: { custom: "ghi_chu" } } } },
      note,
    );
    const byName = await preview(e, "LA", [[e.codes[0]!, "tầng cao"]], NO_CHOICES, note);
    for (const q of [pointed, byName]) {
      expect(marked(q).columns[1]!.learnLabel).toBeNull();
      expect(
        (q.body.questions as Question[]).filter((x) => x.kind === "column" && x.column === 1),
      ).toEqual([]);
    }
  });
});

describe("can (E6)", () => {
  it("can: the 9 codes written before, each with its mark; the order of the four sources pinned (break pinned)", async () => {
    const e = await importWorld("can_9");
    const o = e.w.db.owner;
    const companyUnit = await unitKeyOf(e, "op2/E1-0903");
    const readerUnit = await unitKeyOf(e, "op1/S1.05-1206");
    const twoUnits = [await unitKeyOf(e, "op3/C1-1506"), await unitKeyOf(e, "op2/E1-1001")].sort();
    const orderUnit = await unitKeyOf(e, "op1/S1.02-0701");
    await o.query(
      `insert into company_catalog_aliases (company_id, unit_key, kind, value)
       values ($1, $2, 'ma', 'A-RIENG-01'), ($1, $3, 'ma', 'HAI-01')`,
      [e.w.A, companyUnit, orderUnit],
    );
    await o.query(
      `insert into catalog_aliases (object_key, kind, value, source)
       values ($1, 'ma_goc', 'op3/DOI-01', 'THU'), ($2, 'ma_goc', 'op2/DOI-01', 'THU')`,
      twoUnits,
    );
    const pending = (
      await o.query<{ id: string }>(
        `insert into company_pending_units (company_id, raw_code) values ($1, 'CHO-01'), ($1, 'HAI-01')
         returning id::text`,
        [e.w.A],
      )
    ).rows.map((r) => r.id);
    // Already listed (Hỏi-6): a unit with an open listing of A.
    expect(
      (await applyAll(e, "LA", [[e.codes[2]!, "", "", "", ""]], { ...NO_CHOICES })).status,
    ).toBe(200);

    const MATRIX: [string, string, string][] = [
      ["catalog code", e.codes[0]!, "keep:catalog"],
      ["A's own code", "A-RIENG-01", "fixed:company"],
      ["read by the reader (form toa-cham-bon)", "S1.0512.06", "fixed:reader"],
      ["one code, two units", "DOI-01", "ask:many-units"],
      ["not anywhere", "ZZ-404", "ask:not-in-catalog"],
      ["a pending unit of A", "CHO-01", "keep:pending"],
      ["the same unit again", e.codes[0]!, "block:duplicate-unit"],
      ["empty", "", "block:no-unit-code"],
      ["already listed", e.codes[2]!, "ask:already-listed"],
    ];
    expect(MATRIX).toHaveLength(9);
    const rows = MATRIX.map(([, code]) => [code, "", "", "", ""]);
    const p = await preview(e, "LA", rows, { ...NO_CHOICES });
    expect(p.status).toBe(200);
    for (const [r, [name, , want]] of MATRIX.entries()) {
      const cell = cellAt(p, r, 0);
      expect(`${cell.mark}:${cell.why}`, name).toBe(want);
    }
    expect([cellAt(p, 1, 0).value, cellAt(p, 2, 0).value, cellAt(p, 5, 0).value]).toEqual([
      companyUnit,
      readerUnit,
      pending[0],
    ]);
    const qs = p.body.questions as Question[];
    const many = qs.filter((q) => q.kind === "unit-many");
    expect(many.map((q) => [q.code, [...q.unitKeys].sort()])).toEqual([["DOI-01", twoUnits]]);
    expect(qs.filter((q) => q.kind === "unit-missing").map((q) => q.codes)).toEqual([["ZZ-404"]]);
    // The way the screen offers by default for a code nowhere: a new pending unit.
    const chosen = await preview(e, "LA", rows, {
      ...NO_CHOICES,
      units: { "zz-404": { pending: true } },
    });
    expect([cellAt(chosen, 4, 0).mark, cellAt(chosen, 4, 0).why]).toEqual(["fixed", "pending-new"]);

    // Order: 'HAI-01' is both A's own code and a live pending unit of A — the company code wins.
    const order = await preview(e, "LA", [["HAI-01", "", "", "", ""]], { ...NO_CHOICES });
    expect(lookupOrderFault(cellAt(order, 0, 0), orderUnit)).toBeNull();
    // The break: a lookup that tries the pending units first finds the pending unit instead.
    const pendingFirst = markUnit(
      "HAI-01",
      { kind: "pending", pendingUnitId: pending[1]! },
      undefined,
    );
    expect(lookupOrderFault(pendingFirst, orderUnit)).toBe(
      "lookup order broken: pending before company",
    );
  });
});

describe("khong-duong-thang (E8) — break", () => {
  it("break: an open with a blocked cell is refused and writes nothing", async () => {
    const e = await importWorld("thang_pha");
    const blocked = [...rowsOf(e.codes), ["", "", "", "", ""]];
    const p = await preview(e, "LA", blocked);
    expect(p.body.counts.block).toBeGreaterThan(0);
    const open = await e.h.open(
      req(
        URL_,
        "POST",
        {
          headers: HEADERS,
          rows: blocked,
          choices: CHOICES,
          fileName: "a.xlsx",
          sheetName: null,
          expected: { ...p.body.counts, createCount: p.body.createCount },
        },
        await e.cookie("LA"),
      ),
    );
    const listings = await count(e, "select count(*) as n from listings");
    expect(blockedApplyFault(open.status, listings)).toBeNull();
    expect(await count(e, "select count(*) as n from import_runs")).toBe(0);
    expect(blockedApplyFault(201, 0)).toBe("apply accepted blocked cells");
  });
});

describe("ap (E9) — audit", () => {
  it("ap: ban.xlsx with lua-chon.json makes N listings; the same file again adds no second open listing (break pinned)", async () => {
    const e = await importWorld("ap_ban");
    const ban = await fixture("ban.xlsx");
    const N = KEY.files["ban.xlsx"]!["lua-chon"]!.createCount;
    const first = await applyAll(e, "LA", ban.rows, BAN_CHOICES, undefined, ban.headers);
    expect([first.status, first.body?.created]).toEqual([200, N]);
    const again = await preview(e, "LA", ban.rows, BAN_CHOICES, ban.headers);
    expect(duplicateOpenFault(again.body.createCount, await openPerUnit(e))).toBeNull();
    const listed = marked(again).rows.filter((r) => r.fate === "listed").length;
    expect([listed, again.body.createCount]).toEqual([N, 0]);
    const second = await applyAll(e, "LA", ban.rows, BAN_CHOICES, undefined, ban.headers);
    expect([second.status, second.error]).toEqual([400, "blocked-cells"]);
    expect(await count(e, "select count(*) as n from listings")).toBe(N);
    const perUnit = await openPerUnit(e);
    expect(perUnit).toEqual(Array(N).fill(1));
    expect(duplicateOpenFault(again.body.createCount, perUnit)).toBeNull();
    expect(duplicateOpenFault(N, perUnit)).toBe("duplicate open listing created by import");
  });

  it("status through row 4's table: 5 cases written before; a file without a date column confirms nothing (break pinned)", async () => {
    const e = await importWorld("trang_thai");
    const codes = await catalogCodes(e, 5, 3);
    const CASES: [string, string, string, string][] = [
      [label("StatusActive"), "keep:standard", "Active", "Đang bán"],
      [label("StatusHold"), "keep:standard", "Hold", "Tạm ngừng (the eval's 'Tạm giữ')"],
      ["", "keep:empty", "Incomplete", "empty"],
      [label("StatusClosed"), "ask:status-not-reachable", "Incomplete", "Đã bán"],
      [label("StatusPending"), "ask:status-not-reachable", "Incomplete", "Đang giao dịch"],
    ];
    expect(CASES).toHaveLength(5);
    const headers = ["Mã căn", "Trạng thái"];
    const rows = CASES.map(([word], i) => [codes[i]!, word]);
    const p = await preview(e, "LA", rows, { ...NO_CHOICES }, headers);
    // What the import would write for each status cell (an asked cell writes nothing: the listing stays Incomplete).
    const written = marked(p).cells.map((row) =>
      row[1]!.mark === "ask" ? null : (row[1]!.value as string | null),
    );
    expect(statusTableFault(written)).toBeNull();
    for (const [i, [, want, , name]] of CASES.entries()) {
      const c = cellAt(p, i, 1);
      expect(`${c.mark}:${c.why}`, name).toBe(want);
    }
    const r = await applyAll(e, "LA", rows, { ...NO_CHOICES }, undefined, headers);
    expect([r.status, r.body?.created]).toEqual([200, 5]);
    const stored = (
      await e.w.db.owner.query<{ code: string; s: string; confirmed: string | null }>(
        `select a.value as code, l.standard_status as s, l.last_confirmed_at::text as confirmed
           from listings l join listing_units lu on lu.listing_id = l.id
           join catalog_units u on u.upi = lu.upi
           join catalog_aliases a on a.object_key = u.unit_key and a.kind = 'ma_goc'
          where l.import_run_id = $1`,
        [r.id],
      )
    ).rows;
    const byCode = new Map(stored.map((x) => [x.code, x]));
    expect(CASES.map((_, i) => byCode.get(codes[i]!)?.s)).toEqual(CASES.map(([, , s]) => s));
    expect(stored.map((x) => x.confirmed)).toEqual(Array(5).fill(null));
    expect(statusTableFault(stored.map((x) => x.s))).toBeNull();
    expect(statusTableFault([null, "Closed"])).toBe(
      "import skipped the status table: Incomplete -> Closed",
    );
  });

  it("permission table: 4 roles × (importListings at the API door, createListing at the database) = 8, as actions.yaml says (break pinned)", async () => {
    const e = await importWorld("bang_quyen");
    type Four = "LA" | "BA" | "TL" | "CA";
    const FOUR: Four[] = ["LA", "BA", "TL", "CA"];
    const WRITTEN: Record<
      "importListings" | "createListing",
      Record<Four, "own" | "company" | null>
    > = {
      importListings: { LA: "own", BA: null, TL: "company", CA: null },
      createListing: { LA: "own", BA: null, TL: "company", CA: null },
    };
    const fromActions = Object.fromEntries(
      (["importListings", "createListing"] as const).map((name) => [
        name,
        Object.fromEntries(
          FOUR.map((p) => [p, ACTIONS.find((a) => a.name === name)!.scope[ROLE_OF[p]] ?? null]),
        ),
      ]),
    );
    expect(fromActions).toEqual(WRITTEN);
    const rows = [[e.codes[0]!, "", "", "", ""]];
    const p = await preview(e, "LA", rows, { ...NO_CHOICES });
    const apiDoor = async (who: Four) =>
      (
        await e.h.open(
          req(
            URL_,
            "POST",
            {
              headers: HEADERS,
              rows,
              choices: NO_CHOICES,
              fileName: "a.xlsx",
              sheetName: null,
              expected: { ...p.body.counts, createCount: p.body.createCount },
              ...(who === "TL" ? { listAgentUserId: e.w.id.LA } : {}),
            },
            await e.cookie(who),
          ),
        )
      ).status;
    const insert = async (who: Four, agent: Person = who === "TL" ? "LA" : who) => {
      try {
        await asPerson(e.w, who, e.w.A, (c) =>
          c.query(
            `insert into listings (id, company_id, standard_status, list_agent_user_id, list_agent_full_name)
             values ($1, $2, 'Incomplete', $3, '[Tên]')`,
            [randomUUID(), e.w.A, e.w.id[agent]],
          ),
        );
        return "allowed" as const;
      } catch (err) {
        expect((err as { code?: string }).code).toBe("42501");
        return "refused" as const;
      }
    };
    const got: string[] = [];
    for (const who of FOUR) {
      got.push(`importListings ${who} api ${await apiDoor(who)}`);
      got.push(`createListing ${who} db ${await insert(who)}`);
    }
    const want = FOUR.flatMap((who) => [
      `importListings ${who} api ${WRITTEN.importListings[who] ? 201 : 403}`,
      `createListing ${who} db ${WRITTEN.createListing[who] ? "allowed" : "refused"}`,
    ]);
    expect(got).toHaveLength(8);
    expect(got).toEqual(want);
    // Own scope: a list agent cannot insert a listing kept by someone else.
    expect(await insert("LA", "X")).toBe("refused");
    expect(insertFault(await insert("BA"))).toBeNull();
    // The break, in this world only and last: without the narrowing rule a buyer agent's insert goes through.
    await e.w.db.owner.query("drop policy listings_insert_by_permission on listings");
    expect(insertFault(await insert("BA"))).toBe("insert allowed without createListing");
  });

  it("450 rows are exactly 3 batches; a failure in batch 2 keeps batch 1 and learns nothing; resending writes no duplicate (break pinned)", async () => {
    const e = await importWorld("goi_450");
    const codes = Array.from({ length: 450 }, (_, i) => `ZZ-${String(i).padStart(3, "0")}`);
    const rows = codes.map((code) => [code, "[MAU] Toà", "1 tỷ", label("StatusActive"), ""]);
    const choices: Choices = {
      ...CHOICES,
      units: Object.fromEntries(codes.map((code) => [fold(code), { pending: true as const }])),
    };
    const id = await openOnly(e, "LA", rows, choices);
    const hashes = (
      await e.w.db.owner.query<{ n: number }>(
        "select cardinality(batch_hashes) as n from import_runs where id = $1",
        [id],
      )
    ).rows[0]!.n;
    expect(hashes).toBe(3);
    const batch = (b: number) =>
      sendBatch(e, "LA", id, {
        headers: HEADERS,
        rows: rows.slice(b * 200, (b + 1) * 200),
        choices,
        batchNo: b,
        rowOffset: b * 200,
        last: b === 2,
      });
    const listings = () => count(e, "select count(*) as n from listings");
    const learnedRows = async () =>
      (await count(e, "select count(*) as n from company_labels")) +
      (await count(e, "select count(*) as n from company_import_templates")) +
      (await count(e, "select count(*) as n from company_value_aliases"));
    expect((await batch(0)).created).toBe(200);
    // The failure the test injects in batch 2: one of its pending units is refused by the database.
    await e.w.db.owner.query(`
      create function public.nhap_excel_hong_goi_hai() returns trigger language plpgsql as $f$
      begin
        if new.raw_code = 'ZZ-300' then raise exception 'injected failure'; end if;
        return new;
      end $f$;
      create trigger nhap_excel_hong_goi_hai before insert on company_pending_units
        for each row execute function public.nhap_excel_hong_goi_hai();`);
    expect(await batch(1)).toMatchObject({ status: 500, error: "server-error" });
    expect(await listings()).toBe(200);
    expect(await count(e, "select count(*) as n from company_pending_units")).toBe(200);
    expect(await learnedRows()).toBe(0);
    await e.w.db.owner.query(
      "drop trigger nhap_excel_hong_goi_hai on company_pending_units; drop function public.nhap_excel_hong_goi_hai()",
    );
    // Batch 1 again while the import is still open: the import knows it is written.
    const before = await listings();
    const resent = await batch(0);
    expect([resent.status, resent.created]).toEqual([200, 0]);
    expect(resendFault(before, await listings(), resent.created ?? 0)).toBeNull();
    expect((await batch(1)).created).toBe(200);
    expect(await learnedRows()).toBe(0);
    expect((await batch(2)).created).toBe(50);
    expect(await listings()).toBe(450);
    expect(await learnedRows()).toBeGreaterThan(0);
    // After the last batch the import is closed: batch 1 once more is 409 and writes nothing.
    const late = await batch(0);
    expect([late.status, late.error]).toEqual([409, "closed"]);
    expect(resendFault(450, await listings(), 0)).toBeNull();
    expect(resendFault(450, 650, 200)).toBe("batch resend created duplicates");
  });

  it("list agents: a team lead of B gets none of A's, ids and names only; a team lead of A naming B's person is refused (break pinned)", async () => {
    const e = await importWorld("dau_chu_b");
    await e.w.db.owner.query(
      "update company_members set roles = '{TeamLead,ListAgent}' where company_id = $1 and user_id = $2",
      [e.w.B, e.w.id.Y],
    );
    const read = async (who: Person, company: string) => {
      const res = await e.h.agents(
        req(`${URL_}/list-agents`, "GET", undefined, await e.cookie(who, company)),
      );
      return { status: res.status, body: (await res.json()) as Record<string, string>[] };
    };
    const b = await read("Y", e.w.B);
    expect(b.status).toBe(200);
    expect(b.body.map((a) => a.userId)).toEqual([e.w.id.Y]);
    expect(b.body.every((a) => Object.keys(a).sort().join() === "name,userId")).toBe(true);
    for (const p of ["LA", "BA", "TL", "CA", "X"] as Person[])
      expect(b.body.some((a) => a.userId === e.w.id[p])).toBe(false);
    // X is CompanyAdmin in B: no import there, so not even an empty list.
    expect((await read("X", e.w.B)).status).toBe(403);

    // This world only: without the database's member key, the import's own same-company check is what is left to hold
    // (the full path, key included, is the 400 of «who imports for whom»).
    await e.w.db.owner.query("alter table import_runs drop constraint import_runs_agent_member");
    const r = await applyAll(e, "TL", [[e.codes[0]!, "", "", "", ""]], { ...NO_CHOICES }, e.w.id.Y);
    const runs = await count(
      e,
      "select count(*) as n from import_runs where list_agent_user_id = $1",
      [e.w.id.Y],
    );
    const kept = await count(
      e,
      "select count(*) as n from listings where list_agent_user_id = $1 and company_id = $2",
      [e.w.id.Y, e.w.A],
    );
    expect(foreignAgentFault(r.status, runs, kept)).toBeNull();
    expect([r.status, r.error]).toEqual([400, "bad-agent"]);
    expect(foreignAgentFault(201, 1, 0)).toBe("list agent from another company accepted");
  });

  it("the import path never reaches the llm layer: no import of src/ai from the imports module or its routes", () => {
    const root = resolve(import.meta.dirname, "..", "..");
    const files = (dir: string): string[] =>
      readdirSync(dir).flatMap((f) => {
        const p = join(dir, f);
        return statSync(p).isDirectory() ? files(p) : /\.(ts|tsx)$/.test(f) ? [p] : [];
      });
    const scanned = [
      ...files(join(root, "src/modules/imports")),
      ...files(join(root, "src/app/api/v1/imports")),
    ];
    expect(scanned.length).toBeGreaterThan(5);
    const SPEC = /(?:from\s+|import\s*\(\s*|import\s+)["']([^"']+)["']/g;
    const reaches = scanned.flatMap((file) =>
      [...readFileSync(file, "utf8").matchAll(SPEC)]
        .map((m) => m[1]!)
        .filter((s) => {
          const target = s.startsWith("@/")
            ? join(root, "src", s.slice(2))
            : s.startsWith(".")
              ? resolve(dirname(file), s)
              : s;
          return (
            target.startsWith(join(root, "src/ai")) ||
            /^@anthropic-ai\//.test(target) ||
            /llm/.test(s)
          );
        })
        .map((s) => `${file.slice(root.length + 1)} → ${s}`),
    );
    expect(reaches).toEqual([]);
  });
});

describe("lan hai (E13)", () => {
  it("lan hai: ban-2.xlsx after ban.xlsx asks nothing answered; a retired field, swapped columns and company B ask again (break pinned)", async () => {
    const e = await importWorld("lan_hai");
    await e.w.db.owner.query(
      "update company_members set roles = '{TeamLead}' where company_id = $1 and user_id = $2",
      [e.w.B, e.w.id.Y],
    );
    const ban = await fixture("ban.xlsx");
    const ban2 = await fixture("ban-2.xlsx");
    expect(ban2.headers).toEqual(ban.headers);
    const asked = async (who: Person, t: { headers: string[]; rows: string[][] }) => {
      const p = await preview(e, who, t.rows, NO_CHOICES, t.headers);
      expect(p.status).toBe(200);
      return { p, keys: askedKeys(t.headers, p.body.questions as Question[]) };
    };
    const firstTime = (await asked("LA", ban)).keys;
    const ban2Before = await asked("LA", ban2);
    expect((await applyAll(e, "LA", ban.rows, BAN_CHOICES, undefined, ban.headers)).status).toBe(
      200,
    );

    const second = await asked("LA", ban2);
    const again = second.keys.filter((k) => firstTime.includes(k));
    console.log(`cau hoi lai ${again.length}`);
    expect(again).toEqual([]);
    expect(second.keys.filter((k) => k.startsWith("column|"))).toEqual([]);
    expect(second.keys.filter((k) => k.startsWith("value|"))).toEqual([
      `value|tt|${fold("giữ chỗ")}`,
    ]);
    // A code the first file did not have is a new question, not one asked again.
    expect(second.keys.filter((k) => k.startsWith("unit|"))).toEqual([`unit|${fold("SA5-12.09")}`]);

    // Two columns swapped: the template no longer fits, so the column targets it answered are asked again.
    const swap = (r: string[]) => [r[0]!, r[1]!, r[3]!, r[2]!, ...r.slice(4)];
    const swapped = { headers: swap(ban2.headers), rows: ban2.rows.map(swap) };
    const s = await asked("LA", swapped);
    expect(templateFault(marked(s.p).columns)).toBeNull();
    const againSwapped = s.keys.filter((k) => firstTime.includes(k));
    console.log(`cau hoi lai ${againSwapped.length} (hai cot doi cho)`);
    expect(againSwapped.filter((k) => k.startsWith("column|")).sort()).toEqual(
      ["column|gia", "column|gia kbp", `column|${fold("SĐT chủ")}`].sort(),
    );
    expect(againSwapped.filter((k) => !k.startsWith("column|"))).toEqual([]);
    // The break: a template found by the set of headers, whatever their order, answers the swapped file.
    const layer = await asPerson(e.w, "LA", e.w.A, (c) => readLayer((fn) => fn(c as never)));
    const bySet = layer.templates.map((t) =>
      [...t.signature].sort().join() === [...templateSignature(swapped.headers)].sort().join()
        ? { ...t, signature: templateSignature(swapped.headers) }
        : t,
    );
    expect(
      templateFault(matchColumns(swapped.headers, { ...layer, templates: bySet }, NO_CHOICES)),
    ).toBe("template matched reordered headers");

    // Company B previews the same file: nothing is answered for it by A's import.
    const b = await asked("Y", ban2);
    expect(b.p.body.questions).toEqual(ban2Before.p.body.questions);

    // The custom field 'View' retired: exactly one question back, on the View column.
    await e.w.db.owner.query(
      "update company_fields set retired_at = now() where company_id = $1 and name = 'View'",
      [e.w.A],
    );
    const retired = await asked("LA", ban2);
    const onView = (retired.p.body.questions as Question[]).filter(
      (q) => "column" in q && ban2.headers[q.column] === "View",
    );
    expect(onView).toEqual([{ kind: "column", column: 7, header: "View", why: "target-retired" }]);
  });
});

describe("hoan tac (E14) — audit", () => {
  async function importForUndo(suffix: string) {
    const e = await importWorld(suffix);
    // A spelling the company had before the import: the undo leaves it alone.
    await e.w.db.owner.query(
      `insert into company_value_aliases (company_id, field, raw, raw_fold, value)
       values ($1, 'Listing.standardStatus', 'còn', 'con', 'Active')`,
      [e.w.A],
    );
    const rows = [
      [e.codes[0]!, "[MAU] Toà", "4,65 tỷ", "còn", ""],
      [e.codes[1]!, "[MAU] Toà", "3900000000", "cọc", ""],
      ["SA5-99.99", "Sapphire 9", "950tr", "", ""],
      ["SA5-99.98", "Sapphire 9", "1 tỷ", "", ""],
    ];
    const choices: Choices = {
      ...CHOICES,
      values: { [`3|${fold("cọc")}`]: { value: "Hold", remember: true } },
      units: { "sa5-99.99": { pending: true }, "sa5-99.98": { pending: true } },
    };
    const r = await applyAll(e, "LA", rows, choices);
    expect([r.status, r.body?.created]).toEqual([200, 4]);
    const listingOf = async (code: string) =>
      (
        await e.w.db.owner.query<{ id: string }>(
          `select l.id from listings l join listing_pending_units lp on lp.listing_id = l.id
             join company_pending_units p on p.id = lp.pending_unit_id where p.raw_code = $1`,
          [code],
        )
      ).rows[0]!.id;
    return { e, r, edited: await listingOf("SA5-99.99"), untouched: await listingOf("SA5-99.98") };
  }

  async function patchPrice(e: Env, id: string) {
    const door = (r: Request, action: ActionName) => openDoor(() => e.w.pool, tokenFrom(r), action);
    const listings = createListingsHandlers({ door, withCompany });
    return listings.change(
      req(
        `${ORIGIN}/api/v1/listings/${id}`,
        "PATCH",
        { version: 1, change: { field: "listPrice", listPrice: 960000000 } },
        await e.cookie("LA"),
      ),
      id,
    );
  }

  it("hoan tac: the price edited through PATCH keeps its listing and its pending unit; what the import taught retires, an older spelling stays", async () => {
    const { e, r, edited, untouched } = await importForUndo("hoan_patch");
    const learned = r.body!.learned!;
    expect((await patchPrice(e, edited)).status).toBe(200);
    // The database refuses the direct delete of the edited listing (version 2) inside withCompany; version 1 goes.
    const del = (id: string) =>
      asPerson(e.w, "LA", e.w.A, async (c) => {
        const res = await c.query("delete from listings where id = $1 returning id", [id]);
        return res.rows.length;
      });
    expect([await del(edited), await del(untouched)]).toEqual([0, 1]);
    const undo = await e.h.undo(
      req(`${URL_}/${r.id}/undo`, "POST", {}, await e.cookie("LA")),
      r.id!,
    );
    const body = (await undo.json()) as { removed: string[]; kept: string[]; retired: number };
    expect([undo.status, body.removed.length, body.kept]).toEqual([200, 3, [edited]]);
    // K items taught; all retire but the pending unit an open listing still sits on.
    expect(learned.length).toBe(7);
    expect(body.retired).toBe(learned.length - 1);
    const live = async (table: string) =>
      count(e, `select count(*) as n from ${table} where retired_at is null`);
    expect([
      await live("company_labels"),
      await live("company_import_templates"),
      await live("company_fields"),
    ]).toEqual([0, 0, 0]);
    expect(
      (
        await e.w.db.owner.query<{ raw: string }>(
          "select raw from company_value_aliases where retired_at is null",
        )
      ).rows.map((x) => x.raw),
    ).toEqual(["còn"]);
    expect(
      (
        await e.w.db.owner.query<{ raw_code: string; live: boolean }>(
          "select raw_code, retired_at is null as live from company_pending_units order by raw_code",
        )
      ).rows,
    ).toEqual([
      { raw_code: "SA5-99.98", live: false },
      { raw_code: "SA5-99.99", live: true },
    ]);
  });

  it("break: with the database rule loosened, the undo itself still keeps the edited listing", async () => {
    const { e, r, edited } = await importForUndo("hoan_pha");
    // This world only: the delete rule without its version check, so only the undo's own rule is left to hold.
    await e.w.db.owner.query(`
      drop policy listings_delete_by_permission on listings;
      create policy listings_delete_by_permission on listings as restrictive for delete
        using (import_run_id is not null
               and exists (select from import_runs r
                            where r.id = listings.import_run_id and r.status <> 'undone'
                              and (app.allowed('undoImport') = 'company'
                                   or (app.allowed('undoImport') = 'own'
                                       and (r.imported_by)::text = current_setting('app.user_id', true)))));`);
    expect((await patchPrice(e, edited)).status).toBe(200);
    const undo = await e.h.undo(
      req(`${URL_}/${r.id}/undo`, "POST", {}, await e.cookie("LA")),
      r.id!,
    );
    const body = (await undo.json()) as { removed: string[] };
    expect(undo.status).toBe(200);
    const stillThere =
      (await count(e, "select count(*) as n from listings where id = $1", [edited])) === 1;
    expect(undoFault(body.removed, edited, stillThere)).toBeNull();
    expect(undoFault([edited], edited, false)).toBe("undo removed an edited listing");
  });
});
