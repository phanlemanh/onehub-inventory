// Row 7a (_acceptance/cach-ly-truoc-du-lieu-that/evals.yaml E7, E8, E9b), on this lane's Postgres.
//   1. The agreements table and the ontology agree: the kinds, directions and statuses the table accepts are exactly
//      the enum values of ontology/entities/Agreement.yaml, and every extra check the table applies is a named rule
//      of the ontology whose implemented_in file holds it (Ngoài-1 of row 7).
//   2. The isolation runner names every broken break file: a missing file, a file that no longer turns the suite red,
//      and a file that does not parse (gap-probe P1 of row 7a).
// Every comparison returns the list of differences, so the break cases assert the exact message, not only "red".
import { execFileSync } from "node:child_process";
import { cpSync, mkdtempSync, readFileSync, rmSync, unlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import type pg from "pg";
import { afterEach, describe, expect, it } from "vitest";

import { scratchDb, type ScratchDb } from "./helpers";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const MODEL = join(ROOT, "ontology/entities/Agreement.yaml");

/** Checks on agreements that only say what one column may hold; they are compared as enums, not as rules. */
const COLUMN_SHAPE = new Set([
  "agreements_kind_check",
  "agreements_direction_check",
  "agreements_status_check",
  "agreements_data_classes_check",
  "agreements_valid_range",
]);
/** The enum properties of Agreement and the check that holds each one in the table. */
const ENUMS = {
  kind: "agreements_kind_check",
  direction: "agreements_direction_check",
  status: "agreements_status_check",
};
/** Written before the code: each table rule and the ontology rule that names it. */
const RULE_OF: Record<string, string> = {
  agreements_never_source: "source-class-never-leaves",
  agreements_internal_stays: "internal-data-inbound-only",
};

/** The `values: [...]` of one property of the entity file (inline or over several lines). */
export function enumValues(model: string, property: string): string[] {
  const block = new RegExp(`^  ${property}:([\\s\\S]*?)(?=^  \\w+:|^\\S)`, "m").exec(model);
  const list = block && /values:\s*\[([^\]]*)\]/.exec(block[1]!);
  if (!list) throw new Error(`mô hình không có giá trị cho ${property}`);
  return list[1]!
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

/** id → implemented_in of every rule of the entity file. */
export function modelRules(model: string): Map<string, string | undefined> {
  const rules = new Map<string, string | undefined>();
  const section = /^rules:\n([\s\S]*?)(?=^\S)/m.exec(model + "\nend:");
  for (const item of (section?.[1] ?? "").split(/^ {2}- /m).slice(1)) {
    const id = /^id:\s*(\S+)/.exec(item)?.[1];
    if (id) rules.set(id, /implemented_in:\s*(\S+)/.exec(item)?.[1]);
  }
  return rules;
}

interface TableChecks {
  values: Record<string, string[]>;
  extra: string[];
}

async function tableChecks(owner: pg.Client): Promise<TableChecks> {
  const rows = (
    await owner.query<{ conname: string; def: string }>(
      "select conname, pg_get_constraintdef(oid) as def from pg_constraint " +
        "where conrelid = 'agreements'::regclass and contype = 'c' order by conname",
    )
  ).rows;
  const values: Record<string, string[]> = {};
  for (const r of rows)
    values[r.conname] = [...r.def.matchAll(/'([^']*)'::text/g)].map((m) => m[1]!);
  return { values, extra: rows.map((r) => r.conname).filter((n) => !COLUMN_SHAPE.has(n)) };
}

/** Differences between the enums of the model and the values the table accepts. */
export function compareEnums(model: string, table: TableChecks): string[] {
  const out: string[] = [];
  for (const [property, check] of Object.entries(ENUMS)) {
    const inModel = enumValues(model, property);
    const inTable = table.values[check] ?? [];
    for (const v of inModel)
      if (!inTable.includes(v)) out.push(`mô hình có, bảng không nhận: ${v}`);
    for (const v of inTable)
      if (!inModel.includes(v)) out.push(`bảng nhận, mô hình không có: ${v}`);
  }
  return out;
}

/** Differences between the extra checks of the table and the rules of the model. */
export function compareRules(model: string, table: TableChecks): string[] {
  const out: string[] = [];
  const rules = modelRules(model);
  for (const con of table.extra) {
    const rule = RULE_OF[con];
    const file = rule ? rules.get(rule) : undefined;
    if (!rule || !rules.has(rule) || !file || !readFileSync(join(ROOT, file), "utf8").includes(con))
      out.push(`ràng buộc không có luật trong mô hình: ${con}`);
  }
  for (const con of Object.keys(RULE_OF))
    if (!table.extra.includes(con)) out.push(`luật trỏ tới ràng buộc không còn: ${con}`);
  return out;
}

const dbs: ScratchDb[] = [];
afterEach(async () => {
  for (const db of dbs.splice(0)) await db.drop();
});
/**
 * Scratch names carry this process's id: a grading round runs this file in two commands at once on one lane (the
 * isolation command and the whole database suite), and equal names would drop each other's databases (row 7b, r1).
 */
const TAG = `p${process.pid}`;
async function open(suffix: string, breakFile?: string): Promise<ScratchDb> {
  const db = await scratchDb(suffix, breakFile, { prefix: `cach_ly_db_${TAG}` });
  dbs.push(db);
  return db;
}

describe("agreements table against the ontology (Ngoài-1)", () => {
  const model = readFileSync(MODEL, "utf8");

  it("reads the model: eight kinds, two directions, three statuses, the two table rules", () => {
    expect(enumValues(model, "kind")).toHaveLength(8);
    expect(enumValues(model, "direction")).toEqual(["inbound", "outbound"]);
    expect(enumValues(model, "status")).toEqual(["active", "paused", "ended"]);
    expect([...modelRules(model).keys()]).toEqual(
      expect.arrayContaining(["source-class-never-leaves", "internal-data-inbound-only"]),
    );
  });

  it("the table accepts exactly the model's values, and stores one agreement of every kind", async () => {
    const db = await open("lanh");
    expect(compareEnums(model, await tableChecks(db.owner)), "bảng lệch mô hình").toEqual([]);
    const { rows } = await db.owner.query<{ id: string }>(
      "insert into companies (name) values ('[Sàn A]') returning id",
    );
    for (const kind of enumValues(model, "kind"))
      await db.owner.query(
        "insert into agreements (company_id, kind, direction, counterparty, data_classes, valid_from, approved_by) " +
          "values ($1, $2, 'inbound', 'mẫu', '{catalog}', now(), '[Tên]')",
        [rows[0]!.id, kind],
      );
    expect((await db.owner.query("select count(*)::int as n from agreements")).rows[0].n).toBe(8);
  });

  it("every extra check of the table is a named rule of the model", async () => {
    const db = await open("luat");
    expect(compareRules(model, await tableChecks(db.owner)), "luật của bảng lệch mô hình").toEqual(
      [],
    );
  });

  it("break: a kind only the model has is named", async () => {
    const db = await open("lanh_mo_hinh_thua");
    const wider = model.replace(
      "catalog_confirmation,",
      "catalog_confirmation,\n        loai_khong_co,",
    );
    expect(wider).not.toBe(model);
    expect(compareEnums(wider, await tableChecks(db.owner))).toEqual([
      "mô hình có, bảng không nhận: loai_khong_co",
    ]);
  });

  it("break: a kind only the table accepts is named", async () => {
    const db = await open("loai_thua", "thoa-thuan-loai-thua");
    expect(compareEnums(model, await tableChecks(db.owner))).toEqual([
      "bảng nhận, mô hình không có: loai_thua",
    ]);
  });

  it("break: a table check the model does not name, and a model rule removed, are named", async () => {
    const db = await open("rang_buoc_moi", "thoa-thuan-rang-buoc-moi");
    expect(compareRules(model, await tableChecks(db.owner))).toEqual([
      "ràng buộc không có luật trong mô hình: agreements_them_mau",
    ]);
    const clean = await open("bo_luat");
    const without = model.replace(/ {2}- id: source-class-never-leaves[\s\S]*?(?= {2}- id: )/, "");
    expect(without).not.toBe(model);
    expect(compareRules(without, await tableChecks(clean.owner))).toEqual([
      "ràng buộc không có luật trong mô hình: agreements_never_source",
    ]);
  });
});

/** Commit where row 7a reached main: the runner whose cases and pinned lines no later row may loosen. */
const RUNNER_BASE = "d85d815";
/** The runner on the main branch when row 7c opened (_acceptance/ung-dung-noi-bang-vai-khong-chu, E5). */
const RUNNER_BASE_7C = "83d1764";

/**
 * The runner at a base commit, read from its byte-exact copy in tests/fixtures (row 1s): CI checks out shallow, so the
 * commit is not there to `git show`. tests/ci-ban-sao-nong.test.ts pins each copy's git blob id.
 */
function runnerCopy(commit: string): string {
  return join(ROOT, "tests/fixtures", `cach-ly-${commit}.sh`);
}

interface RunnerShape {
  cases: string[];
  /** break file → its pinned lines, for every break file of every break case. */
  pins: Map<string, string[]>;
  /** break file → its break case. */
  caseOf: Map<string, string>;
}

/** Reads the case lists and the two break functions of a runner text by running them in bash, not by parsing. */
export function runnerShape(text: string): RunnerShape {
  const pick = (re: RegExp, what: string) => {
    const m = re.exec(text);
    if (!m) throw new Error(`bộ chạy không có ${what}`);
    return m[0];
  };
  const defs = [
    pick(/^CA_SQL=\([\s\S]*?^\)$/m, "CA_SQL"),
    pick(/^CA_LENH=\([\s\S]*?^\)$/m, "CA_LENH"),
    pick(/^pha_thu_tep\(\) \{[\s\S]*?^\}$/m, "pha_thu_tep"),
    pick(/^pha_thu_ghim\(\) \{[\s\S]*?^\}$/m, "pha_thu_ghim"),
    // Row 7c: the login-role cases, absent from older runners.
    /^CA_DANG_NHAP=\([\s\S]*?^\)$/m.exec(text)?.[0] ?? "CA_DANG_NHAP=()",
  ].join("\n");
  const out = execFileSync(
    "bash",
    [
      "-c",
      'eval "$DEFS"; for c in "${CA_SQL[@]}" "${CA_LENH[@]}" "${CA_DANG_NHAP[@]}"; do echo "ca|$c"; done; ' +
        'for c in "${CA_LENH[@]}"; do p=${c#pha-thu-}; [ "$p" = "$c" ] && continue; ' +
        'while read -r t; do [ -z "$t" ] && continue; echo "tep|$p|$t"; ' +
        'while IFS= read -r g; do echo "ghim|$t|$g"; done < <(pha_thu_ghim "$t"); done < <(pha_thu_tep "$p"); done',
    ],
    { env: { ...process.env, DEFS: defs }, encoding: "utf8" },
  );
  const shape: RunnerShape = { cases: [], pins: new Map(), caseOf: new Map() };
  for (const line of out.split("\n")) {
    const [kind, a, b] = line.split("|");
    if (kind === "ca") shape.cases.push(a!);
    if (kind === "tep") {
      shape.caseOf.set(b!, a!);
      shape.pins.set(b!, []);
    }
    if (kind === "ghim") shape.pins.get(a!)!.push(b!);
  }
  return shape;
}

/** What the old runner measured and the new one no longer does, word for word. */
export function loosened(base: RunnerShape, now: RunnerShape): string[] {
  const out: string[] = [];
  for (const c of base.cases) if (!now.cases.includes(c)) out.push(`mất ca: ${c}`);
  for (const [file, pins] of base.pins) {
    if (now.caseOf.get(file) !== base.caseOf.get(file)) {
      out.push(`tệp phá ${file} không còn ở ca pha-thu-${base.caseOf.get(file)}`);
      continue;
    }
    for (const pin of pins)
      if (!now.pins.get(file)!.includes(pin)) out.push(`tệp phá ${file} mất dòng ghim: ${pin}`);
  }
  return out;
}

describe("isolation runner keeps every case and pinned line of rows 7 and 7a (E5)", () => {
  const base = runnerShape(readFileSync(runnerCopy(RUNNER_BASE), "utf8"));
  const current = readFileSync(join(ROOT, "db/scripts/cach-ly.sh"), "utf8");

  it(`reads the runner at ${RUNNER_BASE}: 29 cases, 18 break files, 21 pinned lines`, () => {
    expect(base.cases).toHaveLength(29);
    expect(base.pins.size).toBe(18);
    expect([...base.pins.values()].flat()).toHaveLength(21);
  });

  it("the current runner still has every old case, break file and pinned line, word for word", () => {
    expect(loosened(base, runnerShape(current))).toEqual([]);
  });

  it("break: one letter changed in the pinned line of dang-xem-thuong is named", () => {
    const old = '"HỎNG dang-xem-khong-vuot-luat: public.agreements_tat_ca"';
    expect(current).toContain(old);
    const edited = current.replace(
      old,
      '"HỎNG dang-xem-khong-vuot-luat: public.agreements_tat_cb"',
    );
    expect(loosened(base, runnerShape(edited))).toEqual([
      "tệp phá dang-xem-thuong mất dòng ghim: HỎNG dang-xem-khong-vuot-luat: public.agreements_tat_ca",
    ]);
  });
});

// Row 7c (_acceptance/ung-dung-noi-bang-vai-khong-chu/evals.yaml E5): nothing the runner measured before the row is
// loosened, and the count on the last line is the runner's own number of cases.
const CURRENT_CASES = runnerShape(readFileSync(join(ROOT, "db/scripts/cach-ly.sh"), "utf8")).cases;
const LAST_LINE = `cach-ly: ${CURRENT_CASES.length} ca đạt, vai quy_hang_app, nối bằng quy_hang_login`;

describe("isolation runner after row 7c keeps everything the main branch measured (E5)", () => {
  const base = runnerShape(readFileSync(runnerCopy(RUNNER_BASE_7C), "utf8"));

  it(`reads the runner at ${RUNNER_BASE_7C}: 31 cases, 24 break files`, () => {
    expect(base.cases).toHaveLength(31);
    expect(base.pins.size).toBe(24);
  });

  it("the current runner keeps every case and pinned line of it, and adds the four login-role cases", () => {
    expect(
      loosened(base, runnerShape(readFileSync(join(ROOT, "db/scripts/cach-ly.sh"), "utf8"))),
    ).toEqual([]);
    expect(CURRENT_CASES.filter((c) => !base.cases.includes(c))).toEqual(
      expect.arrayContaining([
        "vai-dang-nhap-khong-ve-chu",
        "dang-nhap-khong-ve-vai-chu",
        "dang-nhap-qua-cua-doc-duoc",
        "pha-thu-vai-dang-nhap",
      ]),
    );
  });
});

/**
 * A whole runner run (35 cases, 31 scratch databases) takes about a minute alone and longer when a grading round runs
 * other database commands on the lane at the same time (row 7c, round 1: 81 s) — past vitest's 60 s default.
 */
const RUNNER_TIMEOUT = 300_000;

describe("isolation runner names every broken break file (E9b)", () => {
  function runRunner(tests: string): { code: number; out: string } {
    try {
      const out = execFileSync("bash", [join(ROOT, "db/scripts/cach-ly.sh")], {
        env: {
          ...process.env,
          DB_LANE: process.env["DB_LANE"] ?? "c",
          TESTS_DIR: tests,
          CACH_LY_NHAN: TAG,
        },
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
      });
      return { code: 0, out };
    } catch (err) {
      const e = err as { status: number; stdout: string; stderr: string };
      return { code: e.status, out: e.stdout + e.stderr };
    }
  }
  function copyTests(): string {
    const dir = mkdtempSync(join(tmpdir(), "cach-ly-tests-"));
    cpSync(join(ROOT, "db/tests"), dir, { recursive: true });
    return dir;
  }

  it(
    `control: an unchanged copy passes with ${CURRENT_CASES.length} cases`,
    () => {
      const dir = copyTests();
      try {
        const r = runRunner(dir);
        expect(r.code, r.out).toBe(0);
        expect(r.out.trimEnd().split("\n").at(-1)).toBe(LAST_LINE);
      } finally {
        rmSync(dir, { recursive: true, force: true });
      }
    },
    RUNNER_TIMEOUT,
  );

  it("a tag other than lowercase letters and digits is refused before any database is made", () => {
    try {
      execFileSync("bash", [join(ROOT, "db/scripts/cach-ly.sh")], {
        env: { ...process.env, DB_LANE: process.env["DB_LANE"] ?? "c", CACH_LY_NHAN: "x; drop" },
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
      });
      expect.unreachable("bộ chạy nhận nhãn có ký tự lạ");
    } catch (err) {
      const e = err as { status: number; stderr: string };
      expect(e.status).toBe(2);
      expect(e.stderr).toContain(
        "từ chối: CACH_LY_NHAN chỉ gồm chữ thường và số, không phải x; drop",
      );
    }
  });

  it(
    "a deleted, two harmless and an unparsable break file are each named",
    () => {
      const dir = copyTests();
      try {
        unlinkSync(join(dir, "pha-thu/cap-trigger-public.sql"));
        writeFileSync(join(dir, "pha-thu/dang-xem-vat-chat.sql"), "select 1;\n");
        writeFileSync(
          join(dir, "pha-thu/ham-trigger-dac-quyen.sql"),
          "create functio public.hong(;\n",
        );
        writeFileSync(join(dir, "pha-thu/dang-xem-chi-xoa.sql"), "select 1;\n");
        writeFileSync(join(dir, "pha-thu/cap-vai-chu.sql"), "select 1;\n");
        const r = runRunner(dir);
        expect(r.code).not.toBe(0);
        expect(r.out).not.toContain(LAST_LINE);
        expect(r.out.split("\n").filter((l) => l.startsWith("HỎNG pha-thu-"))).toEqual([
          "HỎNG pha-thu-quyen-nguy-hiem: cap-trigger-public: không dựng được bản phá",
          "HỎNG pha-thu-dang-xem-vuot: dang-xem-vat-chat: bộ kiểm vẫn xanh trên bản phá",
          "HỎNG pha-thu-ham-dac-quyen: ham-trigger-dac-quyen: không dựng được bản phá",
          "HỎNG pha-thu-dang-xem-chi-ghi: dang-xem-chi-xoa: bộ kiểm vẫn xanh trên bản phá",
          "HỎNG pha-thu-vai-dang-nhap: cap-vai-chu: bộ kiểm vẫn xanh trên bản phá",
        ]);
      } finally {
        rmSync(dir, { recursive: true, force: true });
      }
    },
    RUNNER_TIMEOUT,
  );
});

// Row 7b (_acceptance/cach-ly-dang-xem-chi-ghi/evals.yaml E3): the hole case 20 closes is real, not a false alarm.
// Same copy built from the break file dang-xem-chi-xoa, two companies with one agreement each; the API role with
// company A set by the door's own statement deletes through the view.
describe("break: a delete-only plain view lets company A delete company B's agreements (E3)", () => {
  const A = "00000000-0000-4000-8000-00000000000a";
  const B = "00000000-0000-4000-8000-00000000000b";
  /** The door's statement, read from db/tests/cach-ly.sql (`prepare dat_san`), which a unit test pins to the door. */
  const DAT_SAN = /^prepare dat_san\(text, text\) as (.*);$/m.exec(
    readFileSync(join(ROOT, "db/tests/cach-ly.sql"), "utf8"),
  )![1]!;

  async function deleteAsA(db: ScratchDb): Promise<string | null> {
    await db.owner.query("begin");
    try {
      await db.owner.query("set local role quy_hang_app");
      await db.owner.query(DAT_SAN, ["[Tên]", A]);
      await db.owner.query("delete from public.agreements_xoa where true");
      await db.owner.query("commit");
      return null;
    } catch (err) {
      await db.owner.query("rollback");
      return (err as Error).message;
    }
  }
  const countOfB = async (db: ScratchDb) =>
    (
      await db.owner.query<{ n: number }>(
        "select count(*)::int as n from agreements where company_id = $1",
        [B],
      )
    ).rows[0]!.n;

  it("plain view: B goes from 1 to 0; security_invoker view: permission denied and B keeps 1", async () => {
    const db = await open("xem_chi_xoa");
    await db.owner.query(readFileSync(join(ROOT, "db/tests/pha-thu/dang-xem-chi-xoa.sql"), "utf8"));
    await db.owner.query(
      `insert into companies (id, name) values ('${A}', '[Sàn A]'), ('${B}', '[Sàn B]');
       insert into agreements (company_id, kind, direction, counterparty, data_classes, valid_from, approved_by)
       values ('${A}', 'catalog_source', 'inbound', 'nguồn mẫu', '{catalog}', now(), '[Tên]'),
              ('${B}', 'listing_channel', 'outbound', 'kênh mẫu', '{shareable_listing}', now(), '[Tên]')`,
    );
    expect(await countOfB(db)).toBe(1);
    expect(await deleteAsA(db)).toBeNull();
    expect(await countOfB(db), "dạng xem thường xoá được thoả thuận của sàn B").toBe(0);

    await db.owner.query(
      `insert into agreements (company_id, kind, direction, counterparty, data_classes, valid_from, approved_by)
       values ('${B}', 'listing_channel', 'outbound', 'kênh mẫu', '{shareable_listing}', now(), '[Tên]')`,
    );
    await db.owner.query("alter view public.agreements_xoa set (security_invoker = true)");
    expect(await deleteAsA(db)).toBe("permission denied for table agreements");
    expect(await countOfB(db)).toBe(1);
  });
});

// Row 7c (_acceptance/ung-dung-noi-bang-vai-khong-chu/evals.yaml E2, E3): the session file proves something only because
// it runs on a connection logged in as quy_hang_login. Run under the owner, the same file must go red; and it switches
// role and company with the door's own statements.
describe("login-role session file (E2, E3)", () => {
  const PHIEN = join(ROOT, "db/tests/vai-dang-nhap-phien.sql");
  function runAs(fn: "pg_psql" | "pg_psql_login", db: string): string[] {
    const out = execFileSync(
      "bash",
      [
        "-c",
        `source "$1/db/scripts/psql.sh"; ${fn} -d "$2" -X -q -o /dev/null <"$3" 2>&1; true`,
        "_",
        ROOT,
        db,
        PHIEN,
      ],
      { env: { ...process.env, DB_LANE: process.env["DB_LANE"] ?? "c" }, encoding: "utf8" },
    );
    return out
      .split("\n")
      .map((l) => /(?:NOTICE|ERROR):\s+((?:ok|HỎNG) .*)$/.exec(l)?.[1])
      .filter((l): l is string => l !== undefined);
  }

  it("on a login-role connection both cases pass; under the owner the refusal case is red", async () => {
    const db = await open("phien");
    await db.owner.query(readFileSync(join(ROOT, "db/tests/vai-dang-nhap-mau.sql"), "utf8"));
    expect(runAs("pg_psql_login", db.name)).toEqual([
      "ok dang-nhap-khong-ve-vai-chu",
      "ok dang-nhap-qua-cua-doc-duoc — 1 thoả thuận của sàn A",
    ]);
    expect(runAs("pg_psql", db.name)).toContain(
      "HỎNG dang-nhap-khong-ve-vai-chu: set role postgres không bị từ chối",
    );
  });

  it("the session file switches role and company with the door's exact statements", async () => {
    const { SET_ROLE_SQL, SET_CONTEXT_SQL } = await import("@/modules/identity/with-company");
    const text = readFileSync(PHIEN, "utf8");
    expect(text).toContain(`\n${SET_ROLE_SQL};\n`);
    expect(text).toContain(`prepare dat_san_cua(text, text) as ${SET_CONTEXT_SQL};`);
  });
});
