// Row 2c (luu-goc-nhin-cot-hai), evals E2, E5, E6, E7 on this lane's Postgres: a person arranges the inventory, saves
// the arrangement as a view in the App Shell's second column and opens it again.
//   saved view round trip — two filters, a sort, groups and two hidden columns; saved, then opened three ways
//     (the entry, a reload, a new browser session of the same person): rows, order, groups, columns equal, and the region
//     has no search box (row 2e); the requests sent and the stored row carry exactly the four things of a view
//     what was recorded, and the rows equal the set worked out here from the sample data. Break: groups dropped from the
//     stored view → «reopened view differs: groups».
//   save changes · save as new · reselect discards changes — E5, with its two breaks.
//   rename — E6, with its break.
//   remove — E7: the last item, a line before it, red; the confirmation starts on «Thôi»; Esc sends nothing.
//   phone sheet — 360: the view is in the sheet's second column on first paint and opens the same rows.
//   axe — E16: the inventory with a view in the second column and its «…» open, and with the remove confirmation open,
//     light and dark: no serious violation. Break: the «…» without its name → axe reports «button-name».
import { existsSync, readFileSync } from "node:fs";

import AxeBuilder from "@axe-core/playwright";
import { type Browser, type Locator, type Page, type TestInfo } from "@playwright/test";
import pg from "pg";

import { DB_URL, OUTBOX } from "../../playwright.db.config";
import { FRAME_COPY } from "../../src/components/templates/frame-copy";
import { label } from "../../src/modules/company-config";
import { sampleUnits, subdivisionNameOf } from "../../src/modules/catalog";
import { SAMPLE_COMPANY, buildSampleListings } from "../../src/modules/listings";
import { inventoryRows } from "../../src/modules/listings/ui/inventory-rows";
import { expect, test } from "../../tools/e2e_templates/fixture";
import { openSheet } from "../../tools/e2e_templates/settle";

const SAVE = label("SaveView");
const SAVE_CHANGES = label("SaveViewChanges");
const SAVE_AS_NEW = label("SaveAsNewView");
const RENAME = label("RenameView");
const REMOVE = label("RemoveView");
const ALL = `${FRAME_COPY.secondColumn.all} ${label("Listing").toLocaleLowerCase("vi")}`;
const NAME = "[MAU] Toà S1.01 đang bán";

let owner: pg.Client;
test.beforeAll(async () => {
  owner = new pg.Client({ connectionString: DB_URL });
  await owner.connect();
});
test.afterAll(async () => {
  await owner.end();
});

// ---- people and sign-in ---------------------------------------------------------------------------------------------

async function person(info: TestInfo, tag: string): Promise<{ email: string; id: string }> {
  const stamp = `${tag}-${info.project.name}-${Date.now()}`;
  const company = (
    await owner.query<{ id: string }>("insert into companies (name) values ($1) returning id", [
      `[Công ty ${tag}]`,
    ])
  ).rows[0]!.id;
  const email = `la-${stamp}@example.test`;
  const id = (
    await owner.query<{ id: string }>(
      "insert into identity.users (email, name) values ($1, $2) returning id",
      [email, "[Tên] LA"],
    )
  ).rows[0]!.id;
  await owner.query(
    "insert into company_members (company_id, user_id, name, roles) values ($1, $2, $3, $4)",
    [company, id, "[Tên] LA", ["ListAgent"]],
  );
  return { email, id };
}

function codes(email: string): string[] {
  if (!existsSync(OUTBOX)) return [];
  return readFileSync(OUTBOX, "utf8")
    .split("\n")
    .filter(Boolean)
    .map((l) => JSON.parse(l) as { email: string; text: string; kind?: string })
    .filter((m) => m.email === email && m.kind !== "invite")
    .map((m) => m.text);
}

async function signIn(page: Page, email: string, next = "/") {
  await page.context().clearCookies();
  const before = codes(email).length;
  await page.goto(`/login?next=${encodeURIComponent(next)}`);
  await expect(page.locator('[data-state="email"][data-ready]')).toBeVisible();
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Email").press("Enter");
  await expect(page.locator('[data-state="code"]')).toBeVisible();
  await expect.poll(() => codes(email).length, { timeout: 10_000 }).toBeGreaterThan(before);
  const code = codes(email)
    .at(-1)!
    .match(/\b\d{6}\b/)?.[0];
  if (!code) throw new Error(`thư tới ${email} không mang mã`);
  await page.getByLabel("Mã đăng nhập").fill(code);
  await page.getByLabel("Mã đăng nhập").press("Enter");
  await page.waitForURL((u) => u.pathname === new URL(next, "http://x").pathname);
}

// ---- the grid as a person sees it ------------------------------------------------------------------------------------

const region = (page: Page) => page.locator('[data-slot="data-region"]');
const secondColumn = (page: Page) => page.locator('[data-slot="app-shell-second-column"]');

/** Below 768 px the inventory shows listing cards, not a table (row 2b, _acceptance/bang-hang-the-dien-thoai). */
const onPhone = (page: Page) => (page.viewportSize()?.width ?? 1440) < 768;

async function settled(page: Page) {
  await expect(page.locator('[hidden][id^="S:"]')).toHaveCount(0);
  if (onPhone(page)) {
    await expect(region(page).locator('[data-slot="phone-card"]').first()).toBeVisible();
    return;
  }
  await expect(
    region(page).locator('[data-slot="data-region-body"] table[data-slot="data-grid-table"]'),
  ).toBeVisible();
}

/** What a reopened view must give back: unit codes in reading order, groups, shown headers; no search box (row 2e). */
interface Snapshot {
  units: string[];
  groups: string[];
  columns: string[];
  searchBoxes: number;
}

async function snapshot(page: Page): Promise<Snapshot> {
  await settled(page);
  // On a phone the same rows are cards, in the region's order; groups are the list's section heads; no headers.
  if (onPhone(page))
    return page.evaluate(() => ({
      units: [
        ...document.querySelectorAll('[data-slot="phone-card"] [data-slot="listing-card-unit"]'),
      ].map((el) => el.textContent?.trim() ?? ""),
      groups: [...document.querySelectorAll('[data-slot="phone-group"] h3 span:first-child')].map(
        (el) => el.textContent?.trim() ?? "",
      ),
      columns: [],
      searchBoxes: document.querySelectorAll(
        '[data-slot="data-region"] input[type="search"], [data-slot="data-region"] [role="searchbox"]',
      ).length,
    }));
  // The virtual body draws its rows once it has measured itself.
  await expect(
    region(page).locator('[data-slot="data-region-body"] tbody tr[data-row-id]').first(),
  ).toBeVisible();
  return page.evaluate(() => {
    const body = document.querySelector('[data-slot="data-region-body"]')!;
    const rows = [...body.querySelectorAll<HTMLElement>("tbody tr[data-row-id]")];
    return {
      units: rows
        .filter((r) => !r.dataset["rowId"]!.startsWith("nhom:"))
        .map(
          (r) => r.querySelector('td[data-col-id="Listing.unitNumber"]')?.textContent?.trim() ?? "",
        ),
      groups: rows
        .filter((r) => r.dataset["rowId"]!.startsWith("nhom:"))
        .map((r) => r.dataset["rowId"]!.slice("nhom:".length)),
      columns: [...body.querySelectorAll<HTMLElement>("thead tr:first-child th[data-col-id]")]
        .map((th) => th.dataset["colId"]!)
        .filter((id) => id.includes(".")),
      searchBoxes: document.querySelectorAll(
        '[data-slot="data-region"] input[type="search"], [data-slot="data-region"] [role="searchbox"]',
      ).length,
    };
  });
}

/** Throws naming the first part of the view that came back different. */
export function checkReopened(got: Snapshot, want: Snapshot): void {
  if (process.env["GOC_NHIN_DEBUG"]) console.log(JSON.stringify({ got, want }));
  for (const part of ["groups", "columns", "searchBoxes", "units"] as const) {
    if (JSON.stringify(got[part]) !== JSON.stringify(want[part]))
      throw new Error(`reopened view differs: ${part}`);
  }
}

/**
 * Types a rule into a filter box until it stays: the grid draws its table body again once it has measured its width (row
 * density, row 2a), so a rule typed in the first moments after the page opens may land in a box that is then replaced.
 */
async function fillStays(page: Page, box: Locator, value: string) {
  await expect(async () => {
    await box.fill(value);
    await page.waitForTimeout(300);
    await expect(box).toHaveValue(value, { timeout: 100 });
  }).toPass();
}

/** The arrangement of E1 built by hand: status Active (shortcut), Toà «S1.0», price high to low, groups, two columns hidden. The region has no search box (owner 2026-11-13, row 2e). */
async function arrange(page: Page) {
  await page.goto("/inventory?status=Active");
  await settled(page);
  await fillStays(page, region(page).getByLabel("Lọc cột Toà"), "S1.0");
  await region(page).locator('thead th[data-col-id="Listing.listPrice"] button').first().click();
  await page.getByRole("menuitem", { name: "Giảm dần" }).click();
  await region(page).locator('[data-slot="group-toggle"]').click();
  await region(page).getByRole("button", { name: "Cột", exact: true }).click();
  await page.getByRole("menuitemcheckbox", { name: label("Subdivision") }).click();
  await page.getByRole("menuitemcheckbox", { name: label("LastConfirmedAt") }).click();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("menu")).toBeHidden();
}

/** The same rows worked out from the sample data, without the grid's own rules. */
function expectedUnits(): string[] {
  const units = sampleUnits().map((u) => ({ ...u, subdivisionName: subdivisionNameOf(u) }));
  const { listings, listingUnits } = buildSampleListings({ companyId: SAMPLE_COMPANY.id, units });
  const rows = inventoryRows({ listings, listingUnits, units }).filter(
    (r) =>
      r["Listing.standardStatus"] === "Active" &&
      String(r["Listing.buildingName"]).toLowerCase().includes("s1.0"),
  );
  return rows.map((r) => String(r["Listing.unitNumber"])).sort();
}

async function saveAs(page: Page, name: string, button = SAVE) {
  await region(page).getByRole("button", { name: button }).click();
  const dialog = page.locator('[data-slot="view-name-dialog"]');
  await dialog.getByLabel("Tên").fill(name);
  await dialog.getByLabel("Tên").press("Enter");
  await expect(dialog).toBeHidden();
  await page.waitForURL((u) => u.searchParams.has("goc-nhin"));
  // On a phone the second column rides in the closed sheet; the entry is checked where it shows.
  if (await secondColumn(page).isVisible())
    await expect(entry(page, name)).toHaveAttribute("aria-current", "true");
}

const escaped = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
/** A view's entry; its accessible name may end with the «đã đổi» mark. */
const entry = (page: Page, name: string) =>
  secondColumn(page).getByRole("link", { name: new RegExp(`^${escaped(name)}( đã đổi)?$`) });

async function storedViews(userId: string) {
  return (
    await owner.query<{ id: string; name: string; view: Record<string, unknown> }>(
      "select id, name, view from saved_view where user_id = $1 order by created_at",
      [userId],
    )
  ).rows;
}

async function freshSession(browser: Browser, email: string, href: string): Promise<Snapshot> {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await signIn(page, email, href);
  const snap = await snapshot(page);
  await context.close();
  return snap;
}

// ---- E2 ---------------------------------------------------------------------------------------------------------------

/** The four things of a stored view (row 2c); a search text is not one of them (row 2e). */
const VIEW_KEYS = ["filters", "grouped", "hidden", "sort"];

/** Bodies of the requests that save or change a view, read as JSON. */
function savedViewBodies(page: Page): Record<string, unknown>[] {
  const bodies: Record<string, unknown>[] = [];
  page.on("request", (req) => {
    if (!req.url().includes("/api/v1/saved-views")) return;
    if (req.method() !== "POST" && req.method() !== "PATCH") return;
    try {
      bodies.push(JSON.parse(req.postData() ?? "{}") as Record<string, unknown>);
    } catch {
      bodies.push({});
    }
  });
  return bodies;
}

/** The view of the first body sent, to build the break from. */
const stored0 = (bodies: readonly Record<string, unknown>[]) =>
  (bodies[0]?.["view"] ?? {}) as Record<string, unknown>;

/** Throws when a request body or its view carries a search text. */
function checkNoQuery(bodies: readonly Record<string, unknown>[]): void {
  for (const body of bodies) {
    const view = (body["view"] ?? {}) as Record<string, unknown>;
    if ("query" in body || "query" in view) throw new Error("request carries search text");
  }
}

test("saved view round trip", async ({ page, browser }, info) => {
  test.skip(info.project.name !== "1440", "measured at 1440");
  const me = await person(info, "vong");
  const bodies = savedViewBodies(page);
  await signIn(page, me.email);
  await arrange(page);
  const before = await snapshot(page);
  expect(before.searchBoxes).toBe(0);
  expect([...before.units].sort()).toEqual(expectedUnits());
  expect(before.groups.length).toBeGreaterThan(1);
  expect(before.columns).not.toContain("Listing.subdivisionName");
  await saveAs(page, NAME);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(NAME);
  const href = new URL(page.url()).pathname + new URL(page.url()).search;

  // (a) another entry, then the view's entry
  await secondColumn(page).getByRole("link", { name: ALL, exact: true }).click();
  await page.waitForURL((u) => !u.searchParams.has("goc-nhin"));
  await entry(page, NAME).click();
  await page.waitForURL((u) => u.searchParams.has("goc-nhin"));
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(NAME);
  checkReopened(await snapshot(page), before);
  // (b) a reload
  await page.reload();
  checkReopened(await snapshot(page), before);
  // (c) a new session of the same person
  checkReopened(await freshSession(browser, me.email, href), before);

  // What was sent and stored: exactly the four things of a view, no search text.
  expect(bodies.length).toBeGreaterThan(0);
  expect(() => checkNoQuery(bodies)).not.toThrow();
  expect(() => checkNoQuery([...bodies, { view: { ...stored0(bodies), query: "0905" } }])).toThrow(
    "request carries search text",
  );
  const [stored] = await storedViews(me.id);
  expect(Object.keys(stored!.view).sort()).toEqual(VIEW_KEYS);

  // Break: the stored view loses its groups.
  await owner.query(
    "update saved_view set view = jsonb_set(view, '{grouped}', 'false') where user_id = $1",
    [me.id],
  );
  await page.reload();
  const broken = await snapshot(page);
  expect(() => checkReopened(broken, before)).toThrow("reopened view differs: groups");
});

// ---- E5 ---------------------------------------------------------------------------------------------------------------

test("save changes · save as new · reselect discards changes", async ({ page }, info) => {
  test.skip(info.project.name !== "1440", "measured at 1440");
  const me = await person(info, "doi");
  await signIn(page, me.email);
  await arrange(page);
  await saveAs(page, NAME);
  const saved = await snapshot(page);
  const changedMark = entry(page, NAME).locator('[data-slot="place-changed"]');

  // Reselect discards changes.
  await fillStays(page, region(page).getByLabel("Lọc cột Phòng ngủ"), "2");
  await expect(changedMark).toHaveCount(1);
  await entry(page, NAME).click();
  await expect(changedMark).toHaveCount(0);
  checkReopened(await snapshot(page), saved);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(NAME);
  // Break: had the grid kept its state on the same address, the rows would still be the filtered ones.
  const filtered = { ...saved, units: saved.units.slice(0, 1) };
  expect(() => checkReopened(filtered, saved)).toThrow("reopened view differs: units");
  const reselectKept = (s: Snapshot) => {
    if (JSON.stringify(s.units) !== JSON.stringify(saved.units))
      throw new Error("reselect kept unsaved changes");
  };
  expect(() => reselectKept(filtered)).toThrow("reselect kept unsaved changes");

  // Save changes.
  await fillStays(page, region(page).getByLabel("Lọc cột Phòng ngủ"), "2");
  await expect(changedMark).toHaveCount(1);
  const two = await snapshot(page);
  await region(page).getByRole("button", { name: SAVE_CHANGES }).click();
  await expect(changedMark).toHaveCount(0);
  await page.reload();
  checkReopened(await snapshot(page), two);
  const [row] = await storedViews(me.id);
  const overwritten = (v: Record<string, unknown>) => {
    const filters = v["filters"] as Record<string, unknown>;
    if (filters["Unit.bedroomsTotal"] !== "2") throw new Error("save changes did not overwrite");
  };
  overwritten(row!.view);
  expect(() =>
    overwritten({
      ...row!.view,
      filters: { ...(row!.view["filters"] as object), "Unit.bedroomsTotal": undefined },
    }),
  ).toThrow("save changes did not overwrite");

  // Save as new: the old view keeps its sort.
  await region(page).locator('thead th[data-col-id="Listing.listPrice"] button').first().click();
  await page.getByRole("menuitem", { name: "Tăng dần" }).click();
  await expect(changedMark).toHaveCount(1);
  await saveAs(page, "[MAU] Hai phòng ngủ", SAVE_AS_NEW);
  await expect(secondColumn(page).locator('[data-slot="second-column-trailing"]')).toHaveCount(2);
  await entry(page, NAME).click();
  await page.waitForURL((u) => u.searchParams.get("goc-nhin") === row!.id);
  checkReopened(await snapshot(page), two);
  const rows = await storedViews(me.id);
  expect(rows).toHaveLength(2);
  expect((rows[0]!.view["sort"] as { direction: string }[])[0]!.direction).toBe("desc");
  expect((rows[1]!.view["sort"] as { direction: string }[])[0]!.direction).toBe("asc");
});

// ---- E6 ---------------------------------------------------------------------------------------------------------------

test("rename", async ({ page }, info) => {
  test.skip(info.project.name !== "1440", "measured at 1440");
  const me = await person(info, "ten");
  await signIn(page, me.email);
  await arrange(page);
  await saveAs(page, NAME);
  const before = await snapshot(page);
  const [stored] = await storedViews(me.id);
  await secondColumn(page)
    .getByRole("button", { name: new RegExp(escaped(NAME)) })
    .click();
  await page.getByRole("menuitem", { name: RENAME }).click();
  const dialog = page.locator('[data-slot="view-name-dialog"]');
  await dialog.getByLabel("Tên").fill("[MAU] Khu S1");
  await dialog.getByLabel("Tên").press("Enter");
  await expect(dialog).toBeHidden();
  await expect(entry(page, "[MAU] Khu S1")).toHaveAttribute("aria-current", "true");
  checkReopened(await snapshot(page), before);
  await page.reload();
  await expect(entry(page, "[MAU] Khu S1")).toBeVisible();
  const [after] = await storedViews(me.id);
  expect(after!.name).toBe("[MAU] Khu S1");
  const viewKept = (v: unknown) => {
    if (JSON.stringify(v) !== JSON.stringify(stored!.view))
      throw new Error("rename changed the view");
  };
  viewKept(after!.view);
  expect(() => viewKept({})).toThrow("rename changed the view");

  // A long name (40 characters, the most a name may have) is cut with «…» on one line and shown whole on hover.
  const LONG = "[MAU] Toà S1.01 và S1.02 đang bán gấp ạ!";
  expect([...LONG]).toHaveLength(40);
  await secondColumn(page)
    .getByRole("button", { name: /Khu S1/ })
    .click();
  await page.getByRole("menuitem", { name: RENAME }).click();
  await dialog.getByLabel("Tên").fill(LONG);
  await dialog.getByLabel("Tên").press("Enter");
  await expect(dialog).toBeHidden();
  const long = entry(page, LONG);
  await expect(long).toHaveAttribute("title", LONG);
  const cut = await long.locator("span.truncate").evaluate((el) => ({
    cut: el.scrollWidth > el.clientWidth,
    lines: Math.round(
      el.getBoundingClientRect().height / parseFloat(getComputedStyle(el).lineHeight),
    ),
  }));
  expect(cut).toEqual({ cut: true, lines: 1 });
});

// ---- E7 ---------------------------------------------------------------------------------------------------------------

test("remove", async ({ page }, info) => {
  test.skip(info.project.name !== "1440", "measured at 1440");
  const me = await person(info, "xoa");
  await signIn(page, me.email);
  await arrange(page);
  await saveAs(page, NAME);
  const href = new URL(page.url()).pathname + new URL(page.url()).search;
  const more = secondColumn(page).getByRole("button", {
    name: new RegExp(escaped(NAME)),
  });

  await more.click();
  const items = page.getByRole("menuitem");
  await expect(items.last()).toHaveText(REMOVE);
  await expect(page.getByRole("menu").locator('[role="separator"]')).toHaveCount(1);
  const colors = await items.last().evaluate((el) => {
    const probe = document.createElement("span");
    probe.style.color = "var(--destructive)";
    document.body.append(probe);
    const want = getComputedStyle(probe).color;
    probe.remove();
    return { got: getComputedStyle(el).color, want };
  });
  expect(colors.got).toBe(colors.want);

  let deletes = 0;
  page.on("request", (r) => {
    if (r.method() === "DELETE" && r.url().includes("/api/v1/saved-views/")) deletes += 1;
  });
  await items.last().click();
  const confirm = page.getByRole("alertdialog").or(page.getByRole("dialog"));
  await expect(confirm).toBeVisible();
  const focusOnCancel = (text: string | null) => {
    if (text?.trim() !== FRAME_COPY.confirm.cancel) throw new Error("confirm focus not on cancel");
  };
  // The dialog moves focus once it has opened; wait for it to land, then check where.
  await expect
    .poll(() =>
      page.evaluate(
        () => document.activeElement?.closest('[role="dialog"], [role="alertdialog"]') !== null,
      ),
    )
    .toBe(true);
  focusOnCancel(await page.evaluate(() => document.activeElement?.textContent ?? null));
  expect(() => focusOnCancel(REMOVE)).toThrow("confirm focus not on cancel");
  await page.keyboard.press("Escape");
  await expect(confirm).toBeHidden();
  expect(deletes).toBe(0);

  await more.click();
  await page.getByRole("menuitem", { name: REMOVE }).click();
  await confirm.getByRole("button", { name: REMOVE }).click();
  await page.waitForURL((u) => u.pathname === "/inventory" && !u.searchParams.has("goc-nhin"));
  await expect(entry(page, NAME)).toHaveCount(0);
  await expect(secondColumn(page).getByRole("link", { name: ALL, exact: true })).toHaveAttribute(
    "aria-current",
    "true",
  );
  expect(await storedViews(me.id)).toHaveLength(0);

  await page.goto(href);
  await expect(page.locator('[data-slot="saved-view-missing"]')).toContainText(
    `${label("SavedView")} này không còn`,
  );
  await expect(region(page).locator('[data-slot="region-footer-count"]')).toHaveText("60 dòng");

  // Removing a view that is not open keeps the place.
  await arrange(page);
  await saveAs(page, "[MAU] Một");
  await arrange(page);
  await saveAs(page, "[MAU] Hai");
  const here = page.url();
  await secondColumn(page)
    .getByRole("button", { name: /\[MAU\] Một/ })
    .click();
  await page.getByRole("menuitem", { name: REMOVE }).click();
  await confirm.getByRole("button", { name: REMOVE }).click();
  await expect(entry(page, "[MAU] Một")).toHaveCount(0);
  expect(page.url()).toBe(here);
});

// ---- E2, phone ---------------------------------------------------------------------------------------------------------

test("phone sheet", { tag: "@cho" }, async ({ page }, info) => {
  test.skip(info.project.name !== "360", "measured at 360");
  const me = await person(info, "dt");
  await page.setViewportSize({ width: 1440, height: 900 });
  await signIn(page, me.email);
  await arrange(page);
  await saveAs(page, NAME);
  const wide = await snapshot(page);
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/inventory");
  await settled(page);
  await openSheet(page);
  const link = page.getByRole("dialog").getByRole("link", { name: NAME, exact: true });
  await expect(link).toBeVisible();
  await link.click();
  await expect(page.getByRole("dialog")).toBeHidden();
  await page.waitForURL((u) => u.searchParams.has("goc-nhin"));
  expect((await snapshot(page)).units).toEqual(wide.units);
});

// ---- E16 --------------------------------------------------------------------------------------------------------------

async function seriousViolations(page: Page): Promise<string[]> {
  const { violations } = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .exclude("nextjs-portal")
    .analyze();
  return violations
    .filter((v) => v.impact === "serious" || v.impact === "critical")
    .map((v) => v.id);
}

test.describe("axe", () => {
  // Written ahead: 2 states × 2 schemes = 4 cells, at 1440.
  const STATES: [string, (page: Page) => Promise<void>][] = [
    [
      "«…» of a view open",
      async (page) => {
        await secondColumn(page)
          .getByRole("button", { name: new RegExp(escaped(NAME)) })
          .click();
        await expect(page.getByRole("menu")).toBeVisible();
      },
    ],
    [
      "remove confirmation open",
      async (page) => {
        await secondColumn(page)
          .getByRole("button", { name: new RegExp(escaped(NAME)) })
          .click();
        await page.getByRole("menuitem", { name: REMOVE }).click();
        await expect(page.getByRole("alertdialog").or(page.getByRole("dialog"))).toBeVisible();
      },
    ],
  ];

  for (const scheme of ["light", "dark"] as const)
    for (const [name, open] of STATES)
      test(`no serious violations: ${scheme}, ${name}`, async ({ page }, info) => {
        test.skip(info.project.name !== "1440", "measured at 1440");
        expect(STATES.length * 2).toBe(4);
        const me = await person(info, `axe-${scheme}`);
        await signIn(page, me.email);
        await arrange(page);
        await saveAs(page, NAME);
        await page.emulateMedia({ colorScheme: scheme });
        // What is measured must be on screen first: a scan of a screen without it would pass on nothing.
        await expect(
          secondColumn(page).locator('[data-slot="second-column-trailing"]'),
        ).toHaveCount(1);
        await open(page);
        await page.waitForTimeout(200);
        expect(await seriousViolations(page)).toEqual([]);
      });

  test("axe catches a «…» without a name", async ({ page }, info) => {
    test.skip(info.project.name !== "1440", "measured at 1440");
    const me = await person(info, "axe-ten");
    await signIn(page, me.email);
    await arrange(page);
    await saveAs(page, NAME);
    await secondColumn(page)
      .locator('[data-slot="row-actions"]')
      .first()
      .evaluate((el) => el.removeAttribute("aria-label"));
    expect(await seriousViolations(page)).toContain("button-name");
  });
});

// ---- E15 frames ---------------------------------------------------------------------------------------------------------

// Frames for the ui-check E15, taken only when asked (GOC_NHIN_ANH=1): at each width and both themes, the second column
// with the views group and an open view marked «đã đổi», the region's toolbar with both save buttons (taken before the
// phone sheet covers it), the «…» menu, the naming dialog and the remove confirmation. On 360 and 414 the second column rides in the phone sheet, opened first.
test("E15 frames", { tag: "@cho" }, async ({ page }, info) => {
  test.skip(!process.env["GOC_NHIN_ANH"], "frames only when asked");
  const dir = "_acceptance/luu-goc-nhin-cot-hai/evidence";
  const width = info.project.name;
  const phone = Number(width) < 768;
  const me = await person(info, `anh-${width}`);
  await signIn(page, me.email);
  await arrange(page);
  await saveAs(page, NAME);
  await saveAs(page, "[MAU] Hai phòng ngủ");
  // On a phone the view opens by its address, so the sheet is closed and settled before the frames open it.
  if (phone) {
    const first = (await storedViews(me.id)).find((v) => v.name === NAME)!;
    await page.goto(`/inventory?goc-nhin=${first.id}`);
  } else await entry(page, NAME).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(NAME);
  await fillStays(page, region(page).getByLabel("Lọc cột Phòng ngủ"), "2");
  await expect(region(page).getByRole("button", { name: SAVE_CHANGES })).toBeVisible();
  for (const scheme of ["light", "dark"] as const) {
    await page.emulateMedia({ colorScheme: scheme });
    const shot = async (state: string) => {
      await page.waitForTimeout(250);
      await page.screenshot({
        path: `${dir}/E15-${width}-${scheme === "light" ? "sang" : "toi"}-${state}.png`,
      });
    };
    // The region's toolbar with both save buttons, before anything covers it (on a phone the sheet would).
    await expect(region(page).getByRole("button", { name: SAVE_CHANGES })).toBeInViewport();
    await shot("thanh-cong-cu");
    if (phone) await openSheet(page);
    await shot("cot-thu-hai");
    const column = phone ? page.getByRole("dialog") : secondColumn(page);
    await column.getByRole("button", { name: new RegExp(escaped(NAME)) }).click();
    await expect(page.getByRole("menu")).toBeVisible();
    await shot("menu");
    await page.getByRole("menuitem", { name: REMOVE }).click();
    await shot("xac-nhan-xoa");
    await page.keyboard.press("Escape");
    if (phone) await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await region(page).getByRole("button", { name: SAVE_AS_NEW }).click();
    await expect(page.locator('[data-slot="view-name-dialog"]')).toBeVisible();
    await shot("hop-dat-ten");
    await page.keyboard.press("Escape");
    await expect(page.locator('[data-slot="view-name-dialog"]')).toHaveCount(0);
  }
});

// ---- row 2e, E10: an old address with search text ----------------------------------------------------------------------

test("old address: a search parameter filters nothing and is never sent", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "1440", "measured at 1440");
  const me = await person(info, "cu");
  const bodies = savedViewBodies(page);
  await signIn(page, me.email);
  await page.goto("/inventory?q=0905&query=0905");
  await settled(page);
  const footer = region(page).locator('[data-slot="region-footer-count"]');
  /** The old parameters left the grid whole: every row, every filter box empty. */
  const checkWhole = async () => {
    const text = (await footer.textContent())?.trim() ?? "";
    const filled = await region(page)
      .locator('[data-slot="column-filter"] input')
      .evaluateAll((els) => els.filter((el) => (el as HTMLInputElement).value !== "").length);
    if (text !== "60 dòng" || filled > 0) throw new Error("old search param filtered rows");
  };
  await expect(footer).toHaveText("60 dòng");
  await expect(checkWhole()).resolves.toBeUndefined();
  await expect(region(page).locator('input[type="search"]')).toHaveCount(0);
  await saveAs(page, NAME);
  expect(() => checkNoQuery(bodies)).not.toThrow();
  const [stored] = await storedViews(me.id);
  expect(Object.keys(stored!.view).sort()).toEqual(VIEW_KEYS);

  // Break: the old parameter read into the Căn filter, as a grid that still honoured it would.
  await page.goto("/inventory?q=0905&query=0905");
  await settled(page);
  await fillStays(page, region(page).getByLabel("Lọc cột Căn"), "0905");
  await expect(checkWhole()).rejects.toThrow("old search param filtered rows");

  // Break: a request that carries the search text anyway is refused by the door (row 2c's rule, unchanged).
  const refused = await page.request.post("/api/v1/saved-views", {
    data: {
      screen: "inventory",
      name: "[MAU] Còn chữ tìm",
      view: { filters: {}, sort: [], grouped: false, hidden: [], query: "0905" },
    },
  });
  expect(refused.status()).toBe(400);
});
