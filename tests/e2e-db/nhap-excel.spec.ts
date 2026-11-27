// The Nạp tệp screen in the browser (row 11, nhap-excel) on this lane's Postgres:
//   DB_LANE=d DB_PORT=5571 npx playwright test -c playwright.db.config.ts tests/e2e-db/nhap-excel.spec.ts
// People sign in through the shared sign-in function of row 9b (dang-nhap-vai.ts); this file never signs in by itself.
//   tep khong len may chu — E2: the file is read in the page; only JSON {headers, rows} reaches /api/v1/imports/preview.
//   trang thai            — E16: every state of the screen at the width it belongs to, a text assertion each, axe light
//                           and dark on every cell.
//   bang hang trong       — E15: the inventory's Nạp tệp link and button for importers only, imported listings on it.
//   nhan rieng tren bang hang — E21: the header «Block» an import learns is the inventory's tower header.
//   ban phim              — E16: Tab, arrows, Space and Enter take gon.xlsx through the five steps to Xong.
import { readFileSync } from "node:fs";
import { join } from "node:path";

import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Cookie, type Page, type Request, type Route } from "@playwright/test";
import pg from "pg";

import { FRAME_COPY } from "../../src/components/templates/frame-copy";
import type { Role } from "../../src/generated/ontology";
import { sampleCatalog } from "../../src/modules/catalog";
import { catalogLoadStatements } from "../../src/modules/catalog/load-sql";
import { IMPORT_COPY as C, PROBLEM_WORDS, STEP_WORDS } from "../../src/modules/imports/ui/copy";
import { waitReady } from "../../tools/e2e_templates/runner";

import { label } from "../../src/modules/company-config";
import { regionReady } from "../e2e/phone-list";
import { suaTrang } from "../e2e/sua-trang";

import { signInWithCode } from "./dang-nhap-vai";

const RUN = process.env["E2E_DB_RUN"] ?? `${process.pid}`;
const DB_PORT = process.env["DB_PORT"] ?? "5563";
const OWNER_URL = `postgres://postgres:local-only@127.0.0.1:${DB_PORT}/dang_nhap_e2e_${RUN}`;
const FIX = join(process.cwd(), "tests", "fixtures", "nhap-excel");
const COMPANY = "[Sàn thử nạp tệp]";
const personOf = (role: Role) => ({
  name: `[Tên] Nạp tệp ${role}`,
  email: `nhap-excel-${role.toLowerCase()}-${RUN}@example.test`,
});
const PEOPLE: Role[] = ["ListAgent", "BuyerAgent"];

let made: Promise<void> | null = null;
/** The company of this file with one importer and one buyer agent, and the shared catalog; made once per run. */
function makeWorld(): Promise<void> {
  made ??= (async () => {
    const db = new pg.Client({ connectionString: OWNER_URL });
    await db.connect();
    try {
      const have = await db.query("select 1 from companies where name = $1", [COMPANY]);
      if (have.rowCount) return;
      const id = (
        await db.query<{ id: string }>("insert into companies (name) values ($1) returning id", [
          COMPANY,
        ])
      ).rows[0]!.id;
      for (const role of PEOPLE) {
        const p = personOf(role);
        const user = (
          await db.query<{ id: string }>(
            "insert into identity.users (email, name) values ($1, $2) returning id",
            [p.email, p.name],
          )
        ).rows[0]!.id;
        await db.query(
          "insert into company_members (company_id, user_id, name, roles) values ($1, $2, $3, $4)",
          [id, user, p.name, [role]],
        );
      }
      const catalog = await db.query("select 1 from catalog_aliases limit 1");
      if (!catalog.rowCount)
        for (const st of catalogLoadStatements(sampleCatalog())) await db.query(st.text, st.values);
    } finally {
      await db.end();
    }
  })();
  return made;
}

const desktop = (page: Page) => (page.viewportSize()?.width ?? 0) >= 768;

// One sign-in per role per worker: the code request is limited to five per email in fifteen minutes (identity
// constants), and every case of this file opens the screen. Later cases reuse the session's cookies.
const signedIn = new Map<Role, Cookie[]>();

async function openScreen(page: Page, role: Role = "ListAgent") {
  await makeWorld();
  const kept = signedIn.get(role);
  if (kept) await page.context().addCookies(kept);
  else {
    await signInWithCode(page, personOf(role).email);
    signedIn.set(role, await page.context().cookies());
  }
  await page.goto("/nhap-tep");
  await waitReady(page);
}

/** Chooses a file of the fixture folder, or a made-up one, on the file input of step 1. */
async function choose(page: Page, name: string, body?: string) {
  const input = page.getByLabel(C.drop);
  if (body === undefined) await input.setInputFiles(join(FIX, name));
  else
    await input.setInputFiles({ name, mimeType: "text/plain", buffer: Buffer.from(body, "utf8") });
}

const next = (page: Page) => page.getByRole("button", { name: new RegExp(`^${C.next}`) });

async function toPreview(page: Page) {
  for (let i = 0; i < 3; i += 1) await next(page).click();
  await expect(page.locator('[data-state="dem-dau"]')).toBeVisible();
}

async function seriousAxe(page: Page): Promise<string[]> {
  // Measure the settled screen: a colour transition caught half way (the step bar's active step) reads as low contrast.
  await page.waitForFunction(() =>
    document
      .getAnimations()
      .every((a) => a.playState !== "running" || a.effect?.getTiming().iterations === Infinity),
  );
  const { violations } = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .exclude("nextjs-portal")
    .analyze();
  return violations
    .filter((v) => v.impact === "serious" || v.impact === "critical")
    .map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`);
}

/** Both colour schemes of one cell: the state's words stay and axe finds nothing serious. */
async function lightAndDark(page: Page, cell: string, words: ReturnType<Page["locator"]>) {
  for (const scheme of ["light", "dark"] as const) {
    await page.emulateMedia({ colorScheme: scheme });
    await expect(words, `${cell} ${scheme}`).toBeVisible();
    expect(await seriousAxe(page), `axe ${cell} ${scheme}`).toEqual([]);
  }
  await page.emulateMedia({ colorScheme: "light" });
}

test.describe.configure({ mode: "serial" });

test("tep khong len may chu: the file is read in the page, only JSON rows reach the server", async ({
  page,
}) => {
  test.skip(test.info().project.name !== "1440", "one width: the data case runs at 1440");
  await openScreen(page);
  const sent: Request[] = [];
  page.on("request", (r) => {
    if (new URL(r.url()).pathname.startsWith("/api/v1")) sent.push(r);
  });
  // Wrong file: says why, offers another file, and nothing goes to the server.
  await choose(page, "a.pdf", "%PDF-1.4");
  await expect(page.locator('[data-state="tep-loi"]')).toContainText(PROBLEM_WORDS["wrong-type"]);
  await expect(page.getByRole("button", { name: C.chooseAgain })).toBeVisible();
  expect(sent.map((r) => r.url())).toEqual([]);
  // The right file: at least one preview call, each one JSON of headers and rows, never the file's bytes.
  await choose(page, "gon.xlsx");
  await expect(next(page)).toBeEnabled();
  const previews = sent.filter((r) => r.url().endsWith("/api/v1/imports/preview"));
  expect(previews.length).toBeGreaterThan(0);
  const xlsx = readFileSync(join(FIX, "gon.xlsx"));
  for (const r of sent) {
    const type = r.headers()["content-type"] ?? "";
    expect(type, "file body left the browser").not.toContain("multipart");
    const body = r.postDataBuffer();
    if (body) {
      expect(body.subarray(0, 2).toString("latin1"), "file body left the browser").not.toBe("PK");
      expect(body.includes(xlsx.subarray(0, 64)), "file body left the browser").toBe(false);
    }
  }
  for (const r of previews) {
    const json = r.postDataJSON() as { headers: string[]; rows: string[][] };
    expect(json.headers[0]).toBe("Mã căn");
    expect(json.rows.length).toBe(3);
  }
});

test("trang thai: every state of the screen at its widths, light and dark, axe clean", async ({
  page,
}) => {
  test.setTimeout(240_000);
  if (!desktop(page)) {
    // Below 768 px the screen says it is for a computer, nothing else.
    await openScreen(page);
    await lightAndDark(page, "ST-nhap-tep-dien-thoai", page.locator('[data-state="dien-thoai"]'));
    await expect(page.locator('[data-state="dien-thoai"]')).toHaveText(C.phone);
    await expect(page.getByLabel(C.drop)).toBeHidden();
    return;
  }
  const cells: string[] = [];
  const cell = async (id: string, words: ReturnType<Page["locator"]>) => {
    await lightAndDark(page, id, words);
    cells.push(id);
  };

  // ST-nhap-tep-khong-quyen: the buyer agent sees «not allowed», no file area.
  await openScreen(page, "BuyerAgent");
  await cell("ST-nhap-tep-khong-quyen", page.getByText(FRAME_COPY.forbidden.title));
  await expect(page.getByLabel(C.drop)).toHaveCount(0);
  await page.context().clearCookies();

  // ST-nhap-tep-mac-dinh.
  await openScreen(page);
  await cell("ST-nhap-tep-mac-dinh", page.getByText(C.drop, { exact: true }));

  // ST-nhap-tep-tep-loi and ST-nhap-tep-tep-rong.
  await choose(page, "a.pdf", "%PDF-1.4");
  await cell("ST-nhap-tep-tep-loi", page.getByText(PROBLEM_WORDS["wrong-type"]));
  await choose(page, "rong.csv", "Mã căn,Toà\n");
  await cell("ST-nhap-tep-tep-rong", page.getByText(PROBLEM_WORDS["header-only"]));

  // ST-nhap-tep-dang-doc: the server's answer is held back two seconds.
  await page.route("**/api/v1/imports/preview", async (r) => {
    await new Promise((ok) => setTimeout(ok, 2_000));
    await r.continue();
  });
  await choose(page, "gon.xlsx");
  await expect(page.getByText(C.reading)).toBeVisible();
  // From one second on, a placeholder laid out like the column table (design/states.md, Chờ tải).
  await expect(page.locator('[data-slot="region-skeleton"][data-shown="true"]')).toBeVisible();
  cells.push("ST-nhap-tep-dang-doc");
  await expect(next(page)).toBeEnabled({ timeout: 10_000 });
  await page.unroute("**/api/v1/imports/preview");

  // ST-nhap-tep-mat-mang: the network drops on the next preview; nothing is written, the choices stay.
  await page.route("**/api/v1/imports/preview", (r) => r.abort("internetdisconnected"));
  await page.getByLabel(C.drop).setInputFiles(join(FIX, "gon.xlsx"));
  await cell("ST-nhap-tep-mat-mang", page.locator('[data-state="banner-offline"]'));
  await expect(page.locator('[data-state="banner-offline"]')).toContainText(C.offline);
  await page.unroute("**/api/v1/imports/preview");
  await page.getByRole("button", { name: C.retry }).click();
  await expect(page.locator('[data-state="banner-offline"]')).toHaveCount(0);

  // ST-nhap-tep-xung-dot: the company layer changed since the preview.
  await toPreview(page);
  await page.route("**/api/v1/imports", (r) =>
    r.request().method() === "POST"
      ? r.fulfill({ status: 409, json: { error: "counts-changed" } })
      : r.continue(),
  );
  await page.getByRole("button", { name: C.apply(3, 0) }).click();
  await cell("ST-nhap-tep-xung-dot", page.getByText(C.changed));
  await page.unroute("**/api/v1/imports");

  // ST-nhap-tep-xong: the import is written; the count is the server's.
  await page.getByRole("button", { name: C.apply(3, 0) }).click();
  await cell("ST-nhap-tep-xong", page.locator('[data-state="xong"]'));
  await expect(page.locator('[data-state="xong"]')).toContainText(C.done(3));

  // ST-nhap-tep-hoan-tac-loi: the undo fails on the server; the screen says so and keeps the import.
  await page.route("**/api/v1/imports/*/undo", (r) =>
    r.fulfill({ status: 500, json: { error: "internal" } }),
  );
  await page.getByRole("button", { name: C.undo }).click();
  await cell("ST-nhap-tep-hoan-tac-loi", page.getByText(C.undoFailed));
  await page.unroute("**/api/v1/imports/*/undo");
  // «Thử lại» beside the sentence runs the undo again (not the preview).
  await page.locator('[data-state="hoan-tac-loi"]').getByRole("button", { name: C.retry }).click();
  await expect(page.getByText(C.undone)).toBeVisible();

  // ST-nhap-tep-cho-nguoi: a sheet with questions shows how many are left on the step bar.
  await choose(page, "sheet.csv");
  await expect(next(page)).toBeEnabled();
  await next(page).click();
  await cell("ST-nhap-tep-cho-nguoi", next(page));
  await expect(next(page)).toHaveText(/\(\d+\)$/);
  expect(Number(/\((\d+)\)$/.exec((await next(page).textContent()) ?? "")?.[1])).toBeGreaterThan(0);

  // ST-nhap-tep-con-chan: the dirty file without choices cannot be applied.
  await page.goto("/nhap-tep");
  await waitReady(page);
  await choose(page, "ban.xlsx");
  await expect(next(page)).toBeEnabled();
  await toPreview(page);
  await cell("ST-nhap-tep-con-chan", page.getByRole("button", { name: /^Còn \d+ chỗ chặn$/ }));
  await expect(page.getByRole("button", { name: /^Áp / })).toBeDisabled();

  // The recent imports list holds this run's undone import.
  await page.goto("/nhap-tep");
  await waitReady(page);
  await expect(page.locator('[data-state="gan-day"]')).toContainText("gon.xlsx");

  expect(cells.sort()).toEqual(
    [
      "ST-nhap-tep-con-chan",
      "ST-nhap-tep-cho-nguoi",
      "ST-nhap-tep-dang-doc",
      "ST-nhap-tep-hoan-tac-loi",
      "ST-nhap-tep-khong-quyen",
      "ST-nhap-tep-mac-dinh",
      "ST-nhap-tep-mat-mang",
      "ST-nhap-tep-tep-loi",
      "ST-nhap-tep-tep-rong",
      "ST-nhap-tep-xong",
      "ST-nhap-tep-xung-dot",
    ].sort(),
  );
});

test("ban phim: Tab, arrows, Space and Enter take gon.xlsx to Xong", async ({ page }) => {
  test.skip(test.info().project.name !== "1440", "one width: the keyboard case runs at 1440");
  await openScreen(page);
  await page.getByLabel(C.drop).setInputFiles(join(FIX, "gon.xlsx"));
  await expect(next(page)).toBeEnabled();
  // From here on only keys: focus the next button by Tab and press Enter until the apply button, then Space.
  const tabTo = async (name: RegExp) => {
    for (let i = 0; i < 60; i += 1) {
      await page.keyboard.press("Tab");
      const focused = await page.evaluate(() => document.activeElement?.textContent ?? "");
      if (name.test(focused.trim())) return;
    }
    throw new Error(`keyboard never reached ${name}`);
  };
  for (const w of STEP_WORDS.slice(1, 4)) {
    await tabTo(new RegExp(`^${C.next}`));
    await page.keyboard.press("Enter");
    await expect(page.getByText(w, { exact: true }).first()).toBeVisible();
  }
  await tabTo(/^Áp /);
  await page.keyboard.press("Space");
  await expect(page.locator('[data-state="xong"]')).toContainText(C.done(3));
  // Leave the company as it was for the other widths.
  await page.getByRole("button", { name: C.undo }).click();
  await expect(page.getByText(C.undone)).toBeVisible();
});

test("chu dai: a long value keeps the page in its width and is read in full", async ({ page }) => {
  test.skip(test.info().project.name !== "1024", "one width: the narrowest the screen is used at");
  await openScreen(page);
  const long = `S1.01-0905 ${"[Tên] ghi chú rất dài của chủ nhà ".repeat(6)}`.trim();
  await choose(page, "dai.csv", `Mã căn,Toà\n"${long}",S1\n`);
  await expect(next(page)).toBeEnabled({ timeout: 10_000 });
  // The page fits (true), or the first leaf sticking out is named.
  const fits = () =>
    page.evaluate(() => {
      const w = document.documentElement.clientWidth;
      if (document.documentElement.scrollWidth <= w) return true;
      // The deepest box that sticks out while none of its children do: the one that pushes the page wider.
      const out = [...document.querySelectorAll("main *")].find(
        (e) =>
          e.getBoundingClientRect().right > w + 1 &&
          !e.closest("header") &&
          [...e.children].every((k) => k.getBoundingClientRect().right <= w + 1),
      );
      if (!out) return false;
      const chain: string[] = [];
      for (let e: Element | null = out; e && chain.length < 8; e = e.parentElement)
        chain.push(
          `${e.tagName.toLowerCase()}[${Math.round(e.getBoundingClientRect().right)}] ${String(e.getAttribute("class") ?? "").slice(0, 60)}`,
        );
      return chain.join(" < ");
    });
  for (let i = 0; i < 3; i += 1) {
    expect(await fits(), `page wider than the screen on step ${i + 2}`).toBe(true);
    if (!(await next(page).isEnabled())) break;
    await next(page).click();
  }
  expect(await fits(), "page wider than the screen").toBe(true);
  // Read in full: the whole value is on the page as text or as the cell's title, never cut away.
  const whole = await page.evaluate(
    (v) =>
      document.body.innerText.includes(v) ||
      [...document.querySelectorAll("[title]")].some((e) => e.getAttribute("title") === v),
    long,
  );
  expect(whole, "long value cut away").toBe(true);
});

/** Every number the preview step shows equals the server's answer, or the first that differs is named. */
async function screenCountsFault(
  page: Page,
  body: Record<string, unknown>,
): Promise<string | null> {
  const counts = body["counts"] as Record<string, number>;
  for (const m of ["keep", "fixed", "ask", "block"]) {
    const shown = Number(
      await page.locator(`[data-state="dem-dau"] [data-mark="${m}"]`).textContent(),
    );
    if (shown !== counts[m])
      return `screen counts differ from server: ${m} ${shown} != ${counts[m]}`;
  }
  return null;
}

test("so tren man bang so may chu: the preview and Xong show the server's numbers", async ({
  page,
}) => {
  test.skip(test.info().project.name !== "1440", "one width: the numbers do not depend on it");
  await openScreen(page);
  // The person's answers for ban.xlsx, as the database case gives them, with the new field left out (its cells are
  // sent by the screen's own choice); the test hands them to the server in place of clicks on every question.
  const answers = JSON.parse(readFileSync(join(FIX, "lua-chon.json"), "utf8")) as {
    columns: Record<string, unknown>;
  };
  answers.columns["7"] = { target: { skip: true } };
  let preview: Record<string, unknown> | null = null;
  let learned: string[] = [];
  const withAnswers = (r: Route) => {
    const sent = JSON.parse(r.request().postData() ?? "{}") as Record<string, unknown>;
    return JSON.stringify({ ...sent, choices: answers });
  };
  await page.route("**/api/v1/imports/preview", async (r) => {
    const res = await r.fetch({ postData: withAnswers(r) });
    preview = (await res.json()) as Record<string, unknown>;
    await r.fulfill({ response: res, json: preview });
  });
  await page.route("**/api/v1/imports", (r) =>
    r.request().method() === "POST" ? r.continue({ postData: withAnswers(r) }) : r.continue(),
  );
  await page.route("**/api/v1/imports/*/batches", async (r) => {
    const res = await r.fetch({ postData: withAnswers(r) });
    const json = (await res.json()) as { learned?: string[] };
    if (json.learned) learned = json.learned;
    await r.fulfill({ response: res, json });
  });

  await choose(page, "ban.xlsx");
  await expect(next(page)).toBeEnabled({ timeout: 10_000 });
  await toPreview(page);
  const last = preview as unknown as Record<string, unknown>;
  expect(await screenCountsFault(page, last)).toBeNull();
  const createCount = last["createCount"] as number;
  const keptCount = last["keptCount"] as number;
  expect(createCount, "ban.xlsx with the answers creates listings").toBeGreaterThan(0);
  await expect(page.getByRole("button", { name: C.apply(createCount, keptCount) })).toBeEnabled();

  await page.getByRole("button", { name: C.apply(createCount, keptCount) }).click();
  await expect(page.locator('[data-state="xong"]')).toContainText(C.done(createCount));
  if (keptCount > 0)
    await expect(page.locator('[data-state="giu-chu-goc"]')).toHaveText(C.keptCells(keptCount));
  const shownLearned = await page.locator('[data-state="vua-hoc"] li').allTextContents();
  expect(learned.length, "the answers teach the company something").toBeGreaterThan(0);
  expect(shownLearned).toEqual(learned);

  // Break: an answer whose «ask» count is one more than its cells — a screen counting its own cells would show the
  // cells' number; this one must show the server's.
  await page.unroute("**/api/v1/imports/preview");
  await page.route("**/api/v1/imports/preview", async (r) => {
    const res = await r.fetch({ postData: withAnswers(r) });
    const json = (await res.json()) as Record<string, unknown>;
    const counts = json["counts"] as Record<string, number>;
    preview = { ...json, counts: { ...counts, ask: counts["ask"]! + 1 } };
    await r.fulfill({ response: res, json: preview });
  });
  await page.goto("/nhap-tep");
  await waitReady(page);
  await choose(page, "ban.xlsx");
  await expect(next(page)).toBeEnabled({ timeout: 10_000 });
  await toPreview(page);
  expect(await screenCountsFault(page, preview as unknown as Record<string, unknown>)).toBeNull();
});

// ---- E15 · the inventory's way in, and the imported listings on it (AC-11) -------------------------------------------

/** Clears this file's company of listings (the cases before it leave some), so the inventory opens empty. */
async function emptyInventory(): Promise<void> {
  const db = new pg.Client({ connectionString: OWNER_URL });
  await db.connect();
  try {
    const company = "(select id from companies where name = $1)";
    await db.query(`delete from listing_units where company_id = ${company}`, [COMPANY]);
    await db.query(`delete from listing_pending_units where company_id = ${company}`, [COMPANY]);
    await db.query(`delete from listings where company_id = ${company}`, [COMPANY]);
    await db.query(
      `update company_pending_units set retired_at = now() where company_id = ${company} and retired_at is null`,
      [COMPANY],
    );
  } finally {
    await db.end();
  }
}

/** The import entries of the inventory a role must not have: rendered at all (hidden or not) counts. */
async function importEntryFault(page: Page, role: Role): Promise<string | null> {
  const n = await page.locator('main a[href="/nhap-tep"]').count();
  return n > 0 ? `import button rendered for ${role}` : null;
}

async function openInventoryAs(page: Page, role: Role) {
  await page.context().clearCookies();
  await openScreen(page, role);
  await page.goto("/inventory");
  await waitReady(page);
  await regionReady(page);
}

// A file with one code the catalog does not have: it becomes a pending unit, shown by the file's code and tower.
const FRAME_COPY_IMPORT = label("ImportScreen");
const PENDING_CODE = "ZZ-99.01";
const PENDING_TOWER = "Toà của tệp";
const E15_FILE = [
  "Mã căn,Toà,Giá chào,Trạng thái",
  "S1.01-0905,Sapphire 1,4650000000,Đang bán",
  "S1.01-0906,Sapphire 1,3900000000,Đang bán",
  `${PENDING_CODE},${PENDING_TOWER},2100000000,Đang bán`,
].join("\n");

test("bang hang trong: one Nạp tệp link in the empty sentence and an outline button, for importers only; the imported listings on the inventory", async ({
  page,
}) => {
  test.skip(test.info().project.name !== "1440", "one width: the entry does not depend on it");
  await makeWorld();
  await emptyInventory();
  const empty = page.locator('[data-slot="region-state"][data-kind="empty"]').first();

  // Đầu khách: the empty inventory, with neither the link nor the button — not drawn, not merely hidden.
  await openInventoryAs(page, "BuyerAgent");
  await expect(empty).toBeVisible();
  expect(await importEntryFault(page, "BuyerAgent")).toBeNull();
  // Break, in the test: an entry hidden by CSS instead of not drawn is caught.
  await suaTrang(page, () => {
    const a = document.createElement("a");
    a.href = "/nhap-tep";
    a.style.display = "none";
    document.querySelector('[data-slot="page-header"]')?.append(a);
  });
  expect(await importEntryFault(page, "BuyerAgent")).toBe("import button rendered for BuyerAgent");

  // Đầu chủ (the positive control): exactly one link in the empty sentence, no button there; the outline button above.
  await openInventoryAs(page, "ListAgent");
  await expect(empty).toBeVisible();
  const links = empty.getByRole("link");
  await expect(links).toHaveCount(1);
  await expect(links.first()).toHaveText(FRAME_COPY_IMPORT);
  await expect(links.first()).toHaveAttribute("href", "/nhap-tep");
  await expect(empty.getByRole("button")).toHaveCount(0);
  const head = page.locator('[data-slot="page-header-action"] a[href="/nhap-tep"]');
  await expect(head).toHaveText(FRAME_COPY_IMPORT);
  expect(await seriousAxe(page), "axe inventory empty").toEqual([]);

  // Through the button, the five steps, then back on the inventory: three listings, the pending one by its code.
  await head.click();
  await page.waitForURL("**/nhap-tep");
  await waitReady(page);
  await choose(page, "bang-hang.csv", E15_FILE);
  await expect(next(page)).toBeEnabled({ timeout: 10_000 });
  await toPreview(page);
  await page.getByRole("button", { name: /^Áp 3 dòng/ }).click();
  await expect(page.locator('[data-state="xong"]')).toContainText(C.done(3));
  await page.goto("/inventory");
  await waitReady(page);
  await regionReady(page);
  const rows = page.locator('[data-slot="data-region-body"] tbody tr[data-row-id]');
  await expect(rows).toHaveCount(3);
  const pending = rows.filter({
    has: page.locator("button[data-record-open]", { hasText: new RegExp(`^${PENDING_CODE}$`) }),
  });
  await expect(pending).toHaveCount(1);
  await expect(pending.locator('td[data-col-id="Listing.buildingName"]')).toHaveText(PENDING_TOWER);
  await emptyInventory();
});

// ---- E21 · a header learned by an import is the inventory's header (AC-3) --------------------------------------------

/**
 * Retires this file's company's own labels, so the inventory starts from the standard headers; with `templates`, its
 * import templates too, so the same file shape asks its column questions again.
 */
async function retireLabels(templates = false): Promise<void> {
  const db = new pg.Client({ connectionString: OWNER_URL });
  await db.connect();
  try {
    for (const t of templates ? ["company_labels", "company_import_templates"] : ["company_labels"])
      await db.query(
        `update ${t} set retired_at = now()
          where company_id = (select id from companies where name = $1) and retired_at is null`,
        [COMPANY],
      );
  } finally {
    await db.end();
  }
}

const towerHeader = (page: Page) =>
  page
    .locator(
      'thead th[data-col-id="Listing.buildingName"] [data-slot="sheet-header"] > :first-child',
    )
    .first();

/** The inventory's tower header against the one the import should have taught; null when they agree. */
async function learnedHeaderFault(page: Page, want: string): Promise<string | null> {
  const got = ((await towerHeader(page).textContent()) ?? "").trim();
  return got === want ? null : `inventory header is not the learned label: ${got} != ${want}`;
}

const BLOCK_FILE = E15_FILE.replace("Mã căn,Toà,", "Mã căn,Block,");

async function importBlockFile(page: Page, learn: boolean) {
  await page.goto("/nhap-tep");
  await waitReady(page);
  await choose(page, "block.csv", BLOCK_FILE);
  await expect(next(page)).toBeEnabled({ timeout: 10_000 });
  await next(page).click();
  const box = page.getByRole("checkbox", { name: C.learnLabel("Block") });
  await expect(box).toBeChecked();
  if (!learn) await box.uncheck();
  await next(page).click();
  await next(page).click();
  await expect(page.locator('[data-state="dem-dau"]')).toBeVisible();
  await page.getByRole("button", { name: /^Áp 3 dòng/ }).click();
  await expect(page.locator('[data-state="xong"]')).toContainText(C.done(3));
  await page.goto("/inventory");
  await waitReady(page);
  await regionReady(page);
}

test("nhan rieng tren bang hang: the header «Block» an import learns is the inventory's tower header", async ({
  page,
}) => {
  test.skip(test.info().project.name !== "1440", "one width: the header does not depend on it");
  await makeWorld();
  const standard = label("Building");
  // Unticked: nothing is learned, the inventory keeps the standard word (the control).
  await emptyInventory();
  await retireLabels(true);
  await page.context().clearCookies();
  await openScreen(page);
  await importBlockFile(page, false);
  expect(await learnedHeaderFault(page, standard)).toBeNull();
  // Ticked by default: the company learns «Block», and the inventory's tower column says it.
  await emptyInventory();
  await retireLabels(true);
  await importBlockFile(page, true);
  expect(await learnedHeaderFault(page, "Block")).toBeNull();
  // Break, in the test: the learned label taken back in the database mid-way is caught on the next read.
  await retireLabels();
  await page.reload();
  await waitReady(page);
  await regionReady(page);
  expect(await learnedHeaderFault(page, "Block")).toBe(
    `inventory header is not the learned label: ${standard} != Block`,
  );
  await emptyInventory();
});
