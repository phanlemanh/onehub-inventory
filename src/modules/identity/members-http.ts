// HTTP side of members (row 9): plain Request in, Response out, so the route files stay one line and tests call these
// directly. Error bodies are fixed codes. A person without a session, or signed in without a chosen company, is
// unauthenticated here; a member who is not a company admin is forbidden and the body names nobody.
import { z } from "zod";

import type { Role } from "../../generated/ontology";

import { tokenFrom } from "./http";
import { readSession, sessionContext } from "./login";
import { inviteMember, listMembers, setMemberRoles, type MembersDeps } from "./members";
import { MEMBER_NAME_MAX, ROLES } from "./roles";

export type MembersErrorCode =
  | "unauthenticated"
  | "forbidden"
  | "not-member"
  | "already-member"
  | "last-admin"
  | "bad-request"
  | "server-error";

const STATUS: Record<MembersErrorCode, number> = {
  unauthenticated: 401,
  forbidden: 403,
  "not-member": 404,
  "already-member": 409,
  "last-admin": 409,
  "bad-request": 400,
  "server-error": 500,
};

function error(code: MembersErrorCode): Response {
  return Response.json({ error: code }, { status: STATUS[code] });
}

const RoleSet = z
  .array(z.enum(ROLES))
  .min(1)
  .refine((r) => new Set(r).size === r.length);
const InviteBody = z.object({
  email: z.email(),
  name: z.string().trim().min(1).max(MEMBER_NAME_MAX),
  roles: RoleSet,
});
const RolesBody = z.object({ roles: RoleSet });

async function body<T>(req: Request, schema: z.ZodType<T>): Promise<T | null> {
  try {
    const parsed = schema.safeParse(await req.json());
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export interface MembersHandlers {
  list(req: Request): Promise<Response>;
  invite(req: Request): Promise<Response>;
  setRoles(req: Request, userId: string): Promise<Response>;
}

/** `getDeps` is resolved per request: null means members are not configured here (no database on a dev machine). */
export function createMembersHandlers(getDeps: () => MembersDeps | null): MembersHandlers {
  async function guarded(
    req: Request,
    fn: (deps: MembersDeps, ctx: { userId: string; companyId: string }) => Promise<Response>,
  ): Promise<Response> {
    try {
      const deps = getDeps();
      if (!deps) return error("server-error");
      const session = await readSession(deps, tokenFrom(req));
      if (!session?.company) return error("unauthenticated");
      const ctx = sessionContext(session);
      return await fn(deps, { userId: ctx.userId, companyId: session.company.id });
    } catch (err) {
      console.error("[thanh-vien] lỗi máy chủ:", err instanceof Error ? err.message : "không rõ");
      return error("server-error");
    }
  }

  return {
    list: (req) =>
      guarded(req, async (deps, ctx) => {
        const members = await listMembers(deps, ctx);
        if (members === "forbidden") return error("forbidden");
        return Response.json({ members });
      }),

    invite: (req) =>
      guarded(req, async (deps, ctx) => {
        const input = await body(req, InviteBody);
        if (!input) return error("bad-request");
        const result = await inviteMember(deps, ctx, input, new URL(req.url).origin);
        if (result.status !== "ok") return error(result.status);
        return Response.json({ member: { id: result.userId } });
      }),

    setRoles: (req, userId) =>
      guarded(req, async (deps, ctx) => {
        if (!z.uuid().safeParse(userId).success) return error("not-member");
        const input = await body(req, RolesBody);
        if (!input) return error("bad-request");
        const status = await setMemberRoles(deps, ctx, userId, input.roles as Role[]);
        if (status !== "ok") return error(status);
        return Response.json({ ok: true });
      }),
  };
}
