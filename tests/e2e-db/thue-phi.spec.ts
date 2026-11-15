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
// the inventory), at the four widths, light and dark; and the case anh-ui-check saves the frames the six ui-check
// evals of the grading round look at (E2, E3, E4, E6, E9, E10-*.png), at 360, 1024 and 1440.
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
  // A neutral sample name: the owner reads these frames, so no role code shows in the name.
  name: `[Tên] ${company.toUpperCase()}${ROLES.indexOf(role) + 1}`,
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
  // Already at this schedule (another width set it first): nothing to save.
  const save = page.locator('[data-slot="fee-save"]');
  if (await save.isDisabled()) return;
  await save.click();
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
  await page.addStyleTag({ content: "nextjs-portal { display: none !important; }" });
  for (const scheme of ["light", "dark"] as const) {
    await page.emulateMedia({ colorScheme: scheme });
    await page.waitForTimeout(250);
    const suffix = scheme === "light" ? "" : "-toi";
    await page.screenshot({ path: join(dir, `${name}-${info.project.name}${suffix}.png`) });
  }
  await page.emulateMedia({ colorScheme: "light" });
}

interface Card {
  code: string;
  net: string | null;
  h: number;
  priceRight: number;
  statusRight: number;
  netRight: number | null;
  factsRight: number;
  netLeft: number | null;
  netCut: boolean;
  factsCut: boolean;
  netTop: number | null;
  factsTop: number;
}

/** Row 19 × 2b: every drawn card's third line: where the amount sits next to the price, the status and the facts. */
const readCards = (page: Page) =>
  page.locator('[data-slot="phone-card"]').evaluateAll((els): Card[] =>
    els.map((card) => {
      const at = (slot: string) =>
        card.querySelector<HTMLElement>(`[data-slot="${slot}"]`)?.getBoundingClientRect() ?? null;
      const net = card.querySelector<HTMLElement>('[data-slot="listing-card-net"]');
      const facts = card.querySelector<HTMLElement>('[data-slot="listing-card-facts"]')!;
      const n = net?.getBoundingClientRect() ?? null;
      return {
        code: card.querySelector<HTMLElement>('[data-slot="listing-card-unit"]')!.innerText,
        net: net?.innerText ?? null,
        h: card.getBoundingClientRect().height,
        priceRight: at("listing-card-price")!.right,
        statusRight: at("listing-card-status")!.right,
        netRight: n?.right ?? null,
        netLeft: n?.left ?? null,
        factsRight: facts.getBoundingClientRect().right,
        netCut: net ? net.scrollWidth > net.clientWidth + 0.5 : false,
        factsCut: facts.scrollWidth > facts.clientWidth + 0.5,
        netTop: n?.top ?? null,
        factsTop: facts.getBoundingClientRect().top,
      };
    }),
  );

function checkCards(cards: readonly Card[], width: number): void {
  const problems: string[] = [];
  const withNet = cards.filter((c) => c.net !== null);
  if (withNet.length === 0) problems.push(`no card shows ${label("NetToSeller")} at ${width}`);
  if (cards.length === withNet.length)
    problems.push(`every card shows ${label("NetToSeller")} at ${width}`);
  const heights = cards.map((c) => c.h);
  if (Math.max(...heights) - Math.min(...heights) > 0.5)
    problems.push(
      `cards differ in height at ${width}: ${Math.min(...heights)}–${Math.max(...heights)}`,
    );
  for (const c of withNet) {
    if (!c.net!.startsWith(`${label("NetToSeller")} `))
      problems.push(`amount without its label: ${c.code} «${c.net}»`);
    if (Math.abs(c.netRight! - c.priceRight) > 1 || Math.abs(c.netRight! - c.statusRight) > 1)
      problems.push(`amount off the right edge of price and status: ${c.code}`);
    if (c.netCut) problems.push(`amount cut: ${c.code} «${c.net}»`);
    if (c.netLeft! < c.factsRight - 0.5) problems.push(`amount over the facts: ${c.code}`);
    if (Math.abs(c.netTop! - c.factsTop) > 2)
      problems.push(`amount not on the facts line: ${c.code}`);
  }
  if (problems.length > 0) throw new Error(problems.join("\n"));
}

/** The ListAgent of company A on the inventory, which below 768 px is the list of cards (row 2b). */
async function openCards(browser: Browser, info: TestInfo): Promise<Page> {
  const agent = await as(browser, "a-ListAgent", info);
  await agent.goto("/inventory");
  await expect(agent.locator('[hidden][id^="S:"]')).toHaveCount(0);
  await agent.locator('[data-slot="phone-card"]').first().waitFor();
  return agent;
}

/**
 * Row 19 × AC-6 at every width, on company B (default schedule, no case changes it): the Về tay amount of the 3 tỷ
 * fees-included sample row 0602 · S1.02 — in the table cell from 768 px, on the card below. Empty when it is right.
 */
async function netProblems(page: Page, phone: boolean, want: string): Promise<string[]> {
  if (phone) {
    const card = page
      .locator('[data-slot="phone-card"]')
      .filter({ hasText: "0602" })
      .filter({ hasText: "S1.02" })
      .first();
    const net = card.locator('[data-slot="listing-card-net"]');
    if ((await net.count()) === 0) return ["card 0602 · S1.02 has no amount"];
    const text = (await net.innerText()).trim();
    return text === `${label("NetToSeller")} ${want}`
      ? []
      : [`card 0602 · S1.02 shows «${text}», not ${want}`];
  }
  const tr = page
    .locator('[data-slot="data-region-body"] tbody tr')
    .filter({ hasText: "S1.02" })
    .filter({ hasText: "0602" })
    .first();
  const cell = tr.locator('td[data-col-id="custom.netToSeller"]');
  if ((await cell.count()) === 0) return ["row 0602 · S1.02 has no amount cell"];
  const text = (await cell.innerText()).trim();
  return text === want ? [] : [`row 0602 · S1.02 shows «${text}», not ${want}`];
}

/** Opens the inventory as company B's ListAgent, at the first drawn row or card. */
async function openB(browser: Browser, info: TestInfo, phone: boolean): Promise<Page> {
  const page = await as(browser, "b-ListAgent", info);
  await page.goto("/inventory");
  await expect(page.locator('[hidden][id^="S:"]')).toHaveCount(0);
  await page
    .locator(phone ? '[data-slot="phone-card"]' : '[data-slot="data-region-body"] tbody tr')
    .first()
    .waitFor();
  return page;
}

const FEE_HEAD = 'th[data-col-id="Listing.feeInclusion"]';

/**
 * Row 19 × AC-6 from 768 px: the fee inclusion column is not drawn at first, is in the Cột menu unticked, and ticking
 * it draws its header. Empty when both halves hold.
 */
async function feeColumnProblems(page: Page): Promise<string[]> {
  if ((await page.locator(FEE_HEAD).count()) > 0) return ["fee inclusion shown at first"];
  await page
    .locator('[data-slot="data-region"]')
    .first()
    .getByRole("button", { name: "Cột", exact: true })
    .click();
  await page.getByRole("menuitemcheckbox").first().waitFor();
  const item = page.getByRole("menuitemcheckbox", { name: label("FeeInclusion") });
  if ((await item.count()) === 0) return ["fee inclusion not in the Cột menu"];
  if ((await item.getAttribute("aria-checked")) === "true")
    return ["fee inclusion ticked at first"];
  await item.click();
  await page.keyboard.press("Escape");
  const head = page.locator(FEE_HEAD);
  if ((await head.count()) === 0) return ["fee inclusion not drawn after ticking it"];
  // Scroll without waiting for the cell to be visible: a cell that never shows is a finding, not a hang.
  await head.evaluate((el) => el.scrollIntoView({ block: "nearest", inline: "nearest" }));
  if (!(await head.isVisible())) return ["fee inclusion not visible after ticking it"];
  // The header cell also holds its filter box (row 2e): its name is the first line.
  const name = (await head.innerText()).trim().split("\n")[0]!.trim();
  if (name !== label("FeeInclusion")) return [`fee inclusion header reads «${name}»`];
  return [];
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
    if (info.project.name === "360" || info.project.name === "414") {
      // Below 768 px the inventory is the list of cards (row 2b): Về tay is on the card, the table is not drawn.
      await expect(agent.locator('[data-slot="listing-card-net"]').first()).toBeVisible();
      await expect(agent.locator('th[data-col-id="custom.netToSeller"]')).toHaveCount(0);
      return;
    }
    const head = agent.locator('th[data-col-id="custom.netToSeller"]');
    await expect(head).toHaveCount(1);
    await expect(agent.locator('th[data-col-id="Listing.feeInclusion"]')).toHaveCount(0);
  });

  // AC-6, the amount at every width (Ngoài-25 of round 6): company B on the defaults, 3 tỷ fees included.
  test("ve-tay-bon-kho", async ({ browser }, info) => {
    const phone = info.project.name === "360" || info.project.name === "414";
    const page = await openB(browser, info, phone);
    expect(await netProblems(page, phone, formatMoney(2_895_000_000))).toEqual([]);
  });

  // AC-6, the fee inclusion column on every ordinary run (Ngoài-20, Ngoài-21 of round 6): hidden at first, then on.
  test("dieu-kien-phi-an-roi-bat", async ({ browser }, info) => {
    test.skip(
      info.project.name === "360" || info.project.name === "414",
      "the table is drawn from 768 px",
    );
    const page = await openB(browser, info, false);
    expect(await feeColumnProblems(page)).toEqual([]);
  });

  test("ve-tay-va-dieu-kien-phi-pha", async ({ browser }, info) => {
    const size = info.project.name;
    test.skip(size !== "360" && size !== "1440", "break cases run at 360 and 1440");
    const phone = size === "360";
    // A wrong amount on the row is caught, on the card or in the cell.
    const wrong = await openB(browser, info, phone);
    const where = phone ? "card 0602 · S1.02" : "row 0602 · S1.02";
    const say = (shown: string, want: string) =>
      phone
        ? `${where} shows «${label("NetToSeller")} ${shown}», not ${want}`
        : `${where} shows «${shown}», not ${want}`;
    // The right amount, asked for a wrong one: the finding names both, so the row was found and read.
    expect(await netProblems(wrong, phone, formatMoney(2_880_000_000))).toEqual([
      say(formatMoney(2_895_000_000), formatMoney(2_880_000_000)),
    ]);
    const slot = phone ? '[data-slot="listing-card-net"]' : 'td[data-col-id="custom.netToSeller"]';
    const target = (
      phone
        ? wrong.locator('[data-slot="phone-card"]')
        : wrong.locator('[data-slot="data-region-body"] tbody tr')
    )
      .filter({ hasText: "0602" })
      .filter({ hasText: "S1.02" })
      .first()
      .locator(slot);
    await target.evaluate((el) => {
      el.textContent = el.textContent!.replace(/[\d,]+ tỷ$/, "2,88 tỷ");
    });
    expect(await netProblems(wrong, phone, formatMoney(2_895_000_000))).toEqual([
      say("2,88 tỷ", formatMoney(2_895_000_000)),
    ]);
    if (phone) return;
    // A fee inclusion column drawn at first is caught.
    const shown = await openB(browser, info, false);
    await shown
      .locator('[data-slot="data-region-body"] thead tr')
      .first()
      .evaluate((tr, word) => {
        const th = document.createElement("th");
        th.setAttribute("data-col-id", "Listing.feeInclusion");
        th.textContent = word;
        tr.appendChild(th);
      }, label("FeeInclusion"));
    expect(await feeColumnProblems(shown)).toEqual(["fee inclusion shown at first"]);
    // A column ticked in the menu that never becomes visible is caught.
    const hidden = await openB(browser, info, false);
    await hidden.addStyleTag({ content: `${FEE_HEAD} { display: none !important; }` });
    expect(await feeColumnProblems(hidden)).toEqual(["fee inclusion not visible after ticking it"]);
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

  // Row 19 × 2b (sixth fix after the scope gate): on a phone the card shows Về tay at the right end of its third line.
  test("the-ve-tay", async ({ browser }, info) => {
    const size = info.project.name;
    test.skip(size !== "360" && size !== "414", "the cards are the inventory at 360 and 414");
    const width = Number(size);
    const agent = await openCards(browser, info);
    checkCards(await readCards(agent), width);
    if (size !== "360") return;
    // The longest text the sample can give on that line, beside the largest amount, in the first card with one.
    await agent
      .locator('[data-slot="listing-card-net"]')
      .first()
      .evaluate((net) => {
        const facts = net.parentElement!.querySelector<HTMLElement>(
          '[data-slot="listing-card-facts"]',
        )!;
        facts.textContent = "110,4 m² · 3 phòng ngủ · 110,4 m² · 3 phòng ngủ";
        net.textContent = net.textContent!.replace(/\S+ \S+$/, "999,99 tỷ");
      });
    checkCards(await readCards(agent), 360);
  });

  test("the-ve-tay-pha", async ({ browser }, info) => {
    test.skip(info.project.name !== "360", "break cases run at 360");
    expect(() => checkCards([], 360)).toThrow(/no card shows/);
    // An amount allowed to shrink beside facts that may not: cut, or over the facts.
    const shrink = await openCards(browser, info);
    await shrink.addStyleTag({
      content:
        '[data-slot="listing-card-net"] { flex-shrink: 1 !important; overflow: hidden; min-width: 0; } [data-slot="listing-card-facts"] { flex-shrink: 0 !important; }',
    });
    await shrink
      .locator('[data-slot="listing-card-net"]')
      .first()
      .evaluate((net) => {
        const facts = net.parentElement!.querySelector<HTMLElement>(
          '[data-slot="listing-card-facts"]',
        )!;
        facts.textContent = "110,4 m² · 3 phòng ngủ · 110,4 m² · 3 phòng ngủ";
      });
    const shrunk = await readCards(shrink);
    expect(() => checkCards(shrunk, 360)).toThrow(
      /amount cut|amount over the facts|off the right edge/,
    );
    // An amount on a line of its own, as a line under the price would be: the card grows.
    const own = await openCards(browser, info);
    await own.addStyleTag({
      content:
        ':has(> [data-slot="listing-card-net"]) { flex-wrap: wrap !important; } [data-slot="listing-card-net"] { width: 100%; }',
    });
    const tall = await readCards(own);
    expect(() => checkCards(tall, 360)).toThrow(/differ in height|not on the facts line/);
  });

  // Owner photos: the three kinds of card in one frame (with Về tay, fees not included, no price), light and dark.
  test("anh-the-ve-tay", async ({ browser }, info) => {
    test.skip(process.env["THUE_PHI_ANH"] !== "1", "frames only on demand");
    const size = info.project.name;
    test.skip(size !== "360" && size !== "414", "the cards are the inventory at 360 and 414");
    const width = Number(size);
    const agent = await openCards(browser, info);
    await agent.addStyleTag({ content: "nextjs-portal { display: none !important; }" });
    const kinds = await agent.locator('[data-slot="phone-card"]').evaluateAll((els) =>
      els.map((card) => ({
        net: card.querySelector('[data-slot="listing-card-net"]') !== null,
        priced: /\d/.test(
          card.querySelector<HTMLElement>('[data-slot="listing-card-price"]')?.innerText ?? "",
        ),
      })),
    );
    // The shortest run of cards holding all three kinds.
    let best: [number, number] | null = null;
    for (let i = 0; i < kinds.length; i += 1)
      for (let j = i; j < kinds.length; j += 1) {
        const run = kinds.slice(i, j + 1);
        if (
          run.some((k) => k.net) &&
          run.some((k) => !k.net && k.priced) &&
          run.some((k) => !k.priced) &&
          (!best || j - i < best[1] - best[0])
        )
          best = [i, j];
      }
    if (!best) throw new Error("no run of cards holds all three kinds");
    const all = agent.locator('[data-slot="phone-card"]');
    await all.nth(best[0]).evaluate((el) => el.scrollIntoView({ block: "center" }));
    await agent.waitForTimeout(300);
    const dir = join(process.cwd(), "_acceptance/thue-phi/evidence");
    mkdirSync(dir, { recursive: true });
    for (const scheme of ["light", "dark"] as const) {
      await agent.emulateMedia({ colorScheme: scheme });
      await agent.waitForTimeout(250);
      const top = (await all.nth(best[0]).boundingBox())!;
      const bottom = (await all.nth(best[1]).boundingBox())!;
      const y = Math.max(0, top.y - 12);
      await agent.screenshot({
        path: join(dir, `the-ve-tay-${width}-${scheme === "light" ? "sang" : "toi"}.png`),
        clip: { x: 0, y, width, height: bottom.y + bottom.height + 12 - y },
      });
    }
  });

  test("anh-ui-check", async ({ browser }, info) => {
    test.skip(process.env["THUE_PHI_ANH"] !== "1", "frames only on demand");
    const size = info.project.name;
    test.skip(
      !["360", "1024", "1440"].includes(size),
      "the ui-check frames use 360, 1024 and 1440",
    );
    const dir = join(process.cwd(), "_acceptance/thue-phi/evidence");
    mkdirSync(dir, { recursive: true });
    const frame = async (page: Page, name: string, both = false) => {
      // The development build's «N» badge is not part of the product: hidden in every frame the owner reads.
      await page.addStyleTag({ content: "nextjs-portal { display: none !important; }" });
      for (const scheme of both ? (["light", "dark"] as const) : (["light"] as const)) {
        await page.emulateMedia({ colorScheme: scheme });
        await page.waitForTimeout(250);
        const suffix = both ? (scheme === "light" ? "-sang" : "-toi") : "";
        await page.screenshot({ path: join(dir, `${name}${suffix}.png`) });
      }
      await page.emulateMedia({ colorScheme: "light" });
    };
    const admin = await as(browser, "a-CompanyAdmin", info);

    // E9: the part beside the members screen, same width.
    if (size === "360" || size === "1440") {
      await openPart(admin);
      await frame(admin, `E9-thue-phi-${size}`);
      const members = await as(browser, "a-CompanyAdmin", info);
      await members.goto("/members");
      await expect(members.locator('[data-state="ready"]')).toBeVisible();
      await frame(members, `E9-thanh-vien-${size}`);
    }
    if (size === "360") return;

    // E2: brokerage 1,5, both law items on.
    await setSchedule(admin, "1,5", true);
    await frame(admin, `E2-${size}`, true);

    // E6: brokerage 2, registration fee off, as the ListAgent; then the fee inclusion column turned on.
    await setSchedule(admin, "2", false);
    const agent = await as(browser, "a-ListAgent", info);
    await netCell(agent);
    await frame(agent, `E6-${size}`, true);
    if (size !== "1440") return;
    await agent
      .locator('[data-slot="data-region"]')
      .first()
      .getByRole("button", { name: "Cột", exact: true })
      .click();
    await agent.getByRole("menuitemcheckbox", { name: label("FeeInclusion") }).click();
    await agent.keyboard.press("Escape");
    await agent.locator('th[data-col-id="Listing.feeInclusion"]').scrollIntoViewIfNeeded();
    await frame(agent, "E6-dieu-kien");

    // E4: TeamLead reads only.
    const lead = await as(browser, "a-TeamLead", info);
    await openPart(lead);
    await frame(lead, "E4", true);

    // E3: company B's admin, on the default schedule.
    const b = await as(browser, "b-CompanyAdmin", info);
    await openPart(b);
    await row(b, "brokerage").getByRole("textbox").fill("6");
    await frame(b, "E3-sai");
    await row(b, "brokerage").getByRole("textbox").fill("1,5");
    await row(b, "registration").getByRole("switch").click();
    await b.locator('[data-slot="fee-save"]').click();
    await expect(b.getByText(FEE_COPY.saved).first()).toBeVisible();
    await frame(b, "E3-luu");
    await openPart(b);
    await frame(b, "E3-tai-lai");

    // E10: add an own item, save, its «…», and the law rows without one.
    await openPart(admin);
    await admin.locator('[data-slot="fee-add"]').click();
    const added = admin.getByRole("listitem").last();
    await added.getByRole("textbox").first().fill("Phí dịch vụ hồ sơ");
    await added.getByRole("textbox").nth(1).fill("0,3");
    await frame(admin, "E10-them");
    await admin.locator('[data-slot="fee-save"]').click();
    await expect(admin.getByText(FEE_COPY.saved).first()).toBeVisible();
    await frame(admin, "E10-luu");
    await admin.getByRole("listitem").last().locator('[data-slot="fee-more"]').click();
    await expect(admin.getByRole("menu")).toBeVisible();
    await frame(admin, "E10-menu");
    await admin.keyboard.press("Escape");
    // The first menu closes with an animation; open the next only once it is gone, so one menu is on screen.
    await expect(admin.getByRole("menu")).toHaveCount(0);
    // A changed default item's «…» also offers the reset.
    await row(admin, "brokerage").locator('[data-slot="fee-more"]').click();
    await expect(admin.getByRole("menu")).toBeVisible();
    await frame(admin, "E10-menu-moi-gioi");
    await admin.keyboard.press("Escape");
    await expect(admin.getByRole("menu")).toHaveCount(0);
    await frame(admin, "E10-luat");
    // For the owner's page: the added item renamed, then taken out, each saved.
    await admin.getByRole("listitem").last().locator('[data-slot="fee-more"]').click();
    await admin.getByRole("menuitem", { name: label("RenameFeeItem") }).click();
    await expect(admin.getByRole("menu")).toHaveCount(0);
    await admin.locator('[data-slot="fee-name"]').fill("Phí hồ sơ");
    await frame(admin, "E10-doi-ten");
    await admin.locator('[data-slot="fee-save"]').click();
    await expect(admin.getByRole("listitem").last()).toContainText("Phí hồ sơ");
    await admin.getByRole("listitem").last().locator('[data-slot="fee-more"]').click();
    await admin.getByRole("menuitem", { name: label("RemoveFeeItem") }).click();
    await expect(admin.getByRole("menu")).toHaveCount(0);
    await expect(admin.getByText("Phí hồ sơ")).toHaveCount(0);
    await frame(admin, "E10-bo");
    await admin.locator('[data-slot="fee-save"]').click();
    await expect(admin.getByText(FEE_COPY.saved).first()).toBeVisible();
  });
});
