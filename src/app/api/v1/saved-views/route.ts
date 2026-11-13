import { savedViewsHandlers } from "@/modules/listings/server";

/** The signed-in person's own saved views of one screen (`?screen=inventory`). */
export function GET(req: Request): Promise<Response> {
  return savedViewsHandlers().list(req);
}

/** Save the current way of looking at a grid screen as a new view, under a name. */
export function POST(req: Request): Promise<Response> {
  return savedViewsHandlers().save(req);
}
