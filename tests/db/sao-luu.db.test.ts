// Row 22, AC-8 (_acceptance/moi-truong-thu-va-ban-that/evals.yaml E8), on this lane's Postgres (lane K).
//   1. db/scripts/sao-luu.sh refuses a path inside the repository with `không ghi sao lưu vào trong kho` and writes
//      nothing there.
//   2. A seeded database → backup to a folder outside the repository → db/scripts/khoi-phuc-thu.sh restores it into a
//      scratch database: every table has the source's row count, cach-ly-dich passes on the restored copy, the last line
//      matches the format written in docs/van-hanh/nhat-ky-khoi-phuc.md, and the scratch database is dropped.
//   3. Break: a backup that lost one table (pg_dump -T) → red, naming the table.
// The scripts reach Postgres through psql, pg_dump and pg_restore inside the lane's container, so the addresses are the
// container's own (127.0.0.1:5432, trust) and carry no password.
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import type pg from "pg";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { tempDir } from "../support/temp-dir";
import { LOGIN_ROLE, scratchDb, seed, type ScratchDb } from "./helpers";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const BACKUP = join(ROOT, "db/scripts/sao-luu.sh");
const RESTORE = join(ROOT, "db/scripts/khoi-phuc-thu.sh");
const LOG_PAGE = join(ROOT, "docs/van-hanh/nhat-ky-khoi-phuc.md");
const LANE = process.env["DB_LANE"] ?? "k";
const CONTAINER = `onehub-inventory-db-${LANE}`;
const IN_CONTAINER = "postgres://postgres@127.0.0.1:5432";
const SEED = readFileSync(join(ROOT, "db/tests/vai-dang-nhap-mau.sql"), "utf8");

type Run = { code: number | null; out: string; err: string };

function backup(db: string, file: string, extra: Record<string, string> = {}): Run {
  const r = spawnSync("bash", [BACKUP, file], {
    env: {
      ...process.env,
      PSQL_DICH: `docker exec -i ${CONTAINER} psql`,
      PG_DUMP_CMD: `docker exec -i ${CONTAINER} pg_dump`,
      MIGRATE_DATABASE_URL: `${IN_CONTAINER}/${db}`,
      ...extra,
    },
    encoding: "utf8",
  });
  return { code: r.status, out: r.stdout, err: r.stderr };
}

function restore(file: string): Run {
  const r = spawnSync("bash", [RESTORE, file], {
    env: {
      ...process.env,
      PSQL_DICH: `docker exec -i ${CONTAINER} psql`,
      PG_RESTORE_CMD: `docker exec -i ${CONTAINER} pg_restore`,
      KHOI_PHUC_ADMIN_URL: `${IN_CONTAINER}/postgres`,
      KHOI_PHUC_LOGIN_URL: `postgres://${LOGIN_ROLE}@127.0.0.1:5432/postgres`,
      KHOI_PHUC_GIU: "",
    },
    encoding: "utf8",
  });
  return { code: r.status, out: r.stdout, err: r.stderr };
}

/** The line format pinned on the restore log page, as a regex: the date placeholder is a date, the others numbers. */
function logLineFormat(): RegExp {
  const page = readFileSync(LOG_PAGE, "utf8");
  const template = page.match(/^`(khoi-phuc: [^`]*)`$/m)?.[1];
  if (!template) throw new Error("nhat-ky-khoi-phuc.md không có dòng khuôn `khoi-phuc: …`");
  const parts = template.split(/(<[^>]+>)/).map((p) => {
    if (p === "<YYYY-MM-DD>") return String.raw`(\d{4}-\d{2}-\d{2})`;
    if (/^<[^>]+>$/.test(p)) return String.raw`(\d+)`;
    return p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  });
  return new RegExp(`^${parts.join("")}$`);
}

/** Restore drill databases left on the cluster. */
async function drillDatabases(owner: pg.Client): Promise<string[]> {
  const r = await owner.query<{ datname: string }>(
    "select datname from pg_database where datname like 'khoi\\_phuc\\_thu\\_%' order by 1",
  );
  return r.rows.map((x) => x.datname);
}

/** Number of tables outside the system schemas and their total rows. */
async function totals(owner: pg.Client): Promise<{ tables: number; rows: number }> {
  const tables = await owner.query<{ ten: string }>(
    `select format('%I.%I', n.nspname, c.relname) as ten
     from pg_class c join pg_namespace n on n.oid = c.relnamespace
     where c.relkind in ('r', 'p') and n.nspname not in ('pg_catalog', 'information_schema')
       and n.nspname not like 'pg\\_%'`,
  );
  let rows = 0;
  for (const { ten } of tables.rows)
    rows += Number(
      (await owner.query<{ n: string }>(`select count(*) as n from ${ten}`)).rows[0]!.n,
    );
  return { tables: tables.rowCount ?? 0, rows };
}

describe("sao-luu và khoi-phuc-thu", () => {
  let db: ScratchDb;
  let outside: string;
  beforeAll(async () => {
    db = await scratchDb("nguon", undefined, { prefix: "sao_luu" });
    await seed(db.owner);
    await db.owner.query(SEED);
    outside = tempDir("sao-luu-");
  });
  afterAll(async () => {
    await db?.drop();
  });

  it("từ chối đường trong kho, không ghi gì", () => {
    const inside = join(ROOT, "sao-luu-thu.dump");
    const r = backup(db.name, inside);
    expect(r.code).not.toBe(0);
    expect(r.err.trim()).toBe("không ghi sao lưu vào trong kho");
    expect(existsSync(inside)).toBe(false);
    expect(existsSync(`${inside}.dem`)).toBe(false);
  });

  it("khôi phục vào cơ sở nháp: đủ bảng, đủ dòng, cach-ly đạt, dòng đúng khuôn nhật ký, cơ sở nháp đã xoá", async () => {
    expect(outside.startsWith(ROOT)).toBe(false);
    const file = join(outside, "lanh.dump");
    const b = backup(db.name, file);
    expect(b.err).toBe("");
    expect(b.code).toBe(0);
    expect(existsSync(file)).toBe(true);

    const source = await totals(db.owner);
    expect(source.rows).toBeGreaterThan(0);
    const before = await drillDatabases(db.owner);

    const r = restore(file);
    expect(r.err).toBe("");
    expect(r.code).toBe(0);
    const lines = r.out.trim().split("\n");
    expect(lines).toContain("cach-ly-dich: 4 ca đạt");
    expect(lines.some((l) => l.startsWith("thieu bang:") || l.startsWith("lech dong:"))).toBe(
      false,
    );
    const m = lines.at(-1)!.match(logLineFormat());
    expect(m, `dòng cuối «${lines.at(-1)}» không khớp khuôn`).not.toBeNull();
    expect(m![1]).toBe(new Date().toLocaleDateString("sv-SE"));
    expect(Number(m![2])).toBe(source.tables);
    expect(Number(m![3])).toBe(source.rows);

    const scratch = lines.find((l) => l.startsWith("co-so-nhap: "))?.slice("co-so-nhap: ".length);
    expect(scratch).toMatch(/^khoi_phuc_thu_\d{8}_\d{6}_\d+$/);
    expect(await drillDatabases(db.owner)).toEqual(before);
  });

  it("bản phá: tệp thiếu một bảng → đỏ gọi tên bảng", async () => {
    const file = join(outside, "pha.dump");
    const b = backup(db.name, file, { PG_DUMP_ARGS: "-T public.agreements" });
    expect(b.code).toBe(0);
    const before = await drillDatabases(db.owner);

    const r = restore(file);
    expect(r.code).toBe(1);
    expect(r.out.split("\n")).toContain("thieu bang: public.agreements");
    expect(r.err).toContain("khoi-phuc: đỏ — số dòng không khớp bản sao lưu");
    expect(r.out).not.toMatch(/cach-ly đạt$/m);
    expect(await drillDatabases(db.owner)).toEqual(before);
  });
});
