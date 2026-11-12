// Row 1o — the company name at the start of the App Shell's top bar changes the company of the session, through the
// same way as the account menu (_acceptance/app-shell-chon-tu-reui/evals.yaml E11). Each test makes its own two
// companies; each company has one extra member only it holds, so the members screen shows which company the session
// reads. The twin feeds the check the wrong company and must fail with the pinned message.
import { existsSync, readFileSync } from "node:fs";

import { expect, test, type Page, type TestInfo } from "@playwright/test";
import pg from "pg";

import { DB_URL, OUTBOX } from "../../playwright.db.config";

let owner: pg.Client;
test.beforeAll(async () => {
  owner = new pg.Client({ connectionString: DB_URL });
  await owner.connect();
});
test.afterAll(async () => {
  await owner.end();
});

/** One admin in two new companies; each company also has one member of its own (sample data, MAU). */
async function twoCompanies(info: TestInfo) {
  const stamp = `${info.project.name}-${Date.now()}`;
  const email = `app-shell-${stamp}@example.test`;
  const user = (
    await owner.query<{ id: string }>(
      "insert into identity.users (email, name) values ($1, '[Tên] MAU') returning id",
      [email],
    )
  ).rows[0]!.id;
  const out: { name: string; only: string }[] = [];
  for (const tag of ["A", "B"]) {
    const name = `[Sàn ${tag} ${stamp}]`;
    const company = (
      await owner.query<{ id: string }>("insert into companies (name) values ($1) returning id", [
        name,
      ])
    ).rows[0]!.id;
    await owner.query(
      "insert into company_members (company_id, user_id, name, roles) values ($1, $2, '[Tên] MAU', '{CompanyAdmin}')",
      [company, user],
    );
    const only = `chi-${tag.toLowerCase()}-${stamp}@example.test`;
    const other = (
      await owner.query<{ id: string }>(
        "insert into identity.users (email, name) values ($1, $2) returning id",
        [only, `[Tên] ${tag} MAU`],
      )
    ).rows[0]!.id;
    await owner.query(
      "insert into company_members (company_id, user_id, name, roles) values ($1, $2, $3, '{ListAgent}')",
      [company, other, `[Tên] ${tag} MAU`],
    );
    out.push({ name, only });
  }
  return { email, a: out[0]!, b: out[1]! };
}

function codes(email: string): string[] {
  if (!existsSync(OUTBOX)) return [];
  return readFileSync(OUTBOX, "utf8")
    .split("\n")
    .filter(Boolean)
    .map((l) => JSON.parse(l) as { email: string; text: string; kind?: string })
    .filter((m) => m.email === email && m.kind !== "invite")
    .map((m) => (m.text.match(/\b\d{6}\b/g) ?? [])[0] ?? "");
}

async function signInTo(page: Page, email: string, company: string) {
  await page.goto("/login");
  await expect(page.locator('[data-state="email"][data-ready]')).toBeVisible();
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Email").press("Enter");
  await expect(page.locator('[data-state="code"]')).toBeVisible();
  await expect.poll(() => codes(email).length, { timeout: 10_000 }).toBeGreaterThanOrEqual(1);
  const code = page.getByLabel("Mã đăng nhập");
  await code.fill(codes(email).at(-1)!);
  await code.press("Enter");
  await page
    .locator('[data-state="choose-company"]')
    .getByRole("button", { name: company })
    .click();
  await expect(page).toHaveURL(/\/$/);
}

/** The company the session reads: the top bar names it and the members screen lists its people only. */
async function assertWorksIn(
  page: Page,
  company: { name: string; only: string },
  other: { only: string },
) {
  await page.goto("/members");
  await expect(page.locator('[data-state="ready"]')).toBeVisible();
  const bar = page.locator('[data-slot="app-shell-top-bar"]');
  const named = (await bar.locator('[data-slot="company-name"]').textContent()) ?? "";
  const hasOwn = await page.locator(`li[data-member="${company.only}"]`).count();
  const hasOther = await page.locator(`li[data-member="${other.only}"]`).count();
  if (!named.includes(company.name) || hasOwn !== 1 || hasOther !== 0)
    throw new Error("company switch did not reach the session");
}

test("the company name in the top bar changes the company of the session", async ({
  page,
}, info) => {
  const { email, a, b } = await twoCompanies(info);
  await signInTo(page, email, a.name);
  await assertWorksIn(page, a, b);
  await page.locator('[data-slot="app-shell-top-bar"] [data-slot="company-name"]').click();
  await page.getByRole("menuitemradio", { name: b.name }).click();
  await expect(page.locator('[data-slot="company-name"]')).toContainText(b.name);
  await page.reload();
  await assertWorksIn(page, b, a);
});

test("the switch check fails when the session is still in the first company", async ({
  page,
}, info) => {
  const { email, a, b } = await twoCompanies(info);
  await signInTo(page, email, a.name);
  await expect(assertWorksIn(page, b, a)).rejects.toThrow(
    "company switch did not reach the session",
  );
});
