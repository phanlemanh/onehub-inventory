// Row 10 (bang-hang-du-lieu-that) in the browser on this lane's Postgres: the inventory of the signed-in company, read and
// changed for real. Each test makes its own companies from the sample ([MAU], a small [MAU-2], an empty [MAU-TRONG]) with
// «[Tên]» people. Evals E3, E4b, E5b, E6b, E7, E8, E9b, E10b.
import { existsSync, mkdirSync, readFileSync } from "node:fs";

import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Browser, type Page, type TestInfo } from "@playwright/test";
import pg from "pg";

import { DB_URL, OUTBOX } from "../../playwright.db.config";
import { sampleInventoryData } from "../../src/app/(app)/inventory-sample-data";
import { GRID_COPY } from "../../src/components/candidate/grid-copy";
import { statusLabel } from "../../src/lib/format";
import { label } from "../../src/modules/company-config";
import { companyListingId, seedSampleInventory } from "../db/can-mau";
import { cardCodes, isPhone, phoneCards, regionReady } from "../e2e/phone-list";
import { chupAnh, pageReady, suaTrang } from "../e2e/sua-trang";

let owner: pg.Client;
test.beforeAll(async () => {
  owner = new pg.Client({ connectionString: DB_URL });
  await owner.connect();
});
test.afterAll(async () => {
  await owner.end();
});

const DATA = sampleInventoryData();
const UNIT_OF = new Map(
  DATA.listingUnits.map((x) => [x.listingId, DATA.units.find((u) => u.upi === x.upi)!]),
);
/** A current sample listing by its keeper and a status from which Active is a move. */
function sampleRow(keeper: "viewer" | "other" | "none", statuses = ["Incomplete", "Hold"]) {
  const l = DATA.current.find((x) => {
    const k = DATA.keepers[x.id];
    const kind = k?.kind ?? "none";
    // A listing with a price: a price set where there was none cannot be undone (row 4).
    return kind === keeper && statuses.includes(x.standardStatus) && (x.listPrice ?? 0) > 0;
  });
  if (!l) throw new Error(`không có căn mẫu ${keeper}`);
  return { id: l.id, unit: UNIT_OF.get(l.id)!.unitNumber, keeper: DATA.keepers[l.id] };
}

// ---- people, companies, sign-in -------------------------------------------------------------------------------------

interface Company {
  id: string;
  name: string;
}

async function company(name: string): Promise<Company> {
  const id = (
    await owner.query<{ id: string }>("insert into companies (name) values ($1) returning id", [
      name,
    ])
  ).rows[0]!.id;
  return { id, name };
}

async function member(c: Company, email: string, name: string, roles: string[]): Promise<string> {
  const id = (
    await owner.query<{ id: string }>(
      "insert into identity.users (email, name) values ($1, $2) on conflict (email) do update set name = excluded.name returning id",
      [email, name],
    )
  ).rows[0]!.id;
  await owner.query(
    "insert into company_members (company_id, user_id, name, roles) values ($1, $2, $3, $4)",
    [c.id, id, name, roles],
  );
  return id;
}

/** [MAU] with the whole sample, [MAU-2] with three of its listings, [MAU-TRONG] with none; one person in all three. */
async function world(info: TestInfo, tag: string, roles: string[] = ["ListAgent"]) {
  const stamp = `${tag}-${info.project.name}-${Date.now()}`;
  const mau = await company(`[MAU ${stamp}]`);
  const mau2 = await company(`[MAU-2 ${stamp}]`);
  const trong = await company(`[MAU-TRONG ${stamp}]`);
  const email = `bht-${stamp}@example.test`;
  const name = `[Tên] ${tag}`;
  const id = await member(mau, email, name, roles);
  await member(mau2, email, name, roles);
  await member(trong, email, name, roles);
  await seedSampleInventory(owner, mau.id, { id, name });
  await seedSampleInventory(owner, mau2.id, { id, name });
  // [MAU-2] keeps three current listings, all in one project, so its tree is small and its rows differ from [MAU]'s.
  const keep = DATA.current.slice(0, 3).map((l) => companyListingId(mau2.id, l.id));
  await owner.query(
    "delete from listing_units where company_id = $1 and not (listing_id = any($2::uuid[]))",
    [mau2.id, keep],
  );
  await owner.query("delete from listings where company_id = $1 and not (id = any($2::uuid[]))", [
    mau2.id,
    keep,
  ]);
  return { email, id, name, mau, mau2, trong };
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

async function signIn(page: Page, email: string, into: Company) {
  await page.context().clearCookies();
  const before = codes(email).length;
  await page.goto("/login");
  await expect(page.locator('[data-state="email"][data-ready]')).toBeVisible();
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Email").press("Enter");
  await expect(page.locator('[data-state="code"]')).toBeVisible();
  await expect.poll(() => codes(email).length, { timeout: 10_000 }).toBe(before + 1);
  const code = page.getByLabel("Mã đăng nhập");
  await code.fill(codes(email).at(-1)!);
  await code.press("Enter");
  const choose = page.locator('[data-state="choose-company"]');
  await expect(choose.or(page.locator('[data-slot="account-menu"][data-ready]'))).toBeVisible();
  if (await choose.isVisible()) await choose.getByRole("button", { name: into.name }).click();
  await expect(page.locator('[data-slot="company-name"]')).toContainText(into.name);
}

// ---- the screen ---------------------------------------------------------------------------------------------------

const PRICE = "Listing.listPrice";
const STATUS = "Listing.standardStatus";
const FEE = "Listing.feeInclusion";

async function openInventory(page: Page, path = "/inventory") {
  await page.goto(path);
  // A search address that finds one unit moves on to its record's address (row 3f) before the page settles.
  await page.waitForLoadState("networkidle");
  await expect(page.locator('[hidden][id^="S:"]')).toHaveCount(0);
  await regionReady(page);
  await pageReady(page);
}

/** The unit codes the region has drawn: the record openers of the table, or the cards below 768 px. */
async function shownCodes(page: Page): Promise<string[]> {
  if (isPhone(page)) {
    await phoneCards(page).first().waitFor();
    return cardCodes(page);
  }
  await page.locator('[data-slot="data-region-body"] tbody tr[data-row-id]').first().waitFor();
  return page
    .locator('[data-slot="data-region-body"] button[data-record-open]')
    .evaluateAll((els) => els.map((e) => (e.textContent ?? "").trim()));
}

/** How many listings the region holds, from its footer («60 dòng»); the table draws only the rows in view. */
async function rowCount(page: Page): Promise<number> {
  const text =
    (await page.locator('[data-slot="region-footer-count"]').first().textContent()) ?? "";
  const n = text.match(/(\d[\d.]*)\s*\S*\s*$/)?.[1] ?? text.match(/\d+/)?.[0] ?? "";
  return Number(n.replace(/\./g, ""));
}

/**
 * The grid filtered to one unit, as the top-bar search opens it (row 3f): one unit found opens its record, which is
 * closed so the one row is on screen whatever its place in the grid's order.
 */
async function openOn(page: Page, unit: string) {
  await openInventory(page, `/inventory?unit=${encodeURIComponent(unit)}`);
  // A code shared by two buildings finds both and opens no record; the rows are on screen either way.
  const record = page.locator('[data-slot="record-panel"]');
  if (
    await record.waitFor({ timeout: 3_000 }).then(
      () => true,
      () => false,
    )
  ) {
    await page.keyboard.press("Escape");
    await expect(record).toHaveCount(0);
  }
}

const cellOf = (page: Page, unit: string, field: string) =>
  page
    .locator('[data-slot="data-region-body"] tbody tr[data-row-id]')
    .filter({ has: page.locator("button[data-record-open]", { hasText: new RegExp(`^${unit}$`) }) })
    .locator(`td[data-col-id="${field}"]`)
    .first();
const editor = (page: Page) => page.locator('[data-slot="cell-editor"]');

async function select(page: Page, unit: string, field: string) {
  const cell = cellOf(page, unit, field);
  await cell.scrollIntoViewIfNeeded();
  await cell.click({ position: { x: 3, y: 3 } });
  await expect(cell).toHaveAttribute("data-cell-focused", /.*/);
}

async function typePrice(page: Page, unit: string, text: string) {
  await select(page, unit, PRICE);
  await page.keyboard.type(text.slice(0, 1));
  await expect(editor(page).getByRole("textbox")).toBeFocused();
  await page.keyboard.type(text.slice(1));
  await page.keyboard.press("Enter");
  // A big change asks once more under the cell (row 4): «Đổi giá» confirms it.
  const ask = page.locator('[data-slot="price-ask"]');
  await ask.waitFor({ timeout: 1_500 }).catch(() => {});
  if (await ask.isVisible()) await editor(page).getByRole("button", { name: "Đổi giá" }).click();
}

async function statusOptions(page: Page, unit: string): Promise<string[]> {
  await select(page, unit, STATUS);
  await page.keyboard.press("F2");
  await editor(page).locator("[data-status-option]").first().waitFor();
  const out = await editor(page)
    .locator("[data-status-option]")
    .evaluateAll((els) => els.map((e) => e.getAttribute("data-status-option") ?? ""));
  await page.keyboard.press("Escape");
  return out;
}

const patches = (page: Page) => {
  const seen: { url: string; body: unknown }[] = [];
  page.on("request", (r) => {
    if (r.method() === "PATCH" && r.url().includes("/api/v1/listings/"))
      seen.push({ url: r.url(), body: r.postDataJSON() });
  });
  return seen;
};

const rowOf = async (id: string) =>
  (
    await owner.query<{
      standard_status: string;
      list_price: string;
      fee_inclusion: string;
      version: number;
    }>("select standard_status, list_price, fee_inclusion, version from listings where id = $1", [
      id,
    ])
  ).rows[0]!;

const wide = (info: TestInfo) => Number(info.project.name) >= 768;

// ---- E2, E3 · the company's own rows, the search and the tree -------------------------------------------------------

test("doc-dung-san: the grid shows the signed-in company's listings, and only the new company's after a switch", async ({
  page,
}, info) => {
  const w = await world(info, "doc");
  await signIn(page, w.email, w.mau);
  await openInventory(page);
  expect(await rowCount(page)).toBe(60);
  // Switch the company in the App Shell (row 1o): the grid holds the three listings of [MAU-2].
  await page.locator('[data-slot="app-shell-top-bar"] [data-slot="company-name"]').click();
  await page.getByRole("menuitemradio", { name: w.mau2.name }).click();
  await expect(page.locator('[data-slot="company-name"]')).toContainText(w.mau2.name);
  await openInventory(page);
  const codes2 = await shownCodes(page);
  expect(codes2.sort()).toEqual(
    DATA.current
      .slice(0, 3)
      .map((l) => UNIT_OF.get(l.id)!.unitNumber)
      .sort(),
  );
});

test("cmdk-va-cay-theo-san: the search and the tree show only the signed-in company's places", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "1440", "do o 1440");
  const w = await world(info, "cay");
  await signIn(page, w.email, w.mau2);
  await openInventory(page);
  const mine = DATA.current.slice(0, 3).map((l) => UNIT_OF.get(l.id)!);
  const others = DATA.current.slice(3).map((l) => UNIT_OF.get(l.id)!);
  const otherBuilding = others.find((u) => !mine.some((m) => m.buildingName === u.buildingName))!;
  // The tree: links of the second column are the three listings' places; no building of [MAU] alone shows.
  const column = page.locator('[data-slot="app-shell-second-column"]');
  await expect(
    column.getByRole("link", { name: mine[0]!.buildingName, exact: true }),
  ).toBeVisible();
  await expect(
    column.getByRole("link", { name: otherBuilding.buildingName, exact: true }),
  ).toHaveCount(0);
  // No count rides on a tree entry (row 2d): no badge in the column.
  await expect(column.locator('[data-sidebar="menu-badge"]')).toHaveCount(0);
  // The search: a code of [MAU] that [MAU-2] does not have finds nothing.
  const other = others.find((u) => !mine.some((m) => m.unitNumber === u.unitNumber))!;
  await page.keyboard.press("ControlOrMeta+k");
  const palette = page.locator('[data-slot="unit-jump-palette"]');
  await palette.getByRole("combobox").fill(other.unitNumber);
  await expect(palette.getByRole("option", { name: new RegExp(other.unitNumber) })).toHaveCount(0);
  await palette.getByRole("combobox").fill(mine[0]!.unitNumber);
  await expect(palette.getByRole("option").first()).toBeVisible();
});

test("chuot-giua-the-moi: a middle click on a tree entry opens a new tab and leaves this one where it was", async ({
  page,
  context,
}, info) => {
  test.skip(info.project.name !== "1440", "do o 1440");
  const w = await world(info, "giua");
  await signIn(page, w.email, w.mau2);
  await openInventory(page);
  const before = page.url();
  const building = UNIT_OF.get(DATA.current[0]!.id)!.buildingName;
  const opened = context.waitForEvent("page");
  await page
    .locator('[data-slot="app-shell-second-column"]')
    .getByRole("link", { name: building, exact: true })
    .click({ button: "middle" });
  const tab = await opened;
  await tab.waitForLoadState();
  // The new tab opens the entry's own address: the grid filtered to that building; this tab stays where it was.
  const opens = new URL(tab.url());
  expect(opens.pathname).toBe("/inventory");
  expect(opens.searchParams.get("place") ?? "").toContain(building);
  expect(page.url()).toBe(before);
});

// ---- E4b, E5b · price saved for real, Active by keeper -------------------------------------------------------------

test("sua-gia-tai-lai-con: «2,8 tỷ» on the cell is one PATCH; a reload and a second session read it back", async ({
  page,
  browser,
}, info) => {
  test.skip(!wide(info), "ô sửa từ 768 px");
  const w = await world(info, "gia");
  const row = sampleRow("viewer", ["Incomplete", "Active", "Hold", "Pending"]);
  const sent = patches(page);
  await signIn(page, w.email, w.mau);
  await openOn(page, row.unit);
  const id = companyListingId(w.mau.id, row.id);
  const before = await rowOf(id);
  await typePrice(page, row.unit, "2,8 tỷ");
  await expect.poll(async () => Number((await rowOf(id)).list_price)).toBe(2_800_000_000);
  expect(sent).toHaveLength(1);
  expect(sent[0]!.body).toMatchObject({ version: before.version, change: { field: "listPrice" } });
  expect((await rowOf(id)).version).toBe(before.version + 1);
  await openOn(page, row.unit);
  await expect(cellOf(page, row.unit, PRICE)).toContainText("2,8");
  const second = await (browser as Browser).newPage();
  await signIn(second, w.email, w.mau);
  await openOn(second, row.unit);
  await expect(cellOf(second, row.unit, PRICE)).toContainText("2,8");
  await second.close();
});

test("dang-ban-chi-nguoi-giu: Active is offered on one's own unit and on an unkept one, never on someone else's", async ({
  page,
}, info) => {
  test.skip(!wide(info), "ô sửa từ 768 px");
  const w = await world(info, "giu");
  await signIn(page, w.email, w.mau);
  await openInventory(page);
  expect(await statusOptions(page, sampleRow("other").unit)).not.toContain("Active");
  expect(await statusOptions(page, sampleRow("viewer").unit)).toContain("Active");
  expect(await statusOptions(page, sampleRow("none").unit)).toContain("Active");
  // The record names the keeper of someone else's unit, and says nobody keeps an unkept one.
  const other = sampleRow("other");
  await page.goto(`/inventory?record=${companyListingId(w.mau.id, other.id)}`);
  await expect(page.locator('[data-slot="ask-list-agent"]')).toContainText(
    other.keeper?.kind === "other" ? other.keeper.name : "",
  );
  const none = sampleRow("none");
  await page.goto(`/inventory?record=${companyListingId(w.mau.id, none.id)}`);
  await expect(page.locator('[data-slot="ask-list-agent"]')).toBeDisabled();
});

// ---- E6b · conflict at the cell, undo of the price only ------------------------------------------------------------

test("xung-dot-tai-o: the second session gets the conflict at the cell and sees the latest price", async ({
  page,
  browser,
}, info) => {
  test.skip(!wide(info), "ô sửa từ 768 px");
  const w = await world(info, "xung");
  const row = sampleRow("viewer", ["Active"]);
  const id = companyListingId(w.mau.id, row.id);
  await signIn(page, w.email, w.mau);
  await openOn(page, row.unit);
  const second = await (browser as Browser).newPage({ viewport: page.viewportSize()! });
  await signIn(second, w.email, w.mau);
  await openOn(second, row.unit);
  await typePrice(page, row.unit, "2,8 tỷ");
  await expect.poll(async () => Number((await rowOf(id)).list_price)).toBe(2_800_000_000);
  // The second session still holds the old version: its status change is a conflict, not an overwrite.
  await select(second, row.unit, STATUS);
  await second.keyboard.press("F2");
  await editor(second).locator('[data-status-option="Hold"]').click();
  await expect(second.locator("[data-sonner-toast]").first()).toBeVisible();
  await expect(cellOf(second, row.unit, PRICE)).toContainText("2,8");
  expect((await rowOf(id)).standard_status).toBe("Active");
  await second.close();
});

test("hoan-tac-chi-gia: undoing the price after a status change keeps the new status", async ({
  page,
}, info) => {
  test.skip(!wide(info), "ô sửa từ 768 px");
  const w = await world(info, "hoan");
  const row = sampleRow("viewer", ["Active"]);
  const id = companyListingId(w.mau.id, row.id);
  const sent = patches(page);
  await signIn(page, w.email, w.mau);
  await openOn(page, row.unit);
  const oldPrice = Number((await rowOf(id)).list_price);
  await typePrice(page, row.unit, "2,8 tỷ");
  const priceToast = page
    .locator("[data-sonner-toast]")
    .filter({ hasText: label("ListPrice") })
    .first();
  // The person changes the status while the price's notice is still on screen, then undoes the price from it; the
  // database is read only once both are done, so the notice is still there to press.
  await expect(priceToast).toBeVisible();
  await select(page, row.unit, STATUS);
  await page.keyboard.press("F2");
  await editor(page).locator('[data-status-option="Hold"]').click();
  await expect(
    page
      .locator("[data-sonner-toast]")
      .filter({ hasText: statusLabel("Hold") })
      .first(),
  ).toBeVisible();
  // The notices stack, the older one under the newer: reach its «Hoàn tác» with the keyboard, as the notice allows.
  const undoPrice = priceToast.getByRole("button", { name: "Hoàn tác" });
  await undoPrice.focus();
  await page.keyboard.press("Enter");
  await expect.poll(async () => (await rowOf(id)).standard_status).toBe("Hold");
  await expect.poll(async () => Number((await rowOf(id)).list_price)).toBe(oldPrice);
  const undo = sent.at(-1)!.body as { version: number; change: { field: string } };
  expect(undo).toMatchObject({ version: 3, change: { field: "listPrice" } });
  const after = await rowOf(id);
  if (after.standard_status !== "Hold") throw new Error("hoan-tac-chi-gia: trạng thái cũ");
  await expect(cellOf(page, row.unit, STATUS)).toContainText(statusLabel("Hold"));
});

test("hoan-tac-chi-gia: đối chứng — undoing the status change brings the status back", async ({
  page,
}, info) => {
  test.skip(!wide(info), "ô sửa từ 768 px");
  const w = await world(info, "hoan-dc");
  const row = sampleRow("viewer", ["Active"]);
  const id = companyListingId(w.mau.id, row.id);
  await signIn(page, w.email, w.mau);
  await openOn(page, row.unit);
  await select(page, row.unit, STATUS);
  await page.keyboard.press("F2");
  await editor(page).locator('[data-status-option="Hold"]').click();
  const statusToast = page
    .locator("[data-sonner-toast]")
    .filter({ hasText: statusLabel("Hold") })
    .first();
  await expect(statusToast).toBeVisible();
  await expect.poll(async () => (await rowOf(id)).standard_status).toBe("Hold");
  await statusToast.getByRole("button", { name: "Hoàn tác" }).click();
  await expect.poll(async () => (await rowOf(id)).standard_status).toBe("Active");
});

// ---- E7 · fee inclusion on its cell ----------------------------------------------------------------------------------

test("dieu-kien-phi-tren-o: Bao phí → Không bao phí is saved, the net to seller changes, a reload keeps it", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "1440", "do o 1440");
  const w = await world(info, "phi");
  const l = DATA.current.find(
    (x) => x.feeInclusion === "Included" && x.listPrice && x.standardStatus !== "Closed",
  )!;
  const unit = UNIT_OF.get(l.id)!.unitNumber;
  const id = companyListingId(w.mau.id, l.id);
  await signIn(page, w.email, w.mau);
  await openInventory(page);
  await page
    .locator('[data-slot="data-region"]')
    .first()
    .getByRole("button", { name: "Cột", exact: true })
    .click();
  await page.getByRole("menuitemcheckbox", { name: label("FeeInclusion") }).click();
  await page.keyboard.press("Escape");
  const net = cellOf(page, unit, "custom.netToSeller");
  const netBefore = (await net.innerText()).trim();
  await select(page, unit, FEE);
  await page.keyboard.press("F2");
  await editor(page).locator('[data-fee-option="Excluded"]').click();
  await expect.poll(async () => (await rowOf(id)).fee_inclusion).toBe("Excluded");
  // Không bao phí: the seller nets the whole list price (netToSeller), so the cell reads the price of the row.
  const price = (await cellOf(page, unit, PRICE).innerText()).trim();
  expect(netBefore).not.toBe(price);
  await expect.poll(async () => (await net.innerText()).trim()).toBe(price);
  await openInventory(page);
  expect((await rowOf(id)).fee_inclusion).toBe("Excluded");
});

/**
 * Shows the Điều kiện phí column, focuses that cell of the unit and presses F2; returns how many fee options the
 * editor offers (0 when no editor opens). The same steps for every role, so a role that may edit is the control.
 */
async function feeOptionsAfterF2(page: Page, unit: string): Promise<number> {
  await openOn(page, unit);
  await page
    .locator('[data-slot="data-region"]')
    .first()
    .getByRole("button", { name: "Cột", exact: true })
    .click();
  await page.getByRole("menuitemcheckbox", { name: label("FeeInclusion") }).click();
  await page.keyboard.press("Escape");
  await select(page, unit, FEE);
  await page.keyboard.press("F2");
  const options = page.locator("[data-fee-option]");
  await options
    .first()
    .waitFor({ timeout: 3_000 })
    .catch(() => undefined);
  return options.count();
}

test("dieu-kien-phi-tren-o: a role that may not change listings opens no fee cell; a role that may, does", async ({
  page,
  browser,
}, info) => {
  test.skip(info.project.name !== "1440", "do o 1440");
  const l = DATA.current.find((x) => x.standardStatus !== "Closed" && x.listPrice)!;
  const unit = UNIT_OF.get(l.id)!.unitNumber;
  // Control: the keeper's role edits listings company-wide (Hỏi-2 A), so the same steps open the two options.
  const agent = await world(info, "phi-ca-dc");
  const other = await browser.newPage();
  await signIn(other, agent.email, agent.mau);
  expect(await feeOptionsAfterF2(other, unit), "dieu-kien-phi-tren-o: doi chung").toBe(2);
  await other.close();
  // The company admin views listings read-only (Hỏi-1 A): the fee cell takes focus but opens no editor.
  const w = await world(info, "phi-ca", ["CompanyAdmin"]);
  await signIn(page, w.email, w.mau);
  expect(await feeOptionsAfterF2(page, unit), "dieu-kien-phi-tren-o: quan tri mo o phi").toBe(0);
  await expect(editor(page)).toHaveCount(0);
});

// ---- E8 · five states, light and dark ------------------------------------------------------------------------------

async function seriousAxe(page: Page): Promise<string[]> {
  const { violations } = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .exclude("nextjs-portal")
    .analyze();
  return violations
    .filter((v) => v.impact === "serious" || v.impact === "critical")
    .map((v) => v.id);
}

test("nam-trang-thai + axe-sang-toi: loading, empty, a real read error with Tải lại, no match with Xoá lọc — light and dark", async ({
  page,
}, info) => {
  const w = await world(info, "trang-thai");
  await signIn(page, w.email, w.trong);
  for (const scheme of ["light", "dark"] as const) {
    await page.emulateMedia({ colorScheme: scheme });
    // Empty: the company has no listing yet.
    await openInventory(page);
    await expect(
      page.locator('[data-slot="region-state"][data-kind="empty"]').first(),
    ).toBeVisible();
    expect(await seriousAxe(page), `axe-sang-toi trống ${scheme}`).toEqual([]);
    // Loading, through the development switch (the read itself is too quick to catch).
    await openInventory(page, "/inventory?state=loading");
    await expect(page.locator('[data-slot="region-loading"]').first()).toBeVisible();
  }
  await page.emulateMedia({ colorScheme: "light" });
  // A real read error: the database refuses this company's reads (a policy that raises on its rows), no ?state= switch.
  // The company needs one listing for the policy to be asked about.
  await seedSampleInventory(owner, w.trong.id);
  const fn = `e2e_hong_${w.trong.id.replace(/-/g, "")}`;
  await owner.query(
    `create function public.${fn}() returns boolean language plpgsql as $f$ begin raise exception 'hong'; end $f$`,
  );
  await owner.query(`grant execute on function public.${fn}() to quy_hang_app`);
  await owner.query(
    `create policy ${fn} on listings as restrictive for select using (company_id <> '${w.trong.id}' or public.${fn}())`,
  );
  try {
    await openInventory(page);
    const failed = page.locator('[data-slot="region-state"][data-kind="error"]').first();
    if (!(await failed.isVisible())) throw new Error("nam-trang-thai: lỗi");
    await expect(failed.getByRole("button", { name: GRID_COPY.retry })).toBeVisible();
    expect(await seriousAxe(page), "axe-sang-toi lỗi").toEqual([]);
  } finally {
    await owner.query(`drop policy ${fn} on listings`);
    await owner.query(`drop function public.${fn}()`);
  }
  // No match: [MAU] filtered by a code it does not have.
  await page.locator('[data-slot="app-shell-top-bar"] [data-slot="company-name"]').click();
  await page.getByRole("menuitemradio", { name: w.mau.name }).click();
  await openInventory(page, "/inventory?unit=KHONG-CO-CAN-NAY");
  await expect(
    page
      .locator('[data-slot="region-state"][data-kind="no-match"]')
      .getByRole("button", { name: GRID_COPY.clearFilter }),
  ).toBeVisible();
  expect(await seriousAxe(page), "axe-sang-toi không khớp").toEqual([]);
});

// ---- E9b · no session goes to sign-in --------------------------------------------------------------------------------

test("chua-dang-nhap-ve-dang-nhap: without a session /inventory, with or without ?role=, goes to sign-in", async ({
  page,
}, info) => {
  await page.context().clearCookies();
  for (const path of ["/inventory", "/inventory?role=TeamLead"]) {
    await page.goto(path);
    await expect(page).toHaveURL(/\/login\?next=/);
  }
  // The company admin reads the inventory, read-only (Hỏi-1 A).
  const w = await world(info, "qt", ["CompanyAdmin"]);
  await signIn(page, w.email, w.mau);
  await openInventory(page);
  expect(await rowCount(page)).toBe(60);
});

// ---- row 1v (english-query-words) · an old link, E18 and E17-ui -------------------------------------------------------

const OLD_WORDS = ["ma", "toa", "du-an", "ho-so", "vung", "goc-nhin"];
const hasOldWord = (url: string) => OLD_WORDS.some((w) => new URL(url).searchParams.has(w));

/** Signs in on the sign-in page already open (keeping its ?next=), as signIn does from a fresh one. */
async function signInHere(page: Page, email: string, into: Company) {
  const before = codes(email).length;
  await expect(page.locator('[data-state="email"][data-ready]')).toBeVisible();
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Email").press("Enter");
  await expect(page.locator('[data-state="code"]')).toBeVisible();
  await expect.poll(() => codes(email).length, { timeout: 10_000 }).toBe(before + 1);
  const code = page.getByLabel("Mã đăng nhập");
  await code.fill(codes(email).at(-1)!);
  await code.press("Enter");
  const choose = page.locator('[data-state="choose-company"]');
  await expect(choose.or(page.locator('[data-slot="account-menu"][data-ready]'))).toBeVisible();
  if (await choose.isVisible()) await choose.getByRole("button", { name: into.name }).click();
}

/** One listing of [MAU] with its unit code and its project, the place an old link names. */
function oldLinkTarget(companyId: string) {
  const sample = DATA.current[0]!;
  const unit = UNIT_OF.get(sample.id)!;
  return {
    id: companyListingId(companyId, sample.id),
    code: unit.unitNumber,
    place: unit.subdivisionName!,
  };
}

test("lien-ket-cu: an old link goes through sign-in once translated and opens the unit", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "1440", "do o 1440");
  const w = await world(info, "lkc");
  const t = oldLinkTarget(w.mau.id);
  const view = "00000000-0000-4000-8000-000000000001";
  const oldLink = `/inventory?ho-so=${t.id}&vung=${encodeURIComponent(t.place)}&goc-nhin=${view}`;
  const translations: string[] = [];
  page.on("response", (r) => {
    if (r.status() >= 300 && r.status() < 400 && hasOldWord(r.url())) translations.push(r.url());
  });
  await page.context().clearCookies();
  await page.goto(oldLink);
  await expect(page, "lien-ket-cu: khong ve dang nhap").toHaveURL(/\/login\?next=/);
  const next = decodeURIComponent(new URL(page.url()).searchParams.get("next") ?? "");
  expect(next, "lien-ket-cu: next mang tu cu").not.toMatch(/ho-so|vung|goc-nhin/);
  expect(next, "lien-ket-cu: next thieu tu moi").toContain(`record=${t.id}`);
  expect(next, "lien-ket-cu: next thieu place").toContain("place=");
  expect(next, "lien-ket-cu: next thieu view").toContain(`view=${view}`);
  await signInHere(page, w.email, w.mau);
  await page.waitForURL((u) => u.pathname === "/inventory");
  expect(hasOldWord(page.url()), "lien-ket-cu: dia chi cuoi mang tu cu").toBe(false);
  expect(new URL(page.url()).searchParams.get("record"), "lien-ket-cu: dia chi cuoi").toBe(t.id);
  await expect(page.locator('[data-slot="record-panel"]'), "lien-ket-cu: ngan ho so").toContainText(
    t.code,
  );
  expect(translations, "lien-ket-cu: so buoc dich").toHaveLength(1);
});

test("lien-ket-cu: đối chứng — the same link in English takes no translation step", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "1440", "do o 1440");
  const w = await world(info, "lkm");
  const t = oldLinkTarget(w.mau.id);
  const translations: string[] = [];
  page.on("response", (r) => {
    if (r.status() >= 300 && r.status() < 400 && hasOldWord(r.url())) translations.push(r.url());
  });
  await signIn(page, w.email, w.mau);
  await openInventory(page, `/inventory?record=${t.id}&place=${encodeURIComponent(t.place)}`);
  await expect(page.locator('[data-slot="record-panel"]'), "doi-chung: ngan ho so").toContainText(
    t.code,
  );
  expect(translations, "doi-chung: co buoc dich").toHaveLength(0);
});

test("old link images: an old link at 1440, for the judge (URL_ANH=1)", async ({ page }, info) => {
  test.skip(info.project.name !== "1440" || !process.env.URL_ANH, "anh cho ban cham");
  const w = await world(info, "lka");
  const t = oldLinkTarget(w.mau.id);
  await signIn(page, w.email, w.mau);
  const oldLink = `/inventory?ho-so=${t.id}&vung=${encodeURIComponent(t.place)}`;
  await openInventory(page, oldLink);
  await expect(page.locator('[data-slot="record-panel"]')).toContainText(t.code);
  const dir = ".acceptance-runs/english-query-words";
  mkdirSync(dir, { recursive: true });
  await chupAnh(page, { path: `${dir}/old-link-1440.png` });
  console.log(`lien ket cu: ${oldLink}`);
  console.log(`can va noi mong doi: ${t.code} · ${t.place}`);
  console.log(`dia chi cuoi: ${new URL(page.url()).pathname}${new URL(page.url()).search}`);
});

// ---- E10b · 5,000 listings scroll to the end -------------------------------------------------------------------------

test("cuon-nam-nghin: an inventory of 5,000 listings scrolls to its last row without an error", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "1440", "do o 1440");
  const stamp = `lon-${Date.now()}`;
  const big = await company(`[MAU-LON ${stamp}]`);
  const email = `bht-${stamp}@example.test`;
  await member(big, email, "[Tên] Lớn", ["ListAgent"]);
  const slug = `mau-lon-${Date.now()}`;
  const key = String(Date.now()).padStart(22, "0");
  await owner.query(
    "insert into catalog_nodes (slug, node_type, name) values ($1, 'project', '[MAU] Lớn')",
    [slug],
  );
  await owner.query(
    "insert into catalog_buildings (building_key, subdivision_key, building_name, upi) values ($1, $2, '[MAU] Toà lớn', $3)",
    [`bld_${key}9999`, slug, `upi-${slug}`],
  );
  await owner.query(
    `insert into catalog_units (unit_key, upi, subdivision_key, building_key, building_name, unit_number, property_type,
                                property_sub_type, living_area, bedrooms_total)
     select 'unt_' || $3 || lpad(g::text, 4, '0'), $1 || '-' || g, $2, $4, '[MAU] Toà lớn', 'L-' || g,
            'Residential', 'Condominium', 70, 2
       from generate_series(1, 5000) g`,
    [`upi-${slug}`, slug, key, `bld_${key}9999`],
  );
  await owner.query(
    `with n as (select g, gen_random_uuid() as id from generate_series(1, 5000) g),
          l as (insert into listings (id, company_id, standard_status, list_price)
                select id, $1, 'Active', 3000000000 from n returning id)
     insert into listing_units (listing_id, company_id, upi, open)
     select n.id, $1, $2 || '-' || n.g, true from n`,
    [big.id, `upi-${slug}`],
  );
  const errors: string[] = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  await signIn(page, email, big);
  await openInventory(page);
  const viewport = page
    .locator('[data-slot="data-region-body"] [data-slot="scroll-area-viewport"]')
    .first();
  // The grid's first order is by project, then by unit (UPI as text): the last row is the unit whose UPI sorts last.
  const upis = Array.from({ length: 5000 }, (_, i) => `upi-${slug}-${i + 1}`).sort();
  const firstCode = `L-${upis[0]!.split("-").at(-1)}`;
  const lastCode = `L-${upis.at(-1)!.split("-").at(-1)}`;
  expect(await rowCount(page)).toBe(5000);
  expect(await shownCodes(page)).toContain(firstCode);
  await suaTrang(viewport, (el) => el.scrollTo(0, el.scrollHeight));
  // At the end: the last row is drawn and the first is no longer (the body is virtual, so only rows in view are).
  await expect
    .poll(async () => {
      const codes = await shownCodes(page);
      return codes.includes(lastCode) && !codes.includes(firstCode);
    })
    .toBe(true);
  expect(errors).toEqual([]);
});
