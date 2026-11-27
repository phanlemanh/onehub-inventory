// Inventory at 1440 (roadmap row 2, AC-11, E14; row 19, AC-6). Row 19 adds the Về tay column after Giá chào, nine data
// columns in all. With it open, AC-6 of row 19 (approved by the owner 2026-11-14, ruling G N-1411-15) replaces «every
// column fits»: Căn to Về tay stand whole in the first view and the columns after Về tay scroll inside the grid, like the
// company's own columns of row 7e. Row 3g (owner's option C, 2026-11-17; sửa sau ký) adds the four details after the
// bedrooms, thirteen data columns: the same rule now holds with the second column folded too — Căn to Về tay whole in
// the first view, the rest inside the grid's own scroll. At every size the page itself never scrolls sideways; the test
// prints how many data columns are in view.
import { expect, test, type Page } from "@playwright/test";

import { assertCardsNotTable, isPhone, regionReady, rowsShown } from "../phone-list";

const URL = "/inventory";

/** Data columns fully inside the grid's viewport (the row-number column left out), and the viewport's overflow. */
type Measure = {
  full: number;
  total: number;
  overflow: number;
  pageOverflow: number;
  firstView: number;
  uptoNet: number;
};

/** The header the first view must reach: Về tay, the column right after Giá chào. */
const NET_TO_SELLER = "Về tay";

async function measure(page: Page, secondColumn?: "open" | "folded"): Promise<Measure> {
  if (secondColumn) {
    await page.context().addCookies([
      {
        name: "app_shell_cot2",
        value: secondColumn === "folded" ? "0" : "1",
        url: "http://127.0.0.1",
      },
    ]);
  }
  await page.goto(URL);
  await regionReady(page);
  await page.locator('[data-slot="data-region"] tbody tr').first().waitFor();
  await page.waitForFunction(
    () =>
      document.querySelector('[data-slot="data-region-body"]')?.getAttribute("data-density") !==
      null,
  );
  return page.evaluate((netName) => {
    const viewport = document.querySelector(
      '[data-slot="data-region-body"] [data-slot="scroll-area-viewport"]',
    );
    if (!viewport) throw new Error("inventory: no grid viewport");
    const box = viewport.getBoundingClientRect();
    const headers = [...document.querySelectorAll('[data-slot="data-region"] thead th')].slice(1);
    const net = headers.findIndex((th) => th.textContent?.trim().startsWith(netName));
    const whole = (th: Element) => th.getBoundingClientRect().right <= box.right + 1;
    return {
      firstView: headers.slice(0, net + 1).filter(whole).length,
      uptoNet: net + 1,
      full: headers.filter(whole).length,
      total: headers.length,
      overflow: viewport.scrollWidth - viewport.clientWidth,
      pageOverflow: document.documentElement.scrollWidth - window.innerWidth,
    };
  }, NET_TO_SELLER);
}

/** AC-6 of row 19: with the second column open, Căn to Về tay are whole in the first view. */
function checkFirstView(m: Measure): void {
  if (m.uptoNet === 0 || m.firstView !== m.uptoNet) {
    throw new Error(`inventory 1440: Về tay not in the first view (${m.firstView}/${m.uptoNet})`);
  }
}

test.describe("inventory width", () => {
  test("at 1440, second column folded: thirteen columns, Căn to Về tay in the first view, the page does not scroll", async ({
    page,
  }, info) => {
    test.skip(info.project.name !== "1440", "do o kho 1440");
    const m = await measure(page, "folded");
    expect(m.total).toBe(13);
    expect(() => checkFirstView(m)).not.toThrow();
    expect(m.pageOverflow).toBeLessThanOrEqual(0);
    console.log(`inventory 1440, second column folded: ${m.full}/${m.total} data columns in view`);
  });

  test("at 1440, second column open: thirteen columns, Căn to Về tay in the first view, the page does not scroll", async ({
    page,
  }, info) => {
    test.skip(info.project.name !== "1440", "do o kho 1440");
    const m = await measure(page, "open");
    expect(m.total).toBe(13);
    expect(() => checkFirstView(m)).not.toThrow();
    expect(m.pageOverflow).toBeLessThanOrEqual(0);
    console.log(`inventory 1440, second column open: ${m.full}/${m.total} data columns in view`);
  });

  test("pha: Về tay pushed behind the frame is caught with the second column folded", async ({
    page,
  }, info) => {
    test.skip(info.project.name !== "1440", "do o kho 1440");
    // Row 3g: with thirteen columns the folded view keeps the first-view rule; a wider column before Về tay breaks it.
    await page.addInitScript(() => {
      document.addEventListener("DOMContentLoaded", () => {
        const style = document.createElement("style");
        style.textContent =
          '[data-slot="data-region"] colgroup col:nth-child(4) { width: 1200px !important; }';
        document.head.append(style);
      });
    });
    const m = await measure(page, "folded");
    expect(() => checkFirstView(m)).toThrow("inventory 1440: Về tay not in the first view");
  });

  test("pha: Về tay pushed behind the frame is caught", async ({ page }, info) => {
    test.skip(info.project.name !== "1440", "do o kho 1440");
    // Dự án grows wide enough to push Về tay past the first view, as a wider column before it would.
    await page.addInitScript(() => {
      document.addEventListener("DOMContentLoaded", () => {
        const style = document.createElement("style");
        style.textContent =
          '[data-slot="data-region"] colgroup col:nth-child(4) { width: 800px !important; }';
        document.head.append(style);
      });
    });
    const m = await measure(page, "open");
    expect(() => checkFirstView(m)).toThrow("inventory 1440: Về tay not in the first view");
  });

  test("the page never scrolls sideways; data columns in view are printed", async ({
    page,
  }, info) => {
    if (isPhone(page)) {
      // Row 2b: below 768 px the inventory is a list of cards, so there are no columns to count; the page still never
      // scrolls sideways, and the list is there instead of the table.
      await page.goto(URL);
      await rowsShown(page);
      await assertCardsNotTable(page, "inventory width");
      const pageOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      );
      expect(pageOverflow).toBeLessThanOrEqual(0);
      console.log(`inventory ${info.project.name}: listing cards, no columns`);
      return;
    }
    const m = await measure(page);
    expect(m.pageOverflow).toBeLessThanOrEqual(0);
    console.log(`inventory ${info.project.name}: ${m.full}/${m.total} data columns in view`);
  });
});
