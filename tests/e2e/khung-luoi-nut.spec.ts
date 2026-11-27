// decision:wcag-aa
// Buttons of the grid's frame the owner settled on 2026-11-27 (BH session, «Duyệt cả sáu điểm», side work VP10
// khung-luoi-va-ngan-chi-tiet): L2 the × of a dialog or sheet reads «Đóng»; L3 the filter row stands level; L6 the
// second column's fold handle shows plainly when the pointer is on the column's edge. L1, L5 are measured in
// the-dien-thoai.spec.ts, L4 in sheet.spec.ts.
import { expect, test, type Page } from "@playwright/test";

import { isPhone, regionHydrated, rowsShown } from "./phone-list";
import { suaTrang, themKieu } from "./sua-trang";

const table = (page: Page) =>
  page.locator('[data-slot="data-region-body"] table[data-slot="data-grid-table"]');

/** Bảng hàng as a listing agent, who may save a view (its dialog is the one opened here). */
async function openInventory(page: Page): Promise<void> {
  await page.goto("/inventory?role=ListAgent");
  await expect(page.locator('[hidden][id^="S:"]')).toHaveCount(0);
  if (isPhone(page)) {
    await rowsShown(page);
    await regionHydrated(page);
    return;
  }
  await expect(table(page)).toHaveAttribute("tabindex", "0");
}

// ---- L2 · the × reads «Đóng» ----------------------------------------------------------------------------------------

/** The corner × of the open dialog or sheet is named «Đóng», and nothing on the page is named «Close». */
async function assertCloseNamed(page: Page, within: string): Promise<void> {
  const names = await page
    .locator(`${within} [data-slot$="-close"]:has(.sr-only)`)
    .evaluateAll((els) =>
      els.map((el) => (el as HTMLElement).innerText.trim() || el.getAttribute("aria-label")),
    );
  if (names.length === 0) throw new Error("no corner close");
  if (names.some((name) => name !== "Đóng"))
    throw new Error(`corner close reads ${names.join(", ")}`);
  if ((await page.getByRole("button", { name: "Close", exact: true }).count()) > 0)
    throw new Error("a button reads «Close»");
}

test.describe("L2 · the × of a dialog or sheet reads «Đóng»", () => {
  test("the filter sheet on a phone, the save-view dialog on a computer", async ({ page }) => {
    await openInventory(page);
    if (isPhone(page)) {
      await page.locator('[data-slot="phone-filter-button"]').click();
      await expect(page.getByRole("dialog", { name: "Lọc" })).toBeVisible();
      await assertCloseNamed(page, '[data-slot="sheet-content"]');
      await page.getByRole("button", { name: "Đóng", exact: true }).click();
      await expect(page.getByRole("dialog", { name: "Lọc" })).toBeHidden();
      return;
    }
    await page.locator("[data-slot=save-view]:visible").first().click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await assertCloseNamed(page, '[data-slot="dialog-content"], [role="dialog"]');
    await page.getByRole("dialog").getByRole("button", { name: "Đóng", exact: true }).click();
    await expect(page.getByRole("dialog")).toBeHidden();
  });

  test("break: a × that still reads «Close» is caught", async ({ page }) => {
    await openInventory(page);
    if (isPhone(page)) await page.locator('[data-slot="phone-filter-button"]').click();
    else await page.locator("[data-slot=save-view]:visible").first().click();
    const within = isPhone(page) ? '[data-slot="sheet-content"]' : '[role="dialog"]';
    await suaTrang(page.locator(`${within} [data-slot$="-close"] .sr-only`).first(), (el) => {
      el.textContent = "Close";
    });
    await expect(assertCloseNamed(page, within)).rejects.toThrow(/Close/);
  });
});

// ---- L3 · the filter row stands level ---------------------------------------------------------------------------------

/** Every filter control under the headers is one height, and the column titles above them stand on one line. */
async function assertFilterRowLevel(page: Page): Promise<void> {
  const g = await page.evaluate(() => {
    const head = document.querySelector('[data-slot="data-region-body"] thead')!;
    const controls = [
      ...head.querySelectorAll<HTMLElement>('[data-slot="column-filter"] :is(input, button)'),
    ]
      .filter((el) => el.offsetParent !== null)
      .map((el) => el.getBoundingClientRect().height);
    const titles = [...head.querySelectorAll<HTMLElement>('[data-slot="sheet-header"]')]
      .map((el) => el.firstElementChild?.getBoundingClientRect().top ?? 0)
      .filter((top) => top > 0);
    return { controls, titles };
  });
  if (g.controls.length < 2) throw new Error("no filter row");
  const tall = Math.max(...g.controls);
  const short = Math.min(...g.controls);
  if (tall - short > 0.5) throw new Error(`filter boxes ${short}–${tall}px high`);
  if (Math.max(...g.titles) - Math.min(...g.titles) > 0.5)
    throw new Error("column titles not level");
}

test.describe("L3 · the filter row stands level", () => {
  test.beforeEach(({ page }) => test.skip(isPhone(page), "bảng từ 768"));

  test("one height for typing boxes and «Chọn», titles on one line", async ({ page }) => {
    await openInventory(page);
    await assertFilterRowLevel(page);
  });

  test("break: a typing box 4 px taller is caught", async ({ page }) => {
    await openInventory(page);
    await themKieu(page, {
      content: '[data-slot="column-filter"] input { height: 32px !important; }',
    });
    await expect(assertFilterRowLevel(page)).rejects.toThrow("filter boxes");
  });
});

// ---- L6 · the fold handle shows on the column's edge --------------------------------------------------------------

/** With the pointer on the second column's edge, away from the handle, the handle stands out and names itself. */
async function handleOnEdge(page: Page): Promise<{ framed: boolean; hint: string | null }> {
  const edge = (await page.locator('[data-slot="app-shell-second-column-edge"]').boundingBox())!;
  const height = page.viewportSize()!.height;
  await page.mouse.move(edge.x + edge.width - 1, Math.round(height / 4));
  await page.waitForTimeout(250);
  const framed = await page
    .locator('[data-slot="second-column-rail-frame"]')
    .evaluate((el) => getComputedStyle(el).boxShadow !== "none");
  const hint = await page.locator('[data-slot="second-column-rail"]').getAttribute("title");
  return { framed, hint };
}

test.describe("L6 · the second column's fold handle shows on its edge", () => {
  test.beforeEach(({ page }) => test.skip(isPhone(page), "cột thứ hai từ 768"));

  test("the pointer on the edge frames the handle; it says what a press does", async ({ page }) => {
    await openInventory(page);
    await page.mouse.move(600, 300);
    expect(
      await page
        .locator('[data-slot="second-column-rail-frame"]')
        .evaluate((el) => getComputedStyle(el).boxShadow),
    ).toBe("none");
    const shown = await handleOnEdge(page);
    expect(shown.framed, "handle framed on the edge").toBe(true);
    expect(shown.hint).toBe("Gập cột thứ hai");
  });

  test("break: an edge that does not answer the pointer is caught", async ({ page }) => {
    await openInventory(page);
    await themKieu(page, {
      content: '[data-slot="second-column-edge-hover"] { pointer-events: none !important; }',
    });
    expect((await handleOnEdge(page)).framed).toBe(false);
  });
});
