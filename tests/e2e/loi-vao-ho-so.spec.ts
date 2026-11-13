// decision:wcag-aa
// decision:no-sideways-scroll
// Ways into one listing's record (roadmap row 3f, _acceptance/loi-vao-ho-so): «Chép đường dẫn» at the head of the record
// (E1, E2), the copied link opened in another browser (E3), a stale link (E4), the inventory opened from a unit code
// (E5 part, E6 on the real page), and an accessibility scan of the record with the new button (E8). The top-bar ⌘K box
// is measured once it is built. Every check has a break case with a pinned message.
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const INVENTORY = "/inventory";
/** Sample codes found in two buildings or more (written before the code, from the 60 sample listings). */
const SHARED_CODES = new Set([
  "1303",
  "1603",
  "0601",
  "0606",
  "1204",
  "1606",
  "0903",
  "1502",
  "1504",
  "1003",
]);
const PHONE = new Set(["414", "360"]);
const STALE = "Căn trong đường dẫn không còn trong Bảng hàng.";
const COPIED = "Đã chép đường dẫn";
const COPY_FAILED = "Chưa chép được. Bạn chép đường dẫn trong ô địa chỉ của trình duyệt.";

const panel = (page: Page) => page.locator('[data-slot="record-panel"]');
const openers = (page: Page) => page.locator("[data-record-open]");
const copyButton = (page: Page) => panel(page).getByRole("button", { name: "Chép đường dẫn" });

/** Adds a style to the page before it loads: how a break case changes the real page. */
async function injectStyle(page: Page, css: string): Promise<void> {
  await page.addInitScript((text) => {
    document.addEventListener("DOMContentLoaded", () => {
      const style = document.createElement("style");
      style.textContent = text;
      document.head.append(style);
    });
  }, css);
}

async function openInventory(page: Page, query = ""): Promise<void> {
  await page.goto(`${INVENTORY}${query}`);
  await page.locator('[data-slot="data-region"]').first().waitFor();
  await expect(page.locator('[hidden][id^="S:"]')).toHaveCount(0);
}

/** Opens the fifth listing, or with `unique` the first whose code is in one building only; returns its id and unit. */
async function openFifth(page: Page, unique = false): Promise<{ id: string; unit: string }> {
  await openers(page).nth(4).waitFor();
  let opener = openers(page).nth(4);
  if (unique) {
    const codes = await openers(page).allTextContents();
    opener = openers(page).nth(codes.findIndex((c) => !SHARED_CODES.has(c.trim())));
  }
  const id = (await opener.getAttribute("data-record-open")) ?? "";
  const unit = ((await opener.textContent()) ?? "").trim();
  await opener.click();
  await expect(panel(page)).toHaveAttribute("data-record-id", id);
  return { id, unit };
}

/** E1: «Chép đường dẫn» sits before «Trước» in the head; on the phone the four buttons stay inside the screen. */
async function checkCopyButtonPlace(page: Page, phone: boolean): Promise<void> {
  const head = panel(page).locator('[data-slot="record-panel-header"]');
  const names = await head
    .getByRole("button")
    .evaluateAll((buttons) =>
      buttons.map((b) => b.getAttribute("aria-label") ?? (b.textContent ?? "").trim()),
    );
  const copy = names.findIndex((n) => n.includes("Chép đường dẫn"));
  const previous = names.findIndex((n) => n.includes("Trước"));
  expect(copy, "copy link missing from the record head").toBeGreaterThanOrEqual(0);
  expect(copy, "copy link missing from the record head").toBeLessThan(previous);
  if (!phone) return;
  const width = page.viewportSize()?.width ?? 0;
  for (const box of await head
    .getByRole("button")
    .evaluateAll((buttons) => buttons.map((b) => b.getBoundingClientRect().toJSON() as DOMRect))) {
    expect(box.right, "record head buttons fall off the phone").toBeLessThanOrEqual(width + 0.5);
    expect(box.left, "record head buttons fall off the phone").toBeGreaterThanOrEqual(-0.5);
  }
}

test.describe("E1 · copy link at the head of the record", () => {
  test("the button sits before «Trước», on every width", async ({ page }, info) => {
    await openInventory(page);
    await openFifth(page);
    await checkCopyButtonPlace(page, PHONE.has(info.project.name));
    await expect(panel(page).locator('[data-slot="listing-card"]')).toBeVisible();
  });

  test("the check fails when the button is gone", async ({ page }, info) => {
    await injectStyle(page, '[data-slot="copy-link"] { display: none !important; }');
    await openInventory(page);
    await openFifth(page);
    await expect(checkCopyButtonPlace(page, PHONE.has(info.project.name))).rejects.toThrow(
      "copy link missing from the record head",
    );
  });

  test("the phone check fails when the button shows its words", async ({ page }, info) => {
    test.skip(info.project.name !== "360", "phone only");
    await injectStyle(
      page,
      '[data-slot="copy-link"] span { position: static !important; width: auto !important; height: auto !important; clip: auto !important; white-space: nowrap !important; margin: 0 !important; } [data-slot="copy-link"] { padding-inline: 40px !important; }',
    );
    await openInventory(page);
    await openFifth(page);
    await expect(checkCopyButtonPlace(page, true)).rejects.toThrow(
      "record head buttons fall off the phone",
    );
  });
});

test.describe("E2, E3 · the copied link", () => {
  test("copies this listing's inventory link and says so; another browser opens the same record", async ({
    page,
    browser,
  }, info) => {
    test.skip(info.project.name !== "1440", "one width is enough for the clipboard");
    await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);
    await openInventory(page);
    const { id, unit } = await openFifth(page);
    await copyButton(page).click();
    await expect(page.getByText(COPIED)).toBeVisible();
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    const expected = new URL(`/inventory?ho-so=${encodeURIComponent(id)}`, page.url()).toString();
    expect(copied, "copied link lost the listing").toBe(expected);

    const other = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const colleague = await other.newPage();
    await colleague.goto(copied);
    await expect(panel(colleague), "link opened the wrong listing").toHaveAttribute(
      "data-record-id",
      id,
    );
    await expect(panel(colleague).locator("h2")).toContainText(unit);
    await other.close();
  });

  test("a refused clipboard says where to copy from, and never says copied", async ({
    page,
  }, info) => {
    test.skip(info.project.name !== "1440", "one width is enough for the clipboard");
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "clipboard", {
        value: { writeText: () => Promise.reject(new Error("refused")) },
      });
    });
    await openInventory(page);
    await openFifth(page);
    await copyButton(page).click();
    await expect(page.getByText(COPY_FAILED)).toBeVisible();
    await expect(page.getByText(COPIED, { exact: true })).toHaveCount(0);
  });
});

test.describe("E4 · a link to a listing that left the inventory", () => {
  test("opens the inventory as usual and says why; a good link and no link say nothing", async ({
    page,
  }, info) => {
    test.skip(info.project.name !== "1440", "one width is enough");
    await openInventory(page, "?ho-so=khong-co");
    await expect(page.getByText(STALE), "stale link opened silently").toBeVisible();
    await expect(panel(page)).toHaveCount(0);
    await expect(openers(page).first()).toBeVisible();

    await openInventory(page);
    const { id } = await openFifth(page);
    await openInventory(page, `?ho-so=${encodeURIComponent(id)}`);
    await expect(panel(page)).toHaveAttribute("data-record-id", id);
    await expect(page.getByText(STALE)).toHaveCount(0);
  });
});

test.describe("E5, E6 · the inventory opened from a unit code", () => {
  test("one unit: the code sits in the unit column filter and its record opens", async ({
    page,
  }) => {
    await openInventory(page);
    const { id, unit } = await openFifth(page, true);
    await openInventory(page, `?ma=${encodeURIComponent(`  ${unit.toLowerCase()} `)}`);
    await expect(panel(page)).toHaveAttribute("data-record-id", id);
    // On the phone the record covers the grid, so the filter is read by its name, not by its role in view.
    const filter = page.locator('input[aria-label="Lọc cột Căn"]');
    await expect(filter, "code not in the unit column filter").toHaveValue(
      unit.toLowerCase().trim(),
    );
  });

  test("a code in three buildings: three rows, three buildings, no record opens", async ({
    page,
  }) => {
    await openInventory(page, "?ma=0601");
    await expect(openers(page)).toHaveCount(3);
    const buildings = await page
      .locator('[data-slot="data-region"] tbody tr')
      .evaluateAll((rows) =>
        rows.map((r) => r.querySelectorAll("td")[2]?.textContent?.trim() ?? ""),
      );
    expect(new Set(buildings).size, "building missing from choice").toBe(3);
    await expect(panel(page), "many buildings opened the first").toHaveCount(0);
  });

  test("an unknown code opens no record", async ({ page }) => {
    await openInventory(page, "?ma=Z-99.99");
    await expect(panel(page), "unknown code opened a record").toHaveCount(0);
    await expect(page.getByText("Không có dòng nào khớp")).toBeVisible();
  });
});

test.describe("E8 · accessibility with the copy button", () => {
  for (const scheme of ["light", "dark"] as const) {
    test(`no serious or critical issue, ${scheme}`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: scheme });
      await openInventory(page);
      await openFifth(page);
      const width = await page.evaluate(() => [
        document.documentElement.scrollWidth,
        document.documentElement.clientWidth,
      ]);
      expect(width[0], "record head scrolls sideways").toBeLessThanOrEqual(width[1]!);
      const result = await new AxeBuilder({ page }).include('[data-slot="record-panel"]').analyze();
      const bad = result.violations.filter(
        (v) => v.impact === "serious" || v.impact === "critical",
      );
      expect(bad.map((v) => v.id)).toEqual([]);
    });
  }
});
