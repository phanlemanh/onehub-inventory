// The create door of listings (row 11, nhap-excel; owner's answer to Hỏi-1: row 11 owns creating listings on the
// server, row 12 adds the hand-made screen on top). Runs inside the caller's transaction opened through withCompany;
// the database's rules decide who may add (createListing) and who may remove (undoImport, only listings of an import
// nobody changed since). Nothing here reads a session.
import type { ListingStandardStatus } from "../../generated/ontology";

/** A query client of the caller's transaction (the identity module's DbClient). */
export interface Queryable {
  query(text: string, params?: unknown[]): Promise<{ rows: unknown[]; rowCount: number | null }>;
}

export interface NewListing {
  id: string;
  /** A catalog unit (upi) or a pending unit of the company. */
  unit: { upi: string } | { pendingUnitId: string };
  listAgentUserId: string;
  listAgentFullName: string;
  standardStatus: ListingStandardStatus;
  listPrice: number | null;
  feeInclusion: "Included" | "Excluded" | null;
  furnished: "Furnished" | "Partially" | "Unfurnished" | null;
  occupantType: "Owner" | "Tenant" | "Vacant" | null;
  withdrawnReason: "sold_elsewhere" | "owner_changed_mind" | "unreachable" | null;
  legalStatus: string | null;
  financing: string | null;
  customFields: Record<string, unknown>;
  /** The owner confirmation date the file gave (YYYY-MM-DD), else null: an import is not a fresh confirmation. */
  lastConfirmedAt: string | null;
}

const OPEN = ["Incomplete", "Active", "Pending", "Hold"];

/** Add listings of one import, each with its one unit link, in the caller's transaction. */
export async function createListings(
  c: Queryable,
  companyId: string,
  importRunId: string,
  items: readonly NewListing[],
): Promise<{ created: string[] }> {
  const created: string[] = [];
  for (const l of items) {
    await c.query(
      `insert into listings (id, company_id, standard_status, list_price, fee_inclusion, furnished, occupant_type,
         legal_status, financing, custom_fields, list_agent_user_id, list_agent_full_name, last_confirmed_at,
         import_run_id, withdrawn_reason)
       values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10::jsonb, $11, $12, $13::date, $14, $15)`,
      [
        l.id,
        companyId,
        l.standardStatus,
        l.listPrice,
        l.feeInclusion,
        l.furnished,
        l.occupantType,
        l.legalStatus,
        l.financing,
        JSON.stringify(l.customFields),
        l.listAgentUserId,
        l.listAgentFullName,
        l.lastConfirmedAt,
        importRunId,
        l.withdrawnReason,
      ],
    );
    const open = OPEN.includes(l.standardStatus);
    if ("upi" in l.unit)
      await c.query(
        `insert into listing_units (listing_id, company_id, upi, open) values ($1, $2, $3, $4)`,
        [l.id, companyId, l.unit.upi, open],
      );
    else
      await c.query(
        `insert into listing_pending_units (listing_id, company_id, pending_unit_id, open) values ($1, $2, $3, $4)`,
        [l.id, companyId, l.unit.pendingUnitId, open],
      );
    created.push(l.id);
  }
  return { created };
}

/**
 * Remove the listings of one import that nobody changed since (version 1); the ones changed stay and are named. The
 * database lets the delete through only for an import not undone and only when undoImport allows it.
 */
export async function removeImportListings(
  c: Queryable,
  importRunId: string,
): Promise<{ removed: string[]; kept: string[] }> {
  const { rows } = await c.query(
    `select id, version from listings where import_run_id = $1 order by original_entry_timestamp, id`,
    [importRunId],
  );
  const all = rows as { id: string; version: number }[];
  const del = await c.query(
    `delete from listings where import_run_id = $1 and version = 1 returning id`,
    [importRunId],
  );
  const removed = (del.rows as { id: string }[]).map((r) => r.id);
  return { removed, kept: all.filter((r) => !removed.includes(r.id)).map((r) => r.id) };
}
