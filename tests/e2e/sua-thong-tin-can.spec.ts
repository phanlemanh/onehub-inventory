// Row 3g (_acceptance/sua-thong-tin-can), at the four sizes, on the sample company: «Sửa» of the record's open listing,
// the dialog of the four details, «Hoàn tác», axe in light and dark, focus back on «Sửa». Case names are the record's
// pinned messages (evals.yaml, E2, E9).
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

import { regionReady } from "./phone-list";
import { pageReady } from "./sua-trang";

const AXE_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
/** A sample listing that is open and the newest of its unit (unit 1101). */
const ID = "4d415500-0001-4000-8000-000000000002";

async function openRecord(page: Page): Promise<void> {
  await page.goto(`/inventory?vai=ListAgent&ho-so=${ID}`);
  await regionReady(page);
  await pageReady(page, { el: page.locator('[data-slot="listing-details-edit-open"]') });
  await page.locator('[data-slot="listing-offer"]').first().scrollIntoViewIfNeeded();
}

const field = (page: Page, key: string) =>
  page.locator(`[data-slot="listing-offer"] [data-field="${key}"] dd`).first();
const count = (page: Page) => page.locator('[data-slot="listing-completeness-count"]').first();

test.describe("sua-thong-tin-can", () => {
  test("sua-bon-truong: a save shows the new value and counts again", async ({ page }) => {
    await openRecord(page);
    const before = await count(page).textContent();
    await page.locator('[data-slot="listing-details-edit-open"]').first().click();
    const dialog = page.locator('[data-slot="listing-details-edit"]');
    await dialog.locator('input[data-detail="financing"]').fill("Hỗ trợ vay 70% [MAU]");
    await dialog.getByRole("button", { name: "Lưu" }).click();
    await expect(dialog).toBeHidden();
    await expect(field(page, "Listing.financing"), "sua-bon-truong: mục").toHaveText(
      "Hỗ trợ vay 70% [MAU]",
    );
    await expect(count(page), "sua-bon-truong: đếm lại").not.toHaveText(before ?? "");
    // Focus goes back to «Sửa» when the dialog closes.
    await expect(page.locator('[data-slot="listing-details-edit-open"]').first()).toBeFocused();
  });

  test("hoan-tac-bon-truong: «Hoàn tác» puts the section back", async ({ page }) => {
    await openRecord(page);
    const before = await field(page, "Listing.financing").textContent();
    await page.locator('[data-slot="listing-details-edit-open"]').first().click();
    const dialog = page.locator('[data-slot="listing-details-edit"]');
    await dialog.locator('input[data-detail="financing"]').fill("Vay 50% [MAU]");
    await dialog.getByRole("button", { name: "Lưu" }).click();
    await expect(field(page, "Listing.financing")).toHaveText("Vay 50% [MAU]");
    await page.locator("[data-sonner-toast]").getByRole("button", { name: "Hoàn tác" }).click();
    await expect(field(page, "Listing.financing"), "hoan-tac-bon-truong").toHaveText(before ?? "");
  });

  test("thong-bao-khong-de-nut-chinh: the notice after a save sits clear of the record's main button", async ({
    page,
  }) => {
    await openRecord(page);
    await page.locator('[data-slot="listing-details-edit-open"]').first().click();
    const dialog = page.locator('[data-slot="listing-details-edit"]');
    await dialog.locator('input[data-detail="financing"]').fill("Không vay [MAU]");
    await dialog.getByRole("button", { name: "Lưu" }).click();
    const toast = page.locator("[data-sonner-toast]").first();
    await expect(toast).toBeVisible();
    await page.waitForTimeout(500);
    const a = (await toast.boundingBox())!;
    const b = (await page.locator('[data-slot="ask-list-agent"]').first().boundingBox())!;
    const apart =
      a.y + a.height <= b.y ||
      b.y + b.height <= a.y ||
      a.x + a.width <= b.x ||
      b.x + b.width <= a.x;
    expect(
      apart,
      `thong-bao-khong-de-nut-chinh: thông báo ${JSON.stringify(a)} nút ${JSON.stringify(b)}`,
    ).toBe(true);
  });

  test("hop-long-co-nen-mo: the dialog opened from the record has its backdrop at every size", async ({
    page,
  }) => {
    await openRecord(page);
    await page.locator('[data-slot="listing-details-edit-open"]').first().click();
    await expect(page.locator('[data-slot="listing-details-edit"]')).toBeVisible();
    const backdrops = await page
      .locator('[data-slot="dialog-overlay"], [data-slot="form-dialog-backdrop"]')
      .evaluateAll((els) => els.filter((e) => e.checkVisibility()).length);
    expect(backdrops, "hop-long-co-nen-mo: số lớp nền mờ").toBe(1);
  });

  test("axe-sang-toi: the record with «Sửa» and the open dialog, light and dark", async ({
    page,
  }) => {
    await openRecord(page);
    for (const colorScheme of ["light", "dark"] as const) {
      await page.emulateMedia({ colorScheme });
      const closed = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze();
      expect(
        closed.violations.map((v) => `${colorScheme} hồ sơ ${v.id}`),
        "axe-sang-toi",
      ).toEqual([]);
      await page.locator('[data-slot="listing-details-edit-open"]').first().click();
      await expect(page.locator('[data-slot="listing-details-edit"]')).toBeVisible();
      await page.waitForTimeout(300);
      const open = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze();
      expect(
        open.violations.map((v) => `${colorScheme} hộp ${v.id}`),
        "axe-sang-toi",
      ).toEqual([]);
      await page.keyboard.press("Escape");
      await expect(page.locator('[data-slot="listing-details-edit"]')).toBeHidden();
    }
  });
});

test("thong-bao-dung-cho-khi-khong-ho-so: with no record open a notice keeps its usual place", async ({
  page,
}) => {
  await page.goto("/inventory?vai=ListAgent");
  await regionReady(page);
  await pageReady(page);
  const bottom = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue("--record-footer-h").trim(),
  );
  expect(bottom, "thong-bao-dung-cho-khi-khong-ho-so: biến thanh đáy").toBe("");
});

test("sua-tren-o-chi-tiet: from 768 px a detail cell edits one part, the open record shows it, «Hoàn tác» puts it back", async ({
  page,
}, info) => {
  test.skip(
    ["360", "414"].includes(info.project.name),
    "phones do not edit in a cell (row 4); they edit in the record",
  );
  await page.goto(`/inventory?vai=ListAgent`);
  await regionReady(page);
  await pageReady(page);
  const cell = page.locator(`[id$="${ID}-Listing_furnished"]`).first();
  await cell.scrollIntoViewIfNeeded();
  const before = (await cell.textContent())?.trim() ?? "";
  await cell.click({ position: { x: 3, y: 3 } });
  await page.keyboard.press("F2");
  const list = page.locator('[role="listbox"][data-custom-kind]');
  await expect(list, "sua-tren-o-chi-tiet: bộ chọn").toBeVisible();
  const pick = before === "Không nội thất" ? "Đầy đủ nội thất" : "Không nội thất";
  await list.getByRole("option", { name: pick }).click();
  await expect(cell, "sua-tren-o-chi-tiet: ô").toContainText(pick);
  await page.locator("[data-sonner-toast]").getByRole("button", { name: "Hoàn tác" }).click();
  await expect(cell, "sua-tren-o-chi-tiet: hoàn tác").toContainText(before);
  // Edit again and open the record: it shows what the cell saved.
  await cell.click({ position: { x: 3, y: 3 } });
  await page.keyboard.press("F2");
  await list.getByRole("option", { name: pick }).click();
  await expect(cell).toContainText(pick);
  await page.locator(`tbody tr[data-row-id="${ID}"] button[data-record-open]`).first().click();
  await expect(field(page, "Listing.furnished"), "sua-tren-o-chi-tiet: hồ sơ").toHaveText(pick);
});
