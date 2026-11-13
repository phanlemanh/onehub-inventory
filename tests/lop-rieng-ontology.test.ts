// Row 7e (lop-rieng-cua-san), evals E16 and part of E15: the company layer is in the business model with our own names,
// the field kinds are a closed set of five, and the code generator's new object type gives real TypeScript types. Every
// check runs on the real files and on a copy broken in exactly one place, with a pinned message.
import { execFileSync } from "node:child_process";
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, expectTypeOf, it } from "vitest";

import type { CustomField, Listing } from "@/generated/ontology";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
// The repo's own YAML reader (tools/repo_ontology.py), as tests/link-types.test.ts does: no new dependency.
const parseAt = (root: string, rel: string): unknown =>
  JSON.parse(
    execFileSync(
      "python3",
      [
        "-c",
        "import json,sys;from pathlib import Path;sys.path.insert(0,sys.argv[2]+'/tools');from repo_ontology import load_yaml_file;print(json.dumps(load_yaml_file(Path(sys.argv[1]))))",
        join(root, rel),
        ROOT,
      ],
      { encoding: "utf8" },
    ),
  );

export const LAYER_ENTITIES = [
  "CompanyLabel",
  "CustomField",
  "CompanyValueAlias",
  "PendingUnit",
  "ImportTemplate",
] as const;
export const FIELD_KINDS = ["text", "number", "date", "single_select", "boolean"] as const;

type Entity = {
  name: string;
  reso?: string;
  properties: Record<string, { type?: string; values?: unknown[] }>;
};
type Labels = { concepts: Record<string, { reso?: string; pref?: string }> };

function readEntity(root: string, name: string): Entity | null {
  try {
    return parseAt(root, `ontology/entities/${name}.yaml`) as Entity | null;
  } catch {
    return null;
  }
}

/** Every failure of the layer's model as one pinned line; empty when the model holds. */
export function modelFailures(root: string): string[] {
  const out: string[] = [];
  const labels = parseAt(root, "ontology/labels.yaml") as Labels;
  const resoNames = new Set(
    Object.values(labels.concepts)
      .map((c) => c.reso)
      .filter((r): r is string => typeof r === "string"),
  );
  for (const name of LAYER_ENTITIES) {
    const e = readEntity(root, name);
    if (!e) {
      out.push(`entity file missing: ${name}`);
      continue;
    }
    if (e.reso !== "none (our own)") out.push(`entity not marked our own: ${name}`);
    if (resoNames.has(name)) out.push(`entity reuses a RESO name: ${name}`);
    if (!labels.concepts[name]?.pref) out.push(`entity has no label: ${name}`);
    if (typeof e.properties?.["companyId"] !== "object")
      out.push(`entity has no companyId: ${name}`);
  }
  const field = parseAt(root, "ontology/entities/CustomField.yaml") as Entity;
  const kinds = (field.properties["kind"]?.values ?? []).map(String);
  const extra = kinds.filter((k) => !(FIELD_KINDS as readonly string[]).includes(k));
  const missing = FIELD_KINDS.filter((k) => !kinds.includes(k));
  if (extra.length || missing.length)
    out.push(`field kinds differ from ontology: ${[...extra, ...missing].join(", ")}`);
  return out;
}

/** Runs the code generator on a root and returns the TypeScript it would write. */
function generated(root: string): string {
  const out = join(mkdtempSync(join(tmpdir(), "lop-rieng-gen-")), "ontology.ts");
  execFileSync(
    "python3",
    [join(root, "tools/ontology_codegen.py"), "--lang", "ts", "--out", out, "--root", root],
    { cwd: root, encoding: "utf8" },
  );
  return readFileSync(out, "utf8");
}

function brokenCopy(edit: (dir: string) => void): string {
  const dir = mkdtempSync(join(tmpdir(), "lop-rieng-"));
  for (const part of ["ontology", "tools"])
    cpSync(join(ROOT, part), join(dir, part), { recursive: true });
  edit(dir);
  return dir;
}

describe("company layer in the business model (E16)", () => {
  it("holds on the real files: five entities, our own names, five field kinds", () => {
    expect(LAYER_ENTITIES).toHaveLength(5);
    expect(FIELD_KINDS).toHaveLength(5);
    expect(modelFailures(ROOT)).toEqual([]);
  });

  it("break: a sixth kind 'formula' in a copy turns red with the pinned line", () => {
    const dir = brokenCopy((d) => {
      const p = join(d, "ontology/entities/CustomField.yaml");
      writeFileSync(
        p,
        readFileSync(p, "utf8").replace(
          "single_select, boolean]",
          "single_select, boolean, formula]",
        ),
      );
    });
    try {
      expect(modelFailures(dir)).toContain("field kinds differ from ontology: formula");
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("break: an entity file removed in a copy turns red with the pinned line", () => {
    const dir = brokenCopy((d) => rmSync(join(d, "ontology/entities/PendingUnit.yaml")));
    try {
      expect(modelFailures(dir)).toContain("entity file missing: PendingUnit");
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});

describe("the code generator's object type (owner's allowance, plan task 1)", () => {
  it("gives json properties a real object type, not unknown", () => {
    expectTypeOf<Listing["customFields"]>().toEqualTypeOf<
      Record<string, unknown> | unknown[] | undefined
    >();
    expectTypeOf<CustomField["options"]>().toEqualTypeOf<
      Record<string, unknown> | unknown[] | undefined
    >();
    expect(generated(ROOT)).toMatch(/customFields\?: Record<string, unknown> \| unknown\[\];/);
  });

  it("break: without the type in the generator the property falls back to unknown", () => {
    const dir = brokenCopy((d) => {
      const p = join(d, "tools/ontology_codegen.py");
      writeFileSync(
        p,
        readFileSync(p, "utf8").replace('    "json": "Record<string, unknown> | unknown[]",\n', ""),
      );
    });
    try {
      const ts = generated(dir);
      expect(ts, "json type missing from the generator").toMatch(/customFields\?: unknown;/);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});

// ——— Migration half (plan task 2): the five tables match the five entities, and the fence of ADR-0018 holds ————————

const MIGRATION = "db/migrations/010_lop_rieng_cua_san.sql";
const TABLE_OF: Record<(typeof LAYER_ENTITIES)[number], string> = {
  CompanyLabel: "company_labels",
  CustomField: "company_fields",
  CompanyValueAlias: "company_value_aliases",
  PendingUnit: "company_pending_units",
  ImportTemplate: "company_import_templates",
};
const snake = (name: string) => name.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase();

/** Columns of one `create table` in the migration, in order. */
function columnsOf(sql: string, table: string): string[] {
  const m = new RegExp(`create table ${table} \\(([\\s\\S]*?)\\n\\);`).exec(sql);
  if (!m) return [];
  return (
    m[1]!
      .split("\n")
      // A column starts at two spaces; deeper lines continue a constraint.
      .filter(
        (l) => /^ {2}[a-z_]+\s/.test(l) && !/^ {2}(constraint|primary|unique|check)\b/.test(l),
      )
      .map((l) => l.trim().split(/\s+/)[0]!)
  );
}

/** Every failure of the migration against the model and the fence, as pinned lines. */
export function migrationFailures(root: string): string[] {
  const out: string[] = [];
  const sql = readFileSync(join(root, MIGRATION), "utf8");
  for (const name of LAYER_ENTITIES) {
    const e = readEntity(root, name);
    const props = Object.keys(e?.properties ?? {})
      .map(snake)
      .sort();
    const cols = columnsOf(sql, TABLE_OF[name]).sort();
    if (props.join() !== cols.join())
      out.push(`columns differ from ${name}: ${cols.join()} vs ${props.join()}`);
  }
  const kinds = /kind\s+text not null check \(kind in \(([^)]*)\)\)/.exec(sql)?.[1] ?? "";
  const dbKinds = [...kinds.matchAll(/'([a-z_]+)'/g)].map((m) => m[1]!);
  const extra = dbKinds.filter((k) => !(FIELD_KINDS as readonly string[]).includes(k));
  if (extra.length || dbKinds.length !== FIELD_KINDS.length)
    out.push(`field kinds differ from ontology: ${extra.join(", ") || dbKinds.join(", ")}`);
  if (/grant[^;]*\bdelete\b/i.test(sql)) out.push("the API role may delete from the company layer");
  if (/create table \w*(rule|workflow|formula)/i.test(sql))
    out.push("a rule, workflow or formula table exists");
  if (/generated always as \(/i.test(sql)) out.push("a computed column exists");
  return out;
}

describe("migration 010 matches the model and keeps the fence (E16)", () => {
  it("holds on the real files", () => {
    expect(Object.keys(TABLE_OF)).toHaveLength(5);
    expect(migrationFailures(ROOT)).toEqual([]);
  });

  it("break: a 'formula' kind in a copy of the migration is named", () => {
    const dir = mkdtempSync(join(tmpdir(), "lop-rieng-mig-"));
    cpSync(join(ROOT, "ontology"), join(dir, "ontology"), { recursive: true });
    cpSync(join(ROOT, "tools"), join(dir, "tools"), { recursive: true });
    cpSync(join(ROOT, "db/migrations"), join(dir, "db/migrations"), { recursive: true });
    const p = join(dir, MIGRATION);
    writeFileSync(
      p,
      readFileSync(p, "utf8").replace(
        "'single_select', 'boolean')",
        "'single_select', 'boolean', 'formula')",
      ),
    );
    try {
      expect(migrationFailures(dir)).toContain("field kinds differ from ontology: formula");
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("break: a delete grant in a copy of the migration is named", () => {
    const dir = mkdtempSync(join(tmpdir(), "lop-rieng-mig-"));
    cpSync(join(ROOT, "ontology"), join(dir, "ontology"), { recursive: true });
    cpSync(join(ROOT, "tools"), join(dir, "tools"), { recursive: true });
    cpSync(join(ROOT, "db/migrations"), join(dir, "db/migrations"), { recursive: true });
    const p = join(dir, MIGRATION);
    writeFileSync(
      p,
      readFileSync(p, "utf8").replace(
        "grant select, insert, update on",
        "grant select, insert, update, delete on",
      ),
    );
    try {
      expect(migrationFailures(dir)).toContain("the API role may delete from the company layer");
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
