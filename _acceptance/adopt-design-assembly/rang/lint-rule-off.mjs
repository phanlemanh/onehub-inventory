// AC-3: on a linked copy of the repository, the design-assembly check is green with the
// repository's lint configuration, and red, naming raw-table, once onehub-ui/no-raw-table is off.
// Usage: node lint-rule-off.mjs --root <repository>
import { readFileSync } from "node:fs";
import path from "node:path";
import { exit, stdout } from "node:process";

import { linkedCopy, option, runCheck } from "./linked-copy.mjs";

const root = path.resolve(option("--root", "."));
const config = readFileSync(path.join(root, "eslint.config.js"), "utf8");
const ruleOff = config.replace(
  /\]\);\s*$/,
  '  { files: UI_FILES, rules: { "onehub-ui/no-raw-table": "off" } },\n]);\n',
);
if (ruleOff === config) {
  stdout.write("lint off: cannot place the rule-off entry at the end of eslint.config.js\n");
  exit(1);
}
const expected = "raw-table: the repository's lint lets through `<table />`";

const sound = linkedCopy(root);
const broken = linkedCopy(root, { "eslint.config.js": ruleOff });
try {
  const green = runCheck(sound.dir);
  const red = runCheck(broken.dir);
  stdout.write(`with the repository's lint: exit ${green.code}\n`);
  stdout.write(`with no-raw-table off: exit ${red.code}\n`);
  if (green.code !== 0) {
    stdout.write(`lint off: not green with the repository's lint\n${green.out}`);
    exit(1);
  }
  if (red.code === 0 || !red.out.includes(expected)) {
    stdout.write(`lint off: not red with no-raw-table off, or without "${expected}"\n${red.out}`);
    exit(1);
  }
  stdout.write(`${red.out.split("\n").find((line) => line.includes(expected)).trim()}\n`);
  stdout.write("lint off: green with the repository's lint, red with no-raw-table off\n");
} finally {
  sound.remove();
  broken.remove();
}
