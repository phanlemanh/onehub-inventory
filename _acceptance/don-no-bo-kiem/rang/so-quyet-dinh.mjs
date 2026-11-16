// Row 1u, E6 (AC-6): the 1q decision page carries 0042 (file and title), is in the wiki index, no tracked file links
// the old path, and no number is used twice. Two-way: the same check on a copy whose log still links the old path.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.argv.includes("--root") ? process.argv[process.argv.indexOf("--root") + 1] : ".";
const OLD = "0034-cong-bat-khoi-khong-ke";
const NEW = "wiki/decisions/0042-cong-bat-khoi-khong-ke.md";
const OWN = ["_acceptance/don-no-bo-kiem/", "tests/wiki-lint-so-trung.test.ts", "docs/superpowers/specs/2026-11-15-don-no-bo-kiem", "docs/superpowers/plans/2026-11-15-don-no-bo-kiem"];

function check(files, read) {
  const p = [];
  if (!files.includes(NEW)) p.push("so-quyet-dinh: thieu trang 0042");
  else if (!/^# 0042 /m.test(read(NEW))) p.push("so-quyet-dinh: tieu de trang khong mang 0042");
  if (!read("wiki/index.md").includes("(decisions/0042-cong-bat-khoi-khong-ke.md)")) p.push("so-quyet-dinh: muc luc thieu 0042");
  for (const f of files) {
    if (OWN.some((o) => f.startsWith(o)) || /\.(png|jpg|ico|woff2?)$/.test(f)) continue;
    if (read(f).includes(OLD)) p.push(`so-quyet-dinh: lien ket cu o ${f}`);
  }
  const nums = {};
  for (const f of files.filter((f) => /^wiki\/decisions\/\d{4}-/.test(f))) {
    const n = f.slice(15, 19);
    (nums[n] ??= []).push(f);
  }
  for (const [n, fs] of Object.entries(nums)) if (fs.length > 1) p.push(`so-quyet-dinh: so ${n} trung: ${fs.join(", ")}`);
  return p;
}

const files = execFileSync("git", ["ls-files", "--cached", "--others", "--exclude-standard"], { cwd: root, encoding: "utf8" })
  .split("\n")
  .filter((f) => f && existsSync(join(root, f)));
const read = (f) => readFileSync(join(root, f), "utf8");
const real = check(files, read);
const broken = check(files, (f) => (f === "wiki/log.md" ? `${read(f)}\n[0034](decisions/${OLD}.md)\n` : read(f)));
const out = [...real];
if (!broken.includes("so-quyet-dinh: lien ket cu o wiki/log.md")) out.push("so-quyet-dinh: ban sao con lien ket cu ma khong do");
if (out.length) {
  console.log(out.join("\n"));
  process.exit(1);
}
console.log("so-quyet-dinh: 0042-cong-bat-khoi-khong-ke.md co trong muc luc, khong lien ket cu, khong so trung");
