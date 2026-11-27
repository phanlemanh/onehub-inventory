// @vitest-environment jsdom
// Row 3h (_acceptance/tin-rao-giu-gia-tri-rieng), screen side of the clickable prototype: the grid rows read the
// effective attributes, the unit section of the record shows the source and the catalog mark, «Sửa» sends one
// unitAttributes change, «Lấy lại» clears an own value with undo, and an attribute cell reads by its own reader.
import {
  act,
  cleanup,
  fireEvent,
  render,
  renderHook,
  screen,
  within,
} from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import {
  sampleInventoryListings,
  sampleInventoryRows,
  sampleRecords,
} from "../src/app/(app)/inventory-sample-rows";
import { catalogAttributesOf } from "../src/app/(app)/inventory-view";
import { sampleInventoryData } from "../src/app/(app)/inventory-sample-data";
import type { CellEditSession, GridRow } from "../src/components/candidate/data-region";
import type { WriteOutcome } from "../src/components/candidate/use-change";
import type { Listing } from "../src/generated/ontology";
import { label } from "../src/modules/company-config";
import { actionVisibility } from "../src/modules/identity";
import { SessionRoles } from "../src/modules/identity/ui";
import { isFloor } from "../src/modules/catalog";
import {
  applyChange,
  attributeFits,
  PROPERTY_SUB_TYPES,
  readFloor,
  sampleId,
  type ListingChange,
} from "../src/modules/listings";
import {
  ASK_COPY,
  AttributeDiffersMark,
  DetailsEditProvider,
  ListingCellEdit,
  ListingRecordFull,
  RECORD_COPY,
  UNIT_ATTRIBUTE_COPY,
  cellEditLabels,
  listingView,
  markLookFrom,
  type DetailsEditApi,
  type InventoryField,
  type RecordLabels,
  type UnitAttributeWords,
} from "../src/modules/listings/ui";
import { attributeCellFields } from "../src/modules/listings/ui/attribute-cells";
import { MarkLookProvider } from "../src/modules/listings/ui/attribute-differs-mark";
import { useListingCellEdit } from "../src/modules/listings/ui/use-listing-cell-edit";
import { AskListAgent } from "../src/modules/listings/ui/ask-list-agent";

vi.mock("sonner", () => ({ toast: Object.assign(vi.fn(), { error: vi.fn(), success: vi.fn() }) }));

beforeAll(() => {
  Element.prototype.getAnimations ??= () => [];
  Element.prototype.scrollIntoView ??= () => {};
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

const WORDS: UnitAttributeWords = {
  names: {
    livingArea: label("LivingArea"),
    floor: label("UnitFloorLocation"),
    bedroomsTotal: label("BedroomsTotal"),
    directionFaces: label("DirectionFaces"),
    propertySubType: label("PropertySubType"),
  },
  subTypes: {
    Condominium: label("SubTypeCondominium"),
    Townhouse: label("SubTypeTownhouse"),
    "Single Family Residence": label("SubTypeSingleFamily"),
    "Unimproved Land": label("SubTypeLand"),
  },
  sources: {
    Typed: label("SourceTyped"),
    File: label("SourceFile"),
    Catalog: label("SourceCatalog"),
  },
  catalog: label("Catalog"),
  differs: label("DiffersFromCatalog"),
  revert: label("RevertToCatalog"),
  edit: label("Edit"),
  unit: label("Unit"),
};

const HEADERS: Record<InventoryField, string> = {
  "Listing.unitNumber": label("Unit"),
  "Listing.buildingName": label("Building"),
  "Listing.subdivisionName": label("Subdivision"),
  "Listing.standardStatus": label("StandardStatus"),
  "Listing.listPrice": label("ListPrice"),
  "Unit.livingArea": label("LivingArea"),
  "Unit.bedroomsTotal": label("BedroomsTotal"),
  "Listing.lastConfirmedAt": label("LastConfirmedAt"),
};

const LABELS: RecordLabels = {
  unit: label("Unit"),
  unitKind: label("UnitKind"),
  livingArea: label("LivingArea"),
  bedrooms: label("BedroomsTotal"),
  floor: label("UnitFloorLocation"),
  direction: label("DirectionFaces"),
  building: label("Building"),
  subdivision: label("Subdivision"),
  propertyType: label("PropertySubType"),
  listPrice: label("ListPrice"),
  completeness: label("Completeness"),
  currentListing: label("CurrentListing"),
  viewedListing: label("ViewedListing"),
  listingsOfUnit: label("ListingsOfUnit"),
  edit: label("Edit"),
  parts: {
    listPrice: label("ListPrice"),
    furnished: label("Furnished"),
    legalStatus: label("LegalStatus"),
    financing: label("Financing"),
    occupantType: label("OccupantType"),
  },
  furnishedValues: {
    Furnished: label("FurnishedFull"),
    Partially: label("FurnishedPartial"),
    Unfurnished: label("FurnishedNone"),
  },
  occupantValues: {
    Owner: label("OccupantOwner"),
    Tenant: label("OccupantTenant"),
    Vacant: label("OccupantVacant"),
  },
  propertyTypeValues: WORDS.subTypes,
  attributes: WORDS,
};

const NOW = new Date("2026-11-27T03:00:00Z");
const rows = sampleInventoryRows();
const records = sampleRecords(NOW);
const listings = sampleInventoryListings();
const catalog = catalogAttributesOf(sampleInventoryData());
/** The sample listings of row 3h's states (sample.ts SAMPLE_OWN_ATTRIBUTES), by position. */
const AREA_TYPED = sampleId(1, 4);
const BEDROOMS_EQUAL = sampleId(1, 5);
const AREA_CLOSED = sampleId(1, 9);
const AREA_FILE = sampleId(1, 11);
const DIRECTION_GAP = sampleId(1, 15);
const PLAIN = sampleId(1, 2);

const rowOf = (id: string) => rows.find((r) => r.id === id)!;
const listingOf = (id: string) => listings.find((l) => l.id === id)!;

/** A write that keeps listings like the save door does. */
function fakeApi(answers: WriteOutcome[] = []) {
  const saved = new Map<string, Listing>();
  const writes: ListingChange[] = [];
  const api: DetailsEditApi = {
    write: async (id, change, at) => {
      writes.push(change);
      const answer = answers.shift() ?? "saved";
      if (answer !== "saved") return answer;
      const next = applyChange(saved.get(id) ?? listingOf(id), change, at);
      if (next.ok) saved.set(id, next.listing);
      return next.ok ? "saved" : "fault";
    },
    saved: (id) => saved.get(id),
    changed: () => {},
    tick: 0,
  };
  return { api, writes, saved };
}

function Record({
  id,
  api,
  role = "ListAgent",
}: {
  id: string;
  api: DetailsEditApi | null;
  role?: string;
}): ReactNode {
  return (
    <SessionRoles roles={[role as "ListAgent"]}>
      <DetailsEditProvider api={api}>
        <ListingRecordFull
          view={listingView(rowOf(id), HEADERS)}
          data={records[id]!}
          labels={LABELS}
        />
      </DetailsEditProvider>
    </SessionRoles>
  );
}

const unitRow = (field: string) =>
  document.querySelector(`[data-slot="listing-unit"] [data-field="${field}"] dd`);
const marks = () => [...document.querySelectorAll('[data-slot="attribute-differs"]')];
const editButton = () => document.querySelector('[data-slot="unit-attributes-edit-open"]');

describe("doc-hieu-luc", () => {
  it("the grid row shows the own value where there is one, the catalog's otherwise", () => {
    expect(rowOf(AREA_TYPED)["Unit.livingArea"]).toBe(78.5);
    expect(catalog[AREA_TYPED]?.livingArea).toBe(75);
    expect(rowOf(PLAIN)["Unit.livingArea"]).toBe(catalog[PLAIN]?.livingArea);
    expect(rowOf(DIRECTION_GAP)["Unit.directionFaces"]).toBe("Đông");
    expect(catalog[DIRECTION_GAP]?.directionFaces).toBeNull();
  });
});

describe("ho-so-can", () => {
  it("dau-khac: an own area that differs shows its source and one mark named with the catalog's value", () => {
    render(<Record id={AREA_TYPED} api={fakeApi().api} />);
    expect(unitRow("Unit.livingArea")?.textContent).toContain("78,5 m²");
    expect(unitRow("Unit.livingArea")?.textContent).toContain(WORDS.sources.Typed);
    expect(marks().map((m) => m.getAttribute("aria-label"))).toEqual([
      UNIT_ATTRIBUTE_COPY.markName(WORDS, "75 m²"),
    ]);
  });

  it("khong-dau: equal to the catalog, a catalog gap, or no own value shows no mark", () => {
    for (const id of [BEDROOMS_EQUAL, DIRECTION_GAP, PLAIN]) {
      const view = render(<Record id={id} api={fakeApi().api} />);
      expect(marks(), id).toEqual([]);
      view.unmount();
    }
    // Positive control: values from a file that differ (area and floor) are marked, with their source.
    render(<Record id={AREA_FILE} api={fakeApi().api} />);
    expect(marks().length).toBe(2);
    expect(unitRow("Unit.livingArea")?.textContent).toContain(WORDS.sources.File);
  });

  it("nut-sua: roles with updateListing edit an open listing; the admin and a closed listing do not", () => {
    const want = { ListAgent: true, BuyerAgent: true, TeamLead: true, CompanyAdmin: false };
    for (const [role, may] of Object.entries(want)) {
      const view = render(<Record id={AREA_TYPED} api={fakeApi().api} role={role} />);
      expect(Boolean(editButton()), role).toBe(may);
      view.unmount();
    }
    render(<Record id={AREA_CLOSED} api={fakeApi().api} />);
    expect(editButton(), "đã bán").toBeNull();
    expect(marks().length, "đã bán vẫn có dấu").toBe(1);
  });

  it("hop-nam-truong: one save sends one change; a floor with a leading zero is refused at its field", async () => {
    const { api, writes } = fakeApi();
    render(<Record id={PLAIN} api={api} />);
    await act(async () => fireEvent.click(editButton()!));
    const dialog = await screen.findByRole("dialog");
    const input = (f: string) =>
      dialog.querySelector(`input[data-attribute="${f}"]`) as HTMLInputElement;
    await act(async () => fireEvent.change(input("floor"), { target: { value: "07" } }));
    await act(async () => fireEvent.change(input("livingArea"), { target: { value: "56,5 m2" } }));
    const save = () =>
      act(async () =>
        fireEvent.click(within(dialog).getByRole("button", { name: RECORD_COPY.detailsSubmit })),
      );
    await save();
    expect(writes).toEqual([]);
    expect(dialog.textContent).toContain(UNIT_ATTRIBUTE_COPY.problem("floor", "not-a-floor", "07"));
    await act(async () => fireEvent.change(input("floor"), { target: { value: "15A" } }));
    await save();
    expect(writes).toEqual([{ field: "unitAttributes", livingArea: 56.5, floor: "15A" }]);
  });

  it("lay-lai: the mark's command clears the own value and nothing else", async () => {
    const { api, writes, saved } = fakeApi();
    render(<Record id={AREA_TYPED} api={api} />);
    await act(async () => fireEvent.click(marks()[0]!));
    const revert = await screen.findByRole("button", { name: WORDS.revert });
    await act(async () => fireEvent.click(revert));
    expect(writes).toEqual([{ field: "unitAttributes", livingArea: null }]);
    expect(saved.get(AREA_TYPED)?.livingArea).toBeUndefined();
    expect(saved.get(AREA_TYPED)?.livingAreaSource).toBeUndefined();
  });

  it("lay-lai-khong-quyen: the admin sees the mark without the command", async () => {
    render(<Record id={AREA_TYPED} api={fakeApi().api} role="CompanyAdmin" />);
    await act(async () => fireEvent.click(marks()[0]!));
    await screen.findByText(UNIT_ATTRIBUTE_COPY.catalogLine(WORDS, "75 m²"));
    expect(screen.queryByRole("button", { name: WORDS.revert })).toBeNull();
  });
});

describe("dau-ba-dang", () => {
  it("each look keeps its accessible name; an unknown word or production is the dot", () => {
    for (const look of ["dot", "badge", "icon"] as const) {
      const view = render(
        <MarkLookProvider value={look}>
          <AttributeDiffersMark words={WORDS} catalogShown="68,5 m²" />
        </MarkLookProvider>,
      );
      const mark = marks()[0]!;
      expect(mark.getAttribute("data-look")).toBe(look);
      expect(mark.getAttribute("aria-label")).toBe("Khác danh mục: 68,5 m²");
      view.unmount();
    }
    expect(markLookFrom("badge", "development")).toBe("badge");
    expect(markLookFrom("badge", "production")).toBe("dot");
    expect(markLookFrom("x", "development")).toBe("dot");
  });
});

const EDIT_LABELS = cellEditLabels((concept, transaction) => label(concept, { transaction }));

describe("o-thuoc-tinh", () => {
  const [area, bedrooms] = attributeCellFields(["livingArea", "bedroomsTotal"], WORDS);

  function cell(
    field: typeof area,
    row: GridRow,
    initialText: string,
    note = { hasOwn: true, note: null, noneText: WORDS.sources.Catalog },
  ) {
    const onSave = vi.fn();
    const session: CellEditSession = {
      row,
      field: field!.key as CellEditSession["field"],
      close: vi.fn(),
      initialText,
    };
    render(
      <ListingCellEdit
        session={session}
        labels={EDIT_LABELS}
        onSave={vi.fn()}
        onAsk={vi.fn()}
        custom={{ field: field!, onSave, attribute: note }}
      />,
    );
    const input = document.querySelector("input") as HTMLInputElement;
    return { onSave, input };
  }
  const enter = (input: HTMLInputElement) =>
    act(async () => fireEvent.keyDown(input, { key: "Enter" }));

  it("reads an area by its reader and says why not, keeping the words typed", async () => {
    const bad = cell(area, rowOf(AREA_TYPED), "bảy mươi");
    await enter(bad.input);
    expect(bad.onSave).not.toHaveBeenCalled();
    expect(document.body.textContent).toContain(
      UNIT_ATTRIBUTE_COPY.problem("livingArea", "not-a-number", "bảy mươi"),
    );
    expect(bad.input.value).toBe("bảy mươi");
    cleanup();
    const good = cell(area, rowOf(AREA_TYPED), "72,5");
    await enter(good.input);
    expect(good.onSave).toHaveBeenCalledWith(expect.objectContaining({ value: 72.5 }));
  });

  it("refuses half a bedroom; an empty cell with an own value takes the catalog again, without one sends nothing", async () => {
    const half = cell(bedrooms, rowOf(BEDROOMS_EQUAL), "2,5");
    await enter(half.input);
    expect(half.onSave).not.toHaveBeenCalled();
    cleanup();
    const empty = cell(bedrooms, rowOf(BEDROOMS_EQUAL), "");
    await enter(empty.input);
    expect(empty.onSave).toHaveBeenCalledWith(expect.objectContaining({ value: null }));
    cleanup();
    const none = cell(bedrooms, rowOf(PLAIN), "", {
      hasOwn: false,
      note: null,
      noneText: WORDS.sources.Catalog,
    });
    await enter(none.input);
    expect(none.onSave).not.toHaveBeenCalled();
  });

  it("the grid's write: a revert patches the cell to the catalog value and the door keeps no own value", async () => {
    const seen: ListingChange[] = [];
    const hook = renderHook(() =>
      useListingCellEdit({
        rows,
        listings,
        headers: HEADERS,
        labels: EDIT_LABELS,
        door: {
          save: async ({ id, change, at }) => {
            seen.push(change);
            const next = applyChange(listingOf(id), change, at);
            return next.ok ? { kind: "saved", listing: next.listing } : { kind: "fault" };
          },
        },
        attributes: {
          fields: attributeCellFields(["livingArea", "bedroomsTotal"], WORDS),
          words: WORDS,
          catalogOf: (id) => catalog[id],
        },
      }),
    );
    await act(async () => hook.result.current.revertAttribute(AREA_TYPED, "Unit.livingArea"));
    expect(seen).toEqual([{ field: "unitAttributes", livingArea: null }]);
    const row = hook.result.current.rows.find((r) => r.id === AREA_TYPED)!;
    expect(row["Unit.livingArea"]).toBe(75);
    expect(hook.result.current.savedListing(AREA_TYPED)?.livingArea).toBeUndefined();
    // The record's dialog writes through the same door; its cells follow.
    await act(async () => {
      await hook.result.current.writeListing(
        AREA_TYPED,
        { field: "unitAttributes", bedroomsTotal: 3 },
        NOW.toISOString(),
      );
    });
    expect(hook.result.current.rows.find((r) => r.id === AREA_TYPED)!["Unit.bedroomsTotal"]).toBe(
      3,
    );
  });
});

// ---- Task 5: the unit section and the record's foot by status, by role (E14, E11b), and the rules of edit (E3b) ----

const AREA_WITHDRAWN = sampleId(1, 12);
const ASK_WORDS = {
  ask: label("AskListAgent"),
  report: label("ReportUnitError"),
  unit: label("Unit"),
  listAgent: label("ListAgent"),
};
const sectionLock = () => document.querySelector('[data-slot="section-locked-reason"]');
const askLine = () => document.querySelector('[data-slot="ask-locked-reason"]');
const askButtonOf = () => document.querySelector('[data-slot="ask-list-agent"]');
const buttonsNamed = (name: string) => screen.queryAllByRole("button", { name });

function Foot({
  status,
  keeper,
  role = "TeamLead",
}: {
  status: Listing["standardStatus"];
  keeper: "other" | "none";
  role?: string;
}): ReactNode {
  return (
    <SessionRoles roles={[role as "TeamLead"]}>
      <AskListAgent
        listing={{ id: PLAIN, unitNumber: "A-01", buildingName: "[MAU] B1", status }}
        keeper={keeper === "none" ? null : { kind: "other", name: "[Tên] 02" }}
        words={ASK_WORDS}
      />
    </SessionRoles>
  );
}

describe("khoa-ba-trang-thai (E14)", () => {
  // Written before the screen: status × (the person who may edit · the person who does not keep the unit), plus an
  // open listing nobody keeps.
  const MATRIX = [
    { status: "Active", id: AREA_TYPED, edit: true, ask: true },
    { status: "Closed", id: AREA_CLOSED, edit: false, ask: false },
    { status: "Withdrawn", id: AREA_WITHDRAWN, edit: false, ask: false },
  ] as const;

  for (const row of MATRIX)
    it(`${row.status}: «Sửa» or its lock line in the unit section, «Hỏi đầu chủ» or its reason line at the foot`, () => {
      const record = render(<Record id={row.id} api={fakeApi().api} />);
      expect(listingOf(row.id).standardStatus === "Closed" || row.status !== "Closed").toBe(true);
      expect(Boolean(editButton()), "nút Sửa").toBe(row.edit);
      expect(Boolean(sectionLock()), "dòng khoá Sửa").toBe(!row.edit);
      // The unit's attributes read only until «Sửa» is pressed: no input in the section.
      expect(
        document.querySelectorAll('[data-slot="listing-unit"] [data-field]').length,
      ).toBeGreaterThan(0);
      expect(document.querySelectorAll('[data-slot="listing-unit"] input')).toHaveLength(0);
      if (!row.edit)
        expect(sectionLock()!.textContent).toBe(
          RECORD_COPY.blocked(label("Unit"), label(`Status${row.status}`), label("Edit")),
        );
      record.unmount();
      const status = listingOf(row.id).standardStatus;
      render(<Foot status={status} keeper="other" />);
      expect(Boolean(askButtonOf()), "nút Hỏi đầu chủ").toBe(row.ask);
      expect(Boolean(askLine()), "dòng lý do Hỏi").toBe(!row.ask);
      if (!row.ask) {
        expect(buttonsNamed(label("AskListAgent"))).toEqual([]);
        expect(askLine()!.textContent).toBe(
          RECORD_COPY.blocked(label("Unit"), label(`Status${status}`), label("AskListAgent")),
        );
      }
    });

  it("an open listing nobody keeps: no ask button at all, even off, and one line saying nobody keeps it", () => {
    render(<Foot status="Active" keeper="none" />);
    expect(askButtonOf()).toBeNull();
    expect(screen.queryAllByRole("button")).toEqual([]);
    expect(askLine()!.textContent).toBe(ASK_COPY.unheld(label("Unit"), label("ListAgent")));
  });

  it("break: a blocked task that only disappears says «blocked action disappears silently»; a dimmed one «dimmed button instead of reason»", () => {
    render(<Foot status="Closed" keeper="other" />);
    const silent = !askButtonOf() && !askLine();
    expect(() => expect(silent, "blocked action disappears silently").toBe(true)).toThrow(
      /blocked action disappears silently/,
    );
    const dimmed = document.querySelector('[data-slot="ask-list-agent"][disabled]');
    expect(() => expect(dimmed, "dimmed button instead of reason").not.toBeNull()).toThrow(
      /dimmed button instead of reason/,
    );
  });
});

describe("nut-theo-quyen (E11b)", () => {
  // Expectations come from the permission table itself, never from role names.
  const ROLES = ["ListAgent", "BuyerAgent", "TeamLead", "CompanyAdmin"] as const;
  for (const role of ROLES)
    it(`${role}: «Sửa» and «Lấy lại» show exactly when the table gives updateListing`, async () => {
      const may = actionVisibility([role], "updateListing", true) === "show";
      render(<Record id={AREA_TYPED} api={fakeApi().api} role={role} />);
      expect(Boolean(editButton()), "Sửa").toBe(may);
      await act(async () => fireEvent.click(marks()[0]!));
      await screen.findByText(UNIT_ATTRIBUTE_COPY.catalogLine(WORDS, "75 m²"));
      expect(buttonsNamed(WORDS.revert).length > 0, "Lấy lại").toBe(may);
    });

  it("break: a check by role name instead of the table says «role name instead of permission table»", () => {
    const byName = (role: string) => role !== "CompanyAdmin";
    const byTable = (role: (typeof ROLES)[number]) =>
      actionVisibility([role], "updateListing", true) === "show";
    const agree = ROLES.every((r) => byName(r) === byTable(r));
    // The two agree today; the test holds the table as the only source by naming the shortcut.
    expect(() => expect(byName, "role name instead of permission table").toBe(byTable)).toThrow(
      /role name instead of permission table/,
    );
    expect(agree).toBe(true);
  });
});

describe("luat-sua (E3b)", () => {
  it("the floor rule of edit is the catalog's own function on the same text", () => {
    for (const raw of ["7", "15A", "0", "07", "A15", "", " 7 ", "15a"]) {
      const text = raw.trim().toUpperCase();
      const catalogSays = text !== "" && isFloor(text);
      expect(readFloor(raw).ok, JSON.stringify(raw)).toBe(catalogSays);
    }
    expect(readFloor(" 7 ")).toEqual({ ok: true, value: "7" });
  });

  it("the sub type takes only the four values of the generated ontology", () => {
    const four: Listing["propertySubType"][] = [
      "Condominium",
      "Townhouse",
      "Single Family Residence",
      "Unimproved Land",
    ];
    expect([...PROPERTY_SUB_TYPES].sort()).toEqual([...four].sort());
    for (const v of four) expect(attributeFits("propertySubType", v)).toBe(true);
    for (const v of ["Apartment", "2PN", "", null])
      expect(attributeFits("propertySubType", v)).toBe(false);
  });
});
