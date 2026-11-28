// VP11 (G-2811-25, _acceptance/chuan-hoa-he-design): once a region says it is ready (`data-hydrated`, read by
// regionReady in ./phone-list.ts), what it shows stays the same elements. Before this, the grid drew again right after
// the mark — the density switched from normal to dense, and the screen's edit rule came back as a new object — so every
// row or every cell's content was replaced: a test holding a cell from before the redraw held a dead element, and a
// person who had just clicked a cell lost it. The page records, at the moment the mark appears, every cell's content
// (cards below 768 px), then the test checks after the page has settled that each one is still on the page.
import { expect, test, type Page } from "@playwright/test";

import { regionReady } from "./phone-list";

/** What the region shows: the content of every body cell on a table, the cards on a phone. */
const SHOWN =
  '[data-slot="data-region"] tbody td > *, [data-slot="data-region"] [data-slot="phone-card"]';

/** Records, when the region first carries the mark, the nodes it shows and its density. */
async function recordAtReady(page: Page): Promise<void> {
  await page.addInitScript((shown: string) => {
    const w = window as unknown as { __vungYen?: { nodes: Element[]; density: string | null } };
    const observer = new MutationObserver(() => {
      const region = document.querySelector('[data-slot="data-region"][data-hydrated]');
      if (!region || w.__vungYen) return;
      w.__vungYen = {
        nodes: [...document.querySelectorAll(shown)],
        density:
          document
            .querySelector('[data-slot="data-region-body"][data-density]')
            ?.getAttribute("data-density") ?? null,
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
    const w = window as unknown as { __vungYen?: { nodes: Element[]; density: string | null } };
    const at = w.__vungYen;
    if (!at) return null;
    return {
      recorded: at.nodes.length,
      replaced: at.nodes.filter((n) => !n.isConnected).length,
      densityThen: at.density,
      densityNow:
        document
          .querySelector('[data-slot="data-region-body"][data-density]')
          ?.getAttribute("data-density") ?? null,
    };
  });
}

for (const path of ["/inventory", "/sent"]) {
  test(`${path}: nothing is drawn again after the region says it is ready`, async ({ page }) => {
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
    expect(
      seen!.replaced,
      `redrawn after ready: ${seen!.replaced} of ${seen!.recorded} cells replaced`,
    ).toBe(0);
    expect(seen!.densityNow, "density changed after ready").toBe(seen!.densityThen);
  });
}
