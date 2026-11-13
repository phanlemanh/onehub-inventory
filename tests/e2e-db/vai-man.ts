// The role × screen pairs of the browser suite (roadmap row 9b, AC-2, AC-4, AC-5, AC-11): built from the screen register
// (design/screens.yaml: who may open each screen, `vao`, and its buttons, `nut`), the permission table and the generated
// role × screen × button table. One reader for the browser suite and for `make check` (tests/vai-man-so-man.test.ts):
// the browser suite registers its tests by looping over `pairs()`, never over a hand-written list.
import { execFileSync } from "node:child_process";
import { join } from "node:path";

import type { Role } from "../../src/generated/ontology";
import { allowedScope, type ActionName } from "../../src/modules/identity/permissions";
import { loadRegister, REPO_ROOT, SIGNED_OUT_SCREENS } from "../../tools/e2e_templates/register";

/** The four widths of the repository's browser tests. */
export const SIZES = ["360", "414", "1024", "1440"] as const;
export type Size = (typeof SIZES)[number];

/**
 * The width where every pair is walked (scope gate, Hỏi-1, option B, Manh Phan 2026-11-13). At the three smaller widths
 * only the blocked pairs are walked: the allowed pairs at four widths are the register-driven suite's (row 1r).
 */
export const FULL_SIZE: Size = "1440";

/** What a role meets on a screen. */
export type Expect = "duoc-vao" | "chan" | "day-ve-hom-nay";

export interface ButtonCell {
  action: string;
  scope: string;
}

/** One section of the role × screen × button table (tools/coverage_matrix/buttons.py --json). */
export interface ButtonSection {
  id: string;
  route: string;
  audience: string;
  status: string;
  vao: string | null;
  actions: string[];
  planned: string[];
  mo_san: string[];
  common: string[];
  cells: Record<Role, ButtonCell[]>;
}

export interface ButtonTable {
  roles: Role[];
  labels: Record<string, string>;
  screens: ButtonSection[];
  errors: string[];
}

export interface Pair {
  screen: string;
  route: string;
  /** The screen's heading as people read it (from the label table), or null for the sign-in page. */
  title: string | null;
  role: Role;
  expect: Expect;
  /** The actions the role's buttons may show on this screen (its cell of the button table). */
  allowed: string[];
  /** The buttons that must show as soon as the screen opens, for this role. */
  shownAtOpen: string[];
}

export const FRAME_SECTION = "khung";

/** The role × screen × button table, read by the one tool that writes design/vai-man-nut.md. */
export function buttonTable(root: string = REPO_ROOT): ButtonTable {
  const out = execFileSync(
    "python3",
    [join(root, "tools/coverage_matrix/buttons.py"), "--root", root, "--json"],
    {
      encoding: "utf8",
      timeout: 30_000,
    },
  );
  return JSON.parse(out) as ButtonTable;
}

/** Why a screen of the register is not in the matrix, or null when it is. */
export function outsideReason(section: Pick<ButtonSection, "status" | "audience">): string | null {
  if (section.audience === "dev") return "dev";
  if (section.status === "planned") return "planned";
  return null;
}

/** Every pair the suite walks, and every screen of the register left out with its reason. */
export function pairs(root: string = REPO_ROOT): {
  pairs: Pair[];
  outside: Record<string, string>;
} {
  const register = loadRegister(root);
  const table = buttonTable(root);
  const titles = new Map(register.screens.map((s) => [s.id, s.title_text]));
  const roles = register.roles.map((r) => r.name as Role);
  const out: Pair[] = [];
  const outside: Record<string, string> = {};
  for (const section of table.screens) {
    if (section.id === FRAME_SECTION) continue;
    const reason = outsideReason(section);
    if (reason) {
      outside[section.id] = reason;
      continue;
    }
    for (const role of roles) {
      const may = section.vao === null || allowedScope([role], section.vao as ActionName) !== null;
      const expect: Expect = SIGNED_OUT_SCREENS[section.id]
        ? "day-ve-hom-nay"
        : may
          ? "duoc-vao"
          : "chan";
      const allowed = (section.cells[role] ?? []).map((c) => c.action);
      out.push({
        screen: section.id,
        route: section.route,
        title: SIGNED_OUT_SCREENS[section.id] ? null : (titles.get(section.id) ?? null),
        role,
        expect,
        allowed,
        shownAtOpen: section.mo_san.filter((a) => allowed.includes(a)),
      });
    }
  }
  return { pairs: out, outside };
}

/** The pairs walked at one width: all of them at the full width, the blocked ones elsewhere. */
export function pairsAt(all: readonly Pair[], size: Size): Pair[] {
  return size === FULL_SIZE ? [...all] : all.filter((p) => p.expect === "chan");
}

/** The name of one step of the suite; the reconciliation (vai-man-doi-chieu.mjs) reads names back in this shape. */
export function stepName(p: Pick<Pair, "screen" | "role">, size: Size, what: string): string {
  return `${p.screen} × ${p.role} @${size}: ${what}`;
}
