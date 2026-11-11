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
import { open, runBreak, runMain, throttled, waitReady } from "../../../tools/e2e_templates/runner";

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
/** The slowed copy of the suite: the whole suite again at this CPU slowdown, on the 1440 size only. */
const SLOW_RATE = 4;
const SLOW_SIZE = "1440";
console.log(
  throttled ? `ham cpu: ${throttled}` : `ham cpu: ${SLOW_RATE} (ban cham, kho ${SLOW_SIZE})`,
);

/** Every screen's suite and the grid sample, at CPU slowdown `cpu` (0 = none). */
function suites(cpu: number): void {
  for (const screen of covered) {
    const base = { screen: screen.id, title: screen.title_text, cpu };
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

      if (screen.family === "grid") gridSuite(screen.id, screen.route, base);
    });
  }

  // The grid sample runs through the same suite as a registered grid screen, so the recipes are proven red-able and
  // the real-screen path is exercised before any real screen has a region (row 2 builds the first).
  test.describe("vung hieu-chuan", () => {
    test.describe.configure({ timeout: 90_000 });
    gridSuite("hieu-chuan", CALIBRATION_URL, { screen: "hieu-chuan", title: null, cpu });

    test("mo lai cung trang khong do lai ham cpu", async ({ page }) => {
      // When slowed, the rate stays on the page: a second open must not measure an already slowed page.
      const recipe = REGION.find((r) => r.id === "trong")!;
      const base = { screen: "hieu-chuan", title: null, cpu };
      await open(page, CALIBRATION_URL, recipe, base);
      await open(page, CALIBRATION_URL, recipe, base);
    });

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
}

suites(0);

// The slowed copy (AC-9): the same suite inside the one browser run, so grading never starts a second dev server in
// this checkout (Next refuses two). Skipped when E2E_CPU_THROTTLE already slows the whole run.
test.describe("cham", () => {
  test.skip(throttled > 0, "E2E_CPU_THROTTLE da ham ca luot");
  // eslint-disable-next-line no-empty-pattern -- Playwright needs a destructured first argument
  test.beforeEach(({}, info) => {
    test.skip(info.project.name !== SLOW_SIZE, `ban cham chi chay o kho ${SLOW_SIZE}`);
  });
  suites(SLOW_RATE);
});

/**
 * The region suite of one grid screen. The screen is classified once on a page of its own; every recipe and every
 * break then gets a fresh page, so no break's setup (init scripts, the clock) can leak into another case.
 */
function gridSuite(
  id: string,
  url: string,
  base: { screen: string; title: string | null; cpu: number },
): void {
  test.describe("vung", () => {
    let verdict: ReturnType<typeof classifyGrid> | null = null;
    test.beforeAll(async ({ browser }, info) => {
      if (base.cpu > 0 && info.project.name !== SLOW_SIZE) return;
      const probe = await browser.newPage({ baseURL: info.project.use.baseURL });
      try {
        await probe.goto(url);
        await waitReady(probe);
        verdict = classifyGrid(id, await readGrid(probe));
      } finally {
        await probe.close();
      }
    });
    const skipUnlessRegion = () => {
      if (verdict && !verdict.run) test.skip(true, verdict.skip);
    };
    for (const recipe of REGION) {
      test(`vung ${recipe.id}`, async ({ page }) => {
        skipUnlessRegion();
        await runMain(page, url, recipe, base);
      });
      for (const brk of recipe.breaks) {
        test(`pha vung ${recipe.id}: ${brk.name}`, async ({ page }) => {
          skipUnlessRegion();
          await runBreak(page, url, recipe, brk, base);
        });
      }
    }
  });
}
