// Opens the in-place editor of one grid cell the way a person does (VP11 chuan-hoa-he-design, AC-8): select the cell by
// its edge, press Enter (Enter edits a cell that edits in place, owner 2026-11-28, Hỏi-1). Shared by the browser tests
// of every row that edits a cell (3h first), so none of them opens an editor its own way again.
import { expect, type Locator, type Page } from "@playwright/test";

import { regionReady } from "../phone-list";

export type OCanSua = {
  /** The row, by its unit code as the first column shows it (for example «0905»). */
  dong: string;
  /** The column, by its header as the grid shows it («Giá chào») or by its field («Listing.listPrice»). */
  cot: string;
};

const BODY = '[data-slot="data-region-body"]';

/** The field of a column named by its header, or the field itself; null when no column has that header. */
async function fieldOf(page: Page, cot: string): Promise<string | null> {
  if (cot.includes(".")) return cot;
  return page.locator(`${BODY} thead th[data-col-id]`).evaluateAll((ths, name) => {
    for (const th of ths) {
      const title = th
        .querySelector('[data-slot="sheet-header"]')
        ?.firstElementChild?.textContent?.trim();
      if (title === name) return th.getAttribute("data-col-id");
    }
    return null;
  }, cot);
}

/** The cell of one row and one column; throws «no cell matches» naming both when there is none. */
export async function oCua(page: Page, { dong, cot }: OCanSua): Promise<Locator> {
  await regionReady(page);
  const field = await fieldOf(page, cot);
  const rows = page.locator(`${BODY} tbody tr[data-row-id]`).filter({
    has: page.locator("button[data-record-open]", { hasText: new RegExp(`^${dong}$`) }),
  });
  const cell = rows.locator(`td[data-col-id="${field ?? "—"}"]`).first();
  if (field === null || (await rows.count()) === 0 || (await cell.count()) === 0)
    throw new Error(`no cell matches: row «${dong}», column «${cot}»`);
  return cell;
}

/**
 * Selects the cell and presses Enter; returns the open editor. Throws naming the cell when no editor opened (a locked
 * cell, a session without the edit action, a column that does not edit in place: Enter opened the record instead).
 */
export async function moSuaO(page: Page, o: OCanSua): Promise<Locator> {
  const cell = await oCua(page, o);
  await cell.click({ position: { x: 3, y: 3 } });
  await expect(cell).toHaveAttribute("data-cell-focused", /.*/);
  await page.keyboard.press("Enter");
  const editor = page.locator('[data-slot="cell-editor"]');
  const opened = await editor
    .waitFor({ state: "visible", timeout: 2_000 })
    .then(() => true)
    .catch(() => false);
  if (!opened) {
    // Enter on a cell that does not edit opens the row's record: leave the page as it was.
    const record = page.locator('[data-slot="record-panel"]');
    if (await record.isVisible()) await page.keyboard.press("Escape");
    throw new Error(`cell «${o.dong}» · «${o.cot}» did not open for editing`);
  }
  return editor;
}
