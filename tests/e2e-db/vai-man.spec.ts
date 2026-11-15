// Role × screen suite (roadmap row 9b, AC-4 to AC-7, AC-11), signed in through the shared role door. One test per
// role × width; its steps walk the pairs `pairs()` gives for that width — never a hand-written list — and are named
// `<screen> × <role> @<width>: <what>` so tests/e2e-db/vai-man-doi-chieu.mjs can compare what ran with what must run.
//   duoc vao        — the screen opens in its normal state, its heading from the label table, no «Không đủ quyền».
//   khong du quyen  — exactly one «Không đủ quyền» block with the way back to Hôm nay.
//   khong lo nguoi chung — neither the page nor any text response while it loads carries the witness (AC-6).
//   day ve hom nay  — the sign-in page sends a signed-in person to Hôm nay.
//   nut             — the permission buttons' decisions match the role × screen × button table (AC-11).
//   thanh ben       — sidebar entries follow the same entry rule, at 1440 and on the phone sheet at 360 (AC-7).
import { readFileSync } from "node:fs";
import { join } from "node:path";

import type { Page, Response, TestInfo } from "@playwright/test";

import { FRAME_COPY } from "../../src/components/templates/frame-copy";
import { label } from "../../src/modules/company-config";
import type { Role } from "../../src/generated/ontology";
import type { ButtonDecision } from "../../src/modules/identity/ui";
import { expect, test } from "../../tools/e2e_templates/fixture";
import { openSheet } from "../../tools/e2e_templates/settle";

import { roleSession, ROLES, WITNESS } from "./dang-nhap-vai";
import {
  buttonTable,
  FRAME_SECTION,
  FULL_SIZE,
  pairs,
  pairsAt,
  stepName,
  type Pair,
  type Size,
} from "./vai-man";

const ALL = pairs().pairs;
const TABLE = buttonTable();
/**
 * The committed role × screen × button table (design/vai-man-nut.md), as the owner reads it: the buttons each role's
 * cell lists, by section. Read from the file, not recomputed, so a permission changed without regenerating the table
 * shows here (make check catches the same drift without a browser).
 */
const COMMITTED = committedTable(
  readFileSync(join(import.meta.dirname, "../../design/vai-man-nut.md"), "utf8"),
);
const FORBIDDEN = FRAME_COPY.forbidden.title;
/**
 * The real buttons, by the name people read, for the buttons that show at open (sổ màn `mo_san`): the record above is
 * the permission button's decision, this is what the eye sees (supervisor's condition 3, D-1311-21).
 */
const BUTTON_NAME: Readonly<Record<string, string>> = {
  saveView: label("SaveView"),
  inviteMember: label("Invite"),
  changeMemberRoles: label("ChangeRoles"),
  // «Tuỳ chỉnh của sàn» opens on «Nhãn riêng», where the add button adds a company label (row 7e).
  addCompanyLayer: label("AddCompanyLabel"),
};

/** The screen that lists the company's people: where the witness must show for a role that may open it. */
const PEOPLE_SCREEN = TABLE.screens.find((s) => s.vao === "listMembers")?.id;
/** The widths where the sidebar is checked: the desktop sidebar and the phone sheet. */
const NAV_SIZES: readonly Size[] = [FULL_SIZE, "360"];
/**
 * The screens with a sidebar entry, read from the sidebar's source (importing it would pull the client components of
 * the frame into the test). tests/vai-man-so-man.test.ts proves each entry gates its screen with the register's `vao`,
 * so the expected count of each entry is the pair's own expectation.
 */
const NAV_SOURCE = readFileSync(join(import.meta.dirname, "../../src/app/(app)/nav.ts"), "utf8");
const NAV_SCREENS = new Set(
  ALL.filter((p) => NAV_SOURCE.includes(`href: "${p.route}"`)).map((p) => p.screen),
);
const TEXT = /text\/html|json|text\/x-component|text\/plain|javascript/;

console.log(`vai x man: ${ALL.length} cap`);

/** Every text response from now until `done` resolves, kept with its body. */
function recordResponses(page: Page): { bodies: Promise<string[]>; stop: () => void } {
  const pending: Promise<string>[] = [];
  const on = (r: Response) => {
    if (TEXT.test(r.headers()["content-type"] ?? "")) pending.push(r.text().catch(() => ""));
  };
  page.on("response", on);
  let stopped: () => void = () => {};
  const bodies = new Promise<string[]>((resolve) => {
    stopped = () => {
      page.off("response", on);
      resolve(Promise.all(pending));
    };
  });
  return { bodies, stop: () => stopped() };
}

async function buttons(page: Page): Promise<ButtonDecision[]> {
  return page.evaluate(
    () => (window as unknown as { __onehubButtons?: ButtonDecision[] }).__onehubButtons ?? [],
  );
}

function committedTable(
  text: string,
): Map<string, { all: Set<string>; byRole: Map<string, Set<string>> }> {
  const out = new Map<string, { all: Set<string>; byRole: Map<string, Set<string>> }>();
  for (const block of text.split("\n## ").slice(1)) {
    const id = block.split(" ")[0]!;
    const all = new Set<string>();
    const byRole = new Map<string, Set<string>>();
    for (const line of block.split("\n").filter((l) => l.startsWith("| "))) {
      const cells = line.split("|").map((c) => c.trim());
      const role = Object.entries(TABLE.labels).find(([, l]) => l === cells[1])?.[0];
      if (!role) continue;
      const actions = new Set([...(cells[2] ?? "").matchAll(/`(\w+)`/g)].map((m) => m[1]!));
      byRole.set(role, actions);
      for (const a of actions) all.add(a);
    }
    out.set(id, { all, byRole });
  }
  return out;
}

/** The permission buttons' decisions against the table: in the screen's or the frame's section, shown only in the
 *  role's cells, and every button that must show at open shown. */
async function checkButtons(page: Page, p: Pair, size: Size): Promise<void> {
  const mine = COMMITTED.get(p.screen);
  const frame = COMMITTED.get(FRAME_SECTION);
  if (!mine || !frame) throw new Error(stepName(p, size, "bang nut thieu muc"));
  const section = TABLE.screens.find((s) => s.id === p.screen)!;
  const known = new Set([...mine.all, ...frame.all, ...(section.vao ? [section.vao] : [])]);
  const allowed = new Set([
    ...(mine.byRole.get(p.role) ?? []),
    ...(frame.byRole.get(p.role) ?? []),
  ]);
  // Wait for the buttons that show at open; a missing one is reported below with the others, by name.
  await expect
    .poll(async () => (await buttons(page)).filter((d) => d.shown).map((d): string => d.action))
    .toEqual(expect.arrayContaining(p.shownAtOpen))
    .catch(() => undefined);
  const got = await buttons(page);
  const problems: string[] = [];
  for (const d of got) {
    if (!known.has(d.action as string) || (d.shown && !allowed.has(d.action as string)))
      problems.push(stepName(p, size, `thay nut ${d.action} khong co trong o`));
  }
  const shown = new Set<string>(got.filter((d) => d.shown).map((d) => d.action));
  for (const a of p.shownAtOpen)
    if (!shown.has(a)) problems.push(stepName(p, size, `thieu nut ${a}`));
  if (problems.length > 0) throw new Error([...new Set(problems)].join("\n"));
  console.log(`${stepName(p, size, "nut")} — ${got.length} quyet dinh, ${shown.size} hien`);
}

async function allowedStep(page: Page, p: Pair, size: Size): Promise<void> {
  await page.goto(p.route);
  await expect(
    page.getByRole("heading", { level: 1, name: p.title!, exact: true }),
    stepName(p, size, "mong man thuong"),
  ).toBeVisible();
  await expect(
    page.locator('[data-slot="page-state"][data-kind="forbidden"]'),
    stepName(p, size, "mong man thuong"),
  ).toHaveCount(0);
  if (size !== FULL_SIZE) return;
  await page.waitForLoadState("networkidle");
  await checkButtons(page, p, size);
  const section = TABLE.screens.find((s) => s.id === p.screen)!;
  for (const action of section.mo_san) {
    const name = BUTTON_NAME[action];
    if (!name) throw new Error(stepName(p, size, `chua co ten nut ${action}`));
    // A row's button carries the row's name after the label («Đổi vai · [Tên] …»): match the label at the start.
    const real = page.getByRole("button", { name: new RegExp(`^${name}( ·|$)`) });
    if (p.shownAtOpen.includes(action))
      await expect(real.first(), stepName(p, size, `nut that ${action}`)).toBeVisible();
    else await expect(real, stepName(p, size, `nut that ${action}`)).toHaveCount(0);
  }
}

async function blockedStep(page: Page, p: Pair, size: Size, info: TestInfo): Promise<void> {
  const rec = recordResponses(page);
  await page.goto(p.route);
  const block = page.locator('[data-slot="page-state"][data-kind="forbidden"]');
  const want = stepName(p, size, "mong Khong du quyen");
  await expect(block, want).toHaveCount(1);
  await expect(page.getByRole("heading", { level: 1, name: FORBIDDEN }), want).toBeVisible();
  await expect(block.locator('a[href="/"]'), want).toHaveCount(1);
  rec.stop();
  const bodies = [await page.content(), ...(await rec.bodies)];
  await test.step(stepName(p, size, "khong lo nguoi chung"), () => {
    // The page itself plus at least one response read in full: a listener that read nothing measures nothing.
    if (bodies.filter((b) => b.length > 0).length < 2)
      throw new Error(stepName(p, size, "khong ghi duoc phan hoi"));
    for (const b of bodies)
      if (b.includes(WITNESS.name) || b.includes(WITNESS.email))
        throw new Error(stepName(p, size, "lo nguoi chung"));
  });
  if (size === FULL_SIZE || size === "360")
    await page.screenshot({ path: info.outputPath(`${p.screen}-${p.role}-${size}.png`) });
}

/** The positive control of the leak check: the same two readers find the witness where the role may see them. */
async function witnessStep(page: Page, p: Pair, size: Size): Promise<void> {
  const rec = recordResponses(page);
  await page.goto(p.route);
  await expect(page.getByText(WITNESS.name).first()).toBeVisible();
  rec.stop();
  const bodies = await rec.bodies;
  if (!(await page.content()).includes(WITNESS.name))
    throw new Error(stepName(p, size, "khong thay nguoi chung tren trang"));
  if (!bodies.some((b) => b.includes(WITNESS.name)))
    throw new Error(stepName(p, size, "khong thay nguoi chung trong phan hoi"));
}

async function navStep(page: Page, role: Role, size: Size): Promise<void> {
  await page.goto("/");
  await expect(page.locator('[data-slot="account-menu"][data-ready]')).toBeVisible();
  if (Number(size) < 768) await openSheet(page);
  for (const p of ALL.filter((x) => x.role === role && NAV_SCREENS.has(x.screen))) {
    await expect(
      page.getByRole("link", { name: p.title!, exact: true }),
      `${role} @${size}: thanh ben ${p.screen}`,
    ).toHaveCount(p.expect === "chan" ? 0 : 1);
  }
}

// The sidebar for every role, at 1440 and on the phone sheet at 360 (AC-7). One test with a literal title, tagged for
// the slowed-CPU repeats of the shared waits (tools/e2e_templates/settle.ts, CHO_TESTS); each role in its own context
// from the shared door.
test("thanh ben theo vai", { tag: "@cho" }, async ({ browser }, info) => {
  const size = info.project.name.replace(/^vai-/, "") as Size;
  test.skip(!NAV_SIZES.includes(size), `thanh ben chi do o ${NAV_SIZES.join(", ")}`);
  for (const role of ROLES) {
    const context = await browser.newContext({
      storageState: roleSession(role),
      viewport: info.project.use.viewport!,
    });
    const page = await context.newPage();
    try {
      await test.step(`${role} @${size}: thanh ben`, () => navStep(page, role, size));
    } finally {
      await context.close();
    }
  }
});

for (const role of ROLES) {
  test.describe(role, () => {
    test.use({ storageState: roleSession(role) });

    test(`vai ${role}`, async ({ page }, info) => {
      const size = info.project.name.replace(/^vai-/, "") as Size;
      const mine = pairsAt(ALL, size).filter((p) => p.role === role);
      test.skip(mine.length === 0, `${role} @${size}: khong co cap nao o kho nay`);
      for (const p of mine) {
        if (p.expect === "duoc-vao") {
          await test.step(stepName(p, size, "duoc vao"), () => allowedStep(page, p, size));
          if (p.screen === PEOPLE_SCREEN && size === FULL_SIZE)
            await test.step(stepName(p, size, "thay nguoi chung"), () =>
              witnessStep(page, p, size),
            );
        } else if (p.expect === "chan") {
          await test.step(stepName(p, size, "khong du quyen"), () =>
            blockedStep(page, p, size, info),
          );
        } else {
          await test.step(stepName(p, size, "day ve hom nay"), async () => {
            await page.goto(p.route);
            await page.waitForURL((u) => u.pathname === "/");
          });
        }
      }
    });
  });
}
