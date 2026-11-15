import { companyLayerHandlers } from "@/modules/company-config/server";

/** Add a label, custom field, value spelling, pending unit or import template. */
export async function POST(
  req: Request,
  ctx: { params: Promise<{ part: string }> },
): Promise<Response> {
  const { part } = await ctx.params;
  return companyLayerHandlers().add(req, part);
}
