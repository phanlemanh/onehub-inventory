// @vitest-environment jsdom
// decision:column-align
// decision:column-width
// decision:table-density
// decision:read-only-cell
// decision:grid-continuous-run
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import type { ReactElement } from "react";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

import {
  KIND_SAMPLE_LENGTH,
  alignFor,
  columnWidthCh,
  densityFor,
  DENSITY_ROW_CLASS,
  fittedWidthCh,
  fullWidthCh,
  spreadSpareCh,
  typedColumn,
  type TypedColumnSpec,
} from "../src/components/candidate/column-kind";
import { DataRegion, type GridRow } from "../src/components/candidate/data-region";
import { RegionHeader } from "../src/components/candidate/region-header";
import { TypedCell } from "../src/components/candidate/typed-cell";
import { FIELD_DISPLAY, type DisplayKind } from "../src/generated/display";
import { formatArea, formatCount, formatMoney, statusLabel } from "../src/lib/format";
import { tallGridViewport } from "./virtual-viewport";

beforeAll(() => {
  tallGridViewport();
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
  window.matchMedia ??= ((query: string) => ({
    matches: false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    onchange: null,
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
});
afterEach(cleanup);

const KINDS: readonly DisplayKind[] = [
  "money",
  "area",
  "count",
  "date",
  "datetime",
  "phone",
  "status",
  "boolean",
  "text",
  "person",
  "select",
];

function cellText(element: ReactElement): { text: string; root: HTMLElement } {
  const { container } = render(element);
  const root = container.querySelector<HTMLElement>('[data-slot="typed-cell"]')!;
  const text = root.textContent ?? "";
  cleanup();
  return { text, root };
}

describe("typed cell", () => {
  /** Written before the code: 11 kinds × (sample, empty) + count 0 + boolean false = 24 cells. */
  const CELLS_EXPECTED = 24;
  const MATRIX: ReadonlyArray<[DisplayKind, unknown, string]> = [
    ["money", 4_850_000_000, "4,85 tỷ"],
    ["area", 75.5, "75,5 m²"],
    ["count", 2418, "2.418"],
    ["date", "2026-11-05", "05/11/2026"],
    ["datetime", "2026-11-05T07:30:00Z", "14:30 05/11/2026"],
    ["phone", "0900000001", "0900 000 001"],
    ["status", "Active", "Đang bán"],
    ["boolean", true, "Có"],
    ["text", "S1.01-0201", "S1.01-0201"],
    ["person", "[Tên]", "[Tên]"],
    ["select", "Condominium", "Condominium"],
    ...KINDS.map((kind): [DisplayKind, unknown, string] => [kind, null, "—"]),
    ["count", 0, "0"],
    ["boolean", false, "Không"],
  ];

  type Render = (kind: DisplayKind, value: unknown) => string;
  const real: Render = (kind, value) => cellText(<TypedCell kind={kind} value={value} />).text;

  function checkMatrix(show: Render): void {
    for (const [kind, value, want] of MATRIX) {
      const got = show(kind, value);
      if (got !== want) {
        const falsy = value === 0 || value === false;
        throw new Error(
          falsy ? `falsy rendered as empty: ${kind}` : `typed cell mismatch: ${kind} gave "${got}"`,
        );
      }
    }
  }

  it("has the matrix that was written down", () => {
    expect(MATRIX.length).toBe(CELLS_EXPECTED);
  });

  it("shows every kind the way its formatter and label say", () => {
    expect(() => checkMatrix(real)).not.toThrow();
  });

  it("shows status as the coloured badge of 1a", () => {
    const { root } = cellText(<TypedCell kind="status" value="Closed" transaction="lease" />);
    expect(root.querySelector('[data-status="Closed"]')).not.toBeNull();
    expect(root.textContent).toBe(statusLabel("Closed", "lease"));
  });

  it("fails on a cell that drops the status branch", () => {
    const broken: Render = (kind, value) => (kind === "status" ? String(value) : real(kind, value));
    expect(() => checkMatrix(broken)).toThrow("typed cell mismatch: status");
  });

  it("fails on a cell that treats falsy values as empty", () => {
    const broken: Render = (kind, value) =>
      value === 0 || value === false ? "—" : real(kind, value);
    expect(() => checkMatrix(broken)).toThrow("falsy rendered as empty: count");
  });
});

describe("column rules", () => {
  it("declares a column by field, the kind comes from the ontology table", () => {
    const fields = Object.keys(FIELD_DISPLAY) as Array<keyof typeof FIELD_DISPLAY>;
    expect(fields.length).toBeGreaterThan(0); // the loop below must not pass on an empty table
    for (const field of fields) {
      expect(typedColumn({ field, header: "x" }).kind, field).toBe(FIELD_DISPLAY[field]);
    }
  });

  it("refuses kind, align or width from a screen", () => {
    const spec: TypedColumnSpec = { field: "Listing.listPrice", header: "Giá" };
    expect(Object.keys(spec).sort()).toEqual(["field", "header"]);
    // @ts-expect-error a screen may not choose the kind
    typedColumn({ field: "Listing.listPrice", header: "Giá", kind: "text" });
    // @ts-expect-error a screen may not choose the alignment
    typedColumn({ field: "Listing.listPrice", header: "Giá", align: "left" });
    // @ts-expect-error a screen may not choose the width
    typedColumn({ field: "Listing.listPrice", header: "Giá", width: 10 });
  });

  it("aligns money, area and count right and every other kind left", () => {
    const right = KINDS.filter((kind) => alignFor(kind) === "right");
    expect(KINDS.length).toBe(11);
    expect(right).toEqual(["money", "area", "count"]);
  });

  /** Samples written before the code, verbatim, and the width each gives with a short and a long header. */
  const SAMPLES: Record<DisplayKind, string> = {
    money: "999,99 tỷ",
    area: "9.999,99 m²",
    count: "99.999",
    date: "05/11/2026",
    datetime: "14:30 05/11/2026",
    phone: "0900 000 001",
    status: "Chưa đủ để rao",
    boolean: "Không",
    text: "S1.01-0201 S1.01",
    person: "[Tên] [Tên] [Tên] xx",
    select: "Condominium xx",
  };
  const WIDTH_SHORT: Record<DisplayKind, number> = {
    money: 11,
    area: 13,
    count: 8,
    date: 12,
    datetime: 18,
    phone: 14,
    status: 16,
    boolean: 7,
    text: 18,
    person: 22,
    select: 16,
  };
  const LONG_HEADER = "Tiêu đề cột rất dài hai mươi bốn"; // 32 characters

  type Width = (header: string, kind: DisplayKind) => number;
  function checkWidths(width: Width): void {
    for (const kind of KINDS) {
      if (width("Giá", kind) !== WIDTH_SHORT[kind]) throw new Error(`width formula: ${kind}`);
      if (width(LONG_HEADER, kind) !== LONG_HEADER.length + 2)
        throw new Error(`width formula: ${kind}`);
    }
  }

  it("keeps the written samples and the code in step", () => {
    for (const kind of KINDS) expect(SAMPLES[kind].length, kind).toBe(KIND_SAMPLE_LENGTH[kind]);
  });

  it("sizes 11 kinds × 2 headers by the formula of behaviors.md", () => {
    expect(() => checkWidths(columnWidthCh)).not.toThrow();
    expect(columnWidthCh("Giá", "money")).toBe(columnWidthCh("Phí", "money"));
  });

  it("never lets a formatted edge value outgrow the sample", () => {
    expect(formatMoney(1_000_000_000_000).length).toBeLessThanOrEqual(KIND_SAMPLE_LENGTH.money);
    expect(formatMoney(999_999_999).length).toBeLessThanOrEqual(KIND_SAMPLE_LENGTH.money);
    expect(formatArea(9999.99).length).toBeLessThanOrEqual(KIND_SAMPLE_LENGTH.area);
    expect(formatCount(99_999).length).toBeLessThanOrEqual(KIND_SAMPLE_LENGTH.count);
    const statuses = ["Incomplete", "Active", "Pending", "Closed", "Hold", "Withdrawn"] as const;
    for (const status of statuses) {
      expect(statusLabel(status).length).toBeLessThanOrEqual(KIND_SAMPLE_LENGTH.status);
      expect(statusLabel(status, "lease").length).toBeLessThanOrEqual(KIND_SAMPLE_LENGTH.status);
    }
  });

  it("fails on a width that only follows the header", () => {
    expect(() => checkWidths((header) => header.length + 2)).toThrow("width formula: money");
  });

  it("cuts long text with an ellipsis and keeps the full text readable", () => {
    const long = "S1.01-0201 căn góc hai mặt thoáng, view hồ, đã có sổ";
    const { root } = cellText(<TypedCell kind="text" value={long} />);
    const inner = root.querySelector("span.truncate")!;
    expect(inner.getAttribute("title")).toBe(long);
  });
});

describe("density", () => {
  function checkEdge(density: typeof densityFor): void {
    if (density(101, 100) !== "dense") throw new Error("density edge");
    if (density(100, 100) !== "normal") throw new Error("density edge");
    if (density(99, 100) !== "normal") throw new Error("density edge");
  }

  it("goes dense only when the columns are wider than the area", () => {
    expect(() => checkEdge(densityFor)).not.toThrow();
    // Row 2 (owner, «Duyệt»): dense rows drop to 32px like data-grid-editing-6 and a sheet; normal rows unchanged.
    expect(DENSITY_ROW_CLASS).toEqual({ dense: "h-8 text-sm", normal: "h-12 text-base" });
  });

  it("fails on a density rule that is dense at the edge", () => {
    expect(() => checkEdge((total, area) => (total >= area ? "dense" : "normal"))).toThrow(
      "density edge",
    );
  });
});

describe("region header", () => {
  function checkHeader(root: HTMLElement): void {
    if (root.querySelectorAll("h2").length !== 1) throw new Error("region header: heading");
  }

  it("names the region and counts its rows", () => {
    const { container } = render(
      <RegionHeader
        title="Vùng"
        total={12}
        query=""
        onQuery={() => {}}
        searchId="s"
        action={<button>Thêm</button>}
      />,
    );
    expect(() => checkHeader(container)).not.toThrow();
    expect(screen.getByText("12 dòng")).toBeTruthy();
    expect(screen.getByRole("searchbox", { name: "Tìm trong vùng" })).toBeTruthy();
    expect(container.querySelector('[data-slot="region-action"]')).not.toBeNull();
  });

  it("counts matches over the total while searching and leaves no empty action slot", () => {
    const { container } = render(
      <RegionHeader title="Vùng" total={12} shown={3} query="a" onQuery={() => {}} searchId="s" />,
    );
    expect(screen.getByText("3 / 12 dòng")).toBeTruthy();
    expect(container.querySelector('[data-slot="region-action"]')).toBeNull();
  });

  it("fails on a header without its heading", () => {
    const { container } = render(
      <div>
        <p>Vùng</p>
      </div>,
    );
    expect(() => checkHeader(container)).toThrow("region header: heading");
  });
});

describe("continuous run and read-only cells", () => {
  const columns = [
    typedColumn({ field: "Listing.unitNumber", header: "Mã" }),
    typedColumn({ field: "Listing.listPrice", header: "Giá" }),
  ];
  const rowsOf = (n: number): GridRow[] =>
    Array.from({ length: n }, (_, i) => ({
      id: `r${i}`,
      "Listing.unitNumber": `A-${i}`,
      "Listing.listPrice": 2_000_000_000 + i,
    }));

  // Row 2 (Bảng hàng, «đọc như Sheet»): the grid is one continuous run instead of pages. Equivalent measure of the 1b
  // pager cases: every row is reachable in the one run, numbered 1..n without a gap, the footer counts them, no pager.
  function checkRun(container: HTMLElement, n: number): void {
    if (/Số dòng mỗi trang/.test(container.textContent ?? "")) throw new Error("pager present");
    const numbers = [...container.querySelectorAll('tbody [data-slot="row-number"]')].map((el) =>
      Number(el.textContent),
    );
    numbers.forEach((num, i) => {
      if (num !== i + 1) throw new Error(`run broken at row ${i + 1}`);
    });
    if (numbers.length !== n) throw new Error(`run broken at row ${numbers.length + 1}`);
    const footer = container.querySelector('[data-slot="region-footer-count"]');
    if (footer?.textContent !== `${n} dòng`) throw new Error("footer count missing");
  }

  it("shows every row in one numbered run, counted in the footer, with no pager", () => {
    const { container } = render(
      <DataRegion title="Vùng" columns={columns} rows={rowsOf(120)} emptyWhy="x" />,
    );
    expect(() => checkRun(container, 120)).not.toThrow();
    expect(container.querySelectorAll('[data-slot="data-grid-pagination"]').length).toBe(0);
    expect(container.textContent).not.toMatch(/Rows per page|Go to next page/);
  });

  it("fails when a row drops out of the run", () => {
    const { container } = render(
      <DataRegion title="Vùng" columns={columns} rows={rowsOf(51)} emptyWhy="x" />,
    );
    container.querySelectorAll("tbody tr")[20]?.remove();
    expect(() => checkRun(container, 51)).toThrow("run broken at row 21");
  });

  it("fails when a pager comes back", () => {
    const { container } = render(
      <DataRegion title="Vùng" columns={columns} rows={rowsOf(51)} emptyWhy="x" />,
    );
    const pager = document.createElement("div");
    pager.textContent = "Số dòng mỗi trang";
    container.append(pager);
    expect(() => checkRun(container, 51)).toThrow("pager present");
  });

  function checkLocked(root: HTMLElement): void {
    const reason = root.querySelector('[data-slot="cell-lock-reason"]')?.textContent;
    if (root.querySelector('[data-slot="cell-lock"]') && !reason) {
      throw new Error("locked cell without reason");
    }
  }

  it("shows a cell the viewer may not edit as plain text", () => {
    const { root } = cellText(<TypedCell kind="money" value={4_850_000_000} />);
    expect(root.querySelector('[data-slot="cell-lock"]')).toBeNull();
    expect(root.getAttribute("aria-description")).toBeNull();
  });

  it("shows a locked cell with a lock and its reason", () => {
    const { root } = cellText(
      <TypedCell kind="money" value={4_850_000_000} lockedReason="giá đang được kiểm lại" />,
    );
    expect(root.querySelector('[data-slot="cell-lock"]')).not.toBeNull();
    expect(root.getAttribute("aria-description")).toContain("giá đang được kiểm lại");
    expect(root.getAttribute("title")).toContain("giá đang được kiểm lại");
    expect(() => checkLocked(root)).not.toThrow();
    // A screen reader reads text, not an aria-description on a plain span: the reason is in the text.
    expect(root.querySelector('[data-slot="cell-lock-reason"]')?.textContent).toBe(
      "Ô đang khoá: giá đang được kiểm lại",
    );
  });

  it("fails on a locked cell without a reason", () => {
    const { root } = cellText(<TypedCell kind="money" value={1} lockedReason="x" />);
    root.querySelector('[data-slot="cell-lock-reason"]')?.remove();
    expect(() => checkLocked(root)).toThrow("locked cell without reason");
  });
});

describe("region states inside the grid", () => {
  const columns = [
    typedColumn({ field: "Listing.unitNumber", header: "Mã" }),
    typedColumn({ field: "Listing.listPrice", header: "Giá" }),
  ];
  const rows: GridRow[] = [
    { id: "a", "Listing.unitNumber": "S1.01-0201", "Listing.listPrice": 2_000_000_000 },
    { id: "b", "Listing.unitNumber": "S2.03-1105", "Listing.listPrice": 3_100_000_000 },
  ];
  const kindShown = (container: HTMLElement) =>
    [...container.querySelectorAll('[data-slot="region-state"]')].map((el) =>
      el.getAttribute("data-kind"),
    );

  it("shows each state and keeps the rest of the region", () => {
    let retried = 0;
    const retry = () => {
      retried += 1;
    };
    for (const [status, kind] of [
      ["error", "error"],
      ["forbidden", "forbidden"],
      ["partial", "partial"],
    ] as const) {
      const { container } = render(
        <DataRegion
          title="Vùng"
          columns={columns}
          rows={rows}
          status={status}
          onRetry={retry}
          emptyWhy="x"
        />,
      );
      expect(kindShown(container), status).toContain(kind);
      cleanup();
    }
    const error = render(
      <DataRegion
        title="Vùng"
        columns={columns}
        rows={rows}
        status="error"
        onRetry={retry}
        emptyWhy="x"
      />,
    );
    error.getByRole("button", { name: "Thử lại" }).click();
    expect(retried).toBe(1);
    cleanup();
    const loading = render(
      <DataRegion title="Vùng" columns={columns} rows={rows} status="loading" emptyWhy="x" />,
    );
    expect(
      loading.container
        .querySelector('[data-slot="region-skeleton"]')
        ?.getAttribute("data-columns"),
    ).toBe("2");
    cleanup();
    const empty = render(
      <DataRegion
        title="Vùng"
        columns={columns}
        rows={[]}
        emptyWhy="Chưa nhập dòng nào."
        emptyAction={<button>Nhập</button>}
      />,
    );
    expect(kindShown(empty.container)).toEqual(["empty"]);
    expect(empty.getByText("Chưa nhập dòng nào.")).toBeTruthy();
  });

  it("filters by text columns and offers clear filter when nothing matches", async () => {
    const { container, getByRole } = render(
      <DataRegion title="Vùng" columns={columns} rows={rows} emptyWhy="x" />,
    );
    const { fireEvent } = await import("@testing-library/react");
    fireEvent.change(getByRole("searchbox"), { target: { value: "s2.03" } });
    expect(container.querySelectorAll("tbody tr").length).toBe(1);
    expect(container.textContent).toContain("1 / 2 dòng");
    fireEvent.change(getByRole("searchbox"), { target: { value: "khong-co" } });
    expect(kindShown(container)).toEqual(["no-match"]);
    getByRole("button", { name: "Xoá lọc" }).click();
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect((getByRole("searchbox") as HTMLInputElement).value).toBe("");
    expect(container.querySelectorAll("tbody tr").length).toBe(2);
    expect(container.querySelector('[data-slot="region-count"]')?.textContent).toBe("2 dòng");
  });
});

describe("alignment on the rendered grid", () => {
  const columns = [
    typedColumn({ field: "Listing.listPrice", header: "Giá chào" }),
    typedColumn({ field: "Listing.closePrice", header: "Giá chốt" }),
    typedColumn({ field: "Listing.unitNumber", header: "Mã" }),
    typedColumn({ field: "Listing.buildingName", header: "Toà nhà" }),
  ];
  const rows: GridRow[] = [
    {
      id: "a",
      "Listing.listPrice": 4_850_000_000,
      "Listing.closePrice": 4_700_000_000,
      "Listing.unitNumber": "S1.01-0201",
      "Listing.buildingName": "S1.01",
    },
  ];
  const side = (el: Element | null | undefined): string =>
    el?.classList.contains("text-right")
      ? "right"
      : el?.classList.contains("text-left")
        ? "left"
        : "none";

  /** Header cell and body cell of each column must sit on the same side, the side of the kind. */
  function checkPairs(container: HTMLElement): void {
    // The first column is the frozen row-number column (row 2); the typed columns follow it.
    const headers = [...container.querySelectorAll("thead th")].slice(1);
    const cells = [...container.querySelectorAll("tbody tr:first-child td")].slice(1);
    columns.forEach((column, i) => {
      const want = column.align;
      if (side(headers[i]) !== want || side(cells[i]) !== want) {
        throw new Error(`alignment drift: ${column.field}`);
      }
    });
  }

  it("aligns header and body of every column to its kind, pair by pair", () => {
    const { container } = render(<DataRegion title="Vùng" columns={columns} rows={rows} />);
    expect(container.querySelectorAll("thead th").length).toBe(5);
    expect(() => checkPairs(container)).not.toThrow();
    expect(columns.map((column) => column.align)).toEqual(["right", "right", "left", "left"]);
  });

  it("fails when one header drifts from its cells", () => {
    const { container } = render(<DataRegion title="Vùng" columns={columns} rows={rows} />);
    const header = container.querySelectorAll("thead th")[2]!;
    header.classList.replace("text-right", "text-left");
    expect(() => checkPairs(container)).toThrow("alignment drift: Listing.closePrice");
  });
});

describe("content-fitted width of text columns", () => {
  type Fit = typeof fittedWidthCh;
  const code = typedColumn({ field: "Listing.unitNumber", header: "Căn" });
  const tower = typedColumn({ field: "Listing.buildingName", header: "Toà nhà" });
  const place = typedColumn({ field: "Listing.subdivisionName", header: "Khu" });
  const price = typedColumn({ field: "Listing.listPrice", header: "Giá chào" });
  // Written ahead: column, values, expected width in ch (max(label, min(reading length, longest)) + 2 + 1 slack).
  const MATRIX: [string, ReturnType<typeof typedColumn>, unknown[], number][] = [
    ["short code", code, ["0905", "1101"], 7],
    ["label longer than values", tower, ["S1.01", "E1"], 10],
    [
      "long text capped at reading length",
      place,
      ["Vinhomes Ocean Park 2 – The Empire", "Ocean"],
      19,
    ],
    ["no value keeps reading length", place, [null, undefined, ""], 18],
    ["non-text kind keeps its sample length", price, [1_000_000], price.widthCh],
  ];

  function checkFit(fit: Fit): void {
    for (const [name, column, values, want] of MATRIX) {
      const got = fit(column, values);
      if (got !== want) throw new Error(`fitted width: ${name} (${got} != ${want})`);
    }
  }

  it("fits each text column to its longest value, between the label and the reading length", () => {
    expect(MATRIX.length).toBe(5);
    expect(() => checkFit(fittedWidthCh)).not.toThrow();
  });

  it("fails when the reading length no longer caps a long value", () => {
    const uncapped: Fit = (column, values) =>
      column.kind === "text"
        ? Math.max(column.header.length, ...values.map((v) => String(v ?? "").length)) + 3
        : column.widthCh;
    expect(() => checkFit(uncapped)).toThrow("fitted width: long text capped at reading length");
  });

  it("fails when the old rule (reading length for every text column) comes back", () => {
    const old: Fit = (column) => column.widthCh;
    expect(() => checkFit(old)).toThrow("fitted width: short code");
  });

  const rows: GridRow[] = Array.from({ length: 60 }, (_, i) => ({
    id: `r${i}`,
    "Listing.unitNumber": String(1000 + i),
    "Listing.buildingName": i < 30 ? "S1.01" : "E1",
    "Listing.subdivisionName": i % 7 === 0 ? "Vinhomes Ocean Park 2 – The Empire" : "Ocean Park",
  }));
  const columns = [code, tower, place];
  const widthsOf = (container: HTMLElement): string[] =>
    [...container.querySelectorAll<HTMLElement>("thead th")].map((th) => th.style.width);

  function checkSteady(before: string[], after: string[], when: string): void {
    if (before.join() !== after.join()) {
      throw new Error(
        `width follows the shown rows: ${when} (${before.join()} -> ${after.join()})`,
      );
    }
  }

  it("keeps column widths while searching: widths come from every row the region holds", () => {
    const { container } = render(<DataRegion title="Vùng" columns={columns} rows={rows} />);
    const before = widthsOf(container);
    expect(before.every((w) => w !== "")).toBe(true);
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "E1" } });
    checkSteady(before, widthsOf(container), "search");
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "" } });
    checkSteady(before, widthsOf(container), "search cleared");
  });

  it("fails when widths are measured on the rows a search leaves", () => {
    const all = render(<DataRegion title="Vùng" columns={columns} rows={rows} />);
    const before = widthsOf(all.container);
    cleanup();
    const leftAfterSearch = rows.filter(
      (r) => r["Listing.buildingName"] === "E1" && r["Listing.subdivisionName"] === "Ocean Park",
    );
    const some = render(<DataRegion title="Vùng" columns={columns} rows={leftAfterSearch} />);
    expect(() => checkSteady(before, widthsOf(some.container), "search")).toThrow(
      "width follows the shown rows: search",
    );
  });
});

describe("spare room goes to columns that cut their text", () => {
  type Spread = typeof spreadSpareCh;
  // Written ahead: fitted widths, widths that show every value whole, room in ch, expected widths.
  const MATRIX: [string, number[], number[], number | null, number[]][] = [
    ["room for every cut column", [7, 10, 19, 11], [7, 10, 36, 11], 80, [7, 10, 36, 11]],
    ["room for part of the cut", [7, 10, 19, 11], [7, 10, 36, 11], 55, [7, 10, 27, 11]],
    ["no room keeps the fit", [7, 10, 19, 11], [7, 10, 36, 11], 40, [7, 10, 19, 11]],
    ["width not measured yet keeps the fit", [7, 19], [7, 36], null, [7, 19]],
    ["first cut column first", [19, 19], [30, 30], 50, [30, 20]],
  ];

  function checkSpread(spread: Spread): void {
    for (const [name, fitted, full, room, want] of MATRIX) {
      const got = spread(fitted, full, room);
      if (got.join() !== want.join())
        throw new Error(`spare room: ${name} (${got.join()} != ${want.join()})`);
    }
  }

  it("grows cut columns up to their whole text, never past the room, never below the fit", () => {
    expect(MATRIX.length).toBe(5);
    expect(() => checkSpread(spreadSpareCh)).not.toThrow();
    const place = typedColumn({ field: "Listing.subdivisionName", header: "Khu" });
    expect(fullWidthCh(place, ["Vinhomes Ocean Park 2 – The Empire", "Ocean"])).toBe(37);
    expect(fullWidthCh(place, ["Ocean"])).toBe(fittedWidthCh(place, ["Ocean"]));
  });

  it("fails when spare room is ignored (the long project name stays cut on a wide screen)", () => {
    const ignore: Spread = (fitted) => [...fitted];
    expect(() => checkSpread(ignore)).toThrow("spare room: room for every cut column");
  });

  it("fails when spare room overflows the grid", () => {
    const greedy: Spread = (_fitted, full) => [...full];
    expect(() => checkSpread(greedy)).toThrow("spare room: room for part of the cut");
  });
});
