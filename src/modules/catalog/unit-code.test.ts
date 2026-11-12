// Row 7d E4, E8: the eight forms of onehub-invest, written before the reader (evals.yaml matrix). Example codes use the
// invented Q prefix of invest's own test file; no real code is here.
import { describe, expect, it } from "vitest";

import {
  isFloor,
  normaliseFloor,
  readUnitCode,
  UNIT_CODE_FORMS,
  type UnitCodeForm,
} from "./unit-code";
import { sampleCatalog } from "./sample";

const RIGHT: ReadonlyArray<[string, string, string, string, string]> = [
  ["gach", "Q12A-17-05A", "Q12A", "17", "05A"],
  ["cham", "Q1.18.12", "Q1", "18", "12"],
  ["tien-to-x", "QQQQQ_Q1-X24.04", "Q1", "24", "04"],
  ["dinh-cham", "QX102.01", "QX1", "2", "01"],
  ["toa-cham-bon", "Q6.0107.05", "Q6.01", "7", "05"],
  ["toa-cham-dinh", "Q2.1715A10", "Q2.17", "15A", "10"],
  ["dinh-lien", "QX11807", "QX1", "18", "07"],
  ["chan-de", "QX101S10", "QX1", "1", "S10"],
];

const NEAR: ReadonlyArray<[string, string]> = [
  ["gach", "Q12A-1-05A"],
  ["cham", "Q1.18"],
  ["tien-to-x", "QQQQ_Q1-X24.04"],
  ["dinh-cham", "QX102.1"],
  ["toa-cham-bon", "Q6.010.05"],
  ["toa-cham-dinh", "Q2.17-15A10"],
  ["dinh-lien", "QX1180"],
  ["chan-de", "QX101S1"],
];

describe("bộ đọc mã căn — đúng 8 dạng của onehub-invest", () => {
  it("khai đúng 8 dạng, cùng tên với invest", () => {
    expect(UNIT_CODE_FORMS.map((f) => f.id)).toEqual(RIGHT.map((r) => r[0]));
  });

  it.each(RIGHT)("dạng %s: %s → toà, tầng, trục", (form, code, building, floor, stack) => {
    expect(readUnitCode(code)).toEqual({ building, floor, stack, form });
  });

  it.each(NEAR)("dạng %s: mã suýt đúng %s khớp không dạng nào", (_form, code) => {
    const hits = UNIT_CODE_FORMS.filter((f) => f.re.test(code));
    expect(hits.map((f) => f.id)).toEqual([]);
    expect(readUnitCode(code)).toEqual({ refused: "khong-khop-khuon" });
  });

  it("mỗi mã đúng khớp đúng một dạng", () => {
    for (const [form, code] of RIGHT) {
      const hits = UNIT_CODE_FORMS.filter((f) => f.re.test(code)).map((f) => f.id);
      expect(hits, `mã ${code}`).toEqual([form]);
    }
  });

  it("chuỗi rỗng cho ma-rong; bảng dạng có hai dạng trùng cho nhieu-khuon kèm hai tên", () => {
    expect(readUnitCode("")).toEqual({ refused: "ma-rong" });
    expect(readUnitCode("   ")).toEqual({ refused: "ma-rong" });
    expect(readUnitCode(null)).toEqual({ refused: "ma-rong" });
    const twice: UnitCodeForm[] = [
      ...UNIT_CODE_FORMS,
      { id: "gach-trung", re: UNIT_CODE_FORMS[0]!.re },
    ];
    expect(readUnitCode("Q12A-17-05A", twice)).toEqual({
      refused: "nhieu-khuon",
      forms: ["gach", "gach-trung"],
    });
  });

  it("mã mẫu cũ S1.05-1208 không thuộc dạng nào (tra qua bí danh, không tách)", () => {
    expect(readUnitCode("S1.05-1208")).toEqual({ refused: "khong-khop-khuon" });
  });

  it("tầng 07 đọc thành 7", () => {
    expect(readUnitCode("Q12A-07-05A")).toEqual({
      building: "Q12A",
      floor: "7",
      stack: "05A",
      form: "gach",
    });
  });
});

describe("tầng dạng chữ theo RESO UnitFloorLocation", () => {
  it.each(["7", "15A", "0", "120"])("nhận %s", (v) => expect(isFloor(v)).toBe(true));
  it.each(["", "07", "-1", "15-A", "A15", "15a"])("từ chối «%s»", (v) =>
    expect(isFloor(v)).toBe(false),
  );
  it("bỏ số 0 đầu, giữ chữ đuôi", () => {
    expect(normaliseFloor("07")).toBe("7");
    expect(normaliseFloor("015A")).toBe("15A");
    expect(normaliseFloor("00")).toBe("0");
  });
});

describe("tầng của danh mục mẫu", () => {
  it("mọi căn mẫu có tầng là chữ khớp ^[0-9]+[A-Z]?$, không số 0 đầu", () => {
    const bad = sampleCatalog().units.filter(
      (u) => typeof u.floor !== "string" || !isFloor(u.floor),
    );
    expect(bad.map((u) => u.upi)).toEqual([]);
  });
});
