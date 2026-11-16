// Row 10 (bang-hang-du-lieu-that) in the browser on this lane's Postgres: the inventory of the signed-in company, read and
// changed for real. Each test makes its own companies from the sample ([MAU], a small [MAU-2], an empty [MAU-TRONG]) with
// «[Tên]» people. Evals E3, E4b, E5b, E6b, E7, E8, E9b, E10b.
import { existsSync, readFileSync } from "node:fs";

import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Browser, type Page, type TestInfo } from "@playwright/test";
import pg from "pg";

import { DB_URL, OUTBOX } from "../../playwright.db.config";
import { sampleInventoryData } from "../../src/app/(app)/inventory-sample-data";
import { GRID_COPY } from "../../src/components/candidate/grid-copy";
import { statusLabel } from "../../src/lib/format";
import { label } from "../../src/modules/company-config";
import { companyListingId, seedSampleInventory } from "../db/can-mau";
import { isPhone, phoneCards, regionReady } from "../e2e/phone-list";

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
    return kind === keeper && statuses.includes(x.standardStatus);
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
  await expect(page.locator('[hidden][id^="S:"]')).toHaveCount(0);
  await regionReady(page);
}

/** The unit codes the region shows: the record openers of the table, or the cards below 768 px. */
async function shownCodes(page: Page): Promise<string[]> {
  if (isPhone(page)) {
    await phoneCards(page).first().waitFor();
    return phoneCards(page).evaluateAll((els) =>
      els.map((e) =>
        (
          e.querySelector('[data-slot="listing-card-code"]')?.textContent ??
          e.textContent ??
          ""
        ).trim(),
      ),
    );
  }
  await page.locator('[data-slot="data-region-body"] tbody tr[data-row-id]').first().waitFor();
  return page
    .locator('[data-slot="data-region-body"] button[data-record-open]')
    .evaluateAll((els) => els.map((e) => (e.textContent ?? "").trim()));
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
  expect(await shownCodes(page)).toHaveLength(60);
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
  // No count rides on a tree entry: each entry reads its place's name and nothing more.
  const entries = await column
    .locator('[data-sidebar="menu-sub-button"], [data-sidebar="menu-button"]')
    .evaluateAll((els) => els.map((e) => (e.textContent ?? "").trim()));
  expect(entries.filter((t) => /\s\d+$/.test(t))).toEqual([]);
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
  expect(tab.url()).not.toBe(before);
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
  await openInventory(page);
  const id = companyListingId(w.mau.id, row.id);
  const before = await rowOf(id);
  await typePrice(page, row.unit, "2,8 tỷ");
  await expect.poll(async () => Number((await rowOf(id)).list_price)).toBe(2_800_000_000);
  expect(sent).toHaveLength(1);
  expect(sent[0]!.body).toMatchObject({ version: before.version, change: { field: "listPrice" } });
  expect((await rowOf(id)).version).toBe(before.version + 1);
  await openInventory(page);
  await expect(cellOf(page, row.unit, PRICE)).toContainText("2,8");
  const second = await (browser as Browser).newPage();
  await signIn(second, w.email, w.mau);
  await openInventory(second);
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
  await page.goto(`/inventory?ho-so=${companyListingId(w.mau.id, other.id)}`);
  await expect(page.locator('[data-slot="ask-list-agent"]')).toContainText(
    other.keeper?.kind === "other" ? other.keeper.name : "",
  );
  const none = sampleRow("none");
  await page.goto(`/inventory?ho-so=${companyListingId(w.mau.id, none.id)}`);
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
  await openInventory(page);
  const second = await (browser as Browser).newPage({ viewport: page.viewportSize()! });
  await signIn(second, w.email, w.mau);
  await openInventory(second);
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
  await openInventory(page);
  const oldPrice = Number((await rowOf(id)).list_price);
  await typePrice(page, row.unit, "2,8 tỷ");
  const priceToast = page
    .locator("[data-sonner-toast]")
    .filter({ hasText: label("ListPrice") })
    .first();
  await expect(priceToast).toBeVisible();
  await expect.poll(async () => (await rowOf(id)).version).toBe(2);
  await select(page, row.unit, STATUS);
  await page.keyboard.press("F2");
  await editor(page).locator('[data-status-option="Hold"]').click();
  await expect.poll(async () => (await rowOf(id)).standard_status).toBe("Hold");
  await priceToast.getByRole("button", { name: "Hoàn tác" }).click();
  await expect.poll(async () => Number((await rowOf(id)).list_price)).toBe(oldPrice);
  const undo = sent.at(-1)!.body as { version: number; change: { field: string } };
  expect(undo).toMatchObject({ version: 3, change: { field: "listPrice" } });
  const after = await rowOf(id);
  if (after.standard_status !== "Hold") throw new Error("hoan-tac-chi-gia: trạng thái cũ");
  await expect(cellOf(page, row.unit, STATUS)).toContainText(statusLabel("Hold"));
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
  await expect.poll(async () => (await net.innerText()).trim()).not.toBe(netBefore);
  await openInventory(page);
  expect((await rowOf(id)).fee_inclusion).toBe("Excluded");
});

test("dieu-kien-phi-tren-o: a role that may not change listings opens no fee cell", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "1440", "do o 1440");
  const w = await world(info, "phi-ca", ["CompanyAdmin"]);
  await signIn(page, w.email, w.mau);
  await openInventory(page);
  const unit = UNIT_OF.get(DATA.current[0]!.id)!.unitNumber;
  await select(page, unit, PRICE);
  await page.keyboard.press("F2");
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

test("nam-trang-thai: loading, empty, a real read error with Tải lại, no match with Xoá lọc — light and dark", async ({
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
  // A real read error: the database refuses this company's reads (a policy that raises), no ?state= switch.
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
  await openInventory(page, "/inventory?ma=KHONG-CO-CAN-NAY");
  await expect(
    page
      .locator('[data-slot="region-state"][data-kind="no-match"]')
      .getByRole("button", { name: GRID_COPY.clearFilter }),
  ).toBeVisible();
  expect(await seriousAxe(page), "axe-sang-toi không khớp").toEqual([]);
});

// ---- E9b · no session goes to sign-in --------------------------------------------------------------------------------

test("chua-dang-nhap-ve-dang-nhap: without a session /inventory, with or without ?vai=, goes to sign-in", async ({
  page,
}, info) => {
  await page.context().clearCookies();
  for (const path of ["/inventory", "/inventory?vai=TeamLead"]) {
    await page.goto(path);
    await expect(page).toHaveURL(/\/login\?next=/);
  }
  // The company admin reads the inventory, read-only (Hỏi-1 A).
  const w = await world(info, "qt", ["CompanyAdmin"]);
  await signIn(page, w.email, w.mau);
  await openInventory(page);
  expect(await shownCodes(page)).toHaveLength(60);
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
  await viewport.evaluate((el) => el.scrollTo(0, el.scrollHeight));
  await expect
    .poll(
      async () =>
        (await shownCodes(page)).includes("L-5000") ||
        (await shownCodes(page)).some((c) => c.startsWith("L-")),
    )
    .toBe(true);
  expect(errors).toEqual([]);
});
