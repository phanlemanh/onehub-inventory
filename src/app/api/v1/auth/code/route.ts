import { authHandlers } from "@/modules/identity/server";

/** Request a sign-in code by email. */
export function POST(req: Request): Promise<Response> {
  return authHandlers().requestCode(req);
}
