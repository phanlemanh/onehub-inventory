// Row 7d (_acceptance/danh-muc-can-nhu-onehub-invest/evals.yaml E1, E3, E6, E7, E10, E11, E13, E16), on this lane's
// Postgres. Fixtures are written as the owner; everything the product would do runs through the door, withCompany,
// under the API role. Every case asserts the exact constraint or message, not only "red".
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { catalogLoadStatements } from "@/modules/catalog/load-sql";
import { lookupCode, sampleCatalog } from "@/modules/catalog";
import * as listings from "@/modules/listings";
import { createPool, withCompany, type DbPool } from "@/modules/identity/with-company";

import { scratchDb, type ScratchDb } from "./helpers";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const A = "00000000-0000-4000-8000-0000000007da";
const B = "00000000-0000-4000-8000-0000000007db";
const SHARED = [
  "catalog_nodes",
  "catalog_buildings",
  "catalog_stacks",
  "catalog_units",
  "catalog_aliases",
] as const;
const K = (p: string, n: number) => `${p}_${String(n).padStart(26, "0")}`;

let db: ScratchDb;
let pool: DbPool;

async function load(): Promise<void> {
  for (const s of catalogLoadStatements(sampleCatalog())) await db.owner.query(s.text, s.values);
}

async function failsWith(sql: string, values: unknown[], pinned: string): Promise<void> {
  await db.owner.query("savepoint s");
  let message = "";
  try {
    await db.owner.query(sql, values);
  } catch (e) {
    message = (e as Error & { constraint?: string }).constraint ?? (e as Error).message;
  }
  await db.owner.query("rollback to savepoint s");
  expect(message, sql).toContain(pinned);
}

/** People of the two companies: a list agent of A, a list agent of B, a buyer agent of A (no manageCompanyCodes). */
const PEOPLE = { la: "", lb: "", ba: "" };
const userOf: Record<string, keyof typeof PEOPLE> = { [A]: "la", [B]: "lb" };

const asApp = <T>(
  companyId: string | null,
  fn: Parameters<typeof withCompany<T>>[2],
  who: keyof typeof PEOPLE = companyId ? (userOf[companyId] ?? "la") : "la",
) => withCompany(pool, { userId: PEOPLE[who], companyId }, fn);

async function addPeople(target: ScratchDb): Promise<void> {
  for (const [who, company, role] of [
    ["la", A, "ListAgent"],
    ["lb", B, "ListAgent"],
    ["ba", A, "BuyerAgent"],
  ] as const) {
    const u = await target.owner.query(
      "insert into identity.users (email, name) values ($1, '[Tên]') returning id",
      [`${who}@example.test`],
    );
    PEOPLE[who] = (u.rows[0] as { id: string }).id;
    await target.owner.query(
      "insert into company_members (company_id, user_id, name, roles) values ($1, $2, '[Tên]', $3)",
      [company, PEOPLE[who], [role]],
    );
  }
}

beforeAll(async () => {
  db = await scratchDb("7d", undefined, { prefix: "danh_muc" });
  await db.owner.query(
    "insert into companies (id, name) values ($1, '[MAU] Sàn A'), ($2, '[MAU] Sàn B')",
    [A, B],
  );
  await load();
  await addPeople(db);
  pool = createPool(db.appUrl);
});

afterAll(async () => {
  await (pool as unknown as { end(): Promise<void> }).end();
  await db.drop();
});

describe("E1 phan-khu-con-du-an", () => {
  it("phân khu dưới dự án, toà dưới phân khu hay thẳng dưới dự án; ba dạng sai cấp bị từ chối", async () => {
    await db.owner.query("begin");
    await db.owner.query(
      "insert into catalog_nodes (slug, node_type, name) values ('du-an-thu', 'project', 'P')",
    );
    await db.owner.query(
      "insert into catalog_nodes (slug, node_type, name, subdivision_slug) values ('phan-khu-thu', 'complex', 'C', 'du-an-thu')",
    );
    await db.owner.query(
      "insert into catalog_buildings (building_key, subdivision_key, complex_key, building_name, upi) values ($1, 'du-an-thu', 'phan-khu-thu', 'T1', 'u-t1')",
      [K("bld", 1)],
    );
    await db.owner.query(
      "insert into catalog_buildings (building_key, subdivision_key, building_name, upi) values ($1, 'du-an-thu', 'T2', 'u-t2')",
      [K("bld", 2)],
    );
    await failsWith(
      "insert into catalog_nodes (slug, node_type, name) values ('khong-cha', 'complex', 'X')",
      [],
      "catalog_nodes_parent",
    );
    await failsWith(
      "insert into catalog_nodes (slug, node_type, name, subdivision_slug) values ('con-cua-pk', 'complex', 'X', 'phan-khu-thu')",
      [],
      "catalog_nodes_parent_is_project",
    );
    await failsWith(
      "insert into catalog_nodes (slug, node_type, name, subdivision_slug) values ('da-co-cha', 'project', 'X', 'du-an-thu')",
      [],
      "catalog_nodes_parent",
    );
    await db.owner.query("rollback");
  });
});

describe("E3 tang-dang-chu", () => {
  it("cột tầng là chữ; 7 và 15A nhận, năm giá trị sai bị từ chối", async () => {
    const t = await db.owner.query(
      "select data_type from information_schema.columns where table_name = 'catalog_units' and column_name = 'floor'",
    );
    expect(t.rows[0]).toEqual({ data_type: "text" });
    await db.owner.query("begin");
    const unit = sampleCatalog().units[0]!;
    const ins =
      "insert into catalog_units (unit_key, upi, subdivision_key, building_key, building_name, unit_number, floor, property_type, property_sub_type) values ($1, $2, $3, $4, $5, $6, $7, 'Residential', 'Condominium')";
    let n = 100;
    for (const floor of ["7", "15A"]) {
      n++;
      await db.owner.query(ins, [
        K("unt", n),
        `u-${n}`,
        unit.subdivisionKey,
        unit.buildingKey,
        unit.buildingName,
        `T${n}`,
        floor,
      ]);
    }
    for (const floor of ["", "07", "-1", "15-A", "A15"]) {
      n++;
      await failsWith(
        ins,
        [
          K("unt", n),
          `u-${n}`,
          unit.subdivisionKey,
          unit.buildingKey,
          unit.buildingName,
          `T${n}`,
          floor,
        ],
        "catalog_units_floor",
      );
    }
    await db.owner.query("rollback");
  });
});

describe("E6 khoa-tien-to", () => {
  it("khoá đúng thêm được; sai độ dài, chữ I, sai tiền tố bị từ chối", async () => {
    await db.owner.query("begin");
    const b = sampleCatalog().buildings[0]!;
    await db.owner.query(
      "insert into catalog_buildings (building_key, subdivision_key, building_name, upi) values ($1, $2, 'K1', 'u-k1')",
      [K("bld", 9), b.subdivisionKey],
    );
    await db.owner.query(
      "insert into catalog_stacks (stack_key, building_key, stack_code) values ($1, $2, '99')",
      [K("stk", 9), K("bld", 9)],
    );
    await failsWith(
      "insert into catalog_buildings (building_key, subdivision_key, building_name, upi) values ($1, $2, 'K2', 'u-k2')",
      ["bld_" + "0".repeat(25), b.subdivisionKey],
      "catalog_buildings_key",
    );
    await failsWith(
      "insert into catalog_units (unit_key, upi, subdivision_key, building_key, building_name, unit_number, property_type, property_sub_type) values ($1, 'u-k3', $2, $3, 'K1', '0101', 'Residential', 'Condominium')",
      ["unt_" + "I".repeat(26), b.subdivisionKey, K("bld", 9)],
      "catalog_units_key",
    );
    await failsWith(
      "insert into catalog_stacks (stack_key, building_key, stack_code) values ($1, $2, '98')",
      ["blk_" + "0".repeat(26), K("bld", 9)],
      "catalog_stacks_key",
    );
    await db.owner.query("rollback");
  });
});

describe("E7 ma-goc-bi-danh", () => {
  it("mỗi toà, trục, căn có đúng một mã gốc; tra mã ra đúng một căn; trùng bị chặn, ngừng rồi thêm lại được", async () => {
    const counts = await db.owner.query(`
      select (select count(*) from catalog_buildings b where (select count(*) from catalog_aliases a
                where a.object_key = b.building_key and a.kind = 'ma_goc' and a.retired_at is null) <> 1)::int as toa,
             (select count(*) from catalog_stacks s where (select count(*) from catalog_aliases a
                where a.object_key = s.stack_key and a.kind = 'ma_goc' and a.retired_at is null) <> 1)::int as truc,
             (select count(*) from catalog_units u where (select count(*) from catalog_aliases a
                where a.object_key = u.unit_key and a.kind = 'ma_goc' and a.retired_at is null) <> 1)::int as can`);
    expect(counts.rows[0]).toEqual({ toa: 0, truc: 0, can: 0 });
    const hit = await db.owner.query(
      "select object_key from catalog_aliases where kind = 'ma_goc' and value = 'op1/S1.05-1206' and retired_at is null",
    );
    expect(hit.rows).toHaveLength(1);
    expect((hit.rows[0] as { object_key: string }).object_key).toMatch(/^unt_/);
    await db.owner.query("begin");
    await failsWith(
      "insert into catalog_aliases (object_key, kind, value, source) values ($1, 'ma_goc', 'op1/S1.05-1206', 'MAU')",
      [K("unt", 77)],
      "catalog_aliases_ma_goc_uq",
    );
    await db.owner.query(
      "update catalog_aliases set retired_at = now() where kind = 'ma_goc' and value = 'op1/S1.05-1206'",
    );
    await db.owner.query(
      "insert into catalog_aliases (object_key, kind, value, source) values ($1, 'ma_goc', 'op1/S1.05-1206', 'MAU')",
      [K("unt", 77)],
    );
    await db.owner.query("rollback");
  });
});

describe("E10 nap-mau-du", () => {
  it("vai API đọc đủ 3 dự án, 1 phân khu, 6 toà, 36 trục, 432 căn; 60 căn của lần chào có mặt; nạp lại không thêm dòng", async () => {
    const read = () =>
      asApp(A, async (c) => {
        const r = await c.query(`select
          (select count(*) from catalog_nodes where node_type = 'project')::int as du_an,
          (select count(*) from catalog_nodes where node_type = 'complex')::int as phan_khu,
          (select count(*) from catalog_buildings)::int as toa,
          (select count(*) from catalog_stacks)::int as truc,
          (select count(*) from catalog_units)::int as can,
          (select count(*) from catalog_aliases)::int as bi_danh`);
        return r.rows[0] as Record<string, number>;
      });
    const before = await read();
    expect(before).toMatchObject({ du_an: 3, phan_khu: 1, toa: 6, truc: 36, can: 432 });
    const upis = listings
      .buildSampleListings({ companyId: listings.SAMPLE_COMPANY.id, units: sampleCatalog().units })
      .listingUnits.map((l) => l.upi);
    expect(upis).toHaveLength(60);
    const found = await asApp(A, (c) =>
      c.query("select count(*)::int as n from catalog_units where upi = any($1)", [upis]),
    );
    expect(found.rows[0]).toEqual({ n: 60 });
    await load();
    expect(await read()).toEqual(before);
  });
});

describe("E11 danh-muc-chi-doc", () => {
  const READABLE: Record<(typeof SHARED)[number], string[]> = {
    catalog_nodes: ["name", "node_type", "parent_type", "slug", "subdivision_slug"],
    catalog_buildings: [
      "building_key",
      "building_name",
      "complex_key",
      "subdivision_key",
      "subdivision_type",
      "upi",
    ],
    catalog_stacks: ["building_key", "stack_code", "stack_key"],
    catalog_units: [
      "bedrooms_total",
      "building_key",
      "building_name",
      "complex_key",
      "direction_faces",
      "floor",
      "living_area",
      "property_sub_type",
      "property_type",
      "stack",
      "stack_key",
      "subdivision_key",
      "unit_key",
      "unit_number",
      "upi",
    ],
    catalog_aliases: ["first_seen", "id", "kind", "object_key", "retired_at", "source", "value"],
  };

  it("sàn A, sàn B và phiên chưa chọn sàn đọc cùng số dòng của năm bảng", async () => {
    const counts = (company: string | null) =>
      asApp(company, async (c) => {
        const out: number[] = [];
        for (const t of SHARED)
          out.push(
            ((await c.query(`select count(*)::int as n from ${t}`)).rows[0] as { n: number }).n,
          );
        return out;
      });
    const a = await counts(A);
    expect(a.every((n) => n > 0)).toBe(true);
    expect(await counts(B)).toEqual(a);
    expect(await counts(null)).toEqual(a);
  });

  it.each(SHARED)("%s: vai API không thêm, sửa, xoá, xoá sạch", async (t) => {
    const col = READABLE[t][0]!;
    for (const sql of [
      `insert into ${t} default values`,
      `update ${t} set ${col} = ${col} where false`,
      `delete from ${t} where false`,
      `truncate ${t}`,
    ]) {
      let msg = "";
      await asApp(A, (c) => c.query(sql)).catch((e: Error) => (msg = e.message));
      expect(msg, sql).toBe(`permission denied for table ${t}`);
    }
  });

  it.each(SHARED)("%s: cột vai API đọc được đúng danh sách viết trước", async (t) => {
    const r = await db.owner.query(
      "select column_name from information_schema.columns where table_name = $1 order by 1",
      [t],
    );
    const readable: string[] = [];
    for (const { column_name } of r.rows as { column_name: string }[]) {
      const ok = await db.owner.query(
        "select has_column_privilege('quy_hang_app', $1, $2, 'SELECT') as ok",
        [t, column_name],
      );
      if ((ok.rows[0] as { ok: boolean }).ok) readable.push(column_name);
    }
    expect(readable).toEqual(READABLE[t]);
  });
});

/** property names of an ontology entity file, in snake_case. */
export function ontologyColumns(entity: string, root = ROOT): string[] {
  const text = readFileSync(join(root, "ontology/entities", `${entity}.yaml`), "utf8");
  const block = /^properties:\n([\s\S]*?)(?=^\S)/m.exec(text + "\nend:")?.[1] ?? "";
  return [...block.matchAll(/^ {2}(\w+):/gm)].map((m) =>
    m[1]!.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`),
  );
}

/** Every difference between a table's columns and its entities' properties (system columns listed, not inferred). */
export function compareColumns(
  table: string,
  columns: string[],
  properties: string[],
  system: string[],
): string[] {
  const want = new Set([...properties, ...system]);
  const have = new Set(columns);
  return [
    ...[...want].filter((p) => !have.has(p)).map((p) => `${table}: thuộc tính ${p} không có cột`),
    ...[...have]
      .filter((c) => !want.has(c))
      .map((c) => `${table}: cột ${c} không có trong ontology`),
  ].sort();
}

const MAP: Array<{ table: string; entities: string[]; system: string[] }> = [
  {
    table: "catalog_nodes",
    entities: ["Subdivision", "Complex"],
    system: ["node_type", "parent_type"],
  },
  { table: "catalog_buildings", entities: ["Building"], system: ["subdivision_type"] },
  { table: "catalog_stacks", entities: ["Stack"], system: [] },
  { table: "catalog_units", entities: ["Unit"], system: [] },
  { table: "catalog_aliases", entities: ["CatalogAlias"], system: [] },
  { table: "company_catalog_aliases", entities: ["CompanyCatalogAlias"], system: [] },
];

async function columnsOf(table: string): Promise<string[]> {
  const r = await db.owner.query(
    "select column_name from information_schema.columns where table_name = $1",
    [table],
  );
  return (r.rows as { column_name: string }[]).map((x) => x.column_name);
}

describe("E13 cot-khop-ontology", () => {
  it("sáu bảng: tập cột bằng tập thuộc tính của thực thể (cột hệ thống liệt trong bài)", async () => {
    const errors: string[] = [];
    for (const m of MAP)
      errors.push(
        ...compareColumns(
          m.table,
          await columnsOf(m.table),
          m.entities.flatMap((e) => ontologyColumns(e)),
          m.system,
        ),
      );
    expect(errors).toEqual([]);
  });

  it("đỏ: ontology thêm thuộc tính không có cột, và bảng danh mục thêm cột agreement_id", async () => {
    const units = await columnsOf("catalog_units");
    expect(
      compareColumns("catalog_units", units, [...ontologyColumns("Unit"), "view_ho"], []),
    ).toEqual(["catalog_units: thuộc tính view_ho không có cột"]);
    const buildings = await columnsOf("catalog_buildings");
    expect(
      compareColumns(
        "catalog_buildings",
        [...buildings, "agreement_id"],
        ontologyColumns("Building"),
        ["subdivision_type"],
      ),
    ).toEqual(["catalog_buildings: cột agreement_id không có trong ontology"]);
  });
});

describe("E16 ma-rieng-cua-san", () => {
  it("mã riêng chỉ sàn ấy thấy, trỏ căn có thật, không đổi danh mục chung", async () => {
    const units = sampleCatalog().units;
    const u1206 = units.find((u) => u.upi.endsWith("op1:s1.05:1206"))!.unitKey;
    const u0903 = units.find((u) => u.upi.endsWith("op2:e1:0903"))!.unitKey;
    const buyerAdds = () =>
      asApp(
        A,
        (c) =>
          c.query(
            "insert into company_catalog_aliases (company_id, unit_key, kind, value) values ($1, $2, 'ma', 'DK-1')",
            [A, u1206],
          ),
        "ba",
      );
    const sharedCount = () =>
      db.owner.query(`select ${SHARED.map((t) => `(select count(*) from ${t})`).join(" + ")} as n`);
    const before = (await sharedCount()).rows[0];
    const add = (company: string, owner: string, unitKey: string, value = "SA5-12.08") =>
      asApp(company, (c) =>
        c.query(
          "insert into company_catalog_aliases (company_id, unit_key, kind, value) values ($1, $2, 'ma', $3)",
          [owner, unitKey, value],
        ),
      );

    await add(A, A, u1206);
    const mine = await asApp(A, (c) =>
      c.query("select unit_key from company_catalog_aliases where value = 'SA5-12.08'"),
    );
    expect(mine.rows).toEqual([{ unit_key: u1206 }]);
    expect((await asApp(B, (c) => c.query("select * from company_catalog_aliases"))).rows).toEqual(
      [],
    );
    expect(
      (await asApp(null, (c) => c.query("select * from company_catalog_aliases"))).rows,
    ).toEqual([]);
    await add(B, B, u0903);
    const errOf = (p: Promise<unknown>) =>
      p.then(
        () => "",
        (e: Error & { constraint?: string }) => e.constraint ?? e.message,
      );
    expect(await errOf(add(A, A, u0903))).toBe("company_catalog_aliases_uq");
    expect(await errOf(add(A, B, u0903, "khac"))).toBe(
      'new row violates row-level security policy for table "company_catalog_aliases"',
    );
    expect(await errOf(add(A, A, K("unt", 404), "ma"))).toBe("company_catalog_aliases_unit");
    expect(await errOf(buyerAdds())).toBe(BUYER_DENIED);
    expect((await sharedCount()).rows[0]).toEqual(before);

    const ownA = (
      await db.owner.query(
        'select unit_key as "objectKey", value from company_catalog_aliases where company_id = $1',
        [A],
      )
    ).rows as { objectKey: string; value: string }[];
    expect(lookupCode("SA5-12.08", { companyAliases: ownA, catalogAliases: [] })).toEqual({
      source: "san",
      objectKey: u1206,
    });
  });
});

const BUYER_DENIED =
  'new row violates row-level security policy "company_catalog_aliases_insert_by_permission" for table "company_catalog_aliases"';

/** Throws the pinned message when a buyer agent can add a company code (no manageCompanyCodes cell). */
async function checkBuyerCannotAddCode(target: ScratchDb, targetPool: DbPool): Promise<void> {
  const unit = sampleCatalog().units[0]!.unitKey;
  const err = await withCompany(targetPool, { userId: PEOPLE.ba, companyId: A }, (c) =>
    c.query(
      "insert into company_catalog_aliases (company_id, unit_key, kind, value) values ($1, $2, 'ma', 'DK-2')",
      [A, unit],
    ),
  ).then(
    () => "",
    (e: Error) => e.message,
  );
  void target;
  if (err !== BUYER_DENIED) throw new Error("ma-rieng-theo-vai: Đầu khách thêm được mã riêng");
}

describe("E16 tệp phá ma-rieng-khong-kiem-vai", () => {
  it("bản lành qua; bản bỏ luật thu hẹp đỏ với dòng ghim", async () => {
    await checkBuyerCannotAddCode(db, pool);
    const saved = { ...PEOPLE };
    const broken = await scratchDb("7d_pha", "ma-rieng-khong-kiem-vai", { prefix: "danh_muc" });
    const brokenPool = createPool(broken.appUrl);
    try {
      await broken.owner.query(
        "insert into companies (id, name) values ($1, '[MAU] Sàn A'), ($2, '[MAU] Sàn B')",
        [A, B],
      );
      for (const s of catalogLoadStatements(sampleCatalog()))
        await broken.owner.query(s.text, s.values);
      await addPeople(broken);
      await expect(checkBuyerCannotAddCode(broken, brokenPool)).rejects.toThrow(
        "ma-rieng-theo-vai: Đầu khách thêm được mã riêng",
      );
    } finally {
      await (brokenPool as unknown as { end(): Promise<void> }).end();
      await broken.drop();
      Object.assign(PEOPLE, saved);
    }
  });
});
