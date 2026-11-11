// The members screen in the browser on this lane's Postgres (row 9, _acceptance/moi-nguoi-gan-vai/evals.yaml E7, E9,
// E13, E14). Each test makes its own company and people; codes and invitations are read from the dev server's
// outbox. SHOTS_DIR=<dir> saves one frame per state, and the eight frames E14 judges.
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page, type TestInfo } from "@playwright/test";
import pg from "pg";

import { DB_URL, OUTBOX } from "../../playwright.db.config";

const AXE_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
const MEMBER = "Thành viên";
const INVITE = "Mời người";
const CHANGE = "Đổi vai";
const FORBIDDEN = "Không đủ quyền";

let owner: pg.Client;
test.beforeAll(async () => {
  owner = new pg.Client({ connectionString: DB_URL });
  await owner.connect();
});
test.afterAll(async () => {
  await owner.end();
});

type Role = "ListAgent" | "BuyerAgent" | "TeamLead" | "CompanyAdmin";

/** A company with one person per entry; every email is unique to this test and screen size. */
async function team(
  info: TestInfo,
  tag: string,
  people: Record<string, { roles: Role[]; name?: string }>,
) {
  const stamp = `${tag}-${info.project.name}-${Date.now()}`;
  const company = (
    await owner.query<{ id: string }>("insert into companies (name) values ($1) returning id", [
      `[Sàn ${tag}]`,
    ])
  ).rows[0]!.id;
  const out: Record<string, { email: string; id: string; name: string }> = {};
  for (const [key, p] of Object.entries(people)) {
    const email = `${key.toLowerCase()}-${stamp}@example.test`;
    const name = p.name ?? `[Tên] ${key}`;
    const id = (
      await owner.query<{ id: string }>(
        "insert into identity.users (email, name) values ($1, $2) returning id",
        [email, name],
      )
    ).rows[0]!.id;
    await owner.query(
      "insert into company_members (company_id, user_id, name, roles) values ($1, $2, $3, $4)",
      [company, id, name, p.roles],
    );
    out[key] = { email, id, name };
  }
  return { company, people: out };
}

interface Mail {
  email: string;
  subject: string;
  text: string;
  kind?: string;
}

function mails(email: string): Mail[] {
  if (!existsSync(OUTBOX)) return [];
  return readFileSync(OUTBOX, "utf8")
    .split("\n")
    .filter(Boolean)
    .map((l) => JSON.parse(l) as Mail)
    .filter((m) => m.email === email);
}

async function codeFor(email: string, count: number): Promise<string> {
  const codes = () => mails(email).filter((m) => m.kind !== "invite");
  await expect.poll(() => codes().length, { timeout: 10_000 }).toBeGreaterThanOrEqual(count);
  const found =
    codes()
      .at(-1)!
      .text.match(/\b\d{6}\b/g) ?? [];
  if (found.length !== 1) throw new Error(`thư tới ${email} không mang đúng một mã`);
  return found[0]!;
}

/** Signs in through the real sign-in screen; lands where `next` says. */
async function signIn(page: Page, email: string, next = "/") {
  await page.context().clearCookies();
  const before = mails(email).filter((m) => m.kind !== "invite").length;
  await page.goto(`/login?next=${encodeURIComponent(next)}`);
  await expect(page.locator('[data-state="email"][data-ready]')).toBeVisible();
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Email").press("Enter");
  await expect(page.locator('[data-state="code"]')).toBeVisible();
  const code = page.getByLabel("Mã đăng nhập");
  await code.fill(await codeFor(email, before + 1));
  await code.press("Enter");
  await expect(page).toHaveURL(new RegExp(`${next.replace(/\//g, "\\/")}$`));
}

const mobile = (info: TestInfo) => Number(info.project.name) < 768;

/** The «Thành viên» entries of the sidebar; on a phone the sidebar sheet is opened first. */
async function navMembers(page: Page, info: TestInfo) {
  await expect(page.locator('[data-slot="account-menu"][data-ready]')).toBeVisible();
  if (mobile(info))
    await page.getByRole("button", { name: "Mở hoặc đóng thanh bên" }).first().click();
  return page.getByRole("link", { name: MEMBER, exact: true });
}

async function openMembers(page: Page) {
  await page.goto("/members");
  await expect(page.locator('[data-state="ready"]')).toBeVisible();
}

function row(page: Page, email: string) {
  return page.locator(`li[data-member="${email}"]`);
}

async function shot(page: Page, info: TestInfo, name: string, sizes: string[] = ["1440"]) {
  const dir = process.env["SHOTS_DIR"];
  if (!dir || !sizes.includes(info.project.name)) return;
  mkdirSync(dir, { recursive: true });
  await page.waitForTimeout(250);
  await page.screenshot({ path: join(dir, `${name}.png`), fullPage: true });
}

async function shotBoth(page: Page, info: TestInfo, name: string) {
  for (const scheme of ["light", "dark"] as const) {
    await page.emulateMedia({ colorScheme: scheme });
    await shot(page, info, `${name}-${info.project.name}-${scheme === "light" ? "sang" : "toi"}`, [
      "1440",
      "360",
    ]);
  }
  await page.emulateMedia({ colorScheme: "light" });
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

async function invite(page: Page, email: string, name: string, roles: string[]) {
  await page.getByRole("button", { name: INVITE }).click();
  const dialog = page.locator('[data-slot="invite-dialog"]');
  await expect(dialog).toBeVisible();
  await dialog.getByLabel("Email").fill(email);
  await dialog.getByLabel("Tên trong sàn").fill(name);
  for (const r of roles) await dialog.getByRole("checkbox", { name: r, exact: true }).check();
  return dialog;
}

test("moi-nguoi-va-dang-nhap", async ({ page }, info) => {
  const { people } = await team(info, "moi", { P: { roles: ["CompanyAdmin"] } });
  await signIn(page, people["P"]!.email);
  await expect(await navMembers(page, info)).toHaveCount(1);
  await openMembers(page);
  const email = `moi-${info.project.name}-${Date.now()}@example.test`;
  const dialog = await invite(page, email, "[Tên] Mới", ["Đầu chủ"]);
  await dialog.getByLabel("Tên trong sàn").press("Enter");
  await expect(dialog).toBeHidden();
  await expect(row(page, email)).toContainText("[Tên] Mới");
  await expect(row(page, email)).toContainText("Đầu chủ");
  await expect.poll(() => mails(email).filter((m) => m.kind === "invite").length).toBe(1);
  await signIn(page, email);
  await expect(await navMembers(page, info)).toHaveCount(0);
});

test("doi-vai-thanh-ben", async ({ page }, info) => {
  const { people } = await team(info, "doi", {
    P: { roles: ["CompanyAdmin"] },
    R: { roles: ["BuyerAgent"] },
  });
  await signIn(page, people["P"]!.email);
  await openMembers(page);
  const r = row(page, people["R"]!.email);
  await r.getByRole("button", { name: new RegExp(CHANGE) }).click();
  let dialog = page.locator('[data-slot="roles-dialog"]');
  await dialog.getByRole("checkbox", { name: "Quản trị sàn", exact: true }).check();
  await dialog.getByRole("button", { name: "Lưu" }).click();
  await expect(dialog).toBeHidden();
  await expect(r).toContainText("Quản trị sàn");

  await signIn(page, people["R"]!.email);
  await expect(await navMembers(page, info)).toHaveCount(1);

  await signIn(page, people["P"]!.email);
  await openMembers(page);
  await row(page, people["R"]!.email)
    .getByRole("button", { name: new RegExp(CHANGE) })
    .click();
  dialog = page.locator('[data-slot="roles-dialog"]');
  await dialog.getByRole("checkbox", { name: "Quản trị sàn", exact: true }).uncheck();
  await dialog.getByRole("button", { name: "Lưu" }).click();
  await expect(dialog).toBeHidden();

  await signIn(page, people["R"]!.email);
  await expect(await navMembers(page, info)).toHaveCount(0);

  // P is now the last admin: dropping the role is refused with the sentence of ST-roles-last-admin.
  await signIn(page, people["P"]!.email);
  await openMembers(page);
  await row(page, people["P"]!.email)
    .getByRole("button", { name: new RegExp(CHANGE) })
    .click();
  dialog = page.locator('[data-slot="roles-dialog"]');
  await dialog.getByRole("checkbox", { name: "Đầu chủ", exact: true }).check();
  await dialog.getByRole("checkbox", { name: "Quản trị sàn", exact: true }).uncheck();
  await dialog.getByRole("button", { name: "Lưu" }).click();
  await expect(
    dialog.getByText("Mỗi sàn cần ít nhất một Quản trị sàn. Gán vai này cho người khác trước."),
  ).toBeVisible();
  await shot(page, info, "ST-roles-last-admin");
});

test("khong-du-quyen", async ({ page }, info) => {
  const { people } = await team(info, "quyen", {
    P: { roles: ["CompanyAdmin"] },
    LA: { roles: ["ListAgent"] },
    R: { roles: ["BuyerAgent"] },
  });
  await page.context().clearCookies();
  await page.goto("/members");
  await expect(page).toHaveURL(/\/login\?next=%2Fmembers$/);

  await signIn(page, people["LA"]!.email);
  await expect(await navMembers(page, info)).toHaveCount(0);
  await page.goto("/members");
  await expect(page.getByRole("heading", { level: 1, name: FORBIDDEN })).toBeVisible();
  const text = await page.locator("main").innerText();
  for (const p of Object.values(people)) {
    expect(text).not.toContain(p.email);
    expect(text).not.toContain(p.name);
  }
  await shot(page, info, "ST-members-forbidden");

  await signIn(page, people["P"]!.email);
  await expect(await navMembers(page, info)).toHaveCount(1);
  await openMembers(page);
  await expect(page.locator("li[data-member]")).toHaveCount(3);
});

test("loi-va-thu-lai", async ({ page }, info) => {
  const long = `[Tên] ${"Rất dài ".repeat(12)}`.trim();
  const { people } = await team(info, "loi", {
    P: { roles: ["CompanyAdmin"] },
    L: { roles: ["ListAgent", "BuyerAgent", "TeamLead"], name: long },
  });
  await signIn(page, people["P"]!.email);

  // Loading: nothing under one second, then the skeleton.
  await page.route("**/api/v1/members", async (route) => {
    if (route.request().method() !== "GET") return route.fallback();
    await new Promise((r) => setTimeout(r, 1500));
    await route.fallback();
  });
  await page.goto("/members");
  await expect(page.locator('[data-state="loading"] [data-slot="page-skeleton"]')).toBeVisible();
  await shot(page, info, "ST-members-loading");
  await expect(page.locator('[data-state="ready"]')).toBeVisible();
  await page.unroute("**/api/v1/members");

  // Long names stay in the frame: no sideways scroll.
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(overflow).toBe(false);
  await expect(row(page, people["L"]!.email).locator("[title]").first()).toHaveAttribute(
    "title",
    long,
  );
  await shot(page, info, "ST-members-long");

  // Error, then retry.
  await page.route("**/api/v1/members", (route) =>
    route.request().method() === "GET"
      ? route.fulfill({ status: 500, body: "{}" })
      : route.fallback(),
  );
  await page.reload();
  await expect(page.locator('[data-slot="page-state"][data-kind="error"]')).toBeVisible();
  await shot(page, info, "ST-members-error");
  await page.unroute("**/api/v1/members");
  await page.getByRole("button", { name: "Thử lại" }).click();
  await expect(page.locator('[data-state="ready"]')).toBeVisible();

  // Invalid fields, already a member, a failed send that keeps what was typed.
  await page.getByRole("button", { name: INVITE }).click();
  const dialog = page.locator('[data-slot="invite-dialog"]');
  await dialog.getByRole("button", { name: "Mời", exact: true }).click();
  await expect(dialog.getByText("Email chưa đúng khuôn, ví dụ ten@congty.vn.")).toBeVisible();
  await expect(dialog.getByText("Gõ tên người này như sàn vẫn gọi.")).toBeVisible();
  await expect(dialog.getByText("Chọn ít nhất một vai.")).toBeVisible();
  await shot(page, info, "ST-invite-invalid");
  await dialog.getByLabel("Email").fill(people["L"]!.email);
  await dialog.getByLabel("Tên trong sàn").fill("[Tên] Trùng");
  await dialog.getByRole("checkbox", { name: "Đầu chủ", exact: true }).check();
  await dialog.getByRole("button", { name: "Mời", exact: true }).click();
  await expect(dialog.getByText("Email này đã ở trong sàn.")).toBeVisible();
  await shot(page, info, "ST-invite-already");
  await page.route("**/api/v1/members", (route) =>
    route.request().method() === "POST"
      ? route.fulfill({ status: 500, body: "{}" })
      : route.fallback(),
  );
  await dialog.getByLabel("Email").fill("khac@example.test");
  await dialog.getByRole("button", { name: "Mời", exact: true }).click();
  await expect(dialog.locator('[data-slot="form-error"]')).toContainText("Chưa lưu được.");
  await expect(dialog.getByLabel("Email")).toHaveValue("khac@example.test");
  await expect(dialog.getByLabel("Tên trong sàn")).toHaveValue("[Tên] Trùng");
  await expect(dialog.getByRole("button", { name: "Thử lại" })).toBeVisible();
  await shot(page, info, "ST-invite-failed");
});

test("ban-phim-hop-thoai", async ({ page }, info) => {
  const { people } = await team(info, "phim", { P: { roles: ["CompanyAdmin"] } });
  await signIn(page, people["P"]!.email);
  await openMembers(page);
  const trigger = page.getByRole("button", { name: INVITE });
  await trigger.focus();
  await page.keyboard.press("Enter");
  const dialog = page.locator('[data-slot="invite-dialog"]');
  await expect(dialog).toBeVisible();
  // Four role boxes in register order.
  const labels = await dialog.locator('[data-slot="field-label"]').allInnerTexts();
  expect(
    labels.filter((l) =>
      ["Đầu chủ", "Đầu khách", "Trưởng nhóm", "Quản trị sàn"].includes(l.trim()),
    ),
  ).toEqual(["Đầu chủ", "Đầu khách", "Trưởng nhóm", "Quản trị sàn"]);
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  await trigger.press("Enter");
  const email = `phim-${info.project.name}-${Date.now()}@example.test`;
  await dialog.getByLabel("Email").fill(email);
  await dialog.getByLabel("Tên trong sàn").fill("[Tên] Phím");
  await dialog.getByRole("checkbox", { name: "Trưởng nhóm", exact: true }).focus();
  await page.keyboard.press("Space");
  await dialog.getByLabel("Tên trong sàn").press("Enter");
  await expect(dialog).toBeHidden();
  await expect(row(page, email)).toContainText("Trưởng nhóm");
});

test("axe-sang-toi", async ({ page }, info) => {
  const { people } = await team(info, "axe", {
    P: { roles: ["CompanyAdmin"] },
    R: { roles: ["BuyerAgent", "TeamLead"] },
    LA: { roles: ["ListAgent"] },
  });
  await signIn(page, people["P"]!.email);
  await openMembers(page);
  await axeClean(page, "ready");
  await shotBoth(page, info, "members-ready");
  await shot(page, info, "ST-members-ready");
  await page.getByRole("button", { name: INVITE }).click();
  const dialog = page.locator('[data-slot="invite-dialog"]');
  await expect(dialog).toBeVisible();
  await axeClean(page, "invite-open");
  await shotBoth(page, info, "members-invite-open");
  await dialog.getByRole("button", { name: "Mời", exact: true }).click();
  await expect(dialog.getByText("Chọn ít nhất một vai.")).toBeVisible();
  await axeClean(page, "invite-invalid");
  await page.keyboard.press("Escape");
  await row(page, people["R"]!.email)
    .getByRole("button", { name: new RegExp(CHANGE) })
    .click();
  await expect(page.locator('[data-slot="roles-dialog"]')).toBeVisible();
  await axeClean(page, "roles-open");
  await page.keyboard.press("Escape");
  await signIn(page, people["LA"]!.email, "/");
  await page.goto("/members");
  await expect(page.getByRole("heading", { level: 1, name: FORBIDDEN })).toBeVisible();
  await axeClean(page, "forbidden");
});
