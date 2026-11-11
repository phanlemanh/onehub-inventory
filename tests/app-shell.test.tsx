// @vitest-environment jsdom
// Row 1o: the App Shell arranged from ReUI app-shell-8 — icon rail filtered by every held role, second column of the
// open screen (foldable, remembered), and the repo's own banner and page states inside it.
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import { AppShell, MAIN_ID, type NavItem } from "../src/components/templates/app-shell";
import { COLUMN_COOKIE } from "../src/components/templates/app-shell/second-column";
import { RAIL_COPY } from "../src/components/templates/app-shell/rail-copy";
import { FRAME_COPY } from "../src/components/templates/frame-copy";
import { PageState } from "../src/components/templates/page-state";
import { clearScreenBanner } from "../src/components/templates/screen-banner";
import type { Role } from "../src/generated/ontology";

const nav = vi.hoisted(() => ({ pathname: "/" }));
vi.mock("next/navigation", () => ({ usePathname: () => nav.pathname }));

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

beforeEach(() => {
  nav.pathname = "/";
  document.cookie = `${COLUMN_COOKIE}=; path=/; max-age=0`;
  Object.defineProperty(navigator, "onLine", { configurable: true, value: true });
});

afterEach(() => {
  cleanup();
  clearScreenBanner();
});

/** Restricted entries sit between unrestricted ones, so "unrestricted first" is not the declared order. */
const ITEMS: NavItem[] = [
  { href: "/", title: "Mục chung một" },
  { href: "/admin", title: "Mục quản trị", roles: ["CompanyAdmin"] },
  {
    href: "/inventory",
    title: "Mục chung hai",
    sections: [
      { items: [{ href: "/inventory", title: "Tất cả mục hai" }] },
      {
        title: "Lối tắt",
        items: [
          { href: "/inventory", title: "Lối tắt một" },
          { href: "/inventory", title: "Lối tắt hai" },
        ],
      },
    ],
  },
  { href: "/team", title: "Mục nhóm", roles: ["TeamLead", "CompanyAdmin"] },
  { href: "/deals", title: "Mục giao dịch", roles: ["ListAgent", "BuyerAgent"] },
];

const ROLES: readonly Role[] = ["ListAgent", "BuyerAgent", "TeamLead", "CompanyAdmin"];
const key = (roles: readonly Role[]): string => (roles.length ? [...roles].join("+") : "(none)");

/**
 * Written by hand before the code: for each set of held roles, which of the five entries the rail shows.
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

/** Every subset of the four roles, in the order of ROLES. */
function subsets(): Role[][] {
  return Array.from({ length: 1 << ROLES.length }, (_, mask) =>
    ROLES.filter((_, i) => mask & (1 << i)),
  );
}

/** Names of the rail entries only (the second column uses sub-menu buttons). */
function railTitles(roles: readonly Role[]): string[] {
  const { container, unmount } = render(<AppShell nav={ITEMS} roles={roles} />);
  const titles = [...container.querySelectorAll('[data-sidebar="menu-button"]')].map(
    (a) => a.textContent ?? "",
  );
  unmount();
  return titles;
}

function assertSees(expected: readonly boolean[], titles: string[]): void {
  ITEMS.forEach((item, i) => {
    const shown = titles.includes(item.title);
    if (shown && !expected[i]) throw new Error(`role filter leaked: ${item.title}`);
    if (!shown && expected[i]) throw new Error(`role filter missed: ${item.title}`);
  });
  const order = ITEMS.filter((_, i) => expected[i]).map((item) => item.title);
  if (JSON.stringify(titles) !== JSON.stringify(order)) throw new Error("navigation order changed");
}

describe("rail of the App Shell by role", () => {
  it("has the 16 role sets of the matrix, each with five cells", () => {
    expect(Object.keys(SEES).sort()).toEqual(subsets().map(key).sort());
    for (const row of Object.values(SEES)) expect(row).toHaveLength(ITEMS.length);
  });

  it("shows every entry of every held role, once, in the declared order", () => {
    for (const roles of subsets()) {
      expect(() => assertSees(SEES[key(roles)]!, railTitles(roles)), key(roles)).not.toThrow();
    }
  });

  it("the check fails on a rail built for more roles than expected", () => {
    expect(() => assertSees(SEES.ListAgent!, railTitles(["ListAgent", "TeamLead"]))).toThrow(
      "role filter leaked: Mục nhóm",
    );
  });

  it("the check fails on a rail built for fewer roles than expected", () => {
    expect(() => assertSees(SEES["ListAgent+TeamLead"]!, railTitles(["ListAgent"]))).toThrow(
      "role filter missed: Mục nhóm",
    );
  });

  it("names each rail entry and marks only the open screen", () => {
    nav.pathname = "/inventory";
    const { container } = render(<AppShell nav={ITEMS} roles={["ListAgent"]} />);
    const rail = [...container.querySelectorAll('[data-sidebar="menu-button"]')];
    const current = rail.filter((a) => a.getAttribute("aria-current") === "page");
    expect(current.map((a) => a.getAttribute("href"))).toEqual(["/inventory"]);
    expect(rail.every((a) => (a.textContent ?? "").trim().length > 0)).toBe(true);
  });
});

describe("second column of the App Shell", () => {
  function column(): HTMLElement {
    const aside = document.querySelector<HTMLElement>('[data-slot="app-shell-second-column"]');
    if (!aside) throw new Error("second column missing");
    return aside;
  }

  it("shows the places of the open screen, the first one marked", () => {
    nav.pathname = "/inventory";
    render(<AppShell nav={ITEMS} />);
    const links = [...column().querySelectorAll("a")];
    expect(links.map((a) => a.textContent)).toEqual([
      "Tất cả mục hai",
      "Lối tắt một",
      "Lối tắt hai",
    ]);
    expect(links.filter((a) => a.getAttribute("aria-current") === "page")).toHaveLength(1);
    expect(links[0]?.getAttribute("aria-current")).toBe("page");
    expect(column().textContent).toContain("Lối tắt");
  });

  it("says the screen has no sub-places when it declares none", () => {
    nav.pathname = "/";
    render(<AppShell nav={ITEMS} />);
    expect(column().querySelectorAll("a")).toHaveLength(0);
    expect(column().textContent).toContain(RAIL_COPY.noSubItems);
  });

  it("folds with the handle and stays folded after a reload", () => {
    nav.pathname = "/inventory";
    const first = render(<AppShell nav={ITEMS} />);
    expect(column().dataset.state).toBe("open");
    fireEvent.click(screen.getByRole("button", { name: RAIL_COPY.collapseColumn }));
    expect(column().dataset.state).toBe("closed");
    expect(
      screen.getByRole("button", { name: RAIL_COPY.expandColumn }).getAttribute("aria-expanded"),
    ).toBe("false");
    first.unmount();
    render(<AppShell nav={ITEMS} />);
    expect(column().dataset.state, "second column state lost after reload").toBe("closed");
    fireEvent.click(screen.getByRole("button", { name: RAIL_COPY.expandColumn }));
    expect(column().dataset.state).toBe("open");
  });

  it("the reload check fails when the remembered choice is wiped", () => {
    nav.pathname = "/inventory";
    const first = render(<AppShell nav={ITEMS} />);
    fireEvent.click(screen.getByRole("button", { name: RAIL_COPY.collapseColumn }));
    first.unmount();
    document.cookie = `${COLUMN_COOKIE}=; path=/; max-age=0`;
    render(<AppShell nav={ITEMS} />);
    expect(() => {
      if (column().dataset.state !== "closed")
        throw new Error("second column state lost after reload");
    }).toThrow("second column state lost after reload");
  });
});

describe("the repo's own parts inside the App Shell", () => {
  it("the skip link jumps to the main region", () => {
    render(<AppShell nav={ITEMS} />);
    const skip = screen.getByRole("link", { name: FRAME_COPY.skipToContent });
    expect(skip.getAttribute("href")).toBe(`#${MAIN_ID}`);
    expect(document.getElementById(MAIN_ID)?.tagName).toBe("MAIN");
  });

  it("shows the offline banner inside the main region and clears it when back online", () => {
    render(<AppShell nav={ITEMS}>màn</AppShell>);
    act(() => {
      window.dispatchEvent(new Event("offline"));
    });
    const main = document.getElementById(MAIN_ID)!;
    expect(main.textContent).toContain(FRAME_COPY.offline.title);
    act(() => {
      window.dispatchEvent(new Event("online"));
    });
    expect(main.textContent).not.toContain(FRAME_COPY.offline.title);
  });

  it("keeps the rail around a full-page state", () => {
    render(
      <AppShell nav={ITEMS}>
        <PageState kind="not-found" />
      </AppShell>,
    );
    const main = document.getElementById(MAIN_ID)!;
    expect(main.querySelector('[data-slot="page-state"]')?.getAttribute("data-kind")).toBe(
      "not-found",
    );
    expect(document.querySelectorAll('[data-sidebar="menu-button"]').length).toBeGreaterThan(0);
  });
});
