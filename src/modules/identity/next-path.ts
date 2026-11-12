/** Any control character (C0, DEL, C1), any whitespace (Unicode included) or a backslash: browsers drop or rewrite these. */
function unsafe(path: string): boolean {
  for (const ch of path) {
    const code = ch.codePointAt(0) ?? 0;
    if (code <= 0x1f || (code >= 0x7f && code <= 0x9f) || ch === "\\" || /\s/u.test(ch))
      return true;
  }
  return false;
}

/** A made-up origin to read the path against; a path of this site never leaves it. */
const PROBE = "http://next.invalid";

/**
 * A page to return to after signing in: only a path of this site, never another host. Allow-list, then read with
 * the browser's own URL parser (WHATWG — it drops tabs and newlines just as a browser does): the result must stay on
 * the probe origin and its normalised path must not start with `//`. Anything else returns home. Returns the string
 * as given, never the normalised one: `/..//x` normalises to `//x`.
 */
export function safeNext(next: unknown): string {
  if (typeof next !== "string" || !next.startsWith("/") || next.startsWith("//")) return "/";
  if (unsafe(next)) return "/";
  let url: URL;
  try {
    url = new URL(next, PROBE);
  } catch {
    return "/";
  }
  if (url.origin !== PROBE || url.pathname.startsWith("//")) return "/";
  return next;
}
