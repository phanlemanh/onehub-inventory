// AC-4: the setup section of the tour names the commands the repository really uses.
// Relations, not only words: the driver command is the one of package.json's prepare script, the
// redraw command is executors.script.product_map without --check, and the files named are the ones
// .gitattributes marks.
// Usage: node docs.mjs [--root <dir>]

import {
  ATTR_FILE,
  CHECK_CMD,
  CONFIG,
  DRIVER_CMD,
  LIMIT_GITHUB,
  LIMIT_OLD_BRANCH,
  MAP_LINE,
  REDRAW_KEY,
  SECTION_TITLE,
  SETUP_CMD,
  TOUR,
} from "./matrix.mjs";
import { done, lines, read, refuse, rootOf } from "./lib.mjs";

const NAME = "docs";
const root = rootOf();
const problems = [];

const tour = read(root, TOUR);
const start = tour.indexOf(`\n${SECTION_TITLE}\n`);
if (start < 0) done(NAME, [`section "${SECTION_TITLE.slice(3)}" is missing in ${TOUR}`], "");
const rest = tour.slice(start + 1 + SECTION_TITLE.length);
const end = rest.indexOf("\n## ");
const section = end < 0 ? rest : rest.slice(0, end);

// The repository's own commands.
const prepare = JSON.parse(read(root, "package.json")).scripts?.prepare ?? "";
const configLine = lines(read(root, CONFIG)).find((l) => l.startsWith(`    ${REDRAW_KEY}: "`));
if (configLine === undefined) refuse(NAME, `${CONFIG} has no executors.script.${REDRAW_KEY}`);
const quoted = configLine.slice(configLine.indexOf('"')).match(/^"(?:[^"\\]|\\.)*"/);
if (quoted === null) refuse(NAME, `executors.script.${REDRAW_KEY} is not a double-quoted string`);
const checkCommand = JSON.parse(quoted[0]);
if (!checkCommand.endsWith(" --check")) refuse(NAME, `executors.script.${REDRAW_KEY} does not end with --check`);
const redraw = checkCommand.slice(0, -" --check".length);

if (!section.includes(SETUP_CMD)) problems.push("the setup command is missing");
if (!section.includes(DRIVER_CMD)) problems.push("the driver command is missing");
else if (!prepare.includes(DRIVER_CMD)) problems.push("the driver command of the section is not in the prepare script of package.json");
if (!section.includes(CHECK_CMD)) problems.push("the check command is missing");
if (!section.includes(redraw)) problems.push("the redraw command is not the repository's");
if (!section.includes(LIMIT_GITHUB)) problems.push("the GitHub limit is missing");
if (!section.includes(LIMIT_OLD_BRANCH)) problems.push("the limit for branches opened before the line is missing");

// The generated files the section names are exactly the ones .gitattributes marks.
const attrs = lines(read(root, ATTR_FILE));
const marked = attrs.filter((l) => l.endsWith(" merge=generated-file")).map((l) => l.split(" ")[0]);
const named = [...new Set([...section.matchAll(/`([A-Z][A-Z-]*\.(?:md|html))`/g)].map((m) => m[1]))];
const same = marked.length === named.length && marked.every((f) => named.includes(f));
if (!same) problems.push(`the section names [${named.join(", ")}], .gitattributes marks [${marked.join(", ")}]`);

const comment = attrs[attrs.indexOf(MAP_LINE) - 1] ?? "";
if (!comment.startsWith("#") || !marked.every((f) => comment.includes(f))) {
  problems.push("the comment of .gitattributes does not name both files");
}

done(
  NAME,
  problems,
  `the section names the setup command, the driver command of package.json, the check command, the redraw command of the repository, the ${marked.length} files .gitattributes marks, the GitHub limit and the limit for branches opened before the line`,
);
