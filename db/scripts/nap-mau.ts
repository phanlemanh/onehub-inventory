// The development database of row 10 (bang-hang-du-lieu-that): a fresh scratch database on this lane's Postgres with
// the migrations applied, three companies made from the sample — «[MAU]» with every sample listing, «[MAU-2]» with three
// of them, «[MAU-TRONG]» with none — and one person per role in all three («[Tên]», example.test). It prints the
// DATABASE_URL a dev server connects with (the app's login role, never the owner) and the people's emails. It only ever
// creates and drops the database named bang_hang_dev. Test data only.
//
//   DB_LANE=r DB_PORT=5565 npx tsx db/scripts/nap-mau.ts
import { scratchDb } from "../../tests/db/helpers";
import { companyListingId, seedSampleInventory } from "../../tests/db/can-mau";
import { sampleInventoryData } from "../../src/app/(app)/inventory-sample-data";

const ROLES = ["ListAgent", "BuyerAgent", "TeamLead", "CompanyAdmin"] as const;

async function main() {
  const db = await scratchDb("dev", undefined, { prefix: "bang_hang" });
  const o = db.owner;
  const company = async (name: string) =>
    (await o.query<{ id: string }>("insert into companies (name) values ($1) returning id", [name]))
      .rows[0]!.id;
  const mau = await company("[MAU]");
  const mau2 = await company("[MAU-2]");
  const trong = await company("[MAU-TRONG]");
  const people: Record<string, { id: string; name: string }> = {};
  for (const role of ROLES) {
    const email = `mau-${role.toLowerCase()}@example.test`;
    const name = `[Tên] ${role}`;
    const id = (
      await o.query<{ id: string }>(
        "insert into identity.users (email, name) values ($1, $2) returning id",
        [email, name],
      )
    ).rows[0]!.id;
    for (const c of [mau, mau2, trong])
      await o.query(
        "insert into company_members (company_id, user_id, name, roles) values ($1, $2, $3, $4)",
        [c, id, name, [role]],
      );
    people[email] = { id, name };
  }
  const agent = people["mau-listagent@example.test"]!;
  await seedSampleInventory(o, mau, agent);
  await seedSampleInventory(o, mau2, agent);
  const keep = sampleInventoryData()
    .current.slice(0, 3)
    .map((l) => companyListingId(mau2, l.id));
  await o.query(
    "delete from listing_units where company_id = $1 and not (listing_id = any($2::uuid[]))",
    [mau2, keep],
  );
  await o.query("delete from listings where company_id = $1 and not (id = any($2::uuid[]))", [
    mau2,
    keep,
  ]);
  await o.end();
  console.log(`DATABASE_URL=${db.appUrl}`);
  for (const email of Object.keys(people)) console.log(`nguoi: ${email}`);
}

main().catch((err) => {
  console.error("nap-mau:", err instanceof Error ? err.message : err);
  process.exit(1);
});
