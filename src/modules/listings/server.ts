import "server-only";

// Server API of the listings module. Saved views (row 2c) go through the identity module's shared action door and its
// query door, withCompany; nothing here reads a session or a table by itself.
import { actionDoor, sessionDoor, withCompany } from "@/modules/identity/server";

import type { SavedView, SavedViewScreen } from "./saved-view";
import { listSavedViews, readSavedView, type RunAs } from "./saved-views";
import { createSavedViewsHandlers, type SavedViewsHandlers } from "./saved-views-http";

export {
  createSavedViewsHandlers,
  type SavedViewsDeps,
  type SavedViewsHandlers,
} from "./saved-views-http";

let handlers: SavedViewsHandlers | undefined;

/** The handlers behind /api/v1/saved-views. */
export function savedViewsHandlers(): SavedViewsHandlers {
  handlers ??= createSavedViewsHandlers({ door: actionDoor, withCompany });
  return handlers;
}

/**
 * The signed-in person's saved views of one screen, for the App Shell's second column: the list; null when there is
 * no session or the person's roles do not list saved views; "unreadable" when the database could not be read (not
 * configured here, or it failed), so the column says so and the rest of the shell still works.
 */
export async function mySavedViews(
  screen: SavedViewScreen,
): Promise<SavedView[] | null | "unreadable"> {
  try {
    const door = await sessionDoor("listSavedViews");
    if (door === "server-error") return "unreadable";
    if (typeof door === "string") return null;
    const run: RunAs = (fn) => withCompany(door.pool, door.ctx, fn);
    return await listSavedViews(run, door.ctx.userId, screen);
  } catch (err) {
    console.error("[goc-nhin] không đọc được:", err instanceof Error ? err.message : "không rõ");
    return "unreadable";
  }
}

/** One of the signed-in person's own views, or null when it is gone, someone else's, or not readable. */
export async function mySavedView(id: string): Promise<SavedView | null> {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) return null;
  try {
    const door = await sessionDoor("listSavedViews");
    if (typeof door === "string") return null;
    const run: RunAs = (fn) => withCompany(door.pool, door.ctx, fn);
    return await readSavedView(run, door.ctx.userId, id);
  } catch (err) {
    console.error("[goc-nhin] không đọc được:", err instanceof Error ? err.message : "không rõ");
    return null;
  }
}
