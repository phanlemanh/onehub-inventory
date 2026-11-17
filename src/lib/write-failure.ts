// What a failed call to the real write path (/api/v1) means (roadmap row 4; one rule since row 3g): fetch throws a
// TypeError when the network is down; an answer that is not ok says why by its status. The ONE reading of those statuses:
// the listing save door (src/modules/listings/ui/http-save-door.ts) and the shared write door of the screens
// (src/components/candidate/use-change.tsx) both call it, so no second table of statuses lives in src/
// (tests/mot-luat-ghi.test.ts holds that).

/**
 * Why a write did not go through: the device is offline, the session ended (401), the role may not (403), the record
 * changed or left meanwhile (409, 404), the server would not take it (400), or the server failed (5xx, anything else,
 * or an answer that could not be read).
 */
export type WriteFailure = "offline" | "expired" | "refused" | "conflict" | "invalid" | "fault";

/** The failure an answer's status means; 2xx is not a failure and never reaches here. */
export function failureOfStatus(status: number): Exclude<WriteFailure, "offline"> {
  if (status === 401) return "expired";
  if (status === 403) return "refused";
  if (status === 409 || status === 404) return "conflict";
  if (status === 400) return "invalid";
  return "fault";
}

/**
 * The failure a thrown value means, or null when it is none of the write path's own failures (a 400, a 5xx, a bug):
 * the screen then logs it and answers «fault» (use-change.tsx).
 */
export function writeFailure(failure: unknown): Exclude<WriteFailure, "invalid" | "fault"> | null {
  if (failure instanceof TypeError) return "offline";
  const status =
    failure instanceof WriteRefused
      ? failure.status
      : typeof failure === "object" && failure !== null && "status" in failure
        ? (failure as { status: unknown }).status
        : undefined;
  if (typeof status !== "number") return null;
  const why = failureOfStatus(status);
  return why === "invalid" || why === "fault" ? null : why;
}

/** What `writeFetch` throws when the server answers with an error: the HTTP status, read by `writeFailure`. */
export class WriteRefused extends Error {
  constructor(readonly status: number) {
    super(String(status));
    this.name = "WriteRefused";
  }
}

/**
 * The one way a screen writes to /api/v1 (row 10 plugs it into the save door): fetch throws a TypeError when the
 * network is down, and an answer that is not ok is thrown as `WriteRefused` with its status. `writeFailure` reads both.
 */
export async function writeFetch(input: string, init: RequestInit): Promise<Response> {
  const response = await fetch(input, init);
  if (!response.ok) throw new WriteRefused(response.status);
  return response;
}
