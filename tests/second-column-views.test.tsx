// @vitest-environment jsdom
// Row 2c (luu-goc-nhin-cot-hai), E4 and E10: the App Shell's second column with «Tất cả căn», the status shortcuts and the
// person's saved views; the inventory's save buttons and the naming dialog.
//   one-entry-lit — five addresses written ahead: exactly one entry carries aria-current, the right one; a view that is
//     gone lights «Tất cả». Break: lighting by address prefix → «more than one item active: 2».
//   changed — the open view's entry is marked while the grid differs from what was saved, and only then the region offers
//     «Lưu thay đổi» and «Lưu thành mới».
//   naming — an empty name keeps the dialog open with the sentence under the field; a failed save (500) keeps the typed
//     name with an error and «Thử lại»; a refusal (403) shows the sentence of row 9e; no view yet shows the hint.
//     Break: a dialog that closes on a failed save → «typed name lost on failed save».
import { renderToString } from "react-dom/server";
import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import { navFor } from "../src/app/(app)/nav";
import { savedViewLabels } from "../src/app/(app)/saved-view-labels";
import { typedColumn } from "../src/components/candidate/column-kind";
import type { GridRow } from "../src/components/candidate/data-region";
import { AppShell } from "../src/components/templates/app-shell";
import { PlaceChangeProvider } from "../src/components/templates/app-shell/place-change";
import { FRAME_COPY } from "../src/components/templates/frame-copy";
import { sampleUnits, subdivisionNameOf } from "../src/modules/catalog";
import { SessionRoles } from "../src/modules/identity/ui";
import { SAMPLE_COMPANY, buildSampleListings, type SavedView } from "../src/modules/listings";
import {
  INVENTORY_FIELDS,
  InventoryGrid,
  inventoryRows,
  savedViewCopy,
  savedViewsSection,
  type InventoryField,
} from "../src/modules/listings/ui";
import { tallGridViewport } from "./virtual-viewport";

const where = vi.hoisted(() => ({ pathname: "/inventory", search: "" }));
const router = vi.hoisted(() => ({ refresh: vi.fn(), push: vi.fn() }));
vi.mock("next/navigation", () => ({
  usePathname: () => where.pathname,
  useSearchParams: () => new URLSearchParams(where.search),
  useRouter: () => router,
}));
vi.mock("sonner", () => ({ toast: Object.assign(vi.fn(), { error: vi.fn(), success: vi.fn() }) }));

beforeAll(() => {
  // jsdom's rects lack toJSON, which the tall-viewport helper spreads; menus measure the viewport through it.
  const base = Element.prototype.getBoundingClientRect;
  Element.prototype.getBoundingClientRect = function (this: Element) {
    const r = base.call(this);
    const plain = {
      x: r.x,
      y: r.y,
      width: r.width,
      height: r.height,
      top: r.top,
      right: r.right,
      bottom: r.bottom,
      left: r.left,
    };
    return { ...plain, toJSON: () => plain } as DOMRect;
  };
  tallGridViewport();
  // Enter opens a listing's record (row 3), and the record asks for the screen width through matchMedia.
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
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
  Element.prototype.getAnimations ??= () => [];
  Element.prototype.scrollIntoView ??= () => {};
  window.HTMLElement.prototype.hasPointerCapture ??= () => false;
});

beforeEach(() => {
  where.pathname = "/inventory";
  where.search = "";
  router.refresh.mockReset();
  router.push.mockReset();
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const LABELS = savedViewLabels();
const COPY = savedViewCopy(LABELS);
const ALL_TITLE = navFor().find((i) => i.href === "/inventory")!.sections![0]!.items[0]!.title;

const EMPTY = { filters: {}, sort: [], grouped: false, hidden: [] };
const VIEWS: SavedView[] = [
  {
    id: "00000000-0000-4000-8000-0000000000a1",
    screen: "inventory",
    name: "[MAU] Toà S1.01",
    view: { ...EMPTY, filters: { "Listing.buildingName": "S1.01" } },
  },
  {
    id: "00000000-0000-4000-8000-0000000000b2",
    screen: "inventory",
    name: "[MAU] Hai phòng ngủ",
    view: { ...EMPTY, filters: { "Unit.bedroomsTotal": "2" } },
  },
  {
    id: "00000000-0000-4000-8000-0000000000c3",
    screen: "inventory",
    name: "[MAU] Giá thấp",
    view: { ...EMPTY, sort: [{ field: "Listing.listPrice", direction: "asc" }] },
  },
];
const [G1, G2] = VIEWS;

const units = sampleUnits().map((u) => ({ ...u, subdivisionName: subdivisionNameOf(u) }));
const sample = buildSampleListings({ companyId: SAMPLE_COMPANY.id, units });
const rows = inventoryRows({
  listings: sample.listings,
  listingUnits: sample.listingUnits,
  units,
}) as GridRow[];
const HEADERS = Object.fromEntries(INVENTORY_FIELDS.map((f) => [f, f.split(".")[1]!])) as Record<
  InventoryField,
  string
>;
void typedColumn;

function shell(views: SavedView[] | null, open: SavedView | null = null) {
  return render(
    <SessionRoles roles={["ListAgent"]}>
      <PlaceChangeProvider>
        <AppShell
          nav={navFor({ savedViews: savedViewsSection(views, LABELS) })}
          roles={["ListAgent"]}
        >
          <InventoryGrid
            title="Hàng"
            headers={HEADERS}
            rows={rows}
            state="ready"
            emptyWhy="x"
            reloadLabel="Tải lại"
            savedViews={views}
            openView={open}
            viewLabels={LABELS}
          />
        </AppShell>
      </PlaceChangeProvider>
    </SessionRoles>,
  );
}

const column = () =>
  document.querySelector<HTMLElement>('[data-slot="app-shell-second-column"]') as HTMLElement;
const lit = () => [...column().querySelectorAll<HTMLElement>('a[aria-current="true"]')];

/** Exactly one entry lit; throws with how many when not. */
function checkOneLit(links: readonly HTMLElement[]): HTMLElement {
  if (links.length !== 1) throw new Error(`more than one item active: ${links.length}`);
  return links[0]!;
}

describe("one entry lit", () => {
  const MATRIX: [string, string, string][] = [
    ["", "", ALL_TITLE],
    ["status=Active", "", "Đang bán"],
    [`goc-nhin=${G1!.id}`, "", G1!.name],
    [`goc-nhin=${G2!.id}`, "", G2!.name],
    ["goc-nhin=khong-co", "", ALL_TITLE],
  ];

  it.each(MATRIX)("/inventory?%s", (search, _, want) => {
    where.search = search;
    shell(VIEWS, VIEWS.find((v) => search.endsWith(v.id)) ?? null);
    const one = checkOneLit(lit());
    expect(one.textContent).toContain(want);
  });

  it("5 addresses written ahead, the views group drawn like the other entries", () => {
    expect(MATRIX).toHaveLength(5);
    shell(VIEWS);
    const group = within(column())
      .getByText(COPY.mine)
      .closest('[data-sidebar="group"]') as HTMLElement;
    expect(group.querySelectorAll('[data-sidebar="menu-sub-button"]')).toHaveLength(3);
    expect(group.querySelectorAll('[data-slot="row-actions"]')).toHaveLength(3);
    expect(group.textContent).not.toMatch(/\d+ (căn|dòng)/);
  });

  it("the check fails when entries light by address prefix", () => {
    where.search = `goc-nhin=${G1!.id}`;
    shell(VIEWS, G1!);
    const here = `/inventory?${where.search}`;
    const byPrefix = [...column().querySelectorAll<HTMLAnchorElement>("a[href]")].filter((a) =>
      here.startsWith(a.getAttribute("href")!),
    );
    expect(() => checkOneLit(byPrefix)).toThrow("more than one item active: 2");
  });
});

describe("changed mark and save buttons", () => {
  it("marks the open view while the grid differs from what was saved, and only then offers both saves", () => {
    where.search = `goc-nhin=${G1!.id}`;
    shell(VIEWS, G1!);
    const mark = () => column().querySelectorAll('[data-slot="place-changed"]');
    expect(mark()).toHaveLength(0);
    expect(screen.queryByRole("button", { name: LABELS.saveChanges })).toBeNull();
    expect(screen.getByRole("button", { name: LABELS.save })).toBeTruthy();

    // Row 2e: the region has no search box (owner 2026-11-13); text typed in a column filter is part of the view.
    expect(screen.queryAllByRole("searchbox")).toHaveLength(0);
    const code = screen.getByLabelText("Lọc cột unitNumber") as HTMLInputElement;
    const before = code.value;
    fireEvent.change(code, { target: { value: `${before}S1.02` } });
    expect(mark()).toHaveLength(1);
    fireEvent.change(code, { target: { value: before } });
    expect(mark()).toHaveLength(0);
    expect(screen.queryByRole("button", { name: LABELS.saveChanges })).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: /^Nhóm theo/ }));
    expect(mark()).toHaveLength(1);
    expect(lit()[0]!.querySelector('[data-slot="place-changed"]')).not.toBeNull();
    expect(screen.getByRole("button", { name: LABELS.saveChanges })).toBeTruthy();
    expect(screen.getByRole("button", { name: LABELS.saveAsNew })).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: /^Nhóm theo/ }));
    expect(mark()).toHaveLength(0);
    expect(screen.queryByRole("button", { name: LABELS.saveChanges })).toBeNull();
  });
});

describe("naming dialog", () => {
  const dialog = () => document.querySelector<HTMLElement>('[data-slot="view-name-dialog"]');
  const nameBox = () => within(dialog()!).getByLabelText(COPY.nameLabel) as HTMLInputElement;
  async function openSave() {
    fireEvent.click(screen.getByRole("button", { name: LABELS.save }));
    await waitFor(() => expect(dialog()).not.toBeNull());
  }
  async function submit() {
    await act(async () => {
      fireEvent.submit(nameBox().closest("form")!);
    });
  }

  /** After a failed save the dialog is still open and keeps what was typed. */
  function checkKept(open: HTMLElement | null, typed: string, value: string | undefined): void {
    if (!open || value !== typed) throw new Error("typed name lost on failed save");
  }

  it("an empty name keeps the dialog open with the sentence under the field", async () => {
    shell(VIEWS);
    await openSave();
    await submit();
    expect(dialog()).not.toBeNull();
    expect(within(dialog()!).getByText(COPY.nameErrors["name-empty"])).toBeTruthy();
    expect(nameBox().getAttribute("aria-invalid")).toBe("true");
  });

  it("a taken name (another case) is refused under the field before sending", async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
    shell(VIEWS);
    await openSave();
    fireEvent.change(nameBox(), { target: { value: G1!.name.toUpperCase() } });
    await submit();
    expect(within(dialog()!).getByText(COPY.nameErrors["name-taken"])).toBeTruthy();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("a failed save keeps the typed name, says so and offers «Thử lại»", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("{}", { status: 500 })),
    );
    shell(VIEWS);
    await openSave();
    fireEvent.change(nameBox(), { target: { value: "[MAU] Mới" } });
    await submit();
    await waitFor(() => expect(within(dialog()!).getByRole("alert").textContent).toBe(COPY.failed));
    checkKept(dialog(), "[MAU] Mới", nameBox().value);
    expect(within(dialog()!).getByRole("button", { name: FRAME_COPY.retry })).toBeTruthy();
    expect(() => checkKept(null, "[MAU] Mới", undefined)).toThrow("typed name lost on failed save");
  });

  it("a refusal (403) shows the sentence of row 9e and nothing to try again", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("{}", { status: 403 })),
    );
    shell(VIEWS);
    await openSave();
    fireEvent.change(nameBox(), { target: { value: "[MAU] Mới" } });
    await submit();
    await waitFor(() =>
      expect(within(dialog()!).getByRole("alert").textContent).toBe(FRAME_COPY.refusedAction),
    );
    expect(within(dialog()!).queryByRole("button", { name: FRAME_COPY.retry })).toBeNull();
  });

  it("a saved view opens at its address and the page refreshes", async () => {
    const saved = { ...G2!, id: "00000000-0000-4000-8000-0000000000d4", name: "[MAU] Mới" };
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => Response.json({ view: saved }, { status: 201 })),
    );
    shell(VIEWS);
    await openSave();
    fireEvent.change(nameBox(), { target: { value: "  [MAU] Mới  " } });
    await submit();
    await waitFor(() =>
      expect(router.push).toHaveBeenCalledWith(`/inventory?goc-nhin=${saved.id}`),
    );
    const body = JSON.parse(
      ((fetch as unknown as ReturnType<typeof vi.fn>).mock.calls[0]![1] as RequestInit)
        .body as string,
    );
    expect(body.name).toBe("[MAU] Mới");
    expect(Object.keys(body.view).sort()).toEqual(["filters", "grouped", "hidden", "sort"]);
  });

  it("no view yet shows the hint in the group", () => {
    shell([]);
    expect(within(column()).getByText(COPY.empty)).toBeTruthy();
  });
});

describe("views come with the first paint", () => {
  it("the server's markup already holds every view, in the desktop column and the phone sheet's (no loading state)", () => {
    const html = renderToString(
      <SessionRoles roles={["ListAgent"]}>
        <PlaceChangeProvider>
          <AppShell
            nav={navFor({ savedViews: savedViewsSection(VIEWS, LABELS) })}
            roles={["ListAgent"]}
          />
        </PlaceChangeProvider>
      </SessionRoles>,
    );
    const doc = new DOMParser().parseFromString(html, "text/html");
    const desktop = doc.querySelector('[data-slot="app-shell-second-column"]')!;
    const sheet = doc.querySelector('[data-sidebar="sidebar"] .md\\:hidden')!;
    for (const place of [desktop, sheet]) {
      for (const v of VIEWS) expect(place.textContent).toContain(v.name);
      expect(place.querySelector('[data-sidebar="menu-skeleton"]')).toBeNull();
    }
  });
});

describe("views that could not be read", () => {
  it("the group says so and the rest of the shell still works", () => {
    shell([]);
    cleanup();
    render(
      <SessionRoles roles={["ListAgent"]}>
        <PlaceChangeProvider>
          <AppShell
            nav={navFor({ savedViews: savedViewsSection("unreadable", LABELS) })}
            roles={["ListAgent"]}
          />
        </PlaceChangeProvider>
      </SessionRoles>,
    );
    expect(within(column()).getByText(COPY.unreadable)).toBeTruthy();
    expect(within(column()).getByRole("link", { name: ALL_TITLE })).toBeTruthy();
    expect(within(column()).getByRole("link", { name: "Đang bán" })).toBeTruthy();
  });
});
