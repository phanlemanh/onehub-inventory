// Sign-in corner of the frame and the sign-in screen without a database (row 8). CI runs this in `make e2e`;
// the full flow on Postgres is tests/e2e-db/login.spec.ts.
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const AXE_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

test.describe("tai khoan khong co co so du lieu", () => {
  test("khung-chua-dang-nhap", async ({ page }) => {
    await page.goto("/");
    const link = page.getByRole("link", { name: "Đăng nhập" });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", "/login?next=%2F");
  });

  test("login-buoc-email", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("h1")).toHaveText("Đăng nhập");
    const email = page.getByLabel("Email");
    await expect(email).toHaveAttribute("autocomplete", "email");
    await expect(email).toHaveAttribute("type", "email");
    await expect(page.getByRole("button", { name: "Gửi mã" })).toBeVisible();
    for (const colorScheme of ["light", "dark"] as const) {
      await page.emulateMedia({ colorScheme });
      const { violations } = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze();
      expect(violations.map((v) => `${colorScheme} ${v.id}`)).toEqual([]);
    }
  });

  test("login-loi-may-chu", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator('[data-state="email"][data-ready]')).toBeVisible();
    await page.getByLabel("Email").fill("nhan-vien@example.test");
    await page.getByRole("button", { name: "Gửi mã" }).click();
    const alert = page.locator('[data-state="server-error"]');
    await expect(alert).toContainText("Chưa gửi được yêu cầu.");
    await expect(alert.getByRole("button", { name: "Thử lại" })).toBeVisible();
    await expect(page.getByLabel("Email")).toHaveValue("nhan-vien@example.test");
  });
});
