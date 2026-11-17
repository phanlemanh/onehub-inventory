// Writes the test files of row 11 (nhap-excel). The writer is NOT the reader: .xlsx files are zipped with fflate from
// XML written here (shared strings, numbers, Excel date serials, several sheets), not by read-excel-file. Sample data
// only: [Tên], 0900 000 0xx. Run: node tests/fixtures/nhap-excel/tao.mjs (rewrites the files next to this script).
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { zipSync, strToU8 } from "fflate";

const HERE = dirname(fileURLToPath(import.meta.url));
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const col = (i) =>
  i < 26 ? String.fromCharCode(65 + i) : col(Math.floor(i / 26) - 1) + col(i % 26);

/** A cell: string → shared string; number → number; {date: "YYYY-MM-DD"} → Excel serial with a date style. */
function xlsx(sheets) {
  const strings = [];
  const sid = (s) => {
    let i = strings.indexOf(s);
    if (i < 0) i = strings.push(s) - 1;
    return i;
  };
  const sheetXml = sheets.map(({ rows }) => {
    const body = rows
      .map((row, r) => {
        const cells = row
          .map((v, c) => {
            const ref = `${col(c)}${r + 1}`;
            if (v === null || v === "") return "";
            if (typeof v === "number") return `<c r="${ref}"><v>${v}</v></c>`;
            if (typeof v === "object" && v.date) {
              const days = (Date.parse(`${v.date}T00:00:00Z`) - Date.UTC(1899, 11, 30)) / 86400000;
              return `<c r="${ref}" s="1"><v>${days}</v></c>`;
            }
            return `<c r="${ref}" t="s"><v>${sid(String(v))}</v></c>`;
          })
          .join("");
        return `<row r="${r + 1}">${cells}</row>`;
      })
      .join("");
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>${body}</sheetData></worksheet>`;
  });
  const files = {
    "[Content_Types].xml": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>${sheets.map((_, i) => `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join("")}<Override PartName="/xl/sharedStrings.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>`,
    "_rels/.rels": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`,
    "xl/workbook.xml": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>${sheets.map((s, i) => `<sheet name="${esc(s.name)}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`).join("")}</sheets></workbook>`,
    "xl/_rels/workbook.xml.rels": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${sheets.map((_, i) => `<Relationship Id="rId${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`).join("")}<Relationship Id="rIdS" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings" Target="sharedStrings.xml"/><Relationship Id="rIdT" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`,
    "xl/styles.xml": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><numFmts count="0"/><fonts count="1"><font/></fonts><fills count="1"><fill/></fills><borders count="1"><border/></borders><cellStyleXfs count="1"><xf/></cellStyleXfs><cellXfs count="2"><xf numFmtId="0"/><xf numFmtId="14" applyNumberFormat="1"/></cellXfs></styleSheet>`,
  };
  sheetXml.forEach((x, i) => (files[`xl/worksheets/sheet${i + 1}.xml`] = x));
  files["xl/sharedStrings.xml"] =
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="${strings.length}" uniqueCount="${strings.length}">${strings.map((s) => `<si><t xml:space="preserve">${esc(s)}</t></si>`).join("")}</sst>`;
  const u8 = {};
  for (const [k, v] of Object.entries(files)) u8[k] = strToU8(v);
  return zipSync(u8);
}

// Clean file: standard headers, catalog codes, money as numbers, a confirmation date as an Excel date.
const GON = [
  ["Mã căn", "Toà", "Giá chào", "Trạng thái", "Ngày check"],
  ["S1.01-0905", "Sapphire 1", 4650000000, "Đang bán", { date: "2026-11-15" }],
  ["S1.01-0906", "Sapphire 1", 3900000000, "Tạm ngừng", { date: "2026-11-14" }],
  ["SA5-12.08", "Sapphire 5", 5100000000, "Đang bán", ""],
];
// Dirty file: abbreviations, mixed accents, prices as words, eight code forms, two columns to one target, an owner
// column, a repeated unit, an empty line between rows, a second sheet the import does not read.
const BAN = [
  ["Mã căn", "Block", "DT", "PN", "Giá KBP", "Giá", "TT", "View", "SĐT chủ"],
  ["S1.01-0905", "Sapphire 1", 75.2, 2, "4,65 tỷ", "", "còn", "biển", "0900 000 001"],
  ["SA5-12.08", "Sapphire 5", 68, 2, "3ty9", "", "cọc", "phố", "0900 000 002"],
  [],
  ["R2.11-1503", "Ruby 2", 55, 1, "thoả thuận", "", "con", "", "0900 000 003"],
  ["S1.01-0905", "Sapphire 1", 75.2, 2, "4700tr", "", "còn", "Biển", "0900 000 004"],
];
const BAN2 = [
  BAN[0],
  ["S1.01-0906", "Sapphire 1", 70, 2, "4,1 tỷ", "", "giữ chỗ", "biển", "0900 000 005"],
  ["SA5-12.09", "Sapphire 5", 68, 2, "3ty8", "", "còn", "phố", "0900 000 006"],
];
const csv = (rows, sep) =>
  rows
    .map((r) =>
      r
        .map((v) => {
          const s = typeof v === "object" && v ? v.date : String(v ?? "");
          return /["\n\r,;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
        })
        .join(sep),
    )
    .join("\r\n") + "\r\n";

writeFileSync(
  join(HERE, "gon.xlsx"),
  xlsx([
    { name: "Bảng hàng", rows: GON },
    { name: "Ghi chú", rows: [["[Tên]"]] },
    { name: "Đã bán", rows: [["Mã căn"], ["X-1"]] },
  ]),
);
writeFileSync(join(HERE, "ban.xlsx"), xlsx([{ name: "Sheet1", rows: BAN }]));
writeFileSync(join(HERE, "ban-2.xlsx"), xlsx([{ name: "Sheet1", rows: BAN2 }]));
// Google Sheet «Tải xuống → .csv»: comma, UTF-8 without BOM.
writeFileSync(
  join(HERE, "sheet.csv"),
  csv([...GON.slice(0, 3), ["Q-1", "Toà, có phẩy", 1, "Ghi\nhai dòng", ""]], ","),
);
// Excel set to Vietnamese «CSV UTF-8»: semicolon, byte order mark.
writeFileSync(join(HERE, "excel-vn.csv"), "﻿" + csv(GON, ";"));
// A password-protected workbook is a compound file, not a zip: the first eight bytes are enough for the reader.
writeFileSync(
  join(HERE, "khoa.xlsx"),
  Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1, 0, 0, 0, 0]),
);
writeFileSync(join(HERE, "hong.xlsx"), Buffer.from("PK\u0003\u0004 not really a zip"));
console.log("wrote 7 files");
