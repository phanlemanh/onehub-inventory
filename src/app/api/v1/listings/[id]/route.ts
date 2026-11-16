import { listingsHandlers } from "@/modules/listings/server";

/** Change one listing of the company by one change: its price, its status, or its fee inclusion (row 10). */
export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
): Promise<Response> {
  const { id } = await ctx.params;
  return listingsHandlers().change(req, id);
}
