#!/usr/bin/env node
// Both ways of every measure in do.mjs: on a fresh clone of HEAD the measure is green, and with one
// thing broken (and committed, where the measure reads git) it is red with its pinned words.
//
//   node _acceptance/design-decisions-40-of-40/rang/hai-chieu.mjs [--only <case>]
//
// Each case clones this tree into a temporary folder (git clone --shared, the packages linked),
// copies do.mjs and the drawn component manifest in, breaks one thing and runs the measure. Exit 0 when every case behaves; 1 names
// the case that did not; 2 when a clone could not be made.
import { execFileSync, spawnSync } from "node:child_process";
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..", "..");
const SLUG = "design-decisions-40-of-40";
const BASE = execFileSync("git", ["merge-base", "origin/main", "HEAD"], { cwd: ROOT, encoding: "utf8" }).trim();

const edit = (file, from, to) => (dir) => {
  const path = join(dir, file);
  const text = readFileSync(path, "utf8");
  if (!text.includes(from)) throw new Error(`${file} has no ${JSON.stringify(from)}`);
  writeFileSync(path, text.replace(from, to));
};
const add = (file, text) => (dir) => {
  mkdirSync(dirname(join(dir, file)), { recursive: true });
  writeFileSync(join(dir, file), text);
};
const words = (change) => (dir) => {
  const path = join(dir, "design/book-words.json");
  const value = JSON.parse(readFileSync(path, "utf8"));
  change(value);
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
};

// case: measure, the break, the words the red line must hold.
const CASES = [
  ["muc-untag", "muc", edit("tests/language.test.ts", "// decision:terms\n", ""), "18 claimed"],
  ["sau-dong-untag", "sau-dong", edit("tests/language.test.ts", "// decision:terms\n", ""), "terms is failing"],
  ["sau-dong-repoint", "sau-dong", edit("design/decisions.yaml", 'check: "test:tests/bo-nut-vai-man.test.ts"', 'check: "test:tests/vai-man-so-man.test.ts"'), "screen-actions is"],
  ["loi-chu-unconfirmed", "loi-chu", edit("design/decisions.yaml", "is missing from the register or an entry is wrong; confirmed by Manh Phan on 2026-11-26: Đồng ý, ghi cả 6 câu", "is missing from the register or an entry is wrong; a person has not confirmed it"), "in the note of screen-ledger"],
  ["kho-man-project", "kho-man", edit("playwright.config.ts", '{ name: "360", width: 360', '{ name: "375", width: 375'), "the browser projects are 375,414,1024,1440"],
  ["kho-man-row", "kho-man", edit("design/decisions.yaml", '"360, 414, 1024, 1440: the browser', '"390, 414, 1024, 1440: the browser'), "the ledger row says 390,414,1024,1440"],
  ["dong-gan-extra", "dong-gan", edit("tests/bo-nut-vai-man.test.ts", "// decision:screen-actions\n", "// decision:screen-actions\n// another line\n"), "tests/bo-nut-vai-man.test.ts is not its"],
  ["dong-gan-locked", "dong-gan", edit("tools/proof_gate/proof-gate.test.ts", "// Tests for", "// decision:reference-implementation\n// Tests for"), "tools/proof_gate/proof-gate.test.ts changed since"],
  ["tep-nhanh-extra", "tep-nhanh", add("src/lib/probe.ts", "export const probe = 1;\n"), "changed outside the list: src/lib/probe.ts"],
  ["tep-nhanh-map", "tep-nhanh", edit("PRODUCT-MAP.md", "\n", "\nhand edit\n"), "differ from the kit's drawing"],
  ["bo-chu-key", "bo-chu", words((w) => (w.extra = "x")), "extra extra"],
  ["bo-chu-colour", "bo-chu", words((w) => (w.title = "Hệ thiết kế #ff0000")), "a value of the repository"],
  ["bo-chu-question", "bo-chu", words((w) => delete w.questions.terms), "not the six"],
  ["dong-khac-row", "dong-khac", edit("design/decisions.yaml", 'source: "shadcn variables"', 'source: "shadcn variables, edited"'), "rows other than the six changed: color-role"],
];

const only = process.argv.indexOf("--only") > 0 ? process.argv[process.argv.indexOf("--only") + 1] : null;
const chosen = CASES.filter(([id]) => !only || id === only || id.startsWith(`${only}-`));
if (!chosen.length) {
  console.error(`no case ${only}`);
  process.exit(2);
}

const doFile = join(HERE, "do.mjs");
let failed = 0;
for (const [id, measure, breakIt, words] of chosen) {
  const dir = mkdtempSync(join(tmpdir(), `${SLUG}-`));
  try {
    execFileSync("git", ["clone", "-q", "--shared", ROOT, dir], { stdio: "pipe" });
    execFileSync("git", ["checkout", "-q", execFileSync("git", ["rev-parse", "HEAD"], { cwd: ROOT, encoding: "utf8" }).trim()], { cwd: dir, stdio: "pipe" });
    symlinkSync(join(ROOT, "node_modules"), join(dir, "node_modules"));
    // The component manifest is drawn by make and kept out of git; a fresh clone takes this tree's copy.
    cpSync(join(ROOT, "design/component-registry.json"), join(dir, "design/component-registry.json"));
    mkdirSync(join(dir, "_acceptance", SLUG, "rang"), { recursive: true });
    cpSync(doFile, join(dir, "_acceptance", SLUG, "rang", "do.mjs"));
    const run = () => spawnSync("node", [join(dir, "_acceptance", SLUG, "rang", "do.mjs"), measure, "--base", BASE], { cwd: dir, encoding: "utf8" });
    const before = run();
    breakIt(dir);
    const commit = ["-c", "user.email=probe@example.invalid", "-c", "user.name=probe", "commit", "-qam", "probe"];
    execFileSync("git", ["add", "-A", "--", ".", ":(exclude)node_modules", `:(exclude)_acceptance/${SLUG}`], { cwd: dir, stdio: "pipe" });
    execFileSync("git", commit, { cwd: dir, stdio: "pipe" });
    const after = run();
    const ok = before.status === 0 && after.status === 1 && after.stdout.includes(words);
    if (!ok) failed += 1;
    console.log(`${ok ? "ok  " : "BAD "} ${id}: green before (${before.status}), red after (${after.status}): ${after.stdout.trim() || after.stderr.trim()}`);
  } catch (error) {
    console.error(`${id}: could not run: ${error.message}`);
    process.exit(2);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}
console.log(failed ? `hai-chieu: ${failed} of ${chosen.length} case(s) did not behave` : `hai-chieu: all ${chosen.length} case(s) green before and red after`);
process.exit(failed ? 1 : 0);
