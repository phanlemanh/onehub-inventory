// State recipes for the register-driven browser suite (roadmap row 1f, _acceptance/bo-bai-kiem-tu-so-man).
// A recipe is: how the runner opens the page (`query`, `clock`), ONE check, and the ways to break what the check
// measures. The main case runs the check; each break case runs the SAME check and needs it to throw its pinned
// message. A recipe never opens a page itself: the runner does, and waits until the page is ready first.
import AxeBuilder from "@axe-core/playwright";
import type { Page } from "@playwright/test";

export interface Ctx {
  page: Page;
  /** Screen id from the register, or "hieu-chuan" for the grid sample. */
  screen: string;
  /** Display name of the screen's title label (frame recipes). */
  title: string | null;
  /** CPU slowdown for this case (0 = none); E2E_CPU_THROTTLE overrides it for a whole run. */
  cpu?: number;
  /** Browser errors seen since the page was opened. */
  errors: string[];
}

export interface Break {
  name: string;
  /** The check must throw an error whose message matches this; a function gets the screen id (frame recipes). */
  message: RegExp | ((screen: string) => RegExp);
  /** Runs before the page opens (init scripts). */
  before?: (ctx: Ctx) => Promise<void>;
  /** Runs after the page is ready, before the check. */
  apply?: (ctx: Ctx) => Promise<void>;
  /** The check must throw within this many ms of the page opening (no hang). */
  withinMs?: number;
}

export interface Recipe {
  id: string;
  /** Name of the region state in design/states.md this recipe covers; absent for frame recipes and the filter case. */
  state?: string;
  /** Appended to the screen URL. */
  query?: string;
  /** Install Playwright's clock before opening. */
  clock?: boolean;
  /** Runs before the page opens, after a break's `before` (so it sees what the page asks, before a break changes it). */
  setup?: (ctx: Ctx) => Promise<void>;
  /** Region recipes open on a page that may still be loading; the runner then skips the region-ready wait. */
  loading?: boolean;
  check: (ctx: Ctx) => Promise<void>;
  breaks: Break[];
}

const AXE_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
const SHORT = 5_000;

/** A string as a literal inside a regular expression. */
export function escapeRe(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** The pinned message of a break for this screen. */
export function pinned(brk: Break, screen: string): RegExp {
  return typeof brk.message === "function" ? brk.message(screen) : brk.message;
}

function fail(message: string): never {
  throw new Error(message);
}

// ---- frame recipes: every built staff or public screen ----------------------------------------------------------

export const FRAME: Recipe[] = [
  {
    id: "tieu-de",
    async check({ page, screen, title }) {
      const texts = await page.locator("h1").allTextContents();
      if (texts.length !== 1 || texts[0]?.trim() !== title) {
        fail(`${screen}: tieu-de — mong "${title}", thay ${JSON.stringify(texts)}`);
      }
    },
    breaks: [
      {
        name: "doi chu h1",
        message: (id) => new RegExp(`^${escapeRe(id)}: tieu-de — `),
        apply: async ({ page }) => {
          await page
            .locator("h1")
            .first()
            .evaluate((el) => {
              el.textContent = "Tiêu đề sai";
            });
        },
      },
    ],
  },
  {
    id: "khong-cuon-ngang",
    async check({ page, screen }) {
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      if (overflow > 0) fail(`${screen}: cuon-ngang — trang rộng hơn màn ${overflow}px`);
    },
    breaks: [
      {
        name: "chen phan tu rong 2000px",
        message: (id) => new RegExp(`^${escapeRe(id)}: cuon-ngang — `),
        apply: async ({ page }) => {
          await page.evaluate(() => {
            const wide = document.createElement("div");
            wide.style.width = "2000px";
            wide.style.height = "1px";
            document.body.appendChild(wide);
          });
        },
      },
    ],
  },
  {
    id: "khong-loi-trinh-duyet",
    async check({ page, screen, errors }) {
      // Let a pending task surface its error before reading the list.
      await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 50)));
      if (errors.length > 0) fail(`${screen}: loi-trinh-duyet — ${errors.join(" | ")}`);
    },
    breaks: [
      {
        name: "nem loi tren trang",
        message: (id) => new RegExp(`^${escapeRe(id)}: loi-trinh-duyet — .*pha thu`),
        apply: async ({ page }) => {
          await page.evaluate(() => {
            setTimeout(() => {
              throw new Error("pha thu");
            }, 0);
          });
        },
      },
    ],
  },
  {
    id: "axe-sang-toi",
    async check({ page, screen }) {
      const found: string[] = [];
      let scans = 0;
      for (const colorScheme of ["light", "dark"] as const) {
        await page.emulateMedia({ colorScheme });
        const { violations } = await new AxeBuilder({ page })
          .withTags(AXE_TAGS)
          .exclude("nextjs-portal")
          .analyze();
        for (const v of violations) {
          if (v.impact === "serious" || v.impact === "critical")
            found.push(`${v.id} (${colorScheme})`);
        }
        scans += 1;
      }
      if (scans !== 2) fail(`${screen}: axe — chỉ quét ${scans} lượt`);
      if (found.length > 0) fail(`${screen}: axe ${found.join(", ")}`);
    },
    breaks: [
      {
        name: "chu trang tren nen trang",
        message: (id) => new RegExp(`^${escapeRe(id)}: axe .*color-contrast`),
        apply: async ({ page }) => {
          await page.addStyleTag({
            content:
              "h1 { color: rgb(250, 250, 250) !important; background: rgb(255, 255, 255) !important; transition: none !important; }",
          });
        },
      },
    ],
  },
];

// ---- session recipe: the signed-in run only (roadmap row 1r) ----------------------------------------------------

/** The id of the session recipe; the runner lets this one check read a screen it was sent away from. */
export const SESSION_ID = "phien-thu";

/** The pinned message when a screen sends the signed-in test person to the sign-in page. */
export function pushedOut(screen: string): string {
  return `${screen}: phien-thu — bi day ve dang nhap`;
}

/**
 * Runs only in the signed-in run: the screen opened with the test session stays on its own route. The break clears
 * the session cookie before the page opens, and the same check must name the screen. Kept apart from FRAME, so the
 * frame recipes and their breaks of row 1f stay as they were.
 */
export const SESSION: Recipe[] = [
  {
    id: SESSION_ID,
    async check({ page, screen }) {
      if (new URL(page.url()).pathname === "/login") fail(pushedOut(screen));
    },
    breaks: [
      {
        name: "xoa cookie phien",
        message: (id) => new RegExp(`^${escapeRe(pushedOut(id))}`),
        before: async ({ page }) => {
          await page.context().clearCookies();
        },
      },
    ],
  },
];

// ---- region recipes: grid screens with a data region, and the grid sample -------------------------------------

const region = (page: Page) => page.locator('[data-slot="data-region"]');
const bodyRows = (page: Page) => page.locator('[data-slot="data-region-body"] tbody tr');
const stateOf = (page: Page, kind: string) =>
  page.locator(`[data-slot="region-state"][data-kind="${kind}"]`);
/** Any search box inside the region: row 2e dropped it, so the region cases count these and want none. */
const searchBoxes = (page: Page) =>
  region(page).locator('[role="searchbox"], input[type="search"]');
/** The filter box under the first column's header (row 2e: a region filters by these, not by a search box). */
const firstFilter = (page: Page) =>
  region(page).locator('[data-slot="column-filter"] input').first();
/** The grid's own scroll viewport: rows scroll inside it in one continuous run (row 2, «đọc như Sheet»). */
const viewport = (page: Page) =>
  page.locator('[data-slot="data-region-body"] [data-slot="scroll-area-viewport"]').first();

/** Kinds whose shown text is the value a text filter reads (words, not numbers, dates or a select's label). */
const TEXT_KINDS = ["text", "person"];

/** How many data rows a person sees in the grid's viewport at the top of the run (not the extra rows mounted ahead). */
async function visibleRows(page: Page): Promise<number> {
  return viewport(page).evaluate((el) => {
    const box = el.getBoundingClientRect();
    return [...el.querySelectorAll("tbody tr")].filter((tr) => {
      if (!tr.querySelector('[data-slot="row-number"]')) return false;
      const r = tr.getBoundingClientRect();
      return r.bottom > box.top && r.top < box.bottom;
    }).length;
  });
}

/** Puts the mouse over the visible part of the grid's viewport, so the wheel scrolls the grid, not the page. */
async function pointAtGrid(page: Page): Promise<void> {
  const box = viewport(page);
  await box.scrollIntoViewIfNeeded();
  const b = await box.boundingBox();
  const size = page.viewportSize();
  if (!b || !size) return;
  const top = Math.max(b.y, 0);
  const bottom = Math.min(b.y + b.height, size.height);
  await page.mouse.move(b.x + b.width / 2, top + (bottom - top) / 2);
}

/** Scrolls the grid's run with the mouse wheel until `done` holds or the run ends. */
async function scrollUntil(page: Page, done: () => Promise<boolean>): Promise<void> {
  if (await done()) return;
  const box = viewport(page);
  if ((await box.count()) === 0) return;
  await pointAtGrid(page);
  let still = 0;
  for (let guard = 0; guard < 400 && still < 3; guard += 1) {
    const before = await box.evaluate((el) => el.scrollTop);
    await page.mouse.wheel(0, 400);
    await page.waitForTimeout(60);
    if (await done()) return;
    still = (await box.evaluate((el) => el.scrollTop)) === before ? still + 1 : 0;
  }
}

/**
 * The texts of the rows mounted now, with their row number; hidden rows are left out. The first text is the first
 * column's cell (the one the first filter box reads), then every text cell of the row.
 */
async function mountedRows(page: Page): Promise<[number, string[]][]> {
  return bodyRows(page).evaluateAll(
    (trs, kinds) =>
      trs
        .filter((tr) => getComputedStyle(tr).display !== "none")
        .map((tr): [number, string[]] => {
          const text = (cell: HTMLElement) => {
            const copy = cell.cloneNode(true) as HTMLElement;
            copy.querySelectorAll('[data-slot="cell-lock-reason"]').forEach((n) => n.remove());
            return (copy.textContent ?? "").trim();
          };
          const cells = [...tr.querySelectorAll<HTMLElement>('[data-slot="typed-cell"]')];
          // The first data cell after the row number: a typed cell, or the record's opener (Sent's recipient).
          const first = [...tr.querySelectorAll<HTMLElement>("td")].find(
            (td) => !td.querySelector('[data-slot="row-number"]'),
          );
          return [
            Number(tr.querySelector('[data-slot="row-number"]')?.textContent ?? "0"),
            [
              first ? text(first) : "",
              ...cells.filter((cell) => kinds.includes(cell.dataset["kind"] ?? "")).map(text),
            ],
          ];
        })
        .filter(([n]) => n > 0),
    TEXT_KINDS,
  );
}

/**
 * Every row's texts (first column first) in the one continuous run, read the way a person reads it: the mouse wheel scrolls the
 * grid's viewport from top to bottom while the virtual body mounts the rows in view. Back at the top afterwards.
 * Also returns how many rows a person sees in the viewport before any scrolling (the first window).
 */
async function allRowsWithWindow(page: Page): Promise<{ rows: string[][]; window: number }> {
  await bodyRows(page).first().waitFor({ state: "attached", timeout: SHORT });
  // Keyed by number AND texts: windows overlap (same row seen twice), but a row that is not in the data (an extra row
  // sharing a number) stays a row of its own.
  const seen = new Map<string, [number, string[]]>();
  const add = (n: number, texts: string[]) => seen.set(`${n}|${key(texts)}`, [n, texts]);
  const box = viewport(page);
  await box.evaluate((el) => (el.scrollTop = 0));
  const first = await mountedRows(page);
  for (const [n, texts] of first) add(n, texts);
  const window = await visibleRows(page);
  await pointAtGrid(page);
  let still = 0;
  for (let guard = 0; guard < 400 && still < 3; guard += 1) {
    const before = await box.evaluate((el) => el.scrollTop);
    await page.mouse.wheel(0, 400);
    await page.waitForTimeout(60);
    for (const [n, texts] of await mountedRows(page)) add(n, texts);
    const after = await box.evaluate((el) => el.scrollTop);
    still = after === before ? still + 1 : 0;
  }
  await box.evaluate((el) => (el.scrollTop = 0));
  const rows = [...seen.values()].sort(([a], [b]) => a - b).map(([, texts]) => texts);
  return { rows, window };
}

async function allRows(page: Page): Promise<string[][]> {
  return (await allRowsWithWindow(page)).rows;
}

const key = (row: string[]) => row.join(" ¦ ");
/** Rows a first window holds when the caller gives none (the calibration grid's old page size, kept for its needle). */
const PAGE_SIZE = 50;

/** Text as the grid's text filter compares it: lower case, Vietnamese marks off, «đ» as «d» (worked out here apart). */
export function foldForFilter(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .toLocaleLowerCase("vi");
}

/** True when a row's first column holds the needle the way the first filter box reads it. */
export const firstColumnHas = (row: string[], needle: string): boolean =>
  foldForFilter(row[0] ?? "").includes(foldForFilter(needle));

/**
 * A string from the first column whose matches lie beyond the first window before filtering AND fill more than one
 * window after it, so both "filters only the rows in view" and "keeps only the first window of results" show as dropped
 * rows. `pageSize` is the first window: the rows a person sees before any scrolling (row 2: continuous run, no pages).
 * `short`: the grid is under two windows (Sent's sample, row 2e), so no string can do that — then any string kept by two
 * rows or more and not by all of them, and the "first window" break cuts the results in half instead (see the recipe).
 */
export function pickNeedle(rows: string[][], pageSize = PAGE_SIZE, short = false): string | null {
  const seen = new Set<string>();
  for (const row of rows) {
    const first = row[0] ?? "";
    for (let len = 1; len <= first.length; len += 1) {
      for (let at = 0; at + len <= first.length; at += 1) {
        const needle = first.slice(at, at + len);
        if (!/\d/.test(needle) || seen.has(needle)) continue;
        seen.add(needle);
        const hits = rows.map((r, i) => (firstColumnHas(r, needle) ? i : -1)).filter((i) => i >= 0);
        if (short) {
          if (hits.length >= 2 && hits.length < rows.length) return needle;
          continue;
        }
        const pages = new Set(hits.map((i) => Math.floor(i / pageSize)));
        if (hits.length > pageSize && hits.length < rows.length && pages.size >= 2) return needle;
      }
    }
  }
  return null;
}

/** Compare two row lists as multisets; the message names the first row missing or extra. */
export function compareRows(expected: string[][], shown: string[][]): string | null {
  const count = new Map<string, number>();
  for (const r of expected) count.set(key(r), (count.get(key(r)) ?? 0) + 1);
  for (const r of shown) {
    const k = key(r);
    const n = count.get(k) ?? 0;
    if (n === 0) return `loc-dau-cot: hien dong khong khop — ${r[0] ?? k}`;
    count.set(k, n - 1);
  }
  for (const [k, n] of count)
    if (n > 0) return `loc-dau-cot: bo sot dong khop — ${k.split(" ¦ ")[0]}`;
  return null;
}

/**
 * The first column's filter box keeps exactly the rows whose first column holds the typed text, across the whole run
 * (row 2e: the case the region search box had, measured the same way on the filter under the first header).
 */
async function firstFilterCheck({ page }: Ctx): Promise<void> {
  const { rows: before, window } = await allRowsWithWindow(page);
  // A grid under two windows (Sent's 14 links) cannot hold matches past the first window that fill another one: then a
  // string kept by some rows and not all, and the first-window break cuts the results in half.
  const page1 = Math.max(1, window);
  const needle =
    pickNeedle(before, page1) ??
    (before.length < 2 * page1 ? pickNeedle(before, page1, true) : null);
  if (needle === null)
    fail(
      "loc-dau-cot: khong du du lieu de thu (can mot chuoi o cot dau khop nhieu hon mot khung cuon, nam ngoai khung dau)",
    );
  const expected = before.filter((r) => firstColumnHas(r, needle));
  await firstFilter(page).fill(needle);
  await page
    .waitForFunction(
      (n) =>
        document.querySelector('[data-slot="region-count"]')?.textContent?.startsWith(`${n} /`) ??
        false,
      expected.length,
      { timeout: SHORT },
    )
    .catch(() => undefined);
  const shown = await allRows(page);
  const problem = compareRows(expected, shown);
  if (problem) fail(problem);
  const count = await region(page).locator('[data-slot="region-count"]').textContent();
  if (!count?.startsWith(`${expected.length} /`)) {
    fail(`loc-dau-cot: so dong dau vung "${count}" khac ${expected.length}`);
  }
}

/** Matches a region while its first filter box holds text (the box shows its placeholder only when empty). */
const FILTERING =
  '[data-slot="data-region"]:has([data-slot="column-filter"] input:not(:placeholder-shown))';
/** The first filter box, as the page scripts of the breaks find it. */
const FIRST_FILTER_JS = `document.querySelector('[data-slot="data-region"] [data-slot="column-filter"] input')`;

/**
 * Break the filter result after typing: `fn` runs on every change of the page while the first filter box holds text.
 * It watches the whole document, because the grid replaces its body node when it switches density.
 */
async function onResult(page: Page, fn: string): Promise<void> {
  await page.evaluate((body) => {
    const run = new Function(body) as () => void;
    new MutationObserver(run).observe(document.body, { childList: true, subtree: true });
    document.addEventListener("input", () => setTimeout(run, 0), true);
  }, fn);
}

export const REGION: Recipe[] = [
  {
    id: "cho-tai",
    state: "Chờ tải",
    query: "?state=loading",
    clock: true,
    loading: true,
    setup: async ({ page }) => {
      // Note when the page arms a timer of about one second (the region's loading step, region-state.tsx).
      await page.addInitScript(() => {
        const original = window.setTimeout;
        window.setTimeout = ((fn: TimerHandler, ms?: number, ...rest: unknown[]) => {
          if (ms !== undefined && ms >= 900 && ms <= 1100) {
            (window as unknown as { __henGio1s?: boolean }).__henGio1s = true;
          }
          return original(fn, ms, ...rest);
        }) as typeof setTimeout;
      });
    },
    async check({ page }) {
      const skeleton = page.locator('[data-slot="region-skeleton"]');
      try {
        await skeleton.waitFor({ state: "attached", timeout: SHORT });
      } catch {
        fail("cho-tai: khung cho khong hien");
      }
      // The region arms its 1 s timer once hydrated; on a busy machine that is after the skeleton is attached. Wait,
      // in real time, until it is armed, so the fake clock never runs ahead of it.
      for (let waited = 0; ; waited += 100) {
        const armed = await page.evaluate(
          () => (window as unknown as { __henGio1s?: boolean }).__henGio1s === true,
        );
        if (armed) break;
        if (waited >= 15_000) fail("cho-tai: vung khong hen gio 1 giay");
        await page.waitForTimeout(100);
      }
      await page.clock.runFor(500);
      if ((await skeleton.evaluate((el) => getComputedStyle(el).visibility)) !== "hidden") {
        fail("cho-tai: hien chi bao truoc 1 giay");
      }
      await page.clock.runFor(600);
      if ((await skeleton.evaluate((el) => getComputedStyle(el).visibility)) !== "visible") {
        fail("cho-tai: khong co khung cho sau 1 giay");
      }
    },
    breaks: [
      {
        name: "khung cho khong bao gio hien",
        message: /cho-tai: khung cho khong hien/,
        withinMs: 15_000,
        before: async ({ page }) => {
          await page.addInitScript(() => {
            new MutationObserver(() => {
              document.querySelectorAll('[data-slot="region-skeleton"]').forEach((n) => n.remove());
            }).observe(document, { childList: true, subtree: true });
          });
        },
      },
      {
        name: "bo do tre cua dong ho vung",
        message: /cho-tai: hien chi bao truoc 1 giay/,
        before: async ({ page }) => {
          // Runs after the clock is installed, so it wraps the clock's timer: the region's 1 s step fires at once.
          await page.addInitScript(() => {
            const original = window.setTimeout;
            window.setTimeout = ((fn: TimerHandler, ms?: number, ...rest: unknown[]) =>
              original(
                fn,
                ms !== undefined && ms >= 900 && ms <= 1100 ? 0 : ms,
                ...rest,
              )) as typeof setTimeout;
          });
        },
      },
    ],
  },
  {
    id: "trong",
    state: "Trống",
    query: "?state=empty",
    async check({ page }) {
      const box = stateOf(page, "empty");
      if ((await box.count()) !== 1) fail("trong: khong co trang thai trong");
      if (!(await box.textContent())?.trim()) fail("trong: khong noi vi sao");
      if ((await box.getByRole("button").count()) === 0) fail("trong: khong co buoc tiep");
    },
    breaks: [
      {
        name: "go buoc tiep",
        message: /trong: khong co buoc tiep/,
        apply: async ({ page }) => {
          await stateOf(page, "empty")
            .getByRole("button")
            .evaluateAll((els) => els.forEach((el) => el.remove()));
        },
      },
    ],
  },
  {
    id: "khong-khop",
    state: "Không có dòng nào khớp",
    async check({ page }) {
      await firstFilter(page).fill("khong-co-dong-nao-zzz");
      const exit = region(page).getByRole("button", { name: "Xoá lọc" });
      try {
        await exit.waitFor({ timeout: SHORT });
      } catch {
        fail("khong-khop: thieu loi thoat Xoa loc");
      }
      await exit.click();
      if ((await firstFilter(page).inputValue()) !== "")
        fail("khong-khop: Xoa loc khong xoa o loc");
      if ((await bodyRows(page).count()) === 0) fail("khong-khop: Xoa loc khong tra lai dong");
    },
    breaks: [
      {
        name: "go nut Xoa loc",
        message: /khong-khop: thieu loi thoat Xoa loc/,
        before: async ({ page }) => {
          await page.addInitScript(() => {
            new MutationObserver(() => {
              document
                .querySelectorAll('[data-slot="data-region"] button')
                .forEach((b) => b.textContent?.includes("Xoá lọc") && b.remove());
            }).observe(document, { childList: true, subtree: true });
          });
        },
      },
    ],
  },
  {
    id: "loi",
    state: "Lỗi",
    query: "?state=error",
    async check({ page }) {
      const box = stateOf(page, "error");
      if ((await box.count()) !== 1) fail("loi: khong co trang thai loi");
      if ((await box.locator('[data-part="why"]').count()) !== 1) fail("loi: thieu ly do");
      if ((await box.locator('[data-part="next"]').count()) !== 1) fail("loi: thieu buoc tiep");
      const retry = box.getByRole("button", { name: "Thử lại" });
      if ((await retry.count()) !== 1) fail("loi: thieu nut Thu lai");
      await retry.click();
      try {
        await bodyRows(page).first().waitFor({ timeout: SHORT });
      } catch {
        fail("loi: Thu lai khong tai lai dong");
      }
    },
    breaks: [
      {
        name: "go ly do",
        message: /loi: thieu ly do/,
        apply: async ({ page }) => {
          await stateOf(page, "error")
            .locator('[data-part="why"]')
            .evaluate((el) => el.remove());
        },
      },
    ],
  },
  {
    id: "mot-phan-hong",
    state: "Một phần hỏng",
    query: "?state=partial",
    async check({ page }) {
      await bodyRows(page)
        .first()
        .waitFor({ timeout: SHORT })
        .catch(() => fail("mot-phan-hong: mat phan da tai"));
      const banner = stateOf(page, "partial");
      if ((await banner.count()) !== 1) fail("mot-phan-hong: khong bao phan hong");
      if ((await banner.getByRole("button", { name: "Thử lại" }).count()) !== 1) {
        fail("mot-phan-hong: thieu nut Thu lai");
      }
    },
    breaks: [
      {
        name: "go bang bao",
        message: /mot-phan-hong: khong bao phan hong/,
        apply: async ({ page }) => {
          await stateOf(page, "partial").evaluate((el) => el.remove());
        },
      },
    ],
  },
  {
    id: "chu-dai",
    state: "Chữ dài",
    async check({ page, screen }) {
      const width = page.viewportSize()?.width ?? 0;
      const fits = LONGEST_FITS[screen];
      if (fits?.sizes.includes(width)) {
        // The reverse check (row 7e): the longest text the company may enter is shown whole at this size. Then the
        // cells are narrowed so the keyboard and focus checks below still run on a cut cell.
        const cells = page.locator('[data-slot="truncated-text"]');
        await cells
          .first()
          .waitFor({ state: "attached", timeout: SHORT })
          .catch(() => undefined);
        await scrollUntil(page, async () =>
          (await cells.allTextContents()).some((t) => t.length === fits.max),
        );
        const seen = await cells.evaluateAll((els) =>
          els.map((el) => ({
            text: el.textContent ?? "",
            cut: el.getAttribute("data-cut") === "true" || el.scrollWidth > el.clientWidth,
          })),
        );
        const problem = longestProblem(screen, width, fits.max, seen);
        if (problem) fail(problem);
        await cells.evaluateAll((els) => {
          for (const el of els) (el as HTMLElement).style.maxWidth = "8ch";
        });
      }
      const cut = page.locator('[data-slot="truncated-text"][data-cut="true"]').first();
      // The grid marks a cell cut only after it has measured its width. Row 2: the run is virtual, so a long value
      // may sit below the first window — scroll the run until one is mounted.
      await scrollUntil(page, async () => (await cut.count()) > 0);
      await cut
        .waitFor({ state: "attached", timeout: SHORT })
        .catch(() => fail("chu-dai: khong co o chu dai bi cat"));
      if ((await cut.getAttribute("tabindex")) !== "0")
        fail("chu-dai: khong toi duoc bang ban phim");
      await page.keyboard.press("Tab");
      await cut.focus();
      const shown = await cut.evaluate((el) => ({
        wraps: getComputedStyle(el).whiteSpace !== "nowrap",
        fits: el.scrollWidth <= el.clientWidth,
        full: el.textContent,
        title: el.getAttribute("title"),
      }));
      if (!shown.wraps || !shown.fits || shown.full !== shown.title) {
        fail("chu-dai: khong doc du khi focus");
      }
    },
    breaks: [
      {
        name: "go tabindex",
        message: /chu-dai: khong toi duoc bang ban phim/,
        // Kept off on every re-render: the grid marks cut cells again once it has measured its width.
        before: async ({ page }) => {
          await page.addInitScript(() => {
            const strip = () =>
              document
                .querySelectorAll('[data-slot="truncated-text"][data-cut="true"][tabindex]')
                .forEach((el) => el.removeAttribute("tabindex"));
            new MutationObserver(strip).observe(document, {
              childList: true,
              subtree: true,
              attributes: true,
              attributeFilter: ["tabindex", "data-cut"],
            });
          });
        },
      },
    ],
  },
  {
    id: "khong-du-quyen",
    state: "Không đủ quyền",
    query: "?state=forbidden",
    async check({ page }) {
      if ((await stateOf(page, "forbidden").count()) !== 1) fail("khong-du-quyen: khong bao");
      if ((await bodyRows(page).count()) !== 0) fail("khong-du-quyen: lo dong");
      if ((await region(page).locator('[data-slot="region-count"]').count()) !== 0) {
        fail("khong-du-quyen: lo so dong");
      }
      if ((await searchBoxes(page).count()) !== 0) fail("khong-du-quyen: con o tim");
    },
    breaks: [
      {
        name: "chen so dong",
        message: /khong-du-quyen: lo so dong/,
        apply: async ({ page }) => {
          await region(page).evaluate((el) => {
            const count = document.createElement("span");
            count.dataset["slot"] = "region-count";
            count.textContent = "120 dòng";
            el.prepend(count);
          });
        },
      },
    ],
  },
  {
    id: "loc-dau-cot",
    async check(ctx) {
      await firstFilterCheck(ctx);
    },
    breaks: [
      {
        name: "go mot dong khop",
        message: /loc-dau-cot: bo sot dong khop — /,
        // A style rule, not a DOM edit: the grid re-renders after measuring its width and would put a removed row back.
        // Row 2: the run is virtual, so the rule names one result row (number 1) instead of the DOM's last row.
        apply: async ({ page }) => {
          await page.addStyleTag({
            content: `${FILTERING} tbody tr:has([data-row-number="1"]) { display: none !important; }`,
          });
        },
      },
      {
        // Row 2: equivalent of "only the first page of results" for a continuous run — the results cannot scroll past
        // the first window, so rows below it never mount.
        name: "chi con khung dau",
        message: /loc-dau-cot: bo sot dong khop — /,
        // Hides every result row numbered past the first window (the rows a person sees before any scrolling),
        // re-applied on every re-render: the results never reach past that window. When every result fits in that
        // window (a short grid, row 2e), the cut falls at half the results, so the results still stop short.
        apply: async ({ page }) => {
          const window = await visibleRows(page);
          await onResult(
            page,
            `const box = ${FIRST_FILTER_JS};
             if (!box || !box.value) return;
             const left = Number((document.querySelector('[data-slot="region-count"]')?.textContent ?? '').split(' /')[0]);
             const cut = left > 1 && left <= ${window} ? Math.floor(left / 2) : ${window};
             document.querySelectorAll('[data-slot="data-region-body"] tbody tr').forEach((tr) => {
               const n = Number(tr.querySelector('[data-slot="row-number"]')?.textContent ?? '0');
               if (n > cut) tr.style.display = 'none';
             });`,
          );
        },
      },
      {
        name: "them mot dong khong khop",
        message: /loc-dau-cot: hien dong khong khop — /,
        apply: async ({ page }) => {
          // Re-applied on every re-render, so the grid cannot drop the extra row.
          await onResult(
            page,
            `const box = ${FIRST_FILTER_JS};
             if (!box || !box.value || document.querySelector('tr[data-pha]')) return;
             const row = document.querySelector('[data-slot="data-region-body"] tbody tr:has([data-slot="row-number"])');
             if (!row) return;
             const extra = row.cloneNode(true);
             extra.setAttribute('data-pha', '1');
             extra.querySelectorAll('[data-slot="typed-cell"]').forEach((c) => { c.textContent = 'zz-khong-khop'; });
             row.parentNode.appendChild(extra);`,
          );
        },
      },
    ],
  },
  {
    // Row 2e (owner 2026-11-13): no region of the grid family has a search box, whatever it shows; searching is the
    // top bar's ⌘K box.
    id: "o-tim-vang",
    async check({ page }) {
      await region(page).first().waitFor({ state: "attached", timeout: SHORT });
      if ((await searchBoxes(page).count()) !== 0) fail("o-tim-vang: con o tim");
      if ((await region(page).getByPlaceholder("Gõ để tìm").count()) !== 0)
        fail("o-tim-vang: con o tim");
    },
    breaks: [
      {
        name: "chen o tim",
        message: /o-tim-vang: con o tim/,
        apply: async ({ page }) => {
          await region(page)
            .first()
            .evaluate((el) => {
              const box = document.createElement("input");
              box.type = "search";
              box.placeholder = "Gõ để tìm";
              el.prepend(box);
            });
        },
      },
    ],
  },
];

// ---- grid screens whose longest allowed text fits ---------------------------------------------------------------

/**
 * Grid screens and sizes where the longest text the company may enter still fits its cell, so «chữ dài» has no cut
 * cell to read. There the case measures the reverse: a cell with text of exactly `max` characters shows whole. When a
 * longer limit or a narrower column cuts it, the case goes red and the line must go: the normal case applies again.
 */
export const LONGEST_FITS: Record<string, { sizes: number[]; max: number; why: string }> = {
  "tuy-chinh-san": {
    sizes: [1440],
    max: 80,
    why: "«Căn chờ khớp»: mã sàn gõ tối đa 80 ký tự (db/migrations/010_lop_rieng_cua_san.sql)",
  },
};

/** What is wrong with the cells of a reverse «chữ dài» case, or null when the longest text shows whole. */
export function longestProblem(
  screen: string,
  width: number,
  max: number,
  cells: { text: string; cut: boolean }[],
): string | null {
  const longest = cells.filter((c) => c.text.length === max);
  if (longest.length === 0) return `chu-dai: ${screen} @${width} khong co chu ${max} ky tu de do`;
  if (longest.some((c) => c.cut))
    return `chu-dai: ${screen} @${width} chu ${max} ky tu bi cat — go dong LONGEST_FITS`;
  return null;
}

// ---- which grid screens may lack a region -----------------------------------------------------------------------

/** Grid screens allowed to have no data region yet, each with why. Remove a line when the screen builds its region. */
export const NO_REGION_YET: Record<string, string> = {};

export type GridVerdict = { run: true } | { run: false; skip: string };

/** What the region suite does with a grid screen, from what its page shows. Throws when the page breaks the rule. */
export function classifyGrid(
  id: string,
  page: { hasRegion: boolean; hasTable: boolean },
  allowed: Record<string, string> = NO_REGION_YET,
): GridVerdict {
  if (page.hasTable && !page.hasRegion) fail(`${id}: luoi dung ngoai khuon`);
  if (page.hasRegion) {
    if (id in allowed) fail(`${id}: da co vung, go khoi danh sach: ${id}`);
    return { run: true };
  }
  const why = allowed[id];
  if (why === undefined) fail(`chua co vung du lieu: ${id}`);
  return { run: false, skip: `chua co vung du lieu — ${why}` };
}

/** What the page shows, for classifyGrid. */
export async function readGrid(page: Page): Promise<{ hasRegion: boolean; hasTable: boolean }> {
  // A grid may render a moment after hydration: give it time before calling the page grid-less.
  await page
    .locator('[data-slot="data-region"], table, [role="grid"], [role="table"]')
    .first()
    .waitFor({ state: "attached", timeout: 10_000 })
    .catch(() => undefined);
  return {
    hasRegion: (await region(page).count()) > 0,
    hasTable:
      (await page.locator('table, [role="grid"], [role="table"]').count()) >
      (await region(page).locator('table, [role="grid"], [role="table"]').count()),
  };
}

/** The grid sample used as the calibration target while no real screen has a region (row 2 builds the first). */
export const CALIBRATION_URL = "/proto/luoi-va-o-theo-kieu";
