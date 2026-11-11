import { notify } from "@/components/templates/notify";
import { AUTH_BASE_PATH } from "@/modules/identity";

import { LOGIN_COPY as COPY } from "./copy";

/**
 * Ends the session on the server (row 1m). `signOutLabel` is the concept label, passed in by the screen. True only when the server answered 2xx; a network failure or any other
 * answer reports «not signed out» down the result channel and returns false, so the caller stays where it is.
 */
export async function signOut(signOutLabel: string): Promise<boolean> {
  try {
    const res = await fetch(`${AUTH_BASE_PATH}/session`, { method: "DELETE" });
    if (res.ok) return true;
  } catch {
    // Network down: the request never reached the server, the session is still live.
  }
  notify("result", { message: COPY.signOutFailed(signOutLabel) });
  return false;
}
