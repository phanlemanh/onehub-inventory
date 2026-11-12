// Tests for decision 0023 in tools/proof_gate/check.py (row 1n, _acceptance/thang-chon-khoi-vao-cong).
// The tests of row 1c stay in proof-gate.test.ts, byte for byte; this file pins that and adds one block per rule.
// Every rule: a healthy proof is green, and breaking one thing on a copy turns it red with a pinned code.
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { crc32, deflateSync } from "node:zlib";

import { describe, expect, it } from "vitest";

const ROOT = fileURLToPath(new URL("../..", import.meta.url));
const SCRIPT = join(ROOT, "tools/proof_gate/check.py");
const OLD_TESTS = join(ROOT, "tools/proof_gate/proof-gate.test.ts");
const OLD_TESTS_BLOB = "0f59c79f8582471005018f1f7323ee2baf0037b4"; // git hash-object at row 1c
const TRANSITION_ALLOWED = ["app-shell-chon-tu-reui", "moi-nguoi-gan-vai", "va-dang-nhap"];

const ASPECTS = ["Khung và bố cục", "Bảng"];
const WIDTHS = [360, 1440];
const STATES = ["Chờ tải", "Trống", "Lỗi"];
const APPROVED_AT = "2026-11-12";
const SLUG = "vong";

function run(root: string, ...args: string[]) {
  return spawnSync("python3", [SCRIPT, "--root", root, ...args], { encoding: "utf8" });
}

function codes(out: string): string[] {
  return [...out.matchAll(/ · ([a-z-]+): /g)].map((m) => m[1] ?? "");
}

/** A real PNG whose IHDR says `width`; `seed` changes the pixel so two images differ in bytes. */
function png(width: number, seed = 0): Buffer {
  const chunk = (type: string, data: Buffer) => {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(body));
    return Buffer.concat([len, body, crc]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(1, 4);
  ihdr[8] = 8;
  const row = Buffer.alloc(width + 1);
  row[1] = seed & 0xff;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(row)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

function write(root: string, rel: string, content: string | Buffer) {
  mkdirSync(dirname(join(root, rel)), { recursive: true });
  writeFileSync(join(root, rel), content);
}

type Entry = Record<string, string>;

function ledgerYaml(entries: Entry[]): string {
  if (!entries.length) return "version: 1\nkhoi: []\n";
  return [
    "version: 1",
    "khoi:",
    ...entries.flatMap((e) =>
      Object.entries(e).map(([k, v], i) => `${i === 0 ? "  - " : "    "}${k}: ${v}`),
    ),
    "",
  ].join("\n");
}

function ledger(root: string, entries: Entry[]) {
  write(root, "design/so-khoi.yaml", ledgerYaml(entries));
}

/** The ledger line that takes the grid template in for `slug`. */
function gridLine(slug = SLUG, over: Entry = {}): Entry {
  return {
    ten: "LuoiRegion",
    tep: "src/components/candidate/luoi-region.tsx",
    nguon: "data-grid-editing-6",
    nhu_cau: "bang-nhieu-dong",
    mo_ta: "Danh sách nhiều dòng xem, lọc, sửa như bảng tính",
    ho_so: slug,
    duyet: APPROVED_AT,
    ...over,
  };
}

function shellLine(slug = SLUG, over: Entry = {}): Entry {
  return {
    ten: "app-shell",
    tep: "src/components/templates/app-shell.tsx",
    nguon: "app-shell-8",
    nhu_cau: "khung-moi-man",
    mo_ta: "Khung bọc mọi màn của nhân viên",
    ho_so: slug,
    duyet: APPROVED_AT,
    ...over,
  };
}

/**
 * A sample repo with decision 0023 on (a block ledger exists, empty unless `entries`). Lưới family file says
 * `Màn: <reference>`; screens: inventory, contacts, sent (grid), today (no family), board (family without file).
 */
function sampleRepo(opts: { reference?: string; ledger?: boolean } = {}): string {
  const reference = opts.reference ?? "chưa có";
  const root = mkdtempSync(join(tmpdir(), "proof-gate-0023-"));
  write(
    root,
    "design/screens.yaml",
    [
      "families:",
      "  grid: Lưới",
      "  board: Bảng thẻ",
      "screens:",
      ...[
        ["inventory", "grid"],
        ["contacts", "grid"],
        ["sent", "grid"],
        ["today", "null"],
        ["board", "board"],
      ].map(([id, fam]) => `  - id: ${id}\n    family: ${fam}\n    audience: staff`),
      "",
    ].join("\n"),
  );
  write(
    root,
    "design/patterns/luoi.md",
    [
      "## Triết lý",
      "",
      "Lưới thay Sheet.",
      "",
      "## Màn mẫu",
      "",
      `Màn: ${reference}`,
      "",
      "## Khổ so",
      "",
      WIDTHS.join(", "),
      "",
      "## Mặt so",
      "",
      ...ASPECTS.map((a) => `- ${a}`),
      "",
    ].join("\n"),
  );
  write(
    root,
    "design/states.md",
    ["| Trạng thái | Yêu cầu |", "| --- | --- |", ...STATES.map((s) => `| ${s} | x |`), ""].join(
      "\n",
    ),
  );
  write(
    root,
    "design/component-registry.json",
    JSON.stringify({
      components: [
        { name: "Button", file: "src/components/ui/button.tsx" },
        { name: "Badge", file: "src/components/reui/badge.tsx" },
        { name: "DataRegion", file: "src/components/candidate/data-region.tsx" },
        { name: "LuoiRegion", file: "src/components/candidate/luoi-region.tsx" },
        { name: "AppShell", file: "src/components/templates/app-shell.tsx" },
      ],
    }),
  );
  write(
    root,
    "design/reui-catalog.json",
    JSON.stringify({
      groups: [
        {
          items: [
            "data-grid",
            "data-grid-1",
            "data-grid-2",
            "data-grid-editing-6",
            "app-shell-1",
            "app-shell-8",
            "kanban",
          ].map((name) => ({ name })),
        },
      ],
    }),
  );
  write(root, "design/decisions.yaml", "version: 1\ndecisions:\n  - id: grid-density\n");
  write(root, "wiki/decisions/0019-measurable-design-system-pilot.md", "# 0019\n");
  write(root, "tests/region.test.ts", "// region\n");
  write(root, "docs/tri-thuc/wiki/chu-de/bang-hang.md", "# Bảng hàng\n");
  write(root, "src/components/candidate/luoi-region.tsx", "export {};\n");
  write(root, "src/components/templates/app-shell.tsx", "export {};\n");
  write(
    root,
    "tools/proof_gate/khuon-boc.yaml",
    "khuon:\n  - id: app-shell\n    ly_do: khung bọc mọi màn\n",
  );
  if (opts.ledger !== false) ledger(root, []);
  return root;
}

function contract(
  root: string,
  slug: string,
  status: string,
  screens: string[],
  extra: Record<string, string> = {},
) {
  const approved = status === "draft" ? {} : { approved_at: APPROVED_AT };
  const fm = Object.entries({ ...approved, ...extra })
    .map(([k, v]) => `${k}: ${v}\n`)
    .join("");
  write(
    root,
    `_acceptance/${slug}/contract.md`,
    `---\nslug: ${slug}\nstatus: ${status}\nscreens: [${screens.join(", ")}]\n${fm}---\n\n# ${slug}\n`,
  );
}

function proof(root: string, slug: string, text: string) {
  write(root, `_acceptance/${slug}/chung-minh-man.md`, text);
}

function transition(root: string, slugs: string[]) {
  write(
    root,
    "tools/proof_gate/chuyen-tiep.yaml",
    ["ho_so:", ...slugs.map((s) => `  - slug: ${s}\n    ly_do: đã qua Cổng Phạm vi`), ""].join(
      "\n",
    ),
  );
}

const MATRIX = [
  "### Ma trận trạng thái",
  "",
  "| Trạng thái | Kết quả | Căn cứ |",
  "| --- | --- | --- |",
  ...STATES.map((s) => `| ${s} | đạt | tests/region.test.ts |`),
  "",
];

/** A proof healthy under the rules of row 1c only: the state matrix and one block «trong kho» of the registry. */
function oldProof(screen: string): string {
  return [
    `## Màn ${screen}`,
    "",
    ...MATRIX,
    "### Khối",
    "",
    "| Khối | Bậc | Đã tra | Ứng viên gần nhất | Vì sao không dùng |",
    "| --- | --- | --- | --- | --- |",
    "| DataRegion | trong-kho | | | |",
    "",
  ].join("\n");
}

type Omit0023 = "fromQh" | "family" | "screenGroup" | "blockGroup" | "regions" | "how" | "none";

const FROM_QH_OK = "docs/tri-thuc/wiki/chu-de/bang-hang.md";

function fromQhTable(
  page = FROM_QH_OK,
  cells = ["data-grid-editing-6", "bảng, lọc", "biểu đồ", "MVP chỉ đọc"],
) {
  return [
    "### Từ Quỹ hàng",
    "",
    "| Trang | Khối Quỹ hàng đã chọn | Giữ | Bỏ | Vì sao |",
    "| --- | --- | --- | --- | --- |",
    `| ${page} | ${cells.join(" | ")} |`,
    "",
  ];
}

function familyTable(family = "grid", path = "màn mẫu mới", why = "") {
  return [
    "### Họ",
    "",
    "| Họ đề xuất | Lối | Vì sao |",
    "| --- | --- | --- |",
    `| ${family} | ${path} | ${why} |`,
    "",
  ];
}

/**
 * A healthy decision-0023 proof of `screen` on the «màn mẫu mới» path (inventory, family file says «chưa có»):
 * one supplier component and one ReUI block taken in, with candidates, regions and «Cách». Images are written.
 */
function proof0023(
  root: string,
  slug: string,
  screen = "inventory",
  omit: Omit0023 = "none",
  override: Partial<Record<string, string[]>> = {},
): string {
  const ev = `_acceptance/${slug}/evidence`;
  write(root, `${ev}/man-1.png`, png(1440, 1));
  write(root, `${ev}/man-2.png`, png(1440, 2));
  write(root, `${ev}/khoi-1.png`, png(1440, 3));
  write(root, `${ev}/khoi-2.png`, png(1440, 4));
  const groups = {
    screen: override.screen ?? [
      "| màn | data-grid-1 | evidence/man-1.png | x |",
      "| màn | data-grid-2 | evidence/man-2.png | |",
    ],
    block: override.block ?? [
      "| data-grid-editing-6 | data-grid-editing-6 | evidence/khoi-1.png | x |",
      "| data-grid-editing-6 | data-grid-1 | evidence/khoi-2.png | |",
    ],
  };
  const candidateRows = [
    ...(omit === "screenGroup" ? [] : groups.screen),
    ...(omit === "blockGroup" ? [] : groups.block),
  ];
  const regions = override.regions ?? [
    "| data-grid-editing-6 | bảng | lấy | Đầu chủ đọc hàng như Sheet |",
    "| data-grid-editing-6 | thanh công cụ | lấy | lọc và tìm |",
    "| data-grid-editing-6 | biểu đồ | bỏ | không phục vụ việc xem hàng |",
    "| data-grid-editing-6 | cột số dòng | thêm | thói quen Sheet |",
  ];
  const how = override.how?.[0] ?? (omit === "how" ? "" : "chọn khối");
  return [
    `## Màn ${screen}`,
    "",
    ...(omit === "fromQh" ? [] : (override.fromQh ?? fromQhTable())),
    ...(omit === "family" ? [] : (override.family ?? familyTable())),
    "### Ứng viên ReUI",
    "",
    "| Cho | Ứng viên | Ảnh | Chọn |",
    "| --- | --- | --- | --- |",
    ...candidateRows,
    "",
    ...MATRIX,
    "### Khối",
    "",
    "| Khối | Bậc | Đã tra | Ứng viên gần nhất | Vì sao không dùng | Cách |",
    "| --- | --- | --- | --- | --- | --- |",
    ...(override.blocks ?? [
      "| Button | trong-kho | | | | |",
      `| data-grid-editing-6 | reui | lưới sửa ô | DataRegion | DataRegion chưa nhập kho | ${how} |`,
    ]),
    "",
    ...(omit === "regions"
      ? []
      : [
          "### Vùng",
          "",
          "| Khối | Vùng | Xử lý | Lý do |",
          "| --- | --- | --- | --- |",
          ...regions,
          "",
        ]),
  ].join("\n");
}

/** A healthy repo + one decision-0023 round on inventory at `status`, with its ledger line. */
function healthy(
  status = "implemented",
  omit: Omit0023 = "none",
  override: Partial<Record<string, string[]>> = {},
) {
  const root = sampleRepo();
  contract(root, SLUG, status, ["inventory"]);
  proof(root, SLUG, proof0023(root, SLUG, "inventory", omit, override));
  ledger(root, [gridLine()]);
  return root;
}

function codesOf(root: string): string[] {
  return codes(run(root).stdout);
}

// ---------------------------------------------------------------- AC-1

describe("hai lớp luật: chuyển tiếp × trạng thái", () => {
  const statuses = ["draft", "approved", "implemented", "verified", "signed-off"];
  const kinds = ["cu", "moi"]; // cu: named in chuyen-tiep.yaml · moi: decision 0023
  function build(withLedger: boolean) {
    const root = sampleRepo({ ledger: withLedger });
    const cells: string[] = [];
    for (const k of kinds) {
      for (const s of statuses) {
        const slug = `${k}-${s}`;
        contract(root, slug, s, ["inventory"]);
        proof(root, slug, oldProof("inventory"));
        cells.push(slug);
      }
    }
    transition(
      root,
      statuses.map((s) => `cu-${s}`),
    );
    return { root, cells };
  }

  it("đỏ đúng ba ô của ma trận 2 × 5 viết trước, mỗi ô mang mã của luật 0023", () => {
    const { root, cells } = build(true);
    expect(cells).toHaveLength(10);
    const r = run(root);
    expect(r.status).toBe(1);
    const red = cells.filter((slug) => r.stdout.includes(`${slug} · `));
    expect(red.sort()).toEqual(["moi-approved", "moi-implemented", "moi-verified"]);
    for (const slug of red) {
      expect(r.stdout).toContain(`${slug} · inventory · thieu-tu-quy-hang:`);
    }
    // Positive control: naming the three rounds in the transition list turns the gate green.
    transition(root, cells);
    const g = run(root);
    expect(g.stdout + g.stderr).toContain("đã chứng minh");
    expect(g.status).toBe(0);
  });

  it("kho không có sổ khối thì cả mười ô theo luật 1c", () => {
    const { root } = build(false);
    expect(existsSync(join(root, "design/so-khoi.yaml"))).toBe(false);
    expect(run(root).status).toBe(0);
  });

  it("--report --json đếm dòng sổ khối và hồ sơ chuyển tiếp còn mở", () => {
    const { root } = build(true);
    ledger(root, [gridLine("moi-implemented")]);
    const data = JSON.parse(run(root, "--report", "--json").stdout);
    expect(data.nhap_kho).toBe(1);
    expect(data.chuyen_tiep).toBe(4);
  });
});

describe("tệp bài của hàng 1c không đổi", () => {
  // The one line row 2 may change (G-1111-29): the real Lưới family names its reference screen once row 2 signs.
  const REFERENCE_NOW = 'expect(section("Màn mẫu")).toContain("Màn: chưa có");';
  const REFERENCE_ROW2 = 'expect(section("Màn mẫu")).toContain("Màn: inventory");';
  function blob(text: string): string {
    const body = Buffer.from(text, "utf8");
    return createHash("sha1")
      .update(Buffer.concat([Buffer.from(`blob ${body.length}\0`), body]))
      .digest("hex");
  }
  it("băm git của proof-gate.test.ts bằng bản đã ký (dòng màn mẫu của hàng 2 quy về bản cũ trước khi băm)", () => {
    const text = readFileSync(OLD_TESTS, "utf8").replace(REFERENCE_ROW2, REFERENCE_NOW);
    expect(blob(text)).toBe(OLD_TESTS_BLOB);
    // Controls: the row-2 line is allowed, any other edit is not.
    const signed = readFileSync(OLD_TESTS, "utf8").replace(REFERENCE_ROW2, REFERENCE_NOW);
    expect(
      blob(signed.replace(REFERENCE_NOW, REFERENCE_ROW2).replace(REFERENCE_ROW2, REFERENCE_NOW)),
    ).toBe(OLD_TESTS_BLOB);
    expect(blob(signed.replace("toHaveLength(12)", "toHaveLength(11)"))).not.toBe(OLD_TESTS_BLOB);
  });
});

describe("nấc trạng thái × mục", () => {
  // Written ahead: for each status, which item a decision-0023 round owes, and the code when it is missing.
  type Cell = { status: string; item: string; code: string | null };
  const items: [string, (status: string) => string][] = [
    ["fromQh", (s) => healthy(s, "fromQh")],
    ["family", (s) => healthy(s, "family")],
    ["screenGroup", (s) => healthy(s, "screenGroup")],
    ["blockGroup", (s) => healthy(s, "blockGroup")],
    ["regions", (s) => healthy(s, "regions")],
    ["how", (s) => healthy(s, "how")],
    [
      "ledgerLine",
      (s) => {
        const root = healthy(s);
        ledger(root, []);
        return root;
      },
    ],
    [
      "shellFromQh",
      (s) => {
        const root = sampleRepo();
        shellRound(root, SLUG, s, "fromQh");
        return root;
      },
    ],
  ];
  const owed: Record<string, Record<string, string | null>> = {
    approved: {
      fromQh: "thieu-tu-quy-hang",
      family: "thieu-ho",
      screenGroup: "thieu-ung-vien",
      blockGroup: null,
      regions: null,
      how: null,
      ledgerLine: null,
      shellFromQh: "thieu-tu-quy-hang",
    },
    implemented: {
      fromQh: "thieu-tu-quy-hang",
      family: "thieu-ho",
      screenGroup: "thieu-ung-vien",
      blockGroup: "thieu-ung-vien",
      regions: "thieu-vung",
      how: "thieu-cach",
      ledgerLine: "nhap-kho-thieu-so",
      shellFromQh: "thieu-tu-quy-hang",
    },
  };
  const cells: Cell[] = Object.entries(owed).flatMap(([status, row]) =>
    Object.entries(row).map(([item, code]) => ({ status, item, code })),
  );

  it("ma trận 2 × 8 viết trước: mỗi ô đỏ đúng mã hay im", () => {
    expect(cells).toHaveLength(16);
    for (const status of ["approved", "implemented"]) {
      const healthyRoot = healthy(status);
      expect(run(healthyRoot).status, `lành ở ${status}`).toBe(0);
      const shellRoot = sampleRepo();
      shellRound(shellRoot, SLUG, status);
      expect(run(shellRoot).status, `khuôn lành ở ${status}`).toBe(0);
    }
    for (const cell of cells) {
      const build = items.find(([n]) => n === cell.item)?.[1];
      expect(build, cell.item).toBeDefined();
      const out = codesOf(build!(cell.status));
      if (cell.code === null) expect(out, `${cell.status} × ${cell.item}`).toEqual([]);
      else expect(out, `${cell.status} × ${cell.item}`).toContain(cell.code);
    }
  });
});

describe("chuyển tiếp của kho thật", () => {
  it("danh sách là tập con của ba hồ sơ đã qua Cổng Phạm vi, mỗi tên có lý do", () => {
    const text = readFileSync(join(ROOT, "tools/proof_gate/chuyen-tiep.yaml"), "utf8");
    const slugs = [...text.matchAll(/^\s*- slug:\s*(\S+)/gm)].map((m) => m[1] ?? "");
    const reasons = [...text.matchAll(/^\s*ly_do:\s*(.*)$/gm)].map((m) => (m[1] ?? "").trim());
    expect(slugs.length).toBeGreaterThan(0);
    for (const s of slugs) expect(TRANSITION_ALLOWED).toContain(s);
    expect(reasons).toHaveLength(slugs.length);
    for (const r of reasons) expect(r).not.toBe("");
  });
});

// ---------------------------------------------------------------- AC-2

describe("bậc trong kho tra sổ khối", () => {
  function withBlock(row: string, opts: { other?: boolean; transitionRound?: boolean } = {}) {
    const root = healthy("implemented", "none", {
      blocks: [
        row,
        "| data-grid-editing-6 | reui | lưới sửa ô | DataRegion | DataRegion chưa nhập kho | chọn khối |",
      ],
    });
    if (opts.other) {
      // LuoiRegion taken in by another, signed round that carries the voucher row.
      contract(root, "da-ky", "signed-off", ["sent"]);
      proof(
        root,
        "da-ky",
        oldProof("sent").replace(
          "| DataRegion | trong-kho | | | |",
          "| data-grid-editing-6 | reui | lưới | DataRegion | cần sửa ô |",
        ),
      );
      ledger(root, [
        gridLine("da-ky", { ten: "LuoiRegion" }),
        gridLine(SLUG, { ten: "LuoiSua", nhu_cau: "sua-o" }),
      ]);
    }
    if (opts.transitionRound) transition(root, [SLUG]);
    return root;
  }
  it("khối chính vòng này nhập mà ghi trong-kho → trong-kho-tu-vong", () => {
    const out = run(withBlock("| LuoiRegion | trong-kho | | | | |"));
    expect(out.status).toBe(1);
    expect(codes(out.stdout)).toEqual(["trong-kho-tu-vong"]);
    expect(out.stdout).toContain("LuoiRegion");
  });
  it("khối chỉ có trong sổ thành phần (candidate) → trong-kho-chua-nhap", () => {
    expect(codesOf(withBlock("| DataRegion | trong-kho | | | | |"))).toEqual([
      "trong-kho-chua-nhap",
    ]);
  });
  it("tên không có ở đâu → khoi-khong-co", () => {
    expect(codesOf(withBlock("| KhongCo | trong-kho | | | | |"))).toEqual(["khoi-khong-co"]);
  });
  it("đối chứng: thành phần nhà cung cấp (ui, reui) và khối do hồ sơ khác nhập thì im", () => {
    expect(run(withBlock("| Badge | trong-kho | | | | |")).status).toBe(0);
    expect(run(withBlock("| LuoiRegion | trong-kho | | | | |", { other: true })).status).toBe(0);
  });
  it("hồ sơ chuyển tiếp ghi trong-kho cho khối chỉ có trong sổ thành phần thì im như luật 1c", () => {
    expect(
      run(withBlock("| DataRegion | trong-kho | | | | |", { transitionRound: true })).status,
    ).toBe(0);
  });
});

// ---------------------------------------------------------------- AC-3

describe("ứng viên ReUI kèm ảnh", () => {
  it("tệp lành thì xanh ở approved và implemented", () => {
    expect(run(healthy("approved")).status).toBe(0);
    expect(run(healthy("implemented")).status).toBe(0);
  });
  const screen = (rows: string[]) => ({ screen: rows });
  const block = (rows: string[]) => ({ block: rows });
  const breaks: [string, string, (root: string) => Partial<Record<string, string[]>>, string][] = [
    [
      "nhóm màn còn một dòng",
      "approved",
      () => screen(["| màn | data-grid-1 | evidence/man-1.png | x |"]),
      "ung-vien-it",
    ],
    [
      "nhóm màn bốn dòng",
      "approved",
      (root) => {
        write(root, `_acceptance/${SLUG}/evidence/man-3.png`, png(1440, 7));
        write(root, `_acceptance/${SLUG}/evidence/man-4.png`, png(1440, 8));
        return screen([
          "| màn | data-grid-1 | evidence/man-1.png | x |",
          "| màn | data-grid-2 | evidence/man-2.png | |",
          "| màn | data-grid | evidence/man-3.png | |",
          "| màn | kanban | evidence/man-4.png | |",
        ]);
      },
      "ung-vien-nhieu",
    ],
    [
      "ứng viên không có trong danh mục",
      "approved",
      () =>
        screen([
          "| màn | data-grid-1 | evidence/man-1.png | x |",
          "| màn | khong-co-block | evidence/man-2.png | |",
        ]),
      "ung-vien-khong-co",
    ],
    [
      "ảnh không có",
      "approved",
      () =>
        screen([
          "| màn | data-grid-1 | evidence/man-1.png | x |",
          "| màn | data-grid-2 | evidence/khong-co.png | |",
        ]),
      "anh-khong-co",
    ],
    [
      "ảnh là tệp chữ",
      "approved",
      (root) => {
        write(root, `_acceptance/${SLUG}/evidence/chu.png`, "không phải ảnh");
        return screen([
          "| màn | data-grid-1 | evidence/man-1.png | x |",
          "| màn | data-grid-2 | evidence/chu.png | |",
        ]);
      },
      "anh-khong-phai-png",
    ],
    [
      "hai ứng viên một ảnh",
      "approved",
      () =>
        screen([
          "| màn | data-grid-1 | evidence/man-1.png | x |",
          "| màn | data-grid-2 | evidence/man-1.png | |",
        ]),
      "ung-vien-trung-anh",
    ],
    [
      "hai dấu chọn",
      "approved",
      () =>
        screen([
          "| màn | data-grid-1 | evidence/man-1.png | x |",
          "| màn | data-grid-2 | evidence/man-2.png | x |",
        ]),
      "chon-qua-mot",
    ],
    [
      "khối reui không phải ứng viên được chọn",
      "implemented",
      () =>
        block([
          "| data-grid-editing-6 | data-grid-editing-6 | evidence/khoi-1.png | |",
          "| data-grid-editing-6 | data-grid-1 | evidence/khoi-2.png | x |",
        ]),
      "reui-khong-duoc-chon",
    ],
  ];
  for (const [name, status, mutate, code] of breaks) {
    it(`${name} (${status}) → ${code}`, () => {
      const root = sampleRepo();
      contract(root, SLUG, status, ["inventory"]);
      ledger(root, [gridLine()]);
      proof(root, SLUG, proof0023(root, SLUG, "inventory", "none", {}));
      const over = mutate(root);
      proof(root, SLUG, proof0023(root, SLUG, "inventory", "none", over));
      const r = run(root);
      expect(r.status).toBe(1);
      expect(codes(r.stdout)).toContain(code);
    });
  }
  it("bỏ nhóm màn của màn mẫu mới ở approved → thieu-ung-vien", () => {
    expect(codesOf(healthy("approved", "screenGroup"))).toEqual(["thieu-ung-vien"]);
  });
  it("khối ve-tay mà nhóm có ứng viên được chọn → ve-tay-ma-chon; không chọn thì im", () => {
    const blocks = [
      "| Button | trong-kho | | | | |",
      "| BangTay | ve-tay | lưới sửa ô | data-grid-editing-6 | thiếu ô nhập tiền | |",
    ];
    const group = (mark: string) => [
      `| BangTay | data-grid-editing-6 | evidence/khoi-1.png | ${mark} |`,
      "| BangTay | data-grid-1 | evidence/khoi-2.png | |",
    ];
    const build = (mark: string) => {
      const root = healthy("implemented", "none", { blocks, block: group(mark), regions: [] });
      ledger(root, [
        gridLine(SLUG, {
          ten: "BangTay",
          nguon: "tao-tay",
          tep: "src/components/candidate/luoi-region.tsx",
        }),
      ]);
      proof(
        root,
        SLUG,
        proof0023(root, SLUG, "inventory", "none", { blocks, block: group(mark), regions: [] }),
      );
      return root;
    };
    expect(codesOf(build("x"))).toEqual(["ve-tay-ma-chon"]);
    expect(run(build("")).status).toBe(0);
  });
  it("đối chứng: màn theo mẫu không có nhóm màn thì im; approved có khối reui mà chưa có nhóm khối thì im", () => {
    const root = sampleRepo({ reference: "inventory" });
    contract(root, "mau", "signed-off", ["inventory"]);
    proof(root, "mau", oldProof("inventory"));
    contract(root, SLUG, "approved", ["contacts"]);
    proof(
      root,
      SLUG,
      proof0023(root, SLUG, "contacts", "screenGroup", { family: familyTable("grid", "theo mẫu") }),
    );
    ledger(root, [gridLine()]);
    expect(run(root).status).toBe(0);
    expect(run(healthy("approved", "blockGroup")).status).toBe(0);
  });
});

// ---------------------------------------------------------------- AC-4

describe("vùng lấy bỏ thêm", () => {
  const regions = (rows: [string, string, string][]) =>
    rows.map(([v, a, why]) => `| data-grid-editing-6 | ${v} | ${a} | ${why} |`);
  it("không dòng vùng → thieu-vung", () => {
    expect(codesOf(healthy("implemented", "none", { regions: [] }))).toEqual(["thieu-vung"]);
  });
  it("xử lý lạ → vung-xu-ly-la; lý do rỗng → vung-thieu-ly-do", () => {
    expect(
      codesOf(healthy("implemented", "none", { regions: regions([["bảng", "giữ", "đọc"]]) })),
    ).toEqual(["vung-xu-ly-la"]);
    expect(
      codesOf(healthy("implemented", "none", { regions: regions([["bảng", "lấy", ""]]) })),
    ).toEqual(["vung-thieu-ly-do"]);
  });
  it("Cách rỗng → thieu-cach; Cách lạ → cach-la", () => {
    expect(codesOf(healthy("implemented", "how"))).toEqual(["thieu-cach"]);
    expect(codesOf(healthy("implemented", "none", { how: ["chép"] }))).toEqual(["cach-la"]);
  });
  it("ma trận viết trước số bỏ × cách", () => {
    const cases: [number, number, number, string, string | null][] = [
      [1, 2, 0, "chọn khối", "cat-qua-nua"],
      [1, 2, 0, "ghép từ thành phần", null],
      [2, 2, 0, "chọn khối", null],
      [2, 1, 3, "chọn khối", null],
    ];
    expect(cases).toHaveLength(4);
    for (const [take, drop, add, how, code] of cases) {
      const rows: [string, string, string][] = [
        ...Array.from(
          { length: take },
          (_, i) => [`lấy ${i}`, "lấy", "cần"] as [string, string, string],
        ),
        ...Array.from(
          { length: drop },
          (_, i) => [`bỏ ${i}`, "bỏ", "không cần"] as [string, string, string],
        ),
        ...Array.from(
          { length: add },
          (_, i) => [`thêm ${i}`, "thêm", "thiếu"] as [string, string, string],
        ),
      ];
      const out = codesOf(healthy("implemented", "none", { regions: regions(rows), how: [how] }));
      expect(out, `${take}/${drop}/${add} ${how}`).toEqual(code ? [code] : []);
    }
  });
});

// ---------------------------------------------------------------- AC-5

describe("sổ khối", () => {
  it("sổ lành một dòng thì xanh", () => {
    expect(run(healthy()).status).toBe(0);
  });
  const breaks: [string, (root: string) => void, string][] = [
    [
      "hai dòng cùng nhu cầu",
      (r) => ledger(r, [gridLine(), gridLine(SLUG, { ten: "LuoiHai" })]),
      "so-trung-nhu-cau",
    ],
    [
      "hai dòng cùng tên",
      (r) => ledger(r, [gridLine(), gridLine(SLUG, { nhu_cau: "khac" })]),
      "so-trung-ten",
    ],
    [
      "thiếu mo_ta",
      (r) => {
        const e = gridLine();
        delete e.mo_ta;
        ledger(r, [e]);
      },
      "so-thieu-truong",
    ],
    ["nguồn lạ", (r) => ledger(r, [gridLine(SLUG, { nguon: "khong-co-block" })]), "so-nguon-la"],
    [
      "tệp không có",
      (r) => ledger(r, [gridLine(SLUG, { tep: "src/khong-co.tsx" })]),
      "so-tep-khong-co",
    ],
    ["ngày sai khuôn", (r) => ledger(r, [gridLine(SLUG, { duyet: "11/11" })]), "so-ngay-la"],
    [
      "ngày khác ngày duyệt",
      (r) => ledger(r, [gridLine(SLUG, { duyet: "2026-11-01" })]),
      "so-ngay-lech",
    ],
    [
      "hồ sơ không có",
      (r) => ledger(r, [gridLine(SLUG), gridLine("khong-co", { ten: "X", nhu_cau: "x" })]),
      "so-ho-so-khong-co",
    ],
    [
      "không chứng từ",
      (r) => ledger(r, [gridLine(), gridLine(SLUG, { ten: "Y", nhu_cau: "y", nguon: "kanban" })]),
      "so-khong-chung-tu",
    ],
    ["xoá dòng của khối reui", (r) => ledger(r, []), "nhap-kho-thieu-so"],
  ];
  for (const [name, mutate, code] of breaks) {
    it(`${name} → ${code}`, () => {
      const root = healthy();
      mutate(root);
      const r = run(root);
      expect(r.status).toBe(1);
      expect(codes(r.stdout)).toContain(code);
    });
  }
  it("trùng nhu cầu gọi tên cả hai dòng", () => {
    const root = healthy();
    ledger(root, [gridLine(), gridLine(SLUG, { ten: "LuoiHai" })]);
    expect(run(root).stdout).toMatch(/LuoiHai.*LuoiRegion/);
  });
  it("sổ của kho thật đọc được", () => {
    const text = readFileSync(join(ROOT, "design/so-khoi.yaml"), "utf8");
    expect(text).toMatch(/^khoi:/m);
    const r = run(ROOT);
    expect(r.stdout).not.toContain("so-khoi.yaml · -");
  });
});

// ---------------------------------------------------------------- AC-6

describe("từ Quỹ hàng", () => {
  const withQh = (page: string, cells?: string[]) =>
    codesOf(healthy("approved", "none", { fromQh: fromQhTable(page, cells) }));
  it("bỏ mục → thieu-tu-quy-hang", () => {
    expect(codesOf(healthy("approved", "fromQh"))).toEqual(["thieu-tu-quy-hang"]);
  });
  it("mỗi cột rỗng → tu-quy-hang-thieu-truong (bốn ca)", () => {
    const full = ["data-grid-editing-6", "bảng", "biểu đồ", "MVP"];
    for (let i = 0; i < 4; i++) {
      const cells = full.map((c, j) => (j === i ? "" : c));
      expect(withQh(FROM_QH_OK, cells), `cột ${i}`).toEqual(["tu-quy-hang-thieu-truong"]);
    }
  });
  it("trang không có, hay «chưa có trang» không lý do → trang-boi-canh-khong-co", () => {
    expect(withQh("docs/tri-thuc/wiki/chu-de/khong-co.md")).toEqual(["trang-boi-canh-khong-co"]);
    expect(withQh("chưa có trang")).toEqual(["trang-boi-canh-khong-co"]);
    expect(withQh("docs/khac/bang-hang.md")).toEqual(["trang-boi-canh-khong-co"]);
  });
  it("đối chứng: trang có thật, và «chưa có trang — <lý do>», thì im", () => {
    expect(withQh(FROM_QH_OK)).toEqual([]);
    expect(withQh("chưa có trang — sổ bối cảnh còn ở PR khác")).toEqual([]);
  });
});

// ---------------------------------------------------------------- AC-7

describe("họ của màn", () => {
  const withFamily = (family: string, path: string, why = "") =>
    codesOf(healthy("approved", "none", { family: familyTable(family, path, why) }));
  it("bỏ mục → thieu-ho", () => {
    expect(codesOf(healthy("approved", "family"))).toEqual(["thieu-ho"]);
  });
  it("họ khác sổ màn → ho-lech-so-man; lối khác máy suy → loi-lech", () => {
    expect(withFamily("board", "màn mẫu mới")).toEqual(["ho-lech-so-man"]);
    expect(withFamily("grid", "theo mẫu")).toEqual(["loi-lech"]);
  });
  it("họ rỗng không vì sao → ho-rong-thieu-ly-do", () => {
    const root = sampleRepo();
    contract(root, SLUG, "approved", ["today"]);
    write(root, `_acceptance/${SLUG}/evidence/h1.png`, png(1440, 11));
    write(root, `_acceptance/${SLUG}/evidence/h2.png`, png(1440, 12));
    const directions = [
      "### Hướng",
      "",
      "| Hướng | Ảnh | Động cơ | Đánh đổi | Chọn |",
      "| --- | --- | --- | --- | --- |",
      "| Thẻ | evidence/h1.png | a | b | x |",
      "| Danh sách | evidence/h2.png | c | d | |",
      "",
    ].join("\n");
    proof(
      root,
      SLUG,
      proof0023(root, SLUG, "today", "none", { family: familyTable("rỗng", "họ mới", "") }) +
        "\n" +
        directions,
    );
    expect(codesOf(root)).toEqual(["ho-rong-thieu-ly-do"]);
    proof(
      root,
      SLUG,
      proof0023(root, SLUG, "today", "none", {
        family: familyTable("rỗng", "họ mới", "việc trong ngày, không phải danh sách"),
      }) +
        "\n" +
        directions,
    );
    expect(run(root).status).toBe(0);
  });
  it("ma trận ba lối viết trước, họ và lối khớp → xanh", () => {
    const lanes: [string, string, string][] = [
      ["inventory", "grid", "màn mẫu mới"],
      ["contacts", "grid", "theo mẫu"],
      ["board", "board", "họ mới"],
    ];
    expect(lanes).toHaveLength(3);
    const root = sampleRepo({ reference: "inventory" });
    contract(root, "mau", "signed-off", ["inventory"]);
    proof(root, "mau", oldProof("inventory"));
    lanes.forEach(([screen, fam, path], i) => {
      const slug = `l${i}`;
      contract(root, slug, "approved", [screen]);
      write(root, `_acceptance/${slug}/evidence/h1.png`, png(1440, 21));
      write(root, `_acceptance/${slug}/evidence/h2.png`, png(1440, 22));
      const directions = [
        "### Hướng",
        "",
        "| Hướng | Ảnh | Động cơ | Đánh đổi | Chọn |",
        "| --- | --- | --- | --- | --- |",
        "| Cột | evidence/h1.png | a | b | x |",
        "| Nhóm | evidence/h2.png | c | d | |",
        "",
      ].join("\n");
      proof(
        root,
        slug,
        proof0023(root, slug, screen, "none", { family: familyTable(fam, path) }) +
          "\n" +
          directions,
      );
    });
    ledger(root, []);
    const r = run(root);
    expect(r.stdout + r.stderr).toContain("đã chứng minh");
    expect(r.status).toBe(0);
  });
});

// ---------------------------------------------------------------- AC-8

/** A round that proves the App Shell template. `omit` drops one part of its healthy proof. */
function shellRound(
  root: string,
  slug: string,
  status: string,
  omit: "fromQh" | "group" | "none" = "none",
  extra: Record<string, string> = {},
) {
  contract(root, slug, status, ["today", "inventory", "sent"], {
    khuon_boc: "app-shell",
    ...extra,
  });
  const ev = `_acceptance/${slug}/evidence`;
  write(root, `${ev}/shell-1.png`, png(1440, 31));
  write(root, `${ev}/shell-2.png`, png(1440, 32));
  proof(
    root,
    slug,
    [
      "## Khuôn app-shell",
      "",
      ...(omit === "fromQh"
        ? []
        : fromQhTable("docs/tri-thuc/wiki/chu-de/bang-hang.md", [
            "app-shell-8",
            "hai cột",
            "chuông",
            "theo chủ kho",
          ])),
      "### Ứng viên ReUI",
      "",
      "| Cho | Ứng viên | Ảnh | Chọn |",
      "| --- | --- | --- | --- |",
      ...(omit === "group"
        ? []
        : [
            "| app-shell | app-shell-8 | evidence/shell-1.png | |",
            "| app-shell | app-shell-1 | evidence/shell-2.png | |",
          ]),
      "| app-shell-8 | app-shell-8 | evidence/shell-1.png | x |",
      "| app-shell-8 | app-shell-1 | evidence/shell-2.png | |",
      "",
      "### Khối",
      "",
      "| Khối | Bậc | Đã tra | Ứng viên gần nhất | Vì sao không dùng | Cách |",
      "| --- | --- | --- | --- | --- | --- |",
      "| app-shell-8 | reui | khung | app-shell-1 | một cột | chọn khối |",
      "",
      "### Vùng",
      "",
      "| Khối | Vùng | Xử lý | Lý do |",
      "| --- | --- | --- | --- |",
      "| app-shell-8 | hai cột | lấy | chủ kho chốt |",
      "| app-shell-8 | biểu đồ | bỏ | không dùng |",
      "",
    ].join("\n"),
  );
  ledger(root, [shellLine(slug)]);
}

describe("khuôn bọc", () => {
  it("không có mục khuôn ở implemented → thieu-chung-minh-khuon, không đòi chứng minh ba màn", () => {
    const root = sampleRepo();
    shellRound(root, SLUG, "implemented");
    proof(root, SLUG, "# trống\n");
    const r = run(root);
    expect(r.status).toBe(1);
    expect(codes(r.stdout)).toContain("thieu-chung-minh-khuon");
    expect(codes(r.stdout)).not.toContain("thieu-chung-minh");
  });
  it("hồ sơ chuyển tiếp: mục khuôn chỉ với bảng Khối thì xanh", () => {
    const root = sampleRepo();
    contract(root, SLUG, "implemented", ["today", "inventory", "sent"], { khuon_boc: "app-shell" });
    proof(
      root,
      SLUG,
      [
        "## Khuôn app-shell",
        "",
        "### Khối",
        "",
        "| Khối | Bậc | Đã tra | Ứng viên gần nhất | Vì sao không dùng |",
        "| --- | --- | --- | --- | --- |",
        "| AppShell | trong-kho | | | |",
        "",
      ].join("\n"),
    );
    transition(root, [SLUG]);
    expect(run(root).status).toBe(0);
  });
  it("hồ sơ luật 0023: mục khuôn chỉ với bảng Khối → thieu-tu-quy-hang, thieu-ung-vien; đủ thì xanh", () => {
    const root = sampleRepo();
    shellRound(root, SLUG, "implemented");
    expect(run(root).status).toBe(0);
    shellRound(root, SLUG, "implemented", "fromQh");
    expect(codesOf(root)).toContain("thieu-tu-quy-hang");
    shellRound(root, SLUG, "implemented", "group");
    expect(codesOf(root)).toEqual(["thieu-ung-vien"]);
  });
  it("ở approved đòi Từ Quỹ hàng và nhóm ứng viên của khuôn", () => {
    const root = sampleRepo();
    shellRound(root, SLUG, "approved", "fromQh");
    expect(codesOf(root)).toEqual(["thieu-tu-quy-hang"]);
    shellRound(root, SLUG, "approved", "group");
    expect(codesOf(root)).toEqual(["thieu-ung-vien"]);
  });
  it("sổ đã có khuôn do hồ sơ khác nhập thì không đòi nhóm ứng viên của khuôn", () => {
    const root = sampleRepo();
    contract(root, "da-ky", "signed-off", ["today"], { khuon_boc: "app-shell" });
    proof(
      root,
      "da-ky",
      [
        "## Khuôn app-shell",
        "",
        "### Khối",
        "",
        "| Khối | Bậc | Đã tra | Ứng viên gần nhất | Vì sao không dùng |",
        "| --- | --- | --- | --- | --- |",
        "| app-shell-8 | reui | khung | app-shell-1 | một cột |",
        "",
      ].join("\n"),
    );
    shellRound(root, SLUG, "approved", "group");
    ledger(root, [shellLine("da-ky")]);
    expect(run(root).status).toBe(0);
  });
  it("bỏ khuon_boc → thieu-chung-minh cho từng màn; id lạ → khuon-boc-la và vẫn đòi từng màn", () => {
    const root = sampleRepo();
    shellRound(root, SLUG, "implemented");
    contract(root, SLUG, "implemented", ["today", "inventory", "sent"]);
    const plain = run(root).stdout;
    for (const s of ["today", "inventory", "sent"])
      expect(plain).toContain(`${SLUG} · ${s} · thieu-chung-minh:`);
    contract(root, SLUG, "implemented", ["today", "inventory", "sent"], { khuon_boc: "man-gia" });
    const odd = run(root).stdout;
    expect(codes(odd)).toContain("khuon-boc-la");
    for (const s of ["today", "inventory", "sent"])
      expect(odd).toContain(`${SLUG} · ${s} · thieu-chung-minh:`);
  });
});

// ---------------------------------------------------------------- AC-9

describe("kho thật và khuôn tệp chứng minh", () => {
  it("kho thật có sổ khối, lưới xanh", () => {
    expect(existsSync(join(ROOT, "design/so-khoi.yaml"))).toBe(true);
    const r = run(ROOT);
    expect(r.stderr).toBe("");
    expect(r.status).toBe(0);
  });

  it("bản sao kho thật: thêm vòng luật 0023 lành theo luật 1c thì đỏ", () => {
    const copy = mkdtempSync(join(tmpdir(), "proof-gate-0023-real-"));
    for (const d of [
      "design",
      "_acceptance",
      "wiki/decisions",
      "tests",
      "tools/proof_gate",
      "docs/tri-thuc",
    ]) {
      if (existsSync(join(ROOT, d))) cpSync(join(ROOT, d), join(copy, d), { recursive: true });
    }
    rmSync(join(copy, "tools/proof_gate/fixtures"), { recursive: true, force: true });
    expect(run(copy).status).toBe(0);
    contract(copy, "vong-moi", "implemented", ["inventory"]);
    proof(copy, "vong-moi", oldProof("inventory").replace(/^/, ""));
    const r = run(copy);
    expect(r.status).toBe(1);
    expect(r.stdout).toContain("vong-moi · inventory · thieu-tu-quy-hang:");
  });

  const template = readFileSync(join(ROOT, "tools/proof_gate/khuon-chung-minh.md"), "utf8");
  function block(name: string): string {
    const m = template.match(
      new RegExp(
        `<!-- <<<${name} -->\\s*\`\`\`markdown\\n([\\s\\S]*?)\`\`\`\\s*<!-- ${name}>>> -->`,
      ),
    );
    expect(m, name).not.toBeNull();
    return m?.[1] ?? "";
  }
  /** Fill the template as an agent would: repeat the sample row once per item, fill the blanks. */
  function fill(text: string, perRow: Record<string, string[]>, values: Record<string, string>) {
    let out = text;
    for (const [marker, rows] of Object.entries(perRow)) {
      const line = out.split("\n").find((l) => l.startsWith("|") && l.includes(marker));
      expect(line, marker).toBeDefined();
      out = out.replace(line ?? "", rows.join("\n"));
    }
    for (const [k, v] of Object.entries(values)) out = out.split(k).join(v);
    return out;
  }
  const common = (slug: string, group: string): Record<string, string[]> => ({
    "<trang>": [`| ${FROM_QH_OK} | data-grid-editing-6 | bảng | biểu đồ | MVP chỉ đọc |`],
    "<cho>": [
      ...(group
        ? [
            `| ${group} | data-grid-1 | evidence/${slug}-m1.png | x |`,
            `| ${group} | data-grid-2 | evidence/${slug}-m2.png | |`,
          ]
        : []),
      `| data-grid-editing-6 | data-grid-editing-6 | evidence/${slug}-k1.png | x |`,
      `| data-grid-editing-6 | data-grid-1 | evidence/${slug}-k2.png | |`,
    ],
    "<tên khối>": [
      "| Button | trong-kho | | | | |",
      "| data-grid-editing-6 | reui | lưới sửa ô | DataRegion | chưa nhập kho | chọn khối |",
    ],
    "<vùng>": [
      "| data-grid-editing-6 | bảng | lấy | đọc như Sheet |",
      "| data-grid-editing-6 | biểu đồ | bỏ | không phục vụ |",
    ],
  });
  function images(root: string, slug: string) {
    ["m1", "m2", "k1", "k2"].forEach((k, i) =>
      write(root, `_acceptance/${slug}/evidence/${slug}-${k}.png`, png(1440, 40 + i)),
    );
  }

  it("bốn khối khuôn điền ở implemented kèm dòng sổ thì xanh; đổi tên mục thì đỏ", () => {
    const root = sampleRepo({ reference: "inventory" });
    contract(root, "mau", "signed-off", ["inventory"]);
    proof(root, "mau", oldProof("inventory"));
    const lines: Entry[] = [];
    // follows: contacts
    contract(root, "a", "implemented", ["contacts"]);
    images(root, "a");
    for (const w of WIDTHS) {
      write(root, `_acceptance/a/evidence/contacts-${w}.png`, png(w, 1));
      write(root, `_acceptance/a/evidence/inventory-${w}.png`, png(w, 2));
    }
    const follows = fill(
      block("KHUON-THEO-MAU"),
      {
        ...common("a", ""),
        "<họ>": ["| grid | theo mẫu | |"],
        "<khổ>": WIDTHS.map(
          (w) => `| ${w} | evidence/contacts-${w}.png | evidence/inventory-${w}.png | mau |`,
        ),
        "<mặt>": ASPECTS.map((a) => `| ${a} | giống | ảnh 1440: như mẫu |`),
      },
      { "<id màn>": "contacts" },
    );
    proof(root, "a", follows);
    lines.push(gridLine("a", { ten: "LuoiA", nhu_cau: "a" }));
    // new reference: sent is grid, but reference is inventory → use a fresh repo-wide trick: inventory itself.
    contract(root, "b", "implemented", ["inventory"]);
    images(root, "b");
    proof(
      root,
      "b",
      fill(
        block("KHUON-MAN-MAU-MOI"),
        {
          ...common("b", "màn"),
          "<họ>": ["| grid | màn mẫu mới | |"],
          "<trạng thái>": STATES.map((s) => `| ${s} | đạt | tests/region.test.ts |`),
        },
        { "<id màn>": "inventory" },
      ),
    );
    lines.push(gridLine("b", { ten: "LuoiB", nhu_cau: "b" }));
    // new family: today
    contract(root, "c", "implemented", ["today"]);
    images(root, "c");
    write(root, "_acceptance/c/evidence/today-huong-1.png", png(1440, 51));
    write(root, "_acceptance/c/evidence/today-huong-2.png", png(1440, 52));
    proof(
      root,
      "c",
      fill(
        block("KHUON-HO-MOI"),
        {
          ...common("c", "màn"),
          "<họ>": ["| rỗng | họ mới | việc trong ngày, không phải danh sách |"],
        },
        {
          "<id màn>": "today",
          "<hướng 1>": "Thẻ",
          "<hướng 2>": "Danh sách",
          "<một câu>": "một câu",
        },
      ),
    );
    lines.push(gridLine("c", { ten: "LuoiC", nhu_cau: "c" }));
    // wrapping template
    contract(root, "d", "implemented", ["today", "inventory"], { khuon_boc: "app-shell" });
    images(root, "d");
    proof(
      root,
      "d",
      fill(block("KHUON-BOC"), common("d", "app-shell"), { "<id khuôn>": "app-shell" }),
    );
    lines.push(gridLine("d", { ten: "LuoiD", nhu_cau: "d" }));
    ledger(root, lines);
    const g = run(root);
    expect(g.stdout + g.stderr).toContain("đã chứng minh");
    expect(g.status).toBe(0);
    proof(root, "a", follows.replace("### Từ Quỹ hàng", "### Từ Quỹ"));
    expect(codesOf(root)).toContain("thieu-tu-quy-hang");
  });
});

// ---------------------------------------------------------------- AC-10 (machine anchor; the judgment eval reads the text)

const OLD_RULE = "Adapting a ReUI block changes its data, text and props only";

/** Problems of the UI skill against decision 0023; empty when it holds. */
function skillProblems(text: string): string[] {
  const out: string[] = [];
  if (text.includes(OLD_RULE)) out.push(`còn câu cũ: ${OLD_RULE}`);
  for (const s of [
    "design/so-khoi.yaml",
    "docs/tri-thuc/wiki/chu-de/",
    "onehub-quy-hang",
    "Component",
    "ReUI block",
    "Template",
    "tools/proof_gate/check.py",
    "tools/proof_gate/khuon-chung-minh.md",
    "chung-minh-man.md",
    "tools/reui_catalog",
  ]) {
    if (!text.includes(s)) out.push(`thiếu: ${s}`);
  }
  return out;
}

describe("luật giao diện theo 0023", () => {
  it("skill không còn câu cũ, trỏ sổ khối, sổ bối cảnh, Quỹ hàng, ba tầng và các lệnh của 1c, 1g", () => {
    const skill = readFileSync(join(ROOT, ".claude/skills/inventory-ui/SKILL.md"), "utf8");
    expect(skillProblems(skill)).toEqual([]);
    // Control: putting the old line back is caught, by name.
    expect(skillProblems(`${skill}\n- ${OLD_RULE}.\n`)).toEqual([`còn câu cũ: ${OLD_RULE}`]);
  });
  it("khuôn có khối KHUON-BOC và bốn mục mới", () => {
    const t = readFileSync(join(ROOT, "tools/proof_gate/khuon-chung-minh.md"), "utf8");
    expect(t).toContain("<!-- <<<KHUON-BOC -->");
    for (const h of ["### Từ Quỹ hàng", "### Họ", "### Ứng viên ReUI", "### Vùng"])
      expect(t).toContain(h);
  });
});
