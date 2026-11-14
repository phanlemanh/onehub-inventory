// decision:wcag-aa
// decision:no-sideways-scroll
// Ways into one listing's record (roadmap row 3f, _acceptance/loi-vao-ho-so): «Chép đường dẫn» at the head of the record
// (E1, E2), the copied link opened in another browser (E3), a stale link (E4), the inventory opened from a unit code
// (E6 on the real page), the top-bar ⌘K box (E5), an unknown code typed in it (E7), and accessibility scans of the record,
// the grid after an unknown code and the open box (E8). Every check has a break case with a pinned message.
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

const SEARCH = "Gõ mã căn";
const UNKNOWN = "Z-99.99";
const NO_MATCH = "Không có dòng nào khớp";

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

  test("the phone check fails when the button grows past the screen", async ({ page }, info) => {
    test.skip(info.project.name !== "360", "phone only");
    // Row 3e: the button is an icon on every width, so a wide button stands in for one that shows its words.
    await injectStyle(page, '[data-slot="copy-link"] { min-width: 420px !important; }');
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

const searchButton = (page: Page) =>
  page.locator('[data-slot="app-shell-top-bar"]').getByRole("button", { name: SEARCH });
const palette = (page: Page) => page.locator('[data-slot="unit-jump-palette"]');
const paletteInput = (page: Page) => palette(page).getByRole("combobox");
const unitFilter = (page: Page) => page.locator('input[aria-label="Lọc cột Căn"]');

/** The first listing whose code is in one building only: its id, code and building, read from the grid. */
async function uniqueRow(page: Page): Promise<{ id: string; unit: string; building: string }> {
  await openInventory(page);
  await openers(page).nth(4).waitFor();
  const codes = await openers(page).allTextContents();
  const index = codes.findIndex((c) => !SHARED_CODES.has(c.trim()));
  const opener = openers(page).nth(index);
  const id = (await opener.getAttribute("data-record-open")) ?? "";
  const unit = ((await opener.textContent()) ?? "").trim();
  const building = (
    (await page
      .locator('[data-slot="data-region"] tbody tr')
      .nth(index)
      .locator("td")
      .nth(2)
      .textContent()) ?? ""
  ).trim();
  return { id, unit, building };
}

/** Shows the row of column filters (it opens by itself only when a filter is set). */
async function showFilters(page: Page): Promise<void> {
  if (await unitFilter(page).isVisible()) return;
  await page
    .locator('[data-slot="data-region"]')
    .getByRole("button", { name: "Lọc", exact: true })
    .click();
  await expect(unitFilter(page)).toBeVisible();
}

async function openSearch(page: Page): Promise<void> {
  await searchButton(page).click();
  await expect(paletteInput(page)).toBeFocused();
}

/** E5: after a jump the grid is at /inventory, the code sits in the unit column filter, and the record is open. */
async function checkJumped(page: Page, id: string, unit: string): Promise<void> {
  await expect(page, "jump did not navigate").toHaveURL(/\/inventory\?/, { timeout: 5000 });
  await expect(unitFilter(page), "code not in the unit column filter").toHaveValue(unit, {
    timeout: 5000,
  });
  await expect(panel(page)).toHaveAttribute("data-record-id", id);
}

/** A capture listener ahead of the page's own: how a break case swallows or steals a key. */
async function captureKey(page: Page, script: string): Promise<void> {
  await page.addInitScript(script);
}

test.describe("E5 · the top-bar ⌘K box", () => {
  for (const start of ["/inventory", "/"]) {
    test(`from ${start}: suggests the code, Enter opens its record in the inventory`, async ({
      page,
    }, info) => {
      test.skip(!["1440", "360"].includes(info.project.name), "1440 and 360");
      const { id, unit } = await uniqueRow(page);
      await page.goto(start);
      await openSearch(page);
      await paletteInput(page).fill(unit.slice(0, 2));
      const suggestion = palette(page).getByRole("option").filter({ hasText: unit }).first();
      await expect(suggestion).toContainText("Căn");
      await paletteInput(page).fill(`  ${unit.toLowerCase()}  `);
      await paletteInput(page).press("Enter");
      await checkJumped(page, id, unit);
      await expect(unitFilter(page)).toBeVisible();
    });
  }

  test("a suggestion chosen with the mouse does the same", async ({ page }, info) => {
    test.skip(info.project.name !== "1440", "one width is enough");
    const { id, unit } = await uniqueRow(page);
    await openSearch(page);
    await paletteInput(page).fill(unit);
    await palette(page).getByRole("option").filter({ hasText: unit }).first().click();
    await checkJumped(page, id, unit);
  });

  test("a building suggestion fills the building column and opens no record", async ({
    page,
  }, info) => {
    test.skip(info.project.name !== "1440", "one width is enough");
    const { building } = await uniqueRow(page);
    await openSearch(page);
    await paletteInput(page).fill(building);
    const suggestion = palette(page).getByRole("option").filter({ hasText: "Toà" }).first();
    await expect(suggestion).toContainText(building);
    await suggestion.click();
    await expect(page.locator('input[aria-label="Lọc cột Toà"]')).toHaveValue(building);
    await expect(panel(page)).toHaveCount(0);
  });

  test("Ctrl+K, Meta+K and / open the box; / in a field stays in the field", async ({
    page,
  }, info) => {
    test.skip(info.project.name !== "1440", "keys on the desktop");
    await openInventory(page);
    // The shortcut works once the box has attached its key listener; pressing earlier tests the page's load, not the keys.
    await expect(page.locator('[data-slot="unit-jump"][data-ready]')).toHaveCount(1);
    for (const key of ["Control+k", "Meta+k"]) {
      await page.locator("body").press(key);
      await expect(paletteInput(page)).toBeFocused();
      await page.keyboard.press("Escape");
      await expect(palette(page)).toHaveCount(0);
    }
    await page.locator("body").press("/");
    await expect(paletteInput(page)).toBeFocused();
    await page.keyboard.press("Escape");
    await showFilters(page);
    await unitFilter(page).click();
    await page.keyboard.press("/");
    await expect(palette(page), "slash stolen from a text field").toHaveCount(0);
    await expect(unitFilter(page), "slash stolen from a text field").toHaveValue("/");
  });

  test("Enter in an empty box goes nowhere; Esc closes and gives focus back", async ({
    page,
  }, info) => {
    test.skip(info.project.name !== "1440", "one width is enough");
    await openInventory(page);
    const before = page.url();
    await openSearch(page);
    await paletteInput(page).press("Enter");
    await expect(paletteInput(page)).toBeVisible();
    expect(page.url()).toBe(before);
    await page.keyboard.press("Escape");
    await expect(palette(page)).toHaveCount(0);
    await expect(searchButton(page)).toBeFocused();
  });

  test("the check fails when Enter is swallowed", async ({ page }, info) => {
    test.skip(info.project.name !== "1440", "one width is enough");
    await captureKey(
      page,
      `window.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && e.target instanceof Element && e.target.closest('[data-slot="unit-jump-palette"]')) {
          e.stopImmediatePropagation();
          e.preventDefault();
        }
      }, true);`,
    );
    const { id, unit } = await uniqueRow(page);
    await page.goto("/");
    await openSearch(page);
    await paletteInput(page).fill(unit);
    await paletteInput(page).press("Enter");
    await expect(checkJumped(page, id, unit)).rejects.toThrow("jump did not navigate");
  });

  test("the check fails when / is stolen from a field", async ({ page }, info) => {
    test.skip(info.project.name !== "1440", "one width is enough");
    await captureKey(
      page,
      `window.addEventListener("keydown", (e) => {
        if (e.key === "/" && e.target instanceof HTMLInputElement) {
          e.preventDefault();
          document.querySelector('[data-slot="unit-jump"] button')?.click();
        }
      }, true);`,
    );
    await openInventory(page);
    await showFilters(page);
    await unitFilter(page).click();
    await page.keyboard.press("/");
    await expect(
      expect(palette(page), "slash stolen from a text field").toHaveCount(0, { timeout: 2000 }),
    ).rejects.toThrow("slash stolen from a text field");
  });

  test("the check fails when the code lands in another column", async ({ page }, info) => {
    test.skip(info.project.name !== "1440", "one width is enough");
    const { id, unit } = await uniqueRow(page);
    // The code in the building column instead of the unit column, with the record open.
    await openInventory(page, `?toa=${encodeURIComponent(unit)}&ho-so=${encodeURIComponent(id)}`);
    await expect(checkJumped(page, id, unit)).rejects.toThrow("code not in the unit column filter");
  });
});

/** E7: an unknown code shows «no row matches» with «Xoá lọc», the code visible in the unit filter, and no record. */
async function checkUnknown(page: Page): Promise<void> {
  await expect(page.getByText(NO_MATCH)).toBeVisible();
  await expect(unitFilter(page)).toHaveValue(UNKNOWN);
  await expect(unitFilter(page)).toBeVisible();
  await expect(panel(page), "unknown code opened a record").toHaveCount(0);
}

test.describe("E7 · an unknown code typed in the box", () => {
  test("says no row matches, keeps the code in the unit filter, and «Xoá lọc» brings every row back", async ({
    page,
  }, info) => {
    test.skip(!["1440", "360"].includes(info.project.name), "1440 and 360");
    await page.goto("/");
    await openSearch(page);
    await paletteInput(page).fill(UNKNOWN);
    await paletteInput(page).press("Enter");
    await expect(page).toHaveURL(/\/inventory\?ma=/);
    await checkUnknown(page);
    await page
      .locator('[data-slot="data-region"]')
      .getByRole("button", { name: "Xoá lọc" })
      .click();
    await expect(unitFilter(page)).toHaveValue("");
    await expect(openers(page).first()).toBeVisible();
    await expect(page.getByText(NO_MATCH)).toHaveCount(0);
  });

  test("the check fails when a record opens anyway", async ({ page }, info) => {
    test.skip(info.project.name !== "1440", "one width is enough");
    await openInventory(page, `?ma=${UNKNOWN}`);
    // A record panel standing beside the empty grid, as if the first row had been opened anyway.
    await page.evaluate(() => {
      const fake = document.createElement("section");
      fake.dataset["slot"] = "record-panel";
      document.body.append(fake);
    });
    await expect(checkUnknown(page)).rejects.toThrow("unknown code opened a record");
  });
});

/** E8: no sideways scroll and no serious or critical axe issue inside `scope`. */
async function checkReadable(page: Page, scope: string): Promise<void> {
  const width = await page.evaluate(() => [
    document.documentElement.scrollWidth,
    document.documentElement.clientWidth,
    // The record head stands inside a panel that clips: its right edge is measured against the screen too.
    document.querySelector('[data-slot="record-panel-header"]')?.getBoundingClientRect().right ?? 0,
  ]);
  expect(width[0], "record head scrolls sideways").toBeLessThanOrEqual(width[1]!);
  expect(width[2], "record head scrolls sideways").toBeLessThanOrEqual(width[1]! + 0.5);
  // Measured once the box has finished appearing: a fading box reads as pale text.
  await page.waitForFunction(() =>
    document.getAnimations().every((a) => a.playState !== "running"),
  );
  const result = await new AxeBuilder({ page }).include(scope).analyze();
  const bad = result.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
  expect(bad.map((v) => v.id)).toEqual([]);
}

test.describe("E8 · the grid after an unknown code, and the open box", () => {
  for (const scheme of ["light", "dark"] as const) {
    test(`no serious or critical issue, ${scheme}`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: scheme });
      await openInventory(page, `?ma=${UNKNOWN}`);
      await checkReadable(page, '[data-slot="data-region"]');
      await openSearch(page);
      await paletteInput(page).fill("0");
      await expect(palette(page).getByRole("option").first()).toBeVisible();
      await checkReadable(page, '[data-slot="unit-jump-palette"]');
    });
  }

  test("the check fails when the record head is wider than the screen", async ({ page }, info) => {
    test.skip(info.project.name !== "360", "phone only");
    await injectStyle(page, '[data-slot="record-panel-header"] { min-width: 900px !important; }');
    await openInventory(page);
    await openFifth(page);
    await expect(checkReadable(page, '[data-slot="record-panel"]')).rejects.toThrow(
      "record head scrolls sideways",
    );
  });

  test("the check fails on pale text", async ({ page }, info) => {
    test.skip(info.project.name !== "1440", "one width is enough");
    await openInventory(page);
    await openFifth(page);
    await page.evaluate(() => {
      const p = document.createElement("p");
      p.textContent = "Chữ xám nhạt";
      p.style.cssText = "color:#eeeeee;background:#ffffff";
      document.querySelector('[data-slot="record-panel"]')?.append(p);
    });
    await expect(checkReadable(page, '[data-slot="record-panel"]')).rejects.toThrow(
      "color-contrast",
    );
  });
});
