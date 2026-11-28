// Frames for E15, the same screens, sizes and sample data before and after VP11 slice 1:
//   CHUP_DIR=<folder> npx playwright test -c _acceptance/chuan-hoa-he-design/rang/chup.config.ts
// With CHUP_PHA=1 it also writes pha/mau-1440-light-trung.png: «Chưa đủ để rao» forced onto «Tạm ngừng»'s badge.
import { mkdirSync } from "node:fs";
import { join } from "node:path";

import { expect, test, type Page } from "@playwright/test";

const DIR = process.env.CHUP_DIR ?? "_acceptance/chuan-hoa-he-design/evidence/sau";
const BODY = '[data-slot="data-region-body"]';

async function open(page: Page, width: number, height: number, scheme: "light" | "dark") {
  await page.setViewportSize({ width, height });
  await page.emulateMedia({ colorScheme: scheme });
  await page.goto("/inventory?role=ListAgent");
  await expect(page.locator('[data-slot="data-region"][data-hydrated]')).toHaveCount(1);
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(400);
}

const cell = (page: Page, unit: string, field: string) =>
  page
    .locator(`${BODY} tbody tr[data-row-id]`)
    .filter({ has: page.locator("button[data-record-open]", { hasText: new RegExp(`^${unit}$`) }) })
    .locator(`td[data-col-id="${field}"]`)
    .first();

test("frames", async ({ page }) => {
  test.setTimeout(120_000);
  mkdirSync(DIR, { recursive: true });
  for (const scheme of ["light", "dark"] as const) {
    await open(page, 1440, 900, scheme);
    await page.screenshot({ path: join(DIR, `mau-1440-${scheme}.png`) });
    await page.locator("button[data-record-open]", { hasText: /^0905$/ }).first().click();
    await page.locator('[data-slot="record-panel"]').waitFor();
    await page.waitForTimeout(400);
    await page.screenshot({ path: join(DIR, `ngan-0905-1440-${scheme}.png`) });
    await open(page, 360, 800, scheme);
    await page.screenshot({ path: join(DIR, `the-360-${scheme}.png`) });
  }
  await open(page, 1024, 768, "light");
  await cell(page, "1101", "Listing.listPrice").hover({ position: { x: 3, y: 3 } });
  await page.waitForTimeout(300);
  await page.screenshot({ path: join(DIR, "re-gia-1024-light.png") });
  await cell(page, "1101", "Listing.listPrice").click({ position: { x: 3, y: 3 } });
  await page.keyboard.press("F2");
  await page.locator('[data-slot="cell-editor"]').waitFor();
  await page.screenshot({ path: join(DIR, "sua-gia-1024-light.png") });
  if (process.env.CHUP_PHA === "1") {
    const pha = join(DIR, "..", "pha");
    mkdirSync(pha, { recursive: true });
    await open(page, 1440, 900, "light");
    await page.evaluate(() => {
      const hold = document.querySelector('[data-slot="data-region-body"] tbody [data-status="Hold"]');
      for (const el of document.querySelectorAll('[data-slot="data-region-body"] tbody [data-status="Incomplete"]'))
        el.className = hold?.className ?? el.className;
    });
    await page.screenshot({ path: join(pha, "mau-1440-light-trung.png") });
  }
});
