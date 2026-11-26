// @vitest-environment jsdom
// The company layer screen's address and its parts (english-route-names, AC-1, AC-2 and AC-3): `?part=` names a part by
// the API's own name, anything else opens the first part, the old `?phan=` is not read; the second column links the six
// parts in their order; a session the permission table denies readCompanyLayer sees the shared «not allowed» block.
import { cleanup, render } from "@testing-library/react";
import { createElement } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { NAV } from "@/app/(app)/nav";
import { label } from "@/modules/company-config";
import { layerPartFrom, layerPartHref, PART_TITLE } from "@/modules/company-config/ui";
import { FRAME_COPY } from "@/components/templates/frame-copy";

describe("doc-phan", () => {
  // Written before the code: the query a request carries → the part the screen opens.
  const CASES: [string, Record<string, string | string[] | undefined>, string][] = [
    ["labels", { part: "labels" }, "labels"],
    ["fields", { part: "fields" }, "fields"],
    ["aliases", { part: "aliases" }, "aliases"],
    ["pending-units", { part: "pending-units" }, "pending-units"],
    ["templates", { part: "templates" }, "templates"],
    ["fee-schedule", { part: "fee-schedule" }, "fee-schedule"],
    ["absent", {}, "labels"],
    ["unknown", { part: "xyz" }, "labels"],
    ["?phan=can-cho", { phan: "can-cho" }, "labels"],
  ];
  it.each(CASES)("doc-phan: %s", (name, query, part) => {
    expect(layerPartFrom(query), `doc-phan: ${name}`).toBe(part);
  });
  it("doc-phan: nine cases", () => expect(CASES).toHaveLength(9));
  it("doc-phan: a repeated ?part= keeps its first value", () => {
    expect(layerPartFrom({ part: ["templates", "fields"] })).toBe("templates");
  });
});

describe("cot-hai", () => {
  const entry = NAV.find((i) => i.href === "/company-layer");
  const items = entry?.sections?.[0]?.items ?? [];
  const WRITTEN = [
    ["/company-layer", "labels"],
    ["/company-layer?part=fields", "fields"],
    ["/company-layer?part=aliases", "aliases"],
    ["/company-layer?part=pending-units", "pending-units"],
    ["/company-layer?part=templates", "templates"],
    ["/company-layer?part=fee-schedule", "fee-schedule"],
  ] as const;

  it("cot-hai: the sidebar entry is /company-layer, gated by readCompanyLayer", () => {
    expect(entry?.action).toBe("readCompanyLayer");
  });
  it("cot-hai: six items, in order, each at its address and titled by the label table", () => {
    expect(items).toHaveLength(6);
    expect(items.map((i) => i.href)).toEqual(WRITTEN.map(([href]) => href));
    expect(items.map((i) => i.title)).toEqual(WRITTEN.map(([, part]) => label(PART_TITLE[part])));
  });
  it("cot-hai: the address helper agrees with the written list", () => {
    for (const [href, part] of WRITTEN) expect(layerPartHref(part)).toBe(href);
  });
});

describe("vai-khong-quyen", () => {
  // Every role of ontology/actions.yaml holds readCompanyLayer and a member keeps at least one role, so no real session
  // reaches this branch in the browser (decisions.jsonl d-…-26); the page is rendered here as the server renders it,
  // with the permission door answering «no scope» — and, as control, answering a scope.
  afterEach(() => {
    cleanup();
    vi.doUnmock("@/modules/identity");
    vi.resetModules();
  });

  async function draw(allowed: boolean) {
    vi.resetModules();
    vi.doMock("server-only", () => ({}));
    vi.doMock("next/navigation", () => ({
      redirect: () => {
        throw new Error("redirect");
      },
    }));
    vi.doMock("@/modules/identity/server", () => ({
      currentSession: async () => ({
        userId: "u",
        name: "[Tên]",
        email: "nguoi@example.test",
        company: { id: "c", name: "[MAU]" },
        companies: [{ id: "c", name: "[MAU]" }],
        roles: ["ListAgent"],
      }),
    }));
    vi.doMock("@/modules/identity", async (actual) => ({
      ...(await actual<typeof import("@/modules/identity")>()),
      allowedScope: () => (allowed ? "company" : null),
    }));
    vi.doMock("@/modules/company-config/server", () => ({ LABELABLE_CONCEPTS: [] }));
    vi.doMock("@/modules/company-config/ui", async (actual) => ({
      ...(await actual<typeof import("@/modules/company-config/ui")>()),
      CompanyLayerScreen: ({ part }: { part: string }) =>
        createElement("div", { "data-layer-part": part }),
      FeePart: () => createElement("div", { "data-layer-part": "fee-schedule" }),
    }));
    const { default: Page } = await import("@/app/(app)/company-layer/page");
    return render(await Page({ searchParams: Promise.resolve({}) })).container;
  }

  it("vai-khong-quyen: no readCompanyLayer → the shared «not allowed» block, no part", async () => {
    const c = await draw(false);
    expect(
      c.querySelector('[data-slot="page-state"]')?.getAttribute("data-kind"),
      "vai-khong-quyen: khoi",
    ).toBe("forbidden");
    expect(c.querySelector("h1")?.textContent, "vai-khong-quyen: tieu de").toBe(
      FRAME_COPY.forbidden.title,
    );
    expect(c.querySelector("[data-layer-part]"), "vai-khong-quyen: van ve phan").toBeNull();
  });
  it("vai-khong-quyen: control — with readCompanyLayer the page draws the labels part", async () => {
    const c = await draw(true);
    expect(c.querySelector('[data-slot="page-state"]')).toBeNull();
    expect(c.querySelector("[data-layer-part]")?.getAttribute("data-layer-part")).toBe("labels");
  });
});
