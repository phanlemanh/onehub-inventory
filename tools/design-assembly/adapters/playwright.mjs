// The browser adapter for Playwright: the browser the repository tests its pages with, and the
// package whose presence says its browser checks include accessibility.
export const adapter = {
  id: "playwright",
  kind: "browser",
  names: ["playwright", "@playwright/test", "@axe-core/playwright", "chromium"],
  accessibilityPackage: "@axe-core/playwright",
  // A browser from the repository's own packages: `require` resolves from the repository.
  launch: (require) => require("@playwright/test").chromium.launch(),
};
