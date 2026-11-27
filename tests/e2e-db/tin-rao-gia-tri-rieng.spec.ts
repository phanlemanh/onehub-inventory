// Row 3h (_acceptance/tin-rao-giu-gia-tri-rieng), task 5, signed in on the lane's Postgres: the unit section of the
// record edits the five attributes in one save (E3), marks only a value that differs from the catalog (E4), takes a
// value back to the catalog (E5), and keeps a sold or withdrawn listing's tasks as quiet lines (E14b, on VP10's
// frame). Case names are the record's pinned messages (evals.yaml).
import { existsSync, readFileSync } from "node:fs";

import { expect, test, type Page, type TestInfo } from "@playwright/test";
import pg from "pg";

import { DB_URL, OUTBOX } from "../../playwright.db.config";
import { label } from "../../src/modules/company-config";
import { sampleId } from "../../src/modules/listings";
import { companyListingId, seedSampleInventory } from "../db/can-mau";
import { regionReady } from "../e2e/phone-list";
import { chupAnh, pageReady } from "../e2e/sua-trang";
import { shellReady } from "./dang-nhap-vai";

let owner: pg.Client;
test.beforeAll(async () => {
  owner = new pg.Client({ connectionString: DB_URL });
  await owner.connect();
});
test.afterAll(async () => {
  await owner.end();
});

/** Sample listings of the inventory sample (src/modules/listings/sample.ts), by what each shows. */
const PLAIN = sampleId(1, 2); // open, no own value, kept by someone else
const AREA_TYPED = sampleId(1, 4); // open, own area 78,5 typed over the catalog's 75
const BEDROOMS_EQUAL = sampleId(1, 5); // own bedrooms equal to the catalog's
const SOLD = sampleId(1, 9); // Closed
const WITHDRAWN = sampleId(1, 12); // Withdrawn
const UNKEPT = sampleId(1, 10); // open, nobody keeps it

interface Company {
  id: string;
  name: string;
}

async function world(info: TestInfo, tag: string, roles: string[]) {
  const stamp = `${tag}-${info.project.name}-${Date.now()}`;
  const name = `[MAU ${stamp}]`;
  const id = (
    await owner.query<{ id: string }>("insert into companies (name) values ($1) returning id", [
      name,
    ])
  ).rows[0]!.id;
  const email = `gtr-${stamp}@example.test`;
  const person = `[Tên] ${tag}`;
  const userId = (
    await owner.query<{ id: string }>(
      "insert into identity.users (email, name) values ($1, $2) on conflict (email) do update set name = excluded.name returning id",
      [email, person],
    )
  ).rows[0]!.id;
  await owner.query(
    "insert into company_members (company_id, user_id, name, roles) values ($1, $2, $3, $4)",
    [id, userId, person, roles],
  );
  await seedSampleInventory(owner, id, { id: userId, name: person });
  return { email, mau: { id, name }, idOf: (s: string) => companyListingId(id, s) };
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
  const shell = page.locator(
    '[data-slot="account-menu"][data-ready], [data-slot="app-shell-top-bar"] [data-slot="company-name"]',
  );
  await expect(choose.or(shell.filter({ visible: true }).first())).toBeVisible();
  if (await choose.isVisible()) await choose.getByRole("button", { name: into.name }).click();
  await shellReady(page);
}

async function openRecord(page: Page, id: string) {
  await page.goto(`/inventory?record=${id}`);
  await page.waitForLoadState("networkidle");
  await regionReady(page);
  await pageReady(page);
  await expect(page.locator(`[data-slot="listing-record"][data-listing-id="${id}"]`)).toBeVisible();
}

const record = (page: Page) => page.locator('[data-slot="listing-record"]').first();
const unitSection = (page: Page) => record(page).locator('[data-slot="listing-unit"]');
const editOpen = (page: Page) =>
  unitSection(page).locator('[data-slot="unit-attributes-edit-open"]');
const marksIn = (page: Page) => unitSection(page).locator('[data-slot="attribute-differs"]');
const own = async (id: string) =>
  (
    await owner.query<Record<string, unknown>>(
      `select living_area::float8 as living_area, living_area_source, floor, floor_source, bedrooms_total,
              bedrooms_total_source, direction_faces, direction_faces_source, property_sub_type,
              property_sub_type_source from listings where id = $1`,
      [id],
    )
  ).rows[0]!;

/** PATCH requests to the listing door while `act` runs. */
async function patchesDuring(page: Page, act: () => Promise<void>): Promise<unknown[]> {
  const seen: unknown[] = [];
  const on = (r: import("@playwright/test").Request) => {
    if (r.method() === "PATCH" && r.url().includes("/api/v1/listings/"))
      seen.push(r.postDataJSON());
  };
  page.on("request", on);
  await act();
  await page.waitForTimeout(300);
  page.off("request", on);
  return seen;
}

test("sua-nam-truong: one save sends the five values once; a floor «07» is refused with no request; undo puts all five back (E3)", async ({
  page,
}, info) => {
  const w = await world(info, "sua", ["TeamLead"]);
  const id = w.idOf(PLAIN);
  const before = await own(id);
  await signIn(page, w.email, w.mau);
  await openRecord(page, id);
  await editOpen(page).click();
  // The record is itself a dialog (a whole screen on a phone, floating from 768 px): the edit dialog is the one with fields.
  const dialog = page
    .getByRole("dialog")
    .filter({ has: page.locator('input[data-attribute="floor"]') });
  const field = (f: string) => dialog.locator(`input[data-attribute="${f}"]`);
  await field("livingArea").fill("72,5");
  await field("floor").fill("07");
  await field("bedroomsTotal").fill("3");
  const save = dialog.getByRole("button", { name: "Lưu" });
  expect(await patchesDuring(page, () => save.click()), "sua-nam-truong: tầng 07").toEqual([]);
  await expect(dialog).toBeVisible();
  await field("floor").fill("15A");
  await dialog.locator('[data-attribute="directionFaces"]').click();
  await page.getByRole("option", { name: "Tây Bắc" }).click();
  await dialog.locator('[data-attribute="propertySubType"]').click();
  await page.getByRole("option", { name: label("SubTypeTownhouse") }).click();
  const sent = await patchesDuring(page, () => save.click());
  expect(sent, "sua-nam-truong: một lần gửi").toHaveLength(1);
  expect((sent[0] as { change: Record<string, unknown> }).change).toMatchObject({
    field: "unitAttributes",
    livingArea: 72.5,
    floor: "15A",
    bedroomsTotal: 3,
    directionFaces: "Tây Bắc",
    propertySubType: "Townhouse",
  });
  await expect(dialog).toBeHidden();
  await expect.poll(() => own(id).then((r) => r["floor"]), { timeout: 10_000 }).toBe("15A");
  await expect(unitSection(page).locator('[data-field="Unit.floor"] dd')).toContainText("15A");
  await chupAnh(page, {
    path: `_acceptance/tin-rao-giu-gia-tri-rieng/evidence/E3-${info.project.name}.png`,
  });
  await page.getByRole("button", { name: "Hoàn tác" }).click();
  await expect.poll(() => own(id), { timeout: 10_000 }).toEqual(before);
});

test("dau-khac: only the value that differs is marked, named with the catalog's word and value, in the text colour of the others (E4)", async ({
  page,
}, info) => {
  test.skip(!["360", "1440"].includes(info.project.name), "E4 measures 360 and 1440");
  const w = await world(info, "dau", ["TeamLead"]);
  await signIn(page, w.email, w.mau);
  await openRecord(page, w.idOf(AREA_TYPED));
  await expect(marksIn(page)).toHaveCount(1);
  await expect(marksIn(page).first()).toHaveAttribute(
    "aria-label",
    new RegExp(`^${label("DiffersFromCatalog")}`),
  );
  // The marked value keeps the text colour of an unmarked one.
  const colour = (key: string) =>
    unitSection(page)
      .locator(`[data-field="${key}"] dd`)
      .first()
      .evaluate((el) => getComputedStyle(el.querySelector("span") ?? el).color);
  expect(await colour("Unit.livingArea"), "mark on equal value").toBe(await colour("Unit.floor"));
  for (const quiet of [BEDROOMS_EQUAL, PLAIN]) {
    await openRecord(page, w.idOf(quiet));
    // Zero marks counts only on a unit section that is there, with its area row.
    await expect(unitSection(page).locator('[data-field="Unit.livingArea"] dd')).toBeVisible();
    await expect(marksIn(page), "mark on equal value").toHaveCount(0);
  }
});

test("lay-lai: the mark's command takes the catalog value back — value and source both empty in the database (E5)", async ({
  page,
}, info) => {
  test.skip(
    info.project.name !== "360",
    "E5 takes a value back in the record at 360; the grid cell is row 4",
  );
  const w = await world(info, "lay", ["TeamLead"]);
  const id = w.idOf(AREA_TYPED);
  await signIn(page, w.email, w.mau);
  await openRecord(page, id);
  await marksIn(page).first().click();
  await page.getByRole("button", { name: label("RevertToCatalog") }).click();
  await expect
    .poll(() => own(id).then((r) => [r["living_area"], r["living_area_source"]]), {
      timeout: 10_000,
    })
    .toEqual([null, null]);
  await expect(unitSection(page).locator('[data-field="Unit.livingArea"] dd')).toContainText("75");
  await expect(marksIn(page)).toHaveCount(0);
  await page.getByRole("button", { name: "Hoàn tác" }).click();
  await expect
    .poll(() => own(id).then((r) => [r["living_area"], r["living_area_source"]]), {
      timeout: 10_000,
    })
    .toEqual([78.5, "Typed"]);
});

test("khoa-ba-trang-thai: sold and withdrawn keep «Sửa» and «Hỏi đầu chủ» as quiet lines; an unkept unit has its line; «Sửa» is 44 px on a phone (E14b)", async ({
  page,
}, info) => {
  test.skip(!["360", "414", "1440"].includes(info.project.name), "E14b measures 360, 414 and 1440");
  const phone = ["360", "414"].includes(info.project.name);
  const w = await world(info, "khoa", ["TeamLead"]);
  await signIn(page, w.email, w.mau);
  for (const theme of ["light", "dark"] as const) {
    await page.emulateMedia({ colorScheme: theme });
    for (const locked of [SOLD, WITHDRAWN]) {
      await openRecord(page, w.idOf(locked));
      // The lock line stands in the unit section itself, so «no Sửa» is counted on a section that is there.
      await expect(unitSection(page).locator('[data-slot="section-locked-reason"]')).toBeVisible();
      await expect(editOpen(page)).toHaveCount(0);
      const foot = page.locator('[data-slot="ask-locked-reason"]').filter({ visible: true });
      await expect(foot).toHaveCount(1);
      await expect(page.locator('[data-slot="ask-list-agent"]')).toHaveCount(0);
      if (locked === SOLD)
        await chupAnh(page, {
          path: `_acceptance/tin-rao-giu-gia-tri-rieng/evidence/E14b-${info.project.name}-${theme}.png`,
        });
    }
    await openRecord(page, w.idOf(UNKEPT));
    await expect(
      page.locator('[data-slot="ask-locked-reason"]').filter({ visible: true }),
    ).toHaveCount(1);
    await expect(page.locator('[data-slot="ask-list-agent"]')).toHaveCount(0);
    await openRecord(page, w.idOf(PLAIN));
    await expect(editOpen(page)).toBeVisible();
    await expect(
      page.locator('[data-slot="ask-list-agent"]').filter({ visible: true }),
    ).toHaveCount(1);
    const height = (await editOpen(page).boundingBox())!.height;
    if (phone) expect(height, `vùng bấm Sửa ${info.project.name}`).toBeGreaterThanOrEqual(44);
    else expect(height, "nút Sửa 1440").toBe(28);
  }
});
