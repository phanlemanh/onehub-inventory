// The invitation mail (row 9). It goes out only when a company admin presses the invite button (SP-3: a person always
// presses send) — never resent, never as a reminder. Production sends through Resend like the sign-in code; a
// development machine prints it and may append it to the same outbox file the browser tests read.
import { appendFileSync } from "node:fs";

import type { Role } from "../../generated/ontology";
import { LABELS } from "../../generated/labels";

import { canonicalRoles } from "./roles";

export interface InviteMail {
  email: string;
  companyName: string;
  inviterName: string;
  roles: readonly Role[];
  /** Origin of the request that invited, e.g. https://app.example — the mail links to its sign-in page. */
  origin: string;
}

export type InviteSender = (mail: InviteMail) => Promise<void>;

export interface SentInvite {
  email: string;
  subject: string;
  text: string;
}

/** Subject and body: who invited, into which company, as what, and where to sign in. No code, no secret. */
export function inviteEmail(mail: InviteMail): { subject: string; text: string } {
  const roles = canonicalRoles(mail.roles)
    .map((r) => LABELS[r].pref)
    .join(", ");
  const login = `${mail.origin.replace(/\/+$/, "")}/login`;
  return {
    subject: `${mail.inviterName} mời bạn vào ${mail.companyName} trên OneHub`,
    text: [
      `${mail.inviterName} đã thêm bạn vào ${mail.companyName} trên OneHub, với vai: ${roles}.`,
      "",
      `${LABELS.SignIn.pref} bằng chính email này tại ${login} — bạn nhận ${LABELS.LoginCode.pref.toLowerCase()} qua thư.`,
      "",
      "Bạn không biết người mời thì bỏ qua thư này.",
    ].join("\n"),
  };
}

/** Sends through Resend. A failed send throws (without the address), so the invite rolls back. */
export function resendInviteSender(o: {
  apiKey: string;
  from: string;
  fetch?: typeof fetch;
}): InviteSender {
  const send = o.fetch ?? fetch;
  return async (mail) => {
    const res = await send("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${o.apiKey}`, "content-type": "application/json" },
      body: JSON.stringify({ from: o.from, to: [mail.email], ...inviteEmail(mail) }),
    });
    if (!res.ok) throw new Error(`gửi thư mời thất bại: Resend ${res.status}`);
  };
}

/** Development only: prints the mail; with an outbox path, also appends it as one JSON line. */
export function devInviteSender(outbox?: string): InviteSender {
  return async (mail) => {
    const built: SentInvite = { email: mail.email, ...inviteEmail(mail) };
    console.log(`[thu-moi] ${built.email} · ${built.subject}`);
    if (outbox)
      appendFileSync(
        outbox,
        `${JSON.stringify({ ...built, kind: "invite", at: new Date().toISOString() })}\n`,
      );
  };
}

/** Tests: keeps every built mail in memory; `fail` makes the next sends throw. */
export function captureInviteSender(): {
  sender: InviteSender;
  sent: SentInvite[];
  fail: { on: boolean };
} {
  const sent: SentInvite[] = [];
  const fail = { on: false };
  return {
    sent,
    fail,
    sender: async (mail) => {
      if (fail.on) throw new Error("gửi thư mời thất bại: bộ gửi thử");
      sent.push({ email: mail.email, ...inviteEmail(mail) });
    },
  };
}
