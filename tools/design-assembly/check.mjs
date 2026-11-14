// Checks the decisions this tool holds, shows every check failing on a changed copy, and validates
// the ledger that points at them.
// Usage: node tools/design-assembly/check.mjs [--rate] [--target DIR]
import { existsSync, readFileSync, realpathSync } from "node:fs";
import path from "node:path";
import { argv, cwd, exit, stderr, stdout } from "node:process";
import { fileURLToPath } from "node:url";

import { contrast } from "./color.mjs";
import { cellProblems, columnsProblem, readDisplays, typesProblem } from "./columns.mjs";
import { componentsProblem, readFolder, targetProblem } from "./components.mjs";
import { LEDGERS, shapeProblems } from "./contract.mjs";
import {
  LAYER_ALIASES,
  LAYERS,
  LEDGER,
  ledgerProblems,
  literally,
  oldLayerNames,
  parseLedger,
  pointerProblem,
  TOOL,
} from "./ledger.mjs";
import { toPx, toRatio, TYPE_STEPS } from "./scale.mjs";
import {
  channelsProblem,
  emptyStateProblem,
  errorCopyProblem,
  RECORD_LINE,
  screenLinksProblem,
  screenPaths,
  statesProblem,
  withRecordLayout,
  wordsProblem,
} from "./patterns.mjs";
import { againstDirection, importsProblem, readSources, slipsProblem } from "./governance.mjs";
import {
  kindsProblem,
  readPages,
  referenceProblem,
  screenLedgerProblem,
  sizesProblem,
} from "./screens.mjs";
import { DEFAULT_STYLESHEET, findStylesheet, loadStyles, resolve } from "./styles.mjs";
import { lintProbes } from "./lint.mjs";
import { probesFor, ruleOf } from "./probes.mjs";
import { buildTheme, readBlock, renderBlock, withoutBlock } from "./theme.mjs";
import { tokensProblem } from "./tokens.mjs";

export const FILES = {
  // What this tool needs to check its decisions: the stylesheet it reads, the inputs the decisions
  // were derived from, and one or more checks per decision id. The ledger says that the decisions
  // exist; this file says how this tool proves them.
  theme: "design/theme.json",
  ledger: LEDGER,
  // Where the guide writes its generated block. The checks read the stylesheet the tool data
  // names, which may be another file.
  css: DEFAULT_STYLESHEET,
  gate: "mk/design-assembly.mk",
};

// One entry per kind of check. `run` returns null when the check passes, else what is wrong.
// `change` returns the same state altered so that the check must fail.
const KINDS = {
  // What is applied is what the blueprint decides. An answer changed there without running the
  // guide again is not in force, and nothing else would say so.
  blueprint: {
    run(state, check) {
      let decided;
      try {
        decided = JSON.parse(state.files?.[check.file] ?? "null");
      } catch {
        return `${check.file} is not valid JSON`;
      }
      if (!decided) return `${check.file} is missing`;
      const context = decided.layers?.context?.choice ?? {};
      const foundations = decided.layers?.foundations?.choice ?? {};
      const answers = {
        sourceColor: foundations.source_color,
        conformanceLevel: context.conformance_level,
        typeScale: foundations.type_scale ?? "standard",
        typeRatio: foundations.type_ratio,
        cornerRadius: foundations.corner_radius ?? "floor",
      };
      const applied = state.theme?.inputs ?? {};
      const differs = Object.keys(applied).filter(
        (key) => String(answers[key]) !== String(applied[key]),
      );
      if (differs.length === 0) return null;
      return `${check.file} decides ${differs.map((key) => `${key}: ${answers[key]}`).join(", ")}, and what is applied is ${differs.map((key) => applied[key]).join(", ")}: run the guide again, or put the answer back`;
    },
    change(state, check) {
      const decided = JSON.parse(state.files?.[check.file] ?? "{}");
      const layers = decided.layers ?? {};
      const foundations = layers.foundations ?? {};
      const changed = {
        ...decided,
        layers: {
          ...layers,
          foundations: {
            ...foundations,
            choice: { ...foundations.choice, source_color: "#010203" },
          },
        },
      };
      return { ...state, files: { ...state.files, [check.file]: JSON.stringify(changed) } };
    },
  },
  // A record opens the way the blueprint decides. The guide writes it into the record panel; a hand
  // edit there, or an answer changed without running the guide again, is not in force.
  "record-layout": {
    run(state, check) {
      const source = state.files?.[check.file];
      if (source === null || source === undefined) return `${check.file} is missing`;
      const written = RECORD_LINE.exec(source)?.[1];
      if (!written) {
        return `${check.file} no longer says how a record opens: put back its RECORD_LAYOUT line, or run the guide again`;
      }
      let decided;
      try {
        decided = JSON.parse(state.files?.[check.blueprint] ?? "null");
      } catch {
        return `${check.blueprint} is not valid JSON`;
      }
      const answer = decided?.layers?.patterns?.choice?.record_panel;
      if (!answer) return `${check.blueprint} does not decide how a record opens`;
      if (answer === written) return null;
      return `${check.blueprint} decides that a record opens ${answer}, and ${check.file} opens it ${written}: run the guide again, or put the answer back`;
    },
    change(state, check) {
      const source = state.files?.[check.file] ?? "";
      const written = RECORD_LINE.exec(source)?.[1];
      const other = written === "over" ? "beside" : "over";
      return {
        ...state,
        files: { ...state.files, [check.file]: withRecordLayout(source, other) ?? "" },
      };
    },
  },
  generated: {
    run(state) {
      const block = readBlock(state.css);
      if (block === null) return `the generated block is missing from ${state.stylesheet}`;
      const expected = renderBlock(buildTheme(state.theme.inputs, state.css));
      if (block === expected) return null;
      return "the generated block is not what the source color gives: run the guide again instead of editing it";
    },
    change(state) {
      const block = readBlock(state.css) ?? "";
      const edited = block.replace(/(--ring: oklch\()([\d.]+)/, (_, head, lightness) => {
        return `${head}${Number(lightness) > 0.5 ? "0.111" : "0.888"}`;
      });
      return { ...state, css: state.css.replace(block, edited) };
    },
  },
  contrast: {
    run(state, check) {
      const foreground = resolve(state, check.scope, check.foreground);
      const background = resolve(state, check.scope, check.background);
      if (!foreground?.color || !background?.color) {
        return `cannot read ${check.foreground} and ${check.background} in ${[check.scope].flat().join(", ")}`;
      }
      const ratio = contrast(foreground.color, background.color);
      if (ratio >= check.min) return null;
      return `${check.foreground} on ${check.background} in ${[check.scope].flat().join(", ")} has a contrast ratio of ${ratio.toFixed(2)}:1, below ${check.min}:1`;
    },
    change(state, check) {
      const background = resolve(state, check.scope, check.background);
      const where = [check.scope].flat()[0];
      const same = `${where} {\n  ${check.foreground}: ${background?.value ?? "oklch(1 0 0)"};\n}\n`;
      return { ...state, css: `${state.css}\n${same}` };
    },
  },
  // The variable resolves to the decided value: nothing later in the stylesheet overrides it.
  value: {
    run(state, check) {
      const found = resolve(state, check.scope, check.variable);
      if (found === null) return `${check.variable} is not declared in ${check.scope}`;
      if (found.value.replace(/\s+/g, " ") === check.expected) return null;
      return `${check.variable} in ${check.scope} is ${found.value}, not the decided ${check.expected}`;
    },
    change(state, check) {
      const other = check.expected === "1px" ? "2px" : "1px";
      return {
        ...state,
        css: `${state.css}\n${check.scope} {\n  ${check.variable}: ${other};\n}\n`,
      };
    },
  },
  // The floor's standard is kept: the stylesheet declares none of these variables itself.
  absent: {
    run(state, check) {
      const own = withoutBlock(state.css);
      const found = check.variables.filter((name) =>
        new RegExp(`(^|[\\s;{])${literally(name)}\\s*:`, "m").test(own),
      );
      if (found.length === 0) return null;
      return `${found.join(", ")} declared in ${state.stylesheet}: the decision keeps the framework's standard, so change the decision instead`;
    },
    change(state, check) {
      return { ...state, css: `${state.css}\n:root {\n  ${check.variables[0]}: 1px;\n}\n` };
    },
  },
  // Every step of the type scale is larger than the one before, and its lines do not overlap.
  scale: {
    run(state) {
      const steps = TYPE_STEPS.map(([step]) => ({
        step,
        size: toPx(resolve(state, ":root", `--text-${step}`)?.value),
        leading: toRatio(resolve(state, ":root", `--text-${step}--line-height`)?.value),
      }));
      const unreadable = steps.find((s) => s.size === null || s.leading === null);
      if (unreadable) return `cannot read --text-${unreadable.step} and its line height`;
      for (let i = 1; i < steps.length; i += 1) {
        if (steps[i].size <= steps[i - 1].size) {
          return `text-${steps[i].step} (${steps[i].size}px) is not larger than text-${steps[i - 1].step} (${steps[i - 1].size}px)`;
        }
      }
      const tight = steps.find((s) => s.leading < 1);
      if (tight) return `text-${tight.step} has a line height below its size, so its lines overlap`;
      return null;
    },
    change(state) {
      const base = resolve(state, ":root", "--text-base")?.value ?? "1rem";
      return { ...state, css: `${state.css}\n:root {\n  --text-lg: ${base};\n}\n` };
    },
  },
  // The design tokens file says what the stylesheet says: it was written from it, not by hand.
  tokens: {
    run(state, check) {
      return tokensProblem(state.files?.[check.file], state, check.file, state.stylesheet);
    },
    // A new theme variable is a new token: the file on disk no longer matches.
    change(state) {
      return { ...state, css: `${state.css}\n@theme inline {\n  --color-changed-copy: #000;\n}\n` };
    },
  },
  // The component manifest says what the source says: the components exported, and their variants.
  components: {
    run(state, check) {
      const read = check.own ?? check.folder;
      const files = state.folders?.[read] ?? {};
      return componentsProblem(state.files?.[check.file], files, check.file, read, {
        library: [check.folder, ...(check.libraries ?? [])],
        pages: check.pages ? (state.pages?.[check.pages] ?? {}) : {},
      });
    },
    // A new source file is a new component: the file on disk no longer matches.
    change(state, check) {
      const read = check.own ?? check.folder;
      const added = `${check.folder}/changed-copy.tsx`;
      const files = {
        ...state.folders?.[read],
        [added]: "export function ChangedCopy() {}\n",
      };
      return { ...state, folders: { ...state.folders, [read]: files } };
    },
  },
  // Every ledger of the repository has the one shape the contract gives it, at a version this
  // tool reads.
  shapes: {
    run(state, check) {
      // Every ledger of the contract the repository has, at the path the check names for it or
      // at its usual one: a ledger added after this check was installed is held too.
      const problems = Object.entries(LEDGERS)
        .filter(([, ledger]) => ledger.file)
        .flatMap(([kind, ledger]) => {
          const file = check.ledgers?.[kind] ?? ledger.file;
          return shapeProblems(kind, state.files?.[file], file);
        });
      if (check.pages) {
        for (const [file, text] of Object.entries(state.pages?.[check.pages] ?? {})) {
          problems.push(...shapeProblems("screen-kinds", text, file));
        }
      }
      if (problems.length === 0) return null;
      const more = problems.length > 3 ? `; and ${problems.length - 3} more` : "";
      return `${problems.slice(0, 3).join("; ")}${more}: see the design-assembly plugin's references/contract.md`;
    },
    // The first ledger read says it has a newer shape than this tool knows; where none carries a
    // version yet, the decisions ledger does.
    change(state, check) {
      const versioned = Object.entries(LEDGERS)
        .filter(([, ledger]) => ledger.file?.endsWith(".json") && ledger.version)
        .map(([kind, ledger]) => check.ledgers?.[kind] ?? ledger.file)
        .find((name) => state.files?.[name]);
      if (!versioned) {
        const ledger = check.ledgers?.decisions ?? LEDGERS.decisions.file;
        return { ...state, files: { ...state.files, [ledger]: "version: 99\n" } };
      }
      const data = JSON.parse(state.files[versioned]);
      const changed = { ...data, version: typeof data.version === "string" ? "99" : 99 };
      return { ...state, files: { ...state.files, [versioned]: JSON.stringify(changed) } };
    },
  },
  // Every control declares a height that reaches the target size of the conformance level.
  "target-size": {
    run(state, check) {
      return targetProblem(state.folders?.[check.folder] ?? {}, check.min, check.folder);
    },
    // A control far below any target size: the check must name it.
    change(state, check) {
      const added = `${check.folder}/changed-copy.tsx`;
      const source = 'export function ChangedCopy() {\n  return <button className="h-1" />;\n}\n';
      const files = { ...state.folders?.[check.folder], [added]: source };
      return { ...state, folders: { ...state.folders, [check.folder]: files } };
    },
  },
  // The table of column types is well formed, and every field of the data model names one of them.
  "column-types": {
    run(state, check) {
      return typesProblem(state.files?.[check.file], state.displays ?? {}, check.file);
    },
    // A field that names a type nobody listed.
    change(state) {
      return { ...state, displays: { ...state.displays, "ChangedCopy.field": "not-a-type" } };
    },
  },
  // The file code reads is exactly what the table and the data model give.
  columns: {
    run(state, check) {
      const types = state.files?.[check.types];
      return columnsProblem(state.files?.[check.file], types, state.displays ?? {}, check.file);
    },
    // One more typed field in the data model: the file on disk no longer matches.
    change(state, check) {
      const first = Object.keys(JSON.parse(state.files?.[check.types] ?? "{}").types ?? {})[0];
      return { ...state, displays: { ...state.displays, "ChangedCopy.field": first } };
    },
  },
  // No screen sets on a table what the column type decides.
  cells: {
    run(state, check) {
      return cellProblems(state.folders?.[check.folder] ?? {}, check.rule, check.skip);
    },
    change(state, check) {
      const added = `${check.folder}/changed-copy.tsx`;
      const source =
        'export const ChangedCopy = () => (\n  <tr className="h-9">\n    <td className="w-40 text-right" />\n  </tr>\n);\n';
      const files = { ...state.folders?.[check.folder], [added]: source };
      return { ...state, folders: { ...state.folders, [check.folder]: files } };
    },
  },
  // Every screen of the registry declares the states every view of data has.
  states: {
    run(state, check) {
      const ledger = check.ledger ? (state.files?.[check.ledger] ?? "") : null;
      return statesProblem(
        state.files?.[check.file],
        state.files?.[check.registry],
        check.file,
        ledger,
      );
    },
    // One more screen, with only its ready state.
    change(state, check) {
      if (check.ledger) {
        const added =
          "  - id: changed-copy\n    route: /changed-copy\n    title: null\n    family: null\n    status: built\n    states:\n      - ready\n";
        const ledger = `${state.files?.[check.ledger] ?? "screens:\n"}${added}`;
        return { ...state, files: { ...state.files, [check.ledger]: ledger } };
      }
      const added =
        '\nexport const CHANGED = [{ path: "/changed-copy", states: [{ name: "ready" }] }];\n';
      const registry = `${state.files?.[check.registry] ?? ""}${added}`;
      return { ...state, files: { ...state.files, [check.registry]: registry } };
    },
  },
  // The ledger of screens has its shape and lists the screens the code lists, each of a kind.
  "screen-ledger": {
    run(state, check) {
      const text = state.files?.[check.file];
      const shape =
        text === null || text === undefined ? [] : shapeProblems("screens", text, check.file);
      if (shape.length > 0) return shape.slice(0, 3).join("; ");
      return screenLedgerProblem(
        text,
        state.files?.[check.registry],
        check.pages ? (state.pages?.[check.pages] ?? {}) : {},
        check.file,
      );
    },
    // The last screen leaves the ledger and stays in the code.
    change(state, check) {
      const text = state.files?.[check.file] ?? "";
      const last = text.lastIndexOf("\n  - id:");
      const cut = last === -1 ? "screens:\n" : `${text.slice(0, last)}\n`;
      return { ...state, files: { ...state.files, [check.file]: cut } };
    },
  },
  // No screen writes its own words.
  words: {
    run(state, check) {
      return wordsProblem(state.folders?.[check.folder] ?? {}, check.skip);
    },
    change(state, check) {
      const added = `${check.folder}/changed-copy.tsx`;
      const source = 'export const ChangedCopy = () => <p title="Changed copy">Changed copy</p>;\n';
      const files = { ...state.folders?.[check.folder], [added]: source };
      return { ...state, folders: { ...state.folders, [check.folder]: files } };
    },
  },
  // No screen opens a browser dialog or calls a toast library itself.
  channels: {
    run(state, check) {
      // Every source file where the check names them; the screens alone in an older setting.
      const files = state.sources?.[check.sources] ?? state.folders?.[check.folder] ?? {};
      return channelsProblem(files, check.skip);
    },
    change(state, check) {
      const added = `${check.folder}/changed-copy.tsx`;
      const source =
        "export const ChangedCopy = () => <button onClick={() => window.alert(text)} />;\n";
      const files = { ...state.folders?.[check.folder], [added]: source };
      const sources = check.sources
        ? {
            ...state.sources,
            [check.sources]: { ...state.sources?.[check.sources], [added]: source },
          }
        : state.sources;
      return { ...state, sources, folders: { ...state.folders, [check.folder]: files } };
    },
  },
  // No empty state dresses a link as a button.
  "empty-state": {
    run(state, check) {
      return emptyStateProblem(state.sources?.[check.sources] ?? {}, check.skip);
    },
    change(state, check) {
      const added = `${check.sources}/changed-copy.tsx`;
      const source =
        'export const ChangedCopy = () => <Empty><a href="/" className={buttonVariants()}>{word}</a></Empty>;\n';
      const files = { ...state.sources?.[check.sources], [added]: source };
      return { ...state, sources: { ...state.sources, [check.sources]: files } };
    },
  },
  // No screen links to another screen: moving between them is the frame's.
  "screen-links": {
    run(state, check) {
      const paths = screenPaths(state.files?.[check.registry], state.files?.[check.ledger] ?? null);
      return screenLinksProblem(state.sources?.[check.sources] ?? {}, paths, check.skip);
    },
    change(state, check) {
      const to =
        screenPaths(state.files?.[check.registry], state.files?.[check.ledger] ?? null)[0] ?? "/";
      const added = `${check.sources}/example/changed-copy.tsx`;
      const source = `export const ChangedCopy = () => <a href="${to}">{word}</a>;\n`;
      const files = { ...state.sources?.[check.sources], [added]: source };
      return { ...state, sources: { ...state.sources, [check.sources]: files } };
    },
  },
  // Every error message a screen shows says what happened and what to do next.
  "error-copy": {
    run(state, check) {
      return errorCopyProblem(state.folders?.[check.folder] ?? {}, check.skip);
    },
    change(state, check) {
      const added = `${check.folder}/changed-copy.tsx`;
      const source =
        'export const ChangedCopy = () => (\n  <Alert variant="destructive">\n    <AlertTitle>{title}</AlertTitle>\n  </Alert>\n);\n';
      const files = { ...state.folders?.[check.folder], [added]: source };
      return { ...state, folders: { ...state.folders, [check.folder]: files } };
    },
  },
  // Every screen is of one kind, and every kind has a page that names its main task.
  "screen-kinds": {
    run(state, check) {
      const pages = state.pages?.[check.pages] ?? {};
      const sources = state.folders?.[check.folder] ?? {};
      return kindsProblem(
        pages,
        state.files?.[check.registry],
        sources,
        check.pages,
        state.files?.[check.ledger] ?? null,
      );
    },
    // No page at all: every screen is left without a kind.
    change(state, check) {
      return { ...state, pages: { ...state.pages, [check.pages]: {} } };
    },
  },
  // The reference screen of each kind is a real screen of that kind with every required state.
  "reference-screens": {
    run(state, check) {
      const pages = state.pages?.[check.pages] ?? {};
      const sources = state.folders?.[check.folder] ?? {};
      const registry = state.files?.[check.registry];
      return referenceProblem(
        pages,
        registry,
        state.files?.[check.file],
        sources,
        state.files?.[check.ledger] ?? null,
      );
    },
    // One more required state, which no screen declares.
    change(state, check) {
      const table = JSON.parse(state.files?.[check.file] ?? "{}");
      const required = [...(table.required ?? []), "changed-copy"];
      const text = JSON.stringify({ ...table, required });
      return { ...state, files: { ...state.files, [check.file]: text } };
    },
  },
  // Pages are checked at the widths a person listed, the reflow width among them.
  "screen-sizes": {
    run(state, check) {
      return sizesProblem(
        state.files?.[check.file],
        state.files?.[check.test],
        check.file,
        check.test,
      );
    },
    // Only a wide screen is left.
    change(state, check) {
      const text = JSON.stringify({ version: 1, widths: [1440] });
      return { ...state, files: { ...state.files, [check.file]: text } };
    },
  },
  // No part of the code imports a part listed above it.
  "import-direction": {
    run(state, check) {
      const sources = state.sources?.[check.sources] ?? {};
      return importsProblem(
        state.files?.[check.file],
        sources,
        state.pages?.[check.pages],
        check.file,
      );
    },
    // The lowest part imports a file of the highest.
    change(state, check) {
      const sources = state.sources?.[check.sources] ?? {};
      const changed = againstDirection(
        state.files?.[check.file],
        sources,
        state.pages?.[check.pages],
      );
      return { ...state, sources: { ...state.sources, [check.sources]: changed } };
    },
  },
  // A rule of the repository's own lint holds the decision: the lint rejects every probe that
  // breaks it. The changed copy is the same lint with the rules that rejected them turned off.
  lint: {
    run(state, check, id) {
      const result = state.lint?.[lintKey(id, check)];
      if (!result) return `the repository's lint was not run for ${check.rule}`;
      if (result.error) return result.error;
      const through = result.labels.filter((_, index) => result.fired[index].length === 0);
      if (through.length === 0) return null;
      return `the repository's lint lets through ${through.map((label) => `\`${label}\``).join(", ")}, at ${check.at}`;
    },
    change(state, check, id) {
      const key = lintKey(id, check);
      const result = state.lint?.[key];
      if (!result || result.error) return state;
      return { ...state, lint: { ...state.lint, [key]: { ...result, fired: result.off } } };
    },
  },
  // Every line of the record of what slipped past the checks can be acted on.
  slips: {
    run(state, check) {
      return slipsProblem(state.files?.[check.file], check.file);
    },
    // One more line, which names no layer.
    change(state, check) {
      const text = `${state.files?.[check.file] ?? "| a | b | c | d |\n| - | - | - | - |"}\n| 2000-01-01 | a changed copy | nowhere | nothing |\n`;
      return { ...state, files: { ...state.files, [check.file]: text } };
    },
  },
  gate: {
    run(state) {
      if (state.gate === null) return `${FILES.gate} is missing, so make check does not run this`;
      if (!/^CHECK_TARGETS \+= .*\bdesign-assembly\b/m.test(state.gate)) {
        return `${FILES.gate} does not add design-assembly to CHECK_TARGETS`;
      }
      if (!/^\t@?node tools\/design-assembly\/check\.mjs$/m.test(state.gate)) {
        return `${FILES.gate} does not run the check, or runs it in a way that cannot fail`;
      }
      // The gate itself must still run what the included files add to it.
      if (!/^check:.*(\$\(CHECK_TARGETS\)|\bdesign-assembly\b)/m.test(state.makefile ?? "")) {
        return "the Makefile's check target no longer runs CHECK_TARGETS, so make check does not run this";
      }
      return null;
    },
    change(state) {
      return { ...state, gate: (state.gate ?? "").replace(/^\t@?node /m, "\t-@node ") };
    },
  },
};

const lintKey = (id, check) => `${id}:${check.rule}`;

// The lint rules the ledger points at, for the probe about exceptions.
const pointedRules = (rows) =>
  [...new Set((rows ?? []).map((row) => ruleOf(row.check)))].filter(Boolean);

// Runs the repository's lint once for every lint check of `checks` (by decision id), and returns
// what it rejected, keyed for the checks. `rows` are the ledger's rows.
export function lintResults(root, checks, rows) {
  const jobs = [];
  const labels = {};
  const missing = {};
  for (const [id, list] of Object.entries(checks ?? {})) {
    for (const check of list.filter((item) => item.kind === "lint")) {
      const key = lintKey(id, check);
      const rules = pointedRules(rows).filter((rule) => rule !== check.rule);
      const probes = probesFor(id, { component: check.component ?? null, rules });
      if (!probes) {
        missing[key] = { error: `this tool has no probe that breaks ${id}` };
        continue;
      }
      labels[key] = probes.probes.map((probe) => probe.label);
      jobs.push({
        key,
        at: check.at,
        control: probes.control,
        probes: probes.probes.map((probe) => probe.text),
      });
    }
  }
  const linted = lintProbes(root, jobs);
  return {
    ...missing,
    ...Object.fromEntries(
      Object.entries(linted).map(([key, result]) => [key, { ...result, labels: labels[key] }]),
    ),
  };
}

// Whether this tool holds a row: the row points at the tool, or at the lint rule the tool re-runs
// for it.
export function heldHere(row, checks) {
  if (row.check === TOOL) return true;
  const rule = ruleOf(row.check);
  const mine = checks?.[String(row.id)] ?? [];
  return (
    Boolean(rule) &&
    mine.length > 0 &&
    mine.every((check) => check.kind === "lint" && check.rule === rule)
  );
}

// The source folders a set of checks reads, each once.
export function checkFolders(checks) {
  return [...new Set(checks.flatMap((check) => [check.folder, check.own]).filter(Boolean))];
}

export function readState(root) {
  const read = (file) => {
    const full = path.join(root, file);
    return existsSync(full) ? readFileSync(full, "utf8") : null;
  };
  const theme = read(FILES.theme);
  const ledger = read(FILES.ledger);
  const data = theme === null ? null : JSON.parse(theme);
  const stylesheet = data?.stylesheet ?? findStylesheet(root) ?? DEFAULT_STYLESHEET;
  // Other files a check names, as they are on disk.
  const checks = Object.values(data?.checks ?? {}).flat();
  // Every ledger of the contract is read where it usually is, whether or not a check names it.
  const usual = Object.values(LEDGERS)
    .map((ledger) => ledger.file)
    .filter(Boolean);
  const named = [...checks, { ledgers: usual }]
    .flatMap((check) => [
      check.file,
      check.types,
      check.registry,
      check.test,
      check.blueprint,
      check.ledger,
      ...Object.values(check.ledgers ?? {}),
    ])
    .filter(Boolean)
    .map((file) => [file, read(file)]);
  // Source folders a check names, file by file.
  const folders = checkFolders(checks).map((folder) => [folder, readFolder(root, folder)]);
  // Folders whose every source file a check reads, plain modules included.
  const sources = checks
    .filter((check) => check.sources)
    .map((check) => [check.sources, readSources(root, check.sources)]);
  // Folders of pages a check names, page by page.
  const pages = checks
    .filter((check) => check.pages)
    .map((check) => [check.pages, readPages(root, check.pages)]);
  const rows = ledger === null ? null : parseLedger(ledger);
  return {
    root,
    theme: data,
    ledger: rows,
    // What the repository's own lint rejects, for the decisions it holds.
    lint: lintResults(root, data?.checks, rows),
    stylesheet,
    // `css` is the repository's own text with its relative imports put in place; `base` is the
    // framework's theme, read only when a value points into it.
    ...loadStyles(root, stylesheet),
    files: Object.fromEntries(named),
    folders: Object.fromEntries(folders),
    pages: Object.fromEntries(pages),
    sources: Object.fromEntries(sources),
    // The column type each field of the data model names.
    displays: readDisplays(root),
    gate: read(FILES.gate),
    makefile: read("Makefile"),
  };
}

// For every decision this tool holds: what is wrong, or null, and whether each of its checks was
// seen failing on a changed copy.
export function runChecks(state) {
  return Object.entries(state.theme?.checks ?? {}).map(([id, checks]) => {
    const problems = [];
    let seenFailing = true;
    for (const check of checks) {
      const kind = KINDS[check.kind];
      if (!kind) {
        problems.push(`unknown check ${check.kind}`);
        continue;
      }
      const problem = kind.run(state, check, id);
      if (problem) problems.push(problem);
      if (kind.run(kind.change(state, check, id), check, id) === null) seenFailing = false;
    }
    return {
      id,
      problem: problems.length > 0 ? problems.join("; ") : null,
      seenFailing,
      held: problems.length === 0 && seenFailing,
    };
  });
}

// The ledger and this tool must agree in both directions.
function crossProblems(state, results) {
  const rows = state.ledger ?? [];
  const pointed = rows.filter((row) => row.check === TOOL).map((row) => row.id);
  const mine = rows.filter((row) => heldHere(row, state.theme?.checks)).map((row) => row.id);
  const held = results.map((r) => r.id);
  return [
    ...pointed
      .filter((id) => !held.includes(id))
      .map((id) => `${id}: the ledger points at this tool, which holds no check for it`),
    ...held
      .filter((id) => !mine.includes(id))
      .map(
        (id) =>
          `${id}: held by this tool but not a row of ${FILES.ledger} that points at it, or at the lint rule it re-runs`,
      ),
  ];
}

// Every row of the ledger with how it is held.
export function ledgerView(state) {
  const results = runChecks(state);
  return (state.ledger ?? []).map((row) => {
    const id = String(row.id);
    if (!row.check)
      return { id, kind: row.kind, state: row.kind === "judgment" ? "recorded" : "not held" };
    if (heldHere(row, state.theme?.checks)) {
      const mine = results.find((r) => r.id === id);
      const by = row.check === TOOL ? undefined : `${row.check}, re-run here`;
      return { id, kind: row.kind, state: mine?.held ? "held" : "FAILING", ...(by ? { by } : {}) };
    }
    const broken = pointerProblem(state.root, id, row.check);
    return { id, kind: row.kind, state: broken ? "FAILING" : "claimed", by: row.check };
  });
}

function main() {
  const args = argv.slice(2);
  const at = args.indexOf("--target");
  const root = at === -1 ? cwd() : path.resolve(args[at + 1] ?? "");
  const state = readState(root);
  if (state.theme === null || state.ledger === null) {
    stderr.write(
      `design-assembly: ${FILES.theme} or ${FILES.ledger} is missing. Run the guide first.\n`,
    );
    exit(1);
  }
  const results = runChecks(state);
  const problems = [
    ...results.flatMap((r) => {
      if (r.problem) return [`${r.id}: ${r.problem}`];
      return r.seenFailing ? [] : [`${r.id}: the check cannot fail, so it proves nothing`];
    }),
    ...crossProblems(state, results),
    ...ledgerProblems(root, state.ledger, [...LAYERS, ...Object.keys(LAYER_ALIASES)]),
  ];
  if (args.includes("--rate")) {
    const view = ledgerView(state);
    const count = (name) => view.filter((row) => row.state === name).length;
    const automatic = count("held") + count("claimed");
    const percent = Math.round((100 * automatic) / view.length);
    stdout.write(`determinism rate: ${automatic}/${view.length} (${percent}%)\n`);
    stdout.write(
      `  ${count("held")} held and re-run here, ${count("claimed")} claimed by another check and not re-run\n`,
    );
    for (const row of view) {
      stdout.write(
        `  ${row.state.padEnd(8)} ${row.kind.padEnd(8)} ${row.id}${row.by ? `  (${row.by})` : ""}\n`,
      );
    }
    for (const line of oldLayerNames(state.ledger))
      stdout.write(`  note: older layer name, ${line}\n`);
  }
  if (problems.length > 0) {
    stderr.write(`design-assembly: ${problems.length} problem(s)\n`);
    for (const line of problems) stderr.write(`  ${line}\n`);
    exit(1);
  }
  const count = results.reduce((sum, r) => sum + state.theme.checks[r.id].length, 0);
  stdout.write(
    `design-assembly: ${results.length} decisions held by ${count} checks, each seen failing on a changed copy\n`,
  );
}

// Runs only when this file is the script. Real paths on both sides: a folder reached through a
// link would otherwise look like an import, and the check would pass without running.
if (argv[1] && realpathSync(argv[1]) === realpathSync(fileURLToPath(import.meta.url))) main();
