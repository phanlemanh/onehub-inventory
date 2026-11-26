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
  // For the reusable store: the pinned source a block came from, the hash of its file when it was
  // taken in, a change made on purpose, a block retired or merged into another need; beside the
  // blocks, what was made before the ledger, and how the repository writes a value of the
  // contract. `why` is the reason inside `changed`, `retired` and each entry of `before`.
  "from",
  "taken",
  "changed",
  "retired",
  "merged_into",
  "before",
  "values",
  "why",
  // For choose before make (spec 0015): the conform record of an item of an outside source, and
  // of a block made by hand the words searched and the nearest candidate.
  "conform",
  "searched",
  "nearest",
  // A block of the family core the core retired, the repository's own since (spec 0016, criterion
  // 24): since when, who retired it in the core and why.
  "own",
];

// The keys added for the reusable store. A repository that wrote its ledger before them may spell
// an older key with one of their names, such as `keys: { source: from }`: such a new key then has
// no spelling there, and the ledger reads as it did, until the repository spells it.
const LATER_KEYS = [
  "from",
  "taken",
  "changed",
  "retired",
  "merged_into",
  "before",
  "values",
  "why",
  "conform",
  "searched",
  "nearest",
  "own",
];

// The value of `source` that says a block was made by hand, unless the repository writes it its
// own way under `values`.
export const BY_HAND = "by-hand";

const isMap = (value) => value !== null && typeof value === "object" && !Array.isArray(value);

// A spelling the reader can take for a key: the ledgers' reader reads no other.
const PLAIN_KEY = /^[\w-]+$/;

// The repository's own spelling of each key of the contract, the contract's where it has none, or
// where it gives one the reader cannot read as a key.
export function spellingOf(data) {
  const own = isMap(data?.keys) ? data.keys : {};
  const readable = (key) => typeof own[key] === "string" && PLAIN_KEY.test(own[key]);
  const taken = new Set(INTAKE_KEYS.filter(readable).map((key) => own[key]));
  return Object.fromEntries(
    INTAKE_KEYS.map((key) => [
      key,
      readable(key) ? own[key] : LATER_KEYS.includes(key) && taken.has(key) ? null : key,
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
  for (const key of INTAKE_KEYS.filter((each) => spelled[each] !== null)) {
    seen.set(spelled[key], [...(seen.get(spelled[key]) ?? []), key]);
  }
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
  const back = Object.fromEntries(
    Object.entries(spelled)
      .filter(([, own]) => own !== null)
      .map(([key, own]) => [own, key]),
  );
  // An entry in the contract's keys; the reason inside a change or a retirement is one of them.
  const named = (entry) =>
    isMap(entry)
      ? Object.fromEntries(
          Object.entries(entry).map(([key, value]) => {
            const contract = back[key] ?? key;
            return [contract, NESTED.includes(contract) ? named(value) : value];
          }),
        )
      : entry;
  const inKeys = (list) => (Array.isArray(list) ? list.map(named) : list);
  const hasBefore = spelled.before !== null && spelled.before in data;
  const blocks = data[spelled.blocks];
  const before = hasBefore ? data[spelled.before] : undefined;
  const others = Object.fromEntries(
    Object.entries(data).filter(
      ([key]) => key !== spelled.blocks && !(hasBefore && key === spelled.before),
    ),
  );
  // The other keys beside the blocks, kept as written but for `values`, named as the contract
  // names it.
  const rest = Object.fromEntries(
    Object.entries(others).map(([key, value]) => [back[key] === "values" ? "values" : key, value]),
  );
  const version = rest.version;
  const listed = inKeys(blocks);
  return {
    ...rest,
    ...(hasBefore ? { before: inKeys(before) } : {}),
    ...(version === undefined
      ? {}
      : { version: /^\d+$/.test(version) ? Number(version) : version }),
    ...(spelled.blocks in data ? { blocks: listed } : {}),
    spelled,
  };
}

// The keys of a block that hold an object whose own keys are named by the contract too.
const NESTED = ["changed", "retired", "own"];

// Whether a block of a ledger read in the contract's keys was made by hand: its source is the
// contract's word for that, or the one the ledger gives under `values`.
export function isByHand(ledger, block) {
  const own = isMap(ledger?.values) ? ledger.values[BY_HAND] : undefined;
  return block?.source === (typeof own === "string" ? own : BY_HAND);
}

// The repository's spelling as the one line a fragment is read with, or nothing when it spells
// every key the contract's way.
export function keysLine(spelled) {
  const own = Object.entries(spelled ?? {}).filter(
    ([key, value]) => value !== null && key !== value,
  );
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
