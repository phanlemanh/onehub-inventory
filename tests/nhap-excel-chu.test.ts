// Row 11 (nhap-excel, AC-12): the words of the import screen that carry a number or a name say it, once and in place.
import { describe, expect, it } from "vitest";

import { IMPORT_COPY as C } from "@/modules/imports/ui/copy";

describe("chu-man-nap-tep", () => {
  it("counts and names are said in the sentence", () => {
    expect(C.blocked(3)).toBe("Còn 3 chỗ chặn");
    expect(C.cells(12)).toBe("12 ô");
    expect(C.keptCells(2)).toBe("2 ô giữ chữ gốc của tệp");
    expect(C.learnLabel("Block")).toBe("Gọi cột này là «Block» trên bảng");
    expect(C.inColumn("ĐN", "Hướng", 37)).toBe("«ĐN» ở cột Hướng · 37 ô");
  });

  it("Áp names the kept cells only when there are some", () => {
    expect(C.apply(5, 0)).toBe("Áp 5 dòng");
    expect(C.apply(5, 2)).toBe("Áp 5 dòng · 2 ô giữ chữ gốc");
  });

  it("an undo that kept edited units names each of them", () => {
    expect(C.undoneKept(["S1 01-0905", "S2 02-1101"])).toBe(
      "Đã hoàn tác lần nạp tệp. Còn 2 căn chưa gỡ vì đã có người sửa sau lần nạp tệp: S1 01-0905, S2 02-1101.",
    );
  });
});
