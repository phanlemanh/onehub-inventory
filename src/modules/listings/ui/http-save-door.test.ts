// Row 3g (debts of row 10): the save door reads every answer of the real handler — not a body the test writes by hand —
// with the one rule of src/lib/write-failure.ts. The case name is the record's pinned message (evals.yaml, E7).
import { describe, expect, it, vi } from "vitest";

import type { DbClient } from "@/modules/identity/server";

import { createListingsHandlers } from "../listings-http";
import type { SaveOutcome } from "../save-door";
import { httpSaveDoor } from "./http-save-door";

vi.mock("server-only", () => ({}));

const ID = "33333333-3333-4333-8333-333333333333";

function realAnswer(
  kind: "unauthenticated" | "forbidden" | "server-error" | "conflict" | "gone" | "invalid",
) {
  const client: DbClient = {
    query: async (text) =>
      /^\s*select/.test(text)
        ? {
            rows:
              kind === "gone"
                ? []
                : [
                    {
                      id: ID,
                      company_id: "c",
                      standard_status: "Closed",
                      list_price: "1",
                      close_price: "1",
                      close_date: "2026-11-01",
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
                      version: kind === "conflict" ? 5 : 1,
                      upi: "u",
                    },
                  ],
            rowCount: 1,
          }
        : { rows: [], rowCount: 1 },
    release: () => {},
  };
  const h = createListingsHandlers({
    door: async () =>
      kind === "unauthenticated" || kind === "forbidden" || kind === "server-error"
        ? kind
        : {
            pool: { connect: async () => client },
            ctx: { userId: "me", companyId: "c" },
            scope: "company",
          },
    withCompany: async (_p, _c, fn) => fn(client),
  });
  return (_url: string | URL | Request, init?: RequestInit) =>
    h.change(new Request(`http://x/api/v1/listings/${ID}`, init), ID);
}

const save = (fetcher: typeof fetch) =>
  httpSaveDoor({ online: () => true, fetch: fetcher }).save({
    id: ID,
    version: 1,
    change: { field: "details", legalStatus: "Sổ hồng" },
    at: "",
  });

describe("http-save-door · bảy trả lời", () => {
  it("bay-tra-loi-tu-handler-that: 401, 403, 409, 404, 400, 500 from the real handler and an unreadable body", async () => {
    const cases: [string, typeof fetch, SaveOutcome["kind"]][] = [
      ["401", realAnswer("unauthenticated") as typeof fetch, "expired"],
      ["403", realAnswer("forbidden") as typeof fetch, "refused"],
      ["409", realAnswer("conflict") as typeof fetch, "conflict"],
      ["404", realAnswer("gone") as typeof fetch, "conflict"],
      ["400", realAnswer("invalid") as typeof fetch, "invalid"],
      ["500", realAnswer("server-error") as typeof fetch, "fault"],
      [
        "thân hỏng",
        (async () => new Response("<html>proxy</html>", { status: 200 })) as typeof fetch,
        "fault",
      ],
    ];
    const seen: string[] = [];
    for (const [status, fetcher, want] of cases) {
      const outcome = await save(fetcher);
      expect(outcome.kind, `bay-tra-loi-tu-handler-that: ${status}`).toBe(want);
      seen.push(status);
    }
    expect(seen.length).toBe(7);
  });

  it("a conflict carries the listing as the server keeps it; a 400 carries the rule the server named", async () => {
    const conflict = await save(realAnswer("conflict") as typeof fetch);
    expect(conflict.kind === "conflict" ? conflict.current?.version : null).toBe(5);
    const invalid = await save(realAnswer("invalid") as typeof fetch);
    expect(invalid.kind === "invalid" ? invalid.why : null).toEqual({ rule: "locked" });
  });

  it("offline sends nothing", async () => {
    const fetcher = vi.fn();
    const outcome = await httpSaveDoor({ online: () => false, fetch: fetcher }).save({
      id: ID,
      version: 1,
      change: { field: "details", legalStatus: "x" },
      at: "",
    });
    expect(outcome.kind).toBe("offline");
    expect(fetcher).not.toHaveBeenCalled();
  });
});
