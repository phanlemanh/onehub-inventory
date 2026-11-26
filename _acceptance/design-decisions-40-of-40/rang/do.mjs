#!/usr/bin/env node
// Measures of the dossier design-decisions-40-of-40. Each measure reads the tree the file sits in
// (three folders up), prints one green line with the HEAD it measured, or a red line naming what is
// wrong and exits 1. Exit 2: the measure could not run.
//
//   node _acceptance/design-decisions-40-of-40/rang/do.mjs <measure> [--base <sha>]
//
// Measures: muc, sau-dong, loi-chu, kho-man, dong-gan, tep-nhanh, bo-chu, dong-khac.
// --base is the commit the branch left main at; without it, `git merge-base origin/main HEAD`.
// The design-assembly plugin is read from $DA_PLUGIN, default the owner's checkout.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const SLUG = "design-decisions-40-of-40";
const PLUGIN = process.env.DA_PLUGIN ?? "/Users/manhphan/dev/design-assembly/plugins/design-assembly";
const SIX = ["terms", "error-copy", "test-screen-sizes", "reference-implementation", "screen-ledger", "screen-actions"];
const CHECKS = {
  terms: "test:tests/language.test.ts",
  "test-screen-sizes": "e2e:tests/e2e/frame.spec.ts",
  "reference-implementation": "test:tests/proof-matrix-self.test.ts",
  "screen-ledger": "tool:tools/coverage_matrix/check.py",
  "screen-actions": "test:tests/bo-nut-vai-man.test.ts",
};
const TAGGED = {
  "tests/language.test.ts": "terms",
  "tests/e2e/frame.spec.ts": "test-screen-sizes",
  "tests/proof-matrix-self.test.ts": "reference-implementation",
  "tests/bo-nut-vai-man.test.ts": "screen-actions",
};
const LOCKED = "tools/proof_gate/proof-gate.test.ts";
const COLOURS = ["color-roles-sidebar", "color-roles-neutral", "color-roles-status", "color-roles-chart"];
const SIZES = ["360", "414", "1024", "1440"];
const CONFIRMED = /confirmed by Manh Phan on 2026-11-26: Đồng ý, ghi cả 6 câu$/;

const args = process.argv.slice(2);
const measure = args[0];
const at = args.indexOf("--base");

const git = (...a) => execFileSync("git", a, { cwd: ROOT, encoding: "utf8", maxBuffer: 1 << 26 });
const node = (script, ...a) => {
  try {
    return execFileSync("node", [join(PLUGIN, "scripts", script), "--target", ROOT, ...a], {
      cwd: ROOT,
      encoding: "utf8",
      maxBuffer: 1 << 26,
    });
  } catch (error) {
    // audit and decide end with 1 when something waits or is open: their output is still the answer.
    if (error.status === 1 && error.stdout) return error.stdout;
    throw error;
  }
};
const head = () => git("rev-parse", "--short", "HEAD").trim();
const base = () => (at > 0 ? args[at + 1] : git("merge-base", "origin/main", "HEAD").trim());
const read = (file) => readFileSync(join(ROOT, file), "utf8");
const green = (text) => {
  console.log(`${measure}: ${text} (HEAD ${head()})`);
  process.exit(0);
};
const red = (text) => {
  console.log(`${measure}: ${text}`);
  process.exit(1);
};

// The rows of design/decisions.yaml, in order, each as its lines (block style, as the ledger says).
function rows(text) {
  const out = [];
  let row = null;
  for (const line of text.split("\n")) {
    const id = /^ {2}- id: (\S+)/.exec(line);
    if (id) {
      row = { id: id[1], lines: [line] };
      out.push(row);
    } else if (row && /^ {4}\S/.test(line)) row.lines.push(line);
    else row = null;
  }
  return out;
}
const field = (row, key) => {
  const line = row.lines.find((l) => l.startsWith(`    ${key}: `));
  return line ? JSON.parse(line.slice(`    ${key}: `.length)) : null;
};

// Every key path of a JSON value; arrays count as one leaf.
function paths(value, prefix = "") {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return Object.entries(value).flatMap(([k, v]) => paths(v, prefix ? `${prefix}.${k}` : k));
  }
  return [prefix];
}

const measures = {
  // AC-2: the audit answers 40 of 40, and every tier is complete.
  muc() {
    const a = JSON.parse(node("audit.mjs", "--json"));
    const c = a.coverage;
    const got = `${c.answered} of ${c.core}, ${c.held} held, ${c.claimed} claimed, ${c.recorded} recorded`;
    if (got !== "40 of 40, 11 held, 22 claimed, 7 recorded") red(`the audit says ${got}, not 40 of 40, 11 held, 22 claimed, 7 recorded`);
    const short = a.tiers.filter((t) => !["reached", "claimed"].includes(t.state)).map((t) => `${t.id} ${t.state}`);
    if (short.length) red(`tiers not complete: ${short.join(", ")}`);
    green(`40 of 40 core decisions answered, 11 held, 22 claimed, 7 recorded; ${a.tiers.length} tiers reached or claimed`);
  },

  // AC-3: error-copy is recorded; each of the five others is claimed by its own check.
  "sau-dong"() {
    const a = JSON.parse(node("audit.mjs", "--json"));
    const by = Object.fromEntries(a.decisions.map((d) => [d.id, d]));
    const wrong = [];
    if (by["error-copy"]?.state !== "recorded") wrong.push(`error-copy is ${by["error-copy"]?.state ?? "missing"}, not recorded`);
    for (const [id, check] of Object.entries(CHECKS)) {
      const d = by[id];
      if (d?.state !== "claimed" || d.by !== check) wrong.push(`${id} is ${d?.state ?? "missing"} by ${d?.by ?? "nothing"}, not claimed by ${check}`);
    }
    if (wrong.length) red(wrong.join("; "));
    green("error-copy recorded; terms, test-screen-sizes, reference-implementation, screen-ledger, screen-actions claimed by their checks");
  },

  // AC-4: each of the six carries the owner's word; the four colour questions still wait, unanswered.
  "loi-chu"() {
    const ledger = rows(read("design/decisions.yaml"));
    const missing = SIX.filter((id) => !CONFIRMED.test(field(ledger.find((r) => r.id === id) ?? { lines: [] }, "note") ?? ""));
    if (missing.length) red(`no confirmation by Manh Phan on 2026-11-26 in the note of ${missing.join(", ")}`);
    const sheet = JSON.parse(node("decide.mjs", "--json"));
    const waiting = [...sheet.questions, ...sheet.elsewhere].map((q) => q.id);
    const still = SIX.filter((id) => waiting.includes(id));
    if (still.length) red(`still waiting on the sheet: ${still.join(", ")}`);
    const answeredColour = sheet.answered.filter((q) => COLOURS.includes(q.id)).map((q) => q.id);
    if (answeredColour.length) red(`a colour question was answered: ${answeredColour.join(", ")}`);
    const gone = COLOURS.filter((id) => !waiting.includes(id));
    if (gone.length) red(`colour question(s) no longer waiting: ${gone.join(", ")}`);
    green("the six rows are confirmed by Manh Phan on 2026-11-26; the four colour questions still wait");
  },

  // AC-5: the four sizes of the ledger row are the browser projects and the state matrix's sizes.
  "kho-man"() {
    const row = rows(read("design/decisions.yaml")).find((r) => r.id === "test-screen-sizes");
    const source = row ? field(row, "source") : "";
    const inRow = (source.match(/\b\d{3,4}\b/g) ?? []).join(",");
    const config = read("playwright.config.ts");
    const block = /const SIZES = \[([\s\S]*?)\];/.exec(config)?.[1] ?? "";
    const projects = [...block.matchAll(/name: "(\d+)"/g)].map((m) => m[1]).join(",");
    const matrix = /ở bốn khổ ([\d, ]+)\./.exec(read("design/states.md"))?.[1].replace(/ /g, "") ?? "";
    const want = SIZES.join(",");
    if (inRow !== want) red(`the ledger row says ${inRow || "no size"}, not ${want}`);
    if (projects !== want) red(`the browser projects are ${projects || "none"}, not ${want}`);
    if (matrix !== want) red(`design/states.md says ${matrix || "no size"}, not ${want}`);
    green(`the ledger row, the browser projects and design/states.md all say ${want}`);
  },

  // AC-6: each tagged test gains exactly one first line naming its decision; the locked test is untouched.
  "dong-gan"() {
    const b = base();
    const wrong = [];
    for (const [file, id] of Object.entries(TAGGED)) {
      const now = read(file);
      const before = git("show", `${b}:${file}`);
      if (now !== `// decision:${id}\n${before}`) wrong.push(`${file} is not its ${b.slice(0, 8)} text with one first line // decision:${id}`);
    }
    if (git("diff", "--name-only", b, "--", LOCKED).trim()) wrong.push(`${LOCKED} changed since ${b.slice(0, 8)}`);
    if (wrong.length) red(wrong.join("; "));
    green(`four tests gained one first line each, ${LOCKED} untouched since ${b.slice(0, 8)}`);
  },

  // AC-7: the branch changes no file outside its list.
  "tep-nhanh"() {
    const b = base();
    const changed = git("diff", "--name-only", b, "HEAD").split("\n").filter(Boolean);
    const allowed = new Set(["design/decisions.yaml", "design/book-words.json", ...Object.keys(TAGGED)]);
    const logs = changed.filter((f) => f.startsWith("wiki/log/"));
    const extra = changed.filter((f) => !allowed.has(f) && !f.startsWith(`_acceptance/${SLUG}/`) && !f.startsWith("wiki/log/"));
    if (extra.length) red(`changed outside the list: ${extra.join(", ")}`);
    if (logs.length !== 1) red(`${logs.length} wiki log files changed, not 1`);
    const missing = [...allowed].filter((f) => !changed.includes(f));
    if (missing.length) red(`not changed: ${missing.join(", ")}`);
    green(`${changed.length} files changed since ${b.slice(0, 8)}, all on the list`);
  },

  // AC-8: the words file has the template's keys, the six questions, and no value of the repository.
  "bo-chu"() {
    const file = "design/book-words.json";
    if (!existsSync(join(ROOT, file))) red(`${file} is missing`);
    let words;
    try {
      words = JSON.parse(read(file));
    } catch (error) {
      red(`${file} is not JSON: ${error.message}`);
    }
    const template = JSON.parse(node("book.mjs", "--words-template"));
    const want = paths(template).filter((p) => p !== "questions").sort();
    const have = paths(words).filter((p) => !p.startsWith("questions.") && p !== "questions").sort();
    const extra = have.filter((p) => !want.includes(p));
    const lack = want.filter((p) => !have.includes(p));
    if (extra.length || lack.length) red(`keys differ from the template: extra ${extra.join(", ") || "none"}; missing ${lack.join(", ") || "none"}`);
    const questions = Object.keys(words.questions ?? {}).sort().join(",");
    if (questions !== [...SIX].sort().join(",")) red(`questions are ${questions || "none"}, not the six`);
    const text = read(file);
    const values = [/#[0-9a-f]{3,8}\b/i, /\b(?:oklch|rgb|hsl)\(/i, /onehub/i].filter((re) => re.test(text));
    if (values.length) red(`a value of the repository in ${file}: ${values.map(String).join(", ")}`);
    green(`${file} has the template's ${want.length} keys and the six questions, and no colour or name`);
  },

  // AC-9: no other row of the ledger changed, and the six are there.
  "dong-khac"() {
    const b = base();
    const before = rows(git("show", `${b}:design/decisions.yaml`));
    const now = rows(read("design/decisions.yaml"));
    const keep = (list) => list.filter((r) => !SIX.includes(r.id));
    const a = keep(before).map((r) => r.lines.join("\n"));
    const c = keep(now).map((r) => r.lines.join("\n"));
    const differ = keep(before).filter((r, i) => a[i] !== c[i]).map((r) => r.id);
    if (a.length !== c.length || differ.length) red(`rows other than the six changed: ${differ.join(", ") || `${a.length} rows before, ${c.length} now`}`);
    const absent = SIX.filter((id) => !now.some((r) => r.id === id));
    if (absent.length) red(`missing rows: ${absent.join(", ")}`);
    green(`${c.length} other rows as at ${b.slice(0, 8)}; the six rows present`);
  },
};

if (!measures[measure]) {
  console.error(`usage: do.mjs <${Object.keys(measures).join("|")}> [--base <sha>]`);
  process.exit(2);
}
try {
  measures[measure]();
} catch (error) {
  console.error(`${measure}: could not run: ${error.message}`);
  process.exit(2);
}
