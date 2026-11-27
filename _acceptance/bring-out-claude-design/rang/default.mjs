// AC-5: no default system was set for the owner. The question default-claude-design waits, with its
// two answers and no answer written; the ledger has no row for it; and the push recorded that the
// default waits (no --account-has-default). Usage: node default.mjs [--root <repository or a copy>]
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import { head, ledgerRow, option, report, ROOT } from "./lib.mjs";
import { ANSWER_KEYS, DEFAULT_ID, LEDGER, WAITING } from "./matrix.mjs";

const root = path.resolve(option("--root", ROOT));
const found = [];
const file = path.join(root, WAITING);
if (!existsSync(file)) found.push(`${WAITING} is gone: the question no longer waits`);
else {
  const q = JSON.parse(readFileSync(file, "utf8"));
  if (q.id !== DEFAULT_ID) found.push(`${WAITING} is the question ${q.id}, not ${DEFAULT_ID}`);
  const answers = (q.candidates ?? []).map((c) => c.name);
  if (JSON.stringify(answers) !== JSON.stringify(["yes", "no"])) found.push(`${DEFAULT_ID} offers ${JSON.stringify(answers)}, not ["yes","no"]`);
  for (const key of ANSWER_KEYS) if (key in q) found.push(`${DEFAULT_ID} has an answer written: ${key}: ${JSON.stringify(q[key])}`);
}
if (ledgerRow(readFileSync(path.join(root, LEDGER), "utf8"), DEFAULT_ID)) found.push(`${LEDGER} has a row ${DEFAULT_ID}: the default was decided`);
report("default", found, `${DEFAULT_ID} waits on the owner with no answer written, and the ledger has no row for it (at ${head(root).slice(0, 12)})`);
