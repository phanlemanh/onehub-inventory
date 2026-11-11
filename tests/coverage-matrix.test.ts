// Role × screen coverage check (roadmap row 1d, decision 0017): tools/coverage_matrix/check.py.
// Every red case has a green control on the same copy, and asserts the pinned message.
import { spawnSync } from "node:child_process";
import {
  cpSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { afterAll, describe, expect, it } from "vitest";

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CHECK = join(REPO, "tools/coverage_matrix/check.py");
const ROLES = ["Đầu chủ", "Đầu khách", "Trưởng nhóm", "Quản trị sàn"];
const OPEN = ["draft", "approved", "implemented", "verified"];
const CLOSED = ["signed-off", "machine-cleared", "da-cham-boi-thuc-te"];
const UI = ["ui", "web", "web-ui"];
const SLOW = { timeout: 120_000 };

const made: string[] = [];
afterAll(() => made.forEach((d) => rmSync(d, { recursive: true, force: true })));

function pagesUnder(dir: string): string[] {
  return readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter((e) => e.isFile() && /^page\.(tsx|ts|jsx|js|mdx)$/.test(e.name))
    .map((e) => relative(REPO, join(e.parentPath, e.name)));
}

/** A minimal copy of the repo: the two registers, the labels and the real pages. */
function copyRepo(): string {
  const root = mkdtempSync(join(tmpdir(), "coverage-matrix-"));
  made.push(root);
  for (const rel of ["ontology/labels.yaml", "ontology/roles.yaml", "design/screens.yaml"]) {
    mkdirSync(dirname(join(root, rel)), { recursive: true });
    cpSync(join(REPO, rel), join(root, rel));
  }
  for (const rel of pagesUnder(join(REPO, "src/app"))) {
    mkdirSync(dirname(join(root, rel)), { recursive: true });
    cpSync(join(REPO, rel), join(root, rel));
  }
  mkdirSync(join(root, "_acceptance"));
  return root;
}

function edit(root: string, rel: string, change: (text: string) => string) {
  const path = join(root, rel);
  writeFileSync(path, change(readFileSync(path, "utf8")));
}

/** Change one key of one screen entry in design/screens.yaml. */
function setScreen(root: string, id: string, key: string, value: string) {
  edit(root, "design/screens.yaml", (text) => {
    const start = text.indexOf(`  - id: ${id}\n`);
    expect(start, `screen ${id} in the register`).toBeGreaterThanOrEqual(0);
    const next = text.indexOf("  - id:", start + 1);
    const end = next === -1 ? text.length : next;
    const block = text
      .slice(start, end)
      .replace(new RegExp(`^    ${key}: .*$`, "m"), `    ${key}: ${value}`);
    return text.slice(0, start) + block + text.slice(end);
  });
}

function run(root: string, ...args: string[]) {
  const r = spawnSync("python3", [CHECK, "--root", root, ...args], { encoding: "utf8" });
  return { status: r.status, out: `${r.stdout}${r.stderr}` };
}

function report(root: string) {
  const r = run(root, "--report", "--json");
  expect(r.status).toBe(0);
  return JSON.parse(r.out) as Record<string, unknown> & {
    vong_cham_man: number;
    truoc_khoi: string[];
  };
}

type Matrix = { columns: string[]; rows: [string, ...string[]][] };

const goodMatrix = (): Matrix => ({
  columns: [...ROLES],
  rows: [
    [
      "inventory",
      "được — thấy căn của mình",
      "được — thấy căn cả sàn",
      "được — thấy cả sàn",
      "chặn — không xem hàng",
    ],
    [
      "sent",
      "được — thấy link mình gửi",
      "được — thấy link mình gửi",
      "không liên quan — vòng này không đổi phần xem của nhóm",
      "chặn — không xem hàng",
    ],
  ],
});

function row0(m: Matrix): [string, ...string[]] {
  const row = m.rows[0];
  if (!row) throw new Error("matrix has no row");
  return row;
}

function block(m: Matrix): string {
  const line = (cells: string[]) => `| ${cells.join(" | ")} |`;
  return [
    "## Vai × Màn",
    "",
    line(["Màn", ...m.columns]),
    line(["Màn", ...m.columns].map(() => "---")),
    ...m.rows.map((r) => line(r)),
    "",
  ].join("\n");
}

type Front = { status: string; surfaces?: string; screens?: string };

function writeContract(root: string, slug: string, front: Front, body = "") {
  const lines = ["---", "schema_version: 1", `slug: ${slug}`, `status: ${front.status}`];
  if (front.surfaces !== undefined) lines.push(`surfaces: ${front.surfaces}`);
  if (front.screens !== undefined) lines.push(`screens: ${front.screens}`);
  lines.push(
    "---",
    "",
    `# Acceptance Contract: ${slug}`,
    "",
    "## Criteria",
    "",
    "- AC-1: x",
    "",
    body,
  );
  mkdirSync(join(root, "_acceptance", slug), { recursive: true });
  writeFileSync(join(root, "_acceptance", slug, "contract.md"), lines.join("\n"));
}

const REL = "_acceptance/r/contract.md";

describe("roles", () => {
  it("the repo declares the four assignable roles", () => {
    const text = readFileSync(join(REPO, "ontology/roles.yaml"), "utf8");
    const names = [...text.matchAll(/^ {2}- name: (\S+)$/gm)].map((m) => m[1]);
    expect(names).toEqual(["ListAgent", "BuyerAgent", "TeamLead", "CompanyAdmin"]);
    expect(text).toMatch(/^holds: many$/m);
    const generated = readFileSync(join(REPO, "src/generated/ontology.ts"), "utf8");
    expect(generated).toContain(
      'export type Role = "ListAgent" | "BuyerAgent" | "TeamLead" | "CompanyAdmin";',
    );
  });

  it("a role without a role label is red", () => {
    const root = copyRepo();
    expect(run(root).status).toBe(0);
    edit(root, "ontology/roles.yaml", (t) => `${t}  - name: Ghost\n    description: x\n`);
    const r = run(root);
    expect(r.status).toBe(1);
    expect(r.out).toContain("role 'Ghost' has no role label");
  });
});

describe("screens", () => {
  it("the repo register matches every page", () => {
    const r = run(REPO);
    expect(r.out).toContain("coverage-matrix: ok");
    expect(r.status).toBe(0);
    const routes = pagesUnder(join(REPO, "src/app")).map((p) => {
      const parts = dirname(relative("src/app", p))
        .split("/")
        .filter((s) => s !== "." && !/^\(.*\)$/.test(s) && !s.startsWith("@"));
      return `/${parts.join("/")}`;
    });
    const register = readFileSync(join(REPO, "design/screens.yaml"), "utf8");
    const built = [...register.matchAll(/route: (\S+)\n(?:.*\n){3}\s+status: built/g)].map(
      (m) => m[1],
    );
    expect(new Set(routes)).toEqual(new Set(built));
    expect(new Set(built)).toEqual(new Set(["/", "/inventory", "/sent", "/proto/[slug]"]));
  });

  it("an undeclared page is red", () => {
    const root = copyRepo();
    expect(run(root).status).toBe(0);
    mkdirSync(join(root, "src/app/(app)/ghost"), { recursive: true });
    writeFileSync(join(root, "src/app/(app)/ghost/page.tsx"), "export default function P() {}\n");
    const r = run(root);
    expect(r.status).toBe(1);
    expect(r.out).toContain("page '/ghost' is not in design/screens.yaml");
  });

  const REGISTER_ERRORS: [string, (root: string) => void, string][] = [
    [
      "built without a page",
      (r) => setScreen(r, "contacts", "status", "built"),
      "screen 'contacts' is built but has no page",
    ],
    [
      "planned with a page",
      (r) => setScreen(r, "inventory", "status", "planned"),
      "screen 'inventory' is planned but has a page",
    ],
    [
      "duplicate id",
      (r) =>
        edit(r, "design/screens.yaml", (t) => t.replace("  - id: sent\n", "  - id: inventory\n")),
      "duplicate screen id 'inventory'",
    ],
    [
      "duplicate route",
      (r) => setScreen(r, "sent", "route", "/inventory"),
      "duplicate route '/inventory'",
    ],
    [
      "unknown family",
      (r) => setScreen(r, "inventory", "family", "tabular"),
      "screen 'inventory': unknown family 'tabular'",
    ],
    [
      "unknown audience",
      (r) => setScreen(r, "today", "audience", "everyone"),
      "screen 'today': unknown audience 'everyone'",
    ],
    [
      "unknown status",
      (r) => setScreen(r, "today", "status", "done"),
      "screen 'today': unknown status 'done'",
    ],
    [
      "unknown title",
      (r) => setScreen(r, "today", "title", "Nope"),
      "screen 'today': title label 'Nope' is not in ontology/labels.yaml",
    ],
  ];

  it("register errors", SLOW, () => {
    expect(REGISTER_ERRORS).toHaveLength(8);
    for (const [name, breakIt, message] of REGISTER_ERRORS) {
      const root = copyRepo();
      expect(run(root).status, `${name}: healthy copy`).toBe(0);
      breakIt(root);
      const r = run(root);
      expect(r.status, name).toBe(1);
      expect(r.out, name).toContain(message);
    }
  });

  function contactsInGrid(root: string) {
    const text = readFileSync(join(root, "design/screens.yaml"), "utf8");
    const m =
      /- id: contacts\n {4}route: (\S+)\n {4}title: (\S+)\n {4}family: (\S+)\n {4}audience: \S+\n {4}status: (\S+)/.exec(
        text,
      );
    if (!m || m[3] !== "grid") throw new Error("contacts must be in grid");
    return { route: m[1], title: m[2], status: m[4] };
  }

  it("contacts is declared ahead in the grid family", () => {
    expect(contactsInGrid(REPO)).toEqual({
      route: "/contacts",
      title: "Contact",
      status: "planned",
    });
    const register = readFileSync(join(REPO, "design/screens.yaml"), "utf8");
    for (const id of ["inventory", "sent"]) {
      expect(register, id).toMatch(new RegExp(`- id: ${id}\\n(?:.*\\n){2}\\s+family: grid\\n`));
    }
    expect(
      pagesUnder(join(REPO, "src/app")).filter((p) => /\/contacts\/page\.\w+$/.test(p)),
    ).toEqual([]);
    const root = copyRepo();
    setScreen(root, "contacts", "family", "null");
    expect(() => contactsInGrid(root)).toThrow("contacts must be in grid");
  });
});

describe("contracts", () => {
  it("an open UI round needs the block", SLOW, () => {
    expect(OPEN).toHaveLength(4);
    for (const status of OPEN) {
      for (const surfaces of UI) {
        const label = `${status} [${surfaces}]`;
        const root = copyRepo();
        writeContract(root, "r", { status, surfaces: `[${surfaces}]` }, block(goodMatrix()));
        let r = run(root);
        expect(r.status, label).toBe(1);
        expect(r.out, label).toContain(`${REL}: touches the UI but declares no screens`);

        writeContract(root, "r", { status, surfaces: `[${surfaces}]`, screens: "[inventory]" });
        r = run(root);
        expect(r.status, label).toBe(1);
        expect(r.out, label).toContain(`${REL}: missing section '## Vai × Màn'`);

        writeContract(
          root,
          "r",
          { status, surfaces: `[${surfaces}]`, screens: "[]" },
          "## Vai × Màn\n\n",
        );
        r = run(root);
        expect(r.status, label).toBe(1);
        expect(r.out, label).toContain(
          `${REL}: screens is empty, give the reason under '## Vai × Màn'`,
        );

        writeContract(
          root,
          "r",
          { status, surfaces: `[${surfaces}]`, screens: "[inventory, sent]" },
          block(goodMatrix()),
        );
        expect(run(root).status, `${label}: full block`).toBe(0);
        writeContract(
          root,
          "r",
          { status, surfaces: `[${surfaces}]`, screens: "[]" },
          "## Vai × Màn\n\nVòng này chỉ dựng thành phần dùng chung, chưa màn nào dùng.\n",
        );
        expect(run(root).status, `${label}: empty screens with a reason`).toBe(0);
      }
    }
  });

  it("declared screens need the block without a UI surface", () => {
    const root = copyRepo();
    writeContract(root, "r", { status: "draft", surfaces: "[config]", screens: "[inventory]" });
    const r = run(root);
    expect(r.status).toBe(1);
    expect(r.out).toContain(`${REL}: missing section '## Vai × Màn'`);
    const m = goodMatrix();
    m.rows = [row0(m)];
    writeContract(
      root,
      "r",
      { status: "draft", surfaces: "[config]", screens: "[inventory]" },
      block(m),
    );
    expect(run(root).status).toBe(0);
  });

  it("unknown status is red", () => {
    const root = copyRepo();
    writeContract(
      root,
      "r",
      { status: "draft", surfaces: "[ui]", screens: "[inventory, sent]" },
      block(goodMatrix()),
    );
    expect(run(root).status).toBe(0);
    writeContract(
      root,
      "r",
      { status: "dang-lam", surfaces: "[ui]", screens: "[inventory, sent]" },
      block(goodMatrix()),
    );
    const r = run(root);
    expect(r.status).toBe(1);
    expect(r.out).toContain(`${REL}: unknown status 'dang-lam'`);
  });

  const BLOCK_ERRORS: [string, (m: Matrix) => string, string][] = [
    [
      "role column dropped",
      (m) => {
        m.columns.pop();
        m.rows.forEach((r) => r.pop());
        return "[inventory, sent]";
      },
      "missing role column 'Quản trị sàn'",
    ],
    [
      "column that is not a role",
      (m) => {
        m.columns.push("Khách");
        m.rows.forEach((r) => r.push("được — xem"));
        return "[inventory, sent]";
      },
      "column 'Khách' is not a role",
    ],
    [
      "empty cell",
      (m) => ((row0(m)[2] = ""), "[inventory, sent]"),
      "screen 'inventory', role 'Đầu khách': empty cell",
    ],
    [
      "cell without a verdict",
      (m) => ((row0(m)[2] = "có"), "[inventory, sent]"),
      "must start with được, chặn or không liên quan",
    ],
    [
      "unrelated without a reason",
      (m) => ((row0(m)[2] = "không liên quan"), "[inventory, sent]"),
      "'không liên quan' needs a reason",
    ],
    ["row missing", (m) => (m.rows.pop(), "[inventory, sent]"), "missing row for screen 'sent'"],
    [
      "row not in screens",
      (m) => (
        m.rows.push(["contacts", "được — x", "được — x", "được — x", "chặn — x"]),
        "[inventory, sent]"
      ),
      "row 'contacts' is not in screens",
    ],
    [
      "screen not in the register",
      () => "[inventory, sent, ghost]",
      "screen 'ghost' is not in design/screens.yaml",
    ],
  ];

  it("block errors", SLOW, () => {
    expect(BLOCK_ERRORS).toHaveLength(8);
    const root = copyRepo();
    writeContract(
      root,
      "r",
      { status: "draft", surfaces: "[ui]", screens: "[inventory, sent]" },
      block(goodMatrix()),
    );
    expect(run(root).status, "healthy record").toBe(0);
    for (const [name, breakIt, message] of BLOCK_ERRORS) {
      const m = goodMatrix();
      const screens = breakIt(m);
      writeContract(root, "r", { status: "draft", surfaces: "[ui]", screens }, block(m));
      const r = run(root);
      expect(r.status, name).toBe(1);
      expect(r.out, name).toContain(`${REL}: `);
      expect(r.out, name).toContain(message);
    }
  });

  it("closed records", SLOW, () => {
    expect(CLOSED).toHaveLength(3);
    for (const status of CLOSED) {
      const root = copyRepo();
      writeContract(root, "r", { status, surfaces: "[ui]" });
      expect(run(root).status, status).toBe(0);
      expect(report(root).truoc_khoi, status).toEqual(["r"]);

      const m = goodMatrix();
      m.columns.shift();
      m.rows.forEach((r) => r.splice(1, 1));
      writeContract(
        root,
        "r",
        { status, surfaces: "[ui]", screens: "[inventory, sent]" },
        block(m),
      );
      const r = run(root);
      expect(r.status, status).toBe(1);
      expect(r.out, status).toContain("missing role column 'Đầu chủ'");
    }
    const root = copyRepo();
    writeContract(root, "r", { status: "draft", surfaces: "[config]" });
    expect(run(root).status).toBe(0);
    expect(report(root).vong_cham_man).toBe(0);
    expect(report(root).khong_cham).toEqual(["r"]);
  });

  it("the repo records pass", () => {
    expect(run(REPO).status).toBe(0);
    expect(report(REPO).truoc_khoi).toContain("khung-va-giao-dien");
  });
});

describe("report", () => {
  function tally(root: string, secondUnrelated: boolean) {
    writeContract(
      root,
      "r1",
      { status: "draft", surfaces: "[ui]", screens: "[inventory, sent]" },
      block(goodMatrix()),
    );
    const one = goodMatrix();
    one.rows = [row0(one)];
    if (secondUnrelated) row0(one)[1] = "không liên quan — vòng này chỉ đổi phần của Đầu khách";
    writeContract(
      root,
      "r2",
      { status: "approved", surfaces: "[web]", screens: "[inventory]" },
      block(one),
    );
    const broken = goodMatrix();
    broken.columns.pop();
    broken.rows.forEach((r) => r.pop());
    writeContract(
      root,
      "r3",
      { status: "implemented", surfaces: "[ui]", screens: "[inventory, sent]" },
      block(broken),
    );
    writeContract(root, "r4", { status: "signed-off", surfaces: "[ui]" });
    writeContract(
      root,
      "r5",
      { status: "draft", surfaces: "[ui]", screens: "[]" },
      "## Vai × Màn\n\nChỉ dựng thành phần dùng chung.\n",
    );
    writeContract(root, "r6", { status: "draft", surfaces: "[config]" });
    return spawnSync("make", ["-s", "coverage-report", `COVERAGE_ROOT=${root}`], {
      cwd: REPO,
      encoding: "utf8",
    });
  }

  it("counts match a hand-written tally", SLOW, () => {
    const r = tally(copyRepo(), false);
    expect(r.status).toBe(0);
    const lines = r.stdout.split("\n");
    for (const expected of [
      "vòng chạm màn: 5",
      "đủ ô: 2",
      "thiếu ô: 1",
      "trước khối: 1",
      "không khai màn: 1",
      "ô không liên quan: 1/12 (8%)",
      "mốc Quỹ hàng: 33/98",
    ]) {
      expect(lines, expected).toContain(expected);
    }
    const control = tally(copyRepo(), true);
    expect(control.status).toBe(0);
    expect(control.stdout.split("\n")).toContain("ô không liên quan: 2/12 (17%)");
  });
});

describe("make", () => {
  it("check depends on the matrix and keeps its exit code", SLOW, () => {
    const db = spawnSync("make", ["-pn", "check"], { cwd: REPO, encoding: "utf8" }).stdout;
    const checkLine = db.split("\n").find((l) => l.startsWith("check:"));
    expect(checkLine?.split(/\s+/)).toContain("coverage-matrix");
    const start = db.split("\n").findIndex((l) => l.startsWith("coverage-matrix:"));
    expect(start).toBeGreaterThanOrEqual(0);
    const recipe: string[] = [];
    for (const l of db.split("\n").slice(start + 1)) {
      if (l === "") break;
      if (l.startsWith("\t") && l.trim()) recipe.push(l.slice(1));
    }
    expect(recipe).toHaveLength(1);
    expect(recipe[0]).toContain("tools/coverage_matrix/check.py");
    expect(recipe[0]).not.toMatch(/^[-@]*-/);
    expect(recipe[0]).not.toContain("|| true");

    const make = (root: string) =>
      spawnSync("make", ["-s", "coverage-matrix", `COVERAGE_ROOT=${root}`], {
        cwd: REPO,
        encoding: "utf8",
      });
    const real = spawnSync("make", ["-s", "coverage-matrix"], { cwd: REPO, encoding: "utf8" });
    expect(real.status).toBe(0);
    expect(real.stdout).toContain("coverage-matrix: ok");

    const healthy = copyRepo();
    expect(make(healthy).status).toBe(0);

    const page = copyRepo();
    mkdirSync(join(page, "src/app/(app)/ghost"), { recursive: true });
    writeFileSync(join(page, "src/app/(app)/ghost/page.tsx"), "export default function P() {}\n");
    const pageRun = make(page);
    expect(pageRun.status).not.toBe(0);
    expect(pageRun.stdout).toContain("page '/ghost' is not in design/screens.yaml");

    const role = copyRepo();
    const m = goodMatrix();
    m.columns.pop();
    m.rows.forEach((r) => r.pop());
    writeContract(
      role,
      "r",
      { status: "draft", surfaces: "[ui]", screens: "[inventory, sent]" },
      block(m),
    );
    const roleRun = make(role);
    expect(roleRun.status).not.toBe(0);
    expect(roleRun.stdout).toContain("missing role column 'Quản trị sàn'");
  });
});

describe("review round 1", () => {
  // Surfaces as the kit reads them: a list or a comma string, any case (contract template of the kit).
  const SURFACE_FORMS = ["[UI]", "ui, config", '"web-ui"', "[Web, config]"];

  it("surfaces written the way the kit reads them still need the block", SLOW, () => {
    expect(SURFACE_FORMS).toHaveLength(4);
    for (const surfaces of SURFACE_FORMS) {
      const root = copyRepo();
      writeContract(root, "r", { status: "draft", surfaces });
      const r = run(root);
      expect(r.status, surfaces).toBe(1);
      expect(r.out, surfaces).toContain(`${REL}: touches the UI but declares no screens`);
      writeContract(
        root,
        "r",
        { status: "draft", surfaces, screens: "[inventory, sent]" },
        block(goodMatrix()),
      );
      expect(run(root).status, `${surfaces}: full block`).toBe(0);
    }
    const root = copyRepo();
    writeContract(root, "r", { status: "draft", surfaces: "config, api" });
    expect(run(root).status, "no UI surface").toBe(0);
  });

  it("a register that is not a mapping is red", () => {
    const screens = copyRepo();
    mkdirSync(join(screens, "src/app/(app)/ghost"), { recursive: true });
    writeFileSync(
      join(screens, "src/app/(app)/ghost/page.tsx"),
      "export default function P() {}\n",
    );
    edit(screens, "design/screens.yaml", (t) =>
      t.replace(/^[\s\S]*?^screens:\n/m, "").replace(/^ {2}/gm, ""),
    );
    let r = run(screens);
    expect(r.status).toBe(1);
    expect(r.out).toContain("design/screens.yaml: must be a mapping at the top level");
    expect(r.out).toContain("page '/ghost' is not in design/screens.yaml");

    const roles = copyRepo();
    expect(run(roles).status).toBe(0);
    edit(roles, "ontology/roles.yaml", (t) =>
      t.replace(/^[\s\S]*?^roles:\n/m, "").replace(/^ {2}/gm, ""),
    );
    r = run(roles);
    expect(r.status).toBe(1);
    expect(r.out).toContain("ontology/roles.yaml: must be a mapping at the top level");
  });
});
