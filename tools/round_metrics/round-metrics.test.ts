// Tests for tools/round_metrics/round_metrics.py (row 1h, _acceptance/so-do-moi-vong).
// Run-log lines come from real kit run logs, listed with their source in mau/dong-so-chay.json;
// only `round` and `verdict` are changed here, and path fields there were replaced by "<lược>".
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
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const ROOT = fileURLToPath(new URL("../..", import.meta.url));
const SCRIPT = join(ROOT, "tools/round_metrics/round_metrics.py");
const MAU = JSON.parse(
  readFileSync(join(ROOT, "tools/round_metrics/mau/dong-so-chay.json"), "utf8"),
) as Record<string, { nguon: string; dong: Record<string, unknown> }>;
const TANG = [
  "bai-kiem-ha-tang",
  "trang-thai-hanh-vi",
  "du-lieu-api",
  "nghiep-vu",
  "thanh-phan",
  "bo-cuc",
  "hop-dong-yeu-cau",
  "link",
  "chu-dinh-dang",
  "mau-token",
  "truy-cap",
];
const MOC = "docs/plan/do-he-design";

type Ban = {
  vong_cham: number;
  lam_lai: { nguon: string; tang: string }[];
  theo_tang: Record<string, number>;
  chua_phan: string[];
  thuoc_vat: { nhat: number } | null;
  gio_may: { gio_may: number } | null;
};

function run(root: string, ...args: string[]) {
  return spawnSync("python3", [SCRIPT, ...args, "--root", root], { encoding: "utf8" });
}

function git(cwd: string, ...args: string[]) {
  const r = spawnSync("git", ["-c", "user.name=t", "-c", "user.email=t@example.com", ...args], {
    cwd,
    encoding: "utf8",
  });
  if (r.status !== 0) throw new Error(`git ${args.join(" ")}: ${r.stderr}`);
  return r.stdout.trim();
}

const dong = (k: string, patch: Record<string, unknown> = {}) =>
  JSON.stringify({ ...MAU[k]!.dong, ...patch });
const tally = (round: number, verdict: string) => dong("reject", { round, verdict });

function tempRoot() {
  const root = mkdtempSync(join(tmpdir(), "round-metrics-"));
  mkdirSync(join(root, "_acceptance"));
  return root;
}

function hoSo(
  root: string,
  slug: string,
  o: {
    status?: string;
    surfaces?: string;
    designPass?: boolean;
    lines?: string[];
    noFrontmatter?: boolean;
  } = {},
) {
  const dir = join(root, "_acceptance", slug);
  mkdirSync(dir, { recursive: true });
  const fm = `---\nslug: ${slug}\nsurfaces: [${o.surfaces ?? "ui"}]\nstatus: ${o.status ?? "verified"}\n---\n\n# x\n`;
  writeFileSync(join(dir, "contract.md"), o.noFrontmatter ? "# x\n" : fm);
  if (o.designPass) writeFileSync(join(dir, "design-pass.md"), "x\n");
  if (o.lines) writeFileSync(join(dir, "run-log.jsonl"), o.lines.join("\n") + "\n");
  return dir;
}

function ban(dir: string): Ban {
  return JSON.parse(readFileSync(join(dir, "so-do-vong.json"), "utf8")) as Ban;
}

const hash = (p: string) =>
  existsSync(p) ? createHash("sha256").update(readFileSync(p)).digest("hex") : "vang";

describe("ghi", () => {
  const lines = [
    tally(1, "REJECT"),
    tally(2, "BLOCKED"),
    tally(3, "PASS"),
    dong("repin_do"),
    dong("thuoc_vat"),
    dong("gio_may"),
  ];

  it("ghi: một lượt REJECT hai tầng, BLOCKED và repin-do", () => {
    const root = tempRoot();
    const dir = hoSo(root, "a", { lines });
    const r = run(root, "ghi", "--slug", "a", "--phan", "r1=trang-thai-hanh-vi,bo-cuc");
    expect(r.status, r.stderr).toBe(0);
    const b = ban(dir);
    expect(b.vong_cham).toBe(3);
    expect(b.lam_lai).toEqual([
      { nguon: "r1", tang: "trang-thai-hanh-vi" },
      { nguon: "r1", tang: "bo-cuc" },
      { nguon: "r2", tang: "bai-kiem-ha-tang" },
      { nguon: `repin-do:${String(MAU["repin_do"]!.dong["lan_id"])}`, tang: "bai-kiem-ha-tang" },
    ]);
    expect(Object.keys(b.theo_tang).sort()).toEqual([...TANG].sort());
    expect(Object.values(b.theo_tang).reduce((s, v) => s + v, 0)).toBe(4);
    expect(b.chua_phan).toEqual([]);
    expect(b.thuoc_vat?.nhat).toBe(MAU["thuoc_vat"]!.dong["nhat"]);
    expect(b.gio_may?.gio_may).toBe(MAU["gio_may"]!.dong["gio_may"]);

    rmSync(join(dir, "so-do-vong.json"));
    expect(run(root, "ghi", "--slug", "a").status).toBe(0);
    expect(ban(dir).chua_phan).toEqual(["r1"]);
  });

  it("ghi: lượt chấm lại và PENDING-JUDGMENT", () => {
    const root = tempRoot();
    const dir = hoSo(root, "a", {
      lines: [tally(1, "REJECT"), tally(1, "PASS"), dong("pending", { round: 2 })],
    });
    expect(run(root, "ghi", "--slug", "a").status).toBe(0);
    expect(ban(dir).vong_cham).toBe(2);
    expect(ban(dir).lam_lai).toEqual([]);
    expect(ban(dir).chua_phan).toEqual([]);
  });

  it("ghi lại giữ tầng đã khai", () => {
    const root = tempRoot();
    const dir = hoSo(root, "a", { lines });
    expect(run(root, "ghi", "--slug", "a", "--phan", "r1=trang-thai-hanh-vi,bo-cuc").status).toBe(
      0,
    );
    writeFileSync(join(dir, "run-log.jsonl"), [...lines, tally(4, "REJECT")].join("\n") + "\n");
    expect(run(root, "ghi", "--slug", "a").status).toBe(0);
    const b = ban(dir);
    expect(b.lam_lai.filter((x) => x.nguon === "r1").map((x) => x.tang)).toEqual([
      "trang-thai-hanh-vi",
      "bo-cuc",
    ]);
    expect(b.chua_phan).toEqual(["r4"]);

    rmSync(join(dir, "so-do-vong.json"));
    expect(run(root, "ghi", "--slug", "a").status).toBe(0);
    expect(ban(dir).chua_phan).toEqual(["r1", "r4"]);
  });

  it("ghi từ chối đầu vào sai", () => {
    const root = tempRoot();
    const dir = hoSo(root, "a", { lines });
    const tep = join(dir, "so-do-vong.json");
    for (const phan of ["r1=mau-sac", "r3=bo-cuc", "r9=bo-cuc"]) {
      const before = hash(tep);
      const r = run(root, "ghi", "--slug", "a", "--phan", phan);
      expect(r.status).toBe(1);
      expect(hash(tep)).toBe(before);
      if (phan === "r1=mau-sac") for (const t of TANG) expect(r.stderr).toContain(t);
      if (phan === "r3=bo-cuc") expect(r.stderr).toContain("r3");
      if (phan === "r9=bo-cuc") expect(r.stderr).toContain("r9");
    }
    expect(run(root, "ghi", "--slug", "a", "--phan", "r1=bo-cuc").status).toBe(0);
    for (const phan of ["r1=mau-sac", "r3=bo-cuc"]) {
      const before = hash(tep);
      expect(run(root, "ghi", "--slug", "a", "--phan", phan).status).toBe(1);
      expect(hash(tep)).toBe(before);
    }
  });

  it("ghi bỏ qua dòng hỏng", () => {
    const root = tempRoot();
    const sach = hoSo(root, "a", { lines });
    const hong = hoSo(root, "b", {
      lines: ["{khong phai json", dong("reject", { round: undefined }), ...lines],
    });
    expect(run(root, "ghi", "--slug", "a", "--phan", "r1=bo-cuc").status).toBe(0);
    expect(run(root, "ghi", "--slug", "b", "--phan", "r1=bo-cuc").status).toBe(0);
    const strip = (d: string) => {
      const o = JSON.parse(readFileSync(join(d, "so-do-vong.json"), "utf8"));
      delete o.ghi_luc;
      delete o.slug;
      return o;
    };
    expect(strip(hong)).toEqual(strip(sach));
  });
});

describe("kiem", () => {
  const STATUSES = [
    "draft",
    "approved",
    "implemented",
    "verified",
    "machine-cleared",
    "signed-off",
    "da-cham-boi-thuc-te",
  ];
  const KINDS = [
    { name: "ui", surfaces: "ui", designPass: false },
    { name: "dp", surfaces: "cli", designPass: true },
    { name: "cli", surfaces: "cli", designPass: false },
  ];

  it("kiem: ma trận trạng thái và loại hồ sơ", () => {
    const root = tempRoot();
    const o = STATUSES.flatMap((status) =>
      KINDS.map((k) => ({ status, ...k, slug: `${k.name}-${status}` })),
    );
    expect(o.length).toBe(21);
    for (const c of o)
      hoSo(root, c.slug, { status: c.status, surfaces: c.surfaces, designPass: c.designPass });
    const r = run(root, "kiem");
    expect(r.status).toBe(1);
    const red = r.stdout.trim().split("\n");
    const expected = o.filter((c) => c.name !== "cli" && STATUSES.indexOf(c.status) >= 3);
    expect(expected.length).toBe(8);
    expect(red.length).toBe(8);
    for (const c of expected) {
      const line = red.find((l) => l.startsWith(`${c.slug}:`));
      expect(line, c.slug).toBeDefined();
      expect(line).toContain(`round_metrics.py ghi --slug ${c.slug}`);
    }
    expect(red.some((l) => l.startsWith("ui-signed-off:"))).toBe(true);
  });

  it("kiem: chưa phân tầng, bản cũ, và bản hợp lệ", () => {
    const root = tempRoot();
    const dir = hoSo(root, "a", { lines: [tally(1, "REJECT"), tally(2, "PASS")] });
    expect(run(root, "ghi", "--slug", "a").status).toBe(0);
    let r = run(root, "kiem");
    expect(r.status).toBe(1);
    expect(r.stdout).toContain("chua phan tang: r1");

    expect(run(root, "ghi", "--slug", "a", "--phan", "r1=bo-cuc").status).toBe(0);
    r = run(root, "kiem");
    expect(r.status, r.stdout).toBe(0);

    writeFileSync(
      join(dir, "run-log.jsonl"),
      [tally(1, "REJECT"), tally(2, "PASS"), tally(3, "PASS")].join("\n"),
    );
    r = run(root, "kiem");
    expect(r.status).toBe(1);
    expect(r.stdout).toContain("ban so do cu: 2 luot, so chay co 3");
  });

  it("kiem: hợp đồng không frontmatter, và vòng không có sổ chạy", () => {
    const root = tempRoot();
    hoSo(root, "khong-fm", { noFrontmatter: true });
    hoSo(root, "khong-so", {});
    expect(run(root, "ghi", "--slug", "khong-so").status).toBe(0);
    const r = run(root, "kiem");
    expect(r.status, r.stdout).toBe(0);
    expect(r.stdout).toContain("kiem: 1 vong giao dien");
  });

  it("kho thật: kiem và kiem-moc xanh", () => {
    const k = run(ROOT, "kiem");
    expect(k.status, k.stdout).toBe(0);
    const m = run(ROOT, "kiem-moc");
    expect(m.status, m.stdout).toBe(0);
  });

  it("kho thật: thêm vòng giao diện verified thì đỏ", () => {
    const root = tempRoot();
    cpSync(join(ROOT, "_acceptance"), join(root, "_acceptance"), { recursive: true });
    cpSync(join(ROOT, MOC), join(root, MOC), { recursive: true });
    expect(run(root, "kiem").status).toBe(0);
    hoSo(root, "vong-moi", { status: "verified", surfaces: "ui" });
    const r = run(root, "kiem");
    expect(r.status).toBe(1);
    expect(r.stdout).toContain("vong-moi:");
  });

  it("kho thật lấy nông: kiem-moc vẫn chạy", () => {
    const root = mkdtempSync(join(tmpdir(), "round-metrics-nong-"));
    rmSync(root, { recursive: true });
    git(tmpdir(), "clone", "-q", "--depth", "1", `file://${ROOT}`, root);
    if (git(root, "rev-parse", "--is-shallow-repository") !== "true")
      throw new Error("clone is not shallow");
    let r = run(root, "kiem-moc");
    expect(r.status, r.stdout).toBe(0);
    expect(r.stdout).toContain("kho nong: bo qua kiem lich su git");

    const moc = JSON.parse(readFileSync(join(root, MOC, latestMoc(root), "moc.json"), "utf8"));
    const a2 = join(root, moc.agent[1].tep);
    writeFileSync(a2, readFileSync(a2, "utf8").replace("lập phương án", "lập kế hoạch"));
    r = run(root, "kiem-moc");
    expect(r.status).toBe(1);
    expect(r.stdout).toContain("cau giao khac de bai: agent 2");
  });
});

function latestMoc(root: string) {
  const r = spawnSync("ls", [join(root, MOC)], { encoding: "utf8" });
  return r.stdout
    .split("\n")
    .filter((n) => n.startsWith("moc-") && !n.endsWith(".json"))
    .sort()
    .at(-1)!;
}

describe("gop", () => {
  it("gop: làm lại theo tầng", () => {
    const root = tempRoot();
    hoSo(root, "a", { lines: [tally(1, "REJECT"), tally(2, "BLOCKED"), tally(3, "PASS")] });
    hoSo(root, "b", { lines: [tally(1, "REJECT"), tally(2, "PASS")] });
    expect(run(root, "ghi", "--slug", "a", "--phan", "r1=trang-thai-hanh-vi,bo-cuc").status).toBe(
      0,
    );
    expect(run(root, "ghi", "--slug", "b", "--phan", "r1=hop-dong-yeu-cau").status).toBe(0);
    mkdirSync(join(root, MOC), { recursive: true });
    cpSync(join(ROOT, MOC, "moc-quy-hang.json"), join(root, MOC, "moc-quy-hang.json"));
    const r = run(root, "gop", "--json");
    expect(r.status, r.stderr).toBe(0);
    const g = JSON.parse(r.stdout);
    expect(g.vong).toBe(2);
    expect(g.luot_cham_tb).toBe(2.5);
    expect(g.tong).toBe(4);
    expect(g.lam_lai.map((x: { tang: string }) => x.tang)).toEqual(TANG);
    const by = Object.fromEntries(g.lam_lai.map((x: { tang: string }) => [x.tang, x]));
    expect(by["trang-thai-hanh-vi"].so).toBe(1);
    expect(by["bai-kiem-ha-tang"].so).toBe(1);
    const sum = g.lam_lai.reduce((s: number, x: { pt_tat_ca: number }) => s + x.pt_tat_ca, 0);
    expect(Math.abs(sum - 100)).toBeLessThanOrEqual(1);
    expect(by["bai-kiem-ha-tang"].pt_doi_san_pham).toBeNull();
    expect(by["hop-dong-yeu-cau"].pt_doi_san_pham).toBeNull();
    expect(by["trang-thai-hanh-vi"].pt_doi_san_pham).toBe(50);
    expect(Math.round(by["bai-kiem-ha-tang"].pt_quy_hang)).toBe(55);

    const text = run(root, "gop");
    for (const t of TANG) expect(text.stdout).toContain(t);
    expect(text.stdout).toContain("2 vong");
    expect(text.stdout).toContain("luot cham trung binh 2.5");

    const empty = tempRoot();
    const e = run(empty, "gop");
    expect(e.status).toBe(0);
    expect(e.stdout).toContain("chua co vong nao");
  });

  it("mốc Quỹ hàng khớp 0019", () => {
    const qh = JSON.parse(readFileSync(join(ROOT, MOC, "moc-quy-hang.json"), "utf8"))
      .theo_tang as Record<string, number>;
    expect(Object.keys(qh).sort()).toEqual([...TANG].sort());
    const total = Object.values(qh).reduce((s, v) => s + v, 0);
    expect(total).toBe(199);
    const pct = (t: string) => Math.round((100 * qh[t]!) / total);
    expect(pct("bai-kiem-ha-tang")).toBe(55);
    expect(pct("trang-thai-hanh-vi")).toBe(15);
    expect(pct("thanh-phan")).toBe(5);
    expect(pct("mau-token")).toBe(0);
  });

  it("gop: quyết định có kiểm theo tầng", () => {
    const real = JSON.parse(run(ROOT, "gop", "--json").stdout);
    const dc = spawnSync("python3", [join(ROOT, "tools/design_check.py"), "--root", ROOT], {
      encoding: "utf8",
    });
    const m = /determinism: (\d+)\/(\d+)/.exec(dc.stdout);
    expect(m, dc.stdout).not.toBeNull();
    expect(real.quyet_dinh_tong).toEqual({ co_kiem: Number(m![1]), tong: Number(m![2]) });

    const root = tempRoot();
    mkdirSync(join(root, "design"));
    mkdirSync(join(root, "tests"));
    writeFileSync(join(root, "tests/a.test.ts"), "// decision:a\n");
    writeFileSync(
      join(root, "design/decisions.yaml"),
      "decisions:\n" +
        "  - { id: a, layer: patterns, kind: closed, source: s, check: 'test:tests/a.test.ts' }\n" +
        "  - { id: b, layer: patterns, kind: closed, source: s, check: 'test:tests/missing.test.ts' }\n",
    );
    const g = JSON.parse(run(root, "gop", "--json").stdout);
    expect(g.quyet_dinh).toEqual([{ tang: "patterns", co_kiem: 1, tong: 2 }]);
  });
});

describe("kiem-moc", () => {
  function mocRepo() {
    const root = mkdtempSync(join(tmpdir(), "round-metrics-moc-"));
    git(root, "init", "-q");
    writeFileSync(join(root, "README.md"), "x\n");
    git(root, "add", ".");
    git(root, "commit", "-qm", "base");
    const base = git(root, "rev-parse", "HEAD");
    cpSync(join(ROOT, MOC), join(root, MOC), { recursive: true });
    const name = latestMoc(root);
    const mocPath = join(root, MOC, name, "moc.json");
    const moc = JSON.parse(readFileSync(mocPath, "utf8"));
    moc.commit = base;
    writeFileSync(mocPath, JSON.stringify(moc, null, 2));
    git(root, "add", ".");
    git(root, "commit", "-qm", "moc");
    return { root, base, name, mocPath, moc };
  }

  it("kiem-moc: mốc thật xanh và sáu lần phá", () => {
    expect(run(ROOT, "kiem-moc").status).toBe(0);
    const ok = mocRepo();
    const g = run(ok.root, "kiem-moc");
    expect(g.status, g.stdout).toBe(0);

    const cases: [string, (c: ReturnType<typeof mocRepo>) => void][] = [
      [
        "can dung 3 agent",
        (c) =>
          writeFileSync(c.mocPath, JSON.stringify({ ...c.moc, agent: c.moc.agent.slice(0, 2) })),
      ],
      [
        "tep phuong an trung",
        (c) =>
          writeFileSync(
            c.mocPath,
            JSON.stringify({
              ...c.moc,
              agent: [
                c.moc.agent[0],
                { ...c.moc.agent[1], tep: c.moc.agent[0].tep },
                c.moc.agent[2],
              ],
            }),
          ),
      ],
      ["tep phuong an rong", (c) => writeFileSync(join(c.root, c.moc.agent[2].tep), "")],
      ["thieu bang so", (c) => rmSync(join(c.root, c.moc.bang_so))],
      [
        "cau giao khac de bai: agent 2",
        (c) => {
          const p = join(c.root, c.moc.agent[1].tep);
          writeFileSync(p, readFileSync(p, "utf8").replace("lập phương án", "lập kế hoạch"));
        },
      ],
      [
        "commit khong co",
        (c) => writeFileSync(c.mocPath, JSON.stringify({ ...c.moc, commit: "0".repeat(40) })),
      ],
      [
        "do sau khi 1a gop",
        (c) => {
          mkdirSync(join(c.root, "_acceptance/khung-va-giao-dien"), { recursive: true });
          writeFileSync(
            join(c.root, "_acceptance/khung-va-giao-dien/contract.md"),
            "---\nstatus: signed-off\n---\n",
          );
          git(c.root, "add", ".");
          git(c.root, "commit", "-qm", "1a");
          writeFileSync(
            c.mocPath,
            JSON.stringify({ ...c.moc, commit: git(c.root, "rev-parse", "HEAD") }),
          );
        },
      ],
      [
        "do sau khi 1a gop",
        (c) => {
          mkdirSync(join(c.root, "_acceptance/khung-va-giao-dien"), { recursive: true });
          writeFileSync(
            join(c.root, "_acceptance/khung-va-giao-dien/contract.md"),
            "---\nstatus: da-cham-boi-thuc-te\n---\n",
          );
          git(c.root, "add", ".");
          git(c.root, "commit", "-qm", "1a shipped");
          writeFileSync(
            c.mocPath,
            JSON.stringify({ ...c.moc, commit: git(c.root, "rev-parse", "HEAD") }),
          );
        },
      ],
      [
        "ban kho co san phuong an",
        (c) =>
          writeFileSync(
            c.mocPath,
            JSON.stringify({ ...c.moc, commit: git(c.root, "rev-parse", "HEAD") }),
          ),
      ],
      ["moc.json hong", (c) => writeFileSync(c.mocPath, "{khong phai json")],
    ];
    for (const [message, breakIt] of cases) {
      const c = mocRepo();
      breakIt(c);
      const r = run(c.root, "kiem-moc");
      expect(r.status, message).toBe(1);
      expect(r.stdout, message).toContain(message);
    }
  });

  it("kiem-moc: 1a còn trước Cổng Bằng chứng thì xanh", () => {
    for (const status of ["draft", "approved", "implemented", "verified"]) {
      const root = mkdtempSync(join(tmpdir(), "round-metrics-1a-"));
      git(root, "init", "-q");
      mkdirSync(join(root, "_acceptance/khung-va-giao-dien"), { recursive: true });
      writeFileSync(
        join(root, "_acceptance/khung-va-giao-dien/contract.md"),
        `---\nstatus: ${status}\n---\n`,
      );
      git(root, "add", ".");
      git(root, "commit", "-qm", "1a in progress");
      const base = git(root, "rev-parse", "HEAD");
      cpSync(join(ROOT, MOC), join(root, MOC), { recursive: true });
      const mocPath = join(root, MOC, latestMoc(root), "moc.json");
      writeFileSync(
        mocPath,
        JSON.stringify({ ...JSON.parse(readFileSync(mocPath, "utf8")), commit: base }),
      );
      const r = run(root, "kiem-moc");
      expect(r.status, `${status}: ${r.stdout}`).toBe(0);
    }
  });

  it("gop: khối mốc khớp moc.json", () => {
    const moc = JSON.parse(readFileSync(join(ROOT, MOC, latestMoc(ROOT), "moc.json"), "utf8"));
    const g = JSON.parse(run(ROOT, "gop", "--json").stdout).moc;
    expect(g.commit).toBe(moc.commit);
    expect([g.giong, g.giong_mang_loi, g.lech]).toEqual([
      moc.ket_qua.bat_buoc.giong,
      moc.ket_qua.bat_buoc.giong_mang_loi,
      moc.ket_qua.bat_buoc.lech,
    ]);
    expect(g.tu_doan).toEqual(
      moc.agent.map((a: { so: number; tu_doan_he: number; tu_doan_san_pham: number }) => ({
        so: a.so,
        he: a.tu_doan_he,
        san_pham: a.tu_doan_san_pham,
      })),
    );
  });
});
