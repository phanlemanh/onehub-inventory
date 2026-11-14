// Row 9b (kiem-vai-theo-man), AC-9 and AC-10 (E12, E13): the role × screen × button table covers every screen of the
// register and the App Shell frame, reads the module UI files a screen really imports, marks declared buttons the code
// does not have yet as «dự kiến», and `--check` turns red when the code has a button the register does not declare.
//   doc-giao-dien-mo-dun   — inventory's saved-view buttons come from src/modules/listings/ui; the rest are «dự kiến».
//   khong-gan-ca-mo-dun    — today names no listing action; an action in a listings UI file no screen imports counts
//                            for no screen; the same action reached three ways is caught for inventory.
//   giu-moi-man            — every screen of the register has a section, plus the frame.
//   bang-du-muc            — the generated file has 10 sections of 3 columns and 4 role rows.
//   nut-khong-co-trong-bang — a declared button outside the permission table is red.
import { spawnSync } from "node:child_process";
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterAll, describe, expect, it } from "vitest";

const ROOT = join(import.meta.dirname, "..");
const TOOL = join(ROOT, "tools/coverage_matrix/buttons.py");

interface Section {
  id: string;
  actions: string[];
  planned: string[];
  common: string[];
}

function run(root: string, ...args: string[]) {
  const r = spawnSync("python3", [TOOL, "--root", root, ...args], { encoding: "utf8" });
  return { status: r.status, out: `${r.stdout}${r.stderr}` };
}

const sections = (root: string): Section[] =>
  (JSON.parse(run(root, "--json").out) as { screens: Section[] }).screens;
const section = (root: string, id: string): Section => sections(root).find((s) => s.id === id)!;

const copies: string[] = [];
afterAll(() => {
  for (const dir of copies) rmSync(dir, { recursive: true, force: true });
});

/** A copy of everything the tool reads: the ontology, the register, the generated file and the sources. */
function copy(): string {
  const dir = mkdtempSync(join(tmpdir(), "vai-man-nut-sinh-"));
  copies.push(dir);
  for (const part of ["ontology", "design/screens.yaml", "design/vai-man-nut.md", "src"])
    cpSync(join(ROOT, part), join(dir, part), { recursive: true });
  return dir;
}

function edit(dir: string, rel: string, change: (text: string) => string): void {
  const file = join(dir, rel);
  const before = readFileSync(file, "utf8");
  const after = change(before);
  expect(after, `bản phá không đổi được ${rel}`).not.toBe(before);
  writeFileSync(file, after);
}

const STRAY = '\nexport const strayButton = { action: "manageCompanyCodes" };\n';

describe("doc-giao-dien-mo-dun", () => {
  it("inventory: saved-view buttons and the cell edit (row 4) found in the listings UI, other listing buttons declared ahead", () => {
    const inv = section(ROOT, "inventory");
    expect(inv.actions.slice(0, 3).sort()).toEqual(["editView", "saveView", "updateListing"]);
    expect(inv.planned).toEqual([
      "createListing",
      "activateListing",
      "removeListing",
      "viewOwnerPhone",
    ]);
  });
});

describe("khong-gan-ca-mo-dun", () => {
  it("today names no listing action; the frame has the saved-view menu", () => {
    expect(section(ROOT, "today").actions).toEqual([]);
    expect(section(ROOT, "khung").actions.sort()).toEqual(["editView", "removeView"]);
  });

  it("the real tree passes --check", () => {
    const r = run(ROOT, "--check");
    expect(r.out).toContain("khớp bảng quyền");
    expect(r.status).toBe(0);
  });

  it("pha a: an undeclared action in the inventory page is red", () => {
    const dir = copy();
    edit(dir, "src/app/(app)/inventory/page.tsx", (t) => t + STRAY);
    const r = run(dir, "--check");
    expect(r.status).not.toBe(0);
    expect(r.out).toContain("inventory: ma co manageCompanyCodes chua khai");
  });

  it("pha b: an undeclared action in a listings UI file the page imports is red", () => {
    const dir = copy();
    edit(dir, "src/modules/listings/ui/inventory-grid.tsx", (t) => t + STRAY);
    const r = run(dir, "--check");
    expect(r.status).not.toBe(0);
    expect(r.out).toContain("inventory: ma co manageCompanyCodes chua khai");
  });

  it("pha c: the same action through an intermediate component is red", () => {
    const dir = copy();
    writeFileSync(
      join(dir, "src/components/candidate/stray-button.tsx"),
      'export function StrayButton() {\n  return { action: "manageCompanyCodes" };\n}\n',
    );
    edit(
      dir,
      "src/app/(app)/inventory/page.tsx",
      (t) =>
        `import { StrayButton } from "@/components/candidate/stray-button";\n${t}\nvoid StrayButton;\n`,
    );
    const r = run(dir, "--check");
    expect(r.status).not.toBe(0);
    expect(r.out).toContain("inventory: ma co manageCompanyCodes chua khai");
  });

  it("đối chứng: a listings UI file no screen imports counts for no screen", () => {
    const dir = copy();
    writeFileSync(join(dir, "src/modules/listings/ui/nobody-imports.tsx"), STRAY);
    const r = run(dir, "--check");
    expect(r.out).not.toContain("manageCompanyCodes");
    expect(r.status).toBe(0);
  });
});

describe("giu-moi-man", () => {
  it("every screen of the register has a section, plus the frame", () => {
    expect(sections(ROOT).map((s) => s.id)).toEqual([
      "khung",
      "today",
      "inventory",
      "sent",
      "contacts",
      "tuy-chinh-san",
      "proto",
      "proto-bo-nut",
      "sign-in",
      "members",
    ]);
  });
});

describe("bang-du-muc", () => {
  it("the generated file: 10 sections, 3 columns, 4 role rows each", () => {
    const text = readFileSync(join(ROOT, "design/vai-man-nut.md"), "utf8");
    const heads = text.split("\n").filter((l) => l.startsWith("## "));
    expect(heads).toHaveLength(10);
    for (const block of text.split("\n## ").slice(1)) {
      const rows = block.split("\n").filter((l) => l.startsWith("| "));
      expect(rows[0], block.split("\n")[0]).toMatch(
        /^\| Vai +\| Nút theo quyền +\| Nút không theo quyền +\|$/,
      );
      expect(rows.length - 2, block.split("\n")[0]).toBe(4);
    }
    expect(text).toContain("`createListing` (toàn sàn, dự kiến)");
    expect(text).toMatch(/\| Quản trị sàn \| chặn +\| Tìm \(⌘K\), Đổi sàn, Đăng xuất \|/);
  });

  it("pha: a hand-edited cell fails --check naming the screen", () => {
    const dir = copy();
    edit(dir, "design/vai-man-nut.md", (t) => t.replace("(toàn sàn, dự kiến)", "(toàn sàn)"));
    const r = run(dir, "--check");
    expect(r.status).not.toBe(0);
    expect(r.out).toContain("lệch bảng quyền: inventory");
  });
});

describe("nut-khong-co-trong-bang", () => {
  it("pha: a declared button outside the permission table is red", () => {
    const dir = copy();
    edit(dir, "design/screens.yaml", (t) =>
      t.replace(/(- id: today[\s\S]*?nut: )\[\]/, "$1[khongCo]"),
    );
    const r = run(dir, "--check");
    expect(r.status).not.toBe(0);
    expect(r.out).toContain("today: nut khongCo khong co trong bang quyen");
  });
});
