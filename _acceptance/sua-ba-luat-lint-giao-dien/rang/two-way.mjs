#!/usr/bin/env node
// AC-7: every measure of this record is green on the sound tree and red, with its pinned message, on a broken
// copy. The broken copy puts back the lint rules as they were before this change (the merge base with main).
//
//   node two-way.mjs [--base <ref>]
//
// Copies the lint configuration and the onehub-ui plugin into a scratch tree under .acceptance-runs/, runs the
// probes there (sound: exit 0), then breaks one piece at a time and checks that its case turns red with its
// pinned line. Also checks held.mjs against a copy of design/theme.json without the three rows. The scratch
// tree is removed afterwards, also when a check fails.
import { execFileSync, spawnSync } from "node:child_process";
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "../../..");
const git = (...a) => execFileSync("git", a, { cwd: ROOT, encoding: "utf8" });
const args = process.argv.slice(2);
const baseAt = args.indexOf("--base");
const BASE = (baseAt === -1 ? git("merge-base", "HEAD", "origin/main") : git("rev-parse", args[baseAt + 1])).trim();
const SCRATCH = path.join(ROOT, ".acceptance-runs/sua-ba-luat-lint-giao-dien", `two-way-${process.pid}`);
const COPY = ["eslint.config.js", "package.json", "tsconfig.json", "tools/eslint-ui"];

const node = (script, extra) =>
  spawnSync(process.execPath, [path.join(HERE, script), ...extra], { encoding: "utf8" });

function fresh() {
  rmSync(SCRATCH, { recursive: true, force: true });
  mkdirSync(SCRATCH, { recursive: true });
  for (const p of COPY) cpSync(path.join(ROOT, p), path.join(SCRATCH, p), { recursive: true });
}
const fromBase = (p) => writeFileSync(path.join(SCRATCH, p), git("show", `${BASE}:${p}`));

let failed = 0;
function expect(name, run, code, pinned) {
  const out = (run.stdout ?? "") + (run.stderr ?? "");
  const ok = run.status === code && (!pinned || out.includes(pinned));
  console.log(`${ok ? "đúng" : "SAI"}: ${name} — thoát ${run.status}${pinned ? `, ${out.includes(pinned) ? "có" : "KHÔNG có"} «${pinned}»` : ""}`);
  if (!ok) {
    failed++;
    console.log(out.trimEnd().replace(/^/gm, "    "));
  }
}

console.log(`two-way: root ${ROOT} · base ${BASE}`);
try {
  // Sound copy: every case green.
  fresh();
  expect("bản lành, mọi ca xanh", node("probe.mjs", ["--root", SCRATCH, "all"]), 0, `probe: root ${SCRATCH}`);

  // Broken copies, one piece each, from the merge base.
  const BROKEN = [
    ["E1", ["tools/eslint-ui/rules/no-off-scale-spacing.mjs"], 'E1 LỌT: <div className="p-[13px]" />'],
    ["E2", ["tools/eslint-ui/rules/no-partial-class.mjs"], 'E2 LỌT: <div className={"text-" + tone} />'],
    ["E3", ["tools/eslint-ui/rules/require-disable-reason.mjs"], "E3 LỌT: // eslint-disable-next-line shadcn/no-arbitrary-values"],
    ["E4", ["tools/eslint-ui/index.mjs", "eslint.config.js"], "E4 LỌT: /* eslint-disable */"],
  ];
  for (const [id, files, pinned] of BROKEN) {
    fresh();
    for (const f of files) fromBase(f);
    expect(`bản phá ${id} (${files.join(", ")} về ${BASE.slice(0, 8)})`, node("probe.mjs", ["--root", SCRATCH, id]), 1, pinned);
  }

  // E4's side effects: a processor that lifts every suppression, and one that turns autofix off.
  const PROC = "tools/eslint-ui/index.mjs";
  const SIDE = [
    ["E4 gỡ nhãn của mọi luật", "if (message.ruleId !== REASON_RULE || !message.suppressions) return message;", "if (!message.suppressions) return message;", "E4 SAI ĐỐI CHỨNG: other rules stay suppressed"],
    ["E4 tắt sửa tự động", "supportsAutofix: true,", "supportsAutofix: false,", "E4 LỌT: autofix stops on screen files"],
  ];
  for (const [name, from, to, pinned] of SIDE) {
    fresh();
    const file = path.join(SCRATCH, PROC);
    const text = readFileSync(file, "utf8");
    if (!text.includes(from)) throw new Error(`two-way: ${PROC} has no «${from}» to break`);
    writeFileSync(file, text.replace(from, to));
    expect(`bản phá ${name}`, node("probe.mjs", ["--root", SCRATCH, "E4"]), 1, pinned);
  }

  // E5: the real tree is held; a worktree of HEAD with the rules of the merge base is not.
  expect("E5 cây thật", node("held.mjs", []), 0, "E5 giữ: lint-exceptions");
  rmSync(SCRATCH, { recursive: true, force: true });
  git("worktree", "add", "--detach", "--quiet", SCRATCH, "HEAD");
  try {
    for (const f of ["tools/eslint-ui/rules/no-off-scale-spacing.mjs", "tools/eslint-ui/rules/no-partial-class.mjs", "tools/eslint-ui/rules/require-disable-reason.mjs", "tools/eslint-ui/index.mjs", "eslint.config.js"]) fromBase(f);
    expect("E5 bản phá (luật của điểm gộp)", node("held.mjs", ["--root", SCRATCH]), 1, "E5 KHÔNG GIỮ: spacing");
  } finally {
    git("worktree", "remove", "--force", SCRATCH);
  }

  // E10: a decisions folder without the page is red.
  fresh();
  expect("E10 bản phá (thư mục quyết định trống)", node("wiki.mjs", ["--dir", SCRATCH]), 1, "E10 THIẾU: không trang quyết định nào trỏ d-20261126T061152Z-5");
} finally {
  rmSync(SCRATCH, { recursive: true, force: true });
}
process.exit(failed ? 1 : 0);
