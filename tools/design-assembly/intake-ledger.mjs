// The intake ledger: one entry per block a repository took in, saying what it is, where it came
// from and at which pin, which need it answers, and who approved it on which day. A need has one
// answer, so two entries for one need are wrong; kept as one file per block, the file is named
// after the need and that holds by itself. Text in and data out: nothing here reads a disk.
import { readYaml } from "./yaml.mjs";

export const INTAKE_LEDGER = "design/intake.yaml";
export const INTAKE_VERSION = 1;

// The keys of the contract, the list included. A repository that already spells them its own way
// says so in the ledger, under `keys`: `{ blocks: <its list>, need: <its key>, ... }`.
export const INTAKE_KEYS = [
  "blocks",
  "name",
  "file",
  "source",
  "need",
  "description",
  "record",
  "approved",
  "approved_by",
  "pin",
];

const isMap = (value) => value !== null && typeof value === "object" && !Array.isArray(value);

// A spelling the reader can take for a key: the ledgers' reader reads no other.
const PLAIN_KEY = /^[\w-]+$/;

// The repository's own spelling of each key of the contract, the contract's where it has none, or
// where it gives one the reader cannot read as a key.
export function spellingOf(data) {
  const own = isMap(data?.keys) ? data.keys : {};
  return Object.fromEntries(
    INTAKE_KEYS.map((key) => [
      key,
      typeof own[key] === "string" && PLAIN_KEY.test(own[key]) ? own[key] : key,
    ]),
  );
}

// What is wrong with the spelling a ledger gives: a spelling the reader cannot read as a key, and
// two keys of the contract spelled one way, which would read as one.
export function spellingProblems(data) {
  const own = isMap(data?.keys) ? data.keys : {};
  const problems = INTAKE_KEYS.filter(
    (key) => key in own && !(typeof own[key] === "string" && PLAIN_KEY.test(own[key])),
  ).map(
    (key) =>
      `keys spells ${key} as ${JSON.stringify(own[key])}, which the reader cannot read as a key: use letters, digits, _ and -`,
  );
  const spelled = spellingOf(data);
  const seen = new Map();
  for (const key of INTAKE_KEYS) seen.set(spelled[key], [...(seen.get(spelled[key]) ?? []), key]);
  for (const [as, keys] of seen) {
    if (keys.length > 1) {
      problems.push(
        `keys spells ${keys.join(" and ")} both as ${as}: each key of the contract needs a spelling of its own`,
      );
    }
  }
  return problems;
}

// The list a text keeps its blocks under, and the key each block is named by: what the fragments
// of the ledger are cut by.
export function intakeList(text) {
  const spelled = spellingOf(readYaml(text ?? ""));
  return { list: spelled.blocks, name: spelled.need };
}

// The ledger as data in the contract's keys: its version, the repository's spelling, and every
// block with its keys named as the contract names them; keys of the repository's own are kept as
// they are. Null when there is no text.
export function readIntakeLedger(text) {
  if (text === null || text === undefined) return null;
  const data = readYaml(text);
  const spelled = spellingOf(data);
  const back = Object.fromEntries(Object.entries(spelled).map(([key, own]) => [own, key]));
  const { [spelled.blocks]: blocks, ...rest } = data;
  const version = rest.version;
  const listed = Array.isArray(blocks)
    ? blocks.map((block) =>
        isMap(block)
          ? Object.fromEntries(
              Object.entries(block).map(([key, value]) => [back[key] ?? key, value]),
            )
          : block,
      )
    : blocks;
  return {
    ...rest,
    ...(version === undefined
      ? {}
      : { version: /^\d+$/.test(version) ? Number(version) : version }),
    ...(spelled.blocks in data ? { blocks: listed } : {}),
    spelled,
  };
}

// The repository's spelling as the one line a fragment is read with, or nothing when it spells
// every key the contract's way.
export function keysLine(spelled) {
  const own = Object.entries(spelled ?? {}).filter(([key, value]) => key !== value);
  if (own.length === 0) return "";
  return `keys: { ${own.map(([key, value]) => `${key}: ${value}`).join(", ")} }\n`;
}

// The needs answered by more than one block, each once.
export function repeatedNeeds(ledger) {
  const needs = (Array.isArray(ledger?.blocks) ? ledger.blocks : [])
    .map((block) => block?.need)
    .filter((need) => typeof need === "string");
  return [...new Set(needs.filter((need, index) => needs.indexOf(need) !== index))];
}
