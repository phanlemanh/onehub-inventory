// Price and status edited in the inventory cell (roadmap row 4, _acceptance/sua-tren-o), in a real browser at the four
// widths. The page has no signed-in session here: ?vai=<role> stands in for the session's role outside production.
// E2, E3, E4-e2e, E5-e2e, E6, E8-e2e, E9, E11 of the contract; case names are the pinned messages.
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

import { assertCardsNotTable, rowsShown } from "./phone-list";

import { label } from "../../src/modules/company-config";
import { shown } from "../../tools/e2e_templates/settle";

const WIDE = new Set(["1024", "1440"]);
const width = () => test.info().project.name;
const wideOnly = () => test.skip(!WIDE.has(width()), "cells are edited from 768 px");

const PRICE = "Listing.listPrice";
const STATUS = "Listing.standardStatus";
const FIELDS = [
  "Listing.unitNumber",
  "Listing.buildingName",
  "Listing.subdivisionName",
  STATUS,
  PRICE,
  "Unit.livingArea",
  "Unit.bedroomsTotal",
  "Listing.lastConfirmedAt",
] as const;

const editor = (page: Page) => page.locator('[data-slot="cell-editor"]');
const line = (page: Page) => page.locator('[data-slot="cell-edit-line"]');
const toasts = (page: Page) => page.locator("[data-sonner-toast]");

/** Every change the sample save door received so far (outside production the page logs them, row 4). */
const saves = (page: Page) =>
  page.evaluate(() =>
    ((window as unknown as { __sampleSaves?: { change: unknown }[] }).__sampleSaves ?? []).map(
      (r) => r.change,
    ),
  );

async function openInventory(page: Page, role = "ListAgent"): Promise<void> {
  await page.goto(`/inventory?vai=${role}`);
  await expect(page.locator('[hidden][id^="S:"]')).toHaveCount(0);
  await expect(
    page.locator('[data-slot="data-region-body"] table[data-slot="data-grid-table"]'),
  ).toHaveAttribute("tabindex", "0");
}

/** The cell of one unit (by its code) and one field. */
const cellOf = (page: Page, unit: string, field: string) =>
  page
    .locator('[data-slot="data-region-body"] tbody tr[data-row-id]')
    .filter({ has: page.locator("button[data-record-open]", { hasText: new RegExp(`^${unit}$`) }) })
    .locator(`td[data-col-id="${field}"]`)
    .first();

/** Selects a cell by clicking its edge, not the words in it (row 3: the words of the code open the record). */
async function select(page: Page, unit: string, field: string): Promise<void> {
  const cell = cellOf(page, unit, field);
  await cell.click({ position: { x: 3, y: 3 } });
  await expect(cell).toHaveAttribute("data-cell-focused", /.*/);
}

/** Tries the three ways into an editor; true when any of them opened one. */
async function anyWayOpens(page: Page, unit: string, field: string): Promise<boolean> {
  for (const way of ["F2", "type", "double"] as const) {
    await select(page, unit, field);
    if (way === "F2") await page.keyboard.press("F2");
    else if (way === "type") await page.keyboard.type("9");
    else await cellOf(page, unit, field).dblclick({ position: { x: 3, y: 3 } });
    // An editor opens within a frame; give it time to show before deciding it did not.
    const opened = await editor(page)
      .waitFor({ state: "attached", timeout: 1_000 })
      .then(() => true)
      .catch(() => false);
    if (opened) {
      await page.keyboard.press("Escape");
      return true;
    }
    // A double click on the code of a unit opens its record (row 3), which is not an editor: close it and go on.
    const record = page.locator('[data-slot="record-panel"]');
    if (await record.isVisible()) {
      await page.keyboard.press("Escape");
      await expect(record).toHaveCount(0);
    }
  }
  return false;
}

async function typeInPrice(page: Page, unit: string, text: string): Promise<void> {
  await select(page, unit, PRICE);
  await page.keyboard.type(text.slice(0, 1));
  await expect(editor(page).getByRole("textbox")).toBeFocused();
  await page.keyboard.type(text.slice(1));
}

test.describe("sua-tren-o", () => {
  test("sua-gia-mot-lan-ghi", async ({ page }) => {
    wideOnly();
    await openInventory(page);
    const before = await cellOf(page, "1101", "Listing.lastConfirmedAt").innerText();
    await typeInPrice(page, "1101", "2,8 tỷ");
    await expect(line(page)).toContainText("Hiểu là: 2.800.000.000 ₫ (2,8 tỷ)");
    // The input sits on the cell it edits, also after the grid scrolled the cell into view (1024, round 2 of S4).
    await expect
      .poll(
        async () => {
          const cell = await cellOf(page, "1101", PRICE).boundingBox();
          const input = await editor(page).getByRole("textbox").boundingBox();
          return cell && input
            ? Math.max(Math.abs(cell.x - input.x), Math.abs(cell.y - input.y))
            : Number.POSITIVE_INFINITY;
        },
        { message: "sua-gia-mot-lan-ghi: khung lệch ô" },
      )
      .toBeLessThanOrEqual(4);
    await page.keyboard.press("Enter");
    await expect(editor(page)).toHaveCount(0);
    await expect(cellOf(page, "1101", PRICE)).toHaveText("2,8 tỷ");
    await expect(cellOf(page, "1101", "Listing.lastConfirmedAt")).not.toHaveText(before);
    await expect
      .poll(() => saves(page), { message: "sua-gia-mot-lan-ghi: lần ghi" })
      .toEqual([{ field: "listPrice", listPrice: 2_800_000_000 }]);
    const done = toasts(page).filter({ hasText: "Đã đổi" });
    await expect(done.getByRole("button", { name: "Hoàn tác" })).toBeVisible();
    await expect(page.getByRole("button", { name: /^Lưu$/ })).toHaveCount(0);
  });

  test("gia-chua-hieu-khong-ghi", async ({ page }) => {
    wideOnly();
    await openInventory(page);
    await typeInPrice(page, "1101", "abc");
    await page.keyboard.press("Enter");
    await expect(line(page)).toContainText("Chưa hiểu «abc» — gõ như 4,65 tỷ hoặc 950 triệu");
    expect(await saves(page), "gia-chua-hieu-khong-ghi: 1 lần ghi").toEqual([]);
    await expect(toasts(page)).toHaveCount(0);
    await page.keyboard.press("Escape");
    await expect(editor(page)).toHaveCount(0);
    await expect(cellOf(page, "1101", PRICE)).toHaveText("2,71 tỷ");
  });

  test("hoi-lai-tai-o", async ({ page }) => {
    wideOnly();
    await openInventory(page);
    await typeInPrice(page, "1101", "4ty65");
    await page.keyboard.press("Enter");
    const ask = page.locator('[data-slot="price-ask"]');
    await expect(ask).toContainText("Giá đổi +72% — đổi chứ?");
    await expect(ask).toContainText("2,71 tỷ → 4,65 tỷ");
    await editor(page).getByRole("button", { name: "Thôi" }).click();
    expect(await saves(page), "hoi-lai-tai-o: Thôi ghi").toEqual([]);
    await page.keyboard.press("Escape");
    await expect(cellOf(page, "1101", PRICE)).toHaveText("2,71 tỷ");
    await typeInPrice(page, "1101", "4ty65");
    await page.keyboard.press("Enter");
    await editor(page).getByRole("button", { name: "Đổi giá" }).click();
    await expect
      .poll(() => saves(page), { message: "hoi-lai-tai-o: Đổi giá ghi" })
      .toEqual([{ field: "listPrice", listPrice: 4_650_000_000 }]);
    await expect(cellOf(page, "1101", PRICE)).toHaveText("4,65 tỷ");
  });

  test("trang-thai-chi-nac-hop-le", async ({ page }) => {
    wideOnly();
    await openInventory(page);
    await select(page, "1101", STATUS);
    await page.keyboard.press("F2");
    const options = editor(page).getByRole("option");
    await expect(options).toHaveText(["Đang giao dịch", "Đã bán", "Tạm ngừng", "Ngừng hẳn"]);
    await options.filter({ hasText: "Đã bán" }).click();
    const dialog = page.locator('[data-slot="status-dialog"]');
    await expect(dialog).toContainText("Đã bán là nấc cuối: không hoàn tác được.");
    const price = dialog.getByLabel(label("ClosePrice"));
    await expect(price).toHaveValue("2.710.000.000");
    // Today in Vietnam, where the companies work (not the UTC date).
    await expect(dialog.getByLabel(label("CloseDate"))).toHaveValue(
      new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ho_Chi_Minh" }).format(new Date()),
    );
    await price.fill("");
    await dialog.getByRole("button", { name: "Đổi trạng thái" }).click();
    await expect(dialog).toContainText("Còn thiếu giá chốt.");
    expect(await saves(page), "trang-thai-chi-nac-hop-le: thiếu giá chốt mà ghi").toEqual([]);
    await price.fill("2,7 tỷ");
    await dialog.getByRole("button", { name: "Đổi trạng thái" }).click();
    await expect
      .poll(() => saves(page), { message: "trang-thai-chi-nac-hop-le: lần ghi" })
      .toEqual([
        expect.objectContaining({
          field: "standardStatus",
          standardStatus: "Closed",
          closePrice: 2_700_000_000,
        }),
      ]);
    const done = toasts(page).filter({ hasText: "Không hoàn tác được." });
    await expect(done).toHaveCount(1);
    await expect(done.getByRole("button", { name: "Hoàn tác" })).toHaveCount(0);
    await expect(cellOf(page, "1101", STATUS)).toContainText("Đã bán");

    await select(page, "1303", STATUS);
    await page.keyboard.press("F2");
    await editor(page).getByRole("option").filter({ hasText: "Ngừng hẳn" }).click();
    await page
      .locator('[data-slot="status-dialog"]')
      .getByRole("button", { name: "Đổi trạng thái" })
      .click();
    await expect(page.locator('[data-slot="status-dialog"]')).toContainText(
      "Còn thiếu lý do ngừng.",
    );
  });

  test("da-ban-khoa", async ({ page }) => {
    wideOnly();
    await openInventory(page);
    for (const field of [PRICE, STATUS]) {
      expect(await anyWayOpens(page, "0606", field), `da-ban-khoa: ${field} mở`).toBe(false);
      await expect(cellOf(page, "0606", field).locator("[aria-description]")).toHaveAttribute(
        "aria-description",
        /Đã bán/,
      );
    }
    expect(await anyWayOpens(page, "1201", STATUS), "da-ban-khoa: Ngừng hẳn mở").toBe(false);
    expect(await anyWayOpens(page, "1201", PRICE), "da-ban-khoa: Ngừng hẳn khoá giá").toBe(true);
  });

  test("khong-quyen-chu-thuong", async ({ page }) => {
    test.skip(width() !== "1440", "one wide size is enough for the role rule");
    await openInventory(page, "CompanyAdmin");
    for (const field of [PRICE, STATUS]) {
      expect(await anyWayOpens(page, "1101", field), `khong-quyen-chu-thuong: ${field}`).toBe(
        false,
      );
    }
  });

  test("dien-thoai-khong-sua", async ({ page }) => {
    test.skip(WIDE.has(width()), "phones only");
    // Row 2b: on a phone the region is a list of listing cards with no cell at all; nothing on a card edits, and
    // tapping the card of 1101 opens its record, never an editor.
    await page.goto(`/inventory?vai=ListAgent`);
    await rowsShown(page);
    await assertCardsNotTable(page, "dien-thoai-khong-sua");
    const controls = await page
      .locator('[data-slot="phone-list"] ul')
      .locator("input, select, textarea, button, [role=combobox]")
      .count();
    expect(controls, "dien-thoai-khong-sua: an edit control on a card").toBe(0);
    await page
      .locator('[data-slot="phone-card"]')
      .filter({ has: page.locator('[data-slot="listing-card-unit"]', { hasText: /^1101$/ }) })
      .first()
      .click();
    await expect(page.locator('[data-slot="record-panel"]')).toBeVisible();
    await expect(editor(page), "dien-thoai-khong-sua: an editor opened").toHaveCount(0);
  });

  test("cot-chi-doc", async ({ page }) => {
    test.skip(width() !== "1440", "the eight columns show whole at 1440");
    // 8 columns × three ways in, each waiting a moment for an editor that should not come.
    test.setTimeout(120_000);
    await openInventory(page);
    const opened: string[] = [];
    for (const field of FIELDS) if (await anyWayOpens(page, "1101", field)) opened.push(field);
    expect(opened, `cot-chi-doc: ${opened.join(", ")} mở`).toEqual([STATUS, PRICE]);
  });

  test("phim-giu-nguyen", async ({ page, context }) => {
    wideOnly();
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await openInventory(page);
    // Enter on a selected price cell opens the record, not the editor.
    await select(page, "1101", PRICE);
    await page.keyboard.press("Enter");
    await expect(page.locator('[data-slot="record-panel"]')).toBeVisible();
    await expect(editor(page)).toHaveCount(0);
    await page.keyboard.press("Escape");
    await expect(page.locator('[data-slot="record-panel"]')).toHaveCount(0);
    // Ctrl/Cmd+C copies the words the cell shows.
    await select(page, "1101", PRICE);
    await page.keyboard.press("ControlOrMeta+c");
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe("2,71 tỷ");
    // Tab writes and moves to the next cell on the right.
    await typeInPrice(page, "1101", "2,72 tỷ");
    await page.keyboard.press("Tab");
    await expect(cellOf(page, "1101", PRICE)).toHaveText("2,72 tỷ");
    await expect(cellOf(page, "1101", "Unit.livingArea")).toHaveAttribute(
      "data-cell-focused",
      /.*/,
    );
    // Esc closes the editor; the edited cell is still selected and the arrows carry on from it.
    await typeInPrice(page, "1101", "3");
    await page.keyboard.press("Escape");
    await expect(editor(page)).toHaveCount(0);
    await expect(cellOf(page, "1101", PRICE)).toHaveAttribute("data-cell-focused", /.*/);
    await page.keyboard.press("ArrowDown");
    await expect(cellOf(page, "1202", PRICE)).toHaveAttribute("data-cell-focused", /.*/);
  });

  for (const colorScheme of ["light", "dark"] as const) {
    test(`axe-sang-toi: ${colorScheme}`, { tag: "@cho" }, async ({ page }) => {
      test.skip(width() !== "1440", "the editors are the same at every wide size");
      await page.emulateMedia({ colorScheme });
      await openInventory(page);
      const check = async (what: string) => {
        const { violations } = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
          .include('[data-slot="cell-editor"], [data-slot="status-dialog"]')
          .analyze();
        expect(violations, `axe-sang-toi: ${colorScheme} ${what}`).toEqual([]);
      };
      await typeInPrice(page, "1101", "2,8 tỷ");
      // Scan only once each editor has finished appearing: a half-faded box reads as low contrast (G-1311-108).
      await shown(editor(page), "khung giá");
      await check("giá");
      await editor(page).getByRole("textbox").fill("4ty65");
      await page.keyboard.press("Enter");
      await shown(page.locator('[data-slot="price-ask"]'), "hỏi lại");
      await check("hỏi lại");
      await page.keyboard.press("Escape");
      await page.keyboard.press("Escape");
      await select(page, "1101", STATUS);
      await page.keyboard.press("F2");
      await shown(editor(page).getByRole("listbox"), "khung trạng thái");
      await check("trạng thái");
      await editor(page).getByRole("option").filter({ hasText: "Đã bán" }).click();
      await shown(page.locator('[data-slot="status-dialog"]'), "hộp đã bán");
      await check("đã bán");
    });
  }
});
