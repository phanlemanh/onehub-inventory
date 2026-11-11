// The three sign-in holes of row 1m in the browser, on this lane's Postgres (_acceptance/va-dang-nhap/evals.yaml E2–E9,
// E14, E15). Codes are read from the dev server's outbox file, as in login.spec.ts.
// A real server failure (not one faked in the browser): the owner revokes the API role's right to run the
// end-session function inside the case and gives it back in `finally`.
// SHOTS_DIR=<dir> saves one frame per state for the evidence page (E15-step<n>.png).
// Break runs (2026-11-11), each red with the pinned message, then restored:
//   - the account menu's sign-out ignoring the result → 'dang-xuat-mang-dut' «đăng xuất lỗi mà rời trang»;
//   - the old safeNext pasted back → 'next-lach-may-chu' «máy chủ chuyển sang trang lạ»;
//   - the server clearing the cookie when ending the session fails → 'dang-xuat-may-chu-loi'
//     «máy chủ xoá cookie khi chưa xoá phiên».
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import AxeBuilder from "@axe-core/playwright";
import { expect, test, type APIResponse, type Page, type TestInfo } from "@playwright/test";
import pg from "pg";

import { DB_URL, OUTBOX } from "../../playwright.db.config";

const AXE_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
const SIGN_OUT_FAILED =
  "Chưa đăng xuất được. Bạn vẫn đang đăng nhập trên máy này — kiểm tra mạng rồi bấm «Đăng xuất» lại.";
const NO_COMPANY_SESSION =
  "Tài khoản của bạn không còn thuộc sàn nào. Nhờ quản trị sàn mời lại, hoặc đăng xuất để dùng email khác.";
const COOKIE = "ohi_session";
const SESSION_PATH = "/api/v1/auth/session";

let owner: pg.Client;
test.beforeAll(async () => {
  owner = new pg.Client({ connectionString: DB_URL });
  await owner.connect();
});
test.afterAll(async () => {
  await owner.end();
});

async function person(
  info: TestInfo,
  tag: string,
  companies: string[],
): Promise<{ email: string; ids: string[] }> {
  const email = `${tag}-${info.project.name}-${Date.now()}@example.test`;
  const user = (
    await owner.query<{ id: string }>(
      "insert into identity.users (email, name) values ($1, '[Tên]') returning id",
      [email],
    )
  ).rows[0]!.id;
  const ids: string[] = [];
  for (const name of companies) {
    const id = (
      await owner.query<{ id: string }>("insert into companies (name) values ($1) returning id", [
        name,
      ])
    ).rows[0]!.id;
    await owner.query("insert into company_members (company_id, user_id) values ($1, $2)", [
      id,
      user,
    ]);
    ids.push(id);
  }
  return { email, ids };
}

function mailsTo(email: string): string[] {
  if (!existsSync(OUTBOX)) return [];
  return readFileSync(OUTBOX, "utf8")
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line) as { email: string; text: string })
    .filter((m) => m.email === email)
    .map((m) => m.text.match(/\b\d{6}\b/)![0]);
}

async function codeFor(email: string): Promise<string> {
  await expect.poll(() => mailsTo(email).length, { timeout: 10_000 }).toBeGreaterThanOrEqual(1);
  return mailsTo(email).at(-1)!;
}

async function sessions(email: string): Promise<number> {
  const { rows } = await owner.query<{ n: string }>(
    "select count(*) as n from identity.sessions s join identity.users u on u.id = s.user_id where u.email = $1",
    [email],
  );
  return Number(rows[0]!.n);
}

/** A real server failure: the API role may no longer run the end-session function. */
async function breakSignOut(): Promise<void> {
  await owner.query("revoke execute on function app.session_end(text) from quy_hang_app");
}
async function mendSignOut(): Promise<void> {
  await owner.query("grant execute on function app.session_end(text) to quy_hang_app");
}

async function shot(page: Page, info: TestInfo, step: number, size: string, dark = false) {
  const dir = process.env["SHOTS_DIR"];
  if (!dir || info.project.name !== size) return;
  mkdirSync(dir, { recursive: true });
  if (dark) await page.emulateMedia({ colorScheme: "dark" });
  await page.screenshot({ path: join(dir, `E15-step${step}.png`), fullPage: true });
  if (dark) await page.emulateMedia({ colorScheme: "light" });
}

async function askCode(page: Page, email: string) {
  await expect(page.locator('[data-state="email"][data-ready]')).toBeVisible();
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Email").press("Enter");
  await expect(page.locator('[data-state="code"]')).toBeVisible();
}

async function typeCode(page: Page, code: string) {
  const input = page.getByLabel("Mã đăng nhập");
  await input.fill(code);
  await input.press("Enter");
}

async function signIn(page: Page, email: string) {
  await page.goto("/login");
  await askCode(page, email);
  await typeCode(page, await codeFor(email));
  await expect(page).toHaveURL(/\/$/);
}

async function clickSignOutInMenu(page: Page) {
  await expect(page.locator('[data-slot="account-menu"][data-ready]')).toBeVisible();
  await page.getByRole("button", { name: "Tài khoản" }).click();
  await page.getByRole("menu").getByRole("menuitem", { name: "Đăng xuất" }).click();
}

/**
 * Records every in-app navigation from now on. A failed sign-out that still goes to /login is bounced straight back
 * by the sign-in page, so the final URL alone cannot see it — the recorded visits can.
 */
async function recordVisits(page: Page) {
  await page.evaluate(() => {
    const w = window as unknown as { __visits: string[] };
    w.__visits = [];
    for (const key of ["pushState", "replaceState"] as const) {
      const original = history[key].bind(history);
      history[key] = (state: unknown, unused: string, url?: string | URL | null) => {
        if (url != null) w.__visits.push(String(url));
        original(state, unused, url);
      };
    }
  });
}

async function leftForLogin(page: Page): Promise<boolean> {
  const visits = await page.evaluate(() => (window as unknown as { __visits: string[] }).__visits);
  return visits.some((u) => u.includes("/login"));
}

function deleteResponse(page: Page) {
  return page.waitForResponse(
    (r) => r.url().endsWith(SESSION_PATH) && r.request().method() === "DELETE",
  );
}

/** The response cleared the session cookie (Max-Age=0). */
function clearsCookie(res: APIResponse | { headers(): Record<string, string> }): boolean {
  const header = res.headers()["set-cookie"] ?? "";
  return header.includes(`${COOKIE}=`) && /max-age=0/i.test(header);
}

async function hasCookie(page: Page): Promise<boolean> {
  return (await page.context().cookies()).some((c) => c.name === COOKIE && c.value !== "");
}

async function sessionStatus(page: Page): Promise<number> {
  return (await page.request.get(SESSION_PATH)).status();
}

async function axeClean(page: Page, where: string) {
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

/** Signed in with one company, then removed from it: the session stays, the company list is empty. */
async function noCompanySession(page: Page, info: TestInfo, tag: string): Promise<string> {
  const { email, ids } = await person(info, tag, ["[Sàn Gỡ]"]);
  await signIn(page, email);
  await owner.query("delete from company_members where company_id = $1", [ids[0]]);
  await page.goto("/login");
  await expect(page.getByText(NO_COMPANY_SESSION, { exact: true })).toBeVisible();
  return email;
}

test("next-lach-may-chu", async ({ page }, info) => {
  const { email } = await person(info, "next-mc", ["[Sàn Next]"]);
  await signIn(page, email);
  for (const lach of ["%2F%09%2Fexample.com", "%2F%0A%2Fexample.com"]) {
    const res = await page.request.get(`/login?next=${lach}`, { maxRedirects: 0 });
    expect(res.status(), `máy chủ chuyển sang trang lạ: ${lach}`).toBeGreaterThanOrEqual(300);
    expect(res.status()).toBeLessThan(400);
    expect(res.headers()["location"], `máy chủ chuyển sang trang lạ: ${lach}`).toBe("/");
    await page.goto(`/login?next=${lach}`);
    await expect(page, `máy chủ chuyển sang trang lạ: ${lach}`).toHaveURL(/127\.0\.0\.1:\d+\/$/);
  }
  await page.goto("/login?next=%2Finventory");
  await expect(page).toHaveURL(/127\.0\.0\.1:\d+\/inventory$/);
});

test("next-lach-sau-go-ma", async ({ page }, info) => {
  const { email } = await person(info, "next-gm", ["[Sàn Next]"]);
  await page.goto("/login?next=%2F%09%2Fexample.com");
  await askCode(page, email);
  // Read the answer before the browser leaves the page: the body is gone once it navigates.
  let body: { next?: string } = {};
  await page.route(`**${SESSION_PATH}`, async (route) => {
    if (route.request().method() !== "POST") return route.continue();
    const res = await route.fetch();
    body = (await res.json()) as { next?: string };
    return route.fulfill({ response: res });
  });
  await typeCode(page, await codeFor(email));
  await expect(page).toHaveURL(/127\.0\.0\.1:\d+\/$/);
  await page.unroute(`**${SESSION_PATH}`);
  expect(body.next, "đường đổi mã trả đường lách").toBe("/");
  await expect(page).toHaveURL(/127\.0\.0\.1:\d+\/$/);

  const other = await person(info, "next-gm-ok", ["[Sàn Next]"]);
  await page.context().clearCookies();
  await page.goto("/login?next=%2Finventory");
  await askCode(page, other.email);
  await typeCode(page, await codeFor(other.email));
  await expect(page).toHaveURL(/127\.0\.0\.1:\d+\/inventory$/);
});

test("next-lach-chon-san", async ({ page }, info) => {
  const { email } = await person(info, "next-cs", ["[Sàn A]", "[Sàn B]"]);
  await page.goto("/login?next=%2F%09%2Fexample.com");
  await askCode(page, email);
  await typeCode(page, await codeFor(email));
  const choose = page.locator('[data-state="choose-company"]');
  await choose.getByRole("button", { name: "[Sàn A]" }).click();
  await expect(page, "chọn sàn rồi sang trang lạ").toHaveURL(/127\.0\.0\.1:\d+\/$/);

  const other = await person(info, "next-cs-ok", ["[Sàn A]", "[Sàn B]"]);
  await page.context().clearCookies();
  await page.goto("/login?next=%2Finventory");
  await askCode(page, other.email);
  await typeCode(page, await codeFor(other.email));
  await page
    .locator('[data-state="choose-company"]')
    .getByRole("button", { name: "[Sàn A]" })
    .click();
  await expect(page).toHaveURL(/127\.0\.0\.1:\d+\/inventory$/);
});

test("dang-xuat-mang-dut", async ({ page }, info) => {
  const { email } = await person(info, "xuat-mang", ["[Sàn Xuất]"]);
  await signIn(page, email);
  await page.route(`**${SESSION_PATH}`, (route) =>
    route.request().method() === "DELETE" ? route.abort("internetdisconnected") : route.continue(),
  );
  await recordVisits(page);
  await clickSignOutInMenu(page);
  await expect(page.getByText(SIGN_OUT_FAILED, { exact: true })).toBeVisible();
  await page.waitForTimeout(500);
  expect(await leftForLogin(page), "đăng xuất lỗi mà rời trang").toBe(false);
  await expect(page, "đăng xuất lỗi mà rời trang").toHaveURL(/127\.0\.0\.1:\d+\/$/);
  await shot(page, info, 4, "1440");
  await shot(page, info, 5, "360", true);
  expect(await sessions(email)).toBe(1);
  expect(await sessionStatus(page)).toBe(200);

  await page.unroute(`**${SESSION_PATH}`);
  await clickSignOutInMenu(page);
  await expect(page).toHaveURL(/\/login$/);
  expect(await sessions(email)).toBe(0);
});

test("dang-xuat-may-chu-loi", async ({ page }, info) => {
  const { email } = await person(info, "xuat-mc", ["[Sàn Xuất]"]);
  await signIn(page, email);
  await breakSignOut();
  try {
    await recordVisits(page);
    const answer = deleteResponse(page);
    await clickSignOutInMenu(page);
    const res = await answer;
    expect(res.status()).toBe(500);
    expect(clearsCookie(res), "máy chủ xoá cookie khi chưa xoá phiên").toBe(false);
    await expect(page.getByText(SIGN_OUT_FAILED, { exact: true })).toBeVisible();
    await page.waitForTimeout(500);
    expect(await leftForLogin(page), "đăng xuất lỗi mà rời trang").toBe(false);
    await expect(page, "đăng xuất lỗi mà rời trang").toHaveURL(/127\.0\.0\.1:\d+\/$/);
    expect(await hasCookie(page), "máy chủ xoá cookie khi chưa xoá phiên").toBe(true);
    expect(await sessions(email)).toBe(1);
    expect(await sessionStatus(page)).toBe(200);
  } finally {
    await mendSignOut();
  }
  await clickSignOutInMenu(page);
  await expect(page).toHaveURL(/\/login$/);
  expect(await sessions(email)).toBe(0);
});

test("dang-xuat-duoc", async ({ page, request }, info) => {
  const { email } = await person(info, "xuat-duoc", ["[Sàn Xuất]"]);
  await signIn(page, email);
  const token = (await page.context().cookies()).find((c) => c.name === COOKIE)!.value;
  await clickSignOutInMenu(page);
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.locator('[data-state="email"]')).toBeVisible();
  expect(await sessions(email)).toBe(0);
  const old = await request.get(SESSION_PATH, { headers: { cookie: `${COOKIE}=${token}` } });
  expect(old.status()).toBe(401);
});

test("het-san-co-loi-thoat", async ({ page, request }, info) => {
  const email = await noCompanySession(page, info, "het-san");
  await expect(page.locator('[data-state="choose-company"]')).toHaveCount(0);
  const leave = page.getByRole("button", { name: "Đăng xuất" });
  await expect(leave).toHaveCount(1);
  await shot(page, info, 1, "360");
  await shot(page, info, 2, "1440", true);
  expect(await sessions(email)).toBe(1);
  const token = (await page.context().cookies()).find((c) => c.name === COOKIE)!.value;
  await leave.click();
  await expect(page.locator('[data-state="email"]')).toBeVisible();
  expect(await sessions(email)).toBe(0);
  const old = await request.get(SESSION_PATH, { headers: { cookie: `${COOKIE}=${token}` } });
  expect(old.status()).toBe(401);
});

async function staysOnNoCompany(page: Page, email: string) {
  await expect(page.getByText(SIGN_OUT_FAILED, { exact: true })).toBeVisible();
  await expect(page.getByText(NO_COMPANY_SESSION, { exact: true })).toBeVisible();
  await expect(page.locator('[data-state="email"]')).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Đăng xuất" })).toBeEnabled();
  expect(await sessions(email)).toBe(1);
  const res = await page.request.get(SESSION_PATH);
  expect(res.status()).toBe(200);
  expect(((await res.json()) as { company: unknown }).company).toBeNull();
}

test("het-san-dang-xuat-loi", async ({ page }, info) => {
  const email = await noCompanySession(page, info, "het-san-mang");
  await page.route(`**${SESSION_PATH}`, (route) =>
    route.request().method() === "DELETE" ? route.abort("internetdisconnected") : route.continue(),
  );
  await page.getByRole("button", { name: "Đăng xuất" }).click();
  await staysOnNoCompany(page, email);
  await shot(page, info, 3, "414");
});

test("het-san-may-chu-loi", async ({ page }, info) => {
  const email = await noCompanySession(page, info, "het-san-mc");
  await breakSignOut();
  try {
    const answer = deleteResponse(page);
    await page.getByRole("button", { name: "Đăng xuất" }).click();
    const res = await answer;
    expect(res.status()).toBe(500);
    expect(clearsCookie(res), "máy chủ xoá cookie khi chưa xoá phiên").toBe(false);
    await staysOnNoCompany(page, email);
  } finally {
    await mendSignOut();
  }
});

test("axe-sang-toi-1m", async ({ page }, info) => {
  await noCompanySession(page, info, "het-san-axe");
  await axeClean(page, "no-company-session");
  if (info.project.name === "360") {
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(overflow, "cuộn ngang ở 360").toBe(false);
  }
  // While the request waits, the button is only disabled: same words, no spinner.
  let release: () => void = () => {};
  const held = new Promise<void>((resolve) => (release = resolve));
  await page.route(`**${SESSION_PATH}`, async (route) => {
    if (route.request().method() !== "DELETE") return route.continue();
    await held;
    return route.abort("internetdisconnected");
  });
  const leave = page.getByRole("button", { name: "Đăng xuất" });
  await leave.click();
  await expect(leave).toBeDisabled();
  await expect(leave).toHaveText("Đăng xuất");
  await expect(page.locator("[data-slot=spinner]")).toHaveCount(0);
  release();
  await expect(page.getByText(SIGN_OUT_FAILED, { exact: true })).toBeVisible();
  await axeClean(page, "sign-out-failed");
});
