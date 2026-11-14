import { companyLayerHandlers } from "@/modules/company-config/server";

/** Change a label's words, a field's name and options, a value spelling or a template's name. */
export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ part: string; id: string }> },
): Promise<Response> {
  const { part, id } = await ctx.params;
  return companyLayerHandlers().edit(req, part, id);
}
