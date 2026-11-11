import { authHandlers } from "@/modules/identity/server";

/** Trade a code for a session. */
export function POST(req: Request): Promise<Response> {
  return authHandlers().verifyCode(req);
}

/** Who is signed in, in which company, and which companies they can switch to. */
export function GET(req: Request): Promise<Response> {
  return authHandlers().getSession(req);
}

/** Sign out: the session ends on the server and the cookie is cleared. */
export function DELETE(req: Request): Promise<Response> {
  return authHandlers().signOut(req);
}
