// VP4 (debt of row 2b, _acceptance/bang-hang-the-dien-thoai): Inventory never flashes the table on a phone, nor the cards
// on a wide screen. The server does not know the width, so until the browser has measured, the region draws both
// layouts and the 768 px rule of the stylesheet hides one (src/components/candidate/use-phone-layout.ts).
//
// Every animation frame is recorded from the first one, before any script of the page runs, with the CPU slowed six
// times so the frames before React takes over last long enough to be seen. A frame «drawn twice» is one where both
// layouts are in the page: the server's HTML, before React. Each test asserts such frames were recorded, so a pass
// never comes from a page that skipped them. (Turning scripts off does not show that frame: Next.js keeps streamed
// content hidden until its inline script swaps it in; holding the bundles back stops the HTML parser.)
//   tung-khung — at 360 and 414 no frame shows a table and frames with rows show cards; at 1440 no frame shows a card;
//     the browser's first render matches the server's HTML (no Hydration warning in the console).
//   tro-nang-ve-doi — in each frame drawn twice, what a screen reader can reach in the region repeats no id, every id an
//     aria-controls, aria-labelledby, aria-describedby or label points to is there, and the region's name is heard once.
// The break cases undo one layout's hiding class with a style added to the head (React does not hydrate it, so the
// break itself raises no Hydration warning) and expect the pinned message.
//   mot-nhanh-sau-nhan-trang — once the region is marked hydrated the page holds one layout only (tables, cards counted
//     in the page, hidden or not), and the wait for that mark fails with a pinned message when it is missing.
// Each test sets its own viewport and runs once, in the 360 project.
import { expect, test, type Page } from "@playwright/test";

import { regionReady } from "./phone-list";
import { suaTrang } from "./sua-trang";

test.beforeEach(() => {
  test.skip(test.info().project.name !== "360", "sets its own viewport; runs once");
  test.slow();
});

const SIZES = [
  { width: 360, height: 800, phone: true },
  { width: 414, height: 896, phone: true },
  { width: 1440, height: 900, phone: false },
] as const;

interface Frame {
  tables: number;
  cards: number;
  twice: boolean;
  tree: string[];
}

/** One frame per animation frame, from the first one; `brk` shows a hidden layout from the head (a break case). */
async function record(
  page: Page,
  width: number,
  height: number,
  brk: { selector: string } | null = null,
): Promise<Frame[]> {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 6 });
  await page.setViewportSize({ width, height });
  await page.addInitScript((brk) => {
    type F = { tables: number; cards: number; twice: boolean; tree: string[] };
    const frames: F[] = [];
    (window as unknown as { __frames: F[] }).__frames = frames;
    const seen = (e: Element) => e.checkVisibility();
    // What a screen reader can reach in the region: no repeated id, no id pointing at nothing, one name.
    const tree = (region: Element): string[] => {
      const reachable = [...region.querySelectorAll<HTMLElement>("*")].filter(seen);
      const out: string[] = [];
      const ids = new Map<string, number>();
      for (const e of reachable) if (e.id) ids.set(e.id, (ids.get(e.id) ?? 0) + 1);
      for (const [id, n] of ids) if (n > 1) out.push(`id lap ${id}`);
      for (const e of reachable)
        for (const attr of ["aria-controls", "aria-labelledby", "aria-describedby", "for"])
          for (const ref of (e.getAttribute(attr) ?? "").split(/\s+/).filter(Boolean)) {
            const target = document.getElementById(ref);
            if (!target || (region.contains(target) && !seen(target)))
              out.push(`${attr} tro id khong co ${ref}`);
          }
      const names = new Map<string, number>();
      for (const h of reachable.filter((e) => /^H[1-6]$/.test(e.tagName))) {
        const name = (h.textContent ?? "").trim();
        names.set(name, (names.get(name) ?? 0) + 1);
      }
      for (const [name, n] of names) if (n > 1) out.push(`ten vung doc ${n} lan: ${name}`);
      return out;
    };
    const tick = () => {
      if (brk && document.head && !document.getElementById("bang-loe-pha")) {
        const style = document.createElement("style");
        style.id = "bang-loe-pha";
        style.textContent = `${brk.selector} { display: revert !important; }`;
        document.head.append(style);
      }
      const region = document.querySelector('[data-slot="data-region"]');
      const twice =
        !!document.querySelector('[data-layout="phone"]') &&
        !!document.querySelector('[data-layout="table"]');
      frames.push({
        tables: [...document.querySelectorAll('[data-slot="data-region"] table')].filter(seen)
          .length,
        cards: [...document.querySelectorAll('[data-slot="phone-card"]')].filter(seen).length,
        twice,
        tree: twice && region ? tree(region) : [],
      });
      if (frames.length < 600) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, brk);
  await page.goto("/inventory?vai=ListAgent");
  // Recording runs until the region is hydrated (one layout only); with the CPU slowed six times on CI that can take
  // most of a minute, so these tests get three times the timeout and the wait its own 60 s cap.
  await regionReady(page, 60_000);
  const frames = await page.evaluate(() => (window as unknown as { __frames: Frame[] }).__frames);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 1 });
  return frames;
}

/** Throws a pinned message at the first frame that shows the wrong layout for its width. */
function assertLayout(width: number, phone: boolean, frames: Frame[]): void {
  const withRows = frames.filter((f) => f.tables + f.cards > 0);
  if (withRows.length === 0) throw new Error(`${width}: khong khung nao co dong`);
  withRows.forEach((f, i) => {
    if (phone && f.tables > 0) throw new Error(`${width}: bang hien o khung ${i + 1}`);
    if (phone && f.cards === 0) throw new Error(`${width}: khong co the o khung ${i + 1}`);
    if (!phone && f.cards > 0) throw new Error(`${width}: the hien o khung ${i + 1}`);
    if (!phone && f.tables === 0) throw new Error(`${width}: khong co bang o khung ${i + 1}`);
  });
}

/** Throws a pinned message when no frame drawn twice was recorded, or one of them is not a single reachable tree. */
function assertTree(width: number, frames: Frame[]): void {
  const twice = frames.filter((f) => f.twice && f.tables + f.cards > 0);
  if (twice.length === 0) throw new Error(`${width}: khong ghi duoc khung ve doi`);
  const bad = twice.find((f) => f.tree.length > 0);
  if (bad) throw new Error(`${width}: ve doi lo cay tro nang — ${bad.tree.join("; ")}`);
}

test.describe("tung-khung", () => {
  for (const { width, height, phone } of SIZES)
    test(`${width}: every frame from the first shows ${phone ? "cards, never the table" : "the table, never a card"}`, async ({
      page,
    }) => {
      const hydration: string[] = [];
      page.on("console", (m) => {
        if (/hydrat/i.test(m.text())) hydration.push(m.text().slice(0, 200));
      });
      page.on("pageerror", (e) => {
        if (/hydrat/i.test(e.message)) hydration.push(e.message.slice(0, 200));
      });
      const frames = await record(page, width, height);
      assertLayout(width, phone, frames);
      expect(hydration, `${width}: canh bao Hydration`).toEqual([]);
      expect(
        frames.some((f) => f.twice && f.tables + f.cards > 0),
        `${width}: khong ghi duoc khung ve doi`,
      ).toBe(true);
    });

  test("break: the table's hiding class removed, 360 shows the table and the check names the frame", async ({
    page,
  }) => {
    const frames = await record(page, 360, 800, {
      selector: '[data-layout="table"]',
    });
    expect(() => assertLayout(360, true, frames)).toThrow(/^360: bang hien o khung \d+$/);
  });

  test("break: the cards' hiding class removed, 1440 shows cards and the check names the frame", async ({
    page,
  }) => {
    const frames = await record(page, 1440, 900, {
      selector: '[data-layout="phone"]',
    });
    expect(() => assertLayout(1440, false, frames)).toThrow(/^1440: the hien o khung \d+$/);
  });
});

test.describe("tro-nang-ve-doi", () => {
  for (const { width, height } of SIZES)
    test(`${width}: while both layouts are drawn, the reachable region is one tree`, async ({
      page,
    }) => {
      assertTree(width, await record(page, width, height));
    });

  test("break: both layouts shown at 1440 names the region twice", async ({ page }) => {
    const frames = await record(page, 1440, 900, {
      selector: '[data-layout="phone"]',
    });
    expect(() => assertTree(1440, frames)).toThrow(
      /^1440: ve doi lo cay tro nang — .*ten vung doc 2 lan/,
    );
  });
});

// Once the region is marked hydrated it holds one layout only, in the page and not just on screen: the old browser tests
// count tables and cards in the page after waiting for that mark (tests/e2e/phone-list.ts, D-1511-13).
/** Throws a pinned message when, after the mark, the page still holds the other layout. */
async function assertOneBranch(page: Page, width: number, phone: boolean): Promise<void> {
  const tables = await page.locator('[data-slot="data-region"] table').count();
  const cards = await page.locator('[data-slot="phone-card"]').count();
  if (phone && (tables > 0 || cards === 0))
    throw new Error(`${width}: sau khi nhan trang con nhanh bang (bang ${tables}, the ${cards})`);
  if (!phone && (cards > 0 || tables === 0))
    throw new Error(`${width}: sau khi nhan trang con nhanh the (bang ${tables}, the ${cards})`);
}

async function openReady(page: Page, width: number, height: number): Promise<void> {
  await page.setViewportSize({ width, height });
  await page.goto("/inventory?vai=ListAgent");
  await regionReady(page);
}

test.describe("mot-nhanh-sau-nhan-trang", () => {
  for (const { width, height, phone } of SIZES)
    test(`${width}: once hydrated the page holds ${phone ? "cards only" : "the table only"}`, async ({
      page,
    }) => {
      await openReady(page, width, height);
      await assertOneBranch(page, width, phone);
    });

  test("break: a hidden table left in the region at 360 is named", async ({ page }) => {
    await openReady(page, 360, 800);
    await suaTrang(page, () => {
      const t = document.createElement("table");
      t.hidden = true;
      document.querySelector('[data-slot="data-region"]')!.append(t);
    });
    await expect(assertOneBranch(page, 360, true)).rejects.toThrow(
      /^360: sau khi nhan trang con nhanh bang \(bang 1, the \d+\)$/,
    );
  });

  test("break: the mark taken off, the wait fails and says the region is not hydrated", async ({
    page,
  }) => {
    await openReady(page, 360, 800);
    await suaTrang(page, () =>
      document.querySelector('[data-slot="data-region"]')!.removeAttribute("data-hydrated"),
    );
    await expect(regionReady(page, 1_000)).rejects.toThrow(
      "region not hydrated (vung chua nhan trang): shown 1, hydrated 0",
    );
  });

  test("break: two regions shown, the wait fails and counts them", async ({ page }) => {
    await openReady(page, 360, 800);
    await page.evaluate(() => {
      const r = document.querySelector('[data-slot="data-region"]')!;
      r.after(r.cloneNode(true));
    });
    await expect(regionReady(page, 1_000)).rejects.toThrow(
      "region not hydrated (vung chua nhan trang): shown 2, hydrated 2",
    );
  });
});
