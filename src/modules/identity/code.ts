// Codes, session tokens and their hashes. The database only ever sees the hashes.
import { createHash, createHmac, randomBytes, randomInt } from "node:crypto";

import { CODE_LENGTH } from "./constants";

/** A fresh code of CODE_LENGTH digits, uniform over every value. */
export function generateCode(): string {
  return String(randomInt(0, 10 ** CODE_LENGTH)).padStart(CODE_LENGTH, "0");
}

/** Emails compare in lower case, without surrounding spaces. */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** What a person typed or pasted ("123 456", "123-456") reduced to its digits. */
export function normalizeCode(input: string): string {
  return input.replace(/\D/g, "");
}

export function isCodeShape(code: string): boolean {
  return code.length === CODE_LENGTH && /^\d+$/.test(code);
}

/** Keyed hash of a code for one email: a leaked table cannot be tried offline without the server secret. */
export function hashCode(secret: string, email: string, code: string): string {
  return createHmac("sha256", secret)
    .update(`${normalizeEmail(email)}:${code}`)
    .digest("hex");
}

/** A session token: 32 random bytes, URL-safe. */
export function newSessionToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export { safeNext } from "./next-path";
