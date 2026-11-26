// Row 9's tests keep their words (row 9c, AC-3): against the main branch, the browser tests that find a member row
// may only change the row locator (li[data-member=…] → [data-member=…]), and the database tests do not change.
import { execFileSync } from "node:child_process";

import { describe, expect, it } from "vitest";

const LOCATOR_ONLY = [
  "tests/e2e-db/members.spec.ts",
  "tests/e2e-db/bo-nut-members.spec.ts",
  "tests/e2e-db/app-shell-doi-san.spec.ts",
];
const UNCHANGED = ["tests/db/moi-nguoi.db.test.ts"];

function git(args: string[]): string {
  return execFileSync("git", args, { encoding: "utf8" });
}

/**
 * The commit this branch grew from: merge-base with origin/main, else main. Null in a checkout without the main
 * branch's history (CI checks out the pull request alone, one commit deep): the comparison is then skipped there and
 * runs where history exists — locally and in the grading round — as tests/danh-muc-chuyen-mau.test.ts does.
 */
function base(): string | null {
  for (const ref of ["origin/main", "main"]) {
    try {
      return execFileSync("git", ["merge-base", "HEAD", ref], {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      }).trim();
    } catch {
      /* next */
    }
  }
  return null;
}

/**
 * The one other change allowed, word for word (app-shell-khuon-dau-trang, owner 2026-11-17, supervisor ruling
 * R-1711-5): the account menu moved to the foot of the App Shell's rail, which on a phone rides in the closed sheet, so
 * the wait for the signed-in shell goes through the shared door — this line for that line, plus its one import.
 */
const SHELL_WAIT_OLD = `  await expect(page.locator('[data-slot="account-menu"][data-ready]')).toBeVisible();`;
const SHELL_WAIT_NEW = "  await shellReady(page);";
const SHELL_WAIT_IMPORT = 'import { shellReady } from "./dang-nhap-vai";';

/** Lines of a unified diff that change something beyond the row locator. */
export function beyondLocator(diff: string): string[] {
  const lines = diff.split("\n").filter((l) => /^[+-]/.test(l) && !/^(\+\+\+|---)/.test(l));
  const removed = lines.filter((l) => l.startsWith("-")).map((l) => l.slice(1));
  const added = lines.filter((l) => l.startsWith("+")).map((l) => l.slice(1));
  // The shared door's import is allowed once, and only alongside the one line it serves.
  const importAt = added.indexOf(SHELL_WAIT_IMPORT);
  if (importAt >= 0 && removed.includes(SHELL_WAIT_OLD)) added.splice(importAt, 1);
  const bad: string[] = [];
  removed.forEach((r, i) => {
    const a = added[i];
    const allowed =
      a !== undefined &&
      (r.replaceAll("li[data-member", "[data-member") === a ||
        (r === SHELL_WAIT_OLD && a === SHELL_WAIT_NEW));
    if (!allowed) bad.push(r);
  });
  added.slice(removed.length).forEach((a) => bad.push(a));
  return bad;
}

function assertLocatorOnly(diff: string): void {
  const bad = beyondLocator(diff);
  if (bad.length) throw new Error(`row 9 test changed beyond the row locator: ${bad[0]!.trim()}`);
}

describe("row 9 tests keep their words (row 9c)", () => {
  const from = base();

  it.skipIf(from === null).each(LOCATOR_ONLY)("%s changes only the row locator", (file) => {
    expect(() => assertLocatorOnly(git(["diff", "-U0", from!, "--", file]))).not.toThrow();
  });

  it.skipIf(from === null).each(UNCHANGED)("%s is unchanged", (file) => {
    expect(git(["diff", from!, "--", file])).toBe("");
  });

  it("pha thu: a diff that also changes an expected sentence is caught", () => {
    const diff = [
      "--- a/x",
      "+++ b/x",
      '-  return page.locator(`li[data-member="${email}"]`);',
      '+  return page.locator(`[data-member="${email}"]`);',
      '-  await expect(page.getByText("Đã mời")).toBeVisible();',
      '+  await expect(page.getByText("Đã thêm")).toBeVisible();',
    ].join("\n");
    expect(() => assertLocatorOnly(diff)).toThrow("row 9 test changed beyond the row locator");
  });

  const shellWait = [
    "--- a/x",
    "+++ b/x",
    `+${SHELL_WAIT_IMPORT}`,
    `-${SHELL_WAIT_OLD}`,
    `+${SHELL_WAIT_NEW}`,
  ];

  it("the shell wait through the shared door, with its one import, is the one other change allowed", () => {
    expect(() => assertLocatorOnly(shellWait.join("\n"))).not.toThrow();
  });

  it("pha thu: the shell wait swapped for another call is caught", () => {
    const diff = [...shellWait.slice(0, 4), "+  await page.waitForTimeout(1000);"].join("\n");
    expect(() => assertLocatorOnly(diff)).toThrow("row 9 test changed beyond the row locator");
  });

  it("pha thu: the shell wait plus a changed expected sentence is caught", () => {
    const diff = [
      ...shellWait,
      '-  await expect(page.getByText("Đã mời")).toBeVisible();',
      '+  await expect(page.getByText("Đã thêm")).toBeVisible();',
    ].join("\n");
    expect(() => assertLocatorOnly(diff)).toThrow("row 9 test changed beyond the row locator");
  });

  it("pha thu: the import alone, without the line it serves, is caught", () => {
    const diff = ["--- a/x", "+++ b/x", `+${SHELL_WAIT_IMPORT}`].join("\n");
    expect(() => assertLocatorOnly(diff)).toThrow("row 9 test changed beyond the row locator");
  });
});
