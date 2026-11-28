import { importsHandlers } from "@/modules/imports/server";

/** The list agents a team lead may import for (Hỏi-7): ids and names only. */
export async function GET(req: Request): Promise<Response> {
  return importsHandlers().agents(req);
}
