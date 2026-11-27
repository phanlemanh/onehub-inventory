// Row 1o — the App Shell arranged from ReUI app-shell-8, in the browser at the four sizes, light and dark
// (_acceptance/app-shell-chon-tu-reui/evals.yaml E1, E3, E4, E5). Signed out, the person holds no role, so the rail
// shows the three entries open to everyone. Each check has a twin that feeds it a wrong expectation and must fail with
// the pinned message, so a check that never runs cannot pass silently.
import { mkdirSync } from "node:fs";
import { join } from "node:path";

import { type Page } from "@playwright/test";

import { expect, test } from "../../tools/e2e_templates/fixture";
import { openSheet } from "../../tools/e2e_templates/settle";

import { LABELS } from "../../src/generated/labels";
import { chupAnh, themKieu } from "./sua-trang";

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

type Box = { x: number; width: number } | null;

/** The open sheet lies wholly inside the screen and is wide enough to hold both columns. */
function assertSheetInView(box: Box, viewportWidth: number): void {
  if (!box || box.width < 200 || box.x < -1 || box.x + box.width > viewportWidth + 1)
    throw new Error("sheet frame does not show the open sheet");
}

async function sheetBox(page: Page): Promise<Box> {
  const el = page.locator('[data-slot="sidebar"][data-mobile="true"]').first();
  if ((await el.count()) === 0) return null;
  return el.boundingBox();
}

/** SHOTS_DIR=<dir> saves the frames E10 looks at (one per named state). */
async function shot(page: Page, name: string) {
  const dir = process.env["SHOTS_DIR"];
  if (!dir) return;
  mkdirSync(dir, { recursive: true });
  await chupAnh(page, { path: join(dir, `E10-${name}.png`) });
}

/** The search box's middle sits on the top bar's middle. */
function assertCentred(bar: Box, search: Box): void {
  if (!bar || !search) throw new Error("search not in the middle of the top bar");
  const off = Math.abs(search.x + search.width / 2 - (bar.x + bar.width / 2));
  if (off > 2) throw new Error("search not in the middle of the top bar");
}

type Geometry = {
  edge: { x: number; y: number; width: number; height: number };
  fold: { x: number; y: number; width: number; height: number };
  content: { x: number };
};

async function shellGeometry(page: Page): Promise<Geometry> {
  const edge = (await page.locator('[data-slot="app-shell-second-column-edge"]').boundingBox())!;
  const fold = (await page.locator('[data-slot="second-column-rail"]').boundingBox())!;
  const content = (await page.locator('[data-slot="app-shell-content"]').boundingBox())!;
  return { edge, fold, content: { x: content.x } };
}

/** The edge runs the window's height, the fold sits on it mid-window, and the screen starts right after it. */
function assertOnEdge(g: Geometry, windowHeight: number): void {
  if (g.edge.height < windowHeight - 80) throw new Error("second column edge stops short");
  const right = g.edge.x + g.edge.width;
  if (
    Math.abs(g.fold.x - right) > 2 ||
    Math.abs(g.fold.y + g.fold.height / 2 - windowHeight / 2) > 2
  )
    throw new Error("fold not on the column edge mid-window");
  if (g.content.x - right > 2) throw new Error("a gutter stands between the column and the screen");
}

/** The rotation of each of the fold's two strokes, as "none" or "<n>deg" (Tailwind 4 turns with the `rotate` property). */
async function strokeTurns(strokes: import("@playwright/test").Locator): Promise<string[]> {
  return strokes.evaluateAll((els) =>
    els.map((e) => {
      const r = getComputedStyle(e).rotate;
      const deg = r && r !== "none" ? Math.round(parseFloat(r)) : 0;
      return deg === 0 ? "none" : `${deg}deg`;
    }),
  );
}

type Head = { fontPx: number; headHeight: number; gap: number };

async function headGeometry(page: Page): Promise<Head> {
  const bar = (await page.locator('[data-slot="app-shell-top-bar"]').first().boundingBox())!;
  const head = (await page.locator('[data-slot="page-header"]').boundingBox())!;
  const frame = (await page.locator('[data-slot="frame"]').first().boundingBox())!;
  const fontPx = await page.locator("h1").evaluate((e) => parseFloat(getComputedStyle(e).fontSize));
  return { fontPx, headHeight: head.height, gap: frame.y - (bar.y + bar.height) };
}

/** No large title: the h1 is body size in a row no taller than 40px, at most 64px from the top bar to the first frame. */
function assertThinHead(h: Head): void {
  if (h.fontPx > 14 || h.headHeight > 40 || h.gap > 64)
    throw new Error("page head is not one thin row");
}

type HintGeometry = {
  boxRight: number;
  buttonRight: number;
  hintRight: number;
  keysLeft: number;
  keysRight: number;
};

/** Where the search box, its button, its hint and its ⌘ K keys end, as drawn. */
async function hintGeometry(page: Page): Promise<HintGeometry> {
  return page.locator('[data-slot="unit-jump"]').evaluate((root) => {
    const box = root.querySelector(":scope > span")!.getBoundingClientRect();
    const button = root.querySelector("button")!.getBoundingClientRect();
    const hint = root.querySelector("button > span")!.getBoundingClientRect();
    const keys = root.querySelector("button > span:last-child")!.getBoundingClientRect();
    return {
      boxRight: box.right,
      buttonRight: button.right,
      hintRight: hint.right,
      keysLeft: keys.left,
      keysRight: keys.right,
    };
  });
}

/** The hint is whole: the button stays inside its box, the hint ends before the ⌘ K keys, the keys end inside the button. */
function assertHintWhole(g: HintGeometry): void {
  if (
    g.buttonRight > g.boxRight + 1 ||
    g.hintRight > g.keysLeft + 1 ||
    g.keysRight > g.buttonRight + 1
  )
    throw new Error("search hint is cut");
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

  test("the top bar has the company and the one search box, nothing from the block's demo", async ({
    page,
  }) => {
    await page.goto("/inventory");
    const bar = page.locator('[data-slot="app-shell-top-bar"]').first();
    // The look and the account moved to the foot of the rail (owner's review, Verve layout).
    await expect(bar.getByRole("button", { name: "Đổi giao diện" })).toHaveCount(0);
    await expect(bar.getByRole("button", { name: "Tài khoản" })).toHaveCount(0);
    // On a computer the rail never unfolds: the sheet button is a phone's.
    await expect(page.getByRole("button", { name: "Mở hoặc đóng thanh bên" })).toBeHidden();
    for (const absent of [/^Create$/, /^Tạo$/, /Thông báo/]) {
      await expect(page.getByRole("button", { name: absent })).toHaveCount(0);
    }
    // The one search box is the product's own (row 3f, the owner's word at its scope gate), not the block's demo.
    await expect(page.getByRole("button", { name: /Gõ mã căn/ })).toHaveCount(1);
    await expect(bar.locator('[data-slot="unit-jump"]').getByRole("button")).toHaveCount(1);
  });

  test("the search box stands in the middle of the top bar", async ({ page }) => {
    await page.goto("/inventory");
    const bar = await page.locator('[data-slot="app-shell-top-bar"]').first().boundingBox();
    const search = await page.locator('[data-slot="app-shell-search"]').boundingBox();
    assertCentred(bar, search);
    expect(search!.width).toBeGreaterThanOrEqual(300);
    // The whole hint shows: nothing of it is cut.
    assertHintWhole(await hintGeometry(page));
  });

  test("the whole-hint check fails on a search box too narrow for its hint", async ({ page }) => {
    await page.goto("/inventory");
    assertHintWhole(await hintGeometry(page));
    // Break the real page: a box 120 px wide cannot hold «Gõ mã căn…» and the ⌘ K keys.
    await themKieu(page, {
      content: '[data-slot="unit-jump"] > span { width: 120px !important; }',
    });
    const narrow = await hintGeometry(page);
    expect(() => assertHintWhole(narrow)).toThrow("search hint is cut");
  });

  test("the middle check fails on a box at the end of the bar", async () => {
    expect(() => assertCentred({ x: 0, width: 1000 }, { x: 800, width: 160 })).toThrow(
      "search not in the middle of the top bar",
    );
  });

  test("the account menu at the foot of the rail holds the three looks and sign-in", async ({
    page,
  }) => {
    await page.goto("/inventory");
    const foot = page.locator('[data-slot="sidebar"] [data-slot="app-shell-account"]');
    await expect(page.locator('[data-slot="account-sign-in"][data-ready]')).toBeVisible();
    const button = foot.getByRole("button", { name: "Tài khoản" });
    await expect(button).toBeVisible();
    const box = (await button.boundingBox())!;
    expect(box.y + box.height).toBeGreaterThan(page.viewportSize()!.height - 80);
    await button.click();
    for (const look of ["Sáng", "Tối", "Theo thiết bị"]) {
      await expect(page.getByRole("menuitemradio", { name: look })).toBeVisible();
    }
    await expect(page.getByRole("menuitem", { name: LABELS.SignIn.pref })).toBeVisible();
    await page.getByRole("menuitemradio", { name: "Tối" }).click();
    await expect(page.locator("html")).toHaveClass(/\bdark\b/);
  });

  test("the second column's edge runs the whole height on every screen, its fold on that edge mid-window", async ({
    page,
  }) => {
    const height = page.viewportSize()!.height;
    for (const s of SCREENS) {
      await page.goto(s.href);
      await expect(page.locator("h1")).toHaveText(s.title);
      assertOnEdge(await shellGeometry(page), height);
    }
  });

  test("the edge check fails on a short edge, a fold off the edge and a gutter before the screen", async () => {
    const good: Geometry = {
      edge: { x: 72, y: 56, width: 225, height: 835 },
      fold: { x: 296, y: 435, width: 28, height: 28 },
      content: { x: 297 },
    };
    expect(() => assertOnEdge(good, 899)).not.toThrow();
    expect(() => assertOnEdge({ ...good, edge: { ...good.edge, height: 240 } }, 899)).toThrow(
      "second column edge stops short",
    );
    expect(() => assertOnEdge({ ...good, fold: { ...good.fold, y: 150 } }, 899)).toThrow(
      "fold not on the column edge mid-window",
    );
    expect(() => assertOnEdge({ ...good, content: { x: 321 } }, 899)).toThrow(
      "a gutter stands between the column and the screen",
    );
  });

  test("the fold's two strokes bend into an arrow when focused, the other way when folded", async ({
    page,
  }) => {
    await page.context().clearCookies();
    await page.goto("/inventory");
    const fold = page.getByRole("button", { name: "Gập cột thứ hai" });
    const strokes = fold.locator("span span");
    expect(await strokeTurns(strokes)).toEqual(["none", "none"]);
    await fold.focus();
    await page.keyboard.press("Shift+Tab");
    await page.keyboard.press("Tab");
    await expect.poll(() => strokeTurns(strokes)).toEqual(["40deg", "-40deg"]);
    await page.keyboard.press("Enter");
    const open = page.getByRole("button", { name: "Mở cột thứ hai" });
    await expect(open).toBeFocused();
    await expect.poll(() => strokeTurns(open.locator("span span"))).toEqual(["-40deg", "40deg"]);
    // Folded, the fold stands on the screen's left edge, mid-window.
    const height = page.viewportSize()!.height;
    const at = (await open.boundingBox())!;
    const content = (await page.locator('[data-slot="app-shell-content"]').boundingBox())!;
    expect(Math.abs(at.x - content.x)).toBeLessThanOrEqual(2);
    expect(Math.abs(at.y + at.height / 2 - height / 2)).toBeLessThanOrEqual(2);
  });

  test("the fold's strokes bend when the mouse rests on it", async ({ page }) => {
    await page.context().clearCookies();
    await page.goto("/inventory");
    const fold = page.getByRole("button", { name: "Gập cột thứ hai" });
    expect(await strokeTurns(fold.locator("span span"))).toEqual(["none", "none"]);
    await fold.hover();
    await expect.poll(() => strokeTurns(fold.locator("span span"))).toEqual(["40deg", "-40deg"]);
  });

  test("the head is one thin row: a small h1, at most 64px from the top bar to the first frame", async ({
    page,
  }) => {
    for (const href of ["/inventory", "/sent"]) {
      await page.goto(href);
      await expect(page.locator('[data-slot="frame"]').first()).toBeVisible();
      assertThinHead(await headGeometry(page));
    }
  });

  test("the thin-head check fails on the old large title", async () => {
    expect(() => assertThinHead({ fontPx: 24, headHeight: 32, gap: 88 })).toThrow(
      "page head is not one thin row",
    );
    expect(() => assertThinHead({ fontPx: 14, headHeight: 32, gap: 88 })).toThrow(
      "page head is not one thin row",
    );
    expect(() => assertThinHead({ fontPx: 14, headHeight: 32, gap: 64 })).not.toThrow();
  });

  test("the account menu is wide enough for one-line name and email, and the arrow keys reach the looks", async ({
    page,
  }) => {
    await page.goto("/inventory");
    await expect(page.locator('[data-slot="account-sign-in"][data-ready]')).toBeVisible();
    await page.getByRole("button", { name: "Tài khoản" }).click();
    const menu = page.getByRole("menu");
    await expect(menu).toBeVisible();
    expect((await menu.boundingBox())!.width).toBeGreaterThanOrEqual(256);
    await page.keyboard.press("ArrowDown");
    await expect(page.getByRole("menuitemradio", { name: "Sáng" })).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await expect(page.getByRole("menuitemradio", { name: "Tối" })).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator("html")).toHaveClass(/\bdark\b/);
    // Choosing a look keeps the menu open.
    await expect(menu).toBeVisible();
  });

  test("⌘B does not unfold the rail into names on a computer", async ({ page }) => {
    await page.goto("/inventory");
    const rail = page.locator('[data-slot="sidebar"]:not([data-mobile])').first();
    await expect(rail).toHaveAttribute("data-state", "collapsed");
    await page.locator("body").press("Meta+b");
    await page.locator("body").press("Control+b");
    await expect(rail).toHaveAttribute("data-state", "collapsed");
  });

  test("the head of a screen names the place open in the second column", async ({ page }) => {
    await page.goto("/inventory");
    await expect(page.locator("h1")).toHaveText(LABELS.Inventory.pref);
    await expect(page.locator('[data-slot="page-header-place"]')).toHaveText(ALL_LISTINGS);
    await column(page).getByRole("link", { name: STATUS_NAMES[1]! }).click();
    await expect(page.locator('[data-slot="page-header-place"]')).toHaveText(STATUS_NAMES[1]!);
    await page.goto("/");
    await expect(page.locator("h1")).toHaveText(LABELS.Today.pref);
    await expect(page.locator('[data-slot="page-header-place"]')).toHaveCount(0);
  });
});

test.describe("App Shell on a phone", () => {
  test.skip(({ viewport }) => (viewport?.width ?? 0) >= 768, "phone sizes only");

  for (const colorScheme of ["light", "dark"] as const) {
    test(
      `no column takes the screen and nothing scrolls sideways (${colorScheme})`,
      { tag: "@cho" },
      async ({ page }) => {
        await page.emulateMedia({ colorScheme });
        for (const s of SCREENS) {
          await page.goto(s.href);
          await expect(page.locator("h1")).toHaveText(s.title);
          await expect(column(page)).toBeHidden();
          await expect(rail(page)).toHaveCount(0);
          // The search is an icon button at the end of the top bar.
          const bar = (await page
            .locator('[data-slot="app-shell-top-bar"]')
            .first()
            .boundingBox())!;
          const search = (await page.locator('[data-slot="unit-jump"] button').boundingBox())!;
          expect(bar.x + bar.width - (search.x + search.width)).toBeLessThanOrEqual(12);
          expect(await noSideways(page)).toBeLessThanOrEqual(0);
          if (s.href === "/inventory" && page.viewportSize()?.width === 360)
            await shot(page, `inventory-360-${colorScheme}`);
        }
      },
    );
  }

  test(
    "the sheet holds the rail and the second column, and closes after a choice",
    { tag: "@cho" },
    async ({ page }) => {
      await page.goto("/inventory");
      await openSheet(page);
      const sheet = page.locator('[data-mobile="true"]');
      await expect(sheet.getByRole("link", { name: LABELS.Sent.pref, exact: true })).toBeVisible();
      // The account menu rides at the foot of the sheet's rail.
      await expect(sheet.getByRole("button", { name: "Tài khoản" })).toBeVisible();
      for (const name of SECOND_COLUMN["/inventory"]!) {
        await expect(sheet.getByRole("link", { name, exact: true }).first()).toBeVisible();
      }
      // The sheet slides in; shoot only once it lies wholly on screen, so the frame shows it open.
      const width = page.viewportSize()!.width;
      await expect
        .poll(async () => {
          try {
            assertSheetInView(await sheetBox(page), width);
            return "in view";
          } catch (e) {
            return (e as Error).message;
          }
        })
        .toBe("in view");
      if (width === 360) await shot(page, "sheet-360-light");
      await sheet.getByRole("link", { name: LABELS.Sent.pref, exact: true }).click();
      await expect(page.locator("h1")).toHaveText(LABELS.Sent.pref);
      await expect(sheet).toHaveCount(0);
      assertSheetClosed(await page.locator('[data-mobile="true"] a').count());
    },
  );

  test(
    "the in-view check fails on a closed sheet and on a sheet still off screen",
    { tag: "@cho" },
    async ({ page }) => {
      await page.goto("/inventory");
      const width = page.viewportSize()!.width;
      expect(() => assertSheetInView(null, width)).toThrow(
        "sheet frame does not show the open sheet",
      );
      expect(await sheetBox(page)).toBeNull();
      expect(() => assertSheetInView({ x: -288, width: 288 }, width)).toThrow(
        "sheet frame does not show the open sheet",
      );
    },
  );

  test("the sheet check fails while the sheet is still open", { tag: "@cho" }, async ({ page }) => {
    await page.goto("/inventory");
    await openSheet(page);
    const open = await page.locator('[data-mobile="true"] a').count();
    expect(() => assertSheetClosed(open)).toThrow("sheet stayed open after choosing");
  });
});
