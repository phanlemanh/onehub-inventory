// decision:state-matrix
// decision:table-density
// decision:wcag-aa
// decision:no-sideways-scroll
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const GRID = "/proto/luoi-va-o-theo-kieu";
const PHONE = new Set(["360", "414"]);
const TOTAL = 120;

const region = (page: Page) => page.locator('[data-slot="data-region"]');
const bodyRows = (page: Page) => page.locator('[data-slot="data-region-body"] tbody tr');

async function openGrid(page: Page, query = ""): Promise<void> {
  await page.goto(`${GRID}${query}`);
  await expect(page.locator("h2")).toHaveText("Vùng mẫu");
  // A slow server streams the page: until React swaps it in, a hidden copy (`<div hidden id="S:0">`) sits next to
  // the shown one. Wait for the swap so every check below sees one grid.
  await expect(page.locator('[hidden][id^="S:"]')).toHaveCount(0);
  // Once hydrated, the grid's sideways scroll area takes keyboard focus (WCAG 2.1.1).
  const viewport = page
    .locator('[data-slot="data-region-body"] [data-slot="scroll-area-viewport"]')
    .filter({ visible: true });
  if ((await viewport.count()) > 0) await expect(viewport).toHaveAttribute("tabindex", "0");
}

async function seriousViolations(page: Page): Promise<string[]> {
  const { violations } = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .exclude("nextjs-portal")
    .analyze();
  return violations
    .filter((v) => v.impact === "serious" || v.impact === "critical")
    .map((v) => v.id);
}

// ---- checks shared by a case and its control ------------------------------------------------------------------

async function assertNoMatchExit(page: Page): Promise<void> {
  if ((await page.getByRole("button", { name: "Xoá lọc" }).count()) !== 1) {
    throw new Error("no-match exit missing");
  }
}

async function assertState(page: Page, kind: string): Promise<void> {
  const shown = await page.locator(`[data-slot="region-state"][data-kind="${kind}"]`).count();
  if (shown !== 1) throw new Error(`region state not shown: ${kind}`);
}

async function assertSkeletonHiddenEarly(page: Page): Promise<void> {
  const visibility = await page
    .locator('[data-slot="region-skeleton"]')
    .evaluate((el) => getComputedStyle(el).visibility);
  if (visibility !== "hidden") throw new Error("skeleton shown before 1s");
}

async function assertDensity(page: Page, height: number, fontPx: string): Promise<void> {
  const row = bodyRows(page).first();
  const box = await row.boundingBox();
  const font = await row
    .locator("td")
    .first()
    .evaluate((el) => getComputedStyle(el).fontSize);
  if (!box || Math.round(box.height) !== height || font !== fontPx) {
    throw new Error(`density not applied: ${box?.height}px ${font}`);
  }
}

// ---- cases -----------------------------------------------------------------------------------------------------

test.describe("grid", () => {
  test.setTimeout(90_000);

  test("search filters rows and the count follows", async ({ page }) => {
    await openGrid(page);
    await expect(region(page).locator('[data-slot="region-count"]')).toHaveText(`${TOTAL} dòng`);
    await page.getByRole("searchbox", { name: "Tìm trong vùng" }).fill("S1.01");
    const count = region(page).locator('[data-slot="region-count"]');
    await expect(count).toHaveText(new RegExp(`^\\d+ / ${TOTAL} dòng$`));
    const shown = Number((await count.textContent())?.split(" ")[0]);
    expect(shown).toBeGreaterThan(0);
    expect(shown).toBeLessThanOrEqual(50);
    // Every row left matches, and the count is exactly the rows left.
    const codes = await bodyRows(page).locator("td:first-child").allTextContents();
    expect(codes).toHaveLength(shown);
    for (const code of codes) expect(code).toContain("S1.01");
  });

  test("no match offers clear filter and it restores every row", async ({ page }) => {
    await openGrid(page);
    await page.getByRole("searchbox", { name: "Tìm trong vùng" }).fill("khong-co-dong-nao");
    await expect(page.getByText("Không có dòng nào khớp")).toBeVisible();
    await assertNoMatchExit(page);
    await page.getByRole("button", { name: "Xoá lọc" }).click();
    await expect(region(page).locator('[data-slot="region-count"]')).toHaveText(`${TOTAL} dòng`);
    await expect(page.getByRole("searchbox", { name: "Tìm trong vùng" })).toHaveValue("");
    await expect(bodyRows(page)).toHaveCount(50);
  });

  test("no-match check fails without the clear button", async ({ page }) => {
    await openGrid(page);
    await page.getByRole("searchbox", { name: "Tìm trong vùng" }).fill("khong-co-dong-nao");
    await expect(page.getByText("Không có dòng nào khớp")).toBeVisible();
    await page.getByRole("button", { name: "Xoá lọc" }).evaluate((el) => el.remove());
    await expect(assertNoMatchExit(page)).rejects.toThrow("no-match exit missing");
  });

  test("loading shows nothing before 1s then skeleton rows", async ({ page }) => {
    // The region times its loading steps on its own clock (src/components/candidate/region-state.tsx); the test
    // drives that clock so the check does not depend on how fast the machine is.
    await page.clock.install();
    await page.goto(`${GRID}?state=loading`);
    const skeleton = page.locator('[data-slot="region-skeleton"]');
    await skeleton.waitFor({ state: "attached" });
    await page.clock.runFor(500);
    await assertSkeletonHiddenEarly(page);
    await page.clock.runFor(600);
    await expect(skeleton).toHaveCSS("visibility", "visible");
    await expect(skeleton).toHaveAttribute("data-columns", "9");
  });

  test("skeleton check fails when the delay is removed", async ({ page }) => {
    await page.clock.install();
    await page.goto(`${GRID}?state=loading`);
    const skeleton = page.locator('[data-slot="region-skeleton"]');
    await skeleton.waitFor({ state: "attached" });
    await skeleton.evaluate((el) => el.classList.remove("invisible"));
    await expect(assertSkeletonHiddenEarly(page)).rejects.toThrow("skeleton shown before 1s");
  });

  test("error explains and retries", async ({ page }) => {
    await openGrid(page, "?state=error");
    await assertState(page, "error");
    await expect(region(page).locator('[data-part="why"]')).toBeVisible();
    await expect(region(page).locator('[data-part="next"]')).toBeVisible();
    await page.getByRole("button", { name: "Thử lại" }).click();
    await expect(bodyRows(page).first()).toBeVisible();
    await expect(page.getByRole("button", { name: "Mở hoặc đóng thanh bên" })).toBeVisible();
  });

  test("empty says why and offers the next step", async ({ page }) => {
    await openGrid(page, "?state=empty");
    await assertState(page, "empty");
    await expect(page.getByText("Chưa có dòng nào được nhập vào vùng này.")).toBeVisible();
    await expect(page.getByRole("button", { name: "Nhập tệp Excel" })).toBeVisible();
  });

  test("partial failure keeps loaded rows and offers retry", async ({ page }) => {
    await openGrid(page, "?state=partial");
    await assertState(page, "partial");
    await expect(bodyRows(page).first()).toBeVisible();
    await expect(region(page).getByText("40 dòng")).toBeVisible();
    await expect(
      region(page).getByRole("status").getByRole("button", { name: "Thử lại" }),
    ).toBeVisible();
  });

  test("forbidden shows no rows and no count", async ({ page }) => {
    await openGrid(page, "?state=forbidden");
    await assertState(page, "forbidden");
    await expect(bodyRows(page)).toHaveCount(0);
    await expect(region(page).locator('[data-slot="region-count"]')).toHaveCount(0);
    await expect(page.getByRole("searchbox")).toHaveCount(0);
  });

  for (const kind of ["error", "empty", "partial", "forbidden"]) {
    test(`region-state check fails on a ready region: ${kind}`, async ({ page }) => {
      await openGrid(page);
      await expect(bodyRows(page).first()).toBeVisible();
      await expect(assertState(page, kind)).rejects.toThrow(`region state not shown: ${kind}`);
    });
  }

  async function assertLongTextReadable(page: Page): Promise<void> {
    const cut = page.locator('[data-slot="truncated-text"][data-cut="true"]').first();
    if ((await cut.getAttribute("tabindex")) !== "0")
      throw new Error("long text not reachable by keyboard");
    await cut.focus();
    const shown = await cut.evaluate((el) => ({
      wraps: getComputedStyle(el).whiteSpace !== "nowrap",
      fits: el.scrollWidth <= el.clientWidth,
      full: el.textContent,
      title: el.getAttribute("title"),
    }));
    if (!shown.wraps || !shown.fits || shown.full !== shown.title) {
      throw new Error("long text not readable on focus");
    }
  }

  test("long text is cut but reads in full on keyboard focus", async ({ page }) => {
    await openGrid(page);
    await expect(
      page.locator('[data-slot="truncated-text"][data-cut="true"]').first(),
    ).toBeAttached();
    await page.keyboard.press("Tab"); // keyboard modality, so :focus-visible applies to focus() below
    await assertLongTextReadable(page);
    // A short value that fits takes no Tab stop.
    const short = page.locator('[data-slot="truncated-text"]:not([data-cut])').first();
    await expect(short).not.toHaveAttribute("tabindex", "0");
  });

  test("long-text check fails when the cut cell cannot take focus", async ({ page }) => {
    await openGrid(page);
    const cut = page.locator('[data-slot="truncated-text"][data-cut="true"]').first();
    await expect(cut).toBeAttached();
    await cut.evaluate((el) => el.removeAttribute("tabindex"));
    await expect(assertLongTextReadable(page)).rejects.toThrow(
      "long text not reachable by keyboard",
    );
  });

  test("many columns on a phone render dense", async ({ page }, info) => {
    test.skip(!PHONE.has(info.project.name), "desktop");
    await openGrid(page);
    await expect(bodyRows(page).first()).toBeVisible();
    await expect(page.locator('[data-slot="data-region-body"]')).toHaveAttribute(
      "data-density",
      "dense",
    );
    await assertDensity(page, 40, "14px");
  });

  test("few columns on a wide screen render normal", async ({ page }, info) => {
    test.skip(info.project.name !== "1440", "wide screen only");
    await openGrid(page, "?columns=few");
    await expect(bodyRows(page).first()).toBeVisible();
    await expect(page.locator('[data-slot="data-region-body"]')).toHaveAttribute(
      "data-density",
      "normal",
    );
    await assertDensity(page, 48, "16px");
  });

  test("density check fails when normal rows are forced on a dense grid", async ({
    page,
  }, info) => {
    test.skip(!PHONE.has(info.project.name), "desktop");
    await openGrid(page);
    await expect(bodyRows(page).first()).toBeVisible();
    await bodyRows(page).evaluateAll((rows) => {
      for (const row of rows) {
        row.classList.remove("h-10", "text-sm");
        row.classList.add("h-12", "text-base");
        for (const cell of row.querySelectorAll("td"))
          (cell as HTMLElement).style.fontSize = "16px";
      }
    });
    await expect(assertDensity(page, 40, "14px")).rejects.toThrow("density not applied");
  });

  test("the page never scrolls sideways", async ({ page }) => {
    await openGrid(page);
    await expect(bodyRows(page).first()).toBeVisible();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test("no serious accessibility violations in every region state", async ({ page }) => {
    test.setTimeout(240_000);
    /** Written before the code: 7 states, each scanned in light and in dark. */
    const STATES = [
      "",
      "?state=loading",
      "?state=empty",
      "?state=error",
      "no-match",
      "?state=partial",
      "?state=forbidden",
    ];
    expect(STATES).toHaveLength(7);
    let scans = 0;
    const found: Record<string, string[]> = {};
    for (const colorScheme of ["light", "dark"] as const) {
      await page.emulateMedia({ colorScheme });
      for (const state of STATES) {
        if (state === "no-match") {
          await openGrid(page);
          await page.getByRole("searchbox", { name: "Tìm trong vùng" }).fill("khong-co-dong-nao");
          await expect(page.getByText("Không có dòng nào khớp")).toBeVisible();
        } else {
          await openGrid(page, state);
          if (state === "?state=loading")
            await expect(page.locator('[data-slot="region-skeleton"]')).toBeVisible();
        }
        const ids = await seriousViolations(page);
        if (ids.length > 0) found[`${colorScheme} ${state || "data"}`] = ids;
        scans += 1;
      }
    }
    expect(found).toEqual({});
    expect(scans).toBe(14);
  });

  test("accessibility check fails on a cell with unreadable text", async ({ page }) => {
    await openGrid(page);
    const cell = bodyRows(page).first().locator('[data-slot="typed-cell"]').first();
    // The grid re-renders once it has measured its width: break the colour until it sticks.
    await expect(async () => {
      await cell.evaluate((el) => {
        el.style.transition = "none";
        el.style.backgroundColor = "rgb(255, 255, 255)";
        el.style.color = "rgb(250, 250, 250)";
      });
      await expect(cell).toHaveCSS("color", "rgb(250, 250, 250)", { timeout: 500 });
    }).toPass({ timeout: 10_000 });
    expect(await seriousViolations(page)).toContain("color-contrast");
  });
});
