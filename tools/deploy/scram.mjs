// SCRAM-SHA-256 verifier of a password, in the form PostgreSQL stores in pg_authid.rolpassword (row dat-khoa-mot-lenh,
// AC-4). `alter role … password '<verifier>'` stores it as is, so the statement Postgres receives — and may log — never
// holds the password itself. RFC 5802 / RFC 7677; PostgreSQL src/common/scram-common.c.
import { createHash, createHmac, pbkdf2Sync, randomBytes } from "node:crypto";

export const SCRAM_ITERATIONS = 4096;

const hmac = (key, text) => createHmac("sha256", key).update(text).digest();
const sha256 = (data) => createHash("sha256").update(data).digest();

/** The two keys of a password for a salt: what the server stores. */
export function scramKeys(password, salt, iterations = SCRAM_ITERATIONS) {
  const salted = pbkdf2Sync(Buffer.from(password, "utf8"), salt, iterations, 32, "sha256");
  return { storedKey: sha256(hmac(salted, "Client Key")), serverKey: hmac(salted, "Server Key") };
}

/**
 * `SCRAM-SHA-256$<iterations>:<salt>$<StoredKey>:<ServerKey>`, base64, with a fresh 16-byte salt unless one is given.
 * The password must be plain ASCII: SASLprep then leaves it unchanged, as the server does.
 */
export function scramVerifier(
  password,
  { salt = randomBytes(16), iterations = SCRAM_ITERATIONS } = {},
) {
  if (!/^[\x21-\x7e]+$/.test(password))
    throw new Error("scram: mật khẩu phải là ký tự ASCII in được");
  const { storedKey, serverKey } = scramKeys(password, salt, iterations);
  const b64 = (b) => Buffer.from(b).toString("base64");
  return `SCRAM-SHA-256$${iterations}:${b64(salt)}$${b64(storedKey)}:${b64(serverKey)}`;
}

/** Splits a verifier into its parts, or null when it is not one. */
export function parseVerifier(text) {
  const m = /^SCRAM-SHA-256\$(\d+):([A-Za-z0-9+/=]+)\$([A-Za-z0-9+/=]+):([A-Za-z0-9+/=]+)$/.exec(
    text,
  );
  if (!m) return null;
  return {
    iterations: Number(m[1]),
    salt: Buffer.from(m[2], "base64"),
    storedKey: Buffer.from(m[3], "base64"),
    serverKey: Buffer.from(m[4], "base64"),
  };
}

/**
 * The server side of the final SCRAM exchange, as PostgreSQL runs it: is `clientProof` valid for `authMessage` under
 * the verifier's StoredKey, and what ServerSignature does the server answer with.
 */
export function serverCheck(verifier, authMessage, clientProof) {
  const v = parseVerifier(verifier);
  if (!v) return { ok: false, serverSignature: null };
  const clientSignature = hmac(v.storedKey, authMessage);
  const proof = Buffer.from(clientProof, "base64");
  const clientKey = Buffer.alloc(proof.length);
  for (let i = 0; i < proof.length; i++) clientKey[i] = proof[i] ^ clientSignature[i];
  return {
    ok: sha256(clientKey).equals(v.storedKey),
    serverSignature: hmac(v.serverKey, authMessage).toString("base64"),
  };
}
