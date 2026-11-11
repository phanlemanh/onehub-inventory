// Row 1o — the App Shell arranged from ReUI app-shell-8, in the browser at the four sizes, light and dark
// (_acceptance/app-shell-chon-tu-reui/evals.yaml E1, E3, E4, E5). Signed out, the person holds no role, so the rail
// shows the three entries open to everyone. Each check has a twin that feeds it a wrong expectation and must fail with
// the pinned message, so a check that never runs cannot pass silently.
import { mkdirSync } from "node:fs";
import { join } from "node:path";

import { expect, test, type Page } from "@playwright/test";

import { LABELS } from "../../src/generated/labels";

const SCREENS = [
  { href: "/", title: LABELS.Today.pref },
  { href: "/inventory", title: LABELS.Inventory.pref },
  { href: "/sent", title: LABELS.Sent.pref },
] as const;

/** Written first: the second column of each screen (status names from ontology/labels.yaml). */
const STATUS_NAMES = [
  LABELS.StatusIncomplete.pref,
  LABELS.StatusActive.pref,
  LABELS.StatusPending.pref,
  LABELS.StatusClosed.pref,
  LABELS.StatusHold.pref,
  LABELS.StatusWithdrawn.pref,
];
const ALL_LISTINGS = `Tất cả ${LABELS.Listing.pref.toLocaleLowerCase("vi")}`;
const SECOND_COLUMN: Record<string, readonly string[]> = {
  "/": [],
  "/inventory": [ALL_LISTINGS, ...STATUS_NAMES],
  "/sent": ["Tất cả link"],
};
const NO_SUB_ITEMS = "Màn này chưa có mục con.";
const OPEN_SHEET = "Mở hoặc đóng thanh bên";

/** Desktop rail entries, read from the page. */
function rail(page: Page) {
  return page.locator('[data-slot="sidebar"] [data-sidebar="menu-button"]');
}

function column(page: Page) {
  return page.locator('[data-slot="app-shell-second-column"]');
}

async function railState(page: Page) {
  return rail(page).evaluateAll((els) =>
    els.map((e) => ({
      name: e.getAttribute("aria-label") ?? e.textContent?.trim() ?? "",
      href: e.getAttribute("href"),
      current: e.getAttribute("aria-current") === "page",
    })),
  );
}

function assertCurrent(state: { href: string | null; current: boolean }[], open: string): void {
  const marked = state.filter((s) => s.current).map((s) => s.href);
  if (marked.length !== 1 || marked[0] !== open)
    throw new Error("current entry is not the open screen");
}

function assertColumnState(state: string | null, expected: "open" | "closed"): void {
  if (state !== expected) throw new Error("second column state lost after reload");
}

function assertSheetClosed(visibleLinks: number): void {
  if (visibleLinks > 0) throw new Error("sheet stayed open after choosing");
}

/** SHOTS_DIR=<dir> saves the frames E10 looks at (one per named state). */
async function shot(page: Page, name: string) {
  const dir = process.env["SHOTS_DIR"];
  if (!dir) return;
  mkdirSync(dir, { recursive: true });
  await page.screenshot({ path: join(dir, `E10-${name}.png`) });
}

async function noSideways(page: Page) {
  return page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
}

test.describe("App Shell on a computer", () => {
  test.skip(({ viewport }) => (viewport?.width ?? 0) < 768, "computer sizes only");

  for (const colorScheme of ["light", "dark"] as const) {
    test(`rail, second column and top bar on every screen (${colorScheme})`, async ({ page }) => {
      await page.emulateMedia({ colorScheme });
      for (const s of SCREENS) {
        await page.goto(s.href);
        await expect(page.locator("h1")).toHaveText(s.title);
        const state = await railState(page);
        expect(state.map((e) => e.href)).toEqual(SCREENS.map((x) => x.href));
        expect(state.every((e) => e.name.length > 0)).toBe(true);
        assertCurrent(state, s.href);
        await expect(column(page)).toBeVisible();
        await expect(page.locator('[data-slot="app-shell-top-bar"]')).toBeVisible();
        if (s.href === "/inventory" && page.viewportSize()?.width === 1440)
          await shot(page, `inventory-1440-${colorScheme}`);
      }
    });
  }

  test("a click on the rail opens that screen in the same App Shell", async ({ page }) => {
    await page.goto("/");
    await rail(page).nth(2).click();
    await expect(page).toHaveURL(/\/sent$/);
    await expect(page.locator("h1")).toHaveText(LABELS.Sent.pref);
    assertCurrent(await railState(page), "/sent");
  });

  test("the current-entry check fails when the mark is on another screen", async ({ page }) => {
    await page.goto("/inventory");
    const state = await railState(page);
    expect(() => assertCurrent(state, "/sent")).toThrow("current entry is not the open screen");
  });

  test("the second column holds the places of each screen", async ({ page }) => {
    for (const s of SCREENS) {
      await page.goto(s.href);
      const names = await column(page).locator("a").allTextContents();
      expect(names.map((n) => n.trim())).toEqual(SECOND_COLUMN[s.href]);
      expect(names.some((n) => /\d/.test(n))).toBe(false);
      if (SECOND_COLUMN[s.href]!.length === 0)
        await expect(column(page)).toContainText(NO_SUB_ITEMS);
    }
    await page.goto("/inventory");
    await column(page).getByRole("link", { name: STATUS_NAMES[1]! }).click();
    await expect(page).toHaveURL(/\/inventory$/);
  });

  test("the second column folds, stays folded after a reload, and opens again", async ({
    page,
  }) => {
    await page.context().clearCookies();
    await page.goto("/inventory");
    await page.getByRole("button", { name: "Gập cột thứ hai" }).click();
    await expect(column(page)).toHaveAttribute("data-state", "closed");
    expect(await column(page).evaluate((e) => e.getBoundingClientRect().width)).toBe(0);
    await expect(page.getByRole("button", { name: "Mở cột thứ hai" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    await page.reload();
    assertColumnState(await column(page).getAttribute("data-state"), "closed");
    await page.getByRole("button", { name: "Mở cột thứ hai" }).click();
    await expect(column(page)).toHaveAttribute("data-state", "open");
  });

  test("the reload check fails when the folded column comes back open", async ({ page }) => {
    await page.context().clearCookies();
    await page.goto("/inventory");
    await page.getByRole("button", { name: "Gập cột thứ hai" }).click();
    await page.reload();
    const state = await column(page).getAttribute("data-state");
    expect(() => assertColumnState(state, "open")).toThrow("second column state lost after reload");
  });

  test("the top bar has the theme switch and the account corner, nothing from the block's demo", async ({
    page,
  }) => {
    await page.goto("/inventory");
    const bar = page.locator('[data-slot="app-shell-top-bar"]').first();
    await expect(bar.getByRole("button", { name: "Đổi giao diện" })).toBeVisible();
    await expect(bar.getByRole("link", { name: LABELS.SignIn.pref })).toBeVisible();
    for (const absent of [/^Create$/, /^Tạo$/, /Thông báo/, /Gõ mã căn/]) {
      await expect(page.getByRole("button", { name: absent })).toHaveCount(0);
    }
  });
});

test.describe("App Shell on a phone", () => {
  test.skip(({ viewport }) => (viewport?.width ?? 0) >= 768, "phone sizes only");

  for (const colorScheme of ["light", "dark"] as const) {
    test(`no column takes the screen and nothing scrolls sideways (${colorScheme})`, async ({
      page,
    }) => {
      await page.emulateMedia({ colorScheme });
      for (const s of SCREENS) {
        await page.goto(s.href);
        await expect(page.locator("h1")).toHaveText(s.title);
        await expect(column(page)).toBeHidden();
        await expect(rail(page)).toHaveCount(0);
        expect(await noSideways(page)).toBeLessThanOrEqual(0);
        if (s.href === "/inventory" && page.viewportSize()?.width === 360)
          await shot(page, `inventory-360-${colorScheme}`);
      }
    });
  }

  test("the sheet holds the rail and the second column, and closes after a choice", async ({
    page,
  }) => {
    await page.goto("/inventory");
    await page.getByRole("button", { name: OPEN_SHEET }).first().click();
    const sheet = page.locator('[data-mobile="true"]');
    await expect(sheet.getByRole("link", { name: LABELS.Sent.pref, exact: true })).toBeVisible();
    for (const name of SECOND_COLUMN["/inventory"]!) {
      await expect(sheet.getByRole("link", { name, exact: true }).first()).toBeVisible();
    }
    // The sheet slides in; shoot only once its animations have finished, so the frame shows it open.
    await expect
      .poll(() => sheet.first().evaluate((el) => el.getAnimations({ subtree: true }).length))
      .toBe(0);
    if (page.viewportSize()?.width === 360) await shot(page, "sheet-360-light");
    await sheet.getByRole("link", { name: LABELS.Sent.pref, exact: true }).click();
    await expect(page.locator("h1")).toHaveText(LABELS.Sent.pref);
    await expect(sheet).toHaveCount(0);
    assertSheetClosed(await page.locator('[data-mobile="true"] a').count());
  });

  test("the sheet check fails while the sheet is still open", async ({ page }) => {
    await page.goto("/inventory");
    await page.getByRole("button", { name: OPEN_SHEET }).first().click();
    const open = await page.locator('[data-mobile="true"] a').count();
    expect(() => assertSheetClosed(open)).toThrow("sheet stayed open after choosing");
  });
});
