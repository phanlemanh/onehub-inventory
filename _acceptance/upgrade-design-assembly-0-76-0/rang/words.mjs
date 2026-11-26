// AC-6: the words of the design book have exactly the keys of the installed plugin's words template
// (the questions aside), the six questions, and each of the 13 brand keys a Vietnamese text of its
// own: not empty, not the template's English, in Unicode NFC, and free of what design/language.md
// rules out. The side-by-side table the judgment eval reads is what these files say.
// Usage: node words.mjs [--words <file>] [--table <file>] [--write-table]
//   (--words and --table stand in for the files, for the break copies; --write-table writes the table)
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

import { head, option, ROOT, run } from "./lib.mjs";
import { BRAND_KEYS, LANGUAGE, PLUGIN_DIR, PLUGIN_FILES, QUESTIONS, TABLE, WORDS } from "./matrix.mjs";

const wordsFile = path.resolve(option("--words", path.join(ROOT, WORDS)));
const tableFile = path.resolve(option("--table", path.join(ROOT, TABLE)));
const found = [];

const printed = run("node", [path.join(PLUGIN_DIR(), PLUGIN_FILES.book), "--words-template"], ROOT);
if (printed.status !== 0) throw new Error(`the plugin's book did not print its words template (exit ${printed.status})`);
const template = JSON.parse(printed.out);
const words = JSON.parse(readFileSync(wordsFile, "utf8"));

// Every path of an object's leaves, joined by dots.
const paths = (value, at = "") =>
  value && typeof value === "object" && !Array.isArray(value)
    ? Object.entries(value).flatMap(([key, inner]) => {
        const here = at ? `${at}.${key}` : key;
        const below = paths(inner, here);
        return below.length ? below : [here];
      })
    : [at];
const want = paths(template).filter((p) => p !== "questions" && !p.startsWith("questions."));
const have = paths(words).filter((p) => p !== "questions" && !p.startsWith("questions."));
for (const p of have) if (!want.includes(p)) found.push(`${p} is not a key of the words template`);
for (const p of want) if (!have.includes(p)) found.push(`missing ${p}, a key of the words template`);
const questions = Object.keys(words.questions ?? {}).sort().join(",");
if (questions !== [...QUESTIONS].sort().join(",")) found.push(`the questions are ${questions || "none"}, not the six`);

for (const key of BRAND_KEYS) {
  if (!(key in template)) found.push(`${key} is not in the installed plugin's words template`);
  const text = words[key];
  if (typeof text !== "string" || text.trim() === "") continue; // reported above as missing, or below
  if (text === template[key]) found.push(`${key} is the template's English: «${text}»`);
  if (text !== text.normalize("NFC")) found.push(`${key} is not in Unicode NFC`);
  for (const rule of LANGUAGE.forbidden) if (rule.re.test(text)) found.push(`${key} holds ${rule.why}: «${text}»`);
}
for (const key of BRAND_KEYS) {
  if (key in words && (typeof words[key] !== "string" || words[key].trim() === "")) found.push(`${key} is empty`);
}

// The table: one row per brand key, the template's English beside the book's Vietnamese.
const cell = (text) => String(text ?? "").replaceAll("|", "\\|");
const table = [
  "# Chữ của trang logo và bộ biểu tượng",
  "",
  "Bảng do `rang/words.mjs --write-table` viết từ khuôn chữ của plugin 0.76.0 và `design/book-words.json`; `rang/words.mjs`",
  "so lại mỗi lần chạy. Không sửa tay.",
  "",
  "| Khoá | Khuôn (tiếng Anh) | Sổ (tiếng Việt) |",
  "| --- | --- | --- |",
  ...BRAND_KEYS.map((key) => `| \`${key}\` | ${cell(template[key])} | ${cell(words[key])} |`),
  "",
].join("\n");
if (process.argv.includes("--write-table")) {
  writeFileSync(tableFile, table);
} else if (!existsSync(tableFile) || readFileSync(tableFile, "utf8") !== table) {
  found.push(`${path.relative(ROOT, tableFile)} is not what the words template and ${WORDS} say`);
}

for (const line of found) process.stdout.write(`words: ${line}\n`);
if (found.length === 0) {
  process.stdout.write(
    `words: ${WORDS} has the template's ${want.length} keys and the six questions; the ${BRAND_KEYS.length} brand keys are Vietnamese, NFC, and hold nothing design/language.md rules out; the table matches (at ${head(ROOT).slice(0, 12)})\n`,
  );
}
process.exitCode = found.length ? 1 : 0;
