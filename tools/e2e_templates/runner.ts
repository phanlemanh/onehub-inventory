// The runner of the register-driven suite (roadmap row 1f): opens a page, waits until it is ready, then hands it to
// a recipe. Recipes never open pages, so every case waits for the same "ready" before it touches anything.
import { expect, type Page } from "@playwright/test";

import { pinned, pushedOut, SESSION_ID, type Break, type Ctx, type Recipe } from "./recipes";
import type { Mode } from "./register";

/** Skip reason of a screen that sent the browser to sign-in during the signed-out run (roadmap row 1r, AC-4). */
export const GIAO = "can dang nhap — do o luot co phien";

/** What a case did: measured the screen, or handed it to the signed-in run (signed-out run only). */
export type Outcome = "do" | "giao";

/** Base of a case: everything of the context but the page and the error list, plus the run it belongs to. */
export type Base = Omit<Ctx, "page" | "errors"> & { mode?: Mode };

/**
 * Follow a redirect the server decided after it began streaming the page: Next then writes
 * `<meta id="__next-page-redirect" http-equiv="refresh" content="1;url=…">` and the browser moves a moment later.
 * Waits until the address is the redirect's target; does nothing when the page carries no such redirect.
 */
export async function followRedirect(page: Page): Promise<void> {
  const content = await page.evaluate(
    () => document.getElementById("__next-page-redirect")?.getAttribute("content") ?? null,
  );
  const target = content?.match(/url=(.+)$/i)?.[1];
  if (!target) return;
  const path = new URL(target, page.url()).pathname;
  await page.waitForURL((u) => u.pathname === path, { timeout: 30_000 });
}

/** The page was sent to the sign-in page instead of the route it opened. */
export function sentToSignIn(page: Page, route: string): boolean {
  return new URL(page.url()).pathname === "/login" && route.split("?")[0] !== "/login";
}

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
export async function throttle(page: Page, wanted = 0): Promise<void> {
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
  base: Base,
  brk?: Break,
): Promise<Ctx> {
  await throttle(page, base.cpu);
  const ctx: Ctx = { screen: base.screen, title: base.title, cpu: base.cpu, page, errors: [] };
  page.on("pageerror", (err) => ctx.errors.push(err.message));
  page.on("console", (msg) => {
    if (msg.type() === "error") ctx.errors.push(msg.text());
  });
  if (recipe.clock) await page.clock.install();
  if (brk?.before) await brk.before(ctx);
  if (recipe.setup) await recipe.setup(ctx);
  await page.goto(`${url}${recipe.query ?? ""}`);
  await followRedirect(page);
  // A screen that sent the browser to sign-in is not measured, so there is nothing to wait for.
  if (!recipe.loading && !sentToSignIn(page, url)) await waitReady(page);
  return ctx;
}

/**
 * A screen sent the browser to sign-in. Signed-out run: hand it to the signed-in run, never measure the sign-in page
 * in its place. Signed-in run: red, with the session recipe's pinned message — except for the session recipe itself,
 * whose own check reads this.
 */
function handOver(ctx: Ctx, url: string, recipe: Recipe, base: Base): Outcome | null {
  if (recipe.id === SESSION_ID || !sentToSignIn(ctx.page, url)) return null;
  if (base.mode === "co-phien") throw new Error(pushedOut(ctx.screen));
  return "giao";
}

/** Main case: the check passes. Returns "giao" when the signed-out run hands the screen over. */
export async function runMain(
  page: Page,
  url: string,
  recipe: Recipe,
  base: Base,
): Promise<Outcome> {
  const ctx = await open(page, url, recipe, base);
  const handed = handOver(ctx, url, recipe, base);
  if (handed) return handed;
  await recipe.check(ctx);
  return "do";
}

/**
 * Break case: the SAME check throws the pinned message, in time when the break says so. Returns "giao" when the
 * signed-out run hands the screen over, and "mo" when the session recipe's break opens a screen that needs no session
 * (nothing to break there).
 */
export async function runBreak(
  page: Page,
  url: string,
  recipe: Recipe,
  brk: Break,
  base: Base,
): Promise<Outcome | "mo"> {
  const started = Date.now();
  const ctx = await open(page, url, recipe, base, brk);
  const handed = handOver(ctx, url, recipe, base);
  if (handed) return handed;
  if (recipe.id === SESSION_ID && !sentToSignIn(page, url)) return "mo";
  if (brk.apply) await brk.apply(ctx);
  let thrown: unknown = null;
  try {
    await recipe.check(ctx);
  } catch (err) {
    thrown = err;
  }
  if (thrown === null) throw new Error(`${recipe.id}: pha "${brk.name}" ma ham kiem van xanh`);
  const message = thrown instanceof Error ? thrown.message : String(thrown);
  expect(message, `${recipe.id}: pha "${brk.name}"`).toMatch(pinned(brk, ctx.screen));
  if (brk.withinMs !== undefined) {
    const took = Date.now() - started;
    expect(took, `${recipe.id}: pha "${brk.name}" phai do trong ${brk.withinMs}ms`).toBeLessThan(
      brk.withinMs,
    );
  }
  return "do";
}

export const throttled = THROTTLE > 1 ? THROTTLE : 0;
