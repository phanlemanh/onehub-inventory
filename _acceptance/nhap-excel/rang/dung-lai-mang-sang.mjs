#!/usr/bin/env node
// Row 11 (nhap-excel), ruling G-2811-101: round 12's summary wrote the verdict cells of the four carried evals as
// «PASS (carry-forward rN)» and wrote their evidence blocks as one carry-forward line instead of the run. This puts each
// carried eval's evidence block back exactly as its source round wrote it in git, adding only `carried_from_round: <N>`,
// sets each verdict cell of the table to the verdict word alone, and checks every block's verifier with the kit's own
// checker. The same method as VP10's `_acceptance/khung-luoi-va-ngan-chi-tiet/rang/dung-lai-mang-sang.mjs`.
//
//   node _acceptance/nhap-excel/rang/dung-lai-mang-sang.mjs --report <in> --out <out> --table <md>
//
// Exit 0 when every carried block was found whole in git, is the run itself (not carried again), matches its source
// field for field, and every block of the result passes isAuthenticVerifier; exit 1 with the eval named otherwise
// (nothing is written then). The source of each eval is the last round it truly ran in, and the commit of that report.
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";

const SLUG = "nhap-excel";
const DIR = `_acceptance/${SLUG}`;
/** Each carried eval: the round it last truly ran in, and the commit holding that round's report. */
const SOURCE = {
  E10: [9, "0f8e4c54"],
  E11: [8, "ffb7216f"],
  E19: [6, "849b0cb9"],
  E23: [1, "1feca45a"],
};

const arg = (n) => {
  const i = process.argv.indexOf(n);
  return i > 0 ? process.argv[i + 1] : undefined;
};
const fail = (msg) => {
  console.error(`dung-lai-mang-sang: ${msg}`);
  process.exit(1);
};

const root = execFileSync("git", ["rev-parse", "--show-toplevel"], { encoding: "utf8" }).trim();
const kit = process.env.CLAUDE_PLUGIN_ROOT ?? resolve(process.env.HOME ?? "", "dev/delivery-loop/plugins/acceptance-gate");
const ec = createRequire(import.meta.url)(resolve(kit, "lib/evidence-core.cjs"));
const cfgPath = resolve(root, "_acceptance/config.yaml");
const cfgText = readFileSync(cfgPath, "utf8");

/** The evidence block of `id` in `text`: the `- eval: <id>` line and its indented lines, as written. */
function block(text, id) {
  const m = text.match(new RegExp(`^- eval: ${id}\\n(?:(?:  |    ).*\\n)*`, "m"));
  return m ? m[0] : null;
}
const field = (b, k) => (b.match(new RegExp(`^  ${k}: (.*)$`, "m")) ?? [])[1];

const inPath = arg("--report");
const outPath = arg("--out");
const tablePath = arg("--table");
if (!inPath || !outPath || !tablePath) fail("usage: --report <in> --out <out> --table <md>");
let report = readFileSync(inPath, "utf8");
const rows = [];

for (const [id, [round, commit]] of Object.entries(SOURCE)) {
  let src;
  try {
    src = execFileSync("git", ["show", `${commit}:${DIR}/evidence-report.md`], { cwd: root, encoding: "utf8" });
  } catch {
    fail(`${id}: no report at ${commit}`);
  }
  const orig = block(src, id);
  if (!orig) fail(`${id}: no block in the round-${round} report at ${commit}`);
  if (field(orig, "carried_from_round")) fail(`${id}: the block at ${commit} is itself carried, not the run`);
  if (!new RegExp(`^\\| ${id} \\| [^|]+ \\| [^|]+ \\| PASS \\|`, "m").test(src))
    fail(`${id}: the round-${round} table at ${commit} does not say PASS`);
  const cur = block(report, id);
  if (!cur) fail(`${id}: no block in the report to replace`);
  const said = Number(field(cur, "carried_from_round"));
  if (said !== round) fail(`${id}: the report says carried from round ${said}, the source table says ${round}`);
  const fresh = orig.replace(/\n$/, "") + `\n  carried_from_round: ${round}\n`;
  // Field for field: the rebuilt block is the source block with one line added at the end, nothing else.
  if (fresh.slice(0, orig.length - 1) !== orig.slice(0, -1)) fail(`${id}: the rebuilt block differs from its source`);
  rows.push({ id, round, commit, before: cur, after: fresh, src: orig });
  report = report.replace(cur, fresh);
}

// The table's verdict cells: the verdict word alone, as the report template asks.
report = report.replace(/^(\| E\w+ \| [^|]+ \| [^|]+ \| )(PASS|FAIL|BLOCKED|UNCERTAIN)\b[^|]*\|/gm, "$1$2 |");

// Every block of the result: an authentic verifier.
const ids = [...report.matchAll(/^- eval: (E\w+)$/gm)].map((m) => m[1]);
for (const id of ids) {
  const v = field(block(report, id), "verifier");
  if (v === undefined) continue; // a judgment block carries judges, not a verifier
  const ok = ec.isAuthenticVerifier(v, resolve(root, DIR), cfgPath, cfgText);
  if (!ok.ok) fail(`${id}: ${ok.reason}`);
}

writeFileSync(outPath, report);
// «Khớp» reads the file just written back, not the string built above: each block, its last line removed, against git.
const written = readFileSync(outPath, "utf8");
const match = ({ id, src }) => {
  const b = block(written, id);
  return b !== null && b.replace(/ {2}carried_from_round: \d+\n$/, "") === src;
};
const f = (b, k) => field(b, k) ?? "";
const lines = [
  "# Hàng 11 — khối mang sang: gốc trong git và khối dựng lại",
  "",
  `Script: \`${DIR}/rang/dung-lai-mang-sang.mjs\` (G-2811-101). Mỗi khối mang sang chép nguyên từ báo cáo của vòng nguồn,`,
  "chỉ thêm `carried_from_round`. «Khớp» đọc lại tệp vừa ghi: khối bỏ dòng mang sang thì giống từng ký tự khối gốc trong git.",
  "",
  "| Phép | Vòng nguồn | Commit nguồn | run_id | exit_code | verifier | verified_at | Khớp |",
  "| --- | --- | --- | --- | --- | --- | --- | --- |",
  ...rows.map(
    (r) =>
      `| ${r.id} | ${r.round} | \`${r.commit}\` | ${f(r.after, "run_id")} | ${f(r.after, "exit_code")} | \`${f(r.after, "verifier")}\` | ${f(r.after, "verified_at")} | ${match(r) ? "có" : "KHÔNG"} |`,
  ),
  "",
  "Khối trước khi dựng lại (do lượt tổng hợp của vòng 12 viết), dòng đầu của phần đầu ra:",
  "",
  ...rows.map(({ id, before }) => `- ${id}: \`${(before.match(/carry-forward[^\n]*/) ?? ["—"])[0]}\``),
  "",
];
writeFileSync(tablePath, lines.join("\n"));
console.log(`dung-lai-mang-sang: ${rows.length} khối dựng lại từ nguồn; ${ids.length} khối, mọi verifier hợp lệ`);
