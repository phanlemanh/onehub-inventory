// VP11 chuan-hoa-he-design: editing a cell, the new way (owner 2026-11-27 «Duyệt cả ba lối A», scope gate 2026-11-28
// Hỏi-1). AC-4 Enter edits, AC-5 Space opens the record, AC-6 a pencil on editable cells, AC-7 clicking away saves. At
// 1024 and 1440 (cells are edited from 768 px). Each check is a function run on what the page did (green) and on what
// the broken rule would have done (red, pinned message).
import { expect, test, type Page } from "@playwright/test";

import { regionReady } from "./phone-list";
import { oCua } from "./support/mo-sua-o";

const WIDE = new Set(["1024", "1440"]);
const wideOnly = () =>
  test.skip(!WIDE.has(test.info().project.name), "cells are edited from 768 px");

const editor = (page: Page) => page.locator('[data-slot="cell-editor"]');
const record = (page: Page) => page.locator('[data-slot="record-panel"]');
const line = (page: Page) => page.locator('[data-slot="cell-edit-line"]');
const saves = (page: Page) =>
  page.evaluate(() =>
    ((window as unknown as { __sampleSaves?: { change: unknown }[] }).__sampleSaves ?? []).map(
      (r) => r.change,
    ),
  );

async function openAt(page: Page, path: string, role = "ListAgent"): Promise<void> {
  await page.goto(`${path}?role=${role}`);
  await regionReady(page);
}

async function select(page: Page, dong: string, cot: string): Promise<void> {
  const cell = await oCua(page, { dong, cot });
  await cell.click({ position: { x: 3, y: 3 } });
  await expect(cell).toHaveAttribute("data-cell-focused", /.*/);
}

/** What a key on a selected cell did: an editor opened, the record of which row opened. */
type Outcome = { editor: boolean; record: string | null };

async function outcome(page: Page): Promise<Outcome> {
  // An editor or the record shows within a frame or two; give either the time before reading.
  await Promise.race([
    editor(page).waitFor({ state: "visible", timeout: 1_500 }),
    record(page).waitFor({ state: "visible", timeout: 1_500 }),
  ]).catch(() => {});
  return {
    editor: await editor(page).isVisible(),
    record: (await record(page).count()) ? await record(page).getAttribute("data-record-id") : null,
  };
}

async function rowIdOf(page: Page, dong: string): Promise<string> {
  const cell = await oCua(page, { dong, cot: "Listing.unitNumber" });
  return (await cell.locator("xpath=ancestor::tr[1]").getAttribute("data-row-id")) ?? "";
}

async function reset(page: Page): Promise<void> {
  for (let i = 0; i < 2; i++) await page.keyboard.press("Escape");
  await expect(editor(page)).toHaveCount(0);
  await expect(record(page)).toHaveCount(0);
}

/** AC-4: Enter on an editable cell edits it; on another cell it opens that row's record. */
function checkEnter(cell: { editable: boolean; row: string }, got: Outcome): void {
  if (cell.editable && !got.editor && got.record)
    throw new Error("Enter opened the record on an editable cell");
  if (!cell.editable && got.editor) throw new Error("Enter opened an editor on a locked cell");
  if (cell.editable && got.record) throw new Error("Enter opened the record and an editor");
  if (!cell.editable && got.record !== cell.row)
    throw new Error(`Enter did not open the record of ${cell.row}`);
}

test.describe("AC-4 · Enter edits", () => {
  test("Enter edits the editable cell and opens the record elsewhere", async ({ page }) => {
    wideOnly();
    await openAt(page, "/inventory");
    const cases: [string, string, boolean][] = [
      ["1101", "Giá chào", true],
      ["1101", "Listing.unitNumber", false],
      ["0606", "Giá chào", false],
      // Row 3h: the area is the listing's own value and edits in its cell; the building stays read only.
      ["1101", "Diện tích", true],
      ["1101", "Toà", false],
    ];
    for (const [dong, cot, editable] of cases) {
      await select(page, dong, cot);
      await page.keyboard.press("Enter");
      checkEnter({ editable, row: await rowIdOf(page, dong) }, await outcome(page));
      await reset(page);
    }
  });

  test("a session that may only read opens the record from every cell", async ({ page }) => {
    wideOnly();
    await openAt(page, "/inventory", "CompanyAdmin");
    await select(page, "1101", "Giá chào");
    await page.keyboard.press("Enter");
    checkEnter({ editable: false, row: await rowIdOf(page, "1101") }, await outcome(page));
  });

  test("the sent links open their record with Enter", async ({ page }) => {
    wideOnly();
    await openAt(page, "/sent");
    const first = page.locator('[data-slot="data-region-body"] tbody tr[data-row-id]').first();
    const id = (await first.getAttribute("data-row-id")) ?? "";
    await first
      .locator("td[data-col-id]")
      .nth(2)
      .click({ position: { x: 3, y: 3 } });
    await page.keyboard.press("Enter");
    checkEnter({ editable: false, row: id }, await outcome(page));
  });

  test("the check fails on the old rule and on an editor at a locked cell", () => {
    expect(() => checkEnter({ editable: true, row: "a" }, { editor: false, record: "a" })).toThrow(
      "Enter opened the record on an editable cell",
    );
    expect(() => checkEnter({ editable: false, row: "a" }, { editor: true, record: null })).toThrow(
      "Enter opened an editor on a locked cell",
    );
  });
});

// ---- AC-5 · Space opens the record -------------------------------------------------------------------------------------

type Scroll = { page: number; grid: number };
const scrolls = (page: Page): Promise<Scroll> =>
  page.evaluate(() => ({
    page: document.scrollingElement?.scrollTop ?? 0,
    grid:
      document.querySelector<HTMLElement>(
        '[data-slot="data-region-body"] [data-slot="scroll-area-viewport"]',
      )?.scrollTop ?? 0,
  }));

function checkSpace(row: string, got: Outcome, before: Scroll, after: Scroll): void {
  if (got.record !== row) throw new Error("Space did not open the record");
  if (got.editor) throw new Error("Space opened an editor");
  if (before.page !== after.page || before.grid !== after.grid)
    throw new Error("Space scrolled the grid");
}

test.describe("AC-5 · Space opens the record", () => {
  test("Space on an editable cell opens its record, does not edit, does not scroll", async ({
    page,
  }) => {
    wideOnly();
    await openAt(page, "/inventory");
    await select(page, "1101", "Giá chào");
    const before = await scrolls(page);
    await page.keyboard.press(" ");
    const got = await outcome(page);
    checkSpace(await rowIdOf(page, "1101"), got, before, await scrolls(page));
  });

  test("Space opens a sent link's record", async ({ page }) => {
    wideOnly();
    await openAt(page, "/sent");
    const first = page.locator('[data-slot="data-region-body"] tbody tr[data-row-id]').first();
    const id = (await first.getAttribute("data-row-id")) ?? "";
    await first
      .locator("td[data-col-id]")
      .nth(2)
      .click({ position: { x: 3, y: 3 } });
    const before = await scrolls(page);
    await page.keyboard.press(" ");
    checkSpace(id, await outcome(page), before, await scrolls(page));
  });

  test("in an open editor Space types a space", async ({ page }) => {
    wideOnly();
    await openAt(page, "/inventory");
    await select(page, "1101", "Giá chào");
    await page.keyboard.press("Enter");
    const input = editor(page).getByRole("textbox");
    await input.fill("2,8");
    await page.keyboard.press(" ");
    await page.keyboard.type("tỷ");
    await expect(input).toHaveValue("2,8 tỷ");
    await expect(record(page)).toHaveCount(0);
  });

  test("the check fails when Space does nothing or scrolls", () => {
    const still = { page: 0, grid: 0 };
    expect(() => checkSpace("a", { editor: false, record: null }, still, still)).toThrow(
      "Space did not open the record",
    );
    expect(() =>
      checkSpace("a", { editor: false, record: "a" }, still, { page: 0, grid: 120 }),
    ).toThrow("Space scrolled the grid");
  });
});

// ---- AC-6 · a pencil on editable cells ---------------------------------------------------------------------------------

type Pencil = { shown: boolean; title: string; rightHalf: boolean };

async function pencilOf(page: Page, dong: string, cot: string): Promise<Pencil> {
  const cell = await oCua(page, { dong, cot });
  return cell.evaluate((td) => {
    const p = td.querySelector<HTMLElement>('[data-slot="cell-pencil"]');
    if (!p) return { shown: false, title: "", rightHalf: false };
    const [a, b] = [p.getBoundingClientRect(), td.getBoundingClientRect()];
    return {
      shown: Number(getComputedStyle(p).opacity) > 0.9 && a.width > 0,
      title: p.getAttribute("title") ?? "",
      rightHalf: a.left >= b.left + b.width / 2,
    };
  });
}

function checkPencil(editable: boolean, p: Pencil, where: string, hover = true): void {
  if (!editable && p.shown) throw new Error(`pencil on a cell that does not edit: ${where}`);
  if (editable && !p.shown)
    throw new Error(
      hover
        ? `no pencil on an editable cell: ${where}`
        : `no pencil on the selected cell without hover: ${where}`,
    );
  if (editable && (!p.title || !p.rightHalf))
    throw new Error(`pencil without its hint or off the right: ${where}`);
}

test.describe("AC-6 · a pencil on editable cells", () => {
  test("hovering shows the pencil on editable cells only", async ({ page }) => {
    wideOnly();
    await openAt(page, "/inventory");
    const cases: [string, string, boolean][] = [
      ["1101", "Giá chào", true],
      ["0606", "Giá chào", false],
      // Row 3h: the area is the listing's own value and edits in its cell; the building stays read only.
      ["1101", "Diện tích", true],
      ["1101", "Toà", false],
      ["1101", "Listing.unitNumber", false],
    ];
    let editable = 0;
    for (const [dong, cot, can] of cases) {
      await (await oCua(page, { dong, cot })).hover({ position: { x: 3, y: 3 } });
      await page.waitForTimeout(250);
      checkPencil(can, await pencilOf(page, dong, cot), `${dong} ${cot}`);
      if (can) editable += 1;
    }
    expect(editable, "no editable cell found").toBeGreaterThan(0);
  });

  test("a session that may only read sees no pencil", async ({ page }) => {
    wideOnly();
    await openAt(page, "/inventory", "CompanyAdmin");
    await (await oCua(page, { dong: "1101", cot: "Giá chào" })).hover({ position: { x: 3, y: 3 } });
    await page.waitForTimeout(250);
    checkPencil(false, await pencilOf(page, "1101", "Giá chào"), "read-only 1101 Giá chào");
  });

  test("a device that cannot hover shows the pencil on the selected editable cell", async ({
    browser,
  }) => {
    test.skip(test.info().project.name !== "1024", "a tablet at 1024");
    const context = await browser.newContext({
      viewport: { width: 1024, height: 768 },
      hasTouch: true,
      isMobile: true,
    });
    const page = await context.newPage();
    await openAt(page, "/inventory");
    await (await oCua(page, { dong: "1101", cot: "Giá chào" })).tap({ position: { x: 3, y: 3 } });
    await page.waitForTimeout(250);
    checkPencil(true, await pencilOf(page, "1101", "Giá chào"), "tablet 1101 Giá chào", false);
    await context.close();
  });

  test("the check fails on a pencil everywhere and on no pencil without hover", () => {
    const on = { shown: true, title: "Bấm Enter để đổi ô này", rightHalf: true };
    expect(() => checkPencil(false, on, "Diện tích")).toThrow(
      "pencil on a cell that does not edit",
    );
    expect(() => checkPencil(true, { ...on, shown: false }, "tablet", false)).toThrow(
      "no pencil on the selected cell without hover",
    );
  });
});

// ---- AC-7 · clicking away saves ----------------------------------------------------------------------------------------

async function typeInPrice(page: Page, dong: string, text: string): Promise<void> {
  await select(page, dong, "Giá chào");
  await page.keyboard.press("Enter");
  const input = editor(page).getByRole("textbox");
  await expect(input).toBeFocused();
  await input.fill(text);
}

test.describe("AC-7 · clicking away saves", () => {
  test("a value read is saved once, with «Hoàn tác», and the clicked cell is selected", async ({
    page,
  }) => {
    wideOnly();
    await openAt(page, "/inventory");
    await typeInPrice(page, "1101", "2,8 tỷ");
    const other = await oCua(page, { dong: "1202", cot: "Diện tích" });
    await other.click({ position: { x: 3, y: 3 } });
    await expect(editor(page), "clicking away dropped the typed value").toHaveCount(0);
    await expect(await oCua(page, { dong: "1101", cot: "Giá chào" })).toHaveText("2,8 tỷ");
    await expect
      .poll(() => saves(page), { message: "clicking away dropped the typed value" })
      .toEqual([{ field: "listPrice", listPrice: 2_800_000_000 }]);
    await expect(
      page.locator("[data-sonner-toast]").getByRole("button", { name: "Hoàn tác" }),
    ).toBeVisible();
    await expect(other).toHaveAttribute("data-cell-focused", /.*/);
  });

  test("a big change asks again, as Enter does", async ({ page }) => {
    wideOnly();
    await openAt(page, "/inventory");
    await typeInPrice(page, "1101", "4ty65");
    await (
      await oCua(page, { dong: "1202", cot: "Diện tích" })
    ).click({ position: { x: 3, y: 3 } });
    await expect(page.locator('[data-slot="price-ask"]')).toContainText("Giá đổi +72% — đổi chứ?");
    expect(await saves(page)).toEqual([]);
  });

  test("a value not understood keeps the editor and writes nothing", async ({ page }) => {
    wideOnly();
    await openAt(page, "/inventory");
    await typeInPrice(page, "1101", "abc");
    await (
      await oCua(page, { dong: "1202", cot: "Diện tích" })
    ).click({ position: { x: 3, y: 3 } });
    await expect(editor(page)).toBeVisible();
    await expect(line(page)).toContainText("Chưa hiểu «abc»");
    expect(await saves(page), "an unread value was saved").toEqual([]);
    await page.keyboard.press("Escape");
    await expect(await oCua(page, { dong: "1101", cot: "Giá chào" })).toHaveText("2,71 tỷ");
  });

  test("Esc writes nothing, Tab writes and moves on", async ({ page }) => {
    wideOnly();
    await openAt(page, "/inventory");
    await typeInPrice(page, "1101", "2,9 tỷ");
    await page.keyboard.press("Escape");
    await expect(editor(page)).toHaveCount(0);
    expect(await saves(page)).toEqual([]);
    await typeInPrice(page, "1101", "2,72 tỷ");
    await page.keyboard.press("Tab");
    await expect(await oCua(page, { dong: "1101", cot: "Giá chào" })).toHaveText("2,72 tỷ");
    await expect
      .poll(() => saves(page))
      .toEqual([{ field: "listPrice", listPrice: 2_720_000_000 }]);
    await expect(await oCua(page, { dong: "1101", cot: "Giá chào" })).not.toHaveAttribute(
      "data-cell-focused",
      /.*/,
    );
  });
});
