// Register-driven state suite, signed-in run (roadmap row 1r, AC-1, AC-2, AC-3): every screen of the register opens
// with the one test session made by phien.setup.ts, including screens that send signed-out people to sign-in. The
// suite itself lives in tools/e2e_templates/suite.ts.
// decision:state-matrix
// decision:wcag-aa
// decision:no-sideways-scroll
import { expect, test } from "@playwright/test";

import { loadRegister, SIGNED_OUT_SCREENS, skipReason } from "../../tools/e2e_templates/register";
import { registerSuite } from "../../tools/e2e_templates/suite";

/** Written before the code: the screens this run measures (built, staff or public, less the signed-out list). */
const MEASURED = ["today", "inventory", "sent", "tuy-chinh-san", "members"];

test("tap man do co phien", () => {
  const register = loadRegister();
  const measured = register.screens
    .filter((s) => skipReason(s, "co-phien") === null)
    .map((s) => s.id);
  expect(measured).toEqual(MEASURED);
  expect(Object.keys(SIGNED_OUT_SCREENS)).toEqual(["sign-in"]);
});

registerSuite({ mode: "co-phien" });
