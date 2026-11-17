// db/scripts/migrate.sh run by a role that is NOT a superuser but has CREATEROLE and BYPASSRLS and owns the database,
// as Supabase's postgres is (decision 0044, «Vì sao Supabase khác CI»). The lanes and CI migrate as a superuser, which
// skips the two checks Postgres makes when a migration hands a function to quy_hang_identity: the migrating role can
// SET ROLE to the new owner (Postgres 16+: a CREATEROLE role gets only ADMIN on the roles it creates), and the new
// owner has CREATE on the schema. On a Postgres cluster of this file's OWN (tests/db/rieng-cum.ts: roles belong to the
// whole cluster, and each case starts with none of the repo's roles):
//   1. control: migrate.sh as it was (the one staging ran) stops at 002 with «must be able to SET ROLE»;
//   2. on that database (001 applied by the old script), today's migrate.sh goes on through 014;
//   3. on an empty database, today's migrate.sh applies everything;
//   in 2 and 3 every privilege of our schemas equals a superuser's migration, and db/scripts/cach-ly-dich.sh is green;
//   4. while 3 runs, a second connection polling the schemas' CREATE never sees the CREATE lent inside a migration;
//   5. a migration that fails midway leaves no lent CREATE behind, and inside it the lending was the narrow one;
//   6. a migration that commits CREATE on a repo schema for a role or PUBLIC stops migrate.sh, naming the schema;
//   7. control: with SET alone (no INHERIT) the grants right after an owner change are skipped.
import { spawn, spawnSync } from "node:child_process";
import { cpSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
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
const OWNER = "chu_kieu_supabase";
const PASSWORD = "local-only";
const REPO_ROLES = ["quy_hang_app", "quy_hang_identity", "quy_hang_login"];

/** db/scripts/migrate.sh before decision 0044's section, as staging ran it (commit e5c3861, the last on main). */
const OLD_COMMIT = "e5c3861903fddcf14fb51b897208eaa65d708d0b";
const OLD_MIGRATE = [
  "#!/usr/bin/env bash",
  "# Apply the migrations that have not run yet, in number order, each file in one transaction together with its",
  "# line in public.schema_migrations. Running it again applies nothing. Same rule as scripts/migrate.mjs of",
  "# onehub-quy-hang (commit 1729b11f), through psql.",
  "#",
  "#   bash db/scripts/migrate.sh <database>",
  "#   MIGRATIONS_DIR — another folder of NNN_*.sql files (tests only).",
  "set -euo pipefail",
  "",
  'here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"',
  "# shellcheck source=db/scripts/psql.sh",
  'source "$here/psql.sh"',
  "",
  'db="${1:?cách dùng: migrate.sh <cơ sở dữ liệu>}"',
  'dir="${MIGRATIONS_DIR:-$here/../migrations}"',
  "",
  'pg_cmd "$db" "set client_min_messages = warning; create table if not exists public.schema_migrations (name text primary key, applied_at timestamptz not null default now())" >/dev/null',
  'done_list=$(pg_cmd "$db" "select name from public.schema_migrations")',
  "",
  "applied=0",
  "for path in $(find \"$dir\" -maxdepth 1 -name '[0-9][0-9][0-9]_*.sql' | sort); do",
  '  file="$(basename "$path")"',
  '  if printf \'%s\\n\' "$done_list" | grep -qxF "$file"; then',
  "    continue",
  "  fi",
  '  if ! { cat "$path"; printf "\\ninsert into public.schema_migrations (name) values (\'%s\');\\n" "$file"; } |',
  '    pg_sql "$db" -1 -f - >/dev/null; then',
  '    echo "lỗi khi áp $file — giao dịch đã huỷ, sổ không ghi tệp này" >&2',
  "    exit 1",
  "  fi",
  '  echo "đã áp $file"',
  "  applied=$((applied + 1))",
  "done",
  'echo "xong — $applied migration mới"',
].join("\n");

/**
 * Owner and ACL of every table, sequence, view, function and schema of our three schemas, one line each. The migrating
 * role, postgres and pg_database_owner all read `chủ`, so a superuser's run and the non-superuser's compare.
 */
const PRIVILEGES = `
  with ns as (select oid, nspname from pg_namespace where nspname in ('public', 'app', 'identity')),
  o as (
    select 'rel ' || format('%I.%I', ns.nspname, c.relname) as obj, c.relowner as owner,
           coalesce(c.relacl, acldefault((case when c.relkind = 'S' then 's' else 'r' end)::"char", c.relowner)) as acl
    from pg_class c join ns on ns.oid = c.relnamespace where c.relkind in ('r', 'p', 'v', 'm', 'S', 'f')
    union all
    select 'fn ' || p.oid::regprocedure::text, p.proowner, coalesce(p.proacl, acldefault('f', p.proowner))
    from pg_proc p join ns on ns.oid = p.pronamespace
    union all
    select 'schema ' || ns.nspname, n.nspowner, coalesce(n.nspacl, acldefault('n', n.nspowner))
    from pg_namespace n join ns on ns.oid = n.oid
  ),
  nm as (select oid, case when rolname in (current_user, 'postgres', 'pg_database_owner') then 'chủ'
                          else rolname::text end as n from pg_roles)
  select o.obj || ' chủ=' || ow.n || ' ' ||
         coalesce(string_agg(coalesce(g.n, 'PUBLIC') || ':' || x.privilege_type,
                             ',' order by coalesce(g.n, 'PUBLIC'), x.privilege_type), '') as line
  from o join nm ow on ow.oid = o.owner
  left join lateral aclexplode(o.acl) x on true left join nm g on g.oid = x.grantee
  group by o.obj, ow.n order by 1`;

/** Who other than its owner holds CREATE on app or identity, as seen from this connection: `<schema> <role|public>`. */
const CREATE_HOLDERS = `
  select n.nspname || ' ' || r.n as line
  from pg_namespace n,
       (select 'public'::text as n union all select rolname::text from pg_roles where rolname = any($1)) r
  where n.nspname in ('app', 'identity') and has_schema_privilege(r.n, n.oid, 'CREATE')
    and r.n <> (select rolname from pg_roles where oid = n.nspowner)
  order by 1`;

interface Run {
  status: number | null;
  stdout: string;
  stderr: string;
}

describe("migrate.sh bằng vai không phải siêu vai (như postgres của Supabase)", () => {
  let cluster: OwnCluster | undefined;
  let baseline: string[] = [];
  const clients: pg.Client[] = [];
  const scripts = tempDir("migrate-khong-sieu-");

  async function connect(db: string, role = "postgres"): Promise<pg.Client> {
    const u = new URL(cluster!.url(db));
    u.username = role;
    const c = new pg.Client({ connectionString: u.toString() });
    await c.connect();
    clients.push(c);
    return c;
  }

  /** A migrate.sh next to today's psql.sh in a folder of its own, for the old and the SET-only scripts. */
  function scriptFile(name: string, text: string): string {
    const dir = join(scripts, name);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "psql.sh"), readFileSync(join(ROOT, "db/scripts/psql.sh")));
    writeFileSync(join(dir, "migrate.sh"), text);
    return join(dir, "migrate.sh");
  }

  function migrate(db: string, opts: { as?: string; script?: string; dir?: string } = {}): Run {
    const r = spawnSync("bash", [opts.script ?? join(ROOT, "db/scripts/migrate.sh"), db], {
      env: {
        ...process.env,
        PSQL: `${cluster!.psqlInside} -U ${opts.as ?? OWNER}`,
        MIGRATIONS_DIR: opts.dir ?? MIGRATIONS,
      },
      encoding: "utf8",
    });
    return { status: r.status, stdout: r.stdout, stderr: r.stderr };
  }

  /** migrate.sh as a child process that does not block the event loop, so a poller can run beside it. */
  function migrateAsync(db: string): Promise<Run> {
    return new Promise((resolve, reject) => {
      const child = spawn("bash", [join(ROOT, "db/scripts/migrate.sh"), db], {
        env: {
          ...process.env,
          PSQL: `${cluster!.psqlInside} -U ${OWNER}`,
          MIGRATIONS_DIR: MIGRATIONS,
        },
      });
      let stdout = "";
      let stderr = "";
      child.stdout.on("data", (d: Buffer) => (stdout += d.toString()));
      child.stderr.on("data", (d: Buffer) => (stderr += d.toString()));
      child.on("error", reject);
      child.on("close", (status) => resolve({ status, stdout, stderr }));
    });
  }

  /** A folder of migrations: copies of the repo's up to `upTo`, then the given extra files. */
  function migrationsDir(upTo: number, extra: Record<string, string>): string {
    const dir = tempDir("migrate-khong-sieu-tep-");
    for (const f of readdirSync(MIGRATIONS))
      if (Number(f.slice(0, 3)) <= upTo) cpSync(join(MIGRATIONS, f), join(dir, f));
    for (const [name, text] of Object.entries(extra)) writeFileSync(join(dir, name), text);
    return dir;
  }

  async function holders(c: pg.Client): Promise<string[]> {
    return (await c.query<{ line: string }>(CREATE_HOLDERS, [REPO_ROLES])).rows.map((x) => x.line);
  }

  async function applied(db: string): Promise<string[]> {
    const c = await connect(db, OWNER);
    return (
      await c.query<{ name: string }>("select name from public.schema_migrations order by 1")
    ).rows.map((x) => x.name);
  }

  /** A database owned by the Supabase-like role, created by it (it has no CREATEDB: the superuser makes it). */
  async function newDatabase(db: string): Promise<void> {
    await (await connect("postgres")).query(`create database ${db} owner ${OWNER}`);
  }

  /** Drops every database but postgres and the repo's roles: the next case starts as a new Supabase project. */
  async function reset(): Promise<void> {
    for (const c of clients.splice(0)) await c.end().catch(() => {});
    const admin = await connect("postgres");
    const dbs = await admin.query<{ datname: string }>(
      "select datname from pg_database where not datistemplate and datname <> 'postgres'",
    );
    for (const { datname } of dbs.rows) await admin.query(`drop database ${datname} with (force)`);
    await admin.query(`drop role if exists ${REPO_ROLES.join(", ")}`);
  }

  async function privileges(db: string): Promise<string[]> {
    const c = await connect(db, OWNER);
    return (await c.query<{ line: string }>(PRIVILEGES)).rows.map((x) => x.line);
  }

  /** The login role can log in with the password the owner sets, and the read-only isolation suite is green. */
  async function loginAndIsolation(db: string): Promise<void> {
    const owner = await connect(db, OWNER);
    await owner.query(`alter role ${LOGIN_ROLE} password '${PASSWORD}'`);
    const u = new URL(cluster!.url(db));
    u.username = LOGIN_ROLE;
    const login = new pg.Client({ connectionString: u.toString() });
    await login.connect();
    clients.push(login);
    expect((await login.query("select current_user as u")).rows[0].u).toBe(LOGIN_ROLE);

    await owner.query(SEED);
    const url = (role: string) => `postgres://${role}@127.0.0.1:5432/${db}`;
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
  }

  /** The migrating role reaches each repo role with SET and INHERIT, and PUBLIC holds CREATE on no schema of ours. */
  async function selfGrants(db: string): Promise<void> {
    const c = await connect(db, OWNER);
    const r = await c.query<{ rolname: string; set: boolean; inherit: boolean }>(
      `select rolname, pg_has_role(current_user, oid, 'SET') as set, pg_has_role(current_user, oid, 'USAGE') as inherit
       from pg_roles where rolname = any($1) order by 1`,
      [REPO_ROLES],
    );
    expect(r.rows).toEqual(REPO_ROLES.map((rolname) => ({ rolname, set: true, inherit: true })));
    const open = await c.query(
      `select n.nspname from pg_namespace n, aclexplode(coalesce(n.nspacl, acldefault('n', n.nspowner))) x
       where n.nspname in ('public', 'app', 'identity') and x.grantee = 0 and x.privilege_type = 'CREATE'`,
    );
    expect(open.rows).toEqual([]);
  }

  beforeAll(async () => {
    cluster = await startOwnCluster(ROOT, "khong-sieu");
    const admin = await connect("postgres");
    await admin.query(`create role ${OWNER} login createrole bypassrls password '${PASSWORD}'`);
    // The baseline: the same migrations as the superuser, as the lanes and CI run them.
    await admin.query("create database ks_sieu");
    const r = migrate("ks_sieu", { as: "postgres" });
    expect(r.stderr).toBe("");
    expect(r.status).toBe(0);
    const c = await connect("ks_sieu");
    baseline = (await c.query<{ line: string }>(PRIVILEGES)).rows.map((x) => x.line);
    expect(baseline.length).toBeGreaterThan(40);
    await reset();
  }, 180_000);

  afterAll(async () => {
    for (const c of clients) await c.end().catch(() => {});
    cluster?.remove();
  });

  it("đối chứng: migrate.sh cũ dừng ở 002 «must be able to SET ROLE», sổ chỉ có 001", async () => {
    const fromGit = spawnSync("git", ["show", `${OLD_COMMIT}:db/scripts/migrate.sh`], {
      cwd: ROOT,
      encoding: "utf8",
    });
    // A shallow checkout (CI) has no history: the copy above is then taken as it is.
    if (fromGit.status === 0) expect(fromGit.stdout).toBe(`${OLD_MIGRATE}\n`);

    await newDatabase("ks_cu");
    const r = migrate("ks_cu", { script: scriptFile("cu", `${OLD_MIGRATE}\n`) });
    expect(r.status).toBe(1);
    expect(r.stderr).toContain('must be able to SET ROLE "quy_hang_identity"');
    expect(r.stderr).toContain("lỗi khi áp 002_dang_nhap_ma_email.sql");
    expect(await applied("ks_cu")).toEqual(["001_nen_cong_ty.sql"]);
  }, 120_000);

  it("001 đã áp bằng bản cũ: migrate.sh nay đi tiếp tới 014, quyền như siêu vai, cach-ly-dich xanh", async () => {
    const r = migrate("ks_cu");
    expect(r.stderr).toBe("");
    expect(r.status).toBe(0);
    expect(await applied("ks_cu")).toContain("014_thu_quyen_vai_cong_khai.sql");
    expect(await privileges("ks_cu")).toEqual(baseline);
    await selfGrants("ks_cu");
    await loginAndIsolation("ks_cu");
    // Again: nothing to apply, nothing to grant.
    const again = migrate("ks_cu");
    expect(again.stderr).toBe("");
    expect(again.stdout).toContain("xong — 0 migration mới");
  }, 180_000);

  it("cơ sở trống: migrate.sh nay áp hết, quyền như siêu vai, cach-ly-dich xanh; phiên khác không thấy quyền cho mượn", async () => {
    await reset();
    await newDatabase("ks_moi");
    // A second session polls, as fast as it can, who holds CREATE on the repo's schemas while every migration runs:
    // the CREATE lent to PUBLIC (002) and to quy_hang_identity (003) is never committed, so it never shows.
    const watcher = await connect("ks_moi");
    const seen = new Set<string>();
    let polls = 0;
    let running = true;
    const poller = (async () => {
      while (running) {
        for (const line of await holders(watcher)) seen.add(line);
        polls++;
      }
    })();
    const r = await migrateAsync("ks_moi");
    running = false;
    await poller;
    expect([...seen]).toEqual([]);
    expect(polls).toBeGreaterThan(50);
    // The poll does see a CREATE once it is committed.
    const owner = await connect("ks_moi", OWNER);
    await owner.query("grant create on schema app to public");
    expect(await holders(watcher)).toContain("app public");
    await owner.query("revoke create on schema app from public");

    expect(r.stderr).toBe("");
    expect(r.status).toBe(0);
    expect(await applied("ks_moi")).toContain("014_thu_quyen_vai_cong_khai.sql");
    expect(await privileges("ks_moi")).toEqual(baseline);
    await selfGrants("ks_moi");
    await loginAndIsolation("ks_moi");
  }, 180_000);

  it("migration hỏng giữa chừng: giao dịch huỷ, không ai còn quyền tạo; trong giao dịch chỉ mượn hẹp", async () => {
    await reset();
    await newDatabase("ks_hong");
    // 004 creates a role and hands it a function (PUBLIC lends, the role does not exist yet), hands another function to
    // quy_hang_identity (it exists: it is lent CREATE itself), shows who holds CREATE at that point, then fails.
    const dir = migrationsDir(3, {
      "004_hong.sql": `
        create role ks_vai_hong nologin;
        create function app.hong_a() returns int language sql as 'select 1';
        create function app.hong_b() returns int language sql as 'select 1';
        alter function app.hong_a() owner to ks_vai_hong;
        alter function app.hong_b() owner to quy_hang_identity;
        do $$ begin
          raise warning 'trong giao dịch: %', (select string_agg(n.nspname || ' ' || coalesce(nullif(x.grantee, 0)::regrole::text, 'public'), ', ' order by n.nspname, x.grantee <> 0)
            from pg_namespace n, aclexplode(n.nspacl) x
            where n.nspname in ('app', 'identity') and x.privilege_type = 'CREATE' and x.grantee <> n.nspowner);
        end $$;
        select 1 / 0;
      `,
    });
    const r = migrate("ks_hong", { dir });
    expect(r.status).toBe(1);
    expect(r.stderr).toContain("lỗi khi áp 004_hong.sql");
    expect(r.stderr).toContain(
      "trong giao dịch: app public, app quy_hang_identity, identity public, identity quy_hang_identity",
    );
    expect(await applied("ks_hong")).toEqual([
      "001_nen_cong_ty.sql",
      "002_dang_nhap_ma_email.sql",
      "003_moi_nguoi_gan_vai.sql",
    ]);
    const c = await connect("ks_hong");
    expect(await holders(c)).toEqual([]);
    expect((await c.query("select from pg_roles where rolname = 'ks_vai_hong'")).rowCount).toBe(0);
  }, 180_000);

  it("migration để lại quyền tạo trên schema của kho: migrate.sh dừng, gọi tên schema", async () => {
    await reset();
    for (const [db, to] of [
      ["ks_lo_vai", "quy_hang_app"],
      ["ks_lo_public", "public"],
    ] as const) {
      await newDatabase(db);
      const dir = migrationsDir(1, { "002_cap_tao.sql": `grant create on schema app to ${to};` });
      const r = migrate(db, { dir });
      expect(r.status).toBe(3);
      expect(r.stderr).toContain(
        `!!! migrate.sh: sau 002_cap_tao.sql, ${to === "public" ? "PUBLIC" : to} có quyền CREATE trên schema app`,
      );
    }
  }, 180_000);

  it("đối chứng: chỉ SET, không INHERIT, thì quyền cấp ngay sau khi đổi chủ hàm bị bỏ qua", async () => {
    await reset();
    await newDatabase("ks_set");
    const today = readFileSync(join(ROOT, "db/scripts/migrate.sh"), "utf8");
    const setOnly = today
      .replace("createrole_self_grant = 'set, inherit'", "createrole_self_grant = 'set'")
      .replace("with inherit true, set true", "with inherit false, set true");
    expect(setOnly).not.toBe(today);
    const r = migrate("ks_set", { script: scriptFile("chi-set", setOnly) });
    expect(r.stderr).toContain('no privileges were granted for "login_request_code"');
  }, 180_000);
});
