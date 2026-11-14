// Tests for row 1q in tools/proof_gate/check.py (_acceptance/cong-bat-khoi-khong-ke): a file of the generated component
// register outside the supplier folders must be declared — in the block ledger, in the list of files made before
// row 1q (tools/proof_gate/thanh-phan-co-truoc.yaml), or in the «Khối» table of an open round. Otherwise one line
// `khoi-khong-ke`. Every rule: a healthy sample is quiet, breaking one thing on a copy turns it red with a pinned text.
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  cpSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const ROOT = fileURLToPath(new URL("../..", import.meta.url));
const HERE = fileURLToPath(new URL(".", import.meta.url));
const SCRIPT = join(HERE, "check.py");
const PR58 = join(HERE, "fixtures/so-thanh-phan-pr58.json");
// sha256 of design/component-registry.json at a7e2c81d15f93bf3e3ec9195851b3dc430eaf627 (PR #58, design-assembly).
const PR58_SHA256 = "d56dd10457aed30d50c6836e21ee125a8c46dbc7de3057b0c32b9581a5536a47";
const CODE = "khoi-khong-ke";
const SENTENCE = "chưa kê ở sổ khối, danh sách có trước hay bảng Khối của hồ sơ đang mở nào";
const NEW_FILE = "src/components/candidate/khoi-moi.tsx";

// The files of the real register that row 1q found without a ledger line on the main branch. Adding a file to the
// list means changing this test too (tools/**, owner's approval).
const BEFORE_1Q = [
  "src/components/candidate/action-permission.tsx",
  "src/components/candidate/column-filter-cell.tsx",
  "src/components/candidate/region-header.tsx",
  "src/components/candidate/region-state.tsx",
  "src/components/templates/app-shell.tsx",
  "src/components/templates/app-shell/place-change.tsx",
  "src/components/templates/app-shell/second-column.tsx",
  "src/components/templates/nav-menu.tsx",
  "src/components/templates/page-skeleton.tsx",
  "src/components/templates/page-state.tsx",
  "src/components/templates/screen-banner.tsx",
  "src/components/templates/theme.tsx",
];

const OPEN = ["draft", "approved", "implemented", "verified"];
const CLOSED = ["signed-off", "machine-cleared"];

function run(root: string, args: string[] = [], env: NodeJS.ProcessEnv = process.env) {
  return spawnSync("python3", [SCRIPT, "--root", root, ...args], { encoding: "utf8", env });
}

function write(root: string, rel: string, content: string | Buffer) {
  mkdirSync(dirname(join(root, rel)), { recursive: true });
  writeFileSync(join(root, rel), content);
}

/** Lines of the gate output that carry the 1q code. */
function undeclared(out: string): string[] {
  return out.split("\n").filter((l) => l.includes(` · ${CODE}: `));
}

type Comp = { name: string; file: string; parts?: { name: string }[] };

function registry(root: string, comps: Comp[]) {
  write(root, "design/component-registry.json", JSON.stringify({ version: 2, components: comps }));
}

const BASE: Comp[] = [
  { name: "Button", file: "src/components/ui/button.tsx" },
  { name: "Badge", file: "src/components/reui/badge.tsx" },
  { name: "KhoiMoi", file: NEW_FILE },
];

/**
 * A sample repo with decision 0023 on (empty ledger), row 1q on (empty list of files made before it) and one
 * undeclared own file, khoi-moi.tsx.
 */
function sample(opts: { ledger?: boolean; before?: boolean; comps?: Comp[] } = {}): string {
  const root = mkdtempSync(join(tmpdir(), "proof-gate-1q-"));
  write(root, "design/screens.yaml", "families: {}\nscreens: []\n");
  registry(root, opts.comps ?? BASE);
  write(root, "design/reui-catalog.json", JSON.stringify({ groups: [] }));
  write(root, NEW_FILE, "export {};\n");
  if (opts.ledger !== false) write(root, "design/so-khoi.yaml", "version: 1\nkhoi: []\n");
  if (opts.before !== false) {
    write(root, "tools/proof_gate/thanh-phan-co-truoc.yaml", "version: 1\ntep: []\n");
  }
  return root;
}

function copy(root: string): string {
  const to = mkdtempSync(join(tmpdir(), "proof-gate-1q-copy-"));
  cpSync(root, to, { recursive: true });
  return to;
}

function ledgerLine(root: string, over: Record<string, string>) {
  const e = {
    ten: "KhoiKhac",
    tep: "src/components/candidate/khac.tsx",
    nguon: "tao-tay",
    nhu_cau: "nhu-cau-mau",
    mo_ta: "Một khối mẫu",
    ho_so: "vong-cu",
    duyet: "2026-11-12",
    ...over,
  };
  write(
    root,
    "design/so-khoi.yaml",
    [
      "version: 1",
      "khoi:",
      ...Object.entries(e).map(([k, v], i) => `${i === 0 ? "  - " : "    "}${k}: ${v}`),
      "",
    ].join("\n"),
  );
}

function beforeList(root: string, rows: { tep?: string; ten?: string; ly_do?: string }[]) {
  write(
    root,
    "tools/proof_gate/thanh-phan-co-truoc.yaml",
    [
      "version: 1",
      "tep:",
      ...rows.flatMap((r) => {
        const kv = Object.entries(r).filter(([, v]) => v !== undefined);
        return kv.map(([k, v], i) => `${i === 0 ? "  - " : "    "}${k}: ${v}`);
      }),
      "",
    ].join("\n"),
  );
}

/** A round at `status` whose proof lists `blocks` in the «Khối» table of a screen (or of a wrapping template). */
function round(
  root: string,
  slug: string,
  status: string,
  blocks: string[],
  where: "man" | "khuon" = "man",
) {
  const approved = status === "draft" ? "" : "approved_at: 2026-11-14\n";
  write(
    root,
    `_acceptance/${slug}/contract.md`,
    `---\nslug: ${slug}\nstatus: ${status}\nscreens: []\n${approved}---\n\n# ${slug}\n`,
  );
  write(
    root,
    `_acceptance/${slug}/chung-minh-man.md`,
    [
      where === "man" ? "## Màn mau" : "## Khuôn app-shell",
      "",
      "### Khối",
      "",
      "| Khối | Bậc | Đã tra | Ứng viên gần nhất | Vì sao không dùng |",
      "| --- | --- | --- | --- | --- |",
      ...blocks.map((b) => `| ${b} | ve-tay | khối mẫu | Button | mẫu |`),
      "",
    ].join("\n"),
  );
}

// ---------------------------------------------------------------- AC-1

describe("tệp tự làm phải có chỗ kê", () => {
  it("tệp không ở đâu → thoát 1, đúng một dòng khoi-khong-ke nêu tệp, tên và câu ghim", () => {
    const root = sample();
    const r = run(root);
    expect(r.status).toBe(1);
    const lines = undeclared(r.stdout);
    expect(lines).toHaveLength(1);
    expect(lines[0]).toContain(NEW_FILE);
    expect(lines[0]).toContain("KhoiMoi");
    expect(lines[0]).toContain(SENTENCE);
  });

  it("ma trận bốn chỗ kê, mỗi chỗ đặt riêng trên bản sao của CÙNG kho → im", () => {
    const red = sample();
    const places: [string, (root: string) => void][] = [
      ["sổ khối theo tep", (root) => ledgerLine(root, { tep: NEW_FILE })],
      ["sổ khối theo ten", (root) => ledgerLine(root, { ten: "KhoiMoi" })],
      ["danh sách có trước", (root) => beforeList(root, [{ tep: NEW_FILE, ly_do: "có trước" }])],
      ["bảng Khối của hồ sơ draft", (root) => round(root, "vong-moi", "draft", ["KhoiMoi"])],
    ];
    expect(places).toHaveLength(4);
    for (const [name, put] of places) {
      const root = copy(red);
      put(root);
      expect(undeclared(run(root).stdout), name).toEqual([]);
    }
  });

  it("tệp nhà cung cấp không ở đâu → không dòng nào nêu nó, dòng đỏ của khoi-moi.tsx vẫn còn", () => {
    const root = sample({
      comps: [
        ...BASE,
        { name: "Dialog", file: "src/components/ui/dialog.tsx" },
        { name: "Stepper", file: "src/components/reui/stepper.tsx" },
      ],
    });
    const r = run(root);
    expect(r.status).toBe(1);
    const lines = undeclared(r.stdout);
    expect(lines).toHaveLength(1);
    expect(lines[0]).toContain("khoi-moi.tsx");
    expect(r.stdout).not.toContain("src/components/ui/");
    expect(r.stdout).not.toContain("src/components/reui/");
  });

  it("tệp lồng dưới templates không ở đâu → dòng đỏ nêu đúng đường lồng", () => {
    const nested = "src/components/templates/x/khoi-long.tsx";
    const root = sample({ comps: [...BASE, { name: "KhoiLong", file: nested }] });
    const lines = undeclared(run(root).stdout);
    expect(lines.filter((l) => l.includes(nested))).toHaveLength(1);
  });

  it("kho không có sổ khối (luật 0023 tắt) → không dòng khoi-khong-ke", () => {
    expect(undeclared(run(sample({ ledger: false })).stdout)).toEqual([]);
  });

  it("kho không có danh sách có trước (bản sao không có tools/, như bài kho thật của hàng 1c) → không dòng khoi-khong-ke", () => {
    const r = run(sample({ before: false }));
    expect(undeclared(r.stdout)).toEqual([]);
    expect(r.status).toBe(0);
  });
});

// ---------------------------------------------------------------- AC-2

describe("chỗ kê theo trạng thái hồ sơ", () => {
  it("ma trận 6 trạng thái × 2 chỗ: bốn trạng thái mở im, hai trạng thái đóng đỏ một dòng", () => {
    const cells: [string, "man" | "khuon"][] = [];
    for (const s of [...OPEN, ...CLOSED])
      for (const w of ["man", "khuon"] as const) cells.push([s, w]);
    expect(cells).toHaveLength(12);
    const seen: Record<string, number[]> = {};
    for (const [status, where] of cells) {
      const root = sample();
      round(root, "vong", status, ["KhoiMoi"], where);
      const n = undeclared(run(root).stdout).filter((l) => l.includes(NEW_FILE)).length;
      expect(n, `${status} ${where}`).toBe(OPEN.includes(status) ? 0 : 1);
      (seen[status] ??= []).push(n);
    }
    for (const s of Object.keys(seen)) expect(new Set(seen[s]).size, s).toBe(1);
  });
});

// ---------------------------------------------------------------- AC-3

describe("hai hình sổ thành phần", () => {
  const AB = "src/components/candidate/khoi-ab.tsx";

  it("bản sao sổ của PR #58 đúng từng byte (băm ghim)", () => {
    const sha = createHash("sha256").update(readFileSync(PR58)).digest("hex");
    expect(sha).toBe(PR58_SHA256);
  });

  it("bộ đọc lấy đủ thành phần của region-header.tsx ở cả hai hình, từ sổ thật", () => {
    const pr58 = sample();
    write(pr58, "design/component-registry.json", readFileSync(PR58));
    const line58 = undeclared(run(pr58).stdout).find((l) => l.includes("region-header.tsx"));
    expect(line58).toBeDefined();
    for (const n of ["RegionTitle", "RegionToolbar", "RegionHeader"]) expect(line58).toContain(n);

    const today = sample();
    write(
      today,
      "design/component-registry.json",
      readFileSync(join(ROOT, "design/component-registry.json")),
    );
    const lineToday = undeclared(run(today).stdout).find((l) => l.includes("region-header.tsx"));
    expect(lineToday).toContain("RegionHeader");
  });

  function withAB(shape: "today" | "pr58"): string {
    const root = sample();
    const real =
      shape === "today"
        ? JSON.parse(readFileSync(join(ROOT, "design/component-registry.json"), "utf8"))
        : JSON.parse(readFileSync(PR58, "utf8"));
    const add =
      shape === "today"
        ? [
            {
              name: "KhoiA",
              file: AB,
              level: "atom",
              parts: [{ name: "KhoiA" }, { name: "KhoiB" }],
            },
          ]
        : [
            { name: "KhoiA", category: "component", file: AB, level: "atom", source: "own" },
            { name: "KhoiB", category: "component", file: AB, level: "atom", source: "own" },
          ];
    real.components.push(...add);
    write(root, "design/component-registry.json", JSON.stringify(real));
    return root;
  }

  it("ma trận 2 hình × 2 ca: nêu KhoiB thì im, không nêu thì một dòng có cả KhoiA và KhoiB", () => {
    const cells: ["today" | "pr58", boolean][] = [
      ["today", true],
      ["today", false],
      ["pr58", true],
      ["pr58", false],
    ];
    expect(cells).toHaveLength(4);
    for (const [shape, named] of cells) {
      const root = withAB(shape);
      if (named) round(root, "vong", "implemented", ["KhoiB"]);
      const lines = undeclared(run(root).stdout).filter((l) => l.includes(AB));
      if (named) {
        expect(lines, `${shape} nêu`).toEqual([]);
      } else {
        expect(lines, `${shape} không nêu`).toHaveLength(1);
        expect(lines[0]).toContain("KhoiA");
        expect(lines[0]).toContain("KhoiB");
      }
    }
  });
});

// ---------------------------------------------------------------- AC-4

describe("không cần git", () => {
  it("PATH chỉ có python3 cho cùng mã thoát và cùng đầu ra", () => {
    const py = spawnSync("python3", ["-c", "import sys; print(sys.executable)"], {
      encoding: "utf8",
    }).stdout.trim();
    const bin = mkdtempSync(join(tmpdir(), "proof-gate-1q-bin-"));
    symlinkSync(py, join(bin, "python3"));
    const red = sample();
    const quiet = copy(red);
    ledgerLine(quiet, { tep: NEW_FILE });
    for (const root of [red, quiet]) {
      const normal = run(root);
      const bare = run(root, [], { ...process.env, PATH: bin });
      expect(bare.status).toBe(normal.status);
      expect(bare.stdout).toBe(normal.stdout);
    }
    expect(undeclared(run(red, [], { ...process.env, PATH: bin }).stdout)).toHaveLength(1);
    rmSync(bin, { recursive: true, force: true });
  });

  it("check.py và model.py không gọi tiến trình con", () => {
    for (const f of ["check.py", "model.py"]) {
      expect(readFileSync(join(HERE, f), "utf8"), f).not.toContain("subprocess");
    }
  });
});

// ---------------------------------------------------------------- AC-5

describe("kho thật và danh sách có trước", () => {
  it("lưới xanh trên kho thật", () => {
    const r = run(ROOT);
    expect(r.stdout + r.stderr).not.toContain(CODE);
    expect(r.status).toBe(0);
  });

  it("danh sách có trước bằng đúng tập ghim; mỗi tệp còn trong sổ, ngoài nhà cung cấp, không có dòng sổ khối, có lý do", () => {
    const text = readFileSync(join(HERE, "thanh-phan-co-truoc.yaml"), "utf8");
    const rows = text.split("\n  - ").slice(1);
    const teps = rows.map((r) => /tep: (\S+)/.exec(r)?.[1] ?? "");
    expect([...teps].sort()).toEqual([...BEFORE_1Q].sort());
    for (const r of rows) expect(/ly_do: \S/.test(r), r).toBe(true);
    const reg = JSON.parse(readFileSync(join(ROOT, "design/component-registry.json"), "utf8"));
    const files = new Set(reg.components.map((c: Comp) => c.file));
    const ledgerText = readFileSync(join(ROOT, "design/so-khoi.yaml"), "utf8");
    for (const t of teps) {
      expect(files.has(t), t).toBe(true);
      expect(t.startsWith("src/components/ui/") || t.startsWith("src/components/reui/"), t).toBe(
        false,
      );
      expect(ledgerText, t).not.toContain(`tep: ${t}\n`);
    }
  });

  it("danh sách có trước sai khuôn → doc-loi nêu tên tệp danh sách", () => {
    for (const bad of [[{ ly_do: "thiếu tep" }], [{ tep: NEW_FILE }]]) {
      const root = sample();
      beforeList(root, bad);
      const r = run(root);
      expect(r.status).toBe(1);
      const lines = r.stdout.split("\n").filter((l) => l.includes(" · doc-loi: "));
      expect(
        lines.some((l) => l.includes("thanh-phan-co-truoc.yaml")),
        JSON.stringify(bad),
      ).toBe(true);
    }
  });
});

// ---------------------------------------------------------------- AC-6

describe("số cho kit và khuôn", () => {
  function report(root: string): Record<string, unknown> {
    return JSON.parse(run(root, ["--report", "--json"]).stdout);
  }
  const ab = (file: string): Comp[] => [
    { name: "KhoiA", file },
    { name: "KhoiB", file },
  ];

  it("khoá khoi_khong_ke đếm TỆP: một tệp hai thành phần = 1, hai tệp = 2, đã kê = 0", () => {
    const one = sample({
      comps: [{ name: "Button", file: "src/components/ui/button.tsx" }, ...ab(NEW_FILE)],
    });
    expect(report(one).khoi_khong_ke).toBe(1);
    const two = sample({ comps: [...BASE, ...ab("src/components/candidate/khac.tsx")] });
    expect(report(two).khoi_khong_ke).toBe(2);
    const none = sample();
    ledgerLine(none, { tep: NEW_FILE });
    expect(report(none).khoi_khong_ke).toBe(0);
  });

  it("khuôn chứng minh dặn kê mọi tệp mới ngoài thư mục nhà cung cấp", () => {
    expect(readFileSync(join(HERE, "khuon-chung-minh.md"), "utf8")).toContain(
      "ngoài thư mục nhà cung cấp",
    );
  });
});
