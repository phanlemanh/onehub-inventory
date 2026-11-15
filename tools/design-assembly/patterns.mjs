// What every screen must have, read from source: the states a view of data goes through, that a
// screen takes its words from one place, and that an error message has both of its parts.
import { adapter as source } from "./adapters/react.mjs";
import { closing, openingTag } from "./components.mjs";
import { literally } from "./ledger.mjs";
import { builtScreens, readScreenLedger, SCREEN_LEDGER } from "./screen-ledger.mjs";

// The file a person owns: the states every screen must declare, and the screens excused from them.
export const STATES_FILE = "design/states.json";
// Where the floor lists its screens with the states of each.
export const REGISTRY = "src/screens.ts";

// The states every view of data has: waiting for it, having none, failing to get it, and a search
// or filter that matches nothing.
export const CORE_STATES = ["loading", "empty", "error", "no-results"];

// The source with its comments blanked out, strings kept: an apostrophe in a comment would
// otherwise read as the start of a string and hide everything after it.
export function withoutComments(text) {
  let out = "";
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (char === '"' || char === "'" || char === "`") {
      let end = i + 1;
      while (end < text.length && text[end] !== char) end += text[end] === "\\" ? 2 : 1;
      out += text.slice(i, end + 1);
      i = end;
    } else if (char === "/" && text[i + 1] === "/") {
      const end = text.indexOf("\n", i);
      i = (end === -1 ? text.length : end) - 1;
    } else if (char === "/" && text[i + 1] === "*") {
      const end = text.indexOf("*/", i + 2);
      i = (end === -1 ? text.length : end + 2) - 1;
    } else out += char;
  }
  return out;
}

// Each screen of the registry with the names of the states it declares.
export function readScreens(source) {
  const text = withoutComments(source);
  const found = [];
  for (const screen of text.matchAll(/\bpath:\s*["']([^"']+)["']/g)) {
    const rest = text.slice(screen.index);
    const list = /\bstates:\s*\[/.exec(rest);
    const next = rest.slice(1).search(/\bpath:\s*["']/);
    if (!list || (next !== -1 && list.index > next)) {
      found.push({ path: screen[1], states: [] });
      continue;
    }
    const open = list.index + list[0].length - 1;
    const body = rest.slice(open, closing(rest, open) + 1);
    found.push({
      path: screen[1],
      states: [...body.matchAll(/\bname:\s*["']([^"']+)["']/g)].map((state) => state[1]),
    });
  }
  return found;
}

// The screens there are, each with its path and the names of its states: from the ledger of
// screens where the repository keeps one, else read from the code that lists them.
export function listedScreens(registryText, ledgerText) {
  if (ledgerText !== null && ledgerText !== undefined) {
    return builtScreens(readScreenLedger(ledgerText)).map(({ path, states }) => ({ path, states }));
  }
  return readScreens(registryText ?? "");
}

// Why the screens do not declare the states they must, or null.
export function statesProblem(statesText, registryText, file = STATES_FILE, ledgerText = null) {
  if (statesText === null || statesText === undefined) return `${file} is missing`;
  let table;
  try {
    table = JSON.parse(statesText);
  } catch {
    return `${file} is not valid JSON`;
  }
  const required = table.required ?? [];
  const dropped = CORE_STATES.filter((state) => !required.includes(state));
  if (dropped.length > 0) {
    return `${file}: ${dropped.join(", ")} must stay required: every view of data has them`;
  }
  const exempt = table.exempt ?? {};
  const unexplained = Object.entries(exempt).filter(([, why]) => !String(why ?? "").trim());
  if (unexplained.length > 0) {
    return `${file}: ${unexplained.map(([path]) => path).join(", ")} is excused without a reason`;
  }
  const screens = listedScreens(registryText, ledgerText);
  const where = ledgerText === null || ledgerText === undefined ? REGISTRY : SCREEN_LEDGER;
  if (screens.length === 0) return `no screen is listed in ${where}, so no state is measured`;
  const found = [];
  for (const screen of screens.filter((item) => !(item.path in exempt))) {
    const missing = required.filter((state) => !screen.states.includes(state));
    if (missing.length > 0)
      found.push(`${screen.path} declares no state named ${missing.join(", ")}`);
  }
  return found.length > 0 ? found.join("; ") : null;
}

const TEXT_ATTRIBUTES =
  /\b(aria-label|aria-description|placeholder|title|alt)=(?:\{\s*)?(["'])([^"']*)\2/g;
const HAS_WORD = /\p{L}{2,}/u;
// Marks of code, not of text between two tags. A closing brace cannot stand in such text at all.
const LOOKS_LIKE_CODE = /[;=()[\]}"'`|&]/;

// Places where a screen writes words itself instead of taking them from the repository's one
// place for words: text between tags, and text in an attribute a person reads or hears.
export function wordsProblem(files, skip = []) {
  const found = [];
  for (const [file, text] of Object.entries(files)) {
    if (skip.some((prefix) => file.startsWith(prefix))) continue;
    for (const tag of text.matchAll(/<([A-Za-z][\w.]*)(?=[\s/>])/g)) {
      const from = tag.index + tag[0].length;
      const attributes = openingTag(text, from);
      for (const attribute of attributes.matchAll(TEXT_ATTRIBUTES)) {
        if (HAS_WORD.test(attribute[3])) {
          found.push(`${file}: <${tag[1]}> has ${attribute[1]}="${attribute[3]}"`);
        }
      }
      const after = from + attributes.length + 1;
      const stop = text.slice(after).search(/[<{]/);
      const between = stop === -1 ? "" : text.slice(after, after + stop);
      const tagFollows = /^<[/A-Za-z]/.test(text.slice(after + stop, after + stop + 2));
      if (tagFollows && HAS_WORD.test(between) && !LOOKS_LIKE_CODE.test(between)) {
        found.push(`${file}: <${tag[1]}> holds the text "${between.trim().slice(0, 40)}"`);
      }
    }
    // Words written in code where a screen hands them to a component: a string on its own between
    // braces, and a string given as a header, label, title or placeholder.
    for (const child of text.matchAll(/\{\s*(["'`])([^"'`\n{}]*)\1\s*\}/g)) {
      if (HAS_WORD.test(child[2]))
        found.push(`${file}: writes the text "${child[2].slice(0, 40)}"`);
    }
    for (const given of text.matchAll(
      /\b(header|label|title|placeholder)\s*:\s*(["'`])([^"'`\n]*)\2/g,
    )) {
      if (HAS_WORD.test(given[3]))
        found.push(`${file}: gives ${given[1]}: "${given[3].slice(0, 40)}"`);
    }
  }
  if (found.length === 0) return null;
  return `${found.slice(0, 5).join("; ")}: a screen takes its words from the repository's one place for them`;
}

// Why an error message a screen shows lacks one of its two parts, or null. An error message is an
// `Alert` of the destructive kind: its title says what happened, its description what to do next.
export function errorCopyProblem(files, skip = []) {
  const found = [];
  let measured = 0;
  for (const [file, text] of Object.entries(files)) {
    if (skip.some((prefix) => file.startsWith(prefix))) continue;
    for (const tag of text.matchAll(/<Alert(?=[\s/>])/g)) {
      const from = tag.index + tag[0].length;
      const attributes = openingTag(text, from);
      if (!/\bdestructive\b/.test(attributes)) continue;
      measured += 1;
      const end = text.indexOf("</Alert>", from);
      const body = attributes.trimEnd().endsWith("/") || end === -1 ? "" : text.slice(from, end);
      const missing = [
        ...(/<AlertTitle[\s/>]/.test(body) ? [] : ["title: what happened"]),
        ...(/<AlertDescription[\s/>]/.test(body) ? [] : ["description: what to do next"]),
      ];
      if (missing.length > 0)
        found.push(`${file}: an error message has no ${missing.join(", no ")}`);
    }
  }
  if (measured === 0) return "no screen shows an error message with Alert, so nothing is measured";
  return found.length > 0 ? found.slice(0, 5).join("; ") : null;
}

// Libraries that show a toast. A screen does not call one itself: it goes through the
// repository's one module for telling a person what an action did.
export const TOAST_MODULES = source.toastModules;

// Places where a screen tells a person something outside the repository's channels: a dialog of
// the browser itself, or a toast library called directly.
export function channelsProblem(files, skip = []) {
  const found = [];
  const modules = TOAST_MODULES.map(literally).join("|");
  const direct = new RegExp(`from\\s+["'](${modules})["']`, "g");
  // A module that draws nothing may be the one door to the toast library. A second one is a second
  // door, whatever it is called.
  const doors = [];
  for (const [file, text] of Object.entries(files)) {
    if (skip.some((prefix) => file.startsWith(prefix))) continue;
    if (!/\.[jt]sx$/.test(file)) {
      if ([...text.matchAll(direct)].length > 0) doors.push(file);
      continue;
    }
    for (const call of text.matchAll(/(?<![\w.])(window\.)?(alert|confirm|prompt)\s*\(/g)) {
      // A screen's own function of that name is not the browser's dialog: only `window.` or a
      // name the file does not declare reaches it.
      const own = new RegExp(`\\b(function|const|let|var)\\s+${call[2]}\\b`).test(text);
      if (!call[1] && own) continue;
      found.push(`${file}: opens the browser's own ${call[2]} dialog`);
    }
    for (const use of text.matchAll(direct)) {
      found.push(`${file}: calls the toast library ${use[1]} itself`);
    }
  }
  if (doors.length > 1) {
    found.push(
      `${doors.join(" and ")} each call a toast library: a result is told through one module`,
    );
  }
  // A module that tells results through toasts shows nothing until the toaster is drawn
  // somewhere: once, in the application's frame.
  const tells =
    doors.length > 0 &&
    Object.entries(files).some(
      ([file, text]) => !doors.includes(file) && /\bnotify(Done|Failed)\s*\(/.test(text),
    );
  // Drawn by the app itself, or by a component of the repository's own that something draws.
  const drawers = Object.entries(files).filter(
    ([file, text]) =>
      !skip.some((prefix) => file.startsWith(prefix)) && /<Toaster[\s/>]/.test(text),
  );
  const drawn = drawers.some(([file, text]) => {
    if (/^src\/[^/]+$/.test(file)) return true;
    const names = [...text.matchAll(/export\s+(?:function|const)\s+([A-Z]\w*)/g)].map(
      (found) => found[1],
    );
    return Object.entries(files).some(
      ([other, source]) =>
        other !== file && names.some((name) => new RegExp(`<${name}[\\s/>]`).test(source)),
    );
  });
  if (tells && !drawn) {
    found.push(
      "results are told through toasts, but the toaster is drawn nowhere: draw it once, in the application's frame",
    );
  }
  if (found.length === 0) return null;
  return `${found.slice(0, 5).join("; ")}: a screen tells a person through the repository's channels`;
}

// How a record opens beside a list: the arrangements a person picks from, and the one line of the
// record panel that says which it uses. The guide writes that line; the gate reads it.
export const RECORD_LAYOUTS = ["beside", "over", "in-place"];
export const RECORD_LINE = /^export const RECORD_LAYOUT: RecordLayout = "([\w-]+)";$/m;

// The record panel's source with its arrangement set, or null when the line is gone.
export function withRecordLayout(source, layout) {
  if (!RECORD_LINE.test(source)) return null;
  return source.replace(RECORD_LINE, `export const RECORD_LAYOUT: RecordLayout = "${layout}";`);
}

// The `<a ...>` tags of a source, each with the text of its opening tag.
function anchors(text) {
  return [...text.matchAll(/<a(?=[\s>])/g)].map((tag) => ({
    at: tag.index,
    attributes: openingTag(text, tag.index + 2),
  }));
}

// An empty state never dresses a link as a button: it offers a button only where a person can fill
// the list from that screen, and at most a link inside its words (design/behaviors.md, empty
// state). Found where a link inside an `<Empty>` takes the classes of a button.
export function emptyStateProblem(files, skip = []) {
  const found = [];
  for (const [file, text] of Object.entries(files)) {
    if (skip.some((prefix) => file.startsWith(prefix)) || !/\.[jt]sx$/.test(file)) continue;
    for (const empty of text.matchAll(/<Empty(?=[\s>])/g)) {
      const end = text.indexOf("</Empty>", empty.index);
      const inside = text.slice(empty.index, end === -1 ? text.length : end);
      if (anchors(inside).some((link) => /\bbuttonVariants\s*\(/.test(link.attributes))) {
        found.push(`${file}: an empty state dresses a link as a button`);
      }
    }
  }
  if (found.length === 0) return null;
  return `${found.slice(0, 5).join("; ")}: an empty state offers a button only where the person can fill the list here, and never a link dressed as one`;
}

// The paths of the screens there are.
export function screenPaths(registryText, ledgerText = null) {
  return listedScreens(registryText, ledgerText).map((screen) => screen.path);
}

// Moving between screens belongs to the application's frame, the same place and order on every
// screen (design/behaviors.md, moving between screens). Found where a file below the frame links
// to a listed screen by its path: the frame is the files right under `src/`, which list the
// screens themselves.
export function screenLinksProblem(files, paths, skip = []) {
  const found = [];
  for (const [file, text] of Object.entries(files)) {
    if (skip.some((prefix) => file.startsWith(prefix)) || !/\.[jt]sx$/.test(file)) continue;
    if (/^src\/[^/]+$/.test(file)) continue;
    for (const link of anchors(text)) {
      const href = /\bhref=(?:\{\s*)?(["'`])([^"'`]*)\1/.exec(link.attributes)?.[2];
      if (href !== undefined && paths.includes(href.split(/[?#]/)[0] || "/")) {
        found.push(`${file}: links to the screen ${href} itself`);
      }
    }
  }
  if (found.length === 0) return null;
  return `${found.slice(0, 5).join("; ")}: moving between screens belongs to the application's frame, not to a screen`;
}
