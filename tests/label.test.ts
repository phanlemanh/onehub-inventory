// decision:label-lookup
import { describe, expect, it } from "vitest";

import { label } from "../src/modules/company-config/index";

describe("label", () => {
  it("returns the preferred label", () => {
    expect(label("ListAgent")).toBe("Đầu chủ");
  });

  it("prefers the label a company has chosen", () => {
    expect(label("ListAgent", { overrides: { ListAgent: "Môi giới bên bán" } })).toBe(
      "Môi giới bên bán",
    );
  });

  it("switches sale wording for a lease", () => {
    expect(label("StatusActive")).toBe("Đang bán");
    expect(label("StatusActive", { transaction: "lease" })).toBe("Đang cho thuê");
  });

  it("keeps labels that do not depend on the transaction", () => {
    expect(label("StatusHold", { transaction: "lease" })).toBe("Tạm ngừng");
  });
});
