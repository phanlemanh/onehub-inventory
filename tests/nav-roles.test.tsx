// @vitest-environment jsdom
// Row 1i: a person holding several roles sees the entries of every role they hold (decision 0016).
import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, expectTypeOf, it, vi } from "vitest";

import { AppShell } from "../src/components/templates/app-shell";
import { NavMenu, visibleNav, type NavItem } from "../src/components/templates/nav-menu";
import { SidebarProvider } from "../src/components/ui/sidebar";
import type { Role } from "../src/generated/ontology";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  // The second column lights a status shortcut by its query too (row 2a).
  useSearchParams: () => new URLSearchParams(),
}));

beforeAll(() => {
  window.matchMedia ??= ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
});

afterEach(() => cleanup());

/** Restricted entries sit between unrestricted ones, so "unrestricted first" is not the declared order. */
const ITEMS: NavItem[] = [
  { href: "/", title: "Mục chung một" },
  { href: "/admin", title: "Mục quản trị", roles: ["CompanyAdmin"] },
  { href: "/inventory", title: "Mục chung hai" },
  { href: "/team", title: "Mục nhóm", roles: ["TeamLead", "CompanyAdmin"] },
  { href: "/deals", title: "Mục giao dịch", roles: ["ListAgent", "BuyerAgent"] },
];

/** The four roles, in the order of ontology/roles.yaml. */
const ROLES: readonly Role[] = ["ListAgent", "BuyerAgent", "TeamLead", "CompanyAdmin"];

const key = (roles: readonly Role[]): string => (roles.length ? [...roles].join("+") : "(none)");

/**
 * Written by hand before the code: for each set of held roles, which of the five entries show.
 * Columns follow ITEMS: chung một, quản trị, chung hai, nhóm, giao dịch.
 */
const SEES: Record<string, readonly boolean[]> = {
  "(none)": [true, false, true, false, false],
  ListAgent: [true, false, true, false, true],
  BuyerAgent: [true, false, true, false, true],
  TeamLead: [true, false, true, true, false],
  CompanyAdmin: [true, true, true, true, false],
  "ListAgent+BuyerAgent": [true, false, true, false, true],
  "ListAgent+TeamLead": [true, false, true, true, true],
  "ListAgent+CompanyAdmin": [true, true, true, true, true],
  "BuyerAgent+TeamLead": [true, false, true, true, true],
  "BuyerAgent+CompanyAdmin": [true, true, true, true, true],
  "TeamLead+CompanyAdmin": [true, true, true, true, false],
  "ListAgent+BuyerAgent+TeamLead": [true, false, true, true, true],
  "ListAgent+BuyerAgent+CompanyAdmin": [true, true, true, true, true],
  "ListAgent+TeamLead+CompanyAdmin": [true, true, true, true, true],
  "BuyerAgent+TeamLead+CompanyAdmin": [true, true, true, true, true],
  "ListAgent+BuyerAgent+TeamLead+CompanyAdmin": [true, true, true, true, true],
};

/** Every subset of the four roles, keeping their declared order. */
function subsets(): Role[][] {
  const out: Role[][] = [];
  for (let mask = 0; mask < 1 << ROLES.length; mask++) {
    out.push(ROLES.filter((_, i) => mask & (1 << i)));
  }
  return out;
}

function sidebarTitles(roles?: readonly Role[]): string[] {
  const { container, unmount } = render(
    <SidebarProvider>
      <NavMenu items={ITEMS} roles={roles} />
    </SidebarProvider>,
  );
  const titles = [...container.querySelectorAll("a")].map((a) => a.textContent ?? "");
  unmount();
  return titles;
}

/** Throws when the rendered titles are not exactly the expected entries, once each, in the declared order. */
function assertSees(expected: readonly boolean[], titles: readonly string[]): void {
  ITEMS.forEach((item, i) => {
    const shown = titles.includes(item.title);
    if (shown && !expected[i]) throw new Error(`role filter leaked: ${item.title}`);
    if (!shown && expected[i]) throw new Error(`role filter missed: ${item.title}`);
    if (titles.filter((t) => t === item.title).length > 1)
      throw new Error(`entry shown twice: ${item.title}`);
  });
  const order = ITEMS.filter((_, i) => expected[i]).map((item) => item.title);
  if (JSON.stringify(titles) !== JSON.stringify(order)) throw new Error("navigation order changed");
}

describe("sidebar for every role a person holds", () => {
  it("has the matrix that was written down: all 16 role sets, five entries each", () => {
    expect(Object.keys(SEES).sort()).toEqual(subsets().map(key).sort());
    for (const row of Object.values(SEES)) expect(row).toHaveLength(ITEMS.length);
  });

  it("shows every entry of every held role, once, in the declared order", () => {
    const several = subsets().filter((s) => s.length >= 2);
    expect(several).toHaveLength(11);
    for (const roles of several) {
      expect(() => assertSees(SEES[key(roles)]!, sidebarTitles(roles)), key(roles)).not.toThrow();
    }
    expect(
      sidebarTitles(["TeamLead", "CompanyAdmin"]).filter((t) => t === "Mục nhóm"),
    ).toHaveLength(1);
  });

  it("one held role sees what the single-role rule of row 1a gives", () => {
    for (const role of ROLES) {
      expect(() => assertSees(SEES[role]!, sidebarTitles([role])), role).not.toThrow();
    }
  });

  it("without roles only unrestricted entries show", () => {
    expect(sidebarTitles()).toEqual(["Mục chung một", "Mục chung hai"]);
    expect(sidebarTitles([])).toEqual(["Mục chung một", "Mục chung hai"]);
    expect(visibleNav(ITEMS).map((item) => item.href)).toEqual(["/", "/inventory"]);
  });

  it("the check fails when a sidebar shows an entry of a role not held", () => {
    expect(() => assertSees(SEES.ListAgent!, sidebarTitles(["ListAgent", "TeamLead"]))).toThrow(
      "role filter leaked: Mục nhóm",
    );
    expect(() => assertSees(SEES["(none)"]!, sidebarTitles(["CompanyAdmin"]))).toThrow(
      "role filter leaked: Mục quản trị",
    );
  });

  it("the check fails when a sidebar misses an entry of a held role", () => {
    expect(() => assertSees(SEES["ListAgent+TeamLead"]!, sidebarTitles(["ListAgent"]))).toThrow(
      "role filter missed: Mục nhóm",
    );
  });

  it("the check fails when unrestricted entries are moved to the top", () => {
    const moved = ["Mục chung một", "Mục chung hai", "Mục quản trị", "Mục nhóm"];
    expect(() => assertSees(SEES.CompanyAdmin!, moved)).toThrow("navigation order changed");
  });
});

describe("the frame passes every held role to the sidebar", () => {
  function frameTitles(roles: readonly Role[]): string[] {
    const { container, unmount } = render(<AppShell nav={ITEMS} roles={roles} />);
    const titles = [...container.querySelectorAll('[data-sidebar="menu-button"]')].map(
      (a) => a.textContent ?? "",
    );
    unmount();
    return titles;
  }

  it("the frame passes every held role to the sidebar", () => {
    const titles = frameTitles(["BuyerAgent", "TeamLead"]);
    expect(titles).toEqual(["Mục chung một", "Mục chung hai", "Mục nhóm", "Mục giao dịch"]);
    expect(() => assertSees(SEES["BuyerAgent+TeamLead"]!, titles)).not.toThrow();
  });

  it("the check fails on a frame given fewer roles", () => {
    expect(() => assertSees(SEES["BuyerAgent+TeamLead"]!, frameTitles(["BuyerAgent"]))).toThrow(
      "role filter missed: Mục nhóm",
    );
  });
});

describe("roles of an entry come from the role list of ontology/roles.yaml", () => {
  it("accepts a declared role and rejects any other at type check", () => {
    const declared: NavItem = { href: "/team", title: "Mục nhóm", roles: ["TeamLead"] };
    // @ts-expect-error -- "Admin" is not one of the four declared roles
    const undeclared: NavItem = { href: "/x", title: "Mục lạ", roles: ["Admin"] };
    expect(declared.roles).toEqual(["TeamLead"]);
    expect(undeclared.roles).toEqual(["Admin"]);
  });

  it("an entry's role type is the generated Role type", () => {
    expectTypeOf<NonNullable<NavItem["roles"]>[number]>().toEqualTypeOf<Role>();
  });
});
