// AC-1, AC-2, AC-3: ask ESLint and Prettier directly whether each path of the matrix is ignored. Places no file.
// Usage: node bo-qua.mjs --eslint | --prettier | --doi-chung
// Broken copies for two-way.mjs (never in the repository):
//   --pha           the two new ignore patterns removed (exit 2 if they are not there to remove)
//   --pha-rong      a copy with nothing removed; must agree with the real lookup
//   --them <p>      one more ESLint global ignore pattern (with --doi-chung)
//   --them-pr <p>   one more .prettierignore line (with --doi-chung)
// Exit 0 when the promise holds, 1 when it does not, 2 when the measure cannot run.

import {
  dropPrettierLines,
  editConfig,
  eslintAt,
  IN_TREE,
  NEW_IGNORES,
  OUT_OF_GIT,
  prettierIgnored,
  prettierIgnoreText,
  repoConfig,
  ROOT_LINE,
} from "./lib.mjs";

console.log(ROOT_LINE("bo-qua"));

const args = process.argv.slice(2);
const mode = ["--eslint", "--prettier", "--doi-chung"].find((m) => args.includes(m));
const valueOf = (flag) => {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : undefined;
};
const broken = args.includes("--pha");
const emptyCopy = args.includes("--pha-rong");
const addEslint = valueOf("--them");
const addPrettier = valueOf("--them-pr");

if (!mode) {
  console.error("bo-qua: give --eslint, --prettier or --doi-chung");
  process.exit(2);
}

async function eslintFor() {
  if (!broken && !emptyCopy && !addEslint) return eslintAt();
  const { config, removed } = editConfig(await repoConfig(), {
    drop: broken ? NEW_IGNORES : [],
    add: addEslint ? [addEslint] : [],
  });
  if (broken && removed !== NEW_IGNORES.length) {
    console.error(`bo-qua: cannot build the broken copy — ${removed} of ${NEW_IGNORES.length} ESLint patterns found`);
    process.exit(2);
  }
  return eslintAt(config);
}

function prettierText() {
  if (!broken && !emptyCopy && !addPrettier) return undefined;
  let text = prettierIgnoreText();
  if (broken) {
    const out = dropPrettierLines(text);
    if (out.removed !== NEW_IGNORES.length) {
      console.error(`bo-qua: cannot build the broken copy — ${out.removed} of ${NEW_IGNORES.length} .prettierignore lines found`);
      process.exit(2);
    }
    text = out.text;
  }
  if (addPrettier) text += `\n${addPrettier}\n`;
  return text;
}

if (mode === "--eslint") {
  const eslint = await eslintFor();
  const states = await Promise.all(OUT_OF_GIT.map((p) => eslint.isPathIgnored(p)));
  const linted = OUT_OF_GIT.filter((_, i) => !states[i]);
  if (linted.length) {
    console.log(`eslint: still linted: ${linted.join(", ")}`);
    process.exit(1);
  }
  console.log(`eslint: ${OUT_OF_GIT.length} of ${OUT_OF_GIT.length} out-of-git paths ignored (${OUT_OF_GIT.join(", ")})`);
}

if (mode === "--prettier") {
  const text = prettierText();
  const states = await prettierIgnored(OUT_OF_GIT, text);
  const checked = OUT_OF_GIT.filter((_, i) => !states[i]);
  // One path per new line of .prettierignore, asked with .prettierignore alone: .gitignore already covers
  // .acceptance-runs/, so without this the line for it could be missing and nothing would notice.
  const ownLines = OUT_OF_GIT.slice(0, 2);
  const alone = await prettierIgnored(ownLines, text, { alone: true });
  const notAlone = ownLines.filter((_, i) => !alone[i]);
  if (checked.length) console.log(`prettier: still checked: ${checked.join(", ")}`);
  if (notAlone.length) console.log(`prettier: .prettierignore alone does not ignore: ${notAlone.join(", ")}`);
  if (checked.length || notAlone.length) process.exit(1);
  console.log(
    `prettier: ${OUT_OF_GIT.length} of ${OUT_OF_GIT.length} out-of-git paths ignored; .prettierignore alone ignores both folders`,
  );
}

if (mode === "--doi-chung") {
  const paths = IN_TREE.map(([p]) => p);
  const eslint = await eslintFor();
  const es = await Promise.all(paths.map((p) => eslint.isPathIgnored(p)));
  const pr = await prettierIgnored(paths, prettierText());
  const esChanged = IN_TREE.filter(([, want], i) => es[i] !== want).map(([p]) => p);
  const prChanged = IN_TREE.filter(([, , want], i) => pr[i] !== want).map(([p]) => p);
  if (esChanged.length || prChanged.length) {
    if (esChanged.length) console.log(`doi-chung: eslint state changed: ${esChanged.join(", ")}`);
    if (prChanged.length) console.log(`doi-chung: prettier state changed: ${prChanged.join(", ")}`);
    process.exit(1);
  }
  const esIgnored = es.filter(Boolean).length;
  const prIgnored = pr.filter(Boolean).length;
  console.log(
    `doi-chung: ${paths.length} of ${paths.length} in-tree paths keep their state ` +
      `(eslint ${paths.length - esIgnored} linted, ${esIgnored} ignored; ` +
      `prettier ${paths.length - prIgnored} checked, ${prIgnored} ignored)`,
  );
}
