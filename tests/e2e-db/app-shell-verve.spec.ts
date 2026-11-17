// The App Shell laid out as the ReUI Verve template, signed in (_acceptance/app-shell-khuon-dau-trang, AC-2, AC-4, AC-5):
// the account menu at the foot of the rail is wide enough for a long email on one line, holds the company, the three
// looks and sign-out, and the arrow keys walk it; switching company shows only to a person in two companies; the page
// head of the members and company layer screens is one thin row with the primary action at its end, beside a second
// column edge that runs the whole height. Each check has a twin fed a wrong measure that must fail with its message.
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { expect, test, type Page, type TestInfo } from "@playwright/test";
import pg from "pg";

import { openSheet } from "../../tools/e2e_templates/settle";
import { chupAnh, themKieu } from "../e2e/sua-trang";
import { DB_URL, OUTBOX } from "../../playwright.db.config";
import { shellReady } from "./dang-nhap-vai";

let owner: pg.Client;
test.beforeAll(async () => {
  owner = new pg.Client({ connectionString: DB_URL });
  await owner.connect();
});
test.afterAll(async () => {
  await owner.end();
});

const phone = (page: Page) => (page.viewportSize()?.width ?? 0) < 768;

/** One company admin with a long sample email, in one or two new companies (sample data, MAU). */
async function admin(info: TestInfo, companies: 1 | 2, longName = false) {
  const stamp = `${info.project.name}-${Date.now()}`;
  // A long work email of exactly 42 characters, as long as the longest addresses a company is likely to use; the
  // same length at every width, so the check does not pass on a shorter name.
  const local = `quan-tri-san-${info.project.name}-${Date.now().toString(36)}`.padEnd(29, "x");
  const email = `${local}@example.test`;
  expect(email).toHaveLength(42);
  const user = (
    await owner.query<{ id: string }>(
      "insert into identity.users (email, name) values ($1, '[Tên] Quản trị MAU') returning id",
      [email],
    )
  ).rows[0]!.id;
  const names: string[] = [];
  for (let i = 0; i < companies; i++) {
    const name = longName
      ? `[Sàn có tên rất dài để thử thanh trên của App Shell ${i + 1} ${stamp}]`
      : `[Sàn ${i + 1} ${stamp}]`;
    const company = (
      await owner.query<{ id: string }>("insert into companies (name) values ($1) returning id", [
        name,
      ])
    ).rows[0]!.id;
    await owner.query(
      "insert into company_members (company_id, user_id, name, roles) values ($1, $2, '[Tên] Quản trị MAU', '{CompanyAdmin}')",
      [company, user],
    );
    names.push(name);
  }
  return { email, names };
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

async function signIn(page: Page, email: string, company: string) {
  await page.goto("/login");
  await expect(page.locator('[data-state="email"][data-ready]')).toBeVisible();
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Email").press("Enter");
  await expect(page.locator('[data-state="code"]')).toBeVisible();
  await expect.poll(() => codes(email).length, { timeout: 10_000 }).toBeGreaterThanOrEqual(1);
  const code = page.getByLabel("Mã đăng nhập");
  await code.fill(codes(email).at(-1)!);
  await code.press("Enter");
  const choose = page
    .locator('[data-state="choose-company"]')
    .getByRole("button", { name: company });
  // On a phone the account menu rides in the closed sheet, so the top bar marks the App Shell.
  const shell = page.locator('[data-slot="app-shell-top-bar"]');
  await expect(choose.or(shell)).toBeVisible();
  if (await choose.isVisible()) await choose.click();
  await expect(shell).toBeVisible();
}

async function openAccountMenu(page: Page) {
  if (phone(page)) await openSheet(page);
  const button = page.locator('[data-slot="account-menu"][data-ready]');
  await expect(button).toBeVisible();
  await button.click();
  await expect(page.getByRole("menu")).toBeVisible();
}

type Line = { scrollWidth: number; clientWidth: number; height: number; lineHeight: number };

async function lineOf(page: Page, text: string): Promise<Line> {
  return page
    .getByRole("menu")
    .getByText(text, { exact: true })
    .evaluate((e) => {
      const s = getComputedStyle(e);
      return {
        scrollWidth: e.scrollWidth,
        clientWidth: e.clientWidth,
        height: e.getBoundingClientRect().height,
        lineHeight: parseFloat(s.lineHeight),
      };
    });
}

/** The text shows whole, on one line: nothing cut, no second line. */
function assertWholeLine(l: Line): void {
  if (l.scrollWidth > l.clientWidth || l.height > l.lineHeight * 1.5)
    throw new Error("text does not show whole on one line");
}

type Head = {
  headRight: number;
  headTop: number;
  headHeight: number;
  actionRight: number;
  actionTop: number;
};

/** The primary action ends the one thin row of the page head. */
function assertActionAtEnd(h: Head): void {
  if (
    h.headHeight > 40 ||
    Math.abs(h.actionRight - h.headRight) > 2 ||
    h.actionTop < h.headTop ||
    h.actionTop > h.headTop + 40
  )
    throw new Error("primary action is not at the end of the thin head");
}

test(
  "signed in, the account menu shows name and a long email whole, the company, the looks and sign-out",
  { tag: "@cho" },
  async ({ page }, info) => {
    const { email, names } = await admin(info, 1);
    await signIn(page, email, names[0]!);
    await openAccountMenu(page);
    const menu = page.getByRole("menu");
    expect((await menu.boundingBox())!.width).toBeGreaterThanOrEqual(256);
    assertWholeLine(await lineOf(page, "[Tên] Quản trị MAU"));
    assertWholeLine(await lineOf(page, email));
    await expect(menu).toContainText(`Đang làm ở ${names[0]}`);
    // SHOTS_DIR=<dir> keeps the open menu for the ui-check (E12): one frame per width.
    const shots = process.env["SHOTS_DIR"];
    if (shots) {
      mkdirSync(shots, { recursive: true });
      // The Next.js dev indicator is not part of the product: keep it out of the evidence frame.
      await themKieu(page, { content: "nextjs-portal { display: none !important; }" });
      await chupAnh(page, { path: join(shots, `menu-dang-nhap-${info.project.name}.png`) });
    }
    for (const look of ["Sáng", "Tối", "Theo thiết bị"]) {
      await expect(page.getByRole("menuitemradio", { name: look })).toBeVisible();
    }
    // One company: no switching; the arrow keys walk the three looks, then sign-out.
    await expect(page.getByRole("menuitem", { name: "Đổi sàn" })).toHaveCount(0);
    for (const name of ["Sáng", "Tối", "Theo thiết bị"]) {
      await page.keyboard.press("ArrowDown");
      await expect(page.getByRole("menuitemradio", { name })).toBeFocused();
    }
    await page.keyboard.press("ArrowDown");
    await expect(page.getByRole("menuitem", { name: "Đăng xuất" })).toBeFocused();
  },
);

test(
  "a person in two companies finds switching first in the account menu",
  { tag: "@cho" },
  async ({ page }, info) => {
    const { email, names } = await admin(info, 2);
    await signIn(page, email, names[0]!);
    await openAccountMenu(page);
    await page.keyboard.press("ArrowDown");
    await expect(page.getByRole("menuitem", { name: "Đổi sàn" })).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await expect(page.getByRole("menuitemradio", { name: "Sáng" })).toBeFocused();
  },
);

test("the whole-line check fails on a cut email and on a wrapped one", async () => {
  expect(() =>
    assertWholeLine({ scrollWidth: 300, clientWidth: 200, height: 16, lineHeight: 16 }),
  ).toThrow("text does not show whole on one line");
  expect(() =>
    assertWholeLine({ scrollWidth: 200, clientWidth: 200, height: 32, lineHeight: 16 }),
  ).toThrow("text does not show whole on one line");
  expect(() =>
    assertWholeLine({ scrollWidth: 200, clientWidth: 200, height: 16, lineHeight: 16 }),
  ).not.toThrow();
});

test("members and company layer: one thin head with the primary action at its end, a full-height column edge", async ({
  page,
}, info) => {
  test.skip(phone(page), "computer sizes only");
  const { email, names } = await admin(info, 1);
  await signIn(page, email, names[0]!);
  const height = page.viewportSize()!.height;
  for (const href of ["/members", "/tuy-chinh-san?phan=thue-phi"]) {
    await page.goto(href);
    const head = page.locator('[data-slot="page-header"]');
    const action = page.locator('[data-slot="page-header-action"]');
    await expect(action).toBeVisible();
    const fontPx = await head
      .locator("h1")
      .evaluate((e) => parseFloat(getComputedStyle(e).fontSize));
    expect(fontPx).toBeLessThanOrEqual(14);
    const h = (await head.boundingBox())!;
    const a = (await action.boundingBox())!;
    assertActionAtEnd({
      headRight: h.x + h.width,
      headTop: h.y,
      headHeight: h.height,
      actionRight: a.x + a.width,
      actionTop: a.y,
    });
    const edge = (await page.locator('[data-slot="app-shell-second-column-edge"]').boundingBox())!;
    expect(edge.height).toBeGreaterThan(height - 80);
  }
});

test("the action-at-end check fails on an action dropped below the row", async () => {
  const row = { headRight: 1200, headTop: 72, headHeight: 32, actionRight: 1200, actionTop: 72 };
  expect(() => assertActionAtEnd(row)).not.toThrow();
  expect(() => assertActionAtEnd({ ...row, headHeight: 80, actionTop: 120 })).toThrow(
    "primary action is not at the end of the thin head",
  );
  expect(() => assertActionAtEnd({ ...row, actionRight: 900 })).toThrow(
    "primary action is not at the end of the thin head",
  );
});

test("the shared shell wait holds on a signed-in shell and fails where there is none", async ({
  page,
}, info) => {
  const { email, names } = await admin(info, 1);
  await page.goto("/login");
  // No App Shell on the sign-in screen: the wait must fail, on a phone and on a computer alike.
  await expect(shellReady(page, { timeout: 2_000 })).rejects.toThrow();
  await signIn(page, email, names[0]!);
  await shellReady(page);
});

type Rect = { left: number; right: number };

/** The company name ends before the search box begins: a long name is cut, it never runs under the search. */
function assertApart(company: Rect, search: Rect): void {
  if (company.right > search.left) throw new Error("company name runs into the search box");
}

test("a long company name is cut before the search box at 768, 1024 and 1440", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "1440", "one run walks the three computer widths");
  const { email, names } = await admin(info, 1, true);
  await signIn(page, email, names[0]!);
  for (const width of [768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/inventory");
    await shellReady(page);
    const name = page.locator('[data-slot="app-shell-top-bar"] [data-slot="company-name"]');
    const company = await name.evaluate((e) => e.getBoundingClientRect().toJSON() as DOMRect);
    const search = (await page.locator('[data-slot="app-shell-search"]').boundingBox())!;
    assertApart(company, { left: search.x, right: search.x + search.width });
    // The name is long enough to need cutting at these widths, so the cut is what keeps it apart.
    expect(await name.evaluate((e) => e.scrollWidth > e.clientWidth), `cut at ${width}`).toBe(true);
  }
});

test("the apart check fails on a name that runs under the search box", async () => {
  expect(() => assertApart({ left: 72, right: 720 }, { left: 600, right: 920 })).toThrow(
    "company name runs into the search box",
  );
  expect(() => assertApart({ left: 72, right: 590 }, { left: 600, right: 920 })).not.toThrow();
});
