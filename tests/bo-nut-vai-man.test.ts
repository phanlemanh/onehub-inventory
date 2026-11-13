// Row 9e (bo-nut-theo-quyen), AC-9: the role × screen × button table is generated from the permission table
// (tools/coverage_matrix/buttons.py → design/vai-man-nut.md), and drift turns `make check` red.
//   bang-sinh-khop-quyen — every screen × role lists exactly the actions allowedScope gives, with their scope.
//   doi-o-doi-bang — on a copy of the table giving TeamLead listMembers, members × TeamLead changes.
//   tep-sinh-lech-do — a hand-edited generated file makes `--check` fail with «lệch bảng quyền: <màn>».
import { spawnSync } from "node:child_process";
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterAll, describe, expect, it } from "vitest";

import type { Role } from "../src/generated/ontology";
import { allowedScope, type ActionName } from "../src/modules/identity/permissions";

const ROOT = join(import.meta.dirname, "..");
const TOOL = join(ROOT, "tools/coverage_matrix/buttons.py");

interface Table {
  roles: Role[];
  screens: {
    id: string;
    actions: string[];
    cells: Record<Role, { action: string; scope: string }[]>;
  }[];
}

function run(root: string, ...args: string[]) {
  const r = spawnSync("python3", [TOOL, "--root", root, ...args], { encoding: "utf8" });
  return { status: r.status, out: `${r.stdout}${r.stderr}` };
}

const table = (root: string): Table => JSON.parse(run(root, "--json").out) as Table;

const copies: string[] = [];
afterAll(() => {
  for (const dir of copies) rmSync(dir, { recursive: true, force: true });
});

/** A copy of what the tool reads: the ontology, the screen register, the pages and the generated file. */
function copy(): string {
  const dir = mkdtempSync(join(tmpdir(), "vai-man-nut-"));
  copies.push(dir);
  for (const part of ["ontology", "design/screens.yaml", "design/vai-man-nut.md", "src/app"])
    cpSync(join(ROOT, part), join(dir, part), { recursive: true });
  return dir;
}

describe("bang-sinh-khop-quyen", () => {
  it("every screen × role lists the actions allowedScope gives, with their scope", () => {
    const t = table(ROOT);
    expect(t.screens.map((s) => s.id)).toContain("members");
    let cells = 0;
    for (const s of t.screens) {
      for (const role of t.roles) {
        const want = s.actions
          .map((a) => ({ action: a, scope: allowedScope([role], a as ActionName) }))
          .filter((c) => c.scope !== null);
        expect(s.cells[role], `${s.id} × ${role}`).toEqual(want);
        cells += 1;
      }
    }
    expect(cells).toBe(t.screens.length * 4);
  });

  it("the members screen: only the company admin, with invite and change roles", () => {
    const members = table(ROOT).screens.find((s) => s.id === "members")!;
    expect(members.cells.CompanyAdmin.map((c) => c.action).sort()).toEqual(
      ["changeMemberRoles", "inviteMember", "listMembers"].sort(),
    );
    for (const role of ["ListAgent", "BuyerAgent", "TeamLead"] as const)
      expect(members.cells[role], role).toEqual([]);
  });

  it("the generated file in the repository matches the table", () => {
    const r = run(ROOT, "--check");
    expect(r.out).toContain("khớp bảng quyền");
    expect(r.status).toBe(0);
  });
});

describe("doi-o-doi-bang", () => {
  it("a changed cell of the permission table changes the generated cell", () => {
    const dir = copy();
    const file = join(dir, "ontology/actions.yaml");
    const before = readFileSync(file, "utf8");
    const after = before.replace(
      /(- name: listMembers[\s\S]*?scope: \{ )CompanyAdmin: company \}/,
      "$1TeamLead: company, CompanyAdmin: company }",
    );
    expect(after, "bản phá không đổi được tệp").not.toBe(before);
    writeFileSync(file, after);
    const members = table(dir).screens.find((s) => s.id === "members")!;
    expect(members.cells.TeamLead).toEqual([{ action: "listMembers", scope: "company" }]);
    const r = run(dir, "--check");
    expect(r.status).not.toBe(0);
    expect(r.out).toContain("lệch bảng quyền: members");
  });
});

describe("tep-sinh-lech-do", () => {
  it("a hand-edited generated file fails the check, naming the screen", () => {
    const dir = copy();
    const file = join(dir, "design/vai-man-nut.md");
    const before = readFileSync(file, "utf8");
    const after = before.replace("`inviteMember` (toàn sàn), ", "");
    expect(after, "bản phá không đổi được tệp").not.toBe(before);
    writeFileSync(file, after);
    const r = run(dir, "--check");
    expect(r.status).not.toBe(0);
    expect(r.out).toContain("lệch bảng quyền: members");
  });
});
