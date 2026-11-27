import { myCompanyLayer } from "@/modules/company-config/server";
import { listingsHandlers } from "@/modules/listings/server";

import { customCheckOf } from "./custom-check";

/** Change one listing of the company by one change: price, status, fee inclusion (row 10), details or a custom value (row 3g). */
export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
): Promise<Response> {
  const { id } = await ctx.params;
  // Listings does not depend on company-config: the route joins them (row 3g). An unreadable layer throws inside the
  // handler's guard, which answers 500.
  return listingsHandlers().change(req, id, {
    customCheck: async () => customCheckOf((await myCompanyLayer())?.fields ?? null),
  });
}
