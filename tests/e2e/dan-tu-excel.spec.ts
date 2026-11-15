// A region pasted from Excel into the inventory grid (roadmap row 5, _acceptance/dan-tu-excel), in a real browser at
// the four widths. ?vai=<role> stands in for the session's role outside production. The sample data is drawn by a
// seeded generator, so each case reads the rows it pastes onto from the grid and works out what it must see.
// E1, E4-e2e, E5, E6-e2e, E7-e2e, E8, E9-axe, E12 of the contract; case names are the pinned messages.
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

import { assertCardsNotTable, phoneCards } from "./phone-list";

import { STATUS_NEXT, readPrice, readStatusText } from "../../src/modules/listings";
import type { ListingStandardStatus } from "../../src/generated/ontology";
import { formatMoney, statusLabel } from "../../src/lib/format";

const WIDE = new Set(["1024", "1440"]);
const width = () => test.info().project.name;
const wideOnly = () => test.skip(!WIDE.has(width()), "a paste opens the preview from 768 px");
const at1440 = () => test.skip(width() !== "1440", "one width is enough for this case");

const PRICE = "Listing.listPrice";
const STATUS = "Listing.standardStatus";
const CONFIRMED = "Listing.lastConfirmedAt";

const preview = (page: Page) => page.locator('[data-slot="paste-preview"]');
const changeLine = (page: Page, rowId: string, field: string) =>
  preview(page).locator(`[data-paste-line="${rowId}|${field}"]`);
const toasts = (page: Page) => page.locator("[data-sonner-toast]");

type Save = { id: string; change: { field: string; listPrice?: number; standardStatus?: string } };
/** Every request the sample save door got so far (outside production the page logs them, row 4). */
const saves = (page: Page) =>
  page.evaluate(
    () => ((window as unknown as { __sampleSaves?: Save[] }).__sampleSaves ?? []) as Save[],
  );

async function openInventory(page: Page, role = "ListAgent"): Promise<void> {
  await page.goto(`/inventory?vai=${role}`);
  await expect(page.locator('[hidden][id^="S:"]')).toHaveCount(0);
  if (WIDE.has(width()))
    await expect(
      page.locator('[data-slot="data-region-body"] table[data-slot="data-grid-table"]'),
    ).toHaveAttribute("tabindex", "0");
}

/** One row of the grid as shown: its id, unit code, price and status read back into values. */
interface Shown {
  id: string;
  unit: string;
  price: number | null;
  status: ListingStandardStatus;
}

async function shownRows(page: Page): Promise<Shown[]> {
  const raw = await page
    .locator('[data-slot="data-region-body"] tbody tr[data-row-id]')
    .evaluateAll(
      (trs, fields) =>
        trs.map((tr) => ({
          id: tr.getAttribute("data-row-id") ?? "",
          unit: tr.querySelector("button[data-record-open]")?.textContent?.trim() ?? "",
          price: tr.querySelector(`td[data-col-id="${fields[0]}"]`)?.textContent?.trim() ?? "",
          status: tr.querySelector(`td[data-col-id="${fields[1]}"]`)?.textContent?.trim() ?? "",
        })),
      [PRICE, STATUS] as const,
    );
  return raw.map((r) => {
    const price = readPrice(r.price);
    return {
      id: r.id,
      unit: r.unit,
      price: price.ok ? price.value : null,
      status: readStatusText(r.status, "sale") ?? ("Closed" as ListingStandardStatus),
    };
  });
}

/** `count` rows in a row on screen that all pass `ok`, from the top. Fails with a pinned message when none. */
async function rowsWhere(
  page: Page,
  count: number,
  ok: (r: Shown) => boolean,
  name: string,
): Promise<Shown[]> {
  const rows = await shownRows(page);
  for (let i = 0; i + count <= rows.length; i += 1) {
    const run = rows.slice(i, i + count);
    if (run.every(ok)) return run;
  }
  throw new Error(`${name}: không có ${count} dòng liền nhau hợp ca trên bảng mẫu`);
}

const priced = (r: Shown) => r.price !== null && r.price > 0 && r.status !== "Closed";

const cellOf = (page: Page, rowId: string, field: string) =>
  page.locator(
    `[data-slot="data-region-body"] tr[data-row-id="${rowId}"] td[data-col-id="${field}"]`,
  );

/** Selects a cell by its edge (the words of the code open the record, row 3). */
async function select(page: Page, rowId: string, field: string, extend = false): Promise<void> {
  const cell = cellOf(page, rowId, field);
  await cell.click({ position: { x: 3, y: 3 }, modifiers: extend ? ["Shift"] : [] });
  if (!extend) await expect(cell).toHaveAttribute("data-cell-focused", /.*/);
}

/** Pastes text the way Excel puts it on the clipboard (tab between cells, newline between rows). */
async function pasteText(page: Page, text: string): Promise<void> {
  await page.evaluate((t) => {
    const data = new DataTransfer();
    data.setData("text/plain", t);
    const target =
      document.querySelector("[data-cell-focused]") ?? document.activeElement ?? document.body;
    target.dispatchEvent(
      new ClipboardEvent("paste", { clipboardData: data, bubbles: true, cancelable: true }),
    );
  }, text);
}

const money = (value: number) => formatMoney(value);
/** A price a little above the old one: under the 20% ask-again of row 4. */
const nudged = (r: Shown) => Math.round((r.price! + 100_000_000) / 10_000_000) * 10_000_000;
const tsv = (rows: readonly (readonly string[])[]) =>
  `${rows.map((r) => r.join("\t")).join("\n")}\n`;

async function pastePrices(page: Page, rows: readonly Shown[], values: readonly number[]) {
  await select(page, rows[0]!.id, PRICE);
  await pasteText(page, tsv(values.map((v) => [money(v)])));
  await expect(preview(page)).toBeVisible();
}

test.describe("dan-tu-excel", () => {
  test("xem-truoc-dung-o", async ({ page }) => {
    wideOnly();
    await openInventory(page);
    // A status the row may move to (row 4's moves) that needs no extra field, and a price under the ask-again.
    const target = (r: Shown) =>
      STATUS_NEXT[r.status].find((s) => s !== "Closed" && s !== "Withdrawn");
    const rows = await rowsWhere(
      page,
      3,
      (r) => priced(r) && target(r) !== undefined,
      "xem-truoc-dung-o",
    );
    await select(page, rows[0]!.id, STATUS);
    await pasteText(
      page,
      tsv(rows.map((r) => [statusLabel(target(r)!, "sale"), money(nudged(r))])),
    );
    await expect(preview(page)).toBeVisible();
    expect(await saves(page), "chua-ghi-truoc-khi-ap: lần ghi trước khi Áp").toEqual([]);
    for (const r of rows) {
      await expect(changeLine(page, r.id, STATUS)).toContainText(`Căn ${r.unit}`);
      await expect(changeLine(page, r.id, STATUS)).toContainText(statusLabel(r.status, "sale"));
      await expect(changeLine(page, r.id, STATUS).locator('[data-part="to"]')).toHaveText(
        statusLabel(target(r)!, "sale"),
      );
      await expect(changeLine(page, r.id, PRICE).locator('[data-part="to"]')).toHaveText(
        money(nudged(r)),
      );
      await expect(changeLine(page, r.id, PRICE)).toContainText(money(r.price!));
    }
    await expect(preview(page).getByRole("dialog").or(preview(page))).toContainText("6 ô sẽ đổi");
    await expect(preview(page).getByRole("button", { name: "Áp 6 ô" })).toBeVisible();
    // The grid behind keeps the old values.
    await expect(cellOf(page, rows[0]!.id, PRICE)).toHaveText(money(rows[0]!.price!));
  });

  test("gia-lech-lon-bo-chon-san", async ({ page }) => {
    wideOnly();
    await openInventory(page);
    const rows = await rowsWhere(page, 2, priced, "gia-lech-lon-bo-chon-san");
    const big = Math.round((rows[0]!.price! * 2.1) / 10_000_000) * 10_000_000;
    await pastePrices(page, rows, [big, nudged(rows[1]!)]);
    const far = changeLine(page, rows[0]!.id, PRICE);
    await expect(far).toContainText(/\+\d+(,\d+)?%/);
    await expect(
      far.getByRole("checkbox"),
      `gia-lech-lon-bo-chon-san: ${money(big)} chọn sẵn`,
    ).not.toBeChecked();
    await expect(changeLine(page, rows[1]!.id, PRICE).getByRole("checkbox")).toBeChecked();
    await preview(page).getByRole("button", { name: "Áp 1 ô" }).click();
    await expect(preview(page)).toHaveCount(0);
    await expect.poll(async () => (await saves(page)).length).toBe(1);
    const values = (await saves(page)).map((s) => s.change.listPrice);
    expect(
      values.includes(big),
      `gia-lech-lon-bo-chon-san: ${money(big)} được ghi khi chưa chọn`,
    ).toBe(false);
    await expect(
      page.getByRole("dialog"),
      "gia-lech-lon-bo-chon-san: hộp hỏi lại sau Áp",
    ).toHaveCount(0);
    // Pasted again and ticked, it is written once.
    await select(page, rows[0]!.id, PRICE);
    await pasteText(page, tsv([[money(big)]]));
    await changeLine(page, rows[0]!.id, PRICE).getByRole("checkbox").check();
    await preview(page).getByRole("button", { name: "Áp 1 ô" }).click();
    await expect
      .poll(async () => (await saves(page)).filter((s) => s.change.listPrice === big).length)
      .toBe(1);
  });

  test("ap-n-o", async ({ page }) => {
    wideOnly();
    await openInventory(page);
    const rows = await rowsWhere(page, 3, priced, "ap-n-o");
    const confirmed = await cellOf(page, rows[0]!.id, CONFIRMED).innerText();
    await pastePrices(page, rows, rows.map(nudged));
    await preview(page).getByRole("button", { name: "Áp 3 ô" }).click();
    await expect
      .poll(async () => (await saves(page)).map((s) => [s.id, s.change.listPrice]), {
        message: "ap-n-o: lần ghi",
      })
      .toEqual(rows.map((r) => [r.id, nudged(r)]));
    for (const r of rows) await expect(cellOf(page, r.id, PRICE)).toHaveText(money(nudged(r)));
    await expect(cellOf(page, rows[0]!.id, CONFIRMED)).not.toHaveText(confirmed);
    const done = toasts(page).filter({ hasText: "Đã đổi 3 ô của 3 căn." });
    await expect(done).toHaveCount(1);
    await expect(done.getByRole("button", { name: "Hoàn tác" })).toBeVisible();
  });

  test("thoi-khong-ghi", async ({ page }) => {
    wideOnly();
    await openInventory(page);
    const rows = await rowsWhere(page, 2, priced, "thoi-khong-ghi");
    await pastePrices(page, rows, rows.map(nudged));
    await preview(page).getByRole("button", { name: "Thôi" }).click();
    await expect(preview(page)).toHaveCount(0);
    await pastePrices(page, rows, rows.map(nudged));
    await page.keyboard.press("Escape");
    await expect(preview(page)).toHaveCount(0);
    expect(await saves(page), "thoi-khong-ghi").toEqual([]);
    await expect(cellOf(page, rows[0]!.id, PRICE)).toHaveText(money(rows[0]!.price!));
  });

  test("bo-chon-mot-o", async ({ page }) => {
    wideOnly();
    await openInventory(page);
    const rows = await rowsWhere(page, 3, priced, "bo-chon-mot-o");
    await pastePrices(page, rows, rows.map(nudged));
    await changeLine(page, rows[1]!.id, PRICE).getByRole("checkbox").uncheck();
    await preview(page).getByRole("button", { name: "Áp 2 ô" }).click();
    await expect(toasts(page).filter({ hasText: /^Đã đổi/ })).toHaveCount(1);
    const ids = (await saves(page)).map((s) => s.id);
    expect(ids.includes(rows[1]!.id), "bo-chon-mot-o: ô đã bỏ được ghi").toBe(false);
    expect(ids).toHaveLength(2);
    await expect(cellOf(page, rows[1]!.id, PRICE)).toHaveText(money(rows[1]!.price!));
  });

  test("hoan-tac-ca-vung", async ({ page }) => {
    wideOnly();
    await openInventory(page);
    const rows = await rowsWhere(page, 3, priced, "hoan-tac-ca-vung");
    await pastePrices(page, rows, rows.map(nudged));
    await preview(page).getByRole("button", { name: "Áp 3 ô" }).click();
    const done = toasts(page).filter({ hasText: "Đã đổi 3 ô của 3 căn." });
    await done.getByRole("button", { name: "Hoàn tác" }).click();
    await expect(toasts(page).filter({ hasText: "Đã hoàn tác 3 ô." })).toHaveCount(1);
    const back = (await saves(page)).slice(3);
    expect(back.length, `hoan-tac-ca-vung: ${back.length}/3 lần ghi ngược`).toBe(3);
    expect(back.map((s) => [s.id, s.change.listPrice])).toEqual(
      [...rows].reverse().map((r) => [r.id, r.price]),
    );
    for (const r of rows) await expect(cellOf(page, r.id, PRICE)).toHaveText(money(r.price!));
  });

  test("ap-hong-mot-phan", async ({ page }) => {
    wideOnly();
    await openInventory(page);
    const rows = await rowsWhere(page, 3, priced, "ap-hong-mot-phan");
    await pastePrices(page, rows, rows.map(nudged));
    // The device goes offline after the first write reached the door.
    await page.evaluate(() => {
      Object.defineProperty(navigator, "onLine", {
        configurable: true,
        get: () =>
          ((window as unknown as { __sampleSaves?: unknown[] }).__sampleSaves?.length ?? 0) < 2,
      });
    });
    await preview(page).getByRole("button", { name: "Áp 3 ô" }).click();
    await expect(
      toasts(page).filter({ hasText: "Đã đổi 1 ô; 2 ô chưa ghi được — mất kết nối mạng." }),
      "ap-hong-mot-phan",
    ).toHaveCount(1);
    await expect(cellOf(page, rows[0]!.id, PRICE)).toHaveText(money(nudged(rows[0]!)));
    for (const r of rows.slice(1))
      await expect(cellOf(page, r.id, PRICE)).toHaveText(money(r.price!));
  });

  test("khong-quyen", async ({ page }) => {
    at1440();
    await openInventory(page, "CompanyAdmin");
    const rows = await rowsWhere(page, 1, priced, "khong-quyen");
    await select(page, rows[0]!.id, PRICE);
    await pasteText(page, tsv([[money(nudged(rows[0]!))]]));
    await expect(
      toasts(page).filter({ hasText: "Vai của bạn chưa sửa được căn trên bảng." }),
    ).toHaveCount(1);
    await expect(preview(page), "khong-quyen: bản xem trước mở").toHaveCount(0);
    expect(await saves(page)).toEqual([]);
  });

  test("dien-thoai-khong-dan", async ({ page }) => {
    test.skip(WIDE.has(width()), "phones only");
    await openInventory(page);
    await phoneCards(page).first().waitFor();
    await assertCardsNotTable(page, "dien-thoai-khong-dan");
    await phoneCards(page).first().focus();
    await pasteText(page, tsv([["3 tỷ"], ["4 tỷ"]]));
    await expect(preview(page), `dien-thoai-khong-dan: mở ở ${width()}`).toHaveCount(0);
    expect(await saves(page)).toEqual([]);
  });

  test("phim-trong-ban-xem-truoc", async ({ page }) => {
    wideOnly();
    await openInventory(page);
    const rows = await rowsWhere(page, 2, priced, "phim-trong-ban-xem-truoc");
    await pastePrices(page, rows, rows.map(nudged));
    const dialog = page.getByRole("dialog");
    await expect(dialog).toHaveAccessibleName("Dán vào 2 căn");
    await expect(dialog).toHaveAccessibleDescription("2 ô sẽ đổi");
    const apply = dialog.getByRole("button", { name: "Áp 2 ô" });
    await expect(apply, "phim-trong-ban-xem-truoc: tiêu điểm đầu").toBeFocused();
    // Shift+Tab walks back through «Thôi» to the tick boxes; Space turns one off.
    await page.keyboard.press("Shift+Tab");
    await expect(dialog.getByRole("button", { name: "Thôi" })).toBeFocused();
    await page.keyboard.press("Shift+Tab");
    const second = changeLine(page, rows[1]!.id, PRICE).getByRole("checkbox");
    await expect(second).toBeFocused();
    await page.keyboard.press("Space");
    await expect(second).not.toBeChecked();
    await expect(dialog.getByRole("button", { name: "Áp 1 ô" })).toBeVisible();
    await page.keyboard.press("Space");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await expect(apply).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(preview(page)).toHaveCount(0);
    expect(await saves(page)).toEqual([]);
    const inGrid = await page.evaluate(
      () => document.activeElement?.closest('[data-slot="data-region-body"]') !== null,
    );
    expect(inGrid, "phim-trong-ban-xem-truoc: tiêu điểm không về ô").toBe(true);
    await expect(cellOf(page, rows[0]!.id, PRICE)).toHaveAttribute("data-cell-focused", /.*/);
    await page.keyboard.press("ArrowDown");
    await expect(cellOf(page, rows[1]!.id, PRICE)).toHaveAttribute("data-cell-focused", /.*/);
  });

  test("mot-o-ca-vung", async ({ page }) => {
    at1440();
    await openInventory(page);
    const rows = await rowsWhere(
      page,
      4,
      (r) => priced(r) && r.price !== 3_000_000_000,
      "mot-o-ca-vung",
    );
    await select(page, rows[0]!.id, PRICE);
    await select(page, rows[3]!.id, PRICE, true);
    await pasteText(page, "3 tỷ");
    await expect(preview(page)).toBeVisible();
    for (const r of rows)
      await expect(
        changeLine(page, r.id, PRICE).locator('[data-part="to"]'),
        "mot-o-ca-vung",
      ).toHaveText("3 tỷ");
    await expect(
      preview(page).locator('[data-slot="paste-changes"] [role="listitem"]'),
    ).toHaveCount(4);
  });

  test("khoi-lap", async ({ page }) => {
    at1440();
    await openInventory(page);
    const rows = await rowsWhere(
      page,
      2,
      (r) => priced(r) && STATUS_NEXT[r.status].includes("Hold") && r.price !== 3_000_000_000,
      "khoi-lap",
    );
    await select(page, rows[0]!.id, STATUS);
    await select(page, rows[1]!.id, PRICE, true);
    await pasteText(page, tsv([["Tạm ngừng", "3 tỷ"]]));
    await expect(
      preview(page).locator('[data-slot="paste-changes"] [role="listitem"]'),
      "khoi-lap",
    ).toHaveCount(4);
    for (const r of rows) {
      await expect(changeLine(page, r.id, PRICE).locator('[data-part="to"]')).toHaveText("3 tỷ");
      await expect(changeLine(page, r.id, STATUS).locator('[data-part="to"]')).toHaveText(
        "Tạm ngừng",
      );
    }
  });

  test("loc-khong-ghi-dong-an", async ({ page }) => {
    at1440();
    await openInventory(page);
    const all = await shownRows(page);
    const filter = page
      .locator('[data-slot="data-region"] [data-slot="column-filter"] input')
      .first();
    // Filter by the floor digits of a unit that has hidden neighbours on both sides.
    const pick = all.find((r) => r.unit.length >= 3 && priced(r))!;
    await filter.fill(pick.unit.slice(0, 2));
    await expect.poll(async () => (await shownRows(page)).length).toBeLessThan(all.length);
    const shown = await shownRows(page);
    const run = shown.filter(priced).slice(0, 3);
    const visibleIds = new Set(shown.map((r) => r.id));
    await select(page, run[0]!.id, PRICE);
    const block = shown.slice(
      shown.indexOf(shown.find((r) => r.id === run[0]!.id)!),
      shown.indexOf(shown.find((r) => r.id === run[0]!.id)!) + 3,
    );
    await pasteText(page, tsv(block.map((r) => [money((r.price ?? 4_000_000_000) + 100_000_000)])));
    await expect(preview(page)).toBeVisible();
    const lineIds = await preview(page)
      .locator("[data-paste-line]")
      .evaluateAll((els) => els.map((e) => e.getAttribute("data-paste-line")!.split("|")[0]!));
    expect(lineIds.every((id) => visibleIds.has(id) || id.startsWith("beyond"))).toBe(true);
    const apply = preview(page).getByRole("button", { name: /^Áp \d+ ô$/ });
    await apply.click();
    await expect.poll(async () => (await saves(page)).length).toBeGreaterThan(0);
    const written = (await saves(page)).map((s) => s.id);
    expect(
      written.filter((id) => !visibleIds.has(id)),
      "loc-khong-ghi-dong-an: ghi dòng ẩn",
    ).toEqual([]);
    expect(written.includes(run[0]!.id)).toBe(true);
  });

  test("ngoai-tuyen-tu-dau", async ({ page, context }) => {
    at1440();
    await openInventory(page);
    const rows = await rowsWhere(page, 2, priced, "ngoai-tuyen-tu-dau");
    await pastePrices(page, rows, rows.map(nudged));
    await context.setOffline(true);
    await preview(page).getByRole("button", { name: "Áp 2 ô" }).click();
    await expect(
      toasts(page).filter({ hasText: "Chưa ô nào được ghi — mất kết nối mạng." }),
      "ngoai-tuyen-tu-dau",
    ).toHaveCount(1);
    for (const r of rows) await expect(cellOf(page, r.id, PRICE)).toHaveText(money(r.price!));
    await context.setOffline(false);
  });

  for (const colorScheme of ["light", "dark"] as const) {
    test(`axe-sang-toi: ${colorScheme}`, { tag: "@cho" }, async ({ page }) => {
      at1440();
      await page.emulateMedia({ colorScheme });
      await openInventory(page);
      const rows = await rowsWhere(page, 3, priced, "axe-sang-toi");
      await select(page, rows[0]!.id, PRICE);
      await pasteText(
        page,
        tsv([[money(rows[0]!.price! * 2)], ["chữ lạ"], [money(nudged(rows[2]!))]]),
      );
      await expect(preview(page)).toBeVisible();
      const { violations } = await new AxeBuilder({ page })
        .include('[data-slot="paste-preview"]')
        .analyze();
      expect(
        violations.map((v) => v.id),
        `axe-sang-toi: ${colorScheme}`,
      ).toEqual([]);
    });
  }
});
