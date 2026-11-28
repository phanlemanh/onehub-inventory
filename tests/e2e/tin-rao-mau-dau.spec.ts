// Row 3h (tin-rao-giu-gia-tri-rieng, task 5, plan «màu dấu»): the mark of a value that differs from the catalog never
// reads as a status. Since VP11 every badge tone is a status's and amber is the warning's, so the mark takes the neutral
// token (decision:attribute-differs-mark-colour). Measured on pixels in light and dark with VP11's colour distance
// (CIEDE2000, threshold 12, tests/e2e/support/mau.ts) against the six status badges of the same grid; the check also
// fails on the page broken on purpose (the mark back on the info tone, no mark, no badge).
import { expect, test, type Page } from "@playwright/test";

import { regionReady } from "./phone-list";
import { deltaE2000, toLab, wordsColour, type Lab } from "./support/mau";

const STATUSES = ["Incomplete", "Active", "Pending", "Closed", "Hold", "Withdrawn"] as const;
type Status = (typeof STATUSES)[number];
type Scheme = "light" | "dark";
const SCHEMES: readonly Scheme[] = ["light", "dark"];
/** VP11, owner 2026-11-28, Hỏi-2: two colours closer than this read as one. */
const MIN_APART = 12;
const BODY = '[data-slot="data-region-body"]';
/** Written before the code: the mark against six statuses in two themes. */
const CELLS = 12;

interface Seen {
  mark?: Lab;
  statuses: Partial<Record<Status, Lab>>;
}

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

/** The mark's colour (the dot, farthest from the cell's ground) and the words' colour of each status badge. */
async function seen(page: Page): Promise<Seen> {
  const out: Seen = { statuses: {} };
  const mark = page.locator(`${BODY} tbody [data-slot="attribute-differs"]`).first();
  if ((await mark.count()) > 0) out.mark = toLab(await wordsColour(mark));
  for (const s of STATUSES) {
    const badge = page.locator(`${BODY} tbody [data-status="${s}"]`).first();
    if ((await badge.count()) > 0) out.statuses[s] = toLab(await wordsColour(badge));
  }
  return out;
}

/** Throws when the mark is missing, a status badge is missing, or the mark is as near a status as one colour. */
function checkApart(colours: Record<Scheme, Seen>): number {
  let cells = 0;
  for (const scheme of SCHEMES) {
    const c = colours[scheme];
    if (!c.mark) throw new Error(`no catalog mark found (${scheme})`);
    for (const s of STATUSES) {
      const status = c.statuses[s];
      if (!status) throw new Error(`no ${s} badge found (${scheme})`);
      const d = deltaE2000(c.mark, status);
      cells += 1;
      if (d < MIN_APART)
        throw new Error(
          `mark shares a colour with ${s}: ${d.toFixed(1)} under ${MIN_APART} (${scheme})`,
        );
    }
  }
  return cells;
}

test.describe("mau-dau: the catalog mark is no status's colour", () => {
  test("mau-dau: the mark stands apart from the six statuses in light and dark", async ({
    page,
  }, info) => {
    test.skip(info.project.name !== "1440", "measured at 1440");
    const colours = {} as Record<Scheme, Seen>;
    for (const scheme of SCHEMES) {
      await open(page, scheme);
      colours[scheme] = await seen(page);
    }
    expect(checkApart(colours), "cells measured").toBe(CELLS);
  });

  test("mau-dau: the check fails on the mark back on the info tone, and on a page with no mark or badge", async ({
    page,
  }, info) => {
    test.skip(info.project.name !== "1440", "measured at 1440");
    const real = {} as Record<Scheme, Seen>;
    for (const scheme of SCHEMES) {
      await open(page, scheme);
      real[scheme] = await seen(page);
    }
    expect(() => checkApart({ ...real, dark: { statuses: real.dark.statuses } })).toThrow(
      "no catalog mark found (dark)",
    );
    expect(() => checkApart({ ...real, light: { mark: real.light.mark, statuses: {} } })).toThrow(
      "no Incomplete badge found (light)",
    );
    // The dot as it was before VP11 made info the «Đang giao dịch» tone alone.
    await open(
      page,
      "light",
      `${BODY} [data-slot="attribute-differs"] span { background-color: var(--info) !important; }`,
    );
    const back = { ...real, light: await seen(page) };
    expect(() => checkApart(back)).toThrow(/mark shares a colour with Pending/);
  });
});
