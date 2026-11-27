// AC-4: what was sent is what the owner gave leave for, and the push is recorded at the state of the
// bundle in the tree. The ledger row send-claude-design is a judgment confirmed by the owner, naming
// the four bundle files and the place; the installed plugin's send step, dry, sends exactly those
// files (its whole «sends:» list, compared as a list) to that place and says the leave is given; and the last push to Claude Design names the
// ledger state the bundle names. Usage: node leave.mjs [--root <repository or a copy>]
import { readFileSync } from "node:fs";
import path from "node:path";

import { head, ledgerRow, option, report, ROOT, run } from "./lib.mjs";
import { BUNDLE, LEAVE, LEDGER, PLUG, PLUGIN_DIR, PRIVATE, PUSH_ON, PUSHED, STAMP, STAMP_LINE } from "./matrix.mjs";

const root = path.resolve(option("--root", ROOT));
const found = [];
const read = (rel) => readFileSync(path.join(root, rel), "utf8");

// The owner's leave in the ledger.
const row = ledgerRow(read(LEDGER), LEAVE.id);
const source = `leave: ${BUNDLE.join(", ")}; to: ${LEAVE.to}`;
if (!row) found.push(`${LEDGER} has no row ${LEAVE.id}`);
else {
  if (row.kind !== LEAVE.kind) found.push(`${LEAVE.id} is ${row.kind}, not ${LEAVE.kind}`);
  if (row.source !== source) found.push(`${LEAVE.id} gives leave for «${row.source}», not «${source}»`);
  const to = String(row.source ?? "").split("; to: ")[1] ?? "";
  if (to !== LEAVE.to) found.push(`${LEAVE.id} sends to «${to}», not «${LEAVE.to}»`);
  if (!to.includes(PRIVATE)) found.push(`${LEAVE.id} sends to «${to}», which is not ${PRIVATE}`);
  if (row.note !== LEAVE.note) found.push(`${LEAVE.id} is not ${LEAVE.note} (note: «${row.note ?? ""}»)`);
}

// The plugin's own send step, dry: it reads the leave the way a real send does.
const plugin = PLUGIN_DIR();
const dry = run("node", [path.join(plugin, "scripts/bring-out.mjs"), "--send", PLUG, "--dry-run"], root);
// The files it sends are the leave's files, no more and no fewer: the whole `sends:` line, as a list.
const sendLines = dry.out.split("\n").filter((l) => l.startsWith("sends: "));
if (sendLines.length !== 1) found.push(`the send step said ${sendLines.length} «sends:» lines, not one (exit ${dry.status}): ${dry.out.trim().split("\n").at(-1)}`);
else {
  const sent = sendLines[0].slice("sends: ".length).split(", ").map((f) => f.trim()).filter(Boolean);
  for (const f of sent) if (!BUNDLE.includes(f)) found.push(`the send step sends ${f}, which the leave does not name`);
  for (const f of BUNDLE) if (!sent.includes(f)) found.push(`the send step does not send ${f}`);
  if (sent.length !== new Set(sent).size) found.push(`the send step sends a file twice: «${sendLines[0]}»`);
}
const want = [`to: ${LEAVE.to}`, "the leave is given"];
for (const line of want) if (!dry.out.split("\n").some((l) => l === line || l.startsWith(`${line}:`))) found.push(`the send step did not say «${line}» (exit ${dry.status}): ${dry.out.trim().split("\n").at(-1)}`);

// The last push names the ledger state of the bundle.
const bundleAt = read(BUNDLE[0]).match(STAMP_LINE)?.[1];
const all = JSON.parse(read(PUSHED)).pushes ?? [];
// Every push goes to a place some leave names: a row send-<plug> of the ledger.
for (const p of all) if (!ledgerRow(read(LEDGER), `send-${p.plug}`)) found.push(`a push went to ${p.plug}, a place no leave names`);
const pushes = all.filter((p) => p.plug === PLUG);
const last = pushes.at(-1);
if (!last) found.push(`${PUSHED} records no push to ${PLUG}`);
else {
  if (last.stamp !== bundleAt) found.push(`the last push to ${PLUG} is at ${last.stamp}, the bundle is at ${bundleAt}`);
  if (last.stamp !== STAMP) found.push(`the last push to ${PLUG} is at ${last.stamp}, not ${STAMP}`);
  if (last.on !== PUSH_ON) found.push(`the last push to ${PLUG} is on ${last.on}, not ${PUSH_ON}`);
}
report(
  "leave",
  found,
  `${LEAVE.id} gives leave for the four bundle files to ${PLUG}, ${LEAVE.note}; the send step agrees; the last push is at ${STAMP}, as the bundle (at ${head(root).slice(0, 12)})`,
);
