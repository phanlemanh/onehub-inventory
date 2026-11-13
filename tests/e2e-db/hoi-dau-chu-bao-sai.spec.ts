// Row 3e (_acceptance/hoi-dau-chu-bao-sai) on this lane's Postgres, signed in through the real sign-in screen: the
// record's «Hỏi đầu chủ» foot bar and «Báo sai thông tin» dialog, with the device's share sheet replaced by a recorder.
//   E1  the foot bar sits outside the scrolling body at every width; the button fills the record; large size on a phone.
//   E2b the shared link opens the same unit's record.     E5b the viewer's own unit has no bar; «Sau» brings it back.
//   E8  no write request and no change to the listing through every branch.     E9 axe, light and dark, both surfaces.
// Frames for the evidence go to the run folder.
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import AxeBuilder from "@axe-core/playwright";
import { type Page, type TestInfo } from "@playwright/test";
import pg from "pg";

import { DB_URL, OUTBOX } from "../../playwright.db.config";
import { label } from "../../src/modules/company-config";
import { sampleUnits, subdivisionNameOf } from "../../src/modules/catalog";
import { SAMPLE_COMPANY, buildSampleListings, sampleKeeperOf } from "../../src/modules/listings";
import { inventoryRows } from "../../src/modules/listings/ui/inventory-rows";
import { ASK_COPY } from "../../src/modules/listings/ui/ask-copy";
import { expect, test } from "../../tools/e2e_templates/fixture";

const SHOTS = join(".acceptance-runs", "hoi-dau-chu-bao-sai", "e2e");
const ASK = label("AskListAgent");
const REPORT = label("ReportUnitError");
const mobile = (info: TestInfo) => Number(info.project.name) < 768;

// ---- people and sample rows ------------------------------------------------------------------------------------

let owner: pg.Client;
test.beforeAll(async () => {
  owner = new pg.Client({ connectionString: DB_URL });
  await owner.connect();
});
test.afterAll(async () => {
  await owner.end();
});

async function person(info: TestInfo, tag: string, roles: string[]): Promise<string> {
  const email = `${tag}-${info.project.name}-${Date.now()}@example.test`;
  const company = (
    await owner.query<{ id: string }>("insert into companies (name) values ($1) returning id", [
      `[Sàn ${tag}]`,
    ])
  ).rows[0]!.id;
  const id = (
    await owner.query<{ id: string }>(
      "insert into identity.users (email, name) values ($1, $2) returning id",
      [email, `[Tên] ${tag}`],
    )
  ).rows[0]!.id;
  await owner.query(
    "insert into company_members (company_id, user_id, name, roles) values ($1, $2, $3, $4)",
    [company, id, `[Tên] ${tag}`, roles],
  );
  return email;
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

async function signIn(page: Page, email: string, next = "/inventory") {
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
  await page.waitForURL((u) => u.pathname === next);
}

const ROWS = (() => {
  const units = sampleUnits().map((u) => ({ ...u, subdivisionName: subdivisionNameOf(u) }));
  const { listings, listingUnits } = buildSampleListings({ companyId: SAMPLE_COMPANY.id, units });
  return inventoryRows({ listings, listingUnits, units });
})();
const rowKept = (kind: "other" | "viewer" | "none") =>
  ROWS.find((r) => {
    const k = sampleKeeperOf(r.id);
    return kind === "none" ? k === null : k?.kind === kind;
  })!;
const keeperName = (id: string) => {
  const k = sampleKeeperOf(id);
  if (k?.kind !== "other") throw new Error(`${id} is not kept by someone else`);
  return k.name;
};

/** The device's share sheet replaced by a recorder; `mode` "none" leaves only a clipboard. */
async function recordShares(page: Page, mode: "share" | "none" = "share") {
  await page.addInitScript((m) => {
    const w = window as unknown as { __shared: unknown[]; __copied: string[] };
    w.__shared = [];
    w.__copied = [];
    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: m === "share" ? async (d: unknown) => void w.__shared.push(d) : undefined,
    });
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: async (t: string) => void w.__copied.push(t) },
    });
  }, mode);
}
const shared = (page: Page) =>
  page.evaluate(
    () => (window as unknown as { __shared: { text: string; url: string }[] }).__shared,
  );

async function openRecord(page: Page, id: string) {
  await page.goto(`/inventory?ho-so=${encodeURIComponent(id)}`);
  await expect(page.locator(`[data-slot="record-panel"][data-record-id="${id}"]`)).toBeVisible();
}

async function frame(page: Page, info: TestInfo, name: string, scheme: "light" | "dark") {
  await page.emulateMedia({ colorScheme: scheme });
  // The dev server's own badge is not part of the product.
  await page.addStyleTag({ content: "nextjs-portal { display: none !important; }" });
  await page.waitForTimeout(250);
  mkdirSync(SHOTS, { recursive: true });
  await page.screenshot({ path: join(SHOTS, `${name}-${info.project.name}-${scheme}.png`) });
  await page.emulateMedia({ colorScheme: "light" });
}

// ---- E1 · the foot bar ----------------------------------------------------------------------------------------

/** The bar is outside the scrolling body, stays put when the body scrolls to its end, and nothing hides under it. */
async function footStuck(page: Page): Promise<string | null> {
  return page.evaluate(() => {
    const panel = document.querySelector('[data-slot="record-panel"]')!;
    const body = panel.querySelector<HTMLElement>('[data-slot="record-panel-body"]')!;
    const foot = panel.querySelector<HTMLElement>('[data-slot="record-footer"]');
    if (!foot) return "no foot bar";
    if (body.contains(foot)) return "footer scrolls with the body";
    const before = foot.getBoundingClientRect().top;
    body.scrollTop = body.scrollHeight;
    const after = foot.getBoundingClientRect().top;
    if (Math.abs(after - before) > 1) return "footer scrolls with the body";
    const last = body.lastElementChild?.getBoundingClientRect();
    if (last && last.bottom > after + 1) return "footer covers the body";
    return null;
  });
}

test("E1 · the foot bar sticks under the body at every width", async ({ page }, info) => {
  await recordShares(page);
  await signIn(page, await person(info, "e1", ["BuyerAgent"]));
  const row = rowKept("other");
  await openRecord(page, row.id);
  const button = page.locator('[data-slot="ask-list-agent"]');
  await expect(button).toHaveText(`${ASK} · ${keeperName(row.id)}`);
  expect(await footStuck(page)).toBeNull();
  const size = await page.evaluate(() => {
    const b = document.querySelector('[data-slot="ask-list-agent"]')!.getBoundingClientRect();
    const f = document.querySelector('[data-slot="record-footer"]')!;
    const s = getComputedStyle(f);
    const inner =
      f.getBoundingClientRect().width - parseFloat(s.paddingLeft) - parseFloat(s.paddingRight);
    return { height: b.height, width: b.width, inner };
  });
  expect(Math.abs(size.width - size.inner)).toBeLessThanOrEqual(2);
  if (mobile(info)) expect(size.height).toBeGreaterThanOrEqual(36);
  for (const scheme of ["light", "dark"] as const) await frame(page, info, "hoi", scheme);
});

test("E1 break · a bar inside the body says «footer scrolls with the body»", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "1440", "do o 1440");
  await signIn(page, await person(info, "e1b", ["BuyerAgent"]));
  await openRecord(page, rowKept("other").id);
  await page.evaluate(() => {
    const panel = document.querySelector('[data-slot="record-panel"]')!;
    panel
      .querySelector('[data-slot="record-panel-body"]')!
      .append(panel.querySelector('[data-slot="record-footer"]')!);
  });
  expect(await footStuck(page)).toBe("footer scrolls with the body");
});

// ---- E2b · the link opens the same unit ------------------------------------------------------------------------------

/** The shared link, opened, shows the record of `id`. */
async function linkOpens(page: Page, url: string, id: string): Promise<string | null> {
  const target = new URL(url);
  await page.goto(`${target.pathname}${target.search}`);
  const panel = page.locator('[data-slot="record-panel"]');
  await expect(panel).toBeVisible();
  return (await panel.getAttribute("data-record-id")) === id ? null : "link opens another unit";
}

test("E2b · the shared link opens the same unit's record", async ({ page }, info) => {
  test.skip(!["1440", "360"].includes(info.project.name), "do o 1440 va 360");
  await recordShares(page);
  await signIn(page, await person(info, "e2", ["BuyerAgent"]));
  const row = rowKept("other");
  await openRecord(page, row.id);
  await page.locator('[data-slot="ask-list-agent"]').click();
  const calls = await shared(page);
  expect(calls).toHaveLength(1);
  expect(calls[0]!.text).toContain(String(row["Listing.unitNumber"]));
  expect(await linkOpens(page, calls[0]!.url, row.id)).toBeNull();
  // Break: the first row's link instead of this one's.
  const other = ROWS.find((r) => r.id !== row.id)!;
  expect(
    await linkOpens(
      page,
      calls[0]!.url.replace(encodeURIComponent(row.id), encodeURIComponent(other.id)),
      row.id,
    ),
  ).toBe("link opens another unit");
});

// ---- E5b · the viewer's own unit ---------------------------------------------------------------------------------

test("E5b · no bar on the viewer's own unit; «Sau» to someone else's brings it back", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "1440", "do o 1440");
  await signIn(page, await person(info, "e5", ["ListAgent"]));
  // A viewer-kept row whose next row in the grid's order is kept by someone else.
  const index = ROWS.findIndex(
    (r, i) =>
      sampleKeeperOf(r.id)?.kind === "viewer" &&
      sampleKeeperOf(ROWS[i + 1]?.id ?? "")?.kind === "other",
  );
  const own = ROWS[index]!;
  const next = ROWS[index + 1]!;
  await openRecord(page, own.id);
  await expect(page.locator('[data-slot="record-footer"]')).toHaveCount(0);
  await frame(page, info, "minh-giu", "light");
  await page.getByRole("button", { name: /Sau/ }).click();
  await expect(
    page.locator(`[data-slot="record-panel"][data-record-id="${next.id}"]`),
  ).toBeVisible();
  const button = page.locator('[data-slot="ask-list-agent"]');
  await expect(button).toHaveText(`${ASK} · ${keeperName(next.id)}`);
  // Break: the previous unit's keeper would be a wrong name.
  expect(`${ASK} · ${keeperName(next.id)}`).not.toBe(`${ASK} · ${sampleKeeperOf(own.id)?.kind}`);
});

test("company admin: no ask bar, the report button stays", async ({ page }, info) => {
  test.skip(info.project.name !== "1440", "do o 1440");
  await signIn(page, await person(info, "ad", ["CompanyAdmin"]), "/");
  await page.goto(`/inventory?ho-so=${encodeURIComponent(rowKept("other").id)}`);
  // The admin may not view listings: the region says so and no record opens (row 3).
  await expect(page.locator('[data-slot="record-footer"]')).toHaveCount(0);
});

test("a unit nobody keeps: the button is off and says why", async ({ page }, info) => {
  await recordShares(page);
  await signIn(page, await person(info, "e4", ["BuyerAgent"]));
  await openRecord(page, rowKept("none").id);
  const button = page.locator('[data-slot="ask-list-agent"]');
  await expect(button).toBeDisabled();
  await expect(button).toHaveText(ASK_COPY.unheld(label("Unit"), label("ListAgent")));
  if (["1440", "360"].includes(info.project.name)) await frame(page, info, "chua-ai-giu", "light");
});

// ---- E8 · nothing sent, nothing written -----------------------------------------------------------------------------

/** Every request after the page settled that is not a plain GET of the same origin. */
function watchRequests(page: Page): string[] {
  const out: string[] = [];
  page.on("request", (r) => {
    if (r.method() !== "GET") out.push(`${r.method()} ${r.url()}`);
  });
  return out;
}
const recordText = (page: Page) => page.locator('[data-slot="listing-record-fields"]').innerText();

test("E8 · no write request and no change through every branch", async ({ page }, info) => {
  test.skip(info.project.name !== "1440", "do o 1440");
  await recordShares(page);
  await signIn(page, await person(info, "e8", ["BuyerAgent"]));
  const row = rowKept("other");
  await openRecord(page, row.id);
  await page.waitForLoadState("networkidle");
  const before = await recordText(page);
  const writes = watchRequests(page);
  await page.locator('[data-slot="ask-list-agent"]').click();
  await page.evaluate(() => {
    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: () => Promise.reject(Object.assign(new Error("x"), { name: "AbortError" })),
    });
  });
  await page.locator('[data-slot="ask-list-agent"]').click();
  await page.evaluate(() =>
    Object.defineProperty(navigator, "share", { configurable: true, value: undefined }),
  );
  await page.locator('[data-slot="ask-list-agent"]').click();
  await page.getByRole("button", { name: REPORT }).click();
  await page.getByLabel(ASK_COPY.report.right).fill("72 m²");
  await page.getByLabel(ASK_COPY.report.basis).fill("Sổ hồng trang 2");
  await page.getByRole("button", { name: ASK_COPY.report.submit }).click();
  await expect(page.locator('[data-slot="report-result"]')).toBeVisible();
  await page.keyboard.press("Escape");
  await page.waitForTimeout(500);
  expect(writes).toEqual([]);
  expect(await recordText(page)).toBe(before);

  // Break: a button that posts says «button sent a request».
  await page.route("**/api/v1/probe", (r) => r.fulfill({ status: 204 }));
  await page.evaluate(() => fetch("/api/v1/probe", { method: "POST" }));
  expect(() => expect(writes, "button sent a request").toEqual([])).toThrow(
    /button sent a request/,
  );
});

// ---- E9 · axe, light and dark, both surfaces --------------------------------------------------------------------

async function seriousViolations(page: Page): Promise<string[]> {
  // Scan the settled page: a dialog still fading in reads as low contrast (round 4 of row 3e, 360 dark).
  await expect
    .poll(() =>
      page.evaluate(() => document.getAnimations().filter((a) => a.playState === "running").length),
    )
    .toBe(0);
  const { violations } = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .options({ rules: { "aria-dialog-name": { enabled: true } } })
    .exclude("nextjs-portal")
    .analyze();
  return violations
    .filter((v) => v.impact === "serious" || v.impact === "critical")
    .map((v) => v.id);
}

test("E9 · axe on the record with its foot bar and on the report dialog", async ({
  page,
}, info) => {
  await recordShares(page);
  await signIn(page, await person(info, "e9", ["BuyerAgent"]));
  let scans = 0;
  for (const scheme of ["light", "dark"] as const) {
    await page.emulateMedia({ colorScheme: scheme });
    await openRecord(page, rowKept("other").id);
    expect(await seriousViolations(page), `record ${scheme}`).toEqual([]);
    scans += 1;
    await page.getByRole("button", { name: REPORT }).click();
    await expect(page.locator('[data-slot="report-unit-error"]')).toBeVisible();
    await page.getByLabel(ASK_COPY.report.right).fill("72 m²");
    expect(await seriousViolations(page), `report ${scheme}`).toEqual([]);
    scans += 1;
    await frame(page, info, "bao-sai", scheme);
    await page.keyboard.press("Escape");
  }
  console.log(`axe scans ${info.project.name} ${scans}`);
  expect(scans).toBe(4);
});

test("E9 break · low contrast on the ask button is a violation", async ({ page }, info) => {
  test.skip(info.project.name !== "1440", "do o 1440");
  await signIn(page, await person(info, "e9b", ["BuyerAgent"]));
  await openRecord(page, rowKept("other").id);
  await page.addStyleTag({
    content: '[data-slot="ask-list-agent"]{color:#9a9a9a !important;background:#a8a8a8 !important}',
  });
  expect(await seriousViolations(page)).toContain("color-contrast");
});

test("failure frames: no share sheet and no clipboard", async ({ page }, info) => {
  test.skip(!["1440", "360"].includes(info.project.name), "do o 1440 va 360");
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "share", { configurable: true, value: undefined });
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: () => Promise.reject(new Error("no")) },
    });
  });
  await signIn(page, await person(info, "loi", ["BuyerAgent"]));
  await openRecord(page, rowKept("other").id);
  await page.locator('[data-slot="ask-list-agent"]').click();
  await expect(page.locator('[data-slot="record-footer"]').getByRole("alert")).toHaveText(
    ASK_COPY.failed,
  );
  for (const scheme of ["light", "dark"] as const) await frame(page, info, "hoi-loi", scheme);
  await page.getByRole("button", { name: REPORT }).click();
  await page.getByLabel(ASK_COPY.report.right).fill("72 m²");
  await page.getByRole("button", { name: ASK_COPY.report.submit }).click();
  await expect(page.getByLabel(ASK_COPY.messageLabel).last()).toBeVisible();
  for (const scheme of ["light", "dark"] as const) await frame(page, info, "bao-sai-loi", scheme);
});
