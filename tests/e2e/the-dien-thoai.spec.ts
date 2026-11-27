// decision:no-sideways-scroll
// decision:wcag-aa
// Inventory as listing cards below 768 px (roadmap row 2b, _acceptance/bang-hang-the-dien-thoai): the threshold on both
// sides (E2), open a card and come back to the same place (E3), edge data at 360 (E8), roles and keyboard (E9), axe light
// and dark at 360 and 414. Each test sets its own viewport and runs once, in the 360 project. Every check throws a pinned
// message, so a break run names what broke.
import { mkdirSync } from "node:fs";
import { join } from "node:path";

import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

import { REGION } from "../../tools/e2e_templates/recipes";
import { runMain } from "../../tools/e2e_templates/runner";

import { regionReady } from "./phone-list";
import { chupAnh, themKieu } from "./sua-trang";

const AXE_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
const SHOTS = process.env.SHOTS_DIR;

/** The phone toolbar's buttons: «Lọc», grouping and the region's own action, «Lưu góc nhìn» (L1). */
const TOOLBAR_SLOTS = ["phone-filter-button", "group-toggle", "save-view"] as const;

test.beforeEach(() => {
  test.skip(test.info().project.name !== "360", "sets its own viewport; runs once");
});

const cards = (page: Page) => page.locator('[data-slot="phone-card"]');

async function openAt(page: Page, width: number, query = "", height = 800): Promise<void> {
  await page.setViewportSize({ width, height });
  await page.goto(`/inventory?role=ListAgent${query}`);
  // One region shown, holding one layout (G-1511-47): read early, the page can hold the region twice, both hidden.
  await regionReady(page);
  await page.waitForLoadState("networkidle");
}

/** How many cards sit wholly inside the first screen. */
const cardsInView = (page: Page) =>
  page.evaluate(
    () =>
      [...document.querySelectorAll('[data-slot="phone-card"]')].filter((c) => {
        const b = c.getBoundingClientRect();
        return b.top >= 0 && b.bottom <= window.innerHeight;
      }).length,
  );

test.describe("nguong (E2)", () => {
  for (const [width, phone] of [
    [360, true],
    [414, true],
    [767, true],
    [768, false],
    [1024, false],
    [1440, false],
  ] as const) {
    test(`${width} shows ${phone ? "cards" : "the table"}`, async ({ page }) => {
      await openAt(page, width);
      const tables = await page.locator("table").count();
      const n = await cards(page).count();
      if (phone && (tables > 0 || n === 0))
        throw new Error(`phone list at ${width}: table ${tables}, cards ${n}`);
      if (!phone && (tables === 0 || n > 0))
        throw new Error(`table at ${width}: table ${tables}, cards ${n}`);
      const sideways = await page.evaluate(
        () => document.scrollingElement!.scrollWidth > document.scrollingElement!.clientWidth,
      );
      if (sideways) throw new Error(`page scrolls sideways at ${width}`);
      if (phone) {
        const first = await cards(page).first().boundingBox();
        if (Math.round(first!.width) < width - 60)
          throw new Error(`phone list not full width at ${width}`);
        const min = width === 360 ? 6 : 7;
        if (width !== 767 && (await cardsInView(page)) < min)
          throw new Error(`fewer than ${min} units on the first screen at ${width}`);
        const bar = await page.locator('[data-slot="phone-toolbar"]').boundingBox();
        if (bar!.height > 60) throw new Error(`toolbar wraps at ${width}: ${bar!.height}px`);
        for (const slot of TOOLBAR_SLOTS)
          await expect(page.locator(`[data-slot="${slot}"]`)).toHaveAccessibleName(/.+/);
      } else {
        await expect(page.getByRole("button", { name: "Cột" }).first()).toBeVisible();
      }
    });
  }

  test("doi-kho: a filter, a sort and grouping survive crossing 768", async ({ page }) => {
    await openAt(page, 767, "&status=Active");
    const before = await cards(page).count();
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.locator("table").waitFor();
    const shown = await page.locator('[data-slot="region-footer-count"]').first().textContent();
    if (!shown?.startsWith(`${before} /`)) throw new Error(`filter lost crossing to 768: ${shown}`);
    await page.setViewportSize({ width: 767, height: 1024 });
    await cards(page).first().waitFor();
    if ((await cards(page).count()) !== before) throw new Error("filter lost crossing back to 767");
  });

  test("toolbar stays under the top bar after scrolling", async ({ page }) => {
    await openAt(page, 360);
    await page.mouse.wheel(0, 1200);
    await page.waitForTimeout(300);
    const top = (await page.locator('[data-slot="phone-toolbar"]').boundingBox())!.y;
    if (Math.round(top) !== 48) throw new Error(`toolbar not sticky: top ${top}`);
  });
});

test("mo-va-lui (E3): open a card far down, next, then back and close keep the place", async ({
  page,
}) => {
  await openAt(page, 360);
  await page.mouse.wheel(0, 1400);
  await page.waitForTimeout(300);
  const ids = await cards(page).evaluateAll((els) => els.map((e) => e.getAttribute("data-row-id")));
  const y0 = await page.evaluate(() => window.scrollY);
  if (y0 < 1000) throw new Error(`not scrolled far enough: ${y0}`);
  const target = await page.evaluate(() => {
    const el = [...document.querySelectorAll('[data-slot="phone-card"]')].find(
      (c) => c.getBoundingClientRect().top > 120,
    );
    return el?.getAttribute("data-row-id") ?? "";
  });
  for (const close of ["back", "button"] as const) {
    await page.locator(`[data-slot="phone-card"][data-row-id="${target}"]`).click();
    await expect(page).toHaveURL(new RegExp(`record=${target}`));
    await expect(page.getByRole("dialog")).toBeVisible();
    if (close === "back") {
      await page.getByRole("button", { name: "Sau" }).click();
      const next = ids[ids.indexOf(target) + 1];
      await expect(page).toHaveURL(new RegExp(`record=${next}`));
      await page.goBack();
      await page.goBack();
    } else {
      await page.getByRole("button", { name: "Đóng" }).click();
    }
    await expect(page.getByRole("dialog")).toBeHidden();
    const y1 = await page.evaluate(() => window.scrollY);
    if (Math.abs(y1 - y0) > 1)
      throw new Error(`scroll not kept after closing record (${close}): ${y0} → ${y1}`);
    const focused = await page.evaluate(() => document.activeElement?.getAttribute("data-row-id"));
    if (focused !== target)
      throw new Error(`focus not on the card after closing record (${close})`);
  }
});

test("du-lieu-bien (E8): long codes, big prices, rent and no price fit at 360", async ({
  page,
}) => {
  await openAt(page, 360, "&sample=edge");
  const edge = page.locator('[data-slot="phone-card"][data-row-id^="bien-"]');
  await expect(edge).toHaveCount(9);
  const problems = await edge.evaluateAll((els) =>
    els.flatMap((card) => {
      const box = card.getBoundingClientRect();
      const out: string[] = [];
      const code = card.querySelector('[data-slot="listing-card-unit"]') as HTMLElement | null;
      if (box.right > window.innerWidth + 0.5) out.push(`card overflows: ${code?.innerText}`);
      for (const el of card.querySelectorAll<HTMLElement>("*")) {
        const b = el.getBoundingClientRect();
        if (b.width > 0 && (b.right > box.right + 0.5 || b.left < box.left - 0.5))
          out.push(`card overflows: ${code?.innerText} (${el.dataset.slot ?? el.tagName})`);
      }
      return out;
    }),
  );
  if (problems.length > 0) throw new Error(problems.join("\n"));
  await expect(edge.first().locator('[data-slot="listing-card-unit"]')).toHaveText(
    "S1.01-2508APH2",
  );
  if (SHOTS) {
    mkdirSync(SHOTS, { recursive: true });
    await edge.first().scrollIntoViewIfNeeded();
    await chupAnh(page, { path: join(SHOTS, "E8-bien-360-sang.png") });
  }
});

// Row 1v (english-query-words, E8): the old switches ?mau=bien and ?vai= no longer do anything; the page reads as with
// no switch at all (control: ?sample=edge above adds the nine edge cards).
test("cong-tac-cu: ?mau=bien and ?vai= change nothing", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/inventory");
  await page.waitForLoadState("networkidle");
  const plain = await page.locator("main").innerText();
  await page.goto("/inventory?mau=bien&vai=BuyerAgent");
  await page.waitForLoadState("networkidle");
  await expect(page.locator('[data-row-id^="bien-"]'), "cong-tac-cu: mau con tac dung").toHaveCount(
    0,
  );
  expect(await page.locator("main").innerText(), "cong-tac-cu: trang khac trang tron").toBe(plain);
});

test.describe("vai (E9)", () => {
  // Every role the register lets into the inventory (`vao: null`, row 9b's signed table) reads the cards. Counted
  // only once the region has settled and shows cards: a count taken before the cards draw passes on nothing.
  for (const role of ["TeamLead", "ListAgent", "BuyerAgent", "CompanyAdmin"] as const) {
    test(`${role} reads cards and edits nothing on them`, async ({ page }) => {
      await page.setViewportSize({ width: 360, height: 800 });
      await page.goto(`/inventory?role=${role}`);
      await cards(page).first().waitFor();
      await page.waitForLoadState("networkidle");
      if ((await cards(page).count()) === 0) throw new Error(`no card for ${role}`);
      await expect(page.locator('[data-slot="page-state"][data-kind="forbidden"]')).toHaveCount(0);
      const controls = await page
        .locator('[data-slot="phone-list"] ul')
        .locator("input, select, textarea, button, [role=combobox]")
        .count();
      if (controls > 0) throw new Error(`edit control on a card for ${role}: ${controls}`);
      await expect(page.getByRole("button", { name: "Cột" })).toHaveCount(0);
      if (SHOTS && role === "CompanyAdmin") {
        mkdirSync(SHOTS, { recursive: true });
        await chupAnh(page, { path: join(SHOTS, "E9-quan-tri-360.png") });
      }
    });
  }

  test("CompanyAdmin at 1440 reads the same inventory as a table, no «not allowed»", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`/inventory?role=CompanyAdmin`);
    await page.locator('[data-slot="data-region"] table tbody tr').first().waitFor();
    await page.waitForLoadState("networkidle");
    await expect(page.locator('[data-slot="page-state"][data-kind="forbidden"]')).toHaveCount(0);
    if (SHOTS) {
      mkdirSync(SHOTS, { recursive: true });
      await chupAnh(page, { path: join(SHOTS, "E9-quan-tri-1440.png") });
    }
  });
});

test("tiep-can (E9): names, size, Tab order and Enter", async ({ page }) => {
  await openAt(page, 360);
  const first = cards(page).first();
  const code = (await first.locator('[data-slot="listing-card-unit"]').textContent()) ?? "";
  await expect(first).toHaveAccessibleName(new RegExp(`^${code} `));
  const h = (await first.boundingBox())!.height;
  if (h < 44) throw new Error(`card shorter than 44px: ${h}`);
  await page.locator('[data-slot="phone-toolbar"] [data-slot="save-view"]').focus();
  await page.keyboard.press("Tab");
  const id = await page.evaluate(() => document.activeElement?.getAttribute("data-row-id"));
  if (id !== (await first.getAttribute("data-row-id")))
    throw new Error("Tab does not reach the first card");
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog")).toBeVisible();
});

test.describe("axe (E9)", () => {
  for (const width of [360, 414])
    for (const colorScheme of ["light", "dark"] as const)
      test(`${width} ${colorScheme}`, async ({ page }) => {
        await page.emulateMedia({ colorScheme });
        await openAt(page, width, "", 896);
        await page.waitForTimeout(400);
        const { violations } = await new AxeBuilder({ page })
          .include('[data-slot="data-region"]')
          .withTags(AXE_TAGS)
          .analyze();
        expect(violations.map((v) => `axe ${width} ${colorScheme} ${v.id}`)).toEqual([]);
      });
});

/**
 * The toolbar's buttons are 44 px high themselves (owner, BH session 2026-11-27, «Duyệt cả sáu điểm», L5; this replaces
 * supervisor ruling G-1411-130's 36 px buttons in 44 px touch targets), the icon ones 44 wide; «Lọc» says its word; the
 * region's one action, «Lưu góc nhìn», stands in the toolbar itself, not behind «…» (L1, the «…» rule). Neighbours
 * touch without overlapping.
 */
async function checkTouchTargets(page: Page): Promise<void> {
  const boxes: { slot: string; x: number; y: number; w: number; h: number }[] = [];
  for (const slot of TOOLBAR_SLOTS) {
    const box = await page
      .locator(`[data-slot="phone-toolbar"] [data-slot="${slot}"]`)
      .evaluate((el) => {
        const r = el.getBoundingClientRect();
        return { x: r.left, y: r.top, w: r.width, h: r.height };
      });
    if (box.w < 44 || box.h < 44)
      throw new Error(`touch target under 44px: ${slot} ${box.w}×${box.h}`);
    boxes.push({ slot, ...box });
  }
  const bar = (await page.locator('[data-slot="phone-toolbar"]').boundingBox())!;
  if (bar.height > 60) throw new Error(`toolbar wraps: ${bar.height}px`);
  const filter = page.locator('[data-slot="phone-filter-button"]');
  if (!/^Lọc/.test((await filter.innerText()).trim())) throw new Error("«Lọc» shows no word");
  if ((await page.locator('[data-slot="phone-toolbar"] [data-slot="phone-more"]').count()) > 0)
    throw new Error("«…» holds the region's one action");
  for (let i = 1; i < boxes.length; i += 1)
    if (boxes[i]!.x < boxes[i - 1]!.x + boxes[i - 1]!.w - 0.5)
      throw new Error(`touch targets overlap: ${boxes[i - 1]!.slot} ${boxes[i]!.slot}`);
}

test.describe("vung-cham (BH 2026-11-27, L1 and L5)", () => {
  for (const width of [360, 414])
    test(`${width}: the toolbar's touch targets are 44 × 44 and take the tap at their edge`, async ({
      page,
    }) => {
      await openAt(page, width);
      await checkTouchTargets(page);
      // A tap at the button's corner opens the filter sheet: the whole 44 px is the button.
      await page.locator('[data-slot="phone-filter-button"]').click({ position: { x: 2, y: 2 } });
      await expect(page.getByRole("dialog", { name: "Lọc" })).toBeVisible();
    });

  test("break: a toolbar that runs to two lines is caught", async ({ page }) => {
    await openAt(page, 360);
    await themKieu(page, {
      content:
        '[data-slot="phone-toolbar"], [data-slot="phone-toolbar"] > div { flex-wrap: wrap !important; } [data-slot="phone-toolbar"] > div { width: 100% !important; } [data-slot="phone-actions"] { flex-basis: 100% !important; }',
    });
    // The break is in place before the check runs (a busy machine can measure the frame before the style lands).
    await expect
      .poll(
        async () => (await page.locator('[data-slot="phone-toolbar"]').boundingBox())?.height ?? 0,
      )
      .toBeGreaterThan(60);
    await expect(checkTouchTargets(page)).rejects.toThrow("toolbar wraps");
  });

  test("break: a toolbar button back at 36 px is caught", async ({ page }) => {
    await openAt(page, 360);
    await themKieu(page, {
      content: '[data-slot="phone-filter-button"] { height: 36px !important; }',
    });
    // The break is in place before the check runs (a busy machine can measure the frame before the style lands).
    await expect
      .poll(
        async () =>
          (await page.locator('[data-slot="phone-filter-button"]').boundingBox())?.height ?? 99,
      )
      .toBeLessThan(40);
    await expect(checkTouchTargets(page)).rejects.toThrow(
      "touch target under 44px: phone-filter-button",
    );
  });
});

/**
 * Supervisor ruling G-1411-12 (f): the shared register suite measures the inventory's cards below 768 px. Self-test:
 * the region cases that read rows run on a phone through the cards' branch — the filter sheet opens, the record opens
 * from a card — never on a table; on 1024 the same cases keep the table and never touch the sheet.
 */
test.describe("bo-bai-chung (G-1411-12 f)", () => {
  const traced = async (page: Page) =>
    page.addInitScript(() => {
      const w = window as unknown as { __sheet: number; __table: number };
      w.__sheet = 0;
      w.__table = 0;
      document.addEventListener(
        "click",
        (e) => {
          if ((e.target as Element).closest('[data-slot="phone-filter-button"]')) w.__sheet += 1;
        },
        true,
      );
      new MutationObserver(() => {
        if (document.querySelector('[data-slot="data-region"] table')) w.__table += 1;
      }).observe(document, { childList: true, subtree: true });
    });
  const counts = (page: Page) =>
    page.evaluate(() => {
      const w = window as unknown as { __sheet: number };
      return {
        sheet: w.__sheet,
        table: document.querySelectorAll('[data-slot="data-region"] table').length,
      };
    });

  for (const [width, phone] of [
    [360, true],
    [414, true],
    [1024, false],
  ] as const)
    for (const id of ["khong-khop", "loc-dau-cot", "chu-dai"])
      test(`${width}: ${id} reads ${phone ? "the cards" : "the table"}`, async ({ page }) => {
        await page.setViewportSize({ width, height: 800 });
        await traced(page);
        const recipe = REGION.find((r) => r.id === id)!;
        await runMain(page, "/inventory", recipe, { screen: "inventory", title: null });
        const seen = await counts(page);
        if (phone) {
          if (seen.table > 0) throw new Error(`${id} at ${width}: a table in the region`);
          if (id === "chu-dai") await expect(page).toHaveURL(/record=/);
          else if (seen.sheet === 0)
            throw new Error(`${id} at ${width}: the filter sheet never opened`);
        } else if (seen.sheet > 0 || seen.table === 0) {
          throw new Error(`${id} at ${width}: left the table branch`);
        }
      });
});
