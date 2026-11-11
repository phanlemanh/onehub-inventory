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

/** Development only: prints the code; with an outbox path, also appends one JSON line per mail. */
export function devSender(outbox?: string): CodeSender {
  return async ({ email, code }) => {
    console.log(`[ma-dang-nhap] ${email} ${code}`);
    if (outbox)
      appendFileSync(outbox, `${JSON.stringify({ email, code, at: new Date().toISOString() })}\n`);
  };
}

/** Tests: keeps every mail in memory. */
export function captureSender(): { sender: CodeSender; sent: CodeMail[] } {
  const sent: CodeMail[] = [];
  return { sent, sender: async (mail) => void sent.push(mail) };
}
