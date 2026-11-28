// @vitest-environment jsdom
// Row 3g (_acceptance/sua-thong-tin-can), screen side: «Sửa» of the record's listing section under the permission table,
// the dialog of the four details through a write that answers like the save door, the cell editors of the company's own
// fields by kind, and a paste onto own columns. Case names are the record's pinned messages (evals.yaml).
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { sampleInventoryRows, sampleRecords } from "../src/app/(app)/inventory-sample-rows";
import type {
  CellEditSession,
  GridRow,
  RegionPaste,
} from "../src/components/candidate/data-region";
import type { WriteOutcome } from "../src/components/candidate/use-change";
import { FRAME_COPY } from "../src/components/templates/frame-copy";
import type { Listing } from "../src/generated/ontology";
import { label } from "../src/modules/company-config";
import { SessionRoles } from "../src/modules/identity/ui";
import {
  applyChange,
  completeness,
  detailUndoable,
  type ListingChange,
} from "../src/modules/listings";
import {
  DetailsEditProvider,
  ListingCellEdit,
  ListingRecordFull,
  RECORD_COPY,
  cellEditLabels,
  detailCellFields,
  detailCells,
  detailChange,
  listingView,
  type CustomCellField,
  type DetailsEditApi,
  type InventoryField,
  type ListingRecordData,
  type RecordLabels,
} from "../src/modules/listings/ui";
import { planPaste } from "../src/modules/listings/ui/listing-paste";

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
  propertyTypeValues: {
    Condominium: label("SubTypeCondominium"),
    Townhouse: label("SubTypeTownhouse"),
    "Single Family Residence": label("SubTypeSingleFamily"),
    "Unimproved Land": label("SubTypeLand"),
  },
};

const NOW = new Date("2026-11-17T03:00:00Z");
const rows = sampleInventoryRows();
const records = sampleRecords(NOW);

/** A write that keeps listings like the save door does, answering `answers` in turn (then «saved»). */
function fakeApi(start: Record<string, Partial<Listing>>, answers: WriteOutcome[] = []) {
  const saved = new Map<string, Listing>();
  const writes: ListingChange[] = [];
  let tick = 0;
  const api: DetailsEditApi = {
    write: async (id, change, at) => {
      writes.push(change);
      const answer = answers.shift() ?? "saved";
      if (answer !== "saved") return answer;
      const base: Listing = {
        id,
        companyId: "c",
        buildingName: "S1.01",
        standardStatus: "Active",
        version: 1,
        ...start[id],
        ...saved.get(id),
      };
      const next = applyChange(base, change, at);
      if (next.ok) saved.set(id, next.listing);
      return next.ok ? "saved" : "fault";
    },
    saved: (id) => saved.get(id),
    changed: () => {
      tick += 1;
    },
    tick,
  };
  return { api, writes, saved };
}

/** The record of a grid row, with the grid's write lent to it and the session's roles. */
function Record({
  rowId,
  data,
  api,
  role = "ListAgent",
}: {
  rowId: string;
  data: ListingRecordData;
  api: DetailsEditApi | null;
  role?: string;
}): ReactNode {
  const row = rows.find((r) => r.id === rowId)!;
  return (
    <SessionRoles roles={[role as "ListAgent"]}>
      <DetailsEditProvider api={api}>
        <ListingRecordFull view={listingView(row, HEADERS)} data={data} labels={LABELS} />
      </DetailsEditProvider>
    </SessionRoles>
  );
}

const editButton = () => document.querySelector('[data-slot="listing-details-edit-open"]');
const OPEN = ["Incomplete", "Active", "Pending", "Hold"];

/** A record whose newest listing is open and has an earlier one, and a record whose newest is closed. */
const withEarlier = Object.entries(records).find(
  ([, d]) => OPEN.includes(d.listings[0]!.standardStatus) && d.listings.length > 1,
)!;
const closedNewest = Object.entries(records).find(([id, d]) => {
  const s = d.listings[0]!.standardStatus;
  return (s === "Closed" || s === "Withdrawn") && rows.some((r) => r.id === id);
})!;

/** A record of one open listing with the given details, on the first grid row. */
function oneListing(details: Partial<Listing>): [string, ListingRecordData] {
  const [id, data] = withEarlier;
  return [id, { ...data, listings: [{ ...data.listings[0]!, ...details }] }];
}

const offerRows = () =>
  Object.fromEntries(
    [...document.querySelectorAll('[data-slot="listing-offer"] [data-field]')].map((el) => [
      el.getAttribute("data-field"),
      el.querySelector("dd")?.textContent ?? "",
    ]),
  );
const missingLine = () =>
  document.querySelector('[data-slot="listing-completeness-missing"]')?.textContent ?? "";

async function openDialog() {
  await act(async () => fireEvent.click(editButton()!));
  return screen.findByRole("dialog");
}
async function typeIn(dialog: HTMLElement, detail: string, text: string) {
  const input = dialog.querySelector(`input[data-detail="${detail}"]`) as HTMLInputElement;
  await act(async () => fireEvent.change(input, { target: { value: text } }));
}
async function pressSave(dialog: HTMLElement) {
  await act(async () => {
    fireEvent.click(within(dialog).getByRole("button", { name: RECORD_COPY.detailsSubmit }));
  });
}

describe("sua-thong-tin-can · hồ sơ căn", () => {
  it("nut-sua-12-o: four roles × three listings (open newest, an earlier one, a closed newest)", async () => {
    const want: Record<string, boolean> = {
      ListAgent: true,
      BuyerAgent: true,
      TeamLead: true,
      CompanyAdmin: false,
    };
    let cells = 0;
    for (const [role, may] of Object.entries(want)) {
      const open = render(
        <Record rowId={withEarlier[0]} data={withEarlier[1]} api={fakeApi({}).api} role={role} />,
      );
      expect(Boolean(editButton()), `nut-sua-12-o: ${role}·đang mở`).toBe(may);
      cells += 1;
      // Turning to the earlier listing takes the button away.
      const earlier = within(open.container).getAllByRole("button", {
        name: RECORD_COPY.listingNumber(withEarlier[1].listings[1]!.number),
      })[0]!;
      await act(async () => fireEvent.click(earlier));
      expect(Boolean(editButton()), `nut-sua-12-o: ${role}·lần trước`).toBe(false);
      cells += 1;
      open.unmount();
      const closed = render(
        <Record rowId={closedNewest[0]} data={closedNewest[1]} api={fakeApi({}).api} role={role} />,
      );
      expect(Boolean(editButton()), `nut-sua-12-o: ${role}·đã đóng`).toBe(false);
      cells += 1;
      closed.unmount();
    }
    expect(cells).toBe(12);
  });

  it("without the grid's write the record stays read-only", () => {
    render(<Record rowId={withEarlier[0]} data={withEarlier[1]} api={null} />);
    expect(editButton()).toBeNull();
  });

  it("hop-luu-dem-lai: a save shows the new value in the section and counts again", async () => {
    const [id, data] = oneListing({
      legalStatus: "Sổ hồng",
      financing: undefined,
      furnished: "Furnished",
      occupantType: "Owner",
    });
    const { api, writes } = fakeApi({
      [id]: { legalStatus: "Sổ hồng", furnished: "Furnished", occupantType: "Owner" },
    });
    const view = render(<Record rowId={id} data={data} api={api} />);
    expect(missingLine()).toContain(LABELS.parts.financing);
    const dialog = await openDialog();
    await typeIn(dialog, "financing", "Hỗ trợ vay 70%");
    await pressSave(dialog);
    expect(writes, "hop-luu-dem-lai: một lần ghi").toEqual([
      { field: "details", financing: "Hỗ trợ vay 70%" },
    ]);
    view.rerender(<Record rowId={id} data={data} api={{ ...api, tick: 1 }} />);
    expect(offerRows()["Listing.financing"], "hop-luu-dem-lai: mục").toBe("Hỗ trợ vay 70%");
    expect(missingLine(), "hop-luu-dem-lai: đếm lại").not.toContain(LABELS.parts.financing);
  });

  it("hop-khong-doi-khong-gui: nothing changed sends nothing", async () => {
    const [id, data] = oneListing({ legalStatus: "Sổ hồng" });
    const { api, writes } = fakeApi({});
    render(<Record rowId={id} data={data} api={api} />);
    await pressSave(await openDialog());
    expect(writes, "hop-khong-doi-khong-gui").toEqual([]);
  });

  it("hop-qua-dai: words over 200 say so at the field and send nothing", async () => {
    const [id, data] = oneListing({});
    const { api, writes } = fakeApi({});
    render(<Record rowId={id} data={data} api={api} />);
    const dialog = await openDialog();
    await typeIn(dialog, "legalStatus", "x".repeat(201));
    await pressSave(dialog);
    expect(writes, "hop-qua-dai: đã gửi").toEqual([]);
    expect(dialog.textContent).toContain(RECORD_COPY.detailsTooLong(200));
    // Positive control: 200 go through.
    await typeIn(dialog, "legalStatus", "x".repeat(200));
    await pressSave(dialog);
    expect(writes.length).toBe(1);
  });

  it("hop-truong-cu-dai: a legal status already longer from a sheet does not block a change of another part", async () => {
    const long = "y".repeat(350);
    const [id, data] = oneListing({ legalStatus: long });
    const { api, writes } = fakeApi({ [id]: { legalStatus: long } });
    render(<Record rowId={id} data={data} api={api} />);
    const dialog = await openDialog();
    await typeIn(dialog, "financing", "Vay 50% [MAU]");
    await pressSave(dialog);
    expect(writes, "hop-truong-cu-dai").toEqual([{ field: "details", financing: "Vay 50% [MAU]" }]);
  });

  it("hop-de-trong-la-xoa: an emptied part is cleared and counted missing again", async () => {
    const [id, data] = oneListing({ financing: "Vay 70%" });
    const { api, writes } = fakeApi({ [id]: { financing: "Vay 70%" } });
    const view = render(<Record rowId={id} data={data} api={api} />);
    expect(missingLine()).not.toContain(LABELS.parts.financing);
    const dialog = await openDialog();
    await typeIn(dialog, "financing", "  ");
    await pressSave(dialog);
    expect(writes, "hop-de-trong-la-xoa: thay đổi").toEqual([
      { field: "details", financing: null },
    ]);
    view.rerender(<Record rowId={id} data={data} api={{ ...api, tick: 1 }} />);
    expect(missingLine(), "hop-de-trong-la-xoa: còn thiếu").toContain(LABELS.parts.financing);
  });

  it("hop-nam-ket-cuc: five failed saves, five sentences, the typed words kept", async () => {
    const outcomes: Exclude<WriteOutcome, "saved">[] = [
      "offline",
      "conflict",
      "expired",
      "fault",
      "refused",
    ];
    let seen = 0;
    for (const why of outcomes) {
      const [id, data] = oneListing({});
      const { api } = fakeApi({}, [why]);
      render(<Record rowId={id} data={data} api={api} />);
      const dialog = await openDialog();
      await typeIn(dialog, "legalStatus", "Sổ đỏ [MAU]");
      await pressSave(dialog);
      const want = why === "refused" ? FRAME_COPY.refusedAction : RECORD_COPY.detailsFailed(why);
      expect(dialog.textContent, `hop-nam-ket-cuc: ${why}`).toContain(want);
      expect(
        (dialog.querySelector('input[data-detail="legalStatus"]') as HTMLInputElement).value,
      ).toBe("Sổ đỏ [MAU]");
      const submit = within(dialog).queryByRole("button", { name: /Lưu|Thử lại/ });
      expect(Boolean(submit), `hop-nam-ket-cuc: ${why} nút gửi`).toBe(why !== "refused");
      seen += 1;
      cleanup();
    }
    expect(seen).toBe(5);
  });

  it("du-thong-tin-cho-hang-15: legal status and occupant filled here leave the missing line, by the one completeness rule", async () => {
    const [id, data] = oneListing({
      legalStatus: undefined,
      occupantType: undefined,
      furnished: "Furnished",
      financing: "Không vay",
    });
    const { api, saved } = fakeApi({ [id]: { furnished: "Furnished", financing: "Không vay" } });
    const view = render(<Record rowId={id} data={data} api={api} />);
    expect(missingLine()).toContain(LABELS.parts.legalStatus);
    expect(missingLine()).toContain(LABELS.parts.occupantType);
    // Occupant type is a choice: the write the dialog sends for it, then legal status typed.
    await api.write(id, { field: "details", occupantType: "Vacant" }, NOW.toISOString());
    const dialog = await openDialog();
    await typeIn(dialog, "legalStatus", "Sổ hồng");
    await pressSave(dialog);
    view.rerender(<Record rowId={id} data={data} api={{ ...api, tick: 2 }} />);
    const line = missingLine();
    expect(line, "du-thong-tin-cho-hang-15: pháp lý").not.toContain(LABELS.parts.legalStatus);
    expect(line, "du-thong-tin-cho-hang-15: hiện trạng").not.toContain(LABELS.parts.occupantType);
    // The screen's count is the one rule's count on the saved listing.
    const listing = saved.get(id)!;
    const count = document.querySelector('[data-slot="listing-completeness-count"]')?.textContent;
    const rule = completeness({ ...listing, listPrice: data.listings[0]!.listPrice });
    // Row 3h (B): a complete listing says it on one line.
    expect(count, "du-thong-tin-cho-hang-15: số đếm").toBe(
      rule.missing.length === 0
        ? RECORD_COPY.completeLine(rule.have, rule.need)
        : `${rule.have}/${rule.need}`,
    );
  });
});

const EDIT_LABELS = cellEditLabels((concept, transaction) => label(concept, { transaction }));
const FIELDS: CustomCellField[] = [
  { code: "ghi_chu", header: "Ghi chú", kind: "text", options: [] },
  { code: "so_cho_xe", header: "Chỗ xe", kind: "number", options: [] },
  { code: "ngay_ban_giao", header: "Bàn giao", kind: "date", options: [] },
  { code: "huong_view", header: "Hướng view", kind: "single_select", options: ["Hồ", "Phố"] },
  { code: "co_ban_cong", header: "Ban công", kind: "boolean", options: [] },
];

function cell(field: CustomCellField, onSave = vi.fn(), initialText?: string) {
  const row: GridRow = { ...rows[0]!, [`custom.${field.code}`]: null } as GridRow;
  const session: CellEditSession = {
    row,
    field: `custom.${field.code}` as CellEditSession["field"],
    close: vi.fn(),
    ...(initialText === undefined ? {} : { initialText }),
  };
  render(
    <ListingCellEdit
      session={session}
      labels={EDIT_LABELS}
      onSave={vi.fn()}
      onAsk={vi.fn()}
      custom={{ field, onSave }}
    />,
  );
  return { onSave, session };
}

describe("sua-thong-tin-can · ô cột riêng", () => {
  it("o-rieng-nam-kieu: 5 kinds, 5 editors", () => {
    const got: string[] = [];
    for (const f of FIELDS) {
      cell(f);
      const input = document.querySelector("input[data-custom-kind]") as HTMLInputElement | null;
      const list = document.querySelector('[role="listbox"][data-custom-kind]');
      const what =
        f.kind === "text"
          ? input?.dataset.customKind === "text" && !input.inputMode
          : f.kind === "number"
            ? input?.inputMode === "decimal"
            : f.kind === "date"
              ? input?.placeholder === "dd/mm/yyyy"
              : f.kind === "single_select"
                ? [...(list?.querySelectorAll('[role="option"]') ?? [])]
                    .map((o) => o.textContent)
                    .join("|") === "Hồ|Phố|Chưa có"
                : [...(list?.querySelectorAll('[role="option"]') ?? [])]
                    .map((o) => o.textContent)
                    .join("|") === "Có|Không|Chưa có";
      expect(what, `o-rieng-nam-kieu: ${f.kind}`).toBe(true);
      got.push(f.kind);
      cleanup();
    }
    expect(got.length).toBe(5);
  });

  it("o-rieng-sai-kieu: a number field given words says so under the cell and sends nothing", async () => {
    const { onSave } = cell(FIELDS[1]!, vi.fn(), "hai");
    const input = document.querySelector("input[data-custom-kind]")!;
    await act(async () => fireEvent.keyDown(input, { key: "Enter" }));
    expect(screen.getByRole("alert").textContent, "o-rieng-sai-kieu").toContain("Gõ một số");
    expect(onSave).not.toHaveBeenCalled();
  });

  it("a date typed dd/mm/yyyy is saved as the calendar day; a choice saves its option", async () => {
    const date = cell(FIELDS[2]!, vi.fn(), "25/12/2026");
    await act(async () =>
      fireEvent.keyDown(document.querySelector("input[data-custom-kind]")!, { key: "Enter" }),
    );
    expect(date.onSave).toHaveBeenCalledWith({
      field: "custom.ngay_ban_giao",
      custom: "ngay_ban_giao",
      value: "2026-12-25",
    });
    cleanup();
    const pick = cell(FIELDS[3]!);
    await act(async () => fireEvent.click(screen.getByRole("option", { name: "Phố" })));
    expect(pick.onSave).toHaveBeenCalledWith({
      field: "custom.huong_view",
      custom: "huong_view",
      value: "Phố",
    });
  });
});

describe("sua-thong-tin-can · dán vào cột riêng", () => {
  it("dan-cot-rieng: fitting words will change, wrong ones are «sai kiểu» with why, a word on Về tay is left out", () => {
    const row = { ...rows[0]!, "custom.so_cho_xe": 1, "custom.huong_view": null } as GridRow;
    const paste: RegionPaste = {
      cells: [
        { row, field: "custom.so_cho_xe" as never, raw: "2", open: true },
        { row, field: "custom.huong_view" as never, raw: "Biển", open: true },
        { row, field: "custom.netToSeller" as never, raw: "3 tỷ", open: true },
        {
          row: { ...row, id: "r2" } as GridRow,
          field: "custom.so_cho_xe" as never,
          raw: "hai",
          open: true,
        },
      ],
      beyond: { rows: 0, columns: 0 },
    };
    const customs = new Map(FIELDS.map((f) => [`custom.${f.code}`, f] as const));
    const plan = planPaste(
      paste,
      EDIT_LABELS,
      (f) => String(f),
      ["custom.netToSeller" as never],
      customs as never,
    );
    expect(
      plan.changes.map((c) => c.id),
      "dan-cot-rieng: sẽ đổi",
    ).toEqual([`${row.id}|custom.so_cho_xe`]);
    expect(
      plan.wrong.map((w) => w.why),
      "dan-cot-rieng: sai kiểu",
    ).toEqual(["Không có lựa chọn này.", "Gõ một số, như 12 hoặc 1,5."]);
    expect(
      plan.skipped.map((s) => s.id),
      "dan-cot-rieng: Về tay",
    ).toEqual([`${row.id}|custom.netToSeller`]);
    expect([...plan.writes.values()][0]!.change).toEqual({
      field: "customField",
      code: "so_cho_xe",
      value: 2,
    });
  });
});

describe("sua-thong-tin-can · bốn cột trên lưới (lối C)", () => {
  const WORDS = {
    furnished: LABELS.parts.furnished,
    legalStatus: LABELS.parts.legalStatus,
    financing: LABELS.parts.financing,
    occupantType: LABELS.parts.occupantType,
    furnishedValues: LABELS.furnishedValues,
    occupantValues: LABELS.occupantValues,
  };

  it("o-chi-tiet-bon-cot: four cells, two choices of fixed values and two words of at most 200", () => {
    const fields = detailCellFields(WORDS);
    const got = fields.map((f) => `${f.key}:${f.kind}:${f.options.length}:${f.limit ?? "-"}`);
    expect(got, "o-chi-tiet-bon-cot").toEqual([
      "Listing.furnished:single_select:3:-",
      "Listing.legalStatus:text:0:200",
      "Listing.financing:text:0:200",
      "Listing.occupantType:single_select:3:-",
    ]);
  });

  it("o-chi-tiet-mot-thay-doi: a cell sends the record's one change, its word read back to the stored value", () => {
    expect(detailChange("Listing.furnished", LABELS.furnishedValues.Partially, WORDS)).toEqual({
      field: "details",
      furnished: "Partially",
    });
    expect(detailChange("Listing.occupantType", null, WORDS)).toEqual({
      field: "details",
      occupantType: null,
    });
    expect(detailChange("Listing.legalStatus", "Sổ hồng", WORDS)).toEqual({
      field: "details",
      legalStatus: "Sổ hồng",
    });
    expect(
      detailCells(
        { furnished: "Furnished", occupantType: "Vacant", legalStatus: "Sổ hồng" },
        WORDS,
      ),
    ).toMatchObject({
      "Listing.furnished": LABELS.furnishedValues.Furnished,
      "Listing.occupantType": LABELS.occupantValues.Vacant,
      "Listing.legalStatus": "Sổ hồng",
      "Listing.financing": null,
    });
  });

  it("o-chi-tiet-dan: a paste onto Nội thất and Pháp lý reads by kind and writes details", () => {
    const fields = detailCellFields(WORDS);
    const customs = new Map(fields.map((f) => [f.key!, f] as const));
    const row = { ...rows[0]!, "Listing.furnished": null, "Listing.legalStatus": null } as GridRow;
    const paste: RegionPaste = {
      cells: [
        {
          row,
          field: "Listing.furnished" as never,
          raw: LABELS.furnishedValues.Unfurnished.toUpperCase(),
          open: true,
        },
        { row, field: "Listing.legalStatus" as never, raw: "x".repeat(201), open: true },
        { row, field: "Listing.financing" as never, raw: "Vay 50%", open: true },
      ],
      beyond: { rows: 0, columns: 0 },
    };
    const plan = planPaste(
      paste,
      EDIT_LABELS,
      (f) => String(f),
      [],
      customs as never,
      (f, v) => detailChange(f.key as never, v === null ? null : String(v), WORDS),
    );
    const changes = [...plan.writes.values()].map((w) => w.change);
    expect(changes, "o-chi-tiet-dan: sẽ đổi").toEqual([
      { field: "details", furnished: "Unfurnished" },
      { field: "details", financing: "Vay 50%" },
    ]);
    expect(
      plan.wrong.map((w) => w.why),
      "o-chi-tiet-dan: sai kiểu",
    ).toEqual(["Dài quá 200 ký tự."]);
  });

  it("hoan-tac-chu-cu-dai: words already longer than 200 from a sheet are not offered back, on a cell or a paste", () => {
    const long = "x".repeat(201);
    expect(
      [null, undefined, "Furnished", "Sổ hồng", "x".repeat(200), long, " Sổ hồng", ""].map(
        detailUndoable,
      ),
      "hoan-tac-chu-cu-dai: luật",
    ).toEqual([true, true, true, true, true, false, false, false]);
    const fields = detailCellFields(WORDS);
    const customs = new Map(fields.map((f) => [f.key!, f] as const));
    const row = {
      ...rows[0]!,
      "Listing.legalStatus": long,
      "Listing.financing": "Vay 50%",
    } as GridRow;
    const plan = planPaste(
      {
        cells: [
          { row, field: "Listing.legalStatus" as never, raw: "Sổ hồng", open: true },
          { row, field: "Listing.financing" as never, raw: "Vay 70%", open: true },
        ],
        beyond: { rows: 0, columns: 0 },
      },
      EDIT_LABELS,
      (f) => String(f),
      [],
      customs as never,
      (f, v) => detailChange(f.key as never, v === null ? null : String(v), WORDS),
    );
    expect(
      [...plan.writes.values()].map((w) => w.undoable),
      "hoan-tac-chu-cu-dai: dán",
    ).toEqual([false, true]);
  });
});

describe("sua-thong-tin-can · ô riêng theo vai", () => {
  it("o-rieng-quan-tri-khong-mo: the own columns open under updateListing; a company admin has no cell, a list agent has", async () => {
    const { actionVisibility } = await import("../src/modules/identity");
    expect(
      actionVisibility(["CompanyAdmin"], "updateListing", true),
      "o-rieng-quan-tri-khong-mo: Quản trị sàn",
    ).not.toBe("show");
    expect(
      actionVisibility(["ListAgent"], "updateListing", true),
      "o-rieng-quan-tri-khong-mo: đối chứng Đầu chủ",
    ).toBe("show");
  });
});

describe("sua-thong-tin-can · nối thật cửa lưu và hộp", () => {
  it("noi-that-cua-luu: the record's write over the real save door reads a 401 as expired and a 400 as a fault", async () => {
    const { renderHook } = await import("@testing-library/react");
    const { httpSaveDoor } = await import("../src/modules/listings/ui/http-save-door");
    const { useListingCellEdit } = await import("../src/modules/listings/ui/use-listing-cell-edit");
    const listing = {
      id: rows[0]!.id,
      companyId: "c",
      buildingName: "S1.01",
      standardStatus: "Active" as const,
      version: 1,
    };
    const answers = [
      new Response(JSON.stringify({ error: "unauthenticated" }), { status: 401 }),
      new Response(JSON.stringify({ error: "invalid", why: { rule: "details" } }), { status: 400 }),
    ];
    const door = httpSaveDoor({
      online: () => true,
      fetch: (async () => answers.shift()!) as typeof fetch,
    });
    const hook = renderHook(() =>
      useListingCellEdit({
        rows: [rows[0]!],
        listings: [listing],
        headers: HEADERS,
        labels: EDIT_LABELS,
        door,
      }),
    );
    const at = NOW.toISOString();
    expect(
      await hook.result.current.writeListing(
        listing.id,
        { field: "details", legalStatus: "x" },
        at,
      ),
      "noi-that-cua-luu: 401",
    ).toBe("expired");
    expect(
      await hook.result.current.writeListing(
        listing.id,
        { field: "details", legalStatus: "x" },
        at,
      ),
      "noi-that-cua-luu: 400",
    ).toBe("fault");
  });
});
