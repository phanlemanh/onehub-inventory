// The register-driven state suite (roadmap row 1f, _acceptance/bo-bai-kiem-tu-so-man), built for two runs (row 1r,
// _acceptance/bo-kiem-chung-khi-dang-nhap):
//   khong-phien — no database, nobody signed in (`make e2e`, CI): tests/e2e/screens/screens.spec.ts;
//   co-phien    — this lane's Postgres, one test session holding all four roles: tests/e2e-db/screens.spec.ts.
// Nobody writes tests for a screen: every screen in design/screens.yaml gets its suite from the recipes here. Each
// check has break cases that run the SAME check and need its pinned message.
import { expect, test, type Page } from "@playwright/test";

import {
  CALIBRATION_URL,
  FRAME,
  REGION,
  SESSION,
  classifyGrid,
  pushedOut,
  readGrid,
  type Recipe,
} from "./recipes";
import {
  loadRegister,
  signedOutProblems,
  SIGNED_OUT_SCREENS,
  skipReason,
  type Mode,
  type Screen,
} from "./register";
import {
  followRedirect,
  GIAO,
  open,
  runBreak,
  runMain,
  sentToSignIn,
  throttled,
  waitReady,
  type Base,
} from "./runner";

/** The slowed copy of the suite: the whole suite again at this CPU slowdown, on the 1440 size only. */
const SLOW_RATE = 4;
const SLOW_SIZE = "1440";

/** Skip reason of the session break on a screen that opens without a session: nothing to break there. */
export const OPENS_SIGNED_OUT = "man mo khi chua dang nhap — khong co phien de pha";

/** The size part of a project name: "1440" and "co-phien-1440" are both 1440. */
function size(project: string): string {
  return project.replace(/^co-phien-/, "");
}

/** Build the whole suite for one run. */
export function registerSuite({ mode }: { mode: Mode }): void {
  const register = loadRegister();
  const problems = signedOutProblems(register);
  if (problems.length > 0) throw new Error(problems.join("\n"));

  // Printed at load so a run (and `--list`) shows every screen left out and why, and the role × screen table.
  for (const screen of register.screens) {
    const why = skipReason(screen, mode);
    if (why) console.log(`bo qua: ${screen.id} — ${why}`);
  }
  const covered = register.screens.filter((s) => skipReason(s, mode) === null);
  console.log(`Vai × Màn: | Màn | ${register.roles.map((r) => r.label ?? r.name).join(" | ")} |`);
  for (const screen of covered) {
    console.log(
      `Vai × Màn: | ${screen.id} | ${register.roles.map(() => "chờ bảng quyền").join(" | ")} |`,
    );
  }

  if (mode === "co-phien") {
    // No screen is left out for needing a session: the run holds one.
    console.log("bo qua can dang nhap: 0");
    console.log(`man do co phien: ${covered.map((s) => s.id).join(", ")}`);
    suites(covered, 0, mode);
    signedOutCases(register.screens);
    return;
  }

  console.log(
    throttled ? `ham cpu: ${throttled}` : `ham cpu: ${SLOW_RATE} (ban cham, kho ${SLOW_SIZE})`,
  );
  suites(covered, 0, mode);
  calibration(0);
  handOverCases();

  // The slowed copy (row 1f AC-9): the same suite inside the one browser run, so grading never starts a second dev
  // server in this checkout (Next refuses two). Skipped when E2E_CPU_THROTTLE already slows the whole run.
  test.describe("cham", () => {
    test.skip(throttled > 0, "E2E_CPU_THROTTLE da ham ca luot");
    // eslint-disable-next-line no-empty-pattern -- Playwright needs a destructured first argument
    test.beforeEach(({}, info) => {
      test.skip(info.project.name !== SLOW_SIZE, `ban cham chi chay o kho ${SLOW_SIZE}`);
    });
    suites(covered, SLOW_RATE, mode);
    calibration(SLOW_RATE);
  });
}

/** Skip the running case when the signed-out run handed its screen over. */
function skipIfHanded(outcome: string): void {
  if (outcome === "giao") test.skip(true, GIAO);
}

/** Every covered screen's suite, at CPU slowdown `cpu` (0 = none). */
function suites(covered: Screen[], cpu: number, mode: Mode): void {
  const recipes: Recipe[] = mode === "co-phien" ? [...SESSION, ...FRAME] : FRAME;
  for (const screen of covered) {
    const base: Base = { screen: screen.id, title: screen.title_text, cpu, mode };
    test.describe(`man ${screen.id}`, () => {
      test.describe.configure({ timeout: 90_000 });

      for (const recipe of recipes) {
        // The session recipe is not a frame check: its cases read `phien-thu` and `pha phien-thu: …`.
        const kind = recipe.id === SESSION[0]!.id ? "" : "khung ";
        test(`${kind}${recipe.id}`, async ({ page }) => {
          if (recipe.id === "axe-sang-toi") test.setTimeout(240_000);
          skipIfHanded(await runMain(page, screen.route, recipe, base));
        });
        for (const brk of recipe.breaks) {
          test(`pha ${kind}${recipe.id}: ${brk.name}`, async ({ page }) => {
            if (recipe.id === "axe-sang-toi") test.setTimeout(240_000);
            const outcome = await runBreak(page, screen.route, recipe, brk, base);
            skipIfHanded(outcome);
            if (outcome === "mo") test.skip(true, OPENS_SIGNED_OUT);
          });
        }
      }

      if (screen.family === "grid") gridSuite(screen.id, screen.route, base);
    });
  }
}

/**
 * The grid sample runs through the same suite as a registered grid screen, so the recipes are proven red-able and
 * the real-screen path is exercised. Signed-out run only: once is enough.
 */
function calibration(cpu: number): void {
  test.describe("vung hieu-chuan", () => {
    test.describe.configure({ timeout: 90_000 });
    gridSuite("hieu-chuan", CALIBRATION_URL, { screen: "hieu-chuan", title: null, cpu });

    test("mo lai cung trang khong do lai ham cpu", async ({ page }) => {
      // When slowed, the rate stays on the page: a second open must not measure an already slowed page.
      const recipe = REGION.find((r) => r.id === "trong")!;
      const base = { screen: "hieu-chuan", title: null, cpu };
      await open(page, CALIBRATION_URL, recipe, base);
      await open(page, CALIBRATION_URL, recipe, base);
    });

    test("ngoai khuon: bang khong qua vung dung chung thi do", async ({ page }) => {
      await page.goto(CALIBRATION_URL);
      await waitReady(page);
      await page
        .locator('[data-slot="data-region"]')
        .evaluate((el) => el.removeAttribute("data-slot"));
      let message = "";
      try {
        classifyGrid("hieu-chuan", await readGrid(page));
      } catch (err) {
        message = err instanceof Error ? err.message : String(err);
      }
      if (!message.includes("luoi dung ngoai khuon")) {
        throw new Error(`nhan dien vung khong do khi bang dung ngoai khuon (thay "${message}")`);
      }
    });
  });
}

/**
 * Signed-out run (AC-4): a screen that sends the browser to sign-in is handed over by name, and its check never runs
 * on the sign-in page. The case opens a route that sends signed-out people away with a check that must not run.
 */
function handOverCases(): void {
  test.describe("giao man can dang nhap", () => {
    test.describe.configure({ timeout: 90_000 });
    test("mo trang dang nhap thay man", async ({ page }) => {
      let ran = false;
      const probe: Recipe = {
        id: "khong-duoc-chay",
        async check() {
          ran = true;
        },
        breaks: [],
      };
      const base: Base = { screen: "gia", title: null, mode: "khong-phien" };
      const outcome = await runMain(page, "/members", probe, base);
      expect(new URL(page.url()).pathname).toBe("/login");
      expect(outcome).toBe("giao");
      expect(ran).toBe(false);
    });
  });
}

/**
 * Signed-in run (AC-3): each screen of the signed-out list really sends a signed-in person away — the list cannot hide
 * a screen. `list` defaults to the real one; the break passes a copy with a screen that does not send anyone away.
 */
export async function signedOutLeave(
  page: Page,
  screens: Screen[],
  list: Readonly<Record<string, string>> = SIGNED_OUT_SCREENS,
): Promise<void> {
  for (const id of Object.keys(list)) {
    const screen = screens.find((s) => s.id === id);
    if (!screen) throw new Error(`man la trong danh sach nguoi chua dang nhap: ${id}`);
    await page.goto(screen.route);
    await followRedirect(page);
    await waitReady(page);
    if (new URL(page.url()).pathname === screen.route)
      throw new Error(`${id}: khai cho nguoi chua dang nhap nhung khong day di`);
  }
}

function signedOutCases(screens: Screen[]): void {
  test.describe("danh sach nguoi chua dang nhap", () => {
    test.describe.configure({ timeout: 90_000 });
    test("man cho nguoi chua dang nhap that su day nguoi da dang nhap di", async ({ page }) => {
      await signedOutLeave(page, screens);
    });
    test("pha: khai them man khong day ai di", async ({ page }) => {
      let message = "";
      try {
        await signedOutLeave(page, screens, { ...SIGNED_OUT_SCREENS, today: "pha thu" });
      } catch (err) {
        message = err instanceof Error ? err.message : String(err);
      }
      expect(message).toBe("today: khai cho nguoi chua dang nhap nhung khong day di");
    });
  });
}

/**
 * The region suite of one grid screen. The screen is classified once on a page of its own; every recipe and every
 * break then gets a fresh page, so no break's setup (init scripts, the clock) can leak into another case.
 */
function gridSuite(id: string, url: string, base: Base): void {
  test.describe("vung", () => {
    let verdict: ReturnType<typeof classifyGrid> | null = null;
    let handed = false;
    test.beforeAll(async ({ browser }, info) => {
      if ((base.cpu ?? 0) > 0 && size(info.project.name) !== SLOW_SIZE) return;
      const probe = await browser.newPage({
        baseURL: info.project.use.baseURL,
        storageState: info.project.use.storageState,
      });
      try {
        await probe.goto(url);
        await followRedirect(probe);
        if (sentToSignIn(probe, url)) {
          if (base.mode === "co-phien") throw new Error(pushedOut(id));
          handed = true;
          return;
        }
        await waitReady(probe);
        verdict = classifyGrid(id, await readGrid(probe));
      } finally {
        await probe.close();
      }
    });
    const skipUnlessRegion = () => {
      if (handed) test.skip(true, GIAO);
      if (verdict && !verdict.run) test.skip(true, verdict.skip);
    };
    // Every grid screen with a region runs every region case (row 2e: no screen is listed out of one).
    for (const recipe of REGION) {
      test(`vung ${recipe.id}`, async ({ page }) => {
        skipUnlessRegion();
        skipIfHanded(await runMain(page, url, recipe, base));
      });
      for (const brk of recipe.breaks) {
        test(`pha vung ${recipe.id}: ${brk.name}`, async ({ page }) => {
          skipUnlessRegion();
          skipIfHanded(await runBreak(page, url, recipe, brk, base));
        });
      }
    }
  });
}
