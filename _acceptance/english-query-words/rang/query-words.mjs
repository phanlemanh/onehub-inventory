#!/usr/bin/env node
// english-query-words, E1 / E1-pha / E7 / E15 (AC-7, AC-6, AC-8): no old Vietnamese query word is read or written in the
// code, tests, tools or design notes, outside the pinned keep list.
//
//   node query-words.mjs --root <repo>              «quet: 9 tu x 11 ngu canh x 5 vung · cham: N · giu: K»
//   node query-words.mjs --root <repo> --self-test  every word x context planted in a copy turns it red with its name
//   node query-words.mjs --root <repo> --luu-tru    no new migration; the saved view stores its five keys, no address
//   node query-words.mjs --root <repo> --wiki       entity pages and behaviours use the new words; one log line
import { execFileSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const RANG = "_acceptance/english-query-words/rang";
const args = process.argv.slice(2);
const flag = (f) => args.includes(f);
const rootArg = args.indexOf("--root");
const ROOT = rootArg >= 0 ? args[rootArg + 1] : join(HERE, "../../..");

export const WORDS = ["ma", "toa", "du-an", "ho-so", "vung", "goc-nhin", "vai", "mau", "quyen"];
export const REGIONS = ["src", "tests", "tools/deploy", "tools/e2e_templates", "design"];
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\-]/g, "\\$&");
// The eleven contexts in which a word is read from or written to an address; each has a plant for the self-test.
export const CONTEXTS = [
  { name: "?w=", re: (w) => new RegExp(`\\?${w}=`), plant: (w) => `const plant = "/inventory?${w}=1";` },
  { name: "&w=", re: (w) => new RegExp(`&${w}=`), plant: (w) => `const plant = "/inventory?status=A&${w}=1";` },
  { name: "query.w", re: (w) => new RegExp(`\\bquery\\.${w}(?![\\w-])`), plant: (w) => `const plant = query.${w};` },
  { name: 'query["w"]', re: (w) => new RegExp(`query\\[["'\`]${w}["'\`]\\]`), plant: (w) => `const plant = query["${w}"];` },
  { name: 'get("w")', re: (w) => new RegExp(`\\.get\\(["'\`]${w}["'\`]\\)`), plant: (w) => `const plant = p.get("${w}");` },
  { name: 'getAll("w")', re: (w) => new RegExp(`\\.getAll\\(["'\`]${w}["'\`]\\)`), plant: (w) => `p.getAll("${w}");` },
  { name: 'set("w"', re: (w) => new RegExp(`\\.set\\(["'\`]${w}["'\`],`), plant: (w) => `p.set("${w}", "1");` },
  { name: 'has("w")', re: (w) => new RegExp(`\\.has\\(["'\`]${w}["'\`]\\)`), plant: (w) => `p.has("${w}");` },
  { name: 'delete("w")', re: (w) => new RegExp(`\\.delete\\(["'\`]${w}["'\`]\\)`), plant: (w) => `p.delete("${w}");` },
  { name: 'PARAM = "w"', re: (w) => new RegExp(`PARAM\\s*=\\s*["'\`]${w}["'\`]`), plant: (w) => `export const PLANT_PARAM = "${w}";` },
  {
    // A key of the object an address is built from, or a value of the search kinds' table.
    name: '"w":',
    re: (w) =>
      new RegExp(
        `URLSearchParams\\(\\{[^}]*(["'\`]${w}["'\`]|\\b${w}(?![\\w-]))\\s*:|^\\s*(unit|building|subdivision)\\s*:\\s*["'\`]${w}["'\`]`,
      ),
    plant: (w) => `const plant = new URLSearchParams({ "${w}": "1" });`,
  },
];
// The pinned keep list: exactly these lines may stay in rang/giu.txt (file, literal on the line, reason).
export const PINNED = [
  "tests/e2e-db/bang-hang-that.spec.ts\t?ho-so=${t.id}\tca lien-ket-cu và ảnh cho bàn chấm mở liên kết cũ (AC-4)",
  "tests/e2e/the-dien-thoai.spec.ts\t?mau=bien\tca cong-tac-cu chứng công tắc cũ không còn tác dụng (AC-5)",
  "tests/e2e/behavior.spec.ts\t?quyen=khong\tca quyen-cu chứng công tắc cũ không còn tác dụng (AC-5)",
];

const pattern = (w, c) => c.re(esc(w));

function files(root, rel) {
  const out = [];
  const walk = (dir) => {
    if (!existsSync(dir)) return;
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      if (e.name === "node_modules" || e.name.startsWith(".")) continue;
      const p = join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (/\.(ts|tsx|mjs|js|cjs|yaml|yml|py|sh|json|md)$/.test(e.name)) out.push(p);
    }
  };
  walk(join(root, rel));
  return out;
}

function readKeep(root) {
  const p = join(root, RANG, "giu.txt");
  return existsSync(p) ? readFileSync(p, "utf8").split("\n").filter((l) => l.trim() && !l.startsWith("#")) : [];
}

/** Hits outside the keep list, the number kept, and whether giu.txt is the pinned list. */
export function scan(root) {
  const keepLines = readKeep(root);
  const pinnedOk = keepLines.length === PINNED.length && PINNED.every((l, i) => keepLines[i] === l);
  const keep = keepLines.map((l) => l.split("\t")).map(([file, literal]) => ({ file, literal }));
  const hits = [];
  let kept = 0;
  for (const region of REGIONS) {
    for (const p of files(root, region)) {
      const rel = relative(root, p);
      readFileSync(p, "utf8")
        .split("\n")
        .forEach((line, i) => {
          for (const w of WORDS)
            for (const c of CONTEXTS) {
              if (!pattern(w, c).test(line)) continue;
              if (keep.some((k) => k.file === rel && line.includes(k.literal))) {
                kept += 1;
                continue;
              }
              hits.push(`chu-cu: ${w} ${c.name} — ${rel}:${i + 1}: ${line.trim().slice(0, 120)}`);
            }
        });
    }
  }
  return { hits, kept, pinnedOk };
}

function report(root) {
  const { hits, kept, pinnedOk } = scan(root);
  for (const h of hits) console.log(h);
  if (!pinnedOk) console.log("giu: lech danh sach ghim");
  console.log(
    `quet: ${WORDS.length} tu x ${CONTEXTS.length} ngu canh x ${REGIONS.length} vung · cham: ${hits.length} · giu: ${kept}`,
  );
  return hits.length === 0 && pinnedOk;
}

// One file per region to plant into; a cell's copy holds that file and the keep list, nothing else.
const PLANT_FILES = [
  "src/modules/listings/ui/geo-tree.ts",
  "tests/old-query-words.test.ts",
  "tools/deploy/thu-ban-dung.sh",
  "tools/e2e_templates/suite.ts",
  "design/behaviors.md",
];

function copyWith(root, file) {
  const dir = mkdtempSync(join(tmpdir(), "query-words-"));
  mkdirSync(dirname(join(dir, file)), { recursive: true });
  cpSync(join(root, file), join(dir, file));
  cpSync(join(root, RANG), join(dir, RANG), { recursive: true });
  return dir;
}

function selfTest(root) {
  if (!report(root)) {
    console.log("self-test: cay that khong xanh");
    return false;
  }
  let ok = 0;
  let n = 0;
  const regions = new Set();
  for (const w of WORDS)
    for (const c of CONTEXTS) {
      const file = PLANT_FILES[n % PLANT_FILES.length];
      n += 1;
      const dir = copyWith(root, file);
      const p = join(dir, file);
      writeFileSync(p, `${readFileSync(p, "utf8")}\n${c.plant(w)}\n`);
      const want = `chu-cu: ${w} ${c.name} — ${file}`;
      if (scan(dir).hits.some((h) => h.startsWith(want))) {
        ok += 1;
        regions.add(REGIONS.find((r) => file.startsWith(`${r}/`)));
        console.log(`do dung cho: ${want}`);
      } else console.log(`KHONG do: ${want}`);
    }
  const dir = copyWith(root, PLANT_FILES[0]);
  const g = join(dir, RANG, "giu.txt");
  writeFileSync(g, `${readFileSync(g, "utf8")}src/app/(app)/nav.ts\t?vung=\tthem len\n`);
  n += 1;
  if (!scan(dir).pinnedOk) {
    ok += 1;
    console.log("do dung cho: giu: lech danh sach ghim");
  } else console.log("KHONG do: giu.txt them dong ma van khop ghim");
  console.log(`vung da cay: ${regions.size}/${REGIONS.length}`);
  console.log(`self-test: ${ok}/${n} do dung cho`);
  return ok === n && regions.size === REGIONS.length;
}

function storage(root) {
  const git = (...a) => execFileSync("git", ["-C", root, ...a], { encoding: "utf8" }).trim();
  let base = "";
  for (const ref of ["origin/main", "main"]) {
    try {
      base = git("merge-base", "HEAD", ref);
      break;
    } catch {
      // try the next name of the main branch
    }
  }
  if (!base) {
    console.log("luu-tru: khong tim duoc nhanh chinh");
    return false;
  }
  const added = git("diff", "--name-only", "--diff-filter=A", base, "HEAD", "--", "db/migrations")
    .split("\n")
    .filter(Boolean);
  const sql = readFileSync(join(root, "db/migrations/009_goc_nhin.sql"), "utf8");
  const keys = (sql.match(/view \?& array\[([^\]]*)\]/)?.[1] ?? "").replace(/['\s]/g, "");
  const want = "query,filters,sort,grouped,hidden";
  console.log(`luu-tru: ${added.length} migration moi so voi nhanh chinh · saved_view.view: ${keys}`);
  for (const f of added) console.log(`migration moi: ${f}`);
  return added.length === 0 && keys === want;
}

function wiki(root) {
  const pages = [
    ...readdirSync(join(root, "wiki/entities")).map((f) => `wiki/entities/${f}`),
    "design/behaviors.md",
  ];
  const old = new RegExp(`[?&](${WORDS.map(esc).join("|")})=`);
  const stale = pages.filter((f) => old.test(readFileSync(join(root, f), "utf8")));
  const logDir = join(root, "wiki/log");
  const logs = readdirSync(logDir).filter((f) => readFileSync(join(logDir, f), "utf8").includes("english-query-words"));
  for (const f of stale) console.log(`tu cu: ${f}`);
  const entities = stale.filter((f) => f.startsWith("wiki/")).length;
  console.log(
    `wiki: ${entities} trang thuc the tro tu cu · behaviors: ${stale.length - entities} tu cu · nhat ky: ${logs.length} dong english-query-words`,
  );
  return stale.length === 0 && logs.length === 1;
}

const ok = flag("--self-test")
  ? selfTest(ROOT)
  : flag("--luu-tru")
    ? storage(ROOT)
    : flag("--wiki")
      ? wiki(ROOT)
      : report(ROOT);
process.exit(ok ? 0 : 1);
