// Side task VP6 of row 22 (migration 014, decision 0044; SP-1). Supabase's postgres role has default privileges that
// grant ALL on every new table, sequence and function in schema public to anon, authenticated and service_role, the
// roles behind its public API keys. On a Postgres cluster of this file's OWN (tests/db/rieng-cum.ts: the three roles
// belong to the whole cluster, so they are never made on a shared lane), set up the way Supabase is, then:
//   1. every migration → none of the three roles holds any privilege (table, column, sequence, function, schema) on
//      any object of our schemas, no function keeps PUBLIC execute, and db/scripts/cach-ly-dich.sh is green;
//   2. a table, sequence and function created afterwards by the migrating role (as migration 015 would) open nothing
//      to the three roles;
//   3. control: migrations up to 013 only → the same measure is red, naming a table and a role.
import { execFileSync, spawnSync } from "node:child_process";
import { cpSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import pg from "pg";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { tempDir } from "../support/temp-dir";
import { LOGIN_ROLE } from "./helpers";
import { startOwnCluster, type OwnCluster } from "./rieng-cum";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const SCRIPT = join(ROOT, "db/scripts/cach-ly-dich.sh");
const SEED = readFileSync(join(ROOT, "db/tests/vai-dang-nhap-mau.sql"), "utf8");
const API_ROLES = ["anon", "authenticated", "service_role"];
const SCHEMAS = ["public", "app", "identity"];

/** Supabase's three roles: once per cluster (this file's own). */
const SUPABASE_ROLES = `
  create role anon nologin;
  create role authenticated nologin;
  create role service_role nologin;
`;
/** Supabase's setup in each database, written before any migration runs, as the role that will run them. */
const SUPABASE_LIKE = `
  grant usage on schema public to anon, authenticated, service_role;
  alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
  alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;
  alter default privileges in schema public grant all on functions to anon, authenticated, service_role;
`;

/**
 * Every privilege an API role holds (directly, through PUBLIC or a membership) on an object of our schemas, plus every
 * function PUBLIC may call. One line `<role>: <kind> <object>` each; empty when closed.
 */
export async function openPrivileges(c: pg.Client): Promise<string[]> {
  const r = await c.query<{ line: string }>(
    `with api as (select oid, rolname from pg_roles where rolname = any($1)),
          ns as (select oid, nspname from pg_namespace where nspname = any($2))
     select a.rolname || ': table ' || format('%I.%I', ns.nspname, c.relname) as line
     from pg_class c join ns on ns.oid = c.relnamespace cross join api a
     where c.relkind in ('r', 'p', 'v', 'm', 'f')
       and has_table_privilege(a.oid, c.oid, 'SELECT, INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER')
     union
     select a.rolname || ': column of ' || format('%I.%I', ns.nspname, c.relname)
     from pg_class c join ns on ns.oid = c.relnamespace cross join api a
     where c.relkind in ('r', 'p', 'v', 'm', 'f')
       and has_any_column_privilege(a.oid, c.oid, 'SELECT, INSERT, UPDATE, REFERENCES')
     union
     select a.rolname || ': sequence ' || format('%I.%I', ns.nspname, c.relname)
     from pg_class c join ns on ns.oid = c.relnamespace cross join api a
     where c.relkind = 'S' and has_sequence_privilege(a.oid, c.oid, 'USAGE, SELECT, UPDATE')
     union
     select a.rolname || ': function ' || p.oid::regprocedure::text
     from pg_proc p join ns on ns.oid = p.pronamespace cross join api a
     where has_function_privilege(a.oid, p.oid, 'EXECUTE')
     union
     select a.rolname || ': schema ' || ns.nspname
     from ns cross join api a
     where has_schema_privilege(a.oid, ns.oid, 'USAGE') or has_schema_privilege(a.oid, ns.oid, 'CREATE')
     union
     select 'PUBLIC: function ' || p.oid::regprocedure::text
     from pg_proc p join ns on ns.oid = p.pronamespace
     where exists (select from aclexplode(coalesce(p.proacl, acldefault('f', p.proowner))) x where x.grantee = 0)
     order by 1`,
    [API_ROLES, SCHEMAS],
  );
  return r.rows.map((x) => x.line);
}

describe("migration 014 trên cụm dựng như Supabase", () => {
  let cluster: OwnCluster | undefined;
  const clients: pg.Client[] = [];

  async function connect(db: string): Promise<pg.Client> {
    const c = new pg.Client({ connectionString: cluster!.url(db) });
    await c.connect();
    clients.push(c);
    return c;
  }

  /** A new database on the cluster with Supabase's setup, then the migrations numbered up to `upTo` (all if unset). */
  async function supabaseLike(db: string, upTo?: number): Promise<pg.Client> {
    const admin = await connect("postgres");
    await admin.query(`create database ${db}`);
    const owner = await connect(db);
    await owner.query(SUPABASE_LIKE);
    const dir = tempDir("migrations-");
    try {
      for (const f of readdirSync(join(ROOT, "db/migrations")))
        if (upTo === undefined || Number(f.slice(0, 3)) <= upTo)
          cpSync(join(ROOT, "db/migrations", f), join(dir, f));
      execFileSync("bash", [join(ROOT, "db/scripts/migrate.sh"), db], {
        env: { ...process.env, PSQL: `${cluster!.psqlInside} -U postgres`, MIGRATIONS_DIR: dir },
        stdio: "pipe",
      });
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
    return owner;
  }

  beforeAll(async () => {
    cluster = await startOwnCluster(ROOT, "thu-quyen");
    await (await connect("postgres")).query(SUPABASE_ROLES);
  });
  afterAll(async () => {
    for (const c of clients) await c.end().catch(() => {});
    cluster?.remove();
  });

  it("đủ migration: ba vai khoá công khai không còn quyền gì, PUBLIC không gọi được hàm nào", async () => {
    const owner = await supabaseLike("thu_quyen_du");
    expect(
      (
        await owner.query(
          "select 1 from public.schema_migrations where name = '014_thu_quyen_vai_cong_khai.sql'",
        )
      ).rowCount,
    ).toBe(1);
    expect(await openPrivileges(owner)).toEqual([]);
  });

  it("đủ migration: cach-ly-dich.sh xanh", async () => {
    const owner = await connect("thu_quyen_du");
    await owner.query(SEED);
    const url = (role: string) => `postgres://${role}@127.0.0.1:5432/thu_quyen_du`;
    const r = spawnSync("bash", [SCRIPT], {
      env: {
        ...process.env,
        PSQL_DICH: cluster!.psqlInside,
        MIGRATE_DATABASE_URL: url("postgres"),
        LOGIN_DATABASE_URL: url(LOGIN_ROLE),
      },
      encoding: "utf8",
    });
    expect(r.stderr).toBe("");
    expect(r.status).toBe(0);
    expect(r.stdout.trim().split("\n").at(-1)).toMatch(/^cach-ly-dich: \d+ ca đạt$/);
  });

  it("đối tượng tạo sau 014 (như migration 015) không mở lại cho ba vai khoá công khai", async () => {
    const owner = await connect("thu_quyen_du");
    await owner.query(`
      create table public.bang_sau (id bigint generated always as identity primary key, x text);
      create sequence app.chuoi_sau;
      create function public.ham_sau() returns int language sql as 'select 1';
      create function app.ham_sau() returns int language sql as 'select 1';
    `);
    try {
      // A new function keeps PUBLIC execute (a global default, kept on purpose — decision 0044), so each role holds
      // EXECUTE through PUBLIC — and nothing else: no table, no sequence, no schema.
      const fns = ["app.ham_sau()", "ham_sau()"];
      expect(await openPrivileges(owner)).toEqual(
        ["PUBLIC", ...API_ROLES].flatMap((r) => fns.map((f) => `${r}: function ${f}`)).sort(),
      );
      // Without the schema, EXECUTE reaches nothing: a call as anon is refused at the schema.
      for (const fn of ["app.ham_sau()", "public.ham_sau()"]) {
        await owner.query("begin; set local role anon");
        try {
          await expect(owner.query(`select ${fn}`)).rejects.toThrow(/permission denied for schema/);
        } finally {
          await owner.query("rollback");
        }
      }
    } finally {
      await owner.query(`
        drop table public.bang_sau; drop sequence app.chuoi_sau;
        drop function public.ham_sau(); drop function app.ham_sau();
      `);
    }
  });

  it("đối chứng: chỉ tới 013 thì đỏ, gọi tên bảng và vai", async () => {
    const owner = await supabaseLike("thu_quyen_truoc", 13);
    const open = await openPrivileges(owner);
    for (const role of API_ROLES) expect(open).toContain(`${role}: table public.agreements`);
    expect(open).toContain("anon: schema public");
    expect(open).toContain("PUBLIC: function app.current_company_id()");
  });
});
