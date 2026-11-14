import { companyLayerHandlers } from "@/modules/company-config/server";

/** Stop using one row of the company layer; nothing is deleted. */
export async function POST(
  req: Request,
  ctx: { params: Promise<{ part: string; id: string }> },
): Promise<Response> {
  const { part, id } = await ctx.params;
  return companyLayerHandlers().retire(req, part, id);
}
