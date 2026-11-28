// VP11 chuan-hoa-he-design: the status palette on screen (AC-1, AC-2), no padlock where the status says it (AC-3), and
// the floating surfaces of the dark theme half a step above the grid (AC-11). Colours and greys are measured on pixels,
// never read from the declared style. Each check is a function, run on the real page (green) and on the same page broken
// on purpose (red, pinned message).
import { expect, test, type Page } from "@playwright/test";

import { columnLuminance, luminance } from "./do-diem-anh";
import { regionReady } from "./phone-list";
import { chroma, deltaE2000, hue, hueGap, toLab, wordsColour, type Lab } from "./support/mau";
import { suaTrang } from "./sua-trang";

const STATUSES = ["Incomplete", "Active", "Pending", "Closed", "Hold", "Withdrawn"] as const;
type Status = (typeof STATUSES)[number];
type Scheme = "light" | "dark";
const SCHEMES: readonly Scheme[] = ["light", "dark"];
/** Owner 2026-11-28, Hỏi-2: two statuses closer than this read as one colour. */
const MIN_APART = 12;
/** Fuchsia in CIE Lab hue: the owner's «tím hồng» for «Đang giao dịch» (Hỏi-2). */
const PENDING_HUE = [300, 350] as const;
const BODY = '[data-slot="data-region-body"]';

const at = (name: string) => test.skip(test.info().project.name !== name, `measured at ${name}`);

async function open(page: Page, scheme: Scheme, css?: string): Promise<void> {
  await page.emulateMedia({ colorScheme: scheme });
  if (css)
    await page.addInitScript((text) => {
      document.addEventListener("DOMContentLoaded", () => {
        const style = document.createElement("style");
        style.textContent = text;
        document.head.append(style);
      });
    }, css);
  await page.goto("/inventory?role=ListAgent");
  await regionReady(page);
}

/** The words' colour of the first badge of each status in the grid. */
async function gridColours(page: Page): Promise<Partial<Record<Status, Lab>>> {
  const out: Partial<Record<Status, Lab>> = {};
  for (const s of STATUSES) {
    const badge = page.locator(`${BODY} tbody [data-status="${s}"]`).first();
    if ((await badge.count()) === 0) continue;
    out[s] = toLab(await wordsColour(badge));
  }
  return out;
}

/** The matrix written before the code: 15 pairs × 2 themes = 30 cells. */
const PAIRS: readonly [Status, Status][] = STATUSES.flatMap((a, i) =>
  STATUSES.slice(i + 1).map((b) => [a, b] as [Status, Status]),
);
const PALETTE_CELLS = 30;

/** AC-1 on the colours of both themes; returns the number of pair cells measured. */
function checkPalette(colours: Record<Scheme, Partial<Record<Status, Lab>>>): number {
  let cells = 0;
  for (const scheme of SCHEMES) {
    const c = colours[scheme];
    if (Object.keys(c).length === 0) throw new Error(`no status badge found (${scheme})`);
    for (const s of STATUSES) if (!c[s]) throw new Error(`no ${s} badge found (${scheme})`);
    for (const [a, b] of PAIRS) {
      const d = deltaE2000(c[a]!, c[b]!);
      cells += 1;
      if (d < MIN_APART)
        throw new Error(
          `two statuses share a colour: ${a} and ${b} — ${a} and ${b} ${d.toFixed(1)} under ${MIN_APART} (${scheme})`,
        );
    }
    if (chroma(c.Incomplete!) > 8)
      throw new Error(
        `Incomplete is not grey: chroma ${chroma(c.Incomplete!).toFixed(1)} (${scheme})`,
      );
    const h = hue(c.Pending!);
    if (h < PENDING_HUE[0] || h > PENDING_HUE[1])
      throw new Error(`Pending is not fuchsia: hue ${h.toFixed(0)} (${scheme})`);
  }
  for (const s of STATUSES) {
    const [l, d] = [colours.light[s]!, colours.dark[s]!];
    if (chroma(l) > 8 && chroma(d) > 8 && hueGap(hue(l), hue(d)) > 30)
      throw new Error(
        `${s} changes hue between light and dark: ${hueGap(hue(l), hue(d)).toFixed(0)}°`,
      );
  }
  return cells;
}

test.describe("AC-1 · six statuses, six colours", () => {
  test("CIEDE2000 gives the reference distance", () => {
    // Sharma, Wu, Dalal (2005), table 1, pair 1.
    expect(deltaE2000({ L: 50, a: 2.6772, b: -79.7751 }, { L: 50, a: 0, b: -82.7485 })).toBeCloseTo(
      2.0425,
      3,
    );
  });

  test("six statuses read as six colours in light and dark", async ({ page }) => {
    at("1440");
    const colours = {} as Record<Scheme, Partial<Record<Status, Lab>>>;
    for (const scheme of SCHEMES) {
      await open(page, scheme);
      colours[scheme] = await gridColours(page);
    }
    expect(checkPalette(colours), "pair cells measured").toBe(PALETTE_CELLS);
  });

  test("the check fails on a page where two statuses share a colour", async ({ page }) => {
    at("1440");
    const real = {} as Record<Scheme, Partial<Record<Status, Lab>>>;
    for (const scheme of SCHEMES) {
      await open(page, scheme);
      real[scheme] = await gridColours(page);
    }
    expect(() => checkPalette({ light: {}, dark: {} })).toThrow("no status badge found");
    // «Chưa đủ để rao» forced onto the badge of «Tạm ngừng», on the page.
    await open(page, "light");
    await suaTrang(page, () => {
      const hold = document.querySelector(
        '[data-slot="data-region-body"] tbody [data-status="Hold"]',
      );
      for (const el of document.querySelectorAll(
        '[data-slot="data-region-body"] tbody [data-status="Incomplete"]',
      ))
        el.className = hold?.className ?? el.className;
    });
    const forced = { ...real, light: await gridColours(page) };
    expect(() => checkPalette(forced)).toThrow("two statuses share a colour: Incomplete and Hold");
    // The light info tone back on the brand blue, as before this round.
    await open(
      page,
      "light",
      ":root { --info: var(--onehub-blue) !important; --info-foreground: rgb(25, 60, 184) !important; }",
    );
    expect(() => checkPalette({ ...real, light: {} })).toThrow("no status badge found");
    const blue = { ...real, light: await gridColours(page) };
    expect(() => checkPalette(blue)).toThrow(/two statuses share a colour: Pending and Closed/);
    // The violet of the picture of 27/11, the owner's other choice at Hỏi-2: under the threshold in light. Written as
    // sRGB values: no screen uses Tailwind's violet any more, so its variables are not in the stylesheet, and Chromium on
    // Linux draws its out-of-gamut oklch wrongly in a screenshot (violet-600 came out yellow, 28/11).
    await open(
      page,
      "light",
      ":root { --info: rgb(139, 92, 246) !important; --info-foreground: rgb(124, 58, 237) !important; }",
    );
    const violet = { ...real, light: await gridColours(page) };
    expect(() => checkPalette(violet)).toThrow(/Pending and Closed \d+\.\d under 12/);
  });
});

// ---- AC-2 · one colour per status everywhere ---------------------------------------------------------------------------

type Place = "grid" | "card" | "head" | "history";
/** Written before the code: 6 grid + 6 card + 6 head + 4 history = 22 cells per theme, 44 in all. */
const HISTORY: readonly [string, Status][] = [
  ["0905", "Pending"],
  ["0905", "Withdrawn"],
  ["0905", "Closed"],
  ["1202", "Incomplete"],
];
const PLACES_CELLS = 44;

async function openRecordOf(page: Page, pick: { status?: Status; unit?: string }): Promise<void> {
  await page.keyboard.press("Escape");
  const row = pick.unit
    ? page.locator(`${BODY} tbody tr[data-row-id]`).filter({
        has: page.locator("button[data-record-open]", { hasText: new RegExp(`^${pick.unit}$`) }),
      })
    : page.locator(`${BODY} tbody tr[data-row-id]`).filter({
        has: page.locator(
          `td[data-col-id="Listing.standardStatus"] [data-status="${pick.status}"]`,
        ),
      });
  await row.first().locator("button[data-record-open]").click();
  await page.locator('[data-slot="record-panel"]').waitFor();
}

async function placeColours(page: Page, scheme: Scheme): Promise<Map<string, Lab>> {
  const out = new Map<string, Lab>();
  await page.setViewportSize({ width: 1440, height: 900 });
  await open(page, scheme);
  for (const s of STATUSES) {
    const b = page.locator(`${BODY} tbody [data-status="${s}"]`).first();
    if (await b.count()) out.set(`grid ${s}`, toLab(await wordsColour(b)));
  }
  for (const s of STATUSES) {
    await openRecordOf(page, { status: s });
    const head = page
      .locator('[data-slot="record-panel"] [data-status]:not(li[data-listing-id] *)')
      .first();
    if (await head.count()) out.set(`head ${s}`, toLab(await wordsColour(head)));
  }
  for (const [unit, s] of HISTORY) {
    await openRecordOf(page, { unit });
    const b = page
      .locator(`[data-slot="record-panel"] li[data-listing-id] [data-status="${s}"]`)
      .first();
    if (await b.count()) out.set(`history ${s} ${unit}`, toLab(await wordsColour(b)));
  }
  await page.keyboard.press("Escape");
  await page.setViewportSize({ width: 360, height: 800 });
  await regionReady(page);
  for (const s of STATUSES) {
    const b = page.locator(`[data-slot="phone-card"] [data-status="${s}"]`).first();
    if (await b.count()) out.set(`card ${s}`, toLab(await wordsColour(b)));
  }
  return out;
}

/** AC-2: every place's badge is the grid's colour (ΔE2000 ≤ 3); returns the cells measured. */
function checkPlaces(byScheme: Record<Scheme, Map<string, Lab>>): number {
  let cells = 0;
  const places: [Place, string][] = [
    ...STATUSES.map((s) => ["grid", s] as [Place, string]),
    ...STATUSES.map((s) => ["card", s] as [Place, string]),
    ...STATUSES.map((s) => ["head", s] as [Place, string]),
    ...HISTORY.map(([u, s]) => ["history", `${s} ${u}`] as [Place, string]),
  ];
  for (const scheme of SCHEMES) {
    const m = byScheme[scheme];
    for (const [place, what] of places) {
      const got = m.get(`${place} ${what}`);
      const status = what.split(" ")[0] as Status;
      if (!got)
        throw new Error(
          `no ${status} badge in ${place === "history" ? "offer history" : place}, ${scheme}`,
        );
      cells += 1;
      const d = deltaE2000(got, m.get(`grid ${status}`)!);
      if (d > 3)
        throw new Error(
          `status ${status} differs between grid and ${place === "head" ? "record head" : place}, ${scheme}: ${d.toFixed(1)}`,
        );
    }
  }
  if (cells !== PLACES_CELLS) throw new Error(`measured ${cells} of ${PLACES_CELLS} cells`);
  return cells;
}

test.describe("AC-2 · one colour per status everywhere", () => {
  test("grid, phone card, record head and offer history agree, light and dark", async ({
    page,
  }) => {
    at("1440");
    const by = { light: await placeColours(page, "light"), dark: await placeColours(page, "dark") };
    expect(checkPlaces(by)).toBe(PLACES_CELLS);
  });

  test("the check fails on a record head of another colour and on a missing cell", async ({
    page,
  }) => {
    at("1440");
    const by = { light: await placeColours(page, "light"), dark: await placeColours(page, "dark") };
    const other = new Map(by.light);
    other.set("head Active", by.light.get("grid Withdrawn")!);
    expect(() => checkPlaces({ ...by, light: other })).toThrow(
      "status Active differs between grid and record head, light",
    );
    const missing = new Map(by.dark);
    missing.delete("history Pending 0905");
    expect(() => checkPlaces({ ...by, dark: missing })).toThrow(
      "no Pending badge in offer history, dark",
    );
  });
});

// ---- AC-3 · no padlock where the status says it ------------------------------------------------------------------------

type Locked = { unit: string; col: string; svg: number; title: string; described: string };

async function lockedCells(page: Page): Promise<Locked[]> {
  return page.locator(`${BODY} tbody tr[data-row-id]`).evaluateAll((trs) =>
    trs
      .filter((tr) =>
        ["Closed", "Withdrawn"].includes(
          tr
            .querySelector('td[data-col-id="Listing.standardStatus"] [data-status]')
            ?.getAttribute("data-status") ?? "",
        ),
      )
      .flatMap((tr) =>
        [...tr.querySelectorAll('[data-slot="typed-cell"][title]')].map((cell) => ({
          unit: tr.querySelector("[data-record-open]")?.textContent ?? "",
          col: cell.closest("td")?.getAttribute("data-col-id") ?? "",
          svg: cell.querySelectorAll("svg").length,
          title: cell.getAttribute("title") ?? "",
          described: cell.getAttribute("aria-description") ?? "",
        })),
      ),
  );
}

function checkLocks(cells: readonly Locked[]): number {
  if (cells.length === 0) throw new Error("no locked row found");
  for (const c of cells) {
    if (c.svg > 0)
      throw new Error(`padlock where the status explains the lock: ${c.unit} ${c.col}`);
    if (!c.described.startsWith("Ô đang khoá") || !c.title.startsWith("Ô đang khoá"))
      throw new Error(`locked cell gives no reason: ${c.unit} ${c.col}`);
  }
  return cells.length;
}

for (const width of ["1024", "1440"]) {
  test(`AC-3 · no padlock where the status says it (${width})`, async ({ page }) => {
    at(width);
    await open(page, "light");
    const cells = await lockedCells(page);
    expect(checkLocks(cells)).toBeGreaterThan(1);
    // A locked cell still does not open: Enter, F2, typing, double click.
    const first = cells.find((c) => c.col === "Listing.standardStatus")!;
    const cell = page
      .locator(`${BODY} tbody tr[data-row-id]`)
      .filter({
        has: page.locator("button[data-record-open]", { hasText: new RegExp(`^${first.unit}$`) }),
      })
      .locator(`td[data-col-id="${first.col}"]`)
      .first();
    for (const way of ["Enter", "F2", "type", "double"] as const) {
      await page.keyboard.press("Escape");
      await cell.click({ position: { x: 3, y: 3 } });
      if (way === "double") await cell.dblclick({ position: { x: 3, y: 3 } });
      else if (way === "type") await page.keyboard.type("9");
      else await page.keyboard.press(way);
      await page.waitForTimeout(300);
      expect(
        await page.locator('[data-slot="cell-editor"]').count(),
        `${way} opened a locked cell`,
      ).toBe(0);
    }
  });

  test(`AC-3 · the check fails on a padlock, a missing reason, no locked row (${width})`, async ({
    page,
  }) => {
    at(width);
    await open(page, "light");
    const cells = await lockedCells(page);
    expect(() => checkLocks([{ ...cells[0]!, svg: 1 }])).toThrow(
      "padlock where the status explains the lock",
    );
    // The reason taken off the real cell.
    await suaTrang(page, () => {
      const cell = document.querySelector(
        '[data-slot="data-region-body"] tbody [data-slot="typed-cell"][aria-description]',
      );
      cell?.removeAttribute("aria-description");
    });
    expect(() => checkLocks(cells.map((c, i) => (i === 0 ? { ...c, described: "" } : c)))).toThrow(
      "locked cell gives no reason",
    );
    expect(() => checkLocks([])).toThrow("no locked row found");
  });
}

// ---- AC-11 · floating surfaces stand off the grid in dark --------------------------------------------------------------

type Greys = { page: number; grid: number; panel: number; menu: number; hover: number };

async function greys(page: Page, scheme: Scheme, css?: string, withRecord = true): Promise<Greys> {
  await page.setViewportSize({ width: 1440, height: 900 });
  await open(page, scheme, css);
  if (withRecord) await openRecordOf(page, { unit: "0905" });
  const panel = page.locator('[data-slot="record-panel-body"]');
  if ((await panel.count()) === 0) throw new Error("no record open");
  const box = (await panel.boundingBox())!;
  const region = (await page.locator('[data-slot="data-region"]').boundingBox())!;
  // Page: the band above the grid's card on the far left; grid: the left padding of row numbers; panel: its padding.
  const pageGrey = await luminance(page, {
    x: Math.round(region.x) + 2,
    y: Math.round(region.y) - 6,
    width: 12,
    height: 4,
  });
  // The grid's card: the empty middle of its footer row, under the rows (the panel covers its right end).
  const foot = (await page.locator('[data-slot="region-footer"]').first().boundingBox())!;
  const gridGrey = await luminance(page, {
    x: Math.round(foot.x + foot.width * 0.4),
    y: Math.round(foot.y + foot.height / 2) - 1,
    width: 10,
    height: 2,
  });
  const panelGrey = await luminance(page, {
    x: Math.round(box.x) + 2,
    y: Math.round(box.y) + 2,
    width: 10,
    height: 6,
  });
  await page.keyboard.press("Escape");
  await page
    .locator(`${BODY} thead th[data-col-id="Listing.listPrice"] [data-slot="sheet-header"] button`)
    .first()
    .click();
  const menu = page.locator('[role="menu"]').first();
  await menu.waitFor();
  const items = menu.locator('[role="menuitem"]');
  await items.nth(1).hover();
  await page.waitForTimeout(250);
  const m = (await menu.boundingBox())!;
  const it = (await items.nth(1).boundingBox())!;
  const menuGrey = await luminance(page, {
    x: Math.round(m.x) + 12,
    y: Math.round(m.y) + 1,
    width: 20,
    height: 2,
  });
  const cols = await columnLuminance(page, {
    x: Math.round(it.x) + 1,
    y: Math.round(it.y + it.height / 2) - 2,
    width: 4,
    height: 4,
  });
  const hover = cols.reduce((a, b) => a + b, 0) / cols.length;
  await page.keyboard.press("Escape");
  return { page: pageGrey, grid: gridGrey, panel: panelGrey, menu: menuGrey, hover };
}

function checkDarkSurfaces(g: Greys): void {
  if (g.panel - g.grid < 5)
    throw new Error(
      `record surface equals the grid in dark: ${g.panel.toFixed(1)} vs ${g.grid.toFixed(1)}`,
    );
  if (g.hover - g.menu < 5)
    throw new Error(`menu hover equals the menu: ${g.hover.toFixed(1)} vs ${g.menu.toFixed(1)}`);
}

test.describe("AC-11 · floating surface stands off the grid in dark", () => {
  test("the record is half a step above the grid, the menu's hover still shows; light unchanged", async ({
    page,
  }) => {
    at("1440");
    const dark = await greys(page, "dark");
    test.info().annotations.push({ type: "greys", description: JSON.stringify(dark) });
    checkDarkSurfaces(dark);
    const light = await greys(page, "light");
    test.info().annotations.push({ type: "greys light", description: JSON.stringify(light) });
    // Light keeps the white record on the white grid, and a hover that shows.
    expect(Math.abs(light.panel - light.grid), "light record surface changed").toBeLessThan(2);
    expect(light.hover - light.menu, "light menu hover").toBeLessThan(-2);
  });

  test("the check fails on the record at the grid's grey, a hover at the menu's grey, no record", async ({
    page,
  }) => {
    at("1440");
    expect(() => checkDarkSurfaces({ page: 10, grid: 23, panel: 23, menu: 23, hover: 38 })).toThrow(
      "record surface equals the grid in dark",
    );
    const flat = await greys(page, "dark", ":root.dark { --popover: var(--card) !important; }");
    expect(() => checkDarkSurfaces(flat)).toThrow("record surface equals the grid in dark");
    const step = await greys(
      page,
      "dark",
      ":root.dark { --popover: var(--color-neutral-800) !important; }",
    );
    expect(() => checkDarkSurfaces(step)).toThrow("menu hover equals the menu");
    await expect(greys(page, "dark", undefined, false)).rejects.toThrow("no record open");
  });
});
