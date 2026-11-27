// AC-6: the five exports, which leave the repository, carry no email address, phone number, key or
// path on this machine. Usage: node clean.mjs [--root <repository or a copy>]
import { readFileSync } from "node:fs";
import path from "node:path";

import { head, option, report, ROOT } from "./lib.mjs";
import { EXPORTS, NOT_IN_EXPORTS } from "./matrix.mjs";

const root = path.resolve(option("--root", ROOT));
const found = [];
for (const file of EXPORTS) {
  const text = readFileSync(path.join(root, file), "utf8");
  for (const { name, re } of NOT_IN_EXPORTS) {
    const m = text.match(re);
    if (m) found.push(`${file} carries ${name}: «${m[0]}»`);
  }
}
report("clean", found, `the five exports carry no email address, phone number, key or path on this machine (at ${head(root).slice(0, 12)})`);
