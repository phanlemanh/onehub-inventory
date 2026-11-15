// AC-10: the owner's three answers as recorded, and the contrast they let the tool hold.
// Usage: node owner-answers.mjs --root <repository> [--theme F]
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { exit, stdout } from "node:process";

import { option } from "./linked-copy.mjs";

const root = path.resolve(option("--root", "."));
const theme = JSON.parse(readFileSync(option("--theme", path.join(root, "design/theme.json")), "utf8"));
const ledger = readFileSync(path.join(root, "design/decisions.yaml"), "utf8");

const fail = (what) => {
  stdout.write(`answers: ${what}\n`);
  exit(1);
};

if (theme.inputs?.conformanceLevel !== "AA") fail(`conformanceLevel ${theme.inputs?.conformanceLevel}`);
if (theme.inputs?.productType !== "application") fail(`productType ${theme.inputs?.productType}`);

for (const id of ["conformance-level", "source-color", "product-type"]) {
  const block = ledger.split(/\n(?= {2}- id: )/).find((text) => text.startsWith(`  - id: ${id}\n`));
  if (!block) fail(`row ${id} missing`);
  if (!/^\s+kind: judgment$/m.test(block)) fail(`row ${id} is not a judgment`);
}

const contrast = theme.checks?.["color-contrast"] ?? [];
if (contrast.length !== 4 || contrast.some((check) => check.kind !== "contrast" || check.min !== 4.5)) {
  fail(`contrast ${contrast.length} checks, not 4 at 4.5`);
}

// The value declared for --onehub-blue in a :root block of any stylesheet under src.
const sheets = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) walk(full);
    else if (name.endsWith(".css")) sheets.push(full);
  }
};
walk(path.join(root, "src"));
const declared = sheets
  .flatMap((file) => [...readFileSync(file, "utf8").matchAll(/:root\s*\{([^}]*)\}/g)])
  .map((block) => /--onehub-blue:\s*([^;]+);/.exec(block[1])?.[1].trim())
  .filter(Boolean);
if (declared.length === 0) fail("--onehub-blue not declared in a :root block");
if (declared.some((value) => value.toLowerCase() !== "#0246ff")) fail(`--onehub-blue ${declared.join(", ")}`);

stdout.write(
  "answers: AA application; rows conformance-level source-color product-type judgment; contrast 4 pairs at 4.5; --onehub-blue #0246ff\n",
);
