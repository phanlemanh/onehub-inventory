// Row 22, AC-8 (_acceptance/moi-truong-thu-va-ban-that/evals.yaml E8), on this lane's Postgres (lane K).
//   1. db/scripts/sao-luu.sh refuses a path inside the repository with `không ghi sao lưu vào trong kho` and writes
//      nothing there.
//   2. A seeded database → backup to a folder outside the repository → db/scripts/khoi-phuc-thu.sh restores it into a
//      scratch database: every table has the source's row count, cach-ly-dich passes on the restored copy, the last line
//      matches the format written in docs/van-hanh/nhat-ky-khoi-phuc.md, and the scratch database is dropped.
//   3. Break: a backup that lost one table (pg_dump -T) → red, naming the table.
//   4. Version trap: a pg_dump, a pg_restore or a backup of another major version than the server → red with the pinned
//      line before anything is written or created. Fake tools (a script printing `… (PostgreSQL) <server+1>.2`) stand
//      for a newer client; the real pg_dump 17 against Postgres 16 reproduction is in the PR description. For the restore
//      drill each situation is RUN: exactly one line is printed, «sao lưu lại» only when the source server has the restore
//      server's version (the backup is what must be rescued), and docs/van-hanh/khoi-phuc.md gives that line the same
//      remedy. Break: a runbook copy whose server-version entry says «sao lưu lại» is named.
// The scripts reach Postgres through psql, pg_dump and pg_restore chosen by ./may-khach-pg.ts: inside the lane's
// container on a lane (127.0.0.1:5432, trust), the CI cluster over TCP with its password under `make ci-db`.
import { spawnSync } from "node:child_process";
import { chmodSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import pg from "pg";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { tempDir } from "../support/temp-dir";
import { scratchDb, seed, type ScratchDb } from "./helpers";
import { pgClient } from "./may-khach-pg";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const BACKUP = join(ROOT, "db/scripts/sao-luu.sh");
const RESTORE = join(ROOT, "db/scripts/khoi-phuc-thu.sh");
const LOG_PAGE = join(ROOT, "docs/van-hanh/nhat-ky-khoi-phuc.md");
const RUNBOOK = join(ROOT, "docs/van-hanh/khoi-phuc.md");
const PG = pgClient("k");
const SEED = readFileSync(join(ROOT, "db/tests/vai-dang-nhap-mau.sql"), "utf8");

type Run = { code: number | null; out: string; err: string };

function backup(db: string, file: string, extra: Record<string, string> = {}): Run {
  const r = spawnSync("bash", [BACKUP, file], {
    env: {
      ...process.env,
      PSQL_DICH: PG.psql,
      PG_DUMP_CMD: PG.pgDump,
      MIGRATE_DATABASE_URL: PG.ownerUrl(db),
      ...extra,
    },
    encoding: "utf8",
  });
  return { code: r.status, out: r.stdout, err: r.stderr };
}

function restore(file: string, extra: Record<string, string> = {}): Run {
  const r = spawnSync("bash", [RESTORE, file], {
    env: {
      ...process.env,
      PSQL_DICH: PG.psql,
      PG_RESTORE_CMD: PG.pgRestore,
      KHOI_PHUC_ADMIN_URL: PG.ownerUrl("postgres"),
      KHOI_PHUC_LOGIN_URL: PG.loginUrl("postgres"),
      KHOI_PHUC_GIU: "",
      ...extra,
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

/** The name khoi-phuc-thu.sh gives its scratch database. */
const DRILL_NAME = /^khoi_phuc_thu_\d{8}_\d{6}_\d+$/;

/** Restore drill databases left on the cluster. */
async function drillDatabases(owner: pg.Client): Promise<string[]> {
  const r = await owner.query<{ datname: string }>(
    "select datname from pg_database where datname like 'khoi\\_phuc\\_thu\\_%' order by 1",
  );
  return r.rows.map((x) => x.datname);
}

/** Row count of every table outside the system schemas, by `schema.table`. */
async function perTable(client: pg.Client): Promise<Record<string, number>> {
  const tables = await client.query<{ ten: string }>(
    `select format('%I.%I', n.nspname, c.relname) as ten
     from pg_class c join pg_namespace n on n.oid = c.relnamespace
     where c.relkind in ('r', 'p') and n.nspname not in ('pg_catalog', 'information_schema')
       and n.nspname not like 'pg\\_%' order by 1`,
  );
  const rows: Record<string, number> = {};
  for (const { ten } of tables.rows)
    rows[ten] = Number(
      (await client.query<{ n: string }>(`select count(*) as n from ${ten}`)).rows[0]!.n,
    );
  return rows;
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

/** A fake client tool: `--version` prints `<name> (PostgreSQL) <version>`, `-l` prints `listing`, anything else fails. */
function fakeTool(dir: string, name: string, version: string, listing = ""): string {
  const path = join(dir, `gia-${name}`);
  writeFileSync(
    path,
    [
      "#!/usr/bin/env bash",
      `if [ "\${1:-}" = "--version" ]; then echo "${name} (PostgreSQL) ${version}"; exit 0; fi`,
      `if [ "\${1:-}" = "-l" ]; then cat <<'HET'`,
      listing,
      "HET",
      "exit 0; fi",
      "echo 'gia: không được gọi tới đây' >&2",
      "exit 9",
      "",
    ].join("\n"),
  );
  chmodSync(path, 0o755);
  return path;
}

/** An archive header as `pg_restore -l` prints it. */
function header(fromServer: string, byDump: string): string {
  return [
    ";",
    ";     Format: CUSTOM",
    `;     Dumped from database version: ${fromServer}`,
    `;     Dumped by pg_dump version: ${byDump}`,
    ";",
  ].join("\n");
}

/**
 * For each printed stop line `<head> — <remedy>`, the runbook bullet whose backquoted line (`<a>`, `<b>` standing for
 * numbers) is that head must contain the same remedy, so the operator reads one remedy per situation. Returns what is
 * wrong, by the bullet's line.
 */
function remedyMismatches(doc: string, printed: string[]): string[] {
  const rows = doc.split("\n");
  const entries: { line: string; head: RegExp; text: string }[] = [];
  rows.forEach((row, i) => {
    const m = row.match(/^(\s*)- `(khoi-phuc: [^`]*)`/);
    if (!m) return;
    const indent = m[1]!.length;
    const body = [row];
    for (const more of rows.slice(i + 1)) {
      if (more.trim() === "" || more.search(/\S/) <= indent) break;
      body.push(more);
    }
    const pattern = m[2]!
      .split(/(<[^>]+>)/)
      .map((p) =>
        /^<[^>]+>$/.test(p) ? String.raw`\d+` : p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      )
      .join("");
    entries.push({
      line: m[2]!,
      head: new RegExp(`^${pattern}$`),
      text: body.join(" ").replace(/\s+/g, " "),
    });
  });
  const wrong: string[] = [];
  for (const l of printed) {
    const cut = l.indexOf(" — ");
    const head = cut < 0 ? l : l.slice(0, cut);
    const remedy = cut < 0 ? "" : l.slice(cut + " — ".length);
    const found = entries.filter((e) => e.head.test(head));
    if (found.length === 0) wrong.push(`${head}: sổ tay không có mục`);
    for (const e of found)
      if (!e.text.includes(remedy)) wrong.push(`${e.line}: sổ tay không ghi «${remedy}»`);
  }
  return wrong;
}

describe("sao-luu và khoi-phuc-thu", () => {
  let db: ScratchDb;
  let outside: string;
  let already = new Set<string>();
  /** The server's major version, and one that is not it. */
  let major = 0;
  let other = 0;
  beforeAll(async () => {
    db = await scratchDb("nguon", undefined, { prefix: "sao_luu" });
    await seed(db.owner);
    await db.owner.query(SEED);
    outside = tempDir("sao-luu-");
    already = new Set(await drillDatabases(db.owner));
    const v = await db.owner.query<{ n: string }>(
      "select current_setting('server_version_num') as n",
    );
    major = Math.floor(Number(v.rows[0]!.n) / 10000);
    other = major + 1;
  });
  afterAll(async () => {
    // Guard: a drill database this file's run created and a red test left behind. Ones that existed before the run
    // belong to another suite or lane and are left alone.
    if (db)
      for (const name of await drillDatabases(db.owner))
        if (!already.has(name) && DRILL_NAME.test(name))
          await db.owner.query(`drop database if exists ${name} with (force)`);
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
    expect(scratch).toMatch(DRILL_NAME);
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

  it("cơ sở nháp giữ lại: từng bảng có đúng số dòng của gốc (đọc thẳng bản khôi phục)", async () => {
    const file = join(outside, "giu.dump");
    expect(backup(db.name, file).code).toBe(0);
    const r = restore(file, { KHOI_PHUC_GIU: "1" });
    // Read the kept database's name first, so it is dropped even when the restore went red.
    const scratch = r.out
      .split("\n")
      .find((l) => l.startsWith("co-so-nhap: "))
      ?.slice("co-so-nhap: ".length);
    try {
      expect(r.err).toBe("");
      expect(r.code).toBe(0);
      expect(scratch).toMatch(DRILL_NAME);
      const url = new URL(db.url);
      url.pathname = `/${scratch}`;
      const copy = new pg.Client({ connectionString: url.toString() });
      await copy.connect();
      try {
        const restored = await perTable(copy);
        const source = await perTable(db.owner);
        expect(Object.keys(restored).length).toBeGreaterThan(0);
        expect(restored).toEqual(source);
      } finally {
        await copy.end();
      }
    } finally {
      if (scratch !== undefined && DRILL_NAME.test(scratch))
        await db.owner.query(`drop database if exists ${scratch} with (force)`);
    }
  });

  it("bản phá: số dòng một bảng trong tệp đếm lệch → đỏ «lech dong» gọi tên bảng", async () => {
    const file = join(outside, "lech.dump");
    expect(backup(db.name, file).code).toBe(0);
    const dem = readFileSync(`${file}.dem`, "utf8").trim().split("\n");
    const i = dem.findIndex((l) => l.startsWith("public.agreements\t"));
    expect(i).toBeGreaterThanOrEqual(0);
    const [ten, n] = dem[i]!.split("\t");
    dem[i] = `${ten}\t${Number(n) + 1}`;
    writeFileSync(`${file}.dem`, `${dem.join("\n")}\n`);
    const before = await drillDatabases(db.owner);

    const r = restore(file);
    expect(r.code).toBe(1);
    expect(r.out.split("\n").some((l) => l.startsWith("lech dong: public.agreements "))).toBe(true);
    expect(r.out).not.toMatch(/cach-ly đạt$/m);
    expect(await drillDatabases(db.owner)).toEqual(before);
  });

  it("lệch bản: pg_dump khác bản máy chủ → đỏ một dòng, không ghi tệp", () => {
    const file = join(outside, "lech-ban-dump.dump");
    const r = backup(db.name, file, { PG_DUMP_CMD: fakeTool(outside, "pg_dump", `${other}.2`) });
    expect(r.code).not.toBe(0);
    expect(r.err.trim()).toBe(
      `sao-luu: pg_dump bản ${other}, máy chủ bản ${major} — dùng công cụ cùng bản với máy chủ`,
    );
    expect(existsSync(file)).toBe(false);
    expect(existsSync(`${file}.dem`)).toBe(false);
  });

  // Every version-mismatch situation of the restore drill, produced with fake tools and RUN: the exact stderr lines, «sao
  // lưu lại» only where the source server has the restore server's version, and the runbook gives each printed line
  // the same remedy the script prints.
  type Situation = {
    name: string;
    tool: () => string;
    lines: () => string[];
    backUpAgain: boolean;
  };
  const serverRemedy = "khôi phục vào máy chủ cùng bản với máy chủ gốc, KHÔNG sao lưu lại";
  const situations: Situation[] = [
    {
      name: "(a) pg_restore khác bản máy chủ khôi phục",
      tool: () => fakeTool(outside, "pg_restore", `${other}.2`),
      lines: () => [
        `khoi-phuc: pg_restore bản ${other}, máy chủ khôi phục bản ${major} — dùng công cụ cùng bản với máy chủ`,
      ],
      backUpAgain: false,
    },
    {
      name: "(b) pg_dump của tệp khác bản, máy chủ gốc cùng bản (đứng một mình)",
      tool: () => fakeTool(outside, "pg_restore", `${major}.4`, header(`${major}.4`, `${other}.2`)),
      lines: () => [
        `khoi-phuc: tệp sao lưu lấy bằng pg_dump bản ${other}, máy chủ khôi phục bản ${major} — sao lưu lại bằng công cụ cùng bản`,
      ],
      backUpAgain: true,
    },
    {
      name: "(c) máy chủ gốc khác bản, pg_dump cùng bản máy chủ gốc",
      tool: () => fakeTool(outside, "pg_restore", `${major}.4`, header(`${other}.1`, `${other}.1`)),
      lines: () => [
        `khoi-phuc: tệp sao lưu từ máy chủ bản ${other}, máy chủ khôi phục bản ${major} — ${serverRemedy}`,
      ],
      backUpAgain: false,
    },
    {
      name: "(c') máy chủ gốc khác bản, pg_dump cùng bản máy chủ khôi phục",
      tool: () => fakeTool(outside, "pg_restore", `${major}.4`, header(`${other}.1`, `${major}.4`)),
      lines: () => [
        `khoi-phuc: tệp sao lưu từ máy chủ bản ${other}, máy chủ khôi phục bản ${major} — ${serverRemedy}`,
      ],
      backUpAgain: false,
    },
    {
      // The real case of a newer pg_dump: pg_restore of the server's version cannot read the archive header at all.
      name: "(d) pg_dump mới hơn máy chủ khôi phục, pg_restore không đọc được đầu tệp",
      tool: () => {
        const path = join(outside, "gia-pg_restore-doc-khong-duoc");
        writeFileSync(
          path,
          [
            "#!/usr/bin/env bash",
            `if [ "\${1:-}" = "--version" ]; then echo "pg_restore (PostgreSQL) ${major}.4"; exit 0; fi`,
            `echo "pg_restore: error: unsupported version (1.16) in file header" >&2`,
            "exit 1",
            "",
          ].join("\n"),
        );
        chmodSync(path, 0o755);
        return path;
      },
      lines: () => [
        `khoi-phuc: tệp sao lưu lấy bằng pg_dump mới hơn bản ${major} của máy chủ khôi phục — ${serverRemedy}`,
      ],
      backUpAgain: false,
    },
  ];

  /** Stderr lines of khoi-phuc-thu.sh run in one situation; no scratch database may be created. */
  async function runSituation(s: Situation): Promise<string[]> {
    const file = join(outside, "lech-ban.dump");
    writeFileSync(file, "không đọc tới\n");
    writeFileSync(`${file}.dem`, "public.agreements\t0\n");
    const before = await drillDatabases(db.owner);
    const r = restore(file, { PG_RESTORE_CMD: s.tool() });
    expect(r.code).toBe(2);
    expect(r.out).not.toContain("co-so-nhap:");
    expect(await drillDatabases(db.owner)).toEqual(before);
    return r.err.split("\n").filter((l) => l !== "");
  }

  for (const s of situations)
    it(`lệch bản ${s.name}: đúng các dòng in, cách sửa trùng sổ tay, không tạo cơ sở nháp`, async () => {
      const printed = await runSituation(s);
      expect(printed).toEqual(s.lines());
      expect(
        printed.some((l) => l.includes("sao lưu lại") && !l.includes("KHÔNG sao lưu lại")),
      ).toBe(s.backUpAgain);
      expect(remedyMismatches(readFileSync(RUNBOOK, "utf8"), printed)).toEqual([]);
    });

  it("bản phá: sổ tay bảo «sao lưu lại» ở dòng máy chủ gốc khác bản → gọi tên chỗ lệch", async () => {
    const printed = await runSituation(situations[2]!);
    const doc = readFileSync(RUNBOOK, "utf8");
    const at = doc.indexOf("    - `khoi-phuc: tệp sao lưu từ máy chủ bản <a>");
    expect(at).toBeGreaterThanOrEqual(0);
    const head = "`khoi-phuc: tệp sao lưu từ máy chủ bản <a>, máy chủ khôi phục bản <b>` — ";
    const next = doc.indexOf("\n    - `khoi-phuc:", at + 1);
    const copy = join(tempDir("so-tay-pha-"), "khoi-phuc.md");
    writeFileSync(
      copy,
      `${doc.slice(0, at)}    - ${head}sao lưu lại bằng công cụ cùng bản rồi làm lại từ bước 3.${doc.slice(next)}`,
    );
    expect(remedyMismatches(readFileSync(copy, "utf8"), printed)).toEqual([
      `khoi-phuc: tệp sao lưu từ máy chủ bản <a>, máy chủ khôi phục bản <b>: sổ tay không ghi «${serverRemedy}»`,
    ]);
  });
});
