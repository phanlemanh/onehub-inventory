// The ledger of screens joined with the domain model of the repository it is in. The ledger says
// what each screen shows, the action a role must hold to open it and the actions it has buttons
// for; the model (its entities, actions and roles) says who may do what. The check fails where an
// action is offered to nobody who may run it, where a screen shows a record to a role that may not
// view it, and where a button is one no role that opens the screen may press. Nothing of the model
// is kept here: every name is read from the repository being checked.
//
// Usage: node tools/design-assembly/screen-actions.mjs [--target DIR] [--keys entry=…,actions=…]
//          [--overlay FILE.json] [--table] [--json]
// Read-only: it never writes, in this repository or the one it reads.
import { existsSync, readdirSync, readFileSync, realpathSync } from "node:fs";
import path from "node:path";
import { argv, cwd, exit, stdout } from "node:process";
import { fileURLToPath } from "node:url";

import { ledgerText } from "./screen-fragments.mjs";
import { readScreenLedger } from "./screen-ledger.mjs";
import { readYaml } from "./yaml.mjs";

export const MODEL = "ontology";
const LIFECYCLE = ["create", "query", "update", "delete"];
// The keys of the ledger this check reads, as the contract names them. A repository that already
// spells them its own way says so in the ledger, under `keys`.
export const KEYS = {
  entry: "entry",
  actions: "actions",
  shows: "shows",
  frame: "frame",
  no_screen: "no_screen",
};
export const FRAME = "(frame)";

const list = (value) => (Array.isArray(value) ? value.map(String) : []);
const named = (value) =>
  value === null || value === undefined || value === "" || value === "null" ? null : String(value);
const join = (names) => names.join(", ");

// The model as the files of the repository have it: actions, roles, and each entity by the name of
// its file. A file that is not there reads as nothing.
export function readModel(root, folder = MODEL) {
  const read = (file) => {
    const full = path.join(root, folder, file);
    return existsSync(full) ? readYaml(readFileSync(full, "utf8")) : null;
  };
  const entitiesFolder = path.join(root, folder, "entities");
  const entities = existsSync(entitiesFolder)
    ? Object.fromEntries(
        readdirSync(entitiesFolder)
          .filter((file) => file.endsWith(".yaml") && !file.startsWith("_"))
          .sort()
          .map((file) => [
            file.replace(/\.yaml$/, ""),
            readYaml(readFileSync(path.join(entitiesFolder, file), "utf8")),
          ]),
      )
    : {};
  const actions = read("actions.yaml");
  return {
    present: actions !== null,
    actions: Array.isArray(actions?.actions) ? actions.actions : [],
    roles: Array.isArray(read("roles.yaml")?.roles) ? read("roles.yaml").roles : [],
    entities,
  };
}

// The model as data: each action with the roles that hold it, and each entity with its lifecycle
// (the choices it records for what no action does; absent in a repository that has none).
export function modelOf({ actions = [], roles = [], entities = {} }) {
  const roleNames = roles.map((role) => String(role.name));
  const inherits = Object.fromEntries(
    roles.map((role) => [String(role.name), list(role.inherits)]),
  );
  // A role holds what it is given, and what every role it inherits from is given.
  const holds = (role, given) => {
    const seen = new Set();
    const todo = [role];
    while (todo.length > 0) {
      const current = todo.pop();
      if (given.includes(current)) return true;
      if (!seen.has(current)) {
        seen.add(current);
        todo.push(...(inherits[current] ?? []));
      }
    }
    return false;
  };
  return {
    roles: roleNames,
    actions: actions
      .filter((action) => action && action.name)
      .map((action) => {
        // Who may run an action, written either way: a list of roles, or one scope per role.
        const given = [
          ...list(action.roles),
          ...(action.scope && typeof action.scope === "object" ? Object.keys(action.scope) : []),
        ];
        return {
          name: String(action.name),
          entity: named(action.entity),
          kind: String(action.kind ?? "command"),
          planned: action.status === "planned",
          holders: roleNames.filter((role) => holds(role, given)),
        };
      }),
    entities: Object.fromEntries(
      Object.entries(entities).map(([name, data]) => [
        name,
        {
          lifecycle:
            data?.lifecycle && typeof data.lifecycle === "object" && !Array.isArray(data.lifecycle)
              ? data.lifecycle
              : {},
        },
      ]),
    ),
  };
}

// What the ledger offers: each screen that declares what it shows, its entry or its buttons; the
// frame around every screen; and the actions the ledger says have no screen.
export function offersOf(ledger, keys = {}) {
  const k = {
    ...KEYS,
    ...(ledger?.keys && typeof ledger.keys === "object" ? ledger.keys : {}),
    ...keys,
  };
  const screens = (Array.isArray(ledger?.screens) ? ledger.screens : [])
    .filter((screen) => screen && [k.entry, k.actions, k.shows].some((key) => key in screen))
    .map((screen) => ({
      id: String(screen.id),
      status: String(screen.status ?? "built"),
      entry: named(screen[k.entry]),
      shows: list(screen[k.shows]),
      actions: list(screen[k.actions]),
    }));
  const frame = ledger?.[k.frame];
  if (frame && typeof frame === "object" && !Array.isArray(frame)) {
    screens.push({
      id: FRAME,
      status: "built",
      entry: null,
      shows: list(frame[k.shows]),
      actions: list(frame[k.actions]),
    });
  }
  const noScreen = ledger?.[k.no_screen];
  return {
    declared: screens.length > 0,
    screens,
    noScreen: noScreen && typeof noScreen === "object" && !Array.isArray(noScreen) ? noScreen : {},
  };
}

// The entity whose actions decide who sees `name`: itself, or the one it lives by.
function rootOf(model, name) {
  const seen = new Set();
  let current = name;
  while (model.entities[current]?.lifecycle?.via && !seen.has(current)) {
    seen.add(current);
    current = String(model.entities[current].lifecycle.via);
  }
  return current;
}

function helpers(model) {
  const byName = Object.fromEntries(model.actions.map((action) => [action.name, action]));
  const openers = (screen) =>
    screen.entry === null ? model.roles : (byName[screen.entry]?.holders ?? []);
  const viewers = (entity) => {
    const root = rootOf(model, entity);
    const queries = model.actions.filter(
      (action) => action.entity === root && action.kind === "query",
    );
    return queries.length === 0 ? null : [...new Set(queries.flatMap((action) => action.holders))];
  };
  // A screen offers an action that is its entry or one of its buttons; a query is offered too
  // where the entity it reads is shown.
  const offeredOn = (action, screen) =>
    screen.actions.includes(action.name) ||
    screen.entry === action.name ||
    (action.kind === "query" &&
      action.entity !== null &&
      screen.shows.some((shown) => rootOf(model, shown) === action.entity));
  return { byName, openers, viewers, offeredOn };
}

// Every way the ledger and the model disagree, and every debt either records. A ledger that
// declares none of it, or a repository without actions, is not checked.
export function screenActions(offers, model) {
  const problems = [];
  const debts = [];
  if (!offers.declared) return { problems, debts };
  const { byName, openers, viewers, offeredOn } = helpers(model);
  const where = (screen) => (screen.id === FRAME ? "the frame" : `screen ${screen.id}`);

  for (const screen of offers.screens) {
    if (screen.entry !== null && !byName[screen.entry]) {
      problems.push({
        rule: "unknown",
        screen: screen.id,
        action: screen.entry,
        text: `${where(screen)} opens with ${screen.entry}, which the model has no action for`,
      });
    }
    for (const name of screen.actions.filter((item) => !byName[item])) {
      problems.push({
        rule: "unknown",
        screen: screen.id,
        action: name,
        text: `${where(screen)} has a button for ${name}, which the model has no action for`,
      });
    }
    // What a screen shows is seen only by roles that may view it.
    for (const entity of screen.shows) {
      if (!model.entities[entity]) {
        problems.push({
          rule: "unknown",
          screen: screen.id,
          entity,
          text: `${where(screen)} shows ${entity}, which the model has no entity for`,
        });
        continue;
      }
      const root = rootOf(model, entity);
      const may = viewers(entity);
      if (may === null) {
        const answer = model.entities[root]?.lifecycle?.query;
        // Planned for later: listed below with the debts of the model.
        if (answer?.later) continue;
        const said = answer?.never
          ? `the model says ${root} is never viewed (${answer.never})`
          : `the model has no query action for ${root}`;
        problems.push({
          rule: "unseen",
          screen: screen.id,
          entity,
          roles: openers(screen),
          text: `${where(screen)} shows ${entity}, but ${said}`,
        });
        continue;
      }
      const shut = openers(screen).filter((role) => !may.includes(role));
      if (shut.length > 0) {
        problems.push({
          rule: "unseen",
          screen: screen.id,
          entity,
          roles: shut,
          text: `${where(screen)} shows ${entity} to ${join(shut)}, who may not view it: open the screen with a query action of ${root}, or take ${entity} off it`,
        });
      }
    }
    // Every button is one some role that opens the screen may press.
    for (const name of screen.actions.filter((item) => byName[item])) {
      if (!openers(screen).some((role) => byName[name].holders.includes(role))) {
        problems.push({
          rule: "unreachable",
          screen: screen.id,
          action: name,
          text: `${where(screen)} has a button for ${name}, but no role that opens it may run ${name}`,
        });
      }
    }
  }

  // The ledger's own list of actions that have no screen.
  for (const [name, answer] of Object.entries(offers.noScreen)) {
    const action = byName[name];
    const on = action ? offers.screens.filter((screen) => offeredOn(action, screen)) : [];
    const fail = (text) => problems.push({ rule: "ledger", action: name, text });
    if (!action) fail(`no_screen.${name}: the model has no action ${name}`);
    else if (
      !answer ||
      typeof answer !== "object" ||
      Boolean(answer.later) === Boolean(answer.never)
    ) {
      fail(`no_screen.${name}: give either later: <where> or never: <reason> with decided_by`);
    } else if (answer.never && !answer.decided_by) {
      fail(
        `no_screen.${name}: never needs decided_by, the person who decided, never the agent that wrote the file`,
      );
    } else if (on.length > 0) {
      fail(
        `no_screen.${name} is out of date: ${join(on.map((screen) => screen.id))} now offers it, remove the entry`,
      );
    } else if (answer.later) {
      debts.push({ action: name, text: `${name} has no screen yet: later (${answer.later})` });
    }
  }

  // Every action of the model is offered to every role that may run it.
  for (const action of model.actions) {
    if (action.name in offers.noScreen || action.holders.length === 0) continue;
    const reach = (screens) =>
      new Set(
        screens
          .filter((screen) => offeredOn(action, screen))
          .flatMap((screen) => openers(screen).filter((role) => action.holders.includes(role))),
      );
    const any = reach(offers.screens);
    const built = reach(offers.screens.filter((screen) => screen.status === "built"));
    const missing = action.holders.filter((role) => !any.has(role));
    if (missing.length > 0) {
      const what = action.entity ? ` (${action.kind} of ${action.entity})` : "";
      const some = missing.length === action.holders.length ? "" : "that opens ";
      problems.push({
        rule: "unoffered",
        action: action.name,
        roles: missing,
        text: `${action.name}${what} is offered on no screen ${some}to ${join(missing)}: add a button to a screen they open, or list it under no_screen with later or never`,
      });
    } else if (action.holders.some((role) => !built.has(role))) {
      debts.push({
        action: action.name,
        text: `${action.name} is offered only on a planned screen`,
      });
    } else if (action.planned) {
      debts.push({
        action: action.name,
        text: `${action.name} has its button declared, and the model marks it planned`,
      });
    }
  }

  // What the model plans for later, with the screens that show the entity.
  for (const [entity, { lifecycle }] of Object.entries(model.entities)) {
    for (const kind of LIFECYCLE) {
      const answer = lifecycle?.[kind];
      if (!answer?.later) continue;
      const shown = offers.screens
        .filter((screen) => screen.shows.some((name) => rootOf(model, name) === entity))
        .map((screen) => screen.id);
      debts.push({
        entity,
        kind,
        text: `${entity}: ${kind} later (${answer.later}); ${shown.length > 0 ? `shown on ${join(shown)}` : "no screen shows it"}`,
      });
    }
  }
  return { problems, debts };
}

// The answer the ledger now gives: for each screen and role, whether it opens, what is seen there
// and which buttons there are.
export function screenTable(offers, model) {
  const { byName, openers, viewers } = helpers(model);
  return offers.screens.flatMap((screen) =>
    model.roles.map((role) => {
      const opens = openers(screen).includes(role);
      return {
        screen: screen.id,
        status: screen.status,
        role,
        opens,
        sees: opens ? screen.shows.filter((entity) => (viewers(entity) ?? []).includes(role)) : [],
        buttons: opens ? screen.actions.filter((name) => byName[name]?.holders.includes(role)) : [],
      };
    }),
  );
}

// For the gate: what is wrong, in one line, or null. The ledger is text; the model is read data.
export function screenActionsProblem(ledgerText, read, file = "design/screens.yaml") {
  if (ledgerText === null || ledgerText === undefined || !read?.present) return null;
  const { problems } = screenActions(offersOf(readScreenLedger(ledgerText)), modelOf(read));
  if (problems.length === 0) return null;
  const more = problems.length > 3 ? `; and ${problems.length - 3} more` : "";
  return `${file} and ${MODEL}/ disagree: ${problems
    .slice(0, 3)
    .map((problem) => problem.text)
    .join("; ")}${more}`;
}

// For the gate: the debts to list on every run.
export function screenActionsDebts(ledgerText, read) {
  if (ledgerText === null || ledgerText === undefined || !read?.present) return [];
  return screenActions(offersOf(readScreenLedger(ledgerText)), modelOf(read)).debts.map(
    (debt) => debt.text,
  );
}

function main(args) {
  const value = (flag) => (args.includes(flag) ? args[args.indexOf(flag) + 1] : null);
  const root = path.resolve(value("--target") ?? cwd());
  const keys = Object.fromEntries(
    (value("--keys") ?? "")
      .split(",")
      .filter(Boolean)
      .map((pair) => pair.split("=")),
  );
  // The ledger in whichever shape the repository keeps it: one file, or one file per screen.
  const ledger = readScreenLedger(ledgerText(root)) ?? { screens: [] };
  // A measure may add, outside the repository it reads, what that repository does not declare.
  const overlay = value("--overlay");
  if (overlay) {
    const extra = JSON.parse(readFileSync(overlay, "utf8"));
    for (const screen of ledger.screens) Object.assign(screen, extra.screens?.[screen.id] ?? {});
    for (const [key, item] of Object.entries(extra)) {
      if (key !== "screens" && key !== "about") ledger[key] = item;
    }
  }
  const read = readModel(root);
  const offers = offersOf(ledger, keys);
  const model = modelOf(read);
  const result = read.present ? screenActions(offers, model) : { problems: [], debts: [] };
  if (args.includes("--json")) {
    stdout.write(`${JSON.stringify({ ...result, table: screenTable(offers, model) }, null, 2)}\n`);
    return 0;
  }
  if (!read.present)
    stdout.write("screen-actions: the repository declares no actions; nothing to join\n");
  else if (!offers.declared) {
    stdout.write(
      "screen-actions: the ledger of screens declares no screen's entry, buttons or what it shows; nothing to join\n",
    );
  }
  if (args.includes("--table")) {
    for (const row of screenTable(offers, model).filter((item) => item.opens)) {
      stdout.write(
        `  ${row.screen} · ${row.role}: sees ${join(row.sees) || "nothing"}; buttons ${join(row.buttons) || "none"}\n`,
      );
    }
  }
  for (const problem of result.problems) stdout.write(`✗ [${problem.rule}] ${problem.text}\n`);
  for (const debt of result.debts) stdout.write(`… debt: ${debt.text}\n`);
  stdout.write(
    `screen-actions: ${result.problems.length} problems, ${result.debts.length} debts\n`,
  );
  return result.problems.length > 0 ? 1 : 0;
}

if (argv[1] && realpathSync(argv[1]) === realpathSync(fileURLToPath(import.meta.url))) {
  exit(main(argv.slice(2)));
}
