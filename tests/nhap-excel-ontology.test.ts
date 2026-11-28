// Row 11 (nhap-excel), eval E11 (AC-7): the data model says what the database holds. ImportRun's properties and the
// columns of import_runs (every migration that creates or alters the table) are the same set; the listing reaches a
// pending unit through ListingPendingUnit; the two actions the import opens are live; the module map declares what
// imports owns and needs; the generated types are the ones the ontology gives today.
// The migration text is read here, with no database; the same set read from the table Postgres really has is
// tests/db/nhap-excel.db.test.ts «mo hinh khop bang that (VP11 r1)».
import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const ROOT = join(__dirname, "..");
const read = (p: string) => readFileSync(join(ROOT, p), "utf8");
/** A YAML file of the repository as data, read by the same Python YAML the repository's tools use. */
const yamlOf = (p: string): unknown =>
  JSON.parse(
    execFileSync(
      "python3",
      [
        "-c",
        "import json,sys,yaml; print(json.dumps(yaml.safe_load(open(sys.argv[1]))))",
        join(ROOT, p),
      ],
      { encoding: "utf8" },
    ),
  );
const snake = (camel: string) => camel.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);

/** The columns of a table across the migrations: its create statement, then every `add column`. */
export function columnsOf(table: string, migrations: readonly string[]): Set<string> {
  const out = new Set<string>();
  for (const sql of migrations) {
    const create = new RegExp(`create table ${table} \\(([\\s\\S]*?)\\n\\);`).exec(sql);
    if (create)
      for (const line of create[1]!.split("\n")) {
        const m = /^\s{2}([a-z_]+)\s/.exec(line);
        if (m && m[1] !== "constraint") out.add(m[1]!);
      }
    for (const m of sql.matchAll(
      new RegExp(`alter table ${table} add column (?:if not exists )?([a-z_]+)`, "g"),
    ))
      out.add(m[1]!);
  }
  return out;
}

/** Each property without its column and each column without its property, named; empty when the two agree. */
export function modelFaults(properties: readonly string[], columns: ReadonlySet<string>): string[] {
  const wanted = new Set(properties.map(snake));
  return [
    ...properties
      .filter((p) => !columns.has(snake(p)))
      .map((p) => `ontology property without column: ImportRun.${p}`),
    ...[...columns]
      .filter((c) => !wanted.has(c))
      .map((c) => `column without ontology property: ${c}`),
  ];
}

const MIGRATIONS = readdirSync(join(ROOT, "db/migrations"))
  .filter((f) => f.endsWith(".sql"))
  .sort()
  .map((f) => read(`db/migrations/${f}`));
const ENTITY = yamlOf("ontology/entities/ImportRun.yaml") as {
  properties: Record<string, unknown>;
};
const PROPERTIES = Object.keys(ENTITY.properties);

describe("nhap-excel-ontology (E11)", () => {
  it("ImportRun's properties and the columns of import_runs are the same set", () => {
    const columns = columnsOf("import_runs", MIGRATIONS);
    expect(columns.size).toBe(18);
    expect(modelFaults(PROPERTIES, columns)).toEqual([]);
  });

  it("break: a column left out of the compared set is named", () => {
    const columns = columnsOf("import_runs", MIGRATIONS);
    columns.delete("file_name");
    expect(modelFaults(PROPERTIES, columns)).toEqual([
      "ontology property without column: ImportRun.fileName",
    ]);
    columns.add("file_name");
    columns.add("secret_notes");
    expect(modelFaults(PROPERTIES, columns)).toEqual([
      "column without ontology property: secret_notes",
    ]);
  });

  it("a listing reaches a pending unit through ListingPendingUnit, and an import names the listings it created", () => {
    const relations = (
      yamlOf("ontology/relations.yaml") as {
        relations: { from: string; name: string; to: string }[];
      }
    ).relations.map((r) => `${r.from} ${r.name} ${r.to}`);
    expect(relations).toEqual(
      expect.arrayContaining([
        "Listing placed_on_pending ListingPendingUnit",
        "PendingUnit offered_through ListingPendingUnit",
        "ImportRun created Listing",
        "Company holds_imports ImportRun",
      ]),
    );
  });

  it("importListings and createListing are live actions", () => {
    const actions = (
      yamlOf("ontology/actions.yaml") as { actions: { name: string; status: string }[] }
    ).actions;
    const status = (n: string) => actions.find((a) => a.name === n)?.status;
    expect([status("importListings"), status("createListing")]).toEqual(["live", "live"]);
  });

  it("the module map: imports owns ImportRun and depends on identity, catalog, company-config and listings", () => {
    const modules = (
      yamlOf("architecture/modules.yaml") as {
        modules: { name: string; owns: string[]; depends_on: string[] }[];
      }
    ).modules;
    const imports = modules.find((m) => m.name === "imports")!;
    expect(imports.owns).toEqual(["ImportRun"]);
    expect([...imports.depends_on].sort()).toEqual(
      ["catalog", "company-config", "identity", "listings"].sort(),
    );
  });

  it("the generated types are the ones the ontology gives today", () => {
    // The same check `make ontology` runs: exit 0 only when src/generated/ontology.ts is what the generator writes.
    expect(() =>
      execFileSync(
        "python3",
        [
          "tools/ontology_codegen.py",
          "--lang",
          "ts",
          "--out",
          "src/generated/ontology.ts",
          "--check",
        ],
        { cwd: ROOT, stdio: "pipe" },
      ),
    ).not.toThrow();
  });
});
