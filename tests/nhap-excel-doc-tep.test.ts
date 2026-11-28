// E1 of row 11 (nhap-excel, AC-1): the file reader on the test files of tests/fixtures/nhap-excel (see NGUON.md), each
// read cell by cell against a table written before, and the seven refusals, each with its own code.
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { readCsv, csvSeparator } from "@/modules/imports/csv";
import {
  FILE_LIMIT_BYTES,
  ROW_LIMIT,
  readTable,
  tableOf,
  type ReadTable,
} from "@/modules/imports/read-file";

const DIR = join(import.meta.dirname, "fixtures", "nhap-excel");
const file = (name: string) => new Blob([readFileSync(join(DIR, name))]);
const ok = (t: ReadTable) => {
  if (!t.ok) throw new Error(`doc hong: ${t.problem}`);
  return t;
};

const GON_HEADERS = ["Mã căn", "Toà", "Giá chào", "Trạng thái", "Ngày check"];
const GON_ROWS = [
  ["S1.01-0905", "Sapphire 1", "4650000000", "Đang bán", "2026-11-15"],
  ["S1.01-0906", "Sapphire 1", "3900000000", "Tạm ngừng", "2026-11-14"],
  ["SA5-12.08", "Sapphire 5", "5100000000", "Đang bán", ""],
];

describe("doc-dung-sau-tep", () => {
  it("gon.xlsx: first sheet with data, the other sheets named, numbers and Excel dates as plain text", async () => {
    const t = ok(await readTable(file("gon.xlsx"), "gon.xlsx"));
    expect(t.sheet).toBe("Bảng hàng");
    expect(t.otherSheets).toEqual(["Ghi chú", "Đã bán"]);
    expect(t.headers).toEqual(GON_HEADERS);
    expect(t.rows).toEqual(GON_ROWS);
  });

  it("ban.xlsx: the empty line is left out, the two price columns stay two columns, decimals kept", async () => {
    const t = ok(await readTable(file("ban.xlsx"), "ban.xlsx"));
    expect(t.headers).toEqual([
      "Mã căn",
      "Block",
      "DT",
      "PN",
      "Giá KBP",
      "Giá",
      "TT",
      "View",
      "SĐT chủ",
    ]);
    expect(t.rows).toHaveLength(4);
    expect(t.rows[0]).toEqual([
      "S1.01-0905",
      "Sapphire 1",
      "75.2",
      "2",
      "4,65 tỷ",
      "",
      "còn",
      "biển",
      "0900 000 001",
    ]);
    expect(t.rows[2]![0]).toBe("R2.11-1503");
  });

  it("sheet.csv (Google Sheet): comma, no BOM, a quoted comma and a quoted line break", async () => {
    const t = ok(await readTable(file("sheet.csv"), "sheet.csv"));
    expect(t.sheet).toBeNull();
    expect(t.headers).toEqual(GON_HEADERS);
    expect(t.rows[0]).toEqual(GON_ROWS[0]);
    expect(t.rows[2]).toEqual(["Q-1", "Toà, có phẩy", "1", "Ghi\nhai dòng", ""]);
  });

  it("excel-vn.csv: semicolon and byte order mark", async () => {
    const t = ok(await readTable(file("excel-vn.csv"), "excel-vn.csv"));
    expect(t.headers).toEqual(GON_HEADERS);
    expect(t.rows).toEqual(GON_ROWS);
  });

  it("csv helpers: separator from the header line, doubled quotes, CRLF", () => {
    expect(csvSeparator('a;b;"c,d"\n1,2,3')).toBe(";");
    expect(csvSeparator("a,b\n")).toBe(",");
    expect(readCsv('a,"b ""x"""\r\n1,2\r\n')).toEqual([
      ["a", 'b "x"'],
      ["1", "2"],
    ]);
  });

  it("repeated headers and a column with no header but values stay; an empty unnamed column goes", () => {
    expect(
      tableOf([
        ["Giá", "Giá", "", ""],
        ["1", "2", "x", ""],
      ]),
    ).toEqual({
      headers: ["Giá", "Giá", ""],
      rows: [["1", "2", "x"]],
    });
  });
});

describe("tu-choi-bay-ca", () => {
  const big = new Blob([new Uint8Array(FILE_LIMIT_BYTES + 1)]);
  const many = new Blob([
    ["Mã căn", ...Array.from({ length: ROW_LIMIT + 1 }, (_, i) => `X-${i}`)].join("\n"),
  ]);
  const cases: [string, Blob, string, string][] = [
    ["sai đuôi", new Blob(["x"]), "bang.pdf", "wrong-type"],
    ["10 MB + 1 byte", big, "big.xlsx", "too-big"],
    ["5.001 dòng", many, "many.csv", "too-many-rows"],
    ["tệp 0 byte", new Blob([]), "rong.csv", "empty"],
    ["chỉ dòng tiêu đề", new Blob(["Mã căn,Giá\n"]), "tieu-de.csv", "header-only"],
    ["xlsx hỏng", file("hong.xlsx"), "hong.xlsx", "broken"],
    ["xlsx khoá mật khẩu", file("khoa.xlsx"), "khoa.xlsx", "locked"],
  ];
  it("seven written cases, each its own code", async () => {
    expect(cases).toHaveLength(7);
    for (const [name, blob, fileName, code] of cases) {
      const t = await readTable(blob, fileName);
      expect(t.ok, name).toBe(false);
      expect(!t.ok && t.problem, name).toBe(code);
    }
  });

  it("break: a reader without the row limit lets 5001 rows through", async () => {
    const noLimit = async (blob: Blob) => tableOf(readCsv(await blob.text()));
    const t = await noLimit(many);
    const enforced = t.rows.length <= ROW_LIMIT;
    expect(() => {
      if (!enforced) throw new Error(`row limit not enforced: ${t.rows.length}`);
    }).toThrow("row limit not enforced: 5001");
  });
});

// VP11 S4-r2 item 12 (ruling G-2811-84): a .csv saved in another encoding is refused with its reason. Kept apart from
// the seven refusals written before (tu-choi-bay-ca), which this case does not change.
describe("csv-khong-phai-utf8", () => {
  // «Mã căn,Giá» saved as Windows-1252 / Latin-1 by Excel on Windows: «ã» is the single byte 0xE3, not UTF-8.
  const latin1 = new Uint8Array(Buffer.from("Mã cân,Giá\nA-1,1\n", "latin1"));

  it("a .csv that is not UTF-8 is refused as not-utf8; UTF-8 with and without its BOM still reads", async () => {
    const r = await readTable(new Blob([latin1]), "excel-windows.csv");
    expect(r).toEqual({ ok: false, problem: "not-utf8" });
    const utf8 = new TextEncoder().encode("Mã căn,Giá\nA-1,1\n");
    const bom = new Uint8Array([0xef, 0xbb, 0xbf, ...utf8]);
    for (const bytes of [utf8, bom]) {
      const t = ok(await readTable(new Blob([bytes]), "dung.csv"));
      expect([t.headers, t.rows]).toEqual([["Mã căn", "Giá"], [["A-1", "1"]]]);
    }
  });

  it("break: the same bytes read without strict decoding carry replacement characters, so the case discriminates", () => {
    const loose = new TextDecoder("utf-8").decode(latin1);
    expect(loose).toContain("�");
    expect(loose).not.toContain("Mã");
  });
});
