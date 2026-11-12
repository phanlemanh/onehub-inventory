// Row 9e (bo-nut-theo-quyen), evals E7 and E8, on this lane's Postgres: the sidebar and the members screen follow the
// permission table, and a refused action (403) shows its own sentence.
//   thanh-ben-theo-bang · man-thanh-vien-theo-bang — four people with one role and one with two: the entry and the
//     screen show exactly when allowedScope(roles, listMembers) is not null.
//   thanh-ben-theo-o — visibleNav and the screen's gate on a copy of the table giving TeamLead listMembers; its break
//     (an entry naming a role instead of the action) turns red with «thanh-ben-theo-o: TeamLead».
//   tu-choi-403-cau-rieng — a company admin opens Invite, then Change roles; the role is taken away in the database;
//     pressing the dialog's button gets 403 and the dialog shows the refusal sentence, not the general error; closing it
//     refreshes the page and the sidebar entry goes. Four frames go to the round's evidence (E13).
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { type Page, type TestInfo } from "@playwright/test";
import pg from "pg";

import { DB_URL, OUTBOX } from "../../playwright.db.config";
import { FRAME_COPY } from "../../src/components/templates/frame-copy";
import { visibleNav, type NavItem } from "../../src/components/templates/nav-items";
import { ACTIONS, type ActionSpec, type Role } from "../../src/generated/ontology";
import {
  actionVisibility,
  allowedScope,
  type ActionName,
} from "../../src/modules/identity/permissions";
import { expect, test } from "../../tools/e2e_templates/fixture";
import { openSheet } from "../../tools/e2e_templates/settle";

const MEMBER = "Thành viên";
const INVITE = "Mời người";
const CHANGE = "Đổi vai";
const FORBIDDEN = "Không đủ quyền";
const REFUSED = FRAME_COPY.refusedAction;
const GENERAL_ERROR = "Máy chủ đang gặp lỗi";
const SHOTS = join("_acceptance", "bo-nut-theo-quyen", "evidence", "tu-choi-403");

let owner: pg.Client;
test.beforeAll(async () => {
  owner = new pg.Client({ connectionString: DB_URL });
  await owner.connect();
});
test.afterAll(async () => {
  await owner.end();
});

/** A company with one person per entry; every email is unique to this test and screen size. */
async function team(
  info: TestInfo,
  tag: string,
  people: Record<string, { roles: Role[] }>,
): Promise<Record<string, { email: string; id: string; name: string }>> {
  const stamp = `${tag}-${info.project.name}-${Date.now()}`;
  const company = (
    await owner.query<{ id: string }>("insert into companies (name) values ($1) returning id", [
      `[Sàn ${tag}]`,
    ])
  ).rows[0]!.id;
  const out: Record<string, { email: string; id: string; name: string }> = {};
  for (const [key, p] of Object.entries(people)) {
    const email = `${key.toLowerCase()}-${stamp}@example.test`;
    const name = `[Tên] ${key}`;
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
  return out;
}

function codes(email: string): string[] {
  if (!existsSync(OUTBOX)) return [];
  return readFileSync(OUTBOX, "utf8")
    .split("\n")
    .filter(Boolean)
    .map((l) => JSON.parse(l) as { email: string; text: string; kind?: string })
    .filter((m) => m.email === email && m.kind !== "invite")
    .map((m) => m.text);
}

async function signIn(page: Page, email: string, next = "/") {
  await page.context().clearCookies();
  const before = codes(email).length;
  await page.goto(`/login?next=${encodeURIComponent(next)}`);
  await expect(page.locator('[data-state="email"][data-ready]')).toBeVisible();
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Email").press("Enter");
  await expect(page.locator('[data-state="code"]')).toBeVisible();
  await expect.poll(() => codes(email).length, { timeout: 10_000 }).toBeGreaterThan(before);
  const code = codes(email)
    .at(-1)!
    .match(/\b\d{6}\b/)?.[0];
  if (!code) throw new Error(`thư tới ${email} không mang mã`);
  await page.getByLabel("Mã đăng nhập").fill(code);
  await page.getByLabel("Mã đăng nhập").press("Enter");
  await page.waitForURL((u) => u.pathname === next && u.search === "");
}

const mobile = (info: TestInfo) => Number(info.project.name) < 768;

/** The «Thành viên» entries of the sidebar; on a phone the sidebar sheet is opened first. */
async function navMembers(page: Page, info: TestInfo) {
  await expect(page.locator('[data-slot="account-menu"][data-ready]')).toBeVisible();
  if (mobile(info)) await openSheet(page);
  return page.getByRole("link", { name: MEMBER, exact: true });
}

async function closeSheet(page: Page, info: TestInfo) {
  if (mobile(info)) await page.keyboard.press("Escape");
}

async function frame(page: Page, info: TestInfo, name: string, scheme: "light" | "dark") {
  await page.emulateMedia({ colorScheme: scheme });
  await page.waitForTimeout(250);
  mkdirSync(SHOTS, { recursive: true });
  await page.screenshot({
    path: join(SHOTS, `${name}-${info.project.name}-${scheme === "light" ? "sang" : "toi"}.png`),
  });
  await page.emulateMedia({ colorScheme: "light" });
}

// ---- thanh-ben-theo-bang · man-thanh-vien-theo-bang ---------------------------------------------------------------

test("thanh-ben-theo-bang · man-thanh-vien-theo-bang", { tag: "@cho" }, async ({ page }, info) => {
  const sets: Record<string, Role[]> = {
    LA: ["ListAgent"],
    BA: ["BuyerAgent"],
    TL: ["TeamLead"],
    AD: ["CompanyAdmin"],
    HAI: ["ListAgent", "CompanyAdmin"],
  };
  const people = await team(
    info,
    "theo-bang",
    Object.fromEntries(Object.entries(sets).map(([k, roles]) => [k, { roles }])),
  );
  for (const [key, roles] of Object.entries(sets)) {
    const sees = allowedScope(roles, "listMembers") !== null;
    await signIn(page, people[key]!.email);
    await expect(await navMembers(page, info), `thanh-ben-theo-bang: ${key}`).toHaveCount(
      sees ? 1 : 0,
    );
    await closeSheet(page, info);
    await page.goto("/members");
    if (sees) await expect(page.locator('[data-state="ready"]'), key).toBeVisible();
    else
      await expect(
        page.getByRole("heading", { level: 1, name: FORBIDDEN }),
        `man-thanh-vien-theo-bang: ${key}`,
      ).toBeVisible();
  }
});

// ---- thanh-ben-theo-o -------------------------------------------------------------------------------------------

/** The members entry of the sidebar, as src/app/(app)/nav.ts declares it. */
function membersEntry(): NavItem {
  const text = readFileSync(join("src", "app", "(app)", "nav.ts"), "utf8");
  const line = text.split("\n").find((l) => l.includes('href: "/members"'));
  const action = line?.match(/action: "(\w+)"/)?.[1];
  const roles = line?.match(/roles: \[([^\]]*)\]/)?.[1];
  return {
    href: "/members",
    title: MEMBER,
    ...(action ? { action } : {}),
    ...(roles ? { roles: roles.split(",").map((r) => r.trim().replace(/"/g, "") as Role) } : {}),
  };
}

/** For each single role: the entry and the screen's gate agree with the given table. */
function followsCell(entry: NavItem, table: readonly ActionSpec[]): string[] {
  const failures: string[] = [];
  const permitted = (role: Role) => (action: string, mine: boolean) =>
    actionVisibility([role], action as ActionName, mine, table) === "show";
  for (const role of ["ListAgent", "BuyerAgent", "TeamLead", "CompanyAdmin"] as const) {
    const want = allowedScope([role], "listMembers", table) !== null;
    const shown = visibleNav([entry], [role], permitted(role)).length === 1;
    if (shown !== want) failures.push(`thanh-ben-theo-o: ${role}`);
  }
  return failures;
}

const withTeamLead: ActionSpec[] = ACTIONS.map((a) =>
  a.name === "listMembers" ? { ...a, scope: { ...a.scope, TeamLead: "company" as const } } : a,
);

test("thanh-ben-theo-o", async ({ page: _page }, info) => {
  test.skip(info.project.name !== "1440", "one run is enough: no browser here");
  const entry = membersEntry();
  expect(entry.action).toBe("listMembers");
  expect(entry.roles).toBeUndefined();
  expect(followsCell(entry, ACTIONS)).toEqual([]);
  expect(followsCell(entry, withTeamLead)).toEqual([]);
  expect(allowedScope(["TeamLead"], "listMembers", withTeamLead)).toBe("company");
  // Break: an entry naming the role instead of the action does not follow the changed cell.
  const hardCoded: NavItem = { href: "/members", title: MEMBER, roles: ["CompanyAdmin"] };
  expect(followsCell(hardCoded, withTeamLead)).toEqual(["thanh-ben-theo-o: TeamLead"]);
});

// ---- tu-choi-403-cau-rieng --------------------------------------------------------------------------------------

/** Takes the company admin role away from a person in the database, after their page has loaded. */
async function dropAdmin(userId: string) {
  await owner.query("update company_members set roles = array['ListAgent'] where user_id = $1", [
    userId,
  ]);
}

test("tu-choi-403-cau-rieng", { tag: "@cho" }, async ({ page }, info) => {
  const people = await team(info, "tu-choi", {
    P: { roles: ["CompanyAdmin"] },
    Q: { roles: ["CompanyAdmin"] },
    R: { roles: ["BuyerAgent"] },
  });
  const shoot = ["360", "1440"].includes(info.project.name);
  const refusals: number[] = [];
  page.on("response", (res) => {
    if (res.url().includes("/api/v1/members") && res.request().method() !== "GET")
      refusals.push(res.status());
  });

  // Invite.
  await signIn(page, people["P"]!.email);
  await page.goto("/members");
  await expect(page.locator('[data-state="ready"]')).toBeVisible();
  await page.getByRole("button", { name: INVITE }).click();
  const invite = page.locator('[data-slot="invite-dialog"]');
  await invite.getByLabel("Email").fill(`moi-${Date.now()}@example.test`);
  await invite.getByLabel("Tên trong sàn").fill("[Tên] Mới");
  await invite.getByRole("checkbox", { name: "Đầu chủ", exact: true }).check();
  await dropAdmin(people["P"]!.id);
  await invite.getByLabel("Tên trong sàn").press("Enter");
  await expect(invite.getByText(REFUSED)).toBeVisible();
  await expect(invite).not.toContainText(GENERAL_ERROR);
  // Nothing to try again after a refusal: only «Thôi» stays.
  await expect(invite.getByRole("button", { name: FRAME_COPY.retry })).toHaveCount(0);
  expect(refusals).toContain(403);
  if (shoot) {
    if (info.project.name === "360") await frame(page, info, "moi", "light");
    else await frame(page, info, "moi", "dark");
  }
  await page.keyboard.press("Escape");
  await expect(page.getByRole("heading", { level: 1, name: FORBIDDEN })).toBeVisible();
  await expect(await navMembers(page, info)).toHaveCount(0);
  await closeSheet(page, info);

  // Change roles.
  refusals.length = 0;
  await signIn(page, people["Q"]!.email);
  await page.goto("/members");
  await expect(page.locator('[data-state="ready"]')).toBeVisible();
  await page
    .locator(`li[data-member="${people["R"]!.email}"]`)
    .getByRole("button", { name: new RegExp(CHANGE) })
    .click();
  const roles = page.locator('[data-slot="roles-dialog"]');
  await roles.getByRole("checkbox", { name: "Trưởng nhóm", exact: true }).check();
  await dropAdmin(people["Q"]!.id);
  await roles.getByRole("button", { name: "Lưu" }).click();
  await expect(roles.getByText(REFUSED)).toBeVisible();
  await expect(roles).not.toContainText(GENERAL_ERROR);
  // Nothing to try again after a refusal: only «Thôi» stays.
  await expect(roles.getByRole("button", { name: FRAME_COPY.retry })).toHaveCount(0);
  expect(refusals).toContain(403);
  if (shoot) {
    if (info.project.name === "360") await frame(page, info, "doi-vai", "dark");
    else await frame(page, info, "doi-vai", "light");
  }
  await page.keyboard.press("Escape");
  await expect(page.getByRole("heading", { level: 1, name: FORBIDDEN })).toBeVisible();
  await expect(await navMembers(page, info)).toHaveCount(0);
});
