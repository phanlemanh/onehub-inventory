// The dev server of the signed-in run connects as the app's login role, measured on the database itself (row 1s,
// _acceptance/ci-co-postgres AC-2): open a screen that reads the database with the test session, then read
// pg_stat_activity of this run's scratch database as the owner. Every connection that did something since the screen
// was asked for — other than this test's own — belongs to the dev server, and the set of their roles must be exactly
// {quy_hang_login}. Runs once, in the signed-in project at 1440.
import { expect, test } from "@playwright/test";
import pg from "pg";

import { DB_NAME, DB_URL } from "../../playwright.db.config";

export const LOGIN_ROLE = "quy_hang_login";

/** The verdict on the set of roles the dev server used; null when it is exactly the login role. */
export function roleProblem(roles: string[]): string | null {
  const set = [...new Set(roles)].sort();
  if (set.length === 0) return "may chu dev khong mo ket noi nao";
  const others = set.filter((r) => r !== LOGIN_ROLE);
  if (others.length > 0) return `may chu dev noi bang vai khac ${LOGIN_ROLE}: ${others.join(", ")}`;
  return null;
}

test("may chu dev noi bang quy_hang_login", async ({ page }, info) => {
  test.skip(info.project.name !== "co-phien-1440", "do mot lan, o kho 1440 co phien");
  const owner = new pg.Client({ connectionString: DB_URL });
  await owner.connect();
  try {
    const t0 = (await owner.query<{ now: Date }>("select clock_timestamp() as now")).rows[0]!.now;
    await page.goto("/members");
    await expect(page).not.toHaveURL(/\/login/);
    const { rows } = await owner.query<{ usename: string }>(
      `select usename from pg_stat_activity
        where datname = $1 and pid <> pg_backend_pid() and state_change >= $2`,
      [DB_NAME, t0],
    );
    const roles = rows.map((r) => r.usename);
    console.log(
      `vai ket noi cua may chu dev: ${[...new Set(roles)].sort().join(", ") || "(khong co)"}`,
    );
    expect(roleProblem(roles)).toBeNull();
  } finally {
    await owner.end();
  }
});
