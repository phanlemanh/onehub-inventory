import { membersHandlers } from "@/modules/identity/server";

/** The members of the session's company — company admins only. */
export function GET(req: Request): Promise<Response> {
  return membersHandlers().list(req);
}

/** Invite a person into the session's company with one or more roles; one invitation mail goes out. */
export function POST(req: Request): Promise<Response> {
  return membersHandlers().invite(req);
}
