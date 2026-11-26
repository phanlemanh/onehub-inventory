// The text an item of an outside source writes itself, and whether the repository's words table
// holds it (specification 0015, addendum, item 11.7). An item's strings are the strings written in
// a file of its conform record: every string literal, every fixed part of a template string, and
// the words written between two tags. A string counts when, trimmed, it has two letters in a row
// and is not a class list, a key or a path: a string with no space that has -, _, /, . or : between
// two letters. A string of the item is red when it stands on the screen as a whole-word part of the
// text there, and the words table holds it neither whole nor as a whole word of one of its entries.
//
// Read-only: it never writes.

// Two letters in a row: what a string needs to be text a person reads.
const LETTERS = /\p{L}{2,}/u;
// A class list, a key or a path: no space, and one of these marks between two letters.
const KEY_LIKE = /\p{L}[-_/.:]\p{L}/u;
// The words that come before a regular expression, where a slash is not a division.
const BEFORE_PATTERN = new Set([
  "return",
  "typeof",
  "case",
  "do",
  "else",
  "in",
  "of",
  "new",
  "delete",
  "void",
  "throw",
  "instanceof",
  "yield",
  "await",
]);
// Marks after which a slash starts a regular expression. The opening of a tag is not one: `</`.
const PATTERN_AFTER = "(,=:[!&|?{};+-*%~^";
// Marks of code, never of words written between two tags.
const LOOKS_LIKE_CODE = /[;=()[\]}"'`|&]/;

const plain = (text) =>
  String(text ?? "")
    .replace(/\s+/g, " ")
    .trim();
const escape = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Where a quoted string that starts at `at` ends, and what it holds. A string stops at the end of
// a line too: words between two tags may hold an apostrophe that opens no string.
function quoted(source, at) {
  const quote = source[at];
  let text = "";
  let index = at + 1;
  while (index < source.length && source[index] !== quote && source[index] !== "\n") {
    if (source[index] === "\\") {
      text += source[index + 1] ?? "";
      index += 2;
      continue;
    }
    text += source[index];
    index += 1;
  }
  return { text, end: index + 1 };
}

// Where a regular expression that starts at `at` ends.
function patternEnd(source, at) {
  let index = at + 1;
  let inClass = false;
  while (index < source.length && source[index] !== "\n") {
    const mark = source[index];
    if (mark === "\\") index += 1;
    else if (mark === "[") inClass = true;
    else if (mark === "]") inClass = false;
    else if (mark === "/" && !inClass) return index + 1;
    index += 1;
  }
  return index;
}

// Every string written in a file of code: string literals and the fixed parts of template
// strings, with whether a literal names a module (an import, never text). In order.
function codeStrings(source) {
  const found = [];
  const modes = [{ kind: "code", depth: 0 }];
  let part = "";
  // The last two things read in code: a word, or a mark.
  let last = "";
  let before = "";
  const saw = (token) => {
    before = last;
    last = token;
  };
  let index = 0;
  while (index < source.length) {
    const mode = modes.at(-1);
    const mark = source[index];
    if (mode.kind === "template") {
      if (mark === "\\") {
        part += source[index + 1] ?? "";
        index += 2;
      } else if (mark === "`") {
        found.push({ text: part, kind: "template" });
        part = "";
        modes.pop();
        saw("`");
        index += 1;
      } else if (mark === "$" && source[index + 1] === "{") {
        found.push({ text: part, kind: "template" });
        part = "";
        modes.push({ kind: "code", depth: 0, inside: true });
        saw("{");
        index += 2;
      } else {
        part += mark;
        index += 1;
      }
      continue;
    }
    if (mark === "/" && source[index + 1] === "/") {
      const end = source.indexOf("\n", index);
      index = end === -1 ? source.length : end;
      continue;
    }
    if (mark === "/" && source[index + 1] === "*") {
      const end = source.indexOf("*/", index + 2);
      index = end === -1 ? source.length : end + 2;
      continue;
    }
    if (mark === "'" || mark === '"') {
      const { text, end } = quoted(source, index);
      const specifier =
        last === "word:from" ||
        last === "word:import" ||
        (last === "(" && ["word:import", "word:require"].includes(before));
      found.push({ text, kind: "literal", module: specifier });
      saw("string");
      index = end;
      continue;
    }
    if (mark === "`") {
      modes.push({ kind: "template" });
      part = "";
      index += 1;
      continue;
    }
    if (
      mark === "/" &&
      (last === "" ||
        PATTERN_AFTER.includes(last) ||
        (last.startsWith("word:") && BEFORE_PATTERN.has(last.slice(5))))
    ) {
      index = patternEnd(source, index);
      saw("pattern");
      continue;
    }
    if (/[A-Za-z_$]/.test(mark)) {
      const word = /^[\w$]+/.exec(source.slice(index))[0];
      saw(`word:${word}`);
      index += word.length;
      continue;
    }
    if (mark === "{") mode.depth += 1;
    if (mark === "}") {
      if (mode.inside && mode.depth === 0) {
        modes.pop();
        saw("}");
        index += 1;
        continue;
      }
      mode.depth -= 1;
    }
    if (!/\s/.test(mark)) saw(mark);
    index += 1;
  }
  return found;
}

// Where the opening tag whose name ends at `from` ends: its closing mark, outside quotes and braces.
function tagEnd(source, from) {
  let depth = 0;
  let quote = null;
  for (let index = from; index < source.length; index += 1) {
    const mark = source[index];
    if (quote) {
      if (mark === quote) quote = null;
    } else if (mark === '"' || mark === "'") quote = mark;
    else if (mark === "{") depth += 1;
    else if (mark === "}") depth -= 1;
    else if (mark === ">" && depth === 0) return index;
  }
  return -1;
}

// The words written between two tags: after an opening tag, or after an expression inside one,
// up to the next tag.
function tagWords(source) {
  const found = [];
  const keep = (between) => {
    if (LETTERS.test(between) && !LOOKS_LIKE_CODE.test(between)) {
      found.push({ text: between, kind: "words" });
    }
  };
  for (const tag of source.matchAll(/<([A-Za-z][\w.]*)(?=[\s/>])/g)) {
    const end = tagEnd(source, tag.index + tag[0].length);
    if (end === -1 || source[end - 1] === "/") continue;
    const rest = source.slice(end + 1);
    const stop = rest.search(/[<{]/);
    if (stop !== -1 && /^<[/A-Za-z]/.test(rest.slice(stop, stop + 2))) keep(rest.slice(0, stop));
  }
  for (const after of source.matchAll(/\}([^<>{}]+)<\//g)) keep(after[1]);
  return found;
}

// Every string a file writes, in order: what an item says, and what a words table holds. A string
// that names a module is no text.
export function writtenStrings(source) {
  const text = String(source ?? "");
  return [...codeStrings(text), ...tagWords(text)]
    .filter((item) => !item.module)
    .map((item) => plain(item.text))
    .filter((item) => LETTERS.test(item));
}

// The strings of an item's file that count: no class list, key or path. Each once, in order.
export function itemStrings(source) {
  const kept = writtenStrings(source).filter((text) => /\s/.test(text) || !KEY_LIKE.test(text));
  return [...new Set(kept)];
}

// Every value of a words table, read from its file: the strings of a JSON file's values, or every
// string a file of code writes.
export function wordsEntries(source, file = "") {
  if (file.endsWith(".json")) {
    const values = [];
    const walk = (value) => {
      if (typeof value === "string") values.push(plain(value));
      else if (Array.isArray(value)) value.forEach(walk);
      else if (value && typeof value === "object") Object.values(value).forEach(walk);
    };
    try {
      walk(JSON.parse(source));
    } catch {
      return [];
    }
    return [...new Set(values.filter((value) => LETTERS.test(value)))];
  }
  return [...new Set(writtenStrings(source))];
}

// Whether `part` stands in `text` as whole words: at each end the start or the end of the text, a
// space or a mark. Letters and digits are part of a word. Case is not.
const PATTERNS = new Map();
export function wholeWord(part, text) {
  let pattern = PATTERNS.get(part);
  if (!pattern) {
    pattern = new RegExp(`(?:^|[^\\p{L}\\p{N}])${escape(part)}(?:$|[^\\p{L}\\p{N}])`, "iu");
    PATTERNS.set(part, pattern);
  }
  return pattern.test(text);
}

// Whether the words table holds a string: one of its entries is the string, or holds it as whole
// words.
export function heldByWords(text, entries) {
  const lower = text.toLocaleLowerCase();
  return entries.some((entry) => entry.toLocaleLowerCase() === lower || wholeWord(text, entry));
}

// Whether a string is more than one word: it holds a space once trimmed.
const longer = (text) => /\s/.test(text);

// What of the item's own text is on the screen and not in the words table: one line per line of
// the screen, naming the strings of the item that count there, each with its file, the first time
// that string is named. A string counts on a line when it stands in it as whole words and the words
// table does not hold it, and it is two words or more; a one-word string counts only on a line where
// a string of two words or more of its own file counts too. So a row of data that holds a short
// word of the item is not red, and the file that wrote a composed line is the one named. `said` is
// the text on the screen, line by line; `strings` the item's, each with its file; `words` the
// table's files and entries; `who` the control whose floating part is open, if any; `seen` the
// strings already named for this screen, kept across calls.
export function ownTextProblems(at, said, strings, words, { who = null, seen = new Set() } = {}) {
  const table = words.files.length > 0 ? words.files.join(", ") : "none was found";
  const open = strings.filter(({ text }) => !heldByWords(text, words.entries));
  const problems = [];
  for (const line of said) {
    const standing = open.filter(({ text }) => wholeWord(text, line));
    const anchored = new Set(standing.filter(({ text }) => longer(text)).map(({ file }) => file));
    const named = [];
    for (const { file, text } of standing) {
      const key = `${file}\n${text}`;
      if (seen.has(key) || !(longer(text) || anchored.has(file))) continue;
      seen.add(key);
      named.push(`«${text}» of ${file}`);
    }
    if (named.length === 0) continue;
    problems.push(
      `${at}${who ? `, with ${who} open` : ""}: «${line.slice(0, 100)}» on the screen holds text the item writes itself, which the repository's words table (${table}) does not hold: ${named.join(", ")}. Give the item the repository's words by a recorded patch, or hold the text in the words table`,
    );
  }
  return problems;
}
