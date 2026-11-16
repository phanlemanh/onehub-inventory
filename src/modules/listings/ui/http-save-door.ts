// The real save door of a listing edit (row 10): one PATCH /api/v1/listings/<id> per change, with the version the person
// edited. Its outcomes are the ones of the sample door (row 4), so the cell does not change: saved with the listing the
// server keeps now, refused (403), offline (no network, or the device says it is offline — no writes while offline),
// conflict with the listing as it is now (409), invalid (400).
import type { Listing } from "@/generated/ontology";

import type { ListingSaveDoor, SaveOutcome } from "../save-door";

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
      const body = (await response.json().catch(() => ({}))) as {
        listing?: Listing;
        current?: Listing;
        why?: unknown;
      };
      if (response.ok && body.listing) return { kind: "saved", listing: body.listing };
      if (response.status === 409)
        return body.current ? { kind: "conflict", current: body.current } : { kind: "conflict" };
      // A listing that is gone, or one this company does not have, reads as changed elsewhere.
      if (response.status === 404) return { kind: "conflict" };
      if (response.status === 400) return { kind: "invalid", why: { rule: "locked" } };
      return { kind: "refused" };
    },
  };
}
