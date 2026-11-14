// The company layer in the browser (row 7e, lop-rieng-cua-san) on this lane's Postgres:
//   DB_LANE=r DB_PORT=5565 npx playwright test -c playwright.db.config.ts tests/e2e-db/lop-rieng.spec.ts
// People sign in through the shared role door of row 9b (dang-nhap-vai.ts); this file never signs in by itself.
//   company words on inventory — E9: company A's label and own fields on the inventory, a retired field absent,
//                                 company B sees the eight standard headers.
import { tmpdir } from "node:os";
import { join } from "node:path";

import { expect, test, type Browser, type Page } from "@playwright/test";
import pg from "pg";

import { label } from "../../src/modules/company-config";
import { SAMPLE_LISTINGS_PER_SUBDIVISION } from "../../src/modules/listings";

import { makeSampleCompany, rolePerson, signInWithCode } from "./dang-nhap-vai";

const RUN = process.env["E2E_DB_RUN"] ?? `${process.pid}`;
const DB_PORT = process.env["DB_PORT"] ?? "5563";
const OWNER_URL = `postgres://postgres:local-only@127.0.0.1:${DB_PORT}/dang_nhap_e2e_${RUN}`;

/** A second company with one administrator, written as the database owner: the company that must see none of A's words. */
const OTHER = {
  company: "[Sàn B thử lớp riêng]",
  name: "[Tên] Quản trị sàn B",
  email: `lop-rieng-b-${RUN}@example.test`,
};

async function makeOtherCompany(): Promise<void> {
  const db = new pg.Client({ connectionString: OWNER_URL });
  await db.connect();
  try {
    const company = (
      await db.query<{ id: string }>("insert into companies (name) values ($1) returning id", [
        OTHER.company,
      ])
    ).rows[0]!.id;
    const user = (
      await db.query<{ id: string }>(
        "insert into identity.users (email, name) values ($1, $2) returning id",
        [OTHER.email, OTHER.name],
      )
    ).rows[0]!.id;
    await db.query(
      "insert into company_members (company_id, user_id, name, roles) values ($1, $2, $3, $4)",
      [company, user, OTHER.name, ["CompanyAdmin"]],
    );
  } finally {
    await db.end();
  }
}

const stateOf = (who: string) => join(tmpdir(), `onehub-e2e-db-lop-rieng-${who}-${RUN}.json`);

async function keepSession(browser: Browser, email: string, file: string) {
  const context = await browser.newContext();
  const page = await context.newPage();
  await signInWithCode(page, email);
  await context.storageState({ path: file });
  await context.close();
}

const STANDARD = [
  "Unit",
  "Building",
  "Subdivision",
  "StandardStatus",
  "ListPrice",
  "LivingArea",
  "BedroomsTotal",
  "LastConfirmedAt",
] as const;

const region = (page: Page) => page.locator('[data-slot="data-region"]').first();

/** The headers of the grid's columns in order, read from the first header row. */
async function headers(page: Page): Promise<string[]> {
  await expect(page.locator('[hidden][id^="S:"]')).toHaveCount(0);
  const head = region(page).locator('[data-slot="data-region-body"] thead tr:first-child');
  await expect(head.locator("th[data-col-id]").first()).toBeVisible();
  return head.evaluate((tr) =>
    [...tr.querySelectorAll<HTMLElement>("th[data-col-id]")]
      .filter((th) => th.dataset["colId"]!.includes("."))
      .map(
        (th) =>
          th.querySelector("[data-slot=column-header-label]")?.textContent?.trim() ??
          th.innerText.split("\n")[0]!.trim(),
      ),
  );
}

test.describe("lop rieng tren bang hang", () => {
  // One width: the data case runs at 1440; beforeAll would otherwise make the companies once per width.
  test.skip(() => test.info().project.name !== "1440", "one width: the data case runs at 1440");

  test.beforeAll(async ({ browser }, info) => {
    if (info.project.name !== "1440") return;
    await makeSampleCompany();
    await makeOtherCompany();
    await keepSession(browser, rolePerson("CompanyAdmin").email, stateOf("a"));
    await keepSession(browser, OTHER.email, stateOf("b"));
  });

  test("company words on inventory", async ({ browser }) => {
    const a = await browser.newContext({ storageState: stateOf("a") });
    const pageA = await a.newPage();
    const api = pageA.request;
    const post = async (part: string, data: unknown) => {
      const res = await api.post(`/api/v1/company-layer/${part}`, { data });
      expect(res.status(), `${part} ${await res.text()}`).toBe(201);
      return ((await res.json()) as { id: string }).id;
    };
    await post("labels", { concept: "Building", label: "Block" });
    await post("fields", {
      name: "Hướng view",
      kind: "single_select",
      options: ["Hồ", "Phố", "Công viên"],
    });
    await post("fields", { name: "Ghi chú", kind: "text" });
    const gone = await post("fields", { name: "Hoa hồng tạm", kind: "number" });
    const retired = await api.post(`/api/v1/company-layer/fields/${gone}/retire`);
    expect(retired.status()).toBe(200);

    await pageA.goto("/inventory");
    const wantA = [
      ...STANDARD.map((c) => (c === "Building" ? "Block" : label(c))),
      "Hướng view",
      "Ghi chú",
    ];
    expect(wantA).toHaveLength(10);
    const gotA = await headers(pageA);
    const shownRetired = gotA.find((h) => h === "Hoa hồng tạm");
    if (shownRetired) throw new Error(`retired field shown: ${shownRetired}`);
    expect(gotA).toEqual(wantA);
    const layer = (await (await api.get("/api/v1/company-layer")).json()) as {
      fields: { code: string; name: string }[];
    };
    expect(layer.fields.map((f) => f.code)).toEqual(["huong_view", "ghi_chu"]);

    // The «Hướng view» column filters by its values: every third sample listing looks onto the lake.
    const total = Object.values(SAMPLE_LISTINGS_PER_SUBDIVISION).reduce((s, n) => s + n, 0);
    const lake = Math.ceil(total / 3);
    await region(pageA).getByRole("button", { name: /^Lọc/ }).first().click();
    const box = region(pageA).locator(
      'th[data-col-id="custom.huong_view"] [data-filter-mode="values"] button',
    );
    await box.click();
    await pageA
      .getByRole("dialog")
      .getByRole("button", { name: `Hồ ${lake}`, exact: true })
      .click();
    await pageA.keyboard.press("Escape");
    await expect(region(pageA)).toContainText(`${lake} / ${total} dòng`);
    await a.close();

    const b = await browser.newContext({ storageState: stateOf("b") });
    const pageB = await b.newPage();
    await pageB.goto("/inventory");
    expect(await headers(pageB)).toEqual(STANDARD.map((c) => label(c)));
    await b.close();
  });
});
