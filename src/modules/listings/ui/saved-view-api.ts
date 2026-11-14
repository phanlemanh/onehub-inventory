// The browser's side of /api/v1/saved-views (row 2c): addresses, the stored shape of a view and how an answer reads.
// The requests themselves sit in the components that send them, each behind its row of the permission table (row 9e).
import { sameView, type GridView } from "@/components/candidate/grid-view";

import type { SavedView, SavedViewNameError, SavedViewState } from "../saved-view";

/** Where a saved view of the inventory opens: its own address, so a reload or another session opens it too. */
export const SAVED_VIEW_PARAM = "goc-nhin";

export function savedViewHref(id: string): string {
  return `/inventory?${SAVED_VIEW_PARAM}=${encodeURIComponent(id)}`;
}

export type SaveOutcome =
  | { ok: true; view: SavedView }
  | { ok: false; error: SavedViewNameError | "refused" | "gone" | "failed" };

const NAME_ERRORS: readonly string[] = ["name-empty", "name-too-long", "name-taken"];

/** The grid's arrangement as a view stores it (plain arrays and records, nothing else; the four things of a view). */
export function storedView(view: GridView): SavedViewState {
  return {
    filters: Object.fromEntries(
      Object.entries(view.filters).map(([field, value]) => [
        field,
        typeof value === "string" ? value : [...(value as readonly string[])],
      ]),
    ),
    sort: view.sort.map((s) => ({ field: s.field, direction: s.direction })),
    grouped: view.grouped,
    hidden: [...view.hidden],
  };
}

/**
 * A stored view as the grid opens it: only its four things, so a search text left in old data or an old address is
 * dropped (row 2e: the region has no search box). Fields the grid no longer has are dropped by the grid.
 */
export function gridView(view: SavedViewState): GridView {
  const { filters, sort, grouped, hidden } = view as unknown as GridView;
  return { filters, sort, grouped, hidden };
}

/** True when the grid shows what the view stored. */
export function sameAsStored(current: GridView, stored: GridView): boolean {
  return sameView(current, stored);
}

/** Reads the server's answer to a save or an edit; a request that never got one is `failed`. */
export async function readOutcome(request: Promise<Response>): Promise<SaveOutcome> {
  try {
    const res = await request;
    if (res.ok) {
      const body = (await res.json()) as { view?: SavedView };
      return body.view ? { ok: true, view: body.view } : { ok: false, error: "failed" };
    }
    if (res.status === 403) return { ok: false, error: "refused" };
    if (res.status === 404) return { ok: false, error: "gone" };
    if (res.status === 400) {
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (body.error && NAME_ERRORS.includes(body.error))
        return { ok: false, error: body.error as SavedViewNameError };
    }
    return { ok: false, error: "failed" };
  } catch {
    return { ok: false, error: "failed" };
  }
}

export const JSON_HEADERS = { "content-type": "application/json" };
