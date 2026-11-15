// The one door through which a browser test changes the page (row 1u). Changing the DOM — a style, a class, a node, an
// attribute — or taking a screenshot (which hides the caret with an inline style on every input) before React has
// hydrated the page makes React report a hydration mismatch, and the hydration guard (gac-hydration.ts) turns the
// run red. Every such call goes through here, and waits first for the page to be hydrated; a static check
// (tests/sua-trang.test.ts) is red on any call that does not.
import type {
  Locator,
  LocatorScreenshotOptions,
  Page,
  PageScreenshotOptions,
} from "@playwright/test";

const TRAN_MS = 20_000;

/**
 * Wait until the page is hydrated: the root's `data-hydrated` mark (src/app/hydration-mark.tsx), no streamed part of
 * the page still waiting to be swapped in, every data region carrying its own mark (it draws one layout only from
 * then, src/components/candidate/data-region.tsx), and — when given — the element itself taken over by React (the
 * page's loading boundary hydrates after the root). Red after `timeout`, saying which of the four is missing.
 */
export async function pageReady(
  page: Page,
  opts: { el?: Locator; timeout?: number } = {},
): Promise<void> {
  const timeout = opts.timeout ?? TRAN_MS;
  const deadline = Date.now() + timeout;
  let last = { mark: false, pending: 0, regions: 0, el: true };
  while (Date.now() < deadline) {
    last = await page.evaluate(() => ({
      mark: document.documentElement.hasAttribute("data-hydrated"),
      pending: document.querySelectorAll('[hidden][id^="S:"]').length,
      regions: document.querySelectorAll('[data-slot="data-region"]:not([data-hydrated])').length,
      el: true,
    }));
    if (opts.el) {
      last.el = await opts.el
        .first()
        .evaluate((n) => Object.keys(n).some((k) => k.startsWith("__reactFiber")))
        .catch(() => false);
    }
    if (last.mark && last.pending === 0 && last.regions === 0 && last.el) return;
    await page.waitForTimeout(50);
  }
  throw new Error(
    `page not hydrated (trang chua gan xong) after ${timeout}ms: mark ${last.mark ? 1 : 0}, pending ${last.pending}, regions unmarked ${last.regions}, element ${last.el ? 1 : 0}`,
  );
}

type Target = Page | Locator;
const isPage = (t: Target): t is Page => typeof (t as Page).goto === "function";
const pageOf = (t: Target): Page => (isPage(t) ? t : t.page());

async function ready(t: Target): Promise<void> {
  await pageReady(pageOf(t), isPage(t) ? {} : { el: t });
}

/** `page.evaluate` / `locator.evaluate` that changes the page, once it is hydrated. */
export function suaTrang<R>(target: Page, fn: () => R | Promise<R>): Promise<R>;
export function suaTrang<R, A>(target: Page, fn: (arg: A) => R | Promise<R>, arg: A): Promise<R>;
export function suaTrang<R, E extends Element = HTMLElement>(
  target: Locator,
  fn: (el: E) => R | Promise<R>,
): Promise<R>;
export function suaTrang<R, A, E extends Element = HTMLElement>(
  target: Locator,
  fn: (el: E, arg: A) => R | Promise<R>,
  arg: A,
): Promise<R>;
export async function suaTrang(target: Target, fn: unknown, arg?: unknown): Promise<unknown> {
  await ready(target);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- forwards Playwright's overloads unchanged
  return (target as any).evaluate(fn, arg);
}

/** `locator.evaluateAll` that changes the page, once it is hydrated. */
export function suaCacPhanTu<R, E extends Element = HTMLElement>(
  target: Locator,
  fn: (els: E[]) => R | Promise<R>,
): Promise<R>;
export function suaCacPhanTu<R, A, E extends Element = HTMLElement>(
  target: Locator,
  fn: (els: E[], arg: A) => R | Promise<R>,
  arg: A,
): Promise<R>;
export async function suaCacPhanTu(target: Locator, fn: unknown, arg?: unknown): Promise<unknown> {
  await pageReady(target.page());
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- forwards Playwright's overloads unchanged
  return (target as any).evaluateAll(fn, arg);
}

/** `page.addStyleTag`, once the page is hydrated. */
export async function themKieu(page: Page, opts: Parameters<Page["addStyleTag"]>[0]) {
  await pageReady(page);
  return page.addStyleTag(opts);
}

/** `page.screenshot` / `locator.screenshot`, once the page is hydrated. */
export async function chupAnh(target: Target, opts?: PageScreenshotOptions): Promise<Buffer> {
  await ready(target);
  return isPage(target)
    ? target.screenshot(opts)
    : target.screenshot(opts as LocatorScreenshotOptions);
}
