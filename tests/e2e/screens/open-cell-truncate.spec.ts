// The shared grid's open cell is cut inside its cell (roadmap row 6, _acceptance/da-gui-tren-luoi, AC-9, E13). On
// Sent the long recipient name stays inside its cell, is cut, carries the full name as its title, keeps the row height
// and opens the record in one click. On Inventory the same measure runs on a unit code made long in the page by this
// test only (no sample data changes). The break lifts the width limit with a style tag on the real page.
import { expect, test, type Page } from "@playwright/test";

const SIZES = new Set(["1440", "360"]);
const LONG_NAME_ROW = "4d415500-0010-4000-8000-000000000003";

async function openGrid(page: Page, route: string): Promise<void> {
  await page.goto(route);
  await page.locator('[data-slot="data-region"] tbody tr').first().waitFor();
  await expect(page.locator('[hidden][id^="S:"]')).toHaveCount(0);
}

/** One open cell, measured: it fits its cell, its text is cut with the full value as title, its row keeps height. */
async function checkCut(page: Page, screen: string, id: string): Promise<void> {
  // The cut is marked once the text has measured its width.
  await page
    .locator(`[data-record-open="${id}"] [data-slot="truncated-text"][data-cut="true"]`)
    .waitFor({ timeout: 5_000 })
    .catch(() => undefined);
  const m = await page.evaluate((openId) => {
    const opener = document.querySelector<HTMLElement>(`[data-record-open="${openId}"]`)!;
    const td = opener.closest("td")!;
    const text = opener.querySelector<HTMLElement>('[data-slot="truncated-text"]')!;
    const rows = [...td.closest("tbody")!.querySelectorAll("tr")].filter(
      (tr) => tr.querySelector("[data-record-open]") && tr !== td.closest("tr"),
    );
    return {
      overflow: opener.getBoundingClientRect().right - td.getBoundingClientRect().right,
      cut: text.scrollWidth > text.clientWidth,
      full: text.getAttribute("title") === text.textContent,
      height: td.closest("tr")!.getBoundingClientRect().height,
      other: rows[0]?.getBoundingClientRect().height ?? 0,
    };
  }, id);
  if (m.overflow > 0.5) throw new Error(`open cell overflows its cell: ${screen}`);
  if (!m.cut) throw new Error(`open cell text not cut: ${screen}`);
  if (!m.full) throw new Error(`open cell title is not the full text: ${screen}`);
  if (Math.abs(m.height - m.other) > 0.5)
    throw new Error(`open cell changes row height: ${screen}`);
}

test.describe("E13 · the open cell is cut inside its cell", () => {
  test.beforeEach(() => {
    test.skip(!SIZES.has(test.info().project.name), "measured at 1440 and 360");
  });

  test("sent: the long recipient fits its cell, is cut, and opens in one click", async ({
    page,
  }) => {
    await openGrid(page, "/sent");
    await checkCut(page, "sent", LONG_NAME_ROW);
    await page.locator(`[data-record-open="${LONG_NAME_ROW}"]`).click();
    await expect(page.locator('[data-slot="record-panel"]')).toHaveAttribute(
      "data-record-id",
      LONG_NAME_ROW,
    );
  });

  test("inventory: a long unit code fits its cell and is cut", async ({ page }) => {
    await openGrid(page, "/inventory");
    const id = await page.locator("[data-record-open]").first().getAttribute("data-record-open");
    // Made long in this page only: the text and its title, as a long code would render.
    await page.evaluate((openId) => {
      const text = document.querySelector<HTMLElement>(
        `[data-record-open="${openId}"] [data-slot="truncated-text"]`,
      )!;
      const long = `${text.textContent} ${"MÃ-RẤT-DÀI-".repeat(12)}`;
      text.textContent = long;
      text.setAttribute("title", long);
    }, id!);
    await checkCut(page, "inventory", id!);
  });

  test("break: lifting the width limit is caught", async ({ page }) => {
    await openGrid(page, "/sent");
    await page.addStyleTag({
      content:
        "[data-record-open], span:has(> [data-record-open]) { max-width: none !important; min-width: max-content !important; flex-shrink: 0 !important; }",
    });
    await expect(checkCut(page, "sent", LONG_NAME_ROW)).rejects.toThrow(
      "open cell overflows its cell: sent",
    );
  });
});
