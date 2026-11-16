import "server-only";

// Server API of the listings module. Saved views (row 2c) go through the identity module's shared action door and its
// query door, withCompany; nothing here reads a session or a table by itself.
import { actionDoor, sessionDoor, withCompany } from "@/modules/identity/server";

import type { InventoryData } from "./inventory-data";
import { readInventory } from "./inventory-read";
import { createListingsHandlers, type ListingsHandlers } from "./listings-http";
import type { SavedView, SavedViewScreen } from "./saved-view";
import { listSavedViews, readSavedView, type RunAs } from "./saved-views";
import { createSavedViewsHandlers, type SavedViewsHandlers } from "./saved-views-http";

export {
  createSavedViewsHandlers,
  type SavedViewsDeps,
  type SavedViewsHandlers,
} from "./saved-views-http";

export { createListingsHandlers, type ListingsDeps, type ListingsHandlers } from "./listings-http";

let handlers: SavedViewsHandlers | undefined;
let listingHandlers: ListingsHandlers | undefined;

/** The handlers behind /api/v1/listings (row 10). */
export function listingsHandlers(): ListingsHandlers {
  listingHandlers ??= createListingsHandlers({ door: actionDoor, withCompany });
  return listingHandlers;
}

/** What the inventory read gives a screen: the company's inventory, or why there is none to show. */
export type MyInventory =
  | { kind: "ready"; data: InventoryData }
  | { kind: "signed-out" }
  | { kind: "forbidden" }
  | { kind: "unreadable" };

/**
 * The signed-in company's inventory (row 10), through the shared door with viewListings and withCompany. No session is
 * «signed-out»; a role that may not view listings is «forbidden»; a database that cannot be read is «unreadable» — never
 * a throw, so the screen shows its error state with «Tải lại».
 */
export async function myInventory(): Promise<MyInventory> {
  try {
    const door = await sessionDoor("viewListings");
    if (door === "server-error") return { kind: "unreadable" };
    if (door === "unauthenticated") return { kind: "signed-out" };
    if (door === "forbidden") return { kind: "forbidden" };
    const data = await withCompany(door.pool, door.ctx, (c) => readInventory(c, door.ctx.userId));
    return { kind: "ready", data };
  } catch (err) {
    console.error("[bang-hang] không đọc được:", err instanceof Error ? err.message : "không rõ");
    return { kind: "unreadable" };
  }
}

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
