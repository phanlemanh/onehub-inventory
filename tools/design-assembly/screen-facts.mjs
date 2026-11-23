// The facts of the screens a feature touches, for a tool that reads them instead of having them
// declared again, such as an acceptance kit: each screen's id, route, title and family, the states
// the ledger lists for it, the states it must have once the state table's exemptions are taken
// off, the action a role must hold to open it and the actions it has buttons for, each with the
// roles that hold it. The ledger is read through the reader every tool of this plugin uses, so a
// ledger kept as one file or as one file per screen gives the same answer, and so does a ledger
// that spells its keys its own way. It only reads; it never writes.
//
// Usage: node tools/design-assembly/screen-facts.mjs [--screens ID|ROUTE,...]
//          [--keys entry=…,actions=…] [--json] [--target DIR]
//   --screens  the screens the feature touches, by id or by route: repeated, or split by commas;
//              every screen of the ledger when not given
//   --keys     how the ledger spells the keys of the contract, when it does not say so itself
// Ends with 0 with every screen asked for, with 1 when a screen asked for is not in the ledger (the
// answer is printed all the same), and with 2 on a wrong call or a repository it cannot read. A
// repository with no state table ends with 0: each screen's must_have is null, which says so. A
// ledger in which no screen has the key of the entry, or of the actions, as the reader spells it,
// ends with 0 too: its ids, routes and states still read, and keys_not_found names the keys, so a
// caller that does not know the repository's spelling can tell "not found" from "none".
import { existsSync, readFileSync, realpathSync, statSync } from "node:fs";
import path from "node:path";
import process, { argv, cwd, stderr, stdout } from "node:process";
import { fileURLToPath } from "node:url";

import { STATES_FILE } from "./patterns.mjs";
import { KEYS, modelOf, readModel } from "./screen-actions.mjs";
import { ledgerText, readFragments } from "./screen-fragments.mjs";
import { fragmentsFolder, readScreenLedger, SCREEN_LEDGER } from "./screen-ledger.mjs";

const USAGE =
  "Usage: screen-facts.mjs [--screens ID|ROUTE,...] [--keys entry=…,actions=…] [--json] [--target DIR]\n";

class Refusal extends Error {}

const read = (root, file) => {
  const full = path.join(root, file);
  return existsSync(full) ? readFileSync(full, "utf8") : null;
};
const list = (value) => (Array.isArray(value) ? value.map(String) : []);
// A value the ledger leaves empty: no key, nothing after it, or a written null.
const named = (value) =>
  value === null || value === undefined || value === "" || value === "null" ? null : String(value);

// The ledger as data, and where it was read from: the folder of one file per screen when the
// repository keeps one, else the one file.
function ledgerOf(root) {
  const where = readFragments(root) ? fragmentsFolder(SCREEN_LEDGER) : SCREEN_LEDGER;
  const text = ledgerText(root);
  if (text === null) {
    throw new Refusal(
      `${SCREEN_LEDGER} is missing, and so is ${fragmentsFolder(SCREEN_LEDGER)}/: there is no screen to read`,
    );
  }
  return { where, ledger: readScreenLedger(text) };
}

// The state table: what every screen must show, and the screens excused by their route. Null when
// the repository has none; one that does not read is refused.
function statesOf(root) {
  const text = read(root, STATES_FILE);
  if (text === null) return null;
  let table;
  try {
    table = JSON.parse(text);
  } catch (error) {
    throw new Refusal(`${STATES_FILE} is not JSON (${String(error.message).split("\n")[0]})`);
  }
  if (table === null || typeof table !== "object" || Array.isArray(table)) {
    throw new Refusal(`${STATES_FILE} holds no object`);
  }
  const exempt = table.exempt && typeof table.exempt === "object" ? table.exempt : {};
  return { required: list(table.required), exempt };
}

// Each screen as the kit reads it. `model` is null when the repository declares no actions: then
// who holds an action cannot be said, and each list of roles is null.
export function screenFacts(screen, keys, states, model, unseen = []) {
  const route = named(screen.route);
  const excused = states && route !== null && route in states.exempt;
  const holders = (action) =>
    model === null ? null : (model.actions.find((item) => item.name === action)?.holders ?? []);
  const entry = keys.entry in screen ? named(screen[keys.entry]) : undefined;
  return {
    id: String(screen.id),
    route,
    title: named(screen.title),
    family: named(screen.family),
    status: String(screen.status ?? "built"),
    states: list(screen.states),
    must_have: states === null ? null : excused ? [] : states.required,
    exempt: excused ? String(states.exempt[route]) : null,
    // A screen that says nothing of its entry has none to report; one whose entry is null opens for
    // every role.
    entry:
      entry === undefined
        ? null
        : { action: entry, roles: entry === null ? (model?.roles ?? null) : holders(entry) },
    // Null when no screen of the ledger has the key: not found, which an empty list would hide.
    actions: unseen.includes("actions")
      ? null
      : list(screen[keys.actions]).map((name) => ({ name, roles: holders(name) })),
  };
}

// The answer for the repository at `root`: the screens asked for, in the order asked, or all of
// them; and the names asked for that the ledger does not have.
export function factsOf(root, asked = [], callKeys = {}) {
  const { where, ledger } = ledgerOf(root);
  const keys = {
    ...KEYS,
    ...(ledger.keys && typeof ledger.keys === "object" ? ledger.keys : {}),
    ...callKeys,
  };
  const states = statesOf(root);
  const declared = readModel(root);
  const model = declared.present ? modelOf(declared) : null;
  const screens = ledger.screens.filter((screen) => screen && screen.id !== undefined);
  // The keys of the contract no screen of the ledger carries, as the reader spells them. A ledger
  // where some screens have one and others do not is not this case.
  const unseen =
    screens.length === 0
      ? []
      : ["entry", "actions"].filter((key) => !screens.some((screen) => keys[key] in screen));
  const unknown = [];
  const chosen =
    asked.length === 0
      ? screens
      : [...new Set(asked)].flatMap((name) => {
          const found = screens.filter(
            (screen) => String(screen.id) === name || named(screen.route) === name,
          );
          if (found.length === 0) unknown.push(name);
          return found;
        });
  return {
    ledger: where,
    states_table: states === null ? null : STATES_FILE,
    screens: [...new Set(chosen)].map((screen) => screenFacts(screen, keys, states, model, unseen)),
    unknown,
    keys_not_found: unseen.map((key) => ({ key, looked_for: keys[key] })),
  };
}

// The call, read against this command's flags and the ones every command takes.
function readCall(args) {
  if (args.includes("--help") || args.includes("-h")) return { help: true };
  const found = { screens: [], keys: {} };
  for (let index = 0; index < args.length; index += 1) {
    const flag = args[index];
    if (flag === "--json") {
      found.json = true;
      continue;
    }
    if (!["--target", "--screens", "--keys"].includes(flag)) {
      return { problem: `${flag} is not a flag of this command` };
    }
    const value = args[index + 1];
    if (value === undefined || value.startsWith("--")) return { problem: `${flag} needs a value` };
    index += 1;
    if (flag === "--screens") found.screens.push(...value.split(",").filter(Boolean));
    else if (flag === "--keys") {
      for (const pair of value.split(",").filter(Boolean)) {
        const [key, spelled, ...rest] = pair.split("=");
        if (!(key in KEYS) || !spelled || rest.length > 0) {
          return {
            problem: `--keys takes key=spelling pairs of ${Object.keys(KEYS).join(", ")}: ${pair} is not one`,
          };
        }
        found.keys[key] = spelled;
      }
    } else found.target = value;
  }
  const target = path.resolve(found.target ?? cwd());
  if (!existsSync(target) || !statSync(target).isDirectory()) {
    return { problem: `${target} is not a folder` };
  }
  return { ...found, target };
}

const roles = (names) => (names === null ? "roles cannot be said" : names.join(", ") || "no role");

// What a person reads: one block per screen, and what the ledger does not have.
function textOf(result) {
  const lines = [`screen facts: ${result.screens.length} of the ledger ${result.ledger}`];
  for (const screen of result.screens) {
    lines.push(
      `  ${screen.id} ${screen.route ?? "(no route)"} (${screen.family ?? "no family"}), ${screen.status}`,
    );
    lines.push(`    states: ${screen.states.join(", ") || "none listed"}`);
    if (screen.must_have === null)
      lines.push(`    must have: cannot be said, ${STATES_FILE} is missing`);
    else if (screen.exempt !== null)
      lines.push(`    must have: nothing, excused: ${screen.exempt}`);
    else lines.push(`    must have: ${screen.must_have.join(", ") || "nothing"}`);
    if (screen.entry) {
      lines.push(
        `    opens for: ${roles(screen.entry.roles)}${screen.entry.action ? ` (${screen.entry.action})` : ""}`,
      );
    }
    if (screen.actions?.length > 0) {
      lines.push(
        `    actions: ${screen.actions.map((item) => `${item.name} (${roles(item.roles)})`).join("; ")}`,
      );
    }
  }
  if (result.keys_not_found.length > 0) {
    const [first, ...rest] = result.keys_not_found.map((item) => item.looked_for);
    lines.push(
      `no screen of the ledger has the key ${first}${rest.map((key) => `, nor ${key}`).join("")}: if the ledger spells it otherwise, say so under keys in the ledger or with --keys`,
    );
  }
  if (result.unknown.length > 0) {
    lines.push(`not in the ledger of screens: ${result.unknown.join(", ")}`);
  }
  return `${lines.join("\n")}\n`;
}

function main(args) {
  const call = readCall(args);
  if (call.problem) {
    stderr.write(`design-assembly: ${call.problem}\n${USAGE}`);
    return 2;
  }
  if (call.help) {
    stdout.write(USAGE);
    return 0;
  }
  const result = factsOf(call.target, call.screens, call.keys);
  stdout.write(call.json ? `${JSON.stringify(result, null, 2)}\n` : textOf(result));
  return result.unknown.length > 0 ? 1 : 0;
}

// Runs only when this file is the script. Anything it cannot read ends with 2, never with a trace.
if (argv[1] && realpathSync(argv[1]) === realpathSync(fileURLToPath(import.meta.url))) {
  try {
    process.exitCode = main(argv.slice(2));
  } catch (error) {
    stderr.write(
      `design-assembly: ${error instanceof Refusal ? error.message : `this repository cannot be read: ${String(error.message).split("\n")[0]}`}\n`,
    );
    process.exitCode = 2;
  }
}
