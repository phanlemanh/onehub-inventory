// @vitest-environment jsdom
// Row 5, AC-3: every cell a paste may not write lands in «Bị bỏ» with the reason written before the build — ten reasons,
// one case each, the sentence pinned word for word.
import { act, cleanup, fireEvent, render, renderHook, screen } from "@testing-library/react";
import type { ReactElement } from "react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import type { FieldKey } from "@/components/candidate/column-kind";
import type { GridRow, PastedCell, RegionPaste } from "@/components/candidate/data-region";
import { LABELS } from "@/generated/labels";
import type { Listing } from "@/generated/ontology";

import { cellEditLabels } from "./cell-edit-copy";
import { lockedReasons } from "./listing-cell-edit";
import type { InventoryField } from "./inventory-rows";
import { planPaste } from "./listing-paste";
import { useListingCellEdit } from "./use-listing-cell-edit";
import { sampleSaveDoor, type SaveRequest } from "../save-door";
import type { ListingStandardStatus } from "@/generated/ontology";
import { statusLabel } from "@/lib/format";
/** A status as the label table words it (labels are never written by hand in src, tests/language.test.ts). */
const S = (status: ListingStandardStatus, tx?: "sale" | "lease") => statusLabel(status, tx);

const toast = vi.hoisted(() => Object.assign(vi.fn(), { error: vi.fn() }));
vi.mock("sonner", () => ({ toast }));

beforeAll(() => {
  Element.prototype.getAnimations ??= () => [];
  Element.prototype.scrollIntoView ??= () => {};
  window.matchMedia ??= ((query: string) => ({
    matches: true,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  })) as unknown as typeof window.matchMedia;
});

afterEach(() => {
  cleanup();
  toast.mockReset();
  toast.error.mockReset();
});

const labels = cellEditLabels((c, tx) => {
  const entry: { pref: string; lease?: string } = LABELS[c];
  return tx === "lease" && entry.lease ? entry.lease : entry.pref;
});
const headerOf = (field: FieldKey) => field;

const row = (
  id: string,
  standardStatus: string,
  listPrice: number | null = 4_650_000_000,
): GridRow => {
  const r: GridRow = {
    id,
    transaction: "sale",
    "Listing.unitNumber": id,
    "Listing.standardStatus": standardStatus,
    "Listing.listPrice": listPrice,
  };
  return { ...r, locked: lockedReasons(r) };
};

const cell = (
  r: GridRow,
  field: FieldKey,
  raw: string,
  extra: Partial<PastedCell> = {},
): PastedCell => ({
  row: r,
  field,
  raw,
  open: !r.locked?.[field],
  ...extra,
});

const paste = (cells: PastedCell[], beyond = { rows: 0, columns: 0 }): RegionPaste => ({
  cells,
  beyond,
});

const ACTIVE = row("1101", "Active");
const CLOSED = row("1102", "Closed");
const HOLD = row("1103", "Hold");

/** The ten reasons of AC-3, the paste that gives each, and the sentence the preview shows. */
const REASONS: readonly (readonly [string, RegionPaste, string])[] = [
  [
    "thuoc-tinh-can",
    paste([cell(ACTIVE, "Unit.livingArea", "80")]),
    "thuộc tính căn — không sửa trên bảng",
  ],
  [
    "xac-nhan-luc",
    paste([cell(ACTIVE, "Listing.lastConfirmedAt", "05/11/2026")]),
    "máy tự ghi khi giá hay trạng thái đổi",
  ],
  [
    "cot-tinh",
    paste([cell(ACTIVE, "custom.ve-tay", "4 tỷ")]),
    "cột máy tính từ các cột khác — không dán được",
  ],
  [
    "cot-rieng",
    paste([cell(ACTIVE, "custom.huong", "Đông Nam")]),
    "cột riêng của sàn chưa sửa được trên bảng",
  ],
  [
    "khoa-da-ban",
    paste([cell(CLOSED, "Listing.listPrice", "5 tỷ")]),
    `${S("Closed")} — giữ nguyên như lúc bán`,
  ],
  [
    "nac-khong-di-duoc",
    paste([cell(HOLD, "Listing.standardStatus", S("Pending"))]),
    `từ ${S("Hold")} không sang ${S("Pending")} được`,
  ],
  [
    "nac-da-ban",
    paste([cell(ACTIVE, "Listing.standardStatus", S("Closed"))]),
    `${S("Closed")} cần giá chốt và ngày bán — mở ô để đổi`,
  ],
  [
    "nac-ngung-han",
    paste([cell(ACTIVE, "Listing.standardStatus", S("Withdrawn"))]),
    `${S("Withdrawn")} cần lý do ngừng — mở ô để đổi`,
  ],
  [
    "dong-nhom",
    paste([cell(ACTIVE, "Listing.listPrice", "5 tỷ", { group: "A1" })]),
    "cột này không sửa trên bảng",
  ],
  ["phan-thua", paste([cell(ACTIVE, "Listing.listPrice", "4,7 tỷ")], { rows: 2, columns: 1 }), ""],
];

describe("ly-do-bo-du-10", () => {
  it("covers ten reasons", () => expect(REASONS).toHaveLength(10));
  for (const [name, region, why] of REASONS) {
    it(`ly-do-bo-du-10: ${name}`, () => {
      const plan = planPaste(region, labels, headerOf, ["custom.ve-tay"]);
      expect(plan.writes.size, `${name}: no write`).toBe(name === "phan-thua" ? 1 : 0);
      expect(plan.wrong, `${name}: not «Sai kiểu»`).toEqual([]);
      if (name === "phan-thua") {
        expect(plan.skipped.map((s) => s.where)).toEqual([
          "2 dòng thừa dưới đáy bảng — dán không thêm dòng",
          "1 cột thừa bên phải bảng",
        ]);
        return;
      }
      expect(plan.skipped.map((s) => s.why)).toEqual([why]);
      if (name === "dong-nhom") expect(plan.skipped[0]?.where).toBe("Dòng nhóm «A1»");
    });
  }
});

describe("dau-tren-dong", () => {
  it("dau-tren-dong: a far price carries its signed swing and starts unticked; no price before means no way back", () => {
    const far = row("2201", "Active", 4_280_000_000);
    const down = row("2202", "Active", 1_000_000_000);
    const none = row("2203", "Active", null);
    const plan = planPaste(
      paste([
        cell(far, "Listing.listPrice", "9 tỷ"),
        cell(down, "Listing.listPrice", "799.900.000"),
        cell(none, "Listing.listPrice", "1 tỷ"),
      ]),
      labels,
      headerOf,
    );
    const by = Object.fromEntries(plan.changes.map((c) => [c.id.split("|")[0], c]));
    expect(by["2201"]).toMatchObject({ mark: "+110,28%", held: true });
    expect(by["2202"]).toMatchObject({ mark: "−20,01%", held: true });
    expect(by["2203"]?.mark).toBeUndefined();
    expect(by["2203"], "dau-tren-dong: không hoàn tác được").toMatchObject({ final: true });
    expect(plan.writes.get("2203|Listing.listPrice")?.undoable).toBe(false);
  });
});

describe("bo-khong-giau-o-khac", () => {
  it("a region mixing reasons keeps the cells that change", () => {
    const plan = planPaste(
      paste([
        cell(ACTIVE, "Listing.listPrice", "4,7 tỷ"),
        cell(ACTIVE, "Unit.livingArea", "80"),
        cell(CLOSED, "Listing.listPrice", "5 tỷ"),
      ]),
      labels,
      headerOf,
    );
    expect(plan.changes.map((c) => c.id)).toEqual(["1101|Listing.listPrice"]);
    expect(plan.skipped).toHaveLength(2);
    expect(plan.title).toBe("Dán vào 2 căn");
  });
  it("a cell the session may not edit says so", () => {
    const plan = planPaste(
      paste([cell(ACTIVE, "Listing.listPrice", "4,7 tỷ", { open: false })]),
      labels,
      headerOf,
    );
    expect(plan.skipped.map((s) => s.why)).toEqual(["vai của bạn không sửa được ô này"]);
    expect(plan.writes.size).toBe(0);
  });
});

// Row 5, AC-5: the paste path of the inventory grid writes through the sample door; two cells of one listing chain.
const HEADERS = {
  "Listing.unitNumber": "Mã",
  "Listing.listPrice": "Giá",
  "Listing.standardStatus": "Tình trạng",
} as unknown as Readonly<Record<InventoryField, string>>;
const LISTING: Listing = {
  id: "4d415500-0000-4000-8000-0000000001a1",
  companyId: "4d415500-0000-4000-8000-000000000001",
  buildingName: "S1.01",
  unitNumber: "1101",
  standardStatus: "Active",
  listPrice: 2_710_000_000,
  version: 1,
};
const LISTED: GridRow = {
  id: LISTING.id,
  transaction: "sale",
  "Listing.unitNumber": "1101",
  "Listing.listPrice": LISTING.listPrice,
  "Listing.standardStatus": "Active",
};

describe("noi-phien-ban", () => {
  it("noi-phien-ban: two cells of one listing write one after the other on the sample door, versions chained", async () => {
    const seen: SaveRequest[] = [];
    const door = sampleSaveDoor([LISTING], { online: () => true, seen: (r) => seen.push(r) });
    const hook = renderHook(() =>
      useListingCellEdit({
        rows: [LISTED],
        listings: [LISTING],
        headers: HEADERS,
        labels,
        door,
        headerOf: (f) => f,
      }),
    );
    act(() =>
      hook.result.current.cellEdit!.paste!({
        cells: [
          { row: LISTED, field: "Listing.listPrice", raw: "2,8 tỷ", open: true },
          { row: LISTED, field: "Listing.standardStatus", raw: S("Hold"), open: true },
        ],
        beyond: { rows: 0, columns: 0 },
      }),
    );
    render(hook.result.current.dialogs as ReactElement);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Áp 2 ô" }));
    });
    await vi.waitFor(() => expect(seen).toHaveLength(2));
    expect(
      seen.map((r) => r.version),
      "noi-phien-ban: versions",
    ).toEqual([1, 2]);
    const current = door.current(LISTING.id)!;
    expect(current.version, "noi-phien-ban: conflict").toBe(3);
    expect(current.listPrice).toBe(2_800_000_000);
    expect(current.standardStatus).toBe("Hold");
    expect(toast.error).not.toHaveBeenCalled();
    expect(toast.mock.calls.at(-1)![0]).toBe("Đã đổi 2 ô của 1 căn.");
  });
});
