// The real save door of a listing edit (row 10): one PATCH /api/v1/listings/<id> per change, with the version the person
// edited. Its outcomes are the ones of the sample door (row 4), so the editors do not change: saved with the listing the
// server keeps now, offline (no network, or the device says it is offline — no writes while offline), and for an answer
// that is not ok the one reading of src/lib/write-failure.ts (row 3g): session ended, refused, conflict with the listing
// as it is now, invalid with the rule the server named, or a server fault — also when a saved answer cannot be read.
import type { Listing } from "@/generated/ontology";
import { failureOfStatus } from "@/lib/write-failure";

import type { Invalid, ListingSaveDoor, SaveOutcome } from "../save-door";

/** The save door on /api/v1. `online` says whether the device has a network. */
export function httpSaveDoor(
  env: { online: () => boolean; fetch?: typeof fetch } = { online: () => navigator.onLine },
): ListingSaveDoor {
  return {
    async save({ id, version, change }): Promise<SaveOutcome> {
      if (!env.online()) return { kind: "offline" };
      let response: Response;
      try {
        response = await (env.fetch ?? fetch)(`/api/v1/listings/${encodeURIComponent(id)}`, {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ version, change }),
        });
      } catch {
        return { kind: "offline" };
      }
      const body = (await response.json().catch(() => null)) as {
        listing?: Listing;
        current?: Listing;
        why?: Invalid;
      } | null;
      if (response.ok)
        return body?.listing ? { kind: "saved", listing: body.listing } : { kind: "fault" };
      switch (failureOfStatus(response.status)) {
        case "expired":
          return { kind: "expired" };
        case "refused":
          return { kind: "refused" };
        case "conflict":
          // A listing that is gone (404), or one this company does not have, reads as changed elsewhere.
          return body?.current ? { kind: "conflict", current: body.current } : { kind: "conflict" };
        case "invalid":
          return { kind: "invalid", why: body?.why ?? { rule: "locked" } };
        case "fault":
          return { kind: "fault" };
      }
    },
  };
}
