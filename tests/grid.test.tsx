// @vitest-environment jsdom
// decision:column-align
// decision:column-width
// decision:table-density
// decision:read-only-cell
import { cleanup, render, screen } from "@testing-library/react";
import type { ReactElement } from "react";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

import {
  KIND_SAMPLE_LENGTH,
  alignFor,
  columnWidthCh,
  densityFor,
  DENSITY_ROW_CLASS,
  typedColumn,
  type TypedColumnSpec,
} from "../src/components/candidate/column-kind";
import { DataRegion, type GridRow } from "../src/components/candidate/data-region";
import { RegionHeader } from "../src/components/candidate/region-header";
import { TypedCell } from "../src/components/candidate/typed-cell";
import { FIELD_DISPLAY, type DisplayKind } from "../src/generated/display";
import { formatArea, formatCount, formatMoney, statusLabel } from "../src/lib/format";

beforeAll(() => {
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
    expect(fields.length).toBe(20);
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
    expect(DENSITY_ROW_CLASS).toEqual({ dense: "h-10 text-sm", normal: "h-12 text-base" });
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

describe("pagination and read-only cells", () => {
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

  function checkPager(container: HTMLElement): void {
    if (!/Số dòng mỗi trang/.test(container.textContent ?? ""))
      throw new Error("pagination missing");
  }

  it("shows at most one page of rows and a Vietnamese pager beyond the page size", () => {
    const { container } = render(
      <DataRegion title="Vùng" columns={columns} rows={rowsOf(120)} emptyWhy="x" />,
    );
    expect(container.querySelectorAll("tbody tr").length).toBe(50);
    expect(() => checkPager(container)).not.toThrow();
    expect(container.textContent).not.toMatch(/Rows per page|Go to next page/);
  });

  it("has no pager at exactly one page", () => {
    const { container } = render(
      <DataRegion title="Vùng" columns={columns} rows={rowsOf(50)} emptyWhy="x" />,
    );
    expect(container.querySelectorAll("tbody tr").length).toBe(50);
    expect(container.textContent).not.toMatch(/Số dòng mỗi trang/);
  });

  it("fails when the pager is missing beyond one page", () => {
    const { container } = render(
      <DataRegion title="Vùng" columns={columns} rows={rowsOf(51)} emptyWhy="x" />,
    );
    container.querySelector('[data-slot="data-grid-pagination"]')?.remove();
    for (const node of container.querySelectorAll("*")) {
      if (node.textContent === "Số dòng mỗi trang") node.remove();
    }
    expect(() => checkPager(container)).toThrow("pagination missing");
  });

  function checkLocked(root: HTMLElement): void {
    const reason = root.getAttribute("aria-description");
    if (root.querySelector('[data-slot="cell-lock"]') && !reason)
      throw new Error("locked cell without reason");
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
  });

  it("fails on a locked cell without a reason", () => {
    const { root } = cellText(<TypedCell kind="money" value={1} lockedReason="x" />);
    root.removeAttribute("aria-description");
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
    expect(container.textContent).toContain("2 dòng");
  });
});
