import { importsHandlers } from "@/modules/imports/server";

/** The marks of every cell, the counts and the questions; writes nothing. */
export async function POST(req: Request): Promise<Response> {
  return importsHandlers().preview(req);
}
