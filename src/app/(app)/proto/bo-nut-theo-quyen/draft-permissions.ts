// Draft rows of the permission table for the prototype of row 9e, as approved at its scope gate (plain verbs, contact
// cells after common CRM practice). They are NOT in ontology/actions.yaml yet: the build step adds them (status planned). Cells follow
// decision 0016: Company admin looks after people and settings, not listings or contacts; Team lead sees the whole
// company; agents work on their own records for the removing actions.
import type { ActionSpec, Role } from "@/generated/ontology";

type Cells = Partial<Record<Role, "company" | "own">>;

const AGENTS_AND_LEAD: Cells = { ListAgent: "company", BuyerAgent: "company", TeamLead: "company" };

function row(name: string, kind: ActionSpec["kind"], entity: string, scope: Cells): ActionSpec {
  return {
    name: name as ActionSpec["name"],
    description: name,
    entity,
    kind,
    roles: [],
    agent: "forbidden",
    idempotent: false,
    output: null,
    inputSchema: {},
    scope,
    status: "planned",
    states: [],
    doors: { api: [], db: [] },
  };
}

export const DRAFT_ACTIONS: readonly ActionSpec[] = [
  row("viewListings", "query", "Listing", AGENTS_AND_LEAD),
  row("createListing", "create", "Listing", AGENTS_AND_LEAD),
  row("updateListing", "update", "Listing", AGENTS_AND_LEAD),
  row("removeListing", "delete", "Listing", { ListAgent: "own", TeamLead: "company" }),
  row("removeContact", "delete", "Contact", {
    ListAgent: "own",
    BuyerAgent: "own",
    TeamLead: "company",
  }),
  row("viewContacts", "query", "Contact", AGENTS_AND_LEAD),
  row("createContact", "create", "Contact", AGENTS_AND_LEAD),
  row("updateContact", "update", "Contact", {
    ListAgent: "own",
    BuyerAgent: "own",
    TeamLead: "company",
  }),
  row("mergeContacts", "command", "Contact", { TeamLead: "company" }),
  row("eraseContactPersonalData", "delete", "Contact", { TeamLead: "company" }),
];

export type DraftAction =
  | "viewListings"
  | "createListing"
  | "updateListing"
  | "removeListing"
  | "removeContact"
  | "viewContacts"
  | "createContact"
  | "updateContact"
  | "mergeContacts"
  | "eraseContactPersonalData";
