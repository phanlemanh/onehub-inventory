// Row 2b (_acceptance/bang-hang-the-dien-thoai): below 768 px the inventory region is a list of listing cards, not a
// table. Older browser tests that read the table on a phone use these helpers: wait for whichever the width shows, read a
// filter through the filter sheet, and — for checks that only a table has (sheet keys, frozen columns, column widths,
// full screen) — measure on a phone that the table is absent and the card list present, never skip empty.
import { expect, type Page } from "@playwright/test";

/** Cards below this width, the table from it (src/hooks/use-mobile.ts). */
export const PHONE_BELOW = 768;

export const isPhone = (page: Page): boolean => (page.viewportSize()?.width ?? 1440) < PHONE_BELOW;

export const phoneCards = (page: Page) => page.locator('[data-slot="phone-card"]');

/** The region has drawn its rows: table rows from 768 px, cards below it. */
export async function rowsShown(page: Page): Promise<void> {
  if (isPhone(page)) await phoneCards(page).first().waitFor();
  else await page.locator('[data-slot="data-region"] tbody tr').first().waitFor();
}

/** Hydrated: the grid's scroll area takes focus from 768 px; below it the filter button answers. */
export async function regionHydrated(page: Page): Promise<void> {
  if (isPhone(page)) {
    await expect(page.locator('[data-slot="phone-filter-button"]')).toBeEnabled();
    await page.waitForLoadState("networkidle");
    return;
  }
  await expect(
    page.locator('[data-slot="data-region-body"] [data-slot="scroll-area-viewport"]').first(),
  ).toHaveAttribute("tabindex", "0");
}

/**
 * The measured stand-in, on a phone, for a check that only a table has: no table in the region, the card list there
 * with at least one card. Throws a pinned message naming the check it stands in for.
 */
export async function assertCardsNotTable(page: Page, check: string): Promise<void> {
  const tables = await page.locator('[data-slot="data-region"] table').count();
  const cards = await phoneCards(page).count();
  if (tables > 0 || cards === 0)
    throw new Error(
      `${check}: on a phone the region must be cards, not a table (table ${tables}, cards ${cards})`,
    );
}

/** The phone filter sheet, by its title «Lọc». */
export const phoneFilterSheet = (page: Page) => page.getByRole("dialog", { name: "Lọc" });

/** Opens the phone filter sheet and returns the filter box of one column. */
export async function phoneFilterBox(page: Page, column: string) {
  if (
    !(await phoneFilterSheet(page)
      .isVisible()
      .catch(() => false))
  )
    await page.locator('[data-slot="phone-filter-button"]').click();
  await expect(phoneFilterSheet(page)).toBeVisible();
  return phoneFilterSheet(page).getByLabel(`Lọc cột ${column}`);
}

/** Closes the phone filter sheet with its close button (a filter box keeps Escape for itself). */
export async function closePhoneSheet(page: Page): Promise<void> {
  await phoneFilterSheet(page).locator('[data-slot="sheet-close"]').last().click();
  await expect(phoneFilterSheet(page)).toBeHidden();
}

/** The unit codes of the cards, in order. */
export const cardCodes = (page: Page): Promise<string[]> =>
  page
    .locator('[data-slot="phone-card"] [data-slot="listing-card-unit"]')
    .evaluateAll((els) => els.map((e) => (e.textContent ?? "").trim()));

/** The unit code an opener shows: the card's unit slot on a phone, the cell's text on the table. */
export async function openerCode(opener: ReturnType<Page["locator"]>): Promise<string> {
  const slot = opener.locator('[data-slot="listing-card-unit"]');
  return (
    ((await slot.count()) > 0 ? await slot.textContent() : await opener.textContent()) ?? ""
  ).trim();
}

/** The unit codes of every opener, in order. */
export const openerCodes = (page: Page): Promise<string[]> =>
  page
    .locator("[data-record-open]")
    .evaluateAll((els) =>
      els.map((e) =>
        ((e.querySelector('[data-slot="listing-card-unit"]') ?? e).textContent ?? "").trim(),
      ),
    );

/** What the «Căn» column filter holds: read in the filter sheet on a phone (then closed), in place from 768 px. */
export async function unitFilterValue(page: Page): Promise<string> {
  if (!isPhone(page)) return page.locator('input[aria-label="Lọc cột Căn"]').inputValue();
  const box = await phoneFilterBox(page, "Căn");
  const value = await box.inputValue();
  await closePhoneSheet(page);
  return value;
}

/** The stand-in for a table-only check on a phone: open the inventory and measure cards, not a table. */
export async function phoneStandIn(page: Page, check: string, path = "/inventory"): Promise<void> {
  await page.goto(path);
  await rowsShown(page);
  await assertCardsNotTable(page, check);
}

/** Its break: with the cards taken out, the stand-in must fail with its pinned message. */
export async function phoneStandInBreak(
  page: Page,
  check: string,
  path = "/inventory",
): Promise<void> {
  await page.goto(path);
  await rowsShown(page);
  await page.evaluate(() =>
    document.querySelectorAll('[data-slot="phone-card"]').forEach((el) => el.remove()),
  );
  await expect(assertCardsNotTable(page, check)).rejects.toThrow(
    `${check}: on a phone the region must be cards, not a table`,
  );
}
