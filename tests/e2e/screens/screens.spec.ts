// Register-driven state suite (roadmap row 1f, _acceptance/bo-bai-kiem-tu-so-man).
// Nobody writes tests for a screen here: every screen in design/screens.yaml gets its suite from the recipes in
// tools/e2e_templates. Each check has break cases that run the SAME check and need its pinned message.
// decision:state-matrix
// decision:wcag-aa
// decision:no-sideways-scroll
import { test } from "@playwright/test";

import {
  CALIBRATION_URL,
  FRAME,
  REGION,
  classifyGrid,
  readGrid,
} from "../../../tools/e2e_templates/recipes";
import { loadRegister, skipReason } from "../../../tools/e2e_templates/register";
import { runBreak, runMain, throttled, waitReady } from "../../../tools/e2e_templates/runner";

const register = loadRegister();

// Printed at load so a run (and `--list`) shows every screen left out and why, and the role × screen table.
for (const screen of register.screens) {
  const why = skipReason(screen);
  if (why) console.log(`bo qua: ${screen.id} — ${why}`);
}
const covered = register.screens.filter((s) => skipReason(s) === null);
console.log(`Vai × Màn: | Màn | ${register.roles.map((r) => r.label ?? r.name).join(" | ")} |`);
for (const screen of covered) {
  console.log(
    `Vai × Màn: | ${screen.id} | ${register.roles.map(() => "chờ bảng quyền").join(" | ")} |`,
  );
}
if (throttled) console.log(`ham cpu: ${throttled}`);

for (const screen of covered) {
  const base = { screen: screen.id, title: screen.title_text };
  test.describe(`man ${screen.id}`, () => {
    test.describe.configure({ timeout: 90_000 });

    for (const recipe of FRAME) {
      test(`khung ${recipe.id}`, async ({ page }) => {
        if (recipe.id === "axe-sang-toi") test.setTimeout(240_000);
        await runMain(page, screen.route, recipe, base);
      });
      for (const brk of recipe.breaks) {
        test(`pha khung ${recipe.id}: ${brk.name}`, async ({ page }) => {
          if (recipe.id === "axe-sang-toi") test.setTimeout(240_000);
          await runBreak(page, screen.route, recipe, brk, base);
        });
      }
    }

    if (screen.family === "grid") {
      test("vung", async ({ page }) => {
        test.setTimeout(600_000);
        await page.goto(screen.route);
        await waitReady(page);
        const verdict = classifyGrid(screen.id, await readGrid(page));
        test.skip(!verdict.run, verdict.run ? "" : verdict.skip);
        for (const recipe of REGION) {
          await runMain(page, screen.route, recipe, base);
          for (const brk of recipe.breaks) await runBreak(page, screen.route, recipe, brk, base);
        }
      });
    }
  });
}

// The grid sample: every region recipe and every break runs here each time, so the recipes are proven red-able
// before any real screen has a region.
test.describe("vung hieu-chuan", () => {
  test.describe.configure({ timeout: 90_000 });
  const base = { screen: "hieu-chuan", title: null };

  for (const recipe of REGION) {
    test(`vung ${recipe.id}`, async ({ page }) => {
      await runMain(page, CALIBRATION_URL, recipe, base);
    });
    for (const brk of recipe.breaks) {
      test(`pha vung ${recipe.id}: ${brk.name}`, async ({ page }) => {
        await runBreak(page, CALIBRATION_URL, recipe, brk, base);
      });
    }
  }

  test("ngoai khuon: bang khong qua vung dung chung thi do", async ({ page }) => {
    await page.goto(CALIBRATION_URL);
    await waitReady(page);
    await page
      .locator('[data-slot="data-region"]')
      .evaluate((el) => el.removeAttribute("data-slot"));
    let message = "";
    try {
      classifyGrid("hieu-chuan", await readGrid(page));
    } catch (err) {
      message = err instanceof Error ? err.message : String(err);
    }
    if (!message.includes("luoi dung ngoai khuon")) {
      throw new Error(`nhan dien vung khong do khi bang dung ngoai khuon (thay "${message}")`);
    }
  });
});
