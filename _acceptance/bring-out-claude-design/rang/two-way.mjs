// Each measure of this record, seen green on the thing as it is and red, with its pinned message, on a
// clone broken on purpose. Usage: node two-way.mjs [--only <name>] — names: exports, bundle, leave,
// default, clean, change-list. Prints one line per case; exit 0 only when every case held.
import { readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";

import { HERE, option, ROOT, run, workClone } from "./lib.mjs";
import { LEDGER, PUSHED, THEME, WAITING } from "./matrix.mjs";

const only = option("--only");
let failed = 0;

// Runs a measure of this folder on `dir`; `want` is a line it must print, `exit` the code it must end with.
function expect(label, want, exit, script, dir) {
  const r = run("node", [path.join(HERE, script), "--root", dir], ROOT);
  const ok = r.status === exit && r.out.includes(want);
  if (!ok) failed += 1;
  process.stdout.write(`${ok ? "held" : "FAILED"}: ${script.replace(".mjs", "")}: ${label}\n`);
  if (!ok) process.stdout.write(`  wanted exit ${exit} and «${want}»; got exit ${r.status}:\n${r.out}\n`);
}
// A clone at HEAD with `edit(dir)` applied, committed when `commit` is set; the measure runs on it,
// then the clone goes.
function onClone(label, want, exit, script, edit = null, commit = false) {
  const clone = workClone(ROOT);
  try {
    if (edit) {
      edit(clone.dir);
      if (commit) clone.commit(`break: ${label}`);
    }
    expect(label, want, exit, script, clone.dir);
  } finally {
    clone.remove();
  }
}
const green = (script, want) => onClone("as it is (green)", want, 0, script);
const red = (script, label, want, edit, commit = false) => onClone(`${label} (red)`, want, 1, script, edit, commit);
const text = (dir, rel) => readFileSync(path.join(dir, rel), "utf8");
const put = (dir, rel, body) => writeFileSync(path.join(dir, rel), body);
const swap = (rel, from, to) => (dir) => {
  const before = text(dir, rel);
  if (!before.includes(from)) throw new Error(`${rel} has no «${from}» to break`);
  put(dir, rel, before.replace(from, to));
};
const jsonEdit = (rel, change) => (dir) => {
  const data = JSON.parse(text(dir, rel));
  change(data);
  put(dir, rel, `${JSON.stringify(data, null, 2)}\n`);
};
const TOKENS = "design/export/system/tokens.json";
const accent = (data) => data.color.tokens.find((t) => t.name === "accent");

const cases = {
  exports() {
    green("exports.mjs", "exports: the five exports are what the ledgers write at");
    red("exports.mjs", "DESIGN.md changed by hand", "exports: DESIGN.md is not what the ledgers write at HEAD", swap("DESIGN.md", 'accent: "#ebf2ff"', 'accent: "#ebf2fe"'), true);
    red(
      "exports.mjs",
      "a colour of the tokens changed, the exports not written again",
      "exports: the gate did not hold the exports: design-exports: DESIGN.md was written from the design ledgers at f1f0bbbc4e26; they are now at",
      jsonEdit("design/tokens.json", (d) => { d.color.background.$value = "#fefefe"; }),
      true,
    );
    red("exports.mjs", "design/theme.json lists four exports", `exports: design-exports in ${THEME} lists`, jsonEdit(THEME, (d) => { d.checks["design-exports"] = d.checks["design-exports"].slice(0, 4); }), true);
  },
  bundle() {
    green("bundle.mjs", "bundle: the bundle gives 40 colours in both themes");
    red("bundle.mjs", "accent has no dark value", "bundle: colour accent has no dark value", jsonEdit(TOKENS, (d) => { delete accent(d).value.dark; }));
    red("bundle.mjs", "accent light changed", "bundle: colour accent is #000000 in the light theme, not #ebf2ff", jsonEdit(TOKENS, (d) => { accent(d).value.light = "#000000"; }));
    red("bundle.mjs", "colours in the old shape", "bundle: the colours are not a list of tokens", jsonEdit(TOKENS, (d) => { d.color.tokens = Object.fromEntries(d.color.tokens.map((t) => [t.name, t])); }));
    red("bundle.mjs", "accent dark value changed", "bundle: colour accent is #fafafa in the dark theme, not oklch(26.9% 0 none)", jsonEdit(TOKENS, (d) => { accent(d).value.dark = "#fafafa"; }));
    red("bundle.mjs", "primary dark value is its light value", "bundle: colour primary is #0246ff in the dark theme, not color-mix(in oklch, #0246ff 60%, white)", jsonEdit(TOKENS, (d) => { d.color.tokens.find((t) => t.name === "primary").value.dark = "#0246ff"; }));
    red("bundle.mjs", "radius-md 9px", "bundle: radius-md is 9px, not 8px (0.5rem)", jsonEdit(TOKENS, (d) => { d.radius.tokens.find((t) => t.name === "radius-md").value = "9px"; }));
    red("bundle.mjs", "sans family empty", "bundle: the sans family is «», not Inter", jsonEdit(TOKENS, (d) => { d.type.families.sans = ""; }));
    red("bundle.mjs", "a component dropped", "bundle: components.md does not list InDialog src/components/candidate/form-dialog.tsx", swap("design/export/system/components.md", "- **InDialog** (organism), `src/components/candidate/form-dialog.tsx`: value\n", ""));
    red("bundle.mjs", "DESIGN.md colour changed", "bundle: DESIGN.md gives accent as #ebf2fe, not #ebf2ff", swap("DESIGN.md", 'accent: "#ebf2ff"', 'accent: "#ebf2fe"'));
  },
  leave() {
    green("leave.mjs", "leave: send-claude-design gives leave for the four bundle files");
    red("leave.mjs", "push at the old state", "leave: the last push to claude-design is at eb3e4b366ba0, the bundle is at f1f0bbbc4e26", jsonEdit(PUSHED, (d) => { d.pushes.at(-1).stamp = "eb3e4b366ba0"; }));
    red("leave.mjs", "leave not confirmed", "leave: send-claude-design is not confirmed by Manh Phan on 2026-11-26", swap(LEDGER, '    note: "confirmed by Manh Phan on 2026-11-26"\n', ""));
    red("leave.mjs", "leave for three files", "leave: send-claude-design gives leave for «leave: design/export/system/README.md, design/export/system/tokens.json, design/export/system/components.md; to:", swap(LEDGER, "design/export/system/components.md, design/export/system/assets.json; to:", "design/export/system/components.md; to:"));
    red("leave.mjs", "leave sends to a shared artifact", "leave: send-claude-design sends to «The design values and files of the repository it is given, to a shared artifact of the person's Claude account.», which is not a private artifact", swap(LEDGER, "to a private artifact of the person's Claude account.", "to a shared artifact of the person's Claude account."));
    red("leave.mjs", "a push to a place no leave names", "leave: a push went to claude-design-team, a place no leave names", jsonEdit(PUSHED, (d) => { d.pushes.unshift({ plug: "claude-design-team", stamp: "f1f0bbbc4e26", on: "2026-11-27" }); }));
    red("leave.mjs", "no push recorded", "leave: design/export/pushed.json records no push to claude-design", jsonEdit(PUSHED, (d) => { d.pushes = []; }));
  },
  default() {
    green("default.mjs", "default: default-claude-design waits on the owner with no answer written");
    red("default.mjs", "an answer written", 'default: default-claude-design has an answer written: answer: "yes"', jsonEdit(WAITING, (d) => { d.answer = "yes"; }));
    red("default.mjs", "the question gone", `default: ${WAITING} is gone`, (dir) => rmSync(path.join(dir, WAITING)));
    red("default.mjs", "a ledger row for it", `default: ${LEDGER} has a row default-claude-design`, (dir) => put(dir, LEDGER, `${text(dir, LEDGER)}  - id: default-claude-design\n    layer: governance\n    kind: judgment\n`));
  },
  clean() {
    green("clean.mjs", "clean: the five exports carry no email address");
    red("clean.mjs", "an email in the README", "clean: design/export/system/README.md carries an email address: «ten@example.com»", (dir) => put(dir, "design/export/system/README.md", `${text(dir, "design/export/system/README.md")}\nten@example.com\n`));
    red("clean.mjs", "a phone number in components.md", "clean: design/export/system/components.md carries a phone number: «0900000012»", (dir) => put(dir, "design/export/system/components.md", `${text(dir, "design/export/system/components.md")}\nGọi 0900000012\n`));
    red("clean.mjs", "a spaced phone number", "clean: design/export/system/components.md carries a phone number: «0900 000 012»", (dir) => put(dir, "design/export/system/components.md", `${text(dir, "design/export/system/components.md")}\nGọi 0900 000 012\n`));
    red("clean.mjs", "a +84 phone number", "clean: design/export/system/README.md carries a phone number: «+84 900 000 012»", (dir) => put(dir, "design/export/system/README.md", `${text(dir, "design/export/system/README.md")}\nGọi +84 900 000 012\n`));
    red("clean.mjs", "a /home path", "clean: DESIGN.md carries a path on this machine: «/home/t»", (dir) => put(dir, "DESIGN.md", `${text(dir, "DESIGN.md")}\n/home/ten/x\n`));
    red("clean.mjs", "a /private/tmp path", "clean: design/export/system/tokens.json carries a path on this machine: «/private/tmp/»", jsonEdit(TOKENS, (d) => { d.$description = `${d.$description} /private/tmp/x`; }));
    red("clean.mjs", "a /var/folders path", "clean: design/export/system/assets.json carries a path on this machine: «/var/folders/»", swap("design/export/system/assets.json", "the font loader in src/app/layout.tsx", "the font loader in /var/folders/x"));
    red("clean.mjs", "a key in DESIGN.md", "clean: DESIGN.md carries a key or token", (dir) => put(dir, "DESIGN.md", `${text(dir, "DESIGN.md")}\nsk-${"a".repeat(24)}\n`));
    red("clean.mjs", "a machine path in assets.json", "clean: design/export/system/assets.json carries a path on this machine: «/Users/»", swap("design/export/system/assets.json", "the font loader in src/app/layout.tsx", "the font loader in /Users/x/src/app/layout.tsx"));
  },
  "change-list"() {
    green("change-list.mjs", "changes: the branch changes the exports, the push record");
    red("change-list.mjs", "branch changes Makefile", "changes: branch changed beyond the export and this record: Makefile", (dir) => put(dir, "Makefile", `${text(dir, "Makefile")}\n# changed\n`), true);
    red("change-list.mjs", "branch removes a ledger line of main", "changes: branch removed lines from design/decisions.yaml: «# Determinism ledger: one line per design decision.", swap(LEDGER, "# Determinism ledger: one line per design decision. Rules: docs/design-standard-proposal.md.\n", ""), true);
    red("change-list.mjs", "branch edits a wiki log line of main", "changes: branch changed an existing wiki log line: wiki/log/", (dir) => {
      const file = run("git", ["ls-tree", "--name-only", "origin/main", "wiki/log/"], dir).out.split("\n").find((f) => f.endsWith(".md"));
      put(dir, file, `${text(dir, file)}\n`);
    }, true);
  },
};

for (const [name, body] of Object.entries(cases)) if (!only || only === name) body();
process.stdout.write(failed ? `two-way: ${failed} case(s) did not hold\n` : "two-way: every case held\n");
process.exitCode = failed ? 1 : 0;
