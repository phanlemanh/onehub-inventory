// The grid probe of the register-driven suite decides once whether a screen sent the browser to sign-in or shows its
// grid (tools/e2e_templates/suite.ts). On a loaded machine the redirect to sign-in came after the probe's first read,
// so the probe read the screen as grid-less and failed a whole region block («chua co vung du lieu»). `landing` waits
// for one of the two outcomes. Each case runs on pages served here, so the timing is the case's own.
import { classifyGrid, readGrid } from "../../tools/e2e_templates/recipes";
import { expect, test } from "../../tools/e2e_templates/fixture";
import { followRedirect, landing, sentToSignIn } from "../../tools/e2e_templates/runner";

const ORIGIN = "http://probe.test";
const LATE_MS = 1_500;

const PAGES: Record<string, string> = {
  // Sends the browser to sign-in only after a while, as a screen did on a loaded machine.
  "/late-sign-in": `<main>…</main><script>setTimeout(() => location.assign("/login"), ${LATE_MS})</script>`,
  // Shows its grid only after a while.
  "/late-grid": `<main>…</main><script>setTimeout(() => { document.querySelector("main").innerHTML =
    '<div data-slot="data-region"><table><tr><td>1</td></tr></table></div>'; }, ${LATE_MS})</script>`,
  "/login": "<main><h1>sign in</h1></main>",
};

test.describe("landing of the grid probe", () => {
  test.setTimeout(60_000);
  test.beforeEach(async ({ page }) => {
    await page.route(`${ORIGIN}/**`, (route) => {
      const body = PAGES[new URL(route.request().url()).pathname];
      return body
        ? route.fulfill({
            contentType: "text/html",
            body: `<!doctype html><html><body>${body}</body></html>`,
          })
        : route.fulfill({ status: 404, body: "" });
    });
  });

  test("a late redirect to sign-in is read as sign-in", async ({ page }) => {
    await page.goto(`${ORIGIN}/late-sign-in`);
    expect(await landing(page, "/late-sign-in")).toBe("sign-in");
  });

  test("break: the probe's old reading calls the same screen grid-less", async ({ page }) => {
    await page.goto(`${ORIGIN}/late-sign-in`);
    await followRedirect(page);
    expect(sentToSignIn(page, "/late-sign-in")).toBe(false);
    const grid = await readGrid(page);
    expect(new URL(page.url()).pathname).toBe("/login");
    expect(() => classifyGrid("man-thu", grid)).toThrow("chua co vung du lieu: man-thu");
  });

  test("a grid that shows late is read as the page, with its grid", async ({ page }) => {
    await page.goto(`${ORIGIN}/late-grid`);
    expect(await landing(page, "/late-grid")).toBe("page");
    expect(classifyGrid("man-thu", await readGrid(page))).toEqual({ run: true });
  });

  test("the sign-in page opened on purpose is the page itself", async ({ page }) => {
    await page.goto(`${ORIGIN}/login`);
    expect(await landing(page, "/login", 2_000)).toBe("page");
  });
});
