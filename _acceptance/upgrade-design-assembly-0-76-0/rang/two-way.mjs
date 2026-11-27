// Each measure of this record, seen green on the thing as it is and red, with its pinned message, on
// a copy broken on purpose. Usage: node two-way.mjs [--only <name>] — names: gate-lines, tool-tree,
// decision-states, audit, words, book, change-list. Prints one line per case; exit 0 only when every
// case held.
import { appendFileSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";

import { git, HERE, linkedCopy, option, ROOT, run, scratch, workClone } from "./lib.mjs";
import {
  BASE,
  BREAK_CORE_ROW,
  BREAK_DECISION,
  GATE_STEP,
  LEDGER,
  OLD_VERSION,
  PLUGIN_DIR,
  PLUGIN_FILES,
  RELEASE,
  STAMP,
  TABLE,
  THEME,
  TOOL_FOLDER,
  UPGRADE,
  WORDS,
} from "./matrix.mjs";

const only = option("--only");
let failed = 0;

// Runs a measure of this folder; `want` is a line it must print, `exit` the code it must end with.
function expect(label, want, exit, script, args = [], env = {}) {
  const r = run("node", [path.join(HERE, script), ...args], ROOT, env);
  const ok = r.status === exit && r.out.includes(want);
  if (!ok) failed += 1;
  process.stdout.write(`${ok ? "held" : "FAILED"}: ${label}\n`);
  if (!ok) process.stdout.write(`  wanted exit ${exit} and «${want}»; got exit ${r.status}:\n${r.out}\n`);
}
const green = (label, want, script, args, env) => expect(`${label} (green)`, want, 0, script, args, env);
const red = (label, want, script, args, env) => expect(`${label} (red)`, want, 1, script, args, env);
const text = (rel) => readFileSync(path.join(ROOT, rel), "utf8");
const cases = {};

cases["gate-lines"] = () => {
  // Real checkouts: the gate reads git, and a copy made of links shows git every file as changed.
  const plain = workClone(ROOT);
  const broken = workClone(ROOT);
  const theme = JSON.parse(text(THEME));
  const [id] = Object.entries(theme.checks).find(([, list]) => list.length > 1);
  theme.checks[id] = theme.checks[id].slice(1);
  writeFileSync(path.join(broken.dir, THEME), `${JSON.stringify(theme, null, 2)}\n`);
  try {
    green("gate-lines on a clone", "gate: the gate holds 25 decisions by 36 checks", "gate-lines.mjs", ["--root", plain.dir]);
    red(
      `gate-lines without one check of ${id}`,
      "gate: the gate did not say: design-assembly: 25 decisions held by 36 checks, each seen failing on a changed copy",
      "gate-lines.mjs",
      ["--root", broken.dir],
    );
  } finally {
    plain.remove();
    broken.remove();
  }
};

cases["tool-tree"] = () => {
  const stamp = JSON.parse(text(STAMP));
  const copies = {
    tool: linkedCopy(ROOT, { replace: { [`${TOOL_FOLDER}/probes.mjs`]: `${text(`${TOOL_FOLDER}/probes.mjs`)}// changed\n` } }),
    stamp: linkedCopy(ROOT, { replace: { [STAMP]: `${JSON.stringify({ ...stamp, version: OLD_VERSION }, null, 2)}\n` } }),
    step: linkedCopy(ROOT, { replace: { [GATE_STEP.file]: `${text(GATE_STEP.file)}# changed\n` } }),
  };
  // Copies of the installed plugin made of links: one whose manifest says 0.69.0, one whose release
  // ledger lacks 0.76.0.
  const plugin = PLUGIN_DIR();
  const pluginText = (rel) => readFileSync(path.join(plugin, rel), "utf8");
  const manifest = JSON.parse(pluginText(PLUGIN_FILES.manifest));
  const ledger = JSON.parse(pluginText(PLUGIN_FILES.ledger));
  const drop = (list) => list.filter((r) => r.version !== RELEASE.version);
  const plugins = {
    older: linkedCopy(plugin, { replace: { [PLUGIN_FILES.manifest]: JSON.stringify({ ...manifest, version: OLD_VERSION }) } }),
    noEntry: linkedCopy(plugin, {
      replace: { [PLUGIN_FILES.ledger]: JSON.stringify(Array.isArray(ledger) ? drop(ledger) : { ...ledger, releases: drop(ledger.releases) }) },
    }),
  };
  const empty = scratch("empty");
  try {
    green("tool-tree as it is", `tool: ${TOOL_FOLDER} is the plugin's version ${RELEASE.version}, ${RELEASE.files} files`, "tool-tree.mjs");
    red("tool-tree with a tool file changed", `differs from the plugin's version ${RELEASE.version}`, "tool-tree.mjs", ["--root", copies.tool.dir]);
    red("tool-tree with the stamp at 0.69.0", `the stamp says version ${OLD_VERSION}, not ${RELEASE.version}`, "tool-tree.mjs", ["--root", copies.stamp.dir]);
    red("tool-tree with another gate step", "is not the plugin's gate step", "tool-tree.mjs", ["--root", copies.step.dir]);
    red("tool-tree with the plugin at 0.69.0", `the installed plugin is version ${OLD_VERSION}, not ${RELEASE.version}`, "tool-tree.mjs", [], { DA_PLUGIN: plugins.older.dir });
    red("tool-tree when the ledger lacks the version", `the installed plugin's release ledger has no version ${RELEASE.version}`, "tool-tree.mjs", [], { DA_PLUGIN: plugins.noEntry.dir });
    red("tool-tree without the plugin folder", "cannot read the installed plugin", "tool-tree.mjs", [], { DA_PLUGIN: empty });
  } finally {
    for (const copy of [...Object.values(copies), ...Object.values(plugins)]) copy.remove();
    rmSync(empty, { recursive: true, force: true });
  }
};

cases["decision-states"] = () => {
  const dir = scratch("theme");
  const theme = JSON.parse(text(THEME));
  delete theme.checks[BREAK_DECISION];
  const file = path.join(dir, "theme.json");
  writeFileSync(file, JSON.stringify(theme, null, 2));
  try {
    green("decision-states as it is", `states: the ${RELEASE.version} tool and the ${OLD_VERSION} tool, on the ledger at HEAD, give each of the 73 decisions the same state`, "decision-states.mjs");
    red(
      `decision-states with ${BREAK_DECISION} unchecked on the ${OLD_VERSION} side`,
      `states: ${BREAK_DECISION} is held with the ${RELEASE.version} tool, not with the ${OLD_VERSION} tool`,
      "decision-states.mjs",
      ["--old-theme", file],
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
};

cases.audit = () => {
  const dir = scratch("ledger");
  // The ledger without one core row: from its "  - id:" line to the next.
  const lines = text(LEDGER).split("\n");
  const from = lines.indexOf(`  - id: ${BREAK_CORE_ROW}`);
  if (from === -1) throw new Error(`${LEDGER} has no row ${BREAK_CORE_ROW} to drop`);
  let to = from + 1;
  while (to < lines.length && !lines[to].startsWith("  - id: ")) to += 1;
  const file = path.join(dir, "decisions.yaml");
  writeFileSync(file, [...lines.slice(0, from), ...lines.slice(to)].join("\n"));
  try {
    green("audit as it is", "audit: coverage: 40 of 40 core decisions answered (14 held and re-run here, 19 claimed and not re-run, 7 recorded)", "audit.mjs");
    red(`audit without the row ${BREAK_CORE_ROW}`, "audit: the audit said «coverage: 39 of 40 core decisions answered", "audit.mjs", ["--ledger", file]);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
};

// A copy of the book's words with `change` made to it, written to a scratch file.
function wordsWith(dir, name, change) {
  const words = JSON.parse(text(WORDS));
  change(words);
  const file = path.join(dir, `${name}.json`);
  writeFileSync(file, `${JSON.stringify(words, null, 2)}\n`);
  return file;
}

cases.words = () => {
  const dir = scratch("words");
  const w = (name, change) => ["--words", wordsWith(dir, name, change)];
  const staleTable = path.join(dir, "table.md");
  writeFileSync(staleTable, text(TABLE).replace("| nét |", "| đường |"));
  try {
    green("words as it is", "words: design/book-words.json has the template's 145 keys and the six questions; the 13 brand keys are Vietnamese", "words.mjs");
    red("words without brandStroke", "words: missing brandStroke, a key of the words template", "words.mjs", w("lost", (x) => delete x.brandStroke));
    red("words with a key the template lacks", "words: brandExtra is not a key of the words template", "words.mjs", w("extra", (x) => (x.brandExtra = "thêm")));
    red("words with brandTitle in English", "words: brandTitle is the template's English: «Brand assets»", "words.mjs", w("english", (x) => (x.brandTitle = "Brand assets")));
    red("words with an empty brandRow", "words: brandRow is empty", "words.mjs", w("empty", (x) => (x.brandRow = " ")));
    red("words with an exclamation mark", "words: brandNoIcons holds an exclamation mark", "words.mjs", w("bang", (x) => (x.brandNoIcons = "Chưa ghi bộ biểu tượng nào!")));
    red("words with a colour value", "words: brandLede holds a colour value", "words.mjs", w("hex", (x) => (x.brandLede = `${x.brandLede} Màu #1a2b3c.`)));
    red("words with the repository's name", "words: brandFloorText holds the repository's name", "words.mjs", w("name", (x) => (x.brandFloorText = "Logo là chữ OneHub.")));
    red("words with a tone mark in the old place", "words: brandUnread holds a tone mark in the old place", "words.mjs", w("tone", (x) => (x.brandUnread = "tệp đã bị xóa")));
    red("words with «sàn»", "words: brandQuestion holds «sàn»", "words.mjs", w("san", (x) => (x.brandQuestion = "Sàn mang logo nào")));
    red("words with an emoji", "words: brandMark holds an emoji", "words.mjs", w("emoji", (x) => (x.brandMark = "Logo 🎨")));
    red("words not in NFC", "words: brandIcons is not in Unicode NFC", "words.mjs", w("nfd", (x) => (x.brandIcons = x.brandIcons.normalize("NFD"))));
    red("words with only five questions", "words: the questions are", "words.mjs", w("questions", (x) => delete x.questions.terms));
    red("words with a stale table", "is not what the words template and design/book-words.json say", "words.mjs", ["--table", staleTable]);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
};

cases.book = () => {
  const dir = scratch("book-words");
  try {
    green("book as it is", "book: the book draws from the tree as it is (40 of 40, no brand page)", "book.mjs");
    red(
      "book with brandSizes missing from the words",
      "book: brandSizes: the brand page shows the template's English «sizes»",
      "book.mjs",
      ["--words", wordsWith(dir, "lost", (x) => delete x.brandSizes)],
    );
    red(
      "book with brandFloorText in English",
      "book: brandFloorText: the brand page shows the template's English",
      "book.mjs",
      ["--words", wordsWith(dir, "english", (x) => (x.brandFloorText = "The mark is the floor's text: the product's name set in the heading typeface, and no file."))],
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
};

cases["change-list"] = () => {
  const clone = workClone(ROOT);
  const at = (...args) => git(clone.dir, ...args);
  const mainNow = git(ROOT, "rev-parse", "origin/main").trim();
  at("update-ref", "refs/remotes/origin/main", mainNow);
  const head = at("rev-parse", "HEAD").trim();
  const edit = (rel, more) => appendFileSync(path.join(clone.dir, rel), more);
  // A commit with the changes of `rev`, edited by `change`, on `rev`'s parent.
  const remade = (rev, change) => {
    at("checkout", "-q", rev);
    change();
    at("add", "-A");
    at("reset", "-q", "--soft", `${rev}~1`);
    at("-c", "user.name=t", "-c", "user.email=t@t", "commit", "-q", "-m", "break");
    return at("rev-parse", "HEAD").trim();
  };
  // A branch: HEAD with one more commit made by `change`.
  const branch = (change) => {
    at("checkout", "-q", head);
    change();
    at("add", "-A");
    at("-c", "user.name=t", "-c", "user.email=t@t", "commit", "-q", "-m", "break");
  };
  try {
    const root = ["--root", clone.dir];
    green("change-list as it is", "changes: the upgrade commit changes its 14 files; the branch changes nothing beyond the upgrade and this record", "change-list.mjs", root);
    const extra = remade(UPGRADE, () => edit(LEDGER, "\n"));
    red("change-list with an extra upgrade file", `changes: upgrade commit changed outside the list: ${LEDGER}`, "change-list.mjs", [...root, "--upgrade", extra]);
    const lost = remade(UPGRADE, () => at("checkout", `${UPGRADE}~1`, "--", WORDS));
    red("change-list with a lost upgrade file", `changes: upgrade commit did not change: ${WORDS}`, "change-list.mjs", [...root, "--upgrade", lost]);
    branch(() => edit("Makefile", "\n"));
    red("change-list with Makefile on the branch", "changes: branch changed beyond the upgrade and this record: Makefile", "change-list.mjs", root);
    branch(() => edit(THEME, "\n"));
    red("change-list with the theme on the branch", `changes: branch changed beyond the upgrade and this record: ${THEME}`, "change-list.mjs", root);
    branch(() => edit("_acceptance/upgrade-design-assembly-0-69-0/contract.md", "\n"));
    red(
      "change-list with the 0.69.0 record changed",
      "changes: branch changed beyond the upgrade and this record: _acceptance/upgrade-design-assembly-0-69-0/contract.md",
      "change-list.mjs",
      root,
    );
    // A drawn page changed by hand in one place, one digit: the drawing of the records says otherwise.
    const shipped = text("PRODUCT-MAP.md").match(/Đã giao<br\/>(\d+) việc/);
    if (!shipped) throw new Error("PRODUCT-MAP.md has no count for «Đã giao»");
    branch(() => {
      const file = path.join(clone.dir, "PRODUCT-MAP.md");
      writeFileSync(file, readFileSync(file, "utf8").replace(`Đã giao<br/>${shipped[1]} việc`, `Đã giao<br/>${Number(shipped[1]) + 1} việc`));
    });
    red("change-list with one digit changed on the product map", "changes: PRODUCT-MAP.md is not what the records at HEAD draw", "change-list.mjs", root);
    branch(() => {
      const file = path.join(clone.dir, "LO-TRINH.html");
      const page = readFileSync(file, "utf8");
      if (!page.includes("<b>2</b> — kế hoạch")) throw new Error("LO-TRINH.html has no «<b>2</b> — kế hoạch» to change");
      writeFileSync(file, page.replace("<b>2</b> — kế hoạch", "<b>4</b> — kế hoạch"));
    });
    red("change-list with one digit changed on the roadmap page", "changes: LO-TRINH.html is not what the records at HEAD draw", "change-list.mjs", root);
    at("checkout", "-q", head);
    at("update-ref", "refs/remotes/origin/main", head);
    green("change-list once merged", "the branch is in origin/main already, so only the commit was compared", "change-list.mjs", root);
  } finally {
    clone.remove();
  }
};

// BASE is where the 0.69.0 tool comes from in decision-states; named here so a stale pin shows.
if (!git(ROOT, "cat-file", "-t", BASE).trim()) throw new Error(`no commit ${BASE}`);
for (const [name, body] of Object.entries(cases)) if (!only || only === name) body();
process.exitCode = failed ? 1 : 0;
