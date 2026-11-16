// Row 22, AC-7 (_acceptance/moi-truong-thu-va-ban-that/evals.yaml E7), on this lane's Postgres (lane K).
//   1. db/scripts/cach-ly-dich.sh on a migrated database with two companies: every case of its list prints `ok` exactly
//      once, the last line is `cach-ly-dich: <n> ca đạt`, and it changes nothing — the number of databases and the
//      row count of every table are the same before and after.
//   2. Three break copies, each on its own scratch database made by THIS test (the script never makes one): a company
//      table without forced row level security, `anon` granted select, the login role made owner of a table. Each one
//      turns the script red with its pinned line naming the table.
// The script reaches Postgres through psql inside the lane's container, so the addresses are the container's own
// (127.0.0.1:5432, trust) and carry no password.
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import type pg from "pg";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { LOGIN_ROLE, scratchDb, type ScratchDb } from "./helpers";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const SCRIPT = join(ROOT, "db/scripts/cach-ly-dich.sh");
const LANE = process.env["DB_LANE"] ?? "k";
const CONTAINER = `onehub-inventory-db-${LANE}`;
/** The case list written at the top of the script. */
const CASES = [
  "bang-cong-ty-ep-luat-dong",
  "vai-supabase-khong-quyen",
  "vai-dang-nhap-khong-chu",
  "phien-dang-nhap-khong-thay-dong",
];
const SEED = readFileSync(join(ROOT, "db/tests/vai-dang-nhap-mau.sql"), "utf8");

function run(db: string): { code: number | null; out: string; err: string } {
  const r = spawnSync("bash", [SCRIPT], {
    env: {
      ...process.env,
      PSQL_DICH: `docker exec -i ${CONTAINER} psql`,
      MIGRATE_DATABASE_URL: `postgres://postgres@127.0.0.1:5432/${db}`,
      LOGIN_DATABASE_URL: `postgres://${LOGIN_ROLE}@127.0.0.1:5432/${db}`,
    },
    encoding: "utf8",
  });
  return { code: r.status, out: r.stdout, err: r.stderr };
}

/** Number of databases on the cluster and the row count of every table outside the system schemas. */
async function snapshot(
  owner: pg.Client,
): Promise<{ databases: number; rows: Record<string, number> }> {
  const databases = Number(
    (await owner.query<{ n: string }>("select count(*) as n from pg_database")).rows[0]!.n,
  );
  const tables = await owner.query<{ ten: string }>(
    `select format('%I.%I', n.nspname, c.relname) as ten
     from pg_class c join pg_namespace n on n.oid = c.relnamespace
     where c.relkind in ('r', 'p') and n.nspname not in ('pg_catalog', 'information_schema')
       and n.nspname not like 'pg\\_%' order by 1`,
  );
  const rows: Record<string, number> = {};
  for (const { ten } of tables.rows)
    rows[ten] = Number(
      (await owner.query<{ n: string }>(`select count(*) as n from ${ten}`)).rows[0]!.n,
    );
  return { databases, rows };
}

async function seeded(suffix: string): Promise<ScratchDb> {
  const db = await scratchDb(suffix, undefined, { prefix: "cach_ly_dich" });
  await db.owner.query(SEED);
  return db;
}

describe("cach-ly-dich trên cơ sở lành", () => {
  let db: ScratchDb;
  beforeAll(async () => {
    db = await seeded("lanh");
  });
  afterAll(async () => {
    await db?.drop();
  });

  it("mọi ca ok đúng một lần, dòng cuối đếm ca, không đổi cơ sở dữ liệu hay dòng nào", async () => {
    const before = await snapshot(db.owner);
    expect(Object.values(before.rows).some((n) => n > 0)).toBe(true);
    const r = run(db.name);
    const after = await snapshot(db.owner);

    expect(r.err).toBe("");
    expect(r.code).toBe(0);
    const lines = r.out.trim().split("\n");
    for (const ca of CASES) expect(lines.filter((l) => l === `ok ${ca}`)).toHaveLength(1);
    expect(lines.filter((l) => l.startsWith("ok "))).toHaveLength(CASES.length);
    expect(lines.at(-1)).toBe(`cach-ly-dich: ${CASES.length} ca đạt`);
    expect(after).toEqual(before);
  });

  it("thiếu biến địa chỉ thì dừng, gọi tên biến", () => {
    const r = spawnSync("bash", [SCRIPT], {
      env: { ...process.env, MIGRATE_DATABASE_URL: "", LOGIN_DATABASE_URL: "" },
      encoding: "utf8",
    });
    expect(r.status).toBe(2);
    expect(r.stderr).toContain("thiếu biến MIGRATE_DATABASE_URL");
  });
});

describe("cach-ly-dich trên bản phá", () => {
  // `anon` belongs to the whole cluster: when this test creates it, it drops it again before the scratch database goes.
  let anonCreated = false;
  async function restore(owner: pg.Client): Promise<void> {
    if (!anonCreated) return;
    await owner.query("revoke all on public.agreements from anon");
    await owner.query("drop role anon");
    anonCreated = false;
  }

  const breaks: { name: string; sql: (owner: pg.Client) => Promise<void>; pinned: string }[] = [
    {
      name: "bo_ep",
      sql: async (o) => {
        await o.query("alter table public.agreements no force row level security");
      },
      pinned: "bang khong ep luat dong: public.agreements",
    },
    {
      name: "anon",
      sql: async (o) => {
        const has = await o.query("select 1 from pg_roles where rolname = 'anon'");
        if (has.rowCount === 0) {
          await o.query("create role anon nologin");
          anonCreated = true;
        }
        await o.query("grant select on public.agreements to anon");
      },
      pinned: "vai anon co quyen tren: public.agreements",
    },
    {
      name: "chu",
      sql: async (o) => {
        await o.query(`alter table public.agreements owner to ${LOGIN_ROLE}`);
      },
      pinned: "vai dang nhap la chu: public.agreements",
    },
  ];

  for (const b of breaks) {
    it(`${b.name}: đỏ với «${b.pinned}»`, async () => {
      const db = await seeded(`pha_${b.name}`);
      try {
        await b.sql(db.owner);
        const r = run(db.name);
        expect(r.code).not.toBe(0);
        expect(r.out.split("\n")).toContain(b.pinned);
        expect(r.err).toMatch(/^cach-ly-dich: \d\/4 ca đạt — chưa đạt: /m);
        expect(r.out).not.toMatch(/^cach-ly-dich: \d+ ca đạt$/m);
      } finally {
        await restore(db.owner);
        await db.drop();
      }
    });
  }
});
