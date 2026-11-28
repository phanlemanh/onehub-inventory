// Row 3h (tin-rao-giu-gia-tri-rieng), evals E1b, E6, E10, E11 in the database: a listing's own unit values read through
// the real inventory read, written and taken back through PATCH /api/v1/listings/[id], the unit link moved («Gắn sang
// căn khác»), and the shared catalog untouched — through the identity module's door, withCompany, under the API role,
// on this lane's Postgres (migration 020). Company A holds the people of the permission-table world (LA, BA, TL, CA).
import { afterEach, describe, expect, it, vi } from "vitest";

import { sampleCatalog } from "@/modules/catalog";
import { catalogLoadStatements } from "@/modules/catalog/load-sql";
import { openDoor } from "@/modules/identity/action-door";
import { createAuthHandlers, tokenFrom } from "@/modules/identity/http";
import type { LoginDeps } from "@/modules/identity/login";
import type { ActionName } from "@/modules/identity/permissions";
import { captureSender } from "@/modules/identity/sender";
import { withCompany } from "@/modules/identity/with-company";
import { matchPendingUnits } from "@/modules/company-config/server";
import { createImportsHandlers } from "@/modules/imports/imports-http";
import { NO_CHOICES, valueKey } from "@/modules/imports";
import {
  asImporter,
  listingIdOf,
  rereadImportValues,
  type RunAsImporter,
} from "@/modules/imports/server";
import { readInventory } from "@/modules/listings/inventory-read";
import { createListingsHandlers } from "@/modules/listings/listings-http";
import {
  effectiveAttributes,
  ownAttributesOf,
  sameAttribute,
  UNIT_ATTRIBUTE_FIELDS,
} from "@/modules/listings/unit-attributes";

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
  const cookie = async (who: Person, company = w.A): Promise<string> => {
    const have = cookies.get(who + company);
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
    if (json.company?.id !== company) {
      const chosen = await auth.chooseCompany(
        send(`${ORIGIN}/api/v1/auth/session/company`, "PUT", { companyId: company }, c),
      );
      if (!chosen.ok) throw new Error(`chọn sàn của ${who} trả ${chosen.status}`);
    }
    cookies.set(who + company, c);
    return c;
  };
  const patch = async (who: Person, id: string, body: unknown, company = w.A) =>
    h.change(
      send(`${ORIGIN}/api/v1/listings/${id}`, "PATCH", body, await cookie(who, company)),
      id,
    );
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
  // Row 3h, tasks 6–7: the import's real handlers (row 11), with the same sign-in.
  const imports = createImportsHandlers({ door, withCompany });
  const importAs = (who: Person) => async (path: string, body: unknown, id?: string) => {
    const r = send(`${ORIGIN}/api/v1/imports${path}`, "POST", body, await cookie(who));
    const res =
      path === "/preview"
        ? await imports.preview(r)
        : path === ""
          ? await imports.open(r)
          : await imports.batch(r, id!);
    return { status: res.status, body: (await res.json()) as Record<string, unknown> };
  };
  return { w, patch, listing, version, catalogHash, importAs };
}

type ApiWorld = Awaited<ReturnType<typeof apiWorld>>;

/** Three catalog units by their original code, with what the catalog says of their area. */
async function codedUnits(w: World) {
  return (
    await w.db.owner.query<{ code: string; upi: string; unit_key: string; living_area: string }>(
      `select a.value as code, u.upi, u.unit_key, u.living_area::text
         from catalog_aliases a join catalog_units u on u.unit_key = a.object_key
        where a.kind = 'ma_goc' and u.living_area is not null
        order by a.value limit 2`,
    )
  ).rows;
}

const IMPORT_HEADERS = ["Mã căn", "Block", "DT", "Tầng", "PN", "Hướng", "Loại hình"];

/**
 * One import through the real door of row 11, as the list agent: row 0 on a catalog unit with an area other than the
 * catalog's, row 1 on a catalog unit with the catalog's own area and «2PN» in Loại hình (kept as written), row 2 on a
 * pending unit. Returns the import's id and the listing id of each row.
 */
async function importThree(
  e: ApiWorld,
  units: Awaited<ReturnType<typeof codedUnits>>,
  /** The person's answer for «2PN» in Loại hình: none by default, the cell stays kept as written. */
  subTypeAnswer: string | null = null,
) {
  const run = e.importAs("LA");
  const rows = [
    [units[0]!.code, "[MAU] Toà", "72.5", "15a", "2", "Đông Nam", "Chung cư"],
    [units[1]!.code, "[MAU] Toà", units[1]!.living_area, "7", "3", "Tây Bắc", "2PN"],
    ["SA5-99.99", "Sapphire 9", "80", "", "1", "", ""],
  ];
  const choices = {
    ...NO_CHOICES,
    columns: { 1: { target: { standard: "Unit.buildingName" } } },
    values: { [valueKey(6, "2PN")]: { value: subTypeAnswer, remember: false } },
    units: { "sa5-99.99": { pending: true } },
  };
  const preview = await run("/preview", { headers: IMPORT_HEADERS, rows, choices });
  expect(preview.status).toBe(200);
  const p = preview.body as { counts: Record<string, number>; createCount: number };
  const open = await run("", {
    headers: IMPORT_HEADERS,
    rows,
    choices,
    fileName: "bang-hang.xlsx",
    sheetName: "Sheet1",
    expected: { ...p.counts, createCount: p.createCount },
  });
  expect(open.status).toBe(201);
  const id = (open.body as { id: string }).id;
  const batch = await run(
    `/${id}/batches`,
    { headers: IMPORT_HEADERS, rows, choices, batchNo: 0, rowOffset: 0, last: true },
    id,
  );
  expect(batch.status).toBe(200);
  expect(batch.body["created"]).toBe(3);
  return { id, preview: preview.body, ids: [0, 1, 2].map((r) => listingIdOf(id, r)) };
}

const OWN_COLUMNS = `living_area::float8 as living_area, living_area_source, floor, floor_source, bedrooms_total,
  bedrooms_total_source, direction_faces, direction_faces_source, property_sub_type, property_sub_type_source`;
const ownOf = async (w: World, id: string) =>
  (await w.db.owner.query(`select ${OWN_COLUMNS} from listings where id = $1`, [id])).rows[0];

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

describe("san-khac-khong-cham (E11, SP-1)", () => {
  it("san-khac-khong-cham: a person of B who may change listings reaches no listing of A through the two new doors", async () => {
    const { w, listing, patch } = await apiWorld("san-khac");
    // Y becomes a listing agent of B, so the door opens and only the company's rows stand between Y and A's listing.
    await w.db.owner.query(
      "update company_members set roles = '{ListAgent}' where company_id = $1 and user_id = $2",
      [w.B, w.id.Y],
    );
    const l = await listing({ own: { living_area: 72.5, living_area_source: "Typed" } });
    const free = UNITS.find((u) => u.upi !== l.upi)!;
    const before = (
      await w.db.owner.query(
        `select l.living_area, l.living_area_source, l.version, u.upi
           from listings l join listing_units u on u.listing_id = l.id where l.id = $1`,
        [l.id],
      )
    ).rows[0];
    const write = await patch(
      "Y",
      l.id,
      { version: 1, change: { field: "unitAttributes", livingArea: 99 } },
      w.B,
    );
    const back = await patch(
      "Y",
      l.id,
      { version: 1, change: { field: "unitAttributes", livingArea: null } },
      w.B,
    );
    const move = await patch(
      "Y",
      l.id,
      { version: 1, change: { field: "unit", upi: free.upi } },
      w.B,
    );
    expect([write.status, back.status, move.status]).toEqual([404, 404, 404]);
    const after = (
      await w.db.owner.query(
        `select l.living_area, l.living_area_source, l.version, u.upi
           from listings l join listing_units u on u.listing_id = l.id where l.id = $1`,
        [l.id],
      )
    ).rows[0];
    expect(after).toEqual(before);
  });
});

describe("nhap-tep-gia-tri-tep (E7, E8)", () => {
  it("nhap-tep-gia-tri-tep: a new import writes each read cell as an own value from a file; «2PN» stays kept; the preview marks the one differing area", async () => {
    const e = await apiWorld("nhap_tep");
    const units = await codedUnits(e.w);
    const { id, preview, ids } = await importThree(e, units);
    expect(await ownOf(e.w, ids[0]!)).toEqual({
      living_area: 72.5,
      living_area_source: "File",
      floor: "15A",
      floor_source: "File",
      bedrooms_total: 2,
      bedrooms_total_source: "File",
      direction_faces: "Đông Nam",
      direction_faces_source: "File",
      property_sub_type: "Condominium",
      property_sub_type_source: "File",
    });
    // «2PN» is not a property sub type: no value, the cell stays kept as written.
    expect(await ownOf(e.w, ids[1]!)).toMatchObject({
      bedrooms_total: 3,
      bedrooms_total_source: "File",
      property_sub_type: null,
      property_sub_type_source: null,
    });
    const kept = (
      await e.w.db.owner.query<{ kept: { row: number; header: string; raw: string }[] }>(
        "select kept from import_runs where id = $1",
        [id],
      )
    ).rows[0]!.kept;
    expect(kept).toContainEqual(
      expect.objectContaining({ row: 1, header: "Loại hình", raw: "2PN" }),
    );
    // A pending unit takes its file values too.
    expect(await ownOf(e.w, ids[2]!)).toMatchObject({ living_area: 80, bedrooms_total: 1 });
    // The preview: only row 0's area differs from its catalog unit, and the file's value is still the one written.
    const cells = (preview as { cells: { value: unknown; catalog?: unknown }[][] }).cells;
    const marked = cells.flatMap((row, r) =>
      row.flatMap((c, j) => (c.catalog === undefined ? [] : [{ r, j, c }])),
    );
    // Row 0's area differs and carries the catalog's; row 1's area is the catalog's own, so no mark. Every marked cell
    // really differs (the other columns of these rows follow what the catalog says of each unit).
    expect(marked).toContainEqual({
      r: 0,
      j: 2,
      c: expect.objectContaining({ value: 72.5, catalog: Number(units[0]!.living_area) }),
    });
    expect(marked.some((m) => m.r === 1 && m.j === 2)).toBe(false);
    expect(marked.some((m) => m.r === 2)).toBe(false);
    for (const m of marked)
      expect(sameAttribute(m.c.value, m.c.catalog), `${m.r}:${m.j}`).toBe(false);
  });
});

/**
 * An import as it stood before row 3h: its unit attribute cells kept only as written, no own value on its listings, and
 * not read again yet (021: an import made since the row is marked read when it is made).
 */
async function asImportBefore3h(e: ApiWorld, id: string): Promise<void> {
  await e.w.db.owner.query(
    `update listings set living_area = null, living_area_source = null, floor = null, floor_source = null,
       bedrooms_total = null, bedrooms_total_source = null, direction_faces = null, direction_faces_source = null,
       property_sub_type = null, property_sub_type_source = null where import_run_id = $1`,
    [id],
  );
  await e.w.db.owner.query("update import_runs set file_values_read_at = null where id = $1", [id]);
}

describe("doc-lai-lan-nhap-cu (E7)", () => {
  it("doc-lai-lan-nhap-cu: an import made before the row is read again — values from the file where none, a typed listing kept, twice the same; a broken kept is named", async () => {
    const e = await apiWorld("doc_lai");
    const units = await codedUnits(e.w);
    const { id, ids } = await importThree(e, units);
    await asImportBefore3h(e, id);
    // The company types a bedroom count on row 1's listing.
    const typed = await e.patch("LA", ids[1]!, {
      version: await e.version(ids[1]!),
      change: { field: "unitAttributes", bedroomsTotal: 4 },
    });
    expect(typed.status).toBe(200);
    // Row 2's listing was withdrawn since: its details are locked, so the file gives it nothing (Review Focus 4).
    await e.w.db.owner.query(
      "update listings set standard_status = 'Withdrawn', withdrawn_reason = 'unreachable' where id = $1",
      [ids[2]],
    );
    const first = await rereadImportValues(e.w.db.owner, asImporter(e.w.pool));
    expect(first).toMatchObject({ imports: 1, listingsSet: 1, typedKept: 1, lockedKept: 1 });
    expect(await ownOf(e.w, ids[2]!)).toMatchObject({ living_area: null, bedrooms_total: null });
    expect(await ownOf(e.w, ids[0]!)).toMatchObject({
      living_area: 72.5,
      living_area_source: "File",
      floor: "15A",
      property_sub_type: "Condominium",
    });
    expect(await ownOf(e.w, ids[1]!)).toMatchObject({
      bedrooms_total: 4,
      bedrooms_total_source: "Typed",
      living_area: null,
      direction_faces: null,
    });
    // Not a person's change: the import still counts the listing as untouched.
    expect(await e.version(ids[0]!)).toBe(1);
    const before = await e.w.db.owner.query(`select ${OWN_COLUMNS} from listings order by id`);
    // Read once (021): the second run skips the import it has read.
    const second = await rereadImportValues(e.w.db.owner, asImporter(e.w.pool));
    expect(second).toMatchObject({ imports: 0, listingsSet: 0, typedKept: 0, lockedKept: 0 });
    expect(
      (await e.w.db.owner.query(`select ${OWN_COLUMNS} from listings order by id`)).rows,
    ).toEqual(before.rows);
    // A kept list of another shape stops the run with the import's name, never reads as nothing to do.
    await e.w.db.owner.query(
      `update import_runs set kept = jsonb_build_array(jsonb_build_object('rij', 0, 'header', 'DT', 'raw', '70',
         'why', 'unit-attribute')), file_values_read_at = null where id = $1`,
      [id],
    );
    await expect(rereadImportValues(e.w.db.owner, asImporter(e.w.pool))).rejects.toThrow(
      `kept shape unread: import ${id}`,
    );
  });
});

describe("can-cho-khop (E9)", () => {
  it("can-cho-khop: a listing on a pending unit keeps its typed values without a mark; matched, its values stay and only the differing one is marked", async () => {
    const e = await apiWorld("can_cho");
    const units = await codedUnits(e.w);
    const { ids } = await importThree(e, units);
    const pending = ids[2]!;
    const target = (
      await e.w.db.owner.query<{
        unit_key: string;
        upi: string;
        living_area: string;
        bedrooms_total: number;
        floor: string;
        direction_faces: string;
        property_sub_type: string;
      }>(
        `select unit_key, upi, living_area::text, bedrooms_total, floor, direction_faces, property_sub_type
           from catalog_units
          where living_area is not null and bedrooms_total is not null and floor is not null
            and direction_faces is not null and property_sub_type is not null and upi <> all($1)
          order by unit_key limit 1`,
        [units.map((u) => u.upi)],
      )
    ).rows[0]!;
    const typed = await e.patch("LA", pending, {
      version: await e.version(pending),
      change: {
        field: "unitAttributes",
        livingArea: Number(target.living_area) + 5,
        // Every value but the area is the one the catalog will lend: only the area may differ after the match.
        floor: target.floor,
        bedroomsTotal: target.bedrooms_total,
        directionFaces: target.direction_faces,
        propertySubType: target.property_sub_type,
      },
    });
    expect(typed.status).toBe(200);
    const shown = async () => {
      const read = await asPerson(e.w, "LA", e.w.A, (c) => readInventory(c, e.w.id.LA));
      const l = read.current.find((x) => x.id === pending)!;
      const upi = read.listingUnits.find((x) => x.listingId === pending)!.upi;
      return {
        l,
        a: effectiveAttributes(
          l,
          read.units.find((u) => u.upi === upi),
        ),
      };
    };
    const waiting = await shown();
    for (const f of UNIT_ATTRIBUTE_FIELDS) {
      expect(waiting.a[f].source, f).toBe("Typed");
      expect(waiting.a[f].differs, f).toBe(false);
    }
    // «Gắn sang căn khác» has no catalog link to move on a pending unit: refused, nothing changes.
    const moved = await e.patch("LA", pending, {
      version: await e.version(pending),
      change: { field: "unit", upi: units[0]!.upi },
    });
    expect(moved.status).toBe(400);
    // The catalog now knows the code: the company matches its pending units.
    await e.w.db.owner.query(
      "insert into catalog_aliases (object_key, kind, value, source) values ($1, 'ma_goc', 'SA5-99.99', 'test')",
      [target.unit_key],
    );
    // Committed, as the company layer's own route does it (asPerson rolls back).
    const m = await withCompany(e.w.pool, { userId: e.w.id.LA, companyId: e.w.A }, (c) =>
      matchPendingUnits((fn) => fn(c)),
    );
    expect(m.matched).toBe(1);
    const after = await shown();
    expect(ownAttributesOf(after.l)).toEqual(ownAttributesOf(waiting.l));
    const differing = UNIT_ATTRIBUTE_FIELDS.filter((f) => after.a[f].differs);
    expect(differing).toEqual(["livingArea"]);
    expect(after.a.livingArea.catalogValue).toBe(Number(target.living_area));
    // The matched pending unit keeps its open listing on the pending link: it counts for the catalog unit too, so
    // «Gắn sang căn khác» refuses to put a second open listing there (Listing rule one-open-listing; S4-r1).
    const onto = await e.patch("LA", ids[0]!, {
      version: await e.version(ids[0]!),
      change: { field: "unit", upi: target.upi },
    });
    expect(onto.status, "a second open listing on the matched unit").toBe(400);
    expect(((await onto.json()) as { why: { rule: string } }).why.rule).toBe("unit-open");
  });
});

describe("cung-san-khac-nguoi-giu (E11, G-2811-24)", () => {
  it("cung-san-khac-nguoi-giu: one company, another keeper — the two doors follow the signed table; the admin changes nothing", async () => {
    const e = await apiWorld("cung_san");
    const [from, to] = UNITS.slice(-2);
    const id = crypto.randomUUID();
    // The listing is kept by A's team lead; the listing agent LA does not keep it.
    await e.w.db.owner.query(
      `insert into listings (id, company_id, standard_status, list_price, list_agent_user_id, list_agent_full_name)
       values ($1, $2, 'Incomplete', 3000000000, $3, '[Tên] TL')`,
      [id, e.w.A, e.w.id.TL],
    );
    await e.w.db.owner.query(
      "insert into listing_units (listing_id, company_id, upi, open) values ($1, $2, $3, true)",
      [id, e.w.A, from!.upi],
    );
    const state = async () =>
      (
        await e.w.db.owner.query<{ area: number | null; upi: string; version: number }>(
          `select l.living_area::float8 as area, u.upi, l.version from listings l
             join listing_units u on u.listing_id = l.id where l.id = $1`,
          [id],
        )
      ).rows[0]!;
    // A's company admin has no updateListing: refused at both doors, nothing changes.
    const before = await state();
    const values = { field: "unitAttributes", livingArea: 99 };
    const move = { field: "unit", upi: to!.upi };
    for (const change of [values, move]) {
      const res = await e.patch("CA", id, { version: before.version, change });
      expect(res.status, JSON.stringify(change)).toBe(403);
    }
    expect(await state()).toEqual(before);
    // The listing agent who does not keep it: updateListing is company-wide in the signed table (owner 2026-11-15).
    expect(
      (
        await e.patch("LA", id, {
          version: before.version,
          change: { ...values, livingArea: 72.5 },
        })
      ).status,
    ).toBe(200);
    expect((await e.patch("LA", id, { version: before.version + 1, change: move })).status).toBe(
      200,
    );
    expect(await state()).toMatchObject({ area: 72.5, upi: to!.upi });
  });
});

describe("doc-lai-mot-lan (E7, G-2811-69)", () => {
  /** A value the person took back that a later run filled again, by listing; empty when none came back. */
  function refilled(
    before: Record<string, unknown>,
    after: Record<string, unknown>,
    id: string,
  ): string[] {
    return before["living_area"] === null && after["living_area"] !== null
      ? [`taken-back value filled again: ${id}`]
      : [];
  }

  it("doc-lai-mot-lan: read once, the person takes the area back, a second run fills nothing; an import made now is never read again", async () => {
    const e = await apiWorld("mot_lan");
    const units = await codedUnits(e.w);
    const { id, ids } = await importThree(e, units);
    // An import made now is marked read when it is made: the command leaves it alone.
    expect(
      (await e.w.db.owner.query("select file_values_read_at from import_runs where id = $1", [id]))
        .rows[0].file_values_read_at,
      "an import of today is marked read",
    ).not.toBeNull();
    expect(await rereadImportValues(e.w.db.owner, asImporter(e.w.pool))).toMatchObject({
      imports: 0,
    });
    await asImportBefore3h(e, id);
    const first = await rereadImportValues(e.w.db.owner, asImporter(e.w.pool));
    expect(first).toMatchObject({ imports: 1 });
    expect(await ownOf(e.w, ids[0]!)).toMatchObject({
      living_area: 72.5,
      living_area_source: "File",
    });
    // The person takes the area back to the catalog's.
    const back = await e.patch("LA", ids[0]!, {
      version: await e.version(ids[0]!),
      change: { field: "unitAttributes", livingArea: null },
    });
    expect(back.status).toBe(200);
    const taken = await ownOf(e.w, ids[0]!);
    expect(taken).toMatchObject({ living_area: null, living_area_source: null });
    const second = await rereadImportValues(e.w.db.owner, asImporter(e.w.pool));
    expect(second).toMatchObject({ imports: 0, listingsSet: 0 });
    expect(refilled(taken, await ownOf(e.w, ids[0]!), ids[0]!)).toEqual([]);
  });

  it("break: a run that does not keep its mark fills the taken-back value again, named «taken-back value filled again»", async () => {
    const e = await apiWorld("mot_lan_pha");
    const units = await codedUnits(e.w);
    const { id, ids } = await importThree(e, units);
    await asImportBefore3h(e, id);
    await rereadImportValues(e.w.db.owner, asImporter(e.w.pool));
    const back = await e.patch("LA", ids[0]!, {
      version: await e.version(ids[0]!),
      change: { field: "unitAttributes", livingArea: null },
    });
    expect(back.status).toBe(200);
    const taken = await ownOf(e.w, ids[0]!);
    // The mark taken off: the command reads the import as if it never had.
    await e.w.db.owner.query("update import_runs set file_values_read_at = null where id = $1", [
      id,
    ]);
    await rereadImportValues(e.w.db.owner, asImporter(e.w.pool));
    expect(refilled(taken, await ownOf(e.w, ids[0]!), ids[0]!)).toEqual([
      `taken-back value filled again: ${ids[0]}`,
    ]);
  });
});

describe("doc-lai-qua-cua (SP-1, S4-r1 t1)", () => {
  it("doc-lai-qua-cua: the re-read writes as the importer through the door — an importer who may no longer see the import leaves it unread, and nothing is written", async () => {
    const e = await apiWorld("qua_cua");
    const units = await codedUnits(e.w);
    const { id, ids } = await importThree(e, units);
    await asImportBefore3h(e, id);
    const before = await e.w.db.owner.query(`select ${OWN_COLUMNS} from listings order by id`);
    // The importer's role changes to one that may not view imports: the door shows them no import to read.
    await e.w.db.owner.query(
      "update company_members set roles = '{BuyerAgent}' where company_id = $1 and user_id = $2",
      [e.w.A, e.w.id.LA],
    );
    const refused = await rereadImportValues(e.w.db.owner, asImporter(e.w.pool));
    expect(refused).toMatchObject({ imports: 1, refused: 1, listingsSet: 0 });
    expect(
      (await e.w.db.owner.query(`select ${OWN_COLUMNS} from listings order by id`)).rows,
    ).toEqual(before.rows);
    expect(
      (await e.w.db.owner.query("select file_values_read_at from import_runs where id = $1", [id]))
        .rows[0].file_values_read_at,
      "an import refused at the door stays unread",
    ).toBeNull();
    // The right given back, the next run reads it.
    await e.w.db.owner.query(
      "update company_members set roles = '{ListAgent}' where company_id = $1 and user_id = $2",
      [e.w.A, e.w.id.LA],
    );
    expect(await rereadImportValues(e.w.db.owner, asImporter(e.w.pool))).toMatchObject({
      imports: 1,
      refused: 0,
      listingsSet: 3,
    });
    expect(await ownOf(e.w, ids[0]!)).toMatchObject({ living_area_source: "File" });
  });

  it("break: the same re-read run on the owner's connection, past the door, fills what the door refused", async () => {
    const e = await apiWorld("qua_cua_pha");
    const units = await codedUnits(e.w);
    const { id } = await importThree(e, units);
    await asImportBefore3h(e, id);
    await e.w.db.owner.query(
      "update company_members set roles = '{BuyerAgent}' where company_id = $1 and user_id = $2",
      [e.w.A, e.w.id.LA],
    );
    const pastTheDoor: RunAsImporter = async (_company, _user, fn) =>
      fn(e.w.db.owner as unknown as Parameters<typeof fn>[0]);
    expect(await rereadImportValues(e.w.db.owner, pastTheDoor)).toMatchObject({
      refused: 0,
      listingsSet: 3,
    });
  });
});

describe("doc-lai-gia-tri-da-hien (E7, G-2811-81)", () => {
  it("doc-lai-gia-tri-da-hien: an import that kept the preview's value (the person answered «2PN» with Townhouse, not remembered) gives the listing that very value from a file", async () => {
    const e = await apiWorld("da_hien");
    const units = await codedUnits(e.w);
    const { id, ids } = await importThree(e, units, "Townhouse");
    const kept = (
      await e.w.db.owner.query<{ kept: { row: number; header: string; value?: unknown }[] }>(
        "select kept from import_runs where id = $1",
        [id],
      )
    ).rows[0]!.kept;
    expect(
      kept.find((k) => k.row === 1 && k.header === "Loại hình")?.value,
      "the import keeps the value the preview showed",
    ).toBe("Townhouse");
    await asImportBefore3h(e, id);
    const read = await rereadImportValues(e.w.db.owner, asImporter(e.w.pool));
    expect(read).toMatchObject({ imports: 1 });
    expect(await ownOf(e.w, ids[1]!)).toMatchObject({
      property_sub_type: "Townhouse",
      property_sub_type_source: "File",
    });
  });
});
