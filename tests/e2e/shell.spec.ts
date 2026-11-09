import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("application shell", () => {
  test("has one main region and one page heading", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("main")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveCount(1);
  });

  test("has no serious accessibility violations", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toBeVisible();
    const { violations } = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    const serious = violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(serious.map((v) => v.id)).toEqual([]);
  });

  test("serves the prototype route for the design pass", async ({ page }) => {
    await page.goto("/proto/shell-check");
    await expect(page.locator("h1")).toHaveText("shell-check");
  });

  test("does not scroll sideways", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toBeVisible();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
});
