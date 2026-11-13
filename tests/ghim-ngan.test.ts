// Row 3a (ngan-chi-tiet-ghim-thanh-cot), E6: the pin of the record panel is a choice of the person's interface, kept in
// one cookie that carries two numbers and nothing of the company's data (AC-6); its width bounds and the width from which
// the pin button shows (AC-1, AC-5).
import { describe, expect, it } from "vitest";

import {
  PIN_COOKIE,
  PIN_MIN_AREA,
  PIN_MIN_WIDTH,
  assertNoRecordData,
  clampPinWidth,
  pinAvailable,
  readPin,
  writePin,
} from "@/components/candidate/record-pin";

/** Every cookie value read here, written before the run, with what it must read as. */
const READS: ReadonlyArray<[string, { pinned: boolean; width: number | null }]> = [
  ["1:520", { pinned: true, width: 520 }],
  ["0:520", { pinned: false, width: 520 }],
  ["1:200", { pinned: false, width: null }],
  ["1:99999", { pinned: false, width: null }],
  ["1:abc", { pinned: false, width: null }],
  ["", { pinned: false, width: null }],
  ["x", { pinned: false, width: null }],
  ["1:520:MAU", { pinned: false, width: null }],
];

describe("readPin", () => {
  it("reads every value of the matrix as written", () => {
    expect(READS).toHaveLength(8);
    for (const [value, expected] of READS) expect(readPin(value), value).toEqual(expected);
  });

  it("reads a missing cookie as not pinned", () => {
    expect(readPin(undefined)).toEqual({ pinned: false, width: null });
  });
});

describe("writePin", () => {
  it("writes the state and the width, nothing else", () => {
    expect(writePin({ pinned: true, width: 520 })).toMatch(
      /^ho_so_ghim=1:520; path=\/; max-age=\d+; samesite=lax$/,
    );
    expect(writePin({ pinned: false, width: 433.6 })).toMatch(/^ho_so_ghim=0:434;/);
  });

  it("round-trips through readPin", () => {
    const line = writePin({ pinned: true, width: 612 });
    const value = line.slice(`${PIN_COOKIE}=`.length, line.indexOf(";"));
    expect(readPin(value)).toEqual({ pinned: true, width: 612 });
  });

  it("keeps the width it writes inside the bounds readPin accepts", () => {
    const line = writePin({ pinned: true, width: 10 });
    const value = line.slice(`${PIN_COOKIE}=`.length, line.indexOf(";"));
    expect(readPin(value)).toEqual({ pinned: true, width: PIN_MIN_WIDTH });
  });
});

describe("assertNoRecordData", () => {
  const recordId = "4d415500-0001-4000-8000-000000000001";

  it("passes the cookie the panel writes", () => {
    expect(() =>
      assertNoRecordData(writePin({ pinned: true, width: 520 }), recordId),
    ).not.toThrow();
  });

  it("fails a writer that carries the open record (break case)", () => {
    const leaky = `${writePin({ pinned: true, width: 520 })}; ${recordId}`;
    expect(() => assertNoRecordData(leaky, recordId)).toThrow("pin cookie carries record data");
  });
});

describe("clampPinWidth", () => {
  it("never narrower than 320 px", () => {
    expect(clampPinWidth(100, 1400)).toBe(PIN_MIN_WIDTH);
  });

  it("never wider than three fifths of the work area", () => {
    expect(clampPinWidth(5000, 1400)).toBe(840);
  });

  it("keeps a width inside the bounds", () => {
    expect(clampPinWidth(560.4, 1400)).toBe(560);
  });

  it("break case: a work area too small to hold both bounds is not one the pin shows on", () => {
    expect(PIN_MIN_WIDTH / 0.6).toBeLessThan(PIN_MIN_AREA);
    expect(pinAvailable(PIN_MIN_WIDTH / 0.6)).toBe(false);
  });
});

describe("pinAvailable", () => {
  it("shows the pin from a work area of 800 px: a 320 px column and a 480 px grid", () => {
    expect(PIN_MIN_AREA).toBe(800);
    expect(pinAvailable(799)).toBe(false);
    expect(pinAvailable(800)).toBe(true);
    expect(pinAvailable(1368)).toBe(true);
  });
});
