import { companyLayerHandlers } from "@/modules/company-config/server";

/** Match the company's pending units with units the shared catalog now has. */
export function POST(req: Request): Promise<Response> {
  return companyLayerHandlers().match(req);
}
