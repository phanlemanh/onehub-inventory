// The sample company's listings loaded into one test company of the database (row 10): the shared catalog once, a member
// for each sample keeper («[Tên] 0x»), then every listing with its unit link. A listing's id in the company is worked out
// from the company and the sample id, so two companies never share one, and a test finds a sample row's id with `idOf`.
// Test data only.
import { createHash } from "node:crypto";

import { sampleInventoryData } from "@/app/(app)/inventory-sample-rows";
import { sampleCatalog } from "@/modules/catalog";
import { catalogLoadStatements } from "@/modules/catalog/load-sql";
import { listingLoadStatements } from "@/modules/listings/load-sql";

interface Owner {
  query(text: string, values?: unknown[]): Promise<unknown>;
}

/** A listing's id in `companyId` for the sample listing `sampleId`: a name-based uuid (version 5 shape). */
export function companyListingId(companyId: string, sampleId: string): string {
  const h = createHash("sha1").update(`${companyId}:${sampleId}`).digest("hex");
  const variant = ((parseInt(h[16]!, 16) & 0x3) | 0x8).toString(16);
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-5${h.slice(13, 16)}-${variant}${h.slice(17, 20)}-${h.slice(20, 32)}`;
}

/**
 * Loads the sample inventory into `companyId`. `viewer` keeps the listings the sample gives «the person viewing»
 * (row 3e); without one they stay unkept. Returns how to find a sample listing's id in this company.
 */
export async function seedSampleInventory(
  owner: Owner,
  companyId: string,
  viewer?: { id: string; name: string },
): Promise<{ idOf: (sampleId: string) => string; count: number }> {
  for (const s of catalogLoadStatements(sampleCatalog())) await owner.query(s.text, s.values);
  const data = sampleInventoryData();
  const others = new Map<string, string>();
  for (const k of Object.values(data.keepers))
    if (k?.kind === "other" && !others.has(k.name)) {
      const email = `giu-${others.size + 1}-${companyId}@example.test`;
      const id = createHash("sha1").update(email).digest("hex");
      const userId = `${id.slice(0, 8)}-${id.slice(8, 12)}-4${id.slice(13, 16)}-8${id.slice(17, 20)}-${id.slice(20, 32)}`;
      await owner.query(
        "insert into identity.users (id, email, name) values ($1, $2, $3) on conflict do nothing",
        [userId, email, k.name],
      );
      await owner.query(
        "insert into company_members (company_id, user_id, name, roles) values ($1, $2, $3, '{ListAgent}') on conflict do nothing",
        [companyId, userId, k.name],
      );
      others.set(k.name, userId);
    }
  const idOf = (sampleId: string) => companyListingId(companyId, sampleId);
  const statements = listingLoadStatements(data, companyId, idOf, (l) => {
    const k = data.keepers[l.id];
    if (!k) return null;
    if (k.kind === "viewer") return viewer ? { userId: viewer.id, name: viewer.name } : null;
    return { userId: others.get(k.name)!, name: k.name };
  });
  for (const s of statements) await owner.query(s.text, s.values);
  return { idOf, count: data.current.length };
}
