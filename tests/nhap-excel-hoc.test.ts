// Row 11 (nhap-excel): what one import teaches goes through row 7e's own writes, in the order fields → labels →
// spellings → pending units → template; an item the company already has is not counted as learned; undo retires
// exactly what was learned.
import { describe, expect, it, vi } from "vitest";

const calls: string[] = [];
vi.mock("@/modules/company-config/store", () => ({
  addField: vi.fn(
    async (_r: unknown, f: { name: string }) => (
      calls.push(`field:${f.name}`),
      f.name === "Có rồi" ? { ok: false, problem: "name-taken" } : { ok: true, id: "view" }
    ),
  ),
  addLabel: vi.fn(async () => (calls.push("label"), { ok: true, id: "l1" })),
  addAlias: vi.fn(async () => (calls.push("alias"), { ok: true, id: "a1" })),
  addPendingUnit: vi.fn(
    async (_r: unknown, p: { rawCode: string }) => (
      calls.push(`pending:${p.rawCode}`),
      { ok: true, id: "p1" }
    ),
  ),
  saveTemplate: vi.fn(async () => (calls.push("template"), { ok: true, id: "t1" })),
  retireItem: vi.fn(
    async (_r: unknown, part: string, id: string) => (
      calls.push(`retire:${part}:${id}`),
      { ok: true, id }
    ),
  ),
}));

import { learnFromImport, retireLearned } from "@/modules/company-config/import-learn";

describe("hoc-tu-lan-nhap", () => {
  it("writes in order and keeps only what is new", async () => {
    calls.length = 0;
    const seen: string[] = [];
    const ids = await learnFromImport(
      (fn) => fn({} as never),
      {
        template: {
          name: "a.xlsx",
          headers: ["Mã căn"],
          columns: [{ standard: "Unit.unitNumber" }],
        },
        labels: [{ concept: "Building", label: "Block" }],
        fields: [
          { name: "View", kind: "single_select", options: ["Biển"] },
          { name: "Có rồi", kind: "text", options: [] },
        ],
        aliases: [{ field: "Listing.standardStatus", raw: "còn", value: "Active" }],
        pendingUnits: [{ rawCode: "SA5-12.08", buildingText: "Sapphire 5" }],
      },
      [],
      (_d, code) => seen.push(code),
    );
    expect(calls).toEqual([
      "field:View",
      "field:Có rồi",
      "label",
      "alias",
      "pending:SA5-12.08",
      "template",
    ]);
    expect(ids).toEqual({
      templateId: "t1",
      labelIds: ["l1"],
      fieldCodes: ["view"],
      aliasIds: ["a1"],
      pendingUnits: [{ rawCode: "SA5-12.08", id: "p1" }],
    });
    expect(seen).toEqual(["view"]);
    calls.length = 0;
    await retireLearned((fn) => fn({} as never), ids);
    expect(calls).toEqual([
      "retire:templates:t1",
      "retire:aliases:a1",
      "retire:labels:l1",
      "retire:fields:view",
    ]);
  });
});
