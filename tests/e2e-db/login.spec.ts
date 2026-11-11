// Sign-in in the browser on this lane's Postgres (row 8, _acceptance/dang-nhap-ma-email/evals.yaml E7, E10, E12,
// E17, E18, E19). Codes are read from the dev server's outbox file — the same code the mail would carry.
// SHOTS_DIR=<dir> saves one frame per state for the evidence page (E18-step<n>.png).
// Break run of axe-sang-toi (2026-11-11): removing the email field's label turned it red with
// «email light label #login-email …»; it also caught a real contrast frame taken mid-transition, hence the wait.
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page, type TestInfo } from "@playwright/test";
import pg from "pg";

import { OUTBOX } from "../../playwright.db.config";

const DB_PORT = process.env["DB_PORT"] ?? "5563";
const DB_URL = `postgres://postgres:local-only@127.0.0.1:${DB_PORT}/dang_nhap_e2e`;
const AXE_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

let owner: pg.Client;
test.beforeAll(async () => {
  owner = new pg.Client({ connectionString: DB_URL });
  await owner.connect();
});
test.afterAll(async () => {
  await owner.end();
});

/** A person with their own email for this test and screen size, member of the given new companies. */
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
    .map((line) => JSON.parse(line) as { email: string; code: string })
    .filter((m) => m.email === email)
    .map((m) => m.code);
}

async function codeFor(email: string, count = 1): Promise<string> {
  await expect.poll(() => mailsTo(email).length, { timeout: 10_000 }).toBeGreaterThanOrEqual(count);
  return mailsTo(email).at(-1)!;
}

async function shot(page: Page, info: TestInfo, step: number, size: string) {
  const dir = process.env["SHOTS_DIR"];
  if (!dir || info.project.name !== size) return;
  mkdirSync(dir, { recursive: true });
  await page.screenshot({ path: join(dir, `E18-step${step}.png`), fullPage: true });
}

async function askCode(page: Page, email: string) {
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Email").press("Enter");
  await expect(page.locator('[data-state="code"]')).toBeVisible();
}

async function typeCode(page: Page, code: string) {
  const input = page.getByLabel("Mã đăng nhập");
  await input.fill(code);
  await input.press("Enter");
}

async function axeClean(page: Page, where: string) {
  // Wait until no button is busy: a frame caught mid-transition is not the state the person sees.
  await expect(page.locator("button[disabled] [data-slot=spinner], [aria-busy=true]")).toHaveCount(
    0,
  );
  await page.waitForTimeout(250);
  for (const colorScheme of ["light", "dark"] as const) {
    await page.emulateMedia({ colorScheme });
    const { violations } = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze();
    expect(
      violations.map(
        (v) =>
          `${where} ${colorScheme} ${v.id} ${v.nodes.map((n) => n.target.join(" ") + " " + (n.failureSummary ?? "").replace(/\s+/g, " ")).join(" | ")}`,
      ),
    ).toEqual([]);
  }
  await page.emulateMedia({ colorScheme: "light" });
}

test("mot-san-vao-thang", async ({ page }, info) => {
  const { email } = await person(info, "mot", ["[Sàn Một]"]);
  await page.goto("/login");
  const emailInput = page.getByLabel("Email");
  await expect(emailInput).toHaveAttribute("autocomplete", "email");
  await shot(page, info, 1, "1440");
  await askCode(page, email);
  const code = page.getByLabel("Mã đăng nhập");
  await expect(page.locator('input[name="code"]')).toHaveCount(1);
  await expect(code).toHaveAttribute("inputmode", "numeric");
  await expect(code).toHaveAttribute("autocomplete", "one-time-code");
  await expect(code).toBeFocused();
  await expect(page.getByText(`Nếu ${email} có tài khoản`)).toBeVisible();
  await shot(page, info, 2, "1440");
  for (const pasted of ["123 456", "123-456"]) {
    await code.fill("");
    await code.evaluate((el, text) => {
      const data = new DataTransfer();
      data.setData("text", text);
      el.dispatchEvent(
        new ClipboardEvent("paste", { clipboardData: data, bubbles: true, cancelable: true }),
      );
    }, pasted);
    await expect(code).toHaveValue("123456");
  }
  await typeCode(page, await codeFor(email));
  await expect(page).toHaveURL(/\/$/);
  await page.getByRole("button", { name: "Tài khoản" }).click();
  await expect(page.getByText("Đang làm ở [Sàn Một]", { exact: true })).toBeVisible();
  await expect(page.getByText("Đổi sàn")).toHaveCount(0);
});

test("nhieu-san-chon-va-doi", async ({ page }, info) => {
  const { email } = await person(info, "hai", ["[Sàn A]", "[Sàn B]"]);
  await person(info, "khac", ["[Sàn C]"]);
  await page.goto("/login");
  await askCode(page, email);
  await typeCode(page, await codeFor(email));
  const choose = page.locator('[data-state="choose-company"]');
  await expect(choose.getByRole("button")).toHaveCount(2);
  await expect(choose.getByRole("button", { name: "[Sàn A]" })).toBeVisible();
  await expect(choose.getByRole("button", { name: "[Sàn B]" })).toBeVisible();
  await expect(choose.getByText("[Sàn C]")).toHaveCount(0);
  if (info.project.name === "360") {
    await page.emulateMedia({ colorScheme: "dark" });
    await shot(page, info, 4, "360");
    await page.emulateMedia({ colorScheme: "light" });
  }
  await choose.getByRole("button", { name: "[Sàn A]" }).click();
  await expect(page).toHaveURL(/\/$/);
  await page.getByRole("button", { name: "Tài khoản" }).click();
  await expect(page.getByText("Đang làm ở [Sàn A]", { exact: true })).toBeVisible();
  await page.getByRole("menuitem", { name: "Đổi sàn" }).click();
  if (info.project.name === "1440") {
    await page.emulateMedia({ colorScheme: "dark" });
    await shot(page, info, 7, "1440");
    await page.emulateMedia({ colorScheme: "light" });
  }
  await page.getByRole("menuitemradio", { name: "[Sàn B]" }).click();
  await page.getByRole("button", { name: "Tài khoản" }).click();
  await expect(page.getByText("Đang làm ở [Sàn B]", { exact: true })).toBeVisible();
});

test("ma-sai-va-gui-lai", async ({ page }, info) => {
  const { email } = await person(info, "sai", ["[Sàn Sai]"]);
  await page.goto("/login");
  await askCode(page, email);
  const first = await codeFor(email);
  await typeCode(page, first === "000000" ? "111111" : "000000");
  const error = page.getByText("Mã không đúng hoặc đã hết hạn. Gõ lại, hoặc bấm «Gửi mã mới».");
  await expect(error).toBeVisible();
  await expect(page.getByLabel("Mã đăng nhập")).toHaveAttribute(
    "aria-describedby",
    "login-code-error",
  );
  await shot(page, info, 3, "360");
  await page.getByRole("button", { name: "Gửi mã mới" }).click();
  const second = await codeFor(email, 2);
  await typeCode(page, second);
  await expect(page).toHaveURL(/\/$/);
});

test("qua-gioi-han", async ({ page }, info) => {
  const { email } = await person(info, "gioi-han", ["[Sàn Giới Hạn]"]);
  for (let i = 0; i < 5; i++) {
    const res = await page.request.post("/api/v1/auth/code", { data: { email } });
    expect(res.status()).toBe(200);
  }
  await page.goto("/login");
  await page.getByLabel("Email").fill(email);
  await page.getByRole("button", { name: "Gửi mã" }).click();
  await expect(
    page.getByText("Đã xin mã quá nhiều lần. Thử lại sau 15 phút.", { exact: true }),
  ).toBeVisible();
  await shot(page, info, 5, "414");
});

test("chua-thuoc-san", async ({ page }, info) => {
  const { email, ids } = await person(info, "chua-san", ["[Sàn Gỡ]"]);
  await page.goto("/login");
  await askCode(page, email);
  const code = await codeFor(email);
  await owner.query("delete from company_members where company_id = $1", [ids[0]]);
  await typeCode(page, code);
  await expect(
    page.getByText("Tài khoản chưa thuộc sàn nào. Nhờ quản trị sàn mời bạn.", { exact: true }),
  ).toBeVisible();
  if (info.project.name === "1024") {
    await page.emulateMedia({ colorScheme: "dark" });
    await shot(page, info, 6, "1024");
  }
});

test("next-quay-ve-dung-trang", async ({ page }, info) => {
  const { email } = await person(info, "next", ["[Sàn Next]"]);
  await page.goto("/login?next=%2Finventory");
  await askCode(page, email);
  await typeCode(page, await codeFor(email));
  await expect(page).toHaveURL(/\/inventory$/);
  for (const outside of ["https://example.com", "//example.com"]) {
    const other = await person(info, "ngoai", ["[Sàn Ngoài]"]);
    await page.context().clearCookies();
    await page.goto(`/login?next=${encodeURIComponent(outside)}`);
    await askCode(page, other.email);
    await typeCode(page, await codeFor(other.email));
    await expect(page).toHaveURL(/127\.0\.0\.1:\d+\/$/);
  }
});

test("dang-xuat", async ({ page }, info) => {
  const { email } = await person(info, "xuat", ["[Sàn Xuất]"]);
  await page.goto("/login");
  await askCode(page, email);
  await typeCode(page, await codeFor(email));
  await expect(page).toHaveURL(/\/$/);
  await page.getByRole("button", { name: "Tài khoản" }).click();
  const menu = page.getByRole("menu");
  await expect(menu.getByText("[Tên]")).toBeVisible();
  await expect(menu.getByText(email)).toBeVisible();
  await expect(menu.getByText("Đang làm ở [Sàn Xuất]", { exact: true })).toBeVisible();
  await expect(menu.getByText("Đổi sàn")).toHaveCount(0);
  await menu.getByRole("menuitem", { name: "Đăng xuất" }).click();
  await expect(page).toHaveURL(/\/login$/);
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Đăng nhập" })).toBeVisible();
  await shot(page, info, 8, "360");
});

test("axe-sang-toi", async ({ page }, info) => {
  const one = await person(info, "axe-mot", ["[Sàn Axe]"]);
  const two = await person(info, "axe-hai", ["[Sàn X]", "[Sàn Y]"]);
  await page.goto("/login");
  await axeClean(page, "email");
  await askCode(page, one.email);
  await axeClean(page, "code");
  const code = await codeFor(one.email);
  await typeCode(page, code === "000000" ? "111111" : "000000");
  await expect(page.getByText("Mã không đúng hoặc đã hết hạn.", { exact: false })).toBeVisible();
  await axeClean(page, "code-invalid");
  await typeCode(page, code);
  await expect(page).toHaveURL(/\/$/);
  await page.getByRole("button", { name: "Tài khoản" }).click();
  await axeClean(page, "account-menu");
  await page.context().clearCookies();
  await page.goto("/login");
  await askCode(page, two.email);
  await typeCode(page, await codeFor(two.email));
  await expect(page.locator('[data-state="choose-company"]')).toBeVisible();
  await axeClean(page, "choose-company");
  await page.context().clearCookies();
  for (let i = 0; i < 5; i++)
    await page.request.post("/api/v1/auth/code", { data: { email: two.email } });
  await page.goto("/login");
  await page.getByLabel("Email").fill(two.email);
  await page.getByRole("button", { name: "Gửi mã" }).click();
  await expect(page.locator('[data-state="rate-limited"]')).toBeVisible();
  await axeClean(page, "rate-limited");
});
