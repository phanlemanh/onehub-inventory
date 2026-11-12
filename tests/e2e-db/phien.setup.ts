// The register-driven suite's one test session (roadmap row 1r, AC-1): the test person signs in ONCE through the real
// sign-in screen, with the code from this run's test outbox, and the browser state is saved for the `co-phien-*`
// projects. No shortcut into the identity module: the session comes through the same door people use.
import { existsSync, readFileSync } from "node:fs";

import { expect, test as setup } from "@playwright/test";

import { OUTBOX, SESSION_FILE, TEST_PERSON } from "../../playwright.db.config";

interface Mail {
  email: string;
  text: string;
  kind?: string;
}

function codes(): Mail[] {
  if (!existsSync(OUTBOX)) return [];
  return readFileSync(OUTBOX, "utf8")
    .split("\n")
    .filter(Boolean)
    .map((l) => JSON.parse(l) as Mail)
    .filter((m) => m.email === TEST_PERSON && m.kind !== "invite");
}

setup("dang nhap phien thu", async ({ page }) => {
  const before = codes().length;
  await page.goto("/login?next=%2F");
  await expect(page.locator('[data-state="email"][data-ready]')).toBeVisible();
  await page.getByLabel("Email").fill(TEST_PERSON);
  await page.getByLabel("Email").press("Enter");
  await expect(page.locator('[data-state="code"]')).toBeVisible();
  await expect.poll(() => codes().length, { timeout: 10_000 }).toBe(before + 1);
  const found =
    codes()
      .at(-1)!
      .text.match(/\b\d{6}\b/g) ?? [];
  if (found.length !== 1) throw new Error("thu toi nguoi thu khong mang dung mot ma");
  const code = page.getByLabel("Mã đăng nhập");
  await code.fill(found[0]!);
  await code.press("Enter");
  await page.waitForURL((u) => u.pathname === "/" && u.search === "");
  await expect(page.locator('[data-slot="account-menu"][data-ready]')).toBeVisible();
  await page.context().storageState({ path: SESSION_FILE });
});
