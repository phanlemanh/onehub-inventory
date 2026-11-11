// decision:format-number-date
// decision:status-tone
import { describe, expect, it } from "vitest";

import { FIELD_DISPLAY, type DisplayKind } from "../src/generated/display";
import type { ListingStandardStatus } from "../src/generated/ontology";
import {
  EMPTY,
  STATUS_TONE,
  formatArea,
  formatByKind,
  formatCount,
  formatDate,
  formatDateTime,
  formatMoney,
  formatPhone,
  statusLabel,
  statusTone,
} from "../src/lib/format";

type Kind = "money" | "area" | "count" | "date" | "datetime" | "phone";
type Formatters = Record<Kind, (value: never) => string>;
type Cell = [Kind, unknown, string];

/** The matrix written before the code: 32 cells, the number is fixed here and in evals.yaml (E9). */
const CELLS_EXPECTED = 32;
const MATRIX: readonly Cell[] = [
  ["money", 4_850_000_000, "4,85 tỷ"],
  ["money", 4_856_000_000, "4,86 tỷ"],
  ["money", 5_000_000_000, "5 tỷ"],
  ["money", 1_000_000_000, "1 tỷ"],
  ["money", 999_999_999, "1 tỷ"],
  ["money", 320_000_000, "320 triệu"],
  ["money", 15_500_000, "15,5 triệu"],
  ["money", 1_000_000, "1 triệu"],
  ["money", 999_999, "999.999 ₫"],
  ["money", 0, "0 ₫"],
  ["money", -5, EMPTY],
  ["money", null, EMPTY],
  ["area", 75.5, "75,5 m²"],
  ["area", 100, "100 m²"],
  ["area", 75.456, "75,46 m²"],
  ["area", null, EMPTY],
  ["count", 2418, "2.418"],
  ["count", 0, "0"],
  ["count", 12, "12"],
  ["count", null, EMPTY],
  ["date", "2026-11-05", "05/11/2026"],
  ["date", new Date("2026-11-05T03:00:00Z"), "05/11/2026"],
  ["date", "abc", EMPTY],
  ["date", null, EMPTY],
  ["datetime", "2026-11-05T07:30:00Z", "14:30 05/11/2026"],
  ["datetime", "abc", EMPTY],
  ["datetime", null, EMPTY],
  ["phone", "0900000001", "0900 000 001"],
  ["phone", "0900 000 001", "0900 000 001"],
  ["phone", "+84900000001", "0900 000 001"],
  ["phone", "09000001", "09000001"],
  ["phone", null, EMPTY],
];

const REAL: Formatters = {
  money: formatMoney,
  area: formatArea,
  count: formatCount,
  date: formatDate,
  datetime: formatDateTime,
  phone: formatPhone,
};

/** Runs every cell and throws on the first mismatch, naming the kind and the input. */
function checkMatrix(formatters: Formatters): void {
  for (const [kind, input, expected] of MATRIX) {
    const got = (formatters[kind] as (value: unknown) => string)(input);
    if (got !== expected) {
      throw new Error(
        `format mismatch: ${kind} ${String(input)} gave "${got}", want "${expected}"`,
      );
    }
  }
}

describe("formatters", () => {
  it("has exactly the matrix that was written down", () => {
    expect(MATRIX.length).toBe(CELLS_EXPECTED);
  });

  it("formats every cell of the matrix", () => {
    expect(() => checkMatrix(REAL)).not.toThrow();
  });

  it("fails on a formatter that picks the unit before rounding", () => {
    const broken: Formatters = {
      ...REAL,
      money: ((v: number | null) =>
        v !== null && v >= 1_000_000 && v < 1_000_000_000
          ? `${new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 1 }).format(v / 1_000_000)} triệu`
          : formatMoney(v)) as Formatters["money"],
    };
    expect(() => checkMatrix(broken)).toThrow("format mismatch: money 999999999");
  });

  it("never returns a non-breaking space", () => {
    for (const [kind, input] of MATRIX) {
      expect((REAL[kind] as (value: unknown) => string)(input)).not.toMatch(/\u00a0|\u202f/);
    }
  });

  it("picks the formatter from the display kind of each field", () => {
    const sample: Partial<Record<DisplayKind, [unknown, string]>> = {
      money: [4_850_000_000, "4,85 tỷ"],
      area: [75.5, "75,5 m²"],
      count: [2418, "2.418"],
      date: ["2026-11-05", "05/11/2026"],
      datetime: ["2026-11-05T07:30:00Z", "14:30 05/11/2026"],
      phone: ["0900000001", "0900 000 001"],
    };
    const fields = Object.entries(FIELD_DISPLAY).filter(([, kind]) => kind in sample);
    expect(fields.length).toBeGreaterThan(0);
    for (const [field, kind] of fields) {
      const [input, want] = sample[kind]!;
      expect(formatByKind(kind, input), field).toBe(want);
    }
    expect(formatByKind("text", "A1-05")).toBe("A1-05");
    expect(formatByKind("text", null)).toBe(EMPTY);
  });
});

describe("status tone", () => {
  const ALL: readonly ListingStandardStatus[] = [
    "Incomplete",
    "Active",
    "Pending",
    "Closed",
    "Hold",
    "Withdrawn",
  ];

  it("gives each of the six statuses its colour", () => {
    expect(Object.keys(STATUS_TONE).sort()).toEqual([...ALL].sort());
    expect(ALL.map(statusTone)).toEqual([
      "warning-light",
      "success-light",
      "info-light",
      "primary-light",
      "warning-light",
      "destructive-light",
    ]);
  });

  it("takes the words from the label dictionary, lease included", () => {
    expect(statusLabel("Active")).toBe("Đang bán");
    expect(statusLabel("Active", "lease")).toBe("Đang cho thuê");
    expect(statusLabel("Closed", "lease")).toBe("Đã cho thuê");
    expect(statusLabel("Hold", "lease")).toBe("Tạm ngừng");
  });
});
