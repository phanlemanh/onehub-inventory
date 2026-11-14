// Row 2d (bang-hang-theo-dia-ly), evals E4, E7, E8, E9, E11, E12 on this lane's Postgres: a signed-in ListAgent goes the
// inventory by place from the App Shell's second column.
//   E4 four places — a project, a complex, a building in it, a building straight under its project: the footer reads the
//     count written ahead and the place is the one lit entry. Break: an unlit place → «nut khong sang: <nơi>».
//   E7 both ways — typing in the building box after a complex unlights the tree; typing «S1.02» whole lights S1.02;
//     «Xoá lọc» lights «Tất cả hàng». Each step compares the grid's rows with the lit place's. Break: «cay lech bang».
//   E8 other filters — with status Active on, a building keeps the status filter; all 10 places still show. Breaks:
//     «mat loc khac», «noi bien mat: <nơi>».
//   E9 address — reload, a copied link in a new session, a saved view reopened; an unknown place opens as usual. Break:
//     «dia chi mat noi».
//   E11 phone and width — at 414 and 360 the sheet closes on a pick; at 1024 and 1440 project names show whole. Break:
//     «ten bi cat: <dự án>».
//   E12 axe and keyboard — 1440 and 360, light and dark: no serious violation; Tab reaches S1.01 and Enter opens it.
//     Break: «khong toi duoc bang phim».
import { existsSync, readFileSync } from "node:fs";

import AxeBuilder from "@axe-core/playwright";
import { type Locator, type Page, type TestInfo } from "@playwright/test";
import pg from "pg";

import { DB_URL, OUTBOX } from "../../playwright.db.config";
import { FRAME_COPY } from "../../src/components/templates/frame-copy";
import { label } from "../../src/modules/company-config";
import { SAMPLE_SUBDIVISIONS, sampleUnits, subdivisionNameOf } from "../../src/modules/catalog";
import { SAMPLE_COMPANY, buildSampleListings } from "../../src/modules/listings";
import { geoTree, type GeoNode } from "../../src/modules/listings/ui/geo-tree";
import { inventoryRows } from "../../src/modules/listings/ui/inventory-rows";
import { expect, test } from "../../tools/e2e_templates/fixture";
import { openSheet } from "../../tools/e2e_templates/settle";

const ALL = `${FRAME_COPY.secondColumn.all} ${label("Listing").toLocaleLowerCase("vi")}`;
// The same rows and catalog the screen reads, built here without the screen's own files (they pull in React).
const UNITS = sampleUnits().map((u) => ({ ...u, subdivisionName: subdivisionNameOf(u) }));
const ROWS = inventoryRows({
  ...buildSampleListings({ companyId: SAMPLE_COMPANY.id, units: UNITS }),
  units: UNITS,
});
const TREE = geoTree(
  ROWS,
  SAMPLE_SUBDIVISIONS.flatMap((s) =>
    s.buildings.map((b) => ({ project: s.name, complex: s.complex?.name, building: b.name })),
  ),
);
const P1 = "Vinhomes Ocean Park 1";
const P2 = "Vinhomes Ocean Park 2 – The Empire";
const P3 = "Vinhomes Ocean Park 3 – The Crown";
/** The 10 places written ahead (E8), and the four of E4 with their counts. */
const TEN = [
  P1,
  "The Sapphire 1",
  "S1.01",
  "S1.02",
  "S1.03",
  "S1.05",
  P2,
  "[MAU] Toà E1",
  P3,
  "[MAU] Toà C1",
];
const FOUR: [string, string, number][] = [
  [P1, FRAME_COPY.secondColumn.all, 36],
  [P1, "The Sapphire 1", 36],
  [P1, "S1.03", 10],
  [P2, "[MAU] Toà E1", 12],
];

let owner: pg.Client;
test.beforeAll(async () => {
  owner = new pg.Client({ connectionString: DB_URL });
  await owner.connect();
});
test.afterAll(async () => {
  await owner.end();
});

// ---- people and sign-in ---------------------------------------------------------------------------------------------

async function person(info: TestInfo, tag: string): Promise<string> {
  const stamp = `${tag}-${info.project.name}-${Date.now()}`;
  const company = (
    await owner.query<{ id: string }>("insert into companies (name) values ($1) returning id", [
      `[Công ty ${tag}]`,
    ])
  ).rows[0]!.id;
  const email = `dl-${stamp}@example.test`;
  const id = (
    await owner.query<{ id: string }>(
      "insert into identity.users (email, name) values ($1, $2) returning id",
      [email, "[Tên] DL"],
    )
  ).rows[0]!.id;
  await owner.query(
    "insert into company_members (company_id, user_id, name, roles) values ($1, $2, $3, $4)",
    [company, id, "[Tên] DL", ["ListAgent"]],
  );
  return email;
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

async function signIn(page: Page, email: string, next = "/inventory") {
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
  await page.waitForURL((u) => u.pathname === new URL(next, "http://x").pathname);
  await settled(page);
}

// ---- the screen as a person sees it ---------------------------------------------------------------------------------

const region = (page: Page) => page.locator('[data-slot="data-region"]');
const column = (page: Page) => page.locator('[data-slot="app-shell-second-column"]');
const group = (scope: Locator, title: string) =>
  scope.locator('[data-sidebar="group"]').filter({
    has: scope
      .page()
      .locator('[data-sidebar="group-label"]', { hasText: new RegExp(`^${esc(title)}$`) }),
  });
const place = (scope: Locator, project: string, name: string) =>
  group(scope, project).getByRole("link", { name, exact: true });
const esc = (t: string) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

async function settled(page: Page) {
  await expect(page.locator('[hidden][id^="S:"]')).toHaveCount(0);
  await expect(region(page).locator('table[data-slot="data-grid-table"]')).toBeVisible();
}

/** The footer's «x / 60 dòng», or 60 when nothing is filtered. */
async function footerCount(page: Page): Promise<number> {
  const text = (await region(page).textContent()) ?? "";
  const m = /(\d+) \/ 60 dòng/.exec(text);
  return m ? Number(m[1]) : 60;
}

/** Names of the lit entries of the second column. */
async function litNames(scope: Locator): Promise<string[]> {
  return (await scope.locator('a[aria-current="true"]').allTextContents()).map((t) => t.trim());
}

/** Exactly one entry lit and it is `name`; throws naming the place otherwise. */
function checkLit(lit: readonly string[], name: string): void {
  if (lit.length !== 1 || lit[0] !== name) throw new Error(`nut khong sang: ${name}`);
}

const flat = (nodes: readonly GeoNode[]): GeoNode[] =>
  nodes.flatMap((n) => [n, ...flat(n.children)]);
const nodeOf = (name: string) => flat(TREE).find((n) => n.name === name)!;

/** The buildings of the rows the grid draws now (the virtual body draws those in view). */
async function drawnBuildings(page: Page): Promise<string[]> {
  return region(page)
    .locator('tbody tr[data-row-id] td[data-col-id="Listing.buildingName"]')
    .allTextContents();
}

/** The grid shows the lit place's rows only; throws when the tree and the grid differ. */
async function checkSame(page: Page, lit: GeoNode | null): Promise<void> {
  const count = await footerCount(page);
  if (!lit) return;
  const buildings = new Set(
    flat([lit])
      .filter((n) => n.kind === "building")
      .map((n) => n.name),
  );
  const drawn = await drawnBuildings(page);
  if (count !== lit.count || drawn.some((b) => !buildings.has(b.trim())))
    throw new Error("cay lech bang");
}

const atWidth = (info: TestInfo, ...widths: string[]) =>
  test.skip(!widths.includes(info.project.name));

// ---- E4 ------------------------------------------------------------------------------------------------------------

test("E4 four places: count and the one lit entry", async ({ page }, info) => {
  atWidth(info, "1440");
  await signIn(page, await person(info, "e4"));
  expect(FOUR).toHaveLength(4);
  checkLit(await litNames(column(page)), ALL);
  for (const [project, name, count] of FOUR) {
    await place(column(page), project, name).click();
    await expect.poll(() => footerCount(page)).toBe(count);
    await expect(place(column(page), project, name)).toHaveAttribute("aria-current", "true");
    checkLit(await litNames(column(page)), name);
  }
  expect(() => checkLit([], "S1.03")).toThrow("nut khong sang: S1.03");
});

// ---- E7 ------------------------------------------------------------------------------------------------------------

test("E7 the tree follows the filter boxes", async ({ page }, info) => {
  atWidth(info, "1440");
  await signIn(page, await person(info, "e7"));
  await place(column(page), P1, "The Sapphire 1").click();
  await expect.poll(() => footerCount(page)).toBe(36);
  await checkSame(page, nodeOf("The Sapphire 1"));
  const box = region(page).getByLabel("Lọc cột Toà");
  await box.fill("S1.01, S1.02, S1.03, S1.05x");
  // No place lights: the address drops `vung`, so only «Tất cả hàng» stays lit.
  await expect.poll(() => litNames(column(page))).toEqual([ALL]);
  await box.fill("S1.02");
  await expect.poll(() => litNames(column(page))).toEqual(["S1.02"]);
  await checkSame(page, nodeOf("S1.02"));
  await region(page).getByRole("button", { name: "Xoá lọc" }).first().click();
  await expect.poll(() => litNames(column(page))).toEqual([ALL]);
  expect(await footerCount(page)).toBe(60);
  // Break: a tree that does not hear the boxes would still light S1.02 over 60 rows.
  await expect(checkSame(page, nodeOf("S1.02"))).rejects.toThrow("cay lech bang");
});

// ---- E8 ------------------------------------------------------------------------------------------------------------

test("E8 a place keeps the other filters", async ({ page }, info) => {
  atWidth(info, "1440");
  await signIn(page, await person(info, "e8"));
  // Wait for the page to come alive: a press before then follows the link as a plain address.
  await page.goto("/inventory?status=Active", { waitUntil: "networkidle" });
  await settled(page);
  const want = ROWS.filter(
    (r) => r["Listing.standardStatus"] === "Active" && r["Listing.buildingName"] === "S1.03",
  ).length;
  await place(column(page), P1, "S1.03").click();
  await expect.poll(() => footerCount(page)).toBe(want);
  // The status box itself, read on the screen after the pick (Hỏi-2): still «Đang bán».
  checkKept(await statusBox(page).textContent());
  expect(() => checkKept("Chọn")).toThrow("mat loc khac");
  // Every place of the matrix still shows: projects as their group, the others as an entry of the column.
  for (const name of TEN) {
    const n =
      name === P1 || name === P2 || name === P3
        ? await group(column(page), name).count()
        : await column(page).getByRole("link", { name, exact: true }).count();
    if (n === 0) throw new Error(`noi bien mat: ${name}`);
  }
  expect(TEN).toHaveLength(10);
});

const ACTIVE = label("StatusActive");
const statusBox = (page: Page) =>
  region(page).locator('th[data-col-id="Listing.standardStatus"] [data-slot="column-filter"]');

/** The status box still holds «Đang bán» after a place is picked; throws when the pick dropped it. */
function checkKept(text: string | null): void {
  if (!(text ?? "").includes(ACTIVE)) throw new Error("mat loc khac");
}

// ---- Ngoài-7 ---------------------------------------------------------------------------------------------------------

/** «Tất cả hàng» shows every row with no place lit; throws when the place survived the press. */
function checkAllRows(count: number, lit: readonly string[]): void {
  if (count !== 60 || lit.length !== 1 || lit[0] !== ALL)
    throw new Error("tat ca hang con loc noi");
}

test("«Tất cả hàng» after a pick drops the place; a status entry keeps its own filter", async ({
  page,
}, info) => {
  atWidth(info, "1440");
  await signIn(page, await person(info, "tat-ca"));
  await page.goto("/inventory", { waitUntil: "networkidle" });
  await settled(page);
  await place(column(page), P1, "S1.03").click();
  await expect.poll(() => footerCount(page)).toBe(10);
  await column(page).getByRole("link", { name: ALL, exact: true }).click();
  await expect.poll(() => footerCount(page)).toBe(60);
  checkAllRows(await footerCount(page), await litNames(column(page)));
  expect(new URL(page.url()).searchParams.has("vung")).toBe(false);
  expect(await region(page).getByLabel("Lọc cột Toà").inputValue()).toBe("");

  await page.goto("/inventory?status=Active", { waitUntil: "networkidle" });
  await settled(page);
  const active = ROWS.filter((r) => r["Listing.standardStatus"] === "Active").length;
  await place(column(page), P1, "S1.03").click();
  await expect.poll(() => litNames(column(page))).toEqual(["S1.03"]);
  await column(page).getByRole("link", { name: ACTIVE, exact: true }).click();
  await expect.poll(() => footerCount(page)).toBe(active);
  await expect.poll(() => litNames(column(page))).toEqual([ACTIVE]);
  expect(new URL(page.url()).searchParams.has("vung")).toBe(false);
  checkKept(await statusBox(page).textContent());
  // Break: the grid still on the place after the press.
  expect(() => checkAllRows(10, ["S1.03"])).toThrow("tat ca hang con loc noi");
});

// ---- E9 ------------------------------------------------------------------------------------------------------------

test("E9 reload, a copied link, a saved view, an unknown place", async ({
  page,
  browser,
}, info) => {
  atWidth(info, "1440");
  const email = await person(info, "e9");
  await signIn(page, email);
  await place(column(page), P1, "The Sapphire 1").click();
  await expect
    .poll(() => new URL(page.url()).searchParams.get("vung"))
    .toBe(nodeOf("The Sapphire 1").key);
  const link = page.url();
  await page.reload();
  await settled(page);
  if ((await footerCount(page)) !== 36) throw new Error("dia chi mat noi");
  checkLit(await litNames(column(page)), "The Sapphire 1");

  const other = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const fresh = await other.newPage();
  await signIn(fresh, email, link.replace(/^https?:\/\/[^/]+/, ""));
  expect(await footerCount(fresh)).toBe(36);
  checkLit(await litNames(column(fresh)), "The Sapphire 1");
  await other.close();

  await region(page)
    .getByRole("button", { name: label("SaveView") })
    .click();
  const dialog = page.locator('[data-slot="view-name-dialog"]');
  await dialog.getByLabel("Tên").fill("Sapphire");
  await dialog.getByLabel("Tên").press("Enter");
  await page.waitForURL((u) => u.searchParams.has("goc-nhin"));
  await column(page).getByRole("link", { name: ALL }).click();
  await expect.poll(() => footerCount(page)).toBe(60);
  await column(page)
    .getByRole("link", { name: /^Sapphire/ })
    .click();
  await expect.poll(() => footerCount(page)).toBe(36);
  expect(await region(page).getByLabel("Lọc cột Toà").inputValue()).toBe(
    "S1.01, S1.02, S1.03, S1.05",
  );
  // The box keeps the whole names and reads them whole on hover (AC-3, revised after the scope gate).
  await expect(region(page).getByLabel("Lọc cột Toà")).toHaveAttribute(
    "title",
    "S1.01, S1.02, S1.03, S1.05",
  );
  await expect(region(page).getByLabel("Lọc cột Dự án")).toHaveAttribute("title", P1);
  checkLit(await litNames(column(page)), "Sapphire");

  await page.goto("/inventory?vung=khong-co");
  await settled(page);
  expect(await footerCount(page)).toBe(60);
  checkLit(await litNames(column(page)), ALL);
  expect(() => checkLit([ALL], "The Sapphire 1")).toThrow("nut khong sang");
});

// ---- E11 -----------------------------------------------------------------------------------------------------------

test("E11 phone sheet closes on a pick", { tag: "@cho" }, async ({ page }, info) => {
  atWidth(info, "360", "414");
  await signIn(page, await person(info, "e11"));
  await openSheet(page);
  const sheet = page.locator('[data-mobile="true"]');
  const labels = await sheet.locator('[data-sidebar="group-label"]').allTextContents();
  expect(labels.indexOf(P1)).toBeGreaterThan(labels.indexOf(FRAME_COPY.secondColumn.byStatus));
  await place(sheet, P2, "[MAU] Toà E1").click();
  await expect(sheet).toBeHidden();
  await expect.poll(() => footerCount(page)).toBe(12);
});

/** Project names drawn whole; throws naming the first one cut. */
async function checkWhole(scope: Locator): Promise<void> {
  for (const p of [P1, P2, P3]) {
    const cut = await scope
      .locator('[data-sidebar="group-label"]', { hasText: new RegExp(`^${esc(p)}$`) })
      .evaluate((el) => el.scrollWidth > el.clientWidth + 1);
    if (cut) throw new Error(`ten bi cat: ${p}`);
  }
}

test("E11 project names show whole at 1024 and 1440", async ({ page }, info) => {
  atWidth(info, "1024", "1440");
  await signIn(page, await person(info, "e11w"));
  await checkWhole(column(page));
  // Break: a copy of the column 120px wide cuts the names.
  await column(page).evaluate((el) => {
    el.style.width = "120px";
    el.querySelectorAll<HTMLElement>('[data-sidebar="group-label"]').forEach((l) => {
      l.style.whiteSpace = "nowrap";
      l.style.overflow = "hidden";
    });
  });
  await expect(checkWhole(column(page))).rejects.toThrow(/ten bi cat: /);
});

// ---- E12 -----------------------------------------------------------------------------------------------------------

async function seriousViolations(page: Page): Promise<string[]> {
  const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
  return violations
    .filter((v) => v.impact === "serious" || v.impact === "critical")
    .map((v) => `${v.id}: ${v.nodes.length}`);
}

test("E12 axe at 1440, light and dark", async ({ page }, info) => {
  atWidth(info, "1440");
  await signIn(page, await person(info, "e12"));
  await place(column(page), P1, "The Sapphire 1").click();
  for (const scheme of ["light", "dark"] as const) {
    await page.emulateMedia({ colorScheme: scheme });
    await expect(page).toHaveTitle(/\S/);
    expect(await seriousViolations(page), scheme).toEqual([]);
  }
});

test("E12 axe on the phone sheet, light and dark", { tag: "@cho" }, async ({ page }, info) => {
  atWidth(info, "360");
  await signIn(page, await person(info, "e12-ngan"));
  await openSheet(page);
  for (const scheme of ["light", "dark"] as const) {
    await page.emulateMedia({ colorScheme: scheme });
    await expect(page).toHaveTitle(/\S/);
    expect(await seriousViolations(page), scheme).toEqual([]);
  }
});

/** Tab from the column's first entry until S1.01 has focus; throws when it never does. */
async function tabTo(page: Page, name: string, presses = 40): Promise<void> {
  await column(page).getByRole("link", { name: ALL }).focus();
  for (let i = 0; i < presses; i++) {
    if ((await page.evaluate(() => document.activeElement?.textContent?.trim())) === name) return;
    await page.keyboard.press("Tab");
  }
  throw new Error("khong toi duoc bang phim");
}

test("E12 keyboard: Tab reaches S1.01, Enter opens it", async ({ page }, info) => {
  atWidth(info, "1440");
  await signIn(page, await person(info, "e12k"));
  await tabTo(page, "S1.01");
  await page.keyboard.press("Enter");
  await expect.poll(() => footerCount(page)).toBe(6);
  await expect(place(column(page), P1, "S1.01")).toHaveAttribute("aria-current", "true");
  // Break: a name no entry carries is never reached.
  await expect(tabTo(page, "[MAU] Không có", 5)).rejects.toThrow("khong toi duoc bang phim");
});
