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

/** The commit this branch grew from: merge-base with origin/main, else main. */
function base(): string {
  for (const ref of ["origin/main", "main"]) {
    try {
      return git(["merge-base", "HEAD", ref]).trim();
    } catch {
      /* next */
    }
  }
  throw new Error("no main branch to compare with");
}

/** Lines of a unified diff that change something beyond the row locator. */
export function beyondLocator(diff: string): string[] {
  const lines = diff.split("\n").filter((l) => /^[+-]/.test(l) && !/^(\+\+\+|---)/.test(l));
  const removed = lines.filter((l) => l.startsWith("-")).map((l) => l.slice(1));
  const added = lines.filter((l) => l.startsWith("+")).map((l) => l.slice(1));
  const bad: string[] = [];
  removed.forEach((r, i) => {
    const a = added[i];
    if (a === undefined || r.replaceAll("li[data-member", "[data-member") !== a) bad.push(r);
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

  it.each(LOCATOR_ONLY)("%s changes only the row locator", (file) => {
    expect(() => assertLocatorOnly(git(["diff", "-U0", from, "--", file]))).not.toThrow();
  });

  it.each(UNCHANGED)("%s is unchanged", (file) => {
    expect(git(["diff", from, "--", file])).toBe("");
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
});
