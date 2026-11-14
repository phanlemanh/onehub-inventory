// @vitest-environment jsdom
// Row 2d (bang-hang-theo-dia-ly): the geography groups of the second column and one filter state with the grid.
//   E2 SP-1 — the files the tree goes through, and every file they import inside src/, carry no mark of SP-1 (the regex
//     read from PRODUCT-INVARIANTS.md itself) and call no data door. Break: 'new pg.Client(' in a copy of geo-tree.ts →
//     «truy van moi: geo-tree.ts».
//   E5 / E10 — a list of names on a words column matches whole names and shows joined by «, »; typed text still
//     «contains», accents and case folded. Break: whole-name matching turned into «contains» → «khop tron hong».
//   E1 / E13 — the column draws one group per project with no counts; a complex holds its buildings as one nested list of
//     the same entries; exactly one entry lit across nested ones; groups without nested entries draw as before; no units
//     → «Chưa có căn nào trên Bảng hàng.».
//   one state (K-1411-32) — picking a building while the status filter is on keeps the status filter and changes only
//     project and building. Break: a pick that drops other filters → «mat loc khac».
import { readFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

import { cleanup, fireEvent, render, waitFor, within } from "@testing-library/react";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import { navFor } from "../src/app/(app)/nav";
import { sampleBuildingPlaces, sampleInventoryRows } from "../src/app/(app)/inventory-sample-rows";
import type { GridRow } from "../src/components/candidate/data-region";
import { filterRows } from "../src/components/candidate/grid-view";
import { AppShell } from "../src/components/templates/app-shell";
import { PlaceChangeProvider } from "../src/components/templates/app-shell/place-change";
import { FRAME_COPY } from "../src/components/templates/frame-copy";
import { label } from "../src/modules/company-config";
import { SessionRoles } from "../src/modules/identity/ui";
import {
  INVENTORY_FIELDS,
  InventoryGrid,
  geoSections,
  geoTree,
  inventoryColumns,
  inventoryFiltersFrom,
  type InventoryField,
} from "../src/modules/listings/ui";
import { tallGridViewport } from "./virtual-viewport";

const where = vi.hoisted(() => ({ pathname: "/inventory", search: "" }));
vi.mock("next/navigation", () => ({
  usePathname: () => where.pathname,
  useSearchParams: () => new URLSearchParams(where.search),
  useRouter: () => ({ refresh: vi.fn(), push: vi.fn() }),
}));
vi.mock("sonner", () => ({ toast: Object.assign(vi.fn(), { error: vi.fn(), success: vi.fn() }) }));

const ROOT = resolve(__dirname, "..");
const ROWS = sampleInventoryRows() as GridRow[];
const TREE = geoTree(ROWS, sampleBuildingPlaces());
const HEADERS = Object.fromEntries(
  INVENTORY_FIELDS.map((f) => [
    f,
    f === "Listing.subdivisionName" ? "Dự án" : f === "Listing.buildingName" ? "Toà" : f,
  ]),
) as Record<InventoryField, string>;
const COLUMNS = inventoryColumns(HEADERS);
const P1 = "Vinhomes Ocean Park 1";
const EMPTY = `Chưa có ${label("Unit").toLocaleLowerCase("vi")} nào trên ${label("Inventory")}.`;
const WORDS = { all: FRAME_COPY.secondColumn.all, emptyTitle: label("Subdivision"), empty: EMPTY };

beforeAll(() => {
  tallGridViewport();
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
});
beforeEach(() => {
  where.pathname = "/inventory";
  where.search = "";
  window.history.replaceState(null, "", "/inventory");
});
afterEach(cleanup);

// ---------------------------------------------------------------------------------------------------------------- E2

/** The marks of SP-1, read from the rule file itself, never copied by hand. */
function sp1Marks(): RegExp {
  const text = readFileSync(join(ROOT, "PRODUCT-INVARIANTS.md"), "utf8");
  const section = text.slice(text.indexOf("## SP-1"), text.indexOf("## SP-2"));
  const mark = /- Dấu hiệu: `(.+)`/.exec(section)?.[1];
  if (!mark) throw new Error("SP-1 has no mark");
  return new RegExp(mark);
}

function resolveImport(from: string, spec: string): string | null {
  const base = spec.startsWith("@/")
    ? join(ROOT, "src", spec.slice(2))
    : spec.startsWith(".")
      ? resolve(dirname(from), spec)
      : null;
  if (!base) return null;
  for (const c of [
    base,
    `${base}.ts`,
    `${base}.tsx`,
    join(base, "index.ts"),
    join(base, "index.tsx"),
  ])
    if (existsSync(c) && !c.endsWith("/")) {
      try {
        readFileSync(c);
        return c;
      } catch {
        // a folder
      }
    }
  return null;
}

/** Every file reached from `start` through imports inside src/. */
function reach(start: readonly string[]): string[] {
  const seen = new Set<string>();
  const todo = start.map((f) => join(ROOT, f));
  while (todo.length) {
    const file = todo.pop()!;
    if (seen.has(file)) continue;
    seen.add(file);
    const text = readFileSync(file, "utf8");
    for (const m of text.matchAll(/from\s+"([^"]+)"/g)) {
      const next = resolveImport(file, m[1]!);
      if (next && next.startsWith(join(ROOT, "src")) && !next.includes("/generated/"))
        todo.push(next);
    }
  }
  return [...seen].map((f) => f.slice(ROOT.length + 1)).sort();
}

/** The files carrying an SP-1 mark or a data door; throws naming the first. */
function checkNoNewRead(files: Record<string, string>): void {
  const marks = sp1Marks();
  for (const [file, text] of Object.entries(files))
    if (marks.test(text) || /withCompany\(|mySavedViews\(/.test(text))
      throw new Error(`truy van moi: ${file.split("/").at(-1)}`);
}

describe("E2 — the tree reads only the grid's rows (SP-1)", () => {
  // The five files the tree goes through, written ahead.
  const FIVE = [
    "src/modules/listings/ui/geo-tree.ts",
    "src/app/(app)/layout.tsx",
    "src/app/(app)/inventory/page.tsx",
    "src/app/(app)/inventory-sample-rows.ts",
    "src/components/templates/app-shell/second-column.tsx",
  ];
  // The screens themselves read sessions and saved views through their doors already; the tree adds nothing there, so
  // the import walk starts from the pure files and the screens are read on their own.
  const WALK = [FIVE[0]!, FIVE[3]!, FIVE[4]!, "src/modules/listings/ui/use-geo-place.ts"];

  it("5 files written ahead; nothing they reach carries an SP-1 mark or a data door", () => {
    expect(FIVE).toHaveLength(5);
    const files = reach(WALK);
    console.log(`quet ${files.length} tep:\n${files.join("\n")}`);
    expect(files.length).toBeGreaterThan(WALK.length);
    checkNoNewRead(Object.fromEntries(files.map((f) => [f, readFileSync(join(ROOT, f), "utf8")])));
  });

  it("the screens' geography lines read only the sample rows and the catalog", () => {
    for (const f of [FIVE[1]!, FIVE[2]!]) {
      const lines = readFileSync(join(ROOT, f), "utf8")
        .split("\n")
        .filter((l) => /geo(Tree|Sections|FiltersFor)\(/.test(l));
      expect(lines.length).toBeGreaterThan(0);
      for (const l of lines) expect(l).not.toMatch(/withCompany|mySavedView|await/);
    }
  });

  it("break: a new read in geo-tree.ts is caught", () => {
    const text = readFileSync(join(ROOT, FIVE[0]!), "utf8") + "\nconst c = new pg.Client(url);\n";
    expect(() => checkNoNewRead({ [FIVE[0]!]: text })).toThrow("truy van moi: geo-tree.ts");
  });
});

// ------------------------------------------------------------------------------------------------------- E5 / E10

describe("E5 / E10 — whole names for a list, «contains» for typed text", () => {
  const twin = (project: string, id: string) => ({
    ...ROWS[0]!,
    id,
    "Listing.subdivisionName": project,
  });
  const rows = [twin("Vinhomes Ocean Park 1", "a"), twin("Vinhomes Ocean Park 10", "b")];
  const contains = (list: readonly string[], value: string) => list.some((n) => value.includes(n));

  /** A list keeps exactly the rows whose name is one of the list's; throws when it keeps more. */
  function checkWhole(kept: readonly GridRow[]): void {
    if (kept.length !== 1 || kept[0]!.id !== "a") throw new Error("khop tron hong");
  }

  it("a list of names keeps «Park 1» only; typed «Park 1» keeps both", () => {
    checkWhole(filterRows(rows, COLUMNS, { "Listing.subdivisionName": ["Vinhomes Ocean Park 1"] }));
    expect(
      filterRows(rows, COLUMNS, { "Listing.subdivisionName": "Vinhomes Ocean Park 1" }),
    ).toHaveLength(2);
  });

  it("break: «contains» for a list is caught", () => {
    const loose = rows.filter((r) =>
      contains(["Vinhomes Ocean Park 1"], String(r["Listing.subdivisionName"])),
    );
    expect(() => checkWhole(loose)).toThrow("khop tron hong");
  });

  it("typed text on the inventory still folds accents and case (Căn, Toà, Dự án)", () => {
    expect(filterRows(ROWS, COLUMNS, { "Listing.buildingName": "s1.0" })).toHaveLength(36);
    expect(filterRows(ROWS, COLUMNS, { "Listing.subdivisionName": "park" })).toHaveLength(60);
    expect(filterRows(ROWS, COLUMNS, { "Listing.subdivisionName": "TOÀ" })).toHaveLength(0);
    expect(filterRows(ROWS, COLUMNS, { "Listing.subdivisionName": "the crown" })).toHaveLength(12);
    const unit = INVENTORY_FIELDS[0]!;
    // The unit code typed in lower case, a part of it only: «contains», case folded.
    const part = String(ROWS[0]![unit]).slice(0, 3).toLowerCase();
    expect(filterRows(ROWS, COLUMNS, { [unit]: part }).length).toBeGreaterThan(0);
  });

  it("design/behaviors.md says a list of names matches whole names", () => {
    expect(readFileSync(join(ROOT, "design/behaviors.md"), "utf8")).toMatch(
      /danh sách tên khớp trọn/,
    );
  });
});

// ------------------------------------------------------------------------------------------------- render: column

function shell(rows: readonly GridRow[], filters = {}) {
  const tree = geoTree(rows, sampleBuildingPlaces());
  return render(
    <SessionRoles roles={["ListAgent"]}>
      <PlaceChangeProvider>
        <AppShell nav={navFor({ geography: geoSections(tree, WORDS) })} roles={["ListAgent"]}>
          <InventoryGrid
            title="Hàng"
            headers={HEADERS}
            rows={rows}
            state="ready"
            emptyWhy="x"
            reloadLabel="Tải lại"
            filters={filters}
            geoTree={tree}
          />
        </AppShell>
      </PlaceChangeProvider>
    </SessionRoles>,
  );
}

const column = () => document.querySelector<HTMLElement>('[data-slot="app-shell-second-column"]')!;
const groupOf = (title: string) =>
  within(column())
    .getByText(title, { selector: '[data-sidebar="group-label"]' })
    .closest<HTMLElement>('[data-sidebar="group"]')!;

describe("E1 / E13 — the second column", () => {
  it("one group per project after the statuses, no counts, a complex holding its buildings", () => {
    shell(ROWS);
    const titles = [...column().querySelectorAll('[data-sidebar="group-label"]')].map(
      (e) => e.textContent,
    );
    const at = titles.indexOf(FRAME_COPY.secondColumn.byStatus);
    expect(titles.slice(at + 1, at + 4)).toEqual([
      P1,
      "Vinhomes Ocean Park 2 – The Empire",
      "Vinhomes Ocean Park 3 – The Crown",
    ]);
    const p1 = groupOf(P1);
    expect(p1.querySelectorAll('[data-slot="place-count"]')).toHaveLength(0);
    expect(p1.textContent).not.toMatch(/\d+ (căn|dòng)/);
    const complex = within(p1).getByRole("link", { name: "The Sapphire 1" }).closest("li")!;
    const nested = complex.querySelector('[data-sidebar="menu-sub"]')!;
    expect([...nested.querySelectorAll("a")].map((a) => a.textContent)).toEqual([
      "S1.01",
      "S1.02",
      "S1.03",
      "S1.05",
    ]);
    expect(document.querySelectorAll('[data-slot="geo-tree"]')).toHaveLength(0);
  });

  it("exactly one entry lit, counted across nested entries", () => {
    const s103 = TREE[0]!.children[0]!.children.find((n) => n.name === "S1.03")!;
    where.search = new URLSearchParams({ status: "Active", vung: s103.key }).toString();
    shell(ROWS);
    const lit = [...column().querySelectorAll('a[aria-current="true"]')];
    expect(lit.map((a) => a.textContent)).toEqual(["S1.03"]);
  });

  it("groups without nested entries draw as before", () => {
    shell(ROWS);
    const status = groupOf(FRAME_COPY.secondColumn.byStatus);
    expect(status.querySelectorAll('[data-sidebar="menu-sub"]')).toHaveLength(1);
  });

  it("no units: one group says so; 60 rows: the sentence is not there", () => {
    shell([]);
    expect(column().textContent).toContain(EMPTY);
    cleanup();
    shell(ROWS);
    expect(column().textContent).not.toContain(EMPTY);
  });
});

// ------------------------------------------------------------------------------------------------ render: one state

const box = (header: string) =>
  document.querySelector<HTMLInputElement>(`input[aria-label*="${header}"]`)!;
const footer = () => /(\d+) \/ 60 dòng/.exec(document.body.textContent ?? "")?.[1];

/** The box holds the whole name and reads it whole on hover (AC-3, revised after the scope gate); throws otherwise. */
function checkReadsWhole(input: HTMLInputElement, whole: string): void {
  if (input.value !== whole || input.title !== whole) throw new Error(`ten o loc cat: ${whole}`);
}

/** After a pick the status filter is still on; throws when the pick dropped it. */
function checkKept(statusKept: boolean): void {
  if (!statusKept) throw new Error("mat loc khac");
}

describe("one filter state", () => {
  it("picking a building keeps the status filter and fills the project and building boxes", async () => {
    const filters = inventoryFiltersFrom("Active");
    shell(ROWS, filters);
    const before = footer();
    fireEvent.click(within(groupOf(P1)).getByRole("link", { name: "S1.03" }));
    const want = filterRows(ROWS, COLUMNS, {
      ...filters,
      "Listing.subdivisionName": [P1],
      "Listing.buildingName": ["S1.03"],
    }).length;
    await waitFor(() => expect(footer()).toBe(String(want)));
    expect(footer()).not.toBe(before);
    checkKept(want < filterRows(ROWS, COLUMNS, { "Listing.buildingName": ["S1.03"] }).length);
    expect(box("Dự án").value).toBe(P1);
    expect(box("Toà").value).toBe("S1.03");
    await waitFor(() =>
      expect(new URL(window.location.href).searchParams.get("vung")).toContain("S1.03"),
    );
  });

  it("break: a pick that drops other filters is caught", () => {
    expect(() => checkKept(false)).toThrow("mat loc khac");
  });

  it("a complex fills the building box with its buildings joined by «, »", async () => {
    shell(ROWS);
    fireEvent.click(within(groupOf(P1)).getByRole("link", { name: "The Sapphire 1" }));
    await waitFor(() => expect(box("Toà").value).toBe("S1.01, S1.02, S1.03, S1.05"));
    expect(footer()).toBe("36");
    checkReadsWhole(box("Dự án"), P1);
    checkReadsWhole(box("Toà"), "S1.01, S1.02, S1.03, S1.05");
  });

  it("break: a box that reads a cut name is caught", () => {
    const input = document.createElement("input");
    input.value = P1;
    input.title = "Vinhomes Ocean P";
    expect(() => checkReadsWhole(input, P1)).toThrow(`ten o loc cat: ${P1}`);
  });
});
