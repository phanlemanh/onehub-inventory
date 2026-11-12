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
 * The signed-in person's saved views of one screen, for the App Shell's second column — or null when there is no
 * session, the database is not configured here, or the person's roles do not list saved views.
 */
export async function mySavedViews(screen: SavedViewScreen): Promise<SavedView[] | null> {
  const door = await sessionDoor("listSavedViews");
  if (typeof door === "string") return null;
  const run: RunAs = (fn) => withCompany(door.pool, door.ctx, fn);
  return listSavedViews(run, door.ctx.userId, screen);
}

/** One of the signed-in person's own views, or null when it is gone, someone else's, or not readable. */
export async function mySavedView(id: string): Promise<SavedView | null> {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) return null;
  const door = await sessionDoor("listSavedViews");
  if (typeof door === "string") return null;
  const run: RunAs = (fn) => withCompany(door.pool, door.ctx, fn);
  return readSavedView(run, door.ctx.userId, id);
}
