// decision:record-panel
// decision:wcag-aa
// decision:no-sideways-scroll
// One listing's record beside the inventory grid (roadmap row 3, _acceptance/ho-so-can): the floating panel under the
// App Shell's top bar (E2), the columns left beside it (E3), the address (E4), the full-screen record on a phone (E7)
// and an accessibility scan with the record open (E9). Every check has a break case with a pinned message.
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const URL = "/inventory";
const WIDE = new Set(["1440", "1024"]);
const PHONE = new Set(["414", "360"]);
/**
 * Data columns fully in view left of the open record, at least (AC-3). 4 and 2 since the coordinator's ruling
 * D-1211-12: the first 5/3 was pinned before the owner chose a floating panel two fifths wide.
 */
const MIN_VISIBLE: Readonly<Record<string, number>> = { "1440": 4, "1024": 2 };
const FROZEN = ["#", "Căn", "Toà"];
const DATA_HEADERS = [
  "Căn",
  "Toà",
  "Dự án",
  "Trạng thái",
  "Giá chào",
  "Diện tích",
  "Phòng ngủ",
  "Xác nhận lúc",
];

const panel = (page: Page) => page.locator('[data-slot="record-panel"]');
const openers = (page: Page) => page.locator("[data-record-open]");

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
  await page.goto(`${URL}${query}`);
  await page.locator('[data-slot="data-region"] tbody tr').first().waitFor();
  await expect(page.locator('[hidden][id^="S:"]')).toHaveCount(0);
  // Hydrated: the grid's sideways scroll area takes keyboard focus.
  await expect(
    page.locator('[data-slot="data-region-body"] [data-slot="scroll-area-viewport"]').first(),
  ).toHaveAttribute("tabindex", "0");
}

/** Opens the fifth listing by its unit code and returns that row's id and unit. */
async function openFifth(page: Page): Promise<{ id: string; unit: string }> {
  const opener = openers(page).nth(4);
  const id = (await opener.getAttribute("data-record-open")) ?? "";
  const unit = ((await opener.textContent()) ?? "").trim();
  await opener.click();
  await expect(panel(page)).toHaveAttribute("data-record-id", id);
  return { id, unit };
}

// ---- checks shared by a case and its break -------------------------------------------------------------------------

type Box = { top: number; bottom: number; left: number; right: number; width: number };

/** Where the floating record stands against the top bar, the work area and the window. */
async function floatGeometry(page: Page): Promise<{
  aside: Box;
  barBottom: number | null;
  areaBottom: number;
  viewport: number;
  viewportHeight: number;
  searchHit: boolean;
  accountHit: boolean;
  overflow: number;
}> {
  return page.evaluate(() => {
    const rect = (el: Element) => {
      const r = el.getBoundingClientRect();
      return { top: r.top, bottom: r.bottom, left: r.left, right: r.right, width: r.width };
    };
    const record = document.querySelector('[data-slot="record-panel"]');
    const aside = record?.closest('[role="dialog"]');
    if (!record || !aside) throw new Error("no floating record");
    const bar = document.querySelector<HTMLElement>('[data-slot="app-shell-top-bar"]');
    const shown = bar && bar.offsetParent !== null ? bar : null;
    const area = document.querySelector('[data-slot="sidebar-inset"]')!;
    const hits = (el: Element | null) => {
      if (!el) return false;
      const r = el.getBoundingClientRect();
      const top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      return top !== null && (top === el || el.contains(top));
    };
    const body = record.querySelector('[data-slot="record-panel-body"]')!;
    return {
      aside: rect(aside),
      barBottom: shown ? shown.getBoundingClientRect().bottom : null,
      areaBottom: area.getBoundingClientRect().bottom,
      viewport: window.innerWidth,
      viewportHeight: window.innerHeight,
      searchHit: hits(document.querySelector('[data-slot="data-region"] input[type="search"]')),
      accountHit: hits(
        document.querySelector('[data-slot="app-shell-top-bar"] [data-slot^="account"]'),
      ),
      overflow: Math.max(
        aside.scrollWidth - aside.clientWidth,
        body.scrollWidth - body.clientWidth,
      ),
    };
  });
}

function assertFloat(g: Awaited<ReturnType<typeof floatGeometry>>): void {
  if (g.barBottom !== null && g.aside.top < g.barBottom - 2)
    throw new Error("record covers the top bar");
  if (g.barBottom !== null && Math.abs(g.aside.top - g.barBottom) > 2) {
    throw new Error(`record top ${g.aside.top} not under the top bar ${g.barBottom}`);
  }
  // The work area may run below the window (the page scrolls): the record stops at whichever comes first.
  const bottom = Math.min(g.areaBottom, g.viewportHeight);
  if (Math.abs(g.aside.bottom - bottom) > 2) {
    throw new Error(`record bottom ${g.aside.bottom} not at the work area's bottom ${bottom}`);
  }
  const share = g.aside.width / g.viewport;
  const clamped = Math.min(512, Math.max(320, g.viewport * 0.4));
  if (!(share >= 0.35 && share <= 0.45) && Math.abs(g.aside.width - clamped) > 2) {
    throw new Error(`record width ${g.aside.width} of ${g.viewport}`);
  }
  if (!g.searchHit) throw new Error("record covers the search box");
  if (!g.accountHit) throw new Error("record covers the account corner");
  if (g.overflow > 0) throw new Error(`record scrolls sideways by ${g.overflow}px`);
}

/** «Trước», «Sau», «Đóng» on one line, top right of the record, beside its name. */
async function assertActionsTopRight(page: Page): Promise<void> {
  const g = await page.evaluate(() => {
    const record = document.querySelector('[data-slot="record-panel"]')!;
    const header = record.querySelector('[data-slot="record-panel-header"]')!;
    const title = header.querySelector("h2")!.getBoundingClientRect();
    const buttons = [...header.querySelectorAll("button")].map((b) => b.getBoundingClientRect());
    return {
      titleTop: title.top,
      tops: buttons.map((b) => b.top),
      closeRight: buttons.at(-1)!.right,
      recordRight: record.getBoundingClientRect().right,
    };
  });
  const offTop = g.tops.some((top) => Math.abs(top - g.titleTop) > 4);
  const offRight = g.recordRight - g.closeRight > 24;
  if (g.tops.length !== 3 || offTop || offRight)
    throw new Error("record actions left the top right");
}

/** Tab from «Đóng» leaves the record and reaches the grid's region within ten steps. */
async function assertGridReachable(page: Page): Promise<void> {
  await panel(page).getByRole("button", { name: "Đóng" }).focus();
  for (let step = 0; step < 10; step += 1) {
    await page.keyboard.press("Tab");
    const where = await page.evaluate(() => {
      const active = document.activeElement;
      return {
        inRecord: !!active?.closest('[data-slot="record-panel"]'),
        inRegion: !!active?.closest('[data-slot="data-region"]'),
      };
    });
    if (!where.inRecord && where.inRegion) return;
  }
  throw new Error("grid not reachable by Tab");
}

/** Data columns fully inside the grid's viewport and left of the record's edge. */
async function columnsInView(page: Page): Promise<{ texts: string[]; full: number }> {
  return page.evaluate(() => {
    const viewport = document
      .querySelector('[data-slot="data-region-body"] [data-slot="scroll-area-viewport"]')!
      .getBoundingClientRect();
    const aside = document.querySelector('[data-slot="record-panel"]')?.closest('[role="dialog"]');
    const edge = aside ? aside.getBoundingClientRect().left : viewport.right;
    const right = Math.min(viewport.right, edge);
    const headers = [...document.querySelectorAll('[data-slot="data-region"] thead th')];
    const inView = headers.filter((th) => {
      const r = th.getBoundingClientRect();
      return r.width > 0 && r.left >= viewport.left - 1 && r.right <= right + 1;
    });
    return {
      texts: inView.map((th) => (th.textContent ?? "").trim()),
      full: inView.length - (inView.length > 0 && headers.indexOf(inView[0]!) === 0 ? 1 : 0),
    };
  });
}

const scrollGridTo = (page: Page, left: number | "end") =>
  page
    .locator('[data-slot="data-region-body"] [data-slot="scroll-area-viewport"]')
    .first()
    .evaluate((el, to) => {
      el.scrollLeft = to === "end" ? el.scrollWidth : to;
    }, left);

async function assertFrozenAtEnd(page: Page): Promise<void> {
  await scrollGridTo(page, "end");
  await page.waitForTimeout(200);
  const { texts } = await columnsInView(page);
  for (const name of FROZEN) {
    if (!texts.some((t) => t === name || t.startsWith(name))) {
      throw new Error(`frozen column scrolled away: ${name}`);
    }
  }
}

/** With the record open, Căn and Toà are fully in view left of it: the promise of AC-3 (ruling D-1211-12). */
async function assertUnitAndBuildingInView(page: Page): Promise<void> {
  const { texts } = await columnsInView(page);
  for (const name of ["Căn", "Toà"]) {
    if (!texts.some((t) => t === name || t.startsWith(name))) {
      throw new Error(`record hides a frozen column: ${name}`);
    }
  }
}

/** Every data column, scrolled to, has a width and sits fully inside the grid's viewport. */
async function assertNoColumnHidden(page: Page): Promise<void> {
  for (const name of DATA_HEADERS) {
    const shown = await page.evaluate((header) => {
      const th = [...document.querySelectorAll('[data-slot="data-region"] thead th')].find((el) =>
        (el.textContent ?? "").trim().startsWith(header),
      );
      if (!th) return false;
      th.scrollIntoView({ inline: "nearest", block: "nearest" });
      const viewport = document
        .querySelector('[data-slot="data-region-body"] [data-slot="scroll-area-viewport"]')!
        .getBoundingClientRect();
      const r = th.getBoundingClientRect();
      return r.width > 0 && r.left >= viewport.left - 1 && r.right <= viewport.right + 1;
    }, name);
    if (!shown) throw new Error(`column hidden: ${name}`);
  }
}

async function assertOpened(page: Page, unit: string): Promise<void> {
  const title = ((await panel(page).locator("h2").textContent()) ?? "").trim();
  if (!title.startsWith(unit)) throw new Error(`address opened the wrong record: ${title}`);
}

async function assertPhoneFullScreen(page: Page): Promise<void> {
  const g = await panel(page).evaluate((el) => {
    const r = el.getBoundingClientRect();
    return { w: r.width, h: r.height, vw: window.innerWidth, vh: window.innerHeight };
  });
  if (Math.abs(g.w - g.vw) > 1 || Math.abs(g.h - g.vh) > 1) {
    throw new Error("phone record is not full screen");
  }
}

async function seriousViolations(page: Page): Promise<string[]> {
  const { violations } = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    // A record is a dialog: it must carry a name. axe files that rule under best practice, outside the WCAG tags.
    .options({ rules: { "aria-dialog-name": { enabled: true } } })
    .exclude("nextjs-portal")
    .analyze();
  return violations
    .filter((v) => v.impact === "serious" || v.impact === "critical")
    .map((v) => v.id);
}

// ---- E2 · AC-2: the floating record under the top bar ----------------------------------------------------------------

test.describe("E2 · the record floats beside the grid", () => {
  test.beforeEach(({ browserName }, info) =>
    test.skip(browserName !== "chromium" || !WIDE.has(info.project.name), "do o 1440 va 1024"),
  );

  test("stands under the top bar, leaves search and account usable, keeps the grid live", async ({
    page,
  }) => {
    await openInventory(page);
    await openFifth(page);
    await expect(panel(page)).toHaveAttribute("data-record-layout", "float");
    // The panel measures the top bar once it has mounted; wait for that, then the check must hold.
    await expect.poll(async () => (await floatGeometry(page)).aside.top).toBeGreaterThan(0);
    assertFloat(await floatGeometry(page));
    // Search while the record is open: the rows change.
    const before = await openers(page).count();
    await page.locator('[data-slot="data-region"] input[type="search"]').fill("S1.01");
    await expect.poll(() => openers(page).count()).not.toBe(before);
    await page.locator('[data-slot="data-region"] input[type="search"]').fill("");
    // Another unit code opens that unit without closing.
    const first = openers(page).first();
    const id = await first.getAttribute("data-record-open");
    await first.click();
    await expect(panel(page)).toHaveAttribute("data-record-id", id!);
    await assertGridReachable(page);
  });

  test("runs the whole height when the top bar is hidden", async ({ page }, info) => {
    await openInventory(page);
    await openFifth(page);
    await page.addStyleTag({
      content: '[data-slot="app-shell-top-bar"] { display: none !important; }',
    });
    const size = page.viewportSize()!;
    await page.setViewportSize({ width: size.width, height: size.height - 1 });
    await expect
      .poll(async () => (await floatGeometry(page)).aside.top, { message: info.project.name })
      .toBeLessThanOrEqual(2);
  });

  test("break: a record from the top of the screen covers the top bar", async ({ page }) => {
    await injectStyle(page, '[role="dialog"][aria-modal="false"] { top: 0 !important; }');
    await openInventory(page);
    await openFifth(page);
    await page.waitForTimeout(300);
    const g = await floatGeometry(page);
    expect(() => assertFloat(g)).toThrow("record covers the top bar");
  });

  test("break: content wider than the record makes it scroll sideways", async ({ page }) => {
    await injectStyle(page, '[data-slot="listing-record"] { min-width: 900px !important; }');
    await openInventory(page);
    await openFifth(page);
    await page.waitForTimeout(300);
    const g = await floatGeometry(page);
    expect(() => assertFloat(g)).toThrow("record scrolls sideways");
  });

  test("break: a focus trap keeps Tab inside the record", async ({ page }) => {
    await openInventory(page);
    await openFifth(page);
    await page.evaluate(() => {
      document.addEventListener(
        "keydown",
        (event) => {
          if (event.key !== "Tab") return;
          event.preventDefault();
          document.querySelector<HTMLElement>('[data-slot="record-panel"] h2')?.focus();
        },
        true,
      );
    });
    await expect(assertGridReachable(page)).rejects.toThrow("grid not reachable by Tab");
  });
});

test.describe("E2 · «Trước», «Sau», «Đóng» sit top right on every size", () => {
  for (const colorScheme of ["light", "dark"] as const) {
    test(`on one line beside the name (${colorScheme})`, async ({ page }) => {
      await page.emulateMedia({ colorScheme });
      await openInventory(page);
      await openFifth(page);
      await assertActionsTopRight(page);
    });
  }

  test("break: a header that wraps moves the actions off the top right", async ({ page }) => {
    await injectStyle(
      page,
      '[data-slot="record-panel-header"] { flex-wrap: wrap !important; } [data-slot="record-panel-header"] > :first-child { flex-basis: 100% !important; }',
    );
    await openInventory(page);
    await openFifth(page);
    await expect(assertActionsTopRight(page)).rejects.toThrow("record actions left the top right");
  });
});

// ---- E3 · AC-3: the columns left of the record ----------------------------------------------------------------------

test.describe("E3 · the grid beside the record keeps its columns", () => {
  test.beforeEach(({ browserName }, info) =>
    test.skip(browserName !== "chromium" || !WIDE.has(info.project.name), "do o 1440 va 1024"),
  );

  test("keeps enough columns in view, the frozen ones at any scroll, none hidden", async ({
    page,
  }, info) => {
    await openInventory(page);
    const closed = (await columnsInView(page)).full;
    await openFifth(page);
    const open = (await columnsInView(page)).full;
    console.log(`visible columns ${info.project.name} closed=${closed} open=${open}`);
    expect(open).toBeGreaterThanOrEqual(MIN_VISIBLE[info.project.name]!);
    await assertUnitAndBuildingInView(page);
    await expect(panel(page).locator('[data-slot="listing-card-price"]')).toBeVisible();
    await assertFrozenAtEnd(page);
    await assertNoColumnHidden(page);
  });

  test("break: Toà no longer frozen scrolls away", async ({ page }, info) => {
    // At 1440 the eight columns fit, the grid does not scroll sideways, so there is nothing to scroll away from.
    test.skip(info.project.name !== "1024", "luoi chi cuon ngang o 1024");
    await injectStyle(
      page,
      '[data-slot="data-region"] th:nth-child(3), [data-slot="data-region"] td:nth-child(3) { position: static !important; }',
    );
    await openInventory(page);
    await openFifth(page);
    await expect(assertFrozenAtEnd(page)).rejects.toThrow("frozen column scrolled away: Toà");
  });

  test("break: a record wide enough to cover Toà is caught", async ({ page }) => {
    await injectStyle(
      page,
      '[role="dialog"][aria-modal="false"] { width: 85vw !important; max-width: none !important; }',
    );
    await openInventory(page);
    await openFifth(page);
    await expect(assertUnitAndBuildingInView(page)).rejects.toThrow("record hides a frozen column");
  });

  test("break: a hidden Diện tích column is caught", async ({ page }) => {
    await injectStyle(
      page,
      '[data-slot="data-region"] th:nth-child(7), [data-slot="data-region"] td:nth-child(7) { display: none !important; }',
    );
    await openInventory(page);
    await openFifth(page);
    await expect(assertNoColumnHidden(page)).rejects.toThrow("column hidden: Diện tích");
  });
});

// ---- E4 · AC-4: the record has an address ---------------------------------------------------------------------------

test.describe("E4 · the record lives in the address", () => {
  test.beforeEach(({ browserName }, info) =>
    test.skip(browserName !== "chromium" || !WIDE.has(info.project.name), "do o 1440 va 1024"),
  );

  test("writes, opens from and closes with the address; an unknown id opens nothing", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await openInventory(page);
    const { id, unit } = await openFifth(page);
    await expect(page).toHaveURL(new RegExp(`[?&]ho-so=${id}`));
    await page.goBack();
    await expect(panel(page)).toHaveCount(0);
    await expect(page).toHaveURL(/\/inventory(\?|$)/);
    await openInventory(page, `?ho-so=${encodeURIComponent(id)}`);
    await expect(panel(page)).toHaveAttribute("data-record-id", id);
    await assertOpened(page, unit);
    await openInventory(page, "?ho-so=khong-co");
    await page.waitForTimeout(300);
    await expect(panel(page)).toHaveCount(0);
    await expect(page.locator('[data-slot="region-count"]')).toContainText("60");
    expect(errors).toEqual([]);
  });

  test("break: reading the record by row index opens the wrong one", async ({ page }) => {
    await openInventory(page);
    const { id } = await openFifth(page);
    await openInventory(page, `?ho-so=${encodeURIComponent(id)}`);
    // The unit at the next index stands for a reader that counts rows instead of matching ids.
    const wrong = ((await openers(page).nth(5).textContent()) ?? "").trim();
    await expect(assertOpened(page, wrong)).rejects.toThrow("address opened the wrong record");
  });
});

// ---- E7 · AC-7: the record on a phone -------------------------------------------------------------------------------

test.describe("E7 · on a phone the record is the whole screen", () => {
  test.beforeEach(({ browserName }, info) =>
    test.skip(browserName !== "chromium" || !PHONE.has(info.project.name), "do o 414 va 360"),
  );

  test("opens full screen with the card on top, closes back to the unit code", async ({ page }) => {
    await openInventory(page);
    const { id } = await openFifth(page);
    await expect(panel(page)).toHaveAttribute("data-record-layout", "screen");
    await assertPhoneFullScreen(page);
    const shape = await panel(page).evaluate((el) => {
      const body = el.querySelector('[data-slot="record-panel-body"]')!;
      const record = body.firstElementChild;
      const card = record?.firstElementChild;
      return {
        record: record?.getAttribute("data-slot"),
        card: card?.getAttribute("data-slot"),
        unit: card?.querySelector('[data-slot="listing-card-unit"]')?.textContent ?? "",
        price: card?.querySelector('[data-slot="listing-card-price"]')?.textContent ?? "",
        place: card?.querySelector('[data-slot="listing-card-place"]')?.textContent ?? "",
        status: card?.querySelectorAll("[data-status]").length ?? 0,
        facts:
          card?.querySelectorAll('[data-slot="listing-card-facts"] > [data-field]').length ?? 0,
        fields: el.querySelectorAll('[data-slot="listing-record-fields"] > [data-field]').length,
      };
    });
    expect(shape).toMatchObject({
      record: "listing-record",
      card: "listing-card",
      status: 1,
      facts: 3,
      fields: 8,
    });
    expect(shape.unit.trim()).not.toBe("");
    expect(shape.price.trim()).not.toBe("");
    expect(shape.place.trim()).not.toBe("");
    await panel(page).getByRole("button", { name: "Đóng" }).click();
    await expect(panel(page)).toHaveCount(0);
    await expect
      .poll(() => page.evaluate(() => document.activeElement?.getAttribute("data-record-open")))
      .toBe(id);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth),
    ).toBeLessThanOrEqual(0);
  });

  test("break: a record three quarters wide is not full screen", async ({ page }) => {
    await injectStyle(page, '[data-slot="record-panel"] { width: 75% !important; }');
    await openInventory(page);
    await openFifth(page);
    await expect(assertPhoneFullScreen(page)).rejects.toThrow("phone record is not full screen");
  });
});

// ---- E9 · AC-9: accessibility with the record open ------------------------------------------------------------------

/** The scans written ahead: two sizes × two themes. */
const SCANS: readonly [string, "light" | "dark"][] = [
  ["1440", "light"],
  ["1440", "dark"],
  ["360", "light"],
  ["360", "dark"],
];

test.describe("E9 · no serious accessibility fault with the record open", () => {
  test("scans light and dark", async ({ page }, info) => {
    const mine = SCANS.filter(([size]) => size === info.project.name);
    test.skip(mine.length === 0, "quet o 1440 va 360");
    let scanned = 0;
    for (const [, colorScheme] of mine) {
      await page.emulateMedia({ colorScheme });
      await openInventory(page);
      await openFifth(page);
      expect(await seriousViolations(page), `${info.project.name} ${colorScheme}`).toEqual([]);
      scanned += 1;
    }
    expect(scanned).toBe(2);
  });

  test("break: a record without a name is caught", async ({ page }, info) => {
    test.skip(info.project.name !== "1440", "quet o 1440");
    await openInventory(page);
    await openFifth(page);
    await page
      .locator('[role="dialog"][aria-modal="false"]')
      .evaluate((el) => el.removeAttribute("aria-labelledby"));
    expect(await seriousViolations(page)).toContain("aria-dialog-name");
  });
});
