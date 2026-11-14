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

const AXE_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
const SHOTS = process.env.SHOTS_DIR;

test.beforeEach(() => {
  test.skip(test.info().project.name !== "360", "sets its own viewport; runs once");
});

const cards = (page: Page) => page.locator('[data-slot="phone-card"]');

async function openAt(page: Page, width: number, query = "", height = 800): Promise<void> {
  await page.setViewportSize({ width, height });
  await page.goto(`/inventory?vai=ListAgent${query}`);
  await page.locator('[data-slot="data-region"]').waitFor();
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
        for (const slot of ["phone-filter-button", "group-toggle", "phone-more"])
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
    await expect(page).toHaveURL(new RegExp(`ho-so=${target}`));
    await expect(page.getByRole("dialog")).toBeVisible();
    if (close === "back") {
      await page.getByRole("button", { name: "Sau" }).click();
      const next = ids[ids.indexOf(target) + 1];
      await expect(page).toHaveURL(new RegExp(`ho-so=${next}`));
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
  await openAt(page, 360, "&mau=bien");
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
    await page.screenshot({ path: join(SHOTS, "E8-bien-360-sang.png") });
  }
});

test.describe("vai (E9)", () => {
  for (const role of ["TeamLead", "ListAgent", "BuyerAgent"] as const) {
    test(`${role} reads cards and edits nothing on them`, async ({ page }) => {
      await page.setViewportSize({ width: 360, height: 800 });
      await page.goto(`/inventory?vai=${role}`);
      await cards(page).first().waitFor();
      const controls = await page
        .locator('[data-slot="phone-list"] ul')
        .locator("input, select, textarea, button, [role=combobox]")
        .count();
      if (controls > 0) throw new Error(`edit control on a card for ${role}: ${controls}`);
      await expect(page.getByRole("button", { name: "Cột" })).toHaveCount(0);
    });
  }

  test("CompanyAdmin sees the region's forbidden sentence, no card", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto(`/inventory?vai=CompanyAdmin`);
    await page.locator('[data-slot="data-region"]').waitFor();
    await expect(cards(page)).toHaveCount(0);
  });
});

test("tiep-can (E9): names, size, Tab order and Enter", async ({ page }) => {
  await openAt(page, 360);
  const first = cards(page).first();
  const code = (await first.locator('[data-slot="listing-card-unit"]').textContent()) ?? "";
  await expect(first).toHaveAccessibleName(new RegExp(`^${code} `));
  const h = (await first.boundingBox())!.height;
  if (h < 44) throw new Error(`card shorter than 44px: ${h}`);
  await page.locator('[data-slot="phone-more"]').focus();
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
 * Supervisor ruling G-1411-130: the toolbar's icon buttons keep the supplier's 36 px, and each sits in a 44 × 44 touch
 * target that takes the tap — measured on the pressable box, not on the drawing; neighbours touch without overlapping.
 */
async function checkTouchTargets(page: Page): Promise<void> {
  const boxes: { slot: string; x: number; y: number; w: number; h: number }[] = [];
  for (const slot of ["phone-filter-button", "group-toggle", "phone-more"]) {
    const box = await page.locator(`[data-slot="${slot}"]`).evaluate((el) => {
      const t = el.closest('[data-slot="touch-target"]');
      const r = (t ?? el).getBoundingClientRect();
      return { x: r.left, y: r.top, w: r.width, h: r.height };
    });
    if (box.w < 44 || box.h < 44)
      throw new Error(`touch target under 44px: ${slot} ${box.w}×${box.h}`);
    boxes.push({ slot, ...box });
  }
  for (let i = 1; i < boxes.length; i += 1)
    if (boxes[i]!.x < boxes[i - 1]!.x + boxes[i - 1]!.w - 0.5)
      throw new Error(`touch targets overlap: ${boxes[i - 1]!.slot} ${boxes[i]!.slot}`);
}

test.describe("vung-cham (G-1411-130)", () => {
  for (const width of [360, 414])
    test(`${width}: the toolbar's touch targets are 44 × 44 and take the tap at their edge`, async ({
      page,
    }) => {
      await openAt(page, width);
      await checkTouchTargets(page);
      // A tap on the target's empty corner, outside the 36 px button, still opens the filter sheet.
      const target = page.locator(
        '[data-slot="touch-target"]:has([data-slot="phone-filter-button"])',
      );
      await target.click({ position: { x: 2, y: 2 } });
      await expect(page.getByRole("dialog", { name: "Lọc" })).toBeVisible();
    });

  test("break: a touch target shrunk to the button is caught", async ({ page }) => {
    await openAt(page, 360);
    await page.addStyleTag({
      content: '[data-slot="touch-target"] { width: 36px !important; height: 36px !important; }',
    });
    await expect(checkTouchTargets(page)).rejects.toThrow(
      "touch target under 44px: phone-filter-button",
    );
  });
});
