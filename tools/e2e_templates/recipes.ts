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
  /** Name of the region state in design/states.md this recipe covers; absent for frame recipes and search. */
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

// ---- region recipes: grid screens with a data region, and the grid sample -------------------------------------

const region = (page: Page) => page.locator('[data-slot="data-region"]');
const bodyRows = (page: Page) => page.locator('[data-slot="data-region-body"] tbody tr');
const stateOf = (page: Page, kind: string) =>
  page.locator(`[data-slot="region-state"][data-kind="${kind}"]`);
const search = (page: Page) => region(page).getByRole("searchbox");
/** The grid's own scroll viewport: rows scroll inside it in one continuous run (row 2, «đọc như Sheet»). */
const viewport = (page: Page) =>
  page.locator('[data-slot="data-region-body"] [data-slot="scroll-area-viewport"]').first();

/** Kinds whose shown text is the searched value (column-kind.ts SEARCHABLE_KINDS, without `select`, which shows a label). */
const TEXT_KINDS = ["text", "person"];

/** The texts of the rows mounted now, keyed by their row number; hidden rows are left out. */
async function mountedRows(page: Page): Promise<[number, string[]][]> {
  return bodyRows(page).evaluateAll(
    (trs, kinds) =>
      trs
        .filter((tr) => getComputedStyle(tr).display !== "none")
        .map((tr): [number, string[]] => [
          Number(tr.querySelector('[data-slot="row-number"]')?.textContent ?? "0"),
          [...tr.querySelectorAll<HTMLElement>('[data-slot="typed-cell"]')]
            .filter((cell) => kinds.includes(cell.dataset["kind"] ?? ""))
            .map((cell) => {
              const copy = cell.cloneNode(true) as HTMLElement;
              copy.querySelectorAll('[data-slot="cell-lock-reason"]').forEach((n) => n.remove());
              return (copy.textContent ?? "").trim();
            }),
        ])
        .filter(([n]) => n > 0),
    TEXT_KINDS,
  );
}

/**
 * Every row's searchable texts in the one continuous run, read the way a person reads it: the mouse wheel scrolls the
 * grid's viewport from top to bottom while the virtual body mounts the rows in view. Back at the top afterwards.
 * Also returns how many rows were mounted before any scrolling (the first window).
 */
async function allRowsWithWindow(page: Page): Promise<{ rows: string[][]; window: number }> {
  await bodyRows(page).first().waitFor({ timeout: SHORT });
  const seen = new Map<number, string[]>();
  const box = viewport(page);
  await box.evaluate((el) => (el.scrollTop = 0));
  const first = await mountedRows(page);
  for (const [n, texts] of first) seen.set(n, texts);
  const bounds = await box.boundingBox();
  if (bounds) await page.mouse.move(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
  let still = 0;
  for (let guard = 0; guard < 400 && still < 3; guard += 1) {
    const before = await box.evaluate((el) => el.scrollTop);
    await page.mouse.wheel(0, 400);
    await page.waitForTimeout(60);
    for (const [n, texts] of await mountedRows(page)) seen.set(n, texts);
    const after = await box.evaluate((el) => el.scrollTop);
    still = after === before ? still + 1 : 0;
  }
  await box.evaluate((el) => (el.scrollTop = 0));
  const rows = [...seen.entries()].sort(([a], [b]) => a - b).map(([, texts]) => texts);
  return { rows, window: first.length };
}

async function allRows(page: Page): Promise<string[][]> {
  return (await allRowsWithWindow(page)).rows;
}

const key = (row: string[]) => row.join(" ¦ ");
/** Rows a first window holds when the caller gives none (the calibration grid's old page size, kept for its needle). */
const PAGE_SIZE = 50;

/**
 * A search string from the data whose matches lie beyond the first window before the search AND fill more than one window
 * after it, so both "filters only the rows in view" and "keeps only the first window of results" show as dropped rows.
 * `pageSize` is the first window: the rows the grid mounts before any scrolling (row 2: continuous run, no pages).
 */
export function pickNeedle(rows: string[][], pageSize = PAGE_SIZE): string | null {
  const seen = new Set<string>();
  for (const row of rows) {
    const first = row[0] ?? "";
    for (let len = 1; len <= first.length; len += 1) {
      for (let at = 0; at + len <= first.length; at += 1) {
        const needle = first.slice(at, at + len);
        if (!/\d/.test(needle) || seen.has(needle)) continue;
        seen.add(needle);
        const lower = needle.toLocaleLowerCase("vi");
        const hits = rows
          .map((r, i) => (r.some((t) => t.toLocaleLowerCase("vi").includes(lower)) ? i : -1))
          .filter((i) => i >= 0);
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
    if (n === 0) return `tim: hien dong khong khop — ${r[0] ?? k}`;
    count.set(k, n - 1);
  }
  for (const [k, n] of count) if (n > 0) return `tim: bo sot dong khop — ${k.split(" ¦ ")[0]}`;
  return null;
}

async function searchCheck({ page }: Ctx): Promise<void> {
  const { rows: before, window } = await allRowsWithWindow(page);
  const needle = pickNeedle(before, Math.max(1, window));
  if (needle === null)
    fail(
      "tim: khong du du lieu de thu (can mot chuoi khop nhieu hon mot khung cuon, nam ngoai khung dau)",
    );
  const lower = needle.toLocaleLowerCase("vi");
  const expected = before.filter((r) => r.some((t) => t.toLocaleLowerCase("vi").includes(lower)));
  await search(page).fill(needle);
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
    fail(`tim: so dong dau vung "${count}" khac ${expected.length}`);
  }
}

/** Matches a region while its search box holds a query (the box shows its placeholder only when empty). */
const SEARCHING = '[data-slot="data-region"]:has(input[type="search"]:not(:placeholder-shown))';

/**
 * Break the search result after typing: `fn` runs on every change of the page while the search box holds a query.
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
    id: "tim-khong-ra",
    state: "Tìm không ra",
    async check({ page }) {
      await search(page).fill("khong-co-dong-nao-zzz");
      const exit = region(page).getByRole("button", { name: "Xoá lọc" });
      try {
        await exit.waitFor({ timeout: SHORT });
      } catch {
        fail("tim-khong-ra: thieu loi thoat Xoa loc");
      }
      await exit.click();
      if ((await search(page).inputValue()) !== "") fail("tim-khong-ra: Xoa loc khong xoa o tim");
      if ((await bodyRows(page).count()) === 0) fail("tim-khong-ra: Xoa loc khong tra lai dong");
    },
    breaks: [
      {
        name: "go nut Xoa loc",
        message: /tim-khong-ra: thieu loi thoat Xoa loc/,
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
    async check({ page }) {
      const cut = page.locator('[data-slot="truncated-text"][data-cut="true"]').first();
      // The grid marks a cell cut only after it has measured its width.
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
      if ((await search(page).count()) !== 0) fail("khong-du-quyen: con o tim");
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
    id: "tim",
    async check(ctx) {
      await searchCheck(ctx);
    },
    breaks: [
      {
        name: "go mot dong khop",
        message: /tim: bo sot dong khop — /,
        // A style rule, not a DOM edit: the grid re-renders after measuring its width and would put a removed row back.
        // Row 2: the run is virtual, so the rule names one result row (number 1) instead of the DOM's last row.
        apply: async ({ page }) => {
          await page.addStyleTag({
            content: `${SEARCHING} tbody tr:has([data-row-number="1"]) { display: none !important; }`,
          });
        },
      },
      {
        // Row 2: equivalent of "only the first page of results" for a continuous run — the results cannot scroll past
        // the first window, so rows below it never mount.
        name: "chi con khung dau",
        message: /tim: bo sot dong khop — /,
        apply: async ({ page }) => {
          await page.addStyleTag({
            content: `${SEARCHING} [data-slot="scroll-area-viewport"] { overflow: hidden !important; }`,
          });
        },
      },
      {
        name: "them mot dong khong khop",
        message: /tim: hien dong khong khop — /,
        apply: async ({ page }) => {
          // Re-applied on every re-render, so the grid cannot drop the extra row.
          await onResult(
            page,
            `const box = document.querySelector('[data-slot="data-region"] input[type="search"]');
             if (!box || !box.value || document.querySelector('tr[data-pha]')) return;
             const row = document.querySelector('[data-slot="data-region-body"] tbody tr');
             if (!row) return;
             const extra = row.cloneNode(true);
             extra.setAttribute('data-pha', '1');
             extra.querySelectorAll('[data-slot="typed-cell"]').forEach((c) => { if (c.dataset.kind === 'text') c.textContent = 'zz-khong-khop'; });
             row.parentNode.appendChild(extra);`,
          );
        },
      },
    ],
  },
];

// ---- which grid screens may lack a region -----------------------------------------------------------------------

/** Grid screens allowed to have no data region yet, each with why. Remove a line when the screen builds its region. */
export const NO_REGION_YET: Record<string, string> = {
  sent: "trang chỉ có đầu màn, vùng Lưới dựng khi màn Đã gửi tới lượt",
};

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
