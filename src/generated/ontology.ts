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

/** The words one company uses for a standard concept instead of the preferred label («Block» for «Toà»). Belongs to that company only; the customer page never reads it. */
export interface CompanyLabel {
  id: number;
  /** id of Company */
  companyId: string;
  concept: string;
  label: string;
  /** ISO datetime */
  createdAt: string;
  /** ISO datetime */
  retiredAt?: string;
}

/** One pairing of a company's dictionary: the text the company writes for a value («ĐN») and the standard value of one field it stands for (Đông Nam). Belongs to that company only. */
export interface CompanyValueAlias {
  id: number;
  /** id of Company */
  companyId: string;
  field: string;
  raw: string;
  rawFold: string;
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

export type CustomFieldKind = "text" | "number" | "date" | "single_select" | "boolean";

/** A column one company keeps that the standard has no field for («Hướng view»), shown on the inventory after the standard columns. Belongs to that company only; its values live on the company's listings. */
export interface CustomField {
  /** id of Company */
  companyId: string;
  code: string;
  name: string;
  kind: CustomFieldKind;
  options?: Record<string, unknown> | unknown[];
  position: number;
  /** ISO datetime */
  createdAt: string;
  /** ISO datetime */
  retiredAt?: string;
}

export type FeeItemKind = "Law" | "Own";

/** One item of a company's fee schedule (FeeSchedule), as a percentage of the list price that comes off an Included listing. Two items are fixed by law and only switched on or off; the company's own items (Phí môi giới by default) can be added, renamed, re-rated and retired. The table keeps only what a company changed or added: an item with no row is at its default. Internal; the customer page never reads it (SP-4). */
export interface FeeItem {
  id: number;
  /** id of Company */
  companyId: string;
  code: string;
  kind: FeeItemKind;
  name?: string;
  rateBasisPoints: number;
  included: boolean;
  removed: boolean;
  position: number;
  changedBy: string;
  changedByName: string;
  /** ISO datetime */
  changedAt: string;
  retiredBy?: string;
  /** ISO datetime */
  retiredAt?: string;
}

/** The shape of a sheet a company imported — its column names in order — and where each column goes: a standard field, a custom field, or left out on purpose. The next sheet of the same shape needs no matching again. */
export interface ImportTemplate {
  id: string;
  /** id of Company */
  companyId: string;
  name: string;
  signature: Record<string, unknown> | unknown[];
  columns: Record<string, unknown> | unknown[];
  /** ISO datetime */
  createdAt: string;
  /** ISO datetime */
  retiredAt?: string;
}

export type ListingStandardStatus = "Incomplete" | "Active" | "Pending" | "Closed" | "Hold" | "Withdrawn";

export type ListingWithdrawnReason = "sold_elsewhere" | "owner_changed_mind" | "unreachable";

export type ListingFurnished = "Furnished" | "Partially" | "Unfurnished";

export type ListingOccupantType = "Owner" | "Tenant" | "Vacant";

export type ListingFeeInclusion = "Included" | "Excluded";

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
  /** ISO datetime */
  originalEntryTimestamp?: string;
  furnished?: ListingFurnished;
  occupantType?: ListingOccupantType;
  feeInclusion?: ListingFeeInclusion;
  legalStatus?: string;
  financing?: string;
  version: number;
  customFields?: Record<string, unknown> | unknown[];
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

/** A unit a company has that the shared catalog does not have yet, kept with the code the company typed; usable at once and matched to the catalog's unit when the catalog has it. Belongs to that company only; the catalog never changes. */
export interface PendingUnit {
  id: string;
  /** id of Company */
  companyId: string;
  rawCode: string;
  buildingText?: string;
  unitText?: string;
  /** id of Unit */
  unitKey?: string;
  /** ISO datetime */
  matchedAt?: string;
  /** ISO datetime */
  createdAt: string;
  /** ISO datetime */
  retiredAt?: string;
}

export type SavedViewScreen = "inventory";

/** A way of looking at one grid screen that one person saved under a name — the filter of each column, the sort, whether rows are grouped, and the hidden columns — shown as an item of the App Shell's second column and opened again exactly as saved. Belongs to the person who saved it, inside one company. */
export interface SavedView {
  id: string;
  /** id of Company */
  companyId: string;
  userId: string;
  screen: SavedViewScreen;
  name: string;
  view: string;
  /** ISO datetime */
  createdAt: string;
  /** ISO datetime */
  updatedAt: string;
}

/** One link a company member sent to one recipient, carrying one or more listings; the customer opens it without signing in. */
export interface ShareLink {
  id: string;
  /** id of Company */
  companyId: string;
  recipientName?: string;
  listingCount: number;
  /** ISO datetime */
  sentAt: string;
  openCount: number;
  interestCount: number;
  /** ISO datetime */
  lastOpenedAt?: string;
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

export interface ReadCatalogInput {
}

export interface ReadCompanyCodesInput {
}

export interface ManageCompanyCodesInput {
}

export interface ListSavedViewsInput {
}

export interface SaveViewInput {
}

export interface EditViewInput {
}

export interface RemoveViewInput {
}

export interface ReadCompanyLayerInput {
}

export interface AddCompanyLayerInput {
}

export interface EditCompanyLayerInput {
}

export interface RetireCompanyLayerInput {
}

export interface ReadFeeScheduleInput {
}

export interface SetFeeScheduleInput {
}

export interface MatchPendingUnitsInput {
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

export interface RemoveListingInput {
}

export interface ViewContactsInput {
}

export interface CreateContactInput {
}

export interface UpdateContactInput {
}

export interface RemoveContactInput {
}

export interface MergeContactsInput {
}

export interface EraseContactPersonalDataInput {
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
  /** Read the shared unit catalog — projects, complexes, towers, stacks, units and original codes. */
  readCatalog(input: ReadCatalogInput, ctx: ActionContext): Promise<void>;
  /** Read the codes and names the company uses for catalog towers and units. */
  readCompanyCodes(input: ReadCompanyCodesInput, ctx: ActionContext): Promise<void>;
  /** Add or change a code or name the company uses for a catalog tower or unit. */
  manageCompanyCodes(input: ManageCompanyCodesInput, ctx: ActionContext): Promise<void>;
  /** List one's own saved views of a grid screen, for the App Shell's second column. */
  listSavedViews(input: ListSavedViewsInput, ctx: ActionContext): Promise<void>;
  /** Save the current way of looking at a grid screen as a new view, under a name. */
  saveView(input: SaveViewInput, ctx: ActionContext): Promise<void>;
  /** Rename one's own saved view, or overwrite it with the current way of looking. */
  editView(input: EditViewInput, ctx: ActionContext): Promise<void>;
  /** Remove one's own saved view. */
  removeView(input: RemoveViewInput, ctx: ActionContext): Promise<void>;
  /** See the company's own labels, custom fields, value spellings, pending units and import templates. */
  readCompanyLayer(input: ReadCompanyLayerInput, ctx: ActionContext): Promise<void>;
  /** Add a company label, custom field or value spelling. */
  addCompanyLayer(input: AddCompanyLayerInput, ctx: ActionContext): Promise<void>;
  /** Change a company label's words, a custom field's name and options (never its kind), a value spelling, or an import template's name. */
  editCompanyLayer(input: EditCompanyLayerInput, ctx: ActionContext): Promise<void>;
  /** Stop using a label, field, value spelling, pending unit or import template; nothing is deleted and values already on units stay. */
  retireCompanyLayer(input: RetireCompanyLayerInput, ctx: ActionContext): Promise<void>;
  /** See the company's fee items, their rates, which are switched on, and who changed them. */
  readFeeSchedule(input: ReadFeeScheduleInput, ctx: ActionContext): Promise<void>;
  /** Set the company's fee schedule in one save: switch items on or off, change or reset an own item's rate, add, rename and retire own items; nothing is deleted. */
  setFeeSchedule(input: SetFeeScheduleInput, ctx: ActionContext): Promise<void>;
  /** Match the company's pending units with units the shared catalog now has; the catalog never changes. */
  matchPendingUnits(input: MatchPendingUnitsInput, ctx: ActionContext): Promise<void>;
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
  /** Remove a listing from the list; who removed it and when is kept (own scope is the unit one keeps). */
  removeListing(input: RemoveListingInput, ctx: ActionContext): Promise<void>;
  /** See the contacts of the company. */
  viewContacts(input: ViewContactsInput, ctx: ActionContext): Promise<void>;
  /** Add a contact. */
  createContact(input: CreateContactInput, ctx: ActionContext): Promise<void>;
  /** Change a contact's details (own scope is a contact one created). */
  updateContact(input: UpdateContactInput, ctx: ActionContext): Promise<void>;
  /** Remove a contact from the list; who removed it and when is kept (own scope is a contact one created). */
  removeContact(input: RemoveContactInput, ctx: ActionContext): Promise<void>;
  /** Merge two records of the same contact into one. */
  mergeContacts(input: MergeContactsInput, ctx: ActionContext): Promise<void>;
  /** Erase a contact's name and phone number at that person's request; the rest of the history is kept. */
  eraseContactPersonalData(input: EraseContactPersonalDataInput, ctx: ActionContext): Promise<void>;
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
    name: "readCatalog",
    description: "Read the shared unit catalog — projects, complexes, towers, stacks, units and original codes.",
    entity: "Unit",
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
      db: ["table catalog_nodes select", "table catalog_buildings select", "table catalog_stacks select", "table catalog_units select", "table catalog_aliases select"],
    },
  },
  {
    name: "readCompanyCodes",
    description: "Read the codes and names the company uses for catalog towers and units.",
    entity: "CompanyCatalogAlias",
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
      db: ["table company_catalog_aliases select"],
    },
  },
  {
    name: "manageCompanyCodes",
    description: "Add or change a code or name the company uses for a catalog tower or unit.",
    entity: "CompanyCatalogAlias",
    kind: "command",
    roles: ["ListAgent", "TeamLead", "CompanyAdmin"],
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
      TeamLead: "company",
      CompanyAdmin: "company",
    },
    status: "live",
    states: [],
    doors: {
      api: [],
      db: ["table company_catalog_aliases insert", "table company_catalog_aliases update"],
    },
  },
  {
    name: "listSavedViews",
    description: "List one's own saved views of a grid screen, for the App Shell's second column.",
    entity: "SavedView",
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
      ListAgent: "own",
      BuyerAgent: "own",
      TeamLead: "own",
    },
    status: "live",
    states: [],
    doors: {
      api: ["GET /api/v1/saved-views"],
      db: ["table saved_view select"],
    },
  },
  {
    name: "saveView",
    description: "Save the current way of looking at a grid screen as a new view, under a name.",
    entity: "SavedView",
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
      ListAgent: "own",
      BuyerAgent: "own",
      TeamLead: "own",
    },
    status: "live",
    states: [],
    doors: {
      api: ["POST /api/v1/saved-views"],
      db: ["table saved_view insert"],
    },
  },
  {
    name: "editView",
    description: "Rename one's own saved view, or overwrite it with the current way of looking.",
    entity: "SavedView",
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
      ListAgent: "own",
      BuyerAgent: "own",
      TeamLead: "own",
    },
    status: "live",
    states: [],
    doors: {
      api: ["PATCH /api/v1/saved-views/[id]"],
      db: ["table saved_view update"],
    },
  },
  {
    name: "removeView",
    description: "Remove one's own saved view.",
    entity: "SavedView",
    kind: "delete",
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
      ListAgent: "own",
      BuyerAgent: "own",
      TeamLead: "own",
    },
    status: "live",
    states: [],
    doors: {
      api: ["DELETE /api/v1/saved-views/[id]"],
      db: ["table saved_view delete"],
    },
  },
  {
    name: "readCompanyLayer",
    description: "See the company's own labels, custom fields, value spellings, pending units and import templates.",
    entity: "CompanyLabel",
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
      api: ["GET /api/v1/company-layer"],
      db: ["table company_labels select", "table company_fields select", "table company_value_aliases select", "table company_pending_units select", "table company_import_templates select"],
    },
  },
  {
    name: "addCompanyLayer",
    description: "Add a company label, custom field or value spelling.",
    entity: "CompanyLabel",
    kind: "create",
    roles: ["ListAgent", "TeamLead", "CompanyAdmin"],
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
      TeamLead: "company",
      CompanyAdmin: "company",
    },
    status: "live",
    states: [],
    doors: {
      api: ["POST /api/v1/company-layer/[part]"],
      db: ["table company_labels insert", "table company_fields insert", "table company_value_aliases insert", "table company_pending_units insert", "table company_import_templates insert"],
    },
  },
  {
    name: "editCompanyLayer",
    description: "Change a company label's words, a custom field's name and options (never its kind), a value spelling, or an import template's name.",
    entity: "CompanyLabel",
    kind: "update",
    roles: ["ListAgent", "TeamLead", "CompanyAdmin"],
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
      TeamLead: "company",
      CompanyAdmin: "company",
    },
    status: "live",
    states: [],
    doors: {
      api: ["PATCH /api/v1/company-layer/[part]/[id]"],
      db: ["table company_labels update", "table company_fields update", "table company_value_aliases update", "table company_import_templates update"],
    },
  },
  {
    name: "retireCompanyLayer",
    description: "Stop using a label, field, value spelling, pending unit or import template; nothing is deleted and values already on units stay.",
    entity: "CompanyLabel",
    kind: "delete",
    roles: ["ListAgent", "TeamLead", "CompanyAdmin"],
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
      TeamLead: "company",
      CompanyAdmin: "company",
    },
    status: "live",
    states: [],
    doors: {
      api: ["POST /api/v1/company-layer/[part]/[id]/retire"],
      db: ["table company_labels update", "table company_fields update", "table company_value_aliases update", "table company_pending_units update", "table company_import_templates update"],
    },
  },
  {
    name: "readFeeSchedule",
    description: "See the company's fee items, their rates, which are switched on, and who changed them.",
    entity: "FeeItem",
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
      api: ["GET /api/v1/company/fee-schedule"],
      db: ["table company_fee_items select"],
    },
  },
  {
    name: "setFeeSchedule",
    description: "Set the company's fee schedule in one save: switch items on or off, change or reset an own item's rate, add, rename and retire own items; nothing is deleted.",
    entity: "FeeItem",
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
      api: ["PUT /api/v1/company/fee-schedule"],
      db: ["table company_fee_items insert", "table company_fee_items update"],
    },
  },
  {
    name: "matchPendingUnits",
    description: "Match the company's pending units with units the shared catalog now has; the catalog never changes.",
    entity: "PendingUnit",
    kind: "command",
    roles: ["ListAgent", "TeamLead", "CompanyAdmin"],
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
      TeamLead: "company",
      CompanyAdmin: "company",
    },
    status: "live",
    states: [],
    doors: {
      api: ["POST /api/v1/company-layer/pending-units/match"],
      db: ["table company_pending_units update"],
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
  {
    name: "removeListing",
    description: "Remove a listing from the list; who removed it and when is kept (own scope is the unit one keeps).",
    entity: "Listing",
    kind: "delete",
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
  {
    name: "viewContacts",
    description: "See the contacts of the company.",
    entity: "Contact",
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
    name: "createContact",
    description: "Add a contact.",
    entity: "Contact",
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
    name: "updateContact",
    description: "Change a contact's details (own scope is a contact one created).",
    entity: "Contact",
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
      ListAgent: "own",
      BuyerAgent: "own",
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
    name: "removeContact",
    description: "Remove a contact from the list; who removed it and when is kept (own scope is a contact one created).",
    entity: "Contact",
    kind: "delete",
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
      ListAgent: "own",
      BuyerAgent: "own",
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
    name: "mergeContacts",
    description: "Merge two records of the same contact into one.",
    entity: "Contact",
    kind: "command",
    roles: ["TeamLead"],
    agent: "forbidden",
    idempotent: false,
    output: null,
    inputSchema: {
      type: "object",
      properties: {},
      additionalProperties: false,
    },
    scope: {
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
    name: "eraseContactPersonalData",
    description: "Erase a contact's name and phone number at that person's request; the rest of the history is kept.",
    entity: "Contact",
    kind: "command",
    roles: ["TeamLead"],
    agent: "forbidden",
    idempotent: false,
    output: null,
    inputSchema: {
      type: "object",
      properties: {},
      additionalProperties: false,
    },
    scope: {
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
  FeeItem: ["changedByName"],
  Member: ["name"],
  ShareLink: ["recipientName"],
};

/** Copy of `record` with personal data replaced: use before logging or agent output. */
export function redactPII<T extends object>(entity: string, record: T): T {
  const copy: Record<string, unknown> = { ...(record as Record<string, unknown>) };
  for (const field of PII_FIELDS[entity] ?? []) {
    if (field in copy) copy[field] = "[redacted]";
  }
  return copy as unknown as T;
}
