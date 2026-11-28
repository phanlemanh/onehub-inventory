// VP11 (G-2811-25, _acceptance/chuan-hoa-he-design): once a region says it is ready (`data-hydrated`, read by
// regionReady in ./phone-list.ts), what it shows stays the same elements. Before this, the grid drew again right after
// the mark — the density switched from normal to dense, and the screen's edit rule came back as a new object — so every
// row or every cell's content was replaced: a test holding a cell from before the redraw held a dead element, and a
// person who had just clicked a cell lost it. The page records, at the moment the mark appears, every cell's content
// (cards below 768 px), then the test checks after the page has settled that each one is still on the page.
//
// GitHub went red once at 414 on /inventory (28/11, dee19d1d: 60 of 120 replaced) and no try here brought it back
// (G-2811-75/76). The measure is unchanged; a red run now also says where the redraw came from: what the page held at
// the mark, whether the region's root was mounted again, the main frame's navigations and loads after the mark, and the
// dev server's lines in the browser console (Fast Refresh, full reload) in that window.
import { expect, test, type ConsoleMessage, type Page } from "@playwright/test";

import { regionReady } from "./phone-list";

/** What the region shows: the content of every body cell on a table, the cards on a phone. */
const SHOWN =
  '[data-slot="data-region"] tbody td > *, [data-slot="data-region"] [data-slot="phone-card"]';

type AtReady = {
  nodes: Element[];
  density: string | null;
  /** Epoch ms of the mark, to place the frame's events and console lines after it. */
  at: number;
  /** The region's root at the mark, tagged so a root mounted again is told apart. */
  root: Element;
};

/** Records, when the region first carries the mark, the nodes it shows and its density. */
async function recordAtReady(page: Page): Promise<void> {
  await page.addInitScript((shown: string) => {
    const w = window as unknown as { __vungYen?: AtReady };
    const observer = new MutationObserver(() => {
      const region = document.querySelector('[data-slot="data-region"][data-hydrated]');
      if (!region || w.__vungYen) return;
      (region as Element & { __vungYenRoot?: true }).__vungYenRoot = true;
      w.__vungYen = {
        nodes: [...document.querySelectorAll(shown)],
        density:
          document
            .querySelector('[data-slot="data-region-body"][data-density]')
            ?.getAttribute("data-density") ?? null,
        at: Date.now(),
        root: region,
      };
      observer.disconnect();
    });
    observer.observe(document, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["data-hydrated"],
    });
  }, SHOWN);
}

/** The cells recorded at the mark that are no longer on the page, and the density now against then. */
async function sinceReady(page: Page) {
  return page.evaluate(() => {
    const w = window as unknown as { __vungYen?: AtReady };
    const at = w.__vungYen;
    if (!at) return null;
    const card = (n: Element) => n.matches('[data-slot="phone-card"]');
    const gone = at.nodes.filter((n) => !n.isConnected);
    const now = document.querySelector('[data-slot="data-region"]') as
      (Element & { __vungYenRoot?: true }) | null;
    return {
      recorded: at.nodes.length,
      replaced: gone.length,
      at: at.at,
      // Which kind was held at the mark and which was replaced: cards, or cells of a table.
      kinds: `cards ${gone.filter(card).length}/${at.nodes.filter(card).length}, table cells ${
        gone.filter((n) => !card(n)).length
      }/${at.nodes.filter((n) => !card(n)).length}`,
      root: !at.root.isConnected
        ? "region root mounted again"
        : now?.__vungYenRoot
          ? "same region root"
          : "another region root beside it",
      densityThen: at.density,
      densityNow:
        document
          .querySelector('[data-slot="data-region-body"][data-density]')
          ?.getAttribute("data-density") ?? null,
    };
  });
}

/** The dev server's lines in the browser console: Fast Refresh, HMR, full reload, on-demand compiling. */
const DEV_LINE = /fast refresh|\[hmr\]|full reload|reload|compil|rebuild/i;

/** Watches the main frame and the console from the start, so a red run can say what happened after the mark. */
function watch(page: Page) {
  const events: { t: number; what: string }[] = [];
  page.on("framenavigated", (f) => {
    if (f === page.mainFrame()) events.push({ t: Date.now(), what: `navigated ${f.url()}` });
  });
  page.on("load", () => events.push({ t: Date.now(), what: "load" }));
  page.on("console", (m: ConsoleMessage) => {
    if (DEV_LINE.test(m.text())) events.push({ t: Date.now(), what: `console: ${m.text()}` });
  });
  /** The events after `at`, each with its delay after the mark. */
  return (at: number) =>
    events.filter((e) => e.t >= at).map((e) => `+${e.t - at} ms ${e.what}`.slice(0, 200));
}

for (const path of ["/inventory", "/sent"]) {
  test(`${path}: nothing is drawn again after the region says it is ready`, async ({ page }) => {
    const after = watch(page);
    await recordAtReady(page);
    await page.goto(path);
    await regionReady(page);
    // What happens after the mark is what this measures: the page is let run until the network is quiet and a while
    // past it, the time the grid's late redraw took on CI and here (50–150 ms after the mark).
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1_000);
    const seen = await sinceReady(page);
    expect(seen, "the region never carried the ready mark").not.toBeNull();
    expect(seen!.recorded, "no cell recorded at ready (nothing to measure)").toBeGreaterThan(0);
    const events = after(seen!.at);
    expect(
      seen!.replaced,
      `redrawn after ready: ${seen!.replaced} of ${seen!.recorded} cells replaced (${seen!.kinds}; ${
        seen!.root
      }; after the mark: ${events.length ? events.join(" | ") : "no navigation, load or dev-server line"})`,
    ).toBe(0);
    expect(seen!.densityNow, "density changed after ready").toBe(seen!.densityThen);
  });
}
