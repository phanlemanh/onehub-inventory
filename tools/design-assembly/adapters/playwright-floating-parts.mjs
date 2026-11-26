// The part of the browser adapter that runs inside the repository's own browser test of the
// floating parts: the screens that use an item of an outside source, each with its title, and the
// check of one screen, which opens the floating parts of the item there (floating-parts.mjs). The
// test runner places a test in the file that declares it, so the repository's test declares one
// per screen with the `test` given here. Only that test imports this file, so the gate, which never
// starts a browser, never loads the test runner.
import { createRequire } from "node:module";
import path from "node:path";
import { stdout } from "node:process";
import { fileURLToPath } from "node:url";

import { expect, test } from "@playwright/test";

import { checkScreen, floatingPlanOf } from "../floating-parts.mjs";
import { adapter } from "./playwright.mjs";

export { test };

// The repository: this file sits in tools/design-assembly/adapters/ of it.
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");

// Each screen to open, with the title of its test and what the check needs.
export function floatingScreens(root = ROOT) {
  const plan = floatingPlanOf(root);
  return plan.screens.map((screen) => ({
    title: `floating parts of ${screen.route} (${screen.id}), from ${screen.records.join(", ")}`,
    root,
    screen,
    plan,
  }));
}

// The check of one screen, in a test: every control of the screen, each on the screen loaded
// afresh. What was not opened, and why, is said beside the result.
export async function floatingCheck(page, { root, screen, plan }) {
  test.slow();
  const require = createRequire(path.join(root, "package.json"));
  const run =
    plan.checks.length > 0 ? (tab) => adapter.accessibility.run(tab, plan.checks, require) : null;
  await page.setViewportSize({ width: plan.width, height: 800 });
  const { problems, notes } = await checkScreen(page, screen, plan, { run });
  for (const note of [...notes, ...(plan.unchecked && !run ? [plan.unchecked] : [])]) {
    test.info().annotations.push({ type: "floating-parts", description: note });
    stdout.write(`floating-parts: ${note}\n`);
  }
  expect(
    problems,
    "floating-parts: each floating part an item opens has a name, the item's text goes through the repository's words table, and the repository's own accessibility check passes with the part open",
  ).toEqual([]);
}
