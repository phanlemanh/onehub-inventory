// Generated from ontology/ by tools/ontology_codegen.py. Do not edit: run `make gen`.

export type AgreementKind = "catalog_source" | "listing_channel" | "lead_source" | "spreadsheet" | "company_partnership" | "company_api" | "ai_processing" | "catalog_confirmation";

export type AgreementDirection = "inbound" | "outbound";

export type AgreementStatus = "active" | "paused" | "ended";

/** Permission for one kind of connection to flow in one direction, for given data classes, for a period of time. */
export interface Agreement {
  id: string;
  /** id of Company */
  companyId: string;
  kind: AgreementKind;
  direction: AgreementDirection;
  counterparty: string;
  dataClasses: string;
  /** ISO datetime */
  validFrom: string;
  /** ISO datetime */
  validUntil?: string;
  status: AgreementStatus;
  approvedBy: string;
  specialTerms: boolean;
}

/** A brokerage using the product; the tenant that owns one isolated area of data. */
export interface Company {
  id: string;
  name: string;
}

/** One person a company works with; owner, buyer, tenant and landlord are types of contact, not separate records. */
export interface Contact {
  id: string;
  /** id of Company */
  companyId: string;
  fullName?: string;
  contactTypes: string;
  phones?: string;
  ownerMemberKey?: string;
}

export type ListingStandardStatus = "Incomplete" | "Active" | "Pending" | "Closed" | "Hold" | "Withdrawn";

export type ListingWithdrawnReason = "sold_elsewhere" | "owner_changed_mind" | "unreachable";

/** One offer by a company to sell or lease one unit. */
export interface Listing {
  id: string;
  /** id of Company */
  companyId: string;
  subdivisionName?: string;
  buildingName: string;
  unitNumber?: string;
  standardStatus: ListingStandardStatus;
  listPrice?: number;
  closePrice?: number;
  /** ISO date */
  closeDate?: string;
  withdrawnReason?: ListingWithdrawnReason;
  /** ISO datetime */
  lastConfirmedAt?: string;
  version: number;
}

export type UnitPropertyType = "Residential" | "Land";

export type UnitPropertySubType = "Condominium" | "Townhouse" | "Single Family Residence" | "Unimproved Land";

/** A physical apartment, house or plot in the shared catalog; shared by every company, so it has no company_id. */
export interface Unit {
  upi: string;
  subdivisionKey: string;
  buildingKey: string;
  buildingName: string;
  unitNumber: string;
  stack?: string;
  floor?: number;
  livingArea?: number;
  bedroomsTotal?: number;
  directionFaces?: string;
  propertyType: UnitPropertyType;
  propertySubType: UnitPropertySubType;
}

// ---- Roles, actions and personal data (ontology/roles.yaml, actions.yaml)

export type Role = string;

export const ROLE_INHERITS: Readonly<Record<string, readonly Role[]>> = {
};

/** Who runs an action, and as which role. */
export interface ActionContext {
  role: Role;
  actor: string;
}

/** Implement these in src/actions/ — one function per ontology action. */
export interface ActionHandlers {
}

export interface ActionSpec {
  name: keyof ActionHandlers & string;
  description: string;
  entity: string | null;
  kind: "create" | "update" | "delete" | "query" | "command";
  roles: readonly Role[];
  agent: "allowed" | "confirm" | "forbidden";
  idempotent: boolean;
  output: string | null;
  inputSchema: Record<string, unknown>;
}

export const ACTIONS: readonly ActionSpec[] = [];

/** True if `role` (or a role it inherits) may run the action. */
export function can(role: Role, action: ActionSpec): boolean {
  if ((role as string) === "agent" && action.agent === "forbidden") return false;
  const seen = new Set<string>();
  const todo: string[] = [role];
  while (todo.length > 0) {
    const current = todo.pop() as string;
    if ((action.roles as readonly string[]).includes(current)) return true;
    if (seen.has(current)) continue;
    seen.add(current);
    todo.push(...(ROLE_INHERITS[current] ?? []));
  }
  return false;
}

/** Personal-data properties per entity (`pii: true` in the ontology). */
export const PII_FIELDS: Readonly<Record<string, readonly string[]>> = {
  Contact: ["fullName", "phones"],
};

/** Copy of `record` with personal data replaced: use before logging or agent output. */
export function redactPII<T extends object>(entity: string, record: T): T {
  const copy: Record<string, unknown> = { ...(record as Record<string, unknown>) };
  for (const field of PII_FIELDS[entity] ?? []) {
    if (field in copy) copy[field] = "[redacted]";
  }
  return copy as unknown as T;
}
