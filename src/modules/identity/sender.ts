// Who sends the code. Production sends through Resend's HTTP API (no package); a development machine prints the code
// to the server log, and may also append it to an outbox file for browser tests; tests capture mail in memory.
// Copied in spirit from packages/api/src/auth/sender.ts of onehub-quy-hang (commit 1729b11f).
import { appendFileSync } from "node:fs";

import { LABELS } from "../../generated/labels";

import { CODE_TTL_SEC } from "./constants";

export interface CodeMail {
  email: string;
  code: string;
}

export type CodeSender = (mail: CodeMail) => Promise<void>;

/** A mail as it leaves: who, subject, body. */
export interface SentMail {
  email: string;
  subject: string;
  text: string;
}

/** The email: the code and how long it lives, no link — a code typed on any device works. */
export function codeEmail(code: string): { subject: string; text: string } {
  const minutes = Math.round(CODE_TTL_SEC / 60);
  return {
    subject: `${code} là mã đăng nhập OneHub`,
    text: `${LABELS.LoginCode.pref} OneHub của bạn: ${code}\n\nMã hết hạn sau ${minutes} phút. Bạn không xin mã thì bỏ qua thư này.`,
  };
}

/** Sends through Resend. A failed send throws so the request fails loudly; the error never carries the code. */
export function resendSender(o: {
  apiKey: string;
  from: string;
  fetch?: typeof fetch;
}): CodeSender {
  const send = o.fetch ?? fetch;
  return async ({ email, code }) => {
    const res = await send("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${o.apiKey}`, "content-type": "application/json" },
      body: JSON.stringify({ from: o.from, to: [email], ...codeEmail(code) }),
    });
    if (!res.ok) throw new Error(`gửi mã thất bại: Resend ${res.status}`);
  };
}

/** Development only: prints the code; with an outbox path, also appends the built mail as one JSON line. */
export function devSender(outbox?: string): CodeSender {
  return async ({ email, code }) => {
    console.log(`[ma-dang-nhap] ${email} ${code}`);
    if (outbox) {
      const mail: SentMail = { email, ...codeEmail(code) };
      appendFileSync(outbox, `${JSON.stringify({ ...mail, at: new Date().toISOString() })}\n`);
    }
  };
}

/** Tests: keeps every built mail in memory. */
export function captureSender(): { sender: CodeSender; sent: SentMail[] } {
  const sent: SentMail[] = [];
  return { sent, sender: async ({ email, code }) => void sent.push({ email, ...codeEmail(code) }) };
}
