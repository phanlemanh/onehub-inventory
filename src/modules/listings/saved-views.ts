// Saved views on the server (row 2c): read, add, rename or overwrite, and remove one person's views of a grid screen.
// Every statement runs through the identity module's door, withCompany, under the API role; row level security of
// saved_view (migration 009) keeps each person to their own rows, and the statements say so too.
import type { DbClient } from "@/modules/identity/server";

import {
  checkViewName,
  normalizeViewName,
  SavedViewState,
  type SavedView,
  type SavedViewNameError,
  type SavedViewScreen,
} from "./saved-view";

/** Runs `fn` in one transaction as the person of the opened door. */
export type RunAs = <T>(fn: (client: DbClient) => Promise<T>) => Promise<T>;

interface Row {
  id: string;
  screen: SavedViewScreen;
  name: string;
  view: unknown;
}

const COLUMNS = "id, screen, name, view";

function toView(row: Row): SavedView {
  // A stored view that no longer fits the shape (an older grid) opens as an empty view rather than failing the page.
  const parsed = SavedViewState.safeParse(row.view);
  return {
    id: row.id,
    screen: row.screen,
    name: row.name,
    view: parsed.success
      ? parsed.data
      : { query: "", filters: {}, sort: [], grouped: false, hidden: [] },
  };
}

const UNIQUE_VIOLATION = "23505";
const isUnique = (err: unknown) => (err as { code?: string }).code === UNIQUE_VIOLATION;

/** One person's views of one screen, oldest first. */
export async function listSavedViews(
  run: RunAs,
  userId: string,
  screen: SavedViewScreen,
): Promise<SavedView[]> {
  return run(async (c) => {
    const { rows } = await c.query(
      `select ${COLUMNS} from saved_view where user_id = $1 and screen = $2 order by created_at, id`,
      [userId, screen],
    );
    return (rows as Row[]).map(toView);
  });
}

/** One of the person's own views, or null when it does not exist or is someone else's. */
export async function readSavedView(
  run: RunAs,
  userId: string,
  id: string,
): Promise<SavedView | null> {
  return run(async (c) => {
    const { rows } = await c.query(
      `select ${COLUMNS} from saved_view where id = $1 and user_id = $2`,
      [id, userId],
    );
    const row = rows[0] as Row | undefined;
    return row ? toView(row) : null;
  });
}

async function takenNames(
  c: DbClient,
  userId: string,
  screen: SavedViewScreen,
  except: string | null,
): Promise<string[]> {
  const { rows } = await c.query(
    "select name from saved_view where user_id = $1 and screen = $2 and id is distinct from $3",
    [userId, screen, except],
  );
  return (rows as { name: string }[]).map((r) => r.name);
}

export type SaveResult = { status: "ok"; view: SavedView } | { status: SavedViewNameError };

/** Adds a view under `name` for the person of the session, in the session's company. */
export async function saveView(
  run: RunAs,
  ctx: { userId: string; companyId: string },
  input: { screen: SavedViewScreen; name: string; view: SavedViewState },
): Promise<SaveResult> {
  const name = normalizeViewName(input.name);
  try {
    return await run(async (c) => {
      const problem = checkViewName(name, await takenNames(c, ctx.userId, input.screen, null));
      if (problem) return { status: problem };
      const { rows } = await c.query(
        `insert into saved_view (company_id, user_id, screen, name, view)
         values ($1, $2, $3, $4, $5) returning ${COLUMNS}`,
        [ctx.companyId, ctx.userId, input.screen, name, JSON.stringify(input.view)],
      );
      return { status: "ok", view: toView(rows[0] as Row) };
    });
  } catch (err) {
    // Two saves of the same name at once: the unique index decides, the second one hears «taken».
    if (isUnique(err)) return { status: "name-taken" };
    throw err;
  }
}

export type EditResult =
  { status: "ok"; view: SavedView } | { status: SavedViewNameError | "not-found" };

/** Renames one of the person's own views, overwrites its way of looking, or both. */
export async function editView(
  run: RunAs,
  userId: string,
  id: string,
  change: { name?: string; view?: SavedViewState },
): Promise<EditResult> {
  try {
    return await run(async (c) => {
      const { rows: found } = await c.query(
        `select ${COLUMNS} from saved_view where id = $1 and user_id = $2 for update`,
        [id, userId],
      );
      const current = found[0] as Row | undefined;
      if (!current) return { status: "not-found" };
      const name = change.name === undefined ? current.name : normalizeViewName(change.name);
      if (change.name !== undefined) {
        const problem = checkViewName(name, await takenNames(c, userId, current.screen, id));
        if (problem) return { status: problem };
      }
      const view = change.view === undefined ? current.view : change.view;
      const { rows } = await c.query(
        `update saved_view set name = $3, view = $4, updated_at = now()
          where id = $1 and user_id = $2 returning ${COLUMNS}`,
        [id, userId, name, JSON.stringify(view)],
      );
      const row = rows[0] as Row | undefined;
      return row ? { status: "ok", view: toView(row) } : { status: "not-found" };
    });
  } catch (err) {
    if (isUnique(err)) return { status: "name-taken" };
    throw err;
  }
}

/** Removes one of the person's own views. */
export async function removeView(
  run: RunAs,
  userId: string,
  id: string,
): Promise<"ok" | "not-found"> {
  return run(async (c) => {
    const r = await c.query("delete from saved_view where id = $1 and user_id = $2", [id, userId]);
    return r.rowCount === 1 ? "ok" : "not-found";
  });
}
