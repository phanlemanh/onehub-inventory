// Permission table, unit level (row 9a): adding up roles (AC-2) and every API route inside the table (AC-5). The cell
// matrix below is written by hand from the design, not computed from the generated table, so a change of the table
// that nobody meant goes red here.
import {
  cpSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

import { afterAll, describe, expect, it } from "vitest";

import { ACTIONS, type ActionSpec, type Role } from "../../generated/ontology";

import {
  allowedScope,
  EXEMPT_DOORS,
  LIVE_ACTIONS,
  type ActionName,
  type Scope,
} from "./permissions";
import { ROLES } from "./roles";

const ROOT = fileURLToPath(new URL("../../..", import.meta.url));

// Written before the code (evals.yaml of bang-quyen-theo-vai): live action → cell of each role.
const CELLS: Record<string, Partial<Record<Role, Scope>>> = {
  readOwnRoles: { ListAgent: "own", BuyerAgent: "own", TeamLead: "own", CompanyAdmin: "own" },
  readCompany: {
    ListAgent: "company",
    BuyerAgent: "company",
    TeamLead: "company",
    CompanyAdmin: "company",
  },
  listMembers: { CompanyAdmin: "company" },
  inviteMember: { CompanyAdmin: "company" },
  changeMemberRoles: { CompanyAdmin: "company" },
  readAgreements: {
    ListAgent: "company",
    BuyerAgent: "company",
    TeamLead: "company",
    CompanyAdmin: "company",
  },
  manageAgreements: { CompanyAdmin: "company" },
  // Row 7d (R-1211-20): the shared catalog and the company's own codes.
  readCatalog: {
    ListAgent: "company",
    BuyerAgent: "company",
    TeamLead: "company",
    CompanyAdmin: "company",
  },
  readCompanyCodes: {
    ListAgent: "company",
    BuyerAgent: "company",
    TeamLead: "company",
    CompanyAdmin: "company",
  },
  manageCompanyCodes: { ListAgent: "company", TeamLead: "company", CompanyAdmin: "company" },
  // Row 2c (K-19): saved views, each person's own, for the three roles that read the listing board.
  listSavedViews: { ListAgent: "own", BuyerAgent: "own", TeamLead: "own" },
  saveView: { ListAgent: "own", BuyerAgent: "own", TeamLead: "own" },
  editView: { ListAgent: "own", BuyerAgent: "own", TeamLead: "own" },
  removeView: { ListAgent: "own", BuyerAgent: "own", TeamLead: "own" },
  // Row 7e (Hỏi-1, owner 2026-11-13): the company layer; every role reads, three roles change it.
  readCompanyLayer: {
    ListAgent: "company",
    BuyerAgent: "company",
    TeamLead: "company",
    CompanyAdmin: "company",
  },
  addCompanyLayer: { ListAgent: "company", TeamLead: "company", CompanyAdmin: "company" },
  editCompanyLayer: { ListAgent: "company", TeamLead: "company", CompanyAdmin: "company" },
  retireCompanyLayer: { ListAgent: "company", TeamLead: "company", CompanyAdmin: "company" },
  matchPendingUnits: { ListAgent: "company", TeamLead: "company", CompanyAdmin: "company" },
};
// Row 9e (bo-nut-theo-quyen): the seven draft rows the owner chose at the scope gate, written before the table.
const DRAFT_CELLS_9E: Record<string, Partial<Record<Role, Scope>>> = {
  removeListing: { ListAgent: "own", TeamLead: "company" },
  viewContacts: { ListAgent: "company", BuyerAgent: "company", TeamLead: "company" },
  createContact: { ListAgent: "company", BuyerAgent: "company", TeamLead: "company" },
  updateContact: { ListAgent: "own", BuyerAgent: "own", TeamLead: "company" },
  removeContact: { ListAgent: "own", BuyerAgent: "own", TeamLead: "company" },
  mergeContacts: { TeamLead: "company" },
  eraseContactPersonalData: { TeamLead: "company" },
};
// Written before the code: API doors of live rows, and the exempt API doors.
const API_DOORS = [
  "GET /api/v1/members",
  "POST /api/v1/members",
  "PUT /api/v1/members/[id]/roles",
  // Row 2c (K-19): saved views.
  "GET /api/v1/saved-views",
  "POST /api/v1/saved-views",
  "PATCH /api/v1/saved-views/[id]",
  "DELETE /api/v1/saved-views/[id]",
];
const EXEMPT_API = [
  "POST /api/v1/auth/code",
  "POST /api/v1/auth/session",
  "GET /api/v1/auth/session",
  "DELETE /api/v1/auth/session",
  "PUT /api/v1/auth/session/company",
];

/** The 15 non-empty sets of the four roles. */
const COMBOS: Role[][] = Array.from({ length: 15 }, (_, i) =>
  ROLES.filter((_, b) => (i + 1) & (1 << b)),
);

type ScopeFn = (roles: readonly Role[], action: ActionName) => Scope | null;

/** Checks `fn` against the hand-written matrix; returns the number of asserts and every mismatch. */
function addUp(fn: ScopeFn): { count: number; failures: string[] } {
  const failures: string[] = [];
  let count = 0;
  for (const [action, cells] of Object.entries(CELLS)) {
    for (const roles of COMBOS) {
      const scopes = roles.map((r) => cells[r]);
      const want: Scope | null = scopes.includes("company")
        ? "company"
        : scopes.includes("own")
          ? "own"
          : null;
      count += 1;
      if (fn(roles, action as ActionName) !== want)
        failures.push(`cong-quyen-15-to-hop: ${roles.join("+")} × ${action}`);
    }
  }
  return { count, failures };
}

/** Narrowest instead of widest: a role without a cell wins. The break of `cong-quyen-15-to-hop`. */
const narrowest: ScopeFn = (roles, action) => {
  const spec = ACTIONS.find((a) => a.name === action);
  const scopes = roles.map((r) => spec?.scope[r] ?? null);
  if (scopes.includes(null)) return null;
  return scopes.includes("own") ? "own" : "company";
};

describe("cong-quyen-15-to-hop", () => {
  it("the generated live rows are the hand-written matrix", () => {
    expect(Object.fromEntries(LIVE_ACTIONS.map((a) => [a.name, a.scope]))).toEqual(CELLS);
  });

  it("every live action × every set of roles gets the widest scope: 19 × 15 = 285 asserts (row 2c: +4 rows, row 7e: +5)", () => {
    const r = addUp(allowedScope);
    expect(r.failures).toEqual([]);
    expect(r.count).toBe(285);
  });

  it("break: taking the narrowest scope names the first set that differs", () => {
    expect(addUp(narrowest).failures).toContain(
      "cong-quyen-15-to-hop: ListAgent+CompanyAdmin × listMembers",
    );
  });
});

describe("dong-nhap-9e", () => {
  it("the seven draft rows of row 9e are the hand-written cells, planned, without doors", () => {
    for (const [name, cells] of Object.entries(DRAFT_CELLS_9E)) {
      const spec = ACTIONS.find((a) => a.name === name);
      expect(spec?.status, name).toBe("planned");
      expect(spec?.scope, name).toEqual(cells);
      expect([...(spec?.doors.api ?? []), ...(spec?.doors.db ?? [])], name).toEqual([]);
    }
  });

  it("the company admin has no cell in any of them", () => {
    for (const name of Object.keys(DRAFT_CELLS_9E))
      expect(allowedScope(["CompanyAdmin"], name as ActionName), name).toBeNull();
  });
});

/** Decision 0016: the company admin looks after people and settings, not listings, owners or contacts. */
function adminOnBusiness(table: readonly ActionSpec[]): string[] {
  return table
    .filter((a) => ["Listing", "ListingOwner", "Contact"].includes(a.entity ?? ""))
    .filter((a) => a.scope.CompanyAdmin !== undefined)
    .map((a) => `quan-tri-khong-o-nghiep-vu: ${a.name}`);
}

describe("quan-tri-khong-o-nghiep-vu", () => {
  it("the company admin has no cell on any listing, owner or contact row", () => {
    expect(ACTIONS.filter((a) => a.entity === "Contact").length).toBeGreaterThan(0);
    expect(adminOnBusiness(ACTIONS)).toEqual([]);
  });

  it("break: a copy of the table giving the admin removeListing names that row", () => {
    const table = ACTIONS.map((a) =>
      a.name === "removeListing"
        ? { ...a, scope: { ...a.scope, CompanyAdmin: "company" as const } }
        : a,
    );
    expect(adminOnBusiness(table)).toEqual(["quan-tri-khong-o-nghiep-vu: removeListing"]);
  });
});

describe("khong-vai-khong-quyen", () => {
  it("no role in the company of the session: no action at all", () => {
    for (const a of ACTIONS) expect(allowedScope([], a.name), a.name).toBeNull();
  });

  it("break: one role makes it non-null, so the case can fail", () => {
    expect(allowedScope(["CompanyAdmin"], "listMembers")).toBe("company");
  });
});

// ---- Every API route is inside the table (AC-5)

const METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"] as const;

/** `<METHOD> /api/v1/...` for every method every route.ts under `apiDir` exports. */
function routes(apiDir: string): string[] {
  const out: string[] = [];
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) walk(path);
      else if (entry.name === "route.ts") {
        const url = "/api/v1/" + relative(apiDir, dir).split(sep).join("/");
        const text = readFileSync(path, "utf8");
        for (const m of METHODS) {
          if (
            new RegExp(`export\\s+(async\\s+)?function\\s+${m}\\b|export\\s+const\\s+${m}\\b`).test(
              text,
            )
          )
            out.push(`${m} ${url}`);
        }
      }
    }
  };
  walk(apiDir);
  return out.sort();
}

function apiCheck(
  found: string[],
  table: readonly ActionSpec[],
  exempt: readonly { door: string }[],
): string[] {
  const declared = new Set([
    ...table.filter((a) => a.status === "live").flatMap((a) => a.doors.api),
    ...exempt.map((e) => e.door).filter((d) => /^[A-Z]+ \/api\//.test(d)),
  ]);
  const failures = found.filter((r) => !declared.has(r)).map((r) => `route-ngoai-bang: ${r}`);
  const real = new Set(found);
  for (const d of declared) if (!real.has(d)) failures.push(`cua-api-khai-ma-khong-co: ${d}`);
  return failures;
}

const API_DIR = join(ROOT, "src", "app", "api", "v1");
const copies: string[] = [];
afterAll(() => {
  for (const dir of copies) rmSync(dir, { recursive: true, force: true });
});

describe("route-ngoai-bang", () => {
  it("every route and method of /api/v1 is a door of a live row or exempt", () => {
    const found = routes(API_DIR);
    expect(found).toEqual([...API_DOORS, ...EXEMPT_API].sort());
    expect(apiCheck(found, ACTIONS, EXEMPT_DOORS)).toEqual([]);
  });

  it("the exempt API doors are the set written before the code, each with a reason", () => {
    const api = EXEMPT_DOORS.filter((e) => /^[A-Z]+ \/api\//.test(e.door));
    expect(api.map((e) => e.door).sort()).toEqual([...EXEMPT_API].sort());
    for (const e of api) expect(e.reason.trim(), e.door).not.toBe("");
  });

  it("break: a new POST route without a row names it", () => {
    const dir = mkdtempSync(join(tmpdir(), "route-"));
    copies.push(dir);
    cpSync(API_DIR, dir, { recursive: true });
    mkdirSync(join(dir, "thu"));
    writeFileSync(
      join(dir, "thu", "route.ts"),
      "export function POST(): Response {\n  return new Response();\n}\n",
    );
    expect(apiCheck(routes(dir), ACTIONS, EXEMPT_DOORS)).toEqual([
      "route-ngoai-bang: POST /api/v1/thu",
    ]);
  });
});

describe("cua-api-khai-ma-khong-co", () => {
  it("break: a door declared in the table but missing in the code names it", () => {
    const table = ACTIONS.map((a) =>
      a.name === "listMembers"
        ? { ...a, doors: { ...a.doors, api: [...a.doors.api, "GET /api/v1/khong-co"] } }
        : a,
    );
    expect(apiCheck(routes(API_DIR), table, EXEMPT_DOORS)).toEqual([
      "cua-api-khai-ma-khong-co: GET /api/v1/khong-co",
    ]);
  });
});
