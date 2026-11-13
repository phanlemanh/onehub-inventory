// Saved views of a grid screen (row 2c, ontology/entities/SavedView.yaml): the shape of what a view holds and the one
// name rule, used by the naming dialog in the browser and by the API on the server — the same function in both.
import { z } from "zod";

/** Screens that keep saved views. Each new grid screen adds itself here and to the CHECK of saved_view. */
export const SAVED_VIEW_SCREENS = ["inventory"] as const;
export type SavedViewScreen = (typeof SAVED_VIEW_SCREENS)[number];

export const SAVED_VIEW_NAME_MAX = 40;

/** The API door of saved views: list and save here, edit and remove at `<base>/<id>`. */
export const SAVED_VIEWS_BASE_PATH = "/api/v1/saved-views";

/**
 * The four things a view holds, and nothing else: each column's filter (text, or a set of values), the sort, grouping
 * on or off, and the hidden columns. The search text is not part of a view (the owner, 2026-11-13: searching moves to
 * the top bar), nor are full screen, the selected cell, open groups and the scroll position.
 */
export const SavedViewState = z
  .object({
    filters: z.record(z.string().min(1), z.union([z.string(), z.array(z.string()).max(50)])),
    sort: z
      .array(z.object({ field: z.string().min(1), direction: z.enum(["asc", "desc"]) }).strict())
      .max(5),
    grouped: z.boolean(),
    hidden: z.array(z.string().min(1)).max(100),
  })
  .strict();
export type SavedViewState = z.infer<typeof SavedViewState>;

/** One saved view as the second column and the grid read it. */
export interface SavedView {
  id: string;
  screen: SavedViewScreen;
  name: string;
  view: SavedViewState;
}

export type SavedViewNameError = "name-empty" | "name-too-long" | "name-taken";

/** The name as it is stored: trimmed both ends. */
export function normalizeViewName(name: string): string {
  return name.normalize("NFC").trim();
}

/**
 * Why `name` cannot name a view, or null. `taken` are the names of the same person's other views of the same screen
 * (the view being renamed is left out by the caller); case does not count, so «S1 đang bán» and «s1 ĐANG BÁN» clash.
 */
export function checkViewName(name: string, taken: readonly string[]): SavedViewNameError | null {
  const n = normalizeViewName(name);
  if (n.length === 0) return "name-empty";
  if ([...n].length > SAVED_VIEW_NAME_MAX) return "name-too-long";
  const key = n.toLocaleLowerCase("vi");
  if (taken.some((t) => normalizeViewName(t).toLocaleLowerCase("vi") === key)) return "name-taken";
  return null;
}
