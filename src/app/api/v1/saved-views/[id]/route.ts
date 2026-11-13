import { savedViewsHandlers } from "@/modules/listings/server";

/** Rename one's own saved view, or overwrite its way of looking. */
export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
): Promise<Response> {
  const { id } = await ctx.params;
  return savedViewsHandlers().edit(req, id);
}

/** Remove one's own saved view. */
export async function DELETE(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
): Promise<Response> {
  const { id } = await ctx.params;
  return savedViewsHandlers().remove(req, id);
}
