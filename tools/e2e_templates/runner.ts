// The runner of the register-driven suite (roadmap row 1f): opens a page, waits until it is ready, then hands it to
// a recipe. Recipes never open pages, so every case waits for the same "ready" before it touches anything.
import { expect, type Page } from "@playwright/test";

import type { Break, Ctx, Recipe } from "./recipes";

const THROTTLE = Number(process.env["E2E_CPU_THROTTLE"] ?? "0");
const MIN_SLOWDOWN = 2.5;

/** Time a fixed piece of work inside the page, in ms. */
async function busyMs(page: Page): Promise<number> {
  return page.evaluate(() => {
    const t0 = performance.now();
    let x = 0;
    for (let i = 0; i < 3_000_000; i += 1) x = (x + Math.sqrt(i)) % 1000;
    return performance.now() - t0 + (x > 1e9 ? 1 : 0);
  });
}

/** Pages already slowed: the rate stays on a page across navigations, so measure and set it once per page. */
const slowed = new WeakSet<Page>();

/** Slow this page's CPU by `rate` (E2E_CPU_THROTTLE wins when set) and prove it is really slower. */
async function throttle(page: Page, wanted = 0): Promise<void> {
  const rate = THROTTLE > 1 ? THROTTLE : wanted;
  if (!(rate > 1) || slowed.has(page)) return;
  slowed.add(page);
  await page.goto("about:blank");
  const before = Math.min(await busyMs(page), await busyMs(page));
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate });
  const after = Math.min(await busyMs(page), await busyMs(page));
  if (after / before < MIN_SLOWDOWN) {
    throw new Error(`ham cpu khong co tac dung — ${before.toFixed(1)}ms → ${after.toFixed(1)}ms`);
  }
}

/** Wait until the streamed page is swapped in and React has hydrated it, so a click does something. */
export async function waitReady(page: Page): Promise<void> {
  await expect(page.locator('[hidden][id^="S:"]')).toHaveCount(0, { timeout: 30_000 });
  await page.waitForFunction(
    () => {
      const el =
        document.querySelector('[data-slot="data-region"]') ??
        document.querySelector("main") ??
        document.querySelector("h1");
      return el !== null && Object.keys(el).some((k) => k.startsWith("__reactFiber"));
    },
    undefined,
    { timeout: 30_000 },
  );
}

/** Open `url` for `recipe`, applying a break's setup first when given, and return the context. */
export async function open(
  page: Page,
  url: string,
  recipe: Recipe,
  base: Omit<Ctx, "page" | "errors">,
  brk?: Break,
): Promise<Ctx> {
  await throttle(page, base.cpu);
  const ctx: Ctx = { ...base, page, errors: [] };
  page.on("pageerror", (err) => ctx.errors.push(err.message));
  page.on("console", (msg) => {
    if (msg.type() === "error") ctx.errors.push(msg.text());
  });
  if (recipe.clock) await page.clock.install();
  if (brk?.before) await brk.before(ctx);
  await page.goto(`${url}${recipe.query ?? ""}`);
  if (!recipe.loading) await waitReady(page);
  return ctx;
}

/** Main case: the check passes. */
export async function runMain(
  page: Page,
  url: string,
  recipe: Recipe,
  base: Omit<Ctx, "page" | "errors">,
) {
  const ctx = await open(page, url, recipe, base);
  await recipe.check(ctx);
}

/** Break case: the SAME check throws the pinned message, in time when the break says so. */
export async function runBreak(
  page: Page,
  url: string,
  recipe: Recipe,
  brk: Break,
  base: Omit<Ctx, "page" | "errors">,
) {
  const started = Date.now();
  const ctx = await open(page, url, recipe, base, brk);
  if (brk.apply) await brk.apply(ctx);
  let thrown: unknown = null;
  try {
    await recipe.check(ctx);
  } catch (err) {
    thrown = err;
  }
  if (thrown === null) throw new Error(`${recipe.id}: pha "${brk.name}" ma ham kiem van xanh`);
  const message = thrown instanceof Error ? thrown.message : String(thrown);
  expect(message, `${recipe.id}: pha "${brk.name}"`).toMatch(brk.message);
  if (brk.withinMs !== undefined) {
    const took = Date.now() - started;
    expect(took, `${recipe.id}: pha "${brk.name}" phai do trong ${brk.withinMs}ms`).toBeLessThan(
      brk.withinMs,
    );
  }
}

export const throttled = THROTTLE > 1 ? THROTTLE : 0;
