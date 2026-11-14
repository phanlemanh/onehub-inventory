// Row 2d (bang-hang-theo-dia-ly), E1, E3, E6: the geography tree read from the grid's own rows and the catalog, the
// filters a place asks for, and the place a set of filters amounts to.
//   tree — built from sampleInventoryRows() and sampleBuildingPlaces() (the real writers, no hand-written rows), it
//     matches a matrix of 10 places written ahead, in catalog order and parent → child. Breaks: drop every row of
//     S1.02 → «noi mat: S1.02»; an empty building in the catalog → «noi rong hien: <toà>».
//   filters — each of the 10 places filters exactly its rows, by id set, with the counts written ahead.
//   placeFor — 7 cases written ahead, plus «Park 1» against «Park 10»; each pins «noi lech: <ca>».
import { describe, expect, it } from "vitest";

import {
  sampleBuildingPlaces,
  sampleInventoryRows,
} from "../../../app/(app)/inventory-sample-rows";
import type { GridRow } from "../../../components/candidate/data-region";
import { filterRows, type ColumnFilters } from "../../../components/candidate/grid-view";

import {
  geoFiltersFor,
  geoSections,
  geoTree,
  placeFor,
  withoutPlace,
  type BuildingPlace,
  type GeoNode,
} from "./geo-tree";
import { INVENTORY_FIELDS, inventoryColumns, type InventoryField } from "./inventory-rows";

const ROWS = sampleInventoryRows() as GridRow[];
const PLACES = sampleBuildingPlaces();
const HEADERS = Object.fromEntries(INVENTORY_FIELDS.map((f) => [f, f])) as Record<
  InventoryField,
  string
>;
const COLUMNS = inventoryColumns(HEADERS);
const P1 = "Vinhomes Ocean Park 1";
const P2 = "Vinhomes Ocean Park 2 – The Empire";
const P3 = "Vinhomes Ocean Park 3 – The Crown";

/** The 10 places written ahead: name, depth, rows. */
const MATRIX: [string, number, number][] = [
  [P1, 0, 36],
  ["The Sapphire 1", 1, 36],
  ["S1.01", 2, 6],
  ["S1.02", 2, 9],
  ["S1.03", 2, 10],
  ["S1.05", 2, 11],
  [P2, 0, 12],
  ["[MAU] Toà E1", 1, 12],
  [P3, 0, 12],
  ["[MAU] Toà C1", 1, 12],
];

function walk(nodes: readonly GeoNode[], depth = 0): [string, number, number][] {
  return nodes.flatMap((n) => [
    [n.name, depth, n.count] as [string, number, number],
    ...walk(n.children, depth + 1),
  ]);
}

/** Every place of the matrix shows, and nothing else; throws naming the first one missing or extra. */
function checkPlaces(tree: readonly GeoNode[], want: readonly [string, number, number][]): void {
  const got = walk(tree);
  for (const w of want) if (!got.some((g) => g[0] === w[0])) throw new Error(`noi mat: ${w[0]}`);
  for (const g of got)
    if (!want.some((w) => w[0] === g[0])) throw new Error(`noi rong hien: ${g[0]}`);
  expect(got).toEqual(want);
}

const node = (tree: readonly GeoNode[], name: string): GeoNode =>
  flat(tree).find((n) => n.name === name)!;
const flat = (nodes: readonly GeoNode[]): GeoNode[] =>
  nodes.flatMap((n) => [n, ...flat(n.children)]);
const ids = (rows: readonly GridRow[]) => rows.map((r) => r.id).sort();

describe("tree", () => {
  const tree = geoTree(ROWS, PLACES);

  it("10 places written ahead, in catalog order, parent → child", () => {
    expect(MATRIX).toHaveLength(10);
    checkPlaces(tree, MATRIX);
  });

  it("break: dropping every row of S1.02 is caught", () => {
    const without = ROWS.filter((r) => r["Listing.buildingName"] !== "S1.02");
    expect(() => checkPlaces(geoTree(without, PLACES), MATRIX)).toThrow("noi mat: S1.02");
  });

  it("break: an empty building in the catalog would be caught", () => {
    const bad = geoTree(ROWS, PLACES);
    bad[0]!.children[0]!.children.push({
      kind: "building",
      key: "x",
      name: "S1.09",
      count: 0,
      children: [],
    });
    expect(() => checkPlaces(bad, MATRIX)).toThrow("noi rong hien: S1.09");
  });

  it("a place without rows does not show; a building the catalog does not know stands under its project", () => {
    const places: BuildingPlace[] = [
      ...PLACES,
      { project: P1, complex: "The Sapphire 1", building: "S1.09" },
    ];
    expect(walk(geoTree(ROWS, places)).map((w) => w[0])).not.toContain("S1.09");
    const stray = [...ROWS, { ...ROWS[0]!, id: "la", "Listing.buildingName": "[MAU] Toà lạ" }];
    const p1 = geoTree(stray, PLACES)[0]!;
    expect(p1.children.map((c) => c.name)).toEqual(["The Sapphire 1", "[MAU] Toà lạ"]);
  });

  it("no rows: an empty tree, and the second column says so in one group", () => {
    expect(geoTree([], PLACES)).toEqual([]);
    const words = { all: "Tất cả", emptyTitle: "Dự án", empty: "Chưa có căn nào trên Bảng hàng." };
    expect(geoSections([], words)).toEqual([{ title: "Dự án", items: [], empty: words.empty }]);
    const full = geoSections(tree, words);
    expect(full.map((s) => s.title)).toEqual([P1, P2, P3]);
    expect(full.some((s) => s.empty)).toBe(false);
  });

  it("the second column's entries: «Tất cả» first, complexes holding their buildings, no counts", () => {
    const [p1, p2] = geoSections(tree, { all: "Tất cả", emptyTitle: "", empty: "" });
    expect(p1!.items.map((i) => i.title)).toEqual(["Tất cả", "The Sapphire 1"]);
    expect(p1!.items[1]!.children!.map((i) => i.title)).toEqual([
      "S1.01",
      "S1.02",
      "S1.03",
      "S1.05",
    ]);
    expect(p2!.items.map((i) => i.title)).toEqual(["Tất cả", "[MAU] Toà E1"]);
    expect(JSON.stringify(p1)).not.toMatch(/"count"/);
  });
});

describe("filters", () => {
  const tree = geoTree(ROWS, PLACES);

  it.each(MATRIX)("%s filters exactly its rows", (name, _depth, count) => {
    const n = node(tree, name);
    const got = ids(filterRows(ROWS, COLUMNS, geoFiltersFor(tree, [n.key])));
    const project = n.key.split("›")[0];
    const buildings = new Set(
      flat([n])
        .filter((x) => x.kind === "building")
        .map((x) => x.name),
    );
    const want = ids(
      ROWS.filter(
        (r) =>
          r["Listing.subdivisionName"] === project &&
          (n.kind === "project" || buildings.has(String(r["Listing.buildingName"]))),
      ),
    );
    for (const id of got) if (!want.includes(id)) throw new Error(`thua dong: ${id}`);
    expect(got).toEqual(want);
    expect(got).toHaveLength(count);
  });

  it("a complex asks for its project and its buildings; a project for its name only", () => {
    expect(geoFiltersFor(tree, [node(tree, "The Sapphire 1").key])).toEqual({
      "Listing.subdivisionName": [P1],
      "Listing.buildingName": ["S1.01", "S1.02", "S1.03", "S1.05"],
    });
    expect(geoFiltersFor(tree, [node(tree, P2).key])).toEqual({ "Listing.subdivisionName": [P2] });
    expect(geoFiltersFor(tree, ["khong-co"])).toEqual({});
  });

  it("withoutPlace keeps every other filter", () => {
    expect(
      withoutPlace({
        "Listing.subdivisionName": [P1],
        "Listing.buildingName": "S1",
        "Listing.standardStatus": "Active",
      }),
    ).toEqual({ "Listing.standardStatus": "Active" });
  });
});

describe("placeFor", () => {
  const tree = geoTree(ROWS, PLACES);
  const key = (name: string) => node(tree, name).key;
  const CASES: [string, ColumnFilters, string | null][] = [
    ["dự án", geoFiltersFor(tree, [key(P1)]), key(P1)],
    ["phân khu", geoFiltersFor(tree, [key("The Sapphire 1")]), key("The Sapphire 1")],
    ["toà", geoFiltersFor(tree, [key("S1.03")]), key("S1.03")],
    [
      "thiếu một toà",
      { "Listing.subdivisionName": [P1], "Listing.buildingName": ["S1.01", "S1.02", "S1.03"] },
      null,
    ],
    ["chữ một phần", { "Listing.subdivisionName": "park" }, null],
    ["chữ trọn tên toà", { "Listing.buildingName": "s1.02" }, key("S1.02")],
    ["không lọc", { "Listing.standardStatus": "Active" }, null],
  ];

  it.each(CASES)("%s", (name, filters, want) => {
    const got = placeFor(tree, ROWS, COLUMNS, filters)?.key ?? null;
    if (got !== want) throw new Error(`noi lech: ${name}`);
  });

  it("7 cases written ahead", () => expect(CASES).toHaveLength(7));

  it("«Park 1» typed takes «Park 10» too, so no place lights; picked, it lights Park 1", () => {
    const ten = ROWS.filter((r) => r["Listing.subdivisionName"] === P2).map((r) => ({
      ...r,
      id: `10-${r.id}`,
      "Listing.subdivisionName": "Vinhomes Ocean Park 10",
    }));
    const rows = [...ROWS, ...ten];
    const t = geoTree(rows, PLACES);
    const p1 = t.find((n) => n.name === P1)!;
    expect(placeFor(t, rows, COLUMNS, { "Listing.subdivisionName": P1 })).toBeNull();
    expect(placeFor(t, rows, COLUMNS, { "Listing.subdivisionName": [P1] })?.key).toBe(p1.key);
  });
});
