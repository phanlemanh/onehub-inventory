import { importsHandlers } from "@/modules/imports/server";

/** Write one batch (at most 200 rows) of an open import; a batch sent again writes nothing. */
export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
): Promise<Response> {
  const { id } = await ctx.params;
  return importsHandlers().batch(req, id);
}
