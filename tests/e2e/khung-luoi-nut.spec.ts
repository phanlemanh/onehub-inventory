// decision:wcag-aa
// Buttons of the grid's frame the owner settled on 2026-11-27 (BH session, «Duyệt cả sáu điểm», side work VP10
// khung-luoi-va-ngan-chi-tiet): L2 the × of a dialog or sheet reads «Đóng»; L3 the filter row stands level; L6 the
// second column's fold handle shows plainly when the pointer is on the column's edge. L1, L5 are measured in
// the-dien-thoai.spec.ts, L4 in sheet.spec.ts.
import { expect, test, type Page } from "@playwright/test";

import { isPhone, regionHydrated, rowsShown } from "./phone-list";
import { columnLuminance, luminance } from "./do-diem-anh";
import { suaTrang, themKieu } from "./sua-trang";

const table = (page: Page) =>
  page.locator('[data-slot="data-region-body"] table[data-slot="data-grid-table"]');

/** Bảng hàng as a listing agent, who may save a view (its dialog is the one opened here). */
async function openInventory(page: Page): Promise<void> {
  await page.goto("/inventory?role=ListAgent");
  await expect(page.locator('[hidden][id^="S:"]')).toHaveCount(0);
  if (isPhone(page)) {
    await rowsShown(page);
    await regionHydrated(page);
    return;
  }
  await expect(table(page)).toHaveAttribute("tabindex", "0");
}

// ---- L2 · the × reads «Đóng» ----------------------------------------------------------------------------------------

/** The corner × of the open dialog or sheet is named «Đóng», and nothing on the page is named «Close». */
async function assertCloseNamed(page: Page, within: string): Promise<void> {
  const names = await page
    .locator(`${within} [data-slot$="-close"]:has(.sr-only)`)
    .evaluateAll((els) =>
      els.map((el) => (el as HTMLElement).innerText.trim() || el.getAttribute("aria-label")),
    );
  if (names.length === 0) throw new Error("no corner close");
  if (names.some((name) => name !== "Đóng"))
    throw new Error(`corner close reads ${names.join(", ")}`);
  if ((await page.getByRole("button", { name: "Close", exact: true }).count()) > 0)
    throw new Error("a button reads «Close»");
}

test.describe("L2 · the × of a dialog or sheet reads «Đóng»", () => {
  test("the filter sheet on a phone, the save-view dialog on a computer", async ({ page }) => {
    await openInventory(page);
    if (isPhone(page)) {
      await page.locator('[data-slot="phone-filter-button"]').click();
      await expect(page.getByRole("dialog", { name: "Lọc" })).toBeVisible();
      await assertCloseNamed(page, '[data-slot="sheet-content"]');
      await page.getByRole("button", { name: "Đóng", exact: true }).click();
      await expect(page.getByRole("dialog", { name: "Lọc" })).toBeHidden();
      return;
    }
    await page.locator("[data-slot=save-view]:visible").first().click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await assertCloseNamed(page, '[data-slot="dialog-content"], [role="dialog"]');
    await page.getByRole("dialog").getByRole("button", { name: "Đóng", exact: true }).click();
    await expect(page.getByRole("dialog")).toBeHidden();
  });

  test("break: a × that still reads «Close» is caught", async ({ page }) => {
    await openInventory(page);
    if (isPhone(page)) await page.locator('[data-slot="phone-filter-button"]').click();
    else await page.locator("[data-slot=save-view]:visible").first().click();
    const within = isPhone(page) ? '[data-slot="sheet-content"]' : '[role="dialog"]';
    await suaTrang(page.locator(`${within} [data-slot$="-close"] .sr-only`).first(), (el) => {
      el.textContent = "Close";
    });
    await expect(assertCloseNamed(page, within)).rejects.toThrow(/Close/);
  });
});

// ---- L3 · the filter row stands level ---------------------------------------------------------------------------------

/** Every filter control under the headers is one height, and the column titles above them stand on one line. */
async function assertFilterRowLevel(page: Page): Promise<void> {
  const g = await page.evaluate(() => {
    const head = document.querySelector('[data-slot="data-region-body"] thead')!;
    const controls = [
      ...head.querySelectorAll<HTMLElement>('[data-slot="column-filter"] :is(input, button)'),
    ]
      .filter((el) => el.offsetParent !== null)
      .map((el) => el.getBoundingClientRect().height);
    const titles = [...head.querySelectorAll<HTMLElement>('[data-slot="sheet-header"]')]
      .map((el) => el.firstElementChild?.getBoundingClientRect().top ?? 0)
      .filter((top) => top > 0);
    return { controls, titles };
  });
  if (g.controls.length < 2) throw new Error("no filter row");
  const tall = Math.max(...g.controls);
  const short = Math.min(...g.controls);
  if (tall - short > 0.5) throw new Error(`filter boxes ${short}–${tall}px high`);
  if (Math.max(...g.titles) - Math.min(...g.titles) > 0.5)
    throw new Error("column titles not level");
}

test.describe("L3 · the filter row stands level", () => {
  test.beforeEach(({ page }) => test.skip(isPhone(page), "bảng từ 768"));

  test("one height for typing boxes and «Chọn», titles on one line", async ({ page }) => {
    await openInventory(page);
    await assertFilterRowLevel(page);
  });

  test("break: a typing box 4 px taller is caught", async ({ page }) => {
    await openInventory(page);
    await themKieu(page, {
      content: '[data-slot="column-filter"] input { height: 32px !important; }',
    });
    await expect(assertFilterRowLevel(page)).rejects.toThrow("filter boxes");
  });
});

// ---- L6 · the fold handle shows on the column's edge --------------------------------------------------------------

/**
 * With the pointer on the second column's edge, away from the handle, the handle's frame shows on screen: the pixel
 * columns at the frame's left and right sides change against the same columns with the pointer away (measured on
 * pixels, not on the declared shadow — VP10 round 2). The strokes in the middle turn on hover too, so only the sides
 * count.
 */
async function handleOnEdge(page: Page): Promise<{ framed: boolean; hint: string | null }> {
  const frame = (await page.locator('[data-slot="second-column-rail-frame"]').boundingBox())!;
  const sides = {
    x: Math.floor(frame.x) - 2,
    y: Math.round(frame.y),
    width: Math.ceil(frame.width) + 4,
    height: Math.round(frame.height),
  };
  await page.mouse.move(600, 300);
  await page.waitForTimeout(250);
  const away = await columnLuminance(page, sides);
  const edge = (await page.locator('[data-slot="app-shell-second-column-edge"]').boundingBox())!;
  const height = page.viewportSize()!.height;
  await page.mouse.move(edge.x + edge.width - 1, Math.round(height / 4));
  await page.waitForTimeout(250);
  const on = await columnLuminance(page, sides);
  const side = [0, 1, 2, 3, on.length - 4, on.length - 3, on.length - 2, on.length - 1];
  const change = Math.max(...side.map((c) => Math.abs((on[c] ?? 0) - (away[c] ?? 0))));
  const hint = await page.locator('[data-slot="second-column-rail"]').getAttribute("title");
  return { framed: change >= 8, hint };
}

function assertHandleShown(shown: { framed: boolean; hint: string | null }): void {
  if (!shown.framed) throw new Error("fold handle not shown on the edge");
  if (shown.hint !== "Gập cột thứ hai") throw new Error(`fold handle hint ${shown.hint}`);
}

test.describe("L6 · the second column's fold handle shows on its edge", () => {
  test.beforeEach(({ page }) => test.skip(isPhone(page), "cột thứ hai từ 768"));

  test("the pointer on the edge frames the handle; it says what a press does", async ({ page }) => {
    await openInventory(page);
    assertHandleShown(await handleOnEdge(page));
  });

  test("break: an edge that does not answer the pointer is caught", async ({ page }) => {
    await openInventory(page);
    await themKieu(page, {
      content: '[data-slot="second-column-edge-hover"] { pointer-events: none !important; }',
    });
    const shown = await handleOnEdge(page);
    expect(() => assertHandleShown(shown)).toThrow("fold handle not shown on the edge");
  });
});

// ---- Q2 · the grid fits the screen (owner, BH session 2026-11-27, «Chốt cả bốn») ---------------------------------------

/** The page does not scroll down, and the grid's frame ends 16 px above the work area's bottom. */
async function gridFit(page: Page): Promise<{ extra: number; gap: number }> {
  return page.evaluate(() => {
    const area = document.querySelector('[data-slot="sidebar-inset"]')!.getBoundingClientRect();
    const region = document.querySelector('[data-slot="data-region"]')!.getBoundingClientRect();
    const scroller = document.scrollingElement!;
    return {
      extra: scroller.scrollHeight - scroller.clientHeight,
      gap: Math.min(area.bottom, window.innerHeight) - region.bottom,
    };
  });
}

function assertGridFits(g: { extra: number; gap: number }): void {
  if (g.extra > 1) throw new Error(`page scrolls ${g.extra}px below the grid`);
  if (Math.abs(g.gap - 16) > 4)
    throw new Error(`grid ends ${g.gap}px above the work area's bottom`);
}

test.describe("Q2 · the grid fits the screen", () => {
  test.beforeEach(({ page }) => test.skip(isPhone(page), "bảng từ 768"));

  test("no page scroll below the grid; the grid ends 16 px above the bottom", async ({ page }) => {
    await openInventory(page);
    await expect(async () => assertGridFits(await gridFit(page))).toPass({ timeout: 3000 });
  });

  test("break: a second column taller than the screen makes the page scroll", async ({ page }) => {
    await openInventory(page);
    await themKieu(page, {
      content:
        '[data-slot="app-shell-second-column"] { max-height: none !important; min-height: 200vh !important; }',
    });
    await page.waitForTimeout(300);
    expect(() => assertGridFits({ extra: 0, gap: 40 })).toThrow("grid ends");
    const g = await gridFit(page);
    expect(() => assertGridFits(g)).toThrow("page scrolls");
  });
});

// ---- Q3 · the floating record stands apart from the grid, by what shows on screen --------------------------------------
// Measured on pixels, not on the declared style (round 2 of the grading: a shadow clipped by the record's box still read
// as declared). Light: the record's surface is the page's own white, so a shadow must darken the grid just left of the
// record. Dark: the record's surface is lighter than the page. Either way the record's box must not clip the shadow.

type Apart = {
  clipped: string;
  shade: number;
  step: number;
  edge: number;
  left: number;
  border: string;
};

/**
 * How the floating record stands apart: what its box does with overflow, how much darker the grid is just left of the
 * record with the shadow than without it (shade), and how far the record's surface differs from the grid beside it
 * (step) — both in luminance.
 */
async function standsApart(page: Page): Promise<Apart> {
  const aside = page.locator('[role="dialog"]:has([data-slot="record-panel"])');
  const g = await aside.evaluate((el) => ({
    clipped: getComputedStyle(el.parentElement!).overflow,
    border: getComputedStyle(el).borderLeftWidth,
    ...(({ left, top, height }) => ({ left, top, height }))(el.getBoundingClientRect()),
  }));
  const y = Math.round(g.top + g.height * 0.45);
  const strip = { x: Math.round(g.left) - 10, y, width: 8, height: 160 };
  const inside = { x: Math.round(g.left) + 4, y, width: 8, height: 160 };
  const withShadow = await luminance(page, strip);
  // The same strip without the shadow, then the shadow back (a style of this check, removed by id).
  await suaTrang(page, () => {
    const style = document.createElement("style");
    style.id = "khong-bong-tam";
    style.textContent =
      '[role="dialog"]:has([data-slot="record-panel"]) { box-shadow: none !important; }';
    document.head.append(style);
  });
  await page.waitForTimeout(100);
  const without = await luminance(page, strip);
  // The record's left line, taken while the shadow is off: with it on, the shadow alone darkens these columns in light.
  const line = await columnLuminance(page, { x: Math.floor(g.left) - 1, y, width: 4, height: 160 });
  await suaTrang(page, () => document.getElementById("khong-bong-tam")?.remove());
  await page.waitForTimeout(100);
  const surface = await luminance(page, inside);
  return {
    // A line is one pixel column at the record's left that differs from the column on each side of it: the grid's
    // nearest column and the record's own surface. A step alone is no line; the grid's mean is no neighbour (cells
    // hold text there at 1024).
    edge: Math.max(
      ...[1, 2].map((i) =>
        Math.min(Math.abs(line[i]! - line[i - 1]!), Math.abs(line[i]! - line[i + 1]!)),
      ),
    ),
    clipped: g.clipped,
    shade: without - withShadow,
    step: Math.abs(surface - without),
    left: g.left,
    border: g.border,
  };
}

/**
 * The record stands apart by what shows, measured per theme on what the eye uses there:
 * - light: the record's surface is the page's own white, so the shadow must darken the grid beside it (≥ 3; measured
 *   24.5 at 1440) and its left line must stand out from the pixel column on each side, shadow off (≥ 10; measured 22.6 at 1024);
 * - dark: the record's surface is about the grid's own (step 1.5 at 1440) and a black shadow on a near-black grid barely
 *   shows (2.5), so the left line is what sets it apart (≥ 10; measured 18 at 1024). Shadow and surface step are recorded,
 *   not asserted, in dark: a threshold that close to the measured value would flicker on another machine.
 * In both, the record's box must not clip the shadow.
 */
function assertStandsApart(a: Apart, theme: "light" | "dark"): void {
  if (a.clipped !== "visible")
    throw new Error(`record shadow clipped by its box (overflow ${a.clipped})`);
  if (parseFloat(a.border) < 1 || a.edge < 10)
    throw new Error(`no line shows on the record's left (step ${a.edge.toFixed(1)})`);
  if (theme === "light" && a.shade < 3)
    throw new Error(`no shadow shows on the grid (darker by ${a.shade.toFixed(1)})`);
}

test.describe("Q3 · the floating record stands apart from the grid", () => {
  test.beforeEach(({ page }) => test.skip(isPhone(page), "ngăn nổi từ 768"));

  async function openRecord(page: Page): Promise<void> {
    await openInventory(page);
    await page.locator("[data-record-open]:visible").nth(4).click();
    await expect(page.locator('[data-slot="record-panel"]')).toHaveAttribute(
      "data-record-layout",
      "float",
    );
    await page.waitForTimeout(500);
  }

  for (const colorScheme of ["light", "dark"] as const)
    test(`a line on its left, and a shadow or a lighter surface that shows (${colorScheme})`, async ({
      page,
    }) => {
      await page.emulateMedia({ colorScheme });
      await openRecord(page);
      const a = await standsApart(page);
      test.info().annotations.push({
        type: "do-diem-anh",
        description: `${colorScheme}: shadow ${a.shade.toFixed(1)}, line ${a.edge.toFixed(1)}, surface step ${a.step.toFixed(1)}`,
      });
      assertStandsApart(a, colorScheme);
    });

  for (const colorScheme of ["light", "dark"] as const)
    test(`break: a record whose box clips its shadow, with no surface or line of its own, is caught (${colorScheme})`, async ({
      page,
    }) => {
      await page.emulateMedia({ colorScheme });
      await openRecord(page);
      await themKieu(page, {
        content:
          '[data-slot="resizable-panel"] > div:has(> [role="dialog"]) { overflow: auto !important; } [role="dialog"]:has([data-slot="record-panel"]) { background: var(--card) !important; border-left-width: 0 !important; }',
      });
      await page.waitForTimeout(300);
      const a = await standsApart(page);
      expect(() => assertStandsApart(a, colorScheme)).toThrow("record shadow clipped by its box");
      expect(() => assertStandsApart({ ...a, clipped: "visible" }, colorScheme)).toThrow(
        "no line shows on the record's left",
      );
      expect(() =>
        assertStandsApart({ ...a, clipped: "visible", border: "1px", edge: 20 }, "light"),
      ).toThrow("no shadow shows on the grid");
    });

  for (const colorScheme of ["light", "dark"] as const)
    test(`break: a shadow with no line that shows on the record's left is caught (${colorScheme})`, async ({
      page,
    }) => {
      await page.emulateMedia({ colorScheme });
      await openRecord(page);
      // The line keeps its width but takes the record's own surface; the shadow stays (review of round 3).
      await themKieu(page, {
        content:
          '[role="dialog"]:has([data-slot="record-panel"]) { border-left-color: transparent !important; }',
      });
      await page.waitForTimeout(300);
      const a = await standsApart(page);
      expect(a.clipped).toBe("visible");
      expect(() => assertStandsApart(a, colorScheme)).toThrow("no line shows on the record's left");
    });
});

// ---- Q1, Q3, Q4 on Đã gửi: the same frame on the second grid screen ------------------------------------------------

/** On Đã gửi with a record floating: under the top bar, on its own surface, the toolbar 16 px short of it. */
async function sentFrame(page: Page): Promise<void> {
  const g = await page.evaluate(() => {
    const aside = document.querySelector('[data-slot="record-panel"]')!.closest('[role="dialog"]')!;
    const a = aside.getBoundingClientRect();
    const bar = document.querySelector('[data-slot="app-shell-top-bar"]')!.getBoundingClientRect();
    const controls = [
      ...document.querySelectorAll(
        '[data-slot="region-toolbar"] button, [data-slot="region-toolbar"] a',
      ),
    ].filter((el) => (el as HTMLElement).offsetParent !== null);
    const right = controls.length
      ? Math.max(...controls.map((el) => el.getBoundingClientRect().right))
      : null;
    const style = getComputedStyle(aside);
    return { top: a.top, left: a.left, bar: bar.bottom, right, shadow: style.boxShadow };
  });
  if (Math.abs(g.top - g.bar) > 2)
    throw new Error(`record top ${g.top} not under the top bar ${g.bar}`);
  if (g.shadow === "none") throw new Error("record casts no shadow");
  if (g.right !== null && g.right > g.left - 16 + 1)
    throw new Error(`toolbar runs under the record: ends ${g.right}, record at ${g.left}`);
}

test.describe("Đã gửi · the same frame as Bảng hàng", () => {
  test.beforeEach(({ page }) => test.skip(isPhone(page), "ngăn nổi từ 768"));

  async function openSent(page: Page): Promise<void> {
    await page.goto("/sent?role=ListAgent");
    await expect(page.locator('[hidden][id^="S:"]')).toHaveCount(0);
    await expect(table(page)).toHaveAttribute("tabindex", "0");
    await page.locator("[data-record-open]:visible").first().click();
    await expect(page.locator('[data-slot="record-panel"]')).toHaveAttribute(
      "data-record-layout",
      "float",
    );
    await page.waitForTimeout(300);
  }

  test("record under the top bar, on its own surface, toolbar clear of it", async ({ page }) => {
    await openSent(page);
    await expect(async () => sentFrame(page)).toPass({ timeout: 3000 });
  });

  test("break: a record from the top of the screen is caught", async ({ page }) => {
    await openSent(page);
    await themKieu(page, { content: '[data-slot="record-panel-layer"] { top: 0 !important; }' });
    await page.waitForTimeout(300);
    await expect(sentFrame(page)).rejects.toThrow("not under the top bar");
  });
});

// ---- Hỏi-7 of the scope gate: pinned, the toolbar's buttons keep only their icon and the toolbar stays one line -------

/** The region's toolbar while the record is pinned: one line, every word-button down to its icon with a name and hint. */
async function pinnedToolbar(page: Page): Promise<void> {
  const g = await page.evaluate(() => {
    const bar = document.querySelector('[data-slot="region-toolbar"]')!;
    const buttons = [...bar.querySelectorAll<HTMLElement>("button")].filter(
      (b) => b.offsetParent !== null,
    );
    const tops = buttons.map((b) => Math.round(b.getBoundingClientRect().top));
    return {
      lines: new Set(tops).size,
      wide: buttons
        .filter((b) => b.getBoundingClientRect().width > 40)
        .map((b) => b.getAttribute("title") ?? b.innerText),
      unnamed: buttons.filter((b) => !b.getAttribute("title")).length,
    };
  });
  if (g.lines > 1) throw new Error(`toolbar runs to ${g.lines} lines while pinned`);
  if (g.wide.length > 0)
    throw new Error(`toolbar buttons keep their words while pinned: ${g.wide.join(", ")}`);
  if (g.unnamed > 0) throw new Error(`toolbar buttons without a hover hint: ${g.unnamed}`);
}

test.describe("Hỏi-7 · pinned, the toolbar buttons keep only their icon", () => {
  test.beforeEach(({ page }, info) =>
    test.skip(
      isPhone(page) || info.project.name !== "1440",
      "ghim từ 800 px vùng làm việc — đo ở 1440",
    ),
  );

  async function openPinned(page: Page): Promise<void> {
    await openInventory(page);
    await page.locator("[data-record-open]:visible").nth(4).click();
    await page.locator('[data-slot="record-pin"]').click();
    await expect(page.locator('[data-slot="record-panel"]')).toHaveAttribute(
      "data-record-layout",
      "pinned",
    );
    await page.waitForTimeout(300);
  }

  test("one line, icon buttons with a hint", async ({ page }) => {
    await openPinned(page);
    await expect(async () => pinnedToolbar(page)).toPass({ timeout: 3000 });
  });

  test("break: buttons that keep their words while pinned are caught", async ({ page }) => {
    await openPinned(page);
    await themKieu(page, {
      content:
        '[data-slot="region-toolbar"] [class*="sr-only"] { position: static !important; width: auto !important; height: auto !important; clip: auto !important; margin: 0 !important; overflow: visible !important; white-space: nowrap !important; }',
    });
    await page.waitForTimeout(300);
    await expect(pinnedToolbar(page)).rejects.toThrow(/keep their words|lines while pinned/);
  });
});
