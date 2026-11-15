/**
 * The headers of a grid's columns in order, read from its first header row (`thead tr:first-child`), for the
 * company-layer columns (`data-col-id` with a dot). Run inside the page through `locator.evaluate`, so it uses
 * nothing from outside its own body.
 *
 * A header cell holds the column title and, under it, the column's filter box (`data-slot="column-filter"`, whose
 * values button reads «Chọn»). The title is read from the cell's structure — the first part of `sheet-header` — not
 * from the cell's laid-out text: `innerText` depends on the layout of the moment, and a read while the page was being
 * redrawn once gave «Trạng tháiChọn» (row 7e, lop-rieng.spec.ts:359). A cell without that structure is read whole,
 * filter box included, so a title the grid does not set apart still fails the exact comparison.
 */
export function readHeaders(tr: Element): string[] {
  return [...tr.querySelectorAll<HTMLElement>("th[data-col-id]")]
    .filter((th) => th.dataset["colId"]!.includes("."))
    .map((th) => {
      const title = th.querySelector('[data-slot="sheet-header"]')?.firstElementChild ?? th;
      return (title.textContent ?? "").trim();
    });
}
