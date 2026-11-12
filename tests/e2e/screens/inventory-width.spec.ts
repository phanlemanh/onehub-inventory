// Inventory at 1440 shows all eight data columns without sideways scrolling (roadmap row 2, AC-11, E14). At the
// narrow sizes the page itself never scrolls sideways; the test prints how many data columns are fully in view.
import { expect, test, type Page } from "@playwright/test";

const URL = "/inventory";

/** Data columns fully inside the grid's viewport (the row-number column left out), and the viewport's overflow. */
async function measure(
  page: Page,
): Promise<{ full: number; total: number; overflow: number; pageOverflow: number }> {
  await page.goto(URL);
  await page.locator('[data-slot="data-region"] tbody tr').first().waitFor();
  await page.waitForFunction(
    () =>
      document.querySelector('[data-slot="data-region-body"]')?.getAttribute("data-density") !==
      null,
  );
  return page.evaluate(() => {
    const viewport = document.querySelector(
      '[data-slot="data-region-body"] [data-slot="scroll-area-viewport"]',
    );
    if (!viewport) throw new Error("inventory: no grid viewport");
    const box = viewport.getBoundingClientRect();
    const headers = [...document.querySelectorAll('[data-slot="data-region"] thead th')].slice(1);
    return {
      full: headers.filter((th) => th.getBoundingClientRect().right <= box.right + 1).length,
      total: headers.length,
      overflow: viewport.scrollWidth - viewport.clientWidth,
      pageOverflow: document.documentElement.scrollWidth - window.innerWidth,
    };
  });
}

function check(m: { full: number; total: number; overflow: number }): void {
  if (m.full !== m.total || m.overflow > 0) {
    throw new Error(
      `inventory 1440: columns hidden behind horizontal scroll (${m.full}/${m.total})`,
    );
  }
}

test.describe("inventory width", () => {
  test("at 1440 all eight columns fit, no sideways scroll", async ({ page }, info) => {
    test.skip(info.project.name !== "1440", "do o kho 1440");
    const m = await measure(page);
    expect(m.total).toBe(8);
    expect(() => check(m)).not.toThrow();
  });

  test("pha: columns wider than the room are caught", async ({ page }, info) => {
    test.skip(info.project.name !== "1440", "do o kho 1440");
    // The table grows past the grid's viewport, as it would if the width rule gave columns more than the room.
    await page.addInitScript(() => {
      document.addEventListener("DOMContentLoaded", () => {
        const style = document.createElement("style");
        style.textContent = '[data-slot="data-grid-table"] { min-width: 2000px !important; }';
        document.head.append(style);
      });
    });
    const m = await measure(page);
    expect(() => check(m)).toThrow("inventory 1440: columns hidden behind horizontal scroll");
  });

  test("the page never scrolls sideways; data columns in view are printed", async ({
    page,
  }, info) => {
    const m = await measure(page);
    expect(m.pageOverflow).toBeLessThanOrEqual(0);
    console.log(`inventory ${info.project.name}: ${m.full}/${m.total} data columns in view`);
  });
});
