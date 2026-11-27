// Row 3h (tin-rao-giu-gia-tri-rieng), evals E1b, E6, E10, E11 in the database: a listing's own unit values read through
// the real inventory read, written and taken back through PATCH /api/v1/listings/[id], the unit link moved («Gắn sang
// căn khác»), and the shared catalog untouched — through the identity module's door, withCompany, under the API role,
// on this lane's Postgres (migration 017). Company A holds the people of the permission-table world (LA, BA, TL, CA).
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
import { effectiveAttributes } from "@/modules/listings/unit-attributes";

import { asPerson, dropWorld, world, type Person, type World } from "./bang-quyen-world";

// The catalog's server door is imported by the read; outside Next.js its "server-only" guard has nothing to guard.
vi.mock("server-only", () => ({}));

const worlds: World[] = [];
afterEach(async () => {
  for (const w of worlds.splice(0)) await dropWorld(w);
});

const ORIGIN = "http://127.0.0.1:3489";
const NOW = new Date("2026-11-27T03:00:00.000Z");

/** Catalog units with an area and a bedroom count, so an own value can differ from the catalog's. */
const UNITS = sampleCatalog().units.filter(
  (u) => u.livingArea !== undefined && u.bedroomsTotal !== undefined,
);

async function apiWorld(suffix: string) {
  const w = await world(`gia_tri_rieng_${suffix}`);
  worlds.push(w);
  for (const s of catalogLoadStatements(sampleCatalog())) await w.db.owner.query(s.text, s.values);
  const code = captureSender();
  const deps: LoginDeps = {
    pool: w.pool,
    secret: "test-secret-gia-tri-rieng",
    sender: code.sender,
  };
  const auth = createAuthHandlers(() => deps);
  const door = (r: Request, action: ActionName) => openDoor(() => w.pool, tokenFrom(r), action);
  const h = createListingsHandlers({ door, withCompany, now: () => NOW });
  const cookies = new Map<string, string>();
  const send = (url: string, method: string, body: unknown, c?: string) =>
    new Request(url, {
      method,
      headers: { "content-type": "application/json", ...(c ? { cookie: c } : {}) },
      body: JSON.stringify(body),
    });
  const cookie = async (who: Person): Promise<string> => {
    const have = cookies.get(who);
    if (have) return have;
    const email = w.email[who];
    await auth.requestCode(send(`${ORIGIN}/api/v1/auth/code`, "POST", { email }));
    const otp = [...code.sent]
      .reverse()
      .find((m) => m.email === email)
      ?.text.match(/\b\d{6}\b/)?.[0];
    const res = await auth.verifyCode(
      send(`${ORIGIN}/api/v1/auth/session`, "POST", { email, code: otp }),
    );
    if (!res.ok) throw new Error(`đăng nhập ${who} trả ${res.status}`);
    const c = (res.headers.get("set-cookie") ?? "").split(";")[0]!;
    const json = (await res.json()) as { company: { id: string } | null };
    if (json.company?.id !== w.A) {
      const chosen = await auth.chooseCompany(
        send(`${ORIGIN}/api/v1/auth/session/company`, "PUT", { companyId: w.A }, c),
      );
      if (!chosen.ok) throw new Error(`chọn sàn của ${who} trả ${chosen.status}`);
    }
    cookies.set(who, c);
    return c;
  };
  const patch = async (who: Person, id: string, body: unknown) =>
    h.change(send(`${ORIGIN}/api/v1/listings/${id}`, "PATCH", body, await cookie(who)), id);
  const used = new Set<string>();
  /** One listing of company A on a unit no other listing of this world uses; its own values as given. */
  const listing = async (
    over: { status?: string; own?: Record<string, unknown>; upi?: string } = {},
  ) => {
    const upi = over.upi ?? UNITS.find((u) => !used.has(u.upi))!.upi;
    used.add(upi);
    const id = crypto.randomUUID();
    const own = over.own ?? {};
    const cols = Object.keys(own);
    const closed = over.status === "Closed";
    await w.db.owner.query(
      `insert into listings (id, company_id, standard_status, list_price, close_price, close_date
                             ${cols.map((c) => `, ${c}`).join("")})
       values ($1, $2, $3, 3000000000, $4, $5 ${cols.map((_, i) => `, $${i + 6}`).join("")})`,
      [
        id,
        w.A,
        over.status ?? "Incomplete",
        closed ? 3000000000 : null,
        closed ? "2026-11-01" : null,
        ...Object.values(own),
      ],
    );
    await w.db.owner.query(
      "insert into listing_units (listing_id, company_id, upi, open) values ($1, $2, $3, $4)",
      [id, w.A, upi, !closed],
    );
    return { id, upi };
  };
  const version = async (id: string) =>
    (
      await w.db.owner.query<{ version: number }>("select version from listings where id = $1", [
        id,
      ])
    ).rows[0]!.version;
  const catalogHash = async () =>
    (
      await w.db.owner.query<{ n: string; h: string }>(
        "select count(*)::text as n, md5(string_agg(t::text, '|' order by upi)) as h from catalog_units t",
      )
    ).rows[0]!;
  return { w, patch, listing, version, catalogHash };
}

describe("doc-gia-tri-rieng (E1b)", () => {
  it("doc-gia-tri-rieng: the real read carries own values and sources; a listing without one follows the catalog", async () => {
    const { w, listing } = await apiWorld("doc");
    const unit = UNITS[0]!;
    const mine = await listing({
      upi: unit.upi,
      own: {
        bedrooms_total: unit.bedroomsTotal! + 1,
        bedrooms_total_source: "Typed",
        living_area: 72.5,
        living_area_source: "File",
      },
    });
    const plain = await listing();
    const read = await asPerson(w, "LA", w.A, (c) => readInventory(c, w.id.LA));
    const byId = new Map(read.current.map((l) => [l.id, l]));
    const own = byId.get(mine.id)!;
    expect(own).toMatchObject({
      bedroomsTotal: unit.bedroomsTotal! + 1,
      bedroomsTotalSource: "Typed",
      livingArea: 72.5,
      livingAreaSource: "File",
    });
    expect(byId.get(plain.id)).not.toHaveProperty("bedroomsTotal");
    // One reader decides what every screen shows: the own value wins, the catalog's stays beside it.
    const units = new Map(read.units.map((u) => [u.upi, u]));
    const shown = effectiveAttributes(own, units.get(unit.upi)!);
    expect(shown.bedroomsTotal).toMatchObject({
      value: unit.bedroomsTotal! + 1,
      source: "Typed",
      catalogValue: unit.bedroomsTotal,
      differs: true,
    });
    // A filter on the shown bedroom count finds the listing by its own value, not by the catalog's.
    const withBedrooms = (n: number) =>
      read.current.filter(
        (l) =>
          effectiveAttributes(
            l,
            units.get(read.listingUnits.find((x) => x.listingId === l.id)!.upi)!,
          ).bedroomsTotal.value === n,
      );
    expect(withBedrooms(unit.bedroomsTotal! + 1).map((l) => l.id)).toContain(mine.id);
    expect(withBedrooms(unit.bedroomsTotal!).map((l) => l.id)).not.toContain(mine.id);
  });
});

describe("sua-lay-lai-theo-vai (E2, E11)", () => {
  it("sua-lay-lai-theo-vai: four roles × write, take back, move — 200 with updateListing, 403 without", async () => {
    const { listing, patch, version, catalogHash } = await apiWorld("vai");
    const before = await catalogHash();
    const allowed: Record<string, number> = {};
    for (const who of ["LA", "BA", "TL", "CA"] as const) {
      const l = await listing();
      const free = await listing();
      // The free unit has no open listing once its listing is withdrawn by the owner.
      await patch("LA", free.id, {
        version: 1,
        change: {
          field: "standardStatus",
          standardStatus: "Withdrawn",
          withdrawnReason: "unreachable",
        },
      });
      const write = await patch(who, l.id, {
        version: await version(l.id),
        change: { field: "unitAttributes", livingArea: 72.5 },
      });
      const back = await patch(who, l.id, {
        version: await version(l.id),
        change: { field: "unitAttributes", livingArea: null },
      });
      const move = await patch(who, l.id, {
        version: await version(l.id),
        change: { field: "unit", upi: free.upi },
      });
      allowed[`${who} sửa`] = write.status;
      allowed[`${who} lấy lại`] = back.status;
      allowed[`${who} gắn`] = move.status;
    }
    expect(allowed).toEqual({
      "LA sửa": 200,
      "LA lấy lại": 200,
      "LA gắn": 200,
      "BA sửa": 200,
      "BA lấy lại": 200,
      "BA gắn": 200,
      "TL sửa": 200,
      "TL lấy lại": 200,
      "TL gắn": 200,
      "CA sửa": 403,
      "CA lấy lại": 403,
      "CA gắn": 403,
    });
    // No command of the company changes one row of the shared catalog (E6).
    expect(await catalogHash()).toEqual(before);
  });

  it("hai-nguoi-cung-sua: a write on an older version is a conflict and the stored value stays", async () => {
    const { w, listing, patch } = await apiWorld("xung-dot");
    const l = await listing();
    const first = await patch("LA", l.id, {
      version: 1,
      change: { field: "listPrice", listPrice: 2_900_000_000 },
    });
    expect(first.status).toBe(200);
    const late = await patch("BA", l.id, {
      version: 1,
      change: { field: "unitAttributes", livingArea: 80 },
    });
    expect(late.status).toBe(409);
    const { rows } = await w.db.owner.query<{ living_area: string | null }>(
      "select living_area from listings where id = $1",
      [l.id],
    );
    expect(rows[0]!.living_area).toBeNull();
  });
});

describe("danh-muc-khong-de (E6)", () => {
  it("danh-muc-khong-de: the catalog changes its value; own values stay to the byte, a listing without one follows", async () => {
    const { w, listing } = await apiWorld("danh-muc");
    const [u1, u2] = [UNITS[0]!, UNITS[1]!];
    const typed = await listing({
      upi: u1.upi,
      own: { living_area: 72.5, living_area_source: "Typed" },
    });
    const plain = await listing({ upi: u2.upi });
    const ownBefore = (
      await w.db.owner.query("select living_area, living_area_source from listings where id = $1", [
        typed.id,
      ])
    ).rows[0];
    await w.db.owner.query("update catalog_units set living_area = 99 where upi in ($1, $2)", [
      u1.upi,
      u2.upi,
    ]);
    const ownAfter = (
      await w.db.owner.query("select living_area, living_area_source from listings where id = $1", [
        typed.id,
      ])
    ).rows[0];
    expect(ownAfter).toEqual(ownBefore);
    const read = await asPerson(w, "LA", w.A, (c) => readInventory(c, w.id.LA));
    const units = new Map(read.units.map((u) => [u.upi, u]));
    const shownOf = (id: string, upi: string) =>
      effectiveAttributes(
        read.current.find((l) => l.id === id)!,
        units.get(upi)!,
      ).livingArea;
    expect(shownOf(typed.id, u1.upi)).toMatchObject({
      value: 72.5,
      source: "Typed",
      catalogValue: 99,
    });
    expect(shownOf(plain.id, u2.upi)).toMatchObject({ value: 99, source: "Catalog" });
  });
});

describe("gan-sang-can-khac (E10)", () => {
  it("gan-sang-can-khac: the link moves, own values stay; a unit with an open listing or a sold listing is refused", async () => {
    const { w, listing, patch, version } = await apiWorld("gan");
    const l = await listing({ own: { bedrooms_total: 2, bedrooms_total_source: "Typed" } });
    const taken = await listing();
    const free = UNITS[UNITS.length - 1]!;
    const refused = await patch("LA", l.id, {
      version: await version(l.id),
      change: { field: "unit", upi: taken.upi },
    });
    expect(refused.status).toBe(400);
    const takenUnit = UNITS.find((u) => u.upi === taken.upi)!;
    expect(((await refused.json()) as { why: unknown }).why).toEqual({
      rule: "unit-open",
      unitNumber: takenUnit.unitNumber,
    });
    const moved = await patch("LA", l.id, {
      version: await version(l.id),
      change: { field: "unit", upi: free.upi },
    });
    expect(moved.status).toBe(200);
    const { rows } = await w.db.owner.query<{ upi: string; bedrooms_total: number }>(
      `select u.upi, l.bedrooms_total from listings l join listing_units u on u.listing_id = l.id where l.id = $1`,
      [l.id],
    );
    expect(rows[0]).toEqual({ upi: free.upi, bedrooms_total: 2 });
    const sold = await listing({ status: "Closed" });
    const locked = await patch("LA", sold.id, {
      version: await version(sold.id),
      change: { field: "unit", upi: UNITS[UNITS.length - 2]!.upi },
    });
    expect(locked.status).toBe(400);
    expect(((await locked.json()) as { why: unknown }).why).toEqual({ rule: "locked" });
  });
});
