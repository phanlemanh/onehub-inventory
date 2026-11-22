// Checks the decisions this tool holds, shows every check failing on a changed copy, and validates
// the ledger that points at them.
// Usage: node tools/design-assembly/check.mjs [--rate] [--target DIR]
import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, realpathSync, statSync } from "node:fs";
import path from "node:path";
import { argv, cwd, exit, stderr, stdout } from "node:process";
import { fileURLToPath } from "node:url";

import { contrast } from "./color.mjs";
import { cellProblems, columnsProblem, readDisplays, typesProblem } from "./columns.mjs";
import {
  componentsProblem,
  keepsSettings,
  libraryParts,
  readFolder,
  targetProblem,
  UNTRACKED,
} from "./components.mjs";
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
import {
  offersOf,
  readModel,
  screenActionsDebts,
  screenActionsProblem,
} from "./screen-actions.mjs";
import { seenFilesProblem } from "./screen-actions-seen.mjs";
import { drawDerived, keptOutOfGit } from "./derived.mjs";
import {
  FRAGMENT_LEDGERS,
  FRAGMENTS,
  joinFound,
  ledgerOf,
  ledgerText,
  readFragments,
} from "./screen-fragments.mjs";
import {
  FRAGMENTS_SHARED,
  joinLedger,
  listLine,
  readScreenLedger,
  twinNames,
} from "./screen-ledger.mjs";
import { DEFAULT_STYLESHEET, findStylesheet, loadStyles, resolve } from "./styles.mjs";
import { lintProbes } from "./lint.mjs";
import { probesFor, ruleOf } from "./probes.mjs";
import {
  buildTheme,
  END,
  readBlock,
  readVariable,
  renderBlock,
  sourcedFont,
  withoutBlock,
} from "./theme.mjs";
import { tokensProblem } from "./tokens.mjs";
import { buildOf } from "./adapters/index.mjs";
import { fontProblems, readLoads, unloadedCopy } from "./fonts.mjs";
import { readFontSources } from "./sources-ledger.mjs";
import {
  branchFacts,
  branchDone,
  branchNotes,
  sheetProblem,
  taggedTests,
  wallProblem,
} from "./owner-calls.mjs";
import { readWaiting } from "./waiting.mjs";

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

// What a font of the sources ledger is read from when the block is written again: the fonts of
// the ledger as the repository holds them now, the stylesheet the block sits in, and the build's
// own way to write what loads a font, where it has one.
export const fontContext = (state) => ({
  sources: state.fontSources ?? [],
  stylesheet: state.stylesheet,
  faces: state.fontFaces ?? null,
});

// The mode a scope stands for: the light one is :root, any other is a dark one.
const modeOf = (scope) => ([scope].flat()[0] === ":root" ? "light" : "dark");
// A pair of colour roles as a sentence names it: the two roles, the mode and its selectors.
const pairName = (check) =>
  `${check.foreground} on ${check.background} in ${modeOf(check.scope)} mode (${[check.scope].flat().join(", ")})`;
// The contrast ratio of a pair as the stylesheet stands, or why it cannot be read.
function measuredPair(state, check) {
  const foreground = resolve(state, check.scope, check.foreground);
  const background = resolve(state, check.scope, check.background);
  if (!foreground?.color || !background?.color) {
    return {
      problem: `cannot read ${check.foreground} and ${check.background} in ${[check.scope].flat().join(", ")}`,
    };
  }
  return { ratio: contrast(foreground.color, background.color) };
}
// Whether the typeface row checks the fonts of the sources ledger it chose: a repository the guide
// wrote before it did keeps hearing a font's fault from the generated block.
const fontRowHeld = (state) =>
  (state.theme?.checks?.typeface ?? []).some((check) => check.kind === "font-row");

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
        textFont: foundations.text_font,
        headingFont: foundations.heading_font,
      };
      const applied = state.theme?.inputs ?? {};
      // The owner's word for each question of the table of colour roles, as the guide applies it.
      const words = decided.layers?.foundations?.roles;
      if (words) {
        answers.colorRoles = Object.fromEntries(
          Object.entries(words).map(([question, word]) => [question, word?.source]),
        );
      }
      // The neutral family and the status tones are answers once the owner's word is that the
      // formula writes their roles; a brand's own colour for a tone is an answer of its own.
      const formula = (question) => words?.[question]?.source === "formula";
      if (formula("color-roles-neutral")) answers.neutralFamily = foundations.neutral_family;
      // The tones are a set: in any order, each once.
      const toneSet = (list) => [...new Set(list)].sort();
      if (formula("color-roles-status")) {
        answers.statusTones = toneSet([foundations.status_tones ?? []].flat());
      }
      const own = decided.layers?.foundations?.brand_exceptions;
      if (own) {
        answers.exceptions = Object.fromEntries(
          Object.entries(own).map(([role, item]) => [
            role,
            { light: item?.light, dark: item?.dark },
          ]),
        );
      }
      // What is applied, the status tones by their names: the guide copies each tone's entry of
      // the plugin's closed list, which the blueprint does not hold.
      const appliedSaid = {
        ...applied,
        ...(applied.statusTones
          ? { statusTones: toneSet(applied.statusTones.map((tone) => tone.tone)) }
          : {}),
      };
      // The typeface and the colour roles came later: an answer the blueprint gives and nothing
      // applied is not in force. `follows` is what the guide derives from the words, not an answer.
      const later = [
        "textFont",
        "headingFont",
        "colorRoles",
        "neutralFamily",
        "statusTones",
        "exceptions",
      ].filter((key) => answers[key] !== undefined);
      const said = (value) =>
        value !== null && typeof value === "object"
          ? JSON.stringify(Object.entries(value).sort())
          : String(value);
      const differs = [...new Set([...Object.keys(applied), ...later])]
        .filter((key) => key !== "follows")
        .filter((key) => said(answers[key]) !== said(appliedSaid[key]));
      if (differs.length === 0) return null;
      const shown = (value) =>
        value !== null && typeof value === "object" ? JSON.stringify(value) : value;
      return `${check.file} decides ${differs.map((key) => `${key}: ${shown(answers[key])}`).join(", ")}, and what is applied is ${differs.map((key) => shown(appliedSaid[key])).join(", ")}: run the guide again, or put the answer back`;
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
      let expected;
      try {
        expected = renderBlock(buildTheme(state.theme.inputs, state.css, fontContext(state)));
      } catch (error) {
        // A chosen font whose row is gone, waits on its licence or no longer pins what the
        // repository holds is the typeface's fault, said under its row where the row checks it:
        // the rest of the block is still held here, up to the typefaces.
        if (error.font && fontRowHeld(state)) {
          const rest = Object.fromEntries(
            Object.entries(state.theme.inputs).filter(
              ([key]) => !["textFont", "headingFont"].includes(key),
            ),
          );
          const prefix = renderBlock(buildTheme(rest, state.css)).slice(0, -END.length);
          if (block.startsWith(prefix)) return null;
          return "the generated block is not what the source color gives: run the guide again instead of editing it";
        }
        // The repository no longer gives what the decided inputs need, such as the floor's font,
        // or the row of a chosen font with its licence and a pin that still holds.
        return `the generated block cannot be written again from what was decided: ${error.message}`;
      }
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
  // A pair of colour roles reaches the contrast ratio of its threshold. A pair the guide measured
  // below it while a role of it waits on the owner says `waits`: it is named with its ratio on every
  // run and does not fail, until the owner answers and the guide runs again. It still fails when a
  // role of it can no longer be read, since then nothing is measured.
  contrast: {
    // A pair that waits is still held to the ratio it was measured at when it began to wait
    // (`measured`): it may not get worse while the owner has not answered. A pair written before
    // that ratio was kept is named on every run, as before, and held once the guide runs again.
    run(state, check) {
      const measured = measuredPair(state, check);
      if (measured.problem) return measured.problem;
      if (measured.ratio >= check.min) return null;
      if (check.waits) {
        const now = Number(measured.ratio.toFixed(2));
        if (typeof check.measured !== "number" || now >= check.measured) return null;
        return `${pairName(check)} measured ${check.measured.toFixed(2)}:1 when it began to wait on ${check.waits}, and is now ${measured.ratio.toFixed(2)}:1: a pair that waits on the owner may not get worse`;
      }
      return `${pairName(check)} has a contrast ratio of ${measured.ratio.toFixed(2)}:1, below ${check.min}:1`;
    },
    notes(state, check) {
      if (!check.waits) return [];
      const measured = measuredPair(state, check);
      if (measured.problem || measured.ratio >= check.min) return [];
      const unheld =
        typeof check.measured === "number"
          ? `, and held at ${check.measured.toFixed(2)}:1, the ratio it began to wait at`
          : "; the ratio it began at is not kept: run the guide again to hold it there";
      return [
        `${pairName(check)} measures ${measured.ratio.toFixed(2)}:1, below ${check.min}:1: not checked until the owner answers ${check.waits}${unheld}`,
      ];
    },
    change(state, check) {
      const where = [check.scope].flat()[0];
      // A pair held at the ratio it began to wait at: its text on its own ground, 1:1, below it.
      if (check.waits && typeof check.measured === "number") {
        const ground = resolve(state, check.scope, check.background);
        const same = `${where} {\n  ${check.foreground}: ${ground?.value ?? "oklch(1 0 0)"};\n}\n`;
        return { ...state, css: `${state.css}\n${same}` };
      }
      if (check.waits) {
        const unread = `${where} {\n  ${check.foreground}: unreadable;\n}\n`;
        return { ...state, css: `${state.css}\n${unread}` };
      }
      const background = resolve(state, check.scope, check.background);
      const same = `${where} {\n  ${check.foreground}: ${background?.value ?? "oklch(1 0 0)"};\n}\n`;
      return { ...state, css: `${state.css}\n${same}` };
    },
  },
  // The status tones the owner chose are written in every mode, and no tone left out is declared:
  // a role of a tone nobody chose would be a colour no answer speaks for.
  tones: {
    run(state, check) {
      const found = [];
      for (const scope of check.scopes) {
        for (const role of check.chosen) {
          if (!resolve(state, scope, role)?.color)
            found.push(`${role} is not a colour in ${scope}`);
        }
      }
      for (const { role, tone } of check.absent) {
        const where = check.scopes.filter((scope) => readVariable(state.css, scope, role) !== null);
        if (where.length > 0) {
          found.push(
            `${role} is declared in ${where.join(", ")}, and the owner did not choose the ${tone} tone: choose it in the guide, or take the declaration out`,
          );
        }
      }
      return found.length > 0 ? found.join("; ") : null;
    },
    change(state, check) {
      const absent = check.absent[0];
      const role = absent?.role ?? check.chosen[0];
      const value = absent ? "oklch(0.6 0.15 150)" : "unreadable";
      return { ...state, css: `${state.css}\n:root {\n  ${role}: ${value};\n}\n` };
    },
  },
  // A font of the sources ledger that a typeface choice names can still be chosen: its row is
  // there, whole, with its licence, and its pin still holds what the repository has.
  "font-row": {
    run(state, check) {
      try {
        sourcedFont(check.value, state.fontSources);
        return null;
      } catch (error) {
        return error.message;
      }
    },
    change(state) {
      return { ...state, fontSources: [] };
    },
  },
  // Every typeface the stylesheet names is loaded, as the repository's build loads one, or is a
  // family every device has.
  "font-loaded": {
    run(state, check) {
      const found = fontProblems(state, check.variables, state.stylesheet, state.fonts);
      return found.length > 0 ? found.join("; ") : null;
    },
    change(state, check) {
      return { ...state, css: unloadedCopy(state.css, check.variables[0]) };
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
        // Where the library shares its folder, the guide listed its parts one by one.
        library: check.library ?? [check.folder, ...(check.libraries ?? [])],
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
      // A ledger kept as one file per entry and no single file, the sources, entry by entry.
      for (const [kind, ledger] of Object.entries(LEDGERS)) {
        if (!ledger.ending) continue;
        for (const [file, text] of Object.entries(state.ledgerFolders?.[ledger.folder] ?? {})) {
          problems.push(...shapeProblems(kind, text, file));
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
      return cellProblems(state.folders?.[check.folder] ?? {}, check.rule, liveSkip(state, check));
    },
    change(state, check) {
      const added = `${check.folder}/changed-copy.tsx`;
      const source =
        'export const ChangedCopy = () => (\n  <tr className="h-9">\n    <td className="w-40 text-right" />\n  </tr>\n);\n';
      const files = { ...state.folders?.[check.folder], [added]: source };
      return { ...state, folders: { ...state.folders, [check.folder]: files } };
    },
  },
  // A derived file the repository keeps out of git is not in git, so no pull request carries it.
  // Where there is no git repository nothing can track the file, and the check has nothing to say.
  [UNTRACKED]: {
    run(state, check) {
      if (!state.git) return null;
      if (state.git.problem) {
        return `${check.file} is kept out of git, but git could not be asked whether it tracks the file (${state.git.problem}): the check proves nothing until git answers`;
      }
      if (state.git.tracked.includes(check.file)) {
        return `${check.file} is written from the source and this repository keeps it out of git, but git tracks it: run git rm --cached ${check.file}`;
      }
      if (!state.git.ignored.includes(check.file)) {
        return `${check.file} is kept out of git, but git does not ignore it, so it may be added back by mistake: add it to .gitignore`;
      }
      return null;
    },
    // Git tracks the file.
    change(state, check) {
      const git = state.git ?? { tracked: [], ignored: [] };
      return { ...state, git: { ignored: git.ignored, tracked: [...git.tracked, check.file] } };
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
      // Kept as one file per screen, the ledger is named by its folder.
      const named = state.fragments?.[check.file]?.folder ?? check.file;
      const shape =
        text === null || text === undefined ? [] : shapeProblems("screens", text, named);
      if (shape.length > 0) return shape.slice(0, 3).join("; ");
      return screenLedgerProblem(
        text,
        state.files?.[check.registry],
        check.pages ? (state.pages?.[check.pages] ?? {}) : {},
        named,
      );
    },
    // The code lists one more screen, which the ledger does not have. The copy changes the code
    // and not the ledger: whichever entry of the ledger comes last may be a screen that is only
    // planned, and taking that one away would change nothing.
    change(state, check) {
      const added =
        '\nexport const CHANGED = [{ path: "/changed-copy", states: [{ name: "ready" }] }];\n';
      const registry = `${state.files?.[check.registry] ?? ""}${added}`;
      return { ...state, files: { ...state.files, [check.registry]: registry } };
    },
  },
  // A ledger the repository keeps as one file per entry, the screens or the intake: each file is
  // named after the key it holds, so two entries with one key cannot both be there, each has the
  // shape of an entry, and the one file is not kept beside the folder as a second source.
  [FRAGMENTS]: {
    run(state, check) {
      const found = state.fragments?.[check.file] ?? null;
      const copy =
        found && keptOutOfGit(state.theme).includes(check.file)
          ? joinFound({ ...found, ledger: ledgerOf(check) })
          : null;
      return fragmentsProblem(found, check, copy);
    },
    // A fragment under another name than its key; where there is none, one is added so.
    change(state, check) {
      const found = state.fragments?.[check.file] ?? {
        folder: check.fragments,
        shared: "version: 1\n",
        fragments: [],
        beside: false,
        ledger: ledgerOf(check),
      };
      const [first, ...rest] = found.fragments;
      const moved = {
        name: "changed-copy.yaml",
        file: `${found.folder}/changed-copy.yaml`,
        text: first?.text ?? FRAGMENT_LEDGERS[ledgerOf(check)].sample,
      };
      return {
        ...state,
        fragments: { ...state.fragments, [check.file]: { ...found, fragments: [moved, ...rest] } },
      };
    },
  },
  // The ledger of screens agrees with the domain model: every action is offered to every role that
  // may run it, no screen shows a record to a role that may not view it, and no button is one no
  // role that opens its screen may press.
  "screen-actions": {
    run(state, check) {
      const text = state.files?.[check.file];
      const model = state.models?.[check.model];
      // Installed once the ledger declared it: a ledger that stops declaring it, or a model
      // without actions, no longer proves anything.
      if (!model?.present) return `${check.model}/actions.yaml is missing, so nothing is joined`;
      if (text === null || text === undefined) return `${check.file} is missing`;
      if (!offersOf(readScreenLedger(text)).declared) {
        return `${check.file} no longer says what any screen shows, opens with or offers`;
      }
      return screenActionsProblem(text, model, check.file);
    },
    // What the model plans for later, and the ledger's own actions without a screen: listed on
    // every run, never failing.
    notes(state, check) {
      return screenActionsDebts(state.files?.[check.file], state.models?.[check.model]);
    },
    // One more screen, which shows a record the model does not have.
    change(state, check) {
      const added =
        "  - id: changed-copy\n    route: /changed-copy\n    title: null\n    family: null\n    status: built\n    shows:\n      - ChangedCopy\n";
      // First in the list, so that keys written after the screens stay where they are.
      const before = state.files?.[check.file] ?? "";
      const text = /^screens:\n/m.test(before)
        ? before.replace(/^screens:\n/m, `screens:\n${added}`)
        : `${before}screens:\n${added}`;
      return { ...state, files: { ...state.files, [check.file]: text } };
    },
  },
  // Each role sees in a browser the buttons the ledger of screens and the model give it: the
  // browser test that walks the screens as each role is there, reads the gate's own plan and
  // enters by the repository's file of ways in, and that file is there. The test itself runs with
  // the repository's browser checks.
  "screen-actions-seen": {
    run(state, check) {
      if (!state.models?.[check.model]?.present) {
        return `${check.model}/actions.yaml is missing, so no role is walked`;
      }
      return seenFilesProblem(
        { door: state.files?.[check.door] ?? null, test: state.files?.[check.test] ?? null },
        { doorFile: check.door, testFile: check.test },
      );
    },
    // The file of ways in is gone.
    change(state, check) {
      return { ...state, files: { ...state.files, [check.door]: null } };
    },
  },
  // No screen writes its own words.
  words: {
    run(state, check) {
      return wordsProblem(state.folders?.[check.folder] ?? {}, liveSkip(state, check));
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
      return channelsProblem(files, liveSkip(state, check));
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
      return emptyStateProblem(state.sources?.[check.sources] ?? {}, liveSkip(state, check));
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
      return screenLinksProblem(
        state.sources?.[check.sources] ?? {},
        paths,
        liveSkip(state, check),
      );
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
      return errorCopyProblem(state.folders?.[check.folder] ?? {}, liveSkip(state, check));
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
  // The rule the row names holds the decision: that rule of the repository's own lint rejects
  // every probe that breaks it. Another rule that rejects a probe does not hold this row. The
  // changed copy is the same lint with that one rule turned off.
  lint: {
    run(state, check, id) {
      const result = state.lint?.[lintKey(id, check)];
      if (!result) return `the repository's lint was not run for ${check.rule}`;
      if (result.error) return result.error;
      const through = result.labels.filter((_, index) => !result.fired[index].includes(check.rule));
      if (through.length === 0) return null;
      return `the repository's lint lets through ${through.map((label) => `\`${label}\``).join(", ")}: ${check.rule} does not reject it, at ${check.at}`;
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
  // Every choice points at a row, and every judgment nobody confirmed waits on the decision sheet:
  // a judgment this branch writes that no person answered and no question asks, source that goes
  // around a decided scale, and a test that proves a decision the ledger has no row for, fail.
  "decision-sheet": {
    run(state, check) {
      let blueprint;
      try {
        blueprint = JSON.parse(state.files?.[check.blueprint] ?? "null");
      } catch {
        return `${check.blueprint} is not valid JSON`;
      }
      return sheetProblem({
        ledger: state.ledger,
        branch: state.branch ?? null,
        waiting: state.waiting,
        blueprint,
        sources: state.sources?.[check.sources] ?? {},
        tagged: state.tagged ?? [],
        // The component library's files, read from its settings now: a component added to a
        // folder the library shares is told apart without running the guide again.
        library: state.library ?? undefined,
      });
    },
    notes: (state) => branchNotes(state.branch ?? null),
    done: (state) => branchDone(state.branch ?? null),
    // The branch writes a judgment of its own, and nobody is asked.
    change(state) {
      const row = {
        id: "changed-copy",
        layer: "context",
        kind: "judgment",
        source: "a changed copy",
      };
      const branch = state.branch && !state.branch.problem ? state.branch : emptyBranch();
      return {
        ...state,
        ledger: [...(state.ledger ?? []), row],
        branch: { ...branch, judgments: [...branch.judgments, row.id] },
      };
    },
  },
  // The wall: a new kind of screen and the brand colour are the owner's calls. A branch that adds a
  // page of a kind of screen, or changes the root colour line, fails until the waiting list holds
  // the owner's answer that keeps that very item.
  "owner-calls": {
    run(state) {
      return wallProblem({ branch: state.branch ?? null, waiting: state.waiting });
    },
    notes: (state) => branchNotes(state.branch ?? null),
    done: (state) => branchDone(state.branch ?? null),
    // The branch adds a page of a kind of screen that nobody asked the owner about.
    change(state) {
      const branch = state.branch && !state.branch.problem ? state.branch : emptyBranch();
      return {
        ...state,
        branch: { ...branch, pages_added: [...branch.pages_added, "changed-copy"] },
      };
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
      if (!checkReachesTargets(state.makefile ?? "")) {
        return "the Makefile's check target no longer runs CHECK_TARGETS, so make check does not run this";
      }
      return null;
    },
    change(state) {
      return { ...state, gate: (state.gate ?? "").replace(/^\t@?node /m, "\t-@node ") };
    },
  },
};
// The kinds of check, for the plugin's own tests of a single check.
export const KINDS_FOR_TEST = KINDS;

const lintKey = (id, check) => `${id}:${check.rule}`;

// Whether `make check` runs CHECK_TARGETS (or design-assembly itself), directly or through the
// targets it depends on: repo-setup 0.9.0 writes `check: check-quick check-heavy` and
// `check-quick: $(CHECK_TARGETS)`. Only prerequisites count, not a comment after `##` or `#`.
function checkReachesTargets(makefile) {
  const prerequisites = new Map();
  for (const line of makefile.split("\n")) {
    const rule = /^([A-Za-z0-9_.-]+)\s*::?(?!=)(.*)$/.exec(line);
    if (!rule) continue;
    const words = rule[2]
      .split("#")[0]
      .split(/\s+/)
      .filter((word) => word && word !== "|");
    prerequisites.set(rule[1], [...(prerequisites.get(rule[1]) ?? []), ...words]);
  }
  const seen = new Set();
  const queue = ["check"];
  while (queue.length > 0) {
    const target = queue.shift();
    if (seen.has(target)) continue;
    seen.add(target);
    for (const word of prerequisites.get(target) ?? []) {
      if (word === "$(CHECK_TARGETS)" || word === "design-assembly") return true;
      queue.push(word);
    }
  }
  return false;
}

// A branch that adds nothing, for a changed copy to add to.
const emptyBranch = () => ({
  base: "changed-copy",
  main: "changed-copy",
  pages_added: [],
  colour: { base: null, now: null },
  judgments: [],
});

// The checks that read what a branch adds, and the waiting list.
const BRANCH_KINDS = ["decision-sheet", "owner-calls"];

// The waiting list as the gate reads it: its rows, or why it cannot be read.
function waitingOf(root, rows) {
  try {
    return {
      rows:
        readWaiting(
          root,
          (rows ?? []).map((row) => String(row.id)),
        )?.rows ?? [],
    };
  } catch (error) {
    return { problem: error.message };
  }
}

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
        rule: check.rule,
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

// The checks whose `file` is a ledger of screens.
const SCREEN_KINDS = ["screen-ledger", "screen-actions", FRAGMENTS];

// Why the fragments a repository keeps a ledger in are not what they must be, or null. `found` is
// what the disk holds for the ledger the check names. `copy` is what the one file beside the
// folder must hold when the repository keeps it as a copy out of git, else null: the one file is
// then a second source. Each problem is said in the words of the ledger the check holds.
export function fragmentsProblem(found, check, copy = null) {
  const folder = check.fragments;
  const kind = ledgerOf(check);
  const L = FRAGMENT_LEDGERS[kind];
  if (!found) {
    const asked = kind === "screens" ? "" : ` --ledger ${kind}`;
    return `${check.file} is kept as one file per ${L.one} under ${folder}, and ${folder}/${FRAGMENTS_SHARED} is not there: bring the folder back, or run the tool's screen-fragments.mjs${asked} --join on what is left`;
  }
  const problems = [];
  if (found.beside && copy === null) {
    problems.push(
      `${check.file} is there beside ${folder}, so the ledger has two sources: the folder is what is read, remove the file`,
    );
  } else if (found.beside && found.besideText !== copy) {
    problems.push(
      `${check.file} is the copy the gate writes, and it differs from ${folder}: the folder is the ledger, so a change goes there, and the copy is written again from it`,
    );
  }
  const { list } = L.cut(found.shared);
  if (listLine(list, "m").test(found.shared)) {
    problems.push(
      `${folder}/${FRAGMENTS_SHARED} lists ${L.many} of its own: each ${L.one} has its own file`,
    );
  }
  const twins = twinNames(found.fragments.map((fragment) => fragment.name));
  if (twins.length > 0) {
    problems.push(
      `${twins.map((name) => `${folder}/${name}`).join(" and ")} differ only by capitals, so a system that does not tell them apart keeps one`,
    );
  }
  // One fragment read as a ledger of one entry, so only this entry is judged: with the
  // repository's spelling of the keys, and nothing else of the shared part.
  const stub = L.stub(found.shared);
  const cut = L.cut(stub);
  const at = new RegExp(`^\\.${L.canonical}( \\([^)]*\\))?\\[0\\]\\.`);
  for (const fragment of found.fragments) {
    const one = joinLedger(stub, [fragment], cut);
    const id = L.entries(one)[0]?.[L.by];
    if (typeof id !== "string" || id === "") {
      problems.push(`${fragment.file} names no ${cut.name}, so no ${L.one} is read from it`);
      continue;
    }
    if (fragment.name !== `${id}.yaml`) {
      problems.push(
        `${fragment.file} holds ${L.holds(id)}: the file's name is ${L.named(cut.name)}, so it is ${folder}/${id}.yaml`,
      );
    }
    for (const line of shapeProblems(kind, one, fragment.file)) {
      const rest = line.startsWith(fragment.file) ? line.slice(fragment.file.length) : null;
      problems.push(rest !== null && at.test(rest) ? rest.replace(at, `${fragment.file}: `) : line);
    }
  }
  if (problems.length === 0) return null;
  const more = problems.length > 3 ? `; and ${problems.length - 3} more` : "";
  return `${problems.slice(0, 3).join("; ")}${more}`;
}

// What git says of the files a repository keeps out of it: which it tracks, and which it ignores.
// Null when no check asks, or when the folder is not in a git repository.
// A git that is there and will not answer, for a checkout owned by another user for instance, is
// neither: the facts then carry `problem`, and the check fails instead of passing unasked.
export function gitFacts(root, files) {
  if (files.length === 0) return null;
  const git = (args, input) =>
    spawnSync("git", ["-C", root, ...args], { encoding: "utf8", ...(input ? { input } : {}) });
  const inside = git(["rev-parse", "--is-inside-work-tree"]);
  // No git on this machine: nothing can track the file.
  if (inside.error) return null;
  if (inside.status !== 0) {
    const said = (inside.stderr ?? "").trim();
    if (/not a git repository/i.test(said)) return null;
    return { tracked: [], ignored: [], problem: said.split("\n")[0] || "git gave no reason" };
  }
  // Names are read whole, ended by a zero byte: git otherwise quotes a name with a space or a
  // letter outside ASCII, and no file would match it.
  const names = (run) => (run.stdout ?? "").split("\0").filter(Boolean);
  // The ignore question takes names ended by a zero byte only on its input.
  return {
    tracked: names(git(["ls-files", "-z", "--", ...files])),
    ignored: names(git(["check-ignore", "-z", "--stdin"], files.join("\0"))),
  };
}

// Every file of a folder that ends as its ledger's files do, by its path, as it is on disk.
function readLedgerFolder(root, folder, ending) {
  const full = path.join(root, folder);
  if (!existsSync(full) || !statSync(full).isDirectory()) return {};
  return Object.fromEntries(
    readdirSync(full)
      .filter((name) => name.endsWith(ending) && statSync(path.join(full, name)).isFile())
      .sort()
      .map((name) => [`${folder}/${name}`, readFileSync(path.join(full, name), "utf8")]),
  );
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
  // A ledger that may be kept as fragments, the screens or the intake, is read in whichever shape
  // the repository keeps it: one file, or one file per entry. Every check then reads one text,
  // under the path the tool data names. Each path is known with the ledger it is.
  const splittable = new Map(
    Object.keys(FRAGMENT_LEDGERS).map((kind) => [LEDGERS[kind].file, kind]),
  );
  for (const check of checks) {
    if (check.ledger) splittable.set(check.ledger, "screens");
    for (const kind of Object.keys(FRAGMENT_LEDGERS)) {
      if (check.ledgers?.[kind]) splittable.set(check.ledgers[kind], kind);
    }
    if (SCREEN_KINDS.includes(check.kind)) splittable.set(check.file, ledgerOf(check));
  }
  const named = [...checks, { ledgers: usual }]
    .flatMap((check) => [
      check.file,
      check.types,
      check.registry,
      check.test,
      check.door,
      check.blueprint,
      check.ledger,
      ...Object.values(check.ledgers ?? {}),
    ])
    .filter(Boolean)
    .map((file) => [
      file,
      splittable.has(file) ? ledgerText(root, file, splittable.get(file)) : read(file),
    ]);
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
  // The domain models a check names, read once each.
  const models = [...new Set(checks.map((check) => check.model).filter(Boolean))].map((folder) => [
    folder,
    readModel(root, folder),
  ]);
  const rows = ledger === null ? null : parseLedger(ledger);
  // What this branch adds, read once, for the checks that ask.
  const asking = checks.filter((check) => BRANCH_KINDS.includes(check.kind));
  const pagesOf = asking.find((check) => check.pages)?.pages ?? "design/patterns";
  const branch =
    asking.length === 0
      ? null
      : branchFacts(root, {
          pages: pagesOf,
          stylesheet,
          ledger: FILES.ledger,
          main: asking.find((check) => check.main)?.main ?? null,
        });
  const testsOf = asking.find((check) => check.tests)?.tests;
  const styles = loadStyles(root, stylesheet);
  return {
    root,
    // The component library's parts, read from its settings now, where it keeps them.
    library: keepsSettings(root) ? libraryParts(root) : null,
    theme: data,
    ledger: rows,
    // What the repository's own lint rejects, for the decisions it holds.
    lint: lintResults(root, data?.checks, rows),
    stylesheet,
    // `css` is the repository's own text with its relative imports put in place; `base` is the
    // framework's theme, read only when a value points into it.
    ...styles,
    // What loads a typeface, as the adapter of the repository's build reads it.
    fonts: checks.some((check) => check.kind === "font-loaded")
      ? readLoads(root, styles.css, stylesheet)
      : null,
    // The fonts of the sources ledger, each with how its pin differs from the repository today,
    // and how the repository's build writes what loads one.
    fontSources: readFontSources(root),
    fontFaces: buildOf(root).fontFaces ?? null,
    files: Object.fromEntries(named),
    // The fragments of each such ledger kept as a folder, or null where it is one file.
    fragments: Object.fromEntries(
      [...splittable].map(([file, kind]) => [file, readFragments(root, file, kind)]),
    ),
    folders: Object.fromEntries(folders),
    pages: Object.fromEntries(pages),
    // The ledgers kept only as a folder of files, the sources, file by file.
    ledgerFolders: Object.fromEntries(
      Object.values(LEDGERS)
        .filter((ledger) => ledger.ending)
        .map((ledger) => [ledger.folder, readLedgerFolder(root, ledger.folder, ledger.ending)]),
    ),
    sources: Object.fromEntries(sources),
    models: Object.fromEntries(models),
    // The column type each field of the data model names.
    displays: readDisplays(root),
    gate: read(FILES.gate),
    makefile: read("Makefile"),
    git: gitFacts(
      root,
      checks.filter((check) => check.kind === UNTRACKED).map((check) => check.file),
    ),
    waiting: asking.length === 0 ? null : waitingOf(root, rows),
    branch,
    tagged: testsOf ? taggedTests(root, testsOf) : [],
  };
}

// For every decision this tool holds: what is wrong, or null, and whether each of its checks was
// seen failing on a changed copy.
// The files a check leaves out: the list the guide wrote into the tool data, and the component
// library's parts read from its settings now, so a library file installed after the guide ran is
// left out too.
export function liveSkip(state, check) {
  return [...new Set([...(check.skip ?? []), ...(state.library ?? [])])];
}

export function runChecks(state) {
  return Object.entries(state.theme?.checks ?? {}).map(([id, checks]) => {
    const problems = [];
    // What a check lists on every run without failing, such as work planned for later.
    const notes = [];
    // What a check did to reach its answer, such as history it fetched: work done, not a debt.
    const done = [];
    let seenFailing = true;
    for (const check of checks) {
      const kind = KINDS[check.kind];
      if (!kind) {
        problems.push(`unknown check ${check.kind}`);
        continue;
      }
      const problem = kind.run(state, check, id);
      if (problem) problems.push(problem);
      if (kind.notes) notes.push(...kind.notes(state, check, id));
      if (kind.done) done.push(...kind.done(state, check, id));
      if (kind.run(kind.change(state, check, id), check, id) === null) seenFailing = false;
    }
    return {
      id,
      problem: problems.length > 0 ? problems.join("; ") : null,
      seenFailing,
      held: problems.length === 0 && seenFailing,
      notes,
      done,
    };
  });
}

// The lines a passing gate prints for its results: what a check did, then what it leaves as a debt.
export function noteLines(results) {
  return results.flatMap((r) => [
    ...(r.done ?? []).map((line) => `  ${r.id}: ${line}`),
    ...r.notes.map((note) => `  ${r.id}, debt: ${note}`),
  ]);
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

// Everything that makes this step of the gate fail on a state, one line each, with the results of
// the checks it ran. Empty means the step passes. An upgrade asks it of a state before writing.
export function gateProblems(state) {
  const results = runChecks(state);
  const problems = [
    ...results.flatMap((r) => {
      if (r.problem) return [`${r.id}: ${r.problem}`];
      return r.seenFailing ? [] : [`${r.id}: the check cannot fail, so it proves nothing`];
    }),
    ...crossProblems(state, results),
    ...ledgerProblems(state.root, state.ledger, [...LAYERS, ...Object.keys(LAYER_ALIASES)]),
  ];
  return { results, problems };
}

function main() {
  const args = argv.slice(2);
  const at = args.indexOf("--target");
  const root = at === -1 ? cwd() : path.resolve(args[at + 1] ?? "");
  let drawn;
  try {
    drawn = drawDerived(root);
  } catch (error) {
    stderr.write(`design-assembly: ${error.message}. Nothing was checked.\n`);
    exit(1);
  }
  for (const item of drawn.written) {
    stdout.write(
      `design-assembly: wrote ${item.file} again from ${item.from}; it is kept out of git\n`,
    );
  }
  const state = readState(root);
  if (state.theme === null || state.ledger === null) {
    stderr.write(
      `design-assembly: ${FILES.theme} or ${FILES.ledger} is missing. Run the guide first.\n`,
    );
    exit(1);
  }
  const { results, problems } = gateProblems(state);
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
  for (const line of noteLines(results)) stdout.write(`${line}\n`);
  const count = results.reduce((sum, r) => sum + state.theme.checks[r.id].length, 0);
  stdout.write(
    `design-assembly: ${results.length} decisions held by ${count} checks, each seen failing on a changed copy\n`,
  );
}

// Runs only when this file is the script. Real paths on both sides: a folder reached through a
// link would otherwise look like an import, and the check would pass without running.
if (argv[1] && realpathSync(argv[1]) === realpathSync(fileURLToPath(import.meta.url))) main();
