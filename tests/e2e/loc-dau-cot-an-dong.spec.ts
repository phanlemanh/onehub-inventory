// The first-column filter case (row 2e, signed record bo-bai-kiem-tu-so-man of row 1f) after #136 (ef8659bd, G-2811-100):
// its «chi con khung dau» break hid result rows with `display: none`, the virtual body measured them as nothing, the run
// shrank and grew back on every re-render and the page never settled — 46 s on GitHub at 1440, then past the 90 s limit.
// The break now hides with `visibility: hidden` and the check reads only the rows a person can see. This proves:
// - the measure is unchanged: one matching row hidden either way still turns the check red with its pinned message;
// - at 1440 with the CPU slowed 8 times the break's run grows back at most once, where the old way of hiding (written
//   here again, as the red case of the same count) makes it shrink and grow over and over.
import { expect, test, type Page } from "@playwright/test";

import { REGION, type Break } from "../../tools/e2e_templates/recipes";
import { runBreak, type Base } from "../../tools/e2e_templates/runner";
import { suaTrang, themKieu } from "./sua-trang";

const URL = "/inventory";
const BASE: Base = { screen: "inventory", title: null, cpu: 0, mode: "khong-phien" };
const RECIPE = REGION.find((r) => r.id === "loc-dau-cot")!;
const PINNED = /loc-dau-cot: bo sot dong khop — /;
/** The region while its first filter box holds text. */
const FILTERING =
  '[data-slot="data-region"]:has([data-slot="column-filter"] input:not(:placeholder-shown))';

// eslint-disable-next-line no-empty-pattern -- Playwright needs a destructured first argument
test.beforeEach(({}, info) => {
  test.skip(info.project.name !== "1440", "do o kho 1440");
});

for (const [how, rule] of [
  ["display none", "display: none"],
  ["visibility hidden", "visibility: hidden"],
] as const) {
  test(`one matching row hidden by ${how}: the check is red with its pinned message`, async ({
    page,
  }) => {
    const brk: Break = {
      name: `an mot dong khop (${how})`,
      message: PINNED,
      apply: async ({ page: p }) => {
        await themKieu(p, {
          content: `${FILTERING} tbody tr:has([data-row-number="1"]) { ${rule} !important; }`,
        });
      },
    };
    expect(await runBreak(page, URL, RECIPE, brk, BASE)).toBe("do");
  });
}

/** Records, on every frame, the height of the grid's run whenever it changes. */
async function recordRun(page: Page): Promise<void> {
  await page.evaluate(() => {
    const w = window as unknown as { __run: number[] };
    w.__run = [];
    const tick = () => {
      const el = document.querySelector(
        '[data-slot="data-region-body"] [data-slot="scroll-area-viewport"]',
      );
      const h = el?.scrollHeight ?? -1;
      if (w.__run[w.__run.length - 1] !== h) w.__run.push(h);
      requestAnimationFrame(tick);
    };
    tick();
  });
}

/** How many times the run grew back after it had shrunk while the filter was on (more than a row's height). */
function growsBack(run: readonly number[], row = 24): number {
  let grows = 0;
  let shrunk = false;
  for (let i = 1; i < run.length; i += 1) {
    const step = run[i]! - run[i - 1]!;
    if (step < -row) shrunk = true;
    else if (step > row && shrunk) {
      grows += 1;
      shrunk = false;
    }
  }
  return grows;
}

test.describe("at 1440 with the CPU slowed 8 times", () => {
  const SLOW: Base = { ...BASE, cpu: 8 };
  // A slowed page and a whole scroll of the run, twice: more than the default.
  test.setTimeout(120_000);

  /** Runs `brk` with the run's height recorded from the moment it applies; returns the outcome and the grow-backs. */
  async function measured(page: Page, brk: Break) {
    const wrapped: Break = {
      ...brk,
      apply: async (ctx) => {
        await recordRun(ctx.page);
        await brk.apply?.(ctx);
      },
    };
    const outcome = await runBreak(page, URL, RECIPE, wrapped, SLOW);
    const run = await page.evaluate(() => (window as unknown as { __run: number[] }).__run);
    return { outcome, grows: growsBack(run), run };
  }

  test("the «chi con khung dau» break is red and the run settles", async ({ page }) => {
    const brk = RECIPE.breaks.find((b) => b.name === "chi con khung dau")!;
    const { outcome, grows, run } = await measured(page, brk);
    expect(outcome).toBe("do");
    expect(grows, `the run grew back ${grows} times: ${run.join(" → ")}`).toBeLessThanOrEqual(1);
  });

  test("red case: hiding with display none makes the run grow back over and over", async ({
    page,
  }) => {
    // The old break: every result row numbered past the first window taken out of the layout, re-applied on every
    // change of the page.
    const old: Break = {
      name: "chi con khung dau (display none)",
      message: PINNED,
      apply: async ({ page: p }) => {
        await suaTrang(p, () => {
          const viewport = document.querySelector(
            '[data-slot="data-region-body"] [data-slot="scroll-area-viewport"]',
          )!;
          const box = viewport.getBoundingClientRect();
          const cut = [...viewport.querySelectorAll("tbody tr")].filter((tr) => {
            if (!tr.querySelector('[data-slot="row-number"]')) return false;
            const r = tr.getBoundingClientRect();
            return r.bottom > box.top && r.top < box.bottom;
          }).length;
          const run = () => {
            const input = document.querySelector<HTMLInputElement>(
              '[data-slot="data-region"] [data-slot="column-filter"] input',
            );
            if (!input?.value) return;
            document.querySelectorAll('[data-slot="data-region-body"] tbody tr').forEach((tr) => {
              const n = Number(tr.querySelector('[data-slot="row-number"]')?.textContent ?? "0");
              if (n > cut) (tr as HTMLElement).style.display = "none";
            });
          };
          new MutationObserver(run).observe(document.body, { childList: true, subtree: true });
          document.addEventListener("input", () => setTimeout(run, 0), true);
        });
      },
    };
    const { grows, run } = await measured(page, old);
    expect(grows, `the run grew back ${grows} times: ${run.join(" → ")}`).toBeGreaterThan(1);
  });
});
