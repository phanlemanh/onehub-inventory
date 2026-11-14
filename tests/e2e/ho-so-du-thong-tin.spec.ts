// decision:record-panel
// decision:wcag-aa
// The full unit record of row 3b (_acceptance/ho-so-du-thong-tin) in the browser: every listing of the unit and turning
// to an earlier one (E7), the record stays read-only (E8), and an accessibility scan of the full record (E9). Every check
// has a break case on the real page with a pinned message.
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

import { formatMoney } from "../../src/lib/format";
import { sampleUnits, subdivisionNameOf } from "../../src/modules/catalog/sample";
import { listingsOfUnit } from "../../src/modules/listings/record";
import {
  SAMPLE_COMPANY,
  buildSampleListings,
  sampleEarlierListings,
} from "../../src/modules/listings/sample";

const URL = "/inventory";
const units = sampleUnits().map((u) => ({ ...u, subdivisionName: subdivisionNameOf(u) }));
const current = buildSampleListings({ companyId: SAMPLE_COMPANY.id, units });
const earlier = sampleEarlierListings(current);
const all = [...current.listings, ...earlier.listings];
const links = [...current.listingUnits, ...earlier.listingUnits];
const listingsOf = (id: string) =>
  listingsOfUnit(current.listingUnits.find((x) => x.listingId === id)!.upi, all, links);
/**
 * The listings of a unit by creation time, newest first, worked out here from the sample data on its own (not through
 * the record's sort): the order the record must show, and «Lần k» counted from the oldest.
 */
function expectedOrder(id: string): { id: string; label: string; price: number | undefined }[] {
  const upi = current.listingUnits.find((x) => x.listingId === id)!.upi;
  const onUnit = new Set(links.filter((x) => x.upi === upi).map((x) => x.listingId));
  const mine = all.filter((l) => onUnit.has(l.id));
  const created = (l: (typeof all)[number]) => Date.parse(l.originalEntryTimestamp!);
  return mine
    .map((l) => ({ l, older: mine.filter((o) => created(o) < created(l)).length }))
    .sort((a, b) => b.older - a.older)
    .map(({ l, older }) => ({ id: l.id, label: `Lần ${older + 1}`, price: l.listPrice }));
}

/** A unit with three listings, and one with a single listing: read from the sample data, never typed by hand. */
const THREE = current.listings.find((l) => listingsOf(l.id).length === 3)!.id;
const ONE = current.listings.find((l) => listingsOf(l.id).length === 1)!.id;
const records = { [THREE]: { listings: listingsOf(THREE).map(({ listing }) => listing) } };

const panel = (page: Page) => page.locator('[data-slot="record-panel"]');
const record = (page: Page) => page.locator('[data-slot="listing-record"]');

async function openRecord(page: Page, id: string): Promise<void> {
  await page.goto(`${URL}?ho-so=${id}`);
  await page.locator('[data-slot="data-region"] tbody tr').first().waitFor();
  await expect(page.locator('[hidden][id^="S:"]')).toHaveCount(0);
  await expect(panel(page)).toHaveAttribute("data-record-id", id);
  await expect(record(page)).toBeVisible();
}

const text = (page: Page, slot: string) =>
  record(page).locator(`[data-slot="${slot}"]`).first().innerText();

/** The listings of the unit as the record lists them: «Lần k» in order, and which one is current. */
async function listed(page: Page): Promise<{ numbers: string[]; current: string | null }> {
  return record(page).evaluate((el) => {
    const buttons = [...el.querySelectorAll('[data-slot="listings-of-unit"] li button')];
    return {
      numbers: buttons.map((b) => b.textContent ?? ""),
      current: buttons.find((b) => b.getAttribute("aria-current") === "true")?.textContent ?? null,
    };
  });
}

/** After moving to another unit the record shows that unit's newest listing, with no earlier-listing note. */
async function keptErrors(page: Page): Promise<string[]> {
  const got = await listed(page);
  const note = await record(page).locator('[data-slot="listing-earlier-note"]').count();
  return got.current === got.numbers[0] && note === 0 ? [] : ["old listing kept across units"];
}

/** The lines of the list against the creation order: each line names its listing and its number. */
async function orderErrors(page: Page, id: string): Promise<string[]> {
  const shown = await record(page).evaluate((el) =>
    [...el.querySelectorAll('[data-slot="listings-of-unit"] li')].map((li) => ({
      id: li.getAttribute("data-listing-id") ?? "",
      label: li.querySelector("button")?.textContent ?? "",
    })),
  );
  const want = expectedOrder(id).map(({ id: i, label }) => ({ id: i, label }));
  return JSON.stringify(shown) === JSON.stringify(want)
    ? []
    : ["listings of unit not newest first"];
}

/** The card's price against the price of the listing in view, from the sample data. */
async function priceErrors(page: Page, price: number | undefined): Promise<string[]> {
  return (await text(page, "listing-card-price")).trim() === formatMoney(price)
    ? []
    : ["old listing price not shown"];
}

test.describe("E7 · every listing of the unit, newest first", () => {
  test.beforeEach(({ browserName }, info) =>
    test.skip(
      browserName !== "chromium" || !["1440", "360"].includes(info.project.name),
      "do o 1440 va 360",
    ),
  );

  test("three listings, turn to Lần 1 and back, the address stays", async ({ page }) => {
    const data = records[THREE]!;
    await openRecord(page, THREE);
    const order = expectedOrder(THREE);
    expect(await orderErrors(page, THREE)).toEqual([]);
    expect((await listed(page)).current).toBe(order[0]!.label);
    await expect(record(page).locator('[data-slot="listings-of-unit"] h3')).toHaveText(
      "Các lần chào của căn · 3",
    );
    const address = page.url();
    expect(await priceErrors(page, order[0]!.price)).toEqual([]);

    await record(page).getByRole("button", { name: "Lần 1" }).click();
    const first = data.listings[2]!;
    expect(order[2]!.id).toBe(first.id);
    await expect(record(page).locator('[data-slot="listing-earlier-note"]')).toContainText(
      "Đang xem lần chào cũ · Lần 1",
    );
    expect(await priceErrors(page, order[2]!.price)).toEqual([]);
    // The head of the record comes back into view with the earlier listing's price.
    await expect(record(page).locator('[data-slot="listing-card"]')).toBeInViewport();
    await expect(
      record(page).locator('[data-slot="listing-card-status"] [data-status]'),
    ).toHaveAttribute("data-status", first.standardStatus);
    await expect(record(page).locator('[data-slot="listing-offer"] h3')).toHaveText(
      "Lần chào đang xem",
    );
    expect((await listed(page)).current).toBe("Lần 1");
    expect(page.url()).toBe(address);

    await record(page).getByRole("button", { name: "Về lần mới nhất" }).click();
    expect(await priceErrors(page, order[0]!.price)).toEqual([]);
    await expect(record(page).locator('[data-slot="listing-earlier-note"]')).toHaveCount(0);
  });

  test("an earlier listing does not follow the record to the next unit", async ({ page }) => {
    await openRecord(page, THREE);
    await record(page).getByRole("button", { name: "Lần 1" }).click();
    await panel(page).getByRole("button", { name: "Sau" }).click();
    await expect(panel(page)).not.toHaveAttribute("data-record-id", THREE);
    expect(await keptErrors(page)).toEqual([]);
  });

  test("break: a record that keeps the earlier listing on the next unit is named", async ({
    page,
  }) => {
    await openRecord(page, THREE);
    await panel(page).getByRole("button", { name: "Sau" }).click();
    await expect(panel(page)).not.toHaveAttribute("data-record-id", THREE);
    // Mark the oldest line as the one in view and show the note, the way a record that kept the choice would.
    await record(page).evaluate((el) => {
      const buttons = [...el.querySelectorAll('[data-slot="listings-of-unit"] li button')];
      for (const b of buttons) b.removeAttribute("aria-current");
      buttons.at(-1)?.setAttribute("aria-current", "true");
      const note = document.createElement("div");
      note.setAttribute("data-slot", "listing-earlier-note");
      el.prepend(note);
    });
    expect(await keptErrors(page)).toEqual(["old listing kept across units"]);
  });

  test("a unit with one listing lists one line", async ({ page }) => {
    await openRecord(page, ONE);
    await expect(record(page).locator('[data-slot="listings-of-unit"] h3')).toHaveText(
      "Các lần chào của căn · 1",
    );
    expect(await orderErrors(page, ONE)).toEqual([]);
  });

  test("break: listings sorted oldest first, still numbered by position, are named", async ({
    page,
  }) => {
    await openRecord(page, THREE);
    // A sort turned the wrong way: the listings come oldest first while «Lần 3, 2, 1» still counts down by position.
    await record(page).evaluate((el) => {
      const lines = [...el.querySelectorAll('[data-slot="listings-of-unit"] li')];
      const ids = lines.map((li) => li.getAttribute("data-listing-id")).reverse();
      lines.forEach((li, i) => li.setAttribute("data-listing-id", ids[i] ?? ""));
    });
    expect(await orderErrors(page, THREE)).toEqual(["listings of unit not newest first"]);
  });

  test("break: an old listing whose price never shows is named", async ({ page }) => {
    await openRecord(page, THREE);
    // Freeze the card's price, the way a record that keeps the newest listing's price would show it.
    await record(page).evaluate((el) => {
      const price = el.querySelector('[data-slot="listing-card-price"]')!;
      const frozen = price.cloneNode(true);
      price.replaceWith(frozen);
    });
    await record(page).getByRole("button", { name: "Lần 1" }).click();
    expect(await priceErrors(page, expectedOrder(THREE)[2]!.price)).toEqual([
      "old listing price not shown",
    ]);
  });
});

// ---- E8 · read-only ------------------------------------------------------------------------------------------------

// Ghim thành cột and Bỏ ghim change only how the record stands beside the grid, never the data (row 3a).
const ALLOWED_BUTTONS =
  /^(Trước|Sau|Đóng|Chép đường dẫn|Ghim thành cột|Bỏ ghim|Về lần mới nhất|Lần \d+)$/;

async function readOnlyErrors(page: Page): Promise<string[]> {
  const found = await panel(page).evaluate((el) => ({
    inputs: el.querySelectorAll("input, textarea, select, [contenteditable]").length,
    buttons: [...el.querySelectorAll("button")].map(
      (b) => b.getAttribute("aria-label") || (b.textContent ?? "").trim(),
    ),
  }));
  const errors: string[] = [];
  if (found.inputs > 0) errors.push("record is not read-only");
  for (const name of found.buttons)
    if (!ALLOWED_BUTTONS.test(name)) errors.push(`unexpected button: ${name}`);
  return errors;
}

test.describe("E8 · the record only reads", () => {
  test.beforeEach(({ browserName }, info) =>
    test.skip(browserName !== "chromium" || info.project.name !== "1440", "do o 1440"),
  );

  test("no field to type in, only reading buttons, no write request, the grid unchanged", async ({
    page,
  }) => {
    const writes: string[] = [];
    page.on("request", (r) => {
      if (r.method() !== "GET" && r.method() !== "HEAD" && !r.url().includes("/_next/"))
        writes.push(r.url());
    });
    await openRecord(page, THREE);
    expect(await readOnlyErrors(page)).toEqual([]);
    await record(page).getByRole("button", { name: "Lần 1" }).click();
    await record(page).getByRole("button", { name: "Về lần mới nhất" }).click();
    expect(await readOnlyErrors(page)).toEqual([]);
    expect(writes.length ? "write request while reading record" : "").toBe("");
    const headers = await page.locator('[data-slot="data-region"] thead th').allInnerTexts();
    expect(headers.map((h) => h.trim()).filter((h) => h !== "" && h !== "#")).toEqual([
      "Căn",
      "Toà",
      "Dự án",
      "Trạng thái",
      "Giá chào",
      "Diện tích",
      "Phòng ngủ",
      "Xác nhận lúc",
    ]);
    await expect(page.locator('[data-slot="data-region"]')).toContainText("60 dòng");
  });

  test("break: a field put into the record is named", async ({ page }) => {
    await openRecord(page, THREE);
    await record(page).evaluate((el) => el.appendChild(document.createElement("input")));
    expect(await readOnlyErrors(page)).toContain("record is not read-only");
  });

  test("break: a write request while reading is named", async ({ page }) => {
    const writes: string[] = [];
    page.on("request", (r) => {
      if (r.method() !== "GET" && r.method() !== "HEAD" && !r.url().includes("/_next/"))
        writes.push(r.url());
    });
    await openRecord(page, THREE);
    await page.evaluate(() => fetch("/api/v1/khong-co", { method: "POST" }).catch(() => undefined));
    await expect.poll(() => writes.length).toBeGreaterThan(0);
    expect(writes.length ? "write request while reading record" : "").toBe(
      "write request while reading record",
    );
  });
});

// ---- E9 · accessibility of the full record --------------------------------------------------------------------------

async function seriousViolations(page: Page): Promise<string[]> {
  const { violations } = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .options({
      rules: { "aria-dialog-name": { enabled: true }, "aria-progressbar-name": { enabled: true } },
    })
    .exclude("nextjs-portal")
    .analyze();
  return violations
    .filter((v) => v.impact === "serious" || v.impact === "critical")
    .map((v) => v.id);
}

test.describe("E9 · the full record passes the accessibility scan", () => {
  test.beforeEach(({ browserName }, info) =>
    test.skip(
      browserName !== "chromium" || info.project.name !== "1440",
      "do o 1440, tu doi sang 360",
    ),
  );

  test("1440 and 360, light and dark, newest and Lần 1: eight scans", async ({ page }) => {
    let scans = 0;
    for (const size of [
      { width: 1440, height: 900 },
      { width: 360, height: 780 },
    ])
      for (const colorScheme of ["light", "dark"] as const) {
        await page.setViewportSize(size);
        await page.emulateMedia({ colorScheme });
        await openRecord(page, THREE);
        expect(await seriousViolations(page), `${size.width} ${colorScheme} newest`).toEqual([]);
        scans += 1;
        await record(page).getByRole("button", { name: "Lần 1" }).click();
        expect(await seriousViolations(page), `${size.width} ${colorScheme} Lần 1`).toEqual([]);
        scans += 1;
      }
    expect(scans === 8 ? "" : `axe scans: expected 8, got ${scans}`).toBe("");
  });

  test("break: a completeness bar without a name is caught", async ({ page }) => {
    await openRecord(page, THREE);
    await page.locator('[data-slot="listing-completeness"] [role="progressbar"]').evaluate((el) => {
      el.removeAttribute("aria-label");
      el.removeAttribute("aria-labelledby");
    });
    expect(await seriousViolations(page)).toContain("aria-progressbar-name");
  });
});
