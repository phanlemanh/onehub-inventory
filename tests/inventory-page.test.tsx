// The inventory page itself (roadmap row 2, E12): the state it hands the grid in each environment, and the rows it
// builds from the sample data — measured on the page function, not only on the pure reader it calls.
import type { ReactElement } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import Page from "../src/app/(app)/inventory/page";
import type { GridRow } from "../src/components/candidate/data-region";
import { sampleUnits } from "../src/modules/catalog";
import {
  SAMPLE_COMPANY,
  buildSampleListings,
  sampleId,
  SAMPLE_ID_KIND,
} from "../src/modules/listings";
import { InventoryGrid } from "../src/modules/listings/ui";

vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: () => {} }) }));
// Saved views (row 2c) are read from the database behind the session; this page test has neither.
vi.mock("../src/modules/listings/server", () => ({
  mySavedViews: async () => null,
  mySavedView: async () => null,
}));
// The role stand-in of row 4 asks for the session only when ?vai= is given; there is none here.
vi.mock("../src/modules/identity/server", () => ({ currentSession: async () => null }));

afterEach(() => {
  vi.unstubAllEnvs();
});

type GridProps = { rows: GridRow[]; state: string };
type PageFn = (props: { searchParams: Promise<Record<string, string>> }) => Promise<ReactElement>;

/** Opens the page with `?state=<param>` in one environment and returns the props it gives the inventory grid. */
async function gridProps(page: PageFn, param: string, env: string): Promise<GridProps> {
  vi.stubEnv("NODE_ENV", env);
  const tree = await page({ searchParams: Promise.resolve({ state: param }) });
  const children = (tree.props as { children: ReactElement[] }).children;
  const grid = children.find((child) => child.type === InventoryGrid);
  if (!grid) throw new Error("page has no inventory grid");
  return grid.props as GridProps;
}

// Written ahead: 5 parameters × 2 environments = 10 cells.
const MATRIX: [string, string, string][] = [
  ["loading", "production", "ready"],
  ["empty", "production", "ready"],
  ["error", "production", "ready"],
  ["partial", "production", "ready"],
  ["forbidden", "production", "ready"],
  ["loading", "development", "loading"],
  ["empty", "development", "empty"],
  ["error", "development", "error"],
  ["partial", "development", "partial"],
  ["forbidden", "development", "forbidden"],
];

async function checkPage(page: PageFn): Promise<void> {
  for (const [param, env, want] of MATRIX) {
    const { state } = await gridProps(page, param, env);
    if (state !== want) {
      throw new Error(
        env === "production"
          ? `page honours state in production: ${param}`
          : `page state ${param}: ${state}`,
      );
    }
  }
  // The rows: 60, and the first listing's area and bedrooms are those of the unit its link points at.
  const { rows } = await gridProps(page, "", "development");
  if (rows.length !== 60) throw new Error(`page rows: ${rows.length}`);
  const sample = buildSampleListings({ companyId: SAMPLE_COMPANY.id, units: sampleUnits() });
  const firstId = sampleId(SAMPLE_ID_KIND.listing, 1);
  const upi = sample.listingUnits.find((x) => x.listingId === firstId)?.upi;
  const unit = sampleUnits().find((u) => u.upi === upi);
  const row = rows.find((r) => r.id === firstId);
  if (
    !row ||
    row["Unit.livingArea"] !== unit?.livingArea ||
    row["Unit.bedroomsTotal"] !== unit?.bedroomsTotal
  )
    throw new Error(`page row unit mismatch: ${firstId}`);
}

describe("inventory page (E12)", () => {
  it("hands the grid the asked state only outside production, and rows joined through the unit link", async () => {
    expect(MATRIX.length).toBe(10);
    await expect(checkPage(Page as unknown as PageFn)).resolves.toBeUndefined();
  });

  it("fails when the page reads ?state= without looking at the environment", async () => {
    const blind: PageFn = async (props) => {
      const tree = await (Page as unknown as PageFn)(props);
      const asked = (await props.searchParams).state || "ready";
      const children = (tree.props as { children: ReactElement[] }).children.map((child) =>
        child.type === InventoryGrid
          ? {
              ...child,
              props: {
                ...(child.props as object),
                state: asked,
              },
            }
          : child,
      );
      return { ...tree, props: { ...(tree.props as object), children } } as ReactElement;
    };
    await expect(checkPage(blind)).rejects.toThrow("page honours state in production: loading");
  });
});

describe("status shortcuts open the page filtered (row 2a, E10)", () => {
  type FilterProps = { filters?: Record<string, unknown> };
  async function filtersFor(
    page: PageFn,
    status: string | string[],
  ): Promise<FilterProps["filters"]> {
    const tree = await page({
      searchParams: Promise.resolve({ status } as unknown as Record<string, string>),
    });
    const children = (tree.props as { children: ReactElement[] }).children;
    const grid = children.find((child) => child.type === InventoryGrid);
    if (!grid) throw new Error("page has no inventory grid");
    return (grid.props as FilterProps).filters;
  }

  // Written ahead: six statuses and one unknown value = 7 cells.
  const CELLS: [string, Record<string, unknown>][] = [
    ["Active", { "Listing.standardStatus": ["Active"] }],
    ["Incomplete", { "Listing.standardStatus": ["Incomplete"] }],
    ["Pending", { "Listing.standardStatus": ["Pending"] }],
    ["Closed", { "Listing.standardStatus": ["Closed"] }],
    ["Hold", { "Listing.standardStatus": ["Hold"] }],
    ["Withdrawn", { "Listing.standardStatus": ["Withdrawn"] }],
    ["Paused", {}],
  ];

  async function checkStatusPage(page: PageFn): Promise<void> {
    for (const [status, want] of CELLS) {
      const got = await filtersFor(page, status);
      if (JSON.stringify(got ?? {}) !== JSON.stringify(want))
        throw new Error(`page drops status: ${status}`);
    }
  }

  it("hands the grid the status filter each shortcut asks for (7 cells)", async () => {
    expect(CELLS).toHaveLength(7);
    await expect(checkStatusPage(Page as unknown as PageFn)).resolves.toBeUndefined();
    expect(await filtersFor(Page as unknown as PageFn, ["Active", "Pending"])).toEqual({
      "Listing.standardStatus": ["Active"],
    });
  });

  it("the check fails on a page that drops the status", async () => {
    const dropping: PageFn = async ({ searchParams }) => {
      const params = await searchParams;
      return (Page as unknown as PageFn)({
        searchParams: Promise.resolve({ ...params, status: "" }),
      });
    };
    await expect(checkStatusPage(dropping)).rejects.toThrow("page drops status: Active");
  });
});
