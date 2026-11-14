// The shared grid's open cell is cut inside its cell (roadmap row 6, _acceptance/da-gui-tren-luoi, AC-9, E13). On
// Sent the long recipient name stays inside its cell, is cut, carries the full name as its title, keeps the row height
// and opens the record in one click. On Inventory the same measure runs on a unit code made long in the page by this
// test only (no sample data changes): its column is narrowed by a style tag so the real code is cut. The title is
// compared with the record's own title, written by the record panel from the data, not by the cut text. The break
// lifts the width limit with a style tag on the real page.
import { expect, test, type Page } from "@playwright/test";

import { assertCardsNotTable, isPhone, rowsShown } from "../phone-list";

const SIZES = new Set(["1440", "360"]);
const LONG_NAME_ROW = "4d415500-0010-4000-8000-000000000003";

async function openGrid(page: Page, route: string): Promise<void> {
  await page.goto(route);
  await page.locator('[data-slot="data-region"] tbody tr').first().waitFor();
  await expect(page.locator('[hidden][id^="S:"]')).toHaveCount(0);
}

/** One open cell, measured: it fits its cell, its text is cut, its row keeps height. Returns its title. */
async function checkCut(page: Page, screen: string, id: string): Promise<string> {
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
      title: text.getAttribute("title") ?? "",
      height: td.closest("tr")!.getBoundingClientRect().height,
      other: rows[0]?.getBoundingClientRect().height ?? 0,
    };
  }, id);
  if (m.overflow > 0.5) throw new Error(`open cell overflows its cell: ${screen}`);
  // The cut is marked once the text has measured its width; not marked in time means not cut.
  await page
    .locator(`[data-record-open="${id}"] [data-slot="truncated-text"][data-cut="true"]`)
    .waitFor({ timeout: 5_000 })
    .catch(() => {
      throw new Error(`open cell text not cut: ${screen}`);
    });
  if (!m.cut) throw new Error(`open cell text not cut: ${screen}`);
  if (Math.abs(m.height - m.other) > 0.5)
    throw new Error(`open cell changes row height: ${screen}`);
  return m.title;
}

/** One click on the cut text opens its record, and the record's title carries the cell's whole title. */
async function opensWithFullTitle(page: Page, screen: string, id: string, title: string) {
  await page.locator(`[data-record-open="${id}"]`).click();
  const panel = page.locator('[data-slot="record-panel"]');
  await expect(panel).toHaveAttribute("data-record-id", id);
  const name = ((await panel.locator("h2").first().textContent()) ?? "").trim();
  // Sent names the record by the recipient; Inventory by «code · building»: the record title starts with the cell's.
  if (!title || (name !== title && !name.startsWith(`${title} · `)))
    throw new Error(`open cell title is not the full text: ${screen}`);
}

test.describe("E13 · the open cell is cut inside its cell", () => {
  test.beforeEach(() => {
    test.skip(!SIZES.has(test.info().project.name), "measured at 1440 and 360");
  });

  test("sent: the long recipient fits its cell, is cut, and opens in one click", async ({
    page,
  }) => {
    await openGrid(page, "/sent");
    const title = await checkCut(page, "sent", LONG_NAME_ROW);
    await opensWithFullTitle(page, "sent", LONG_NAME_ROW, title);
  });

  test("inventory: a unit code in a narrowed column fits its cell and is cut", async ({ page }) => {
    if (isPhone(page)) {
      // Row 2b: below 768 px the inventory has no cells; each unit code is the head of its listing card and wraps
      // inside the card rather than being cut. Measured: cards, no table, and every code inside its card.
      await page.goto("/inventory");
      await rowsShown(page);
      await assertCardsNotTable(page, "E13 inventory");
      const outside = await page.locator('[data-slot="phone-card"]').evaluateAll(
        (cards) =>
          cards.filter((c) => {
            const code = c
              .querySelector('[data-slot="listing-card-unit"]')!
              .getBoundingClientRect();
            const box = c.getBoundingClientRect();
            return code.right > box.right + 0.5 || code.left < box.left - 0.5;
          }).length,
      );
      expect(outside, "open cell overflows its cell: inventory card").toBe(0);
      return;
    }
    await openGrid(page, "/inventory");
    const id = (await page.locator("[data-record-open]").first().getAttribute("data-record-open"))!;
    const col = await page
      .locator(`[data-record-open="${id}"]`)
      .evaluate((el) => el.closest("td")?.getAttribute("data-col-id") ?? "");
    // Row 2e: the grid's fixed table layout takes each column's width from its <col>, so a width on the cells alone
    // never narrowed the column; this case passed only while unit codes were cut anyway. Narrow the <col> as well.
    const nth = await page
      .locator(`thead th[data-col-id="${col}"]`)
      .first()
      .evaluate((th) => [...th.parentElement!.children].indexOf(th) + 1);
    await page.addStyleTag({
      content: `table[data-slot="data-grid-table"] colgroup col:nth-child(${nth}) { width: 44px !important; } td[data-col-id="${col}"], th[data-col-id="${col}"] { width: 44px !important; min-width: 44px !important; max-width: 44px !important; }`,
    });
    const title = await checkCut(page, "inventory", id);
    await opensWithFullTitle(page, "inventory", id, title);
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
