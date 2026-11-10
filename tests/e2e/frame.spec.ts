// decision:theme-modes
// decision:mobile-navigation
// decision:notification-channel
// decision:status-tone
// decision:one-main-one-h1
// decision:wcag-aa
import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const PROTO = "/proto/khung-va-giao-dien";
const MENDED_FLAG = "frame-proto-mended";
const SCREENS = [
  { href: "/", title: "Hôm nay" },
  { href: "/inventory", title: "Bảng hàng" },
  { href: "/sent", title: "Đã gửi" },
] as const;
const PHONE = new Set(["360", "414"]);

/** Every displayed and alternative label of the dictionary, read from the file, not copied by hand. */
function dictionaryTerms(): string[] {
  const script = [
    "import json, sys",
    "sys.path.insert(0, 'tools')",
    "from pathlib import Path",
    "from repo_ontology import load_yaml_file",
    "c = load_yaml_file(Path('ontology/labels.yaml'))['concepts']",
    "print(json.dumps([t for v in c.values() for t in [v['pref'], v.get('lease'), *(v.get('alt') or [])] if t]))",
  ].join("\n");
  return JSON.parse(
    execFileSync("python3", ["-c", script], { cwd: ROOT, encoding: "utf8" }),
  ) as string[];
}

function axe(page: Page) {
  return new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .exclude("nextjs-portal");
}

async function seriousViolations(page: Page): Promise<string[]> {
  const { violations } = await axe(page).analyze();
  return violations
    .filter((v) => v.impact === "serious" || v.impact === "critical")
    .map((v) => v.id);
}

// ---- checks shared by a real case and its control -------------------------------------------------------------

async function assertCurrentScreen(page: Page, href: string, title: string): Promise<void> {
  const marked = await page
    .locator('[aria-current="page"]')
    .evaluateAll((els) => els.map((el) => el.getAttribute("href")));
  if (marked.length !== 1 || marked[0] !== href) {
    throw new Error(`current screen mark: expected ${href}, found ${JSON.stringify(marked)}`);
  }
  if ((await page.locator("main").count()) !== 1) throw new Error("current screen: not one main");
  const h1 = page.locator("h1");
  if ((await h1.count()) !== 1 || (await h1.textContent()) !== title) {
    throw new Error(`current screen: h1 is not "${title}"`);
  }
  if ((await page.title()) !== `${title} · OneHub`) {
    throw new Error(`current screen: tab title is "${await page.title()}"`);
  }
}

async function assertSkipLink(page: Page): Promise<void> {
  const target = await page.evaluate(() => {
    const link = document.querySelector<HTMLAnchorElement>('a[href^="#"]');
    const id = link?.getAttribute("href")?.slice(1) ?? "";
    return { id, exists: id !== "" && document.getElementById(id)?.tagName === "MAIN" };
  });
  if (!target.exists) throw new Error(`skip link target missing: #${target.id}`);
}

async function assertNoSidewaysScroll(page: Page): Promise<void> {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  if (overflow > 0) throw new Error(`sideways scroll: ${overflow}px`);
}

async function assertErrorState(page: Page): Promise<void> {
  const shown =
    (await page.locator('[data-slot="page-state"][data-kind="error"]').count()) === 1 &&
    (await page.locator('[data-part="why"]').count()) === 1 &&
    (await page.locator('[data-part="next"]').count()) === 1 &&
    (await page.getByRole("button", { name: "Thử lại" }).count()) === 1;
  if (!shown) throw new Error("error state not shown");
}

async function assertNoInternalFrame(page: Page, terms: readonly string[]): Promise<void> {
  const sidebar = await page.locator("[data-sidebar]").count();
  const text = await page.locator("body").innerText();
  const leaked = terms.filter((term) => text.includes(term));
  if (sidebar > 0 || leaked.length > 0) {
    throw new Error(`internal frame found: sidebar ${sidebar}, labels ${JSON.stringify(leaked)}`);
  }
}

async function assertSkeletonAfterOneSecond(page: Page): Promise<void> {
  const shown = await page
    .locator('[data-slot="page-skeleton"]')
    .waitFor({ state: "visible", timeout: 3000 })
    .then(() => true)
    .catch(() => false);
  if (!shown) throw new Error("no skeleton after 1s");
}

async function assertBanner(page: Page, text: string): Promise<void> {
  const banner = page.getByRole("alert").filter({ hasText: text });
  if ((await banner.count()) !== 1) throw new Error(`banner missing: ${text}`);
}

async function openSheet(page: Page): Promise<void> {
  await page.getByRole("button", { name: "Mở hoặc đóng thanh bên" }).click();
  await page.locator('[data-mobile="true"]').waitFor({ state: "visible" });
  // Wait for the slide-in to finish: a half-faded sheet is not what the person reads.
  await page.waitForFunction(() =>
    document.getAnimations().every((a) => a.playState !== "running"),
  );
}

// ---- cases ------------------------------------------------------------------------------------------------------

test.describe("frame", () => {
  test.setTimeout(90_000);

  test("marks the current screen and names the tab", async ({ page }, info) => {
    for (const screen of SCREENS) {
      await page.goto(screen.href);
      await expect(page.locator("h1")).toHaveText(screen.title);
      // On a phone the navigation lives in the sheet: open it to see the mark.
      if (PHONE.has(info.project.name)) await openSheet(page);
      await assertCurrentScreen(page, screen.href, screen.title);
    }
  });

  test("current-screen check fails when the mark is moved", async ({ page }, info) => {
    await page.goto("/inventory");
    await expect(page.locator("h1")).toBeVisible();
    if (PHONE.has(info.project.name)) await openSheet(page);
    await page.evaluate(() => {
      document.querySelector('[aria-current="page"]')?.removeAttribute("aria-current");
      document.querySelector('a[href="/sent"]')?.setAttribute("aria-current", "page");
    });
    await expect(assertCurrentScreen(page, "/inventory", "Bảng hàng")).rejects.toThrow(
      "current screen mark",
    );
  });

  test("first Tab reaches the skip link and it moves focus to main", async ({ page }) => {
    await page.goto("/inventory");
    await expect(page.locator("h1")).toBeVisible();
    await assertSkipLink(page);
    await page.keyboard.press("Tab");
    await expect(page.locator(":focus")).toHaveText("Bỏ qua tới nội dung chính");
    await page.keyboard.press("Enter");
    await expect.poll(() => page.evaluate(() => document.activeElement?.tagName)).toBe("MAIN");
  });

  test("skip-link check fails without a target", async ({ page }) => {
    await page.goto("/inventory");
    await expect(page.locator("h1")).toBeVisible();
    await page.evaluate(() => document.querySelector("main")?.removeAttribute("id"));
    await expect(assertSkipLink(page)).rejects.toThrow("skip link target");
  });

  test("phone sidebar opens as a sheet and closes after choosing", async ({ page }, info) => {
    test.skip(!PHONE.has(info.project.name), "desktop");
    await page.goto("/");
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.getByRole("link", { name: "Bảng hàng" })).toBeHidden();
    await page.getByRole("button", { name: "Mở hoặc đóng thanh bên" }).click();
    const sheet = page.locator('[data-mobile="true"]');
    await expect(sheet).toBeVisible();
    await sheet.getByRole("link", { name: "Bảng hàng" }).click();
    await expect(page).toHaveURL(/\/inventory$/);
    await expect(sheet).toBeHidden();
  });

  test("does not scroll sideways", async ({ page }) => {
    for (const href of ["/", "/inventory", "/sent", PROTO, `${PROTO}?state=error`]) {
      await page.goto(href);
      await expect(page.locator("h1")).toBeVisible();
      await assertNoSidewaysScroll(page);
    }
  });

  test("sideways check fails on a page wider than the screen", async ({ page }) => {
    await page.goto("/inventory");
    await expect(page.locator("h1")).toBeVisible();
    await page.evaluate(() => {
      const wide = document.createElement("div");
      wide.style.width = "2000px";
      wide.style.height = "1px";
      document.body.append(wide);
    });
    await expect(assertNoSidewaysScroll(page)).rejects.toThrow("sideways scroll");
  });

  test("a broken screen keeps the frame and offers retry", async ({ page }) => {
    await page.goto(`${PROTO}?state=error`);
    await expect(page.locator("h1")).toHaveText("Màn này chưa hiện được");
    await assertErrorState(page);
    await expect(page.getByRole("button", { name: "Mở hoặc đóng thanh bên" })).toBeVisible();
    await page.evaluate((flag) => window.sessionStorage.setItem(flag, "1"), MENDED_FLAG);
    await page.getByRole("button", { name: "Thử lại" }).click();
    await expect(page.locator("h1")).toHaveText("Bản mẫu khung");
  });

  test("error-state check fails on a screen that did not break", async ({ page }) => {
    await page.goto(PROTO);
    await expect(page.locator("h1")).toHaveText("Bản mẫu khung");
    await expect(assertErrorState(page)).rejects.toThrow("error state not shown");
  });

  test("an unknown address says not found without the internal frame", async ({ page }) => {
    const response = await page.goto("/no-such-page");
    expect(response?.status()).toBe(404);
    await expect(page.locator("h1")).toHaveText("Không tìm thấy trang");
    await expect(page.getByRole("link", { name: "Về trang đầu" })).toHaveAttribute("href", "/");
    expect(await page.title()).toMatch(/^Không tìm thấy trang/);
    await assertNoInternalFrame(page, dictionaryTerms());
  });

  test("not-found check fails on a screen in the internal frame", async ({ page }) => {
    await page.goto("/inventory");
    await expect(page.locator("h1")).toBeVisible();
    await expect(assertNoInternalFrame(page, dictionaryTerms())).rejects.toThrow(
      "internal frame found",
    );
  });

  test("slow screen shows no indicator before 1s and a skeleton after", async ({ page }) => {
    await page.goto(PROTO);
    await expect(page.locator("h1")).toBeVisible();
    await page.goto(`${PROTO}?state=slow`, { waitUntil: "commit" });
    await page.waitForTimeout(500);
    await expect(page.locator('[data-slot="page-skeleton"]')).toBeHidden();
    await assertSkeletonAfterOneSecond(page);
    await expect(page.getByRole("button", { name: "Mở hoặc đóng thanh bên" })).toBeVisible();
    await expect(page.locator("h1")).toHaveText("Bản mẫu khung", { timeout: 10_000 });
  });

  test("skeleton check fails on a screen that is not slow", async ({ page }) => {
    await page.goto(PROTO);
    await expect(page.locator("h1")).toHaveText("Bản mẫu khung");
    await expect(assertSkeletonAfterOneSecond(page)).rejects.toThrow("no skeleton after 1s");
  });

  test("session expiry offers sign-in back to the same place", async ({ page }) => {
    const here = `${PROTO}?state=session-expired`;
    await page.goto(here);
    await expect(page.locator("h1")).toHaveText("Phiên đăng nhập đã hết hạn");
    await expect(page.getByRole("link", { name: "Đăng nhập lại" })).toHaveAttribute(
      "href",
      `/login?next=${encodeURIComponent(here)}`,
    );
  });

  test("status badges pass contrast in light and dark", async ({ page }) => {
    for (const colorScheme of ["light", "dark"] as const) {
      await page.emulateMedia({ colorScheme });
      await page.goto(PROTO);
      await expect(page.locator('[data-slot="status-badges"] [data-status]')).toHaveCount(6);
      const { violations } = await new AxeBuilder({ page })
        .include('[data-slot="status-badges"]')
        .withRules(["color-contrast"])
        .analyze();
      expect(
        violations.map((v) => v.id),
        colorScheme,
      ).toEqual([]);
    }
  });

  test("contrast check fails on a badge with unreadable text", async ({ page }) => {
    await page.goto(PROTO);
    await expect(page.locator('[data-slot="status-badges"] [data-status]')).toHaveCount(6);
    await page.evaluate(() => {
      const badge = document.querySelector<HTMLElement>('[data-status="Active"]');
      if (badge) badge.style.color = getComputedStyle(badge).backgroundColor;
    });
    const { violations } = await new AxeBuilder({ page })
      .include('[data-slot="status-badges"]')
      .withRules(["color-contrast"])
      .analyze();
    expect(violations.map((v) => v.id)).toContain("color-contrast");
  });

  test("losing the network shows a banner that leaves when it is back", async ({
    page,
    context,
  }) => {
    await page.goto("/inventory");
    await expect(page.locator("h1")).toBeVisible();
    await context.setOffline(true);
    await expect(page.getByRole("alert").filter({ hasText: "Mất kết nối mạng" })).toBeVisible();
    await assertBanner(page, "chưa lưu được");
    await context.setOffline(false);
    await expect(page.getByRole("alert").filter({ hasText: "Mất kết nối mạng" })).toHaveCount(0);
  });

  test("banner check fails while the network is up", async ({ page }) => {
    await page.goto("/inventory");
    await expect(page.locator("h1")).toBeVisible();
    await expect(assertBanner(page, "Mất kết nối mạng")).rejects.toThrow("banner missing");
  });

  test("a save that fails offline keeps the input and offers retry", async ({ page, context }) => {
    await page.goto(PROTO);
    const note = page.getByLabel("Ghi chú thử");
    await note.fill("ghi chú [Tên]");
    await context.setOffline(true);
    await page.getByRole("button", { name: "Lưu thử" }).click();
    const banner = page.getByRole("alert").filter({ hasText: "Chưa lưu được vì mất kết nối mạng" });
    await expect(banner).toBeVisible();
    await expect(note).toHaveValue("ghi chú [Tên]");
    await context.setOffline(false);
    await expect(banner).toBeVisible();
    await banner.getByRole("button", { name: "Thử lại" }).click();
    await expect(banner).toHaveCount(0);
    await expect(note).toHaveValue("ghi chú [Tên]");
  });

  test("follows the device theme first", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");
    await expect(page.locator("html")).toHaveClass(/\bdark\b/);
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    await expect(page.locator("html")).not.toHaveClass(/\bdark\b/);
  });

  test("chosen theme survives a reload", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    await expect(page.locator("h1")).toBeVisible();
    await page.getByRole("button", { name: "Đổi giao diện" }).click();
    await page.getByRole("menuitemradio", { name: "Tối" }).click();
    await expect(page.locator("html")).toHaveClass(/\bdark\b/);
    await page.reload();
    await expect(page.locator("html")).toHaveClass(/\bdark\b/);
  });

  test("no serious accessibility violations on every frame screen", async ({
    page,
    context,
  }, info) => {
    const phone = PHONE.has(info.project.name);
    /** Written before the code: 9 screens, each scanned in light and in dark. */
    const SCAN_LIST = [
      { name: "today", href: "/" },
      { name: "inventory", href: "/inventory" },
      { name: "sent", href: "/sent" },
      { name: "prototype", href: PROTO },
      { name: "error", href: `${PROTO}?state=error` },
      { name: "session expired", href: `${PROTO}?state=session-expired` },
      { name: "not found", href: "/no-such-page" },
      { name: "offline banner", href: "/inventory", offline: true },
      { name: phone ? "sidebar sheet" : "sidebar expanded", href: "/inventory", sheet: phone },
    ];
    expect(SCAN_LIST).toHaveLength(9);
    let scans = 0;
    const found: Record<string, string[]> = {};
    for (const colorScheme of ["light", "dark"] as const) {
      await page.emulateMedia({ colorScheme });
      for (const screen of SCAN_LIST) {
        await page.goto(screen.href);
        await expect(page.locator("h1")).toBeVisible();
        if (screen.offline) {
          await context.setOffline(true);
          await expect(page.locator('[data-slot="screen-banner"]')).toBeVisible();
        }
        if (screen.sheet) {
          await openSheet(page);
        }
        const ids = await seriousViolations(page);
        if (ids.length > 0) found[`${colorScheme} ${screen.name}`] = ids;
        scans += 1;
        if (screen.offline) await context.setOffline(false);
      }
    }
    expect(found).toEqual({});
    expect(scans).toBe(18);
  });

  test("accessibility check fails on a retry button with unreadable text", async ({ page }) => {
    await page.goto(`${PROTO}?state=error`);
    const retry = page.getByRole("button", { name: "Thử lại" });
    await expect(retry).toBeVisible();
    await retry.evaluate((el) => {
      el.style.color = getComputedStyle(el).backgroundColor;
    });
    expect(await seriousViolations(page)).toContain("color-contrast");
  });
});
