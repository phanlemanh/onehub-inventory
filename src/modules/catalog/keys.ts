// Catalog keys (row 7d, rule prefixed-keys): bld_, stk_, unt_ plus a ULID in Crockford base32 — 10 characters of
// time and 16 of randomness, the algorithm of onehub-invest's moiKhoa. A key is minted once and never derived from
// content, so renaming a tower never changes its key. Clock and randomness are passed in: this module stays pure.

export const CROCKFORD = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
export type KeyPrefix = "bld" | "stk" | "unt";
export const KEY_PATTERN = /^(bld|stk|unt)_[0-9A-HJKMNP-TV-Z]{26}$/;

export function mintKey(prefix: KeyPrefix, nowMs: number, random: readonly number[]): string {
  if (!["bld", "stk", "unt"].includes(prefix)) throw new Error(`tiền tố khoá lạ: ${prefix}`);
  if (random.length < 16) throw new Error("cần 16 số ngẫu nhiên");
  let time = "";
  let ms = Math.floor(nowMs);
  for (let i = 0; i < 10; i++) {
    time = CROCKFORD[ms % 32] + time;
    ms = Math.floor(ms / 32);
  }
  let rest = "";
  for (let i = 0; i < 16; i++) rest += CROCKFORD[Math.abs(Math.floor(random[i]!)) % 32];
  return `${prefix}_${time}${rest}`;
}

export const isKey = (value: string, prefix?: KeyPrefix): boolean =>
  KEY_PATTERN.test(value) && (!prefix || value.startsWith(`${prefix}_`));
