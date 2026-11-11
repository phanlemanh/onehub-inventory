// The page to return to after signing in (row 1m, _acceptance/va-dang-nhap/evals.yaml E1). Matrix written before the
// fix: one case per form in docs/superpowers/specs/2026-11-11-va-dang-nhap-design.md — 14 bypass forms (L1..L14) and
// 4 valid forms (H1..H4) — plus two relation cases.
// Break run (2026-11-11): with the old safeNext pasted back into next-path.ts, «L6 tab giữa hai gạch» went red.
import { describe, expect, it } from "vitest";

import { safeNext } from "@/modules/identity";

const ORIGIN = "https://app.test";

interface Form {
  code: string;
  name: string;
  values: unknown[];
}

const BYPASS: readonly Form[] = [
  { code: "L1", name: "địa chỉ tuyệt đối", values: ["https://example.com"] },
  { code: "L2", name: "giao thức khác", values: ["javascript:alert(1)"] },
  { code: "L3", name: "hai gạch đầu", values: ["//example.com"] },
  { code: "L4", name: "gạch rồi gạch ngược", values: ["/\\example.com"] },
  { code: "L5", name: "gạch ngược đầu", values: ["\\/example.com"] },
  { code: "L6", name: "tab giữa hai gạch", values: ["/\t/example.com"] },
  { code: "L7", name: "xuống dòng LF giữa hai gạch", values: ["/\n/example.com"] },
  { code: "L8", name: "về đầu dòng CR giữa hai gạch", values: ["/\r/example.com"] },
  { code: "L9", name: "ký tự điều khiển khác", values: ["/\u0000/example.com"] },
  { code: "L10", name: "khoảng trắng đầu", values: [" //example.com"] },
  { code: "L11", name: "khoảng trắng Unicode giữa", values: ["/ /example.com"] },
  { code: "L12", name: "chuẩn hoá ra hai gạch", values: ["/..//example.com"] },
  { code: "L13", name: "gạch ngược giữa đường", values: ["/a\\..\\\\example.com"] },
  { code: "L14", name: "không phải chuỗi hay rỗng", values: [undefined, [], 42, ""] },
];

const VALID: readonly Form[] = [
  { code: "H1", name: "trang gốc", values: ["/"] },
  { code: "H2", name: "trang trong", values: ["/inventory"] },
  { code: "H3", name: "có truy vấn và neo", values: ["/inventory?q=S1&page=2#row-3"] },
  { code: "H4", name: "mã hoá phần trăm", values: ["/%2F%2Fexample.com"] },
];

/** The check shipped by row 8, kept verbatim as the control: the matrix must catch what it let through. */
function oldSafeNext(next: unknown): string {
  if (
    typeof next !== "string" ||
    !next.startsWith("/") ||
    next.startsWith("//") ||
    next.startsWith("/\\")
  ) {
    return "/";
  }
  return next;
}

function staysHome(result: string): boolean {
  return new URL(result, ORIGIN).origin === ORIGIN;
}

describe("đường trở về sau đăng nhập — một ca mỗi dạng", () => {
  it("ma trận có đúng 14 dạng lách và 4 dạng hợp lệ", () => {
    expect(BYPASS.map((f) => f.code)).toEqual(Array.from({ length: 14 }, (_, i) => `L${i + 1}`));
    expect(VALID.map((f) => f.code)).toEqual(["H1", "H2", "H3", "H4"]);
  });

  for (const form of BYPASS) {
    it(`${form.code} ${form.name}`, () => {
      for (const value of form.values) {
        expect(safeNext(value), `${form.code} ${form.name}`).toBe("/");
      }
    });
  }

  for (const form of VALID) {
    it(`${form.code} ${form.name}`, () => {
      for (const value of form.values) {
        expect(safeNext(value), `${form.code} ${form.name}`).toBe(value);
      }
    });
  }

  it("quan-he-cung-goc", () => {
    for (const form of [...BYPASS, ...VALID]) {
      for (const value of form.values) {
        expect(staysHome(safeNext(value)), `${form.code} ${form.name} rời trang`).toBe(true);
      }
    }
  });

  it("doi-chung-ban-cu", () => {
    const passed = BYPASS.filter((f) => f.values.some((v) => oldSafeNext(v) !== "/")).map(
      (f) => f.code,
    );
    const escaped = BYPASS.filter((f) => f.values.some((v) => !staysHome(oldSafeNext(v)))).map(
      (f) => f.code,
    );
    expect(passed, "bản cũ cho qua").toEqual(["L6", "L7", "L8", "L9", "L11", "L12", "L13"]);
    expect(escaped, "bản cũ đưa sang gốc khác").toEqual(["L6", "L7", "L8"]);
  });
});
