// Row 5, AC-3: every cell a paste may not write lands in «Bị bỏ» with the reason written before the build — ten reasons,
// one case each, the sentence pinned word for word.
import { describe, expect, it } from "vitest";

import type { FieldKey } from "@/components/candidate/column-kind";
import type { GridRow, PastedCell, RegionPaste } from "@/components/candidate/data-region";
import { LABELS } from "@/generated/labels";

import { cellEditLabels } from "./cell-edit-copy";
import { lockedReasons } from "./listing-cell-edit";
import { planPaste } from "./listing-paste";

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
    "Đã bán — giữ nguyên như lúc bán",
  ],
  [
    "nac-khong-di-duoc",
    paste([cell(HOLD, "Listing.standardStatus", "Đang giao dịch")]),
    "từ Tạm ngừng không sang Đang giao dịch được",
  ],
  [
    "nac-da-ban",
    paste([cell(ACTIVE, "Listing.standardStatus", "Đã bán")]),
    "Đã bán cần giá chốt và ngày bán — mở ô để đổi",
  ],
  [
    "nac-ngung-han",
    paste([cell(ACTIVE, "Listing.standardStatus", "Ngừng hẳn")]),
    "Ngừng hẳn cần lý do ngừng — mở ô để đổi",
  ],
  [
    "dong-nhom",
    paste([cell(ACTIVE, "Listing.listPrice", "5 tỷ", { group: "Toà A" })]),
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
      if (name === "dong-nhom") expect(plan.skipped[0]?.where).toBe("Dòng nhóm «Toà A»");
    });
  }
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
