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

/** A tower (toà) of the shared catalog, under a complex when one is known, otherwise directly under its project; no companyId. Keyed like onehub-invest buildings. */
export interface Building {
  buildingKey: string;
  /** id of Subdivision */
  subdivisionKey: string;
  /** id of Complex */
  complexKey?: string;
  buildingName: string;
  upi: string;
}

export type CatalogAliasKind = "ma_goc" | "ten";

/** An original code or a name of a tower, stack or unit in the shared catalog, kept as an alias so the catalog key never depends on how a source wrote it. Our own; shared catalog, no companyId. */
export interface CatalogAlias {
  id: number;
  objectKey: string;
  kind: CatalogAliasKind;
  value: string;
  source: string;
  /** ISO datetime */
  firstSeen: string;
  /** ISO datetime */
  retiredAt?: string;
}

/** A brokerage using the product; the tenant that owns one isolated area of data. */
export interface Company {
  id: string;
  name: string;
}

export type CompanyCatalogAliasKind = "ma" | "ten";

/** A code or name one company uses for a tower or a unit of the shared catalog. Belongs to that company only; the shared catalog never changes. */
export interface CompanyCatalogAlias {
  id: number;
  /** id of Company */
  companyId: string;
  /** id of Building */
  buildingKey?: string;
  /** id of Unit */
  unitKey?: string;
  kind: CompanyCatalogAliasKind;
  value: string;
  /** ISO datetime */
  createdAt: string;
  /** ISO datetime */
  retiredAt?: string;
}

/** A subdivision of a project (phân khu), child of exactly one Subdivision; shared catalog, no companyId. Stored in catalog_nodes with node_type complex. */
export interface Complex {
  slug: string;
  name: string;
  /** id of Subdivision */
  subdivisionSlug: string;
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

export type ListingOwnerContactType = "Seller" | "Landlord";

/** One contact linked to one listing as its owner, in a stated role, inside one company. */
export interface ListingOwner {
  id: string;
  /** id of Company */
  companyId: string;
  /** id of Contact */
  contactId: string;
  /** id of Listing */
  listingId: string;
  contactType: ListingOwnerContactType;
}

/** The link between one listing and the shared-catalog unit it offers, inside one company. */
export interface ListingUnit {
  id: string;
  /** id of Company */
  companyId: string;
  /** id of Listing */
  listingId: string;
  /** id of Unit */
  upi: string;
}

/** A person who works in one company, with the roles that company gave them and the name it knows them by. */
export interface Member {
  companyId: string;
  userId: string;
  name: string;
  roles: string;
  invitedBy?: string;
  /** ISO datetime */
  invitedAt?: string;
}

/** A stack (trục) of one tower; a local extension, as in onehub-invest; shared catalog, no companyId. */
export interface Stack {
  stackKey: string;
  /** id of Building */
  buildingKey: string;
  stackCode: string;
}

/** A project (dự án), the root of the shared catalog; shared by every company, so it has no companyId. Stored in catalog_nodes with node_type project, as onehub-invest stores projects in asset_nodes. */
export interface Subdivision {
  slug: string;
  name: string;
}

export type UnitPropertyType = "Residential" | "Land";

export type UnitPropertySubType = "Condominium" | "Townhouse" | "Single Family Residence" | "Unimproved Land";

/** A physical apartment, house or plot in the shared catalog; shared by every company, so it has no company_id. */
export interface Unit {
  unitKey: string;
  upi: string;
  /** id of Subdivision */
  subdivisionKey: string;
  /** id of Complex */
  complexKey?: string;
  /** id of Building */
  buildingKey: string;
  buildingName: string;
  /** id of Stack */
  stackKey?: string;
  stack?: string;
  unitNumber: string;
  floor?: string;
  livingArea?: number;
  bedroomsTotal?: number;
  directionFaces?: string;
  propertyType: UnitPropertyType;
  propertySubType: UnitPropertySubType;
}

// ---- Roles, actions and personal data (ontology/roles.yaml, actions.yaml)

export type Role = "ListAgent" | "BuyerAgent" | "TeamLead" | "CompanyAdmin";

export const ROLE_INHERITS: Readonly<Record<string, readonly Role[]>> = {
  "ListAgent": [],
  "BuyerAgent": [],
  "TeamLead": [],
  "CompanyAdmin": [],
};

/** Who runs an action, and as which role. */
export interface ActionContext {
  role: Role;
  actor: string;
}

export interface ReadOwnRolesInput {
}

export interface ReadCompanyInput {
}

export interface ListMembersInput {
}

export interface InviteMemberInput {
}

export interface ChangeMemberRolesInput {
}

export interface ReadAgreementsInput {
}

export interface ManageAgreementsInput {
}

export interface ViewListingsInput {
}

export interface CreateListingInput {
}

export interface UpdateListingInput {
}

export interface ActivateListingInput {
}

export interface ViewOwnerPhoneInput {
}

/** Implement these in src/actions/ — one function per ontology action. */
export interface ActionHandlers {
  /** Read the roles one holds in the company of the session. */
  readOwnRoles(input: ReadOwnRolesInput, ctx: ActionContext): Promise<void>;
  /** Read the name of the company of the session. */
  readCompany(input: ReadCompanyInput, ctx: ActionContext): Promise<void>;
  /** See the people of the company, with their roles. */
  listMembers(input: ListMembersInput, ctx: ActionContext): Promise<void>;
  /** Invite a person into the company with a set of roles. */
  inviteMember(input: InviteMemberInput, ctx: ActionContext): Promise<void>;
  /** Change the roles of a person of the company. */
  changeMemberRoles(input: ChangeMemberRolesInput, ctx: ActionContext): Promise<void>;
  /** See the connection agreements of the company. */
  readAgreements(input: ReadAgreementsInput, ctx: ActionContext): Promise<void>;
  /** Add a connection agreement or change one. */
  manageAgreements(input: ManageAgreementsInput, ctx: ActionContext): Promise<void>;
  /** See the listings of the company. */
  viewListings(input: ViewListingsInput, ctx: ActionContext): Promise<void>;
  /** Add a listing. */
  createListing(input: CreateListingInput, ctx: ActionContext): Promise<void>;
  /** Change a listing's price, fees or details. */
  updateListing(input: UpdateListingInput, ctx: ActionContext): Promise<void>;
  /** Put a listing on sale (own scope is the unit one keeps, or a unit nobody keeps yet). */
  activateListing(input: ActivateListingInput, ctx: ActionContext): Promise<void>;
  /** See the phone number of a listing's owner (own scope is the unit one keeps). */
  viewOwnerPhone(input: ViewOwnerPhoneInput, ctx: ActionContext): Promise<void>;
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
  /** Permission table (decision 0016): each role's scope; a role without a cell may not run it. */
  scope: Readonly<Partial<Record<Role, "company" | "own">>>;
  status: "live" | "planned" | null;
  states: readonly string[];
  doors: { api: readonly string[]; db: readonly string[] };
}

/** A door no role decides (ontology/actions.yaml `exempt`). */
export interface ExemptDoor {
  door: string;
  reason: string;
  reads: readonly string[];
}

export const ACTIONS: readonly ActionSpec[] = [
  {
    name: "readOwnRoles",
    description: "Read the roles one holds in the company of the session.",
    entity: "Member",
    kind: "query",
    roles: ["ListAgent", "BuyerAgent", "TeamLead", "CompanyAdmin"],
    agent: "forbidden",
    idempotent: false,
    output: null,
    inputSchema: {
      type: "object",
      properties: {},
      additionalProperties: false,
    },
    scope: {
      ListAgent: "own",
      BuyerAgent: "own",
      TeamLead: "own",
      CompanyAdmin: "own",
    },
    status: "live",
    states: [],
    doors: {
      api: [],
      db: ["function app.member_roles()", "table company_members select"],
    },
  },
  {
    name: "readCompany",
    description: "Read the name of the company of the session.",
    entity: "Company",
    kind: "query",
    roles: ["ListAgent", "BuyerAgent", "TeamLead", "CompanyAdmin"],
    agent: "forbidden",
    idempotent: false,
    output: null,
    inputSchema: {
      type: "object",
      properties: {},
      additionalProperties: false,
    },
    scope: {
      ListAgent: "company",
      BuyerAgent: "company",
      TeamLead: "company",
      CompanyAdmin: "company",
    },
    status: "live",
    states: [],
    doors: {
      api: [],
      db: ["table companies select"],
    },
  },
  {
    name: "listMembers",
    description: "See the people of the company, with their roles.",
    entity: "Member",
    kind: "query",
    roles: ["CompanyAdmin"],
    agent: "forbidden",
    idempotent: false,
    output: null,
    inputSchema: {
      type: "object",
      properties: {},
      additionalProperties: false,
    },
    scope: {
      CompanyAdmin: "company",
    },
    status: "live",
    states: [],
    doors: {
      api: ["GET /api/v1/members"],
      db: ["function app.member_list()", "table company_members select"],
    },
  },
  {
    name: "inviteMember",
    description: "Invite a person into the company with a set of roles.",
    entity: "Member",
    kind: "create",
    roles: ["CompanyAdmin"],
    agent: "forbidden",
    idempotent: false,
    output: null,
    inputSchema: {
      type: "object",
      properties: {},
      additionalProperties: false,
    },
    scope: {
      CompanyAdmin: "company",
    },
    status: "live",
    states: [],
    doors: {
      api: ["POST /api/v1/members"],
      db: ["function app.member_invite(text, text, text[])"],
    },
  },
  {
    name: "changeMemberRoles",
    description: "Change the roles of a person of the company.",
    entity: "Member",
    kind: "update",
    roles: ["CompanyAdmin"],
    agent: "forbidden",
    idempotent: false,
    output: null,
    inputSchema: {
      type: "object",
      properties: {},
      additionalProperties: false,
    },
    scope: {
      CompanyAdmin: "company",
    },
    status: "live",
    states: [],
    doors: {
      api: ["PUT /api/v1/members/[id]/roles"],
      db: ["function app.member_set_roles(uuid, text[])"],
    },
  },
  {
    name: "readAgreements",
    description: "See the connection agreements of the company.",
    entity: "Agreement",
    kind: "query",
    roles: ["ListAgent", "BuyerAgent", "TeamLead", "CompanyAdmin"],
    agent: "forbidden",
    idempotent: false,
    output: null,
    inputSchema: {
      type: "object",
      properties: {},
      additionalProperties: false,
    },
    scope: {
      ListAgent: "company",
      BuyerAgent: "company",
      TeamLead: "company",
      CompanyAdmin: "company",
    },
    status: "live",
    states: [],
    doors: {
      api: [],
      db: ["table agreements select"],
    },
  },
  {
    name: "manageAgreements",
    description: "Add a connection agreement or change one.",
    entity: "Agreement",
    kind: "command",
    roles: ["CompanyAdmin"],
    agent: "forbidden",
    idempotent: false,
    output: null,
    inputSchema: {
      type: "object",
      properties: {},
      additionalProperties: false,
    },
    scope: {
      CompanyAdmin: "company",
    },
    status: "live",
    states: [],
    doors: {
      api: [],
      db: ["table agreements insert", "table agreements update"],
    },
  },
  {
    name: "viewListings",
    description: "See the listings of the company.",
    entity: "Listing",
    kind: "query",
    roles: ["ListAgent", "BuyerAgent", "TeamLead"],
    agent: "forbidden",
    idempotent: false,
    output: null,
    inputSchema: {
      type: "object",
      properties: {},
      additionalProperties: false,
    },
    scope: {
      ListAgent: "company",
      BuyerAgent: "company",
      TeamLead: "company",
    },
    status: "planned",
    states: [],
    doors: {
      api: [],
      db: [],
    },
  },
  {
    name: "createListing",
    description: "Add a listing.",
    entity: "Listing",
    kind: "create",
    roles: ["ListAgent", "BuyerAgent", "TeamLead"],
    agent: "forbidden",
    idempotent: false,
    output: null,
    inputSchema: {
      type: "object",
      properties: {},
      additionalProperties: false,
    },
    scope: {
      ListAgent: "company",
      BuyerAgent: "company",
      TeamLead: "company",
    },
    status: "planned",
    states: [],
    doors: {
      api: [],
      db: [],
    },
  },
  {
    name: "updateListing",
    description: "Change a listing's price, fees or details.",
    entity: "Listing",
    kind: "update",
    roles: ["ListAgent", "BuyerAgent", "TeamLead"],
    agent: "forbidden",
    idempotent: false,
    output: null,
    inputSchema: {
      type: "object",
      properties: {},
      additionalProperties: false,
    },
    scope: {
      ListAgent: "company",
      BuyerAgent: "company",
      TeamLead: "company",
    },
    status: "planned",
    states: [],
    doors: {
      api: [],
      db: [],
    },
  },
  {
    name: "activateListing",
    description: "Put a listing on sale (own scope is the unit one keeps, or a unit nobody keeps yet).",
    entity: "Listing",
    kind: "command",
    roles: ["ListAgent", "TeamLead"],
    agent: "forbidden",
    idempotent: false,
    output: null,
    inputSchema: {
      type: "object",
      properties: {},
      additionalProperties: false,
    },
    scope: {
      ListAgent: "own",
      TeamLead: "company",
    },
    status: "planned",
    states: ["Incomplete", "Hold"],
    doors: {
      api: [],
      db: [],
    },
  },
  {
    name: "viewOwnerPhone",
    description: "See the phone number of a listing's owner (own scope is the unit one keeps).",
    entity: "ListingOwner",
    kind: "query",
    roles: ["ListAgent", "TeamLead"],
    agent: "forbidden",
    idempotent: false,
    output: null,
    inputSchema: {
      type: "object",
      properties: {},
      additionalProperties: false,
    },
    scope: {
      ListAgent: "own",
      TeamLead: "company",
    },
    status: "planned",
    states: [],
    doors: {
      api: [],
      db: [],
    },
  },
];

export const PERMISSION_EXEMPT: readonly ExemptDoor[] = [
  {
    door: "POST /api/v1/auth/code",
    reason: "Asks for a sign-in code before the person has a session or a company.",
    reads: [],
  },
  {
    door: "POST /api/v1/auth/session",
    reason: "Signs in with the code; there is no company yet.",
    reads: [],
  },
  {
    door: "GET /api/v1/auth/session",
    reason: "Reads one's own session and the companies one belongs to, before choosing one.",
    reads: [],
  },
  {
    door: "DELETE /api/v1/auth/session",
    reason: "Signs out; works with or without a chosen company.",
    reads: [],
  },
  {
    door: "PUT /api/v1/auth/session/company",
    reason: "Chooses the company of the session among the person's own companies.",
    reads: [],
  },
  {
    door: "function app.current_company_id()",
    reason: "Reads the company of the session, set by the one query door.",
    reads: [],
  },
  {
    door: "function app.allowed(text)",
    reason: "Reads the caller's scope for an action from the permission table; every role decision goes through it.",
    reads: ["table app.permissions select"],
  },
  {
    door: "function app.login_request_code(text, text, integer, integer, integer)",
    reason: "Sign-in before a company is chosen (row 8).",
    reads: [],
  },
  {
    door: "function app.login_verify_code(text, text, text, integer, integer)",
    reason: "Sign-in before a company is chosen (row 8).",
    reads: [],
  },
  {
    door: "function app.session_read(text, integer, integer)",
    reason: "Reads one's own session (row 8).",
    reads: [],
  },
  {
    door: "function app.session_companies(text)",
    reason: "Lists one's own companies before choosing one (row 8).",
    reads: [],
  },
  {
    door: "function app.session_set_company(text, uuid)",
    reason: "Chooses the company of the session among one's own (row 8).",
    reads: [],
  },
  {
    door: "function app.session_end(text)",
    reason: "Signs out (row 8).",
    reads: [],
  },
];

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
  Member: ["name"],
};

/** Copy of `record` with personal data replaced: use before logging or agent output. */
export function redactPII<T extends object>(entity: string, record: T): T {
  const copy: Record<string, unknown> = { ...(record as Record<string, unknown>) };
  for (const field of PII_FIELDS[entity] ?? []) {
    if (field in copy) copy[field] = "[redacted]";
  }
  return copy as unknown as T;
}
