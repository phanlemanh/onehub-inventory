// What a failed call to the real write path (/api/v1) means (roadmap row 4): fetch throws a TypeError when the network
// is down, the server answers 403 (refused) or 409 (conflict). Shared by the save door of a module and the shared
// write door of the screens (src/components/candidate/use-change.tsx).

export type WriteFailure = "offline" | "refused" | "conflict";

/** The failure a thrown value means, or null when it is none of the write path's own failures. */
export function writeFailure(failure: unknown): WriteFailure | null {
  if (failure instanceof TypeError) return "offline";
  const status =
    failure instanceof WriteRefused
      ? failure.status
      : typeof failure === "object" && failure !== null && "status" in failure
        ? (failure as { status: unknown }).status
        : undefined;
  if (status === 403) return "refused";
  if (status === 409) return "conflict";
  return null;
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
