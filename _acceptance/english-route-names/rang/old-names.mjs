#!/usr/bin/env node
// english-route-names, E1 / E1-pha / E13 (AC-8, AC-9): no old Vietnamese address, query word, part name or screen id
// is left in the code, outside the pinned keep list.
//
//   node old-names.mjs --root <repo>              scan: «quet: 10 mau x 4 vung · cham: N · giu: K», then «luu-tru: …»
//   node old-names.mjs --root <repo> --self-test  each pattern planted in a copy must turn it red with its own name
//   node old-names.mjs --root <repo> --wiki       the wiki's entity pages and log follow the new addresses
import { cpSync, existsSync, mkdtempSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const flag = (f) => args.includes(f);
const rootArg = args.indexOf("--root");
const ROOT = rootArg >= 0 ? args[rootArg + 1] : join(HERE, "../../..");

export const REGIONS = ["src", "design/screens", "tools/e2e_templates", "tests"];
// One pattern per line of the contract's old → new table. `proto` patterns count only on a line that names /proto/.
export const PATTERNS = [
  { name: "/tuy-chinh-san", re: /\/tuy-chinh-san/ },
  { name: "?phan=", re: /[?&]phan=/ },
  { name: "proto/bo-nut-theo-quyen", re: /proto\/bo-nut-theo-quyen/ },
  { name: "proto-bo-nut", re: /\bproto-bo-nut\b/ },
  { name: "?bang=", re: /[?&]bang=/, proto: true },
  { name: "?man=", re: /[?&]man=/, proto: true },
  { name: "?mo=", re: /[?&]mo=/, proto: true },
  {
    name: "ten phan cu",
    re: /(data-part=|openPart\([^,()]+, |case |=== |show\()"(nhan|truong|tu-dien|can-cho|mau|thue-phi)"/,
  },
  { name: "tep so man cu", re: /design\/screens\/(tuy-chinh-san|proto-bo-nut)\.yaml/ },
  { name: "doc khoa phan", re: /\.phan\b|\["phan"\]/ },
];
// The pinned keep list: exactly these lines may stay in rang/giu.txt (file, literal on the line, reason).
export const PINNED = [
  "tests/e2e-db/lop-rieng.spec.ts\t${OUT}/tuy-chinh-san-\tảnh bằng chứng mà _acceptance/lop-rieng-cua-san/chung-minh-man.md trích",
  "tests/e2e/bo-nut.spec.ts\t/tuy-chinh-san\tca dia-chi-cu-khong-con mở địa chỉ cũ để chứng nó không còn",
  "tests/e2e/bo-nut.spec.ts\t/proto/bo-nut-theo-quyen\tca dia-chi-cu-khong-con mở địa chỉ cũ để chứng nó không còn",
  "tests/company-layer-route.test.ts\t?phan=\tca doc-phan chứng ?phan= không còn được đọc",
  "tests/e2e-db/lop-rieng.spec.ts\t?phan=\tca phan-cu-khong-doc chứng ?phan= không còn được đọc",
  "design/screens/proto-permitted-actions.yaml\tproto-bo-nut\tkhoá old_ids của sổ màn: hồ sơ đã ký còn khai mã cũ",
];

function files(root, rel) {
  const out = [];
  const walk = (dir) => {
    if (!existsSync(dir)) return;
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      if (e.name === "node_modules" || e.name.startsWith(".")) continue;
      const p = join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (/\.(ts|tsx|mjs|js|cjs|yaml|yml|py|sh|json)$/.test(e.name)) out.push(p);
    }
  };
  walk(join(root, rel));
  return out;
}

function readKeep(root) {
  const p = join(root, "_acceptance/english-route-names/rang/giu.txt");
  const lines = existsSync(p)
    ? readFileSync(p, "utf8").split("\n").filter((l) => l.trim() && !l.startsWith("#"))
    : [];
  return lines;
}

/** Hits outside the keep list, the number kept, and whether giu.txt is the pinned list. */
export function scan(root) {
  const keepLines = readKeep(root);
  const pinnedOk =
    keepLines.length === PINNED.length && PINNED.every((l, i) => keepLines[i] === l);
  const keep = keepLines.map((l) => l.split("\t")).map(([file, literal]) => ({ file, literal }));
  const hits = [];
  let kept = 0;
  for (const region of REGIONS) {
    for (const p of files(root, region)) {
      const rel = relative(root, p);
      if (rel === "design/screens.yaml") continue;
      const lines = readFileSync(p, "utf8").split("\n");
      lines.forEach((line, i) => {
        for (const pat of PATTERNS) {
          if (pat.proto && !line.includes("/proto/")) continue;
          if (!pat.re.test(line)) continue;
          if (keep.some((k) => k.file === rel && line.includes(k.literal))) {
            kept += 1;
            continue;
          }
          hits.push(`chu-cu: ${pat.name} — ${rel}:${i + 1}: ${line.trim().slice(0, 120)}`);
        }
      });
    }
  }
  for (const name of ["tuy-chinh-san", "proto-bo-nut"])
    if (existsSync(join(root, `design/screens/${name}.yaml`)))
      hits.push(`chu-cu: tep so man cu — design/screens/${name}.yaml`);
  return { hits, kept, pinnedOk };
}

function storage(root) {
  const dir = join(root, "db/migrations");
  const bad = existsSync(dir)
    ? readdirSync(dir)
        .filter((f) => f.endsWith(".sql"))
        .filter((f) => /tuy-chinh-san|[?&]phan=|\/company-layer/.test(readFileSync(join(dir, f), "utf8")))
    : [];
  return bad;
}

function report(root) {
  const { hits, kept, pinnedOk } = scan(root);
  for (const h of hits) console.log(h);
  if (!pinnedOk) console.log("giu: lech danh sach ghim");
  console.log(`quet: ${PATTERNS.length} mau x ${REGIONS.length} vung · cham: ${hits.length} · giu: ${kept}`);
  const bad = storage(root);
  console.log(`luu-tru: ${bad.length} bang luu dia chi${bad.length ? ` (${bad.join(", ")})` : ""}`);
  return hits.length === 0 && pinnedOk && bad.length === 0;
}

function copyTree(root) {
  const dir = mkdtempSync(join(tmpdir(), "old-names-"));
  for (const r of [...REGIONS, "_acceptance/english-route-names/rang"])
    if (existsSync(join(root, r))) cpSync(join(root, r), join(dir, r), { recursive: true });
  return dir;
}

// Where each pattern is planted: the ten plants spread over the four regions.
const PLANTS = [
  ["src/app/(app)/nav.ts", 'const plant = "/tuy-chinh-san";'],
  ["tests/vong-doi-thao-tac.test.ts", 'const plant = "/company-layer?phan=labels";'],
  ["tools/e2e_templates/recipes.ts", 'const plant = "/proto/bo-nut-theo-quyen";'],
  ["design/screens/company-layer.yaml", "# plant: proto-bo-nut"],
  ["tests/e2e/bo-nut.spec.ts", 'const plant = "/proto/permitted-actions?bang=an";'],
  ["src/app/(app)/proto/permitted-actions/page.tsx", 'const plant = "/proto/x?man=listings";'],
  ["tools/e2e_templates/e2e-templates.test.ts", 'const plant = "/proto/x?mo=menu";'],
  ["src/modules/company-config/ui/fee-part.tsx", 'const plant = <div data-part="thue-phi" />;'],
  ["tests/vai-man-so-man.test.ts", 'const plant = "design/screens/tuy-chinh-san.yaml";'],
  ["src/app/(app)/company-layer/page.tsx", "const plant = query.phan;"],
];

function selfTest(root) {
  let ok = 0;
  const total = PLANTS.length + 1;
  if (!report(root)) {
    console.log("self-test: cay that khong xanh");
    return false;
  }
  const regions = new Set();
  PLANTS.forEach(([file, line], i) => {
    const dir = copyTree(root);
    const p = join(dir, file);
    writeFileSync(p, `${readFileSync(p, "utf8")}\n${line}\n`);
    const { hits } = scan(dir);
    const want = `chu-cu: ${PATTERNS[i].name} — ${file}`;
    if (hits.some((h) => h.startsWith(want))) {
      ok += 1;
      regions.add(REGIONS.find((r) => file.startsWith(r)));
      console.log(`do dung cho: ${want}`);
    } else console.log(`KHONG do: ${want} (${hits.length} cham)`);
  });
  const dir = copyTree(root);
  const g = join(dir, "_acceptance/english-route-names/rang/giu.txt");
  writeFileSync(g, `${readFileSync(g, "utf8")}src/app/(app)/nav.ts\t/tuy-chinh-san\tthem len\n`);
  if (!scan(dir).pinnedOk) {
    ok += 1;
    console.log("do dung cho: giu: lech danh sach ghim");
  } else console.log("KHONG do: giu.txt them dong ma van khop ghim");
  console.log(`vung da cay: ${regions.size}/${REGIONS.length}`);
  console.log(`self-test: ${ok}/${total} do dung cho`);
  return ok === total && regions.size === REGIONS.length;
}

function wiki(root) {
  const dir = join(root, "wiki/entities");
  const stale = readdirSync(dir).filter((f) => /\/tuy-chinh-san|[?&]phan=/.test(readFileSync(join(dir, f), "utf8")));
  const logDir = join(root, "wiki/log");
  const logs = readdirSync(logDir).filter((f) => readFileSync(join(logDir, f), "utf8").includes("english-route-names"));
  for (const f of stale) console.log(`wiki cu: wiki/entities/${f}`);
  console.log(`wiki: ${stale.length} trang thuc the tro dia chi cu · nhat ky: ${logs.length} dong english-route-names`);
  return stale.length === 0 && logs.length === 1;
}

const ok = flag("--self-test") ? selfTest(ROOT) : flag("--wiki") ? wiki(ROOT) : report(ROOT);
process.exit(ok ? 0 : 1);
