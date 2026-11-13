// The Sent page itself (roadmap row 6, E6): the state it hands the grid in each environment, and the units it lists
// for a link — measured on the page function, not only on the pure reader it calls.
import type { ReactElement } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import Page from "../src/app/(app)/sent/page";
import type { GridRow } from "../src/components/candidate/data-region";
import { sampleUnits } from "../src/modules/catalog";
import { SAMPLE_COMPANY, buildSampleListings } from "../src/modules/listings";
import { SentGrid, buildSampleShareLinks } from "../src/modules/sharing/ui";

afterEach(() => {
  vi.unstubAllEnvs();
});

type GridProps = {
  rows: GridRow[];
  state: string;
  unitsByLink: Record<string, readonly string[]>;
};
type PageFn = (props: { searchParams: Promise<Record<string, string>> }) => Promise<ReactElement>;

/** Opens the page with `?state=<param>` in one environment and returns the props it gives the Sent grid. */
async function gridProps(page: PageFn, param: string, env: string): Promise<GridProps> {
  vi.stubEnv("NODE_ENV", env);
  const tree = await page({ searchParams: Promise.resolve({ state: param }) });
  const children = (tree.props as { children: ReactElement[] }).children;
  const grid = children.find((child) => child.type === SentGrid);
  if (!grid) throw new Error("page has no sent grid");
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

const LINK_5 = "4d415500-0010-4000-8000-000000000005";

async function checkPage(page: PageFn): Promise<void> {
  for (const [param, env, want] of MATRIX) {
    const { state } = await gridProps(page, param, env);
    if (state !== want)
      throw new Error(
        env === "production"
          ? `page honours state in production: ${param}`
          : `page state ${param}: ${state}`,
      );
  }
  const { rows, unitsByLink } = await gridProps(page, "", "development");
  if (rows.length !== 14) throw new Error(`page rows: ${rows.length}`);
  // The units of link 5, looked up from the source records: its listings, in order, as unit · building.
  const { listings } = buildSampleListings({ companyId: SAMPLE_COMPANY.id, units: sampleUnits() });
  const { includes } = buildSampleShareLinks({
    companyId: SAMPLE_COMPANY.id,
    listingIds: listings.map((l) => l.id),
  });
  const byId = new Map(listings.map((l) => [l.id, l]));
  const want = (includes.get(LINK_5) ?? []).map((id) =>
    [byId.get(id)?.unitNumber, byId.get(id)?.buildingName].filter(Boolean).join(" · "),
  );
  const row = rows.find((r) => r.id === LINK_5);
  const got = unitsByLink[LINK_5] ?? [];
  if (!row || got.length !== row["ShareLink.listingCount"] || got.join("|") !== want.join("|"))
    throw new Error(`page units of link: ${LINK_5}`);
}

describe("sent page (E6)", () => {
  it("hands the grid the asked state only outside production, and each link's units", async () => {
    expect(MATRIX.length).toBe(10);
    await expect(checkPage(Page as unknown as PageFn)).resolves.toBeUndefined();
  });

  it("fails when the page reads the parameter whatever the environment", async () => {
    // The page that ignores the environment for an error, the state a real user must never be shown by accident.
    const blind: PageFn = async (props) => {
      if ((await props.searchParams).state === "error") vi.stubEnv("NODE_ENV", "development");
      return (Page as unknown as PageFn)(props);
    };
    await expect(checkPage(blind)).rejects.toThrow("page honours state in production: error");
  });

  it("fails when the page lists another link's units", async () => {
    const swapped: PageFn = async (props) => {
      const tree = await (Page as unknown as PageFn)(props);
      const children = (tree.props as { children: ReactElement[] }).children.map((child) => {
        if (child.type !== SentGrid) return child;
        const p = child.props as GridProps;
        const other = Object.values(p.unitsByLink)[0] ?? [];
        return { ...child, props: { ...p, unitsByLink: { ...p.unitsByLink, [LINK_5]: other } } };
      });
      return { ...tree, props: { ...(tree.props as object), children } } as ReactElement;
    };
    await expect(checkPage(swapped)).rejects.toThrow(`page units of link: ${LINK_5}`);
  });
});
