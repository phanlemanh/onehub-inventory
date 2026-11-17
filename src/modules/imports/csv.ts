// CSV reader of the import (row 11, nhap-excel): RFC 4180 — quoted fields may hold the separator, a doubled quote and
// line breaks. Google Sheet «Tải xuống» writes commas; Excel set to Vietnamese writes semicolons with a byte order mark.
// The separator is read from the header line: whichever of «,» and «;» appears more often outside quotes.

const BOM = "﻿";

/** The separator of a CSV text, judged on its first line outside quotes; comma when neither appears. */
export function csvSeparator(text: string): "," | ";" {
  let commas = 0;
  let semicolons = 0;
  let quoted = false;
  for (const ch of text) {
    if (ch === '"') quoted = !quoted;
    else if (!quoted && (ch === "\n" || ch === "\r")) break;
    else if (!quoted && ch === ",") commas += 1;
    else if (!quoted && ch === ";") semicolons += 1;
  }
  return semicolons > commas ? ";" : ",";
}

/** Every row of a CSV text as strings, byte order mark dropped; a final empty line is not a row. */
export function readCsv(text: string): string[][] {
  const body = text.startsWith(BOM) ? text.slice(1) : text;
  const sep = csvSeparator(body);
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < body.length; i += 1) {
    const ch = body[i];
    if (quoted) {
      if (ch === '"' && body[i + 1] === '"') {
        cell += '"';
        i += 1;
      } else if (ch === '"') quoted = false;
      else cell += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === sep) {
      row.push(cell);
      cell = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && body[i + 1] === "\n") i += 1;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else cell += ch;
  }
  if (cell !== "" || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }
  return rows;
}
