import { companyLayerHandlers } from "@/modules/company-config/server";

/** The company's own labels, custom fields, value spellings, pending units and import templates in use. */
export function GET(req: Request): Promise<Response> {
  return companyLayerHandlers().read(req);
}
