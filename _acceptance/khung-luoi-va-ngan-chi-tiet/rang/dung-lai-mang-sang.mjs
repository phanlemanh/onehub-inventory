#!/usr/bin/env node
// VP10 (khung-luoi-va-ngan-chi-tiet), ruling G-2811-28/29: the round summary wrote the verdict cells of carried evals as
// «PASS (mang từ vòng N)» and rewrote their `verifier:` fields wrongly (rounds 6 and 7). This puts each carried eval's
// evidence block back exactly as its source round wrote it in git, adding only `carried_from_round: <N>`, sets each
// verdict cell of the table to the verdict word alone, and checks every block's verifier with the kit's own checker.
//
//   node _acceptance/khung-luoi-va-ngan-chi-tiet/rang/dung-lai-mang-sang.mjs --report <in> --out <out> --table <md>
//
// Exit 0 when every carried block was found whole in git and every block of the result passes isAuthenticVerifier;
// exit 1 with the eval named otherwise (nothing is written then). The source of each eval is the round and commit below,
// the last round each one truly ran on the current code.
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";

const SLUG = "khung-luoi-va-ngan-chi-tiet";
const DIR = `_acceptance/${SLUG}`;
/** Each carried eval: the round it last truly ran in, and the commit holding that round's report. */
const SOURCE = {
  E1: [6, "e9d9acd8a540391c31e93bb5fd9fc0a2880e709a"],
  E7: [6, "e9d9acd8a540391c31e93bb5fd9fc0a2880e709a"],
  E9: [6, "e9d9acd8a540391c31e93bb5fd9fc0a2880e709a"],
  E8: [4, "af3fdbb7"],
  E11: [4, "af3fdbb7"],
  E16: [1, "603a2961"],
  ...Object.fromEntries(
    ["E2", "E3", "E4", "E5", "E6", "E10", "E12", "E13", "E14", "E15", "E17", "E20", "E21", "E22"].map((e) => [
      e,
      [5, "ed8bec3b"],
    ]),
  ),
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
const kit = process.env.CLAUDE_PLUGIN_ROOT ?? "/Users/manhphan/dev/delivery-loop/plugins/acceptance-gate";
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
  const fresh = orig.replace(/\n$/, "") + `\n  carried_from_round: ${round}\n`;
  const cur = block(report, id);
  if (!cur) fail(`${id}: no block in the report to replace`);
  rows.push({ id, round, commit, before: cur, after: fresh });
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
const f = (b, k) => field(b, k) ?? "";
const lines = [
  "# VP10 — khối mang sang: gốc trong git và khối dựng lại",
  "",
  `Script: \`${DIR}/rang/dung-lai-mang-sang.mjs\`. Mỗi khối mang sang chép nguyên từ báo cáo của vòng nguồn, chỉ thêm`,
  "`carried_from_round`. «Khớp» = mọi trường của khối gốc có mặt y nguyên trong khối mới.",
  "",
  "| Phép | Vòng nguồn | Commit nguồn | run_id | exit_code | verifier | verified_at | Khớp |",
  "| --- | --- | --- | --- | --- | --- | --- | --- |",
  ...rows.map(({ id, round, commit, after }) => {
    const orig = after.replace(/ {2}carried_from_round: \d+\n$/, "");
    const same = after.startsWith(orig);
    return `| ${id} | ${round} | \`${commit.slice(0, 8)}\` | ${f(after, "run_id")} | ${f(after, "exit_code")} | \`${f(after, "verifier")}\` | ${f(after, "verified_at")} | ${same ? "có" : "KHÔNG"} |`;
  }),
  "",
  "Khối trước khi dựng lại (do lượt tổng hợp viết), trường verifier:",
  "",
  ...rows.map(({ id, before }) => `- ${id}: \`${f(before, "verifier")}\``),
  "",
];
writeFileSync(tablePath, lines.join("\n"));
console.log(`dung-lai-mang-sang: ${rows.length} khối dựng lại từ nguồn; ${ids.length} khối, mọi verifier hợp lệ`);
