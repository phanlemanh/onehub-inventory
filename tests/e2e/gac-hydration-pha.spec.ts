// Break of the hydration guard (row 1u, AC-5): runs only with GAC_HYDRATION_PHA=1. It removes the loading skeleton
// from the server's HTML before React hydrates the page — what the cho-tai break did before row 1u — so React reports
// «Hydration failed» and the guard must turn the run red, naming this test.
import { expect, test } from "@playwright/test";

test.skip(
  process.env["GAC_HYDRATION_PHA"] !== "1",
  "break of the hydration guard; set GAC_HYDRATION_PHA=1",
);

test("gac-hydration pha", async ({ page }) => {
  await page.addInitScript(() => {
    new MutationObserver(() => {
      document.querySelectorAll('[data-slot="region-skeleton"]').forEach((n) => n.remove());
    }).observe(document, { childList: true, subtree: true });
  });
  const errors: string[] = [];
  page.on("pageerror", (err) => errors.push(err.message));
  await page.goto("/inventory?state=loading");
  await expect
    .poll(() => errors.some((m) => /Hydration failed/.test(m)), { timeout: 20_000 })
    .toBe(true);
  // Give the dev server the moment it needs to forward the browser's error to its output.
  await page.waitForTimeout(1_500);
});
