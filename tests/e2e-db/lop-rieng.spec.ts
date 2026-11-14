// The company layer in the browser (row 7e, lop-rieng-cua-san) on this lane's Postgres:
//   DB_LANE=r DB_PORT=5565 npx playwright test -c playwright.db.config.ts tests/e2e-db/lop-rieng.spec.ts
// People sign in through the shared sign-in function of row 9b (dang-nhap-vai.ts); this file never signs in by itself.
//   add and edit on screen      — E19: the add and edit forms, four refusals under their field, kind locked, retire
//                                 keeps the row.
//   company words on inventory — E9: company A's label and own fields on the inventory, a retired field absent,
//                                 company B sees the eight standard headers.
//   proof images                — only with LOP_RIENG_ANH=1: the screen and the inventory at the four widths of the
//                                 grid family, light and dark, signed in as the company admin, for the screen proof
//                                 and the grader's look (E11, E13); before the review case changes «Block» and «Ghi chú».
//   review screen               — E12: the button set of every part for four roles, edit, retire, match, refusal.
// The cases run in this order on one company and build on each other; each also stands alone when run with -g.
import { tmpdir } from "node:os";
import { join } from "node:path";

import { expect, test, type Browser, type Page } from "@playwright/test";
import pg from "pg";

import { label } from "../../src/modules/company-config";
import { PROBLEM_COPY } from "../../src/modules/company-config/ui/copy";
import type { Role } from "../../src/generated/ontology";
import { sampleCatalog } from "../../src/modules/catalog";
import { catalogLoadStatements } from "../../src/modules/catalog/load-sql";
import { SAMPLE_LISTINGS_PER_SUBDIVISION } from "../../src/modules/listings";

import { openSheet, shown } from "../../tools/e2e_templates/settle";

import { ROLES, signInWithCode } from "./dang-nhap-vai";

const RUN = process.env["E2E_DB_RUN"] ?? `${process.pid}`;
const DB_PORT = process.env["DB_PORT"] ?? "5563";
const OWNER_URL = `postgres://postgres:local-only@127.0.0.1:${DB_PORT}/dang_nhap_e2e_${RUN}`;

/**
 * Company A of this file, one person per role, and company B with one administrator — this file's own people,
 * written as the database owner. The shared role door's sample company (dang-nhap-vai.ts) belongs to the role × screen
 * suite; this file only uses its sign-in function.
 */
const COMPANY = { a: "[Sàn A thử lớp riêng]", b: "[Sàn B thử lớp riêng]" } as const;
const personOf = (role: Role) => ({
  name: `[Tên] Lớp riêng ${role}`,
  email: `lop-rieng-${role.toLowerCase()}-${RUN}@example.test`,
});
const OTHER = { name: "[Tên] Quản trị sàn B", email: `lop-rieng-b-${RUN}@example.test` };

async function makeCompanies(): Promise<void> {
  const db = new pg.Client({ connectionString: OWNER_URL });
  await db.connect();
  try {
    const add = async (
      company: string,
      people: { name: string; email: string; roles: Role[] }[],
    ) => {
      const id = (
        await db.query<{ id: string }>("insert into companies (name) values ($1) returning id", [
          company,
        ])
      ).rows[0]!.id;
      for (const p of people) {
        const user = (
          await db.query<{ id: string }>(
            "insert into identity.users (email, name) values ($1, $2) returning id",
            [p.email, p.name],
          )
        ).rows[0]!.id;
        await db.query(
          "insert into company_members (company_id, user_id, name, roles) values ($1, $2, $3, $4)",
          [id, user, p.name, p.roles],
        );
      }
    };
    await add(
      COMPANY.a,
      ROLES.map((r) => ({ ...personOf(r), roles: [r] })),
    );
    await add(COMPANY.b, [{ ...OTHER, roles: ["CompanyAdmin"] }]);
  } finally {
    await db.end();
  }
}

/** One query as the database owner: reads back what the screen wrote, and takes a role away mid-way. */
async function owner<T>(text: string, values: unknown[] = []): Promise<T[]> {
  const db = new pg.Client({ connectionString: OWNER_URL });
  await db.connect();
  try {
    return (await db.query(text, values)).rows as T[];
  } finally {
    await db.end();
  }
}

const COMPANY_A = "select id from companies where name = '[Sàn A thử lớp riêng]'";

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

type Api = Page["request"];
interface Layer {
  labels: { id: string; concept: string; label: string }[];
  fields: { code: string; name: string; kind: string; options: string[] }[];
  aliases: { id: string; field: string; raw: string; value: string }[];
  pendingUnits: { id: string; rawCode: string }[];
  templates: { id: string; name: string }[];
}

const layerOf = async (api: Api) =>
  (await (await api.get("/api/v1/company-layer")).json()) as Layer;

async function post(api: Api, part: string, data: unknown): Promise<string> {
  const res = await api.post(`/api/v1/company-layer/${part}`, { data });
  expect(res.status(), `${part} ${await res.text()}`).toBe(201);
  return ((await res.json()) as { id: string }).id;
}

/** Opens one part of the company layer screen and waits for its rows. */
async function openPart(page: Page, part: string) {
  await page.goto(part === "nhan" ? "/tuy-chinh-san" : `/tuy-chinh-san?phan=${part}`);
  await expect(page.locator(`[data-part="${part}"][data-state="ready"]`)).toBeVisible();
}

/** Picks an option of the store's select by the field's label. */
async function pick(page: Page, scope: ReturnType<Page["locator"]>, field: string, option: string) {
  await scope.getByLabel(field, { exact: true }).click();
  await page.getByRole("option", { name: option, exact: true }).click();
}

const dialogOf = (page: Page, slot: string) => page.locator(`[data-slot="${slot}"]`);

/** The refusal shown under one field of an open form. */
const errorUnder = (dialog: ReturnType<Page["locator"]>, field: string) =>
  dialog.locator(`[data-field="${field}"] [data-slot="field-error"]`);

test.describe.configure({ mode: "serial" });

test.describe("lop rieng tren bang hang", () => {
  // One width: the data case runs at 1440; beforeAll would otherwise make the companies once per width.
  test.skip(() => test.info().project.name !== "1440", "one width: the data case runs at 1440");

  test.beforeAll(async ({ browser }, info) => {
    if (info.project.name !== "1440") return;
    await makeCompanies();
    // The shared catalog the pending unit matches against: this run's database starts without one.
    const db = new pg.Client({ connectionString: OWNER_URL });
    await db.connect();
    try {
      for (const st of catalogLoadStatements(sampleCatalog())) await db.query(st.text, st.values);
    } finally {
      await db.end();
    }
    await keepSession(browser, personOf("CompanyAdmin").email, stateOf("a"));
    await keepSession(browser, OTHER.email, stateOf("b"));
    for (const role of ROLES) await keepSession(browser, personOf(role).email, stateOf(role));
  });

  test("add and edit on screen", async ({ browser }) => {
    const ctx = await browser.newContext({ storageState: stateOf("ListAgent") });
    const page = await ctx.newPage();
    const api = page.request;
    const company = (await owner<{ id: string }>(COMPANY_A))[0]!.id;
    const liveFields = async () =>
      (
        await owner<{ n: number }>(
          "select count(*)::int as n from company_fields where company_id = $1 and retired_at is null",
          [company],
        )
      )[0]!.n;

    // Add a single choice field, a text field, a label and a spelling through the screen's forms.
    await openPart(page, "truong");
    const field = dialogOf(page, "field-dialog");
    const addField = async (name: string, kind: string, options?: string) => {
      await page
        .getByRole("button", { name: label("AddCustomField") })
        .first()
        .click();
      await field.getByLabel("Tên trường").fill(name);
      await pick(page, field, "Kiểu", kind);
      if (options !== undefined) await field.getByLabel(/^Lựa chọn/).fill(options);
      await field.getByRole("button", { name: "Thêm", exact: true }).click();
    };
    await addField("Hướng view", "Chọn một", "Hồ\nPhố\nCông viên\nBiển");
    await expect(field).toBeHidden();
    await addField("Ghi chú", "Chữ");
    await expect(field).toBeHidden();
    await expect(page.locator("tbody")).toContainText("Hướng view");
    const made = await owner<{ code: string; kind: string }>(
      "select code, kind from company_fields where company_id = $1 and name = 'Hướng view'",
      [company],
    );
    expect(made).toEqual([{ code: "huong_view", kind: "single_select" }]);

    await openPart(page, "nhan");
    const labelForm = dialogOf(page, "label-dialog");
    await page
      .getByRole("button", { name: label("AddCompanyLabel") })
      .first()
      .click();
    await pick(page, labelForm, "Khái niệm chuẩn", label("Building"));
    await labelForm.getByLabel("Chữ của sàn").fill("Block");
    await labelForm.getByRole("button", { name: "Thêm", exact: true }).click();
    await expect(labelForm).toBeHidden();

    await openPart(page, "tu-dien");
    const alias = dialogOf(page, "alias-dialog");
    await page
      .getByRole("button", { name: label("AddValueAlias") })
      .first()
      .click();
    await pick(page, alias, "Trường", label("DirectionFaces"));
    await alias.getByLabel("Chữ sàn viết").fill("ĐN");
    await pick(page, alias, "Giá trị chuẩn", "Đông Nam");
    await alias.getByRole("button", { name: "Thêm", exact: true }).click();
    await expect(alias).toBeHidden();
    expect((await layerOf(api)).labels.map((l) => [l.concept, l.label])).toEqual([
      ["Building", "Block"],
    ]);
    expect((await layerOf(api)).aliases.map((a) => [a.field, a.raw, a.value])).toEqual([
      ["Unit.directionFaces", "ĐN", "Đông Nam"],
    ]);

    // Four refusals, written before the code: each shows under its own field, what was typed stays, nothing is added.
    const REFUSALS = ["name-taken", "options-count", "field-limit", "value-not-in-set"] as const;
    expect(REFUSALS).toHaveLength(4);
    const fieldsBefore = await liveFields();
    await openPart(page, "truong");
    await addField("ghi chu", "Chữ");
    await expect(errorUnder(field, "name")).toHaveText(PROBLEM_COPY["name-taken"]!.text);
    await expect(field.getByLabel("Tên trường")).toHaveValue("ghi chu");
    await page.keyboard.press("Escape");
    await addField(
      "Nhiều lựa chọn",
      "Chọn một",
      Array.from({ length: 31 }, (_, i) => `L${i + 1}`).join("\n"),
    );
    await expect(errorUnder(field, "options")).toHaveText(PROBLEM_COPY["options-count"]!.text);
    await expect(field.getByLabel("Tên trường")).toHaveValue("Nhiều lựa chọn");
    await page.keyboard.press("Escape");
    const filler: string[] = [];
    for (let i = 1; i <= 20 - fieldsBefore; i += 1)
      filler.push(await post(api, "fields", { name: `Tạm ${i}`, kind: "text" }));
    await openPart(page, "truong");
    await addField("Thứ hai mốt", "Chữ");
    await expect(field.locator('[data-slot="form-error"]')).toHaveText(
      PROBLEM_COPY["field-limit"]!.text,
    );
    await expect(field.getByLabel("Tên trường")).toHaveValue("Thứ hai mốt");
    await page.keyboard.press("Escape");
    for (const code of filler)
      expect((await api.post(`/api/v1/company-layer/fields/${code}/retire`)).status()).toBe(200);
    expect(await liveFields()).toBe(fieldsBefore);
    await openPart(page, "tu-dien");
    await page
      .getByRole("button", { name: label("AddValueAlias") })
      .first()
      .click();
    await pick(page, alias, "Trường", "Hướng view");
    await alias.getByLabel("Chữ sàn viết").fill("bien");
    await pick(page, alias, "Giá trị chuẩn", "Biển");
    // Someone takes «Biển» out of the field while the form is open.
    expect(
      (
        await api.patch("/api/v1/company-layer/fields/huong_view", {
          data: { options: ["Hồ", "Phố", "Công viên"] },
        })
      ).status(),
    ).toBe(200);
    await alias.getByRole("button", { name: "Thêm", exact: true }).click();
    await expect(errorUnder(alias, "value")).toHaveText(PROBLEM_COPY["value-not-in-set"]!.text);
    await expect(alias.getByLabel("Chữ sàn viết")).toHaveValue("bien");
    await page.keyboard.press("Escape");
    expect((await layerOf(api)).aliases).toHaveLength(1);
    expect(await liveFields()).toBe(fieldsBefore);

    // Edit: the kind is locked; the name and the options save.
    await openPart(page, "truong");
    const edit = async () => {
      await page.locator('[data-row-actions-for="huong_view"] [data-slot="row-actions"]').click();
      await page.getByRole("menuitem", { name: label("Edit") }).click();
    };
    await edit();
    if (!(await field.getByLabel("Kiểu", { exact: true }).isDisabled()))
      throw new Error("field kind changed on edit");
    await field.getByLabel("Tên trường").fill("Hướng nhìn");
    await field.getByLabel(/^Lựa chọn/).fill("Hồ\nPhố\nCông viên\nNội khu");
    await field.getByRole("button", { name: "Lưu", exact: true }).click();
    await expect(field).toBeHidden();
    const edited = (await layerOf(api)).fields.find((f) => f.code === "huong_view")!;
    expect([edited.name, edited.kind, edited.options]).toEqual([
      "Hướng nhìn",
      "single_select",
      ["Hồ", "Phố", "Công viên", "Nội khu"],
    ]);
    expect(
      (
        await api.patch("/api/v1/company-layer/fields/huong_view", { data: { kind: "text" } })
      ).status(),
    ).toBe(400);
    await edit();
    await field.getByLabel("Tên trường").fill("Hướng view");
    await field.getByRole("button", { name: "Lưu", exact: true }).click();
    await expect(field).toBeHidden();

    // Retire keeps the row: gone from the screen, still in the table with the time it stopped.
    const temp = await post(api, "fields", { name: "Cột thử", kind: "boolean" });
    await openPart(page, "truong");
    await page.locator(`[data-row-actions-for="${temp}"] [data-slot="row-actions"]`).click();
    await page.getByRole("menuitem", { name: label("RetireItem") }).click();
    await page
      .locator('[data-slot="confirm-change"]')
      .getByRole("button", { name: new RegExp(`^${label("RetireItem")}`) })
      .click();
    await expect(page.locator(`[data-row-actions-for="${temp}"]`)).toHaveCount(0);
    const kept = await owner<{ retired: boolean }>(
      "select retired_at is not null as retired from company_fields where company_id = $1 and code = $2",
      [company, temp],
    );
    expect(kept).toEqual([{ retired: true }]);
    await ctx.close();
  });

  test("company words on inventory", async ({ browser }) => {
    const a = await browser.newContext({ storageState: stateOf("a") });
    const pageA = await a.newPage();
    const api = pageA.request;
    // What the screen case made already stays; run alone, this case makes it through the API.
    const before = await layerOf(api);
    if (!before.labels.some((l) => l.concept === "Building"))
      await post(api, "labels", { concept: "Building", label: "Block" });
    if (!before.fields.some((f) => f.code === "huong_view"))
      await post(api, "fields", {
        name: "Hướng view",
        kind: "single_select",
        options: ["Hồ", "Phố", "Công viên"],
      });
    if (!before.fields.some((f) => f.code === "ghi_chu"))
      await post(api, "fields", { name: "Ghi chú", kind: "text" });
    const gone = await post(api, "fields", { name: "Hoa hồng tạm", kind: "number" });
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
    expect((await layerOf(api)).fields.map((f) => f.code)).toEqual(["huong_view", "ghi_chu"]);

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

  test("proof images", { tag: "@cho" }, async ({ browser }) => {
    test.skip(process.env["LOP_RIENG_ANH"] !== "1", "pictures only when asked: LOP_RIENG_ANH=1");
    const OUT = "_acceptance/lop-rieng-cua-san/evidence";
    const WIDTHS = [
      [360, 800],
      [414, 896],
      [1024, 768],
      [1440, 900],
    ] as const;
    const snap = async (page: Page, url: string, file: string, ready: string) => {
      await page.goto(url);
      await shown(page.locator(ready).first(), file);
      await page.screenshot({ path: `${OUT}/${file}.png` });
    };
    for (const scheme of ["light", "dark"] as const) {
      for (const [width, height] of WIDTHS) {
        const ctx = await browser.newContext({
          storageState: stateOf("CompanyAdmin"),
          viewport: { width, height },
          colorScheme: scheme,
        });
        const page = await ctx.newPage();
        const tail = scheme === "dark" ? "-toi" : "";
        await snap(
          page,
          "/tuy-chinh-san?phan=truong",
          `tuy-chinh-san-${width}${tail}`,
          '[data-part="truong"][data-state="ready"] tbody tr',
        );
        if (width < 1024) {
          // On a phone the five parts ride in the App Shell's sheet: open it the shared way and show them.
          await openSheet(page);
          await page.screenshot({ path: `${OUT}/tuy-chinh-san-${width}-ngan${tail}.png` });
          await page.keyboard.press("Escape");
        }
        await snap(
          page,
          "/inventory",
          `inventory-${width}${tail}`,
          '[data-slot="data-region-body"] tbody tr',
        );
        if (width === 1440) {
          // The company's own columns sit after the eight standard ones: the grid scrolled to its end shows them.
          await page
            .locator('[data-slot="data-region-body"] [data-slot="scroll-area-viewport"]')
            .first()
            .evaluate((el) => {
              el.scrollLeft = el.scrollWidth;
            });
          await page.waitForTimeout(300);
          await page.screenshot({ path: `${OUT}/inventory-1440-cuoi${tail}.png` });
          await snap(
            page,
            "/tuy-chinh-san?phan=mau",
            `tuy-chinh-san-mau-1440${tail}`,
            '[data-part="mau"][data-state="ready"]',
          );
          await openPart(page, "truong");
          await page
            .locator('[data-row-actions-for="huong_view"] [data-slot="row-actions"]')
            .click();
          await shown(page.getByRole("menu"), "menu");
          await page.screenshot({ path: `${OUT}/tuy-chinh-san-menu-1440${tail}.png` });
          await page.keyboard.press("Escape");
          await page
            .getByRole("button", { name: label("AddCustomField") })
            .first()
            .click();
          await shown(dialogOf(page, "field-dialog"), "hop them truong");
          await page.screenshot({ path: `${OUT}/tuy-chinh-san-them-truong-1440${tail}.png` });
          await page.keyboard.press("Escape");
        }
        await ctx.close();
      }
    }
    // A role that may only read: the same part with no write button and no «…».
    const reader = await browser.newContext({
      storageState: stateOf("BuyerAgent"),
      viewport: { width: 1440, height: 900 },
    });
    const rp = await reader.newPage();
    await snap(
      rp,
      "/tuy-chinh-san?phan=truong",
      "tuy-chinh-san-chi-doc-1440",
      '[data-part="truong"][data-state="ready"] tbody tr',
    );
    await reader.close();
  });

  test("review screen", async ({ browser }) => {
    const admin = await browser.newContext({ storageState: stateOf("CompanyAdmin") });
    const page = await admin.newPage();
    const api = page.request;
    // Rows in every part, so each «…» is there to count.
    const now = await layerOf(api);
    if (!now.labels.some((l) => l.concept === "Building"))
      await post(api, "labels", { concept: "Building", label: "Block" });
    if (!now.fields.some((f) => f.code === "ghi_chu"))
      await post(api, "fields", { name: "Ghi chú", kind: "text" });
    if (!now.aliases.length)
      await post(api, "aliases", { field: "Unit.directionFaces", raw: "ĐN", value: "Đông Nam" });
    await post(api, "pending-units", { rawCode: "S1.01-0501" });
    await post(api, "templates", {
      name: "Sheet tuần",
      headers: ["Mã căn", "Giá"],
      columns: [{ standard: "Listing.unitNumber" }, { skip: true }],
    });

    // The button table of the row (thao-tac-nhap.yaml), written before the code: 5 parts.
    const TABLE: Record<string, { head: string[]; row: string[] }> = {
      nhan: { head: [label("AddCompanyLabel")], row: [label("Edit"), label("RetireItem")] },
      truong: { head: [label("AddCustomField")], row: [label("Edit"), label("RetireItem")] },
      "tu-dien": { head: [label("AddValueAlias")], row: [label("Edit"), label("RetireItem")] },
      "can-cho": { head: [label("MatchPendingUnits")], row: [label("RetireItem")] },
      mau: { head: [], row: [label("RenameTemplate"), label("RetireItem")] },
    };
    expect(Object.keys(TABLE)).toHaveLength(5);
    const WRITERS: readonly Role[] = ["ListAgent", "TeamLead", "CompanyAdmin"];
    let cells = 0;
    for (const role of ROLES) {
      const ctx = await browser.newContext({ storageState: stateOf(role) });
      const p = await ctx.newPage();
      for (const [part, want] of Object.entries(TABLE)) {
        await openPart(p, part);
        const writer = WRITERS.includes(role);
        const head = await p.locator('[data-slot="page-header-action"] button').allInnerTexts();
        expect(
          head.map((t) => t.trim()),
          `${role} ${part}`,
        ).toEqual(writer ? want.head : []);
        const more = p.locator('[data-row-actions-for] [data-slot="row-actions"]').first();
        if (!writer) {
          await expect(p.locator('[data-row-actions-for] [data-slot="row-actions"]')).toHaveCount(
            0,
          );
        } else {
          await more.click();
          const items = (await p.getByRole("menuitem").allInnerTexts()).map((t) => t.trim());
          expect(items, `${role} ${part}`).toEqual(want.row);
          expect(
            items.some((t) => /Xoá/.test(t)),
            `${role} ${part}`,
          ).toBe(false);
          await p.keyboard.press("Escape");
        }
        cells += 1;
      }
      await ctx.close();
    }
    expect(cells).toBe(20);

    // Edit the label «Block» into «Lô»: it stays after a reload and the inventory reads it.
    await openPart(page, "nhan");
    const block = (await layerOf(api)).labels.find((l) => l.concept === "Building")!;
    await page.locator(`[data-row-actions-for="${block.id}"] [data-slot="row-actions"]`).click();
    await page.getByRole("menuitem", { name: label("Edit") }).click();
    const labelForm = dialogOf(page, "label-dialog");
    await labelForm.getByLabel("Chữ của sàn").fill("Lô");
    await labelForm.getByRole("button", { name: "Lưu", exact: true }).click();
    await expect(labelForm).toBeHidden();
    await page.reload();
    await expect(page.locator("tbody")).toContainText("Lô");
    await page.goto("/inventory");
    expect((await headers(page))[1]).toBe("Lô");

    // Retire the field «Ghi chú»: gone from the part and from the inventory.
    await openPart(page, "truong");
    await page.locator('[data-row-actions-for="ghi_chu"] [data-slot="row-actions"]').click();
    await page.getByRole("menuitem", { name: label("RetireItem") }).click();
    await page
      .locator('[data-slot="confirm-change"]')
      .getByRole("button", { name: new RegExp(`^${label("RetireItem")}`) })
      .click();
    await expect(page.locator('[data-row-actions-for="ghi_chu"]')).toHaveCount(0);
    await page.goto("/inventory");
    expect(await headers(page)).not.toContain("Ghi chú");

    // Match the pending unit with the catalog.
    await openPart(page, "can-cho");
    const [answer] = await Promise.all([
      page.waitForResponse((r) => r.url().endsWith("/pending-units/match")),
      page
        .getByRole("button", { name: label("MatchPendingUnits") })
        .first()
        .click(),
    ]);
    expect([answer.status(), await answer.json()]).toEqual([200, { matched: 1, waiting: 0 }]);
    await expect(page.getByText("Đã khớp 1 căn, còn 0 căn chờ")).toBeVisible();
    await expect(page.getByText("Đã khớp 1 căn, còn 0 căn chờ")).toBeVisible();
    await admin.close();

    // The role is taken away while the form is open: the form says so and offers nothing to send again.
    const lead = await browser.newContext({ storageState: stateOf("TeamLead") });
    const lp = await lead.newPage();
    await openPart(lp, "nhan");
    await lp
      .getByRole("button", { name: label("AddCompanyLabel") })
      .first()
      .click();
    const form = dialogOf(lp, "label-dialog");
    await pick(lp, form, "Khái niệm chuẩn", label("Unit"));
    await form.getByLabel("Chữ của sàn").fill("Mã căn sàn");
    const email = personOf("TeamLead").email;
    const setRoles = (roles: Role[]) =>
      owner(
        `update company_members set roles = $2 where user_id = (select id from identity.users where email = $1)`,
        [email, roles],
      );
    await setRoles(["BuyerAgent"]);
    try {
      await form.getByRole("button", { name: "Thêm", exact: true }).click();
      await expect(form.locator('[data-slot="form-error"]')).toContainText(
        "Không đủ quyền làm việc này",
      );
      await expect(form.getByRole("button", { name: "Thêm", exact: true })).toHaveCount(0);
    } finally {
      await setRoles(["TeamLead"]);
    }
    await lead.close();
  });
});
