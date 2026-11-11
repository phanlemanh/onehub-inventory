import { describe, expect, it } from "vitest";

import { SESSION_COOKIE } from "./constants";
import { clearedCookie, createAuthHandlers, sessionCookie, tokenFrom } from "./http";

describe("auth HTTP helpers", () => {
  it("sets the session cookie for the server only", () => {
    const c = sessionCookie("tok", true);
    expect(c).toContain(`${SESSION_COOKIE}=tok`);
    expect(c).toContain("HttpOnly");
    expect(c).toContain("SameSite=Lax");
    expect(c).toContain("Secure");
    expect(sessionCookie("tok", false)).not.toContain("Secure");
    expect(clearedCookie(false)).toContain("Max-Age=0");
  });

  it("reads the token from the cookie header", () => {
    const req = new Request("http://x.test/", {
      headers: { cookie: `a=1; ${SESSION_COOKIE}=abc=; b=2` },
    });
    expect(tokenFrom(req)).toBe("abc=");
    expect(tokenFrom(new Request("http://x.test/"))).toBeUndefined();
  });

  it("answers server-error when sign-in is not configured", async () => {
    const h = createAuthHandlers(() => null);
    const res = await h.requestCode(
      new Request("http://x.test/api/v1/auth/code", {
        method: "POST",
        body: JSON.stringify({ email: "a@b.test" }),
      }),
    );
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "server-error" });
  });

  it("answers server-error, not success, when configuration throws", async () => {
    const h = createAuthHandlers(() => {
      throw new Error("thiếu biến môi trường cho đăng nhập: RESEND_API_KEY");
    });
    const res = await h.requestCode(
      new Request("http://x.test/api/v1/auth/code", {
        method: "POST",
        body: JSON.stringify({ email: "a@b.test" }),
      }),
    );
    expect(res.status).toBe(500);
  });

  it("rejects a malformed request body", async () => {
    const h = createAuthHandlers(() => null);
    const bad = await createAuthHandlers(() => ({
      pool: {
        connect: async () => {
          throw new Error("no db");
        },
      },
      secret: "s",
      sender: async () => {},
    })).requestCode(new Request("http://x.test/", { method: "POST", body: "not json" }));
    expect(bad.status).toBe(400);
    expect(await bad.json()).toEqual({ error: "bad-request" });
    void h;
  });
});
