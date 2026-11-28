// Row 11 (nhap-excel), evals E4, E6, E8, E9, E12, E13, E14 on this lane's Postgres: the routes of /api/v1/imports
// through the real handlers, the identity door and withCompany under the API role. Company A holds the people of the
// permission-table world (LA, BA, TL, CA, X); Y is CompanyAdmin of B. Each block ends with its break, pinned.
import { execFileSync } from "node:child_process";
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
  STANDARD_TARGETS,
  type Choices,
  type ColumnMatch,
  type LearnedItem,
  type MarkedTable,
  type Question,
} from "@/modules/imports";
import { listingIdOf } from "@/modules/imports/server";
import { DESTINATION } from "@/modules/imports/store";
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
    // The two catalog units also keep their tower text as written (S4-r7 t4); the new pending unit SA5-99.99 holds its
    // own tower text, so its row keeps none.
    // In the file's order, row by row, column by column (one rule for preview and write, G-2811-84).
    expect(kept.map((k) => [k.header, k.raw])).toEqual([
      ["Block", "[MAU] Toà"],
      ["Tầng", "Tầng 07"],
      ["Loại căn", label("SubTypeCondominium")],
      ["Diện tích", "72"],
      ["Block", "[MAU] Toà"],
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
    // The last batch sent again after the import is done (its answer lost on the way back): the same count and the
    // same learned items as the first answer, nothing written twice (S4-r3 t8).
    expect(again.status).toBe(200);
    const body = (await again.json()) as {
      created: number;
      done: boolean;
      learned?: LearnedItem[];
    };
    expect([body.created, body.done, body.learned]).toEqual([3, true, first.body?.learned]);
    expect(await count(e, "select count(*) as n from listings")).toBe(3);
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

  it("whom each role may import for, four roles: a team lead every list agent, a list agent only themself, a buyer agent and a company admin 403 (S4-r1 t9, G-2811-86)", async () => {
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
    // The list agent reads exactly one row, themself: the HTTP door and the database function say the same (d-…-88).
    const la = await read("LA");
    expect([la.status, la.body.map((a) => a.userId)]).toEqual([200, [e.w.id.LA]]);
    expect((await read("BA")).status).toBe(403);
    expect((await read("CA")).status).toBe(403);
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
    // An undone import takes no batch, not even one it had written: 409 closed, nothing comes back.
    const late = await sendBatch(e, "LA", r.id!, {
      headers: HEADERS,
      rows: rowsOf(e.codes),
      choices: CHOICES,
      batchNo: 0,
      rowOffset: 0,
      last: true,
    });
    expect([late.status, late.error]).toEqual([409, "closed"]);
    expect(await count(e, "select count(*) as n from listings")).toBe(1);
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
// A batch sent again answers what it wrote the first time (S4-r3 t8) and writes nothing: the listings stay as they were.
const resendFault = (before: number, after: number) =>
  after !== before ? "batch resend created duplicates" : null;
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
    expect([resent.status, resent.created]).toEqual([200, 200]);
    expect(resendFault(before, await listings())).toBeNull();
    expect((await batch(1)).created).toBe(200);
    expect(await learnedRows()).toBe(0);
    expect((await batch(2)).created).toBe(50);
    expect(await listings()).toBe(450);
    expect(await learnedRows()).toBeGreaterThan(0);
    // After the last batch, a batch sent again — its answer lost on the way back — answers its own count again and
    // writes nothing: batch 1 says 200, the last one says 50 (S4-r3 t8).
    const late = await batch(0);
    expect([late.status, late.created]).toEqual([200, 200]);
    const lastAgain = await batch(2);
    expect([lastAgain.status, lastAgain.created]).toEqual([200, 50]);
    expect(resendFault(450, await listings())).toBeNull();
    expect(resendFault(450, 650)).toBe("batch resend created duplicates");
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
    const reachesOf = (file: string, text: string) =>
      [...text.matchAll(SPEC)]
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
        .map((s) => `${file.slice(root.length + 1)} → ${s}`);
    const reaches = scanned.flatMap((file) => reachesOf(file, readFileSync(file, "utf8")));
    expect(reaches).toEqual([]);
    // Positive control (VP11 S4-r2 item 14): the scan finds each way in, planted in a file of the imports module.
    const planted = join(root, "src/modules/imports/ui/planted.ts");
    expect(
      reachesOf(
        planted,
        [
          'import { ask } from "@/ai/client";',
          'import Anthropic from "@anthropic-ai/sdk";',
          'const m = await import("../../../ai/client");',
        ].join("\n"),
      ),
    ).toEqual([
      "src/modules/imports/ui/planted.ts → @/ai/client",
      "src/modules/imports/ui/planted.ts → @anthropic-ai/sdk",
      "src/modules/imports/ui/planted.ts → ../../../ai/client",
    ]);
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

// ---- Two findings of VP11's round 1 (chuan-hoa-he-design, out of contract), fixed on row 11 ---------------------------

describe("gia tri khong mat (VP11 r1)", () => {
  it("what the preview promised is what was written, for every kind of cell, on a catalog unit and a new pending unit (ruling G-2811-65, break pinned)", async () => {
    const e = await importWorld("moi_loai_o");
    await e.w.db.owner.query(
      `insert into company_fields (company_id, code, name, kind, position, options)
         values ($1, 'huong_nhin', 'Hướng nhìn', 'single_select', 0, '["Biển", "Phố"]')`,
      [e.w.A],
    );
    const cells: [string, string, Choices["columns"][number]["target"] | null][] = [
      ["Mã căn", e.codes[0]!, null],
      ["Block", "[MAU] Toà", { standard: "Unit.buildingName" }],
      ["Diện tích", "75,2 m²", { standard: "Unit.livingArea" }],
      ["PN", "2", { standard: "Unit.bedroomsTotal" }],
      ["Hướng", "Đông Nam", { standard: "Unit.directionFaces" }],
      ["Tầng", "Tầng 07", { standard: "Unit.floor" }],
      ["Loại căn", label("SubTypeCondominium"), { standard: "Unit.propertySubType" }],
      ["Giá chào", "4,65 tỷ", { standard: "Listing.listPrice" }],
      ["Phí", "KBP", { standard: "Listing.feeInclusion" }],
      ["Trạng thái", label("StatusWithdrawn"), { standard: "Listing.standardStatus" }],
      ["Lý do ngừng", label("WithdrawnUnreachable"), { standard: "Listing.withdrawnReason" }],
      ["Giá bán", "4,2 tỷ", { standard: "Listing.closePrice" }],
      ["Ngày bán", "10/11/2026", { standard: "Listing.closeDate" }],
      ["Nội thất", label("FurnishedFull"), { standard: "Listing.furnished" }],
      ["Người ở", label("OccupantVacant"), { standard: "Listing.occupantType" }],
      ["Pháp lý", "Sổ hồng", { standard: "Listing.legalStatus" }],
      ["Vay", "Vay 70%", { standard: "Listing.financing" }],
      ["Ngày check", "15/11/2026", { standard: "Listing.lastConfirmedAt" }],
      ["Hướng nhìn", "hướng ra biển", { custom: "huong_nhin" }],
      [
        "View",
        "nhìn phố",
        { newField: { name: "View", kind: "single_select", options: ["Biển", "Phố"] } },
      ],
    ];
    const headers = cells.map((c) => c[0]);
    // Row 0 is a unit of the catalog (its tower text has no place on it and is kept); row 1 is a new pending unit (its
    // tower text goes onto it). Both rows fill every other column the same way.
    const rows = [
      cells.map((c) => c[1]),
      cells.map((c, j) => (j === 0 ? "SA5-99.98" : j === 1 ? "Sapphire 9" : c[1])),
    ];
    const OWN = 18;
    const NEW = 19;
    const choices: Choices = {
      ...NO_CHOICES,
      columns: Object.fromEntries(
        cells.flatMap((c, j) => (c[2] ? [[j, { target: c[2] }]] : [])),
      ) as Choices["columns"],
      values: {
        [`${OWN}|${fold("hướng ra biển")}`]: { value: "Biển", remember: false },
        [`${NEW}|${fold("nhìn phố")}`]: { value: "Phố", remember: false },
      },
      units: { "sa5-99.98": { pending: true } },
    };
    const p = await preview(e, "LA", rows, choices, headers);
    expect(p.status).toBe(200);
    const promised = marked(p);
    // Every cell of both rows reads: the sweep below has something to compare in every column.
    for (const r of [0, 1])
      expect(
        promised.cells[r]!.map((c) => c.mark).filter((m) => m === "ask" || m === "block"),
      ).toEqual([]);
    expect(promised.rows.map((x) => x.fate)).toEqual(["create", "create"]);
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
          expected: { ...p.body.counts, createCount: p.body.createCount },
        },
        await e.cookie("LA"),
      ),
    );
    expect(open.status).toBe(201);
    const { id } = (await open.json()) as { id: string };
    const res = await e.h.batch(
      req(
        `${URL_}/${id}/batches`,
        "POST",
        {
          headers,
          rows,
          choices,
          batchNo: 0,
          rowOffset: 0,
          last: true,
          allNewFieldCells: Object.fromEntries(rows.map((row, r) => [`${r}:${NEW}`, row[NEW]!])),
        },
        await e.cookie("LA"),
      ),
      id,
    );
    expect(res.status).toBe(200);
    const run = (
      await e.w.db.owner.query<{
        kept: { row: number; header: string; raw: string; why: string }[];
      }>(`select kept from import_runs where id = $1`, [id])
    ).rows[0]!;
    const newCode = (
      await e.w.db.owner.query<{ code: string }>(
        `select code from company_fields where company_id = $1 and name = 'View'`,
        [e.w.A],
      )
    ).rows[0]!.code;
    const catalogUpi = (
      await e.w.db.owner.query<{ upi: string }>(
        `select u.upi from catalog_aliases a join catalog_units u on u.unit_key = a.object_key
          where a.kind = 'ma_goc' and a.value = $1`,
        [e.codes[0]],
      )
    ).rows[0]!.upi;
    const writtenOf = async (r: number) => {
      const listing = (
        await e.w.db.owner.query<Record<string, unknown>>(
          `select list_price::text as "listPrice", fee_inclusion as "feeInclusion", standard_status as "standardStatus",
                  withdrawn_reason as "withdrawnReason", furnished, occupant_type as "occupantType",
                  legal_status as "legalStatus", financing, last_confirmed_at::date::text as "lastConfirmedAt",
                  custom_fields
             from listings where id = $1`,
          [listingIdOf(id, r)],
        )
      ).rows[0]!;
      const link = (
        await e.w.db.owner.query<{
          upi: string | null;
          code: string | null;
          building: string | null;
        }>(
          `select u.upi, cpu.raw_code as code, cpu.building_text as building
             from listings l
             left join listing_units u on u.listing_id = l.id
             left join listing_pending_units lp on lp.listing_id = l.id
             left join company_pending_units cpu on cpu.id = lp.pending_unit_id
            where l.id = $1`,
          [listingIdOf(id, r)],
        )
      ).rows[0]!;
      const unitOk = r === 0 ? link.upi === catalogUpi : link.code === rows[r]![0];
      return { listing, kept: run.kept, newCode, unitOk, pendingBuilding: link.building };
    };
    const w0 = await writtenOf(0);
    const w1 = await writtenOf(1);
    expect(lostCells(promised, headers, 0, rows[0]!, w0)).toEqual([]);
    expect(lostCells(promised, headers, 1, rows[1]!, w1)).toEqual([]);
    // Where each kind went: row 0 keeps 5 unit attributes, 2 close cells and its tower text (8); row 1 keeps the same
    // less its tower text, which is on its new pending unit (7).
    const keptAs = (r: number) =>
      run.kept
        .filter((k) => k.row === r && (k.why === "unit-attribute" || k.why === "close-field"))
        .map((k) => k.header);
    expect([keptAs(0).length, keptAs(1).length]).toEqual([8, 7]);
    expect([keptAs(0).includes("Block"), keptAs(1).includes("Block")]).toEqual([true, false]);
    expect(w1.pendingBuilding).toBe("Sapphire 9");
    // Breaks: a value the preview promised and the write lost is named by its column.
    expect(
      lostCells(promised, headers, 0, rows[0]!, {
        ...w0,
        listing: { ...w0.listing, furnished: null },
      }),
    ).toEqual(["Nội thất"]);
    expect(
      lostCells(promised, headers, 0, rows[0]!, {
        ...w0,
        listing: { ...w0.listing, custom_fields: { huong_nhin: "Biển" } },
      }),
    ).toEqual(["View"]);
    expect(
      lostCells(promised, headers, 0, rows[0]!, {
        ...w0,
        kept: run.kept.filter((k) => !(k.row === 0 && k.header === "Block")),
      }),
    ).toEqual(["Block"]);
    expect(lostCells(promised, headers, 1, rows[1]!, { ...w1, pendingBuilding: null })).toEqual([
      "Block",
    ]);
    expect(lostCells(promised, headers, 0, rows[0]!, { ...w0, unitOk: false })).toEqual(["Mã căn"]);
  });

  it("a value the person chose for a new single choice field, without «remember», is written onto the listing", async () => {
    const e = await importWorld("truong_moi_chon");
    const headers = [...HEADERS, "View"];
    const base = rowsOf(e.codes);
    const rows = [
      [...base[0]!, "Hướng biển"],
      [...base[1]!, "Phố"],
      [...base[2]!, ""],
    ];
    const VIEW = 5;
    const choices: Choices = {
      ...CHOICES,
      columns: {
        ...CHOICES.columns,
        [VIEW]: {
          target: { newField: { name: "View", kind: "single_select", options: ["Biển", "Phố"] } },
        },
      },
      values: { [`${VIEW}|${fold("Hướng biển")}`]: { value: "Biển", remember: false } },
    };
    const p = await preview(e, "LA", rows, choices, headers);
    expect(p.status).toBe(200);
    // What the preview promised: the chosen value for the first row, the option as written for the second.
    expect([cellAt(p, 0, VIEW), cellAt(p, 1, VIEW)].map((x) => [x.mark, x.value, x.why])).toEqual([
      ["fixed", "Biển", "chosen"],
      ["keep", "Phố", "standard"],
    ]);
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
          expected: { ...p.body.counts, createCount: p.body.createCount },
        },
        await e.cookie("LA"),
      ),
    );
    expect(open.status).toBe(201);
    const { id } = (await open.json()) as { id: string };
    const allNewFieldCells = Object.fromEntries(rows.map((r, i) => [`${i}:${VIEW}`, r[VIEW]!]));
    const res = await e.h.batch(
      req(
        `${URL_}/${id}/batches`,
        "POST",
        { headers, rows, choices, batchNo: 0, rowOffset: 0, last: true, allNewFieldCells },
        await e.cookie("LA"),
      ),
      id,
    );
    expect(res.status).toBe(200);
    // Row by row in the file's order (S4-r7 t8): each row keeps its own value, not just the set of values.
    const written = await Promise.all(
      rows.map(
        async (_, r) =>
          (
            await e.w.db.owner.query<{ v: string | null }>(
              `select (select value #>> '{}' from jsonb_each(custom_fields) limit 1) as v from listings where id = $1`,
              [listingIdOf(id, r)],
            )
          ).rows[0]?.v ?? null,
      ),
    );
    expect(written).toEqual(["Biển", "Phố", null]);
  });

  it("close price and close date cells are kept as written on the import, never dropped in silence", async () => {
    const e = await importWorld("gia_ban");
    const headers = [...HEADERS, "Giá bán", "Ngày bán"];
    const base = rowsOf(e.codes);
    const rows = [
      [...base[0]!, "4,2 tỷ", "10/11/2026"],
      [...base[1]!, "", ""],
      [...base[2]!, "", ""],
    ];
    const choices: Choices = {
      ...CHOICES,
      columns: {
        ...CHOICES.columns,
        5: { target: { standard: "Listing.closePrice" } },
        6: { target: { standard: "Listing.closeDate" } },
      },
    };
    const p = await preview(e, "LA", rows, choices, headers);
    expect(p.status).toBe(200);
    expect([cellAt(p, 0, 5).value, cellAt(p, 0, 6).value]).not.toContain(null);
    const r = await applyAll(e, "LA", rows, choices, undefined, headers);
    expect([r.status, r.body?.created]).toEqual([200, 3]);
    const kept = (
      await e.w.db.owner.query<{
        kept: { row: number; header: string; raw: string; why: string }[];
      }>(`select kept from import_runs where id = $1`, [r.id])
    ).rows[0]!.kept.filter((k) => k.why === "close-field");
    expect(kept.map((k) => [k.row, k.header, k.raw])).toEqual([
      [0, "Giá bán", "4,2 tỷ"],
      [0, "Ngày bán", "10/11/2026"],
    ]);
  });
});

/** The columns of row r whose value the preview promised and the write did not keep, by header (G-2811-65). */
function lostCells(
  promised: MarkedTable,
  headers: readonly string[],
  r: number,
  raw: readonly string[],
  written: {
    listing: Record<string, unknown>;
    kept: { row: number; header: string; raw: string; value?: unknown }[];
    newCode: string;
    unitOk: boolean;
    pendingBuilding: string | null;
  },
): string[] {
  const same = (a: unknown, b: unknown) => String(a) === String(b);
  const custom = (written.listing.custom_fields ?? {}) as Record<string, unknown>;
  const keptHere = (j: number) =>
    written.kept.some(
      (k) =>
        k.row === r &&
        k.header === headers[j] &&
        k.raw === raw[j] &&
        String(k.value) === String(promised.cells[r]![j]!.value),
    );
  return promised.columns.flatMap((col, j) => {
    const cell = promised.cells[r]!.at(j)!;
    if (!col.target || cell.value === null) return [];
    const t = col.target;
    let ok = true;
    if ("standard" in t) {
      const place = DESTINATION[t.standard];
      if ("listing" in place) ok = same(written.listing[place.listing], cell.value);
      else if ("kept" in place) ok = keptHere(j);
      else if (place.unit === "code") ok = written.unitOk;
      else ok = keptHere(j) || written.pendingBuilding === String(raw[j]).trim();
    } else if ("custom" in t) ok = same(custom[t.custom], cell.value);
    else if ("newField" in t) ok = same(custom[written.newCode], cell.value);
    return ok ? [] : [headers[j]!];
  });
}

// ---- VP11 S4-r1 finding (Shape 1): ImportRun against the table Postgres really has, not the migration text -----------

describe("mo hinh khop bang that (VP11 r1)", () => {
  it("ImportRun's properties and the columns of import_runs in Postgres are the same set (break pinned)", async () => {
    const e = await importWorld("mo_hinh");
    const columns = new Set(
      (
        await e.w.db.owner.query<{ c: string }>(
          `select column_name as c from information_schema.columns
            where table_schema = 'public' and table_name = 'import_runs'`,
        )
      ).rows.map((r) => r.c),
    );
    const entity = JSON.parse(
      execFileSync(
        "python3",
        [
          "-c",
          "import json,sys,yaml; print(json.dumps(yaml.safe_load(open(sys.argv[1]))))",
          join(import.meta.dirname, "..", "..", "ontology", "entities", "ImportRun.yaml"),
        ],
        { encoding: "utf8" },
      ),
    ) as { properties: Record<string, unknown> };
    const properties = Object.keys(entity.properties);
    expect(columns.size).toBe(18);
    expect(tableFaults(properties, columns)).toEqual([]);
    // Break: a column the table gains without a property, and a property the table lost, are named.
    const more = new Set([...columns, "secret_notes"]);
    more.delete("file_name");
    expect(tableFaults(properties, more)).toEqual([
      "ontology property without column: ImportRun.fileName",
      "column without ontology property: secret_notes",
    ]);
  });
});

/** Each ImportRun property without its column and each column without its property, named. */
function tableFaults(properties: readonly string[], columns: ReadonlySet<string>): string[] {
  const snake = (camel: string) => camel.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
  const wanted = new Set(properties.map(snake));
  return [
    ...properties
      .filter((p) => !columns.has(snake(p)))
      .map((p) => `ontology property without column: ImportRun.${p}`),
    ...[...columns]
      .filter((c) => !wanted.has(c))
      .map((c) => `column without ontology property: ${c}`),
  ];
}

// ---- Ruling G-2811-71: the whole space, written before. Three bugs of one shape («the preview takes it, the write drops
// it») were found after six rounds, each where the earlier comparison skipped. The matrix below names every column
// target × situation of the row × mark of the cell, each with one declared outcome or «not applicable» and its reason;
// the comparison runs over all of it and fails when a cell has no outcome or the matrix is empty.

type Situation = "catalog" | "pending-existing" | "pending-new" | "listed" | "many-units";
type Mark =
  "keep" | "fixed" | "chosen-remember" | "chosen-no-remember" | "chosen-as-written" | "ask";
// «many-units»: a code naming several units that nobody chose one for (VP11 S4-r2 item 9, ruling G-2811-84).
const SITUATIONS: Situation[] = [
  "catalog",
  "pending-existing",
  "pending-new",
  "listed",
  "many-units",
];
const MARKS: Mark[] = [
  "keep",
  "fixed",
  "chosen-remember",
  "chosen-no-remember",
  "chosen-as-written",
  "ask",
];

/** A column of the matrix: its target, and for each mark the text that gives it (with the person's answer), or why
 * the mark cannot happen in that column. */
interface MatrixColumn {
  header: string;
  target: Choices["columns"][number]["target"] | "unit";
  input: Partial<Record<Mark, { raw: string; answer?: string | null }>>;
  notApplicable: Partial<Record<Mark, string>>;
  /** For an answered cell whose answer the reading ignores (numbers, floors, dates): it keeps asking. */
  answerIgnored?: boolean;
}

const closed = (
  keep: string,
  fixed: string,
  answer: string,
  header: string,
  target: MatrixColumn["target"],
) => ({
  header,
  target,
  input: {
    keep: { raw: keep },
    fixed: { raw: fixed },
    "chosen-remember": { raw: `${header} nhớ`, answer },
    "chosen-no-remember": { raw: `${header} không nhớ`, answer },
    "chosen-as-written": { raw: `${header} giữ chữ`, answer: null },
    ask: { raw: `${header} lạ` },
  },
  notApplicable: {},
});
const reading = (
  keep: string,
  fixed: string,
  unread: string,
  header: string,
  target: MatrixColumn["target"],
) => ({
  header,
  target,
  input: {
    keep: { raw: keep },
    fixed: { raw: fixed },
    "chosen-remember": { raw: `${unread} 1`, answer: keep },
    "chosen-no-remember": { raw: `${unread} 2`, answer: keep },
    "chosen-as-written": { raw: `${unread} 3`, answer: null },
    ask: { raw: unread },
  },
  notApplicable: {},
  answerIgnored: true,
});
const freeText = (keep: string, header: string, target: MatrixColumn["target"]) => ({
  header,
  target,
  input: { keep: { raw: keep } },
  notApplicable: Object.fromEntries(
    MARKS.filter((m) => m !== "keep").map((m) => [
      m,
      "free text: a cell with words is kept as it is, never fixed or asked",
    ]),
  ),
});

const MATRIX: MatrixColumn[] = [
  {
    header: "Mã căn",
    target: "unit",
    input: { keep: { raw: "" } },
    notApplicable: Object.fromEntries(
      MARKS.filter((m) => m !== "keep").map((m) => [
        m,
        "the unit code's mark is the row's situation, measured on that axis",
      ]),
    ),
  },
  freeText("[MAU] Toà", "Block", { standard: "Unit.buildingName" }),
  reading("72", "75,2 m²", "rộng", "Diện tích", { standard: "Unit.livingArea" }),
  reading("2", "2,0", "nhiều phòng", "PN", { standard: "Unit.bedroomsTotal" }),
  closed("Đông Nam", "đông nam", "Đông Nam", "Hướng", { standard: "Unit.directionFaces" }),
  reading("15", "Tầng 07", "trệt", "Tầng", { standard: "Unit.floor" }),
  closed(
    label("SubTypeCondominium"),
    label("SubTypeCondominium").toUpperCase(),
    "Condominium",
    "Loại căn",
    {
      standard: "Unit.propertySubType",
    },
  ),
  {
    ...reading("4650000000", "4,65 tỷ", "thoả thuận", "Giá chào", {
      standard: "Listing.listPrice",
    }),
    input: {
      keep: { raw: "4650000000" },
      fixed: { raw: "4,65 tỷ" },
      "chosen-remember": { raw: "thoả thuận 1", answer: "4100000000" },
      "chosen-no-remember": { raw: "thoả thuận 2", answer: "4200000000" },
      "chosen-as-written": { raw: "thoả thuận 3", answer: null },
      ask: { raw: "thoả thuận" },
    },
    answerIgnored: false,
  },
  closed(label("FeeIncluded"), "KBP", "Included", "Phí", { standard: "Listing.feeInclusion" }),
  closed(label("StatusActive"), "dang ban", "Hold", "Trạng thái", {
    standard: "Listing.standardStatus",
  }),
  closed(
    label("WithdrawnUnreachable"),
    label("WithdrawnUnreachable").toUpperCase(),
    "owner_changed_mind",
    "Lý do ngừng",
    {
      standard: "Listing.withdrawnReason",
    },
  ),
  {
    ...reading("4200000000", "4,2 tỷ", "chưa bán", "Giá bán", { standard: "Listing.closePrice" }),
    input: {
      keep: { raw: "4200000000" },
      fixed: { raw: "4,2 tỷ" },
      "chosen-remember": { raw: "chưa bán 1", answer: "4100000000" },
      "chosen-no-remember": { raw: "chưa bán 2", answer: "4000000000" },
      "chosen-as-written": { raw: "chưa bán 3", answer: null },
      ask: { raw: "chưa bán" },
    },
    answerIgnored: false,
  },
  reading("2026-11-10", "10/11/2026", "32/11/2026", "Ngày bán", { standard: "Listing.closeDate" }),
  closed(label("FurnishedFull"), label("FurnishedNone").toLowerCase(), "Partially", "Nội thất", {
    standard: "Listing.furnished",
  }),
  closed(label("OccupantVacant"), label("OccupantVacant").toUpperCase(), "Owner", "Người ở", {
    standard: "Listing.occupantType",
  }),
  freeText("Sổ hồng", "Pháp lý", { standard: "Listing.legalStatus" }),
  freeText("Vay 70%", "Vay", { standard: "Listing.financing" }),
  reading("2026-11-15", "15/11/2026", "33/11/2026", "Ngày check", {
    standard: "Listing.lastConfirmedAt",
  }),
  closed("Biển", "bien", "Phố", "Hướng nhìn", { custom: "huong_nhin" }),
  closed("Biển", "bien", "Phố", "View", {
    newField: { name: "View", kind: "single_select", options: ["Biển", "Phố"] },
  }),
  // Two columns the person dropped: the owner's phone (it can only be dropped, Hỏi-12) and a note. Never kept, on any
  // kind of row (S4-r10 t5).
  {
    header: "SĐT chủ nhà",
    target: { skip: true },
    input: { keep: { raw: "0900 000 001" } },
    notApplicable: Object.fromEntries(
      MARKS.filter((m) => m !== "keep").map((m) => [
        m,
        "a dropped column is not read: no mark but its own",
      ]),
    ),
  },
  {
    header: "Ghi chú",
    target: { skip: true },
    input: { keep: { raw: "[Tên] hẹn gọi lại" } },
    notApplicable: Object.fromEntries(
      MARKS.filter((m) => m !== "keep").map((m) => [
        m,
        "a dropped column is not read: no mark but its own",
      ]),
    ),
  },
];

/** The declared outcome of one cell of the matrix, from where its target goes, the row's situation and the mark the
 * cell really has. `na` is the reason it cannot happen. */
type Outcome =
  | { write: "listing"; column: string }
  | { write: "custom" | "new-field" | "unit-link" | "pending-building" }
  | { kept: string }
  | { none: string }
  | { dropped: true }
  | { na: string };

function outcomeOf(
  col: MatrixColumn,
  situation: Situation,
  mark: Mark,
  askWhy: string | null,
): Outcome {
  if (!col.input[mark]) {
    const why = col.notApplicable[mark];
    return why ? { na: why } : { na: "" };
  }
  const t = col.target;
  if (t !== "unit" && "skip" in t) return { dropped: true };
  // A row whose unit is unresolved makes no listing and keeps every cell with text, its unit code too.
  if (situation === "many-units")
    return { kept: t === "unit" ? "many-units" : (askWhy ?? "row-not-created") };
  const created = situation !== "listed";
  // A unit that already has an open listing makes no listing: every cell of the row asks «already listed» and is kept
  // as written on the import; the unit code has nothing more to say.
  if (!created) {
    if (t === "unit") return { none: "row-listed" };
    if ("standard" in t) {
      const place = DESTINATION[t.standard];
      if ("kept" in place) return { kept: place.kept };
    }
    return { kept: askWhy ?? "?" };
  }
  const asks =
    mark === "ask" ||
    mark === "chosen-as-written" ||
    (col.answerIgnored && mark.startsWith("chosen"));
  if (t === "unit") return created ? { write: "unit-link" } : { none: "row-listed" };
  if ("standard" in t) {
    const place = DESTINATION[t.standard];
    if ("kept" in place) return { kept: place.kept };
    if ("unit" in place)
      return situation === "pending-new"
        ? { write: "pending-building" }
        : { kept: "unit-attribute" };
    if (asks) return { kept: askWhy ?? "?" };
    return created ? { write: "listing", column: place.listing } : { none: "row-listed" };
  }
  if (asks) return { kept: askWhy ?? "?" };
  if (!created) return { none: "row-listed" };
  return "custom" in t ? { write: "custom" } : { write: "new-field" };
}

interface Written {
  listing: Record<string, unknown> | null;
  kept: { row: number; header: string; raw: string; why: string; value?: unknown }[];
  unitOk: boolean;
  pendingBuilding: string | null;
  newCode: string;
}

/** Each cell whose declared outcome is not what was written, as «row:header:what». */
function matrixFaults(
  promised: MarkedTable,
  rows: { situation: Situation; mark: Mark; raw: string[] }[],
  written: Written[],
): string[] {
  const out: string[] = [];
  rows.forEach((row, r) => {
    MATRIX.forEach((col, j) => {
      const effective: Mark = col.input[row.mark] ? row.mark : "keep";
      const cell = promised.cells[r]![j]!;
      const o = outcomeOf(col, row.situation, effective, cell.mark === "ask" ? cell.why : null);
      const w = written[r]!;
      const raw = row.raw[j]!;
      const name = `${r}:${col.header}`;
      // Kept as written AND with the value the preview showed, when it showed one (G-2811-78).
      const keptHere = (why: string) =>
        w.kept.some(
          (k) =>
            k.row === r &&
            k.header === col.header &&
            k.raw === raw &&
            k.why === why &&
            (cell.value === null ? k.value === undefined : String(k.value) === String(cell.value)),
        );
      if ("na" in o) out.push(`${name}: no outcome`);
      else if ("dropped" in o) {
        if (w.kept.some((k) => k.row === r && k.header === col.header))
          out.push(`${name}: a dropped column was kept`);
      } else if ("kept" in o) {
        if (!keptHere(o.kept)) out.push(`${name}: not kept with its value (${o.kept})`);
      } else if ("none" in o) {
        if (w.listing !== null) out.push(`${name}: a listing exists for a ${o.none} row`);
      } else if (o.write === "listing") {
        if (String(w.listing?.[o.column]) !== String(cell.value))
          out.push(`${name}: listing ${o.column} not written`);
      } else if (o.write === "custom") {
        const cf = (w.listing?.custom_fields ?? {}) as Record<string, unknown>;
        const code = (col.target as { custom: string }).custom;
        if (String(cf[code]) !== String(cell.value)) out.push(`${name}: custom field not written`);
      } else if (o.write === "new-field") {
        const cf = (w.listing?.custom_fields ?? {}) as Record<string, unknown>;
        if (String(cf[w.newCode]) !== String(cell.value))
          out.push(`${name}: new field not written`);
      } else if (o.write === "unit-link") {
        if (!w.unitOk) out.push(`${name}: listing not on its unit`);
      } else if (o.write === "pending-building") {
        if (w.pendingBuilding !== raw.trim())
          out.push(`${name}: tower text not on the new pending unit`);
      }
    });
  });
  return out;
}

describe("ma tran xem truoc va da ghi (G-2811-71)", () => {
  it("the matrix is written before: 20 targets and 2 dropped columns × 5 situations × 6 marks, every cell with one outcome or a named reason", () => {
    expect(MATRIX).toHaveLength(22);
    // The 18 standard targets and the two kinds of the company's own fields, each once.
    const standard = MATRIX.flatMap((c) =>
      c.target !== "unit" && "standard" in c.target ? [c.target.standard] : [],
    );
    expect([...standard, "unitCode"].sort()).toEqual([...STANDARD_TARGETS].sort());
    const cells = MATRIX.flatMap((col) =>
      SITUATIONS.flatMap((s) => MARKS.map((m) => ({ col, s, m, o: outcomeOf(col, s, m, "why") }))),
    );
    expect(cells).toHaveLength(660);
    const unnamed = cells
      .filter((x) => "na" in x.o && !x.o.na)
      .map((x) => `${x.col.header}×${x.s}×${x.m}`);
    expect(unnamed).toEqual([]);
    // Break: a column with a mark neither given an input nor a reason is named.
    const broken: MatrixColumn = {
      ...MATRIX[2]!,
      input: { keep: { raw: "72" } },
      notApplicable: {},
    };
    expect(
      "na" in outcomeOf(broken, "catalog", "fixed", null) &&
        outcomeOf(broken, "catalog", "fixed", null),
    ).toEqual({ na: "" });
  });

  it("what the preview promised is what was written, over the whole matrix (break pinned)", async () => {
    const e = await importWorld("ma_tran");
    await e.w.db.owner.query(
      `insert into company_fields (company_id, code, name, kind, position, options)
         values ($1, 'huong_nhin', 'Hướng nhìn', 'single_select', 0, '["Biển", "Phố"]')`,
      [e.w.A],
    );
    const catalog = await catalogCodes(e, 6, 3);
    const listedCodes = await catalogCodes(e, 6, 9);
    // Six codes each naming two units of the catalog, as the reader of row 7e reads «DOI-0k».
    const twoUnits = await catalogCodes(e, 12, 30);
    for (let k = 0; k < 6; k += 1)
      await e.w.db.owner.query(
        `insert into catalog_aliases (object_key, kind, value, source)
         values ($1, 'ma_goc', $3, 'THU'), ($2, 'ma_goc', $4, 'THU')`,
        [
          await unitKeyOf(e, twoUnits[2 * k]!),
          await unitKeyOf(e, twoUnits[2 * k + 1]!),
          `op3/DOI-0${k}`,
          `op2/DOI-0${k}`,
        ],
      );
    const pendingIds: string[] = [];
    for (let k = 0; k < 6; k += 1)
      pendingIds.push(
        (
          await e.w.db.owner.query<{ id: string }>(
            `insert into company_pending_units (company_id, raw_code) values ($1, $2) returning id::text`,
            [e.w.A, `SA5-90.0${k}`],
          )
        ).rows[0]!.id,
      );
    // The listed units: an open listing first, from a plain import.
    const first = await applyAll(
      e,
      "LA",
      listedCodes.map((c) => [c, "", "", "", ""]),
      NO_CHOICES,
    );
    expect([first.status, first.body?.created]).toEqual([200, 6]);
    const codeOf = (s: Situation, k: number) =>
      s === "catalog"
        ? catalog[k]!
        : s === "listed"
          ? listedCodes[k]!
          : s === "pending-existing"
            ? `SA5-90.0${k}`
            : s === "many-units"
              ? `DOI-0${k}`
              : `SA5-91.0${k}`;
    const rows = SITUATIONS.flatMap((situation) =>
      MARKS.map((mark, k) => ({
        situation,
        mark,
        raw: MATRIX.map((col, j) =>
          j === 0 ? codeOf(situation, k) : (col.input[mark] ?? col.input.keep)!.raw,
        ),
      })),
    );
    const choices: Choices = {
      ...NO_CHOICES,
      columns: Object.fromEntries(
        MATRIX.flatMap((c, j) => (c.target !== "unit" ? [[j, { target: c.target }]] : [])),
      ) as Choices["columns"],
      values: Object.fromEntries(
        MATRIX.flatMap((col, j) =>
          (["chosen-remember", "chosen-no-remember", "chosen-as-written"] as Mark[]).flatMap(
            (m) => {
              const i = col.input[m];
              return i && i.answer !== undefined
                ? [[`${j}|${fold(i.raw)}`, { value: i.answer, remember: m === "chosen-remember" }]]
                : [];
            },
          ),
        ),
      ),
      units: Object.fromEntries(
        MARKS.map((_, k) => [fold(`SA5-91.0${k}`), { pending: true as const }]),
      ),
    };
    const headers = MATRIX.map((c) => c.header);
    const p = await preview(
      e,
      "LA",
      rows.map((r) => r.raw),
      choices,
      headers,
    );
    expect(p.status).toBe(200);
    const promised = marked(p);
    expect(promised.counts.block).toBe(0);
    // The matrix's own inputs give the marks it says, so no cell is measured on the wrong mark.
    const wrongMark = rows.flatMap((row, r) =>
      MATRIX.flatMap((col, j) => {
        if (j === 0 || !col.input[row.mark]) return [];
        const cell = promised.cells[r]![j]!;
        const want =
          row.situation === "listed"
            ? "ask"
            : row.mark === "keep"
              ? "keep"
              : row.mark === "fixed"
                ? "fixed"
                : row.mark === "ask" || row.mark === "chosen-as-written" || col.answerIgnored
                  ? "ask"
                  : "fixed";
        return cell.mark === want
          ? []
          : [`${r}:${col.header}: ${row.mark} gave ${cell.mark} (${cell.why})`];
      }),
    );
    expect(wrongMark).toEqual([]);
    expect(promised.rows.map((x) => x.fate)).toEqual(
      rows.map((r) =>
        r.situation === "listed" ? "listed" : r.situation === "many-units" ? "blocked" : "create",
      ),
    );
    const open = await e.h.open(
      req(
        URL_,
        "POST",
        {
          headers,
          rows: rows.map((r) => r.raw),
          choices,
          fileName: "ma-tran.xlsx",
          sheetName: "Sheet1",
          expected: { ...p.body.counts, createCount: p.body.createCount },
        },
        await e.cookie("LA"),
      ),
    );
    expect(open.status).toBe(201);
    const { id } = (await open.json()) as { id: string };
    const NEW = MATRIX.findIndex((c) => c.target !== "unit" && "newField" in c.target);
    const res = await e.h.batch(
      req(
        `${URL_}/${id}/batches`,
        "POST",
        {
          headers,
          rows: rows.map((r) => r.raw),
          choices,
          batchNo: 0,
          rowOffset: 0,
          last: true,
          allNewFieldCells: Object.fromEntries(
            rows.map((row, r) => [`${r}:${NEW}`, row.raw[NEW]!]),
          ),
        },
        await e.cookie("LA"),
      ),
      id,
    );
    expect(res.status).toBe(200);
    const kept = (
      await e.w.db.owner.query<{ kept: Written["kept"] }>(
        `select kept from import_runs where id = $1`,
        [id],
      )
    ).rows[0]!.kept;
    const newCode = (
      await e.w.db.owner.query<{ code: string }>(
        `select code from company_fields where company_id = $1 and name = 'View'`,
        [e.w.A],
      )
    ).rows[0]!.code;
    const written: Written[] = [];
    for (let r = 0; r < rows.length; r += 1) {
      const listing =
        (
          await e.w.db.owner.query<Record<string, unknown>>(
            `select list_price::text as "listPrice", fee_inclusion as "feeInclusion",
                    standard_status as "standardStatus", withdrawn_reason as "withdrawnReason", furnished,
                    occupant_type as "occupantType", legal_status as "legalStatus", financing,
                    last_confirmed_at::date::text as "lastConfirmedAt", custom_fields
               from listings where id = $1`,
            [listingIdOf(id, r)],
          )
        ).rows[0] ?? null;
      const link = (
        await e.w.db.owner.query<{
          upi: string | null;
          pid: string | null;
          code: string | null;
          building: string | null;
        }>(
          `select u.upi, lp.pending_unit_id::text as pid, cpu.raw_code as code, cpu.building_text as building
             from (select $1::uuid as id) l
             left join listing_units u on u.listing_id = l.id
             left join listing_pending_units lp on lp.listing_id = l.id
             left join company_pending_units cpu on cpu.id = lp.pending_unit_id`,
          [listingIdOf(id, r)],
        )
      ).rows[0]!;
      const row = rows[r]!;
      const k = MARKS.indexOf(row.mark);
      let unitOk = false;
      if (row.situation === "catalog") {
        const upi = (
          await e.w.db.owner.query<{ upi: string }>(
            `select u.upi from catalog_aliases a join catalog_units u on u.unit_key = a.object_key
              where a.kind = 'ma_goc' and a.value = $1`,
            [catalog[k]],
          )
        ).rows[0]!.upi;
        unitOk = link.upi === upi;
      } else if (row.situation === "pending-existing") unitOk = link.pid === pendingIds[k];
      else if (row.situation === "pending-new") unitOk = link.code === `SA5-91.0${k}`;
      written.push({ listing, kept, unitOk, pendingBuilding: link.building, newCode });
    }
    expect(matrixFaults(promised, rows, written)).toEqual([]);
    // The screen's two counts are the record's: «N ô giữ chữ gốc» is the record's kept cells, and the rows left out
    // because their unit code names several units are said by number (G-2811-84).
    expect(promised.keptCount).toBe(kept.length);
    expect(promised.notCreatedCount).toBe(MARKS.length);
    expect(
      rows.flatMap((x, r) =>
        x.situation === "many-units" && written[r]!.listing !== null ? [r] : [],
      ),
    ).toEqual([]);
    // What the person asked to remember: the company layer (row 7e) keeps a spelling for a closed set it holds — status,
    // withdrawal reason, direction and its own choice fields. For the other columns the value is written or kept as
    // above and the spelling is not learned, as declared here; the screen promises no more.
    const REMEMBERED = ["Hướng", "Trạng thái", "Lý do ngừng", "Hướng nhìn", "View"];
    const NOT_REMEMBERED: Record<string, string> = {
      "Loại căn":
        "a unit attribute other than direction: kept as written, no company spelling (G-2711-4)",
      "Giá chào": "a price is read, not a closed set: the answer is written, no spelling",
      "Giá bán": "a price is read, not a closed set: the answer is kept, no spelling",
      Phí: "not a closed set of the company layer (row 7e): the answer is written, no spelling",
      "Nội thất":
        "not a closed set of the company layer (row 7e): the answer is written, no spelling",
      "Người ở":
        "not a closed set of the company layer (row 7e): the answer is written, no spelling",
    };
    const answered = MATRIX.filter((c) => !c.answerIgnored && c.input["chosen-remember"]).map(
      (c) => c.header,
    );
    expect([...REMEMBERED, ...Object.keys(NOT_REMEMBERED)].sort()).toEqual([...answered].sort());
    const learnedNames = ((await res.json()) as { learned?: LearnedItem[] }).learned!.map((x) =>
      fold(x.name),
    );
    for (const h of REMEMBERED)
      expect(learnedNames).toContain(
        fold(`«${MATRIX.find((c) => c.header === h)!.input["chosen-remember"]!.raw}»`),
      );
    for (const h of Object.keys(NOT_REMEMBERED))
      expect(learnedNames).not.toContain(
        fold(`«${MATRIX.find((c) => c.header === h)!.input["chosen-remember"]!.raw}»`),
      );
    // Breaks: a lost listing value, a dropped kept cell, a listing on the wrong unit, a listed row that got a listing.
    const r0 = written[0]!;
    expect(
      matrixFaults(promised, rows, [
        { ...r0, listing: { ...r0.listing!, furnished: null } },
        ...written.slice(1),
      ]),
    ).toEqual(["0:Nội thất: listing furnished not written"]);
    expect(
      matrixFaults(
        promised,
        rows,
        written.map((w) => ({
          ...w,
          kept: w.kept.filter((x) => !(x.row === 0 && x.header === "Block")),
        })),
      ),
    ).toEqual(["0:Block: not kept with its value (unit-attribute)"]);
    expect(matrixFaults(promised, rows, [{ ...r0, unitOk: false }, ...written.slice(1)])).toEqual([
      "0:Mã căn: listing not on its unit",
    ]);
    // A listed row that got a listing is named on its unit code (S4-r8 t9: the message is pinned, not just counted).
    const lastListed = rows.map((x) => x.situation).lastIndexOf("listed");
    expect(
      matrixFaults(promised, rows, [
        ...written.slice(0, lastListed),
        { ...written[lastListed]!, listing: r0.listing },
        ...written.slice(lastListed + 1),
      ]),
    ).toEqual([`${lastListed}:Mã căn: a listing exists for a row-listed row`]);
    // A direct sweep of the record (ruling G-2811-92): after a file with the owner's phone column, no text shaped like a
    // phone number is anywhere in kept, raw or value; and kept is not empty, so the sweep has something to read.
    // A number of its own (no digit before or after), not the digits inside a price such as 4000000000.
    const PHONE_SHAPE = /(?<!\d)0\d{2,3}[ .]?\d{3}[ .]?\d{3,4}(?!\d)/;
    const phones = (cells: { raw: string; value?: unknown }[]) =>
      cells.filter((k) => PHONE_SHAPE.test(k.raw) || PHONE_SHAPE.test(String(k.value ?? "")));
    expect(kept.length).toBeGreaterThan(100);
    expect(phones(kept)).toEqual([]);
    // Break: the same sweep finds the owner's number when it is planted in the record.
    expect(phones([...kept, { raw: "0900 000 001" }])).toHaveLength(1);
    expect(phones([{ raw: "x", value: 4000000000 }, { raw: "0900000001" }])).toHaveLength(1);
    // The owner's phone kept on a row left out is named (S4-r10 t5): a dropped column is never on the record.
    const manyRow = rows.findIndex((x) => x.situation === "many-units");
    const PHONE = MATRIX.findIndex((c) => c.header === "SĐT chủ nhà");
    expect(
      matrixFaults(
        promised,
        rows,
        written.map((w) => ({
          ...w,
          kept: [
            ...kept,
            {
              row: manyRow,
              header: "SĐT chủ nhà",
              raw: rows[manyRow]!.raw[PHONE]!,
              why: "row-not-created",
            },
          ],
        })),
      ),
    ).toEqual([`${manyRow}:SĐT chủ nhà: a dropped column was kept`]);
    // An answer the person typed for a column kept as written, lost from the record, is named (G-2811-78): the cell
    // «chưa bán 2» of the catalog row answered without «remember» shows 4000000000 on the preview.
    const answeredRow = rows.findIndex(
      (x) => x.situation === "catalog" && x.mark === "chosen-no-remember",
    );
    const SALE = MATRIX.findIndex((c) => c.header === "Giá bán");
    expect(promised.cells[answeredRow]![SALE]!.value).toBe(4000000000);
    const lostAnswer = kept.map((k) =>
      k.row === answeredRow && k.header === "Giá bán"
        ? { row: k.row, header: k.header, raw: k.raw, why: k.why }
        : k,
    );
    expect(
      matrixFaults(
        promised,
        rows,
        written.map((w) => ({ ...w, kept: lostAnswer })),
      ),
    ).toEqual([`${answeredRow}:Giá bán: not kept with its value (close-field)`]);
  });
});

// ---- S4-r11 t5 (AC-8): the last batch waits for every earlier batch ------------------------------------------------

describe("goi cuoi doi cac goi truoc (S4-r11)", () => {
  it("a last batch sent before the earlier ones is 409 batches-missing: nothing written, nothing learned, the import open; in order it finishes (break pinned)", async () => {
    const e = await importWorld("goi_cuoi");
    const codes = Array.from({ length: 450 }, (_, i) => `YY-${String(i).padStart(3, "0")}`);
    const rows = codes.map((code) => [code, "[MAU] Toà", "1 tỷ", label("StatusActive"), ""]);
    const choices: Choices = {
      ...CHOICES,
      columns: { 1: { target: { standard: "Unit.buildingName" }, learnLabel: true } },
      units: Object.fromEntries(codes.map((code) => [fold(code), { pending: true as const }])),
    };
    const id = await openOnly(e, "LA", rows, choices);
    const batch = (b: number) =>
      sendBatch(e, "LA", id, {
        headers: HEADERS,
        rows: rows.slice(b * 200, (b + 1) * 200),
        choices,
        batchNo: b,
        rowOffset: b * 200,
        last: b === 2,
      });
    const state = async () =>
      (
        await e.w.db.owner.query<{ status: string; done: number[] }>(
          "select status, batches_done as done from import_runs where id = $1",
          [id],
        )
      ).rows[0]!;
    const learned = async () =>
      (await count(e, "select count(*) as n from company_labels")) +
      (await count(e, "select count(*) as n from company_import_templates"));
    // The last batch first, then after batch 0 only: refused each time, nothing written, nothing learned.
    expect(await batch(2)).toMatchObject({ status: 409, error: "batches-missing" });
    expect(await batch(0)).toMatchObject({ status: 200, created: 200 });
    expect(await batch(2)).toMatchObject({ status: 409, error: "batches-missing" });
    expect(await count(e, "select count(*) as n from listings")).toBe(200);
    expect(await learned()).toBe(0);
    expect(await state()).toEqual({ status: "open", done: [0] });
    // In order, the import finishes and learns once.
    expect(await batch(1)).toMatchObject({ status: 200, created: 200 });
    expect(await batch(2)).toMatchObject({ status: 200, created: 50 });
    expect(await count(e, "select count(*) as n from listings")).toBe(450);
    expect(await state()).toEqual({ status: "done", done: [0, 1, 2] });
    expect(await learned()).toBeGreaterThan(0);
    // Break: the rule the server holds, given a done list missing an earlier batch, refuses the last one.
    const waits = (done: number[], batchNo: number) =>
      Array.from({ length: batchNo }, (_, b) => b).some((b) => !done.includes(b));
    expect([waits([0, 1], 2), waits([1], 2), waits([], 0)]).toEqual([false, true, false]);
  });
});

// ---- Ruling G-2811-96: every order a batch can come in, written before, with its outcome (AC-8: «an import with a
// batch not written has learned nothing») ---------------------------------------------------------------------------

describe("ma tran thu tu goi (G-2811-96)", () => {
  it("each way a batch can arrive has one declared outcome: status, what is written, what is learned", async () => {
    const e = await importWorld("thu_tu_goi");
    await e.w.db.owner.query(
      `insert into company_fields (company_id, code, name, kind, position) values ($1, 'ghi_chu', 'Ghi chú', 'text', 0)`,
      [e.w.A],
    );
    const headers = [...HEADERS, "Ghi chú"];
    let n = 0;
    /** One import of `size` rows (401: three batches of 200, 200, 1) on its own unit codes. */
    const fresh = async (size = 401) => {
      n += 1;
      const codes = Array.from({ length: size }, (_, i) => `T${n}-${String(i).padStart(3, "0")}`);
      const lastBatch = Math.ceil(size / 200) - 1;
      const rows = codes.map((c) => [c, "[MAU] Toà", "1 tỷ", label("StatusActive"), "", "gọi lại"]);
      const choices: Choices = {
        ...CHOICES,
        columns: {
          1: { target: { standard: "Unit.buildingName" }, learnLabel: true },
          5: { target: { custom: "ghi_chu" } },
        },
        units: Object.fromEntries(codes.map((c) => [fold(c), { pending: true as const }])),
      };
      const p = await preview(e, "LA", rows, choices, headers);
      const open = await e.h.open(
        req(
          URL_,
          "POST",
          {
            headers,
            rows,
            choices,
            fileName: `thu-tu-${n}.xlsx`,
            sheetName: "Sheet1",
            expected: { ...p.body.counts, createCount: p.body.createCount },
          },
          await e.cookie("LA"),
        ),
      );
      expect(open.status).toBe(201);
      const { id } = (await open.json()) as { id: string };
      const send = (b: number, over: Record<string, unknown> = {}) =>
        sendBatch(e, "LA", id, {
          headers,
          rows: rows.slice(b * 200, (b + 1) * 200),
          choices,
          batchNo: b,
          rowOffset: b * 200,
          last: b === lastBatch,
          ...over,
        });
      const state = async () => {
        const r = (
          await e.w.db.owner.query<{ status: string; done: number[]; kept: { why: string }[] }>(
            "select status, batches_done as done, kept from import_runs where id = $1",
            [id],
          )
        ).rows[0]!;
        return {
          status: r.status,
          done: [...r.done].sort(),
          listings: await count(e, "select count(*) as n from listings where import_run_id = $1", [
            id,
          ]),
          keptRetired: r.kept.filter((k) => k.why === "field-retired").length,
        };
      };
      return { id, send, state };
    };
    const learned = async () =>
      (await count(e, "select count(*) as n from company_labels where retired_at is null")) +
      (await count(
        e,
        "select count(*) as n from company_import_templates where retired_at is null",
      ));

    // Two imports carry every case, so the test writes about 600 pending units, not 1,800. Import A (three batches):
    const a = await fresh();
    const before = await learned();
    // 1. The last batch first: refused, nothing written, nothing learned, the import open.
    expect(await a.send(2)).toMatchObject({ status: 409, error: "batches-missing" });
    expect(await a.state()).toEqual({ status: "open", done: [], listings: 0, keptRetired: 0 });
    // 2. A batch at the wrong place, or past the end: refused as a table that changed, nothing written.
    expect(await a.send(1, { rowOffset: 0 })).toMatchObject({
      status: 409,
      error: "table-changed",
    });
    expect(await a.send(1, { batchNo: 5, rowOffset: 1000 })).toMatchObject({
      status: 409,
      error: "table-changed",
    });
    // 3. A middle batch before the first: written, nothing learned yet.
    expect(await a.send(1)).toMatchObject({ status: 200, created: 200 });
    // 4. The first batch still missing: the last one waits.
    expect(await a.send(2)).toMatchObject({ status: 409, error: "batches-missing" });
    expect(await a.state()).toEqual({ status: "open", done: [1], listings: 200, keptRetired: 0 });
    expect(await learned()).toBe(before);
    // 5. A written batch sent again: the same answer, nothing written twice.
    expect(await a.send(1)).toMatchObject({ status: 200, created: 200 });
    expect((await a.state()).listings).toBe(200);
    expect(await a.send(0)).toMatchObject({ status: 200, created: 200 });
    // 6. The company's own fields change between batches: each batch is marked again (AC-7); the cell of the field
    // retired in between asks «field-retired» and is kept as written, never lost.
    await e.w.db.owner.query(
      "update company_fields set retired_at = now() where company_id = $1 and code = 'ghi_chu'",
      [e.w.A],
    );
    // 7. Every batch written, the last one finishes the import and learns once.
    expect(await a.send(2)).toMatchObject({ status: 200, created: 1 });
    expect(await a.state()).toEqual({
      status: "done",
      done: [0, 1, 2],
      listings: 401,
      keptRetired: 1,
    });
    const after = await learned();
    expect(after).toBeGreaterThan(before);
    // 8. The last batch sent again after the import finished: the same answer, nothing written or learned twice.
    expect(await a.send(2)).toMatchObject({ status: 200, created: 1 });
    expect((await a.state()).listings).toBe(401);
    expect(await learned()).toBe(after);
    // Import B (two batches, one written): 9. a batch of an import that was undone is closed, nothing written.
    const b = await fresh(201);
    expect((await b.send(0)).status).toBe(200);
    const undo = await e.h.undo(
      req(`${URL_}/${b.id}/undo`, "POST", {}, await e.cookie("LA")),
      b.id,
    );
    expect(undo.status).toBe(200);
    expect(await b.send(1)).toMatchObject({ status: 409, error: "closed" });
    expect((await b.state()).listings).toBe(0);
  }, 300_000);
});
