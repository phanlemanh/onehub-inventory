// loadDevSample (db/scripts/nap-mau-dev.ts, `make db-sample`): a developer's own migrated database gets the company,
// the person with all four roles and every sample listing in one go, and a second run changes nothing.
import { afterEach, describe, expect, it } from "vitest";

import { sampleInventoryData } from "@/app/(app)/inventory-sample-data";

import { loadDevSample } from "./can-mau";
import { scratchDb, type ScratchDb } from "./helpers";

const OPTS = { companyName: "[Sàn thử]", email: "dev@example.test", personName: "[Tên] Dev" };

const dbs: ScratchDb[] = [];
afterEach(async () => {
  for (const d of dbs.splice(0)) await d.drop();
});

async function fresh(suffix: string): Promise<ScratchDb> {
  const d = await scratchDb(suffix, undefined, { prefix: "nap_mau_dev" });
  dbs.push(d);
  return d;
}

describe("loadDevSample", () => {
  it("makes the company and the person with all four roles, then loads every sample listing", async () => {
    const d = await fresh("moi");

    const { companyId, count } = await loadDevSample(d.owner, OPTS);

    expect(count).toBe(sampleInventoryData().current.length);
    const member = await d.owner.query<{ roles: string[] }>(
      "select m.roles from company_members m join identity.users u on u.id = m.user_id where m.company_id = $1 and u.email = $2",
      [companyId, OPTS.email],
    );
    expect(member.rows[0]?.roles.sort()).toEqual([
      "BuyerAgent",
      "CompanyAdmin",
      "ListAgent",
      "TeamLead",
    ]);
    const kept = await d.owner.query<{ n: string }>(
      "select count(*) as n from listings l join identity.users u on u.id = l.list_agent_user_id where l.company_id = $1 and u.email = $2",
      [companyId, OPTS.email],
    );
    expect(Number(kept.rows[0]!.n)).toBeGreaterThan(0);
  });

  it("uses the company and person already there", async () => {
    const d = await fresh("co_san");
    const before = await d.owner.query<{ id: string }>(
      "insert into companies (name) values ($1) returning id",
      [OPTS.companyName],
    );

    const { companyId } = await loadDevSample(d.owner, OPTS);

    expect(companyId).toBe(before.rows[0]!.id);
    const companies = await d.owner.query<{ n: string }>("select count(*) as n from companies");
    expect(Number(companies.rows[0]!.n)).toBe(1);
  });

  it("refuses a second run and leaves the rows as they were", async () => {
    const d = await fresh("hai_lan");
    await loadDevSample(d.owner, OPTS);
    const count = async () =>
      Number((await d.owner.query<{ n: string }>("select count(*) as n from listings")).rows[0]!.n);
    const first = await count();

    await expect(loadDevSample(d.owner, OPTS)).rejects.toThrow(/already has/);

    expect(await count()).toBe(first);
  });
});
