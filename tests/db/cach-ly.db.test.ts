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
async function open(suffix: string, breakFile?: string): Promise<ScratchDb> {
  const db = await scratchDb(suffix, breakFile, { prefix: "cach_ly_db" });
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

describe("isolation runner names every broken break file (E9b)", () => {
  function runRunner(tests: string): { code: number; out: string } {
    try {
      const out = execFileSync("bash", [join(ROOT, "db/scripts/cach-ly.sh")], {
        env: { ...process.env, DB_LANE: process.env["DB_LANE"] ?? "c", TESTS_DIR: tests },
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

  it("control: an unchanged copy passes with 29 cases", () => {
    const dir = copyTests();
    try {
      const r = runRunner(dir);
      expect(r.code, r.out).toBe(0);
      expect(r.out).toContain("cach-ly: 29 ca đạt, vai quy_hang_app");
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("a deleted, a harmless and an unparsable break file are each named", () => {
    const dir = copyTests();
    try {
      unlinkSync(join(dir, "pha-thu/cap-trigger-public.sql"));
      writeFileSync(join(dir, "pha-thu/dang-xem-vat-chat.sql"), "select 1;\n");
      writeFileSync(
        join(dir, "pha-thu/ham-trigger-dac-quyen.sql"),
        "create functio public.hong(;\n",
      );
      const r = runRunner(dir);
      expect(r.code).not.toBe(0);
      expect(r.out).not.toContain("cach-ly: 29 ca đạt");
      expect(r.out.split("\n").filter((l) => l.startsWith("HỎNG pha-thu-"))).toEqual([
        "HỎNG pha-thu-quyen-nguy-hiem: cap-trigger-public: không dựng được bản phá",
        "HỎNG pha-thu-dang-xem-vuot: dang-xem-vat-chat: bộ kiểm vẫn xanh trên bản phá",
        "HỎNG pha-thu-ham-dac-quyen: ham-trigger-dac-quyen: không dựng được bản phá",
      ]);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
