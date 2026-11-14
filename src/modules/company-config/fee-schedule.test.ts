// Row 19 (thue-phi), AC-1: NetToSeller and the limits of a fee schedule. The 64-cell table is written by hand before the
// code: law subset × own items switched on × own rate, for a list price of 3 tỷ, fees included.
import { describe, expect, it } from "vitest";

import { label } from "./index";
import {
  checkFeeDraft,
  defaultFeeSchedule,
  formatRatePercent,
  netToSeller,
  parseRatePercent,
  type FeeItemDraft,
  type FeeItemValue,
} from "./fee-schedule";

const PRICE = 3_000_000_000;

// [law items on, own items on, rate of each own item (basis points), net to seller in đồng]
const TABLE: [string, number, number, number][] = [
  ["none", 0, 0, 3_000_000_000],
  ["none", 0, 100, 3_000_000_000],
  ["none", 0, 250, 3_000_000_000],
  ["none", 0, 500, 3_000_000_000],
  ["none", 1, 0, 3_000_000_000],
  ["none", 1, 100, 2_970_000_000],
  ["none", 1, 250, 2_925_000_000],
  ["none", 1, 500, 2_850_000_000],
  ["none", 2, 0, 3_000_000_000],
  ["none", 2, 100, 2_940_000_000],
  ["none", 2, 250, 2_850_000_000],
  ["none", 2, 500, 2_700_000_000],
  ["none", 5, 0, 3_000_000_000],
  ["none", 5, 100, 2_850_000_000],
  ["none", 5, 250, 2_625_000_000],
  ["none", 5, 500, 2_250_000_000],
  ["pit", 0, 0, 2_940_000_000],
  ["pit", 0, 100, 2_940_000_000],
  ["pit", 0, 250, 2_940_000_000],
  ["pit", 0, 500, 2_940_000_000],
  ["pit", 1, 0, 2_940_000_000],
  ["pit", 1, 100, 2_910_000_000],
  ["pit", 1, 250, 2_865_000_000],
  ["pit", 1, 500, 2_790_000_000],
  ["pit", 2, 0, 2_940_000_000],
  ["pit", 2, 100, 2_880_000_000],
  ["pit", 2, 250, 2_790_000_000],
  ["pit", 2, 500, 2_640_000_000],
  ["pit", 5, 0, 2_940_000_000],
  ["pit", 5, 100, 2_790_000_000],
  ["pit", 5, 250, 2_565_000_000],
  ["pit", 5, 500, 2_190_000_000],
  ["registration", 0, 0, 2_985_000_000],
  ["registration", 0, 100, 2_985_000_000],
  ["registration", 0, 250, 2_985_000_000],
  ["registration", 0, 500, 2_985_000_000],
  ["registration", 1, 0, 2_985_000_000],
  ["registration", 1, 100, 2_955_000_000],
  ["registration", 1, 250, 2_910_000_000],
  ["registration", 1, 500, 2_835_000_000],
  ["registration", 2, 0, 2_985_000_000],
  ["registration", 2, 100, 2_925_000_000],
  ["registration", 2, 250, 2_835_000_000],
  ["registration", 2, 500, 2_685_000_000],
  ["registration", 5, 0, 2_985_000_000],
  ["registration", 5, 100, 2_835_000_000],
  ["registration", 5, 250, 2_610_000_000],
  ["registration", 5, 500, 2_235_000_000],
  ["both", 0, 0, 2_925_000_000],
  ["both", 0, 100, 2_925_000_000],
  ["both", 0, 250, 2_925_000_000],
  ["both", 0, 500, 2_925_000_000],
  ["both", 1, 0, 2_925_000_000],
  ["both", 1, 100, 2_895_000_000],
  ["both", 1, 250, 2_850_000_000],
  ["both", 1, 500, 2_775_000_000],
  ["both", 2, 0, 2_925_000_000],
  ["both", 2, 100, 2_865_000_000],
  ["both", 2, 250, 2_775_000_000],
  ["both", 2, 500, 2_625_000_000],
  ["both", 5, 0, 2_925_000_000],
  ["both", 5, 100, 2_775_000_000],
  ["both", 5, 250, 2_550_000_000],
  ["both", 5, 500, 2_175_000_000],
];

function scheduleOf(law: string, own: number, rate: number): FeeItemValue[] {
  return [
    { code: "pit", kind: "Law", rateBasisPoints: 200, included: law === "pit" || law === "both" },
    {
      code: "registration",
      kind: "Law",
      rateBasisPoints: 50,
      included: law === "registration" || law === "both",
    },
    // A switched-off own item at 5% must not count.
    { code: "off", kind: "Own", name: "Phí tắt", rateBasisPoints: 500, included: false },
    ...Array.from({ length: own }, (_, i) => ({
      code: "k" + i,
      kind: "Own" as const,
      name: "Phí " + i,
      rateBasisPoints: rate,
      included: true,
    })),
  ];
}

describe("ve-tay-bang-viet-truoc", () => {
  it("every cell of the table written beforehand", () => {
    let cells = 0;
    for (const [law, own, rate, want] of TABLE) {
      const got = netToSeller(PRICE, "Included", scheduleOf(law, own, rate));
      expect(got, `ve-tay-bang-viet-truoc: [${law}, ${own} × ${rate}] ${got}`).toBe(want);
      cells += 1;
    }
    console.log("ve-tay-bang-viet-truoc: " + cells + " ô");
    expect(cells).toBe(64);
  });
});

describe("ve-tay-bien", () => {
  const def = defaultFeeSchedule();
  it("the default schedule on 3 tỷ, fees included", () => {
    expect(netToSeller(PRICE, "Included", def)).toBe(2_895_000_000);
  });
  it("Excluded keeps the list price", () => {
    expect(netToSeller(PRICE, "Excluded", def)).toBe(PRICE);
  });
  it("1 đồng rounds down", () => {
    expect(netToSeller(1, "Included", def), "ve-tay-bien: 1 đồng").toBe(0);
    expect(netToSeller(999, "Included", def)).toBe(964);
  });
  it("no price is empty", () => {
    expect(netToSeller(null, "Included", def)).toBeNull();
    expect(netToSeller(undefined, "Excluded", def)).toBeNull();
  });
  it("no fee inclusion is empty, and so is a lease", () => {
    expect(netToSeller(PRICE, null, def)).toBeNull();
    expect(netToSeller(PRICE, undefined, def)).toBeNull();
    expect(netToSeller(PRICE, "Included", def, "lease")).toBeNull();
  });
});

const NAMES: Record<string, string> = {
  pit: label("PersonalIncomeTax"),
  registration: label("RegistrationFee"),
  brokerage: label("BrokerageFee"),
};
const nameOf = (c: string) => NAMES[c] ?? "";
const KNOWN = new Set(["brokerage", "k1", "k2", "k3", "k4"]);
const LAW: FeeItemDraft[] = [
  { code: "pit", rateBasisPoints: 200, included: true },
  { code: "registration", rateBasisPoints: 50, included: true },
];
const draft = (...own: FeeItemDraft[]): FeeItemDraft[] => [...LAW, ...own];
const brokerage = (rate: number, included = true): FeeItemDraft => ({
  code: "brokerage",
  rateBasisPoints: rate,
  included,
});

describe("kiem-muc-9-ca", () => {
  const cases: [string, FeeItemDraft[], string, number | undefined][] = [
    ["-10", draft(brokerage(-10)), "rate-below-zero", 2],
    ["510", draft(brokerage(510)), "rate-above-max", 2],
    ["125", draft(brokerage(125)), "rate-step", 2],
    [
      "tên rỗng",
      draft(brokerage(100), { name: "  ", rateBasisPoints: 10, included: true }),
      "name-empty",
      3,
    ],
    [
      "tên 41 ký tự",
      draft(brokerage(100), { name: "P".repeat(41), rateBasisPoints: 10, included: true }),
      "name-too-long",
      3,
    ],
    [
      "tên trùng",
      draft(brokerage(100), {
        name: label("BrokerageFee").toUpperCase(),
        rateBasisPoints: 10,
        included: true,
      }),
      "name-duplicate",
      3,
    ],
    [
      "khoản riêng thứ sáu",
      draft(
        brokerage(10),
        ...["k1", "k2", "k3", "k4"].map((c) => ({
          code: c,
          name: "Phí " + c,
          rateBasisPoints: 10,
          included: true,
        })),
        { name: "Phí sáu", rateBasisPoints: 10, included: true },
      ),
      "too-many-items",
      undefined,
    ],
    [
      "tổng 10,1%",
      draft(brokerage(500), { name: "Phí hồ sơ", rateBasisPoints: 260, included: true }),
      "total-above-max",
      undefined,
    ],
    [
      "không khoản nào bật",
      [
        { code: "pit", rateBasisPoints: 200, included: false },
        { code: "registration", rateBasisPoints: 50, included: false },
        brokerage(100, false),
      ],
      "nothing-included",
      undefined,
    ],
  ];
  for (const [name, d, problem, index] of cases) {
    it(name, () => {
      const got = checkFeeDraft(d, KNOWN, nameOf);
      expect(got, `kiem-muc-9-ca: ${name}`).toEqual([
        index === undefined ? { problem } : { problem, index },
      ]);
    });
  }
  it("the default schedule and a full valid one pass", () => {
    expect(checkFeeDraft(draft(brokerage(100)), KNOWN, nameOf)).toEqual([]);
    expect(
      checkFeeDraft(
        draft(brokerage(500), { name: "Phí hồ sơ", rateBasisPoints: 250, included: true }),
        KNOWN,
        nameOf,
      ),
    ).toEqual([]);
  });
});

describe("kiem-muc-khoan-luat", () => {
  it("a law item is never renamed, re-rated or left out", () => {
    expect(
      checkFeeDraft(
        [{ code: "pit", rateBasisPoints: 100, included: true }, LAW[1]!, brokerage(100)],
        KNOWN,
        nameOf,
      ),
    ).toEqual([{ problem: "law-item-fixed", index: 0 }]);
    expect(
      checkFeeDraft(
        [
          { code: "pit", name: "Thuế khác", rateBasisPoints: 200, included: true },
          LAW[1]!,
          brokerage(100),
        ],
        KNOWN,
        nameOf,
      ),
    ).toEqual([{ problem: "law-item-fixed", index: 0 }]);
    expect(checkFeeDraft([LAW[0]!, brokerage(100)], KNOWN, nameOf)).toEqual([
      { problem: "law-item-missing" },
    ]);
  });
  it("an own item the company does not have is refused", () => {
    expect(
      checkFeeDraft(draft({ code: "k9", rateBasisPoints: 10, included: true }), KNOWN, nameOf),
    ).toEqual([{ problem: "unknown-item", index: 2 }]);
  });
  it("a renamed default item takes its new name", () => {
    expect(checkFeeDraft(draft({ ...brokerage(100), name: "Phí hồ sơ" }), KNOWN, nameOf)).toEqual(
      [],
    );
  });
});

describe("doc-ti-le", () => {
  it("reads the Vietnamese way and refuses what is not a rate", () => {
    expect(parseRatePercent("1,5")).toBe(150);
    expect(parseRatePercent("1.5")).toBe(150);
    expect(parseRatePercent("2")).toBe(200);
    expect(parseRatePercent("0,25")).toBe(25);
    expect(parseRatePercent("-0,1")).toBe(-10);
    expect(parseRatePercent("1,5%")).toBeNull();
    expect(parseRatePercent("")).toBeNull();
    expect(parseRatePercent("1,255")).toBeNull();
    expect(formatRatePercent(150)).toBe("1,5");
    expect(formatRatePercent(200)).toBe("2");
    expect(formatRatePercent(50)).toBe("0,5");
  });
});
