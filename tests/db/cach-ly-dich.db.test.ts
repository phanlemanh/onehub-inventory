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

/**
 * The databases on the cluster and the row count of every table outside the system schemas. Other lane-K suites of a
 * grading round make and drop their own scratch databases at the same time, so the cluster count alone is not this
 * script's doing (round 1 of row 22: 6 before, 7 after); see `databasesUnchangedByScript`.
 */
async function snapshot(
  owner: pg.Client,
): Promise<{ databases: string[]; rows: Record<string, number> }> {
  const databases = (
    await owner.query<{ ten: string }>("select datname as ten from pg_database order by 1")
  ).rows.map((r) => r.ten);
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

/**
 * The script makes and drops no database: (1) every database before is still there, and the target is among them;
 * (2) no new database carries this test's prefix; (3) the script's text has no statement that makes or drops one.
 * Returns the broken rules by name; empty when all hold.
 */
export function databasesUnchangedByScript(
  before: string[],
  after: string[],
  target: string,
  scriptText: string,
): string[] {
  const broken: string[] = [];
  const gone = before.filter((d) => !after.includes(d));
  if (gone.length) broken.push(`co so du lieu bi xoa: ${gone.join(", ")}`);
  if (!after.includes(target)) broken.push(`mat co so dich: ${target}`);
  const mine = after.filter((d) => !before.includes(d) && d.startsWith("cach_ly_dich"));
  if (mine.length) broken.push(`co so du lieu moi cua bo kiem: ${mine.join(", ")}`);
  if (/\b(create|drop|alter)\s+database\b/i.test(scriptText))
    broken.push("script co lenh tao hay xoa co so du lieu");
  return broken;
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
    expect(after.rows).toEqual(before.rows);
    expect(
      databasesUnchangedByScript(
        before.databases,
        after.databases,
        db.name,
        readFileSync(SCRIPT, "utf8"),
      ),
    ).toEqual([]);
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

describe("the 'no database made or dropped' measure, both ways", () => {
  const SCRIPT_TEXT = readFileSync(SCRIPT, "utf8");
  it("green: another suite's scratch database appears meanwhile", () => {
    expect(
      databasesUnchangedByScript(
        ["a", "dich"],
        ["a", "dich", "khoi_phuc_thu_1"],
        "dich",
        SCRIPT_TEXT,
      ),
    ).toEqual([]);
  });
  it("red: a database is dropped", () => {
    expect(databasesUnchangedByScript(["a", "dich"], ["dich"], "dich", SCRIPT_TEXT)).toEqual([
      "co so du lieu bi xoa: a",
    ]);
  });
  it("red: a new database with this suite's prefix", () => {
    expect(
      databasesUnchangedByScript(["dich"], ["dich", "cach_ly_dich_x"], "dich", SCRIPT_TEXT),
    ).toEqual(["co so du lieu moi cua bo kiem: cach_ly_dich_x"]);
  });
  it("red: the script text makes a database", () => {
    expect(
      databasesUnchangedByScript(
        ["dich"],
        ["dich"],
        "dich",
        `${SCRIPT_TEXT}\npsql -c 'create database x'`,
      ),
    ).toEqual(["script co lenh tao hay xoa co so du lieu"]);
  });
});
