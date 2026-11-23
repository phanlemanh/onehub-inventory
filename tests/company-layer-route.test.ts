// The company layer screen's address and its parts (english-route-names, AC-2 and AC-3): `?part=` names a part by the
// API's own name, anything else opens the first part, the old `?phan=` is not read; the second column links the six
// parts in their order.
import { describe, expect, it } from "vitest";

import { NAV } from "@/app/(app)/nav";
import { label } from "@/modules/company-config";
import { layerPartFrom, layerPartHref, PART_TITLE } from "@/modules/company-config/ui";

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
