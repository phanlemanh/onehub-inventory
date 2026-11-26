#!/usr/bin/env node
// E6 of bien-do-sau-xoay-mat-khau: the step order written outside the code follows STEPS of tools/deploy/len-ban.mjs.
// Three places under --root (default: this repository):
//   (a) wiki/decisions/0048-*.md — exactly one page, `type: decision`, its «- Bản thử:» and «- Bản thật:» lists equal STEPS;
//   (b) docs/van-hanh/README.md, việc 10 — the steps it names appear in STEPS.staging order;
//   (c) tools/deploy/len-ban.mjs — the «staging:» and «production:» header comment lines equal STEPS.
// STEPS is always read from THIS repository's len-ban.mjs (path from this script), never from --root.
// Exit 0 with «ghi-chep: 3 chỗ đạt»; exit 1 with the first pinned message.
// --tu-kiem: three broken copies in a temp dir (header in the old order; README with dung and cach-ly swapped; no 0048
// page) must each exit 1 with their pinned message, and the real tree must pass.
import { cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const { STEPS } = await import(pathToFileURL(join(REPO, "tools/deploy/len-ban.mjs")).href);

const MSG = {
  ok: "ghi-chep: 3 chỗ đạt",
  header: "ghi-chep: chú thích len-ban.mjs lệch STEPS",
  readme: "ghi-chep: README việc 10 lệch STEPS",
  no0048: "ghi-chep: thiếu wiki/decisions/0048-*.md",
  bad0048: "ghi-chep: wiki/decisions/0048 lệch STEPS",
};

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

/** The text after `label` up to the next bullet or blank line. */
function bulletAfter(text, label) {
  const i = text.indexOf(label);
  if (i < 0) return null;
  return text.slice(i + label.length).split(/\n\s*\n|\n- /)[0];
}

function checkDecision(root) {
  const dir = join(root, "wiki/decisions");
  const pages = existsSync(dir) ? readdirSync(dir).filter((f) => /^0048-.*\.md$/.test(f)) : [];
  if (pages.length !== 1) return MSG.no0048;
  const text = readFileSync(join(dir, pages[0]), "utf8");
  if (!/^type: decision$/m.test(text)) return MSG.bad0048;
  const list = (label) => [...(bulletAfter(text, label) ?? "").matchAll(/`([a-z-]+)`/g)].map((m) => m[1]);
  if (!same(list("- Bản thử:"), STEPS.staging) || !same(list("- Bản thật:"), STEPS.production)) return MSG.bad0048;
  return null;
}

function checkReadme(root) {
  const text = readFileSync(join(root, "docs/van-hanh/README.md"), "utf8");
  const start = text.search(/^10\. /m);
  if (start < 0) return MSG.readme;
  const para = text.slice(start).split(/\n\s+- \*\*Đạt khi/)[0];
  const named = [...para.matchAll(/`([a-z-]+)`/g)].map((m) => m[1]).filter((s) => STEPS.staging.includes(s));
  const firsts = named.filter((s, i) => named.indexOf(s) === i);
  if (!firsts.includes("bien") || !firsts.includes("vai-dang-nhap")) return MSG.readme;
  const at = firsts.map((s) => STEPS.staging.indexOf(s));
  return at.every((v, i) => i === 0 || v > at[i - 1]) ? null : MSG.readme;
}

function checkHeader(root) {
  const lines = readFileSync(join(root, "tools/deploy/len-ban.mjs"), "utf8").split("\n");
  const list = (label) => {
    const i = lines.findIndex((l) => l.startsWith(`//   ${label}:`));
    if (i < 0) return [];
    let text = lines[i].slice(lines[i].indexOf(":") + 1);
    for (let j = i + 1; j < lines.length && /^\/\/ {10,}[a-z-]/.test(lines[j]); j++) text += lines[j].slice(2);
    return text
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  };
  return same(list("staging"), STEPS.staging) && same(list("production"), STEPS.production) ? null : MSG.header;
}

function check(root) {
  return checkHeader(root) ?? checkReadme(root) ?? checkDecision(root);
}

function selfCheck() {
  const base = mkdtempSync(join(tmpdir(), "ghi-chep-"));
  const files = ["tools/deploy/len-ban.mjs", "docs/van-hanh/README.md"];
  const decision = readdirSync(join(REPO, "wiki/decisions")).find((f) => /^0048-.*\.md$/.test(f));
  const copy = (name) => {
    const root = join(base, name);
    for (const f of files) {
      mkdirSync(dirname(join(root, f)), { recursive: true });
      cpSync(join(REPO, f), join(root, f));
    }
    mkdirSync(join(root, "wiki/decisions"), { recursive: true });
    if (decision) cpSync(join(REPO, "wiki/decisions", decision), join(root, "wiki/decisions", decision));
    return root;
  };
  const edit = (root, f, fn) => {
    const before = readFileSync(join(root, f), "utf8");
    const after = fn(before);
    if (after === before) throw new Error(`bản phá không đổi ${f}`);
    writeFileSync(join(root, f), after);
  };
  const cases = [
    {
      name: "chú thích thứ tự cũ",
      want: MSG.header,
      make: (root) =>
        edit(root, "tools/deploy/len-ban.mjs", (t) =>
          t.replace("migration, bien, vai-dang-nhap, cach-ly", "migration, vai-dang-nhap, cach-ly, bien"),
        ),
    },
    {
      name: "README hoán dung với cach-ly",
      want: MSG.readme,
      make: (root) =>
        edit(root, "docs/van-hanh/README.md", (t) =>
          t.replace(/^(10\. [\s\S]*?)bước `bien`/m, "$1bước `dung` rồi `cach-ly`, bước `bien`"),
        ),
    },
    {
      name: "thiếu trang 0048",
      want: MSG.no0048,
      make: (root) => rmSync(join(root, "wiki/decisions", decision ?? "none"), { force: true }),
    },
  ];
  let ok = true;
  for (const c of cases) {
    const root = copy(c.name.replace(/\s+/g, "-"));
    try {
      c.make(root);
      const got = check(root);
      const good = got === c.want;
      ok &&= good;
      console.log(`${good ? "đỏ đúng" : "SAI"} · ${c.name}: ${got ?? "(xanh)"}`);
    } catch (err) {
      ok = false;
      console.log(`SAI · ${c.name}: ${err.message}`);
    }
  }
  const real = check(REPO);
  ok &&= real === null;
  console.log(`cây thật: ${real ?? MSG.ok}`);
  rmSync(base, { recursive: true, force: true });
  console.log(ok ? "ghi-chep tu-kiem: 3 bản phá đỏ đúng thông điệp, cây thật đạt" : "ghi-chep tu-kiem: HỎNG");
  return ok ? 0 : 1;
}

const args = process.argv.slice(2);
if (args.includes("--tu-kiem")) process.exit(selfCheck());
const r = args.indexOf("--root");
const root = r >= 0 ? resolve(args[r + 1]) : REPO;
const finding = check(root);
console.log(finding ?? MSG.ok);
process.exit(finding ? 1 : 0);
