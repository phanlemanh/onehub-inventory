import { membersHandlers } from "@/modules/identity/server";

/** Change the roles of one member of the session's company — company admins only. */
export async function PUT(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
): Promise<Response> {
  const { id } = await ctx.params;
  return membersHandlers().setRoles(req, id);
}
