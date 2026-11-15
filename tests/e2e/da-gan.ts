// Wait until React has hydrated an element (row 1u). A test that changes the page — an inline style, or a screenshot,
// which hides the caret by setting an inline style on every input — before React hydrates it makes React report
// «A tree hydrated but some attributes … didn't match», and the hydration guard turns the run red. The element being
// in the server's HTML is not enough: React's own key on it is what says it is hydrated (as waitReady does in
// tools/e2e_templates/runner.ts).
import type { Locator } from "@playwright/test";

export async function daGan(el: Locator): Promise<void> {
  await el.first().waitFor({ state: "attached" });
  await el.first().evaluate(
    (node) =>
      new Promise<void>((resolve, reject) => {
        const started = Date.now();
        const tick = () => {
          if (Object.keys(node).some((k) => k.startsWith("__reactFiber"))) resolve();
          else if (Date.now() - started > 30_000)
            reject(new Error("da-gan: React chua gan phan tu"));
          else setTimeout(tick, 50);
        };
        tick();
      }),
  );
}
