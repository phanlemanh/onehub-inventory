// The browser adapter for Playwright: the browser the repository tests its pages with, and the
// package whose presence says its browser checks include accessibility.
export const adapter = {
  id: "playwright",
  kind: "browser",
  names: ["playwright", "@playwright/test", "@axe-core/playwright", "chromium"],
  accessibilityPackage: "@axe-core/playwright",
  // One role's way in, as the browser test by role enters it: a file of the repository that gives,
  // for each role of its domain model, a function that is given the page and makes the browser that
  // role and no other, or does nothing where the application has no sign-in. The repository writes
  // it and keeps it; this plugin never writes sign-in code.
  door: {
    file: "tests/e2e/roles.ts",
    name: "DOORS",
    shape: "export const DOORS: Record<string, (page: Page) => Promise<void>>, one entry per role",
  },
  // A browser from the repository's own packages: `require` resolves from the repository.
  launch: (require) => require("@playwright/test").chromium.launch(),
  // Whether the repository has it, without starting it.
  installed: (require) => {
    try {
      require.resolve("@playwright/test");
      return true;
    } catch {
      return false;
    }
  },
};
