// @vitest-environment jsdom
// Status shortcuts in the App Shell's second column (roadmap row 2a, E10): each opens the inventory grid filtered to
// its status, and the order of statuses is one everywhere — the sidebar, the grid's status filter, the label file.
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { NAV } from "../src/app/(app)/nav";
import { typedColumn } from "../src/components/candidate/column-kind";
import { DataRegion, type GridRow } from "../src/components/candidate/data-region";
import { STATUS_ORDER } from "../src/components/candidate/grid-view";
import { AppShell } from "../src/components/templates/app-shell";
import { label } from "../src/modules/company-config";
import { tallGridViewport } from "./virtual-viewport";

const nav = vi.hoisted(() => ({ pathname: "/inventory", search: "" }));
vi.mock("next/navigation", () => ({
  usePathname: () => nav.pathname,
  useSearchParams: () => new URLSearchParams(nav.search),
  useRouter: () => ({ refresh: () => {} }),
}));

beforeAll(() => {
  window.matchMedia ??= ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
  tallGridViewport();
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
  Element.prototype.getAnimations ??= () => [];
});
afterEach(cleanup);

/** Status codes in the order ontology/labels.yaml declares them, read from the file itself. */
const LABEL_FILE_ORDER = readFileSync(join(__dirname, "..", "ontology", "labels.yaml"), "utf8")
  .split("\n")
  .map((line) => /^ {2}Status([A-Z][a-zA-Z]+):/.exec(line)?.[1])
  .filter((code): code is string => code !== undefined);

const statusSection = () => {
  const inventory = NAV.find((item) => item.href === "/inventory");
  const section = inventory?.sections?.find((s) => s.items.length === 6);
  if (!section) throw new Error("no status section");
  return section.items;
};

/** The grid's status filter lists its choices in the one order; read them from the rendered filter. */
function gridStatusOrder(): string[] {
  const rows: GridRow[] = STATUS_ORDER.flatMap((status, i) => [
    { id: `a${i}`, "Listing.unitNumber": `A${i}`, "Listing.standardStatus": status },
  ]).reverse();
  render(
    <DataRegion
      title="Hàng"
      columns={[
        typedColumn({ field: "Listing.unitNumber", header: "Căn" }),
        typedColumn({ field: "Listing.standardStatus", header: "Trạng thái" }),
      ]}
      rows={rows}
    />,
  );
  fireEvent.click(screen.getByRole("button", { name: /^Lọc/ }));
  const trigger = document.querySelector('[data-filter-mode="values"] button') as HTMLElement;
  act(() => {
    fireEvent.pointerDown(trigger, { button: 0, pointerType: "mouse" });
    fireEvent.click(trigger);
  });
  const labels = [...document.querySelectorAll('[role="button"][aria-pressed]')].map(
    (el) => el.querySelector("span")?.textContent ?? "",
  );
  cleanup();
  return labels;
}

/** Sidebar hrefs, sidebar order, grid filter order and the label file must all say the same thing. */
function checkOrder(
  sidebar: readonly { href: string; title: string }[],
  grid: readonly string[],
): void {
  if (sidebar.length !== 6) throw new Error(`status shortcuts: ${sidebar.length}`);
  sidebar.forEach((link, i) => {
    const code = LABEL_FILE_ORDER[i] as string;
    if (link.title !== label(`Status${code}` as never))
      throw new Error("status order differs: sidebar");
    if (link.href !== `/inventory?status=${code}`) throw new Error(`shortcut href: ${link.href}`);
  });
  const wanted = LABEL_FILE_ORDER.map((code) => label(`Status${code}` as never));
  if (JSON.stringify(grid) !== JSON.stringify(wanted))
    throw new Error("status order differs: grid filter");
}

describe("status shortcuts", () => {
  it("six shortcuts point at the filtered grid, in the label file's order, the same as the grid's filter", () => {
    expect(LABEL_FILE_ORDER).toHaveLength(6);
    expect([...STATUS_ORDER]).toEqual(LABEL_FILE_ORDER);
    expect(() => checkOrder(statusSection(), gridStatusOrder())).not.toThrow();
  });

  it("the order check fails on a sidebar with its own order (Hold before Closed)", () => {
    const own = [...statusSection()];
    const closed = own.findIndex((l) => l.href.endsWith("Closed"));
    const hold = own.findIndex((l) => l.href.endsWith("Hold"));
    [own[closed], own[hold]] = [
      own[hold] as (typeof own)[number],
      own[closed] as (typeof own)[number],
    ];
    expect(() => checkOrder(own, gridStatusOrder())).toThrow("status order differs: sidebar");
  });

  it("lights the open shortcut by its query, not «Tất cả hàng»", () => {
    nav.pathname = "/inventory";
    nav.search = "status=Pending";
    render(<AppShell nav={NAV} roles={["ListAgent"]} />);
    const current = [...document.querySelectorAll('a[aria-current="true"]')].map(
      (a) => a.textContent,
    );
    // The second column renders twice (beside the rail, and in the phone sheet); both light the same place.
    expect(current.length).toBeGreaterThan(0);
    expect([...new Set(current)]).toEqual([label("StatusPending")]);
    nav.search = "";
  });
});
