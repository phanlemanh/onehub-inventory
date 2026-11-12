// Tests for the register-driven suite (roadmap row 1f, _acceptance/bo-bai-kiem-tu-so-man).
// The list cases run `playwright test --list` on an edited copy of the register (SCREENS_ROOT); every edit has its
// positive control on the same copy first.
import { execFileSync, spawnSync } from "node:child_process";
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

import { describe, expect, it } from "vitest";

import {
  FRAME,
  NO_REGION_YET,
  REGION,
  classifyGrid,
  compareRows,
  pickNeedle,
  pinned,
} from "./recipes";
import { REPO_ROOT, SESSION_SCREENS } from "./register";
import { sampleUnits, subdivisionNameOf } from "../../src/modules/catalog";
import { SAMPLE_COMPANY, buildSampleListings } from "../../src/modules/listings";
import { inventoryRows } from "../../src/modules/listings/ui/inventory-rows";
import { checkRecipes, regionStates } from "./structure";

const STATES_MD = readFileSync(join(REPO_ROOT, "design/states.md"), "utf8");
const SLOW = 60_000;

// ---- structure (E5, E9) -----------------------------------------------------------------------------------------

describe("công thức phủ bảng trạng thái", () => {
  it("every region state of design/states.md has one recipe, every recipe a break and a message", () => {
    /** Written before the code: the seven region states. */
    const SEVEN = [
      "chờ tải",
      "trống",
      "tìm không ra",
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
      "| Không đủ quyền   |",
      "| Thử ma | Trạng thái giả của bài kiểm | Bài kiểm của vùng |\n| Không đủ quyền   |",
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
  it("a grid screen outside the list without a region is red, not skipped", () => {
    expect(() => classifyGrid("ghost-grid", { hasRegion: false, hasTable: false })).toThrow(
      "chua co vung du lieu: ghost-grid",
    );
  });
  it("a listed screen without a region is skipped with its reason", () => {
    const v = classifyGrid("sent", { hasRegion: false, hasTable: false });
    expect(v).toEqual({ run: false, skip: `chua co vung du lieu — ${NO_REGION_YET["sent"]}` });
  });
  it("a listed screen that has a region must leave the list", () => {
    expect(() => classifyGrid("sent", { hasRegion: true, hasTable: true })).toThrow(
      "go khoi danh sach: sent",
    );
  });
  // Row 2 (Bảng hàng): the inventory screen built its region, so it left the list and its region suite runs.
  it("inventory has left the list and its region suite runs", () => {
    expect(Object.keys(NO_REGION_YET)).toEqual(["sent"]);
    expect(classifyGrid("inventory", { hasRegion: true, hasTable: true })).toEqual({ run: true });
  });
  it("putting inventory back on the list is red", () => {
    const back = { ...NO_REGION_YET, inventory: "tra lai" };
    expect(() => classifyGrid("inventory", { hasRegion: true, hasTable: true }, back)).toThrow(
      "da co vung, go khoi danh sach: inventory",
    );
  });
  it("a table outside the shared region is red", () => {
    expect(() => classifyGrid("sent", { hasRegion: false, hasTable: true })).toThrow(
      "sent: luoi dung ngoai khuon",
    );
  });
});

// ---- search on the inventory run (row 2, E5) ----------------------------------------------------------------------

describe("bai tim tren Bang hang cuon lien (hang 2)", () => {
  // The texts the search recipe reads (text cells: unit, building, project), built by the screen's own row builder.
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
      const hits = rows
        .map((r, i) => (r.some((t) => t.toLocaleLowerCase("vi").includes(needle!)) ? i : -1))
        .filter((i) => i >= 0);
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
    expect(compareRows([["a"], ["b"]], [["a"]])).toBe("tim: bo sot dong khop — b");
    expect(compareRows([["a"]], [["a"], ["z"]])).toBe("tim: hien dong khong khop — z");
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
  for (const rel of Object.values(SESSION_SCREENS)) {
    mkdirSync(dirname(join(root, rel)), { recursive: true });
    cpSync(join(REPO_ROOT, rel), join(root, rel));
  }
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
      /** Written before the code: the built staff and public screens on main after row 8. */
      const SCREENS = ["today", "inventory", "sent", "sign-in"];
      const expected = SCREENS.flatMap((s) =>
        SIZES.flatMap((z) => FRAME_TESTS.map((t) => `${z} ${s} ${t}`)),
      );
      expect(expected).toHaveLength(64);

      const root = copyRegister();
      const before = list(root);
      expect(before.status).toBe(0);
      expect(frameCases(before.lines, "khung").sort()).toEqual([...expected].sort());
      expect(frameCases(before.lines, "pha khung")).toHaveLength(64);
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
      expect(frameCases(added.lines, "khung")).toHaveLength(80);

      edit(root, "design/screens.yaml", (t) => t.split("  - id: ghost-built\n")[0]!);
      rmSync(join(root, "src/app/ghost"), { recursive: true });
      expect(frameCases(list(root).lines, "khung")).toHaveLength(64);
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

describe("màn cần đăng nhập bỏ qua có điều kiện", () => {
  it(
    "the members screen is skipped by name while its signed-in test measures frame and axe",
    () => {
      const r = list(copyRegister());
      expect(r.status).toBe(0);
      expect(r.lines).toContain(
        "bo qua: members — can dang nhap — khung va axe do o tests/e2e-db/members.spec.ts",
      );
      expect(r.lines.some((l) => / › man members › /.test(l))).toBe(false);
    },
    SLOW,
  );

  for (const [name, change, message] of [
    [
      "the signed-in test is gone",
      null,
      "man members can dang nhap nhung bai tests/e2e-db/members.spec.ts khong co",
    ],
    [
      "the signed-in test no longer runs axe",
      (t: string) => t.replaceAll("AxeBuilder", "KhongCo"),
      "man members can dang nhap nhung bai tests/e2e-db/members.spec.ts khong chay axe",
    ],
  ] as const) {
    it(
      `${name}: the listing fails and names the screen`,
      () => {
        const root = copyRegister();
        const file = join(root, SESSION_SCREENS["members"]!);
        if (change) writeFileSync(file, change(readFileSync(file, "utf8")));
        else rmSync(file);
        const r = list(root);
        expect(r.status).not.toBe(0);
        expect(r.out).toContain(message);
      },
      SLOW,
    );
  }
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
