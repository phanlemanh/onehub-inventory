import { describe, expect, it } from "vitest";

import { ownErrors } from "../tools/typecheck_own.mjs";

describe("own-code type check", () => {
  it("keeps errors in the repo's own code", () => {
    const line = "src/modules/listings/index.ts(1,1): error TS2532: Object is possibly undefined.";
    expect(ownErrors(line)).toEqual([line]);
  });

  it("leaves out vendor files", () => {
    const output =
      "src/components/reui/filters/a.tsx(1,1): error TS2532: x\n" +
      "src/components/ui/b.tsx(1,1): error TS2532: x\n" +
      "  continuation line";
    expect(ownErrors(output)).toEqual([]);
  });
});
