// The permission table of ontology/actions.yaml reaches the generated code whole, and the generator refuses a broken
// row (row 9a, AC-1). The YAML is read back with the repo's own reader (tools/repo_ontology.py), and the shape check
// is the one `make ontology` runs (tools/ontology_actions.py), run on a copy of ontology/ for each break.
import { spawnSync } from "node:child_process";
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { afterAll, describe, expect, it } from "vitest";

import { ACTIONS, PERMISSION_EXEMPT, type ActionSpec } from "../../generated/ontology";

const ROOT = fileURLToPath(new URL("../../..", import.meta.url));
const TOOLS = join(ROOT, "tools");

function python(code: string, root: string): { status: number; out: string } {
  const r = spawnSync("python3", ["-c", code, root], {
    cwd: ROOT,
    encoding: "utf8",
    env: { ...process.env, PYTHONPATH: TOOLS },
  });
  return { status: r.status ?? -1, out: `${r.stdout}${r.stderr}` };
}

/** ontology/actions.yaml of `root`, read by the repo's YAML reader. */
function readYaml(root: string): {
  actions: Record<string, unknown>[];
  exempt: Record<string, unknown>[];
} {
  const r = python(
    "import json,sys\nfrom pathlib import Path\nfrom repo_ontology import load_yaml_file\n" +
      "print(json.dumps(load_yaml_file(Path(sys.argv[1]) / 'ontology' / 'actions.yaml')))",
    root,
  );
  expect(r.status, r.out).toBe(0);
  return JSON.parse(r.out) as {
    actions: Record<string, unknown>[];
    exempt: Record<string, unknown>[];
  };
}

/** The shape check of `make ontology` on `root`: exit code and every error line. */
function lint(root: string): { status: number; out: string } {
  return python(
    "import sys\nfrom pathlib import Path\nimport ontology_actions\nfrom repo_ontology import load_entities\n" +
      "root = Path(sys.argv[1]); errs = []\n" +
      "ontology_actions.lint(root, load_entities(root), lambda p, m: errs.append(f'ERROR {p}: {m}'), lambda p, m: None)\n" +
      "print('\\n'.join(errs)); sys.exit(1 if errs else 0)",
    root,
  );
}

const list = (v: unknown): string[] => (Array.isArray(v) ? v.map(String) : []);

/** Every difference between the YAML rows and the generated table, one line each; empty when they agree. */
function compareTable(yaml: Record<string, unknown>[], generated: readonly ActionSpec[]): string[] {
  const out: string[] = [];
  const byName = new Map(generated.map((a) => [a.name as string, a]));
  for (const row of yaml) {
    const name = String(row["name"]);
    const gen = byName.get(name);
    if (!gen) {
      out.push(`bang-sinh-du-dong: thiếu ${name}`);
      continue;
    }
    byName.delete(name);
    const doors = (row["doors"] ?? {}) as Record<string, unknown>;
    const want = {
      kind: row["kind"],
      status: row["status"],
      scope: row["scope"],
      states: list(row["states"]),
      api: list(doors["api"]),
      db: list(doors["db"]),
    };
    const got = {
      kind: gen.kind,
      status: gen.status,
      scope: gen.scope,
      states: [...gen.states],
      api: [...gen.doors.api],
      db: [...gen.doors.db],
    };
    for (const key of Object.keys(want) as (keyof typeof want)[]) {
      if (JSON.stringify(want[key]) !== JSON.stringify(got[key]))
        out.push(`bang-sinh-du-dong: ${name} lệch ${key}`);
    }
  }
  for (const name of byName.keys()) out.push(`bang-sinh-du-dong: thừa ${name}`);
  return out;
}

const copies: string[] = [];
afterAll(() => {
  for (const dir of copies) rmSync(dir, { recursive: true, force: true });
});

/** A copy of ontology/ whose actions.yaml is `edit` of the real one. */
function brokenCopy(edit: (text: string) => string): string {
  const dir = mkdtempSync(join(tmpdir(), "bang-quyen-"));
  copies.push(dir);
  cpSync(join(ROOT, "ontology"), join(dir, "ontology"), { recursive: true });
  const file = join(dir, "ontology", "actions.yaml");
  const before = readFileSync(file, "utf8");
  const after = edit(before);
  expect(after, "bản phá không đổi được tệp").not.toBe(before);
  writeFileSync(file, after);
  return dir;
}

describe("bang-sinh-du-dong", () => {
  const yaml = readYaml(ROOT);

  it("the generated table carries every row and field of ontology/actions.yaml", () => {
    expect(compareTable(yaml.actions, ACTIONS)).toEqual([]);
    expect(ACTIONS.filter((a) => a.status === "live")).toHaveLength(21); // row 2c adds four saved-view rows, row 7e five company-layer rows, row 19 two fee rows
    expect(ACTIONS.filter((a) => a.status === "planned")).toHaveLength(12);
    expect(PERMISSION_EXEMPT.map((e) => [e.door, e.reason, [...e.reads]])).toEqual(
      yaml.exempt.map((e) => [String(e["door"]), String(e["reason"]), list(e["reads"])]),
    );
  });

  it("break: a generated table missing a row names it", () => {
    const short = ACTIONS.filter((a) => a.name !== "readCompany");
    expect(compareTable(yaml.actions, short)).toContain("bang-sinh-du-dong: thiếu readCompany");
  });

  it("break: a generated cell that differs names the action and the field", () => {
    const changed = ACTIONS.map((a) =>
      a.name === "inviteMember" ? { ...a, scope: { ...a.scope, TeamLead: "company" as const } } : a,
    );
    expect(compareTable(yaml.actions, changed)).toEqual([
      "bang-sinh-du-dong: inviteMember lệch scope",
    ]);
  });
});

describe("kiem-khuon-bang", () => {
  it("control: the real table passes the shape check", () => {
    const r = lint(ROOT);
    expect(r.status, r.out).toBe(0);
  });

  const breaks: [string, (t: string) => string, string][] = [
    ["vai lạ", (t) => t.replace("ListAgent: own,", "Telesales: own,"), "unknown role Telesales"],
    [
      "phạm vi lạ",
      (t) => t.replace("ListAgent: company,", "ListAgent: team,"),
      "unknown scope team",
    ],
    [
      "dòng sống không cửa",
      (t) => t.replace('    doors:\n      db: ["table companies select"]\n', ""),
      "live action readCompany has no door",
    ],
    [
      "dòng nháp có cửa",
      (t) =>
        t.replace(
          "  - name: viewListings\n",
          '  - name: viewListings\n    doors:\n      api: ["GET /api/v1/listings"]\n',
        ),
      "planned action viewListings has a door",
    ],
    [
      "dòng sống khai trạng thái",
      (t) =>
        t.replace("  - name: readOwnRoles\n", "  - name: readOwnRoles\n    states: [Active]\n"),
      "live action readOwnRoles declares states",
    ],
  ];

  for (const [label, edit, message] of breaks) {
    it(`break: ${label} → «${message}»`, () => {
      const r = lint(brokenCopy(edit));
      expect(r.status).toBe(1);
      expect(r.out).toContain(message);
    });
  }
});
