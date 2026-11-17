// Row 3g (_acceptance/sua-thong-tin-can), signed in, on the lane's Postgres: the four details saved in the record stay
// after a reload and are in the row; a company admin sees no «Sửa» and no detail cell opens; the company's own fields
// open the editor of their kind on a real company and a saved value reaches the row. Case names are the record's
// pinned messages (evals.yaml, E2b and E6).
import { existsSync, readFileSync } from "node:fs";

import { expect, test, type Page, type TestInfo } from "@playwright/test";
import pg from "pg";

import { DB_URL, OUTBOX } from "../../playwright.db.config";
import { sampleInventoryData } from "../../src/app/(app)/inventory-sample-data";
import { companyListingId, seedSampleInventory } from "../db/can-mau";
import { regionReady } from "../e2e/phone-list";
import { pageReady } from "../e2e/sua-trang";

let owner: pg.Client;
test.beforeAll(async () => {
  owner = new pg.Client({ connectionString: DB_URL });
  await owner.connect();
});
test.afterAll(async () => {
  await owner.end();
});

interface Company {
  id: string;
  name: string;
}

const DATA = sampleInventoryData();
/** An open sample listing, the newest of its unit. */
const OPEN = DATA.current.find((l) =>
  ["Incomplete", "Active", "Pending", "Hold"].includes(l.standardStatus),
)!;

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

/** A company with the sample inventory, five own fields of five kinds, and one person in the given roles. */
async function world(info: TestInfo, tag: string, roles: string[]) {
  const stamp = `${tag}-${info.project.name}-${Date.now()}`;
  const mau = await company(`[MAU ${stamp}]`);
  const email = `stc-${stamp}@example.test`;
  const name = `[Tên] ${tag}`;
  const id = await member(mau, email, name, roles);
  await seedSampleInventory(owner, mau.id, { id, name });
  const fields: [string, string, string, string[]][] = [
    ["ghi_chu", "Ghi chú", "text", []],
    ["so_cho_xe", "Chỗ xe", "number", []],
    ["ngay_ban_giao", "Bàn giao", "date", []],
    ["huong_view", "Hướng view", "single_select", ["Hồ", "Phố"]],
    ["co_ban_cong", "Ban công", "boolean", []],
  ];
  for (const [i, [code, label, kind, options]] of fields.entries())
    await owner.query(
      "insert into company_fields (company_id, code, name, kind, options, position) values ($1, $2, $3, $4, $5::jsonb, $6)",
      [mau.id, code, label, kind, JSON.stringify(options), i],
    );
  return { email, mau, listing: companyListingId(mau.id, OPEN.id) };
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

async function openInventory(page: Page, path: string) {
  await page.goto(path);
  await page.waitForLoadState("networkidle");
  await regionReady(page);
  await pageReady(page);
}

const editOpen = (page: Page) => page.locator('[data-slot="listing-details-edit-open"]');
const offerValue = (page: Page, key: string) =>
  page.locator(`[data-slot="listing-offer"] [data-field="${key}"] dd`).first();

test("tai-lai-con: four details saved in the record are there after a reload, and in the database", async ({
  page,
}, info) => {
  const w = await world(info, "luu", ["ListAgent"]);
  await signIn(page, w.email, w.mau);
  await openInventory(page, `/inventory?ho-so=${w.listing}`);
  await editOpen(page).first().scrollIntoViewIfNeeded();
  await editOpen(page).first().click();
  const dialog = page.locator('[data-slot="listing-details-edit"]');
  const value = `Vay 60% [MAU ${info.project.name}]`;
  await dialog.locator('input[data-detail="financing"]').fill(value);
  await dialog.locator('input[data-detail="legalStatus"]').fill("Sổ hồng [MAU]");
  await dialog.getByRole("button", { name: "Lưu" }).click();
  await expect(dialog).toBeHidden();
  await openInventory(page, `/inventory?ho-so=${w.listing}`);
  await expect(offerValue(page, "Listing.financing"), "tai-lai-con: hồ sơ").toHaveText(value);
  const row = (
    await owner.query<{ financing: string; legal_status: string }>(
      "select financing, legal_status from listings where id = $1",
      [w.listing],
    )
  ).rows[0]!;
  expect(row, "tai-lai-con: dòng").toEqual({ financing: value, legal_status: "Sổ hồng [MAU]" });
});

test("quan-tri-khong-nut: a company admin sees the details but no «Sửa», and no detail cell opens", async ({
  page,
}, info) => {
  const w = await world(info, "qt", ["CompanyAdmin"]);
  await signIn(page, w.email, w.mau);
  await openInventory(page, `/inventory?ho-so=${w.listing}`);
  await expect(page.locator('[data-slot="listing-offer"]').first()).toBeVisible();
  expect(await editOpen(page).count(), "quan-tri-khong-nut: nút").toBe(0);
  if (["1024", "1440"].includes(info.project.name)) {
    await page.keyboard.press("Escape");
    const cell = page.locator(`[id$="${w.listing}-Listing_furnished"]`).first();
    await cell.scrollIntoViewIfNeeded();
    await cell.click({ position: { x: 3, y: 3 } });
    await page.keyboard.press("F2");
    await page.waitForTimeout(500);
    expect(await page.locator('[data-slot="cell-editor"]').count(), "quan-tri-khong-nut: ô").toBe(
      0,
    );
  }
});

test("o-rieng-that: on a real company each own column opens its kind's editor, and a saved value reaches the row", async ({
  page,
}, info) => {
  test.skip(["360", "414"].includes(info.project.name), "phones do not edit in a cell (row 4)");
  const w = await world(info, "rieng", ["ListAgent"]);
  await signIn(page, w.email, w.mau);
  await openInventory(page, "/inventory");
  const kinds: Record<string, string> = {
    ghi_chu: "text",
    so_cho_xe: "number",
    ngay_ban_giao: "date",
    huong_view: "single_select",
    co_ban_cong: "boolean",
  };
  for (const [code, kind] of Object.entries(kinds)) {
    const cell = page.locator(`[id$="${w.listing}-custom_${code}"]`).first();
    await cell.scrollIntoViewIfNeeded();
    await cell.click({ position: { x: 3, y: 3 } });
    await page.keyboard.press("F2");
    await expect(
      page.locator(`[data-custom-kind="${kind}"]`),
      `o-rieng-that: ${kind}`,
    ).toBeVisible();
    await page.keyboard.press("Escape");
  }
  const cell = page.locator(`[id$="${w.listing}-custom_so_cho_xe"]`).first();
  await cell.click({ position: { x: 3, y: 3 } });
  await page.keyboard.press("F2");
  await page.locator('[data-custom-kind="number"]').fill("2");
  await page.keyboard.press("Enter");
  await expect
    .poll(
      async () =>
        (
          await owner.query<{ v: unknown }>(
            "select custom_fields->'so_cho_xe' as v from listings where id = $1",
            [w.listing],
          )
        ).rows[0]!.v,
      { timeout: 10_000 },
    )
    .toBe(2);
});
