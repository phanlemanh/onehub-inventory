#!/usr/bin/env node
// Scope of PR #134 (record dat-khoa-cau-hoi-hien, AC-5), against the fork point of the branch with origin/main:
//   - besides the record _acceptance/, one wiki/log/ entry and the two machine-drawn pages, the PR touches only tools/deploy/dat-khoa.mjs and its
//     new test tools/deploy/dat-khoa-ask.test.ts;
//   - inside dat-khoa.mjs every changed line lies in the asking function terminalAsk — the checks, the questions and
//     the way values go to `gh secret set` are unchanged.
//
//   node pham-vi.mjs            measure the current branch
//   node pham-vi.mjs --tu-kiem  healthy input green, three breaks of the real git output red with their pinned message
import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const git = (...a) => execFileSync("git", a, { cwd: ROOT, encoding: "utf8" });
const SOURCE = "tools/deploy/dat-khoa.mjs";
const DESIGN = [SOURCE, "tools/deploy/dat-khoa-ask.test.ts"];
// The two pages the machine redraws when a gate closes (product map, roadmap page) belong to the record's commits.
const OK_GLOBS = [/^_acceptance\/dat-khoa-cau-hoi-hien\//, /^wiki\/log\/[^/]+\.md$/, /^PRODUCT-MAP\.md$/, /^LO-TRINH\.html$/];

/** Lines [from, to] of terminalAsk in a version of the source. */
function askSpan(text) {
  const lines = text.split("\n");
  const from = lines.findIndex((l) => l.startsWith("export function terminalAsk")) + 1;
  const to = lines.findIndex((l) => l.startsWith("export async function datKhoa")) + 1;
  if (from < 1 || to <= from) throw new Error("không tìm thấy hàm terminalAsk trong mã");
  return [from - 6, to - 1]; // the doc comment above the function belongs to it
}

/** Changed line ranges of the new version from `git diff -U0` hunk headers. */
function hunks(diff) {
  return [...diff.matchAll(/^@@ -\d+(?:,\d+)? \+(\d+)(?:,(\d+))? @@/gm)].map((m) => {
    const start = Number(m[1]);
    const len = m[2] === undefined ? 1 : Number(m[2]);
    return [start, start + Math.max(len, 1) - 1];
  });
}

/** name-status + source hunks → pinned red lines (empty = green). */
export function check(nameStatus, diff, span) {
  const rows = nameStatus
    .split("\n")
    .filter(Boolean)
    .map((l) => l.split("\t"));
  const errs = [];
  const paths = new Set();
  for (const [, ...p] of rows) {
    const f = p.at(-1);
    paths.add(f);
    if (!DESIGN.includes(f) && !OK_GLOBS.some((g) => g.test(f))) errs.push(`PR chạm tệp ngoài phạm vi: ${f}`);
  }
  for (const f of DESIGN) if (!paths.has(f)) errs.push(`PR thiếu tệp của thiết kế: ${f}`);
  for (const [a, b] of hunks(diff))
    if (a < span[0] || b > span[1]) errs.push(`dat-khoa.mjs đổi ngoài hàm hỏi: dòng ${a}–${b}`);
  return { errs, n: rows.length };
}

const base = git("merge-base", "origin/main", "HEAD").trim();
const realNames = git("diff", "--name-status", "-M", base, "HEAD");
const realDiff = git("diff", "-U0", base, "HEAD", "--", SOURCE);
const span = askSpan(git("show", `HEAD:${SOURCE}`));

if (process.argv.includes("--tu-kiem")) {
  // Fixtures are the real git output (round trip), each broken in one place.
  const outside = `@@ -20,0 +20,1 @@\n+export const SHARED = ["VERCEL_TOKEN", "X"];\n`;
  const cases = [
    ["vat-lanh", realNames, realDiff, null],
    ["pha-tep-ngoai", `${realNames}M\tmk/deploy.mk\n`, realDiff, "PR chạm tệp ngoài phạm vi: mk/deploy.mk"],
    [
      "pha-thieu-bai-kiem",
      realNames
        .split("\n")
        .filter((l) => !l.endsWith("dat-khoa-ask.test.ts"))
        .join("\n"),
      realDiff,
      "PR thiếu tệp của thiết kế: tools/deploy/dat-khoa-ask.test.ts",
    ],
    ["pha-doi-ngoai-ham", realNames, realDiff + outside, "dat-khoa.mjs đổi ngoài hàm hỏi: dòng 20–20"],
  ];
  let good = 0;
  for (const [name, names, diff, pinned] of cases) {
    const { errs } = check(names, diff, span);
    const ok = pinned === null ? errs.length === 0 : errs.includes(pinned);
    console.log(`${ok ? "ok" : "DO"} ${name} — ${errs[0] ?? "xanh"}`);
    if (ok) good++;
  }
  console.log(`tu-kiem: ${good}/${cases.length} ca đúng`);
  process.exit(good === cases.length ? 0 : 1);
}

const { errs, n } = check(realNames, realDiff, span);
if (errs.length) {
  for (const e of errs) console.log(e);
  process.exit(1);
}
console.log(
  `pham-vi ok: ${n} tệp so với ${base.slice(0, 8)}; ngoài hồ sơ chỉ dat-khoa.mjs, bài kiểm mới và một dòng nhật ký; ` +
    `mọi dòng đổi của dat-khoa.mjs nằm trong hàm hỏi (dòng ${span[0]}–${span[1]})`,
);
