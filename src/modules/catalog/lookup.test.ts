// Row 7d E17: lookup order own code → original code → reader, with the data set written before (evals.yaml matrix).
import { describe, expect, it } from "vitest";

import { lookupCode, type CodeAlias } from "./lookup";

const U = (n: string) => `unt_${n.padStart(26, "0")}`;
const B = (n: string) => `bld_${n.padStart(26, "0")}`;
const CATALOG: CodeAlias[] = [
  { objectKey: U("1208"), value: "op1/S1.05-1208" },
  { objectKey: U("1209"), value: "op1/S1.05-1209" },
  { objectKey: U("1210"), value: "op1/S1.05-1210" },
  { objectKey: U("903"), value: "op2/E1-0903" },
];
const A: CodeAlias[] = [
  { objectKey: B("105"), value: "Sapphire 5" },
  { objectKey: U("1208"), value: "SA5-12.08" },
  { objectKey: U("1210"), value: "S1.05-1209" },
];
const BB: CodeAlias[] = [{ objectKey: U("903"), value: "SA5-12.08" }];

describe("tra mã: mã riêng của sàn → mã gốc → bộ đọc", () => {
  it("mã riêng của sàn A ra đối tượng của A", () => {
    expect(lookupCode("SA5-12.08", { companyAliases: A, catalogAliases: CATALOG })).toEqual({
      source: "san",
      objectKey: U("1208"),
    });
    expect(lookupCode("sapphire 5", { companyAliases: A, catalogAliases: CATALOG })).toEqual({
      source: "san",
      objectKey: B("105"),
    });
  });

  it("mã riêng thắng mã gốc trùng chữ của căn khác", () => {
    expect(
      lookupCode("S1.05-1209", {
        companyAliases: A,
        catalogAliases: CATALOG,
        subdivisionSlug: "op1",
      }),
    ).toEqual({ source: "san", objectKey: U("1210") });
  });

  it("cùng chuỗi ở sàn B ra căn của B, không bao giờ ra mã của A", () => {
    expect(lookupCode("SA5-12.08", { companyAliases: BB, catalogAliases: CATALOG })).toEqual({
      source: "san",
      objectKey: U("903"),
    });
  });

  it("mã chỉ có ở mã gốc → goc, đủ dạng hay mã trần trong dự án", () => {
    expect(lookupCode("op1/S1.05-1208", { companyAliases: BB, catalogAliases: CATALOG })).toEqual({
      source: "goc",
      objectKey: U("1208"),
    });
    expect(
      lookupCode("S1.05-1208", {
        companyAliases: [],
        catalogAliases: CATALOG,
        subdivisionSlug: "op1",
      }),
    ).toEqual({ source: "goc", objectKey: U("1208") });
  });

  it("mã chỉ đọc được bằng bộ đọc → doc kèm toà, tầng, trục", () => {
    expect(lookupCode("Q12A-17-05A", { companyAliases: A, catalogAliases: CATALOG })).toEqual({
      source: "doc",
      reading: { building: "Q12A", floor: "17", stack: "05A", form: "gach" },
    });
  });

  it("mã không có đâu → khong-tim-thay", () => {
    expect(lookupCode("XYZ", { companyAliases: A, catalogAliases: CATALOG })).toEqual({
      source: null,
      reason: "khong-tim-thay",
    });
  });
});
