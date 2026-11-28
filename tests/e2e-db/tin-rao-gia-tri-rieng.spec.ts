// Row 3h (_acceptance/tin-rao-giu-gia-tri-rieng), tasks 4 and 5, signed in on the lane's Postgres: the living area
// cell of the grid saves an own value, survives a reload and undoes (E2b, opened by VP11's shared helper); the unit
// section of the record edits the five attributes in one save (E3), marks only a value that differs from the catalog (E4), takes a
// value back to the catalog (E5), and keeps a sold or withdrawn listing's tasks as quiet lines (E14b, on VP10's
// frame). Case names are the record's pinned messages (evals.yaml).
import { existsSync, readFileSync } from "node:fs";

import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page, type TestInfo } from "@playwright/test";
import pg from "pg";

import { DB_URL, OUTBOX } from "../../playwright.db.config";
import { label } from "../../src/modules/company-config";
import { formatArea } from "../../src/lib/format";
import { IMPORT_COPY } from "../../src/modules/imports/ui/copy";
import { sampleId } from "../../src/modules/listings";
import { companyListingId, seedSampleInventory } from "../db/can-mau";
import { regionReady } from "../e2e/phone-list";
import { moSuaO, oCua } from "../e2e/support/mo-sua-o";
import { chupAnh, pageReady, suaTrang } from "../e2e/sua-trang";
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
const AREA_FILE = sampleId(1, 11); // open, own area 55,5 from a file over the catalog's
const DIRECTION_GAP = sampleId(1, 15); // open, own direction where the catalog has none

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

/** The marks a set of listings shows, by listing: one where the own value differs, none elsewhere. */
function markErrors(counts: Record<string, number>, differs: string): string[] {
  const errors: string[] = [];
  if (Object.keys(counts).length === 0) throw new Error("no listing measured");
  for (const [id, n] of Object.entries(counts))
    if (id === differs ? n !== 1 : n !== 0)
      errors.push(id === differs ? `mark missing on ${id}: ${n}` : "mark on equal value");
  return errors;
}

test("dau-khac: only the value that differs is marked, on the grid and in the record, named with the catalog's word and value, in the text colour of the others (E4)", async ({
  page,
}, info) => {
  test.skip(!["360", "1440"].includes(info.project.name), "E4 measures 360 and 1440");
  const w = await world(info, "dau", ["TeamLead"]);
  const ids = [AREA_TYPED, BEDROOMS_EQUAL, PLAIN, DIRECTION_GAP].map(w.idOf);
  const differs = w.idOf(AREA_TYPED);
  // The catalog of the database has no gap: the case «catalog empty» empties this unit's direction for the case, and
  // puts it back after (the listing keeps its own direction, typed).
  const gapUpi = (
    await owner.query<{ upi: string }>("select upi from listing_units where listing_id = $1", [
      w.idOf(DIRECTION_GAP),
    ])
  ).rows[0]!.upi;
  const kept = (
    await owner.query<{ d: string | null }>(
      "select direction_faces as d from catalog_units where upi = $1",
      [gapUpi],
    )
  ).rows[0]!.d;
  await owner.query("update catalog_units set direction_faces = null where upi = $1", [gapUpi]);
  try {
    await signIn(page, w.email, w.mau);
    // On the grid (the table from 768 px, the phone cards under it): the marks of each row.
    await page.goto("/inventory");
    await page.waitForLoadState("networkidle");
    await regionReady(page);
    const phone = info.project.name === "360";
    const onGrid: Record<string, number> = {};
    for (const id of ids) {
      const row = phone
        ? page
            .locator(
              `[data-slot="phone-card"]:has([data-record-open="${id}"]), [data-record-open="${id}"]`,
            )
            .first()
        : page.locator(`tr[data-row-id="${id}"]`);
      await expect(row, `row ${id} on the grid`).toHaveCount(1);
      onGrid[id] = await row.locator('[data-slot="attribute-differs"]').count();
    }
    expect(markErrors(onGrid, differs), "grid").toEqual([]);
    // In the record: the same, the mark named with the catalog's word and value.
    const inRecord: Record<string, number> = {};
    for (const id of ids) {
      await openRecord(page, id);
      // Zero marks counts only on a unit section that is there, with its area row.
      await expect(unitSection(page).locator('[data-field="Unit.livingArea"] dd')).toBeVisible();
      inRecord[id] = await marksIn(page).count();
    }
    expect(markErrors(inRecord, differs), "record").toEqual([]);
    expect(markErrors({ ...inRecord, [w.idOf(PLAIN)]: 1 }, differs)).toContain(
      "mark on equal value",
    );
    expect(() => markErrors({}, differs)).toThrow("no listing measured");
    await openRecord(page, differs);
    await expect(marksIn(page).first()).toHaveAttribute(
      "aria-label",
      `${label("DiffersFromCatalog")}: 75 m²`,
    );
    // The marked value keeps the text colour of an unmarked one.
    const colour = (key: string) =>
      unitSection(page)
        .locator(`[data-field="${key}"] dd`)
        .first()
        .evaluate((el) => getComputedStyle(el.querySelector("span") ?? el).color);
    expect(await colour("Unit.livingArea"), "mark on equal value").toBe(await colour("Unit.floor"));
    for (const theme of ["light", "dark"] as const) {
      await page.emulateMedia({ colorScheme: theme });
      expect(await axeFaults(page), `axe ${theme}`).toEqual([]);
    }
    await page.emulateMedia({ colorScheme: "light" });
    await chupAnh(page, {
      path: `_acceptance/tin-rao-giu-gia-tri-rieng/evidence/E4-${info.project.name}.png`,
    });
  } finally {
    await owner.query("update catalog_units set direction_faces = $2 where upi = $1", [
      gapUpi,
      kept,
    ]);
  }
});

/** The take-back command, found by a word; a word that is not the label table's finds nothing. */
async function revertCommand(page: Page, word: string) {
  const button = page.getByRole("button", { name: word });
  if ((await button.count()) === 0) throw new Error("label not from labels.yaml");
  return button.first();
}

test("lay-lai: the mark's command takes the catalog value back — value and source both empty in the database; a file value typed over goes straight back to the catalog (E5)", async ({
  page,
}, info) => {
  test.skip(
    !["360", "1440"].includes(info.project.name),
    "E5 measures the grid cell at 1440 and the record at 360",
  );
  const w = await world(info, "lay", ["TeamLead"]);
  const id = w.idOf(AREA_TYPED);
  await signIn(page, w.email, w.mau);
  if (info.project.name === "1440") {
    // On the grid: the cell's mark offers the command.
    await page.goto("/inventory");
    await page.waitForLoadState("networkidle");
    await regionReady(page);
    const cell = page.locator(`tr[data-row-id="${id}"] td[data-col-id="Unit.livingArea"]`);
    await cell.locator('[data-slot="attribute-differs"]').click();
    const sent = await patchesDuring(page, async () =>
      (await revertCommand(page, label("RevertToCatalog"))).click(),
    );
    expect(sent.map((b) => (b as { change: unknown }).change)).toEqual([
      { field: "unitAttributes", livingArea: null },
    ]);
    await expect(cell).toContainText("75");
    await expect(cell.locator('[data-slot="attribute-differs"]')).toHaveCount(0);
  } else {
    await openRecord(page, id);
    await marksIn(page).first().click();
    const sent = await patchesDuring(page, async () =>
      (await revertCommand(page, label("RevertToCatalog"))).click(),
    );
    expect(sent.map((b) => (b as { change: unknown }).change)).toEqual([
      { field: "unitAttributes", livingArea: null },
    ]);
    await expect(unitSection(page).locator('[data-field="Unit.livingArea"] dd')).toContainText(
      "75",
    );
    await expect(marksIn(page)).toHaveCount(0);
  }
  await expect
    .poll(() => own(id).then((r) => [r["living_area"], r["living_area_source"]]), {
      timeout: 10_000,
    })
    .toEqual([null, null]);
  await chupAnh(page, {
    path: `_acceptance/tin-rao-giu-gia-tri-rieng/evidence/E5-${info.project.name}.png`,
  });
  await page.getByRole("button", { name: "Hoàn tác" }).click();
  await expect
    .poll(() => own(id).then((r) => [r["living_area"], r["living_area_source"]]), {
      timeout: 10_000,
    })
    .toEqual([78.5, "Typed"]);
  // A hard-coded word that is not the label table's finds no command.
  await expect(revertCommand(page, "Về theo Danh bạ")).rejects.toThrow(
    "label not from labels.yaml",
  );
  if (info.project.name !== "360") return;
  // Hỏi-7: a value from a file, typed over, then taken back goes straight to the catalog — not back to the file's.
  const file = w.idOf(AREA_FILE);
  expect((await own(file))["living_area_source"], "the sample's file value").toBe("File");
  await openRecord(page, file);
  await editOpen(page).click();
  const dialog = page
    .getByRole("dialog")
    .filter({ has: page.locator('input[data-attribute="floor"]') });
  await dialog.locator('input[data-attribute="livingArea"]').fill("60");
  await dialog.getByRole("button", { name: "Lưu" }).click();
  await expect(dialog).toBeHidden();
  await expect.poll(() => own(file).then((r) => r["living_area_source"])).toBe("Typed");
  await marksIn(page).first().click();
  await (await revertCommand(page, label("RevertToCatalog"))).click();
  await expect
    .poll(() => own(file).then((r) => [r["living_area"], r["living_area_source"]]), {
      timeout: 10_000,
    })
    .toEqual([null, null]);
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

test("o-dien-tich: the area cell saves «72,5» as typed, keeps it after a reload, undoes a later edit; words send nothing (E2b)", async ({
  page,
}, info) => {
  test.skip(!["1024", "1440"].includes(info.project.name), "E2b measures 1024 and 1440");
  const w = await world(info, "o", ["ListAgent"]);
  const id = w.idOf(PLAIN);
  await signIn(page, w.email, w.mau);
  await page.goto("/inventory");
  await page.waitForLoadState("networkidle");
  await regionReady(page);
  const dong = (await page
    .locator(`tr[data-row-id="${id}"] button[data-record-open]`)
    .first()
    .textContent())!.trim();
  const o = { dong, cot: "Unit.livingArea" };
  const cell = await oCua(page, o);
  const before = (await cell.textContent())!.trim();
  const type = async (text: string) => {
    const editor = await moSuaO(page, o);
    await editor.locator("input").fill(text);
    await editor.locator("input").press("Enter");
  };

  const sent = await patchesDuring(page, () => type("72,5"));
  expect(sent, "o-dien-tich: one change").toHaveLength(1);
  expect((sent[0] as { change: unknown }).change).toEqual({
    field: "unitAttributes",
    livingArea: 72.5,
  });
  await expect(cell).toHaveText("72,5 m²");
  await expect(page.getByRole("button", { name: "Hoàn tác" })).toBeVisible();
  await expect
    .poll(() => own(id).then((r) => [r["living_area"], r["living_area_source"]]), {
      timeout: 10_000,
    })
    .toEqual([72.5, "Typed"]);
  await chupAnh(page, {
    path: `_acceptance/tin-rao-giu-gia-tri-rieng/evidence/E2b-${info.project.name}.png`,
  });

  await page.reload();
  await page.waitForLoadState("networkidle");
  await regionReady(page);
  const again = await oCua(page, o);
  await expect(again, "o-dien-tich: after a reload").toHaveText("72,5 m²");
  expect(before, "the cell showed another value before").not.toBe("72,5 m²");

  await type("80");
  await expect(again).toHaveText("80 m²");
  await page.getByRole("button", { name: "Hoàn tác" }).click();
  await expect(again, "o-dien-tich: undo").toHaveText("72,5 m²");
  await expect.poll(() => own(id).then((r) => r["living_area"]), { timeout: 10_000 }).toBe(72.5);

  const editor = await moSuaO(page, o);
  const input = editor.locator("input");
  await input.fill("bảy mươi");
  const none = await patchesDuring(page, () => input.press("Enter"));
  expect(none, "o-dien-tich: words send nothing").toEqual([]);
  await expect(editor.getByRole("alert")).toContainText("Chưa hiểu «bảy mươi»");
  await expect(input).toHaveValue("bảy mươi");
});

/** The serious and critical accessibility faults of the page. */
async function axeFaults(page: Page): Promise<string[]> {
  const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
  return violations
    .filter((v) => v.impact === "serious" || v.impact === "critical")
    .map((v) => `${v.id}: ${v.nodes.length}`);
}

/** The colour a CSS colour token draws, read from a probe on the page: no colour is written by hand. */
const tokenColour = (page: Page, token: string): Promise<string> =>
  suaTrang(
    page,
    (t: string) => {
      const probe = document.createElement("span");
      probe.style.color = `var(${t})`;
      document.body.append(probe);
      const c = getComputedStyle(probe).color;
      probe.remove();
      return c;
    },
    token,
  ) as Promise<string>;

test("than-ho-so: status and price on one line, a fixed label column, two even lines per listing at 320, a missing part opens «Sửa», the warning colour (E15b)", async ({
  page,
}, info) => {
  test.skip(
    !["360", "1440"].includes(info.project.name),
    "E15b measures 320 and 360 (phone project), 1440",
  );
  const w = await world(info, "than", ["ListAgent"]);
  // The newest listing of a unit with three: missing two parts, confirmed 15 days ago.
  const id = (
    await owner.query<{ id: string }>(
      `select l.id from listings l join listing_units u on u.listing_id = l.id
        where l.company_id = $1 and u.upi in (
          select lu.upi from listing_units lu join listings l2 on l2.id = lu.listing_id
           where l2.company_id = $1 group by lu.upi having count(*) = 3)
        order by l.original_entry_timestamp desc limit 1`,
      [w.mau.id],
    )
  ).rows[0]!.id;
  await owner.query(
    `update listings set legal_status = null, occupant_type = null,
            last_confirmed_at = now() - interval '15 days' where id = $1`,
    [id],
  );
  await signIn(page, w.email, w.mau);
  const widths = info.project.name === "360" ? [320, 360] : [1440];
  for (const width of widths) {
    if (width !== page.viewportSize()!.width) await page.setViewportSize({ width, height: 800 });
    for (const theme of ["light", "dark"] as const) {
      await page.emulateMedia({ colorScheme: theme });
      await openRecord(page, id);
      const r = record(page);
      // (A) status left, price right, on one line.
      const status = (await r.locator('[data-slot="record-status"]').boundingBox())!;
      const price = (await r.locator('[data-slot="record-price"]').boundingBox())!;
      expect(status.x, `trạng thái bên trái ${width}`).toBeLessThan(price.x);
      expect(
        Math.abs(status.y + status.height / 2 - (price.y + price.height / 2)),
        `một dòng ${width}`,
      ).toBeLessThan(Math.min(status.height, price.height) / 2);
      // (D) the label column.
      const labels = await r
        .locator('[data-slot="record-row-label"]')
        .evaluateAll((els) => els.map((el) => el.getBoundingClientRect().width));
      expect(labels.length, "label column measured").toBeGreaterThan(0);
      const want = width >= 768 ? 120 : 104;
      for (const lw of labels)
        expect(Math.abs(lw - want), `cột nhãn ${width}`).toBeLessThanOrEqual(8);
      // (D) under 360 each listing takes two even lines.
      const items = await r.locator('[data-slot="listings-of-unit"] li').evaluateAll((els) =>
        els.map((el) => {
          const box = el.getBoundingClientRect();
          const tops = new Set(
            [...el.children].map((c) => Math.round(c.getBoundingClientRect().top)),
          );
          return { height: Math.round(box.height), lines: tops.size };
        }),
      );
      expect(items, "ba lần chào").toHaveLength(3);
      if (width === 320) {
        for (const it of items) expect(it.lines, "hai dòng ở 320").toBe(2);
        expect(new Set(items.map((it) => it.height)).size, "cao bằng nhau ở 320").toBe(1);
      }
      // (B), (C) the warning colour of VP11's palette: the dot of a missing value, the stale confirmation.
      const warning = await tokenColour(page, "--warning");
      const warningWords = await tokenColour(page, "--warning-foreground");
      const dot = r.locator('[data-slot="missing-dot"]').first();
      await expect(dot).toBeVisible();
      expect(await dot.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(warning);
      const stale = r.locator('[data-slot="confirmation-stale"]');
      await expect(stale).toHaveText("Quá 14 ngày — nên xác nhận lại");
      expect(await stale.evaluate((el) => getComputedStyle(el).color)).toBe(warningWords);
      expect(await axeFaults(page), `axe ${width} ${theme}`).toEqual([]);
      await chupAnh(page, {
        path: `_acceptance/tin-rao-giu-gia-tri-rieng/evidence/E15b-${width}-${theme}.png`,
      });
    }
    // (B) a missing part pressed opens «Sửa» of its section on that field, and its line comes into view.
    await page.emulateMedia({ colorScheme: "light" });
    await openRecord(page, id);
    await record(page)
      .locator('[data-slot="missing-part"]', { hasText: label("OccupantType") })
      .click();
    const dialog = page
      .getByRole("dialog")
      .filter({ has: page.locator('[data-detail="occupantType"]') });
    await expect(dialog).toBeVisible();
    await expect(dialog.locator('[data-detail="occupantType"]')).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(
      record(page).locator('[data-slot="listing-offer"] [data-field="Listing.occupantType"]'),
    ).toBeInViewport();
  }
});

/** A company with one person and no listing: an import makes new listings on catalog units nobody offers yet. */
async function bareWorld(info: TestInfo, tag: string, roles: string[]) {
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
  return { email, mau: { id, name } };
}

test("dau-xem-truoc: the import's preview marks only the area that differs from the catalog, the file's value shown (E8)", async ({
  page,
}, info) => {
  test.skip(
    !["360", "1440"].includes(info.project.name),
    "E8 measures 1440, and the phone's screen at 360",
  );
  const w = await bareWorld(info, "xem", ["ListAgent"]);
  await signIn(page, w.email, w.mau);
  await page.goto("/nhap-tep");
  await page.waitForLoadState("networkidle");
  if (info.project.name === "360") {
    // Row 11 (signed): below 768 px the import screen says it is for a computer, so there is no preview to mark.
    await expect(page.locator('[data-state="dien-thoai"]')).toHaveText(IMPORT_COPY.phone);
    await expect(page.getByLabel(IMPORT_COPY.drop)).toBeHidden();
    await expect(page.locator('[data-slot="attribute-differs"]')).toHaveCount(0);
    await chupAnh(page, { path: `_acceptance/tin-rao-giu-gia-tri-rieng/evidence/E8-360.png` });
    return;
  }
  // Two catalog units with a code and an area: the first row's area differs, the second's is the catalog's own.
  const units = (
    await owner.query<{ code: string; living_area: number }>(
      `select a.value as code, u.living_area::float8 as living_area
         from catalog_aliases a join catalog_units u on u.unit_key = a.object_key
        where a.kind = 'ma_goc' and u.living_area is not null
        order by a.value limit 2`,
    )
  ).rows;
  expect(units, "two catalog units with a code").toHaveLength(2);
  const differs = units[0]!.living_area + 3.5;
  const csv = [
    "Mã căn,DT,Giá chào,Trạng thái",
    `${units[0]!.code},${differs},4650000000,Đang bán`,
    `${units[1]!.code},${units[1]!.living_area},3900000000,Đang bán`,
  ].join("\n");
  await page
    .getByLabel(IMPORT_COPY.drop)
    .setInputFiles({ name: "e8.csv", mimeType: "text/csv", buffer: Buffer.from(csv, "utf8") });
  const preview = page.locator('[data-state="dem-dau"]');
  const next = page.getByRole("button", { name: new RegExp(`^${IMPORT_COPY.next}`) });
  for (let i = 0; i < 4 && !(await preview.isVisible()); i += 1) await next.click();
  await expect(preview).toBeVisible();
  const marks = page.locator('[data-slot="attribute-differs"]');
  await expect(marks, "dau-xem-truoc: one mark").toHaveCount(1);
  await expect(marks.first()).toHaveAccessibleName(
    `${label("DiffersFromCatalog")}: ${formatArea(units[0]!.living_area)}`,
  );
  // The cell keeps the file's value as the file writes it, the one the import will write.
  // The preview's cell is the span that holds the value and the mark side by side.
  const cell = marks.first().locator("xpath=ancestor::span[contains(@class,'w-40')][1]");
  await expect(cell).toContainText(String(differs));
  await expect(cell).not.toContainText(formatArea(units[0]!.living_area));
  await chupAnh(page, { path: `_acceptance/tin-rao-giu-gia-tri-rieng/evidence/E8-1440.png` });
});
