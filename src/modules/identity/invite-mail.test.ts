import { describe, expect, it, vi } from "vitest";

import { LABELS } from "../../generated/labels";

import {
  captureInviteSender,
  inviteEmail,
  resendInviteSender,
  type InviteMail,
} from "./invite-mail";

const MAIL: InviteMail = {
  email: "moi@example.test",
  companyName: "[Công ty A]",
  inviterName: "[Tên] P",
  roles: ["TeamLead", "ListAgent"],
  origin: "https://vi-du.test/",
};

function assertHasLogin(text: string): void {
  if (!text.includes("https://vi-du.test/login"))
    throw new Error("thu-moi-noi-dung: thiếu đường đăng nhập");
}

describe("invite mail", () => {
  it("thu-moi-noi-dung", () => {
    const { subject, text } = inviteEmail(MAIL);
    expect(subject).toContain("[Tên] P");
    expect(subject).toContain("[Công ty A]");
    assertHasLogin(text);
    expect(text).toContain(`${LABELS.ListAgent.pref}, ${LABELS.TeamLead.pref}`);
    expect(text).toContain(LABELS.SignIn.pref);
    expect(`${subject}${text}`).not.toMatch(/\d{6}/);
    // The check fails when the link is missing.
    expect(() => assertHasLogin(text.replace("https://vi-du.test/login", ""))).toThrow(
      "thu-moi-noi-dung: thiếu đường đăng nhập",
    );
  });

  it("thu-moi-resend", async () => {
    const ok = vi.fn(async () => new Response("{}", { status: 200 }));
    await resendInviteSender({
      apiKey: "k",
      from: "OneHub <a@vi-du.test>",
      fetch: ok as unknown as typeof fetch,
    })(MAIL);
    expect(ok).toHaveBeenCalledTimes(1);
    const [url, init] = ok.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://api.resend.com/emails");
    expect(JSON.parse(String(init.body))).toMatchObject({
      to: ["moi@example.test"],
      ...inviteEmail(MAIL),
    });
    const bad = vi.fn(async () => new Response("{}", { status: 500 }));
    const send = resendInviteSender({
      apiKey: "k",
      from: "x",
      fetch: bad as unknown as typeof fetch,
    });
    const err = await send(MAIL).then(
      () => null,
      (e: unknown) => e as Error,
    );
    expect(err?.message).toBe("gửi thư mời thất bại: Resend 500");
    expect(err?.message).not.toContain("moi@example.test");
  });

  it("captures and fails on demand", async () => {
    const c = captureInviteSender();
    await c.sender(MAIL);
    expect(c.sent).toHaveLength(1);
    c.fail.on = true;
    await expect(c.sender(MAIL)).rejects.toThrow();
    expect(c.sent).toHaveLength(1);
  });
});
