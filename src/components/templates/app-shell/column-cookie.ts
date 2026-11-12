// Shared by the server layout (first paint) and the client second column (later changes).

/** Cookie that remembers whether the person folded the second column (UI preference, no company data). */
export const COLUMN_COOKIE = "app_shell_cot2";
export const COLUMN_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/** Open unless the person folded it. */
export function columnOpenFromCookie(value: string | undefined): boolean {
  return value !== "0";
}
