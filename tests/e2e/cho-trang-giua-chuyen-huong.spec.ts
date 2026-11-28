// The page wait while a redirect lands (S4-r2 of row 3h, G-2811-106). On a loaded machine the signed-out run's redirect
// to sign-in came while `pageReady` read the page, between two documents: the read threw `Cannot read properties of null
// (reading 'hasAttribute')` and the frame case of the file import screen went red. This proves, on pages served here:
// - a page with no root for a while is «not ready», read again until its root comes back; the old read (written here
//   again, as the red case) throws on that same page;
// - a screen that drops its root and then redirects to sign-in is handed over to the signed-in run, both when the
//   sign-in page is taken over at once and when what was awaited (the screen's region) never comes there.
// The measure is unchanged: a page is ready on the same four marks, and a screen is handed over only when the browser is
// on the sign-in page.
import { expect, test, type Page } from "@playwright/test";

import { FRAME } from "../../tools/e2e_templates/recipes";
import { runMain, type Base } from "../../tools/e2e_templates/runner";
import { pageReady } from "./sua-trang";

const RECIPE = FRAME.find((r) => r.id === "khong-loi-trinh-duyet")!;
const BASE: Base = { screen: "thu-chuyen-huong", title: null, cpu: 0, mode: "khong-phien" };

/** A page that takes its root away, then after `backMs` puts it back hydrated or goes to `then`. */
const ROOTLESS = (body: string, after: string) => `<!doctype html><html><body>${body}<script>
setTimeout(() => {
  const root = document.documentElement;
  document.removeChild(root);
  window.__rootless = true;
  ${after}
}, 0);
</script></body></html>`;

/** A sign-in page whose main and heading React has taken over (the mark `pageReady` reads on the element), or not. */
const SIGN_IN = (
  takenOver: boolean,
) => `<!doctype html><html data-hydrated><body><main><h1>Đăng nhập</h1></main>
<script>${takenOver ? 'for (const n of document.querySelectorAll("main, h1")) n.__reactFiber$thu = {};' : ""}</script></body></html>`;

async function serve(page: Page, screen: string, signIn: string): Promise<void> {
  await page.route("**/thu-chuyen-huong", (r) =>
    r.fulfill({ contentType: "text/html", body: screen }),
  );
  await page.route("**/login", (r) => r.fulfill({ contentType: "text/html", body: signIn }));
}

// eslint-disable-next-line no-empty-pattern -- Playwright needs a destructured first argument
test.beforeEach(({}, info) => {
  test.skip(info.project.name !== "1440", "do o kho 1440");
});

test("a page with no root is not ready yet; the wait reads again until its root is back", async ({
  page,
}) => {
  await serve(
    page,
    ROOTLESS(
      "<main>thu</main>",
      'setTimeout(() => { document.appendChild(root); root.setAttribute("data-hydrated", ""); }, 1500);',
    ),
    SIGN_IN(true),
  );
  await page.goto("/thu-chuyen-huong");
  await page.waitForFunction(() => (window as unknown as { __rootless?: boolean }).__rootless);
  // The red case: the read as it was before the fix throws on this page.
  await expect(
    page.evaluate(() => document.documentElement.hasAttribute("data-hydrated")),
  ).rejects.toThrow(/reading 'hasAttribute'/);
  const started = Date.now();
  await pageReady(page, { timeout: 10_000 });
  expect(Date.now() - started, "the wait returned before the root came back").toBeGreaterThan(500);
});

test("a screen that redirects to sign-in mid-wait is handed over, the sign-in page taken over at once", async ({
  page,
}) => {
  await serve(
    page,
    ROOTLESS("<main>thu</main>", 'setTimeout(() => location.replace("/login"), 800);'),
    SIGN_IN(true),
  );
  expect(await runMain(page, "/thu-chuyen-huong", RECIPE, BASE)).toBe("giao");
  expect(new URL(page.url()).pathname).toBe("/login");
});

test("a screen whose region never comes back because it went to sign-in is handed over, not red", async ({
  page,
}) => {
  test.setTimeout(90_000);
  await serve(
    page,
    ROOTLESS(
      '<main><div data-slot="data-region" data-hydrated>thu</div></main>',
      'setTimeout(() => location.replace("/login"), 800);',
    ),
    SIGN_IN(false),
  );
  expect(await runMain(page, "/thu-chuyen-huong", RECIPE, BASE)).toBe("giao");
  expect(new URL(page.url()).pathname).toBe("/login");
});
