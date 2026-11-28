// VP11 chuan-hoa-he-design, AC-8 (E9): the shared helper that opens a cell's editor, at 1440 (cells are edited from
// 768 px). Each case names the message it pins.
import { expect, test, type Locator, type Page } from "@playwright/test";

import { moSuaO, oCua } from "./support/mo-sua-o";

const only1440 = () =>
  test.skip(test.info().project.name !== "1440", "the helper is the same at every width");

/** What a caller of the helper relies on: the editor it returns is open, on the cell it named. */
async function assertOpenOn(page: Page, editor: Locator, cell: Locator): Promise<void> {
  if (!(await editor.isVisible())) throw new Error("helper returned without an open editor");
  const [a, b] = [await editor.getByRole("textbox").boundingBox(), await cell.boundingBox()];
  if (!a || !b || Math.abs(a.x - b.x) > 4 || Math.abs(a.y - b.y) > 4)
    throw new Error("helper opened an editor away from the cell");
  await expect(page.locator('[data-slot="record-panel"]')).toHaveCount(0);
}

test.beforeEach(async ({ page }) => {
  only1440();
  await page.goto("/inventory?role=ListAgent");
});

test("AC-8 · opens the editor on the cell it names", async ({ page }) => {
  const editor = await moSuaO(page, { dong: "0905", cot: "Giá chào" });
  await assertOpenOn(page, editor, await oCua(page, { dong: "0905", cot: "Giá chào" }));
  // By its field too.
  await page.keyboard.press("Escape");
  const again = await moSuaO(page, { dong: "0905", cot: "Listing.listPrice" });
  await assertOpenOn(page, again, await oCua(page, { dong: "0905", cot: "Listing.listPrice" }));
});

test("AC-8 · a cell that does not edit fails with its name", async ({ page }) => {
  // Row 3h made the area editable in its cell; the building is a column that never edits.
  await expect(moSuaO(page, { dong: "0905", cot: "Toà" })).rejects.toThrow(
    "cell «0905» · «Toà» did not open for editing",
  );
});

test("AC-8 · a row or column that is not there fails, never passes empty", async ({ page }) => {
  await expect(moSuaO(page, { dong: "9999", cot: "Giá chào" })).rejects.toThrow(
    "no cell matches: row «9999», column «Giá chào»",
  );
  await expect(moSuaO(page, { dong: "0905", cot: "Không có cột này" })).rejects.toThrow(
    "no cell matches: row «0905», column «Không có cột này»",
  );
});

test("AC-8 · the check fails on a helper that returns before the editor opens", async ({
  page,
}) => {
  // The broken helper: selects the cell and returns, never pressing Enter.
  const cell = await oCua(page, { dong: "0905", cot: "Giá chào" });
  await cell.click({ position: { x: 3, y: 3 } });
  await expect(assertOpenOn(page, page.locator('[data-slot="cell-editor"]'), cell)).rejects.toThrow(
    "helper returned without an open editor",
  );
});
