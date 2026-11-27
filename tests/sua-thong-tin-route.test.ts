// Row 3g (finding of round 1): the route's custom value rule — a live field takes a fitting value, an unknown or retired
// one takes none, and a company layer that could not be read is a server fault (500), not «retired» (400).
import { describe, expect, it, vi } from "vitest";

import { customCheckOf } from "../src/app/api/v1/listings/[id]/custom-check";
import type { DbClient } from "../src/modules/identity/server";
import { createListingsHandlers } from "../src/modules/listings/server";

vi.mock("server-only", () => ({}));

const ID = "44444444-4444-4444-8444-444444444444";
const FIELDS = [{ code: "so_cho_xe", kind: "number" as const, options: [] }];

function patch(customCheck: () => Promise<ReturnType<typeof customCheckOf>>) {
  const client: DbClient = {
    query: async (text) =>
      /^\s*select/.test(text)
        ? {
            rows: [
              {
                id: ID,
                company_id: "c",
                standard_status: "Active",
                list_price: "1",
                close_price: null,
                close_date: null,
                withdrawn_reason: null,
                fee_inclusion: null,
                furnished: null,
                occupant_type: null,
                legal_status: null,
                financing: null,
                custom_fields: {},
                list_agent_user_id: null,
                list_agent_full_name: null,
                original_entry_timestamp: new Date("2026-11-01T00:00:00Z"),
                last_confirmed_at: null,
                version: 1,
                upi: "u",
              },
            ],
            rowCount: 1,
          }
        : { rows: [], rowCount: 1 },
    release: () => {},
  };
  const h = createListingsHandlers({
    door: async () => ({
      pool: { connect: async () => client },
      ctx: { userId: "me", companyId: "c" },
      scope: "company",
    }),
    withCompany: async (_p, _c, fn) => fn(client),
  });
  return (value: unknown) =>
    h.change(
      new Request(`http://x/api/v1/listings/${ID}`, {
        method: "PATCH",
        body: JSON.stringify({
          version: 1,
          change: { field: "customField", code: "so_cho_xe", value },
        }),
      }),
      ID,
      { customCheck },
    );
}

describe("route-lop-rieng", () => {
  it("route-lop-rieng: a live field takes a fitting value, refuses a wrong kind", async () => {
    const send = patch(async () => customCheckOf(FIELDS));
    expect((await send(2)).status, "route-lop-rieng: đúng kiểu").toBe(200);
    expect((await send("hai")).status, "route-lop-rieng: sai kiểu").toBe(400);
  });

  it("route-lop-rieng-hong: an unreadable company layer is a server fault, not a retired field", async () => {
    const send = patch(async () => customCheckOf(null));
    expect((await send(2)).status, "route-lop-rieng-hong").toBe(500);
  });
});
