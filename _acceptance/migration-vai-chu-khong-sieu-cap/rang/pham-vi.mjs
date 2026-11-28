#!/usr/bin/env node
// Phạm vi PR #135 (hồ sơ migration-vai-chu-khong-sieu-cap, AC-6). So với điểm rẽ của nhánh với origin/main:
//   - mọi tệp dưới db/migrations/ đều là tệp THÊM (A) — không migration đã commit nào bị sửa, đổi tên hay xoá;
//   - ngoài hồ sơ _acceptance/ và hai trang máy vẽ (PRODUCT-MAP.md, LO-TRINH.html), chỉ có đúng các tệp của thiết kế.
//
//   node _acceptance/migration-vai-chu-khong-sieu-cap/rang/pham-vi.mjs            # đo nhánh hiện tại
//   node _acceptance/migration-vai-chu-khong-sieu-cap/rang/pham-vi.mjs --tu-kiem  # vật lành xanh, ba bản phá đỏ
import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const git = (...a) => execFileSync("git", a, { cwd: ROOT, encoding: "utf8" });

const DESIGN = [
  "db/migrations/001_vai_chu_khong_sieu_cap.sql",
  "db/migrations/004_thu_quyen_tao_cua_vai_danh_tinh.sql",
  "tests/db/chu-khong-sieu-cap.db.test.ts",
  "wiki/decisions/0052-migration-chay-bang-vai-chu-khong-sieu-cap.md",
];
const OK_GLOBS = [/^_acceptance\//, /^wiki\/log\/[^/]+\.md$/, /^PRODUCT-MAP\.md$/, /^LO-TRINH\.html$/];

/** `git diff --name-status` lines → list of pinned red lines (empty = green). */
export function check(text) {
  const rows = text
    .split("\n")
    .filter(Boolean)
    .map((l) => l.split("\t"));
  const errs = [];
  const paths = new Set();
  for (const [st, ...p] of rows) {
    for (const f of p) paths.add(f);
    for (const f of p)
      if (f.startsWith("db/migrations/") && st !== "A") errs.push(`migration đã commit bị sửa: ${f} (${st})`);
    const f = p.at(-1);
    if (!DESIGN.includes(f) && !OK_GLOBS.some((g) => g.test(f))) errs.push(`PR chạm tệp ngoài phạm vi: ${f}`);
  }
  for (const f of DESIGN) if (!paths.has(f)) errs.push(`PR thiếu tệp của thiết kế: ${f}`);
  return { errs, n: rows.length };
}

const base = git("merge-base", "origin/main", "HEAD").trim();
const real = git("diff", "--name-status", "-M", base, "HEAD");

if (process.argv.includes("--tu-kiem")) {
  // Fixtures are the real git output (round trip), each broken in one place.
  const cases = [
    ["vat-lanh", real, null],
    ["pha-sua-migration-cu", real + "M\tdb/migrations/002_dang_nhap_ma_email.sql\n", "migration đã commit bị sửa: db/migrations/002_dang_nhap_ma_email.sql (M)"],
    ["pha-tep-ngoai", real + "M\tsrc/app/page.tsx\n", "PR chạm tệp ngoài phạm vi: src/app/page.tsx"],
    [
      "pha-thieu-004",
      real.split("\n").filter((l) => !l.endsWith("004_thu_quyen_tao_cua_vai_danh_tinh.sql")).join("\n"),
      "PR thiếu tệp của thiết kế: db/migrations/004_thu_quyen_tao_cua_vai_danh_tinh.sql",
    ],
  ];
  let good = 0;
  for (const [name, text, pinned] of cases) {
    const { errs } = check(text);
    const ok = pinned === null ? errs.length === 0 : errs.includes(pinned);
    console.log(`${ok ? "ok" : "DO"} ${name} — ${errs[0] ?? "xanh"}`);
    if (ok) good++;
  }
  console.log(`tu-kiem: ${good}/${cases.length} ca đúng`);
  process.exit(good === cases.length ? 0 : 1);
}

const { errs, n } = check(real);
if (errs.length) {
  for (const e of errs) console.log(e);
  process.exit(1);
}
console.log(`pham-vi ok: ${n} tệp so với ${base.slice(0, 8)}, migration chỉ thêm (2 tệp), ngoài hồ sơ chỉ đúng tệp của thiết kế`);
