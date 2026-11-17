import { checkCustomValue } from "@/modules/company-config";
import { myCompanyLayer } from "@/modules/company-config/server";
import { listingsHandlers } from "@/modules/listings/server";

/**
 * The company layer's value rule for the signed-in company (row 3g): a custom value fits its live field, and a field
 * the company does not have, or retired, takes none. Listings does not depend on company-config, so the route joins them.
 */
async function customCheck() {
  const fields = new Map((await myCompanyLayer())?.fields.map((f) => [f.code, f]) ?? []);
  return (code: string, value: string | number | boolean) => {
    const field = fields.get(code);
    return field ? checkCustomValue(field, value) : { ok: false as const, reason: "field-retired" };
  };
}

/** Change one listing of the company by one change: price, status, fee inclusion (row 10), details or a custom value (row 3g). */
export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
): Promise<Response> {
  const { id } = await ctx.params;
  return listingsHandlers().change(req, id, { customCheck });
}
