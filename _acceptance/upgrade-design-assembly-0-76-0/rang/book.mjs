// AC-7: the installed plugin's book draws from the tree as it is (exit 0, 40 of 40, no brand page:
// the repository has no logo or icon set row), and on clones given sample brand rows it draws the
// brand page in the book's own Vietnamese words: every one of the 13 brand keys shows, in the place
// the book puts it, and none of the template's English texts of those keys does.
// Usage: node book.mjs [--root <repository>] [--words <file>]
//   (--words hands each clone another design/book-words.json, for the break copies)
import { copyFileSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";

import { head, option, ROOT, run, scratch, workClone } from "./lib.mjs";
import { BARE_ICON_ROW, BRAND_KEYS, ICON_ROW, LOGO_ROW, NO_PICTURES, PLUGIN_DIR, PLUGIN_FILES, TOOL_FOLDER, WORDS } from "./matrix.mjs";

const root = path.resolve(option("--root", ROOT));
const wordsFile = option("--words");
const found = [];

const printed = run("node", [path.join(PLUGIN_DIR(), PLUGIN_FILES.book), "--words-template"], root);
const template = JSON.parse(printed.out);
const words = JSON.parse(readFileSync(path.resolve(wordsFile ?? path.join(root, WORDS)), "utf8"));
// The text the page holds for a word, as the book escapes it.
const escape = (text) =>
  String(text).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
// The brand page of a drawn book: the sheet whose heading carries the brand title (the book's own or
// the template's), up to the end of that sheet. The title also shows in the contents, so the heading
// is the anchor.
const brandPage = (html) => {
  for (const title of [words.brandTitle, template.brandTitle]) {
    if (typeof title !== "string") continue;
    const heading = html.search(new RegExp(`<p class="eyebrow"><span>\\d+</span>${escape(title).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}</p>`));
    if (heading !== -1) return html.slice(heading, html.indexOf("</section>", heading));
  }
  return "";
};

// Draws the book of a clone given `rows`; returns its exit, its screen and its page.
function draw(label, rows) {
  const clone = workClone(root);
  const out = scratch("book");
  try {
    if (wordsFile) copyFileSync(path.resolve(wordsFile), path.join(clone.dir, WORDS));
    for (const { file, row } of rows) {
      mkdirSync(path.dirname(path.join(clone.dir, file)), { recursive: true });
      writeFileSync(path.join(clone.dir, file), `${JSON.stringify(row, null, 2)}\n`);
    }
    run("node", [`${TOOL_FOLDER}/components.mjs`, "--write"], clone.dir);
    const book = run("node", [path.join(PLUGIN_DIR(), PLUGIN_FILES.book), "--target", clone.dir, "--out", out], clone.dir);
    // 1 is a book written without every picture (this build draws no component): still a book, but
    // only with the book's own note saying so; any other 1 is a failure.
    const noPictures = book.out.includes(NO_PICTURES);
    if (book.status !== 0 && !(book.status === 1 && noPictures)) {
      found.push(`${label}: the book exit ${book.status}${book.status === 1 ? ` without «${NO_PICTURES}»` : ""}`);
    }
    let html = "";
    try {
      html = readFileSync(path.join(out, "book.html"), "utf8");
    } catch {
      found.push(`${label}: the book wrote no book.html`);
    }
    return { screen: book.out, html };
  } finally {
    clone.remove();
    rmSync(out, { recursive: true, force: true });
  }
}

// The tree as it is: the book draws, says 40 of 40, and has no brand page.
const plain = draw("the tree as it is", []);
if (!plain.screen.includes("40 of 40 core decisions answered")) found.push("the tree as it is: the book did not say 40 of 40 core decisions answered");
if (brandPage(plain.html) !== "") found.push("the tree as it is: the book drew a brand page, with no logo or icon set row");

// Where each key shows, and with what beside it, on the page of each sample.
const shows = {
  icons: draw("an icon set with sizes and a stroke", [ICON_ROW]),
  bare: draw("an icon set with neither", [BARE_ICON_ROW]),
  logo: draw("a logo row whose file is missing", [LOGO_ROW]),
};
const place = {
  brandTitle: ["icons", (w) => w],
  brandQuestion: ["icons", (w) => w],
  brandLede: ["icons", (w) => w],
  brandMark: ["icons", (w) => `<div><h3>${w}</h3><p>`],
  brandIcons: ["icons", (w) => `<div><h3>${w}</h3><h4>`],
  brandFloorText: ["icons", (w) => `<p>${w}</p>`],
  brandRow: ["icons", (w) => `${w} <code>${ICON_ROW.file}</code>`],
  brandPin: ["icons", (w) => ` · ${w} the package`],
  brandSizes: ["icons", (w) => `${w} 16, 20 px`],
  brandStroke: ["icons", (w) => ` · ${w} 2`],
  brandNoSizes: ["bare", (w) => w],
  brandNoIcons: ["logo", (w) => w],
  brandUnread: ["logo", (w) => w],
};
for (const key of BRAND_KEYS) {
  const [sample, shape] = place[key];
  const page = brandPage(shows[sample].html);
  if (page === "") {
    found.push(`${key}: the book drew no brand page for ${sample}`);
    continue;
  }
  const own = words[key];
  if (typeof own !== "string" || !page.includes(shape(escape(own)))) {
    found.push(`${key}: the brand page does not show the book's word «${own ?? "(none)"}» where it goes`);
  }
  if (page.includes(shape(escape(template[key])))) {
    found.push(`${key}: the brand page shows the template's English «${template[key]}»`);
  }
}
for (const line of found) process.stdout.write(`book: ${line}\n`);
if (found.length === 0) {
  process.stdout.write(
    `book: the book draws from the tree as it is (40 of 40, no brand page); on clones with an icon set, a bare icon set and a logo row it shows all ${BRAND_KEYS.length} brand words in Vietnamese and none in the template's English (at ${head(root).slice(0, 12)})\n`,
  );
}
process.exitCode = found.length ? 1 : 0;
