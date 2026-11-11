// HTTP side of sign-in: plain Request in, Response out, so the route files stay one line and tests call these
// directly. Error bodies are fixed strings: every failed code answers the same bytes.
import { z } from "zod";

import { safeNext } from "./code";
import { SESSION_COOKIE, SESSION_TTL_SEC } from "./constants";
import {
  chooseCompany,
  endSession,
  readSession,
  requestCode,
  sessionCompanies,
  verifyCode,
  type LoginDeps,
} from "./login";

export type AuthErrorCode =
  | "code-invalid"
  | "rate-limited"
  | "no-company"
  | "not-member"
  | "unauthenticated"
  | "bad-request"
  | "server-error";

const STATUS: Record<AuthErrorCode, number> = {
  "code-invalid": 400,
  "rate-limited": 429,
  "no-company": 403,
  "not-member": 403,
  unauthenticated: 401,
  "bad-request": 400,
  "server-error": 500,
};

function error(code: AuthErrorCode, headers?: HeadersInit): Response {
  return Response.json({ error: code }, { status: STATUS[code], ...(headers ? { headers } : {}) });
}

const EmailBody = z.object({ email: z.email() });
const VerifyBody = z.object({
  email: z.string().min(1),
  code: z.string().max(32),
  next: z.string().optional(),
});
const CompanyBody = z.object({ companyId: z.uuid() });

async function body<T>(req: Request, schema: z.ZodType<T>): Promise<T | null> {
  try {
    const parsed = schema.safeParse(await req.json());
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

function secure(req: Request, production: boolean): boolean {
  return production || new URL(req.url).protocol === "https:";
}

export function sessionCookie(token: string, isSecure: boolean): string {
  return [
    `${SESSION_COOKIE}=${token}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${SESSION_TTL_SEC}`,
    ...(isSecure ? ["Secure"] : []),
  ].join("; ");
}

export function clearedCookie(isSecure: boolean): string {
  return [
    `${SESSION_COOKIE}=`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    "Max-Age=0",
    ...(isSecure ? ["Secure"] : []),
  ].join("; ");
}

export function tokenFrom(req: Request): string | undefined {
  const header = req.headers.get("cookie") ?? "";
  for (const part of header.split(";")) {
    const [name, ...rest] = part.trim().split("=");
    if (name === SESSION_COOKIE) return rest.join("=") || undefined;
  }
  return undefined;
}

export interface AuthHandlers {
  requestCode(req: Request): Promise<Response>;
  verifyCode(req: Request): Promise<Response>;
  getSession(req: Request): Promise<Response>;
  chooseCompany(req: Request): Promise<Response>;
  signOut(req: Request): Promise<Response>;
}

/** `deps` is resolved per request: null means sign-in is not configured here (no database on a dev machine). */
export function createAuthHandlers(
  getDeps: () => LoginDeps | null,
  options: { production: boolean } = { production: false },
): AuthHandlers {
  async function guarded(fn: (deps: LoginDeps) => Promise<Response>): Promise<Response> {
    try {
      const deps = getDeps();
      if (!deps) return error("server-error");
      return await fn(deps);
    } catch (err) {
      // The message never carries a code: codes are only in the sender's arguments.
      console.error("[dang-nhap] lỗi máy chủ:", err instanceof Error ? err.message : "không rõ");
      return error("server-error");
    }
  }

  return {
    requestCode: (req) =>
      guarded(async (deps) => {
        const input = await body(req, EmailBody);
        if (!input) return error("bad-request");
        const result = await requestCode(deps, input.email);
        if (result === "limited") return error("rate-limited");
        return Response.json({ ok: true });
      }),

    verifyCode: (req) =>
      guarded(async (deps) => {
        const input = await body(req, VerifyBody);
        if (!input) return error("code-invalid");
        const result = await verifyCode(deps, input.email, input.code);
        if (result.status === "invalid") return error("code-invalid");
        if (result.status === "no-company") return error("no-company");
        const session = await readSession(deps, result.token);
        const companies =
          session && !session.company ? await sessionCompanies(deps, result.token) : [];
        return Response.json(
          { company: session?.company ?? null, companies, next: safeNext(input.next) },
          {
            headers: { "set-cookie": sessionCookie(result.token, secure(req, options.production)) },
          },
        );
      }),

    getSession: (req) =>
      guarded(async (deps) => {
        const token = tokenFrom(req);
        const session = await readSession(deps, token);
        if (!session || !token) return error("unauthenticated");
        const companies = await sessionCompanies(deps, token);
        return Response.json({
          user: { email: session.email, name: session.name },
          company: session.company,
          companies,
        });
      }),

    chooseCompany: (req) =>
      guarded(async (deps) => {
        const token = tokenFrom(req);
        if (!token || !(await readSession(deps, token))) return error("unauthenticated");
        const input = await body(req, CompanyBody);
        if (!input) return error("bad-request");
        if (!(await chooseCompany(deps, token, input.companyId))) return error("not-member");
        const session = await readSession(deps, token);
        return Response.json({ company: session?.company ?? null });
      }),

    signOut: (req) =>
      guarded(async (deps) => {
        const token = tokenFrom(req);
        if (token) await endSession(deps, token);
        return Response.json(
          { ok: true },
          { headers: { "set-cookie": clearedCookie(secure(req, options.production)) } },
        );
      }),
  };
}
