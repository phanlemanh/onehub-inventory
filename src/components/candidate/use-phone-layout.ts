"use client";

// VP4 (debt of row 2b, _acceptance/bang-hang-the-dien-thoai): whether the grid region shows its phone list. The server
// does not know the screen's width, so it answers «not known yet» (undefined), and so does the browser's first render,
// which must match the server's HTML. While the answer is not known the region draws both layouts and lets the
// stylesheet's 768 px rule hide one, so the first frame on a phone is never the table and on a wide screen never the
// cards. Once the browser has measured, the region draws one layout only.
import { useSyncExternalStore } from "react";

/** Below 768 px, the stylesheet's `md` breakpoint. */
const PHONE_QUERY = "(max-width: 767px)";

function subscribe(onChange: () => void): () => void {
  const query = window.matchMedia(PHONE_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/** true below 768 px, false from 768 px, undefined on the server and while the browser hydrates its HTML. */
export function usePhoneLayout(): boolean | undefined {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(PHONE_QUERY).matches,
    () => undefined,
  );
}
