"use client";

// One filter state for the grid and the second column (row 2d, AC-2..AC-6): a place picked in the column changes only
// the project and building filters, the grid's other filters kept; whatever the two filters amount to — picked or
// typed — is written to the address as `?vung=`, so the column lights that place and a reload or copied link opens it.
import { useEffect, useRef, useState } from "react";

import type { TypedColumn } from "@/components/candidate/column-kind";
import type { GridRow } from "@/components/candidate/data-region";
import type { GridView } from "@/components/candidate/grid-view";
import { usePlaceChange } from "@/components/templates/app-shell/place-change";

import { GEO_PARAM, geoFiltersFor, placeFor, withoutPlace, type GeoNode } from "./geo-tree";

export interface GeoPlace {
  /** Goes up by one each time a place is picked; the grid keys its region on it. */
  picked: number;
  /** The arrangement the region reopens with after a pick; undefined until one. */
  view: GridView | undefined;
}

export function useGeoPlace({
  tree,
  rows,
  columns,
  view,
  active,
}: {
  tree: readonly GeoNode[] | undefined;
  rows: readonly GridRow[];
  columns: readonly TypedColumn[];
  /** The arrangement the region last reported; null before it opens. */
  view: GridView | null;
  /** False while a saved view is open: the view keeps the lit entry, and no place is written. */
  active: boolean;
}): GeoPlace {
  const { setPick } = usePlaceChange();
  const [state, setState] = useState<GeoPlace>({ picked: 0, view: undefined });
  const latest = useRef(view);
  useEffect(() => {
    latest.current = view;
  }, [view]);

  useEffect(() => {
    if (!tree || !active) return;
    setPick((href) => {
      const url = new URL(href, "http://x");
      const key = url.searchParams.get(GEO_PARAM);
      const current = latest.current;
      if (url.pathname !== window.location.pathname || key === null || current === null)
        return false;
      const geo = geoFiltersFor(tree, [key]);
      if (Object.keys(geo).length === 0) return false;
      setState((s) => ({
        picked: s.picked + 1,
        view: { ...current, filters: { ...withoutPlace(current.filters), ...geo } },
      }));
      return true;
    });
    return () => setPick(null);
  }, [tree, active, setPick]);

  const placeKey =
    tree && view ? (placeFor(tree, rows, columns, view.filters)?.key ?? null) : undefined;
  useEffect(() => {
    if (!active || placeKey === undefined) return;
    const url = new URL(window.location.href);
    if (url.searchParams.get(GEO_PARAM) === placeKey) return;
    if (placeKey === null) url.searchParams.delete(GEO_PARAM);
    else url.searchParams.set(GEO_PARAM, placeKey);
    // Replacing the address keeps the page as it is; the second column reads it and lights the place.
    window.history.replaceState(null, "", url);
  }, [active, placeKey]);

  return state;
}
