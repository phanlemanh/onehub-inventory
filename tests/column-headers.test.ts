// @vitest-environment jsdom
// The column titles lop-rieng.spec.ts compares exactly (row 7e). On CI the read gave «Trạng tháiChọn» and
// «Hướng viewChọn»: the title and the «Chọn» of its filter box run together when the cell's text is taken as laid out.
// readHeaders takes the title from the cell's structure, so the layout of the moment does not matter.
import { describe, expect, it } from "vitest";

import { readHeaders } from "./e2e-db/column-headers";

/** One header row as the grid draws it: the title, then the column's filter box under it. */
function row(
  cells: { id: string; title: string; filter?: string; structured?: boolean }[],
): Element {
  const tr = document.createElement("tr");
  for (const c of cells) {
    const th = document.createElement("th");
    th.dataset["colId"] = c.id;
    const filter = c.filter
      ? `<div data-slot="column-filter" data-filter-mode="values"><button>${c.filter}</button></div>`
      : "";
    th.innerHTML =
      c.structured === false
        ? `<div><button>${c.title}</button>${filter}</div>`
        : `<div data-slot="sheet-header"><div><button>${c.title}<svg></svg></button></div>${filter}</div>`;
    tr.append(th);
  }
  return tr;
}

describe("readHeaders", () => {
  it("reads each title without its filter box, in order, company-layer columns only", () => {
    const tr = row([
      { id: "select", title: "" },
      { id: "listing.StandardStatus", title: "Trạng thái", filter: "Chọn" },
      { id: "listing.ListPrice", title: "Giá chào" },
      { id: "custom.huong_view", title: "Hướng view", filter: "Chọn" },
    ]);
    expect(readHeaders(tr)).toEqual(["Trạng thái", "Giá chào", "Hướng view"]);
  });

  it("does not depend on how the cell is laid out at the moment of the read", () => {
    const tr = row([{ id: "listing.StandardStatus", title: "Trạng thái", filter: "Chọn" }]);
    for (const el of tr.querySelectorAll<HTMLElement>("div")) el.style.display = "inline";
    expect(readHeaders(tr)).toEqual(["Trạng thái"]);
  });

  it("break: a cell whose title is not set apart is read whole, so the exact comparison goes red", () => {
    const tr = row([
      { id: "listing.StandardStatus", title: "Trạng thái", filter: "Chọn", structured: false },
    ]);
    expect(readHeaders(tr)).toEqual(["Trạng tháiChọn"]);
    expect(readHeaders(tr)).not.toEqual(["Trạng thái"]);
  });
});
