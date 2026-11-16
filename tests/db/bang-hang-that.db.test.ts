// Row 10 (bang-hang-du-lieu-that), evals E2, E4, E4b, E5, E5b, E6, E6b, E7, E7b, E10 at the API and in the database: the
// inventory read and PATCH /api/v1/listings/[id] through the identity module's door, withCompany, under the API role, on
// this lane's Postgres. Company A holds the people of the permission-table world (LA, BA, TL, CA); Y is admin of B.
import { isDeepStrictEqual } from "node:util";

import { afterEach, describe, expect, it, vi } from "vitest";

import { sampleCatalog } from "@/modules/catalog";
import { catalogLoadStatements } from "@/modules/catalog/load-sql";
import { openDoor } from "@/modules/identity/action-door";
import { createAuthHandlers, tokenFrom } from "@/modules/identity/http";
import type { LoginDeps } from "@/modules/identity/login";
import type { ActionName } from "@/modules/identity/permissions";
import { captureSender } from "@/modules/identity/sender";
import { withCompany } from "@/modules/identity/with-company";
import { readInventory } from "@/modules/listings/inventory-read";
import { createListingsHandlers } from "@/modules/listings/listings-http";
import { inventoryThrough } from "@/modules/listings/server";

import { asPerson, dropWorld, world, type Person, type World } from "./bang-quyen-world";
import { sampleInventoryData } from "@/app/(app)/inventory-sample-data";

import { seedSampleInventory } from "./can-mau";

// The catalog's server door is imported by the read; outside Next.js its "server-only" guard has nothing to guard.
vi.mock("server-only", () => ({}));

const worlds: World[] = [];
afterEach(async () => {
  for (const w of worlds.splice(0)) await dropWorld(w);
});

const ORIGIN = "http://127.0.0.1:3486";
const NOW = new Date("2026-11-16T03:00:00.000Z");

async function apiWorld(suffix: string) {
  const w = await world(`can_chao_${suffix}`);
  worlds.push(w);
  const code = captureSender();
  const deps: LoginDeps = { pool: w.pool, secret: "test-secret-can-chao", sender: code.sender };
  const auth = createAuthHandlers(() => deps);
  const door = (r: Request, action: ActionName) => openDoor(() => w.pool, tokenFrom(r), action);
  const h = createListingsHandlers({ door, withCompany, now: () => NOW });
  const cookies = new Map<string, string>();
  const post = (url: string, method: string, body: unknown, c?: string) =>
    new Request(url, {
      method,
      headers: { "content-type": "application/json", ...(c ? { cookie: c } : {}) },
      body: JSON.stringify(body),
    });
  const cookie = async (who: Person, company = w.A): Promise<string> => {
    const key = who + company;
    const have = cookies.get(key);
    if (have) return have;
    const email = w.email[who];
    await auth.requestCode(post(`${ORIGIN}/api/v1/auth/code`, "POST", { email }));
    const mail = [...code.sent].reverse().find((m) => m.email === email);
    const otp = mail?.text.match(/\b\d{6}\b/)?.[0];
    const res = await auth.verifyCode(
      post(`${ORIGIN}/api/v1/auth/session`, "POST", { email, code: otp }),
    );
    if (!res.ok) throw new Error(`đăng nhập ${who} trả ${res.status}`);
    const c = (res.headers.get("set-cookie") ?? "").split(";")[0]!;
    const json = (await res.json()) as { company: { id: string } | null };
    if (json.company?.id !== company) {
      const chosen = await auth.chooseCompany(
        post(`${ORIGIN}/api/v1/auth/session/company`, "PUT", { companyId: company }, c),
      );
      if (!chosen.ok) throw new Error(`chọn sàn của ${who} trả ${chosen.status}`);
    }
    cookies.set(key, c);
    return c;
  };
  const patch = async (who: Person, id: string, body: unknown, company = w.A) =>
    h.change(
      post(`${ORIGIN}/api/v1/listings/${id}`, "PATCH", body, await cookie(who, company)),
      id,
    );
  return { w, h, patch, cookie };
}

const catalogs = new WeakMap<World, Promise<string[]>>();
/** The shared catalog, loaded once per world; its unit UPIs, each used by at most one listing of a test. */
function catalogUpis(w: World): Promise<string[]> {
  let p = catalogs.get(w);
  if (!p) {
    p = (async () => {
      const c = sampleCatalog();
      for (const s of catalogLoadStatements(c)) await w.db.owner.query(s.text, s.values);
      return c.units.map((u) => u.upi);
    })();
    catalogs.set(w, p);
  }
  return p;
}

let used = 0;
/** One listing of `company` written by the owner, on a unit no other listing of this world uses. */
async function listing(
  w: World,
  over: {
    company?: string;
    status?: string;
    price?: number;
    keeper?: Person | null;
    fee?: "Included" | "Excluded";
  } = {},
): Promise<string> {
  const upis = await catalogUpis(w);
  const upi = upis[used++ % upis.length]!;
  const id = crypto.randomUUID();
  const company = over.company ?? w.A;
  const keeper = over.keeper === undefined ? null : over.keeper;
  await w.db.owner.query(
    `insert into listings (id, company_id, standard_status, list_price, fee_inclusion, list_agent_user_id,
                           list_agent_full_name)
     values ($1, $2, $3, $4, $5, $6, $7)`,
    [
      id,
      company,
      over.status ?? "Incomplete",
      over.price ?? 3_000_000_000,
      over.fee ?? "Included",
      keeper ? w.id[keeper] : null,
      keeper ? `[Tên] ${keeper}` : null,
    ],
  );
  await w.db.owner.query(
    "insert into listing_units (listing_id, company_id, upi, open) values ($1, $2, $3, true)",
    [id, company, upi],
  );
  return id;
}

const rowOf = async (w: World, id: string) =>
  (
    await w.db.owner.query<{
      standard_status: string;
      list_price: string;
      fee_inclusion: string;
      version: number;
      last_confirmed_at: Date | null;
    }>(
      "select standard_status, list_price, fee_inclusion, version, last_confirmed_at from listings where id = $1",
      [id],
    )
  ).rows[0]!;

describe("doc-dung-san (E2)", () => {
  it("doc-dung-san: each company reads its own sample listings, through the door, and nothing of the other", async () => {
    const { w } = await apiWorld("doc");
    const a = await seedSampleInventory(w.db.owner, w.A, { id: w.id.LA, name: "[Tên] LA" });
    const b = await seedSampleInventory(w.db.owner, w.B);
    expect(a.count).toBe(60);
    const ofA = await asPerson(w, "LA", w.A, (c) => readInventory(c, w.id.LA));
    const ofB = await asPerson(w, "Y", w.B, (c) => readInventory(c, w.id.Y));
    expect(ofA.current).toHaveLength(60);
    expect(ofB.current).toHaveLength(60);
    expect(ofA.current.every((l) => l.companyId === w.A)).toBe(true);
    expect(ofB.current.every((l) => l.companyId === w.B)).toBe(true);
    const idsA = new Set([...ofA.current, ...ofA.earlier].map((l) => l.id));
    expect([...ofB.current, ...ofB.earlier].some((l) => idsA.has(l.id))).toBe(false);
    // Units come from the shared catalog; the viewer keeps some, others keep some, some nobody keeps.
    expect(ofA.current.every((l) => l.buildingName !== "" && l.unitNumber)).toBe(true);
    const kinds = new Set(Object.values(ofA.keepers).map((k) => k?.kind ?? "none"));
    expect([...kinds].sort()).toEqual(["none", "other", "viewer"]);
    // Every listing reads back as the sample wrote it: status, price, fee inclusion and own fields, unit by unit.
    const sample = sampleInventoryData();
    const byId = new Map([...ofA.current, ...ofA.earlier].map((l) => [l.id, l]));
    const differ = [...sample.current, ...sample.earlier].flatMap((l) => {
      const got = byId.get(a.idOf(l.id));
      const want = {
        standardStatus: l.standardStatus,
        listPrice: l.listPrice,
        feeInclusion: l.feeInclusion,
        customFields: l.customFields ?? {},
      };
      const have = got && {
        standardStatus: got.standardStatus,
        listPrice: got.listPrice,
        feeInclusion: got.feeInclusion,
        customFields: got.customFields,
      };
      return isDeepStrictEqual(have, want) ? [] : [`doc-dung-san: ${l.id}`];
    });
    expect(differ).toEqual([]);
    // Custom fields and the fee inclusion are read as stored.
    expect(ofA.current.some((l) => l.feeInclusion === "Excluded")).toBe(true);
    expect(ofA.current.some((l) => (l.customFields as Record<string, unknown>)["huong_view"])).toBe(
      true,
    );
    expect(ofA.earlier.length).toBeGreaterThan(0);
    expect(b.count).toBe(60);
  });
});

const ROLES = ["LA", "BA", "TL", "CA"] as const;
const KINDS = ["mine", "other", "none"] as const;
const CHANGES = ["price", "fee", "hold", "active"] as const;
type Kind = (typeof KINDS)[number];
type Change = (typeof CHANGES)[number];

// Written before the code (Hỏi-1 A, Hỏi-2 A, ontology/actions.yaml): role × listing kind × change → saved or refused.
// «mine» is a listing the role keeps, «other» one TL keeps (LA when TL itself), «none» one nobody keeps.
function want(role: (typeof ROLES)[number], kind: Kind, change: Change): 200 | 403 {
  if (role === "CA") return 403;
  if (change !== "active") return 200;
  if (role === "TL") return 200;
  if (role === "BA") return 403;
  return kind === "other" ? 403 : 200;
}

const ROLE = { LA: "ListAgent", BA: "BuyerAgent", TL: "TeamLead", CA: "CompanyAdmin" } as const;
const KIND: Record<Kind, string> = { mine: "của mình", other: "người khác", none: "chưa ai giữ" };
const CHANGE: Record<Change, string> = {
  price: "giá",
  fee: "điều kiện phí",
  hold: "Hold",
  active: "Active",
};

const BODY: Record<Change, unknown> = {
  price: { field: "listPrice", listPrice: 2_800_000_000 },
  fee: { field: "feeInclusion", feeInclusion: "Excluded" },
  hold: { field: "standardStatus", standardStatus: "Hold" },
  active: { field: "standardStatus", standardStatus: "Active" },
};

/** Runs the 48 cells against `expect_`; returns how many ran and the cells that did not match, as pinned lines. */
async function matrix(
  expect_: typeof want,
  suffix: string,
): Promise<{ cells: number; failures: string[] }> {
  const { w, patch } = await apiWorld(suffix);
  const failures: string[] = [];
  let cells = 0;
  for (const role of ROLES)
    for (const kind of KINDS)
      for (const change of CHANGES) {
        const keeper =
          kind === "mine" ? role : kind === "other" ? (role === "TL" ? "LA" : "TL") : null;
        const id = await listing(w, { keeper });
        const before = await rowOf(w, id);
        const res = await patch(role, id, { version: 1, change: BODY[change] });
        cells += 1;
        const expected = expect_(role, kind, change);
        const after = await rowOf(w, id);
        const cell = `bang-quyen-48-o: ${ROLE[role]}·${KIND[kind]}·${CHANGE[change]}`;
        if (res.status !== expected) failures.push(cell);
        else if (expected === 403 && after.version !== before.version)
          failures.push(`${cell} — bị từ chối mà dòng đã đổi`);
        else if (expected === 200 && after.version !== before.version + 1)
          failures.push(`${cell} — lưu mà phiên bản không tăng`);
      }
  return { cells, failures };
}

describe("bang-nac-24-o (E5)", () => {
  it("bang-quyen-48-o: 4 roles × 3 listing kinds × 4 changes = 48 cells, each saved or refused as the table says", async () => {
    const { cells, failures } = await matrix(want, "quyen");
    console.log(`bang-quyen-48-o: ${cells - failures.length}/${cells} ô khớp`);
    expect(cells).toBe(48);
    expect(failures).toEqual([]);
  });

  it("pha-thu-activate-moi-nguoi: an answer letting a listing agent put anyone's unit on sale names that cell", async () => {
    const loose: typeof want = (role, kind, change) =>
      role === "LA" && kind === "other" && change === "active" ? 200 : want(role, kind, change);
    const { failures } = await matrix(loose, "quyen_pha");
    expect(failures).toEqual(["bang-quyen-48-o: ListAgent·người khác·Active"]);
  });

  it("the database refuses Active on someone else's listing even when the server's own check is skipped (E5b)", async () => {
    const { w } = await apiWorld("csdl_giu");
    const id = await listing(w, { keeper: "TL" });
    const err = await asPerson(w, "LA", w.A, async (c) => {
      try {
        await c.query("update listings set standard_status = 'Active' where id = $1", [id]);
        return null;
      } catch (e) {
        return (e as { code?: string }).code ?? "?";
      }
    });
    expect(err).toBe("42501");
    expect((await rowOf(w, id)).standard_status).toBe("Incomplete");
  });
});

describe("ghi-gia-tang-phien-ban (E4)", () => {
  it("ghi-gia-tang-phien-ban: one PATCH saves the price with the version moved on and the confirmed time of the change", async () => {
    const { w, patch } = await apiWorld("gia");
    const id = await listing(w, { keeper: "LA" });
    const res = await patch("LA", id, { version: 1, change: BODY.price });
    expect(res.status).toBe(200);
    const after = await rowOf(w, id);
    expect(Number(after.list_price)).toBe(2_800_000_000);
    expect(after.version).toBe(2);
    expect(after.last_confirmed_at?.toISOString()).toBe(NOW.toISOString());
    // Another session of the same company reads the saved price.
    const read = await asPerson(w, "BA", w.A, (c) => readInventory(c, w.id.BA));
    expect(read.current.find((l) => l.id === id)?.listPrice).toBe(2_800_000_000);
  });

  it("refuses a change the rules refuse, a body it cannot read, a listing of another company (E4b)", async () => {
    const { w, patch } = await apiWorld("gia_sai");
    const id = await listing(w, { keeper: "LA" });
    const closed = await patch("LA", id, {
      version: 1,
      change: { field: "standardStatus", standardStatus: "Closed" },
    });
    expect(closed.status).toBe(400);
    expect((await patch("LA", id, { version: 1, change: { field: "listPrice" } })).status).toBe(
      400,
    );
    const ofB = await listing(w, { company: w.B });
    expect((await patch("LA", ofB, { version: 1, change: BODY.price })).status).toBe(404);
    expect((await rowOf(w, ofB)).version).toBe(1);
    expect((await rowOf(w, id)).version).toBe(1);
  });
});

describe("xung-dot-phien-ban (E6)", () => {
  it("xung-dot-phien-ban: a change on an old version is a conflict carrying the listing as it is now; nothing is overwritten", async () => {
    const { w, patch } = await apiWorld("xung");
    const id = await listing(w, { keeper: "LA", status: "Active" });
    expect((await patch("LA", id, { version: 1, change: BODY.price })).status).toBe(200);
    const second = await patch("TL", id, {
      version: 1,
      change: { field: "standardStatus", standardStatus: "Hold" },
    });
    expect(second.status).toBe(409);
    const body = (await second.json()) as { current: { version: number; listPrice: number } };
    expect(body.current.version).toBe(2);
    expect(body.current.listPrice).toBe(2_800_000_000);
    if ((await rowOf(w, id)).standard_status !== "Active")
      throw new Error("xung-dot-phien-ban: ghi đè");
  });

  it("hoan-tac-giu-trang-thai: undoing a price after a status change keeps the new status", async () => {
    const { w, patch } = await apiWorld("hoan");
    const id = await listing(w, { keeper: "LA", status: "Active", price: 3_000_000_000 });
    expect((await patch("LA", id, { version: 1, change: BODY.price })).status).toBe(200);
    expect(
      (
        await patch("LA", id, {
          version: 2,
          change: { field: "standardStatus", standardStatus: "Hold" },
        })
      ).status,
    ).toBe(200);
    // The undo of the price names only the price, on the latest version.
    expect(
      (
        await patch("LA", id, {
          version: 3,
          change: { field: "listPrice", listPrice: 3_000_000_000 },
        })
      ).status,
    ).toBe(200);
    const after = await rowOf(w, id);
    expect(after.standard_status).toBe("Hold");
    expect(Number(after.list_price)).toBe(3_000_000_000);
  });
});

describe("dieu-kien-phi-luu (E7b)", () => {
  it("dieu-kien-phi-luu: the fee inclusion is saved through the same PATCH and read back", async () => {
    const { w, patch } = await apiWorld("phi");
    const id = await listing(w, { keeper: "BA", fee: "Included" });
    expect((await patch("BA", id, { version: 1, change: BODY.fee })).status).toBe(200);
    expect((await rowOf(w, id)).fee_inclusion).toBe("Excluded");
    const read = await asPerson(w, "LA", w.A, (c) => readInventory(c, w.id.LA));
    expect(read.current.find((l) => l.id === id)?.feeInclusion).toBe("Excluded");
  });

  it("a role without updateListing does not change it (E7b)", async () => {
    const { w, patch } = await apiWorld("phi_ca");
    const id = await listing(w, { fee: "Included" });
    expect((await patch("CA", id, { version: 1, change: BODY.fee })).status).toBe(403);
    expect((await rowOf(w, id)).fee_inclusion).toBe("Included");
  });
});

describe("nam-nghin-can (E10)", () => {
  it("nam-nghin-can: 5,000 listings of one company are read under 1.5 s, and the other company still sees none of them", async () => {
    const { w } = await apiWorld("nam_nghin");
    const o = w.db.owner;
    await o.query(
      "insert into catalog_nodes (slug, node_type, name) values ('mau-lon', 'project', '[MAU] Lớn')",
    );
    await o.query(
      "insert into catalog_buildings (building_key, subdivision_key, building_name, upi) values ('bld_00000000000000000000009999', 'mau-lon', '[MAU] Toà lớn', 'upi-lon')",
    );
    await o.query(
      `insert into catalog_units (unit_key, upi, subdivision_key, building_key, building_name, unit_number, property_type,
                                  property_sub_type, living_area, bedrooms_total)
       select 'unt_' || lpad(g::text, 26, '0'), 'upi-lon-' || g, 'mau-lon', 'bld_00000000000000000000009999',
              '[MAU] Toà lớn', 'L-' || g, 'Residential', 'Condominium', 70, 2
         from generate_series(1, 5000) g`,
    );
    await o.query(
      `insert into listings (id, company_id, standard_status, list_price)
       select ('00000000-0000-4000-8000-' || lpad(g::text, 12, '0'))::uuid, $1, 'Active', 3000000000
         from generate_series(1, 5000) g`,
      [w.A],
    );
    await o.query(
      `insert into listing_units (listing_id, company_id, upi, open)
       select ('00000000-0000-4000-8000-' || lpad(g::text, 12, '0'))::uuid, $1, 'upi-lon-' || g, true
         from generate_series(1, 5000) g`,
      [w.A],
    );
    const started = performance.now();
    const read = await asPerson(w, "LA", w.A, (c) => readInventory(c, w.id.LA));
    const ms = performance.now() - started;
    console.log(`nam-nghin-can: ${read.current.length} căn trong ${Math.round(ms)} ms`);
    expect(read.current).toHaveLength(5000);
    expect(ms).toBeLessThan(1500);
    const other = await asPerson(w, "Y", w.B, (c) => readInventory(c, w.id.Y));
    expect(other.current).toHaveLength(0);
  });
});

describe("cach-ly-hai-bang (E1b)", () => {
  it("cach-ly-hai-bang: a session of company B reads and changes A's listing by id — 0 rows seen, 0 rows changed", async () => {
    const { w, patch } = await apiWorld("cach_ly");
    const id = await listing(w, { keeper: "LA" });
    const seen = await asPerson(w, "Y", w.B, async (c) => ({
      listings: (await c.query("select id from listings where id = $1", [id])).rows.length,
      links: (await c.query("select listing_id from listing_units where listing_id = $1", [id]))
        .rows.length,
      changed: (await c.query("update listings set list_price = 1 where id = $1", [id])).rowCount,
    }));
    expect(seen).toEqual({ listings: 0, links: 0, changed: 0 });
    expect((await patch("Y", id, { version: 1, change: BODY.price }, w.B)).status).toBe(403);
    expect((await rowOf(w, id)).version).toBe(1);
  });
});

/** Three writes that break a rule of the data, written as the table owner: each refused by the table itself. */
async function dataRules(w: World, upi: string): Promise<string[]> {
  const out: string[] = [];
  // Refused by the rule named, not by anything else: the error must carry that constraint's name.
  const refused = async (label: string, rule: string, sql: string, values: unknown[]) => {
    await w.db.owner.query("begin");
    try {
      await w.db.owner.query(sql, values);
      out.push(`luat-du-lieu-ba-ca: ${label}`);
    } catch (err) {
      const got = (err as { constraint?: string }).constraint;
      if (got !== rule)
        out.push(`luat-du-lieu-ba-ca: ${label} (lỗi khác: ${got ?? (err as Error).message})`);
    } finally {
      await w.db.owner.query("rollback");
    }
  };
  await refused(
    "Closed thiếu giá chốt",
    "listings_closed_needs_price_and_date",
    "insert into listings (id, company_id, standard_status, close_date) values ($1, $2, 'Closed', '2026-11-01')",
    [crypto.randomUUID(), w.A],
  );
  await refused(
    "Withdrawn thiếu lý do",
    "listings_withdrawn_needs_reason",
    "insert into listings (id, company_id, standard_status) values ($1, $2, 'Withdrawn')",
    [crypto.randomUUID(), w.A],
  );
  await refused(
    "căn thứ hai đang mở",
    "listing_units_one_open",
    "with l as (insert into listings (id, company_id, standard_status) values ($1, $2, 'Incomplete') returning id) " +
      "insert into listing_units (listing_id, company_id, upi, open) select id, $2, $3, true from l",
    [crypto.randomUUID(), w.A, upi],
  );
  return out;
}

const upiOf = async (w: World, id: string) =>
  (
    await w.db.owner.query<{ upi: string }>("select upi from listing_units where listing_id = $1", [
      id,
    ])
  ).rows[0]!.upi;

describe("luat-du-lieu-ba-ca (E1b)", () => {
  it("luat-du-lieu-ba-ca: Closed without a close price, Withdrawn without a reason, a second open listing — all refused", async () => {
    const { w } = await apiWorld("luat");
    const id = await listing(w, { keeper: "LA" });
    expect(await dataRules(w, await upiOf(w, id))).toEqual([]);
  });

  it("pha-thu-bo-check-da-ban: without the Closed rule the case names it", async () => {
    const { w } = await apiWorld("luat_pha");
    const id = await listing(w, { keeper: "LA" });
    await w.db.owner.query(
      "alter table listings drop constraint listings_closed_needs_price_and_date",
    );
    expect(await dataRules(w, await upiOf(w, id))).toEqual([
      "luat-du-lieu-ba-ca: Closed thiếu giá chốt",
    ]);
  });
});

describe("loi-doc-that (E2)", () => {
  it("loi-doc-that: when the app role loses select on listings, the read gives «unreadable» and does not throw", async () => {
    const { w } = await apiWorld("loi_doc");
    await listing(w, { keeper: "LA" });
    const door = {
      pool: w.pool,
      ctx: { userId: w.id.LA, companyId: w.A },
      scope: "company" as const,
    };
    expect((await inventoryThrough(door, withCompany)).kind).toBe("ready");
    await w.db.owner.query("revoke select on listings from quy_hang_app");
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(await inventoryThrough(door, withCompany)).toEqual({ kind: "unreadable" });
    error.mockRestore();
  });
});

describe("doi-san-chi-con-san-moi (E2)", () => {
  it("doi-san-chi-con-san-moi: one person in two companies reads only the company of the session", async () => {
    const { w } = await apiWorld("doi_san");
    const ofA = await listing(w, { company: w.A });
    const ofB = await listing(w, { company: w.B });
    const inA = await asPerson(w, "X", w.A, (c) => readInventory(c, w.id.X));
    const inB = await asPerson(w, "X", w.B, (c) => readInventory(c, w.id.X));
    expect(inA.current.map((l) => l.id)).toEqual([ofA]);
    expect(inB.current.map((l) => l.id)).toEqual([ofB]);
  });
});
