// decision:record-panel
// decision:wcag-aa
// Row 3a (_acceptance/ngan-chi-tiet-ghim-thanh-cot): the record panel pinned as a column beside the grid. One block per
// eval (E1–E5, E7, E8); every check is a function that throws a pinned message, and every check has a break case that
// changes the real page and expects that message.
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type BrowserContext, type Page } from "@playwright/test";

const WIDE = new Set(["1440", "1024"]);
const PHONE = new Set(["414", "360"]);
const PIN = "Ghim thành cột";
const UNPIN = "Bỏ ghim";
const DIVIDER = "Đổi rộng hồ sơ";
const PIN_COOKIE = "ho_so_ghim";
/** The narrowest pinned column and the narrowest grid beside it (AC-1, AC-5). */
const MIN_COLUMN = 320;
const MIN_GRID = 480;

const panel = (page: Page) => page.locator('[data-slot="record-panel"]');
const openers = (page: Page) => page.locator("[data-record-open]");
const region = (page: Page) => page.locator('[data-slot="data-region"]');
const pinButton = (page: Page) => page.getByRole("button", { name: PIN, exact: true });
const unpinButton = (page: Page) => page.getByRole("button", { name: UNPIN, exact: true });
const divider = (page: Page) => page.getByRole("separator", { name: DIVIDER });

interface Box {
  top: number;
  bottom: number;
  left: number;
  right: number;
  width: number;
}

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

async function openScreen(page: Page, path: string): Promise<void> {
  await page.goto(path);
  await region(page).locator("tbody tr").first().waitFor();
  await expect(page.locator('[hidden][id^="S:"]')).toHaveCount(0);
  await expect(
    page.locator('[data-slot="data-region-body"] [data-slot="scroll-area-viewport"]').first(),
  ).toHaveAttribute("tabindex", "0");
}

async function openRow(page: Page, n: number): Promise<string> {
  const opener = openers(page).nth(n);
  const id = (await opener.getAttribute("data-record-open")) ?? "";
  await opener.click();
  await expect(panel(page)).toHaveAttribute("data-record-id", id);
  return id;
}

async function pin(page: Page): Promise<void> {
  await pinButton(page).click();
  await expect(panel(page)).toHaveAttribute("data-record-layout", "pinned");
}

async function box(page: Page, selector: string): Promise<Box> {
  return page
    .locator(selector)
    .first()
    .evaluate((el) => {
      const r = el.getBoundingClientRect();
      return { top: r.top, bottom: r.bottom, left: r.left, right: r.right, width: r.width };
    });
}

/** The record's outer column (the dialog around the record). */
async function columnBox(page: Page): Promise<Box> {
  return panel(page).evaluate((el) => {
    const r = (el.closest('[role="dialog"]') ?? el).getBoundingClientRect();
    return { top: r.top, bottom: r.bottom, left: r.left, right: r.right, width: r.width };
  });
}

async function headersShown(page: Page): Promise<number> {
  return region(page)
    .locator("thead th")
    .evaluateAll((ths) => ths.filter((th) => (th as HTMLElement).offsetParent !== null).length);
}

// ---- E1 · AC-1: where the pin button is --------------------------------------------------------------------------------

/** The names of the buttons of the header's second line, left to right. */
async function actionOrder(page: Page): Promise<string[]> {
  return panel(page)
    .locator('[data-slot="record-panel-actions"] button')
    .evaluateAll((buttons) =>
      buttons
        .map((b) => ({
          x: b.getBoundingClientRect().left,
          name: (b.getAttribute("aria-label") ?? b.textContent ?? "").trim(),
        }))
        .sort((a, b) => a.x - b.x)
        .map((b) => b.name),
    );
}

function assertPinPlace(order: string[]): void {
  const at = order.indexOf(PIN);
  if (at === -1) throw new Error("no pin button");
  const tail = order.slice(at + 1);
  if (tail.indexOf("Trước") !== 0 || !tail.includes("Sau") || !tail.includes("Đóng")) {
    const after = order[at - 1] ?? "start";
    throw new Error(`pin button out of place: after ${after}`);
  }
}

test.describe("E1 · the pin button sits before Trước, Sau, Đóng", () => {
  for (const path of ["/inventory", "/sent"]) {
    test(`on ${path}`, async ({ page, browserName }, info) => {
      test.skip(browserName !== "chromium" || !WIDE.has(info.project.name), "do o 1440 va 1024");
      await openScreen(page, path);
      await openRow(page, 0);
      assertPinPlace(await actionOrder(page));
    });
  }

  test("break: a pin button after Đóng is caught", async ({ page, browserName }, info) => {
    test.skip(browserName !== "chromium" || info.project.name !== "1440", "do o 1440");
    await injectStyle(page, '[data-slot="record-pin"]{order:99}');
    await openScreen(page, "/inventory");
    await openRow(page, 0);
    const order = await actionOrder(page);
    expect(() => assertPinPlace(order)).toThrow("pin button out of place: after Đóng");
  });

  test("no pin on a phone; the record is full screen", async ({ page, browserName }, info) => {
    test.skip(browserName !== "chromium" || !PHONE.has(info.project.name), "do o 414 va 360");
    await openScreen(page, "/inventory");
    await openRow(page, 0);
    await expect(panel(page)).toHaveAttribute("data-record-layout", "screen");
    await expect(pinButton(page)).toHaveCount(0);
    await expect(unpinButton(page)).toHaveCount(0);
  });

  test("at 768 the pin shows only with room for a 320 px column and a 480 px grid", async ({
    page,
    context,
    browserName,
  }, info) => {
    test.skip(browserName !== "chromium" || info.project.name !== "1024", "do mot lan, khung 768");
    await page.setViewportSize({ width: 768, height: 1024 });
    await context.addCookies([{ name: "app_shell_cot2", value: "1", url: "http://127.0.0.1" }]);
    await openScreen(page, "/inventory");
    await openRow(page, 0);
    const area = (await box(page, '[data-slot="sidebar-inset"]')).width;
    if (area < MIN_COLUMN + MIN_GRID) {
      await expect(pinButton(page)).toHaveCount(0);
      await expect(panel(page)).toHaveAttribute("data-record-layout", "float");
    }
    await context.addCookies([{ name: "app_shell_cot2", value: "0", url: "http://127.0.0.1" }]);
    await openScreen(page, "/inventory");
    await openRow(page, 0);
    const wider = (await box(page, '[data-slot="sidebar-inset"]')).width;
    expect(wider).toBeGreaterThanOrEqual(MIN_COLUMN + MIN_GRID);
    await pin(page);
    const col = await columnBox(page);
    expect(col.width).toBeGreaterThanOrEqual(MIN_COLUMN - 1);
    expect(col.width).toBeLessThanOrEqual(wider - MIN_GRID + 1);
  });
});

// ---- E2 · AC-2: pinning makes room; unpinning floats it back ----------------------------------------------------------

async function assertRoomMade(page: Page, before: number): Promise<void> {
  const col = await columnBox(page);
  const reg = await box(page, '[data-slot="data-region"]');
  const area = await box(page, '[data-slot="sidebar-inset"]');
  if (Math.abs(col.right - area.right) > 1) throw new Error("pinned column not flush right");
  if (reg.right > col.left + 1) throw new Error("region under pinned column");
  const shadow = await panel(page).evaluate((el) => getComputedStyle(el).boxShadow);
  if (shadow !== "none") throw new Error("pinned column still floats");
  const now = await headersShown(page);
  if (now !== before) throw new Error(`columns hidden on pin: ${before} → ${now}`);
}

test.describe("E2 · pinning makes room beside the grid", () => {
  for (const path of ["/inventory", "/sent"]) {
    test(`on ${path}: room, same columns, focus and scroll kept`, async ({
      page,
      browserName,
    }, info) => {
      test.skip(browserName !== "chromium" || !WIDE.has(info.project.name), "do o 1440 va 1024");
      await openScreen(page, path);
      const headers = await headersShown(page);
      const fullWidth = (await box(page, '[data-slot="data-region"]')).width;
      const id = await openRow(page, 1);
      const body = panel(page).locator('[data-slot="record-panel-body"]');
      await body.evaluate((el) => (el.scrollTop = 120));
      const scrolled = await body.evaluate((el) => el.scrollTop);
      await pinButton(page).click();
      await expect(panel(page)).toHaveAttribute("data-record-layout", "pinned");
      await assertRoomMade(page, headers);
      await expect(unpinButton(page)).toHaveAttribute("aria-pressed", "true");
      await expect(unpinButton(page)).toBeFocused();
      expect(Math.abs((await body.evaluate((el) => el.scrollTop)) - scrolled)).toBeLessThanOrEqual(
        1,
      );
      await unpinButton(page).click();
      await expect(panel(page)).toHaveAttribute("data-record-layout", "float");
      await expect(panel(page)).toHaveAttribute("data-record-id", id);
      await expect(pinButton(page)).toBeFocused();
      expect(Math.abs((await body.evaluate((el) => el.scrollTop)) - scrolled)).toBeLessThanOrEqual(
        1,
      );
      expect(
        Math.abs((await box(page, '[data-slot="data-region"]')).width - fullWidth),
      ).toBeLessThanOrEqual(1);
    });
  }

  test("break: a region that does not give room is caught", async ({ page, browserName }, info) => {
    test.skip(browserName !== "chromium" || info.project.name !== "1440", "do o 1440");
    await injectStyle(page, '[data-slot="data-region"]{margin-right:0 !important}');
    await openScreen(page, "/inventory");
    const headers = await headersShown(page);
    await openRow(page, 1);
    await pin(page);
    await expect(assertRoomMade(page, headers)).rejects.toThrow("region under pinned column");
  });

  test("break: a column hidden on pin is caught", async ({ page, browserName }, info) => {
    test.skip(browserName !== "chromium" || info.project.name !== "1440", "do o 1440");
    await injectStyle(
      page,
      'html:has([data-record-layout="pinned"]) [data-slot="data-region"] thead th:last-child{display:none}',
    );
    await openScreen(page, "/inventory");
    const headers = await headersShown(page);
    await openRow(page, 1);
    await pin(page);
    await expect(assertRoomMade(page, headers)).rejects.toThrow(
      `columns hidden on pin: ${headers} → ${headers - 1}`,
    );
  });
});

// ---- E3 · AC-3: the pin stays on every way through the records --------------------------------------------------------

const WAYS = ["sau", "dong khac", "dong roi mo", "tai lai", "sang man khac"] as const;

async function assertStillPinned(page: Page, way: string, width: number): Promise<void> {
  const layout = await panel(page).getAttribute("data-record-layout");
  if (layout !== "pinned") throw new Error(`pin lost after: ${way}`);
  const now = (await columnBox(page)).width;
  if (Math.abs(now - width) > 1) throw new Error(`pin width changed after: ${way}`);
}

test.describe("E3 · the pin stays", () => {
  test("on five ways through the records", async ({ page, browserName }, info) => {
    test.skip(browserName !== "chromium" || info.project.name !== "1440", "do o 1440");
    expect(WAYS).toHaveLength(5);
    await openScreen(page, "/inventory");
    await openRow(page, 0);
    await pin(page);
    const width = (await columnBox(page)).width;
    await panel(page).getByRole("button", { name: "Sau" }).click();
    await assertStillPinned(page, WAYS[0], width);
    await openRow(page, 2);
    await assertStillPinned(page, WAYS[1], width);
    await panel(page).getByRole("button", { name: "Đóng" }).click();
    await expect(panel(page)).toHaveCount(0);
    const reg = await box(page, '[data-slot="data-region"]');
    const area = await box(page, '[data-slot="sidebar-inset"]');
    expect(reg.right).toBeLessThanOrEqual(area.right);
    await openRow(page, 1);
    await assertStillPinned(page, WAYS[2], width);
    await page.reload();
    await region(page).locator("tbody tr").first().waitFor();
    await expect(panel(page)).toBeVisible();
    await assertStillPinned(page, WAYS[3], width);
    await openScreen(page, "/sent");
    await openRow(page, 0);
    await assertStillPinned(page, WAYS[4], width);
  });

  test("break: a pin kept only in the page is lost on reload", async ({
    page,
    context,
    browserName,
  }, info) => {
    test.skip(browserName !== "chromium" || info.project.name !== "1440", "do o 1440");
    await openScreen(page, "/inventory");
    await openRow(page, 0);
    await pin(page);
    const width = (await columnBox(page)).width;
    await context.clearCookies({ name: PIN_COOKIE });
    await page.reload();
    await region(page).locator("tbody tr").first().waitFor();
    await expect(assertStillPinned(page, "tai lai", width)).rejects.toThrow(
      "pin lost after: tai lai",
    );
  });
});

// ---- E4 · AC-4: nothing covers the bars, the grid stays live ----------------------------------------------------------

async function assertBarsClear(page: Page): Promise<void> {
  const col = await columnBox(page);
  const bar = page.locator('[data-slot="app-shell-top-bar"]');
  if ((await bar.count()) > 0 && (await bar.isVisible())) {
    const b = await box(page, '[data-slot="app-shell-top-bar"]');
    if (col.top < b.bottom - 1) throw new Error("top bar covered by record");
  }
  const tools = await box(page, '[data-slot="data-region"] [data-slot="frame-panel"] > div');
  const overlap = !(
    tools.right <= col.left ||
    tools.left >= col.right ||
    tools.bottom <= col.top ||
    tools.top >= col.bottom
  );
  if (overlap) throw new Error("toolbar covered by record");
}

test.describe("E4 · bars clear, grid live", () => {
  test("floating and pinned", async ({ page, browserName }, info) => {
    test.skip(browserName !== "chromium" || !WIDE.has(info.project.name), "do o 1440 va 1024");
    await openScreen(page, "/inventory");
    await openRow(page, 0);
    await assertBarsClear(page);
    await pin(page);
    await assertBarsClear(page);
    const cell = region(page).locator("tbody tr").nth(1).locator('[role="gridcell"], td').nth(2);
    await cell.click({ position: { x: 4, y: 4 } });
    await expect(cell).toHaveAttribute("aria-selected", "true");
    await page.keyboard.press("ArrowDown");
    const below = region(page).locator("tbody tr").nth(2).locator('[role="gridcell"], td').nth(2);
    await expect(below).toHaveAttribute("aria-selected", "true");
    await region(page).getByRole("button", { name: "Toàn màn hình" }).click();
    await expect(panel(page)).toHaveAttribute("data-record-layout", "pinned");
    const col = await columnBox(page);
    expect((await box(page, '[data-slot="data-region"]')).right).toBeLessThanOrEqual(col.left + 1);
  });

  test("break: a pinned record from the top of the window is caught", async ({
    page,
    browserName,
  }, info) => {
    test.skip(browserName !== "chromium" || info.project.name !== "1440", "do o 1440");
    await injectStyle(page, '[role="dialog"]:has([data-record-layout="pinned"]){top:0 !important}');
    await openScreen(page, "/inventory");
    await openRow(page, 0);
    await pin(page);
    await expect(assertBarsClear(page)).rejects.toThrow("top bar covered by record");
  });
});

// ---- E5 · AC-5: dragging the divider -----------------------------------------------------------------------------------

async function drag(page: Page, dx: number): Promise<void> {
  const d = await divider(page).boundingBox();
  if (!d) throw new Error("no divider");
  await page.mouse.move(d.x + d.width / 2, d.y + d.height / 2);
  await page.mouse.down();
  await page.mouse.move(d.x + d.width / 2 + dx, d.y + d.height / 2, { steps: 10 });
  await page.mouse.up();
}

function assertWidthBounds(width: number, area: number): void {
  if (width < MIN_COLUMN - 1) throw new Error(`pinned column narrower than ${MIN_COLUMN}`);
  if (width > area * 0.6 + 1) throw new Error("pinned column wider than three fifths");
}

test.describe("E5 · the divider widens and narrows the column", () => {
  test("by mouse and by keys, inside its bounds, kept on reload", async ({
    page,
    browserName,
  }, info) => {
    test.skip(browserName !== "chromium" || info.project.name !== "1440", "do o 1440");
    await openScreen(page, "/inventory");
    await openRow(page, 0);
    await pin(page);
    const area = (await box(page, '[data-slot="sidebar-inset"]')).width;
    const start = (await columnBox(page)).width;
    await drag(page, -200);
    expect(Math.abs((await columnBox(page)).width - (start + 200))).toBeLessThanOrEqual(2);
    await drag(page, 2000);
    expect(Math.abs((await columnBox(page)).width - MIN_COLUMN)).toBeLessThanOrEqual(1);
    await drag(page, -2000);
    expect(Math.abs((await columnBox(page)).width - area * 0.6)).toBeLessThanOrEqual(1);
    assertWidthBounds((await columnBox(page)).width, area);
    await divider(page).focus();
    const before = (await columnBox(page)).width;
    await page.keyboard.press("ArrowRight");
    const narrower = (await columnBox(page)).width;
    expect(narrower).toBeLessThan(before);
    await page.keyboard.press("ArrowLeft");
    expect((await columnBox(page)).width).toBeGreaterThan(narrower);
    const last = (await columnBox(page)).width;
    await page.reload();
    await region(page).locator("tbody tr").first().waitFor();
    expect(Math.abs((await columnBox(page)).width - last)).toBeLessThanOrEqual(1);
  });

  test("break: a column narrower than 320 px is caught", async ({ page, browserName }, info) => {
    test.skip(browserName !== "chromium" || info.project.name !== "1440", "do o 1440");
    await injectStyle(
      page,
      '[role="dialog"]:has([data-record-layout="pinned"]){width:200px !important;min-width:0 !important}',
    );
    await openScreen(page, "/inventory");
    await openRow(page, 0);
    await pin(page);
    const area = (await box(page, '[data-slot="sidebar-inset"]')).width;
    expect(() => assertWidthBounds(200, area)).toThrow("pinned column narrower than 320");
    expect((await columnBox(page)).width).toBeLessThan(MIN_COLUMN);
  });
});

// ---- E7 · AC-6: what is kept on the device -----------------------------------------------------------------------------

async function storageKeys(page: Page): Promise<string[]> {
  return page.evaluate(() => [...Object.keys(localStorage), ...Object.keys(sessionStorage)].sort());
}

async function pinCookies(context: BrowserContext) {
  return (await context.cookies()).filter((c) => c.name.startsWith("ho_so"));
}

test.describe("E7 · one cookie, two numbers", () => {
  test("after pinning and dragging; a broken cookie floats", async ({
    page,
    context,
    browserName,
  }, info) => {
    test.skip(browserName !== "chromium" || info.project.name !== "1440", "do o 1440");
    await openScreen(page, "/inventory");
    const keysBefore = await storageKeys(page);
    const id = await openRow(page, 0);
    await pin(page);
    await drag(page, -100);
    const cookies = await pinCookies(context);
    expect(cookies.map((c) => c.name)).toEqual([PIN_COOKIE]);
    expect(cookies[0]!.value).toMatch(/^1:\d+$/);
    expect(cookies[0]!.value).not.toContain(id);
    expect(await storageKeys(page)).toEqual(keysBefore);
    await context.addCookies([{ name: PIN_COOKIE, value: "1:abc", url: page.url() }]);
    await page.reload();
    await region(page).locator("tbody tr").first().waitFor();
    await expect(panel(page)).toHaveAttribute("data-record-layout", "float");
  });
});

// ---- E8 · AC-7: accessibility and Esc ----------------------------------------------------------------------------------

async function seriousViolations(page: Page): Promise<string[]> {
  const { violations } = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .options({ rules: { "aria-dialog-name": { enabled: true } } })
    .exclude("nextjs-portal")
    .analyze();
  return violations
    .filter((v) => v.impact === "serious" || v.impact === "critical")
    .map((v) => v.id);
}

async function assertEscFromGridKeepsPin(page: Page, where: string): Promise<void> {
  if ((await panel(page).getAttribute("data-record-layout")) !== "pinned") {
    throw new Error(`pinned record closed from grid: ${where}`);
  }
}

test.describe("E8 · accessibility and Esc", () => {
  for (const colorScheme of ["light", "dark"] as const) {
    test(`scans pinned (${colorScheme})`, async ({ page, browserName }, info) => {
      test.skip(browserName !== "chromium" || info.project.name !== "1440", "do o 1440");
      await page.emulateMedia({ colorScheme });
      await openScreen(page, "/inventory");
      await openRow(page, 0);
      await pin(page);
      expect(await seriousViolations(page), colorScheme).toEqual([]);
      await expect(unpinButton(page)).toHaveAttribute("aria-pressed", "true");
      await expect(divider(page)).toHaveAttribute("aria-valuenow", /^\d+(\.\d+)?$/);
    });
  }

  test("Esc in the record closes it; Esc in the grid does not", async ({
    page,
    browserName,
  }, info) => {
    test.skip(browserName !== "chromium" || info.project.name !== "1440", "do o 1440");
    await openScreen(page, "/inventory");
    const opener = openers(page).nth(0);
    await openRow(page, 0);
    await pin(page);
    await unpinButton(page).focus();
    await page.keyboard.press("Escape");
    await expect(panel(page)).toHaveCount(0);
    await expect(opener).toBeFocused();
    await openRow(page, 1);
    await expect(panel(page)).toHaveAttribute("data-record-layout", "pinned");
    const cell = region(page).locator("tbody tr").nth(1).locator('[role="gridcell"], td').nth(2);
    await cell.click({ position: { x: 4, y: 4 } });
    await page.keyboard.press("Escape");
    await assertEscFromGridKeepsPin(page, "o dang chon");
  });

  test("break: a record that listens to Esc on the whole page is caught", async ({
    page,
    browserName,
  }, info) => {
    test.skip(browserName !== "chromium" || info.project.name !== "1440", "do o 1440");
    await page.addInitScript(() => {
      document.addEventListener("keydown", (event) => {
        if (event.key !== "Escape") return;
        document
          .querySelector<HTMLButtonElement>('[data-slot="record-panel-actions"] button:last-child')
          ?.click();
      });
    });
    await openScreen(page, "/inventory");
    await openRow(page, 1);
    await pin(page);
    const cell = region(page).locator("tbody tr").nth(1).locator('[role="gridcell"], td').nth(2);
    await cell.click({ position: { x: 4, y: 4 } });
    await page.keyboard.press("Escape");
    await expect(panel(page)).toHaveCount(0);
    await expect(
      (async () => {
        if ((await panel(page).count()) === 0)
          throw new Error("pinned record closed from grid: o dang chon");
      })(),
    ).rejects.toThrow("pinned record closed from grid: o dang chon");
  });
});
