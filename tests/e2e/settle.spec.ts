// The two shared waits, each with its two-way pair on the same page (roadmap row 1r, AC-5, AC-6): the real sheet and
// banner pass; a sheet that never stops moving, a removed sheet button and a banner that never shows each make the
// SAME function throw its pinned message. The sheet cases set a phone-sized screen themselves, so they run at every
// size and none is skipped.
import { openSheet, SETTLE_MS, SHEET, SHEET_BUTTON, shown } from "../../tools/e2e_templates/settle";
import { expect, test } from "../../tools/e2e_templates/fixture";
import { waitReady } from "../../tools/e2e_templates/runner";

const PROTO = "/proto/khung-va-giao-dien";
const PHONE = { width: 360, height: 800 };
const BANNER = "Mất kết nối mạng";

/** What the shared function threw, or null when it returned. */
async function thrown(run: Promise<void>): Promise<string | null> {
  try {
    await run;
    return null;
  } catch (err) {
    return err instanceof Error ? err.message : String(err);
  }
}

test.describe("cho ngan", () => {
  test.setTimeout(90_000);
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(PHONE);
    await page.goto(PROTO);
    await waitReady(page);
  });

  test("ngan mo", { tag: "@cho" }, async ({ page }) => {
    await openSheet(page);
    await expect(page.locator(SHEET).first()).toBeVisible({ timeout: 1 });
    const running = await page.evaluate(
      () => document.getAnimations().filter((a) => a.playState === "running").length,
    );
    expect(running).toBe(0);
  });

  test("ngan chua dung", { tag: "@cho" }, async ({ page }) => {
    await page.addStyleTag({
      content: `@keyframes cho-mai { from { opacity: 1 } to { opacity: 0.99 } }
        ${SHEET} { animation: cho-mai 1s linear infinite !important }`,
    });
    expect(await thrown(openSheet(page))).toBe("ngan chua dung");
  });

  test("ngan khong mo", { tag: "@cho" }, async ({ page }) => {
    await page
      .getByRole("button", { name: SHEET_BUTTON })
      .evaluateAll((els) => els.forEach((el) => el.remove()));
    expect(await thrown(openSheet(page))).toBe("ngan khong mo");
  });
});

test.describe("cho bang", () => {
  test.setTimeout(90_000);
  test.beforeEach(async ({ page }) => {
    await page.goto("/inventory");
    await waitReady(page);
  });

  test("bang hien", { tag: "@cho" }, async ({ page, context }) => {
    expect(SETTLE_MS).toBe(20_000);
    await context.setOffline(true);
    const banner = page.getByRole("alert").filter({ hasText: BANNER });
    await shown(banner, "bang mat mang");
    await expect(banner).toBeVisible({ timeout: 1 });
    await context.setOffline(false);
  });

  test("bang khong hien", { tag: "@cho" }, async ({ page }) => {
    const started = Date.now();
    const message = await thrown(
      shown(page.getByRole("alert").filter({ hasText: BANNER }), "bang mat mang"),
    );
    expect(message).toMatch(/^bang mat mang: khong hien/);
    expect(Date.now() - started).toBeLessThan(25_000);
  });
});
