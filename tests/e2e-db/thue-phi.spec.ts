// Fees and taxes in the browser (row 19, thue-phi) on this lane's Postgres:
//   DB_LANE=n DB_PORT=5563 npx playwright test -c playwright.db.config.ts tests/e2e-db/thue-phi.spec.ts
// People sign in through the shared sign-in function of row 9b (dang-nhap-vai.ts); this file never signs in by itself.
//   dat-muc-roi-bang-hang-doi — E6-e2e: company A's admin saves brokerage 2% and switches the registration fee off on
//                               the screen; A's ListAgent sees 2,88 tỷ on the 3 tỷ fees-included row; back to 1% shows
//                               2,91 tỷ; company B's ListAgent sees the defaults. At 1440 the Về tay cell of
//                               that row sits inside the view with the second column open, before any sideways scroll.
//   vai-khac-chi-doc          — E4 in the browser: the three other roles read the part, no field, no save.
//   bon-kho                   — the part and the inventory's Về tay column at the four widths of the grid family.
//   axe-sang-toi              — the part and the inventory, light and dark, no axe violation.
// With THUE_PHI_ANH=1 the proof images go to _acceptance/thue-phi/evidence/ (the part, the members screen beside it,
// the inventory), at the four widths, light and dark.
import { existsSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Browser, type Page, type TestInfo } from "@playwright/test";
import pg from "pg";

import type { Role } from "../../src/generated/ontology";
import { formatMoney } from "../../src/lib/format";
import { label } from "../../src/modules/company-config";
import { FEE_COPY } from "../../src/modules/company-config/ui/fee-copy";

import { ROLES, signInWithCode } from "./dang-nhap-vai";

const RUN = process.env["E2E_DB_RUN"] ?? `${process.pid}`;
const DB_PORT = process.env["DB_PORT"] ?? "5563";
const OWNER_URL = `postgres://postgres:local-only@127.0.0.1:${DB_PORT}/dang_nhap_e2e_${RUN}`;
const AXE_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

const COMPANY = { a: "[Sàn A thử thuế phí]", b: "[Sàn B thử thuế phí]" } as const;
const personOf = (role: Role, company: "a" | "b" = "a") => ({
  name: `[Tên] Thuế phí ${company.toUpperCase()} ${role}`,
  email: `thue-phi-${company}-${role.toLowerCase()}-${RUN}@example.test`,
});

async function owner<T>(text: string, values: unknown[] = []): Promise<T[]> {
  const db = new pg.Client({ connectionString: OWNER_URL });
  await db.connect();
  try {
    return (await db.query(text, values)).rows as T[];
  } finally {
    await db.end();
  }
}

async function makeCompanies(): Promise<void> {
  for (const [key, roles] of [
    ["a", ROLES],
    ["b", ["ListAgent", "CompanyAdmin"]],
  ] as const) {
    const id = (
      await owner<{ id: string }>("insert into companies (name) values ($1) returning id", [
        COMPANY[key],
      ])
    )[0]!.id;
    for (const role of roles) {
      const p = personOf(role, key);
      const user = (
        await owner<{ id: string }>(
          "insert into identity.users (email, name) values ($1, $2) returning id",
          [p.email, p.name],
        )
      )[0]!.id;
      await owner(
        "insert into company_members (company_id, user_id, name, roles) values ($1, $2, $3, $4)",
        [id, user, p.name, [role]],
      );
    }
  }
}

const stateOf = (who: string) => join(tmpdir(), `onehub-e2e-db-thue-phi-${who}-${RUN}.json`);
async function keepSession(browser: Browser, email: string, file: string) {
  const context = await browser.newContext();
  const page = await context.newPage();
  await signInWithCode(page, email);
  await context.storageState({ path: file });
  await context.close();
}
async function as(browser: Browser, who: string, info: TestInfo): Promise<Page> {
  const viewport = info.project.use.viewport ?? { width: 1440, height: 900 };
  const ctx = await browser.newContext({ storageState: stateOf(who), viewport });
  return ctx.newPage();
}

async function openPart(page: Page) {
  await page.goto("/tuy-chinh-san?phan=thue-phi");
  await expect(page.locator('[data-part="thue-phi"][data-state="ready"]')).toBeVisible();
}
const row = (page: Page, code: string) => page.locator(`[data-fee="${code}"]`);

/** The Về tay cell of the sample's 3 tỷ fees-included row (unit 0602 of S1.02). */
async function netCell(page: Page) {
  await page.goto("/inventory");
  await expect(page.locator('[hidden][id^="S:"]')).toHaveCount(0);
  const body = page.locator('[data-slot="data-region-body"] tbody tr');
  const tr = body.filter({ hasText: "S1.02" }).filter({ hasText: "0602" }).first();
  return tr.locator('td[data-col-id="custom.netToSeller"]');
}

async function setSchedule(page: Page, brokerage: string, registrationOn: boolean) {
  await openPart(page);
  await row(page, "brokerage").getByRole("textbox").fill(brokerage);
  const sw = row(page, "registration").getByRole("switch");
  if ((await sw.getAttribute("aria-checked")) !== String(registrationOn)) await sw.click();
  await page.locator('[data-slot="fee-save"]').click();
  await expect(page.getByText(FEE_COPY.saved).first()).toBeVisible();
}

async function axeClean(page: Page, where: string) {
  await expect(page.locator("[aria-busy=true]")).toHaveCount(0);
  await page.waitForTimeout(250);
  for (const colorScheme of ["light", "dark"] as const) {
    await page.emulateMedia({ colorScheme });
    const { violations } = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze();
    expect(
      violations.map(
        (v) =>
          `${where} ${colorScheme} ${v.id} ${v.nodes.map((n) => n.target.join(" ")).join(" | ")}`,
      ),
    ).toEqual([]);
  }
  await page.emulateMedia({ colorScheme: "light" });
}

async function proof(page: Page, info: TestInfo, name: string) {
  if (process.env["THUE_PHI_ANH"] !== "1") return;
  const dir = join(process.cwd(), "_acceptance/thue-phi/evidence");
  mkdirSync(dir, { recursive: true });
  for (const scheme of ["light", "dark"] as const) {
    await page.emulateMedia({ colorScheme: scheme });
    await page.waitForTimeout(250);
    const suffix = scheme === "light" ? "" : "-toi";
    await page.screenshot({ path: join(dir, `${name}-${info.project.name}${suffix}.png`) });
  }
  await page.emulateMedia({ colorScheme: "light" });
}

test.describe.configure({ mode: "serial" });

test.describe("thue phi", () => {
  // The companies and sessions are made once, by whichever width runs first.
  test.beforeAll(async ({ browser }) => {
    if (existsSync(stateOf("b-CompanyAdmin"))) return;
    await makeCompanies();
    for (const role of ROLES)
      await keepSession(browser, personOf(role).email, stateOf(`a-${role}`));
    for (const role of ["ListAgent", "CompanyAdmin"] as const)
      await keepSession(browser, personOf(role, "b").email, stateOf(`b-${role}`));
  });

  test("dat-muc-roi-bang-hang-doi", async ({ browser }, info) => {
    test.skip(info.project.name !== "1440", "the data case runs at 1440");
    const admin = await as(browser, "a-CompanyAdmin", info);
    await setSchedule(admin, "2", false);
    const rows = await owner<{ code: string; rate_bp: number; included: boolean }>(
      `select code, rate_bp, included from company_fee_items f join companies c on c.id = f.company_id
        where c.name = $1 and retired_at is null order by code`,
      [COMPANY.a],
    );
    expect(rows).toEqual([
      { code: "brokerage", rate_bp: 200, included: true },
      { code: "registration", rate_bp: 50, included: false },
    ]);

    const agent = await as(browser, "a-ListAgent", info);
    const cell = await netCell(agent);
    await expect(cell).toHaveText("2,88 tỷ");
    // With the second column open and no sideways scroll, the Về tay cell sits inside the view.
    const box = await cell.boundingBox();
    const scroller = await agent.locator('[data-slot="data-region-body"]').first().boundingBox();
    expect(box && scroller && box.x + box.width <= scroller.x + scroller.width).toBe(true);
    await proof(agent, info, "inventory");

    await setSchedule(admin, "1", false);
    await expect(await netCell(agent)).toHaveText("2,91 tỷ");

    const other = await as(browser, "b-ListAgent", info);
    await expect(await netCell(other)).toHaveText(formatMoney(2_895_000_000));
  });

  test("vai-khac-chi-doc", async ({ browser }, info) => {
    test.skip(info.project.name !== "1440", "the role case runs at 1440");
    for (const role of ["ListAgent", "BuyerAgent", "TeamLead"] as const) {
      const page = await as(browser, `a-${role}`, info);
      await openPart(page);
      await expect(page.locator('[data-slot="fee-rate"]'), role).toHaveCount(0);
      await expect(page.locator('[data-slot="fee-save"]'), role).toHaveCount(0);
      await expect(page.locator('[data-slot="fee-add"]'), role).toHaveCount(0);
      await expect(page.locator('[data-slot="fee-read-only"]'), role).toHaveText(FEE_COPY.readOnly);
      const res = await page.request.put("/api/v1/company/fee-schedule", {
        data: { items: [{ code: "pit", rateBasisPoints: 200, included: true }] },
      });
      expect(res.status(), role).toBe(403);
    }
  });

  test("bon-kho", async ({ browser }, info) => {
    const admin = await as(browser, "a-CompanyAdmin", info);
    await openPart(admin);
    await expect(admin.locator('[data-slot="fee-frame"]')).toBeVisible();
    await expect(admin.getByRole("heading", { name: label("CompanyLayer") })).toBeVisible();
    expect(
      await admin.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
    await proof(admin, info, "tuy-chinh-san");
    const members = await as(browser, "a-CompanyAdmin", info);
    await members.goto("/members");
    await expect(members.locator('[data-state="ready"]')).toBeVisible();
    await proof(members, info, "members");
    const agent = await as(browser, "a-ListAgent", info);
    await agent.goto("/inventory");
    await expect(agent.locator('[hidden][id^="S:"]')).toHaveCount(0);
    await proof(agent, info, "inventory");
    const head = agent.locator('th[data-col-id="custom.netToSeller"]');
    await expect(head).toHaveCount(1);
    await expect(agent.locator('th[data-col-id="Listing.feeInclusion"]')).toHaveCount(0);
  });

  test("axe-sang-toi", async ({ browser }, info) => {
    test.skip(info.project.name !== "1440", "axe runs at 1440");
    const admin = await as(browser, "a-CompanyAdmin", info);
    await openPart(admin);
    await axeClean(admin, "thue-phi");
    const agent = await as(browser, "a-ListAgent", info);
    await agent.goto("/inventory");
    await expect(agent.locator('[hidden][id^="S:"]')).toHaveCount(0);
    await axeClean(agent, "inventory");
  });
});
