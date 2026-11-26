// Row 9e (bo-nut-theo-quyen), evals E11: the template sample /proto/permitted-actions under the four roles.
//   bon-vai-hai-kho — at 360 and 1440, for both sample screens, each role sees the buttons the generated role × screen
//     table (design/role-screen-buttons.md) gives it: the add button in the page head, the region or «not allowed», and on a
//     row of its own and a row of someone else's the «…» menu with exactly the permitted actions, ordinary ones first.
//   axe-sang-toi — no axe violation with a row menu open, in light and dark.
import { readFileSync } from "node:fs";

import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

import { LABELS } from "../../src/generated/labels";
import type { Role } from "../../src/generated/ontology";
import { actionVisibility, type ActionName } from "../../src/modules/identity/permissions";
import { chupAnh, pageReady } from "./sua-trang";

const AXE_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
const ROLES: Role[] = ["ListAgent", "BuyerAgent", "TeamLead", "CompanyAdmin"];
const SCREENS = ["listings", "contacts"] as const;
const lower = (s: string) => s.toLocaleLowerCase("vi");

/** The proto-permitted-actions section of the generated table: role display name → actions in its cell. */
function generatedCells(): Map<string, Set<string>> {
  const text = readFileSync("design/role-screen-buttons.md", "utf8");
  const section = text.split(/^## /m).find((s) => s.startsWith("proto-permitted-actions"));
  if (!section)
    throw new Error("design/role-screen-buttons.md không có mục proto-permitted-actions");
  const cells = new Map<string, Set<string>>();
  for (const line of section.split("\n")) {
    const m = /^\| (.+?) +\| (.+?) +\|$/.exec(line);
    if (!m || m[1] === "Vai" || m[1]!.startsWith("-")) continue;
    cells.set(m[1]!, new Set([...m[2]!.matchAll(/`(\w+)`/g)].map((x) => x[1]!)));
  }
  return cells;
}

/** The sample's menu of one record, in order: [action, words on the item, removing]. */
function menuOf(screen: (typeof SCREENS)[number]): [string, string, boolean][] {
  if (screen === "listings")
    return [
      ["updateListing", LABELS.Edit.pref, false],
      ["removeListing", LABELS.RemoveListing.pref, true],
    ];
  return [
    ["updateContact", LABELS.Edit.pref, false],
    ["mergeContacts", `Gộp với ${lower(LABELS.Contact.pref)} khác…`, false],
    ["removeContact", LABELS.RemoveContact.pref, true],
    ["eraseContactPersonalData", `${LABELS.EraseContactPersonalData.pref} theo yêu cầu`, true],
  ];
}

async function open(page: Page, screen: string, role: Role) {
  await page.goto(`/proto/permitted-actions?board=hidden&screen=${screen}&role=${role}`);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(LABELS[role].pref);
}

/** The words of the open menu, ordinary items and removing items apart, in order. */
async function menuWords(
  page: Page,
): Promise<{ plain: string[]; removing: string[]; line: boolean }> {
  const menu = page.getByRole("menu");
  await expect(menu).toBeVisible();
  const items = menu.getByRole("menuitem");
  const plain: string[] = [];
  const removing: string[] = [];
  for (const item of await items.all()) {
    const words = (await item.textContent())?.trim() ?? "";
    if ((await item.getAttribute("data-variant")) === "destructive") removing.push(words);
    else {
      expect(removing, `việc thường «${words}» đứng sau việc xoá`).toEqual([]);
      plain.push(words);
    }
  }
  return { plain, removing, line: (await menu.getByRole("separator").count()) > 0 };
}

for (const screen of SCREENS) {
  for (const role of ROLES) {
    test(`bon-vai-hai-kho: ${screen} × ${role}`, async ({ page }, info) => {
      test.skip(!["360", "1440"].includes(info.project.name), "AC-10 measures 360 and 1440");
      const cell = generatedCells().get(LABELS[role].pref);
      expect(cell, `bảng sinh không có ô ${role}`).toBeDefined();
      await open(page, screen, role);
      const listings = screen === "listings";
      const view = listings ? "viewListings" : "viewContacts";
      const add = listings ? "createListing" : "createContact";
      const addWords = listings ? LABELS.CreateListing.pref : LABELS.CreateContact.pref;

      await expect(
        page.getByRole("button", { name: addWords }),
        `bon-vai-hai-kho: ${screen} × ${role} × nút thêm`,
      ).toHaveCount(cell!.has(add) ? 1 : 0);
      if (!cell!.has(view)) {
        await expect(page.locator('[data-slot="row-actions"]')).toHaveCount(0);
        return;
      }
      await expect(page.locator("tbody tr")).toHaveCount(8);

      // Row 1 is the viewer's own, row 2 someone else's (the sample's ids say whose).
      for (const [rowId, mine] of [
        [listings ? "cua-toi-can-1" : "cua-toi-lh-1", true],
        [listings ? "nguoi-khac-can-2" : "nguoi-khac-lh-2", false],
      ] as const) {
        const want = menuOf(screen).filter(
          ([action]) =>
            cell!.has(action) && actionVisibility([role], action as ActionName, mine) === "show",
        );
        const trigger = page.locator(`[data-row-actions-for="${rowId}"] [data-slot="row-actions"]`);
        const where = `bon-vai-hai-kho: ${screen} × ${role} × ${mine ? "dòng của mình" : "dòng người khác"}`;
        if (want.length === 0) {
          await expect(trigger, where).toHaveCount(0);
          continue;
        }
        await trigger.click();
        const got = await menuWords(page);
        expect(got.plain, where).toEqual(want.filter(([, , r]) => !r).map(([, w]) => w));
        expect(got.removing, where).toEqual(want.filter(([, , r]) => r).map(([, w]) => w));
        expect(got.line, `${where} × vạch`).toBe(got.plain.length > 0 && got.removing.length > 0);
        await page.keyboard.press("Escape");
        await expect(page.getByRole("menu")).toHaveCount(0);
      }
    });
  }
}

test("axe-sang-toi", async ({ page }) => {
  for (const [screen, role] of [
    ["listings", "ListAgent"],
    ["contacts", "TeamLead"],
    ["listings", "CompanyAdmin"],
  ] as const) {
    await open(page, screen, role);
    const trigger = page.locator('[data-slot="row-actions"]').first();
    if (await trigger.count()) {
      await trigger.click();
      await expect(page.getByRole("menu")).toBeVisible();
    }
    for (const colorScheme of ["light", "dark"] as const) {
      await page.emulateMedia({ colorScheme });
      await page.waitForTimeout(250);
      const { violations } = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze();
      expect(
        violations.map(
          (v) =>
            `${screen} ${role} ${colorScheme} ${v.id} ${v.nodes.map((n) => n.target.join(" ")).join(" | ")}`,
        ),
      ).toEqual([]);
    }
    await page.emulateMedia({ colorScheme: "light" });
    await page.keyboard.press("Escape");
  }
});

// Ruling V-1211-6 (approved by the owner at the evidence gate): one add button, two places by mode. Full screen hides the
// page head, so the same button shows in the grid's toolbar; never both at once. Frames go to the run folder; the signed record keeps its own copies.
test("nut-them-toan-man-hinh", async ({ page }, info) => {
  test.skip(info.project.name !== "1440", "full screen is offered from 768px; one width is enough");
  const shots = ".acceptance-runs/bo-nut-theo-quyen/toan-man-hinh";
  await open(page, "listings", "ListAgent");
  const add = page.getByRole("button", { name: LABELS.CreateListing.pref });
  await expect(add).toHaveCount(1);
  await expect(
    page
      .locator('[data-slot="data-region"] [data-slot="region-toolbar"]')
      .getByRole("button", { name: LABELS.CreateListing.pref }),
  ).toHaveCount(0);
  // A screenshot hides the caret with an inline style on every input: only once React has hydrated them (row 1u).
  await pageReady(page, { el: page.locator('[data-slot="data-region"] input') });
  await chupAnh(page, { path: `${shots}/thuong-1440.png` });
  await page.locator('[data-slot="full-screen-toggle"]').click();
  await expect(page.locator('[data-slot="data-region"][data-full-screen]')).toBeVisible();
  await expect(add).toHaveCount(1);
  await expect(
    page
      .locator('[data-slot="data-region"]')
      .getByRole("button", { name: LABELS.CreateListing.pref }),
  ).toBeVisible();
  await chupAnh(page, { path: `${shots}/toan-man-1440.png` });
});

// english-route-names, AC-5: the two old Vietnamese addresses are gone, with no redirect. /tuy-chinh-san answers 404
// with the shared not-found screen. /proto/bo-nut-theo-quyen now falls to /proto/[slug], which in a development build
// draws an empty design-pass page titled by the slug for any slug it does not know — no button set; the production
// build answers 404 for every prototype (tools/deploy/thu-ban-dung.sh, eval E15).
test("dia-chi-cu-khong-con", async ({ page }, info) => {
  test.skip(info.project.name !== "1440", "an address answers the same at every width");
  const notFound = page.locator('[data-slot="page-state"][data-kind="not-found"]');
  for (const old of ["/tuy-chinh-san", "/tuy-chinh-san?phan=can-cho"]) {
    const res = await page.goto(old);
    expect(res?.status(), `dia-chi-cu-khong-con: ${old}`).toBe(404);
    await expect(notFound, `dia-chi-cu-khong-con: ${old}`).toBeVisible();
    expect(new URL(page.url()).pathname, `dia-chi-cu-khong-con: ${old} khong chuyen huong`).toBe(
      "/tuy-chinh-san",
    );
  }
  await page.goto("/proto/bo-nut-theo-quyen?board=hidden&screen=listings&role=ListAgent");
  expect(new URL(page.url()).pathname, "dia-chi-cu-khong-con: ban mau cu khong chuyen huong").toBe(
    "/proto/bo-nut-theo-quyen",
  );
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("bo-nut-theo-quyen");
  await expect(
    page.locator('[data-slot="data-region"]'),
    "dia-chi-cu-khong-con: ban mau cu khong con bo nut",
  ).toHaveCount(0);
  // Control: the new address shows the button set on the same server.
  await open(page, "listings", "ListAgent");
  await expect(page.locator('[data-slot="data-region"]').first()).toBeVisible();
});
