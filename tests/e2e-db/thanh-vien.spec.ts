// The members screen chosen from ReUI (row 9c, _acceptance/thanh-vien-chon-tu-reui/evals.yaml E1, E2, E5, E8, E14):
// the framed list of solution-users-8 and the dialog-2 invite dialog, on this lane's Postgres. Each measure is paired
// with the broken case it must catch, with a pinned message.
// State matrix written first (E8) — nine states, each checked for what the design's state table says it shows, then
// scanned by axe in light and dark: ST-members-loading, ST-members-error, ST-members-forbidden, ST-members-ready,
// ST-members-long, ST-invite-invalid, ST-invite-already, ST-invite-failed, ST-roles-last-admin.
import { existsSync, readFileSync } from "node:fs";

import AxeBuilder from "@axe-core/playwright";
import { type Locator, type Page, type TestInfo } from "@playwright/test";
import pg from "pg";

import { DB_URL, OUTBOX } from "../../playwright.db.config";
import { expect, test } from "../../tools/e2e_templates/fixture";

const AXE_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
const INVITE = "Mời người";
const CHANGE = "Đổi vai";
/** Role labels in register order (ontology/roles.yaml): the order of the invite dialog's checkboxes. */
const ROLE_LABELS = ["Đầu chủ", "Đầu khách", "Trưởng nhóm", "Quản trị sàn"] as const;
type Role = "ListAgent" | "BuyerAgent" | "TeamLead" | "CompanyAdmin";
const LABEL: Record<Role, string> = {
  ListAgent: "Đầu chủ",
  BuyerAgent: "Đầu khách",
  TeamLead: "Trưởng nhóm",
  CompanyAdmin: "Quản trị sàn",
};

let owner: pg.Client;
test.beforeAll(async () => {
  owner = new pg.Client({ connectionString: DB_URL });
  await owner.connect();
});
test.afterAll(async () => {
  await owner.end();
});

interface Person {
  key: string;
  name: string;
  roles: Role[];
}

/** The nine people of E1, written before the test runs: the admin invited everyone else. */
const NINE: Person[] = [
  { key: "qt", name: "[Tên] Quản trị", roles: ["CompanyAdmin", "TeamLead"] },
  { key: "tna", name: "[Tên] Trưởng nhóm A", roles: ["TeamLead", "ListAgent", "BuyerAgent"] },
  { key: "dc1", name: "[Tên] Đầu chủ 1", roles: ["ListAgent"] },
  { key: "dc2", name: "[Tên] Đầu chủ 2", roles: ["ListAgent", "BuyerAgent"] },
  { key: "dk1", name: "[Tên] Đầu khách 1", roles: ["BuyerAgent"] },
  { key: "dk2", name: "[Tên] Đầu khách 2", roles: ["BuyerAgent"] },
  { key: "dc3", name: "[Tên] Đầu chủ 3", roles: ["ListAgent"] },
  { key: "tnb", name: "[Tên] Trưởng nhóm B", roles: ["TeamLead", "ListAgent"] },
  { key: "dk3", name: "[Tên] Đầu khách 3", roles: ["BuyerAgent"] },
];

/** A company with these people; the first one invited the others. Emails are unique to this test and size. */
async function company(info: TestInfo, tag: string, people: Person[]) {
  const stamp = `${tag}-${info.project.name}-${Date.now()}`;
  const name = `[Sàn ${tag}]`;
  const id = (
    await owner.query<{ id: string }>("insert into companies (name) values ($1) returning id", [
      name,
    ])
  ).rows[0]!.id;
  const out: Record<string, { email: string; id: string; name: string; roles: Role[] }> = {};
  let first: string | null = null;
  for (const p of people) {
    const email = `${p.key}-${stamp}@example.test`;
    const user = (
      await owner.query<{ id: string }>(
        "insert into identity.users (email, name) values ($1, $2) returning id",
        [email, p.name],
      )
    ).rows[0]!.id;
    await owner.query(
      `insert into company_members (company_id, user_id, name, roles, invited_by, invited_at)
       values ($1, $2, $3, $4, $5, $6)`,
      [id, user, p.name, p.roles, first, first ? new Date(Date.UTC(2026, 10, 10, 3)) : null],
    );
    first ??= user;
    out[p.key] = { email, id: user, name: p.name, roles: p.roles };
  }
  return { id, name, people: out };
}

function lastCode(email: string): string | undefined {
  if (!existsSync(OUTBOX)) return undefined;
  const mail = readFileSync(OUTBOX, "utf8")
    .split("\n")
    .filter(Boolean)
    .map((l) => JSON.parse(l) as { email: string; text: string; kind?: string })
    .filter((m) => m.email === email && m.kind !== "invite")
    .at(-1);
  return mail?.text.match(/\b\d{6}\b/)?.[0];
}

async function signIn(page: Page, email: string, next = "/members") {
  await page.context().clearCookies();
  const before = lastCode(email);
  await page.goto(`/login?next=${encodeURIComponent(next)}`);
  await expect(page.locator('[data-state="email"][data-ready]')).toBeVisible();
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Email").press("Enter");
  await expect(page.locator('[data-state="code"]')).toBeVisible();
  await expect.poll(() => lastCode(email) !== undefined && lastCode(email) !== before).toBe(true);
  await page.getByLabel("Mã đăng nhập").fill(lastCode(email)!);
  await page.getByLabel("Mã đăng nhập").press("Enter");
  await page.waitForURL((u) => u.pathname === next);
}

async function openMembers(page: Page) {
  await page.goto("/members");
  await expect(page.locator('[data-state="ready"]')).toBeVisible();
}

async function axeClean(page: Page, where: string) {
  await expect(page.locator("[aria-busy=true]")).toHaveCount(0);
  await page.waitForTimeout(250);
  for (const colorScheme of ["light", "dark"] as const) {
    await page.emulateMedia({ colorScheme });
    const { violations } = await new AxeBuilder({ page })
      .withTags(AXE_TAGS)
      .exclude("nextjs-portal")
      .analyze();
    expect(
      violations
        .filter((v) => v.impact === "serious" || v.impact === "critical")
        .map((v) => `${where} ${colorScheme} ${v.id}`),
    ).toEqual([]);
  }
  await page.emulateMedia({ colorScheme: "light" });
}

const rows = (page: Page) => page.locator("[data-member]");

// ---- E1: the framed list --------------------------------------------------------------------------------------

/** Throws the pinned message when the rows on screen are not the company's people. */
function assertRows(onScreen: string[], expected: string[]): void {
  const a = [...onScreen].sort();
  const b = [...expected].sort();
  if (a.length !== b.length || a.some((x, i) => x !== b[i]))
    throw new Error(
      `member rows differ from the company: ${a.length} on screen, ${b.length} expected`,
    );
}

test("danh-sach-khung", async ({ page }, info) => {
  test.skip(info.project.name !== "1440", "the list's content is checked once, at 1440");
  const c = await company(info, "khung", NINE);
  await signIn(page, c.people["qt"]!.email);
  await openMembers(page);
  const frame = page.locator('[data-slot="members-frame"]');
  await expect(frame).toHaveCount(1);
  await expect(frame.getByText("Thành viên", { exact: true }).first()).toBeVisible();
  await expect(frame.getByText("9 người trong sàn")).toBeVisible();

  const emails = await rows(page).evaluateAll((els) =>
    els.map((e) => e.getAttribute("data-member")!),
  );
  const expected = Object.values(c.people).map((p) => p.email);
  expect(() => assertRows(emails, expected)).not.toThrow();
  // pha thu: one more person in the company than on screen is caught.
  expect(() => assertRows(emails, [...expected, "muoi@example.test"])).toThrow(
    "member rows differ from the company",
  );

  for (const p of Object.values(c.people)) {
    const r = page.locator(`[data-member="${p.email}"]`);
    await expect(r.locator('[data-slot="avatar"]')).toHaveCount(1);
    await expect(r).toContainText(p.name);
    await expect(r).toContainText(p.email);
    await expect(r.locator('[data-part="secondary"]')).toContainText("Người mời:");
    const badges = await r.locator('[data-part="tags"] [data-slot="badge"]').allInnerTexts();
    expect(badges.sort()).toEqual(p.roles.map((x) => LABEL[x]).sort());
    await expect(r.getByRole("button", { name: `${CHANGE} · ${p.name}` })).toBeVisible();
  }
  for (const role of ["searchbox", "tablist", "progressbar"] as const)
    await expect(page.getByRole(role)).toHaveCount(0);
  await expect(page.getByRole("button", { name: /Xuất/ })).toHaveCount(0);
});

// ---- E2: one column spine --------------------------------------------------------------------------------------

type Box = { x: number; y: number; w: number; h: number; shown: boolean };

async function parts(page: Page): Promise<Record<string, Box>[]> {
  return rows(page).evaluateAll((els) =>
    els.map((row) =>
      Object.fromEntries(
        ["main", "secondary", "tags", "control"].map((part) => {
          const el = row.querySelector<HTMLElement>(`[data-part="${part}"]`)!;
          const r = el.getBoundingClientRect();
          const shown = getComputedStyle(el).display !== "none" && r.width > 0;
          return [part, { x: r.x, y: r.y, w: r.width, h: r.height, shown }];
        }),
      ),
    ),
  );
}

/** Throws the pinned message when a part does not start at one x on every row. */
function assertSpine(all: Record<string, Box>[], names: string[]): void {
  for (const n of names) {
    const xs = all.map((r) => r[n]!.x);
    if (Math.max(...xs) - Math.min(...xs) > 1) throw new Error(`column spine broken: ${n}`);
  }
}

async function panelWidth(page: Page): Promise<number> {
  // The container query reads the content box of the list's panel: width less padding and border.
  return page.locator('[data-slot="members-frame"] [data-slot="frame-panel"]').evaluate((el) => {
    const cs = getComputedStyle(el);
    return el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
  });
}

/** The rule of the design: ≥ 896 four parts in line; 672–895 the inviter hides; < 672 the person on its own line. */
async function checkLayout(page: Page): Promise<void> {
  const width = await panelWidth(page);
  const all = await parts(page);
  if (width >= 896) {
    expect(all.every((r) => r["secondary"]!.shown)).toBe(true);
    assertSpine(all, ["main", "secondary", "tags", "control"]);
  } else if (width >= 672) {
    expect(all.some((r) => r["secondary"]!.shown)).toBe(false);
    assertSpine(all, ["main", "tags", "control"]);
  } else {
    for (const r of all) expect(r["main"]!.y + r["main"]!.h).toBeLessThanOrEqual(r["tags"]!.y + 1);
  }
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
}

/** Sets the window so the list's panel is `target` px wide, from the measured gap between the two. */
async function panelAt(page: Page, target: number): Promise<number> {
  const height = page.viewportSize()!.height;
  for (let i = 0; i < 4; i += 1) {
    const gap = page.viewportSize()!.width - (await panelWidth(page));
    await page.setViewportSize({ width: Math.round(target + gap), height });
    await page.waitForTimeout(150);
    if (Math.round(await panelWidth(page)) === target) break;
  }
  return Math.round(await panelWidth(page));
}

test("cot-thang-hang", async ({ page }, info) => {
  const long = `[Tên] ${"Rất dài ".repeat(14)}`.trim(); // 118 characters, under the 120 a member name may have
  const c = await company(info, "cot", [
    ...NINE.slice(0, 4),
    { key: "dai", name: long, roles: ["ListAgent"] },
  ]);
  await signIn(page, c.people["qt"]!.email);
  await openMembers(page);
  if (info.project.name === "1440") expect(await panelWidth(page)).toBeGreaterThanOrEqual(896);
  await checkLayout(page);

  const longName = page
    .locator(`[data-member="${c.people["dai"]!.email}"] [title="${long}"]`)
    .first();
  await expect(longName).toHaveCount(1);
  expect(await longName.evaluate((el) => el.scrollWidth > el.clientWidth)).toBe(true);

  if (info.project.name === "1440") {
    // The two widths either side of the inviter column's threshold.
    for (const w of [896, 895]) {
      expect(await panelAt(page, w)).toBe(w);
      await checkLayout(page);
    }
    // pha thu: one row moved 8 px breaks the spine.
    await page.setViewportSize({ width: 1440, height: 900 });
    await rows(page)
      .nth(1)
      .locator('[data-part="tags"]')
      .evaluate((el) => {
        el.style.marginLeft = "8px";
      });
    const all = await parts(page);
    expect(() => assertSpine(all, ["main", "secondary", "tags", "control"])).toThrow(
      /column spine broken: (secondary|tags)/,
    );
  }
});

// ---- E5 and E14: the invite dialog of dialog-2 ------------------------------------------------------------------

/** Throws the pinned message when the badge beside the title is not the company's name. */
function assertBadge(text: string, companyName: string): void {
  if (text.trim() !== companyName) throw new Error(`invite badge is not the company: ${text}`);
}

/** Throws the pinned message when the invited member's roles are not the ones checked. */
function assertRoles(written: string[], checked: string[]): void {
  if ([...written].sort().join() !== [...checked].sort().join())
    throw new Error(`invited member roles differ: ${written.join(",")}`);
}

test("hop-moi-dialog-2", async ({ page }, info) => {
  test.skip(info.project.name !== "1440", "the dialog's shape is checked once, at 1440");
  const c = await company(info, "moi", NINE.slice(0, 2));
  await signIn(page, c.people["qt"]!.email);
  await openMembers(page);
  await page.getByRole("button", { name: INVITE }).click();
  const dialog = page.locator('[data-slot="invite-dialog"]');
  await expect(dialog).toBeVisible();

  const title = dialog.getByRole("heading", { name: INVITE });
  const badge = dialog.locator('[data-slot="badge"]').first();
  expect(
    await title.evaluate((el) => el.parentElement === el.nextElementSibling?.parentElement),
  ).toBe(true);
  const [t, b] = [await title.boundingBox(), await badge.boundingBox()];
  expect(Math.abs(t!.y + t!.height / 2 - (b!.y + b!.height / 2))).toBeLessThan(6);
  const badgeText = await badge.innerText();
  expect(() => assertBadge(badgeText, c.name)).not.toThrow();
  expect(() => assertBadge(badgeText, "[Sàn khác]")).toThrow("invite badge is not the company");

  await expect(dialog.getByLabel("Email")).toBeVisible();
  await expect(dialog.getByLabel("Tên trong sàn")).toBeVisible();
  const boxes = await dialog.locator("fieldset label").allInnerTexts();
  expect(await dialog.getByRole("checkbox").count()).toBe(4);
  expect(boxes).toEqual([...ROLE_LABELS]);
  await expect(dialog.getByRole("button", { name: "Thôi" })).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Mời", exact: true })).toBeVisible();

  const email = `moi-moi-${Date.now()}@example.test`;
  await dialog.getByLabel("Email").fill(email);
  await dialog.getByLabel("Tên trong sàn").fill("[Tên] Mới mời");
  await dialog.getByRole("checkbox", { name: "Đầu chủ", exact: true }).check();
  await dialog.getByRole("checkbox", { name: "Trưởng nhóm", exact: true }).check();
  await dialog.getByRole("button", { name: "Mời", exact: true }).click();
  await expect(dialog).toBeHidden();
  await expect(page.getByText("Đã mời [Tên] Mới mời")).toBeVisible();
  await expect(page.locator(`[data-member="${email}"]`)).toContainText("[Tên] Mới mời");

  // E14: the member is in the company's table with the name and roles typed, invited by the signed-in admin.
  const written = (
    await owner.query<{ name: string; roles: string[]; invited_by: string }>(
      `select m.name, m.roles, m.invited_by from company_members m
         join identity.users u on u.id = m.user_id where m.company_id = $1 and u.email = $2`,
      [c.id, email],
    )
  ).rows;
  expect(written).toHaveLength(1);
  expect(written[0]!.name).toBe("[Tên] Mới mời");
  expect(written[0]!.invited_by).toBe(c.people["qt"]!.id);
  expect(() => assertRoles(written[0]!.roles, ["ListAgent", "TeamLead"])).not.toThrow();
  expect(() => assertRoles(written[0]!.roles, ["ListAgent", "TeamLead", "BuyerAgent"])).toThrow(
    "invited member roles differ",
  );
});

// ---- E8: the nine states ----------------------------------------------------------------------------------------

/** Throws the pinned message when a state lacks what the design's state table says it shows. */
async function checkState(
  name: string,
  where: Locator,
  shows: (string | { button: string })[],
): Promise<void> {
  for (const item of shows) {
    if (typeof item !== "string") {
      const n = await where
        .getByRole("button", { name: item.button })
        .filter({ visible: true })
        .count();
      if (n === 0) throw new Error(`state ${name} missing: ${item.button}`);
      continue;
    }
    const text = item;
    if ((await where.getByText(text, { exact: false }).filter({ visible: true }).count()) === 0)
      throw new Error(`state ${name} missing: ${text}`);
  }
}

test("chin-trang-thai", async ({ page }, info) => {
  test.skip(info.project.name !== "1440" && info.project.name !== "360", "states at 1440 and 360");
  const long = `[Tên] ${"Rất dài ".repeat(12)}`.trim();
  const c = await company(info, "tt", [
    { key: "qt", name: "[Tên] Quản trị", roles: ["CompanyAdmin"] },
    { key: "dai", name: long, roles: ["ListAgent", "BuyerAgent", "TeamLead"] },
    { key: "dc", name: "[Tên] Đầu chủ", roles: ["ListAgent"] },
  ]);
  const ran: string[] = [];
  const main = page.locator("main");
  await signIn(page, c.people["qt"]!.email);

  // ST-members-loading: the list request is held; the skeleton and «Mời người» are there.
  let release = () => {};
  const held = new Promise<void>((r) => (release = r));
  await page.route("**/api/v1/members", async (route) => {
    if (route.request().method() !== "GET") return route.fallback();
    await held;
    await route.fallback();
  });
  await page.goto("/members");
  await expect(page.locator('[data-state="loading"] [data-slot="page-skeleton"]')).toBeVisible();
  await checkState("ST-members-loading", main, [{ button: INVITE }]);
  await axeClean(page, "ST-members-loading");
  ran.push("ST-members-loading");
  release();
  await expect(page.locator('[data-state="ready"]')).toBeVisible();
  await page.unroute("**/api/v1/members");

  // ST-members-ready and ST-members-long.
  await checkState("ST-members-ready", main, ["Thành viên", "3 người trong sàn"]);
  await axeClean(page, "ST-members-ready");
  ran.push("ST-members-ready");
  const longName = page.locator(`[title="${long}"]`).first();
  expect(await longName.evaluate((el) => el.scrollWidth > el.clientWidth)).toBe(true);
  await axeClean(page, "ST-members-long");
  ran.push("ST-members-long");

  // ST-members-error, then retry; pha thu: the same state without «Thử lại» is caught.
  await page.route("**/api/v1/members", (route) =>
    route.request().method() === "GET"
      ? route.fulfill({ status: 500, body: "{}" })
      : route.fallback(),
  );
  await page.reload();
  await expect(page.locator('[data-slot="page-state"][data-kind="error"]')).toBeVisible();
  await checkState("ST-members-error", main, [{ button: "Thử lại" }]);
  await axeClean(page, "ST-members-error");
  ran.push("ST-members-error");
  await page.addStyleTag({
    content: '[data-slot="page-state"] button { display: none !important; }',
  });
  await expect(checkState("ST-members-error", main, [{ button: "Thử lại" }])).rejects.toThrow(
    "state ST-members-error missing: Thử lại",
  );
  await page.unroute("**/api/v1/members");
  await page.reload();
  await expect(page.locator('[data-state="ready"]')).toBeVisible();

  // The three invite errors.
  await page.getByRole("button", { name: INVITE }).click();
  const dialog = page.locator('[data-slot="invite-dialog"]');
  await dialog.getByRole("button", { name: "Mời", exact: true }).click();
  await checkState("ST-invite-invalid", dialog, [
    "Email chưa đúng khuôn, ví dụ ten@congty.vn.",
    "Gõ tên người này như sàn vẫn gọi.",
    "Chọn ít nhất một vai.",
  ]);
  await axeClean(page, "ST-invite-invalid");
  ran.push("ST-invite-invalid");
  await dialog.getByLabel("Email").fill(c.people["dc"]!.email);
  await dialog.getByLabel("Tên trong sàn").fill("[Tên] Trùng");
  await dialog.getByRole("checkbox", { name: "Đầu chủ", exact: true }).check();
  await dialog.getByRole("button", { name: "Mời", exact: true }).click();
  await expect(dialog.getByText("Email này đã ở trong sàn.")).toBeVisible();
  await checkState("ST-invite-already", dialog, ["Email này đã ở trong sàn."]);
  await axeClean(page, "ST-invite-already");
  ran.push("ST-invite-already");
  await page.route("**/api/v1/members", (route) =>
    route.request().method() === "POST"
      ? route.fulfill({ status: 500, body: "{}" })
      : route.fallback(),
  );
  await dialog.getByLabel("Email").fill("khac-tt@example.test");
  await dialog.getByRole("button", { name: "Mời", exact: true }).click();
  await expect(dialog.locator('[data-slot="form-error"]')).toBeVisible();
  await checkState("ST-invite-failed", dialog, ["Chưa lưu được.", { button: "Thử lại" }]);
  await axeClean(page, "ST-invite-failed");
  ran.push("ST-invite-failed");
  await page.unroute("**/api/v1/members");
  await page.keyboard.press("Escape");

  // ST-roles-last-admin: the only admin cannot drop the role.
  await page
    .locator(`[data-member="${c.people["qt"]!.email}"]`)
    .getByRole("button", { name: new RegExp(CHANGE) })
    .click();
  const roles = page.locator('[data-slot="roles-dialog"]');
  await roles.getByRole("checkbox", { name: "Đầu chủ", exact: true }).check();
  await roles.getByRole("checkbox", { name: "Quản trị sàn", exact: true }).uncheck();
  await roles.getByRole("button", { name: "Lưu" }).click();
  await expect(roles.getByText(/Mỗi sàn cần ít nhất một Quản trị sàn/)).toBeVisible();
  await checkState("ST-roles-last-admin", roles, [
    "Mỗi sàn cần ít nhất một Quản trị sàn. Gán vai này cho người khác trước.",
  ]);
  await axeClean(page, "ST-roles-last-admin");
  ran.push("ST-roles-last-admin");
  await page.keyboard.press("Escape");

  // ST-members-forbidden: a person without listMembers, with the way back to Today.
  await signIn(page, c.people["dc"]!.email, "/");
  await page.goto("/members");
  await expect(page.getByRole("heading", { level: 1, name: "Không đủ quyền" })).toBeVisible();
  await checkState("ST-members-forbidden", main, ["Không đủ quyền"]);
  await expect(main.getByRole("link", { name: "Về trang đầu" })).toHaveAttribute("href", "/");
  await axeClean(page, "ST-members-forbidden");
  ran.push("ST-members-forbidden");

  expect(ran).toHaveLength(9);
});
