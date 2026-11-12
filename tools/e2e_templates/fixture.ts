// The browser tests' `test`, with each page slowed when E2E_CPU_THROTTLE is set (roadmap row 1r, AC-8). The slowing
// is the register-driven suite's own (row 1f): it proves the page really runs at least 2.5 times slower, or the test
// fails `ham cpu khong co tac dung` and does not count as a slowed run.
import { test as base } from "@playwright/test";

import { throttle, throttled } from "./runner";

if (throttled) console.log(`ham cpu: ${throttled}`);

export const test = base.extend({
  page: async ({ page }, provide) => {
    await throttle(page);
    await provide(page);
  },
});

export { expect } from "@playwright/test";
