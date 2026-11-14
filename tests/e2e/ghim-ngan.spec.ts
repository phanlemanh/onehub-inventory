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

/**
 * Opens a screen. Below 1200 px the App Shell's second column is folded first: with it open at 1024 the data region
 * has no room for a pinned column (row 3a, D-1411-5), and the checks that pin measure the pinned shape.
 */
async function openScreen(
  page: Page,
  path: string,
  secondColumn?: "open" | "folded",
): Promise<void> {
  const width = page.viewportSize()?.width ?? 1440;
  const folded = secondColumn ? secondColumn === "folded" : width < 1200;
  await page
    .context()
    .addCookies([{ name: "app_shell_cot2", value: folded ? "0" : "1", url: "http://127.0.0.1" }]);
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

  test("the pin shows only when the data region has room for a 320 px column and a 480 px grid", async ({
    page,
    browserName,
  }, info) => {
    test.skip(browserName !== "chromium" || info.project.name !== "1024", "do o 1024 va 768");
    const room = () =>
      region(page).evaluate(
        (el) =>
          el.getBoundingClientRect().width + (parseFloat(getComputedStyle(el).marginRight) || 0),
      );
    // 1024 with the second column open: the data region is under 800 px — no pin, the record floats.
    await openScreen(page, "/inventory", "open");
    await openRow(page, 0);
    expect(await room()).toBeLessThan(MIN_COLUMN + MIN_GRID);
    await expect(pinButton(page)).toHaveCount(0);
    await expect(panel(page)).toHaveAttribute("data-record-layout", "float");
    // 1024 with the second column folded: room enough — the pin shows, the grid keeps at least 480 px.
    await openScreen(page, "/inventory", "folded");
    await openRow(page, 0);
    expect(await room()).toBeGreaterThanOrEqual(MIN_COLUMN + MIN_GRID);
    await pin(page);
    const col = await columnBox(page);
    expect(col.width).toBeGreaterThanOrEqual(MIN_COLUMN - 1);
    expect((await box(page, '[data-slot="data-region"]')).width).toBeGreaterThanOrEqual(
      MIN_GRID - 1,
    );
    // 768: no room either way.
    await page.setViewportSize({ width: 768, height: 1024 });
    for (const state of ["open", "folded"] as const) {
      await openScreen(page, "/inventory", state);
      await openRow(page, 0);
      await expect(pinButton(page)).toHaveCount(0);
    }
  });
});

// ---- E2 · AC-2: pinning makes room; unpinning floats it back ----------------------------------------------------------

async function assertRoomMade(page: Page, before: number): Promise<void> {
  const col = await columnBox(page);
  const reg = await box(page, '[data-slot="data-region"]');
  const area = await box(page, '[data-slot="sidebar-inset"]');
  if (Math.abs(col.right - area.right) > 1) throw new Error("pinned column not flush right");
  if (reg.right > col.left + 1) throw new Error("region under pinned column");
  if (reg.width < MIN_GRID - 1)
    throw new Error(`grid under ${MIN_GRID} px when pinned: ${Math.round(reg.width)}`);
  const floats = await panel(page).evaluate((el) =>
    // A drop shadow is a shadow with a blur and a colour that shows; rings and empty shadows do not float.
    [
      ...getComputedStyle(el).boxShadow.matchAll(
        /(rgba?\([^)]*\))\s+(-?[\d.]+)px\s+(-?[\d.]+)px\s+([\d.]+)px/g,
      ),
    ].some(([, color, , , blur]) => Number(blur) > 0 && !/,\s*0\)$/.test(color!)),
  );
  if (floats) throw new Error("pinned column still floats");
  const now = await headersShown(page);
  if (now !== before) throw new Error(`columns hidden on pin: ${before} → ${now}`);
}

/** The record's scroll is kept across a change of shape, unless its new height no longer scrolls that far. */
async function assertScrollKept(page: Page, before: number): Promise<number> {
  const [now, max] = await panel(page)
    .locator('[data-slot="record-panel-body"]')
    .evaluate((el) => [el.scrollTop, el.scrollHeight - el.clientHeight]);
  if (Math.abs(now! - Math.min(before, max!)) > 1)
    throw new Error(`record remounted on pin: scroll ${now}`);
  return now!;
}

test.describe("E2 · pinning makes room beside the grid", () => {
  for (const path of ["/inventory", "/sent"]) {
    test(`on ${path}: room, same columns, focus and scroll kept`, async ({
      page,
      browserName,
    }, info) => {
      test.skip(browserName !== "chromium" || !WIDE.has(info.project.name), "do o 1440 va 1024");
      // A short window, so the record's body scrolls and keeping its scroll means something.
      await page.setViewportSize({ width: page.viewportSize()!.width, height: 520 });
      await openScreen(page, path);
      const headers = await headersShown(page);
      const fullWidth = (await box(page, '[data-slot="data-region"]')).width;
      const id = await openRow(page, 1);
      const body = panel(page).locator('[data-slot="record-panel-body"]');
      await body.evaluate((el) => (el.scrollTop = 120));
      const scrolled = await body.evaluate((el) => el.scrollTop);
      expect(scrolled, "the record must scroll for this check to mean anything").toBeGreaterThan(
        10,
      );
      await pinButton(page).click();
      await expect(panel(page)).toHaveAttribute("data-record-layout", "pinned");
      await assertRoomMade(page, headers);
      await expect(unpinButton(page)).toHaveAttribute("aria-pressed", "true");
      await expect(unpinButton(page)).toBeFocused();
      await assertScrollKept(page, scrolled);
      await unpinButton(page).click();
      await expect(panel(page)).toHaveAttribute("data-record-layout", "float");
      await expect(panel(page)).toHaveAttribute("data-record-id", id);
      await expect(pinButton(page)).toBeFocused();
      await assertScrollKept(page, scrolled);
      expect(
        Math.abs((await box(page, '[data-slot="data-region"]')).width - fullWidth),
      ).toBeLessThanOrEqual(1);
    });
  }

  test("break: a record redrawn on pin loses its scroll", async ({ page, browserName }, info) => {
    test.skip(browserName !== "chromium" || info.project.name !== "1440", "do o 1440");
    await page.setViewportSize({ width: 1440, height: 520 });
    await openScreen(page, "/inventory");
    await openRow(page, 1);
    const body = panel(page).locator('[data-slot="record-panel-body"]');
    await body.evaluate((el) => (el.scrollTop = 120));
    const scrolled = await body.evaluate((el) => el.scrollTop);
    await pin(page);
    // What a remount does to the record's scroll.
    await body.evaluate((el) => (el.scrollTop = 0));
    await expect(assertScrollKept(page, scrolled)).rejects.toThrow(
      "record remounted on pin: scroll 0",
    );
  });

  test("break: a pinned record that keeps its drop shadow is caught", async ({
    page,
    browserName,
  }, info) => {
    test.skip(browserName !== "chromium" || info.project.name !== "1440", "do o 1440");
    await injectStyle(
      page,
      '[data-record-layout="pinned"]{box-shadow:0 10px 15px -3px rgb(0 0 0 / 0.3) !important}',
    );
    await openScreen(page, "/inventory");
    const headers = await headersShown(page);
    await openRow(page, 1);
    await pin(page);
    await expect(assertRoomMade(page, headers)).rejects.toThrow("pinned column still floats");
  });

  test("break: a pinned column that leaves the grid under 480 px is caught", async ({
    page,
    browserName,
  }, info) => {
    test.skip(browserName !== "chromium" || info.project.name !== "1024", "do o 1024");
    await openScreen(page, "/inventory");
    const headers = await headersShown(page);
    await openRow(page, 1);
    await pin(page);
    // What a pin measured on the work area did: the grid gives up more than the column's width.
    await page.addStyleTag({
      content:
        '[data-slot="data-region"]{margin-right:calc(var(--record-pinned) + 260px) !important}',
    });
    await page.waitForTimeout(300);
    await expect(assertRoomMade(page, headers)).rejects.toThrow(/grid under 480 px when pinned/);
  });

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
  const covered = await region(page)
    .getByRole("button", { name: /^(Lọc|Cột|Toàn màn hình)$/ })
    .evaluateAll((buttons) =>
      buttons.some((b) => {
        const r = b.getBoundingClientRect();
        const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
        return !hit || !b.contains(hit);
      }),
    );
  if (covered) throw new Error("toolbar covered by record");
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
    await injectStyle(page, '[data-slot="record-panel-layer"]{top:0 !important}');
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

/** The widest pinned column: three fifths of the work area, and 480 px left for the grid in the data region. */
const widest = (area: number, room: number) =>
  Math.max(MIN_COLUMN, Math.min(area * 0.6, room - MIN_GRID));

function assertWidthBounds(width: number, area: number, room: number = Infinity): void {
  if (width < MIN_COLUMN - 1) throw new Error(`pinned column narrower than ${MIN_COLUMN}`);
  if (width > widest(area, room) + 1) throw new Error("pinned column wider than its bound");
}

/** The data region's width without a pinned column. */
const roomOf = (page: Page) =>
  region(page).evaluate(
    (el) => el.getBoundingClientRect().width + (parseFloat(getComputedStyle(el).marginRight) || 0),
  );

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
    // Wider by the drag, up to the column's bound.
    const bound = widest(area, await roomOf(page));
    expect(
      Math.abs((await columnBox(page)).width - Math.min(start + 200, bound)),
    ).toBeLessThanOrEqual(2);
    assertWidthBounds((await columnBox(page)).width, area, await roomOf(page));
    await drag(page, 2000);
    expect(Math.abs((await columnBox(page)).width - MIN_COLUMN)).toBeLessThanOrEqual(1);
    assertWidthBounds((await columnBox(page)).width, area, await roomOf(page));
    await drag(page, -2000);
    const room = await roomOf(page);
    expect(Math.abs((await columnBox(page)).width - widest(area, room))).toBeLessThanOrEqual(1);
    assertWidthBounds((await columnBox(page)).width, area, room);
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
      '[data-slot="record-panel-layer"] [data-slot="resizable-panel"]:has([data-record-layout="pinned"]){flex:0 0 200px !important;min-width:0 !important}',
    );
    await openScreen(page, "/inventory");
    await openRow(page, 0);
    await pin(page);
    const area = (await box(page, '[data-slot="sidebar-inset"]')).width;
    const measured = (await columnBox(page)).width;
    expect(() => assertWidthBounds(measured, area)).toThrow("pinned column narrower than 320");
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
  const layout =
    (await panel(page).count()) === 0 ? null : await panel(page).getAttribute("data-record-layout");
  if (layout !== "pinned") throw new Error(`pinned record closed from grid: ${where}`);
}

const PRICE = "Listing.listPrice";
const priceCell = (page: Page, row: number) =>
  region(page).locator("tbody tr[data-row-id]").nth(row).locator(`td[data-col-id="${PRICE}"]`);

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

  test("break: a pin button without a name is caught by the scan", async ({
    page,
    browserName,
  }, info) => {
    test.skip(browserName !== "chromium" || info.project.name !== "1440", "do o 1440");
    await openScreen(page, "/inventory");
    await openRow(page, 0);
    await pin(page);
    await unpinButton(page).evaluate((b) => {
      b.removeAttribute("aria-label");
      b.removeAttribute("title");
    });
    expect(await seriousViolations(page)).toContain("button-name");
  });

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

  test("Esc in a cell being edited cancels the edit and keeps the pin", async ({
    page,
    browserName,
  }, info) => {
    test.skip(browserName !== "chromium" || info.project.name !== "1440", "do o 1440");
    // A role that may edit price (row 4).
    await openScreen(page, "/inventory?vai=ListAgent");
    await openRow(page, 0);
    await pin(page);
    const cell = priceCell(page, 1);
    const before = (await cell.innerText()).trim();
    await cell.click({ position: { x: 3, y: 3 } });
    await page.keyboard.press("F2");
    const editor = page.locator('[data-slot="cell-editor"]');
    await expect(editor).toBeVisible();
    await page.keyboard.type("9");
    await page.keyboard.press("Escape");
    await expect(editor).toHaveCount(0);
    expect((await cell.innerText()).trim()).toBe(before);
    await assertEscFromGridKeepsPin(page, "o dang sua");
  });

  test("break: a record that listens to Esc on the whole page is caught", async ({
    page,
    browserName,
  }, info) => {
    test.skip(browserName !== "chromium" || info.project.name !== "1440", "do o 1440");
    await page.addInitScript(() => {
      document.addEventListener(
        "keydown",
        (event) => {
          if (event.key !== "Escape") return;
          document
            .querySelector<HTMLButtonElement>(
              '[data-slot="record-panel-actions"] button:last-child',
            )
            ?.click();
        },
        true,
      );
    });
    await openScreen(page, "/inventory");
    await openRow(page, 1);
    await pin(page);
    const cell = region(page).locator("tbody tr").nth(1).locator('[role="gridcell"], td').nth(2);
    await cell.click({ position: { x: 4, y: 4 } });
    await page.keyboard.press("Escape");
    await expect(assertEscFromGridKeepsPin(page, "o dang chon")).rejects.toThrow(
      "pinned record closed from grid: o dang chon",
    );
  });
});
