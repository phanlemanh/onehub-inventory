// The ledger of screens: every screen of the application, its kind and the names of its states, as
// data every tool reads alike. The code says how each state is reached; this file says what there
// is. The gate holds that the two list the same screens, and the repository's own test that they
// list the same states and titles.
import { readYaml } from "./yaml.mjs";

export const SCREEN_LEDGER = "design/screens.yaml";
export const SCREEN_LEDGER_VERSION = 1;

const HEADER = [
  "# The ledger of screens: every screen of the application, as data every tool reads.",
  "#   id      a stable key for the screen",
  "#   route   the path the application opens it at",
  "#   title   the key of its title among the repository's words, or null",
  "#   family  the `nhom` of the page of its kind under design/patterns, or null",
  "#   status  built (the screen exists) | planned (declared ahead, not built yet)",
  "#   states  the names of the states it shows, as the code that reaches them names them",
  "# The code that reaches each state is the screen list of the application. Keep this file in",
  "# block style.",
];

// The ledger as data: its version, the families it names, and each screen. Null when there is no
// text.
export function readScreenLedger(text) {
  if (text === null || text === undefined) return null;
  const data = readYaml(text);
  const version = data.version;
  return {
    ...data,
    ...(version === undefined
      ? {}
      : { version: /^\d+$/.test(version) ? Number(version) : version }),
    screens: Array.isArray(data.screens) ? data.screens : [],
  };
}

// The screens that exist, each with its route and the names of its states.
export function builtScreens(ledger) {
  return (ledger?.screens ?? [])
    .filter((screen) => (screen.status ?? "built") === "built")
    .map((screen) => ({
      id: screen.id,
      path: screen.route,
      title: screen.title ?? null,
      family: screen.family ?? null,
      states: Array.isArray(screen.states) ? screen.states.map(String) : [],
    }));
}

const quote = (value) =>
  value === null || value === undefined
    ? "null"
    : /^[\w/.\- ]+$/.test(String(value)) && !/^(null|true|false|~|\d+)$/.test(String(value))
      ? String(value)
      : JSON.stringify(String(value));

// The ledger as the text a person and a formatter both keep.
export function renderScreenLedger({ families = {}, screens = [] }) {
  const lines = [...HEADER, `version: ${SCREEN_LEDGER_VERSION}`];
  const named = Object.entries(families);
  if (named.length > 0) {
    lines.push("families:");
    for (const [key, name] of named) lines.push(`  ${key}: ${quote(name)}`);
  }
  lines.push("statuses:", "  - built", "  - planned", "screens:");
  for (const screen of screens) {
    lines.push(`  - id: ${quote(screen.id)}`);
    lines.push(`    route: ${quote(screen.route)}`);
    lines.push(`    title: ${quote(screen.title)}`);
    lines.push(`    family: ${quote(screen.family)}`);
    lines.push(`    status: ${screen.status ?? "built"}`);
    if ((screen.states ?? []).length > 0) {
      lines.push("    states:");
      for (const state of screen.states) lines.push(`      - ${quote(state)}`);
    }
  }
  return `${lines.join("\n")}\n`;
}
