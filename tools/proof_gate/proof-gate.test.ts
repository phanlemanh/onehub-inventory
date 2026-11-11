// Tests for tools/proof_gate/check.py (row 1c, _acceptance/cong-chung-minh-man-mau, decision 0019).
// Each rule is shown green on a healthy proof and red, with its pinned code, when one thing is broken on a copy.
import { spawnSync } from "node:child_process";
import { cpSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { crc32, deflateSync } from "node:zlib";

import { describe, expect, it } from "vitest";

const ROOT = fileURLToPath(new URL("../..", import.meta.url));
const SCRIPT = join(ROOT, "tools/proof_gate/check.py");
const FIXTURES = join(ROOT, "tools/proof_gate/fixtures/lien-he-quy-hang");

// The real Lưới family declares these; the sample repo uses the same list so the replays line up.
const ASPECTS = [
  "Khung và bố cục",
  "Cột chính và góc nhìn",
  "Thanh công cụ, lọc, tìm, sắp xếp",
  "Bảng",
  "Mở chi tiết cạnh bảng",
  "Trạng thái tải, trống, lỗi",
  "Ghi và báo đã lưu",
  "Phím tắt",
  "Điện thoại",
  "Tốc độ mở màn",
  "Chữ và nhãn",
  "Quyền theo vai",
];
const WIDTHS = [360, 1440];
const STATES = ["Chờ tải", "Trống", "Lỗi"];

function run(root: string, ...args: string[]) {
  return spawnSync("python3", [SCRIPT, "--root", root, ...args], { encoding: "utf8" });
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
  ihdr[9] = 0;
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

function familyFile(reference: string) {
  return [
    "---",
    "nhom: luoi",
    "---",
    "",
    "## Triết lý",
    "",
    "Lưới thay Sheet và Excel cho Đầu chủ.",
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
  ].join("\n");
}

/**
 * A sample repo: Lưới family (grid) whose reference screen is `reference` («chưa có» for none). When `proven`, a signed
 * contract already proves the reference's full state matrix, as the real repo will once row 2 is signed.
 */
function sampleRepo(reference = "inventory", proven = true): string {
  const root = mkdtempSync(join(tmpdir(), "proof-gate-"));
  write(
    root,
    "design/screens.yaml",
    [
      "families:",
      "  grid: Lưới",
      "  board: Bảng thẻ",
      "screens:",
      ...[
        ["inventory", "grid", "staff"],
        ["contacts", "grid", "staff"],
        ["today", "null", "staff"],
        ["board", "board", "staff"],
        ["proto", "null", "dev"],
      ].map(([id, fam, aud]) => `  - id: ${id}\n    family: ${fam}\n    audience: ${aud}`),
      "",
    ].join("\n"),
  );
  write(root, "design/patterns/luoi.md", familyFile(reference));
  write(
    root,
    "design/states.md",
    [
      "# Ma trận",
      "",
      "| Trạng thái | Yêu cầu |",
      "| --- | --- |",
      ...STATES.map((s) => `| ${s} | x |`),
      "",
    ].join("\n"),
  );
  write(
    root,
    "design/component-registry.json",
    JSON.stringify({ components: [{ name: "DataRegion" }, { name: "DataGrid" }] }),
  );
  write(
    root,
    "design/reui-catalog.json",
    JSON.stringify({ groups: [{ items: [{ name: "data-grid" }, { name: "kanban" }] }] }),
  );
  write(root, "design/decisions.yaml", "version: 1\ndecisions:\n  - id: grid-density\n");
  write(root, "wiki/decisions/0019-measurable-design-system-pilot.md", "# 0019\n");
  write(root, "tests/region.test.ts", "// decision:grid-density\n");
  if (reference !== "chưa có" && proven) {
    contract(root, "mau-da-ky", "signed-off", [reference]);
    proof(root, "mau-da-ky", matrixProof(reference));
  }
  return root;
}

function contract(root: string, slug: string, status: string, screens: string[]) {
  write(
    root,
    `_acceptance/${slug}/contract.md`,
    `---\nslug: ${slug}\nstatus: ${status}\nscreens: [${screens.join(", ")}]\n---\n\n# ${slug}\n`,
  );
}

const BLOCKS_OK = [
  "### Khối",
  "",
  "| Khối | Bậc | Đã tra | Ứng viên gần nhất | Vì sao không dùng |",
  "| --- | --- | --- | --- | --- |",
  "| DataRegion | trong-kho | | | |",
];

/** A healthy «theo mẫu» proof for `screen`, with its images written into the contract folder. */
function followsProof(root: string, slug: string, screen: string, extraAspectRows: string[] = []) {
  for (const w of WIDTHS) {
    write(root, `_acceptance/${slug}/evidence/${screen}-${w}.png`, png(w, 1));
    write(root, `_acceptance/${slug}/evidence/mau-${w}.png`, png(w, 2));
  }
  return [
    `## Màn ${screen}`,
    "",
    "### Ảnh cạnh màn mẫu",
    "",
    "| Khổ | Màn này | Màn mẫu | Dữ liệu |",
    "| --- | --- | --- | --- |",
    ...WIDTHS.map(
      (w) => `| ${w} | evidence/${screen}-${w}.png | evidence/mau-${w}.png | du-lieu-mau |`,
    ),
    "",
    "### Mặt so",
    "",
    "| Mặt | Kết quả | Căn cứ |",
    "| --- | --- | --- |",
    ...ASPECTS.map((a) => `| ${a} | giống | ảnh 1440: cùng chỗ, cùng cỡ |`),
    ...extraAspectRows,
    "",
    ...BLOCKS_OK,
    "",
  ].join("\n");
}

function matrixProof(
  screen: string,
  rows = STATES.map((s) => `| ${s} | đạt | tests/region.test.ts |`),
) {
  return [
    `## Màn ${screen}`,
    "",
    "### Ma trận trạng thái",
    "",
    "| Trạng thái | Kết quả | Căn cứ |",
    "| --- | --- | --- |",
    ...rows,
    "",
    ...BLOCKS_OK,
    "",
  ].join("\n");
}

function directionsProof(root: string, slug: string, screen: string, rows?: string[]) {
  write(root, `_acceptance/${slug}/evidence/h1.png`, png(1440, 1));
  write(root, `_acceptance/${slug}/evidence/h2.png`, png(1440, 2));
  return [
    `## Màn ${screen}`,
    "",
    "### Hướng",
    "",
    "| Hướng | Ảnh | Động cơ | Đánh đổi | Chọn |",
    "| --- | --- | --- | --- | --- |",
    ...(rows ?? [
      "| Cột | evidence/h1.png | thấy cả quy trình | chật trên điện thoại | x |",
      "| Danh sách nhóm | evidence/h2.png | gọn trên điện thoại | khó kéo thả | |",
    ]),
    "",
    ...BLOCKS_OK,
    "",
  ].join("\n");
}

function proof(root: string, slug: string, text: string) {
  write(root, `_acceptance/${slug}/chung-minh-man.md`, text);
}

function codes(out: string): string[] {
  return [...out.matchAll(/ · ([a-z-]+): /g)].map((m) => m[1] ?? "");
}

describe("áp khi nào: trạng thái × khai màn", () => {
  it("đỏ đúng hai ô của ma trận 6 × 3 viết trước", () => {
    const statuses = [
      "draft",
      "approved",
      "implemented",
      "verified",
      "signed-off",
      "machine-cleared",
    ];
    const kinds: Record<string, string[]> = { luoi: ["inventory"], dev: ["proto"], rong: [] };
    const root = sampleRepo("chưa có");
    const cells: string[] = [];
    for (const s of statuses) {
      for (const [k, screens] of Object.entries(kinds)) {
        const slug = `${s}-${k}`;
        contract(root, slug, s, screens);
        cells.push(slug);
      }
    }
    expect(cells).toHaveLength(18);
    const r = run(root);
    expect(r.status).toBe(1);
    const red = cells.filter((slug) => r.stdout.includes(`${slug} · `));
    expect(red.sort()).toEqual(["implemented-luoi", "verified-luoi"]);
    for (const slug of red) {
      expect(r.stdout).toContain(`${slug} · inventory · thieu-chung-minh:`);
    }
    // Positive control: a complete proof for the two red cells turns the gate green.
    for (const slug of red) proof(root, slug, matrixProof("inventory"));
    const g = run(root);
    expect(g.stdout + g.stderr).not.toContain("thieu-chung-minh");
    expect(g.status).toBe(0);
  });

  it("--report luôn thoát 0 và đếm theo lối, chỗ lệch, rơi bậc", () => {
    const root = sampleRepo("inventory", false);
    contract(root, "sap-ky", "signed-off", ["inventory"]);
    contract(root, "dang-lam", "implemented", ["inventory"]);
    expect(run(root).status).toBe(1);
    const red = run(root, "--report", "--json");
    expect(red.status).toBe(0);
    expect(JSON.parse(red.stdout).truoc_cong).toBe(1);

    const ok = sampleRepo("inventory", false);
    // One screen per path: board (new family), inventory (the reference itself), contacts (follows).
    contract(ok, "ho-moi", "implemented", ["board"]);
    proof(ok, "ho-moi", directionsProof(ok, "ho-moi", "board"));
    contract(ok, "man-mau", "implemented", ["inventory"]);
    proof(ok, "man-mau", matrixProof("inventory"));
    contract(ok, "theo", "implemented", ["contacts"]);
    proof(
      ok,
      "theo",
      followsProof(ok, "theo", "contacts", [
        "| Bảng | khác — có lý do | tests/region.test.ts |",
        "| Phím tắt | khác — có lý do | decision:grid-density |",
        "| Bảng | khác — vô cớ | |",
        "| Chữ và nhãn | khác — vô cớ | |",
        "| Quyền theo vai | khác — vô cớ | |",
      ]).replace(
        "| DataRegion | trong-kho | | | |",
        "| DataRegion | trong-kho | | | |\n| data-grid | reui | data grid | DataRegion | cần kéo cột |",
      ),
    );
    const rep = run(ok, "--report", "--json");
    expect(rep.status).toBe(0);
    const data = JSON.parse(rep.stdout);
    expect(data.theo_loi).toEqual({ ho_moi: 1, man_mau_moi: 1, theo_mau: 1 });
    expect(data.lech).toEqual({ co_ly_do: 2, vo_co: 3 });
    expect(data.roi_bac).toBe(1);
  });
});

describe("theo mẫu: ảnh cạnh màn mẫu", () => {
  function setup() {
    const root = sampleRepo("inventory");
    contract(root, "lh", "implemented", ["contacts"]);
    const text = followsProof(root, "lh", "contacts");
    proof(root, "lh", text);
    return { root, text };
  }

  it("tệp lành thì xanh", () => {
    const r = run(setup().root);
    expect(r.stdout + r.stderr).toContain("đã chứng minh");
    expect(r.status).toBe(0);
  });

  const breaks: [string, (root: string, text: string) => string, string, string?][] = [
    ["bỏ dòng khổ 360", (_r, t) => t.replace(/\| 360 \|.*\n/, ""), "thieu-anh-kho", "360"],
    [
      "ảnh không có",
      (_r, t) => t.replace("evidence/mau-1440.png", "evidence/khong-co.png"),
      "anh-khong-co",
    ],
    [
      "ảnh là tệp chữ",
      (root, t) => {
        write(root, "_acceptance/lh/evidence/chu.png", "không phải ảnh");
        return t.replace("evidence/mau-1440.png", "evidence/chu.png");
      },
      "anh-khong-phai-png",
    ],
    [
      "ảnh 1440 rộng 1200",
      (root, t) => {
        write(root, "_acceptance/lh/evidence/hep.png", png(1200, 3));
        return t.replace("evidence/mau-1440.png", "evidence/hep.png");
      },
      "anh-lech-kho",
    ],
    [
      "hai ảnh trùng byte",
      (_r, t) => t.replace("evidence/mau-1440.png", "evidence/contacts-1440.png"),
      "anh-trung",
    ],
    [
      "nhãn dữ liệu rỗng",
      (_r, t) => t.replace(/(\| 1440 \|.*\|) du-lieu-mau \|/, "$1  |"),
      "thieu-du-lieu",
    ],
  ];
  for (const [name, mutate, code, extra] of breaks) {
    it(`${name} → ${code}`, () => {
      const { root, text } = setup();
      proof(root, "lh", mutate(root, text));
      const r = run(root);
      expect(r.status).toBe(1);
      expect(codes(r.stdout)).toContain(code);
      if (extra) expect(r.stdout).toContain(extra);
    });
  }
});

describe("theo mẫu: mặt so", () => {
  function red(mutate: (t: string) => string) {
    const root = sampleRepo("inventory");
    contract(root, "lh", "implemented", ["contacts"]);
    proof(root, "lh", mutate(followsProof(root, "lh", "contacts")));
    return run(root);
  }
  it("xoá mặt Phím tắt → thieu-mat", () => {
    const r = red((t) => t.replace(/\| Phím tắt \| giống .*\n/, ""));
    expect(r.status).toBe(1);
    expect(r.stdout).toMatch(/thieu-mat: .*Phím tắt/);
  });
  it("giống mà không chỉ ảnh → giong-khong-anh", () => {
    const r = red((t) => t.replace(/(\| Bảng \| giống \|) [^|]*\|/, "$1 đúng như mẫu |"));
    expect(codes(r.stdout)).toEqual(["giong-khong-anh"]);
  });
  it("giống chỉ vì cùng thành phần → ten-thanh-phan", () => {
    const r = red((t) =>
      t.replace(/(\| Bảng \| giống \|) [^|]*\|/, "$1 cùng DataRegion, DataGrid |"),
    );
    expect(codes(r.stdout)).toEqual(["ten-thanh-phan"]);
    expect(r.stdout).toContain("chấm theo tên thành phần");
  });
  it("đối chứng: có chỉ ảnh thì nhắc tên thành phần vẫn im", () => {
    const r = red((t) =>
      t.replace(/(\| Bảng \| giống \|) [^|]*\|/, "$1 ảnh 1440, cùng DataGrid |"),
    );
    expect(r.status).toBe(0);
  });
});

describe("theo mẫu: chỗ lệch", () => {
  function runWith(rows: string[]) {
    const root = sampleRepo("inventory");
    contract(root, "lh", "implemented", ["contacts"]);
    proof(root, "lh", followsProof(root, "lh", "contacts", rows));
    return run(root);
  }
  it("hai chỗ vô cớ → lech-vo-co, dòng tổng đếm 2", () => {
    const r = runWith(["| Bảng | khác — vô cớ | |", "| Phím tắt | khác - vô cớ | |"]);
    expect(r.status).toBe(1);
    expect(codes(r.stdout)).toContain("lech-vo-co");
    expect(r.stdout).toContain("2 chỗ lệch vô cớ");
  });
  it("lý do trỏ tệp không có → ly-do-khong-can-cu", () => {
    const r = runWith(["| Bảng | khác — có lý do | docs/khong-co.md |"]);
    expect(codes(r.stdout)).toEqual(["ly-do-khong-can-cu"]);
  });
  it("lý do trỏ mã quyết định không có → ly-do-khong-can-cu", () => {
    const r = runWith(["| Bảng | khác — có lý do | decision:D-999 |"]);
    expect(codes(r.stdout)).toEqual(["ly-do-khong-can-cu"]);
  });
  it("lý do trỏ thư mục, hay một tệp thật kèm một tệp không có → ly-do-khong-can-cu", () => {
    for (const grounds of ["design/", "tests/region.test.ts docs/khong-co.md"]) {
      expect(codes(runWith([`| Bảng | khác — có lý do | ${grounds} |`]).stdout), grounds).toEqual([
        "ly-do-khong-can-cu",
      ]);
    }
  });
  it("ma trận căn cứ: ba loại × có thật hay thiếu × đứng riêng hay đi cùng một tệp thật", () => {
    const real = {
      tep: "tests/region.test.ts",
      quyet: "decision:grid-density",
      wiki: "wiki/decisions/0019",
    };
    const missing = { tep: "tests/khong-co.test.ts", quyet: "decision:D-999", wiki: "ADR-9999" };
    const cases: [string, boolean][] = [];
    for (const k of ["tep", "quyet", "wiki"] as const) {
      cases.push([real[k], true], [missing[k], false]);
      cases.push(
        [`tests/region.test.ts ${real[k]}`, true],
        [`tests/region.test.ts ${missing[k]}`, false],
      );
    }
    expect(cases).toHaveLength(12);
    for (const [grounds, silent] of cases) {
      const out = runWith([`| Bảng | khác — có lý do | ${grounds} |`]).stdout;
      expect(codes(out), grounds).toEqual(silent ? [] : ["ly-do-khong-can-cu"]);
    }
  });
  it("dấu / trong lời thường, đường web và liên kết markdown không bị coi là tệp", () => {
    for (const grounds of [
      "tests/region.test.ts (đọc/ghi)",
      "tests/region.test.ts và/hoặc N/A",
      "tests/region.test.ts ListSide/BuyerSide",
      "tests/region.test.ts xem https://dd.reso.org/DD2.1/",
      "[tests/region.test.ts](tests/region.test.ts)",
      "ADR-0019/ADR-0019",
    ]) {
      expect(codes(runWith([`| Bảng | khác — có lý do | ${grounds} |`]).stdout), grounds).toEqual(
        [],
      );
    }
    // Prose alone is not grounds.
    expect(codes(runWith(["| Bảng | khác — có lý do | đọc/ghi |"]).stdout)).toEqual([
      "ly-do-khong-can-cu",
    ]);
  });
  it("đối chứng: tệp có thật, mã quyết định có thật, quyết định wiki có thật thì im", () => {
    const r = runWith([
      "| Bảng | khác — có lý do | `tests/region.test.ts` |",
      "| Phím tắt | khác — có lý do | decision:grid-density |",
      "| Điện thoại | khác — có lý do | wiki/decisions/0019 |",
    ]);
    expect(r.stdout + r.stderr).not.toContain("ly-do-khong-can-cu");
    expect(r.status).toBe(0);
  });
});

describe("phát lại Liên hệ", () => {
  function replay(file: string) {
    const root = sampleRepo("inventory");
    contract(root, "lien-he", "implemented", ["contacts"]);
    proof(root, "lien-he", readFileSync(join(FIXTURES, file), "utf8"));
    return run(root);
  }
  it("lời cổng cũ: 12 mặt gắn cờ tên thành phần, thiếu ảnh", () => {
    const r = replay("cong-cu.md");
    expect(r.status).toBe(1);
    expect(codes(r.stdout).filter((c) => c === "ten-thanh-phan")).toHaveLength(12);
    expect(codes(r.stdout)).toContain("thieu-anh-kho");
  });
  it("bảng kiểm thật: 25 chỗ lệch vô cớ", () => {
    const r = replay("ban-kiem.md");
    expect(r.status).toBe(1);
    expect(r.stdout).toContain("25 chỗ lệch vô cớ");
  });
  it("hai bản ghim nguồn; bảng kiểm có 43 mã L, 18 có lý do, 25 vô cớ, mỗi mã một mục gốc", () => {
    const source =
      "Nguồn: onehub-quy-hang · docs/plan/dong-nhat-bang-hang-lien-he.md · commit fed33adc2c13231c3a8ab9432a8cb2b82c0bb0d4";
    for (const f of ["cong-cu.md", "ban-kiem.md"]) {
      const text = readFileSync(join(FIXTURES, f), "utf8");
      expect(text).toContain(source);
      expect(text).toMatch(/commit [0-9a-f]{40}/);
    }
    const rows = readFileSync(join(FIXTURES, "ban-kiem.md"), "utf8")
      .split("\n")
      .filter((l) => /^\|\s*L\d+\s*\|/.test(l));
    expect(rows).toHaveLength(43);
    const ids = rows.map((l) => l.split("|")[1]?.trim());
    expect(new Set(ids).size).toBe(43);
    expect(ids).toEqual(Array.from({ length: 43 }, (_, i) => `L${i + 1}`));
    for (const l of rows) expect(l).toMatch(/\|\s*§(1[0-2]|[1-9])\s*\|/);
    expect(rows.filter((l) => l.includes("khác — có lý do"))).toHaveLength(18);
    expect(rows.filter((l) => l.includes("khác — vô cớ"))).toHaveLength(25);
  });
});

describe("màn mẫu mới: ma trận trạng thái", () => {
  function runWith(rows?: string[], reference = "chưa có") {
    const root = sampleRepo(reference);
    contract(root, "bh", "implemented", ["inventory"]);
    proof(root, "bh", matrixProof("inventory", rows));
    return run(root);
  }
  it("ma trận đủ thì xanh", () => {
    expect(runWith().status).toBe(0);
  });
  it("thiếu một trạng thái → thieu-trang-thai", () => {
    const r = runWith([
      "| Chờ tải | đạt | tests/region.test.ts |",
      "| Trống | không áp | màn chỉ đọc |",
    ]);
    expect(r.stdout).toMatch(/thieu-trang-thai: .*Lỗi/);
  });
  it("đạt mà bài kiểm không có → bai-kiem-khong-co", () => {
    const r = runWith([
      "| Chờ tải | đạt | tests/khong-co.test.ts |",
      "| Trống | đạt | tests/region.test.ts |",
      "| Lỗi | đạt | tests/region.test.ts |",
    ]);
    expect(codes(r.stdout)).toEqual(["bai-kiem-khong-co"]);
  });
  it("đạt mà căn cứ là thư mục, hay kèm một tệp không có cạnh tệp thật → bai-kiem-khong-co", () => {
    for (const grounds of ["tests/", "tests/region.test.ts tests/khong-co.test.ts"]) {
      const r = runWith([
        `| Chờ tải | đạt | ${grounds} |`,
        "| Trống | đạt | tests/region.test.ts |",
        "| Lỗi | đạt | tests/region.test.ts |",
      ]);
      expect(codes(r.stdout), grounds).toEqual(["bai-kiem-khong-co"]);
    }
  });
  it("không áp thiếu lý do → khong-ap-thieu-ly-do", () => {
    const r = runWith([
      "| Chờ tải | đạt | tests/region.test.ts |",
      "| Trống | không áp | |",
      "| Lỗi | đạt | tests/region.test.ts |",
    ]);
    expect(codes(r.stdout)).toEqual(["khong-ap-thieu-ly-do"]);
  });
});

describe("màn mẫu đã khai", () => {
  it("không tệp nào chứng đủ ma trận → man-mau-chua-dat", () => {
    const root = sampleRepo("inventory", false);
    const r = run(root);
    expect(r.status).toBe(1);
    expect(r.stdout).toContain("design/patterns/luoi.md · inventory · man-mau-chua-dat:");
  });
  it("đối chứng: hồ sơ đã đóng hay còn mở chứng đủ thì im", () => {
    for (const status of ["signed-off", "implemented"]) {
      const root = sampleRepo("inventory", false);
      contract(root, "bh", status, ["inventory"]);
      proof(root, "bh", matrixProof("inventory"));
      const r = run(root);
      expect(r.stdout).not.toContain("man-mau-chua-dat");
      expect(r.status).toBe(0);
    }
  });
  it("sửa chính màn mẫu: chỉ có ảnh mà không ma trận → thieu-trang-thai, không anh-trung", () => {
    const root = sampleRepo("inventory", false);
    contract(root, "cu", "signed-off", ["inventory"]);
    proof(root, "cu", matrixProof("inventory"));
    contract(root, "sua", "implemented", ["inventory"]);
    proof(root, "sua", followsProof(root, "sua", "inventory"));
    const r = run(root);
    expect(codes(r.stdout)).toContain("thieu-trang-thai");
    expect(codes(r.stdout)).not.toContain("anh-trung");
    proof(root, "sua", matrixProof("inventory"));
    expect(run(root).status).toBe(0);
  });
});

describe("họ mới: hướng", () => {
  function runWith(status: string, rows?: string[], screen = "today") {
    const root = sampleRepo("inventory");
    contract(root, "hm", status, [screen]);
    proof(root, "hm", directionsProof(root, "hm", screen, rows));
    return run(root);
  }
  const one = ["| Cột | evidence/h1.png | thấy cả quy trình | chật | x |"];
  it("hai hướng khác nhau, một hướng chọn → xanh", () => {
    expect(runWith("approved").status).toBe(0);
  });
  it("một hướng → thieu-huong; ở draft thì im", () => {
    expect(codes(runWith("approved", one).stdout)).toContain("thieu-huong");
    expect(runWith("draft", one).status).toBe(0);
  });
  it("bốn hướng → qua-nhieu-huong", () => {
    const four = [1, 2, 3, 4].map(
      (i) => `| H${i} | evidence/h${i}.png | a | b | ${i === 1 ? "x" : ""} |`,
    );
    const root = sampleRepo("inventory");
    contract(root, "hm", "approved", ["today"]);
    for (const i of [1, 2, 3, 4]) write(root, `_acceptance/hm/evidence/h${i}.png`, png(1440, i));
    proof(root, "hm", directionsProof(root, "hm", "today", four));
    for (const i of [3, 4]) write(root, `_acceptance/hm/evidence/h${i}.png`, png(1440, i));
    expect(codes(run(root).stdout)).toEqual(["qua-nhieu-huong"]);
  });
  it("hai hướng cùng byte ảnh → huong-trung", () => {
    const r = runWith("approved", [
      "| Cột | evidence/h1.png | a | b | x |",
      "| Nhóm | evidence/h1.png | c | d | |",
    ]);
    expect(codes(r.stdout)).toEqual(["huong-trung"]);
  });
  it("thiếu đánh đổi → huong-thieu-truong", () => {
    const r = runWith("approved", [
      "| Cột | evidence/h1.png | a | | x |",
      "| Nhóm | evidence/h2.png | c | d | |",
    ]);
    expect(codes(r.stdout)).toEqual(["huong-thieu-truong"]);
  });
  it("không chọn hay chọn hai → chon-khac-mot", () => {
    for (const marks of [
      ["", ""],
      ["x", "x"],
    ]) {
      const r = runWith("approved", [
        `| Cột | evidence/h1.png | a | b | ${marks[0]} |`,
        `| Nhóm | evidence/h2.png | c | d | ${marks[1]} |`,
      ]);
      expect(codes(r.stdout)).toEqual(["chon-khac-mot"]);
    }
  });
  it("họ có tên mà chưa có tệp họ cũng đi lối họ mới", () => {
    expect(codes(runWith("approved", one, "board").stdout)).toContain("thieu-huong");
  });
});

describe("thang: trong kho, ReUI, vẽ tay", () => {
  function runWith(blockRows: string[] | null) {
    const root = sampleRepo("chưa có");
    contract(root, "bh", "implemented", ["inventory"]);
    let text = matrixProof("inventory");
    const head = "| --- | --- | --- | --- | --- |\n| DataRegion | trong-kho | | | |";
    if (blockRows === null) text = text.replace(/### Khối[\s\S]*$/, "");
    else text = text.replace(head, ["| --- | --- | --- | --- | --- |", ...blockRows].join("\n"));
    proof(root, "bh", text);
    return run(root);
  }
  it("DataRegion trong kho → im", () => {
    expect(runWith(["| DataRegion | trong-kho | | | |"]).status).toBe(0);
  });
  it("khối trong kho không có trong sổ → khoi-khong-co", () => {
    expect(codes(runWith(["| BangTuVe | trong-kho | | | |"]).stdout)).toEqual(["khoi-khong-co"]);
  });
  it("data-grid ReUI đủ ba cột → im", () => {
    expect(runWith(["| data-grid | reui | lưới kéo cột | DataRegion | cần kéo cột |"]).status).toBe(
      0,
    );
  });
  it("ReUI thiếu vì sao không dùng → roi-bac-thieu-can-cu", () => {
    const r = runWith(["| data-grid | reui | lưới kéo cột | DataRegion | |"]);
    expect(codes(r.stdout)).toEqual(["roi-bac-thieu-can-cu"]);
  });
  it("vẽ tay, ứng viên không có thật → roi-bac-thieu-can-cu", () => {
    const r = runWith(["| BangVe | ve-tay | lưới | KhongCo | không vừa |"]);
    expect(codes(r.stdout)).toEqual(["roi-bac-thieu-can-cu"]);
  });
  it("bậc lạ → bac-la", () => {
    expect(codes(runWith(["| X | tu-che | | | |"]).stdout)).toEqual(["bac-la"]);
  });
  it("không có mục Khối, hay bảng không dòng nào → thieu-bang-khoi; thêm lại một dòng thì im", () => {
    expect(codes(runWith(null).stdout)).toEqual(["thieu-bang-khoi"]);
    expect(codes(runWith([]).stdout)).toEqual(["thieu-bang-khoi"]);
    expect(runWith(["| DataRegion | trong-kho | | | |"]).status).toBe(0);
  });
});

describe("khuôn tệp chứng minh qua được lưới", () => {
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
  /** Fill the template rows the way an agent would: repeat the sample row once per item, fill the blanks. */
  function fill(text: string, perRow: Record<string, string[]>, values: Record<string, string>) {
    let out = text;
    for (const [marker, rows] of Object.entries(perRow)) {
      const line = out.split("\n").find((l) => l.startsWith("|") && l.includes(marker)) ?? "";
      out = out.replace(line, rows.join("\n"));
    }
    for (const [k, v] of Object.entries(values)) out = out.split(k).join(v);
    return out;
  }
  const blockRow = ["| DataRegion | trong-kho | | | |"];

  it("mỗi lối điền theo khuôn thì xanh; đổi tên mục thì đỏ", () => {
    const root = sampleRepo("inventory");
    contract(root, "a", "implemented", ["contacts"]);
    for (const w of WIDTHS) {
      write(root, `_acceptance/a/evidence/contacts-${w}.png`, png(w, 1));
      write(root, `_acceptance/a/evidence/inventory-${w}.png`, png(w, 2));
    }
    const follows = fill(
      block("KHUON-THEO-MAU"),
      {
        "<khổ>": WIDTHS.map(
          (w) => `| ${w} | evidence/contacts-${w}.png | evidence/inventory-${w}.png | mau |`,
        ),
        "<mặt>": ASPECTS.map((a) => `| ${a} | giống | ảnh 1440: như mẫu |`),
        "<tên khối>": blockRow,
      },
      { "<id màn>": "contacts" },
    );
    proof(root, "a", follows);
    contract(root, "b", "implemented", ["inventory"]);
    proof(
      root,
      "b",
      fill(
        block("KHUON-MAN-MAU-MOI"),
        {
          "<trạng thái>": STATES.map((s) => `| ${s} | đạt | tests/region.test.ts |`),
          "<tên khối>": blockRow,
        },
        { "<id màn>": "inventory" },
      ),
    );
    contract(root, "c", "implemented", ["today"]);
    write(root, "_acceptance/c/evidence/today-huong-1.png", png(1440, 1));
    write(root, "_acceptance/c/evidence/today-huong-2.png", png(1440, 2));
    proof(
      root,
      "c",
      fill(
        block("KHUON-HO-MOI"),
        { "<tên khối>": blockRow },
        {
          "<id màn>": "today",
          "<hướng 1>": "Thẻ",
          "<hướng 2>": "Danh sách",
          "<một câu>": "một câu",
        },
      ),
    );
    const g = run(root);
    expect(g.stdout + g.stderr).toContain("đã chứng minh");
    expect(g.status).toBe(0);
    proof(root, "a", follows.replace("### Mặt so", "### Mặt đối chiếu"));
    expect(codes(run(root).stdout)).toContain("thieu-mat");
  });

  it("skill giao diện trỏ đúng lệnh, khuôn, tệp và danh mục ReUI", () => {
    const skill = readFileSync(join(ROOT, ".claude/skills/inventory-ui/SKILL.md"), "utf8");
    for (const s of [
      "tools/proof_gate/check.py",
      "tools/proof_gate/khuon-chung-minh.md",
      "chung-minh-man.md",
      "tools/reui_catalog",
    ]) {
      expect(skill).toContain(s);
    }
  });
});

describe("kho thật", () => {
  it("lưới xanh trên chính kho", () => {
    const r = run(ROOT);
    expect(r.stderr).toBe("");
    expect(r.status).toBe(0);
  });

  it("thêm vòng implemented khai Bảng hàng mà thiếu chứng minh thì đỏ", () => {
    const copy = mkdtempSync(join(tmpdir(), "proof-gate-real-"));
    for (const d of ["design", "_acceptance", "wiki/decisions", "tests"]) {
      cpSync(join(ROOT, d), join(copy, d), { recursive: true });
    }
    expect(run(copy).status).toBe(0);
    contract(copy, "vong-moi", "implemented", ["inventory"]);
    const r = run(copy);
    expect(r.status).toBe(1);
    expect(r.stdout).toContain("vong-moi · inventory · thieu-chung-minh:");
  });

  it("họ Lưới khai đủ bốn mục", () => {
    const text = readFileSync(join(ROOT, "design/patterns/luoi.md"), "utf8");
    const section = (h: string) => text.split(`## ${h}\n`)[1]?.split("\n## ")[0] ?? "";
    expect(section("Triết lý")).toMatch(/Sheet/);
    expect(section("Triết lý")).toMatch(/Excel/);
    expect(section("Màn mẫu")).toContain("Màn: chưa có");
    expect(section("Khổ so").match(/\d+/g)?.map(Number)).toEqual([360, 414, 1024, 1440]);
    expect(
      section("Mặt so")
        .match(/^- .+$/gm)
        ?.map((l) => l.slice(2)),
    ).toEqual(ASPECTS);
  });
});
