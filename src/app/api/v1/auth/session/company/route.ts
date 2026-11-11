import { authHandlers } from "@/modules/identity/server";

/** Choose the company of the session; only a company the person belongs to. */
export function PUT(req: Request): Promise<Response> {
  return authHandlers().chooseCompany(req);
}
