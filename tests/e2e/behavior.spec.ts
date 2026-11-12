// decision:record-panel
// decision:feedback-by-delay
// decision:undo-or-confirm
// decision:state-matrix
// decision:wcag-aa
// decision:no-sideways-scroll
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const PROTO = "/proto/hanh-vi-trong-luoi-khung";
const PHONE = new Set(["360", "414"]);

const region = (page: Page) => page.locator('[data-slot="data-region"]');
const bodyRows = (page: Page) => page.locator('[data-slot="data-region-body"] tbody tr');
const recordPanel = (page: Page) => page.locator('[data-slot="record-panel"]');
const openers = (page: Page) => page.locator("[data-record-open]");

async function openProto(page: Page, query = ""): Promise<void> {
  await page.goto(`${PROTO}${query}`);
  await expect(region(page).locator("h2")).toHaveText(/mẫu$/);
  // Wait for a streamed copy to be swapped in, so every check sees one region.
  await expect(page.locator('[hidden][id^="S:"]')).toHaveCount(0);
  await expect(
    region(page).locator('table[data-slot="data-grid-table"]:not([tabindex="0"])'),
  ).toHaveCount(0);
}

/** Opens the n-th row; retried because the first click may land before the page takes input. */
async function openRow(page: Page, n: number): Promise<void> {
  await expect(async () => {
    await openers(page).nth(n).click();
    await expect(recordPanel(page)).toBeVisible({ timeout: 1000 });
  }).toPass({ timeout: 15_000 });
}

async function seriousViolations(page: Page): Promise<string[]> {
  const { violations } = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .exclude("nextjs-portal")
    .analyze();
  return violations
    .filter((v) => v.impact === "serious" || v.impact === "critical")
    .map((v) => v.id);
}

/**
 * Waits until nothing on the page is moving: a dialog that is still fading in has see-through text, and axe would
 * measure that half-drawn colour instead of the real one.
 */
async function settled(page: Page): Promise<void> {
  await page.evaluate(() =>
    Promise.all(
      document
        .getAnimations()
        .filter((a) => a.effect?.getComputedTiming().iterations !== Infinity)
        .map((a) => a.finished.catch(() => undefined)),
    ),
  );
}

// ---- checks shared by a case and its break --------------------------------------------------------------------

async function assertFocusReturned(page: Page, id: string): Promise<void> {
  const focused = await page.evaluate(() =>
    document.activeElement?.getAttribute("data-record-open"),
  );
  if (focused !== id) throw new Error("focus not returned");
}

async function assertConfirmShown(page: Page, verb: string): Promise<void> {
  const dialog = page.getByRole("dialog");
  if ((await dialog.count()) !== 1) throw new Error("behavior not shown: confirm");
  if ((await dialog.getByRole("button", { name: verb }).count()) !== 1) {
    throw new Error("behavior not shown: confirm");
  }
}

async function assertNoDeadRetry(page: Page): Promise<void> {
  if ((await page.getByRole("button", { name: "Thử lại" }).count()) !== 0) {
    throw new Error("behavior not shown: error without retry");
  }
}

// ---- cases -----------------------------------------------------------------------------------------------------

test.describe("behavior", () => {
  test.setTimeout(90_000);

  test("record panel opens beside the grid and closes with Escape", async ({ page }, info) => {
    await openProto(page);
    await openRow(page, 1);
    await expect(page).toHaveURL(/ho-so=can-2/);
    const box = await recordPanel(page).boundingBox();
    const width = page.viewportSize()!.width;
    expect(box).not.toBeNull();
    if (PHONE.has(info.project.name)) {
      expect(Math.round(box!.width)).toBe(width);
    } else {
      expect(box!.width).toBeLessThan(width);
      expect(Math.round(box!.x + box!.width)).toBe(width);
    }
    await page.getByRole("button", { name: "Sau" }).click();
    await expect(page).toHaveURL(/ho-so=can-3/);
    await page.keyboard.press("Escape");
    await expect(recordPanel(page)).toHaveCount(0);
    await expect(page).not.toHaveURL(/ho-so=/);
    await expect(async () => assertFocusReturned(page, "can-3")).toPass({ timeout: 5000 });
  });

  test("focus check fails when focus is left elsewhere", async ({ page }) => {
    await openProto(page);
    await openRow(page, 0);
    await page.keyboard.press("Escape");
    await expect(recordPanel(page)).toHaveCount(0);
    await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    await expect(assertFocusReturned(page, "can-1")).rejects.toThrow("focus not returned");
  });

  test("opening the address opens the record", async ({ page }) => {
    await openProto(page, "?ho-so=can-4");
    await expect(recordPanel(page)).toBeVisible();
    await expect(recordPanel(page)).toHaveAttribute("data-record-id", "can-4");
  });

  test("next and previous keep the frame", async ({ page }) => {
    await openProto(page);
    await openRow(page, 0);
    const first = await recordPanel(page).boundingBox();
    await page.getByRole("button", { name: "Sau" }).click();
    await expect(recordPanel(page)).toHaveAttribute("data-record-id", "can-2");
    expect(await recordPanel(page).boundingBox()).toEqual(first);
    await page.keyboard.press("Escape");
    await expect(recordPanel(page)).toHaveCount(0);
    await page.getByRole("button", { name: "Lưới người" }).click();
    await expect(region(page).locator("h2")).toHaveText("Người mẫu");
    await openRow(page, 0);
    await expect(recordPanel(page)).toHaveAttribute("data-record-id", "nguoi-1");
    expect(await recordPanel(page).boundingBox()).toEqual(first);
  });

  test("loading has three steps by delay", async ({ page }) => {
    await page.clock.install();
    await page.goto(`${PROTO}?state=loading`);
    const skeleton = page.locator('[data-slot="region-skeleton"]');
    await skeleton.waitFor({ state: "attached" });
    await page.clock.runFor(500);
    await expect(skeleton).toHaveCSS("visibility", "hidden");
    await page.clock.runFor(600);
    await expect(skeleton).toHaveCSS("visibility", "visible");
    await expect(page.getByRole("searchbox")).toHaveCount(0);
    await expect(page.getByText("Vẫn đang tải")).toHaveCount(0);
    await page.clock.runFor(9000);
    await expect(page.getByText(/Vẫn đang tải/)).toBeVisible();
    await page.getByRole("button", { name: "Huỷ" }).click();
    await expect(bodyRows(page).first()).toBeVisible();
  });

  test("error without retry wiring shows no dead button", async ({ page }) => {
    await openProto(page, "?state=error-no-retry");
    await expect(
      region(page).locator('[data-slot="region-state"][data-kind="error"]'),
    ).toBeVisible();
    await assertNoDeadRetry(page);
    await expect(region(page).locator('[data-slot="region-count"]')).toHaveCount(0);
    await expect(page.getByRole("searchbox")).toHaveCount(0);
  });

  test("dead-retry check fails when a retry button is shown", async ({ page }) => {
    await openProto(page, "?state=error");
    await expect(page.getByRole("button", { name: "Thử lại" })).toBeVisible();
    await expect(assertNoDeadRetry(page)).rejects.toThrow(
      "behavior not shown: error without retry",
    );
  });

  test("confirm names the verb and cancel changes nothing", async ({ page }) => {
    await openProto(page);
    const firstCode = await openers(page).first().textContent();
    await expect(async () => {
      await page.getByRole("button", { name: "Gỡ căn đầu" }).click();
      await expect(page.getByRole("dialog")).toBeVisible({ timeout: 1000 });
    }).toPass({ timeout: 15_000 });
    await assertConfirmShown(page, "Gỡ căn");
    await page.getByRole("button", { name: "Thôi" }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(openers(page).first()).toHaveText(firstCode ?? "");
    await page.getByRole("button", { name: "Gỡ căn đầu" }).click();
    await page.getByRole("dialog").getByRole("button", { name: "Gỡ căn" }).click();
    await expect(openers(page).first()).not.toHaveText(firstCode ?? "");
  });

  test("confirm check fails when no dialog is shown", async ({ page }) => {
    await openProto(page);
    await expect(assertConfirmShown(page, "Gỡ căn")).rejects.toThrow("behavior not shown: confirm");
  });

  test("reversible change offers undo", async ({ page }) => {
    await openProto(page);
    const price = bodyRows(page).first().locator('[data-kind="money"]');
    const before = await price.textContent();
    await expect(async () => {
      await page.getByRole("button", { name: "Tăng giá căn đầu" }).click();
      await expect(page.getByRole("button", { name: "Hoàn tác" })).toBeVisible({ timeout: 1000 });
    }).toPass({ timeout: 15_000 });
    await expect(price).not.toHaveText(before ?? "");
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await page.getByRole("button", { name: "Hoàn tác" }).first().click();
    await expect(price).toHaveText(before ?? "");
  });

  test("the page never scrolls sideways", async ({ page }) => {
    await openProto(page);
    const overflow = () =>
      page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
    expect(await overflow()).toBeLessThanOrEqual(0);
    await openRow(page, 0);
    expect(await overflow()).toBeLessThanOrEqual(0);
  });

  test("no serious accessibility violations", async ({ page }) => {
    test.setTimeout(240_000);
    /** Written before the code: 5 scenes, each scanned in light and in dark. */
    const SCENES = ["closed", "panel", "confirm", "?state=error", "?state=loading"] as const;
    expect(SCENES).toHaveLength(5);
    let scans = 0;
    const found: Record<string, string[]> = {};
    for (const colorScheme of ["light", "dark"] as const) {
      await page.emulateMedia({ colorScheme });
      for (const scene of SCENES) {
        await openProto(page, scene.startsWith("?") ? scene : "");
        if (scene === "panel") await openRow(page, 0);
        if (scene === "confirm") {
          await expect(async () => {
            await page.getByRole("button", { name: "Gỡ căn đầu" }).click();
            await expect(page.getByRole("dialog")).toBeVisible({ timeout: 1000 });
          }).toPass({ timeout: 15_000 });
        }
        if (scene === "?state=loading") {
          await expect(page.locator('[data-slot="region-skeleton"]')).toHaveCSS(
            "visibility",
            "visible",
          );
        }
        await settled(page);
        const ids = await seriousViolations(page);
        if (ids.length > 0) found[`${colorScheme} ${scene}`] = ids;
        scans += 1;
      }
    }
    expect(found).toEqual({});
    expect(scans).toBe(10);
  });

  test("accessibility check fails on unreadable text in the record panel", async ({ page }) => {
    await openProto(page);
    await openRow(page, 0);
    const title = recordPanel(page).locator("h2");
    await expect(async () => {
      await title.evaluate((el) => {
        el.style.transition = "none";
        el.style.backgroundColor = "rgb(255, 255, 255)";
        el.style.color = "rgb(250, 250, 250)";
      });
      await expect(title).toHaveCSS("color", "rgb(250, 250, 250)", { timeout: 500 });
    }).toPass({ timeout: 10_000 });
    expect(await seriousViolations(page)).toContain("color-contrast");
  });
});
