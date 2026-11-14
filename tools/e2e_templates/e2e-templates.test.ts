// Tests for the register-driven suite (roadmap row 1f, _acceptance/bo-bai-kiem-tu-so-man).
// The list cases run `playwright test --list` on an edited copy of the register (SCREENS_ROOT); every edit has its
// positive control on the same copy first.
import { execFileSync, spawnSync } from "node:child_process";
import {
  cpSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

import { describe, expect, it } from "vitest";

import {
  FRAME,
  NO_REGION_YET,
  REGION,
  classifyGrid,
  compareRows,
  firstColumnHas,
  pickNeedle,
  pinned,
  type Recipe,
} from "./recipes";
import * as registerModule from "./register";
import { REPO_ROOT, SIGNED_OUT_SCREENS, signedOutProblems } from "./register";
import { sampleUnits, subdivisionNameOf } from "../../src/modules/catalog";
import { SAMPLE_COMPANY, buildSampleListings } from "../../src/modules/listings";
import { inventoryRows } from "../../src/modules/listings/ui/inventory-rows";
import { checkRecipes, regionStates } from "./structure";
import { unlisted, untagged, waitCopies, waitingTests, type SpecFile } from "./cho-scan";
import { CHO_TESTS } from "./settle";

const STATES_MD = readFileSync(join(REPO_ROOT, "design/states.md"), "utf8");
const SLOW = 60_000;

// ---- structure (E5, E9) -----------------------------------------------------------------------------------------

describe("công thức phủ bảng trạng thái", () => {
  it("every region state of design/states.md has one recipe, every recipe a break and a message", () => {
    /** Written before the code: the seven region states. */
    const SEVEN = [
      "chờ tải",
      "trống",
      "không có dòng nào khớp",
      "lỗi",
      "một phần hỏng",
      "chữ dài",
      "không đủ quyền",
    ];
    expect(regionStates(STATES_MD).map((s) => s.toLocaleLowerCase("vi"))).toEqual(SEVEN);
    expect(
      REGION.filter((r) => r.state)
        .map((r) => r.state?.toLocaleLowerCase("vi"))
        .sort(),
    ).toEqual([...SEVEN].sort());
    expect(checkRecipes([...FRAME, ...REGION], STATES_MD)).toEqual([]);
  });

  it("a region state added to the register without a recipe is named", () => {
    const edited = STATES_MD.replace("không đủ quyền)", "không đủ quyền, Thử ma)").replace(
      /\| Không đủ quyền +\|/,
      "| Thử ma | Trạng thái giả của bài kiểm | Bài kiểm của vùng |\n$&",
    );
    expect(edited).not.toBe(STATES_MD);
    expect(checkRecipes(REGION, edited)).toEqual(["thieu cong thuc: Thử ma"]);
  });

  it("a recipe without a break is named", () => {
    const broken = REGION.map((r) => (r.id === "loi" ? { ...r, breaks: [] } : r));
    expect(checkRecipes(broken, STATES_MD)).toEqual(["cong thuc loi: thieu cach pha"]);
  });

  it("công thức không tự mở trang: a recipe that opens a page is named", () => {
    const opener = {
      ...REGION[1]!,
      id: "tu-mo",
      state: undefined,
      check: async ({ page }: { page: { goto: (u: string) => Promise<unknown> } }) => {
        await page.goto("/");
      },
    } as unknown as (typeof REGION)[number];
    expect(checkRecipes([...REGION, opener], STATES_MD)).toEqual(["cong thuc tu-mo: tu mo trang"]);
  });
});

// ---- pinned messages name the screen (E4) ----------------------------------------------------------------------

describe("thông điệp ghim gọi tên màn", () => {
  /** Written before the code: each frame break and the message its check throws on screen "sign-in". */
  const CASES: [string, string][] = [
    ["tieu-de", 'sign-in: tieu-de — mong "Đăng nhập", thay []'],
    ["khong-cuon-ngang", "sign-in: cuon-ngang — trang rộng hơn màn 1640px"],
    ["khong-loi-trinh-duyet", "sign-in: loi-trinh-duyet — pha thu"],
    ["axe-sang-toi", "sign-in: axe color-contrast (light)"],
  ];
  it("matches the screen it ran on and no other", () => {
    expect(CASES.map(([id]) => id)).toEqual(FRAME.map((r) => r.id));
    for (const [id, thrown] of CASES) {
      const brk = FRAME.find((r) => r.id === id)!.breaks[0]!;
      expect(thrown, id).toMatch(pinned(brk, "sign-in"));
      expect(thrown.replace("sign-in", "today"), id).not.toMatch(pinned(brk, "sign-in"));
      expect(thrown.replace("sign-in", "null"), id).not.toMatch(pinned(brk, "sign-in"));
    }
  });
});

// ---- grid screens without a region (E6) -------------------------------------------------------------------------

describe("danh sách chưa có vùng", () => {
  // Row 6 (Đã gửi) built its region, so the real list is empty; the rules are measured on a list holding a made-up
  // screen, with the same pinned messages as before.
  const LISTED = { "man-gia": "ly do gia" };
  it("a grid screen outside the list without a region is red, not skipped", () => {
    expect(() => classifyGrid("ghost-grid", { hasRegion: false, hasTable: false })).toThrow(
      "chua co vung du lieu: ghost-grid",
    );
  });
  it("a listed screen without a region is skipped with its reason", () => {
    const v = classifyGrid("man-gia", { hasRegion: false, hasTable: false }, LISTED);
    expect(v).toEqual({ run: false, skip: `chua co vung du lieu — ${LISTED["man-gia"]}` });
  });
  it("a listed screen that has a region must leave the list", () => {
    expect(() => classifyGrid("man-gia", { hasRegion: true, hasTable: true }, LISTED)).toThrow(
      "go khoi danh sach: man-gia",
    );
  });
  // Row 2 (Bảng hàng) and row 6 (Đã gửi) built their regions, so both left the list and their region suites run.
  it("inventory and sent have left the list and their region suites run", () => {
    expect(NO_REGION_YET).toEqual({});
    expect(classifyGrid("inventory", { hasRegion: true, hasTable: true })).toEqual({ run: true });
    expect(classifyGrid("sent", { hasRegion: true, hasTable: true })).toEqual({ run: true });
  });
  it("putting inventory back on the list is red", () => {
    const back = { ...NO_REGION_YET, inventory: "tra lai" };
    expect(() => classifyGrid("inventory", { hasRegion: true, hasTable: true }, back)).toThrow(
      "da co vung, go khoi danh sach: inventory",
    );
  });
  it("putting sent back on the list is red", () => {
    const back = { ...NO_REGION_YET, sent: "tra lai" };
    expect(() => classifyGrid("sent", { hasRegion: true, hasTable: true }, back)).toThrow(
      "go khoi danh sach: sent",
    );
  });
  it("a table outside the shared region is red", () => {
    expect(() => classifyGrid("man-gia", { hasRegion: false, hasTable: true }, LISTED)).toThrow(
      "man-gia: luoi dung ngoai khuon",
    );
  });
});

// ---- every grid screen runs every region case (row 2e, AC-8) -------------------------------------------------------

describe("moi man Luoi chay du ca vung (hang 2e)", () => {
  /** Written before the code: the region cases after row 2e — no «tim», the filter case and the renamed state case. */
  const REGION_IDS = [
    "cho-tai",
    "trong",
    "khong-khop",
    "loi",
    "mot-phan-hong",
    "chu-dai",
    "khong-du-quyen",
    "loc-dau-cot",
    "o-tim-vang",
  ];

  it("the region cases are the list written ahead", () => {
    expect(REGION.map((r) => r.id).sort()).toEqual([...REGION_IDS].sort());
    expect(REGION_IDS).not.toContain("tim");
    expect(REGION_IDS).not.toContain("tim-khong-ra");
  });

  it("the no-match case carries the state name of design/states.md", () => {
    const state = REGION.find((r) => r.id === "khong-khop")?.state;
    expect(state).toBe("Không có dòng nào khớp");
    expect(STATES_MD).toContain(`| ${state} `);
    expect(STATES_MD).not.toContain("Tìm không ra");
  });

  it("recipes.ts exports no exemption list and suite.ts reads none", () => {
    const recipes = readFileSync(join(REPO_ROOT, "tools/e2e_templates/recipes.ts"), "utf8");
    const suite = readFileSync(join(REPO_ROOT, "tools/e2e_templates/suite.ts"), "utf8");
    expect(recipes).not.toMatch(/NO_SEARCH_CASE|regionCaseSkip/);
    expect(suite).not.toMatch(/NO_SEARCH_CASE|regionCaseSkip|caseSkip/);
  });

  /** The region tests a suite builds for the grid screens: every case, and every break of it, for every screen. */
  function regionTests(screens: readonly string[], skip: Record<string, string[]> = {}): string[] {
    return screens.flatMap((id) =>
      REGION.filter((r) => !(skip[id] ?? []).includes(r.id)).flatMap((r) => [
        `${id}: vung ${r.id}`,
        ...r.breaks.map((b) => `${id}: pha vung ${r.id}: ${b.name}`),
      ]),
    );
  }

  function checkNoSkips(tests: readonly string[], screens: readonly string[]): void {
    for (const id of screens)
      for (const r of REGION)
        if (!tests.includes(`${id}: vung ${r.id}`))
          throw new Error(`${id} skips a region case: ${r.id}`);
  }

  it("a register with inventory and sent builds every region case for both screens", () => {
    const screens = ["inventory", "sent"];
    const tests = regionTests(screens);
    const perScreen = REGION.reduce((n, r) => n + 1 + r.breaks.length, 0);
    expect(tests).toHaveLength(perScreen * 2);
    expect(() => checkNoSkips(tests, screens)).not.toThrow();
  });

  it("the check fails when sent is listed out of a region case again", () => {
    const screens = ["inventory", "sent"];
    expect(() => checkNoSkips(regionTests(screens, { sent: ["loc-dau-cot"] }), screens)).toThrow(
      "sent skips a region case: loc-dau-cot",
    );
  });
});

// ---- the first column's filter on the inventory run (row 2, E5; row 2e) --------------------------------------------

describe("bai loc dau cot tren Bang hang cuon lien (hang 2, hang 2e)", () => {
  // The texts the filter recipe reads (first column, then the text cells), built by the screen's own row builder.
  const units = sampleUnits().map((u) => ({ ...u, subdivisionName: subdivisionNameOf(u) }));
  const sample = buildSampleListings({ companyId: SAMPLE_COMPANY.id, units });
  const rows = inventoryRows({ ...sample, units }).map((r) =>
    ["Listing.unitNumber", "Listing.buildingName", "Listing.subdivisionName"].map((f) =>
      String(r[f as keyof typeof r] ?? ""),
    ),
  );

  for (const window of [24, 25, 27]) {
    it(`finds a needle past the first window of ${window} visible rows`, () => {
      const needle = pickNeedle(rows, window);
      expect(needle).not.toBeNull();
      const hits = rows.map((r, i) => (firstColumnHas(r, needle!) ? i : -1)).filter((i) => i >= 0);
      expect(hits.length).toBeGreaterThan(window);
      expect(hits.length).toBeLessThan(rows.length);
      expect(hits.some((i) => i >= window)).toBe(true);
    });
  }

  it("has no needle with the old hard-coded page of 50 (why the window is read from the screen)", () => {
    expect(rows).toHaveLength(60);
    expect(pickNeedle(rows, 50)).toBeNull();
  });

  it("fails as before on the calibration grid when its rows hold no needle", () => {
    expect(pickNeedle(rows.slice(0, 20), 25)).toBeNull();
  });
});

// ---- search relation (E8, pure part) ----------------------------------------------------------------------------

describe("so hai tập của bài tìm", () => {
  const rows = Array.from({ length: 120 }, (_, i) => [`S${(i % 2) + 1}.0${(i % 5) + 1}-${i}`]);
  it("picks a needle whose matches fill more than a page and lie on two pages or more", () => {
    const needle = pickNeedle(rows);
    expect(needle).not.toBeNull();
    const hits = rows.map((r, i) => (r[0]!.includes(needle!) ? i : -1)).filter((i) => i >= 0);
    expect(hits.length).toBeGreaterThan(50);
    expect(hits.length).toBeLessThan(120);
    expect(new Set(hits.map((i) => Math.floor(i / 50))).size).toBeGreaterThanOrEqual(2);
  });
  it("names the matching row the result dropped, and the extra row it showed", () => {
    expect(pickNeedle(rows.slice(0, 40))).toBeNull();
    expect(compareRows([["a"], ["b"]], [["a"], ["b"]])).toBeNull();
    expect(compareRows([["a"], ["b"]], [["a"]])).toBe("loc-dau-cot: bo sot dong khop — b");
    expect(compareRows([["a"]], [["a"], ["z"]])).toBe("loc-dau-cot: hien dong khong khop — z");
  });
  it("a short grid that fits one window (Sent's sample, row 2e) still gets a needle kept by some rows, not all", () => {
    const short = Array.from({ length: 14 }, (_, i) => [
      `[Tên] Khách ${String(i + 1).padStart(2, "0")}`,
    ]);
    expect(pickNeedle(short, 30)).toBeNull();
    const needle = pickNeedle(short, 30, true);
    expect(needle).not.toBeNull();
    const hits = short.filter((r) => firstColumnHas(r, needle!)).length;
    expect(hits).toBeGreaterThanOrEqual(2);
    expect(hits).toBeLessThan(short.length);
  });
  it("reads the first column only, without marks, as the filter box does", () => {
    expect(firstColumnHas(["Toà Đông 01", "x"], "dong 0")).toBe(true);
    expect(firstColumnHas(["A1", "dong 01"], "dong")).toBe(false);
  });
});

// ---- the list on a register copy (E1, E2, E10) ------------------------------------------------------------------

interface Bridge {
  errors: string[];
  roles: { name: string; label: string | null }[];
  screens: { id: string; route: string; status: string; audience: string }[];
}

function bridge(root: string): Bridge {
  const out = execFileSync(
    "python3",
    [join(REPO_ROOT, "tools/e2e_templates/register.py"), "--root", root],
    {
      encoding: "utf8",
    },
  );
  return JSON.parse(out) as Bridge;
}

/** A root with the three declaration files and an empty page file for every route the register declares built. */
function copyRegister(): string {
  const root = mkdtempSync(join(tmpdir(), "so-man-"));
  for (const rel of ["ontology/labels.yaml", "ontology/roles.yaml", "design/screens.yaml"]) {
    mkdirSync(dirname(join(root, rel)), { recursive: true });
    cpSync(join(REPO_ROOT, rel), join(root, rel));
  }
  for (const s of bridge(REPO_ROOT).screens) if (s.status === "built") stubPage(root, s.route);
  return root;
}

function stubPage(root: string, route: string): void {
  const dir = join(root, "src/app", route);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "page.tsx"), "export default function Page() { return null; }\n");
}

function edit(root: string, rel: string, fn: (text: string) => string): void {
  const file = join(root, rel);
  writeFileSync(file, fn(readFileSync(file, "utf8")));
}

function list(root: string): { status: number; out: string; lines: string[] } {
  const r = spawnSync("npx", ["playwright", "test", "tests/e2e/screens", "--list"], {
    cwd: REPO_ROOT,
    encoding: "utf8",
    env: { ...process.env, SCREENS_ROOT: root },
  });
  const out = `${r.stdout}${r.stderr}`;
  return { status: r.status ?? -1, out, lines: out.split("\n") };
}

const SIZES = ["360", "414", "1024", "1440"];
const FRAME_TESTS = ["tieu-de", "khong-cuon-ngang", "khong-loi-trinh-duyet", "axe-sang-toi"];

/** `[size] screen recipe` for every frame main case in a listing. */
function frameCases(lines: string[], kind: "khung" | "pha khung"): string[] {
  // Only the normal copy: the slowed copy sits under "cham".
  const re = new RegExp(`^\\s*\\[(\\d+)\\] › [^›]+› man (\\S+) › ${kind} ([a-z-]+)`);
  return lines.flatMap((l) => {
    const m = re.exec(l);
    return m ? [`${m[1]} ${m[2]} ${m[3]}`] : [];
  });
}

describe("sổ giả thêm màn thì có bộ", () => {
  it(
    "the real register lists exactly the written frame suites, and a new screen adds its own",
    () => {
      /**
       * Written before the code: the built staff and public screens on main after row 9. Row 1r: members is listed
       * too — it needs a session, so the signed-out run hands it over by name at run time (64 became 80).
       */
      const SCREENS = ["today", "inventory", "sent", "sign-in", "members"];
      const expected = SCREENS.flatMap((s) =>
        SIZES.flatMap((z) => FRAME_TESTS.map((t) => `${z} ${s} ${t}`)),
      );
      expect(expected).toHaveLength(80);

      const root = copyRegister();
      const before = list(root);
      expect(before.status).toBe(0);
      expect(frameCases(before.lines, "khung").sort()).toEqual([...expected].sort());
      expect(frameCases(before.lines, "pha khung")).toHaveLength(80);
      // Every built screen has a suite or a named skip line.
      for (const s of bridge(root).screens.filter((x) => x.status === "built")) {
        const has = before.lines.some((l) => l.includes(` › man ${s.id} › `));
        const skipped = before.lines.some((l) => l.startsWith(`bo qua: ${s.id} — `));
        expect(has || skipped, s.id).toBe(true);
      }

      stubPage(root, "/ghost");
      edit(
        root,
        "design/screens.yaml",
        (t) =>
          `${t}  - id: ghost-built\n    route: /ghost\n    title: Today\n    family: null\n    audience: public\n    status: built\n`,
      );
      const added = list(root);
      expect(added.status).toBe(0);
      const ghost = frameCases(added.lines, "khung").filter((c) => c.includes(" ghost-built "));
      expect(ghost).toHaveLength(16);
      expect(frameCases(added.lines, "khung")).toHaveLength(96);

      edit(root, "design/screens.yaml", (t) => t.split("  - id: ghost-built\n")[0]!);
      rmSync(join(root, "src/app/ghost"), { recursive: true });
      expect(frameCases(list(root).lines, "khung")).toHaveLength(80);
    },
    SLOW * 3,
  );
});

describe("màn bị bỏ có tên", () => {
  it(
    "planned and dev screens get no suite and a named skip line",
    () => {
      const r = list(copyRegister());
      expect(r.status).toBe(0);
      expect(r.lines).toContain("bo qua: contacts — planned");
      expect(r.lines).toContain("bo qua: proto — dev");
      expect(r.lines.some((l) => / › man (contacts|proto) › /.test(l))).toBe(false);
    },
    SLOW,
  );
});

// Row 1r replaces row 9's «màn cần đăng nhập: bỏ qua có điều kiện» and its three cases: the screen is measured with a
// test session in the signed-in run (E1, E2 there), and handed over by name in the signed-out run (E5 there).
describe("màn cần đăng nhập không còn danh sách bỏ qua", () => {
  it("register.ts no longer exports SESSION_SCREENS or sessionSuiteProblem", () => {
    const names = Object.keys(registerModule);
    expect(names).toContain("SIGNED_OUT_SCREENS");
    expect(names).not.toContain("SESSION_SCREENS");
    expect(names).not.toContain("sessionSuiteProblem");
  });

  it(
    "the signed-out run lists members and skips no screen for needing a session",
    () => {
      const r = list(copyRegister());
      expect(r.status).toBe(0);
      expect(r.lines.some((l) => / › man members › khung tieu-de$/.test(l.trimEnd()))).toBe(true);
      expect(r.lines.filter((l) => l.startsWith("bo qua: "))).toEqual([
        "bo qua: contacts — planned",
        "bo qua: proto — dev",
        "bo qua: proto-bo-nut — dev",
      ]);
    },
    SLOW,
  );
});

describe("danh sach nguoi chua dang nhap co ly do", () => {
  it("every entry has a reason and names a screen of the register", () => {
    for (const why of Object.values(SIGNED_OUT_SCREENS)) expect(why.trim()).not.toBe("");
    expect(signedOutProblems(bridge(REPO_ROOT))).toEqual([]);
  });

  it(
    "a copy of the register without the listed screen fails the listing and names it",
    () => {
      const root = copyRegister();
      expect(signedOutProblems(bridge(root))).toEqual([]);
      edit(root, "design/screens.yaml", (t) => {
        const cut = t.replace(/ {2}- id: sign-in\n(?: {4}.*\n)+/, "");
        expect(cut).not.toBe(t);
        return cut;
      });
      // The page goes too, or the register reader stops first on a page that has no screen.
      rmSync(join(root, "src/app/login"), { recursive: true });
      expect(signedOutProblems(bridge(root))).toEqual([
        "man la trong danh sach nguoi chua dang nhap: sign-in",
      ]);
      const r = list(root);
      expect(r.status).not.toBe(0);
      expect(r.out).toContain("man la trong danh sach nguoi chua dang nhap: sign-in");
    },
    SLOW,
  );

  it("an empty reason is named", () => {
    expect(signedOutProblems(bridge(REPO_ROOT), { "sign-in": " " })).toEqual([
      "ly do rong trong danh sach nguoi chua dang nhap: sign-in",
    ]);
  });
});

describe("ca pha hang 1f giu nguyen", () => {
  /**
   * Every (recipe, break, pinned message for screen «man-thu») of FRAME and REGION on main at d85d815 — the main this
   * row merged before its shared-wait step; row 2 (signed, merged) renamed «chi con trang dau» to «chi con khung dau»
   * after a97c71d; row 2e (owner 2026-11-13) renamed the search case «tim» to the first-column filter case «loc-dau-cot»
   * and «tim-khong-ra» to «khong-khop», same breaks, same message after the case name. Drawn by machine when written: the file of `git show d85d815:tools/e2e_templates/recipes.ts` was
   * imported and each break's `pinned(brk, "man-thu").source` printed — not copied by hand.
   */
  const ROW_1F: readonly (readonly [string, string, string])[] = [
    ["tieu-de", "doi chu h1", "^man-thu: tieu-de — "],
    ["khong-cuon-ngang", "chen phan tu rong 2000px", "^man-thu: cuon-ngang — "],
    ["khong-loi-trinh-duyet", "nem loi tren trang", "^man-thu: loi-trinh-duyet — .*pha thu"],
    ["axe-sang-toi", "chu trang tren nen trang", "^man-thu: axe .*color-contrast"],
    ["cho-tai", "khung cho khong bao gio hien", "cho-tai: khung cho khong hien"],
    ["cho-tai", "bo do tre cua dong ho vung", "cho-tai: hien chi bao truoc 1 giay"],
    ["trong", "go buoc tiep", "trong: khong co buoc tiep"],
    ["khong-khop", "go nut Xoa loc", "khong-khop: thieu loi thoat Xoa loc"],
    ["loi", "go ly do", "loi: thieu ly do"],
    ["mot-phan-hong", "go bang bao", "mot-phan-hong: khong bao phan hong"],
    ["chu-dai", "go tabindex", "chu-dai: khong toi duoc bang ban phim"],
    ["khong-du-quyen", "chen so dong", "khong-du-quyen: lo so dong"],
    ["loc-dau-cot", "go mot dong khop", "loc-dau-cot: bo sot dong khop — "],
    ["loc-dau-cot", "chi con khung dau", "loc-dau-cot: bo sot dong khop — "],
    ["loc-dau-cot", "them mot dong khong khop", "loc-dau-cot: hien dong khong khop — "],
  ];

  /** The rows of ROW_1F missing from `recipes`, by recipe and break name. */
  function lost(recipes: readonly Recipe[]): string[] {
    const now = new Set(
      recipes.flatMap((r) =>
        r.breaks.map((b) => JSON.stringify([r.id, b.name, pinned(b, "man-thu").source])),
      ),
    );
    return ROW_1F.filter((row) => !now.has(JSON.stringify(row))).map(([r, b]) => `${r}: ${b}`);
  }

  it("FRAME and REGION hold every break of row 1f with the same pinned message", () => {
    expect(ROW_1F).toHaveLength(15);
    expect(lost([...FRAME, ...REGION])).toEqual([]);
  });

  it("a break dropped from a copy of the list is named", () => {
    const copy = [...FRAME, ...REGION].map((r) =>
      r.id === "loi" ? { ...r, breaks: r.breaks.filter((b) => b.name !== "go ly do") } : r,
    );
    expect(lost(copy)).toEqual(["loi: go ly do"]);
  });
});

describe("sổ sai thì đỏ", () => {
  for (const [name, change] of [
    ["a screen without route", (t: string) => t.replace("    route: /sent\n", "")],
    [
      "an unknown family",
      (t: string) =>
        t.replace(
          "route: /sent\n    title: Sent\n    family: grid",
          "route: /sent\n    title: Sent\n    family: la",
        ),
    ],
  ] as const) {
    it(
      `${name}: the listing fails with the 1d reader's words and lists nothing`,
      () => {
        const root = copyRegister();
        expect(list(root).status).toBe(0);
        edit(root, "design/screens.yaml", change);
        const problems = bridge(root).errors;
        expect(problems.length).toBeGreaterThan(0);
        const r = list(root);
        expect(r.status).not.toBe(0);
        for (const p of problems) expect(r.out).toContain(p);
        expect(r.lines.some((l) => / › man /.test(l))).toBe(false);
      },
      SLOW * 2,
    );
  }
});

describe("bảng vai theo bản khai", () => {
  it(
    "the role × screen table has the declared roles in order, and a fifth role adds a column",
    () => {
      const header = (lines: string[]) =>
        lines
          .find((l) => l.startsWith("Vai × Màn: | Màn |"))
          ?.split("|")
          .map((c) => c.trim())
          .filter(Boolean)
          .slice(1);
      const root = copyRegister();
      const declared = bridge(root).roles.map((r) => r.label);
      expect(declared).toHaveLength(4);
      expect(header(list(root).lines)).toEqual(["Màn", ...declared]);

      edit(root, "ontology/roles.yaml", (t) => `${t}  - name: Ghost\n    description: x\n`);
      edit(root, "ontology/labels.yaml", (t) => `${t}  Ghost:\n    kind: role\n    pref: Vai ma\n`);
      const five = header(list(root).lines);
      expect(five).toHaveLength(6);
      expect(five?.at(-1)).toBe("Vai ma");

      edit(root, "ontology/roles.yaml", (t) =>
        t.replace("  - name: Ghost\n    description: x\n", ""),
      );
      expect(header(list(root).lines)).toEqual(["Màn", ...declared]);
    },
    SLOW * 3,
  );
});

// ---- shared waits (row 1r: E8, E15) -----------------------------------------------------------------------------

/** Every browser test file of both runs, read from disk. */
function specFiles(): SpecFile[] {
  const out: SpecFile[] = [];
  for (const dir of ["tests/e2e", "tests/e2e-db"]) {
    for (const rel of readdirSync(join(REPO_ROOT, dir), { recursive: true }) as string[]) {
      if (!rel.endsWith(".spec.ts")) continue;
      const path = `${dir}/${rel}`;
      out.push({ path, text: readFileSync(join(REPO_ROOT, path), "utf8") });
    }
  }
  return out;
}

/** `playwright test --list --grep @cho` of both browser runs, one text. */
function choList(): string {
  const run = (args: string[]) => {
    const r = spawnSync("npx", ["playwright", "test", ...args, "--list", "--grep", "@cho"], {
      cwd: REPO_ROOT,
      encoding: "utf8",
    });
    if (r.status !== 0) throw new Error(`playwright --list ${args.join(" ")}: ${r.stderr}`);
    return r.stdout;
  };
  return `${run([])}\n${run(["-c", "playwright.db.config.ts"])}`;
}

describe("khong ban chep ham cho", () => {
  it("no browser test opens the sheet or waits for a banner by hand", () => {
    const files = specFiles();
    expect(files.map((f) => f.path)).toEqual(
      expect.arrayContaining([
        "tests/e2e/frame.spec.ts",
        "tests/e2e/app-shell.spec.ts",
        "tests/e2e-db/members.spec.ts",
        "tests/e2e/settle.spec.ts",
      ]),
    );
    expect(waitCopies(files)).toEqual([]);
  });

  it("a hand-written sheet opener put back into a copy of frame.spec.ts is named with file and line", () => {
    const frame = specFiles().find((f) => f.path === "tests/e2e/frame.spec.ts")!;
    expect(waitCopies([frame])).toEqual([]);
    const copy = `${frame.text}
async function openSheet(page: Page): Promise<void> {
  await page.getByRole("button", { name: "Mở hoặc đóng thanh bên" }).click();
}
`;
    // The file ends with a newline and the copy adds one more, so the function starts one line after the last.
    const at = frame.text.split("\n").length + 1;
    expect(waitCopies([{ path: frame.path, text: copy }])).toEqual([
      `tests/e2e/frame.spec.ts:${at}: ham mo ngan chep tay`,
      `tests/e2e/frame.spec.ts:${at + 1}: bam nut mo ngan khong qua openSheet`,
    ]);
  });

  it("a banner awaited by hand after going offline is named", () => {
    const frame = specFiles().find((f) => f.path === "tests/e2e/frame.spec.ts")!;
    const copy = frame.text.replace(
      'await shown(page.getByRole("alert").filter({ hasText: "Mất kết nối mạng" }), "bang mat mang");',
      'await expect(page.getByRole("alert").filter({ hasText: "Mất kết nối mạng" })).toBeVisible();',
    );
    expect(copy).not.toBe(frame.text);
    const found = waitCopies([{ path: frame.path, text: copy }]);
    expect(found).toHaveLength(1);
    expect(found[0]).toMatch(
      /^tests\/e2e\/frame\.spec\.ts:\d+: cho bang tu viet sau khi mat mang$/,
    );
  });
});

describe("the @cho du danh sach", () => {
  it("every test that calls the shared waits, read from the code, is in CHO_TESTS", () => {
    const files = specFiles();
    const members = files.find((f) => f.path === "tests/e2e-db/members.spec.ts")!;
    // Positive control: the reader sees a wait made through a helper (navMembers opens the sheet).
    expect(waitingTests(members)).toEqual([
      "moi-nguoi-va-dang-nhap",
      "doi-vai-thanh-ben",
      "khong-du-quyen",
    ]);
    const frame = files.find((f) => f.path === "tests/e2e/frame.spec.ts")!;
    expect(waitingTests(frame)).toContain(
      "a save that fails offline keeps the input and offers retry",
    );
    expect(unlisted(files)).toEqual([]);
  });

  it("a new test that waits for a banner in a copy of frame.spec.ts is named until it is listed", () => {
    const frame = specFiles().find((f) => f.path === "tests/e2e/frame.spec.ts")!;
    expect(unlisted([frame])).toEqual([]);
    const copy = `${frame.text}
test("a new banner wait", async ({ page }) => {
  await shown(page.getByRole("alert"), "bang moi");
});
`;
    expect(unlisted([{ path: frame.path, text: copy }])).toEqual([
      "tests/e2e/frame.spec.ts › a new banner wait",
    ]);
  });

  it(
    "every test of CHO_TESTS carries the @cho tag, and removing it from one names that test",
    () => {
      expect(CHO_TESTS["tests/e2e/settle.spec.ts"]).toHaveLength(5);
      expect(CHO_TESTS["tests/e2e/frame.spec.ts"]).toEqual(
        expect.arrayContaining([
          "losing the network shows a banner that leaves when it is back",
          "no serious accessibility violations on every frame screen",
        ]),
      );
      const listed = choList();
      expect(untagged(listed)).toEqual([]);

      // Without its tag the test drops out of `--grep @cho`: the same list less that test's lines.
      const NETWORK = "losing the network shows a banner that leaves when it is back";
      const stripped = listed
        .split("\n")
        .filter((l) => !l.trimEnd().endsWith(`› ${NETWORK}`))
        .join("\n");
      expect(stripped).not.toBe(listed);
      expect(untagged(stripped)).toEqual([`tests/e2e/frame.spec.ts › ${NETWORK}`]);
    },
    SLOW * 2,
  );
});
