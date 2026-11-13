// Row 9b (kiem-vai-theo-man), checks that need no browser (E1, E2, E3, E9):
//   so-man-du-cua-vao     — every staff or public screen declares who may open it (`vao`) and its buttons (AC-1).
//   tap-cap-bang-tich     — the suite's pairs are exactly the built staff screens × the four roles (AC-2).
//   cua-dang-nhap-chung   — the role × screen suite never signs in by itself and never names a screen by hand (AC-3).
//   thanh-ben-khop-so-man — the sidebar gates each screen with the same action as the register (AC-7).
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterAll, describe, expect, it } from "vitest";

import { NAV } from "../src/app/(app)/nav";
import { buttonTable, pairs } from "./e2e-db/vai-man";

const ROOT = join(import.meta.dirname, "..");
const SPEC = "tests/e2e-db/vai-man.spec.ts";

const copies: string[] = [];
afterAll(() => {
  for (const dir of copies) rmSync(dir, { recursive: true, force: true });
});

/** A copy of what the register readers read, with design/screens.yaml changed by `change`. */
function registerCopy(change: (text: string) => string): string {
  const dir = mkdtempSync(join(tmpdir(), "vai-man-so-man-"));
  copies.push(dir);
  for (const part of ["ontology", "design", "src", "tools"])
    cpSync(join(ROOT, part), join(dir, part), { recursive: true });
  const file = join(dir, "design/screens.yaml");
  const before = readFileSync(file, "utf8");
  const after = change(before);
  expect(after, "bản phá không đổi được sổ màn").not.toBe(before);
  writeFileSync(file, after);
  return dir;
}

/** Replace the line `key: …` of one screen's entry. */
const inScreen = (id: string, key: string, value: string) => (text: string) =>
  text.replace(new RegExp(`(- id: ${id}\\n(?:    .*\\n)*?    ${key}:).*`), `$1 ${value}`);

describe("so-man-du-cua-vao", () => {
  it("the real register: entry rules and buttons as declared", () => {
    const t = buttonTable(ROOT);
    expect(t.errors).toEqual([]);
    const vao = Object.fromEntries(t.screens.map((s) => [s.id, s.vao]));
    expect(vao).toMatchObject({
      today: null,
      inventory: null,
      sent: null,
      "sign-in": null,
      contacts: "viewContacts",
      members: "listMembers",
    });
    const members = t.screens.find((s) => s.id === "members")!;
    expect(members.mo_san).toEqual(["inviteMember", "changeMemberRoles"]);
    expect(t.screens.find((s) => s.id === "sent")!.actions).toEqual([]);
  });

  it("pha: a missing entry rule, an unknown action, a built screen gated by a planned action", () => {
    const missing = registerCopy((t) =>
      t.replace(/(- id: members\n(?: {4}.*\n)*?) {4}vao: listMembers\n/, "$1"),
    );
    expect(buttonTable(missing).errors).toContain("members: thieu khoa vao");
    const unknown = registerCopy(inScreen("members", "vao", "khongCo"));
    expect(buttonTable(unknown).errors).toContain("members: vao khongCo khong co trong bang quyen");
    const planned = registerCopy(inScreen("today", "vao", "viewListings"));
    expect(buttonTable(planned).errors).toContain(
      "today: man built tro thao tac planned viewListings",
    );
    const noButtons = registerCopy((t) =>
      t.replace(/(- id: inventory\n(?: {4}.*\n)*?) {4}nut:\n(?: {6}- .*\n)+/, "$1"),
    );
    expect(buttonTable(noButtons).errors).toContain("inventory: thieu khoa nut");
  });
});

describe("tap-cap-bang-tich", () => {
  // Written before the code: the built staff screens and the four roles.
  const SCREENS = ["today", "inventory", "sent", "sign-in", "members"];
  const ROLES = ["ListAgent", "BuyerAgent", "TeamLead", "CompanyAdmin"];

  it("20 pairs, and every other screen of the register with its reason", () => {
    const { pairs: all, outside } = pairs(ROOT);
    const got = all.map((p) => `${p.screen}×${p.role}`).sort();
    const want = SCREENS.flatMap((s) => ROLES.map((r) => `${s}×${r}`)).sort();
    expect(got).toEqual(want);
    expect(outside).toEqual({ contacts: "planned", proto: "dev", "proto-bo-nut": "dev" });
    const blocked = all.filter((p) => p.expect === "chan").map((p) => `${p.screen}×${p.role}`);
    expect(blocked.sort()).toEqual(["members×BuyerAgent", "members×ListAgent", "members×TeamLead"]);
    expect(all.filter((p) => p.expect === "day-ve-hom-nay").map((p) => p.screen)).toEqual(
      Array(4).fill("sign-in"),
    );
  });

  it("pha: a new built staff screen brings its four pairs without touching the suite", () => {
    const dir = registerCopy((t) =>
      t.replace(
        "  - id: members\n",
        "  - id: thu-them\n    route: /thu-them\n    title: Today\n    family: null\n    audience: staff\n    status: built\n    vao: null\n    nut: []\n    nut_chung: []\n  - id: members\n",
      ),
    );
    mkdirSync(join(dir, "src/app/(app)/thu-them"), { recursive: true });
    writeFileSync(
      join(dir, "src/app/(app)/thu-them/page.tsx"),
      "export default function Page() {\n  return null;\n}\n",
    );
    const { pairs: all } = pairs(dir);
    expect(all).toHaveLength(24);
    expect(all.filter((p) => p.screen === "thu-them").map((p) => p.role)).toEqual(ROLES);
    // Đối chứng: the same reader on the real register gives 20.
    expect(pairs(ROOT).pairs).toHaveLength(20);
  });
});

/** Why a role × screen spec breaks the shared sign-in door, or null. */
export function doorProblem(
  name: string,
  source: string,
  screenIds: readonly string[],
): string | null {
  if (/getByLabel\(["'](Email|Mã đăng nhập)["']\)|LOGIN_CODE_OUTBOX|OUTBOX/.test(source))
    return `${name}: tu dang nhap, dung cua chung`;
  if (!/\bpairs\(/.test(source)) return `${name}: khong lap ham sinh cap`;
  for (const id of screenIds)
    if (new RegExp(`["'\`]${id}["'\`]`).test(source)) return `${name}: id man viet tay ${id}`;
  return null;
}

describe("cua-dang-nhap-chung", () => {
  const ids = ["today", "inventory", "sent", "sign-in", "members"];

  it("the role × screen spec signs in only through the shared door and loops over the pair function", () => {
    expect(doorProblem("vai-man.spec.ts", readFileSync(join(ROOT, SPEC), "utf8"), ids)).toBeNull();
  });

  it("pha: signing in by hand, or a screen named by hand, is caught with the pinned message", () => {
    const real = readFileSync(join(ROOT, SPEC), "utf8");
    expect(doorProblem("vai-man.spec.ts", `${real}\npage.getByLabel("Mã đăng nhập");\n`, ids)).toBe(
      "vai-man.spec.ts: tu dang nhap, dung cua chung",
    );
    expect(doorProblem("vai-man.spec.ts", `${real}\nconst x = "members";\n`, ids)).toBe(
      "vai-man.spec.ts: id man viet tay members",
    );
  });
});

/** Where the sidebar and the register disagree on the action that opens a screen. */
export function navProblems(
  nav: readonly { href: string; action?: string }[],
  screens: readonly { id: string; route: string; vao: string | null }[],
): string[] {
  const out: string[] = [];
  for (const item of nav) {
    const screen = screens.find((s) => s.route === item.href);
    if (!screen) continue;
    const a = item.action ?? null;
    if (a !== screen.vao) out.push(`${screen.id}: thanh ben khai ${a}, so man khai ${screen.vao}`);
  }
  return out;
}

describe("thanh-ben-khop-so-man", () => {
  it("every sidebar entry gates its screen with the register's action", () => {
    const t = buttonTable(ROOT);
    const linked = NAV.filter((i) => t.screens.some((s) => s.route === i.href)).map((i) => i.href);
    expect(linked.sort()).toEqual(["/", "/inventory", "/members", "/sent"]);
    expect(navProblems(NAV, t.screens)).toEqual([]);
  });

  it("pha: the register gating members with another action is red", () => {
    const dir = registerCopy(inScreen("members", "vao", "inviteMember"));
    expect(navProblems(NAV, buttonTable(dir).screens)).toEqual([
      "members: thanh ben khai listMembers, so man khai inviteMember",
    ]);
  });
});
