// The inventory by place (roadmap row 2d): project → complex → building, each with the number of units the grid
// holds there, and the column filters one place asks for. Pure and safe on the server: it reads only the rows the
// grid already has (SP-1: no new way of reading data) and where each building stands in the catalog.
import type { ColumnFilters } from "@/components/candidate/grid-view";
import type { GridRow } from "@/components/candidate/data-region";
import type { NavLink } from "@/components/templates/app-shell";

/** Where one building stands: its project and, when public, its complex (row 7d). */
export interface BuildingPlace {
  project: string;
  complex?: string;
  building: string;
}

export type GeoKind = "project" | "complex" | "building";

/** One place of the tree. */
export interface GeoNode {
  kind: GeoKind;
  /** The address parameter value that opens this place. */
  key: string;
  name: string;
  count: number;
  children: GeoNode[];
}

/** The inventory address parameter of a place (one or several, for picking several buildings). */
export const GEO_PARAM = "vung";
const SEP = "›";

const keyOf = (...parts: (string | undefined)[]): string =>
  parts.filter((p) => p !== undefined).join(SEP);

/**
 * The tree of places that hold at least one row, in the order the catalog lists them; a building the catalog does not
 * know stands directly under its project. Buildings without a complex stand directly under their project too.
 */
export function geoTree(rows: readonly GridRow[], places: readonly BuildingPlace[]): GeoNode[] {
  const count = new Map<string, number>();
  for (const r of rows) {
    const p = String(r["Listing.subdivisionName"] ?? "").trim();
    const b = String(r["Listing.buildingName"] ?? "").trim();
    if (!p || !b) continue;
    count.set(keyOf(p, b), (count.get(keyOf(p, b)) ?? 0) + 1);
  }
  const known = [...places];
  for (const k of count.keys()) {
    const [project, building] = k.split(SEP) as [string, string];
    if (!known.some((x) => x.project === project && x.building === building))
      known.push({ project, building });
  }
  const projects: GeoNode[] = [];
  for (const place of known) {
    const n = count.get(keyOf(place.project, place.building)) ?? 0;
    if (n === 0) continue;
    let project = projects.find((x) => x.name === place.project);
    if (!project) {
      project = {
        kind: "project",
        key: keyOf(place.project),
        name: place.project,
        count: 0,
        children: [],
      };
      projects.push(project);
    }
    project.count += n;
    let parent = project;
    if (place.complex) {
      let complex = project.children.find((x) => x.kind === "complex" && x.name === place.complex);
      if (!complex) {
        complex = {
          kind: "complex",
          key: keyOf(place.project, place.complex),
          name: place.complex,
          count: 0,
          children: [],
        };
        project.children.push(complex);
      }
      complex.count += n;
      parent = complex;
    }
    parent.children.push({
      kind: "building",
      key: keyOf(place.project, place.complex ?? "", place.building),
      name: place.building,
      count: n,
      children: [],
    });
  }
  return projects;
}

function findNode(nodes: readonly GeoNode[], key: string): GeoNode | null {
  for (const n of nodes) {
    if (n.key === key) return n;
    const found = findNode(n.children, key);
    if (found) return found;
  }
  return null;
}

const buildingsUnder = (n: GeoNode): string[] =>
  n.kind === "building" ? [n.name] : n.children.flatMap(buildingsUnder);

/**
 * The column filters the chosen places ask for: whole names in the project and building columns. A project alone
 * filters the project column only; a complex or building also filters the building column to its buildings.
 */
export function geoFiltersFor(tree: readonly GeoNode[], keys: readonly string[]): ColumnFilters {
  const projects = new Set<string>();
  const buildings = new Set<string>();
  let wholeProject = false;
  for (const key of keys) {
    const node = findNode(tree, key);
    if (!node) continue;
    projects.add(key.split(SEP)[0]!);
    if (node.kind === "project") wholeProject = true;
    else for (const b of buildingsUnder(node)) buildings.add(b);
  }
  if (projects.size === 0) return {};
  const filters: ColumnFilters = { "Listing.subdivisionName": [...projects] };
  if (!wholeProject && buildings.size > 0) filters["Listing.buildingName"] = [...buildings];
  return filters;
}

/** The inventory address that opens one place. */
export function geoHref(key: string): string {
  return `/inventory?${new URLSearchParams({ [GEO_PARAM]: key })}`;
}

/** The second column's entries for the tree: each place a link to its address, with its count and the places under it. */
export function geoLinks(tree: readonly GeoNode[]): NavLink[] {
  return tree.map((n) => ({
    href: geoHref(n.key),
    title: n.name,
    count: n.count,
    children: geoLinks(n.children),
  }));
}
