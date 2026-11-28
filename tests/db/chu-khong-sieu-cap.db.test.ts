// Migrations run by an owner that is NOT a superuser, as on Supabase (decision 0052): there the role `postgres` has
// CREATEROLE, CREATEDB and BYPASSRLS but not SUPERUSER. The first deploy of staging (2026-11-28) stopped at migration
// 002 — «must be able to SET ROLE "quy_hang_identity"» — because every other suite migrates as the container's
// superuser. On a cluster of this file's own (tests/db/rieng-cum.ts: roles belong to the whole cluster):
//   1. control: without 001_vai_chu_khong_sieu_cap.sql and 004 the owner stops at 002 with that error;
//   2. every migration applies as that owner;
//   3. the end state — owners and privileges of every table, function and schema, default privileges — is the one a
//      superuser gets, owner name aside;
//   4. db/scripts/cach-ly-dich.sh, the check the deploy runs, is green with that owner.
import { spawnSync } from "node:child_process";
import { cpSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import pg from "pg";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { tempDir } from "../support/temp-dir";
import { LOGIN_ROLE } from "./helpers";
import { startOwnCluster, type OwnCluster } from "./rieng-cum";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const MIGRATIONS = join(ROOT, "db/migrations");
const SEED = readFileSync(join(ROOT, "db/tests/vai-dang-nhap-mau.sql"), "utf8");
/** Supabase's `postgres`: everything a migration needs except SUPERUSER. */
const OWNER = "chu_nhu_supabase";
const WITHOUT = ["001_vai_chu_khong_sieu_cap.sql", "004_thu_quyen_tao_cua_vai_danh_tinh.sql"];

/** Owners and privileges of our schemas' objects and every default privilege; the owner's name reads OWNER. */
async function endState(c: pg.Client, owner: string): Promise<string[]> {
  const r = await c.query<{ line: string }>(
    `select 'fn ' || p.oid::regprocedure::text || ' ' || pg_get_userbyid(p.proowner) || ' ' || coalesce(p.proacl::text, '') as line
       from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname in ('public', 'app', 'identity')
     union all
     select 'rel ' || format('%I.%I', n.nspname, c.relname) || ' ' || pg_get_userbyid(c.relowner) || ' ' || coalesce(c.relacl::text, '')
       from pg_class c join pg_namespace n on n.oid = c.relnamespace
      where n.nspname in ('public', 'app', 'identity') and c.relkind in ('r', 'p', 'v', 'm', 'S')
     union all
     select 'schema ' || nspname || ' ' || pg_get_userbyid(nspowner) || ' ' || coalesce(nspacl::text, '')
       from pg_namespace where nspname in ('public', 'app', 'identity')
     union all
     select 'default ' || defaclobjtype::text || ' ' || pg_get_userbyid(defaclrole) || ' ' || defaclacl::text from pg_default_acl
     order by 1`,
  );
  const name = new RegExp(`\\b${owner}\\b`, "g");
  return r.rows.map((x) => x.line.replace(name, "OWNER"));
}

describe("migration chạy bằng vai chủ không phải siêu vai, như Supabase", () => {
  let cluster: OwnCluster | undefined;
  const clients: pg.Client[] = [];

  async function connect(db: string): Promise<pg.Client> {
    const c = new pg.Client({ connectionString: cluster!.url(db) });
    await c.connect();
    clients.push(c);
    return c;
  }

  /** Migrates a new database `db` as `role`, with every migration except `skip`; returns psql's exit and stderr. */
  async function migrate(db: string, role: string, skip: string[] = []) {
    const admin = await connect("postgres");
    await admin.query(`create database ${db} owner ${role}`);
    const dir = tempDir("migrations-");
    try {
      for (const f of readdirSync(MIGRATIONS))
        if (!skip.includes(f)) cpSync(join(MIGRATIONS, f), join(dir, f));
      return spawnSync("bash", [join(ROOT, "db/scripts/migrate.sh"), db], {
        env: {
          ...process.env,
          PSQL: `${cluster!.psqlInside} -h 127.0.0.1 -U ${role}`,
          MIGRATIONS_DIR: dir,
        },
        encoding: "utf8",
      });
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  }

  beforeAll(async () => {
    cluster = await startOwnCluster(ROOT, "chu-khong-sieu-cap");
    await (
      await connect("postgres")
    ).query(`create role ${OWNER} login nosuperuser createrole createdb bypassrls`);
  });
  afterAll(async () => {
    for (const c of clients) await c.end().catch(() => {});
    cluster?.remove();
  });

  // Order matters: the roles belong to the cluster, and only the role that created quy_hang_identity may grant it.
  // The owner creates them (control, then the full run), then the superuser migrates its own database.
  it("đối chứng: thiếu hai tệp chuẩn bị thì vai chủ dừng ở 002", async () => {
    const r = await migrate("chu_thieu", OWNER, WITHOUT);
    expect(r.status).not.toBe(0);
    expect(r.stderr).toContain('must be able to SET ROLE "quy_hang_identity"');
    expect(r.stderr).toContain("lỗi khi áp 002_dang_nhap_ma_email.sql");
  });

  it("đủ migration: vai chủ không siêu cấp áp hết", async () => {
    const r = await migrate("chu_du", OWNER);
    expect(r.stderr).not.toMatch(/ERROR/);
    expect(r.status).toBe(0);
    const c = await connect("chu_du");
    const applied = (
      await c.query<{ name: string }>("select name from public.schema_migrations order by name")
    ).rows;
    expect(applied.map((x) => x.name)).toEqual(
      readdirSync(MIGRATIONS)
        .filter((f) => /^\d{3}_.*\.sql$/.test(f))
        .sort(),
    );
  });

  it("trạng thái cuối giống hệt lúc siêu vai chạy, trừ tên chủ", async () => {
    const r = await migrate("sieu_vai", "postgres");
    expect(r.status).toBe(0);
    const ofOwner = await endState(await connect("chu_du"), OWNER);
    expect(ofOwner).toEqual(await endState(await connect("sieu_vai"), "postgres"));
    // The identity role owns functions and creates nothing: CREATE was lent and taken back.
    expect(ofOwner.filter((l) => /quy_hang_identity=\w*C/.test(l))).toEqual([]);
    expect(ofOwner.filter((l) => l.startsWith("default "))).toEqual([]);
  });

  it("cach-ly-dich.sh xanh với vai chủ không siêu cấp", async () => {
    await (await connect("chu_du")).query(SEED);
    const url = (role: string) => `postgres://${role}@127.0.0.1:5432/chu_du`;
    const r = spawnSync("bash", [join(ROOT, "db/scripts/cach-ly-dich.sh")], {
      env: {
        ...process.env,
        PSQL_DICH: cluster!.psqlInside,
        MIGRATE_DATABASE_URL: url(OWNER),
        LOGIN_DATABASE_URL: url(LOGIN_ROLE),
      },
      encoding: "utf8",
    });
    expect(r.stderr).toBe("");
    expect(r.status).toBe(0);
    expect(r.stdout.trim().split("\n").at(-1)).toMatch(/^cach-ly-dich: \d+ ca đạt$/);
  });
});
