// Row 3g: the one reading of a failed write (src/lib/write-failure.ts). Case names are pinned messages (evals.yaml, E7).
import { afterEach, describe, expect, it, vi } from "vitest";

import { failureOfStatus, writeFailure, writeFetch } from "./write-failure";

describe("write-failure", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("mot-bang-ma: seven answers, seven outcomes", () => {
    const table: [number, string][] = [
      [401, "expired"],
      [403, "refused"],
      [409, "conflict"],
      [404, "conflict"],
      [400, "invalid"],
      [500, "fault"],
      [502, "fault"],
    ];
    for (const [status, want] of table)
      expect(failureOfStatus(status), `mot-bang-ma: ${status}`).toBe(want);
    expect(table.length).toBe(7);
  });

  it("nem-va-tra-cung-luat: what writeFetch throws reads by the same table", async () => {
    const thrown = async (status: number) => {
      vi.stubGlobal(
        "fetch",
        vi.fn(async () => new Response(null, { status })),
      );
      return writeFetch("/api/v1/x", { method: "PATCH" }).then(
        () => "saved",
        (f: unknown) => writeFailure(f),
      );
    };
    expect(await thrown(401), "nem-va-tra-cung-luat: 401").toBe(failureOfStatus(401));
    expect(await thrown(403), "nem-va-tra-cung-luat: 403").toBe(failureOfStatus(403));
    expect(await thrown(409), "nem-va-tra-cung-luat: 409").toBe(failureOfStatus(409));
    // A 500 or a 400 thrown is the screen's fault: the shared door logs it and answers fault.
    expect(await thrown(500)).toBeNull();
    expect(writeFailure(new TypeError("Failed to fetch"))).toBe("offline");
  });
});
