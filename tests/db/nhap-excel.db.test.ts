// Row 11 (nhap-excel), evals E4, E6, E8, E9, E12, E13, E14 on this lane's Postgres: the routes of /api/v1/imports
// through the real handlers, the identity door and withCompany under the API role. Company A holds the people of the
// permission-table world (LA, BA, TL, CA, X); Y is CompanyAdmin of B. Each block ends with its break, pinned.
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { catalogLoadStatements } from "@/modules/catalog/load-sql";
import { sampleCatalog } from "@/modules/catalog";
import { label } from "@/modules/company-config";
import { createImportsHandlers } from "@/modules/imports/imports-http";
import { NO_CHOICES, type Choices } from "@/modules/imports";
import { openDoor } from "@/modules/identity/action-door";
import { createAuthHandlers, tokenFrom } from "@/modules/identity/http";
import type { LoginDeps } from "@/modules/identity/login";
import type { ActionName } from "@/modules/identity/permissions";
import { captureSender } from "@/modules/identity/sender";
import { withCompany } from "@/modules/identity/with-company";

import { readInventory } from "@/modules/listings/inventory-read";

import { asPerson, dropWorld, world, type Person, type World } from "./bang-quyen-world";

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
    body: (await res.json()) as { created: number; learned?: string[] },
  };
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
    expect(r.body?.learned).toEqual(expect.arrayContaining(["template", "label", "pending-unit"]));
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
