import { importsHandlers } from "@/modules/imports/server";

/** The company's ten latest imports. */
export async function GET(req: Request): Promise<Response> {
  return importsHandlers().recent(req);
}

/** Open an import of a file the browser read: checked again, then opened. */
export async function POST(req: Request): Promise<Response> {
  return importsHandlers().open(req);
}
