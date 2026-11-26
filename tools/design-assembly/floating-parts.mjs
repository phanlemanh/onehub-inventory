// The floating parts of an item of an outside source (specification 0015, addendum, item 11.7). On
// each screen that uses an item a conform record holds (the screens the change map reaches from a
// file of the record), each control that says it opens a floating part (aria-haspopup, or
// aria-expanded="false") is pressed, on the screen as it stands, one level only. With the part
// open, three things are held:
//   1. every dialog, alert dialog, menu or list box just opened has an accessible name: held here,
//      whatever the repository's own check is configured to run;
//   2. the item's own text on the screen goes through the repository's words table (item-text.mjs);
//   3. the repository's own accessibility check runs as the repository configured it, read from
//      the browser test its decisions ledger names; where there is none, it does not run, and the
//      first two still hold.
// This module is the plan and the walk; the repository's browser test calls it through the
// adapter of its test browser. Each control is pressed on the screen loaded afresh, so the screen
// is as it was found every time; a link is never followed, a form never submitted, and a control
// that opens nothing is said.
//
// Read-only: it never writes.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import { adapterOf } from "./adapters/index.mjs";
import { affectedBy, screensOf } from "./affected.mjs";
import { CONFORM_FOLDER } from "./contract.mjs";
import { itemStrings, ownTextProblems, wordsEntries } from "./item-text.mjs";
import { LEDGER, parseLedger } from "./ledger.mjs";
import { SIZES_FILE } from "./screens.mjs";

export { itemStrings, ownTextProblems, wordsEntries } from "./item-text.mjs";

// The browser test that opens the floating parts, beside the repository's other browser tests.
export const FLOATING_TEST = "tests/e2e/floating-parts.spec.ts";
// The check of the gate that holds that test, under the row of the ledgers' shapes.
export const FLOATING_CHECK = { kind: "floating-parts", test: FLOATING_TEST };
// What the test calls, so the gate can tell it calls the check.
export const FLOATING_CALL = "floatingCheck";
// The controls that say they open a floating part.
export const CONTROLS = '[aria-haspopup]:not([aria-haspopup="false"]), [aria-expanded="false"]';
// The roles of a floating part that must have a name.
export const NAMED_ROLES = ["dialog", "alertdialog", "menu", "listbox"];
// The rows of the decisions ledger whose source may name the repository's words table.
const WORDS_ROWS = ["labels", "copy-content", "terms"];
// The width a screen is opened at when the repository lists none.
const WIDTH = 1280;
// How long a screen, or what a press opens, may keep changing before it counts as settled: quiet
// for the first, at most the second.
const SETTLE = { quiet: 500, most: 10_000 };
const SETTLE_PRESS = { quiet: 300, most: 3_000 };
const PRESS_MS = 5_000;

const NOT_A_SCREEN_FILE = "not a file of any screen";

const read = (root, file) => {
  const full = path.join(root, file);
  return existsSync(full) ? readFileSync(full, "utf8") : null;
};
const parsed = (text) => {
  try {
    return JSON.parse(text ?? "null");
  } catch {
    return null;
  }
};

// ---- the plan -----------------------------------------------------------------------------------

// Every conform record, by its file, with the files it holds. A record that cannot be read is the
// gate's shape check's to name.
export function conformRecords(root) {
  const folder = path.join(root, CONFORM_FOLDER);
  if (!existsSync(folder)) return [];
  return readdirSync(folder)
    .filter((name) => name.endsWith(".json"))
    .sort()
    .map((name) => {
      const file = `${CONFORM_FOLDER}/${name}`;
      const data = parsed(read(root, file));
      if (!data || typeof data.need !== "string") return null;
      const listed = [
        ...(Array.isArray(data.conformed) ? data.conformed : []),
        ...(Array.isArray(data.taken) ? data.taken : []),
      ]
        .map((entry) => entry?.file)
        .filter((each) => typeof each === "string");
      return { file, need: data.need, files: [...new Set(listed)] };
    })
    .filter(Boolean);
}

// The files of the repository's words table: the ones the tool data names for this check, or else
// the file the source of a row about words begins with.
export function wordsFilesOf(root, rows = [], check = null) {
  if (Array.isArray(check?.words)) return check.words.filter((file) => read(root, file) !== null);
  const named = rows
    .filter((row) => WORDS_ROWS.includes(String(row.id)))
    .map((row) => /^[\w@.-]+(?:\/[\w@.-]+)*\.[a-z]+/.exec(String(row.source ?? ""))?.[0])
    .filter((file) => file && read(root, file) !== null);
  return [...new Set(named)];
}

// The repository's own accessibility check, as it configured it: every browser test a row of the
// decisions ledger names as its evidence that runs the accessibility package of the adapter, each
// way it runs it. `unchecked` says why none runs; `problems`, a configuration that cannot be read.
export function ownChecksOf(root, rows = []) {
  const browser = adapterOf("browser");
  const files = [
    ...new Set(
      rows
        .map((row) => /^e2e:(.+)$/.exec(String(row.check ?? ""))?.[1])
        .filter((file) => file && read(root, file) !== null),
    ),
  ];
  const checks = [];
  const problems = [];
  for (const file of files) {
    const configured = browser.accessibility.configured(read(root, file));
    if (configured === null) continue;
    if (configured.problem) {
      problems.push(
        `cannot read how ${file} configures the repository's accessibility check (${configured.problem}), so it does not run with the floating parts open: write its configuration as plain values`,
      );
      continue;
    }
    for (const calls of configured.chains) {
      if (!checks.some((item) => JSON.stringify(item.calls) === JSON.stringify(calls))) {
        checks.push({ file, calls });
      }
    }
  }
  const unchecked =
    problems.length > 0
      ? problems[0]
      : checks.length === 0
        ? `no row of ${LEDGER} names a browser test that runs ${browser.accessibilityPackage}: the repository's own accessibility check does not run with the floating parts open; their names and the item's text are held all the same`
        : null;
  return { checks, problems, unchecked };
}

// The widest width a person listed for the screens.
function widthOf(root) {
  const widths = parsed(read(root, SIZES_FILE))?.widths;
  const listed = Array.isArray(widths) ? widths.map(Number).filter((width) => width > 0) : [];
  return listed.length > 0 ? Math.max(...listed) : WIDTH;
}

// The screens each record's files reach, as the change map traces them: a record the map cannot
// trace reaches every screen. A file no screen imports reaches none.
function reachedBy(root, record, screens) {
  const reached = affectedBy(root, record.files);
  const blind = reached.why.filter((item) => item.reason !== NOT_A_SCREEN_FILE);
  if (blind.length > 0) return screens.map((screen) => screen.id);
  return reached.screens.map((screen) => screen.id);
}

// Everything the browser test needs, read from the repository as it is: each screen to open, with
// the records it uses and their strings; the words table; the repository's own check.
export function floatingPlanOf(root) {
  const theme = parsed(read(root, "design/theme.json")) ?? {};
  const check =
    Object.values(theme.checks ?? {})
      .flat()
      .find((item) => item?.kind === FLOATING_CHECK.kind) ?? null;
  const ledgerText = read(root, LEDGER);
  const rows = ledgerText === null ? [] : parseLedger(ledgerText);
  const files = wordsFilesOf(root, rows, check);
  const words = {
    files,
    entries: [...new Set(files.flatMap((file) => wordsEntries(read(root, file), file)))],
  };
  const own = ownChecksOf(root, rows);
  const records = conformRecords(root);
  const plan = {
    screens: [],
    words,
    checks: own.checks,
    unchecked: own.unchecked,
    problems: own.problems,
    width: widthOf(root),
  };
  if (records.length === 0) return plan;
  const map = screensOf(root, theme);
  const screens = map.screens ?? [];
  const uses = new Map();
  for (const record of records) {
    for (const id of reachedBy(root, record, screens)) {
      uses.set(id, [...(uses.get(id) ?? []), record]);
    }
  }
  const stringsOf = (file) => itemStrings(read(root, file) ?? "").map((text) => ({ file, text }));
  plan.screens = screens
    .filter((screen) => uses.has(screen.id))
    .map((screen) => ({
      id: screen.id,
      route: screen.route,
      records: uses.get(screen.id).map((record) => record.file),
      strings: uses.get(screen.id).flatMap((record) => record.files.flatMap(stringsOf)),
    }));
  return plan;
}

// ---- in the page: each a function the browser runs on its own ------------------------------------

// Every control that says it opens a floating part, in the order of the page: what it is called,
// what it says, whether it is shown, and why it is not pressed (a link, a form's submit, disabled).
function listControls(selector) {
  const { document } = globalThis;
  const text = (value) =>
    String(value ?? "")
      .replace(/\s+/g, " ")
      .trim();
  const shown = (node) =>
    node.checkVisibility({ checkVisibilityCSS: true }) && node.getClientRects().length > 0;
  const nameOf = (node) => {
    const by = (node.getAttribute("aria-labelledby") ?? "")
      .split(/\s+/)
      .filter(Boolean)
      .map((id) => document.getElementById(id)?.textContent ?? "")
      .join(" ");
    return (
      text(by) ||
      text(node.getAttribute("aria-label")) ||
      text(node.textContent) ||
      text(node.getAttribute("title")) ||
      text(node.getAttribute("placeholder"))
    );
  };
  return [...document.querySelectorAll(selector)].map((node, index) => {
    const popup = node.getAttribute("aria-haspopup");
    const says =
      popup !== null && popup !== "false" ? `aria-haspopup="${popup}"` : 'aria-expanded="false"';
    const link = node.matches("a[href], area[href]");
    const submits = Boolean(node.form) && ["submit", "image"].includes(node.type);
    const disabled = node.matches(":disabled") || node.getAttribute("aria-disabled") === "true";
    const skip = link ? "link" : submits ? "submit" : disabled ? "disabled" : null;
    return { index, name: nameOf(node), says, shown: shown(node), skip };
  });
}

// Lets what is changing finish: the page quiet for a while, then every animation that ends.
async function settleIn({ quiet, most }) {
  const { document, MutationObserver, setTimeout, clearTimeout } = globalThis;
  await new Promise((done) => {
    let timer = null;
    const finish = () => {
      observer.disconnect();
      clearTimeout(timer);
      clearTimeout(limit);
      done();
    };
    const observer = new MutationObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(finish, quiet);
    });
    const limit = setTimeout(finish, most);
    observer.observe(document, {
      subtree: true,
      childList: true,
      attributes: true,
      characterData: true,
    });
    timer = setTimeout(finish, quiet);
  });
  await Promise.all(
    document
      .getAnimations()
      .filter((animation) => animation.effect?.getTiming().iterations !== Infinity)
      .map((animation) => animation.finished.catch(() => undefined)),
  );
}

// Every form keeps its data: a submit on this page is stopped before it leaves.
function holdForms() {
  const { document } = globalThis;
  document.addEventListener("submit", (event) => event.preventDefault(), true);
}

// Remembers what is shown now and which control is about to be pressed.
function remember({ selector, index }) {
  const { document } = globalThis;
  const shown = (node) =>
    node.checkVisibility({ checkVisibilityCSS: true }) && node.getClientRects().length > 0;
  globalThis.__floatingShown = new Set([...document.querySelectorAll("*")].filter(shown));
  globalThis.__floatingControl = document.querySelectorAll(selector)[index] ?? null;
}

// What the press opened: every element shown now and not before, the parts of a named role among
// them with their names, and whether the control now says it is expanded.
function readOpened(roles) {
  const { document } = globalThis;
  const text = (value) =>
    String(value ?? "")
      .replace(/\s+/g, " ")
      .trim();
  const shown = (node) =>
    node.checkVisibility({ checkVisibilityCSS: true }) && node.getClientRects().length > 0;
  const before = globalThis.__floatingShown ?? new Set();
  const fresh = [...document.querySelectorAll("*")].filter(
    (node) => shown(node) && !before.has(node),
  );
  const authored = (node) => {
    const by = (node.getAttribute("aria-labelledby") ?? "")
      .split(/\s+/)
      .filter(Boolean)
      .map((id) => document.getElementById(id)?.textContent ?? "")
      .join(" ");
    return text(by) || text(node.getAttribute("aria-label")) || text(node.getAttribute("title"));
  };
  const parts = fresh
    .map((node) => ({
      node,
      role: node.getAttribute("role") ?? (node.tagName === "DIALOG" ? "dialog" : null),
    }))
    .filter((item) => roles.includes(item.role))
    .map((item) => ({ role: item.role, name: authored(item.node) }));
  const expanded = globalThis.__floatingControl?.getAttribute("aria-expanded") === "true";
  return { any: fresh.length > 0 || expanded, parts };
}

// Every text on the page a person reads or hears: what is shown, line by line; what the live
// regions say; and the names and descriptions written on every shown element.
function readSaid() {
  const { document } = globalThis;
  const text = (value) =>
    String(value ?? "")
      .replace(/\s+/g, " ")
      .trim();
  const shown = (node) =>
    node.checkVisibility({ checkVisibilityCSS: true }) && node.getClientRects().length > 0;
  const said = String(document.body.innerText ?? "").split("\n");
  for (const node of document.querySelectorAll(
    '[role="status"], [role="alert"], [role="log"], [aria-live]',
  )) {
    said.push(node.textContent);
  }
  const named = [
    "aria-label",
    "aria-description",
    "aria-roledescription",
    "aria-placeholder",
    "aria-valuetext",
    "alt",
    "title",
    "placeholder",
  ];
  for (const node of document.querySelectorAll("*")) {
    if (!shown(node)) continue;
    for (const name of named) {
      const value = node.getAttribute(name);
      if (value) said.push(value);
    }
  }
  return [...new Set(said.map(text).filter(Boolean))];
}

// ---- the walk -----------------------------------------------------------------------------------

// The screen loaded afresh, settled, with its forms held.
async function load(page, route) {
  await page.goto(route);
  await page.evaluate(settleIn, SETTLE);
  await page.evaluate(holdForms);
}

const WHY_NOT = {
  link: "it is a link, and this check follows none",
  submit: "it would submit a form, and this check submits none",
  disabled: "it is disabled",
};

// Presses one control, and the down arrow when a press opens nothing. What opened, and whether the
// page went elsewhere.
async function press(page, index) {
  await page.evaluate(remember, { selector: CONTROLS, index });
  const handle = (
    await page.evaluateHandle(
      ({ selector, at }) => globalThis.document.querySelectorAll(selector)[at],
      {
        selector: CONTROLS,
        at: index,
      },
    )
  ).asElement();
  const from = page.url();
  try {
    await handle.click({ timeout: PRESS_MS });
  } catch (error) {
    return { pressed: false, why: String(error?.message ?? error).split("\n")[0] };
  }
  await page.evaluate(settleIn, SETTLE_PRESS);
  if (page.url() !== from) return { pressed: true, left: new globalThis.URL(page.url()).pathname };
  let opened = await page.evaluate(readOpened, NAMED_ROLES);
  if (!opened.any) {
    await handle.focus().catch(() => undefined);
    await page.keyboard.press("ArrowDown");
    await page.evaluate(settleIn, SETTLE_PRESS);
    opened = await page.evaluate(readOpened, NAMED_ROLES);
  }
  return { pressed: true, opened };
}

// What is wrong on one screen, one line each, and what was not opened and why. `run`, given the
// page, runs the repository's own accessibility check and gives one line per violation; null where
// the repository has none.
export async function checkScreen(page, screen, plan, { run = null } = {}) {
  const at = `screen ${screen.id} (${screen.route})`;
  const problems = [...(plan.problems ?? []).map((line) => `${at}: ${line}`)];
  const notes = [];
  const seen = new Set();
  const text = (said, who = null) =>
    ownTextProblems(at, said, screen.strings ?? [], plan.words, { who, seen });
  await load(page, screen.route);
  const controls = await page.evaluate(listControls, CONTROLS);
  problems.push(...text(await page.evaluate(readSaid)));
  const hidden = controls.filter((control) => !control.shown).length;
  if (hidden > 0) {
    notes.push(
      `${at}: ${hidden} control(s) that say they open a floating part are not shown on the screen as it stands, and were not opened: one level only`,
    );
  }
  const opened = [];
  for (const control of controls.filter((item) => item.shown)) {
    const who = `the control «${control.name || control.says}»`;
    if (control.skip) {
      notes.push(`${at}: ${who} was not opened: ${WHY_NOT[control.skip]}`);
      continue;
    }
    await load(page, screen.route);
    const again = await page.evaluate(listControls, CONTROLS);
    if (again.length !== controls.length || again[control.index]?.name !== control.name) {
      problems.push(
        `${at}: the screen was not the same when it was loaded again, so ${who} could not be found to press. Make the screen as it stands the same on every load`,
      );
      continue;
    }
    const done = await press(page, control.index);
    if (!done.pressed) {
      problems.push(`${at}: ${who} could not be pressed (${done.why})`);
      continue;
    }
    if (done.left) {
      notes.push(`${at}: ${who} took the page to ${done.left}, and was not checked further`);
      continue;
    }
    if (!done.opened.any) {
      problems.push(
        `${at}: ${who} says it opens a floating part (${control.says}), and neither a click nor the down arrow opened anything. Make it open on a click, or take ${control.says} off a control that opens nothing`,
      );
      continue;
    }
    opened.push(`«${control.name || control.says}»`);
    for (const part of done.opened.parts.filter((item) => item.name === "")) {
      problems.push(
        `${at}: ${who} opens a ${part.role} with no accessible name. Name it with aria-label, or with aria-labelledby pointing at its title`,
      );
    }
    problems.push(...text(await page.evaluate(readSaid), who));
    if (run) {
      for (const line of await run(page)) {
        problems.push(
          `${at}, with ${who} open: the repository's accessibility check found ${line}`,
        );
      }
    }
  }
  notes.unshift(
    opened.length > 0
      ? `${at}: opened ${opened.length} control(s): ${opened.join(", ")}`
      : `${at}: opened no control: none on the screen as it stands says it opens a floating part and could be pressed`,
  );
  return { problems: [...new Set(problems)], notes };
}

// ---- for the gate, for the writers and for the question of intake -------------------------------

// Whether the repository lists the test browser of the adapter among its packages: where its
// browser tests run, and so where the browser test of the floating parts can.
export function hasTestBrowser(root) {
  const data = parsed(read(root, "package.json")) ?? {};
  const listed = { ...data.dependencies, ...data.devDependencies };
  return adapterOf("browser").testPackage in listed;
}

// Why the browser test cannot hold the floating parts, or null: with a conform record, the test is
// there and calls this check.
export function floatingFilesProblem({ records, test }, testFile = FLOATING_TEST) {
  if (records === 0) return null;
  const held = `${records} conform record${records === 1 ? "" : "s"}`;
  if (test === null || test === undefined) {
    return `${testFile} is missing: it is the browser test that opens the floating parts of the items of ${held} on the screens that use them. Write it again (upgrade writes it where it is missing)`;
  }
  if (!test.includes(FLOATING_CALL)) {
    return `${testFile} does not call ${FLOATING_CALL}: the floating parts of the items of ${held} are not opened`;
  }
  return null;
}

// What the question of intake says of the gate, for an item of an outside source: the browser test
// opens its floating parts, and whether the repository's own check runs with them open.
export function gateWords(root) {
  const ledgerText = read(root, LEDGER);
  const own = ownChecksOf(root, ledgerText === null ? [] : parseLedger(ledgerText));
  const test = read(root, FLOATING_TEST);
  const opens =
    test !== null && test.includes(FLOATING_CALL)
      ? `once taken in, the gate's browser test (${FLOATING_TEST}) opens each floating part of it on the screens that use it, one level only: each dialog, menu or list box it opens must have a name, and its own text on the screen must be in the repository's words table`
      : `the gate does not open its floating parts: ${FLOATING_TEST} is missing (upgrade writes it)`;
  const check =
    own.checks.length > 0
      ? `; the repository's own accessibility check (${[...new Set(own.checks.map((item) => item.file))].join(", ")}) runs with each part open`
      : test !== null
        ? `; ${own.unchecked}`
        : "";
  return `${opens}${check}`;
}
