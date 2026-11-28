import { importsHandlers } from "@/modules/imports/server";

/** Undo a whole import. */
export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
): Promise<Response> {
  const { id } = await ctx.params;
  return importsHandlers().undo(req, id);
}
