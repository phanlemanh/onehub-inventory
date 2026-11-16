// Row 22, AC-7 (_acceptance/moi-truong-thu-va-ban-that/evals.yaml E7).
//   1. db/scripts/cach-ly-dich.sh on a migrated database with two companies, on a Postgres cluster of its OWN (its own
//      container and port, started and removed by this file, tests/db/rieng-cum.ts): every case of its list prints
//      `ok` exactly once, the last line is `cach-ly-dich: <n> ca đạt`, and it changes nothing — the set of databases
//      on the cluster and the row count of every table are the same before and after. Nothing else runs on that
//      cluster, so a database of ANY name that appears or goes is the script's doing (rounds 1 and 2 of E7 went red
//      falsely on lane K's shared cluster, where other suites make and drop scratch databases).
//   2. A copy of the script that makes a database `la_<pid>` turns the same measure red, naming it.
//   3. Three break copies, each on its own scratch database on this lane's Postgres (lane K; the CI cluster under `make ci-db`): a company table without
//      forced row level security, `anon` granted select, the login role made owner of a table. Each one turns the
//      script red with its pinned line naming the table.
// On the file's own cluster the script reaches Postgres through psql inside that cluster's container (127.0.0.1:5432,
// trust). The break copies use ./may-khach-pg.ts: the lane's container on a lane, the CI cluster under `make ci-db`.
import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import pg from "pg";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { tempDir } from "../support/temp-dir";
import { LOGIN_ROLE, scratchDb, type ScratchDb } from "./helpers";
import { pgClient, type PgClient } from "./may-khach-pg";
import { startOwnCluster, type OwnCluster } from "./rieng-cum";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const SCRIPT = join(ROOT, "db/scripts/cach-ly-dich.sh");
const PG = pgClient("k");
/** The case list written at the top of the script. */
const CASES = [
  "bang-cong-ty-ep-luat-dong",
  "vai-supabase-khong-quyen",
  "vai-dang-nhap-khong-chu",
  "phien-dang-nhap-khong-thay-dong",
];
const SEED = readFileSync(join(ROOT, "db/tests/vai-dang-nhap-mau.sql"), "utf8");

/** The cluster's own container, reached from inside it (127.0.0.1:5432, trust). */
function inside(cluster: OwnCluster): PgClient {
  const url = (role: string, db: string) => `postgres://${role}@127.0.0.1:5432/${db}`;
  return {
    psql: cluster.psqlInside,
    pgDump: "",
    pgRestore: "",
    ownerUrl: (db) => url("postgres", db),
    loginUrl: (db) => url(LOGIN_ROLE, db),
  };
}

function run(
  db: string,
  pgc: PgClient,
  script = SCRIPT,
): { code: number | null; out: string; err: string } {
  const r = spawnSync("bash", [script], {
    env: {
      ...process.env,
      PSQL_DICH: pgc.psql,
      MIGRATE_DATABASE_URL: pgc.ownerUrl(db),
      LOGIN_DATABASE_URL: pgc.loginUrl(db),
    },
    encoding: "utf8",
  });
  return { code: r.status, out: r.stdout, err: r.stderr };
}

/** The databases on the cluster and the row count of every table outside the system schemas. */
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
 * The main proof that the script makes and drops no database, on a cluster nobody else uses: the set of databases
 * after equals the set before. Any new database of any name, and any database gone, is named. Empty when equal.
 */
export function databasesChanged(before: string[], after: string[]): string[] {
  const broken: string[] = [];
  const made = after.filter((d) => !before.includes(d));
  const gone = before.filter((d) => !after.includes(d));
  if (made.length) broken.push(`co so du lieu moi: ${made.join(", ")}`);
  if (gone.length) broken.push(`co so du lieu bi xoa: ${gone.join(", ")}`);
  return broken;
}

/** A secondary check only: the script's text has no statement that makes, drops or alters a database. */
export function scriptMentionsDatabaseDdl(scriptText: string): boolean {
  return /\b(create|drop|alter)\s+database\b/i.test(scriptText);
}

async function seeded(suffix: string): Promise<ScratchDb> {
  const db = await scratchDb(suffix, undefined, { prefix: "cach_ly_dich" });
  await db.owner.query(SEED);
  return db;
}

describe("cach-ly-dich trên cụm Postgres riêng của tệp này", () => {
  const TARGET = "cach_ly_dich_lanh";
  let cluster: OwnCluster | undefined;
  let owner: pg.Client | undefined;

  beforeAll(async () => {
    try {
      cluster = await startOwnCluster(ROOT, "cach-ly-dich");
      const admin = new pg.Client({ connectionString: cluster.url("postgres") });
      await admin.connect();
      try {
        await admin.query(`create database ${TARGET}`);
      } finally {
        await admin.end();
      }
      cluster.migrate(TARGET);
      owner = new pg.Client({ connectionString: cluster.url(TARGET) });
      await owner.connect();
      await owner.query(SEED);
    } catch (err) {
      await owner?.end().catch(() => {});
      cluster?.remove();
      throw err;
    }
  });
  afterAll(async () => {
    await owner?.end().catch(() => {});
    cluster?.remove();
  });

  it("mọi ca ok đúng một lần, dòng cuối đếm ca, tập cơ sở dữ liệu và số dòng không đổi", async () => {
    const before = await snapshot(owner!);
    expect(Object.values(before.rows).some((n) => n > 0)).toBe(true);
    expect(before.databases).toContain(TARGET);
    const r = run(TARGET, inside(cluster!));
    const after = await snapshot(owner!);

    expect(r.err).toBe("");
    expect(r.code).toBe(0);
    const lines = r.out.trim().split("\n");
    for (const ca of CASES) expect(lines.filter((l) => l === `ok ${ca}`)).toHaveLength(1);
    expect(lines.filter((l) => l.startsWith("ok "))).toHaveLength(CASES.length);
    expect(lines.at(-1)).toBe(`cach-ly-dich: ${CASES.length} ca đạt`);
    expect(after.rows).toEqual(before.rows);
    expect(databasesChanged(before.databases, after.databases)).toEqual([]);
    expect(scriptMentionsDatabaseDdl(readFileSync(SCRIPT, "utf8"))).toBe(false);
  });

  it("bản phá tạo cơ sở la_<pid>: phép đo đỏ, gọi tên cơ sở ấy", async () => {
    const odd = `la_${process.pid}`;
    const anchor = 'API_ROLE="quy_hang_app"\n';
    const text = readFileSync(SCRIPT, "utf8");
    expect(text).toContain(anchor);
    const copy = join(tempDir("cach-ly-dich-pha-"), "cach-ly-dich.sh");
    writeFileSync(
      copy,
      text.replace(
        anchor,
        `${anchor}"\${psql_lenh[@]}" -X -q -d "$MIGRATE_DATABASE_URL" -c "create database ${odd}" >/dev/null\n`,
      ),
    );
    const before = await snapshot(owner!);
    try {
      run(TARGET, inside(cluster!), copy);
      const after = await snapshot(owner!);
      expect(databasesChanged(before.databases, after.databases)).toEqual([
        `co so du lieu moi: ${odd}`,
      ]);
    } finally {
      await owner!.query(`drop database if exists ${odd} with (force)`);
    }
    expect((await snapshot(owner!)).databases).toEqual(before.databases);
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
        const r = run(db.name, PG);
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
  it("green: the same set of databases", () => {
    expect(databasesChanged(["a", "dich"], ["dich", "a"])).toEqual([]);
  });
  it("red: a new database of any name", () => {
    expect(databasesChanged(["a", "dich"], ["a", "dich", "khoi_phuc_thu_1"])).toEqual([
      "co so du lieu moi: khoi_phuc_thu_1",
    ]);
  });
  it("red: a database is dropped", () => {
    expect(databasesChanged(["a", "dich"], ["dich"])).toEqual(["co so du lieu bi xoa: a"]);
  });
  it("secondary: the script text has no database statement, a copy that has one is caught", () => {
    const text = readFileSync(SCRIPT, "utf8");
    expect(scriptMentionsDatabaseDdl(text)).toBe(false);
    expect(scriptMentionsDatabaseDdl(`${text}\npsql -c 'create database x'`)).toBe(true);
  });
});
