// Inventory used by hand like a sheet (roadmap row 2a, _acceptance/bang-hang-dung-tay-nhu-sheet), in a real browser
// at the four widths: keys, copy, frozen columns, status shortcuts, accessibility and full screen.
// E1, E2, E9, E11, E14, E18 of the contract.
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

import { formatMoney, statusLabel } from "../../src/lib/format";
import { SAMPLE_STATUS_COUNTS } from "../../src/modules/listings/sample";

const WIDE = new Set(["1024", "1440"]);
const width = () => test.info().project.name;
const table = (page: Page) =>
  page.locator('[data-slot="data-region-body"] table[data-slot="data-grid-table"]');
const bodyRows = (page: Page) =>
  page.locator('[data-slot="data-region-body"] tbody tr[data-row-id]');

async function openInventory(page: Page, query = ""): Promise<void> {
  await page.goto(`/inventory${query}`);
  await expect(page.locator('[hidden][id^="S:"]')).toHaveCount(0);
  await expect(table(page)).toHaveAttribute("tabindex", "0");
}

/** The element that scrolls the grid's run. */
const scroller = (page: Page) =>
  table(page).evaluateHandle((el) => {
    let node: HTMLElement | null = el as HTMLElement;
    while (node && node.scrollHeight <= node.clientHeight) node = node.parentElement;
    return node as HTMLElement;
  });

async function cellOf(page: Page, n: number, field: string) {
  return bodyRows(page)
    .filter({ has: page.locator(`[data-row-number="${n}"]`) })
    .locator(`td[data-col-id="${field}"]`);
}

/** Where the selected cell is, and whether it sits whole inside the view (below the header, right of frozen columns). */
async function focused(page: Page) {
  return page.evaluate(() => {
    const td = document.querySelector<HTMLElement>("td[data-cell-focused]");
    if (!td) return null;
    const tr = td.closest("tr") as HTMLElement;
    const viewport = td.closest('[data-slot="scroll-area-viewport"]') as HTMLElement;
    const v = viewport.getBoundingClientRect();
    const head = (viewport.querySelector("thead") as HTMLElement).getBoundingClientRect();
    const c = td.getBoundingClientRect();
    const pinned = td.hasAttribute("data-pinned");
    const frozenRight = Math.max(
      v.left,
      ...[...tr.querySelectorAll<HTMLElement>("td[data-pinned]")].map(
        (p) => p.getBoundingClientRect().right,
      ),
    );
    const left = pinned ? v.left : frozenRight;
    const right = Math.min(v.right, window.innerWidth);
    // A cell wider than the room right of the frozen columns cannot show whole: its start must then sit at that edge.
    const fitsWidth = c.width <= right - left + 1;
    const inView =
      c.top >= head.bottom - 1 &&
      c.bottom <= v.bottom + 1 &&
      c.left >= left - 1 &&
      (fitsWidth ? c.right <= right + 1 : c.left <= left + 1);
    return {
      row: Number(tr.querySelector("[data-row-number]")?.getAttribute("data-row-number")),
      col: td.getAttribute("data-col-id"),
      inView,
    };
  });
}

async function assertFocus(
  page: Page,
  key: string,
  row: number | "after-1",
  col: string,
): Promise<void> {
  const f = await focused(page);
  if (!f) throw new Error(`no selected cell after ${key}`);
  const rowOk = row === "after-1" ? f.row > 1 : f.row === row;
  if (!rowOk || f.col !== col) throw new Error(`${key}: at ${f.row} ${f.col}, want ${row} ${col}`);
  if (!f.inView) throw new Error(`focused cell out of view: ${key}`);
}

// Written ahead: 9 keys, each with the row and column the selected cell must reach.
const KEYS: [string, number | "after-1", string][] = [
  ["ArrowRight", 1, "Listing.buildingName"],
  ["ArrowDown", 2, "Listing.buildingName"],
  ["Tab", 2, "Listing.subdivisionName"],
  ["Shift+Tab", 2, "Listing.buildingName"],
  ["End", 2, "Listing.lastConfirmedAt"],
  ["Home", 2, "Listing.unitNumber"],
  ["Control+End", 60, "Listing.lastConfirmedAt"],
  ["Control+Home", 1, "Listing.unitNumber"],
  ["PageDown", "after-1", "Listing.unitNumber"],
];

test.describe("sheet keys", () => {
  test("sheet keys move the selected cell and the grid follows it", async ({ page }) => {
    expect(KEYS).toHaveLength(9);
    await openInventory(page);
    await (await cellOf(page, 1, "Listing.unitNumber")).click({ position: { x: 3, y: 3 } });
    for (const [key, row, col] of KEYS) {
      await page.keyboard.press(key);
      await page.waitForTimeout(150);
      await assertFocus(page, key, row, col);
    }
    await page.keyboard.press("Shift+ArrowDown");
    await page.keyboard.press("Escape");
    await expect(page.locator("td[data-cell-selected]")).toHaveCount(0);
  });

  test("sheet keys: cell out of view fails the check", async ({ page }) => {
    await openInventory(page);
    await (await cellOf(page, 2, "Listing.unitNumber")).click({ position: { x: 3, y: 3 } });
    await page.keyboard.press("End");
    await page.waitForTimeout(150);
    // Slide row 2 under the sticky header, still mounted: the check must see it covered.
    const s = await scroller(page);
    await s.evaluate((el) => (el.scrollTop += 40));
    await page.waitForTimeout(150);
    await expect(assertFocus(page, "End", 2, "Listing.lastConfirmedAt")).rejects.toThrow(
      "focused cell out of view: End",
    );
  });
});

test.describe("sheet copy", () => {
  test.skip(() => width() !== "1440", "copy is measured at 1440");

  const read = (page: Page) => page.evaluate(() => navigator.clipboard.readText());
  /** The clipboard is written after the key, asynchronously: wait for it to change, then compare. */
  async function copiedNow(page: Page, expected: string): Promise<string> {
    let last = "";
    for (let i = 0; i < 20; i += 1) {
      last = await read(page);
      if (last === expected) break;
      await page.waitForTimeout(100);
    }
    return last;
  }
  const texts = async (page: Page, rows: number[], fields: string[]) => {
    const grid: string[][] = [];
    for (const n of rows) {
      const line: string[] = [];
      for (const f of fields)
        line.push(((await (await cellOf(page, n, f)).textContent()) ?? "").trim());
      grid.push(line);
    }
    return grid.map((l) => l.join("\t")).join("\r\n");
  };
  function checkCopied(copied: string, expected: string): void {
    if (copied !== expected)
      throw new Error(
        `copied text differs from the selected cells: ${JSON.stringify(copied)} vs ${JSON.stringify(expected)}`,
      );
  }

  for (const copyKey of ["Control+c", "Meta+c"]) {
    test(`copies what the cells show, tab-separated, with ${copyKey}`, async ({
      page,
      context,
    }) => {
      await context.grantPermissions(["clipboard-read", "clipboard-write"]);
      await openInventory(page);
      // (a) unit codes and towers of rows 3..5
      await (await cellOf(page, 3, "Listing.unitNumber")).click({ position: { x: 3, y: 3 } });
      await page.keyboard.press("Shift+ArrowDown");
      await page.keyboard.press("Shift+ArrowDown");
      await page.keyboard.press("Shift+ArrowRight");
      await expect(page.locator('[data-slot="region-selection"]')).toContainText("6 ô đã chọn");
      await page.keyboard.press(copyKey);
      const a = await texts(page, [3, 4, 5], ["Listing.unitNumber", "Listing.buildingName"]);
      checkCopied(await copiedNow(page, a), a);
      expect(() => checkCopied(`#\tCăn\tToà\r\n${a}`, a)).not.toThrow;
      expect(() => checkCopied(`Căn\tToà\r\n${a}`, a)).toThrow(
        "copied text differs from the selected cells",
      );
      // (b) status label and price as shown, built from the status and the price of rows 1..2
      const statusOf = async (n: number) =>
        (await (
          await cellOf(page, n, "Listing.standardStatus")
        )
          .locator("[data-status]")
          .getAttribute("data-status")) as never;
      const priceOf = async (n: number) => {
        const shown = (
          (await (await cellOf(page, n, "Listing.listPrice")).textContent()) ?? ""
        ).trim();
        return shown;
      };
      await (await cellOf(page, 1, "Listing.standardStatus")).click();
      await page.keyboard.press("Shift+ArrowRight");
      await page.keyboard.press("Shift+ArrowDown");
      await page.keyboard.press(copyKey);
      const b = [1, 2]
        .map((n) => n)
        .map(async (n) => `${statusLabel(await statusOf(n))}\t${await priceOf(n)}`);
      const expectedB = (await Promise.all(b)).join("\r\n");
      expect(expectedB).toMatch(/tỷ/);
      checkCopied(await copiedNow(page, expectedB), expectedB);
      const rawB = (
        await Promise.all([1, 2].map(async (n) => `${await statusOf(n)}\t${await priceOf(n)}`))
      ).join("\r\n");
      expect(() => checkCopied(rawB, expectedB)).toThrow(
        "copied text differs from the selected cells",
      );
      expect(formatMoney(4_650_000_000)).toMatch(/tỷ/);
      // (c) with Toà hidden, a range from Căn to Dự án carries only the shown columns
      await page.getByRole("button", { name: "Cột", exact: true }).click();
      await page.getByRole("menuitemcheckbox", { name: "Toà" }).click();
      await page.keyboard.press("Escape");
      await expect(page.getByRole("menu")).toBeHidden();
      await (await cellOf(page, 1, "Listing.unitNumber")).click({ position: { x: 3, y: 3 } });
      await page.keyboard.press("Shift+ArrowRight");
      await page.keyboard.press("Shift+ArrowDown");
      await page.keyboard.press(copyKey);
      const c = await texts(page, [1, 2], ["Listing.unitNumber", "Listing.subdivisionName"]);
      checkCopied(await copiedNow(page, c), c);
    });
  }
});

test.describe("sheet frozen columns", () => {
  test.skip(() => width() !== "360", "frozen columns are measured at 360");

  async function lefts(page: Page) {
    return page.evaluate(() =>
      ["row-number", "Listing.unitNumber", "Listing.buildingName"].map((id) => {
        const th = document.querySelector<HTMLElement>(
          `thead th[data-col-id="${id}"], thead th[data-column-id="${id}"]`,
        );
        const td = document.querySelector<HTMLElement>(`tbody td[data-col-id="${id}"]`);
        return (th ?? td)?.getBoundingClientRect().left ?? NaN;
      }),
    );
  }
  async function checkFrozen(page: Page): Promise<void> {
    const before = await lefts(page);
    const s = await scroller(page);
    await page.evaluate(() => {
      const t = document.querySelector('table[data-slot="data-grid-table"]') as HTMLElement;
      let n: HTMLElement | null = t;
      while (n && n.scrollWidth <= n.clientWidth) n = n.parentElement;
      if (n) n.scrollLeft = 10_000;
    });
    void s;
    await page.waitForTimeout(200);
    const after = await lefts(page);
    ["#", "Căn", "Toà"].forEach((name, i) => {
      if (Math.abs((after[i] as number) - (before[i] as number)) > 1)
        throw new Error(`frozen column moved: ${name}`);
    });
  }

  test("row number, Căn and Toà stay put when the grid scrolls sideways", async ({ page }) => {
    await openInventory(page);
    await checkFrozen(page);
    await expect(
      page.locator('td[data-col-id="Listing.lastConfirmedAt"]').first(),
    ).toBeInViewport();
  });

  test("frozen-column check fails when the columns are not sticky", async ({ page }) => {
    await openInventory(page);
    await page.addStyleTag({
      content: "td[data-pinned],th[data-pinned]{position:static!important}",
    });
    await expect(checkFrozen(page)).rejects.toThrow("frozen column moved");
  });
});

test.describe("status shortcuts", () => {
  test.skip(() => !["1440", "360"].includes(width()), "shortcuts are measured at 1440 and 360");

  async function openShortcut(page: Page, title: string): Promise<void> {
    if (width() === "360")
      await page
        .getByRole("button", { name: /thanh bên|Mở|menu/i })
        .first()
        .click();
    await page
      .getByRole("link", { name: title, exact: true })
      .filter({ visible: true })
      .first()
      .click();
  }
  async function allStatuses(page: Page): Promise<string[]> {
    const s = await page
      .locator('[data-slot="data-region-body"] [data-slot="scroll-area-viewport"]')
      .first();
    const seen = new Map<string, string>();
    for (let step = 0; step < 30; step += 1) {
      for (const tr of await bodyRows(page).all()) {
        const id = (await tr.getAttribute("data-row-id")) as string;
        const status = await tr.locator("[data-status]").first().getAttribute("data-status");
        if (status) seen.set(id, status);
      }
      const done = await s.evaluate((el) => {
        const end = el.scrollTop + el.clientHeight >= el.scrollHeight - 2;
        el.scrollTop += el.clientHeight;
        return end;
      });
      await page.waitForTimeout(80);
      if (done) break;
    }
    return [...seen.values()];
  }
  function checkStatuses(statuses: string[], want: string): void {
    if (statuses.length === 0 || statuses.some((s) => s !== want))
      throw new Error(`shortcut opens wrong status: ${want}`);
  }

  for (const status of Object.keys(SAMPLE_STATUS_COUNTS)) {
    test(`shortcut ${status} opens the grid filtered to it`, async ({ page }) => {
      await openInventory(page);
      await openShortcut(page, statusLabel(status as never));
      await expect(page).toHaveURL(new RegExp(`status=${status}$`));
      await expect(table(page)).toHaveAttribute("tabindex", "0");
      const statuses = await allStatuses(page);
      checkStatuses(statuses, status);
      expect(statuses).toHaveLength(
        SAMPLE_STATUS_COUNTS[status as keyof typeof SAMPLE_STATUS_COUNTS],
      );
      await expect(page.locator('[data-slot="region-footer-count"]')).toHaveText(
        `${statuses.length} / 60 dòng`,
      );
      // On the phone the sheet closes once a shortcut is chosen; the lit link is still the chosen one.
      await expect(page.locator('a[aria-current="true"]').first()).toHaveText(
        statusLabel(status as never),
      );
      if (status === "Active") {
        await page.getByLabel("Lọc cột Giá chào").fill("<=5");
        const priced = await bodyRows(page).count();
        expect(priced).toBeLessThan(statuses.length);
        for (const tr of await bodyRows(page).all())
          await expect(tr.locator("[data-status]").first()).toHaveAttribute(
            "data-status",
            "Active",
          );
      }
    });
  }

  test("shortcut check fails when a shortcut opens another status", async ({ page }) => {
    await openInventory(page, "?status=Pending");
    const statuses = await allStatuses(page);
    expect(() => checkStatuses(statuses, "Active")).toThrow("shortcut opens wrong status: Active");
  });
});

async function seriousViolations(page: Page): Promise<string[]> {
  const { violations } = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .exclude("nextjs-portal")
    .analyze();
  return violations
    .filter((v) => v.impact === "serious" || v.impact === "critical")
    .map((v) => v.id);
}

test.describe("sheet axe", () => {
  // Written ahead: 2 schemes × 3 states per width; × 4 widths = 24 cells.
  const STATES: [string, (page: Page) => Promise<void>][] = [
    ["mặc định", async () => {}],
    [
      "lọc mở",
      async (page) => {
        // Row 2e: the filter row is always there; the state is a rule typed in it.
        await page.getByLabel("Lọc cột Giá chào").fill("<=5");
      },
    ],
    ["nhóm", async (page) => page.getByRole("button", { name: "Nhóm theo Toà" }).click()],
  ];
  for (const scheme of ["light", "dark"] as const)
    for (const [name, act] of STATES)
      test(`no serious violations: ${scheme}, ${name}`, async ({ page }) => {
        expect(STATES.length * 2).toBe(6);
        await page.emulateMedia({ colorScheme: scheme });
        await openInventory(page);
        await act(page);
        await page.waitForTimeout(200);
        expect(await seriousViolations(page)).toEqual([]);
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
          ),
        ).toBe(true);
      });

  test("axe catches a filter box without a name", async ({ page }) => {
    await openInventory(page);
    await page.getByLabel("Lọc cột Giá chào").evaluate((el) => {
      el.removeAttribute("aria-label");
      el.removeAttribute("placeholder");
    });
    expect(await seriousViolations(page)).toContain("label");
  });
});

test.describe("sheet tab stops", () => {
  /**
   * Tab from the region's first toolbar button through the grid region, naming each stop until the stop leaves the
   * region. Row 2e: the region has no search box, so the walk starts on the toolbar's first button, named first.
   */
  async function tabStops(page: Page): Promise<string[]> {
    const first = page.locator('[data-slot="region-toolbar"] button').first();
    await first.focus();
    const names: string[] = [
      ((await first.getAttribute("aria-label")) || (await first.textContent()) || "").trim(),
    ];
    for (let i = 0; i < 60; i += 1) {
      await page.keyboard.press("Tab");
      const name = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null;
        if (!el || !el.closest('[data-slot="data-region"]')) return null;
        if (el.matches('table[data-slot="data-grid-table"]')) return "grid";
        if (el.closest("tbody"))
          return el.getAttribute("data-slot") === "truncated-text" ? "cut-text" : "body";
        return el.getAttribute("aria-label") || el.textContent?.trim() || el.tagName;
      });
      if (name === null) break;
      // Tab inside the grid moves the selected cell along the row, as on a sheet: one stop, many presses.
      if (name === "grid" && names.at(-1) === "grid") continue;
      names.push(name);
    }
    return names;
  }
  function checkStops(stops: string[], expected: string[]): void {
    for (const want of expected)
      if (!stops.includes(want))
        throw new Error(`tab stop missing: ${want} (stops: ${stops.join(" | ")})`);
    if (stops.filter((s) => s === "body").length > 0)
      throw new Error("body takes a tab stop of its own");
    if (stops.filter((s) => s === "grid").length !== 1) throw new Error("grid not reached by Tab");
  }
  const HEADERS = [
    "Căn",
    "Toà",
    "Dự án",
    "Trạng thái",
    "Giá chào",
    "Diện tích",
    "Phòng ngủ",
    "Xác nhận lúc",
  ];
  const tools = () => ["Cột", "Nhóm theo Toà", ...(WIDE.has(width()) ? ["Toàn màn hình"] : [])];

  // Row 2e: the filter row is always there, so both ways of opening reach the filter boxes; «Lọc» is gone.
  for (const [name, typed] of [
    ["mặc định", false],
    ["đang lọc", true],
  ] as const)
    test(`tab reaches the tools, headers, filter boxes and the grid: ${name}`, async ({ page }) => {
      await openInventory(page);
      if (typed) await page.getByLabel("Lọc cột Giá chào").fill("<=5");
      const stops = await tabStops(page);
      expect(stops).not.toContain("Lọc");
      const expected = [
        ...tools(),
        ...HEADERS,
        ...HEADERS.filter((h) => h !== "Trạng thái").map((h) => `Lọc cột ${h}`),
        "grid",
      ];
      checkStops(
        stops.map((s) => s.replace(/\s+/g, " ")),
        expected.map((s) => s.replace(/\s+/g, " ")),
      );
    });

  test("tab-stop check fails when a filter box leaves the order", async ({ page }) => {
    await openInventory(page);
    await page.getByLabel("Lọc cột Giá chào").evaluate((el) => el.setAttribute("tabindex", "-1"));
    const stops = await tabStops(page);
    expect(() => checkStops(stops, ["Lọc cột Giá chào", "grid"])).toThrow(
      "tab stop missing: Lọc cột Giá chào",
    );
  });
});

test.describe("sheet full screen", () => {
  async function visibleRows(page: Page): Promise<number> {
    return page.evaluate(() => {
      const v = document.querySelector(
        '[data-slot="data-region-body"] [data-slot="scroll-area-viewport"]',
      ) as HTMLElement;
      const box = v.getBoundingClientRect();
      return [...document.querySelectorAll("tbody tr[data-row-id]")].filter((r) => {
        const b = r.getBoundingClientRect();
        return b.top >= box.top - 1 && b.bottom <= box.bottom + 1 && b.bottom <= innerHeight;
      }).length;
    });
  }
  async function checkFullScreen(page: Page): Promise<void> {
    const state = await page.evaluate(() => {
      const menu = document.querySelector('[role="menu"]');
      let menuOnTop = false;
      if (menu) {
        const r = menu.getBoundingClientRect();
        const el = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
        menuOnTop = !!el && menu.contains(el);
      }
      return {
        full: !!document.fullscreenElement,
        topBar: !!document.querySelector('[data-slot="app-shell-top-bar"]'),
        header: !!document.querySelector('[data-slot="page-header"]'),
        // Room left under the grid's footer: in full screen the grid reaches the bottom of the screen (the region keeps its own
        // bottom padding, about 15px; the normal-page height would leave some 200px).
        gapBelow:
          innerHeight -
          (document.querySelector('[data-slot="region-footer"]')?.getBoundingClientRect().bottom ??
            0),
        menuOnTop,
      };
    });
    if (!state.full) throw new Error("not full screen");
    if (state.header) throw new Error("page header shown in full screen");
    if (state.topBar) throw new Error("top bar shown in full screen");
    if (state.gapBelow > 32)
      throw new Error(`grid short in full screen: ${Math.round(state.gapBelow)}px left`);
    if (!state.menuOnTop) throw new Error("menu hidden in full screen: Cột");
  }

  test("full screen shows only the grid, more rows, menus on top, and gives the App Shell back", async ({
    page,
  }) => {
    if (!WIDE.has(width())) {
      await openInventory(page);
      await expect(page.locator('[data-slot="full-screen-toggle"]')).toBeHidden();
      return;
    }
    await openInventory(page);
    const before = await visibleRows(page);
    await page.getByRole("button", { name: "Toàn màn hình" }).click();
    await expect.poll(() => page.evaluate(() => !!document.fullscreenElement)).toBe(true);
    await page.waitForTimeout(300);
    expect(
      await page.evaluate(() => document.scrollingElement!.scrollHeight - innerHeight),
    ).toBeLessThanOrEqual(0);
    expect(await visibleRows(page)).toBeGreaterThan(before);
    await expect(page.locator('[data-slot="data-region-body"]')).toHaveAttribute(
      "data-density",
      "dense",
    );
    await page.getByRole("button", { name: "Cột", exact: true }).click();
    await expect(page.getByRole("menu")).toBeVisible();
    await checkFullScreen(page);
    await page.keyboard.press("Escape");
    await (await cellOf(page, 1, "Listing.unitNumber")).click({ position: { x: 3, y: 3 } });
    await page.keyboard.press("Control+End");
    await page.waitForTimeout(200);
    expect((await focused(page))?.row).toBe(60);
    await page.getByRole("button", { name: "Thoát toàn màn hình" }).click();
    await expect.poll(() => page.evaluate(() => !!document.fullscreenElement)).toBe(false);
    await expect(page.locator('[data-slot="page-header"]')).toBeVisible();
    await expect(page.locator('[data-slot="full-screen-toggle"]')).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  test("full-screen check fails when only the grid goes full screen, or the page header stays", async ({
    page,
  }) => {
    test.skip(!WIDE.has(width()), "no full screen below 768px");
    await openInventory(page);
    await page.locator('[data-slot="data-region"]').evaluate((el) => el.requestFullscreen());
    await page.getByRole("button", { name: "Cột", exact: true }).click();
    await expect(checkFullScreen(page)).rejects.toThrow(
      /page header shown in full screen|menu hidden in full screen: Cột/,
    );
    await page.evaluate(() => document.exitFullscreen());
    await page.keyboard.press("Escape");
    await page.evaluate(() => document.documentElement.requestFullscreen());
    await page.getByRole("button", { name: "Cột", exact: true }).click();
    await expect(checkFullScreen(page)).rejects.toThrow("page header shown in full screen");
  });

  test("full-screen check fails when the grid keeps the normal page height", async ({ page }) => {
    test.skip(!WIDE.has(width()), "no full screen below 768px");
    await openInventory(page);
    await page.getByRole("button", { name: "Toàn màn hình" }).click();
    await expect.poll(() => page.evaluate(() => !!document.fullscreenElement)).toBe(true);
    // Break: the scroll box keeps the normal page's height in full screen (the bug of round 2).
    await page.evaluate(() => {
      let box = document.querySelector<HTMLElement>(
        '[data-slot="data-region-body"] [data-slot="scroll-area-viewport"]',
      );
      while (box && !box.className.includes("--region-height")) box = box.parentElement;
      box!.style.setProperty("height", "var(--region-height)", "important");
    });
    await page.getByRole("button", { name: "Cột", exact: true }).click();
    await expect(checkFullScreen(page)).rejects.toThrow(/^grid short in full screen: \d+px left$/);
  });
});

test.describe("sheet footer in view", () => {
  test.skip(
    () => !WIDE.has(width()),
    "the page fits the screen from 1024; narrower screens scroll the page",
  );

  /** Why the page fails to fit, or null: the page scrolls, or the footer's hint falls below the screen. */
  async function fitProblem(page: Page): Promise<string | null> {
    const r = await page.evaluate(() => {
      const foot = document.querySelector('[data-slot="region-footer"]') as HTMLElement | null;
      return {
        overflow: document.scrollingElement!.scrollHeight - innerHeight,
        footBottom: foot ? foot.getBoundingClientRect().bottom : Infinity,
      };
    });
    if (r.overflow > 1) return `page scrolls by ${r.overflow}px`;
    if (r.footBottom > (await page.evaluate(() => innerHeight)) + 1) return "footer below the fold";
    return null;
  }

  test("the page does not scroll and the selection hint in the footer is on screen", async ({
    page,
  }) => {
    await openInventory(page);
    // Row 2e: the filter row is always there; the second pass has a rule typed in it.
    for (const filters of [false, true]) {
      if (filters) await page.getByLabel("Lọc cột Giá chào").fill("<=9");
      await (await cellOf(page, 3, "Listing.unitNumber")).click({ position: { x: 3, y: 3 } });
      await page.keyboard.press("Shift+ArrowDown");
      await expect(page.locator('[data-slot="region-footer"]')).toContainText("2 ô đã chọn");
      expect(await fitProblem(page), filters ? "filters open" : "default").toBeNull();
    }
  });

  test("footer check fails when the grid is as tall as the screen", async ({ page }) => {
    await openInventory(page);
    // Break the fit: the grid's scroll box grows to the screen's height, as before row 2a.
    await page.evaluate(() => {
      let box = document.querySelector<HTMLElement>(
        '[data-slot="data-region-body"] [data-slot="scroll-area-viewport"]',
      );
      while (box && !box.className.includes("--region-height")) box = box.parentElement;
      box!.style.setProperty("height", "100vh", "important");
    });
    expect(await fitProblem(page)).toMatch(/^page scrolls by \d+px$/);
  });
});

// Row 2c (luu-goc-nhin-cot-hai), E13 — Ngoài-4 of 2a: a filter that leaves no row keeps the box typed in, its focus and
// the other filter boxes; one rule mended brings the rows back. Row 2e: the box typed in is the Căn filter, at every width.
test.describe("no match keeps filters", () => {
  /** The filter boxes are still there to mend, at every width (row 2e: the filter row is always shown). */
  async function checkFilters(page: Page): Promise<void> {
    const boxes = page.locator('[data-slot="data-region"] [data-slot="column-filter"]');
    const ok = (await boxes.count()) === 8 && (await boxes.first().isVisible());
    if (!ok) throw new Error("filters gone on no match");
  }

  test("Căn «zzz» letter by letter, then mend the tower filter", async ({ page }) => {
    await openInventory(page);
    if (WIDE.has(width())) await page.getByLabel("Lọc cột Toà").fill("S1.0");
    const box = page.getByLabel("Lọc cột Căn");
    await box.click();
    await page.keyboard.type("zzz", { delay: 30 });
    await expect(page.getByText("Không có dòng nào khớp")).toBeVisible();
    await expect(box).toBeFocused();
    await expect(box).toHaveValue("zzz");
    await checkFilters(page);
    await box.fill("");
    if (WIDE.has(width())) {
      // Typed letter by letter: the box keeps its focus when its rule leaves no row, and mending it brings rows back.
      const tower = page.getByLabel("Lọc cột Toà");
      await tower.fill("");
      await tower.click();
      await page.keyboard.type("khong-co", { delay: 30 });
      await expect(page.getByText("Không có dòng nào khớp")).toBeVisible();
      await expect(tower).toBeFocused();
      await checkFilters(page);
      for (let i = 0; i < "khong-co".length; i += 1) await page.keyboard.press("Backspace");
      await expect(tower).toHaveValue("");
      await expect(bodyRows(page).first()).toBeVisible();
    }
    // Break: the filter boxes removed while nothing matches.
    await box.fill("zzz");
    await page.evaluate(() =>
      document.querySelectorAll('[data-slot="column-filter"]').forEach((el) => el.remove()),
    );
    await expect(checkFilters(page)).rejects.toThrow("filters gone on no match");
  });
});

// Row 2c, E14 — Ngoài-5 of 2a: leaving the inventory while it holds the whole screen gives the next screen the whole
// App Shell, without a reload; back on the inventory it is in the normal mode.
test.describe("leaving full screen restores the shell", () => {
  test.skip(() => width() !== "1440", "measured at 1440");

  async function checkShell(page: Page): Promise<void> {
    const parts = await page.evaluate(() =>
      [
        '[data-sidebar="sidebar"]',
        '[data-slot="app-shell-top-bar"]',
        '[data-slot="app-shell-second-column"]',
        '[data-slot="page-header"]',
      ].map((sel) => {
        const el = document.querySelector<HTMLElement>(sel);
        return !!el && el.getClientRects().length > 0;
      }),
    );
    if (parts.some((p) => !p)) throw new Error("shell still hidden after leaving full screen");
  }

  const WAYS: [string, (page: Page) => Promise<void>][] = [
    [
      "Back",
      async (page) => {
        await page.goBack();
      },
    ],
    [
      "a link through the router",
      async (page) =>
        page.evaluate(() =>
          (
            window as unknown as { next: { router: { push: (h: string) => void } } }
          ).next.router.push("/sent"),
        ),
    ],
  ];

  for (const [name, leave] of WAYS)
    test(`by ${name}`, async ({ page }) => {
      expect(WAYS).toHaveLength(2);
      let loads = 0;
      page.on("load", () => (loads += 1));
      await page.goto("/");
      await page.getByRole("link", { name: "Bảng hàng" }).first().click();
      await page.waitForURL("**/inventory");
      await expect(table(page)).toHaveAttribute("tabindex", "0");
      const loadsBefore = loads;
      await page.getByRole("button", { name: "Toàn màn hình" }).click();
      await expect.poll(() => page.evaluate(() => !!document.fullscreenElement)).toBe(true);
      await expect(page.locator('[data-slot="app-shell-top-bar"]')).toHaveCount(0);
      await expect(checkShell(page)).rejects.toThrow(
        "shell still hidden after leaving full screen",
      );
      await leave(page);
      await page.waitForURL((u) => u.pathname !== "/inventory");
      await expect(page.locator('[data-slot="page-header"]')).toBeVisible();
      await checkShell(page);
      expect(loads).toBe(loadsBefore);
      await page.goto("/inventory");
      await expect(table(page)).toHaveAttribute("tabindex", "0");
      await expect(page.locator('[data-slot="data-region"]')).not.toHaveAttribute(
        "data-full-screen",
      );
      await expect(page.locator('[data-slot="app-shell-top-bar"]')).toBeVisible();
    });
});

// Row 2e (bo-o-tim-cua-vung), E8 — AC-5: on a phone the filter row sits under the headers and scrolls with the grid;
// typing in a box filters as at 1440, and no box is covered or cut.
test.describe("phone filter row", () => {
  test.skip(() => WIDE.has(width()), "measured at 360 and 414");

  const PHONES = ["360", "414"];
  const filterBox = (page: Page, header: string) => page.getByLabel(`Lọc cột ${header}`);
  const headerCell = (page: Page, field: string) =>
    page.locator(`[data-slot="data-region-body"] thead th[data-col-id="${field}"]`).first();

  /** The filter row scrolls with the grid: the price box comes into view beside its header, whole and wide enough. */
  async function checkScrollsWithGrid(page: Page): Promise<void> {
    const viewport = page
      .locator('[data-slot="data-region-body"] [data-slot="scroll-area-viewport"]')
      .first();
    const before = await filterBox(page, "Giá chào").boundingBox();
    await headerCell(page, "Listing.listPrice").scrollIntoViewIfNeeded();
    const after = await filterBox(page, "Giá chào").boundingBox();
    const head = await headerCell(page, "Listing.listPrice").boundingBox();
    const view = await viewport.boundingBox();
    if (!before || !after || !head || !view)
      throw new Error("filter row does not scroll with the grid");
    const moved = Math.abs(after.x - before.x) > 1 || after.x >= view.x;
    const underHead = after.y >= head.y && after.x >= head.x - 1 && after.x < head.x + head.width;
    const inside = after.x >= view.x - 1 && after.x + after.width <= view.x + view.width + 1;
    if (!moved || !underHead || !inside)
      throw new Error("filter row does not scroll with the grid");
    // The price column, filter box included, is at least 11 ch of the grid's own text (a rule like «<=5, 2-5»).
    const ch = await headerCell(page, "Listing.listPrice").evaluate((th) => {
      const cell = document.querySelector('tbody td[data-col-id="Listing.listPrice"]') ?? th;
      const probe = document.createElement("span");
      probe.textContent = "0";
      probe.style.font = getComputedStyle(cell).font;
      document.body.append(probe);
      const one = probe.getBoundingClientRect().width;
      probe.remove();
      return th.getBoundingClientRect().width / one;
    });
    if (Math.round(ch * 10) / 10 < 11) throw new Error(`filter box too narrow: ${ch.toFixed(1)}ch`);
  }

  test("the filter row is under the headers, scrolls with the grid and filters as on a computer", async ({
    page,
  }) => {
    expect(PHONES).toHaveLength(2);
    expect(PHONES).toContain(width());
    await openInventory(page);
    const codeBox = await filterBox(page, "Căn").boundingBox();
    const codeHead = await headerCell(page, "Listing.unitNumber").boundingBox();
    expect(codeBox && codeHead).toBeTruthy();
    expect(codeBox!.y).toBeGreaterThanOrEqual(codeHead!.y);
    await expect(checkScrollsWithGrid(page)).resolves.toBeUndefined();
    const footer = page.locator('[data-slot="region-footer-count"]');
    await expect(footer).toHaveText("60 dòng");
    await filterBox(page, "Căn").fill("02");
    await expect(footer).toHaveText(/^\d+ \/ 60 dòng$/);
    const left = Number((await footer.textContent())?.split(" ")[0]);
    expect(left).toBeGreaterThan(0);
    expect(left).toBeLessThan(60);
  });

  test("the check fails when the filter row is pinned outside the scrolling grid", async ({
    page,
  }) => {
    await openInventory(page);
    await page.addStyleTag({
      content:
        '[data-slot="column-filter"] { position: fixed !important; left: 0 !important; top: 0 !important; }',
    });
    await expect(checkScrollsWithGrid(page)).rejects.toThrow(
      "filter row does not scroll with the grid",
    );
  });
});
