// Row 1p (dang-nhap-chon-tu-reui): the sign-in screen follows ReUI block auth-15 at every size, light and dark —
// logo on top, one open column with no frame, the email field with its mail icon, a full-width send button, a
// one-line footer; no outside sign-in. The flow itself is tested by rows 8 and 1m (account.spec.ts, tests/e2e-db).
// Every case name below is the pinned message its break-test turns red with.
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "../../tools/e2e_templates/fixture";

const AXE_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

test.describe("dang nhap theo khoi auth-15", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator('[data-state="email"][data-ready]')).toBeVisible();
  });

  test("dang-cua-khoi", async ({ page }) => {
    const brand = page.locator('[data-slot="login-brand"]');
    const heading = page.locator("h1");
    await expect(heading, "dang-cua-khoi: mot tieu de").toHaveCount(1);
    await expect(brand.getByText("OneHub", { exact: true }), "dang-cua-khoi: logo").toBeVisible();
    const brandBox = await brand.boundingBox();
    const headingBox = await heading.boundingBox();
    expect(brandBox!.y + brandBox!.height, "dang-cua-khoi: logo tren tieu de").toBeLessThan(
      headingBox!.y,
    );

    await expect(
      page.locator('[data-slot="frame"]'),
      "dang-cua-khoi: khung bọc biểu mẫu",
    ).toHaveCount(0);

    const group = page
      .locator('[data-slot="input-group"]')
      .filter({ has: page.getByLabel("Email") });
    await expect(group, "dang-cua-khoi: o email co bieu tuong thu").toHaveCount(1);
    await expect(group.locator("svg"), "dang-cua-khoi: o email co bieu tuong thu").toHaveCount(1);

    const column = await page.locator('[data-slot="login-column"]').boundingBox();
    const send = await page.getByRole("button", { name: "Gửi mã" }).boundingBox();
    expect(Math.abs(send!.width - column!.width), "dang-cua-khoi: nut rong het cot").toBeLessThan(
      2,
    );

    await expect(
      page.locator('[data-slot="login-footer"]'),
      "dang-cua-khoi: chan trang",
    ).toHaveText(/^© \d{4} OneHub$/);
  });

  test("khong-dang-nhap-ngoai", async ({ page }) => {
    for (const name of ["Google", "Apple", "GitHub"]) {
      await expect(page.getByText(name), `khong-dang-nhap-ngoai: ${name}`).toHaveCount(0);
    }
  });

  test("khong-cuon-ngang", async ({ page }, info) => {
    const { scroll, client } = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      client: document.documentElement.clientWidth,
    }));
    expect(scroll, `khong-cuon-ngang: ${info.project.name}`).toBeLessThanOrEqual(client);
  });

  test("nut-trong-man-dau", async ({ page }, info) => {
    const send = await page.getByRole("button", { name: "Gửi mã" }).boundingBox();
    const height = page.viewportSize()!.height;
    expect(send!.y + send!.height, `nut-trong-man-dau: ${info.project.name}`).toBeLessThanOrEqual(
      height,
    );
  });

  test("logo-doc-duoc-nen-toi", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    const { violations } = await new AxeBuilder({ page })
      .include('[data-slot="login-brand"]')
      .withRules(["color-contrast"])
      .analyze();
    expect(
      violations.map((v) => v.id),
      "logo-doc-duoc-nen-toi",
    ).toEqual([]);
  });

  test("axe-dang-nhap", async ({ page }) => {
    for (const colorScheme of ["light", "dark"] as const) {
      await page.emulateMedia({ colorScheme });
      const { violations } = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze();
      expect(
        violations.map((v) => `${colorScheme} ${v.id}`),
        `axe-dang-nhap: ${colorScheme}`,
      ).toEqual([]);
    }
  });
});
