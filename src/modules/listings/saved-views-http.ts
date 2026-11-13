// Saved views over HTTP (row 2c): plain Request in, Response out, so the route files stay one line and tests call these
// directly. Every handler names its action of the permission table and opens the identity module's shared door first;
// a door that does not open answers before any data is touched. Error bodies are fixed codes.
import { z } from "zod";

import type { ActionName } from "@/modules/identity";
import type { DbClient, DbPool, DoorError, OpenedDoor } from "@/modules/identity/server";

import { SAVED_VIEW_SCREENS, SavedViewState } from "./saved-view";
import { editView, listSavedViews, removeView, saveView, type RunAs } from "./saved-views";

export type SavedViewsErrorCode =
  DoorError | "not-found" | "bad-request" | "name-empty" | "name-too-long" | "name-taken";

const STATUS: Record<SavedViewsErrorCode, number> = {
  unauthenticated: 401,
  forbidden: 403,
  "not-found": 404,
  "bad-request": 400,
  "name-empty": 400,
  "name-too-long": 400,
  "name-taken": 400,
  "server-error": 500,
};

function error(code: SavedViewsErrorCode): Response {
  return Response.json({ error: code }, { status: STATUS[code] });
}

const Screen = z.enum(SAVED_VIEW_SCREENS);
const SaveBody = z.object({ screen: Screen, name: z.string(), view: SavedViewState }).strict();
const EditBody = z
  .object({ name: z.string().optional(), view: SavedViewState.optional() })
  .strict()
  .refine((b) => b.name !== undefined || b.view !== undefined);

async function body<T>(req: Request, schema: z.ZodType<T>): Promise<T | null> {
  try {
    const parsed = schema.safeParse(await req.json());
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

/** What the handlers need from the identity module: its shared door and its query door. */
export interface SavedViewsDeps {
  door(req: Request, action: ActionName): Promise<OpenedDoor | DoorError>;
  withCompany<T>(
    pool: DbPool,
    ctx: { userId: string; companyId: string },
    fn: (client: DbClient) => Promise<T>,
  ): Promise<T>;
}

export interface SavedViewsHandlers {
  list(req: Request): Promise<Response>;
  save(req: Request): Promise<Response>;
  edit(req: Request, id: string): Promise<Response>;
  remove(req: Request, id: string): Promise<Response>;
}

export function createSavedViewsHandlers(deps: SavedViewsDeps): SavedViewsHandlers {
  async function guarded(
    req: Request,
    action: ActionName,
    fn: (run: RunAs, ctx: OpenedDoor["ctx"]) => Promise<Response>,
  ): Promise<Response> {
    try {
      const door = await deps.door(req, action);
      if (typeof door === "string") return error(door);
      const run: RunAs = (f) => deps.withCompany(door.pool, door.ctx, f);
      return await fn(run, door.ctx);
    } catch (err) {
      console.error("[goc-nhin] lỗi máy chủ:", err instanceof Error ? err.message : "không rõ");
      return error("server-error");
    }
  }
  const validId = (id: string) => z.uuid().safeParse(id).success;

  return {
    list: (req) =>
      guarded(req, "listSavedViews", async (run, ctx) => {
        const screen = Screen.safeParse(new URL(req.url).searchParams.get("screen"));
        if (!screen.success) return error("bad-request");
        return Response.json({ views: await listSavedViews(run, ctx.userId, screen.data) });
      }),

    save: (req) =>
      guarded(req, "saveView", async (run, ctx) => {
        const input = await body(req, SaveBody);
        if (!input) return error("bad-request");
        const r = await saveView(run, ctx, input);
        if (r.status !== "ok") return error(r.status);
        return Response.json({ view: r.view }, { status: 201 });
      }),

    edit: (req, id) =>
      guarded(req, "editView", async (run, ctx) => {
        if (!validId(id)) return error("not-found");
        const input = await body(req, EditBody);
        if (!input) return error("bad-request");
        const r = await editView(run, ctx.userId, id, input);
        if (r.status !== "ok") return error(r.status);
        return Response.json({ view: r.view });
      }),

    remove: (req, id) =>
      guarded(req, "removeView", async (run, ctx) => {
        if (!validId(id)) return error("not-found");
        const r = await removeView(run, ctx.userId, id);
        if (r !== "ok") return error(r);
        return Response.json({ ok: true });
      }),
  };
}
