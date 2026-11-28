// VP11 chuan-hoa-he-design, AC-7 (E18, cross-layer): clicking away from a cell's editor writes once to /api/v1 on this
// lane's Postgres, as Enter does; Esc and a value not understood write nothing; a reload reads the new price back. 1440.
import { existsSync, readFileSync } from "node:fs";

import { expect, test, type Page, type TestInfo } from "@playwright/test";
import pg from "pg";

import { DB_URL, OUTBOX } from "../../playwright.db.config";
import { sampleInventoryData } from "../../src/app/(app)/inventory-sample-data";
import { companyListingId, seedSampleInventory } from "../db/can-mau";
import { moSuaO, oCua } from "../e2e/support/mo-sua-o";
import { pageReady } from "../e2e/sua-trang";

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
/** A listing of the signed-in person, at a status whose price edits in place, with a price. */
const ROW = (() => {
  const l = DATA.current.find(
    (x) =>
      DATA.keepers[x.id]?.kind === "viewer" &&
      ["Active", "Hold"].includes(x.standardStatus) &&
      (x.listPrice ?? 0) > 0,
  )!;
  return { id: l.id, unit: UNIT_OF.get(l.id)!.unitNumber };
})();

async function world(info: TestInfo) {
  const stamp = `vp11-${info.project.name}-${Date.now()}`;
  const c = (
    await owner.query<{ id: string }>("insert into companies (name) values ($1) returning id", [
      `[MAU ${stamp}]`,
    ])
  ).rows[0]!;
  const email = `vp11-${stamp}@example.test`;
  const user = (
    await owner.query<{ id: string }>(
      "insert into identity.users (email, name) values ($1, $2) on conflict (email) do update set name = excluded.name returning id",
      [email, "[Tên] VP11"],
    )
  ).rows[0]!.id;
  await owner.query(
    "insert into company_members (company_id, user_id, name, roles) values ($1, $2, $3, $4)",
    [c.id, user, "[Tên] VP11", ["ListAgent"]],
  );
  await seedSampleInventory(owner, c.id, { id: user, name: "[Tên] VP11" });
  return { email, company: c.id, name: `[MAU ${stamp}]`, listing: companyListingId(c.id, ROW.id) };
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

async function signIn(page: Page, email: string, into: string) {
  const before = codes(email).length;
  await page.goto("/login");
  await expect(page.locator('[data-state="email"][data-ready]')).toBeVisible();
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Email").press("Enter");
  await expect.poll(() => codes(email).length, { timeout: 10_000 }).toBe(before + 1);
  const code = page.getByLabel("Mã đăng nhập");
  await code.fill(codes(email).at(-1)!);
  await code.press("Enter");
  const choose = page.locator('[data-state="choose-company"]');
  await expect(choose.or(page.locator('[data-slot="account-menu"][data-ready]'))).toBeVisible();
  if (await choose.isVisible()) await choose.getByRole("button", { name: into }).click();
}

/** The grid on the one unit (row 3f's search address); its record is closed so the row is on screen. */
async function openOn(page: Page) {
  await page.goto(`/inventory?unit=${encodeURIComponent(ROW.unit)}`);
  await page.waitForLoadState("networkidle");
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
  await pageReady(page);
}

const writes = (page: Page) => {
  const seen: unknown[] = [];
  page.on("request", (r) => {
    if (["PATCH", "POST", "PUT"].includes(r.method()) && r.url().includes("/api/v1/listings"))
      seen.push(r.postDataJSON());
  });
  return seen;
};

const priceOf = async (id: string) =>
  Number(
    (
      await owner.query<{ list_price: string }>("select list_price from listings where id = $1", [
        id,
      ])
    ).rows[0]!.list_price,
  );

/** One edit, one write: more is a second write, none is a lost value. */
function checkWrites(kind: string, want: 0 | 1, got: number): void {
  if (got > want) throw new Error(`two writes for one edit (${kind}: ${got})`);
  if (got < want) throw new Error(`value lost: no write (${kind})`);
}

function checkReload(want: string, shown: string): void {
  if (!shown.includes(want))
    throw new Error(`value lost after reload: shows «${shown}», not «${want}»`);
}

/** Leaves the editor by clicking another cell of the row, and gives a late second write the time to show. */
async function clickAway(page: Page) {
  await (
    await oCua(page, { dong: ROW.unit, cot: "Diện tích" })
  ).click({ position: { x: 3, y: 3 } });
  await page.waitForTimeout(800);
}

test("AC-7 · one write for one edit, by clicking away, by Enter; none by Esc or an unread value", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "1440", "measured at 1440");
  const w = await world(info);
  const sent = writes(page);
  await signIn(page, w.email, w.name);
  await openOn(page);

  // Clicking away.
  let ed = await moSuaO(page, { dong: ROW.unit, cot: "Giá chào" });
  await ed.getByRole("textbox").fill("2,8 tỷ");
  await clickAway(page);
  const ask = page.locator('[data-slot="price-ask"]');
  if (await ask.isVisible()) await page.getByRole("button", { name: "Đổi giá" }).click();
  await expect.poll(() => priceOf(w.listing)).toBe(2_800_000_000);
  await page.waitForTimeout(500);
  checkWrites("click away", 1, sent.length);

  // Enter, then a click on another cell: still the one write.
  sent.length = 0;
  ed = await moSuaO(page, { dong: ROW.unit, cot: "Giá chào" });
  await ed.getByRole("textbox").fill("2,9 tỷ");
  await page.keyboard.press("Enter");
  await expect.poll(() => priceOf(w.listing)).toBe(2_900_000_000);
  await clickAway(page);
  checkWrites("Enter", 1, sent.length);

  // Esc, and a value not understood then a click away: no write.
  sent.length = 0;
  ed = await moSuaO(page, { dong: ROW.unit, cot: "Giá chào" });
  await ed.getByRole("textbox").fill("3 tỷ");
  await page.keyboard.press("Escape");
  ed = await moSuaO(page, { dong: ROW.unit, cot: "Giá chào" });
  await ed.getByRole("textbox").fill("abc");
  await clickAway(page);
  await expect(ed).toBeVisible();
  await page.keyboard.press("Escape");
  checkWrites("Esc and unread", 0, sent.length);
  expect(await priceOf(w.listing)).toBe(2_900_000_000);

  // A reload reads the price from the server.
  await openOn(page);
  checkReload("2,9 tỷ", await (await oCua(page, { dong: ROW.unit, cot: "Giá chào" })).innerText());
});

// ---- AC-4 · Enter on a screen without a record (Tuỳ chỉnh của sàn) ------------------------------------------------------
// The screen is signed in, so it is measured here. E5 runs this case with the AC-4 cases of tests/e2e/chuan-hoa-sua-o.

type Moved = { from: string; to: string | null; editor: boolean; record: boolean };

/** AC-4 on a screen with no record: Enter on a selected cell selects the cell below, opens nothing. */
function checkEnterDown(got: Moved, below: string): void {
  if (got.editor) throw new Error("Enter opened an editor on a screen without a record");
  if (got.record) throw new Error("Enter opened a record on a screen without a record");
  if (got.to !== below)
    throw new Error(
      `Enter did not move to the cell below: on row ${got.to ?? "none"}, want ${below}`,
    );
}

test("AC-4 · on Tuỳ chỉnh của sàn Enter selects the cell below", async ({ page }, info) => {
  test.skip(info.project.name !== "1440", "measured at 1440");
  const w = await world(info);
  await signIn(page, w.email, w.name);
  // A new company has no label of its own: two rows, so there is a cell below to move to.
  for (const [concept, label] of [
    ["Building", "Block"],
    ["Subdivision", "Phân khu"],
  ]) {
    const r = await page.request.post("/api/v1/company-layer/labels", { data: { concept, label } });
    expect(r.ok(), `label ${concept}: ${r.status()}`).toBe(true);
  }
  await page.goto("/company-layer?part=labels");
  await expect(page.locator('[data-part="labels"][data-state="ready"]')).toBeVisible();
  const rows = page.locator('[data-slot="data-region-body"] tbody tr[data-row-id]');
  expect(await rows.count(), "fewer than two rows: nothing to move to").toBeGreaterThan(1);
  const [from, below] = await Promise.all(
    [0, 1].map((i) => rows.nth(i).getAttribute("data-row-id")),
  );
  const cell = rows
    .nth(0)
    .locator('td[data-col-id]:not([data-col-id="row-number"]):not([data-col-id="row-actions"])')
    .first();
  await cell.click({ position: { x: 3, y: 3 } });
  await expect(cell).toHaveAttribute("data-cell-focused", /.*/);
  await page.keyboard.press("Enter");
  await page.waitForTimeout(300);
  const to = await page
    .locator('[data-slot="data-region-body"] td[data-cell-focused]')
    .evaluate((td) => td.closest("tr")?.getAttribute("data-row-id") ?? null)
    .catch(() => null);
  checkEnterDown(
    {
      from: from!,
      to,
      editor: await page.locator('[data-slot="cell-editor"]').isVisible(),
      record: (await page.locator('[data-slot="record-panel"]').count()) > 0,
    },
    below!,
  );
});

test("AC-4 · the check fails when Enter stays, opens an editor or a record", () => {
  const base = { from: "a", to: "b", editor: false, record: false };
  expect(() => checkEnterDown({ ...base, to: "a" }, "b")).toThrow(
    "Enter did not move to the cell below",
  );
  expect(() => checkEnterDown({ ...base, to: null }, "b")).toThrow(
    "Enter did not move to the cell below",
  );
  expect(() => checkEnterDown({ ...base, editor: true }, "b")).toThrow("opened an editor");
  expect(() => checkEnterDown({ ...base, record: true }, "b")).toThrow("opened a record");
});

test("AC-7 · the checks fail on a second write and on a value lost after reload", () => {
  expect(() => checkWrites("click away", 1, 2)).toThrow("two writes for one edit");
  expect(() => checkWrites("click away", 1, 0)).toThrow("value lost: no write");
  expect(() => checkReload("2,9 tỷ", "2,71 tỷ")).toThrow("value lost after reload");
});
