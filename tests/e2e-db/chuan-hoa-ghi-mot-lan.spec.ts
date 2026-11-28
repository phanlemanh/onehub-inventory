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

test("AC-7 · the checks fail on a second write and on a value lost after reload", () => {
  expect(() => checkWrites("click away", 1, 2)).toThrow("two writes for one edit");
  expect(() => checkWrites("click away", 1, 0)).toThrow("value lost: no write");
  expect(() => checkReload("2,9 tỷ", "2,71 tỷ")).toThrow("value lost after reload");
});
