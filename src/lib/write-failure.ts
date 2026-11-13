// What a failed call to the real write path (/api/v1) means (roadmap row 4): fetch throws a TypeError when the network
// is down, the server answers 403 (refused) or 409 (conflict). Shared by the save door of a module and the shared
// write door of the screens (src/components/candidate/use-change.tsx).

export type WriteFailure = "offline" | "refused" | "conflict";

/** The failure a thrown value means, or null when it is none of the write path's own failures. */
export function writeFailure(failure: unknown): WriteFailure | null {
  if (failure instanceof TypeError) return "offline";
  const status =
    typeof failure === "object" && failure !== null && "status" in failure
      ? (failure as { status: unknown }).status
      : undefined;
  if (status === 403) return "refused";
  if (status === 409) return "conflict";
  return null;
}
