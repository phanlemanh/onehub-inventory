// The two shared waits of the browser tests (roadmap row 1r, _acceptance/bo-kiem-chung-khi-dang-nhap AC-5, AC-6, AC-7).
// Row 1o failed its gate twice on a slow machine: a test counted links right after pressing the sheet button, and a
// banner wait ran out of the 5-second default. Every test that opens the phone sheet or waits for a banner goes
// through these two functions, so a fix for slow machines lands in one place.
import { expect, type Locator, type Page } from "@playwright/test";

/** Long enough for a page on a CPU slowed four times (E2E_CPU_THROTTLE=4), against the 5-second default. */
export const SETTLE_MS = 20_000;

/** The accessible name of the button that opens the sidebar sheet on a phone. */
export const SHEET_BUTTON = "Mở hoặc đóng thanh bên";

/** The open sidebar sheet on a phone. */
export const SHEET = '[data-mobile="true"]';

/**
 * Opens the phone sheet. A press that lands before the page hydrates does nothing, so press again until the sheet
 * shows; then wait until nothing on the page moves, because a half slid-in sheet is not what the person reads.
 * Pinned messages: `ngan khong mo` (no sheet after SETTLE_MS), `ngan chua dung` (still moving after SETTLE_MS).
 */
export async function openSheet(page: Page): Promise<void> {
  const sheet = page.locator(SHEET);
  const button = page.getByRole("button", { name: SHEET_BUTTON }).first();
  try {
    await expect(async () => {
      if (!(await sheet.first().isVisible())) await button.click({ timeout: 2000 });
      await expect(sheet.first()).toBeVisible({ timeout: 2000 });
    }).toPass({ timeout: SETTLE_MS });
  } catch {
    throw new Error("ngan khong mo");
  }
  try {
    await page.waitForFunction(
      () => document.getAnimations().every((a) => a.playState !== "running"),
      undefined,
      { timeout: SETTLE_MS },
    );
  } catch {
    throw new Error("ngan chua dung");
  }
}

/**
 * Waits until `locator` shows and its own animations (and its children's) have stopped.
 * Pinned messages: `<name>: khong hien`, `<name>: chua dung`.
 */
export async function shown(locator: Locator, name: string): Promise<void> {
  try {
    await expect(locator).toBeVisible({ timeout: SETTLE_MS });
  } catch {
    throw new Error(`${name}: khong hien`);
  }
  try {
    await expect
      .poll(
        () =>
          locator.evaluate(
            (el) =>
              el.getAnimations({ subtree: true }).filter((a) => a.playState === "running").length,
          ),
        { timeout: SETTLE_MS },
      )
      .toBe(0);
  } catch {
    throw new Error(`${name}: chua dung`);
  }
}

/**
 * Written before the code: every test that waits for the phone sheet or a banner, by file and title. Each carries the
 * `@cho` tag, so `kiem_chung_lap` repeats exactly these on a slowed CPU; a unit test fails naming any title here that
 * is missing or untagged.
 */
export const CHO_TESTS: Readonly<Record<string, readonly string[]>> = {
  "tests/e2e/frame.spec.ts": [
    "marks the current screen and names the tab",
    "current-screen check fails when the mark is moved",
    "phone sidebar opens as a sheet and closes after choosing",
    "losing the network shows a banner that leaves when it is back",
    "no serious accessibility violations on every frame screen",
    "a save that fails offline keeps the input and offers retry",
  ],
  "tests/e2e/account.spec.ts": ["login-loi-may-chu"],
  "tests/e2e/app-shell.spec.ts": [
    "no column takes the screen and nothing scrolls sideways (light)",
    "no column takes the screen and nothing scrolls sideways (dark)",
    "the sheet holds the rail and the second column, and closes after a choice",
    "the in-view check fails on a closed sheet and on a sheet still off screen",
    "the sheet check fails while the sheet is still open",
  ],
  "tests/e2e-db/members.spec.ts": ["moi-nguoi-va-dang-nhap", "doi-vai-thanh-ben", "khong-du-quyen"],
  "tests/e2e-db/bo-nut-members.spec.ts": [
    "thanh-ben-theo-bang · man-thanh-vien-theo-bang",
    "tu-choi-403-cau-rieng",
  ],
  "tests/e2e-db/goc-nhin.spec.ts": ["phone sheet", "E15 frames"],
  "tests/e2e-db/vai-man.spec.ts": ["thanh ben theo vai"],
  "tests/e2e-db/lop-rieng.spec.ts": ["proof images"],
  "tests/e2e/sua-tren-o.spec.ts": ["axe-sang-toi: light", "axe-sang-toi: dark"],
  "tests/e2e/settle.spec.ts": [
    "ngan mo",
    "ngan chua dung",
    "ngan khong mo",
    "bang hien",
    "bang khong hien",
  ],
};
