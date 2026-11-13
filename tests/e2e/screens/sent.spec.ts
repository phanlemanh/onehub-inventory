// decision:record-panel
// One sent link's record beside the Sent grid (roadmap row 6, _acceptance/da-gui-tren-luoi, E7): the address, the
// name, the six fields as the row shows them, the units the link carries, and focus back on the row when it closes.
// Measured at 1440 and 360; the break case opens another link and must be caught with its pinned message.
import { expect, test, type Page } from "@playwright/test";

const LINK_5 = "4d415500-0010-4000-8000-000000000005";
const LINK_2 = "4d415500-0010-4000-8000-000000000002";
const SIZES = new Set(["1440", "360"]);

const panel = (page: Page) => page.locator('[data-slot="record-panel"]');

async function openSent(page: Page): Promise<void> {
  await page.goto("/sent");
  await page.locator('[data-slot="data-region"] tbody tr').first().waitFor();
  await expect(page.locator('[hidden][id^="S:"]')).toHaveCount(0);
  await expect(
    page.locator('[data-slot="data-region-body"] [data-slot="scroll-area-viewport"]').first(),
  ).toHaveAttribute("tabindex", "0");
}

/** The text of every cell of one link's row, by header, as the grid shows it. */
async function rowCells(page: Page, id: string): Promise<Record<string, string>> {
  return page.evaluate((linkId) => {
    const headers = [...document.querySelectorAll('[data-slot="data-region"] thead th')].map(
      (th) => th.textContent?.trim() ?? "",
    );
    const opener = document.querySelector(`[data-record-open="${linkId}"]`);
    const cells = [...(opener?.closest("tr")?.querySelectorAll("td") ?? [])].map(
      (td) => td.textContent?.trim() ?? "",
    );
    return Object.fromEntries(headers.map((h, i) => [h, cells[i] ?? ""]));
  }, id);
}

/** What the open record shows: its name, its field pairs and its units. */
async function recordShown(page: Page) {
  const body = panel(page);
  const title = ((await body.locator("h2").first().textContent()) ?? "").trim();
  const pairs = await body
    .locator('[data-slot="sent-record-fields"] [data-field]')
    .evaluateAll((els) =>
      els.map((el) => [
        el.querySelector("dt")?.textContent?.trim() ?? "",
        el.querySelector("dd")?.textContent?.trim() ?? "",
      ]),
    );
  const units = await body.locator('[data-slot="sent-record-units"] li').count();
  return { title, pairs, units };
}

/** The record matches the row of `rowId`: same name, the six cells, as many units as the row's count. */
async function checkRecord(page: Page, rowId: string): Promise<void> {
  const cells = await rowCells(page, rowId);
  const shown = await recordShown(page);
  if (shown.title !== cells["Người nhận"]) throw new Error(`record shows another row: ${rowId}`);
  if (shown.pairs.length !== 6) throw new Error(`record fields: ${shown.pairs.length}`);
  for (const [label = "", value] of shown.pairs)
    if (cells[label] !== value) throw new Error(`record shows another row: ${rowId}`);
  if (String(shown.units) !== cells["Số căn"]) throw new Error(`record units: ${shown.units}`);
}

test.describe("E7 · a sent link opens beside the grid", () => {
  test.beforeEach(() => {
    test.skip(!SIZES.has(test.info().project.name), "measured at 1440 and 360");
  });

  test("the recipient opens the link's record at its own address, with its fields and units", async ({
    page,
  }) => {
    await openSent(page);
    await page.locator(`[data-record-open="${LINK_5}"]`).click();
    await expect(panel(page)).toHaveAttribute("data-record-id", LINK_5);
    await expect(page).toHaveURL(new RegExp(`ho-so=${LINK_5}`));
    await checkRecord(page, LINK_5);
    expect((await rowCells(page, LINK_5))["Số căn"]).toBe("30");
    await panel(page).getByRole("button", { name: "Đóng" }).click();
    await expect(panel(page)).toHaveCount(0);
    const focusRow = await page.evaluate(
      () =>
        document.activeElement
          ?.closest("tr")
          ?.querySelector("[data-record-open]")
          ?.getAttribute("data-record-open") ?? "",
    );
    expect(focusRow).toBe(LINK_5);
  });

  test("break: a record of another link is caught", async ({ page }) => {
    await openSent(page);
    await page.locator(`[data-record-open="${LINK_2}"]`).click();
    await expect(panel(page)).toHaveAttribute("data-record-id", LINK_2);
    await expect(checkRecord(page, LINK_5)).rejects.toThrow(`record shows another row: ${LINK_5}`);
  });
});
