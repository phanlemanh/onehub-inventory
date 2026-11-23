// Row 1v (english-query-words): the inventory's query words in English. E2 — the old link words are translated once,
// the development switches are not; E3 — every writer writes the English words; E7 — a saved view stores no query word.
// The matrices are written ahead; every failing assertion message names its case.
import type { ReactElement } from "react";
import { describe, expect, it, vi } from "vitest";

import { recordLink } from "../src/modules/listings";
import {
  OLD_LINK_WORD,
  QUERY_WORD,
  englishQuery,
  gridView,
  savedViewHref,
  searchHref,
  storedView,
} from "../src/modules/listings/ui";
import { geoHref, geoTree } from "../src/modules/listings/ui/geo-tree";

let source: { kind: string; data?: unknown; live?: boolean } = { kind: "signed-out" };

vi.mock("next/navigation", () => ({
  redirect: (to: string) => {
    throw Object.assign(new Error(`redirect ${to}`), { to });
  },
  useRouter: () => ({ refresh: () => {} }),
}));
vi.mock("../src/modules/listings/server", () => ({
  mySavedViews: async () => null,
  mySavedView: async () => null,
}));
vi.mock("../src/modules/company-config/server", () => ({
  myCompanyLayer: async () => null,
  myFeeSchedule: async () => null,
}));
vi.mock("../src/app/(app)/inventory-source", () => ({
  inventorySource: async () => source,
  standInRole: () => null,
}));
vi.mock("../src/modules/identity/server", () => ({ currentSession: async () => null }));

/** The translated address, or «none». */
const translated = (query: Record<string, string | string[]>): string =>
  englishQuery(query)?.toString() ?? "none";

// 6 link words x 3 cases (only old · old and new · no old) = 18, + repeated place + other parameters kept + 2 dev
// switches = 22, written ahead.
const LINK_WORDS: [keyof typeof OLD_LINK_WORD, string][] = [
  ["ma", "unit"],
  ["toa", "building"],
  ["du-an", "subdivision"],
  ["ho-so", "record"],
  ["vung", "place"],
  ["goc-nhin", "view"],
];

describe("dich", () => {
  for (const [old, word] of LINK_WORDS) {
    it(`${old}: chi-cu`, () => {
      expect(translated({ [old]: "x1" }), `dich: ${old} khong chuyen`).toBe(`${word}=x1`);
    });
    it(`${old}: ca-hai`, () => {
      expect(translated({ [old]: "old", [word]: "new" }), `dich: ${old} tu moi khong thang`).toBe(
        `${word}=new`,
      );
    });
    it(`${old}: khong-cu`, () => {
      expect(
        translated({ [word]: "x1", status: "Active" }),
        `dich: ${old} chuyen khi khong co tu cu`,
      ).toBe("none");
    });
  }
  it("vung-lap-lai", () => {
    expect(translated({ vung: ["a", "b"] }), "dich: vung lap lai").toBe("place=a&place=b");
  });
  it("giu-tham-so-khac", () => {
    expect(
      translated({ status: "Active", "ho-so": "r1", state: "empty" }),
      "dich: tham so khac",
    ).toBe("status=Active&record=r1&state=empty");
  });
  it("vai: khong-dich", () => {
    expect(translated({ vai: "ListAgent" }), "dich: vai khong duoc dich").toBe("none");
  });
  it("mau: khong-dich", () => {
    expect(translated({ mau: "bien" }), "dich: mau khong duoc dich").toBe("none");
  });
});

describe("dich-bien", () => {
  it("gia-tri-ma-hoa", () => {
    const value = "Khu Đông & Tây=1";
    const out = englishQuery({ "du-an": value });
    expect(out?.get("subdivision"), "dich-bien: gia tri doi").toBe(value);
  });
});

type PageFn = (props: { searchParams: Promise<Record<string, string>> }) => Promise<ReactElement>;

/** Where the page redirects for this query, or «none». */
async function redirectOf(query: Record<string, string>): Promise<string> {
  const { default: Page } = (await import("../src/app/(app)/inventory/page")) as {
    default: PageFn;
  };
  try {
    await Page({ searchParams: Promise.resolve(query) });
    return "none";
  } catch (error) {
    const to = (error as { to?: string }).to;
    if (to === undefined) throw error;
    return to;
  }
}

describe("trang", () => {
  it("trang-chuyen", async () => {
    source = { kind: "signed-out" };
    expect(await redirectOf({ "ho-so": "r1", status: "Active" }), "trang-chuyen: dia chi").toBe(
      "/inventory?record=r1&status=Active",
    );
  });
  it("trang-chuyen: doi-chung", async () => {
    source = { kind: "forbidden" };
    expect(await redirectOf({ record: "r1" }), "trang-chuyen: tu moi van chuyen").toBe("none");
  });
  it("dang-nhap-next", async () => {
    source = { kind: "signed-out" };
    // The old link is translated first; the translated address is what the sign-in step then sees.
    const first = await redirectOf({ "goc-nhin": "v1" });
    expect(first, "dang-nhap-next: buoc dich").toBe("/inventory?view=v1");
    const second = await redirectOf({ view: "v1" });
    expect(second, "dang-nhap-next: next").toContain("next=%2Finventory%3Fview%3Dv1");
    expect(second, "dang-nhap-next: tu cu").not.toContain("goc-nhin");
  });
});

describe("ghi", () => {
  it("searchHref", () => {
    expect(searchHref("unit", "S1.0301"), "ghi: unit").toBe("/inventory?unit=S1.0301");
    expect(searchHref("building", "S1.01"), "ghi: building").toBe("/inventory?building=S1.01");
    expect(searchHref("subdivision", "P"), "ghi: subdivision").toBe("/inventory?subdivision=P");
  });
  it("cay-dia-ly", () => {
    const tree = geoTree(
      [
        {
          id: "r1",
          "Listing.subdivisionName": "P",
          "Listing.buildingName": "S1.01",
          "Listing.standardStatus": "Active",
        },
      ],
      [],
    );
    const hrefs = tree.flatMap(function walk(node): string[] {
      return [geoHref(node.key), ...node.children.flatMap(walk)];
    });
    expect(hrefs.length, "ghi: cay khong co noi").toBeGreaterThan(0);
    for (const href of hrefs) {
      expect(new URL(href, "http://x").searchParams.has("place"), `ghi: cay ${href}`).toBe(true);
    }
  });
  it("goc-nhin", () => {
    expect(savedViewHref("v1"), "ghi: goc nhin").toBe("/inventory?view=v1");
  });
  it("tin-hoi-dau-chu", () => {
    expect(recordLink("a", "https://x.test"), "ghi: tin nhan").toBe(
      "https://x.test/inventory?record=a",
    );
  });
  it("record-panel", async () => {
    const { RECORD_PARAM } = await import("../src/components/candidate/record-panel");
    expect(RECORD_PARAM, "ghi: ngan ho so").toBe(QUERY_WORD.record);
  });
});

const ALL_WORDS = [...LINK_WORDS.flat(), "vai", "mau", "quyen", "role", "sample", "permission"];

describe("khu-hoi", () => {
  it("khu-hoi-goc-nhin", () => {
    const grid = {
      filters: {
        "Listing.subdivisionName": ["P"],
        "Listing.buildingName": ["S1.01"],
        "Listing.standardStatus": ["Active"],
      },
      sort: [{ field: "Listing.listPrice", direction: "desc" }],
      grouped: false,
      hidden: [],
    };
    const stored = storedView(grid as Parameters<typeof storedView>[0]);
    const text = JSON.stringify(stored);
    for (const word of ALL_WORDS) {
      expect(text.includes(`"${word}"`), `khu-hoi: tu truy van trong vat luu (${word})`).toBe(
        false,
      );
    }
    expect(Object.keys(stored.filters).sort(), "khu-hoi: filters khoa theo truong").toEqual([
      "Listing.buildingName",
      "Listing.standardStatus",
      "Listing.subdivisionName",
    ]);
    expect(gridView(stored), "khu-hoi: mo lai").toEqual(grid);
  });
});

// E4: an old search word reaches no filter by itself — it is translated first, and the English word fills the filter.
describe("tu-cu", () => {
  it("tu-cu-khong-loc", async () => {
    const { sampleInventoryData } = await import("../src/app/(app)/inventory-sample-data");
    source = { kind: "ready", data: sampleInventoryData(), live: false };
    expect(await redirectOf({ toa: "S1.01" }), "tu-cu-khong-loc: khong dich").toBe(
      "/inventory?building=S1.01",
    );
    const { default: Page } = (await import("../src/app/(app)/inventory/page")) as {
      default: PageFn;
    };
    const filtersOf = async (query: Record<string, string>) => {
      const tree = await Page({ searchParams: Promise.resolve(query) });
      const children = (tree.props as { children: ReactElement[] }).children;
      const grid = children.find(
        (child) => (child.props as { filters?: unknown })?.filters !== undefined,
      );
      return (grid?.props as { filters?: Record<string, unknown> } | undefined)?.filters ?? {};
    };
    expect(
      await filtersOf({ building: "S1.01" }),
      "tu-cu-khong-loc: tu moi khong loc",
    ).toHaveProperty("Listing.buildingName");
  });
});
