// What each role sees of a screen while it runs, against what the ledger of screens and the domain
// model allow it. The ledger says, and the gate's own table works out, which role opens which
// screen and which buttons it may press there; a browser test opens each built screen as each role,
// walks its states and records every control that carries an action's mark. This module is the
// pure part of that test: the walking plan, read from the gate's table and never reckoned again,
// and the comparison of what a walk saw with what the table allows, one sentence per problem.
//
// A control that runs an action carries the action's name on itself: data-model-action="<action name>".
// A control is seen when it is on the page in a state the role reached, locked or not.
//
// Usage: node tools/design-assembly/screen-actions-seen.mjs [--target DIR] [--json]
// Read-only: it never writes.
import { realpathSync } from "node:fs";
import path from "node:path";
import { argv, cwd, exit, stdout } from "node:process";
import { fileURLToPath } from "node:url";

import { FRAME, modelOf, offersOf, readModel, screenTable } from "./screen-actions.mjs";
import { ledgerText } from "./screen-fragments.mjs";
import { readScreenLedger } from "./screen-ledger.mjs";

// The attribute that marks a control with the action it runs.
export const MARK = "data-model-action";
// The decision of the ledger this test holds.
export const SEEN_DECISION = "screen-actions-seen";
// The browser test that walks the screens as each role, beside the test of every page.
export const SEEN_TEST = "tests/e2e/screen-actions-seen.spec.ts";

const join = (names) => names.join(", ");

// For each built screen and each role: whether the role opens it, the buttons it may have there
// (both the gate's table), the screen's route and every action its row lists, and whether the
// role holds all of them. Nothing of who may do what is worked out here.
export function walkPlan(ledger, read) {
  if (!read || !Array.isArray(read.actions) || read.actions.length === 0) return [];
  const offers = offersOf(ledger ?? {});
  if (!offers.declared) return [];
  const routes = Object.fromEntries(
    (Array.isArray(ledger?.screens) ? ledger.screens : []).map((screen) => [
      String(screen?.id),
      screen?.route === undefined || screen?.route === null ? null : String(screen.route),
    ]),
  );
  const listed = Object.fromEntries(offers.screens.map((screen) => [screen.id, screen.actions]));
  return screenTable(offers, modelOf(read))
    .filter((row) => row.status === "built" && row.screen !== FRAME)
    .map((row) => ({
      screen: row.screen,
      route: routes[row.screen] ?? null,
      role: row.role,
      opens: row.opens,
      buttons: row.buttons,
      actions: listed[row.screen],
      holdsAll: row.opens && listed[row.screen].every((name) => row.buttons.includes(name)),
    }));
}

// The walking plan of a repository, from its ledger of screens and its model as they are on disk.
export function walkPlanOf(root) {
  const ledger = readScreenLedger(ledgerText(root));
  const read = readModel(root);
  return read.present ? walkPlan(ledger, read) : [];
}

// The widths a walk runs at: the narrowest and the widest a person listed.
export function widthsOf(sizes) {
  const widths = (sizes?.widths ?? []).map(Number).filter((width) => width > 0);
  if (widths.length === 0) return [];
  return [...new Set([Math.min(...widths), Math.max(...widths)])];
}

// Why a role has no way in, or null. `doors` is what the repository's file gives, by role.
export function doorProblem(role, doors, file) {
  if (doors && typeof doors[role] === "function") return null;
  return `role ${role} has no way in: ${file} gives none for it. Add one, a function given the page that makes the browser ${role} and no other role, or that does nothing where the application has no sign-in`;
}

// For the gate: why the browser test by role cannot hold its row, or null. `door` and `test` are
// the texts of the file of ways in and of the test, null where a file is not there. The test must
// still name its decision, read the gate's walking plan and enter by the file of ways in: a test
// that worked out the rights itself, or opened the screens as nobody, would prove something else.
export function seenFilesProblem({ door, test }, { doorFile, testFile }) {
  if (door === null || door === undefined) {
    return `${doorFile} is missing: the browser test enters each role of the model by it. Write it again, one way in per role, or take the row away with the test`;
  }
  if (test === null || test === undefined) {
    return `${testFile} is missing: it is the browser test that opens each screen as each role. Run the guide again to install it, or take the row away`;
  }
  if (!new RegExp(`decision:${SEEN_DECISION}(?![\\w-])`).test(test)) {
    return `${testFile} does not name decision:${SEEN_DECISION}`;
  }
  if (!test.includes("walkPlanOf")) {
    return `${testFile} does not read the gate's walking plan (walkPlanOf): the rights it checks must be the gate's`;
  }
  const base = path.posix.basename(doorFile).replace(/\.[^.]+$/, "");
  if (!new RegExp(`["']\\./${base}(\\.[a-z]+)?["']`).test(test)) {
    return `${testFile} does not enter by ${doorFile}`;
  }
  return null;
}

// Every problem of a role that may not open a screen, at the screen's route once the page settled:
// no control marked with an action of the screen's row is on the page, nor the words of its first
// state, and the page is still a page, with one main region and one top heading. What the role is
// shown instead is the product's choice, and is not checked: a role sent to another route is held
// only to that page being a page. `seen` is what was found: `marks`, `words` (whether the first
// state's words were in the main region), `mains`, `headings`, `first`, the name and words of the
// screen's first state, and `sent`, the path the role ended at when it is not the screen's.
export function blockedProblems(row, seen, { width = null } = {}) {
  if (row.opens) return [];
  const at = width === null ? "" : `, at ${width}px`;
  const who = `screen ${row.screen}, role ${row.role}${at}: ${row.role} may not open the screen`;
  const route = row.route ?? "its route";
  const problems = [];
  if (seen.sent) {
    if (seen.mains !== 1 || seen.headings !== 1) {
      problems.push(
        `${who}, and the page it was sent to, ${seen.sent}, has ${seen.mains} main regions and ${seen.headings} top headings. What such a role is shown instead is still a page, with one of each`,
      );
    }
    return problems;
  }
  for (const name of [...new Set(seen.marks)].filter((mark) => row.actions.includes(mark))) {
    problems.push(
      `${who}, and a control marked ${MARK}="${name}" of it is on the page at ${route}. Keep every control of the screen from a role that may not open it`,
    );
  }
  if (seen.words) {
    problems.push(
      `${who}, and the words of its first state, ${seen.first.name} («${seen.first.shows}»), are on the page at ${route}. Show a role that may not open the screen nothing of it`,
    );
  }
  if (seen.mains !== 1 || seen.headings !== 1) {
    problems.push(
      `${who}, and the page at ${route} has ${seen.mains} main regions and ${seen.headings} top headings. What such a role is shown instead is still a page, with one of each`,
    );
  }
  return problems;
}

// Every problem of one walk: a role that opens the screen sees each of its buttons at least once,
// in a state it reached; never meets a control marked with an action outside its buttons; and,
// when it holds every action of the screen, reaches every state. A role that lacks one may fail to
// reach a state whose steps need it. `states` is what the walk saw: for each state of the screen,
// its name, whether it was reached (and why not), and the marks found on the page there.
export function seenProblems(row, states, { width = null } = {}) {
  if (!row.opens) return [];
  const at = width === null ? "" : `, at ${width}px`;
  const who = `screen ${row.screen}, role ${row.role}`;
  const reached = states.filter((item) => item.reached);
  const problems = [];
  if (row.holdsAll) {
    for (const item of states.filter((one) => !one.reached)) {
      problems.push(
        `${who}, state ${item.name}${at}: ${row.role} holds every action of the screen and did not reach the state (${item.why ?? "no reason was recorded"}). Reach it by the steps the screen list declares, or correct those steps`,
      );
    }
  }
  const seen = new Set(reached.flatMap((item) => item.marks));
  for (const name of row.buttons.filter((button) => !seen.has(button))) {
    const where = reached.length > 0 ? join(reached.map((item) => item.name)) : "none";
    problems.push(
      `${who}${at}: no control marked ${MARK}="${name}" was seen in any state ${row.role} reached (states reached: ${where}). Put ${MARK}="${name}" on the control that runs ${name}, in a state the screen list declares`,
    );
  }
  // A control the role may not press is a problem wherever the walk met it: in a state it reached,
  // or on the way to one it did not reach.
  for (const item of states) {
    const where = item.reached ? "" : " on the way to the state, which was not reached";
    for (const name of [...new Set(item.marks)].filter((mark) => !row.buttons.includes(mark))) {
      problems.push(`${who}, state ${item.name}${at}: ${outside(row, name, where)}`);
    }
  }
  return problems;
}

// What is wrong with a mark of an action outside the role's buttons, and what to do.
function outside(row, name, where = "") {
  const on = `a control marked ${MARK}="${name}" is on the page${where}`;
  if (!/^[A-Za-z_][\w-]*$/.test(name) || name === "true" || name === "false") {
    return `${on}, and it names no action. Mark a control with the name of the action of the model it runs, or take the mark off`;
  }
  if (!row.actions.includes(name)) {
    return `${on}, and the row of ${row.screen} lists no button for ${name}. List ${name} under the screen's actions in the ledger of screens, or take the mark off a control that runs none of them`;
  }
  return `${on}, and ${row.role} may not run ${name}: draw the control only for a role that may run it; a locked button still counts as seen`;
}

function main(args) {
  const value = (flag) => (args.includes(flag) ? args[args.indexOf(flag) + 1] : null);
  const root = path.resolve(value("--target") ?? cwd());
  const plan = walkPlanOf(root);
  if (args.includes("--json")) {
    stdout.write(`${JSON.stringify({ plan }, null, 2)}\n`);
    return 0;
  }
  if (plan.length === 0) {
    stdout.write("screen-actions-seen: no built screen declares its buttons; nothing to walk\n");
    return 0;
  }
  for (const row of plan) {
    const says = row.opens ? `buttons ${join(row.buttons) || "none"}` : "does not open it";
    stdout.write(`  ${row.screen} (${row.route ?? "no route"}) · ${row.role}: ${says}\n`);
  }
  return 0;
}

if (argv[1] && realpathSync(argv[1]) === realpathSync(fileURLToPath(import.meta.url))) {
  exit(main(argv.slice(2)));
}
