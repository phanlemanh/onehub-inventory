// @vitest-environment jsdom
// Sent on the shared grid (roadmap row 6, _acceptance/da-gui-tren-luoi): the sample links and their rules (E1), the
// grid it shows (E2), the region state a URL may ask for (E5), the model of a sent link and the SP-4 signal (E11).
import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

import type { GridRow } from "../src/components/candidate/data-region";
import type { ShareLink } from "../src/generated/ontology";
import { sampleUnits, subdivisionNameOf } from "../src/modules/catalog";
import { label } from "../src/modules/company-config";
import { SAMPLE_COMPANY, buildSampleListings } from "../src/modules/listings";
import { inventoryStateFrom } from "../src/modules/listings/ui";
import {
  SENT_FIELDS,
  SentGrid,
  buildSampleShareLinks,
  checkShareLinks,
  sentRows,
  sentStateFrom,
  type SampleShareLinks,
  type SentField,
} from "../src/modules/sharing/ui";
import { tallGridViewport } from "./virtual-viewport";

const REPO = join(__dirname, "..");

beforeAll(() => {
  tallGridViewport();
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
  Element.prototype.getAnimations ??= () => [];
  window.matchMedia ??= ((query: string) => ({
    matches: false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    onchange: null,
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
});
afterEach(cleanup);

const units = sampleUnits().map((u) => ({ ...u, subdivisionName: subdivisionNameOf(u) }));
const { listings } = buildSampleListings({ companyId: SAMPLE_COMPANY.id, units });
const listingIds = listings.map((l) => l.id);
const sample = buildSampleShareLinks({ companyId: SAMPLE_COMPANY.id, listingIds });

/** Every sample link checked against the source records: what AC-1 promises, link by link. */
function checkSample(data: SampleShareLinks): void {
  if (data.links.length !== 14) throw new Error(`link count: ${data.links.length}`);
  const ofCompany = new Set(listingIds);
  for (const link of data.links) {
    const carried = data.includes.get(link.id) ?? [];
    if (link.companyId !== SAMPLE_COMPANY.id) throw new Error(`company: ${link.id}`);
    if (!link.id.startsWith("4d415500-0010-")) throw new Error(`MAU id: ${link.id}`);
    if (!(link.recipientName ?? "").startsWith("[Tên]")) throw new Error(`name: ${link.id}`);
    if (link.listingCount !== carried.length) throw new Error(`listing count: ${link.id}`);
    if (carried.some((id) => !ofCompany.has(id))) throw new Error(`foreign listing: ${link.id}`);
    if (link.interestCount > link.listingCount) throw new Error(`interest: ${link.id}`);
    if ((link.openCount === 0) !== (link.lastOpenedAt === undefined))
      throw new Error(`opened time: ${link.id}`);
    if (link.lastOpenedAt && Date.parse(link.lastOpenedAt) < Date.parse(link.sentAt))
      throw new Error(`opened before sent: ${link.id}`);
  }
  const counts = data.links.map((l) => l.listingCount);
  if (!counts.includes(1) || !counts.includes(30)) throw new Error("one and thirty units");
  if (!data.links.some((l) => l.openCount > 0 && l.interestCount === 0))
    throw new Error("opened without interest");
  const firstFive = sentRows(data.links).slice(0, 5);
  if (!firstFive.some((r) => String(r["ShareLink.recipientName"]).length > 60))
    throw new Error("long name not in the first five rows");
}

/** A copy of the sample with one link changed; the rule that link now breaks must be the one reported. */
function broken(change: (link: ShareLink) => ShareLink, includes?: string[]): SampleShareLinks {
  const [first, ...rest] = sample.links as [ShareLink, ...ShareLink[]];
  const map = new Map(sample.includes);
  if (includes) map.set(first.id, includes);
  return { links: [change({ ...first }), ...rest], includes: map };
}

const FIRST = sample.links[0]?.id ?? "";
// Written ahead: one break per rule of ontology/entities/ShareLink.yaml and the sample, each with its message.
const BREAKS: [string, SampleShareLinks, string][] = [
  ["other company", broken((l) => ({ ...l, companyId: "khac" })), `link khác sàn: ${FIRST}`],
  [
    "no MAU label",
    broken((l) => ({ ...l, id: "00000000-0010-4000-8000-000000000001" })),
    "thiếu nhãn MAU: link 00000000-0010-4000-8000-000000000001",
  ],
  [
    "real name",
    broken((l) => ({ ...l, recipientName: "Khách thật" })),
    `tên người nhận không phải tên giả: ${FIRST}`,
  ],
  [
    "count off its listings",
    broken((l) => l, listingIds.slice(0, 9)),
    `số căn lệch số lần chào trong link: ${FIRST}`,
  ],
  [
    "interest over count",
    broken((l) => ({ ...l, interestCount: l.listingCount + 1 })),
    `quan tâm nhiều hơn số căn: ${FIRST}`,
  ],
  [
    "never opened with a time",
    broken((l) => ({ ...l, openCount: 0, lastOpenedAt: l.sentAt })),
    `chưa mở mà có lúc mở: ${FIRST}`,
  ],
  [
    "opened before sent",
    broken((l) => ({ ...l, openCount: 1, lastOpenedAt: "2026-01-01T00:00:00+07:00" })),
    `mở trước khi gửi: ${FIRST}`,
  ],
];

describe("sample sent links (E1)", () => {
  it("builds 14 links of the sample company that keep every rule", () => {
    expect(() => checkSample(sample)).not.toThrow();
    expect(checkShareLinks(sample, SAMPLE_COMPANY.id)).toEqual([]);
  });

  it("reports each broken rule with its own message", () => {
    expect(BREAKS.length).toBe(7);
    for (const [, data, message] of BREAKS) {
      expect(checkShareLinks(data, SAMPLE_COMPANY.id)).toContain(message);
    }
  });

  it("the sample check fails when the long name falls out of the first rows", () => {
    const pushed = {
      ...sample,
      links: sample.links.map((l) =>
        String(l.recipientName).length > 60 ? { ...l, sentAt: "2026-10-01T00:00:00+07:00" } : l,
      ),
    };
    expect(() => checkSample(pushed)).toThrow("long name not in the first five rows");
  });
});

// Written ahead: the six header words in column order (scope gate, Hỏi-2).
const APPROVED_HEADERS = ["Người nhận", "Lượt mở", "Quan tâm", "Mở gần nhất", "Gửi lúc", "Số căn"];
const HEADERS: Record<SentField, string> = {
  "ShareLink.recipientName": label("RecipientName"),
  "ShareLink.listingCount": label("ListingCount"),
  "ShareLink.sentAt": label("SentAt"),
  "ShareLink.openCount": label("OpenCount"),
  "ShareLink.interestCount": label("InterestCount"),
  "ShareLink.lastOpenedAt": label("LastOpenedAt"),
};

function renderGrid(rows: GridRow[], state: "ready" | "empty" = "ready") {
  return render(
    <SentGrid
      title={label("ShareLink")}
      headers={HEADERS}
      rows={rows}
      state={state}
      emptyWhy={`Bạn chưa gửi link nào cho khách. Chọn căn để gửi ở ${label("Inventory")}.`}
      emptyActionLabel={`Mở ${label("Inventory")}`}
      emptyActionHref="/inventory"
      unitsByLink={{}}
      unitsHeading="x"
    />,
  );
}

const NEVER_OPENED = "4d415500-0010-4000-8000-000000000001";

/** What the Sent grid shows: region name, headers in order, newest first, footer count, right-aligned counts. */
function checkGrid(container: HTMLElement, rows: GridRow[]): void {
  if (!container.textContent?.includes("Link đã gửi")) throw new Error("region name");
  const headers = [...container.querySelectorAll("thead th")].map((th) => th.textContent?.trim());
  if (headers[0] !== "#") throw new Error("row-number column missing");
  headers.slice(1).forEach((h, i) => {
    if (h !== APPROVED_HEADERS[i]) throw new Error(`sent column order: ${i + 1}`);
  });
  const sent = rows.map((r) => Date.parse(String(r["ShareLink.sentAt"])));
  if (sent.some((t, i) => i > 0 && t > (sent[i - 1] as number)))
    throw new Error("sent rows not newest first");
  if (container.querySelector('[data-slot="region-footer-count"]')?.textContent !== "14 dòng")
    throw new Error("footer count missing");
  const counts = [...container.querySelectorAll('[data-slot="typed-cell"][data-kind="count"]')];
  if (counts.length === 0 || counts.some((el) => el.getAttribute("data-align") !== "right"))
    throw new Error("count cells not right-aligned");
  const neverRow = rows.findIndex((r) => r.id === NEVER_OPENED);
  const tr = container.querySelectorAll("tbody tr:has([data-slot='row-number'])")[neverRow];
  const lastOpened = tr?.querySelectorAll("td")[1 + SENT_FIELDS.indexOf("ShareLink.lastOpenedAt")];
  if (lastOpened?.textContent?.trim() !== "—") throw new Error("never-opened link shows a time");
}

describe("sent grid (E2)", () => {
  const rows = sentRows(sample.links);

  it("shows the region, the six approved columns newest first, and counts in the footer", () => {
    expect(SENT_FIELDS.map((f) => HEADERS[f])).toEqual(APPROVED_HEADERS);
    const { container } = renderGrid(rows);
    expect(() => checkGrid(container, rows)).not.toThrow();
  });

  it("fails when rows keep their input order", () => {
    const reversed = [...rows].reverse();
    const { container } = renderGrid(reversed);
    expect(() => checkGrid(container, reversed)).toThrow("sent rows not newest first");
  });

  it("fails when two columns swap", () => {
    const { container } = renderGrid(rows);
    const ths = container.querySelectorAll("thead th");
    const second = ths[2]?.textContent ?? "";
    (ths[2] as HTMLElement).textContent = ths[3]?.textContent ?? "";
    (ths[3] as HTMLElement).textContent = second;
    expect(() => checkGrid(container, rows)).toThrow("sent column order: 2");
  });

  it("says why it is empty and offers the inventory, a page that exists", () => {
    const { container } = renderGrid(rows, "empty");
    expect(container.textContent).toContain("chưa gửi link");
    const link = [...container.querySelectorAll("a")].find((a) => a.textContent === "Mở Bảng hàng");
    expect(link?.getAttribute("href")).toBe("/inventory");
  });
});

type StateFrom = typeof sentStateFrom;
// Written ahead: 6 parameters × 2 environments = 12 cells.
const STATE_MATRIX: [string | undefined, string, string][] = [
  ["loading", "production", "ready"],
  ["empty", "production", "ready"],
  ["error", "production", "ready"],
  ["partial", "production", "ready"],
  ["forbidden", "production", "ready"],
  ["la", "production", "ready"],
  ["loading", "development", "loading"],
  ["empty", "development", "empty"],
  ["error", "development", "error"],
  ["partial", "development", "partial"],
  ["forbidden", "development", "forbidden"],
  ["la", "development", "ready"],
];

function checkStates(from: StateFrom): void {
  for (const [param, env, want] of STATE_MATRIX) {
    const got = from(param, env);
    if (got !== want)
      throw new Error(
        env === "production" ? `production honours state: ${param}` : `state ${param}: ${got}`,
      );
  }
}

/** The Sent reader and the Inventory reader agree on every cell: two copies of one rule must not drift. */
function checkAgree(sentFrom: StateFrom, inventoryFrom: typeof inventoryStateFrom): void {
  for (const [param, env] of STATE_MATRIX) {
    if (sentFrom(param, env) !== inventoryFrom(param, env))
      throw new Error(`state readers disagree: ${param}/${env}`);
  }
}

describe("region state from the URL (E5)", () => {
  it("honours ?state= only outside production", () => {
    expect(STATE_MATRIX.length).toBe(12);
    expect(() => checkStates(sentStateFrom)).not.toThrow();
  });

  it("fails when the reader ignores the environment", () => {
    const blind: StateFrom = (param) => sentStateFrom(param, "development");
    expect(() => checkStates(blind)).toThrow("production honours state: loading");
  });

  it("agrees with the Inventory reader on every cell", () => {
    expect(() => checkAgree(sentStateFrom, inventoryStateFrom)).not.toThrow();
  });

  it("fails when the two readers drift apart", () => {
    const drifted: StateFrom = (param, env) =>
      param === "partial" ? "ready" : sentStateFrom(param, env);
    expect(() => checkAgree(drifted, inventoryStateFrom)).toThrow(
      "state readers disagree: partial/development",
    );
  });
});

/** The SP-4 signal, read from the owner's rule file at run time — never copied into the test. */
function sp4Signal(): RegExp {
  const text = readFileSync(join(REPO, "PRODUCT-INVARIANTS.md"), "utf8");
  const section = text.slice(text.indexOf("## SP-4"));
  const match = /- Dấu hiệu: `([^`]+)`/.exec(section);
  if (!match?.[1]) throw new Error("SP-4 signal not found");
  return new RegExp(match[1]);
}

function filesUnder(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? filesUnder(path) : [path];
  });
}

function checkSp4(files: Record<string, string>): void {
  const signal = sp4Signal();
  for (const [file, text] of Object.entries(files))
    if (signal.test(text)) throw new Error(`SP-4 signal in sharing ui: ${file}`);
}

describe("SP-4 signal", () => {
  const dir = join(REPO, "src/modules/sharing/ui");
  const files = Object.fromEntries(filesUnder(dir).map((f) => [f, readFileSync(f, "utf8")]));

  it("no file of the sharing ui touches the signal of SP-4", () => {
    expect(Object.keys(files).length).toBeGreaterThan(0);
    expect(() => checkSp4(files)).not.toThrow();
  });

  it("fails on an import of the contacts module", () => {
    expect(() => checkSp4({ "x.tsx": 'import x from "@/modules/contacts"' })).toThrow(
      "SP-4 signal in sharing ui: x.tsx",
    );
  });
});

type Props = Record<string, Record<string, unknown>>;

/** The ShareLink entity read by the repo's own YAML reader (the one the type generator uses). */
function readProps(text: string): Props {
  const out = execFileSync(
    "python3",
    [
      "-c",
      "import json,sys; sys.path.insert(0,'tools'); from repo_ontology import parse_yaml; " +
        "print(json.dumps(parse_yaml(sys.stdin.read())['properties']))",
    ],
    { cwd: REPO, input: text, encoding: "utf8" },
  );
  return JSON.parse(out) as Props;
}

function checkModel(props: Props): void {
  if (props.recipientName?.pii !== true) throw new Error("recipientName not marked personal");
  if (props.companyId?.required !== true || props.companyId?.target !== "Company")
    throw new Error("companyId not required");
}

describe("ShareLink model", () => {
  const text = readFileSync(join(REPO, "ontology/entities/ShareLink.yaml"), "utf8");

  it("marks the recipient as personal data and requires the company", () => {
    expect(() => checkModel(readProps(text))).not.toThrow();
  });

  it("fails when either flag is dropped", () => {
    expect(() => checkModel(readProps(text.replace("pii: true, ", "")))).toThrow(
      "recipientName not marked personal",
    );
    expect(() =>
      checkModel(readProps(text.replace("target: Company, required: true", "target: Company"))),
    ).toThrow("companyId not required");
  });
});
